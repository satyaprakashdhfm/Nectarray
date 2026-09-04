"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { trackEvent } from "@/lib/analytics";
import { company } from "@/lib/content";

type Status = "idle" | "sending" | "sent" | "error";

const STEPS = ["About you", "Your goal", "Details"] as const;

const BACKGROUNDS = [
  "Student or fresh graduate",
  "Working professional switching domain",
  "Working in tech, moving into data",
  "Career break, returning to work",
];

const EXPERIENCE = [
  "Never written code",
  "Some Python, self-taught",
  "Comfortable with Python, weak on SQL",
  "Comfortable with both, want interview practice",
];

const GOALS = [
  "First job in data or analytics",
  "Switch domain into data science",
  "Move into AI / agentic engineering",
  "Clear an interview I already have lined up",
];

const TIMELINES = [
  "Next cohort, as soon as possible",
  "Within the next month",
  "In two to three months",
  "Still deciding",
];

/**
 * Enrolment enquiry, asked in three steps rather than as one long form.
 *
 * The steps are validated as you go, so a visitor cannot reach "Send" with a
 * half-filled form and be told so afterwards. It posts to the same
 * /api/contact endpoint as everything else with interest "Academy
 * enrolment", so enquiries land in one inbox.
 *
 * TODO(auth): once Supabase auth lands, the hero's "Enrol now" opens the
 * login modal instead and this becomes the fallback for people who want to
 * ask a question before committing.
 */
export function EnrolForm() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [background, setBackground] = useState("");
  const [experience, setExperience] = useState("");
  const [goal, setGoal] = useState("");
  const [timeline, setTimeline] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const stepValid = [
    background !== "" && experience !== "",
    goal !== "" && timeline !== "",
    name.trim() !== "" && email.trim() !== "" && phone.trim() !== "",
  ][step];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending" || !stepValid) return;

    setStatus("sending");
    setErrorMessage("");

    const message = [
      `Background: ${background}`,
      `Experience: ${experience}`,
      `Goal: ${goal}`,
      `Wants to start: ${timeline}`,
      `Phone: ${phone}`,
    ].join("\n");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company: "",
          interest: "Academy enrolment",
          message,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "That did not go through.");
      }

      trackEvent("generate_lead", {
        interest: "Academy enrolment",
        method: "academy_form",
      });
      setStatus("sent");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "That did not go through.",
      );
      setStatus("error");
    }
  }

  const field =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[0.9375rem] text-ink transition-colors focus:border-brand focus:outline-none";
  const label = "mb-2 block text-[0.8125rem] font-semibold text-ink";

  return (
    <section id="enrol" className="bg-surface py-20 sm:py-24 lg:py-28">
      <div className="shell">
        <div className="border-line grid overflow-hidden rounded-[1.5rem] border lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left panel --------------------------------------------------- */}
          <div className="from-brand-wash to-leaf-wash relative overflow-hidden bg-gradient-to-br p-8 sm:p-10">
            <div
              className="grid-paper pointer-events-none absolute inset-0 opacity-60"
              aria-hidden
            />
            <div className="relative">
              <SectionHead
                eyebrow="Still need help?"
                title={
                  <>
                    Not sure if it is <em>for you?</em>
                  </>
                }
                lede="Answer three short questions and we will tell you honestly whether this cohort fits — including if it does not."
              />

              <ul className="mt-10 space-y-3">
                {[
                  "We reply within one business day",
                  "No sales call unless you ask for one",
                  "Five seats, so we say no more often than yes",
                ].map((point) => (
                  <li key={point} className="flex gap-3">
                    <Check
                      className="text-leaf-deep mt-0.5 size-4 shrink-0"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                    <span className="text-ink-soft text-[0.9375rem]">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="text-ink-faint mt-10 text-[0.875rem]">
                Or write to{" "}
                <a
                  href={`mailto:${company.email}`}
                  className="text-brand-deep font-medium underline underline-offset-2"
                >
                  {company.email}
                </a>
              </p>
            </div>
          </div>

          {/* Right panel — the form -------------------------------------- */}
          <div className="bg-canvas p-8 sm:p-10">
            {status === "sent" ? (
              <div className="flex h-full min-h-[22rem] flex-col items-center justify-center text-center">
                <span className="bg-leaf-wash text-leaf-deep grid size-14 place-items-center rounded-full">
                  <Check className="size-7" strokeWidth={2.5} aria-hidden />
                </span>
                <h3 className="display text-ink mt-6 text-[1.5rem]">
                  That reached us.
                </h3>
                <p className="text-ink-soft mt-3 max-w-sm text-[0.9375rem] leading-relaxed">
                  We read every application ourselves and reply within one
                  business day — usually with a question or two about where you
                  are starting from.
                </p>
              </div>
            ) : (
              <>
                {/* Step indicator */}
                <ol className="mb-8 flex items-center gap-2">
                  {STEPS.map((title, i) => (
                    <li
                      key={title}
                      className="flex flex-1 items-center gap-2.5"
                    >
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full text-[0.8125rem] font-semibold transition-colors ${
                          i <= step
                            ? "bg-brand-deep text-white"
                            : "bg-mist text-ink-faint"
                        }`}
                      >
                        {i < step ? (
                          <Check
                            className="size-3.5"
                            strokeWidth={3}
                            aria-hidden
                          />
                        ) : (
                          i + 1
                        )}
                      </span>
                      <span
                        className={`hidden text-[0.8125rem] font-medium sm:inline ${
                          i <= step ? "text-ink" : "text-ink-faint"
                        }`}
                      >
                        {title}
                      </span>
                      {i < STEPS.length - 1 && (
                        <span
                          className={`ml-1 hidden h-px flex-1 lg:block ${
                            i < step ? "bg-brand-deep" : "bg-line"
                          }`}
                          aria-hidden
                        />
                      )}
                    </li>
                  ))}
                </ol>

                <form onSubmit={handleSubmit}>
                  {step === 0 && (
                    <div className="space-y-6">
                      <div>
                        <label className={label} htmlFor="background">
                          Tell us about your background
                        </label>
                        <select
                          id="background"
                          value={background}
                          onChange={(e) => setBackground(e.target.value)}
                          className={field}
                        >
                          <option value="">Select background</option>
                          {BACKGROUNDS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={label} htmlFor="experience">
                          Where are you with code today?
                        </label>
                        <select
                          id="experience"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          className={field}
                        >
                          <option value="">Select experience</option>
                          {EXPERIENCE.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <label className={label} htmlFor="goal">
                          What are you trying to reach?
                        </label>
                        <select
                          id="goal"
                          value={goal}
                          onChange={(e) => setGoal(e.target.value)}
                          className={field}
                        >
                          <option value="">Select goal</option>
                          {GOALS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={label} htmlFor="timeline">
                          When do you want to start?
                        </label>
                        <select
                          id="timeline"
                          value={timeline}
                          onChange={(e) => setTimeline(e.target.value)}
                          className={field}
                        >
                          <option value="">Select timeline</option>
                          {TIMELINES.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <label className={label} htmlFor="enrol-name">
                          Your name
                        </label>
                        <input
                          id="enrol-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          autoComplete="name"
                          placeholder="Jane Doe"
                          className={field}
                        />
                      </div>
                      <div>
                        <label className={label} htmlFor="enrol-email">
                          Email
                        </label>
                        <input
                          id="enrol-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                          placeholder="jane@example.com"
                          className={field}
                        />
                      </div>
                      <div>
                        <label className={label} htmlFor="enrol-phone">
                          Phone
                        </label>
                        <input
                          id="enrol-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          autoComplete="tel"
                          placeholder="+91 98765 43210"
                          className={field}
                        />
                      </div>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="mt-9 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      disabled={step === 0}
                      className="text-ink-soft hover:text-ink inline-flex items-center gap-2 rounded-full px-2 py-2 text-[0.9375rem] font-medium transition-colors disabled:invisible"
                    >
                      <ArrowLeft
                        className="size-4"
                        strokeWidth={2}
                        aria-hidden
                      />
                      Back
                    </button>

                    {step < STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setStep((s) => s + 1)}
                        disabled={!stepValid}
                        className="group bg-ink hover:bg-brand-deep disabled:hover:bg-ink inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.9375rem] font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next
                        <ArrowRight
                          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                          strokeWidth={2.25}
                          aria-hidden
                        />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!stepValid || status === "sending"}
                        className="bg-ink hover:bg-brand-deep disabled:hover:bg-ink inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.9375rem] font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {status === "sending" ? "Sending…" : "Send application"}
                      </button>
                    )}
                  </div>

                  <p aria-live="polite" className="sr-only">
                    {status === "error" ? `Not sent. ${errorMessage}` : ""}
                  </p>

                  {status === "error" && (
                    <p className="border-amber/30 bg-amber-wash text-amber-deep mt-5 rounded-xl border px-4 py-3 text-[0.875rem] leading-relaxed">
                      {errorMessage} You can also email us directly at{" "}
                      <a
                        href={`mailto:${company.email}`}
                        className="underline underline-offset-2"
                      >
                        {company.email}
                      </a>
                      .
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
