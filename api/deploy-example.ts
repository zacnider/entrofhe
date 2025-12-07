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

const execAsync = promisify(exec);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { examplePath, network = 'sepolia' } = req.body;

  if (!examplePath) {
    return res.status(400).json({ error: 'examplePath is required' });
  }

  // Security: Validate examplePath
  if (examplePath.includes('..') || examplePath.includes('/')) {
    return res.status(400).json({ error: 'Invalid example path' });
  }

  // Backend server URL
  const BACKEND_URL = process.env.BACKEND_API_URL || 'http://185.169.180.167:3002';
  const API_KEY = process.env.BACKEND_API_KEY || '';

  try {
    // Forward request to backend server
    const response = await fetch(`${BACKEND_URL}/api/deploy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY && { 'X-API-Key': API_KEY }),
      },
      body: JSON.stringify({ examplePath, network }),
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
}

