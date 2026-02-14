import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const startTime = Date.now()

export async function GET() {
  let databaseStatus = 'disconnected'
  let isHealthy = true

  try {
    await prisma.$queryRaw`SELECT 1`
    databaseStatus = 'connected'
  } catch (error) {
    isHealthy = false
    databaseStatus = 'disconnected'
  }

  const response = {
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.2.0',
    database: databaseStatus,
    uptime: Math.floor((Date.now() - startTime) / 1000)
  }

  return NextResponse.json(response, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  })
}
