import "dotenv/config";
import { createDB, createSeeder } from "../src";
import seedConfig from "../seed.config";
import { defineDrizzlePGConfig } from "../src/module/database/definer";

const { DATABASE_URL, DATABASE_SSL } = process.env;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is missing.");
}

const config = defineDrizzlePGConfig({
  pg: {
    connection: "client",
    config: {
      connectionString: DATABASE_URL,
      ssl: DATABASE_SSL === "true",
    },
  },
  options: {
    casing: "snake_case",
  },
});

const db = createDB(config);
const { run } = createSeeder(seedConfig);

const main = async () => {
  await db.$client.connect();
  run(db)
    .catch(async (e) => {
      await db.$client.end();
      // eslint-disable-next-line no-console
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await db.$client.end();
      // eslint-disable-next-line no-console
      console.log("Seeding completed!");
      process.exit(0);
    });
};

main();
