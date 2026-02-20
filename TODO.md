# TODO - create-saas-sbk
TEST
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
- [ ] **Forgot password** - À implémenter
- [ ] **Email verification** - À implémenter

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

- [ ] **Templates multilingues (i18n)**
  - Générer les fichiers de traduction pour toutes les langues choisies
  - Structure : `locales/fr.json`, `locales/en.json`, etc.
  - Configurer next-intl correctement
  - Traduire les pages principales :
    - Landing page
    - Dashboard
    - Pages d'auth
    - Pages de pricing
  - **Langues à supporter :**
    - 🇫🇷 Français
    - 🇺🇸 Anglais
    - 🇪🇸 Espagnol
    - 🇩🇪 Allemand

- [ ] Vérifier que tous les templates fonctionnent sans erreur
- [ ] Ajouter des tests automatisés

### Documentation
- [ ] Compléter le README principal
- [ ] Ajouter des exemples de projets générés
- [ ] Guide de migration des anciens projets
