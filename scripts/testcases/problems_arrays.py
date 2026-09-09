"""Specs for the array problems.

Where a builder does more than call `array_of`, the extra work is a
precondition from the statement rather than decoration — see the note in
specs.py. Sizes are capped by the reference's complexity: a linear reference
takes thousands of elements happily, the O(n^3) one behind 4Sum does not.
"""

from __future__ import annotations

import random

from gen import Limits, ints, small_ints
from specs import Spec, SPECS, array_of, int_list_ok, list_and_int, one_list


def add(slug, limits, build, validate, official):
    SPECS[slug] = Spec(slug, limits, build, validate, official)


# --- two-sum ---------------------------------------------------------------
# "Exactly one valid pair exists" is a promise the reference relies on, so the
# pair is planted and then the array is checked for a second one.

def _two_sum(flavour, bucket, rng, lim):
    # Only the *size* comes from the flavour. An all-equal or two-distinct
    # array cannot host exactly one pair, so the values are drawn distinct
    # from a band wide enough that a second pair is unlikely, and the shape
    # is then applied in a way that preserves distinctness.
    base = array_of(flavour, bucket, rng, lim)
    n = max(2, min(len(base) or 2, lim.max_len))
    span = max(4 * n, 64)
    for _ in range(50):
        values = rng.sample(range(-span, span), n)
        if flavour == "ascending":
            values.sort()
        elif flavour == "descending":
            values.sort(reverse=True)
        i, j = rng.sample(range(n), 2)
        target = values[i] + values[j]
        seen, hits = set(), 0
        for v in values:
            if target - v in seen:
                hits += 1
            seen.add(v)
        if hits == 1:
            return [values, target]
    return [[1, 2], 3]


add("two-sum",
    Limits(min_len=2, max_len=2000, lo=-10**9, hi=10**9,
           small=(2, 12), medium=(40, 200), large=(600, 2000)),
    _two_sum,
    lambda a, lim: list_and_int(a, lim) and len(a[0]) >= 2,
    [[[2, 7, 11, 15], 9], [[3, 2, 4], 6]])


# --- sorted-input problems -------------------------------------------------

add("remove-duplicates-from-sorted-array",
    Limits(min_len=1, max_len=2000, lo=-10**4, hi=10**4,
           small=(1, 12), medium=(40, 200), large=(600, 2000)),
    lambda f, b, rng, lim: [sorted(array_of(f, b, rng, lim) or [0])],
    lambda a, lim: one_list(a, lim) and a[0] == sorted(a[0]),
    [[[1, 1, 2]], [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]]])

add("squares-of-a-sorted-array",
    Limits(min_len=1, max_len=2000, lo=-10**4, hi=10**4,
           small=(1, 12), medium=(40, 200), large=(600, 2000)),
    lambda f, b, rng, lim: [sorted(array_of(f, b, rng, lim) or [0])],
    lambda a, lim: one_list(a, lim) and a[0] == sorted(a[0]),
    [[[-4, -1, 0, 3, 10]], [[-7, -3, 2, 3, 11]]])


# --- plain arrays ----------------------------------------------------------

def plain(slug, limits, official, min_one=True):
    def build(f, b, rng, lim):
        values = array_of(f, b, rng, lim)
        if min_one and not values:
            values = ints(rng, max(1, lim.min_len), lim)
        return [values]

    add(slug, limits, build, one_list, official)


plain("best-time-to-buy-and-sell-stock",
      Limits(min_len=1, max_len=2000, lo=0, hi=10**4,
             small=(1, 12), medium=(40, 200), large=(600, 2000)),
      [[[7, 1, 5, 3, 6, 4]], [[7, 6, 4, 3, 1]]])

plain("contains-duplicate",
      Limits(min_len=1, max_len=2000, lo=-10**9, hi=10**9,
             small=(1, 12), medium=(40, 200), large=(600, 2000)),
      [[[1, 2, 3, 1]], [[1, 2, 3, 4]]])

plain("maximum-subarray",
      Limits(min_len=1, max_len=2000, lo=-10**4, hi=10**4,
             small=(1, 12), medium=(40, 200), large=(600, 2000)),
      [[[-2, 1, -3, 4, -1, 2, 1, -5, 4]], [[5, 4, -1, 7, 8]]])

plain("container-with-most-water",
      Limits(min_len=2, max_len=2000, lo=0, hi=10**4,
             small=(2, 12), medium=(40, 200), large=(600, 2000)),
      [[[1, 8, 6, 2, 5, 4, 8, 3, 7]], [[1, 1]]])

plain("next-permutation",
      Limits(min_len=1, max_len=2000, lo=0, hi=100,
             small=(1, 12), medium=(40, 200), large=(600, 2000)),
      [[[1, 2, 3]], [[3, 2, 1]]])

plain("first-missing-positive",
      Limits(min_len=1, max_len=2000, lo=-2**31, hi=2**31 - 1,
             small=(1, 12), medium=(40, 200), large=(600, 2000)),
      [[[1, 2, 0]], [[3, 4, -1, 1]]])

plain("count-inversions",
      Limits(min_len=0, max_len=3000, lo=-10**9, hi=10**9,
             small=(0, 12), medium=(40, 200), large=(800, 3000)),
      [[[2, 3, 7, 1, 3, 5]], [[5, 4, 3, 2, 1]]])

plain("move-zeroes",
      Limits(min_len=1, max_len=2000, lo=-2**31, hi=2**31 - 1,
             small=(1, 12), medium=(40, 200), large=(600, 2000)),
      [[[0, 1, 0, 3, 12]], [[0]]])

# Products are promised to fit in 32 bits, which is what bounds the values.
plain("product-of-array-except-self",
      Limits(min_len=2, max_len=1200, lo=-30, hi=30,
             small=(2, 12), medium=(40, 200), large=(400, 1200)),
      [[[1, 2, 3, 4]], [[-1, 1, 0, -3, 3]]])


# --- planted-structure problems --------------------------------------------

def _majority(f, b, rng, lim):
    values = array_of(f, b, rng, lim)
    n = max(1, len(values))
    winner = rng.randint(max(lim.lo, -10**4), min(lim.hi, 10**4))
    need = n // 2 + 1
    out = [winner] * need + [rng.randint(max(lim.lo, -10**4), min(lim.hi, 10**4))
                             for _ in range(n - need)]
    rng.shuffle(out)
    return [out]


add("majority-element",
    Limits(min_len=1, max_len=2000, lo=-10**9, hi=10**9,
           small=(1, 12), medium=(40, 200), large=(600, 2000)),
    _majority,
    lambda a, lim: one_list(a, lim) and max(
        a[0].count(v) for v in set(a[0])) > len(a[0]) // 2,
    [[[3, 2, 3]], [[2, 2, 1, 1, 1, 2, 2]]])


def _missing_number(f, b, rng, lim):
    values = array_of(f, b, rng, lim)
    n = max(1, min(len(values) or 1, lim.max_len))
    pool = list(range(n + 1))
    pool.pop(rng.randrange(n + 1))
    rng.shuffle(pool)
    return [pool]


add("missing-number",
    Limits(min_len=1, max_len=2000, lo=0, hi=2000,
           small=(1, 12), medium=(40, 200), large=(600, 2000)),
    _missing_number,
    lambda a, lim: one_list(a, lim) and len(set(a[0])) == len(a[0])
    and all(0 <= v <= len(a[0]) for v in a[0]),
    [[[3, 0, 1]], [[9, 6, 4, 2, 3, 5, 7, 0, 1]]])


def _duplicate_number(f, b, rng, lim):
    values = array_of(f, b, rng, lim)
    n = max(1, min(len(values) or 1, lim.max_len - 1))
    dup = rng.randint(1, n)
    # n+1 slots: 1..n once, plus one more copy of dup.
    out = list(range(1, n + 1)) + [dup]
    if b in ("adversarial", "edge") and rng.random() < 0.4:
        # The statement allows the repeat to appear more than twice.
        extra = rng.randint(1, max(1, n // 4))
        out = [v for v in out if v != dup] + [dup] * (2 + extra)
        out = out[: n + 1] if len(out) > n + 1 else out
        while len(out) < n + 1:
            out.append(dup)
    rng.shuffle(out)
    return [out]


def _duplicate_ok(a, lim):
    if not one_list(a, lim):
        return False
    nums = a[0]
    n = len(nums) - 1
    if n < 1 or not all(1 <= v <= n for v in nums):
        return False
    repeated = [v for v in set(nums) if nums.count(v) > 1]
    return len(repeated) == 1


add("find-the-duplicate-number",
    Limits(min_len=2, max_len=1500, lo=1, hi=1500,
           small=(2, 12), medium=(40, 200), large=(400, 1500)),
    _duplicate_number, _duplicate_ok,
    [[[1, 3, 4, 2, 2]], [[3, 1, 3, 4, 2]]])


def _repeating_missing(f, b, rng, lim):
    values = array_of(f, b, rng, lim)
    n = max(2, min(len(values) or 2, lim.max_len))
    missing = rng.randint(1, n)
    repeating = rng.choice([v for v in range(1, n + 1) if v != missing])
    out = [v for v in range(1, n + 1) if v != missing] + [repeating]
    rng.shuffle(out)
    return [out]


def _repmiss_ok(a, lim):
    if not one_list(a, lim):
        return False
    nums = a[0]
    n = len(nums)
    if n < 2 or not all(1 <= v <= n for v in nums):
        return False
    counts = {}
    for v in nums:
        counts[v] = counts.get(v, 0) + 1
    twice = [v for v, c in counts.items() if c == 2]
    absent = [v for v in range(1, n + 1) if v not in counts]
    return len(twice) == 1 and len(absent) == 1 and len(counts) == n - 1


add("find-the-repeating-and-missing-number",
    Limits(min_len=2, max_len=1500, lo=1, hi=1500,
           small=(2, 12), medium=(40, 200), large=(400, 1500)),
    _repeating_missing, _repmiss_ok,
    [[[3, 1, 2, 5, 3]], [[1, 2, 2, 4]]])


def _sort_colors(f, b, rng, lim):
    values = array_of(f, b, rng, lim)
    n = max(1, len(values))
    if f in ("all_equal", "single"):
        return [[rng.choice([0, 1, 2])] * n]
    if f == "two_distinct":
        a, c = rng.sample([0, 1, 2], 2)
        return [[rng.choice([a, c]) for _ in range(n)]]
    return [[rng.randint(0, 2) for _ in range(n)]]


add("sort-colors",
    Limits(min_len=1, max_len=2000, lo=0, hi=2,
           small=(1, 12), medium=(40, 200), large=(600, 2000)),
    _sort_colors,
    lambda a, lim: one_list(a, lim) and all(v in (0, 1, 2) for v in a[0]),
    [[[2, 0, 2, 1, 1, 0]], [[2, 0, 1]]])


def _plus_one(f, b, rng, lim):
    values = array_of(f, b, rng, lim)
    n = max(1, len(values))
    if f in ("all_equal", "extremes") and rng.random() < 0.7:
        digits = [9] * n            # the all-nines carry
    elif f == "zeros":
        digits = [0]
    else:
        digits = [rng.randint(0, 9) for _ in range(n)]
        if digits[0] == 0:
            digits[0] = rng.randint(1, 9)
    return [digits]


add("plus-one",
    Limits(min_len=1, max_len=1500, lo=0, hi=9,
           small=(1, 12), medium=(40, 200), large=(400, 1500)),
    _plus_one,
    lambda a, lim: one_list(a, lim) and all(0 <= d <= 9 for d in a[0])
    and (a[0][0] != 0 or len(a[0]) == 1),
    [[[1, 2, 3]], [[9]]])


# --- two-argument problems -------------------------------------------------

def _rotate(f, b, rng, lim):
    values = array_of(f, b, rng, lim) or [1]
    k = rng.choice([0, 1, len(values), len(values) - 1, rng.randint(0, 2 * len(values))])
    return [values, max(0, k)]


add("rotate-array",
    Limits(min_len=1, max_len=2000, lo=-2**31, hi=2**31 - 1,
           small=(1, 12), medium=(40, 200), large=(600, 2000)),
    _rotate,
    lambda a, lim: list_and_int(a, lim) and a[1] >= 0,
    [[[1, 2, 3, 4, 5, 6, 7], 3], [[-1, -100, 3, 99], 2]])


def _subarray_sum(f, b, rng, lim):
    values = array_of(f, b, rng, lim) or [0]
    if rng.random() < 0.6 and values:
        # A k that certainly occurs: the sum of a real window.
        i = rng.randrange(len(values))
        j = rng.randint(i, len(values) - 1)
        k = sum(values[i:j + 1])
    else:
        k = rng.randint(-1000, 1000)
    return [values, k]


add("subarray-sum-equals-k",
    Limits(min_len=1, max_len=1500, lo=-1000, hi=1000,
           small=(1, 12), medium=(40, 200), large=(400, 1500)),
    _subarray_sum, list_and_int,
    [[[1, 1, 1], 2], [[1, 2, 3], 3]])


def _xor_k(f, b, rng, lim):
    values = array_of(f, b, rng, lim)
    values = [abs(v) % (10**6) for v in values]
    if rng.random() < 0.6 and values:
        i = rng.randrange(len(values))
        j = rng.randint(i, len(values) - 1)
        k = 0
        for v in values[i:j + 1]:
            k ^= v
    else:
        k = rng.randint(0, 32)
    return [values, k]


add("count-subarrays-with-xor-k",
    Limits(min_len=0, max_len=2000, lo=0, hi=10**9,
           small=(0, 12), medium=(40, 200), large=(600, 2000)),
    _xor_k,
    lambda a, lim: list_and_int(a, lim) and a[1] >= 0 and all(v >= 0 for v in a[0]),
    [[[4, 2, 2, 6, 4], 6], [[5, 6, 7, 8, 9], 5]])


def _two_arrays(f, b, rng, lim):
    a = array_of(f, b, rng, lim)
    c = array_of(f, b, rng, lim)
    if rng.random() < 0.5 and a:
        # Guarantee some overlap, or most cases answer "empty".
        c = c[: max(0, len(c) - 2)] + rng.sample(a, min(2, len(a)))
        rng.shuffle(c)
    return [a, c]


add("intersection-of-two-arrays-ii",
    Limits(min_len=0, max_len=1500, lo=0, hi=1000,
           small=(0, 12), medium=(40, 200), large=(400, 1500)),
    _two_arrays,
    lambda a, lim: len(a) == 2 and int_list_ok(a[0], lim) and int_list_ok(a[1], lim),
    [[[1, 2, 2, 1], [2, 2]], [[4, 9, 5], [9, 4, 9, 8, 4]]])


def _merge_sorted(f, b, rng, lim):
    a = sorted(array_of(f, b, rng, lim))
    c = sorted(array_of(f, b, rng, lim))
    m, n = len(a), len(c)
    return [a + [0] * n, m, c, n]


def _merge_sorted_ok(args, lim):
    nums1, m, nums2, n = args
    return (
        isinstance(m, int) and isinstance(n, int)
        and len(nums1) == m + n and len(nums2) == n
        and nums1[:m] == sorted(nums1[:m]) and nums2 == sorted(nums2)
        and all(lim.lo <= v <= lim.hi for v in nums1[:m] + nums2)
    )


add("merge-sorted-array",
    Limits(min_len=0, max_len=1000, lo=-10**9, hi=10**9,
           small=(0, 10), medium=(30, 150), large=(300, 1000)),
    _merge_sorted, _merge_sorted_ok,
    [[[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3], [[1], 1, [], 0]])


def _median(f, b, rng, lim):
    a = sorted(array_of(f, b, rng, lim))
    c = sorted(array_of(f, b, rng, lim))
    if not a and not c:
        a = [rng.randint(lim.lo, lim.hi)]
    return [a, c]


add("median-of-two-sorted-arrays",
    Limits(min_len=0, max_len=1200, lo=-10**6, hi=10**6,
           small=(0, 10), medium=(30, 150), large=(300, 1200)),
    _median,
    lambda a, lim: len(a) == 2 and int_list_ok(a[0], lim) and int_list_ok(a[1], lim)
    and a[0] == sorted(a[0]) and a[1] == sorted(a[1]) and (a[0] or a[1]),
    [[[1, 3], [2]], [[1, 2], [3, 4]]])


# --- quadratic and cubic references: sized down deliberately ---------------

def _three_sum(f, b, rng, lim):
    values = array_of(f, b, rng, lim)
    # A narrow band would return tens of thousands of triplets on a large
    # input; the band widens with n so the answer stays a sane size.
    if b in ("large", "medium", "adversarial") and len(values) > 40:
        width = max(50, len(values) * 4)
        values = [rng.randint(-width, width) for _ in range(len(values))]
    return [values]


add("3sum",
    Limits(min_len=0, max_len=600, lo=-10**5, hi=10**5,
           small=(0, 12), medium=(40, 150), large=(250, 600)),
    _three_sum, one_list,
    [[[-1, 0, 1, 2, -1, -4]], [[0, 1, 1]]])


def _four_sum(f, b, rng, lim):
    values = array_of(f, b, rng, lim)
    if len(values) > 30:
        width = max(40, len(values) * 4)
        values = [rng.randint(-width, width) for _ in range(len(values))]
    if rng.random() < 0.5 and len(values) >= 4:
        target = sum(rng.sample(values, 4))
    else:
        target = rng.randint(-200, 200)
    return [values, target]


add("4sum",
    Limits(min_len=0, max_len=140, lo=-10**9, hi=10**9,
           small=(0, 12), medium=(30, 70), large=(90, 140)),
    _four_sum, list_and_int,
    [[[1, 0, -1, 0, -2, 2], 0], [[2, 2, 2, 2, 2], 8]])


# --- matrices and intervals ------------------------------------------------

def _matrix(f, b, rng, lim, lo=-1000, hi=1000):
    n = max(1, lim.span("small" if b in ("edge", "small", "minimum") else
                        ("large" if b == "large" else "medium"), rng))
    rows = max(1, min(n, int(n ** 0.5) + rng.randint(0, 2)))
    cols = max(1, n // rows)
    if f in ("all_equal", "single"):
        v = rng.randint(lo, hi)
        return [[[v] * cols for _ in range(rows)]]
    if f == "zeros":
        return [[[0] * cols for _ in range(rows)]]
    return [[[rng.randint(lo, hi) for _ in range(cols)] for _ in range(rows)]]


def _matrix_ok(a, lim):
    m = a[0]
    return (
        len(a) == 1 and isinstance(m, list) and m
        and all(isinstance(r, list) and len(r) == len(m[0]) and r for r in m)
        and all(lim.lo <= v <= lim.hi for r in m for v in r)
    )


add("set-matrix-zeroes",
    Limits(min_len=1, max_len=1600, lo=-2**31, hi=2**31 - 1,
           small=(1, 12), medium=(20, 100), large=(200, 1600)),
    lambda f, b, rng, lim: _matrix(f, b, rng, lim), _matrix_ok,
    [[[[1, 1, 1], [1, 0, 1], [1, 1, 1]]],
     [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]]])

add("spiral-matrix",
    Limits(min_len=1, max_len=1600, lo=-100, hi=100,
           small=(1, 12), medium=(20, 100), large=(200, 1600)),
    lambda f, b, rng, lim: _matrix(f, b, rng, lim, -100, 100), _matrix_ok,
    [[[[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
     [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]]])


def _intervals(f, b, rng, lim):
    values = array_of(f, b, rng, lim)
    n = max(1, len(values) // 2 or 1)
    span = max(4, n * 3)
    out = []
    for _ in range(n):
        start = rng.randint(0, span)
        end = start + rng.randint(0, max(1, span // 4))
        out.append([start, min(end, lim.hi)])
    if f in ("all_equal", "single"):
        out = [out[0][:] for _ in range(n)]
    return [out]


def _intervals_ok(a, lim):
    iv = a[0]
    return (
        len(a) == 1 and isinstance(iv, list) and iv
        and all(isinstance(p, list) and len(p) == 2 and p[0] <= p[1]
                and lim.lo <= p[0] and p[1] <= lim.hi for p in iv)
    )


add("merge-intervals",
    Limits(min_len=1, max_len=1200, lo=0, hi=10**4,
           small=(2, 12), medium=(40, 200), large=(400, 1200)),
    _intervals, _intervals_ok,
    [[[[1, 3], [2, 6], [8, 10], [15, 18]]], [[[1, 4], [4, 5]]]])
