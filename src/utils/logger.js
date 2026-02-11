import chalk from 'chalk';

export const logger = {
  success(message) {
    console.log(chalk.green('✓'), message);
  },

  /**
   * Affiche un message de succès avec un commentaire aligné
   * @param {string} message - Le message principal
   * @param {string} comment - Le commentaire explicatif (sans le #)
   */
  successWithComment(message, comment) {
    // Largeur de la colonne où aligner les commentaires (symbole # inclus)
    const COMMENT_COLUMN = 50;

    // Nettoyer le message des codes ANSI pour calculer sa vraie longueur
    const cleanMessage = message.replace(/\u001b\[[0-9;]*m/g, '');

    // Calculer le padding nécessaire (COMMENT_COLUMN - longueur message - "✓ ")
    const messageLength = cleanMessage.length + 2; // +2 pour "✓ "
    const padding = Math.max(1, COMMENT_COLUMN - messageLength);

    // Construire le message final
    const fullMessage = message + ' '.repeat(padding) + chalk.gray('# ' + comment);

    console.log(chalk.green('✓'), fullMessage);
  },

  error(message) {
    console.log(chalk.red('✗'), message);
  },

  warn(message) {
    console.log(chalk.yellow('⚠'), message);
  },

  info(message) {
    console.log(chalk.blue('ℹ'), message);
  },

  step(message) {
    console.log(chalk.cyan('→'), message);
  },

  title(message) {
    console.log('\n' + chalk.bold.magenta(message) + '\n');
  },

  subtitle(message) {
    console.log(chalk.bold(message));
  },

  newline() {
    console.log('');
  }
};
