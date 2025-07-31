import { drizzle as drizzlePG } from "drizzle-orm/node-postgres";
import type {
  DrizzlePGConfig,
  DrizzlePGClientDatabase,
  DrizzlePGPoolDatabase,
} from "./types";
import pg from "pg";

class DrizzleDatabase<T extends DrizzlePGConfig> {
  constructor(private config: T) {}
  public getDrizzlePG() {
    if (this.config.pg.connection === "client") {
      const client = new pg.Client(this.config.pg.config);
      return drizzlePG(client, this.config.options) as DrizzlePGClientDatabase;
    }
    const pool = new pg.Pool(this.config.pg.config);
    return drizzlePG(pool, this.config.options) as DrizzlePGPoolDatabase;
  }
  // extend for other db engines here
}

export default DrizzleDatabase;
