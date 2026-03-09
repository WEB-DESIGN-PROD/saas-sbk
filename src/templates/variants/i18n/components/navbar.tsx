import { prisma } from "@/lib/db/client"
import { Navbar as NavbarClient } from "./navbar-client"
import { getTranslations } from "next-intl/server"

export async function Navbar() {
  const t = await getTranslations("nav")

  const dbPages = await prisma.page.findMany({
    where: { inHeader: true, active: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true, slug: true },
  })

  // Traduire les titres des pages connues selon leur slug
  const knownSlugs: Record<string, string> = {
    about: t("about"),
    pricing: t("pricing"),
    blog: t("blog"),
    contact: t("contact"),
  }

  const headerPages = dbPages.map((page) => ({
    ...page,
    title: knownSlugs[page.slug] ?? page.title,
  }))

  return <NavbarClient headerPages={headerPages} />
}
