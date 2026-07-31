import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  mergeMoves,
  scramble2x2Official,
  parseAlg,
  applyAlg,
  Cube2x2,
  deriveKeyIv,
  decodeMove,
  extractMacFromDataView,
  extractMacFromDeviceName,
} from "../src/index.js";

describe("mergeMoves", () => {
  it("U U → U2", () => {
    assert.deepEqual(mergeMoves(["U", "U"]), ["U2"]);
  });
  it("F' F' → F2", () => {
    assert.deepEqual(mergeMoves(["F'", "F'"]), ["F2"]);
  });
  it("R R' → ∅", () => {
    assert.deepEqual(mergeMoves(["R", "R'"]), []);
  });
  it("R R R → R'", () => {
    assert.deepEqual(mergeMoves(["R", "R", "R"]), ["R'"]);
  });
});

describe("scramble2x2Official", () => {
  it("génère un scramble URF atteignable", () => {
    const r = scramble2x2Official(() => 0.42);
    assert.ok(r.dist >= 4);
    assert.ok(parseAlg(r.scramble).length >= 4);
    const c = new Cube2x2();
    applyAlg(c, r.scramble);
    assert.deepEqual(c.cp, r.state.cp);
    assert.deepEqual(c.co, r.state.co);
  });
});

describe("crypto", () => {
  it("deriveKeyIv stable pour une MAC", () => {
    const a = deriveKeyIv("AA:BB:CC:DD:EE:FF");
    const b = deriveKeyIv("aabbccddeeff");
    assert.equal(Buffer.from(a.key).toString("hex"), Buffer.from(b.key).toString("hex"));
    assert.equal(a.key.length, 16);
    assert.equal(a.iv.length, 16);
  });
});

describe("decodeMove", () => {
  it("one-hot CubeStation", () => {
    assert.equal(decodeMove(0, 32).move, "R");
    assert.equal(decodeMove(1, 32).move, "R'");
    assert.equal(decodeMove(0, 2).move, "U");
    assert.equal(decodeMove(0, 8).move, "F");
  });
});

describe("mac extract", () => {
  it("lit les 6 derniers octets LE → AA:BB:…", () => {
    // payload type + MAC LE (FF EE DD CC BB AA en fin → AA:BB:CC:DD:EE:FF)
    const buf = Uint8Array.from([0x01, 0xff, 0xee, 0xdd, 0xcc, 0xbb, 0xaa]);
    assert.equal(extractMacFromDataView(new DataView(buf.buffer)), "aa:bb:cc:dd:ee:ff");
  });
  it("nom 12-hex", () => {
    assert.equal(extractMacFromDeviceName("GAN-xxx-AABBCCDDEEFF"), "aa:bb:cc:dd:ee:ff");
    assert.equal(extractMacFromDeviceName("GAN251Ui_ABC"), null);
  });
});
