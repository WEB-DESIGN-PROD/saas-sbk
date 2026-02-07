import { runCommandSync } from '../utils/command-runner.js';
import { logger } from '../utils/logger.js';

/**
 * Installe les composants Shadcn UI nécessaires
 */
export async function installShadcnComponents(projectPath) {
  logger.step('Installation des composants Shadcn UI...');

  const components = [
    'dashboard-01', // Template dashboard complet
  ];

  let successCount = 0;
  let failCount = 0;

  for (const component of components) {
    try {
      logger.info(`  → Installation de ${component}...`);
      runCommandSync(`npx shadcn@latest add ${component} --yes`, {
        cwd: projectPath,
        stdio: 'pipe'
      });
      successCount++;
    } catch (error) {
      logger.warn(`  ⚠ Échec de l'installation de ${component} (non bloquant)`);
      failCount++;
    }
  }

  if (successCount > 0) {
    logger.success(`${successCount} composants Shadcn installés`);
  }

  if (failCount > 0) {
    logger.warn(`${failCount} composants ont échoué (non bloquant)`);
  }
}
