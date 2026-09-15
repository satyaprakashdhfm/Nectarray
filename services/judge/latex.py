"""Compiles a resume's LaTeX source to PDF.

Folded into this same backend rather than run as a second service: a LaTeX
document can read files on disk and loop forever, which is exactly the kind
of untrusted work this container already exists to isolate for the Python
judge above it. The two jobs share the process's resource limits and
sandboxing posture; they do not share a token, so a leaked judge token
cannot compile a document and a leaked LaTeX token cannot run code.
"""

import asyncio
import os
import pathlib
import re
import resource
import signal
import tempfile

TIMEOUT_SECONDS = float(os.environ.get("LATEX_TIMEOUT_SECONDS", "20"))

# pdflatex is single-threaded and a resume takes about a second. A small cap
# keeps a burst of recompiles from starving the container the judge also runs
# in.
SLOTS = asyncio.Semaphore(int(os.environ.get("LATEX_CONCURRENCY", "2")))

MAX_FILES = 8
MAX_FILE_BYTES = 128 * 1024

# Flat names only. A key like "../../etc/x" must never become a path.
NAME = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_-]{0,63}\.(tex|cls|sty|bib)$")

# With -file-line-error, a real error reads "./template.tex:42: message".
LOCATED = re.compile(r"^(?:\./)?([A-Za-z0-9_-]+\.(?:tex|cls|sty)):(\d+): (.+)$")


class LatexError(Exception):
    """Carries exactly what the HTTP layer should send back."""

    def __init__(self, status: int, detail: dict):
        super().__init__(detail.get("error", ""))
        self.status = status
        self.detail = detail


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


async def compile_document(main: str, files: dict[str, str]) -> bytes:
    """Returns the compiled PDF, or raises LatexError with what went wrong."""
    if len(files) > MAX_FILES:
        raise LatexError(413, {"error": "Too many files."})
    for name, body in files.items():
        if not NAME.match(name):
            raise LatexError(400, {"error": f"Not an allowed file name: {name}"})
        if len(body.encode()) > MAX_FILE_BYTES:
            raise LatexError(413, {"error": f"{name} is too large."})
    if not main.endswith(".tex") or main not in files:
        raise LatexError(
            400, {"error": "The main file must be one of the .tex files sent."}
        )

    async with SLOTS:
        with tempfile.TemporaryDirectory(prefix="latex-") as workdir:
            root = pathlib.Path(workdir)
            for name, body in files.items():
                (root / name).write_text(body, encoding="utf-8")

            process = await asyncio.create_subprocess_exec(
                "pdflatex",
                "-no-shell-escape",
                "-interaction=nonstopmode",
                "-halt-on-error",
                "-file-line-error",
                main,
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
                raise LatexError(
                    422,
                    {
                        "error": "Compiling took too long and was stopped. "
                        "Look for a command that repeats itself."
                    },
                )

            stem = main[: -len(".tex")]
            pdf = root / f"{stem}.pdf"
            log_file = root / f"{stem}.log"
            log = (
                log_file.read_text(encoding="utf-8", errors="replace")
                if log_file.exists()
                else stdout.decode("utf-8", errors="replace")
            )

            if process.returncode == 0 and pdf.exists():
                return pdf.read_bytes()

            raise LatexError(422, {**_explain(log), "log": log[-6000:]})
