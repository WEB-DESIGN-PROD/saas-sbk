import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth/config'

export async function GET() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { posts: true } } },
  })
  return NextResponse.json(tags)
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { name } = await req.json()
  if (!name) return NextResponse.json({ error: 'Nom requis' }, { status: 400 })

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const tag = await prisma.tag.upsert({
    where: { slug },
    update: {},
    create: { name: name.trim(), slug },
  })
  return NextResponse.json(tag, { status: 201 })
}
