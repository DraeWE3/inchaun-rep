const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\edete\\Desktop\\clone\\pro2\\d1u25hizyv9jz8.cloudfront.net\\assets\\index-C_7zwRpY.js', 'utf-8');

// Find string literals that look like UI text (contain spaces, length > 15, no HTML tags, no URLs)
const stringRegex = /["']([^"'\\]{15,})["']/g;
const matches = [];
let match;
while ((match = stringRegex.exec(content)) !== null) {
    matches.push(match[1]);
}

const unique = [...new Set(matches)].filter(s => 
    s.includes(' ') && 
    !s.includes('<') && 
    !s.includes('/>') &&
    !s.includes('function') &&
    !s.includes('return') &&
    !s.startsWith('http') &&
    !s.startsWith('//')
);

console.log(unique.join('\n'));
