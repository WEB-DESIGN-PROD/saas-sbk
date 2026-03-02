import { notFound } from "next/navigation"
import { verifyAdmin } from "@/lib/dal"
import { prisma } from "@/lib/db/client"
import { ArticleEditor } from "@/components/blog/article-editor"

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = { title: "Modifier l'article" }

export default async function AdminBlogEditPage({ params }: Props) {
  const { user } = await verifyAdmin()
  const { id } = await params

  const [post, categories] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: { tags: { select: { id: true, name: true, slug: true } } },
    }),
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
      include: { children: { orderBy: { name: "asc" } } },
    }),
  ])

  if (!post) notFound()

  const serialized = {
    ...post,
    publishedAt: post.publishedAt?.toISOString() || null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-2xl font-semibold">Modifier l'article</h1>
        </div>
        <div className="px-4 lg:px-6">
          <ArticleEditor
            post={serialized}
            categories={categories}
            currentUserName={user.name || user.email}
            basePath="/admin/blog"
          />
        </div>
      </div>
    </div>
  )
}
