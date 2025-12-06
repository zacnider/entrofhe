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

  const { examplePath, network = 'sepolia', privateKey } = req.body;

  if (!examplePath) {
    return res.status(400).json({ error: 'examplePath is required' });
  }

  if (!privateKey) {
    return res.status(400).json({ error: 'privateKey is required for deployment' });
  }

  // Security: Validate examplePath
  if (examplePath.includes('..') || examplePath.includes('/')) {
    return res.status(400).json({ error: 'Invalid example path' });
  }

  try {
    const exampleDir = path.join(process.cwd(), '..', 'examples', examplePath);

    // Set environment variables for deployment
    const env = {
      ...process.env,
      PRIVATE_KEY: privateKey,
      SEPOLIA_RPC_URL: process.env.SEPOLIA_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/c9DvcY4j1bI2_h-vv9HVU',
    };

    // Deploy contract
    const { stdout, stderr } = await execAsync(`npm run deploy:${network}`, {
      cwd: exampleDir,
      env,
      timeout: 300000, // 5 minutes timeout
      maxBuffer: 10 * 1024 * 1024,
    });

    // Extract contract address from output
    const addressMatch = stdout.match(/Contract deployed to: (0x[a-fA-F0-9]{40})/);
    const contractAddress = addressMatch ? addressMatch[1] : null;

    return res.status(200).json({
      success: true,
      contractAddress,
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

