import 'server-only'
import { cache } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/client'
import type { AccountType, SubscriptionPlan, UserPlan, Role } from '@/types'
import { STAFF_ROLES } from '@/types'

/**
 * Vérifie la session utilisateur avec cache React.
 * Mémorisée pendant le render pass pour éviter les appels multiples.
 */
export const verifySession = cache(async () => {
  const requestHeaders = await headers()

  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session || !session.user) {
    redirect('/login')
  }

  // Bloquer l'accès si l'email n'est pas vérifié (uniquement si emailVerification activé)
  if (session.user.emailVerified === false) {
    redirect(`/verify-email?email=${encodeURIComponent(session.user.email)}`)
  }

  const role = ((session.user as any).role ?? 'member') as Role
  const impersonatedBy = (session.session as any).impersonatedBy as string | undefined

  return {
    isAuth: true,
    userId: session.user.id,
    role,
    impersonatedBy,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image ?? null,
    }
  }
})

/**
 * Vérifie que l'utilisateur est super admin.
 * Redirige vers /dashboard si ce n'est pas le cas.
 */
export const verifyAdmin = cache(async () => {
  const session = await verifySession()
  if (session.role !== 'admin') {
    // Redirige vers /admin (et non /dashboard) pour éviter une boucle
    // de redirections avec les rôles staff qui sont renvoyés vers /admin
    redirect(STAFF_ROLES.includes(session.role) ? '/admin' : '/dashboard')
  }
  return session
})

/**
 * Vérifie que l'utilisateur a un des rôles autorisés.
 * Redirige vers /dashboard si ce n'est pas le cas.
 * Usage : await verifyRole(['admin', 'co-admin'])
 */
export const verifyRole = cache(async (allowedRoles: Role[]) => {
  const session = await verifySession()
  if (!allowedRoles.includes(session.role)) {
    redirect('/dashboard')
  }
  return session
})

/**
 * Vérifie que l'utilisateur est un membre du staff (tout rôle sauf "member").
 * Redirige vers /dashboard si ce n'est pas le cas.
 */
export const verifyStaff = cache(async () => {
  const session = await verifySession()
  if (!STAFF_ROLES.includes(session.role)) {
    redirect('/dashboard')
  }
  return session
})

/**
 * Récupère le plan et les crédits d'un utilisateur depuis la base de données.
 * Mémorisée pendant le render pass.
 */
export const getUserPlan = cache(async (userId: string): Promise<UserPlan> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      accountType: true,
      subscriptionPlan: true,
      extraCredits: true,
    },
  })

  return {
    accountType: (user?.accountType ?? 'Free') as AccountType,
    subscriptionPlan: (user?.subscriptionPlan ?? null) as SubscriptionPlan,
    extraCredits: user?.extraCredits ?? 0,
  }
})
