#!/usr/bin/env ts-node

/**
 * @title update-all-examples
 * @notice Script to update all examples from base-template
 * @dev Updates package.json, hardhat.config.ts, and other template files in all examples
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface UpdateOptions {
  updatePackageJson?: boolean;
  updateHardhatConfig?: boolean;
  updateTsConfig?: boolean;
  dryRun?: boolean;
}

function getExamples(): string[] {
  const examplesDir = path.join(__dirname, '..', 'examples');
  const examples: string[] = [];

  if (!fs.existsSync(examplesDir)) {
    return examples;
  }

  const entries = fs.readdirSync(examplesDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.includes('.backup')) {
      const examplePath = path.join(examplesDir, entry.name);
      // Check if it's a valid example (has package.json)
      if (fs.existsSync(path.join(examplePath, 'package.json'))) {
        examples.push(entry.name);
      }
    }
  }

  return examples;
}

function updatePackageJson(examplePath: string, baseTemplatePath: string, dryRun: boolean = false): void {
  const examplePackageJsonPath = path.join(examplePath, 'package.json');
  const templatePackageJsonPath = path.join(baseTemplatePath, 'package.json');

  if (!fs.existsSync(examplePackageJsonPath) || !fs.existsSync(templatePackageJsonPath)) {
    console.warn(`⚠️  Skipping ${path.basename(examplePath)}: package.json not found`);
    return;
  }

  const templatePackageJson = JSON.parse(fs.readFileSync(templatePackageJsonPath, 'utf-8'));
  const examplePackageJson = JSON.parse(fs.readFileSync(examplePackageJsonPath, 'utf-8'));

  // Update dependencies from template
  const updated = { ...examplePackageJson };
  let changed = false;

  // Update devDependencies
  if (templatePackageJson.devDependencies) {
    if (!updated.devDependencies) {
      updated.devDependencies = {};
    }
    for (const [key, value] of Object.entries(templatePackageJson.devDependencies)) {
      if (updated.devDependencies[key] !== value) {
        updated.devDependencies[key] = value;
        changed = true;
      }
    }
  }

  // Update dependencies
  if (templatePackageJson.dependencies) {
    if (!updated.dependencies) {
      updated.dependencies = {};
    }
    for (const [key, value] of Object.entries(templatePackageJson.dependencies)) {
      if (updated.dependencies[key] !== value) {
        updated.dependencies[key] = value;
        changed = true;
      }
    }
  }

  if (changed) {
    if (dryRun) {
      console.log(`[DRY RUN] Would update package.json in ${path.basename(examplePath)}`);
    } else {
      fs.writeFileSync(examplePackageJsonPath, JSON.stringify(updated, null, 2) + '\n');
      console.log(`✓ Updated package.json in ${path.basename(examplePath)}`);
    }
  } else {
    console.log(`  No changes needed in ${path.basename(examplePath)}/package.json`);
  }
}

function updateHardhatConfig(examplePath: string, baseTemplatePath: string, dryRun: boolean = false): void {
  const exampleConfigPath = path.join(examplePath, 'hardhat.config.ts');
  const templateConfigPath = path.join(baseTemplatePath, 'hardhat.config.ts');

  if (!fs.existsSync(exampleConfigPath) || !fs.existsSync(templateConfigPath)) {
    return;
  }

  const templateConfig = fs.readFileSync(templateConfigPath, 'utf-8');
  const exampleConfig = fs.readFileSync(exampleConfigPath, 'utf-8');

  // Simple comparison - if different, update
  if (templateConfig !== exampleConfig) {
    if (dryRun) {
      console.log(`[DRY RUN] Would update hardhat.config.ts in ${path.basename(examplePath)}`);
    } else {
      fs.writeFileSync(exampleConfigPath, templateConfig);
      console.log(`✓ Updated hardhat.config.ts in ${path.basename(examplePath)}`);
    }
  } else {
    console.log(`  No changes needed in ${path.basename(examplePath)}/hardhat.config.ts`);
  }
}

function updateTsConfig(examplePath: string, baseTemplatePath: string, dryRun: boolean = false): void {
  const exampleTsConfigPath = path.join(examplePath, 'tsconfig.json');
  const templateTsConfigPath = path.join(baseTemplatePath, 'tsconfig.json');

  if (!fs.existsSync(exampleTsConfigPath) || !fs.existsSync(templateTsConfigPath)) {
    return;
  }

  const templateTsConfig = fs.readFileSync(templateTsConfigPath, 'utf-8');
  const exampleTsConfig = fs.readFileSync(exampleTsConfigPath, 'utf-8');

  if (templateTsConfig !== exampleTsConfig) {
    if (dryRun) {
      console.log(`[DRY RUN] Would update tsconfig.json in ${path.basename(examplePath)}`);
    } else {
      fs.writeFileSync(exampleTsConfigPath, templateTsConfig);
      console.log(`✓ Updated tsconfig.json in ${path.basename(examplePath)}`);
    }
  } else {
    console.log(`  No changes needed in ${path.basename(examplePath)}/tsconfig.json`);
  }
}

function parseArgs(): UpdateOptions {
  const args = process.argv.slice(2);
  const options: UpdateOptions = {
    updatePackageJson: true,
    updateHardhatConfig: false,
    updateTsConfig: false,
    dryRun: false,
  };

  for (const arg of args) {
    if (arg === '--all') {
      options.updatePackageJson = true;
      options.updateHardhatConfig = true;
      options.updateTsConfig = true;
    } else if (arg === '--package-json') {
      options.updatePackageJson = true;
    } else if (arg === '--hardhat-config') {
      options.updateHardhatConfig = true;
    } else if (arg === '--tsconfig') {
      options.updateTsConfig = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Usage: ts-node automation/update-all-examples.ts [options]

Options:
  --all              Update all files (package.json, hardhat.config.ts, tsconfig.json)
  --package-json     Update package.json from base-template (default)
  --hardhat-config   Update hardhat.config.ts from base-template
  --tsconfig         Update tsconfig.json from base-template
  --dry-run          Show what would be updated without making changes
  --help, -h         Show this help message

Examples:
  # Update only package.json in all examples
  npm run update-examples

  # Update all files
  npm run update-examples -- --all

  # Dry run to see what would change
  npm run update-examples -- --dry-run
      `);
      process.exit(0);
    }
  }

  return options;
}

function main() {
  const options = parseArgs();
  const baseTemplatePath = path.join(__dirname, '..', 'base-template');
  const examplesDir = path.join(__dirname, '..', 'examples');

  if (!fs.existsSync(baseTemplatePath)) {
    console.error('❌ Error: base-template directory not found');
    process.exit(1);
  }

  console.log('🔄 Updating all examples from base-template...\n');

  if (options.dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }

  const examples = getExamples();
  console.log(`Found ${examples.length} examples to update\n`);

  let updatedCount = 0;

  for (const example of examples) {
    const examplePath = path.join(examplesDir, example);
    console.log(`\n📦 Processing: ${example}`);

    if (options.updatePackageJson) {
      updatePackageJson(examplePath, baseTemplatePath, options.dryRun);
    }

    if (options.updateHardhatConfig) {
      updateHardhatConfig(examplePath, baseTemplatePath, options.dryRun);
    }

    if (options.updateTsConfig) {
      updateTsConfig(examplePath, baseTemplatePath, options.dryRun);
    }

    updatedCount++;
  }

  console.log(`\n✅ Processed ${updatedCount} examples`);

  if (!options.dryRun) {
    console.log('\n💡 Next steps:');
    console.log('   1. Review the changes');
    console.log('   2. Test a few examples: cd examples/<example> && npm install && npm test');
    console.log('   3. Commit the changes if everything looks good');
  }
}

if (require.main === module) {
  main();
}

