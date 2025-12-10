import type { VercelRequest, VercelResponse } from '@vercel/node';

const INDEXER_API_URL = 'http://185.169.180.167:4000';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Get the path from the URL
  // Vercel rewrites: /api/indexer/:path* -> /api/indexer
  // We need to extract the path from the original URL
  const originalUrl = req.headers['x-vercel-original-url'] || req.url || '';
  
  // Extract path after /api/indexer/
  // Example: /api/indexer/events -> events
  let path = '';
  if (originalUrl.includes('/api/indexer/')) {
    const pathMatch = originalUrl.match(/\/api\/indexer\/([^?]+)/);
    path = pathMatch ? pathMatch[1] : '';
  }
  
  // Fallback: try to get from query parameter (if rewrite passes it)
  if (!path && req.query.path) {
    path = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path as string;
  }
  
  if (!path) {
    return res.status(400).json({ 
      error: 'Path is required. Use /api/indexer/events?type=...',
      originalUrl,
      url: req.url,
      query: req.query,
      headers: Object.keys(req.headers)
    });
  }
  
  // Build target URL
  let targetUrl = `${INDEXER_API_URL}/api/${path}`;
  
  // Add query parameters from original request (excluding 'path' if it exists)
  const queryParams = new URLSearchParams();
  Object.keys(req.query).forEach(key => {
    if (key !== 'path') {
      const value = req.query[key];
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v as string));
      } else if (value) {
        queryParams.append(key, value as string);
      }
    }
  });
  
  const queryString = queryParams.toString();
  const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;
  
  console.log('[Indexer Proxy] Request:', {
    originalUrl,
    path,
    targetUrl,
    fullUrl,
    query: req.query
  });
  
  try {
    const response = await fetch(fullUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
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
    console.error('Indexer proxy error:', error);
    res.status(500).json({ 
      error: error.message || 'Indexer proxy request failed',
      details: error.toString()
    });
  }
}

