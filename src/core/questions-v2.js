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

// Note: Les messages d'aide en anglais d'inquirer ne peuvent pas être supprimés
// sans casser le rendu du CLI. Toute interception de stdout cause des bugs.
// Les instructions en français claires affichées au-dessus de chaque question
// sont suffisantes pour guider l'utilisateur :
// - "💡 Flèches ↑↓ = naviguer • Entrée = valider"
// - "💡 Espace = cocher/décocher • a = tout cocher • i = inverser • Entrée = valider"

/**
 * Stocke toutes les réponses de l'utilisateur
 */
const answers = {};

/**
 * Affiche le logo et les réponses validées
 */
function showHeader() {
  console.clear();

  // Logo ASCII
  console.log(chalk.cyan(`
 _____________________________    _____________________ __
__  ___/__    |__    |_  ___/    __  ___/__  __ )__  //_/
_____ \\__  /| |_  /| |____ \\     _____ \\__  __  |_  ,<
____/ /_  ___ |  ___ |___/ /     ____/ /_  /_/ /_  /| |
/____/ /_/  |_/_/  |_/____/      /____/ /_____/ /_/ |_|
  `));
  console.log(chalk.gray('       Générateur de SaaS Next.js'));
  console.log('');

  // Afficher les réponses validées de façon compacte
  if (Object.keys(answers).length > 0) {
    console.log(chalk.gray('━━━ Vos choix ━━━'));

    if (answers.projectName) {
      console.log(chalk.green(figures.tick) + ' Projet : ' + chalk.cyan(answers.projectName));
    }
    if (answers.theme) {
      console.log(chalk.green(figures.tick) + ' Thème : ' + chalk.cyan(answers.theme === 'dark' ? 'Sombre 🌙' : 'Clair ☀️'));
    }
    if (answers.databaseType) {
      let dbDisplay = 'Distant ☁️';
      if (answers.databaseType === 'docker') dbDisplay = 'Docker 🐳';
      else if (answers.databaseType === 'skip') dbDisplay = 'Aucune';
      else if (answers.databaseType === 'mongodb-local') dbDisplay = 'MongoDB 🐳';
      else if (answers.databaseType === 'mongodb-remote') dbDisplay = 'MongoDB distant';
      else if (answers.databaseType === 'sqlite') dbDisplay = 'SQLite';

      console.log(chalk.green(figures.tick) + ' Base de données : ' + chalk.cyan(dbDisplay));
    }
    if (answers.authMethods) {
      console.log(chalk.green(figures.tick) + ' Auth : ' + chalk.cyan(answers.authMethods.length + ' méthode(s)'));
    }
    if (answers.storageEnabled !== undefined) {
      console.log(chalk.green(figures.tick) + ' Stockage : ' + chalk.cyan(answers.storageEnabled ? 'Activé' : 'Désactivé'));
    }
    if (answers.emailProvider !== undefined) {
      const provider = answers.emailProvider === 'skip' ? 'Plus tard' :
                      answers.emailProvider === 'resend' ? 'Resend 📮' : 'SMTP 📧';
      console.log(chalk.green(figures.tick) + ' Email : ' + chalk.cyan(provider));
    }
    if (answers.paymentsEnabled !== undefined) {
      console.log(chalk.green(figures.tick) + ' Paiements : ' + chalk.cyan(answers.paymentsEnabled ? 'Activé 💳' : 'Désactivé'));
    }
    if (answers.i18nDefaultLanguage) {
      const totalLangs = 1 + (answers.i18nLanguages?.length || 0);
      console.log(chalk.green(figures.tick) + ' I18n : ' + chalk.cyan(totalLangs + ' langue(s) 🌍'));
    }
    if (answers.aiProvider) {
      console.log(chalk.green(figures.tick) + ' IA : ' + chalk.cyan(
        answers.aiProvider === 'none' ? 'Aucune' :
        answers.aiProvider === 'claude' ? 'Claude 🤖' :
        answers.aiProvider === 'openai' ? 'ChatGPT 💬' : 'Gemini ✨'
      ));
    }
    if (answers.claudeCodeInstalled !== undefined) {
      console.log(chalk.green(figures.tick) + ' Claude Code : ' + chalk.cyan(answers.claudeCodeInstalled ? 'Oui ✓' : 'Non'));
    }

    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━'));
    console.log('');
  }
}

/**
 * Animation moderne et discrète avant le récapitulatif
 */
async function showFunAnimation() {
  // Nettoyer l'écran et afficher le header avec le logo
  console.clear();
  showHeader();
  console.log('');

  // Cacher le curseur pendant l'animation
  process.stdout.write('\x1B[?25l');

  const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const message = 'Préparation de votre configuration';

  // Spinner discret pendant 1.5 secondes
  const duration = 1500;
  const interval = 80;
  const iterations = duration / interval;

  for (let i = 0; i < iterations; i++) {
    const frame = spinner[i % spinner.length];
    process.stdout.write('\r  ' + chalk.cyan(frame) + '  ' + chalk.gray(message) + '   ');
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  // Message final simple
  process.stdout.write('\r  ' + chalk.green('✓') + '  ' + chalk.gray(message) + '   \n');

  // Réafficher le curseur
  process.stdout.write('\x1B[?25h');

  console.log('');
}

/**
 * Pose toutes les questions avec possibilité de navigation
 */
export async function askQuestions() {
  console.clear();
  showHeader();

  console.log(chalk.bold.cyan('📋 Configuration de votre projet\n'));
  console.log(chalk.gray('Répondez aux questions. Vous pourrez tout vérifier avant validation.\n'));

  const totalQuestions = 11;

  // 1. Nom du projet
  showHeader();
  const q1 = await inquirer.prompt([{
    type: 'input',
    name: 'projectName',
    message: chalk.cyan(`[1/${totalQuestions}]`) + ' Nom du projet :',
    default: 'my-saas',
    validate: validateProjectName,
    prefix: ' '
  }]);
  Object.assign(answers, q1);

  // 2. Thème
  showHeader();
  console.log(chalk.gray('💡 Flèches ↑↓ = naviguer • Entrée = valider\n'));
  const q2 = await inquirer.prompt([{
    type: 'list',
    name: 'theme',
    message: chalk.cyan(`[2/${totalQuestions}]`) + ' Thème par défaut :',
    choices: [
      { name: '🌙 Sombre', value: 'dark' },
      { name: '☀️  Clair', value: 'light' }
    ],
    default: 'dark',
    prefix: ' '
  }]);
  Object.assign(answers, q2);

  // 3. Base de données
  let databaseConfigured = false;
  while (!databaseConfigured) {
    showHeader();
    console.log(chalk.gray('💡 Flèches ↑↓ = naviguer • Entrée = valider\n'));
    const q3 = await inquirer.prompt([{
      type: 'list',
      name: 'databaseType',
      message: chalk.cyan(`[3/${totalQuestions}]`) + ' Configuration de la base de données :',
      choices: [
        { name: 'Ignorer pour l\'instant', value: 'skip' },
        { name: '🐳 PostgreSQL local avec Docker (recommandé)', value: 'docker' },
        { name: '   PostgreSQL distant (Neon, Supabase, etc.)', value: 'remote' },
        { name: '🐳 MongoDB local avec Docker', value: 'mongodb-local' },
        { name: '   MongoDB distant (Atlas, etc.)', value: 'mongodb-remote' },
        { name: '   SQLite (fichier local)', value: 'sqlite' }
      ],
      default: 'skip',
      prefix: ' '
    }]);

    // Si l'utilisateur choisit "Ignorer", afficher un avertissement
    if (q3.databaseType === 'skip') {
      showHeader();
      console.log(chalk.yellow.bold('\n⚠️  ATTENTION\n'));
      console.log(chalk.yellow('Sans base de données, le système d\'authentification automatique'));
      console.log(chalk.yellow('ne pourra pas fonctionner. Vous devrez configurer cela plus tard.\n'));

      const confirm = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirmSkip',
        message: 'Confirmer et continuer sans base de données ?',
        default: false,
        prefix: ' '
      }]);

      if (confirm.confirmSkip) {
        Object.assign(answers, q3);
        answers.skipAuth = true; // Flag pour passer l'authentification
        databaseConfigured = true;
      }
      // Sinon, on reboucle pour redemander le choix de base de données
    } else {
      Object.assign(answers, q3);
      databaseConfigured = true;
    }
  }

  // Questions DB selon le type
  if (answers.databaseType === 'docker') {
    showHeader();
    const dbDocker = await inquirer.prompt([
      {
        type: 'input',
        name: 'databaseUser',
        message: '  ' + chalk.gray('→') + ' Nom d\'utilisateur PostgreSQL :',
        default: 'postgres',
        validate: validateDatabaseUser,
        prefix: ' '
      },
      {
        type: 'password',
        name: 'databasePassword',
        message: '  ' + chalk.gray('→') + ' Mot de passe PostgreSQL :',
        default: 'postgres',
        mask: '*',
        validate: validatePassword,
        prefix: ' '
      },
      {
        type: 'input',
        name: 'databaseName',
        message: '  ' + chalk.gray('→') + ' Nom de la base de données :',
        default: answers.projectName.replace(/-/g, '_'),
        validate: validateDatabaseName,
        prefix: ' '
      }
    ]);
    Object.assign(answers, dbDocker);
  } else if (answers.databaseType === 'remote') {
    showHeader();
    const dbRemote = await inquirer.prompt([{
      type: 'input',
      name: 'databaseUrl',
      message: '  ' + chalk.gray('→') + ' URL de connexion PostgreSQL :',
      validate: (input) => {
        if (!input || input.trim().length === 0) return 'URL requise';
        if (!input.startsWith('postgresql://') && !input.startsWith('postgres://')) {
          return 'L\'URL doit commencer par postgresql://';
        }
        return true;
      },
      prefix: ' '
    }]);
    Object.assign(answers, dbRemote);
  }

  // 4. Authentification (sauf si base de données ignorée)
  if (!answers.skipAuth) {
    showHeader();
    console.log(chalk.gray('💡 Espace = cocher/décocher • a = tout cocher • i = inverser • Entrée = valider\n'));
    const q4 = await inquirer.prompt([{
      type: 'checkbox',
      name: 'authMethods',
      message: chalk.cyan(`[4/${totalQuestions}]`) + ' Méthodes d\'authentification :',
      choices: [
        { name: 'Email/Mot de passe', value: 'email', checked: true },
        { name: 'OAuth GitHub', value: 'github' },
        { name: 'Magic Link (lien par email)', value: 'magiclink' }
      ],
      validate: (input) => input.length > 0 || 'Choisissez au moins une méthode',
      prefix: ' '
    }]);
    Object.assign(answers, q4);

    // Questions GitHub OAuth si sélectionné
    if (answers.authMethods && answers.authMethods.includes('github')) {
      showHeader();
      const github = await inquirer.prompt([
        {
          type: 'input',
          name: 'githubClientId',
          message: '  ' + chalk.gray('→') + ' GitHub OAuth Client ID :',
          validate: validateClientId,
          prefix: ' '
        },
        {
          type: 'password',
          name: 'githubClientSecret',
          message: '  ' + chalk.gray('→') + ' GitHub OAuth Client Secret :',
          mask: '*',
          validate: validateClientSecret,
          prefix: ' '
        }
      ]);
      Object.assign(answers, github);
    }
  } else {
    // Si base de données ignorée, mettre des valeurs par défaut vides
    answers.authMethods = [];
  }

  // 5. Stockage médias
  showHeader();
  console.log(chalk.gray('💡 Flèches ↑↓ = naviguer • Entrée = valider\n'));
  const q5 = await inquirer.prompt([{
    type: 'list',
    name: 'storageEnabled',
    message: chalk.cyan(`[5/${totalQuestions}]`) + ' Activer le stockage de fichiers médias ?',
    choices: [
      { name: 'Non', value: false },
      { name: 'Oui', value: true }
    ],
    default: false,
    prefix: ' '
  }]);
  Object.assign(answers, q5);

  if (answers.storageEnabled) {
    showHeader();
    const storageType = await inquirer.prompt([{
      type: 'list',
      name: 'storageType',
      message: '  ' + chalk.gray('→') + ' Type de stockage :',
      choices: [
        { name: '🐳 MinIO local avec Docker (recommandé)', value: 'minio' },
        { name: '☁️  AWS S3', value: 's3' }
      ],
      default: 'minio',
      prefix: ' '
    }]);
    Object.assign(answers, storageType);

    if (answers.storageType === 's3') {
      showHeader();
      const s3 = await inquirer.prompt([
        {
          type: 'input',
          name: 's3AccessKey',
          message: '    ' + chalk.gray('→') + ' AWS Access Key ID :',
          validate: validateApiKey,
          prefix: ' '
        },
        {
          type: 'password',
          name: 's3SecretKey',
          message: '    ' + chalk.gray('→') + ' AWS Secret Access Key :',
          mask: '*',
          validate: validateApiKey,
          prefix: ' '
        },
        {
          type: 'input',
          name: 's3Region',
          message: '    ' + chalk.gray('→') + ' AWS Region :',
          default: 'us-east-1',
          prefix: ' '
        },
        {
          type: 'input',
          name: 's3Bucket',
          message: '    ' + chalk.gray('→') + ' Nom du bucket S3 :',
          validate: (input) => input.trim().length > 0 || 'Nom requis',
          prefix: ' '
        }
      ]);
      Object.assign(answers, s3);
    }
  }

  // 6. Emails
  showHeader();
  console.log(chalk.gray('💡 Flèches ↑↓ = naviguer • Entrée = valider\n'));
  const q6 = await inquirer.prompt([{
    type: 'list',
    name: 'emailProvider',
    message: chalk.cyan(`[6/${totalQuestions}]`) + ' Service d\'envoi d\'emails :',
    choices: [
      { name: 'Ignorer pour le moment', value: 'skip' },
      { name: 'Resend (recommandé)', value: 'resend' },
      { name: 'SMTP personnalisé', value: 'smtp' }
    ],
    default: 'skip',
    prefix: ' '
  }]);
  Object.assign(answers, q6);

  if (answers.emailProvider === 'resend') {
    showHeader();
    const resend = await inquirer.prompt([{
      type: 'password',
      name: 'resendApiKey',
      message: '  ' + chalk.gray('→') + ' Clé API Resend :',
      mask: '*',
      validate: validateApiKey,
      prefix: ' '
    }]);
    Object.assign(answers, resend);
  } else if (answers.emailProvider === 'smtp') {
    showHeader();
    const smtp = await inquirer.prompt([
      {
        type: 'input',
        name: 'smtpHost',
        message: '  ' + chalk.gray('→') + ' Hôte SMTP :',
        validate: validateHostname,
        prefix: ' '
      },
      {
        type: 'input',
        name: 'smtpPort',
        message: '  ' + chalk.gray('→') + ' Port SMTP :',
        default: '587',
        validate: validatePort,
        prefix: ' '
      },
      {
        type: 'input',
        name: 'smtpUser',
        message: '  ' + chalk.gray('→') + ' Utilisateur SMTP :',
        validate: validateEmail,
        prefix: ' '
      },
      {
        type: 'password',
        name: 'smtpPassword',
        message: '  ' + chalk.gray('→') + ' Mot de passe SMTP :',
        mask: '*',
        validate: validatePassword,
        prefix: ' '
      }
    ]);
    Object.assign(answers, smtp);
  }

  // 7. Paiements
  showHeader();
  console.log(chalk.gray('💡 Flèches ↑↓ = naviguer • Entrée = valider\n'));
  const q7 = await inquirer.prompt([{
    type: 'list',
    name: 'paymentsEnabled',
    message: chalk.cyan(`[7/${totalQuestions}]`) + ' Activer les paiements Stripe ?',
    choices: [
      { name: 'Non', value: false },
      { name: 'Oui', value: true }
    ],
    default: false,
    prefix: ' '
  }]);
  Object.assign(answers, q7);

  if (answers.paymentsEnabled) {
    showHeader();
    const stripe = await inquirer.prompt([
      {
        type: 'password',
        name: 'stripePublicKey',
        message: '  ' + chalk.gray('→') + ' Clé publique Stripe (pk_test_...) :',
        mask: '*',
        validate: (input) => {
          if (!input || input.trim().length === 0) return 'Clé requise';
          if (!input.startsWith('pk_')) return 'Doit commencer par pk_';
          return true;
        },
        prefix: ' '
      },
      {
        type: 'password',
        name: 'stripeSecretKey',
        message: '  ' + chalk.gray('→') + ' Clé secrète Stripe (sk_test_...) :',
        mask: '*',
        validate: (input) => {
          if (!input || input.trim().length === 0) return 'Clé requise';
          if (!input.startsWith('sk_')) return 'Doit commencer par sk_';
          return true;
        },
        prefix: ' '
      }
    ]);
    Object.assign(answers, stripe);
  }

  // 8. Internationalisation
  showHeader();
  console.log(chalk.gray('💡 Flèches ↑↓ = naviguer • Entrée = valider\n'));
  const q8 = await inquirer.prompt([{
    type: 'list',
    name: 'i18nDefaultLanguage',
    message: chalk.cyan(`[8/${totalQuestions}]`) + ' Langue par défaut :',
    choices: [
      { name: '🇫🇷 Français', value: 'fr' },
      { name: '🇺🇸 Anglais', value: 'en' },
      { name: '🇪🇸 Espagnol', value: 'es' },
      { name: '🇩🇪 Allemand', value: 'de' }
    ],
    default: 'fr',
    prefix: ' '
  }]);
  Object.assign(answers, q8);

  showHeader();
  console.log(chalk.gray('💡 Espace = cocher/décocher • a = tout cocher • i = inverser • Entrée = valider\n'));
  const q8bis = await inquirer.prompt([{
    type: 'checkbox',
    name: 'i18nLanguages',
    message: chalk.cyan(`[9/${totalQuestions}]`) + ' Langues supplémentaires :',
    choices: (currentAnswers) => {
      const all = [
        { name: 'Aucune (uniquement ' + answers.i18nDefaultLanguage + ')', value: 'none', checked: true },
        { name: '🇫🇷 Français', value: 'fr' },
        { name: '🇺🇸 Anglais', value: 'en' },
        { name: '🇪🇸 Espagnol', value: 'es' },
        { name: '🇩🇪 Allemand', value: 'de' }
      ];
      return all.filter(lang => lang.value === 'none' || lang.value !== answers.i18nDefaultLanguage);
    },
    prefix: ' '
  }]);

  // Si "none" est sélectionné, vider le tableau
  if (q8bis.i18nLanguages.includes('none')) {
    q8bis.i18nLanguages = [];
  }
  Object.assign(answers, q8bis);

  // 10. IA pour utilisateurs finaux
  showHeader();
  console.log(chalk.gray('💡 Espace = cocher/décocher • a = tout cocher • i = inverser • Entrée = valider\n'));
  const q9 = await inquirer.prompt([{
    type: 'checkbox',
    name: 'aiProviders',
    message: chalk.cyan(`[10/${totalQuestions}]`) + ' Quelles IA souhaitez-vous proposer à vos utilisateurs finaux ?',
    choices: [
      { name: 'Aucune (pas d\'IA dans le SaaS)', value: 'none', checked: true },
      { name: 'Claude (Anthropic)', value: 'claude' },
      { name: 'ChatGPT (OpenAI)', value: 'openai' },
      { name: 'Gemini (Google)', value: 'gemini' }
    ],
    prefix: ' '
  }]);
  Object.assign(answers, q9);

  // Si "none" est sélectionné, vider le tableau
  if (answers.aiProviders.includes('none')) {
    answers.aiProviders = [];
  }

  // Demander les clés API pour chaque IA sélectionnée
  if (answers.aiProviders.length > 0) {
    for (const provider of answers.aiProviders) {
      showHeader();
      const providerName = provider === 'claude' ? 'Anthropic' : provider === 'openai' ? 'OpenAI' : 'Google';
      const aiKey = await inquirer.prompt([{
        type: 'password',
        name: `${provider}ApiKey`,
        message: '  ' + chalk.gray('→') + ` Clé API ${providerName} :`,
        mask: '*',
        validate: validateApiKey,
        prefix: ' '
      }]);
      Object.assign(answers, aiKey);
    }
  }

  // 11. Claude Code
  showHeader();
  const q10 = await inquirer.prompt([{
    type: 'confirm',
    name: 'claudeCodeInstalled',
    message: chalk.cyan(`[11/${totalQuestions}]`) + ' Avez-vous Claude Code CLI installé ?',
    default: true,
    prefix: ' '
  }]);
  Object.assign(answers, q10);

  // Animation fun avant le récapitulatif
  await showFunAnimation();

  // Afficher le header final avec tous les choix
  showHeader();
  console.log(chalk.green.bold('✓ Configuration terminée !\n'));

  return answers;
}
