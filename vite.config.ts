import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/deep-learning-interactive-lab/' : '/',
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
})
