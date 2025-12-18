# FHEVM Example Template

This is a base template for creating FHEVM examples. This template is **based on Zama's official [fhevm-hardhat-template](https://github.com/zama-ai/fhevm-hardhat-template)** and has been slightly customized for use in the EntroFHE example hub.

## 🔐 Built with Zama FHEVM

This template uses **Zama FHEVM** - a full-stack framework for integrating Fully Homomorphic Encryption (FHE) with blockchain applications.

**Zama FHEVM Features Included:**
- `ZamaEthereumConfig` - Network configuration
- `@fhevm/solidity` - FHE operations library
- `@fhevm/hardhat-plugin` - Hardhat integration
- `@zama-fhe/relayer-sdk` - Relayer SDK for encrypted operations

**Based on:** [Zama's fhevm-hardhat-template](https://github.com/zama-ai/fhevm-hardhat-template)

Learn more: [Zama FHEVM Documentation](https://docs.zama.org/protocol)

## Features

- Hardhat configuration with Zama FHEVM plugin
- TypeScript support
- Test setup with Chai
- TypeChain for type generation
- Gas reporting
- Coverage support
- Zama FHEVM integration ready
- Custom deployment and verification scripts

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

## Customizations from Zama's Template

This template is based on Zama's official template with the following customizations:

- **Environment Variables**: Uses `dotenv` instead of `hardhat vars` for simpler configuration
- **Deployment Scripts**: Custom `scripts/deploy.ts` and `scripts/verify.ts` for deployment workflow
- **Setup Script**: `scripts/setup.js` for initial environment setup
- **Example Contract**: Simplified `Example.sol` contract as a starting point

## License

BSD-3-Clause-Clear License - Same as Zama's template
