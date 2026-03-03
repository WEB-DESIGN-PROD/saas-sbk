import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/client'

// DELETE — annuler une invitation
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params

  await prisma.invitation.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
