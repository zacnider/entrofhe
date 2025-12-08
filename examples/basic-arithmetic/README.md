# EntropyArithmetic

FHE arithmetic operations using EntropyOracle

## 🚀 Standard workflow
- Install (first run): `npm install --legacy-peer-deps`
- Compile: `npx hardhat compile`
- Test (local FHE + local oracle/chaos engine auto-deployed): `npx hardhat test`
- Deploy (frontend Deploy button): constructor arg is fixed to EntropyOracle `0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`
- Verify: `npx hardhat verify --network sepolia <contractAddress> 0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`

## 📋 Overview

This example demonstrates **basic** concepts in FHEVM with **EntropyOracle integration**:
- Integrating with EntropyOracle
- Using encrypted entropy in arithmetic operations
- Entropy-enhanced calculations (add, sub, mul with entropy)
- Combining entropy with encrypted values

## 💡 Key Concepts

### EntropyOracle Integration
The contract uses EntropyOracle to get encrypted randomness for enhanced calculations:
```solidity
IEntropyOracle entropyOracle;
uint256 requestId = entropyOracle.requestEntropy{value: fee}(tag);
euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
```

### Entropy-Enhanced Operations
Instead of simple arithmetic, operations can be enhanced with entropy:
- Request entropy from EntropyOracle
- Perform arithmetic operation (add/sub/mul)
- Mix result with entropy using XOR
- Result: Entropy-enhanced arithmetic operations

### Basic Operations
Standard FHE arithmetic operations are still available:
- `add()` - Add two encrypted values
- `subtract()` - Subtract encrypted values
- `multiply()` - Multiply encrypted values

### Encrypted Storage
Values are stored as `euint64`, meaning they're always encrypted on-chain.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Hardhat
- Sepolia Testnet (for FHEVM)
- **Deployed EntropyOracle contract** (required for entropy-based operations)

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
const contract = await EntropyArithmeticFactory.deploy(oracleAddress);

// Initialize values
const input1 = hre.fhevm.createEncryptedInput(contractAddress, userAddress);
input1.add64(5);
const encryptedInput1 = await input1.encrypt();

const input2 = hre.fhevm.createEncryptedInput(contractAddress, userAddress);
input2.add64(3);
const encryptedInput2 = await input2.encrypt();

await contract.initialize(
  encryptedInput1.handles[0],
  encryptedInput2.handles[0],
  encryptedInput1.inputProof
);

// Basic operations
await contract.add();
await contract.subtract();
await contract.multiply();
```

### Entropy-Enhanced Usage

```typescript
// Request entropy
const tag = ethers.id("arithmetic-1");
const fee = await contract.entropyOracle.getFee();
const requestId = await contract.requestEntropy(tag, { value: fee });

// Wait for entropy to be ready
await waitForEntropy(requestId);

// Entropy-enhanced operations
await contract.addWithEntropy(requestId);
await contract.subtractWithEntropy(requestId);
await contract.multiplyWithEntropy(requestId);
```

## 🔗 Related Examples

- [EntropyCounter](../basic-simplecounter/) - Entropy-based counter
- [EqualityComparison](../basic-equalitycomparison/) - Entropy-based comparisons
- [Category: basic](../)

## 📝 License

BSD-3-Clause-Clear
