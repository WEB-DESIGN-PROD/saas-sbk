import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/client"
import { getOptionalSession } from "@/lib/dal"
import { MarkdownPreview } from "@/components/blog/markdown-preview"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ArrowLeft, Pencil } from "lucide-react"
import type { Metadata } from "next"
import { BLOG_EDITOR_ROLES } from "@/types"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, seoTitle: true, seoDescription: true, excerpt: true, coverImage: true },
  })
  if (!post) return {}
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    openGraph: post.coverImage ? { images: [post.coverImage] } : undefined,
  }
}

function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const now = new Date()

  const [session, post] = await Promise.all([
    getOptionalSession(),
    prisma.post.findFirst({
      where: {
        slug,
        status: "Published",
        publishedAt: { lte: now },
      },
      include: {
        category: { select: { name: true, slug: true } },
        tags: { select: { name: true, slug: true } },
      },
    }),
  ])

  if (!post) notFound()

  const canEdit = session && BLOG_EDITOR_ROLES.includes(session.role)

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Retour au blog
      </Link>

      {/* Catégorie + Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.category && (
          <Link href={`/blog/categorie/${post.category.slug}`}>
            <Badge variant="secondary">{post.category.name}</Badge>
          </Link>
        )}
        {post.tags.map((tag) => (
          <Link key={tag.slug} href={`/blog/tag/${tag.slug}`}>
            <Badge variant="outline">#{tag.name}</Badge>
          </Link>
        ))}
      </div>

      {/* Titre */}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
        {post.title}
      </h1>

      {/* Bouton modifier (staff uniquement) */}
      {canEdit && (
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <Link href={`/admin/blog/${post.id}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
              Modifier l'article
            </Link>
          </Button>
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b">
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" /> {post.authorName}
        </span>
        {post.publishedAt && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> {formatDate(post.publishedAt)}
          </span>
        )}
        {post.readingTime && (
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {post.readingTime} min de lecture
          </span>
        )}
      </div>

      {/* Image de couverture */}
      {post.coverImage && (
        <div className="aspect-video rounded-xl overflow-hidden mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.coverImageAlt || post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Contenu Markdown */}
      <MarkdownPreview content={post.content} />
    </main>
  )
}
