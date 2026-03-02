import { verifySession } from "@/lib/dal"
import { prisma } from "@/lib/db/client"
import { ArticleEditor } from "@/components/blog/article-editor"

export const metadata = { title: "Nouvel article" }

export default async function DashboardBlogNewPage() {
  const { user } = await verifySession()

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
    include: { children: { orderBy: { name: "asc" } } },
  })

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-2xl font-semibold">Nouvel article</h1>
        </div>
        <div className="px-4 lg:px-6">
          <ArticleEditor
            categories={categories}
            currentUserName={user.name || user.email}
            basePath="/dashboard/blog"
          />
        </div>
      </div>
    </div>
  )
}
