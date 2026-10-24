/**
 * fetch for a service that sleeps when idle (Railway serverless), such as
 * the judge and the LaTeX compiler on Nectarray Backend.
 *
 * The first request to a sleeping service wakes it, and Railway says that
 * request may come back as a 502 while the container boots. So a 502, 503 or
 * 504, or a connection that fails outright, is tried again after a short
 * pause, up to three attempts in all. Anything else, including a 4xx, is
 * returned as is.
 *
 * Only for calls that are safe to repeat: running a submission and compiling
 * a resume have no side effects.
 */
export async function wakeFetch(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const pauses = [1500, 3000];
  for (let attempt = 0; ; attempt++) {
    const last = attempt === pauses.length;
    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (last || ![502, 503, 504].includes(response.status)) return response;
    } catch (error) {
      if (last) throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, pauses[attempt]));
  }
}
