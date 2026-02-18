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

  // 3. Copier les variantes conditionnelles (OAuth, Stripe, etc.)
  copyConditionalVariants(projectPath, config);

  // 4. Générer .gitignore
  generateGitignore(projectPath);

  // 5. Générer README.md
  generateReadme(projectPath, config);

  logger.successWithComment('Structure du projet Next.js créée', 'Votre application web');
}

/**
 * Copie les fichiers de configuration spécifiques par-dessus le template shadcn-base
 * (Better Auth, Prisma, pages auth, layout, etc.)
 */
function copyConfigFiles(projectPath, config, templatesDir) {
  // Variables de remplacement
  const allLanguages = [
    ...(config.i18n?.defaultLanguage ? [config.i18n.defaultLanguage] : ['fr']),
    ...(config.i18n?.languages || []).filter(l => l !== config.i18n?.defaultLanguage),
  ];
  const replacements = {
    '{{PROJECT_NAME}}': config.projectName,
    '{{THEME}}': config.theme || 'system',
    '{{DEFAULT_LANGUAGE}}': config.i18n?.defaultLanguage || 'fr',
    '{{AVAILABLE_LANGUAGES}}': allLanguages.join(','),
  };

  // Fichiers toujours copiés (écrasent le shadcn-base)
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
    'lib/auth/config.ts',
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
  if (config.email && config.email.provider !== 'none') {
    conditionalCopy.push('lib/email/client.ts', 'lib/email/templates.ts');
  }
  if (config.storage && config.storage.enabled) {
    conditionalCopy.push('lib/storage/client.ts');
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
 * Copie les variantes conditionnelles selon la configuration
 */
function copyConditionalVariants(projectPath, config) {
  const variantsDir = path.join(__dirname, '../templates/variants');

  // Billing page si Stripe activé
  if (config.payments.enabled) {
    const src = path.join(variantsDir, 'billing/billing-page.tsx');
    const dest = path.join(projectPath, 'app/dashboard/billing/page.tsx');
    if (fs.existsSync(src)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    }
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
