import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/client'
import {
  deleteMedia,
  renameMedia,
  getPresignedUrl,
} from '@/lib/storage/minio-client'

async function getSession() {
  const cookieStore = await cookies()
  let cookieHeader = ''
  cookieStore.getAll().forEach((c) => {
    cookieHeader = cookieHeader
      ? `${cookieHeader}; ${c.name}=${c.value}`
      : `${c.name}=${c.value}`
  })
  return auth.api.getSession({
    headers: { cookie: cookieHeader } as unknown as Headers,
  })
}

export async function GET() {
  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const records = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const media = await Promise.all(
      records.map(async (record) => ({
        key: record.key,
        name: record.name,
        size: record.size,
        lastModified: record.createdAt.toISOString(),
        url: await getPresignedUrl(record.key),
        description: record.description ?? undefined,
        tags: record.tags ?? [],
      }))
    )

    return NextResponse.json(media)
  } catch (error) {
    console.error('[GET /api/media]', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des médias' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  if (!key) {
    return NextResponse.json({ error: 'Clé manquante' }, { status: 400 })
  }

  try {
    await deleteMedia(key)
    await prisma.media.delete({ where: { key } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/media]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { key, newName, description, tags } = await request.json()

    if (!key || !newName?.trim()) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    // Conserver le préfixe timestamp-uuid, remplacer seulement le nom du fichier
    const match = key.match(/^(\d+-[a-zA-Z0-9]+-).+$/)
    if (!match) {
      return NextResponse.json(
        { error: 'Format de clé invalide' },
        { status: 400 }
      )
    }

    const prefix = match[1]
    const safeName = newName
      .trim()
      .replace(/[^a-zA-Z0-9._\-\s]/g, '_')
      .replace(/\s+/g, '_')
    const newKey = `${prefix}${safeName}`

    const dbData = {
      name: newName.trim(),
      description: description?.trim() || null,
      tags: Array.isArray(tags) ? tags : [],
    }

    if (newKey === key) {
      await prisma.media.update({ where: { key }, data: dbData })
      return NextResponse.json({ key, url: await getPresignedUrl(key) })
    }

    await renameMedia(key, newKey)
    await prisma.media.update({
      where: { key },
      data: { key: newKey, ...dbData },
    })

    const url = await getPresignedUrl(newKey)
    return NextResponse.json({ key: newKey, url })
  } catch (error) {
    console.error('[PATCH /api/media]', error)
    return NextResponse.json(
      { error: 'Erreur lors du renommage' },
      { status: 500 }
    )
  }
}
