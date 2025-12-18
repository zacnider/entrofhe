import { intro, outro, spinner, note } from '@clack/prompts';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { scanExamples, ExampleInfo } from './utils.js';
import { selectExample, promptOutputDirectory, promptEntropyOracle } from './prompts.js';
import { generateExample } from './generator.js';

const ENTROPY_ORACLE_ADDRESS = '0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361';

export async function showBanner(): Promise<void> {
  console.clear();
  
  const width = 60;
  const border = '═'.repeat(width);

  console.log(chalk.gray(`\n  ╔${border}╗`));
  console.log(chalk.gray(`  ║`) + `  Welcome to EntropyOracle FHEVM CLI v1.0.0`.padEnd(width + 10) + chalk.gray(`   ║`));
  console.log(chalk.gray(`  ╚${border}╝\n`));

  // ASCII Art
  const fhevmGradient = gradient(['#ffaa00', '#e0c068', '#ffaa00']);
  
  await new Promise<void>((resolve) => {
    figlet.text('ENTROPY', {
      font: 'ANSI Shadow',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    }, (err: any, data: any) => {
      if (err) {
        console.log('EntropyOracle FHEVM CLI');
        resolve();
        return;
      }
      console.log(fhevmGradient.multiline(data));
      resolve();
    });
  });

  console.log('\n');
  const subtitle = "  The ultimate EntropyOracle-powered FHEVM example generator";
  process.stdout.write(chalk.gray('  '));
  for (let i = 0; i < subtitle.length; i++) {
    process.stdout.write(chalk.gray(subtitle[i]));
    await new Promise(r => setTimeout(r, 10));
  }
  console.log('\n');
}

export async function runInteractive(): Promise<void> {
  await showBanner();

  intro(chalk.cyan('Let\'s create your EntropyOracle-integrated FHEVM example!'));

  // Scan examples
  const s = spinner();
  s.start('Scanning available examples...');
  
  let examples: ExampleInfo[];
  try {
    examples = scanExamples();
    s.stop(`✅ Found ${examples.length} examples`);
  } catch (error: any) {
    s.stop('❌ Failed to scan examples');
    outro(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }

  // Select example
  const example = await selectExample(examples);
  if (!example) {
    outro(chalk.yellow('Operation cancelled'));
    process.exit(0);
  }

  // Prompt for output directory
  const defaultName = `fhevm-example-${example.key}`;
  const outputDir = await promptOutputDirectory(defaultName);
  if (!outputDir) {
    outro(chalk.yellow('Operation cancelled'));
    process.exit(0);
  }

  // Prompt for EntropyOracle address
  const entropyOracle = await promptEntropyOracle(ENTROPY_ORACLE_ADDRESS);

  // Generate example
  const genSpinner = spinner();
  genSpinner.start(`Creating example: ${chalk.bold(example.name)}...`);

  try {
    await generateExample(example, {
      outputDir,
      entropyOracle,
      includeTests: true
    });
    
    genSpinner.stop(`✅ Example created successfully!`);

    note(
      `\n${chalk.green('Next steps:')}\n` +
      `  ${chalk.cyan('cd')} ${outputDir}\n` +
      `  ${chalk.cyan('npm test')}\n` +
      `  ${chalk.cyan('npm run deploy:sepolia')}\n`,
      'Ready to use!'
    );

    outro(chalk.green('✨ Happy coding with EntropyOracle!'));
  } catch (error: any) {
    genSpinner.stop('❌ Failed to create example');
    outro(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

export async function runDirect(exampleKey: string, outputDir?: string): Promise<void> {
  const examples = scanExamples();
  const example = examples.find(e => e.key === exampleKey);

  if (!example) {
    console.error(chalk.red(`❌ Example "${exampleKey}" not found`));
    console.log(chalk.yellow('\nAvailable examples:'));
    examples.forEach(e => {
      console.log(`  - ${chalk.cyan(e.key)}: ${e.name}`);
    });
    process.exit(1);
  }

  const finalOutputDir = outputDir || `./fhevm-example-${exampleKey}`;

  console.log(chalk.cyan(`\nCreating example: ${chalk.bold(example.name)}`));
  console.log(chalk.cyan(`Output: ${chalk.bold(finalOutputDir)}\n`));

  const s = spinner();
  s.start('Generating example...');

  try {
    await generateExample(example, {
      outputDir: finalOutputDir,
      entropyOracle: ENTROPY_ORACLE_ADDRESS,
      includeTests: true
    });

    s.stop('✅ Example created successfully!');

    console.log(chalk.green(`\n✨ Example ready at: ${finalOutputDir}`));
    console.log(chalk.yellow('\nNext steps:'));
    console.log(`  ${chalk.cyan('cd')} ${finalOutputDir}`);
    console.log(`  ${chalk.cyan('npm test')}`);
    console.log(`  ${chalk.cyan('npm run deploy:sepolia')}\n`);
  } catch (error: any) {
    s.stop('❌ Failed to create example');
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

export function listExamples(): void {
  const examples = scanExamples();
  const grouped = examples.reduce((acc, ex) => {
    if (!acc[ex.category]) acc[ex.category] = [];
    acc[ex.category].push(ex);
    return acc;
  }, {} as Record<string, ExampleInfo[]>);

  console.log(chalk.cyan('\n📋 Available EntropyOracle FHEVM Examples:\n'));

  for (const [category, categoryExamples] of Object.entries(grouped)) {
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
    console.log(chalk.bold.yellow(`\n${categoryName}:`));
    categoryExamples.forEach(ex => {
      console.log(`  ${chalk.green(ex.key.padEnd(40))} ${chalk.gray('-')} ${ex.name}`);
      console.log(`  ${' '.repeat(42)}${chalk.dim(ex.description)}`);
    });
  }

  console.log(chalk.cyan(`\n\nTotal: ${examples.length} examples\n`));
}

