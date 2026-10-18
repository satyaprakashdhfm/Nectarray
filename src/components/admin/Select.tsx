"use client";

import {
  Children,
  Fragment,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { Dropdown, type DropdownOption } from "@/components/admin/Dropdown";

type OptionProps = { value?: string | number; children?: ReactNode };
type GroupProps = { label?: string; children?: ReactNode };

/** The words inside an <option>. */
function text(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(text).join("");
  if (isValidElement<{ children?: ReactNode }>(node))
    return text(node.props.children);
  return "";
}

/** The <option>s and <optgroup>s written inside a Select, in order. */
function readOptions(children: ReactNode, group?: string): DropdownOption[] {
  const out: DropdownOption[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const el = child as ReactElement<OptionProps & GroupProps>;
    if (el.type === "option") {
      const label = text(el.props.children);
      out.push({
        value: String(el.props.value ?? label),
        label,
        ...(group !== undefined ? { group } : {}),
      });
    } else if (el.type === "optgroup") {
      out.push(...readOptions(el.props.children, el.props.label ?? ""));
    } else if (el.type === Fragment) {
      out.push(...readOptions(el.props.children, group));
    } else if (typeof el.type === "function") {
      // A small component that only returns options, like StatusOptions.
      const made = (el.type as (props: unknown) => ReactNode)(el.props);
      out.push(...readOptions(made, group));
    }
  });
  return out;
}

/**
 * A drop-in for <select>: the same props and the same <option> children,
 * but the open list is drawn by Dropdown, so the row under the pointer is
 * always brand blue (the browser's own list on Windows paints it white on
 * white). With a `name`, a hidden <select> carries the value, so forms
 * submit it and a form's change listeners (autosave) hear each pick.
 */
export function Select({
  name,
  value,
  defaultValue,
  onChange,
  className,
  id,
  title,
  disabled,
  required,
  children,
  "aria-label": ariaLabel,
}: {
  name?: string;
  value?: string | number;
  defaultValue?: string | number | null;
  onChange?: (event: { target: { value: string; name?: string } }) => void;
  className?: string;
  id?: string;
  title?: string;
  disabled?: boolean;
  required?: boolean;
  children?: ReactNode;
  "aria-label"?: string;
}) {
  const options = useMemo(() => readOptions(children), [children]);
  const controlled = value !== undefined;
  const [inner, setInner] = useState(() => {
    const start = defaultValue == null ? "" : String(defaultValue);
    return options.some((o) => o.value === start)
      ? start
      : (options[0]?.value ?? "");
  });
  const current = controlled ? String(value) : inner;

  // After a pick, the hidden select tells the form it changed.
  const native = useRef<HTMLSelectElement>(null);
  const [told, setTold] = useState(0);
  useEffect(() => {
    if (told)
      native.current?.dispatchEvent(new Event("change", { bubbles: true }));
  }, [told]);

  const pick = (next: string) => {
    if (!controlled) setInner(next);
    onChange?.({ target: { value: next, name } });
    if (name) setTold((n) => n + 1);
  };

  return (
    <>
      <Dropdown
        value={current}
        options={options}
        onChange={pick}
        disabled={disabled}
        className={className}
        unstyled={Boolean(className)}
        id={id}
        title={title}
        aria-label={ariaLabel}
      />
      {name && (
        <select
          ref={native}
          name={name}
          value={current}
          onChange={() => {}}
          required={required}
          hidden
          tabIndex={-1}
          aria-hidden
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
