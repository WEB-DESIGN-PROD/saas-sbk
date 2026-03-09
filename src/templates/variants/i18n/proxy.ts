import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Exclure : API, assets Next.js, pages auth, dashboard, admin, blog (non-localisé), RSS
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|dashboard|admin|login|register|verify-email|reset-password|forgot-password|magic-link|otp|blog|feed.xml).*)'],
}
