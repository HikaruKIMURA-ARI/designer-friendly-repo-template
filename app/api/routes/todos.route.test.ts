import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { app } from '@/app/api/app'
import { resetTodos, seedTodo } from '@/test-utils/db'

/**
 * Todo CRUD API のビジネスロジックに対する古典学派のブラックボックステスト。
 *
 * テスト対象は app/api/app.ts の Hono アプリ（`app`）を `app.request()` で叩いた結果。
 * 共有依存である実テスト DB（libSQL）は実体を使い、beforeEach/afterEach の
 * resetTodos() で順次実行による隔離を行う想定（Phase 2 で配線する）。
 *
 * ここ（Phase 1）では検証すべき振る舞いを describe で抽象度ごとに分類し、
 * it.todo() で列挙するのみ。テスト本体・アサーション・実装は一切書かない。
 */
describe('Todo CRUD API', () => {
  // 共有依存である実 DB を順次実行で隔離する。各ケースの前後で必ずテーブルを空にする。
  beforeEach(resetTodos)
  afterEach(resetTodos)

  // 一覧取得の振る舞い。何が返り、どの順序で並ぶかを保証する。
  describe('GET /api/todos: 登録済みの todo を一覧で返す', () => {
    describe('複数の todo が登録されているときすべての todo を返す', () => {
      // Arrange: 異なる 2 件を投入しておく（前提は it の外に置く）。
      beforeEach(async () => {
        await seedTodo({ title: '牛乳を買う' })
        await seedTodo({ title: '部屋を掃除する' })
      })

      it('登録済みのすべての todo の title が一覧に含まれる', async () => {
        // Act
        const response = await app.request('/api/todos')

        // Assert
        expect(response.status).toBe(200)
        const body = (await response.json()) as { title: string }[]
        const titles = body.map((todo) => todo.title)
        expect(titles).toContain('牛乳を買う')
        expect(titles).toContain('部屋を掃除する')
        expect(body).toHaveLength(2)
      })
    })

    describe('作成日時の異なる複数の todo があるとき createdAt の新しい順に並べて返す', () => {
      // Arrange: createdAt を明示して順序を確定させる（current_timestamp は秒精度のため）。
      beforeEach(async () => {
        await seedTodo({ title: '古いタスク', createdAt: '2026-06-21 09:00:00' })
        await seedTodo({ title: '新しいタスク', createdAt: '2026-06-21 12:00:00' })
      })

      it('createdAt が新しい todo が一覧の先頭に並ぶ', async () => {
        // Act
        const response = await app.request('/api/todos')

        // Assert
        expect(response.status).toBe(200)
        const body = (await response.json()) as { title: string }[]
        expect(body.map((todo) => todo.title)).toEqual(['新しいタスク', '古いタスク'])
      })
    })

    describe('todo が一件も登録されていないとき空の一覧を返す', () => {
      // Arrange: 何も投入しない（beforeEach の resetTodos により空の状態）。

      it('登録が無いとき空配列を返す', async () => {
        // Act
        const response = await app.request('/api/todos')

        // Assert
        expect(response.status).toBe(200)
        const body = (await response.json()) as unknown[]
        expect(body).toEqual([])
      })
    })
  })

  // 新規作成の振る舞い。正常系の永続化・レスポンスと、バリデーション異常系を保証する。
  describe('POST /api/todos: todo を新規作成する', () => {
    describe('正常な title を渡したとき作成して 201 で返す', () => {
      // Arrange: 投入は不要（beforeEach の resetTodos で空の状態）。作成入力は各 it の Act に直書きする。

      it('有効な title を渡すと作成した todo を 201 で返す', async () => {
        // Act
        const response = await app.request('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: '牛乳を買う' })
        })

        // Assert
        expect(response.status).toBe(201)
        const body = (await response.json()) as {
          id: number
          title: string
        }
        expect(body.title).toBe('牛乳を買う')
        expect(typeof body.id).toBe('number')
      })

      it('作成直後の todo は completed が false である', async () => {
        // Act
        const response = await app.request('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: '牛乳を買う' })
        })

        // Assert
        expect(response.status).toBe(201)
        const body = (await response.json()) as { completed: boolean }
        expect(body.completed).toBe(false)
      })

      it('作成後に一覧取得するとその todo が永続化されている', async () => {
        // Act
        await app.request('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: '牛乳を買う' })
        })

        // Assert
        const listResponse = await app.request('/api/todos')
        expect(listResponse.status).toBe(200)
        const list = (await listResponse.json()) as { title: string }[]
        expect(list.map((todo) => todo.title)).toContain('牛乳を買う')
      })
    })

    describe('title が不正なときは作成せず 400 を返す', () => {
      // Arrange: 投入は不要（beforeEach の resetTodos で空の状態）。不正入力は各 it の Act に直書きする。

      it('title が空文字のとき 400 を返す', async () => {
        // Act
        const response = await app.request('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: '' })
        })

        // Assert
        expect(response.status).toBe(400)
      })

      it('title フィールドが欠落しているとき 400 を返す', async () => {
        // Act
        const response = await app.request('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        })

        // Assert
        expect(response.status).toBe(400)
      })
    })
  })

  // 更新の振る舞い。部分更新（title / completed 個別）と、対象なしの異常系を保証する。
  describe('PATCH /api/todos/:id: 既存の todo を更新する', () => {
    describe('存在する id を指定したとき更新後の todo を返す', () => {
      // Arrange: 更新対象を 1 件投入し、その id を各 it で使う（前提は it の外に置く）。
      // title='牛乳を買う', completed=false の初期状態を基準に、部分更新の差分を検証する。
      let target: { id: number; title: string; completed: boolean }
      beforeEach(async () => {
        target = await seedTodo({ title: '牛乳を買う', completed: false })
      })

      it('title のみを渡すと更新後の todo の title が変わる', async () => {
        // Act
        const response = await app.request(`/api/todos/${target.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'パンを買う' })
        })

        // Assert
        expect(response.status).toBe(200)
        const body = (await response.json()) as { id: number; title: string }
        expect(body.title).toBe('パンを買う')
      })

      it('completed のみを渡すと更新後の todo の completed が変わる', async () => {
        // Act
        const response = await app.request(`/api/todos/${target.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: true })
        })

        // Assert
        expect(response.status).toBe(200)
        const body = (await response.json()) as {
          id: number
          completed: boolean
        }
        expect(body.completed).toBe(true)
      })

      it('completed のみを渡したとき title は元のまま変更されない', async () => {
        // Act
        const response = await app.request(`/api/todos/${target.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: true })
        })

        // Assert
        expect(response.status).toBe(200)
        const body = (await response.json()) as { title: string }
        expect(body.title).toBe('牛乳を買う')
      })
    })

    describe('存在しない id を指定したときは 404 を返す', () => {
      // Arrange: 投入は不要（beforeEach の resetTodos で空の状態）。存在しない十分大きな id を使う。

      it('該当する todo が存在しない id を渡すと 404 を返す', async () => {
        // Act
        const response = await app.request('/api/todos/999999', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: '存在しない' })
        })

        // Assert
        expect(response.status).toBe(404)
      })
    })
  })

  // 削除の振る舞い。正常な削除の永続化と、対象なしの異常系を保証する。
  describe('DELETE /api/todos/:id: 既存の todo を削除する', () => {
    describe('存在する id を指定したとき削除して成功を返す', () => {
      // Arrange: 削除対象を 1 件投入し、その id を各 it で使う（前提は it の外に置く）。
      let target: { id: number; title: string; completed: boolean }
      beforeEach(async () => {
        target = await seedTodo({ title: '牛乳を買う' })
      })

      it('存在する id を削除すると成功レスポンスを 200 で返す', async () => {
        // Act
        const response = await app.request(`/api/todos/${target.id}`, {
          method: 'DELETE'
        })

        // Assert
        expect(response.status).toBe(200)
        const body = (await response.json()) as { success: boolean }
        expect(body.success).toBe(true)
      })

      it('削除後に一覧取得するとその todo が存在しない', async () => {
        // Act
        await app.request(`/api/todos/${target.id}`, {
          method: 'DELETE'
        })

        // Assert
        const listResponse = await app.request('/api/todos')
        expect(listResponse.status).toBe(200)
        const list = (await listResponse.json()) as { title: string }[]
        expect(list.map((todo) => todo.title)).not.toContain('牛乳を買う')
      })
    })

    describe('存在しない id を指定したときは 404 を返す', () => {
      // Arrange: 投入は不要（beforeEach の resetTodos で空の状態）。存在しない十分大きな id を使う。

      it('該当する todo が存在しない id を渡すと 404 を返す', async () => {
        // Act
        const response = await app.request('/api/todos/999999', {
          method: 'DELETE'
        })

        // Assert
        expect(response.status).toBe(404)
      })
    })
  })
})
