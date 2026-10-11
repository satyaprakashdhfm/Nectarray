/**
 * What has been chosen on the price sheets, carried to the Estimate tab.
 *
 * Walking a client through the sheets, a ticked row or a chosen model is a
 * decision: the estimate should open with it already picked. Each sheet
 * logs its choices here by option id ("<table id>/<row id>", the ids
 * lib/project-estimate gives its options), and the Estimate tab applies
 * the log once and keeps its own state, so a change made there is not
 * undone by an old tick. Kept in this browser only: it is one person's
 * working session, not shared data.
 */

const KEY = "nectarray-estimate";

export type SavedPick = { on: boolean; option: string; quantity: string };
export type SavedHire = { on: boolean; people: string; monthly: string };

type Store = {
  /** Choices made on the sheets since the Estimate tab last opened. */
  log: { option: string; on: boolean }[];
  estimate?: {
    picks: Record<string, SavedPick>;
    hires: Record<string, SavedHire>;
  };
};

function read(): Store {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Store>) : {};
    return {
      log: Array.isArray(parsed.log) ? parsed.log : [],
      estimate: parsed.estimate,
    };
  } catch {
    // Storage blocked (private window, cleared data): start empty.
    return { log: [] };
  }
}

function write(store: Store) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // Storage blocked: the choice still works on this page, it just is not
    // remembered for the Estimate tab.
  }
}

/** A sheet row ticked or unticked, or a model chosen, by option id. */
export function logChoice(option: string, on: boolean) {
  const store = read();
  write({
    ...store,
    log: [...store.log.filter((e) => e.option !== option), { option, on }],
  });
}

/** The Estimate tab's saved state and the sheet choices waiting for it. */
export function readChoices() {
  return read();
}

/**
 * The Estimate tab's state, with the sheet choices it has now applied
 * cleared. Clearing here rather than on reading means reading twice (as
 * React does in development) applies the same choices both times.
 */
export function saveEstimate(estimate: NonNullable<Store["estimate"]>) {
  write({ log: [], estimate });
}

export function clearEstimate() {
  write({ log: [] });
}
