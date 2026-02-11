import * as p from '@clack/prompts';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
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

// Récupérer la version depuis package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));
const version = packageJson.version;

/**
 * Pose toutes les questions avec l'interface moderne de @clack/prompts
 */
export async function askQuestions() {
  console.clear();

  // Introduction avec logo
  p.intro(chalk.cyan(`
 _____________________________    _____________________ __
__  ___/__    |__    |_  ___/    __  ___/__  __ )__  //_/
_____ \\__  /| |_  /| |____ \\     _____ \\__  __  |_  ,<
____/ /_  ___ |  ___ |___/ /     ____/ /_  /_/ /_  /| |
/____/ /_/  |_/_/  |_/____/      /____/ /_____/ /_/ |_|

${chalk.gray('Générateur de SaaS Next.js 16')}
${chalk.gray(`v${version}`)} • ${chalk.blue('https://github.com/WEB-DESIGN-PROD/saas-sbk/issues')}`));

  const answers = {};

  // 1. Nom du projet
  const projectName = await p.text({
    message: 'Nom du projet',
    placeholder: 'my-saas',
    defaultValue: 'my-saas',
    validate: (value) => {
      const result = validateProjectName(value);
      return result === true ? undefined : result;
    }
  });

  if (p.isCancel(projectName)) {
    p.cancel('Installation annulée.');
    process.exit(0);
  }
  answers.projectName = projectName;

  // 2. Thème
  const theme = await p.select({
    message: 'Thème par défaut',
    options: [
      { value: 'dark', label: '🌙 Sombre' },
      { value: 'light', label: '☀️  Clair' }
    ],
    initialValue: 'dark'
  });

  if (p.isCancel(theme)) {
    p.cancel('Installation annulée.');
    process.exit(0);
  }
  answers.theme = theme;

  // 3. Base de données avec boucle pour confirmation si "skip"
  let databaseConfigured = false;
  while (!databaseConfigured) {
    const databaseType = await p.select({
      message: 'Configuration de la base de données',
      options: [
        { value: 'skip', label: 'Ignorer pour l\'instant', hint: 'À configurer plus tard' },
        { value: 'docker', label: '🐳 PostgreSQL local avec Docker', hint: 'Recommandé' },
        { value: 'remote', label: '   PostgreSQL distant', hint: 'Neon, Supabase, etc.' },
        { value: 'mongodb-local', label: '🐳 MongoDB local avec Docker' },
        { value: 'mongodb-remote', label: '   MongoDB distant', hint: 'Atlas, etc.' },
        { value: 'sqlite', label: '   SQLite', hint: 'Fichier local' }
      ],
      initialValue: 'skip'
    });

    if (p.isCancel(databaseType)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }

    // Si skip, afficher avertissement et demander confirmation
    if (databaseType === 'skip') {
      console.log('');
      console.log(chalk.yellow.bold('⚠️  ATTENTION'));
      console.log(chalk.yellow('Sans base de données, le système d\'authentification automatique'));
      console.log(chalk.yellow('ne pourra pas fonctionner. Vous devrez configurer cela plus tard.'));
      console.log('');

      const confirmSkip = await p.confirm({
        message: 'Confirmer et continuer sans base de données ?',
        initialValue: false
      });

      if (p.isCancel(confirmSkip)) {
        p.cancel('Installation annulée.');
        process.exit(0);
      }

      if (confirmSkip) {
        answers.databaseType = databaseType;
        answers.skipAuth = true;
        databaseConfigured = true;
      }
      // Sinon on reboucle
    } else {
      answers.databaseType = databaseType;
      databaseConfigured = true;
    }
  }

  // Questions DB selon le type
  if (answers.databaseType === 'docker') {
    const databaseUser = await p.text({
      message: 'Nom d\'utilisateur PostgreSQL',
      placeholder: 'postgres',
      defaultValue: 'postgres',
      validate: (value) => {
        const result = validateDatabaseUser(value);
        return result === true ? undefined : result;
      }
    });

    if (p.isCancel(databaseUser)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }
    answers.databaseUser = databaseUser;

    const databasePassword = await p.password({
      message: 'Mot de passe PostgreSQL',
      placeholder: 'postgres',
      validate: (value) => {
        const result = validatePassword(value);
        return result === true ? undefined : result;
      }
    });

    if (p.isCancel(databasePassword)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }
    answers.databasePassword = databasePassword;

    const databaseName = await p.text({
      message: 'Nom de la base de données',
      placeholder: answers.projectName.replace(/-/g, '_'),
      defaultValue: answers.projectName.replace(/-/g, '_'),
      validate: (value) => {
        const result = validateDatabaseName(value);
        return result === true ? undefined : result;
      }
    });

    if (p.isCancel(databaseName)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }
    answers.databaseName = databaseName;

  } else if (answers.databaseType === 'remote') {
    p.note(
      chalk.cyan('🔗 Neon:') + ' https://console.neon.tech/\n' +
      chalk.cyan('🔗 Supabase:') + ' https://supabase.com/dashboard/project/_/settings/database',
      'Liens utiles pour PostgreSQL distant'
    );

    const databaseUrl = await p.text({
      message: 'URL de connexion PostgreSQL',
      placeholder: 'postgresql://user:password@host:5432/database',
      validate: (input) => {
        if (!input || input.trim().length === 0) return 'URL requise';
        if (!input.startsWith('postgresql://') && !input.startsWith('postgres://')) {
          return 'L\'URL doit commencer par postgresql://';
        }
        return undefined;
      }
    });

    if (p.isCancel(databaseUrl)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }
    answers.databaseUrl = databaseUrl;
  } else if (answers.databaseType === 'mongodb-remote') {
    p.note(
      chalk.cyan('🔗 MongoDB Atlas:') + ' https://cloud.mongodb.com/',
      'Lien utile pour MongoDB distant'
    );
  }

  // 4. Authentification (sauf si base de données ignorée)
  if (!answers.skipAuth) {
    p.note(chalk.gray('💡 Espace = cocher/décocher • a = tout • Entrée = valider'), 'Astuce');

    const authMethods = await p.multiselect({
      message: 'Méthodes d\'authentification',
      options: [
        { value: 'email', label: 'Email/Mot de passe', hint: 'Recommandé' },
        { value: 'github', label: 'OAuth GitHub' },
        { value: 'google', label: 'OAuth Google' }
      ],
      required: true,
      initialValues: ['email']
    });

    if (p.isCancel(authMethods)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }
    answers.authMethods = authMethods;

    // Questions GitHub OAuth si sélectionné
    if (authMethods.includes('github')) {
      p.note(
        chalk.cyan('🔗 Créer une OAuth App:') + ' https://github.com/settings/developers\n' +
        chalk.gray('Callback URL: http://localhost:3000/api/auth/callback/github'),
        'Configuration GitHub OAuth'
      );

      const githubClientId = await p.text({
        message: 'GitHub OAuth Client ID',
        validate: (value) => {
          const result = validateClientId(value);
          return result === true ? undefined : result;
        }
      });

      if (p.isCancel(githubClientId)) {
        p.cancel('Installation annulée.');
        process.exit(0);
      }
      answers.githubClientId = githubClientId;

      const githubClientSecret = await p.password({
        message: 'GitHub OAuth Client Secret',
        validate: (value) => {
          const result = validateClientSecret(value);
          return result === true ? undefined : result;
        }
      });

      if (p.isCancel(githubClientSecret)) {
        p.cancel('Installation annulée.');
        process.exit(0);
      }
      answers.githubClientSecret = githubClientSecret;
    }

    // Questions Google OAuth si sélectionné
    if (authMethods.includes('google')) {
      p.note(
        chalk.cyan('🔗 Console Google Cloud:') + ' https://console.cloud.google.com/apis/credentials\n' +
        chalk.gray('Callback URL: http://localhost:3000/api/auth/callback/google'),
        'Configuration Google OAuth'
      );

      const googleClientId = await p.text({
        message: 'Google OAuth Client ID',
        validate: (value) => {
          const result = validateClientId(value);
          return result === true ? undefined : result;
        }
      });

      if (p.isCancel(googleClientId)) {
        p.cancel('Installation annulée.');
        process.exit(0);
      }
      answers.googleClientId = googleClientId;

      const googleClientSecret = await p.password({
        message: 'Google OAuth Client Secret',
        validate: (value) => {
          const result = validateClientSecret(value);
          return result === true ? undefined : result;
        }
      });

      if (p.isCancel(googleClientSecret)) {
        p.cancel('Installation annulée.');
        process.exit(0);
      }
      answers.googleClientSecret = googleClientSecret;
    }
  } else {
    answers.authMethods = [];
  }

  // 5. Stockage médias
  const storageEnabled = await p.select({
    message: 'Activer le stockage de fichiers médias ?',
    options: [
      { value: false, label: 'Non' },
      { value: true, label: 'Oui' }
    ],
    initialValue: false
  });

  if (p.isCancel(storageEnabled)) {
    p.cancel('Installation annulée.');
    process.exit(0);
  }
  answers.storageEnabled = storageEnabled;

  if (storageEnabled) {
    const storageType = await p.select({
      message: 'Type de stockage',
      options: [
        { value: 'minio', label: '🐳 MinIO local avec Docker', hint: 'Recommandé' },
        { value: 's3', label: '☁️  AWS S3' }
      ],
      initialValue: 'minio'
    });

    if (p.isCancel(storageType)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }
    answers.storageType = storageType;

    if (storageType === 's3') {
      const s3AccessKey = await p.text({
        message: 'AWS Access Key ID',
        validate: (value) => {
          const result = validateApiKey(value);
          return result === true ? undefined : result;
        }
      });

      if (p.isCancel(s3AccessKey)) {
        p.cancel('Installation annulée.');
        process.exit(0);
      }
      answers.s3AccessKey = s3AccessKey;

      const s3SecretKey = await p.password({
        message: 'AWS Secret Access Key',
        validate: (value) => {
          const result = validateApiKey(value);
          return result === true ? undefined : result;
        }
      });

      if (p.isCancel(s3SecretKey)) {
        p.cancel('Installation annulée.');
        process.exit(0);
      }
      answers.s3SecretKey = s3SecretKey;

      const s3Region = await p.text({
        message: 'AWS Region',
        placeholder: 'us-east-1',
        defaultValue: 'us-east-1'
      });

      if (p.isCancel(s3Region)) {
        p.cancel('Installation annulée.');
        process.exit(0);
      }
      answers.s3Region = s3Region;

      const s3Bucket = await p.text({
        message: 'Nom du bucket S3',
        validate: (input) => input.trim().length > 0 ? undefined : 'Nom requis'
      });

      if (p.isCancel(s3Bucket)) {
        p.cancel('Installation annulée.');
        process.exit(0);
      }
      answers.s3Bucket = s3Bucket;
    }
  }

  // 6. Emails
  const emailProvider = await p.select({
    message: 'Service d\'envoi d\'emails',
    options: [
      { value: 'skip', label: 'Ignorer pour le moment', hint: 'À configurer plus tard' },
      { value: 'resend', label: 'Resend', hint: 'Recommandé' },
      { value: 'smtp', label: 'SMTP personnalisé' }
    ],
    initialValue: 'skip'
  });

  if (p.isCancel(emailProvider)) {
    p.cancel('Installation annulée.');
    process.exit(0);
  }
  answers.emailProvider = emailProvider;

  if (emailProvider === 'resend') {
    p.note(
      chalk.cyan('🔗 Récupérer votre clé API:') + ' https://resend.com/api-keys',
      'Configuration Resend'
    );

    const resendApiKey = await p.password({
      message: 'Clé API Resend',
      validate: (value) => {
        const result = validateApiKey(value);
        return result === true ? undefined : result;
      }
    });

    if (p.isCancel(resendApiKey)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }
    answers.resendApiKey = resendApiKey;

    // Proposer Magic Link ou OTP si Resend est choisi
    if (!answers.skipAuth) {
      const additionalAuth = await p.confirm({
        message: 'Ajouter une méthode d\'authentification par email (Magic Link ou OTP) ?',
        initialValue: false
      });

      if (p.isCancel(additionalAuth)) {
        p.cancel('Installation annulée.');
        process.exit(0);
      }

      if (additionalAuth) {
        const emailAuthType = await p.select({
          message: 'Type d\'authentification par email',
          options: [
            { value: 'magiclink', label: 'Magic Link', hint: 'Lien de connexion par email' },
            { value: 'otp', label: 'OTP', hint: 'Code à usage unique' }
          ],
          initialValue: 'magiclink'
        });

        if (p.isCancel(emailAuthType)) {
          p.cancel('Installation annulée.');
          process.exit(0);
        }

        // Ajouter la méthode au tableau authMethods si elle n'existe pas déjà
        if (!answers.authMethods.includes(emailAuthType)) {
          answers.authMethods.push(emailAuthType);
        }
      }
    }

  } else if (emailProvider === 'smtp') {
    const smtpHost = await p.text({
      message: 'Hôte SMTP',
      validate: (value) => {
        const result = validateHostname(value);
        return result === true ? undefined : result;
      }
    });

    if (p.isCancel(smtpHost)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }
    answers.smtpHost = smtpHost;

    const smtpPort = await p.text({
      message: 'Port SMTP',
      placeholder: '587',
      defaultValue: '587',
      validate: (value) => {
        const result = validatePort(value);
        return result === true ? undefined : result;
      }
    });

    if (p.isCancel(smtpPort)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }
    answers.smtpPort = smtpPort;

    const smtpUser = await p.text({
      message: 'Utilisateur SMTP',
      validate: (value) => {
        const result = validateEmail(value);
        return result === true ? undefined : result;
      }
    });

    if (p.isCancel(smtpUser)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }
    answers.smtpUser = smtpUser;

    const smtpPassword = await p.password({
      message: 'Mot de passe SMTP',
      validate: (value) => {
        const result = validatePassword(value);
        return result === true ? undefined : result;
      }
    });

    if (p.isCancel(smtpPassword)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }
    answers.smtpPassword = smtpPassword;
  }

  // 7. Paiements
  const paymentsEnabled = await p.select({
    message: 'Activer les paiements Stripe ?',
    options: [
      { value: false, label: 'Non' },
      { value: true, label: 'Oui' }
    ],
    initialValue: false
  });

  if (p.isCancel(paymentsEnabled)) {
    p.cancel('Installation annulée.');
    process.exit(0);
  }
  answers.paymentsEnabled = paymentsEnabled;

  if (paymentsEnabled) {
    p.note(
      chalk.cyan('🔗 Récupérer vos clés API:') + ' https://dashboard.stripe.com/test/apikeys\n' +
      chalk.gray('Utiliser les clés de test pour le développement'),
      'Configuration Stripe'
    );

    const stripePublicKey = await p.password({
      message: 'Clé publique Stripe (pk_test_...)',
      validate: (input) => {
        if (!input || input.trim().length === 0) return 'Clé requise';
        if (!input.startsWith('pk_')) return 'Doit commencer par pk_';
        return undefined;
      }
    });

    if (p.isCancel(stripePublicKey)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }
    answers.stripePublicKey = stripePublicKey;

    const stripeSecretKey = await p.password({
      message: 'Clé secrète Stripe (sk_test_...)',
      validate: (input) => {
        if (!input || input.trim().length === 0) return 'Clé requise';
        if (!input.startsWith('sk_')) return 'Doit commencer par sk_';
        return undefined;
      }
    });

    if (p.isCancel(stripeSecretKey)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }
    answers.stripeSecretKey = stripeSecretKey;
  }

  // 8. Internationalisation - Langue par défaut
  const i18nDefaultLanguage = await p.select({
    message: 'Langue par défaut',
    options: [
      { value: 'fr', label: '🇫🇷 Français' },
      { value: 'en', label: '🇺🇸 Anglais' },
      { value: 'es', label: '🇪🇸 Espagnol' },
      { value: 'de', label: '🇩🇪 Allemand' }
    ],
    initialValue: 'fr'
  });

  if (p.isCancel(i18nDefaultLanguage)) {
    p.cancel('Installation annulée.');
    process.exit(0);
  }
  answers.i18nDefaultLanguage = i18nDefaultLanguage;

  // 9. Langues supplémentaires
  const allLanguages = [
    { value: 'fr', label: '🇫🇷 Français' },
    { value: 'en', label: '🇺🇸 Anglais' },
    { value: 'es', label: '🇪🇸 Espagnol' },
    { value: 'de', label: '🇩🇪 Allemand' }
  ];

  const availableLanguages = allLanguages.filter(lang => lang.value !== i18nDefaultLanguage);

  // Ajouter une option "Aucune" en premier
  const languageOptions = [
    { value: 'none', label: `Aucune (uniquement ${i18nDefaultLanguage})` },
    ...availableLanguages
  ];

  p.note(chalk.gray('💡 Espace = cocher/décocher • a = tout • Entrée = valider'), 'Astuce');

  const i18nLanguages = await p.multiselect({
    message: `Langues supplémentaires (langue par défaut : ${i18nDefaultLanguage})`,
    options: languageOptions,
    required: false,
    initialValues: ['none']
  });

  if (p.isCancel(i18nLanguages)) {
    p.cancel('Installation annulée.');
    process.exit(0);
  }

  // Si "none" est sélectionné, vider le tableau
  if (i18nLanguages.includes('none')) {
    answers.i18nLanguages = [];
  } else {
    answers.i18nLanguages = i18nLanguages;
  }

  // 10. IA pour utilisateurs finaux
  p.note(chalk.gray('💡 Espace = cocher/décocher • a = tout • Entrée = valider'), 'Astuce');

  const aiProviders = await p.multiselect({
    message: 'Souhaitez-vous proposer aux utilisateurs finaux de votre SAAS des fonctionnalités IA ?',
    options: [
      { value: 'none', label: 'Ignorer pour le moment' },
      { value: 'claude', label: 'Claude', hint: 'Anthropic' },
      { value: 'gemini', label: 'Gemini', hint: 'Google' },
      { value: 'openai', label: 'ChatGPT', hint: 'OpenAI' }
    ],
    required: false,
    initialValues: ['none']
  });

  if (p.isCancel(aiProviders)) {
    p.cancel('Installation annulée.');
    process.exit(0);
  }

  // Si "none" est sélectionné, vider le tableau
  if (aiProviders.includes('none')) {
    answers.aiProviders = [];
  } else {
    answers.aiProviders = aiProviders;
  }

  // Demander les clés API pour chaque IA sélectionnée
  if (answers.aiProviders.length > 0) {
    for (const provider of answers.aiProviders) {
      const providerName = provider === 'claude' ? 'Anthropic' : provider === 'openai' ? 'OpenAI' : 'Google';

      // Afficher le lien pour récupérer la clé API
      if (provider === 'claude') {
        p.note(
          chalk.cyan('🔗 Récupérer votre clé API:') + ' https://console.anthropic.com/settings/keys',
          'Configuration Claude (Anthropic)'
        );
      } else if (provider === 'openai') {
        p.note(
          chalk.cyan('🔗 Récupérer votre clé API:') + ' https://platform.openai.com/api-keys',
          'Configuration ChatGPT (OpenAI)'
        );
      } else if (provider === 'gemini') {
        p.note(
          chalk.cyan('🔗 Récupérer votre clé API:') + ' https://aistudio.google.com/app/apikey',
          'Configuration Gemini (Google)'
        );
      }

      const apiKey = await p.password({
        message: `Clé API ${providerName}`,
        validate: (value) => {
          const result = validateApiKey(value);
          return result === true ? undefined : result;
        }
      });

      if (p.isCancel(apiKey)) {
        p.cancel('Installation annulée.');
        process.exit(0);
      }
      answers[`${provider}ApiKey`] = apiKey;
    }
  }

  // 11. Claude Code
  const claudeCodeInstalled = await p.confirm({
    message: 'Avez-vous Claude Code CLI installé ?',
    initialValue: true
  });

  if (p.isCancel(claudeCodeInstalled)) {
    p.cancel('Installation annulée.');
    process.exit(0);
  }
  answers.claudeCodeInstalled = claudeCodeInstalled;

  // Animation finale
  const s = p.spinner();
  s.start('Préparation de votre configuration');
  await new Promise(resolve => setTimeout(resolve, 1500));
  s.stop('Configuration prête !');

  return answers;
}
