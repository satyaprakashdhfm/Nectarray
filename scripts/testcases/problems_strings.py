"""Specs for the string problems.

Three of these have inputs with more than one correct answer — the longest
palindrome, the minimum window and the frequency ordering can all tie — and
the judge compares exactly. Those specs carry an `accept` hook that rejects a
tied input outright, because loosening the comparison instead would let a
wrong answer through on every other case.
"""

from __future__ import annotations

import random
import string as _string
from collections import Counter

from gen import Limits, one_char, palindrome, repeated_block, text
from specs import Spec, SPECS, string_of


def add(slug, limits, build, validate, official, accept=None):
    SPECS[slug] = Spec(slug, limits, build, validate, official, accept)


LOWER = _string.ascii_lowercase
MIXED = _string.ascii_letters + _string.digits + " ,.:;!?'"


def s_ok(a, lim):
    return len(a) == 1 and isinstance(a[0], str) and lim.min_len <= len(a[0]) <= lim.max_len


def two_s_ok(a, lim):
    return (
        len(a) == 2 and all(isinstance(x, str) for x in a)
        and all(lim.min_len <= len(x) <= lim.max_len for x in a)
    )


# --- single string ---------------------------------------------------------

add("valid-palindrome",
    Limits(min_len=0, max_len=3000, small=(0, 14), medium=(40, 200),
           large=(800, 3000), alphabet=MIXED, charset_small="aA ,"),
    lambda f, b, rng, lim: [_palindromish(f, b, rng, lim)],
    s_ok,
    [["A man, a plan, a canal: Panama"], ["race a car"]])


def _palindromish(f, b, rng, lim):
    s = string_of(f, b, rng, lim)
    if rng.random() < 0.4:  # real palindromes, with punctuation between
        core = palindrome(rng, len(s), LOWER)
        return "".join(c + (rng.choice(" ,.") if rng.random() < 0.2 else "") for c in core)
    return s


add("first-unique-character-in-a-string",
    Limits(min_len=1, max_len=3000, small=(1, 14), medium=(40, 200),
           large=(800, 3000), alphabet=LOWER, charset_small="ab"),
    lambda f, b, rng, lim: [string_of(f, b, rng, lim) or "a"],
    lambda a, lim: s_ok(a, lim) and all(c in LOWER for c in a[0]),
    [["leetcode"], ["loveleetcode"]])

add("longest-substring-without-repeating-characters",
    Limits(min_len=0, max_len=3000, small=(0, 14), medium=(40, 200),
           large=(800, 3000), alphabet=LOWER + " !@#", charset_small="abc"),
    lambda f, b, rng, lim: [string_of(f, b, rng, lim)],
    s_ok,
    [["abcabcbb"], ["bbbbb"]])

# O(n^2) reference, and ties are possible — hence the smaller cap and the hook.
add("longest-palindromic-substring",
    Limits(min_len=1, max_len=400, small=(1, 14), medium=(30, 120),
           large=(200, 400), alphabet=LOWER, charset_small="ab"),
    lambda f, b, rng, lim: [_palindrome_input(f, b, rng, lim)],
    lambda a, lim: s_ok(a, lim) and all(c in LOWER for c in a[0]),
    [["cbbd"], ["racecar"]],
    accept=lambda a: _unique_longest_palindrome(a[0]))


def _palindrome_input(f, b, rng, lim):
    s = string_of(f, b, rng, lim) or "a"
    if rng.random() < 0.35:
        core = palindrome(rng, max(3, len(s) // 3), LOWER)
        pad = text(rng, max(0, len(s) - len(core)), LOWER)
        s = pad[: len(pad) // 2] + core + pad[len(pad) // 2:]
    return s


def _unique_longest_palindrome(s: str) -> bool:
    """True when exactly one substring achieves the maximum length."""
    if not s:
        return False
    best, winners = 0, set()
    n = len(s)
    for centre in range(2 * n - 1):
        lo, hi = centre // 2, centre // 2 + centre % 2
        while lo >= 0 and hi < n and s[lo] == s[hi]:
            lo -= 1
            hi += 1
        span = s[lo + 1:hi]
        if len(span) > best:
            best, winners = len(span), {span}
        elif len(span) == best:
            winners.add(span)
    return len(winners) == 1


# Ties in frequency make the ordering ambiguous, so every count must differ.
add("sort-characters-by-frequency",
    Limits(min_len=1, max_len=2000, small=(1, 14), medium=(40, 200),
           large=(500, 2000), alphabet=LOWER + LOWER.upper(), charset_small="ab"),
    lambda f, b, rng, lim: [_distinct_frequency_string(rng, lim, b)],
    lambda a, lim: s_ok(a, lim),
    [["tree"], ["cccaaa"]],
    accept=lambda a: len(set(Counter(a[0]).values())) == len(Counter(a[0])))


def _distinct_frequency_string(rng, lim, bucket):
    """Builds a string whose character counts are all different."""
    target = lim.span("small" if bucket in ("minimum", "edge", "small")
                      else ("large" if bucket == "large" else "medium"), rng)
    target = max(1, target)
    letters = rng.sample(LOWER, min(len(LOWER), max(1, target // 3 or 1)))
    counts, used, total = [], set(), 0
    for ch in letters:
        c = rng.randint(1, max(2, target // 2))
        while c in used:
            c += 1
        if total + c > target:
            break
        used.add(c)
        counts.append((ch, c))
        total += c
    if not counts:
        counts = [(rng.choice(LOWER), max(1, target))]
    out = "".join(ch * c for ch, c in counts)
    return "".join(rng.sample(out, len(out)))


add("string-to-integer-atoi",
    Limits(min_len=0, max_len=400, small=(0, 14), medium=(20, 80),
           large=(120, 400), alphabet=_string.digits + " +-abz.", charset_small="0 -"),
    lambda f, b, rng, lim: [_atoi_input(f, b, rng, lim)],
    s_ok,
    [["42"], ["   -42"]])


def _atoi_input(f, b, rng, lim):
    n = max(0, min(lim.max_len, lim.span("small" if b in ("minimum", "edge", "small")
                                         else ("large" if b == "large" else "medium"), rng)))
    kind = rng.random()
    lead = " " * rng.randint(0, 3)
    sign = rng.choice(["", "+", "-"])
    if kind < 0.25:                      # well past 32 bits, to force clamping
        return lead + sign + "".join(rng.choice(_string.digits) for _ in range(max(1, n)))
    if kind < 0.4:
        return lead + sign + str(rng.choice([2**31 - 1, 2**31, -2**31, 0]))
    if kind < 0.55:                      # junk before any digit
        return lead + text(rng, max(1, n), "abz.") + str(rng.randint(0, 999))
    if kind < 0.7:                       # digits then trailing junk
        return lead + sign + str(rng.randint(0, 10**6)) + text(rng, min(5, n), "abz .")
    return lead + sign + text(rng, max(1, n), _string.digits + " ab")


# --- two strings -----------------------------------------------------------

add("valid-anagram",
    Limits(min_len=0, max_len=2000, small=(0, 14), medium=(40, 200),
           large=(500, 2000), alphabet=LOWER, charset_small="ab"),
    lambda f, b, rng, lim: _anagram_pair(f, b, rng, lim), two_s_ok,
    [["anagram", "nagaram"], ["rat", "car"]])


def _anagram_pair(f, b, rng, lim):
    s = string_of(f, b, rng, lim)
    if rng.random() < 0.5 and s:                    # a true anagram
        t = "".join(rng.sample(s, len(s)))
        if rng.random() < 0.35 and t:               # ...or nearly one
            i = rng.randrange(len(t))
            t = t[:i] + rng.choice(LOWER) + t[i + 1:]
        return [s, t]
    return [s, string_of(f, b, rng, lim)]


add("isomorphic-strings",
    Limits(min_len=0, max_len=2000, small=(0, 14), medium=(40, 200),
           large=(500, 2000), alphabet=LOWER + "0123456789", charset_small="ab"),
    lambda f, b, rng, lim: _isomorphic_pair(f, b, rng, lim),
    lambda a, lim: two_s_ok(a, lim) and len(a[0]) == len(a[1]),
    [["egg", "add"], ["foo", "bar"]])


def _isomorphic_pair(f, b, rng, lim):
    s = string_of(f, b, rng, lim)
    if rng.random() < 0.5:                          # a genuine relabelling
        pool = rng.sample(LOWER, min(len(set(s)) or 1, len(LOWER)))
        mapping = {c: pool[i % len(pool)] for i, c in enumerate(dict.fromkeys(s))}
        t = "".join(mapping[c] for c in s)
        if rng.random() < 0.4 and t:                # ...broken in one place
            i = rng.randrange(len(t))
            t = t[:i] + rng.choice(LOWER) + t[i + 1:]
        return [s, t]
    return [s, "".join(rng.choice(LOWER) for _ in s)]


add("ransom-note",
    Limits(min_len=0, max_len=2000, small=(0, 14), medium=(40, 200),
           large=(500, 2000), alphabet=LOWER, charset_small="ab"),
    lambda f, b, rng, lim: _ransom_pair(f, b, rng, lim), two_s_ok,
    [["a", "b"], ["aa", "aab"]])


def _ransom_pair(f, b, rng, lim):
    magazine = string_of(f, b, rng, lim)
    if rng.random() < 0.55 and magazine:            # constructible
        k = rng.randint(0, len(magazine))
        note = "".join(rng.sample(magazine, k))
        if rng.random() < 0.4:                      # ...one letter short
            note += rng.choice(LOWER)
        return [note, magazine]
    return [string_of(f, b, rng, lim), magazine]


add("find-the-index-of-the-first-occurrence-in-a-string",
    Limits(min_len=1, max_len=2000, small=(1, 14), medium=(40, 200),
           large=(500, 2000), alphabet=LOWER, charset_small="ab"),
    lambda f, b, rng, lim: _haystack(f, b, rng, lim),
    lambda a, lim: two_s_ok(a, lim) and len(a[1]) >= 1,
    [["sadbutsad", "sad"], ["leetcode", "leeto"]])


def _haystack(f, b, rng, lim):
    hay = string_of(f, b, rng, lim) or "a"
    if rng.random() < 0.55 and len(hay) >= 2:       # present
        i = rng.randrange(len(hay))
        j = rng.randint(i + 1, min(len(hay), i + 6))
        return [hay, hay[i:j]]
    return [hay, text(rng, rng.randint(1, 4), LOWER)]


# Ties are possible in principle; LeetCode promises a unique answer, so any
# input with two windows of the minimum length is rejected.
add("minimum-window-substring",
    Limits(min_len=1, max_len=1200, small=(1, 14), medium=(40, 200),
           large=(300, 1200), alphabet=LOWER + LOWER.upper(), charset_small="ABab"),
    lambda f, b, rng, lim: _window_pair(f, b, rng, lim),
    lambda a, lim: two_s_ok(a, lim) and len(a[1]) >= 1,
    [["ADOBECODEBANC", "ABC"], ["a", "a"]],
    accept=lambda a: _unique_min_window(a[0], a[1]))


def _window_pair(f, b, rng, lim):
    s = string_of(f, b, rng, lim) or "a"
    if rng.random() < 0.6:
        k = rng.randint(1, min(4, len(s)))
        t = "".join(rng.sample(s, k))
    else:
        t = text(rng, rng.randint(1, 3), lim.charset_small)
    return [s, t]


def _unique_min_window(s: str, t: str) -> bool:
    """One shortest covering window, or none at all — both are unambiguous."""
    need = Counter(t)
    missing = len(need)
    have = Counter()
    best, winners, lo = None, set(), 0
    for hi, ch in enumerate(s):
        have[ch] += 1
        if ch in need and have[ch] == need[ch]:
            missing -= 1
        while missing == 0:
            span = s[lo:hi + 1]
            if best is None or len(span) < best:
                best, winners = len(span), {(lo, hi)}
            elif len(span) == best:
                winners.add((lo, hi))
            out = s[lo]
            have[out] -= 1
            if out in need and have[out] == need[out] - 1:
                missing += 1
            lo += 1
    return best is None or len(winners) == 1


add("longest-repeating-character-replacement",
    Limits(min_len=1, max_len=2000, small=(1, 14), medium=(40, 200),
           large=(500, 2000), alphabet=LOWER.upper(), charset_small="AB"),
    lambda f, b, rng, lim: _replacement(f, b, rng, lim),
    lambda a, lim: len(a) == 2 and isinstance(a[0], str) and isinstance(a[1], int)
    and 0 <= a[1] <= len(a[0]) and lim.min_len <= len(a[0]) <= lim.max_len,
    [["ABAB", 2], ["AABABBA", 1]])


def _replacement(f, b, rng, lim):
    s = string_of(f, b, rng, lim) or "A"
    k = rng.choice([0, 1, len(s), rng.randint(0, max(1, len(s) // 2))])
    return [s, min(k, len(s))]


# --- lists of strings ------------------------------------------------------

add("reverse-string",
    Limits(min_len=1, max_len=3000, small=(1, 14), medium=(40, 200),
           large=(800, 3000), alphabet=LOWER + LOWER.upper(), charset_small="ab"),
    lambda f, b, rng, lim: [list(string_of(f, b, rng, lim) or "a")],
    lambda a, lim: len(a) == 1 and isinstance(a[0], list)
    and all(isinstance(c, str) and len(c) == 1 for c in a[0])
    and lim.min_len <= len(a[0]) <= lim.max_len,
    [[list("hello")], [list("Hannah")]])

add("longest-common-prefix",
    Limits(min_len=1, max_len=300, small=(1, 8), medium=(20, 60),
           large=(120, 300), alphabet=LOWER, charset_small="ab"),
    lambda f, b, rng, lim: [_prefix_group(f, b, rng, lim)],
    lambda a, lim: len(a) == 1 and isinstance(a[0], list) and a[0]
    and all(isinstance(w, str) for w in a[0]),
    [[["flower", "flow", "flight"]], [["dog", "racecar", "car"]]])


def _prefix_group(f, b, rng, lim):
    n = max(1, lim.span("small" if b in ("minimum", "edge", "small")
                        else ("large" if b == "large" else "medium"), rng))
    n = min(n, 300)
    if rng.random() < 0.6:                          # a shared prefix
        stem = text(rng, rng.randint(0, 6), LOWER)
        return [stem + text(rng, rng.randint(0, 6), LOWER) for _ in range(n)]
    return [text(rng, rng.randint(0, 8), LOWER) for _ in range(n)]


add("group-anagrams",
    Limits(min_len=1, max_len=600, small=(1, 10), medium=(30, 120),
           large=(250, 600), alphabet=LOWER, charset_small="ab"),
    lambda f, b, rng, lim: [_anagram_group(f, b, rng, lim)],
    lambda a, lim: len(a) == 1 and isinstance(a[0], list)
    and all(isinstance(w, str) for w in a[0]),
    [[["eat", "tea", "tan", "ate", "nat", "bat"]], [[""]]])


def _anagram_group(f, b, rng, lim):
    n = max(1, min(600, lim.span("small" if b in ("minimum", "edge", "small")
                                 else ("large" if b == "large" else "medium"), rng)))
    stems = [text(rng, rng.randint(0, 5), LOWER) for _ in range(max(1, n // 3))]
    out = []
    for _ in range(n):
        stem = rng.choice(stems)
        out.append("".join(rng.sample(stem, len(stem))) if stem else "")
    return out
