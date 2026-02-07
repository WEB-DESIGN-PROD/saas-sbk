import { spawn, execSync } from 'child_process';
import { logger } from './logger.js';

/**
 * Exécute une commande de manière sécurisée avec spawn
 * @param {string} command - La commande à exécuter
 * @param {string[]} args - Les arguments de la commande
 * @param {object} options - Options pour spawn
 * @returns {Promise<void>}
 */
export function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      ...options
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`La commande ${command} a échoué avec le code ${code}`));
      } else {
        resolve();
      }
    });

    proc.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Exécute une commande de manière synchrone (pour des opérations simples)
 * @param {string} command - La commande complète à exécuter
 * @param {object} options - Options pour execSync
 */
export function runCommandSync(command, options = {}) {
  try {
    execSync(command, {
      stdio: 'inherit',
      ...options
    });
  } catch (error) {
    logger.error(`Échec de la commande: ${command}`);
    throw error;
  }
}
