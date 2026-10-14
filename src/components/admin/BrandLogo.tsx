import {
  siFirebase,
  siGithub,
  siGoogle,
  siGoogleads,
  siGoogleanalytics,
  siGooglegemini,
  siGooglemaps,
  siGooglesearchconsole,
  siGoogletagmanager,
  siMeta,
  siPhonepe,
  siRailway,
  siRazorpay,
  siResend,
  siSupabase,
  siVercel,
  siWhatsapp,
  siZoho,
} from "simple-icons";

/**
 * A small brand mark before a company's name in the price book (plans,
 * providers, column headings), so rows can be told apart at a glance.
 * Simple Icons marks in their brand colours; Microsoft's four squares are
 * drawn here; brands Simple Icons lacks get their initial on a tile of
 * their colour. Nothing for any other name.
 */

type Mark =
  | { icon: { path: string; hex: string }; color?: string }
  | { squares: true }
  | { letter: string; color: string };

/** Most specific first: "Google Maps" before "Google". */
const MARKS: [RegExp, Mark][] = [
  [/^google workspace\b/i, { icon: siGoogle }],
  [/^google maps\b/i, { icon: siGooglemaps }],
  [/^google gemini\b|^gemini\b/i, { icon: siGooglegemini }],
  [/^google analytics\b/i, { icon: siGoogleanalytics }],
  [/^google search console\b/i, { icon: siGooglesearchconsole }],
  [/^google tag manager\b/i, { icon: siGoogletagmanager }],
  [/^google ads\b/i, { icon: siGoogleads }],
  [/^google\b/i, { icon: siGoogle }],
  [/^microsoft\b/i, { squares: true }],
  [/^zoho\b/i, { icon: siZoho }],
  [/^razorpay\b/i, { icon: siRazorpay }],
  [/^phonepe\b/i, { icon: siPhonepe }],
  [/^whatsapp\b/i, { icon: siWhatsapp }],
  [/^resend\b/i, { icon: siResend, color: "currentColor" }],
  [/^firebase\b/i, { icon: siFirebase }],
  [/^meta\b/i, { icon: siMeta }],
  [/^railway\b/i, { icon: siRailway, color: "currentColor" }],
  [/^vercel\b/i, { icon: siVercel, color: "currentColor" }],
  [/^supabase\b/i, { icon: siSupabase }],
  [/^github\b/i, { icon: siGithub, color: "currentColor" }],
  [/^payu\b/i, { letter: "P", color: "#3db54a" }],
  [/^cashfree\b/i, { letter: "C", color: "#6933d3" }],
  [/^shiprocket\b/i, { letter: "S", color: "#7546f0" }],
  [/^delhivery\b/i, { letter: "D", color: "#e31e24" }],
  [/^porter\b/i, { letter: "P", color: "#1f4ef5" }],
  [/^msg91\b/i, { letter: "M", color: "#0b5cff" }],
  [/^ola\b/i, { letter: "O", color: "#2b7a3d" }],
  [/^groq\b/i, { letter: "G", color: "#f55036" }],
];

const markFor = (name: string) => MARKS.find(([re]) => re.test(name))?.[1];

export const hasBrandLogo = (name: string) => !!markFor(name);

export function BrandLogo({ name }: { name: string }) {
  const mark = markFor(name);
  if (!mark) return null;
  if ("letter" in mark)
    return (
      <span
        aria-hidden
        style={{ backgroundColor: mark.color }}
        className="inline-grid size-3.5 shrink-0 place-items-center rounded-[3px] text-[0.5625rem] leading-none font-bold text-white"
      >
        {mark.letter}
      </span>
    );
  if ("squares" in mark)
    return (
      <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" aria-hidden>
        <rect x="1" y="1" width="10.5" height="10.5" fill="#f25022" />
        <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7fba00" />
        <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00a4ef" />
        <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#ffb900" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" aria-hidden>
      <path d={mark.icon.path} fill={mark.color ?? `#${mark.icon.hex}`} />
    </svg>
  );
}
