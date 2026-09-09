"""Specs for the hashing problems.

Top K Frequent is the one that needs care: the answer is only well defined
when the kth and (k+1)th frequencies differ, so the inputs are built with
every count distinct rather than left to chance.
"""

from __future__ import annotations

import random
import string as _string
from collections import Counter

from gen import Limits, text
from specs import Spec, SPECS, array_of, int_list_ok, list_and_int, one_list, string_of


def add(slug, limits, build, validate, official, accept=None):
    SPECS[slug] = Spec(slug, limits, build, validate, official, accept)


LOWER = _string.ascii_lowercase


add("contains-duplicate-ii",
    Limits(min_len=1, max_len=2000, lo=-10**9, hi=10**9,
           small=(1, 12), medium=(40, 200), large=(600, 2000)),
    lambda f, b, rng, lim: _nearby(f, b, rng, lim),
    lambda a, lim: list_and_int(a, lim) and a[1] >= 0,
    [[[1, 2, 3, 1], 3], [[1, 0, 1, 1], 1]])


def _nearby(f, b, rng, lim):
    values = array_of(f, b, rng, lim) or [0]
    if rng.random() < 0.5 and len(values) > 2:
        # Plant a repeat at a known distance, so k straddles the answer.
        i = rng.randrange(len(values) - 1)
        gap = rng.randint(1, min(8, len(values) - 1 - i))
        values[i + gap] = values[i]
        k = rng.choice([gap - 1, gap, gap + 1, rng.randint(0, len(values))])
    else:
        k = rng.choice([0, 1, len(values), rng.randint(0, len(values))])
    return [values, max(0, k)]


add("unique-number-of-occurrences",
    Limits(min_len=1, max_len=2000, lo=-1000, hi=1000,
           small=(1, 12), medium=(40, 200), large=(600, 2000)),
    lambda f, b, rng, lim: [array_of(f, b, rng, lim) or [0]],
    one_list,
    [[[1, 2, 2, 1, 1, 3]], [[1, 2]]])


add("longest-consecutive-sequence",
    Limits(min_len=0, max_len=2000, lo=-10**9, hi=10**9,
           small=(0, 12), medium=(40, 200), large=(600, 2000)),
    lambda f, b, rng, lim: [_consecutive(f, b, rng, lim)],
    one_list,
    [[[100, 4, 200, 1, 3, 2]], [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]]])


def _consecutive(f, b, rng, lim):
    values = array_of(f, b, rng, lim)
    if rng.random() < 0.55 and values:
        # A real run, buried in noise — otherwise the answer is almost always 1.
        start = rng.randint(-10**6, 10**6)
        run = rng.randint(2, max(2, len(values) // 2))
        block = list(range(start, start + run))
        values = block + values[: max(0, len(values) - run)]
        rng.shuffle(values)
    return values


add("intersection-of-two-arrays",
    Limits(min_len=1, max_len=1500, lo=0, hi=1000,
           small=(1, 12), medium=(40, 200), large=(400, 1500)),
    lambda f, b, rng, lim: _two_arrays(f, b, rng, lim),
    lambda a, lim: len(a) == 2 and int_list_ok(a[0], lim) and int_list_ok(a[1], lim),
    [[[1, 2, 2, 1], [2, 2]], [[4, 9, 5], [9, 4, 9, 8, 4]]])


def _two_arrays(f, b, rng, lim):
    a = array_of(f, b, rng, lim) or [0]
    c = array_of(f, b, rng, lim) or [0]
    if rng.random() < 0.5:
        c = c[: max(1, len(c) - 2)] + rng.sample(a, min(2, len(a)))
        rng.shuffle(c)
    return [a, c]


def _top_k(f, b, rng, lim):
    """Every value gets a different frequency, so the kth place cannot tie."""
    target = max(1, lim.span("small" if b in ("minimum", "edge", "small")
                             else ("large" if b == "large" else "medium"), rng))
    values, counts, total, used = [], [], 0, set()
    pool = rng.sample(range(-500, 500), min(999, max(1, target // 2 or 1)))
    for v in pool:
        c = rng.randint(1, max(2, target // 3))
        while c in used:
            c += 1
        if total + c > target:
            break
        used.add(c)
        values.append(v)
        counts.append(c)
        total += c
    if not values:
        values, counts = [rng.randint(-500, 500)], [max(1, target)]
    nums = []
    for v, c in zip(values, counts):
        nums.extend([v] * c)
    rng.shuffle(nums)
    return [nums, rng.randint(1, len(values))]


add("top-k-frequent-elements",
    Limits(min_len=1, max_len=2000, lo=-10**4, hi=10**4,
           small=(1, 14), medium=(40, 200), large=(600, 2000)),
    _top_k,
    lambda a, lim: list_and_int(a, lim) and 1 <= a[1] <= len(set(a[0])),
    [[[1, 1, 1, 2, 2, 3], 2], [[1], 1]],
    accept=lambda a: len(set(Counter(a[0]).values())) == len(Counter(a[0])))


# The reference pairs two arrays against two more: O(n^2), so n stays modest.
def _four_sum_ii(f, b, rng, lim):
    n = max(1, min(220, lim.span("small" if b in ("minimum", "edge", "small")
                                 else ("large" if b == "large" else "medium"), rng)))
    span = max(4, n)
    make = lambda: [rng.randint(-span, span) for _ in range(n)]  # noqa: E731
    if f in ("all_equal", "single", "zeros"):
        return [[0] * n, [0] * n, [0] * n, [0] * n]
    return [make(), make(), make(), make()]


add("4sum-ii",
    Limits(min_len=1, max_len=220, lo=-2**28, hi=2**28,
           small=(1, 10), medium=(30, 90), large=(120, 220)),
    _four_sum_ii,
    lambda a, lim: len(a) == 4 and all(int_list_ok(x, lim) for x in a)
    and len({len(x) for x in a}) == 1,
    [[[1, 2], [-2, -1], [-1, 2], [0, 2]], [[0], [0], [0], [0]]])


add("word-pattern",
    Limits(min_len=1, max_len=300, small=(1, 8), medium=(20, 60),
           large=(120, 300), alphabet=LOWER, charset_small="ab"),
    lambda f, b, rng, lim: _word_pattern(f, b, rng, lim),
    lambda a, lim: len(a) == 2 and isinstance(a[0], str) and isinstance(a[1], str)
    and a[0] and all(c in LOWER for c in a[0])
    and a[1] and "  " not in a[1] and not a[1].startswith(" ")
    and not a[1].endswith(" "),
    [["abba", "dog cat cat dog"], ["abba", "dog cat cat fish"]])


def _word_pattern(f, b, rng, lim):
    n = max(1, min(300, lim.span("small" if b in ("minimum", "edge", "small")
                                 else ("large" if b == "large" else "medium"), rng)))
    letters = rng.sample(LOWER, min(len(LOWER), max(1, n // 2 or 1)))
    pattern = "".join(rng.choice(letters) for _ in range(n))
    vocab = {c: text(rng, rng.randint(1, 5), LOWER) for c in set(pattern)}
    if rng.random() < 0.55:                            # a true bijection...
        words = [vocab[c] for c in pattern]
        if rng.random() < 0.4 and len(words) > 1:      # ...broken in one place
            words[rng.randrange(len(words))] = text(rng, rng.randint(1, 5), LOWER)
    else:
        words = [text(rng, rng.randint(1, 5), LOWER) for _ in pattern]
    return [pattern, " ".join(words)]


add("find-common-characters",
    Limits(min_len=1, max_len=120, small=(1, 8), medium=(15, 50),
           large=(60, 120), alphabet=LOWER, charset_small="ab"),
    lambda f, b, rng, lim: [_common_words(f, b, rng, lim)],
    lambda a, lim: len(a) == 1 and isinstance(a[0], list) and a[0]
    and all(isinstance(w, str) and w and all(c in LOWER for c in w) for w in a[0]),
    [[["bella", "label", "roller"]], [["cool", "lock", "cook"]]])


def _common_words(f, b, rng, lim):
    n = max(1, min(120, lim.span("small" if b in ("minimum", "edge", "small")
                                 else ("large" if b == "large" else "medium"), rng)))
    if rng.random() < 0.5:
        # Every word contains `core`, so the answer is non-empty rather than
        # the empty list a set of random words almost always gives.
        core = text(rng, rng.randint(1, 4), LOWER)
        words = []
        for _ in range(n):
            letters = list(core) + list(text(rng, rng.randint(0, 5), LOWER))
            rng.shuffle(letters)
            words.append("".join(letters))
        return words
    return [text(rng, rng.randint(1, 8), LOWER) for _ in range(n)]


add("find-all-anagrams-in-a-string",
    Limits(min_len=1, max_len=2000, small=(1, 14), medium=(40, 200),
           large=(500, 2000), alphabet=LOWER, charset_small="ab"),
    lambda f, b, rng, lim: _anagram_scan(f, b, rng, lim),
    lambda a, lim: len(a) == 2 and isinstance(a[0], str) and isinstance(a[1], str)
    and len(a[1]) >= 1 and all(c in LOWER for c in a[0] + a[1]),
    [["cbaebabacd", "abc"], ["abab", "ab"]])


def _anagram_scan(f, b, rng, lim):
    s = string_of(f, b, rng, lim) or "a"
    s = "".join(c if c in LOWER else "a" for c in s)
    if rng.random() < 0.6 and len(s) >= 2:
        k = rng.randint(1, min(5, len(s)))
        i = rng.randrange(len(s) - k + 1)
        p = "".join(rng.sample(s[i:i + k], k))
    else:
        p = text(rng, rng.randint(1, 4), LOWER)
    return [s, p]
