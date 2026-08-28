import { ArrowRight } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "onDark";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full text-[0.9375rem] font-semibold tracking-tight transition-all duration-300 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-white px-6 py-3.5 hover:bg-brand-deep shadow-[0_8px_24px_-12px_rgba(14,27,38,0.5)] hover:shadow-[0_12px_28px_-10px_rgba(20,127,174,0.55)]",
  secondary:
    "bg-surface text-ink px-6 py-3.5 border border-line hover:border-brand hover:text-brand-deep",
  ghost: "text-ink px-1 py-1 hover:text-brand-deep",
  onDark:
    "bg-white text-ink px-6 py-3.5 hover:bg-leaf hover:text-night shadow-[0_8px_28px_-12px_rgba(0,0,0,0.6)]",
};

export function Button({
  href,
  children,
  variant = "primary",
  withArrow = true,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  withArrow?: boolean;
  className?: string;
}) {
  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      {withArrow && (
        <ArrowRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={2.25}
          aria-hidden
        />
      )}
    </a>
  );
}
