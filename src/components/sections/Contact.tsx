"use client";

import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { trackEvent } from "@/lib/analytics";
import { company, contact } from "@/lib/content";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Posts the enquiry to /api/contact, which sends it on through Resend.
 *
 * The generate_lead event fires only on a confirmed 200 from the endpoint, so
 * it counts real enquiries rather than form submissions that failed — which
 * is what makes it usable as a Google Ads conversion.
 */
/**
 * `asPage` is set when this section is the body of its own route rather than
 * one of several on the homepage, and promotes its heading to that page's h1.
 * The offset for the fixed header lives on <main>, so the section keeps its
 * own vertical rhythm either way.
 */
export function Contact({ asPage = false }: { asPage?: boolean } = {}) {
  const [interest, setInterest] = useState(contact.interests[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          interest: data.get("interest"),
          message: data.get("message"),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "That did not go through.");
      }

      trackEvent("generate_lead", {
        interest: String(data.get("interest") ?? "unknown"),
        method: "form",
      });

      form.reset();
      setInterest(contact.interests[0]);
      setStatus("sent");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "That did not go through.",
      );
      setStatus("error");
    }
  }

  const field =
    "w-full rounded-xl border border-line bg-canvas px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink-faint transition-colors focus:border-brand focus:bg-surface focus:outline-none";
  // the form sits on the dark section, so labels are light
  const label = "mb-2 block text-[0.8125rem] font-semibold text-white";

  return (
    <section
      id="contact"
      className="bg-night relative overflow-hidden py-24 text-white sm:py-28 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [mask-image:radial-gradient(100%_70%_at_50%_0%,#000_30%,transparent_78%)] [background-size:46px_46px] opacity-50" />
        <div className="bg-leaf/14 absolute top-0 -left-20 size-[28rem] rounded-full blur-[130px]" />
        <div className="bg-brand/18 absolute -right-24 bottom-0 size-[30rem] rounded-full blur-[130px]" />
      </div>

      <div className="shell-wide grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHead
            as={asPage ? "h1" : "h2"}
            onDark
            eyebrow={contact.eyebrow}
            title={
              <>
                Tell us what <em>you are building.</em>
              </>
            }
            lede={contact.lede}
          />

          <Reveal delay={160}>
            <ul className="mt-10 space-y-3">
              {[
                {
                  icon: Mail,
                  text: company.email,
                  href: `mailto:${company.email}`,
                },
                {
                  icon: Phone,
                  text: company.phone,
                  href: `tel:${company.phone.replace(/\s/g, "")}`,
                },
                { icon: MapPin, text: company.location, href: null },
              ].map(({ icon: Glyph, text, href }) => {
                const inner = (
                  <>
                    <span className="text-leaf grid size-9 shrink-0 place-items-center rounded-lg bg-white/6">
                      <Glyph
                        className="size-4"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </span>
                    <span className="text-[0.9375rem] text-white/80">
                      {text}
                    </span>
                  </>
                );
                return (
                  <li key={text}>
                    {href ? (
                      <a
                        href={href}
                        className="flex items-center gap-3.5 transition-colors hover:text-white"
                      >
                        {inner}
                      </a>
                    ) : (
                      <span className="flex items-center gap-3.5">{inner}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>

        {/* Form ----------------------------------------------------------- */}
        <Reveal delay={120}>
          {/*
           * `id` so a CTA elsewhere can land on the form itself rather than
           * at the top of this page. This section shares its ground and its
           * email/phone/location list with the footer, so arriving at the top
           * of it reads as having been dumped in a footer — the form is the
           * part that makes it obvious something happened.
           *
           * scroll-mt clears the fixed 72px header, which would otherwise
           * cover the first field.
           */}
          <form
            id="enquiry"
            onSubmit={handleSubmit}
            className="border-night-line bg-night-soft/70 scroll-mt-[88px] rounded-2xl border p-7 backdrop-blur sm:p-9"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="name">
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Jane Doe"
                  className={field}
                />
              </div>
              <div>
                <label className={label} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="jane@company.com"
                  className={field}
                />
              </div>
            </div>

            <div className="mt-5">
              <label className={label} htmlFor="company">
                Company{" "}
                <span className="font-normal text-white/40">(optional)</span>
              </label>
              <input
                id="company"
                name="company"
                autoComplete="organization"
                placeholder="Acme Pvt Ltd"
                className={field}
              />
            </div>

            <fieldset className="mt-7">
              <legend className={label}>What is this about?</legend>
              <input type="hidden" name="interest" value={interest} />
              <div className="flex flex-wrap gap-2">
                {contact.interests.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setInterest(option)}
                    aria-pressed={interest === option}
                    className={`rounded-full border px-3.5 py-2 text-[0.875rem] font-medium transition-colors ${
                      interest === option
                        ? "border-leaf bg-leaf/15 text-leaf"
                        : "border-night-line text-white/60 hover:border-white/25 hover:text-white/85"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-6">
              <label className={label} htmlFor="message">
                Tell us a little more
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="What are you trying to build or fix, and by when?"
                className={`${field} resize-y`}
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="text-ink hover:bg-leaf hover:text-night disabled:hover:text-ink mt-7 w-full rounded-full bg-white px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-white"
            >
              {status === "sending" ? "Sending…" : "Send enquiry"}
            </button>

            {/* Announced to screen readers as it changes, not just shown */}
            <p aria-live="polite" className="sr-only">
              {status === "sent"
                ? "Your enquiry was sent."
                : status === "error"
                  ? `Not sent. ${errorMessage}`
                  : ""}
            </p>

            {status === "sent" && (
              <p className="border-leaf/30 bg-leaf/10 text-leaf mt-4 rounded-xl border px-4 py-3 text-center text-[0.875rem] leading-relaxed">
                Thanks — that reached us. We reply to every enquiry within one
                business day.
              </p>
            )}

            {status === "error" && (
              <p className="border-amber/30 bg-amber/10 text-amber mt-4 rounded-xl border px-4 py-3 text-center text-[0.875rem] leading-relaxed">
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

            <p className="mt-4 text-center text-[0.8125rem] leading-relaxed text-white/40">
              Prefer to write directly?{" "}
              <a
                href={`mailto:${company.email}`}
                className="text-leaf underline underline-offset-2"
              >
                {company.email}
              </a>
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
