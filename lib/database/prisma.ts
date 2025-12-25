import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

const prisma = global.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  errorFormat: 'pretty',
})

if (process.env.NODE_ENV === 'development') {
  global.__prisma = prisma
}

export { prisma }