/**
 * Joins class names, dropping anything falsy.
 *
 *   cn("card", isOpen && "shadow-lg", disabled ? "opacity-50" : null)
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * A person's name, capitalised the way they would write it.
 *
 * Google hands back whatever the account holds, and plenty of people signed
 * up as "satya prakash" in lower case. Printing that verbatim under a display
 * heading — "Welcome back, satya." — reads as a bug, and it disagreed with
 * every other place the same name appeared. One helper, used everywhere a
 * name is shown, so the greeting and the header always say the same thing.
 *
 * Only all-lower-case words are touched: "McKenzie" and "de Souza" are
 * deliberate spellings, and a formatter that "fixes" them is worse than none.
 */
export function displayName(value: string | null | undefined) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "";
  return trimmed
    .split(/\s+/)
    .map((word) =>
      word === word.toLowerCase()
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word,
    )
    .join(" ");
}
