# TODO - Migration Prisma 7

> Ce fichier documente tous les changements nécessaires pour migrer les projets générés de **Prisma 6.x** vers **Prisma 7** quand ce sera le bon moment.

**Version actuelle dans le générateur** : `^6.19.0`
**Cible** : `^7.x.x` (actuellement `7.4.1` sur npm)
**Bloquant** : Compatibilité Better Auth à confirmer + architecture templates à adapter

---

## ⚠️ Prérequis avant de migrer

- [ ] Confirmer que `better-auth` supporte officiellement Prisma 7 (leur peer dep autorise `^5||^6||^7` mais non testé en production avec les templates)
- [ ] Tester une génération complète avec Prisma 7 en local avant tout merge
- [ ] Vérifier que `npx @better-auth/cli generate` produit un schéma compatible

---

## 📋 Changements à effectuer

### 1. `src/generators/package-generator.js`

```diff
- '@prisma/client': '^6.19.0',
+ '@prisma/client': '^7.0.0',

- 'prisma': '^6.19.0',
+ 'prisma': '^7.0.0',
```

Prisma 7 requiert aussi l'installation d'un **driver de base de données natif** :

```diff
+ '@prisma/adapter-pg': '^7.0.0',  // pour PostgreSQL
+ 'pg': '^8.13.0',                  // driver natif PostgreSQL
```

---

### 2. `src/templates/nextjs-base/prisma/schema.prisma`

Le `datasource` block et l'URL sont **déplacés dans `prisma.config.ts`**. Le `schema.prisma` ne contient plus de connexion DB.

```diff
  generator client {
-   provider = "prisma-client-js"
+   provider   = "prisma-client"
+   output     = "../src/generated/prisma"
+   engineType = "client"
  }

- datasource db {
-   provider = "postgresql"
-   url      = env("DATABASE_URL")
- }
```

---

### 3. Nouveau fichier à créer : `src/templates/nextjs-base/prisma.config.ts`

Ce fichier **n'existe pas encore** — il faut le créer dans le template.

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
```

Ce fichier doit aussi être **référencé dans `nextjs-generator.js`** pour être copié lors de la génération.

---

### 4. `src/generators/nextjs-generator.js`

Ajouter `prisma.config.ts` dans la liste des fichiers copiés depuis le template :

```diff
  const filesToCopy = [
    'prisma/schema.prisma',
+   'prisma.config.ts',
    // ...
  ];
```

---

### 5. `src/templates/nextjs-base/lib/db/client.ts`

En Prisma 7, le `PrismaClient` est généré dans le dossier `output` défini dans `schema.prisma`.

```diff
- import { PrismaClient } from '@prisma/client'
+ import { PrismaClient } from '../generated/prisma'
```

Le reste du fichier (singleton global, logs, connexion) reste identique.

---

### 6. `src/generators/package-generator.js` — script `postinstall`

En Prisma 7, `prisma generate` pointe vers le nouveau provider. Pas de changement de commande, mais vérifier que ça fonctionne avec le nouveau `prisma.config.ts`.

```js
postinstall: 'prisma generate', // inchangé
```

---

### 7. Seed automatique supprimé en Prisma 7

En Prisma 6, `prisma migrate dev` lançait le seed automatiquement.
En Prisma 7, il faut lancer `prisma db seed` **explicitement**.

Si un script de seed est ajouté dans les templates à l'avenir, penser à documenter ce changement dans le README généré.

---

### 8. `migrate diff` — options CLI modifiées

Si des scripts utilisent `prisma migrate diff` :

```diff
# Avant (v6)
- prisma migrate diff --from-url "$DATABASE_URL" --to-schema schema.prisma --script

# Après (v7)
+ prisma migrate diff --from-config-datasource --to-schema schema.prisma --script
```

---

## 🧪 Checklist de test après migration

- [ ] `npm create saas-sbk@latest` génère un projet sans erreur
- [ ] `npm install` dans le projet généré installe Prisma 7 sans erreur
- [ ] `prisma generate` crée bien le client dans `src/generated/prisma/`
- [ ] `npm run db:push` synchronise le schéma avec PostgreSQL
- [ ] L'import `from '../generated/prisma'` fonctionne dans `lib/db/client.ts`
- [ ] La création de compte via Better Auth fonctionne (POST `/api/auth/sign-up`)
- [ ] La connexion fonctionne (POST `/api/auth/sign-in/email`)
- [ ] Le dashboard protégé redirige correctement
- [ ] La page Médias MinIO fonctionne (upload, liste, suppression)
- [ ] `npm run db:studio` ouvre Prisma Studio

---

## 📚 Ressources

- [Guide migration Prisma v7](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7)
- [prisma.config.ts reference](https://www.prisma.io/docs/orm/reference/prisma-config-reference)
- [Better Auth adapter Prisma](https://www.better-auth.com/docs/adapters/prisma)
- [Prisma 7 changelog](https://github.com/prisma/prisma/releases)

---

**Créé le** : 25 février 2026
**Dernière mise à jour** : 25 février 2026
