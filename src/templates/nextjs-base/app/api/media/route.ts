import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { auth } from '@/lib/auth/config'
import { listMedia, deleteMedia } from '@/lib/storage/minio-client'

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
    const media = await listMedia()
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
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/media]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
