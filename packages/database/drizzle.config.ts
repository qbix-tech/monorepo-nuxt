import { defineConfig } from "drizzle-kit";
const { DATABASE_URL, DATABASE_SSL } = process.env;

if (!DATABASE_URL) {
  throw new Error("Database configuration is missing");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./schema",
  schemaFilter: [],
  casing: "snake_case",
  out: "./migrations",
  dbCredentials: {
    url: DATABASE_URL,
    ssl: DATABASE_SSL === "true",
  },
  migrations: {
    prefix: "timestamp",
  },
});
