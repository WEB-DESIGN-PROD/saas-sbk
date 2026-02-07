import Link from "next/link"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogoutButton } from "@/components/auth/logout-button"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Vérifier la session Better Auth
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('better-auth.session_token')

  if (!sessionToken) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xl font-bold">
              {{PROJECT_NAME}}
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Tableau de bord
              </Link>
              <Link
                href="/dashboard/settings"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Paramètres
              </Link>
              <Link
                href="/dashboard/account"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Compte
              </Link>
              {/* TODO: Afficher si Stripe activé */}
              {/* <Link
                href="/dashboard/billing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Facturation
              </Link> */}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Retour au site</Link>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 {{PROJECT_NAME}}
        </div>
      </footer>
    </div>
  )
}
