#!/usr/bin/env node

/**
 * Script de vérification pour s'assurer que tous les fichiers essentiels existent
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const requiredFiles = [
  // Core
  'package.json',
  'bin/create-saas-sbk.js',
  'src/index.js',

  // Core modules
  'src/core/questions.js',
  'src/core/validation.js',
  'src/core/config-builder.js',
  'src/core/summary.js',

  // Generators
  'src/generators/env-generator.js',
  'src/generators/docker-generator.js',
  'src/generators/claude-generator.js',
  'src/generators/package-generator.js',
  'src/generators/nextjs-generator.js',

  // Installers
  'src/installers/dependencies.js',
  'src/installers/skills.js',
  'src/installers/claude-init.js',

  // Utils
  'src/utils/logger.js',
  'src/utils/spinner.js',
  'src/utils/command-runner.js',
  'src/utils/file-utils.js',

  // Templates
  'src/templates/nextjs-base/app/globals.css',
  'src/templates/nextjs-base/app/layout.tsx',
  'src/templates/nextjs-base/app/page.tsx',
  'src/templates/nextjs-base/components/theme-provider.tsx',
  'src/templates/nextjs-base/components/ui/button.tsx',
  'src/templates/nextjs-base/lib/utils.ts',

  // Documentation
  'README.md',
  'CLAUDE.md',
  'CONTRIBUTING.md',
  'STATUS.md',
  'CHANGELOG.md',
  'LICENSE',
  '.gitignore',
  '.npmignore'
];

let missing = 0;
let found = 0;

console.log('🔍 Vérification des fichiers...\n');

for (const file of requiredFiles) {
  const filePath = path.join(rootDir, file);

  if (fs.existsSync(filePath)) {
    console.log('✅', file);
    found++;
  } else {
    console.log('❌', file, '(manquant)');
    missing++;
  }
}

console.log('\n' + '='.repeat(50));
console.log(`Résultat: ${found}/${requiredFiles.length} fichiers trouvés`);

if (missing > 0) {
  console.log(`❌ ${missing} fichiers manquants`);
  process.exit(1);
} else {
  console.log('✅ Tous les fichiers essentiels sont présents !');
  process.exit(0);
}
