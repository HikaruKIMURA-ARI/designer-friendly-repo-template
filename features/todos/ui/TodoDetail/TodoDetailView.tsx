import { useRef } from 'react'
import { Button } from '@/shared/ui/Button'

export type TodoPriority = 'high' | 'medium' | 'low'

export type TodoDetailViewProps = {
  /** 表示用のタスク ID（例: TASK-2481） */
  taskId: string
  title: string
  description: string
  completed: boolean
  priority: TodoPriority
  /** YYYY-MM-DD 形式の期日 */
  due: string
  /** 整形済みの作成ラベル（例: 6/12） */
  createdLabel?: string
  /** 整形済みの更新ラベル（例: 6/20） */
  updatedLabel?: string
  /** 作成 / 更新メタを表示するか */
  showMeta?: boolean
  /** 削除済み（取り消し可能）状態か */
  deleted?: boolean
  onBack: () => void
  onToggleComplete: () => void
  onDelete: () => void
  onRestore: () => void
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onPriorityChange: (value: TodoPriority) => void
  onDueChange: (value: string) => void
  /** 編集ボタン押下時の通知（フォーカス自体は View が担う） */
  onEdit?: () => void
}

const priorityDotClass: Record<TodoPriority, string> = {
  high: 'bg-danger',
  medium: 'bg-[#ffb020]',
  low: 'bg-foreground-muted'
}

/**
 * TODO 詳細ページの純粋な UI（props のみで制御）。データ取得もサーバー処理も知らず、
 * 渡された状態を描画して操作を親へ通知するだけ。タイトルのインライン編集・完了切替・
 * 優先度/期日の設定・削除/復元を 1 画面で扱うコンパクトレイアウト。
 * Storybook で Page 単位のカタログ対象になるのはこの層。配線（hooks）は親が担う。
 */
export function TodoDetailView({
  taskId,
  title,
  description,
  completed,
  priority,
  due,
  createdLabel,
  updatedLabel,
  showMeta = true,
  deleted = false,
  onBack,
  onToggleComplete,
  onDelete,
  onRestore,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onDueChange,
  onEdit
}: TodoDetailViewProps) {
  const titleRef = useRef<HTMLInputElement>(null)

  const handleEdit = () => {
    titleRef.current?.focus()
    titleRef.current?.select()
    onEdit?.()
  }

  if (deleted) {
    return (
      <div className="min-h-screen bg-surface px-8 py-10 text-foreground">
        <div className="mx-auto mt-20 flex max-w-[460px] flex-col gap-4 rounded-card border border-border bg-surface-muted px-10 py-11 text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-danger">deleted</div>
          <h2 className="m-0 text-xl font-bold">タスクを削除しました</h2>
          <p className="m-0 text-sm text-foreground-muted">この操作は取り消せます。</p>
          <div className="mt-1 flex justify-center">
            <Button variant="outline" onClick={onRestore}>
              元に戻す
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface px-8 py-10 text-foreground">
      <div
        data-screen-label="詳細 / コンパクト型"
        className="mx-auto flex max-w-[1120px] flex-col gap-4"
      >
        {/* ヘッダー：戻る + タスク ID */}
        <div className="mb-0.5 flex items-center gap-3.5">
          <button
            type="button"
            onClick={onBack}
            className="flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-[13px] text-foreground-muted transition hover:text-foreground"
          >
            <span className="text-[15px]">←</span> 戻る
          </button>
          <span className="font-mono text-xs tracking-[0.1em] text-primary">{taskId}</span>
        </div>

        {/* タイトル行：完了トグル + インライン編集 + アクション */}
        <div className="flex flex-wrap items-center gap-4 rounded-card border border-border bg-surface-muted px-6 py-5">
          <button
            type="button"
            onClick={onToggleComplete}
            aria-label={completed ? '未完了に戻す' : '完了にする'}
            aria-pressed={completed}
            className={`flex h-6 w-6 flex-none items-center justify-center rounded-[7px] border-2 border-primary p-0 text-[15px] font-bold transition ${
              completed
                ? 'bg-primary text-primary-foreground shadow-[0_0_14px_-4px_var(--color-primary)]'
                : 'bg-transparent'
            }`}
          >
            {completed ? '✓' : ''}
          </button>

          <input
            ref={titleRef}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            aria-label="タイトル"
            className="-ml-2 min-w-[200px] flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 text-2xl font-bold leading-tight tracking-[-0.01em] text-foreground outline-none focus:border-border focus:bg-surface"
          />

          <div className="flex flex-none gap-2">
            {completed ? (
              <Button variant="outline" onClick={onToggleComplete}>
                未完了に戻す
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={onToggleComplete}
                className="shadow-[0_0_20px_-6px_var(--color-primary)]"
              >
                完了にする
              </Button>
            )}
            <Button variant="outline" onClick={handleEdit}>
              編集
            </Button>
            <Button
              variant="outline"
              onClick={onDelete}
              className="border-danger/45 text-danger hover:bg-danger/10"
            >
              削除
            </Button>
          </div>
        </div>

        {/* メタ情報カード群 */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
          {/* ステータス */}
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface-muted px-4 py-3.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground-muted">
              ステータス
            </span>
            {completed ? (
              <span className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary">
                ● 完了
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-foreground-muted">
                ● 進行中
              </span>
            )}
          </div>

          {/* 優先度 */}
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface-muted px-4 py-3.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground-muted">
              優先度
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 flex-none rounded-full ${priorityDotClass[priority]}`}
              />
              <select
                value={priority}
                onChange={(e) => onPriorityChange(e.target.value as TodoPriority)}
                aria-label="優先度"
                className="flex-1 cursor-pointer border-0 bg-transparent text-sm font-semibold text-foreground outline-none"
              >
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
          </div>

          {/* 期日 */}
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface-muted px-4 py-3.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground-muted">
              期日
            </span>
            <input
              type="date"
              value={due}
              onChange={(e) => onDueChange(e.target.value)}
              aria-label="期日"
              className="cursor-pointer border-0 bg-transparent font-mono text-[13px] text-foreground outline-none"
            />
          </div>

          {/* 作成 / 更新 */}
          {showMeta && (
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface-muted px-4 py-3.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground-muted">
                作成 / 更新
              </span>
              <span className="font-mono text-[13px] text-foreground">
                {createdLabel ?? '—'} → {updatedLabel ?? '—'}
              </span>
            </div>
          )}
        </div>

        {/* 説明 */}
        <div className="flex flex-col gap-2.5 rounded-xl border border-border bg-surface-muted px-5 py-4.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-foreground-muted">
            説明
          </span>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={6}
            placeholder="説明を追加…"
            aria-label="説明"
            className="w-full resize-y rounded-control border border-border bg-surface px-3.5 py-3 text-sm leading-relaxed text-foreground outline-none placeholder:text-foreground-muted focus:border-primary"
          />
        </div>
      </div>
    </div>
  )
}
