# create-saas-sbk

<div align="center">

![Version](https://img.shields.io/badge/version-0.6.0-blue.svg)
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
- _MongoDB et SQLite à venir dans une prochaine version_

### Paiements
- **Stripe** en mode test
- Abonnements et paiements uniques
- Webhooks configurés

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
- Skills adaptés à votre stack (nextjs, better-auth, prisma, stripe, etc.)
- Agents spécialisés pour le développement
- Commande `/generate-features` pour générer des fonctionnalités

Pour installer Claude Code : https://claude.ai/docs/cli

---

<details>
<summary><strong>🗺️ Roadmap</strong></summary>

📍 **Version actuelle : v0.6.0** (20 février 2026)

### ✅ Phase 1 - CLI Interactif (TERMINÉE)
- ✅ CLI interactif avec @clack/prompts en français
- ✅ Logo persistant et liens cliquables vers services externes
- ✅ Génération de projet Next.js 16+ fonctionnel
- ✅ Installation automatique des skills Claude Code
- ✅ PostgreSQL (Docker ou distant)
- ✅ OAuth GitHub + Google
- ✅ Magic Link / OTP avec Resend
- ✅ Docker Compose pour services locaux
- ✅ Interface UX optimisée avec récapitulatif en colonnes

### 🚧 Phase 2 - Templates Complets (EN COURS - 70%)
- ✅ Architecture templates statique (`shadcn-base` + overlay `nextjs-base`)
- ✅ Dashboard UX finalisé (Navbar, SiteHeader, Sidebar, padding)
- ✅ Templates Next.js complets (landing, dashboard, auth)
- ✅ Page Médias MinIO (upload, liste, édition, lightbox, recherche)
- 🚧 Templates multilingues (FR, EN, ES, DE)
- 📅 Configuration MongoDB et SQLite
- 📅 Template sans système de connexion
- 📅 Plus de variantes de templates (blog, e-commerce)

### 📅 Phase 3 - Génération IA (PLANIFIÉE)
- Commande `/generate-features` pour génération IA
- Agents spécialisés (dev, sécurité, SEO, perf)
- Templates de features (blog, e-commerce, CRM, chat)

### 💭 Phase 4 - Écosystème (VISION)
- Interface web pour la configuration
- Marketplace de features communautaires
- Templates personnalisables
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
