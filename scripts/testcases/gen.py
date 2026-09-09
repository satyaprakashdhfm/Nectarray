"""Input generators for the practice test suites.

The buckets are the ones the sheet asks for — minimum, edge, small, medium,
large, adversarial — and the shapes are the ones the problems actually take.
Everything is driven by an explicit `Limits`, because a generator that does
not know a problem's constraints produces inputs the reference has no defined
answer for, and an expectation computed from those is worse than no test.

Sizes are capped per problem rather than globally. A linear reference is
happy with a few thousand elements; the O(n^3) one behind 4Sum is not, and a
"large" case that takes a minute to compute is a large case nobody will run.
"""

from __future__ import annotations

import random
import string
from dataclasses import dataclass, field

BUCKETS = [
    ("official", 2),
    ("minimum", 5),
    ("edge", 15),
    ("small", 20),
    ("medium", 20),
    ("large", 20),
    ("adversarial", 18),
]
TOTAL = sum(n for _, n in BUCKETS)
assert TOTAL == 100


@dataclass
class Limits:
    """What a problem will accept. Every generated input is checked against it."""

    min_len: int = 0
    max_len: int = 2000
    lo: int = -10**9
    hi: int = 10**9
    # Sizes the buckets aim for; large is clamped to max_len.
    small: tuple[int, int] = (1, 12)
    medium: tuple[int, int] = (40, 200)
    large: tuple[int, int] = (600, 2000)
    alphabet: str = string.ascii_lowercase
    charset_small: str = "ab"
    extra: dict = field(default_factory=dict)

    def clamp_len(self, n: int) -> int:
        return max(self.min_len, min(self.max_len, n))

    def span(self, which: str, rng: random.Random) -> int:
        lo, hi = getattr(self, which)
        return self.clamp_len(rng.randint(lo, hi))


# --- integer arrays --------------------------------------------------------


def ints(rng: random.Random, n: int, lim: Limits) -> list[int]:
    return [rng.randint(lim.lo, lim.hi) for _ in range(n)]


def small_ints(rng: random.Random, n: int, lim: Limits, spread: int = 10) -> list[int]:
    """Values drawn from a narrow band, so duplicates and collisions happen."""
    lo = max(lim.lo, -spread)
    hi = min(lim.hi, spread)
    return [rng.randint(lo, hi) for _ in range(n)]


def all_equal(rng: random.Random, n: int, lim: Limits) -> list[int]:
    v = rng.randint(max(lim.lo, -50), min(lim.hi, 50))
    return [v] * n


def zeros(n: int, lim: Limits) -> list[int]:
    v = 0 if lim.lo <= 0 <= lim.hi else lim.lo
    return [v] * n


def ascending(rng: random.Random, n: int, lim: Limits) -> list[int]:
    return sorted(ints(rng, n, lim))


def descending(rng: random.Random, n: int, lim: Limits) -> list[int]:
    return sorted(ints(rng, n, lim), reverse=True)


def extremes(rng: random.Random, n: int, lim: Limits) -> list[int]:
    """Only the ends of the range — where overflow and sign bugs live."""
    return [rng.choice([lim.lo, lim.hi]) for _ in range(n)]


def with_duplicates(rng: random.Random, n: int, lim: Limits, distinct: int = 3) -> list[int]:
    pool = [rng.randint(max(lim.lo, -1000), min(lim.hi, 1000)) for _ in range(max(1, distinct))]
    return [rng.choice(pool) for _ in range(n)]


def negatives(rng: random.Random, n: int, lim: Limits) -> list[int]:
    hi = min(lim.hi, -1) if lim.lo < 0 else lim.hi
    lo = max(lim.lo, -10**6)
    if lo > hi:
        return ints(rng, n, lim)
    return [rng.randint(lo, hi) for _ in range(n)]


def sawtooth(rng: random.Random, n: int, lim: Limits) -> list[int]:
    """Alternating high and low — the worst case for several two-pointer walks."""
    lo = max(lim.lo, -1000)
    hi = min(lim.hi, 1000)
    return [hi if i % 2 else lo for i in range(n)]


# --- strings ---------------------------------------------------------------


def text(rng: random.Random, n: int, alphabet: str) -> str:
    return "".join(rng.choice(alphabet) for _ in range(n))


def palindrome(rng: random.Random, n: int, alphabet: str) -> str:
    half = text(rng, n // 2, alphabet)
    mid = rng.choice(alphabet) if n % 2 else ""
    return half + mid + half[::-1]


def repeated_block(rng: random.Random, n: int, alphabet: str) -> str:
    block = text(rng, max(1, min(4, n)), alphabet)
    return (block * (n // len(block) + 1))[:n]


def one_char(rng: random.Random, n: int, alphabet: str) -> str:
    return rng.choice(alphabet) * n


# --- helpers ---------------------------------------------------------------


def key(args: list) -> str:
    """A stable identity for a case, so duplicates can be spotted."""
    import json

    return json.dumps(args, sort_keys=True, separators=(",", ":"))


def fits(args: list, lim: Limits, validate) -> bool:
    try:
        return bool(validate(args, lim))
    except Exception:
        return False
