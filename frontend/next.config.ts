import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CORS headers for external platform compatibility (Etherscan, MetaMask, OpenSea)
  // Note: CSP was removed because it conflicted with iframe-based preview functionality.
  // The main security protections for this dApp come from:
  // 1. Wallet-based authentication (no cookies/sessions to steal)
  // 2. Signature verification on all state-changing operations
  // 3. React's built-in XSS protection (auto-escaping)
  async headers() {
    return [
      {
        // Security headers for all routes (non-breaking)
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // CORS headers for API routes
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
