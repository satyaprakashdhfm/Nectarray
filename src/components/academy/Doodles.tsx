/**
 * The hand-drawn marks scattered behind the academy hero.
 *
 * They are the difference between a page that looks like a brochure and one
 * that looks like somewhere a person teaches. Purely decorative — every one
 * is hidden from assistive technology, and none of them carry meaning that
 * is not also in the text.
 */

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path
        d="M12 1.5c.7 4.8 2.2 6.3 7 7-4.8.7-6.3 2.2-7 7-.7-4.8-2.2-6.3-7-7 4.8-.7 6.3-2.2 7-7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlusPair({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 34"
      className={className}
      aria-hidden
      focusable="false"
    >
      <g stroke="currentColor" strokeWidth="3.4" strokeLinecap="round">
        <path d="M12 4v16M4 12h16" />
        <path d="M33 16v12M27 22h12" />
      </g>
    </svg>
  );
}

export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 30"
      className={className}
      aria-hidden
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      >
        <path d="M3 9q12-9 24 0t24 0 24 0 18 0" />
        <path d="M3 22q12-9 24 0t24 0 24 0 18 0" />
      </g>
    </svg>
  );
}
