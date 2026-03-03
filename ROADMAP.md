# 🗺️ Roadmap - create-saas-sbk

## 🚧 v0.11.0 - mars 2026 (EN COURS)

### 🔐 RBAC complet sur le blog

- ✅ **5 rôles** — `admin`, `co-admin`, `editor`, `contributor`, `member`
- ✅ **API sécurisée** — PATCH/DELETE vérifient rôle ET propriété de l'article
- ✅ **Éditeur** — modifie tous les articles, supprime uniquement les siens
- ✅ **Contributeur** — modifie uniquement ses articles (statuts Draft/PendingReview)
- ✅ **Catégories** — création/édition/suppression réservée aux rôles editor+
- ✅ **Bouton "Modifier l'article"** sur le blog public — masqué aux contributeurs et visiteurs anonymes
- ✅ **`BLOG_EDITOR_ROLES`** — constante dédiée dans `types/index.ts`
- ✅ **Guard serveur** — `notFound()` si contributeur tente d'éditer l'article d'un autre

### 👤 Administration améliorée

- ✅ **Changement de rôle inline** — select dans `/admin/users` (admin uniquement, sauf soi-même)
- ✅ **Section rôles & permissions** — accordéon sur `/admin/users` avec tableau des droits par rôle
- ✅ **Médias liés aux articles** — badge cliquable vers l'article associé sur `/admin/media`

### ⌨️ CLI — Navigation et UX

- ✅ **Navigation retour** — option "◀ Étape précédente" dans chaque menu à choix
- ✅ **State machine** — refactorisation en step functions avec sentinel `BACK`
- ✅ **Hint persistant** — affiché sur chaque écran : "◀ Sélectionnez... pour revenir"
- ✅ **DB — COMING SOON** — MongoDB et SQLite désactivés (`disabled: true`)
- ✅ **Email — Resend par défaut** — Resend en premier, `initialValue: 'resend'`
- ✅ **Récap réordonné** — Gauche : Projet, BDD, Auth, Stockage, Email, Paiements · Droite : Thème, I18n, IA, Super Admin, Type SaaS, Claude Code

### 🤖 Claude Code — Génération complète

- ✅ **Skills copiés effectivement** — `skills.js` copie réellement les fichiers `.md` (était une liste vide)
- ✅ **Nouveaux agents** — `full-stack-dev.md` et `code-reviewer.md` dans `.claude/agents/`
- ✅ **Skill `generate-features`** — guide `/generate-features` inclus dans chaque projet
- ✅ **`CLAUDE.md` enrichi** — méthode de connexion, super admin, type SaaS, RBAC blog, `/generate-features`
- ✅ **Copie inconditionnelle** — skills, agents et CLAUDE.md générés pour **tous** les types de SaaS

### 🐛 Corrections

- ✅ Fix `config.ai.provider` (inexistant) → `config.ai.providers` (array) dans `claude-init.js`
- ✅ Fix hydration `ThemeToggle` — pattern `mounted`
- ✅ Fix emails dark mode — `color-scheme: light only`

---

## ✅ v0.10.0 - 2 mars 2026

### 📝 Système de blog complet

- ✅ **Option CLI "Type de SaaS"** — SaaS classique ou Blog SaaS
- ✅ **Schéma Prisma** — modèles `Post`, `Category`, `Tag` avec relations et SEO
- ✅ **Pages publiques** — liste, article, catégorie, tag, aperçu, RSS
- ✅ **Layout blog** — Navbar + Footer sur toutes les pages `/blog`
- ✅ **Lien "Blog" dans la Navbar** — conditionnel via `NEXT_PUBLIC_HAS_BLOG`
- ✅ **Éditeur d'articles** — markdown, image de couverture drag-and-drop, jauges CharGauge, tags, catégories, statut, SEO avec pré-remplissage auto
- ✅ **Interface admin blog** — liste filtrée + création + édition
- ✅ **Interface admin médias** — `/admin/media` accessible sans passer par `/dashboard`
- ✅ **Dashboard blog** — tableau de gestion des articles auteur
- ✅ **API REST complète** — posts, catégories, tags (GET/POST/PATCH/DELETE)
- ✅ **@tailwindcss/typography** — injection automatique pour rendu Markdown `prose`
- ✅ **Hydration fix Navbar** — pattern `mounted` pour `useSession`
- ✅ **Upload API** — retourne `url` presigned pour miniature immédiate
- ✅ **`<img>` à la place de `<Image>`** — compatible URLs MinIO sans config domaine

---

## ✅ v0.9.0 - 2 mars 2026

### 🛡️ Système super administrateur
- ✅ Question CLI "Super Admin" + email admin
- ✅ Rôle `admin` assigné automatiquement via `databaseHooks`
- ✅ Plugin Better Auth `admin` (ban, impersonation, rôles)
- ✅ `verifyAdmin()` dans le DAL
- ✅ AppSidebar avec mode `"dashboard"` / `"admin"`
- ✅ Page `/admin` — stats (membres, inscriptions, sessions, email vérifié) + graphique 30j
- ✅ Page `/admin/users` — tableau complet (plan, crédits, suppression, impersonation, recherche)
- ✅ Bannière d'impersonation dans le dashboard
- ✅ Auto-refresh 30 secondes

---

## ✅ v0.8.0 - 2 mars 2026

### 💳 Facturation & Types d'utilisateurs

- ✅ **`AccountType` enum** — `Free` (défaut), `Freemium` (crédits achetés), `Paid` (abonnement actif)
- ✅ **`subscriptionPlan`** — `Pro` / `Team` / `Enterprise` / `null`
- ✅ **`extraCredits`** — Crédits supplémentaires achetés hors abonnement (`Int @default(0)`)
- ✅ **`lib/subscription/helpers.ts`** — Guards typés (`isFree`, `isFreemium`, `isPaid`), labels, classes CSS badge
- ✅ **`getUserPlan(userId)`** — Fonction cachée dans `lib/dal.ts`
- ✅ **Page `/dashboard/billing`** — Plan actuel, crédits, 3 cards de plans (Pro/Team/Enterprise)
- ✅ **Dialog d'achat de crédits** — 4 packs dégressifs (100/500/1000/2000) avec badge "Populaire"
- ✅ **Carte upgrade sidebar** — Visible pour Free/Freemium, gradient, 3 avantages, bouton "Upgrade maintenant"

---

## ✅ v0.7.0 - 2 mars 2026

### 📧 Emails transactionnels + Authentification avancée

- ✅ **Concept loginMethod** — inscription universelle email/password + vérification ; loginMethod contrôle uniquement `/login`
- ✅ **Vérification email** — `emailVerification` Better Auth + page `/verify-email` + redirection depuis dashboard
- ✅ **Forgot/Reset password** — pages `/forgot-password` et `/reset-password` générées si `loginMethod = email-password`
- ✅ **Magic Link** — page `/login` variant magic link + plugin `magicLink` Better Auth
- ✅ **OTP** — page `/login` variant OTP 2 étapes + composant `InputOTP` shadcn/ui (6 cases) + plugin `emailOTP`
- ✅ **Format OTP email** — code affiché `XXX-XXX` dans l'email
- ✅ **Fix Resend** — gestion correcte `{ data, error }` (ne throw pas)
- ✅ **Fix emailOTP casse** — `emailOTP` (majuscules) côté serveur et client
- ✅ **Espacement formulaires** — `pb-6` sur tous les `CardContent` de formulaires auth
- ✅ **CLI astuce Resend** — note avant la question email expéditeur (domaine vérifié)
- ✅ **`lib/dal.ts`** — protection dashboard si email non vérifié

---

## ✅ v0.6.0 - 18 février 2026

### 🗂️ Page Médias Dashboard MinIO
- ✅ Page `/dashboard/media` - Grille médias avec preview images/icônes selon type MIME
- ✅ Upload drag-and-drop multi-fichiers via dialog
- ✅ Modèle Prisma `Media` (`key`, `name`, `size`, `mimeType`, `description?`, `tags String[]`)
- ✅ Clé MinIO stockée en DB → URLs presignées 24h fraîches à chaque chargement
- ✅ API REST complète (GET liste, DELETE, PATCH rename+meta)
- ✅ Dialog d'édition : nom (base + badge extension), description, tags chips
- ✅ Affichage carte : `line-clamp-2` description + `#TAG1 #TAG2` tags
- ✅ Barre de recherche temps réel (nom + description + tags), visible ≥ 2 fichiers
- ✅ Lightbox plein écran avec navigation prev/next (flèches + clavier), compteur
- ✅ Confirmation avant suppression
- ✅ Responsive mobile : recherche sous titre, bouton upload fixe en bas (`z-40`)
- ✅ Fix : reset dialog upload à chaque réouverture
- ✅ Fix : fallback `tags ?? []` pour anciens enregistrements

---

## ✅ v0.5.0 - 18 février 2026

### 🏗️ Refonte architecture templates
- ✅ Nouvelle couche `shadcn-base/` - Template statique versionné (plus d'appel npx shadcn)
- ✅ `fs.cpSync()` au lieu de `npx shadcn@latest` - Fiable, rapide, offline
- ✅ `package-generator.js` fusionne avec package.json shadcn-base (Tailwind v4 préservé)
- ✅ Nouvelle variable template `{{AVAILABLE_LANGUAGES}}`

### 🎨 Refonte UX complète
- ✅ **Navbar landing** - Logo gauche | liens centrés | actions droite + user icon + lang conditionnel
- ✅ **SiteHeader dashboard** - Lang toggle + Theme toggle + Logout (remplace bouton GitHub)
- ✅ **Sidebar** - Simplifiée (seulement Dashboard), plus de liens publics, {{PROJECT_NAME}}
- ✅ **nav-user dropdown** - Compte + Paramètres + Facturation + Notifications + Déconnexion
- ✅ **Padding** - Settings et Account pages corrigées (cohérence dashboard)
- ✅ **cursor-pointer** - Règle CSS globale pour tous les éléments interactifs

---

## ✅ v0.4.5 - 11 février 2026

### 🚀 Migration Next.js 16
- ✅ Migration de Next.js 15 vers Next.js 16.1.6
- ✅ Activation de Turbopack pour dev
- ✅ Migration React 19
- ✅ Nouveau template de dashboard moderne
- ✅ Correction de tous les composants (Slot.Root → Slot)
- ✅ Corrections CSS (webkit-scrollbar)

### 🎨 Amélioration UX du CLI
- ✅ **Migration vers @clack/prompts** - Interface moderne sans messages anglais
- ✅ Questions interactives avec interface élégante
- ✅ Instructions en français pour chaque question
  - "💡 Flèches ↑↓ = naviguer • Entrée = valider"
  - "💡 Espace = cocher/décocher • a = tout sélectionner • Entrée = valider"
- ✅ Logo persistant avec version dynamique et lien GitHub cliquable
- ✅ Liens cliquables vers services externes (Resend, Stripe, APIs IA)
- ✅ Récapitulatif en colonnes : "📋 Récap' de votre SAAS"
- ✅ Alignement automatique des commentaires explicatifs
- ✅ OAuth GitHub + Google
- ✅ Magic Link / OTP avec Resend

### 🗄️ Options de base de données
- ✅ PostgreSQL local Docker
- ✅ PostgreSQL distant (Neon, Supabase)
- 📅 **MongoDB local avec Docker** (planifié)
- 📅 **MongoDB distant (Atlas, etc.)** (planifié)
- 📅 **SQLite (fichier local)** (planifié)

### ⚙️ Améliorations de configuration
- ✅ Langues supplémentaires : confirmation puis sélection avec US pré-coché
- ✅ IA : confirmation puis sélection avec Claude pré-coché
- ✅ IA : Choix multiples possibles (plusieurs providers en même temps)
- ✅ Thème : déplacé à la fin (avant Claude Code)
- ✅ Emojis : uniquement Docker 🐳 conservé
- ✅ Mot de passe PostgreSQL : valeur par défaut masquée avec initialValue

### 🐛 Corrections de bugs
- ✅ Correction compteur [11/10] → [11/11]
- ✅ Correction affichage "Base de données : Distant" → "Aucune" si ignorée
- ✅ Correction questions qui disparaissent avec les flèches
- ✅ Suppression ligne 82 de nextjs-generator.js (generatePrismaSchema)
- ✅ Gestion correcte du flag `skipAuth`
- ✅ Validation et sanitization des entrées utilisateur

### 📝 Documentation
- ✅ Fichier TODO.md créé avec toutes les tâches futures
- ✅ TODO : Migration vers @clack/prompts
- ✅ TODO : Templates multilingues complets
- ✅ TODO : Template sans système de connexion
- ✅ TODO : Configuration MongoDB et SQLite complète
- ✅ README.md mis à jour (Next.js 16+)

---

## 📋 Phase 1 - CLI Interactif (TERMINÉE ✅)

### ✅ Questions interactives
- ✅ 11 questions guidées avec validation
- ✅ Interface moderne et discrète
- ✅ Instructions en français
- ✅ Boucle de confirmation avec possibilité de recommencer
- ✅ Récapitulatif clair avant génération

### ✅ Génération automatique
- ✅ Structure Next.js 16+ complète
- ✅ Configuration Better Auth
- ✅ Schéma Prisma pré-configuré
- ✅ Docker Compose (PostgreSQL, MongoDB, MinIO)
- ✅ Variables d'environnement (.env)
- ✅ package.json avec toutes les dépendances
- ✅ README.md du projet généré
- ✅ Documentation Claude Code (.claude/)

### ✅ Installation automatique
- ✅ npm install automatique
- ✅ Installation des skills Claude Code adaptés
- ✅ Lancement optionnel de /init

---

## 🎯 Phase 2 - Templates Complets (EN COURS)

### 🏗️ Templates Next.js
- [ ] **Pages publiques complètes**
  - [x] Landing page avec Navbar moderne
  - [x] Page pricing
  - [x] Page about/contact
  - [x] **Blog public** (liste, article, catégorie, tag, aperçu, RSS)
  - [ ] Page features
  - [ ] Footer complet avec liens

- [x] **Dashboard complet**
  - [x] Layout avec sidebar moderne (simplifiée)
  - [x] Page d'accueil dashboard
  - [x] SiteHeader avec lang/theme/logout
  - [x] nav-user dropdown complet
  - [x] Page settings (padding corrigé)
  - [x] Page account (padding corrigé)
  - [x] **Page médias** (upload MinIO, liste, édition, lightbox, recherche)
  - [x] **Dashboard blog** (gestion articles auteur)
  - [ ] Page analytics/stats
  - [ ] Page billing Stripe fonctionnelle
  - [ ] Page team/users
  - [ ] Page API keys

- [x] **Authentification complète**
  - [x] Login avec Better Auth
  - [x] Register
  - [x] OAuth GitHub
  - [x] OAuth Google
  - [x] Magic Link avec Resend
  - [x] OTP avec Resend (composant InputOTP shadcn/ui)
  - [x] Forgot password / Reset password
  - [x] Email verification (obligatoire à l'inscription)

- [x] **Super administration**
  - [x] `/admin` — stats & graphiques
  - [x] `/admin/users` — gestion utilisateurs + impersonation
  - [x] `/admin/blog` — gestion articles (si blog activé)
  - [x] `/admin/media` — gestion médias (si stockage activé)

### 🌍 Internationalisation
- [ ] Fichiers de traduction complets (fr, en, es, de)
- [ ] Configuration next-intl fonctionnelle
- [ ] Traduction de toutes les pages
- [ ] Sélecteur de langue dans l'interface

### 🗄️ Gestion des bases de données
- [ ] Templates Prisma pour PostgreSQL (existant)
- [ ] Templates Mongoose pour MongoDB
- [ ] Configuration SQLite complète
- [ ] Template sans base de données (authentification manuelle)

### 🎨 Composants réutilisables
- [ ] Bibliothèque de composants Shadcn UI étendue
- [ ] Composants métier (UserCard, PricingCard, etc.)
- [ ] Hooks personnalisés
- [ ] Utilitaires React

---

## 🚀 Phase 3 - Génération IA (À VENIR)

### 🤖 Commande /generate-features
- [x] Skill `generate-features.md` créé et copié dans chaque projet
- [ ] Implémentation complète de l'agent de génération
- [ ] Analyse intelligente du projet existant
- [ ] Templates de features prêts à l'emploi
  - [ ] Blog avec CMS
  - [ ] E-commerce basique
  - [ ] CRM simple
  - [ ] Système de tickets
  - [ ] Chat en temps réel
  - [ ] Notifications push

### 👥 Agents spécialisés
- [x] Agent développement (`full-stack-dev`)
- [x] Agent revue de code (`code-reviewer`)
- [ ] Agent sécurité
- [ ] Agent SEO
- [ ] Agent performance
- [ ] Agent tests

---

## 🔮 Phase 4 - Écosystème (FUTUR)

### 🌐 Interface Web
- [ ] Configurateur web pour le CLI
- [ ] Prévisualisation en temps réel
- [ ] Export de configuration

### 🛍️ Marketplace
- [ ] Marketplace de features
- [ ] Templates communautaires
- [ ] Plugins tiers

### 🔌 Intégrations
- [ ] Vercel/Netlify deployment automatique
- [ ] GitHub Actions pré-configurées
- [ ] Monitoring (Sentry, LogRocket)
- [ ] Analytics (Plausible, Fathom)

---

## 📊 Métriques de progression

**Phase 1 :** 100% ✅ (CLI fonctionnel + navigation retour)
**Phase 2 :** 95% 🚧 (Templates + RBAC blog + admin avancé + CLI amélioré)
**Phase 3 :** 20% 🚧 (Skills/agents déployés, /generate-features à implémenter)
**Phase 4 :** 0% 💭 (Vision)

---

## 🎯 Priorités immédiates

1. ✅ Migration Next.js 16 - **FAIT**
2. ✅ Migration vers @clack/prompts - **FAIT**
3. ✅ UX du CLI améliorée + navigation retour - **FAIT**
4. ✅ OAuth Google, Magic Link / OTP - **FAIT**
5. ✅ Architecture templates statique (shadcn-base) - **FAIT**
6. ✅ Navbar + Dashboard UX finalisés - **FAIT**
7. ✅ Page Médias MinIO complète - **FAIT**
8. ✅ Emails transactionnels complets - **FAIT**
9. ✅ Système super administrateur avec impersonation - **FAIT**
10. ✅ Système de blog complet (éditeur, admin, public, RSS) - **FAIT**
11. ✅ RBAC complet blog (5 rôles, API, UI) - **FAIT**
12. ✅ Skills et agents Claude Code copiés effectivement - **FAIT**
13. 🚧 Templates multilingues complets
14. 📅 Implémentation `/generate-features`
15. 📅 Configuration MongoDB/SQLite

---

Dernière mise à jour : 3 mars 2026
