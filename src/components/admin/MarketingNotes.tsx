import Link from "next/link";
import { ArrowUpRight, Lightbulb } from "lucide-react";
import { th, td } from "@/components/admin/Business";
import type { NoteBlock, NoteTopic } from "@/lib/content/marketing-notes";

/**
 * The three boxes every topic opens with: how to connect the tool, what to
 * fill in, and what you get out of it. Same order on every page, so the
 * setup answer is always in the same place.
 */
export function SetupBoxes({ topic }: { topic: NoteTopic }) {
  const boxes = [
    { title: "How to connect", items: topic.connect, ordered: true },
    { title: "What to fill", items: topic.fill, ordered: false },
    { title: "What you get", items: topic.get, ordered: false },
  ];
  return (
    <div className="mt-6 grid gap-3 lg:grid-cols-3 lg:gap-4">
      {boxes.map((box) => {
        const List = box.ordered ? "ol" : "ul";
        return (
          <section key={box.title} className="card p-5">
            <h2 className="eyebrow">{box.title}</h2>
            <List
              className={`text-ink-soft mt-3 space-y-2 pl-5 text-[0.8125rem] leading-relaxed ${
                box.ordered ? "list-decimal" : "list-disc"
              }`}
            >
              {box.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </List>
          </section>
        );
      })}
    </div>
  );
}

/** One block of a section, in whichever of the six shapes it comes in. */
export function Block({ block }: { block: NoteBlock }) {
  switch (block.kind) {
    case "p":
      return (
        <p className="text-ink-soft max-w-3xl text-[0.875rem] leading-relaxed break-words">
          {block.text}
        </p>
      );
    case "list":
    case "steps": {
      const List = block.kind === "steps" ? "ol" : "ul";
      return (
        <List
          className={`text-ink-soft max-w-3xl space-y-2 pl-5 text-[0.875rem] leading-relaxed ${
            block.kind === "steps" ? "list-decimal" : "list-disc"
          }`}
        >
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </List>
      );
    }
    case "terms":
      return (
        <dl className="grid gap-2 sm:grid-cols-2">
          {block.items.map((item) => (
            <div
              key={item.term}
              className="border-line bg-canvas rounded-xl border p-4"
            >
              <dt className="text-ink text-[0.875rem] font-semibold">
                {item.term}
              </dt>
              <dd className="text-ink-soft mt-1 text-[0.8125rem] leading-relaxed">
                {item.meaning}
              </dd>
            </div>
          ))}
        </dl>
      );
    case "table":
      return (
        <div className="card overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-line border-b">
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} className={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      className={`${td} min-w-[10rem] ${c === 0 ? "text-ink font-medium" : ""}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "tip":
      return (
        <p className="bg-amber-wash text-ink flex max-w-3xl gap-2.5 rounded-xl p-4 text-[0.8125rem] leading-relaxed">
          <Lightbulb
            className="text-amber-deep mt-0.5 size-4 shrink-0"
            aria-hidden
          />
          <span>{block.text}</span>
        </p>
      );
  }
}

/** The official pages a topic was written from. */
export function SourceLinks({ links }: { links: NoteTopic["links"] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {links.map((link) => (
        <li key={link.url}>
          <Link
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="border-line bg-canvas text-ink-soft hover:border-brand hover:text-brand-deep inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors"
          >
            {link.label}
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        </li>
      ))}
    </ul>
  );
}
