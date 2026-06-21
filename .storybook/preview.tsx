import React from 'react'
import type { Preview } from '@storybook/nextjs-vite'
import '../shared/styles/globals.css'

const preview: Preview = {
  parameters: {
    // 既定の canvas padding を切り、下の decorator で余白・背景を一元管理する。
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    // 本番の app/layout.tsx の body と同じ前提（ダークサーフェス）を再現する。
    // Storybook は layout.tsx を読まないため、ここで明示しないと白背景になる。
    backgrounds: {
      default: 'surface-muted',
      values: [
        { name: 'surface-muted', value: '#0e1c1a' },
        { name: 'surface', value: '#06100f' }
      ]
    }
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-surface-muted p-6 text-foreground antialiased">
        <Story />
      </div>
    )
  ]
}

export default preview
