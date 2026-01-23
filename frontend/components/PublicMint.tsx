'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import { getContractAddress, getEtherscanBaseUrl } from '@/lib/config';
import SpattersABI from '@/contracts/Spatters.json';
import ConsentModal from './ConsentModal';
import { ConsentData } from '@/lib/consent';

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

export default function PublicMint() {
  const router = useRouter();
  const { address, chainId } = useAccount();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [previewSeeds, setPreviewSeeds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [hasTriggeredGeneration, setHasTriggeredGeneration] = useState(false);
  
  // Store supply BEFORE mint to calculate correct token ID (avoids race condition)
  const [supplyBeforeMint, setSupplyBeforeMint] = useState<number | null>(null);
  
  // Dynamic iframe heights based on canvas dimensions from postMessage
  const [iframeHeights, setIframeHeights] = useState<{ [key: string]: number }>({});
  
  // Sequential loading: track which previews should be loaded (starts with just index 0)
  const [loadedPreviews, setLoadedPreviews] = useState<Set<number>>(new Set([0]));
  
  // Track which previews have finished rendering (received postMessage)
  const [finishedPreviews, setFinishedPreviews] = useState<Set<number>>(new Set());
  
  // Confirmation modal for 45-minute warning
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Legal consent state - only stored in memory until mint completes
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentData, setConsentData] = useState<ConsentData | null>(null);
  
  // Dynamic countdown timer for remaining mint time
  const [remainingMinutes, setRemainingMinutes] = useState<number>(45);
  
  // Commit step modal with 30-second countdown
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [commitCountdown, setCommitCountdown] = useState(30);
  
  // Cache-bust timestamp - refreshed when preview seeds change to avoid stale cached previews
  const cacheBustRef = useRef<number>(Date.now());
  
  const contractAddress = chainId ? getContractAddress(chainId) : '';
  const etherscanBase = chainId ? getEtherscanBaseUrl(chainId) : 'https://etherscan.io';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  // Read current mint price
  const { data: mintPrice } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SpattersABI.abi,
    functionName: 'getCurrentPrice',
  });

  // Read total supply
  const { data: totalSupply } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SpattersABI.abi,
    functionName: 'totalSupply',
    query: { staleTime: 0 }, // Always fetch fresh data
  });

  // Read max supply
  const { data: maxSupply } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SpattersABI.abi,
    functionName: 'MAX_SUPPLY',
  });

  // Read owner reserve
  const { data: ownerReserve } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SpattersABI.abi,
    functionName: 'OWNER_RESERVE',
  });

  // Read the global pending request (only one can exist at a time)
  const { data: pendingRequest, refetch: refetchPendingRequest } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SpattersABI.abi,
    functionName: 'getPendingRequest',
    args: [],  // No address param needed - single global request
    query: { staleTime: 0 }, // Always fetch fresh data
  });

  // Check if any mint selection is in progress (global block)
  // Returns tuple: [active: boolean, requester: address, expiresAt: uint256]
  const { data: mintSelectionData, refetch: refetchMintStatus } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SpattersABI.abi,
    functionName: 'isMintSelectionInProgress',
    query: { staleTime: 0 }, // Always fetch fresh data
  });

  // Extract values from the tuple
  const mintSelectionInProgress = mintSelectionData ? (mintSelectionData as [boolean, string, bigint])[0] : false;
  const activeMintRequester = mintSelectionData ? (mintSelectionData as [boolean, string, bigint])[1] : null;
  const activeMintRequestExpiry = mintSelectionData ? (mintSelectionData as [boolean, string, bigint])[2] : BigInt(0);

  // Check last global mint time for cooldown
  const { data: lastGlobalMintTime } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SpattersABI.abi,
    functionName: 'lastGlobalMintTime',
    query: { staleTime: 0 }, // Always fetch fresh data
  });

  // Read pending commit to check if user has completed step 1 but not step 2
  const { data: pendingCommitData, refetch: refetchPendingCommit } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SpattersABI.abi,
    functionName: 'pendingCommit',
    query: { staleTime: 0 }, // Always fetch fresh data
  });

  // Commit mint transaction (Step 1 - pays the fee)
  const { 
    data: commitHash, 
    writeContract: writeCommitMint, 
    isPending: isCommitPending,
    reset: resetCommit
  } = useWriteContract();
  
  const { isLoading: isCommitConfirming, isSuccess: isCommitConfirmed } = 
    useWaitForTransactionReceipt({ hash: commitHash });

  // Request mint transaction (Step 2 - generates seeds)
  const { 
    data: requestHash, 
    writeContract: writeRequestMint, 
    isPending: isRequestPending,
    reset: resetRequest
  } = useWriteContract();
  
  const { isLoading: isRequestConfirming, isSuccess: isRequestConfirmed } = 
    useWaitForTransactionReceipt({ hash: requestHash });

  // Complete mint transaction
  const { 
    data: completeHash, 
    writeContract: writeCompleteMint, 
    isPending: isCompletePending,
    reset: resetComplete
  } = useWriteContract();
  
  const { isLoading: isCompleteConfirming, isSuccess: isCompleteConfirmed } = 
    useWaitForTransactionReceipt({ hash: completeHash });

  // Check if current user is the one with the pending mint
  const isCurrentUserPending = activeMintRequester && address && 
    activeMintRequester.toLowerCase() === address.toLowerCase();

  // Calculate remaining time for pending selection
  const getRemainingTime = (): string => {
    if (!activeMintRequestExpiry || activeMintRequestExpiry === BigInt(0)) return '';
    
    const expirationTime = Number(activeMintRequestExpiry);
    const now = Math.floor(Date.now() / 1000);
    const remaining = expirationTime - now;
    
    if (remaining <= 0) return 'Expired';
    
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}m ${seconds}s`;
  };

  // Live countdown state for cooldown
  const [cooldownDisplay, setCooldownDisplay] = useState<string>('');
  const [isCooldownActive, setIsCooldownActive] = useState(false);

  // Live countdown timer for cooldown period
  useEffect(() => {
    if (!lastGlobalMintTime) {
      setCooldownDisplay('');
      setIsCooldownActive(false);
      return;
    }
    
    const lastMint = Number(lastGlobalMintTime);
    if (lastMint === 0) {
      setCooldownDisplay('');
      setIsCooldownActive(false);
      return;
    }
    
    const cooldownEnd = lastMint + (24 * 60 * 60); // 24 hours
    
    const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = cooldownEnd - now;
      
      if (remaining <= 0) {
        setCooldownDisplay('');
        setIsCooldownActive(false);
        // Refetch to update UI when cooldown ends
        refetchMintStatus();
        return;
      }
      
      setIsCooldownActive(true);
      
      const hours = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;
      
      if (hours > 0) {
        // Show hours and minutes when > 1 hour remaining
        setCooldownDisplay(`${hours}h ${minutes.toString().padStart(2, '0')}m`);
      } else {
        // Show minutes and seconds when < 1 hour remaining
        setCooldownDisplay(`${minutes}m ${seconds.toString().padStart(2, '0')}s`);
      }
    };
    
    // Update immediately
    updateCountdown();
    
    // Update every second for accurate countdown
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [lastGlobalMintTime, refetchMintStatus]);

  // Helper to check if a pending request is still within the 45-minute window
  const isRequestStillValid = (timestamp: bigint): boolean => {
    const requestTime = Number(timestamp);
    if (requestTime === 0) return false;
    const expirationTime = requestTime + (45 * 60); // 45 minutes
    const now = Math.floor(Date.now() / 1000);
    return now < expirationTime;
  };

  // Track if user's pending request is expired
  const [isRequestExpired, setIsRequestExpired] = useState(false);
  
  // Track if there's a valid pending request waiting to be viewed
  const [hasPendingToView, setHasPendingToView] = useState(false);
  const [pendingRemainingTime, setPendingRemainingTime] = useState('');
  const [pendingSeedsCache, setPendingSeedsCache] = useState<string[]>([]);

  // Check for existing pending request on page load and auto-resume
  useEffect(() => {
    if (pendingRequest && address && activeMintRequester) {
      // Only auto-resume if the current user is the one who made the request
      const userIsRequester = activeMintRequester.toLowerCase() === address.toLowerCase();
      if (!userIsRequester) {
        setHasPendingToView(false);
        setPendingSeedsCache([]);
        return;
      }
      
      const request = pendingRequest as { seeds: string[]; timestamp: bigint; completed: boolean };
      // If user has an uncompleted pending request with seeds
      if (request.seeds && request.seeds.length === 3 && !request.completed && request.timestamp > BigInt(0)) {
        // Check if seeds are valid (not all zeros)
        const hasValidSeeds = request.seeds.some(s => s !== '0x0000000000000000000000000000000000000000000000000000000000000000');
        if (hasValidSeeds) {
          // Check if the request is still within the time window
          if (isRequestStillValid(request.timestamp)) {
            // Cache the seeds and mark as having pending request
            setPendingSeedsCache(request.seeds);
            setHasPendingToView(true);
            setIsRequestExpired(false);
            
            // Calculate remaining time (will be updated by interval)
            const requestTime = Number(request.timestamp);
            const expirationTime = requestTime + (45 * 60);
            const now = Math.floor(Date.now() / 1000);
            const remaining = Math.max(0, expirationTime - now);
            const mins = Math.floor(remaining / 60);
            const secs = remaining % 60;
            setPendingRemainingTime(`${mins}m ${secs.toString().padStart(2, '0')}s`);
          } else {
            // Request has expired
            setIsRequestExpired(true);
            setHasPendingToView(false);
            setPendingSeedsCache([]);
            setPreviewSeeds([]); // Clear previews
          }
        }
      } else {
        setHasPendingToView(false);
        setPendingSeedsCache([]);
      }
    }
  }, [pendingRequest, address, activeMintRequester]);

  // Auto-restore preview mode when seeds exist (user refreshed during preview)
  useEffect(() => {
    if (!pendingRequest || !address) return;
    
    const request = pendingRequest as { seeds: string[]; timestamp: bigint; completed: boolean };
    if (!request.seeds) return;
    
    const hasSeeds = request.seeds.some(s => s !== '0x0000000000000000000000000000000000000000000000000000000000000000');
    
    // If seeds exist and not completed, auto-restore to preview mode (only if not already showing)
    if (hasSeeds && !request.completed && previewSeeds.length === 0) {
      // Verify this request belongs to the current user
      const userIsRequester = activeMintRequester && 
        activeMintRequester.toLowerCase() === address.toLowerCase();
      
      if (userIsRequester) {
        setPreviewSeeds(request.seeds);
        // Ensure all modals are closed
        setShowCommitModal(false);
        setShowConfirmModal(false);
      }
    }
  }, [pendingRequest, address, activeMintRequester, previewSeeds.length]);

  // Check for pending commit (step 1 complete, step 2 not started) and auto-open modal
  useEffect(() => {
    if (!pendingCommitData || !address) return;
    
    // pendingCommit returns tuple: [commitBlock, timestamp, hasCustomPalette, isOwnerMint]
    const commit = pendingCommitData as [bigint, bigint, boolean, boolean];
    const commitTimestamp = commit[1];
    const isOwnerMint = commit[3];

    // Check if there's a pending commit for a public mint (not owner mint)
    if (commitTimestamp > BigInt(0) && !isOwnerMint) {
      // Verify this commit belongs to the current user
      const userIsRequester = activeMintRequester && 
        activeMintRequester.toLowerCase() === address.toLowerCase();
      
      if (!userIsRequester) return;
      
      // Check if request hasn't been made yet (seeds not generated)
      const request = pendingRequest as { seeds: string[]; timestamp: bigint } | undefined;
      const hasSeeds = request?.seeds?.some(s => s !== '0x0000000000000000000000000000000000000000000000000000000000000000');
      
      // Don't show commit modal if seeds are already generated (preview mode)
      if (!hasSeeds) {
        // Check if commit hasn't expired
        const commitTime = Number(commitTimestamp);
        const expirationTime = commitTime + (45 * 60);
        const now = Math.floor(Date.now() / 1000);
        
        if (now < expirationTime) {
          // Close any other modals and open the commit countdown modal
          setShowConfirmModal(false);
          setShowCommitModal(true);
          
          // Calculate how much time has passed since commit
          const elapsed = now - commitTime;
          const countdownRemaining = Math.max(0, 30 - elapsed);
          setCommitCountdown(Math.floor(countdownRemaining));
        }
      }
    }
  }, [pendingCommitData, address, activeMintRequester, pendingRequest]);

  // Update pending remaining time every second
  useEffect(() => {
    if (!hasPendingToView || !pendingRequest) return;
    
    const request = pendingRequest as { timestamp: bigint };
    if (!request.timestamp || request.timestamp === BigInt(0)) return;
    
    const updateRemainingTime = () => {
      const requestTime = Number(request.timestamp);
      const expirationTime = requestTime + (45 * 60);
      const now = Math.floor(Date.now() / 1000);
      const remaining = Math.max(0, expirationTime - now);
      
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      setPendingRemainingTime(`${mins}m ${secs.toString().padStart(2, '0')}s`);
      
      // If expired, clear pending state
      if (remaining <= 0) {
        setHasPendingToView(false);
        setPendingSeedsCache([]);
        setIsRequestExpired(true);
      }
    };
    
    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, [hasPendingToView, pendingRequest]);

  // Handler to view existing pending options
  const handleViewPendingOptions = () => {
    if (pendingSeedsCache.length === 3) {
      setPreviewSeeds(pendingSeedsCache);
      setHasPendingToView(false);
    }
  };

  // Handle commit confirmation - show countdown modal
  useEffect(() => {
    if (isCommitConfirmed) {
      setShowCommitModal(true);
      setCommitCountdown(30);
    }
  }, [isCommitConfirmed]);

  // Commit countdown timer - runs for both showCommitModal and showConfirmModal
  useEffect(() => {
    if ((!showCommitModal && !showConfirmModal) || commitCountdown <= 0) return;
    
    const timer = setInterval(() => {
      setCommitCountdown(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [showCommitModal, showConfirmModal, commitCountdown]);

  // Handle request confirmation - extract seeds from pending request
  useEffect(() => {
    if (isRequestConfirmed) {
      setShowCommitModal(false);
      refetchPendingRequest().then(({ data }) => {
        if (data) {
          const request = data as { seeds: string[]; timestamp: bigint; completed: boolean };
          if (request.seeds && request.seeds.length === 3) {
            setPreviewSeeds(request.seeds);
          }
        }
      });
    }
  }, [isRequestConfirmed, refetchPendingRequest]);

  // Update cache-bust timestamp whenever preview seeds change (prevents stale cached previews)
  useEffect(() => {
    if (previewSeeds.length === 3) {
      cacheBustRef.current = Date.now();
    }
  }, [previewSeeds]);

  // Update remaining minutes countdown when in preview mode
  useEffect(() => {
    if (previewSeeds.length !== 3) return;
    
    // Calculate from either the global expiry or the pending request timestamp
    const getExpirationTimestamp = (): number => {
      // Use global expiry if available
      if (activeMintRequestExpiry && activeMintRequestExpiry > BigInt(0)) {
        return Number(activeMintRequestExpiry);
      }
      // Fallback to pending request timestamp + 45 minutes
      if (pendingRequest) {
        const request = pendingRequest as { timestamp: bigint };
        if (request.timestamp && request.timestamp > BigInt(0)) {
          return Number(request.timestamp) + (45 * 60);
        }
      }
      // Default: 45 minutes from now (shouldn't happen)
      return Math.floor(Date.now() / 1000) + (45 * 60);
    };
    
    const updateCountdown = () => {
      const expirationTime = getExpirationTimestamp();
      const now = Math.floor(Date.now() / 1000);
      const remaining = Math.max(0, expirationTime - now);
      const minutes = Math.ceil(remaining / 60); // Round up to show "1 minute" until truly expired
      setRemainingMinutes(minutes);
    };
    
    // Update immediately
    updateCountdown();
    
    // Update every 10 seconds for smoother UX
    const interval = setInterval(updateCountdown, 10000);
    
    return () => clearInterval(interval);
  }, [previewSeeds.length, activeMintRequestExpiry, pendingRequest]);

  // Listen for canvas dimensions from preview iframes and auto-load next preview
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'spatters-canvas-ready') {
        const { height, previewIndex: msgIndex } = event.data;
        
        // Try to get index from message first (more reliable), then fall back to source matching
        let index: number | null = null;
        let seed: string | null = null;
        
        if (typeof msgIndex === 'number') {
          // Index included in message - use directly (no source matching needed)
          index = msgIndex;
          seed = previewSeeds[index] || null;
        } else {
          // Fall back to source matching for backwards compatibility
          const iframes = document.querySelectorAll('iframe[data-preview-seed]');
          iframes.forEach((iframe) => {
            if ((iframe as HTMLIFrameElement).contentWindow === event.source) {
              seed = iframe.getAttribute('data-preview-seed');
              const previewIndexAttr = iframe.getAttribute('data-preview-index');
              if (previewIndexAttr !== null) {
                index = parseInt(previewIndexAttr, 10);
              }
            }
          });
        }
        
        if (seed) {
          setIframeHeights(prev => ({ ...prev, [seed as string]: height }));
        }
        if (index !== null) {
          // Mark this preview as finished
          setFinishedPreviews(prev => new Set([...prev, index as number]));
          // Auto-load the next preview if it exists
          if (index < 2) {
            setLoadedPreviews(prev => new Set([...prev, index as number + 1]));
          }
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [previewSeeds]);

  // Timeout fallback: if a preview doesn't finish in 30 seconds, force-load the next one
  useEffect(() => {
    if (previewSeeds.length !== 3) return;
    
    const timeouts: NodeJS.Timeout[] = [];
    
    // Set up timeouts for each preview that's loaded but not finished
    loadedPreviews.forEach((index) => {
      if (!finishedPreviews.has(index)) {
        const timeout = setTimeout(() => {
          console.log(`[Preview] Timeout: Preview ${index} didn't finish in 30s, forcing next load`);
          // Mark as finished (with timeout flag for debugging)
          setFinishedPreviews(prev => new Set([...prev, index]));
          // Load next preview if exists
          if (index < 2) {
            setLoadedPreviews(prev => new Set([...prev, index + 1]));
          }
        }, 30000); // 30 seconds
        timeouts.push(timeout);
      }
    });
    
    return () => {
      timeouts.forEach(t => clearTimeout(t));
    };
  }, [previewSeeds.length, loadedPreviews, finishedPreviews]);

  // Hide body scrollbar when preview modal is open (prevents double scrollbar)
  useEffect(() => {
    if (previewSeeds.length === 3) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [previewSeeds.length]);

  // Handle completion confirmation
  useEffect(() => {
    if (isCompleteConfirmed && !hasTriggeredGeneration && supplyBeforeMint !== null) {
      setHasTriggeredGeneration(true);
      
      // Use the supply we captured BEFORE the transaction
      // New token ID = supplyBeforeMint + 1 (avoids race condition with stale totalSupply)
      const newTokenId = supplyBeforeMint + 1;
      
      // Refetch contract state to clear the "selection in progress" status
      refetchMintStatus();
      refetchPendingRequest();
      
      // Store consent to database NOW that mint payment is complete
      // This is the only time consent is persisted (not on signature alone)
      if (consentData && completeHash) {
        console.log('[PublicMint] Storing consent for successful mint');
        fetch('/api/consent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...consentData,
            mintTxHash: completeHash,
            tokenId: newTokenId,
          }),
        })
          .then(res => res.json())
          .then(data => console.log('[PublicMint] Consent stored:', data))
          .catch(err => console.error('[PublicMint] Consent storage error:', err));
      }
      
      // Trigger pixel generation in background
      console.log(`[PublicMint] Triggering pixel generation for token ${newTokenId}`);
      fetch('/api/trigger-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId: newTokenId, event: 'token-minted' }),
      })
        .then(res => res.json())
        .then(data => console.log('[PublicMint] Trigger response:', data))
        .catch(err => console.error('[PublicMint] Trigger error:', err));
      
      // Redirect to the new token's page
      setTimeout(() => {
        router.push(`/token/${newTokenId}`);
      }, 1500);
    }
  }, [isCompleteConfirmed, supplyBeforeMint, router, hasTriggeredGeneration, refetchMintStatus, refetchPendingRequest, consentData, completeHash]);

  // Handle commit mint (Step 1 - pays the fee)
  const handleCommitMint = async () => {
    if (!mintPrice || !address) return;
    setError('');
    
    try {
      await writeCommitMint({
        address: contractAddress as `0x${string}`,
        abi: SpattersABI.abi,
        functionName: 'commitMint',
        value: mintPrice as bigint,
      });
    } catch (err: any) {
      setError(err.message || 'Commit failed');
    }
  };

  // Handle request mint (Step 2 - generates seeds, no payment)
  const handleRequestMint = async () => {
    if (!address) return;
    setError('');
    
    try {
      await writeRequestMint({
        address: contractAddress as `0x${string}`,
        abi: SpattersABI.abi,
        functionName: 'requestMint',
      });
    } catch (err: any) {
      setError(err.message || 'Request failed');
    }
  };

  // Handle complete mint
  const handleCompleteMint = async () => {
    if (selectedIndex === null) {
      setError('Please select an option');
      return;
    }
    
    // Store current supply BEFORE transaction to avoid race condition
    // The new token ID will be supplyBeforeMint + 1
    setSupplyBeforeMint(Number(totalSupply));
    
    try {
      await writeCompleteMint({
        address: contractAddress as `0x${string}`,
        abi: SpattersABI.abi,
        functionName: 'completeMint',
        args: [selectedIndex],
      });
    } catch (err: any) {
      setError(err.message || 'Mint failed');
    }
  };

  // Reset form
  const resetForm = () => {
    setPreviewSeeds([]);
    setSelectedIndex(null);
    setError('');
    setHasTriggeredGeneration(false);
    setIsRequestExpired(false);
    setLoadedPreviews(new Set([0])); // Reset to only first preview
    setFinishedPreviews(new Set()); // Clear finished tracking
    setIframeHeights({}); // Clear iframe heights
    setShowCommitModal(false);
    setCommitCountdown(30);
    resetCommit();
    resetRequest();
    resetComplete();
    // Refetch contract state to get latest status
    refetchMintStatus();
    refetchPendingRequest();
  };

  if (!address) {
    return (
      <div className="text-center p-8 border-2" style={{ backgroundColor: COLORS.white, borderColor: COLORS.black }}>
        <p className="text-lg" style={{ color: COLORS.black }}>Please connect your wallet to mint</p>
      </div>
    );
  }

  const supply = Number(totalSupply || 0);
  const reserve = Number(ownerReserve || 30);
  const max = Number(maxSupply || 999);

  // Check if public minting is available (after owner reserve)
  if (supply < reserve) {
    return (
      <div className="text-center p-8 border-2" style={{ backgroundColor: COLORS.yellow, borderColor: COLORS.black }}>
        <p className="text-lg font-bold" style={{ color: COLORS.black }}>
          Public minting not yet available
        </p>
        <p className="text-sm mt-2" style={{ color: COLORS.black }}>
          {reserve - supply} owner reserve tokens remaining before public mint opens
        </p>
      </div>
    );
  }

  // Check if max supply reached
  if (supply >= max) {
    return (
      <div className="text-center p-8 border-2" style={{ backgroundColor: COLORS.white, borderColor: COLORS.black }}>
        <p className="text-lg font-bold" style={{ color: COLORS.black }}>All tokens have been minted!</p>
      </div>
    );
  }

  // Show blocked message if someone else has a pending selection
  if (mintSelectionInProgress && !isCurrentUserPending && previewSeeds.length === 0) {
    const remainingTime = getRemainingTime();
    return (
      <div className="space-y-6">
        <div className="border-2 p-6" style={{ backgroundColor: COLORS.yellow, borderColor: COLORS.black }}>
          <h2 className="text-2xl font-black mb-4" style={{ color: COLORS.black }}>
            ⏳ Minting Temporarily Blocked
          </h2>
          <div className="space-y-4">
            <p style={{ color: COLORS.black }}>
              Another user is currently selecting from 3 preview options. 
              Minting is blocked until they complete their selection or the 45-minute window expires.
            </p>
            <div className="border-2 p-4" style={{ backgroundColor: COLORS.white, borderColor: COLORS.black }}>
              <p className="text-sm" style={{ color: COLORS.black }}>
                <strong>Active requester:</strong>{' '}
                <span className="font-mono text-xs">
                  {(activeMintRequester as string)?.slice(0, 6)}...{(activeMintRequester as string)?.slice(-4)}
                </span>
              </p>
              {remainingTime && remainingTime !== 'Expired' && (
                <p className="text-sm mt-2" style={{ color: COLORS.black }}>
                  <strong>Time remaining:</strong> ~{remainingTime}
                </p>
              )}
              {remainingTime === 'Expired' && (
                <p className="text-sm mt-2" style={{ color: COLORS.green }}>
                  <strong>Status:</strong> Selection window expired - minting will be available soon
                </p>
              )}
            </div>
            <button
              onClick={() => refetchMintStatus()}
              className="w-full font-bold py-2 px-4 border-2 hover:opacity-70 transition-opacity"
              style={{ backgroundColor: COLORS.black, borderColor: COLORS.black, color: COLORS.white }}
            >
              Refresh Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show cooldown message with live countdown (but NOT if user has their own pending commit)
  if (isCooldownActive && previewSeeds.length === 0 && !isCurrentUserPending) {
    return (
      <div className="space-y-6">
        <div className="border-2 p-6" style={{ backgroundColor: COLORS.blue, borderColor: COLORS.black }}>
          <h2 className="text-2xl font-black mb-4" style={{ color: COLORS.white }}>
            ⏰ Cooldown Active
          </h2>
          <div className="space-y-4">
            <p style={{ color: COLORS.white }}>
              A token was recently minted. Public minting has a 24-hour cooldown between mints.
            </p>
            <div className="border-2 p-4" style={{ backgroundColor: COLORS.white, borderColor: COLORS.black }}>
              <p className="text-2xl text-center font-mono font-bold" style={{ color: COLORS.black }}>
                {cooldownDisplay}
              </p>
              <p className="text-sm text-center mt-1" style={{ color: COLORS.black, opacity: 0.7 }}>
                until next mint available
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show preview selection (3 options stacked)
  if (previewSeeds.length === 3) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#EBE5D9' }}>
        {/* URGENT Warning Banner with Dynamic Countdown */}
        <div 
          className="flex-shrink-0 py-3 px-4 text-center border-b-2"
          style={{ backgroundColor: '#fc1a4a', color: '#FFFFFF', borderColor: '#000000' }}
        >
          <p className="font-bold">
            ⚠️ WARNING: You have <span className="underline">{remainingMinutes} minute{remainingMinutes !== 1 ? 's' : ''}</span> to select an option. If you do not choose, 
            your mint will be cancelled and the minting fee is NOT refundable. ⚠️
          </p>
          <p className="text-sm mt-1 opacity-90">
            If you encounter any website issues, you can complete your mint directly on{' '}
            <a 
              href={`${etherscanBase}/address/${contractAddress}#writeContract`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70"
            >
              Etherscan
            </a>
            {' '}by calling <code className="bg-white/20 px-1 rounded">completeMint(0, 1, or 2)</code>
          </p>
        </div>

        {/* Sticky Header with Navigation */}
        <div className="flex-shrink-0 border-b-2 px-4 py-3 sticky top-0 z-10" style={{ backgroundColor: '#EBE5D9', borderColor: '#000000' }}>
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
            <button
              onClick={resetForm}
              className="font-medium hover:opacity-70 transition-opacity"
              style={{ color: '#000000' }}
            >
              ← Cancel
            </button>
            
            {/* Jump to buttons OR loading indicator */}
            {finishedPreviews.size < 3 ? (
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent" style={{ borderColor: COLORS.blue, borderTopColor: 'transparent' }}></div>
                <span className="text-sm font-medium" style={{ color: COLORS.black }}>
                  Images still loading ({finishedPreviews.size}/3)...
                </span>
              </div>
            ) : (
              <div className="flex gap-2">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedIndex(index);
                      document.getElementById(`preview-${index}`)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 font-medium transition-opacity border-2 hover:opacity-70"
                    style={{
                      backgroundColor: selectedIndex === index ? COLORS.green : COLORS.white,
                      borderColor: COLORS.black,
                      color: COLORS.black,
                    }}
                  >
                    Option {index + 1}
                    {selectedIndex === index && ' ✓'}
                  </button>
                ))}
              </div>
            )}

            {/* Mint Button */}
            <button
              onClick={handleCompleteMint}
              disabled={selectedIndex === null || isCompletePending || isCompleteConfirming}
              className="px-6 py-2 font-bold border-2 transition-opacity hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: COLORS.green, borderColor: COLORS.black, color: COLORS.black }}
            >
              {isCompletePending || isCompleteConfirming 
                ? 'Minting...' 
                : selectedIndex !== null 
                  ? `✓ Mint Option ${selectedIndex + 1}`
                  : 'Select Below'
              }
            </button>
          </div>

          {error && (
            <div className="max-w-7xl mx-auto mt-2 p-2 border-2" style={{ backgroundColor: COLORS.red, borderColor: COLORS.black }}>
              <p className="text-center text-sm" style={{ color: COLORS.white }}>{error}</p>
            </div>
          )}

          {isCompleteConfirmed && (
            <div className="max-w-7xl mx-auto mt-2 p-2 border-2" style={{ backgroundColor: COLORS.green, borderColor: COLORS.black }}>
              <p className="text-center font-semibold" style={{ color: COLORS.black }}>
                ✅ Token minted successfully! Redirecting...
              </p>
            </div>
          )}
        </div>

        {/* All 3 Artworks Stacked - Sequential loading to prevent browser crash */}
        <div className="flex-1 overflow-auto" style={{ backgroundColor: COLORS.white }}>
          {previewSeeds.map((seed, index) => {
            // Include index for reliable postMessage matching and cache-bust to avoid stale previews
            const previewUrl = `${baseUrl}/api/preview?seed=${seed}&index=${index}&t=${cacheBustRef.current}`;
            const isLoaded = loadedPreviews.has(index);
            const isFinished = finishedPreviews.has(index);
            
            return (
              <div 
                key={index} 
                id={`preview-${index}`}
                className="border-b-2 last:border-b-0"
                style={{ borderColor: COLORS.black }}
              >
                {/* Option Header - Clickable to select */}
                <div 
                  className="sticky top-0 z-5 py-3 px-6 flex justify-between items-center cursor-pointer transition-opacity hover:opacity-90 border-b-2"
                  style={{ 
                    backgroundColor: selectedIndex === index ? COLORS.green : COLORS.background,
                    borderColor: COLORS.black,
                  }}
                  onClick={() => setSelectedIndex(index)}
                >
                  <h2 className="text-xl font-bold" style={{ color: COLORS.black }}>
                    Option {index + 1}
                    {selectedIndex === index && (
                      <span className="ml-3" style={{ color: COLORS.black }}>✓ Selected</span>
                    )}
                    {isLoaded && !isFinished && (
                      <span className="ml-3 text-sm font-normal" style={{ color: COLORS.blue }}>
                        (Generating...)
                      </span>
                    )}
                  </h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(index);
                    }}
                    className="px-4 py-1 border-2 transition-opacity hover:opacity-70"
                    style={{ 
                      backgroundColor: selectedIndex === index ? COLORS.black : COLORS.white,
                      borderColor: COLORS.black,
                      color: selectedIndex === index ? COLORS.white : COLORS.black,
                    }}
                  >
                    {selectedIndex === index ? 'Selected' : 'Select This'}
                  </button>
                </div>
                
                {/* Artwork iframe - sequential loading to prevent browser crash */}
                <div className="flex justify-center" style={{ backgroundColor: COLORS.white }}>
                  {isLoaded ? (
                    <iframe
                      src={previewUrl}
                      data-preview-seed={seed}
                      data-preview-index={index}
                      className="w-full max-w-[1200px] border-0 transition-all duration-300"
                      scrolling="no"
                      style={{ height: iframeHeights[seed] ? `${iframeHeights[seed]}px` : '2400px', overflow: 'hidden' }}
                      title={`Preview Option ${index + 1}`}
                    />
                  ) : (
                    <div 
                      className="w-full max-w-[1200px] flex flex-col items-center justify-center py-16"
                      style={{ backgroundColor: COLORS.background, minHeight: '400px' }}
                    >
                      <div className="text-center space-y-4">
                        <p className="text-lg font-medium" style={{ color: COLORS.black }}>
                          ⏳ Waiting for Option {index} to finish...
                        </p>
                        <p className="text-sm" style={{ color: COLORS.black, opacity: 0.7 }}>
                          Previews load one at a time to prevent browser slowdown
                        </p>
                        <button
                          onClick={() => setLoadedPreviews(prev => new Set([...prev, index]))}
                          className="px-6 py-3 border-2 font-medium hover:opacity-70 transition-opacity"
                          style={{ backgroundColor: COLORS.white, borderColor: COLORS.black, color: COLORS.black }}
                        >
                          Load Now (May Slow Browser)
                        </button>
                        <p className="text-xs" style={{ color: COLORS.black, opacity: 0.6 }}>
                          You can still select this option without viewing the preview
                        </p>
                        <p className="text-xs font-mono" style={{ color: COLORS.black, opacity: 0.5 }}>
                          Seed: {seed.slice(0, 18)}...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Initial state - request mint
  return (
    <div className="space-y-6">
      {/* Show expired request warning */}
      {isRequestExpired && (
        <div className="border-2 p-4" style={{ backgroundColor: COLORS.red, borderColor: COLORS.black }}>
          <h3 className="font-bold mb-2" style={{ color: COLORS.white }}>
            ⏰ Previous Selection Expired
          </h3>
          <p className="text-sm mb-2" style={{ color: COLORS.white }}>
            Your previous 3-option preview has expired (45-minute window passed). 
            Unfortunately, your payment for that request cannot be recovered.
          </p>
          <p className="text-xs" style={{ color: COLORS.white, opacity: 0.9 }}>
            Please generate new options to mint. We recommend completing your selection promptly next time.
          </p>
        </div>
      )}

      <div className="border-2 p-6" style={{ backgroundColor: COLORS.white, borderColor: COLORS.black }}>
        <h2 className="text-2xl font-black mb-4" style={{ color: COLORS.black }}>Mint a Spatter</h2>
        <div className="space-y-2 mb-6">
          <p style={{ color: COLORS.black }}>
            Minted: {supply} / {max}
          </p>
          <p style={{ color: COLORS.black }}>
            Current Price: <strong>{mintPrice ? formatEther(mintPrice as bigint) : '0'} ETH</strong>
          </p>
        </div>

        <div className="border-2 p-4 mb-6" style={{ backgroundColor: COLORS.background, borderColor: COLORS.blue }}>
          <h3 className="font-bold mb-2" style={{ color: COLORS.blue }}>How it works:</h3>
          <ol className="list-decimal list-inside text-sm space-y-1" style={{ color: COLORS.black }}>
            <li>Pay the mint price to commit your request</li>
            <li>Wait ~15 seconds for secure randomness, then view 3 options</li>
            <li>Preview all 3 options and choose your favorite</li>
            <li>Confirm your selection to mint your chosen artwork</li>
          </ol>
          <p className="text-xs mt-2" style={{ color: COLORS.black, opacity: 0.7 }}>
            You have 45 minutes to make your selection. Seeds are generated securely on-chain.
          </p>
        </div>

        {error && (
          <div className="p-4 border-2 mb-4" style={{ backgroundColor: COLORS.red, borderColor: COLORS.black }}>
            <p style={{ color: COLORS.white }}>{error}</p>
          </div>
        )}

        <div className="border-2 p-4 mb-4" style={{ backgroundColor: COLORS.red, borderColor: COLORS.black }}>
          <p className="text-sm font-medium" style={{ color: COLORS.white }}>
            ⏱️ <strong>Please be patient:</strong> Generating your 3 preview options can take up to 1-2 minutes per option. The page may appear unresponsive during this process — please wait and do not reload the page.
          </p>
        </div>

        {hasPendingToView ? (
          /* User has pending options to view */
          <button
            onClick={handleViewPendingOptions}
            className="w-full font-bold py-3 px-6 transition-colors border-2"
            style={{ 
              backgroundColor: '#2587c3', 
              borderColor: '#000000',
              color: '#FFFFFF',
            }}
          >
            View My 3 Options ({pendingRemainingTime} left)
          </button>
        ) : (
          /* New mint request */
          <button
            onClick={() => {
              // Show consent modal first if not already signed this session
              if (!consentData) {
                setShowConsentModal(true);
              } else {
                setShowConfirmModal(true);
              }
            }}
            disabled={isCommitPending || isCommitConfirming || isRequestPending || isRequestConfirming || !mintPrice}
            className="w-full font-bold py-3 px-6 transition-colors border-2"
            style={{ 
              backgroundColor: '#fc1a4a', 
              borderColor: '#000000',
              color: '#FFFFFF',
              opacity: (isCommitPending || isCommitConfirming || isRequestPending || isRequestConfirming || !mintPrice) ? 0.5 : 1,
            }}
          >
            {isCommitPending || isCommitConfirming 
              ? 'Committing...' 
              : isRequestPending || isRequestConfirming
              ? 'Generating Options...' 
              : `Generate 3 Options (${mintPrice ? formatEther(mintPrice as bigint) : '0'} ETH)`}
          </button>
        )}
      </div>

      {/* Legal Consent Modal - shown first before any mint action */}
      {showConsentModal && address && (
        <ConsentModal
          walletAddress={address}
          onConsent={(data) => {
            setConsentData(data);
            setShowConsentModal(false);
            // After signing consent, show the 45-minute warning modal
            setShowConfirmModal(true);
          }}
          onCancel={() => setShowConsentModal(false)}
        />
      )}

      {/* Confirmation Modal for 45-minute warning */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div 
            className="max-w-lg w-full p-6 border-2"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#000000' }}
          >
            <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: '#fc1a4a' }}>
              ⚠️ Important Warning
            </h3>
            <div className="space-y-4 mb-6">
              <p style={{ color: '#000000' }}>
                You are about to pay <strong>{mintPrice ? formatEther(mintPrice as bigint) : '0'} ETH</strong> to request 3 preview options. Please understand:
              </p>
              <ul className="list-disc pl-6 space-y-2" style={{ color: '#000000' }}>
                <li>
                  <strong>You will have exactly 45 minutes</strong> to select one of the 3 options.
                </li>
                <li>
                  If you <strong>do not select an option</strong> within this time, 
                  your mint request will be <strong>automatically cancelled</strong>.
                </li>
                <li style={{ color: '#fc1a4a' }}>
                  <strong>Your minting fee ({mintPrice ? formatEther(mintPrice as bigint) : '0'} ETH) is NOT refundable</strong> if you fail to complete the selection in time.
                </li>
              </ul>
              
              <div className="border-2 p-4" style={{ backgroundColor: '#fc1a4a', borderColor: '#000000' }}>
                <p className="text-sm font-bold mb-2" style={{ color: '#FFFFFF' }}>
                  🖥️ CRITICAL: Desktop/Laptop Required
                </p>
                <p className="text-sm" style={{ color: '#FFFFFF' }}>
                  <strong>DO NOT continue if you are on a mobile device or tablet.</strong> The generation process 
                  requires significant computing power and takes 1-2 minutes per preview. Mobile devices and weak 
                  hardware WILL crash, resulting in loss of your minting fee with NO refund.
                </p>
              </div>

              <p className="font-semibold" style={{ color: '#000000' }}>
                Make sure you have adequate hardware and time to review all 3 options before proceeding.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-6 font-bold border-2 transition-opacity hover:opacity-70"
                style={{ backgroundColor: '#EBE5D9', borderColor: '#000000', color: '#000000' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  handleCommitMint();
                }}
                className="flex-1 py-3 px-6 font-bold border-2 transition-opacity hover:opacity-70"
                style={{ backgroundColor: '#fc1a4a', borderColor: '#000000', color: '#FFFFFF' }}
              >
                I Understand, Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Commit Confirmed Modal with 30s countdown */}
      {showCommitModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div 
            className="max-w-lg w-full p-6 border-2"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#000000' }}
          >
            <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: '#2587c3' }}>
              ✓ Payment Confirmed!
            </h3>
            <div className="space-y-4 mb-6">
              <p style={{ color: '#000000' }}>
                Your commit has been recorded on the blockchain. The system needs to wait for the next block to generate your 3 preview options securely.
              </p>
              <div className="border-2 p-4 text-center" style={{ backgroundColor: '#EBE5D9', borderColor: '#2587c3' }}>
                <p className="text-sm mb-2" style={{ color: '#000000' }}>
                  Please wait for secure randomness...
                </p>
                <p className="text-4xl font-bold" style={{ color: '#2587c3' }}>
                  {commitCountdown}s
                </p>
              </div>
              <div className="border-2 p-3" style={{ backgroundColor: '#fc1a4a', borderColor: '#000000' }}>
                <p className="text-sm font-medium" style={{ color: '#FFFFFF' }}>
                  ⚠️ Remember: You have <strong>45 minutes</strong> from now to complete your selection or your payment is forfeited.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowCommitModal(false);
                handleRequestMint();
              }}
              disabled={commitCountdown > 0 || isRequestPending || isRequestConfirming}
              className="w-full py-3 px-6 font-bold border-2 transition-opacity hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: commitCountdown > 0 ? '#EBE5D9' : '#2587c3', 
                borderColor: '#000000', 
                color: commitCountdown > 0 ? '#000000' : '#FFFFFF' 
              }}
            >
              {isRequestPending || isRequestConfirming
                ? 'Generating Options...'
                : commitCountdown > 0 
                ? `Wait ${commitCountdown}s...` 
                : 'View 3 Options'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
