'use client'

import {
  useCreateTodo,
  useDeleteTodo,
  useToggleTodo,
  useTodos
} from '@/features/todos/hooks/useTodos'
import { TodoPageView } from './TodoPageView'

/**
 * Todo 画面の viewmodel。hooks（= Hono API）と純粋な UI（TodoPageView）を
 * 配線するだけで、表示ロジックは UI へ、サーバー処理は hooks へ委譲する。
 */
export function TodoPage() {
  const { data: todos = [], isLoading } = useTodos()
  const createTodo = useCreateTodo()
  const toggleTodo = useToggleTodo()
  const deleteTodo = useDeleteTodo()

  return (
    <TodoPageView
      todos={todos}
      isLoading={isLoading}
      creating={createTodo.isPending}
      onCreate={(title) => createTodo.mutate(title)}
      onToggle={(id, completed) => toggleTodo.mutate({ id, completed })}
      onDelete={(id) => deleteTodo.mutate(id)}
    />
  )
}
