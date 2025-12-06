# Frontend Troubleshooting

## process/browser Errors

If you see `process/browser` errors in the console, these are usually warnings and don't prevent the app from running. However, if they block compilation:

### Solution 1: Ignore the warnings
The app should still work despite these warnings. They're related to ESM module resolution in webpack.

### Solution 2: Use alternative wallet connection
If the errors persist, you can temporarily remove RainbowKit and use only wagmi's ConnectButton:

```typescript
// In src/index.tsx, remove RainbowKitProvider
// Use only wagmi's ConnectButton directly
```

### Solution 3: Update dependencies
```bash
npm update @rainbow-me/rainbowkit wagmi viem --legacy-peer-deps
```

## Master Seed Initialization

### Using Admin Page (Recommended)
1. Go to http://localhost:3000/admin
2. Connect wallet (must be contract owner)
3. Enter seed value or leave empty for random
4. Click "Initialize Master Seed"
5. Approve transaction in wallet

### Using Browser Console
1. Open browser console (F12)
2. Make sure FHEVM is initialized
3. Run:
```javascript
const seedValue = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
const encryptedSeed = await fhevmInstance
  .createEncryptedInput('0xAC447CC1932FB1B7030EB79C0dfb3ea5A5378020', userAddress)
  .add64(seedValue)
  .encrypt();

// Get contract instance
const chaosEngine = new ethers.Contract(
  '0xAC447CC1932FB1B7030EB79C0dfb3ea5A5378020',
  FHEChaosEngineABI,
  signer
);

await chaosEngine.initializeMasterSeed(
  encryptedSeed.handles[0],
  encryptedSeed.inputProof
);
```

## Common Issues

### FHEVM not initializing
- Make sure you're on Sepolia network (Chain ID: 11155111)
- Check browser console for FHEVM errors
- Reload the page

### Transaction fails
- Check you have enough ETH for gas
- Verify you're the contract owner
- Check if master seed is already initialized

### Frontend won't compile
- Delete `node_modules` and `package-lock.json`
- Run `npm install --legacy-peer-deps`
- Clear browser cache
- Restart dev server

