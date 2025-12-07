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

  const { examplePath } = req.body;

  if (!examplePath) {
    return res.status(400).json({ error: 'examplePath is required' });
  }

  // Security: Validate examplePath to prevent path traversal
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
        const installOutputCheck = (installResult.stdout || '') + (installResult.stderr || '');
        if (installOutputCheck.includes('npm ERR') || installOutputCheck.includes('Error:')) {
          return res.status(500).json({
            success: false,
            error: 'npm install failed',
            stdout: installResult.stdout || '',
            stderr: installResult.stderr || '',
            installOutput: installOutputCheck,
          });
        }
        
        // Wait a bit for file system to sync
        await new Promise(resolve => setTimeout(resolve, 2000)); // Increased wait time
        
        // Verify hardhat is installed locally (nodeModulesPath already defined above)
        const hardhatPackagePath = path.join(exampleDir, 'node_modules', 'hardhat');
        const hardhatPath = path.join(exampleDir, 'node_modules', '.bin', 'hardhat');
        
        console.log('Checking installation...');
        console.log('node_modules exists:', fs.existsSync(nodeModulesPath));
        console.log('hardhat package exists:', fs.existsSync(hardhatPackagePath));
        console.log('hardhat binary exists:', fs.existsSync(hardhatPath));
        
        // List node_modules contents for debugging
        if (fs.existsSync(nodeModulesPath)) {
          try {
            const nodeModulesContents = fs.readdirSync(nodeModulesPath).slice(0, 20); // First 20 items
            console.log('node_modules contents (first 20):', nodeModulesContents);
          } catch (e) {
            console.log('Could not read node_modules directory:', e);
          }
        }
        
        if (!fs.existsSync(nodeModulesPath)) {
          return res.status(500).json({
            success: false,
            error: 'node_modules directory not created after installation',
            stdout: installResult.stdout || '',
            stderr: installResult.stderr || '',
            installOutput: installOutputCheck,
          });
        }
        
        // Check if hardhat package exists (even if binary doesn't)
        if (!fs.existsSync(hardhatPackagePath)) {
          console.log('Hardhat package not found in node_modules. Installation may have failed.');
          return res.status(500).json({
            success: false,
            error: 'Hardhat package not found after installation. npm install may have failed.',
            stdout: installResult.stdout || '',
            stderr: installResult.stderr || '',
            installOutput: installOutputCheck,
            debug: {
              nodeModulesExists: fs.existsSync(nodeModulesPath),
              hardhatPackageExists: fs.existsSync(hardhatPackagePath),
              hardhatBinaryExists: fs.existsSync(hardhatPath),
            },
          });
        }
        
        // If hardhat binary doesn't exist, we'll use the package directly
        if (!fs.existsSync(hardhatPath)) {
          console.log('Hardhat binary not found in .bin, but package exists. Will use package directly.');
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
    
    // Check if hardhat exists in node_modules (nodeModulesPath already defined above at line 104)
    const hardhatPath = path.join(exampleDir, 'node_modules', '.bin', 'hardhat');
    
    // Use hardhat directly instead of npm run to avoid cross-env dependency
    let testCmd: string;
    if (fs.existsSync(hardhatPath)) {
      testCmd = `node "${hardhatPath}" test`;
    } else if (fs.existsSync(nodeModulesPath)) {
      // Try to find hardhat in node_modules/hardhat directly
      const hardhatPackagePath = path.join(exampleDir, 'node_modules', 'hardhat');
      if (fs.existsSync(hardhatPackagePath)) {
        // Use hardhat directly
        testCmd = 'node node_modules/hardhat/internal/cli/cli.js test';
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
    
    console.log('Running test command:', testCmd);
    const testEnv = {
      ...env,
      TS_NODE_TRANSPILE_ONLY: 'true', // Add this for TypeScript compilation
    };
    const { stdout, stderr } = await execAsync(testCmd, {
      cwd: exampleDir,
      env: testEnv,
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

