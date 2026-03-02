import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth/config'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search') || ''
  const categoryId = searchParams.get('categoryId')
  const tagSlug = searchParams.get('tagSlug')
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'))
  const skip = (page - 1) * limit

  // Vérifier si l'utilisateur est connecté
  const session = await auth.api.getSession({ headers: await headers() })
  const isAuth = !!session?.user

  const now = new Date()

  const where: any = {}

  if (!isAuth) {
    // Public: seulement les articles publiés dont la date est passée
    where.status = 'Published'
    where.publishedAt = { lte: now }
  } else if (status) {
    where.status = status
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (categoryId) where.categoryId = categoryId
  if (tagSlug) where.tags = { some: { slug: tagSlug } }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        coverImageAlt: true,
        authorName: true,
        status: true,
        publishedAt: true,
        readingTime: true,
        createdAt: true,
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.post.count({ where }),
  ])

  return NextResponse.json({ posts, total, page, limit, totalPages: Math.ceil(total / limit) })
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await req.json()
  const { title, slug, excerpt, content, coverImage, coverImageAlt, authorName, status, publishedAt, seoTitle, seoDescription, categoryId, tagIds } = body

  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'Titre, slug et contenu sont requis' }, { status: 400 })
  }

  const readingTime = Math.ceil((content as string).split(/\s+/).length / 200)

  let finalPublishedAt = publishedAt ? new Date(publishedAt) : null
  if (status === 'Published' && !finalPublishedAt) finalPublishedAt = new Date()

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      coverImage: coverImage || null,
      coverImageAlt: coverImageAlt || null,
      authorName: authorName || session.user.name || session.user.email,
      status: status || 'Draft',
      publishedAt: finalPublishedAt,
      readingTime,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      authorId: session.user.id,
      categoryId: categoryId || null,
      tags: tagIds?.length ? { connect: tagIds.map((id: string) => ({ id })) } : undefined,
    },
    include: { category: true, tags: true },
  })

  return NextResponse.json(post, { status: 201 })
}
