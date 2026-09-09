"""Array problems, in the order the sheet teaches them."""

from framework import EXACT, SORTED, UNORDERED_NESTED, Problem, inplace, k_prefix

PROBLEMS = [
    Problem(
        slug="two-sum",
        entry="twoSum",
        starter="class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        ",
        solution="""class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, n in enumerate(nums):
            if target - n in seen:
                return [seen[target - n], i]
            seen[n] = i
        return []
""",
        compare=SORTED,  # either order of the two indices is correct
        cases=[
            [[2, 7, 11, 15], 9],
            [[3, 2, 4], 6],
            [[3, 3], 6],
            [[-1, -2, -3, -4, -5], -8],
            [[0, 4, 3, 0], 0],
            [list(range(1, 501)), 999],
        ],
    ),
    Problem(
        slug="remove-duplicates-from-sorted-array",
        entry="removeDuplicates",
        starter="class Solution:\n    def removeDuplicates(self, nums: list[int]) -> int:\n        ",
        solution="""class Solution:
    def removeDuplicates(self, nums: list[int]) -> int:
        k = 0
        for n in nums:
            if k == 0 or nums[k - 1] != n:
                nums[k] = n
                k += 1
        return k
""",
        compare=k_prefix(0),
        cases=[
            [[1, 1, 2]],
            [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]],
            [[1]],
            [[1, 1, 1, 1]],
            [[-3, -1, 0, 0, 2]],
        ],
    ),
    Problem(
        slug="best-time-to-buy-and-sell-stock",
        entry="maxProfit",
        starter="class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        ",
        solution="""class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        best, low = 0, float("inf")
        for p in prices:
            low = min(low, p)
            best = max(best, p - low)
        return best
""",
        cases=[
            [[7, 1, 5, 3, 6, 4]],
            [[7, 6, 4, 3, 1]],
            [[1]],
            [[2, 4, 1]],
            [[3, 3, 3, 3]],
            [[1, 2, 3, 4, 5, 6, 7, 8, 9]],
        ],
    ),
    Problem(
        slug="majority-element",
        entry="majorityElement",
        starter="class Solution:\n    def majorityElement(self, nums: list[int]) -> int:\n        ",
        solution="""class Solution:
    def majorityElement(self, nums: list[int]) -> int:
        count, candidate = 0, None
        for n in nums:
            if count == 0:
                candidate = n
            count += 1 if n == candidate else -1
        return candidate
""",
        cases=[
            [[3, 2, 3]],
            [[2, 2, 1, 1, 1, 2, 2]],
            [[1]],
            [[-1, -1, -1, 2, 3]],
            [[6] * 51 + list(range(50))],
        ],
    ),
    Problem(
        slug="move-zeroes",
        entry="moveZeroes",
        starter="class Solution:\n    def moveZeroes(self, nums: list[int]) -> None:\n        ",
        solution="""class Solution:
    def moveZeroes(self, nums: list[int]) -> None:
        k = 0
        for i, n in enumerate(nums):
            if n != 0:
                nums[k], nums[i] = nums[i], nums[k]
                k += 1
""",
        compare=inplace(0),
        cases=[
            [[0, 1, 0, 3, 12]],
            [[0]],
            [[1, 2, 3]],
            [[0, 0, 0, 1]],
            [[4, 0, 0, 5, 0, 6]],
        ],
    ),
    Problem(
        slug="contains-duplicate",
        entry="containsDuplicate",
        starter="class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        ",
        solution="""class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        return len(set(nums)) < len(nums)
""",
        cases=[
            [[1, 2, 3, 1]],
            [[1, 2, 3, 4]],
            [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]],
            [[-1, -2, -3, -4, -5, -6, -7, -8, -9, -10]],
            [[0]],
        ],
        note="The all-negatives case is the one a set-length shortcut gets wrong.",
    ),
    Problem(
        slug="missing-number",
        entry="missingNumber",
        starter="class Solution:\n    def missingNumber(self, nums: list[int]) -> int:\n        ",
        solution="""class Solution:
    def missingNumber(self, nums: list[int]) -> int:
        n = len(nums)
        return n * (n + 1) // 2 - sum(nums)
""",
        cases=[
            [[3, 0, 1]],
            [[0, 1]],
            [[9, 6, 4, 2, 3, 5, 7, 0, 1]],
            [[0]],
            [[1]],
            [list(range(1, 201))],
        ],
    ),
    Problem(
        slug="plus-one",
        entry="plusOne",
        starter="class Solution:\n    def plusOne(self, digits: list[int]) -> list[int]:\n        ",
        solution="""class Solution:
    def plusOne(self, digits: list[int]) -> list[int]:
        out = digits[:]
        for i in range(len(out) - 1, -1, -1):
            if out[i] < 9:
                out[i] += 1
                return out
            out[i] = 0
        return [1] + out
""",
        cases=[
            [[1, 2, 3]],
            [[4, 3, 2, 1]],
            [[9]],
            [[9, 9, 9]],
            [[0]],
            [[1, 9, 9]],
        ],
    ),
    Problem(
        slug="merge-sorted-array",
        entry="merge",
        starter="class Solution:\n    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:\n        ",
        solution="""class Solution:
    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:
        i, j, k = m - 1, n - 1, m + n - 1
        while j >= 0:
            if i >= 0 and nums1[i] > nums2[j]:
                nums1[k] = nums1[i]
                i -= 1
            else:
                nums1[k] = nums2[j]
                j -= 1
            k -= 1
""",
        compare=inplace(0),
        cases=[
            [[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3],
            [[1], 1, [], 0],
            [[0], 0, [1], 1],
            [[4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3],
            [[2, 0], 1, [1], 1],
        ],
    ),
    Problem(
        slug="squares-of-a-sorted-array",
        entry="sortedSquares",
        starter="class Solution:\n    def sortedSquares(self, nums: list[int]) -> list[int]:\n        ",
        solution="""class Solution:
    def sortedSquares(self, nums: list[int]) -> list[int]:
        out = [0] * len(nums)
        i, j = 0, len(nums) - 1
        for k in range(len(nums) - 1, -1, -1):
            if abs(nums[i]) > abs(nums[j]):
                out[k] = nums[i] ** 2
                i += 1
            else:
                out[k] = nums[j] ** 2
                j -= 1
        return out
""",
        cases=[
            [[-4, -1, 0, 3, 10]],
            [[-7, -3, 2, 3, 11]],
            [[0]],
            [[-5, -4, -3]],
            [[1, 2, 3]],
        ],
    ),
    Problem(
        slug="rotate-array",
        entry="rotate",
        starter="class Solution:\n    def rotate(self, nums: list[int], k: int) -> None:\n        ",
        solution="""class Solution:
    def rotate(self, nums: list[int], k: int) -> None:
        n = len(nums)
        k %= n
        nums[:] = nums[-k:] + nums[:-k] if k else nums[:]
""",
        compare=inplace(0),
        cases=[
            [[1, 2, 3, 4, 5, 6, 7], 3],
            [[-1, -100, 3, 99], 2],
            [[1], 0],
            [[1, 2], 3],
            [[1, 2, 3], 3],
        ],
    ),
    Problem(
        slug="product-of-array-except-self",
        entry="productExceptSelf",
        starter="class Solution:\n    def productExceptSelf(self, nums: list[int]) -> list[int]:\n        ",
        solution="""class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        n = len(nums)
        out = [1] * n
        left = 1
        for i in range(n):
            out[i] = left
            left *= nums[i]
        right = 1
        for i in range(n - 1, -1, -1):
            out[i] *= right
            right *= nums[i]
        return out
""",
        cases=[
            [[1, 2, 3, 4]],
            [[-1, 1, 0, -3, 3]],
            [[0, 0]],
            [[2, 3]],
            [[5, 1, 1, 1]],
        ],
    ),
    Problem(
        slug="maximum-subarray",
        entry="maxSubArray",
        starter="class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        ",
        solution="""class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        best = run = nums[0]
        for n in nums[1:]:
            run = max(n, run + n)
            best = max(best, run)
        return best
""",
        cases=[
            [[-2, 1, -3, 4, -1, 2, 1, -5, 4]],
            [[1]],
            [[5, 4, -1, 7, 8]],
            [[-1]],
            [[-2, -1, -3]],
        ],
        note="All-negative input is where a `best = 0` start goes wrong.",
    ),
    Problem(
        slug="sort-colors",
        entry="sortColors",
        starter="class Solution:\n    def sortColors(self, nums: list[int]) -> None:\n        ",
        solution="""class Solution:
    def sortColors(self, nums: list[int]) -> None:
        low, i, high = 0, 0, len(nums) - 1
        while i <= high:
            if nums[i] == 0:
                nums[low], nums[i] = nums[i], nums[low]
                low += 1
                i += 1
            elif nums[i] == 2:
                nums[high], nums[i] = nums[i], nums[high]
                high -= 1
            else:
                i += 1
""",
        compare=inplace(0),
        cases=[
            [[2, 0, 2, 1, 1, 0]],
            [[2, 0, 1]],
            [[0]],
            [[2, 2, 2, 0, 0, 1]],
            [[1, 1, 1]],
        ],
    ),
    Problem(
        slug="subarray-sum-equals-k",
        entry="subarraySum",
        starter="class Solution:\n    def subarraySum(self, nums: list[int], k: int) -> int:\n        ",
        solution="""class Solution:
    def subarraySum(self, nums: list[int], k: int) -> int:
        from collections import defaultdict
        seen = defaultdict(int)
        seen[0] = 1
        total = count = 0
        for n in nums:
            total += n
            count += seen[total - k]
            seen[total] += 1
        return count
""",
        cases=[
            [[1, 1, 1], 2],
            [[1, 2, 3], 3],
            [[1], 0],
            [[-1, -1, 1], 0],
            [[3, 4, 7, 2, -3, 1, 4, 2], 7],
        ],
    ),
    Problem(
        slug="find-the-duplicate-number",
        entry="findDuplicate",
        starter="class Solution:\n    def findDuplicate(self, nums: list[int]) -> int:\n        ",
        solution="""class Solution:
    def findDuplicate(self, nums: list[int]) -> int:
        slow = fast = nums[0]
        while True:
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break
        slow = nums[0]
        while slow != fast:
            slow = nums[slow]
            fast = nums[fast]
        return slow
""",
        cases=[
            [[1, 3, 4, 2, 2]],
            [[3, 1, 3, 4, 2]],
            [[1, 1]],
            [[2, 2, 2, 2, 2]],
            [[1, 4, 6, 6, 6, 2, 3]],
        ],
    ),
    Problem(
        slug="3sum",
        entry="threeSum",
        starter="class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        ",
        solution="""class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums = sorted(nums)
        out = []
        for i in range(len(nums) - 2):
            if i and nums[i] == nums[i - 1]:
                continue
            lo, hi = i + 1, len(nums) - 1
            while lo < hi:
                total = nums[i] + nums[lo] + nums[hi]
                if total < 0:
                    lo += 1
                elif total > 0:
                    hi -= 1
                else:
                    out.append([nums[i], nums[lo], nums[hi]])
                    lo += 1
                    while lo < hi and nums[lo] == nums[lo - 1]:
                        lo += 1
        return out
""",
        compare=UNORDERED_NESTED,
        cases=[
            [[-1, 0, 1, 2, -1, -4]],
            [[0, 1, 1]],
            [[0, 0, 0]],
            [[-2, 0, 1, 1, 2]],
            [[3, 0, -2, -1, 1, 2]],
        ],
    ),
    Problem(
        slug="container-with-most-water",
        entry="maxArea",
        starter="class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        ",
        solution="""class Solution:
    def maxArea(self, height: list[int]) -> int:
        lo, hi, best = 0, len(height) - 1, 0
        while lo < hi:
            best = max(best, (hi - lo) * min(height[lo], height[hi]))
            if height[lo] < height[hi]:
                lo += 1
            else:
                hi -= 1
        return best
""",
        cases=[
            [[1, 8, 6, 2, 5, 4, 8, 3, 7]],
            [[1, 1]],
            [[4, 3, 2, 1, 4]],
            [[1, 2, 1]],
            [[2, 3, 10, 5, 7, 8, 9]],
        ],
    ),
    Problem(
        slug="merge-intervals",
        entry="merge",
        starter="class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        ",
        solution="""class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        out = []
        for start, end in sorted(intervals):
            if out and start <= out[-1][1]:
                out[-1][1] = max(out[-1][1], end)
            else:
                out.append([start, end])
        return out
""",
        cases=[
            [[[1, 3], [2, 6], [8, 10], [15, 18]]],
            [[[1, 4], [4, 5]]],
            [[[1, 4], [0, 4]]],
            [[[1, 4], [2, 3]]],
            [[[5, 6]]],
        ],
    ),
Problem(
        slug="intersection-of-two-arrays-ii",
        entry="intersect",
        starter="class Solution:\n    def intersect(self, nums1: list[int], nums2: list[int]) -> list[int]:\n        ",
        solution="""class Solution:
    def intersect(self, nums1: list[int], nums2: list[int]) -> list[int]:
        from collections import Counter
        counts = Counter(nums1)
        out = []
        for n in nums2:
            if counts[n] > 0:
                out.append(n)
                counts[n] -= 1
        return out
""",
        compare=SORTED,
        cases=[
            [[1, 2, 2, 1], [2, 2]],
            [[4, 9, 5], [9, 4, 9, 8, 4]],
            [[1], [2]],
            [[1, 1, 1], [1, 1]],
            [[], [1, 2]],
        ],
    ),
    Problem(
        slug="set-matrix-zeroes",
        entry="setZeroes",
        starter="class Solution:\n    def setZeroes(self, matrix: list[list[int]]) -> None:\n        ",
        solution="""class Solution:
    def setZeroes(self, matrix: list[list[int]]) -> None:
        rows = {i for i, row in enumerate(matrix) for v in row if v == 0}
        cols = {j for row in matrix for j, v in enumerate(row) if v == 0}
        for i, row in enumerate(matrix):
            for j in range(len(row)):
                if i in rows or j in cols:
                    row[j] = 0
""",
        compare=inplace(0),
        cases=[
            [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]],
            [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]],
            [[[1]]],
            [[[0]]],
            [[[1, 2], [3, 4]]],
        ],
    ),
    Problem(
        slug="spiral-matrix",
        entry="spiralOrder",
        starter="class Solution:\n    def spiralOrder(self, matrix: list[list[int]]) -> list[int]:\n        ",
        solution="""class Solution:
    def spiralOrder(self, matrix: list[list[int]]) -> list[int]:
        out = []
        top, bottom = 0, len(matrix) - 1
        left, right = 0, len(matrix[0]) - 1
        while top <= bottom and left <= right:
            for j in range(left, right + 1):
                out.append(matrix[top][j])
            top += 1
            for i in range(top, bottom + 1):
                out.append(matrix[i][right])
            right -= 1
            if top <= bottom:
                for j in range(right, left - 1, -1):
                    out.append(matrix[bottom][j])
                bottom -= 1
            if left <= right:
                for i in range(bottom, top - 1, -1):
                    out.append(matrix[i][left])
                left += 1
        return out
""",
        cases=[
            [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
            [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]],
            [[[1]]],
            [[[1], [2], [3]]],
            [[[1, 2], [3, 4]]],
        ],
    ),
    Problem(
        slug="next-permutation",
        entry="nextPermutation",
        starter="class Solution:\n    def nextPermutation(self, nums: list[int]) -> None:\n        ",
        solution="""class Solution:
    def nextPermutation(self, nums: list[int]) -> None:
        i = len(nums) - 2
        while i >= 0 and nums[i] >= nums[i + 1]:
            i -= 1
        if i >= 0:
            j = len(nums) - 1
            while nums[j] <= nums[i]:
                j -= 1
            nums[i], nums[j] = nums[j], nums[i]
        nums[i + 1 :] = reversed(nums[i + 1 :])
""",
        compare=inplace(0),
        cases=[
            [[1, 2, 3]],
            [[3, 2, 1]],
            [[1, 1, 5]],
            [[1]],
            [[2, 3, 1]],
        ],
    ),
    Problem(
        slug="first-missing-positive",
        entry="firstMissingPositive",
        starter="class Solution:\n    def firstMissingPositive(self, nums: list[int]) -> int:\n        ",
        solution="""class Solution:
    def firstMissingPositive(self, nums: list[int]) -> int:
        seen = set(nums)
        i = 1
        while i in seen:
            i += 1
        return i
""",
        cases=[
            [[1, 2, 0]],
            [[3, 4, -1, 1]],
            [[7, 8, 9, 11, 12]],
            [[1]],
            [[-5]],
        ],
    ),
    Problem(
        slug="median-of-two-sorted-arrays",
        entry="findMedianSortedArrays",
        starter="class Solution:\n    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:\n        ",
        solution="""class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        merged = sorted(nums1 + nums2)
        n = len(merged)
        mid = n // 2
        if n % 2:
            return float(merged[mid])
        return (merged[mid - 1] + merged[mid]) / 2
""",
        cases=[
            [[1, 3], [2]],
            [[1, 2], [3, 4]],
            [[], [1]],
            [[0, 0], [0, 0]],
            [[1, 5, 9], [2, 3]],
        ],
    ),
    Problem(
        slug="4sum",
        entry="fourSum",
        starter="class Solution:\n    def fourSum(self, nums: list[int], target: int) -> list[list[int]]:\n        ",
        solution="""class Solution:
    def fourSum(self, nums: list[int], target: int) -> list[list[int]]:
        nums.sort()
        n = len(nums)
        out = []
        for i in range(n - 3):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            for j in range(i + 1, n - 2):
                if j > i + 1 and nums[j] == nums[j - 1]:
                    continue
                lo, hi = j + 1, n - 1
                while lo < hi:
                    total = nums[i] + nums[j] + nums[lo] + nums[hi]
                    if total < target:
                        lo += 1
                    elif total > target:
                        hi -= 1
                    else:
                        out.append([nums[i], nums[j], nums[lo], nums[hi]])
                        lo += 1
                        hi -= 1
                        while lo < hi and nums[lo] == nums[lo - 1]:
                            lo += 1
                        while lo < hi and nums[hi] == nums[hi + 1]:
                            hi -= 1
        return out
""",
        compare=UNORDERED_NESTED,  # the quadruplets are a set, in any order
        cases=[
            [[1, 0, -1, 0, -2, 2], 0],
            [[2, 2, 2, 2, 2], 8],
            [[], 0],
            [[0, 0, 0, 0], 0],
            [[-3, -1, 0, 2, 4, 5], 2],
            [[1000000000, 1000000000, 1000000000, 1000000000], -294967296],
            [[-5, -4, -3, -2, 1, 2, 3, 4, 5, 6], 0],
        ],
    ),
    Problem(
        slug="count-subarrays-with-xor-k",
        entry="subarraysWithXorK",
        starter="class Solution:\n    def subarraysWithXorK(self, nums: list[int], k: int) -> int:\n        ",
        solution="""class Solution:
    def subarraysWithXorK(self, nums: list[int], k: int) -> int:
        seen = {0: 1}
        run = 0
        total = 0
        for n in nums:
            run ^= n
            total += seen.get(run ^ k, 0)
            seen[run] = seen.get(run, 0) + 1
        return total
""",
        cases=[
            [[4, 2, 2, 6, 4], 6],
            [[5, 6, 7, 8, 9], 5],
            [[1, 1, 1, 1], 0],
            [[0, 0, 0], 0],
            [[3], 3],
            [[3], 4],
            [[], 0],
            [[1, 2, 3, 4, 5, 6, 7, 8], 7],
        ],
    ),
    Problem(
        slug="find-the-repeating-and-missing-number",
        entry="findMissingRepeatingNumbers",
        starter="class Solution:\n    def findMissingRepeatingNumbers(self, nums: list[int]) -> list[int]:\n        ",
        solution="""class Solution:
    def findMissingRepeatingNumbers(self, nums: list[int]) -> list[int]:
        n = len(nums)
        xor = 0
        for i, value in enumerate(nums, start=1):
            xor ^= value ^ i

        bit = xor & -xor
        zeros = ones = 0
        for i in range(1, n + 1):
            if i & bit:
                ones ^= i
            else:
                zeros ^= i
        for value in nums:
            if value & bit:
                ones ^= value
            else:
                zeros ^= value

        return [ones, zeros] if nums.count(ones) == 2 else [zeros, ones]
""",
        cases=[
            [[3, 1, 2, 5, 3]],
            [[1, 2, 2, 4]],
            [[2, 2]],
            [[1, 1]],
            [[4, 3, 6, 2, 1, 1]],
            [[1, 3, 3]],
            [list(range(1, 200)) + [199]],
        ],
    ),
    Problem(
        slug="count-inversions",
        entry="countInversions",
        starter="class Solution:\n    def countInversions(self, nums: list[int]) -> int:\n        ",
        solution="""class Solution:
    def countInversions(self, nums: list[int]) -> int:
        def sort(values: list[int]) -> tuple[list[int], int]:
            if len(values) < 2:
                return values, 0
            mid = len(values) // 2
            left, a = sort(values[:mid])
            right, b = sort(values[mid:])

            merged = []
            count = a + b
            i = j = 0
            while i < len(left) and j < len(right):
                if left[i] <= right[j]:
                    merged.append(left[i])
                    i += 1
                else:
                    merged.append(right[j])
                    j += 1
                    count += len(left) - i
            merged.extend(left[i:])
            merged.extend(right[j:])
            return merged, count

        return sort(nums)[1]
""",
        cases=[
            [[2, 3, 7, 1, 3, 5]],
            [[5, 4, 3, 2, 1]],
            [[1, 2, 3, 4, 5]],
            [[]],
            [[1]],
            [[2, 2, 2, 2]],
            [[-1, -5, 3, 0, 3, -2]],
            [list(range(120, 0, -1))],
        ],
    ),
]
