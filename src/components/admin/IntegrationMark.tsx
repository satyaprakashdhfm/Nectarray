import {
  siFirebase,
  siGooglemaps,
  siPhonepe,
  siRazorpay,
  siResend,
  siWhatsapp,
} from "simple-icons";
import { cn } from "@/lib/utils";

/** Brand marks Simple Icons has; the rest get their initial. */
const MARKS: Record<string, { path: string }> = {
  razorpay: siRazorpay,
  phonepe: siPhonepe,
  whatsapp: siWhatsapp,
  resend: siResend,
  "google-maps": siGooglemaps,
  "firebase-auth": siFirebase,
};

/**
 * A provider's mark on a small tile. Drawn in the ink colour rather than
 * the brand's own, so a black logo (Resend) still shows on the dark theme
 * and a page of twelve providers does not turn into twelve colours.
 */
export function IntegrationMark({
  slug,
  name,
  size = "md",
}: {
  slug: string;
  name: string;
  size?: "md" | "lg";
}) {
  const mark = MARKS[slug];
  return (
    <span
      aria-hidden
      className={cn(
        "bg-mist border-line text-ink inline-flex shrink-0 items-center justify-center rounded-lg border font-semibold",
        size === "lg" ? "size-14 text-[1.375rem]" : "size-10 text-[1rem]",
      )}
    >
      {mark ? (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={size === "lg" ? "size-7" : "size-5"}
        >
          <path d={mark.path} />
        </svg>
      ) : (
        name.charAt(0)
      )}
    </span>
  );
}
