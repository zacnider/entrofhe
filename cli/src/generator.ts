import * as fs from 'fs-extra';
import * as path from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { ExampleInfo, getProjectRoot } from './utils.js';

const ENTROPY_ORACLE_ADDRESS = '0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361';
const ENTROPY_ORACLE_FEE = '0.00001 ether';

export interface GenerateOptions {
  entropyOracle?: string;
  includeTests?: boolean;
  outputDir: string;
}

export async function generateExample(
  example: ExampleInfo,
  options: GenerateOptions
): Promise<void> {
  const projectRoot = getProjectRoot();
  const baseTemplatePath = path.join(projectRoot, 'base-template');
  const outputPath = path.resolve(options.outputDir);

  // Check if output directory exists
  if (existsSync(outputPath)) {
    throw new Error(`Directory ${outputPath} already exists`);
  }

  // Copy base template
  await fs.copy(baseTemplatePath, outputPath, {
    filter: (src) => {
      const name = path.basename(src);
      return name !== 'node_modules' && name !== '.git' && name !== 'artifacts' && name !== 'cache';
    }
  });

  // Read contract content
  const contractContent = readFileSync(example.contractPath, 'utf-8');
  
  // Read test content if exists
  let testContent = '';
  if (example.testPath && existsSync(example.testPath)) {
    testContent = readFileSync(example.testPath, 'utf-8');
  }

  // Copy IEntropyOracle interface
  const interfaceSource = path.join(projectRoot, 'contracts', 'interfaces', 'IEntropyOracle.sol');
  const interfaceDest = path.join(outputPath, 'contracts', 'IEntropyOracle.sol');
  if (existsSync(interfaceSource)) {
    await fs.ensureDir(path.dirname(interfaceDest));
    await fs.copy(interfaceSource, interfaceDest);
  }

  // Write contract
  const contractDest = path.join(outputPath, 'contracts', path.basename(example.contractPath));
  await fs.ensureDir(path.dirname(contractDest));
  writeFileSync(contractDest, contractContent);

  // Write test if exists
  if (testContent) {
    const testDest = path.join(outputPath, 'test', path.basename(example.testPath));
    await fs.ensureDir(path.dirname(testDest));
    writeFileSync(testDest, testContent);
  }

  // Update package.json
  const packageJsonPath = path.join(outputPath, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  packageJson.name = `fhevm-example-${example.key}`;
  packageJson.description = example.description;
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Create README
  const readmeContent = generateREADME(example, options);
  writeFileSync(path.join(outputPath, 'README.md'), readmeContent);

  // Create .env.example
  const envExampleContent = generateEnvExample();
  writeFileSync(path.join(outputPath, '.env.example'), envExampleContent);

  // Install dependencies
  try {
    execSync('npm install --legacy-peer-deps', {
      cwd: outputPath,
      stdio: 'inherit'
    });
  } catch (error) {
    console.warn('Warning: npm install failed, but project structure is ready');
  }
}

function generateREADME(example: ExampleInfo, options: GenerateOptions): string {
  const entropyOracle = options.entropyOracle || ENTROPY_ORACLE_ADDRESS;
  
  return `# ${example.name}

${example.description}

## 🎯 Overview

This example demonstrates ${example.name.toLowerCase()} using **EntropyOracle** - a production-ready FHE-based entropy and randomness infrastructure.

## ✨ Features

- ✅ **EntropyOracle Integration**: Uses encrypted randomness from EntropyOracle
- ✅ **Zama FHEVM**: Built with Zama's FHEVM framework
- ✅ **Fully Encrypted**: All operations performed on encrypted data
- ✅ **Production Ready**: Deployed on Sepolia testnet

## 🚀 Quick Start

### Installation

\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

### Testing

\`\`\`bash
npm test
\`\`\`

### Deployment

\`\`\`bash
npm run deploy:sepolia
\`\`\`

## 🔗 EntropyOracle

**EntropyOracle** is deployed on Sepolia testnet:

- **Address**: \`${entropyOracle}\`
- **Network**: Sepolia (Chain ID: 11155111)
- **Fee per Request**: ${ENTROPY_ORACLE_FEE}

### Integration

This contract uses EntropyOracle for encrypted randomness:

\`\`\`solidity
import "./interfaces/IEntropyOracle.sol";

contract ${example.contractName} is ZamaEthereumConfig {
    IEntropyOracle public constant ENTROPY_ORACLE = 
        IEntropyOracle(${entropyOracle});
    
    // Use entropy in your FHE operations...
}
\`\`\`

## 📚 Learn More

- [Zama FHEVM Documentation](https://docs.zama.org/protocol)
- [EntropyOracle Integration Guide](../../docs/INTEGRATION.md)
- [FHEVM Example Hub](../../README.md)

## 📝 License

BSD-3-Clause-Clear
`;
}

function generateEnvExample(): string {
  return `# Network Configuration
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
# Or use Infura:
# SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Private Key (for deployment)
# ⚠️  Never commit this file with a real private key!
PRIVATE_KEY=your_private_key_here

# Etherscan API Key (for contract verification)
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Optional: Gas Reporter
# REPORT_GAS=true
# COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
`;
}

