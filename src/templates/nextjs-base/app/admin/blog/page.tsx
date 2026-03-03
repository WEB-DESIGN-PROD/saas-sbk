import { verifyStaff } from "@/lib/dal"
import { prisma } from "@/lib/db/client"
import { ArticlesTable } from "@/components/blog/articles-table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { CheckCircle2, Clock, FileEdit } from "lucide-react"
import { BlogCategoriesCard } from "@/components/blog/categories-card"

export const metadata = { title: "Articles" }

export default async function AdminBlogPage() {
  const { role, userId } = await verifyStaff()

  const [posts, publishedCount, pendingCount, draftCount, categories] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true, title: true, slug: true, status: true,
        coverImage: true,
        authorId: true, authorName: true, publishedAt: true, readingTime: true,
        category: { select: { name: true } },
        tags: { select: { name: true } },
      },
    }),
    prisma.post.count({ where: { status: "Published" } }),
    prisma.post.count({ where: { status: "PendingReview" } }),
    prisma.post.count({ where: { status: "Draft" } }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    }),
  ])

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

        {/* Cards de stats */}
        <div className="px-4 lg:px-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Publiés */}
          <div className="rounded-xl border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Publiés
              </div>
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">En ligne</Badge>
            </div>
            <p className="text-4xl font-bold">{publishedCount}</p>
            <Separator />
            <div>
              <p className="font-medium text-sm">Articles publiés</p>
              <p className="text-xs text-muted-foreground">Visibles sur le blog</p>
            </div>
          </div>

          {/* En attente */}
          <div className="rounded-xl border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-orange-500" />
                En attente
              </div>
              {pendingCount > 0 && (
                <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 text-xs">
                  {pendingCount} à valider
                </Badge>
              )}
            </div>
            <p className="text-4xl font-bold">{pendingCount}</p>
            <Separator />
            <div>
              <p className="font-medium text-sm">En attente de validation</p>
              <p className="text-xs text-muted-foreground">À examiner et publier</p>
            </div>
          </div>

          {/* Brouillons */}
          <div className="rounded-xl border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileEdit className="h-4 w-4 text-yellow-500" />
                Brouillons
              </div>
            </div>
            <p className="text-4xl font-bold">{draftCount}</p>
            <Separator />
            <div>
              <p className="font-medium text-sm">Articles en brouillon</p>
              <p className="text-xs text-muted-foreground">Non publiés</p>
            </div>
          </div>
        </div>

        {/* Catégories */}
        <div className="px-4 lg:px-6">
          <BlogCategoriesCard categories={categories} userRole={role} />
        </div>

        <div className="px-4 lg:px-6">
          <ArticlesTable posts={serialized} basePath="/admin/blog" userRole={role} currentUserId={userId} />
        </div>
      </div>
    </div>
  )
}
