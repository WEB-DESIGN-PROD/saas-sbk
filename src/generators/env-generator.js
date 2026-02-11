import { nanoid } from 'nanoid';
import { sanitizeForEnv } from '../core/validation.js';

/**
 * Génère le contenu du fichier .env
 */
export function generateEnvFile(config) {
  const lines = [
    '# Environnement',
    'NODE_ENV=development',
    '',
    '# Application',
    `APP_NAME="${sanitizeForEnv(config.projectName)}"`,
    `APP_URL="http://localhost:3000"`,
    `NEXT_PUBLIC_APP_URL="http://localhost:3000"`,
    `THEME="${config.theme}"`,
    '',
    '# Base de données',
    `DATABASE_URL="${sanitizeForEnv(config.database.url)}"`,
    ''
  ];

  // Auth
  lines.push('# Authentification');
  lines.push(`BETTER_AUTH_SECRET="${nanoid(32)}"`);
  lines.push(`BETTER_AUTH_URL="http://localhost:3000"`);

  if (config.auth.methods.includes('github')) {
    lines.push(`GITHUB_CLIENT_ID="${sanitizeForEnv(config.auth.githubClientId)}"`);
    lines.push(`GITHUB_CLIENT_SECRET="${sanitizeForEnv(config.auth.githubClientSecret)}"`);
    lines.push(`NEXT_PUBLIC_GITHUB_CLIENT_ID="${sanitizeForEnv(config.auth.githubClientId)}"`);
  }

  if (config.auth.methods.includes('google')) {
    lines.push(`GOOGLE_CLIENT_ID="${sanitizeForEnv(config.auth.googleClientId)}"`);
    lines.push(`GOOGLE_CLIENT_SECRET="${sanitizeForEnv(config.auth.googleClientSecret)}"`);
    lines.push(`NEXT_PUBLIC_GOOGLE_CLIENT_ID="${sanitizeForEnv(config.auth.googleClientId)}"`);
  }
  lines.push('');

  // Storage
  if (config.storage.enabled) {
    lines.push('# Stockage');
    if (config.storage.type === 'minio') {
      lines.push(`MINIO_ENDPOINT="localhost"`);
      lines.push(`MINIO_PORT="${config.storage.minioPort}"`);
      lines.push(`MINIO_ACCESS_KEY="minioadmin"`);
      lines.push(`MINIO_SECRET_KEY="minioadmin"`);
      lines.push(`MINIO_BUCKET="${config.projectName}-media"`);
      lines.push(`MINIO_USE_SSL="false"`);
    } else if (config.storage.type === 's3') {
      lines.push(`AWS_ACCESS_KEY_ID="${sanitizeForEnv(config.storage.s3AccessKey)}"`);
      lines.push(`AWS_SECRET_ACCESS_KEY="${sanitizeForEnv(config.storage.s3SecretKey)}"`);
      lines.push(`AWS_REGION="${sanitizeForEnv(config.storage.s3Region)}"`);
      lines.push(`AWS_BUCKET="${sanitizeForEnv(config.storage.s3Bucket)}"`);
    }
    lines.push('');
  }

  // Email
  lines.push('# Emails');
  if (config.email.provider === 'resend') {
    lines.push(`RESEND_API_KEY="${sanitizeForEnv(config.email.resendApiKey)}"`);
    lines.push(`EMAIL_FROM="noreply@${config.projectName}.com"`);
  } else if (config.email.provider === 'smtp') {
    lines.push(`SMTP_HOST="${sanitizeForEnv(config.email.smtpHost)}"`);
    lines.push(`SMTP_PORT="${config.email.smtpPort}"`);
    lines.push(`SMTP_USER="${sanitizeForEnv(config.email.smtpUser)}"`);
    lines.push(`SMTP_PASSWORD="${sanitizeForEnv(config.email.smtpPassword)}"`);
    lines.push(`EMAIL_FROM="${sanitizeForEnv(config.email.smtpUser)}"`);
  }
  lines.push('');

  // Payments
  if (config.payments.enabled) {
    lines.push('# Paiements Stripe');
    lines.push(`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="${sanitizeForEnv(config.payments.stripePublicKey)}"`);
    lines.push(`STRIPE_SECRET_KEY="${sanitizeForEnv(config.payments.stripeSecretKey)}"`);
    lines.push(`STRIPE_WEBHOOK_SECRET=""`);
    lines.push('');
  }

  // i18n
  lines.push('# Internationalisation');
  lines.push('# Note: next-intl sera installé si plus d\'une langue est configurée');
  lines.push(`DEFAULT_LANGUAGE="${config.i18n.defaultLanguage}"`);
  lines.push(`SUPPORTED_LANGUAGES="${config.i18n.languages.join(',')}"`);
  lines.push(`# Langues configurées : ${config.i18n.languages.join(', ')}`);
  lines.push('');

  // AI
  if (config.ai.providers.length > 0) {
    lines.push('# Intelligence Artificielle pour utilisateurs finaux');
    if (config.ai.providers.includes('claude') && config.ai.claudeApiKey) {
      lines.push(`ANTHROPIC_API_KEY="${sanitizeForEnv(config.ai.claudeApiKey)}"`);
    }
    if (config.ai.providers.includes('openai') && config.ai.openaiApiKey) {
      lines.push(`OPENAI_API_KEY="${sanitizeForEnv(config.ai.openaiApiKey)}"`);
    }
    if (config.ai.providers.includes('gemini') && config.ai.geminiApiKey) {
      lines.push(`GOOGLE_API_KEY="${sanitizeForEnv(config.ai.geminiApiKey)}"`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
