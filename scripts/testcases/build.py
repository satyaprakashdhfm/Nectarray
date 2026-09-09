"""Writes testcases/<slug>.json — 100 checked cases per problem.

Run from the repository root:

    python scripts/testcases/build.py            # all problems
    python scripts/testcases/build.py two-sum    # one, for iterating

Expectations come from the shipped reference solution. Every case small
enough to afford it is then recomputed by the brute force in oracles.py, and
any disagreement aborts the build rather than being written out — the whole
point of a second opinion is that it can stop the first one.

The two worked examples from each statement are marked public; the rest are
hidden, so a student can see the shape of a case without being handed the
answers to the other ninety-eight.
"""

from __future__ import annotations

import copy
import json
import pathlib
import random
import sys
import time

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(ROOT / "scripts" / "python_judge"))

import arrays as judge_arrays  # noqa: E402
import hashing as judge_hashing  # noqa: E402
import strings as judge_strings  # noqa: E402

from gen import BUCKETS, key  # noqa: E402
from specs import FLAVOURS, SPECS  # noqa: E402
import problems_arrays  # noqa: F401,E402
import problems_strings  # noqa: F401,E402
import problems_hashing  # noqa: F401,E402
from oracles import ORACLES  # noqa: E402

OUT = ROOT / "testcases"

JUDGE = {p.slug: p for m in (judge_arrays, judge_strings, judge_hashing)
         for p in m.PROBLEMS}


def run_reference(problem, args):
    """The shipped solution's answer, in the shape the compare rule wants."""
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
    """Puts an answer in a form where == means 'the judge would accept it'."""
    if kind == "sorted" and isinstance(value, list):
        return sorted(value)
    if kind == "unordered_nested" and isinstance(value, list):
        return sorted(sorted(inner) for inner in value)
    return value


def size_of(args) -> int:
    n = 0
    for a in args:
        if isinstance(a, (str, list)):
            n = max(n, len(a))
    return n


def check(slug, args, expected, kind) -> str | None:
    """Second opinion. Returns a complaint, or None when the two agree."""
    entry = ORACLES.get(slug)
    if entry is None:
        return None
    fn, limit = entry
    if size_of(args) > limit:
        return None
    try:
        theirs = fn(*copy.deepcopy(args))
    except Exception as exc:  # noqa: BLE001
        return f"oracle raised {exc!r}"
    if normalise(theirs, kind) != normalise(expected, kind):
        return f"oracle says {theirs!r}, reference says {expected!r}"
    return None


def build_one(slug: str, seed: int) -> dict:
    spec = SPECS[slug]
    problem = JUDGE[slug]
    kind = problem.compare["kind"]
    rng = random.Random(seed)

    cases, seen, complaints, verified = [], set(), [], 0

    def take(args, bucket, public=False) -> bool:
        nonlocal verified
        if not spec.validate(args, spec.limits):
            return False
        if spec.accept is not None and not spec.accept(args):
            return False
        k = key(args)
        if k in seen:
            return False
        try:
            expected = run_reference(problem, args)
        except Exception as exc:  # noqa: BLE001
            complaints.append(f"{slug}: reference raised {exc!r} on {args!r:.120}")
            return False
        problem_with = check(slug, args, expected, kind)
        if problem_with:
            complaints.append(f"{slug}: {problem_with}")
            return False
        # A case whose answer is longer than the question helps nobody and
        # costs the repository megabytes: 4Sum on a narrow band returns tens
        # of thousands of quadruplets. Skipped rather than trimmed, because a
        # truncated expectation would be a wrong expectation.
        if len(json.dumps(expected, separators=(",", ":"))) > 12_000:
            return False
        if ORACLES.get(slug) and size_of(args) <= ORACLES[slug][1]:
            verified += 1
        seen.add(k)
        cases.append({
            "id": len(cases) + 1,
            "bucket": bucket,
            "public": public,
            "args": args,
            "expect": expected,
        })
        return True

    for args in spec.official:
        take(copy.deepcopy(args), "official", public=True)

    for bucket, wanted in BUCKETS:
        if bucket == "official":
            # Any example that failed its own validator is a spec bug, but the
            # count still has to come out at 100, so the slack moves here.
            wanted = 2 - sum(1 for c in cases if c["bucket"] == "official")
            flavours = ["random"] * max(0, wanted)
        else:
            flavours = FLAVOURS[bucket]
        have = 0
        attempts = 0
        while have < wanted and attempts < wanted * 200:
            flavour = flavours[have % len(flavours)] if flavours else "random"
            attempts += 1
            try:
                args = spec.build(flavour, bucket, rng, spec.limits)
            except Exception as exc:  # noqa: BLE001
                complaints.append(f"{slug}: builder raised {exc!r}")
                break
            if take(args, bucket):
                have += 1

        # A structured flavour can be impossible for a given problem — there
        # is one all-zeros array of each length, and Two Sum cannot host a
        # unique pair in an all-equal one. Rather than let the bucket come up
        # short, the balance is made up with random inputs *of that bucket's
        # size*, so the distribution across sizes still holds.
        while have < wanted and attempts < wanted * 600:
            attempts += 1
            try:
                args = spec.build("random", bucket, rng, spec.limits)
            except Exception:  # noqa: BLE001
                break
            if take(args, bucket):
                have += 1

        if have < wanted:
            complaints.append(
                f"{slug}: only {have}/{wanted} for {bucket} after {attempts} tries")

    return {
        "slug": slug,
        "entry_point": problem.entry,
        "compare": problem.compare,
        "count": len(cases),
        "verified_against_oracle": verified,
        "cases": cases,
        "_complaints": complaints,
    }


def main() -> int:
    wanted = sys.argv[1:] or sorted(SPECS)
    missing = [s for s in wanted if s not in SPECS]
    if missing:
        print("no spec for:", ", ".join(missing))
        return 2

    OUT.mkdir(exist_ok=True)
    failures, total_cases, total_verified = [], 0, 0
    started = time.time()

    for slug in wanted:
        t0 = time.time()
        built = build_one(slug, seed=abs(hash(slug)) % (2**32))
        complaints = built.pop("_complaints")
        if complaints or built["count"] != 100:
            failures.append((slug, complaints[:3], built["count"]))
            print(f"  FAIL {slug}: {built['count']} cases; {complaints[:2]}")
            continue

        path = OUT / f"{slug}.json"
        path.write_text(json.dumps(built, separators=(",", ":")) + "\n",
                        encoding="utf8", newline="")
        total_cases += built["count"]
        total_verified += built["verified_against_oracle"]
        kb = path.stat().st_size / 1024
        print(f"  ok   {slug:52} {built['verified_against_oracle']:3}/100 verified"
              f"  {kb:7.1f} KB  {time.time() - t0:5.1f}s")

    print(f"\n{len(wanted) - len(failures)}/{len(wanted)} problems, "
          f"{total_cases} cases, {total_verified} cross-checked, "
          f"{time.time() - started:.1f}s")
    if failures:
        print(f"\n{len(failures)} failed:")
        for slug, why, count in failures:
            print(f"  {slug} ({count} cases): {why}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
