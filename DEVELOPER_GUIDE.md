# Developer Guide

This guide explains how to add new examples, update dependencies, and maintain the FHEVM example hub.

## 📋 Table of Contents

- [Adding a New Example](#adding-a-new-example)
- [Updating Dependencies](#updating-dependencies)
- [Testing Examples](#testing-examples)
- [Documentation Standards](#documentation-standards)
- [Category Guidelines](#category-guidelines)

## 🚀 Adding a New Example

### Using the Automation Script

The easiest way to create a new example is using the automation script:

```bash
npm run create-example -- --name my-example --category basic --description "My example description" --chapter "access-control"
```

**Parameters:**
- `--name`: Example name (PascalCase, e.g., `SimpleCounter`)
- `--category`: Category (see [Categories](#categories))
- `--description`: Short description
- `--chapter`: Chapter tag for documentation (optional)

### Manual Creation

1. Copy `base-template/` to `examples/<category>-<name>/`
2. Create your contract in `contracts/<Name>.sol`
3. Write tests in `test/<Name>.test.ts`
4. Update `README.md` with example-specific documentation
5. Add JSDoc comments with `@chapter` tags

### Example Structure

```
examples/
└── basic-simple-counter/
    ├── contracts/
    │   └── SimpleCounter.sol
    ├── test/
    │   └── SimpleCounter.test.ts
    ├── hardhat.config.ts
    ├── package.json
    └── README.md
```

## 📦 Updating Dependencies

### Updating Base Template

When FHEVM or Hardhat versions change:

1. Update `base-template/package.json` with new versions
2. Test the template:
   ```bash
   cd base-template
   npm install
   npm test
   ```
3. Update all examples (see [Bulk Updates](#bulk-updates))

### Bulk Updates

To update all examples at once:

```bash
# Script to update all examples (create this if needed)
for dir in examples/*/; do
  cd "$dir"
  npm install
  cd ../..
done
```

### Version Compatibility

- **FHEVM Solidity**: `^0.9.1`
- **Hardhat**: `^2.26.0`
- **Ethers**: `^6.15.0`
- **Solidity**: `0.8.27`

## 🧪 Testing Examples

### Test Structure

Each example should have comprehensive tests using `hre.fhevm`:

```typescript
import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("MyExample", function () {
  async function deployFixture() {
    const [owner, user1] = await hre.ethers.getSigners();
    const ContractFactory = await hre.ethers.getContractFactory("MyExample");
    const contract = await ContractFactory.deploy();
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    
    // Initialize FHEVM coprocessor
    await hre.fhevm.assertCoprocessorInitialized(contract, "MyExample");
    
    return { contract, owner, user1, contractAddress };
  }

  describe("Deployment", function () {
    it("Should deploy", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.getAddress()).to.be.properAddress;
    });
  });

  describe("FHE Operations", function () {
    it("Should work with encrypted values", async function () {
      const { contract, contractAddress, owner } = await loadFixture(deployFixture);
      
      // Create encrypted input
      const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      input.add64(42);
      const encryptedInput = await input.encrypt();
      
      // Use encrypted value
      await contract.initialize(
        encryptedInput.handles[0],
        encryptedInput.inputProof
      );
    });
  });
});
```

### Running Tests

```bash
# In example directory
npm test

# With coverage
npm run coverage
```

## 📝 Documentation Standards

### Contract Documentation

Use NatSpec format:

```solidity
/**
 * @title SimpleCounter
 * @notice A simple counter using FHE encryption
 * @dev Demonstrates basic FHE operations
 * @chapter basic
 */
contract SimpleCounter {
    /**
     * @notice Increment the counter
     * @dev Uses FHE.add to increment encrypted value
     */
    function increment() external {
        // Implementation
    }
}
```

### Test Documentation

Use JSDoc in tests:

```typescript
/**
 * @title SimpleCounter Tests
 * @notice Comprehensive tests for SimpleCounter
 * @chapter basic
 */
describe("SimpleCounter", function () {
    // Tests
});
```

### README Format

Each example should have a README with:

- Overview
- Quick Start
- Usage examples
- Related examples
- License

## 📂 Category Guidelines

### Categories

1. **basic** - Fundamental FHE operations
   - Counter, arithmetic, equality
   - Simple patterns

2. **encryption** - Encrypting values
   - Single value encryption
   - Multiple value encryption

3. **user-decryption** - User-specific decryption
   - FHE.allow patterns
   - User permissions

4. **public-decryption** - Public decryption
   - makePubliclyDecryptable
   - Public access patterns

5. **access-control** - Access control
   - FHE.allow, FHE.allowTransient
   - Permission management

6. **input-proof** - Input proofs
   - What are input proofs
   - How to use them correctly

7. **anti-patterns** - Common mistakes
   - View functions with encrypted values
   - Missing FHE.allowThis()
   - Other pitfalls

8. **handles** - Understanding handles
   - Handle generation
   - Symbolic execution
   - Handle lifecycle

9. **advanced** - Advanced patterns
   - Complex use cases
   - Real-world applications

### Choosing a Category

- Start with **basic** for simple examples
- Use **encryption**/**decryption** for specific patterns
- Use **anti-patterns** for educational mistakes
- Use **advanced** for complex scenarios

## 🔧 Maintenance

### Generating Documentation

After adding examples:

```bash
npm run generate-docs
```

This creates documentation in `docs/examples/`.

### Code Quality

- Run linter: `npm run lint`
- Format code: `npm run prettier:write`
- Check formatting: `npm run prettier:check`

### Testing All Examples

```bash
# Test all examples
for dir in examples/*/; do
  echo "Testing $dir"
  cd "$dir"
  npm test || exit 1
  cd ../..
done
```

## 📚 Resources

- [Zama FHEVM Docs](https://docs.zama.org/protocol)
- [Hardhat Docs](https://hardhat.org/docs)
- [Ethers.js Docs](https://docs.ethers.org/)

## 🤝 Contributing

1. Create example using automation script
2. Write comprehensive tests
3. Add documentation
4. Generate docs: `npm run generate-docs`
5. Test everything works
6. Submit PR

## 📝 License

BSD-3-Clause-Clear

