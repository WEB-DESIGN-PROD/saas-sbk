import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Liste des skills à copier selon la configuration
 */
function getSkillsForConfig(config) {
  const skills = [];

  // Skills de base (toujours copiés)
  skills.push('next-best-practices.md');
  skills.push('prisma-expert.md');
  skills.push('better-auth-best-practices.md');
  skills.push('shadcn-ui.md');

  // Skills conditionnels
  if (config.payments.enabled) {
    skills.push('stripe-best-practices.md');
  }

  if (config.email.provider === 'resend') {
    skills.push('email-best-practices.md');
    skills.push('react-email.md');
  }

  if (config.storage.enabled && config.storage.type === 'minio') {
    skills.push('minio.md');
  }

  return skills;
}

/**
 * Copie les skills depuis les templates vers le projet
 * Note: Les skills sont déjà copiés via copyDirectory dans nextjs-generator.js
 * Cette fonction retourne juste la liste pour CLAUDE.md
 * @returns {Array} Liste des skills copiés
 */
export async function installSkills(projectPath, config) {
  const skillFiles = getSkillsForConfig(config);

  logger.step(`${skillFiles.length} skills inclus dans le projet`);

  const installedSkills = skillFiles.map(fileName => ({
    name: fileName.replace('.md', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    fileName: fileName
  }));

  logger.success(`Skills disponibles dans .claude/skills/`);

  return installedSkills;
}
