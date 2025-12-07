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
    let installOutput = '';
    
    if (!fs.existsSync(nodeModulesPath)) {
      // Install dependencies on first use
      console.log(`Installing dependencies for ${examplePath}... This may take 2-3 minutes on first use.`);
      try {
        const installResult = await execAsync('npm install --legacy-peer-deps', {
          cwd: exampleDir,
          timeout: 300000, // 5 minutes for install
          maxBuffer: 10 * 1024 * 1024,
        });
        console.log(`Dependencies installed successfully for ${examplePath}. Running tests...`);
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

    // Note: Type generation happens automatically during hardhat test
    // No need to pre-generate types - hardhat compile runs as part of test execution
    // Run tests using npx to ensure hardhat is found
    const { stdout, stderr } = await execAsync('npx hardhat test', {
      cwd: exampleDir,
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

