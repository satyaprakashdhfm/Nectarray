"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, MessageSquareText, TextSelect, X } from "lucide-react";
import type { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { lastReply } from "./last-reply";
import { filesIn, openRunner } from "./runner";

/*
 * Selected terminal text, ready to paste elsewhere: trailing padding goes,
 * and so does the bar Claude Code draws down the left of a quote, so a
 * message written for someone else pastes as plain text.
 */
const cleanCopy = (text: string) =>
  text
    .split("\n")
    // Only a lone bar: a table row has more of them, and keeps them all.
    .map((line) => line.replace(/^(\s*)[│┃▌▎▏|] ?(?!.*[│┃|])/, "$1").trimEnd())
    .join("\n")
    .trim();

/**
 * The terminal's whole text, scrollback included, one string per line as it
 * was written: wrapped rows are joined back, trailing padding and blank
 * lines at the end go.
 */
function screenLines(term: XTerm): string[] {
  const buffer = term.buffer.active;
  const lines: string[] = [];
  for (let i = 0; i < buffer.length; i++) {
    const line = buffer.getLine(i);
    if (!line) continue;
    const text = line.translateToString(true);
    if (line.isWrapped && lines.length) lines[lines.length - 1] += text;
    else lines.push(text);
  }
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  return lines.map((line) => line.trimEnd());
}

/** Puts text on the clipboard; false if the browser would not allow it. */
async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // No clipboard permission (some in-app browsers): the old way.
    const focused = document.activeElement as HTMLElement | null;
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    let done = false;
    try {
      done = document.execCommand("copy");
    } catch {}
    area.remove();
    focused?.focus({ preventScroll: true });
    return done;
  }
}

/**
 * The text of an OSC 52 clipboard request ("c;<base64>"), or null for a
 * query ("?") or anything malformed. Base64 of UTF-8, so accents and emoji
 * come through.
 */
function osc52Text(data: string): string | null {
  const payload = data.slice(data.indexOf(";") + 1);
  if (!payload || payload === "?") return null;
  try {
    const bytes = Uint8Array.from(atob(payload), (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

/**
 * One session's terminal: the real Claude Code screen, streamed from the
 * runner. Remounted per session (keyed by id), which replays that session's
 * recent output.
 *
 * Two ways to show it:
 * - main: full size, typing goes straight to Claude Code, and its size
 *   becomes the session's size. Links open in a new tab.
 * - preview: a small live picture for a tile. Read-only; drawn at the
 *   session's own size (cols x rows) and scaled down to fit, so it never
 *   resizes the session out from under the main view.
 *
 * xterm touches `window` when it loads, so it is imported inside the effect.
 */
export function TerminalView({
  id,
  preview = false,
  cols = 120,
  rows = 32,
  onFile,
}: {
  id: string;
  preview?: boolean;
  cols?: number;
  rows?: number;
  /** A file (an image, a PDF, anything) pasted or dropped on the terminal. */
  onFile?: (file: File) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);
  const fitPreview = useRef<() => void>(() => {});
  const onFileRef = useRef(onFile);
  const copyRef = useRef<() => void>(() => {});
  const copyReplyRef = useRef<() => void>(() => {});
  const openTextRef = useRef<() => void>(() => {});
  const [selected, setSelected] = useState(false);
  const [copied, setCopied] = useState<
    "selection" | "reply" | "none" | "all" | null
  >(null);
  /** The text view's contents while it is open. */
  const [text, setText] = useState<string | null>(null);
  /** What Claude Code copied, when the browser refused it without a click. */
  const [pending, setPending] = useState<string | null>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);

  const flash = (what: "selection" | "reply" | "none" | "all") => {
    setCopied(what);
    setTimeout(() => setCopied(null), 1800);
  };

  // The text view opens at the bottom, where the latest answer is.
  useEffect(() => {
    const area = textArea.current;
    if (text === null || !area) return;
    area.scrollTop = area.scrollHeight;
    area.focus({ preventScroll: true });
    // Only when it opens, not on every change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text === null]);

  useEffect(() => {
    onFileRef.current = onFile;
  }, [onFile]);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const [{ Terminal }, { FitAddon }, { WebLinksAddon }] = await Promise.all(
        [
          import("@xterm/xterm"),
          import("@xterm/addon-fit"),
          import("@xterm/addon-web-links"),
        ],
      );
      if (disposed || !host.current || !inner.current) return;

      const css = getComputedStyle(document.documentElement);
      const token = (name: string, fallback: string) =>
        css.getPropertyValue(name).trim() || fallback;
      const term = new Terminal({
        cursorBlink: !preview,
        disableStdin: preview,
        fontFamily: '"Cascadia Mono", Consolas, ui-monospace, monospace',
        // Smaller on a phone, so Claude Code's screen keeps enough columns.
        fontSize: !preview && window.innerWidth < 640 ? 11 : 13,
        lineHeight: 1.15,
        scrollback: preview ? 200 : 5000,
        allowProposedApi: true,
        // While Claude Code has the mouse, Shift+drag (Option+drag on a
        // Mac) still selects text.
        macOptionClickForcesSelection: true,
        ...(preview ? { cols, rows } : {}),
        theme: {
          background: token("--color-night", "#0b1720"),
          foreground: "#e6edf2",
          cursor: token("--color-brand", "#1fa5de"),
          selectionBackground: "#1fa5de55",
        },
      });
      termRef.current = term;
      const fit = new FitAddon();
      if (!preview) {
        term.loadAddon(fit);
        term.loadAddon(
          new WebLinksAddon((_event, uri) =>
            window.open(uri, "_blank", "noopener,noreferrer"),
          ),
        );
        // Left alone, xterm turns Ctrl+V into a raw ^V keystroke: Claude Code
        // then looks in the server's clipboard, which is always empty, and
        // the browser never pastes. Skipping it lets the browser paste, so
        // text goes in as a paste and files reach the upload below.
        // Ctrl+C is the same trap the other way: with text selected it
        // copies (as in Windows Terminal); with nothing selected it stays
        // Claude Code's interrupt. Ctrl+Shift+C always copies.
        term.attachCustomKeyEventHandler((e) => {
          if (!e.ctrlKey || e.altKey) return true;
          const key = e.key.toLowerCase();
          if (key === "v") return false;
          if (key === "c" && (e.shiftKey || term.hasSelection())) {
            if (e.type === "keydown") {
              e.preventDefault();
              copyRef.current();
            }
            return false;
          }
          return true;
        });
      }
      term.open(inner.current);
      copyRef.current = () => {
        const text = cleanCopy(term.getSelection());
        if (!text) return;
        void writeClipboard(text).then(() => {
          term.clearSelection();
          flash("selection");
        });
      };
      /*
       * Claude Code redraws its screen as it works, which can wipe a
       * selection mid-drag; this copies its last answer without dragging.
       */
      copyReplyRef.current = () => {
        const reply = lastReply(screenLines(term));
        if (!reply) return flash("none");
        void writeClipboard(reply).then(() => flash("reply"));
      };
      /*
       * Dragging in the terminal often selects nothing: Claude Code takes
       * the mouse for itself (only Shift+drag selects then), and phones
       * cannot select in it at all. The text view is the terminal's text
       * as a still page, selected and copied like any other text.
       */
      openTextRef.current = () => setText(screenLines(term).join("\n"));
      /*
       * Claude Code copies what you select in it by sending the text to the
       * terminal as an OSC 52 clipboard request ("sent N chars via OSC 52").
       * A desktop terminal puts it on the clipboard; xterm ignores it unless
       * told, so the copy went nowhere. Done here, it lands on this
       * computer's clipboard. If the browser wants a click first, a button
       * holding the text appears instead. Requests in the replayed history
       * when the terminal opens are old copies, and are skipped.
       */
      let replaying = true;
      const clipboard = preview
        ? null
        : term.parser.registerOscHandler(52, (data) => {
            const copied = replaying ? null : osc52Text(data);
            if (copied)
              void writeClipboard(copied).then((ok) => {
                if (ok) {
                  setPending(null);
                  flash("selection");
                } else setPending(copied);
                term.focus();
              });
            return true;
          });
      const selection = preview
        ? null
        : term.onSelectionChange(() => setSelected(term.hasSelection()));

      /* A preview is scaled as a picture: its full-size screen, shrunk to the tile. */
      fitPreview.current = () => {
        const box = host.current;
        const screen =
          inner.current?.querySelector<HTMLElement>(".xterm-screen");
        if (!preview || !box || !screen || !inner.current) return;
        const scale = Math.min(1, box.clientWidth / screen.offsetWidth);
        inner.current.style.transform = `scale(${scale})`;
        box.style.height = `${Math.ceil(screen.offsetHeight * scale)}px`;
      };

      const opened = await openRunner(`/term/${id}`);
      if (disposed) {
        if (typeof opened !== "string") opened.close();
        term.dispose();
        return;
      }
      if (typeof opened === "string") {
        term.write(
          opened === "expired"
            ? "\x1b[33mYour admin session has ended. Reload the page to sign in again.\x1b[0m\r\n"
            : "\x1b[33mThe Workspace is not set up.\x1b[0m\r\n",
        );
        cleanup = () => term.dispose();
        return;
      }
      const ws = opened;
      const send = (message: object) =>
        ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(message));
      const resize = () => {
        if (preview) return fitPreview.current();
        try {
          fit.fit();
        } catch {}
        send({ t: "resize", cols: term.cols, rows: term.rows });
      };

      ws.onopen = () => {
        resize();
        if (!preview) term.focus();
      };
      ws.onmessage = (event) => {
        const m = JSON.parse(String(event.data));
        // The first output is the replayed history; live output follows it.
        if (m.t === "out")
          term.write(m.data, () => {
            replaying = false;
          });
        if (m.t === "exit")
          term.write(
            m.asleep
              ? "\r\n\x1b[2m[asleep: open it to carry on]\x1b[0m\r\n"
              : "\r\n\x1b[2m[session closed]\x1b[0m\r\n",
          );
      };
      const input = preview
        ? null
        : term.onData((data) => send({ t: "in", data }));
      const observer = new ResizeObserver(() => resize());
      const box = host.current;
      observer.observe(box);
      // A click anywhere in the main terminal gives it the keyboard, so
      // arrows, Esc and Tab go to Claude Code rather than the page. Not in
      // the text view, whose selection (and Ctrl+C) must stay its own.
      const focus = (e: MouseEvent) => {
        if ((e.target as Element).closest?.("[data-text-view]")) return;
        term.focus();
      };
      // Files can't travel as typed text: a pasted or dropped file is
      // handed up, uploaded, and its path lands in the prompt instead.
      const takeFiles = (e: ClipboardEvent | DragEvent) => {
        const data = "clipboardData" in e ? e.clipboardData : e.dataTransfer;
        const files = filesIn(data);
        if (!files.length || !onFileRef.current) return;
        e.preventDefault();
        e.stopPropagation();
        files.forEach((file) => onFileRef.current?.(file));
        term.focus();
      };
      const allowDrop = (e: DragEvent) => {
        if (e.dataTransfer?.types.includes("Files")) e.preventDefault();
      };
      // Right-click copies the selection, as in Windows Terminal.
      const rightClick = (e: MouseEvent) => {
        if ((e.target as Element).closest?.("[data-text-view]")) return;
        if (!term.hasSelection()) return;
        e.preventDefault();
        copyRef.current();
      };
      if (!preview) {
        box.addEventListener("contextmenu", rightClick);
        box.addEventListener("mousedown", focus);
        box.addEventListener("paste", takeFiles, true);
        box.addEventListener("dragover", allowDrop);
        box.addEventListener("drop", takeFiles);
      }

      cleanup = () => {
        observer.disconnect();
        box.removeEventListener("contextmenu", rightClick);
        box.removeEventListener("mousedown", focus);
        box.removeEventListener("paste", takeFiles, true);
        box.removeEventListener("dragover", allowDrop);
        box.removeEventListener("drop", takeFiles);
        input?.dispose();
        selection?.dispose();
        clipboard?.dispose();
        ws.close();
        term.dispose();
        termRef.current = null;
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
    // cols/rows are applied below, without reconnecting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, preview]);

  // The session was resized in the main view: redraw the preview to match.
  useEffect(() => {
    const term = termRef.current;
    if (!preview || !term) return;
    if (term.cols !== cols || term.rows !== rows) {
      term.resize(cols, rows);
      requestAnimationFrame(() => fitPreview.current());
    }
  }, [preview, cols, rows]);

  return (
    <div
      ref={host}
      className={
        preview
          ? "bg-night pointer-events-none relative w-full overflow-hidden"
          : "bg-night relative h-full min-h-0 w-full overflow-hidden p-2"
      }
      aria-hidden={preview || undefined}
    >
      {!preview && text !== null && (
        <div
          data-text-view
          className="bg-night absolute inset-0 z-20 flex flex-col"
        >
          <div className="border-night-line flex flex-wrap items-center gap-2 border-b px-3 py-2">
            <p className="min-w-0 flex-1 text-[0.75rem] text-white/60">
              The terminal as text: select any part and copy it (Ctrl+C, or
              long-press on a phone).
            </p>
            <CopyButton
              onClick={() =>
                void writeClipboard(cleanCopy(text)).then(() => flash("all"))
              }
              done={copied === "all"}
              label="Copy all"
              doneLabel="Copied"
              icon={<Copy className="size-3.5" aria-hidden />}
            />
            <CopyButton
              onClick={() => {
                setText(null);
                termRef.current?.focus();
              }}
              done={false}
              label="Back to terminal"
              doneLabel=""
              icon={<X className="size-3.5" aria-hidden />}
            />
          </div>
          <textarea
            ref={textArea}
            value={text}
            readOnly
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setText(null);
                termRef.current?.focus();
              }
            }}
            aria-label="Terminal text"
            className="bg-night min-h-0 flex-1 resize-none p-3 font-mono text-[0.8125rem] leading-snug whitespace-pre text-[#e6edf2] outline-none selection:bg-[#1fa5de55]"
          />
        </div>
      )}
      {!preview && text === null && (
        <div className="absolute top-2 right-3 z-10 flex items-center gap-1.5">
          {pending !== null && copied !== "selection" && (
            <CopyButton
              onClick={() =>
                void writeClipboard(pending).then((ok) => {
                  if (!ok) return;
                  setPending(null);
                  flash("selection");
                })
              }
              done={false}
              label={`Copy what you selected (${pending.length} chars)`}
              doneLabel=""
              icon={<Copy className="text-brand size-3.5" aria-hidden />}
            />
          )}
          {(selected || copied === "selection") && (
            <CopyButton
              onClick={() => copyRef.current()}
              done={copied === "selection"}
              label="Copy"
              doneLabel="Copied"
              icon={<Copy className="size-3.5" aria-hidden />}
            />
          )}
          <CopyButton
            onClick={() => copyReplyRef.current()}
            done={copied === "reply"}
            label={copied === "none" ? "No reply yet" : "Copy last reply"}
            doneLabel="Reply copied"
            icon={<MessageSquareText className="size-3.5" aria-hidden />}
          />
          <CopyButton
            onClick={() => openTextRef.current()}
            done={false}
            label="Select text"
            doneLabel=""
            icon={<TextSelect className="size-3.5" aria-hidden />}
          />
        </div>
      )}
      <div
        ref={inner}
        className={preview ? "absolute top-0 left-0 origin-top-left" : "h-full"}
      />
    </div>
  );
}

function CopyButton({
  onClick,
  done,
  label,
  doneLabel,
  icon,
}: {
  onClick: () => void;
  done: boolean;
  label: string;
  doneLabel: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      // Keep the selection: the press must not reach the terminal.
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={onClick}
      className="bg-night-soft border-night-line inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[0.75rem] font-semibold text-white/85 shadow-sm transition-colors hover:text-white"
    >
      {done ? <Check className="text-leaf size-3.5" aria-hidden /> : icon}
      {done ? doneLabel : label}
    </button>
  );
}
