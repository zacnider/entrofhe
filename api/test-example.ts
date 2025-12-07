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

  const { examplePath } = req.body;

  if (!examplePath) {
    return res.status(400).json({ error: 'examplePath is required' });
  }

  // Security: Validate examplePath to prevent path traversal
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
    let installOutput = '';
    
    if (!fs.existsSync(nodeModulesPath)) {
      // Install dependencies on first use
      console.log(`Installing dependencies for ${examplePath}... This may take 2-3 minutes on first use.`);
      
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
        
        const installResult = await execAsync('npm install --legacy-peer-deps --cache /tmp/.npm', {
          cwd: exampleDir,
          env,
          timeout: 300000, // 5 minutes for install
          maxBuffer: 10 * 1024 * 1024,
        });
        console.log(`Dependencies installed successfully for ${examplePath}. Running tests...`);
        
        // Verify hardhat is installed locally
        const hardhatPath = path.join(exampleDir, 'node_modules', '.bin', 'hardhat');
        const nodeModulesPath = path.join(exampleDir, 'node_modules');
        const hardhatPackagePath = path.join(exampleDir, 'node_modules', 'hardhat');
        
        console.log('Checking installation...');
        console.log('node_modules exists:', fs.existsSync(nodeModulesPath));
        console.log('hardhat package exists:', fs.existsSync(hardhatPackagePath));
        console.log('hardhat binary exists:', fs.existsSync(hardhatPath));
        
        if (!fs.existsSync(nodeModulesPath)) {
          return res.status(500).json({
            success: false,
            error: 'node_modules directory not created after installation',
            stdout: installResult.stdout || '',
            stderr: installResult.stderr || '',
          });
        }
        
        if (!fs.existsSync(hardhatPath)) {
          // Try to list what's in node_modules/.bin
          const binDir = path.join(exampleDir, 'node_modules', '.bin');
          let binContents = 'Directory does not exist';
          if (fs.existsSync(binDir)) {
            try {
              binContents = fs.readdirSync(binDir).join(', ');
            } catch (e) {
              binContents = `Error reading directory: ${e}`;
            }
          }
          
          return res.status(500).json({
            success: false,
            error: `Hardhat not found in node_modules/.bin after installation. Contents: ${binContents}`,
            stdout: installResult.stdout || '',
            stderr: installResult.stderr || '',
            debug: {
              nodeModulesExists: fs.existsSync(nodeModulesPath),
              hardhatPackageExists: fs.existsSync(hardhatPackagePath),
              hardhatBinaryExists: fs.existsSync(hardhatPath),
              binContents,
            },
          });
        }
        
        // Include install output in response
        installOutput = [
          'Installing dependencies... This may take 2-3 minutes on first use.\n',
          installResult.stdout || '',
          installResult.stderr || '',
          'Dependencies installed successfully. Running tests...\n\n',
        ].filter(Boolean).join('\n');
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
    
    // Note: Type generation happens automatically during hardhat test
    // No need to pre-generate types - hardhat compile runs as part of test execution
    // Use local hardhat installation instead of npx to avoid global installation issues
    // Set environment variables to use /tmp for npm cache and logs
    const env = {
      ...process.env,
      HOME: '/tmp',
      npm_config_cache: '/tmp/.npm',
    };
    
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
    
    // Use local hardhat installation
    const { stdout, stderr } = await execAsync(`node "${hardhatPath}" test`, {
      cwd: exampleDir,
      env,
      timeout: 60000, // 60 seconds timeout
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    return res.status(200).json({
      success: true,
      stdout: installOutput + stdout,
      stderr,
    });
  } catch (error: any) {
    console.error('Error in test-example:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
      stdout: error.stdout || '',
      stderr: error.stderr || '',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

