"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropdownOption = {
  value: string;
  label: string;
  /** Options sharing a group are listed under its name. */
  group?: string;
};

/**
 * A select whose open list we draw ourselves. The browser's own list
 * could not be trusted to show which row the pointer is on: on Windows it
 * painted the hovered row white on white. Here the row under the pointer
 * or the arrow keys is always brand blue, in every browser and theme.
 *
 * Behaves like a select: focus stays on the button, the arrow keys, Home,
 * End and typing a letter move through the list, Enter or Space picks,
 * Escape and Tab close. The list sits in a portal above everything, so a
 * scrolling table cannot clip it.
 */
export function Dropdown({
  value,
  options,
  onChange,
  disabled,
  className,
  "aria-label": ariaLabel,
}: {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [place, setPlace] = useState<{
    left: number;
    width: number;
    top?: number;
    bottom?: number;
    maxHeight: number;
  } | null>(null);

  const selected = options.findIndex((o) => o.value === value);
  const current = options[selected];

  const show = () => {
    if (disabled || options.length === 0) return;
    setActive(Math.max(selected, 0));
    setOpen(true);
  };
  const choose = (index: number) => {
    const option = options[index];
    if (option && option.value !== value) onChange(option.value);
    setOpen(false);
    button.current?.focus();
  };

  // Below the button, or above it when there is more room there.
  useLayoutEffect(() => {
    if (!open) return;
    const measure = () => {
      const box = button.current?.getBoundingClientRect();
      if (!box) return;
      const below = window.innerHeight - box.bottom - 8;
      const above = box.top - 8;
      const width = Math.max(box.width, 192);
      const left = Math.min(box.left, window.innerWidth - width - 8);
      setPlace(
        below >= 240 || below >= above
          ? {
              left,
              width,
              top: box.bottom + 4,
              maxHeight: Math.min(320, below),
            }
          : {
              left,
              width,
              bottom: window.innerHeight - box.top + 4,
              maxHeight: Math.min(320, above),
            },
      );
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open]);

  // A click anywhere else closes the list.
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      const target = event.target as Node;
      if (button.current?.contains(target) || list.current?.contains(target))
        return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  // Keep the highlighted row in view while moving with the keys.
  useEffect(() => {
    if (!open) return;
    list.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active, place]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        show();
      }
      return;
    }
    const move = (index: number) => {
      event.preventDefault();
      setActive(Math.min(Math.max(index, 0), last));
    };
    if (event.key === "ArrowDown") move(active + 1);
    else if (event.key === "ArrowUp") move(active - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(last);
    else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(active);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Tab") setOpen(false);
    else if (event.key.length === 1) {
      // Typing a letter jumps to the next option that starts with it.
      const letter = event.key.toLowerCase();
      for (let step = 1; step <= options.length; step++) {
        const index = (active + step) % options.length;
        if (options[index].label.toLowerCase().startsWith(letter)) {
          move(index);
          break;
        }
      }
    }
  };

  return (
    <>
      <button
        ref={button}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
        className={cn(
          "border-line bg-surface text-ink focus:border-brand flex h-10 w-full items-center gap-2 rounded-lg border px-3 text-left text-[0.875rem] outline-none disabled:cursor-not-allowed",
          className,
        )}
      >
        <span className="min-w-0 flex-1 truncate">{current?.label ?? ""}</span>
        <ChevronDown
          className={cn(
            "text-ink-faint size-4 shrink-0 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open &&
        place &&
        createPortal(
          <ul
            ref={list}
            id={`${id}-list`}
            role="listbox"
            aria-label={ariaLabel}
            style={{
              position: "fixed",
              left: place.left,
              width: place.width,
              top: place.top,
              bottom: place.bottom,
              maxHeight: place.maxHeight,
            }}
            className="border-line bg-surface text-ink z-[70] overflow-y-auto rounded-lg border p-1 text-[0.875rem] shadow-[0_12px_32px_rgb(14_27_38/0.18)]"
          >
            {options.map((option, index) => {
              const heading =
                option.group !== undefined &&
                option.group !== options[index - 1]?.group;
              const isActive = index === active;
              const isSelected = index === selected;
              return (
                <li key={option.value} role="presentation">
                  {heading && (
                    <p
                      role="presentation"
                      className="text-ink-faint px-2.5 pt-2 pb-1 text-[0.75rem] font-semibold"
                    >
                      {option.group}
                    </p>
                  )}
                  <div
                    id={`${id}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    data-index={index}
                    onPointerMove={() => setActive(index)}
                    onClick={() => choose(index)}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5",
                      isActive ? "bg-brand text-white" : "text-ink",
                      isSelected && "font-semibold",
                    )}
                  >
                    <Check
                      className={cn(
                        "size-3.5 shrink-0",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">{option.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </>
  );
}
