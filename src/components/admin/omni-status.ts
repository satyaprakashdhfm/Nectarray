import type { OmniStatus } from "@/lib/omniproof";

/** The status chip on the Omniproof list and in its editor. */
export const STATUS_TONE: Record<OmniStatus, string> = {
  draft: "bg-amber-wash text-amber-deep",
  published: "bg-leaf-wash text-leaf-deep",
  archived: "bg-mist text-ink-faint",
};
