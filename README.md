# create-saas-sbk

CLI npm pour générer des projets SaaS Next.js 15+ complets et clés en main.

## Installation et utilisation

```bash
npm create saas-sbk@latest
```

Ou avec npx :

```bash
npx create-saas-sbk@latest
```

## Fonctionnalités

✅ **Installation interactive** - Questions guidées pour configurer votre projet
✅ **Next.js 15+** - App Router, React 19, TypeScript
✅ **Better Auth** - Email/password, OAuth GitHub, Magic Link
✅ **Prisma + PostgreSQL** - ORM moderne avec migrations
✅ **Stripe** - Paiements et abonnements
✅ **Resend/SMTP** - Envoi d'emails transactionnels
✅ **AWS S3 / MinIO** - Stockage de fichiers médias
✅ **Shadcn UI + Tailwind** - Interface moderne et responsive
✅ **i18n** - Support multilingue
✅ **Intégration IA** - Claude, ChatGPT, Gemini
✅ **Docker ready** - PostgreSQL et MinIO en local
✅ **Claude Code** - Skills et agents pré-installés

## Stack technique

### Frontend & Backend
- **Next.js 15+** avec App Router
- **React 19** avec Server Components
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** + **Shadcn UI**

### Authentification
- **Better Auth** - Authentification moderne et flexible
- Email/Mot de passe
- OAuth (GitHub)
- Magic Link (lien par email)

### Base de données
- **PostgreSQL** - Base de données relationnelle
- **Prisma** - ORM TypeScript avec migrations
- Support Docker local ou base distante (Neon, Supabase)

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

### Internationalisation
- Support multilingue
- Français, Anglais, Espagnol, Allemand

## Structure du projet généré

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

## Commandes du projet généré

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

## Développement du CLI

### Cloner le repo
```bash
git clone <repo-url>
cd saas-sbk
npm install
```

### Tester en local
```bash
npm run dev
```

### Structure du CLI
```
src/
├── index.js                    # Orchestrateur principal
├── core/
│   ├── questions.js            # Questions interactives
│   ├── validation.js           # Validations sécurisées
│   ├── config-builder.js       # Construction config
│   └── summary.js              # Récapitulatif
├── generators/
│   ├── env-generator.js        # Génère .env
│   ├── docker-generator.js     # Génère docker-compose.yml
│   ├── claude-generator.js     # Génère .claude/README.md
│   ├── package-generator.js    # Génère package.json
│   └── nextjs-generator.js     # Génère projet Next.js
├── installers/
│   ├── dependencies.js         # npm install
│   ├── skills.js               # Installation skills
│   └── claude-init.js          # Lance /init
└── utils/
    ├── logger.js               # Messages colorés
    ├── spinner.js              # Spinners
    ├── command-runner.js       # Exécution commandes
    └── file-utils.js           # Manipulation fichiers
```

## Roadmap

### Phase 1 (actuelle) ✅
- CLI interactif complet
- Génération de projet fonctionnel
- Installation automatique des skills
- Support Docker

### Phase 2 (à venir)
- Templates Next.js complets (pages, composants)
- Commande `/generate-features` pour génération IA
- Agents spécialisés (dev, sécurité, SEO, perf)
- Templates de features (blog, e-commerce, CRM)

### Phase 3 (future)
- Interface web pour la configuration
- Marketplace de features
- Templates personnalisables
- Intégrations tierces

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une PR.

## Support

- Documentation : Consultez `.claude/README.md` dans votre projet généré
- Issues : Ouvrez une issue sur GitHub
- Discord : [Lien à venir]

## Licence

MIT

---

Créé avec ❤️ par Jerome
