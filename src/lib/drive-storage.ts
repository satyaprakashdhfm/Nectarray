import "server-only";
import { createHash } from "node:crypto";
import { AwsClient } from "aws4fetch";
import { siteUrl } from "@/lib/seo";

/**
 * The Drive's storage bucket (Railway, S3-compatible). Files go straight
 * from the browser to the bucket and back on short-lived signed links, so
 * the web app never holds a file in memory and there is no size cap of
 * its own.
 *
 * Configured by the bucket's own variables on the Web service:
 *   DRIVE_BUCKET_ENDPOINT, DRIVE_BUCKET_NAME, DRIVE_BUCKET_REGION,
 *   DRIVE_BUCKET_ACCESS_KEY_ID, DRIVE_BUCKET_SECRET_ACCESS_KEY
 * Without them the Drive says it is not connected and nothing else breaks.
 */

/** How long an upload or download link works. */
const LINK_SECONDS = 15 * 60;

/** The origins a browser may upload from: the site, and local development. */
const ORIGINS = [
  siteUrl,
  siteUrl.replace("https://", "https://www."),
  "http://localhost:3000",
];

type Bucket = { client: AwsClient; base: string };

function bucket(): Bucket | null {
  const endpoint = process.env.DRIVE_BUCKET_ENDPOINT;
  const name = process.env.DRIVE_BUCKET_NAME;
  const accessKeyId = process.env.DRIVE_BUCKET_ACCESS_KEY_ID;
  const secretAccessKey = process.env.DRIVE_BUCKET_SECRET_ACCESS_KEY;
  if (!endpoint || !name || !accessKeyId || !secretAccessKey) return null;
  const url = new URL(endpoint);
  return {
    client: new AwsClient({
      accessKeyId,
      secretAccessKey,
      service: "s3",
      region: process.env.DRIVE_BUCKET_REGION || "auto",
    }),
    // Virtual-hosted style: the bucket is the subdomain of the endpoint.
    base: `${url.protocol}//${name}.${url.host}`,
  };
}

export const driveReady = () => bucket() !== null;

function need(): Bucket {
  const b = bucket();
  if (!b) throw new Error("The Drive's storage bucket is not configured.");
  return b;
}

const objectUrl = (b: Bucket, key: string) =>
  `${b.base}/${key.split("/").map(encodeURIComponent).join("/")}`;

async function signedLink(
  b: Bucket,
  method: "GET" | "PUT",
  key: string,
  query: Record<string, string> = {},
) {
  const url = new URL(objectUrl(b, key));
  url.searchParams.set("X-Amz-Expires", String(LINK_SECONDS));
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);
  const signed = await b.client.sign(url.toString(), {
    method,
    aws: { signQuery: true },
  });
  return signed.url;
}

/*
 * The bucket has to allow the browser's PUT from the site's origin. Set
 * once per running server, before its first upload; setting it again is
 * harmless, so a new deploy or a new bucket needs no manual step.
 */
let corsSet: Promise<void> | null = null;

function ensureCors(b: Bucket) {
  corsSet ??= (async () => {
    const body = `<CORSConfiguration><CORSRule>${ORIGINS.map(
      (o) => `<AllowedOrigin>${o}</AllowedOrigin>`,
    ).join(
      "",
    )}<AllowedMethod>PUT</AllowedMethod><AllowedMethod>GET</AllowedMethod><AllowedHeader>*</AllowedHeader><ExposeHeader>ETag</ExposeHeader><MaxAgeSeconds>3600</MaxAgeSeconds></CORSRule></CORSConfiguration>`;
    const res = await b.client.fetch(`${b.base}/?cors`, {
      method: "PUT",
      body,
      headers: {
        "Content-Type": "application/xml",
        "Content-MD5": createHash("md5").update(body).digest("base64"),
      },
    });
    if (!res.ok) {
      corsSet = null;
      throw new Error(
        `Could not set the bucket's CORS rule: ${res.status} ${await res.text()}`,
      );
    }
  })();
  return corsSet;
}

/** A link the browser PUTs the file to. */
export async function uploadLink(key: string) {
  const b = need();
  await ensureCors(b);
  return signedLink(b, "PUT", key);
}

/**
 * A link that opens the file in the browser when it can show it (PDFs,
 * images, video, text) and downloads it otherwise, under its own name.
 */
export async function downloadLink(
  key: string,
  file: { name: string; type: string },
  download: boolean,
) {
  const inline =
    !download &&
    /^(image|video|audio|text)\/|^application\/pdf$/.test(file.type);
  const filename = encodeURIComponent(file.name);
  return signedLink(need(), "GET", key, {
    "response-content-disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${filename}`,
    "response-content-type": file.type || "application/octet-stream",
  });
}

/** The stored object's size, or null when the bucket does not have it. */
export async function storedSize(key: string): Promise<number | null> {
  const b = need();
  const res = await b.client.fetch(objectUrl(b, key), { method: "HEAD" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Bucket HEAD failed: ${res.status}`);
  return Number(res.headers.get("content-length") ?? 0);
}

export async function deleteObject(key: string) {
  const b = need();
  const res = await b.client.fetch(objectUrl(b, key), { method: "DELETE" });
  // Already gone is as good as deleted.
  if (!res.ok && res.status !== 404)
    throw new Error(`Bucket DELETE failed: ${res.status}`);
}
