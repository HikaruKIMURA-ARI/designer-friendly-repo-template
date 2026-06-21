import type { StorybookConfig } from '@storybook/nextjs-vite'

const config: StorybookConfig = {
  stories: ['../shared/**/*.stories.@(ts|tsx)', '../features/**/*.stories.@(ts|tsx)'],
  addons: [],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {}
  }
}

export default config
