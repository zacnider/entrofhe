import { useState } from 'react';

interface APIResponse {
  success: boolean;
  stdout?: string;
  stderr?: string;
  error?: string;
  contractAddress?: string;
  bytecode?: string;
  abi?: any[];
}

export const useExampleAPI = () => {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const callAPI = async (endpoint: string, body: any): Promise<APIResponse> => {
    setLoading(true);
    setError(null);
    setOutput('');

    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      // Combine stdout and stderr for display
      const combinedOutput = [
        data.stdout || '',
        data.stderr || '',
      ].filter(Boolean).join('\n');

      setOutput(combinedOutput);

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      setOutput(err.stdout || err.stderr || errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const testExample = async (examplePath: string) => {
    return callAPI('test-example', { examplePath });
  };

  const compileExample = async (examplePath: string, contractName?: string) => {
    return callAPI('compile-example', { examplePath, contractName });
  };

  const deployExample = async (examplePath: string, network: string = 'sepolia', privateKey: string) => {
    return callAPI('deploy-example', { examplePath, network, privateKey });
  };

  const verifyExample = async (examplePath: string, contractAddress: string, network: string = 'sepolia', constructorArgs?: string[]) => {
    return callAPI('verify-example', { examplePath, contractAddress, network, constructorArgs });
  };

  return {
    loading,
    output,
    error,
    testExample,
    compileExample,
    deployExample,
    verifyExample,
    clearOutput: () => {
      setOutput('');
      setError(null);
    },
  };
};

