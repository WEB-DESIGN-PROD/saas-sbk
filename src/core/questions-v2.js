import * as p from '@clack/prompts';
import chalk from 'chalk';
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

${chalk.gray('Générateur de SaaS Next.js 16')}`));

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
  }

  // 4. Authentification (sauf si base de données ignorée)
  if (!answers.skipAuth) {
    const authMethods = await p.multiselect({
      message: 'Méthodes d\'authentification',
      options: [
        { value: 'email', label: 'Email/Mot de passe', hint: 'Recommandé' },
        { value: 'github', label: 'OAuth GitHub' },
        { value: 'magiclink', label: 'Magic Link', hint: 'Lien par email' }
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

  const i18nLanguages = await p.multiselect({
    message: `Langues supplémentaires (langue par défaut : ${i18nDefaultLanguage})`,
    options: availableLanguages,
    required: false
  });

  if (p.isCancel(i18nLanguages)) {
    p.cancel('Installation annulée.');
    process.exit(0);
  }
  answers.i18nLanguages = i18nLanguages;

  // 10. IA pour utilisateurs finaux
  const aiProviders = await p.multiselect({
    message: 'Quelles IA souhaitez-vous proposer à vos utilisateurs finaux ?',
    options: [
      { value: 'claude', label: 'Claude', hint: 'Anthropic' },
      { value: 'openai', label: 'ChatGPT', hint: 'OpenAI' },
      { value: 'gemini', label: 'Gemini', hint: 'Google' }
    ],
    required: false
  });

  if (p.isCancel(aiProviders)) {
    p.cancel('Installation annulée.');
    process.exit(0);
  }
  answers.aiProviders = aiProviders;

  // Demander les clés API pour chaque IA sélectionnée
  if (aiProviders.length > 0) {
    for (const provider of aiProviders) {
      const providerName = provider === 'claude' ? 'Anthropic' : provider === 'openai' ? 'OpenAI' : 'Google';

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
