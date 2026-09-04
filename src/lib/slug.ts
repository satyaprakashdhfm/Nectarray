/**
 * Slug for a heading.
 *
 * Lives on its own because both sides of the contents list need it — the
 * scanner that reads the markdown source and the renderer that emits the
 * heading elements — and the renderer is a server component while the rail
 * that consumes the result is a client one.
 */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
