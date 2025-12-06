import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { initSDK, createInstance, type FhevmInstance, SepoliaConfig } from '@zama-fhe/relayer-sdk/web';

interface EncryptedInput {
  handles: Uint8Array[];
  inputProof: Uint8Array;
}

interface FHEVMHook {
  encrypt64: (value: bigint, contractAddress: string, userAddress: string) => Promise<EncryptedInput>;
  decrypt64: (contractAddress: string, encryptedValue: string) => Promise<bigint>;
  isReady: boolean;
  error: string | null;
  instance: FhevmInstance | null;
}

export const useFHEVM = (): FHEVMHook => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [instance, setInstance] = useState<FhevmInstance | null>(null);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const initializeFHEVM = async () => {
      if (!isConnected || !address) {
        setIsReady(false);
        return;
      }

      try {
        // Get EIP1193 provider
        let ethereumProvider: any = null;
        
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          ethereumProvider = (window as any).ethereum;
        }

        if (!ethereumProvider) {
          setError('No Ethereum provider found');
          setIsReady(false);
          return;
        }

        // Initialize SDK
        await initSDK();

        // Get network info
        const chainId = await ethereumProvider.request({ method: 'eth_chainId' });
        const chainIdNumber = parseInt(chainId, 16);

        if (chainIdNumber !== 11155111) {
          setError('Please switch to Sepolia network (Chain ID: 11155111)');
          setIsReady(false);
          return;
        }

        // Create FHEVM instance
        const config = {
          ...SepoliaConfig,
          chainId: chainIdNumber,
          network: ethereumProvider,
        };

        const fhevmInstance = await createInstance(config);
        setInstance(fhevmInstance);
        setIsReady(true);
        setError(null);
      } catch (err: any) {
        console.error('FHEVM initialization error:', err);
        setError(err.message || 'Failed to initialize FHEVM');
        setIsReady(false);
      }
    };

    initializeFHEVM();
  }, [isConnected, address]);

  const encrypt64 = useCallback(async (
    value: bigint,
    contractAddress: string,
    userAddress: string
  ): Promise<EncryptedInput> => {
    if (!instance || !isReady) {
      throw new Error('FHEVM is not ready');
    }

    try {
      const encryptedInput = await instance
        .createEncryptedInput(contractAddress, userAddress)
        .add64(Number(value))
        .encrypt();

      return {
        handles: encryptedInput.handles,
        inputProof: encryptedInput.inputProof,
      };
    } catch (err: any) {
      console.error('Error encrypting value:', err);
      throw new Error('Failed to encrypt value: ' + err.message);
    }
  }, [instance, isReady]);

  const decrypt64 = useCallback(async (
    contractAddress: string,
    encryptedValue: string
  ): Promise<bigint> => {
    if (!instance || !isReady) {
      throw new Error('FHEVM is not ready');
    }

    try {
      // Note: FHEVM SDK's publicDecrypt API may vary
      // For now, this is a placeholder that will need to be updated based on actual SDK API
      // The encryptedValue should be the handle from the contract
      // The contract must have called makePubliclyDecryptable for this to work
      
      // TODO: Update this based on actual FHEVM SDK publicDecrypt API
      // For now, return a placeholder value
      throw new Error('Decrypt functionality not yet implemented. Please use requestId-based trait selection.');
    } catch (err: any) {
      console.error('Error decrypting value:', err);
      throw new Error('Failed to decrypt value: ' + err.message);
    }
  }, [instance, isReady]);

  return {
    encrypt64,
    decrypt64,
    isReady,
    error,
    instance,
  };
};

