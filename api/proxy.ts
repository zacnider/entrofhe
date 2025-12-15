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
    // For test and verify endpoints, increase timeout
    const isLongRunning = cleanPath === 'test' || cleanPath === 'verify';
    const timeout = isLongRunning ? 300000 : 30000; // 5 minutes for test/verify, 30s for others
    
    // Retry logic for network failures (up to 2 retries)
    let lastError: any = null;
    let response: Response | null = null;
    
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        response = await fetch(targetUrl, {
          method: req.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        break; // Success, exit retry loop
      } catch (fetchError: any) {
        lastError = fetchError;
        // Only retry on network errors, not on timeout or other errors
        if (attempt < 2 && (fetchError.name === 'AbortError' || fetchError.message?.includes('fetch failed'))) {
          // Wait before retry (exponential backoff: 1s, 2s)
          await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 1000));
          continue;
        }
        // If it's the last attempt or not a retryable error, throw
        throw fetchError;
      }
    }
    
    if (!response) {
      throw lastError || new Error('Failed to fetch from backend server');
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
    // For network errors, provide a more user-friendly message
    if (error.name === 'AbortError' || error.message?.includes('fetch failed')) {
      return res.status(500).json({
        success: false,
        error: 'Network error',
        message: 'Unable to connect to backend server. Please try again in a moment.',
        details: error.message,
      });
    }
    res.status(500).json({ 
      success: false,
      error: error.message || 'Proxy request failed',
      details: error.toString()
    });
  }
}

