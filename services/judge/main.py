"""The backend: the code runner, and the LaTeX compiler alongside it.

The code runner's job: take a Python submission and a set of inputs, run
them, and say what came back. It does not know who the student is, which
problem this is, or whether the answer is right — the web app owns all of
that, and keeps the expected outputs to itself.

Kept deliberately small and replaceable. Judge0 fills exactly this slot in
most people's architecture; it cannot be self-hosted on a platform that
withholds privileged containers, which is why this exists, and swapping to it
later means changing the one function that shells out.

The LaTeX compiler lives in latex.py and is mounted here rather than as its
own service — see that module's docstring for why one container can hold
both kinds of untrusted work.
"""

import asyncio
import json
import os
import pathlib
import secrets
import sys
import time

from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel, Field

import latex

RUNNER = pathlib.Path(__file__).parent / "runner.py"

# The one credential per capability. Set on both this service and the web
# app; without it the matching endpoint refuses every request rather than
# running code, or compiling a document, for strangers. Deliberately two
# tokens rather than one shared: a leaked judge token cannot compile a
# document, and a leaked LaTeX token cannot run code.
TOKEN = os.environ.get("JUDGE_TOKEN", "")
LATEX_TOKEN = os.environ.get("LATEX_TOKEN", "")

# Wall clock, over the top of the child's own CPU limit. A process asleep or
# blocked on a syscall burns no CPU and would otherwise never be stopped.
WALL_TIMEOUT_SECONDS = float(os.environ.get("JUDGE_TIMEOUT_SECONDS", "12"))

MAX_SOURCE_BYTES = 64 * 1024
MAX_CASES = 200

app = FastAPI(title="NectArray backend", docs_url=None, redoc_url=None)


class CompileRequest(BaseModel):
    main: str
    files: dict[str, str]


@app.post("/compile")
async def compile_resume(
    request: CompileRequest, x_latex_token: str = Header(default="")
) -> Response:
    if not LATEX_TOKEN:
        raise HTTPException(503, "LATEX_TOKEN is not set on this service.")
    if not secrets.compare_digest(x_latex_token, LATEX_TOKEN):
        raise HTTPException(401, "Bad token.")

    try:
        pdf = await latex.compile_document(request.main, request.files)
    except latex.LatexError as error:
        return JSONResponse(error.detail, status_code=error.status)

    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Cache-Control": "no-store"},
    )


class Compare(BaseModel):
    kind: str
    arg: int = 0


class Case(BaseModel):
    args: list = Field(default_factory=list)


class RunRequest(BaseModel):
    source: str
    entry: str
    cases: list[Case]
    compare: Compare


@app.get("/health")
async def health() -> dict:
    return {
        "ok": True,
        "python": sys.version.split()[0],
        "judge": bool(TOKEN),
        "latex": bool(LATEX_TOKEN),
    }


@app.post("/run")
async def run(request: RunRequest, x_judge_token: str = Header(default="")) -> dict:
    if not TOKEN:
        raise HTTPException(503, "JUDGE_TOKEN is not set on this service.")
    # Constant-time: a token check that returns early leaks the token a byte
    # at a time to anyone patient enough to measure.
    if not secrets.compare_digest(x_judge_token, TOKEN):
        raise HTTPException(401, "Bad token.")

    if len(request.source.encode()) > MAX_SOURCE_BYTES:
        raise HTTPException(413, "That submission is too large.")
    if len(request.cases) > MAX_CASES:
        raise HTTPException(413, "Too many cases.")

    payload = json.dumps(
        {
            "source": request.source,
            "entry": request.entry,
            "cases": [case.model_dump() for case in request.cases],
            "compare": request.compare.model_dump(),
        }
    )

    started = time.monotonic()
    process = await asyncio.create_subprocess_exec(
        sys.executable,
        "-I",  # isolated: no user site-packages, no cwd on sys.path
        "-S",  # no site module
        str(RUNNER),
        stdin=asyncio.subprocess.PIPE,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
        # Its own process group, so a timeout kills any children too.
        start_new_session=True,
    )

    try:
        stdout, stderr = await asyncio.wait_for(
            process.communicate(payload.encode()), timeout=WALL_TIMEOUT_SECONDS
        )
    except asyncio.TimeoutError:
        _kill(process)
        return {"timeout": True, "ms": int((time.monotonic() - started) * 1000)}

    ms = int((time.monotonic() - started) * 1000)

    if process.returncode != 0 or not stdout:
        # A non-zero exit with no output is a limit being hit: the CPU cap
        # (SIGKILL), the memory cap (MemoryError, often unprintable), or a
        # segfault in something the student imported.
        detail = stderr.decode(errors="replace").strip()[-400:]
        return {
            "fatal": detail or "Your program stopped without finishing — it may "
            "have run out of memory or CPU time.",
            "ms": ms,
        }



    try:
        # Only the first JSON value. A submission that calls os.fork() leaves
        # two processes writing a result each, and concatenated JSON is not
        # JSON — the verdict would be unreadable rather than merely wrong.
        # RLIMIT_NPROC stops the fork outright for an unprivileged user, which
        # is what the container runs as, but this costs one line.
        result, _ = json.JSONDecoder().raw_decode(stdout.decode())
    except (json.JSONDecodeError, ValueError):
        return {"fatal": "The runner returned something unreadable.", "ms": ms}

    result["ms"] = ms
    return result


def _kill(process) -> None:
    try:
        os.killpg(os.getpgid(process.pid), 9)
    except (ProcessLookupError, PermissionError):
        process.kill()
