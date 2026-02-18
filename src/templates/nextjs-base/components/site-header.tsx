"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LogOut, Globe } from "lucide-react"
import { signOut } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Langues disponibles (définies à la génération du projet)
const AVAILABLE_LANGUAGES = "{{AVAILABLE_LANGUAGES}}".split(",").filter(Boolean)
const showLangToggle = AVAILABLE_LANGUAGES.length > 1

export function SiteHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success("Déconnexion réussie")
      router.push("/")
    } catch {
      toast.error("Échec de la déconnexion")
    }
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions droite */}
        <div className="flex items-center gap-2">

          {/* Bouton langue (si plusieurs langues configurées) */}
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

          {/* Toggle thème */}
          <ThemeToggle />

          {/* Bouton Logout */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            title="Se déconnecter"
          >
            <LogOut className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Se déconnecter</span>
          </Button>

        </div>
      </div>
    </header>
  )
}
