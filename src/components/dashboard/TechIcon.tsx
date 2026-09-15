import { techIcon } from "@/lib/tech-icons";

/**
 * A brand's own mark, inline with its name — `![](tech:redis) Redis` in a
 * lesson's markdown becomes this rather than the usual screenshot treatment.
 *
 * Renders nothing rather than a broken image when the name has no icon
 * (see tech-icons.ts for which): the tool's name alone still reads fine,
 * and a silent gap is better than a placeholder that looks like a bug.
 */
export function TechIcon({ name }: { name: string }) {
  const icon = techIcon(name);
  if (!icon) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill={`#${icon.hex}`}
      aria-hidden
      className="tech-icon"
    >
      <path d={icon.path} />
    </svg>
  );
}
