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
import time

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


def input_size(value) -> int:
    """How big one argument is, for growth measurement.

    The length of the longest sequence it contains. A list of lists counts by
    its total, a string by its characters, a bare int as nothing — an int is
    not what makes a solution slow, the thing it indexes into is.
    """
    if isinstance(value, str):
        return len(value)
    if isinstance(value, (list, tuple)):
        inner = sum(input_size(v) for v in value)
        return inner if inner else len(value)
    return 0


def peak_memory_kb() -> int:
    """Peak resident set size for this process, in kilobytes.

    ru_maxrss is in kilobytes on Linux and bytes on macOS; the judge runs on
    Linux, so this is taken as given rather than guessed at from the platform.

    It is the whole process, which means it includes the interpreter itself —
    the same thing every online judge reports, and the reason a solution that
    allocates nothing still shows several megabytes. What varies between two
    submissions is the part the student controls.
    """
    return int(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss)


def measure_allocations(namespace, entry, cases, copy):
    """Peak bytes allocated per call, over a spread of input sizes.

    A second pass, and a short one: tracemalloc roughly triples the cost of
    the code it watches, so running it over all hundred cases would be slower
    than the submission deserves and would corrupt the timings besides. Twelve
    cases spanning the size range are enough to tell O(1) from O(n).

    Peak *during the call* and not the process total, which is what makes this
    a measure of the answer rather than of the interpreter.
    """
    import tracemalloc

    sized = sorted(
        (
            (max((input_size(a) for a in c["args"]), default=0), c)
            for c in cases
        ),
        key=lambda pair: pair[0],
    )
    sized = [pair for pair in sized if pair[0] > 0]
    if len(sized) < 4:
        return []

    step = max(1, len(sized) // 12)
    chosen = sized[::step][-12:]

    out = []
    for size, case in chosen:
        args = copy.deepcopy(case["args"])
        try:
            method = getattr(namespace["Solution"](), entry)
            tracemalloc.start()
            method(*args)
            _, peak = tracemalloc.get_traced_memory()
            tracemalloc.stop()
            out.append([size, peak])
        except Exception:
            if tracemalloc.is_tracing():
                tracemalloc.stop()
            return []  # A throw here makes every later figure meaningless.
    return out


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
        result.setdefault("max_rss_kb", peak_memory_kb())
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
    # The submission's own time, and nothing else's.
    #
    # The wall time the parent measures is mostly the cost of starting a
    # Python interpreter — tens of milliseconds before a line of the
    # submission runs — and deep-copying a hundred large inputs is ours too.
    # Neither tells a student anything about the code they wrote, so the
    # clock covers the call and stops.
    solve_ns = 0
    # (size, nanoseconds) per case, so the web app can fit a growth curve to
    # the real inputs rather than to invented ones. Nothing extra is executed
    # for this: the cases have to run anyway, and they already range from two
    # elements to a couple of thousand.
    timings = []
    for case in cases:
        args = copy.deepcopy(case["args"])
        size = max((input_size(a) for a in args), default=0)
        try:
            method = getattr(namespace["Solution"](), entry, None)
            if method is None:
                done({"fatal": f"Solution has no method called {entry}."})
            call_started = time.perf_counter_ns()
            returned = method(*args)
            elapsed = time.perf_counter_ns() - call_started
            solve_ns += elapsed
            if size:
                timings.append([size, elapsed])

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

    done(
        {
            "results": results,
            "solve_ms": round(solve_ns / 1_000_000, 3),
            "timings": timings,
            "allocations": measure_allocations(namespace, entry, cases, copy),
        }
    )


if __name__ == "__main__":
    main()
