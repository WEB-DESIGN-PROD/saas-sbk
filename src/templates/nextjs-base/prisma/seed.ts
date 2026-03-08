import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Plans
  await prisma.plan.deleteMany()
  await prisma.plan.createMany({
    data: [
      {
        name: "Gratuit",
        price: 0,
        currency: "EUR",
        period: null,
        description: "Pour commencer",
        features: ["1 projet", "Fonctionnalités de base", "Support communautaire", "Mises à jour régulières"],
        cta: "Commencer gratuitement",
        href: "/register",
        popular: false,
        active: true,
        sortOrder: 0,
      },
      {
        name: "Pro",
        price: 2900,
        currency: "EUR",
        period: "month",
        description: "Pour les professionnels",
        features: ["Projets illimités", "Toutes les fonctionnalités", "Support prioritaire", "Analyses avancées", "API access"],
        cta: "Commencer l'essai",
        href: "/register",
        popular: true,
        active: true,
        sortOrder: 1,
      },
      {
        name: "Entreprise",
        price: -1,
        currency: "EUR",
        period: null,
        description: "Pour les grandes équipes",
        features: ["Tout du plan Pro", "Support dédié", "SLA garanti", "Formation sur site", "Facturation personnalisée"],
        cta: "Nous contacter",
        href: "/contact",
        popular: false,
        active: true,
        sortOrder: 2,
      },
    ],
  })

  // Features
  await prisma.feature.deleteMany()
  await prisma.feature.createMany({
    data: [
      { title: "Authentification", description: "Système d'authentification complet avec Better Auth — Magic Link, OTP, OAuth GitHub/Google", icon: "Shield", active: true, sortOrder: 0 },
      { title: "Base de données", description: "PostgreSQL et Prisma ORM pour gérer vos données avec des migrations automatiques", icon: "Database", active: true, sortOrder: 1 },
      { title: "Interface moderne", description: "Composants Shadcn UI et Tailwind CSS pour une UI soignée et responsive", icon: "Layers", active: true, sortOrder: 2 },
      { title: "Paiements Stripe", description: "Intégration Stripe complète pour gérer abonnements et paiements en mode test", icon: "CreditCard", active: true, sortOrder: 3 },
      { title: "Emails transactionnels", description: "Envoi d'emails avec Resend ou SMTP — templates React Email inclus", icon: "Mail", active: true, sortOrder: 4 },
      { title: "Stockage médias", description: "Upload et gestion de fichiers avec MinIO (Docker) ou AWS S3", icon: "HardDrive", active: true, sortOrder: 5 },
    ],
  })

  // FAQ
  await prisma.faq.deleteMany()
  await prisma.faq.createMany({
    data: [
      { question: "Comment démarrer avec {{PROJECT_NAME}} ?", answer: "Créez un compte gratuitement, configurez votre projet et commencez à construire. Notre guide de démarrage vous accompagne étape par étape.", active: true, sortOrder: 0 },
      { question: "Puis-je changer de plan à tout moment ?", answer: "Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Les changements prennent effet immédiatement et la facturation est ajustée au prorata.", active: true, sortOrder: 1 },
      { question: "Quels modes de paiement sont acceptés ?", answer: "Nous acceptons toutes les cartes bancaires (Visa, Mastercard, American Express) ainsi que les virements SEPA pour les plans Entreprise.", active: true, sortOrder: 2 },
      { question: "Y a-t-il un essai gratuit ?", answer: "Oui, tous les plans payants incluent 14 jours d'essai gratuit sans engagement. Aucune carte bancaire requise pour commencer.", active: true, sortOrder: 3 },
    ],
  })

  console.log("✅ Seed terminé")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
