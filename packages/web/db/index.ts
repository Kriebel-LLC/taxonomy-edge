import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { env } from "@/env.mjs";

const connection = connect({
  host: env.DATABASE_HOST,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  // removes the `cache` header, which breaks cloudflare workers; remove this ASAP
  // for details: https://github.com/cloudflare/workerd/issues/698#issue-1723641854
  fetch: (url, init) => {
    delete (init as any)["cache"]; // Remove cache header
    return fetch(url, init);
  },
});

export const db = drizzle(connection, { logger: true });
