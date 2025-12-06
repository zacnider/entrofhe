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
        .filter(f => f.endsWith('.sol') && !f.startsWith('I')); // Ignore interface files
      
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

function main() {
  console.log('📚 Generating documentation...\n');

  const examples = findExamples();
  const docsDir = path.join(__dirname, '..', 'docs', 'examples');
  
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

    const docPath = path.join(categoryDir, `${example.name}.md`);
    const docContent = generateExampleDoc(example);
    fs.writeFileSync(docPath, docContent);
    console.log(`✓ Generated: ${docPath}`);
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

