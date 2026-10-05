import "server-only";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "crypto";

/**
 * Encryption for the client passwords kept on a project's Passwords sheet.
 *
 * AES-256-GCM with a key made from PROJECT_VAULT_KEY. Without that variable
 * the passwords are stored as typed, and the page says so. If the variable
 * is changed later, passwords saved under the old one can no longer be read.
 */

const PREFIX = "enc:v1:";

function key() {
  const secret = process.env.PROJECT_VAULT_KEY;
  return secret ? createHash("sha256").update(secret).digest() : null;
}

export const vaultReady = () => Boolean(process.env.PROJECT_VAULT_KEY);

export function seal(plain: string): string {
  const k = key();
  if (!k || !plain) return plain;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", k, iv);
  const body = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return PREFIX + [iv, tag, body].map((b) => b.toString("base64")).join(":");
}

/** The password as typed; a placeholder if it cannot be read. */
export function open(stored: string): string {
  if (!stored.startsWith(PREFIX)) return stored;
  const k = key();
  if (!k) return "(locked: PROJECT_VAULT_KEY is not set)";
  try {
    const [iv, tag, body] = stored
      .slice(PREFIX.length)
      .split(":")
      .map((p) => Buffer.from(p, "base64"));
    const decipher = createDecipheriv("aes-256-gcm", k, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(body), decipher.final()]).toString(
      "utf8",
    );
  } catch {
    return "(locked: saved under a different PROJECT_VAULT_KEY)";
  }
}
