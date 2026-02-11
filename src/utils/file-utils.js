import fs from 'fs';
import path from 'path';

/**
 * Copie récursive d'un répertoire
 * @param {string} src - Chemin source
 * @param {string} dest - Chemin destination
 * @param {object} replacements - Variables à remplacer dans les fichiers
 */
export function copyDirectory(src, dest, replacements = {}) {
  // Créer le répertoire de destination
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, replacements);
    } else {
      copyFile(srcPath, destPath, replacements);
    }
  }
}

/**
 * Copie un fichier avec remplacement de variables
 * @param {string} src - Chemin source
 * @param {string} dest - Chemin destination
 * @param {object} replacements - Variables à remplacer
 */
export function copyFile(src, dest, replacements = {}) {
  let content = fs.readFileSync(src, 'utf-8');

  // Remplacer les variables {{VAR_NAME}}
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, value);
  }

  // Remplacer "Mon SAAS" par le nom du projet (permet au template d'être testable)
  if (replacements.PROJECT_NAME) {
    content = content.replace(/Mon SAAS/g, replacements.PROJECT_NAME);
  }

  fs.writeFileSync(dest, content, 'utf-8');
}

/**
 * Écrit un fichier de manière sécurisée
 * @param {string} filePath - Chemin du fichier
 * @param {string} content - Contenu à écrire
 */
export function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Vérifie si un fichier ou répertoire existe
 * @param {string} path - Chemin à vérifier
 * @returns {boolean}
 */
export function exists(path) {
  return fs.existsSync(path);
}

/**
 * Supprime un répertoire récursivement
 * @param {string} dirPath - Chemin du répertoire
 */
export function removeDirectory(dirPath) {
  if (exists(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}
