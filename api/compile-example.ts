// Vercel automatically provides these types at runtime
// Using inline types to avoid build-time dependency issues
type VercelRequest = {
  method?: string;
  body?: any;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (data: any) => VercelResponse;
  send: (data: string) => VercelResponse;
};
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

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

  let exampleDir: string | null = null;
  
  try {
    // Always use /tmp for examples in Vercel serverless functions
    // This ensures we have a writable directory
    const tmpExamplesDir = '/tmp/examples';
    const tmpExampleDir = path.join(tmpExamplesDir, examplePath);
    exampleDir = tmpExampleDir;

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
        
        console.log('Starting npm install...');
        const installResult = await execAsync('npm install --legacy-peer-deps --cache /tmp/.npm 2>&1', {
          cwd: exampleDir,
          env,
          timeout: 300000, // 5 minutes for install
          maxBuffer: 10 * 1024 * 1024,
        });
        
        console.log('npm install completed');
        console.log('Install stdout length:', (installResult.stdout || '').length);
        console.log('Install stderr length:', (installResult.stderr || '').length);
        
        // Check if npm install actually succeeded
        const installOutput = (installResult.stdout || '') + (installResult.stderr || '');
        if (installOutput.includes('npm ERR') || installOutput.includes('Error:')) {
          return res.status(500).json({
            success: false,
            error: 'npm install failed',
            stdout: installResult.stdout || '',
            stderr: installResult.stderr || '',
            installOutput,
          });
        }
        
        // Wait a bit for file system to sync
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verify node_modules exists (nodeModulesPath already defined above)
        if (!fs.existsSync(nodeModulesPath)) {
          return res.status(500).json({
            success: false,
            error: 'node_modules directory not created after installation',
            stdout: installResult.stdout || '',
            stderr: installResult.stderr || '',
            installOutput,
          });
        }
        
        console.log('node_modules exists, installation successful');
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
    
    // Check if node_modules exists
    const hardhatPath = path.join(exampleDir, 'node_modules', '.bin', 'hardhat');
    const nodeModulesCheckPath = path.join(exampleDir, 'node_modules');
    
    // Use hardhat directly instead of npm run to avoid cross-env dependency
    let compileCmd: string;
    if (fs.existsSync(hardhatPath)) {
      compileCmd = `node "${hardhatPath}" compile`;
    } else if (fs.existsSync(nodeModulesCheckPath)) {
      // Try to find hardhat in node_modules/hardhat directly
      const hardhatPackagePath = path.join(exampleDir, 'node_modules', 'hardhat');
      if (fs.existsSync(hardhatPackagePath)) {
        // Use hardhat directly with TS_NODE_TRANSPILE_ONLY env var
        compileCmd = 'TS_NODE_TRANSPILE_ONLY=true node node_modules/hardhat/internal/cli/cli.js compile';
      } else {
        return res.status(500).json({
          success: false,
          error: 'Hardhat not found in node_modules. Please install dependencies first.',
          stdout: '',
          stderr: '',
        });
      }
    } else {
      return res.status(500).json({
        success: false,
        error: 'node_modules not found. Please install dependencies first.',
        stdout: '',
        stderr: '',
      });
    }
    
    console.log('Running compile command:', compileCmd);
    const compileEnv = {
      ...env,
      TS_NODE_TRANSPILE_ONLY: 'true', // Add this for TypeScript compilation
    };
    const { stdout, stderr } = await execAsync(compileCmd, {
      cwd: exampleDir,
      env: compileEnv,
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
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    try {
      return res.status(500).json({
        success: false,
        error: error.message || 'Unknown error',
        stdout: error.stdout || '',
        stderr: error.stderr || '',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        details: {
          examplePath,
          exampleDir: exampleDir || 'not set',
          nodeModulesExists: exampleDir ? fs.existsSync(path.join(exampleDir, 'node_modules')) : false,
          errorType: error.name || 'Unknown',
        },
      });
    } catch (jsonError: any) {
      // If JSON response fails, send plain text
      console.error('Failed to send JSON response:', jsonError);
      return res.status(500).send(`Error: ${error.message || 'Unknown error'}`);
    }
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

