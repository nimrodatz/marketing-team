// Copies every Kothar logo version to ../logo-archive and writes a page that shows them all. The copies stay
// put when build-logo.js rewrites its output. Existing archive files are not overwritten.
// Usage: node build-archive.js
const fs = require('fs');
const path = require('path');

const here = __dirname;
const out = path.join(here, '..', 'logo-archive');
const svgDir = path.join(out, 'svg');
fs.mkdirSync(svgDir, { recursive: true });

const v5 = path.join(here, '..', '..', 'strategy', 'kothar_seal_v5.svg');
const sources = [v5, ...fs.readdirSync(here).filter(f => /^kothar-.*\.svg$/.test(f)).map(f => path.join(here, f))];
for (const src of sources) {
  const dest = path.join(svgDir, path.basename(src));
  if (!fs.existsSync(dest)) fs.copyFileSync(src, dest);
}

const GROUPS = [
  ['נבחרו, 2026-11-02', [
    ['kothar-fonttag-flank-v6-fine-kr', '11: הלוגו העומד, לתמונות, הדמיות וחולצות'],
    ['kothar-final-row-under', '14: הלוגו האופקי, לאתר, לדף נחיתה ולמסמכים'],
    ['kothar-final-header-side', '17: הדר במחשב, המשפט משמאל לשם'],
    ['kothar-final-header-compact', '18: הדר בטלפון, המשפט מתחת לשם'],
    ['kothar-final-row-bare', '16: האופקי בלי המשפט, למקום קטן מאוד'],
  ]],
  ['סבב "ללא העיגול"', [
    ['kothar-noring-arc-v6-fine-kr', '7: המשפט בקשת'],
    ['kothar-noring-line-v6-fine-kr', '6: שורה אחת בגודל הקודם'],
    ['kothar-noring-line-large-v6-fine-kr', '5: שורה אחת מוגדלת'],
    ['kothar-noring-two-lines-v6-fine-kr', '4: הנוסח הקודם, שתי שורות'],
    ['kothar-noring-metal-v6-fine-kr', '3: "עץ ומתכת" בפונט המקורי'],
  ]],
  ['סבב הפונט החדש', [
    ['kothar-fonttag-keep-v6-fine-kr', '1: כותר המקורי, המשפט חלול'],
    ['kothar-fonttag-solid-v6-fine-kr', '2: כותר מלא, המשפט חלול'],
    ['kothar-fonttag-solid-thin-v6-fine-kr', '9: המשפט מלא ודק'],
    ['kothar-fonttag-wide-v6-fine-kr', '10: כותר קצת רחב ודק יותר'],
    ['kothar-final-lockup', '12: הסמל מימין לשם ובאותו גובה'],
    ['kothar-trial-cunei-niqqud', '13: הניקוד באותיות אוגריתיות, נפסל'],
    ['kothar-final-row-beside', '15: אופקי, המשפט מתחת לשם בלבד'],
  ]],
  ['גרסאות שיוצאו ולא נבחרו', [
    ['kothar-final-header', 'כותרת עליונה עם האותיות האוגריתיות'],
    ['kothar-final-invoice', 'חשבונית, המשפט בצד'],
    ['kothar-final-vertical', 'כיתוב אנכי, סרט מסובב'],
  ]],
  ['עם העיגול, הסבבים הקודמים', [
    ['kothar-seal-v6-fine-kr', '8: החותם עם כ\' ו-ר\''],
    ['kothar-seal-v6-fine', 'החותם, קו עדין'],
    ['kothar-seal-v6', 'החותם, קו עבה'],
    ['kothar_seal_v5', 'החותם, v5, הגרסה של נימרוד'],
  ]],
  ['סמל ואופקי, הסבבים הקודמים', [
    ['kothar-symbol-v6-fine-kr', 'סמל עם כ\' ו-ר\''],
    ['kothar-symbol-v6', 'סמל, קו עבה'],
    ['kothar-horizontal-v6-fine-kr', 'אופקי לחשבונית, הסבב הקודם'],
    ['kothar-horizontal-v6-fine', 'אופקי, קו עדין'],
    ['kothar-horizontal-v6', 'אופקי, קו עבה'],
  ]],
];

const missing = GROUPS.flatMap(g => g[1]).filter(([n]) => !fs.existsSync(path.join(svgDir, n + '.svg'))).map(([n]) => n);
if (missing.length) throw new Error('missing: ' + missing.join(', '));

const card = ([name, label]) => `    <figure><div class="art"><img src="svg/${name}.svg" alt="${label.replace(/"/g, '&quot;')}" loading="lazy"></div><figcaption>${label}<code>${name}.svg</code></figcaption></figure>`;
const body = GROUPS.map(([title, items]) => `  <h2>${title}</h2>\n  <div class="grid">\n${items.map(card).join('\n')}\n  </div>`).join('\n');

fs.writeFileSync(path.join(out, 'index.html'), `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>כותר, ארכיון גרסאות</title>
<style>
  :root { --ink: #1E1E1E; --paper: #FFFFFF; --bg: #F4F2EE; --line: #DDD8CF; --muted: #6B665E; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font-family: Arial, Helvetica, sans-serif; padding: 32px 16px 64px; }
  main { max-width: 1180px; margin: 0 auto; }
  h1 { font-size: 26px; margin: 0 0 8px; }
  h2 { font-size: 18px; margin: 36px 0 12px; }
  p { color: var(--muted); font-size: 14px; margin: 0; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
  figure { margin: 0; background: var(--paper); border: 1px solid var(--line); display: flex; flex-direction: column; min-width: 0; }
  .art { height: 240px; padding: 18px; display: flex; align-items: center; justify-content: center; }
  .art img { display: block; max-width: 100%; max-height: 100%; width: auto; height: auto; }
  figcaption { border-top: 1px solid var(--line); padding: 10px 12px; font-size: 13px; font-weight: 700; }
  code { display: block; direction: ltr; text-align: right; margin-top: 4px; font-size: 11px; font-weight: 400; color: var(--muted); overflow-wrap: anywhere; }
</style>
</head>
<body>
<main>
  <h1>כותר, ארכיון גרסאות</h1>
  <p>כל הגרסאות של הלוגו, לעיון בלבד. הקבצים לשימוש נמצאים בתיקייה logo-web. לרוב הקבצים יש גם גרסה בלבן, עם הסיומת white-, בתיקייה svg.</p>
${body}
</main>
</body>
</html>
`);
console.log(`${fs.readdirSync(svgDir).length} files in archive`);
