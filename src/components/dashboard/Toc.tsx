import { slugify } from "@/components/dashboard/Markdown";

type Entry = { level: 1 | 2; text: string; id: string };

/**
 * "On this page", built by scanning the markdown for its top two heading
 * levels.
 *
 * Parsed from the raw source rather than from the DOM so it renders on the
 * server with everything else — a client-side scan would leave the column
 * empty until hydration, which on a 40 KB lesson is exactly when a reader
 * is looking for it.
 *
 * Fenced blocks are stripped first: these notes are full of shell examples
 * where a line legitimately starts with #, and every one of those would
 * otherwise arrive as a heading.
 */
export function Toc({ source }: { source: string }) {
  const withoutFences = source.replace(/```[\s\S]*?```/g, "");

  const entries: Entry[] = [];
  for (const line of withoutFences.split("\n")) {
    const match = /^(#{1,2})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const text = match[2].replace(/`/g, "").trim();
    if (!text) continue;
    entries.push({
      level: match[1].length as 1 | 2,
      text,
      id: slugify(text),
    });
  }

  if (entries.length < 3) return null;

  return (
    <nav
      aria-label="On this page"
      className="xl:sticky xl:top-[125px] xl:max-h-[calc(100vh-125px)] xl:overflow-y-auto"
    >
      <p className="eyebrow mb-3">On this page</p>
      <ul className="border-line-soft space-y-0.5 border-l">
        {entries.map((entry, i) => (
          <li key={`${entry.id}-${i}`}>
            <a
              href={`#${entry.id}`}
              className={`text-ink-soft hover:border-brand hover:text-ink -ml-px block border-l-2 border-transparent py-1.5 text-[0.8125rem] leading-snug transition-colors ${
                entry.level === 2 ? "pl-7" : "pl-4"
              }`}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
