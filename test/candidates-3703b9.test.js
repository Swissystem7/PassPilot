const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const REL = 'docs/candidates/3703b9-local-only.md';

test('docs/candidates/3703b9-local-only.md exists with FACT/INFERENCE/UNKNOWN', () => {
  const p = path.join(ROOT, REL);
  assert.ok(fs.existsSync(p), REL + ' missing');
  const md = fs.readFileSync(p, 'utf8');
  assert.match(md, /##\s*FACT/);
  assert.match(md, /##\s*INFERENCE/);
  assert.match(md, /##\s*UNKNOWN/);
  assert.match(md, /local-only|LOCAL_ONLY/i);
  assert.match(md, /3703b9/);
});
