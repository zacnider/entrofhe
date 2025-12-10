import type { VercelRequest, VercelResponse } from '@vercel/node';

const INDEXER_API_URL = 'http://185.169.180.167:4000';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Get the path from the URL
  // /api/indexer/events -> events
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const pathname = url.pathname;
  
  // Extract path after /api/indexer/
  const pathMatch = pathname.match(/^\/api\/indexer\/(.+)$/);
  const path = pathMatch ? pathMatch[1] : '';
  
  if (!path) {
    return res.status(400).json({ 
      error: 'Path is required. Use /api/indexer/events?type=...',
      pathname,
      url: req.url
    });
  }
  
  // Build target URL
  let targetUrl = `${INDEXER_API_URL}/api/${path}`;
  
  // Add query parameters from original request
  const queryString = url.searchParams.toString();
  const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;
  
  console.log('[Indexer Proxy] Request:', {
    pathname,
    path,
    targetUrl,
    fullUrl,
    query: Object.fromEntries(url.searchParams)
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

