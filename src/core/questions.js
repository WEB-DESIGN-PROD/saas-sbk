import inquirer from 'inquirer';
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
 * Pose toutes les questions interactives pour configurer le projet
 */
export async function askQuestions() {
  const answers = {};

  // 1. Nom du projet
  const projectAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Nom du projet :',
      default: 'my-saas',
      validate: validateProjectName
    }
  ]);
  Object.assign(answers, projectAnswers);

  // 2. Thème
  const themeAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'theme',
      message: 'Thème de couleur :',
      choices: [
        { name: 'Sombre', value: 'dark' },
        { name: 'Clair', value: 'light' }
      ],
      default: 'dark'
    }
  ]);
  Object.assign(answers, themeAnswers);

  // 3. Base de données
  const dbTypeAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'databaseType',
      message: 'Configuration de la base de données :',
      choices: [
        { name: 'PostgreSQL local avec Docker (recommandé)', value: 'docker' },
        { name: 'PostgreSQL distant (Neon, Supabase, etc.)', value: 'remote' }
      ],
      default: 'docker'
    }
  ]);
  Object.assign(answers, dbTypeAnswers);

  // Questions database selon le type
  if (answers.databaseType === 'docker') {
    const dbDockerAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'databaseUser',
        message: 'Nom d\'utilisateur PostgreSQL :',
        default: 'postgres',
        validate: validateDatabaseUser
      },
      {
        type: 'password',
        name: 'databasePassword',
        message: 'Mot de passe PostgreSQL :',
        mask: '*',
        validate: validatePassword
      },
      {
        type: 'input',
        name: 'databaseName',
        message: 'Nom de la base de données :',
        default: answers.projectName.replace(/-/g, '_'),
        validate: validateDatabaseName
      }
    ]);
    Object.assign(answers, dbDockerAnswers);
  } else {
    const dbRemoteAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'databaseUrl',
        message: 'URL de connexion PostgreSQL (postgresql://...) :',
        validate: (input) => {
          if (!input || input.trim().length === 0) {
            return 'L\'URL de connexion est requise.';
          }
          if (!input.startsWith('postgresql://') && !input.startsWith('postgres://')) {
            return 'L\'URL doit commencer par postgresql:// ou postgres://';
          }
          return true;
        }
      }
    ]);
    Object.assign(answers, dbRemoteAnswers);
  }

  // 4. Authentification
  const authAnswers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'authMethods',
      message: 'Méthodes d\'authentification (cochez avec Espace) :',
      choices: [
        { name: 'Email/Mot de passe', value: 'email', checked: true },
        { name: 'OAuth GitHub', value: 'github' },
        { name: 'Magic Link (lien par email)', value: 'magiclink' }
      ],
      validate: (input) => {
        if (input.length === 0) {
          return 'Vous devez choisir au moins une méthode d\'authentification.';
        }
        return true;
      }
    }
  ]);
  Object.assign(answers, authAnswers);

  // Questions GitHub OAuth si sélectionné
  if (answers.authMethods.includes('github')) {
    const githubAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'githubClientId',
        message: 'GitHub OAuth Client ID :',
        validate: validateClientId
      },
      {
        type: 'password',
        name: 'githubClientSecret',
        message: 'GitHub OAuth Client Secret :',
        mask: '*',
        validate: validateClientSecret
      }
    ]);
    Object.assign(answers, githubAnswers);
  }

  // 5. Stockage médias
  const storageAnswers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'storageEnabled',
      message: 'Activer le stockage de fichiers médias ?',
      default: true
    }
  ]);
  Object.assign(answers, storageAnswers);

  if (answers.storageEnabled) {
    const storageTypeAnswers = await inquirer.prompt([
      {
        type: 'list',
        name: 'storageType',
        message: 'Type de stockage :',
        choices: [
          { name: 'MinIO local avec Docker (recommandé pour dev)', value: 'minio' },
          { name: 'AWS S3', value: 's3' }
        ],
        default: 'minio'
      }
    ]);
    Object.assign(answers, storageTypeAnswers);

    if (answers.storageType === 's3') {
      const s3Answers = await inquirer.prompt([
        {
          type: 'input',
          name: 's3AccessKey',
          message: 'AWS Access Key ID :',
          validate: validateApiKey
        },
        {
          type: 'password',
          name: 's3SecretKey',
          message: 'AWS Secret Access Key :',
          mask: '*',
          validate: validateApiKey
        },
        {
          type: 'input',
          name: 's3Region',
          message: 'AWS Region :',
          default: 'us-east-1'
        },
        {
          type: 'input',
          name: 's3Bucket',
          message: 'Nom du bucket S3 :',
          validate: (input) => {
            if (!input || input.trim().length === 0) {
              return 'Le nom du bucket est requis.';
            }
            return true;
          }
        }
      ]);
      Object.assign(answers, s3Answers);
    }
  }

  // 6. Emails
  const emailAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'emailProvider',
      message: 'Service d\'envoi d\'emails :',
      choices: [
        { name: 'Resend (recommandé)', value: 'resend' },
        { name: 'SMTP personnalisé', value: 'smtp' }
      ],
      default: 'resend'
    }
  ]);
  Object.assign(answers, emailAnswers);

  if (answers.emailProvider === 'resend') {
    const resendAnswers = await inquirer.prompt([
      {
        type: 'password',
        name: 'resendApiKey',
        message: 'Clé API Resend :',
        mask: '*',
        validate: validateApiKey
      }
    ]);
    Object.assign(answers, resendAnswers);
  } else {
    const smtpAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'smtpHost',
        message: 'Hôte SMTP :',
        validate: validateHostname
      },
      {
        type: 'input',
        name: 'smtpPort',
        message: 'Port SMTP :',
        default: '587',
        validate: validatePort
      },
      {
        type: 'input',
        name: 'smtpUser',
        message: 'Utilisateur SMTP :',
        validate: validateEmail
      },
      {
        type: 'password',
        name: 'smtpPassword',
        message: 'Mot de passe SMTP :',
        mask: '*',
        validate: validatePassword
      }
    ]);
    Object.assign(answers, smtpAnswers);
  }

  // 7. Paiements
  const paymentsAnswers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'paymentsEnabled',
      message: 'Activer les paiements Stripe ?',
      default: true
    }
  ]);
  Object.assign(answers, paymentsAnswers);

  if (answers.paymentsEnabled) {
    const stripeAnswers = await inquirer.prompt([
      {
        type: 'password',
        name: 'stripePublicKey',
        message: 'Clé publique Stripe (pk_test_...) :',
        mask: '*',
        validate: (input) => {
          if (!input || input.trim().length === 0) {
            return 'La clé publique Stripe est requise.';
          }
          if (!input.startsWith('pk_')) {
            return 'La clé doit commencer par pk_';
          }
          return true;
        }
      },
      {
        type: 'password',
        name: 'stripeSecretKey',
        message: 'Clé secrète Stripe (sk_test_...) :',
        mask: '*',
        validate: (input) => {
          if (!input || input.trim().length === 0) {
            return 'La clé secrète Stripe est requise.';
          }
          if (!input.startsWith('sk_')) {
            return 'La clé doit commencer par sk_';
          }
          return true;
        }
      }
    ]);
    Object.assign(answers, stripeAnswers);
  }

  // 8. Internationalisation
  const i18nAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'i18nDefaultLanguage',
      message: 'Langue par défaut :',
      choices: [
        { name: 'Français', value: 'fr' },
        { name: 'Anglais', value: 'en' },
        { name: 'Espagnol', value: 'es' },
        { name: 'Allemand', value: 'de' }
      ],
      default: 'fr'
    },
    {
      type: 'checkbox',
      name: 'i18nLanguages',
      message: 'Langues supplémentaires :',
      choices: (answers) => {
        const all = [
          { name: 'Français', value: 'fr' },
          { name: 'Anglais', value: 'en' },
          { name: 'Espagnol', value: 'es' },
          { name: 'Allemand', value: 'de' }
        ];
        return all.filter(lang => lang.value !== answers.i18nDefaultLanguage);
      }
    }
  ]);
  Object.assign(answers, i18nAnswers);

  // 9. IA
  const aiAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'aiProvider',
      message: 'Intégration IA :',
      choices: [
        { name: 'Aucune', value: 'none' },
        { name: 'Claude (Anthropic)', value: 'claude' },
        { name: 'ChatGPT (OpenAI)', value: 'openai' },
        { name: 'Gemini (Google)', value: 'gemini' }
      ],
      default: 'none'
    }
  ]);
  Object.assign(answers, aiAnswers);

  if (answers.aiProvider !== 'none') {
    const aiKeyAnswers = await inquirer.prompt([
      {
        type: 'password',
        name: 'aiApiKey',
        message: `Clé API ${answers.aiProvider === 'claude' ? 'Anthropic' : answers.aiProvider === 'openai' ? 'OpenAI' : 'Google'} :`,
        mask: '*',
        validate: validateApiKey
      }
    ]);
    Object.assign(answers, aiKeyAnswers);
  }

  // 10. Claude Code
  const claudeCodeAnswers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'claudeCodeInstalled',
      message: 'Avez-vous Claude Code CLI installé ?',
      default: false
    }
  ]);
  Object.assign(answers, claudeCodeAnswers);

  return answers;
}
