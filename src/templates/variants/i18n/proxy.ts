import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Exclure : API, assets Next.js, dashboard, admin, blog (non-localisé), RSS
  // Les pages auth (login, register, verify-email, etc.) sont dans app/[locale]/ → incluses dans le middleware
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|dashboard|admin|blog|feed.xml).*)'],
}
