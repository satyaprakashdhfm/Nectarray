"""The resume compiler.

One job: take a small LaTeX project and turn it into a PDF, or say why it
could not. It does not know who is asking or whose resume this is — the web
app owns the student, the saved files and the template.

It lives apart from the web app for the same reason the judge does. LaTeX is
a programming language with file access: a document can \\input any file the
process can read, loop forever, or write output until the disk fills. So it
runs in a container holding nothing but TeX and this service, with shell
escape off, reads confined to the job's own folder, and a clock on every run.
"""

import asyncio
import os
import pathlib
import re
import resource
import secrets
import signal
import tempfile

from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel

# The one credential, shared with the web app. Without it every request is
# refused rather than compiling documents for strangers.
TOKEN = os.environ.get("LATEX_TOKEN", "")

TIMEOUT_SECONDS = float(os.environ.get("LATEX_TIMEOUT_SECONDS", "20"))

# pdflatex is single-threaded and a resume takes about a second. A small cap
# keeps a burst of recompiles from starving the container.
SLOTS = asyncio.Semaphore(int(os.environ.get("LATEX_CONCURRENCY", "2")))

MAX_FILES = 8
MAX_FILE_BYTES = 128 * 1024

# Flat names only. A key like "../../etc/x" must never become a path.
NAME = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_-]{0,63}\.(tex|cls|sty|bib)$")

# With -file-line-error, a real error reads "./template.tex:42: message".
LOCATED = re.compile(r"^(?:\./)?([A-Za-z0-9_-]+\.(?:tex|cls|sty)):(\d+): (.+)$")

app = FastAPI(title="NectArray LaTeX", docs_url=None, redoc_url=None)


class CompileRequest(BaseModel):
    main: str
    files: dict[str, str]


@app.get("/health")
async def health() -> dict:
    return {"ok": True}


def _limits() -> None:
    """Runs in the child before pdflatex starts."""
    resource.setrlimit(resource.RLIMIT_CPU, (15, 15))
    resource.setrlimit(resource.RLIMIT_FSIZE, (20 * 1024 * 1024,) * 2)
    resource.setrlimit(resource.RLIMIT_AS, (1024 * 1024 * 1024,) * 2)


def _environment(workdir: str) -> dict:
    return {
        "PATH": os.environ.get("PATH", "/usr/local/bin:/usr/bin:/bin"),
        "HOME": workdir,
        "TEXMFVAR": workdir,
        # kpathsea reads these ahead of texmf.cnf. TeX Live's default lets a
        # document \input an absolute path; "p" refuses absolute paths, "..",
        # and dotfiles, for reading and for writing.
        "openin_any": "p",
        "openout_any": "p",
        "shell_escape": "f",
        # The log wraps at 79 columns by default, which splits error lines
        # in half and defeats the parsing below.
        "max_print_line": "1000",
    }


def _explain(log: str) -> dict:
    """The first real error, in a form the editor can point at."""
    lines = log.splitlines()
    for line in lines:
        match = LOCATED.match(line.strip())
        if match:
            return {
                "error": match.group(3).strip(),
                "file": match.group(1),
                "line": int(match.group(2)),
            }
    for line in lines:
        if line.startswith("!"):
            return {"error": line.lstrip("! ").strip()}
    return {"error": "LaTeX stopped without producing a PDF."}


@app.post("/compile")
async def compile_document(
    request: CompileRequest, x_latex_token: str = Header(default="")
) -> Response:
    if not TOKEN:
        raise HTTPException(503, "LATEX_TOKEN is not set on this service.")
    # Constant-time, so the token cannot be recovered a byte at a time.
    if not secrets.compare_digest(x_latex_token, TOKEN):
        raise HTTPException(401, "Bad token.")

    if len(request.files) > MAX_FILES:
        raise HTTPException(413, "Too many files.")
    for name, body in request.files.items():
        if not NAME.match(name):
            raise HTTPException(400, f"Not an allowed file name: {name}")
        if len(body.encode()) > MAX_FILE_BYTES:
            raise HTTPException(413, f"{name} is too large.")
    if not request.main.endswith(".tex") or request.main not in request.files:
        raise HTTPException(400, "The main file must be one of the .tex files sent.")

    async with SLOTS:
        with tempfile.TemporaryDirectory(prefix="job-") as workdir:
            root = pathlib.Path(workdir)
            for name, body in request.files.items():
                (root / name).write_text(body, encoding="utf-8")

            process = await asyncio.create_subprocess_exec(
                "pdflatex",
                "-no-shell-escape",
                "-interaction=nonstopmode",
                "-halt-on-error",
                "-file-line-error",
                request.main,
                cwd=workdir,
                env=_environment(workdir),
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.STDOUT,
                preexec_fn=_limits,
                start_new_session=True,
            )
            try:
                stdout, _ = await asyncio.wait_for(
                    process.communicate(), TIMEOUT_SECONDS
                )
            except asyncio.TimeoutError:
                # The whole group, so nothing pdflatex started outlives it.
                os.killpg(process.pid, signal.SIGKILL)
                await process.wait()
                return JSONResponse(
                    {
                        "error": "Compiling took too long and was stopped. "
                        "Look for a command that repeats itself."
                    },
                    status_code=422,
                )

            stem = request.main[: -len(".tex")]
            pdf = root / f"{stem}.pdf"
            log_file = root / f"{stem}.log"
            log = (
                log_file.read_text(encoding="utf-8", errors="replace")
                if log_file.exists()
                else stdout.decode("utf-8", errors="replace")
            )

            if process.returncode == 0 and pdf.exists():
                return Response(
                    content=pdf.read_bytes(),
                    media_type="application/pdf",
                    headers={"Cache-Control": "no-store"},
                )

            return JSONResponse(
                {**_explain(log), "log": log[-6000:]}, status_code=422
            )
