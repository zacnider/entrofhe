# VestingWallet

Vesting wallet with encrypted amounts and EntropyOracle integration

## 🚀 Standard workflow
- Install (first run): `npm install --legacy-peer-deps`
- Compile: `npx hardhat compile`
- Test (local FHE + local oracle/chaos engine auto-deployed): `npx hardhat test`
- Deploy (frontend Deploy button): constructor args fixed to EntropyOracle and beneficiary; oracle is `0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`
- Verify: `npx hardhat verify --network sepolia <contractAddress> 0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361 <beneficiary> <start> <duration>`

## 📋 Overview

This example demonstrates **openzeppelin** concepts in FHEVM.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Hardhat
- Sepolia Testnet (for FHEVM)

### Installation

```bash
npm install
```

### Compile

```bash
npm run compile
```

### Test

```bash
npm test
```

## 📖 Documentation

See the contract code for detailed documentation and examples.

## 🔗 Related Examples

- [Category: openzeppelin](../)

## 📝 License

BSD-3-Clause-Clear
