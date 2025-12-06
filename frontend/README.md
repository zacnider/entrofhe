# Entrofhe Frontend

Modern React frontend for Entrofhe - FHE-based Entropy & Randomness Oracle.

## Features

- 🔐 Wallet connection (Privy + RainbowKit)
- 🎲 Request encrypted entropy
- 📊 View request history
- 💰 Fee display (0.00001 ETH)
- 🎨 Modern UI with Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Fill in environment variables:
- `REACT_APP_PRIVY_APP_ID`: Your Privy App ID
- `REACT_APP_WALLETCONNECT_PROJECT_ID`: Your WalletConnect Project ID
- `REACT_APP_ENTROPY_ORACLE_ADDRESS`: Deployed EntropyOracle address
- `REACT_APP_CHAOS_ENGINE_ADDRESS`: Deployed FHEChaosEngine address

4. Start development server:
```bash
npm start
```

## Build

```bash
npm run build
```

## Requirements

- Node.js 18+
- Sepolia testnet (FHEVM requirement)
- MetaMask or compatible wallet

