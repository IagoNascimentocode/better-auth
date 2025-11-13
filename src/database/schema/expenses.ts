import { integer, numeric, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { timeHelper } from "./timeHelper";
import { categories } from "./categories";
import { users } from "./users";

export const expenses = pgTable('expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  installments: integer('installments').notNull(),
  date: timestamp('date').notNull(),
  notes: text('notes'),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  ...timeHelper,
});
