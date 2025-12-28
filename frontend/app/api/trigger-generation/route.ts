/**
 * API Route: Trigger Pixel Generation
 * 
 * Called by frontend after mint/mutate to trigger GitHub Actions workflow.
 * Rate limited to 5 requests per IP per minute via Upstash Redis.
 * 
 * POST /api/trigger-generation
 * Body: { tokenId: number, event: 'token-minted' | 'token-mutated' }
 */

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { handlePixelGenerationTrigger } from '@/lib/github';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               headersList.get('x-real-ip') || 
               'unknown';

    // Check rate limit (5 requests per minute per IP)
    const rateLimit = await checkRateLimit(ip, 5, 60);
    
    if (!rateLimit.success) {
      const retryAfter = rateLimit.reset - Math.floor(Date.now() / 1000);
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter,
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.reset.toString(),
            'Retry-After': retryAfter.toString(),
          },
        }
      );
    }

    const { tokenId, event } = await request.json();

    if (!tokenId || typeof tokenId !== 'number') {
      return NextResponse.json(
        { error: 'tokenId required' },
        { status: 400 }
      );
    }

    const validEvents = ['token-minted', 'token-mutated'];
    if (!event || !validEvents.includes(event)) {
      return NextResponse.json(
        { error: 'event must be token-minted or token-mutated' },
        { status: 400 }
      );
    }

    const result = await handlePixelGenerationTrigger(tokenId, event);

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error: any) {
    console.error('Error in trigger-generation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

