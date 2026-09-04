"""Hashing and counting problems.

The two design problems on the sheet — LRU Cache and Insert Delete GetRandom —
are deliberately absent. They are graded by a sequence of method calls rather
than one function, and GetRandom has no single right answer; both keep the
screenshot review instead of getting a judge that would be wrong about them.
"""

from framework import SORTED, Problem

PROBLEMS = [
    Problem(
        slug="contains-duplicate-ii",
        entry="containsNearbyDuplicate",
        starter="class Solution:\n    def containsNearbyDuplicate(self, nums: list[int], k: int) -> bool:\n        ",
        solution="""class Solution:
    def containsNearbyDuplicate(self, nums: list[int], k: int) -> bool:
        last = {}
        for i, n in enumerate(nums):
            if n in last and i - last[n] <= k:
                return True
            last[n] = i
        return False
""",
        cases=[
            [[1, 2, 3, 1], 3],
            [[1, 0, 1, 1], 1],
            [[1, 2, 3, 1, 2, 3], 2],
            [[1], 0],
            [[99, 99], 2],
        ],
    ),
    Problem(
        slug="word-pattern",
        entry="wordPattern",
        starter="class Solution:\n    def wordPattern(self, pattern: str, s: str) -> bool:\n        ",
        solution="""class Solution:
    def wordPattern(self, pattern: str, s: str) -> bool:
        words = s.split()
        if len(pattern) != len(words):
            return False
        forward, backward = {}, {}
        for c, word in zip(pattern, words):
            if forward.setdefault(c, word) != word:
                return False
            if backward.setdefault(word, c) != c:
                return False
        return True
""",
        cases=[
            ["abba", "dog cat cat dog"],
            ["abba", "dog cat cat fish"],
            ["aaaa", "dog cat cat dog"],
            ["abba", "dog dog dog dog"],
            ["a", "dog"],
        ],
    ),
    Problem(
        slug="intersection-of-two-arrays",
        entry="intersection",
        starter="class Solution:\n    def intersection(self, nums1: list[int], nums2: list[int]) -> list[int]:\n        ",
        solution="""class Solution:
    def intersection(self, nums1: list[int], nums2: list[int]) -> list[int]:
        return list(set(nums1) & set(nums2))
""",
        compare=SORTED,
        cases=[
            [[1, 2, 2, 1], [2, 2]],
            [[4, 9, 5], [9, 4, 9, 8, 4]],
            [[1], [1]],
            [[1, 2], [3, 4]],
            [[], [1]],
        ],
    ),
    Problem(
        slug="find-common-characters",
        entry="commonChars",
        starter="class Solution:\n    def commonChars(self, words: list[str]) -> list[str]:\n        ",
        solution="""class Solution:
    def commonChars(self, words: list[str]) -> list[str]:
        from collections import Counter
        from functools import reduce
        shared = reduce(lambda a, b: a & b, (Counter(w) for w in words))
        return list(shared.elements())
""",
        compare=SORTED,
        cases=[
            [["bella", "label", "roller"]],
            [["cool", "lock", "cook"]],
            [["abc"]],
            [["a", "b"]],
            [["aab", "aac", "aad"]],
        ],
    ),
    Problem(
        slug="unique-number-of-occurrences",
        entry="uniqueOccurrences",
        starter="class Solution:\n    def uniqueOccurrences(self, arr: list[int]) -> bool:\n        ",
        solution="""class Solution:
    def uniqueOccurrences(self, arr: list[int]) -> bool:
        from collections import Counter
        counts = list(Counter(arr).values())
        return len(counts) == len(set(counts))
""",
        cases=[
            [[1, 2, 2, 1, 1, 3]],
            [[1, 2]],
            [[-3, 0, 1, -3, 1, 1, 1, -3, 10, 0]],
            [[1]],
            [[1, 1, 2, 2]],
        ],
    ),
    Problem(
        slug="top-k-frequent-elements",
        entry="topKFrequent",
        starter="class Solution:\n    def topKFrequent(self, nums: list[int], k: int) -> list[int]:\n        ",
        solution="""class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        from collections import Counter
        return [n for n, _ in Counter(nums).most_common(k)]
""",
        compare=SORTED,
        cases=[
            [[1, 1, 1, 2, 2, 3], 2],
            [[1], 1],
            [[4, 4, 4, 5, 5, 6], 2],
            [[3, 3, 3, 1, 1, 2], 1],
            [[7, 7, 8, 8, 8, 9], 3],
        ],
        note="Frequencies are distinct in every case, so the set of answers is unique.",
    ),
    Problem(
        slug="longest-consecutive-sequence",
        entry="longestConsecutive",
        starter="class Solution:\n    def longestConsecutive(self, nums: list[int]) -> int:\n        ",
        solution="""class Solution:
    def longestConsecutive(self, nums: list[int]) -> int:
        seen = set(nums)
        best = 0
        for n in seen:
            if n - 1 not in seen:
                length = 1
                while n + length in seen:
                    length += 1
                best = max(best, length)
        return best
""",
        cases=[
            [[100, 4, 200, 1, 3, 2]],
            [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]],
            [[]],
            [[1, 1, 1]],
            [[-3, -2, -1, 5]],
        ],
    ),
    Problem(
        slug="4sum-ii",
        entry="fourSumCount",
        starter="class Solution:\n    def fourSumCount(self, nums1: list[int], nums2: list[int], nums3: list[int], nums4: list[int]) -> int:\n        ",
        solution="""class Solution:
    def fourSumCount(self, nums1, nums2, nums3, nums4) -> int:
        from collections import Counter
        pairs = Counter(a + b for a in nums1 for b in nums2)
        return sum(pairs[-(c + d)] for c in nums3 for d in nums4)
""",
        cases=[
            [[1, 2], [-2, -1], [-1, 2], [0, 2]],
            [[0], [0], [0], [0]],
            [[1], [-1], [0], [0]],
            [[-1, -1], [-1, 1], [-1, 1], [1, -1]],
            [[1, 2, 3], [1, 2, 3], [-1, -2, -3], [-1, -2, -3]],
        ],
    ),
    Problem(
        slug="find-all-anagrams-in-a-string",
        entry="findAnagrams",
        starter="class Solution:\n    def findAnagrams(self, s: str, p: str) -> list[int]:\n        ",
        solution="""class Solution:
    def findAnagrams(self, s: str, p: str) -> list[int]:
        from collections import Counter
        if len(p) > len(s):
            return []
        need = Counter(p)
        window = Counter(s[: len(p)])
        out = [0] if window == need else []
        for i in range(len(p), len(s)):
            window[s[i]] += 1
            left = s[i - len(p)]
            window[left] -= 1
            if window[left] == 0:
                del window[left]
            if window == need:
                out.append(i - len(p) + 1)
        return out
""",
        cases=[
            ["cbaebabacd", "abc"],
            ["abab", "ab"],
            ["a", "ab"],
            ["aaaaaaaaaa", "aaaaaaaaaaaaa"],
            ["baa", "aa"],
        ],
    ),
]
