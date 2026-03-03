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

  const STAFF_ROLES = ['admin', 'co-admin', 'editor', 'contributor', 'member']
  const allowed = ['accountType', 'subscriptionPlan', 'extraCredits']
  const data: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) data[key] = body[key]
  }
  // Seul l'admin peut changer le rôle, et pas vers "admin"
  if ('role' in body && typeof body.role === 'string' && STAFF_ROLES.includes(body.role) && body.role !== 'admin') {
    data.role = body.role
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
