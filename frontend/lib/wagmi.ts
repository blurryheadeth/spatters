'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'Spatters NFT',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [
    mainnet,
    sepolia,
  ],
  transports: {
    [mainnet.id]: http('/api/rpc?network=mainnet'),
    [sepolia.id]: http('/api/rpc?network=sepolia'),
  },
  ssr: true,
});


