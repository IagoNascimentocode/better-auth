import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { users } from "../schema/users";

// User schemas
export const userInsertSchema = createInsertSchema(users);
export const userSelectSchema = createSelectSchema(users);
