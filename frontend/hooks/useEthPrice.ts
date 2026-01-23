'use client';

import { useState, useEffect, useCallback } from 'react';

interface EthPriceState {
  price: number | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const CACHE_DURATION_MS = 2 * 60 * 1000; // 2 minutes cache

// Global cache to share price across components
let cachedPrice: number | null = null;
let cacheTimestamp: number | null = null;

/**
 * Hook to fetch ETH-USD price from CoinGecko API
 * Caches price for 2 minutes to avoid excessive API calls
 * Falls back gracefully if API is unavailable
 */
export function useEthPrice() {
  const [state, setState] = useState<EthPriceState>({
    price: cachedPrice,
    loading: cachedPrice === null,
    error: null,
    lastUpdated: cacheTimestamp ? new Date(cacheTimestamp) : null,
  });

  const fetchPrice = useCallback(async () => {
    // Check if cache is still valid
    if (cachedPrice !== null && cacheTimestamp !== null) {
      const now = Date.now();
      if (now - cacheTimestamp < CACHE_DURATION_MS) {
        setState({
          price: cachedPrice,
          loading: false,
          error: null,
          lastUpdated: new Date(cacheTimestamp),
        });
        return;
      }
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
        { 
          cache: 'no-store',
          headers: { 'Accept': 'application/json' }
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const price = data?.ethereum?.usd;

      if (typeof price !== 'number') {
        throw new Error('Invalid price data');
      }

      // Update global cache
      cachedPrice = price;
      cacheTimestamp = Date.now();

      setState({
        price,
        loading: false,
        error: null,
        lastUpdated: new Date(cacheTimestamp),
      });
    } catch (err) {
      console.error('Failed to fetch ETH price:', err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch price',
      }));
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    const interval = setInterval(fetchPrice, CACHE_DURATION_MS);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  /**
   * Convert ETH amount to USD string
   * Returns formatted string like "$224.05" or null if price unavailable
   */
  const formatUsd = useCallback((ethAmount: bigint | number | undefined): string | null => {
    if (state.price === null || ethAmount === undefined) return null;
    
    // Convert from wei to ETH if bigint
    const ethValue = typeof ethAmount === 'bigint' 
      ? Number(ethAmount) / 1e18 
      : ethAmount;
    
    const usdValue = ethValue * state.price;
    
    // Round to nearest cent
    return `$${usdValue.toFixed(2)}`;
  }, [state.price]);

  return {
    ...state,
    formatUsd,
    refetch: fetchPrice,
  };
}
