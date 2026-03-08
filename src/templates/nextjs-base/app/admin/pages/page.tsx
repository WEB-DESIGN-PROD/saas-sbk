import { verifyAdmin } from "@/lib/dal"
import { prisma } from "@/lib/db/client"
import { PagesManager } from "@/components/admin/pages-manager"

export default async function AdminPagesPage() {
  await verifyAdmin()

  const pages = await prisma.page.findMany({ orderBy: { createdAt: "desc" } })
  const serialized = pages.map(p => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-2xl font-semibold">Pages</h1>
          <p className="text-muted-foreground text-sm">
            Créez des pages personnalisées avec contenu Markdown — ajoutables au header ou footer
          </p>
        </div>
        <div className="px-4 lg:px-6">
          <PagesManager initialPages={serialized} />
        </div>
      </div>
    </div>
  )
}
