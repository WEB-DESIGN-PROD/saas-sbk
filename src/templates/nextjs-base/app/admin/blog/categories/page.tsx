import { verifyAdmin } from "@/lib/dal"
import { prisma } from "@/lib/db/client"
import { CategoryManager } from "@/components/blog/category-manager"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = { title: "Catégories" }

export default async function AdminBlogCategoriesPage() {
  await verifyAdmin()

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
    include: {
      children: { orderBy: { name: "asc" }, include: { _count: { select: { posts: true } } } },
      _count: { select: { posts: true } },
    },
  })

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6 flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" /> Articles
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Catégories</h1>
        </div>
        <div className="px-4 lg:px-6">
          <CategoryManager categories={categories} />
        </div>
      </div>
    </div>
  )
}
