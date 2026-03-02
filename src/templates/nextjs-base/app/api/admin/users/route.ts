import { NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/dal'
import { prisma } from '@/lib/db/client'

export async function GET() {
  await verifyAdmin()

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      emailVerified: true,
      role: true,
      accountType: true,
      subscriptionPlan: true,
      extraCredits: true,
      createdAt: true,
      sessions: {
        orderBy: { updatedAt: 'desc' },
        take: 1,
        select: { updatedAt: true },
      },
    },
  })

  return NextResponse.json(users)
}
