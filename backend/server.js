const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test endpoint
app.post('/api/test', async (req, res) => {
  const { examplePath } = req.body;

  if (!examplePath) {
    return res.status(400).json({ error: 'examplePath is required' });
  }

  // Security: Validate examplePath
  if (examplePath.includes('..') || examplePath.includes('/')) {
    return res.status(400).json({ error: 'Invalid example path' });
  }

  try {
    // Examples directory path
    const rootDir = process.env.EXAMPLES_ROOT || '/root';
    const exampleDir = path.join(rootDir, 'examples', examplePath);

    if (!fs.existsSync(exampleDir)) {
      return res.status(404).json({ error: `Example not found: ${examplePath}` });
    }

    // Check if node_modules exists and if package.json is newer than node_modules
    const nodeModulesPath = path.join(exampleDir, 'node_modules');
    const hardhatPath = path.join(exampleDir, 'node_modules', '.bin', 'hardhat');
    const packageJsonPath = path.join(exampleDir, 'package.json');
    
    let shouldInstall = false;
    
    if (!fs.existsSync(nodeModulesPath) || !fs.existsSync(hardhatPath)) {
      shouldInstall = true;
      console.log(`node_modules missing or hardhat binary not found for ${examplePath}`);
    } else if (fs.existsSync(packageJsonPath)) {
      // Check if package.json is newer than node_modules
      const packageJsonStats = fs.statSync(packageJsonPath);
      const nodeModulesStats = fs.statSync(nodeModulesPath);
      
      if (packageJsonStats.mtime > nodeModulesStats.mtime) {
        shouldInstall = true;
        console.log(`package.json is newer than node_modules for ${examplePath}`);
      }
    }
    
    if (shouldInstall) {
      console.log(`Installing dependencies for ${examplePath}...`);
      try {
        const installResult = await execAsync('npm install --legacy-peer-deps', {
          cwd: exampleDir,
          timeout: 300000, // 5 minutes
          maxBuffer: 10 * 1024 * 1024,
        });
        console.log(`Install output for ${examplePath}:`, installResult.stdout.substring(0, 200));
      } catch (installError) {
        console.error(`Install error for ${examplePath}:`, installError.message);
        return res.status(500).json({
          success: false,
          error: `Failed to install dependencies for ${examplePath}`,
          message: installError.message,
          stdout: installError.stdout || '',
          stderr: installError.stderr || '',
        });
      }
      
      // Verify Hardhat binary exists after install
      if (!fs.existsSync(hardhatPath)) {
        return res.status(500).json({
          success: false,
          error: 'Hardhat binary not found after installation',
          message: `Hardhat binary should be at ${hardhatPath} but it does not exist. The npm install may have failed silently.`,
        });
      }
    }

    // Clean up Mac OS X resource fork files before running tests
    try {
      const { execSync } = require('child_process');
      execSync('find . -name "._*" -type f -delete', { cwd: exampleDir });
    } catch (e) {
      // Ignore cleanup errors
    }

    // Run Hardhat tests - use local binary only
    console.log(`Running tests for ${examplePath}...`);
    
    const testCmd = `node "${hardhatPath}" test`;
    
    const { stdout, stderr } = await execAsync(testCmd, {
      cwd: exampleDir,
      env: {
        ...process.env,
        TS_NODE_TRANSPILE_ONLY: 'true',
      },
      timeout: 120000, // 2 minutes
      maxBuffer: 10 * 1024 * 1024,
    });

    return res.json({
      success: true,
      stdout,
      stderr,
    });
  } catch (error) {
    console.error('Test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stdout: error.stdout || '',
      stderr: error.stderr || '',
    });
  }
});

// Compile endpoint
app.post('/api/compile', async (req, res) => {
  const { examplePath, contractName } = req.body;

  if (!examplePath) {
    return res.status(400).json({ error: 'examplePath is required' });
  }

  // Security: Validate examplePath
  if (examplePath.includes('..') || examplePath.includes('/')) {
    return res.status(400).json({ error: 'Invalid example path' });
  }

  try {
    // Examples directory path
    const rootDir = process.env.EXAMPLES_ROOT || '/root';
    const exampleDir = path.join(rootDir, 'examples', examplePath);

    if (!fs.existsSync(exampleDir)) {
      return res.status(404).json({ error: `Example not found: ${examplePath}` });
    }

    // Check if node_modules exists and if package.json is newer than node_modules
    const nodeModulesPath = path.join(exampleDir, 'node_modules');
    const hardhatPath = path.join(exampleDir, 'node_modules', '.bin', 'hardhat');
    const packageJsonPath = path.join(exampleDir, 'package.json');
    
    let shouldInstall = false;
    
    if (!fs.existsSync(nodeModulesPath) || !fs.existsSync(hardhatPath)) {
      shouldInstall = true;
      console.log(`node_modules missing or hardhat binary not found for ${examplePath}`);
    } else if (fs.existsSync(packageJsonPath)) {
      // Check if package.json is newer than node_modules
      const packageJsonStats = fs.statSync(packageJsonPath);
      const nodeModulesStats = fs.statSync(nodeModulesPath);
      
      if (packageJsonStats.mtime > nodeModulesStats.mtime) {
        shouldInstall = true;
        console.log(`package.json is newer than node_modules for ${examplePath}`);
      }
    }
    
    if (shouldInstall) {
      console.log(`Installing dependencies for ${examplePath}...`);
      try {
        const installResult = await execAsync('npm install --legacy-peer-deps', {
          cwd: exampleDir,
          timeout: 300000,
          maxBuffer: 10 * 1024 * 1024,
        });
        console.log(`Install output for ${examplePath}:`, installResult.stdout.substring(0, 200));
      } catch (installError) {
        console.error(`Install error for ${examplePath}:`, installError.message);
        return res.status(500).json({
          success: false,
          error: `Failed to install dependencies for ${examplePath}`,
          message: installError.message,
          stdout: installError.stdout || '',
          stderr: installError.stderr || '',
        });
      }
      
      // Verify Hardhat binary exists after install
      if (!fs.existsSync(hardhatPath)) {
        return res.status(500).json({
          success: false,
          error: 'Hardhat binary not found after installation',
          message: `Hardhat binary should be at ${hardhatPath} but it does not exist. The npm install may have failed silently.`,
        });
      }
    }

    // Clean up Mac OS X resource fork files before compiling
    try {
      const { execSync } = require('child_process');
      execSync('find . -name "._*" -type f -delete', { cwd: exampleDir });
    } catch (e) {
      // Ignore cleanup errors
    }

    // Run Hardhat compile - use local binary only
    console.log(`Compiling ${examplePath}...`);
    
    const compileCmd = `node "${hardhatPath}" compile`;
    
    const { stdout, stderr } = await execAsync(compileCmd, {
      cwd: exampleDir,
      env: {
        ...process.env,
        TS_NODE_TRANSPILE_ONLY: 'true',
      },
      timeout: 120000,
      maxBuffer: 10 * 1024 * 1024,
    });

    // Try to find contract artifact if contractName is provided
    let bytecode = null;
    let abi = null;

    if (contractName) {
      const artifactsDir = path.join(exampleDir, 'artifacts', 'contracts');
      if (fs.existsSync(artifactsDir)) {
        // Find contract artifact recursively
        const findArtifact = (dir, name) => {
          const files = fs.readdirSync(dir, { withFileTypes: true });
          for (const file of files) {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory()) {
              const found = findArtifact(fullPath, name);
              if (found) return found;
            } else if (file.name === `${name}.json`) {
              return fullPath;
            }
          }
          return null;
        };

        const artifactPath = findArtifact(artifactsDir, contractName);
        if (artifactPath) {
          const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf-8'));
          bytecode = artifact.bytecode;
          abi = artifact.abi;
        }
      }
    }

    return res.json({
      success: true,
      stdout,
      stderr,
      bytecode,
      abi,
    });
  } catch (error) {
    console.error('Compile error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stdout: error.stdout || '',
      stderr: error.stderr || '',
    });
  }
});

// Deploy endpoint
app.post('/api/deploy', async (req, res) => {
  const { examplePath, network = 'sepolia' } = req.body;

  if (!examplePath) {
    return res.status(400).json({ error: 'examplePath is required' });
  }

  // Security: Validate examplePath
  if (examplePath.includes('..') || examplePath.includes('/')) {
    return res.status(400).json({ error: 'Invalid example path' });
  }

  try {
    // Examples directory path
    const rootDir = process.env.EXAMPLES_ROOT || '/root';
    const exampleDir = path.join(rootDir, 'examples', examplePath);

    if (!fs.existsSync(exampleDir)) {
      return res.status(404).json({ error: `Example not found: ${examplePath}` });
    }

    // Check if node_modules exists, if not install
    const nodeModulesPath = path.join(exampleDir, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      console.log(`Installing dependencies for ${examplePath}...`);
      await execAsync('npm install --legacy-peer-deps', {
        cwd: exampleDir,
        timeout: 300000,
        maxBuffer: 10 * 1024 * 1024,
      });
    }

    // Note: Deployment should be done via frontend using Wagmi
    // This endpoint is kept for compatibility but returns a message
    return res.json({
      success: false,
      error: 'Deployment should be done via frontend using wallet connection',
      message: 'Please use the Deploy button in the frontend which uses Wagmi for wallet-based deployment',
    });
  } catch (error) {
    console.error('Deploy error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stdout: error.stdout || '',
      stderr: error.stderr || '',
    });
  }
});

// Verify endpoint
app.post('/api/verify', async (req, res) => {
  const { examplePath, contractAddress, network = 'sepolia', constructorArgs = [] } = req.body;

  if (!examplePath || !contractAddress) {
    return res.status(400).json({ error: 'examplePath and contractAddress are required' });
  }

  // Security: Validate examplePath
  if (examplePath.includes('..') || examplePath.includes('/')) {
    return res.status(400).json({ error: 'Invalid example path' });
  }

  try {
    // Examples directory path
    const rootDir = process.env.EXAMPLES_ROOT || '/root';
    const exampleDir = path.join(rootDir, 'examples', examplePath);

    if (!fs.existsSync(exampleDir)) {
      return res.status(404).json({ error: `Example not found: ${examplePath}` });
    }

    // Check if node_modules exists, if not install
    const nodeModulesPath = path.join(exampleDir, 'node_modules');
    const hardhatPath = path.join(exampleDir, 'node_modules', '.bin', 'hardhat');
    
    if (!fs.existsSync(nodeModulesPath) || !fs.existsSync(hardhatPath)) {
      console.log(`Installing dependencies for ${examplePath}...`);
      try {
        await execAsync('npm install --legacy-peer-deps', {
          cwd: exampleDir,
          timeout: 300000,
          maxBuffer: 10 * 1024 * 1024,
        });
      } catch (installError) {
        console.error(`Install error for ${examplePath}:`, installError.message);
        return res.status(500).json({
          success: false,
          error: `Failed to install dependencies for ${examplePath}`,
          message: installError.message,
          stdout: installError.stdout || '',
          stderr: installError.stderr || '',
        });
      }
      
      // Verify Hardhat binary exists after install
      if (!fs.existsSync(hardhatPath)) {
        return res.status(500).json({
          success: false,
          error: 'Hardhat binary not found after installation',
          message: `Hardhat binary should be at ${hardhatPath} but it does not exist.`,
        });
      }
    }

    // Clean up Mac OS X resource fork files before verifying
    try {
      const { execSync } = require('child_process');
      execSync('find . -name "._*" -type f -delete', { cwd: exampleDir });
    } catch (e) {
      // Ignore cleanup errors
    }

    // Build verify command - use local binary only
    // String arguments need to be quoted, addresses don't
    let verifyCmd = `node "${hardhatPath}" verify --network ${network} ${contractAddress}`;
    
    if (constructorArgs && constructorArgs.length > 0) {
      // Quote string arguments (non-address strings)
      const quotedArgs = constructorArgs.map(arg => {
        // Check if it's an address (starts with 0x and is 42 chars)
        if (arg.startsWith('0x') && arg.length === 42) {
          return arg;
        }
        // Otherwise, it's a string - quote it
        return `"${arg}"`;
      });
      verifyCmd += ` ${quotedArgs.join(' ')}`;
    }

    console.log(`Verifying ${contractAddress} on ${network}...`);
    console.log(`Verify command: ${verifyCmd}`);
    console.log(`Constructor args: ${JSON.stringify(constructorArgs)}`);
    
    // Try verification with retry mechanism for Etherscan API timeouts
    let lastError = null;
    const maxRetries = 3;
    let stdout = '';
    let stderr = '';
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Verification attempt ${attempt}/${maxRetries}...`);
        const result = await execAsync(verifyCmd, {
          cwd: exampleDir,
          env: {
            ...process.env,
            TS_NODE_TRANSPILE_ONLY: 'true',
            ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY || '',
            SEPOLIA_RPC_URL: process.env.SEPOLIA_RPC_URL || '',
            // Increase timeout for Etherscan API
            HARDHAT_VERIFY_TIMEOUT: '300000',
          },
          timeout: 300000, // 5 minutes for Etherscan API
          maxBuffer: 10 * 1024 * 1024,
        });
        stdout = result.stdout;
        stderr = result.stderr;
        lastError = null;
        break; // Success, exit retry loop
      } catch (error) {
        lastError = error;
        stdout = error.stdout || '';
        stderr = error.stderr || '';
        
        // Check if it's a timeout or connection error (retryable)
        // NOT_FOUND errors are usually permanent (contract not found) and should not be retried
        const errorMessage = (error.message || error.stderr || '').toLowerCase();
        const isRetryableError = errorMessage.includes('timeout') || 
                                errorMessage.includes('connect timeout') ||
                                errorMessage.includes('network request failed') ||
                                errorMessage.includes('econnrefused') ||
                                errorMessage.includes('etimedout');
        
        // NOT_FOUND errors are usually permanent - don't retry them
        const isNotFoundError = errorMessage.includes('not_found') ||
                               errorMessage.includes('the page could not be found') ||
                               errorMessage.includes('fra1::');
        
        if (isNotFoundError) {
          // NOT_FOUND is usually a permanent error - don't retry, just throw
          console.log(`NOT_FOUND error detected - this is usually permanent, not retrying`);
          throw error;
        }
        
        if (isRetryableError && attempt < maxRetries) {
          console.log(`Attempt ${attempt} failed with retryable error, retrying in 10 seconds...`);
          console.log(`Error: ${errorMessage.substring(0, 200)}`);
          await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds before retry
          continue;
        } else {
          // Not a retryable error or last attempt, throw the error
          throw error;
        }
      }
    }
    
    if (lastError) {
      throw lastError;
    }

    return res.json({
      success: true,
      stdout,
      stderr,
    });
  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stdout: error.stdout || '',
      stderr: error.stderr || '',
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📁 Working directory: ${process.cwd()}`);
});

