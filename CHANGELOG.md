# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Non publié]

### Phase 4 - Futur (optionnel)
- Tests unitaires et end-to-end
- Mode debug/verbose pour le CLI
- Connexion fonctionnelle complète dans les templates
- Publication npm

## [0.3.1] - 2026-02-07

### Ajouté - Améliorations Skills et Shadcn

#### Installation Shadcn Dashboard
- Nouveau module `src/installers/shadcn.js`
- Installation automatique de `dashboard-01` template
- Composants dashboard pré-assemblés
- Gain de temps de 2-3 heures sur le setup dashboard

#### Skills Claude Code optimisés
- Refactoring complet de `src/installers/skills.js`
- Utilisation des URLs GitHub officielles pour tous les skills
- **Skills de base** (toujours installés) :
  - Next.js Best Practices
  - Prisma Expert (https://github.com/sickn33/antigravity-awesome-skills)
  - Better Auth (https://github.com/better-auth/skills)
  - Shadcn UI (https://github.com/giuseppe-trisciuoglio/developer-kit)
- **Skills conditionnels** :
  - Stripe Best Practices (si paiements activés)
  - 4 skills Resend (si email provider = resend)
  - MinIO (si storage type = minio)
- Structure améliorée avec `{name, command}`

#### Ordre d'installation optimisé
1. Dépendances npm
2. Composants Shadcn UI (nouveau)
3. Skills Claude Code (amélioré)
4. Initialisation Claude Code

### Modifié
- Nombre de skills : 4 à 9+ selon configuration
- Qualité des skills : URLs GitHub officielles
- Dashboard : Template professionnel pré-installé

## [0.3.0] - 2026-02-07

### Ajouté - Phase 3 (Helpers et Documentation)

#### Helpers Email
- `lib/email/client.ts` - Client universel (Resend ou SMTP)
- `lib/email/templates.ts` - 4 templates HTML professionnels
  - Email de bienvenue
  - Email de vérification
  - Email de réinitialisation de mot de passe
  - Email Magic Link
- Helpers dédiés pour chaque type d'email

#### Helpers Storage
- `lib/storage/client.ts` - Client universel (S3 ou MinIO)
- Fonctions `uploadFile()`, `downloadFile()`, `deleteFile()`, `getFileUrl()`
- Support des URLs signées temporaires
- Gestion automatique du bucket MinIO

#### Helpers IA
- `lib/ai/client.ts` - Client universel (Claude/OpenAI/Gemini)
- Support du streaming en temps réel
- Fonctions simplifiées `ask()` et `chat()`
- Exemples d'intégration avec routes API

#### CLI améliorations
- Option `--help` / `-h` - Affiche l'aide complète
- Option `--version` / `-v` - Affiche la version
- Aide formatée avec exemples d'utilisation

#### Documentation
- `docs/BETTER-AUTH-INTEGRATION.md` - Guide complet Better Auth
  - Configuration pas à pas
  - Connexion des formulaires
  - Protection des routes
  - GitHub OAuth
  - Gestion des sessions
- `docs/DEPLOYMENT.md` - Guide de déploiement production
  - Vercel (recommandé)
  - Railway
  - Docker + VPS
  - Checklist de sécurité
  - Configuration base de données
  - Stripe en production
- `docs/HELPERS-GUIDE.md` - Guide d'utilisation des helpers
  - Exemples email
  - Exemples storage
  - Exemples IA avec streaming
  - Routes API complètes
  - Bonnes pratiques

## [0.2.0] - 2026-02-07

### Ajouté - Phase 2 (Templates Next.js complets)

#### Pages publiques
- Page tarifs (`app/pricing/page.tsx`) avec 3 plans et design attractif
- Page à propos (`app/about/page.tsx`) avec mission, valeurs et technologies
- Page de connexion (`app/login/page.tsx`) avec formulaire complet
- Page d'inscription (`app/register/page.tsx`) avec validation

#### Dashboard protégé
- Layout dashboard (`app/dashboard/layout.tsx`) avec navigation et header
- Page d'accueil dashboard (`app/dashboard/page.tsx`) avec statistiques et démarrage rapide
- Page paramètres (`app/dashboard/settings/page.tsx`) pour gérer profil et préférences
- Page compte (`app/dashboard/account/page.tsx`) pour sécurité et gestion de compte
- Page facturation (`app/dashboard/billing/page.tsx`) conditionnelle si Stripe activé

#### Composants UI (Shadcn)
- Input - Champ de saisie stylisé
- Label - Labels de formulaire
- Card (+ CardHeader, CardContent, CardFooter, CardTitle, CardDescription)
- Navbar - Barre de navigation réutilisable
- Footer - Pied de page réutilisable

#### Configuration Better Auth
- `lib/auth/config.ts` - Configuration serveur Better Auth avec Prisma adapter
- `lib/auth/client.ts` - Client auth pour le navigateur
- `app/api/auth/[...all]/route.ts` - Routes API auth
- Schéma Prisma mis à jour pour Better Auth (User, Account, Session)

#### Configuration Base de données
- `lib/db/client.ts` - Client Prisma avec singleton pattern
- Schéma Prisma complet compatible Better Auth

#### Pages spéciales Next.js
- `app/not-found.tsx` - Page 404 personnalisée
- `app/loading.tsx` - Page de chargement avec spinner
- `app/error.tsx` - Page d'erreur avec bouton réessayer
- `middleware.ts` - Protection des routes dashboard

#### Types
- `types/index.ts` - Types TypeScript globaux (User, Session)

#### Variantes conditionnelles
- GitHub OAuth button (`variants/auth/github-button.tsx`)
- Page billing pour Stripe (`variants/billing/billing-page.tsx`)
- Logique de copie conditionnelle dans le générateur

#### Améliorations
- Documentation .claude/README.md mise à jour avec structure complète
- Variables d'environnement additionnelles (NEXT_PUBLIC_APP_URL)
- Schéma Prisma compatible Better Auth
- Copie automatique des variantes selon la configuration

### Modifié
- `nextjs-generator.js` - Ajout de la logique de copie des variantes
- `claude-generator.js` - Documentation améliorée avec structure complète
- `env-generator.js` - Variables NEXT_PUBLIC ajoutées

## [0.1.0] - 2026-02-07

### Ajouté - Phase 1 (Fondations)

#### CLI
- Point d'entrée CLI avec shebang
- 10 catégories de questions interactives
- Validations strictes de toutes les entrées
- Récapitulatif avec confirmation
- Messages colorés et spinners

#### Core
- `questions.js` - Questions pour projet, theme, DB, auth, storage, email, payments, i18n, IA, Claude Code
- `validation.js` - Validations regex strictes et sanitization
- `config-builder.js` - Construction de la configuration finale
- `summary.js` - Affichage récapitulatif avec masquage des secrets

#### Générateurs
- `env-generator.js` - Génération .env avec toutes les variables
- `docker-generator.js` - Génération docker-compose.yml (PostgreSQL + MinIO)
- `claude-generator.js` - Génération .claude/README.md avec documentation
- `package-generator.js` - Génération package.json avec dépendances adaptées
- `nextjs-generator.js` - Génération projet Next.js avec configs

#### Installers
- `dependencies.js` - Installation npm avec spinner
- `skills.js` - Installation automatique des skills Claude Code
- `claude-init.js` - Lancement de /init si CLI installé

#### Utils
- `logger.js` - Messages colorés (chalk)
- `spinner.js` - Spinners de progression (ora)
- `command-runner.js` - Exécution sécurisée des commandes
- `file-utils.js` - Manipulation de fichiers et templating

#### Templates
- Structure de base Next.js 15+
- Layout principal avec ThemeProvider
- Landing page simple
- Composant Button (Shadcn UI)
- Styles globaux (Tailwind + CSS variables)
- Configuration TypeScript, Tailwind, PostCSS
- Schéma Prisma de base

#### Sécurité
- Validations strictes avec regex
- Sanitization des entrées pour .env et YAML
- Masquage des mots de passe et clés API
- Exécution sécurisée des commandes (spawn avec arrays)
- Aucune exécution de code non sécurisé

#### Configuration
- Support PostgreSQL (Docker ou distant)
- Support MinIO (Docker) ou AWS S3
- Support Resend ou SMTP personnalisé
- Support Stripe
- Support IA (Claude, ChatGPT, Gemini)
- Support i18n multilingue
- Support Better Auth (email, GitHub OAuth, Magic Link)

#### Documentation
- README.md complet
- CLAUDE.md avec guidelines
- CONTRIBUTING.md pour les contributions
- STATUS.md pour suivre l'avancement
- LICENSE (MIT)

### Sécurité
- Toutes les entrées sont validées
- Pas d'eval ni d'exécution dangereuse
- Secrets masqués dans les logs
- Sanitization avant écriture fichiers

## Types de changements

- `Ajouté` pour les nouvelles fonctionnalités
- `Modifié` pour les changements aux fonctionnalités existantes
- `Déprécié` pour les fonctionnalités qui seront supprimées
- `Supprimé` pour les fonctionnalités supprimées
- `Corrigé` pour les corrections de bugs
- `Sécurité` pour les vulnérabilités corrigées
