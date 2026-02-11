import path from 'path';
import fs from 'fs';
import { logger } from './utils/logger.js';
import { exists } from './utils/file-utils.js';
import { askQuestions } from './core/questions-v2.js';
import { buildConfig } from './core/config-builder.js';
import { showSummaryAndConfirm } from './core/summary.js';
import { generateEnvFile } from './generators/env-generator.js';
import { generateDockerCompose } from './generators/docker-generator.js';
import { generateClaudeReadme } from './generators/claude-generator.js';
import { generatePackageJson } from './generators/package-generator.js';
import { generateNextjsProject } from './generators/nextjs-generator.js';
import { installDependencies } from './installers/dependencies.js';
import { installSkills } from './installers/skills.js';
import { initClaude } from './installers/claude-init.js';
import { writeFile } from './utils/file-utils.js';
import chalk from 'chalk';
import * as p from '@clack/prompts';

/**
 * Affiche l'aide du CLI
 */
function showHelp() {
  console.log(chalk.bold('\n🚀 create-saas-sbk\n'));
  console.log('Générateur de SAAS Next.js\n');

  console.log(chalk.bold('Usage:'));
  console.log('  npx create-saas-sbk@latest');
  console.log('  npm create saas-sbk@latest\n');

  console.log(chalk.bold('Options:'));
  console.log('  -h, --help      Afficher cette aide');
  console.log('  -v, --version   Afficher la version\n');

  console.log(chalk.bold('Fonctionnalités:'));
  console.log('  ✓ Next.js 16+ avec App Router');
  console.log('  ✓ Better Auth (email, GitHub OAuth, Magic Link)');
  console.log('  ✓ Prisma + PostgreSQL (Docker ou distant)');
  console.log('  ✓ Stripe pour les paiements');
  console.log('  ✓ Resend ou SMTP pour les emails');
  console.log('  ✓ AWS S3 ou MinIO pour le stockage');
  console.log('  ✓ Shadcn UI + Tailwind CSS');
  console.log('  ✓ Support IA (Claude, ChatGPT, Gemini)');
  console.log('  ✓ Internationalisation');
  console.log('  ✓ Claude Code intégré\n');

  console.log(chalk.bold('Exemples:'));
  console.log('  # Créer un nouveau projet');
  console.log('  npm create saas-sbk@latest\n');

  console.log('  # Afficher la version');
  console.log('  npm create saas-sbk@latest -- --version\n');

  console.log(chalk.bold('Documentation:'));
  console.log('  GitHub: https://github.com/jerome/create-saas-sbk');
  console.log('  Issues: https://github.com/jerome/create-saas-sbk/issues\n');
}

/**
 * Point d'entrée principal du CLI
 */
export async function main() {
  // Gérer les arguments de ligne de commande
  const args = process.argv.slice(2);

  // --version ou -v
  if (args.includes('--version') || args.includes('-v')) {
    console.log('v0.4.5');
    return;
  }

  // --help ou -h
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  console.clear();

  // Bannière ASCII art
  console.log(chalk.cyan(`
 _____________________________    _____________________ __
__  ___/__    |__    |_  ___/    __  ___/__  __ )__  //_/
_____ \\__  /| |_  /| |____ \\     _____ \\__  __  |_  ,<
____/ /_  ___ |  ___ |___/ /     ____/ /_  /_/ /_  /| |
/____/ /_/  |_/_/  |_/____/      /____/ /_____/ /_/ |_|
  `));
  console.log(chalk.gray('       Générateur de SAAS Next.js'));
  console.log('');

  try {
    let config;
    let action = 'initial';

    // Boucle pour permettre de recommencer si l'utilisateur refuse le récapitulatif
    while (action !== 'confirmed') {
      if (action === 'cancel') {
        logger.info('Opération annulée.');
        process.exit(0);
      }

      // Poser les questions
      logger.subtitle('Configuration du projet');
      logger.newline();
      const answers = await askQuestions();

      // Construire la config
      config = buildConfig(answers);

      // Afficher le récapitulatif et demander confirmation
      action = await showSummaryAndConfirm(config);
    }

    // Vérifier que le répertoire projet n'existe pas déjà
    const projectPath = path.join(process.cwd(), config.projectName);

    if (exists(projectPath)) {
      logger.error(`Le répertoire "${config.projectName}" existe déjà.`);
      logger.info('Veuillez choisir un autre nom ou supprimer le répertoire existant.');
      process.exit(1);
    }

    logger.newline();
    logger.title('🔨 Génération du projet');
    logger.newline();

    // 1. Générer le projet Next.js
    generateNextjsProject(projectPath, config);

    // 2. Générer package.json
    const packageJsonContent = generatePackageJson(config);
    writeFile(path.join(projectPath, 'package.json'), packageJsonContent);
    logger.successWithComment('package.json créé', 'Liste des dépendances');

    // 3. Générer .env
    const envContent = generateEnvFile(config);
    writeFile(path.join(projectPath, '.env'), envContent);
    logger.successWithComment('.env créé', 'Variables secrètes (mots de passe, clés API)');

    // 4. Générer docker-compose.yml (si nécessaire)
    const dockerContent = generateDockerCompose(config);
    if (dockerContent) {
      writeFile(path.join(projectPath, 'docker-compose.yml'), dockerContent);
      logger.successWithComment('docker-compose.yml créé', 'Configuration PostgreSQL');
    }

    // 5. Générer .claude/README.md et créer les dossiers skills/agents
    const claudeReadme = generateClaudeReadme(config);
    writeFile(path.join(projectPath, '.claude/README.md'), claudeReadme);

    // Créer les dossiers skills et agents pour Claude Code
    fs.mkdirSync(path.join(projectPath, '.claude/skills'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, '.claude/agents'), { recursive: true });

    logger.successWithComment('.claude/README.md créé', 'Documentation pour Claude Code');

    // 6. Récupérer la liste des skills (déjà copiés avec les templates)
    const installedSkills = await installSkills(projectPath, config);
    logger.successWithComment('Skills Claude Code générés', 'Guides de développement IA');

    // 7. Installer les dépendances
    logger.newline();
    await installDependencies(projectPath);

    // 8. Générer CLAUDE.md avec les skills installés
    logger.newline();
    initClaude(projectPath, config, installedSkills);

    // Message final
    logger.newline();
    logger.newline();
    logger.title('🎉 Votre SAAS est prêt !');
    logger.newline();

    // 1. Ressources
    console.log(chalk.bold('📖 Ressources :'));
    console.log('');
    console.log('  • Interface : ' + chalk.cyan('http://localhost:3000'));
    console.log('  • Workflow de développement : ' + chalk.cyan('DEVELOPMENT.md'));
    console.log('  • Documentation technique : ' + chalk.cyan('.claude/README.md'));

    if (config.claude.cliInstalled) {
      console.log('  • Générer des fonctionnalités : ' + chalk.cyan('/generate-features'));
    }

    console.log('');

    // 2. Lien GitHub
    const githubUrl = 'https://github.com/WEB-DESIGN-PROD/saas-sbk/issues';
    console.log('Un problème ? ' + chalk.cyan.underline(githubUrl));
    console.log('');

    // 3. Première fois - Démarrer le projet
    console.log(chalk.bold('🚀 Démarrer le projet pour la première fois :'));
    console.log('');
    console.log(chalk.cyan(`  cd ${config.projectName}`));

    if (config.database.type === 'docker' || (config.storage.enabled && config.storage.type === 'minio')) {
      console.log(chalk.cyan('  npm run docker:up    ') + chalk.gray('# Démarre PostgreSQL'));
    }

    console.log(chalk.cyan('  npm run db:push      ') + chalk.gray('# Crée les tables'));
    console.log(chalk.cyan('  npm run dev          ') + chalk.gray('# Lance le serveur'));
    console.log('');

    // 4. Tips : Prochaines fois dans un bloc
    if (config.database.type === 'docker') {
      const tipsLignes = [
        chalk.cyan('  npm run docker:up    ') + chalk.gray('# Redémarre PostgreSQL (données conservées ✅)'),
        chalk.cyan('  npm run dev          ') + chalk.gray('# Lance le serveur (pas besoin de db:push)')
      ];
      p.note(tipsLignes.join('\n'), '💡 TIPS pour les prochaines fois :');
      console.log('');
    }

    console.log(chalk.green('✨ Bon développement ! 🚀'));
    console.log('');

  } catch (error) {
    logger.newline();
    logger.error('Une erreur est survenue :');
    console.error(chalk.red(error.message));

    if (process.env.DEBUG) {
      console.error(error.stack);
    }

    process.exit(1);
  }
}
