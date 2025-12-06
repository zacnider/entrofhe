# FHEVM Examples

This directory contains standalone FHEVM examples organized by category.

## Categories

- **basic** - Basic FHE operations (counter, arithmetic, equality)
- **encryption** - Encrypting values
- **user-decryption** - User-specific decryption
- **public-decryption** - Public decryption patterns
- **access-control** - Access control with FHE
- **input-proof** - Input proof explanations
- **anti-patterns** - Common mistakes and how to avoid them
- **handles** - Understanding handles and symbolic execution
- **advanced** - Advanced patterns and use cases

## Creating a New Example

Use the automation script to create a new example:

```bash
npm run create-example -- --name my-example --category basic --description "My example description"
```

## Generating Documentation

Generate documentation for all examples:

```bash
npm run generate-docs
```

## Structure

Each example is a standalone Hardhat project with:

- `contracts/` - Solidity contracts
- `test/` - Test files
- `hardhat.config.ts` - Hardhat configuration
- `package.json` - Dependencies
- `README.md` - Example-specific documentation

## License

BSD-3-Clause-Clear


