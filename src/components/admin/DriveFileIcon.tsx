import {
  File,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** The icon for a Drive file, from its type and, failing that, its name. */
export function FileIcon({
  type,
  name,
  className,
}: {
  type: string;
  name: string;
  className?: string;
}) {
  const props = {
    className: cn("shrink-0", className ?? "text-ink-soft size-5"),
    strokeWidth: 1.7,
    "aria-hidden": true,
  } as const;
  if (type.startsWith("image/")) return <FileImage {...props} />;
  if (type.startsWith("video/")) return <FileVideo {...props} />;
  if (/zip|rar|7z|tar|gzip/.test(type) || /\.(zip|rar|7z|tar|gz)$/i.test(name))
    return <FileArchive {...props} />;
  if (/sheet|excel|csv/.test(type) || /\.(xlsx?|csv)$/i.test(name))
    return <FileSpreadsheet {...props} />;
  if (/pdf|word|document|text/.test(type)) return <FileText {...props} />;
  return <File {...props} />;
}
