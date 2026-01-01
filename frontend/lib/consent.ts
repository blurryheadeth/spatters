// Consent utilities for legal acceptance tracking
// Consent is only persisted to database AFTER successful mint payment

export const CURRENT_TERMS_VERSION = '2026-01-v1';

export interface ConsentData {
  walletAddress: string;
  signature: string;
  message: string;
  termsVersion: string;
  signedAt: string; // ISO timestamp
}

/**
 * Generate the consent message that users will sign
 * This message must be explicit and unambiguous about all key terms
 */
export function generateConsentMessage(walletAddress: string): string {
  const timestamp = new Date().toISOString();
  return `SPATTERS NFT MINTING AGREEMENT

By signing this message, I confirm that I have read, understood, and agree to be legally bound by all of the following documents published at spatters.art/legal:

1. Terms of Service (spatters.art/legal/terms)
2. Privacy Policy (spatters.art/legal/privacy)
3. Cookie Policy (spatters.art/legal/cookies)
4. NFT License Agreement (spatters.art/legal/nft-license)
5. Copyright Policy (spatters.art/legal/copyright)
6. Risk Disclosure (spatters.art/legal/risk-disclosure)

I EXPLICITLY ACKNOWLEDGE AND AGREE THAT:

NON-REFUNDABLE PAYMENT:
- The minting fee I am about to pay is NON-REFUNDABLE under ANY circumstances.
- If I fail to select one of the three artwork options within the 45-minute window, my minting fee will NOT be refunded.
- If I abandon the minting process for any reason, my minting fee will NOT be refunded.
- There are no exceptions to this non-refund policy.

NOT AN INVESTMENT:
- I am NOT paying this minting fee for investment purposes.
- I am NOT purchasing this NFT with any expectation of profit or financial return.
- I understand this is a purchase of digital art, not a financial instrument or security.

NO GUARANTEED VALUE:
- I understand and accept that the NFT I receive may have ZERO monetary value.
- I do NOT expect the NFT to have any resale value whatsoever.
- I accept that there may be no secondary market for this NFT.
- I will not hold the artist or project liable for any financial losses.

UNAUDITED SMART CONTRACT:
- The smart contract has NOT been audited by any third party.
- I accept all risks associated with interacting with unaudited blockchain code.

ARTIST MINTING RIGHTS:
- The artist may mint and sell tokens without paying the minting fee.
- This may affect secondary market value and I accept this risk.

ELIGIBILITY:
- I am at least 18 years old or the legal age of majority in my jurisdiction.
- I am NOT located in a sanctioned or restricted jurisdiction.
- I am legally permitted to interact with blockchain applications.

I HAVE READ ALL REFERENCED DOCUMENTS IN FULL AND AGREE TO ALL TERMS.

Wallet Address: ${walletAddress}
Terms Version: ${CURRENT_TERMS_VERSION}
Signature Timestamp: ${timestamp}`;
}

/**
 * Parse the timestamp from a signed consent message
 */
export function parseSignedAt(message: string): string {
  const match = message.match(/Signature Timestamp: (.+)$/m);
  return match ? match[1] : new Date().toISOString();
}

/**
 * Verify that a message matches the expected format and terms version
 */
export function verifyConsentMessage(message: string, walletAddress: string): boolean {
  // Check that the message contains the expected wallet address
  if (!message.includes(`Wallet Address: ${walletAddress}`)) {
    return false;
  }
  
  // Check that it contains the current terms version
  if (!message.includes(`Terms Version: ${CURRENT_TERMS_VERSION}`)) {
    return false;
  }
  
  // Check that it contains the key acknowledgments (case-insensitive for robustness)
  const requiredPhrases = [
    'NON-REFUNDABLE',
    'NOT an investment',
    'NOT expect the NFT to have any resale value',
    'ZERO monetary value',
    'NOT been audited',
    'at least 18 years old',
    'I HAVE READ ALL REFERENCED DOCUMENTS',
  ];
  
  const upperMessage = message.toUpperCase();
  return requiredPhrases.every(phrase => upperMessage.includes(phrase.toUpperCase()));
}

