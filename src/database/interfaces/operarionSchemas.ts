import { users } from "../schema/users";
import { categories } from "../schema/categories";
import { transactions } from "../schema/transactions";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

// User schemas
export const userInsertSchema = createInsertSchema(users);
export const userSelectSchema = createSelectSchema(users);

// Category schemas
export const categoryInsertSchema = createInsertSchema(categories);
export const categorySelectSchema = createSelectSchema(categories);

// Transaction schemas
export const transactionInsertSchema = createInsertSchema(transactions);
export const transactionSelectSchema = createSelectSchema(transactions);
