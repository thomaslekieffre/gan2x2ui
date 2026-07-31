import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  expandAlg,
  toURF,
  matchesAlg,
  detectMove,
  stateAfter,
  CaseSession,
  Cube2x2,
  applyAlg,
} from "../src/index.js";

describe("expandAlg", () => {
  it("y R → F (repère fixe)", () => {
    assert.deepEqual(expandAlg("y R"), ["F"]);
  });
  it("garde les faces sans rotation", () => {
    assert.deepEqual(expandAlg("R U R'"), ["R", "U", "R'"]);
  });
});

describe("toURF", () => {
  it("réécrit un algo avec L en URF", () => {
    const r = toURF("L U L'");
    assert.ok(r);
    assert.match(r.urf, /^[URF2' ]+$/);
    const a = stateAfter("L U L'");
    const b = stateAfter(r.urf);
    assert.ok(a.equals(b));
  });
});

describe("detectMove", () => {
  it("détecte L (pas seulement URF)", () => {
    const before = new Cube2x2();
    const after = before.clone();
    after.applyMove("L");
    assert.equal(detectMove(before, after), "L");
  });
});

describe("matchesAlg", () => {
  it("valide l'effet d'un algo CLL-like", () => {
    const before = new Cube2x2();
    applyAlg(before, "R U R' U'");
    const after = stateAfter("R U' R'", before);
    assert.ok(matchesAlg(before, after, "R U' R'"));
  });
});

describe("CaseSession", () => {
  it("setup + sync jusqu'à résolu", () => {
    const s = new CaseSession();
    s.setupCase("R U R' U R U2 R'");
    assert.equal(s.done, false);
    assert.equal(s.status().atSetup, true);

    // simule résolution = appliquer l'inverse du setup
    const live = s.setup.clone();
    // solve en appliquant une séquence URF connue via toURF inverse… plus simple : reset target path
    // On sync l'état résolu directement
    const solved = new Cube2x2();
    const st = s.sync(solved.cp, solved.co);
    assert.equal(st.done, true);
    assert.equal(st.solved, true);
  });

  it("infère L via sync facelets", () => {
    const s = new CaseSession();
    s.setupCase(""); // solved setup
    const mid = new Cube2x2();
    mid.applyMove("L");
    const st = s.sync(mid.cp, mid.co);
    assert.equal(st.lastInferred, "L");
  });
});
