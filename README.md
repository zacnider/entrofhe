# FHEVM Example Hub with EntropyOracle Integration

A comprehensive collection of standalone, Hardhat-based FHEVM examples demonstrating various concepts and patterns for building privacy-preserving smart contracts using Fully Homomorphic Encryption. **All examples are integrated with EntropyOracle** - a production-ready FHE-based entropy and randomness infrastructure.

## 🎯 Overview

This repository provides a complete set of FHEVM examples organized by category, with automated scaffolding tools, comprehensive tests, and auto-generated documentation. Each example is a standalone Hardhat project demonstrating one clear FHEVM concept **with EntropyOracle integration** for encrypted randomness.

### 🔑 Key Feature: EntropyOracle Integration

**All 22 tutorial examples** demonstrate how to integrate and use **EntropyOracle** - an on-chain entropy oracle that provides cryptographically secure randomness using FHE technology. Unlike traditional VRF solutions, EntropyOracle keeps seeds encrypted at all times, ensuring maximum privacy and security.

**EntropyOracle Features:**
- 🔒 **FHE-Based Privacy**: Seeds and entropy remain encrypted on-chain
- 💰 **Low Cost**: Only 0.00001 ETH per entropy request
- 🛠️ **Developer-Friendly**: Simple interface for easy integration
- ⛓️ **On-Chain**: No external dependencies or oracles
- 📍 **Deployed on Sepolia**: `0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`

## ✨ Features

- **🛠️ CLI Tool**: Interactive command-line tool (`entrofhe-cli`) to generate EntropyOracle-integrated examples instantly
- **Automated Scaffolding**: TypeScript CLI tools for generating example repositories
- **Comprehensive Tests**: Test suites showing both correct usage and common pitfalls
- **Documentation Generator**: Auto-generates GitBook-compatible documentation from code annotations
- **Base Template**: Reusable Hardhat template for quick example creation
- **Category Organization**: Examples organized by concept (basic, encryption, decryption, etc.)
- **Developer Guide**: Complete guide for adding new examples and maintaining the hub

## 📋 Requirements

- Node.js 18+
- Hardhat
- Sepolia Testnet (for FHEVM)
- Zama FHEVM Relayer

## 🚀 Quick Start

### Option 1: Using the CLI Tool (Recommended)

The easiest way to get started is using the **EntroFHE CLI** tool:

```bash
# Install globally (optional, for easier access)
npm install -g entrofhe-cli

# Or use with npx (no installation needed)
npx entrofhe-cli
```

**Interactive Mode:**
```bash
entrofhe
# Shows numbered list of all 22 examples
# Select by number, enter output directory, and create!
```

**Direct Mode:**
```bash
# Create by number
entrofhe create 1 ./my-project

# Create by key
entrofhe create entropy-counter ./my-project

# List all examples
entrofhe list
```

The CLI automatically:
- ✅ Generates standalone Hardhat project
- ✅ Integrates EntropyOracle
- ✅ Includes all necessary files and dependencies
- ✅ Sets up tests and deployment scripts

### Option 2: Manual Installation

```bash
npm install
```

### Create a New Example (Manual)

```bash
npm run create-example -- --name MyExample --category basic --description "My example description"
```

### Generate Documentation

```bash
npm run generate-docs
```

### Run Tests

```bash
# Test all examples
for dir in examples/*/; do
  cd "$dir" && npm test && cd ../..
done
```

## 📂 Project Structure

```
.
├── cli/                    # EntroFHE CLI tool (npm package)
│   ├── src/               # CLI source code
│   └── package.json       # CLI package configuration
├── base-template/          # Base Hardhat template for examples
├── examples/               # Standalone example repositories
│   ├── basic-*/           # Basic FHE operations
│   ├── encryption-*/      # Encryption examples
│   ├── user-decryption-*/ # User decryption examples
│   └── ...
├── automation/            # Automation scripts
│   ├── create-fhevm-example.ts
│   ├── create-fhevm-category.ts
│   └── generate-docs.ts
├── docs/                  # Auto-generated documentation
└── DEVELOPER_GUIDE.md     # Guide for contributors
```

## 📚 Example Categories

**All examples below are integrated with EntropyOracle** and demonstrate how to use encrypted entropy in different FHEVM scenarios.

### Basic (EntropyOracle Integration)
- **EntropyCounter**: Counter using EntropyOracle for encrypted randomness
- **EntropyArithmetic**: FHE arithmetic operations using EntropyOracle
- **EntropyEqualityComparison**: FHE equality comparison using EntropyOracle

### Encryption (EntropyOracle Integration)
- **EntropyEncryption**: Encrypt and store single value using EntropyOracle
- **EntropyEncryptMultiple**: Encrypt and store multiple values using EntropyOracle

### User Decryption (EntropyOracle Integration)
- **EntropyUserDecryption**: User decrypt single value using EntropyOracle and FHE.allow
- **EntropyUserDecryptMultiple**: User decrypt multiple values using EntropyOracle and FHE.allow

### Public Decryption (EntropyOracle Integration)
- **EntropyPublicDecryption**: Public decrypt single value using EntropyOracle and makePubliclyDecryptable
- **EntropyPublicDecryptMultiple**: Public decrypt multiple values using EntropyOracle and makePubliclyDecryptable

### Access Control (EntropyOracle Integration)
- **EntropyAccessControl**: Access control with EntropyOracle, FHE.allow and FHE.allowTransient

### Input Proof (EntropyOracle Integration)
- **EntropyInputProof**: Input proofs with EntropyOracle integration

### Anti-Patterns (EntropyOracle Integration)
- **EntropyMissingAllowThis**: Missing FHE.allowThis() permissions with EntropyOracle
- **EntropyViewWithEncrypted**: View functions with encrypted values and EntropyOracle

### Handles (EntropyOracle Integration)
- **EntropyHandleLifecycle**: Understanding handles and symbolic execution with EntropyOracle

### Advanced (Live Contracts with EntropyOracle)
- **SimpleLottery**: Simple lottery using EntropyOracle (deployed on Sepolia)
- **RandomNumberGenerator**: Random number generator using EntropyOracle (deployed on Sepolia)
- **EntropyNFT**: ERC721 NFT with trait selection using EntropyOracle (deployed on Sepolia)

### OpenZeppelin Confidential Contracts (EntropyOracle Integration)
- **EntropyERC7984Token**: Basic ERC7984 confidential token implementation with EntropyOracle
- **EntropyERC7984ToERC20Wrapper**: Wrapper contract to convert ERC7984 to ERC20 tokens
- **EntropySwapERC7984ToERC20**: Swap ERC7984 confidential tokens to ERC20 tokens
- **EntropySwapERC7984ToERC7984**: Swap between two ERC7984 tokens
- **EntropyVestingWallet**: Vesting wallet with encrypted amounts and EntropyOracle

## 🛠️ Automation Scripts

### Create Example

```bash
npm run create-example -- --name <name> --category <category> [--description <description>] [--chapter <chapter>]
```

**Categories**: `basic`, `encryption`, `user-decryption`, `public-decryption`, `access-control`, `input-proof`, `anti-patterns`, `handles`, `advanced`, `openzeppelin`

### Create Category

```bash
npm run create-category -- --category <category> [--description <description>]
```

### Generate Documentation

```bash
npm run generate-docs
```

Generates GitBook-compatible documentation in `docs/examples/` from code annotations.

## 📖 Documentation

Documentation is auto-generated from JSDoc/TSDoc comments in contracts and tests. Use the following tags:

- `@title`: Contract/function title
- `@notice`: Short description
- `@dev`: Detailed explanation
- `@chapter`: Chapter tag for documentation organization

## 🧪 Testing

Each example includes comprehensive tests demonstrating:
- Correct usage patterns
- Common pitfalls
- Edge cases
- Error handling

Run tests for a specific example:

```bash
cd examples/basic-simplecounter
npm install
npm test
```

## 📝 Adding New Examples

See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for detailed instructions on:
- Creating new examples
- Writing tests
- Documentation standards
- Category guidelines
- Updating dependencies

## 🔗 EntropyOracle

**EntropyOracle** is a production-ready FHE-based entropy oracle deployed on Sepolia testnet.

- **Contract Address**: `0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`
- **Network**: Sepolia Testnet (Chain ID: 11155111)
- **Fee per Request**: 0.00001 ETH
- **Interface**: `IEntropyOracle.sol` (included in all examples)

### Quick Integration

```solidity
import "./interfaces/IEntropyOracle.sol";

contract MyContract {
    IEntropyOracle public constant ENTROPY_ORACLE = 
        IEntropyOracle(0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361);
    
    function useEntropy(bytes32 tag) external payable {
        uint256 requestId = ENTROPY_ORACLE.requestEntropy{value: 0.00001 ether}(tag);
        euint64 entropy = ENTROPY_ORACLE.getEncryptedEntropy(requestId);
        // Use entropy in your FHE operations...
    }
}
```

See [docs/INTEGRATION.md](./docs/INTEGRATION.md) for detailed integration guide.

## 🔐 Zama FHEVM Usage in This Project

This project is built entirely using **Zama FHEVM** - a full-stack framework for integrating Fully Homomorphic Encryption (FHE) with blockchain applications. All examples demonstrate real-world usage of Zama FHEVM's core features.

### Zama FHEVM Features Used

All examples in this hub utilize the following Zama FHEVM capabilities:

- **ZamaEthereumConfig**: All contracts inherit from `ZamaEthereumConfig` for network-specific configuration
- **FHE Operations**: Extensive use of Zama's FHE library operations:
  - Arithmetic: `FHE.add`, `FHE.sub`, `FHE.mul`, `FHE.div`
  - Comparison: `FHE.eq`, `FHE.lt`, `FHE.gt`, `FHE.le`, `FHE.ge`
  - Boolean: `FHE.and`, `FHE.or`, `FHE.not`, `FHE.xor`
  - Ternary: `FHE.ifThenElse`
- **Encrypted Types**: Using Zama's encrypted integer types (`euint64`, `euint32`, `euint16`, `euint8`)
- **External Encryption**: Using `externalEuint64` with input proofs for user-provided encrypted values
- **Access Control**: Zama's permission system:
  - `FHE.allowThis()` - Allow contract to use encrypted value
  - `FHE.allow()` - Allow specific user to decrypt
  - `FHE.allowTransient()` - Temporary permission for single operation
- **Public Decryption**: Using `FHE.makePubliclyDecryptable()` for public decryption patterns
- **Zama FHEVM Relayer**: All examples use Zama's relayer for encrypted operations and decryption

### Zama FHEVM Imports

Every example uses these core Zama FHEVM imports:

```solidity
// Zama FHEVM Core Library - FHE operations and encrypted types
import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";

// Zama Network Configuration - Provides network-specific settings
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
```

### Zama FHEVM Integration Pattern

All examples follow this Zama FHEVM integration pattern:

1. **Inherit from ZamaEthereumConfig**: Provides network configuration
   ```solidity
   contract MyContract is ZamaEthereumConfig {
       // Contract code
   }
   ```

2. **Use Zama FHE Operations**: Perform computations on encrypted data
   ```solidity
   euint64 result = FHE.add(encryptedValue1, encryptedValue2);
   ```

3. **Handle Permissions**: Use Zama's access control system
   ```solidity
   FHE.allowThis(result);  // Allow contract to use
   FHE.allow(result, user); // Allow user to decrypt
   ```

4. **Use Zama Relayer**: All encrypted operations are processed by Zama's relayer

### Zama FHEVM Usage Statistics

- **Total Zama FHEVM Operations Used**: 15+ different operations across all examples
- **Zama FHEVM Features Demonstrated**: 
  - ✅ Encrypted arithmetic operations
  - ✅ Encrypted comparison operations
  - ✅ Access control patterns
  - ✅ Public decryption patterns
  - ✅ External encryption with input proofs
  - ✅ Handle lifecycle management
- **Zama FHEVM Contracts**: 22 examples, all using `ZamaEthereumConfig`
- **Zama FHEVM Relayer**: Used for all encrypted operations and decryption

### Learn More About Zama FHEVM

- 📚 [Zama FHEVM Documentation](https://docs.zama.org/protocol) - Complete protocol documentation
- 🎓 [Zama Developer Hub](https://www.zama.org/developer-hub) - Learning resources and tutorials
- 💻 [Zama FHEVM GitHub](https://github.com/zama-ai/fhevm) - Source code and examples
- 🛠️ [Zama Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template) - Quick start template

## 🔗 Reference Repositories

- [Zama FHEVM Documentation](https://docs.zama.org/protocol)
- [Zama Developer Hub](https://www.zama.org/developer-hub)
- [Zama FHEVM GitHub](https://github.com/zama-ai/fhevm)
- [Zama Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template)
- [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)

## 📊 Statistics

- **Total Examples**: 22 examples (all with EntropyOracle integration)
- **Categories**: 10 categories
- **EntropyOracle Integration**: ✅ All examples
- **Test Coverage**: Comprehensive tests for each example
- **Documentation**: Auto-generated from code
- **Basic Examples**: 3 (EntropyCounter, EntropyArithmetic, EntropyEqualityComparison)
- **Encryption Examples**: 2 (EntropyEncryption, EntropyEncryptMultiple)
- **User Decryption Examples**: 2 (EntropyUserDecryption, EntropyUserDecryptMultiple)
- **Public Decryption Examples**: 2 (EntropyPublicDecryption, EntropyPublicDecryptMultiple)
- **Access Control Examples**: 1 (EntropyAccessControl)
- **Input Proof Examples**: 1 (EntropyInputProof)
- **Anti-Patterns Examples**: 2 (EntropyMissingAllowThis, EntropyViewWithEncrypted)
- **Handles Examples**: 1 (EntropyHandleLifecycle)
- **Advanced Examples**: 3 (SimpleLottery, RandomNumberGenerator, EntropyNFT)
- **OpenZeppelin Examples**: 5 (ERC7984Token, ERC7984ToERC20Wrapper, SwapERC7984ToERC20, SwapERC7984ToERC7984, VestingWallet)

## 🤝 Contributing

1. Use automation scripts to create examples
2. Write comprehensive tests
3. Add JSDoc/TSDoc documentation
4. Generate docs: `npm run generate-docs`
5. Test everything works
6. Submit PR

## 📝 License

BSD-3-Clause-Clear

## 🎯 Bounty Submission

This repository is submitted for the **Zama Bounty Track December 2025: Build The FHEVM Example Hub**.

### Deliverables

✅ **base-template/**: Complete Hardhat template with @fhevm/solidity (based on Zama's fhevm-hardhat-template)  
✅ **fhevm-hardhat-template/**: Zama's official template as submodule (reference)  
✅ **Automation scripts**: create-fhevm-example and related tools in TypeScript  
✅ **Example repositories**: Multiple fully working example repos  
✅ **Documentation**: Auto-generated documentation per example  
✅ **Developer guide**: Guide for adding new examples and updating dependencies  
✅ **Automation tools**: Complete set of tools for scaffolding and documentation generation

### Features

- Standalone example repositories (one repo per example concept)
- Automated scaffolding with TypeScript CLI
- Comprehensive test coverage
- Auto-generated GitBook-compatible documentation
- Category-based organization
- Developer-friendly tools and guides
