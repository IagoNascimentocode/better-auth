import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { users } from "../schema/users";
import { categories } from "../schema/categories";

// User schemas
export const userInsertSchema = createInsertSchema(users);
export const userSelectSchema = createSelectSchema(users);

// Category schemas
export const categoryInsertSchema = createInsertSchema(categories);
export const categorySelectSchema = createSelectSchema(categories);
