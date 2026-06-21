import { zValidator } from '@hono/zod-validator'
import { desc, eq } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '@/lib/db/client'
import { todos } from '@/lib/db/schema'

/**
 * 作成入力のバリデーションスキーマ。
 * テーブル定義（todos）から導出し、title は必須・空文字不可とする。
 */
const createTodoSchema = createInsertSchema(todos, {
  title: (schema) => schema.min(1)
}).pick({ title: true })

/**
 * 更新入力のバリデーションスキーマ。
 * title / completed はいずれも任意で、渡されたフィールドのみ部分更新する。
 */
const updateTodoSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional()
})

/**
 * Todos の CRUD ビジネスロジック。
 * 振る舞いは TDD（tdd-workflow）で 1 つずつ実装する。
 */
export const todosRoute = new Hono()
  .get('/', async (c) => {
    const result = await db.select().from(todos).orderBy(desc(todos.createdAt))
    return c.json(result)
  })
  .post('/', zValidator('json', createTodoSchema), async (c) => {
    const { title } = c.req.valid('json')
    const [created] = await db.insert(todos).values({ title }).returning()
    return c.json(created, 201)
  })
  .patch('/:id', zValidator('json', updateTodoSchema), async (c) => {
    const id = Number(c.req.param('id'))
    const patch = c.req.valid('json')
    const [updated] = await db.update(todos).set(patch).where(eq(todos.id, id)).returning()
    if (!updated) return c.json({ error: 'Not Found' }, 404)
    return c.json(updated)
  })
  .delete('/:id', async (c) => {
    const id = Number(c.req.param('id'))
    const [deleted] = await db.delete(todos).where(eq(todos.id, id)).returning()
    if (!deleted) return c.json({ error: 'Not Found' }, 404)
    return c.json({ success: true })
  })
