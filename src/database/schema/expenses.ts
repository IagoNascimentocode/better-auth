import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { timeHelper } from "./timeHelper";
import { categories } from "./categories";
import { users } from "./users";

export const operationTypeEnum = pgEnum("operation_type", [
  "purchase",
  "recurring",
]);

export const paymentTypeEnum = pgEnum("payment_type", [
  "credit_card",
  "pix",
  "boleto",
  "cash",
  "transfer",
]);

export const expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  totalAmount: numeric("total_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  installments: integer("installments").notNull(),
  date: timestamp("date").notNull(),
  notes: text("notes"),
  operationType: operationTypeEnum("operation_type")
    .notNull()
    .default("purchase"),
  paymentType: paymentTypeEnum("payment_type")
    .notNull()
    .default("credit_card"),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ...timeHelper,
});
