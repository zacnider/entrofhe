# FHEVM Example Hub

A comprehensive collection of standalone, Hardhat-based FHEVM examples demonstrating various concepts and patterns for building privacy-preserving smart contracts using Fully Homomorphic Encryption.

## 🎯 Overview

This repository provides a complete set of FHEVM examples organized by category, with automated scaffolding tools, comprehensive tests, and auto-generated documentation. Each example is a standalone Hardhat project demonstrating one clear FHEVM concept.

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

### Basic
- **SimpleCounter**: Basic counter using FHE encryption
- **Arithmetic**: FHE arithmetic operations (add, sub, mul)
- **EqualityComparison**: FHE equality comparison (FHE.eq)

### Encryption
- **EncryptSingle**: Encrypt a single value

### User Decryption
- **UserDecryptSingle**: User decrypt single value using FHE.allow

### Public Decryption
- **PublicDecryptSingle**: Public decrypt single value using makePubliclyDecryptable

### Access Control
- **AccessControl**: FHE.allow, FHE.allowTransient patterns

### Input Proof
- **InputProofExplanation**: What are input proofs and why they're needed

### Anti-Patterns
- **ViewWithEncrypted**: View functions with encrypted values (not allowed)
- **MissingAllowThis**: Missing FHE.allowThis() permissions

### Handles
- **HandleLifecycle**: Understanding handles and symbolic execution

### Advanced
- **SimpleLottery**: Simple lottery using entropy oracle
- **RandomNumberGenerator**: Random number generator using entropy
- **EntropyNFT**: ERC721 NFT with trait selection using entropy

## 🛠️ Automation Scripts

### Create Example

```bash
npm run create-example -- --name <name> --category <category> [--description <description>] [--chapter <chapter>]
```

**Categories**: `basic`, `encryption`, `user-decryption`, `public-decryption`, `access-control`, `input-proof`, `anti-patterns`, `handles`, `advanced`

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

## 🔗 Reference Repositories

- [Zama FHEVM Documentation](https://docs.zama.org/protocol)
- [Zama Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template)
- [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)

## 📊 Statistics

- **Total Examples**: 13 examples
- **Categories**: 8 categories
- **Test Coverage**: Comprehensive tests for each example
- **Documentation**: Auto-generated from code
- **Basic Examples**: 3
- **Encryption Examples**: 1
- **User Decryption Examples**: 1
- **Public Decryption Examples**: 1
- **Access Control Examples**: 1
- **Input Proof Examples**: 1
- **Anti-Patterns Examples**: 2
- **Handles Examples**: 1
- **Advanced Examples**: 3

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
