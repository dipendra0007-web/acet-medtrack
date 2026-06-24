const fs = require('fs');

try {
  const acorn = require('acorn');
  const code = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8');
  acorn.parse(code, { ecmaVersion: 2022, sourceType: 'module' });
  console.log('Parsed successfully as standard JS (ignoring JSX specifics)');
} catch (err) {
  console.error('Acorn parse error:');
  console.error(err.message);
  if (err.loc) {
    console.error(`At line ${err.loc.line}, column ${err.loc.column}`);
  }
}
