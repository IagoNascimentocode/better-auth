import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { installments } from "../schema/installments";
import { transactions } from "../schema/transactions";
import { categories } from "../schema/categories";
import { expenses } from "../schema/expenses";
import { users } from "../schema/users";

export const userInsertSchema = createInsertSchema(users);
export const userSelectSchema = createSelectSchema(users);

export const categoryInsertSchema = createInsertSchema(categories);
export const categorySelectSchema = createSelectSchema(categories);

export const transactionInsertSchema = createInsertSchema(transactions);
export const transactionSelectSchema = createSelectSchema(transactions);

export const expenseInsertSchema = createInsertSchema(expenses);
export const expenseSelectSchema = createSelectSchema(expenses);

export const installmentInsertSchema = createInsertSchema(installments);
export const installmentSelectSchema = createSelectSchema(installments);
