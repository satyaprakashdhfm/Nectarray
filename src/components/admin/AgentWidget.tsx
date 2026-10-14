"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowUp,
  Check,
  Loader2,
  MessagesSquare,
  Mic,
  Square,
  X,
} from "lucide-react";
import { useVoice } from "@/components/admin/workspace/useVoice";
import { inr } from "@/lib/agent/cost";

/**
 * The Agent, as a chat bubble in the bottom-right corner of every admin
 * page: tap it and the chat opens over the page (the whole screen on a
 * phone). Typed or spoken (the microphone sends the words through
 * /api/admin/transcribe and puts them in the box to check before sending);
 * each answer comes from /api/admin/agent with what it changed, linked, and
 * a line with what that answer cost.
 *
 * The conversation is kept in this browser (localStorage) until New chat;
 * every answer and its cost is also saved on the server, and the header
 * shows what today's and this month's answers have cost.
 */

type Usage = {
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number | null;
  ms: number;
};
type Action = { label: string; href?: string };
type Spend = {
  todayUsd: number;
  todayN: number;
  monthUsd: number;
  monthN: number;
};
type Message = {
  role: "user" | "assistant";
  content: string;
  actions?: Action[];
  usage?: Usage;
  error?: boolean;
};

const STORE = "nectarray-agent-chat";
/** What the model is sent of the conversation: the latest turns. */
const MEMORY = 20;

const IDEAS = [
  "What is due this week?",
  "Add tasks to the cookie project: login page by Friday, payment gateway by the 30th, high priority",
  "How much revenue came in this month, and who still owes us?",
  "Spent ₹2,400 today on hosting",
  "How did the website do in the last 28 days?",
];

function load(): Message[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) ?? "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function AgentWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Kept mounted while closed, so a reply still lands if it is shut. */}
      <div
        role="dialog"
        aria-label="Agent"
        hidden={!open}
        className="bg-surface border-line fixed inset-0 z-[70] flex flex-col overflow-hidden shadow-2xl sm:inset-auto sm:right-5 sm:bottom-5 sm:h-[min(40rem,calc(100dvh-6.5rem))] sm:w-[26rem] sm:rounded-2xl sm:border"
      >
        <Chat open={open} onClose={() => setOpen(false)} />
      </div>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open the Agent"
          className="bg-ink text-cta-fg hover:bg-brand-deep fixed right-5 bottom-5 z-[55] grid size-14 place-items-center rounded-full shadow-xl transition-colors active:scale-[0.96]"
        >
          <MessagesSquare className="size-6" strokeWidth={1.9} aria-hidden />
        </button>
      )}
    </>
  );
}

function Chat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [spend, setSpend] = useState<Spend | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const box = useRef<HTMLTextAreaElement>(null);
  const list = useRef<HTMLDivElement>(null);

  const loadSpend = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/agent");
      if (res.ok) setSpend((await res.json()) as Spend);
    } catch {
      // Offline: the header just leaves the spend out.
    }
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetched on opening
    if (open) void loadSpend();
  }, [open, loadSpend]);

  // Read after mounting: the server has no localStorage.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages(load());
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(messages.slice(-100)));
    } catch {
      // Private window or storage full: the chat still works, unsaved.
    }
    list.current?.scrollTo({ top: list.current.scrollHeight });
  }, [messages, open]);

  const voice = useVoice({
    purpose: "business",
    onText: (heard) => {
      setText((t) => (t ? `${t} ${heard}` : heard));
      box.current?.focus();
    },
  });

  const send = useCallback(
    async (value: string) => {
      const question = value.trim();
      if (!question || busy) return;
      const next: Message[] = [
        ...messages,
        { role: "user", content: question },
      ];
      setMessages(next);
      setText("");
      setBusy(true);
      try {
        const res = await fetch("/api/admin/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next
              .filter((m) => !m.error)
              .slice(-MEMORY)
              .map(({ role, content }) => ({ role, content })),
          }),
        });
        const body = (await res.json().catch(() => ({}))) as {
          answer?: string;
          error?: string;
          actions?: Action[];
          usage?: Usage;
        };
        if (!res.ok || !body.answer) {
          setMessages((m) => [
            ...m,
            {
              role: "assistant",
              error: true,
              actions: body.actions,
              content:
                res.status === 401
                  ? "Your admin session has ended. Reload the page to sign in again."
                  : (body.error ?? "Something went wrong. Try again."),
            },
          ]);
        } else {
          setMessages((m) => [
            ...m,
            {
              role: "assistant",
              content: body.answer!,
              actions: body.actions,
              usage: body.usage,
            },
          ]);
        }
        // The page behind may show what changed.
        if (body.actions?.length) router.refresh();
        void loadSpend();
      } catch {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            error: true,
            content: "No connection. Check the internet and try again.",
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [busy, messages, router, loadSpend],
  );

  const clock = `${Math.floor(voice.seconds / 60)}:${String(voice.seconds % 60).padStart(2, "0")}`;

  return (
    <>
      <div className="border-line-soft flex items-center gap-3 border-b px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-ink text-[0.9375rem] font-semibold">Agent</p>
          <p className="text-ink-faint truncate text-[0.75rem]">
            {spend
              ? `Today ${inr(spend.todayUsd)} (${spend.todayN}) · This month ${inr(spend.monthUsd)} (${spend.monthN})`
              : "Talk or type. Tap the mic, speak, tap again."}
          </p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setMessages([])}
            className="text-ink-soft hover:text-ink shrink-0 text-[0.8125rem] font-semibold"
          >
            New chat
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close the Agent"
          className="text-ink-soft hover:bg-mist hover:text-ink grid size-9 shrink-0 place-items-center rounded-lg"
        >
          <X className="size-5" strokeWidth={1.9} aria-hidden />
        </button>
      </div>

      <div
        ref={list}
        className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4"
      >
        {messages.length === 0 && (
          <div className="py-4">
            <p className="text-ink-soft text-[0.875rem]">Try asking:</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {IDEAS.map((idea) => (
                <li key={idea}>
                  <button
                    type="button"
                    onClick={() => {
                      setText(idea);
                      box.current?.focus();
                    }}
                    className="border-line text-ink-soft hover:border-brand hover:text-ink rounded-full border px-3 py-1.5 text-left text-[0.8125rem] transition-colors"
                  >
                    {idea}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="bg-brand-wash text-ink max-w-[85%] rounded-2xl rounded-br-md px-3.5 py-2 text-[0.9375rem] whitespace-pre-wrap">
                {m.content}
              </p>
            </div>
          ) : (
            <div key={i} className="max-w-[95%]">
              <div
                className={`text-[0.9375rem] leading-relaxed ${m.error ? "text-danger" : "text-ink"}`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD}>
                  {m.content}
                </ReactMarkdown>
              </div>
              {!!m.actions?.length && (
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {m.actions.map((a, j) => (
                    <li key={j}>
                      <ActionChip action={a} />
                    </li>
                  ))}
                </ul>
              )}
              {m.usage && (
                <p className="text-ink-faint mt-1.5 text-[0.75rem]">
                  Cost of this answer:{" "}
                  <span className="text-ink-soft font-semibold">
                    {inr(m.usage.costUsd)}
                  </span>
                  {m.usage.costUsd !== null &&
                    ` ($${m.usage.costUsd.toFixed(5)})`}
                  {" · "}
                  {m.usage.inputTokens.toLocaleString("en-IN")} in ·{" "}
                  {m.usage.outputTokens.toLocaleString("en-IN")} out ·{" "}
                  {(m.usage.ms / 1000).toFixed(1)}s · {m.usage.model}
                </p>
              )}
            </div>
          ),
        )}
        {busy && (
          <p className="text-ink-soft flex items-center gap-2 text-[0.875rem]">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Working on it…
          </p>
        )}
      </div>

      <form
        className="border-line-soft border-t p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send(text);
        }}
      >
        {voice.error && (
          <p className="text-danger mb-2 text-[0.8125rem]">{voice.error}</p>
        )}
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={voice.toggle}
            disabled={!voice.supported || voice.writing}
            aria-label={voice.listening ? "Stop recording" : "Speak"}
            title={
              voice.supported
                ? undefined
                : "This browser cannot record. Try Chrome or the app."
            }
            className={`grid size-12 shrink-0 place-items-center rounded-full transition-colors active:scale-[0.96] disabled:opacity-50 ${
              voice.listening
                ? "bg-danger text-white"
                : "bg-ink text-cta-fg hover:bg-brand-deep"
            }`}
          >
            {voice.writing ? (
              <Loader2 className="size-5 animate-spin" aria-hidden />
            ) : voice.listening ? (
              <Square className="size-4 fill-current" aria-hidden />
            ) : (
              <Mic className="size-5" strokeWidth={2} aria-hidden />
            )}
          </button>
          <textarea
            ref={box}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(text);
              }
            }}
            rows={Math.min(6, Math.max(1, text.split("\n").length))}
            placeholder={
              voice.listening
                ? `Listening… ${clock}`
                : voice.writing
                  ? "Writing down what you said…"
                  : "Ask, or tell it what to add, change or delete"
            }
            aria-label="Message"
            className="border-line bg-surface text-ink focus:border-brand min-h-12 flex-1 resize-none rounded-xl border px-3 py-3 text-[0.9375rem] focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || !text.trim()}
            aria-label="Send"
            className="bg-brand-solid text-cta-fg grid size-12 shrink-0 place-items-center rounded-full transition-opacity active:scale-[0.96] disabled:opacity-40"
          >
            <ArrowUp className="size-5" strokeWidth={2.2} aria-hidden />
          </button>
        </div>
      </form>
    </>
  );
}

function ActionChip({ action }: { action: Action }) {
  const inner = (
    <>
      <Check className="size-3.5" strokeWidth={2.4} aria-hidden />
      {action.label}
    </>
  );
  const tone =
    "bg-leaf-wash text-leaf-deep inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.75rem] font-semibold";
  return action.href ? (
    <Link href={action.href} className={`${tone} hover:underline`}>
      {inner}
    </Link>
  ) : (
    <span className={tone}>{inner}</span>
  );
}

const MD: Components = {
  p: (props) => <p className="my-1.5" {...props} />,
  ul: (props) => (
    <ul className="my-1.5 list-disc space-y-0.5 pl-5" {...props} />
  ),
  ol: (props) => (
    <ol className="my-1.5 list-decimal space-y-0.5 pl-5" {...props} />
  ),
  strong: (props) => <strong className="font-semibold" {...props} />,
  a: (props) => (
    <a className="text-brand-deep underline underline-offset-2" {...props} />
  ),
  table: (props) => (
    <div className="my-2 overflow-x-auto">
      <table className="w-full text-left text-[0.8125rem]" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-line text-ink-soft border-b px-2 py-1.5 font-semibold"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border-line-soft border-b px-2 py-1.5" {...props} />
  ),
  code: (props) => (
    <code className="bg-mist rounded px-1 text-[0.85em]" {...props} />
  ),
};
