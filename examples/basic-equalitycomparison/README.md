# EntropyEqualityComparison

FHE equality comparison using EntropyOracle

## 📋 Overview

This example demonstrates **basic** concepts in FHEVM with **EntropyOracle integration**:
- Integrating with EntropyOracle
- Using encrypted entropy in equality comparisons
- Entropy-enhanced comparison operations
- Combining entropy with encrypted values for comparisons

## 💡 Key Concepts

### EntropyOracle Integration
The contract uses EntropyOracle to get encrypted randomness for enhanced comparisons:
```solidity
IEntropyOracle entropyOracle;
uint256 requestId = entropyOracle.requestEntropy{value: fee}(tag);
euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
```

### Entropy-Enhanced Comparisons
Instead of simple equality checks, comparisons can be enhanced with entropy:
- Request entropy from EntropyOracle
- Mix values with entropy using XOR
- Compare mixed values
- Result: Entropy-enhanced equality comparison

### Basic Comparison
Standard FHE equality comparison is still available:
- `compare()` - Compare two encrypted values for equality

### Encrypted Boolean Results
Comparison results are `ebool` (encrypted boolean), meaning the result is also encrypted.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Hardhat
- Sepolia Testnet (for FHEVM)
- **Deployed EntropyOracle contract** (required for entropy-based comparisons)

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
const contract = await EntropyEqualityComparisonFactory.deploy(oracleAddress);

// Initialize values
const input1 = hre.fhevm.createEncryptedInput(contractAddress, userAddress);
input1.add64(5);
const encryptedInput1 = await input1.encrypt();

const input2 = hre.fhevm.createEncryptedInput(contractAddress, userAddress);
input2.add64(5);
const encryptedInput2 = await input2.encrypt();

await contract.initialize(
  encryptedInput1.handles[0],
  encryptedInput2.handles[0],
  encryptedInput1.inputProof
);

// Basic comparison
const result = await contract.compare(); // Returns ebool
```

### Entropy-Enhanced Usage

```typescript
// Request entropy
const tag = ethers.id("comparison-1");
const fee = await contract.entropyOracle.getFee();
const requestId = await contract.requestEntropy(tag, { value: fee });

// Wait for entropy to be ready
await waitForEntropy(requestId);

// Entropy-enhanced comparison
const result = await contract.compareWithEntropy(requestId);
```

## 🔗 Related Examples

- [EntropyCounter](../basic-simplecounter/) - Entropy-based counter
- [EntropyArithmetic](../basic-arithmetic/) - Entropy-based arithmetic
- [Category: basic](../)

## 📝 License

BSD-3-Clause-Clear
