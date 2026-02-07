import path from 'path';
import { logger } from './utils/logger.js';
import { exists } from './utils/file-utils.js';
import { askQuestions } from './core/questions.js';
import { buildConfig } from './core/config-builder.js';
import { showSummaryAndConfirm } from './core/summary.js';
import { generateEnvFile } from './generators/env-generator.js';
import { generateDockerCompose } from './generators/docker-generator.js';
import { generateClaudeReadme } from './generators/claude-generator.js';
import { generatePackageJson } from './generators/package-generator.js';
import { generateNextjsProject } from './generators/nextjs-generator.js';
import { installDependencies } from './installers/dependencies.js';
import { installSkills } from './installers/skills.js';
import { installShadcnComponents } from './installers/shadcn.js';
import { initClaude } from './installers/claude-init.js';
import { writeFile } from './utils/file-utils.js';
import chalk from 'chalk';

/**
 * Affiche l'aide du CLI
 */
function showHelp() {
  console.log(chalk.bold('\n🚀 create-saas-sbk\n'));
  console.log('Générateur de projets SaaS Next.js 15+ complets et clés en main\n');

  console.log(chalk.bold('Usage:'));
  console.log('  npx create-saas-sbk@latest');
  console.log('  npm create saas-sbk@latest\n');

  console.log(chalk.bold('Options:'));
  console.log('  -h, --help      Afficher cette aide');
  console.log('  -v, --version   Afficher la version\n');

  console.log(chalk.bold('Fonctionnalités:'));
  console.log('  ✓ Next.js 15+ avec App Router');
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
    console.log('v0.3.1');
    return;
  }

  // --help ou -h
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  console.clear();

  // Bannière
  logger.title('🚀 create-saas-sbk');
  console.log(chalk.gray('  Générateur de projets SaaS Next.js 15+ complets'));
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
    logger.step('Génération du package.json...');
    const packageJsonContent = generatePackageJson(config);
    writeFile(path.join(projectPath, 'package.json'), packageJsonContent);
    logger.success('package.json créé');

    // 3. Générer .env
    logger.step('Génération du fichier .env...');
    const envContent = generateEnvFile(config);
    writeFile(path.join(projectPath, '.env'), envContent);
    logger.success('.env créé');

    // 4. Générer docker-compose.yml (si nécessaire)
    const dockerContent = generateDockerCompose(config);
    if (dockerContent) {
      logger.step('Génération du docker-compose.yml...');
      writeFile(path.join(projectPath, 'docker-compose.yml'), dockerContent);
      logger.success('docker-compose.yml créé');
    }

    // 5. Générer .claude/README.md
    logger.step('Génération de la documentation Claude...');
    const claudeReadme = generateClaudeReadme(config);
    writeFile(path.join(projectPath, '.claude/README.md'), claudeReadme);
    logger.success('.claude/README.md créé');

    // 6. Installer les dépendances
    logger.newline();
    await installDependencies(projectPath);

    // 7. Installer les composants Shadcn UI
    logger.newline();
    await installShadcnComponents(projectPath);

    // 8. Installer les skills Claude Code
    logger.newline();
    await installSkills(projectPath, config);

    // 9. Initialiser Claude Code
    logger.newline();
    initClaude(projectPath, config);

    // Message final
    logger.newline();
    logger.newline();
    logger.title('🎉 Votre SaaS est prêt !');
    logger.newline();

    console.log(chalk.bold('Pour démarrer :'));
    console.log('');
    console.log(chalk.cyan(`  cd ${config.projectName}`));

    if (config.database.type === 'docker' || (config.storage.enabled && config.storage.type === 'minio')) {
      console.log(chalk.cyan('  npm run docker:up'));
    }

    console.log(chalk.cyan('  npm run db:push'));
    console.log(chalk.cyan('  npm run dev'));
    console.log('');

    console.log(chalk.bold('Ensuite :'));
    console.log('');
    console.log('  • Ouvrez ' + chalk.cyan('http://localhost:3000'));
    console.log('  • Consultez ' + chalk.cyan('.claude/README.md') + ' pour la documentation');

    if (config.claude.cliInstalled) {
      console.log('  • Utilisez ' + chalk.cyan('/generate-features') + ' pour générer des fonctionnalités');
    }

    console.log('');
    console.log(chalk.gray('📚 Documentation complète dans ./README.md'));
    console.log('');
    console.log(chalk.green('Bon développement ! 🚀'));
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
