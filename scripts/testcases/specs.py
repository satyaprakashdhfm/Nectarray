"""Per-problem input specs.

Two things live here for each problem, and both matter.

`limits` is what the statement promises, and every generated case is checked
against it before it is kept — an input outside the constraints has no
defined answer, so an expectation computed from one would be a test that
punishes a correct solution.

`repair` is the precondition the statement adds on top of the constraints.
Most of these problems will not accept an arbitrary array: Two Sum promises
exactly one pair, Find the Duplicate promises n+1 values in 1..n with one
repeat, the sorted-array problems promise sorted. A random list handed to any
of those produces a reference answer that means nothing, so the flavour is
generated first and then bent into shape.
"""

from __future__ import annotations

import random
import string
from dataclasses import dataclass
from typing import Callable

from gen import (
    Limits,
    all_equal,
    ascending,
    descending,
    extremes,
    ints,
    negatives,
    one_char,
    palindrome,
    repeated_block,
    sawtooth,
    small_ints,
    text,
    with_duplicates,
    zeros,
)

# Which shapes each bucket draws from. Edge and adversarial are the ones that
# find bugs, so they get the structured shapes rather than random noise.
FLAVOURS = {
    # Five *distinct* sizes rather than five draws at one size: the smallest
    # input is often unique (there is only one empty string), so asking for
    # five of it and de-duplicating leaves one.
    "minimum": ["min", "min1", "min2", "min3", "min4"],
    "edge": [
        "all_equal", "zeros", "ascending", "descending", "extremes",
        "negatives", "duplicates", "two_distinct", "single", "alternating",
        "ascending", "descending", "all_equal", "extremes", "duplicates",
    ],
    "small": ["random"] * 14 + ["small_range", "duplicates", "ascending",
                                "descending", "negatives", "all_equal"],
    "medium": ["random"] * 13 + ["small_range", "duplicates", "ascending",
                                 "descending", "negatives", "extremes", "sawtooth"],
    "large": ["random"] * 12 + ["ascending", "descending", "duplicates",
                                "small_range", "all_equal", "extremes",
                                "sawtooth", "negatives"],
    "adversarial": [
        "sawtooth", "all_equal", "extremes", "descending", "duplicates",
        "small_range", "sawtooth", "extremes", "all_equal", "descending",
        "duplicates", "small_range", "ascending", "sawtooth", "extremes",
        "negatives", "duplicates", "all_equal",
    ],
}

SIZE_FOR = {
    "official": "small",
    "minimum": None,        # handled by flavour
    "edge": "small",
    "small": "small",
    "medium": "medium",
    "large": "large",
    "adversarial": "medium",
}


def array_of(flavour: str, bucket: str, rng: random.Random, lim: Limits) -> list[int]:
    """One integer array of the requested shape, sized for its bucket."""
    if flavour == "min":
        n = lim.min_len
    elif flavour == "min1":
        n = lim.clamp_len(lim.min_len + 1)
    elif flavour.startswith("min") and flavour[3:].isdigit():
        n = lim.clamp_len(lim.min_len + int(flavour[3:]))
    elif bucket == "adversarial":
        n = lim.span("large", rng) if rng.random() < 0.4 else lim.span("medium", rng)
    else:
        n = lim.span(SIZE_FOR[bucket] or "small", rng)

    if n <= 0:
        return []

    if flavour.startswith("min") or flavour == "random":
        return ints(rng, n, lim)
    if flavour == "all_equal":
        return all_equal(rng, n, lim)
    if flavour == "zeros":
        return zeros(n, lim)
    if flavour == "ascending":
        return ascending(rng, n, lim)
    if flavour == "descending":
        return descending(rng, n, lim)
    if flavour == "extremes":
        return extremes(rng, n, lim)
    if flavour == "negatives":
        return negatives(rng, n, lim)
    if flavour == "duplicates":
        return with_duplicates(rng, n, lim, distinct=max(1, n // 8))
    if flavour == "two_distinct":
        return with_duplicates(rng, n, lim, distinct=2)
    if flavour == "single":
        return with_duplicates(rng, n, lim, distinct=1)
    if flavour == "alternating":
        return sawtooth(rng, n, lim)
    if flavour == "sawtooth":
        return sawtooth(rng, n, lim)
    if flavour == "small_range":
        return small_ints(rng, n, lim, spread=max(2, n // 4))
    return ints(rng, n, lim)


def string_of(flavour: str, bucket: str, rng: random.Random, lim: Limits) -> str:
    """One string of the requested shape. Mirrors array_of's flavour names."""
    if flavour == "min":
        n = lim.min_len
    elif flavour == "min1":
        n = lim.clamp_len(lim.min_len + 1)
    elif flavour.startswith("min") and flavour[3:].isdigit():
        n = lim.clamp_len(lim.min_len + int(flavour[3:]))
    elif bucket == "adversarial":
        n = lim.span("large", rng) if rng.random() < 0.4 else lim.span("medium", rng)
    else:
        n = lim.span(SIZE_FOR[bucket] or "small", rng)
    n = max(lim.min_len, n)

    if n == 0:
        return ""
    if flavour in ("all_equal", "single", "zeros"):
        return one_char(rng, n, lim.charset_small)
    if flavour in ("duplicates", "small_range", "two_distinct"):
        return text(rng, n, lim.charset_small)
    if flavour in ("ascending",):
        return "".join(sorted(text(rng, n, lim.alphabet)))
    if flavour in ("descending",):
        return "".join(sorted(text(rng, n, lim.alphabet), reverse=True))
    if flavour in ("alternating", "sawtooth"):
        return repeated_block(rng, n, lim.charset_small)
    if flavour in ("extremes", "negatives"):
        return palindrome(rng, n, lim.charset_small)
    return text(rng, n, lim.alphabet)


@dataclass
class Spec:
    """Everything needed to make 100 valid cases for one problem."""

    slug: str
    limits: Limits
    #  (flavour, bucket, rng, limits) -> the full argument list for the entry point
    build: Callable[[str, str, random.Random, Limits], list]
    #  (args, limits) -> True when the input satisfies the stated constraints
    validate: Callable[[list, Limits], bool]
    #  The two worked examples from the statement.
    official: list[list]
    #  (args) -> False to throw the input away *after* seeing it.
    #
    #  A few of these problems have inputs with more than one correct answer —
    #  two longest palindromes of equal length, two orderings of equally
    #  frequent characters — and the comparison is exact equality. Shipping
    #  one of those would mark a correct solution wrong, so the input is
    #  rejected rather than the rule loosened.
    accept: Callable[[list], bool] | None = None


SPECS: dict[str, Spec] = {}


def spec(slug: str, limits: Limits, official: list[list]):
    """Registers a problem. The decorated function is its builder."""

    def wrap(fn):
        validate = getattr(fn, "_validate", lambda args, lim: True)
        SPECS[slug] = Spec(slug, limits, fn, validate, official)
        return fn

    return wrap


def validates(fn):
    """Attaches a constraint check to a builder."""

    def attach(builder):
        builder._validate = fn
        return builder

    return attach


# --- shared validators -----------------------------------------------------


def int_list_ok(values, lim: Limits) -> bool:
    return (
        isinstance(values, list)
        and lim.min_len <= len(values) <= lim.max_len
        and all(isinstance(v, int) and lim.lo <= v <= lim.hi for v in values)
    )


def one_list(args, lim: Limits) -> bool:
    return len(args) == 1 and int_list_ok(args[0], lim)


def list_and_int(args, lim: Limits) -> bool:
    return len(args) == 2 and int_list_ok(args[0], lim) and isinstance(args[1], int)


def str_ok(s, lim: Limits) -> bool:
    return (
        isinstance(s, str)
        and lim.min_len <= len(s) <= lim.max_len
        and all(c in lim.alphabet for c in s)
    )
