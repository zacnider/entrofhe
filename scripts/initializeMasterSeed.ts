import { ethers } from 'ethers';
import { initSDK, createInstance, SepoliaConfig } from '@zama-fhe/relayer-sdk/web';
import * as fs from 'fs';
import * as path from 'path';

// Contract addresses
const CHAOS_ENGINE_ADDRESS = '0x66561a3e849ABEd61cAE6c9e5614D7444a3ad674';
const FHE_CHAOS_ENGINE_ABI = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../artifacts/contracts/FHEChaosEngine.sol/FHEChaosEngine.json'), 'utf8')
).abi;

async function initializeMasterSeed() {
  // Load environment variables
  require('dotenv').config();

  if (!process.env.PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY not found in .env file');
  }

  // Connect to Sepolia
  const provider = new ethers.JsonRpcProvider(
    process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/' + (process.env.INFURA_API_KEY || '')
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log('Connecting to Sepolia...');
  console.log('Wallet address:', wallet.address);

  // Initialize FHEVM SDK
  console.log('\nInitializing FHEVM SDK...');
  await initSDK();

  // Get EIP1193 provider (for MetaMask or other wallet)
  // For script, we'll use a custom provider
  const eip1193Provider = {
    request: async (args: any) => {
      if (args.method === 'eth_sendTransaction') {
        const tx = await wallet.sendTransaction(args.params[0]);
        return tx.hash;
      }
      if (args.method === 'eth_accounts') {
        return [wallet.address];
      }
      if (args.method === 'eth_chainId') {
        return `0x${(await provider.getNetwork()).chainId.toString(16)}`;
      }
      return await provider.send(args.method, args.params || []);
    },
  };

  // Create FHEVM instance
  const config = {
    ...SepoliaConfig,
    chainId: 11155111,
    network: eip1193Provider,
  };

  console.log('Creating FHEVM instance...');
  const fhevmInstance = await createInstance(config);
  console.log('FHEVM instance created!');

  // Generate a random seed (you can use any uint64 value)
  const seedValue = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
  console.log('\nGenerated seed value:', seedValue.toString());

  // Encrypt the seed
  console.log('Encrypting seed...');
  const encryptedInput = await fhevmInstance
    .createEncryptedInput(CHAOS_ENGINE_ADDRESS, wallet.address)
    .add64(Number(seedValue))
    .encrypt();

  console.log('Seed encrypted!');

  // Get contract instance
  const chaosEngine = new ethers.Contract(
    CHAOS_ENGINE_ADDRESS,
    FHE_CHAOS_ENGINE_ABI,
    wallet
  );

  // Initialize master seed
  console.log('\nInitializing master seed on contract...');
  const tx = await chaosEngine.initializeMasterSeed(
    encryptedInput.handles[0],
    encryptedInput.inputProof
  );

  console.log('Transaction sent:', tx.hash);
  console.log('Waiting for confirmation...');

  const receipt = await tx.wait();
  console.log('\n✅ Master seed initialized successfully!');
  console.log('Transaction hash:', receipt.hash);
  console.log('Block number:', receipt.blockNumber);
}

// Run the script
initializeMasterSeed()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });

