import chalk from 'chalk';
import * as p from '@clack/prompts';
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
 * Crée une ligne en deux colonnes
 */
function twoColumns(left, right, columnWidth = 45) {
  const leftStripped = left.replace(/\u001b\[[0-9;]*m/g, ''); // Retirer codes ANSI pour calculer longueur
  const padding = ' '.repeat(Math.max(0, columnWidth - leftStripped.length));
  return left + padding + right;
}

/**
 * Affiche un récapitulatif de la configuration et demande confirmation
 */
export async function showSummaryAndConfirm(config) {
  logger.newline();
  logger.title('📋 Récap\' de votre SAAS');

  // Préparer les lignes pour chaque colonne
  const leftColumn = [];
  const rightColumn = [];

  // ===== COLONNE GAUCHE =====

  // Projet
  leftColumn.push(chalk.bold('Projet'));
  leftColumn.push(`  Nom: ${chalk.cyan(config.projectName)}`);
  leftColumn.push(`  Thème: ${chalk.cyan(config.theme)}`);
  leftColumn.push('');

  // Base de données
  leftColumn.push(chalk.bold('Base de données'));
  if (config.database.type === 'skip') {
    leftColumn.push(`  ${chalk.yellow('Aucune (à configurer)')}`);
  } else if (config.database.type === 'docker') {
    leftColumn.push(`  Type: ${chalk.cyan('PostgreSQL Docker 🐳')}`);
    leftColumn.push(`  User: ${chalk.cyan(config.database.user)}`);
    leftColumn.push(`  DB: ${chalk.cyan(config.database.name)}`);
  } else if (config.database.type === 'remote') {
    leftColumn.push(`  Type: ${chalk.cyan('PostgreSQL distant ☁️')}`);
    leftColumn.push(`  URL: ${chalk.yellow(maskSensitive(config.database.url))}`);
  } else if (config.database.type === 'mongodb-local') {
    leftColumn.push(`  Type: ${chalk.cyan('MongoDB Docker 🐳')}`);
  } else if (config.database.type === 'mongodb-remote') {
    leftColumn.push(`  Type: ${chalk.cyan('MongoDB distant ☁️')}`);
  } else if (config.database.type === 'sqlite') {
    leftColumn.push(`  Type: ${chalk.cyan('SQLite')}`);
  }
  leftColumn.push('');

  // Authentification
  leftColumn.push(chalk.bold('Authentification'));
  if (config.auth.methods.length === 0) {
    leftColumn.push(`  ${chalk.yellow('Aucune (à configurer)')}`);
  } else {
    leftColumn.push(`  ${chalk.cyan(config.auth.methods.join(', '))}`);
    if (config.auth.methods.includes('github')) {
      leftColumn.push(`  GitHub: ${chalk.yellow(maskSensitive(config.auth.githubClientId))}`);
    }
    if (config.auth.methods.includes('google')) {
      leftColumn.push(`  Google: ${chalk.yellow(maskSensitive(config.auth.googleClientId))}`);
    }
  }

  // ===== COLONNE DROITE =====

  // Emails
  rightColumn.push(chalk.bold('Emails'));
  if (config.email.provider === 'skip') {
    rightColumn.push(`  ${chalk.yellow('À configurer ⏭️')}`);
  } else if (config.email.provider === 'resend') {
    rightColumn.push(`  ${chalk.cyan('Resend 📮')}`);
  } else if (config.email.provider === 'smtp') {
    rightColumn.push(`  ${chalk.cyan('SMTP 📧')}`);
    rightColumn.push(`  ${chalk.cyan(config.email.smtpHost)}:${chalk.cyan(config.email.smtpPort)}`);
  }
  rightColumn.push('');

  // Paiements
  rightColumn.push(chalk.bold('Paiements'));
  if (config.payments.enabled) {
    rightColumn.push(`  ${chalk.green('Stripe activé 💳')}`);
  } else {
    rightColumn.push(`  ${chalk.gray('Non configuré')}`);
  }
  rightColumn.push('');

  // Stockage
  rightColumn.push(chalk.bold('Stockage médias'));
  if (config.storage.enabled) {
    if (config.storage.type === 'minio') {
      rightColumn.push(`  ${chalk.cyan('MinIO Docker 🐳')}`);
    } else {
      rightColumn.push(`  ${chalk.cyan('AWS S3 ☁️')}`);
      rightColumn.push(`  ${chalk.cyan(config.storage.s3Region)} / ${chalk.cyan(config.storage.s3Bucket)}`);
    }
  } else {
    rightColumn.push(`  ${chalk.gray('Non configuré')}`);
  }
  rightColumn.push('');

  // Internationalisation
  rightColumn.push(chalk.bold('i18n'));
  rightColumn.push(`  ${chalk.cyan(config.i18n.languages.join(', '))}`);
  if (config.i18n.languages.length > 1) {
    rightColumn.push(`  ${chalk.green('✓')} next-intl (${config.i18n.languages.length} langues)`);
  }
  rightColumn.push('');

  // IA
  rightColumn.push(chalk.bold('Intelligence Artificielle'));
  if (config.ai.providers.length > 0) {
    rightColumn.push(`  ${chalk.cyan(config.ai.providers.join(', '))}`);
  } else {
    rightColumn.push(`  ${chalk.gray('Non configurée')}`);
  }
  rightColumn.push('');

  // Claude Code
  rightColumn.push(chalk.bold('Claude Code CLI'));
  rightColumn.push(`  ${config.claude.cliInstalled ? chalk.green('Installé ✓') : chalk.yellow('Non installé')}`);

  // Afficher les colonnes côte à côte
  const maxLines = Math.max(leftColumn.length, rightColumn.length);

  for (let i = 0; i < maxLines; i++) {
    const left = leftColumn[i] || '';
    const right = rightColumn[i] || '';
    console.log(twoColumns(left, right));
  }

  logger.newline();

  // Demander confirmation
  const confirmed = await p.confirm({
    message: 'Confirmer et générer le projet ?',
    initialValue: true
  });

  if (p.isCancel(confirmed)) {
    p.cancel('Installation annulée.');
    return 'cancel';
  }

  if (!confirmed) {
    const action = await p.select({
      message: 'Que souhaitez-vous faire ?',
      options: [
        { value: 'restart', label: 'Recommencer la configuration' },
        { value: 'cancel', label: 'Annuler et quitter' }
      ]
    });

    if (p.isCancel(action)) {
      p.cancel('Installation annulée.');
      return 'cancel';
    }

    return action;
  }

  return 'confirmed';
}
