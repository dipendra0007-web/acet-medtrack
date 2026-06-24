const fs = require('fs');

try {
  const acorn = require('acorn');
  const code = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8');
  // Since acorn doesn't support JSX, we know it will fail when it hits the first '<' of JSX.
  // But if there is a JS syntax error BEFORE the JSX (e.g. mismatched parentheses/braces), it will fail there instead.
  acorn.parse(code, { ecmaVersion: 2022, sourceType: 'module' });
  console.log('Parsed successfully as standard JS (ignoring JSX specifics)');
} catch (err) {
  console.error('Acorn parse error:');
  console.error(err.message);
  if (err.loc) {
    console.error(`At line ${err.loc.line}, column ${err.loc.column}`);
  }
}
