"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/**
 * Tap to talk: `toggle` starts recording on the first tap and stops it on
 * the next. The recording goes to /api/admin/transcribe (Groq Whisper or
 * Gemini, see there) and `onText` gets the words.
 *
 * Recorded with the browser's MediaRecorder, which works in every current
 * browser on desktop and phone, then turned into 16 kHz mono WAV here: the
 * one format every speech engine takes, and small (about 32 KB a second).
 */

const LONGEST_MS = 120_000;

const noop = () => () => {};

function canRecord() {
  return (
    typeof window !== "undefined" &&
    typeof MediaRecorder !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia
  );
}

const MESSAGES: Record<string, string> = {
  NotAllowedError:
    "The microphone is blocked. Allow it from the icon in the address bar.",
  NotFoundError: "No microphone was found.",
  NotReadableError: "The microphone is in use by another app.",
};

export function useVoice({
  hint,
  onText,
}: {
  /** The repo being worked on, to help the engine with its words. */
  hint?: string;
  onText: (text: string) => void;
}) {
  // Only knowable in the browser; the server renders it as unsupported.
  const supported = useSyncExternalStore(noop, canRecord, () => false);
  const [state, setState] = useState<"idle" | "recording" | "writing">("idle");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const wanted = useRef(false);
  const busy = useRef(false);
  const onTextRef = useRef(onText);
  const hintRef = useRef(hint);

  useEffect(() => {
    onTextRef.current = onText;
    hintRef.current = hint;
  }, [onText, hint]);

  const release = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
  }, []);

  useEffect(() => () => release(), [release]);

  const send = useCallback(async (recorded: Blob) => {
    busy.current = true;
    setState("writing");
    try {
      const wav = await toWav(recorded);
      const form = new FormData();
      form.append("audio", wav, "speech.wav");
      if (hintRef.current) form.append("hint", hintRef.current);
      const res = await fetch("/api/admin/transcribe", {
        method: "POST",
        body: form,
      });
      const body = (await res.json().catch(() => ({}))) as {
        text?: string;
        error?: string;
      };
      if (!res.ok)
        throw new Error(
          res.status === 401
            ? "Your admin session has ended. Reload the page to sign in again."
            : (body.error ?? "Could not turn that into text."),
        );
      const text = (body.text ?? "").replace(/\s+/g, " ").trim();
      if (text) onTextRef.current(text);
      else setError("Nothing was heard. Tap Talk, speak, then tap Stop.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not turn that into text.",
      );
    } finally {
      busy.current = false;
      setState("idle");
    }
  }, []);

  const start = useCallback(async () => {
    if (!canRecord() || recorder.current || busy.current) return;
    wanted.current = true;
    setError(null);
    let media: MediaStream;
    try {
      media = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } catch (err) {
      wanted.current = false;
      const name = err instanceof DOMException ? err.name : "";
      setError(MESSAGES[name] ?? "The microphone could not be opened.");
      return;
    }
    // Tapped again before the microphone opened: nothing to record.
    if (!wanted.current) {
      media.getTracks().forEach((t) => t.stop());
      return;
    }
    stream.current = media;
    chunks.current = [];
    const rec = new MediaRecorder(media);
    recorder.current = rec;
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };
    rec.onstop = () => {
      // Also reached at the time limit, so the next tap starts afresh.
      wanted.current = false;
      recorder.current = null;
      release();
      const recorded = new Blob(chunks.current, {
        type: rec.mimeType || "audio/webm",
      });
      chunks.current = [];
      if (recorded.size < 2000) setState("idle");
      else void send(recorded);
    };
    rec.start(250);
    setState("recording");
    setSeconds(0);
    const began = Date.now();
    timer.current = setInterval(() => {
      const elapsed = Date.now() - began;
      setSeconds(Math.floor(elapsed / 1000));
      if (elapsed >= LONGEST_MS && rec.state === "recording") rec.stop();
    }, 250);
  }, [release, send]);

  /** The second tap: the recording is sent and turned into text. */
  const stop = useCallback(() => {
    wanted.current = false;
    if (recorder.current?.state === "recording") recorder.current.stop();
  }, []);

  /*
   * One button for both. `wanted` is set from the first tap, so a second
   * tap while the browser is still asking for the microphone cancels it
   * rather than opening it twice.
   */
  const toggle = useCallback(() => {
    if (wanted.current) stop();
    else void start();
  }, [start, stop]);

  return {
    supported,
    listening: state === "recording",
    writing: state === "writing",
    seconds,
    error,
    toggle,
  };
}

/** Any recording the browser can decode, as 16 kHz mono 16-bit WAV. */
async function toWav(blob: Blob): Promise<Blob> {
  const rate = 16_000;
  const context = new AudioContext();
  let decoded: AudioBuffer;
  try {
    decoded = await context.decodeAudioData(await blob.arrayBuffer());
  } finally {
    void context.close();
  }
  const length = Math.max(1, Math.ceil(decoded.duration * rate));
  const offline = new OfflineAudioContext(1, length, rate);
  const source = offline.createBufferSource();
  source.buffer = decoded;
  source.connect(offline.destination);
  source.start();
  const samples = (await offline.startRendering()).getChannelData(0);

  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const ascii = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++)
      view.setUint8(offset + i, s.charCodeAt(i));
  };
  ascii(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  ascii(8, "WAVE");
  ascii(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  ascii(36, "data");
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
}
