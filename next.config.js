/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      '@prisma/client', 
      'bcryptjs',
      'qrcode'
    ],
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app']
    }
  },
  
  typescript: {
    ignoreBuildErrors: false
  },
  
  eslint: {
    ignoreDuringBuilds: false
  },
  
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      'images.unsplash.com'
    ],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  
  // Segurança avançada
  async headers() {
    const securityHeaders = [
      {
        key: 'X-Frame-Options',
        value: 'DENY'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains'
      }
    ]
    
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      }
    ]
  },
  
  // Otimizações
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true
}

module.exports = nextConfig