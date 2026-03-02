import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/db/client"
import { verifySession } from "@/lib/dal"
import { MarkdownPreview } from "@/components/blog/markdown-preview"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Eye } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
}

export default async function BlogPreviewPage({ params }: Props) {
  try {
    await verifySession()
  } catch {
    redirect("/login")
  }

  const { id } = await params
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      category: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
    },
  })

  if (!post) notFound()

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Bannière preview */}
      <div className="mb-8 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
        <Eye className="h-4 w-4 shrink-0" />
        <span>
          <strong>Aperçu</strong> — Cet article n'est pas encore publié. Cette page est uniquement visible par les utilisateurs connectés.
        </span>
      </div>

      {/* Catégorie + Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.category && <Badge variant="secondary">{post.category.name}</Badge>}
        {post.tags.map((tag) => (
          <Badge key={tag.slug} variant="outline">#{tag.name}</Badge>
        ))}
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b">
        <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {post.authorName}</span>
        {post.publishedAt && (
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {formatDate(post.publishedAt)}</span>
        )}
        {post.readingTime && (
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.readingTime} min de lecture</span>
        )}
      </div>

      {post.coverImage && (
        <div className="aspect-video rounded-xl overflow-hidden mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage} alt={post.coverImageAlt || post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <MarkdownPreview content={post.content} />
    </main>
  )
}
