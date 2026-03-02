import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const excludeId = searchParams.get('excludeId')

  if (!slug) return NextResponse.json({ available: false })

  const existing = await prisma.post.findFirst({
    where: {
      slug,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true },
  })

  return NextResponse.json({ available: !existing })
}
