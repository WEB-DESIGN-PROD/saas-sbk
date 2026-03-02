import { NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/dal'
import { prisma } from '@/lib/db/client'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await verifyAdmin()
  const { id } = await params
  const body = await req.json()

  const allowed = ['accountType', 'subscriptionPlan', 'extraCredits']
  const data: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) data[key] = body[key]
  }

  const user = await prisma.user.update({ where: { id }, data })
  return NextResponse.json(user)
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await verifyAdmin()
  const { id } = await params
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
