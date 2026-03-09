import path from 'path';
import fs from 'fs';

/**
 * Fusionne notre configuration avec le package.json existant créé par shadcn CLI.
 * Retourne le contenu JSON final sous forme de string.
 */
export function generatePackageJson(config, projectPath = null) {
  // Lire le package.json existant (créé par shadcn CLI)
  let packageJson = {};
  if (projectPath) {
    const pkgPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
      packageJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    }
  }

  // Mettre à jour le nom du projet
  packageJson.name = config.projectName;

  // Fusionner les scripts (garder ceux de shadcn + ajouter les nôtres)
  packageJson.scripts = {
    ...packageJson.scripts,
    postinstall: 'prisma generate',
    'db:push': 'prisma db push',
    'db:migrate': 'prisma migrate dev',
    'db:studio': 'prisma studio',
    'db:generate': 'prisma generate',
    'db:seed': 'tsx prisma/seed.ts',
  };

  // Docker scripts si nécessaire
  if (config.database.type === 'docker' || (config.storage.enabled && config.storage.type === 'minio')) {
    packageJson.scripts['docker:up'] = 'docker compose up -d';
    packageJson.scripts['docker:down'] = 'docker compose down';
    packageJson.scripts['docker:logs'] = 'docker compose logs -f';
  }

  // Fusionner les dépendances (les nôtres s'ajoutent à celles de shadcn)
  packageJson.dependencies = {
    ...packageJson.dependencies,
    'server-only': '^0.0.1',
    'better-auth': '^1.3.0',
    '@prisma/client': '^6.19.0',
    'next-themes': packageJson.dependencies?.['next-themes'] || '^0.4.6',
    'gsap': '^3.12.5',
  };

  // Stripe
  if (config.payments.enabled) {
    packageJson.dependencies['stripe'] = '^17.6.0';
    packageJson.dependencies['@stripe/stripe-js'] = '^5.3.0';
  }

  // OTP login method
  if (config.auth?.loginMethod === 'otp') {
    packageJson.dependencies['input-otp'] = '^1.4.2';
  }

  // Email
  if (config.email?.provider === 'resend') {
    packageJson.dependencies['resend'] = '^4.0.3';
  } else if (config.email?.provider === 'smtp') {
    packageJson.dependencies['nodemailer'] = '^6.9.16';
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      '@types/nodemailer': '^6.4.17',
    };
  }

  // Storage S3
  if (config.storage.enabled && config.storage.type === 's3') {
    packageJson.dependencies['@aws-sdk/client-s3'] = '^3.716.0';
    packageJson.dependencies['@aws-sdk/s3-request-presigner'] = '^3.716.0';
  }

  // Storage MinIO
  if (config.storage.enabled && config.storage.type === 'minio') {
    packageJson.dependencies['minio'] = '^8.0.2';
  }

  // AI providers
  if (config.ai.providers.includes('claude')) {
    packageJson.dependencies['@anthropic-ai/sdk'] = '^0.35.0';
  }
  if (config.ai.providers.includes('openai')) {
    packageJson.dependencies['openai'] = '^4.77.3';
  }
  if (config.ai.providers.includes('gemini')) {
    packageJson.dependencies['@google/generative-ai'] = '^0.24.0';
  }

  // Blog
  if (config.saasType === 'blog') {
    packageJson.dependencies['react-markdown'] = '^9.0.0';
    packageJson.dependencies['remark-gfm'] = '^4.0.0';
    packageJson.dependencies['slugify'] = '^1.6.6';
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      '@tailwindcss/typography': '^0.5.16',
    };
  }

  // i18n
  if (config.i18n.languages.length > 1) {
    packageJson.dependencies['next-intl'] = '^4.8.0';
  }

  // Fusionner les devDependencies (Prisma CLI)
  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    'prisma': '^6.19.0',
  };

  return JSON.stringify(packageJson, null, 2);
}
