'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract } from 'wagmi';
import { useState, useEffect } from 'react';
import PublicMint from '@/components/PublicMint';
import OwnerMint from '@/components/OwnerMint';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getContractAddress, getEtherscanBaseUrl } from '@/lib/config';
import SpattersABI from '@/contracts/Spatters.json';

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

// Mutation groups for the simulation interface (excluding points which has subgroups)
const MUTATION_GROUPS: Record<string, { label: string; emoji: string; mutations: string[] }> = {
  general: {
    label: 'General',
    emoji: '⚙️',
    mutations: [
      'aspectRatioChange', 'baseRadiusIncrease', 'baseRadiusDecrease', 'undoMutation',
      'returnToPreviousVersion', 'dividerCountChange', 'dividerMove', 'dividerRotate',
      'seedPointCountIncrease', 'seedPointCountDecrease',
    ],
  },
  shape: {
    label: 'Shape',
    emoji: '🔷',
    mutations: [
      'rotate', 'shapeExpand', 'shapeShrink', 'shapeMakeWider', 'shapeMakeNarrower',
      'shapeMakeHigher', 'shapeMakeShorter', 'shapeChangeCurveCenters', 'shapeIncreaseConcavity',
      'shapeReduceConcavity', 'shapeChangeRadiuses', 'shapeMove',
    ],
  },
  colors: {
    label: 'Colors',
    emoji: '🎨',
    mutations: [
      'gradientTypeChange', 'paletteChangeOne', 'paletteChangeAll', 'paletteCombineOne',
      'paletteCombineAll', 'paletteResetOne', 'paletteResetAll', 'paletteShuffle',
    ],
  },
  circles: {
    label: 'Circles',
    emoji: '⭕',
    mutations: [
      'circleCountChange', 'circleSizeIncrease', 'circleSizeDecrease', 'circlePositionChange',
      'circleMoveLeft', 'circleMoveRight', 'circleMoveUp', 'circleMoveDown',
    ],
  },
  lines: {
    label: 'Lines',
    emoji: '📏',
    mutations: [
      'lineCountChange', 'lineWidthIncrease', 'lineWidthDecrease', 'lineAngleChange',
      'lineLengthIncrease', 'lineLengthDecrease', 'linePositionChange',
      'lineMoveLeft', 'lineMoveRight', 'lineMoveUp', 'lineMoveDown',
    ],
  },
};

// Points sub-categories (shown when "Points" is selected)
const POINTS_SUBGROUPS: Record<string, { label: string; emoji: string; mutations: string[] }> = {
  any: {
    label: 'Any',
    emoji: '🎯',
    mutations: [
      'seedpointMoveRight', 'seedpointMoveLeft', 'seedpointMoveUp', 'seedpointMoveDown',
      'seedpointChangeCurveCenter', 'seedpointIncreaseConcavity', 'seedpointDecreaseConcavity',
      'seedpointIncreaseRadius', 'seedpointDecreaseRadius',
    ],
  },
  top: {
    label: 'Top',
    emoji: '⬆️',
    mutations: [
      'seedpointMoveRight-top', 'seedpointMoveLeft-top', 'seedpointMoveUp-top', 'seedpointMoveDown-top',
      'seedpointChangeCurveCenter-top', 'seedpointIncreaseConcavity-top', 'seedpointDecreaseConcavity-top',
      'seedpointIncreaseRadius-top', 'seedpointDecreaseRadius-top',
    ],
  },
  bottom: {
    label: 'Bottom',
    emoji: '⬇️',
    mutations: [
      'seedpointMoveRight-bottom', 'seedpointMoveLeft-bottom', 'seedpointMoveUp-bottom', 'seedpointMoveDown-bottom',
      'seedpointChangeCurveCenter-bottom', 'seedpointIncreaseConcavity-bottom', 'seedpointDecreaseConcavity-bottom',
      'seedpointIncreaseRadius-bottom', 'seedpointDecreaseRadius-bottom',
    ],
  },
  left: {
    label: 'Left',
    emoji: '⬅️',
    mutations: [
      'seedpointMoveRight-left', 'seedpointMoveLeft-left', 'seedpointMoveUp-left', 'seedpointMoveDown-left',
      'seedpointChangeCurveCenter-left', 'seedpointIncreaseConcavity-left', 'seedpointDecreaseConcavity-left',
      'seedpointIncreaseRadius-left', 'seedpointDecreaseRadius-left',
    ],
  },
  right: {
    label: 'Right',
    emoji: '➡️',
    mutations: [
      'seedpointMoveRight-right', 'seedpointMoveLeft-right', 'seedpointMoveUp-right', 'seedpointMoveDown-right',
      'seedpointChangeCurveCenter-right', 'seedpointIncreaseConcavity-right', 'seedpointDecreaseConcavity-right',
      'seedpointIncreaseRadius-right', 'seedpointDecreaseRadius-right',
    ],
  },
};

// Total count for points mutations
const POINTS_TOTAL_COUNT = Object.values(POINTS_SUBGROUPS).reduce((sum, g) => sum + g.mutations.length, 0);

// Human-readable labels for mutations
const MUTATION_LABELS: Record<string, string> = {
  aspectRatioChange: 'Change aspect ratio',
  baseRadiusIncrease: 'Increase base radius',
  baseRadiusDecrease: 'Decrease base radius',
  undoMutation: 'Undo last mutation',
  returnToPreviousVersion: 'Return to previous version',
  dividerCountChange: 'Change section count',
  dividerMove: 'Move section divider',
  dividerRotate: 'Rotate section divider',
  seedPointCountIncrease: 'Add points',
  seedPointCountDecrease: 'Remove points',
  rotate: 'Rotate shape',
  shapeExpand: 'Expand shape',
  shapeShrink: 'Shrink shape',
  shapeMakeWider: 'Make wider',
  shapeMakeNarrower: 'Make narrower',
  shapeMakeHigher: 'Make taller',
  shapeMakeShorter: 'Make shorter',
  shapeChangeCurveCenters: 'Change curves',
  shapeIncreaseConcavity: 'Increase concavity',
  shapeReduceConcavity: 'Reduce concavity',
  shapeChangeRadiuses: 'Change radiuses',
  shapeMove: 'Move shape',
  gradientTypeChange: 'Change blend mode',
  paletteChangeOne: 'Change one color',
  paletteChangeAll: 'Change all colors',
  paletteCombineOne: 'Blend one color',
  paletteCombineAll: 'Blend all colors',
  paletteResetOne: 'Reset one color',
  paletteResetAll: 'Reset all colors',
  paletteShuffle: 'Shuffle colors',
  circleCountChange: 'Change circle count',
  circleSizeIncrease: 'Enlarge circle',
  circleSizeDecrease: 'Shrink circle',
  circlePositionChange: 'Move circle',
  circleMoveLeft: 'Move circle left',
  circleMoveRight: 'Move circle right',
  circleMoveUp: 'Move circle up',
  circleMoveDown: 'Move circle down',
  lineCountChange: 'Change line count',
  lineWidthIncrease: 'Thicken line',
  lineWidthDecrease: 'Thin line',
  lineAngleChange: 'Rotate line',
  lineLengthIncrease: 'Lengthen line',
  lineLengthDecrease: 'Shorten line',
  linePositionChange: 'Move line',
  lineMoveLeft: 'Move line left',
  lineMoveRight: 'Move line right',
  lineMoveUp: 'Move line up',
  lineMoveDown: 'Move line down',
  seedpointMoveRight: 'Move point right',
  seedpointMoveLeft: 'Move point left',
  seedpointMoveUp: 'Move point up',
  seedpointMoveDown: 'Move point down',
  seedpointChangeCurveCenter: 'Change curve center',
  seedpointIncreaseConcavity: 'Increase curve depth',
  seedpointDecreaseConcavity: 'Decrease curve depth',
  seedpointIncreaseRadius: 'Increase point radius',
  seedpointDecreaseRadius: 'Decrease point radius',
  // Top points
  'seedpointMoveRight-top': 'Move top point right',
  'seedpointMoveLeft-top': 'Move top point left',
  'seedpointMoveUp-top': 'Move top point up',
  'seedpointMoveDown-top': 'Move top point down',
  'seedpointChangeCurveCenter-top': 'Change top curve center',
  'seedpointIncreaseConcavity-top': 'Increase top curve depth',
  'seedpointDecreaseConcavity-top': 'Decrease top curve depth',
  'seedpointIncreaseRadius-top': 'Increase top point radius',
  'seedpointDecreaseRadius-top': 'Decrease top point radius',
  // Bottom points
  'seedpointMoveRight-bottom': 'Move bottom point right',
  'seedpointMoveLeft-bottom': 'Move bottom point left',
  'seedpointMoveUp-bottom': 'Move bottom point up',
  'seedpointMoveDown-bottom': 'Move bottom point down',
  'seedpointChangeCurveCenter-bottom': 'Change bottom curve center',
  'seedpointIncreaseConcavity-bottom': 'Increase bottom curve depth',
  'seedpointDecreaseConcavity-bottom': 'Decrease bottom curve depth',
  'seedpointIncreaseRadius-bottom': 'Increase bottom point radius',
  'seedpointDecreaseRadius-bottom': 'Decrease bottom point radius',
  // Left points
  'seedpointMoveRight-left': 'Move left point right',
  'seedpointMoveLeft-left': 'Move left point left',
  'seedpointMoveUp-left': 'Move left point up',
  'seedpointMoveDown-left': 'Move left point down',
  'seedpointChangeCurveCenter-left': 'Change left curve center',
  'seedpointIncreaseConcavity-left': 'Increase left curve depth',
  'seedpointDecreaseConcavity-left': 'Decrease left curve depth',
  'seedpointIncreaseRadius-left': 'Increase left point radius',
  'seedpointDecreaseRadius-left': 'Decrease left point radius',
  // Right points
  'seedpointMoveRight-right': 'Move right point right',
  'seedpointMoveLeft-right': 'Move right point left',
  'seedpointMoveUp-right': 'Move right point up',
  'seedpointMoveDown-right': 'Move right point down',
  'seedpointChangeCurveCenter-right': 'Change right curve center',
  'seedpointIncreaseConcavity-right': 'Increase right curve depth',
  'seedpointDecreaseConcavity-right': 'Decrease right curve depth',
  'seedpointIncreaseRadius-right': 'Increase right point radius',
  'seedpointDecreaseRadius-right': 'Decrease right point radius',
};

// Styled "Spatters" title with each letter colored
function SpattersTitle({ className = '' }: { className?: string }) {
  return (
    <span className={className}>
      <span style={{ color: COLORS.red }}>S</span>
      <span style={{ color: COLORS.yellow }}>p</span>
      <span style={{ color: COLORS.blue }}>a</span>
      <span style={{ color: COLORS.green }}>t</span>
      <span style={{ color: COLORS.yellow }}>t</span>
      <span style={{ color: COLORS.blue }}>e</span>
      <span style={{ color: COLORS.green }}>r</span>
      <span style={{ color: COLORS.red }}>s</span>
    </span>
  );
}

export default function Home() {
  const { isConnected, chainId, address } = useAccount();
  const [activeTab, setActiveTab] = useState<'public' | 'owner'>('public');
  
  // Get contract address for the current chain (default to Mainnet)
  const currentChainId = chainId || 1;
  const contractAddress = getContractAddress(currentChainId);
  const etherscanBase = getEtherscanBaseUrl(currentChainId);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  // Check if connected wallet is owner
  const { data: ownerAddress } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SpattersABI.abi,
    functionName: 'owner',
  });

  const isOwner = address && ownerAddress && 
    address.toLowerCase() === (ownerAddress as string).toLowerCase();

  // Read pending commit to auto-switch tabs if user has a pending mint
  const { data: pendingCommitData } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SpattersABI.abi,
    functionName: 'pendingCommit',
    query: { staleTime: 0 },
  });

  // Read active mint requester to verify the commit belongs to current user
  const { data: mintSelectionData } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SpattersABI.abi,
    functionName: 'isMintSelectionInProgress',
    query: { staleTime: 0 },
  });

  const activeMintRequester = mintSelectionData ? (mintSelectionData as [boolean, string, bigint])[1] : null;

  // Auto-switch to correct tab if user has a pending commit
  useEffect(() => {
    if (!pendingCommitData || !address || !activeMintRequester) return;
    
    // Verify the commit belongs to the current user
    if (activeMintRequester.toLowerCase() !== address.toLowerCase()) return;
    
    // pendingCommit returns tuple: [commitBlock, timestamp, hasCustomPalette, isOwnerMint]
    const commit = pendingCommitData as [bigint, bigint, boolean, boolean];
    const commitTimestamp = commit[1];
    const isOwnerMint = commit[3];
    
    // If there's a valid pending commit
    if (commitTimestamp > BigInt(0)) {
      // Check if commit hasn't expired (45 minutes)
      const commitTime = Number(commitTimestamp);
      const expirationTime = commitTime + (45 * 60);
      const now = Math.floor(Date.now() / 1000);
      
      if (now < expirationTime) {
        // Auto-switch to the correct tab based on commit type
        if (isOwnerMint && isOwner) {
          setActiveTab('owner');
        } else if (!isOwnerMint) {
          setActiveTab('public');
        }
      }
    }
  }, [pendingCommitData, address, activeMintRequester, isOwner]);

  // Demo simulation state for Spatter #1
  const [demoSimulations, setDemoSimulations] = useState<Array<[number, string]>>([]);
  const [demoIframeKey, setDemoIframeKey] = useState(0);
  const [demoIframeHeight, setDemoIframeHeight] = useState(600);
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedPointsSubgroup, setSelectedPointsSubgroup] = useState<string | null>(null);
  const [isSimulationLoading, setIsSimulationLoading] = useState(true); // Start true for initial load

  // Get mutation count for Spatter #1
  const { data: token1Mutations } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: SpattersABI.abi,
    functionName: 'getTokenMutations',
    args: [BigInt(1)],
    query: { enabled: !!contractAddress },
  });
  const token1MutationCount = token1Mutations ? (token1Mutations as any[]).length : 0;

  // Listen for iframe dimensions
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'spatters-canvas-ready') {
        setDemoIframeHeight(event.data.height || 600);
        setIsSimulationLoading(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handle adding a simulated mutation
  const handleDemoSimulate = (mutationType: string) => {
    setIsSimulationLoading(true);
    const seed = Math.floor(Date.now() / 1000);
    setDemoSimulations(prev => [...prev, [seed, mutationType]]);
    setDemoIframeKey(prev => prev + 1);
    setIsSimulationModalOpen(false);
    setSelectedGroup(null);
    setSelectedPointsSubgroup(null);
  };

  // Clear demo simulations
  const clearDemoSimulations = () => {
    setIsSimulationLoading(true);
    setDemoSimulations([]);
    setDemoIframeKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background }}>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="py-16" style={{ backgroundColor: COLORS.background }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tight">
            <SpattersTitle />
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: COLORS.black }}>
            Up to 999 pieces of generative art that evolve along with their collectors. 
            All code stored on Ethereum. Zero off-chain dependencies.
          </p>
          <div className="flex gap-8 md:gap-12 justify-center flex-wrap">
            <div className="text-center">
              <div className="text-4xl font-black" style={{ color: COLORS.red }}>999</div>
              <div className="text-sm font-medium" style={{ color: COLORS.black }}>Max Supply</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black" style={{ color: COLORS.blue }}>0.007 ETH</div>
              <div className="text-sm font-medium" style={{ color: COLORS.black }}>Starting Price</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black" style={{ color: COLORS.yellow }}>1%</div>
              <div className="text-sm font-medium" style={{ color: COLORS.black }}>Price increase per mint</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black" style={{ color: COLORS.green }}>100 ETH</div>
              <div className="text-sm font-medium" style={{ color: COLORS.black }}>Final Price</div>
            </div>
          </div>
          
          {/* What is generative art button */}
          <div className="mt-12">
            <button
              onClick={() => document.getElementById('generative-art-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 font-bold border-2 hover:opacity-80 transition-opacity"
              style={{ 
                backgroundColor: COLORS.white, 
                borderColor: COLORS.black, 
                color: COLORS.black 
              }}
            >
              What is generative art?
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8" style={{ borderColor: COLORS.black, backgroundColor: COLORS.white }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-3xl font-black text-center mb-12" style={{ color: COLORS.black }}>
            How It Works
          </h3>
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start space-x-4">
              <div 
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center font-black text-xl"
                style={{ backgroundColor: COLORS.blue, color: COLORS.white }}
              >
                1
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2" style={{ color: COLORS.black }}>
                  Request Mint
                </h4>
                <p style={{ color: COLORS.black }}>
                  Pay the mint price and request 3 unique seeds from the contract. 
                  <span> Each token costs 1% more than the previous one</span>, 
                  ending at 100 ETH for token #999.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4">
              <div 
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center font-black text-xl"
                style={{ backgroundColor: COLORS.yellow, color: COLORS.black }}
              >
                2
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2" style={{ color: COLORS.black }}>
                  Preview & Choose
                </h4>
                <p style={{ color: COLORS.black }}>
                  View 3 generated artworks and select your favorite.
                </p>
                <div 
                  className="mt-3 p-3 border-2 font-semibold"
                  style={{ borderColor: COLORS.red, backgroundColor: '#fff0f0', color: COLORS.red }}
                >
                  ⚠️ You have 45 minutes to choose. If no option is selected, 
                  the mint is cancelled and the minting fee is <strong>NOT refundable</strong>.
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4">
              <div 
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center font-black text-xl"
                style={{ backgroundColor: COLORS.green, color: COLORS.white }}
              >
                3
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2" style={{ color: COLORS.black }}>
                  Complete Mint
                </h4>
                <p style={{ color: COLORS.black }}>
                  Confirm your choice and your Spatter NFT is minted to your wallet.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start space-x-4">
              <div 
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center font-black text-xl"
                style={{ backgroundColor: COLORS.red, color: COLORS.white }}
              >
                4
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2" style={{ color: COLORS.black }}>
                  Your Spatter grows with you
                </h4>
                <p style={{ color: COLORS.black }}>
                  On specific dates each year, you can apply a change to your Spatter. You can choose the kind of modification, but the exact change will be based off a blockchain-generated seed. The outcome will be permanently recorded as part of the Spatter's full version history. 
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t-2" style={{ borderColor: COLORS.black, backgroundColor: COLORS.background }}>
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-black text-center mb-12" style={{ color: COLORS.black }}>
            Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Seed-Based Generation */}
            <div 
              className="border-2 p-6"
              style={{ borderColor: COLORS.black, backgroundColor: COLORS.white }}
            >
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="text-xl font-bold mb-2" style={{ color: COLORS.black }}>
                Seed-Based Generation
              </h4>
              <p style={{ color: COLORS.black }}>
                Each image is generated from on-chain seeds using p5.js. Choose from 3 previews before minting.
              </p>
            </div>

            {/* Time-Based Mutations */}
            <div 
              className="border-2 p-6"
              style={{ borderColor: COLORS.black, backgroundColor: COLORS.white }}
            >
              <div className="text-4xl mb-4">🔄</div>
              <h4 className="text-xl font-bold mb-2" style={{ color: COLORS.black }}>
                Shape your Spatter
              </h4>
              <p style={{ color: COLORS.black }}>
                94 mutation types available each year on minting anniversaries of tokens #1, #100, #500, #750, #999 and each token&apos;s own minting anniversary. 
              </p>
            </div>

            {/* Interactive History */}
            <div 
              className="border-2 p-6"
              style={{ borderColor: COLORS.black, backgroundColor: COLORS.white }}
            >
              <div className="text-4xl mb-4">📜</div>
              <h4 className="text-xl font-bold mb-2" style={{ color: COLORS.black }}>
                Full Version History
              </h4>
              <p style={{ color: COLORS.black }}>
                Click any artwork to cycle through its full journey: from mint, through every mutation up to its current form.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Mint Section */}
      {isConnected ? (
        <section className="py-16 border-t-2" style={{ backgroundColor: COLORS.white }}>
          <div className="container mx-auto px-4 max-w-5xl">
            {/* Only show tabs for contract owner */}
            {isOwner ? (
              <>
                {/* Owner Tabs */}
                <div className="flex space-x-4 mb-8 border-b-2" style={{ borderColor: COLORS.black }}>
                  <button
                    onClick={() => setActiveTab('public')}
                    className="pb-3 px-6 font-bold transition-all"
                    style={{
                      borderBottom: activeTab === 'public' ? `3px solid ${COLORS.red}` : '3px solid transparent',
                      color: activeTab === 'public' ? COLORS.red : COLORS.black,
                    }}
                  >
                    Mint a Spatter
                  </button>
                  <button
                    onClick={() => setActiveTab('owner')}
                    className="pb-3 px-6 font-bold transition-all"
                    style={{
                      borderBottom: activeTab === 'owner' ? `3px solid ${COLORS.blue}` : '3px solid transparent',
                      color: activeTab === 'owner' ? COLORS.blue : COLORS.black,
                    }}
                  >
                    Owner Mint
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'public' ? <PublicMint /> : <OwnerMint />}
              </>
            ) : (
              /* Non-owners see only the public mint interface */
              <PublicMint />
            )}
          </div>
        </section>
      ) : (
        <section className="py-16" style={{ backgroundColor: COLORS.background }}>
          <div className="container mx-auto px-4 text-center">
            <div 
              className="max-w-md mx-auto border-2 p-8"
              style={{ borderColor: COLORS.black, backgroundColor: COLORS.white }}
            >
              <h3 className="text-2xl font-bold mb-4" style={{ color: COLORS.black }}>
                Connect Your Wallet
              </h3>
              <p className="mb-6" style={{ color: COLORS.black }}>
                Connect your wallet to start minting Spatters
              </p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Try it out with Spatter #1 */}
      <section id="try-demo" className="py-16 border-t-2" style={{ borderColor: COLORS.black, backgroundColor: COLORS.background }}>
        <div className="container mx-auto px-4 max-w-6xl">
          <h3 className="text-3xl font-black text-center mb-4" style={{ color: COLORS.black }}>
            Try it out with Spatter #1!
          </h3>
          <p className="text-center mb-8 max-w-2xl mx-auto" style={{ color: COLORS.black }}>
            Experience how mutations work: simulate changes below to see potential outcomes. These are just previews and won&apos;t affect the real artwork.
          </p>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Artwork display */}
            <div className="flex-1">
              {/* Simulation Mode Banner */}
              {demoSimulations.length > 0 && (
                <div 
                  className="px-4 py-2 flex items-center justify-between border-2 border-b-0"
                  style={{ backgroundColor: COLORS.blue, borderColor: COLORS.black }}
                >
                  <span className="font-bold text-sm" style={{ color: COLORS.white }}>
                    🔮 SIMULATION: {demoSimulations.length} simulated mutation{demoSimulations.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={clearDemoSimulations}
                    disabled={isSimulationLoading}
                    className="text-xs font-bold px-3 py-1 border-2 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: COLORS.white, borderColor: COLORS.black, color: COLORS.black }}
                  >
                    Clear & Show Real
                  </button>
                </div>
              )}
              
              {/* Artwork iframe */}
              <div 
                className="border-2"
                style={{ 
                  borderColor: COLORS.black,
                  backgroundColor: COLORS.background,
                }}
              >
                <iframe
                  key={demoIframeKey}
                  src={demoSimulations.length > 0
                    ? `${baseUrl}/api/simulate/1?simMutations=${encodeURIComponent(JSON.stringify(demoSimulations))}&v=${demoIframeKey}`
                    : `${baseUrl}/api/token/1?c=${contractAddress?.slice(-8) || ''}&v=${demoIframeKey}`
                  }
                  className="border-0 w-full"
                  scrolling="no"
                  style={{ 
                    height: `${demoIframeHeight}px`,
                    overflow: 'hidden',
                  }}
                  title={`Spatter #1${demoSimulations.length > 0 ? ' (Simulation)' : ''}`}
                />
              </div>
              <div className="text-center text-sm py-2 border-2 border-t-0" style={{ backgroundColor: COLORS.white, borderColor: COLORS.black, color: COLORS.black }}>
                Click artwork to cycle through history • {demoSimulations.length > 0 ? `Real: ${token1MutationCount} + Simulated: ${demoSimulations.length}` : `Mutations: ${token1MutationCount}`}
              </div>
            </div>

            {/* Controls */}
            <div className="lg:w-80 space-y-4">
              <div className="border-2 p-4" style={{ backgroundColor: COLORS.white, borderColor: COLORS.black }}>
                <h4 className="font-bold mb-3" style={{ color: COLORS.black }}>
                  Simulate a Mutation
                </h4>
                <p className="text-sm mb-4" style={{ color: COLORS.black, opacity: 0.8 }}>
                  Choose a mutation type to preview how it might change the artwork. Results are random — the same mutation type produces different outcomes each time!
                </p>
                <button
                  onClick={() => setIsSimulationModalOpen(true)}
                  disabled={isSimulationLoading}
                  className="w-full font-bold py-3 px-4 border-2 transition-opacity hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: COLORS.blue, 
                    borderColor: COLORS.black,
                    color: COLORS.white
                  }}
                >
                  {isSimulationLoading ? '⏳ Generating...' : '🔮 Add Simulated Mutation'}
                </button>
              </div>

              {/* Active simulations list */}
              {demoSimulations.length > 0 && (
                <div className="border-2 p-4" style={{ backgroundColor: COLORS.white, borderColor: COLORS.black }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold" style={{ color: COLORS.blue }}>
                      Active Simulations ({demoSimulations.length})
                    </span>
                    <button
                      onClick={clearDemoSimulations}
                      disabled={isSimulationLoading}
                      className="text-xs underline hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ color: COLORS.red }}
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {demoSimulations.map(([, mutationType], idx) => (
                      <div 
                        key={idx}
                        className="text-xs px-2 py-1 border"
                        style={{ borderColor: COLORS.blue, color: COLORS.black }}
                      >
                        {idx + 1}. {MUTATION_LABELS[mutationType] || mutationType}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading indicator */}
              {isSimulationLoading && (
                <div className="border-2 p-4" style={{ backgroundColor: COLORS.green, borderColor: COLORS.black }}>
                  <div className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5" style={{ color: COLORS.white }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm font-medium" style={{ color: COLORS.white }}>
                      Generating preview...
                    </span>
                  </div>
                </div>
              )}

              <div className="border-2 p-4" style={{ backgroundColor: COLORS.red, borderColor: COLORS.black }}>
                <p className="text-sm font-medium" style={{ color: COLORS.white }}>
                  ⏱️ <strong>Please be patient:</strong> Generating a mutation preview can take up to 1-2 minutes per mutation. The page may appear unresponsive during this process — please wait and do not reload the page.
                </p>
              </div>

              <div className="border-2 p-4" style={{ backgroundColor: COLORS.yellow, borderColor: COLORS.black }}>
                <p className="text-sm font-medium" style={{ color: COLORS.black }}>
                  💡 <strong>Note:</strong> Real mutations can only be applied on special dates by token owners. These simulations are just for demonstration!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulation Modal */}
      {isSimulationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="w-full max-w-2xl max-h-[85vh] overflow-hidden border-2" style={{ backgroundColor: COLORS.white, borderColor: COLORS.black }}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b-2" style={{ borderColor: COLORS.black }}>
              <h3 className="text-lg font-bold" style={{ color: COLORS.black }}>
                {selectedGroup === 'points' && selectedPointsSubgroup ? (
                  <button 
                    onClick={() => setSelectedPointsSubgroup(null)}
                    className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                    style={{ color: COLORS.black }}
                  >
                    <span>←</span>
                    <span>{POINTS_SUBGROUPS[selectedPointsSubgroup]?.emoji} {POINTS_SUBGROUPS[selectedPointsSubgroup]?.label} Points</span>
                  </button>
                ) : selectedGroup === 'points' ? (
                  <button 
                    onClick={() => setSelectedGroup(null)}
                    className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                    style={{ color: COLORS.black }}
                  >
                    <span>←</span>
                    <span>📍 Points</span>
                  </button>
                ) : selectedGroup ? (
                  <button 
                    onClick={() => setSelectedGroup(null)}
                    className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                    style={{ color: COLORS.black }}
                  >
                    <span>←</span>
                    <span>{MUTATION_GROUPS[selectedGroup]?.emoji} {MUTATION_GROUPS[selectedGroup]?.label}</span>
                  </button>
                ) : (
                  'Select Mutation to Simulate'
                )}
              </h3>
              <button
                onClick={() => { setIsSimulationModalOpen(false); setSelectedGroup(null); setSelectedPointsSubgroup(null); }}
                className="text-2xl font-bold w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
                style={{ color: COLORS.black }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)]" style={{ backgroundColor: COLORS.background }}>
              {!selectedGroup ? (
                /* Category Selection */
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(MUTATION_GROUPS).map(([key, group]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedGroup(key)}
                      className="flex flex-col items-center justify-center p-4 border-2 transition-opacity hover:opacity-80"
                      style={{ backgroundColor: COLORS.white, borderColor: COLORS.black }}
                    >
                      <span className="text-2xl mb-1">{group.emoji}</span>
                      <span className="text-sm font-medium" style={{ color: COLORS.black }}>{group.label}</span>
                      <span className="text-xs" style={{ color: COLORS.black, opacity: 0.7 }}>{group.mutations.length} options</span>
                    </button>
                  ))}
                  {/* Points - special category with sub-menu */}
                  <button
                    onClick={() => setSelectedGroup('points')}
                    className="flex flex-col items-center justify-center p-4 border-2 transition-opacity hover:opacity-80"
                    style={{ backgroundColor: COLORS.white, borderColor: COLORS.black }}
                  >
                    <span className="text-2xl mb-1">📍</span>
                    <span className="text-sm font-medium" style={{ color: COLORS.black }}>Points</span>
                    <span className="text-xs" style={{ color: COLORS.black, opacity: 0.7 }}>{POINTS_TOTAL_COUNT} options</span>
                  </button>
                </div>
              ) : selectedGroup === 'points' && !selectedPointsSubgroup ? (
                /* Points Sub-Group Selection */
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(POINTS_SUBGROUPS).map(([key, subgroup]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPointsSubgroup(key)}
                      className="flex flex-col items-center justify-center p-4 border-2 transition-opacity hover:opacity-80"
                      style={{ backgroundColor: COLORS.white, borderColor: COLORS.black }}
                    >
                      <span className="text-2xl mb-1">{subgroup.emoji}</span>
                      <span className="text-sm font-medium" style={{ color: COLORS.black }}>{subgroup.label}</span>
                      <span className="text-xs" style={{ color: COLORS.black, opacity: 0.7 }}>{subgroup.mutations.length} options</span>
                    </button>
                  ))}
                </div>
              ) : selectedGroup === 'points' && selectedPointsSubgroup ? (
                /* Points Mutation Selection */
                <div className="space-y-2">
                  {POINTS_SUBGROUPS[selectedPointsSubgroup]?.mutations.map((mutation) => (
                    <button
                      key={mutation}
                      onClick={() => handleDemoSimulate(mutation)}
                      className="w-full text-left px-4 py-3 border-2 transition-opacity hover:opacity-80"
                      style={{ 
                        backgroundColor: COLORS.blue, 
                        borderColor: COLORS.black,
                        color: COLORS.white
                      }}
                    >
                      <span className="font-medium">{MUTATION_LABELS[mutation] || mutation}</span>
                    </button>
                  ))}
                </div>
              ) : (
                /* Regular Group Mutation Selection */
                <div className="space-y-2">
                  {MUTATION_GROUPS[selectedGroup]?.mutations.map((mutation) => (
                    <button
                      key={mutation}
                      onClick={() => handleDemoSimulate(mutation)}
                      className="w-full text-left px-4 py-3 border-2 transition-opacity hover:opacity-80"
                      style={{ 
                        backgroundColor: COLORS.blue, 
                        borderColor: COLORS.black,
                        color: COLORS.white
                      }}
                    >
                      <span className="font-medium">{MUTATION_LABELS[mutation] || mutation}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* How it Works */}
      <section className="py-16 border-t-2" style={{ borderColor: COLORS.black, backgroundColor: COLORS.white }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-3xl font-black text-center mb-8" style={{ color: COLORS.black }}>
            How it Works
          </h3>
          
          <div className="space-y-6">
            {/* Step 1: Parameters */}
            <div className="border-2 p-6" style={{ borderColor: COLORS.black, backgroundColor: COLORS.background }}>
              <div className="flex items-start gap-4">
                <div 
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center font-black border-2"
                  style={{ backgroundColor: COLORS.red, borderColor: COLORS.black, color: COLORS.white }}
                >
                  1
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2" style={{ color: COLORS.black }}>
                    Random Parameters
                  </h4>
                  <p style={{ color: COLORS.black }}>
                    The algorithm begins by determining a set of random parameters from the seed, such as aspect ratio (square, wide, or tall), 
                    the number of colored sections (2-5), which colors to use from the palette, or how many circles and lines to include.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Shape */}
            <div className="border-2 p-6" style={{ borderColor: COLORS.black, backgroundColor: COLORS.background }}>
              <div className="flex items-start gap-4">
                <div 
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center font-black border-2"
                  style={{ backgroundColor: COLORS.blue, borderColor: COLORS.black, color: COLORS.white }}
                >
                  2
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2" style={{ color: COLORS.black }}>
                    Building the Shape
                  </h4>
                  <p style={{ color: COLORS.black }}>
                    A random number of reference points are placed on the canvas. Around each point, a semicircle is drawn facing the center 
                    of the emerging shape. These semicircles are then connected with smooth curves, creating the organic, blob-like forms that define each Spatter.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Colors */}
            <div className="border-2 p-6" style={{ borderColor: COLORS.black, backgroundColor: COLORS.background }}>
              <div className="flex items-start gap-4">
                <div 
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center font-black border-2"
                  style={{ backgroundColor: COLORS.yellow, borderColor: COLORS.black, color: COLORS.black }}
                >
                  3
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2" style={{ color: COLORS.black }}>
                    Coloring the Sections
                  </h4>
                  <p style={{ color: COLORS.black }}>
                    The shape is divided into sections, each assigned a color from the selected palette. Colors blend between sections using one of three 
                    randomly chosen modes: <strong>full gradient</strong> (smooth color transitions), <strong>fuzzy border</strong> (soft, painterly edges), 
                    or <strong>no gradient</strong> (sharp, graphic divisions).
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4: Details */}
            <div className="border-2 p-6" style={{ borderColor: COLORS.black, backgroundColor: COLORS.background }}>
              <div className="flex items-start gap-4">
                <div 
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center font-black border-2"
                  style={{ backgroundColor: COLORS.green, borderColor: COLORS.black, color: COLORS.white }}
                >
                  4
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2" style={{ color: COLORS.black }}>
                    Adding Details
                  </h4>
                  <p style={{ color: COLORS.black }}>
                    Finally, circles and lines are placed within the shape to add texture and visual interest. These elements are drawn in black, unless the 
                    background beneath them is too dark, in which case they automatically transition to white for better contrast.
                  </p>
                </div>
              </div>
            </div>

            {/* Mutations explanation */}
            <div className="border-2 p-6 mt-8" style={{ borderColor: COLORS.red, backgroundColor: '#fff8f8' }}>
              <h4 className="text-lg font-bold mb-3" style={{ color: COLORS.red }}>
                How Mutations Work
              </h4>
              <p style={{ color: COLORS.black }}>
                Mutations modify one or more of these parameters. When you choose a mutation type like &quot;expand shape&quot; or &quot;change colors&quot; 
                you&apos;re directing <em>what</em> changes, but not <em>how</em> it changes. The specific outcome depends on the new random seed generated 
                at the moment of mutation, just like any generative art process. This means you have creative agency in guiding your Spatter&apos;s evolution, 
                while still embracing the beautiful unpredictability that makes generative art special.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* On-Chain Architecture */}
      <section className="py-16 border-t-2" style={{ borderColor: COLORS.black, backgroundColor: COLORS.background }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-3xl font-black text-center mb-8" style={{ color: COLORS.black }}>
            100% On-Chain
          </h3>
          <div 
            className="border-2 p-6"
            style={{ borderColor: COLORS.black, backgroundColor: COLORS.white }}
          >
            <p className="mb-4" style={{ color: COLORS.black }}>
              Spatters is a fully on-chain generative art project. Every component needed to render the artwork 
              is stored permanently on the Ethereum blockchain:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2" style={{ color: COLORS.black }}>
              <li>
                <strong>Spatters Contract:</strong> Stores all token data including mint seeds, mutations, and custom palettes
              </li>
              <li>
                <strong>Generator Contract:</strong> Contains the custom rendering logic (spatters.js) split across multiple storage chunks
              </li>
              <li>
                <strong>p5.js Dependency:</strong> The p5.js library (v1.0.0) used is the one deployed on-chain by{' '}
                <a 
                  href="https://artblocks.io" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:opacity-70"
                  style={{ color: COLORS.blue }}
                >
                  Art Blocks
                </a>
                {' '}via their DependencyRegistry contract on Ethereum mainnet
              </li>
              <li>
                <strong>HTML Template:</strong> A minimal viewer template stored on-chain that assembles all components client-side
              </li>
            </ul>
            <div className="text-center pt-4 border-t-2" style={{ borderColor: COLORS.black }}>
              <p className="text-sm mb-2" style={{ color: COLORS.black }}>Contract Address:</p>
              <a
                href={`${etherscanBase}/address/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-lg font-bold hover:opacity-70 transition-opacity break-all"
                style={{ color: COLORS.blue }}
              >
                {contractAddress}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* On Generative Art - Educational Section */}
      <section 
        id="generative-art-section" 
        className="py-16 border-t-2" 
        style={{ borderColor: COLORS.black, backgroundColor: COLORS.white }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-3xl font-black text-center mb-10" style={{ color: COLORS.black }}>
            On Generative Art
          </h3>
          
          <div className="space-y-8" style={{ color: COLORS.black }}>
            {/* What is generative art */}
            <div>
              <h4 className="text-xl font-bold mb-3" style={{ color: COLORS.blue }}>
                What is generative art?
              </h4>
              <p className="mb-3 leading-relaxed">
                Generative art is artwork created through a collaboration between an artist and an autonomous system. 
                The artist writes a set of rules or an algorithm to go from certain inputs to an artwork, and then the 
                system executes those rules to produce outcomes that are variable and often unpredictable in their details. 
                Like creating a recipe for a dish, the artist defines the inputs and techniques to be used, but each time 
                the recipe is cooked, it produces something different which depends on factors such as the ingredients, 
                the appliances used or even the kitchen's room temperature and humidity.
              </p>
              <p className="leading-relaxed">
                Simple examples include fractal patterns, where mathematical formulas create infinitely complex shapes, 
                or particle systems where thousands of simulated dots follow physics rules to create flowing, organic visuals. 
                In Spatters, the algorithm creates abstract compositions by placing points, shapes, and colors according to 
                probabilistic rules. Each piece follows the same logic but arrives at a completely different result.
              </p>
            </div>

            {/* How blockchain enables it */}
            <div>
              <h4 className="text-xl font-bold mb-3" style={{ color: COLORS.red }}>
                How does blockchain enable generative art?
              </h4>
              <p className="mb-3 leading-relaxed">
                Blockchain technology solves a fundamental challenge in generative art: a source of randomness and permanence. 
                When you mint a generative NFT, the blockchain can provide a unique &quot;seed&quot;, which is a pseudo-random 
                value derived from transaction data that no one could have predicted before the transaction was sent. This seed 
                can serve as input for the artist&apos;s algorithm to generate a one-of-a-kind artwork. Because the algorithm 
                and seed are stored on-chain, anyone can verify that your specific artwork was genuinely generated at the time it 
                was created (or &quot;minted&quot;, since creating an NFT is also called &quot;minting&quot;).
              </p>
              <p className="leading-relaxed">
                The blockchain also ensures permanence: unlike traditional digital art that relies on servers and hosting, 
                fully on-chain generative art exists as long as the blockchain itself does. The code, the seeds, and all 
                the data needed to recreate the artwork live permanently in a decentralized, censorship-resistant system. 
                This means that even if this website disappears, anyone can recreate the images associated with your Spatter 
                as long as Ethereum exists.
              </p>
            </div>

            {/* How Spatters is different */}
            <div 
              className="p-6 border-2"
              style={{ borderColor: COLORS.green, backgroundColor: '#f8fff8' }}
            >
              <h4 className="text-xl font-bold mb-3" style={{ color: COLORS.green }}>
                How is Spatters different?
              </h4>
              <p className="mb-3 leading-relaxed">
                In most blockchain generative art, only two people have agency in determining the final artwork: 
                the <strong>artist</strong> who writes the algorithm, and the <strong>initial minter</strong> who triggers 
                the generation with their transaction. Once minted, the artwork is frozen forever, becoming a snapshot of that 
                single moment of creation.
              </p>
              <p className="mb-3 leading-relaxed">
                <strong>Spatters challenges this paradigm.</strong> It takes advantage of the tools that the blockchain provides to 
                enable collectors to be more than just passive owners and, along with the artist and the initial minter, become joint 
                participants in the artwork&apos;s ongoing story. Through its mutation system, every person who holds a Spatter has 
                the opportunity to contribute to its evolution. On specific dates each year, you can apply a change to your artwork, 
                adding a new layer generated from a fresh blockchain seed.
              </p>
              <p className="mb-3 leading-relaxed">
                The seed that serves as input for the Spatters algorithm, both for the initial mint and for mutations, 
                is a large number computed as a combination of who is executing the code (blockchain wallet address) and 
                when (blockchain block timestamp). Different people executing the same code at the same time would 
                therefore get different results, as would the same person executing the algorithm at different times. 
                The artwork that the algorithm generates thus depends on who created it and when, as well as who decided 
                to mutate it and when.
              </p>
              <p className="leading-relaxed">
                This means a Spatter isn&apos;t just art you own: <strong>it&apos;s art you help shape</strong>. The full 
                history of every change is preserved on-chain, creating a visual timeline of everyone who held and influenced 
                that piece. Your Spatter becomes a collaborative work between the original artist, the first minter, you, and 
                every future collector who chooses to leave their mark. Instead of a snapshot of a single moment of creation, 
                a Spatter is never a completed piece, but rather a constantly evolving artwork that carries within it 
                a little part of everyone it has belonged to.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
