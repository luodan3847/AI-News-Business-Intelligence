import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL ?? null;

declare global {
  // eslint-disable-next-line no-var
  var __aiNewsBusinessSqlClient: ReturnType<typeof postgres> | undefined;
}

function createClient() {
  if (!connectionString) {
    return null;
  }

  const existing = globalThis.__aiNewsBusinessSqlClient;
  if (existing) {
    return existing;
  }

  const client = postgres(connectionString, {
    max: 1,
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 15,
  });

  globalThis.__aiNewsBusinessSqlClient = client;
  return client;
}

const sql = createClient();

export const db = sql ? drizzle(sql, { schema }) : null;

export function hasDatabaseConnection() {
  return Boolean(db);
}
