import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

console.log("🗄️  Initialisation Prisma Client...")
console.log("📍 DATABASE_URL:", process.env.DATABASE_URL ? "✅ Configurée" : "❌ Non configurée")

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Test de connexion au démarrage (dev uniquement)
if (process.env.NODE_ENV === 'development') {
  prisma.$connect()
    .then(() => console.log("✅ Prisma connecté à la base de données"))
    .catch((error) => {
      console.error("❌ Échec de connexion Prisma:", error.message)
      console.error("💡 Vérifiez que:")
      console.error("   1. PostgreSQL est démarré (npm run docker:up)")
      console.error("   2. DATABASE_URL est correcte dans .env")
      console.error("   3. Les migrations sont appliquées (npm run db:push)")
    })
}
