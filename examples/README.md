# FHEVM Examples

This directory contains standalone FHEVM examples organized by category. **All examples are built using Zama FHEVM** - a full-stack framework for integrating Fully Homomorphic Encryption (FHE) with blockchain applications.

## 🔐 Built with Zama FHEVM

All examples in this directory demonstrate real-world usage of **Zama FHEVM** features:

- **ZamaEthereumConfig**: All contracts inherit from Zama's network configuration
- **FHE Operations**: Using Zama's FHE library (FHE.add, FHE.sub, FHE.mul, FHE.eq, FHE.xor, etc.)
- **Encrypted Types**: Using Zama's encrypted integer types (euint64, externalEuint64)
- **Access Control**: Using Zama's permission system (FHE.allow, FHE.allowThis, FHE.allowTransient)
- **Public Decryption**: Using FHE.makePubliclyDecryptable() for public decryption patterns
- **Zama FHEVM Relayer**: All encrypted operations use Zama's relayer

Each example's README includes a detailed **Zama FHEVM Usage** section explaining which Zama FHEVM features are used and how.

**Learn more about Zama FHEVM:**
- 📚 [Zama FHEVM Documentation](https://docs.zama.org/protocol)
- 🎓 [Zama Developer Hub](https://www.zama.org/developer-hub)
- 💻 [Zama FHEVM GitHub](https://github.com/zama-ai/fhevm)

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
- **openzeppelin** - OpenZeppelin confidential contracts (ERC7984) examples

## Standard workflow (all tutorial examples)

- Install (per example, first run): `npm install --legacy-peer-deps`
- Compile: `npx hardhat compile`
- Test (local FHE + local EntropyOracle/FHEChaosEngine auto-deploy): `npx hardhat test`
- Deploy (frontend Deploy button): constructor arg is fixed to EntropyOracle address `0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`
- Verify: `npx hardhat verify --network sepolia <contractAddress> 0x75b923d7940E1BD6689EbFdbBDCD74C1f6695361`

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


