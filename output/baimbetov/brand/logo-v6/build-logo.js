// Builds the Kothar logo family v6 from Nimrod's v5 seal.
// Usage: node build-logo.js <v5.svg> <outDir>
const fs = require('fs');
const path = require('path');
const { buildGlyph, SPACE_ADVANCE } = require('../font-v1/build-font.js');
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

GLYPH['.'] = { half: GLYPH['·'].half, d: 'M118.00 124.00 L213.00 124.00 L213.00 16.00 L118.00 16.00 Z' };
// מ is not in v5 either. Built on v5's ת: same roof, leg with its foot and right stem, plus a base that stops
// short of the leg. A short leg over a long base read as פ.
GLYPH['מ'] = { half: GLYPH['ת'].half, d: GLYPH['ת'].d
  .replace('C543.75 259.58 536.00 16.00 536.00 16.00C536.00 16.00 594.00 16.00 594.00 16.00', 'C541.00 270.00 536.00 68.00 536.00 68.00 L275.00 68.00 L275.00 16.00 L594.00 16.00') };

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

// Trial without the two rings (Nimrod, 2026-11-02), fine weight with כ and ר. 'arc' keeps the sentence
// on its arc, 'line' sets it straight, as wide as the arc's span. 'line-large' is that line 1.4x larger,
// wider than the symbol; 'two-lines' breaks it in two, the long line as wide as the arc's span, so the
// letters grow without widening the logo. Tight canvas, 60px of air on each side.
function sealNoRing(color, mode) {
  const span = RING.maxX - RING.minX, mid = (RING.minX + RING.maxX) / 2;
  const widthAt1 = t => lineText(t, 0, 0, G_SCALE, color).width;     // width at v5's scale
  const lines = { 'two-lines': ['תכנון, הנדסה וביצוע', 'בעץ ובברזל'], 'metal': ['תכנון. הנדסה. ביצוע', 'עץ ומתכת'] }[mode] || [RING_TEXT];
  const s = G_SCALE * span / widthAt1(lines[0]) * (mode === 'line-large' ? 1.4 : 1);
  const textHalf = widthAt1(lines[0]) * s / G_SCALE / 2;
  const air = 60, half = Math.max(500 - RING.minX, RING.maxX - 500, mode === 'arc' ? 0 : textHalf) + air;
  const x0 = 500 - half, y0 = 150 - air;                             // 150: top of the holam
  const first = 704 + (lines.length > 1 ? 62 : 44) + 584 * s, leading = 1180 * s; // symbol's foot, air, the line's cap height
  const last = first + (lines.length - 1) * leading;
  const bottom = mode === 'arc' ? 916 : last + 171 * s;              // room for ן and ץ
  const text = mode === 'arc' ? `<g fill="${color}">${ringInner}</g>\n`
    : lines.map((t, i) => lineText(t, mid - widthAt1(t) * s / G_SCALE / 2, first + i * leading, s, color).svg).join('');
  return head(Math.ceil(half * 2), Math.ceil(bottom + air - y0), 'כותר')
    + `<g transform="translate(${(-x0).toFixed(2)} ${-y0})">\n`
    + wordmark(500, 170, 1, color).svg
    + symbol(500 - KR.cx * 6, 356, 6, color, 'v5', true)
    + text + '</g>\n</svg>\n';
}

// Text set in the trial font (../font-v1), from its outlines. filled drops the hollow.
const FONT_CACHE = {};
function fontLine(text, cx, baseline, em, color, filled = false, stroke = undefined, fx = undefined, drawings = {}) {
  const k = em / 1000, seq = [...text].reverse();
  const glyphOf = ch => (FONT_CACHE[`${ch}|${stroke}|${fx}|${!!drawings[ch]}`] ||= buildGlyph(ch, stroke, fx, drawings[ch]));
  const width = seq.reduce((a, ch) => a + (ch === ' ' ? SPACE_ADVANCE : glyphOf(ch).advance) * k, 0);
  let x = cx - width / 2, out = '';
  const slots = {};
  for (const ch of seq) {
    if (ch === ' ') { x += SPACE_ADVANCE * k; continue; }
    const g = glyphOf(ch), loops = filled ? g.solid : g.contours;
    const d = loops.map(l => 'M' + l.map(p => p.join(' ')).join('L') + 'Z').join('');
    out += `<path transform="translate(${x.toFixed(2)} ${baseline.toFixed(2)}) scale(${k.toFixed(4)} -${k.toFixed(4)})" d="${d}"/>\n`;
    slots[ch] = { x, w: g.advance * k };
    x += g.advance * k;
  }
  return { svg: `<g fill="${color}">\n${out}</g>\n`, width, slots };
}

// No rings, the dictated sentence in the hollow trial font on two lines. 'keep' leaves the drawn wordmark
// as it is; 'solid' sets כותר in the same font, filled, with the niqqud the logo always carries.
// thinTag sets the sentence filled, with a thinner stroke than the font's 100.
const TAG_EM = 118;
// flank moves the Ugaritic כ and ר beside the word, 25% smaller, and gives the word's ר a longer roof
// and a shorter leg, so it does not read as ך. The canvas then tightens to the widest row.
const FLANK_SCALE = 4.5, FLANK_GAP = 34;
const R_DRAWING = [[[-15, 640], [270, 640, 80], [270, 40]]];

// כותר filled in the font's style, with niqqud and, with flank, the Ugaritic letters beside it.
// em 230 is the size the niqqud and the flank were set at; other sizes scale from it.
function solidWord(cx, base, em, color, stroke, fx, flank, fixR = flank) {
  const f = em / 230, k = em / 1000;
  const line = fontLine('כותר', cx, base, em, color, true, stroke, fx, fixR ? { ר: R_DRAWING } : {});
  const dot = (x, y, r) => `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r}" fill="${color}"/>\n`;
  const { כ: kaf, ו: vav, ת: tav } = line.slots;
  let svg = line.svg
    + dot(kaf.x + kaf.w * 0.42, base - 380 * k, 8 * f)               // dagesh
    + dot(vav.x + vav.w * 0.5 - 6 * f, base - 760 * k - 20 * f, 8 * f) // holam
    + `<rect x="${(tav.x + tav.w * 0.22).toFixed(2)}" y="${base + 12 * f}" width="${(tav.w * 0.56).toFixed(2)}" height="${9 * f}" fill="${color}"/>\n`; // patach
  const left = line.width / 2 + (flank ? FLANK_GAP * f + CUNEI.k.tailTo * FLANK_SCALE * f : 0);
  const right = line.width / 2 + (flank ? FLANK_GAP * f + CUNEI.r.tailTo * FLANK_SCALE * f : 0);
  if (flank) {
    const mid = base - 380 * k, tail = WEIGHTS.v5.tail, place = (l, x) =>
      `<g transform="translate(${x.toFixed(2)} ${mid.toFixed(2)}) scale(${FLANK_SCALE * f})" fill="${color}">${cuneiform(l, 0, 0, color, tail)}</g>\n`;
    svg += place('k', cx - left) + place('r', cx + line.width / 2 + FLANK_GAP * f);
  }
  return { svg, left, right };
}

// Final logo's settings (option 11, Nimrod, 2026-11-02).
const FINAL = { wordStroke: 84, wordFx: 0.95, tagStroke: 50, lines: ['תכנון. הנדסה. ביצוע', 'עץ ומתכת'] };

// Name and symbol on one row, the symbol at the start (right) and as tall as the letters, the sentence under
// both and as wide as the row (Nimrod, 2026-11-02). No Ugaritic letters.
function lockup(color) {
  const pad = 12, em = 230, gap = 40, base = pad + 215, capTop = base - 0.76 * em;
  const symSc = 0.76 * em / 54;                                      // the symbol spans y 4..58
  const wordW = solidWord(0, 0, em, color, FINAL.wordStroke, FINAL.wordFx, false, true).left * 2;
  const rowW = wordW + gap + 28.5 * symSc;
  const widthAt = e => fontLine(FINAL.lines[0], 0, 0, e, color, true, FINAL.tagStroke).width;
  const tagEm = 100 * rowW / widthAt(100), cx = pad + rowW / 2;
  const b1 = base + 21 + 34 + 0.76 * tagEm, b2 = b1 + 1.12 * tagEm;
  return head(Math.ceil(rowW + 2 * pad), Math.ceil(b2 + 0.29 * tagEm + pad), 'כותר')
    + solidWord(pad + wordW / 2, base, em, color, FINAL.wordStroke, FINAL.wordFx, false, true).svg
    + symbol((pad + wordW + gap + 12 * symSc).toFixed(2), (capTop - 4 * symSc).toFixed(2), symSc.toFixed(4), color, 'seal')
    + fontLine(FINAL.lines[0], cx, b1, tagEm, color, true, FINAL.tagStroke).svg
    + fontLine(FINAL.lines[1], cx, b2, tagEm, color, true, FINAL.tagStroke).svg
    + '</svg>\n';
}

// Horizontal row (Nimrod, 2026-11-02): no Ugaritic letters, the symbol at option 11's size to the right of the
// name. 'under' sets the sentence on one line below both, 'beside' below the name only, next to the symbol's
// foot, and 'bare' leaves it out. The smaller the sentence, the heavier its stroke, so it holds.
function horizontalRow(color, mode) {
  const pad = 16, em = 230, gap = 40, symSc = 6, symH = 54 * symSc;
  const oneLine = 'תכנון. הנדסה. ביצוע. עץ ומתכת';
  const wordW = solidWord(0, 0, em, color, FINAL.wordStroke, FINAL.wordFx, false, true).left * 2;
  const rowW = wordW + gap + 28.5 * symSc, mid = pad + symH / 2;
  const stroke = mode === 'beside' ? 72 : 60;
  const widthAt = e => fontLine(oneLine, 0, 0, e, color, true, stroke).width;
  const lineW = mode === 'beside' ? wordW : rowW, tagEm = 100 * lineW / widthAt(100);
  let base = mid + 0.38 * em, tag = '', bottom = pad + symH;
  if (mode === 'beside') {
    const air = 22, block = 215 + 21 + air + (0.76 + 0.29) * tagEm;
    base = mid - block / 2 + 215;
    const b = base + 21 + air + 0.76 * tagEm;
    tag = fontLine(oneLine, pad + wordW / 2, b, tagEm, color, true, stroke).svg;
    bottom = Math.max(bottom, b + 0.29 * tagEm);
  } else if (mode === 'under') {
    const b = pad + symH + 30 + 0.76 * tagEm;
    tag = fontLine(oneLine, pad + rowW / 2, b, tagEm, color, true, stroke).svg;
    bottom = b + 0.29 * tagEm;
  }
  return head(Math.ceil(rowW + 2 * pad), Math.ceil(bottom + pad), 'כותר')
    + solidWord(pad + wordW / 2, base, em, color, FINAL.wordStroke, FINAL.wordFx, false, true).svg
    + symbol((pad + wordW + gap + 12 * symSc).toFixed(2), pad - 4 * symSc, symSc, color, 'v5')
    + tag + '</svg>\n';
}

// Site header with the sentence (Nimrod, 2026-11-02). 'side' keeps option 14's symbol and sets the sentence on one
// line to the left of the name, a long row whose letters stay readable at header height. 'compact' keeps the
// sentence below, with the symbol as tall as the letters, so the block is narrow.
const ONE_LINE = 'תכנון. הנדסה. ביצוע. עץ ומתכת';
function headerSentence(color, mode) {
  const pad = 12, em = 230, gap = 40, stroke = 72;
  const wordW = solidWord(0, 0, em, color, FINAL.wordStroke, FINAL.wordFx, false, true).left * 2;
  const word = (cx, base) => solidWord(cx, base, em, color, FINAL.wordStroke, FINAL.wordFx, false, true).svg;
  const line = (cx, b, e) => fontLine(ONE_LINE, cx, b, e, color, true, stroke);
  if (mode === 'side') {
    const symSc = 6, symH = 54 * symSc, tagEm = 110, mid = pad + symH / 2, sep = 56;
    const lineW = line(0, 0, tagEm).width;
    const wordX = pad + lineW + sep;
    return head(Math.ceil(wordX + wordW + gap + 28.5 * symSc + pad), Math.ceil(symH + 2 * pad), 'כותר')
      + line(pad + lineW / 2, mid + 0.38 * tagEm, tagEm).svg
      + word(wordX + wordW / 2, mid + 0.38 * em)
      + symbol((wordX + wordW + gap + 12 * symSc).toFixed(2), pad - 4 * symSc, symSc, color, 'v5')
      + '</svg>\n';
  }
  const base = pad + 215, symSc = 0.76 * em / 54, rowW = wordW + gap + 28.5 * symSc;
  const tagEm = 100 * rowW / line(0, 0, 100).width, b = base + 21 + 26 + 0.76 * tagEm;
  return head(Math.ceil(rowW + 2 * pad), Math.ceil(b + 0.29 * tagEm + pad), 'כותר')
    + word(pad + wordW / 2, base)
    + symbol((pad + wordW + gap + 12 * symSc).toFixed(2), (base - 0.76 * em - 4 * symSc).toFixed(2), symSc.toFixed(4), color, 'seal')
    + line(pad + rowW / 2, b, tagEm).svg
    + '</svg>\n';
}

// Site header: the word and the Ugaritic letters only. No symbol and no sentence, so it holds at 40-60px high.
function wordHeader(color) {
  const pad = 12, w = solidWord(0, 0, 230, color, FINAL.wordStroke, FINAL.wordFx, true);
  const top = 215, bottom = 21;                                      // holam above the baseline, patach below it
  const W = Math.ceil(w.left + w.right + 2 * pad), H = Math.ceil(top + bottom + 2 * pad);
  return head(W, H, 'כותר') + `<g transform="translate(${(w.left + pad).toFixed(2)} ${top + pad})">\n${w.svg}</g>\n</svg>\n`;
}

// One long row, centred on y = 0 and starting at x = 0: the sentence on two lines at the left, the word at the right.
function strip(color, em, tagEm, gap) {
  const lineOf = (t, cx, b) => fontLine(t, cx, b, tagEm, color, true, FINAL.tagStroke);
  const tagW = lineOf(FINAL.lines[0], 0, 0).width;
  const block = (0.76 + 1.12) * tagEm, b1 = -block / 2 + 0.76 * tagEm, b2 = b1 + 1.12 * tagEm;
  const base = 0.38 * em;
  const probe = solidWord(0, base, em, color, FINAL.wordStroke, FINAL.wordFx, true);
  const cx = tagW + gap + probe.left;
  const word = solidWord(cx, base, em, color, FINAL.wordStroke, FINAL.wordFx, true);
  const f = em / 230;
  return {
    svg: lineOf(FINAL.lines[0], tagW / 2, b1).svg + lineOf(FINAL.lines[1], tagW / 2, b2).svg + word.svg,
    length: cx + word.right,
    half: Math.max(block / 2 + 0.29 * tagEm, 0.38 * em + 28 * f),
  };
}

// Invoice and quote header: the symbol at the start (right), then the word, then the sentence.
function invoiceRow(color) {
  const pad = 20, gap = 50, s = strip(color, 150, 78, gap), symSc = 3;
  const half = Math.max(s.half, 81 + 4);                             // the symbol is 162 high
  const H = Math.ceil(2 * (half + pad)), mid = H / 2;
  const symTx = pad + s.length + gap + 12 * symSc;
  const W = Math.ceil(symTx + 16.5 * symSc + pad);
  return head(W, H, 'כותר')
    + `<g transform="translate(${pad} ${mid})">\n${s.svg}</g>\n`
    + symbol(symTx.toFixed(2), (mid - 31 * symSc).toFixed(2), symSc, color, 'v5')
    + '</svg>\n';
}

// Vertical strip: the symbol upright on top, and the row turned 90 degrees, reading from the top down.
function verticalStrip(color) {
  const pad = 20, gap = 50, s = strip(color, 150, 78, gap), symSc = 3;
  const halfW = Math.max(s.half, 2.25 * symSc + 16.5 * symSc);
  const W = Math.ceil(2 * (halfW + pad)), cx = W / 2;
  const top = pad + 162 + gap, H = Math.ceil(top + s.length + pad);
  return head(W, H, 'כותר')
    + symbol((cx - 2.25 * symSc).toFixed(2), pad - 4 * symSc, symSc, color, 'v5')
    + `<g transform="translate(${cx} ${(top + s.length).toFixed(2)}) rotate(-90)">\n${s.svg}</g>\n`
    + '</svg>\n';
}
function sealFontTag(color, word, thinTag = 0, wordStroke = undefined, wordFx = undefined, flank = false) {
  const air = 60;
  let half = Math.max(500 - RING.minX, RING.maxX - 500) + air;
  if (flank) {
    const wordW = fontLine('כותר', 500, 0, 230, color, true, wordStroke, wordFx, { ר: R_DRAWING }).width;
    const row = wordW / 2 + FLANK_GAP + CUNEI.r.tailTo * FLANK_SCALE;
    const tag = fontLine('תכנון. הנדסה. ביצוע', 500, 0, TAG_EM, color, !!thinTag, thinTag || undefined).width / 2;
    half = Math.max(row, tag) + air;
  }
  const x0 = 500 - half, y0 = (word === 'keep' ? 150 : 118) - air;
  const b1 = 704 + 54 + 0.76 * TAG_EM, b2 = b1 + 1.12 * TAG_EM;
  let wm;
  if (word === 'keep') wm = wordmark(500, 170, 1, color).svg;
  else wm = solidWord(500, 322, 230, color, wordStroke, wordFx, flank).svg;
  return head(Math.ceil(half * 2), Math.ceil(b2 + 0.29 * TAG_EM + air - y0), 'כותר')
    + `<g transform="translate(${(-x0).toFixed(2)} ${-y0})">\n`
    + wm
    + symbol(500 - KR.cx * 6, 356, 6, color, 'v5', !flank)
    + fontLine('תכנון. הנדסה. ביצוע', 500, b1, TAG_EM, color, !!thinTag, thinTag || undefined).svg
    + fontLine('עץ ומתכת', 500, b2, TAG_EM, color, !!thinTag, thinTag || undefined).svg
    + '</g>\n</svg>\n';
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
files['kothar-noring-arc-v6-fine-kr.svg'] = sealNoRing(INK, 'arc');
files['kothar-noring-arc-v6-fine-kr-white.svg'] = sealNoRing('#FFFFFF', 'arc');
files['kothar-noring-line-v6-fine-kr.svg'] = sealNoRing(INK, 'line');
files['kothar-noring-line-v6-fine-kr-white.svg'] = sealNoRing('#FFFFFF', 'line');
files['kothar-noring-line-large-v6-fine-kr.svg'] = sealNoRing(INK, 'line-large');
files['kothar-noring-line-large-v6-fine-kr-white.svg'] = sealNoRing('#FFFFFF', 'line-large');
files['kothar-noring-two-lines-v6-fine-kr.svg'] = sealNoRing(INK, 'two-lines');
files['kothar-noring-two-lines-v6-fine-kr-white.svg'] = sealNoRing('#FFFFFF', 'two-lines');
files['kothar-noring-metal-v6-fine-kr.svg'] = sealNoRing(INK, 'metal');
files['kothar-noring-metal-v6-fine-kr-white.svg'] = sealNoRing('#FFFFFF', 'metal');
files['kothar-fonttag-keep-v6-fine-kr.svg'] = sealFontTag(INK, 'keep');
files['kothar-fonttag-keep-v6-fine-kr-white.svg'] = sealFontTag('#FFFFFF', 'keep');
files['kothar-fonttag-solid-v6-fine-kr.svg'] = sealFontTag(INK, 'solid');
files['kothar-fonttag-solid-v6-fine-kr-white.svg'] = sealFontTag('#FFFFFF', 'solid');
files['kothar-fonttag-solid-thin-v6-fine-kr.svg'] = sealFontTag(INK, 'solid', 50);
files['kothar-fonttag-solid-thin-v6-fine-kr-white.svg'] = sealFontTag('#FFFFFF', 'solid', 50);
files['kothar-fonttag-wide-v6-fine-kr.svg'] = sealFontTag(INK, 'solid', 50, 84, 0.95);
files['kothar-fonttag-wide-v6-fine-kr-white.svg'] = sealFontTag('#FFFFFF', 'solid', 50, 84, 0.95);
files['kothar-fonttag-flank-v6-fine-kr.svg'] = sealFontTag(INK, 'solid', 50, 84, 0.95, true);
files['kothar-fonttag-flank-v6-fine-kr-white.svg'] = sealFontTag('#FFFFFF', 'solid', 50, 84, 0.95, true);
files['kothar-final-header.svg'] = wordHeader(INK);
files['kothar-final-header-white.svg'] = wordHeader('#FFFFFF');
files['kothar-final-invoice.svg'] = invoiceRow(INK);
files['kothar-final-invoice-white.svg'] = invoiceRow('#FFFFFF');
files['kothar-final-vertical.svg'] = verticalStrip(INK);
files['kothar-final-vertical-white.svg'] = verticalStrip('#FFFFFF');
files['kothar-final-lockup.svg'] = lockup(INK);
files['kothar-final-lockup-white.svg'] = lockup('#FFFFFF');
for (const mode of ['side', 'compact']) {
  files[`kothar-final-header-${mode}.svg`] = headerSentence(INK, mode);
  files[`kothar-final-header-${mode}-white.svg`] = headerSentence('#FFFFFF', mode);
}
for (const mode of ['under', 'beside', 'bare']) {
  files[`kothar-final-row-${mode}.svg`] = horizontalRow(INK, mode);
  files[`kothar-final-row-${mode}-white.svg`] = horizontalRow('#FFFFFF', mode);
}
for (const [name, body] of Object.entries(files)) fs.writeFileSync(path.join(outDir, name), body);

// Before/after strip for the symbol weight at the sizes the brief tests.
fs.writeFileSync(path.join(outDir, '_compare-symbol.svg'), head(400, 200, 'v5 v6')
  + symbol(100 - 2.25 * 2.6, 100 - 31 * 2.6, 2.6, INK, 'v5') + symbol(300 - 2.25 * 2.6, 100 - 31 * 2.6, 2.6, INK, 'icon') + '</svg>\n');
console.log(Object.keys(files).join('\n'));
