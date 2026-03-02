import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"

interface ArticleCardProps {
  post: {
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    coverImageAlt: string | null
    authorName: string
    publishedAt: string | null
    readingTime: number | null
    category: { name: string; slug: string } | null
    tags: { name: string; slug: string }[]
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="group flex flex-col rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow">
      {post.coverImage && (
        <Link href={`/blog/${post.slug}`} className="overflow-hidden aspect-video block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.coverImageAlt || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      )}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {post.category && (
            <Link href={`/blog/categorie/${post.category.slug}`}>
              <Badge variant="secondary" className="text-xs">{post.category.name}</Badge>
            </Link>
          )}
          {post.tags.slice(0, 2).map((tag) => (
            <Link key={tag.slug} href={`/blog/tag/${tag.slug}`}>
              <Badge variant="outline" className="text-xs">#{tag.name}</Badge>
            </Link>
          ))}
        </div>

        <Link href={`/blog/${post.slug}`} className="group/title">
          <h2 className="font-semibold text-lg leading-tight group-hover/title:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
        )}

        <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t">
          <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.authorName}</span>
          {post.publishedAt && (
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(post.publishedAt)}</span>
          )}
          {post.readingTime && (
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readingTime} min</span>
          )}
        </div>
      </div>
    </article>
  )
}
