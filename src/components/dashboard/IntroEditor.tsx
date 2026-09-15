"use client";

import { useCallback, useState, type ReactNode } from "react";
import { CopyButton } from "@/components/dashboard/CopyButton";
import { MAX_INTRO_CHARS } from "@/lib/resume-files";
import { PlacementBar, SaveIndicator } from "./PlacementBar";
import { putPlacement, recallSaved, useAutosave } from "./use-autosave";

/** An unhurried interview pace. */
const WORDS_PER_MINUTE = 140;

function spokenLength(words: number): string {
  const seconds = Math.round((words / WORDS_PER_MINUTE) * 60);
  if (seconds < 60) return `${seconds} sec`;
  const rest = seconds % 60;
  return rest ? `${Math.floor(seconds / 60)} min ${rest} sec` : `${seconds / 60} min`;
}

/**
 * The answer to "tell me about yourself", kept where the student can find it
 * the night before an interview.
 *
 * A plain textarea on purpose: this is read aloud, not formatted, and the
 * one number worth showing is how long it takes to say.
 */
export function IntroEditor({
  userId,
  initial,
  tabs,
}: {
  userId: string;
  initial: string;
  tabs: ReactNode;
}) {
  const key = `intro:${userId}`;
  const [text, setText] = useState(() => recallSaved(key, initial));

  const save = useCallback(
    (value: string, keepalive: boolean) =>
      putPlacement(JSON.stringify({ intro: value }), keepalive),
    [],
  );
  const { status, saveNow } = useAutosave(key, text, save);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="flex min-h-[calc(100dvh-var(--app-chrome))] flex-col">
      <PlacementBar tabs={tabs}>
        <SaveIndicator status={status} />
      </PlacementBar>

      <div className="shell w-full py-8 lg:py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="display text-ink text-[1.875rem] sm:text-[2.25rem]">
            Self-introduction
          </h1>
          <p className="text-ink-soft mt-3 text-[0.9375rem] leading-relaxed">
            Your answer to &ldquo;Tell me about yourself.&rdquo; Read it out
            loud a few times and change whatever doesn&rsquo;t sound like you.
            Most interviewers expect it to take under two minutes.
          </p>

          <div className="card mt-7 overflow-hidden">
            <div className="border-line flex items-center justify-between gap-3 border-b px-5 py-2.5">
              <span className="text-ink-faint text-[0.8125rem]">
                {words} {words === 1 ? "word" : "words"} · about{" "}
                {spokenLength(words)} to say
              </span>
              <CopyButton text={text} />
            </div>
            <label htmlFor="self-intro" className="sr-only">
              Self-introduction
            </label>
            <textarea
              id="self-intro"
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (
                  (event.metaKey || event.ctrlKey) &&
                  event.key.toLowerCase() === "s"
                ) {
                  event.preventDefault();
                  saveNow();
                }
              }}
              maxLength={MAX_INTRO_CHARS}
              placeholder="I am … currently studying … During my internship I …"
              spellCheck
              className="bg-surface text-ink placeholder:text-ink-faint block min-h-[28rem] w-full resize-y px-6 py-5 text-[1rem] leading-[1.8] focus:outline-none"
            />
          </div>
          <p className="text-ink-faint mt-3 text-[0.8125rem]">
            Saves as you type.
          </p>
        </div>
      </div>
    </div>
  );
}
