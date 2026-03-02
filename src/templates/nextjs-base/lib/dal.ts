import 'server-only'
import { cache } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'

/**
 * Vérifie la session utilisateur avec cache React
 * Cette fonction est mémorisée pendant le render pass pour éviter les appels multiples
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
    user: {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image ?? null,
    }
  }
})
