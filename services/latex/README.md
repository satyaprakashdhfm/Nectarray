# LaTeX service

Compiles a student's resume to PDF for the editor at
`/dashboard/placement?tool=resume`. It receives the files and returns a PDF,
or the first error with its file and line. It never sees who the student is.

## Running it locally

Start Docker Desktop, then from the repository root:

    npm run latex:dev

and add to `.env.local`:

    LATEX_URL=http://localhost:8081
    LATEX_TOKEN=dev

The first build takes a few minutes; TeX is most of the image.

## Deploying

Railway, from this directory, the same way as `services/judge`. One variable:

    LATEX_TOKEN     a long random string, the same value as on the web app

Then set `LATEX_URL` and `LATEX_TOKEN` on the web app. Until both are set the
editor still opens and saves, and says the preview is not set up.

Optional:

    LATEX_TIMEOUT_SECONDS   wall-clock limit per compile, default 20
    LATEX_CONCURRENCY       compiles at once, default 2

## What keeps a document in its box

* `-no-shell-escape`, and `shell_escape=f` besides — no `\write18`
* `openin_any=p` / `openout_any=p` — no absolute paths, no `..`, no dotfiles,
  for reading or writing. TeX Live's default would let a document
  `\input{/etc/passwd}`
* a temporary folder per job, deleted afterwards
* RLIMIT_CPU, RLIMIT_AS and RLIMIT_FSIZE on the child, a wall-clock timeout
  over the top, and the whole process group killed when it fires
* a non-root user and a read-only application directory

Only the packages in the image exist. A student who adds `\usepackage` for
something else gets a "file not found" error pointing at that line, which is
the intended behaviour: the editor supports this one template.
