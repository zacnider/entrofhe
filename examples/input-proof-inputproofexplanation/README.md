# EntropyInputProof

Input proofs with EntropyOracle integration

## 🚀 Standard workflow
- Install (first run): `npm install --legacy-peer-deps`
- Compile: `npx hardhat compile`
- Test (local FHE + local oracle/chaos engine auto-deployed): `npx hardhat test`
- Deploy (frontend Deploy button): constructor arg is fixed to EntropyOracle `0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`
- Verify: `npx hardhat verify --network sepolia <contractAddress> 0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`

## 📋 Overview

This example demonstrates **input-proof** concepts in FHEVM with **EntropyOracle integration**:
- What input proofs are
- Why they're required for external encrypted inputs
- How to use them correctly with EntropyOracle
- Security implications
- Entropy-enhanced input validation

## 💡 Key Concepts

### EntropyOracle Integration
The contract uses EntropyOracle to get encrypted randomness for enhanced input validation:
```solidity
IEntropyOracle entropyOracle;
uint256 requestId = entropyOracle.requestEntropy{value: fee}(tag);
euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
```

### Entropy-Enhanced Input Validation
Instead of simple input validation, values can be enhanced with entropy:
- Validate input with proof
- Request entropy from EntropyOracle
- Combine validated value with entropy
- Result: Entropy-enhanced validated input

### Input Proof Requirements
Input proofs are required for all `externalEuint64` inputs:
1. Must be provided for all external encrypted inputs
2. Validates that the encrypted value is properly encrypted
3. Prevents invalid or malicious encrypted inputs
4. Generated automatically by FHEVM SDK

### Why Input Proofs?
- **Security**: Prevents invalid encrypted values
- **Validation**: Ensures encryption is correct
- **Trust**: Verifies the value came from FHEVM SDK

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Hardhat
- Sepolia Testnet (for FHEVM)
- **Deployed EntropyOracle contract** (required for entropy-based validation)

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
const contract = await EntropyInputProofFactory.deploy(oracleAddress);

// Store with proof
const input = hre.fhevm.createEncryptedInput(contractAddress, userAddress);
input.add64(42);
const encryptedInput = await input.encrypt();

await contract.storeWithProof(
  encryptedInput.handles[0],
  encryptedInput.inputProof
);
```

### Entropy-Enhanced Usage

```typescript
// Request entropy
const tag = ethers.id("input-proof-1");
const fee = await contract.entropyOracle.getFee();
const requestId = await contract.requestEntropy(tag, { value: fee });

// Wait for entropy to be ready
await waitForEntropy(requestId);

// Store with proof and entropy
const input = hre.fhevm.createEncryptedInput(contractAddress, userAddress);
input.add64(42);
const encryptedInput = await input.encrypt();

await contract.storeWithProofAndEntropy(
  encryptedInput.handles[0],
  encryptedInput.inputProof,
  requestId
);
```

## 🔗 Related Examples

- [EntropyEncryption](../encryption-encryptsingle/) - Entropy-based encryption
- [Category: input-proof](../)

## 📝 License

BSD-3-Clause-Clear
