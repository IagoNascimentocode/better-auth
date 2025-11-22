import {
  pgTable,
  text,
  uuid,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { timeHelper } from "./timeHelper";

export const assetTypeEnum = pgEnum('asset_type', [
  'fii',
  'stock',
  'crypto',
  'fixed_income',
  'other'
]);

export const assets = pgTable('investment_assets',{
  id:uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  type: assetTypeEnum('type').notNull(),
  description: text('description'),
  ...timeHelper,
})
