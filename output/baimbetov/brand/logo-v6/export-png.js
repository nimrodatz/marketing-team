// Exports the lead Kothar logos as transparent PNGs for video (end shots) and print.
// Renders each SVG in headless Chrome with a transparent background. Run after build-logo.js.
// Usage: node export-png.js <tmpDir>
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const here = __dirname;
const outDir = path.join(here, 'png');
const tmp = process.argv[2];
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(tmp, { recursive: true });

const JOBS = [ // [svg, output png, width px]
  ['kothar-seal-v6-fine-kr.svg', 'kothar-seal-black-3000.png', 3000],
  ['kothar-seal-v6-fine-kr-white.svg', 'kothar-seal-white-3000.png', 3000],
  ['kothar-horizontal-v6-fine-kr.svg', 'kothar-horizontal-black-3840.png', 3840],
  ['kothar-horizontal-v6-fine-kr-white.svg', 'kothar-horizontal-white-3840.png', 3840],
];

for (const [svgName, pngName, w] of JOBS) {
  const svg = fs.readFileSync(path.join(here, svgName), 'utf8');
  const [, vw, vh] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const h = Math.round(w * vh / vw);
  const sized = svg.replace(/ width="[\d.]+" height="[\d.]+"/, ` width="${w}" height="${h}"`);
  const page = path.join(tmp, pngName.replace('.png', '.html'));
  fs.writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent;overflow:hidden}svg{display:block}</style></head><body>${sized}</body></html>`);
  const out = path.join(outDir, pngName);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--default-background-color=00000000', `--window-size=${w},${h}`, `--screenshot=${out}`, 'file:///' + page.replace(/\\/g, '/')],
    { stdio: 'ignore' });
  console.log(`${pngName} ${w}x${h}`);
}
