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

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      let data: any;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // If not JSON, read as text
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          // If parsing fails, treat as error message
          throw new Error(text || 'API request failed');
        }
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
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

