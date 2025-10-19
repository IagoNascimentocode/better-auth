import { timestamp, PgColumnBuilderBase } from "drizzle-orm/pg-core";

export const timeHelper = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
} satisfies Record<string, PgColumnBuilderBase<any, any>>;
