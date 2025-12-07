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
    // Always use /tmp for examples in Vercel serverless functions
    // This ensures we have a writable directory
    const tmpExamplesDir = '/tmp/examples';
    const tmpExampleDir = path.join(tmpExamplesDir, examplePath);
    let exampleDir = tmpExampleDir;

    // Check if example already exists in /tmp
    if (!fs.existsSync(tmpExampleDir)) {
      // Try to find the source examples folder
      const rootDir = process.cwd();
      const sourcePaths = [
        path.join(rootDir, 'examples', examplePath),
        path.join(rootDir, '..', 'examples', examplePath),
        path.join(rootDir, '../..', 'examples', examplePath),
        path.join(rootDir, 'frontend', 'build', 'examples', examplePath),
        path.join('/var/task', 'examples', examplePath),
        path.join('/var/task', 'frontend', 'build', 'examples', examplePath),
        path.join('/vercel/path0', 'examples', examplePath),
      ];

      let sourceExampleDir = null;
      for (const sourcePath of sourcePaths) {
        if (fs.existsSync(sourcePath)) {
          sourceExampleDir = sourcePath;
          break;
        }
      }

      if (!sourceExampleDir) {
        return res.status(404).json({
          success: false,
          error: `Example directory not found: ${examplePath}`,
          debug: {
            rootDir,
            examplePath,
            sourcePaths,
          },
        });
      }

      // Copy example to /tmp
      console.log(`Copying example from ${sourceExampleDir} to ${tmpExampleDir}...`);
      try {
        // Create /tmp/examples directory
        fs.mkdirSync(tmpExamplesDir, { recursive: true });
        
        // Copy the example directory recursively
        await execAsync(`cp -r "${sourceExampleDir}" "${tmpExampleDir}"`, {
          timeout: 30000,
          maxBuffer: 10 * 1024 * 1024,
        });
        console.log('Example copied to /tmp successfully');
      } catch (copyError: any) {
        console.error('Failed to copy example to /tmp:', copyError);
        return res.status(500).json({
          success: false,
          error: `Failed to copy example folder: ${copyError.message}`,
        });
      }
    } else {
      console.log('Example already exists in /tmp, using cached version');
    }

    // Install dependencies if not already installed (runtime installation)
    const nodeModulesPath = path.join(exampleDir, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      // Install dependencies on first use
      
      // Ensure example directory exists and is writable
      if (!fs.existsSync(exampleDir)) {
        return res.status(404).json({
          success: false,
          error: `Example directory does not exist: ${exampleDir}`,
        });
      }
      
      // Create node_modules directory if it doesn't exist
      try {
        if (!fs.existsSync(nodeModulesPath)) {
          fs.mkdirSync(nodeModulesPath, { recursive: true });
        }
      } catch (mkdirError: any) {
        console.error('Failed to create node_modules directory:', mkdirError);
        return res.status(500).json({
          success: false,
          error: `Failed to create node_modules directory: ${mkdirError.message}`,
        });
      }
      
      try {
        // Create /tmp directories for npm
        fs.mkdirSync('/tmp/.npm', { recursive: true });
        
        // Set environment variables to use /tmp for npm cache and logs
        // Vercel serverless functions have read-only home directories
        const env = {
          ...process.env,
          HOME: '/tmp',
          npm_config_cache: '/tmp/.npm',
        };
        
        await execAsync('npm install --legacy-peer-deps --cache /tmp/.npm', {
          cwd: exampleDir,
          env,
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

    // Create /tmp directories for npm if not already created
    fs.mkdirSync('/tmp/.npm', { recursive: true });
    
    // Compile contracts using local hardhat installation
    // Set environment variables to use /tmp for npm cache and logs
    const env = {
      ...process.env,
      HOME: '/tmp',
      npm_config_cache: '/tmp/.npm',
    };
    
    // Check if hardhat exists in node_modules
    const hardhatPath = path.join(exampleDir, 'node_modules', '.bin', 'hardhat');
    const hardhatCmd = fs.existsSync(hardhatPath) 
      ? hardhatPath 
      : 'npx --yes hardhat';
    
    const { stdout, stderr } = await execAsync(`${hardhatCmd} compile`, {
      cwd: exampleDir,
      env,
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

