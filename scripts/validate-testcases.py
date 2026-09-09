#!/usr/bin/env python3
"""Checks every file in testcases/ against the five rules that matter.

    python scripts/validate-testcases.py            # all problems
    python scripts/validate-testcases.py two-sum    # one

  1. every problem has exactly 100 cases
  2. every input satisfies the problem's stated constraints
  3. every expected output matches the reference solution
  4. no duplicate inputs within a problem
  5. every file is valid JSON with the fields the judge needs

Check 3 is the expensive one and the reason this exists: a generated suite is
only worth what its expectations are worth, and the way they rot is somebody
editing a reference solution without regenerating. Running the reference again
here catches exactly that, and it is why this is a separate script rather than
a flag on the generator — a check that only ever runs inside the thing it is
checking is not much of a check.

Exit status is 0 when everything passes, 1 otherwise.
"""

from __future__ import annotations

import copy
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts" / "testcases"))
sys.path.insert(0, str(ROOT / "scripts" / "python_judge"))

import arrays as judge_arrays  # noqa: E402
import hashing as judge_hashing  # noqa: E402
import strings as judge_strings  # noqa: E402

from specs import SPECS  # noqa: E402
import problems_arrays  # noqa: F401,E402
import problems_hashing  # noqa: F401,E402
import problems_strings  # noqa: F401,E402

CASES = ROOT / "testcases"
EXPECTED_COUNT = 100

JUDGE = {p.slug: p for m in (judge_arrays, judge_strings, judge_hashing)
         for p in m.PROBLEMS}


def reference_answer(problem, args):
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


def normalise(value, kind):
    if kind == "sorted" and isinstance(value, list):
        return sorted(value)
    if kind == "unordered_nested" and isinstance(value, list):
        return sorted(sorted(inner) for inner in value)
    return value


def check_file(path: pathlib.Path) -> list[str]:
    slug = path.stem
    bad: list[str] = []

    # 5. valid JSON, with the fields the judge reads
    try:
        data = json.loads(path.read_text(encoding="utf8"))
    except Exception as exc:  # noqa: BLE001
        return [f"{slug}: not valid JSON — {exc}"]

    for field in ("slug", "entry_point", "compare", "cases"):
        if field not in data:
            bad.append(f"{slug}: missing field {field!r}")
    if bad:
        return bad
    if data["slug"] != slug:
        bad.append(f"{slug}: slug field says {data['slug']!r}")

    problem = JUDGE.get(slug)
    spec = SPECS.get(slug)
    if problem is None:
        return bad + [f"{slug}: no reference solution"]
    if spec is None:
        return bad + [f"{slug}: no spec, so constraints cannot be checked"]

    cases = data["cases"]
    kind = problem.compare["kind"]

    # 1. exactly 100
    if len(cases) != EXPECTED_COUNT:
        bad.append(f"{slug}: {len(cases)} cases, expected {EXPECTED_COUNT}")

    seen: dict[str, int] = {}
    wrong = dupes = invalid = 0

    for case in cases:
        n = case.get("id", "?")
        args = case.get("args")
        if args is None or "expect" not in case:
            bad.append(f"{slug}#{n}: case missing args or expect")
            continue

        # 4. no duplicate inputs
        fingerprint = json.dumps(args, sort_keys=True, separators=(",", ":"))
        if fingerprint in seen:
            dupes += 1
            if dupes <= 3:
                bad.append(f"{slug}#{n}: duplicate of #{seen[fingerprint]}")
        else:
            seen[fingerprint] = n

        # 2. within the stated constraints
        try:
            ok = spec.validate(copy.deepcopy(args), spec.limits)
        except Exception as exc:  # noqa: BLE001
            ok = False
            if invalid < 3:
                bad.append(f"{slug}#{n}: validator raised {exc!r}")
        if not ok:
            invalid += 1
            if invalid <= 3:
                bad.append(f"{slug}#{n}: input violates the constraints")

        # 3. the expectation still matches the reference
        try:
            fresh = reference_answer(problem, args)
        except Exception as exc:  # noqa: BLE001
            wrong += 1
            if wrong <= 3:
                bad.append(f"{slug}#{n}: reference raised {exc!r}")
            continue
        if normalise(fresh, kind) != normalise(case["expect"], kind):
            wrong += 1
            if wrong <= 3:
                bad.append(f"{slug}#{n}: expectation does not match the reference")

    for label, count in (("duplicate", dupes), ("invalid", invalid),
                         ("mismatched", wrong)):
        if count > 3:
            bad.append(f"{slug}: ...and {count - 3} more {label} cases")

    return bad


def main() -> int:
    if not CASES.is_dir():
        print(f"no {CASES} directory — run scripts/testcases/build.py first")
        return 1

    wanted = sys.argv[1:]
    files = sorted(CASES.glob("*.json"))
    if wanted:
        files = [f for f in files if f.stem in wanted]
    if not files:
        print("nothing to check")
        return 1

    missing = sorted(set(SPECS) - {f.stem for f in files})
    problems, total = [], 0
    for path in files:
        faults = check_file(path)
        total += 1
        if faults:
            problems.append((path.stem, faults))

    for slug, faults in problems:
        print(f"FAIL {slug}")
        for line in faults[:6]:
            print(f"     {line}")

    if not wanted and missing:
        print(f"\nno file for {len(missing)} problems: {', '.join(missing[:6])}"
              + (" ..." if len(missing) > 6 else ""))

    ok = total - len(problems)
    print(f"\n{ok}/{total} problem files pass all five checks"
          f" ({ok * EXPECTED_COUNT} cases)")
    return 1 if problems or (not wanted and missing) else 0


if __name__ == "__main__":
    raise SystemExit(main())
