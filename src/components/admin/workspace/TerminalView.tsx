"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
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

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // No clipboard permission (some in-app browsers): the old way.
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
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
  const [selected, setSelected] = useState(false);
  const [copied, setCopied] = useState(false);

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
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      };
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
        if (m.t === "out") term.write(m.data);
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
      // arrows, Esc and Tab go to Claude Code rather than the page.
      const focus = () => term.focus();
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
      if (!preview) {
        box.addEventListener("mousedown", focus);
        box.addEventListener("paste", takeFiles, true);
        box.addEventListener("dragover", allowDrop);
        box.addEventListener("drop", takeFiles);
      }

      cleanup = () => {
        observer.disconnect();
        box.removeEventListener("mousedown", focus);
        box.removeEventListener("paste", takeFiles, true);
        box.removeEventListener("dragover", allowDrop);
        box.removeEventListener("drop", takeFiles);
        input?.dispose();
        selection?.dispose();
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
      {!preview && (selected || copied) && (
        <button
          type="button"
          // Keep the selection: the press must not reach the terminal.
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={() => copyRef.current()}
          className="bg-night-soft border-night-line absolute top-2 right-3 z-10 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[0.75rem] font-semibold text-white/85 shadow-sm transition-colors hover:text-white"
        >
          {copied ? (
            <Check className="text-leaf size-3.5" aria-hidden />
          ) : (
            <Copy className="size-3.5" aria-hidden />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      )}
      <div
        ref={inner}
        className={preview ? "absolute top-0 left-0 origin-top-left" : "h-full"}
      />
    </div>
  );
}
