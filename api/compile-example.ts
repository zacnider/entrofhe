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

  // Backend server URL - must be set in Vercel environment variables
  const BACKEND_URL = process.env.BACKEND_API_URL;
  const API_KEY = process.env.BACKEND_API_KEY || '';
  
  if (!BACKEND_URL) {
    return res.status(500).json({
      success: false,
      error: 'Backend server URL not configured. Please set BACKEND_API_URL environment variable.',
    });
  }

  try {
    // Forward request to backend server
    const response = await fetch(`${BACKEND_URL}/api/compile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY && { 'X-API-Key': API_KEY }),
      },
      body: JSON.stringify({ examplePath, contractName }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error forwarding to backend:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to connect to backend server',
    });
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
        console.log('Working directory:', exampleDir);
        console.log('package.json exists:', fs.existsSync(path.join(exampleDir, 'package.json')));
        
        // Read package.json to verify it exists and has hardhat
        let packageJsonContent = '';
        try {
          packageJsonContent = fs.readFileSync(path.join(exampleDir, 'package.json'), 'utf-8');
          const packageJson = JSON.parse(packageJsonContent);
          console.log('package.json dependencies:', Object.keys(packageJson.dependencies || {}).slice(0, 10));
          console.log('package.json devDependencies:', Object.keys(packageJson.devDependencies || {}).slice(0, 10));
          if (!packageJson.dependencies?.hardhat && !packageJson.devDependencies?.hardhat) {
            console.log('WARNING: hardhat not found in package.json dependencies or devDependencies!');
          }
        } catch (e) {
          console.log('Could not read/parse package.json:', e);
        }
        
        const installResult = await execAsync('npm install --legacy-peer-deps --cache /tmp/.npm 2>&1', {
          cwd: exampleDir,
          env,
          timeout: 300000, // 5 minutes for install
          maxBuffer: 10 * 1024 * 1024,
        });
        
        console.log('npm install completed');
        console.log('Install stdout (first 500 chars):', (installResult.stdout || '').substring(0, 500));
        console.log('Install stderr (first 500 chars):', (installResult.stderr || '').substring(0, 500));
        console.log('Install stdout length:', (installResult.stdout || '').length);
        console.log('Install stderr length:', (installResult.stderr || '').length);
        
        // Check if npm install actually succeeded - be more lenient
        const installOutput = (installResult.stdout || '') + (installResult.stderr || '');
        
        // Log full output for debugging (first 2000 chars)
        console.log('npm install full output (first 2000 chars):', installOutput.substring(0, 2000));
        
        const hasErrors = installOutput.includes('npm ERR') && 
                         !installOutput.includes('npm ERR! peer dep missing'); // Ignore peer dep warnings
        
        // Check for success indicators
        const hasSuccess = installOutput.includes('added') || 
                          installOutput.includes('up to date') ||
                          installOutput.includes('packages in') ||
                          installOutput.includes('audited');
        
        // Only fail if there are actual errors AND no success indicators
        if (hasErrors && !hasSuccess) {
          console.log('npm install appears to have failed');
          return res.status(500).json({
            success: false,
            error: 'npm install failed',
            stdout: installResult.stdout?.substring(0, 2000) || '',
            stderr: installResult.stderr?.substring(0, 2000) || '',
            installOutput: installOutput.substring(0, 2000),
          });
        }
        
        console.log('npm install appears successful (hasSuccess:', hasSuccess, ', hasErrors:', hasErrors, ')');
        
        // Wait a bit for file system to sync
        await new Promise(resolve => setTimeout(resolve, 2000)); // Increased wait time
        
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
        
        // Verify hardhat is installed
        const hardhatPackagePath = path.join(exampleDir, 'node_modules', 'hardhat');
        const hardhatPath = path.join(exampleDir, 'node_modules', '.bin', 'hardhat');
        
        console.log('node_modules exists, checking Hardhat...');
        console.log('hardhat package exists:', fs.existsSync(hardhatPackagePath));
        console.log('hardhat binary exists:', fs.existsSync(hardhatPath));
        
        if (!fs.existsSync(hardhatPackagePath)) {
          console.log('Hardhat package not found in node_modules. Installation may have failed.');
          console.log('Full node_modules path:', nodeModulesPath);
          console.log('Hardhat package path:', hardhatPackagePath);
          
          // Try to find hardhat in a different location
          const alternativePaths = [
            path.join(exampleDir, 'node_modules', '@nomicfoundation', 'hardhat'),
            path.join(exampleDir, 'node_modules', 'hardhat', 'package.json'),
          ];
          
          for (const altPath of alternativePaths) {
            if (fs.existsSync(altPath)) {
              console.log('Found hardhat at alternative path:', altPath);
            }
          }
          
          // List all directories in node_modules to see what was actually installed
          if (fs.existsSync(nodeModulesPath)) {
            try {
              const allPackages = fs.readdirSync(nodeModulesPath);
              console.log('All packages in node_modules:', allPackages.slice(0, 30));
              const hardhatRelated = allPackages.filter(p => p.toLowerCase().includes('hardhat'));
              console.log('Hardhat-related packages:', hardhatRelated);
              
              // Check if hardhat is installed but in a different location
              if (hardhatRelated.length > 0) {
                console.log('Found hardhat-related packages, but not at expected path. Will try npx fallback.');
                // Don't return error, let npx handle it
              } else {
                // No hardhat at all - this is a real problem
                console.log('No hardhat-related packages found. npm install likely failed silently.');
                return res.status(500).json({
                  success: false,
                  error: 'Hardhat package not found after installation. npm install may have failed.',
                  stdout: installResult.stdout?.substring(0, 1000) || '',
                  stderr: installResult.stderr?.substring(0, 1000) || '',
                  installOutput: installOutput.substring(0, 2000),
                  debug: {
                    nodeModulesExists: fs.existsSync(nodeModulesPath),
                    hardhatPackageExists: fs.existsSync(hardhatPackagePath),
                    hardhatBinaryExists: fs.existsSync(hardhatPath),
                    exampleDir,
                    nodeModulesPath,
                    hardhatPackagePath,
                    allPackages: allPackages.slice(0, 20),
                  },
                });
              }
            } catch (e) {
              console.log('Could not list node_modules:', e);
              // If we can't list, assume it's there and let npx handle it
            }
          } else {
            // node_modules doesn't exist - this is a real problem
            return res.status(500).json({
              success: false,
              error: 'node_modules directory not created after installation.',
              stdout: installResult.stdout?.substring(0, 1000) || '',
              stderr: installResult.stderr?.substring(0, 1000) || '',
              installOutput: installOutput.substring(0, 2000),
            });
          }
        } else {
          console.log('Hardhat package found at:', hardhatPackagePath);
        }
        
        console.log('Installation successful');
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
      NODE_PATH: path.join(exampleDir, 'node_modules'), // Add node_modules to NODE_PATH
      TS_NODE_TRANSPILE_ONLY: 'true', // For TypeScript compilation
    };
    
    // Check if node_modules exists
    const hardhatPath = path.join(exampleDir, 'node_modules', '.bin', 'hardhat');
    const nodeModulesCheckPath = path.join(exampleDir, 'node_modules');
    
    // Use hardhat directly instead of npm run to avoid cross-env dependency
    let compileCmd: string;
    const hardhatPackagePath = path.join(exampleDir, 'node_modules', 'hardhat');
    
    if (fs.existsSync(hardhatPath)) {
      // Direct binary path - best option
      compileCmd = `node "${hardhatPath}" compile`;
      console.log('Using hardhat binary:', hardhatPath);
    } else if (fs.existsSync(hardhatPackagePath)) {
      // Package exists but binary doesn't - use npx as fallback
      compileCmd = `npx --yes hardhat compile`;
      console.log('Using npx hardhat (package exists but binary missing)');
    } else if (fs.existsSync(nodeModulesCheckPath)) {
      // node_modules exists but hardhat package not found - try npx
      compileCmd = `npx --yes hardhat compile`;
      console.log('Using npx hardhat (node_modules exists but hardhat package missing)');
    } else {
      // Last resort: use npx which will download and run hardhat
      compileCmd = `npx --yes hardhat compile`;
      console.log('Using npx hardhat (no local installation found)');
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

