# Judge service

Runs a student's Python against a set of inputs and reports what came back.
Nothing more: it does not know who is asking, which problem this is, or what
the right answer looks like. The web app holds the test expectations and does
the comparison, so the answers never reach the machine running the code.

## Deploying

Railway, from this directory. One variable:

    JUDGE_TOKEN     a long random string, the same value as on the web app

Optional:

    JUDGE_TIMEOUT_SECONDS   wall-clock limit per submission, default 12

## Why not Judge0

Judge0 is the usual answer and would slot straight into this position. It
cannot be self-hosted here: its `isolate` sandbox needs privileged containers
and cgroup access that Railway, like most platforms, does not grant. The
hosted service at judge0.com works and costs money. If that becomes worth it,
only `/run` changes — the web app never learns which one it is talking to.

## What the sandboxing actually is

Honest version, because "sandboxed" is doing a lot of work in most write-ups:

* a separate process per submission, killed on a wall-clock timeout
* RLIMIT_CPU, RLIMIT_AS, RLIMIT_NPROC, RLIMIT_FSIZE set before user code runs
* the process group is killed, so a fork bomb cannot outlive the request
* runs as a non-root user in a container with a read-only application
  directory and no credentials beyond the shared token
* stdout is captured, so printing in a loop cannot fill anything

It is not a syscall-level sandbox. A determined student could read the
container's filesystem, which holds this service and nothing else, or make an
outbound network request. That is the deliberate trade: the container is
disposable and isolated from the database and the web app, so the worst
outcome is an annoyance rather than a breach.
