import { sanitizeForYaml } from '../core/validation.js';

/**
 * Génère le contenu du fichier docker-compose.yml
 */
export function generateDockerCompose(config) {
  const services = [];

  // PostgreSQL si type docker
  if (config.database.type === 'docker') {
    services.push(`  postgres:
    image: postgres:15-alpine
    container_name: ${config.projectName}-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${sanitizeForYaml(config.database.user)}
      POSTGRES_PASSWORD: ${sanitizeForYaml(config.database.password)}
      POSTGRES_DB: ${sanitizeForYaml(config.database.name)}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "${config.database.port}:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${config.database.user}"]
      interval: 10s
      timeout: 5s
      retries: 5`);
  }

  // MinIO si storage enabled avec type minio
  if (config.storage.enabled && config.storage.type === 'minio') {
    services.push(`  minio:
    image: minio/minio:latest
    container_name: ${config.projectName}-minio
    restart: unless-stopped
    command: server /data --console-address ":${config.storage.minioConsolePort}"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data
    ports:
      - "${config.storage.minioPort}:9000"
      - "${config.storage.minioConsolePort}:${config.storage.minioConsolePort}"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3`);
  }

  // Si aucun service, retourner null
  if (services.length === 0) {
    return null;
  }

  // Volumes
  const volumes = [];
  if (config.database.type === 'docker') {
    volumes.push('  postgres_data:');
  }
  if (config.storage.enabled && config.storage.type === 'minio') {
    volumes.push('  minio_data:');
  }

  // Construire le fichier complet
  const lines = [
    'version: "3.8"',
    '',
    'services:',
    ...services.map(s => s),
    '',
    'volumes:',
    ...volumes,
    '',
    'networks:',
    '  default:',
    `    name: ${config.projectName}-network`
  ];

  return lines.join('\n');
}
