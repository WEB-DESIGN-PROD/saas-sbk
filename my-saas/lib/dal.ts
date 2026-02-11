import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/config'

/**
 * Vérifie la session utilisateur avec cache React
 * Cette fonction est mémorisée pendant le render pass pour éviter les appels multiples
 */
export const verifySession = cache(async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('better-auth.session_token')?.value

  if (!sessionToken) {
    redirect('/login')
  }

  // Construire les headers une seule fois
  const headerObj: Record<string, string> = {}
  cookieStore.getAll().forEach(cookie => {
    headerObj.cookie = headerObj.cookie
      ? `${headerObj.cookie}; ${cookie.name}=${cookie.value}`
      : `${cookie.name}=${cookie.value}`
  })

  const session = await auth.api.getSession({
    headers: headerObj as Headers
  })

  if (!session || !session.user) {
    redirect('/login')
  }

  return {
    isAuth: true,
    user: {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    }
  }
})
