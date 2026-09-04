/**
 * The link a cohort's class actually runs on.
 *
 * What was asked for is a room: press it and the class starts if nobody is
 * there, or you join the one already running. Google Meet will not give you
 * that from a personal Gmail account — `meet.google.com/new` mints a *new*
 * meeting every time it is opened, so ten students pressing it get ten empty
 * calls, and the links that behave like rooms come either from a Calendar
 * event (OAuth, a consent screen, a stored refresh token, a background job to
 * keep it alive) or from a Workspace nickname, which needs a paid domain.
 *
 * So every cohort gets a room of its own that already works this way. The URL
 * *is* the room: first person in starts it, everyone after joins, and it is
 * the same address tomorrow. No account, no setup, nothing to renew.
 *
 * If the admin would rather use Google Meet, they paste a Calendar link into
 * the cohort and it takes over. This is the floor, not the ceiling.
 */

export type CohortRoom = {
  url: string;
  /** True when the admin supplied their own link rather than using the room. */
  custom: boolean;
};

const HOST = "https://meet.jit.si";

export function cohortRoom(cohort: {
  meet_url?: string | null;
  room_slug?: string | null;
}): CohortRoom | null {
  const custom = (cohort.meet_url ?? "").trim();
  if (custom) return { url: custom, custom: true };

  const slug = (cohort.room_slug ?? "").trim();
  if (!slug) return null;

  return { url: `${HOST}/${encodeURIComponent(slug)}`, custom: false };
}

/** A room name from a cohort name, used when one is minted for a new cohort. */
export function roomSlug(name: string, id: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `nectarray-${base || "cohort"}-${id.replace(/-/g, "").slice(0, 8)}`;
}
