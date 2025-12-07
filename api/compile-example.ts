// Vercel automatically provides these types at runtime
// Using inline types to avoid build-time dependency issues
type VercelRequest = {
  method?: string;
  body?: any;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
};
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { examplePath, contractName } = req.body;

  if (!examplePath) {
    return res.status(400).json({ error: 'examplePath is required' });
  }

  // Security: Validate examplePath
  if (examplePath.includes('..') || examplePath.includes('/')) {
    return res.status(400).json({ error: 'Invalid example path' });
  }

  try {
    // Path to example directory (relative to project root)
    // In Vercel, process.cwd() might be /var/task or /vercel/path0
    // When outputDirectory is used, we need to check multiple possible locations
    const rootDir = process.cwd();
    const possiblePaths = [
      path.join(rootDir, 'examples', examplePath), // Root level
      path.join(rootDir, '..', 'examples', examplePath), // One level up
      path.join(rootDir, '../..', 'examples', examplePath), // Two levels up
      path.join('/var/task', 'examples', examplePath), // Vercel default
      path.join('/vercel/path0', 'examples', examplePath), // Vercel build path
    ];

    let exampleDir = null;
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        exampleDir = possiblePath;
        break;
      }
    }

    // Debug: Log paths for troubleshooting
    console.log('Root directory:', rootDir);
    console.log('Possible paths checked:', possiblePaths);
    console.log('Example directory found:', exampleDir);

    // Check if example directory exists
    if (!exampleDir || !fs.existsSync(exampleDir)) {
      return res.status(404).json({
        success: false,
        error: `Example directory not found: ${examplePath}`,
        debug: {
          rootDir,
          examplePath,
          possiblePaths,
          exampleDir,
        },
      });
    }

    // Install dependencies if not already installed (runtime installation)
    const nodeModulesPath = path.join(exampleDir, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      // Install dependencies on first use
      try {
        await execAsync('npm install --legacy-peer-deps', {
          cwd: exampleDir,
          timeout: 300000, // 5 minutes for install
          maxBuffer: 10 * 1024 * 1024,
        });
      } catch (installError: any) {
        return res.status(500).json({
          success: false,
          error: `Failed to install dependencies: ${installError.message}`,
          stdout: installError.stdout || '',
          stderr: installError.stderr || '',
        });
      }
    }

    // Compile contracts using npx (this also generates types)
    const { stdout, stderr } = await execAsync('npx hardhat compile', {
      cwd: exampleDir,
      timeout: 120000, // 2 minutes timeout
      maxBuffer: 10 * 1024 * 1024,
    });

    // Try to find contract artifact if contractName is provided
    let bytecode = null;
    let abi = null;
    
    if (contractName) {
      // Find the main contract artifact (usually in artifacts/contracts/)
      const artifactsDir = path.join(exampleDir, 'artifacts', 'contracts');
      
      // Try to find the contract artifact
      const contractFiles = findContractArtifacts(artifactsDir, contractName);
      
      if (contractFiles.length > 0) {
        const artifactPath = contractFiles[0];
        const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf-8'));
        bytecode = artifact.bytecode;
        abi = artifact.abi;
      }
    }

    return res.status(200).json({
      success: true,
      stdout,
      stderr,
      bytecode,
      abi,
    });
  } catch (error: any) {
    console.error('Error in compile-example:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
      stdout: error.stdout || '',
      stderr: error.stderr || '',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

function findContractArtifacts(dir: string, contractName: string): string[] {
  const results: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Check if directory name matches contract file (e.g., "EntropyCounter.sol")
      const dirName = file;
      const contractFile = path.join(filePath, `${contractName}.json`);
      if (fs.existsSync(contractFile)) {
        results.push(contractFile);
      }
      // Also search recursively
      results.push(...findContractArtifacts(filePath, contractName));
    } else if (file === `${contractName}.json`) {
      results.push(filePath);
    }
  }
  
  return results;
}

