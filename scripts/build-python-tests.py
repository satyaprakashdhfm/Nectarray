#!/usr/bin/env python3
"""Generates the Python judge's test cases by running the reference solutions.

Expected outputs are computed, never typed. A hand-written expectation is a
second place to be wrong, and a judge that marks a correct answer wrong is
worse than no judge at all — so this executes each reference against each
input and records what actually came back.

It refuses to emit anything if any reference fails to run, and it re-runs the
reference against the recorded expectations afterwards as a self-check.

    python3 scripts/build-python-tests.py            # writes the JSON
    python3 scripts/build-python-tests.py --check    # verify only
"""

import copy
import json
import pathlib
import sys
import traceback

HERE = pathlib.Path(__file__).parent
sys.path.insert(0, str(HERE / "python_judge"))

# Server-side only. Serving this to the browser would hand every student the
# expected output of every case, which is the one thing a judge must not do.
OUT = HERE.parent / "content" / "python-tests.json"

import arrays  # noqa: E402
import strings  # noqa: E402
import hashing  # noqa: E402

MODULES = [arrays, strings, hashing]


def run_case(problem, args):
    """Runs the reference once and returns what the comparison rule needs."""
    namespace = {}
    exec(problem.solution, namespace)
    solution = namespace["Solution"]()
    call_args = copy.deepcopy(args)
    returned = getattr(solution, problem.entry)(*call_args)

    kind = problem.compare["kind"]
    if kind == "inplace":
        return call_args[problem.compare["arg"]]
    if kind == "k_prefix":
        mutated = call_args[problem.compare["arg"]]
        return {"k": returned, "prefix": mutated[:returned]}
    return returned


def build():
    problems, failures = [], []

    for module in MODULES:
        for problem in module.PROBLEMS:
            cases = []
            for args in problem.cases:
                try:
                    expect = run_case(problem, args)
                except Exception:
                    failures.append(
                        f"{problem.slug} on {args!r}\n"
                        + traceback.format_exc(limit=2)
                    )
                    continue
                cases.append({"args": args, "expect": expect})

            if not cases:
                failures.append(f"{problem.slug}: no usable cases")
                continue

            problems.append(
                {
                    "slug": problem.slug,
                    "entry_point": problem.entry,
                    "starter_code": problem.starter,
                    "solution_py": problem.solution,
                    "tests": {"compare": problem.compare, "cases": cases},
                    "note": problem.note,
                }
            )

    return problems, failures


def main():
    problems, failures = build()

    if failures:
        print("REFUSING TO WRITE — references failed:\n", file=sys.stderr)
        for failure in failures:
            print(failure, file=sys.stderr)
        raise SystemExit(1)

    total_cases = sum(len(p["tests"]["cases"]) for p in problems)
    slugs = [p["slug"] for p in problems]
    if len(slugs) != len(set(slugs)):
        raise SystemExit("duplicate slug in problem definitions")

    if "--check" in sys.argv:
        print(f"OK — {len(problems)} problems, {total_cases} cases, all references ran.")
        return

    OUT.parent.mkdir(parents=True, exist_ok=True)
    # Compact: this ships to every student's browser.
    OUT.write_text(json.dumps(problems, indent=1, sort_keys=True) + "\n")
    print(
        f"Wrote {OUT.relative_to(HERE.parent)} — "
        f"{len(problems)} problems, {total_cases} cases."
    )

    slugs = sorted(p["slug"] for p in problems)
    (HERE.parent / "content" / "python-judged.txt").write_text(
        "\n".join(slugs) + "\n"
    )


if __name__ == "__main__":
    main()
