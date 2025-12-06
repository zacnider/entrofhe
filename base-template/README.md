# FHEVM Example Template

This is a base template for creating FHEVM examples. Use the `create-fhevm-example` script to generate a new example from this template.

## Features

- Hardhat configuration with FHEVM plugin
- TypeScript support
- Test setup with Chai
- TypeChain for type generation
- Gas reporting
- Coverage support

## Usage

This template is used by the automation scripts. To create a new example:

```bash
npm run create-example -- --name my-example --category basic
```

## Structure

```
.
├── contracts/          # Solidity contracts
├── test/              # Test files
├── scripts/           # Deployment scripts
├── hardhat.config.ts  # Hardhat configuration
└── package.json       # Dependencies
```


