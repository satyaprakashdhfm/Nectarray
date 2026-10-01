"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type Head = { styles: string; fonts: string };
let cachedHead: Head | null = null;
const noop = () => () => {};

/**
 * This page's stylesheets and font classes, read from the document once.
 * Through useSyncExternalStore so the server, which has no document, renders
 * the placeholder and the browser fills it in after hydration.
 */
function pageHead(): Head {
  if (!cachedHead) {
    cachedHead = {
      styles: Array.from(
        document.querySelectorAll('link[rel="stylesheet"], style'),
      )
        .map((node) => node.outerHTML)
        .join(""),
      fonts: document.documentElement.className,
    };
  }
  return cachedHead;
}

/**
 * A piece of HTML shown in its own iframe, the way it would sit on a page.
 *
 * An iframe rather than a div because the previews have to answer to their
 * own width: a phone-width preview should get the phone layout, and media
 * queries only listen to the window they are in. The frame borrows this
 * page's stylesheets, so the Tailwind classes in the snippets just work, and
 * the palette arrives as CSS variables on its root.
 *
 * Sandboxed without scripts or forms: buttons and links in a preview look
 * real but go nowhere.
 *
 * `width` fixes the frame's own width (a phone is 390). With `fit`, a wide
 * frame is scaled down to fit the space it is given, which is how the small
 * sample sites on the Colours tab are drawn.
 */
export function PreviewFrame({
  html,
  vars,
  title,
  width,
  fit = false,
  minHeight = 80,
  interactive = false,
}: {
  html: string;
  vars: Record<string, string>;
  title: string;
  width?: number;
  fit?: boolean;
  minHeight?: number;
  /** Let clicks reach the preview: fields can be typed in, tabs opened. */
  interactive?: boolean;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const head = useSyncExternalStore(noop, pageHead, () => null);
  // The colours the frame is first written with; later ones are pushed in.
  const [firstVars] = useState(vars);
  const [height, setHeight] = useState(minHeight);
  const [boxWidth, setBoxWidth] = useState(0);

  // The palette, pushed in whenever it changes, without reloading the frame.
  useEffect(() => {
    const root = frame.current?.contentDocument?.documentElement;
    if (!root) return;
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
  }, [vars, head]);

  useEffect(() => {
    if (!fit || !box.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setBoxWidth(entry.contentRect.width),
    );
    observer.observe(box.current);
    return () => observer.disconnect();
  }, [fit, head]);

  function onLoad() {
    const doc = frame.current?.contentDocument;
    if (!doc) return;
    for (const [k, v] of Object.entries(vars)) {
      doc.documentElement.style.setProperty(k, v);
    }
    const measure = () =>
      setHeight(Math.max(minHeight, doc.documentElement.scrollHeight));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(doc.body);
    // Images arriving late change the height after the first measure.
    doc
      .querySelectorAll("img")
      .forEach((img) => img.addEventListener("load", measure, { once: true }));
  }

  if (head === null) {
    return (
      <div
        className="bg-mist animate-pulse rounded-lg"
        style={{ height: minHeight }}
        aria-hidden
      />
    );
  }

  const root = Object.entries(firstVars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  const srcDoc = `<!doctype html><html class="${head.fonts}" style="${root}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${head.styles}<style>html,body{margin:0;background:#fff;color-scheme:light}body{min-height:0}</style></head><body>${html}</body></html>`;

  const scale = fit && width && boxWidth ? Math.min(1, boxWidth / width) : 1;

  const iframe = (
    <iframe
      ref={frame}
      title={title}
      srcDoc={srcDoc}
      onLoad={onLoad}
      sandbox="allow-same-origin"
      loading="lazy"
      className="block border-0 bg-white"
      style={{
        width: width ?? "100%",
        height,
        transform: scale < 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
      }}
    />
  );

  if (fit) {
    return (
      <div
        ref={box}
        className="relative w-full overflow-hidden"
        style={{ height: height * scale }}
      >
        <div
          className={cn(
            "absolute top-0",
            !interactive && "pointer-events-none",
          )}
          style={{
            left:
              width && scale === 1 ? Math.max(0, (boxWidth - width) / 2) : 0,
          }}
        >
          {iframe}
        </div>
      </div>
    );
  }
  return iframe;
}
