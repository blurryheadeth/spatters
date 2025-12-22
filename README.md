# Spatters

A generative art NFT collection on Ethereum. Each Spatter is a unique, on-chain artwork that can be mutated over time.

## Project Structure

```
spatters/
├── frontend/     # Next.js minting website (deployed to Vercel)
├── worker/       # Pixel generation scripts (runs via GitHub Actions)
└── .github/      # GitHub Actions workflows
```

## Setup

### Frontend (Vercel)

1. Deploy to Vercel by connecting this repository
2. Configure environment variables (see `frontend/env.example.txt`)

### Pixel Generation (GitHub Actions)

The workflows automatically generate pixel data when tokens are minted or mutated:

- `generate-pixels.yml` - Triggered on mint/mutate events
- `sync-pixels.yml` - Daily backup sync for any missed tokens

Configure repository secrets and variables as documented in the workflow files.

## Smart Contracts

The Spatters smart contracts are deployed and verified on Etherscan:

- **Spatters** (ERC721): Main NFT contract
- **SpattersGenerator**: On-chain artwork storage

## License

All rights reserved.

