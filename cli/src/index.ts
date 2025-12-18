#!/usr/bin/env node

import { Command } from 'commander';
import { runInteractive, runDirect, listExamples } from './main.js';
import { scanExamples } from './utils.js';

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
  .argument('<example-key>', 'Example key (e.g., entropy-counter)')
  .argument('[output-dir]', 'Output directory', './fhevm-example-<name>')
  .option('-e, --entropy-oracle <address>', 'EntropyOracle address', '0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361')
  .action(async (exampleKey: string, outputDir?: string, options?: { entropyOracle?: string }) => {
    const examples = scanExamples();
    const example = examples.find(e => e.key === exampleKey);

    if (!example) {
      console.error(`❌ Example "${exampleKey}" not found`);
      console.log('\nAvailable examples:');
      examples.forEach(e => {
        console.log(`  - ${e.key}: ${e.name}`);
      });
      process.exit(1);
    }

    const finalOutputDir = outputDir || `./fhevm-example-${exampleKey}`;
    
    await runDirect(exampleKey, finalOutputDir);
  });

// Default: interactive mode
program
  .action(async () => {
    await runInteractive();
  });

program.parse();

