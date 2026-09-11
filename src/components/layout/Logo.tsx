import Image from "next/image";
import Link from "next/link";
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
    <Link
      href="/"
      className={cn("flex items-center gap-2", className)}
      aria-label={`${company.name} — home`}
    >
      <Image
        src="/logo-mark.png"
        alt=""
        width={329}
        height={293}
        // Drawn at 2.25–2.75rem everywhere it appears. Without this the
        // browser assumed the full 329px and fetched a 384–750px copy — 44 KB
        // for a mark the size of a thumbnail, preloaded on every page. At
        // 2.5rem a 3x phone takes the 128px copy (11 KB); a hint any larger
        // tips it to the 256px one, which is three times the weight.
        sizes="2.5rem"
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
    </Link>
  );
}
