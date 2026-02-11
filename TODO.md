# TODO - create-saas-sbk

## ⚠️ URGENT - Gestion du cas "Ignorer base de données"

### Contexte
Lorsque l'utilisateur choisit "Ignorer pour l'instant" pour la base de données :
- Le flag `skipAuth` est activé
- La question d'authentification est passée
- `authMethods` est un tableau vide

### À faire
Gérer ce cas dans la génération des templates :

**Fichiers à modifier :**
- `src/generators/nextjs-generator.js`
- `src/templates/nextjs-base/`

**Actions requises :**
1. Détecter si `config.database.type === 'skip'`
2. Générer un template **sans** Better Auth si skip
3. Ne pas générer les fichiers d'authentification
4. Ne pas installer les dépendances liées à l'auth (better-auth, prisma)
5. Afficher un message dans le README du projet généré expliquant :
   - Que l'auth n'est pas configurée
   - Comment la configurer plus tard
6. Créer un dashboard simple sans gestion de session

**Alternative :**
- Générer quand même les fichiers d'auth mais avec des commentaires TODO
- Créer un guide `.claude/AUTH_SETUP.md` pour aider à configurer plus tard

---

## ✅ UX - Migration vers @clack/prompts (TERMINÉ)

### Problème résolu
Inquirer affichait des messages d'aide en anglais qui ne pouvaient pas être supprimés sans casser le rendu du CLI.

### Solution implémentée ✅

**Migration complétée le 2026-02-11**
- ✅ Remplacement complet d'inquirer par @clack/prompts
- ✅ Interface visuelle moderne sans messages anglais
- ✅ Meilleure UX avec hints et labels clairs
- ✅ Gestion native des annulations (Ctrl+C)
- ✅ Spinner élégant pour l'animation finale
- ✅ Tests fonctionnels réussis

**Fichiers migrés :**
- ✅ `src/core/questions-v2.js` - Réécriture complète avec API @clack/prompts
- ✅ `src/core/summary.js` - Conversion vers @clack/prompts
- ✅ `package.json` - Dépendances mises à jour

**Commit :** `b9030dd` sur la branche `ux/migration-clack-prompts`

**Prochaine étape :** Tester en conditions réelles et fusionner dans `main` si approuvé

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

### Templates Next.js

- [ ] **Template sans système de connexion** (quand base de données = "Aucune")
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
