import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Copyright & DMCA - Spatters',
  description: 'Copyright and DMCA Policy for Spatters NFT collection',
};

export default function CopyrightPolicy() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1 className="text-4xl font-black mb-2">Copyright & DMCA Policy</h1>
      <p className="text-sm opacity-70 mb-8">Last updated: January 2026</p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Spatters Artwork License</h2>
        <p>
          Spatters artwork is released under a <strong>CC0-style license</strong>, meaning the artwork is 
          effectively in the public domain. Anyone may use, copy, modify, and distribute Spatters artwork 
          for any purpose, including commercial use, without permission or attribution.
        </p>
        <p className="mt-4">
          For full details on the rights granted, please see our{' '}
          <a href="/legal/nft-license" className="underline">NFT License Agreement</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Third-Party Content</h2>
        <p>
          The Spatters website and smart contract use the following third-party components:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>
            <strong>p5.js Library:</strong> Licensed under LGPL 2.1. The on-chain version was deployed by 
            Art Blocks and is used in accordance with its license terms.
          </li>
        </ul>
        <p className="mt-4">
          We respect the intellectual property rights of others and expect users of our platform to do the same.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Copyright Infringement Notification (DMCA)</h2>
        <p>
          If you believe that content on our website infringes your copyright, you may submit a notification 
          pursuant to the Digital Millennium Copyright Act (DMCA) by providing the following information:
        </p>
        <ol className="list-decimal list-inside mt-4 space-y-3">
          <li>
            A physical or electronic signature of a person authorized to act on behalf of the owner of the 
            copyright interest.
          </li>
          <li>
            Identification of the copyrighted work claimed to have been infringed, or if multiple works are 
            covered by a single notification, a representative list of such works.
          </li>
          <li>
            Identification of the material that is claimed to be infringing and information reasonably 
            sufficient to permit us to locate the material (e.g., URL).
          </li>
          <li>
            Your contact information, including address, telephone number, and email address.
          </li>
          <li>
            A statement that you have a good faith belief that the use of the material is not authorized by 
            the copyright owner, its agent, or the law.
          </li>
          <li>
            A statement, made under penalty of perjury, that the information in your notification is accurate 
            and that you are authorized to act on behalf of the copyright owner.
          </li>
        </ol>
        <p className="mt-6">
          <strong>Send DMCA notices to:</strong>
        </p>
        <p className="mt-2">
          Email:{' '}
          <a href="mailto:spatterseth@gmail.com" className="underline">
            spatterseth@gmail.com
          </a>
        </p>
        <p className="mt-2">
          Subject line: &quot;DMCA Takedown Request&quot;
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Counter-Notification</h2>
        <p>
          If you believe that your content was removed or disabled by mistake or misidentification, you may 
          submit a counter-notification containing:
        </p>
        <ol className="list-decimal list-inside mt-4 space-y-3">
          <li>Your physical or electronic signature.</li>
          <li>
            Identification of the content that was removed and the location where it appeared before removal.
          </li>
          <li>
            A statement under penalty of perjury that you have a good faith belief that the content was 
            removed as a result of mistake or misidentification.
          </li>
          <li>
            Your name, address, and telephone number, and a statement that you consent to the jurisdiction 
            of the federal court in your district (or Delaware if outside the US), and that you will accept 
            service of process from the person who provided the original DMCA notification.
          </li>
        </ol>
        <p className="mt-6">
          <strong>Send counter-notifications to:</strong>
        </p>
        <p className="mt-2">
          Email:{' '}
          <a href="mailto:spatterseth@gmail.com" className="underline">
            spatterseth@gmail.com
          </a>
        </p>
        <p className="mt-2">
          Subject line: &quot;DMCA Counter-Notification&quot;
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. Repeat Infringers</h2>
        <p>
          In accordance with the DMCA and other applicable law, we have adopted a policy of terminating, in 
          appropriate circumstances and at our sole discretion, access for users who are deemed to be repeat 
          infringers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. Blockchain Limitations</h2>
        <p>
          <strong>Important:</strong> Spatters artwork and metadata are stored on the Ethereum blockchain. 
          Due to the immutable nature of blockchain technology, we cannot modify or remove content that has 
          been recorded on-chain. DMCA takedown requests can only apply to content hosted on our website 
          (spatters.art), not to on-chain data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">7. Contact</h2>
        <p>
          For copyright-related questions, please contact:{' '}
          <a href="mailto:spatterseth@gmail.com" className="underline hover:opacity-70">
            spatterseth@gmail.com
          </a>
        </p>
      </section>
    </article>
  );
}

