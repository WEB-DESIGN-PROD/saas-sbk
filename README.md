# create-saas-sbk

<div align="center">

![Version](https://img.shields.io/badge/version-0.12.0--dev-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Next.js](https://img.shields.io/badge/Next.js-16+-black.svg)

**CLI npm pour générer des projets SAAS Next.js 16+ complets et clés en main**

</div>

## Installation et utilisation

```bash
npm create saas-sbk@latest
```

Ou avec npx :

```bash
npx create-saas-sbk@latest
```

---

<details>
<summary><strong>🛠️ Stack technique</strong></summary>

### Frontend & Backend
- **Next.js 16.1.6+** avec App Router et Turbopack
- **React 19** avec Server Components
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** + **Shadcn UI** - Nouveau template dashboard moderne

### Authentification
- **Better Auth** - Authentification moderne et flexible
- Email/Mot de passe
- OAuth (GitHub + Google)
- Magic Link / OTP (avec Resend)

### Base de données
- **PostgreSQL** - Local Docker ou distant (Neon, Supabase)
- **Prisma** - ORM TypeScript avec migrations
- _MongoDB et SQLite — Coming Soon (désactivés dans le CLI)_

### Abonnements & Facturation
- **Types d'utilisateurs** — `Free` / `Freemium` (crédits) / `Paid` (abonnement actif)
- **Plans** — `Pro` (29€/mois), `Team` (79€/mois), `Enterprise` (sur devis)
- **Crédits supplémentaires** — Packs dégressifs achetables (100/500/1000/2000)
- **Page `/dashboard/billing`** — Plan actuel, crédits, upgrade
- **Carte upgrade sidebar** — Invitation à upgrader pour les utilisateurs Free/Freemium
- **Stripe** en mode test — Prêt pour intégration paiements

### Super Administration
- **Rôle admin** — assigné automatiquement si l'email correspond à `ADMIN_EMAIL`
- **`/admin`** — espace protégé avec stats (total membres, inscriptions, sessions, vérification)
- **`/admin/users`** — tableau de gestion : plan, crédits, suppression, impersonation, recherche
- **Changement de rôle inline** — sélecteur direct dans la table (admin uniquement)
- **Section rôles & permissions** — récapitulatif des droits par rôle en accordéon
- **`/admin/pages`** — pages dynamiques (Mentions légales, CGU…) avec éditeur Markdown, header/footer
- **`/admin/features`** — features affichées sur la landing page, réordonnables par drag-and-drop
- **`/admin/faq`** — FAQ affichée sur la landing page, réordonnables par drag-and-drop
- **`/admin/pricing`** — plans d'abonnement et packs de crédits gérés en base de données
- **`/admin/blog`** — gestion complète des articles (si blog activé)
- **`/admin/media`** — gestion des médias avec lien vers l'article associé (si stockage activé)
- **Impersonation** — l'admin peut se connecter en tant qu'utilisateur avec bannière de retour
- **Plugin Better Auth `admin`** — ban, impersonation, gestion des rôles
- **Auto-refresh 30s** — les compteurs se mettent à jour automatiquement
- **Sidebar organisée** — séparateurs "Gestion du SAAS" et "Gestion du blog"

### Blog (optionnel)
- **Type de SaaS** — choix entre SaaS classique et Blog SaaS à la génération
- **Pages publiques** — liste articles, article complet, filtre catégorie/tag, aperçu, flux RSS
- **Éditeur markdown** — image de couverture drag-and-drop, jauges de caractères, categories, tags, SEO
- **Interface admin** — gestion complète des articles, catégories, tags
- **`@tailwindcss/typography`** — rendu Markdown avec classes `prose`
- **SEO intégré** — meta title/description pré-remplis, keywords auto depuis les tags
- **RBAC complet** — 5 rôles (`admin`, `co-admin`, `editor`, `contributor`, `member`) avec permissions granulaires
  - Éditeur : modifier tous les articles, supprimer uniquement les siens
  - Contributeur : créer/modifier uniquement ses propres articles (Draft/PendingReview), pas de suppression
  - Bouton "Modifier l'article" sur le blog public : masqué aux contributeurs et visiteurs

### Emails
- **Resend** - Service moderne (recommandé)
- **SMTP personnalisé** - Pour vos propres serveurs

### Stockage médias
- **MinIO** - Compatible S3 en local via Docker
- **AWS S3** - Pour la production

### IA (optionnel)
- **Claude** (Anthropic)
- **ChatGPT** (OpenAI)
- **Gemini** (Google)
- Choix multiples possibles

### Internationalisation
- Support multilingue avec next-intl
- Français, Anglais (US), Espagnol, Allemand

</details>

---

<details>
<summary><strong>📁 Structure du projet généré</strong></summary>

```
mon-saas/
├── app/
│   ├── page.tsx                    # Landing page publique
│   ├── pricing/                    # Page tarifs
│   ├── about/                      # Page à propos
│   ├── login/                      # Connexion
│   ├── register/                   # Inscription
│   └── dashboard/                  # Zone protégée
│       ├── layout.tsx              # Layout avec auth
│       ├── page.tsx                # Dashboard home
│       ├── settings/               # Paramètres
│       ├── account/                # Gestion compte
│       └── billing/                # Facturation
├── admin/                          # Zone super admin (si activé)
│   ├── layout.tsx              # Layout admin protégé
│   ├── page.tsx                # Stats & graphiques
│   └── users/page.tsx          # Gestion utilisateurs
├── components/                     # Composants réutilisables
│   └── ui/                         # Composants Shadcn UI
├── lib/                            # Configurations et utils
│   ├── auth/                       # Config Better Auth
│   ├── db/                         # Client Prisma
│   └── email/                      # Service email
├── prisma/
│   └── schema.prisma               # Schéma de base de données
├── .claude/
│   ├── README.md                   # Documentation stack
│   ├── agents/                     # Agents spécialisés
│   └── skills/                     # Skills installés
├── docker-compose.yml              # Services Docker
├── .env                            # Variables d'environnement
├── package.json
└── README.md
```

</details>

---

<details>
<summary><strong>⌨️ Commandes du projet généré</strong></summary>

```bash
# Développement
npm run dev          # Démarrer le serveur
npm run build        # Build de production
npm run start        # Démarrer en production
npm run lint         # Linter le code

# Base de données
npm run db:push      # Synchroniser le schéma
npm run db:migrate   # Créer une migration
npm run db:studio    # Ouvrir Prisma Studio
npm run db:seed      # Seeder la base

# Docker (si configuré)
npm run docker:up    # Démarrer les services
npm run docker:down  # Arrêter les services
npm run docker:logs  # Voir les logs
```

</details>

---

## Démarrage rapide après génération

1. **Entrer dans le projet**
   ```bash
   cd mon-saas
   ```

2. **Démarrer Docker** (si configuré)
   ```bash
   npm run docker:up
   ```

3. **Configurer la base de données**
   ```bash
   npm run db:push
   ```

4. **Démarrer le serveur**
   ```bash
   npm run dev
   ```

5. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## Sécurité

Le CLI applique des validations strictes sur toutes les entrées :
- Validation par regex pour noms de projets, URLs, emails
- Masquage des mots de passe et clés API dans le terminal
- Sanitization des valeurs avant écriture dans .env et YAML
- Pas d'exécution de code non sécurisé
- Aucune donnée n'est envoyée à des serveurs externes

## Claude Code

Si vous avez Claude Code CLI installé, le projet sera automatiquement initialisé avec :

- **Skills copiés** dans `.claude/skills/` selon votre stack :
  - `next-best-practices`, `prisma-expert`, `better-auth-best-practices`, `shadcn-ui`
  - `generate-features` (toujours présent)
  - `stripe-best-practices`, `email-best-practices`, `react-email`, `minio` (selon configuration)
- **Agents copiés** dans `.claude/agents/` :
  - `full-stack-dev` — patterns, DAL, API routes, composants
  - `code-reviewer` — revue sécurité, architecture, TypeScript
- **`CLAUDE.md`** généré à la racine avec la stack, les rôles, les commandes et la doc du projet
- **`.claude/README.md`** avec la documentation technique complète
- **Commande `/generate-features`** pour étendre le projet après génération

> Tous les fichiers `.claude/` sont créés quel que soit le type de SaaS choisi (default ou blog).

Pour installer Claude Code : https://claude.ai/docs/cli

---

<details>
<summary><strong>🗺️ Roadmap</strong></summary>

📍 **Version en cours : v0.12.0-dev** (mars 2026)

### ✅ Phase 1 - CLI Interactif (TERMINÉE)
- ✅ CLI interactif avec @clack/prompts en français
- ✅ Logo persistant et liens cliquables vers services externes
- ✅ Génération de projet Next.js 16+ fonctionnel
- ✅ PostgreSQL (Docker ou distant), OAuth GitHub/Google, Magic Link/OTP
- ✅ Docker Compose pour services locaux
- ✅ Interface UX avec récapitulatif en colonnes
- ✅ **Navigation retour** — option "◀ Étape précédente" dans chaque menu à choix

### 🚧 Phase 2 - Templates Complets (EN COURS - 98%)
- ✅ Architecture templates statique (`shadcn-base` + overlay `nextjs-base`)
- ✅ Dashboard UX finalisé, auth emails complets, facturation Stripe (v0.8.0)
- ✅ Système super administrateur avec impersonation et changement de rôle inline (v0.9.0)
- ✅ Blog complet avec RBAC 5 rôles (éditeur, admin, public, RSS) (v0.10.0)
- ✅ Contrôle d'accès granulaire par rôle sur articles, catégories, bouton public (v0.11.0)
- ✅ **Gestion du contenu admin** — Pages, Features, FAQ, Tarifs/Crédits depuis la DB (v0.12.0-dev)
- ✅ **Drag-and-drop** — réordonnement des Features, FAQ et Pages dans l'admin
- ✅ **Pages dynamiques** — Navbar et Footer injectent les pages DB (inHeader / inFooter)
- ✅ **Page `/contact`** — formulaire envoyant un email au super admin via Resend
- ✅ Sidebar admin organisée avec séparateurs "Gestion du SAAS" et "Gestion du blog"
- ✅ **Templates multilingues** — Front traduit (FR, EN, ES, DE) : landing, auth, pages publiques, boutons OAuth, composants (v0.13.0)
- 📅 Traduction de la zone `/admin`
- 📅 Configuration MongoDB et SQLite
- 📅 Template sans système de connexion

### 🚧 Phase 3 - Génération IA (EN DÉMARRAGE - 20%)
- ✅ Skill `/generate-features` inclus dans chaque projet généré
- ✅ Agents `full-stack-dev` et `code-reviewer` inclus dans chaque projet
- ✅ Skills et agents réellement copiés dans `.claude/` (fix v0.11.0)
- 📅 Implémentation complète de la commande `/generate-features`
- 📅 Agents sécurité, SEO, performance
- 📅 Templates de features (e-commerce, CRM, chat)

### 💭 Phase 4 - Écosystème (VISION)
- Interface web pour la configuration
- Marketplace de features communautaires
- Intégrations tierces (Vercel, GitHub Actions, monitoring)

📄 **Voir [ROADMAP.md](./ROADMAP.md) pour les détails complets**

</details>

---

<details>
<summary><strong>🤝 Contribution</strong></summary>

Les contributions sont les bienvenues !

> ⚠️ **La branche `main` est protégée. Une Pull Request est obligatoire — aucun push direct autorisé.**

Consultez [CONTRIBUTING.md](./CONTRIBUTING.md) pour :

- Structure du projet et architecture
- Guide de développement local
- Conventions de code et commits (Conventional Commits)
- Types de contributions acceptées
- Workflow complet de Pull Request
- Checklist avant soumission

Pour contribuer rapidement : fork le repo, créez une branche (`feature/ma-feature`), développez, testez et ouvrez une PR vers `main`. Elle sera automatiquement assignée à [@WEB-DESIGN-PROD](https://github.com/WEB-DESIGN-PROD) pour review.

</details>

---

<details>
<summary><strong>🆘 Support</strong></summary>

- **Documentation** : Consultez `.claude/README.md` dans votre projet généré
- **Issues** : [Ouvrir une issue sur GitHub](https://github.com/WEB-DESIGN-PROD/saas-sbk/issues) — plusieurs templates disponibles (bug, feature, docker, sécurité…)
- **Discord** : Lien à venir

</details>

---

## Disclaimer

> **`create-saas-sbk` est un outil de génération de code fourni "tel quel" ("AS IS"), sans garantie d'aucune sorte.**

L'auteur de ce CLI décline toute responsabilité concernant :

- **Le code généré** — Les projets SaaS produits par ce CLI sont fournis à titre de point de départ. Il appartient à l'utilisateur de les auditer, sécuriser et adapter avant toute mise en production.
- **La sécurité en production** — L'utilisateur est seul responsable de la sécurité de son application, de ses données, et des données de ses propres utilisateurs finaux.
- **La conformité légale et réglementaire** — L'utilisateur est responsable de la conformité de son SaaS aux lois applicables (RGPD, PCI-DSS, HIPAA, etc.) dans sa juridiction.
- **Les clés API et credentials** — Toutes les clés API, mots de passe et secrets configurés appartiennent à l'utilisateur. Leur gestion et leur sécurité sont entièrement sous sa responsabilité.
- **Les dommages directs ou indirects** — L'auteur ne saurait être tenu responsable de toute perte de données, perte financière, interruption de service ou préjudice subi par l'utilisateur ou ses clients, quelle qu'en soit la cause.
- **Les dépendances tierces** — Ce CLI s'appuie sur des outils tiers (Next.js, Better Auth, Prisma, Stripe, MinIO, etc.) dont les conditions d'utilisation, la sécurité et la disponibilité sont hors du contrôle de l'auteur.

**En utilisant `create-saas-sbk`, l'utilisateur reconnaît et accepte ces conditions.**

Consultez le fichier [LICENSE](./LICENSE) pour les termes complets de la licence MIT.

## Licence

MIT — Voir [LICENSE](./LICENSE)

---

Créé avec ❤️ par Jerome
