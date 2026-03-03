import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth/config'

// Rôles pouvant modifier tous les articles (pas seulement les leurs)
const CAN_MANAGE_ALL_ROLES = ['admin', 'co-admin', 'editor']
// Rôles pouvant supprimer n'importe quel article
const CAN_DELETE_ALL_ROLES = ['admin', 'co-admin']

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const post = await prisma.post.findUnique({
    where: { id },
    include: { category: true, tags: true, author: { select: { name: true, email: true } } },
  })
  if (!post) return NextResponse.json({ error: 'Article introuvable' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const role = (session.user as any).role ?? 'member'
  const userId = session.user.id
  const canManageAll = CAN_MANAGE_ALL_ROLES.includes(role)

  const { id } = await params

  // Contributeurs : vérifier que l'article leur appartient
  if (!canManageAll) {
    const existing = await prisma.post.findUnique({ where: { id }, select: { authorId: true } })
    if (!existing) return NextResponse.json({ error: 'Article introuvable' }, { status: 404 })
    if (existing.authorId !== userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const body = await req.json()
  const { title, slug, excerpt, content, coverImage, coverImageAlt, authorName, status, publishedAt, seoTitle, seoDescription, categoryId, tagIds } = body

  const data: any = {}
  if (title !== undefined) data.title = title
  if (slug !== undefined) data.slug = slug
  if (excerpt !== undefined) data.excerpt = excerpt
  if (authorName !== undefined) data.authorName = authorName
  if (seoTitle !== undefined) data.seoTitle = seoTitle
  if (seoDescription !== undefined) data.seoDescription = seoDescription
  if (coverImage !== undefined) data.coverImage = coverImage
  if (coverImageAlt !== undefined) data.coverImageAlt = coverImageAlt
  if (categoryId !== undefined) data.categoryId = categoryId || null
  if (status !== undefined) {
    // Contributeurs : uniquement Draft ou PendingReview (pas Published/Scheduled directement)
    const allowedStatuses = canManageAll
      ? ['Draft', 'Published', 'Scheduled', 'Archived', 'PendingReview']
      : ['Draft', 'PendingReview']
    if (allowedStatuses.includes(status)) {
      data.status = status
      if (status === 'Published' && !publishedAt) {
        const existing = await prisma.post.findUnique({ where: { id }, select: { publishedAt: true } })
        if (!existing?.publishedAt) data.publishedAt = new Date()
      }
    }
  }
  if (publishedAt !== undefined) data.publishedAt = publishedAt ? new Date(publishedAt) : null
  if (content !== undefined) {
    data.content = content
    data.readingTime = Math.ceil(content.split(/\s+/).length / 200)
  }
  if (tagIds !== undefined) {
    data.tags = { set: tagIds.map((tid: string) => ({ id: tid })) }
  }

  const post = await prisma.post.update({
    where: { id },
    data,
    include: { category: true, tags: true },
  })

  return NextResponse.json(post)
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const role = (session.user as any).role ?? 'member'
  const userId = session.user.id
  const canDeleteAll = CAN_DELETE_ALL_ROLES.includes(role)

  const { id } = await params

  if (!canDeleteAll) {
    if (role === 'editor') {
      // L'éditeur ne peut supprimer que ses propres articles
      const existing = await prisma.post.findUnique({ where: { id }, select: { authorId: true } })
      if (!existing) return NextResponse.json({ error: 'Article introuvable' }, { status: 404 })
      if (existing.authorId !== userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    } else {
      // Contributeurs et membres : aucune suppression
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }
  }

  await prisma.post.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
