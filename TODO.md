# TODO - create-saas-sbk

## ✅ UX - Migration vers @clack/prompts (TERMINÉ et FUSIONNÉ)

### Problème résolu
Inquirer affichait des messages d'aide en anglais qui ne pouvaient pas être supprimés sans casser le rendu du CLI.

### Solution implémentée ✅

**Migration complétée le 2026-02-11 et fusionnée dans `main`**
- ✅ Remplacement complet d'inquirer par @clack/prompts
- ✅ Interface visuelle moderne sans messages anglais
- ✅ Logo persistant avec version dynamique
- ✅ Liens cliquables vers services externes
- ✅ Récapitulatif en colonnes
- ✅ OAuth GitHub + Google
- ✅ Magic Link / OTP avec Resend
- ✅ Alignement automatique des commentaires explicatifs
- ✅ Gestion native des annulations (Ctrl+C)
- ✅ Tests fonctionnels réussis

**Améliorations supplémentaires :**
- ✅ 45 commits sur la branche `ux/migration-clack-prompts`
- ✅ Fusionné dans `main` le 11 février 2026
- ✅ Branche supprimée après fusion

---

## Autres TODOs

### Base de données MongoDB et SQLite
- [ ] **MongoDB local avec Docker**
  - Créer `docker-compose.yml` avec service MongoDB
  - Configurer Mongoose ou Prisma pour MongoDB
  - Générer les credentials (user/password/database)
  - Adapter les templates pour utiliser MongoDB

- [ ] **MongoDB distant (Atlas, etc.)**
  - Demander l'URL de connexion
  - Configurer Mongoose ou Prisma avec l'URL

- [ ] **SQLite (fichier local)**
  - Configurer Prisma pour SQLite
  - Générer le schema.prisma adapté
  - Pas besoin de Docker ni credentials

### Authentification

- [x] **OAuth GitHub** - Implémenté
- [x] **OAuth Google** - Implémenté
- [x] **Magic Link / OTP** - Implémenté avec Resend
- [x] **Forgot password** - Implémenté (`/forgot-password` + `/reset-password`)
- [x] **Email verification** - Implémenté (`/verify-email` + `emailVerification` Better Auth)

### Architecture Templates

- [x] **shadcn-base/** - Template statique versionné (copié depuis shadcn CLI une seule fois)
- [x] **nextjs-base/** overlay - Better Auth, Prisma, pages, composants custom
- [x] **`fs.cpSync()` au lieu de `npx shadcn@latest`** - Fiable, rapide, offline
- [x] **package-generator.js** - Fusionne avec package.json existant (Tailwind v4 préservé)

### Dashboard UX

- [x] **Navbar landing** - Logo | liens centrés | actions droite + user icon
- [x] **Toggle langue conditionnel** - `{{AVAILABLE_LANGUAGES}}` variable template
- [x] **SiteHeader dashboard** - Lang + Theme + Logout
- [x] **Sidebar simplifiée** - Seulement Dashboard, {{PROJECT_NAME}}
- [x] **nav-user dropdown** - Compte + Paramètres + Facturation + Notifications
- [x] **Padding unifié** - Settings et Account pages corrigées
- [x] **cursor-pointer global** - globals.css

### Page Médias (MinIO)

- [x] **Page `/dashboard/media`** - Grille médias avec preview images/icônes
- [x] **Upload drag-and-drop** - Dialog multi-fichiers avec zone de dépôt
- [x] **Modèle Prisma Media** - `key`, `name`, `size`, `mimeType`, `description?`, `tags String[]`
- [x] **Clé MinIO en DB** - URLs presignées 24h générées depuis la clé (jamais expirées)
- [x] **Renommage** - Base seul + badge extension non-éditable
- [x] **Description + Tags** - Textarea + chips (Entrée/virgule), affichés sur la carte
- [x] **Recherche temps réel** - Filtre nom + description + tags, visible ≥ 2 fichiers
- [x] **Lightbox** - Plein écran, navigation prev/next, clavier `←` `→`, compteur
- [x] **Responsive mobile** - Recherche sous titre, bouton upload fixe en bas
- [x] **Fix reset dialog** - useEffect reset on open
- [x] **Fix tags null** - Fallback `?? []` pour anciens enregistrements

### Templates Next.js

- [ ] **Template sans système de connexion** (pour futurs cas sans DB)
  - Dashboard simple sans Better Auth
  - Pas de pages login/register
  - Pas de gestion de session
  - Documentation dans README : comment ajouter l'auth plus tard
  - Guide `.claude/AUTH_SETUP.md`

- [x] **Templates multilingues (i18n) — FRONT TERMINÉ (v0.13.0)**
  - ✅ next-intl, routing `app/[locale]/`, proxy.ts, messages FR/EN/ES/DE
  - ✅ Pages publiques : home, about, pricing, contact, [slug]
  - ✅ Pages auth : login, register, verify-email, forgot-password, reset-password
  - ✅ 3 méthodes de connexion traduites : email/password, magic link, OTP
  - ✅ Boutons OAuth (GitHub/Google) avec useTranslations
  - ✅ CopyCommand traduit (copy_copied, copy_in_app)
  - ✅ Navbar + Footer i18n avec sélecteur de langue

- [ ] **Traduction zone `/admin` (branche `trad-admin`)**

  ### Contexte et approche
  Même principe que la traduction du front : créer un variant i18n pour les pages
  admin et leurs **composants**. La difficulté principale est que les strings hardcodées
  sont majoritairement dans les **composants** (dialogs, tables, cards) et non dans
  les pages elles-mêmes.

  ### Pages admin à traduire (dans `app/admin/`)
  Toutes ces pages sont des Server Components minimalistes — les strings sont surtout
  dans leurs titres/descriptions h1/p qui peuvent utiliser `getTranslations("admin")`.
  - `page.tsx` — "Administration", "Vue d'ensemble..."
  - `layout.tsx` — pas de strings visibles
  - `users/page.tsx` — "Utilisateurs", compteur "N compte(s) enregistré(s)"
  - `pages/page.tsx` — "Pages", description
  - `faq/page.tsx` — "FAQ", "lecture seule"
  - `features/page.tsx` — "Features", "lecture seule"
  - `pricing/page.tsx` — "Tarifs", description
  - `settings/page.tsx` — "Paramètres", formulaire complet (client component)
  - `account/page.tsx` — "Compte", formulaire mdp (client component)
  - `media/page.tsx` — page client lourde (624 lignes), dialogs suppression/édition
  - `blog/page.tsx` — stats cards "Publiés/En attente/Brouillons"
  - `blog/new/page.tsx` — "Nouvel article"
  - `blog/categories/page.tsx` — "Catégories"

  ### Composants à traduire (les plus critiques — dialogs/tables)
  Ces composants sont dans `components/admin/` et `components/blog/` :
  - `features-manager.tsx` — dialogs "Nouvelle feature" / "Modifier la feature" (cf. screenshots)
  - `faq-manager.tsx` — idem pour la FAQ
  - `pages-manager.tsx` — idem pour les pages dynamiques
  - `pricing-manager.tsx` — plans et packs de crédits
  - `users-table.tsx` — tableau utilisateurs, actions, badges rôles/plans
  - `roles-permissions-card.tsx` — tableau des droits par rôle
  - `invite-user-button.tsx` — dialog d'invitation
  - `section-cards-admin.tsx` — cards de stats (labels)
  - `admin-chart-signups.tsx` — label axe graphique
  - `articles-table.tsx` — statuts, actions, filtres
  - `categories-card.tsx` — gestion catégories
  - `category-manager.tsx` — dialogs création/édition catégorie
  - `upload-dialog.tsx` — dialog upload médias
  - `article-editor.tsx` — éditeur Markdown (très long)

  ### Stratégie recommandée

  **1. Clés de messages** — Ajouter une section `"admin"` dans chaque `messages/*.json` :
  ```json
  "admin": {
    "title": "Administration",
    "overview": "Vue d'ensemble des utilisateurs et de l'activité",
    "users": "Utilisateurs",
    "features": "Features",
    "faq": "FAQ",
    "pricing": "Tarifs",
    "pages": "Pages",
    "settings": "Paramètres",
    "account": "Compte",
    "media": "Médias",
    "blog": "Articles",
    "read_only": "lecture seule",
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "edit": "Modifier",
    "new": "Nouveau",
    "confirm_delete": "Supprimer ce fichier ?",
    ...
  }
  ```

  **2. Pages Server Components** — Utiliser `getTranslations("admin")` (async) :
  ```tsx
  import { getTranslations } from "next-intl/server"
  export default async function AdminFaqPage() {
    const t = await getTranslations("admin")
    // ...
    return <h1>{t("faq")}</h1>
  }
  ```

  **3. Pages/Composants Client Components** — Utiliser `useTranslations("admin")` :
  ```tsx
  "use client"
  import { useTranslations } from "next-intl"
  export function FeaturesManager(...) {
    const t = useTranslations("admin")
    // ...
    <DialogTitle>{t("new_feature")}</DialogTitle>
  }
  ```

  **4. Variant i18n** — Créer les versions traduites dans :
  `src/templates/variants/i18n/app/admin/` et `src/templates/variants/i18n/components/admin/`

  **5. Générateur** — Dans `copyConditionalVariants()`, bloc i18n :
  ```js
  // Copier les pages et composants admin traduits
  if (config.admin?.enabled) {
    copyDirWithReplacements(
      path.join(i18nDir, 'app/admin'),
      path.join(projectPath, 'app/admin'),
      i18nReplacements
    )
    copyDirWithReplacements(
      path.join(i18nDir, 'components/admin'),
      path.join(projectPath, 'components/admin'),
      i18nReplacements
    )
  }
  ```

  **6. Note sur les composants blog** — `articles-table`, `category-manager`,
  `article-editor` sont partagés entre `/admin/blog` et `/dashboard/blog`.
  Les copies doivent aller dans `components/blog/` i18n.

  ### Fichiers à créer dans le variant i18n
  ```
  src/templates/variants/i18n/
  ├── app/admin/
  │   ├── page.tsx
  │   ├── users/page.tsx
  │   ├── pages/page.tsx
  │   ├── faq/page.tsx
  │   ├── features/page.tsx
  │   ├── pricing/page.tsx
  │   ├── settings/page.tsx
  │   ├── account/page.tsx
  │   ├── media/page.tsx
  │   ├── blog/page.tsx
  │   ├── blog/new/page.tsx
  │   └── blog/categories/page.tsx
  ├── components/admin/
  │   ├── features-manager.tsx
  │   ├── faq-manager.tsx
  │   ├── pages-manager.tsx
  │   ├── pricing-manager.tsx
  │   ├── users-table.tsx
  │   ├── roles-permissions-card.tsx
  │   ├── invite-user-button.tsx
  │   ├── section-cards-admin.tsx
  │   └── admin-chart-signups.tsx
  └── components/blog/
      ├── articles-table.tsx
      ├── categories-card.tsx
      ├── category-manager.tsx
      └── article-editor.tsx (très long — prioriser)
  ```

  ### Ordre de travail recommandé
  1. Définir toutes les clés `"admin"` dans les 4 fichiers messages (fr/en/es/de)
  2. Travailler d'abord dans `test-trad-3` pour valider visuellement
  3. Commencer par les composants les plus visibles : `features-manager`, `faq-manager`, `users-table`
  4. Puis les pages (simple avec `getTranslations`)
  5. Finir par `media/page.tsx` et `article-editor.tsx` (les plus longs)
  6. Une fois validé dans test-trad-3, créer les variants i18n et brancher le générateur
  7. Merger `trad-admin` → `main` après feu vert

- [ ] Vérifier que tous les templates fonctionnent sans erreur
- [ ] Ajouter des tests automatisés

### Documentation
- [ ] Compléter le README principal
- [ ] Ajouter des exemples de projets générés
- [ ] Guide de migration des anciens projets
