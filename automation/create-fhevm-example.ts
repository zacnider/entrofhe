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
  'advanced'
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
  const contractPath = path.join(__dirname, '..', 'examples', dest, 'contracts', `${config.name}.sol`);
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

function createREADME(config: ExampleConfig, dest: string) {
  const readmePath = path.join(__dirname, '..', 'examples', dest, 'README.md');
  const readmeContent = `# ${config.name}

${config.description}

## 📋 Overview

This example demonstrates **${config.category}** concepts in FHEVM.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Hardhat
- Sepolia Testnet (for FHEVM)

### Installation

\`\`\`bash
npm install
\`\`\`

### Compile

\`\`\`bash
npm run compile
\`\`\`

### Test

\`\`\`bash
npm test
\`\`\`

## 📖 Documentation

See the contract code for detailed documentation and examples.

## 🔗 Related Examples

- [Category: ${config.category}](../)

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

