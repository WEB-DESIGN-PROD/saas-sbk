// Client de stockage pour S3 ou MinIO

type StorageClient = {
  upload: (options: {
    key: string
    data: Buffer | Uint8Array | string
    contentType?: string
  }) => Promise<string>
  download: (key: string) => Promise<Buffer>
  delete: (key: string) => Promise<void>
  getUrl: (key: string, expiresIn?: number) => Promise<string>
}

// Client MinIO
async function createMinIOClient(): Promise<StorageClient> {
  const Minio = await import('minio')

  const client = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || '',
    secretKey: process.env.MINIO_SECRET_KEY || '',
  })

  const bucket = process.env.MINIO_BUCKET || 'default'

  // Vérifier si le bucket existe, sinon le créer
  const bucketExists = await client.bucketExists(bucket)
  if (!bucketExists) {
    await client.makeBucket(bucket, 'us-east-1')
  }

  return {
    upload: async ({ key, data, contentType }) => {
      await client.putObject(bucket, key, data, {
        'Content-Type': contentType || 'application/octet-stream',
      })
      return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucket}/${key}`
    },

    download: async (key) => {
      const stream = await client.getObject(bucket, key)
      const chunks: Buffer[] = []

      return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk))
        stream.on('end', () => resolve(Buffer.concat(chunks)))
        stream.on('error', reject)
      })
    },

    delete: async (key) => {
      await client.removeObject(bucket, key)
    },

    getUrl: async (key, expiresIn = 3600) => {
      return await client.presignedGetObject(bucket, key, expiresIn)
    },
  }
}

// Client AWS S3
async function createS3Client(): Promise<StorageClient> {
  const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = await import('@aws-sdk/client-s3')
  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner')

  const client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  })

  const bucket = process.env.AWS_BUCKET || ''

  return {
    upload: async ({ key, data, contentType }) => {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: data,
        ContentType: contentType || 'application/octet-stream',
      })

      await client.send(command)
      return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    },

    download: async (key) => {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })

      const response = await client.send(command)
      const stream = response.Body as any
      const chunks: Uint8Array[] = []

      return new Promise((resolve, reject) => {
        stream.on('data', (chunk: Uint8Array) => chunks.push(chunk))
        stream.on('end', () => resolve(Buffer.concat(chunks)))
        stream.on('error', reject)
      })
    },

    delete: async (key) => {
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })

      await client.send(command)
    },

    getUrl: async (key, expiresIn = 3600) => {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })

      return await getSignedUrl(client, command, { expiresIn })
    },
  }
}

// Factory pour créer le bon client
export async function getStorageClient(): Promise<StorageClient> {
  const isMinIO = process.env.MINIO_ENDPOINT !== undefined

  if (isMinIO) {
    return createMinIOClient()
  } else {
    return createS3Client()
  }
}

// Helpers
export async function uploadFile(
  key: string,
  data: Buffer | Uint8Array | string,
  contentType?: string
): Promise<string> {
  const client = await getStorageClient()
  return client.upload({ key, data, contentType })
}

export async function downloadFile(key: string): Promise<Buffer> {
  const client = await getStorageClient()
  return client.download(key)
}

export async function deleteFile(key: string): Promise<void> {
  const client = await getStorageClient()
  await client.delete(key)
}

export async function getFileUrl(key: string, expiresIn?: number): Promise<string> {
  const client = await getStorageClient()
  return client.getUrl(key, expiresIn)
}
