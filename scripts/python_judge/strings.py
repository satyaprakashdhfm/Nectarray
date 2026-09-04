"""String problems."""

from framework import EXACT, UNORDERED_NESTED, Problem, inplace

PROBLEMS = [
    Problem(
        slug="reverse-string",
        entry="reverseString",
        starter="class Solution:\n    def reverseString(self, s: list[str]) -> None:\n        ",
        solution="""class Solution:
    def reverseString(self, s: list[str]) -> None:
        i, j = 0, len(s) - 1
        while i < j:
            s[i], s[j] = s[j], s[i]
            i += 1
            j -= 1
""",
        compare=inplace(0),
        cases=[
            [["h", "e", "l", "l", "o"]],
            [["H", "a", "n", "n", "a", "h"]],
            [["a"]],
            [[]],
            [["a", "b"]],
        ],
    ),
    Problem(
        slug="valid-palindrome",
        entry="isPalindrome",
        starter="class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        ",
        solution="""class Solution:
    def isPalindrome(self, s: str) -> bool:
        cleaned = [c.lower() for c in s if c.isalnum()]
        return cleaned == cleaned[::-1]
""",
        cases=[
            ["A man, a plan, a canal: Panama"],
            ["race a car"],
            [" "],
            ["0P"],
            ["ab_a"],
        ],
    ),
    Problem(
        slug="valid-anagram",
        entry="isAnagram",
        starter="class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        ",
        solution="""class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        from collections import Counter
        return Counter(s) == Counter(t)
""",
        cases=[
            ["anagram", "nagaram"],
            ["rat", "car"],
            ["", ""],
            ["a", "ab"],
            ["aacc", "ccac"],
        ],
    ),
    Problem(
        slug="longest-common-prefix",
        entry="longestCommonPrefix",
        starter="class Solution:\n    def longestCommonPrefix(self, strs: list[str]) -> str:\n        ",
        solution="""class Solution:
    def longestCommonPrefix(self, strs: list[str]) -> str:
        if not strs:
            return ""
        prefix = strs[0]
        for word in strs[1:]:
            while not word.startswith(prefix):
                prefix = prefix[:-1]
                if not prefix:
                    return ""
        return prefix
""",
        cases=[
            [["flower", "flow", "flight"]],
            [["dog", "racecar", "car"]],
            [["a"]],
            [["", "b"]],
            [["abc", "abc", "abc"]],
        ],
    ),
    Problem(
        slug="find-the-index-of-the-first-occurrence-in-a-string",
        entry="strStr",
        starter="class Solution:\n    def strStr(self, haystack: str, needle: str) -> int:\n        ",
        solution="""class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        return haystack.find(needle)
""",
        cases=[
            ["sadbutsad", "sad"],
            ["leetcode", "leeto"],
            ["", ""],
            ["abc", ""],
            ["mississippi", "issip"],
        ],
    ),
    Problem(
        slug="first-unique-character-in-a-string",
        entry="firstUniqChar",
        starter="class Solution:\n    def firstUniqChar(self, s: str) -> int:\n        ",
        solution="""class Solution:
    def firstUniqChar(self, s: str) -> int:
        from collections import Counter
        counts = Counter(s)
        for i, c in enumerate(s):
            if counts[c] == 1:
                return i
        return -1
""",
        cases=[
            ["leetcode"],
            ["loveleetcode"],
            ["aabb"],
            ["z"],
            [""],
        ],
    ),
    Problem(
        slug="isomorphic-strings",
        entry="isIsomorphic",
        starter="class Solution:\n    def isIsomorphic(self, s: str, t: str) -> bool:\n        ",
        solution="""class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        forward, backward = {}, {}
        for a, b in zip(s, t):
            if forward.setdefault(a, b) != b or backward.setdefault(b, a) != a:
                return False
        return len(s) == len(t)
""",
        cases=[
            ["egg", "add"],
            ["foo", "bar"],
            ["paper", "title"],
            ["badc", "baba"],
            ["a", "a"],
        ],
    ),
    Problem(
        slug="ransom-note",
        entry="canConstruct",
        starter="class Solution:\n    def canConstruct(self, ransomNote: str, magazine: str) -> bool:\n        ",
        solution="""class Solution:
    def canConstruct(self, ransomNote: str, magazine: str) -> bool:
        from collections import Counter
        return not (Counter(ransomNote) - Counter(magazine))
""",
        cases=[
            ["a", "b"],
            ["aa", "ab"],
            ["aa", "aab"],
            ["", "abc"],
            ["abc", ""],
        ],
    ),
    Problem(
        slug="longest-substring-without-repeating-characters",
        entry="lengthOfLongestSubstring",
        starter="class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        ",
        solution="""class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last = {}
        best = start = 0
        for i, c in enumerate(s):
            if c in last and last[c] >= start:
                start = last[c] + 1
            last[c] = i
            best = max(best, i - start + 1)
        return best
""",
        cases=[
            ["abcabcbb"],
            ["bbbbb"],
            ["pwwkew"],
            [""],
            ["dvdf"],
        ],
        note="'dvdf' is the case a naive sliding window gets wrong.",
    ),
    Problem(
        slug="longest-palindromic-substring",
        entry="longestPalindrome",
        starter="class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        ",
        solution="""class Solution:
    def longestPalindrome(self, s: str) -> str:
        best = ""
        for i in range(len(s)):
            for lo, hi in ((i, i), (i, i + 1)):
                while lo >= 0 and hi < len(s) and s[lo] == s[hi]:
                    lo -= 1
                    hi += 1
                if hi - lo - 1 > len(best):
                    best = s[lo + 1 : hi]
        return best
""",
        cases=[
            ["babad"],
            ["cbbd"],
            ["a"],
            ["forgeeksskeegfor"],
            ["abacdfgdcaba"],
        ],
        note="Cases are chosen so the longest palindrome is unique.",
    ),
    Problem(
        slug="group-anagrams",
        entry="groupAnagrams",
        starter="class Solution:\n    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:\n        ",
        solution="""class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        from collections import defaultdict
        groups = defaultdict(list)
        for word in strs:
            groups["".join(sorted(word))].append(word)
        return list(groups.values())
""",
        compare=UNORDERED_NESTED,
        cases=[
            [["eat", "tea", "tan", "ate", "nat", "bat"]],
            [[""]],
            [["a"]],
            [["abc", "bca", "cab", "xyz"]],
            [["listen", "silent", "enlist", "google"]],
        ],
    ),
    Problem(
        slug="string-to-integer-atoi",
        entry="myAtoi",
        starter="class Solution:\n    def myAtoi(self, s: str) -> int:\n        ",
        solution="""class Solution:
    def myAtoi(self, s: str) -> int:
        i, n = 0, len(s)
        while i < n and s[i] == " ":
            i += 1
        sign = 1
        if i < n and s[i] in "+-":
            sign = -1 if s[i] == "-" else 1
            i += 1
        digits = 0
        while i < n and s[i].isdigit():
            digits = digits * 10 + int(s[i])
            i += 1
        value = sign * digits
        return max(-2**31, min(2**31 - 1, value))
""",
        cases=[
            ["42"],
            ["   -042"],
            ["1337c0d3"],
            ["0-1"],
            ["words and 987"],
            ["-91283472332"],
        ],
    ),
    Problem(
        slug="longest-repeating-character-replacement",
        entry="characterReplacement",
        starter="class Solution:\n    def characterReplacement(self, s: str, k: int) -> int:\n        ",
        solution="""class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        from collections import Counter
        counts = Counter()
        start = best = most = 0
        for i, c in enumerate(s):
            counts[c] += 1
            most = max(most, counts[c])
            while i - start + 1 - most > k:
                counts[s[start]] -= 1
                start += 1
            best = max(best, i - start + 1)
        return best
""",
        cases=[
            ["ABAB", 2],
            ["AABABBA", 1],
            ["A", 0],
            ["AAAA", 2],
            ["ABCDE", 1],
        ],
    ),
    Problem(
        slug="sort-characters-by-frequency",
        entry="frequencySort",
        starter="class Solution:\n    def frequencySort(self, s: str) -> str:\n        ",
        solution="""class Solution:
    def frequencySort(self, s: str) -> str:
        from collections import Counter
        return "".join(c * n for c, n in Counter(s).most_common())
""",
        cases=[
            ["tree"],
            ["cccaaa"],
            ["Aabb"],
            ["aaabbc"],
            ["xxxxyyyzzw"],
        ],
        note="Every case has distinct frequencies, so the ordering is unique.",
    ),
    Problem(
        slug="minimum-window-substring",
        entry="minWindow",
        starter="class Solution:\n    def minWindow(self, s: str, t: str) -> str:\n        ",
        solution="""class Solution:
    def minWindow(self, s: str, t: str) -> str:
        from collections import Counter
        if not t or not s:
            return ""
        need = Counter(t)
        missing = len(t)
        best = ""
        start = 0
        for i, c in enumerate(s):
            if need[c] > 0:
                missing -= 1
            need[c] -= 1
            while missing == 0:
                if not best or i - start + 1 < len(best):
                    best = s[start : i + 1]
                need[s[start]] += 1
                if need[s[start]] > 0:
                    missing += 1
                start += 1
        return best
""",
        cases=[
            ["ADOBECODEBANC", "ABC"],
            ["a", "a"],
            ["a", "aa"],
            ["", "a"],
            ["cabwefgewcwaefgcf", "cae"],
        ],
    ),
]
