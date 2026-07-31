/**
 * Algos & apprentissage (CLL, etc.) malgré le firmware URF-only.
 *
 * - Vérif par **état** (CP/CO), pas par string de moves HW
 * - `toURF` : réécrit un algo en générateurs U/R/F
 * - `detectMove` : vraie lettre (y compris L/D/B) via diff d'état
 * - `expandAlg` : résout x/y/z en tours de faces fixes
 */

import { Cube2x2 } from "./cube2x2.js";
import { applyAlg, invertAlg, parseAlg, solveURF } from "./scramble.js";

/**
 * Tables : après une rotation de cube, quelle face fixe correspond
 * à la lettre d'algo (repère grip).
 * Ex. après `y`, un `R` grip = face fixe `F`.
 */
const ROT_FACE = {
  x: { R: "R", L: "L", U: "F", F: "D", D: "B", B: "U" },
  "x'": { R: "R", L: "L", U: "B", B: "D", D: "F", F: "U" },
  x2: { R: "R", L: "L", U: "D", D: "U", F: "B", B: "F" },
  y: { U: "U", D: "D", F: "L", L: "B", B: "R", R: "F" },
  "y'": { U: "U", D: "D", F: "R", R: "B", B: "L", L: "F" },
  y2: { U: "U", D: "D", F: "B", B: "F", R: "L", L: "R" },
  z: { F: "F", B: "B", U: "L", L: "D", D: "R", R: "U" },
  "z'": { F: "F", B: "B", U: "R", R: "D", D: "L", L: "U" },
  z2: { F: "F", B: "B", U: "D", D: "U", R: "L", L: "R" },
};

const ID_FACE = { U: "U", R: "R", F: "F", D: "D", L: "L", B: "B" };

function mapFace(map, face) {
  return map[face] || face;
}

function composeMap(a, b) {
  const out = {};
  for (const f of Object.keys(ID_FACE)) out[f] = mapFace(a, mapFace(b, f));
  return out;
}

/**
 * Enlève x/y/z : `y R U' R'` → tours dans le repère cube fixe.
 * @param {string|string[]} alg
 * @returns {string[]}
 */
export function expandAlg(alg) {
  const tokens = Array.isArray(alg) ? alg.slice() : parseAlg(alg);
  let grip = { ...ID_FACE };
  const out = [];
  for (const tok of tokens) {
    if (ROT_FACE[tok]) {
      grip = composeMap(grip, ROT_FACE[tok]);
      continue;
    }
    const face = tok[0];
    const suffix = tok.slice(1);
    if (!"URFDLB".includes(face)) continue;
    out.push(mapFace(grip, face) + suffix);
  }
  return out;
}

/**
 * Move unique `before` → `after`, ou null (0 ou >1 candidats).
 * @param {Cube2x2} before
 * @param {Cube2x2} after
 * @returns {string|null}
 */
export function detectMove(before, after) {
  return before.findMoveTo(after);
}

/**
 * @param {string|string[]} alg
 * @param {Cube2x2} [from]
 * @returns {Cube2x2}
 */
export function stateAfter(alg, from = new Cube2x2()) {
  const c = from.clone();
  applyAlg(c, expandAlg(alg).join(" "));
  return c;
}

/**
 * `after` == `before` + alg (rotations expansées) ?
 * @param {Cube2x2} before
 * @param {Cube2x2} after
 * @param {string|string[]} alg
 */
export function matchesAlg(before, after, alg) {
  return stateAfter(alg, before).equals(after);
}

/**
 * Réécrit un algo en U/R/F seulement (même effet d'état depuis résolu).
 * Utile pour un follow-along compatible firmware 251 UI.
 * @param {string|string[]} alg
 * @returns {{ urf: string, dist: number } | null}
 */
export function toURF(alg) {
  const state = stateAfter(alg);
  const sol = solveURF(state.cp, state.co);
  if (!sol) return null;
  const urf = invertAlg(sol.join(" "));
  return { urf, dist: parseAlg(urf).length };
}

/**
 * Session d'apprentissage d'un cas (CLL, EG, …) :
 * setup → l'utilisateur exécute → validation par état.
 *
 * @example
 * const s = new CaseSession();
 * s.setupCase("R U R' U R U2 R'"); // scramble vers le cas
 * // … sync FACELETS pendant que l'user résout …
 * s.sync(cp, co);
 * if (s.done) // cas résolu (cible = solved)
 */
export class CaseSession {
  constructor() {
    /** État du cas (après setup) */
    this.setup = new Cube2x2();
    /** Cible (défaut = résolu) */
    this.target = new Cube2x2();
    /** État live (facelets / détecté) */
    this.live = new Cube2x2();
    /** Dernier move inféré (L/D/B possibles) */
    this.lastInferred = null;
    this.inferredMoves = [];
  }

  /**
   * @param {string} setupAlg scramble / setup vers le cas
   * @param {{ targetAlg?: string }} [opts] si omis, cible = résolu
   */
  setupCase(setupAlg, opts = {}) {
    this.setup.reset();
    applyAlg(this.setup, expandAlg(setupAlg).join(" "));
    this.target.reset();
    if (opts.targetAlg) {
      applyAlg(this.target, expandAlg(opts.targetAlg).join(" "));
    }
    this.live = this.setup.clone();
    this.lastInferred = null;
    this.inferredMoves = [];
    return this.status();
  }

  /** Sync depuis FACELETS cube — infère le move si un seul HTM. */
  sync(cp, co) {
    const after = new Cube2x2();
    after.setFromFacelets(cp, co);
    const move = detectMove(this.live, after);
    if (move) {
      this.lastInferred = move;
      this.inferredMoves.push(move);
    } else {
      this.lastInferred = null;
    }
    this.live.setFromFacelets(cp, co);
    return this.status();
  }

  /** Avance manuelle (si tu fais confiance au HW URF). */
  apply(move) {
    if (move && move !== "?") {
      this.live.applyMove(move);
      this.lastInferred = move;
      this.inferredMoves.push(move);
    }
    return this.status();
  }

  status() {
    return {
      done: this.live.equals(this.target),
      solved: this.live.isSolved(),
      atSetup: this.live.equals(this.setup),
      lastInferred: this.lastInferred,
      inferredMoves: this.inferredMoves.slice(),
    };
  }

  get done() {
    return this.live.equals(this.target);
  }
}
