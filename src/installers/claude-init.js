import path from 'path';
import { writeFile } from '../utils/file-utils.js';
import { logger } from '../utils/logger.js';

/**
 * Génère le contenu complet du fichier CLAUDE.md
 */
function generateClaudeMd(config, installedSkills) {
  const lines = [
    `# ${config.projectName}`,
    '',
    'Projet SaaS généré avec **create-saas-sbk**.',
    '',
  ];

  // ── Stack technique ──────────────────────────────────────────────────────────
  lines.push('## Stack technique', '');
  lines.push('- **Next.js 16+** avec App Router et Turbopack');
  lines.push('- **React 19** avec Server Components');
  lines.push('- **Better Auth** pour l\'authentification');
  lines.push('- **Prisma** + **PostgreSQL**');
  lines.push('- **Tailwind CSS v4** + **Shadcn UI**');

  if (config.payments.enabled) {
    lines.push('- **Stripe** pour les paiements (clés de test)');
  }
  if (config.email.provider === 'resend') {
    lines.push('- **Resend** pour les emails transactionnels');
  } else if (config.email.provider === 'smtp') {
    lines.push('- **SMTP** pour les emails transactionnels');
  }
  if (config.storage.enabled) {
    const storageLabel = config.storage.type === 'minio' ? 'MinIO (Docker)' : 'AWS S3';
    lines.push(`- **${storageLabel}** pour le stockage de médias`);
  }
  if (config.ai.providers && config.ai.providers.length > 0) {
    const providerNames = config.ai.providers.map(p => {
      if (p === 'claude') return 'Claude (Anthropic)';
      if (p === 'openai') return 'ChatGPT (OpenAI)';
      if (p === 'gemini') return 'Gemini (Google)';
      return p;
    });
    lines.push(`- **IA** : ${providerNames.join(', ')}`);
  }
  lines.push('');

  // ── Authentification ─────────────────────────────────────────────────────────
  lines.push('## Authentification', '');
  lines.push('- **Inscription** : email + mot de passe avec vérification email obligatoire');

  const loginMethod = config.auth.loginMethod || 'email-password';
  if (loginMethod === 'magiclink') {
    lines.push('- **Connexion** : Magic Link (lien envoyé par email)');
  } else if (loginMethod === 'otp') {
    lines.push('- **Connexion** : Code OTP (code à usage unique envoyé par email)');
  } else {
    lines.push('- **Connexion** : Email + mot de passe');
  }

  const oauthMethods = (config.auth.methods || []).filter(m => m === 'github' || m === 'google');
  if (oauthMethods.length > 0) {
    const oauthLabels = oauthMethods.map(m => m === 'github' ? 'GitHub' : 'Google');
    lines.push(`- **OAuth** : ${oauthLabels.join(', ')}`);
  }

  lines.push('- **Réinitialisation mot de passe** : email de réinitialisation');
  lines.push('- **Vérification email** : requise à l\'inscription');
  lines.push('');

  // ── Super Administrateur ─────────────────────────────────────────────────────
  if (config.admin && config.admin.enabled) {
    lines.push('## Super Administrateur', '');
    lines.push('Un super administrateur est configuré via la variable d\'environnement `ADMIN_EMAIL`.');
    lines.push('');
    lines.push('**Espace `/admin` :**');
    lines.push('- Tableau de bord avec statistiques (inscriptions, sessions actives)');
    lines.push('- Gestion des utilisateurs : rôles, plan, crédits supplémentaires');
    lines.push('- Impersonation : se connecter en tant qu\'un utilisateur pour du support');
    if (config.storage.enabled) {
      lines.push('- Gestion des médias uploadés');
    }
    if (config.saasType === 'blog') {
      lines.push('- Gestion du blog : articles, catégories, tags');
    }
    lines.push('');
    lines.push('> ⚠️  L\'email admin est stocké dans `.env` (ADMIN_EMAIL) et non versionné.');
    lines.push('');
  }

  // ── Type de SaaS ─────────────────────────────────────────────────────────────
  if (config.saasType === 'blog') {
    lines.push('## Système de Blog', '');
    lines.push('Le mode Blog ajoute un système complet de publication d\'articles.');
    lines.push('');

    lines.push('### Rôles et permissions', '');
    lines.push('| Rôle | Description | Droits |');
    lines.push('|------|-------------|--------|');
    lines.push('| `admin` | Super administrateur | Accès total, gestion utilisateurs |');
    lines.push('| `co-admin` | Co-administrateur | Gestion blog complète + impersonation |');
    lines.push('| `editor` | Éditeur | Créer/éditer/publier tous les articles, supprimer les siens |');
    lines.push('| `contributor` | Contributeur | Créer/modifier uniquement ses propres articles (Draft/PendingReview) |');
    lines.push('| `member` | Membre | Lecture uniquement |');
    lines.push('');

    lines.push('### Règles métier importantes', '');
    lines.push('- **Suppression d\'articles** : admin et co-admin uniquement pour n\'importe quel article ; l\'éditeur ne peut supprimer que les siens ; le contributeur ne peut pas supprimer');
    lines.push('- **Statuts disponibles** : `Draft`, `PendingReview`, `Published`, `Scheduled`, `Archived`');
    lines.push('- **Contributeur** : limité aux statuts `Draft` et `PendingReview` seulement');
    lines.push('- **Catégories** : création/modification réservée aux rôles editor et supérieurs');
    lines.push('- **Bouton "Modifier l\'article"** sur le blog public : visible uniquement pour editor, co-admin, admin (pas contributor)');
    lines.push('');

    lines.push('### Pages générées', '');
    lines.push('- `/blog` — Liste des articles publiés');
    lines.push('- `/blog/[slug]` — Article complet');
    lines.push('- `/blog/categorie/[slug]` — Articles par catégorie');
    lines.push('- `/blog/tag/[slug]` — Articles par tag');
    lines.push('- `/blog/preview/[id]` — Aperçu d\'un article non publié');
    lines.push('- `/admin/blog` — Gestion des articles (selon rôle)');
    lines.push('- `/admin/blog/new` — Créer un article');
    lines.push('- `/admin/blog/[id]/edit` — Modifier un article');
    lines.push('- `/dashboard/blog` — Mes articles (zone utilisateur connecté)');
    lines.push('- `/feed.xml` — Flux RSS');
    lines.push('');

    lines.push('### Composants clés', '');
    lines.push('- `components/blog/article-editor.tsx` — Éditeur Markdown complet avec prévisualisation');
    lines.push('- `components/blog/articles-table.tsx` — Table de gestion avec droits par rôle');
    lines.push('- `components/blog/categories-card.tsx` — Gestion des catégories');
    lines.push('- `components/admin/roles-permissions-card.tsx` — Récapitulatif des droits');
    lines.push('');

    lines.push('### API Routes blog', '');
    lines.push('- `GET/POST /api/blog/posts` — Liste et création d\'articles');
    lines.push('- `GET/PATCH/DELETE /api/blog/posts/[id]` — Lecture, modification, suppression');
    lines.push('- `GET/POST /api/blog/categories` — Catégories');
    lines.push('- `GET/POST /api/blog/tags` — Tags');
    lines.push('');
  }

  // ── Skills Claude Code ────────────────────────────────────────────────────────
  lines.push('## Skills Claude Code disponibles', '');

  if (installedSkills.length > 0) {
    lines.push('Les skills suivants sont disponibles dans `.claude/skills/` :');
    lines.push('');
    installedSkills.forEach(skill => {
      lines.push(`- **${skill.name}** — \`${skill.fileName}\``);
    });
    lines.push('');
    lines.push('Ces skills sont versionnés avec le projet et partagés avec l\'équipe.');
  } else {
    lines.push('Aucun skill installé.');
  }
  lines.push('');

  // ── Commandes utiles ─────────────────────────────────────────────────────────
  lines.push('## Commandes utiles', '');
  lines.push('```bash');
  lines.push('npm run dev          # Démarrer le serveur de développement (Turbopack)');

  if (config.database.type === 'docker' || (config.storage.enabled && config.storage.type === 'minio')) {
    lines.push('npm run docker:up    # Démarrer les services Docker (PostgreSQL / MinIO)');
  }

  lines.push('npm run db:push      # Synchroniser le schéma Prisma avec la base de données');
  lines.push('npm run db:studio    # Ouvrir Prisma Studio (interface graphique BDD)');
  lines.push('npm run build        # Build de production');
  lines.push('```');
  lines.push('');

  // ── Générer des fonctionnalités avec Claude Code ──────────────────────────────
  lines.push('## Générer des fonctionnalités avec Claude Code', '');
  lines.push('Une fois le projet démarré, vous pouvez étendre les fonctionnalités via Claude Code :');
  lines.push('');
  lines.push('```bash');
  lines.push('/generate-features');
  lines.push('```');
  lines.push('');
  lines.push('Cette commande lance un agent spécialisé qui analyse votre projet et génère');
  lines.push('des fonctionnalités complètes en s\'appuyant sur les skills installés :');
  lines.push('');
  lines.push('**Exemples de fonctionnalités générables :**');
  lines.push('- Nouvelles pages et API routes');
  lines.push('- Composants UI avec Shadcn');
  lines.push('- Logique métier et intégrations');
  if (config.saasType === 'blog') {
    lines.push('- Extensions du système de blog (newsletters, commentaires, SEO...)');
  }
  lines.push('');

  // ── Documentation ─────────────────────────────────────────────────────────────
  lines.push('## Documentation', '');
  lines.push('Consultez `.claude/README.md` pour la documentation complète de la stack technique.');

  return lines.join('\n');
}

/**
 * Génère le fichier CLAUDE.md dans le projet généré
 * Appelé pour tous les types de SaaS (default, blog, etc.)
 */
export function initClaude(projectPath, config, installedSkills = []) {
  try {
    const claudeMdContent = generateClaudeMd(config, installedSkills);
    writeFile(path.join(projectPath, 'CLAUDE.md'), claudeMdContent);
    logger.success('CLAUDE.md créé');
  } catch (error) {
    logger.warn('Échec de la génération de CLAUDE.md (non bloquant)');
    if (process.env.DEBUG) console.error(error);
  }
}
