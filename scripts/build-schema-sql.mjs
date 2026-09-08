/**
 * Turns the generated migration into a module the app can execute.
 *
 *     npx drizzle-kit generate && node scripts/build-schema-sql.mjs
 *
 * See the header of the file it writes for why this indirection exists.
 */
import fs from "node:fs";
import path from "node:path";

const dir = "drizzle";
const file = fs
  .readdirSync(dir)
  .filter((name) => name.endsWith(".sql"))
  .sort()
  .at(-1);

if (!file) {
  console.error("No migration found in drizzle/. Run drizzle-kit generate.");
  process.exit(1);
}

const statements = fs
  .readFileSync(path.join(dir, file), "utf8")
  .split("--> statement-breakpoint")
  .map((s) => s.trim())
  .filter(Boolean)
  .map((s) =>
    s
      .replace("CREATE TABLE ", "CREATE TABLE IF NOT EXISTS ")
      .replace("CREATE INDEX ", "CREATE INDEX IF NOT EXISTS ")
      .replace("CREATE UNIQUE INDEX ", "CREATE UNIQUE INDEX IF NOT EXISTS "),
  );

const header = `/**
 * The schema, as statements to run.
 *
 * GENERATED from drizzle/${file} by scripts/build-schema-sql.mjs.
 *
 * It exists as a module rather than a file read at runtime because the one
 * place this has to work is a Vercel function, where the repository is not on
 * disk unless it was traced into the bundle — and a migration that fails
 * because a .sql file was not packaged is a bad first five minutes.
 *
 * Every statement is idempotent, so running the bootstrap twice is harmless.
 */
export const SCHEMA_STATEMENTS: string[] = `;

fs.writeFileSync(
  "src/lib/db/schema-sql.ts",
  header + JSON.stringify(statements, null, 2) + ";\n",
);
console.log(`${statements.length} statements from ${file}`);
