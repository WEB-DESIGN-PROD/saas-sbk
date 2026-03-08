# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Vue d'ensemble du projet

**saas-sbk** est un installateur CLI npm qui génère des projets SaaS Next.js 16+ complets et clés en main. Le CLI pose des questions interactives pour configurer automatiquement l'authentification, la base de données, les paiements, l'IA, les emails, le stockage médias, et l'internationalisation.

### Commande d'installation finale visée
```bash
npm create saas-sbk@latest
```

## Architecture technique

### Stack du CLI
- **Node.js** avec modules ESM
- **@clack/prompts** pour les prompts interactifs (pas inquirer/enquirer)
- **chalk** pour la coloration des messages
- **ora** pour les spinners de progression

### Stack du projet généré
- **Next.js 16+** (App Router, Turbopack)
- **React 19**
- **Better Auth** pour l'authentification (email/password, OAuth GitHub/Google, MagicLink, OTP)
- **Prisma** + **PostgreSQL** (Docker ou distant)
- **Stripe** pour les paiements (mode test)
- **Resend** ou SMTP personnalisé pour les emails
- **MinIO** (Docker) ou **AWS S3** pour le stockage médias
- **Shadcn UI** + **Tailwind CSS v4** pour l'interface
- Internationalisation multilingue (next-intl)
- Intégration IA (Claude/Gemini/ChatGPT selon choix)
- **@tailwindcss/typography** si blog activé

## Architecture du générateur

### Couches de templates (dans l'ordre d'application)

```
src/templates/
├── shadcn-base/       # 1. Base Shadcn UI (copiée en premier avec fs.cpSync)
│   └── components/ui/ # Composants UI génériques, globals.css, tsconfig.json...
├── nextjs-base/       # 2. Overlay Next.js (alwaysCopy + conditionalCopy)
│   ├── app/           # Pages app router, layouts, API routes
│   ├── components/    # Composants custom (app-sidebar, navbar, blog/...)
│   ├── lib/           # auth, db, email, storage, subscription, dal
│   └── prisma/        # schema.prisma
└── variants/          # 3. Variantes conditionnelles (login, register, email, OAuth...)
    ├── auth/
    ├── email/
    ├── billing/
    └── storage/       # ⚠️ app-sidebar-with-media.tsx SUPPRIMÉ (était obsolète)
```

### ⚠️ RÈGLE CRITIQUE — Variants vs nextjs-base

**JAMAIS** ajouter un variant qui écrase un fichier présent dans `nextjs-base/alwaysCopy`.
Le variant sera copié APRÈS `nextjs-base` et effacera la version correcte.

→ Préférer les **props dynamiques** dans le composant plutôt qu'un fichier variant séparé.

Exemple du bug corrigé : `variants/storage/app-sidebar-with-media.tsx` écrasait
`nextjs-base/components/app-sidebar.tsx` → supprimé, `app-sidebar.tsx` gère désormais
`hasStorage` via une prop.

### Générateurs (`src/generators/`)
- **`nextjs-generator.js`** — copie les templates, gère `alwaysCopy` + `conditionalCopy` + variants
- **`env-generator.js`** — génère `.env` avec toutes les variables selon la config
- **`package-generator.js`** — fusionne `package.json` shadcn-base + dépendances selon config
- **`docker-generator.js`** — génère `docker-compose.yml` si DB/storage Docker

### Questions interactives (`src/core/`)
- **`questions-v2.js`** — toutes les questions CLI avec @clack/prompts
- **`config-builder.js`** — transforme les réponses en objet `config` structuré

## Structure du projet généré

```
mon-saas/
├── app/
│   ├── page.tsx                    # Landing page publique
│   ├── pricing/page.tsx            # Page tarifs
│   ├── about/page.tsx              # Page à propos
│   ├── login/page.tsx              # Connexion (généré dynamiquement)
│   ├── register/page.tsx           # Inscription
│   ├── verify-email/page.tsx       # Vérification email
│   ├── forgot-password/page.tsx    # Mot de passe oublié
│   ├── reset-password/page.tsx     # Réinitialisation mot de passe
│   ├── dashboard/                  # Zone protégée (auth requise)
│   │   ├── layout.tsx              # Layout vérifiant session
│   │   ├── page.tsx                # Dashboard home
│   │   ├── settings/page.tsx       # Paramètres
│   │   ├── account/page.tsx        # Gestion compte
│   │   ├── billing/page.tsx        # Facturation Stripe
│   │   ├── media/page.tsx          # Médias MinIO (si storage activé)
│   │   └── blog/page.tsx           # Gestion articles (si blog activé)
│   ├── admin/                      # Zone super admin (si activé)
│   │   ├── layout.tsx              # Layout admin protégé
│   │   ├── page.tsx                # Stats & graphiques
│   │   ├── users/page.tsx          # Gestion utilisateurs + impersonation
│   │   ├── pages/page.tsx          # Pages dynamiques (Mentions, CGU…)
│   │   ├── features/page.tsx       # Features landing (drag-and-drop)
│   │   ├── faq/page.tsx            # FAQ landing (drag-and-drop)
│   │   ├── pricing/page.tsx        # Plans & packs de crédits
│   │   ├── blog/                   # Gestion blog admin (si blog activé)
│   │   └── media/page.tsx          # Gestion médias admin (si storage activé)
│   ├── blog/                       # Blog public (si blog activé)
│   │   ├── layout.tsx              # Layout avec Navbar + Footer
│   │   ├── page.tsx                # Liste articles
│   │   ├── [slug]/page.tsx         # Article complet
│   │   ├── categorie/[slug]/       # Articles par catégorie
│   │   ├── tag/[slug]/             # Articles par tag
│   │   └── preview/[id]/           # Aperçu non publié
│   ├── api/
│   │   ├── auth/[...all]/          # Better Auth handler
│   │   ├── media/                  # Upload + liste + suppression médias
│   │   └── blog/                   # CRUD posts, catégories, tags (si blog)
│   └── feed.xml/route.ts           # Flux RSS (si blog activé)
├── components/
│   ├── app-sidebar.tsx             # Sidebar avec mode dashboard/admin
│   ├── navbar.tsx                  # Navbar publique (hydration fix avec mounted)
│   ├── blog/                       # Composants blog (si blog activé)
│   │   ├── article-editor.tsx      # Éditeur markdown complet
│   │   ├── article-card.tsx        # Carte article (utilise <img> pas next/image)
│   │   ├── char-gauge.tsx          # Jauge de caractères
│   │   ├── category-manager.tsx    # Gestionnaire catégories
│   │   └── markdown-preview.tsx    # Rendu Markdown prose
│   └── admin/
│       └── auto-refresh.tsx        # Auto-refresh 30s
├── lib/
│   ├── auth/config.ts              # Config Better Auth (généré dynamiquement)
│   ├── auth/client.ts              # Client Better Auth
│   ├── db/client.ts                # Client Prisma
│   ├── dal.ts                      # Data Access Layer (getUserPlan, verifyAdmin)
│   ├── email/client.ts             # Service email (généré dynamiquement)
│   ├── storage/minio-client.ts     # Client MinIO + getPresignedUrl
│   └── subscription/helpers.ts    # Guards isFree/isFreemium/isPaid
├── prisma/schema.prisma            # User, Session, Account, Verification,
│                                   # Media, Post, Category, Tag (si blog)
├── types/index.ts                  # AccountType, etc.
├── docker-compose.yml              # Postgres + MinIO si configuré
├── .env                            # Variables d'environnement générées
└── README.md
```

## Variables d'environnement générées

```env
# Toujours présentes
DATABASE_URL=...
BETTER_AUTH_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Si admin activé
ADMIN_EMAIL=...

# Si blog activé
NEXT_PUBLIC_HAS_BLOG="true"

# Si storage activé
NEXT_PUBLIC_HAS_STORAGE="true"
MINIO_ENDPOINT=...
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
MINIO_BUCKET=...

# Si email activé
RESEND_API_KEY=...
EMAIL_FROM=...

# Si Stripe activé
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
```

## Règles de workflow GIT

- **JAMAIS** faire de `git push` sans que Jerome le demande explicitement
- **JAMAIS** créer de PR sans demande explicite
- Commits locaux OK à tout moment, push uniquement sur instruction

## Principes de sécurité CRITIQUES

- **TOUJOURS** valider les entrées utilisateur avec regex strictes
- **JAMAIS** d'`eval` ni de concaténation de commandes shell non sécurisées
- Utiliser `execSync` ou `spawn` avec tableaux d'arguments (pas de strings)
- Échapper et nettoyer les chaînes avant écriture dans `.env`, YAML
- Masquer les mots de passe dans le terminal (type password dans @clack/prompts)
- Gestion robuste des erreurs avec messages clairs

## Pièges connus et solutions

### 1. Props custom propagées au DOM
**Problème** : Props comme `accountType`, `hasBlog`, `hasStorage` passées à un composant
qui les spread sur un élément DOM → warning React.

**Solution** : Utiliser `Omit<React.ComponentProps<typeof Comp>, keyof CustomProps>` :
```tsx
interface MyProps { foo: string; bar?: boolean }
export function MyComp({ foo, bar, ...props }:
  MyProps & Omit<React.ComponentProps<typeof BaseComp>, keyof MyProps>) { ... }
```

### 2. Hydration mismatch avec useSession
**Problème** : `useSession` retourne des valeurs différentes server/client.

**Solution** : Pattern `mounted` dans la Navbar :
```tsx
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
const isLoggedIn = mounted && !!session?.user
```

### 3. next/image avec URLs MinIO presignées
**Problème** : `next/image` exige la configuration du domaine pour les URLs externes.

**Solution** : Utiliser `<img>` à la place dans les composants blog (article-card, pages blog).

### 4. Radix Select value=""
**Problème** : `<SelectItem value="">` n'est pas autorisé par Radix UI.

**Solution** : Utiliser `value="none"` comme sentinel, convertir en `null` avant sauvegarde.

### 5. @tailwindcss/typography en Tailwind v4
**Syntaxe** : `@plugin "@tailwindcss/typography";` dans `globals.css` (pas `require`).

## Commandes importantes (projet généré)

```bash
npm run dev          # Démarrer le serveur (Turbopack)
npm run build        # Build de production
npm run db:push      # Synchroniser le schéma Prisma
npm run db:studio    # Ouvrir Prisma Studio
npm run docker:up    # Démarrer les services Docker
```

## Roadmap

### Phase 1 ✅ — CLI Interactif (TERMINÉE)
- CLI interactif complet avec @clack/prompts
- Génération projet Next.js 16+ fonctionnel dès le démarrage
- Installation automatique des skills Claude Code
- PostgreSQL (Docker ou distant), OAuth GitHub/Google, Magic Link/OTP

### Phase 2 🚧 — Templates Complets (98%)
- Architecture templates statique (shadcn-base + nextjs-base overlay)
- Dashboard UX finalisé, auth emails complets
- Facturation & types d'utilisateurs (v0.8.0)
- Système super administrateur avec impersonation (v0.9.0)
- Système de blog complet — éditeur, admin, public, RSS (v0.10.0)
- Gestion contenu admin : Pages, Features, FAQ, Tarifs/Crédits depuis DB (v0.12.0-dev)
- Drag-and-drop réordonnement Features/FAQ/Pages, pages dynamiques navbar/footer

### Phase 3 📅 — Génération IA (À VENIR)
- Commande `/generate-features` dans Claude Code
- Agents spécialisés (dev, sécurité, SEO, perf)

## Ressources

- [Next.js App Router](https://nextjs.org/docs/app/building-your-application/routing)
- [Better Auth](https://www.better-auth.com/docs)
- [Prisma](https://www.prisma.io/docs/)
- [Stripe API](https://stripe.com/docs/api)
- [Resend](https://resend.com/docs)
- [MinIO](https://min.io/docs/minio/container/index.html)
- [Claude Code docs](https://docs.anthropic.com/claude-code)
- [Docker Compose](https://docs.docker.com/compose/)
- [@clack/prompts](https://github.com/bombshell-dev/clack)
