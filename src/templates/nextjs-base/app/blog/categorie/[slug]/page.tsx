import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/client"
import { ArticleCard } from "@/components/blog/article-card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = await prisma.category.findUnique({ where: { slug }, select: { name: true } })
  return { title: cat ? `Catégorie : ${cat.name}` : "Catégorie" }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const now = new Date()

  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) notFound()

  const posts = await prisma.post.findMany({
    where: { categoryId: category.id, status: "Published", publishedAt: { lte: now } },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true, title: true, slug: true, excerpt: true,
      coverImage: true, coverImageAlt: true, authorName: true,
      publishedAt: true, readingTime: true,
      category: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
    },
  })

  const serialized = posts.map((p) => ({ ...p, publishedAt: p.publishedAt?.toISOString() || null }))

  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Tous les articles
      </Link>
      <div className="mb-10">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-muted-foreground mt-1">{posts.length} article{posts.length !== 1 ? "s" : ""}</p>
      </div>
      {posts.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">Aucun article dans cette catégorie.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serialized.map((post) => <ArticleCard key={post.id} post={post} />)}
        </div>
      )}
    </main>
  )
}
