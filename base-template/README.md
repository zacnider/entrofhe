# FHEVM Example Template

This is a base template for creating FHEVM examples. Use the `create-fhevm-example` script to generate a new example from this template.

## 🔐 Built with Zama FHEVM

This template uses **Zama FHEVM** - a full-stack framework for integrating Fully Homomorphic Encryption (FHE) with blockchain applications.

**Zama FHEVM Features Included:**
- `ZamaEthereumConfig` - Network configuration
- `@fhevm/solidity` - FHE operations library
- `@fhevm/hardhat-plugin` - Hardhat integration
- `@zama-fhe/relayer-sdk` - Relayer SDK for encrypted operations

Learn more: [Zama FHEVM Documentation](https://docs.zama.org/protocol)

## Features

- Hardhat configuration with Zama FHEVM plugin
- TypeScript support
- Test setup with Chai
- TypeChain for type generation
- Gas reporting
- Coverage support
- Zama FHEVM integration ready

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


