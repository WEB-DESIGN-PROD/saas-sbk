import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes protégées (nécessitent authentification)
const protectedRoutes = ['/dashboard']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Vérifier si la route est protégée
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

  // Vérifier le cookie de session Better Auth
  const sessionToken = request.cookies.get('better-auth.session_token')?.value
  const isAuthenticated = !!sessionToken

  // Rediriger vers /login SEULEMENT si sur une route protégée sans auth
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', path)
    return NextResponse.redirect(url)
  }

  // NE PAS rediriger automatiquement vers /dashboard
  // L'utilisateur peut rester sur la page d'accueil même s'il est authentifié

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
