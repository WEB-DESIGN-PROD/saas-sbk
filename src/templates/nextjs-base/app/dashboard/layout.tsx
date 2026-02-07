import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Vérifier la session avec Better Auth
  // const session = await auth()
  // if (!session) {
  //   redirect("/login")
  // }

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
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Retour au site</Link>
            </Button>
            <Button variant="outline" size="sm">
              Déconnexion
            </Button>
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
