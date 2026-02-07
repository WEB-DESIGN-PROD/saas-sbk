import { runCommand } from '../utils/command-runner.js';
import { logger } from '../utils/logger.js';
import { withSpinner } from '../utils/spinner.js';

/**
 * Installe les dépendances npm du projet
 */
export async function installDependencies(projectPath) {
  logger.step('Installation des dépendances npm...');

  try {
    await withSpinner('Installation en cours...', async () => {
      await runCommand('npm', ['install'], {
        cwd: projectPath,
        stdio: 'pipe' // Utiliser pipe pour masquer la sortie verbose
      });
    });

    logger.success('Dépendances installées avec succès');
  } catch (error) {
    logger.error('Échec de l\'installation des dépendances');

    // Afficher plus de détails sur l'erreur
    if (error.stderr) {
      logger.error('Détails de l\'erreur npm :');
      console.error(error.stderr.toString());
    }
    if (error.stdout) {
      console.log(error.stdout.toString());
    }

    logger.info('💡 Essayez de corriger les erreurs ci-dessus ou lancez manuellement :');
    logger.info('   cd ' + projectPath.split('/').pop() + ' && npm install');

    throw error;
  }
}
