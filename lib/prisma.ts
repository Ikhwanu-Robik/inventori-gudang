import { PrismaClient } from '@prisma/client'
import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

// Ensure .env is loaded before accessing process.env.DATABASE_URL
if (!process.env.DATABASE_URL) {
  try {
    process.loadEnvFile()
  } catch {
    // Ignore error if .env file is missing
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.')
  }

  // Set WebSocket constructor for Node.js runtime environment
  neonConfig.webSocketConstructor = ws
  const adapter = new PrismaNeon({ connectionString })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
