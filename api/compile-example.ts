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

  const { examplePath, contractName } = req.body;

  if (!examplePath) {
    return res.status(400).json({ error: 'examplePath is required' });
  }

  // Security: Validate examplePath
  if (examplePath.includes('..') || examplePath.includes('/')) {
    return res.status(400).json({ error: 'Invalid example path' });
  }

  try {
    const exampleDir = path.join(process.cwd(), 'examples', examplePath);

    // Dependencies should be pre-installed during build
    // This is just a fallback check
    const nodeModulesPath = path.join(exampleDir, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      // Fallback: Install if somehow missing (shouldn't happen if build script ran)
      console.warn(`⚠️  node_modules not found for ${examplePath}, installing...`);
      await execAsync('npm install --legacy-peer-deps', {
        cwd: exampleDir,
        timeout: 300000, // 5 minutes for install
        maxBuffer: 10 * 1024 * 1024,
      });
    }

    // Compile contracts using npx
    const { stdout, stderr } = await execAsync('npx hardhat compile', {
      cwd: exampleDir,
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
    return res.status(500).json({
      success: false,
      error: error.message,
      stdout: error.stdout || '',
      stderr: error.stderr || '',
    });
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

