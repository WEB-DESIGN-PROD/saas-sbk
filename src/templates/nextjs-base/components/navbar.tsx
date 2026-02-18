"use client"

import Link from "next/link"
import { useSession } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { User, LayoutDashboard, Globe } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Langues disponibles (définies à la génération du projet)
const AVAILABLE_LANGUAGES = "{{AVAILABLE_LANGUAGES}}".split(",").filter(Boolean)
const showLangToggle = AVAILABLE_LANGUAGES.length > 1

export function Navbar() {
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">

        {/* Gauche : Logo */}
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold">
            {{PROJECT_NAME}}
          </Link>
        </div>

        {/* Centre : Liens de navigation */}
        <nav className="flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            À propos
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Tarifs
          </Link>
        </nav>

        {/* Droite : Actions */}
        <div className="flex flex-1 items-center justify-end gap-2">

          {/* Bouton Dashboard (visible uniquement si connecté) */}
          {isLoggedIn && (
            <Button variant="default" size="sm" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          )}

          {/* Bouton Créer un compte (visible uniquement si non connecté) */}
          {!isLoggedIn && (
            <Button size="sm" asChild>
              <Link href="/register">Créer un compte</Link>
            </Button>
          )}

          {/* Bouton User icon → /login ou /dashboard/account */}
          <Button variant="outline" size="icon" asChild>
            <Link href={isLoggedIn ? "/dashboard/account" : "/login"}>
              <User className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">
                {isLoggedIn ? "Mon compte" : "Connexion"}
              </span>
            </Link>
          </Button>

          {/* Bouton langue (visible uniquement si plusieurs langues configurées) */}
          {showLangToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Globe className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Changer la langue</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <DropdownMenuItem key={lang}>
                    {lang.toUpperCase()}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Toggle thème (toujours à l'extrême droite) */}
          <ThemeToggle />
        </div>

      </div>
    </header>
  )
}
