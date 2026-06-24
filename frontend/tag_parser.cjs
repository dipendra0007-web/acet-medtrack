const fs = require('fs');
const code = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8');

// We want to find unmatched tags inside the return statement of AdminDashboard
// The return statement is between:
// return (
// and
//   );
// };

const returnStartIndex = code.indexOf('return (');
const returnEndIndex = code.lastIndexOf(');');

if (returnStartIndex === -1 || returnEndIndex === -1) {
  console.error('Could not find return statement');
  process.exit(1);
}

const returnCode = code.substring(returnStartIndex, returnEndIndex);

// Let's strip curly brace JavaScript blocks to avoid parsing HTML tags inside JS strings or maps
// We need to do this recursively because braces can nest.
function stripJSExpressions(str) {
  let result = '';
  let braceCount = 0;
  let inString = false;
  let stringChar = '';
  let inJSXTag = false;
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    
    if (inString) {
      if (char === stringChar && str[i-1] !== '\\') {
        inString = false;
      }
      continue;
    }
    
    if (char === '{' && !inString) {
      braceCount++;
      continue;
    }
    
    if (char === '}' && !inString) {
      braceCount--;
      continue;
    }
    
    if (braceCount > 0) {
      // Inside JS expression, look for strings
      if (char === '"' || char === "'" || char === '`') {
        inString = true;
        stringChar = char;
      }
      continue;
    }
    
    // Outside JS expression, keep JSX characters
    result += char;
  }
  return result;
}

const cleanJSX = stripJSExpressions(returnCode);

// Now let's extract tags from cleanJSX
// Tags look like: <TagName ...> or </TagName> or <TagName ... />
const tagRegex = /<\/?([A-Za-z0-9_\-\.]+)(?:[^>]*?(?:\/>|>)|>)/g;
let match;
const stack = [];

console.log('--- Analyzing JSX tags ---');
let lineNum = 1;
let index = 0;

// Helper to count lines
function getLineNumber(pos) {
  return code.substring(0, returnStartIndex + pos).split('\n').length;
}

const cleanedCodeWithPositions = [];
let currentPos = 0;

// Simple scanner
while ((match = tagRegex.exec(cleanJSX)) !== null) {
  const fullTag = match[0];
  const tagName = match[1];
  const isClosing = fullTag.startsWith('</');
  const isSelfClosing = fullTag.endsWith('/>');
  const tagLine = getLineNumber(match.index);
  
  if (isSelfClosing) {
    // console.log(`[Self-closing] <${tagName}/> on line ${tagLine}`);
  } else if (isClosing) {
    if (stack.length === 0) {
      console.log(`[ERROR] Mismatched closing tag </${tagName}> on line ${tagLine} (stack is empty)`);
    } else {
      const top = stack.pop();
      if (top.name !== tagName) {
        console.log(`[ERROR] Mismatched closing tag </${tagName}> on line ${tagLine} (expected </${top.name}> opened on line ${top.line})`);
      }
    }
  } else {
    stack.push({ name: tagName, line: tagLine });
  }
}

if (stack.length > 0) {
  console.log('[ERROR] Unclosed tags remaining in stack:');
  for (const item of stack) {
    console.log(`  <${item.name}> opened on line ${item.line}`);
  }
} else {
  console.log('All JSX tags match successfully!');
}
