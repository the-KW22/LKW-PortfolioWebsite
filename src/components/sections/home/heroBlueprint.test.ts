import { test } from "node:test";
import assert from "node:assert/strict";
import { mulberry32, sampleBlueprint, blueprintLines, blueprintSurfaces, routes, pointAt } from "./heroBlueprint.ts";

test("sampleBlueprint returns 3n finite numbers inside the bounding box", () => {
  const n = 2000, p = sampleBlueprint(n, mulberry32(1)), e = 1e-3;
  assert.equal(p.length, n * 3);
  for (let i = 0; i < n; i++) {
    const [x, y, z] = [p[i * 3], p[i * 3 + 1], p[i * 3 + 2]];
    assert.ok([x, y, z].every(Number.isFinite));
    assert.ok(x >= -3.1 - e && x <= 2.97 + e && y >= -1.72 - e && y <= 1.6 + e && Math.abs(z) <= 0.02 + e);
  }
});

test("same seed gives the same samples", () => {
  assert.deepEqual(sampleBlueprint(100, mulberry32(7)), sampleBlueprint(100, mulberry32(7)));
});

test("lines and surfaces are well formed", () => {
  const { positions, order } = blueprintLines();
  assert.equal(positions.length, order.length * 3);
  assert.equal(blueprintSurfaces().length % 7, 0);
});

test("routes have length and pointAt hits both ends", () => {
  for (const r of routes) {
    assert.ok(r.s > 0);
    assert.deepEqual(pointAt(r, 0), r.c[0]);
    assert.deepEqual(pointAt(r, 1), r.c[r.c.length - 1]);
  }
});
