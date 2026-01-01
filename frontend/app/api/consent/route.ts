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
      tokenId 
    } = body;

    // Validate required fields
    if (!walletAddress || !signature || !message || !termsVersion || !mintTxHash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Check if Supabase is configured
    if (!supabase) {
      console.warn('Consent storage skipped - Supabase not configured');
      return NextResponse.json({ 
        success: true, 
        warning: 'Consent verified but not stored (Supabase not configured)' 
      });
    }

    // Store the consent record
    const { error: dbError } = await supabase
      .from('mint_consent')
      .insert({
        wallet_address: walletAddress.toLowerCase(),
        signature,
        message,
        terms_version: termsVersion,
        mint_tx_hash: mintTxHash.toLowerCase(),
        token_id: tokenId || null,
        signed_at: signedAt || new Date().toISOString(),
      });

    if (dbError) {
      // Check if it's a duplicate (same tx hash)
      if (dbError.code === '23505') {
        return NextResponse.json({ 
          success: true, 
          message: 'Consent already recorded for this transaction' 
        });
      }
      
      console.error('Database error storing consent:', dbError);
      return NextResponse.json(
        { error: 'Failed to store consent' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Consent recorded successfully'
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
    .select('id, terms_version, stored_at')
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

