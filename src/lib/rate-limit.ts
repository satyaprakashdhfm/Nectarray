import "server-only";

/**
 * A sliding-window counter, in memory.
 *
 * Per instance, which is all there is: Web runs one replica. It is there to
 * stop a script hammering a public form or a paid AI call, not to be exact;
 * if Web ever runs more than one replica this moves to a table with a unique
 * index on (key, minute). The judge keeps its own copy of the same idea.
 */
const hits = new Map<string, number[]>();

/** True when `key` has already used its `max` calls in the last `windowMs`. */
export function limited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  const over = recent.length >= max;
  if (!over) recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 2000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return over;
}

/**
 * The caller's address, as Railway's edge reports it.
 *
 * Headers can be forged by a client that talks to the edge, so a limit keyed
 * on this is paired with a global one wherever money is at stake.
 */
export function clientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export const tooMany = () =>
  Response.json(
    { error: "Too many requests. Wait a few minutes and try again." },
    { status: 429, headers: { "Retry-After": "300" } },
  );
