import { defineConfig } from '@prisma/config'

if (!process.env.DATABASE_URL) {
  try {
    process.loadEnvFile()
  } catch {
    // Ignore error
  }
}

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || '',
  },
})
