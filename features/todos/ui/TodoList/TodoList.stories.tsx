import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TodoList } from './TodoList'

const meta = {
  title: 'features/todos/TodoList',
  component: TodoList,
  args: { onToggle: () => {}, onDelete: () => {} }
} satisfies Meta<typeof TodoList>

export default meta
type Story = StoryObj<typeof meta>

export const WithTodos: Story = {
  args: {
    todos: [
      { id: 1, title: '牛乳を買う', completed: false, createdAt: '2026-06-21 12:00:00' },
      { id: 2, title: '部屋を掃除する', completed: true, createdAt: '2026-06-21 09:00:00' }
    ]
  }
}

export const Empty: Story = { args: { todos: [] } }
