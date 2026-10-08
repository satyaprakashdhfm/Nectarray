"use client";

import { useEffect, useRef } from "react";
import "@xterm/xterm/css/xterm.css";
import { RUNNER } from "./runner";

/**
 * One session's terminal: the real Claude Code screen, streamed from the
 * runner on this PC. Keystrokes go straight back to it, so it behaves the way
 * Claude Code does in any terminal.
 *
 * xterm touches `window` when it loads, so it is imported inside the effect.
 * Remounted per session (keyed by id), which replays that session's recent
 * output from the runner.
 */
export function TerminalView({
  id,
  onExit,
}: {
  id: string;
  onExit?: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const exitRef = useRef(onExit);
  useEffect(() => {
    exitRef.current = onExit;
  }, [onExit]);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const [{ Terminal }, { FitAddon }] = await Promise.all([
        import("@xterm/xterm"),
        import("@xterm/addon-fit"),
      ]);
      if (disposed || !host.current) return;

      const css = getComputedStyle(document.documentElement);
      const token = (name: string, fallback: string) =>
        css.getPropertyValue(name).trim() || fallback;
      const term = new Terminal({
        cursorBlink: true,
        fontFamily: '"Cascadia Mono", Consolas, ui-monospace, monospace',
        fontSize: 13,
        lineHeight: 1.15,
        scrollback: 5000,
        allowProposedApi: true,
        theme: {
          background: token("--color-night", "#0b1720"),
          foreground: "#e6edf2",
          cursor: token("--color-brand", "#1fa5de"),
          selectionBackground: "#1fa5de55",
        },
      });
      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(host.current);

      const ws = new WebSocket(`${RUNNER}/term/${id}`);
      const send = (message: object) =>
        ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(message));
      const resize = () => {
        try {
          fit.fit();
        } catch {}
        send({ t: "resize", cols: term.cols, rows: term.rows });
      };

      ws.onopen = () => {
        resize();
        term.focus();
      };
      ws.onmessage = (event) => {
        const m = JSON.parse(String(event.data));
        if (m.t === "out") term.write(m.data);
        if (m.t === "exit") {
          term.write("\r\n\x1b[2m[session closed]\x1b[0m\r\n");
          exitRef.current?.();
        }
      };
      const input = term.onData((data) => send({ t: "in", data }));
      const observer = new ResizeObserver(() => resize());
      observer.observe(host.current);

      cleanup = () => {
        observer.disconnect();
        input.dispose();
        ws.close();
        term.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [id]);

  return (
    <div
      ref={host}
      className="bg-night h-full min-h-0 w-full overflow-hidden p-2"
    />
  );
}
