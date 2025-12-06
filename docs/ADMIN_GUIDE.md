# Admin Guide - Master Seed Initialization

## Who Can Initialize Master Seed?

**Only the contract owner** can initialize the master seed. This is a **one-time operation** that must be done after deployment.

**Owner Address**: `0xa2cD33E6E81595FbE8CEf825ABc1550416829e8F`

## Why Owner-Only?

- Master seed is the **secret foundation** of the entropy system
- If anyone could initialize it, they could compromise security
- Owner-only ensures only trusted initialization
- One-time operation prevents accidental re-initialization

## How to Initialize

### Option 1: Frontend Admin Page (Recommended)

1. **Connect owner wallet** to frontend
2. Go to `/admin` page
3. The page will only show if you're the owner
4. Enter seed value (or leave empty for random)
5. Click "Initialize Master Seed"
6. Approve transaction in wallet

### Option 2: Browser Console

1. Open frontend in browser
2. Connect owner wallet
3. Open browser console (F12)
4. Wait for FHEVM to initialize
5. Run:

```javascript
// Generate random seed
const seedValue = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

// Encrypt using FHEVM (must be initialized)
const encryptedSeed = await fhevmInstance
  .createEncryptedInput('0xAC447CC1932FB1B7030EB79C0dfb3ea5A5378020', userAddress)
  .add64(seedValue)
  .encrypt();

// Get contract instance
const { ethers } = await import('ethers');
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const chaosEngine = new ethers.Contract(
  '0xAC447CC1932FB1B7030EB79C0dfb3ea5A5378020',
  FHEChaosEngineABI,
  signer
);

// Initialize
await chaosEngine.initializeMasterSeed(
  encryptedSeed.handles[0],
  encryptedSeed.inputProof
);
```

### Option 3: Check Status

```bash
npm run check:master-seed
```

This will check if master seed is initialized (doesn't initialize it).

## Security Notes

- ✅ Admin page is **owner-protected** (only owner can see/use it)
- ✅ Master seed can only be initialized **once**
- ✅ Master seed is **encrypted** (never exposed)
- ✅ Only owner wallet can access admin functions

## After Initialization

Once master seed is initialized:
- ✅ All developers can use Entrofhe
- ✅ No need to initialize again
- ✅ System is ready for entropy requests

## Troubleshooting

**"Access Denied" on Admin page?**
- Make sure you're connected with owner wallet
- Owner address: `0xa2cD33E6E81595FbE8CEf825ABc1550416829e8F`

**"Master seed already initialized"?**
- Good! System is ready to use
- No action needed

**Transaction fails?**
- Check you have enough ETH for gas
- Verify you're on Sepolia network
- Make sure FHEVM is initialized (for frontend method)

