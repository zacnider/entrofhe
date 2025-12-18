import { select, text, confirm, isCancel, cancel } from '@clack/prompts';
import chalk from 'chalk';
import { ExampleInfo, getCategoryDisplayName, getExamplesByCategory } from './utils.js';

export interface NumberedExample {
  number: number;
  example: ExampleInfo;
}

export function numberExamples(examples: ExampleInfo[]): NumberedExample[] {
  return examples.map((ex, index) => ({
    number: index + 1,
    example: ex
  }));
}

export async function selectExampleByNumber(examples: ExampleInfo[]): Promise<ExampleInfo | null> {
  const numbered = numberExamples(examples);
  
  // Display all examples with numbers
  console.log(chalk.cyan('\n📋 Available Examples:\n'));
  
  const grouped = getExamplesByCategory(examples);
  let currentNumber = 1;
  
  for (const [category, categoryExamples] of Object.entries(grouped)) {
    const categoryName = getCategoryDisplayName(category);
    console.log(chalk.bold.yellow(`\n${categoryName}:`));
    
    for (const ex of categoryExamples) {
      const num = numbered.find(n => n.example.key === ex.key)?.number || currentNumber;
      console.log(`  ${chalk.green(String(num).padStart(3))}. ${chalk.cyan(ex.name.padEnd(35))} ${chalk.gray('-')} ${ex.description}`);
      currentNumber++;
    }
  }
  
  console.log(chalk.cyan('\n'));

  const selectedNumber = await text({
    message: 'Enter example number to create:',
    placeholder: '1-22',
    validate: (value) => {
      const num = parseInt(value);
      if (isNaN(num) || num < 1 || num > examples.length) {
        return `Please enter a number between 1 and ${examples.length}`;
      }
      return undefined;
    }
  });

  if (isCancel(selectedNumber)) {
    cancel('Operation cancelled');
    return null;
  }

  const num = parseInt(selectedNumber as string);
  const selected = numbered.find(n => n.number === num);
  
  if (!selected) {
    cancel('Invalid selection');
    return null;
  }

  return selected.example;
}

export async function selectCategory(examples: ExampleInfo[]): Promise<string | null> {
  const categories = Array.from(new Set(examples.map(e => e.category)));
  const categoryOptions = categories.map(cat => ({
    value: cat,
    label: `${getCategoryDisplayName(cat)} (${examples.filter(e => e.category === cat).length} examples)`
  }));

  const category = await select({
    message: 'Select a category:',
    options: categoryOptions
  });

  if (isCancel(category)) {
    cancel('Operation cancelled');
    return null;
  }

  return category as string;
}

export async function selectExample(examples: ExampleInfo[]): Promise<ExampleInfo | null> {
  const grouped = getExamplesByCategory(examples);
  const category = await selectCategory(examples);
  
  if (!category) return null;

  const categoryExamples = grouped[category] || [];
  const exampleOptions = categoryExamples.map(ex => ({
    value: ex.key,
    label: `${ex.name} - ${ex.description}`
  }));

  const exampleKey = await select({
    message: `Select an example from ${getCategoryDisplayName(category)}:`,
    options: exampleOptions
  });

  if (isCancel(exampleKey)) {
    cancel('Operation cancelled');
    return null;
  }

  return categoryExamples.find(e => e.key === exampleKey) || null;
}

export async function promptOutputDirectory(defaultName: string): Promise<string | null> {
  const outputDir = await text({
    message: 'Enter output directory:',
    placeholder: `./${defaultName}`,
    defaultValue: `./${defaultName}`
  });

  if (isCancel(outputDir)) {
    cancel('Operation cancelled');
    return null;
  }

  return outputDir as string;
}

export async function promptEntropyOracle(defaultAddress: string): Promise<string> {
  const useCustom = await confirm({
    message: `Use custom EntropyOracle address? (default: ${defaultAddress})`
  });

  if (isCancel(useCustom)) {
    return defaultAddress;
  }

  if (!useCustom) {
    return defaultAddress;
  }

  const address = await text({
    message: 'Enter EntropyOracle address:',
    placeholder: defaultAddress,
    validate: (value) => {
      if (!value || !value.match(/^0x[a-fA-F0-9]{40}$/)) {
        return 'Invalid Ethereum address';
      }
      return undefined;
    }
  });

  if (isCancel(address)) {
    return defaultAddress;
  }

  return address as string;
}

