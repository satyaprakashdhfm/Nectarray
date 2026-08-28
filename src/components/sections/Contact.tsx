"use client";

import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { company, contact } from "@/lib/content";

/**
 * There is no backend yet, so the form composes a pre-filled email and hands
 * it to the visitor's mail client. Nothing is stored or sent by the page.
 *
 * To move to a real endpoint later, replace `handleSubmit` with a POST to
 * your API route / Formspree / Resend handler — the markup below does not
 * need to change.
 */
export function Contact() {
  const [interest, setInterest] = useState(contact.interests[0]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const subject = `${data.get("interest")} — enquiry from ${data.get("name")}`;
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Company: ${data.get("company") || "—"}`,
      `Interested in: ${data.get("interest")}`,
      "",
      data.get("message"),
    ].join("\n");

    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
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

      <div className="shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHead
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
          <form
            onSubmit={handleSubmit}
            className="border-night-line bg-night-soft/70 rounded-2xl border p-7 backdrop-blur sm:p-9"
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
              className="text-ink hover:bg-leaf hover:text-night mt-7 w-full rounded-full bg-white px-6 py-3.5 text-[0.9375rem] font-semibold transition-colors"
            >
              Send enquiry
            </button>

            <p className="mt-4 text-center text-[0.8125rem] leading-relaxed text-white/40">
              This opens your email app with the message ready to send. Prefer
              to write directly? {""}
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
