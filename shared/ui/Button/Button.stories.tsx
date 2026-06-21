import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from './Button'

const meta = {
  title: 'shared/ui/Button',
  component: Button,
  args: { children: 'ボタン' }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { variant: 'primary' } }
export const Danger: Story = { args: { variant: 'danger', children: '削除' } }
export const Ghost: Story = { args: { variant: 'ghost', children: 'キャンセル' } }
export const Disabled: Story = { args: { disabled: true } }
