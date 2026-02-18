import 'server-only'
import { Client as MinioClient } from 'minio'

let _client: MinioClient | null = null

function getClient(): MinioClient {
  if (_client) return _client
  _client = new MinioClient({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  })
  return _client
}

export function getBucketName(): string {
  return process.env.MINIO_BUCKET || 'media'
}

export async function ensureBucket(): Promise<void> {
  const client = getClient()
  const bucket = getBucketName()
  const exists = await client.bucketExists(bucket)
  if (!exists) {
    await client.makeBucket(bucket, 'us-east-1')
  }
}

export type MediaItem = {
  key: string
  name: string
  size: number
  lastModified: Date
  url: string
}

export async function listMedia(): Promise<MediaItem[]> {
  const client = getClient()
  const bucket = getBucketName()
  await ensureBucket()

  return new Promise((resolve, reject) => {
    const objects: { name: string; size: number; lastModified: Date }[] = []
    const stream = client.listObjectsV2(bucket, '', true)

    stream.on('data', (obj: any) => {
      if (obj.name) {
        objects.push({
          name: obj.name,
          size: obj.size || 0,
          lastModified: obj.lastModified || new Date(),
        })
      }
    })

    stream.on('end', async () => {
      try {
        const sorted = objects.sort(
          (a, b) => b.lastModified.getTime() - a.lastModified.getTime()
        )

        const withUrls = await Promise.all(
          sorted.map(async (obj) => {
            // URL signée valide 24h
            const url = await client.presignedGetObject(bucket, obj.name, 86400)

            // Extraire le nom original (retirer le préfixe timestamp-uuid-)
            const match = obj.name.match(/^\d+-[a-zA-Z0-9]+-(.+)$/)
            const displayName = match
              ? decodeURIComponent(match[1].replace(/_/g, ' '))
              : obj.name

            return {
              key: obj.name,
              name: displayName,
              size: obj.size,
              lastModified: obj.lastModified,
              url,
            }
          })
        )

        resolve(withUrls)
      } catch (err) {
        reject(err)
      }
    })

    stream.on('error', reject)
  })
}

export async function uploadMedia(
  key: string,
  data: Buffer,
  contentType: string
): Promise<void> {
  const client = getClient()
  const bucket = getBucketName()
  await ensureBucket()
  await client.putObject(bucket, key, data, data.length, {
    'Content-Type': contentType,
  })
}

export async function deleteMedia(key: string): Promise<void> {
  const client = getClient()
  const bucket = getBucketName()
  await client.removeObject(bucket, key)
}

export async function getPresignedUrl(key: string, expiresIn = 86400): Promise<string> {
  const client = getClient()
  const bucket = getBucketName()
  return client.presignedGetObject(bucket, key, expiresIn)
}

export async function renameMedia(oldKey: string, newKey: string): Promise<void> {
  const client = getClient()
  const bucket = getBucketName()

  // Télécharger l'objet original
  const stream = await client.getObject(bucket, oldKey)
  const chunks: Buffer[] = []
  await new Promise<void>((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => chunks.push(chunk))
    stream.on('end', resolve)
    stream.on('error', reject)
  })
  const data = Buffer.concat(chunks)

  // Détecter le content-type depuis l'extension du nouveau nom
  const ext = newKey.split('.').pop()?.toLowerCase() || ''
  const contentTypes: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
    avif: 'image/avif', bmp: 'image/bmp',
    pdf: 'application/pdf',
    mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime',
    mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg',
  }
  const contentType = contentTypes[ext] || 'application/octet-stream'

  // Uploader avec le nouveau nom
  await client.putObject(bucket, newKey, data, data.length, {
    'Content-Type': contentType,
  })

  // Supprimer l'original
  await client.removeObject(bucket, oldKey)
}
