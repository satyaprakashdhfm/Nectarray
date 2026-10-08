"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/*
 * The browser's own speech recognition (Chrome and Edge). Not in the DOM
 * typings yet, so the little of it used here is described by hand.
 */
type Alternative = { transcript: string };
type Result = { isFinal: boolean; 0: Alternative };
type RecognitionEvent = {
  resultIndex: number;
  results: { length: number; [index: number]: Result };
};
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};
type RecognitionClass = new () => Recognition;

function recognitionClass(): RecognitionClass | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionClass;
    webkitSpeechRecognition?: RecognitionClass;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const noop = () => () => {};

const MESSAGES: Record<string, string> = {
  "not-allowed":
    "The microphone is blocked. Allow it from the icon in the address bar.",
  "service-not-allowed":
    "The microphone is blocked. Allow it from the icon in the address bar.",
  "audio-capture": "No microphone was found.",
  network: "Speech recognition needs an internet connection.",
};

/**
 * Push to talk: `start` while the button is held, `stop` on release, and
 * `onText` gets everything said in between as one piece of text.
 */
export function useVoice({
  lang,
  onText,
}: {
  lang: string;
  onText: (text: string) => void;
}) {
  // Only knowable in the browser; the server renders it as unsupported.
  const supported = useSyncExternalStore(
    noop,
    () => recognitionClass() !== null,
    () => false,
  );
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [error, setError] = useState<string | null>(null);
  const rec = useRef<Recognition | null>(null);
  const finals = useRef("");
  const onTextRef = useRef(onText);

  useEffect(() => {
    onTextRef.current = onText;
  }, [onText]);

  useEffect(() => () => rec.current?.abort(), []);

  const start = useCallback(() => {
    const Klass = recognitionClass();
    if (!Klass || rec.current) return;
    const r = new Klass();
    r.lang = lang;
    r.continuous = true;
    r.interimResults = true;
    finals.current = "";
    setHeard("");
    setError(null);

    r.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finals.current += result[0].transcript;
        else interim += result[0].transcript;
      }
      setHeard((finals.current + interim).trim());
    };
    r.onerror = (event) => {
      if (event.error !== "aborted" && event.error !== "no-speech")
        setError(MESSAGES[event.error] ?? `Voice stopped: ${event.error}.`);
    };
    r.onend = () => {
      rec.current = null;
      setListening(false);
      const text = finals.current.replace(/\s+/g, " ").trim();
      finals.current = "";
      if (text) onTextRef.current(text);
    };

    rec.current = r;
    try {
      r.start();
      setListening(true);
    } catch {
      rec.current = null;
    }
  }, [lang]);

  /** Release: recognition finishes the last words, then onend fires. */
  const stop = useCallback(() => rec.current?.stop(), []);

  return { supported, listening, heard, error, start, stop };
}
