const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

test('docs/LOCAL_ONLY.md exists and forbids push until READY_FOR_PUSH', () => {
  const p = path.join(ROOT, 'docs/LOCAL_ONLY.md');
  assert.ok(fs.existsSync(p), 'LOCAL_ONLY.md missing');
  const md = fs.readFileSync(p, 'utf8');
  assert.match(md, /LOCAL_ONLY/);
  assert.match(md, /READY_FOR_PUSH/);
  assert.match(md, /no push|until/i);
  assert.match(md, /no network minting|No network minting|synthetic|localStorage/i);
});
