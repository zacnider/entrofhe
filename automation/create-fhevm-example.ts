#!/usr/bin/env ts-node

/**
 * @title create-fhevm-example
 * @notice CLI tool to generate a new FHEVM example from base template
 * @dev Creates a new example repository with contract, test, and documentation
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface ExampleConfig {
  name: string;
  category: string;
  description: string;
  chapter?: string;
}

const CATEGORIES = [
  'basic',
  'encryption',
  'user-decryption',
  'public-decryption',
  'access-control',
  'input-proof',
  'anti-patterns',
  'handles',
  'advanced',
  'openzeppelin'
];

function parseArgs(): ExampleConfig {
  const args = process.argv.slice(2);
  const config: Partial<ExampleConfig> = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '');
    const value = args[i + 1];
    if (key && value) {
      (config as any)[key] = value;
    }
  }

  if (!config.name) {
    console.error('Error: --name is required');
    console.log('Usage: ts-node automation/create-fhevm-example.ts --name <name> --category <category> [--description <description>] [--chapter <chapter>]');
    process.exit(1);
  }

  if (!config.category) {
    console.error('Error: --category is required');
    console.log(`Available categories: ${CATEGORIES.join(', ')}`);
    process.exit(1);
  }

  if (!CATEGORIES.includes(config.category)) {
    console.error(`Error: Invalid category. Available: ${CATEGORIES.join(', ')}`);
    process.exit(1);
  }

  return {
    name: config.name,
    category: config.category,
    description: config.description || `FHEVM example: ${config.name}`,
    chapter: config.chapter || config.category,
  };
}

function copyTemplate(dest: string) {
  const templatePath = path.join(__dirname, '..', 'base-template');
  const destPath = path.join(__dirname, '..', 'examples', dest);

  if (fs.existsSync(destPath)) {
    console.error(`Error: Example ${dest} already exists`);
    process.exit(1);
  }

  console.log(`Creating example: ${dest}`);
  console.log(`Copying template from ${templatePath}...`);

  // Create destination directory
  fs.mkdirSync(destPath, { recursive: true });

  // Copy all files from template
  function copyRecursive(src: string, dest: string) {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.git') {
          fs.mkdirSync(destPath, { recursive: true });
          copyRecursive(srcPath, destPath);
        }
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  copyRecursive(templatePath, destPath);
  console.log(`✓ Template copied to ${destPath}`);
}

function createContract(config: ExampleConfig, dest: string) {
  const contractsDir = path.join(__dirname, '..', 'examples', dest, 'contracts');
  // Ensure contracts directory exists
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }
  const contractPath = path.join(contractsDir, `${config.name}.sol`);
  const contractContent = `// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title ${config.name}
 * @notice ${config.description}
 * @dev Example demonstrating FHEVM ${config.category} concepts
 * @chapter ${config.chapter}
 */
contract ${config.name} is ZamaEthereumConfig {
    // TODO: Add your contract implementation here
    
    constructor() {
        // TODO: Initialize your contract
    }
    
    // TODO: Add your functions here
}
`;

  fs.writeFileSync(contractPath, contractContent);
  console.log(`✓ Created contract: ${contractPath}`);
}

function createTest(config: ExampleConfig, dest: string) {
  const testPath = path.join(__dirname, '..', 'examples', dest, 'test', `${config.name}.test.ts`);
  const testContent = `import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ${config.name} } from "../types";

/**
 * @title ${config.name} Tests
 * @notice Comprehensive tests for ${config.name} contract
 * @chapter ${config.chapter}
 */
describe("${config.name}", function () {
  /**
   * @notice Deploy contract fixture
   * @dev Reusable deployment function for tests
   */
  async function deployContractFixture() {
    const [owner, user1, user2] = await hre.ethers.getSigners();
    
    const ContractFactory = await hre.ethers.getContractFactory("${config.name}");
    const contract = await ContractFactory.deploy();
    await contract.waitForDeployment();
    
    // Get contract address
    const contractAddress = await contract.getAddress();
    
    // Assert coprocessor is initialized (this sets up the FHEVM environment)
    await hre.fhevm.assertCoprocessorInitialized(contract, "${config.name}");
    
    return { contract, owner, user1, user2, contractAddress };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      expect(await contract.getAddress()).to.be.properAddress;
    });
  });

  // TODO: Add your test cases here
  describe("Functionality", function () {
    it("Should work correctly", async function () {
      const { contract, contractAddress, owner } = await loadFixture(deployContractFixture);
      // TODO: Add test implementation
      // Example: Create encrypted input using hre.fhevm
      // const input = hre.fhevm.createEncryptedInput(contractAddress, owner.address);
      // input.add64(42);
      // const encryptedInput = await input.encrypt();
    });
  });
});
`;

  fs.writeFileSync(testPath, testContent);
  console.log(`✓ Created test: ${testPath}`);
}

function generateZamaSection(category: string): string {
  const exampleFeatures: Record<string, {
    operations: string[];
    concepts: string[];
    codeExample: string;
  }> = {
    'basic': {
      operations: ['FHE.add()', 'FHE.sub()', 'FHE.mul()', 'FHE.eq()', 'FHE.xor()'],
      concepts: ['Encrypted Arithmetic', 'Encrypted Comparison', 'External Encryption', 'Permission Management', 'Entropy Integration'],
      codeExample: `// Using Zama FHEVM's encrypted integer type
euint64 private encryptedValue;

// Converting external encrypted value to internal (Zama FHEVM)
euint64 internalValue = FHE.fromExternal(encryptedValue, inputProof);
FHE.allowThis(internalValue); // Zama FHEVM permission system

// Performing encrypted operations using Zama FHEVM
euint64 result = FHE.add(encryptedValue, FHE.asEuint64(1));
FHE.allowThis(result);`
    },
    'encryption': {
      operations: ['FHE.fromExternal()', 'FHE.allowThis()', 'FHE.xor()'],
      concepts: ['External Encryption', 'Input Proofs', 'Permission Management', 'Entropy Integration'],
      codeExample: `// Handling user-provided encrypted values (Zama FHEVM)
euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
FHE.allowThis(internalValue);

// Mixing with entropy using Zama FHEVM operations
euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
FHE.allowThis(entropy);
euint64 enhancedValue = FHE.xor(internalValue, entropy);
FHE.allowThis(enhancedValue);`
    },
    'user-decryption': {
      operations: ['FHE.allow()', 'FHE.allowThis()', 'FHE.fromExternal()'],
      concepts: ['User-Specific Decryption', 'Access Control', 'Permission Management', 'Entropy Integration'],
      codeExample: `// Using Zama FHEVM's access control system
euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
FHE.allowThis(internalValue);

// Grant user decryption permission (Zama FHEVM)
FHE.allow(internalValue, userAddress);

// With entropy enhancement
euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
FHE.allowThis(entropy);
euint64 enhancedValue = FHE.xor(internalValue, entropy);
FHE.allowThis(enhancedValue);
FHE.allow(enhancedValue, userAddress);`
    },
    'public-decryption': {
      operations: ['FHE.makePubliclyDecryptable()', 'FHE.allowThis()', 'FHE.fromExternal()'],
      concepts: ['Public Decryption', 'Permission Management', 'Entropy Integration'],
      codeExample: `// Using Zama FHEVM's public decryption feature
euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
FHE.allowThis(internalValue);

// Make publicly decryptable (Zama FHEVM)
euint64 publicValue = FHE.makePubliclyDecryptable(internalValue);

// With entropy enhancement
euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
FHE.allowThis(entropy);
euint64 enhancedValue = FHE.xor(internalValue, entropy);
FHE.allowThis(enhancedValue);
euint64 publicEnhancedValue = FHE.makePubliclyDecryptable(enhancedValue);`
    },
    'access-control': {
      operations: ['FHE.allow()', 'FHE.allowTransient()', 'FHE.allowThis()'],
      concepts: ['Access Control', 'Permission Management', 'Transient Permissions', 'Entropy Integration'],
      codeExample: `// Using Zama FHEVM's access control system
euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
FHE.allowThis(internalValue);

// Grant permanent decryption permission (Zama FHEVM)
FHE.allow(internalValue, userAddress);

// Grant temporary permission for single operation (Zama FHEVM)
FHE.allowTransient(internalValue, userAddress);`
    },
    'input-proof': {
      operations: ['FHE.fromExternal()', 'FHE.allowThis()'],
      concepts: ['Input Proofs', 'External Encryption', 'Permission Management'],
      codeExample: `// Using Zama FHEVM's input proof system
euint64 internalValue = FHE.fromExternal(encryptedInput, inputProof);
FHE.allowThis(internalValue);

// Input proofs validate encrypted values (Zama FHEVM feature)`
    },
    'anti-patterns': {
      operations: ['FHE.allowThis()', 'FHE operations'],
      concepts: ['Common Mistakes', 'Permission Management', 'Best Practices'],
      codeExample: `// Zama FHEVM requires proper permission handling
// ❌ Missing FHE.allowThis() will cause errors
// ✅ Always call FHE.allowThis() before using encrypted values
euint64 result = FHE.add(a, b);
FHE.allowThis(result); // Required by Zama FHEVM`
    },
    'handles': {
      operations: ['FHE operations', 'FHE.allowThis()'],
      concepts: ['Handle Lifecycle', 'Symbolic Execution', 'Permission Management'],
      codeExample: `// Zama FHEVM uses handles for encrypted values
// Handles are managed automatically by Zama FHEVM
euint64 value = FHE.fromExternal(encryptedInput, inputProof);
FHE.allowThis(value); // Zama FHEVM permission system`
    },
    'advanced': {
      operations: ['FHE.add()', 'FHE.sub()', 'FHE.mul()', 'FHE.eq()', 'FHE.xor()', 'FHE.allowThis()'],
      concepts: ['Complex FHE Operations', 'Real-World Applications', 'Entropy Integration'],
      codeExample: `// Advanced Zama FHEVM usage patterns
euint64 result = FHE.add(value1, value2);
FHE.allowThis(result);

// Combining multiple Zama FHEVM operations
euint64 entropy = entropyOracle.getEncryptedEntropy(requestId);
FHE.allowThis(entropy);
euint64 finalResult = FHE.xor(result, entropy);
FHE.allowThis(finalResult);`
    },
    'openzeppelin': {
      operations: ['FHE operations', 'FHE.allowThis()', 'FHE.allow()'],
      concepts: ['OpenZeppelin Integration', 'ERC7984 Confidential Tokens', 'FHE Operations'],
      codeExample: `// Using Zama FHEVM with OpenZeppelin confidential contracts
euint64 encryptedAmount = FHE.fromExternal(encryptedInput, inputProof);
FHE.allowThis(encryptedAmount);

// Zama FHEVM enables encrypted token operations
// All amounts remain encrypted during transfers`
    }
  };

  const features = exampleFeatures[category] || exampleFeatures['basic'];
  
  return `## 🔐 Zama FHEVM Usage

This example demonstrates the following **Zama FHEVM** features:

### Zama FHEVM Features Used

- **ZamaEthereumConfig**: Inherits from Zama's network configuration
  \`\`\`solidity
  contract MyContract is ZamaEthereumConfig {
      // Inherits network-specific FHEVM configuration
  }
  \`\`\`

- **FHE Operations**: Uses Zama's FHE library for encrypted operations
${features.operations.map(op => `  - \`${op}\` - Zama FHEVM operation`).join('\n')}

- **Encrypted Types**: Uses Zama's encrypted integer types
  - \`euint64\` - 64-bit encrypted unsigned integer
  - \`externalEuint64\` - External encrypted value from user

- **Access Control**: Uses Zama's permission system
  - \`FHE.allowThis()\` - Allow contract to use encrypted values
  - \`FHE.allow()\` - Allow specific user to decrypt
  - \`FHE.allowTransient()\` - Temporary permission for single operation
  - \`FHE.fromExternal()\` - Convert external encrypted values to internal

### Zama FHEVM Imports

\`\`\`solidity
// Zama FHEVM Core Library - FHE operations and encrypted types
import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";

// Zama Network Configuration - Provides network-specific settings
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
\`\`\`

### Zama FHEVM Code Example

\`\`\`solidity
${features.codeExample}
\`\`\`

### Zama FHEVM Concepts Demonstrated

${features.concepts.map((concept, i) => `${i + 1}. **${concept}**: Using Zama FHEVM to ${concept.toLowerCase()}`).join('\n')}

### Learn More About Zama FHEVM

- 📚 [Zama FHEVM Documentation](https://docs.zama.org/protocol)
- 🎓 [Zama Developer Hub](https://www.zama.org/developer-hub)
- 💻 [Zama FHEVM GitHub](https://github.com/zama-ai/fhevm)

`;
}

function createREADME(config: ExampleConfig, dest: string) {
  const readmePath = path.join(__dirname, '..', 'examples', dest, 'README.md');
  const zamaSection = generateZamaSection(config.category);
  const readmeContent = `# ${config.name}

${config.description}

## 📋 Overview

This example demonstrates **${config.category}** concepts in FHEVM.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Hardhat
- Sepolia Testnet (for FHEVM)
- Zama FHEVM Relayer

### Installation

\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

### Setup Environment

\`\`\`bash
npm run setup
\`\`\`

Then edit \`.env\` file with your credentials:
- \`SEPOLIA_RPC_URL\` - Your Sepolia RPC endpoint
- \`PRIVATE_KEY\` - Your wallet private key (for deployment)
- \`ETHERSCAN_API_KEY\` - Your Etherscan API key (for verification)

### Compile

\`\`\`bash
npm run compile
\`\`\`

### Test

\`\`\`bash
npm test
\`\`\`

### Deploy to Sepolia

\`\`\`bash
npm run deploy:sepolia
\`\`\`

### Verify Contract

\`\`\`bash
npm run verify <CONTRACT_ADDRESS>
\`\`\`

**Alternative:** Use the [Examples page](https://entrofhe.vercel.app/examples) for browser-based deployment and verification.

---

${zamaSection}

## 📖 Documentation

See the contract code for detailed documentation and examples.

## 🔗 Related Examples

- [Category: ${config.category}](../)
- [All examples](https://github.com/zacnider/entrofhe/tree/main/examples)

## 📝 License

BSD-3-Clause-Clear
`;

  fs.writeFileSync(readmePath, readmeContent);
  console.log(`✓ Created README: ${readmePath}`);
}

function updatePackageJson(config: ExampleConfig, dest: string) {
  const packagePath = path.join(__dirname, '..', 'examples', dest, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  
  packageJson.name = `fhevm-example-${config.name.toLowerCase()}`;
  packageJson.description = config.description;
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log(`✓ Updated package.json`);
}

function main() {
  const config = parseArgs();
  const dest = `${config.category}-${config.name.toLowerCase()}`;

  console.log(`\n🎯 Creating FHEVM Example: ${config.name}`);
  console.log(`📁 Category: ${config.category}`);
  console.log(`📝 Description: ${config.description}\n`);

  // Create example directory
  copyTemplate(dest);
  
  // Create contract
  createContract(config, dest);
  
  // Create test
  createTest(config, dest);
  
  // Create README
  createREADME(config, dest);
  
  // Update package.json
  updatePackageJson(config, dest);

  console.log(`\n✅ Example created successfully!`);
  console.log(`\n📂 Location: examples/${dest}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. cd examples/${dest}`);
  console.log(`   2. npm install`);
  console.log(`   3. Implement your contract in contracts/${config.name}.sol`);
  console.log(`   4. Write tests in test/${config.name}.test.ts`);
  console.log(`   5. npm test\n`);
}

if (require.main === module) {
  main();
}

