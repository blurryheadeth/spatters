import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Spatters',
  description: 'Privacy Policy for Spatters NFT collection',
};

export default function PrivacyPolicy() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
      <p className="text-sm opacity-70 mb-8">Last updated: January 2025</p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
        <p>
          This Privacy Policy describes how the Spatters website (spatters.art) collects, uses, and shares 
          information when you visit our website or interact with Spatters NFTs. We are committed to protecting 
          your privacy and being transparent about our data practices.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Wallet Addresses</h3>
        <p>
          When you connect your cryptocurrency wallet to our website using WalletConnect or RainbowKit, we receive 
          your public wallet address. This address is used to:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Display your owned Spatters NFTs</li>
          <li>Enable minting and mutation transactions</li>
          <li>Verify ownership for token-gated features</li>
        </ul>
        <p className="mt-4">
          Wallet addresses are public blockchain data. We do not store wallet addresses in our own databases; 
          they are read directly from the Ethereum blockchain.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Automatically Collected Information</h3>
        <p>
          Our hosting provider (Vercel) automatically collects standard web server logs, which may include:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>IP addresses</li>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Referring URLs</li>
          <li>Pages visited and time spent</li>
          <li>Date and time of access</li>
        </ul>
        <p className="mt-4">
          This information is collected by Vercel for operational purposes and is subject to{' '}
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">
            Vercel&apos;s Privacy Policy
          </a>.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Local Storage</h3>
        <p>
          We use browser session storage (not cookies) to store temporary UI state, such as tracking recently 
          mutated tokens for display purposes. This data:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Is stored only in your browser</li>
          <li>Is not transmitted to our servers</li>
          <li>Is automatically cleared when you close your browser</li>
          <li>Contains no personal information</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Information We Do NOT Collect</h2>
        <p>We want to be clear about what we do not collect:</p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li><strong>No analytics cookies:</strong> We do not use Google Analytics or similar tracking services</li>
          <li><strong>No marketing cookies:</strong> We do not use advertising or marketing trackers</li>
          <li><strong>No email addresses:</strong> We do not collect or store email addresses</li>
          <li><strong>No personal information:</strong> We do not collect names, physical addresses, or other personal identifiers</li>
          <li><strong>No behavioral tracking:</strong> We do not track your behavior across websites</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Third-Party Services</h2>
        <p>
          We use the following third-party services that may have access to certain information:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">4.1 WalletConnect / RainbowKit</h3>
        <p>
          Used for connecting your cryptocurrency wallet. When you connect, WalletConnect may collect connection 
          metadata. See{' '}
          <a href="https://walletconnect.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
            WalletConnect&apos;s Privacy Policy
          </a>.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Vercel</h3>
        <p>
          Our website hosting provider. Vercel processes standard web server logs. See{' '}
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">
            Vercel&apos;s Privacy Policy
          </a>.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Supabase</h3>
        <p>
          Used for storing pre-computed pixel data and thumbnails for NFTs. Supabase stores only token-related 
          data (token IDs, pixel arrays) and no personal information. See{' '}
          <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
            Supabase&apos;s Privacy Policy
          </a>.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">4.4 Google Fonts</h3>
        <p>
          We load fonts from Google Fonts. When you visit our website, your browser may make requests to Google 
          servers. See{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
            Google&apos;s Privacy Policy
          </a>.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">4.5 GitHub</h3>
        <p>
          Our code repository and automated workflows. GitHub does not have access to user data from the website. 
          The repository is public. See{' '}
          <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer" className="underline">
            GitHub&apos;s Privacy Statement
          </a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. Blockchain Data</h2>
        <p>
          When you mint or mutate a Spatter, transaction data is recorded on the Ethereum blockchain. This includes:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>Your wallet address</li>
          <li>Transaction hashes</li>
          <li>Token ownership history</li>
          <li>Mutation history</li>
        </ul>
        <p className="mt-4">
          <strong>Blockchain data is permanent and public.</strong> We have no ability to modify or delete 
          information stored on the Ethereum blockchain. This is inherent to blockchain technology and not 
          within our control.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. How We Use Information</h2>
        <p>The limited information we access is used solely to:</p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>Display your owned NFTs and their status</li>
          <li>Enable blockchain transactions (minting, mutations)</li>
          <li>Provide website functionality</li>
          <li>Maintain and improve the website</li>
        </ul>
        <p className="mt-4">
          We do not sell, rent, or share your information with third parties for marketing purposes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
        <p>
          We do not maintain databases of user information. Wallet addresses and transaction data exist only 
          on the Ethereum blockchain. Server logs retained by Vercel are subject to their retention policies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">8. Your Rights</h2>
        <p>
          Depending on your jurisdiction, you may have certain rights regarding your personal information:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">8.1 GDPR (European Users)</h3>
        <p>
          If you are in the European Economic Area, you have rights including access, rectification, erasure, 
          and data portability. However, please note that blockchain data cannot be modified or deleted due to 
          the immutable nature of blockchain technology.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">8.2 CCPA (California Users)</h3>
        <p>
          California residents have the right to know what personal information is collected and to request 
          deletion. As we do not maintain databases of personal information beyond blockchain data, there is 
          limited data we can provide or delete.
        </p>

        <p className="mt-6">
          To exercise any privacy rights or ask questions, contact us at{' '}
          <a href="mailto:spatterseth@gmail.com" className="underline">spatterseth@gmail.com</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">9. Children&apos;s Privacy</h2>
        <p>
          Our website is not intended for users under 18 years of age. We do not knowingly collect information 
          from children. If you believe a child has provided us with personal information, please contact us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">10. Security</h2>
        <p>
          We implement reasonable security measures to protect the website. However, no internet transmission 
          is completely secure. Your wallet security is your responsibility—never share your private keys or 
          seed phrases.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an 
          updated revision date. Your continued use of the website after any changes constitutes acceptance 
          of the new policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">12. Contact</h2>
        <p>
          For privacy-related questions or concerns, please contact:{' '}
          <a href="mailto:spatterseth@gmail.com" className="underline hover:opacity-70">
            spatterseth@gmail.com
          </a>
        </p>
      </section>
    </article>
  );
}

