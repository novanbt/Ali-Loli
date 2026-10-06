const http = require('http');
const fs = require('fs');
const path = require('path');

// Statically read all assets into memory so Vercel NFT (Node File Trace) bundles them
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'));
const stylesCss = fs.readFileSync(path.join(__dirname, 'styles.css'));
const scriptJs = fs.readFileSync(path.join(__dirname, 'script.js'));
const logoSvg = fs.readFileSync(path.join(__dirname, 'logo.svg'));
const faviconIco = fs.readFileSync(path.join(__dirname, 'favicon.ico'));

const files = {
  '/': { content: indexHtml, type: 'text/html; charset=utf-8' },
  '/index.html': { content: indexHtml, type: 'text/html; charset=utf-8' },
  '/styles.css': { content: stylesCss, type: 'text/css; charset=utf-8' },
  '/script.js': { content: scriptJs, type: 'application/javascript; charset=utf-8' },
  '/logo.svg': { content: logoSvg, type: 'image/svg+xml' },
  '/favicon.ico': { content: faviconIco, type: 'image/x-icon' },
  '/favicon.png': { content: faviconIco, type: 'image/x-icon' }
};

function handleRequest(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600');

  const cleanUrl = (req.url || '/').split('?')[0];
  const file = files[cleanUrl] || files['/' + path.basename(cleanUrl)];

  if (file) {
    res.writeHead(200, { 'Content-Type': file.type });
    res.end(file.content);
    return;
  }

  // Fallback to index.html
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(indexHtml);
}

const server = http.createServer(handleRequest);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Ali Ioli server running on port ${PORT}`);
  });
}

module.exports = handleRequest;
