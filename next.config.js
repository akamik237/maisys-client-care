/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour Vercel
  output: 'standalone',
  
  // Désactiver ESLint pendant le build pour un déploiement rapide
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Optimisations
  compress: true,
  poweredByHeader: false,
  
  // Configuration des images
  images: {
    domains: ['localhost', 'vercel.app'],
    unoptimized: true
  },
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Configuration pour le développement
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Variables d'environnement publiques
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
