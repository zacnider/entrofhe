# SimpleLottery

Simple lottery using entropy oracle

## 📋 Overview

This example demonstrates **advanced** concepts in FHEVM:
- Integrating with an entropy oracle
- Using encrypted randomness for fair selection
- Round-based lottery system
- Real-world application pattern

## 💡 Key Concepts

### Entropy Oracle Integration
The contract uses an external entropy oracle to get encrypted random values:
```solidity
IEntropyOracle oracle;
euint64 entropy = oracle.requestEntropy(tag);
```

### Encrypted Randomness
The lottery uses encrypted entropy to ensure fairness - the winner is selected using encrypted random values that cannot be predicted.

### Round-Based System
The lottery supports multiple rounds, allowing participants to enter new lotteries after a reset.

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
const contract = await SimpleLotteryFactory.deploy(oracleAddress);

// Participants enter lottery
await contract.connect(user1).enter({ value: entryFee });
await contract.connect(user2).enter({ value: entryFee });

// Select winner (uses entropy oracle)
await contract.selectWinner();

// Get status
const [participantCount, complete, winner] = await contract.getStatus();

// Reset for new round (owner only)
await contract.resetLottery();
```

## 🔗 Related Examples

- [RandomNumberGenerator](../advanced-randomnumbergenerator/) - Random number generation
- [EntropyNFT](../advanced-entropynft/) - NFT with entropy-based traits
- [Category: advanced](../)

## 📝 License

BSD-3-Clause-Clear
