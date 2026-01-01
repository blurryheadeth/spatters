import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Spatters',
  description: 'Terms of Service for Spatters NFT collection',
};

export default function TermsOfService() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1 className="text-4xl font-black mb-2">Terms of Service</h1>
      <p className="text-sm opacity-70 mb-8">Last updated: January 2026</p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Spatters website (spatters.art), connecting a cryptocurrency wallet, 
          minting, purchasing, or interacting with Spatters NFTs, you agree to be bound by these Terms of Service. 
          If you do not agree to these terms, do not use the website or interact with Spatters NFTs.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Eligibility</h2>
        <p>
          You must be at least 18 years old or the legal age of majority in your jurisdiction, whichever is higher, 
          to use this website and interact with Spatters NFTs. By using this website, you represent and warrant 
          that you meet this age requirement.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Description of Spatters</h2>
        <p>
          Spatters is a collection of 999 fully on-chain, generative art NFTs on the Ethereum blockchain. 
          Each Spatter is a unique piece of digital art created algorithmically at the time of minting. 
          The artwork, including all code and visual output, is stored entirely on-chain.
        </p>
        <p className="mt-4">
          Spatters includes a unique mutation system that allows NFT holders to modify their artwork on specific 
          dates each year, creating an evolving piece of collaborative art.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Minting Process</h2>
        <p>
          The Spatters minting process consists of two steps:
        </p>
        <ol className="list-decimal list-inside mt-4 space-y-2">
          <li>
            <strong>Initiate Mint:</strong> Pay the minting fee to reserve your Spatter. This starts a 55-minute 
            generation window.
          </li>
          <li>
            <strong>Complete Mint:</strong> Within the 55-minute window, complete the mint to receive your NFT. 
            If you fail to complete within this window, your mint will expire.
          </li>
        </ol>
        <p className="mt-4">
          <strong>No Refunds:</strong> Minting fees are non-refundable under any circumstances, including but not 
          limited to: failure to complete the mint within the 55-minute window, technical issues, user error, 
          network congestion, or dissatisfaction with the generated artwork. By initiating a mint, you acknowledge 
          and accept this no-refund policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. Mutations</h2>
        <p>
          NFT holders may mutate their Spatters on designated dates. Mutations are a one-step process that 
          permanently modifies the artwork. The specific outcome of a mutation is determined algorithmically 
          and cannot be predetermined or reversed (except through future mutations, if available).
        </p>
        <p className="mt-4">
          Mutations require only gas fees for the blockchain transaction. These gas fees are paid to Ethereum 
          network validators and are non-refundable.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. Smart Contract Risks</h2>
        <p>
          The Spatters smart contract has <strong>not been audited</strong> by any third-party security firm. 
          By interacting with Spatters, you acknowledge and accept all risks associated with unaudited smart 
          contract code, including but not limited to:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>Potential bugs or vulnerabilities in the code</li>
          <li>Loss of funds due to smart contract failures</li>
          <li>Unexpected behavior of contract functions</li>
          <li>Blockchain network issues affecting transactions</li>
        </ul>
        <p className="mt-4">
          You interact with the smart contract entirely at your own risk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">7. Phishing Warning</h2>
        <p>
          It is common for malicious third parties to create fake websites that imitate legitimate NFT projects 
          in order to steal cryptocurrency or NFTs. Before connecting your wallet or signing any transactions, 
          always verify that you are on the official Spatters website:
        </p>
        <p className="mt-4 font-bold text-lg">
          Official website: spatters.art
        </p>
        <p className="mt-4">
          We will <strong>never</strong>:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-2">
          <li>Ask for your private keys or seed phrase</li>
          <li>Send you direct messages asking you to connect your wallet to a different site</li>
          <li>Ask you to &quot;verify&quot; or &quot;validate&quot; your wallet through unofficial links</li>
          <li>Offer surprise airdrops that require you to visit external websites</li>
        </ul>
        <p className="mt-4">
          We take no responsibility for losses resulting from phishing attacks, fake websites, or social 
          engineering scams. Always verify URLs carefully before interacting with any website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">8. Security and Hacking Risks</h2>
        <p>
          It is possible that the Spatters website or related infrastructure may be hacked, compromised, or 
          otherwise maliciously attacked. We implement reasonable security measures but cannot guarantee 
          absolute security.
        </p>
        <p className="mt-4">
          We disclaim any liability for:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-2">
          <li>Unauthorized access to our servers or systems</li>
          <li>Website defacement or modification</li>
          <li>Injection of malicious code</li>
          <li>Data breaches affecting user information</li>
          <li>Any actions taken by users based on information from a compromised website</li>
        </ul>
        <p className="mt-4">
          You remain solely responsible for verifying the authenticity of any transactions you sign and for 
          the security of your own wallet and private keys.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">9. Royalties</h2>
        <p>
          The Spatters smart contract implements the EIP-2981 royalty standard with a 5% royalty on secondary sales. 
          However, this royalty is <strong>optional and voluntary</strong>. Marketplaces and buyers may choose 
          whether to honor this royalty. There is no guarantee that royalties will be paid on any secondary sale.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">10. Prohibited Conduct</h2>
        <p>You agree not to:</p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>Use the website or NFTs for any illegal purpose</li>
          <li>Attempt to interfere with the proper functioning of the website or smart contract</li>
          <li>Circumvent any security measures</li>
          <li>Use automated systems to interact with the website in a manner that could damage or overburden it</li>
          <li>Misrepresent your identity or affiliation</li>
          <li>Use Spatters for money laundering or other financial crimes</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">11. Restricted Jurisdictions</h2>
        <p>
          Spatters is not available to residents of, or persons located in, jurisdictions subject to comprehensive 
          sanctions by the United States, including but not limited to: Iran, North Korea, Cuba, Syria, and the 
          Crimea region of Ukraine. By using this website, you represent that you are not located in, under the 
          control of, or a resident of any such jurisdiction.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">12. Disclaimers</h2>
        <p>
          THE WEBSITE AND NFTS ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, 
          EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING 
          BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p className="mt-4">
          We do not warrant that the website will be uninterrupted, secure, or error-free, that defects will be 
          corrected, or that the website or server are free of viruses or other harmful components.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">13. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL SPATTERS, ITS CREATOR, OR ANY AFFILIATED PARTIES 
          BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT 
          LIMITED TO LOSS OF PROFITS, DATA, USE, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>Your use or inability to use the website or NFTs</li>
          <li>Any unauthorized access to or use of our servers or any personal information</li>
          <li>Any bugs, viruses, or other harmful code transmitted through the website</li>
          <li>Any errors or omissions in any content</li>
          <li>Smart contract failures or unexpected behavior</li>
          <li>Loss of cryptocurrency or NFTs</li>
          <li>Changes in cryptocurrency value</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">14. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless Spatters and its creator from and against any claims, 
          liabilities, damages, losses, and expenses arising out of or in any way connected with your access to 
          or use of the website or NFTs, your violation of these Terms, or your violation of any third-party rights.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">15. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, 
          United States, without regard to its conflict of law provisions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">16. Dispute Resolution</h2>
        <p>
          Any dispute arising out of or relating to these Terms or your use of the website or NFTs shall be 
          resolved through binding arbitration in accordance with the rules of the American Arbitration Association. 
          The arbitration shall be conducted in the English language. Judgment on any arbitration award may be 
          entered in any court of competent jurisdiction.
        </p>
        <p className="mt-4">
          Notwithstanding the foregoing, either party may seek injunctive or other equitable relief in any court 
          of competent jurisdiction to prevent the actual or threatened infringement of intellectual property rights.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">17. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting 
          to the website. Your continued use of the website after any changes constitutes acceptance of the new Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">18. Severability</h2>
        <p>
          If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited 
          or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force 
          and effect.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">19. Contact</h2>
        <p>
          For questions about these Terms, please contact:{' '}
          <a href="mailto:spatterseth@gmail.com" className="underline hover:opacity-70">
            spatterseth@gmail.com
          </a>
        </p>
      </section>
    </article>
  );
}

