## Oracle financial services:
one coding question only
---

# Problem: **Minimum Total Weight**

You have $n$ chocolates with weights given by an array `weights[n]`, where `weights[i]` is the weight of the $i$-th chocolate. Each day, you can pick a chocolate, eat half of it (calculated as $\text{floor(weights[i] / 2)}$), and return the remaining half.

Determine the **minimum possible total weight** of the chocolates after $d$ days. Note that you may eat from the same chocolate multiple times.

---

### Function Description

Complete the function **`findMinWeight`** in the editor below.

**`findMinWeight`** has the following parameters:

- **`int weights[n]`**: an array of integers representing weights of chocolates, indexed from $0$ to $n-1$.
- **`int d`**: an integer representing the number of days.

---

### Returns

- **`int`**: the minimum total weight of chocolates after $d$ days.

---

### Constraints

1. $1 \leq n \leq 10^5$
2. $1 \leq \text{weights}[i] \leq 10^4$ (where $0 \leq i < n$)
3. $1 \leq d \leq 2 \times 10^6$

---

### Input Format For Custom Testing

- The first line contains an integer $n$, denoting the number of elements in `weights`.
- Each of the $n$ subsequent lines (where $0 \leq i < n$) contains an integer describing `weights[i]`.
- The last line contains an integer $d$, denoting the number of days.

---

## Examples

---

### **Example 1**

**Input**
```
n = 3
weights = [30, 20, 25]
d = 4
```

**Output**
```
8
```

**Explanation**

| **Day** | **Weight of Chocolate Picked** | **Weight Eaten** | **Remaining Weight** | **Result**        |
|---------|--------------------------------|------------------|-----------------------|-------------------|
| 1       | 20                             | 10               | 10                    | [30, 10, 25]      |
| 2       | 25                             | 12               | 13                    | [30, 10, 13]      |
| 3       | 30                             | 15               | 15                    | [15, 10, 13]      |
| 4       | 15                             | 7                | 8                     | [8, 10, 13]       |

The total weight of chocolates after 4 days is $8 + 10 + 13 = 31$.

---

### **Example 2**

**Input**
```
n = 5
weights = [50, 30, 20, 10, 5]
d = 10
```

**Output**
```
6
```

**Explanation**

Weights are reduced systematically as you eat the heaviest chocolate first. After $d = 10$ days, the total weight of chocolates is reduced to $6$.

---

### **Example 3**

**Input**
```
n = 4
weights = [100, 80, 60, 40]
d = 5
```

**Output**
```
143
```

**Explanation**

The chocolate weights are systematically reduced over $d = 5$ days. The remaining total weight of all chocolates is $143$.

---

These examples demonstrate how the weights are reduced dynamically by prioritizing the heaviest chocolate each day.

---

---

Problem Statement:

A power jumper has the capability to increase his strength every time he takes a jump. When he takes consecutive jumps, he has the added strength (ie. distance) of his previous two jumps. starts with a single unit distance jump and every next jump in the f forward direction

Every next jump in the backward direction has a strength (Le distance) of 1 unit

If he turns his directions, he loses all his concentration and strength. He is standing at a lane having a wall at its start and end, if at an instant, he is at the start of the lane and starts jumping consecutively how many jumps will it take for him to reach X units distance from the start?

The function calculate_steps() accepts the parameters int total length and int distance_to_reach. Complete the function by returning the number of steps taken in an integer format

Note:

He can jump only backwards and forwards.

Example 1:

Input:

total_length=4,distance_to_reach=2

Output:

2



Explanation:

He will jump from 0 to 1, then from 1 to 2. So, a total of 2 jumps.

Example 2:

Input:

total_length=9,distance_to_reach=6

Output:

5

Explanation:

He will jump from 0 to 1, then from 1 to 2, then 2 to 4, then 4 to 7, and then 7 to 6. So, a total of 5 jumps.



Answer should in this script

class Solution:

-def calculate_steps(self, total_length, distance_to_reach):

steps_taken=0

#Write your code here

#where total_length and distance_to_reach contains input

#steps_taken should contain the output of the program

return steps_taken

[14:37, 7/2/2025] 🙃🙃🙃🙃: Problem Description

You are given a list of integers called values with a length of n. The "expense" of a list is determined by the value of the first item in that list. For instance, the expense of [3, 6, 2] is 3, while the expense of [8, 9, 1] is 8.

Your task is to partition values into 3 non-overlapping contiguous segments.

Return the smallest possible total expense of these segments.

Input

Example 1:

values = [1, 2, 3, 12]

Example 2:

values = [5, 4, 3]


Output

task

3

Example 1:

6

Example 2:

12

Explanation

Example 1:

The optimal way to divide into 3 segments is: [1], [2], and [3, 12], resulting in a total expense of 1 + 2 + 3 = 6. Other possible arrangements include:

- [1], [2, 3], and [12] with a total expense of 1 + 2 + 12 = 15.

-[1,2…
[14:37, 7/2/2025] 🙃🙃🙃🙃: 2.
[14:37, 7/2/2025] 🙃🙃🙃🙃: Next question 

Problem Description

Imagine you are monitoring the temperature fluctuations in your city over a series of days. You have an integer array 'temperatures where temperatures[i] represents the temperature recorded on the ith day. Each day, you can decide whether to record a temperature change and then immediately reset the reading on the same day. However, you can only record changes between two consecutive days.

Your task is to calculate and return the maximum temperature change possible over the entire period.

Input

Example 1:

temperatures = [7, 1, 5, 3, 6, 4],

size = 6

Example 2:

temperatures = [1, 2, 3, 4, 5],

size = 5

Output

Example 1:

7

Example 2:

4

Explanation:

Example 1:

Record the change from day 2 (temperature = 1) to d…
[15:29, 7/2/2025] 🙃🙃🙃🙃: 1.
[15:29, 7/2/2025] 🙃🙃🙃🙃: Second
[15:29, 7/2/2025] 🙃🙃🙃🙃: Problem Description

In a theater, there are n pairs of friends who want to sit together in 2n sequential seats. The seating arrangement is given as an integer array seats, where seats[i] represents the ID of the person sitting-in the ith seat. Each pair of friends is identified by consecutive numbers: the first pair is (0, 1), the second pair is (2, 3), and so on until the last pair (2n-2, 2n-1).

Determine the minimum number of seat swaps needed so that each pair of friends is sitting next to each other. In each swap, you choose any two people, and they exchange their seats.

Input

Example 1:

seats [7, 1, 5, 3, 6, 4],

size = 6 Example 2:

seats = [3, 2, 0, 1), size = 4

Output

Example 1:

1

Example 2:

0

Explanation

Example 1:

A single swap between the second (seats[1]) and third (seats[2]) person is sufficient.

Example 2:

All pairs are already seated together.

---
---
