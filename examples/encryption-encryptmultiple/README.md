# EntropyEncryptMultiple

Encrypt and store multiple values using EntropyOracle

## 🚀 Quick Start

1. **Clone this repository:**
   ```bash
   git clone https://github.com/zacnider/fhevm-example-encryption-encryptmultiple.git
   cd fhevm-example-encryption-encryptmultiple
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Setup environment:**
   ```bash
   npm run setup
   ```
   Then edit `.env` file with your credentials:
   - `SEPOLIA_RPC_URL` - Your Sepolia RPC endpoint
   - `PRIVATE_KEY` - Your wallet private key (for deployment)
   - `ETHERSCAN_API_KEY` - Your Etherscan API key (for verification)

4. **Compile contracts:**
   ```bash
   npm run compile
   ```

5. **Run tests:**
   ```bash
   npm test
   ```

6. **Deploy to Sepolia:**
   ```bash
   npm run deploy:sepolia
   ```

7. **Verify contract (after deployment):**
   ```bash
   npm run verify <CONTRACT_ADDRESS>
   ```

**Alternative:** Use the [Examples page](https://entrofhe.vercel.app/examples) for browser-based deployment and verification.

---

## 🚀 Standard workflow
- Install (first run): `npm install --legacy-peer-deps`
- Compile: `npx hardhat compile`
- Test (local FHE + local oracle/chaos engine auto-deployed): `npx hardhat test`
- Deploy (frontend Deploy button): constructor arg is fixed to EntropyOracle `0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`
- Verify: `npx hardhat verify --network sepolia <contractAddress> 0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`

## 📋 Overview

This example demonstrates **encrypting and storing multiple values** in FHEVM with **EntropyOracle integration**:
- Integrating with EntropyOracle for batch operations
- Encrypting multiple values at once
- Storing multiple encrypted values in a mapping
- Using entropy to enhance encryption patterns for multiple values
- Batch operations on encrypted data

## 🎯 What This Example Teaches

This tutorial will teach you:

1. **How to encrypt multiple values off-chain** using FHEVM SDK
2. **How to send multiple encrypted values to contracts** with input proofs
3. **How to store multiple encrypted values** on-chain using mappings
4. **How to enhance multiple values with entropy** from EntropyOracle
5. **How to perform batch operations** efficiently
6. **The importance of `FHE.allowThis()`** for stored values in batch operations

## 💡 Why This Matters

Batch encryption is essential for efficient FHEVM operations. With EntropyOracle, you can:
- **Process multiple values** in a single transaction
- **Add randomness** to multiple encrypted values without revealing them
- **Enhance security** by mixing entropy with user-encrypted data in batch
- **Reduce gas costs** by batching operations
- **Learn efficient patterns** for handling multiple encrypted values

## 🔍 How It Works

### Contract Structure

The contract has four main components:

1. **Basic Single Encryption**: Encrypt and store a single value at a specific key
2. **Batch Encryption**: Encrypt and store multiple values at once
3. **Entropy Request**: Request randomness from EntropyOracle
4. **Entropy-Enhanced Encryption**: Combine user values with entropy (single and batch)

### Step-by-Step Code Explanation

#### 1. Constructor

```solidity
constructor(address _entropyOracle) {
    require(_entropyOracle != address(0), "Invalid oracle address");
    entropyOracle = IEntropyOracle(_entropyOracle);
}
```

Sets the EntropyOracle address for the contract.

#### 2. Single Value Encryption

```solidity
function encryptAndStore(
    uint256 key,
    externalEuint64 encryptedInput,
    bytes calldata inputProof
) external {
    euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
    FHE.allowThis(internalValue);
    encryptedValues[key] = internalValue;
    isInitialized[key] = true;
    totalValues++;
}
```

Encrypts and stores a single value at a specific key.

#### 3. Batch Encryption

```solidity
function encryptAndStoreBatch(
    uint256[] calldata keys,
    externalEuint64[] calldata encryptedInputs,
    bytes[] calldata inputProofs
) external {
    require(keys.length == encryptedInputs.length, "Keys and inputs length mismatch");
    require(keys.length == inputProofs.length, "Keys and proofs length mismatch");
    require(keys.length > 0, "Empty arrays");
    
    for (uint256 i = 0; i < keys.length; i++) {
        euint64 internalValue = FHE.fromExternal(encryptedInputs[i], inputProofs[i]);
        FHE.allowThis(internalValue);
        encryptedValues[keys[i]] = internalValue;
        if (!isInitialized[keys[i]]) {
            isInitialized[keys[i]] = true;
            totalValues++;
        }
    }
}
```

Encrypts and stores multiple values in a single transaction.

#### 4. Entropy-Enhanced Batch Encryption

```solidity
function encryptAndStoreBatchWithEntropy(
    uint256[] calldata keys,
    externalEuint64[] calldata encryptedInputs,
    bytes[] calldata inputProofs,
    uint256 requestId
) external {
    // Get entropy once for all values
    euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
    FHE.allowThis(entropy);
    
    for (uint256 i = 0; i < keys.length; i++) {
        euint64 internalValue = FHE.fromExternal(encryptedInputs[i], inputProofs[i]);
        FHE.allowThis(internalValue);
        euint64 enhancedValue = FHE.xor(internalValue, entropy);
        FHE.allowThis(enhancedValue);
        encryptedValues[keys[i]] = enhancedValue;
        // ... update state
    }
}
```

Combines multiple user values with entropy for enhanced encryption.

## 🧪 Testing

Run the test suite:

```bash
npm test
```

The tests cover:
- Single value encryption
- Batch encryption
- Entropy-enhanced encryption (single and batch)
- Error handling (mismatched arrays, empty arrays)
- Value retrieval by key

## 📚 Related Examples

- [EntropyEncryption (Single)](../encryption-encryptsingle/) - Single value encryption
- [EntropyUserDecryptMultiple](../user-decryption-userdecryptmultiple/) - User decrypt multiple values
- [EntropyPublicDecryptMultiple](../public-decryption-publicdecryptmultiple/) - Public decrypt multiple values

## 🔗 Links

- [EntropyOracle Documentation](https://entrofhe.vercel.app)
- [FHEVM Documentation](https://docs.zama.org/protocol)
- [Examples Hub](https://entrofhe.vercel.app/examples)

## 📝 License

BSD-3-Clause-Clear
