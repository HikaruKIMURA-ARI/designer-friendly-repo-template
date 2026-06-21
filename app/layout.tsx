import type { Metadata } from 'next'
import '@/shared/styles/globals.css'
import { QueryProvider } from '@/features/todos/hooks/QueryProvider'

export const metadata: Metadata = {
  title: 'Todo | design-work template',
  description: 'design-as-code 部署テンプレート'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className="bg-surface-muted text-foreground antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
