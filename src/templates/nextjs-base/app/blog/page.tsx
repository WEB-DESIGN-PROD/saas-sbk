import { prisma } from "@/lib/db/client"
import { ArticleCard } from "@/components/blog/article-card"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

export const metadata = { title: "Blog" }

interface Props {
  searchParams: Promise<{ page?: string; categorie?: string; tag?: string }>
}

export default async function BlogPage({ searchParams }: Props) {
  const { page: pageParam, categorie, tag } = await searchParams
  const page = Math.max(1, parseInt(pageParam || "1"))
  const limit = 9
  const skip = (page - 1) * limit
  const now = new Date()

  const where: any = {
    status: "Published",
    publishedAt: { lte: now },
  }

  if (categorie) where.category = { slug: categorie }
  if (tag) where.tags = { some: { slug: tag } }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true, title: true, slug: true, excerpt: true,
        coverImage: true, coverImageAlt: true, authorName: true,
        publishedAt: true, readingTime: true,
        category: { select: { name: true, slug: true } },
        tags: { select: { name: true, slug: true } },
      },
    }),
    prisma.post.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  const serialized = posts.map((p) => ({
    ...p,
    publishedAt: p.publishedAt?.toISOString() || null,
  }))

  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground mt-2">
          {total} article{total !== 1 ? "s" : ""}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <p>Aucun article pour le moment.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serialized.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              {page > 1 && (
                <Link
                  href={`/blog?page=${page - 1}`}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Précédent
                </Link>
              )}
              <span className="text-sm text-muted-foreground">
                Page {page} / {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/blog?page=${page + 1}`}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Suivant <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </main>
  )
}
