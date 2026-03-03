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

  // Skills de base (toujours copiés, quel que soit le type de SaaS)
  skills.push('next-best-practices.md');
  skills.push('prisma-expert.md');
  skills.push('better-auth-best-practices.md');
  skills.push('shadcn-ui.md');
  skills.push('generate-features.md');

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
 * Copie les agents depuis les templates vers le projet généré
 * Tous les agents sont copiés quel que soit le type de SaaS
 */
export async function installAgents(projectPath) {
  const templatesAgentsDir = path.join(__dirname, '../../templates/nextjs-base/.claude/agents');
  const projectAgentsDir = path.join(projectPath, '.claude/agents');

  fs.mkdirSync(projectAgentsDir, { recursive: true });

  if (!fs.existsSync(templatesAgentsDir)) {
    logger.warn('Dossier agents introuvable dans les templates');
    return;
  }

  const agentFiles = fs.readdirSync(templatesAgentsDir).filter(f => f.endsWith('.md'));
  for (const fileName of agentFiles) {
    fs.copyFileSync(
      path.join(templatesAgentsDir, fileName),
      path.join(projectAgentsDir, fileName)
    );
  }
}

/**
 * Copie les skills depuis les templates vers le projet généré
 * et retourne la liste des skills copiés pour CLAUDE.md
 * @returns {Array} Liste des skills copiés
 */
export async function installSkills(projectPath, config) {
  const skillFiles = getSkillsForConfig(config);
  const templatesSkillsDir = path.join(__dirname, '../../templates/nextjs-base/.claude/skills');
  const projectSkillsDir = path.join(projectPath, '.claude/skills');

  // S'assurer que le dossier destination existe
  fs.mkdirSync(projectSkillsDir, { recursive: true });

  const installedSkills = [];

  for (const fileName of skillFiles) {
    const src = path.join(templatesSkillsDir, fileName);
    const dest = path.join(projectSkillsDir, fileName);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      installedSkills.push({
        name: fileName.replace('.md', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        fileName
      });
    } else {
      logger.warn(`Skill introuvable : ${fileName}`);
    }
  }

  return installedSkills;
}
