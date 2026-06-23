import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TodoDetailView } from './TodoDetailView'

const meta = {
  title: 'features/todos/TodoDetailView',
  component: TodoDetailView,
  parameters: { layout: 'fullscreen' },
  args: {
    taskId: 'TASK-2481',
    title: '認証フローのリファクタリング',
    description:
      'ログイン/サインアップの状態管理を整理し、トークン更新時の競合を解消する。エラーハンドリングを共通化し、失敗時のリトライ方針を明文化する。',
    completed: false,
    priority: 'high',
    due: '2026-06-30',
    createdLabel: '6/12',
    updatedLabel: '6/20',
    showMeta: true,
    deleted: false,
    onBack: () => {},
    onToggleComplete: () => {},
    onDelete: () => {},
    onRestore: () => {},
    onTitleChange: () => {},
    onDescriptionChange: () => {},
    onPriorityChange: () => {},
    onDueChange: () => {},
    onEdit: () => {}
  }
} satisfies Meta<typeof TodoDetailView>

export default meta
type Story = StoryObj<typeof meta>

export const InProgress: Story = {}

export const Completed: Story = {
  args: { completed: true }
}

export const MediumPriority: Story = {
  args: { priority: 'medium' }
}

export const LowPriority: Story = {
  args: { priority: 'low' }
}

export const WithoutMeta: Story = {
  args: { showMeta: false }
}

export const Deleted: Story = {
  args: { deleted: true }
}
