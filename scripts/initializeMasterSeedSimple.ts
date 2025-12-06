/**
 * Simple Master Seed Initialization Script
 * 
 * This script initializes the master seed for FHEChaosEngine.
 * 
 * IMPORTANT: This must be run by the contract owner AFTER deployment.
 * 
 * Usage:
 * 1. Make sure you have PRIVATE_KEY in .env (contract owner's key)
 * 2. Run: npx ts-node scripts/initializeMasterSeedSimple.ts
 * 
 * Note: This requires FHEVM relayer, so it's easier to use the frontend Admin page
 * (which is owner-protected) or use browser console with FHEVM initialized.
 */

import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

const CHAOS_ENGINE_ADDRESS = '0x66561a3e849ABEd61cAE6c9e5614D7444a3ad674';
const FHE_CHAOS_ENGINE_ABI = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../artifacts/contracts/FHEChaosEngine.sol/FHEChaosEngine.json'), 'utf8')
).abi;

async function checkMasterSeedStatus() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY not found in .env file');
  }

  const provider = new ethers.JsonRpcProvider(
    process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/' + (process.env.INFURA_API_KEY || '')
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log('Checking master seed status...');
  console.log('Wallet address:', wallet.address);
  console.log('Contract address:', CHAOS_ENGINE_ADDRESS);

  const chaosEngine = new ethers.Contract(
    CHAOS_ENGINE_ADDRESS,
    FHE_CHAOS_ENGINE_ABI,
    wallet
  );

  const isInitialized = await chaosEngine.isMasterSeedInitialized();
  console.log('\nMaster seed initialized:', isInitialized);

  if (!isInitialized) {
    console.log('\n⚠️  Master seed is NOT initialized.');
    console.log('\nTo initialize:');
    console.log('1. Use the Admin page (owner only): http://localhost:3000/admin');
    console.log('2. Or use browser console with FHEVM initialized');
    console.log('3. Or use a script that can interact with FHEVM relayer');
    console.log('\nNote: FHEVM requires browser environment for encryption.');
  } else {
    console.log('\n✅ Master seed is already initialized!');
  }
}

checkMasterSeedStatus()
  .then(() => {
    console.log('\n✅ Check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });

