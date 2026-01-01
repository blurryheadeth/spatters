import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'All Legal Documents - Spatters',
  description: 'Complete legal documentation for Spatters NFT collection including Terms of Service, Privacy Policy, Risk Disclosure, NFT License, Cookie Policy, and Copyright Policy.',
};

// Spatters color palette
const COLORS = {
  background: '#EBE5D9',
  red: '#fc1a4a',
  black: '#000000',
};

export default function AllLegalDocuments() {
  return (
    <div className="space-y-8">
      {/* Header Notice */}
      <div 
        className="p-6 border-4 text-center"
        style={{ borderColor: COLORS.red, backgroundColor: '#fff5f5' }}
      >
        <h1 className="text-3xl font-black mb-4" style={{ color: COLORS.black }}>
          SPATTERS LEGAL DOCUMENTS
        </h1>
        <p className="text-lg font-bold" style={{ color: COLORS.red }}>
          BY INTERACTING WITH THE SPATTERS SMART CONTRACT OR WEBSITE, YOU AGREE TO ALL TERMS BELOW
        </p>
        <p className="text-sm mt-4 opacity-70" style={{ color: COLORS.black }}>
          Last updated: January 2026 | Contact: spatterseth@gmail.com
        </p>
      </div>

      {/* Table of Contents */}
      <nav className="border-2 p-8" style={{ borderColor: COLORS.black, backgroundColor: '#fff' }}>
        <h2 className="text-xl font-bold mb-6">Legal Documents</h2>
        <p className="text-sm mb-6 opacity-70">
          Click on each document to read the full terms. By minting or interacting with Spatters, 
          you acknowledge that you have read and agree to all of the following:
        </p>
        
        <ol className="space-y-4">
          <li className="border-b pb-4" style={{ borderColor: '#eee' }}>
            <Link 
              href="/legal/risk-disclosure" 
              className="flex items-center justify-between group"
            >
              <div>
                <span className="text-2xl font-bold" style={{ color: COLORS.red }}>1. Risk Disclosure</span>
                <p className="text-sm mt-1 opacity-70">
                  Critical warnings about NFT risks, non-refundable payments, unaudited smart contracts, and no guaranteed value.
                </p>
              </div>
              <span className="text-2xl group-hover:translate-x-1 transition-transform" style={{ color: COLORS.red }}>→</span>
            </Link>
            <span className="inline-block mt-2 px-2 py-1 text-xs font-bold" style={{ backgroundColor: COLORS.red, color: '#fff' }}>
              READ FIRST
            </span>
          </li>

          <li className="border-b pb-4" style={{ borderColor: '#eee' }}>
            <Link 
              href="/legal/terms" 
              className="flex items-center justify-between group"
            >
              <div>
                <span className="text-xl font-bold hover:underline">2. Terms of Service</span>
                <p className="text-sm mt-1 opacity-70">
                  Rules for using the website, minting process, eligibility, prohibited conduct, and dispute resolution.
                </p>
              </div>
              <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </li>

          <li className="border-b pb-4" style={{ borderColor: '#eee' }}>
            <Link 
              href="/legal/privacy" 
              className="flex items-center justify-between group"
            >
              <div>
                <span className="text-xl font-bold hover:underline">3. Privacy Policy</span>
                <p className="text-sm mt-1 opacity-70">
                  What data we collect (minimal), third-party services, and blockchain data permanence.
                </p>
              </div>
              <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </li>

          <li className="border-b pb-4" style={{ borderColor: '#eee' }}>
            <Link 
              href="/legal/nft-license" 
              className="flex items-center justify-between group"
            >
              <div>
                <span className="text-xl font-bold hover:underline">4. NFT License Agreement</span>
                <p className="text-sm mt-1 opacity-70">
                  CC0-style universal rights to artwork, what the NFT represents, and mutation rights.
                </p>
              </div>
              <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </li>

          <li className="border-b pb-4" style={{ borderColor: '#eee' }}>
            <Link 
              href="/legal/cookies" 
              className="flex items-center justify-between group"
            >
              <div>
                <span className="text-xl font-bold hover:underline">5. Cookie Policy</span>
                <p className="text-sm mt-1 opacity-70">
                  No tracking cookies used. Details on essential functionality and third-party services.
                </p>
              </div>
              <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </li>

          <li className="pb-4">
            <Link 
              href="/legal/copyright" 
              className="flex items-center justify-between group"
            >
              <div>
                <span className="text-xl font-bold hover:underline">6. Copyright & DMCA Policy</span>
                <p className="text-sm mt-1 opacity-70">
                  Copyright ownership, DMCA procedures, and blockchain immutability limitations.
                </p>
              </div>
              <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </li>
        </ol>
      </nav>

      {/* Footer */}
      <div className="text-center text-sm opacity-70">
        <p>
          Contact for all legal matters: <a href="mailto:spatterseth@gmail.com" className="underline">spatterseth@gmail.com</a>
        </p>
        <p className="mt-2">
          Official website: <a href="https://spatters.art" className="underline">spatters.art</a>
        </p>
      </div>
    </div>
  );
}
