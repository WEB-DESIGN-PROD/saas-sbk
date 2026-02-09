/**
 * Génère le contenu du fichier .claude/README.md
 */
export function generateClaudeReadme(config) {
  const lines = [
    `# ${config.projectName} - Stack Technique`,
    '',
    '## Vue d\'ensemble',
    '',
    `Ce projet est un SaaS généré avec \`create-saas-sbk\`. Il utilise une stack moderne et complète pour démarrer rapidement.`,
    '',
    '## Configuration choisie',
    '',
    '### Frontend & Backend',
    '- **Next.js 16+** avec App Router',
    '- **React 19** avec Server Components',
    '- **TypeScript** pour la sécurité des types',
    '- **Tailwind CSS** pour le styling',
    '- **Shadcn UI** pour les composants',
    '',
    '### Authentification',
    '- **Better Auth** comme système d\'authentification',
    `- Méthodes activées: ${config.auth.methods.join(', ')}`,
  ];

  if (config.auth.methods.includes('github')) {
    lines.push('- OAuth GitHub configuré');
  }
  if (config.auth.methods.includes('magiclink')) {
    lines.push('- Magic Link (connexion par email)');
  }

  lines.push('');
  lines.push('### Base de données');
  lines.push('- **PostgreSQL** comme base de données principale');
  lines.push('- **Prisma** comme ORM');
  if (config.database.type === 'docker') {
    lines.push('- PostgreSQL local via Docker Compose');
  } else {
    lines.push('- PostgreSQL distant (Neon, Supabase, etc.)');
  }

  lines.push('');

  if (config.storage.enabled) {
    lines.push('### Stockage médias');
    if (config.storage.type === 'minio') {
      lines.push('- **MinIO** local via Docker Compose');
      lines.push('- Compatible API S3');
      lines.push(`- Console web: http://localhost:${config.storage.minioConsolePort}`);
    } else {
      lines.push('- **AWS S3**');
      lines.push(`- Région: ${config.storage.s3Region}`);
      lines.push(`- Bucket: ${config.storage.s3Bucket}`);
    }
    lines.push('');
  }

  lines.push('### Emails');
  if (config.email.provider === 'resend') {
    lines.push('- **Resend** pour l\'envoi d\'emails');
    lines.push('- API simple et moderne');
  } else {
    lines.push('- **SMTP personnalisé**');
    lines.push(`- Hôte: ${config.email.smtpHost}`);
  }
  lines.push('');

  if (config.payments.enabled) {
    lines.push('### Paiements');
    lines.push('- **Stripe** en mode test');
    lines.push('- Intégration complète pour abonnements');
    lines.push('- Webhooks configurés');
    lines.push('');
  }

  lines.push('### Internationalisation');
  lines.push(`- Langue par défaut: ${config.i18n.defaultLanguage}`);
  lines.push(`- Langues supportées: ${config.i18n.languages.join(', ')}`);
  lines.push('');

  if (config.ai.providers.length > 0) {
    lines.push('### Intelligence Artificielle pour utilisateurs finaux');
    const providerNames = {
      claude: 'Claude (Anthropic)',
      openai: 'ChatGPT (OpenAI)',
      gemini: 'Gemini (Google)'
    };
    const selectedProviders = config.ai.providers.map(p => providerNames[p]).join(', ');
    lines.push(`- Providers: ${selectedProviders}`);
    lines.push('- Prêt pour intégration de features IA pour vos utilisateurs');
    lines.push('');
  }

  lines.push('## Structure du projet');
  lines.push('');
  lines.push('```');
  lines.push('app/');
  lines.push('├── page.tsx                    # Landing page publique');
  lines.push('├── pricing/page.tsx            # Page tarifs');
  lines.push('├── about/page.tsx              # Page à propos');
  lines.push('├── login/page.tsx              # Connexion (formulaire complet)');
  lines.push('├── register/page.tsx           # Inscription (formulaire complet)');
  lines.push('├── api/auth/[...all]/route.ts  # API routes Better Auth');
  lines.push('└── dashboard/                  # Zone protégée (auth requise)');
  lines.push('    ├── layout.tsx              # Layout avec navigation et auth');
  lines.push('    ├── page.tsx                # Dashboard home avec stats');
  lines.push('    ├── settings/page.tsx       # Paramètres utilisateur');
  lines.push('    ├── account/page.tsx        # Gestion compte et sécurité');
  if (config.payments.enabled) {
    lines.push('    └── billing/page.tsx        # Facturation Stripe');
  }
  lines.push('');
  lines.push('components/');
  lines.push('├── ui/                         # Composants Shadcn UI');
  lines.push('│   ├── button.tsx');
  lines.push('│   ├── input.tsx');
  lines.push('│   ├── label.tsx');
  lines.push('│   └── card.tsx');
  lines.push('└── theme-provider.tsx          # Provider de thème');
  lines.push('');
  lines.push('lib/');
  lines.push('├── auth/');
  lines.push('│   ├── config.ts               # Configuration Better Auth');
  lines.push('│   └── client.ts               # Client auth côté navigateur');
  lines.push('├── db/');
  lines.push('│   └── client.ts               # Client Prisma');
  lines.push('└── utils.ts                    # Utilitaires (cn helper)');
  lines.push('');
  lines.push('prisma/');
  lines.push('└── schema.prisma               # Schéma de base de données');
  lines.push('');
  lines.push('public/                         # Assets statiques');
  lines.push('```');
  lines.push('');

  lines.push('## Commandes disponibles');
  lines.push('');
  lines.push('### Développement');
  lines.push('```bash');
  lines.push('npm run dev          # Démarrer le serveur de développement');
  lines.push('npm run build        # Build de production');
  lines.push('npm run start        # Démarrer en production');
  lines.push('npm run lint         # Linter le code');
  lines.push('```');
  lines.push('');

  if (config.database.type === 'docker' || (config.storage.enabled && config.storage.type === 'minio')) {
    lines.push('### Docker');
    lines.push('```bash');
    lines.push('npm run docker:up    # Démarrer les services Docker');
    lines.push('npm run docker:down  # Arrêter les services Docker');
    lines.push('npm run docker:logs  # Voir les logs');
    lines.push('```');
    lines.push('');
  }

  lines.push('### Base de données');
  lines.push('```bash');
  lines.push('npm run db:push      # Synchroniser le schéma Prisma');
  lines.push('npm run db:migrate   # Créer une migration');
  lines.push('npm run db:studio    # Ouvrir Prisma Studio');
  lines.push('npm run db:seed      # Seeder la base (si configuré)');
  lines.push('```');
  lines.push('');

  lines.push('## Démarrage rapide');
  lines.push('');
  lines.push('1. **Installer les dépendances**');
  lines.push('   ```bash');
  lines.push('   npm install');
  lines.push('   ```');
  lines.push('');

  if (config.database.type === 'docker' || (config.storage.enabled && config.storage.type === 'minio')) {
    lines.push('2. **Démarrer les services Docker**');
    lines.push('   ```bash');
    lines.push('   npm run docker:up');
    lines.push('   ```');
    lines.push('');
  }

  lines.push('3. **Configurer la base de données**');
  lines.push('   ```bash');
  lines.push('   npm run db:push');
  lines.push('   ```');
  lines.push('');

  lines.push('4. **Démarrer le serveur**');
  lines.push('   ```bash');
  lines.push('   npm run dev');
  lines.push('   ```');
  lines.push('');
  lines.push('5. **Ouvrir dans le navigateur**');
  lines.push('   ```');
  lines.push('   http://localhost:3000');
  lines.push('   ```');
  lines.push('');

  lines.push('## Claude Code');
  lines.push('');
  if (config.claude.cliInstalled) {
    lines.push('Claude Code a été initialisé sur ce projet. Vous pouvez utiliser :');
    lines.push('');
    lines.push('- `/generate-features` - Générer des fonctionnalités avec IA');
    lines.push('- Agents spécialisés disponibles dans `.claude/agents/`');
  } else {
    lines.push('Pour utiliser Claude Code sur ce projet :');
    lines.push('');
    lines.push('1. Installer Claude Code CLI : https://claude.ai/docs/cli');
    lines.push('2. Lancer `claude /init` dans ce projet');
    lines.push('3. Utiliser `/generate-features` pour générer des fonctionnalités');
  }
  lines.push('');

  lines.push('## Variables d\'environnement');
  lines.push('');
  lines.push('Toutes les variables sont configurées dans `.env`. Ne commitez jamais ce fichier !');
  lines.push('');

  lines.push('## Documentation');
  lines.push('');
  lines.push('- [Next.js](https://nextjs.org/docs)');
  lines.push('- [Better Auth](https://betterauth.dev/)');
  lines.push('- [Prisma](https://www.prisma.io/docs)');
  lines.push('- [Tailwind CSS](https://tailwindcss.com/docs)');
  lines.push('- [Shadcn UI](https://ui.shadcn.com/)');

  if (config.payments.enabled) {
    lines.push('- [Stripe](https://stripe.com/docs)');
  }

  if (config.email.provider === 'resend') {
    lines.push('- [Resend](https://resend.com/docs)');
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`Projet généré avec ❤️ par create-saas-sbk`);

  return lines.join('\n');
}
