const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

test('docs/NAME_COLLISION.md exists with crowded names and recommendation', () => {
  const p = path.join(ROOT, 'docs/NAME_COLLISION.md');
  assert.ok(fs.existsSync(p), 'NAME_COLLISION.md missing');
  const md = fs.readFileSync(p, 'utf8');
  assert.match(md, /UNVERIFIED/);
  assert.match(md, /2026-09-06/);
  assert.match(md, /UK theory|theory/i);
  assert.match(md, /Einbürgerung|Einbuergerung/i);
  assert.match(md, /password manager/i);
  assert.match(md, /driving/i);
  assert.match(md, /internal-only|rename/i);
});
