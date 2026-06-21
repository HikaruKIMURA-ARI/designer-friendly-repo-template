import { TodoForm } from '@/features/todos/ui/TodoForm/TodoForm'
import { TodoList } from '@/features/todos/ui/TodoList/TodoList'
import type { Todo } from '@/lib/db/schema'

export type TodoPageViewProps = {
  todos: Todo[]
  isLoading?: boolean
  creating?: boolean
  onCreate: (title: string) => void
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
}

/**
 * Todo 画面の純粋な UI（props のみ）。データ取得もサーバー処理も知らず、
 * 渡された状態を描画してイベントを親へ通知するだけ。Storybook で Page 単位の
 * カタログ対象になるのはこの層。配線（hooks）は TodoPage が担う。
 */
export function TodoPageView({
  todos,
  isLoading = false,
  creating = false,
  onCreate,
  onToggle,
  onDelete
}: TodoPageViewProps) {
  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold text-foreground">Todo</h1>

      <TodoForm onSubmit={onCreate} disabled={creating} />

      {isLoading ? (
        <p className="py-8 text-center text-sm text-foreground-muted">読み込み中...</p>
      ) : (
        <TodoList todos={todos} onToggle={onToggle} onDelete={onDelete} />
      )}
    </main>
  )
}
