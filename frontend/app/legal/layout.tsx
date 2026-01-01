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
      {/* Navigation */}
      <nav className="border-b-2 py-4" style={{ borderColor: COLORS.black }}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link 
            href="/" 
            className="text-2xl font-black tracking-tight hover:opacity-70 transition-opacity"
          >
            SPATTERS
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/legal/terms" className="hover:underline">Terms</Link>
            <Link href="/legal/privacy" className="hover:underline">Privacy</Link>
            <Link href="/legal/nft-license" className="hover:underline">License</Link>
            <Link href="/legal/risk-disclosure" className="hover:underline">Risks</Link>
          </div>
        </div>
      </nav>

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

