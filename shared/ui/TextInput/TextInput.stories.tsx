import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TextInput } from './TextInput'

const meta = {
  title: 'shared/ui/TextInput',
  component: TextInput,
  args: { placeholder: 'やることを入力' }
} satisfies Meta<typeof TextInput>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}
export const WithValue: Story = { args: { defaultValue: '牛乳を買う' } }
