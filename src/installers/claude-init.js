import { runCommandSync } from '../utils/command-runner.js';
import { logger } from '../utils/logger.js';

/**
 * Lance la commande `/init` de Claude Code sur le projet
 */
export function initClaude(projectPath, config) {
  if (!config.claude.cliInstalled) {
    logger.warn('Claude Code CLI non installé - skip /init');
    logger.info('Pour installer Claude Code : https://claude.ai/docs/cli');
    return;
  }

  logger.step('Initialisation de Claude Code sur le projet...');

  try {
    runCommandSync('claude /init', {
      cwd: projectPath,
      stdio: 'inherit'
    });

    logger.success('Claude Code initialisé avec succès');
  } catch (error) {
    logger.warn('Échec de l\'initialisation de Claude Code (non bloquant)');
    logger.info('Vous pouvez lancer manuellement : cd ' + config.projectName + ' && claude /init');
  }
}
