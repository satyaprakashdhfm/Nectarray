import Image from "next/image";
import { company } from "@/lib/content";
import { cn } from "@/lib/utils";

/** The circuit mark plus the wordmark, painted with the brand gradient. */
export function Logo({
  className,
  markClassName = "size-10",
  wordClassName = "text-[1.35rem]",
  priority = false,
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  priority?: boolean;
}) {
  return (
    <a
      href="#top"
      className={cn("flex items-center gap-2", className)}
      aria-label={`${company.name} — home`}
    >
      <Image
        src="/logo-mark.png"
        alt=""
        width={329}
        height={293}
        priority={priority}
        className={cn("object-contain", markClassName)}
      />
      <span
        className={cn(
          "display ink-gradient tracking-[-0.03em] italic",
          wordClassName,
        )}
      >
        {company.name}
      </span>
    </a>
  );
}
