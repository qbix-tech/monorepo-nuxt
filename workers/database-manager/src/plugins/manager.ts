import type { DrizzlePGClientDatabase } from "@org/database";

export default defineNitroPlugin(async () => {
  const doMigrate = process.env.DATABASE_MANAGER_ENABLE_MIGRATE === "true";
  const doSeed = process.env.DATABASE_MANAGER_ENABLE_SEED === "true";

  let db: DrizzlePGClientDatabase | null;
  try {
    db = useDB();
    await db.$client.connect();
    await migrate(db);
    await seed(db);
  } catch (error) {
    try {
      await db?.$client.end();
      // eslint-disable-next-line no-empty
    } catch {}
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  } finally {
    try {
      await db?.$client.end();
      // eslint-disable-next-line no-empty
    } catch {}
    if (doMigrate && doSeed) {
      // eslint-disable-next-line no-console
      console.info("Migration and seed completed!");
    } else if (doMigrate) {
      // eslint-disable-next-line no-console
      console.info("Migration completed!");
    } else if (doSeed) {
      // eslint-disable-next-line no-console
      console.info("Seed completed!");
    } else {
      // eslint-disable-next-line no-console
      console.info("Nothing to do!");
    }
    process.exit(0);
  }
});
