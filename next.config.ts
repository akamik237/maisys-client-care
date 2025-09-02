import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/llm/:path*',
        destination: 'http://172.17.184.236:8000/:path*',
      },
      {
        source: '/api/backend/:path*',
        destination: 'http://172.17.184.236:8001/:path*',
      },
    ]
  },
}

export default nextConfig






