// Motor voor de dagelijkse zwart-wit sensory video's (90 min via tools/long.sh).
// Alles is periodiek in P=240 s, zodat de loop naadloos herhaalt.
// Gebruik in een scènebestand:
//   require('../lib/bwlong').scene({ figs: [[fn, schaal, beweging], ...], bg: t => {...}, fg: t => {...}, end: fn })
// fn(t) tekent een figuur rond (0,0), ca. 300 wereld-px breed, wit op zwart.
// Bewegingen: 'swimL', 'swimR' (zwemt langzaam over het beeld), 'float' (stijgt/daalt zacht), 'floor' (kruipt over de bodem),
//             'sway' (blijft in het midden en wiegt), 'fly' (zweeft in een boog).
// Env: DUR, FADEIN=1, FADEOUT=1, SUBSCRIBE=1 (via C.run), DIM0/DIM1 = helderheid aan begin/eind van dit stuk (1 = normaal).
const C = require('./common');
const { x, W, H, clamp, ease, lerp, hash } = C;
const P = 240, SLOT = 12, NSLOT = P / SLOT, IN = 2.6, OUT = 2.6;
const TAU = Math.PI * 2;
const per = (t, n) => Math.sin(TAU * n * t / P);          // periodiek in P
const perc = (t, n) => Math.cos(TAU * n * t / P);

function scene(cfg) {
  const DUR = +(process.env.DUR || P);
  const figs = cfg.figs;
  // vaste volgorde binnen één periode: elke figuur komt even vaak, nooit twee keer dezelfde achter elkaar
  let seed = cfg.seed || 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const ORDER = [];
  while (ORDER.length < NSLOT) {
    const p = [...figs.keys()];
    for (let i = p.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    if (ORDER.length && p[0] === ORDER[ORDER.length - 1]) [p[0], p[1]] = [p[1], p[0]];
    ORDER.push(...p);
  }
  ORDER.length = NSLOT;
  if (ORDER[NSLOT - 1] === ORDER[0]) [ORDER[NSLOT - 1], ORDER[NSLOT - 2]] = [ORDER[NSLOT - 2], ORDER[NSLOT - 1]];
  const DIRS = ORDER.map((_, i) => (i % 2 ? -1 : 1));

  function figure(t) {
    const tp = ((t % P) + P) % P, i = Math.floor(tp / SLOT), u = tp - i * SLOT;
    const a = ease(Math.min(u / IN, (SLOT - u) / OUT));
    if (a <= 0) return;
    const [f, s, mv] = figs[ORDER[i]], d = DIRS[i], k = u / SLOT;
    let px = 480 + per(t, 6) * 14, py = 260 + per(t, 12) * 10, rot = per(t, 8) * .03, flip = 1;
    if (mv === 'swimL' || mv === 'swimR') { const dir = (mv === 'swimL' ? 1 : -1) * d; px = lerp(480 + 170 * dir, 480 - 170 * dir, k); py = 255 + Math.sin(k * TAU) * 18; flip = dir; }
    if (mv === 'float') { py = lerp(300, 225, ease(k)); px = 480 + Math.sin(k * TAU) * 30; }
    if (mv === 'floor') { px = lerp(480 + 120 * d, 480 - 120 * d, k); py = 360; flip = d; }
    if (mv === 'fly') { px = lerp(480 + 180 * d, 480 - 180 * d, k); py = 250 - Math.sin(k * Math.PI) * 40; flip = d; }
    if (mv === 'sway') { rot = Math.sin(k * TAU * 2) * .06; }
    const sc = s * (cfg.scale || 1.2) * (.92 + .08 * ease(u / IN));
    x.save(); x.globalAlpha *= a; x.translate(px, py); x.rotate(rot); x.scale(sc * flip, sc);
    f(t); x.restore();
  }

  const T0 = +(process.env.T0 || 0);   // start offset inside the loop (for Shorts); fades/dimming still use local t
  function draw(t) {
    const ts = t + T0;
    x.save(); x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
    if (cfg.bg) cfg.bg(ts);
    // afsluiter: in de laatste ~12 s van de outro verdwijnt de figuur en verschijnt de eindfiguur (bv. de maan)
    const e = process.env.FADEOUT && cfg.end ? ease((t - (DUR - 14)) / 2.5) : 0;
    if (e < 1) { x.save(); x.globalAlpha = 1 - e; figure(ts); x.restore(); }
    if (cfg.fg) cfg.fg(ts);
    if (e > 0) {
      x.save(); x.translate(480, 250); x.scale(.85, .85);
      x.globalAlpha = e; cfg.end(ts); x.restore();
    }
    x.restore();
    // helderheid (laatste 20 minuten langzaam donkerder richting slapen)
    const d0 = +(process.env.DIM0 || 1), d1 = +(process.env.DIM1 || d0), dim = lerp(d0, d1, clamp(t / DUR));
    let dark = 1 - dim;
    if (process.env.FADEIN) dark = Math.max(dark, 1 - ease(t / 3));
    if (process.env.FADEOUT) dark = Math.max(dark, ease((t - (DUR - 3)) / 3));
    if (dark > 0) { x.fillStyle = `rgba(0,0,0,${dark})`; x.fillRect(0, 0, W, H); }
  }
  C.run(draw, DUR);
}

// gedeelde tekenhulpjes (wit op zwart)
const WH = '#ffffff', BK = '#000000';
const dot = (cx, cy, r, col = WH) => { x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fillStyle = col; x.fill(); };
const ell = (cx, cy, rx, ry, col = WH, rot = 0) => { x.beginPath(); x.ellipse(cx, cy, rx, ry, rot, 0, 7); x.fillStyle = col; x.fill(); };
const line = (lw, col = WH) => { x.lineWidth = lw; x.strokeStyle = col; x.lineCap = 'round'; x.lineJoin = 'round'; x.stroke(); };
const eye = (cx, cy, r, t, ph = 0) => { const bl = ((t + ph) % 6) > 5.82; if (bl) { x.beginPath(); x.moveTo(cx - r, cy); x.lineTo(cx + r, cy); line(r * .5, BK); } else { dot(cx, cy, r, BK); dot(cx - r * .3, cy - r * .3, r * .33, WH); } };
const smile = (cx, cy, r, lw = 6, col = BK) => { x.beginPath(); x.arc(cx, cy, r, .3, Math.PI - .3); line(lw, col); };

module.exports = { scene, P, per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash };
