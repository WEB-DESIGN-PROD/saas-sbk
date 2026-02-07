import chalk from 'chalk';
import inquirer from 'inquirer';
import { logger } from '../utils/logger.js';

/**
 * Masque les valeurs sensibles pour l'affichage
 */
function maskSensitive(value) {
  if (!value || value.length === 0) {
    return chalk.gray('(non configuré)');
  }

  const visibleLength = Math.min(4, Math.floor(value.length / 4));
  return value.substring(0, visibleLength) + '*'.repeat(Math.max(8, value.length - visibleLength));
}

/**
 * Affiche un récapitulatif de la configuration et demande confirmation
 */
export async function showSummaryAndConfirm(config) {
  logger.newline();
  logger.title('📋 Récapitulatif de votre configuration');

  console.log(chalk.bold('Projet:'));
  console.log(`  Nom: ${chalk.cyan(config.projectName)}`);
  console.log(`  Thème: ${chalk.cyan(config.theme)}`);
  logger.newline();

  console.log(chalk.bold('Base de données:'));
  console.log(`  Type: ${chalk.cyan(config.database.type === 'docker' ? 'PostgreSQL Docker' : 'PostgreSQL distant')}`);
  if (config.database.type === 'docker') {
    console.log(`  Utilisateur: ${chalk.cyan(config.database.user)}`);
    console.log(`  Base: ${chalk.cyan(config.database.name)}`);
    console.log(`  Mot de passe: ${chalk.yellow(maskSensitive(config.database.password))}`);
  } else {
    console.log(`  URL: ${chalk.yellow(maskSensitive(config.database.url))}`);
  }
  logger.newline();

  console.log(chalk.bold('Authentification:'));
  console.log(`  Méthodes: ${chalk.cyan(config.auth.methods.join(', '))}`);
  if (config.auth.methods.includes('github')) {
    console.log(`  GitHub Client ID: ${chalk.yellow(maskSensitive(config.auth.githubClientId))}`);
  }
  logger.newline();

  if (config.storage.enabled) {
    console.log(chalk.bold('Stockage médias:'));
    console.log(`  Type: ${chalk.cyan(config.storage.type === 'minio' ? 'MinIO Docker' : 'AWS S3')}`);
    if (config.storage.type === 's3') {
      console.log(`  Région: ${chalk.cyan(config.storage.s3Region)}`);
      console.log(`  Bucket: ${chalk.cyan(config.storage.s3Bucket)}`);
    }
    logger.newline();
  }

  console.log(chalk.bold('Emails:'));
  console.log(`  Provider: ${chalk.cyan(config.email.provider === 'resend' ? 'Resend' : 'SMTP')}`);
  if (config.email.provider === 'smtp') {
    console.log(`  Hôte: ${chalk.cyan(config.email.smtpHost)}`);
    console.log(`  Port: ${chalk.cyan(config.email.smtpPort)}`);
  }
  logger.newline();

  if (config.payments.enabled) {
    console.log(chalk.bold('Paiements:'));
    console.log(`  Stripe: ${chalk.green('activé')}`);
    logger.newline();
  }

  console.log(chalk.bold('Internationalisation:'));
  console.log(`  Langues: ${chalk.cyan(config.i18n.languages.join(', '))}`);
  logger.newline();

  if (config.ai.provider !== 'none') {
    console.log(chalk.bold('Intelligence Artificielle:'));
    console.log(`  Provider: ${chalk.cyan(config.ai.provider)}`);
    logger.newline();
  }

  console.log(chalk.bold('Claude Code:'));
  console.log(`  CLI installé: ${config.claude.cliInstalled ? chalk.green('oui') : chalk.yellow('non')}`);
  logger.newline();

  // Demander confirmation
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Confirmer et générer le projet ?',
      default: true
    }
  ]);

  if (!confirmed) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Que souhaitez-vous faire ?',
        choices: [
          { name: 'Recommencer la configuration', value: 'restart' },
          { name: 'Annuler et quitter', value: 'cancel' }
        ]
      }
    ]);

    return action === 'restart' ? 'restart' : 'cancel';
  }

  return 'confirmed';
}
