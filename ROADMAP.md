# 🗺️ Roadmap - create-saas-sbk

## ✅ v0.8.0 - 2 mars 2026 (ACTUELLE)

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
  - [ ] Page analytics/stats
  - [ ] Page billing Stripe fonctionnelle
  - [ ] Page team/users
  - [ ] Page API keys

- [ ] **Authentification complète**
  - [x] Login avec Better Auth
  - [x] Register
  - [x] OAuth GitHub
  - [x] OAuth Google
  - [x] Magic Link avec Resend
  - [x] OTP avec Resend (composant InputOTP shadcn/ui)
  - [x] Forgot password / Reset password
  - [x] Email verification (obligatoire à l'inscription)

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
- [ ] Analyse du projet existant
- [ ] Génération de features par IA
- [ ] Templates de features prêts à l'emploi
  - [ ] Blog avec CMS
  - [ ] E-commerce basique
  - [ ] CRM simple
  - [ ] Système de tickets
  - [ ] Chat en temps réel
  - [ ] Notifications push

### 👥 Agents spécialisés
- [ ] Agent développement
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

**Phase 1 :** 100% ✅ (CLI fonctionnel avec @clack/prompts)
**Phase 2 :** 80% 🚧 (Templates complets + dashboard UX + architecture statique + page Médias + auth emails complets)
**Phase 3 :** 0% 📅 (Planifié)
**Phase 4 :** 0% 💭 (Vision)

---

## 🎯 Priorités immédiates

1. ✅ Migration Next.js 16 - **FAIT**
2. ✅ Migration vers @clack/prompts - **FAIT**
3. ✅ UX du CLI améliorée - **FAIT**
4. ✅ OAuth Google - **FAIT**
5. ✅ Magic Link / OTP - **FAIT**
6. ✅ Architecture templates statique (shadcn-base) - **FAIT**
7. ✅ Navbar + Dashboard UX finalisés - **FAIT**
8. ✅ Page Médias MinIO complète - **FAIT**
9. ✅ Emails transactionnels complets (vérification, reset, magic link, OTP) - **FAIT**
10. 🚧 Templates multilingues complets
11. 📅 Configuration MongoDB/SQLite
12. 📅 Dashboard analytics

---

Dernière mise à jour : 2 mars 2026
