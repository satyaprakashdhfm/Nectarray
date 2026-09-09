"""Independent references, written the slow obvious way.

These exist to disagree with the fast solutions. An expectation computed by
the same code that will later be marked against is not a check of anything —
if the reference is wrong, the test enshrines the bug. So every case small
enough to afford it is computed twice, once by the shipped reference and once
by a brute force here, and a disagreement stops the build.

Deliberately naive: nested loops, whole-array copies, itertools. Where the
naive form is genuinely the same algorithm (there is only one way to merge two
sorted lists) the oracle is written from the other end — sort the concatenation
rather than walk two pointers — so it can still fail differently.
"""

from __future__ import annotations

import itertools
from collections import Counter

# Cases bigger than this are checked by invariant instead; an O(n^3) oracle on
# a thousand elements is not a test, it is a hang.
CHEAP = 260
VERY_CHEAP = 90

ORACLES = {}


def oracle(slug, limit=CHEAP):
    def wrap(fn):
        ORACLES[slug] = (fn, limit)
        return fn

    return wrap


def _size(args):
    n = 0
    for a in args:
        if isinstance(a, str):
            n = max(n, len(a))
        elif isinstance(a, list):
            n = max(n, len(a))
            for x in a:
                if isinstance(x, (list, str)):
                    n = max(n, len(a) * len(x))
    return n


# --- arrays ----------------------------------------------------------------


@oracle("two-sum")
def _(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []


@oracle("remove-duplicates-from-sorted-array")
def _(nums):
    seen = []
    for v in nums:
        if not seen or seen[-1] != v:
            seen.append(v)
    return {"k": len(seen), "prefix": seen}


@oracle("best-time-to-buy-and-sell-stock")
def _(prices):
    best = 0
    for i in range(len(prices)):
        for j in range(i + 1, len(prices)):
            best = max(best, prices[j] - prices[i])
    return best


@oracle("majority-element")
def _(nums):
    return Counter(nums).most_common(1)[0][0]


@oracle("move-zeroes")
def _(nums):
    kept = [v for v in nums if v != 0]
    return kept + [0] * (len(nums) - len(kept))


@oracle("contains-duplicate")
def _(nums):
    return len(set(nums)) != len(nums)


@oracle("missing-number")
def _(nums):
    return (set(range(len(nums) + 1)) - set(nums)).pop()


@oracle("plus-one")
def _(digits):
    return [int(c) for c in str(int("".join(map(str, digits))) + 1)]


@oracle("merge-sorted-array")
def _(nums1, m, nums2, n):
    return sorted(nums1[:m] + nums2)


@oracle("squares-of-a-sorted-array")
def _(nums):
    return sorted(v * v for v in nums)


@oracle("rotate-array")
def _(nums, k):
    n = len(nums)
    if n == 0:
        return []
    k %= n
    return nums[n - k:] + nums[: n - k]


@oracle("product-of-array-except-self")
def _(nums):
    out = []
    for i in range(len(nums)):
        p = 1
        for j, v in enumerate(nums):
            if i != j:
                p *= v
        out.append(p)
    return out


@oracle("maximum-subarray")
def _(nums):
    best = None
    for i in range(len(nums)):
        run = 0
        for j in range(i, len(nums)):
            run += nums[j]
            best = run if best is None else max(best, run)
    return best


@oracle("sort-colors")
def _(nums):
    return sorted(nums)


@oracle("subarray-sum-equals-k")
def _(nums, k):
    total = 0
    for i in range(len(nums)):
        run = 0
        for j in range(i, len(nums)):
            run += nums[j]
            if run == k:
                total += 1
    return total


@oracle("count-subarrays-with-xor-k")
def _(nums, k):
    total = 0
    for i in range(len(nums)):
        run = 0
        for j in range(i, len(nums)):
            run ^= nums[j]
            if run == k:
                total += 1
    return total


@oracle("find-the-duplicate-number")
def _(nums):
    return Counter(nums).most_common(1)[0][0]


@oracle("find-the-repeating-and-missing-number")
def _(nums):
    counts = Counter(nums)
    repeating = next(v for v, c in counts.items() if c == 2)
    missing = next(v for v in range(1, len(nums) + 1) if v not in counts)
    return [repeating, missing]


@oracle("count-inversions")
def _(nums):
    total = 0
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] > nums[j]:
                total += 1
    return total


@oracle("3sum", VERY_CHEAP)
def _(nums):
    found = set()
    for combo in itertools.combinations(sorted(nums), 3):
        if sum(combo) == 0:
            found.add(combo)
    return [list(c) for c in sorted(found)]


@oracle("4sum", VERY_CHEAP)
def _(nums, target):
    found = set()
    for combo in itertools.combinations(sorted(nums), 4):
        if sum(combo) == target:
            found.add(combo)
    return [list(c) for c in sorted(found)]


@oracle("container-with-most-water")
def _(height):
    best = 0
    for i in range(len(height)):
        for j in range(i + 1, len(height)):
            best = max(best, (j - i) * min(height[i], height[j]))
    return best


@oracle("merge-intervals")
def _(intervals):
    out = []
    for start, end in sorted(intervals):
        if out and start <= out[-1][1]:
            out[-1][1] = max(out[-1][1], end)
        else:
            out.append([start, end])
    return out


@oracle("intersection-of-two-arrays-ii")
def _(nums1, nums2):
    left, out = Counter(nums1), []
    for v in nums2:
        if left[v] > 0:
            left[v] -= 1
            out.append(v)
    return sorted(out)


@oracle("first-missing-positive")
def _(nums):
    present = set(nums)
    i = 1
    while i in present:
        i += 1
    return i


@oracle("median-of-two-sorted-arrays")
def _(nums1, nums2):
    merged = sorted(nums1 + nums2)
    n = len(merged)
    return float(merged[n // 2]) if n % 2 else (merged[n // 2 - 1] + merged[n // 2]) / 2


@oracle("next-permutation", 9)
def _(nums):
    perms = sorted(set(itertools.permutations(nums)))
    i = perms.index(tuple(nums))
    return list(perms[(i + 1) % len(perms)])


@oracle("set-matrix-zeroes")
def _(matrix):
    rows = {i for i, r in enumerate(matrix) for v in r if v == 0}
    cols = {j for r in matrix for j, v in enumerate(r) if v == 0}
    return [[0 if i in rows or j in cols else v for j, v in enumerate(r)]
            for i, r in enumerate(matrix)]


@oracle("spiral-matrix")
def _(matrix):
    grid = [row[:] for row in matrix]
    out = []
    while grid:
        out.extend(grid.pop(0))
        grid = [list(r) for r in zip(*grid)][::-1]  # rotate anticlockwise
    return out


# --- strings ---------------------------------------------------------------


@oracle("reverse-string")
def _(s):
    return list(reversed(s))


@oracle("valid-palindrome")
def _(s):
    kept = [c.lower() for c in s if c.isalnum()]
    return kept == kept[::-1]


@oracle("valid-anagram")
def _(s, t):
    return sorted(s) == sorted(t)


@oracle("longest-common-prefix")
def _(strs):
    if not strs:
        return ""
    out = ""
    for i in range(min(len(w) for w in strs)):
        if len({w[i] for w in strs}) != 1:
            break
        out += strs[0][i]
    return out


@oracle("find-the-index-of-the-first-occurrence-in-a-string")
def _(haystack, needle):
    for i in range(len(haystack) - len(needle) + 1):
        if haystack[i:i + len(needle)] == needle:
            return i
    return -1


@oracle("first-unique-character-in-a-string")
def _(s):
    for i, c in enumerate(s):
        if s.count(c) == 1:
            return i
    return -1


@oracle("isomorphic-strings")
def _(s, t):
    return len(set(s)) == len(set(t)) == len(set(zip(s, t)))


@oracle("ransom-note")
def _(note, magazine):
    have = Counter(magazine)
    for c in note:
        if have[c] == 0:
            return False
        have[c] -= 1
    return True


@oracle("longest-substring-without-repeating-characters")
def _(s):
    best = 0
    for i in range(len(s)):
        for j in range(i, len(s)):
            window = s[i:j + 1]
            if len(set(window)) == len(window):
                best = max(best, len(window))
            else:
                break
    return best


@oracle("longest-palindromic-substring")
def _(s):
    best = ""
    for i in range(len(s)):
        for j in range(i, len(s)):
            span = s[i:j + 1]
            if len(span) > len(best) and span == span[::-1]:
                best = span
    return best


@oracle("string-to-integer-atoi", 10**6)
def _(s):
    # Written as a pattern match rather than a scan, so it can disagree with
    # the reference's character-by-character walk. Parsing is where atoi goes
    # wrong, so this one is worth having.
    import re

    m = re.match(r"^ *([+-]?)(\d*)", s)
    sign, digits = m.group(1), m.group(2)
    if not digits:
        return 0
    value = int(digits) * (-1 if sign == "-" else 1)
    return max(-(2**31), min(2**31 - 1, value))


@oracle("group-anagrams")
def _(strs):
    groups = {}
    for w in strs:
        groups.setdefault("".join(sorted(w)), []).append(w)
    return [sorted(g) for g in groups.values()]


@oracle("longest-repeating-character-replacement")
def _(s, k):
    best = 0
    for i in range(len(s)):
        for j in range(i, len(s)):
            window = s[i:j + 1]
            if len(window) - Counter(window).most_common(1)[0][1] <= k:
                best = max(best, len(window))
    return best


@oracle("sort-characters-by-frequency")
def _(s):
    return "".join(c * n for c, n in Counter(s).most_common())


@oracle("minimum-window-substring")
def _(s, t):
    need = Counter(t)
    best = ""
    for i in range(len(s)):
        have = Counter()
        for j in range(i, len(s)):
            have[s[j]] += 1
            if all(have[c] >= n for c, n in need.items()):
                if not best or j - i + 1 < len(best):
                    best = s[i:j + 1]
                break
    return best


# --- hashing ---------------------------------------------------------------


@oracle("contains-duplicate-ii")
def _(nums, k):
    for i in range(len(nums)):
        for j in range(i + 1, min(len(nums), i + k + 1)):
            if nums[i] == nums[j]:
                return True
    return False


@oracle("word-pattern")
def _(pattern, s):
    words = s.split()
    if len(words) != len(pattern):
        return False
    return len(set(pattern)) == len(set(words)) == len(set(zip(pattern, words)))


@oracle("intersection-of-two-arrays")
def _(nums1, nums2):
    return sorted(set(nums1) & set(nums2))


@oracle("find-common-characters")
def _(words):
    shared = Counter(words[0])
    for w in words[1:]:
        shared &= Counter(w)
    return sorted(shared.elements())


@oracle("unique-number-of-occurrences")
def _(arr):
    counts = list(Counter(arr).values())
    return len(counts) == len(set(counts))


@oracle("top-k-frequent-elements")
def _(nums, k):
    return sorted(v for v, _ in Counter(nums).most_common(k))


@oracle("longest-consecutive-sequence")
def _(nums):
    present = set(nums)
    best = 0
    for v in present:
        if v - 1 not in present:
            run = 1
            while v + run in present:
                run += 1
            best = max(best, run)
    return best


@oracle("4sum-ii", 60)
def _(a, b, c, d):
    total = 0
    for x in a:
        for y in b:
            for z in c:
                for w in d:
                    if x + y + z + w == 0:
                        total += 1
    return total


@oracle("find-all-anagrams-in-a-string")
def _(s, p):
    want = Counter(p)
    return [i for i in range(len(s) - len(p) + 1)
            if Counter(s[i:i + len(p)]) == want]
