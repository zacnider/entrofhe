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

    // Use Vercel proxy (/api/*) which rewrites to backend server
    // This avoids Mixed Content issues (HTTPS -> HTTP)
    // Only use direct backend URL in local development (localhost)
    const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_BASE_URL = (isLocalDev && (process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_API_URL)) || '';
    const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/${endpoint}` : `/api/${endpoint}`;

    // Debug logging for verify requests
    if (endpoint === 'verify') {
      console.log('🔍 Frontend Verify Request:');
      console.log('  API_BASE_URL:', API_BASE_URL);
      console.log('  apiUrl:', apiUrl);
      console.log('  body:', JSON.stringify(body, null, 2));
      console.log('  constructorArgs:', body.constructorArgs);
      console.log('  constructorArgs type:', typeof body.constructorArgs, Array.isArray(body.constructorArgs));
    }

    try {
      const response = await fetch(apiUrl, {
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
    return callAPI('test', { examplePath });
  };

  const compileExample = async (examplePath: string, contractName?: string) => {
    return callAPI('compile', { examplePath, contractName });
  };

  const deployExample = async (examplePath: string, network: string = 'sepolia', privateKey: string) => {
    return callAPI('deploy', { examplePath, network, privateKey });
  };

  const verifyExample = async (examplePath: string, contractAddress: string, network: string = 'sepolia', constructorArgs?: string[]) => {
    return callAPI('verify', { examplePath, contractAddress, network, constructorArgs });
  };

  return {
    loading,
    output,
    error,
    testExample,
    compileExample,
    deployExample,
    verifyExample,
    // Expose setter so callers (e.g., wallet deploy flow) can push log lines
    setOutput,
    clearOutput: () => {
      setOutput('');
      setError(null);
    },
  };
};

