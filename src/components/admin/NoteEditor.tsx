"use client";
import { Select } from "@/components/admin/Select";
import { ADMIN } from "@/lib/admin-path";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  EditorContent,
  useEditor,
  useEditorState,
  type Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import { TableKit } from "@tiptap/extension-table";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import {
  Baseline,
  Bold,
  Code,
  Highlighter,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Paperclip,
  Quote,
  Redo2,
  RemoveFormatting,
  SquareCode,
  Strikethrough,
  Table,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
  Underline,
  Undo2,
  Unlink,
} from "lucide-react";
import { field, quietButton } from "@/components/admin/Business";
import { cn } from "@/lib/utils";

/** Big enough for a scanned page; under the 10 MB a request may carry. */
const MAX_FILE_BYTES = 8 * 1024 * 1024;

const TEXT_COLOURS = [
  { name: "Default", value: "" },
  { name: "Red", value: "#d93025" },
  { name: "Orange", value: "#e8710a" },
  { name: "Green", value: "#188038" },
  { name: "Blue", value: "#1a73e8" },
  { name: "Purple", value: "#9334e6" },
  { name: "Grey", value: "#80868b" },
];

const HIGHLIGHTS = [
  { name: "None", value: "" },
  { name: "Yellow", value: "#fff3a3" },
  { name: "Green", value: "#cdf5c4" },
  { name: "Blue", value: "#cfe8ff" },
  { name: "Pink", value: "#ffd6e7" },
  { name: "Orange", value: "#ffe0b8" },
];

const STYLES = [
  { id: "p", label: "Normal text" },
  { id: "h1", label: "Heading 1" },
  { id: "h2", label: "Heading 2" },
  { id: "h3", label: "Heading 3" },
] as const;

/**
 * One project note, edited like a document: headings, bold and colours,
 * lists and checklists, links, tables, pictures and attached files.
 * Pictures and files are kept with the project (project_files) and shown
 * from there; the note itself is saved as HTML with the rest of the page.
 */
export function NoteEditor({
  projectId,
  html,
  onChange,
}: {
  projectId: string;
  html: string;
  onChange: (html: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  // The editor's handlers are set up once; these reach the latest editor
  // and the latest onChange from them.
  const self = useRef<Editor | null>(null);
  const changed = useRef(onChange);
  useEffect(() => {
    changed.current = onChange;
  });

  async function upload(file: File) {
    if (file.size > MAX_FILE_BYTES) throw new Error("That file is over 8 MB.");
    const body = new FormData();
    body.set("file", file);
    const res = await fetch(`${ADMIN}/projects/${projectId}/files`, {
      method: "POST",
      body,
    });
    const data = (await res.json().catch(() => ({}))) as {
      id?: string;
      name?: string;
      error?: string;
    };
    if (!res.ok || !data.id) throw new Error(data.error ?? "Could not upload.");
    return {
      url: `${ADMIN}/projects/${projectId}/files/${data.id}`,
      name: data.name ?? file.name,
    };
  }

  /** Pictures go in where the cursor is; other files go in as a link. */
  async function insertFiles(files: File[], at?: number) {
    const editor = self.current;
    if (!editor || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of files) {
        const { url, name } = await upload(file);
        const chain = editor.chain().focus();
        if (at !== undefined) chain.setTextSelection(at);
        if (file.type.startsWith("image/"))
          chain.setImage({ src: url, alt: name }).run();
        else
          chain
            .insertContent([
              {
                type: "text",
                text: `📎 ${name}`,
                marks: [{ type: "link", attrs: { href: url } }],
              },
              { type: "text", text: " " },
            ])
            .run();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not upload.");
    } finally {
      setUploading(false);
    }
  }

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: true,
          autolink: true,
          defaultProtocol: "https",
          HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TableKit.configure({ table: { resizable: false } }),
      Image,
      Placeholder.configure({
        placeholder:
          "Write here. Paste links, pictures or tables straight in; use the bar above for headings, lists and colours.",
      }),
    ],
    content: html,
    editorProps: {
      attributes: { class: "project-note", "aria-label": "Note" },
      handlePaste: (_view, event) => {
        const files = [...(event.clipboardData?.files ?? [])];
        if (files.length === 0) return false;
        void insertFiles(files);
        return true;
      },
      handleDrop: (view, event) => {
        const files = [...(event.dataTransfer?.files ?? [])];
        if (files.length === 0) return false;
        const at = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        })?.pos;
        void insertFiles(files, at);
        return true;
      },
    },
    onCreate: ({ editor }) => {
      self.current = editor;
    },
    onUpdate: ({ editor }) =>
      changed.current(editor.isEmpty ? "" : editor.getHTML()),
  });

  return (
    <div className="border-line bg-surface overflow-hidden rounded-xl border">
      {editor ? (
        <Toolbar editor={editor} onFiles={insertFiles} uploading={uploading} />
      ) : (
        <div className="border-line bg-mist h-[2.875rem] border-b" />
      )}
      {error && (
        <p role="alert" className="text-danger px-4 pt-2 text-[0.75rem]">
          {error}
        </p>
      )}
      <EditorContent editor={editor} />
      {editor && <WordCount editor={editor} />}
    </div>
  );
}

function WordCount({ editor }: { editor: Editor }) {
  const words = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor.getText().split(/\s+/).filter(Boolean).length,
  });
  return (
    <p className="border-line text-ink-faint border-t px-4 py-1.5 text-right text-[0.6875rem] tabular-nums">
      {words.toLocaleString("en-IN")} {words === 1 ? "word" : "words"}
    </p>
  );
}

function Toolbar({
  editor,
  onFiles,
  uploading,
}: {
  editor: Editor;
  onFiles: (files: File[]) => Promise<void>;
  uploading: boolean;
}) {
  const image = useRef<HTMLInputElement>(null);
  const attach = useRef<HTMLInputElement>(null);
  const [linkDraft, setLinkDraft] = useState<string | null>(null);

  const on = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      style: e.isActive("heading", { level: 1 })
        ? "h1"
        : e.isActive("heading", { level: 2 })
          ? "h2"
          : e.isActive("heading", { level: 3 })
            ? "h3"
            : "p",
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      task: e.isActive("taskList"),
      quote: e.isActive("blockquote"),
      codeBlock: e.isActive("codeBlock"),
      link: e.isActive("link"),
      href: (e.getAttributes("link").href as string | undefined) ?? "",
      table: e.isActive("table"),
      align: (["center", "right", "justify"] as const).find((a) =>
        e.isActive({ textAlign: a }),
      ),
      color: (e.getAttributes("textStyle").color as string | undefined) ?? "",
      undo: e.can().undo(),
      redo: e.can().redo(),
    }),
  });

  const run = () => editor.chain().focus();

  function setStyle(id: string) {
    if (id === "p") run().setParagraph().run();
    else
      run()
        .toggleHeading({ level: Number(id.slice(1)) as 1 | 2 | 3 })
        .run();
  }

  function applyLink() {
    const url = (linkDraft ?? "").trim();
    setLinkDraft(null);
    const chain = run().extendMarkRange("link");
    if (!url) {
      chain.unsetLink().run();
      return;
    }
    const href = /^(https?:|mailto:|tel:|\/)/i.test(url)
      ? url
      : `https://${url}`;
    if (editor.state.selection.empty && !on.link)
      // Nothing selected: the address goes in as its own link.
      chain
        .insertContent([
          {
            type: "text",
            text: url,
            marks: [{ type: "link", attrs: { href } }],
          },
          { type: "text", text: " " },
        ])
        .run();
    else chain.setLink({ href }).run();
  }

  const picked = (input: HTMLInputElement | null) => {
    const files = [...(input?.files ?? [])];
    if (input) input.value = "";
    void onFiles(files);
  };

  return (
    <div className="border-line bg-mist sticky top-0 z-10 border-b">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5">
        <Tool
          label="Undo (Ctrl+Z)"
          disabled={!on.undo}
          onClick={() => run().undo().run()}
        >
          <Undo2 />
        </Tool>
        <Tool
          label="Redo (Ctrl+Y)"
          disabled={!on.redo}
          onClick={() => run().redo().run()}
        >
          <Redo2 />
        </Tool>
        <Divider />
        <Select
          value={on.style}
          onChange={(e) => setStyle(e.target.value)}
          aria-label="Text style"
          className={cn(field, "h-8 w-auto py-0 pr-7")}
        >
          {STYLES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </Select>
        <Divider />
        <Tool
          label="Bold (Ctrl+B)"
          active={on.bold}
          onClick={() => run().toggleBold().run()}
        >
          <Bold />
        </Tool>
        <Tool
          label="Italic (Ctrl+I)"
          active={on.italic}
          onClick={() => run().toggleItalic().run()}
        >
          <Italic />
        </Tool>
        <Tool
          label="Underline (Ctrl+U)"
          active={on.underline}
          onClick={() => run().toggleUnderline().run()}
        >
          <Underline />
        </Tool>
        <Tool
          label="Strikethrough"
          active={on.strike}
          onClick={() => run().toggleStrike().run()}
        >
          <Strikethrough />
        </Tool>
        <Tool
          label="Inline code"
          active={on.code}
          onClick={() => run().toggleCode().run()}
        >
          <Code />
        </Tool>
        <Swatches
          label="Text colour"
          icon={<Baseline style={on.color ? { color: on.color } : undefined} />}
          colours={TEXT_COLOURS}
          onPick={(value) =>
            value ? run().setColor(value).run() : run().unsetColor().run()
          }
        />
        <Swatches
          label="Highlight"
          icon={<Highlighter />}
          colours={HIGHLIGHTS}
          onPick={(value) =>
            value
              ? run().setHighlight({ color: value }).run()
              : run().unsetHighlight().run()
          }
        />
        <Divider />
        <Tool
          label="Bulleted list"
          active={on.bullet}
          onClick={() => run().toggleBulletList().run()}
        >
          <List />
        </Tool>
        <Tool
          label="Numbered list"
          active={on.ordered}
          onClick={() => run().toggleOrderedList().run()}
        >
          <ListOrdered />
        </Tool>
        <Tool
          label="Checklist"
          active={on.task}
          onClick={() => run().toggleTaskList().run()}
        >
          <ListTodo />
        </Tool>
        <Divider />
        <Tool
          label="Align left"
          active={!on.align}
          onClick={() => run().setTextAlign("left").run()}
        >
          <TextAlignStart />
        </Tool>
        <Tool
          label="Centre"
          active={on.align === "center"}
          onClick={() => run().setTextAlign("center").run()}
        >
          <TextAlignCenter />
        </Tool>
        <Tool
          label="Align right"
          active={on.align === "right"}
          onClick={() => run().setTextAlign("right").run()}
        >
          <TextAlignEnd />
        </Tool>
        <Tool
          label="Justify"
          active={on.align === "justify"}
          onClick={() => run().setTextAlign("justify").run()}
        >
          <TextAlignJustify />
        </Tool>
        <Divider />
        <Tool
          label="Link"
          active={on.link}
          onClick={() => setLinkDraft(on.href)}
        >
          <LinkIcon />
        </Tool>
        {on.link && (
          <Tool
            label="Remove link"
            onClick={() => run().extendMarkRange("link").unsetLink().run()}
          >
            <Unlink />
          </Tool>
        )}
        <Tool
          label="Quote"
          active={on.quote}
          onClick={() => run().toggleBlockquote().run()}
        >
          <Quote />
        </Tool>
        <Tool
          label="Code block"
          active={on.codeBlock}
          onClick={() => run().toggleCodeBlock().run()}
        >
          <SquareCode />
        </Tool>
        <Tool
          label="Divider line"
          onClick={() => run().setHorizontalRule().run()}
        >
          <Minus />
        </Tool>
        <Tool
          label="Insert table"
          active={on.table}
          onClick={() =>
            run().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          <Table />
        </Tool>
        <Tool
          label="Insert picture"
          disabled={uploading}
          onClick={() => image.current?.click()}
        >
          <ImagePlus />
        </Tool>
        <Tool
          label="Attach a file"
          disabled={uploading}
          onClick={() => attach.current?.click()}
        >
          <Paperclip />
        </Tool>
        <Divider />
        <Tool
          label="Clear formatting"
          onClick={() => run().unsetAllMarks().clearNodes().run()}
        >
          <RemoveFormatting />
        </Tool>
        {uploading && (
          <span className="text-ink-faint ml-1 text-[0.75rem]">Uploading</span>
        )}
        <input
          ref={image}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => picked(e.currentTarget)}
        />
        <input
          ref={attach}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => picked(e.currentTarget)}
        />
      </div>

      {linkDraft !== null && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyLink();
          }}
          className="border-line flex flex-wrap items-center gap-2 border-t px-3 py-2"
        >
          <input
            autoFocus
            value={linkDraft}
            onChange={(e) => setLinkDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setLinkDraft(null)}
            placeholder="https://"
            aria-label="Link address"
            className={cn(field, "min-w-0 flex-1 py-1.5")}
          />
          <button type="submit" className={cn(quietButton, "py-1.5")}>
            {on.link ? "Update link" : "Add link"}
          </button>
          <button
            type="button"
            onClick={() => setLinkDraft(null)}
            className="text-ink-faint hover:text-ink text-[0.8125rem] font-semibold"
          >
            Cancel
          </button>
        </form>
      )}

      {on.table && (
        <div className="border-line flex flex-wrap items-center gap-1.5 border-t px-3 py-1.5 text-[0.75rem]">
          <span className="text-ink-faint mr-1 font-semibold">Table</span>
          {(
            [
              ["Row above", () => run().addRowBefore().run()],
              ["Row below", () => run().addRowAfter().run()],
              ["Column left", () => run().addColumnBefore().run()],
              ["Column right", () => run().addColumnAfter().run()],
              ["Delete row", () => run().deleteRow().run()],
              ["Delete column", () => run().deleteColumn().run()],
              ["Header row", () => run().toggleHeaderRow().run()],
              ["Merge or split cells", () => run().mergeOrSplit().run()],
              ["Delete table", () => run().deleteTable().run()],
            ] as const
          ).map(([text, action]) => (
            <button
              key={text}
              type="button"
              onClick={action}
              className={cn(
                "border-line bg-surface hover:border-brand hover:text-brand-deep rounded-md border px-2 py-1 font-semibold transition-colors",
                text.startsWith("Delete") ? "text-danger" : "text-ink",
              )}
            >
              {text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Tool({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "grid size-8 place-items-center rounded-md transition-colors disabled:opacity-35 [&_svg]:size-4",
        active
          ? "bg-surface text-brand-deep shadow-sm"
          : "text-ink-soft hover:bg-surface hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden className="bg-line mx-1 h-5 w-px" />;
}

/** A small menu of colours, closed again once one is picked. */
function Swatches({
  label,
  icon,
  colours,
  onPick,
}: {
  label: string;
  icon: ReactNode;
  colours: { name: string; value: string }[];
  onPick: (value: string) => void;
}) {
  const menu = useRef<HTMLDetailsElement>(null);
  return (
    <details ref={menu} className="relative">
      <summary
        aria-label={label}
        title={label}
        className="text-ink-soft hover:bg-surface hover:text-ink grid size-8 cursor-pointer list-none place-items-center rounded-md transition-colors [&_svg]:size-4 [&::-webkit-details-marker]:hidden"
      >
        {icon}
      </summary>
      <div className="border-line bg-surface absolute top-9 left-0 z-20 flex gap-1 rounded-lg border p-1.5 shadow-lg">
        {colours.map((c) => (
          <button
            key={c.name}
            type="button"
            title={c.name}
            aria-label={`${label}: ${c.name}`}
            onClick={() => {
              onPick(c.value);
              menu.current?.removeAttribute("open");
            }}
            className="border-line grid size-6 place-items-center rounded-md border text-[0.625rem]"
            style={c.value ? { background: c.value } : undefined}
          >
            {c.value ? "" : "✕"}
          </button>
        ))}
      </div>
    </details>
  );
}
