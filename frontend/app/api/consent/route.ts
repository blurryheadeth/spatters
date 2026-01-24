import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyMessage } from 'viem';
import { verifyConsentMessage } from '@/lib/consent';

// Supabase client with service role key (server-side only)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase credentials not configured for consent storage');
}

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

/**
 * POST /api/consent
 * 
 * Two operations based on presence of mintTxHash:
 * 
 * 1. INITIAL CONSENT (no mintTxHash):
 *    - Called immediately after user signs consent message
 *    - Stores consent with mint_completed=false
 *    - Returns the consent record ID for later updates
 * 
 * 2. COMPLETION UPDATE (with mintTxHash):
 *    - Called after mint transaction completes
 *    - Updates existing record with tx hash and marks mint_completed=true
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      walletAddress, 
      signature, 
      message, 
      termsVersion, 
      signedAt,
      mintTxHash,
      commitTxHash,
      tokenId 
    } = body;

    // Validate wallet address (always required)
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Missing required field: walletAddress' },
        { status: 400 }
      );
    }

    // For initial consent storage, validate and verify signature
    // For completion update (with mintTxHash), signature is optional (will be looked up)
    if (!mintTxHash) {
      // Initial consent storage - require full consent data
      if (!signature || !message || !termsVersion) {
        return NextResponse.json(
          { error: 'Missing required fields for initial consent: signature, message, termsVersion' },
          { status: 400 }
        );
      }

      // Verify the signature is valid for this message and address
      let isValidSignature = false;
      try {
        isValidSignature = await verifyMessage({
          address: walletAddress as `0x${string}`,
          message,
          signature: signature as `0x${string}`,
        });
      } catch (e) {
        console.error('Signature verification error:', e);
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 400 }
        );
      }

      if (!isValidSignature) {
        return NextResponse.json(
          { error: 'Signature verification failed' },
          { status: 400 }
        );
      }

      // Verify the message content is valid
      if (!verifyConsentMessage(message, walletAddress)) {
        return NextResponse.json(
          { error: 'Invalid consent message format' },
          { status: 400 }
        );
      }
    } else if (signature && message) {
      // Optional: verify signature if provided during completion update
      try {
        const isValidSignature = await verifyMessage({
          address: walletAddress as `0x${string}`,
          message,
          signature: signature as `0x${string}`,
        });
        if (!isValidSignature) {
          console.warn('[Consent API] Invalid signature provided during completion update');
        }
      } catch (e) {
        console.warn('[Consent API] Signature verification failed during completion update:', e);
      }
    }

    // Check if Supabase is configured
    if (!supabase) {
      console.warn('Consent storage skipped - Supabase not configured');
      return NextResponse.json({ 
        success: true, 
        warning: 'Consent verified but not stored (Supabase not configured)' 
      });
    }

    // CASE 1: Initial consent storage (no mintTxHash)
    // Store immediately after signing, before mint fee is paid
    if (!mintTxHash) {
      console.log('[Consent API] Storing initial consent for wallet:', walletAddress);
      
      const { data, error: dbError } = await supabase
        .from('mint_consent')
        .insert({
          wallet_address: walletAddress.toLowerCase(),
          signature,
          message,
          terms_version: termsVersion,
          signed_at: signedAt || new Date().toISOString(),
          commit_tx_hash: commitTxHash?.toLowerCase() || null,
          mint_completed: false,
        })
        .select('id')
        .single();

      if (dbError) {
        console.error('Database error storing initial consent:', dbError);
        return NextResponse.json(
          { error: 'Failed to store consent', details: dbError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true,
        message: 'Initial consent recorded successfully',
        consentId: data.id,
      });
    }

    // CASE 2: Completion update (mintTxHash provided)
    // Update existing record when mint completes
    console.log('[Consent API] Updating consent with mint completion for wallet:', walletAddress);
    
    // Find the most recent pending consent for this wallet
    // If signature is provided, match exactly; otherwise find any pending for this wallet
    const query = supabase
      .from('mint_consent')
      .select('id, signature, message, terms_version')
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('mint_completed', false)
      .order('signed_at', { ascending: false })
      .limit(1);
    
    // Add signature filter only if provided (for exact matching)
    if (signature) {
      query.eq('signature', signature);
    }
    
    const { data: existingConsent, error: findError } = await query.single();

    if (findError || !existingConsent) {
      // No pending consent found
      if (!signature || !message || !termsVersion) {
        // Can't create a new record without full consent data
        console.error('[Consent API] No pending consent found and insufficient data to create new record');
        return NextResponse.json(
          { 
            error: 'No pending consent found for this wallet',
            details: 'User must sign consent before minting'
          },
          { status: 404 }
        );
      }
      
      // Create a new complete record (handles edge cases where initial storage failed)
      console.log('[Consent API] No pending consent found, creating complete record');
      
      const { error: insertError } = await supabase
        .from('mint_consent')
        .insert({
          wallet_address: walletAddress.toLowerCase(),
          signature,
          message,
          terms_version: termsVersion,
          signed_at: signedAt || new Date().toISOString(),
          mint_tx_hash: mintTxHash.toLowerCase(),
          token_id: tokenId || null,
          mint_completed: true,
        });

      if (insertError) {
        // Check if it's a duplicate (same tx hash)
        if (insertError.code === '23505') {
          return NextResponse.json({ 
            success: true, 
            message: 'Consent already recorded for this transaction' 
          });
        }
        
        console.error('Database error storing complete consent:', insertError);
        return NextResponse.json(
          { error: 'Failed to store consent', details: insertError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true,
        message: 'Complete consent recorded successfully (new record)'
      });
    }

    // Update the existing pending consent
    const { error: updateError } = await supabase
      .from('mint_consent')
      .update({
        mint_tx_hash: mintTxHash.toLowerCase(),
        token_id: tokenId || null,
        mint_completed: true,
      })
      .eq('id', existingConsent.id);

    if (updateError) {
      console.error('Database error updating consent:', updateError);
      return NextResponse.json(
        { error: 'Failed to update consent', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Consent updated with mint completion',
      consentId: existingConsent.id,
    });

  } catch (error) {
    console.error('Consent API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if a wallet has existing consent (optional, for UI)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Address required' },
      { status: 400 }
    );
  }

  if (!supabase) {
    return NextResponse.json({ hasConsent: false });
  }

  const { data, error } = await supabase
    .from('mint_consent')
    .select('id, terms_version, stored_at, mint_completed')
    .eq('wallet_address', address.toLowerCase())
    .order('stored_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error checking consent:', error);
    return NextResponse.json({ hasConsent: false });
  }

  return NextResponse.json({
    hasConsent: data && data.length > 0,
    latestConsent: data?.[0] || null,
  });
}
