import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          {{PROJECT_NAME}}
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium hover:underline">
            Tarifs
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline">
            À propos
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Connexion
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">
              Créer un compte
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
