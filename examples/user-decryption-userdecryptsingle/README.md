# EntropyUserDecryption

User decrypt single value using EntropyOracle and FHE.allow

## 🚀 Standard workflow
- Install (first run): `npm install --legacy-peer-deps`
- Compile: `npx hardhat compile`
- Test (local FHE + local oracle/chaos engine auto-deployed): `npx hardhat test`
- Deploy (frontend Deploy button): constructor arg is fixed to EntropyOracle `0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`
- Verify: `npx hardhat verify --network sepolia <contractAddress> 0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`

## 📋 Overview

This example demonstrates **user-decryption** concepts in FHEVM with **EntropyOracle integration**:
- Integrating with EntropyOracle
- Using entropy to enhance user-specific decryption patterns
- Combining entropy with user-specific access control
- Entropy-based decryption key generation

## 💡 Key Concepts

### EntropyOracle Integration
The contract uses EntropyOracle to get encrypted randomness for enhanced decryption:
```solidity
IEntropyOracle entropyOracle;
uint256 requestId = entropyOracle.requestEntropy{value: fee}(tag);
euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
```

### Entropy-Enhanced User Decryption
Instead of simple user decryption, values can be enhanced with entropy:
- User encrypts value off-chain
- Request entropy from EntropyOracle
- Combine user value with entropy using XOR
- Allow specific user to decrypt enhanced value
- Result: Entropy-enhanced user-specific decryption

### Basic User Decryption
Standard user decryption is still available:
- `storeAndAllow()` - Store value and allow specific user to decrypt

### FHE.allow Pattern
Uses `FHE.allow()` to grant specific user decryption rights:
```solidity
FHE.allow(encryptedValue, user);
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Hardhat
- Sepolia Testnet (for FHEVM)
- **Deployed EntropyOracle contract** (required for entropy-based decryption)

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
const contract = await EntropyUserDecryptionFactory.deploy(oracleAddress);

// Store and allow user
const input = hre.fhevm.createEncryptedInput(contractAddress, userAddress);
input.add64(42);
const encryptedInput = await input.encrypt();

await contract.storeAndAllow(
  encryptedInput.handles[0],
  encryptedInput.inputProof,
  allowedUserAddress
);
```

### Entropy-Enhanced Usage

```typescript
// Request entropy
const tag = ethers.id("user-decrypt-1");
const fee = await contract.entropyOracle.getFee();
const requestId = await contract.requestEntropy(tag, { value: fee });

// Wait for entropy to be ready
await waitForEntropy(requestId);

// Store with entropy
const input = hre.fhevm.createEncryptedInput(contractAddress, userAddress);
input.add64(42);
const encryptedInput = await input.encrypt();

await contract.storeAndAllowWithEntropy(
  encryptedInput.handles[0],
  encryptedInput.inputProof,
  allowedUserAddress,
  requestId
);
```

## 🔗 Related Examples

- [EntropyPublicDecryption](../public-decryption-publicdecryptsingle/) - Entropy-based public decryption
- [EntropyAccessControl](../access-control-accesscontrol/) - Entropy-based access control
- [Category: user-decryption](../)

## 📝 License

BSD-3-Clause-Clear
