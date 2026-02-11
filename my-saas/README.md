# my-saas

Projet SaaS généré avec `create-saas-sbk`.

## Démarrage rapide

1. Installer les dépendances :
```bash
npm install
```

2. Démarrer les services Docker :
```bash
npm run docker:up
```

3. Configurer la base de données :
```bash
npm run db:push
```

4. Démarrer le serveur :
```bash
npm run dev
```

5. Ouvrir [http://localhost:3000](http://localhost:3000)

## Documentation

Consultez `.claude/README.md` pour la documentation complète de la stack technique.

## Stack

- Next.js 16+ (App Router)
- React 19
- Better Auth
- Prisma + PostgreSQL
- Tailwind CSS + Shadcn UI
- undefined

## Commandes

```bash
npm run dev          # Développement
npm run build        # Build production
npm run start        # Démarrer en production
npm run lint         # Linter
npm run db:push      # Sync schéma Prisma
npm run db:studio    # Ouvrir Prisma Studio
npm run docker:up    # Démarrer Docker
npm run docker:down  # Arrêter Docker
```

## Support

Pour toute question, consultez la documentation ou ouvrez une issue.
