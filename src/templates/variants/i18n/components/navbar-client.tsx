"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth/client"
import { useRouter, usePathname } from "@/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { User, LayoutDashboard, Globe, Menu, X, Sparkles } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Langues disponibles (définies à la génération du projet)
const AVAILABLE_LANGUAGES = "{{AVAILABLE_LANGUAGES}}".split(",").filter(Boolean)
const showLangToggle = AVAILABLE_LANGUAGES.length > 1

interface NavPage { id: string; title: string; slug: string }

export function Navbar({ headerPages = [] }: { headerPages?: NavPage[] }) {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()
  const t = useTranslations("nav")

  useEffect(() => {
    setMounted(true)
  }, [])

  // Ferme le menu au resize vers desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  const isLoggedIn = mounted && !!session?.user

  function switchLocale(locale: string) {
    router.replace(pathname, { locale })
  }

  return (
    <div className="sticky top-0 z-50 flex flex-col items-center px-4 pt-3 pb-1 pointer-events-none">

      {/* Barre principale */}
      <header className="pointer-events-auto w-full max-w-6xl rounded-2xl border border-white/[0.06] bg-background/20 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex h-14 items-center px-5">

          {/* Gauche : Logo */}
          <div className="flex-1">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold" onClick={() => setMenuOpen(false)}>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 ring-1 ring-emerald-400/20">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              {{PROJECT_NAME}}
            </Link>
          </div>

          {/* Centre : Liens de navigation (desktop uniquement) */}
          <nav className="hidden md:flex items-center gap-6">
            {headerPages.map((page) => (
              <Link key={page.id} href={`/${page.slug}`} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {page.title}
              </Link>
            ))}
          </nav>

          {/* Droite : Actions */}
          <div className="flex flex-1 items-center justify-end gap-2">

            {/* Bouton Dashboard (desktop uniquement si connecté) */}
            {isLoggedIn && (
              <Button variant="default" size="sm" asChild className="hidden md:inline-flex">
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {t("dashboard")}
                </Link>
              </Button>
            )}

            {/* Bouton Créer un compte (desktop uniquement si non connecté) */}
            {!isLoggedIn && (
              <Button size="sm" asChild className="hidden md:inline-flex">
                <Link href="/register">{t("create_account")}</Link>
              </Button>
            )}

            {/* Bouton User icon */}
            <Button variant="outline" size="icon" asChild>
              <Link href={isLoggedIn ? "/dashboard/account" : "/login"}>
                <User className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">{isLoggedIn ? t("my_account") : t("login")}</span>
              </Link>
            </Button>

            {/* Bouton langue (desktop uniquement) */}
            {showLangToggle && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="hidden md:inline-flex">
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">{t("change_lang")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <DropdownMenuItem
                      key={lang}
                      onClick={() => switchLocale(lang)}
                      className={currentLocale === lang ? "font-bold text-primary" : ""}
                    >
                      {lang.toUpperCase()}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Toggle thème */}
            <ThemeToggle />

            {/* Burger (mobile uniquement) */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? t("close_menu") : t("open_menu")}
            >
              {menuOpen ? <X className="h-[1.2rem] w-[1.2rem]" /> : <Menu className="h-[1.2rem] w-[1.2rem]" />}
            </Button>

          </div>
        </div>
      </header>

      {/* Menu mobile déroulant */}
      {menuOpen && (
        <div className="pointer-events-auto w-full max-w-6xl mt-2 rounded-2xl border border-white/[0.06] bg-background/80 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.15)] p-4 flex flex-col gap-1">

          {headerPages.map((page) => (
            <Link
              key={page.id}
              href={`/${page.slug}`}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-all"
            >
              {page.title}
            </Link>
          ))}

          {/* Séparateur si pages + action */}
          {headerPages.length > 0 && (
            <div className="my-1 h-px bg-white/[0.06]" />
          )}

          {isLoggedIn ? (
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-all flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              {t("dashboard")}
            </Link>
          ) : (
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="mt-1 rounded-xl border border-white/[0.08] bg-primary/10 px-4 py-3 text-sm font-medium text-primary hover:bg-primary/15 transition-all text-center"
            >
              {t("create_account")}
            </Link>
          )}

          {/* Sélecteur de langue mobile */}
          {showLangToggle && (
            <>
              <div className="my-1 h-px bg-white/[0.06]" />
              <div className="flex gap-2 px-4 py-2">
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { switchLocale(lang); setMenuOpen(false) }}
                    className={`text-xs rounded-md px-2 py-1 border transition-colors ${
                      currentLocale === lang
                        ? "border-primary text-primary font-bold"
                        : "border-white/[0.08] text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </>
          )}

        </div>
      )}

    </div>
  )
}
