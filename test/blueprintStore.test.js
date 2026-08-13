const test = require("node:test");
const assert = require("node:assert/strict");
const { parseCoordinatorBlueprint, BLUEPRINTS } = require("../src/lib/examBlueprint");
const {
  parseStore,
  putOverlay,
  dropOverlay,
  getOverlay,
  loadOverlays,
  saveOverlays,
  editsToBlueprint,
  builtinAsEdits,
  pointsTotal,
  BP_STORE_V1,
  BP_STORE_V2,
} = require("../src/lib/blueprintStore");

const memory = (init) => {
  const bag = Object.assign({}, init);
  return {
    bag,
    getItem: (k) => (Object.prototype.hasOwnProperty.call(bag, k) ? bag[k] : null),
    setItem: (k, v) => { bag[k] = String(v); },
    removeItem: (k) => { delete bag[k]; },
  };
};

test("v2 store keeps a python map from leaking onto hedva1", () => {
  const py = parseCoordinatorBlueprint({
    courseId: "python",
    blocks: [{ topic: "recursion", label: "רקורסיה", points: 40 }],
  }).blueprint;
  const store = putOverlay({}, "python", py);
  assert.equal(getOverlay(store, "python").blocks[0].points, 40);
  assert.equal(getOverlay(store, "hedva1"), null);
  assert.equal(getOverlay(dropOverlay(store, "python"), "python"), null);
});

test("legacy v1 single-map JSON migrates under its courseId", () => {
  const legacy = {
    courseId: "arch",
    title: "ארגון",
    blocks: [{ id: "q11", topic: "datapath", label: "Q11", points: 44 }],
  };
  const storage = memory({ [BP_STORE_V1]: JSON.stringify(legacy) });
  const store = loadOverlays(storage);
  assert.equal(store.arch.blocks[0].points, 44);
  assert.equal(store.python, undefined);
});

test("v2 wins over leftover v1 so an old python map does not clobber the new store", () => {
  const v2 = { hedva2: { courseId: "hedva2", blocks: [{ topic: "series", points: 25 }] } };
  const v1 = { courseId: "python", blocks: [{ topic: "lists", points: 25 }] };
  const storage = memory({
    [BP_STORE_V2]: JSON.stringify(v2),
    [BP_STORE_V1]: JSON.stringify(v1),
  });
  const store = loadOverlays(storage);
  assert.equal(!!store.hedva2, true);
  assert.equal(store.python, undefined);
});

test("garbage and empty storage become an empty store, not a throw", () => {
  assert.deepEqual(parseStore("nope"), {});
  assert.deepEqual(parseStore(null), {});
  assert.deepEqual(loadOverlays(memory()), {});
});

test("editsToBlueprint tags the map as coordinator-pasted and warns if not 100", () => {
  const parsed = editsToBlueprint("python", "פייתון", "מועד", [
    { topic: "recursion", label: "רקורסיה", points: 70 },
    { topic: "strings", label: "מחרוזות", points: 30 },
  ]);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.blueprint.totalPoints, 100);
  assert.equal(parsed.blueprint.blocks[0].source, "coordinator");
  const short = editsToBlueprint("arch", "ארגון", "מועד", [
    { topic: "datapath", label: "Q11", points: 44 },
  ]);
  assert.equal(short.ok, true);
  assert.ok(short.warnings.some((w) => w.includes("44")));
});

test("builtinAsEdits + pointsTotal let the form start from the built-in map", () => {
  const edits = builtinAsEdits(BLUEPRINTS.arch);
  assert.equal(pointsTotal(edits), 100);
  assert.ok(edits.some((e) => e.topic === "datapath" && e.points === 44));
});

test("saveOverlays writes v2 JSON the loader can read back", () => {
  const storage = memory();
  const ok = saveOverlays(storage, { python: { courseId: "python", blocks: [{ topic: "lists", points: 25 }] } });
  assert.equal(ok, true);
  const again = loadOverlays(storage);
  assert.equal(again.python.blocks[0].topic, "lists");
});
