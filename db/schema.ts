import { pgTable, text, jsonb, timestamp, integer } from 'drizzle-orm/pg-core';
export const workspaces = pgTable('workspaces', {
  userId: text('user_id').primaryKey(),
  data: jsonb('data').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const wallets = pgTable('wallets', {
  userId: text('user_id').primaryKey(),
  balance: integer('balance').default(0).notNull(),
});
