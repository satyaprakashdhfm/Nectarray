import Link from "next/link";
import { Clock, Mail } from "lucide-react";
import { RedeemCode } from "@/components/dashboard/RedeemCode";
import { company } from "@/lib/content";

const COPY: Record<string, { title: string; body: string }> = {
  none: {
    title: "You have not applied yet",
    body: "Your account exists, but there is no application against a cohort. Apply and we will read it ourselves — five seats means we reply to every one.",
  },
  applied: {
    title: "Your application is with us",
    body: "We read every application personally and reply within one business day, usually with a question or two about where you are starting from.",
  },
  accepted: {
    title: "You are accepted — one step left",
    body: "We have offered you a seat. Once the paperwork is settled we will switch you to enrolled and the full course opens here.",
  },
  withdrawn: {
    title: "This enrolment is closed",
    body: "Your seat in this cohort is no longer active. If that looks wrong, write to us and we will sort it out.",
  },
};

/**
 * What a signed-in-but-not-enrolled student sees instead of the course.
 *
 * Signing up creates an account, not a seat. Five seats sell out, and the
 * material is the product — so the dashboard shows status until an admin
 * moves the enrolment to 'enrolled'.
 */
export function EnrolmentGate({ status }: { status: string }) {
  const copy = COPY[status] ?? COPY.none;

  return (
    <div className="card p-8 text-center sm:p-12">
      <span className="bg-amber-wash text-amber-deep mx-auto grid size-14 place-items-center rounded-full">
        <Clock className="size-7" strokeWidth={2} aria-hidden />
      </span>

      <h2 className="display text-ink mt-6 text-[1.5rem]">{copy.title}</h2>
      <p className="text-ink-soft mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed">
        {copy.body}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {status === "none" && (
          <Link
            href="/academy#enrol"
            className="bg-ink hover:bg-brand-deep inline-flex rounded-full px-6 py-3 text-[0.9375rem] font-semibold text-white transition-colors"
          >
            Apply for a seat
          </Link>
        )}
        <a
          href={`mailto:${company.email}`}
          className="border-line bg-canvas text-ink hover:border-brand hover:text-brand-deep inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[0.9375rem] font-semibold transition-colors"
        >
          <Mail className="size-4" strokeWidth={2} aria-hidden />
          {company.email}
        </a>
      </div>
    </div>
  );
}

/**
 * The gate plus the redeem box. `completed` and `enrolled` never reach here,
 * and a withdrawn student is not offered a code — that would let a refunded
 * seat be reopened with an old code.
 */
export function EnrolmentPanel({ status }: { status: string }) {
  return (
    <div className="space-y-5">
      <EnrolmentGate status={status} />
      {status !== "withdrawn" && <RedeemCode />}
    </div>
  );
}
