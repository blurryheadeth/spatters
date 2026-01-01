import type { Metadata } from 'next';

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
    <div className="space-y-16">
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
      <nav className="border-2 p-6" style={{ borderColor: COLORS.black, backgroundColor: '#fff' }}>
        <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li><a href="#risk-disclosure" className="underline hover:opacity-70" style={{ color: COLORS.red }}>Risk Disclosure</a> (READ FIRST)</li>
          <li><a href="#terms-of-service" className="underline hover:opacity-70">Terms of Service</a></li>
          <li><a href="#privacy-policy" className="underline hover:opacity-70">Privacy Policy</a></li>
          <li><a href="#nft-license" className="underline hover:opacity-70">NFT License Agreement</a></li>
          <li><a href="#cookie-policy" className="underline hover:opacity-70">Cookie Policy</a></li>
          <li><a href="#copyright" className="underline hover:opacity-70">Copyright & DMCA Policy</a></li>
        </ol>
      </nav>

      {/* ==================== RISK DISCLOSURE ==================== */}
      <article id="risk-disclosure" className="prose prose-lg max-w-none scroll-mt-8">
        <div className="border-b-4 pb-4 mb-8" style={{ borderColor: COLORS.red }}>
          <h1 className="text-4xl font-black mb-2" style={{ color: COLORS.red }}>1. RISK DISCLOSURE</h1>
          <p className="text-sm opacity-70">Last updated: January 2026</p>
        </div>

        <div 
          className="p-6 mb-8 border-2 border-red-500 bg-red-50"
          style={{ borderRadius: '0' }}
        >
          <p className="font-bold text-red-700 mb-2">IMPORTANT: Please Read Carefully</p>
          <p className="text-red-700">
            Interacting with NFTs and cryptocurrency involves significant risks. You should carefully consider 
            whether minting, purchasing, or interacting with Spatters NFTs is appropriate for you in light of 
            your financial situation and risk tolerance.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1.1 Not Financial or Investment Advice</h2>
          <p>
            <strong>Spatters NFTs are digital art, not investments.</strong> Nothing on this website constitutes 
            financial, investment, legal, or tax advice. You should consult your own advisors before making any 
            decisions related to cryptocurrency or NFTs.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1.2 No Guaranteed Value</h2>
          <p>
            <strong>There is no guarantee that Spatters NFTs will have any secondary market value.</strong> By 
            minting a Spatter, you acknowledge and accept that:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>You may never be able to sell your Spatter NFT</li>
            <li>The secondary market value, if any, may be less than the minting cost</li>
            <li>Market conditions for NFTs are highly volatile and unpredictable</li>
            <li>The minting fee should be considered a payment for digital art, not an investment</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1.3 Non-Refundable Minting Fees</h2>
          <p>
            <strong>All minting fees are NON-REFUNDABLE under ANY circumstances.</strong> This applies regardless of:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>Whether you complete the mint within the 55-minute window</li>
            <li>Whether you are satisfied with the generated artwork</li>
            <li>Technical issues or user errors</li>
            <li>Network congestion or failed transactions</li>
            <li>Any future changes to the project</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1.4 Unaudited Smart Contract</h2>
          <p className="font-bold text-red-600">
            THE SPATTERS SMART CONTRACT HAS NOT BEEN AUDITED.
          </p>
          <p className="mt-4">
            This means there may be bugs, vulnerabilities, or unexpected behaviors in the code that could result 
            in loss of funds or NFTs. By interacting with the Spatters smart contract, you accept full responsibility 
            for any losses that may result from these risks.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1.5 Artist Minting Rights</h2>
          <p>
            The artist (creator of Spatters) has the ability to mint new Spatters NFTs within the 999 token limit 
            at any time <strong>without paying the minting fee</strong> that would be required of regular users. 
            The artist may sell these tokens at any price, including below the current public mint price.
            <strong> This may affect the secondary market value of other Spatters.</strong>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1.6 Assumption of Risk</h2>
          <p>
            By minting, purchasing, holding, or interacting with Spatters NFTs, you expressly acknowledge that 
            you have read and understood all risks described herein, you assume full responsibility for all risks, 
            you will not hold Spatters or its creator liable for any losses, and you have the financial ability 
            to bear the complete loss of any amounts spent.
          </p>
        </section>
      </article>

      {/* ==================== TERMS OF SERVICE ==================== */}
      <article id="terms-of-service" className="prose prose-lg max-w-none scroll-mt-8">
        <div className="border-b-4 pb-4 mb-8" style={{ borderColor: COLORS.black }}>
          <h1 className="text-4xl font-black mb-2">2. TERMS OF SERVICE</h1>
          <p className="text-sm opacity-70">Last updated: January 2026</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2.1 Acceptance of Terms</h2>
          <p>
            By accessing or using the Spatters website (spatters.art), connecting a cryptocurrency wallet, 
            minting, purchasing, or interacting with Spatters NFTs, you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, do not use the website or interact with Spatters NFTs.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2.2 Eligibility</h2>
          <p>
            You must be at least 18 years old or the legal age of majority in your jurisdiction, whichever is higher, 
            to use this website and interact with Spatters NFTs. By using this website, you represent and warrant 
            that you meet this age requirement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2.3 Description of Spatters</h2>
          <p>
            Spatters is a collection of 999 fully on-chain, generative art NFTs on the Ethereum blockchain. 
            Each Spatter is a unique piece of digital art created algorithmically at the time of minting. 
            Spatters includes a unique mutation system that allows NFT holders to modify their artwork on specific 
            dates each year.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2.4 Minting Process</h2>
          <p>
            The Spatters minting process consists of two steps: (1) Initiate Mint by paying the minting fee to 
            start a 55-minute generation window, and (2) Complete Mint within the window to receive your NFT. 
            If you fail to complete within this window, your mint will expire. <strong>Minting fees are 
            non-refundable under any circumstances.</strong>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2.5 Phishing Warning</h2>
          <p>
            Always verify you are on the official website: <strong>spatters.art</strong>. We will never ask for 
            your private keys or seed phrase, send direct messages asking you to connect your wallet to a different 
            site, or offer surprise airdrops requiring external websites.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2.6 Royalties</h2>
          <p>
            The Spatters smart contract implements the EIP-2981 royalty standard with a 5% royalty on secondary sales. 
            However, this royalty is <strong>optional and voluntary</strong>. Marketplaces and buyers may choose 
            whether to honor this royalty.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2.7 Restricted Jurisdictions</h2>
          <p>
            Spatters is not available to residents of jurisdictions subject to comprehensive sanctions by the 
            United States, including Iran, North Korea, Cuba, Syria, and the Crimea region of Ukraine.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2.8 Disclaimers</h2>
          <p>
            THE WEBSITE AND NFTS ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND. 
            TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF 
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2.9 Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL SPATTERS, ITS CREATOR, OR ANY AFFILIATED 
            PARTIES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING 
            LOSS OF PROFITS, DATA, USE, OR OTHER INTANGIBLE LOSSES.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2.10 Governing Law & Dispute Resolution</h2>
          <p>
            These Terms shall be governed by the laws of the State of Delaware, United States. Any disputes shall 
            be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
          </p>
        </section>
      </article>

      {/* ==================== PRIVACY POLICY ==================== */}
      <article id="privacy-policy" className="prose prose-lg max-w-none scroll-mt-8">
        <div className="border-b-4 pb-4 mb-8" style={{ borderColor: COLORS.black }}>
          <h1 className="text-4xl font-black mb-2">3. PRIVACY POLICY</h1>
          <p className="text-sm opacity-70">Last updated: January 2026</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3.1 Information We Collect</h2>
          <p>
            When you connect your cryptocurrency wallet using WalletConnect or RainbowKit, we receive your public 
            wallet address. This is used to display your owned NFTs, enable transactions, and verify ownership. 
            Wallet addresses are public blockchain data and are not stored in our databases.
          </p>
          <p className="mt-4">
            Our hosting provider (Vercel) automatically collects standard web server logs including IP addresses, 
            browser information, and pages visited.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3.2 Information We Do NOT Collect</h2>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li><strong>No analytics cookies</strong> - We do not use Google Analytics or similar tracking</li>
            <li><strong>No marketing cookies</strong> - We do not use advertising trackers</li>
            <li><strong>No email addresses</strong> - We do not collect or store emails</li>
            <li><strong>No personal information</strong> - We do not collect names or addresses</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3.3 Third-Party Services</h2>
          <p>
            We use WalletConnect/RainbowKit (wallet connection), Vercel (hosting), Supabase (NFT data storage), 
            Google Fonts, and GitHub. These services have their own privacy policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3.4 Blockchain Data</h2>
          <p>
            <strong>Blockchain data is permanent and public.</strong> Transaction data including wallet addresses, 
            token ownership, and mutation history is recorded on Ethereum and cannot be modified or deleted.
          </p>
        </section>
      </article>

      {/* ==================== NFT LICENSE ==================== */}
      <article id="nft-license" className="prose prose-lg max-w-none scroll-mt-8">
        <div className="border-b-4 pb-4 mb-8" style={{ borderColor: COLORS.black }}>
          <h1 className="text-4xl font-black mb-2">4. NFT LICENSE AGREEMENT</h1>
          <p className="text-sm opacity-70">Last updated: January 2026</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4.1 Universal Rights (CC0-Style)</h2>
          <p>
            Spatters grants <strong>full, unrestricted commercial and non-commercial rights</strong> to the 
            artwork to <strong>everyone</strong>, regardless of whether they own the NFT. Anyone may use, copy, 
            modify, distribute, display, and create derivative works from any Spatter artwork for any purpose, 
            including commercial use. No attribution is required.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4.2 What the NFT Represents</h2>
          <p>
            Owning a Spatters NFT grants you on-chain proof of ownership, the ability to mutate the artwork on 
            designated dates, and the ability to transfer or sell the NFT. The NFT represents ownership of the 
            token itself, not exclusive rights to the artwork.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4.3 Third-Party Code</h2>
          <p>
            Spatters uses the p5.js library, licensed under GNU LGPL 2.1. The on-chain version was deployed by 
            Art Blocks and is used in accordance with its license terms.
          </p>
        </section>
      </article>

      {/* ==================== COOKIE POLICY ==================== */}
      <article id="cookie-policy" className="prose prose-lg max-w-none scroll-mt-8">
        <div className="border-b-4 pb-4 mb-8" style={{ borderColor: COLORS.black }}>
          <h1 className="text-4xl font-black mb-2">5. COOKIE POLICY</h1>
          <p className="text-sm opacity-70">Last updated: January 2026</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5.1 Our Use of Cookies</h2>
          <p>
            <strong>Spatters does not use cookies for tracking or analytics purposes.</strong> We do not use 
            Google Analytics, marketing cookies, third-party tracking cookies, or social media tracking pixels.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5.2 Essential Functionality</h2>
          <p>
            Our website uses browser session storage (not cookies) for essential functionality like temporarily 
            tracking recently mutated tokens. This data is stored only in your browser and is automatically 
            cleared when you close your browser.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5.3 Third-Party Services</h2>
          <p>
            WalletConnect/RainbowKit and Google Fonts may set their own cookies. Please refer to their respective 
            privacy policies for details.
          </p>
        </section>
      </article>

      {/* ==================== COPYRIGHT & DMCA ==================== */}
      <article id="copyright" className="prose prose-lg max-w-none scroll-mt-8">
        <div className="border-b-4 pb-4 mb-8" style={{ borderColor: COLORS.black }}>
          <h1 className="text-4xl font-black mb-2">6. COPYRIGHT & DMCA POLICY</h1>
          <p className="text-sm opacity-70">Last updated: January 2026</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6.1 Spatters Artwork License</h2>
          <p>
            Spatters artwork is released under a CC0-style license, meaning the artwork is effectively in the 
            public domain. Anyone may use, copy, modify, and distribute Spatters artwork for any purpose.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6.2 DMCA Notices</h2>
          <p>
            If you believe content on our website infringes your copyright, you may submit a DMCA notification 
            to <strong>spatterseth@gmail.com</strong> with subject line &quot;DMCA Takedown Request&quot;.
          </p>
          <p className="mt-4">
            <strong>Important:</strong> Due to the immutable nature of blockchain technology, we cannot modify 
            or remove content stored on-chain. DMCA requests can only apply to content hosted on our website.
          </p>
        </section>
      </article>

      {/* Footer */}
      <div 
        className="mt-16 pt-8 border-t-2 text-center"
        style={{ borderColor: COLORS.black }}
      >
        <p className="text-sm opacity-70">
          Contact for all legal matters: <a href="mailto:spatterseth@gmail.com" className="underline">spatterseth@gmail.com</a>
        </p>
        <p className="text-sm opacity-70 mt-2">
          Official website: <a href="https://spatters.art" className="underline">spatters.art</a>
        </p>
        <p className="text-sm opacity-50 mt-4">
          This page contains all legal documents in a single location for on-chain reference.
        </p>
      </div>
    </div>
  );
}

