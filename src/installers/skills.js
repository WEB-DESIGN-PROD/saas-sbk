import { runCommandSync } from '../utils/command-runner.js';
import { logger } from '../utils/logger.js';

/**
 * Mapping configuration → skills Claude Code avec URLs GitHub
 */
function getSkillsForConfig(config) {
  const skills = [];

  // Next.js - skill par défaut
  skills.push({
    name: 'Next.js Best Practices',
    command: 'npx skills add next-best-practices'
  });

  // Prisma - toujours inclus
  skills.push({
    name: 'Prisma Expert',
    command: 'npx skills add https://github.com/sickn33/antigravity-awesome-skills --skill prisma-expert'
  });

  // Better Auth - toujours inclus
  skills.push({
    name: 'Better Auth',
    command: 'npx skills add https://github.com/better-auth/skills --skill better-auth-best-practices'
  });

  // Shadcn UI - toujours inclus
  skills.push({
    name: 'Shadcn UI',
    command: 'npx skills add https://github.com/giuseppe-trisciuoglio/developer-kit --skill shadcn-ui'
  });

  // Stripe si paiements activés
  if (config.payments.enabled) {
    skills.push({
      name: 'Stripe',
      command: 'npx skills add https://github.com/stripe/ai --skill stripe-best-practices'
    });
  }

  // Resend si email provider est resend
  if (config.email.provider === 'resend') {
    skills.push({
      name: 'Email Best Practices',
      command: 'npx skills add https://github.com/resend/email-best-practices --skill email-best-practices'
    });
    skills.push({
      name: 'React Email',
      command: 'npx skills add https://github.com/resend/react-email --skill react-email'
    });
    skills.push({
      name: 'Resend',
      command: 'npx skills add https://github.com/resend/resend-skills --skill resend'
    });
    skills.push({
      name: 'Send Email',
      command: 'npx skills add https://github.com/resend/resend-skills --skill send-email'
    });
  }

  // MinIO si storage type est minio
  if (config.storage.enabled && config.storage.type === 'minio') {
    skills.push({
      name: 'MinIO',
      command: 'npx skills add https://github.com/vm0-ai/vm0-skills --skill minio'
    });
  }

  return skills;
}

/**
 * Installe les skills Claude Code adaptés à la configuration
 */
export async function installSkills(projectPath, config) {
  const skills = getSkillsForConfig(config);

  if (skills.length === 0) {
    logger.info('Aucun skill Claude Code à installer');
    return;
  }

  logger.step(`Installation de ${skills.length} skills Claude Code...`);

  let successCount = 0;
  let failCount = 0;

  for (const skill of skills) {
    try {
      logger.info(`  → Installation de ${skill.name}...`);
      runCommandSync(skill.command, {
        cwd: projectPath,
        stdio: 'pipe' // Masquer sortie verbose
      });
      successCount++;
    } catch (error) {
      logger.warn(`  ⚠ Échec de l'installation de ${skill.name} (non bloquant)`);
      failCount++;
    }
  }

  if (successCount > 0) {
    logger.success(`${successCount} skills installés avec succès`);
  }

  if (failCount > 0) {
    logger.warn(`${failCount} skills ont échoué (non bloquant)`);
  }
}
