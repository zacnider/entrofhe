import type { VercelRequest, VercelResponse } from '@vercel/node';

const BACKEND_URL = 'http://185.169.180.167:3002';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : path || '';
  
  const targetUrl = `${BACKEND_URL}/api/${pathString}`;
  
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });
    
    const data = await response.text();
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch {
      jsonData = data;
    }
    
    res.status(response.status).json(jsonData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

