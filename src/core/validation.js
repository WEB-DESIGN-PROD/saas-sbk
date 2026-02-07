/**
 * Validations sécurisées pour toutes les entrées utilisateur
 */

// Regex de validation strictes
const PATTERNS = {
  projectName: /^[a-zA-Z0-9-_]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  port: /^\d+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphanumericExtended: /^[a-zA-Z0-9-_\.]+$/
};

/**
 * Valide un nom de projet
 */
export function validateProjectName(input) {
  if (!input || input.trim().length === 0) {
    return 'Le nom du projet est requis.';
  }

  if (!PATTERNS.projectName.test(input)) {
    return 'Le nom du projet ne doit contenir que des lettres, chiffres, tirets ou underscores.';
  }

  if (input.length < 3 || input.length > 50) {
    return 'Le nom du projet doit faire entre 3 et 50 caractères.';
  }

  return true;
}

/**
 * Valide un mot de passe
 */
export function validatePassword(input) {
  if (!input || input.trim().length === 0) {
    return 'Le mot de passe est requis.';
  }

  if (input.length < 8) {
    return 'Le mot de passe doit faire au moins 8 caractères.';
  }

  return true;
}

/**
 * Valide un nom d'utilisateur de base de données
 */
export function validateDatabaseUser(input) {
  if (!input || input.trim().length === 0) {
    return "Le nom d'utilisateur est requis.";
  }

  if (!PATTERNS.alphanumericExtended.test(input)) {
    return "Le nom d'utilisateur ne doit contenir que des lettres, chiffres, tirets, underscores ou points.";
  }

  if (input.length < 3 || input.length > 50) {
    return "Le nom d'utilisateur doit faire entre 3 et 50 caractères.";
  }

  return true;
}

/**
 * Valide un nom de base de données
 */
export function validateDatabaseName(input) {
  if (!input || input.trim().length === 0) {
    return 'Le nom de la base de données est requis.';
  }

  if (!PATTERNS.alphanumericExtended.test(input)) {
    return 'Le nom de la base de données ne doit contenir que des lettres, chiffres, tirets, underscores ou points.';
  }

  if (input.length < 3 || input.length > 50) {
    return 'Le nom de la base de données doit faire entre 3 et 50 caractères.';
  }

  return true;
}

/**
 * Valide une adresse email
 */
export function validateEmail(input) {
  if (!input || input.trim().length === 0) {
    return "L'email est requis.";
  }

  if (!PATTERNS.email.test(input)) {
    return "Format d'email invalide.";
  }

  return true;
}

/**
 * Valide une URL
 */
export function validateUrl(input) {
  if (!input || input.trim().length === 0) {
    return "L'URL est requise.";
  }

  if (!PATTERNS.url.test(input)) {
    return "L'URL doit commencer par http:// ou https://";
  }

  return true;
}

/**
 * Valide un port
 */
export function validatePort(input) {
  if (!input || input.trim().length === 0) {
    return 'Le port est requis.';
  }

  if (!PATTERNS.port.test(input)) {
    return 'Le port doit être un nombre.';
  }

  const port = parseInt(input, 10);
  if (port < 1 || port > 65535) {
    return 'Le port doit être entre 1 et 65535.';
  }

  return true;
}

/**
 * Valide une clé API
 */
export function validateApiKey(input) {
  if (!input || input.trim().length === 0) {
    return 'La clé API est requise.';
  }

  if (input.length < 10) {
    return 'La clé API doit faire au moins 10 caractères.';
  }

  if (input.includes(' ')) {
    return 'La clé API ne doit pas contenir d\'espaces.';
  }

  return true;
}

/**
 * Valide un client ID OAuth
 */
export function validateClientId(input) {
  if (!input || input.trim().length === 0) {
    return 'Le client ID est requis.';
  }

  if (input.length < 10) {
    return 'Le client ID doit faire au moins 10 caractères.';
  }

  return true;
}

/**
 * Valide un client secret OAuth
 */
export function validateClientSecret(input) {
  if (!input || input.trim().length === 0) {
    return 'Le client secret est requis.';
  }

  if (input.length < 10) {
    return 'Le client secret doit faire au moins 10 caractères.';
  }

  return true;
}

/**
 * Valide un hostname
 */
export function validateHostname(input) {
  if (!input || input.trim().length === 0) {
    return 'Le hostname est requis.';
  }

  // Accepter localhost, IP, ou domaine
  const isLocalhost = input === 'localhost';
  const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(input);
  const isDomain = /^[a-zA-Z0-9-_.]+$/.test(input);

  if (!isLocalhost && !isIP && !isDomain) {
    return 'Hostname invalide.';
  }

  return true;
}

/**
 * Sanitize une valeur pour l'écriture dans .env
 */
export function sanitizeForEnv(value) {
  if (typeof value !== 'string') {
    return String(value);
  }

  // Échapper les caractères spéciaux
  return value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\$/g, '\\$')
    .replace(/`/g, '\\`')
    .replace(/\n/g, '\\n');
}

/**
 * Sanitize une valeur pour l'écriture dans YAML
 */
export function sanitizeForYaml(value) {
  if (typeof value !== 'string') {
    return String(value);
  }

  // Échapper les caractères spéciaux YAML
  if (value.includes(':') || value.includes('#') || value.includes('{') || value.includes('}')) {
    return `"${value.replace(/"/g, '\\"')}"`;
  }

  return value;
}
