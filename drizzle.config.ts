import { defineConfig } from "drizzle-kit";

/**
 * Migrations are generated here and applied by `npm run db:migrate`.
 *
 * `DATABASE_URL` is Railway's public endpoint for a one-off run from a
 * laptop, and its private one when the app itself is doing the applying.
 */
export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
  casing: "snake_case",
});
