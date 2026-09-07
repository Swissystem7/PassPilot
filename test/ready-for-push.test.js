const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

test('docs/READY_FOR_PUSH.md exists as DRAFT ACCEPT checklist with LOCAL_ONLY', () => {
  const p = path.join(ROOT, 'docs/READY_FOR_PUSH.md');
  assert.ok(fs.existsSync(p), 'READY_FOR_PUSH.md missing');
  const md = fs.readFileSync(p, 'utf8');
  assert.match(md, /DRAFT/);
  assert.match(md, /ACCEPT/);
  assert.match(md, /Lenovo/i);
  assert.match(md, /Dell/i);
  assert.match(md, /examiner/i);
  assert.match(md, /no network|No network/i);
  assert.match(md, /LOCAL_ONLY/);
});
