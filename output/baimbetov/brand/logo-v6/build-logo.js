// Builds the Kothar logo family v6 from Nimrod's v5 seal.
// Usage: node build-logo.js <v5.svg> <outDir>
const fs = require('fs');
const path = require('path');
const [src, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const v5 = fs.readFileSync(src, 'utf8');

// Ring text. v5 sets "תכנון הנדסי · ניהול · ביצוע · עץ וברזל" in outlined glyphs along the bottom
// arc. We keep its glyph shapes, letter spacing and word spacing, and set the tagline instead
// (Nimrod, 2026-10-29), a little larger. The comma is not in v5: it is v5's dot with a tail.
const V5_RING = 'תכנון הנדסי · ניהול · ביצוע · עץ וברזל';
const RING_TEXT = 'תכנון, הנדסה וביצוע בעץ ובברזל';
const RING_GROW = 1.17;                   // letters ~17% larger than v5
const G_SCALE = 0.036;                    // v5's font-unit to px scale

const glyphRe = /<path transform="translate\(([\d.]+) ([\d.]+)\) rotate\(([-\d.]+)\) translate\(-([\d.]+) 0\) scale\(0\.036 -0\.036\)" d="([^"]+)"\/>/g;
const v5Glyphs = [...v5.matchAll(glyphRe)].map(m => ({ x: +m[1], y: +m[2], rot: +m[3], half: +m[4], d: m[5] }));
const v5Visual = [...V5_RING].reverse();  // the file lists glyphs left to right on screen
const GLYPH = {};
{
  let gi = 0;
  for (const ch of v5Visual) if (ch !== ' ') { const g = v5Glyphs[gi++]; GLYPH[ch] = { d: g.d, half: g.half }; g.ch = ch; }
}
GLYPH[','] = { half: GLYPH['·'].half, d: 'M118.00 124.00 L213.00 124.00 L213.00 16.00 L168.00 -120.00 L118.00 -120.00 L150.00 16.00 L118.00 16.00 Z' };

// Measure v5's arc: radius, tracking between letters and the extra width of a word space.
const RING_R = v5Glyphs.reduce((a, g) => a + Math.hypot(g.x - 500, g.y - 500), 0) / v5Glyphs.length;
const median = a => a.sort((p, q) => p - q)[Math.floor(a.length / 2)];
const tracks = [], spaces = [];
{
  let gi = 0;
  for (let i = 0; i < v5Visual.length; i++) {
    if (v5Visual[i] === ' ') continue;
    const a = v5Glyphs[gi], b = v5Glyphs[gi + 1];
    if (!b) break;
    const gap = RING_R * (a.rot - b.rot) * Math.PI / 180 - a.half - b.half;
    (v5Visual[i + 1] === ' ' ? spaces : tracks).push(gap);
    gi++;
  }
}
const TRACK = median(tracks), SPACE = median(spaces);

function ringLayout(text) {
  const k = RING_GROW, s = G_SCALE * k;
  const seq = [...text].reverse();
  let len = 0;
  const items = seq.map((ch, i) => {
    if (ch === ' ') return null;
    const g = GLYPH[ch];
    if (!g) throw new Error(`no glyph for "${ch}"`);
    const half = g.half * k;
    const prev = seq[i - 1];
    if (i > 0) len += prev === ' ' ? SPACE * k : TRACK * k;
    const at = len + half;
    len += 2 * half;
    return { ch, g, half, at };
  }).filter(Boolean);
  const start = 90 + (len / 2) / RING_R * 180 / Math.PI;   // degrees, SVG angles (y down), bottom = 90
  let minX = Infinity, maxX = -Infinity, paths = '';
  for (const it of items) {
    const th = start - it.at / RING_R * 180 / Math.PI;
    const cx = 500 + RING_R * Math.cos(th * Math.PI / 180), cy = 500 + RING_R * Math.sin(th * Math.PI / 180);
    const rot = th - 90;
    paths += `<path transform="translate(${cx.toFixed(2)} ${cy.toFixed(2)}) rotate(${rot.toFixed(2)}) translate(-${it.half.toFixed(2)} 0) scale(${s.toFixed(4)} -${s.toFixed(4)})" d="${it.g.d}"/>\n`;
    const c = Math.cos(rot * Math.PI / 180), sn = Math.sin(rot * Math.PI / 180);
    const nums = it.g.d.match(/-?\d+(\.\d+)?/g).map(Number);
    for (let j = 0; j < nums.length; j += 2) {
      const lx = nums[j] * s - it.half, ly = -nums[j + 1] * s;
      const X = cx + lx * c - ly * sn;
      minX = Math.min(minX, X); maxX = Math.max(maxX, X);
    }
  }
  return { paths, minX, maxX };
}
const RING = ringLayout(RING_TEXT);
const ringInner = RING.paths;

// The same glyphs on a straight baseline (the tagline under the wordmark). s = px per font unit.
function lineText(text, x0, baseline, s, color) {
  const k = s / G_SCALE, seq = [...text].reverse();
  let x = x0, out = '';
  seq.forEach((ch, i) => {
    if (ch === ' ') return;
    if (i > 0) x += (seq[i - 1] === ' ' ? SPACE : TRACK) * k;
    const g = GLYPH[ch];
    out += `<path transform="translate(${x.toFixed(2)} ${baseline.toFixed(2)}) scale(${s.toFixed(4)} -${s.toFixed(4)})" d="${g.d}"/>`;
    x += 2 * g.half * k;
  });
  return { svg: `<g fill="${color}">${out}</g>\n`, width: x - x0 };
}

const INK = '#1E1E1E';

// Wordmark. Fix 3: every letter opens with the same flick, shoulders share one curve,
// ר gets a straight leg, ו's head drops to the common top line, gaps are equal.
// Niqqud: כּוֹתַר with dagesh (it was missing in v5, which read "khotar").
const SCALE = 1.3;
let STROKE = 8; // v5: 6.5, raised to match the heavier symbol; the fine variant keeps 6.5
const letters = [ // left to right on screen = ר ת ו כ
  { x0: 5, x1: 66, d: ['M5 4 C5 8 8 10 15 10 L44 10 C58 10 66 20 66 36 L66 100'] },
  // ת: the right leg drops straight, no foot. v5's hook closed the bottom right and read as מ.
  { x0: 4, x1: 70, d: ['M5 4 C5 8 8 10 15 10 L48 10 C62 10 70 20 70 36 L70 100',
                       'M20 10 C14 30 12 48 16 63 C19 75 20 88 18 100 L4 100'],
    niqqud: ['M23 122 L51 122'] },                     // patach
  { x0: 5, x1: 18, d: ['M5 4 C5 8 8 10 13 10 C16 10 18 13 18 18 L18 100'],
    niqqud: ['M9 -12 L9.01 -12'] },                    // holam
  { x0: 5, x1: 68, d: ['M5 4 C5 8 8 10 15 10 L40 10 C58 10 68 26 68 52 C68 82 54 100 30 100 L6 100'],
    niqqud: ['M38 55 L38.01 55'] },                    // dagesh
];
const GAP = 26;

function wordmark(cx, top, scale, color, withNiqqud = true) {
  const s = scale * SCALE;
  const total = letters.reduce((a, l) => a + (l.x1 - l.x0) * s, 0) + GAP * scale * (letters.length - 1);
  let x = cx - total / 2;
  let out = '';
  for (const l of letters) {
    const tx = x - l.x0 * s;
    const paths = l.d.concat(withNiqqud && l.niqqud ? l.niqqud : []);
    out += `<g transform="translate(${tx.toFixed(2)} ${top.toFixed(2)}) scale(${s.toFixed(4)})" fill="none" stroke="${color}" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round">`
      + paths.map(d => `<path d="${d}"/>`).join('') + '</g>\n';
    x += (l.x1 - l.x0) * s + GAP * scale;
  }
  return { svg: out, width: total };
}

// Symbol: K and a pillar with a capital. Fix 1: the stem and arms move toward the
// solid triangles. weight 'seal' for the round seal, 'icon' for small sizes.
const WEIGHTS = { v5: { stem: 1.25, arm: 0.75, tail: 0.75 }, seal: { stem: 3, arm: 2.6, tail: 1.1 }, icon: { stem: 4.2, arm: 3.8, tail: 1.6 } };

// Ugaritic כ and ר in wedges, from Nimrod's samples: a horizontal wedge (head, thin tail)
// led by small stacked heads, one column for כ and two for ר. Drawn small and solid like the ת,
// centred on the ת's left-pointing triangle (y 31.5), כ to its left and ר to its right.
const CW = { sw: 2.6, sh: 3.2, bw: 6, bh: 7.2, gap: 0.5, tail: 7 };
const CUNEI = { k: { cols: 1 }, r: { cols: 2 } };
for (const l of Object.values(CUNEI)) {
  l.headX = l.cols * (CW.sw + CW.gap);
  l.tailTo = l.headX + CW.bw + CW.tail;   // also the letter's width
}
function cuneiform(letter, x, y, color, tail) {
  const { cols, tailTo, headX } = CUNEI[letter];
  const { sw, sh, bw, bh, gap } = CW;
  const tri = (x0, cy, w, h) => `<polygon points="${x0},${cy - h / 2} ${x0},${cy + h / 2} ${x0 + w},${cy}"/>`;
  let out = '';
  const dy = (sh + gap) / 2;
  for (let c = 0; c < cols; c++) out += tri(x + c * (sw + gap), y - dy, sw, sh) + tri(x + c * (sw + gap), y + dy, sw, sh);
  const bx = x + headX;
  out += tri(bx, y, bw, bh);
  out += `<line x1="${bx + bw}" y1="${y}" x2="${x + tailTo}" y2="${y}" stroke="${color}" stroke-width="${tail}" stroke-linecap="butt"/>`;
  return out;
}
// The ת stays centred in the circle (x 2.25). The letters' outer edges line up with the start and
// end of the ring sentence, taken from the ring layout (symbol at 486.5, scale 6).
const RING_EDGE = { left: (RING.minX - 486.5) / 6, right: (RING.maxX - 486.5) / 6 };
const KR = { kX: RING_EDGE.left, rX: RING_EDGE.right - CUNEI.r.tailTo, cx: 2.25 };
// Without the ring (horizontal, symbol), the letters sit closer: centres 27.25 units each side of the ת.
const KR_NEAR = { kX: 2.25 - 27.25 - CUNEI.k.tailTo / 2, rX: 2.25 + 27.25 - CUNEI.r.tailTo / 2 };

function symbol(tx, ty, scale, color, weight, letters = false) {
  const w = WEIGHTS[weight];
  return `<g transform="translate(${tx} ${ty}) scale(${scale})" fill="${color}">`
    + `<polygon points="-8,4 8,4 0,14.5"/>`
    + `<rect x="${-w.stem / 2}" y="12" width="${w.stem}" height="46"/>`
    + `<polygon points="-12,31.5 0,20.34 0,42.24"/>`
    + `<g stroke="${color}" stroke-width="${w.arm}" stroke-linecap="butt"><line x1="0" y1="20.34" x2="16.5" y2="5"/><line x1="0" y1="42.24" x2="16.5" y2="57"/></g>`
    + (letters ? cuneiform('k', (letters.kX ?? KR.kX), 31.5, color, w.tail) + cuneiform('r', (letters.rX ?? KR.rX), 31.5, color, w.tail) : '')
    + `</g>\n`;
}
// Symbol bounds in local units: x -12..16.5, y 4..58 (arm ends add ~arm/2).

const head = (w, h, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}">\n<title>${title}</title>\n`;

function seal(color, weight = 'seal', letters = false) {
  const fine = weight === 'v5';
  return head(1000, 1000, 'כותר')
    + `<circle cx="500" cy="500" r="468" fill="none" stroke="${color}" stroke-width="${fine ? 4 : 6}"/>\n`
    + `<circle cx="500" cy="500" r="452" fill="none" stroke="${color}" stroke-width="${fine ? 1.4 : 2.4}"/>\n`
    + wordmark(500, 170, 1, color).svg
    + symbol(500 - (letters ? KR.cx : 2.25) * 6, 356, 6, color, weight, letters)
    + `<g fill="${color}">${color === INK ? ringInner : ringInner}</g>\n</svg>\n`;
}

function icon(color, letters = false, weight = 'icon') {
  // Square 512, symbol centered optically (bbox centre x 2.25, y 31). With letters the group is wider.
  const sc = letters ? 6 : 8;             // with letters the group spans ~73 units
  return head(512, 512, 'כותר')
    + symbol((256 - 2.25 * sc).toFixed(2), (256 - 31 * sc).toFixed(2), sc, color, weight, letters ? KR_NEAR : false) + '</svg>\n';
}

// Invoice, quote and site header: the symbol with כ and ר at the start (right), centred on the
// height of the word to its left (Nimrod, 2026-10-29), and the tagline on a straight line under
// both, as wide as the whole row so it stays readable at invoice size.
function horizontalKR(color) {
  const wm = wordmark(0, 0, 1, color);
  const symSc = 3, pad = 30, gap = 64;
  const symL = KR_NEAR.kX, symR = KR_NEAR.rX + CUNEI.r.tailTo;
  const symW = (symR - symL) * symSc;
  const rowW = wm.width + gap + symW;
  const tag0 = lineText(RING_TEXT, 0, 0, G_SCALE, color);
  const s = G_SCALE * rowW / tag0.width;
  const W = Math.ceil(pad + rowW + pad);
  const letterTop = 46;                                              // holam clears the top by 30
  const letterMid = letterTop + 52 * SCALE;                          // letters span 4..100 local
  const baseline = letterTop + 122 * SCALE + 26 + 584 * s;           // patach, air, then the tagline's cap height
  const H = Math.ceil(baseline + 171 * s + 30);                      // room for ן and ץ
  return head(W, H, 'כותר')
    + wordmark(pad + wm.width / 2, letterTop, 1, color).svg
    + lineText(RING_TEXT, pad, baseline, s, color).svg
    + symbol((W - pad - symR * symSc).toFixed(2), (letterMid - 31 * symSc).toFixed(2), symSc, color, 'v5', KR_NEAR)
    + '</svg>\n';
}

function horizontal(color, weight = 'icon') {
  // RTL: the symbol stands at the start (right), the word to its left.
  const H = 210, scale = 1;
  const wm = wordmark(0, 0, scale, color);
  const symSc = 3;                         // symbol 54 units -> 162px, a little taller than the letters
  const symW = 28.5 * symSc, pad = 30, gap = 64;
  const W = Math.ceil(pad + wm.width + gap + symW + pad);
  const wmCx = pad + wm.width / 2;
  const symTx = W - pad - 16.5 * symSc;
  const letterTop = 35;                    // letters span 4..100 local -> ~125px
  return head(W, H, 'כותר')
    + wordmark(wmCx, letterTop, scale, color).svg
    + symbol(symTx.toFixed(2), (letterTop + 52 * SCALE - 31 * symSc).toFixed(2), symSc, color, weight) // centred on the letters
    + '</svg>\n';
}

const files = {
  'kothar-seal-v6.svg': seal(INK),
  'kothar-seal-v6-white.svg': seal('#FFFFFF'),
  'kothar-symbol-v6.svg': icon(INK),
  'kothar-symbol-v6-white.svg': icon('#FFFFFF'),
  'kothar-horizontal-v6.svg': horizontal(INK),
  'kothar-horizontal-v6-white.svg': horizontal('#FFFFFF'),
};
// Fine variant: v5's thin stem and arms, v5's letter stroke, with this round's letter fixes.
// Large uses only (wall, print, site hero); it does not hold at small sizes or in burning.
STROKE = 6.5;
files['kothar-seal-v6-fine.svg'] = seal(INK, 'v5');
files['kothar-seal-v6-fine-white.svg'] = seal('#FFFFFF', 'v5');
files['kothar-horizontal-v6-fine.svg'] = horizontal(INK, 'v5');
// ת flanked by the Ugaritic כ and ר, fine weight only (Nimrod, 2026-10-29). Large uses; the letters vanish under ~64px.
files['kothar-seal-v6-fine-kr.svg'] = seal(INK, 'v5', true);
files['kothar-seal-v6-fine-kr-white.svg'] = seal('#FFFFFF', 'v5', true);
files['kothar-symbol-v6-fine-kr.svg'] = icon(INK, true, 'v5');
files['kothar-symbol-v6-fine-kr-white.svg'] = icon('#FFFFFF', true, 'v5');
files['kothar-horizontal-v6-fine-kr.svg'] = horizontalKR(INK);
files['kothar-horizontal-v6-fine-kr-white.svg'] = horizontalKR('#FFFFFF');
for (const [name, body] of Object.entries(files)) fs.writeFileSync(path.join(outDir, name), body);

// Before/after strip for the symbol weight at the sizes the brief tests.
fs.writeFileSync(path.join(outDir, '_compare-symbol.svg'), head(400, 200, 'v5 v6')
  + symbol(100 - 2.25 * 2.6, 100 - 31 * 2.6, 2.6, INK, 'v5') + symbol(300 - 2.25 * 2.6, 100 - 31 * 2.6, 2.6, INK, 'icon') + '</svg>\n');
console.log(Object.keys(files).join('\n'));
