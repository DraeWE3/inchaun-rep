const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain',
  '.md': 'text/plain',
};

const server = http.createServer((req, res) => {
  // Add CORS headers for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let urlPath = decodeURIComponent(req.url.split('?')[0]); // strip query params
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, urlPath);

  // Security: prevent path traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // Try index.html in directory
      const dirIndex = path.join(filePath, 'index.html');
      fs.stat(dirIndex, (err2, stat2) => {
        if (err2 || !stat2.isFile()) {
          console.log(`[404] ${req.url}`);
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found: ' + urlPath);
          return;
        }
        serveFile(dirIndex, res, req.url);
      });
      return;
    }
    serveFile(filePath, res, req.url);
  });
});

function serveFile(filePath, res, url) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(`[ERROR] Reading ${filePath}:`, err.message);
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }
    console.log(`[200] ${url} → ${filePath}`);
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Content-Length': data.length,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
    res.end(data);
  });
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ SKYAI Server running at:`);
  console.log(`   ➤ http://localhost:${PORT}/`);

  console.log(`\nServing: ${ROOT}`);
  console.log('Press Ctrl+C to stop.\n');
});

server.on('error', (err) => {
  console.error('Server error:', err.message);
});
