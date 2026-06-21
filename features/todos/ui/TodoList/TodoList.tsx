import { TodoItem } from '@/features/todos/ui/TodoItem/TodoItem'
import type { Todo } from '@/lib/db/schema'

export type TodoListProps = {
  todos: Todo[]
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
}

/**
 * Todo の一覧を表示する純粋な UI。空状態の表示も担う。
 */
export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="py-8 text-center text-sm text-foreground-muted">まだ Todo はありません</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}
