import type { Config } from "drizzle-kit";
import { env } from "@/env.mjs";

const config: Config = {
  schema: "./db/schema.ts",
  out: "./db/pull/",
  driver: "mysql2",
  dbCredentials: {
    host: env.DATABASE_HOST,
    password: env.DATABASE_PASSWORD,
    // TODO: verify database as DATABASE_USERNAME works, may need to actually add an env var for database name
    database: env.DATABASE_USERNAME,
  },
};

export default config;
