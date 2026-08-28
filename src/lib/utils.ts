/**
 * Joins class names, dropping anything falsy.
 *
 *   cn("card", isOpen && "shadow-lg", disabled ? "opacity-50" : null)
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
