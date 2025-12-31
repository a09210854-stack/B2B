#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function processFile(file) {
  let s = fs.readFileSync(file, 'utf8');
  if (!/vi\.spyOn\(auth, 'getCurrentUser'/.test(s)) return false;

  // 1) ensure beforeEach has __resetPrisma
  if (/__resetPrisma\(/.test(s)) {
    // already present
  } else {
    // find a beforeEach block
    s = s.replace(/beforeEach\s*\(\s*\(\s*\)\s*=>\s*\{/, (m) => m + "\n  (global as any).__resetPrisma({ user: [] });");
  }

  // 2) handle null mocks
  s = s.replace(/vi\.spyOn\(auth, 'getCurrentUser'\)\.mockResolvedValue\(null as any\);/g, '');

  // 3) handle fakeUser mocks: pattern const fakeUser = { ... } as any; \n vi.spyOn(...mockResolvedValue(fakeUser));
  s = s.replace(/const\s+(\w+)\s*=\s*([^;]+)as any;\s*\n\s*vi\.spyOn\(auth, 'getCurrentUser'\)\.mockResolvedValue\(\1\);/g,
    (m, name, obj) => {
      // create seed and token
      const seed = `(global as any).__resetPrisma({ user: [${name}] });\n    const token = auth.signJwt(${name}.id);`;
      return `const ${name} = ${obj}as any;\n    ${seed}`;
    }
  );

  // 4) replace simple Request without headers to include token if token var exists in scope
  // Replace occurrences of: const req = new Request('http://localhost');
  // with: const req = new Request('http://localhost', { headers: { authorization: `Bearer ${token}` } });
  s = s.replace(/const\s+req\s*=\s*new\s+Request\(\s*'http:\/\/localhost'\s*\);/g, (m) => {
    if (/const\s+token\s*=/.test(s)) {
      return "const req = new Request('http://localhost', { headers: { authorization: `Bearer ${token}` } });";
    }
    return m;
  });

  fs.writeFileSync(file, s, 'utf8');
  return true;
}

const files = glob.sync('test/**/*.test.ts');
let changedFiles = [];
for (const f of files) {
  const updated = processFile(f);
  if (updated) changedFiles.push(f);
}

if (changedFiles.length) {
  console.log('Updated files:\n' + changedFiles.join('\n'));
  process.exit(0);
} else {
  console.log('No changes needed');
  process.exit(0);
}
