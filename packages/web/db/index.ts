import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
import { getRequestContext } from "@cloudflare/next-on-pages";

// Can ONLY be used in backend routes where getRequestContext is available
export const db = () =>
  drizzle(getRequestContext().env.DB, { logger: true, schema });
