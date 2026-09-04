/**
 * The database SQL practice questions run against.
 *
 * SQLite rather than MySQL, because this executes in the student's browser
 * with no server behind it — which is the only way an in-page playground can
 * be free, instant and impossible to abuse. The schema and data match the
 * `training` database in the course notes, so a query written here works
 * unchanged in MySQL Workbench.
 *
 * The rows are deliberately awkward: a student with no course, a course with
 * no students, a missing mark and a tied mark. Without those, LEFT JOIN,
 * NULL handling and RANK vs DENSE_RANK have nothing to demonstrate.
 */
export const PRACTICE_SCHEMA = `
CREATE TABLE courses (
  course_id     INTEGER PRIMARY KEY,
  course_name   TEXT NOT NULL,
  duration_days INTEGER,
  fee           INTEGER
);

CREATE TABLE students (
  student_id INTEGER PRIMARY KEY,
  name       TEXT NOT NULL,
  city       TEXT,
  age        INTEGER,
  course_id  INTEGER REFERENCES courses(course_id),
  marks      INTEGER,
  joined_on  TEXT
);

CREATE TABLE employees (
  emp_id     INTEGER PRIMARY KEY,
  emp_name   TEXT,
  manager_id INTEGER,
  salary     INTEGER,
  department TEXT
);

CREATE TABLE payments (
  payment_id INTEGER PRIMARY KEY,
  student_id INTEGER REFERENCES students(student_id),
  amount     INTEGER,
  paid_on    TEXT,
  method     TEXT
);

INSERT INTO courses VALUES
  (1,'Python',45,15000),
  (2,'SQL',30,10000),
  (3,'Java',60,20000),
  (4,'Data Science',90,25000),
  (5,'Cloud',30,18000);

INSERT INTO students VALUES
  (101,'Rahul Verma','Bengaluru',21,1,78,'2025-01-15'),
  (102,'Anita Sharma','Chennai',22,2,95,'2025-01-20'),
  (103,'Karan Patel','Bengaluru',20,1,38,'2025-02-01'),
  (104,'Priya Nair','Kochi',23,3,66,'2025-02-10'),
  (105,'Vikram Rao','Bengaluru',21,2,81,'2025-03-05'),
  (106,'Sneha Iyer','Chennai',22,3,54,'2025-03-12'),
  (107,'Arjun Mehta','Pune',24,4,90,'2025-04-02'),
  (108,'Divya Menon','Kochi',20,1,45,'2025-04-18'),
  (109,'Rohit Sinha','Pune',23,NULL,78,'2025-05-01'),
  (110,'Meera Nair','Chennai',21,4,NULL,'2025-05-20'),
  (111,'Aisha Khan','Bengaluru',22,2,88,'2025-06-04'),
  (112,'Ananya Bose','Pune',25,4,72,'2025-06-19');

INSERT INTO employees VALUES
  (1,'Anil',NULL,90000,'Engineering'),
  (2,'Bhavna',1,70000,'Engineering'),
  (3,'Chetan',1,65000,'Marketing'),
  (4,'Deepa',2,50000,'Engineering'),
  (5,'Esha',2,52000,'Design');

INSERT INTO payments VALUES
  (1,101,15000,'2025-01-15','UPI'),
  (2,102,10000,'2025-01-21','Card'),
  (3,103,7500,'2025-02-02','UPI'),
  (4,104,20000,'2025-02-11','Bank transfer'),
  (5,105,10000,'2025-03-06','UPI'),
  (6,107,25000,'2025-04-03','Card'),
  (7,108,15000,'2025-04-19','UPI'),
  (8,111,10000,'2025-06-05','Card'),
  (9,112,12500,'2025-06-20','Bank transfer');
`;

/** Shown beside the editor so a student never has to guess column names. */
/**
 * The schema panel's model of the same tables.
 *
 * Typed per column rather than as one comma-joined string, so the panel can
 * show what the reference site shows — name on the left, type on the right —
 * and mark the keys. Kept beside the DDL above so the two cannot drift.
 */
export type PracticeColumn = {
  name: string;
  type: string;
  key?: "pk" | "fk";
};

export const PRACTICE_TABLES: {
  name: string;
  columns: PracticeColumn[];
}[] = [
  {
    name: "courses",
    columns: [
      { name: "course_id", type: "INT", key: "pk" },
      { name: "course_name", type: "TEXT" },
      { name: "duration_days", type: "INT" },
      { name: "fee", type: "INT" },
    ],
  },
  {
    name: "students",
    columns: [
      { name: "student_id", type: "INT", key: "pk" },
      { name: "name", type: "TEXT" },
      { name: "city", type: "TEXT" },
      { name: "age", type: "INT" },
      { name: "course_id", type: "INT", key: "fk" },
      { name: "marks", type: "INT" },
      { name: "joined_on", type: "DATE" },
    ],
  },
  {
    name: "employees",
    columns: [
      { name: "emp_id", type: "INT", key: "pk" },
      { name: "emp_name", type: "TEXT" },
      { name: "manager_id", type: "INT", key: "fk" },
      { name: "salary", type: "INT" },
      { name: "department", type: "TEXT" },
    ],
  },
  {
    name: "payments",
    columns: [
      { name: "payment_id", type: "INT", key: "pk" },
      { name: "student_id", type: "INT", key: "fk" },
      { name: "amount", type: "INT" },
      { name: "paid_on", type: "DATE" },
      { name: "method", type: "TEXT" },
    ],
  },
];
