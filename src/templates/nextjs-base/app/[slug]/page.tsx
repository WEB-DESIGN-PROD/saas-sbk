import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export async function generateStaticParams() {
  const pages = await prisma.page.findMany({ where: { active: true }, select: { slug: true } })
  return pages.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await prisma.page.findUnique({ where: { slug, active: true } })
  if (!page) return {}
  return { title: page.title }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await prisma.page.findUnique({ where: { slug, active: true } })
  if (!page) notFound()

  // Render Markdown simple (paragraphes, titres, gras)
  const rendered = page.content
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p class="mb-4">')

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-16">
          <h1 className="mb-8 text-4xl font-bold tracking-tight">{page.title}</h1>
          <article
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${rendered}</p>` }}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
