import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'shared/ui/Checkbox',
  component: Checkbox
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Unchecked: Story = { args: { checked: false } }
export const Checked: Story = { args: { checked: true } }
