import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TodoForm } from './TodoForm'

const meta = {
  title: 'features/todos/TodoForm',
  component: TodoForm,
  args: { onSubmit: () => {} }
} satisfies Meta<typeof TodoForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }
