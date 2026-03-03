import { verifyStaff } from "@/lib/dal"
import { prisma } from "@/lib/db/client"
import { ArticlesTable } from "@/components/blog/articles-table"

export const metadata = { title: "Articles" }

export default async function AdminBlogPage() {
  const { role } = await verifyStaff()

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, slug: true, status: true,
      authorName: true, publishedAt: true, readingTime: true,
      category: { select: { name: true } },
      tags: { select: { name: true } },
    },
  })

  const serialized = posts.map((p) => ({
    ...p,
    publishedAt: p.publishedAt?.toISOString() || null,
  }))

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-2xl font-semibold">Articles</h1>
          <p className="text-muted-foreground text-sm">
            {posts.length} article{posts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="px-4 lg:px-6">
          <ArticlesTable posts={serialized} basePath="/admin/blog" userRole={role} />
        </div>
      </div>
    </div>
  )
}
