'use client';

import Link from 'next/link';

// Spatters color palette
const COLORS = {
  background: '#EBE5D9',
  black: '#000000',
};

export default function Footer() {
  return (
    <footer 
      className="border-t-2 py-8" 
      style={{ borderColor: COLORS.black, backgroundColor: COLORS.background }}
    >
      <div className="container mx-auto px-4" style={{ color: COLORS.black }}>
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left side - Copyright */}
          <div className="text-center md:text-left">
            <p className="font-medium">© 2026 Spatters. All rights reserved.</p>
            <p className="mt-1 text-sm opacity-70">Built on Ethereum • Fully On-Chain</p>
          </div>

          {/* Right side - Legal links */}
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            <Link 
              href="/legal/terms" 
              className="hover:underline transition-opacity hover:opacity-70"
            >
              Terms
            </Link>
            <Link 
              href="/legal/privacy" 
              className="hover:underline transition-opacity hover:opacity-70"
            >
              Privacy
            </Link>
            <Link 
              href="/legal/cookies" 
              className="hover:underline transition-opacity hover:opacity-70"
            >
              Cookies
            </Link>
            <Link 
              href="/legal/nft-license" 
              className="hover:underline transition-opacity hover:opacity-70"
            >
              License
            </Link>
            <Link 
              href="/legal/copyright" 
              className="hover:underline transition-opacity hover:opacity-70"
            >
              Copyright
            </Link>
            <Link 
              href="/legal/risk-disclosure" 
              className="hover:underline transition-opacity hover:opacity-70"
            >
              Risks
            </Link>
          </nav>
        </div>

        {/* Contact */}
        <div className="mt-6 pt-4 border-t text-center text-sm opacity-70" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
          <p>
            Contact:{' '}
            <a 
              href="mailto:spatterseth@gmail.com" 
              className="hover:underline"
            >
              spatterseth@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

