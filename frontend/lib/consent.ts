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
 */
export function generateConsentMessage(walletAddress: string): string {
  const timestamp = new Date().toISOString();
  return `I hereby acknowledge that I have read, understood, and agree to be bound by the Spatters Terms of Service, Privacy Policy, Cookie Policy, NFT License Agreement, Copyright Policy, and Risk Disclosure as published at spatters.art/legal.

I understand that:
- Minting fees are non-refundable under any circumstances
- The smart contract has not been audited
- NFTs have no guaranteed secondary market value
- The artist may mint tokens without paying minting fees
- I am at least 18 years old or the legal age of majority in my jurisdiction
- I am not located in a sanctioned jurisdiction

Wallet: ${walletAddress}
Terms Version: ${CURRENT_TERMS_VERSION}
Signed at: ${timestamp}`;
}

/**
 * Parse the timestamp from a signed consent message
 */
export function parseSignedAt(message: string): string {
  const match = message.match(/Signed at: (.+)$/);
  return match ? match[1] : new Date().toISOString();
}

/**
 * Verify that a message matches the expected format and terms version
 */
export function verifyConsentMessage(message: string, walletAddress: string): boolean {
  // Check that the message contains the expected wallet address
  if (!message.includes(`Wallet: ${walletAddress}`)) {
    return false;
  }
  
  // Check that it contains the current terms version
  if (!message.includes(`Terms Version: ${CURRENT_TERMS_VERSION}`)) {
    return false;
  }
  
  // Check that it contains the key acknowledgments
  const requiredPhrases = [
    'Minting fees are non-refundable',
    'smart contract has not been audited',
    'no guaranteed secondary market value',
    'at least 18 years old',
  ];
  
  return requiredPhrases.every(phrase => message.includes(phrase));
}

