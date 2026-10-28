// Gedeelde tekenhulp + frame-runner voor alle afleveringen (wereld 960x540, uitvoer 1920x1080)
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
GlobalFonts.registerFromPath(__dirname + '/../fonts/Baloo2.ttf', 'Baloo2');

const W = 960, H = 540, FPS = 30;
const OUT_W = +(process.env.OW || 1920), OUT_H = +(process.env.OH || 1080);
const cv = createCanvas(OUT_W, OUT_H), x = cv.getContext('2d');
x.setTransform(OUT_W / W, 0, 0, OUT_H / H, 0, 0);
const INK = '#1d3557';

const FONT = s => `bold ${s}px Baloo2`;
const hash = n => { const s = Math.sin(n * 127.1 + 31.7) * 43758.5453; return s - Math.floor(s); };
const lerp = (a, b, k) => a + (b - a) * k;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = k => { k = clamp(k); return k * k * (3 - 2 * k); };
const hex = h => h[0] === '#' ? [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)) : h.match(/\d+/g).map(Number);
const mix = (a, b, k) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], k))).join(',')})`; };
// 0..1 venster: in en uit met korte overgang
const win = (t, a, b, f = .3) => t < a || t > b ? 0 : Math.min(1, (t - a) / f, (b - t) / f);

function rr(a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
function ell(cx, cy, rx, ry, fill, stroke, lw = 3) { x.beginPath(); x.ellipse(cx, cy, Math.max(.1, rx), Math.max(.1, ry), 0, 0, 7); if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw; x.stroke(); } }
function circ(cx, cy, r, fill, stroke, lw = 3) { ell(cx, cy, r, r, fill, stroke, lw); }

// tekstballon met staartje dat naar (bx) wijst
function bubble(txt, bx, by, k, opt = {}) {
  if (k <= 0) return;
  const size = opt.size || 32, ink = opt.ink || INK;
  x.save(); x.globalAlpha = clamp(k * 2); x.font = FONT(size);
  const w = x.measureText(txt).width + 48, s = .7 + .3 * ease(k * 2);
  const left = clamp(bx - w / 2, 40, W - 40 - w);   // ruime marge: tekstballon nooit tegen de rand
  x.translate(left + w / 2, by); x.scale(s, s);
  x.fillStyle = '#fff'; x.strokeStyle = ink; x.lineWidth = 4;
  rr(-w / 2, -32, w, 64, 28); x.fill(); x.stroke();
  if (!opt.noTail) {
    const tx = clamp(bx - (left + w / 2), -w / 2 + 30, w / 2 - 30);
    x.beginPath(); x.moveTo(tx - 12, 30); x.lineTo(tx - 4, 54); x.lineTo(tx + 14, 30); x.fill();
    x.beginPath(); x.moveTo(tx - 12, 31); x.lineTo(tx - 4, 54); x.lineTo(tx + 14, 31); x.stroke();
  }
  x.fillStyle = opt.color || ink; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 0, 2);
  x.restore();
}
// knal-ster met tekst (k loopt 0..1 over de duur)
function burst(txt, bx, by, k, t, col = '#ffd23f', txtCol = '#e8501f', ink = INK) {
  if (k <= 0 || k >= 1) return;
  const pop = ease(k * 5), fade = clamp((1 - k) * 4), shake = Math.sin(t * 50) * 3 * fade;
  x.save(); x.translate(bx + shake, by); x.scale(pop, pop); x.rotate(-.06); x.globalAlpha = fade;
  x.font = FONT(56); const tw = x.measureText(txt).width;
  const rx = Math.max(170, tw * .72), ry = 74;
  x.fillStyle = col; x.strokeStyle = ink; x.lineWidth = 4; x.beginPath();
  for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, r = i % 2 ? .72 : 1; x.lineTo(Math.cos(a) * r * rx, Math.sin(a) * r * ry); }
  x.closePath(); x.fill(); x.stroke();
  x.fillStyle = txtCol; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.lineWidth = 6; x.strokeStyle = '#fff'; x.strokeText(txt, 0, 4); x.fillText(txt, 0, 4);
  x.restore();
}
// grote titelkaart bovenin
function card(l1, l2, k, opt = {}) {
  if (k <= 0) return;
  const s = .6 + .4 * ease(k), ink = opt.ink || INK;
  x.save(); x.globalAlpha = clamp(k * 1.5); x.translate(W / 2, opt.y || 160); x.scale(s, s);
  x.font = FONT(l1[1]); const w = Math.max(560, x.measureText(l1[0]).width + 90);
  const fit = Math.min(1, (W - 60) / w); if (fit < 1) x.scale(fit, fit);   // lange titels passen altijd in beeld
  x.fillStyle = opt.bg || '#ffffff'; x.strokeStyle = ink; x.lineWidth = 6; rr(-w / 2, -92, w, 184, 40); x.fill(); x.stroke();
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillStyle = opt.accent || '#ff7a45'; x.fillText(l1[0], 0, l2 ? -20 : 0);
  if (l2) { x.fillStyle = ink; x.font = FONT(l2[1]); x.fillText(l2[0], 0, 46); }
  x.restore();
}
// groot los woord/getal met pop-effect
function bigText(txt, cx, cy, k, size, col, ink = INK) {
  if (k <= 0) return;
  const s = .5 + .5 * ease(k * 2) + Math.sin(clamp(k * 2) * Math.PI) * .12;
  x.save(); x.globalAlpha = clamp(k * 2); x.translate(cx, cy); x.scale(s, s);
  x.font = FONT(size); x.textAlign = 'center'; x.textBaseline = 'middle';
  x.lineJoin = 'round'; x.lineWidth = size / 7; x.strokeStyle = ink; x.strokeText(txt, 0, 0);
  x.lineWidth = size / 16; x.strokeStyle = '#fff'; x.strokeText(txt, 0, 0);
  x.fillStyle = col; x.fillText(txt, 0, 0);
  x.restore();
}
function fadeBlack(t, dur) {
  const f = Math.max(clamp(1 - t / .5), clamp((t - (dur - 1)) / 1));
  if (f > 0) { x.fillStyle = `rgba(0,0,0,${f})`; x.fillRect(0, 0, W, H); }
}
function sparkles(cx, cy, t, n = 8, r = 80, col = '#ffd23f') {
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2 + t * .8, rad = r * (.7 + .3 * Math.sin(t * 4 + i)), s = 5 + 3 * Math.sin(t * 6 + i * 2);
    const px = cx + Math.cos(a) * rad, py = cy + Math.sin(a) * rad * .6;
    x.fillStyle = col; x.beginPath();
    for (let j = 0; j < 8; j++) { const b = j / 8 * Math.PI * 2, q = j % 2 ? s * .35 : s; x.lineTo(px + Math.cos(b) * q, py + Math.sin(b) * q); }
    x.closePath(); x.fill();
  }
}
// thumbnail-titel: dikke letters linksboven/onder
function thumbTitle(l1, l2, col = '#ff7a45') {
  x.save(); x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.lineJoin = 'round';
  [[l1, 78, 30, 100, col], [l2, 58, 32, 165, '#ffffff']].forEach(([s, size, px, py, c]) => {
    if (!s) return; x.font = FONT(size);
    x.lineWidth = size / 6; x.strokeStyle = INK; x.strokeText(s, px, py); x.fillStyle = c; x.fillText(s, px, py);
  });
  x.restore();
}

// draait de animatie: STILL=<sec> schrijft een png, THUMB=<sec> idem met thumbnail-titel, anders ruwe frames naar stdout
function run(draw, dur, opts = {}) {
  const step = opts.step || (() => {});
  const fs = require('fs');
  const advanceTo = target => { const dt = 1 / FPS; for (let i = 0; i < Math.round(target * FPS); i++) step(i / FPS, dt); };
  if (process.env.STILL || process.env.THUMB) {
    const tt = +(process.env.STILL || process.env.THUMB);
    advanceTo(tt); draw(tt);
    if (process.env.THUMB && opts.thumb) opts.thumb(tt);
    fs.writeFileSync(process.argv[2], cv.toBuffer('image/png'));
    return;
  }
  const total = Math.round(FPS * dur); let i = 0; const out = process.stdout;
  (function next() {
    while (i < total) {
      const tt = i / FPS; draw(tt);
      const buf = Buffer.from(x.getImageData(0, 0, OUT_W, OUT_H).data.buffer);
      step(tt, 1 / FPS); i++;
      if (!out.write(buf)) { out.once('drain', next); return; }
    }
    out.end();
  })();
}

// taal: TOET_LANG=en vertaalt vaste teksten uit de bibliotheek via en/translations.json
let _TR = null; const tr = s => { if (process.env.TOET_LANG !== 'en') return s; if (!_TR) _TR = require('../en/translations.json'); return _TR[s] || s; };
module.exports = { tr, W, H, FPS, cv, x, INK, FONT, hash, lerp, clamp, ease, mix, win, rr, ell, circ, bubble, burst, card, bigText, fadeBlack, sparkles, thumbTitle, run, createCanvas };
