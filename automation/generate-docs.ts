#!/usr/bin/env ts-node

/**
 * @title generate-docs
 * @notice Documentation generator for FHEVM examples
 * @dev Parses JSDoc/TSDoc comments and generates GitBook-compatible markdown
 */

import * as fs from 'fs';
import * as path from 'path';

interface ExampleInfo {
  name: string;
  category: string;
  chapter?: string;
  description: string;
  contractPath: string;
  testPath?: string;
}

function findExamples(): ExampleInfo[] {
  const examplesDir = path.join(__dirname, '..', 'examples');
  const examples: ExampleInfo[] = [];

  if (!fs.existsSync(examplesDir)) {
    return examples;
  }

  const entries = fs.readdirSync(examplesDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const exampleDir = path.join(examplesDir, entry.name);
      const contractsDir = path.join(exampleDir, 'contracts');
      
      // Skip if contracts directory doesn't exist
      if (!fs.existsSync(contractsDir)) {
        continue;
      }
      
      const contractFiles = fs.readdirSync(contractsDir)
        .filter(f => f.endsWith('.sol') && !f.startsWith('I') && !f.includes('Oracle') && !f.includes('ChaosEngine') && !f.includes('Library')); // Ignore interface files, oracle, engine, and library files
      
      // For advanced-simplelottery, prefer SimpleLottery.sol
      if (entry.name === 'advanced-simplelottery') {
        const simpleLotteryFile = contractFiles.find(f => f.includes('SimpleLottery') || f.includes('Lottery'));
        if (simpleLotteryFile) {
          const contractName = simpleLotteryFile.replace('.sol', '');
          const contractPath = path.join(exampleDir, 'contracts', simpleLotteryFile);
          const contractContent = fs.readFileSync(contractPath, 'utf-8');
          
          const chapterMatch = contractContent.match(/@chapter\s+(\w+)/);
          const chapter = chapterMatch ? chapterMatch[1] : undefined;
          
          const noticeMatch = contractContent.match(/@notice\s+(.+?)(?:\n|$)/);
          const description = noticeMatch ? noticeMatch[1].trim() : contractName;
          
          const category = entry.name.split('-')[0] || 'basic';

          examples.push({
            name: contractName,
            category,
            chapter,
            description,
            contractPath,
            testPath: fs.existsSync(path.join(exampleDir, 'test', `${contractName}.test.ts`))
              ? path.join(exampleDir, 'test', `${contractName}.test.ts`)
              : undefined,
          });
          continue;
        }
      }
      
      if (contractFiles.length > 0) {
        const contractName = contractFiles[0].replace('.sol', '');
        const contractPath = path.join(exampleDir, 'contracts', contractFiles[0]);
        const contractContent = fs.readFileSync(contractPath, 'utf-8');
        
        // Extract chapter from @chapter tag
        const chapterMatch = contractContent.match(/@chapter\s+(\w+)/);
        const chapter = chapterMatch ? chapterMatch[1] : undefined;
        
        // Extract description from @notice
        const noticeMatch = contractContent.match(/@notice\s+(.+?)(?:\n|$)/);
        const description = noticeMatch ? noticeMatch[1].trim() : contractName;
        
        // Determine category from directory name
        const category = entry.name.split('-')[0] || 'basic';

        examples.push({
          name: contractName,
          category,
          chapter,
          description,
          contractPath,
          testPath: fs.existsSync(path.join(exampleDir, 'test', `${contractName}.test.ts`))
            ? path.join(exampleDir, 'test', `${contractName}.test.ts`)
            : undefined,
        });
      }
    }
  }

  return examples;
}

function extractContractDocs(contractPath: string): string {
  const content = fs.readFileSync(contractPath, 'utf-8');
  const lines = content.split('\n');
  let docs = '';
  let inDocBlock = false;
  let docLines: string[] = [];

  for (const line of lines) {
    if (line.trim().startsWith('/**')) {
      inDocBlock = true;
      docLines = [];
    } else if (inDocBlock && line.trim().startsWith('*/')) {
      inDocBlock = false;
      docs += docLines.join('\n') + '\n\n';
      docLines = [];
    } else if (inDocBlock) {
      const cleaned = line.replace(/^\s*\*\s?/, '').trim();
      if (cleaned) {
        docLines.push(cleaned);
      }
    }
  }

  return docs;
}

function generateExampleDoc(example: ExampleInfo): string {
  const contractDocs = extractContractDocs(example.contractPath);
  const contractCode = fs.readFileSync(example.contractPath, 'utf-8');

  return `# ${example.name}

${example.description}

## Overview

${contractDocs || 'No additional documentation available.'}

## Contract Code

\`\`\`solidity
${contractCode}
\`\`\`

${example.testPath ? `## Tests

See [test file](${path.relative(__dirname, example.testPath)}) for comprehensive test coverage.

\`\`\`bash
npm test
\`\`\`
` : ''}

## Category

**${example.category}**

${example.chapter ? `## Chapter\n\n\`${example.chapter}\`` : ''}

## Related Examples

- [All ${example.category} examples](../examples/${example.category}/)
`;
}

function generateCategoryIndex(category: string, examples: ExampleInfo[]): string {
  const categoryExamples = examples.filter(e => e.category === category);
  
  if (categoryExamples.length === 0) {
    return '';
  }

  return `# ${category.charAt(0).toUpperCase() + category.slice(1)} Examples

## Examples

${categoryExamples.map(e => `- [${e.name}](./${e.name}.md) - ${e.description}`).join('\n')}

## Overview

This category contains ${categoryExamples.length} example(s) demonstrating ${category} concepts in FHEVM.

`;
}

function generateMainIndex(examples: ExampleInfo[]): string {
  const categories = [...new Set(examples.map(e => e.category))];

  return `# FHEVM Examples

Comprehensive collection of FHEVM examples demonstrating various concepts and patterns.

## Categories

${categories.map(cat => {
  const count = examples.filter(e => e.category === cat).length;
  return `- [${cat.charAt(0).toUpperCase() + cat.slice(1)}](./docs/${cat}/) (${count} examples)`;
}).join('\n')}

## Quick Start

1. Browse examples by category
2. Read the documentation for each example
3. Run the tests to see them in action
4. Use as templates for your own projects

## Total Examples

${examples.length} examples across ${categories.length} categories.

`;
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

function generateExampleREADME(example: ExampleInfo, exampleDir: string): string {
  const contractDocs = extractContractDocs(example.contractPath);
  const contractCode = fs.readFileSync(example.contractPath, 'utf-8');
  const zamaSection = generateZamaSection(example.category);
  
  // Extract example directory name for GitHub repo link
  const exampleDirName = path.basename(exampleDir);
  const repoName = `fhevm-example-${exampleDirName}`;
  
  return `# ${example.name}

${example.description}

## 🚀 Quick Start

1. **Clone this repository:**
   \`\`\`bash
   git clone https://github.com/zacnider/${repoName}.git
   cd ${repoName}
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install --legacy-peer-deps
   \`\`\`

3. **Setup environment:**
   \`\`\`bash
   npm run setup
   \`\`\`
   Then edit \`.env\` file with your credentials:
   - \`SEPOLIA_RPC_URL\` - Your Sepolia RPC endpoint
   - \`PRIVATE_KEY\` - Your wallet private key (for deployment)
   - \`ETHERSCAN_API_KEY\` - Your Etherscan API key (for verification)

4. **Compile contracts:**
   \`\`\`bash
   npm run compile
   \`\`\`

5. **Run tests:**
   \`\`\`bash
   npm test
   \`\`\`

6. **Deploy to Sepolia:**
   \`\`\`bash
   npm run deploy:sepolia
   \`\`\`

7. **Verify contract (after deployment):**
   \`\`\`bash
   npm run verify <CONTRACT_ADDRESS>
   \`\`\`

**Alternative:** Use the [Examples page](https://entrofhe.vercel.app/examples) for browser-based deployment and verification.

---

## 📋 Overview

${contractDocs || 'No additional documentation available.'}

${zamaSection}

## 🔍 Contract Code

\`\`\`solidity
${contractCode}
\`\`\`

${example.testPath ? `## 🧪 Tests

See [test file](./test/${path.basename(example.testPath)}) for comprehensive test coverage.

\`\`\`bash
npm test
\`\`\`
` : ''}

## 📚 Category

**${example.category}**

${example.chapter ? `## 📖 Chapter\n\n\`${example.chapter}\`` : ''}

## 🔗 Related Examples

- [All ${example.category} examples](https://github.com/zacnider/entrofhe/tree/main/examples)

## 📝 License

BSD-3-Clause-Clear
`;
}

function main() {
  console.log('📚 Generating documentation...\n');

  const examples = findExamples();
  const docsDir = path.join(__dirname, '..', 'docs', 'examples');
  const examplesDir = path.join(__dirname, '..', 'examples');
  
  // Create docs directory structure
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  // Generate individual example docs
  for (const example of examples) {
    const categoryDir = path.join(docsDir, example.category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    // Generate GitBook-compatible doc in docs/examples/ (central hub docs)
    const docPath = path.join(categoryDir, `${example.name}.md`);
    const docContent = generateExampleDoc(example);
    fs.writeFileSync(docPath, docContent);
    console.log(`✓ Generated: ${docPath}`);
    
    // Generate/Update README.md in each example directory (root, not contracts/)
    const exampleDir = path.dirname(path.dirname(example.contractPath)); // Go up from contracts/ to example root
    const readmePath = path.join(exampleDir, 'README.md');
    const readmeContent = generateExampleREADME(example, exampleDir);
    fs.writeFileSync(readmePath, readmeContent);
    console.log(`✓ Updated README: ${readmePath}`);
    
    // Generate GitBook-compatible docs in each example's own docs/ folder
    const exampleDocsDir = path.join(exampleDir, 'docs');
    if (!fs.existsSync(exampleDocsDir)) {
      fs.mkdirSync(exampleDocsDir, { recursive: true });
    }
    const exampleDocPath = path.join(exampleDocsDir, `${example.name}.md`);
    fs.writeFileSync(exampleDocPath, docContent);
    console.log(`✓ Generated example docs: ${exampleDocPath}`);
  }

  // Generate category indices
  const categories = [...new Set(examples.map(e => e.category))];
  for (const category of categories) {
    const categoryIndexPath = path.join(docsDir, category, 'README.md');
    const categoryIndex = generateCategoryIndex(category, examples);
    if (categoryIndex) {
      fs.writeFileSync(categoryIndexPath, categoryIndex);
      console.log(`✓ Generated category index: ${categoryIndexPath}`);
    }
  }

  // Generate main index
  const mainIndexPath = path.join(docsDir, 'README.md');
  const mainIndex = generateMainIndex(examples);
  fs.writeFileSync(mainIndexPath, mainIndex);
  console.log(`✓ Generated main index: ${mainIndexPath}`);

  console.log(`\n✅ Documentation generated successfully!`);
  console.log(`📂 Location: docs/examples/`);
  console.log(`📊 Total: ${examples.length} examples\n`);
}

if (require.main === module) {
  main();
}

