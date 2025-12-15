# Zama FHEVM Usage Guide

This guide explains how Zama FHEVM is used throughout this project and in all examples.

## What is Zama FHEVM?

**Zama FHEVM** is the core framework of the Zama Confidential Blockchain Protocol. It enables confidential smart contracts on EVM-compatible blockchains by leveraging Fully Homomorphic Encryption (FHE), allowing encrypted data to be processed directly on-chain.

**Key Features:**
- End-to-end encryption of transactions and state
- Composability and data availability on-chain
- No impact on existing dApps and state
- Quantum-resistant cryptography
- Symbolic execution for efficient processing

Learn more: [Zama FHEVM Documentation](https://docs.zama.org/protocol)

## Zama FHEVM in This Project

This entire project is built using Zama FHEVM. All 22 examples demonstrate real-world usage of Zama FHEVM's features.

### Core Zama FHEVM Components Used

#### 1. ZamaEthereumConfig

All contracts inherit from `ZamaEthereumConfig` to get network-specific configuration:

```solidity
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract MyContract is ZamaEthereumConfig {
    // Contract inherits network configuration from Zama
}
```

**What it provides:**
- Network-specific FHEVM configuration
- Coprocessor addresses
- ACL (Access Control List) addresses
- KMS Verifier addresses

#### 2. FHE Operations Library

All examples use Zama's FHE operations library:

```solidity
import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
```

**Available Operations:**
- **Arithmetic**: `FHE.add`, `FHE.sub`, `FHE.mul`, `FHE.div`
- **Comparison**: `FHE.eq`, `FHE.lt`, `FHE.gt`, `FHE.le`, `FHE.ge`
- **Boolean**: `FHE.and`, `FHE.or`, `FHE.not`, `FHE.xor`
- **Conditional**: `FHE.ifThenElse`
- **Type Conversion**: `FHE.asEuint64`, `FHE.asEuint32`, etc.

#### 3. Encrypted Types

Zama FHEVM provides encrypted integer types:

- `euint64` - 64-bit encrypted unsigned integer
- `euint32` - 32-bit encrypted unsigned integer
- `euint16` - 16-bit encrypted unsigned integer
- `euint8` - 8-bit encrypted unsigned integer
- `externalEuint64` - External encrypted value (from user)

#### 4. Access Control System

Zama FHEVM's permission system for encrypted data:

```solidity
// Allow contract to use encrypted value
FHE.allowThis(encryptedValue);

// Allow specific user to decrypt
FHE.allow(encryptedValue, userAddress);

// Temporary permission for single operation
FHE.allowTransient(encryptedValue, userAddress);
```

#### 5. Public Decryption

Make encrypted values publicly decryptable:

```solidity
euint64 publicValue = FHE.makePubliclyDecryptable(encryptedValue);
```

#### 6. External Encryption

Handle user-provided encrypted values:

```solidity
// Convert external encrypted value to internal
euint64 internalValue = FHE.fromExternal(externalEuint64, inputProof);
```

## Zama FHEVM Usage by Example Category

### Basic Examples

**Zama FHEVM Features Used:**
- `ZamaEthereumConfig` inheritance
- `euint64` encrypted types
- `FHE.add`, `FHE.sub`, `FHE.mul` arithmetic operations
- `FHE.eq` comparison operations
- `FHE.allowThis()` for contract permissions

**Examples:**
- `EntropyCounter` - Uses `FHE.add` with encrypted values
- `EntropyArithmetic` - Uses `FHE.add`, `FHE.sub`, `FHE.mul`
- `EntropyEqualityComparison` - Uses `FHE.eq` for comparisons

### Encryption Examples

**Zama FHEVM Features Used:**
- `externalEuint64` for user-provided encrypted values
- `FHE.fromExternal()` to convert external to internal
- `FHE.allowThis()` to allow contract usage
- `FHE.xor()` for entropy mixing

**Examples:**
- `EntropyEncryption` - Encrypts single values
- `EntropyEncryptMultiple` - Encrypts multiple values

### Decryption Examples

**Zama FHEVM Features Used:**
- `FHE.allow()` for user-specific decryption
- `FHE.makePubliclyDecryptable()` for public decryption
- Permission management patterns

**Examples:**
- `EntropyUserDecryption` - Uses `FHE.allow()` for user decryption
- `EntropyPublicDecryption` - Uses `FHE.makePubliclyDecryptable()`

### Access Control Examples

**Zama FHEVM Features Used:**
- `FHE.allow()` for user permissions
- `FHE.allowTransient()` for temporary permissions
- `FHE.allowThis()` for contract permissions

**Examples:**
- `EntropyAccessControl` - Demonstrates all access control patterns

### Advanced Examples

**Zama FHEVM Features Used:**
- Complex FHE operation combinations
- Multiple encrypted types
- Real-world application patterns

**Examples:**
- `SimpleLottery` - Uses FHE for fair winner selection
- `RandomNumberGenerator` - Uses FHE for encrypted randomness
- `EntropyNFT` - Uses FHE for trait selection

## Zama FHEVM Integration Pattern

Every example follows this pattern:

### 1. Import Zama FHEVM Libraries

```solidity
import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
```

### 2. Inherit from ZamaEthereumConfig

```solidity
contract MyContract is ZamaEthereumConfig {
    // Contract code
}
```

### 3. Use Encrypted Types

```solidity
euint64 private encryptedValue;
```

### 4. Perform FHE Operations

```solidity
euint64 result = FHE.add(encryptedValue1, encryptedValue2);
FHE.allowThis(result);
```

### 5. Handle Permissions

```solidity
// Allow contract to use
FHE.allowThis(encryptedValue);

// Allow user to decrypt
FHE.allow(encryptedValue, userAddress);
```

## Zama FHEVM Relayer

All examples use Zama's relayer for:

- **Encryption**: Converting plaintext to encrypted values
- **Decryption**: Converting encrypted values to plaintext
- **FHE Operations**: Processing encrypted computations

The relayer is automatically configured through Hardhat's FHEVM plugin.

## Zama FHEVM Best Practices

### 1. Always Use ZamaEthereumConfig

```solidity
// ✅ Good
contract MyContract is ZamaEthereumConfig {
    // ...
}

// ❌ Bad
contract MyContract {
    // Missing network configuration
}
```

### 2. Handle Permissions Correctly

```solidity
// ✅ Good - Allow contract before using
euint64 result = FHE.add(a, b);
FHE.allowThis(result);
storedValue = result;

// ❌ Bad - Missing allowThis
euint64 result = FHE.add(a, b);
storedValue = result; // Will fail!
```

### 3. Use Appropriate Encrypted Types

```solidity
// ✅ Good - Use euint64 for most cases
euint64 value = FHE.asEuint64(42);

// ✅ Good - Use smaller types when possible
euint32 smallValue = FHE.asEuint32(10);
```

### 4. Validate External Inputs

```solidity
// ✅ Good - Validate input proof
euint64 internal = FHE.fromExternal(externalValue, inputProof);
FHE.allowThis(internal);

// ❌ Bad - Missing validation
euint64 internal = FHE.fromExternal(externalValue, inputProof);
```

## Troubleshooting Zama FHEVM

### Common Issues

1. **"Permission denied" errors**
   - Solution: Ensure you call `FHE.allowThis()` before using encrypted values

2. **"Invalid input proof" errors**
   - Solution: Ensure input proofs are generated correctly using the relayer

3. **"Network not supported" errors**
   - Solution: Ensure you're using `ZamaEthereumConfig` and correct network

4. **"Relayer not initialized" errors**
   - Solution: Ensure Hardhat FHEVM plugin is configured correctly

## Resources

- 📚 [Zama FHEVM Documentation](https://docs.zama.org/protocol)
- 🎓 [Zama Developer Hub](https://www.zama.org/developer-hub)
- 💻 [Zama FHEVM GitHub](https://github.com/zama-ai/fhevm)
- 🛠️ [Zama Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template)

## Statistics

- **Total Examples Using Zama FHEVM**: 22
- **Zama FHEVM Operations Demonstrated**: 15+
- **Zama FHEVM Features Covered**: All major features
- **Network Support**: Sepolia Testnet (via ZamaEthereumConfig)

