import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * todos テーブル。これがドメインの単一の真実であり、
 * drizzle-zod を通して API のバリデーションスキーマもここから導出する。
 */
export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`)
})

export type Todo = typeof todos.$inferSelect
export type NewTodo = typeof todos.$inferInsert
