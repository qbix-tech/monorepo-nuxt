import {
  type DrizzlePGClientDatabase,
  createDB,
  defineDrizzlePGConfig,
} from "@org/database";

let _db: DrizzlePGClientDatabase | null = null;

const useDB = () => {
  if (!_db) {
    const { DATABASE_URL, DATABASE_SSL } = process.env;

    if (!DATABASE_URL) {
      throw new Error("Database configuration is missing");
    }

    const config = defineDrizzlePGConfig({
      pg: {
        connection: "client",
        config: {
          connectionString: DATABASE_URL,
          ssl: DATABASE_SSL === "true",
        },
      },
    });

    _db = createDB(config);
  }
  return _db;
};

export { useDB };
