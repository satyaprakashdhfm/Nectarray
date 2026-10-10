"use client";

import { useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  X,
} from "lucide-react";
import { FileIcon } from "@/components/admin/DriveFileIcon";
import { fileSize } from "@/lib/file-size";

type ViewerFile = { id: string; name: string; type: string; size: number };

/** Files the browser can show by itself in a frame. */
const framed = (type: string) =>
  type === "application/pdf" || type.startsWith("text/");

/**
 * A folder's files one at a time over the page, like Google Drive's
 * preview: arrows (or the arrow keys, or a swipe) move to the previous and
 * next file, Escape or the cross closes it. View only; files that the
 * browser cannot show offer a download instead.
 */
export function DriveViewer({
  files,
  index,
  hrefOf,
  onIndex,
  onClose,
}: {
  files: ViewerFile[];
  index: number;
  hrefOf: (id: string, download?: boolean) => string;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const swipeFrom = useRef<number | null>(null);
  const file = files[index];
  const hasPrev = index > 0;
  const hasNext = index < files.length - 1;
  const go = (step: -1 | 1) => {
    const next = index + step;
    if (next >= 0 && next < files.length) onIndex(next);
  };

  // A modal dialog traps focus and sits above everything; the page behind
  // must not scroll while it is open.
  useEffect(() => {
    dialog.current?.showModal();
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = before;
    };
  }, []);

  // Fetch the pictures either side, so the arrows feel instant.
  useEffect(() => {
    for (const near of [files[index - 1], files[index + 1]])
      if (near?.type.startsWith("image/")) new Image().src = hrefOf(near.id);
  }, [files, index, hrefOf]);

  if (!file) return null;
  const href = hrefOf(file.id);
  const downloadHref = hrefOf(file.id, true);
  const round =
    "flex size-10 items-center justify-center rounded-full text-zinc-100 transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white";

  return (
    <dialog
      ref={dialog}
      aria-label={file.name}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        // A playing video uses the arrow keys to seek.
        if (e.target instanceof HTMLMediaElement) return;
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-zinc-100 backdrop:bg-zinc-950/95"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center gap-2 px-2 py-2 sm:gap-3 sm:px-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            title="Close (Esc)"
            className={round}
          >
            <X className="size-5" aria-hidden />
          </button>
          <FileIcon
            type={file.type}
            name={file.name}
            className="size-5 text-zinc-400"
          />
          <p className="min-w-0 flex-1 truncate text-[0.9375rem] font-semibold">
            {file.name}
          </p>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label="Open in a new tab"
            title="Open in a new tab"
            className={round}
          >
            <ExternalLink className="size-[1.125rem]" aria-hidden />
          </a>
          <a
            href={downloadHref}
            aria-label="Download"
            title="Download"
            className={round}
          >
            <Download className="size-5" aria-hidden />
          </a>
        </header>

        <div
          className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-4 sm:px-20"
          onPointerDown={(e) => {
            if (e.pointerType !== "mouse") swipeFrom.current = e.clientX;
          }}
          onPointerUp={(e) => {
            const from = swipeFrom.current;
            swipeFrom.current = null;
            if (from === null) return;
            const moved = e.clientX - from;
            if (Math.abs(moved) > 60) go(moved > 0 ? -1 : 1);
          }}
          onClick={(e) => {
            // A click on the dark space around the file closes it.
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <Stage
            key={file.id}
            file={file}
            href={href}
            download={downloadHref}
          />

          {hasPrev && (
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous file"
              className={`${round} absolute top-1/2 left-2 size-11 -translate-y-1/2 bg-zinc-800/80 sm:left-4 sm:size-12`}
            >
              <ChevronLeft className="size-6" aria-hidden />
            </button>
          )}
          {hasNext && (
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next file"
              className={`${round} absolute top-1/2 right-2 size-11 -translate-y-1/2 bg-zinc-800/80 sm:right-4 sm:size-12`}
            >
              <ChevronRight className="size-6" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}

function Stage({
  file,
  href,
  download,
}: {
  file: ViewerFile;
  href: string;
  download: string;
}) {
  if (file.type.startsWith("image/"))
    return (
      // eslint-disable-next-line @next/next/no-img-element -- a signed, private link; next/image's optimiser cannot fetch it
      <img
        src={href}
        alt={file.name}
        draggable={false}
        className="max-h-full max-w-full rounded-md object-contain shadow-2xl select-none"
      />
    );
  if (file.type.startsWith("video/"))
    return (
      <video
        src={href}
        controls
        playsInline
        className="max-h-full max-w-full rounded-md shadow-2xl"
      />
    );
  if (file.type.startsWith("audio/"))
    return <audio src={href} controls className="w-full max-w-md" />;
  if (framed(file.type))
    return (
      <iframe
        src={href}
        title={file.name}
        className="h-full w-full max-w-5xl rounded-md bg-white shadow-2xl"
      />
    );
  return (
    <div className="flex max-w-sm flex-col items-center rounded-xl bg-zinc-900 px-8 py-10 text-center">
      <FileIcon
        type={file.type}
        name={file.name}
        className="size-14 text-zinc-500"
      />
      <p className="mt-4 text-[0.9375rem] font-semibold break-all">
        {file.name}
      </p>
      <p className="mt-1 text-[0.8125rem] text-zinc-400">
        {fileSize(file.size)}. This kind of file cannot be shown here.
      </p>
      <a
        href={download}
        className="bg-brand-solid text-cta-fg mt-5 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[0.8125rem] font-semibold transition-opacity hover:opacity-90 active:scale-[0.98]"
      >
        <Download className="size-4" aria-hidden />
        Download
      </a>
    </div>
  );
}
