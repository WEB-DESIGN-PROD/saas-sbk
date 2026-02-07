#!/usr/bin/env node

import { main } from '../src/index.js';

main().catch((error) => {
  console.error('Erreur fatale:', error.message);
  process.exit(1);
});
