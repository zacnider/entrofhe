# FHEVM Example Hub with EntropyOracle Integration

A comprehensive collection of standalone, Hardhat-based FHEVM examples demonstrating various concepts and patterns for building privacy-preserving smart contracts using Fully Homomorphic Encryption. **All examples are integrated with EntropyOracle** - a production-ready FHE-based entropy and randomness infrastructure.

## 🎯 Overview

This repository provides a complete set of FHEVM examples organized by category, with automated scaffolding tools, comprehensive tests, and auto-generated documentation. Each example is a standalone Hardhat project demonstrating one clear FHEVM concept **with EntropyOracle integration** for encrypted randomness.

### 🔑 Key Feature: EntropyOracle Integration

**All 14 tutorial examples** demonstrate how to integrate and use **EntropyOracle** - an on-chain entropy oracle that provides cryptographically secure randomness using FHE technology. Unlike traditional VRF solutions, EntropyOracle keeps seeds encrypted at all times, ensuring maximum privacy and security.

**EntropyOracle Features:**
- 🔒 **FHE-Based Privacy**: Seeds and entropy remain encrypted on-chain
- 💰 **Low Cost**: Only 0.00001 ETH per entropy request
- 🛠️ **Developer-Friendly**: Simple interface for easy integration
- ⛓️ **On-Chain**: No external dependencies or oracles
- 📍 **Deployed on Sepolia**: `0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`

## ✨ Features

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

### Installation

```bash
npm install
```

### Create a New Example

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
- **EntropyEncryption**: Encrypt and store values using EntropyOracle

### User Decryption (EntropyOracle Integration)
- **EntropyUserDecryption**: User decrypt using EntropyOracle and FHE.allow

### Public Decryption (EntropyOracle Integration)
- **EntropyPublicDecryption**: Public decrypt using EntropyOracle and makePubliclyDecryptable

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

## 🔗 Reference Repositories

- [Zama FHEVM Documentation](https://docs.zama.org/protocol)
- [Zama Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template)
- [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)

## 📊 Statistics

- **Total Examples**: 19 examples (all with EntropyOracle integration)
- **Categories**: 10 categories
- **EntropyOracle Integration**: ✅ All examples
- **Test Coverage**: Comprehensive tests for each example
- **Documentation**: Auto-generated from code
- **Basic Examples**: 3 (EntropyCounter, EntropyArithmetic, EntropyEqualityComparison)
- **Encryption Examples**: 1 (EntropyEncryption)
- **User Decryption Examples**: 1 (EntropyUserDecryption)
- **Public Decryption Examples**: 1 (EntropyPublicDecryption)
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

✅ **base-template/**: Complete Hardhat template with @fhevm/solidity  
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
