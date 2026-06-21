import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import type { Todo } from '@/lib/db/schema'
import { TodoPageView } from './TodoPageView'

/**
 * Page 単位のカタログ。shared / features の UI を組み合わせた「画面」を
 * 純粋な props だけで再現し、デザイナーが画面全体の状態を確認できるようにする。
 */
const meta = {
  title: 'pages/Todo',
  component: TodoPageView,
  parameters: { layout: 'fullscreen' },
  args: { onCreate: () => {}, onToggle: () => {}, onDelete: () => {} }
} satisfies Meta<typeof TodoPageView>

export default meta
type Story = StoryObj<typeof meta>

const sampleTodos: Todo[] = [
  { id: 1, title: '牛乳を買う', completed: false, createdAt: '2026-06-21 12:00:00' },
  { id: 2, title: '部屋を掃除する', completed: true, createdAt: '2026-06-21 09:00:00' }
]

/** 通常表示: いくつかの Todo がある状態 */
export const Default: Story = { args: { todos: sampleTodos } }

/** 空状態: Todo が 1 件もない状態 */
export const Empty: Story = { args: { todos: [] } }

/** 読み込み中: API からの取得待ち */
export const Loading: Story = { args: { todos: [], isLoading: true } }
