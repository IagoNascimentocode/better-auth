import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { investmentTransactions } from "../schema/investmentTransactions";
import { installments } from "../schema/installments";
import { transactions } from "../schema/transactions";
import { categories } from "../schema/categories";
import { expenses } from "../schema/expenses";
import { assets } from "../schema/assets";
import { users } from "../schema/users";

export const userInsertSchema = createInsertSchema(users);
export const userSelectSchema = createSelectSchema(users);

export const assetInsertSchema = createInsertSchema(assets);
export const assetSelectSchema = createSelectSchema(assets);

export const expenseInsertSchema = createInsertSchema(expenses);
export const expenseSelectSchema = createSelectSchema(expenses);

export const categoryInsertSchema = createInsertSchema(categories);
export const categorySelectSchema = createSelectSchema(categories);

export const transactionInsertSchema = createInsertSchema(transactions);
export const transactionSelectSchema = createSelectSchema(transactions);

export const installmentInsertSchema = createInsertSchema(installments);
export const installmentSelectSchema = createSelectSchema(installments);

export const investmentTransactionInsertSchema = createInsertSchema(investmentTransactions);
export const investmentTransactionSelectSchema = createSelectSchema(investmentTransactions);
