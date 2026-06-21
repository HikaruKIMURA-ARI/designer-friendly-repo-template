'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { todosApi } from '@/lib/hono-client'
import type { Todo } from '@/lib/db/schema'

const todosKey = ['todos'] as const

/**
 * Todo 一覧を取得する。サーバー処理は書かず、Hono API（hc）を呼ぶだけ。
 */
export function useTodos() {
  return useQuery<Todo[]>({
    queryKey: todosKey,
    queryFn: async () => {
      const res = await todosApi.$get()
      return (await res.json()) as Todo[]
    }
  })
}

/**
 * Todo を作成し、成功時に一覧を再取得（invalidate）する。
 */
export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (title: string) => {
      const res = await todosApi.$post({ json: { title } })
      if (!res.ok) throw new Error('Failed to create todo')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todosKey })
  })
}

/**
 * Todo の完了状態を更新し、成功時に一覧を再取得する。
 */
export function useToggleTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: number; completed: boolean }) => {
      const res = await todosApi[':id'].$patch({
        param: { id: String(input.id) },
        json: { completed: input.completed }
      })
      if (!res.ok) throw new Error('Failed to update todo')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todosKey })
  })
}

/**
 * Todo を削除し、成功時に一覧を再取得する。
 */
export function useDeleteTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await todosApi[':id'].$delete({ param: { id: String(id) } })
      if (!res.ok) throw new Error('Failed to delete todo')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todosKey })
  })
}
