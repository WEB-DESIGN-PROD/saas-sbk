import 'server-only'
import { cache } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/client'
import type { AccountType, SubscriptionPlan, UserPlan } from '@/types'

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

  return {
    isAuth: true,
    userId: session.user.id,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image ?? null,
    }
  }
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
