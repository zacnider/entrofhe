import type { VercelRequest, VercelResponse } from '@vercel/node';

const INDEXER_API_URL = 'http://185.169.180.167:4000';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Get the path from query parameter
  // Vercel rewrites: /api/indexer/:path* -> /api/indexer-proxy?path=:path*
  const pathParam = req.query.path;
  const path = Array.isArray(pathParam) ? pathParam.join('/') : (pathParam as string) || '';
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // If no path provided, return error
  if (!cleanPath) {
    return res.status(400).json({ 
      error: 'Path parameter is required',
      query: req.query,
      url: req.url
    });
  }
  
  // Build target URL
  let targetUrl = `${INDEXER_API_URL}/api/${cleanPath}`;
  
  // Add query parameters from original request (excluding 'path' which is used for routing)
  const queryParams = new URLSearchParams();
  Object.keys(req.query).forEach(key => {
    if (key !== 'path') {
      const value = req.query[key];
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v));
      } else if (value) {
        queryParams.append(key, value as string);
      }
    }
  });
  
  const queryString = queryParams.toString();
  const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;
  
  console.log('[Indexer Proxy] Request:', {
    pathParam,
    cleanPath,
    targetUrl,
    fullUrl,
    query: req.query,
    url: req.url,
    method: req.method
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

