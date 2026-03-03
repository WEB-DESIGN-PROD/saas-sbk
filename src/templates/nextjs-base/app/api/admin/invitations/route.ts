import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/client'
import { sendInvitationEmail } from '@/lib/email/client'

async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

// GET — liste des invitations en attente
export async function GET() {
  const session = await getSession()
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const invitations = await prisma.invitation.findMany({
    where: { accepted: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(invitations)
}

// POST — créer une invitation
export async function POST(req: Request) {
  const session = await getSession()
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { email, role } = await req.json()

  if (!email || !role) {
    return NextResponse.json({ error: 'Email et rôle requis' }, { status: 400 })
  }

  const validRoles = ['co-admin', 'editor', 'contributor']
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 })
  }

  // Vérifier si l'email existe déjà en tant qu'utilisateur
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: 'Cet email est déjà associé à un compte existant' }, { status: 409 })
  }

  // Vérifier si une invitation est déjà en cours
  const existingInvitation = await prisma.invitation.findUnique({ where: { email } })
  if (existingInvitation && !existingInvitation.accepted && existingInvitation.expiresAt > new Date()) {
    return NextResponse.json({ error: 'Une invitation est déjà en attente pour cet email' }, { status: 409 })
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // +7 jours

  const invitation = await prisma.invitation.upsert({
    where: { email },
    update: { role, invitedBy: session.user.id, expiresAt, accepted: false },
    create: { email, role, invitedBy: session.user.id, expiresAt },
  })

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    await sendInvitationEmail(email, role, appUrl)
  } catch (err) {
    console.error('Invitation email error:', err)
  }

  return NextResponse.json(invitation, { status: 201 })
}
