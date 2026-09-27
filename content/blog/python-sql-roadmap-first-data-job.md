Most people who try to learn Python and SQL for a data job on their own stall around week four. There is too much material, no clear order, and nothing to show at the end. This roadmap fixes the order, gives each block a small thing to build, and leaves out what you do not need yet.

It assumes six to eight hours a week, which is realistic alongside a job or college. At that pace it takes twelve weeks.

![A twelve-week timeline: weeks 1 to 5 Python, weeks 6 to 9 SQL, weeks 10 and 11 a project, week 12 interview preparation.](/blog/python-sql-roadmap-first-data-job/diagram.svg "Python first, then SQL, then one project you can defend, then interviews.")

## Weeks 1 to 5: Python

Start with Python because everything later assumes it, including the data libraries and most SQL practice platforms.

### Week 1: the basics

Variables, data types, arithmetic, strings, input and output, and `if` statements. Write small programs that take input and print something useful, such as a bill splitter or a marks calculator.

### Week 2: loops and collections

`for` and `while` loops, lists, tuples, sets and dictionaries. Practise until you can count words in a paragraph, group items by a key and find duplicates without looking anything up.

### Week 3: functions and files

Functions, arguments, return values, scope, and reading and writing files. Build a script that reads a CSV of expenses and prints totals by category.

### Week 4: errors, classes and modules

`try` and `except`, a first look at classes, and splitting code into modules. Rewrite the week 3 script so it handles bad rows without crashing.

### Week 5: pandas

Loading data, selecting rows and columns, filtering, grouping and joining in pandas. Redo the expense report in pandas and notice how much shorter it is.

Throughout these five weeks, solve two or three easy practice problems on arrays, strings and dictionaries each week. That is the material most Python screening tests use.

## Weeks 6 to 9: SQL

SQL is where many candidates are weakest and where interviews are least forgiving. Practise against a real database from the first day.

### Week 6: querying one table

`SELECT`, `WHERE`, `ORDER BY`, `LIMIT`, and the aggregate functions with `GROUP BY` and `HAVING`.

### Week 7: joins

Inner, left and self joins. Practise until you can predict the number of rows a join will return before you run it. That skill catches most join bugs.

### Week 8: subqueries and CTEs

Subqueries in `WHERE` and `FROM`, and common table expressions with `WITH`. Rewrite a few long queries as CTEs so they read top to bottom.

### Week 9: window functions

`ROW_NUMBER`, `RANK`, running totals with `SUM() OVER`, and `LAG` and `LEAD`. These come up in almost every data interview: second-highest salary, month-on-month growth, top three per group.

## Weeks 10 and 11: one project

Pick one dataset about something you understand, such as sales, cricket, rentals or your city's transport. Load it into a database, answer five real questions with SQL, clean and analyse it in pandas, and write up what you found in a README with a chart or two.

One finished project you can explain line by line is worth more in an interview than five half-done notebooks. Put it on GitHub.

## Week 12: interview preparation

- Do timed SQL and Python problems, about an hour a day.
- Rewrite your résumé around the project, with numbers.
- Practise explaining the project in two minutes, then in ten.
- Prepare for the HR round: why this role, why this company, and a real example of a problem you solved.
- Do at least one mock interview with someone who will tell you what went wrong.

## What to skip for now

Deep learning, big data tools like Spark, cloud certifications and a long list of visualisation libraries can all wait. They matter later. They are rarely what decides a first data interview, and each one can eat a month.

## Staying on track

Keep a simple log of what you did each week and one thing you built. When you get stuck for more than an hour, ask someone. Most people who give up do so after a week where nothing seemed to move.

This is the same order our Python, SQL and Data Science programme follows, with live classes in small groups, code review on every assignment, and a technical mock interview at the end. If you would rather do it with a group than alone, that is what the programme is for.
