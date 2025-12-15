import type { VercelRequest, VercelResponse } from '@vercel/node';

const BACKEND_URL = 'http://185.169.180.167:3002';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Get the path from query parameter
  // Vercel rewrites: /api/:path* -> /api/proxy?path=:path*
  const pathParam = req.query.path;
  const path = Array.isArray(pathParam) ? pathParam.join('/') : (pathParam as string) || '';
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  const targetUrl = `${BACKEND_URL}/api/${cleanPath}`;
  
  try {
    console.log(`[Proxy] ${req.method} ${cleanPath} -> ${targetUrl}`);
    
    // For test and verify endpoints, increase timeout
    const isLongRunning = cleanPath === 'test' || cleanPath === 'verify';
    const timeout = isLongRunning ? 300000 : 30000; // 5 minutes for test/verify, 30s for others
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    let response: Response;
    try {
      response = await fetch(targetUrl, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error(`[Proxy] Fetch error for ${cleanPath}:`, fetchError);
      // If it's a network error, provide more details
      if (fetchError.code === 'ECONNREFUSED' || fetchError.message?.includes('fetch failed')) {
        return res.status(503).json({
          error: 'Backend server unreachable',
          message: `Cannot connect to backend server at ${BACKEND_URL}. Please check if the server is running.`,
          details: fetchError.message,
        });
      }
      throw fetchError;
    }
    
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
    
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: error.message || 'Proxy request failed',
      details: error.toString()
    });
  }
}

