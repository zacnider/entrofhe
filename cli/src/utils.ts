import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ExampleInfo {
  key: string;
  name: string;
  category: string;
  description: string;
  contractPath: string;
  testPath: string;
  contractName: string;
}

const CATEGORY_MAP: Record<string, string> = {
  'basic': 'Basic',
  'encryption': 'Encryption',
  'user-decryption': 'User Decryption',
  'public-decryption': 'Public Decryption',
  'access-control': 'Access Control',
  'input-proof': 'Input Proof',
  'anti-patterns': 'Anti-Patterns',
  'handles': 'Handles',
  'advanced': 'Advanced',
  'openzeppelin': 'OpenZeppelin'
};

export function getProjectRoot(): string {
  // Walk up from cli/src/utils.ts to find examples/ directory
  let dir = __dirname;
  while (dir !== path.dirname(dir)) {
    const examplesPath = path.join(dir, '..', '..', 'examples');
    if (fs.existsSync(examplesPath)) {
      return path.join(dir, '..', '..');
    }
    dir = path.dirname(dir);
  }
  throw new Error('Could not find project root. Make sure examples/ directory exists.');
}

export function scanExamples(): ExampleInfo[] {
  const projectRoot = getProjectRoot();
  const examplesDir = path.join(projectRoot, 'examples');
  const examples: ExampleInfo[] = [];

  if (!fs.existsSync(examplesDir)) {
    return examples;
  }

  const dirs = fs.readdirSync(examplesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.') && dirent.name !== 'README.md');

  for (const dir of dirs) {
    const exampleDir = path.join(examplesDir, dir.name);
    const contractsDir = path.join(exampleDir, 'contracts');
    const testDir = path.join(exampleDir, 'test');

    if (!fs.existsSync(contractsDir)) continue;

    // Find main contract (not IEntropyOracle, FHEChaosEngine, EntropyOracle)
    const contractFiles = fs.readdirSync(contractsDir)
      .filter(f => f.endsWith('.sol') && 
        !f.includes('IEntropyOracle') && 
        !f.includes('FHEChaosEngine') && 
        !f.includes('EntropyOracle') &&
        !f.startsWith('I'));

    if (contractFiles.length === 0) continue;

    // Get the main contract file (prefer the one that matches the example name pattern)
    const mainContract = contractFiles[0];
    const contractPath = path.join(contractsDir, mainContract);
    
    // Extract contract name from file
    const contractContent = fs.readFileSync(contractPath, 'utf-8');
    const contractMatch = contractContent.match(/contract\s+(\w+)/);
    if (!contractMatch) continue;

    const contractName = contractMatch[1];
    
    // Find test file
    let testPath = '';
    if (fs.existsSync(testDir)) {
      const testFiles = fs.readdirSync(testDir)
        .filter(f => f.endsWith('.ts') && f.includes(contractName.replace('Entropy', '')));
      if (testFiles.length > 0) {
        testPath = path.join(testDir, testFiles[0]);
      }
    }

    // Parse category from directory name (e.g., "basic-simplecounter" -> "basic")
    const categoryMatch = dir.name.match(/^([^-]+)/);
    const category = categoryMatch ? categoryMatch[1] : 'basic';

    // Generate key (simpler: use directory name as base, clean it up)
    let key = dir.name;
    // Remove category prefix for cleaner keys
    if (key.startsWith('basic-')) {
      key = 'entropy-' + key.replace('basic-', '');
    } else if (key.startsWith('encryption-')) {
      key = 'entropy-encryption-' + key.replace('encryption-', '');
    } else if (key.startsWith('user-decryption-')) {
      key = 'entropy-user-decryption-' + key.replace('user-decryption-', '');
    } else if (key.startsWith('public-decryption-')) {
      key = 'entropy-public-decryption-' + key.replace('public-decryption-', '');
    } else if (key.startsWith('access-control-')) {
      key = 'entropy-access-control-' + key.replace('access-control-', '');
    } else if (key.startsWith('input-proof-')) {
      key = 'entropy-input-proof-' + key.replace('input-proof-', '');
    } else if (key.startsWith('anti-patterns-')) {
      key = 'entropy-anti-patterns-' + key.replace('anti-patterns-', '');
    } else if (key.startsWith('handles-')) {
      key = 'entropy-handles-' + key.replace('handles-', '');
    } else if (key.startsWith('advanced-')) {
      key = key.replace('advanced-', '');
    } else if (key.startsWith('openzeppelin-')) {
      key = 'entropy-' + key.replace('openzeppelin-', '');
    }

    // Generate display name (better formatting)
    let name = contractName.replace(/^Entropy/, '');
    // Convert camelCase to Title Case
    name = name.replace(/([A-Z])/g, ' $1').trim();
    // Fix common patterns
    name = name.replace(/\bERC\s*(\d+)/g, 'ERC$1');
    name = name.replace(/\b(\d+)\s*(\w+)/g, '$1$2');

    // Try to read description from README
    let description = `${name} with EntropyOracle integration`;
    const readmePath = path.join(exampleDir, 'README.md');
    if (fs.existsSync(readmePath)) {
      const readme = fs.readFileSync(readmePath, 'utf-8');
      const descMatch = readme.match(/#\s+(.+?)(?:\n|$)/);
      if (descMatch) {
        description = descMatch[1];
      }
    }

    examples.push({
      key,
      name,
      category,
      description,
      contractPath,
      testPath,
      contractName
    });
  }

  return examples.sort((a, b) => {
    const categoryOrder = Object.keys(CATEGORY_MAP);
    const aIndex = categoryOrder.indexOf(a.category);
    const bIndex = categoryOrder.indexOf(b.category);
    if (aIndex !== bIndex) return aIndex - bIndex;
    return a.name.localeCompare(b.name);
  });
}

export function getCategoryDisplayName(category: string): string {
  return CATEGORY_MAP[category] || category;
}

export function getExamplesByCategory(examples: ExampleInfo[]): Record<string, ExampleInfo[]> {
  const grouped: Record<string, ExampleInfo[]> = {};
  for (const example of examples) {
    if (!grouped[example.category]) {
      grouped[example.category] = [];
    }
    grouped[example.category].push(example);
  }
  return grouped;
}

