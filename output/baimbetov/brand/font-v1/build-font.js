// Builds a trial hollow, condensed Hebrew display font for Kothar. Original letters, drawn here as
// centre lines, then turned into an outlined shape through a distance field. No dependencies.
// Usage: node build-font.js
const fs = require('fs');
const path = require('path');

const S = 100;          // stroke width
const WALL = 21;        // wall of the hollow
const SHIFT = [6, 6];   // the inner shape moves right and up, so the wall is heavier left and at the bottom
const FX = 0.78;        // horizontal squeeze of the drawings
const SLANT = 14 * Math.PI / 180;  // angle of the cut at open ends
const WOBBLE = 3;       // a small hand tremor on every drawn point
const BEARING = 28;     // side bearing, each side
const STEP = 3;         // field resolution in font units

// Letters in drawing units: y 60 is the bottom centre line, y 640 the top one, y 0 the baseline.
// A point is [x, y] or [x, y, corner radius]. A stroke can carry closed: true.
const closed = pts => Object.assign(pts, { closed: true });
const LETTERS = {
  'א': [[[60, 690], [290, 40]], [[295, 690], [290, 480, 60], [190, 370]], [[50, 0], [55, 200, 50], [150, 320]]],
  'ב': [[[35, 640], [270, 640, 70], [270, 60]], [[20, 60], [315, 60]]],
  'ג': [[[60, 640], [190, 640, 50], [190, 0]], [[190, 230], [30, 0]]],
  'ד': [[[20, 640], [345, 640]], [[265, 640], [265, 0]]],
  'ה': [[[40, 640], [300, 640, 70], [300, 0]], [[60, 470], [60, 0]]],
  'ו': [[[10, 640], [85, 640, 35], [85, 0]]],
  'ז': [[[20, 640], [215, 640]], [[120, 640], [120, 0]]],
  'ח': [[[60, 0], [60, 640], [300, 640, 70], [300, 0]]],
  'ט': [[[60, 690], [60, 60, 80], [330, 60, 80], [330, 640, 60], [190, 640]]],
  'י': [[[10, 640], [90, 640, 30], [90, 370]]],
  'כ': [[[35, 640], [270, 640, 110], [270, 60, 110], [35, 60]]],
  'ך': [[[35, 640], [270, 640, 70], [270, -240]]],
  'ל': [[[60, 950], [60, 560, 30], [285, 560, 70], [285, 280, 80], [130, 0]]],
  'מ': [[[30, 640], [300, 640, 70], [300, 60], [175, 60]], [[95, 640], [60, 0]]],
  'ם': [closed([[60, 60], [60, 640], [300, 640, 50], [300, 60]])],
  'נ': [[[30, 640], [170, 640, 60], [170, 60]], [[20, 60], [225, 60]]],
  'ן': [[[10, 640], [85, 640, 35], [85, -240]]],
  'ס': [closed([[60, 640, 40], [300, 640, 110], [300, 60, 130], [60, 60, 130]]), [[10, 640], [100, 640]]],
  'ע': [[[300, 690], [285, 240, 110], [20, 20]], [[65, 690], [190, 230]]],
  'פ': [[[35, 640], [290, 640, 70], [290, 60, 70], [25, 60]], [[60, 640], [60, 390], [170, 390]]],
  'ף': [[[35, 640], [290, 640, 70], [290, -240]], [[60, 640], [60, 390], [170, 390]]],
  'צ': [[[60, 690], [255, 60]], [[20, 60], [320, 60]], [[315, 690], [300, 420, 80], [170, 300]]],
  'ץ': [[[60, 690], [175, 330, 40], [175, -240]], [[315, 690], [300, 440, 80], [175, 300]]],
  'ק': [[[35, 640], [300, 640, 70], [300, 170]], [[60, 450], [60, -240]]],
  'ר': [[[35, 640], [270, 640, 80], [270, 0]]],
  'ש': [[[60, 690], [60, 60, 80], [440, 60, 80], [440, 690]], [[250, 690], [250, 60]]],
  'ת': [[[30, 640], [300, 640, 70], [300, 0]], [[95, 640], [95, 110, 40], [10, 50]]],
  '.': [[[40, 0], [40, 90]]],
  ',': [[[60, 120], [10, -110]]],
  ':': [[[40, 0], [40, 90]], [[40, 340], [40, 430]]],
  '-': [[[0, 300], [170, 300]]],
  '־': [[[0, 560], [170, 560]]],
  '!': [[[40, 690], [40, 210]], [[40, 0], [40, 90]]],
  '?': [[[0, 640], [170, 640, 70], [170, 360, 70], [80, 330], [80, 210]], [[80, 0], [80, 90]]],
  "'": [[[40, 690], [20, 480]]],
  '"': [[[40, 690], [20, 480]], [[170, 690], [150, 480]]],
};

// Stable pseudo random numbers, so a rebuild gives the same font.
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

const mapY = y => (y === 0 ? 0 : 50 + (y - 60) * (660 / 580));

// Rounds the corners that carry a radius and returns a flat polyline.
function flatten(raw, rand, fx) {
  const pts = raw.map(p => [p[0] * fx + (rand() - 0.5) * 2 * WOBBLE, mapY(p[1]) + (rand() - 0.5) * 2 * WOBBLE, (p[2] || 0) * fx]);
  const n = pts.length, out = [];
  for (let i = 0; i < n; i++) {
    const p = pts[i], a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n];
    const atEnd = !raw.closed && (i === 0 || i === n - 1);
    if (!p[2] || atEnd) { out.push([p[0], p[1]]); continue; }
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const ra = Math.min(p[2], la / 2), rb = Math.min(p[2], lb / 2);
    const p0 = [p[0] + (a[0] - p[0]) * ra / la, p[1] + (a[1] - p[1]) * ra / la];
    const p2 = [p[0] + (b[0] - p[0]) * rb / lb, p[1] + (b[1] - p[1]) * rb / lb];
    for (let k = 0; k <= 14; k++) {
      const t = k / 14, u = 1 - t;
      out.push([u * u * p0[0] + 2 * u * t * p[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p[1] + t * t * p2[1]]);
    }
  }
  if (raw.closed) out.push(out[0]);
  return out;
}

// One record per segment. The first and last segments of an open stroke carry a slanted cut.
function segments(strokes, seed, fx) {
  const rand = rng(seed), segs = [];
  for (const raw of strokes) {
    const line = flatten(raw, rand, fx);
    for (let i = 0; i + 1 < line.length; i++) {
      const [ax, ay] = line[i], [bx, by] = line[i + 1];
      const seg = { ax, ay, dx: bx - ax, dy: by - ay, cuts: [] };
      seg.ll = seg.dx * seg.dx + seg.dy * seg.dy || 1e-9;
      const cut = (px, py, tx, ty) => {
        const l = Math.hypot(tx, ty) || 1, c = Math.cos(SLANT), s = Math.sin(SLANT);
        const ux = tx / l, uy = ty / l;
        seg.cuts.push({ px, py, nx: ux * c - uy * s, ny: ux * s + uy * c });
      };
      if (!raw.closed && i === 0) cut(ax, ay, ax - bx, ay - by);
      if (!raw.closed && i + 2 === line.length) cut(bx, by, bx - ax, by - ay);
      segs.push(seg);
    }
  }
  return segs;
}

// Signed distance to the union of strokes. Negative inside.
function field(segs, x, y, stroke = S) {
  let best = Infinity;
  for (const g of segs) {
    const px = x - g.ax, py = y - g.ay;
    const t = Math.max(0, Math.min(1, (px * g.dx + py * g.dy) / g.ll));
    let d = Math.hypot(px - g.dx * t, py - g.dy * t) - stroke / 2;
    for (const c of g.cuts) d = Math.max(d, (x - c.px) * c.nx + (y - c.py) * c.ny);
    if (d < best) best = d;
  }
  return best;
}

// Marching squares. Each contour keeps the region F < 0 on its right, clockwise around a filled shape.
function contours(F, x0, y0, nx, ny) {
  const vals = new Float64Array((nx + 1) * (ny + 1));
  const at = (i, j) => vals[j * (nx + 1) + i];
  for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) vals[j * (nx + 1) + i] = F(x0 + i * STEP, y0 + j * STEP);
  const point = new Map(), next = new Map();
  const cross = (key, ax, ay, av, bx, by, bv) => {
    if (!point.has(key)) {
      const t = av / (av - bv);
      point.set(key, [ax + (bx - ax) * t, ay + (by - ay) * t]);
    }
    return key;
  };
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const cx = [i, i + 1, i + 1, i], cy = [j, j, j + 1, j + 1];    // corners, counter clockwise
    const edgeKey = [`h${i},${j}`, `v${i + 1},${j}`, `h${i},${j + 1}`, `v${i},${j}`];
    const v = cx.map((c, k) => at(c, cy[k]));
    const list = [];
    for (let k = 0; k < 4; k++) {
      const m = (k + 1) % 4, ia = v[k] < 0, ib = v[m] < 0;
      if (ia === ib) continue;
      cross(edgeKey[k], x0 + cx[k] * STEP, y0 + cy[k] * STEP, v[k], x0 + cx[m] * STEP, y0 + cy[m] * STEP, v[m]);
      list.push({ key: edgeKey[k], entry: ib });
    }
    if (!list.length) continue;
    if (list.length === 2) {
      const en = list.find(e => e.entry), ex = list.find(e => !e.entry);
      next.set(en.key, ex.key);
    } else {
      const centre = (v[0] + v[1] + v[2] + v[3]) / 4 < 0;
      for (let k = 0; k < 4; k++) {
        if (!list[k].entry) continue;
        const partner = centre ? list[(k + 3) % 4] : list[(k + 1) % 4];
        next.set(list[k].key, partner.key);
      }
    }
  }
  const out = [], seen = new Set();
  for (const start of next.keys()) {
    if (seen.has(start)) continue;
    const loop = [];
    let k = start;
    while (k !== undefined && !seen.has(k)) { seen.add(k); loop.push(point.get(k)); k = next.get(k); }
    if (loop.length > 8) out.push(loop);
  }
  return out;
}

// Douglas-Peucker on a closed loop, split at the two farthest points.
function simplify(loop, tol) {
  const dp = (pts) => {
    const keep = new Uint8Array(pts.length);
    keep[0] = keep[pts.length - 1] = 1;
    const stack = [[0, pts.length - 1]];
    while (stack.length) {
      const [a, b] = stack.pop();
      const [ax, ay] = pts[a], [bx, by] = pts[b];
      const l = Math.hypot(bx - ax, by - ay) || 1e-9;
      let bi = -1, bd = tol;
      for (let i = a + 1; i < b; i++) {
        const d = Math.abs((pts[i][0] - ax) * (by - ay) - (pts[i][1] - ay) * (bx - ax)) / l;
        if (d > bd) { bd = d; bi = i; }
      }
      if (bi >= 0) { keep[bi] = 1; stack.push([a, bi], [bi, b]); }
    }
    return pts.filter((_, i) => keep[i]);
  };
  const half = Math.floor(loop.length / 2);
  const first = dp(loop.slice(0, half + 1)), second = dp(loop.slice(half).concat([loop[0]]));
  const merged = first.slice(0, -1).concat(second.slice(0, -1));
  const out = [];
  for (const p of merged) {
    const q = [Math.round(p[0]), Math.round(p[1])], l = out[out.length - 1];
    if (!l || l[0] !== q[0] || l[1] !== q[1]) out.push(q);
  }
  return out;
}

// stroke thins the letter and fx widens it, for filled use; the hollow font itself keeps S and FX.
// drawing replaces the letter's centre lines, for a one-off shape such as the ר in the logo.
function buildGlyph(ch, stroke = S, fx = FX, drawing = LETTERS[ch]) {
  const thinDot = ch === '.' && stroke !== S;                        // a tall thin dot reads as a comma
  const segs = segments(thinDot ? [[[40, 0], [40, 60]]] : drawing, ch.codePointAt(0), fx);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const g of segs) for (const [x, y] of [[g.ax, g.ay], [g.ax + g.dx, g.ay + g.dy]]) {
    minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  const m = S / 2 + 3 * STEP, x0 = minX - m, y0 = minY - m;
  const nx = Math.ceil((maxX - minX + 2 * m) / STEP), ny = Math.ceil((maxY - minY + 2 * m) / STEP);
  const outer = contours((x, y) => field(segs, x, y, stroke), x0, y0, nx, ny);
  const inner = contours((x, y) => field(segs, x - SHIFT[0], y - SHIFT[1], stroke) + WALL, x0, y0, nx, ny);
  const solid = outer.map(l => simplify(l, 0.7)).filter(l => l.length > 2);
  const loops = solid.concat(inner.map(l => simplify(l, 0.7).reverse()).filter(l => l.length > 2));
  const xs = loops.flat().map(p => p[0]);
  const left = Math.min(...xs), right = Math.max(...xs);
  const move = l => l.map(([x, y]) => [x - left + BEARING, y]);
  return { contours: loops.map(move), solid: solid.map(move), advance: right - left + 2 * BEARING };
}

module.exports = { buildGlyph, SPACE_ADVANCE: 190 };
if (require.main !== module) return;

// ---- TrueType writer ----
class Buf {
  constructor() { this.b = []; }
  u8(v) { this.b.push(v & 255); return this; }
  u16(v) { return this.u8(v >> 8).u8(v); }
  i16(v) { return this.u16(v & 0xffff); }
  u32(v) { return this.u16(Math.floor(v / 65536) & 0xffff).u16(v & 0xffff); }
  bytes(a) { for (const x of a) this.b.push(x); return this; }
  pad() { while (this.b.length % 4) this.b.push(0); return this; }
  get length() { return this.b.length; }
}
const utf16be = s => { const o = []; for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); o.push(c >> 8, c & 255); } return o; };

function glyfRecord(g) {
  const b = new Buf();
  if (!g.contours.length) return b;
  const all = g.contours.flat();
  const xs = all.map(p => p[0]), ys = all.map(p => p[1]);
  b.i16(g.contours.length).i16(Math.min(...xs)).i16(Math.min(...ys)).i16(Math.max(...xs)).i16(Math.max(...ys));
  let end = -1;
  for (const c of g.contours) { end += c.length; b.u16(end); }
  b.u16(0);
  for (let i = 0; i < all.length; i++) b.u8(1);
  let px = 0, py = 0;
  for (const p of all) { b.i16(p[0] - px); px = p[0]; }
  for (const p of all) { b.i16(p[1] - py); py = p[1]; }
  while (b.length % 4) b.u8(0);
  return b;
}

function writeFont(file, family, glyphs, cmap) {
  const ASC = 1120, DESC = -340, UPM = 1000;
  const all = glyphs.flatMap(g => g.contours.flat());
  const bx = all.map(p => p[0]), by = all.map(p => p[1]);
  const box = [Math.min(...bx), Math.min(...by), Math.max(...bx), Math.max(...by)];

  const glyf = new Buf(), loca = new Buf();
  for (const g of glyphs) { loca.u32(glyf.length); glyf.bytes(glyfRecord(g).b); }
  loca.u32(glyf.length);

  const hmtx = new Buf();
  for (const g of glyphs) {
    const xs = g.contours.flat().map(p => p[0]);
    hmtx.u16(g.advance).i16(xs.length ? Math.min(...xs) : 0);
  }

  const maxPts = Math.max(...glyphs.map(g => g.contours.flat().length));
  const maxCnt = Math.max(...glyphs.map(g => g.contours.length));
  const maxp = new Buf().u32(0x00010000).u16(glyphs.length).u16(maxPts).u16(maxCnt).u16(0).u16(0).u16(2).u16(0).u16(0).u16(0).u16(0).u16(0).u16(0).u16(0).u16(0);

  const head = new Buf().u32(0x00010000).u32(0x00010000).u32(0).u32(0x5F0F3CF5).u16(0x000B).u16(UPM)
    .u32(0).u32(0).u32(0).u32(0).i16(box[0]).i16(box[1]).i16(box[2]).i16(box[3]).u16(0).u16(8).i16(2).i16(1).i16(0);

  const maxAdv = Math.max(...glyphs.map(g => g.advance));
  const hhea = new Buf().u32(0x00010000).i16(ASC).i16(DESC).i16(0).u16(maxAdv).i16(0).i16(0).i16(box[2])
    .i16(1).i16(0).i16(0).i16(0).i16(0).i16(0).i16(0).i16(0).u16(glyphs.length);

  const cps = Object.keys(cmap).map(Number).sort((a, b) => a - b);
  const segCount = cps.length + 1, floorLog = Math.floor(Math.log2(segCount));
  const sub = new Buf().u16(4).u16(16 + 8 * segCount).u16(0).u16(segCount * 2)
    .u16(2 << floorLog).u16(floorLog).u16(segCount * 2 - (2 << floorLog));
  for (const c of cps) sub.u16(c);
  sub.u16(0xFFFF).u16(0);
  for (const c of cps) sub.u16(c);
  sub.u16(0xFFFF);
  for (const c of cps) sub.u16((cmap[c] - c) & 0xFFFF);
  sub.u16(1);
  for (let i = 0; i < segCount; i++) sub.u16(0);
  const cmapT = new Buf().u16(0).u16(1).u16(3).u16(1).u32(12).bytes(sub.b);

  const names = { 1: family, 2: 'Regular', 3: `${family} trial 1`, 4: family, 5: 'Version 0.1', 6: family.replace(/\s/g, '') + '-Regular' };
  const ids = Object.keys(names).map(Number);
  const name = new Buf().u16(0).u16(ids.length).u16(6 + 12 * ids.length);
  let off = 0;
  for (const id of ids) { const l = utf16be(names[id]).length; name.u16(3).u16(1).u16(0x0409).u16(id).u16(l).u16(off); off += l; }
  for (const id of ids) name.bytes(utf16be(names[id]));

  const os2 = new Buf().u16(4).i16(Math.round(glyphs.reduce((a, g) => a + g.advance, 0) / glyphs.length)).u16(400).u16(5).u16(0)
    .i16(650).i16(600).i16(0).i16(75).i16(650).i16(600).i16(0).i16(350).i16(50).i16(250).i16(0)
    .bytes([2, 0, 5, 3, 0, 0, 0, 0, 0, 0])
    .u32(0x00000800).u32(0).u32(0).u32(0)            // Unicode range: Hebrew
    .bytes([0x4E, 0x4F, 0x4E, 0x45]).u16(0x0040).u16(cps[0]).u16(Math.min(cps[cps.length - 1], 0xFFFF))
    .i16(ASC).i16(DESC).i16(0).u16(ASC).u16(-DESC)
    .u32(0x00000020).u32(0)                          // code page: Hebrew
    .i16(760).i16(760).u16(0).u16(32).u16(0);

  const post = new Buf().u32(0x00030000).u32(0).i16(-100).i16(50).u32(0).u32(0).u32(0).u32(0).u32(0);

  const tables = { 'OS/2': os2, cmap: cmapT, glyf, head, hhea, hmtx, loca, maxp, name, post };
  const tags = Object.keys(tables).sort();
  const sumOf = bytes => {
    let s = 0;
    for (let i = 0; i < bytes.length; i += 4) s = (s + ((bytes[i] << 24 >>> 0) + ((bytes[i + 1] || 0) << 16) + ((bytes[i + 2] || 0) << 8) + (bytes[i + 3] || 0))) >>> 0;
    return s;
  };
  const n = tags.length, lg = Math.floor(Math.log2(n));
  const dir = new Buf().u32(0x00010000).u16(n).u16((1 << lg) * 16).u16(lg).u16(n * 16 - (1 << lg) * 16);
  let at = 12 + 16 * n;
  const body = new Buf();
  let headAt = 0;
  for (const t of tags) {
    const data = tables[t].b;
    dir.bytes([...t.padEnd(4, ' ')].map(c => c.charCodeAt(0))).u32(sumOf(data)).u32(at).u32(data.length);
    if (t === 'head') headAt = at;
    body.bytes(data).pad();
    at += Math.ceil(data.length / 4) * 4;
  }
  const whole = Buffer.from(dir.b.concat(body.b));
  const adjust = (0xB1B0AFBA - sumOf(whole)) >>> 0;
  whole.writeUInt32BE(adjust, headAt + 8);
  fs.writeFileSync(file, whole);
}

const glyphs = [
  { contours: [], advance: 400 },              // .notdef
  { contours: [], advance: 190 },              // space
];
const cmap = { 32: 1, 0xA0: 1 };
for (const ch of Object.keys(LETTERS)) {
  const g = buildGlyph(ch);
  glyphs.push(g);
  cmap[ch.codePointAt(0)] = glyphs.length - 1;
}
const out = path.join(__dirname, 'KotharHollow-trial.ttf');
writeFont(out, 'Kothar Hollow Trial', glyphs, cmap);
console.log(`${glyphs.length} glyphs, ${glyphs.reduce((a, g) => a + g.contours.flat().length, 0)} points, ${fs.statSync(out).size} bytes`);
