# Démarrage Rapide - create-saas-sbk

## Pour les utilisateurs

### Créer un nouveau projet SaaS

```bash
npm create saas-sbk@latest
```

ou avec npx :

```bash
npx create-saas-sbk@latest
```

### Répondre aux questions

Le CLI vous posera 10 catégories de questions :

1. **Nom du projet** - ex: `mon-saas`
2. **Thème** - dark ou light
3. **Base de données** - Docker local ou distant
4. **Authentification** - email, GitHub OAuth, Magic Link
5. **Stockage médias** - MinIO Docker ou AWS S3
6. **Emails** - Resend ou SMTP
7. **Paiements** - Stripe (optionnel)
8. **i18n** - Langues supportées
9. **IA** - Claude, ChatGPT, Gemini (optionnel)
10. **Claude Code** - CLI installé ?

### Démarrer le projet généré

```bash
# Aller dans le projet
cd mon-saas

# Démarrer Docker (si configuré)
npm run docker:up

# Configurer la base de données
npm run db:push

# Démarrer le serveur
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## Pour les développeurs du CLI

### Cloner et installer

```bash
git clone <repo-url>
cd saas-sbk
npm install
```

### Tester en local

```bash
npm run dev
```

### Vérifier l'intégrité

```bash
npm run verify
```

### Structure du code

```
src/
├── index.js              # Point d'entrée principal
├── core/                 # Questions, validation, config
├── generators/           # Génération de fichiers
├── installers/           # Installation dépendances et skills
├── utils/                # Utilitaires (logger, spinner, etc.)
└── templates/            # Templates Next.js
```

### Ajouter une fonctionnalité

1. **Nouvelle question** → `src/core/questions.js`
2. **Validation** → `src/core/validation.js`
3. **Génération** → Créer/modifier un générateur dans `src/generators/`
4. **Template** → Ajouter dans `src/templates/`
5. **Tester** → `npm run dev`

### Règles de sécurité

⚠️ **TOUJOURS** :
- Valider les entrées avec regex strictes
- Sanitizer avant écriture dans .env/YAML
- Utiliser spawn avec tableaux pour les commandes
- Masquer les secrets dans les logs

❌ **JAMAIS** :
- eval ou exec non sécurisé
- Concaténation shell dangereuse
- Stocker des secrets en clair

### Publier (maintainers uniquement)

```bash
# Vérifier
npm run verify

# Version
npm version patch|minor|major

# Publier
npm publish
```

---

## Commandes utiles

### Projet CLI
```bash
npm run dev        # Tester le CLI
npm run verify     # Vérifier intégrité
npm test           # Tests (à venir)
```

### Projet généré
```bash
npm run dev          # Développement
npm run build        # Build production
npm run docker:up    # Démarrer Docker
npm run db:push      # Sync schéma Prisma
npm run db:studio    # Prisma Studio
```

---

## Ressources

- **README.md** - Documentation complète
- **CLAUDE.md** - Guidelines pour Claude Code
- **CONTRIBUTING.md** - Guide de contribution
- **STATUS.md** - État d'avancement
- **CHANGELOG.md** - Historique des versions

---

## Support

- 🐛 **Bugs** - Ouvrir une issue GitHub
- 💡 **Features** - Proposer via issue
- 📖 **Documentation** - Consulter README.md
- 💬 **Questions** - Discord (à venir)

---

Créé avec ❤️ par Jerome
