import inquirer from 'inquirer';
import chalk from 'chalk';
import figures from 'figures';
import {
  validateProjectName,
  validatePassword,
  validateDatabaseUser,
  validateDatabaseName,
  validateEmail,
  validateUrl,
  validatePort,
  validateApiKey,
  validateClientId,
  validateClientSecret,
  validateHostname
} from './validation.js';

/**
 * Stocke toutes les réponses de l'utilisateur
 * Important : Les réponses restent en mémoire même si les questions disparaissent à l'écran
 */
const allAnswers = {};

/**
 * Efface les lignes précédentes du terminal
 */
function clearPreviousLines(count) {
  for (let i = 0; i < count; i++) {
    process.stdout.moveCursor(0, -1); // Monte d'une ligne
    process.stdout.clearLine(1); // Efface la ligne
  }
}

/**
 * Affiche une question avec un indicateur de progression
 */
function showProgress(current, total) {
  return chalk.gray(`[${current}/${total}] `);
}

/**
 * Affiche un résumé compact des réponses précédentes
 */
function showAnswersSummary() {
  console.log(chalk.gray('\n━━━ Réponses enregistrées ━━━'));

  if (allAnswers.projectName) {
    console.log(chalk.green(figures.tick) + ' Projet : ' + chalk.cyan(allAnswers.projectName));
  }
  if (allAnswers.theme) {
    console.log(chalk.green(figures.tick) + ' Thème : ' + chalk.cyan(allAnswers.theme === 'dark' ? 'Sombre' : 'Clair'));
  }
  if (allAnswers.databaseType) {
    console.log(chalk.green(figures.tick) + ' Base de données : ' + chalk.cyan(allAnswers.databaseType === 'docker' ? 'Docker' : 'Distant'));
  }
  if (allAnswers.authMethods) {
    console.log(chalk.green(figures.tick) + ' Auth : ' + chalk.cyan(allAnswers.authMethods.length + ' méthode(s)'));
  }
  if (allAnswers.emailProvider !== undefined) {
    const provider = allAnswers.emailProvider === 'skip' ? 'À configurer plus tard' :
                    allAnswers.emailProvider === 'resend' ? 'Resend' : 'SMTP';
    console.log(chalk.green(figures.tick) + ' Email : ' + chalk.cyan(provider));
  }

  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
}

/**
 * Pose toutes les questions interactives avec une UI moderne
 */
export async function askQuestions() {
  const totalQuestions = 10;
  let currentQuestion = 1;

  console.log(chalk.bold.cyan('\n📋 Configuration de votre projet SAAS\n'));
  console.log(chalk.gray('Répondez aux questions suivantes pour personnaliser votre projet.'));
  console.log(chalk.gray('Vous pourrez confirmer ou modifier vos choix avant la génération.\n'));

  // 1. Nom du projet
  const projectAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: showProgress(currentQuestion++, totalQuestions) + 'Nom du projet :',
      default: 'my-saas',
      validate: validateProjectName,
      prefix: chalk.cyan(figures.pointer)
    }
  ]);
  Object.assign(allAnswers, projectAnswers);
  clearPreviousLines(2);
  console.log(chalk.green(figures.tick) + ' Nom du projet : ' + chalk.cyan(allAnswers.projectName));

  // 2. Thème
  const themeAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'theme',
      message: showProgress(currentQuestion++, totalQuestions) + 'Thème de couleur :',
      choices: [
        { name: '🌙 Sombre', value: 'dark' },
        { name: '☀️  Clair', value: 'light' }
      ],
      default: 'dark',
      prefix: chalk.cyan(figures.pointer)
    }
  ]);
  Object.assign(allAnswers, themeAnswers);
  clearPreviousLines(4);
  console.log(chalk.green(figures.tick) + ' Thème : ' + chalk.cyan(allAnswers.theme === 'dark' ? 'Sombre 🌙' : 'Clair ☀️'));

  // 3. Base de données
  const dbTypeAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'databaseType',
      message: showProgress(currentQuestion++, totalQuestions) + 'Configuration de la base de données :',
      choices: [
        { name: '🐳 PostgreSQL local avec Docker (recommandé)', value: 'docker' },
        { name: '☁️  PostgreSQL distant (Neon, Supabase, etc.)', value: 'remote' }
      ],
      default: 'docker',
      prefix: chalk.cyan(figures.pointer)
    }
  ]);
  Object.assign(allAnswers, dbTypeAnswers);
  clearPreviousLines(4);
  console.log(chalk.green(figures.tick) + ' Base de données : ' + chalk.cyan(allAnswers.databaseType === 'docker' ? 'Docker 🐳' : 'Distant ☁️'));

  // Questions database selon le type
  if (allAnswers.databaseType === 'docker') {
    const dbDockerAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'databaseUser',
        message: showProgress(currentQuestion, totalQuestions) + 'Nom d\'utilisateur PostgreSQL :',
        default: 'postgres',
        validate: validateDatabaseUser,
        prefix: chalk.cyan(figures.pointer)
      },
      {
        type: 'password',
        name: 'databasePassword',
        message: showProgress(currentQuestion, totalQuestions) + 'Mot de passe PostgreSQL :',
        mask: '*',
        validate: validatePassword,
        prefix: chalk.cyan(figures.pointer)
      },
      {
        type: 'input',
        name: 'databaseName',
        message: showProgress(currentQuestion, totalQuestions) + 'Nom de la base de données :',
        default: allAnswers.projectName.replace(/-/g, '_'),
        validate: validateDatabaseName,
        prefix: chalk.cyan(figures.pointer)
      }
    ]);
    Object.assign(allAnswers, dbDockerAnswers);
    clearPreviousLines(8);
    console.log(chalk.green(figures.tick) + ' PostgreSQL Docker configuré');
  } else {
    const dbRemoteAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'databaseUrl',
        message: showProgress(currentQuestion, totalQuestions) + 'URL de connexion PostgreSQL :',
        validate: (input) => {
          if (!input || input.trim().length === 0) {
            return 'L\'URL de connexion est requise.';
          }
          if (!input.startsWith('postgresql://') && !input.startsWith('postgres://')) {
            return 'L\'URL doit commencer par postgresql:// ou postgres://';
          }
          return true;
        },
        prefix: chalk.cyan(figures.pointer)
      }
    ]);
    Object.assign(allAnswers, dbRemoteAnswers);
    clearPreviousLines(2);
    console.log(chalk.green(figures.tick) + ' PostgreSQL distant configuré');
  }
  currentQuestion++;

  // 4. Authentification
  console.log(chalk.gray('\n💡 Astuce : Utilisez Espace pour cocher/décocher, Entrée pour valider\n'));
  const authAnswers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'authMethods',
      message: showProgress(currentQuestion++, totalQuestions) + 'Méthodes d\'authentification :',
      choices: [
        { name: '📧 Email/Mot de passe', value: 'email', checked: true },
        { name: '🐙 OAuth GitHub', value: 'github' },
        { name: '✨ Magic Link (lien par email)', value: 'magiclink' }
      ],
      validate: (input) => {
        if (input.length === 0) {
          return 'Vous devez choisir au moins une méthode d\'authentification.';
        }
        return true;
      },
      prefix: chalk.cyan(figures.pointer)
    }
  ]);
  Object.assign(allAnswers, authAnswers);
  clearPreviousLines(6);
  console.log(chalk.green(figures.tick) + ' Authentification : ' + chalk.cyan(allAnswers.authMethods.length + ' méthode(s) sélectionnée(s)'));

  // Questions GitHub OAuth si sélectionné
  if (allAnswers.authMethods.includes('github')) {
    const githubAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'githubClientId',
        message: showProgress(currentQuestion, totalQuestions) + 'GitHub OAuth Client ID :',
        validate: validateClientId,
        prefix: chalk.cyan(figures.pointer)
      },
      {
        type: 'password',
        name: 'githubClientSecret',
        message: showProgress(currentQuestion, totalQuestions) + 'GitHub OAuth Client Secret :',
        mask: '*',
        validate: validateClientSecret,
        prefix: chalk.cyan(figures.pointer)
      }
    ]);
    Object.assign(allAnswers, githubAnswers);
    clearPreviousLines(4);
    console.log(chalk.green(figures.tick) + ' GitHub OAuth configuré');
  }

  // 5. Stockage médias
  const storageAnswers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'storageEnabled',
      message: showProgress(currentQuestion++, totalQuestions) + 'Activer le stockage de fichiers médias ?',
      default: true,
      prefix: chalk.cyan(figures.pointer)
    }
  ]);
  Object.assign(allAnswers, storageAnswers);
  clearPreviousLines(2);
  console.log(chalk.green(figures.tick) + ' Stockage : ' + chalk.cyan(allAnswers.storageEnabled ? 'Activé' : 'Désactivé'));

  if (allAnswers.storageEnabled) {
    const storageTypeAnswers = await inquirer.prompt([
      {
        type: 'list',
        name: 'storageType',
        message: showProgress(currentQuestion, totalQuestions) + 'Type de stockage :',
        choices: [
          { name: '🐳 MinIO local avec Docker (recommandé)', value: 'minio' },
          { name: '☁️  AWS S3', value: 's3' }
        ],
        default: 'minio',
        prefix: chalk.cyan(figures.pointer)
      }
    ]);
    Object.assign(allAnswers, storageTypeAnswers);
    clearPreviousLines(4);
    console.log(chalk.green(figures.tick) + ' Stockage : ' + chalk.cyan(allAnswers.storageType === 'minio' ? 'MinIO 🐳' : 'S3 ☁️'));

    if (allAnswers.storageType === 's3') {
      const s3Answers = await inquirer.prompt([
        {
          type: 'input',
          name: 's3AccessKey',
          message: showProgress(currentQuestion, totalQuestions) + 'AWS Access Key ID :',
          validate: validateApiKey,
          prefix: chalk.cyan(figures.pointer)
        },
        {
          type: 'password',
          name: 's3SecretKey',
          message: showProgress(currentQuestion, totalQuestions) + 'AWS Secret Access Key :',
          mask: '*',
          validate: validateApiKey,
          prefix: chalk.cyan(figures.pointer)
        },
        {
          type: 'input',
          name: 's3Region',
          message: showProgress(currentQuestion, totalQuestions) + 'AWS Region :',
          default: 'us-east-1',
          prefix: chalk.cyan(figures.pointer)
        },
        {
          type: 'input',
          name: 's3Bucket',
          message: showProgress(currentQuestion, totalQuestions) + 'Nom du bucket S3 :',
          validate: (input) => {
            if (!input || input.trim().length === 0) {
              return 'Le nom du bucket est requis.';
            }
            return true;
          },
          prefix: chalk.cyan(figures.pointer)
        }
      ]);
      Object.assign(allAnswers, s3Answers);
      clearPreviousLines(10);
      console.log(chalk.green(figures.tick) + ' AWS S3 configuré');
    }
  }

  // 6. Emails
  const emailAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'emailProvider',
      message: showProgress(currentQuestion++, totalQuestions) + 'Service d\'envoi d\'emails :',
      choices: [
        { name: '📮 Resend (recommandé)', value: 'resend' },
        { name: '📧 SMTP personnalisé', value: 'smtp' },
        { name: '⏭️  Ignorer pour le moment', value: 'skip' }
      ],
      default: 'resend',
      prefix: chalk.cyan(figures.pointer)
    }
  ]);
  Object.assign(allAnswers, emailAnswers);
  clearPreviousLines(5);

  if (allAnswers.emailProvider === 'skip') {
    console.log(chalk.yellow(figures.warning) + ' Email : ' + chalk.gray('À configurer plus tard'));
  } else {
    console.log(chalk.green(figures.tick) + ' Email : ' + chalk.cyan(allAnswers.emailProvider === 'resend' ? 'Resend 📮' : 'SMTP 📧'));

    if (allAnswers.emailProvider === 'resend') {
      const resendAnswers = await inquirer.prompt([
        {
          type: 'password',
          name: 'resendApiKey',
          message: showProgress(currentQuestion, totalQuestions) + 'Clé API Resend :',
          mask: '*',
          validate: validateApiKey,
          prefix: chalk.cyan(figures.pointer)
        }
      ]);
      Object.assign(allAnswers, resendAnswers);
      clearPreviousLines(2);
      console.log(chalk.green(figures.tick) + ' Resend configuré');
    } else if (allAnswers.emailProvider === 'smtp') {
      const smtpAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'smtpHost',
          message: showProgress(currentQuestion, totalQuestions) + 'Hôte SMTP :',
          validate: validateHostname,
          prefix: chalk.cyan(figures.pointer)
        },
        {
          type: 'input',
          name: 'smtpPort',
          message: showProgress(currentQuestion, totalQuestions) + 'Port SMTP :',
          default: '587',
          validate: validatePort,
          prefix: chalk.cyan(figures.pointer)
        },
        {
          type: 'input',
          name: 'smtpUser',
          message: showProgress(currentQuestion, totalQuestions) + 'Utilisateur SMTP :',
          validate: validateEmail,
          prefix: chalk.cyan(figures.pointer)
        },
        {
          type: 'password',
          name: 'smtpPassword',
          message: showProgress(currentQuestion, totalQuestions) + 'Mot de passe SMTP :',
          mask: '*',
          validate: validatePassword,
          prefix: chalk.cyan(figures.pointer)
        }
      ]);
      Object.assign(allAnswers, smtpAnswers);
      clearPreviousLines(10);
      console.log(chalk.green(figures.tick) + ' SMTP configuré');
    }
  }

  // 7. Paiements
  const paymentsAnswers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'paymentsEnabled',
      message: showProgress(currentQuestion++, totalQuestions) + 'Activer les paiements Stripe ?',
      default: true,
      prefix: chalk.cyan(figures.pointer)
    }
  ]);
  Object.assign(allAnswers, paymentsAnswers);
  clearPreviousLines(2);
  console.log(chalk.green(figures.tick) + ' Paiements : ' + chalk.cyan(allAnswers.paymentsEnabled ? 'Activé 💳' : 'Désactivé'));

  if (allAnswers.paymentsEnabled) {
    const stripeAnswers = await inquirer.prompt([
      {
        type: 'password',
        name: 'stripePublicKey',
        message: showProgress(currentQuestion, totalQuestions) + 'Clé publique Stripe (pk_test_...) :',
        mask: '*',
        validate: (input) => {
          if (!input || input.trim().length === 0) {
            return 'La clé publique Stripe est requise.';
          }
          if (!input.startsWith('pk_')) {
            return 'La clé doit commencer par pk_';
          }
          return true;
        },
        prefix: chalk.cyan(figures.pointer)
      },
      {
        type: 'password',
        name: 'stripeSecretKey',
        message: showProgress(currentQuestion, totalQuestions) + 'Clé secrète Stripe (sk_test_...) :',
        mask: '*',
        validate: (input) => {
          if (!input || input.trim().length === 0) {
            return 'La clé secrète Stripe est requise.';
          }
          if (!input.startsWith('sk_')) {
            return 'La clé doit commencer par sk_';
          }
          return true;
        },
        prefix: chalk.cyan(figures.pointer)
      }
    ]);
    Object.assign(allAnswers, stripeAnswers);
    clearPreviousLines(4);
    console.log(chalk.green(figures.tick) + ' Stripe configuré');
  }

  // 8. Internationalisation
  console.log(chalk.gray('\n💡 Astuce : Utilisez Espace pour cocher les langues supplémentaires\n'));
  const i18nAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'i18nDefaultLanguage',
      message: showProgress(currentQuestion++, totalQuestions) + 'Langue par défaut :',
      choices: [
        { name: '🇫🇷 Français', value: 'fr' },
        { name: '🇬🇧 Anglais', value: 'en' },
        { name: '🇪🇸 Espagnol', value: 'es' },
        { name: '🇩🇪 Allemand', value: 'de' }
      ],
      default: 'fr',
      prefix: chalk.cyan(figures.pointer)
    },
    {
      type: 'checkbox',
      name: 'i18nLanguages',
      message: showProgress(currentQuestion, totalQuestions) + 'Langues supplémentaires :',
      choices: (answers) => {
        const all = [
          { name: '🇫🇷 Français', value: 'fr' },
          { name: '🇬🇧 Anglais', value: 'en' },
          { name: '🇪🇸 Espagnol', value: 'es' },
          { name: '🇩🇪 Allemand', value: 'de' }
        ];
        return all.filter(lang => lang.value !== answers.i18nDefaultLanguage);
      },
      prefix: chalk.cyan(figures.pointer)
    }
  ]);
  Object.assign(allAnswers, i18nAnswers);
  clearPreviousLines(8);
  const totalLangs = 1 + (allAnswers.i18nLanguages?.length || 0);
  console.log(chalk.green(figures.tick) + ' Internationalisation : ' + chalk.cyan(totalLangs + ' langue(s) 🌍'));

  // 9. IA
  const aiAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'aiProvider',
      message: showProgress(currentQuestion++, totalQuestions) + 'Intégration IA :',
      choices: [
        { name: '❌ Aucune', value: 'none' },
        { name: '🤖 Claude (Anthropic)', value: 'claude' },
        { name: '💬 ChatGPT (OpenAI)', value: 'openai' },
        { name: '✨ Gemini (Google)', value: 'gemini' }
      ],
      default: 'none',
      prefix: chalk.cyan(figures.pointer)
    }
  ]);
  Object.assign(allAnswers, aiAnswers);
  clearPreviousLines(6);
  console.log(chalk.green(figures.tick) + ' IA : ' + chalk.cyan(
    allAnswers.aiProvider === 'none' ? 'Aucune' :
    allAnswers.aiProvider === 'claude' ? 'Claude 🤖' :
    allAnswers.aiProvider === 'openai' ? 'ChatGPT 💬' : 'Gemini ✨'
  ));

  if (allAnswers.aiProvider !== 'none') {
    const aiKeyAnswers = await inquirer.prompt([
      {
        type: 'password',
        name: 'aiApiKey',
        message: showProgress(currentQuestion, totalQuestions) + `Clé API ${allAnswers.aiProvider === 'claude' ? 'Anthropic' : allAnswers.aiProvider === 'openai' ? 'OpenAI' : 'Google'} :`,
        mask: '*',
        validate: validateApiKey,
        prefix: chalk.cyan(figures.pointer)
      }
    ]);
    Object.assign(allAnswers, aiKeyAnswers);
    clearPreviousLines(2);
    console.log(chalk.green(figures.tick) + ' Clé API configurée');
  }

  // 10. Claude Code
  const claudeCodeAnswers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'claudeCodeInstalled',
      message: showProgress(currentQuestion++, totalQuestions) + 'Avez-vous Claude Code CLI installé ?',
      default: true, // ✅ Changé de false à true
      prefix: chalk.cyan(figures.pointer)
    }
  ]);
  Object.assign(allAnswers, claudeCodeAnswers);
  clearPreviousLines(2);
  console.log(chalk.green(figures.tick) + ' Claude Code : ' + chalk.cyan(allAnswers.claudeCodeInstalled ? 'Oui ✓' : 'Non'));

  // Afficher le résumé final compact
  console.log(chalk.gray('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.green.bold('✓ Configuration terminée !'));
  console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  return allAnswers;
}
