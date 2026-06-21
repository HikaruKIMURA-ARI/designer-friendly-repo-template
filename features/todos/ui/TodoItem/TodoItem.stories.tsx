import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TodoItem } from './TodoItem'

const meta = {
  title: 'features/todos/TodoItem',
  component: TodoItem,
  args: {
    onToggle: () => {},
    onDelete: () => {}
  }
} satisfies Meta<typeof TodoItem>

export default meta
type Story = StoryObj<typeof meta>

const base = { id: 1, title: '牛乳を買う', createdAt: '2026-06-21 09:00:00' }

export const Active: Story = {
  args: { todo: { ...base, completed: false } }
}
export const Completed: Story = {
  args: { todo: { ...base, completed: true } }
}
