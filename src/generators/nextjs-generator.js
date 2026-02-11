import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { copyDirectory, writeFile } from '../utils/file-utils.js';
import { logger } from '../utils/logger.js';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Copie les templates Next.js et génère les fichiers de configuration
 */
export function generateNextjsProject(projectPath, config) {
  // Chemin vers les templates
  const templatesDir = path.join(__dirname, '../templates');
  const nextjsBaseDir = path.join(templatesDir, 'nextjs-base');

  // Variables de remplacement pour templating
  const replacements = {
    PROJECT_NAME: config.projectName,
    THEME: config.theme,
    DEFAULT_LANGUAGE: config.i18n.defaultLanguage
  };

  // Copier le template de base
  try {
    copyDirectory(nextjsBaseDir, projectPath, replacements);
  } catch (error) {
    // Si le template n'existe pas encore, créer la structure minimale

    const dirs = [
      'app',
      'app/api',
      'app/api/auth',
      'app/dashboard',
      'app/login',
      'app/register',
      'app/pricing',
      'app/about',
      'components',
      'components/ui',
      'lib',
      'lib/auth',
      'lib/db',
      'lib/email',
      'public',
      'prisma',
      '.claude',
      '.claude/agents',
      '.claude/skills'
    ];

    dirs.forEach(dir => {
      const fullPath = path.join(projectPath, dir);
      fs.mkdirSync(fullPath, { recursive: true });
    });
  }

  // Générer next.config.js
  generateNextConfig(projectPath);

  // Générer tsconfig.json
  generateTsConfig(projectPath);

  // Générer tailwind.config.js
  generateTailwindConfig(projectPath);

  // Générer postcss.config.js
  generatePostcssConfig(projectPath);

  // Générer .gitignore
  generateGitignore(projectPath);

  // Générer README.md
  generateReadme(projectPath, config);

  // NOTE: Le schéma Prisma est déjà copié depuis les templates (ligne 29)
  // Ne pas appeler generatePrismaSchema car il écraserait le bon schéma !

  // Copier les variantes conditionnelles
  copyConditionalVariants(projectPath, config);

  logger.success('Structure du projet Next.js créée' + chalk.gray('     # Votre application web'));
}

/**
 * Copie les variantes conditionnelles selon la configuration
 */
function copyConditionalVariants(projectPath, config) {
  const variantsDir = path.join(__dirname, '../templates/variants');

  // GitHub OAuth Button
  if (config.auth.methods.includes('github')) {
    const githubButtonSrc = path.join(variantsDir, 'auth/github-button.tsx');
    const githubButtonDest = path.join(projectPath, 'components/auth/github-button.tsx');

    if (fs.existsSync(githubButtonSrc)) {
      fs.mkdirSync(path.dirname(githubButtonDest), { recursive: true });
      fs.copyFileSync(githubButtonSrc, githubButtonDest);
    }
  }

  // Billing page si Stripe activé
  if (config.payments.enabled) {
    const billingSrc = path.join(variantsDir, 'billing/billing-page.tsx');
    const billingDest = path.join(projectPath, 'app/dashboard/billing/page.tsx');

    if (fs.existsSync(billingSrc)) {
      fs.mkdirSync(path.dirname(billingDest), { recursive: true });
      fs.copyFileSync(billingSrc, billingDest);
    }
  }
}

function generateNextConfig(projectPath) {
  const content = `/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
`;

  writeFile(path.join(projectPath, 'next.config.mjs'), content);
}

function generateTsConfig(projectPath) {
  const content = `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`;

  writeFile(path.join(projectPath, 'tsconfig.json'), content);
}

function generateTailwindConfig(projectPath) {
  const content = `import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
`;

  writeFile(path.join(projectPath, 'tailwind.config.ts'), content);
}

function generatePostcssConfig(projectPath) {
  const content = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

  writeFile(path.join(projectPath, 'postcss.config.js'), content);
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
  const content = `# ${config.projectName}

Projet SAAS généré avec \`create-saas-sbk\`.

## Démarrage rapide

1. Installer les dépendances :
\`\`\`bash
npm install
\`\`\`

${config.database.type === 'docker' || (config.storage.enabled && config.storage.type === 'minio') ? `2. Démarrer les services Docker :
\`\`\`bash
npm run docker:up
\`\`\`

` : ''}3. Configurer la base de données :
\`\`\`bash
npm run db:push
\`\`\`

4. Démarrer le serveur :
\`\`\`bash
npm run dev
\`\`\`

5. Ouvrir [http://localhost:3000](http://localhost:3000)

## Documentation

Consultez \`.claude/README.md\` pour la documentation complète de la stack technique.

## Stack

- Next.js 16+ (App Router)
- React 19
- Better Auth
- Prisma + PostgreSQL
- Tailwind CSS + Shadcn UI
${config.payments.enabled ? '- Stripe\n' : ''}${config.email.provider === 'resend' ? '- Resend\n' : ''}${config.storage.enabled ? `- ${config.storage.type === 'minio' ? 'MinIO' : 'AWS S3'}\n` : ''}${config.ai.provider !== 'none' ? `- ${config.ai.provider}\n` : ''}
## Commandes

\`\`\`bash
npm run dev          # Développement
npm run build        # Build production
npm run start        # Démarrer en production
npm run lint         # Linter
npm run db:push      # Sync schéma Prisma
npm run db:studio    # Ouvrir Prisma Studio
${config.database.type === 'docker' || (config.storage.enabled && config.storage.type === 'minio') ? 'npm run docker:up    # Démarrer Docker\nnpm run docker:down  # Arrêter Docker\n' : ''}\`\`\`

## Support

Pour toute question, consultez la documentation ou ouvrez une issue.
`;

  writeFile(path.join(projectPath, 'README.md'), content);
}

function generatePrismaSchema(projectPath, config) {
  const content = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Better Auth Models
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified Boolean   @default(false)
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  accountId         String
  providerId        String
  accessToken       String?
  refreshToken      String?
  idToken           String?
  expiresAt         DateTime?
  password          String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([providerId, accountId])
}

model Session {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  ipAddress String?
  userAgent String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  id         String   @id @default(cuid())
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
`;

  writeFile(path.join(projectPath, 'prisma/schema.prisma'), content);
}
