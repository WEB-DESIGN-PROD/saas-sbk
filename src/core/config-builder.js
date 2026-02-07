/**
 * Construit la configuration finale à partir des réponses utilisateur
 */
export function buildConfig(answers) {
  const config = {
    projectName: answers.projectName,
    theme: answers.theme,

    // Database
    database: {
      type: answers.databaseType,
      user: answers.databaseUser || '',
      password: answers.databasePassword || '',
      name: answers.databaseName || answers.projectName.replace(/-/g, '_'),
      url: answers.databaseUrl || '',
      host: 'localhost',
      port: '5432'
    },

    // Auth
    auth: {
      methods: answers.authMethods || ['email'],
      githubClientId: answers.githubClientId || '',
      githubClientSecret: answers.githubClientSecret || ''
    },

    // Storage
    storage: {
      enabled: answers.storageEnabled || false,
      type: answers.storageType || 'minio',
      s3AccessKey: answers.s3AccessKey || '',
      s3SecretKey: answers.s3SecretKey || '',
      s3Region: answers.s3Region || 'us-east-1',
      s3Bucket: answers.s3Bucket || '',
      minioPort: '9000',
      minioConsolePort: '9001'
    },

    // Email
    email: {
      provider: answers.emailProvider || 'resend',
      resendApiKey: answers.resendApiKey || '',
      smtpHost: answers.smtpHost || '',
      smtpPort: answers.smtpPort || '587',
      smtpUser: answers.smtpUser || '',
      smtpPassword: answers.smtpPassword || ''
    },

    // Payments
    payments: {
      enabled: answers.paymentsEnabled || false,
      stripePublicKey: answers.stripePublicKey || '',
      stripeSecretKey: answers.stripeSecretKey || ''
    },

    // i18n
    i18n: {
      defaultLanguage: answers.i18nDefaultLanguage || 'fr',
      languages: [
        answers.i18nDefaultLanguage,
        ...(answers.i18nLanguages || [])
      ].filter((lang, index, self) => self.indexOf(lang) === index) // Unique values
    },

    // AI
    ai: {
      provider: answers.aiProvider || 'none',
      apiKey: answers.aiApiKey || ''
    },

    // Claude Code
    claude: {
      cliInstalled: answers.claudeCodeInstalled || false
    }
  };

  // Générer l'URL de database si Docker
  if (config.database.type === 'docker') {
    config.database.url = `postgresql://${config.database.user}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.name}`;
  }

  return config;
}
