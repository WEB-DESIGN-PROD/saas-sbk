import * as p from '@clack/prompts';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
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

// Récupérer la version depuis package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));
const version = packageJson.version;

/**
 * Centre une ligne de texte dans le terminal
 * Gère automatiquement les codes ANSI et s'adapte au redimensionnement
 */
function centerText(text) {
  // Utiliser la largeur actuelle du terminal avec fallback
  const terminalWidth = Math.max(process.stdout.columns || 80, 40);

  // Nettoyer tous les codes ANSI et séquences d'échappement pour calculer la longueur réelle
  const cleanText = text.replace(/\u001b\[[0-9;]*m/g, '').replace(/\u001b\]8;;.*?\u001b\\/g, '');
  const textLength = cleanText.length;

  // Si le texte est plus large que le terminal, ne pas centrer
  if (textLength >= terminalWidth) {
    return text;
  }

  // Calculer le padding pour centrer
  const padding = Math.floor((terminalWidth - textLength) / 2);
  return ' '.repeat(Math.max(0, padding)) + text;
}

/**
 * Crée un lien cliquable dans le terminal (OSC 8)
 */
function createLink(url, text, color = chalk.blue) {
  // Format: OSC 8 ; ; URL ST TEXT OSC 8 ; ; ST
  return `\x1b]8;;${url}\x1b\\${color(text)}\x1b]8;;\x1b\\`;
}

/**
 * Affiche le logo et les réponses validées de façon compacte
 */
function showHeader(answers = {}) {
  console.clear();

  // Logo ASCII centré
  const logoLines = [
    ' _____________________________    _____________________ __',
    '__  ___/__    |__    |_  ___/    __  ___/__  __ )__  //_/',
    '_____ \\__  /| |_  /| |____ \\     _____ \\__  __  |_  ,<',
    '____/ /_  ___ |  ___ |___/ /     ____/ /_  /_/ /_  /| |',
    '/____/ /_/  |_/_/  |_/____/      /____/ /_____/ /_/ |_|'
  ];

  console.log('');
  logoLines.forEach(line => {
    console.log(centerText(chalk.cyan(line)));
  });
  console.log('');

  // Baselines centrées
  const baseline1 = chalk.gray(`Générateur de SAAS Next.js • v${version}`);
  const githubIcon = ''; // Logo GitHub (Nerd Font)
  const githubLink = createLink('https://github.com/WEB-DESIGN-PROD/saas-sbk/issues', `${githubIcon} GitHub`, chalk.blue);

  // Pour le centrage de la baseline2, on calcule manuellement
  const baseline2VisibleText = `Signaler un problème sur ${githubIcon} GitHub`;
  const terminalWidth = process.stdout.columns || 80;
  const padding = Math.max(0, Math.floor((terminalWidth - baseline2VisibleText.length) / 2));
  const baseline2 = ' '.repeat(padding) + chalk.gray('Signaler un problème sur ') + githubLink;

  console.log(centerText(baseline1));
  console.log(baseline2);
  console.log('');

  // Afficher les réponses validées sur 2 colonnes
  if (Object.keys(answers).length > 0) {
    // Bordure avec titre centré sur la même ligne
    const terminalWidth = process.stdout.columns || 80;
    const title = ' Récap\' de votre SAAS ';
    const titleLength = title.length;
    const remainingSpace = Math.max(0, terminalWidth - titleLength);
    const leftBorder = '─'.repeat(Math.floor(remainingSpace / 2));
    const rightBorder = '─'.repeat(Math.ceil(remainingSpace / 2));
    const headerLine = chalk.gray(leftBorder) + chalk.gray(title) + chalk.gray(rightBorder);

    console.log(headerLine);
    console.log(''); // Padding du haut

    const leftChoices = [];
    const rightChoices = [];

    // Colonne gauche : Projet, Thème, BDD, Auth, Stockage
    if (answers.projectName) {
      leftChoices.push(chalk.green(figures.tick) + ' Projet : ' + chalk.cyan(answers.projectName));
    }
    if (answers.theme) {
      leftChoices.push(chalk.green(figures.tick) + ' Thème : ' + chalk.cyan(answers.theme === 'dark' ? 'Sombre' : 'Clair'));
    }
    if (answers.databaseType) {
      let dbDisplay = 'Distant ☁️';
      if (answers.databaseType === 'docker') dbDisplay = 'PostgreSQL 🐳';
      else if (answers.databaseType === 'skip') dbDisplay = 'Aucune';
      else if (answers.databaseType === 'mongodb-local') dbDisplay = 'MongoDB 🐳';
      else if (answers.databaseType === 'mongodb-remote') dbDisplay = 'MongoDB ☁️';
      else if (answers.databaseType === 'sqlite') dbDisplay = 'SQLite';

      leftChoices.push(chalk.green(figures.tick) + ' Base de données : ' + chalk.cyan(dbDisplay));
    }
    if (answers.authMethods && answers.authMethods.length > 0) {
      // Afficher uniquement Email, GitHub, Google (pas Magic Link ni OTP qui sont dans Email)
      const methodNames = {
        'email': 'Email',
        'github': 'GitHub',
        'google': 'Google'
      };
      const authMethodsFiltered = answers.authMethods.filter(m => ['email', 'github', 'google'].includes(m));
      if (authMethodsFiltered.length > 0) {
        const authDisplay = authMethodsFiltered.map(m => methodNames[m] || m).join(' + ');
        leftChoices.push(chalk.green(figures.tick) + ' Auth : ' + chalk.cyan(authDisplay));
      }
    }
    if (answers.storageEnabled !== undefined) {
      let storageDisplay = 'Désactivé';
      if (answers.storageEnabled) {
        if (answers.storageType === 'minio') storageDisplay = 'MinIO 🐳';
        else if (answers.storageType === 's3') storageDisplay = 'AWS S3 ☁️';
      }
      leftChoices.push(chalk.green(figures.tick) + ' Stockage : ' + chalk.cyan(storageDisplay));
    }

    // Colonne droite : Email, Paiements, I18n, IA, Claude Code
    if (answers.emailProvider !== undefined) {
      let provider = 'Plus tard';
      if (answers.emailProvider === 'resend') {
        provider = 'Resend';
        // Ajouter Magic Link ou OTP si présent
        if (answers.authMethods?.includes('magiclink')) provider += ' + Magic Link';
        else if (answers.authMethods?.includes('otp')) provider += ' + OTP';
      } else if (answers.emailProvider === 'smtp') {
        provider = 'SMTP';
      }
      rightChoices.push(chalk.green(figures.tick) + ' Email : ' + chalk.cyan(provider));
    }
    if (answers.paymentsEnabled !== undefined) {
      const paymentsDisplay = answers.paymentsEnabled ? 'Stripe' : 'Désactivé';
      rightChoices.push(chalk.green(figures.tick) + ' Paiements : ' + chalk.cyan(paymentsDisplay));
    }
    if (answers.i18nDefaultLanguage) {
      const allLangs = [answers.i18nDefaultLanguage.toUpperCase(), ...(answers.i18nLanguages?.map(l => l.toUpperCase()) || [])];
      rightChoices.push(chalk.green(figures.tick) + ' I18n : ' + chalk.cyan(allLangs.join(', ')));
    }
    if (answers.aiProviders !== undefined) {
      const aiDisplay = answers.aiProviders.length === 0 ? 'Aucune' :
                       answers.aiProviders.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');
      rightChoices.push(chalk.green(figures.tick) + ' IA : ' + chalk.cyan(aiDisplay));
    }
    if (answers.claudeCodeInstalled !== undefined) {
      rightChoices.push(chalk.green(figures.tick) + ' Claude Code : ' + chalk.cyan(answers.claudeCodeInstalled ? 'Oui' : 'Non'));
    }

    // Afficher sur 2 colonnes
    const maxLines = Math.max(leftChoices.length, rightChoices.length);
    const columnWidth = 55;

    for (let i = 0; i < maxLines; i++) {
      const left = leftChoices[i] || '';
      const right = rightChoices[i] || '';

      // Calculer le padding pour aligner les colonnes
      const leftStripped = left.replace(/\u001b\[[0-9;]*m/g, '');
      const padding = ' '.repeat(Math.max(0, columnWidth - leftStripped.length));

      console.log(left + padding + right);
    }

    console.log(''); // Padding du bas
    // Bordure du bas pleine largeur
    const bottomBorder = '─'.repeat(terminalWidth);
    console.log(chalk.gray(bottomBorder));
    console.log('');
  }
}

/**
 * Pose toutes les questions avec l'interface moderne de @clack/prompts
 */
export async function askQuestions() {
  const answers = {};

  // 1. Nom du projet
  showHeader(answers);
  const projectName = await p.text({
    message: 'Nom du projet',
    placeholder: 'my-saas',
    initialValue: 'my-saas',
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

  // 2. Base de données avec boucle pour confirmation si "skip"
  let databaseConfigured = false;
  while (!databaseConfigured) {
    showHeader(answers);
    const databaseType = await p.select({
      message: 'Configuration de la base de données',
      options: [
        { value: 'docker', label: '🐳 PostgreSQL local avec Docker', hint: 'Recommandé' },
        { value: 'remote', label: '   PostgreSQL distant', hint: 'Neon, Supabase, etc.' },
        { value: 'mongodb-local', label: '🐳 MongoDB local avec Docker' },
        { value: 'mongodb-remote', label: '   MongoDB distant', hint: 'Atlas, etc.' },
        { value: 'sqlite', label: '   SQLite', hint: 'Fichier local' },
        { value: 'skip', label: '   Ignorer pour l\'instant', hint: 'À configurer plus tard' }
      ],
      initialValue: 'docker'
    });

    if (p.isCancel(databaseType)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }

    // Si skip, afficher avertissement et demander confirmation
    if (databaseType === 'skip') {
      showHeader(answers);
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
    showHeader(answers);
    const databaseUser = await p.text({
      message: 'Nom d\'utilisateur PostgreSQL',
      placeholder: 'postgres',
      initialValue: 'postgres',
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

    showHeader(answers);
    p.note(chalk.gray('💡 Le mot de passe "postgres" est déjà saisi, appuyez sur Entrée pour le valider'), 'Astuce');

    const databasePassword = await p.password({
      message: 'Mot de passe PostgreSQL',
      initialValue: 'postgres',
      validate: (value) => {
        // Si vide, utiliser "postgres" par défaut
        if (!value || value.trim().length === 0) {
          return undefined; // Accepter vide, on mettra "postgres" après
        }
        const result = validatePassword(value);
        return result === true ? undefined : result;
      }
    });

    if (p.isCancel(databasePassword)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }
    // Si vide, utiliser "postgres" par défaut
    answers.databasePassword = databasePassword || 'postgres';

    showHeader(answers);
    const databaseName = await p.text({
      message: 'Nom de la base de données',
      placeholder: answers.projectName.replace(/-/g, '_'),
      initialValue: answers.projectName.replace(/-/g, '_'),
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
    showHeader(answers);
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
    showHeader(answers);
    p.note(
      chalk.cyan('🔗 MongoDB Atlas:') + ' https://cloud.mongodb.com/',
      'Lien utile pour MongoDB distant'
    );
  }

  // 4. Authentification (sauf si base de données ignorée)
  if (!answers.skipAuth) {
    showHeader(answers);
    p.note(chalk.gray('💡 Espace = cocher/décocher • a = tout sélectionner • Entrée = valider'), 'Astuce');

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
      showHeader(answers);
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

      showHeader(answers);
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
      showHeader(answers);
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

      showHeader(answers);
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
  showHeader(answers);
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
    showHeader(answers);
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
      showHeader(answers);
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

      showHeader(answers);
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

      showHeader(answers);
      const s3Region = await p.text({
        message: 'AWS Region',
        placeholder: 'us-east-1',
        initialValue: 'us-east-1'
      });

      if (p.isCancel(s3Region)) {
        p.cancel('Installation annulée.');
        process.exit(0);
      }
      answers.s3Region = s3Region;

      showHeader(answers);
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
  showHeader(answers);
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
    showHeader(answers);
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
      showHeader(answers);
      const additionalAuth = await p.confirm({
        message: 'Ajouter une méthode d\'authentification par email (Magic Link ou OTP) ?',
        initialValue: false
      });

      if (p.isCancel(additionalAuth)) {
        p.cancel('Installation annulée.');
        process.exit(0);
      }

      if (additionalAuth) {
        showHeader(answers);
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
    showHeader(answers);
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

    showHeader(answers);
    const smtpPort = await p.text({
      message: 'Port SMTP',
      placeholder: '587',
      initialValue: '587',
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

    showHeader(answers);
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

    showHeader(answers);
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
  showHeader(answers);
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
    showHeader(answers);
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

    showHeader(answers);
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
  showHeader(answers);
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

  // 9. Langues supplémentaires - d'abord demander si l'utilisateur en veut
  showHeader(answers);

  const wantsMoreLanguages = await p.confirm({
    message: 'Voulez-vous ajouter d\'autres langues ?',
    initialValue: false
  });

  if (p.isCancel(wantsMoreLanguages)) {
    p.cancel('Installation annulée.');
    process.exit(0);
  }

  if (wantsMoreLanguages) {
    // Proposer les langues disponibles (sans la langue par défaut, sans option "Aucune")
    const allLanguages = [
      { value: 'en', label: '🇺🇸 Anglais' },
      { value: 'es', label: '🇪🇸 Espagnol' },
      { value: 'de', label: '🇩🇪 Allemand' },
      { value: 'fr', label: '🇫🇷 Français' }
    ];

    const availableLanguages = allLanguages.filter(lang => lang.value !== i18nDefaultLanguage);

    // Pré-cocher US (Anglais) par défaut, sauf si c'est déjà la langue par défaut
    const defaultLanguages = i18nDefaultLanguage !== 'en' && availableLanguages.some(l => l.value === 'en')
      ? ['en']
      : [];

    showHeader(answers);
    p.note(chalk.gray('💡 Espace = cocher/décocher • a = tout sélectionner • Entrée = valider'), 'Astuce');

    const i18nLanguages = await p.multiselect({
      message: `Sélectionnez les langues supplémentaires (langue par défaut : ${i18nDefaultLanguage})`,
      options: availableLanguages,
      required: false,
      initialValues: defaultLanguages
    });

    if (p.isCancel(i18nLanguages)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }

    answers.i18nLanguages = i18nLanguages;
  } else {
    // Pas de langues supplémentaires
    answers.i18nLanguages = [];
  }

  // 10. IA pour utilisateurs finaux - d'abord demander si l'utilisateur en veut
  showHeader(answers);

  const wantsAI = await p.confirm({
    message: 'Souhaitez-vous proposer aux utilisateurs finaux de votre SAAS des fonctionnalités IA ?',
    initialValue: false
  });

  if (p.isCancel(wantsAI)) {
    p.cancel('Installation annulée.');
    process.exit(0);
  }

  if (wantsAI) {
    // Proposer le choix des providers IA
    showHeader(answers);
    p.note(chalk.gray('💡 Espace = cocher/décocher • a = tout sélectionner • Entrée = valider'), 'Astuce');

    const aiProviders = await p.multiselect({
      message: 'Sélectionnez les providers IA à intégrer',
      options: [
        { value: 'claude', label: 'Claude', hint: 'Anthropic' },
        { value: 'openai', label: 'ChatGPT', hint: 'OpenAI' },
        { value: 'gemini', label: 'Gemini', hint: 'Google' }
      ],
      required: true,
      initialValues: ['claude']
    });

    if (p.isCancel(aiProviders)) {
      p.cancel('Installation annulée.');
      process.exit(0);
    }

    answers.aiProviders = Array.isArray(aiProviders) ? aiProviders : [];

    // Demander les clés API pour chaque IA sélectionnée
    if (answers.aiProviders.length > 0) {
      for (const provider of answers.aiProviders) {
        const providerName = provider === 'claude' ? 'Anthropic' : provider === 'openai' ? 'OpenAI' : 'Google';

        showHeader(answers);

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
  } else {
    // Pas de fonctionnalités IA
    answers.aiProviders = [];
  }

  // 11. Thème
  showHeader(answers);
  const theme = await p.select({
    message: 'Pour l\'interface du SAAS, quel thème désirez-vous par défaut ?',
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

  // 12. Claude Code
  showHeader(answers);
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
  showHeader(answers);
  const s = p.spinner();
  s.start('Préparation de votre configuration');
  await new Promise(resolve => setTimeout(resolve, 1500));
  s.stop('Configuration prête !');

  return answers;
}
