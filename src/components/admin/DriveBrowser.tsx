"use client";

import { ADMIN } from "@/lib/admin-path";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  ChevronRight,
  Download,
  File,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  FolderPlus,
  HardDrive,
  Pencil,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  createFolder,
  deleteFile,
  deleteFolder,
  finishUpload,
  renameFile,
  renameFolder,
  startUpload,
} from "@/app/admin/(panel)/drive/actions";
import { fileSize } from "@/lib/file-size";
import { cn } from "@/lib/utils";

type Folder = { id: string; name: string };
type DriveFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
};
type Crumb = { id: string | null; name: string };

type Upload = {
  key: string;
  name: string;
  size: number;
  /** 0 to 1 while sending; null once done or failed. */
  progress: number | null;
  error: string | null;
};

/**
 * One folder of a project's Drive: the path above it, its folders, its
 * files, and the tools to add to it. Files can be dropped anywhere on it.
 * Uploads go straight to the storage bucket with their progress shown, and
 * the folder refreshes when each one lands.
 */
export function DriveBrowser({
  projectId,
  folderId,
  path,
  folders,
  files,
  storage,
}: {
  projectId: string;
  folderId: string | null;
  path: Crumb[];
  folders: Folder[];
  files: DriveFile[];
  storage: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [naming, setNaming] = useState(false);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [dragging, setDragging] = useState(false);
  const picker = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);

  const here = (id: string | null) =>
    id
      ? `${ADMIN}/drive/${projectId}?folder=${id}`
      : `${ADMIN}/drive/${projectId}`;
  const fileHref = (id: string, download = false) =>
    `${ADMIN}/drive/${projectId}/file/${id}${download ? "?download=1" : ""}`;

  /** Runs an action, shows its error if any, and reloads the folder. */
  const act = (work: () => Promise<{ ok: boolean; error?: string }>) =>
    startTransition(async () => {
      setError(null);
      const result = await work();
      if (!result.ok) setError(result.error ?? "Something went wrong.");
      router.refresh();
    });

  const patch = (key: string, change: Partial<Upload>) =>
    setUploads((list) =>
      list.map((u) => (u.key === key ? { ...u, ...change } : u)),
    );

  async function uploadOne(file: globalThis.File, key: string) {
    const started = await startUpload(projectId, folderId, {
      name: file.name,
      type: file.type,
      size: file.size,
    });
    if (!started.ok)
      return patch(key, { progress: null, error: started.error });

    const sent = await new Promise<string | null>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", started.value.url);
      if (file.type) xhr.setRequestHeader("Content-Type", file.type);
      xhr.upload.onprogress = (e) =>
        e.lengthComputable && patch(key, { progress: e.loaded / e.total });
      xhr.onload = () =>
        resolve(xhr.status < 300 ? null : `Storage said ${xhr.status}.`);
      xhr.onerror = () => resolve("The upload was interrupted.");
      xhr.send(file);
    });
    if (sent) return patch(key, { progress: null, error: sent });

    const done = await finishUpload(projectId, started.value.id);
    if (!done.ok) return patch(key, { progress: null, error: done.error });
    // Landed: drop it from the queue and show it in the folder.
    setUploads((list) => list.filter((u) => u.key !== key));
    router.refresh();
  }

  function upload(list: FileList | null) {
    if (!list || list.length === 0) return;
    if (!storage) {
      setError("Storage is not connected yet, so files cannot be uploaded.");
      return;
    }
    const batch = Array.from(list).map((file) => ({
      file,
      key: crypto.randomUUID(),
    }));
    setUploads((current) => [
      ...current,
      ...batch.map(({ file, key }) => ({
        key,
        name: file.name,
        size: file.size,
        progress: 0,
        error: null,
      })),
    ]);
    // A few at a time, so twenty photos do not all fight for the line.
    let next = 0;
    const worker = async () => {
      while (next < batch.length) {
        const { file, key } = batch[next++];
        await uploadOne(file, key).catch(() =>
          patch(key, { progress: null, error: "The upload failed." }),
        );
      }
    };
    void Promise.all([worker(), worker(), worker()]);
  }

  return (
    <div
      className="relative mt-5"
      onDragEnter={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return;
        dragDepth.current++;
        setDragging(true);
      }}
      onDragLeave={() => {
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        if (dragDepth.current === 0) setDragging(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        dragDepth.current = 0;
        setDragging(false);
        upload(e.dataTransfer.files);
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Folder path" className="min-w-0">
          <ol className="flex flex-wrap items-center gap-1 text-[0.9375rem]">
            {path.map((c, i) => {
              const last = i === path.length - 1;
              return (
                <li key={c.id ?? "top"} className="flex items-center gap-1">
                  {i > 0 && (
                    <ChevronRight
                      className="text-ink-faint size-4"
                      aria-hidden
                    />
                  )}
                  {last ? (
                    <span
                      className="text-ink font-semibold"
                      aria-current="page"
                    >
                      {c.name}
                    </span>
                  ) : (
                    <Link
                      href={here(c.id)}
                      className="text-ink-soft hover:text-ink rounded px-1 transition-colors"
                    >
                      {c.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setNaming(true)}
            className="border-line bg-surface text-ink hover:border-brand inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[0.8125rem] font-semibold transition-colors active:scale-[0.98]"
          >
            <FolderPlus className="size-4" aria-hidden />
            New folder
          </button>
          <button
            type="button"
            onClick={() => picker.current?.click()}
            disabled={!storage}
            className="bg-brand-solid text-cta-fg inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.8125rem] font-semibold transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          >
            <Upload className="size-4" aria-hidden />
            Upload
          </button>
          <input
            ref={picker}
            type="file"
            multiple
            hidden
            onChange={(e) => {
              upload(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="text-danger bg-surface border-line mt-4 flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-[0.8125rem]"
        >
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss"
            className="text-ink-faint hover:text-ink"
          >
            <X className="size-4" aria-hidden />
          </button>
        </p>
      )}

      {naming && (
        <NameForm
          label="New folder name"
          initial=""
          submit="Create"
          onCancel={() => setNaming(false)}
          onSave={(name) => {
            setNaming(false);
            act(() => createFolder(projectId, folderId, name));
          }}
        />
      )}

      {uploads.length > 0 && (
        <UploadQueue
          uploads={uploads}
          onClear={() =>
            setUploads((list) => list.filter((u) => u.progress !== null))
          }
        />
      )}

      {folders.length > 0 && (
        <section className="mt-6">
          <h2 className="text-ink-faint text-[0.75rem] font-semibold">
            Folders
          </h2>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {folders.map((f) => (
              <FolderTile
                key={f.id}
                folder={f}
                href={here(f.id)}
                busy={pending}
                onRename={(name) =>
                  act(() => renameFolder(projectId, f.id, name))
                }
                onDelete={() => {
                  if (
                    confirm(
                      `Delete "${f.name}" and everything inside it? This cannot be undone.`,
                    )
                  )
                    act(() => deleteFolder(projectId, f.id));
                }}
              />
            ))}
          </ul>
        </section>
      )}

      {files.length > 0 && (
        <section className="mt-6">
          <h2 className="text-ink-faint text-[0.75rem] font-semibold">Files</h2>
          <ul className="card divide-line-soft mt-2 divide-y">
            {files.map((f) => (
              <FileRow
                key={f.id}
                file={f}
                href={fileHref(f.id)}
                downloadHref={fileHref(f.id, true)}
                busy={pending}
                onRename={(name) =>
                  act(() => renameFile(projectId, f.id, name))
                }
                onDelete={() => {
                  if (confirm(`Delete "${f.name}"? This cannot be undone.`))
                    act(() => deleteFile(projectId, f.id));
                }}
              />
            ))}
          </ul>
        </section>
      )}

      {folders.length === 0 && files.length === 0 && uploads.length === 0 && (
        <div className="border-line mt-6 flex flex-col items-center rounded-xl border border-dashed px-6 py-14 text-center">
          <HardDrive
            className="text-ink-faint size-8"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-ink mt-3 text-[0.9375rem] font-semibold">
            This folder is empty
          </p>
          <p className="text-ink-soft mt-1 max-w-sm text-[0.8125rem]">
            Drop files anywhere here, or use Upload. New folder makes a folder
            inside this one.
          </p>
        </div>
      )}

      {dragging && (
        <div className="border-brand bg-brand-wash/90 pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl border-2 border-dashed">
          <p className="text-brand-deep flex items-center gap-2 text-[0.9375rem] font-semibold">
            <Upload className="size-5" aria-hidden />
            Drop to upload to {path.at(-1)?.name}
          </p>
        </div>
      )}
    </div>
  );
}

function FolderTile({
  folder,
  href,
  busy,
  onRename,
  onDelete,
}: {
  folder: Folder;
  href: string;
  busy: boolean;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  const [renaming, setRenaming] = useState(false);
  if (renaming)
    return (
      <li className="sm:col-span-2 lg:col-span-3 2xl:col-span-4">
        <NameForm
          label={`Rename ${folder.name}`}
          initial={folder.name}
          submit="Rename"
          onCancel={() => setRenaming(false)}
          onSave={(name) => {
            setRenaming(false);
            onRename(name);
          }}
        />
      </li>
    );
  return (
    <li className="card card-hover group flex items-center gap-1 pr-1">
      <Link
        href={href}
        className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3"
      >
        <Folder
          className="text-brand-deep size-5 shrink-0"
          strokeWidth={1.8}
          aria-hidden
        />
        <span className="text-ink truncate text-[0.875rem] font-semibold">
          {folder.name}
        </span>
      </Link>
      <RowActions
        name={folder.name}
        busy={busy}
        onRename={() => setRenaming(true)}
        onDelete={onDelete}
      />
    </li>
  );
}

function FileRow({
  file,
  href,
  downloadHref,
  busy,
  onRename,
  onDelete,
}: {
  file: DriveFile;
  href: string;
  downloadHref: string;
  busy: boolean;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  const [renaming, setRenaming] = useState(false);
  if (renaming)
    return (
      <li className="px-3 py-2">
        <NameForm
          flat
          label={`Rename ${file.name}`}
          initial={file.name}
          submit="Rename"
          onCancel={() => setRenaming(false)}
          onSave={(name) => {
            setRenaming(false);
            onRename(name);
          }}
        />
      </li>
    );
  return (
    <li className="group flex items-center gap-2 pr-1">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3"
      >
        <FileIcon type={file.type} name={file.name} />
        <span className="text-ink min-w-0 flex-1 truncate text-[0.875rem] font-medium">
          {file.name}
        </span>
        <span className="text-ink-faint hidden w-20 text-right text-[0.75rem] sm:block">
          {fileSize(file.size)}
        </span>
        <span className="text-ink-faint hidden w-28 text-right text-[0.75rem] md:block">
          {new Date(file.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </a>
      <a
        href={downloadHref}
        aria-label={`Download ${file.name}`}
        title="Download"
        className="text-ink-faint hover:text-ink hover:bg-mist rounded-md p-2 transition-colors"
      >
        <Download className="size-4" aria-hidden />
      </a>
      <RowActions
        name={file.name}
        busy={busy}
        onRename={() => setRenaming(true)}
        onDelete={onDelete}
      />
    </li>
  );
}

function RowActions({
  name,
  busy,
  onRename,
  onDelete,
}: {
  name: string;
  busy: boolean;
  onRename: () => void;
  onDelete: () => void;
}) {
  const button =
    "text-ink-faint rounded-md p-2 transition-colors disabled:opacity-40";
  return (
    <>
      <button
        type="button"
        onClick={onRename}
        disabled={busy}
        aria-label={`Rename ${name}`}
        title="Rename"
        className={cn(button, "hover:text-ink hover:bg-mist")}
      >
        <Pencil className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={busy}
        aria-label={`Delete ${name}`}
        title="Delete"
        className={cn(button, "hover:text-danger hover:bg-mist")}
      >
        <Trash2 className="size-4" aria-hidden />
      </button>
    </>
  );
}

function NameForm({
  label,
  initial,
  submit,
  onSave,
  onCancel,
  flat = false,
}: {
  label: string;
  initial: string;
  submit: string;
  onSave: (name: string) => void;
  onCancel: () => void;
  /** Inside a list row, which is already a card. */
  flat?: boolean;
}) {
  const [name, setName] = useState(initial);
  return (
    <form
      className={cn(
        "flex flex-wrap items-end gap-2",
        flat ? "py-1" : "card mt-4 p-3",
      )}
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim()) onSave(name.trim());
      }}
    >
      <label className="min-w-[14rem] flex-1">
        <span className="text-ink-faint mb-1 block text-[0.75rem] font-semibold">
          {label}
        </span>
        <input
          autoFocus
          value={name}
          maxLength={200}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && onCancel()}
          className="border-line bg-surface text-ink focus:border-brand w-full rounded-lg border px-3 py-2 text-[0.875rem] outline-none"
        />
      </label>
      <button
        type="submit"
        className="bg-brand-solid text-cta-fg rounded-lg px-3 py-2 text-[0.8125rem] font-semibold active:scale-[0.98]"
      >
        {submit}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="text-ink-soft hover:text-ink rounded-lg px-3 py-2 text-[0.8125rem] font-semibold"
      >
        Cancel
      </button>
    </form>
  );
}

function UploadQueue({
  uploads,
  onClear,
}: {
  uploads: Upload[];
  onClear: () => void;
}) {
  const failed = uploads.some((u) => u.error);
  return (
    <section aria-label="Uploads" className="card mt-4 p-3">
      <ul className="space-y-2">
        {uploads.map((u) => (
          <li key={u.key} className="text-[0.8125rem]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-ink truncate">{u.name}</span>
              <span
                className={cn(
                  "shrink-0",
                  u.error ? "text-danger" : "text-ink-faint",
                )}
              >
                {u.error ??
                  `${Math.round((u.progress ?? 0) * 100)}% of ${fileSize(u.size)}`}
              </span>
            </div>
            {!u.error && (
              <div className="bg-mist mt-1 h-1 overflow-hidden rounded-full">
                <div
                  className="bg-brand h-full origin-left rounded-full transition-transform"
                  style={{ transform: `scaleX(${u.progress ?? 0})` }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
      {failed && (
        <button
          type="button"
          onClick={onClear}
          className="text-ink-soft hover:text-ink mt-2 text-[0.75rem] font-semibold"
        >
          Clear failed uploads
        </button>
      )}
    </section>
  );
}

function FileIcon({ type, name }: { type: string; name: string }) {
  const props = {
    className: "text-ink-soft size-5 shrink-0",
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

export function NotConnected() {
  return (
    <p className="bg-amber-wash text-ink mt-5 rounded-lg px-4 py-3 text-[0.8125rem]">
      The Drive&apos;s storage is not connected yet (the DRIVE_BUCKET_*
      variables on the Web service), so files cannot be uploaded. Folders can
      still be made.
    </p>
  );
}
