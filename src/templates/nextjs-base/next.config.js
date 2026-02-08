/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack est activé par défaut dans Next.js 16
  // Plus besoin de flag --turbopack

  // Configuration Turbopack
  turbopack: {
    root: process.cwd(), // Définit la racine du projet pour éviter les warnings
  },

  // Configuration des images (Next.js 16 recommande remotePatterns au lieu de domains)
  images: {
    remotePatterns: [
      // Exemple pour autoriser des images externes
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   pathname: '/images/**',
      // },
    ],
  },

  // Configuration TypeScript
  typescript: {
    // Permet le build même avec des erreurs TypeScript (à désactiver en production)
    ignoreBuildErrors: false,
  },

  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
}

module.exports = nextConfig
