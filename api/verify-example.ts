import type { VercelRequest, VercelResponse } from '@vercel/node';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

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
    const exampleDir = path.join(process.cwd(), 'examples', examplePath);

    // Check if node_modules exists, if not install dependencies
    const nodeModulesPath = path.join(exampleDir, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      // Install dependencies (only once, cached by Vercel)
      await execAsync('npm install --legacy-peer-deps', {
        cwd: exampleDir,
        timeout: 180000, // 3 minutes for install
        maxBuffer: 10 * 1024 * 1024,
      });
    }

    // Build verify command
    let verifyCmd = `npx hardhat verify --network ${network} ${contractAddress}`;
    if (constructorArgs && constructorArgs.length > 0) {
      verifyCmd += ` ${constructorArgs.join(' ')}`;
    }

    const { stdout, stderr } = await execAsync(verifyCmd, {
      cwd: exampleDir,
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

