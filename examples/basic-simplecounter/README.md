# EntropyCounter

Counter using EntropyOracle for encrypted randomness

## 📋 Overview

This example demonstrates **basic** concepts in FHEVM with **EntropyOracle integration**:
- Integrating with EntropyOracle
- Using encrypted entropy in FHE operations
- Combining entropy with encrypted values
- Entropy-based counter increments

## 💡 Key Concepts

### EntropyOracle Integration
The counter uses EntropyOracle to get encrypted randomness for increments:
```solidity
IEntropyOracle entropyOracle;
uint256 requestId = entropyOracle.requestEntropy{value: fee}(tag);
euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
```

### Entropy-Based Increments
Instead of simple +1 increments, the counter uses entropy to add randomness:
- Request entropy from EntropyOracle
- Combine entropy with counter using XOR
- Add 1 to the mixed value
- Result: Entropy-enhanced counter increments

### Encrypted Storage
The counter value is stored as `euint64`, meaning it's always encrypted on-chain.

### FHE Operations
We use `FHE.add()`, `FHE.xor()` to perform operations on encrypted values without decrypting them.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Hardhat
- Sepolia Testnet (for FHEVM)
- **Deployed EntropyOracle contract** (required for entropy-based increments)

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

**Note**: Full entropy tests require a deployed EntropyOracle contract. Set `ENTROPY_ORACLE_ADDRESS` environment variable.

## 📖 Usage Example

### Basic Usage (Without Entropy)

```typescript
// Deploy contract
const contract = await EntropyCounterFactory.deploy(oracleAddress);

// Initialize counter
const input = hre.fhevm.createEncryptedInput(contractAddress, userAddress);
input.add64(0);
const encryptedInput = await input.encrypt();
await contract.initialize(encryptedInput.handles[0], encryptedInput.inputProof);

// Simple increment (no entropy)
await contract.increment();
```

### Entropy-Based Usage

```typescript
// Request entropy for increment
const tag = ethers.id("increment-1");
const fee = await contract.entropyOracle.getFee();
const requestId = await contract.requestIncrement(tag, { value: fee });

// Wait for entropy to be ready
await waitForEntropy(requestId);

// Increment using entropy
await contract.incrementWithEntropy(requestId);
```

## 🔗 Related Examples

- [Arithmetic](../basic-arithmetic/) - Entropy-based arithmetic operations
- [EqualityComparison](../basic-equalitycomparison/) - Entropy-based comparisons
- [Category: basic](../)

## 📝 License

BSD-3-Clause-Clear
