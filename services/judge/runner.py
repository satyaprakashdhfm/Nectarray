"""Executes one submission and reports what each test case returned.

This runs as a separate, short-lived process with its own resource limits, so
a submission that allocates a gigabyte or forks a hundred children dies on its
own rather than taking the service with it. The parent still holds a wall-clock
timeout over the top, because a process blocked in a syscall will not be
stopped by a CPU limit.

It reads one JSON payload on stdin and writes one JSON result to stdout. It
never decides whether an answer is *correct* — that comparison happens in the
web app, away from anything the student's code can reach.
"""

import json
import resource
import sys

# Generous enough for the intended solutions, tight enough that a runaway one
# dies quickly. The CPU limit is per-process and counts seconds of CPU, not
# wall time; the parent's timeout covers sleeping and blocking.
CPU_SECONDS = 5
ADDRESS_SPACE_BYTES = 512 * 1024 * 1024
MAX_PROCESSES = 0
MAX_OUTPUT_BYTES = 8 * 1024 * 1024


def apply_limits() -> None:
    resource.setrlimit(resource.RLIMIT_CPU, (CPU_SECONDS, CPU_SECONDS))
    resource.setrlimit(resource.RLIMIT_AS, (ADDRESS_SPACE_BYTES,) * 2)
    resource.setrlimit(resource.RLIMIT_NPROC, (MAX_PROCESSES, MAX_PROCESSES))
    resource.setrlimit(resource.RLIMIT_FSIZE, (MAX_OUTPUT_BYTES,) * 2)
    # No core dumps: they are large and nobody reads them.
    resource.setrlimit(resource.RLIMIT_CORE, (0, 0))


def jsonable(value):
    """Makes a returned value safe to serialise.

    A student may legitimately return a tuple or a set, and json.dumps raises
    on both — which would report a crash for a correct answer. Anything else
    falls back to its repr so we can still show them what they returned.
    """
    if value is None or isinstance(value, (bool, int, float, str)):
        return value
    if isinstance(value, (list, tuple)):
        return [jsonable(v) for v in value]
    if isinstance(value, set):
        return sorted((jsonable(v) for v in value), key=repr)
    if isinstance(value, dict):
        return {str(k): jsonable(v) for k, v in value.items()}
    return repr(value)


def main() -> None:
    payload = json.load(sys.stdin)
    apply_limits()

    import copy
    import io
    import traceback

    source = payload["source"]
    entry = payload["entry"]
    cases = payload["cases"]
    compare = payload["compare"]

    # print() goes nowhere: stdout is how we talk to the parent, and a loop
    # full of prints must not be able to corrupt the result or fill a disk.
    real_stdout = sys.stdout
    sys.stdout = io.StringIO()
    sys.stderr = io.StringIO()

    def done(result):
        real_stdout.write(json.dumps(result))
        real_stdout.flush()
        sys.exit(0)

    namespace = {}
    try:
        exec(source, namespace)
    except Exception:
        done({"fatal": traceback.format_exc(limit=3).strip()})

    if "Solution" not in namespace:
        done({"fatal": "No class named Solution was defined."})

    results = []
    for case in cases:
        args = copy.deepcopy(case["args"])
        try:
            method = getattr(namespace["Solution"](), entry, None)
            if method is None:
                done({"fatal": f"Solution has no method called {entry}."})
            returned = method(*args)

            kind = compare["kind"]
            if kind == "inplace":
                got = args[compare["arg"]]
            elif kind == "k_prefix":
                mutated = args[compare["arg"]]
                got = (
                    {"k": returned, "prefix": mutated[: returned]}
                    if isinstance(returned, int)
                    else {"k": returned, "prefix": None}
                )
            else:
                got = returned

            results.append({"got": jsonable(got)})
        except Exception:
            line = traceback.format_exc(limit=1).strip().split("\n")[-1]
            results.append({"error": line})

    done({"results": results})


if __name__ == "__main__":
    main()
