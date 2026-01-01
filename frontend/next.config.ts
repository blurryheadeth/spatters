import type { NextConfig } from "next";

// Content Security Policy configuration
// This protects users from XSS attacks and clickjacking while allowing all necessary functionality
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  font-src 'self' data:;
  img-src 'self' data: blob: https:;
  connect-src 'self' 
    https://*.walletconnect.com 
    https://*.walletconnect.org
    wss://*.walletconnect.com 
    wss://*.walletconnect.org
    wss://relay.walletconnect.com
    wss://relay.walletconnect.org
    https://*.supabase.co 
    https://*.alchemy.com 
    https://*.infura.io 
    https://eth.llamarpc.com 
    https://eth.public-rpc.com
    https://eth-sepolia.public.blastapi.io
    https://cloudflare-eth.com
    https://rpc.ankr.com
    https://ethereum.publicnode.com
    https://*.ethereum.org;
  frame-src 'self';
  frame-ancestors 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  // Security and CORS headers
  async headers() {
    return [
      {
        // Apply CSP and security headers to all pages
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy,
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // CORS headers for API routes (external platform compatibility)
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      {
        // CORS headers for the on-chain viewer route
        source: '/spatter/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
        ],
      },
    ];
  },
  // Webpack config for WalletConnect dependencies
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
