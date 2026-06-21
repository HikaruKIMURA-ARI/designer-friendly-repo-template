import { defineConfig, devices } from '@playwright/test'

/**
 * E2E は Jest 等の結合テストで再現困難なフロー（画面遷移・実ブラウザ操作）に限定する。
 * 開発 DB（local.db）と単体テスト（.test.db）の双方から隔離するため、
 * E2E 専用の .e2e.db を使い、起動前にマイグレーションを適用する。
 */
const E2E_DATABASE_URL = 'file:./.e2e.db'
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'bun run db:migrate && bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      TURSO_DATABASE_URL: E2E_DATABASE_URL
    }
  }
})
