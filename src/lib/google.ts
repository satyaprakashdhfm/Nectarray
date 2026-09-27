import "server-only";
import { createSign } from "node:crypto";

/**
 * Read-only access to Google Analytics 4 and Search Console, as the service
 * account in GOOGLE_SERVICE_ACCOUNT_JSON.
 *
 * No Google SDK: a service account signs a short JWT with its own key and
 * trades it for an hour-long access token, which is two dozen lines with
 * node:crypto and not worth a 40 MB dependency.
 *
 * Every call returns { data } or { error } rather than throwing. These feed
 * admin pages, and a permission Google has not granted yet should be a
 * sentence on the page saying so, not a crashed dashboard.
 */

export type Result<T> =
  { data: T; error?: never } | { data?: never; error: string };

const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
].join(" ");

type ServiceAccount = { client_email: string; private_key: string };

function serviceAccount(): ServiceAccount | string {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return "GOOGLE_SERVICE_ACCOUNT_JSON is not set.";
  try {
    const parsed = JSON.parse(raw) as Partial<ServiceAccount>;
    if (!parsed.client_email || !parsed.private_key) {
      return "GOOGLE_SERVICE_ACCOUNT_JSON has no client_email or private_key. Paste the whole key file.";
    }
    return {
      client_email: parsed.client_email,
      // Pasted through a form that escaped the newlines once more.
      private_key: parsed.private_key.replace(/\\n/g, "\n"),
    };
  } catch {
    return "GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON. Paste the whole key file, braces included.";
  }
}

/** The email to grant access to, for the error messages. */
export function serviceAccountEmail(): string | null {
  const account = serviceAccount();
  return typeof account === "string" ? null : account.client_email;
}

let token: { value: string; expires: number } | null = null;

async function accessToken(): Promise<Result<string>> {
  if (token && token.expires > Date.now() + 60_000)
    return { data: token.value };

  const account = serviceAccount();
  if (typeof account === "string") return { error: account };

  const b64 = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const issued = Math.floor(Date.now() / 1000);
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: account.client_email,
    scope: SCOPES,
    aud: "https://oauth2.googleapis.com/token",
    iat: issued,
    exp: issued + 3600,
  })}`;

  let signature: string;
  try {
    signature = createSign("RSA-SHA256")
      .update(unsigned)
      .sign(account.private_key, "base64url");
  } catch {
    return {
      error:
        "The private_key in GOOGLE_SERVICE_ACCOUNT_JSON could not be read.",
    };
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
    cache: "no-store",
  });
  const body = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    error_description?: string;
  };
  if (!response.ok || !body.access_token) {
    return {
      error: `Google refused the service account: ${body.error_description ?? response.status}`,
    };
  }

  token = {
    value: body.access_token,
    expires: Date.now() + (body.expires_in ?? 3600) * 1000,
  };
  return { data: token.value };
}

/*
 * Ten minutes of memory per distinct request. Both APIs have daily quotas,
 * and an admin clicking between service filters should not spend them.
 */
const cache = new Map<string, { at: number; data: unknown }>();
const TTL = 10 * 60_000;

async function call<T>(
  url: string,
  payload: object,
  ttl = TTL,
): Promise<Result<T>> {
  const key = url + JSON.stringify(payload);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ttl) return { data: hit.data as T };

  const auth = await accessToken();
  if (auth.error !== undefined) return { error: auth.error };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth.data}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const body = (await response.json().catch(() => ({}))) as {
    error?: { message?: string };
  };
  if (!response.ok) {
    return {
      error: body.error?.message ?? `Google answered ${response.status}.`,
    };
  }

  cache.set(key, { at: Date.now(), data: body });
  return { data: body as T };
}

// ---------------------------------------------------------------------------
//  Google Analytics 4
// ---------------------------------------------------------------------------

export type Ga4Report = {
  rows?: {
    dimensionValues?: { value: string }[];
    metricValues?: { value: string }[];
  }[];
};

/** Accepts "412345678" or "properties/412345678". */
function ga4Property(): string | null {
  const id = process.env.GA4_PROPERTY_ID?.trim().replace(/^properties\//, "");
  return id || null;
}

/** Up to five reports in one request. */
export async function ga4Reports(
  requests: object[],
): Promise<Result<Ga4Report[]>> {
  const property = ga4Property();
  if (!property) return { error: "GA4_PROPERTY_ID is not set." };
  if (!/^\d+$/.test(property)) {
    return {
      error:
        "GA4_PROPERTY_ID should be the numeric Property ID from GA4 → Admin → Property details, not the G-… measurement ID.",
    };
  }

  const result = await call<{ reports?: Ga4Report[] }>(
    `https://analyticsdata.googleapis.com/v1beta/properties/${property}:batchRunReports`,
    { requests },
  );
  if (result.error !== undefined) return { error: result.error };
  return { data: result.data.reports ?? [] };
}

// ---------------------------------------------------------------------------
//  Search Console
// ---------------------------------------------------------------------------

export type SearchRow = {
  keys?: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export async function searchConsole(
  payload: object,
): Promise<Result<SearchRow[]>> {
  const site = process.env.SEARCH_CONSOLE_SITE_URL?.trim();
  if (!site) return { error: "SEARCH_CONSOLE_SITE_URL is not set." };

  const result = await call<{ rows?: SearchRow[] }>(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
    payload,
  );
  if (result.error !== undefined) return { error: result.error };
  return { data: result.data.rows ?? [] };
}

/** Where the Search Console property lives, for building page URLs. */
export function searchConsoleBase(fallback: string): string {
  const site = process.env.SEARCH_CONSOLE_SITE_URL?.trim() ?? "";
  return site.startsWith("http") ? site.replace(/\/$/, "") : fallback;
}

export type Inspection = {
  inspectionResult?: {
    indexStatusResult?: {
      verdict?: string;
      coverageState?: string;
      lastCrawlTime?: string;
    };
  };
};

/**
 * Whether Google has a page in its index, and when it last read it.
 *
 * Kept for six hours: the URL Inspection API allows 2,000 checks a day per
 * property, and a page's index status does not change by the minute.
 */
export async function inspectUrl(url: string): Promise<Result<Inspection>> {
  const site = process.env.SEARCH_CONSOLE_SITE_URL?.trim();
  if (!site) return { error: "SEARCH_CONSOLE_SITE_URL is not set." };
  return call<Inspection>(
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
    { inspectionUrl: url, siteUrl: site },
    6 * 60 * 60_000,
  );
}

/** YYYY-MM-DD, `days` ago, in India's calendar. */
export function daysAgo(days: number): string {
  const date = new Date(Date.now() - days * 86_400_000);
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}
