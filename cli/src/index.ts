#!/usr/bin/env node

import { Command } from 'commander';
import { runInteractive, runDirect, listExamples } from './main.js';
import { scanExamples, ExampleInfo } from './utils.js';

const program = new Command();

program
  .name('entrofhe')
  .description('CLI tool to generate EntropyOracle-integrated FHEVM examples')
  .version('1.0.0');

program
  .command('list')
  .description('List all available examples')
  .action(() => {
    listExamples();
  });

program
  .command('create')
  .description('Create an example directly')
  .argument('<example-key-or-number>', 'Example key (e.g., entropy-counter) or number (e.g., 1)')
  .argument('[output-dir]', 'Output directory', './fhevm-example-<name>')
  .option('-e, --entropy-oracle <address>', 'EntropyOracle address', '0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361')
  .action(async (exampleKeyOrNumber: string, outputDir?: string, options?: { entropyOracle?: string }) => {
    const examples = scanExamples();
    
    // Check if input is a number
    const number = parseInt(exampleKeyOrNumber);
    let example: ExampleInfo | undefined;
    
    if (!isNaN(number) && number >= 1 && number <= examples.length) {
      // It's a number, find by index
      example = examples[number - 1];
    } else {
      // It's a key, find by key
      example = examples.find(e => e.key === exampleKeyOrNumber);
    }

    if (!example) {
      console.error(`❌ Example "${exampleKeyOrNumber}" not found`);
      console.log('\nAvailable examples:');
      examples.forEach((e, index) => {
        console.log(`  ${String(index + 1).padStart(3)}. ${e.key}: ${e.name}`);
      });
      process.exit(1);
    }

    const finalOutputDir = outputDir || `./fhevm-example-${example.key}`;
    
    await runDirect(example.key, finalOutputDir);
  });

// Default: interactive mode
program
  .action(async () => {
    await runInteractive();
  });

program.parse();

