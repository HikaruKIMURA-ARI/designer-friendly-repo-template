import { Button } from '@/shared/ui/Button'
import { Checkbox } from '@/shared/ui/Checkbox'
import type { Todo } from '@/lib/db/schema'

export type TodoItemProps = {
  todo: Todo
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
}

/**
 * 1 件の Todo を表示する純粋な UI。状態は持たず、操作は props のコールバックに委譲する。
 */
export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li
      data-testid="todo-item"
      className="flex items-center gap-3 rounded-control border border-border bg-surface px-3 py-control"
    >
      <Checkbox
        checked={todo.completed}
        aria-label={`${todo.title} を完了にする`}
        onChange={(e) => onToggle(todo.id, e.target.checked)}
      />
      <span
        className={`flex-1 text-sm ${todo.completed ? 'text-foreground-muted line-through' : 'text-foreground'}`}
      >
        {todo.title}
      </span>
      <Button variant="ghost" aria-label={`${todo.title} を削除`} onClick={() => onDelete(todo.id)}>
        削除
      </Button>
    </li>
  )
}
