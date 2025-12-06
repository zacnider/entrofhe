import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { bytesToHex } from 'viem';
import { toast } from 'react-toastify';
import FHEChaosEngineABI from '../abis/FHEChaosEngine.json';
import { useFHEVM } from '../hooks/useFHEVM';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

const CHAOS_ENGINE_ADDRESS = process.env.REACT_APP_CHAOS_ENGINE_ADDRESS || '0xAC447CC1932FB1B7030EB79C0dfb3ea5A5378020';
const OWNER_ADDRESS = '0xa2cD33E6E81595FbE8CEf825ABc1550416829e8F'; // Contract owner

// Debug: Log the address being used
if (typeof window !== 'undefined') {
  console.log('🔍 Admin page - CHAOS_ENGINE_ADDRESS:', CHAOS_ENGINE_ADDRESS);
  console.log('🔍 Admin page - ENV variable:', process.env.REACT_APP_CHAOS_ENGINE_ADDRESS);
}

const Admin: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { encrypt64, isReady: fhevmReady } = useFHEVM();
  const [seedValue, setSeedValue] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Check if user is owner
  const { data: contractOwner } = useReadContract({
    address: CHAOS_ENGINE_ADDRESS as `0x${string}`,
    abi: FHEChaosEngineABI.abi,
    functionName: 'owner',
  });

  // Check if master seed is already initialized
  const { data: isMasterSeedInitialized } = useReadContract({
    address: CHAOS_ENGINE_ADDRESS as `0x${string}`,
    abi: FHEChaosEngineABI.abi,
    functionName: 'isMasterSeedInitialized',
  });

  useEffect(() => {
    if (address && contractOwner) {
      const userIsOwner = address.toLowerCase() === (contractOwner as string).toLowerCase();
      setIsOwner(userIsOwner);
      if (!userIsOwner) {
        toast.warning('Only contract owner can access this page');
      }
    }
  }, [address, contractOwner]);

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { 
    isLoading: isConfirming, 
    isSuccess, 
    isError: receiptError,
    error: receiptErrorDetails 
  } = useWaitForTransactionReceipt({
    hash,
  });

  const handleInitializeMasterSeed = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!fhevmReady) {
      toast.error('FHEVM is not ready. Please wait...');
      return;
    }

    try {
      setIsInitializing(true);

      // Generate random seed if not provided
      const seed = seedValue ? BigInt(seedValue) : BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));

      // Encrypt seed using FHEVM
      toast.info('Encrypting seed...');
      const encryptedInput = await encrypt64(seed, CHAOS_ENGINE_ADDRESS, address);

      console.log('Encrypted input:', {
        handlesLength: encryptedInput.handles.length,
        handles0Length: encryptedInput.handles[0]?.length,
        proofLength: encryptedInput.inputProof.length
      });

      // Convert Uint8Array to hex strings for wagmi
      const handleHex = bytesToHex(encryptedInput.handles[0]);
      const proofHex = bytesToHex(encryptedInput.inputProof);

      console.log('Hex values:', {
        handleHexLength: handleHex.length,
        proofHexLength: proofHex.length,
        handleHex: handleHex.substring(0, 20) + '...',
        proofHex: proofHex.substring(0, 20) + '...'
      });

      // Check if already initialized before sending transaction
      // Note: This check uses the current CHAOS_ENGINE_ADDRESS
      console.log('🔍 Checking master seed status for:', CHAOS_ENGINE_ADDRESS);
      console.log('🔍 isMasterSeedInitialized:', isMasterSeedInitialized);
      if (isMasterSeedInitialized) {
        toast.warning(`Master seed is already initialized for contract ${CHAOS_ENGINE_ADDRESS}!`);
        setIsInitializing(false);
        return;
      }

      // Call contract - this will trigger wallet confirmation
      toast.info('Please confirm transaction in your wallet...');
      writeContract({
        address: CHAOS_ENGINE_ADDRESS as `0x${string}`,
        abi: FHEChaosEngineABI.abi,
        functionName: 'initializeMasterSeed',
        args: [handleHex, proofHex],
      });
    } catch (error: any) {
      console.error('Initialize error:', error);
      toast.error(`Error: ${error.message || 'Failed to initialize'}`);
      setIsInitializing(false);
    }
  };

  // Handle transaction hash (wallet confirmation)
  useEffect(() => {
    if (hash) {
      toast.info('Transaction submitted! Waiting for confirmation...');
      setIsInitializing(false); // Reset button state, but keep waiting for confirmation
    }
  }, [hash]);

  // Handle transaction errors
  useEffect(() => {
    if (writeError) {
      console.error('Write error:', writeError);
      const errorMessage = (writeError as any)?.message || (writeError as any)?.shortMessage || 'Transaction failed';
      toast.error(`Transaction failed: ${errorMessage}`);
      setIsInitializing(false);
    }
    if (receiptError && hash) {
      console.error('Receipt error:', receiptError);
      console.error('Receipt error details:', receiptErrorDetails);
      const errorMessage = (receiptErrorDetails as any)?.message || (receiptErrorDetails as any)?.shortMessage || 'Transaction reverted';
      toast.error(`Transaction failed: ${errorMessage}`);
      toast.info(`Check transaction on Etherscan: https://sepolia.etherscan.io/tx/${hash}`);
      setIsInitializing(false);
    }
  }, [writeError, receiptError, receiptErrorDetails, hash]);

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess && hash) {
      toast.success('Master seed initialized successfully!');
      setIsInitializing(false);
      setSeedValue('');
    }
  }, [isSuccess, hash]);

  const generateRandomSeed = () => {
    const random = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    setSeedValue(random.toString());
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 border border-gray-200 dark:border-slate-700">
          <h2 className="text-3xl font-bold text-primary-900 dark:text-slate-100 mb-4">
            Admin Panel
          </h2>
          <p className="text-lg text-primary-600 dark:text-slate-400 mb-8">
            Connect your wallet to access admin functions
          </p>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 border border-gray-200 dark:border-slate-700">
          <ShieldExclamationIcon className="h-20 w-20 text-red-500 dark:text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-primary-900 dark:text-slate-100 mb-4">
            Access Denied
          </h2>
          <p className="text-lg text-primary-600 dark:text-slate-400 mb-6">
            This page is only accessible to the contract owner.
          </p>
          <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4 space-y-2 text-left">
            <p className="text-sm text-primary-700 dark:text-slate-300">
              <span className="font-semibold">Owner address:</span>{' '}
              <span className="font-mono text-xs">{OWNER_ADDRESS}</span>
            </p>
            <p className="text-sm text-primary-700 dark:text-slate-300">
              <span className="font-semibold">Your address:</span>{' '}
              <span className="font-mono text-xs">{address}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-slate-700">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary-900 dark:text-slate-100 mb-2">
            Initialize Master Seed
          </h2>
          <p className="text-primary-600 dark:text-slate-400">
            Initialize the master seed for FHEChaosEngine. This can only be done once by the contract owner.
          </p>
        </div>

        <div className="space-y-6">
          {/* Debug Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-xs font-mono text-blue-800 dark:text-blue-200 mb-2">
              <strong>Contract Address:</strong> {CHAOS_ENGINE_ADDRESS}
            </p>
            <p className="text-xs font-mono text-blue-800 dark:text-blue-200 mb-2">
              <strong>Master Seed Status:</strong> {isMasterSeedInitialized === undefined ? 'Loading...' : isMasterSeedInitialized ? '✅ Initialized' : '❌ Not Initialized'}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              If you see "already initialized" but this shows "Not Initialized", clear browser cache and restart frontend.
            </p>
          </div>

          <div>
            <label htmlFor="seed" className="block text-sm font-medium text-primary-700 dark:text-slate-300 mb-2">
              Seed Value (optional - random will be generated if empty)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="seed"
                value={seedValue}
                onChange={(e) => setSeedValue(e.target.value)}
                placeholder="Enter seed value or leave empty for random"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-cyan-500 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={generateRandomSeed}
                className="px-4 py-3 bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-cyan-400 rounded-lg hover:bg-primary-200 dark:hover:bg-slate-600 transition font-medium"
              >
                Random
              </button>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              ⚠️ <strong>Warning:</strong> This operation can only be performed once. Make sure you are the contract owner.
            </p>
          </div>

          <button
            onClick={handleInitializeMasterSeed}
            disabled={isPending || isConfirming || isInitializing || !fhevmReady}
            className="w-full px-6 py-3 bg-primary-600 dark:bg-cyan-600 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-cyan-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition font-medium shadow-md hover:shadow-lg"
          >
            {isPending || isConfirming || isInitializing
              ? 'Initializing...'
              : !fhevmReady
              ? 'Waiting for FHEVM...'
              : 'Initialize Master Seed'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;

