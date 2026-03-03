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

// Sentinel pour signaler un retour arrière
const BACK = 'BACK';

/**
 * Centre une ligne de texte dans le terminal
 */
function centerText(text) {
  const terminalWidth = Math.max(process.stdout.columns || 80, 40);
  const cleanText = text.replace(/\u001b\[[0-9;]*m/g, '').replace(/\u001b\]8;;.*?\u001b\\/g, '');
  const textLength = cleanText.length;
  if (textLength >= terminalWidth) return text;
  const padding = Math.floor((terminalWidth - textLength) / 2);
  return ' '.repeat(Math.max(0, padding)) + text;
}

/**
 * Crée un lien cliquable dans le terminal (OSC 8)
 */
function createLink(url, text, color = chalk.blue) {
  return `\x1b]8;;${url}\x1b\\${color(text)}\x1b]8;;\x1b\\`;
}

/**
 * Affiche le logo et les réponses validées de façon compacte
 */
function showHeader(answers = {}) {
  console.clear();

  const logoLines = [
    '███████╗ █████╗  █████╗ ███████╗    ███████╗██████╗ ██╗  ██╗',
    '██╔════╝██╔══██╗██╔══██╗██╔════╝    ██╔════╝██╔══██╗██║ ██╔╝',
    '███████╗███████║███████║███████╗    ███████╗██████╔╝█████╔╝',
    '╚════██║██╔══██║██╔══██║╚════██║    ╚════██║██╔══██╗██╔═██╗',
    '███████║██║  ██║██║  ██║███████║    ███████║██████╔╝██║  ██╗',
    '╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝    ╚══════╝╚═════╝ ╚═╝  ╚═╝'
  ];

  const grad = [
    [6, 182, 212],
    [99, 102, 241],
    [139, 92, 246],
  ];
  const maxLen = Math.max(...logoLines.map(l => l.length));
  const toHex = (r, g, b) => `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;

  const gradColor = (t) => {
    const scaled = t * (grad.length - 1);
    const idx = Math.min(Math.floor(scaled), grad.length - 2);
    const localT = scaled - idx;
    const [r, g, b] = grad[idx].map((v, i) => Math.round(v + (grad[idx + 1][i] - v) * localT));
    return [r, g, b];
  };

  const styleLine = (line) => line.split('').map((char, i) => {
    const t = maxLen > 1 ? i / (maxLen - 1) : 0;
    const [r, g, b] = gradColor(t);
    if (char === '█') return chalk.hex(toHex(r, g, b))(char);
    if ('╗╝╔╚╦╩╣╠╬═║╓╖╜╙╒╕╘╛╟╞'.includes(char)) return chalk.hex(toHex(Math.round(r*0.4), Math.round(g*0.4), Math.round(b*0.4)))(char);
    return char;
  }).join('');

  console.log('');
  logoLines.forEach(line => {
    console.log(centerText(styleLine(line)));
  });
  console.log('');

  const baseline1 = chalk.gray(`Générateur de SAAS Next.js • v${version}`);
  console.log(centerText(baseline1));
  console.log('');

  // Afficher les réponses validées sur 2 colonnes
  if (Object.keys(answers).length > 0) {
    const terminalWidth = process.stdout.columns || 80;
    const title = ' Récap\' de votre SAAS ';
    const titleLength = title.length;
    const remainingSpace = Math.max(0, terminalWidth - titleLength);
    const leftBorder = '─'.repeat(Math.floor(remainingSpace / 2));
    const rightBorder = '─'.repeat(Math.ceil(remainingSpace / 2));
    const headerLine = chalk.gray(leftBorder) + chalk.gray(title) + chalk.gray(rightBorder);

    console.log(headerLine);
    console.log('');

    const leftChoices = [];
    const rightChoices = [];

    // ── Colonne gauche : Projet, BDD, Auth, Stockage, Email, Paiements ──────────
    if (answers.projectName) {
      leftChoices.push(chalk.green(figures.tick) + ' Projet        : ' + chalk.cyan(answers.projectName));
    }
    if (answers.databaseType) {
      let dbDisplay = 'Distant ☁️';
      if (answers.databaseType === 'docker') dbDisplay = 'PostgreSQL 🐳';
      else if (answers.databaseType === 'skip') dbDisplay = 'Aucune';
      leftChoices.push(chalk.green(figures.tick) + ' Base de données: ' + chalk.cyan(dbDisplay));
    }
    if (answers.authMethods && answers.authMethods.length > 0) {
      const methodNames = {
        'email': 'Email + Mdp',
        'magiclink': 'Magic Link',
        'otp': 'OTP',
        'github': 'GitHub',
        'google': 'Google'
      };
      const authDisplay = answers.authMethods.map(m => methodNames[m] || m).join(' + ');
      leftChoices.push(chalk.green(figures.tick) + ' Auth          : ' + chalk.cyan(authDisplay));
    }
    if (answers.storageEnabled !== undefined) {
      let storageDisplay = 'Désactivé';
      if (answers.storageEnabled) {
        if (answers.storageType === 'minio') storageDisplay = 'MinIO 🐳';
        else if (answers.storageType === 'vercel-blob') storageDisplay = 'Vercel Blob';
        else if (answers.storageType === 's3') storageDisplay = 'AWS S3 ☁️';
      }
      leftChoices.push(chalk.green(figures.tick) + ' Stockage      : ' + chalk.cyan(storageDisplay));
    }
    if (answers.emailProvider !== undefined) {
      let provider = 'Plus tard';
      if (answers.emailProvider === 'resend') provider = 'Resend';
      else if (answers.emailProvider === 'smtp') provider = 'SMTP';
      leftChoices.push(chalk.green(figures.tick) + ' Email         : ' + chalk.cyan(provider));
    }
    if (answers.paymentsEnabled !== undefined) {
      const paymentsDisplay = answers.paymentsEnabled ? 'Stripe' : 'Désactivé';
      leftChoices.push(chalk.green(figures.tick) + ' Paiements     : ' + chalk.cyan(paymentsDisplay));
    }

    // ── Colonne droite : Thème, I18n, IA, Super Admin, Type SaaS, Claude Code ──
    if (answers.theme) {
      rightChoices.push(chalk.green(figures.tick) + ' Thème        : ' + chalk.cyan(answers.theme === 'dark' ? 'Sombre' : 'Clair'));
    }
    if (answers.i18nDefaultLanguage) {
      const allLangs = [answers.i18nDefaultLanguage.toUpperCase(), ...(answers.i18nLanguages?.map(l => l.toUpperCase()) || [])];
      rightChoices.push(chalk.green(figures.tick) + ' I18n         : ' + chalk.cyan(allLangs.join(', ')));
    }
    if (answers.aiProviders !== undefined) {
      const aiDisplay = answers.aiProviders.length === 0 ? 'Aucune' :
                       answers.aiProviders.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');
      rightChoices.push(chalk.green(figures.tick) + ' IA           : ' + chalk.cyan(aiDisplay));
    }
    if (answers.wantsAdmin !== undefined) {
      const adminDisplay = answers.wantsAdmin ? 'Activé' : 'Non';
      rightChoices.push(chalk.green(figures.tick) + ' Super Admin  : ' + chalk.cyan(adminDisplay));
    }
    if (answers.saasType !== undefined) {
      rightChoices.push(chalk.green(figures.tick) + ' Type SaaS    : ' + chalk.cyan(answers.saasType === 'blog' ? 'Blog' : 'Default'));
    }
    if (answers.claudeCodeInstalled !== undefined) {
      rightChoices.push(chalk.green(figures.tick) + ' Claude Code  : ' + chalk.cyan(answers.claudeCodeInstalled ? 'Oui' : 'Non'));
    }

    // Afficher sur 2 colonnes
    const maxLines = Math.max(leftChoices.length, rightChoices.length);
    const columnWidth = 55;

    for (let i = 0; i < maxLines; i++) {
      const left = leftChoices[i] || '';
      const right = rightChoices[i] || '';
      const leftStripped = left.replace(/\u001b\[[0-9;]*m/g, '');
      const padding = ' '.repeat(Math.max(0, columnWidth - leftStripped.length));
      console.log(left + padding + right);
    }

    console.log('');
    const bottomBorder = '─'.repeat(terminalWidth);
    console.log(chalk.gray(bottomBorder));

    // Hint de navigation court et centré
    console.log(centerText(chalk.dim('← Étape précédente  •  Ctrl+C : Quitter')));
    console.log('');
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function cancelIfCancel(value) {
  if (p.isCancel(value)) {
    p.cancel('Installation annulée.');
    process.exit(0);
  }
}

/**
 * Wrapper autour de p.select qui intercepte la flèche gauche (←) pour déclencher un retour arrière.
 * La flèche gauche injecte un Ctrl+C dans stdin, ce qui annule le prompt @clack.
 * Un flag `backTriggered` distingue ce retour d'un vrai Ctrl+C utilisateur.
 *
 * ⚠️  Ne PAS utiliser avec p.confirm — la flèche gauche/droite y sert à basculer Oui/Non.
 */
async function selectWithBack(options) {
  let backTriggered = false;
  const onData = (chunk) => {
    if (backTriggered) return;
    if (chunk.toString() === '\x1b[D') {
      backTriggered = true;
      process.stdin.push(Buffer.from('\x03')); // injecte Ctrl+C → annule le prompt
    }
  };
  process.stdin.prependListener('data', onData);
  const result = await p.select(options);
  process.stdin.removeListener('data', onData);
  if (backTriggered && p.isCancel(result)) return BACK;
  return result;
}

// ── Étape 0 : Nom du projet ──────────────────────────────────────────────────

async function stepProjectName(answers) {
  showHeader(answers);
  p.note(
    'Les informations saisies serviront à générer votre fichier .env\n' +
    'Vous pourrez les modifier à tout moment dans ce fichier après génération.',
    'Info'
  );
  const projectName = await p.text({
    message: 'Nom du projet',
    placeholder: 'my-saas',
    initialValue: 'my-saas',
    validate: (value) => {
      const result = validateProjectName(value);
      return result === true ? undefined : result;
    }
  });
  cancelIfCancel(projectName);
  answers.projectName = projectName;
  return 'done';
}

// ── Étape 1 : Base de données ────────────────────────────────────────────────

async function stepDatabase(answers) {
  // Reset des clés gérées par cette étape
  delete answers.databaseUser;
  delete answers.databasePassword;
  delete answers.databaseName;
  delete answers.databaseUrl;
  delete answers.skipAuth;

  while (true) {
    showHeader(answers);
    const databaseType = await selectWithBack({
      message: 'Configuration de la base de données',
      options: [
        { value: 'docker', label: '🐳 PostgreSQL local avec Docker', hint: 'Recommandé' },
        { value: 'remote', label: '   PostgreSQL distant', hint: 'Neon, Supabase, etc.' },
        { value: 'mongodb-local', label: '🐳 MongoDB — Coming Soon', hint: 'Disponible prochainement', disabled: true },
        { value: 'mongodb-remote', label: '   MongoDB distant — Coming Soon', hint: 'Disponible prochainement', disabled: true },
        { value: 'sqlite', label: '   SQLite — Coming Soon', hint: 'Disponible prochainement', disabled: true },
        { value: 'skip', label: '   Ignorer pour l\'instant', hint: 'À configurer plus tard' },
      ],
      initialValue: 'docker'
    });
    cancelIfCancel(databaseType);
    if (databaseType === BACK) return BACK;

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
      cancelIfCancel(confirmSkip);
      if (confirmSkip) {
        answers.databaseType = databaseType;
        answers.skipAuth = true;
        return 'done';
      }
      // Sinon reboucle
      continue;
    }

    answers.databaseType = databaseType;

    if (databaseType === 'docker') {
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
      cancelIfCancel(databaseUser);
      answers.databaseUser = databaseUser;

      showHeader(answers);
      p.note(chalk.gray('💡 Le mot de passe "postgres" est déjà saisi. Entrée = valider'), 'Astuce');
      const databasePassword = await p.password({
        message: 'Mot de passe PostgreSQL',
        initialValue: 'postgres',
        validate: (value) => {
          if (!value || value.trim().length === 0) return undefined;
          const result = validatePassword(value);
          return result === true ? undefined : result;
        }
      });
      cancelIfCancel(databasePassword);
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
      cancelIfCancel(databaseName);
      answers.databaseName = databaseName;

    } else if (databaseType === 'remote') {
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
      cancelIfCancel(databaseUrl);
      answers.databaseUrl = databaseUrl;
    }

    return 'done';
  }
}

// ── Étape 2 : Authentification OAuth ────────────────────────────────────────

async function stepAuth(answers) {
  // Reset des clés OAuth gérées par cette étape
  delete answers.githubClientId;
  delete answers.githubClientSecret;
  delete answers.googleClientId;
  delete answers.googleClientSecret;
  // Garder seulement les méthodes OAuth pré-existantes (pas email/magiclink/otp)
  answers.authMethods = [];

  if (answers.skipAuth) {
    return 'done';
  }

  showHeader(answers);
  p.note(chalk.gray('💡 Espace = cocher/décocher • a = tout sélectionner • Entrée = valider'), 'Astuce');

  const authMethods = await p.multiselect({
    message: 'Méthodes d\'authentification',
    options: [
      { value: 'email', label: 'Email + mot de passe (Better Auth)', hint: 'Toujours inclus' },
      { value: 'github', label: 'OAuth GitHub', hint: 'Optionnel' },
      { value: 'google', label: 'OAuth Google', hint: 'Optionnel' }
    ],
    initialValues: ['email'],
    required: false
  });

  if (p.isCancel(authMethods)) {
    // Ctrl+C sur un multiselect = retour arrière
    return BACK;
  }
  answers.authMethods = authMethods;

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
    cancelIfCancel(githubClientId);
    answers.githubClientId = githubClientId;

    showHeader(answers);
    const githubClientSecret = await p.password({
      message: 'GitHub OAuth Client Secret',
      validate: (value) => {
        const result = validateClientSecret(value);
        return result === true ? undefined : result;
      }
    });
    cancelIfCancel(githubClientSecret);
    answers.githubClientSecret = githubClientSecret;
  }

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
    cancelIfCancel(googleClientId);
    answers.googleClientId = googleClientId;

    showHeader(answers);
    const googleClientSecret = await p.password({
      message: 'Google OAuth Client Secret',
      validate: (value) => {
        const result = validateClientSecret(value);
        return result === true ? undefined : result;
      }
    });
    cancelIfCancel(googleClientSecret);
    answers.googleClientSecret = googleClientSecret;
  }

  return 'done';
}

// ── Étape 3 : Stockage médias ────────────────────────────────────────────────

async function stepStorage(answers) {
  delete answers.storageType;

  showHeader(answers);
  const storageEnabled = await selectWithBack({
    message: 'Activer le stockage de fichiers médias ?',
    options: [
      { value: false, label: 'Non' },
      { value: true, label: 'Oui' },
    ],
    initialValue: false
  });
  cancelIfCancel(storageEnabled);
  if (storageEnabled === BACK) return BACK;
  answers.storageEnabled = storageEnabled;

  if (storageEnabled) {
    showHeader(answers);
    const storageType = await selectWithBack({
      message: 'Type de stockage',
      options: [
        { value: 'minio', label: '🐳 MinIO local avec Docker', hint: 'Recommandé' },
        { value: 'vercel-blob', label: '   Vercel Blob — Coming Soon', hint: 'Disponible prochainement', disabled: true },
        { value: 's3', label: '   AWS S3 — Coming Soon', hint: 'Disponible prochainement', disabled: true },
      ],
      initialValue: 'minio'
    });
    cancelIfCancel(storageType);
    if (storageType === BACK) return BACK;
    answers.storageType = storageType;
  }

  return 'done';
}

// ── Étape 4 : Service d'emails ───────────────────────────────────────────────

async function stepEmail(answers) {
  delete answers.resendApiKey;
  delete answers.emailFrom;
  delete answers.smtpHost;
  delete answers.smtpPort;
  delete answers.smtpUser;
  delete answers.smtpPassword;

  showHeader(answers);
  const emailProvider = await selectWithBack({
    message: 'Service d\'envoi d\'emails',
    options: [
      { value: 'resend', label: 'Resend', hint: 'Recommandé' },
      { value: 'smtp', label: 'SMTP personnalisé' },
      { value: 'skip', label: 'Ignorer pour le moment', hint: 'À configurer plus tard' },
    ],
    initialValue: 'resend'
  });
  cancelIfCancel(emailProvider);
  if (emailProvider === BACK) return BACK;
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
    cancelIfCancel(resendApiKey);
    answers.resendApiKey = resendApiKey;

    showHeader(answers);
    p.note(
      chalk.yellow('💡 Astuce :') + ' L\'adresse doit utiliser un domaine\n' +
      '   vérifié dans votre compte Resend.\n' +
      '   Ex : ' + chalk.cyan('noreply@votre-domaine.com') + '\n\n' +
      chalk.dim('   Vérifier vos domaines : https://resend.com/domains'),
      'Adresse expéditeur'
    );
    const emailFrom = await p.text({
      message: 'Adresse email expéditeur',
      placeholder: `noreply@${answers.projectName}.com`,
      initialValue: `noreply@${answers.projectName}.com`,
      validate: (value) => {
        const result = validateEmail(value);
        return result === true ? undefined : result;
      }
    });
    cancelIfCancel(emailFrom);
    answers.emailFrom = emailFrom;

  } else if (emailProvider === 'smtp') {
    showHeader(answers);
    const smtpHost = await p.text({
      message: 'Hôte SMTP',
      validate: (value) => {
        const result = validateHostname(value);
        return result === true ? undefined : result;
      }
    });
    cancelIfCancel(smtpHost);
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
    cancelIfCancel(smtpPort);
    answers.smtpPort = smtpPort;

    showHeader(answers);
    const smtpUser = await p.text({
      message: 'Utilisateur SMTP',
      validate: (value) => {
        const result = validateEmail(value);
        return result === true ? undefined : result;
      }
    });
    cancelIfCancel(smtpUser);
    answers.smtpUser = smtpUser;

    showHeader(answers);
    const smtpPassword = await p.password({
      message: 'Mot de passe SMTP',
      validate: (value) => {
        const result = validatePassword(value);
        return result === true ? undefined : result;
      }
    });
    cancelIfCancel(smtpPassword);
    answers.smtpPassword = smtpPassword;
  }

  return 'done';
}

// ── Étape 5 : Méthode de connexion ──────────────────────────────────────────

async function stepLoginMethod(answers) {
  // Reset
  delete answers.loginMethod;
  // Garder uniquement les méthodes OAuth (supprimer email/magiclink/otp précédemment ajoutés)
  answers.authMethods = (answers.authMethods || []).filter(m => m === 'github' || m === 'google');

  if (answers.skipAuth) {
    return 'done';
  }

  // Email/password toujours présent pour l'inscription
  if (!answers.authMethods.includes('email')) {
    answers.authMethods.push('email');
  }

  const hasEmailProvider = answers.emailProvider === 'resend' || answers.emailProvider === 'smtp';

  if (!hasEmailProvider) {
    answers.loginMethod = 'email-password';
    return 'done';
  }

  showHeader(answers);
  const loginMethod = await selectWithBack({
    message: 'Méthode de connexion (après création de compte)',
    options: [
      { value: 'magiclink', label: 'Magic Link', hint: 'Lien de connexion envoyé par email' },
      { value: 'otp', label: 'Code OTP', hint: 'Code à usage unique envoyé par email' },
      { value: 'email-password', label: 'Email + Mot de passe', hint: 'Formulaire email + mot de passe' },
    ],
    initialValue: 'magiclink'
  });
  cancelIfCancel(loginMethod);
  if (loginMethod === BACK) return BACK;

  answers.loginMethod = loginMethod;
  if (loginMethod === 'magiclink') answers.authMethods.push('magiclink');
  else if (loginMethod === 'otp') answers.authMethods.push('otp');

  return 'done';
}

// ── Étape 6 : Paiements Stripe ───────────────────────────────────────────────

async function stepPayments(answers) {
  delete answers.stripePublicKey;
  delete answers.stripeSecretKey;

  showHeader(answers);
  const paymentsEnabled = await selectWithBack({
    message: 'Activer les paiements Stripe ?',
    options: [
      { value: false, label: 'Non' },
      { value: true, label: 'Oui' },
    ],
    initialValue: false
  });
  cancelIfCancel(paymentsEnabled);
  if (paymentsEnabled === BACK) return BACK;
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
    cancelIfCancel(stripePublicKey);
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
    cancelIfCancel(stripeSecretKey);
    answers.stripeSecretKey = stripeSecretKey;
  }

  return 'done';
}

// ── Étape 7 : Internationalisation ──────────────────────────────────────────

async function stepI18n(answers) {
  delete answers.i18nLanguages;

  showHeader(answers);
  const i18nDefaultLanguage = await selectWithBack({
    message: 'Langue par défaut',
    options: [
      { value: 'fr', label: '🇫🇷 Français' },
      { value: 'en', label: '🇺🇸 Anglais' },
      { value: 'es', label: '🇪🇸 Espagnol' },
      { value: 'de', label: '🇩🇪 Allemand' },
    ],
    initialValue: 'fr'
  });
  cancelIfCancel(i18nDefaultLanguage);
  if (i18nDefaultLanguage === BACK) return BACK;
  answers.i18nDefaultLanguage = i18nDefaultLanguage;

  showHeader(answers);
  const wantsMoreLanguages = await p.confirm({
    message: 'Voulez-vous ajouter d\'autres langues ?',
    initialValue: false
  });
  cancelIfCancel(wantsMoreLanguages);

  if (wantsMoreLanguages) {
    const allLanguages = [
      { value: 'en', label: '🇺🇸 Anglais' },
      { value: 'es', label: '🇪🇸 Espagnol' },
      { value: 'de', label: '🇩🇪 Allemand' },
      { value: 'fr', label: '🇫🇷 Français' }
    ];
    const availableLanguages = allLanguages.filter(lang => lang.value !== i18nDefaultLanguage);
    const defaultLanguages = i18nDefaultLanguage !== 'en' && availableLanguages.some(l => l.value === 'en')
      ? ['en'] : [];

    showHeader(answers);
    p.note(chalk.gray('💡 Espace = cocher/décocher • a = tout sélectionner • Entrée = valider'), 'Astuce');
    const i18nLanguages = await p.multiselect({
      message: `Sélectionnez les langues supplémentaires (langue par défaut : ${i18nDefaultLanguage})`,
      options: availableLanguages,
      required: false,
      initialValues: defaultLanguages
    });
    if (p.isCancel(i18nLanguages)) return BACK;
    answers.i18nLanguages = i18nLanguages;
  } else {
    answers.i18nLanguages = [];
  }

  return 'done';
}

// ── Étape 8 : IA ─────────────────────────────────────────────────────────────

async function stepAI(answers) {
  delete answers.claudeApiKey;
  delete answers.openaiApiKey;
  delete answers.geminiApiKey;

  showHeader(answers);
  const wantsAI = await p.confirm({
    message: 'Souhaitez-vous proposer aux utilisateurs finaux des fonctionnalités IA ?',
    initialValue: false
  });
  cancelIfCancel(wantsAI);

  if (!wantsAI) {
    answers.aiProviders = [];
    return 'done';
  }

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
  if (p.isCancel(aiProviders)) return BACK;
  answers.aiProviders = Array.isArray(aiProviders) ? aiProviders : [];

  if (answers.aiProviders.length > 0) {
    for (const provider of answers.aiProviders) {
      showHeader(answers);
      if (provider === 'claude') {
        p.note(chalk.cyan('🔗 Récupérer votre clé API:') + ' https://console.anthropic.com/settings/keys', 'Configuration Claude (Anthropic)');
      } else if (provider === 'openai') {
        p.note(chalk.cyan('🔗 Récupérer votre clé API:') + ' https://platform.openai.com/api-keys', 'Configuration ChatGPT (OpenAI)');
      } else if (provider === 'gemini') {
        p.note(chalk.cyan('🔗 Récupérer votre clé API:') + ' https://aistudio.google.com/app/apikey', 'Configuration Gemini (Google)');
      }
      const providerName = provider === 'claude' ? 'Anthropic' : provider === 'openai' ? 'OpenAI' : 'Google';
      const apiKey = await p.password({
        message: `Clé API ${providerName}`,
        validate: (value) => {
          const result = validateApiKey(value);
          return result === true ? undefined : result;
        }
      });
      cancelIfCancel(apiKey);
      answers[`${provider}ApiKey`] = apiKey;
    }
  }

  return 'done';
}

// ── Étape 9 : Thème ──────────────────────────────────────────────────────────

async function stepTheme(answers) {
  showHeader(answers);
  const theme = await selectWithBack({
    message: 'Pour l\'interface du SAAS, quel thème désirez-vous par défaut ?',
    options: [
      { value: 'dark', label: '🌙 Sombre' },
      { value: 'light', label: '☀️  Clair' },
    ],
    initialValue: 'dark'
  });
  cancelIfCancel(theme);
  if (theme === BACK) return BACK;
  answers.theme = theme;
  return 'done';
}

// ── Étape 10 : Super Administrateur ─────────────────────────────────────────

async function stepAdmin(answers) {
  delete answers.adminEmail;

  showHeader(answers);
  p.note(
    chalk.cyan('👤 Le super administrateur aura accès à un espace /admin dédié\n') +
    chalk.gray('   pour monitorer les inscriptions, suivre les sessions actives\n') +
    chalk.gray('   et se connecter temporairement en tant qu\'utilisateur pour du support.\n') +
    chalk.yellow('   ⚠  Cet accès est exclusif — Uniquement les membres avec un rôle\n') +
    chalk.yellow('   spécifique ajoutés par le super admin pourront y accéder.'),
    'Super Administrateur'
  );

  const wantsAdmin = await selectWithBack({
    message: 'Ajouter un compte super administrateur ?',
    options: [
      { value: true, label: 'Oui', hint: 'Recommandé' },
      { value: false, label: 'Non' },
    ],
    initialValue: true
  });
  cancelIfCancel(wantsAdmin);
  if (wantsAdmin === BACK) return BACK;
  answers.wantsAdmin = wantsAdmin;

  if (wantsAdmin) {
    showHeader(answers);
    const adminEmail = await p.text({
      message: 'Email du super administrateur',
      placeholder: 'admin@exemple.com',
      validate: (value) => {
        const result = validateEmail(value);
        return result === true ? undefined : result;
      }
    });
    cancelIfCancel(adminEmail);
    answers.adminEmail = adminEmail;
  }

  return 'done';
}

// ── Étape 11 : Type de SaaS ──────────────────────────────────────────────────

async function stepSaasType(answers) {
  showHeader(answers);
  p.note(
    'Choisissez le type de SaaS à générer.\nLe mode Blog ajoute un système complet de publication d\'articles.',
    'Type de projet'
  );

  const saasType = await selectWithBack({
    message: 'Quel type de SaaS souhaitez-vous créer ?',
    options: [
      { value: 'default', label: 'Default', hint: 'Plateforme SaaS standard' },
      { value: 'blog', label: 'Blog', hint: 'Système de publication d\'articles intégré' },
      { value: 'shop', label: 'Shop — Coming Soon', hint: 'Disponible dans une prochaine version', disabled: true },
    ],
    initialValue: 'default',
  });
  cancelIfCancel(saasType);
  if (saasType === BACK) return BACK;
  answers.saasType = saasType;
  return 'done';
}

// ── Étape 12 : Claude Code ───────────────────────────────────────────────────

async function stepClaudeCode(answers) {
  showHeader(answers);
  const claudeCodeInstalled = await selectWithBack({
    message: 'Avez-vous Claude Code CLI installé ?',
    options: [
      { value: true, label: 'Oui' },
      { value: false, label: 'Non' },
    ],
    initialValue: true
  });
  cancelIfCancel(claudeCodeInstalled);
  if (claudeCodeInstalled === BACK) return BACK;
  answers.claudeCodeInstalled = claudeCodeInstalled;
  return 'done';
}

// ── Orchestrateur principal ──────────────────────────────────────────────────

/**
 * Pose toutes les questions avec l'interface moderne de @clack/prompts
 * Navigation : flèche gauche (←) pour revenir à l'étape précédente
 */
export async function askQuestions() {
  const answers = {};

  const steps = [
    stepProjectName,    // 0 — pas de retour arrière possible
    stepDatabase,       // 1
    stepAuth,           // 2
    stepStorage,        // 3
    stepEmail,          // 4
    stepLoginMethod,    // 5 — conditionnel selon email
    stepPayments,       // 6
    stepI18n,           // 7
    stepAI,             // 8
    stepTheme,          // 9
    stepAdmin,          // 10
    stepSaasType,       // 11
    stepClaudeCode,     // 12
  ];

  let i = 0;
  while (i < steps.length) {
    const result = await steps[i](answers);
    if (result === BACK) {
      // Impossible de reculer avant l'étape 0
      i = Math.max(0, i - 1);
    } else {
      i++;
    }
  }

  // Animation finale
  showHeader(answers);
  const s = p.spinner();
  s.start('Préparation de votre configuration');
  await new Promise(resolve => setTimeout(resolve, 1500));
  s.stop('Configuration prête !');

  return answers;
}
