- the right hierarchy! 📌 Database Structure Hierarchy
    1. Database Server Group *(pgAdmin concept)*
    - **Connect to server group**: GUI-based operations in pgAdmin
    - **Add new server**: Right-click → Create → Server
    - **Remove server**: Right-click → Remove Server

    2. Database Server (Cluster)
        ```sql
        -- Connect to PostgreSQL server
        psql -h hostname -p port -U username

        -- Show server version
        SELECT version();

        -- Show server status
        SELECT pg_is_in_recovery();

        -- Show active connections
        SELECT * FROM pg_stat_activity;

        -- Show database sizes
        SELECT datname, pg_size_pretty(pg_database_size(datname)) 
        FROM pg_database;

        -- Restart/Stop server (system commands)
        sudo systemctl restart postgresql
        sudo systemctl stop postgresql
        sudo systemctl start postgresql
        ```

    3. Database
        ```sql
        -- Create database
        CREATE DATABASE database_name;

        -- List all databases
        \l
        -- or
        SELECT datname FROM pg_database;

        -- Connect to database
        \c database_name
        -- or
        psql -d database_name

        -- Drop database
        DROP DATABASE database_name;

        -- Show current database
        SELECT current_database();

        -- Database backup
        pg_dump database_name > backup.sql

        -- Restore database
        psql database_name < backup.sql
        ```

    4. Schemas
        ```sql
        -- Create schema
        CREATE SCHEMA schema_name;

        -- create schema with owner 
        CREATE SCHEMA schema_name AUTHORIZATION user_name;

        -- List all schemas
        \dn
        -- or
        SELECT schema_name FROM information_schema.schemata;

        -- Set search path (default schema)
        SET search_path TO schema_name, public;

        -- Show current search path
        SHOW search_path;

        -- Drop schema
        DROP SCHEMA schema_name CASCADE;

        -- Create table in specific schema
        CREATE TABLE schema_name.table_name (...);

        -- Grant schema permissions
        GRANT USAGE ON SCHEMA schema_name TO username;
        GRANT CREATE ON SCHEMA schema_name TO username;
        ```

    5. Tables
        ```sql
        -- Create table
        CREATE TABLE table_name (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- List all tables
        \dt
        -- or
        SELECT tablename FROM pg_tables WHERE schemaname = 'public';

        -- Describe table structure
        \d table_name
        -- or
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'table_name';

        -- Drop table
        DROP TABLE table_name;

        -- Alter table (add column)
        ALTER TABLE table_name ADD COLUMN new_column VARCHAR(50);

        -- Alter table (modify column)
        ALTER TABLE table_name ALTER COLUMN column_name TYPE new_type;

        -- Rename table
        ALTER TABLE old_name RENAME TO new_name;

        -- Show table size
        SELECT pg_size_pretty(pg_total_relation_size('table_name'));
        ```

    6. Rows
        ```sql
        -- Insert single row
        INSERT INTO table_name (column1, column2) 
        VALUES ('value1', 'value2');

        -- Insert multiple rows
        INSERT INTO table_name (column1, column2) 
        VALUES 
            ('value1', 'value2'),
            ('value3', 'value4');

        -- Select all rows
        SELECT * FROM table_name;

        -- Select with conditions
        SELECT * FROM table_name WHERE column1 = 'value';

        -- Update rows
        UPDATE table_name 
        SET column1 = 'new_value' 
        WHERE condition;

        -- Delete rows
        DELETE FROM table_name WHERE condition;

        -- Count rows
        SELECT COUNT(*) FROM table_name;

        -- Select with limit
        SELECT * FROM table_name LIMIT 10;

        -- Select with ordering
        SELECT * FROM table_name ORDER BY column1 DESC;
        ```

    7. Columns
        ```sql
        -- Add new column
        ALTER TABLE table_name ADD COLUMN column_name data_type;

        -- Drop column
        ALTER TABLE table_name DROP COLUMN column_name;

        -- Rename column
        ALTER TABLE table_name RENAME COLUMN old_name TO new_name;

        -- Change column data type
        ALTER TABLE table_name ALTER COLUMN column_name TYPE new_type;

        -- Set column default value
        ALTER TABLE table_name ALTER COLUMN column_name SET DEFAULT default_value;

        -- Remove column default
        ALTER TABLE table_name ALTER COLUMN column_name DROP DEFAULT;

        -- Set column NOT NULL
        ALTER TABLE table_name ALTER COLUMN column_name SET NOT NULL;

        -- Remove NOT NULL constraint
        ALTER TABLE table_name ALTER COLUMN column_name DROP NOT NULL;

        -- Add column constraint
        ALTER TABLE table_name ADD CONSTRAINT constraint_name 
        CHECK (column_name > 0);

        -- Show column information
        SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'your_table_name';
        ```

        - Common Data Types for Columns
        ```sql
        -- Numeric types
        INTEGER, BIGINT, SMALLINT
        DECIMAL(precision, scale)
        NUMERIC(precision, scale)
        REAL, DOUBLE PRECISION

        -- Text types
        VARCHAR(n)
        TEXT
        CHAR(n)

        -- Date/Time types
        DATE
        TIME
        TIMESTAMP
        TIMESTAMPTZ

        -- Boolean
        BOOLEAN

        -- JSON
        JSON
        JSONB

        -- Arrays
        INTEGER[]
        TEXT[]

        -- UUID
        UUID
        ```

    - Useful Shortcuts in psql
        ```sql
        \l          -- List databases
        \c dbname   -- Connect to database
        \dt         -- List tables
        \d table    -- Describe table
        \dn         -- List schemas
        \du         -- List users
        \q          -- Quit psql
        \?          -- Help
        \h command  -- Help for specific SQL command
    ```

# 1. **SQL Language Categories**

SQL is divided into four major language categories based on functionality:



## **1. DDL – Data Definition Language**

Used to define and manage the structure of database objects such as tables, schemas, indexes, etc.

| Command      | Description                                                                  |
| ------------ | ---------------------------------------------------------------------------- |
| **CREATE**   | Creates a new database object (table, view, index, etc.).                    |
| **ALTER**    | Modifies the structure of an existing table (e.g., add/drop/rename columns). |
| **DROP**     | Deletes a database object and its data permanently.                          |
| **TRUNCATE** | Removes all rows from a table quickly without logging individual deletions.  |



## **2. DML – Data Manipulation Language**

Deals with data operations such as retrieval, insertion, update, and deletion.

| Command    | Description                                              |
| ---------- | -------------------------------------------------------- |
| **SELECT** | Retrieves data from one or more tables.                  |
| **INSERT** | Adds new rows of data to a table.                        |
| **UPDATE** | Modifies existing data in a table.                       |
| **DELETE** | Deletes specific rows from a table based on a condition. |



## **3. DCL – Data Control Language**

Handles access control and permissions within the database.

| Command    | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| **GRANT**  | Assigns specific privileges to users (e.g., SELECT, INSERT). |
| **REVOKE** | Removes previously granted privileges from users.            |



## **4. TCL – Transaction Control Language**

Manages transactions to ensure database consistency and integrity.

| Command               | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| **START TRANSACTION** | Begins a new transaction block.                            |
| **COMMIT**            | Saves all changes made during the current transaction.     |
| **ROLLBACK**          | Reverts all changes made in the current transaction.       |
| **SAVEPOINT**         | Defines a checkpoint within a transaction to roll back to. |

---
---

# **2. Data Types**

#### **Character Types**

| Type           | Description                          |
| -------------- | ------------------------------------ |
| **CHAR(n)**    | Fixed-length character string.       |
| **VARCHAR(n)** | Variable-length character string.    |
| **TEXT**       | Large text data (long form strings). |

#### **Numeric Types**

| Type                          | Size (Storage) | Description                                                               |
| ----------------------------- | -------------- | ------------------------------------------------------------------------- |
| **SMALLINT**                  | 2 bytes        | Integer from **-32,768 to 32,767**.                                       |
| **INT / INTEGER**             | 4 bytes        | Integer from **-2,147,483,648 to 2,147,483,647**.                         |
| **BIGINT**                    | 8 bytes        | Integer from **-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807**. |
| **DECIMAL(p, s) / NUMERIC**   | Variable       | Exact numeric type with **p precision** and **s scale** (user-defined).   |
| **REAL / FLOAT4**             | 4 bytes        | Approximate floating-point, \~6 decimal digits precision.                 |
| **DOUBLE PRECISION / FLOAT8** | 8 bytes        | Approximate floating-point, \~15 decimal digits precision.                |


#### **Date & Time Types**

| Type          | Description                                   |
| ------------- | --------------------------------------------- |
| **DATE**      | Stores date (YYYY-MM-DD).                     |
| **TIME**      | Stores time (HH\:MM\:SS).                     |
| **DATETIME**  | Combines date and time.                       |
| **TIMESTAMP** | Similar to DATETIME, with time zone tracking. |
| **YEAR**      | Stores a year in 4-digit format.              |

---

#### **Common Date Functions**

| Function                                    | Purpose                                     |
| ------------------------------------------- | ------------------------------------------- |
| **YEAR(date\_column)**                      | Extracts the year from a date.              |
| **MONTH(date\_column)**                     | Extracts the month number.                  |
| **DAY(date\_column)**                       | Extracts the day of the month.              |
| **DAYOFWEEK(date\_column)**                 | Returns the weekday index (1=Sunday).       |
| **DAYNAME(date\_column)**                   | Returns the name of the day (e.g., Monday). |
| **DATE\_ADD(date\_column, INTERVAL n DAY)** | Adds days to a date.                        |
| **DATE\_SUB(date\_column, INTERVAL n DAY)** | Subtracts days from a date.                 |
| **DATEDIFF(date1, date2)**                  | Returns number of days between two dates.   |
| **DATE\_FORMAT(date\_column, '%Y-%m-%d')**  | Formats the date in a specific pattern.     |
| **CURDATE()**                               | Returns the current date.                   |
| **NOW()**                                   | Returns the current date and time.          |

> Example usage:
> `AND MONTH(birth_date) IN (2, 5, 12)`  → February=2, May=5, December=12


---
---

# 3. Clauses & Core Syntax 


### **SELECT: Retrieve columns or expressions**

Here’s a neat list of common operations and functions you can use in SQL when selecting or filtering a single column (in `SELECT`, `WHERE`, or `HAVING`):



### **Text/String Functions**

| Function                           | Purpose                        |
| ---------------------------------- | ------------------------------ |
| `LOWER(column)`                    | convert text to lowercase      |
| `UPPER(column)`                    | convert text to uppercase      |
| `CONCAT(str1, str2)`               | combine strings                |
| `TRIM(column)`                     | remove leading/trailing spaces |
| `SUBSTRING(column, start, length)` | get part of a string           |
| `LENGTH(column)`                   | length of string               |
| `REPLACE(column, 'old', 'new')`    | replace substring              |



### **Boolean Aggregation Notes**

* `COUNT(gender='M')` counts all rows because the boolean expression is never NULL, so it behaves like `COUNT(*)`.
* `SUM(gender='M')` treats the boolean as 1 (true) or 0 (false), correctly counting how many have gender 'M'.
* `COUNT(CASE WHEN gender='M' THEN 1 END)` also correctly counts rows where gender is 'M' by counting non-null values.
* Use `SUM(gender='M')` or the `CASE` form to accurately count males.
* Avoid using `COUNT(gender='M')` for this purpose because it counts all rows regardless of gender.
* This distinction matters as `COUNT()` counts non-null values, while `SUM()` adds numeric boolean results.



### **Numeric Functions**

| Function                           | Purpose                       |
| ---------------------------------- | ----------------------------- |
| `ROUND(column, n)`                 | round to n decimal places     |
| `FLOOR(column)`                    | round down to nearest integer |
| `CEIL(column)` / `CEILING(column)` | round up to nearest integer   |
| `ABS(column)`                      | absolute value                |
| `MOD(column, n)`                   | remainder of division         |

Additional summary:

* `FLOOR(value)` always drops the decimal, making it the next lowest whole number (e.g., 10.82 → 10).
* `ROUND(value, d)` rounds to the nearest at d decimals (e.g., 10.82 → 10.8 with 1 decimal, → 11 with 0).



### **Date Functions**

| Function                                       | Purpose                       |
| ---------------------------------------------- | ----------------------------- |
| `YEAR(column)`, `MONTH(column)`, `DAY(column)` | extract parts of date         |
| `DATE_FORMAT(column, '%Y-%m-%d')`              | format date as string         |
| `DATE_ADD(column, INTERVAL n DAY)`             | add days (or other intervals) |
| `DATE_SUB(column, INTERVAL n MONTH)`           | subtract intervals            |
| `DATEDIFF(date1, date2)`                       | difference in days            |
| `CURDATE()`, `NOW()`                           | current date or datetime      |



### **Window Functions & ORDER BY Behavior**

* Even if you use `ORDER BY` at the end of your query to sort the final results, window functions like `LAG()` need their own explicit `ORDER BY` inside the `OVER()` clause to know the sequence for calculating values.
* The `ORDER BY` inside `OVER()` tells `LAG()` which row comes before which, so it can fetch the previous day’s count correctly.
* The final `ORDER BY` sorts the entire result set for display.
* They serve two different purposes:

  * `ORDER BY` inside `OVER()` → defines order for window calculation.
  * `ORDER BY` at the end → defines order for the output rows.
* Without the first one, `LAG()` wouldn't know the correct previous row.
* Aggregates: `SUM() OVER`, `AVG() OVER`, etc.



### **Conditional & Null Handling**

| Function                                         | Description                     |
| ------------------------------------------------ | ------------------------------- |
| `IF(condition, value_if_true, value_if_false)`   | inline if                       |
| `CASE WHEN condition THEN result ELSE other END` | complex conditions              |
| `COALESCE(column, default_value)`                | replace NULL with default       |
| `IFNULL(column, default_value)`                  | same as COALESCE for two values |

Boolean & comparison operations:

* `IS NULL / IS NOT NULL` — check for nulls
* `IN (value1, value2, ...)` — match list of values
* `LIKE 'pattern%'` — pattern matching
* `BETWEEN val1 AND val2` — range check

> We can write directly without `CASE` in the `SELECT`, like `> 30`, so whichever is greater will return `TRUE` and the remaining will return `FALSE`.



### **Percentage & Conversion**

Convert percentage to decimal:
`column / 100.0`

Convert decimal to percentage:
`column * 100`

Format decimal as percentage string:
`CONCAT(ROUND(column * 100, 2), '%')`



### **Example usage in SELECT**

```sql
SELECT 
  LOWER(first_name) AS first_lower, 
  ROUND(score, 1) AS score_rounded, 
  COALESCE(allergies, 'None') AS allergies_or_none, 
  CONCAT(ROUND(percentage * 100, 2), '%') AS percent_display 
FROM patients 
WHERE UPPER(status) = 'ACTIVE' 
  AND score >= 75 
HAVING COUNT(*) > 1;
```



### **Query Clauses Overview**

| Clause     | Purpose                          |
| ---------- | -------------------------------- |
| `FROM`     | Specify source table(s).         |
| `WHERE`    | Filter rows before grouping.     |
| `GROUP BY` | Group rows sharing values.       |
| `HAVING`   | Filter groups after aggregation. |
| `ORDER BY` | Sort the final result.           |

* `AND` is invalid in `ORDER BY`; use a comma like `ORDER BY LENGTH(first_name), first_name` to sort by multiple columns.
* Yes, you can write `ORDER BY allergies ASC, first_name DESC, last_name ASC` to sort with mixed directions.



### **ORDER BY Methods for Numeric Columns**

* Ascending (default): `ORDER BY column_name`
* Descending: `ORDER BY column_name DESC`
* Absolute value (smallest magnitude first): `ORDER BY ABS(column_name)`
* Nulls last (if supported): `ORDER BY column_name ASC NULLS LAST`



### **ORDER BY Methods for String Columns**

* Alphabetical A–Z (default): `ORDER BY column_name`
* Reverse alphabetical Z–A: `ORDER BY column_name DESC`
* By length of string: `ORDER BY LENGTH(column_name)`
* Case-insensitive sort: `ORDER BY LOWER(column_name)`
* Custom substring sort (e.g., by last 3 characters): `ORDER BY RIGHT(column_name, 3)`


### **Other Clauses**

* `LIMIT` / `TOP`: Restrict row count.
* `DISTINCT`: Remove duplicate rows.
* `PARTITION BY ... OVER`: Define window partitions for functions.



---
---

# 4. Operators & Expressions 


### **Comparison Operators**

| Operator     | Meaning                  |
| ------------ | ------------------------ |
| `=`          | Equal                    |
| `!=` or `<>` | Not equal                |
| `>`          | Greater than             |
| `<`          | Less than                |
| `>=`         | Greater than or equal to |
| `<=`         | Less than or equal to    |



### **Logical Operators**

| Operator | Description                                    |
| -------- | ---------------------------------------------- |
| `AND`    | Combine multiple conditions (all must be true) |
| `OR`     | At least one condition must be true            |
| `NOT`    | Negates the condition                          |

* Use: `WHERE allergies IN ('Penicillin', 'Morphine')` — it's the correct one-line way to filter for either value.



### **IN Operator**

* Checks if a value is in a list:
  `x IN (a, b, c)`

* ✅ Correct: `IN`

* ❌ Incorrect: `IS IN` (will cause a **syntax error**)

**Clarification**:

* `IS` is used only with NULL values: `IS NULL`, `IS NOT NULL`
* It is **not** used with `IN`.



### **Other Operators**

| Operator          | Description                                                                      |
| ----------------- | -------------------------------------------------------------------------------- |
| `BETWEEN a AND b` | Inclusive range                                                                  |
| `LIKE`            | Pattern matching using `%` (any number of characters) and `_` (single character) |
| `IS NULL`         | Tests if value is null                                                           |
| `IS NOT NULL`     | Tests if value is not null                                                       |

---
---

# 5. Pattern Matching Wildcards 

### **Pattern Matching Wildcards**

| Symbol      | Meaning                                              | Example                                                  |
| ----------- | ---------------------------------------------------- | -------------------------------------------------------- |
| `%`         | Zero or more characters                              | `'a%z'` → Starts with 'a', ends with 'z'                 |
| `_`         | Exactly one character                                | `'m___k'` → Starts with 'm', 5 characters, ends with 'k' |
| `%cat%`     | Contains 'cat' anywhere                              |                                                          |
| `%ing`      | Ends with 'ing'                                      |                                                          |
| `'pre%ed'`  | Starts with 'pre', ends with 'ed'                    |                                                          |
| `'b___'`    | Exactly 4 characters, starts with 'b'                |                                                          |
| `'x%x'`     | Starts and ends with 'x', length ≥ 3                 |                                                          |
| `'s____%s'` | Starts and ends with 's', at least 6 characters      |                                                          |
| `'t____r'`  | Exactly 7 characters, starts with 't', ends with 'r' |                                                          |
| `'%\_%'`    | Contains underscore character literally (use escape) |                                                          |

**SQL Server only:**

* `[abc]`, `[^abc]`, `[a-z]`

**Notes:**

* LIKE in SQL can only match simple patterns using `%` and `_`.
* It **cannot** validate character sets, enforce exact counts, or exclude invalid characters like `#` or multiple `@`.

---

### **REGEXP (Regular Expressions in SQL)**

**Purpose:** Match complex string patterns using rules for character sets, positions, repetitions, etc.

**Example Usage:**

```sql
REGEXP '^[A-Za-z][A-Za-z0-9._-]*@leetcode\.com$'
```



### **General Regex Components and Their Meaning**

| Symbol / Construct | Meaning / Rule                        | Example                          |
| ------------------ | ------------------------------------- | -------------------------------- |
| `^`                | Start of the string                   | `^abc` matches "abc" at start    |
| `$`                | End of the string                     | `xyz$` matches "xyz" at end      |
| `.`                | Any single character (except newline) | `a.c` matches "abc", "a1c"       |
| `[abc]`            | Any one character inside brackets     | Matches 'a', 'b', or 'c'         |
| `[a-z]`            | Any one character in range            | Matches any lowercase letter     |
| `[^abc]`           | Any one character NOT in set          | `[^0-9]` matches any non-digit   |
| `*`                | Zero or more of preceding token       | `a*` → "", "a", "aa"             |
| `+`                | One or more of preceding token        | `a+` → "a", "aa" (not "")        |
| `?`                | Zero or one of preceding token        | `a?` → "" or "a"                 |
| `{n}`              | Exactly n times of preceding token    | `a{3}` → "aaa"                   |
| `{n,}`             | At least n times                      | `a{2,}` → "aa", "aaa", ...       |
| `{n,m}`            | Between n and m times                 | `a{1,3}` → "a", "aa", "aaa"      |
| `\`                | Escape special character              | `\.` → literal "."               |
| `\d`               | Digit `[0-9]`                         | `\d+` → one or more digits       |
| `\D`               | Non-digit                             | `\D+` → one or more non-digits   |
| `\w`               | Word character `[a-zA-Z0-9_]`         | `\w+` → letters, digits, \_      |
| `\W`               | Non-word character                    | `\W+` → anything not in \w       |
| `\s`               | Whitespace character                  | `\s+` → spaces, tabs             |
| `\S`               | Non-whitespace character              | `\S+` → any non-space character  |
| `(abc)`            | Grouping / capture                    | Captures "abc" for backreference |
| `\|`               | Alternation (OR)                      | Matches either side              |



### **How These Build Up Rules in Regex**

* **Anchors** (`^`, `$`) force match to start/end of string.
* **Character classes** (`[ ... ]`) specify allowed or disallowed characters.
* **Quantifiers** (`*`, `+`, `{n,m}`) control how many times something appears.
* **Escape sequences** (`\.`) treat special characters literally.
* **Groups and alternations** allow complex logical patterns.



### **Example: Email Regex Breakdown**

| Component         | Meaning                                       |
| ----------------- | --------------------------------------------- |
| `^[A-Za-z]`       | Start with a letter                           |
| `[A-Za-z0-9._-]*` | Zero or more of allowed characters after that |
| `@leetcode\.com$` | Must end with "@leetcode.com" (dot escaped)   |

---
---

# 6. Window Functions 

#### **🏅 Ranking Functions**

* `ROW_NUMBER()` — Assigns a unique sequential number to each row within a partition.
* `RANK()` — Assigns rank with gaps for ties.
* `DENSE_RANK()` — Assigns rank without gaps for ties.



#### **📦 Bucketing Function**

* `NTILE(N)` — Divides rows into **N** approximately equal-sized groups or buckets.



#### **📍 Navigation Functions**

* `LAG()` — Returns the value from the previous row within the same partition.
* `LEAD()` — Returns the value from the next row within the same partition.



#### **🧠 Important Clarification (ORDER BY in Window Functions)**

> Good question!
> Even if you use `ORDER BY` at the end of your query to sort the final results, window functions like `LAG()` need their own explicit `ORDER BY` inside the `OVER()` clause to know the sequence for calculating values.

* The `ORDER BY` inside `OVER()` tells `LAG()` which row comes before which, so it can fetch the previous day’s count correctly.
* The final `ORDER BY` sorts the **entire result set** for display.

They serve two different purposes:

| Purpose                    | Description                                   |
| -------------------------- | --------------------------------------------- |
| `ORDER BY` inside `OVER()` | Defines the **order for window calculation**. |
| Final `ORDER BY`           | Defines the **order of output rows**.         |

* Without the first one, `LAG()` wouldn't know the correct previous row.



#### **📊 Aggregates with OVER()**

* `SUM() OVER (...)`
* `AVG() OVER (...)`
* Other aggregate functions can also be used with `OVER()` to compute rolling or partition-based summaries.

---
---

# 7. Aggregate Functions 

- Aggregation functions can be used without GROUP BY to perform calculations over the entire result set. 

- COUNT(): Count rows. 

        Pandas: 
    ``` python 
    df[df['first_name'].value_counts()[df['first_name']] == 1]
    ```
    SQL: 
    ```sql
    SELECT first_name 
        FROM patients 
        GROUP BY first_name 
    HAVING COUNT(*) = 1 
    ```
    Or 
    ```sql
    select first_name 
    from(select first_name,count(first_name) as occurance from patients group by first_name) 
    where occurance=1 
    ```
    Both do the same thing: return rows where first_name occurs only once in the table or DataFrame. 

 

- SUM(): Sum values. 

- AVG(): Average. 

- MIN(), MAX(): Minimum, maximum.

---
---

# 8. Control Flow 

- CASE WHEN ... THEN ... ELSE ... END conditional logic 
    ```sql
      select  
        sum(case when gender = 'M' then 1 end) as male_count, 
        sum(case when gender = 'F' then 1 end) as female_count  
        from patients;
    ```

- IF(expr, true, false) shorthand in MySQL. 

- IFNULL(a,b), NULLIF(a,b) null handling.

---
---

# 9. Common Functions 

- String: CONCAT()  
    the CONCAT function in some SQL dialects but uses || as the concatenation operator.) 

    In MySQL, you can’t use + to concatenate strings. Use CONCAT() instead. 

    Correct query: 
    ```sql
    SELECT CONCAT(UPPER(last_name), ',', LOWER(first_name)) AS full_name 
    FROM patients 
    ORDER BY first_name DESC; 
    ```
- REPLACE(), LENGTH(). 

- Numeric: ROUND(), CEIL(), FLOOR(). 

- Date/Time: NOW(), CURDATE(), DATEDIFF(), DATE_ADD().

---
---

# 10. Permissions & Transactions 

GRANT SELECT, INSERT ON db.table TO 'user'; 
REVOKE UPDATE ON db.table FROM 'user'; 
START TRANSACTION; 
UPDATE accounts SET balance = balance - 100 WHERE id = 1; 
UPDATE accounts SET balance = balance + 100 WHERE id = 2; 
COMMIT;

---
---

# 11. Joins & unions: 

## 🔗 JOINS

**Purpose:** Combine rows from two or more tables based on related columns.



### **Types of Joins**

| Type         | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| `INNER JOIN` | Returns matching rows from both tables.                                 |
| `LEFT JOIN`  | Returns all rows from the **left** table + matched rows from the right. |
| `RIGHT JOIN` | Returns all rows from the **right** table + matched rows from the left. |
| `FULL JOIN`  | Returns all rows from both tables, matched or not.                      |
| `CROSS JOIN` | Produces the Cartesian product (all combinations of both tables).       |
| `SELF JOIN`  | A table is joined to itself using aliases.                              |



### 💡 Performance Tip:

> JOINs are usually faster because they let the database **optimize data retrieval using indexes** and avoid repeated subquery executions.

**However**, subqueries may perform well when:

* Using **non-correlated subqueries**
* Doing **existence checks** (`EXISTS`)
* Filtering **aggregates**

🧪 Always **test and analyze query plans**, since performance depends on:

* Data size
* Indexes
* The database engine’s optimizer



### 🔁 Alternative Join Syntax

```sql
SELECT first_name, last_name, COUNT(*)
FROM doctors p, admissions a
WHERE a.attending_doctor_id = p.doctor_id
GROUP BY p.doctor_id;
```



### 🧬 Multi-Table Join Strategy

> To join multiple tables:
> Use **JOIN clauses one after another** with **ON conditions** linking related keys.

For example:
If **B** is the common link between **A** and **C**, use:

```sql
SELECT ...
FROM B
JOIN A ON ...
JOIN C ON ...
```



## 📚 UNIONS

**Purpose:** Combine result sets from multiple `SELECT` statements.



### Types:

| Keyword     | Description                               |
| ----------- | ----------------------------------------- |
| `UNION`     | Merges results and **removes duplicates** |
| `UNION ALL` | Merges results **including duplicates**   |


## 🧠 CTE – Common Table Expression

**Definition:**
A CTE is a temporary, named result set defined using `WITH`.
It helps break down complex queries into readable blocks.

### ✅ Benefits:

* Improves **readability**
* Supports **reusability**
* Avoids **deep nesting** of subqueries



### 📌 Example:

Get patients with Epilepsy whose doctor is Lisa

```sql
WITH epilepsy_patients AS (
  SELECT a.patient_id, p.first_name, p.last_name, a.attending_doctor_id
  FROM patients p
  JOIN admissions a ON p.patient_id = a.patient_id
  WHERE a.diagnosis = 'Epilepsy'
)
SELECT ep.patient_id, ep.first_name, ep.last_name, d.specialty
FROM epilepsy_patients ep
JOIN doctors d ON ep.attending_doctor_id = d.doctor_id
WHERE d.first_name = 'Lisa';
```

---
---

# 11. Confused Notes

You've gathered an *excellent*, dense collection of SQL concept notes — well done! 👏
Below is a **cleaned-up, categorized, and structured version** of your **Confusion Notes**, keeping everything intact while improving readability and memorization:

---

## 🧹 **Data Modification Commands**

| Command    | Purpose                                                               |
| ---------- | --------------------------------------------------------------------- |
| `DELETE`   | Removes selected rows (can have `WHERE`), rollbackable, logged.       |
| `TRUNCATE` | Removes all rows, **no WHERE**, faster, not rollbackable in many DBs. |
| `DROP`     | Deletes the entire table structure (schema + data).                   |

---

## 🧾 **Insert vs Update**

* `INSERT`: Adds new rows to a table.
* `UPDATE`: Modifies existing rows based on condition.

---

## 🔑 **Primary Key vs Foreign Key**

| Constraint      | Duplicates | Nulls | Use Case                                |
| --------------- | ---------- | ----- | --------------------------------------- |
| **Primary Key** | ❌ No       | ❌ No  | Uniquely identifies each row            |
| **Foreign Key** | ✅ Yes      | ✅ Yes | References primary key in another table |

🧠 *Example:*

* `Customers.customer_id`: **Primary key** → unique.
* `Orders.customer_id`: **Foreign key** → can repeat.

---

## 📊 **Group By, Aggregation, and Logical Execution Order**

🧮 **Important Execution Order (behind the scenes):**

1. `FROM`
2. `JOIN`
3. `WHERE`
4. `GROUP BY`
5. `HAVING`
6. `SELECT`
7. `ORDER BY`
8. `LIMIT`

> 🔍 **Logical evaluation differs from writing order**. For example:

```sql
SELECT FLOOR(weight / 10) * 10 AS weight_group, COUNT(*)
FROM patients
GROUP BY FLOOR(weight / 10) * 10;
```

* `FLOOR(weight / 10) * 10` is computed before `GROUP BY` despite appearing in `SELECT`.

---

## 🎛 **Where vs Having**

| Clause   | Filters...              | Can use aggregates? |
| -------- | ----------------------- | ------------------- |
| `WHERE`  | Before grouping (rows)  | ❌ No                |
| `HAVING` | After grouping (groups) | ✅ Yes               |

---

## ⚖ **Integer Division & Casting**

* `175 / 100` = `1` (integer division)
* `175 / 100.0` = `1.75` (decimal)
* Use `CAST(height AS FLOAT)` or divide by `100.0` for BMI.

---

## 👥 **Gender Counts — Multiple Methods**

```sql
SELECT  
  (SELECT COUNT(*) FROM patients WHERE gender='M') AS male_count,  
  (SELECT COUNT(*) FROM patients WHERE gender='F') AS female_count;

SELECT  
  SUM(gender = 'M') AS male_count,  
  SUM(gender = 'F') AS female_count  
FROM patients;

SELECT  
  SUM(CASE WHEN gender = 'M' THEN 1 END) AS male_count,  
  SUM(CASE WHEN gender = 'F' THEN 1 END) AS female_count  
FROM patients;
```

---

## 📌 **Miscellaneous Important Notes**

* `COUNT()` **never returns NULL**.

* `WHERE allergies IS NOT NULL` should be before `GROUP BY`; otherwise, use `HAVING`.

* Default value in `SELECT`:

```sql
SELECT first_name, last_name, 'Doctor' AS role FROM doctors;
```

---

## 🔍 **Query Examples**

### ➤ **Most recent admission for patient 542:**

```sql
SELECT *
FROM admissions
WHERE patient_id = 542
ORDER BY admission_date DESC
LIMIT 1;
```

### ➤ **Duplicates by name:**

```sql
SELECT first_name, last_name, COUNT(*) AS duplicate_count
FROM patients
GROUP BY first_name, last_name
HAVING COUNT(*) > 1;
```

### ➤ **Patients not in admissions:**

```sql
SELECT p.patient_id, p.first_name, p.last_name
FROM patients p
LEFT JOIN admissions a ON p.patient_id = a.patient_id
WHERE a.patient_id IS NULL;
```

### ➤ **Ontario always first in province list:**

```sql
SELECT name
FROM provinces
ORDER BY (name != 'Ontario'), name ASC;
```

---

## 🧠 **DISTINCT Note**

* `DISTINCT` applies to **entire rows**, not individual columns.

---

## 🔄 **Join Alternatives**

You can **omit `JOIN` clause** and use `WHERE`:

```sql
SELECT ...
FROM table1 t1, table2 t2
WHERE t1.id = t2.id;
```

But without `ON`, an `INNER JOIN` becomes a **CROSS JOIN**, and `WHERE` acts as the join condition.

---

## 📐 **Efficiency Tips**

1. Joins
2. Non-correlated subqueries
3. Correlated subqueries

---

## 🔍 **Window Functions Review**

### ➤ **ROW\_NUMBER():**

Assigns a unique rank per row, e.g., for sequencing:

```sql
ROW_NUMBER() OVER (ORDER BY id) AS row_num
```

### ➤ **PARTITION BY vs GROUP BY:**

| Feature     | GROUP BY                  | PARTITION BY                    |
| ----------- | ------------------------- | ------------------------------- |
| Output Rows | Reduces (1 row per group) | Maintains original row count    |
| Aggregates  | Required                  | Optional with window functions  |
| Usage       | SUM, COUNT                | RANK, ROW\_NUMBER, FIRST\_VALUE |

---

## ⏳ **Null Rules Summary**

* NULL means "unknown"
* NULL = anything → NULL (false in `WHERE`)
* Use `IS NULL` or `IS NOT NULL`
* `NULL < 1000` → FALSE
* In expressions: `NULL + 1` = NULL

---

## 📅 **Date Comparisons**

### ➤ **Compare with previous day:**

```sql
ON w1.recordDate = w2.recordDate + INTERVAL 1 DAY
```

First row will yield `NULL`, thus excluded automatically in WHERE.

---

## 🧨 **Nested Aggregates?**

* ❌ You **cannot use aggregate functions inside another aggregate** (like `SUM(MAX(...))`).

---
---

## Structure:
1. **Basic Structure** - PL/SQL block anatomy
2. **Data Types** - Scalar, composite, and reference types
3. **Control Structures** - Conditions, loops, and control flow
4. **Cursors** - Implicit, explicit, and REF cursors
5. **Procedures & Functions** - Subprograms and parameter modes
6. **Packages** - Modular programming
7. **Exception Handling** - Error management
8. **Triggers** - Event-driven programming
9. **Built-in Packages** - Oracle utilities and functions

# PL/SQL (Procedural Language) - Complete Notes

---

## 📚 What is PL/SQL?

**PL/SQL** stands for **Procedural Language/Structured Query Language**. It's Oracle's procedural extension to SQL that combines:
- **SQL statements** for database operations
- **Procedural constructs** like loops, conditions, variables
- **Error handling** mechanisms
- **Modular programming** with procedures, functions, packages

PL/SQL allows application logic to be stored in the database itself, bringing optimal efficiency since both PL/SQL and SQL run within the same server process.

---

## 🏗️ Basic Structure of PL/SQL Block

```sql
DECLARE
    -- Declaration section (optional)
    variable_name datatype [NOT NULL] [:= initial_value];
BEGIN
    -- Execution section (mandatory)
    -- PL/SQL and SQL statements
EXCEPTION
    -- Exception handling section (optional)
    WHEN exception_name THEN
        -- Handle exception
END;
/
```

### ✅ Example:
```sql
DECLARE
    v_message VARCHAR2(50) := 'Hello, PL/SQL!';
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM employees;
    DBMS_OUTPUT.PUT_LINE(v_message || ' Total employees: ' || v_count);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('No data found');
END;
/
```

---

## 🧮 Data Types in PL/SQL

### 🔹 **Scalar Data Types**

| Type | Description | Size/Range | Example |
|------|-------------|------------|---------|
| `NUMBER` | Numeric values | 38 digits precision | `v_salary NUMBER(8,2);` |
| `INTEGER` | Whole numbers | -2^31 to 2^31-1 | `v_count INTEGER;` |
| `VARCHAR2` | Variable-length strings | 1 to 32767 bytes | `v_name VARCHAR2(50);` |
| `CHAR` | Fixed-length strings | 1 to 32767 bytes | `v_code CHAR(5);` |
| `DATE` | Date and time | Jan 1, 4712 BC to Dec 31, 9999 AD | `v_hire_date DATE;` |
| `TIMESTAMP` | Date with fractional seconds | More precise than DATE | `v_time TIMESTAMP;` |
| `BOOLEAN` | True/False/NULL | TRUE, FALSE, NULL | `v_flag BOOLEAN := TRUE;` |
| `CLOB` | Character Large Object | Up to 128 TB | `v_description CLOB;` |
| `BLOB` | Binary Large Object | Up to 128 TB | `v_image BLOB;` |

### 🔸 **Composite Data Types**

| Type | Description | Example |
|------|-------------|---------|
| **Records** | Custom structured data | `TYPE emp_record_type IS RECORD (name VARCHAR2(50), salary NUMBER);` |
| **Associative Arrays** | Index-by tables | `TYPE name_array IS TABLE OF VARCHAR2(50) INDEX BY BINARY_INTEGER;` |
| **Nested Tables** | Unbounded arrays | `TYPE num_table IS TABLE OF NUMBER;` |
| **VARRAYs** | Bounded arrays | `TYPE score_array IS VARRAY(5) OF NUMBER;` |

### 🔸 **Reference Data Types**

| Type | Description | Example |
|------|-------------|---------|
| `%TYPE` | Inherits column datatype | `v_emp_name employees.first_name%TYPE;` |
| `%ROWTYPE` | Inherits entire row structure | `v_employee employees%ROWTYPE;` |

### ✅ Example:
```sql
DECLARE
    -- Scalar types
    v_salary NUMBER(8,2) := 50000.00;
    v_name VARCHAR2(50) := 'John Doe';
    v_flag BOOLEAN := TRUE;
    
    -- Reference types
    v_emp_name employees.first_name%TYPE;
    v_employee employees%ROWTYPE;
    
    -- Record type
    TYPE emp_record_type IS RECORD (
        emp_id NUMBER,
        emp_name VARCHAR2(100),
        emp_salary NUMBER
    );
    v_emp_rec emp_record_type;
BEGIN
    v_emp_rec.emp_id := 100;
    v_emp_rec.emp_name := v_name;
    v_emp_rec.emp_salary := v_salary;
    
    DBMS_OUTPUT.PUT_LINE('Employee: ' || v_emp_rec.emp_name || 
                        ', Salary: ' || v_emp_rec.emp_salary);
END;
/
```

---

## 🔄 Control Structures

### 🔹 **Conditional Statements**

| Type | Syntax | Use Case |
|------|--------|----------|
| **IF-THEN-ELSE** | `IF condition THEN statements ELSIF condition THEN statements ELSE statements END IF;` | Multiple conditions |
| **CASE** | `CASE variable WHEN value THEN result ELSE result END CASE;` | Multiple discrete values |
| **Searched CASE** | `CASE WHEN condition THEN result WHEN condition THEN result ELSE result END CASE;` | Complex conditions |

### 🔸 **Loop Statements**

| Type | Syntax | Use Case |
|------|--------|----------|
| **Basic LOOP** | `LOOP statements EXIT WHEN condition; END LOOP;` | Indefinite loops with exit condition |
| **WHILE LOOP** | `WHILE condition LOOP statements END LOOP;` | Condition-based loops |
| **FOR LOOP (Numeric)** | `FOR i IN 1..10 LOOP statements END LOOP;` | Fixed range iterations |
| **FOR LOOP (Cursor)** | `FOR record IN cursor LOOP statements END LOOP;` | Iterate through query results |

### 🔸 **Control Transfer**

| Statement | Description | Example |
|-----------|-------------|---------|
| `EXIT` | Exit from loop | `EXIT WHEN counter > 10;` |
| `CONTINUE` | Skip current iteration | `CONTINUE WHEN value IS NULL;` |
| `GOTO` | Jump to labeled statement | `GOTO end_process;` |
| `RETURN` | Exit from subprogram | `RETURN result_value;` |

### ✅ Example:
```sql
DECLARE
    v_grade CHAR(1) := 'B';
    v_counter NUMBER := 1;
    v_result VARCHAR2(20);
BEGIN
    -- CASE statement
    CASE v_grade
        WHEN 'A' THEN v_result := 'Excellent';
        WHEN 'B' THEN v_result := 'Good';
        WHEN 'C' THEN v_result := 'Average';
        ELSE v_result := 'Needs Improvement';
    END CASE;
    
    DBMS_OUTPUT.PUT_LINE('Grade Result: ' || v_result);
    
    -- FOR LOOP
    FOR i IN 1..5 LOOP
        DBMS_OUTPUT.PUT_LINE('Loop iteration: ' || i);
    END LOOP;
END;
/
```

---

## 🗃️ Cursors

### 🔹 **Types of Cursors**

| Type | Description | Usage |
|------|-------------|-------|
| **Implicit Cursors** | Automatically created by Oracle | `SELECT INTO`, `INSERT`, `UPDATE`, `DELETE` |
| **Explicit Cursors** | User-defined cursors | Complex queries, row-by-row processing |
| **REF Cursors** | Cursor variables | Dynamic queries, returning cursors from functions |

### 🔸 **Cursor Attributes**

| Attribute | Description | Returns |
|-----------|-------------|---------|
| `%FOUND` | Was a row fetched? | TRUE/FALSE |
| `%NOTFOUND` | No row fetched? | TRUE/FALSE |
| `%ISOPEN` | Is cursor open? | TRUE/FALSE |
| `%ROWCOUNT` | Number of rows fetched | NUMBER |

### 🔸 **Cursor Operations**

| Operation | Syntax | Purpose |
|-----------|--------|---------|
| **Declaration** | `CURSOR cursor_name IS SELECT ...;` | Define cursor |
| **Open** | `OPEN cursor_name;` | Execute query and identify result set |
| **Fetch** | `FETCH cursor_name INTO variables;` | Retrieve one row |
| **Close** | `CLOSE cursor_name;` | Release resources |

### ✅ Example:
```sql
DECLARE
    CURSOR emp_cursor IS
        SELECT employee_id, first_name, salary
        FROM employees
        WHERE department_id = 50;
    
    v_emp_id employees.employee_id%TYPE;
    v_emp_name employees.first_name%TYPE;
    v_emp_salary employees.salary%TYPE;
BEGIN
    OPEN emp_cursor;
    
    LOOP
        FETCH emp_cursor INTO v_emp_id, v_emp_name, v_emp_salary;
        EXIT WHEN emp_cursor%NOTFOUND;
        
        DBMS_OUTPUT.PUT_LINE('ID: ' || v_emp_id || 
                           ', Name: ' || v_emp_name || 
                           ', Salary: ' || v_emp_salary);
    END LOOP;
    
    DBMS_OUTPUT.PUT_LINE('Total rows processed: ' || emp_cursor%ROWCOUNT);
    CLOSE emp_cursor;
END;
/
```

---

## 🔧 Procedures & Functions

### 🔹 **Procedures**

| Feature | Description | Example |
|---------|-------------|---------|
| **Purpose** | Perform actions, no return value | Data manipulation, business logic |
| **Creation** | `CREATE OR REPLACE PROCEDURE name IS BEGIN ... END;` | Reusable code blocks |
| **Execution** | `EXEC procedure_name;` or `BEGIN procedure_name; END;` | Call from SQL or PL/SQL |

### 🔸 **Functions**

| Feature | Description | Example |
|---------|-------------|---------|
| **Purpose** | Perform calculations, return single value | Computations, data transformation |
| **Creation** | `CREATE OR REPLACE FUNCTION name RETURN datatype IS BEGIN ... RETURN value; END;` | Reusable expressions |
| **Usage** | Can be used in SQL SELECT statements | `SELECT function_name(param) FROM table;` |

### 🔸 **Parameter Modes**

| Mode | Description | Usage |
|------|-------------|-------|
| **IN** | Input parameter (default) | Pass values to subprogram |
| **OUT** | Output parameter | Return values from subprogram |
| **IN OUT** | Both input and output | Modify and return values |

### 🔸 **Subprogram Components**

| Component | Description | Required |
|-----------|-------------|----------|
| **Header** | Name, parameters, return type (functions) | Yes |
| **Declaration** | Local variables, cursors, exceptions | Optional |
| **Body** | Executable statements | Yes |
| **Exception** | Error handling | Optional |

### ✅ Example:
```sql
-- Function
CREATE OR REPLACE FUNCTION get_employee_bonus(p_emp_id NUMBER)
RETURN NUMBER
IS
    v_salary NUMBER;
    v_bonus NUMBER;
BEGIN
    SELECT salary INTO v_salary 
    FROM employees 
    WHERE employee_id = p_emp_id;
    
    v_bonus := v_salary * 0.15;  -- 15% bonus
    RETURN v_bonus;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 0;
END;
/

-- Procedure
CREATE OR REPLACE PROCEDURE update_employee_salary(
    p_emp_id IN NUMBER,
    p_percentage IN NUMBER,
    p_new_salary OUT NUMBER
)
IS
BEGIN
    UPDATE employees 
    SET salary = salary * (1 + p_percentage/100)
    WHERE employee_id = p_emp_id;
    
    SELECT salary INTO p_new_salary 
    FROM employees 
    WHERE employee_id = p_emp_id;
    
    COMMIT;
END;
/
```

---

## 📦 Packages

### 🔹 **Package Components**

| Component | Description | Required |
|-----------|-------------|----------|
| **Package Specification** | Public interface (header) | Yes |
| **Package Body** | Implementation of specification | Optional (if no subprograms) |

### 🔸 **Package Benefits**

| Benefit | Description | Example |
|---------|-------------|---------|
| **Modularity** | Group related functionality | Employee management package |
| **Encapsulation** | Hide implementation details | Private variables and procedures |
| **Performance** | Loaded into memory as unit | Faster execution |
| **Namespace** | Avoid naming conflicts | `pkg1.procedure1` vs `pkg2.procedure1` |

### 🔸 **Package Elements**

| Element | Visibility | Usage |
|---------|------------|-------|
| **Public** | Declared in specification | Accessible from outside package |
| **Private** | Declared only in body | Internal package use only |
| **Global** | Package-level variables | Persist for session duration |

### ✅ Example:
```sql
-- Package Specification
CREATE OR REPLACE PACKAGE emp_utils
IS
    -- Public constant
    c_max_salary CONSTANT NUMBER := 100000;
    
    -- Public procedure
    PROCEDURE give_raise(p_emp_id NUMBER, p_percentage NUMBER);
    
    -- Public function
    FUNCTION get_annual_salary(p_emp_id NUMBER) RETURN NUMBER;
END emp_utils;
/

-- Package Body
CREATE OR REPLACE PACKAGE BODY emp_utils
IS
    -- Private variable
    g_last_raise_date DATE;
    
    PROCEDURE give_raise(p_emp_id NUMBER, p_percentage NUMBER)
    IS
    BEGIN
        UPDATE employees 
        SET salary = salary * (1 + p_percentage/100)
        WHERE employee_id = p_emp_id;
        
        g_last_raise_date := SYSDATE;
        COMMIT;
    END;
    
    FUNCTION get_annual_salary(p_emp_id NUMBER) RETURN NUMBER
    IS
        v_monthly_salary NUMBER;
    BEGIN
        SELECT salary INTO v_monthly_salary 
        FROM employees 
        WHERE employee_id = p_emp_id;
        
        RETURN v_monthly_salary * 12;
    END;
END emp_utils;
/
```

---

## ⚠️ Exception Handling

### 🔹 **Types of Exceptions**

| Type | Description | Examples |
|------|-------------|----------|
| **System-defined** | Predefined by Oracle | `NO_DATA_FOUND`, `TOO_MANY_ROWS`, `ZERO_DIVIDE` |
| **User-defined** | Declared by programmer | Custom business rule violations |
| **Application** | Raised using `RAISE_APPLICATION_ERROR` | Error codes -20000 to -20999 |

### 🔸 **Common System Exceptions**

| Exception | Error Code | Description |
|-----------|------------|-------------|
| `NO_DATA_FOUND` | ORA-01403 | SELECT INTO returns no rows |
| `TOO_MANY_ROWS` | ORA-01422 | SELECT INTO returns multiple rows |
| `ZERO_DIVIDE` | ORA-01476 | Division by zero |
| `VALUE_ERROR` | ORA-06502 | Conversion or size error |
| `DUP_VAL_ON_INDEX` | ORA-00001 | Unique constraint violation |
| `INVALID_CURSOR` | ORA-01001 | Cursor operation on closed cursor |

### 🔸 **Exception Handling Syntax**

| Construct | Syntax | Purpose |
|-----------|--------|---------|
| **Exception Block** | `EXCEPTION WHEN exception_name THEN statements` | Handle specific exceptions |
| **OTHERS Handler** | `WHEN OTHERS THEN statements` | Handle any unhandled exception |
| **RAISE** | `RAISE exception_name;` | Explicitly raise an exception |
| **RAISE_APPLICATION_ERROR** | `RAISE_APPLICATION_ERROR(-20001, 'message');` | Raise custom error |

### ✅ Example:
```sql
DECLARE
    v_emp_name VARCHAR2(50);
    v_salary NUMBER;
    custom_exception EXCEPTION;
BEGIN
    SELECT first_name, salary 
    INTO v_emp_name, v_salary 
    FROM employees 
    WHERE employee_id = 999;  -- Non-existent employee
    
    IF v_salary < 0 THEN
        RAISE custom_exception;
    END IF;
    
    DBMS_OUTPUT.PUT_LINE('Employee: ' || v_emp_name);
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Employee not found');
    WHEN custom_exception THEN
        DBMS_OUTPUT.PUT_LINE('Invalid salary detected');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        RAISE;  -- Re-raise the exception
END;
/
```

---

## 🎯 Triggers

### 🔹 **Types of Triggers**

| Type | Timing | Events | Usage |
|------|--------|--------|-------|
| **DML Triggers** | BEFORE/AFTER/INSTEAD OF | INSERT/UPDATE/DELETE | Data validation, auditing |
| **DDL Triggers** | BEFORE/AFTER | CREATE/ALTER/DROP | Schema change tracking |
| **System Triggers** | BEFORE/AFTER | LOGON/LOGOFF/STARTUP/SHUTDOWN | Security, monitoring |

### 🔸 **Trigger Timing**

| Timing | Description | Use Case |
|--------|-------------|----------|
| **BEFORE** | Fires before triggering event | Data validation, value modification |
| **AFTER** | Fires after triggering event | Auditing, logging, cascade operations |
| **INSTEAD OF** | Replaces triggering event | Operations on views |

### 🔸 **Trigger Levels**

| Level | Description | Access to Data |
|-------|-------------|----------------|
| **Row-level** | Fires once per affected row | `:NEW` and `:OLD` values |
| **Statement-level** | Fires once per SQL statement | No access to row data |

### 🔸 **Trigger Predicates**

| Predicate | Description | Usage |
|-----------|-------------|-------|
| **INSERTING** | TRUE during INSERT | `IF INSERTING THEN ...` |
| **UPDATING** | TRUE during UPDATE | `IF UPDATING('column') THEN ...` |
| **DELETING** | TRUE during DELETE | `IF DELETING THEN ...` |

### ✅ Example:
```sql
CREATE OR REPLACE TRIGGER emp_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON employees
    FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO emp_audit (action, emp_id, old_salary, new_salary, change_date)
        VALUES ('INSERT', :NEW.employee_id, NULL, :NEW.salary, SYSDATE);
    ELSIF UPDATING THEN
        INSERT INTO emp_audit (action, emp_id, old_salary, new_salary, change_date)
        VALUES ('UPDATE', :NEW.employee_id, :OLD.salary, :NEW.salary, SYSDATE);
    ELSIF DELETING THEN
        INSERT INTO emp_audit (action, emp_id, old_salary, new_salary, change_date)
        VALUES ('DELETE', :OLD.employee_id, :OLD.salary, NULL, SYSDATE);
    END IF;
END;
/
```

---

## 🔌 Built-in Packages & Functions

### 🔹 **Common Built-in Packages**

| Package | Purpose | Key Procedures/Functions |
|---------|---------|-------------------------|
| **DBMS_OUTPUT** | Display output | `PUT_LINE`, `PUT`, `NEW_LINE` |
| **DBMS_SQL** | Dynamic SQL | `OPEN_CURSOR`, `PARSE`, `EXECUTE` |
| **UTL_FILE** | File I/O operations | `FOPEN`, `PUT_LINE`, `FCLOSE` |
| **DBMS_JOB** | Job scheduling | `SUBMIT`, `RUN`, `REMOVE` |
| **DBMS_RANDOM** | Random number generation | `VALUE`, `STRING`, `SEED` |

### 🔸 **String Functions**

| Function | Description | Example |
|----------|-------------|---------|
| `SUBSTR` | Extract substring | `SUBSTR('Hello', 2, 3)` → 'ell' |
| `INSTR` | Find substring position | `INSTR('Hello', 'l')` → 3 |
| `LENGTH` | String length | `LENGTH('Hello')` → 5 |
| `UPPER/LOWER` | Case conversion | `UPPER('hello')` → 'HELLO' |
| `TRIM/LTRIM/RTRIM` | Remove spaces | `TRIM(' Hello ')` → 'Hello' |

### 🔸 **Date Functions**

| Function | Description | Example |
|----------|-------------|---------|
| `SYSDATE` | Current date/time | `SYSDATE` |
| `ADD_MONTHS` | Add months to date | `ADD_MONTHS(SYSDATE, 6)` |
| `MONTHS_BETWEEN` | Months between dates | `MONTHS_BETWEEN(date1, date2)` |
| `TO_DATE` | Convert string to date | `TO_DATE('2023-12-25', 'YYYY-MM-DD')` |
| `TO_CHAR` | Format date as string | `TO_CHAR(SYSDATE, 'DD-MON-YYYY')` |

### 🔸 **Conversion Functions**

| Function | Description | Example |
|----------|-------------|---------|
| `TO_NUMBER` | Convert to number | `TO_NUMBER('123.45')` |
| `TO_CHAR` | Convert to string | `TO_CHAR(12345)` |
| `CAST` | Generic conversion | `CAST('123' AS NUMBER)` |
| `NVL` | Handle NULL values | `NVL(salary, 0)` |
| `DECODE` | Conditional logic | `DECODE(grade, 'A', 'Excellent', 'Good')` |

### ✅ Example:
```sql
DECLARE
    v_text VARCHAR2(100) := '  Hello PL/SQL World  ';
    v_date DATE := SYSDATE;
    v_number VARCHAR2(10) := '12345';
BEGIN
    -- String functions
    DBMS_OUTPUT.PUT_LINE('Original: [' || v_text || ']');
    DBMS_OUTPUT.PUT_LINE('Trimmed: [' || TRIM(v_text) || ']');
    DBMS_OUTPUT.PUT_LINE('Upper: ' || UPPER(TRIM(v_text)));
    DBMS_OUTPUT.PUT_LINE('Length: ' || LENGTH(TRIM(v_text)));
    
    -- Date functions
    DBMS_OUTPUT.PUT_LINE('Current Date: ' || TO_CHAR(v_date, 'DD-MON-YYYY HH24:MI:SS'));
    DBMS_OUTPUT.PUT_LINE('Next Month: ' || TO_CHAR(ADD_MONTHS(v_date, 1), 'DD-MON-YYYY'));
    
    -- Conversion functions
    DBMS_OUTPUT.PUT_LINE('String to Number: ' || TO_NUMBER(v_number) * 2);
END;
/
```

---

## 💡 Best Practices & Tips

### 🔹 **Naming Conventions**

| Element | Convention | Example |
|---------|------------|---------|
| **Variables** | v_name | `v_employee_id`, `v_salary` |
| **Constants** | c_name | `c_tax_rate`, `c_max_attempts` |
| **Parameters** | p_name | `p_emp_id`, `p_department` |
| **Cursors** | name_cur | `emp_cur`, `dept_cursor` |
| **Exceptions** | name_exception | `invalid_salary_exception` |

### 🔸 **Performance Tips**

| Tip | Description | Example |
|-----|-------------|---------|
| **Use BULK COLLECT** | Process multiple rows at once | `BULK COLLECT INTO collection` |
| **Limit cursor loops** | Use `LIMIT` clause | `FETCH cur BULK COLLECT INTO arr LIMIT 1000` |
| **Use bind variables** | Avoid hard-coded values | Use parameters instead of literals |
| **Close cursors** | Free resources | Always `CLOSE cursor_name` |
| **Use %TYPE/%ROWTYPE** | Maintain data consistency | Inherit column datatypes |

### 🔸 **Security Best Practices**

| Practice | Description | Implementation |
|----------|-------------|----------------|
| **Input validation** | Validate all inputs | Check ranges, formats, nulls |
| **Exception handling** | Handle all exceptions | Use WHEN OTHERS sparingly |
| **Privilege management** | Grant minimum required | Use DEFINER/INVOKER rights |
| **SQL injection prevention** | Use bind variables | Avoid dynamic SQL with concatenation |

---

## 🔍 Quick Reference

### **PL/SQL Block Types**
- **Anonymous Block**: Unnamed, executed immediately
- **Named Block**: Stored procedures, functions, packages
- **Trigger**: Special block that fires automatically

### **Execution Commands**
```sql
-- Execute anonymous block
BEGIN ... END; /

-- Execute procedure
EXEC procedure_name(parameters);

-- Execute function
SELECT function_name(parameters) FROM dual;

-- Show output
SET SERVEROUTPUT ON;
```

### **Common Patterns**
```sql
-- Exception handling template
BEGIN
    -- code
EXCEPTION
    WHEN specific_exception THEN
        -- handle specific
    WHEN OTHERS THEN
        -- handle generic
        RAISE; -- re-raise if needed
END;

-- Cursor loop template
FOR record IN cursor LOOP
    -- process record
END LOOP;

-- Parameter validation template
IF parameter IS NULL THEN
    RAISE_APPLICATION_ERROR(-20001, 'Parameter cannot be null');
END IF;
```
