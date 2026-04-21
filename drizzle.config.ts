import { defineConfig } from "drizzle-kit";

const connectionString =
  process.env.DATABASE_URL ??
  process.env.SUPABASE_DB_URL ??
  "postgresql://postgres:postgres@127.0.0.1:5432/postgres";

export default defineConfig({
  out: "./supabase/migrations",
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
