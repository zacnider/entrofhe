# EntropyEncryption

Encrypt and store values using EntropyOracle

## 📋 Overview

This example demonstrates **encryption** concepts in FHEVM with **EntropyOracle integration**:
- Integrating with EntropyOracle
- Using entropy to enhance encryption patterns
- Combining user-encrypted values with entropy
- Entropy-based encryption key generation

## 💡 Key Concepts

### EntropyOracle Integration
The contract uses EntropyOracle to get encrypted randomness for enhanced encryption:
```solidity
IEntropyOracle entropyOracle;
uint256 requestId = entropyOracle.requestEntropy{value: fee}(tag);
euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
```

### Entropy-Enhanced Encryption
Instead of simple encryption, values can be enhanced with entropy:
- User encrypts value off-chain
- Request entropy from EntropyOracle
- Combine user value with entropy using XOR
- Result: Entropy-enhanced encrypted value

### Basic Encryption
Standard encryption is still available:
- `encryptAndStore()` - Encrypt and store a value
- `updateValue()` - Update stored encrypted value

### External to Internal Conversion
Values encrypted off-chain must be converted to internal format:
```solidity
euint64 internalValue = FHE.fromExternal(encryptedValue, inputProof);
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Hardhat
- Sepolia Testnet (for FHEVM)
- **Deployed EntropyOracle contract** (required for entropy-based encryption)

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
const contract = await EntropyEncryptionFactory.deploy(oracleAddress);

// Encrypt and store value
const input = hre.fhevm.createEncryptedInput(contractAddress, userAddress);
input.add64(42);
const encryptedInput = await input.encrypt();

await contract.encryptAndStore(encryptedInput.handles[0], encryptedInput.inputProof);
```

### Entropy-Enhanced Usage

```typescript
// Request entropy
const tag = ethers.id("encrypt-1");
const fee = await contract.entropyOracle.getFee();
const requestId = await contract.requestEntropy(tag, { value: fee });

// Wait for entropy to be ready
await waitForEntropy(requestId);

// Encrypt with entropy
const input = hre.fhevm.createEncryptedInput(contractAddress, userAddress);
input.add64(42);
const encryptedInput = await input.encrypt();

await contract.encryptAndStoreWithEntropy(
  encryptedInput.handles[0],
  encryptedInput.inputProof,
  requestId
);
```

## 🔗 Related Examples

- [UserDecryptSingle](../user-decryption-userdecryptsingle/) - Entropy-based user decryption
- [PublicDecryptSingle](../public-decryption-publicdecryptsingle/) - Entropy-based public decryption
- [Category: encryption](../)

## 📝 License

BSD-3-Clause-Clear
