import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - Spatters',
  description: 'Cookie Policy for Spatters NFT collection',
};

export default function CookiePolicy() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1 className="text-4xl font-black mb-2">Cookie Policy</h1>
      <p className="text-sm opacity-70 mb-8">Last updated: January 2026</p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you 
          visit websites. They are widely used to make websites work more efficiently and to provide information 
          to website owners.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Our Use of Cookies</h2>
        <p>
          <strong>Spatters does not use cookies for tracking or analytics purposes.</strong>
        </p>
        <p className="mt-4">
          We do not use:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-2">
          <li>Google Analytics or similar tracking services</li>
          <li>Marketing or advertising cookies</li>
          <li>Third-party tracking cookies</li>
          <li>Social media tracking pixels</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Essential Functionality</h2>
        <p>
          Our website uses browser <strong>session storage</strong> (not cookies) for essential functionality:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>
            <strong>Mutation Tracking:</strong> We use session storage to temporarily track recently mutated 
            tokens so the UI can refresh appropriately. This data is stored only in your browser, is not 
            transmitted to any server, and is automatically cleared when you close your browser.
          </li>
          <li>
            <strong>Wallet Connection:</strong> When you connect your cryptocurrency wallet using WalletConnect 
            or RainbowKit, these services may use their own storage mechanisms. Please refer to their respective 
            privacy policies for details.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Third-Party Services</h2>
        <p>
          Some third-party services integrated into our website may set their own cookies:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>
            <strong>WalletConnect/RainbowKit:</strong> May use local storage or cookies for wallet connection 
            state. See{' '}
            <a href="https://walletconnect.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
              WalletConnect&apos;s Privacy Policy
            </a>.
          </li>
          <li>
            <strong>Google Fonts:</strong> We load fonts from Google&apos;s servers, which may set cookies according 
            to{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
              Google&apos;s Privacy Policy
            </a>.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. Managing Cookies</h2>
        <p>
          Since we don&apos;t set tracking cookies, there&apos;s nothing to opt out of on our end. However, you can 
          manage cookies and local storage in your browser settings:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>
            <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data
          </li>
          <li>
            <strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data
          </li>
          <li>
            <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
          </li>
          <li>
            <strong>Edge:</strong> Settings → Cookies and site permissions
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. Changes to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. If we begin using cookies in the future, we will 
          update this page accordingly and may implement a cookie consent mechanism.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">7. Contact</h2>
        <p>
          For questions about this Cookie Policy, please contact:{' '}
          <a href="mailto:spatterseth@gmail.com" className="underline hover:opacity-70">
            spatterseth@gmail.com
          </a>
        </p>
      </section>
    </article>
  );
}

