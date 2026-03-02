import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { writeFile } from '../utils/file-utils.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Génère le projet Next.js en copiant le template shadcn-base
 * puis en superposant les fichiers de configuration spécifiques (Better Auth, Prisma, etc.)
 */
export function generateNextjsProject(projectPath, config) {
  const shadcnBaseDir = path.join(__dirname, '../templates/shadcn-base');
  const templatesDir = path.join(__dirname, '../templates/nextjs-base');

  // 1. Copier le template shadcn-base (base identique à test-template)
  //    Inclut : components/ui/*, app/globals.css, tsconfig.json, next.config.ts, etc.
  fs.cpSync(shadcnBaseDir, projectPath, { recursive: true });

  // 2. Copier les fichiers de configuration spécifiques par-dessus
  copyConfigFiles(projectPath, config, templatesDir);

  // 3. Générer lib/auth/config.ts dynamiquement selon les options
  generateAuthConfig(projectPath, config);

  // 4. Copier les variantes conditionnelles (OAuth, Stripe, email, etc.)
  copyConditionalVariants(projectPath, config, replacementsForVariants(config));

  // 5. Générer .gitignore
  generateGitignore(projectPath);

  // 6. Générer README.md
  generateReadme(projectPath, config);

  logger.successWithComment('Structure du projet Next.js créée', 'Votre application web');
}

/**
 * Copie les fichiers de configuration spécifiques par-dessus le template shadcn-base
 * (Better Auth, Prisma, pages auth, layout, etc.)
 */
function copyConfigFiles(projectPath, config, templatesDir) {
  const hasEmail = config.email && config.email.provider !== 'none';
  const hasMagicLink = config.auth?.methods?.includes('magiclink');
  const hasOtp = config.auth?.methods?.includes('otp');

  // Variables de remplacement
  const allLanguages = [
    ...(config.i18n?.defaultLanguage ? [config.i18n.defaultLanguage] : ['fr']),
    ...(config.i18n?.languages || []).filter(l => l !== config.i18n?.defaultLanguage),
  ];

  // Déterminer la redirect après inscription
  const registerRedirect = hasEmail ? '/verify-email' : '/dashboard';

  // Construire la section de liens passwordless pour la page login
  const passwordlessLinks = [];
  if (hasMagicLink) passwordlessLinks.push({ label: 'Se connecter sans mot de passe', href: '/magic-link' });
  if (hasOtp) passwordlessLinks.push({ label: 'Se connecter par code OTP', href: '/otp' });

  let passwordlessLinkSection = '';
  if (passwordlessLinks.length > 0) {
    const links = passwordlessLinks
      .map(l => `              <Link href="${l.href}" className="text-sm text-muted-foreground hover:underline">\n                ${l.label}\n              </Link>`)
      .join('\n');
    passwordlessLinkSection = `<div className="flex flex-col items-center gap-2 w-full">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">ou</span>
                </div>
              </div>
${links}
            </div>`;
  }

  const replacements = {
    '{{PROJECT_NAME}}': config.projectName,
    '{{THEME}}': config.theme || 'system',
    '{{DEFAULT_LANGUAGE}}': config.i18n?.defaultLanguage || 'fr',
    '{{AVAILABLE_LANGUAGES}}': allLanguages.join(','),
    '{{REGISTER_REDIRECT}}': registerRedirect,
    '{{PASSWORDLESS_LINK_SECTION}}': passwordlessLinkSection,
  };

  // Fichiers toujours copiés (écrasent le shadcn-base)
  // Note: lib/auth/config.ts est généré dynamiquement par generateAuthConfig()
  const alwaysCopy = [
    'app/page.tsx',
    'app/layout.tsx',
    'app/error.tsx',
    'app/not-found.tsx',
    'app/login/page.tsx',
    'app/register/page.tsx',
    'app/pricing/page.tsx',
    'app/about/page.tsx',
    'app/dashboard/layout.tsx',
    'app/dashboard/page.tsx',
    'app/dashboard/account/page.tsx',
    'app/dashboard/settings/page.tsx',
    'app/api/auth/[...all]/route.ts',
    'lib/auth/client.ts',
    'lib/db/client.ts',
    'lib/dal.ts',
    'components/auth/logout-button.tsx',
    'components/auth/github-button.tsx',
    'components/app-sidebar.tsx',
    'components/site-header.tsx',
    'components/nav-user.tsx',
    'components/nav-main.tsx',
    'components/nav-secondary.tsx',
    'components/navbar.tsx',
    'components/footer.tsx',
    'components/theme-provider.tsx',
    'components/theme-toggle.tsx',
    'types/index.ts',
    'prisma/schema.prisma',
    'DEVELOPMENT.md',
  ];

  // Fichiers conditionnels
  const conditionalCopy = [];
  if (hasEmail) {
    conditionalCopy.push(
      'lib/email/client.ts',
      'lib/email/templates.ts',
      'app/forgot-password/page.tsx',
      'app/reset-password/page.tsx',
      'app/verify-email/page.tsx',
    );
  }
  if (config.storage && config.storage.enabled) {
    conditionalCopy.push(
      'lib/storage/client.ts',
      'lib/storage/minio-client.ts',
      'app/api/media/route.ts',
      'app/api/media/upload/route.ts',
      'app/dashboard/media/page.tsx',
      'components/media/upload-dialog.tsx',
      'components/ui/dialog.tsx',
    );
  }
  if (config.ai && config.ai.providers && config.ai.providers.length > 0) {
    conditionalCopy.push('lib/ai/client.ts');
  }

  for (const file of [...alwaysCopy, ...conditionalCopy]) {
    const src = path.join(templatesDir, file);
    const dest = path.join(projectPath, file);

    if (!fs.existsSync(src)) continue;

    fs.mkdirSync(path.dirname(dest), { recursive: true });

    let content = fs.readFileSync(src, 'utf-8');
    for (const [key, value] of Object.entries(replacements)) {
      content = content.replaceAll(key, value);
    }
    fs.writeFileSync(dest, content, 'utf-8');
  }
}

/**
 * Génère lib/auth/config.ts dynamiquement selon les options de configuration
 */
function generateAuthConfig(projectPath, config) {
  const hasEmail = config.email && config.email.provider !== 'none';
  const hasMagicLink = config.auth?.methods?.includes('magiclink');
  const hasOtp = config.auth?.methods?.includes('otp');
  const hasGithub = config.auth?.methods?.includes('github');
  const hasGoogle = config.auth?.methods?.includes('google');
  const appName = config.projectName;

  // Imports conditionnels
  const emailImports = [];
  if (hasEmail) {
    emailImports.push('sendVerificationEmail', 'sendResetPasswordEmail');
  }
  if (hasMagicLink) {
    emailImports.push('sendMagicLinkEmail');
  }
  if (hasOtp) {
    emailImports.push('sendOtpEmail');
  }

  const pluginImports = [];
  if (hasMagicLink) pluginImports.push('magicLink');
  if (hasOtp) pluginImports.push('emailOtp');

  // Construction du fichier
  let lines = [];

  lines.push('import { betterAuth } from "better-auth"');
  lines.push('import { prismaAdapter } from "better-auth/adapters/prisma"');
  lines.push('import { prisma } from "@/lib/db/client"');

  if (pluginImports.length > 0) {
    lines.push(`import { ${pluginImports.join(', ')} } from "better-auth/plugins"`);
  }

  if (emailImports.length > 0) {
    lines.push(`import { ${emailImports.join(', ')} } from "@/lib/email/templates"`);
  }

  lines.push('');
  lines.push('console.log("🔧 Initialisation Better Auth...")');
  lines.push('console.log("📦 DATABASE_URL:", process.env.DATABASE_URL ? "✅ Définie" : "❌ Manquante")');
  lines.push('');

  lines.push('export const auth = betterAuth({');
  lines.push('  database: prismaAdapter(prisma, {');
  lines.push('    provider: "postgresql",');
  lines.push('  }),');

  // emailAndPassword
  if (config.auth?.methods?.includes('email')) {
    lines.push('  emailAndPassword: {');
    lines.push('    enabled: true,');
    if (hasEmail) {
      lines.push('    sendResetPassword: async ({ user, url }) => {');
      lines.push(`      void sendResetPasswordEmail(user.email, user.name || user.email, url, "${appName}")`);
      lines.push('    },');
    }
    lines.push('  },');
  }

  // emailVerification
  if (hasEmail) {
    lines.push('  emailVerification: {');
    lines.push('    sendOnSignUp: true,');
    lines.push('    sendVerificationEmail: async ({ user, url }) => {');
    lines.push(`      void sendVerificationEmail(user.email, user.name || user.email, url, "${appName}")`);
    lines.push('    },');
    lines.push('  },');
  }

  // socialProviders
  lines.push('  socialProviders: {');
  if (hasGithub) {
    lines.push('    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? {');
    lines.push('      github: {');
    lines.push('        clientId: process.env.GITHUB_CLIENT_ID,');
    lines.push('        clientSecret: process.env.GITHUB_CLIENT_SECRET,');
    lines.push('      },');
    lines.push('    } : {}),');
  }
  if (hasGoogle) {
    lines.push('    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {');
    lines.push('      google: {');
    lines.push('        clientId: process.env.GOOGLE_CLIENT_ID,');
    lines.push('        clientSecret: process.env.GOOGLE_CLIENT_SECRET,');
    lines.push('      },');
    lines.push('    } : {}),');
  }
  lines.push('  },');

  // plugins
  if (pluginImports.length > 0) {
    lines.push('  plugins: [');
    if (hasMagicLink) {
      lines.push('    magicLink({');
      lines.push('      sendMagicLink: async ({ email, url }) => {');
      lines.push(`        void sendMagicLinkEmail(email, email, url, "${appName}")`);
      lines.push('      },');
      lines.push('    }),');
    }
    if (hasOtp) {
      lines.push('    emailOtp({');
      lines.push('      sendVerificationOTP: async ({ email, otp, type }) => {');
      lines.push(`        void sendOtpEmail(email, otp, type, "${appName}")`);
      lines.push('      },');
      lines.push('    }),');
    }
    lines.push('  ],');
  }

  lines.push('})');
  lines.push('');

  const content = lines.join('\n');
  const dest = path.join(projectPath, 'lib/auth/config.ts');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content, 'utf-8');
}

/**
 * Retourne les variables de remplacement communes pour les variantes
 */
function replacementsForVariants(config) {
  const allLanguages = [
    ...(config.i18n?.defaultLanguage ? [config.i18n.defaultLanguage] : ['fr']),
    ...(config.i18n?.languages || []).filter(l => l !== config.i18n?.defaultLanguage),
  ];
  return {
    '{{PROJECT_NAME}}': config.projectName,
    '{{THEME}}': config.theme || 'system',
    '{{DEFAULT_LANGUAGE}}': config.i18n?.defaultLanguage || 'fr',
    '{{AVAILABLE_LANGUAGES}}': allLanguages.join(','),
  };
}

/**
 * Copie un fichier variant avec remplacement de variables
 */
function copyVariantFile(src, dest, replacements) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  let content = fs.readFileSync(src, 'utf-8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(key, value);
  }
  fs.writeFileSync(dest, content, 'utf-8');
}

/**
 * Copie les variantes conditionnelles selon la configuration
 */
function copyConditionalVariants(projectPath, config, replacements) {
  const variantsDir = path.join(__dirname, '../templates/variants');

  // Billing page si Stripe activé
  if (config.payments.enabled) {
    copyVariantFile(
      path.join(variantsDir, 'billing/billing-page.tsx'),
      path.join(projectPath, 'app/dashboard/billing/page.tsx'),
      replacements
    );
  }

  // Sidebar avec lien Médias si storage activé
  if (config.storage && config.storage.enabled) {
    copyVariantFile(
      path.join(variantsDir, 'storage/app-sidebar-with-media.tsx'),
      path.join(projectPath, 'components/app-sidebar.tsx'),
      replacements
    );
  }

  // Page Magic Link si magiclink activé
  if (config.auth?.methods?.includes('magiclink')) {
    copyVariantFile(
      path.join(variantsDir, 'auth/magic-link-page.tsx'),
      path.join(projectPath, 'app/magic-link/page.tsx'),
      replacements
    );
  }

  // Page OTP si otp activé
  if (config.auth?.methods?.includes('otp')) {
    copyVariantFile(
      path.join(variantsDir, 'auth/otp-page.tsx'),
      path.join(projectPath, 'app/otp/page.tsx'),
      replacements
    );
  }
}

function generateGitignore(projectPath) {
  const content = `# dependencies
node_modules
.pnp
.pnp.js
.yarn/install-state.gz

# testing
coverage

# next.js
.next/
out/
build
dist

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
prisma/dev.db
prisma/dev.db-journal

# claude
.claude/temp/
`;
  writeFile(path.join(projectPath, '.gitignore'), content);
}

function generateReadme(projectPath, config) {
  const hasDocker = config.database.type === 'docker' || (config.storage.enabled && config.storage.type === 'minio');
  const content = `# ${config.projectName}

Projet SAAS généré avec \`create-saas-sbk\`.

## Démarrage rapide

1. Installer les dépendances :
\`\`\`bash
npm install
\`\`\`

${hasDocker ? `2. Démarrer les services Docker :
\`\`\`bash
npm run docker:up
\`\`\`

` : ''}${hasDocker ? '3' : '2'}. Configurer la base de données :
\`\`\`bash
npm run db:push
\`\`\`

${hasDocker ? '4' : '3'}. Démarrer le serveur :
\`\`\`bash
npm run dev
\`\`\`

${hasDocker ? '5' : '4'}. Ouvrir [http://localhost:3000](http://localhost:3000)

## Documentation

Consultez \`.claude/README.md\` pour la documentation complète de la stack technique.
`;
  writeFile(path.join(projectPath, 'README.md'), content);
}
