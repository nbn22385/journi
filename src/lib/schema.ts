import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const entries = pgTable('entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title'),
  content: text('content').notNull(),
  mood: integer('mood').notNull().default(3),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
