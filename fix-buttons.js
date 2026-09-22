const fs = require('fs');
const jsPath = 'c:\\Users\\edete\\Desktop\\clone\\pro2\\d1u25hizyv9jz8.cloudfront.net\\assets\\index-C_7zwRpY.js';
let content = fs.readFileSync(jsPath, 'utf8');

content = content.replace(/https:\/\/playground\.skyai\.pro/g, '#dashboard');
content = content.replace(/"Playground"/g, '"Dashboard"');
content = content.replace(/"Enjoy"/g, '"Connect Wallet"');

fs.writeFileSync(jsPath, content, 'utf8');
console.log('Updated buttons in bundle.');
