import Link from "next/link"
import { Github } from "lucide-react"
import { prisma } from "@/lib/db/client"
import { getTranslations } from "next-intl/server"

export async function Footer() {
  const t = await getTranslations("footer")

  const footerPages = await prisma.page.findMany({
    where: { inFooter: true, active: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true, slug: true },
  })

  return (
    <footer className="py-6">
      <div className="container mx-auto px-4 text-sm text-muted-foreground">
        <nav className="flex flex-wrap justify-center gap-4 mb-8">
          <Link href="/contact" className="hover:text-foreground transition-colors">{t("contact")}</Link>
          {footerPages.map((page) => (
            <Link key={page.id} href={`/${page.slug}`} className="hover:text-foreground transition-colors">
              {page.title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-between">
          <p>© {new Date().getFullYear()} {{PROJECT_NAME}}. {t("rights")}</p>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
