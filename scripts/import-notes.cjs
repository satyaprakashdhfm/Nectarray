#!/usr/bin/env node
/**
 * Turns the course notes into a migration that seeds public.lessons.
 *
 *   node scripts/import-notes.cjs <path-to-placement-course-2026>
 *
 * Re-run it whenever the notes change and paste the new migration; it
 * replaces the SQL module's lessons wholesale rather than trying to diff
 * them, which is the right trade when the notes are the source of truth and
 * the database is a copy.
 *
 * Bodies are dollar-quoted with a tag that cannot appear in the text, so
 * nothing inside the markdown — quotes, backslashes, $$ in shell examples —
 * needs escaping.
 */
const fs = require("node:fs");
const path = require("node:path");

/**
 * File → where it sits in its module.
 *
 * Day labels come from the course plan, not from the filenames: the repo
 * numbers its SQL teaching notes 1..11 while that syllabus runs to day 18,
 * because several files cover more than one day.
 *
 * Days with no file yet are simply absent — the importer skips them and says
 * so, rather than seeding an empty lesson that looks published but is blank.
 */
const SQL_LESSONS = [
  [
    "Day_01_Database_Fundamentals.md",
    "Day 1",
    "Database Fundamentals",
    "DBMS, RDBMS, SQL, database design and how a query actually executes.",
  ],
  [
    "DAY2_CREATE_INSERT_ALTER_UPATE_DELETE.md",
    "Day 2–3",
    "Database Objects",
    "CREATE, INSERT, ALTER, DELETE, TRUNCATE, DROP, constraints and data types.",
  ],
  [
    "DAY3_SELECT_RETRIEVING_DATA.md",
    "Day 4–6",
    "SELECT Queries",
    "SELECT, DISTINCT, WHERE, ORDER BY, LIMIT, OFFSET, aliases and NULL handling.",
  ],
  [
    "DAY4_OPERATORS_AND_CLAUSES.md",
    "Day 7–8",
    "Operators & Clauses",
    "IN, BETWEEN, LIKE, AND/OR/NOT, operator precedence and EXISTS.",
  ],
  [
    "DAY5_SQL_FUNCTIONS.md",
    "Day 9–10",
    "SQL Functions",
    "String, numeric, date, aggregate and conditional functions.",
  ],
  [
    "DAY6_GROUP_BY_AND_HAVING.md",
    "Day 11–12",
    "Grouping",
    "GROUP BY, HAVING, execution order, duplicates and WITH ROLLUP.",
  ],
  [
    "DAY7_JOINS_AND_UNION.md",
    "Day 13–14",
    "Joins & Set Operations",
    "INNER, LEFT, RIGHT, CROSS and SELF joins, plus UNION.",
  ],
  [
    "DAY8_SUBQUERIES_AND_WINDOW_FUNCTIONS.md",
    "Day 15",
    "Subqueries & Window Functions",
    "Subqueries, derived tables, ROW_NUMBER, RANK, DENSE_RANK and PARTITION BY.",
  ],
  [
    "DAY9_VIEWS_INDEXES_TRANSACTIONS.md",
    "Day 16",
    "Views, Indexes & Transactions",
    "Views, indexes, EXPLAIN, transactions, SAVEPOINT and ACID.",
  ],
  [
    "DAY10_STORED_PROCEDURES_FUNCTIONS_TRIGGERS.md",
    "Day 17",
    "Stored Programs",
    "DELIMITER, procedures, functions, handlers, SIGNAL and triggers.",
  ],
  [
    "DAY11_REVISION_AND_INTERVIEW_PREP.md",
    "Day 18",
    "Revision & Interview Prep",
    "Seven query patterns, twenty interview questions, silent failures and myths.",
  ],
  [
    "DIALECTS.md",
    "Reference",
    "Dialect Differences",
    "Where MySQL, PostgreSQL, SQL Server and Oracle disagree — read before an interview.",
  ],
];

/** File → where it sits in the 22-day Python module. */
const PYTHON_LESSONS = [
  [
    "Day_1_Python_Fundamentals.md",
    "Day 1",
    "Programming Fundamentals",
    "Languages, compilation vs interpretation, Python architecture, installation and IDEs.",
  ],
  [
    "Day_2_Python_Basics.md",
    "Day 2–3",
    "Python Basics",
    "Variables, data types, operators, type conversion and input/output.",
  ],
  [
    "Day_4_Conditions_and_Loops.md",
    "Day 4",
    "Conditions & Loops",
    "if/elif/else, match, for, while, break, continue, pass and loop patterns.",
  ],
  [
    "Day_5_Strings_Professional_Notes.md",
    "Day 5",
    "Strings",
    "Indexing, slicing, methods, formatting and why immutability matters.",
  ],
  [
    "Day_6_Lists_Professional_Notes.md",
    "Day 6",
    "Lists",
    "Mutability, methods, nesting and list comprehensions.",
  ],
  [
    "Day_7_Tuples_and_Sets_Professional_Notes.md",
    "Day 7",
    "Tuples & Sets",
    "Immutable sequences, set algebra, and when each one is the right container.",
  ],
  [
    "Day_8_Dictionaries_Professional_Notes.md",
    "Day 8",
    "Dictionaries",
    "Key-value storage, methods, nesting and dictionary comprehensions.",
  ],
  [
    "Day_9_Functions_Fundamentals.md",
    "Day 9",
    "Functions",
    "Parameters, arguments, return values, scope and the call stack.",
  ],
  [
    "Day_10_Advanced_Functions.md",
    "Day 10",
    "Advanced Functions",
    "Lambda, recursion, decorators, generators and the built-in higher-order functions.",
  ],
  [
    "Day_11_File_Handling.md",
    "Day 11",
    "File Handling",
    "Reading, writing, context managers and working with paths.",
  ],
  [
    "Day_12_Exception_Handling.md",
    "Day 12",
    "Exception Handling",
    "try/except/else/finally, raising, and writing custom exceptions.",
  ],
];

/** The two modules, keyed by the slug seeded in 0001. */
const MODULES = [
  { slug: "sql", dir: "sql", lessons: SQL_LESSONS },
  { slug: "python", dir: "python_notes", lessons: PYTHON_LESSONS },
];

const TAG = "$notes_md$";

function main() {
  const repo = process.argv[2];
  if (!repo) {
    console.error("usage: import-notes.cjs <path-to-placement-course-2026>");
    process.exit(1);
  }

  const out = [
    "-- =========================================================",
    "--  Course notes — generated by scripts/import-notes.cjs",
    "--  Do not hand-edit: re-run the script against the notes repo.",
    "-- =========================================================",
    "",
  ];

  let totalLessons = 0;
  let totalBytes = 0;
  const esc = (value) => value.replace(/'/g, "''");

  for (const module of MODULES) {
    const dir = path.join(repo, module.dir);
    if (!fs.existsSync(dir)) {
      console.error(`! no ${module.dir}/ in ${repo} — skipping ${module.slug}`);
      continue;
    }

    console.error(`\n${module.slug}`);
    out.push(
      `-- ${module.slug} ------------------------------------------------`,
      "-- Replace the module's lessons wholesale. The notes repo is the",
      "-- source of truth; this table is a copy of it.",
      "delete from public.lessons",
      `  where module_id = (select id from public.modules where slug = '${module.slug}');`,
      "",
    );

    let position = 0;
    for (const [file, dayLabel, title, summary] of module.lessons) {
      const full = path.join(dir, file);
      if (!fs.existsSync(full)) {
        console.error(`  - not written yet, skipped: ${file}`);
        continue;
      }
      const body = fs.readFileSync(full, "utf8");
      if (body.includes(TAG)) {
        // Would terminate the dollar-quoted string early and corrupt the file.
        console.error(`  ! ${file} contains the quoting tag — aborting`);
        process.exit(1);
      }
      position += 1;
      totalBytes += Buffer.byteLength(body);

      out.push(
        "insert into public.lessons",
        "  (module_id, day_label, title, summary, position, is_published, body_md)",
        `select id, '${esc(dayLabel)}', '${esc(title)}', '${esc(summary)}', ${position}, true,`,
        `  ${TAG}${body}${TAG}`,
        `from public.modules where slug = '${module.slug}';`,
        "",
      );
      console.error(
        `  ${String(position).padStart(2)}. ${dayLabel.padEnd(9)} ${title}`,
      );
    }
    totalLessons += position;
  }

  fs.writeFileSync(
    path.join(
      __dirname,
      "..",
      "supabase",
      "migrations",
      "0005_course_notes.sql",
    ),
    out.join("\n"),
  );
  console.error(
    `\n${totalLessons} lessons, ${(totalBytes / 1024).toFixed(0)} KB of markdown`,
  );
  console.error("wrote supabase/migrations/0005_course_notes.sql");
}

main();
