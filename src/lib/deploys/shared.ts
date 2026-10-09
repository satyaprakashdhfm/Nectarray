import "server-only";

/**
 * What every host's reader (railway.ts, vercel.ts) hands to the board, and
 * the little they share: the states a deploy can be in and how a refused,
 * busy or unreachable host is reported.
 */

export type Host = "railway" | "vercel";

/** active: building or rolling out now. live: running. idle: asleep, removed, canceled. */
export type DeployState = "active" | "failed" | "live" | "idle";

export type ServiceDeploy = {
  /** Unique on the board. */
  key: string;
  host: Host;
  service: string;
  environment: string;
  /** The host's own word for it, e.g. BUILDING or READY. */
  status: string;
  state: DeployState;
  /** When the latest deployment last changed state. */
  at: string;
  /** First line of the commit it deploys, when it came from git. */
  commit: string | null;
  /** The service or deployment on the host's dashboard. */
  href: string;
};

/** A project as one host knows it. */
export type HostProject = {
  host: Host;
  id: string;
  name: string;
  services: ServiceDeploy[];
};

/** unset: no token. token: refused. busy: rate-limited. down: unreachable. */
export type HostProblem = "unset" | "token" | "busy" | "down";

export class HostError extends Error {
  constructor(
    readonly host: Host,
    readonly kind: Exclude<HostProblem, "unset">,
  ) {
    super(`${host}: ${kind}`);
  }
}

const TIMEOUT_MS = 10_000;

/** A request to a host's API with a timeout; HTTP trouble becomes a HostError. */
export async function call(
  host: Host,
  url: string,
  init: RequestInit,
): Promise<{ status: number; ok: boolean; body: unknown }> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    console.error(`[deploys] ${host} request failed:`, error);
    throw new HostError(host, "down");
  }
  if (response.status === 429) throw new HostError(host, "busy");
  if (response.status === 401 || response.status === 403)
    throw new HostError(host, "token");
  const body: unknown = await response.json().catch(() => null);
  return { status: response.status, ok: response.ok, body };
}

/** The first line of a commit message, or null. */
export function firstLine(message: unknown): string | null {
  if (typeof message !== "string") return null;
  const line = message.split("\n")[0].trim();
  return line ? line.slice(0, 120) : null;
}
