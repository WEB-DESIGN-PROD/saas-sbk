# {{PROJECT_NAME}}

Projet SAAS généré avec [create-saas-sbk](https://github.com/jerome/create-saas-sbk)

## 🚀 Démarrage rapide

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration de la base de données

#### Option A: PostgreSQL avec Docker (recommandé)

```bash
# Démarrer PostgreSQL et MinIO (si configuré)
npm run docker:up

# Créer les tables dans la base de données
npm run db:push
```

#### Option B: PostgreSQL distant

Si vous utilisez une base de données distante, vérifiez que la variable `DATABASE_URL` dans `.env` est correcte.

```bash
# Créer les tables dans la base de données
npm run db:push
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📋 Scripts disponibles

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Créer une version de production
- `npm run start` - Démarrer le serveur de production
- `npm run lint` - Vérifier le code avec ESLint

### Scripts Base de données

- `npm run docker:up` - Démarrer PostgreSQL avec Docker
- `npm run docker:down` - Arrêter PostgreSQL
- `npm run db:push` - Synchroniser le schéma Prisma avec la base de données
- `npm run db:migrate` - Créer et appliquer une migration
- `npm run db:studio` - Ouvrir Prisma Studio (interface graphique)
- `npm run db:generate` - Générer le client Prisma

### Scripts Better Auth (optionnel)

Si tu modifies la configuration d'authentification (plugins, nouveaux providers), utilise :
- `npx @better-auth/cli generate` - Régénérer le schéma Prisma
- `npx @better-auth/cli migrate` - Appliquer les migrations (si non-Prisma)

## 🔧 Dépannage

### "La création de compte ne fonctionne pas"

1. **Vérifiez que PostgreSQL est démarré**
   ```bash
   npm run docker:up
   ```

2. **Vérifiez que les tables sont créées**
   ```bash
   npm run db:push
   ```

3. **Consultez les logs dans la console du navigateur et du terminal**
   - Les logs commençant par 🔵, ✅, ❌ vous aideront à identifier le problème

4. **Vérifiez votre fichier `.env`**
   - `DATABASE_URL` doit pointer vers votre base PostgreSQL
   - Si vous utilisez Docker : `postgresql://user:password@localhost:5432/dbname`

### "Erreur de connexion à la base de données"

```bash
# Vérifier que PostgreSQL est accessible
docker ps

# Si PostgreSQL n'apparaît pas, redémarrez-le
npm run docker:down
npm run docker:up
```

### "Port 5432 already allocated"

PostgreSQL est déjà en cours d'exécution sur votre machine. Vous pouvez :
- Arrêter l'instance existante
- Modifier le port dans `docker-compose.yml` et `.env`

## 🗄️ Schéma de base de données

Le projet utilise Prisma avec PostgreSQL. Le schéma se trouve dans `prisma/schema.prisma`.

Tables Better Auth :
- `user` - Utilisateurs
- `session` - Sessions actives
- `account` - Comptes liés (email/password, OAuth)
- `verification` - Tokens de vérification

## 🔐 Authentification

Le projet utilise [Better Auth](https://www.better-auth.com/) avec :

- ✅ Email & mot de passe
- ✅ GitHub OAuth (si configuré)
- ✅ Liaison automatique des comptes par email
- ✅ Sessions sécurisées

### Tester l'authentification

1. Accédez à [http://localhost:3000/register](http://localhost:3000/register)
2. Créez un compte avec email/mot de passe
3. Vous serez redirigé vers le dashboard

## 📚 Documentation

- [Next.js](https://nextjs.org/docs)
- [Better Auth](https://www.better-auth.com/)
- [Prisma](https://www.prisma.io/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤖 Claude Code

Ce projet est configuré pour fonctionner avec [Claude Code](https://claude.ai/code).

Consultez `.claude/README.md` pour la documentation complète de la stack technique.

## 🆘 Besoin d'aide ?

- Consultez les logs dans la console (navigateur et terminal)
- Vérifiez `.claude/README.md` pour la configuration complète
- Ouvrez Prisma Studio : `npm run db:studio`

---

Généré avec ❤️ par [create-saas-sbk](https://github.com/jerome/create-saas-sbk)
