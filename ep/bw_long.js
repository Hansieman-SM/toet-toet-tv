// Zwart-wit slaapvideo, lengte DUR (standaard 3600 s). Rendert frames START..END (s) als ruwe RGBA naar stdout.
const C = require('../lib/common'), B = require('../lib/bwbase'), F = require('../lib/bwfig');
const { x, W, H, clamp, ease, lerp, hash, cv } = C;
const DUR = +(process.env.DUR || 3600), FPS = 30, WH = '#ffffff', BK = '#000000';

// figuren: [functie, schaal, beweging]
const FIGS = [
  [B.moon, 1], [B.toet, .95], [B.fish, 1, 'swimL'], [B.elephant, 1, 'walkL'], [B.lion, .95], [B.windmill, .95], [B.heart, 1],
  [F.cow, .95], [F.owl, .95], [F.duck, .95, 'driftL'], [F.sheep, 1], [F.butterfly, .95, 'flutter'], [F.bigStar, 1], [F.cloud, 1],
  [F.giraffe, .9], [F.rabbit, .9], [F.sun, .95], [F.snail, .95, 'crawlL'], [F.bird, .95, 'flyL'], [F.bear, .95],
];
const SLOT = 7.5, IN = 2.2, OUT = 2.2;
const NS = Math.floor((DUR - 8) / SLOT);   // laatste ~8 s: maantje als afsluiter
// vaste, herhaalbare volgorde: per ronde van 20 een schudding, nooit twee keer dezelfde na elkaar
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const ORDER = []; let last = -1;
while (ORDER.length < NS) {
  const p = [...Array(FIGS.length).keys()];
  for (let i = p.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  if (p[0] === last) [p[0], p[1]] = [p[1], p[0]];
  ORDER.push(...p); last = p[p.length - 1];
}
const OFF = ORDER.map((_, i) => [(hash(i * 3.3) - .5) * 140, (hash(i * 7.1) - .5) * 40]);

function sky(t, a) {
  for (let i = 0; i < 40; i++) { const tw = .5 + .5 * Math.sin(t * .8 + i * 1.7); x.globalAlpha = a * .35 * tw; B.dot(hash(i) * W, hash(i + 50) * H, 1.4, WH); }
  x.globalAlpha = 1;
}
function draw(t) {
  x.fillStyle = BK; x.fillRect(0, 0, W, H);
  sky(t, clamp(t / 3) * clamp((DUR - t) / 2));
  const i = Math.floor((t - .5) / SLOT);
  if (i >= 0 && i < NS) {
    const u = t - .5 - i * SLOT, len = SLOT - .5;
    const a = ease(Math.min(u / IN, (len - u) / OUT));
    if (a > 0) {
      const [f, s, mv] = FIGS[ORDER[i]], [ox, oy] = OFF[i], prog = clamp(u / len);
      let px = 480 + ox + Math.sin(t * .4) * 12, py = 275 + oy + Math.sin(t * .8) * 8;
      if (mv === 'swimL') px = lerp(640, 320, prog);
      if (mv === 'walkL') px = lerp(640, 340, prog);
      if (mv === 'driftL') px = lerp(590, 370, prog);
      if (mv === 'crawlL') px = lerp(560, 410, prog);
      if (mv === 'flyL') { px = lerp(650, 310, prog); py = 260 + Math.sin(prog * Math.PI * 2) * 25; }
      if (mv === 'flutter') { px = 480 + Math.sin(prog * Math.PI * 2) * 90; py = 270 + Math.sin(prog * Math.PI * 4) * 25; }
      const sc = s * (.9 + .1 * ease(u / IN)) * (1 + Math.sin(t * .7) * .02);
      x.save(); x.globalAlpha = a; x.translate(px, py); x.scale(sc, sc); x.rotate(Math.sin(t * .5) * .03);
      f(t); x.restore();
    }
  }
  const e = Math.min(ease((t - (DUR - 8)) / 2.5), ease((DUR - .3 - t) / 2.5));
  if (e > 0) { x.save(); x.globalAlpha = e; x.translate(480, 270); x.scale(.9, .9); B.moon(t); x.restore(); }
}

if (process.env.STILL) { draw(+process.env.STILL); require('fs').writeFileSync(process.argv[2], cv.toBuffer('image/png')); }
else {
  const f0 = Math.round(+(process.env.START || 0) * FPS), f1 = Math.round(+(process.env.END || DUR) * FPS);
  let i = f0; const out = process.stdout;
  const OW = +(process.env.OW || 1920), OH = +(process.env.OH || 1080);
  (function next() {
    while (i < f1) {
      draw(i / FPS);
      const buf = Buffer.from(x.getImageData(0, 0, OW, OH).data.buffer); i++;
      if (!out.write(buf)) { out.once('drain', next); return; }
    }
    out.end();
  })();
}
