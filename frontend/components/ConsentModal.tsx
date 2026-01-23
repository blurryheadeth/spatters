'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSignMessage } from 'wagmi';
import { generateConsentMessage, CURRENT_TERMS_VERSION, ConsentData, parseSignedAt } from '@/lib/consent';

// Spatters color palette
const COLORS = {
  background: '#EBE5D9',
  red: '#fc1a4a',
  green: '#75d494',
  blue: '#2587c3',
  yellow: '#f2c945',
  black: '#000000',
  white: '#FFFFFF',
};

interface ConsentModalProps {
  walletAddress: string;
  onConsent: (consentData: ConsentData) => void;
  onCancel: () => void;
}

export default function ConsentModal({ walletAddress, onConsent, onCancel }: ConsentModalProps) {
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
  const [hasReadRisks, setHasReadRisks] = useState(false);
  const [acknowledgesNoRefund, setAcknowledgesNoRefund] = useState(false);
  const [acknowledgesNotInvestment, setAcknowledgesNotInvestment] = useState(false);
  const [acknowledgesHardwareRequirements, setAcknowledgesHardwareRequirements] = useState(false);
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signMessageAsync } = useSignMessage();

  const allChecked = hasReadTerms && hasReadPrivacy && hasReadRisks && acknowledgesNoRefund && acknowledgesNotInvestment && acknowledgesHardwareRequirements && isAgeConfirmed;

  const handleSign = async () => {
    if (!allChecked) return;

    setIsSigning(true);
    setError(null);

    try {
      const message = generateConsentMessage(walletAddress);
      const signature = await signMessageAsync({ message });

      const consentData: ConsentData = {
        walletAddress,
        signature,
        message,
        termsVersion: CURRENT_TERMS_VERSION,
        signedAt: parseSignedAt(message),
      };

      onConsent(consentData);
    } catch (err) {
      console.error('Signing failed:', err);
      setError('Failed to sign. Please try again.');
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div 
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto border-4 p-6"
        style={{ backgroundColor: COLORS.background, borderColor: COLORS.black }}
      >
        <h2 className="text-2xl font-black mb-4" style={{ color: COLORS.black }}>
          Legal Acknowledgment Required
        </h2>

        <p className="mb-4 text-sm" style={{ color: COLORS.black }}>
          Before minting, you must read and acknowledge our legal documents. Your wallet will sign a 
          message confirming your acceptance. This signature will only be stored after you complete 
          the mint payment.
        </p>

        {/* Checkboxes */}
        <div className="space-y-3 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasReadTerms}
              onChange={(e) => setHasReadTerms(e.target.checked)}
              className="mt-1 w-5 h-5 flex-shrink-0"
              style={{ accentColor: COLORS.green }}
            />
            <span className="text-sm" style={{ color: COLORS.black }}>
              I have read and agree to the{' '}
              <Link href="/legal/terms" target="_blank" className="underline font-bold" style={{ color: COLORS.blue }}>
                Terms of Service
              </Link>
              ,{' '}
              <Link href="/legal/nft-license" target="_blank" className="underline font-bold" style={{ color: COLORS.blue }}>
                NFT License
              </Link>
              , and{' '}
              <Link href="/legal/copyright" target="_blank" className="underline font-bold" style={{ color: COLORS.blue }}>
                Copyright Policy
              </Link>
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasReadPrivacy}
              onChange={(e) => setHasReadPrivacy(e.target.checked)}
              className="mt-1 w-5 h-5 flex-shrink-0"
              style={{ accentColor: COLORS.green }}
            />
            <span className="text-sm" style={{ color: COLORS.black }}>
              I have read the{' '}
              <Link href="/legal/privacy" target="_blank" className="underline font-bold" style={{ color: COLORS.blue }}>
                Privacy Policy
              </Link>
              {' '}and{' '}
              <Link href="/legal/cookies" target="_blank" className="underline font-bold" style={{ color: COLORS.blue }}>
                Cookie Policy
              </Link>
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasReadRisks}
              onChange={(e) => setHasReadRisks(e.target.checked)}
              className="mt-1 w-5 h-5 flex-shrink-0"
              style={{ accentColor: COLORS.green }}
            />
            <span className="text-sm" style={{ color: COLORS.black }}>
              I have read and understand the{' '}
              <Link href="/legal/risk-disclosure" target="_blank" className="underline font-bold" style={{ color: COLORS.red }}>
                Risk Disclosure
              </Link>
              , including that the smart contract is <strong>unaudited</strong> and the artist may mint tokens without paying the minting fee
            </span>
          </label>

          {/* Key explicit acknowledgments */}
          <div 
            className="p-3 border-2 space-y-3"
            style={{ borderColor: COLORS.red, backgroundColor: '#fff5f5' }}
          >
            <p className="text-xs font-bold" style={{ color: COLORS.red }}>
              IMPORTANT: Please read and acknowledge the following:
            </p>
            
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledgesNoRefund}
                onChange={(e) => setAcknowledgesNoRefund(e.target.checked)}
                className="mt-1 w-5 h-5 flex-shrink-0"
                style={{ accentColor: COLORS.red }}
              />
              <span className="text-sm" style={{ color: COLORS.black }}>
                I understand that my minting fee is <strong style={{ color: COLORS.red }}>NON-REFUNDABLE under ANY circumstances</strong>, 
                including if I fail to select one of the three artwork options within the 45-minute window
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledgesNotInvestment}
                onChange={(e) => setAcknowledgesNotInvestment(e.target.checked)}
                className="mt-1 w-5 h-5 flex-shrink-0"
                style={{ accentColor: COLORS.red }}
              />
              <span className="text-sm" style={{ color: COLORS.black }}>
                I am <strong style={{ color: COLORS.red }}>NOT</strong> paying this minting fee for investment purposes. 
                I understand the NFT I receive may have <strong style={{ color: COLORS.red }}>ZERO monetary value</strong> and 
                I do <strong style={{ color: COLORS.red }}>NOT</strong> expect any resale value or financial return
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledgesHardwareRequirements}
                onChange={(e) => setAcknowledgesHardwareRequirements(e.target.checked)}
                className="mt-1 w-5 h-5 flex-shrink-0"
                style={{ accentColor: COLORS.red }}
              />
              <span className="text-sm" style={{ color: COLORS.black }}>
                I understand that <strong style={{ color: COLORS.red }}>minting MUST be done from a desktop or laptop computer</strong> with 
                a modern browser and adequate hardware. <strong style={{ color: COLORS.red }}>Mobile devices, tablets, and older/weaker hardware 
                may crash or fail</strong> during the generation process, resulting in loss of my minting fee
              </span>
            </label>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAgeConfirmed}
              onChange={(e) => setIsAgeConfirmed(e.target.checked)}
              className="mt-1 w-5 h-5 flex-shrink-0"
              style={{ accentColor: COLORS.green }}
            />
            <span className="text-sm" style={{ color: COLORS.black }}>
              I confirm that I am at least <strong>18 years old</strong> (or the legal age of majority in 
              my jurisdiction) and I am <strong>not located in a sanctioned jurisdiction</strong>
            </span>
          </label>
        </div>

        {/* Info box */}
        <div 
          className="p-3 mb-4 border-2 text-sm"
          style={{ backgroundColor: '#f0f8ff', borderColor: COLORS.blue, color: COLORS.black }}
        >
          <p className="font-bold mb-1">What happens next:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Your wallet will ask you to sign a message (no gas fee)</li>
            <li>You&apos;ll proceed to pay the minting fee</li>
            <li>Your consent is recorded only after successful payment</li>
          </ol>
        </div>

        {error && (
          <p className="mb-4 text-sm font-bold" style={{ color: COLORS.red }}>
            {error}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 font-bold py-3 px-4 border-2 hover:opacity-70 transition-opacity"
            style={{ backgroundColor: COLORS.background, borderColor: COLORS.black, color: COLORS.black }}
          >
            Cancel
          </button>
          <button
            onClick={handleSign}
            disabled={!allChecked || isSigning}
            className="flex-1 font-bold py-3 px-4 border-2 transition-opacity disabled:opacity-40"
            style={{ 
              backgroundColor: allChecked ? COLORS.green : COLORS.background, 
              borderColor: COLORS.black, 
              color: COLORS.black 
            }}
          >
            {isSigning ? 'Signing...' : 'Sign & Continue'}
          </button>
        </div>

        <p className="mt-4 text-xs text-center opacity-60" style={{ color: COLORS.black }}>
          Terms Version: {CURRENT_TERMS_VERSION}
        </p>
      </div>
    </div>
  );
}

