import { siGoogle, siZoho } from "simple-icons";

/**
 * A small brand mark before a business-workspace name in the price book,
 * so Google, Microsoft and Zoho rows can be told apart at a glance. Drawn
 * in each brand's own colours (Simple Icons has no Microsoft mark, so its
 * four squares are drawn here). Nothing for any other name.
 */
export function SuiteLogo({ name }: { name: string }) {
  if (/^google( workspace)?\b/i.test(name))
    return (
      <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" aria-hidden>
        <path d={siGoogle.path} fill={`#${siGoogle.hex}`} />
      </svg>
    );
  if (/^microsoft( 365)?\b/i.test(name))
    return (
      <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" aria-hidden>
        <rect x="1" y="1" width="10.5" height="10.5" fill="#f25022" />
        <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7fba00" />
        <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00a4ef" />
        <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#ffb900" />
      </svg>
    );
  if (/^zoho\b/i.test(name))
    return (
      <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" aria-hidden>
        <path d={siZoho.path} fill={`#${siZoho.hex}`} />
      </svg>
    );
  return null;
}

export const hasSuiteLogo = (name: string) =>
  /^(google|microsoft|zoho)\b/i.test(name);
