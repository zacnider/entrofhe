# Master Seed Initialization Guide

## Option 1: Using Frontend (Recommended)

1. Open the frontend at http://localhost:3000
2. Connect your wallet (must be the contract owner)
3. Go to Admin page (to be created) or use browser console
4. Use FHEVM to encrypt a seed and call `initializeMasterSeed()`

## Option 2: Using Hardhat Console

```bash
npx hardhat console --network sepolia
```

Then in the console:
```javascript
const { ethers } = require("hardhat");
const FHEChaosEngine = await ethers.getContractAt("FHEChaosEngine", "0xAC447CC1932FB1B7030EB79C0dfb3ea5A5378020");

// You'll need to use FHEVM relayer to encrypt the seed
// This requires a browser environment with FHEVM SDK
```

## Option 3: Manual via Etherscan

1. Go to https://sepolia.etherscan.io/address/0xAC447CC1932FB1B7030EB79C0dfb3ea5A5378020#writeContract
2. Connect your wallet (owner address)
3. Use FHEVM relayer to encrypt a seed value
4. Call `initializeMasterSeed` with encrypted seed and proof

## Important Notes

- Master seed can only be initialized ONCE
- Only the contract owner can initialize
- You need FHEVM relayer to encrypt the seed
- The seed value should be a random uint64

## Quick Test Script (Browser Console)

Open browser console on frontend and run:

```javascript
// This requires FHEVM to be initialized
// See frontend/src/hooks/useFHEVM.ts for reference

const seedValue = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
const encryptedSeed = await fhevmInstance
  .createEncryptedInput('0xAC447CC1932FB1B7030EB79C0dfb3ea5A5378020', userAddress)
  .add64(seedValue)
  .encrypt();

// Then call contract with encrypted seed
```

