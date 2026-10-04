"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const prompt = "Which of our stores sold the most last week?";
const answer =
  "Banjara Hills, at ₹4.2 lakh — up 18% on the week before, mostly from the weekend sale. Kukatpally was second.".split(
    " ",
  );

type Phase = "typing" | "thinking" | "streaming" | "done";

/**
 * A question types itself into the box, the assistant thinks for a beat,
 * then the answer streams in a word at a time — and it all starts over.
 */
export function AiTypingPrompt() {
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState(0);
  const [shown, setShown] = useState(0);

  // One timer at a time, each step scheduling the next.
  useEffect(() => {
    let t: number;
    if (phase === "typing") {
      t =
        typed < prompt.length
          ? window.setTimeout(() => setTyped(typed + 1), 38)
          : window.setTimeout(() => setPhase("thinking"), 450);
    } else if (phase === "thinking") {
      t = window.setTimeout(() => setPhase("streaming"), 1100);
    } else if (phase === "streaming") {
      t =
        shown < answer.length
          ? window.setTimeout(() => setShown(shown + 1), 70)
          : window.setTimeout(() => setPhase("done"), 100);
    } else {
      t = window.setTimeout(() => {
        setTyped(0);
        setShown(0);
        setPhase("typing");
      }, 3200);
    }
    return () => window.clearTimeout(t);
  }, [phase, typed, shown]);

  return (
    <section className="@container relative overflow-hidden bg-gradient-to-b from-(--p-light) to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 @3xl:grid-cols-[1fr_1.1fr] @3xl:py-24">
        <div>
          <motion.h1
            className="text-4xl leading-[1.05] font-semibold tracking-tight text-zinc-900 @3xl:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Ask your sales data anything
          </motion.h1>
          <motion.p
            className="mt-5 max-w-[42ch] text-base leading-relaxed text-zinc-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Plain-English questions, answered from your own billing and stock
            records in seconds. No dashboards to build first.
          </motion.p>
          <motion.a
            href="#"
            className="mt-8 inline-block rounded-lg bg-(--p) px-5 py-3 text-sm font-semibold text-(--p-on)"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Try it on sample data
          </motion.a>
        </div>

        <motion.div
          className="rounded-2xl bg-white p-4 shadow-xl ring-1 ring-zinc-200 @3xl:p-5"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex min-h-12 items-center rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-900 ring-1 ring-zinc-200">
            <span>{prompt.slice(0, typed)}</span>
            {phase === "typing" && (
              <motion.span
                className="ml-0.5 inline-block h-4 w-[2px] bg-(--p)"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            )}
          </div>

          <div className="mt-4 flex min-h-32 gap-3">
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-(--p) text-xs font-bold text-(--p-on)">
              AI
            </div>
            <div className="text-sm leading-relaxed text-zinc-700">
              <AnimatePresence mode="wait">
                {phase === "thinking" && (
                  <motion.div
                    key="dots"
                    className="flex gap-1 pt-2"
                    exit={{ opacity: 0 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="size-2 rounded-full bg-zinc-400"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.12,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {(phase === "streaming" || phase === "done") && (
                <p>
                  {answer.slice(0, shown).map((w, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, filter: "blur(4px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.25 }}
                    >
                      {w}{" "}
                    </motion.span>
                  ))}
                </p>
              )}
              {phase === "done" && (
                <motion.div
                  className="mt-3 flex gap-2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="rounded-md bg-(--s-light) px-2 py-1 text-xs font-medium text-(--s-dark)">
                    Source: billing, 7 days
                  </span>
                  <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                    Show as chart
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
