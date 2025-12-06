#!/usr/bin/env ts-node

/**
 * @title create-fhevm-category
 * @notice CLI tool to generate a new FHEVM example category
 * @dev Creates a category directory with index and documentation
 */

import * as fs from 'fs';
import * as path from 'path';

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

function parseArgs(): { category: string; description: string } {
  const args = process.argv.slice(2);
  let category = '';
  let description = '';

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '');
    const value = args[i + 1];
    if (key === 'category') category = value || '';
    if (key === 'description') description = value || '';
  }

  if (!category) {
    console.error('Error: --category is required');
    console.log('Usage: ts-node automation/create-fhevm-category.ts --category <category> [--description <description>]');
    process.exit(1);
  }

  if (!CATEGORIES.includes(category)) {
    console.error(`Error: Invalid category. Available: ${CATEGORIES.join(', ')}`);
    process.exit(1);
  }

  return {
    category,
    description: description || `${category} examples`,
  };
}

function createCategoryIndex(category: string, description: string) {
  const examplesDir = path.join(__dirname, '..', 'examples');
  const categoryDir = path.join(examplesDir, category);

  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }

  const indexPath = path.join(categoryDir, 'README.md');
  const indexContent = `# ${category.charAt(0).toUpperCase() + category.slice(1)} Examples

${description}

## Examples in this category

<!-- Examples will be auto-generated here -->

## Related Categories

- [All Examples](../)

## 📝 License

BSD-3-Clause-Clear
`;

  fs.writeFileSync(indexPath, indexContent);
  console.log(`✓ Created category index: ${indexPath}`);
}

function main() {
  const { category, description } = parseArgs();

  console.log(`\n🎯 Creating FHEVM Category: ${category}`);
  console.log(`📝 Description: ${description}\n`);

  createCategoryIndex(category, description);

  console.log(`\n✅ Category created successfully!`);
  console.log(`\n📂 Location: examples/${category}`);
}

if (require.main === module) {
  main();
}


