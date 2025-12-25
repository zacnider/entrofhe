# EntroFHE FHEVM Example Hub - Learn How to Build Privacy-Preserving Smart Contracts

A comprehensive educational collection of **22 standalone, Hardhat-based FHEVM examples** that teach you how to build privacy-preserving smart contracts using Fully Homomorphic Encryption. Each example demonstrates **one clear FHEVM concept** with step-by-step code, tests, and documentation.

## 🎓 What You'll Learn

This repository teaches you **how to use Zama FHEVM** through practical, hands-on examples. Each example focuses on answering **"How do I do this?"** rather than just showing what's possible.

**Learning Path:**
- ✅ **Basic Operations**: Learn FHE arithmetic, comparisons, and counters
- ✅ **Encryption Patterns**: Understand how to encrypt and store values on-chain
- ✅ **Decryption Patterns**: Learn user decryption and public decryption
- ✅ **Access Control**: Master FHE permissions (FHE.allow, FHE.allowTransient)
- ✅ **Input Proofs**: Learn how to handle user-provided encrypted inputs
- ✅ **Common Pitfalls**: See what NOT to do and why
- ✅ **Handle Management**: Understand symbolic execution and handle lifecycle
- ✅ **Real-World Patterns**: Advanced examples like lotteries, NFTs, and token swaps

## 🎯 Overview

This educational hub provides **22 standalone example repositories**, each teaching a specific FHEVM concept. Every example is:

- ✅ **One repo per example**: Each example is a **separate GitHub repository** (managed as Git submodules)
- ✅ **Standalone Hardhat project**: Complete, independent project you can clone and learn from
- ✅ **Real-world context**: Examples use a practical use case (encrypted randomness) to teach FHEVM concepts
- ✅ **Step-by-step**: Clear code, comprehensive tests, and detailed documentation
- ✅ **Automated scaffolding**: CLI tool to generate examples and learn the structure

### 📚 Teaching Approach: Learning Through Examples

**All 22 examples** use a practical scenario (encrypted randomness/entropy) to teach FHEVM concepts. This approach helps you:

1. **See FHEVM in context**: Learn how FHE operations work in real applications
2. **Understand patterns**: Each example demonstrates a specific FHEVM pattern
3. **Learn best practices**: See correct usage and common mistakes side-by-side
4. **Build confidence**: Start with simple examples and progress to advanced patterns

**Example Structure:**
- Each example demonstrates **one FHEVM concept** (e.g., "How to use FHE.allow for user decryption")
- All examples use the same practical context (encrypted randomness) so you can focus on learning FHEVM, not the domain
- Tests show both **correct usage** and **common pitfalls**
- Documentation explains **why** each pattern works, not just **what** it does

## ✨ Learning Tools

- **🛠️ CLI Tool**: Interactive command-line tool (`entrofhe-cli`) to generate example projects and study their structure
- **Automated Scaffolding**: TypeScript scripts showing how to structure FHEVM projects
- **Comprehensive Tests**: Test suites teaching correct usage patterns and common mistakes
- **Documentation Generator**: Auto-generates educational documentation from code annotations
- **Base Template**: Learn from a well-structured Hardhat template based on Zama's official template
- **Category Organization**: Examples organized by learning path (basic → advanced)
- **Developer Guide**: Learn how to create your own FHEVM examples

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

**After global installation, use the `entrofhe` command:**

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

**Note:** If you haven't installed globally, use `npx entrofhe-cli` instead of `entrofhe`.

The CLI generates a complete learning project:
- ✅ Standalone Hardhat project structure
- ✅ Example contract demonstrating FHEVM patterns
- ✅ Comprehensive tests showing how to use it
- ✅ Documentation explaining the concepts

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

**For Individual Example (Recommended):**
```bash
# Clone a specific example repository
git clone https://github.com/zacnider/fhevm-example-basic-simplecounter.git
cd fhevm-example-basic-simplecounter
npm install --legacy-peer-deps
npm test
```

**For All Examples (Using Submodules):**
```bash
# First, initialize submodules
git submodule update --init --recursive

# Then test all examples
for dir in examples/*/; do
  cd "$dir" && npm install --legacy-peer-deps && npm test && cd ../..
done
```

## 📂 Project Structure

**Important:** This repository follows the bounty requirement of **"one repo per example"**. Each example is a **standalone GitHub repository** managed as a Git submodule. This means:

- ✅ Each example is a **separate, independent repository** on GitHub
- ✅ Each example can be cloned and used independently
- ✅ Each example is a **standalone Hardhat project** with its own `package.json`, `hardhat.config.ts`, etc.
- ✅ Examples are organized in this hub repository as **Git submodules** for easy access and maintenance

```
.
├── cli/                    # EntroFHE CLI tool (npm package)
│   ├── src/               # CLI source code
│   └── package.json       # CLI package configuration
├── base-template/          # Base Hardhat template (based on Zama's fhevm-hardhat-template)
├── examples/               # Git submodules - Each is a standalone GitHub repository
│   ├── basic-*/           # Basic FHE operations (separate repos)
│   ├── encryption-*/      # Encryption examples (separate repos)
│   ├── user-decryption-*/ # User decryption examples (separate repos)
│   └── ...                # All 22 examples are separate GitHub repositories
├── automation/            # Automation scripts (TypeScript)
│   ├── create-fhevm-example.ts
│   ├── create-fhevm-category.ts
│   └── generate-docs.ts
├── docs/                  # Auto-generated GitBook-compatible documentation
└── DEVELOPER_GUIDE.md     # Guide for adding examples and updating dependencies
```

### Using Examples

**Option 1: Clone Individual Example (Recommended)**
```bash
# Each example is a standalone repository
git clone https://github.com/zacnider/fhevm-example-basic-simplecounter.git
cd fhevm-example-basic-simplecounter
npm install --legacy-peer-deps
npm test
```

**Option 2: Use This Hub Repository with Submodules**
```bash
# Clone the hub repository
git clone https://github.com/zacnider/entrofhe.git
cd entrofhe

# Initialize and update submodules (downloads all 22 example repositories)
git submodule update --init --recursive

# Navigate to any example
cd examples/basic-simplecounter
npm install --legacy-peer-deps
npm test
```

## 📚 Learning Path: Example Categories

Each category teaches specific FHEVM concepts. Start with **Basic** and progress to **Advanced** as you build your understanding.

### 🟢 Basic - Learn Core FHE Operations

**What you'll learn:** Fundamental FHE operations and how to use them

- **EntropyCounter**: Learn how to create and increment encrypted counters using `FHE.add`
- **EntropyArithmetic**: Learn FHE arithmetic operations (`FHE.add`, `FHE.sub`, `FHE.mul`, `FHE.div`)
- **EntropyEqualityComparison**: Learn how to compare encrypted values using `FHE.eq`

### 🔐 Encryption - Learn How to Encrypt and Store Values

**What you'll learn:** How to encrypt values and store them on-chain

- **EntropyEncryption**: Learn how to encrypt a single value and store it in contract state
- **EntropyEncryptMultiple**: Learn how to encrypt and manage multiple encrypted values

### 👤 User Decryption - Learn Access Control Patterns

**What you'll learn:** How to allow specific users to decrypt values using `FHE.allow`

- **EntropyUserDecryption**: Learn how to use `FHE.allow()` to let a specific user decrypt a value
- **EntropyUserDecryptMultiple**: Learn how to manage permissions for multiple encrypted values

### 🌐 Public Decryption - Learn Public Decryption Patterns

**What you'll learn:** How to make encrypted values publicly decryptable

- **EntropyPublicDecryption**: Learn how to use `FHE.makePubliclyDecryptable()` for public decryption
- **EntropyPublicDecryptMultiple**: Learn how to manage multiple publicly decryptable values

### 🔒 Access Control - Master FHE Permissions

**What you'll learn:** Advanced permission patterns with `FHE.allow` and `FHE.allowTransient`

- **EntropyAccessControl**: Learn the difference between `FHE.allow()`, `FHE.allowTransient()`, and `FHE.allowThis()`

### 📝 Input Proof - Learn User-Provided Encrypted Inputs

**What you'll learn:** How to handle encrypted values provided by users

- **EntropyInputProof**: Learn how to use `externalEuint64` and input proofs to accept encrypted user inputs

### ⚠️ Anti-Patterns - Learn What NOT to Do

**What you'll learn:** Common mistakes and how to avoid them

- **EntropyMissingAllowThis**: Learn why `FHE.allowThis()` is required and what happens when it's missing
- **EntropyViewWithEncrypted**: Learn why view functions can't return encrypted values and how to work around it

### 🔄 Handles - Understand Symbolic Execution

**What you'll learn:** How handles work, symbolic execution, and handle lifecycle

- **EntropyHandleLifecycle**: Learn how handles are generated, used, and managed in FHEVM

### 🚀 Advanced - Real-World Patterns

**What you'll learn:** How to build complete applications using FHEVM

- **SimpleLottery**: Learn how to build a lottery system with encrypted randomness
- **RandomNumberGenerator**: Learn how to generate and use encrypted random numbers
- **EntropyNFT**: Learn how to build an NFT with encrypted trait selection

### 🏛️ OpenZeppelin Confidential Contracts - Learn Standard Patterns

**What you'll learn:** How to use OpenZeppelin's confidential contracts library

- **EntropyERC7984Token**: Learn how to create confidential tokens using ERC7984
- **EntropyERC7984ToERC20Wrapper**: Learn how to wrap confidential tokens into ERC20
- **EntropySwapERC7984ToERC20**: Learn how to swap confidential tokens for ERC20 tokens
- **EntropySwapERC7984ToERC7984**: Learn how to swap between two confidential tokens
- **EntropyVestingWallet**: Learn how to build a vesting wallet with encrypted amounts

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

## 🎓 How Examples Use Encrypted Randomness

**Why encrypted randomness?** All examples use a practical scenario (encrypted randomness/entropy) to teach FHEVM concepts. This gives you a **real-world context** while learning, rather than abstract examples.

**What you'll learn:**
- How to interact with external contracts that return encrypted values
- How to use encrypted values from external sources in your FHE operations
- How to structure contracts that work with encrypted data

**Example Pattern:**
```solidity
// Learn how to get encrypted values from external contracts
import "./interfaces/IEntropyOracle.sol";

contract MyContract {
    // Learn how to reference external contracts
    IEntropyOracle public constant ENTROPY_ORACLE = 
        IEntropyOracle(0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361);
    
    // Learn how to request and use encrypted values
    function useEntropy(bytes32 tag) external payable {
        uint256 requestId = ENTROPY_ORACLE.requestEntropy{value: 0.00001 ether}(tag);
        euint64 entropy = ENTROPY_ORACLE.getEncryptedEntropy(requestId);
        // Learn how to use encrypted values in FHE operations
        // This is where you'll practice FHE.add, FHE.eq, FHE.allow, etc.
    }
}
```

**Note:** The examples use a deployed contract on Sepolia (`0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`) to provide encrypted randomness. This is just a **teaching tool** - the focus is on learning FHEVM patterns, not the randomness contract itself.

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

## 📊 Learning Resources

- **Total Examples**: 22 standalone example repositories
- **Learning Categories**: 10 categories covering all FHEVM concepts
- **Test Coverage**: Comprehensive tests for each example (correct usage + common pitfalls)
- **Documentation**: Auto-generated educational docs from code annotations
- **Basic Examples**: 3 examples teaching core FHE operations
- **Encryption Examples**: 2 examples teaching encryption patterns
- **User Decryption Examples**: 2 examples teaching access control with FHE.allow
- **Public Decryption Examples**: 2 examples teaching public decryption patterns
- **Access Control Examples**: 1 example teaching FHE permissions
- **Input Proof Examples**: 1 example teaching user-provided encrypted inputs
- **Anti-Patterns Examples**: 2 examples teaching what NOT to do
- **Handles Examples**: 1 example teaching handle lifecycle and symbolic execution
- **Advanced Examples**: 3 examples teaching real-world application patterns
- **OpenZeppelin Examples**: 5 examples teaching standard confidential contract patterns

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

### Educational Approach

This hub focuses on **teaching FHEVM** through practical examples. Each example answers **"How do I do this?"** rather than just showing what's possible.

**Teaching Philosophy:**
- ✅ **Didactic examples**: Each example teaches one clear concept
- ✅ **Progressive learning**: Start simple, build to advanced patterns
- ✅ **Real-world context**: Examples use practical scenarios (encrypted randomness)
- ✅ **Learn by doing**: Complete, runnable examples with tests
- ✅ **Learn from mistakes**: Anti-pattern examples show what NOT to do

### Deliverables

✅ **base-template/**: Complete Hardhat template with @fhevm/solidity (based on Zama's fhevm-hardhat-template)  
✅ **fhevm-hardhat-template/**: Zama's official template as submodule (reference)  
✅ **Automation scripts**: create-fhevm-example and related tools in TypeScript  
✅ **Example repositories**: 22 fully working standalone example repos (one repo per example, managed as Git submodules)  
✅ **Documentation**: Auto-generated GitBook-compatible documentation per example  
✅ **Developer guide**: Complete guide for adding new examples and updating dependencies  
✅ **Automation tools**: Complete set of tools for scaffolding and documentation generation  
✅ **CLI tool**: Interactive CLI tool (entrofhe-cli) for generating examples

### Bounty Requirements Compliance

✅ **One repo per example**: Each of the 22 examples is a **separate GitHub repository** managed as Git submodules  
✅ **Standalone Hardhat projects**: Each example is a complete, independent Hardhat project  
✅ **Base template**: Uses Zama's fhevm-hardhat-template as the base  
✅ **Automated scaffolding**: TypeScript CLI tool and automation scripts for generating examples  
✅ **Comprehensive tests**: Test suites showing correct usage and common pitfalls  
✅ **Auto-generated documentation**: GitBook-compatible docs generated from JSDoc/TSDoc annotations  
✅ **Category organization**: Examples organized by learning path (basic → advanced)  
✅ **All required example types**: Basic, encryption, decryption, access control, input proof, anti-patterns, handles, OpenZeppelin, advanced

### Learning Features

- **22 Standalone Example Repositories**: Each example is a separate GitHub repository (one repo per example)
- **Progressive Learning Path**: Examples organized from basic to advanced
- **Git Submodules**: Examples managed as submodules for easy hub access
- **Automated Scaffolding**: TypeScript CLI tool (`entrofhe-cli`) and automation scripts
- **Comprehensive Test Coverage**: Tests demonstrating correct usage, pitfalls, and edge cases
- **Auto-generated Documentation**: GitBook-compatible docs from code annotations
- **Category-based Organization**: 10 categories covering all FHEVM concepts
- **Developer-friendly Tools**: CLI, automation scripts, and comprehensive guides
