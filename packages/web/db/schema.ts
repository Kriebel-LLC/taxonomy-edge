import {
  mysqlTable,
  varchar,
  datetime,
  json,
  tinyint,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { InferModel } from "drizzle-orm";

export const posts = mysqlTable("posts", {
  id: varchar("id", { length: 191 }).primaryKey().notNull(),
  title: varchar("title", { length: 191 }).notNull(),
  content: json("content"),
  published: tinyint("published").default(0).notNull(),
  createdAt: datetime("created_at", { mode: "string", fsp: 3 })
    .default(sql`(CURRENT_TIMESTAMP(3))`)
    .notNull(),
  updatedAt: datetime("updated_at", { mode: "string", fsp: 3 })
    .default(sql`(CURRENT_TIMESTAMP(3))`)
    .notNull(),
  authorId: varchar("authorId", { length: 191 }).notNull(),
});

export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    updatedAt: datetime("updated_at", { mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    stripeCustomerId: varchar("stripe_customer_id", { length: 191 }),
    stripeSubscriptionId: varchar("stripe_subscription_id", { length: 191 }),
    stripePriceId: varchar("stripe_price_id", { length: 191 }),
    stripeCurrentPeriodEnd: datetime("stripe_current_period_end", {
      mode: "string",
      fsp: 3,
    }),
  },
  (table) => {
    return {
      stripeCustomerIdKey: uniqueIndex("users_stripe_customer_id_key").on(
        table.stripeCustomerId
      ),
      stripeSubscriptionIdKey: uniqueIndex(
        "users_stripe_subscription_id_key"
      ).on(table.stripeSubscriptionId),
    };
  }
);

export type User = InferModel<typeof users>;
export type Post = InferModel<typeof posts>;
