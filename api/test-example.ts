import type { VercelRequest, VercelResponse } from '@vercel/node';
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
    // In Vercel, process.cwd() is the root, so we go to examples directly
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

    // Run tests using npx to ensure hardhat is found
    const { stdout, stderr } = await execAsync('npx hardhat test', {
      cwd: exampleDir,
      timeout: 60000, // 60 seconds timeout
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
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

