import {
  boolean,
  decimal,
  integer,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { timeHelper } from "./timeHelper";
import { expenses, paymentTypeEnum } from "./expenses";

export const installments = pgTable("installments", {
  id: uuid("id").defaultRandom().primaryKey(),
  installmentNum: integer("installment_num").notNull(),
  dueDate: timestamp("due_date").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paid: boolean("paid").default(false).notNull(),
  paymentType: paymentTypeEnum("payment_type")
    .notNull()
    .default("credit_card"),
  expenseId: uuid("expense_id")
    .notNull()
    .references(() => expenses.id, { onDelete: "cascade" }),
  ...timeHelper,
});
