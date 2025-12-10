const express = require('express');
const cors = require('cors');
const { exec, spawn } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

const execAsync = promisify(exec);

// Postgres connection pool for Envio indexer DB
const pgPool = new Pool({
  host: process.env.ENVIO_PG_HOST || '127.0.0.1',
  port: process.env.ENVIO_PG_PORT || 5433,
  user: process.env.ENVIO_PG_USER || 'postgres',
  password: process.env.ENVIO_PG_PASSWORD || 'entropy',
  database: process.env.ENVIO_PG_DATABASE || 'entropy',
});
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

  console.log('=== VERIFY REQUEST ===');
  console.log('examplePath:', examplePath);
  console.log('contractAddress:', contractAddress);
  console.log('network:', network);
  console.log('constructorArgs:', constructorArgs);
  console.log('constructorArgs type:', typeof constructorArgs, Array.isArray(constructorArgs));

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

    // Use simple hardhat verify command (exactly like README examples)
    // Build command: npx hardhat verify --network <network> <address> <args...>
    // String arguments need to be quoted for shell
    let verifyCmd = `npx hardhat verify --network ${network} ${contractAddress}`;
    
    // Add constructor arguments (quote strings, addresses don't need quotes)
    console.log('Processing constructorArgs:', constructorArgs);
    if (constructorArgs && constructorArgs.length > 0) {
      const quotedArgs = constructorArgs.map((arg, index) => {
        console.log(`  Arg[${index}]:`, arg, 'type:', typeof arg);
        // If it's an address (starts with 0x and is 42 chars), don't quote
        if (typeof arg === 'string' && arg.startsWith('0x') && arg.length === 42) {
          return arg;
        }
        // Otherwise quote it (for strings like "ERC7984Wrapper")
        return `"${arg}"`;
      });
      verifyCmd += ' ' + quotedArgs.join(' ');
      console.log('Quoted args:', quotedArgs);
    }

    console.log(`Verifying ${contractAddress} on ${network}...`);
    console.log(`Verify command: ${verifyCmd}`);
    
    // Execute verify command (simple execAsync, works like manual terminal command)
    // Hardcoded ETHERSCAN_API_KEY and SEPOLIA_RPC_URL for verification
    const { stdout, stderr } = await execAsync(verifyCmd, {
      cwd: exampleDir,
      env: {
        ...process.env,
        ETHERSCAN_API_KEY: 'GG5RVHSDSFG1WB1GIQ7GFGCEBP9XQE5XZ8',
        SEPOLIA_RPC_URL: 'https://eth-sepolia.g.alchemy.com/v2/c9DvcY4j1bI2_h-vv9HVU',
      },
      timeout: 300000, // 5 minutes
      maxBuffer: 10 * 1024 * 1024,
    });
    
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

// Events endpoint - Get EntropyOracle events from indexer DB
app.get('/api/events', async (req, res) => {
  try {
    const { 
      type,           // 'EntropyRequested', 'EntropyFulfilled', 'FeeRecipientUpdated', 'ChaosEngineUpdated'
      requestId,      // Filter by requestId
      txHash,         // Filter by transaction hash
      fromBlock,      // Filter from block number
      toBlock,        // Filter to block number
      limit = 50,     // Limit results
      offset = 0      // Pagination offset
    } = req.query;

    let query = '';
    let params = [];
    let paramIndex = 1;

    // Determine which table to query
    const validTypes = ['EntropyRequested', 'EntropyFulfilled', 'FeeRecipientUpdated', 'ChaosEngineUpdated'];
    const eventType = type && validTypes.includes(type) ? type : null;

    if (!eventType) {
      return res.status(400).json({ 
        error: 'Invalid event type. Must be one of: ' + validTypes.join(', ') 
      });
    }

    // Build query based on event type
    const tableName = eventType.toLowerCase();
    
    query = `SELECT * FROM ${tableName}`;
    const conditions = [];

    if (requestId) {
      conditions.push(`request_id = $${paramIndex}`);
      params.push(requestId);
      paramIndex++;
    }

    if (txHash) {
      conditions.push(`tx_hash = $${paramIndex}`);
      params.push(txHash);
      paramIndex++;
    }

    if (fromBlock) {
      conditions.push(`block_number >= $${paramIndex}`);
      params.push(fromBlock);
      paramIndex++;
    }

    if (toBlock) {
      conditions.push(`block_number <= $${paramIndex}`);
      params.push(toBlock);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Order by block number descending (newest first)
    query += ` ORDER BY block_number DESC`;

    // Add limit and offset
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    console.log(`[Events API] Query: ${query}, Params:`, params);

    const result = await pgPool.query(query, params);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) FROM ${tableName}`;
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await pgPool.query(countQuery, params.slice(0, -2)); // Remove limit/offset params
    const total = parseInt(countResult.rows[0].count);

    return res.json({
      success: true,
      events: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });
  } catch (error) {
    console.error('[Events API] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all event types summary
app.get('/api/events/summary', async (req, res) => {
  try {
    const summary = {};
    const types = ['entropyrequested', 'entropyfulfilled', 'feerecipientupdated', 'chaosengineupdated'];

    for (const type of types) {
      const result = await pgPool.query(`SELECT COUNT(*) FROM ${type}`);
      summary[type] = parseInt(result.rows[0].count);
    }

    return res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('[Events Summary API] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📁 Working directory: ${process.cwd()}`);
});

