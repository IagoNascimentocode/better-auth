import { users } from "./users";
import { timeHelper } from "./timeHelper";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  ...timeHelper,
});
