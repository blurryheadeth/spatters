/**
 * Rate Limiting Utility
 * 
 * Uses Upstash Redis for distributed rate limiting.
 * Implements a simple sliding window counter pattern.
 * 
 * Setup: Connect Upstash Redis via Vercel Integrations dashboard.
 * Required env vars: KV_REST_API_URL, KV_REST_API_TOKEN (auto-created by Vercel)
 */

import { Redis } from '@upstash/redis';

// Initialize Redis client using Vercel's KV variable names
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // Unix timestamp when limit resets
}

/**
 * Check and update rate limit for an identifier (usually IP address)
 * 
 * @param identifier - Unique identifier to rate limit (e.g., IP address)
 * @param limit - Maximum requests allowed in window (default: 5)
 * @param windowSeconds - Time window in seconds (default: 60 = 1 minute)
 * @returns Rate limit result with success status and remaining count
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const key = `ratelimit:trigger:${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  
  try {
    // Get current count
    const count = await redis.get<number>(key) || 0;
    
    if (count >= limit) {
      const ttl = await redis.ttl(key);
      return {
        success: false,
        remaining: 0,
        reset: now + (ttl > 0 ? ttl : windowSeconds),
      };
    }
    
    // Increment counter
    const newCount = await redis.incr(key);
    
    // Set TTL on first request in window
    if (newCount === 1) {
      await redis.expire(key, windowSeconds);
    }
    
    return {
      success: true,
      remaining: limit - newCount,
      reset: now + windowSeconds,
    };
  } catch (error) {
    // If Redis is unavailable, allow the request but log the error
    // This prevents rate limiting failures from blocking legitimate users
    console.error('Rate limit check failed:', error);
    return {
      success: true,
      remaining: limit,
      reset: now + windowSeconds,
    };
  }
}
