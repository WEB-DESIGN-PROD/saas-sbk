import { NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/dal'
import { prisma } from '@/lib/db/client'

export async function GET() {
  await verifyAdmin()

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000)

  const [totalUsers, newToday, activeSessions, verifiedUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.session.count({ where: { updatedAt: { gte: fiveMinsAgo } } }),
    prisma.user.count({ where: { emailVerified: true } }),
  ])

  return NextResponse.json({ totalUsers, newToday, activeSessions, verifiedUsers })
}
