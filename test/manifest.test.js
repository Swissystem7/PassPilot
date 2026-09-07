"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname);
const manifestPath = path.join(root, "test_manifest.json");

test("test_manifest.json lists exactly the *.test.js files on disk", () => {
  assert.ok(fs.existsSync(manifestPath), "test/test_manifest.json missing");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assert.equal(manifest.version, 1);
  assert.ok(Array.isArray(manifest.testFiles));

  const onDisk = fs
    .readdirSync(root)
    .filter((f) => f.endsWith(".test.js"))
    .sort();
  const listed = [...manifest.testFiles].sort();
  assert.deepEqual(
    listed,
    onDisk,
    "test files changed without updating test/test_manifest.json"
  );
});
