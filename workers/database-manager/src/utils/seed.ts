import {
  type DrizzlePGClientDatabase,
  createSeeder,
  seedConfig,
} from "@org/database";

const { run } = createSeeder(seedConfig);

export const seed = async (db: DrizzlePGClientDatabase) => {
  const doSeed = process.env.DATABASE_MANAGER_ENABLE_SEED === "true";

  if (doSeed) {
    // eslint-disable-next-line no-console
    console.log("✅ Seed Enabled: Running seeding now.");

    await run(db);
  }
};
