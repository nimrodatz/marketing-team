// Exports the final Kothar logo (option 11) for the site and landing pages, to ../logo-web.
// Run after build-logo.js. Renders PNGs in headless Chrome. Usage: node export-web.js <tmpDir>
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const here = __dirname;
const outDir = path.join(here, '..', 'logo-web');
const tmp = process.argv[2];
fs.mkdirSync(path.join(outDir, 'png'), { recursive: true });
fs.mkdirSync(tmp, { recursive: true });

// The full logo was built with 60px of air. On a page the layout sets the margin, so 48 of it goes.
const cropAir = (svg, cut) => {
  const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const W = w - 2 * cut, H = h - 2 * cut;
  return svg.replace(/viewBox="[^"]+" width="[^"]+" height="[^"]+"/, `viewBox="${cut} ${cut} ${W} ${H}" width="${W}" height="${H}"`);
};
const read = name => fs.readFileSync(path.join(here, name), 'utf8');
const onWhite = (svg, size) => svg.replace(/(<title>.*?<\/title>\n)/, `$1<rect width="${size}" height="${size}" rx="${size * 0.16}" fill="#FFFFFF"/>\n`);

// Nimrod's choice, 2026-11-02: option 11 (stack) for images, renders and shirts, option 14 (row) for the site,
// landing pages and documents. header (17) and header-phone (18) carry the sentence at header height.
// row-small is option 14 without the sentence, for places too small to read it.
const SVGS = {
  'logo-stack-black.svg': cropAir(read('kothar-fonttag-flank-v6-fine-kr.svg'), 48),
  'logo-stack-white.svg': cropAir(read('kothar-fonttag-flank-v6-fine-kr-white.svg'), 48),
  'logo-row-black.svg': read('kothar-final-row-under.svg'),
  'logo-row-white.svg': read('kothar-final-row-under-white.svg'),
  'logo-header-black.svg': read('kothar-final-header-side.svg'),
  'logo-header-white.svg': read('kothar-final-header-side-white.svg'),
  'logo-header-phone-black.svg': read('kothar-final-header-compact.svg'),
  'logo-header-phone-white.svg': read('kothar-final-header-compact-white.svg'),
  'logo-row-small-black.svg': read('kothar-final-row-bare.svg'),
  'logo-row-small-white.svg': read('kothar-final-row-bare-white.svg'),
  'icon-black.svg': read('kothar-symbol-v6.svg'),
  'icon-white.svg': read('kothar-symbol-v6-white.svg'),
  'favicon.svg': onWhite(read('kothar-symbol-v6.svg'), 512),
};
for (const [name, body] of Object.entries(SVGS)) fs.writeFileSync(path.join(outDir, name), body);

const shot = (svg, w, out) => {
  const [, , , vw, vh] = svg.match(/viewBox="([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)"/);
  const h = Math.round(w * vh / vw);
  const sized = svg.replace(/ width="[\d.]+" height="[\d.]+"/, ` width="${w}" height="${h}"`);
  const page = path.join(tmp, path.basename(out) + '.html');
  fs.writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent;overflow:hidden}svg{display:block}</style></head><body>${sized}</body></html>`);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--default-background-color=00000000', `--window-size=${w},${h}`, `--screenshot=${out}`, 'file:///' + page.replace(/\\/g, '/')],
    { stdio: 'ignore' });
  const png = fs.readFileSync(out);
  console.log(`${path.basename(out)} ${png.readUInt32BE(16)}x${png.readUInt32BE(20)} (asked ${w}x${h})`);
};

const JOBS = [ // [svg, png, width]
  ['logo-stack-black.svg', 'logo-stack-black-3000.png', 3000],
  ['logo-stack-white.svg', 'logo-stack-white-3000.png', 3000],
  ['logo-row-black.svg', 'logo-row-black-1600.png', 1600],
  ['logo-row-white.svg', 'logo-row-white-1600.png', 1600],
  ['logo-header-black.svg', 'logo-header-black-1400.png', 1400],
  ['logo-header-white.svg', 'logo-header-white-1400.png', 1400],
  ['logo-header-phone-black.svg', 'logo-header-phone-black-800.png', 800],
  ['logo-header-phone-white.svg', 'logo-header-phone-white-800.png', 800],
  ['logo-row-small-black.svg', 'logo-row-small-black-800.png', 800],
  ['logo-row-small-white.svg', 'logo-row-small-white-800.png', 800],
  ['favicon.svg', 'icon-512.png', 512],
  ['favicon.svg', 'apple-touch-icon-180.png', 180],
  ['favicon.svg', 'favicon-32.png', 32],
];
for (const [svg, png, w] of JOBS) shot(SVGS[svg], w, path.join(outDir, 'png', png));
