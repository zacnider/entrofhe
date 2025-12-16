import * as fs from 'fs';
import * as path from 'path';

// Map of example categories to their Zama FHEVM features
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

function getCategoryFromPath(examplePath: string): string {
  const parts = examplePath.split('/');
  const exampleName = parts[parts.length - 1];
  
  if (exampleName.startsWith('basic-')) return 'basic';
  if (exampleName.startsWith('encryption-')) return 'encryption';
  if (exampleName.startsWith('user-decryption-')) return 'user-decryption';
  if (exampleName.startsWith('public-decryption-')) return 'public-decryption';
  if (exampleName.startsWith('access-control-')) return 'access-control';
  if (exampleName.startsWith('input-proof-')) return 'input-proof';
  if (exampleName.startsWith('anti-patterns-')) return 'anti-patterns';
  if (exampleName.startsWith('handles-')) return 'handles';
  if (exampleName.startsWith('advanced-')) return 'advanced';
  if (exampleName.startsWith('openzeppelin-')) return 'openzeppelin';
  
  return 'basic'; // default
}

function generateZamaSection(category: string): string {
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

function addZamaSectionToReadme(readmePath: string): boolean {
  try {
    const content = fs.readFileSync(readmePath, 'utf-8');
    
    // Check if Zama FHEVM section already exists
    if (content.includes('## 🔐 Zama FHEVM Usage')) {
      console.log(`  ⚠️  ${readmePath} already has Zama FHEVM section, skipping...`);
      return false;
    }
    
    // Find the Contract Code section
    const contractCodeIndex = content.indexOf('## 🔍 Contract Code');
    if (contractCodeIndex === -1) {
      console.log(`  ⚠️  ${readmePath} doesn't have Contract Code section, skipping...`);
      return false;
    }
    
    // Get category from path
    const category = getCategoryFromPath(readmePath);
    const zamaSection = generateZamaSection(category);
    
    // Insert Zama section before Contract Code
    const newContent = 
      content.slice(0, contractCodeIndex) + 
      zamaSection + 
      '\n' +
      content.slice(contractCodeIndex);
    
    fs.writeFileSync(readmePath, newContent, 'utf-8');
    console.log(`  ✅ Added Zama FHEVM section to ${readmePath}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Error processing ${readmePath}:`, error);
    return false;
  }
}

function main() {
  const examplesDir = path.join(process.cwd(), 'examples');
  
  if (!fs.existsSync(examplesDir)) {
    console.error('Examples directory not found!');
    process.exit(1);
  }
  
  const examples = fs.readdirSync(examplesDir)
    .filter(item => {
      const itemPath = path.join(examplesDir, item);
      return fs.statSync(itemPath).isDirectory();
    });
  
  console.log(`📝 Adding Zama FHEVM Usage sections to ${examples.length} examples...\n`);
  
  let successCount = 0;
  let skipCount = 0;
  
  for (const example of examples) {
    const readmePath = path.join(examplesDir, example, 'README.md');
    
    if (!fs.existsSync(readmePath)) {
      console.log(`  ⚠️  ${readmePath} not found, skipping...`);
      skipCount++;
      continue;
    }
    
    const added = addZamaSectionToReadme(readmePath);
    if (added) {
      successCount++;
    } else {
      skipCount++;
    }
  }
  
  console.log(`\n✅ Successfully added Zama FHEVM sections to ${successCount} examples`);
  if (skipCount > 0) {
    console.log(`⚠️  Skipped ${skipCount} examples (already have section or missing Contract Code section)`);
  }
}

main();

