#!/usr/bin/env python3
"""
Builds the SQL practice database and works out the answer to every question.

Two things come out of this file. `src/lib/practice-db.ts` is the hospital
database the student queries in the browser — schema, rows, and the model of
it that the schema panel draws. `content/sql-practice.sql` is the upsert that
puts the questions into Supabase, each carrying the grid its reference
solution produces.

The expectations are *computed*, never typed. Every solution here is executed
against the same database the browser will build, and whatever comes back is
what a student's query has to match. A hand-written expected output is a
second implementation of the question that can disagree with the first.

The data is generated from a fixed seed, so re-running this produces a
byte-identical database. Several questions need a particular thing to exist —
a patient whose surname is Maroni, exactly one patient matching the six
clues in the last question, a Dementia case seen by a doctor called Lisa —
and those are placed deliberately, then asserted at the end.

    python3 scripts/build_sql_practice.py
"""

from __future__ import annotations

import json
import random
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RNG = random.Random(20260908)

# ---------------------------------------------------------------------------
#  Reference data
# ---------------------------------------------------------------------------

PROVINCES = [
    ("ON", "Ontario", ["Toronto", "Ottawa", "Hamilton", "Kingston", "London", "Windsor"]),
    ("QC", "Quebec", ["Montreal", "Quebec City", "Laval", "Gatineau"]),
    ("BC", "British Columbia", ["Vancouver", "Victoria", "Kelowna", "Burnaby"]),
    ("AB", "Alberta", ["Calgary", "Edmonton", "Red Deer"]),
    ("MB", "Manitoba", ["Winnipeg", "Brandon"]),
    ("SK", "Saskatchewan", ["Regina", "Saskatoon"]),
    ("NS", "Nova Scotia", ["Halifax", "Sydney", "Truro", "Dartmouth"]),
    ("NB", "New Brunswick", ["Moncton", "Fredericton"]),
    ("NL", "Newfoundland and Labrador", ["St. Johns", "Corner Brook"]),
    ("PE", "Prince Edward Island", ["Charlottetown"]),
]
PROVINCE_WEIGHTS = [30, 16, 12, 10, 6, 5, 8, 5, 4, 4]

DOCTORS = [
    (1, "Nate", "Duncan", "Cardiologist"),
    (2, "Lisa", "Ridley", "Neurologist"),
    (3, "Harper", "Vance", "Paediatrician"),
    (4, "Omar", "Rahman", "Oncologist"),
    (5, "Rhea", "Kapoor", "Endocrinologist"),
    (6, "Callum", "Byrne", "Orthopaedic Surgeon"),
    (7, "Priya", "Menon", "Pulmonologist"),
    (8, "Marcus", "Okafor", "Nephrologist"),
    (9, "Ingrid", "Sorensen", "Rheumatologist"),
    (10, "Tomas", "Ricci", "Gastroenterologist"),
    (11, "Yuki", "Tanaka", "Dermatologist"),
    (12, "Farah", "Haddad", "Psychiatrist"),
    (13, "Ewan", "Marsh", "General Surgeon"),
    (14, "Nadia", "Petrov", "Haematologist"),
    (15, "Julian", "Ferreira", "Urologist"),
    (16, "Amara", "Boateng", "Immunologist"),
    (17, "Colin", "Whitfield", "Anaesthetist"),
    (18, "Sofia", "Aguilar", "Obstetrician"),
    (19, "Lisa", "Nakamura", "Geriatrician"),
    (20, "Devon", "Clarke", "Radiologist"),
    (21, "Mira", "Solberg", "Neurologist"),
]

FIRST_M = [
    "Aaron", "Adam", "Alan", "Andre", "Anton", "Arjun", "Blake", "Brandon", "Carlos",
    "Cecil", "Colin", "Conrad", "Curtis", "Damian", "Dennis", "Derek", "Dominic",
    "Edgar", "Elias", "Emmett", "Ernest", "Felix", "Gerald", "Gordon", "Grant",
    "Harold", "Hugo", "Ibrahim", "Isaac", "Ivan", "Jamal", "Jasper", "Julian",
    "Keith", "Kenneth", "Lawrence", "Leo", "Lucas", "Malcolm", "Marcus", "Martin",
    "Mohan", "Nathan", "Nolan", "Oliver", "Oscar", "Patrick", "Quentin", "Rafael",
    "Reuben", "Roland", "Rupert", "Samuel", "Sanders", "Simon", "Stavros", "Terrence",
    "Theodore", "Tobias", "Ulrich", "Victor", "Warren", "Xavier", "Yusuf", "Zachary",
]
FIRST_F = [
    "Abigail", "Adele", "Amara", "Annika", "Beatrice", "Bianca", "Camille", "Cara",
    "Carmen", "Cassandra", "Cecilia", "Charlotte", "Chloe", "Clara", "Colette",
    "Dahlia", "Delphine", "Diana", "Edith", "Eleanor", "Elena", "Esther", "Fatima",
    "Fiona", "Frances", "Genevieve", "Gloria", "Greta", "Harriet", "Helena", "Imogen",
    "Ingrid", "Irene", "Isabel", "Jasmine", "Josephine", "Juliet", "Karina", "Katrina",
    "Lara", "Leila", "Lorena", "Lucia", "Madeleine", "Margot", "Marisol", "Meredith",
    "Nadia", "Naomi", "Nora", "Odette", "Olivia", "Paloma", "Patricia", "Priya",
    "Rosalind", "Rowena", "Sabine", "Selena", "Sylvia", "Tamsin", "Theresa", "Ursula",
    "Valerie", "Vivienne", "Wilhelmina", "Yvonne", "Zara",
]
LAST = [
    "Abbott", "Ackerman", "Adler", "Almeida", "Ashford", "Bancroft", "Barlow", "Beaumont",
    "Bellamy", "Bishop", "Blackwood", "Brennan", "Cabrera", "Caldwell", "Carmichael",
    "Castellano", "Chandler", "Cortez", "Cunningham", "Dalton", "Devereux", "Donnelly",
    "Eastwood", "Ellsworth", "Fairbanks", "Falconer", "Fitzgerald", "Fontaine", "Gallagher",
    "Garrison", "Goodwin", "Grimaldi", "Hallowell", "Hargreaves", "Hawthorne", "Holloway",
    "Ibarra", "Ingram", "Jennings", "Kavanagh", "Kingsley", "Lachance", "Langford",
    "Lindqvist", "Lockhart", "Maroni", "Marchetti", "Mercier", "Montgomery", "Nakashima",
    "Norwood", "Okonkwo", "Pemberton", "Prescott", "Quintero", "Radcliffe", "Rasmussen",
    "Ravenscroft", "Rosenthal", "Sandoval", "Shackleton", "Sinclair", "Stromberg",
    "Thackeray", "Underwood", "Vandenberg", "Wainwright", "Whitmore", "Yoshida", "Zamora",
]

ALLERGIES = (
    [None] * 34
    + ["NKA"] * 22
    + ["Penicillin"] * 20
    + ["Morphine"] * 14
    + ["Peanuts"] * 12
    + ["Sulfa Drugs"] * 10
    + ["Latex"] * 9
    + ["Shellfish"] * 8
    + ["Ibuprofen"] * 7
    + ["Codeine"] * 6
    + ["Aspirin"] * 5
    + ["Bee Stings"] * 4
    + ["Iodine"] * 3
)

DIAGNOSES = [
    "Dementia", "Pneumonia", "Appendicitis", "Fractured Femur", "Asthma Attack",
    "Migraine", "Kidney Stones", "Type 2 Diabetes", "Hypertension", "Gallstones",
    "Sepsis", "Anaemia", "Bronchitis", "Cellulitis", "Atrial Fibrillation",
    "Concussion", "Deep Vein Thrombosis", "Gastroenteritis", "Hip Replacement",
    "Cataract Surgery",
]

# ---------------------------------------------------------------------------
#  Generating the patients
# ---------------------------------------------------------------------------

# Ids the questions name out loud, plus enough others to make an odd/even and
# a "three characters long" filter mean something.
FORCED_IDS = [1, 45, 534, 542, 579, 879, 1000]
PATIENT_COUNT = 220


def birth_date(rng: random.Random, year: int | None = None) -> str:
    y = year if year is not None else rng.choice(
        list(range(1948, 2016)) + list(range(1970, 1980)) * 2 + [2010] * 4
    )
    month = rng.randint(1, 12)
    day = rng.randint(1, 28)
    return f"{y:04d}-{month:02d}-{day:02d}"


def build_patients() -> list[tuple]:
    ids = set(FORCED_IDS)
    while len(ids) < PATIENT_COUNT:
        ids.add(RNG.randint(1, 1000))
    ids = sorted(ids)

    patients = []
    for pid in ids:
        gender = "M" if RNG.random() < 0.53 else "F"
        first = RNG.choice(FIRST_M if gender == "M" else FIRST_F)
        last = RNG.choice(LAST)
        province, _, cities = RNG.choices(PROVINCES, weights=PROVINCE_WEIGHTS)[0]
        city = RNG.choice(cities)
        height = RNG.randint(142, 196)
        weight = RNG.randint(41, 129)
        patients.append(
            [pid, first, last, gender, birth_date(RNG), city, province,
             RNG.choice(ALLERGIES), height, weight]
        )
    return patients


def by_id(patients, pid):
    for row in patients:
        if row[0] == pid:
            return row
    raise KeyError(pid)


def place_the_awkward_cases(patients: list[list]) -> None:
    """Everything a question names by hand, put where the question expects it."""
    index = {row[0]: row for row in patients}
    ids = sorted(index)

    # A surname to measure a weight spread across.
    for pid, weight in zip(ids[10:14], (58, 94, 71, 112)):
        index[pid][2] = "Maroni"
        index[pid][9] = weight

    # Two names that start and end with an s and are long enough to notice.
    index[ids[20]][1], index[ids[20]][3] = "Stavros", "M"
    index[ids[33]][1], index[ids[33]][3] = "Sanders", "M"

    # A pair of exact duplicates, for the "how many of you are there" question.
    for a, b in ((ids[40], ids[41]), (ids[60], ids[61])):
        index[b][1], index[b][2], index[b][3] = index[a][1], index[a][2], index[a][3]

    # Hamilton, with allergies on record.
    for pid in ids[70:76]:
        index[pid][5], index[pid][6] = "Hamilton", "ON"
        index[pid][7] = RNG.choice(["Penicillin", "Morphine", "Latex", "Peanuts"])

    # Nova Scotia, spread across its cities.
    for pid, city in zip(ids[80:88], ["Halifax", "Sydney", "Truro", "Dartmouth"] * 2):
        index[pid][5], index[pid][6] = city, "NS"

    # Born in 2010, and in the seventies.
    for pid in ids[90:96]:
        index[pid][4] = birth_date(RNG, 2010)
    for pid in ids[100:112]:
        index[pid][4] = birth_date(RNG, RNG.randint(1970, 1979))

    # Weights that land inside the 100-120 band, and a few genuinely obese.
    for pid, weight in zip(ids[120:128], (100, 104, 109, 112, 115, 118, 120, 107)):
        index[pid][9] = weight
    for pid in ids[130:138]:
        index[pid][8], index[pid][9] = RNG.randint(150, 165), RNG.randint(88, 112)

    # One tallest patient, unambiguously.
    for row in patients:
        row[8] = min(row[8], 194)
    index[ids[145]][8] = 199

    # The patient the last question is looking for: an r after the first two
    # letters, F, born in February, May or December, 60-80kg, odd id, Kingston.
    target = next(pid for pid in ids if pid % 2 == 1 and pid > 300)
    row = index[target]
    row[1], row[3] = "Ambrosia", "F"
    row[4] = f"{1988}-05-{RNG.randint(10, 28):02d}"
    row[5], row[6] = "Kingston", "ON"
    row[9] = 68

    # ...and nobody else. Anyone who also matches gets moved off the shortlist.
    for other in patients:
        if other[0] == target:
            continue
        if (
            other[3] == "F"
            and other[5] == "Kingston"
            and other[0] % 2 == 1
            and 60 <= other[9] <= 80
            and "r" in other[1][2:].lower()
            and other[4][5:7] in ("02", "05", "12")
        ):
            other[5] = "Toronto"


def build_admissions(patients: list[list]) -> list[tuple]:
    ids = [row[0] for row in patients]
    admitted = RNG.sample(ids, 168)
    rows: list[tuple] = []

    def add(pid: int, day: int, stay: int, diagnosis: str, doctor: int, year: int, month: int):
        start = f"{year:04d}-{month:02d}-{day:02d}"
        end_day = min(day + stay, 28)
        rows.append((pid, start, f"{year:04d}-{month:02d}-{end_day:02d}", diagnosis, doctor))

    for pid in admitted:
        used: set[tuple[int, int, int]] = set()
        for _ in range(RNG.choice([1, 1, 1, 2, 2, 3])):
            while True:
                key = (RNG.choice([2023, 2024, 2025]), RNG.randint(1, 12), RNG.randint(1, 28))
                if key not in used:
                    used.add(key)
                    break
            year, month, day = key
            add(pid, day, RNG.choice([0, 0, 1, 2, 3, 5]), RNG.choice(DIAGNOSES),
                RNG.choice([d[0] for d in DOCTORS]), year, month)

    # Named in a question: 579 and 542 need a history to count and to sort.
    for pid, count in ((579, 3), (542, 3)):
        rows[:] = [r for r in rows if r[0] != pid]
        for n in range(count):
            add(pid, 4 + n * 6, n, RNG.choice(DIAGNOSES), RNG.choice([1, 5, 12, 19]),
                2023 + n, 3 + n * 2)

    # The same person, back with the same complaint.
    for pid in RNG.sample(admitted, 14):
        existing = [r for r in rows if r[0] == pid]
        if not existing:
            continue
        first = existing[0]
        add(pid, RNG.randint(1, 28), 2, first[3], RNG.choice([d[0] for d in DOCTORS]),
            2025, RNG.randint(1, 12))

    # Dementia, seen by a doctor called Lisa. Question 46 asks for exactly this.
    for pid in RNG.sample(admitted, 6):
        add(pid, RNG.randint(1, 28), 3, "Dementia", RNG.choice([2, 19]), 2024, RNG.randint(1, 12))

    # Odd patient ids under doctors 1, 5 and 19; three-digit ids under a doctor
    # whose own id contains a 2. Question 34 lives on both halves being real.
    for pid in [p for p in admitted if p % 2 == 1][:8]:
        add(pid, RNG.randint(1, 28), 1, RNG.choice(DIAGNOSES), RNG.choice([1, 5, 19]),
            2024, RNG.randint(1, 12))
    for pid in [p for p in admitted if 100 <= p <= 999][:8]:
        add(pid, RNG.randint(1, 28), 1, RNG.choice(DIAGNOSES), RNG.choice([2, 12, 20, 21]),
            2025, RNG.randint(1, 12))

    # One admission may not share a date with another for the same patient, or
    # "their most recent admission" has two answers.
    seen: set[tuple[int, str]] = set()
    unique = []
    for row in rows:
        if (row[0], row[1]) in seen:
            continue
        seen.add((row[0], row[1]))
        unique.append(row)
    return unique


# ---------------------------------------------------------------------------
#  The database
# ---------------------------------------------------------------------------

SCHEMA_DDL = """CREATE TABLE doctors (
  doctor_id  INTEGER PRIMARY KEY,
  first_name VARCHAR(30),
  last_name  VARCHAR(30),
  specialty  VARCHAR(25)
);

CREATE TABLE province_names (
  province_id   CHAR(2) PRIMARY KEY,
  province_name VARCHAR(30)
);

CREATE TABLE patients (
  patient_id  INTEGER PRIMARY KEY,
  first_name  VARCHAR(30),
  last_name   VARCHAR(30),
  gender      CHAR(1),
  birth_date  DATE,
  city        VARCHAR(30),
  province_id CHAR(2) REFERENCES province_names(province_id),
  allergies   VARCHAR(80),
  height      DECIMAL(3,0),
  weight      DECIMAL(4,0)
);

CREATE TABLE admissions (
  patient_id          INT REFERENCES patients(patient_id),
  admission_date      DATE,
  discharge_date      DATE,
  diagnosis           VARCHAR(50),
  attending_doctor_id INT REFERENCES doctors(doctor_id)
);
"""

TABLES_MODEL = [
    ("patients", [
        ("patient_id", "INTEGER", "pk"), ("first_name", "VARCHAR(30)", None),
        ("last_name", "VARCHAR(30)", None), ("gender", "CHAR(1)", None),
        ("birth_date", "DATE", None), ("city", "VARCHAR(30)", None),
        ("province_id", "CHAR(2)", "fk"), ("allergies", "VARCHAR(80)", None),
        ("height", "DECIMAL(3,0)", None), ("weight", "DECIMAL(4,0)", None),
    ]),
    ("admissions", [
        ("patient_id", "INT", "fk"), ("admission_date", "DATE", None),
        ("discharge_date", "DATE", None), ("diagnosis", "VARCHAR(50)", None),
        ("attending_doctor_id", "INT", "fk"),
    ]),
    ("doctors", [
        ("doctor_id", "INTEGER", "pk"), ("first_name", "VARCHAR(30)", None),
        ("last_name", "VARCHAR(30)", None), ("specialty", "VARCHAR(25)", None),
    ]),
    ("province_names", [
        ("province_id", "CHAR(2)", "pk"), ("province_name", "VARCHAR(30)", None),
    ]),
]


def sql_literal(value) -> str:
    if value is None:
        return "NULL"
    if isinstance(value, int):
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"


def build_inserts(patients, admissions) -> str:
    out = ["INSERT INTO doctors VALUES"]
    out.append(",\n".join("  (" + ",".join(sql_literal(v) for v in d) + ")" for d in DOCTORS) + ";")
    out.append("\nINSERT INTO province_names VALUES")
    out.append(",\n".join(f"  ('{p[0]}','{p[1]}')" for p in PROVINCES) + ";")
    out.append("\nINSERT INTO patients VALUES")
    out.append(",\n".join("  (" + ",".join(sql_literal(v) for v in row) + ")" for row in patients) + ";")
    out.append("\nINSERT INTO admissions VALUES")
    out.append(",\n".join("  (" + ",".join(sql_literal(v) for v in row) + ")" for row in admissions) + ";")
    return "\n".join(out)


# ---------------------------------------------------------------------------
#  The questions
#
#  Written for SQLite, because that is what runs in the browser. Where MySQL
#  would say it differently the difference goes in `mysql_note`, since the
#  course itself is taught on MySQL and a student will meet both.
# ---------------------------------------------------------------------------

Q: list[dict] = []


def q(difficulty, topic, title, prompt, solution, hint=None, mysql=None, check=None):
    Q.append({
        "difficulty": difficulty, "topic": topic, "title": title, "prompt_md": prompt,
        "hint_md": hint, "solution_sql": solution.strip(), "mysql_note": mysql,
        "check_sql": check,
    })


# ── Easy ───────────────────────────────────────────────────────────────────
q("easy", "Filtering", "Male patients",
  "Show the first name, last name and gender of every patient whose gender is `'M'`.",
  "SELECT first_name, last_name, gender FROM patients WHERE gender = 'M';",
  "A single equality in the WHERE clause is all this needs.")

q("easy", "NULL handling", "Patients with no allergies on record",
  "Show the first name and last name of the patients who have no allergies recorded — the column is `NULL` for them.",
  "SELECT first_name, last_name FROM patients WHERE allergies IS NULL;",
  "`= NULL` never matches anything. NULL is tested with IS NULL.")

q("easy", "Pattern matching", "First names starting with C",
  "Show the first name of every patient whose name starts with the letter `'C'`.",
  "SELECT first_name FROM patients WHERE first_name LIKE 'C%';",
  "LIKE with `%` standing in for any run of characters.")

q("easy", "Ranges", "Weight between 100 and 120",
  "Show the first name and last name of patients whose weight is within the range 100 to 120, inclusive.",
  "SELECT first_name, last_name FROM patients WHERE weight BETWEEN 100 AND 120;",
  "BETWEEN includes both ends.")

q("easy", "Updating rows", "Fill in the missing allergies",
  "Update the `allergies` column in the patients table: where a patient's allergies are `NULL`, replace the value with `'NKA'` (no known allergies).\n\nThis one changes the data rather than reading it. The database is rebuilt before every run, so you can run it as often as you like.",
  "UPDATE patients SET allergies = 'NKA' WHERE allergies IS NULL;",
  "UPDATE ... SET ... WHERE. Without the WHERE you would overwrite everybody.",
  check="SELECT patient_id, allergies FROM patients ORDER BY patient_id;")

q("easy", "Text functions", "Full name in one column",
  "Show the first name and last name joined into a single column showing each patient's full name.",
  "SELECT first_name || ' ' || last_name AS full_name FROM patients;",
  "SQLite joins strings with `||`.",
  "MySQL has no `||` for strings by default — use `CONCAT(first_name, ' ', last_name)`.")

q("easy", "Joins", "Patients with their full province name",
  "Show the first name, last name and the full province name of each patient — `'Ontario'` rather than `'ON'`.",
  "SELECT p.first_name, p.last_name, pn.province_name\nFROM patients p\nJOIN province_names pn ON pn.province_id = p.province_id;",
  "`patients.province_id` matches `province_names.province_id`.")

q("easy", "Dates", "Patients born in 2010",
  "Show how many patients have a `birth_date` with 2010 as the birth year.",
  "SELECT COUNT(*) AS total_patients FROM patients WHERE strftime('%Y', birth_date) = '2010';",
  "Pull the year out of the date, then count.",
  "MySQL writes this as `YEAR(birth_date) = 2010`.")

q("easy", "Subqueries", "The tallest patient",
  "Show the first name, last name and height of the patient with the greatest height.",
  "SELECT first_name, last_name, height FROM patients\nWHERE height = (SELECT MAX(height) FROM patients);",
  "A subquery finds the maximum; the outer query finds who has it.")

q("easy", "Filtering", "A specific list of patients",
  "Show all columns for the patients whose `patient_id` is one of: 1, 45, 534, 879, 1000.",
  "SELECT * FROM patients WHERE patient_id IN (1, 45, 534, 879, 1000);",
  "IN takes a list.")

q("easy", "Aggregates", "Total admissions",
  "Show the total number of admissions.",
  "SELECT COUNT(*) AS total_admissions FROM admissions;")

q("easy", "Filtering", "Admitted and discharged the same day",
  "Show all the columns from `admissions` where the patient was admitted and discharged on the same day.",
  "SELECT * FROM admissions WHERE admission_date = discharge_date;",
  "Two columns can be compared to each other, not only to a value.")

q("easy", "Aggregates", "How often patient 579 was admitted",
  "Show the patient id and the total number of admissions for `patient_id` 579.",
  "SELECT patient_id, COUNT(*) AS total_admissions FROM admissions\nWHERE patient_id = 579 GROUP BY patient_id;")

q("easy", "Distinct", "Cities in Nova Scotia",
  "Based on the cities our patients live in, show the unique cities that are in `province_id` `'NS'`.",
  "SELECT DISTINCT city FROM patients WHERE province_id = 'NS';")

q("easy", "Filtering", "Tall and heavy",
  "Find the first name, last name and birth date of patients whose height is greater than 160 and whose weight is greater than 70.",
  "SELECT first_name, last_name, birth_date FROM patients\nWHERE height > 160 AND weight > 70;")

q("easy", "NULL handling", "Allergies in Hamilton",
  "List the first name, last name and allergies of patients whose allergies are not null and who are from the city of `'Hamilton'`.",
  "SELECT first_name, last_name, allergies FROM patients\nWHERE allergies IS NOT NULL AND city = 'Hamilton';")

# ── Medium ─────────────────────────────────────────────────────────────────
q("medium", "Dates", "Unique birth years",
  "Show the unique birth years from the patients table and order them ascending.",
  "SELECT DISTINCT strftime('%Y', birth_date) AS birth_year FROM patients ORDER BY birth_year ASC;",
  None,
  "MySQL: `SELECT DISTINCT YEAR(birth_date) ...`.")

q("medium", "Grouping", "First names that occur exactly once",
  "Show the unique first names from the patients table which occur only once in the list.\n\nIf two or more people are named `'John'` then leave that name out. If exactly one person is named `'Leo'`, include it.",
  "SELECT first_name FROM patients GROUP BY first_name HAVING COUNT(*) = 1;",
  "Group by the name, then filter the groups with HAVING.")

q("medium", "Pattern matching", "Names that start and end with S",
  "Show the `patient_id` and `first_name` of patients whose first name starts and ends with `'s'` and is at least 6 characters long.",
  "SELECT patient_id, first_name FROM patients\nWHERE first_name LIKE 's%s' AND LENGTH(first_name) >= 6;",
  "LIKE handles both ends; LENGTH handles the size.")

q("medium", "Joins", "Patients diagnosed with dementia",
  "Show the `patient_id`, `first_name` and `last_name` of patients whose diagnosis is `'Dementia'`.\n\nThe diagnosis is stored in the admissions table.",
  "SELECT p.patient_id, p.first_name, p.last_name\nFROM patients p JOIN admissions a ON a.patient_id = p.patient_id\nWHERE a.diagnosis = 'Dementia';")

q("medium", "Sorting", "Names by length, then alphabetically",
  "Display every patient's first name, ordered by the length of the name and then alphabetically.",
  "SELECT first_name FROM patients ORDER BY LENGTH(first_name), first_name;")

q("medium", "Subqueries", "Male and female counts side by side",
  "Show the total number of male patients and the total number of female patients, both in the same row.",
  "SELECT\n  (SELECT COUNT(*) FROM patients WHERE gender = 'M') AS male_count,\n  (SELECT COUNT(*) FROM patients WHERE gender = 'F') AS female_count;",
  "Two scalar subqueries in the SELECT list, or one SUM(CASE ...) each.")

q("medium", "Sorting", "Penicillin and morphine allergies",
  "Show the first name, last name and allergies of patients allergic to either `'Penicillin'` or `'Morphine'`. Order ascending by allergies, then first name, then last name.",
  "SELECT first_name, last_name, allergies FROM patients\nWHERE allergies IN ('Penicillin', 'Morphine')\nORDER BY allergies, first_name, last_name;")

q("medium", "Grouping", "Readmitted for the same thing",
  "Show the `patient_id` and `diagnosis` of patients who have been admitted more than once for the same diagnosis.",
  "SELECT patient_id, diagnosis FROM admissions\nGROUP BY patient_id, diagnosis HAVING COUNT(*) > 1;",
  "Group by both columns together.")

q("medium", "Grouping", "Patients per city",
  "Show the city and the total number of patients in that city. Order from most patients to fewest, then by city name ascending.",
  "SELECT city, COUNT(*) AS num_patients FROM patients\nGROUP BY city ORDER BY num_patients DESC, city ASC;")

q("medium", "Set operations", "Everyone in the building",
  "Show the first name, last name and role of every person who is either a patient or a doctor. The role is either `'Patient'` or `'Doctor'`.",
  "SELECT first_name, last_name, 'Patient' AS role FROM patients\nUNION ALL\nSELECT first_name, last_name, 'Doctor' AS role FROM doctors;",
  "UNION ALL stacks two result sets that have the same shape.")

q("medium", "Grouping", "Allergies by popularity",
  "Show all allergies ordered by how common they are, most first. Leave out `'NKA'` and NULL values.",
  "SELECT allergies, COUNT(*) AS total_diagnosis FROM patients\nWHERE allergies IS NOT NULL AND allergies <> 'NKA'\nGROUP BY allergies ORDER BY total_diagnosis DESC;")

q("medium", "Dates", "Born in the seventies",
  "Show the first name, last name and birth date of every patient born in the 1970s. Sort from the earliest birth date.",
  "SELECT first_name, last_name, birth_date FROM patients\nWHERE birth_date BETWEEN '1970-01-01' AND '1979-12-31'\nORDER BY birth_date ASC;",
  "Dates stored as `YYYY-MM-DD` sort and compare as text.")

q("medium", "Text functions", "SMITH,jane",
  "Display each patient's full name in a single column: last name in upper case first, then first name in lower case, separated by a comma. Order by first name descending.\n\nFor example: `SMITH,jane`",
  "SELECT UPPER(last_name) || ',' || LOWER(first_name) AS new_name_format\nFROM patients ORDER BY first_name DESC;",
  None,
  "MySQL: `CONCAT(UPPER(last_name), ',', LOWER(first_name))`.")

q("medium", "Grouping", "Provinces by total height",
  "Show the province ids and the sum of their patients' heights, where that total is 7,000 or more.",
  "SELECT province_id, SUM(height) AS sum_height FROM patients\nGROUP BY province_id HAVING SUM(height) >= 7000;")

q("medium", "Aggregates", "Weight spread among the Maronis",
  "Show the difference between the largest and the smallest weight among patients with the last name `'Maroni'`.",
  "SELECT (MAX(weight) - MIN(weight)) AS weight_delta FROM patients WHERE last_name = 'Maroni';")

q("medium", "Dates", "Admissions by day of the month",
  "Show each day of the month that has admissions, and how many admission dates fell on it. Sort from the busiest day to the quietest.",
  "SELECT CAST(strftime('%d', admission_date) AS INTEGER) AS day_number,\n       COUNT(*) AS number_of_admissions\nFROM admissions GROUP BY day_number ORDER BY number_of_admissions DESC;",
  None,
  "MySQL: `DAY(admission_date)`.")

q("medium", "Sorting", "Patient 542's latest admission",
  "Show all the columns for `patient_id` 542's most recent admission date.",
  "SELECT * FROM admissions WHERE patient_id = 542 ORDER BY admission_date DESC LIMIT 1;")

q("medium", "Filtering", "Two criteria, either one",
  "Show the `patient_id`, `attending_doctor_id` and `diagnosis` for admissions that match one of two criteria:\n\n1. The `patient_id` is an odd number **and** the `attending_doctor_id` is 1, 5 or 19.\n2. The `attending_doctor_id` contains a 2 **and** the `patient_id` is 3 characters long.",
  "SELECT patient_id, attending_doctor_id, diagnosis FROM admissions\nWHERE (patient_id % 2 <> 0 AND attending_doctor_id IN (1, 5, 19))\n   OR (CAST(attending_doctor_id AS TEXT) LIKE '%2%'\n       AND LENGTH(CAST(patient_id AS TEXT)) = 3);",
  "Brackets matter here — AND binds tighter than OR.")

q("medium", "Joins", "Admissions attended per doctor",
  "Show the first name, last name and the total number of admissions attended for each doctor. Every admission has been attended by a doctor.",
  "SELECT d.first_name, d.last_name, COUNT(*) AS admissions_total\nFROM admissions a JOIN doctors d ON d.doctor_id = a.attending_doctor_id\nGROUP BY d.doctor_id, d.first_name, d.last_name;")

q("medium", "Joins", "Each doctor's first and last admission",
  "For each doctor, display their id, full name, and the first and last admission date they attended.",
  "SELECT d.doctor_id,\n       d.first_name || ' ' || d.last_name AS full_name,\n       MIN(a.admission_date) AS first_admission_date,\n       MAX(a.admission_date) AS last_admission_date\nFROM doctors d JOIN admissions a ON a.attending_doctor_id = d.doctor_id\nGROUP BY d.doctor_id, full_name;")

q("medium", "Joins", "Patients per province",
  "Display the total number of patients for each province. Order by the count, descending.",
  "SELECT pn.province_name, COUNT(*) AS patient_count\nFROM patients p JOIN province_names pn ON pn.province_id = p.province_id\nGROUP BY pn.province_name ORDER BY patient_count DESC;")

q("medium", "Joins", "Every admission, in full",
  "For every admission, display the patient's full name, their admission diagnosis, and the full name of the doctor who diagnosed it.",
  "SELECT p.first_name || ' ' || p.last_name AS patient_name,\n       a.diagnosis,\n       d.first_name || ' ' || d.last_name AS doctor_name\nFROM admissions a\nJOIN patients p ON p.patient_id = a.patient_id\nJOIN doctors d ON d.doctor_id = a.attending_doctor_id;",
  "Two joins from the same table — admissions is the one in the middle.")

q("medium", "Grouping", "Patients who share a name",
  "Display the first name, last name and the number of duplicate patients, based on their first and last name together.",
  "SELECT first_name, last_name, COUNT(*) AS num_of_duplicates\nFROM patients GROUP BY first_name, last_name HAVING COUNT(*) > 1;")

q("medium", "Conversions", "In feet and pounds",
  "Display each patient's full name, height in feet rounded to 1 decimal, weight in pounds rounded to 0 decimals, birth date, and gender written out in full.\n\nConvert cm to feet by dividing by 30.48. Convert kg to pounds by multiplying by 2.205.",
  "SELECT first_name || ' ' || last_name AS patient_name,\n       ROUND(height / 30.48, 1) AS height_feet,\n       ROUND(weight * 2.205, 0) AS weight_pounds,\n       birth_date,\n       CASE WHEN gender = 'M' THEN 'MALE' ELSE 'FEMALE' END AS gender_type\nFROM patients;",
  "CASE turns the single letter into a word.")

q("medium", "Subqueries", "Never admitted",
  "Show the `patient_id`, `first_name` and `last_name` of patients who have no records in the admissions table.",
  "SELECT patient_id, first_name, last_name FROM patients\nWHERE patient_id NOT IN (SELECT patient_id FROM admissions);",
  "NOT IN against a subquery, or a LEFT JOIN where the right side is NULL.")

q("medium", "Subqueries", "Busiest, quietest and average day",
  "Display a single row with `max_visits`, `min_visits` and `average_visits`, where the maximum, minimum and average number of admissions per day is calculated. Round the average to 2 decimal places.",
  "SELECT MAX(daily) AS max_visits, MIN(daily) AS min_visits,\n       ROUND(AVG(daily), 2) AS average_visits\nFROM (SELECT COUNT(*) AS daily FROM admissions GROUP BY admission_date);",
  "Count per day first, then aggregate that result.")

q("medium", "Subqueries", "Everyone's latest visit",
  "Display every patient who has at least one admission, showing their most recent admission along with the patient's and the doctor's full names.",
  "SELECT p.first_name || ' ' || p.last_name AS patient_name,\n       a.admission_date, a.diagnosis,\n       d.first_name || ' ' || d.last_name AS doctor_name\nFROM admissions a\nJOIN patients p ON p.patient_id = a.patient_id\nJOIN doctors d ON d.doctor_id = a.attending_doctor_id\nWHERE a.admission_date = (\n  SELECT MAX(x.admission_date) FROM admissions x WHERE x.patient_id = a.patient_id\n)\nORDER BY p.patient_id;",
  "A correlated subquery: the inner query refers to the row the outer one is on.")

# ── Hard ───────────────────────────────────────────────────────────────────
q("hard", "Grouping", "Patients by weight group",
  "Group all the patients into weight groups and show the total number of patients in each. Order by the weight group descending.\n\nSomeone weighing 100 to 109 is in the 100 group, 110 to 119 in the 110 group, and so on.",
  "SELECT (weight / 10) * 10 AS weight_group, COUNT(*) AS patients_in_group\nFROM patients GROUP BY weight_group ORDER BY weight_group DESC;",
  "Integer division throws away the units digit; multiplying puts the zero back.")

q("hard", "Conditionals", "Obesity flag",
  "Show `patient_id`, `weight`, `height` and `isObese` from the patients table, with `isObese` as a 0 or a 1.\n\nObese means weight(kg) / height(m)² is 30 or more. Weight is in kg and height in cm.",
  "SELECT patient_id, weight, height,\n       CASE WHEN weight / ((height / 100.0) * (height / 100.0)) >= 30\n            THEN 1 ELSE 0 END AS isObese\nFROM patients;",
  "Divide height by 100.0, not 100 — integer division would round it to 1 or 2.")

q("hard", "Joins", "Dementia patients seen by Lisa",
  "Show the `patient_id`, `first_name`, `last_name` and the attending doctor's specialty, for patients whose diagnosis is `'Dementia'` and whose doctor's first name is `'Lisa'`.",
  "SELECT p.patient_id, p.first_name, p.last_name, d.specialty\nFROM patients p\nJOIN admissions a ON a.patient_id = p.patient_id\nJOIN doctors d ON d.doctor_id = a.attending_doctor_id\nWHERE a.diagnosis = 'Dementia' AND d.first_name = 'Lisa';",
  "Three tables: patients to admissions to doctors.")

q("hard", "Text functions", "Temporary passwords",
  "Patients who have been through admissions can see their medical documents on our site, and are given a temporary password after their first admission. Show the `patient_id` and `temp_password`.\n\nThe password is, in order: the patient id, the number of characters in the patient's last name, and the year of the patient's birth date.",
  "SELECT DISTINCT p.patient_id,\n       CAST(p.patient_id AS TEXT) || CAST(LENGTH(p.last_name) AS TEXT)\n       || strftime('%Y', p.birth_date) AS temp_password\nFROM patients p JOIN admissions a ON a.patient_id = p.patient_id;",
  "DISTINCT, or the patients with several admissions appear more than once.")

q("hard", "Conditionals", "Admission cost by insurance",
  "Each admission costs $50 for patients without insurance and $10 for patients with it. Every patient with an even `patient_id` has insurance.\n\nGive each patient a `'Yes'` if they have insurance and a `'No'` if they do not, and add up the admission cost for each group.",
  "SELECT CASE WHEN patient_id % 2 = 0 THEN 'Yes' ELSE 'No' END AS has_insurance,\n       SUM(CASE WHEN patient_id % 2 = 0 THEN 10 ELSE 50 END) AS cost_after_insurance\nFROM admissions GROUP BY has_insurance;")

q("hard", "Grouping", "Provinces with more men than women",
  "Show the provinces that have more patients identified as `'M'` than as `'F'`. Show only the full province name.",
  "SELECT pn.province_name\nFROM patients p JOIN province_names pn ON pn.province_id = p.province_id\nGROUP BY pn.province_name\nHAVING SUM(CASE WHEN p.gender = 'M' THEN 1 ELSE 0 END)\n     > SUM(CASE WHEN p.gender = 'F' THEN 1 ELSE 0 END);",
  "Count each gender inside the group with SUM(CASE ...).")

q("hard", "Filtering", "Find this one patient",
  "We are looking for one specific patient. Pull all the columns for the patient who matches every one of the following:\n\n- their first name contains an `'r'` after the first two letters\n- they identify their gender as `'F'`\n- they were born in February, May or December\n- their weight is between 60kg and 80kg\n- their `patient_id` is an odd number\n- they are from the city `'Kingston'`",
  "SELECT * FROM patients\nWHERE first_name LIKE '__%r%'\n  AND gender = 'F'\n  AND CAST(strftime('%m', birth_date) AS INTEGER) IN (2, 5, 12)\n  AND weight BETWEEN 60 AND 80\n  AND patient_id % 2 = 1\n  AND city = 'Kingston';",
  "`'__%r%'` — two of anything, then an r somewhere after it.")

q("hard", "Aggregates", "Percentage of male patients",
  "Show the percentage of patients who have `'M'` as their gender. Round to the nearest hundredth and show it in percent form.",
  "SELECT ROUND(100.0 * SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) / COUNT(*), 2)\n       || '%' AS percent_of_male_patients\nFROM patients;",
  "Multiply by 100.0 rather than 100, or integer division gives you zero.")

q("hard", "Window functions", "Admissions, and the change from the day before",
  "For each day, display the total number of admissions on that day and how much that changed from the previous date.",
  "SELECT admission_date, COUNT(*) AS admission_day,\n       COUNT(*) - LAG(COUNT(*)) OVER (ORDER BY admission_date)\n         AS admission_count_change\nFROM admissions GROUP BY admission_date ORDER BY admission_date;",
  "LAG looks at the previous row of the ordered result.")

q("hard", "Sorting", "Ontario always first",
  "Sort the province names in ascending order, in such a way that the province `'Ontario'` is always on top.",
  "SELECT province_name FROM province_names\nORDER BY (province_name = 'Ontario') DESC, province_name ASC;",
  "A comparison is itself a value you can sort on: 1 for Ontario, 0 for everything else.")

q("hard", "Window functions", "Each doctor's year by year",
  "We need a breakdown of the total number of admissions each doctor has started each year. Show the `doctor_id`, the doctor's full name, their specialty, the year, and the total admissions for that year.",
  "SELECT d.doctor_id,\n       d.first_name || ' ' || d.last_name AS doctor_full_name,\n       d.specialty,\n       strftime('%Y', a.admission_date) AS selected_year,\n       COUNT(*) AS total_admissions\nFROM admissions a JOIN doctors d ON d.doctor_id = a.attending_doctor_id\nGROUP BY d.doctor_id, doctor_full_name, d.specialty, selected_year\nORDER BY d.doctor_id, selected_year;")


# ---------------------------------------------------------------------------
#  Run everything and write the files
# ---------------------------------------------------------------------------

def grid_of(cursor) -> dict:
    columns = [c[0] for c in cursor.description] if cursor.description else []
    rows = [list(r) for r in cursor.fetchall()]
    return {"columns": columns, "rows": rows}


def main() -> None:
    patients = build_patients()
    place_the_awkward_cases(patients)
    admissions = build_admissions(patients)

    schema_sql = SCHEMA_DDL + "\n" + build_inserts(patients, admissions) + "\n"

    # Every question runs against a database built exactly the way the browser
    # will build it, from this same string.
    failures: list[str] = []
    for question in Q:
        db = sqlite3.connect(":memory:")
        db.executescript(schema_sql)
        try:
            cursor = db.execute(question["solution_sql"]) if not question["check_sql"] else None
            if question["check_sql"]:
                db.executescript(question["solution_sql"])
                cursor = db.execute(question["check_sql"])
            question["expected_result"] = grid_of(cursor)
        except sqlite3.Error as error:
            failures.append(f"{question['title']}: {error}")
            question["expected_result"] = {"columns": [], "rows": []}
        db.close()

    if failures:
        raise SystemExit("Solutions that did not run:\n  " + "\n  ".join(failures))

    # A question whose answer is empty is a question nobody can pass by
    # accident and nobody can pass on purpose either.
    empty = [q["title"] for q in Q
             if not q["expected_result"]["rows"] and q["title"] != "Fill in the missing allergies"]
    if empty:
        raise SystemExit("Questions with no rows in the answer:\n  " + "\n  ".join(empty))

    # The one question that must have exactly one answer.
    single = next(q for q in Q if q["title"] == "Find this one patient")
    if len(single["expected_result"]["rows"]) != 1:
        raise SystemExit(
            f"'Find this one patient' matches {len(single['expected_result']['rows'])} patients"
        )

    ts = ROOT / "src" / "lib" / "practice-db.ts"
    tables = ",\n".join(
        "  {\n    name: %s,\n    columns: [\n%s\n    ],\n  }" % (
            json.dumps(name),
            "\n".join(
                "      { name: %s, type: %s%s }," % (
                    json.dumps(col), json.dumps(kind),
                    f", key: {json.dumps(key)}" if key else "",
                )
                for col, kind, key in columns
            ),
        )
        for name, columns in TABLES_MODEL
    )

    ts.write_text(f'''/**
 * The database SQL practice questions run against.
 *
 * A hospital: patients, the admissions they arrived through, the doctors who
 * attended them, and the provinces they live in. It is the schema the course
 * teaches against, so a query written here reads the same as one written in
 * MySQL Workbench against the same tables.
 *
 * SQLite rather than MySQL, because this executes in the student's browser
 * with no server behind it — which is the only way an in-page playground can
 * be free, instant and impossible to abuse.
 *
 * GENERATED FILE. Edit scripts/build_sql_practice.py and re-run it; the same
 * script computes the expected answer to every question from this data, so
 * hand-editing here would put the two out of step.
 */
export const PRACTICE_SCHEMA = `
{schema_sql}`;

/**
 * The schema panel's model of the same tables.
 *
 * Typed per column rather than as one comma-joined string, so the panel can
 * show what a database diagram shows — name on the left, type on the right —
 * and mark the keys.
 */
export type PracticeColumn = {{
  name: string;
  type: string;
  key?: "pk" | "fk";
}};

export const PRACTICE_TABLES: {{
  name: string;
  columns: PracticeColumn[];
}}[] = [
{tables},
];
''')

    """
    Two files, deliberately apart.

    The questions are content: prompts, hints, reference solutions, the note
    about MySQL. They go to Supabase so they can be edited without a deploy.

    The answers are not content. They are 110 KB of expected rows that exist
    only to be compared against, they are derived from the data in
    practice-db.ts, and they would go stale the moment either changed — so
    they live beside the database that produced them and are served one at a
    time by /api/sql-answer.
    """
    questions = [
        {"position": i + 1, "difficulty": q["difficulty"], "topic": q["topic"],
         "title": q["title"], "prompt_md": q["prompt_md"], "hint_md": q["hint_md"],
         "solution_sql": q["solution_sql"], "mysql_note": q["mysql_note"]}
        for i, q in enumerate(Q)
    ]
    (ROOT / "content" / "sql-questions.json").write_text(
        json.dumps(questions, indent=2) + "\n"
    )

    answers = {
        str(i + 1): {"expected_result": q["expected_result"], "check_sql": q["check_sql"]}
        for i, q in enumerate(Q)
    }
    (ROOT / "content" / "sql-answers.json").write_text(
        json.dumps(answers, separators=(",", ":")) + "\n"
    )

    print(f"patients      {len(patients)}")
    print(f"admissions    {len(admissions)}")
    print(f"doctors       {len(DOCTORS)}")
    print(f"questions     {len(Q)}  "
          f"(easy {sum(1 for x in Q if x['difficulty']=='easy')}, "
          f"medium {sum(1 for x in Q if x['difficulty']=='medium')}, "
          f"hard {sum(1 for x in Q if x['difficulty']=='hard')})")
    print(f"schema        {len(schema_sql) // 1024} KB")
    print(f"answers       {sum(len(x['expected_result']['rows']) for x in Q)} rows in total")


if __name__ == "__main__":
    main()
