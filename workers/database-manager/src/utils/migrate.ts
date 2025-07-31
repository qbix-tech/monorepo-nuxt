import { drizzlePGMigrator } from "@org/database";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type { DrizzlePGClientDatabase } from "@org/database";

export const migrate = async (db: DrizzlePGClientDatabase) => {
  const doMigrate = process.env.DATABASE_MANAGER_ENABLE_MIGRATE === "true";

  if (doMigrate) {
    // eslint-disable-next-line no-console
    console.log("✅ Migration Enabled: Running migration now.");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    await drizzlePGMigrator(db, {
      migrationsFolder: import.meta.dev
        ? path.join(__dirname, "../../../../packages/database/migrations")
        : path.join(__dirname, "../migrations"),
    });
  }
};
