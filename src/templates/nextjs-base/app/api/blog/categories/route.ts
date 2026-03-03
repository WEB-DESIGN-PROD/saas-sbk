import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth/config'

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      children: { orderBy: { name: 'asc' } },
      _count: { select: { posts: true } },
    },
    where: { parentId: null },
  })
  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { name, slug, description } = await req.json()
  if (!name || !slug) return NextResponse.json({ error: 'Nom et slug requis' }, { status: 400 })

  const category = await prisma.category.create({
    data: { name, slug, description: description?.trim() || null },
  })
  return NextResponse.json(category, { status: 201 })
}
