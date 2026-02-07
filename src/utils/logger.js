import chalk from 'chalk';

export const logger = {
  success(message) {
    console.log(chalk.green('✓'), message);
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
