const fs = require('fs');
const rootHtmlPath = 'c:\\Users\\edete\\Desktop\\clone\\pro2\\index.html';
const subHtmlPath = 'c:\\Users\\edete\\Desktop\\clone\\pro2\\skyai.pro\\index.html';

let html = fs.readFileSync(subHtmlPath, 'utf8');
html = html.replace(/\.\.\//g, '/');
fs.writeFileSync(rootHtmlPath, html, 'utf8');
console.log('Moved skyai.pro/index.html to root index.html');

fs.rmSync('c:\\Users\\edete\\Desktop\\clone\\pro2\\skyai.pro', { recursive: true, force: true });
console.log('Deleted skyai.pro directory');

const serverJsPath = 'c:\\Users\\edete\\Desktop\\clone\\pro2\\server.js';
let serverJs = fs.readFileSync(serverJsPath, 'utf8');
const logStr = "  console.log(`   ➤ http://localhost:${PORT}/skyai.pro/index.html`);";
serverJs = serverJs.replace(logStr, '');
fs.writeFileSync(serverJsPath, serverJs, 'utf8');
console.log('Cleaned up server.js');
