# Backend service

Two jobs, one container, because both are the same kind of problem: running
work we did not write and cannot fully trust.

**The judge** runs a student's Python against a set of inputs and reports
what came back. It does not know who is asking, which problem this is, or
what the right answer looks like. The web app holds the test expectations
and does the comparison, so the answers never reach the machine running the
code.

**The LaTeX compiler** (`latex.py`) turns a student's resume source into a
PDF, or says why it could not. LaTeX is a programming language with file
access — a document can `\input` any file the process can read, loop
forever, or write until the disk fills — so it runs with the same posture as
the judge: no shell escape, a confined temp directory per job, resource
limits, and a wall-clock timeout.

They share a container because they need the same thing from it — isolation
from the database and the web app, disposability, and a non-root user with
nothing to steal — not because they are related otherwise. They do **not**
share a token: `JUDGE_TOKEN` and `LATEX_TOKEN` are independent, so a leak of
one cannot be used against the other endpoint.

## Deploying

Railway, from this directory. Variables:

    JUDGE_TOKEN     a long random string, the same value as on the web app
    LATEX_TOKEN     a second long random string, the same value as on the web app

Optional:

    JUDGE_TIMEOUT_SECONDS   wall-clock limit per submission, default 12
    LATEX_TIMEOUT_SECONDS   wall-clock limit per compile, default 20
    LATEX_CONCURRENCY       compiles at once, default 2

## Running it locally

Start Docker Desktop, then from the repository root:

    npm run backend:dev

and add to `.env.local`:

    JUDGE_URL=http://localhost:8081
    JUDGE_TOKEN=dev
    LATEX_URL=http://localhost:8081
    LATEX_TOKEN=dev

The first build takes a few minutes — TeX Live is most of the image.

## Why not Judge0

Judge0 is the usual answer for the judge half and would slot straight into
that position. It cannot be self-hosted here: its `isolate` sandbox needs
privileged containers and cgroup access that Railway, like most platforms,
does not grant. The hosted service at judge0.com works and costs money. If
that becomes worth it, only `/run` changes — the web app never learns which
one it is talking to.

## What the sandboxing actually is

Honest version, because "sandboxed" is doing a lot of work in most write-ups.

Shared by both endpoints:

* runs as a non-root user in a container with a read-only application
  directory and no credentials beyond the two shared tokens
* the container is disposable and isolated from the database and the web
  app, so the worst outcome is an annoyance rather than a breach

The judge, specifically:

* a separate process per submission, killed on a wall-clock timeout
* RLIMIT_CPU, RLIMIT_AS, RLIMIT_NPROC, RLIMIT_FSIZE set before user code runs
* the process group is killed, so a fork bomb cannot outlive the request
* stdout is captured, so printing in a loop cannot fill anything

The compiler, specifically:

* `-no-shell-escape`, and `shell_escape=f` besides — no `\write18`
* `openin_any=p` / `openout_any=p` — no absolute paths, no `..`, no
  dotfiles, for reading or writing. TeX Live's default would let a document
  `\input{/etc/passwd}`
* a temporary folder per job, deleted afterwards
* RLIMIT_CPU, RLIMIT_AS and RLIMIT_FSIZE on the pdflatex child, a wall-clock
  timeout over the top, and the whole process group killed when it fires
* only the packages in the image exist — a student who adds `\usepackage`
  for something else gets a "file not found" error pointing at that line,
  which is the intended behaviour: the resume editor supports one template

Neither is a syscall-level sandbox. A determined student could read the
container's filesystem, which holds this service and nothing else, or make
an outbound network request. That is the deliberate trade.
