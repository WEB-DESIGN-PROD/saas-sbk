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

  // Credit Packs
  const creditPacksData = [
    { name: "Starter", credits: 100,  price: 490,  description: "Idéal pour démarrer", sortOrder: 0 },
    { name: "Growth",  credits: 500,  price: 1990, description: "Meilleur rapport qualité/prix", sortOrder: 1 },
    { name: "Scale",   credits: 2000, price: 6990, description: "Parfait pour les équipes", sortOrder: 2 },
  ]
  for (const pack of creditPacksData) {
    await prisma.creditPack.upsert({
      where: { id: pack.name.toLowerCase() },
      update: pack,
      create: { id: pack.name.toLowerCase(), ...pack },
    })
  }

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

  // Pages par défaut
  const defaultPagesData = [
    { id: "page-about",   title: "À propos", slug: "about",   content: "# À propos\n\nDécouvrez notre équipe et notre mission.", inHeader: true,  inFooter: false, active: true, isDefault: true, sortOrder: 0 },
    { id: "page-pricing", title: "Tarifs",   slug: "pricing", content: "# Tarifs\n\nDécouvrez nos offres.",                    inHeader: true,  inFooter: false, active: true, isDefault: true, sortOrder: 1 },
    { id: "page-blog",    title: "Blog",     slug: "blog",    content: "# Blog\n\nNos derniers articles.",                     inHeader: true,  inFooter: false, active: true, isDefault: true, sortOrder: 2 },
  ]
  for (const page of defaultPagesData) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: { isDefault: true, sortOrder: page.sortOrder },
      create: page,
    })
  }

  console.log("✅ Seed terminé")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
