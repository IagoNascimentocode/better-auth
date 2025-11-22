import {
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { assets } from "./assets";
import { timeHelper } from "./timeHelper";

export const investmentOperationTypeEnum = pgEnum('investmentOperationTypeEnum', ['buy', 'sell']);

export const investmentTransactions = pgTable('investment_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: timestamp('date').notNull(),
  operationType: investmentOperationTypeEnum('operation_type').notNull(),
  amount: numeric('amount', { precision: 20, scale: 10 }).notNull(),
  price: numeric('price', { precision: 20, scale: 10 }).notNull(),
  total: numeric('total', { precision: 20, scale: 10 }).notNull(),
  isCashMovement: boolean('is_cash_movement').default(true).notNull(),
  notes: text('notes'),
  ...timeHelper,
});
