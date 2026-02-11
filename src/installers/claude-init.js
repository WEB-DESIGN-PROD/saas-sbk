import path from 'path';
import { writeFile } from '../utils/file-utils.js';
import { logger } from '../utils/logger.js';

/**
 * Génère le fichier CLAUDE.md avec la liste des skills installés
 */
function generateClaudeMd(config, installedSkills) {
  const lines = [
    `# ${config.projectName}`,
    '',
    'Projet SaaS généré avec create-saas-sbk.',
    '',
    '## Stack technique',
    '',
    '- **Next.js 16+** avec App Router',
    '- **React 19** avec Server Components',
    '- **Better Auth** pour l\'authentification',
    '- **Prisma** + **PostgreSQL**',
    '- **Tailwind CSS** + **Shadcn UI**',
  ];

  if (config.payments.enabled) {
    lines.push('- **Stripe** pour les paiements');
  }

  if (config.email.provider === 'resend') {
    lines.push('- **Resend** pour les emails');
  }

  if (config.storage.enabled) {
    lines.push(`- **${config.storage.type === 'minio' ? 'MinIO' : 'AWS S3'}** pour le stockage`);
  }

  if (config.ai.provider !== 'none') {
    lines.push(`- **${config.ai.provider}** pour l'IA`);
  }

  lines.push('');
  lines.push('## Skills Claude Code installés');
  lines.push('');

  if (installedSkills.length > 0) {
    lines.push('Les skills suivants sont disponibles dans `.claude/skills/` :');
    lines.push('');
    installedSkills.forEach(skill => {
      lines.push(`- **${skill.name}** - \`${skill.fileName}\``);
    });
    lines.push('');
    lines.push('Ces skills sont versionnés avec votre projet et partagés avec votre équipe.');
  } else {
    lines.push('Aucun skill installé.');
  }

  lines.push('');
  lines.push('## Commandes utiles');
  lines.push('');
  lines.push('```bash');
  lines.push('npm run dev          # Démarrer le serveur de développement');

  if (config.database.type === 'docker' || (config.storage.enabled && config.storage.type === 'minio')) {
    lines.push('npm run docker:up    # Démarrer les services Docker');
  }

  lines.push('npm run db:push      # Synchroniser le schéma Prisma');
  lines.push('npm run db:studio    # Ouvrir Prisma Studio');
  lines.push('```');
  lines.push('');
  lines.push('## Documentation');
  lines.push('');
  lines.push('Consultez `.claude/README.md` pour la documentation complète de la stack.');

  return lines.join('\n');
}

/**
 * Génère le fichier CLAUDE.md automatiquement
 */
export function initClaude(projectPath, config, installedSkills = []) {
  try {
    const claudeMdContent = generateClaudeMd(config, installedSkills);
    writeFile(path.join(projectPath, 'CLAUDE.md'), claudeMdContent);
    logger.success('CLAUDE.md créé');
  } catch (error) {
    logger.warn('Échec de la génération de CLAUDE.md (non bloquant)');
  }
}
