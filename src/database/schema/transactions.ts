import { pgTable, uuid, varchar, decimal, timestamp, text, pgEnum } from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { timeHelper } from "./timeHelper";
import { users } from "./users";

export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense']);

export const transactions = pgTable('transactions', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 256 }).notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    type: transactionTypeEnum('type').notNull(),
    date: timestamp('date').notNull(),
    notes: text('notes'),
    categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    ...timeHelper,
});
