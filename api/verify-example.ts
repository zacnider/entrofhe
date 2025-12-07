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

  const { examplePath, contractAddress, network = 'sepolia', constructorArgs } = req.body;

  if (!examplePath || !contractAddress) {
    return res.status(400).json({ error: 'examplePath and contractAddress are required' });
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
      path.join(rootDir, 'frontend', 'build', 'examples', examplePath), // Build output (if copied)
      path.join(rootDir, '..', 'frontend', 'build', 'examples', examplePath), // One level up from build
      path.join('/var/task', 'examples', examplePath), // Vercel default
      path.join('/var/task', 'frontend', 'build', 'examples', examplePath), // Vercel build output
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
    
    // Check if hardhat exists in node_modules
    const hardhatPath = path.join(exampleDir, 'node_modules', '.bin', 'hardhat');
    if (!fs.existsSync(hardhatPath)) {
      return res.status(500).json({
        success: false,
        error: 'Hardhat not found in node_modules. Please install dependencies first.',
        stdout: '',
        stderr: '',
      });
    }
    
    // Build verify command using local hardhat
    let verifyArgs = `verify --network ${network} ${contractAddress}`;
    if (constructorArgs && constructorArgs.length > 0) {
      verifyArgs += ` ${constructorArgs.join(' ')}`;
    }
    const verifyCmd = `node "${hardhatPath}" ${verifyArgs}`;

    // Set environment variables to use /tmp for npm cache and logs
    const env = {
      ...process.env,
      HOME: '/tmp',
      npm_config_cache: '/tmp/.npm',
    };

    const { stdout, stderr } = await execAsync(verifyCmd, {
      cwd: exampleDir,
      env,
      timeout: 120000, // 2 minutes timeout
      maxBuffer: 10 * 1024 * 1024,
    });

    return res.status(200).json({
      success: true,
      stdout,
      stderr,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
      stdout: error.stdout || '',
      stderr: error.stderr || '',
    });
  }
}

