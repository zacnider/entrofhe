# RandomNumberGenerator

Random number generator using entropy oracle

## 🚀 Standard workflow
- Install (first run): `npm install --legacy-peer-deps`
- Compile: `npx hardhat compile`
- Test (local FHE + local oracle/chaos engine auto-deployed): `npx hardhat test`
- Deploy (frontend Deploy button): constructor arg is fixed to EntropyOracle `0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`
- Verify: `npx hardhat verify --network sepolia <contractAddress> 0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`

## 📋 Overview

This example demonstrates **advanced** concepts in FHEVM:
- Integrating with an entropy oracle
- Generating random numbers using encrypted entropy
- Using randomness in smart contracts
- Real-world application pattern

## 💡 Key Concepts

### Entropy Oracle Integration
The contract uses an external entropy oracle to get encrypted random values:
```solidity
IEntropyOracle oracle;
euint64 entropy = oracle.requestEntropy(tag);
```

### Encrypted Randomness
Random numbers are generated using encrypted entropy, ensuring:
- **Unpredictability**: Values cannot be predicted
- **Fairness**: Random selection is verifiable
- **Privacy**: Entropy remains encrypted

### Tag-Based Requests
Each request uses a unique tag to ensure different random values.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Hardhat
- Sepolia Testnet (for FHEVM)
- Deployed EntropyOracle contract

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

**Note**: Full tests require a deployed EntropyOracle contract. The test file includes placeholder tests.

## 📖 Usage Example

```typescript
// Deploy with EntropyOracle address
const oracleAddress = "0x..."; // Your EntropyOracle address
const contract = await RandomNumberGeneratorFactory.deploy(oracleAddress);

// Request random number
const tag = ethers.id("my-unique-tag");
await contract.requestRandomNumber(tag, { value: fee });

// Get random number (encrypted)
const randomNumber = await contract.getRandomNumber(tag);
```

## 🔗 Related Examples

- [SimpleLottery](../advanced-simplelottery/) - Lottery using entropy
- [EntropyNFT](../advanced-entropynft/) - NFT with entropy-based traits
- [Category: advanced](../)

## 📝 License

BSD-3-Clause-Clear
