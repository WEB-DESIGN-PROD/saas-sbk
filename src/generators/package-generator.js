/**
 * Génère le contenu du fichier package.json pour le projet
 */
export function generatePackageJson(config) {
  const packageJson = {
    name: config.projectName,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
      postinstall: 'prisma generate',
      'db:push': 'prisma generate && prisma db push',
      'db:migrate': 'prisma migrate dev',
      'db:studio': 'prisma studio',
      'db:generate': 'prisma generate'
    },
    dependencies: {
      next: '^16.1.0',
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      'server-only': '^0.0.1',
      'better-auth': '^1.3.0',
      '@prisma/client': '^6.19.2',
      'next-themes': '^0.4.6',
      clsx: '^2.1.1',
      'tailwind-merge': '^2.6.0',
      'class-variance-authority': '^0.7.1',
      '@radix-ui/react-slot': '^1.1.1',
      '@radix-ui/react-avatar': '^1.1.2',
      '@radix-ui/react-separator': '^1.1.1',
      '@radix-ui/react-dialog': '^1.1.4',
      '@radix-ui/react-tooltip': '^1.1.6',
      '@radix-ui/react-label': '^2.1.1',
      '@radix-ui/react-tabs': '^1.1.2',
      '@radix-ui/react-toggle': '^1.1.1',
      '@radix-ui/react-toggle-group': '^1.1.1',
      '@radix-ui/react-checkbox': '^1.1.3',
      '@radix-ui/react-select': '^2.1.5',
      'lucide-react': '^0.468.0',
      'recharts': '^2.15.0',
      'sonner': '^1.7.1'
    },
    devDependencies: {
      '@types/node': '^22.10.5',
      '@types/react': '^19.0.9',
      '@types/react-dom': '^19.0.5',
      typescript: '^5.7.3',
      prisma: '^6.19.2',
      tailwindcss: '^3.4.17',
      postcss: '^8.4.49',
      autoprefixer: '^10.4.20',
      eslint: '^9.18.0',
      'eslint-config-next': '^16.1.0'
    }
  };

  // Ajouter docker scripts si nécessaire
  if (config.database.type === 'docker' || (config.storage.enabled && config.storage.type === 'minio')) {
    packageJson.scripts['docker:up'] = 'docker compose up -d';
    packageJson.scripts['docker:down'] = 'docker compose down';
    packageJson.scripts['docker:logs'] = 'docker compose logs -f';
  }

  // Dépendances selon configuration

  // Stripe
  if (config.payments.enabled) {
    packageJson.dependencies.stripe = '^17.6.0';
    packageJson.dependencies['@stripe/stripe-js'] = '^5.3.0';
  }

  // Resend
  if (config.email.provider === 'resend') {
    packageJson.dependencies.resend = '^4.0.3';
  } else if (config.email.provider === 'smtp') {
    packageJson.dependencies.nodemailer = '^6.9.16';
    packageJson.devDependencies['@types/nodemailer'] = '^6.4.17';
  }

  // Storage S3
  if (config.storage.enabled && config.storage.type === 's3') {
    packageJson.dependencies['@aws-sdk/client-s3'] = '^3.716.0';
    packageJson.dependencies['@aws-sdk/s3-request-presigner'] = '^3.716.0';
  }

  // Storage MinIO
  if (config.storage.enabled && config.storage.type === 'minio') {
    packageJson.dependencies.minio = '^8.0.2';
  }

  // AI providers
  if (config.ai.providers.includes('claude')) {
    packageJson.dependencies['@anthropic-ai/sdk'] = '^0.35.0';
  }
  if (config.ai.providers.includes('openai')) {
    packageJson.dependencies.openai = '^4.77.3';
  }
  if (config.ai.providers.includes('gemini')) {
    packageJson.dependencies['@google/generative-ai'] = '^0.24.0';
  }

  // i18n (optionnel, pour v2)
  if (config.i18n.languages.length > 1) {
    packageJson.dependencies['next-intl'] = '^4.8.0';
  }

  // Shadcn UI components (ajoutés progressivement)
  packageJson.dependencies['@radix-ui/react-slot'] = '^1.1.1';
  packageJson.dependencies['@radix-ui/react-dropdown-menu'] = '^2.1.4';
  packageJson.dependencies['@radix-ui/react-dialog'] = '^1.1.4';
  packageJson.dependencies['@radix-ui/react-label'] = '^2.1.1';
  packageJson.dependencies['sonner'] = '^1.7.1';

  return JSON.stringify(packageJson, null, 2);
}
