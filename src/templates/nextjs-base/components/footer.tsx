import Link from "next/link"
import { prisma } from "@/lib/db/client"

export async function Footer() {
  const footerPages = await prisma.page.findMany({
    where: { inFooter: true, active: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true, slug: true },
  })

  return (
    <footer className="border-t py-6">
      <div className="container mx-auto px-4 flex flex-col items-center gap-3 text-sm text-muted-foreground">
        {footerPages.length > 0 && (
          <nav className="flex flex-wrap justify-center gap-4">
            {footerPages.map((page) => (
              <Link key={page.id} href={`/${page.slug}`} className="hover:text-foreground transition-colors">
                {page.title}
              </Link>
            ))}
          </nav>
        )}
        <p>© 2026 {{PROJECT_NAME}}. Tous droits réservés.</p>
      </div>
    </footer>
  )
}
