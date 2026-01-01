import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal - Spatters',
  description: 'Legal information for Spatters NFT collection',
};

// Spatters color palette
const COLORS = {
  background: '#EBE5D9',
  black: '#000000',
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: COLORS.background, color: COLORS.black }}
    >
      {/* Navigation - matches homepage navbar */}
      <header 
        className="border-b-2 sticky top-0 z-50" 
        style={{ borderColor: COLORS.black, backgroundColor: COLORS.background }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Left: Main Navigation Links */}
            <div className="flex items-center gap-6">
              <Link 
                href="/" 
                className="font-bold text-lg hover:opacity-70 transition-opacity"
                style={{ color: COLORS.black }}
              >
                Home
              </Link>
              <Link 
                href="/collection" 
                className="font-bold text-lg hover:opacity-70 transition-opacity"
                style={{ color: COLORS.black }}
              >
                Collection
              </Link>
              <Link 
                href="/my-spatters" 
                className="font-bold text-lg hover:opacity-70 transition-opacity"
                style={{ color: COLORS.black }}
              >
                My Spatters
              </Link>
            </div>
            
            {/* Right: Legal page links */}
            <div className="flex flex-wrap gap-3 text-sm">
              <Link href="/legal/all" className="hover:underline font-bold" style={{ color: '#fc1a4a' }}>All</Link>
              <Link href="/legal/terms" className="hover:underline">Terms</Link>
              <Link href="/legal/privacy" className="hover:underline">Privacy</Link>
              <Link href="/legal/cookies" className="hover:underline">Cookies</Link>
              <Link href="/legal/nft-license" className="hover:underline">License</Link>
              <Link href="/legal/copyright" className="hover:underline">Copyright</Link>
              <Link href="/legal/risk-disclosure" className="hover:underline">Risks</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
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

