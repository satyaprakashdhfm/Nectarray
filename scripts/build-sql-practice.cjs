#!/usr/bin/env node
/**
 * Generates the SQL practice migration, with expected output computed by
 * actually running each solution.
 *
 *   node scripts/build-sql-practice.cjs
 *
 * The expected result is what makes a query auto-tick, so it cannot be typed
 * by hand — a single mis-transcribed row would mark correct answers wrong
 * forever. Every solution is executed against the same schema the browser
 * ships, and the script refuses to write anything if one of them errors.
 *
 * Solutions are written in SQL that runs unchanged in both SQLite and MySQL,
 * because the playground is SQLite and the course is taught in MySQL. Where
 * that is not possible the question carries a note saying so.
 */
const fs = require("node:fs");
const path = require("node:path");
const initSqlJs = require("sql.js");

const ROOT = path.join(__dirname, "..");

/** [topic, difficulty, [title, prompt, hint, solution, mysqlNote?]] */
const QUESTIONS = [
  [
    "SELECT & filtering",
    "easy",
    [
      [
        "Show every column for all students",
        "Return the whole students table.",
        "SELECT * with no WHERE.",
        "select * from students;",
      ],
      [
        "List student names and their city",
        "Only the name and city columns.",
        "Name the two columns instead of using *.",
        "select name, city from students;",
      ],
      [
        "Find students from Bengaluru",
        "All columns, only students whose city is Bengaluru.",
        "WHERE city = 'Bengaluru' — string literals go in single quotes.",
        "select * from students where city = 'Bengaluru';",
      ],
      [
        "List every distinct city",
        "Each city once, no repeats.",
        "SELECT DISTINCT.",
        "select distinct city from students;",
      ],
      [
        "Students who scored above 75",
        "Name and marks, for marks greater than 75.",
        "Comparison operators work on numbers directly.",
        "select name, marks from students where marks > 75;",
      ],
      [
        "The five most recent joiners",
        "Name and joined_on, newest first, five rows.",
        "ORDER BY joined_on DESC then LIMIT 5.",
        "select name, joined_on from students order by joined_on desc limit 5;",
      ],
      [
        "Students with no marks recorded",
        "Rows where marks is missing.",
        "Missing is not the same as zero — use IS NULL, never = NULL.",
        "select * from students where marks is null;",
      ],
      [
        "Rename marks to score in the output",
        "Show name and marks, with marks labelled score.",
        "Column alias with AS.",
        "select name, marks as score from students;",
      ],
    ],
  ],
  [
    "Operators & clauses",
    "easy",
    [
      [
        "Students aged between 20 and 22",
        "Inclusive of both ends.",
        "BETWEEN includes both bounds.",
        "select * from students where age between 20 and 22;",
      ],
      [
        "Students from Bengaluru, Chennai or Pune",
        "One condition, three cities.",
        "IN beats three ORs.",
        "select * from students where city in ('Bengaluru','Chennai','Pune');",
      ],
      [
        "Students whose name starts with A",
        "Any name beginning with the letter A.",
        "LIKE 'A%' — % matches any run of characters.",
        "select * from students where name like 'A%';",
      ],
      [
        "Students whose name contains 'ee'",
        "Anywhere in the name.",
        "Wildcards go on both sides: LIKE '%ee%'.",
        "select * from students where name like '%ee%';",
      ],
      [
        "High scorers not from Chennai",
        "Marks above 70, city is not Chennai.",
        "Combine with AND and <> (or NOT).",
        "select * from students where marks > 70 and city <> 'Chennai';",
      ],
      [
        "Courses that cost 15000 or more, cheapest first",
        "Course name and fee.",
        "WHERE then ORDER BY fee.",
        "select course_name, fee from courses where fee >= 15000 order by fee;",
      ],
    ],
  ],
  [
    "Functions",
    "medium",
    [
      [
        "Show every student name in capitals",
        "Uppercase the name column.",
        "UPPER().",
        "select upper(name) as name from students;",
      ],
      [
        "Show the length of each student name",
        "Name and its character count.",
        "LENGTH() counts characters.",
        "select name, length(name) as name_length from students;",
      ],
      [
        "Show the year each student joined",
        "Name and the year part of joined_on.",
        "The dates are stored as YYYY-MM-DD, so the first four characters are the year.",
        "select name, substr(joined_on, 1, 4) as joined_year from students;",
        "MySQL also has YEAR(joined_on), which is clearer when the column is a real DATE. SUBSTR works in both.",
      ],
      [
        "Label students pass or fail at 40 marks",
        "Name, marks, and a result column reading 'Pass' or 'Fail'.",
        "CASE WHEN ... THEN ... ELSE ... END.",
        "select name, marks,\n       case when marks >= 40 then 'Pass' else 'Fail' end as result\nfrom students;",
      ],
      [
        "Show marks, treating missing as zero",
        "Never display NULL in the marks column.",
        "COALESCE works everywhere; MySQL also has IFNULL.",
        "select name, coalesce(marks, 0) as marks from students;",
      ],
      [
        "Round every course fee to the nearest thousand",
        "Course name and rounded fee.",
        "ROUND(fee, -3) rounds to thousands.",
        "select course_name, round(fee, -3) as fee_rounded from courses;",
      ],
    ],
  ],
  [
    "Grouping",
    "medium",
    [
      [
        "Count the students in each city",
        "City and how many students it has.",
        "GROUP BY city with COUNT(*).",
        "select city, count(*) as students from students group by city;",
      ],
      [
        "Average marks per course",
        "course_id and the average.",
        "AVG() ignores NULLs — that is usually what you want.",
        "select course_id, avg(marks) as avg_marks from students group by course_id;",
      ],
      [
        "Highest and lowest marks overall",
        "One row, two columns.",
        "MAX() and MIN() with no GROUP BY.",
        "select max(marks) as highest, min(marks) as lowest from students;",
      ],
      [
        "Cities with more than two students",
        "City and count, only where the count exceeds two.",
        "HAVING filters groups; WHERE filters rows and runs first.",
        "select city, count(*) as students\nfrom students group by city having count(*) > 2;",
      ],
      [
        "Total fees collected per payment method",
        "Method and the summed amount, largest first.",
        "SUM() grouped by method, then ORDER BY the alias.",
        "select method, sum(amount) as total\nfrom payments group by method order by total desc;",
      ],
      [
        "Average marks per city, ignoring students with no marks",
        "Filter the rows before grouping.",
        "WHERE marks IS NOT NULL runs before GROUP BY.",
        "select city, avg(marks) as avg_marks\nfrom students where marks is not null group by city;",
      ],
    ],
  ],
  [
    "Joins & set operations",
    "medium",
    [
      [
        "Every student with their course name",
        "Student name and course name.",
        "INNER JOIN on course_id keeps only matched rows.",
        "select s.name, c.course_name\nfrom students s join courses c on s.course_id = c.course_id;",
      ],
      [
        "Every student, including those with no course",
        "Course name should be NULL where there is none.",
        "LEFT JOIN keeps every row from the left table.",
        "select s.name, c.course_name\nfrom students s left join courses c on s.course_id = c.course_id;",
      ],
      [
        "Courses nobody has joined",
        "Course name only.",
        "LEFT JOIN from courses, then keep rows where the student side is NULL.",
        "select c.course_name\nfrom courses c left join students s on s.course_id = c.course_id\nwhere s.student_id is null;",
      ],
      [
        "Each employee with their manager's name",
        "Employee name and manager name.",
        "Join employees to itself with two aliases.",
        "select e.emp_name, m.emp_name as manager\nfrom employees e left join employees m on e.manager_id = m.emp_id;",
      ],
      [
        "Total paid by each student",
        "Student name and their total, including students who paid nothing.",
        "LEFT JOIN payments, then SUM with COALESCE.",
        "select s.name, coalesce(sum(p.amount), 0) as total_paid\nfrom students s left join payments p on p.student_id = s.student_id\ngroup by s.student_id, s.name;",
      ],
      [
        "All cities and all departments in one list",
        "A single column of distinct values from both tables.",
        "UNION removes duplicates; UNION ALL keeps them.",
        "select city as place from students\nunion\nselect department from employees;",
      ],
    ],
  ],
  [
    "Subqueries & window functions",
    "hard",
    [
      [
        "Students who scored above the class average",
        "Name and marks.",
        "Put the average in a scalar subquery in the WHERE clause.",
        "select name, marks from students\nwhere marks > (select avg(marks) from students);",
      ],
      [
        "The course with the most students",
        "Course name and the count, one row.",
        "Group, order by the count descending, LIMIT 1.",
        "select c.course_name, count(*) as students\nfrom students s join courses c on s.course_id = c.course_id\ngroup by c.course_id, c.course_name\norder by students desc limit 1;",
      ],
      [
        "Rank students by marks, highest first",
        "Name, marks and a rank column.",
        "RANK() leaves gaps after ties; DENSE_RANK() does not.",
        "select name, marks, rank() over (order by marks desc) as position\nfrom students;",
      ],
      [
        "Rank students within their own city",
        "Restart the ranking for each city.",
        "PARTITION BY city inside the OVER clause.",
        "select name, city, marks,\n       rank() over (partition by city order by marks desc) as city_rank\nfrom students;",
      ],
      [
        "The second highest mark",
        "One value.",
        "Rank in a subquery, then filter the outer query for rank 2.",
        "select marks from (\n  select marks, dense_rank() over (order by marks desc) as r\n  from students\n) t where r = 2 limit 1;",
      ],
      [
        "Running total of payments by date",
        "Payment date, amount, and the cumulative sum.",
        "SUM(...) OVER (ORDER BY paid_on) accumulates.",
        "select paid_on, amount,\n       sum(amount) over (order by paid_on) as running_total\nfrom payments;",
      ],
      [
        "Each student's marks against their course average",
        "Name, marks, and the course average on the same row.",
        "A window function keeps every row, unlike GROUP BY.",
        "select name, marks,\n       avg(marks) over (partition by course_id) as course_avg\nfrom students;",
      ],
    ],
  ],
];

function esc(value) {
  return String(value).replace(/'/g, "''");
}

async function main() {
  const appSrc = fs.readFileSync(
    path.join(ROOT, "src/lib/practice-db.ts"),
    "utf8",
  );
  const schema = appSrc.match(
    /export const PRACTICE_SCHEMA = `([\s\S]*?)`;/,
  )?.[1];
  if (!schema) throw new Error("Could not read PRACTICE_SCHEMA from the app.");

  const SQL = await initSqlJs();
  const rows = [];
  const failures = [];
  let position = 0;

  for (const [topic, difficulty, items] of QUESTIONS) {
    for (const [title, prompt, hint, solution, note] of items) {
      position += 1;

      // A fresh database per question: one question's UPDATE must not change
      // the expected answer of the next.
      const db = new SQL.Database();
      db.exec(schema);

      let expected = null;
      try {
        const out = db.exec(solution);
        if (out.length === 0) {
          failures.push(`${title}: solution returned no result set`);
        } else {
          const last = out[out.length - 1];
          expected = { columns: last.columns, rows: last.values };
        }
      } catch (error) {
        failures.push(`${title}: ${error.message}`);
      }
      db.close();
      if (!expected) continue;

      rows.push(
        `  ('sql', '${esc(topic)}', '${difficulty}', ${position}, '${esc(title)}',\n` +
          `   '${esc(prompt)}', '${esc(hint)}', '${esc(solution)}',\n` +
          `   ${note ? `'${esc(note)}'` : "null"},\n` +
          `   '${esc(JSON.stringify(expected))}'::jsonb)`,
      );
    }
  }

  if (failures.length) {
    console.error("Refusing to write. Solutions that did not run:\n");
    failures.forEach((line) => console.error(`  ${line}`));
    process.exit(1);
  }

  const out = `-- =============================================================
--  SQL practice questions — generated by scripts/build-sql-practice.cjs
--  Do not hand-edit. expected_result is the real output of each solution,
--  executed against the same schema the browser ships.
-- =============================================================

alter table public.practice_questions
  add column if not exists mysql_note text;

delete from public.practice_questions where track = 'sql';

insert into public.practice_questions
  (track, topic, difficulty, position, title,
   prompt_md, hint_md, solution_sql, mysql_note, expected_result) values
${rows.join(",\n")}
on conflict do nothing;
`;

  fs.writeFileSync(
    path.join(ROOT, "supabase/migrations/0006_sql_practice.sql"),
    out,
  );
  console.error(`${rows.length} questions, all solutions ran.`);
  console.error("wrote supabase/migrations/0006_sql_practice.sql");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
