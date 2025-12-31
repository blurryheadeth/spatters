// Contract configuration
export const CONTRACT_ADDRESSES = {
  // Sepolia testnet
  sepolia: process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS || "",
  // Ethereum mainnet
  mainnet: process.env.NEXT_PUBLIC_MAINNET_CONTRACT_ADDRESS || "",
};

// Get contract address for current network
export function getContractAddress(chainId: number): string {
  switch (chainId) {
    case 11155111: // Sepolia
      return CONTRACT_ADDRESSES.sepolia;
    case 1: // Mainnet
      return CONTRACT_ADDRESSES.mainnet;
    default:
      return CONTRACT_ADDRESSES.mainnet; // Default to Mainnet
  }
}

// Get Etherscan base URL for current network
export function getEtherscanBaseUrl(chainId: number): string {
  switch (chainId) {
    case 11155111: // Sepolia
      return 'https://sepolia.etherscan.io';
    case 1: // Mainnet
      return 'https://etherscan.io';
    default:
      return 'https://etherscan.io';
  }
}

// Collection constants
export const COLLECTION_CONFIG = {
  name: "Spatters",
  symbol: "SPAT",
  maxSupply: 999,
  ownerReserve: 30,
  cooldownPeriod: 3600, // 1 hour in seconds
};

// RPC endpoints
export const RPC_URLS = {
  sepolia: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://eth-sepolia.public.blastapi.io",
  mainnet: process.env.NEXT_PUBLIC_MAINNET_RPC_URL || "https://eth.public-rpc.com",
};


