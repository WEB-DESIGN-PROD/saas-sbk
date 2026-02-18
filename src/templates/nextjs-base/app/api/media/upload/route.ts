import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { auth } from '@/lib/auth/config'
import { uploadMedia } from '@/lib/storage/minio-client'

const MAX_SIZE = 50 * 1024 * 1024 // 50 MB

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

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (max 50 MB)' },
        { status: 413 }
      )
    }

    // Générer une clé unique : timestamp-uuid-nomfichier
    const timestamp = Date.now()
    const uniqueId = crypto.randomUUID().split('-')[0]
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const key = `${timestamp}-${uniqueId}-${safeName}`

    const buffer = Buffer.from(await file.arrayBuffer())
    await uploadMedia(key, buffer, file.type || 'application/octet-stream')

    return NextResponse.json({ key, name: file.name, size: file.size })
  } catch (error) {
    console.error('[POST /api/media/upload]', error)
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 }
    )
  }
}
