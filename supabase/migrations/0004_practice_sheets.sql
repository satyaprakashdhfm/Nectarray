-- =============================================================================
--  Practice sheets — Python problems and SQL questions
--
--  Two tracks, both ordered easy → hard inside a topic, both marked done by
--  the student rather than auto-graded. The Python side points at LeetCode
--  because that is where the judge already is; rebuilding one would be worse
--  and would not match what an interviewer asks you to open.
--
--  Deliberately not a full DSA sheet: arrays, strings and dictionaries only,
--  which is what actually comes up in screens for data and AI roles.
-- =============================================================================

-- `topic` groups the rows into the collapsible sections on the page.
alter table public.practice_questions
  add column if not exists topic text not null default 'General';

create index if not exists practice_questions_track_idx
  on public.practice_questions (track, position);

-- Re-runnable: clear the seeded rows before inserting, but leave anything an
-- admin added by hand (those carry a topic of 'General').
delete from public.practice_questions where topic <> 'General';

insert into public.practice_questions
  (track, topic, difficulty, position, title, prompt_md, leetcode_url) values
  ('python', 'Arrays', 'easy', 1, 'Two Sum', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/two-sum/'),
  ('python', 'Arrays', 'easy', 2, 'Remove Duplicates from Sorted Array', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/'),
  ('python', 'Arrays', 'easy', 3, 'Best Time to Buy and Sell Stock', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'),
  ('python', 'Arrays', 'easy', 4, 'Majority Element', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/majority-element/'),
  ('python', 'Arrays', 'easy', 5, 'Move Zeroes', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/move-zeroes/'),
  ('python', 'Arrays', 'easy', 6, 'Contains Duplicate', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/contains-duplicate/'),
  ('python', 'Arrays', 'easy', 7, 'Missing Number', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/missing-number/'),
  ('python', 'Arrays', 'easy', 8, 'Single Number', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/single-number/'),
  ('python', 'Arrays', 'easy', 9, 'Plus One', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/plus-one/'),
  ('python', 'Arrays', 'easy', 10, 'Merge Sorted Array', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/merge-sorted-array/'),
  ('python', 'Arrays', 'easy', 11, 'Squares of a Sorted Array', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/squares-of-a-sorted-array/'),
  ('python', 'Arrays', 'easy', 12, 'Intersection of Two Arrays II', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/intersection-of-two-arrays-ii/'),
  ('python', 'Arrays', 'medium', 13, 'Rotate Array', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/rotate-array/'),
  ('python', 'Arrays', 'medium', 14, 'Product of Array Except Self', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/product-of-array-except-self/'),
  ('python', 'Arrays', 'medium', 15, 'Maximum Subarray', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/maximum-subarray/'),
  ('python', 'Arrays', 'medium', 16, 'Sort Colors', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/sort-colors/'),
  ('python', 'Arrays', 'medium', 17, 'Subarray Sum Equals K', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/subarray-sum-equals-k/'),
  ('python', 'Arrays', 'medium', 18, 'Find the Duplicate Number', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/find-the-duplicate-number/'),
  ('python', 'Arrays', 'medium', 19, '3Sum', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/3sum/'),
  ('python', 'Arrays', 'medium', 20, 'Container With Most Water', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/container-with-most-water/'),
  ('python', 'Arrays', 'medium', 21, 'Merge Intervals', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/merge-intervals/'),
  ('python', 'Arrays', 'medium', 22, 'Set Matrix Zeroes', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/set-matrix-zeroes/'),
  ('python', 'Arrays', 'medium', 23, 'Spiral Matrix', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/spiral-matrix/'),
  ('python', 'Arrays', 'medium', 24, 'Next Permutation', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/next-permutation/'),
  ('python', 'Arrays', 'hard', 25, 'Trapping Rain Water', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/trapping-rain-water/'),
  ('python', 'Arrays', 'hard', 26, 'First Missing Positive', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/first-missing-positive/'),
  ('python', 'Arrays', 'hard', 27, 'Median of Two Sorted Arrays', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/median-of-two-sorted-arrays/'),
  ('python', 'Arrays', 'hard', 28, 'Largest Rectangle in Histogram', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/largest-rectangle-in-histogram/'),
  ('python', 'Strings', 'easy', 29, 'Reverse String', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/reverse-string/'),
  ('python', 'Strings', 'easy', 30, 'Valid Palindrome', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/valid-palindrome/'),
  ('python', 'Strings', 'easy', 31, 'Valid Anagram', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/valid-anagram/'),
  ('python', 'Strings', 'easy', 32, 'Longest Common Prefix', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/longest-common-prefix/'),
  ('python', 'Strings', 'easy', 33, 'Find the Index of the First Occurrence in a String', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/'),
  ('python', 'Strings', 'easy', 34, 'First Unique Character in a String', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/first-unique-character-in-a-string/'),
  ('python', 'Strings', 'easy', 35, 'Isomorphic Strings', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/isomorphic-strings/'),
  ('python', 'Strings', 'easy', 36, 'Ransom Note', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/ransom-note/'),
  ('python', 'Strings', 'medium', 37, 'Longest Substring Without Repeating Characters', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'),
  ('python', 'Strings', 'medium', 38, 'Longest Palindromic Substring', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/longest-palindromic-substring/'),
  ('python', 'Strings', 'medium', 39, 'Group Anagrams', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/group-anagrams/'),
  ('python', 'Strings', 'medium', 40, 'String to Integer (atoi)', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/string-to-integer-atoi/'),
  ('python', 'Strings', 'medium', 41, 'Longest Repeating Character Replacement', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/longest-repeating-character-replacement/'),
  ('python', 'Strings', 'medium', 42, 'Sort Characters By Frequency', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/sort-characters-by-frequency/'),
  ('python', 'Strings', 'hard', 43, 'Minimum Window Substring', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/minimum-window-substring/'),
  ('python', 'Dictionaries & Hashing', 'easy', 44, 'Contains Duplicate II', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/contains-duplicate-ii/'),
  ('python', 'Dictionaries & Hashing', 'easy', 45, 'Word Pattern', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/word-pattern/'),
  ('python', 'Dictionaries & Hashing', 'easy', 46, 'Intersection of Two Arrays', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/intersection-of-two-arrays/'),
  ('python', 'Dictionaries & Hashing', 'easy', 47, 'Find Common Characters', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/find-common-characters/'),
  ('python', 'Dictionaries & Hashing', 'easy', 48, 'Unique Number of Occurrences', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/unique-number-of-occurrences/'),
  ('python', 'Dictionaries & Hashing', 'medium', 49, 'Top K Frequent Elements', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/top-k-frequent-elements/'),
  ('python', 'Dictionaries & Hashing', 'medium', 50, 'Longest Consecutive Sequence', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/longest-consecutive-sequence/'),
  ('python', 'Dictionaries & Hashing', 'medium', 51, '4Sum II', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/4sum-ii/'),
  ('python', 'Dictionaries & Hashing', 'medium', 52, 'Insert Delete GetRandom O(1)', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/insert-delete-getrandom-o1/'),
  ('python', 'Dictionaries & Hashing', 'medium', 53, 'LRU Cache', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/lru-cache/'),
  ('python', 'Dictionaries & Hashing', 'medium', 54, 'Find All Anagrams in a String', 'Solve it on LeetCode, then mark it done here.', 'https://leetcode.com/problems/find-all-anagrams-in-a-string/')
on conflict do nothing;

insert into public.practice_questions
  (track, topic, difficulty, position, title, prompt_md, hint_md, solution_sql) values
  ('sql', 'SELECT & filtering', 'easy', 1, 'Show every column for all students',
   'Return the whole `students` table.', '`SELECT *` with no WHERE.', 'select * from students;'),
  ('sql', 'SELECT & filtering', 'easy', 2, 'List student names and their city',
   'Only the `name` and `city` columns.', 'Name the two columns instead of using `*`.', 'select name, city from students;'),
  ('sql', 'SELECT & filtering', 'easy', 3, 'Find students from Bengaluru',
   'All columns, only students whose city is Bengaluru.', '`WHERE city = ''Bengaluru''` — string literals go in single quotes.', 'select * from students where city = ''Bengaluru'';'),
  ('sql', 'SELECT & filtering', 'easy', 4, 'List every distinct city',
   'Each city once, no repeats.', '`SELECT DISTINCT`.', 'select distinct city from students;'),
  ('sql', 'SELECT & filtering', 'easy', 5, 'Students who scored above 75',
   'Name and marks, for marks greater than 75.', 'Comparison operators work on numbers directly.', 'select name, marks from students where marks > 75;'),
  ('sql', 'SELECT & filtering', 'easy', 6, 'The five most recent joiners',
   'Name and joined_on, newest first, five rows.', '`ORDER BY joined_on DESC` then `LIMIT 5`.', 'select name, joined_on from students order by joined_on desc limit 5;'),
  ('sql', 'SELECT & filtering', 'easy', 7, 'Students with no marks recorded',
   'Rows where marks is missing.', 'Missing is not the same as zero — use `IS NULL`, never `= NULL`.', 'select * from students where marks is null;'),
  ('sql', 'SELECT & filtering', 'easy', 8, 'Rename marks to score in the output',
   'Show name and marks, with marks labelled `score`.', 'Column alias with `AS`.', 'select name, marks as score from students;'),
  ('sql', 'Operators & clauses', 'easy', 9, 'Students aged between 20 and 22',
   'Inclusive of both ends.', '`BETWEEN` includes both bounds.', 'select * from students where age between 20 and 22;'),
  ('sql', 'Operators & clauses', 'easy', 10, 'Students from Bengaluru, Chennai or Pune',
   'One condition, three cities.', '`IN` beats three ORs.', 'select * from students where city in (''Bengaluru'',''Chennai'',''Pune'');'),
  ('sql', 'Operators & clauses', 'easy', 11, 'Students whose name starts with A',
   'Any name beginning with the letter A.', '`LIKE ''A%''` — % matches any run of characters.', 'select * from students where name like ''A%'';'),
  ('sql', 'Operators & clauses', 'easy', 12, 'Students whose name contains ''ee''',
   'Anywhere in the name.', 'Wildcards go on both sides: `LIKE ''%ee%''`.', 'select * from students where name like ''%ee%'';'),
  ('sql', 'Operators & clauses', 'easy', 13, 'High scorers not from Chennai',
   'Marks above 70, city is not Chennai.', 'Combine with `AND` and `<>` (or `NOT`).', 'select * from students where marks > 70 and city <> ''Chennai'';'),
  ('sql', 'Operators & clauses', 'easy', 14, 'Courses that cost 15000 or more, cheapest first',
   'Course name and fee.', '`WHERE` then `ORDER BY fee`.', 'select course_name, fee from courses where fee >= 15000 order by fee;'),
  ('sql', 'Functions', 'medium', 15, 'Show every student name in capitals',
   'Uppercase the name column.', '`UPPER()`.', 'select upper(name) as name from students;'),
  ('sql', 'Functions', 'medium', 16, 'Show the length of each student name',
   'Name and its character count.', '`LENGTH()` (or `CHAR_LENGTH()` in MySQL).', 'select name, length(name) as name_length from students;'),
  ('sql', 'Functions', 'medium', 17, 'Show the year each student joined',
   'Name and the year part of joined_on.', '`YEAR()` in MySQL, `EXTRACT(YEAR FROM ...)` elsewhere.', 'select name, year(joined_on) as joined_year from students;'),
  ('sql', 'Functions', 'medium', 18, 'Label students pass or fail at 40 marks',
   'Name, marks, and a `result` column reading ''Pass'' or ''Fail''.', '`CASE WHEN ... THEN ... ELSE ... END`.', 'select name, marks,
       case when marks >= 40 then ''Pass'' else ''Fail'' end as result
from students;'),
  ('sql', 'Functions', 'medium', 19, 'Show marks, treating missing as zero',
   'Never display NULL in the marks column.', '`IFNULL()` in MySQL, `COALESCE()` everywhere.', 'select name, coalesce(marks, 0) as marks from students;'),
  ('sql', 'Functions', 'medium', 20, 'Round every course fee to the nearest thousand',
   'Course name and rounded fee.', '`ROUND(fee, -3)` rounds to thousands.', 'select course_name, round(fee, -3) as fee_rounded from courses;'),
  ('sql', 'Grouping', 'medium', 21, 'Count the students in each city',
   'City and how many students it has.', '`GROUP BY city` with `COUNT(*)`.', 'select city, count(*) as students from students group by city;'),
  ('sql', 'Grouping', 'medium', 22, 'Average marks per course',
   'course_id and the average.', '`AVG()` ignores NULLs — that is usually what you want.', 'select course_id, avg(marks) as avg_marks from students group by course_id;'),
  ('sql', 'Grouping', 'medium', 23, 'Highest and lowest marks overall',
   'One row, two columns.', '`MAX()` and `MIN()` with no GROUP BY.', 'select max(marks) as highest, min(marks) as lowest from students;'),
  ('sql', 'Grouping', 'medium', 24, 'Cities with more than two students',
   'City and count, only where the count exceeds two.', '`HAVING` filters groups; `WHERE` filters rows and runs first.', 'select city, count(*) as students
from students group by city having count(*) > 2;'),
  ('sql', 'Grouping', 'medium', 25, 'Total fees collected per payment method',
   'Method and the summed amount, largest first.', '`SUM()` grouped by method, then ORDER BY the alias.', 'select method, sum(amount) as total
from payments group by method order by total desc;'),
  ('sql', 'Grouping', 'medium', 26, 'Average marks per city, ignoring students with no marks',
   'Filter the rows before grouping.', '`WHERE marks IS NOT NULL` runs before GROUP BY.', 'select city, avg(marks) as avg_marks
from students where marks is not null group by city;'),
  ('sql', 'Joins & set operations', 'medium', 27, 'Every student with their course name',
   'Student name and course name.', '`INNER JOIN` on course_id keeps only matched rows.', 'select s.name, c.course_name
from students s join courses c on s.course_id = c.course_id;'),
  ('sql', 'Joins & set operations', 'medium', 28, 'Every student, including those with no course',
   'Course name should be NULL where there is none.', '`LEFT JOIN` keeps every row from the left table.', 'select s.name, c.course_name
from students s left join courses c on s.course_id = c.course_id;'),
  ('sql', 'Joins & set operations', 'medium', 29, 'Courses nobody has joined',
   'Course name only.', 'LEFT JOIN from courses, then keep rows where the student side is NULL.', 'select c.course_name
from courses c left join students s on s.course_id = c.course_id
where s.student_id is null;'),
  ('sql', 'Joins & set operations', 'medium', 30, 'Each employee with their manager''s name',
   'Employee name and manager name.', 'Join `employees` to itself with two aliases.', 'select e.emp_name, m.emp_name as manager
from employees e left join employees m on e.manager_id = m.emp_id;'),
  ('sql', 'Joins & set operations', 'medium', 31, 'Total paid by each student',
   'Student name and their total, including students who paid nothing.', 'LEFT JOIN payments, then SUM with COALESCE.', 'select s.name, coalesce(sum(p.amount), 0) as total_paid
from students s left join payments p on p.student_id = s.student_id
group by s.student_id, s.name;'),
  ('sql', 'Joins & set operations', 'medium', 32, 'All cities and all departments in one list',
   'A single column of distinct values from both tables.', '`UNION` removes duplicates; `UNION ALL` keeps them.', 'select city as place from students
union
select department from employees;'),
  ('sql', 'Subqueries & window functions', 'hard', 33, 'Students who scored above the class average',
   'Name and marks.', 'Put the average in a scalar subquery in the WHERE clause.', 'select name, marks from students
where marks > (select avg(marks) from students);'),
  ('sql', 'Subqueries & window functions', 'hard', 34, 'The course with the most students',
   'Course name and the count, one row.', 'Group, order by the count descending, LIMIT 1.', 'select c.course_name, count(*) as students
from students s join courses c on s.course_id = c.course_id
group by c.course_id, c.course_name
order by students desc limit 1;'),
  ('sql', 'Subqueries & window functions', 'hard', 35, 'Rank students by marks, highest first',
   'Name, marks and a rank column.', '`RANK()` leaves gaps after ties; `DENSE_RANK()` does not.', 'select name, marks, rank() over (order by marks desc) as position
from students;'),
  ('sql', 'Subqueries & window functions', 'hard', 36, 'Rank students within their own city',
   'Restart the ranking for each city.', '`PARTITION BY city` inside the OVER clause.', 'select name, city, marks,
       rank() over (partition by city order by marks desc) as city_rank
from students;'),
  ('sql', 'Subqueries & window functions', 'hard', 37, 'The second highest mark',
   'One value.', 'Rank in a subquery, then filter the outer query for rank 2.', 'select marks from (
  select marks, dense_rank() over (order by marks desc) as r
  from students
) t where r = 2 limit 1;'),
  ('sql', 'Subqueries & window functions', 'hard', 38, 'Running total of payments by date',
   'Payment date, amount, and the cumulative sum.', '`SUM(...) OVER (ORDER BY paid_on)` accumulates.', 'select paid_on, amount,
       sum(amount) over (order by paid_on) as running_total
from payments;'),
  ('sql', 'Subqueries & window functions', 'hard', 39, 'Each student''s marks against their course average',
   'Name, marks, and the course average on the same row.', 'A window function keeps every row, unlike GROUP BY.', 'select name, marks,
       avg(marks) over (partition by course_id) as course_avg
from students;')
on conflict do nothing;
