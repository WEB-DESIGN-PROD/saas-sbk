import { prisma } from "@/lib/db/client"
import { Navbar as NavbarClient } from "./navbar-client"

// Pages statiques toujours présentes dans la navbar
const STATIC_NAV_PAGES = [
  { id: "about",   title: "À propos", slug: "about" },
  { id: "pricing", title: "Tarifs",   slug: "pricing" },
]

export async function Navbar() {
  // Pages custom ajoutées via l'admin (inHeader: true)
  const dbPages = await prisma.page.findMany({
    where: { inHeader: true, active: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true, slug: true },
  })

  // Filtre les doublons avec les pages statiques
  const staticSlugs = new Set(STATIC_NAV_PAGES.map(p => p.slug))
  const customPages = dbPages.filter(p => !staticSlugs.has(p.slug))

  // Blog conditionnel via variable d'environnement
  const blogPage = process.env.NEXT_PUBLIC_HAS_BLOG === "true"
    ? [{ id: "blog", title: "Blog", slug: "blog" }]
    : []

  const headerPages = [...STATIC_NAV_PAGES, ...blogPage, ...customPages]

  return <NavbarClient headerPages={headerPages} />
}
