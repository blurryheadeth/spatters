import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Risk Disclosure - Spatters',
  description: 'Risk Disclosure for Spatters NFT collection',
};

export default function RiskDisclosure() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1 className="text-4xl font-black mb-2">Risk Disclosure</h1>
      <p className="text-sm opacity-70 mb-8">Last updated: January 2026</p>

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
        <h2 className="text-2xl font-bold mb-4">1. Not Financial or Investment Advice</h2>
        <p>
          <strong>Spatters NFTs are digital art, not investments.</strong> Nothing on this website constitutes 
          financial, investment, legal, or tax advice. You should consult your own advisors before making any 
          decisions related to cryptocurrency or NFTs.
        </p>
        <p className="mt-4">
          We make no representations or recommendations regarding the purchase, sale, or holding of Spatters 
          NFTs. Any decision to mint or purchase a Spatter is made entirely at your own discretion and risk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. No Guaranteed Value</h2>
        <p>
          <strong>There is no guarantee that Spatters NFTs will have any secondary market value.</strong> By 
          minting a Spatter, you acknowledge and accept that:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>You may never be able to sell your Spatter NFT</li>
          <li>The secondary market value, if any, may be less than the minting cost</li>
          <li>Market conditions for NFTs are highly volatile and unpredictable</li>
          <li>Past performance of similar NFT projects is not indicative of future results</li>
          <li>The minting fee should be considered a payment for digital art, not an investment</li>
        </ul>
        <p className="mt-4">
          <strong>You should only mint if you genuinely want to own the artwork</strong>, regardless of any 
          potential financial return.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Cryptocurrency Volatility</h2>
        <p>
          The value of Ethereum (ETH) fluctuates significantly. This means:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>
            The real-world cost of minting or purchasing a Spatter depends on ETH price at the time of 
            transaction
          </li>
          <li>
            Gas fees (transaction costs) can vary dramatically based on network congestion
          </li>
          <li>
            The fiat-currency value of your NFT changes constantly, independent of any change in its NFT 
            market value
          </li>
          <li>
            Exchange rates between ETH and fiat currencies are outside our control
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Smart Contract Risks</h2>
        <p className="font-bold text-red-600">
          THE SPATTERS SMART CONTRACT HAS NOT BEEN AUDITED.
        </p>
        <p className="mt-4">
          This means there may be bugs, vulnerabilities, or unexpected behaviors in the code that could result 
          in loss of funds or NFTs. Specific risks include:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>
            <strong>Code bugs:</strong> The smart contract may contain errors that cause unintended behavior
          </li>
          <li>
            <strong>Security vulnerabilities:</strong> The contract may be susceptible to exploits
          </li>
          <li>
            <strong>Logic errors:</strong> The minting, mutation, or transfer processes may not work as 
            expected in all circumstances
          </li>
          <li>
            <strong>Irreversibility:</strong> Blockchain transactions cannot be reversed; mistakes are permanent
          </li>
        </ul>
        <p className="mt-4">
          By interacting with the Spatters smart contract, you accept full responsibility for any losses that 
          may result from these risks.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. Blockchain and Network Risks</h2>
        <p>
          Using Ethereum and interacting with smart contracts carries inherent risks:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>
            <strong>Network congestion:</strong> High traffic can cause delays and increased gas costs
          </li>
          <li>
            <strong>Failed transactions:</strong> Transactions may fail and still consume gas fees
          </li>
          <li>
            <strong>Chain reorganizations:</strong> In rare cases, confirmed transactions may be reversed
          </li>
          <li>
            <strong>Protocol changes:</strong> Future changes to Ethereum could affect NFT functionality
          </li>
          <li>
            <strong>Node failures:</strong> RPC providers may experience outages affecting website functionality
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. Wallet Security</h2>
        <p>
          Your cryptocurrency wallet and its contents are your sole responsibility. You must:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>
            <strong>Never share your private keys or seed phrase</strong> with anyone, for any reason
          </li>
          <li>
            Verify you are on the correct website (spatters.art) before connecting your wallet
          </li>
          <li>
            Be aware of phishing attacks, fake websites, and social engineering scams
          </li>
          <li>
            Understand that lost private keys mean permanent loss of access to your NFTs
          </li>
          <li>
            Use hardware wallets or other secure storage methods for valuable assets
          </li>
        </ul>
        <p className="mt-4">
          We will never ask for your private keys, seed phrase, or passwords.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">7. No Refunds</h2>
        <p>
          <strong>All minting fees are non-refundable.</strong> This applies regardless of:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>Whether you complete the mint within the 55-minute window</li>
          <li>Whether you are satisfied with the generated artwork</li>
          <li>Technical issues or user errors</li>
          <li>Network congestion or failed transactions</li>
          <li>Any future changes to the project</li>
        </ul>
        <p className="mt-4">
          Gas fees paid for transactions go directly to Ethereum network validators and are always non-refundable.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">8. Royalties</h2>
        <p>
          Spatters implements a 5% royalty via the EIP-2981 standard. However:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>
            This royalty is <strong>optional and voluntary</strong>
          </li>
          <li>
            NFT marketplaces are not required to enforce or honor this royalty
          </li>
          <li>
            Peer-to-peer transfers and some marketplaces may bypass royalties entirely
          </li>
          <li>
            There is no guarantee that any royalty will be paid on any secondary sale
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">9. Regulatory Uncertainty</h2>
        <p>
          The regulatory environment for NFTs and cryptocurrency is evolving and uncertain:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>
            Laws and regulations regarding NFTs vary by jurisdiction and may change
          </li>
          <li>
            Future regulations could affect the legality, usability, or value of NFTs
          </li>
          <li>
            Tax treatment of NFTs varies by jurisdiction and is subject to change
          </li>
          <li>
            You are solely responsible for understanding and complying with laws in your jurisdiction
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">10. Artist Minting Rights</h2>
        <p>
          The artist (creator of Spatters) has the ability to mint new Spatters NFTs within the 999 token limit 
          at any time <strong>without paying the minting fee</strong> that would be required of regular users. 
          The artist may:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>Mint new tokens at any time without cost (beyond gas fees)</li>
          <li>Sell these tokens at any price, including below the current public mint price</li>
          <li>Transfer these tokens for free to any wallet</li>
          <li>List these tokens on secondary markets at any price</li>
        </ul>
        <p className="mt-4">
          <strong>This may affect the secondary market value of other Spatters.</strong> By minting or purchasing 
          a Spatter, you acknowledge and accept this risk and agree not to hold the artist liable for any impact 
          on the value of your NFTs resulting from the artist&apos;s minting or selling activities.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">11. No Guarantees About the Project</h2>
        <p>
          We make no guarantees about:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>Future development or updates to the website or collection</li>
          <li>Continued operation of the website</li>
          <li>Future mutation dates or features</li>
          <li>Integration with marketplaces or other platforms</li>
          <li>Any roadmap, timeline, or future plans</li>
        </ul>
        <p className="mt-4">
          The smart contract and artwork are on-chain and will persist independently of the website, but 
          website features and services may change or be discontinued at any time.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">12. Assumption of Risk</h2>
        <p>
          By minting, purchasing, holding, or interacting with Spatters NFTs, you expressly acknowledge that:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li>You have read and understood all risks described in this disclosure</li>
          <li>You assume full responsibility for all risks associated with your use of Spatters</li>
          <li>You will not hold Spatters or its creator liable for any losses</li>
          <li>You are acting voluntarily and with full knowledge of the risks involved</li>
          <li>You have the financial ability to bear the complete loss of any amounts spent</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">13. Contact</h2>
        <p>
          For questions about these risks, please contact:{' '}
          <a href="mailto:spatterseth@gmail.com" className="underline hover:opacity-70">
            spatterseth@gmail.com
          </a>
        </p>
      </section>
    </article>
  );
}

