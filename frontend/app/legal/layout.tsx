'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAccount } from 'wagmi';

// Spatters color palette
const COLORS = {
  background: '#EBE5D9',
  black: '#000000',
  red: '#fc1a4a',
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isContentsOpen, setIsContentsOpen] = useState(false);
  const { isConnected } = useAccount();

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: COLORS.background, color: COLORS.black }}
    >
      {/* Navigation - responsive with collapsible contents */}
      <header 
        className="border-b-2 sticky top-0 z-50" 
        style={{ borderColor: COLORS.black, backgroundColor: COLORS.background }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Left: Main Navigation Links */}
            <div className="flex items-center gap-4 md:gap-6">
              <Link 
                href="/" 
                className="font-bold text-base md:text-lg hover:opacity-70 transition-opacity"
                style={{ color: COLORS.black }}
              >
                Home
              </Link>
              <Link 
                href="/collection" 
                className="font-bold text-base md:text-lg hover:opacity-70 transition-opacity"
                style={{ color: COLORS.black }}
              >
                Collection
              </Link>
              {/* My Spatters: hidden on mobile, only show on desktop if wallet connected */}
              {isConnected && (
                <Link 
                  href="/my-spatters" 
                  className="hidden md:block font-bold text-lg hover:opacity-70 transition-opacity"
                  style={{ color: COLORS.black }}
                >
                  My Spatters
                </Link>
              )}
            </div>
            
            {/* Right: Legal page links - collapsible on mobile */}
            <div className="relative">
              {/* Mobile: Contents button */}
              <button
                onClick={() => setIsContentsOpen(!isContentsOpen)}
                className="md:hidden font-bold text-sm px-3 py-1 border-2 transition-opacity hover:opacity-70"
                style={{ 
                  borderColor: COLORS.black, 
                  backgroundColor: isContentsOpen ? COLORS.black : COLORS.background,
                  color: isContentsOpen ? COLORS.background : COLORS.black,
                }}
              >
                Contents {isContentsOpen ? '▲' : '▼'}
              </button>

              {/* Mobile: Dropdown menu */}
              {isContentsOpen && (
                <div 
                  className="md:hidden absolute right-0 top-full mt-2 border-2 p-3 min-w-[160px] z-50"
                  style={{ 
                    borderColor: COLORS.black, 
                    backgroundColor: COLORS.background,
                  }}
                >
                  <div className="flex flex-col gap-2 text-sm">
                    <Link 
                      href="/legal/all" 
                      className="hover:underline font-bold py-1" 
                      style={{ color: COLORS.red }}
                      onClick={() => setIsContentsOpen(false)}
                    >
                      All Documents
                    </Link>
                    <Link 
                      href="/legal/terms" 
                      className="hover:underline py-1"
                      onClick={() => setIsContentsOpen(false)}
                    >
                      Terms of Service
                    </Link>
                    <Link 
                      href="/legal/privacy" 
                      className="hover:underline py-1"
                      onClick={() => setIsContentsOpen(false)}
                    >
                      Privacy Policy
                    </Link>
                    <Link 
                      href="/legal/cookies" 
                      className="hover:underline py-1"
                      onClick={() => setIsContentsOpen(false)}
                    >
                      Cookie Policy
                    </Link>
                    <Link 
                      href="/legal/nft-license" 
                      className="hover:underline py-1"
                      onClick={() => setIsContentsOpen(false)}
                    >
                      NFT License
                    </Link>
                    <Link 
                      href="/legal/copyright" 
                      className="hover:underline py-1"
                      onClick={() => setIsContentsOpen(false)}
                    >
                      Copyright
                    </Link>
                    <Link 
                      href="/legal/risk-disclosure" 
                      className="hover:underline py-1"
                      onClick={() => setIsContentsOpen(false)}
                    >
                      Risk Disclosure
                    </Link>
                  </div>
                </div>
              )}

              {/* Desktop: Inline links */}
              <div className="hidden md:flex flex-wrap gap-3 text-sm">
                <Link href="/legal/all" className="hover:underline font-bold" style={{ color: COLORS.red }}>All</Link>
                <Link href="/legal/terms" className="hover:underline">Terms</Link>
                <Link href="/legal/privacy" className="hover:underline">Privacy</Link>
                <Link href="/legal/cookies" className="hover:underline">Cookies</Link>
                <Link href="/legal/nft-license" className="hover:underline">License</Link>
                <Link href="/legal/copyright" className="hover:underline">Copyright</Link>
                <Link href="/legal/risk-disclosure" className="hover:underline">Risks</Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close dropdown */}
      {isContentsOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden" 
          onClick={() => setIsContentsOpen(false)}
        />
      )}

      {/* Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {children}
      </main>

      {/* Footer */}
      <footer 
        className="border-t-2 py-6 mt-12" 
        style={{ borderColor: COLORS.black }}
      >
        <div className="container mx-auto px-4 text-center text-sm opacity-70">
          <p>
            Contact:{' '}
            <a href="mailto:spatterseth@gmail.com" className="hover:underline">
              spatterseth@gmail.com
            </a>
          </p>
          <p className="mt-2">
            <Link href="/" className="hover:underline">← Back to Spatters</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
