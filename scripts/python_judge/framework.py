"""Shared vocabulary for the Python judge's problem definitions.

Each problem carries a reference solution, a set of inputs, and a rule for
comparing a student's answer to the reference's. The expected outputs are not
written by hand — they are produced by *running* the reference, the same way
the SQL practice computes its expected grids. A problem whose reference fails
to run is refused rather than shipped with wrong answers.
"""

from dataclasses import dataclass, field
from typing import Any, Callable


# --- comparison rules ------------------------------------------------------
#
# A naive `==` marks correct answers wrong on half of these problems: Two Sum
# may return its indices either way round, 3Sum's triples are a set, and the
# in-place problems return None and mutate their first argument. The rule is
# part of the problem, so it lives beside it.

EXACT = {"kind": "exact"}
"""Straight equality. Scalars, and lists whose order is specified."""

SORTED = {"kind": "sorted"}
"""A flat list where order was never specified — compare as a multiset."""

UNORDERED_NESTED = {"kind": "unordered_nested"}
"""A list of lists where neither level has a specified order (3Sum, anagram
groups). Each inner list is sorted, then the outer list is."""


def inplace(arg: int = 0) -> dict:
    """The function returns None and mutates one argument; that is the answer."""
    return {"kind": "inplace", "arg": arg}


def k_prefix(arg: int = 0) -> dict:
    """Returns a length k; only the first k elements of `arg` are defined."""
    return {"kind": "k_prefix", "arg": arg}


OPS = {"kind": "ops"}
"""A design problem: a sequence of method calls, compared as an output list."""


@dataclass
class Problem:
    slug: str
    entry: str
    starter: str
    solution: str
    cases: list[list[Any]]
    compare: dict = field(default_factory=lambda: EXACT)
    """Called with (case_index) to build args when cases are generated."""
    note: str = ""


def cls(body: str) -> str:
    """Wraps a method body in the Solution class students are given."""
    return "class Solution:\n" + body.rstrip() + "\n"
