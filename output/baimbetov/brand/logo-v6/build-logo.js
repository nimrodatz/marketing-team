// Builds the Kothar logo family v6 from Nimrod's v5 seal.
// Usage: node build-logo.js <v5.svg> <outDir>
const fs = require('fs');
const path = require('path');
const [src, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const v5 = fs.readFileSync(src, 'utf8');

// Ring text: reuse v5's outlined glyphs untouched (the last <g fill> block).
const ringStart = v5.lastIndexOf('<g fill="#1E1E1E">\n<path transform');
const ringEnd = v5.lastIndexOf('</g>');
const ringInner = v5.slice(ringStart, ringEnd).replace('<g fill="#1E1E1E">', '');

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
const WEIGHTS = { v5: { stem: 1.25, arm: 0.75 }, seal: { stem: 3, arm: 2.6 }, icon: { stem: 4.2, arm: 3.8 } };
function symbol(tx, ty, scale, color, weight) {
  const w = WEIGHTS[weight];
  return `<g transform="translate(${tx} ${ty}) scale(${scale})" fill="${color}">`
    + `<polygon points="-8,4 8,4 0,14.5"/>`
    + `<rect x="${-w.stem / 2}" y="12" width="${w.stem}" height="46"/>`
    + `<polygon points="-12,31.5 0,20.34 0,42.24"/>`
    + `<g stroke="${color}" stroke-width="${w.arm}" stroke-linecap="butt"><line x1="0" y1="20.34" x2="16.5" y2="5"/><line x1="0" y1="42.24" x2="16.5" y2="57"/></g>`
    + `</g>\n`;
}
// Symbol bounds in local units: x -12..16.5, y 4..58 (arm ends add ~arm/2).

const head = (w, h, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}">\n<title>${title}</title>\n`;

function seal(color, weight = 'seal') {
  const fine = weight === 'v5';
  return head(1000, 1000, 'כותר')
    + `<circle cx="500" cy="500" r="468" fill="none" stroke="${color}" stroke-width="${fine ? 4 : 6}"/>\n`
    + `<circle cx="500" cy="500" r="452" fill="none" stroke="${color}" stroke-width="${fine ? 1.4 : 2.4}"/>\n`
    + wordmark(500, 170, 1, color).svg
    + symbol(486.5, 356, 6, color, weight)
    + `<g fill="${color}">${color === INK ? ringInner : ringInner}</g>\n</svg>\n`;
}

function icon(color) {
  // Square 512, symbol centered optically (bbox centre x 2.25, y 31).
  const sc = 8;
  return head(512, 512, 'כותר')
    + symbol((256 - 2.25 * sc).toFixed(2), (256 - 31 * sc).toFixed(2), sc, color, 'icon') + '</svg>\n';
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
for (const [name, body] of Object.entries(files)) fs.writeFileSync(path.join(outDir, name), body);

// Before/after strip for the symbol weight at the sizes the brief tests.
fs.writeFileSync(path.join(outDir, '_compare-symbol.svg'), head(400, 200, 'v5 v6')
  + symbol(100 - 2.25 * 2.6, 100 - 31 * 2.6, 2.6, INK, 'v5') + symbol(300 - 2.25 * 2.6, 100 - 31 * 2.6, 2.6, INK, 'icon') + '</svg>\n');
console.log(Object.keys(files).join('\n'));
