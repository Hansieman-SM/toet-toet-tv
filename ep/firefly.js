// Calm Firefly Meadow at dusk (sensory). Everything is periodic with P seconds (seamless loop).
// Lavender-peach evening sky with a sleepy crescent moon and twinkling first stars, a weeping willow swaying,
// a lily pond with a frog mama + froglet (throat puffs, a little hop), cattails, a bunny family peeking out of the tall grass,
// a little raccoon peeking from behind a tree stump and waving, a ladybird on a bellflower opening her wings,
// a dragonfly looping over the pond, a tortoise strolling through the front grass, dandelion clocks and lots of glowing fireflies.
const C = require('../lib/common');
const { x, W, H, clamp, lerp, hash } = C;
const P = 240, TAU = Math.PI * 2;
const DUR = +(process.env.DUR || P);
const T0 = +(process.env.T0 || 0);
const ph = (t, m = 1, o = 0) => Math.sin(TAU * m * t / P + o);
const frac = v => v - Math.floor(v);
const INKE = '#3f3554';
const OUTL = 'rgba(90,70,120,.35)';
const edge = (w = 1.3) => { x.strokeStyle = OUTL; x.lineWidth = w; x.stroke(); };
function glow(cx, cy, r, col, a) {
  const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0));
  x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
}
// every must divide 240 so the loop stays seamless
function eye(cx, cy, r, t, o = 0, every = 6) {
  const blink = ((t + o * 1.7) % every) < .18;
  if (blink) { x.strokeStyle = INKE; x.lineWidth = r * .45; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r * .8, .2, Math.PI - .2); x.stroke(); return; }
  C.circ(cx, cy, r, INKE); C.circ(cx + r * .35, cy - r * .35, r * .38, '#ffffff');
}
const sleepEye = (cx, cy, r) => { x.strokeStyle = INKE; x.lineWidth = Math.max(1.4, r * .4); x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r, .25, Math.PI - .25); x.stroke(); };
const smile = (cx, cy, r, col = INKE, w = 2) => { x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r, .3, Math.PI - .3); x.stroke(); };
const cheek = (cx, cy, r) => C.circ(cx, cy, r, 'rgba(255,140,170,.45)');
function at(ox, oy, nx, ny, s, fn) { x.save(); x.translate(nx, ny); x.scale(s, s); x.translate(-ox, -oy); fn(); x.restore(); }
function place(px, py, s, flip, rot = 0) { x.save(); x.translate(px, py); x.rotate(rot); x.scale(flip ? -s : s, s); }

// ---------- sky ----------
function sky(t) {
  const k = .5 + .5 * ph(t, 1, 0);   // very slow warm/cool breathing of the sky
  const g = x.createLinearGradient(0, 0, 0, 320);
  g.addColorStop(0, C.mix('#8f8cc9', '#9a88c4', k)); g.addColorStop(.45, C.mix('#bfb0e0', '#c8afdc', k));
  g.addColorStop(.8, C.mix('#f6c9c4', '#fbcdb8', k)); g.addColorStop(1, '#ffdcbf');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
}
function stars(t) {
  for (let i = 0; i < 46; i++) {
    const sx = hash(i + 11) * W, sy = 12 + hash(i + 23) * 190 * (.4 + .6 * hash(i + 5));
    if (sx > 80 && sx < 230 && sy < 160) continue;   // keep the moon clear
    const tw = .45 + .55 * (ph(t, 6 + i % 9, i) * .5 + .5);
    x.globalAlpha = tw * (1 - sy / 260);
    if (i % 7 === 0) {   // a few little 4-point stars
      x.fillStyle = '#fffbe8'; x.beginPath(); const r = 4 + tw * 2;
      x.moveTo(sx, sy - r); x.quadraticCurveTo(sx, sy, sx + r, sy); x.quadraticCurveTo(sx, sy, sx, sy + r); x.quadraticCurveTo(sx, sy, sx - r, sy); x.quadraticCurveTo(sx, sy, sx, sy - r); x.fill();
    } else C.circ(sx, sy, .9 + hash(i) * 1.1, '#fffbe8');
  }
  x.globalAlpha = 1;
}
// crescent = disc (cx,cy,R) minus disc (dx,dy,r), as one clean polygon
function crescentPath(cx, cy, R, dx, dy, r) {
  x.beginPath(); const N = 180; let first = true;
  for (let i = 0; i <= N; i++) { const a = i / N * TAU, px = cx + Math.cos(a) * R, py = cy + Math.sin(a) * R;
    if (Math.hypot(px - dx, py - dy) >= r) { if (first) { x.moveTo(px, py); first = false; } else x.lineTo(px, py); } }
  // inner edge: the points of the cutting circle that lie inside the moon, walked so the path closes
  const pts = [];
  for (let i = 0; i <= N; i++) { const a = i / N * TAU, px = dx + Math.cos(a) * r, py = dy + Math.sin(a) * r; if (Math.hypot(px - cx, py - cy) <= R) pts.push([a, px, py]); }
  // order the inside arc contiguously (it may wrap around angle 0)
  let k = 0; for (let i = 1; i < pts.length; i++) if (pts[i][0] - pts[i - 1][0] > 2 * TAU / N) { k = i; break; }
  const arc = pts.slice(k).concat(pts.slice(0, k));
  // join from the end of the outer arc to the nearer end of the inner arc
  const last = arc[arc.length - 1], fst = arc[0];
  const ordered = Math.hypot(last[1] - cx, last[2] - cy) >= 0 ? arc : arc;
  ordered.reverse().forEach(([, px, py]) => x.lineTo(px, py)); x.closePath();
}
function moon(t) {
  const mx = 152, my = 86 + ph(t, 2, 1) * 3;
  glow(mx, my, 110, 'rgba(255,246,214,A)', .45);
  // crescent: full disc minus an offset disc (drawn with the sky colour feel via composite on a temp path)
  x.save(); crescentPath(mx, my, 40, mx + 22, my - 12, 36); x.clip();
  C.circ(mx, my, 40, '#fff3c8'); C.circ(mx - 6, my + 6, 30, '#fff8dc');
  x.restore();
  sleepEye(mx - 22, my + 4, 4.5); cheek(mx - 20, my + 16, 4.5); smile(mx - 14, my + 20, 5, INKE, 1.8);
  // a tiny star dangling from the moon tip, swinging
  const sw = ph(t, 8, 0) * .25;
  x.save(); x.translate(mx + 8, my + 36); x.rotate(sw);
  x.strokeStyle = 'rgba(255,248,220,.7)'; x.lineWidth = .8; x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 22); x.stroke();
  x.fillStyle = '#ffe9a0'; x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 3 : 7; x.lineTo(Math.cos(a) * r, 28 + Math.sin(a) * r); } x.fill();
  x.restore();
}
function wispClouds(t) {
  [[.1, 120, 1.0], [.55, 70, .7], [.8, 165, .85]].forEach(([o, cy, s], i) => {
    const cx = -120 + frac(t / P + o) * (W + 240);
    x.fillStyle = 'rgba(255,225,230,.55)'; x.beginPath(); x.ellipse(cx, cy, 80 * s, 9 * s, 0, 0, 7); x.fill();
    x.fillStyle = 'rgba(255,236,236,.5)'; x.beginPath(); x.ellipse(cx + 30 * s, cy - 7 * s, 46 * s, 8 * s, 0, 0, 7); x.fill();
  });
}

// ---------- landscape ----------
const farY = i => 268 - Math.sin(i * .008 + .6) * 22 - Math.sin(i * .021) * 7;
const midY = i => 304 - Math.sin(i * .006 + 2.5) * 16 - Math.sin(i * .017 + 1) * 6;
function hills(t) {
  x.fillStyle = '#b4a6d4'; x.beginPath(); x.moveTo(0, H); for (let i = 0; i <= W; i += 10) x.lineTo(i, farY(i)); x.lineTo(W, H); x.fill();
  // a tiny cottage with a warm window far away
  const hx = 520, hy = farY(520) + 3;
  x.fillStyle = '#a495c6'; x.fillRect(hx - 9, hy - 11, 18, 11); x.beginPath(); x.moveTo(hx - 12, hy - 10); x.lineTo(hx, hy - 20); x.lineTo(hx + 12, hy - 10); x.fill();
  glow(hx + 3, hy - 6, 9, 'rgba(255,214,140,A)', .6 + .2 * ph(t, 4)); x.fillStyle = '#ffe2a0'; x.fillRect(hx + 1, hy - 8, 4, 4);
  x.fillStyle = '#9fbfb6'; x.beginPath(); x.moveTo(0, H); for (let i = 0; i <= W; i += 10) x.lineTo(i, midY(i)); x.lineTo(W, H); x.fill();
  // round bushes on the middle hill
  [[60, '#8fb5ab'], [250, '#93b9ae'], [430, '#8fb5ab'], [690, '#93b9ae']].forEach(([bx, col]) => { const by = midY(bx) + 4; C.circ(bx, by - 8, 13, col); C.circ(bx - 12, by - 3, 9, col); C.circ(bx + 12, by - 4, 10, col); });
}
function meadowGround() {
  const g = x.createLinearGradient(0, 330, 0, H); g.addColorStop(0, '#a9cfa6'); g.addColorStop(1, '#86b98d');
  x.fillStyle = g; x.beginPath(); x.moveTo(0, H);
  for (let i = 0; i <= W; i += 8) x.lineTo(i, 346 - Math.sin(i * .006 + 1.2) * 9 - Math.sin(i * .02) * 3); x.lineTo(W, H); x.fill();
}
// weeping willow on the right with swaying fronds
function willow(t) {
  const tx = 838, ty = 418;
  x.fillStyle = '#8d7a8f'; x.beginPath(); x.moveTo(tx - 14, ty); x.quadraticCurveTo(tx - 6, ty - 70, tx - 18, ty - 140); x.lineTo(tx + 10, ty - 140); x.quadraticCurveTo(tx + 6, ty - 70, tx + 16, ty); x.closePath(); x.fill();
  x.fillStyle = 'rgba(70,60,80,.18)'; x.beginPath(); x.ellipse(tx, ty + 2, 70, 7, 0, 0, 7); x.fill();
  // crown
  [[-40, -150, 52], [10, -168, 60], [55, -145, 48], [-10, -128, 50]].forEach(([a, b, r]) => C.circ(tx + a, ty + b, r, '#88b49a'));
  [[-30, -165, 30], [25, -180, 30]].forEach(([a, b, r]) => C.circ(tx + a, ty + b, r, 'rgba(255,255,255,.12)'));
  // hanging fronds
  for (let i = 0; i < 22; i++) {
    const fx = tx - 95 + i * 9 + hash(i + 3) * 4, top = ty - 150 + Math.abs(i - 11) * 3, len = 95 + hash(i + 9) * 60 - Math.abs(i - 11) * 3;
    const sw = ph(t, 8, i * .4) * 7 + ph(t, 3, i) * 4;
    x.strokeStyle = i % 2 ? '#7fae92' : '#94c2a5'; x.lineWidth = 3.2; x.lineCap = 'round';
    x.beginPath(); x.moveTo(fx, top); x.quadraticCurveTo(fx + sw * .3, top + len * .5, fx + sw, top + len); x.stroke();
    x.fillStyle = '#a4cfb2'; for (let k = 1; k < 5; k++) { const yy = top + len * k / 5, xx = fx + sw * (k / 5) ** 2; x.beginPath(); x.ellipse(xx + 3, yy, 3.4, 1.6, .9, 0, 7); x.fill(); }
  }
}
function pond(t) {
  const px = 400, py = 438;
  x.fillStyle = '#b3c3e6'; x.beginPath(); x.ellipse(px, py, 205, 48, 0, 0, 7); x.fill();
  const g = x.createLinearGradient(0, py - 48, 0, py + 48); g.addColorStop(0, 'rgba(200,180,230,.6)'); g.addColorStop(1, 'rgba(255,214,200,.5)');
  x.fillStyle = g; x.beginPath(); x.ellipse(px, py, 205, 48, 0, 0, 7); x.fill();
  x.strokeStyle = '#97c39e'; x.lineWidth = 5; x.beginPath(); x.ellipse(px, py, 206, 49, 0, 0, 7); x.stroke();
  // moon reflection + shimmer
  x.save(); x.beginPath(); x.ellipse(px, py, 202, 46, 0, 0, 7); x.clip();
  for (let i = 0; i < 6; i++) { x.globalAlpha = .35 + .35 * (ph(t, 12 + i, i) * .5 + .5); x.fillStyle = '#fff4d2'; x.fillRect(px - 140 - 10 + i * 3 + ph(t, 6, i) * 4, py - 24 + i * 7, 26 - i * 3, 2); }
  for (let i = 0; i < 10; i++) { x.globalAlpha = .3 + .4 * (ph(t, 10 + i, i * 2) * .5 + .5); x.fillStyle = '#ffffff'; x.fillRect(px - 150 + hash(i + 40) * 300 + ph(t, 4, i) * 6, py - 20 + hash(i + 70) * 40, 8 + hash(i) * 12, 1.3); }
  x.globalAlpha = 1;
  // slow expanding ripple rings
  for (let i = 0; i < 3; i++) {
    const k = frac(t / P * 12 + i / 3), rx = 6 + k * 40;
    x.strokeStyle = `rgba(255,255,255,${.5 * (1 - k)})`; x.lineWidth = 1; x.beginPath(); x.ellipse(px + 70 - i * 120 + 40, py + 10 - i * 4, rx, rx * .22, 0, 0, 7); x.stroke();
  }
  x.restore();
}
function lilyPad(cx, cy, r, flowerCol) {
  x.fillStyle = '#8fc79a'; x.beginPath(); x.ellipse(cx, cy, r, r * .36, 0, .35, TAU); x.lineTo(cx, cy); x.fill();
  x.strokeStyle = 'rgba(70,120,80,.3)'; x.lineWidth = 1; x.beginPath(); x.ellipse(cx, cy, r, r * .36, 0, .35, TAU); x.stroke();
  if (flowerCol) {
    for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; x.fillStyle = flowerCol; x.beginPath(); x.ellipse(cx - r * .35 + Math.cos(a) * 4, cy - 3 + Math.sin(a) * 1.6, 5, 2.4, a, 0, 7); x.fill(); }
    C.circ(cx - r * .35, cy - 4, 2.2, '#ffe39a');
  }
}
function frog(cx, cy, s, t, o, baby) {
  // sits on a lily pad: throat puffs out now and then, eyes blink; the froglet does a little hop every minute
  const k = frac(t / P * 4 + o * .1), hop = baby && k < .06 ? Math.sin(k / .06 * Math.PI) * 18 : 0;
  place(cx, cy - hop, s, !!baby);
  const body = baby ? '#a6dc8c' : '#8fcf86', belly = '#e4f4c8';
  const puff = clamp(ph(t, 20, o) * 2 - 1.2, 0, 1);
  x.fillStyle = 'rgba(60,110,80,.25)'; x.beginPath(); x.ellipse(0, 2 + hop / s, 24, 4, 0, 0, 7); x.fill();
  // back legs
  x.fillStyle = body; [-1, 1].forEach(d => { x.beginPath(); x.ellipse(d * 16, -5, 10, 7, d * .5, 0, 7); x.fill(); x.fillStyle = '#7fc078'; x.beginPath(); x.ellipse(d * 22, 0, 8, 3, 0, 0, 7); x.fill(); x.fillStyle = body; });
  // body
  x.beginPath(); x.ellipse(0, -12, 20, 15, 0, 0, 7); x.fill(); edge(1.1);
  x.fillStyle = belly; x.beginPath(); x.ellipse(0, -7, 12, 9, 0, 0, 7); x.fill();
  // throat sac
  if (puff > 0) { C.circ(0, -4 + puff * 2, 5 + puff * 7, 'rgba(250,240,200,.95)'); x.beginPath(); x.arc(0, -4 + puff * 2, 5 + puff * 7, 0, 7); edge(.8); }
  // eye bumps
  [-1, 1].forEach(d => { C.circ(d * 10, -26, 8, body); x.beginPath(); x.arc(d * 10, -26, 8, Math.PI, TAU); edge(1); C.circ(d * 10, -26, 5.5, '#ffffff'); });
  eye(-10, -26, 3.4, t, o, 6); eye(10, -26, 3.4, t, o + .05, 6);
  smile(0, -18, 9, INKE, 1.6); cheek(-13, -15, 3); cheek(13, -15, 3);
  // front feet
  x.fillStyle = '#7fc078'; [-1, 1].forEach(d => { x.beginPath(); x.ellipse(d * 9, 1, 5, 2.5, 0, 0, 7); x.fill(); });
  x.restore();
}
function cattails(t, list) {
  list.forEach(([a, b, h], i) => {
    const sw = ph(t, 10, i * 1.3) * 3;
    x.strokeStyle = '#7fb48a'; x.lineWidth = 2.2; x.lineCap = 'round'; x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo(a + sw * .4, b - h * .5, a + sw, b - h); x.stroke();
    x.fillStyle = '#b08a72'; x.beginPath(); x.ellipse(a + sw, b - h + 10, 3.2, 9, sw * .03, 0, 7); x.fill();
    x.strokeStyle = '#8fc79a'; x.lineWidth = 2; x.beginPath(); x.moveTo(a + 2, b); x.quadraticCurveTo(a + 12 + sw, b - h * .4, a + 16 + sw, b - h * .55); x.stroke();
  });
}
function grassClump(cx, cy, s, t, o, col = '#7fb487') {
  x.strokeStyle = col; x.lineWidth = 2.4 * s; x.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const gx = cx + (i - 4) * 5 * s, h = (26 + hash(i + o * 9) * 18) * s, sw = ph(t, 12, i + o) * 3 + (i - 4) * 1.6;
    x.beginPath(); x.moveTo(gx, cy); x.quadraticCurveTo(gx + sw * .3, cy - h * .6, gx + sw, cy - h); x.stroke();
  }
}
// bunny family: three heads peek up out of the tall grass in turn and dip down again
function bunnyHead(cx, cy, s, t, o, up) {
  place(cx, cy + (1 - up) * 34 * s, s, false, ph(t, 6, o) * .08);
  const fur = '#f6eef2';
  [[-7, -.35], [7, .35]].forEach(([d, r], j) => { x.save(); x.translate(d, -13); x.rotate(r + ph(t, 16, o + j) * .08 + (j && up > .9 ? ph(t, 60, o) * .12 : 0)); x.fillStyle = fur; x.beginPath(); x.ellipse(0, -9, 4.6, 12, 0, 0, 7); x.fill(); edge(1); x.fillStyle = '#f5bfd0'; x.beginPath(); x.ellipse(0, -9, 2.2, 8.5, 0, 0, 7); x.fill(); x.restore(); });
  C.circ(0, 0, 14, fur); x.beginPath(); x.arc(0, 0, 14, 0, 7); edge(1.1);
  eye(-5.5, -2, 2.5, t, o, 6); eye(5.5, -2, 2.5, t, o + .1, 6); C.circ(0, 3.5, 1.9, '#ef9db4'); smile(0, 4.5, 2.6, INKE, 1.2); cheek(-8.5, 5, 2.8); cheek(8.5, 5, 2.8);
  x.restore();
}
function bunnies(t) {
  const fam = [[64, 432, 1.05, 0], [104, 440, .8, .33], [140, 434, .9, .66]];
  grassClump(102, 452, 1.5, t, 1, '#88bd8f');   // back grass
  fam.forEach(([bx, by, s, o], i) => {
    const k = frac(t / P * 6 + o), up = clamp(Math.min(k / .06, (0.42 - k) / .06), 0, 1);
    x.save(); x.beginPath(); x.rect(bx - 40, 300, 80, by + 12 - 300); x.clip();
    bunnyHead(bx, by, s, t, i * 1.4, C.ease(up)); x.restore();
  });
  grassClump(70, 458, 1.3, t, 3); grassClump(118, 462, 1.25, t, 5); grassClump(150, 456, 1.1, t, 7);
}
// tree stump with a little raccoon who peeks out and waves
function stumpRaccoon(t) {
  const sx = 640, sy = 440;
  const k = frac(t / P * 4 + .2), out = clamp(Math.min(k / .05, (.36 - k) / .05), 0, 1), lean = C.ease(out);
  // raccoon behind the stump
  place(sx + 20 + lean * 24, sy - 34, 1, false, lean * .25);
  const fur = '#b7aebf', dk = '#7a7088', lt = '#f1ecf4';
  [-1, 1].forEach(d => { C.circ(d * 10, -13, 6, fur); C.circ(d * 10, -13, 3, lt); });
  C.circ(0, 0, 15, fur); x.beginPath(); x.arc(0, 0, 15, 0, 7); edge(1.1);
  x.fillStyle = lt; x.beginPath(); x.ellipse(0, 5, 9, 7, 0, 0, 7); x.fill();
  x.fillStyle = dk; x.beginPath(); x.ellipse(-6.5, -2, 6, 4.2, -.2, 0, 7); x.fill(); x.beginPath(); x.ellipse(6.5, -2, 6, 4.2, .2, 0, 7); x.fill();
  eye(-6, -2, 2.4, t, 5, 6); eye(6, -2, 2.4, t, 5.1, 6); C.circ(0, 3, 2.2, INKE); smile(0, 5.5, 2.6, INKE, 1.2); cheek(-10, 5, 2.4); cheek(10, 5, 2.4);
  // waving paw while leaning out
  if (lean > .5) { const a = ph(t, 160) * .45; x.save(); x.translate(13, 8); x.rotate(-1.1 + a); x.fillStyle = fur; x.beginPath(); x.ellipse(0, -8, 4.5, 9, 0, 0, 7); x.fill(); edge(1); x.fillStyle = dk; x.beginPath(); x.ellipse(0, -15, 4, 3, 0, 0, 7); x.fill(); x.restore(); }
  x.restore();
  // striped tail peeks out on the other side (sways)
  x.save(); x.translate(sx + 22, sy - 8); x.rotate(-.5 + ph(t, 12, 1) * .2);
  for (let i = 0; i < 5; i++) { x.fillStyle = i % 2 ? '#7a7088' : '#c3bacb'; x.beginPath(); x.ellipse(i * 7, 0, 6, 7 - i * .4, 0, 0, 7); x.fill(); }
  x.restore();
  // the stump
  x.fillStyle = 'rgba(60,70,60,.22)'; x.beginPath(); x.ellipse(sx, sy + 2, 40, 6, 0, 0, 7); x.fill();
  x.fillStyle = '#b89a86'; x.beginPath(); x.moveTo(sx - 30, sy); x.lineTo(sx - 26, sy - 44); x.lineTo(sx + 26, sy - 44); x.lineTo(sx + 30, sy); x.closePath(); x.fill(); edge(1.2);
  x.fillStyle = '#e7d3bd'; x.beginPath(); x.ellipse(sx, sy - 44, 26, 7, 0, 0, 7); x.fill(); edge(1);
  x.strokeStyle = 'rgba(160,120,95,.6)'; x.lineWidth = 1; x.beginPath(); x.ellipse(sx, sy - 44, 16, 4, 0, 0, 7); x.stroke(); x.beginPath(); x.ellipse(sx, sy - 44, 7, 1.8, 0, 0, 7); x.stroke();
  x.strokeStyle = 'rgba(140,105,85,.45)'; [-14, 0, 14].forEach(a => { x.beginPath(); x.moveTo(sx + a, sy - 36); x.lineTo(sx + a * 1.1, sy - 4); x.stroke(); });
}
// bellflower with a sleepy ladybird who opens her wings now and then
function ladybirdFlower(t) {
  const fx = 548, fy = 470, sw = ph(t, 8, 2) * 3;
  x.strokeStyle = '#7fb48a'; x.lineWidth = 2.6; x.lineCap = 'round'; x.beginPath(); x.moveTo(fx, fy); x.quadraticCurveTo(fx + sw * .3, fy - 40, fx + sw, fy - 78); x.stroke();
  x.fillStyle = '#93c79c'; x.beginPath(); x.ellipse(fx - 9, fy - 24, 10, 3.5, .5, 0, 7); x.fill(); x.beginPath(); x.ellipse(fx + 9, fy - 40, 10, 3.5, -.5, 0, 7); x.fill();
  const tx = fx + sw, ty = fy - 78;
  // two bells hanging
  [[-1, 10, '#c7b3f2'], [1, 14, '#b4c8f5']].forEach(([d, l, col], i) => {
    const bx = tx + d * 14, by = ty + l + ph(t, 16, i) * 1.5;
    x.strokeStyle = '#7fb48a'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(tx, ty); x.quadraticCurveTo(bx, ty - 6, bx, by - 8); x.stroke();
    x.fillStyle = col; x.beginPath(); x.moveTo(bx - 8, by + 6); x.quadraticCurveTo(bx - 8, by - 9, bx, by - 9); x.quadraticCurveTo(bx + 8, by - 9, bx + 8, by + 6);
    x.lineTo(bx + 5, by + 3); x.lineTo(bx + 2, by + 6); x.lineTo(bx - 2, by + 3); x.lineTo(bx - 5, by + 6); x.closePath(); x.fill(); edge(.8);
  });
  // ladybird on the leaf
  const lx = fx + 12, ly = fy - 44, k = frac(t / P * 6 + .5), open = clamp(Math.min(k / .03, (.12 - k) / .03), 0, 1);
  place(lx, ly, 1, false, -.4);
  C.circ(8, 0, 5, '#4a4060');
  if (open > 0) { x.fillStyle = 'rgba(240,240,255,.6)'; x.beginPath(); x.ellipse(-4, -6 - open * 4, 9, 4, -.5, 0, 7); x.fill(); x.beginPath(); x.ellipse(-4, 6 + open * 4, 9, 4, .5, 0, 7); x.fill(); }
  [-1, 1].forEach(d => { x.save(); x.rotate(d * open * .6); x.fillStyle = '#f2817a'; x.beginPath(); x.ellipse(-2, d * 3.5, 9, 5, 0, 0, 7); x.fill(); C.circ(-4, d * 4.5, 1.6, '#4a4060'); C.circ(2, d * 3.5, 1.3, '#4a4060'); x.restore(); });
  x.restore();
  sleepEye(lx + 6.5, ly - 2, 1.6);   // she's dozing
}
function tortoise(t) {
  // strolls left to right along the front, once per loop, with a little pause to look around
  const k = frac(t / P + .62), tx = -70 + k * (W + 140), step = ph(t, 200) * 1.5;
  place(tx, 514, 1, false);
  x.fillStyle = 'rgba(60,100,70,.3)'; x.beginPath(); x.ellipse(0, 2, 36, 5, 0, 0, 7); x.fill();
  x.fillStyle = '#b9d49a'; [[-18, step], [-6, -step], [8, step], [18, -step]].forEach(([a, d]) => { x.beginPath(); x.roundRect(a - 4 + d, -8, 8, 10, 3); x.fill(); });
  // head
  x.save(); x.translate(30, -12 + ph(t, 24) * 1.5);
  x.fillStyle = '#b9d49a'; x.beginPath(); x.ellipse(0, 0, 11, 9, 0, 0, 7); x.fill(); edge(1);
  eye(3, -2, 2.3, t, 7, 8); smile(6, 2, 3, INKE, 1.2); cheek(1, 3.5, 2.4);
  x.restore();
  // shell
  x.fillStyle = '#d7b38c'; x.beginPath(); x.ellipse(0, -14, 28, 18, 0, Math.PI, TAU); x.lineTo(28, -12); x.lineTo(-28, -12); x.fill(); edge(1.2);
  x.fillStyle = '#e8c9a2'; [[-14, -20], [0, -25], [14, -20]].forEach(([a, b]) => { x.beginPath(); x.ellipse(a, b, 7, 5, 0, 0, 7); x.fill(); });
  x.fillStyle = '#c49c76'; x.fillRect(-28, -14, 56, 3);
  x.restore();
}
function dragonfly(t) {
  const a = TAU * 3 * t / P, dx = 360 + Math.sin(a) * 120, dy = 380 + Math.sin(2 * a) * 22 + ph(t, 9) * 8;
  const flip = Math.cos(a) < 0, fl = Math.abs(ph(t, 1500)) * .7 + .3;
  place(dx, dy, 1, flip);
  x.fillStyle = 'rgba(230,240,255,.65)'; [[-2, -1], [4, -1]].forEach(([a2, s]) => { x.beginPath(); x.ellipse(a2, -6 * fl, 3.2, 11 * fl, .25, 0, 7); x.fill(); x.beginPath(); x.ellipse(a2, 6 * fl, 3.2, 11 * fl, -.25, 0, 7); x.fill(); });
  x.fillStyle = '#7fc7c9'; x.beginPath(); x.roundRect(-22, -1.6, 22, 3.2, 1.6); x.fill();
  C.circ(3, 0, 4, '#8ad0d2'); C.circ(8, 0, 3.4, '#8ad0d2'); C.circ(9, -1, 1.2, INKE);
  x.restore();
}
function dandelion(cx, cy, h, t, o) {
  const sw = ph(t, 10, o) * 3;
  x.strokeStyle = '#8cbf92'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(cx, cy); x.quadraticCurveTo(cx + sw * .3, cy - h * .5, cx + sw, cy - h); x.stroke();
  glow(cx + sw, cy - h, 14, 'rgba(255,255,255,A)', .35);
  x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = .8;
  for (let i = 0; i < 16; i++) { const a2 = i / 16 * TAU; x.beginPath(); x.moveTo(cx + sw, cy - h); x.lineTo(cx + sw + Math.cos(a2) * 8, cy - h + Math.sin(a2) * 8); x.stroke(); C.circ(cx + sw + Math.cos(a2) * 8.5, cy - h + Math.sin(a2) * 8.5, 1, '#ffffff'); }
}
function seeds(t) {
  for (let i = 0; i < 8; i++) {
    const k = frac(hash(i + 50) + t / P * (2 + i % 3)), sx = -20 + k * (W + 40), sy = 250 + hash(i + 80) * 190 + Math.sin(k * TAU * 2 + i) * 18;
    x.globalAlpha = Math.min(1, k * 8, (1 - k) * 8) * .8;
    x.strokeStyle = '#ffffff'; x.lineWidth = .7;
    for (let a = 0; a < 6; a++) { const an = a / 6 * TAU; x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + Math.cos(an) * 3.6, sy + Math.sin(an) * 3.6); x.stroke(); }
  }
  x.globalAlpha = 1;
}
function frontPlants(t) {
  const FL = ['#f7c6dc', '#fff0b0', '#d6c8ff', '#ffd7bd', '#ffffff'];
  for (let i = 0; i < 18; i++) {
    const fx = hash(i + 300) * W, fy = 520 + hash(i + 330) * 24, sw = ph(t, 12, i) * 2.5, col = FL[i % FL.length];
    x.strokeStyle = '#7fb48a'; x.lineWidth = 2; x.lineCap = 'round'; x.beginPath(); x.moveTo(fx, fy); x.quadraticCurveTo(fx + sw * .3, fy - 10, fx + sw, fy - 20); x.stroke();
    for (let p = 0; p < 5; p++) { const a2 = p / 5 * TAU; C.circ(fx + sw + Math.cos(a2) * 4.5, fy - 20 + Math.sin(a2) * 4.5, 3.6, col); }
    C.circ(fx + sw, fy - 20, 2.5, '#ffe08a');
  }
  [[214, 530, 1], [470, 534, 2], [770, 528, 3], [905, 532, 4]].forEach(([a, b, o]) => grassClump(a, b, 1, t, o, '#73a97d'));
}
// fireflies: soft glowing dots on slow looping paths, each pulsing gently
const FF = Array.from({ length: 44 }, (_, i) => ({
  cx: 40 + hash(i + 900) * 880, cy: 220 + hash(i + 930) * 270, rx: 20 + hash(i + 960) * 50, ry: 10 + hash(i + 990) * 26,
  m: 1 + (i % 4), n: 2 + (i % 3), o: hash(i + 1020) * TAU, pm: 18 + (i % 7) * 4,
}));
function fireflies(t, front) {
  FF.forEach((f, i) => {
    if ((i % 3 === 0) !== front) return;
    const fx = f.cx + Math.sin(TAU * f.m * t / P + f.o) * f.rx, fy = f.cy + Math.sin(TAU * f.n * t / P + f.o * 1.3) * f.ry;
    const b = .35 + .65 * Math.max(0, ph(t, f.pm, f.o)) ** 2;
    glow(fx, fy, (front ? 22 : 15) * (.7 + .5 * b), 'rgba(255,240,150,A)', .7 * b);
    C.circ(fx, fy, front ? 3 : 2.2, `rgba(255,252,210,${.5 + .5 * b})`);
  });
}

function draw(t0) {
  const lt = t0, t = (t0 + T0) % P;
  sky(t);
  stars(t);
  wispClouds(t);
  moon(t);
  hills(t);
  meadowGround();
  at(838, 418, 828, 396, 1.12, () => willow(t));
  fireflies(t, false);
  pond(t);
  cattails(t, [[200, 440, 62], [212, 448, 78], [226, 444, 54], [590, 446, 70], [602, 452, 56]]);
  lilyPad(320, 432, 40, null); lilyPad(450, 458, 30, '#ffc9da'); lilyPad(512, 418, 24, null); lilyPad(262, 462, 20, '#fff3c8');
  at(300, 441, 320, 434, 1.6, () => frog(300, 441, 1, t, 0, false));
  at(470, 433, 512, 420, 1.6, () => frog(470, 433, .62, t, 2, true));
  at(640, 440, 742, 446, 1.4, () => stumpRaccoon(t));
  at(100, 446, 98, 452, 1.45, () => bunnies(t));
  at(548, 470, 656, 486, 1.35, () => ladybirdFlower(t));
  at(720, 480, 884, 500, 1.2, () => { dandelion(720, 480, 46, t, 1); dandelion(740, 488, 34, t, 2); });
  at(176, 492, 184, 506, 1.3, () => dandelion(176, 492, 40, t, 3));
  at(360, 380, 400, 318, 1.4, () => dragonfly(t));
  seeds(t);
  at(480, 514, 480, 514, 1.35, () => tortoise(t));
  frontPlants(t);
  fireflies(t, true);
  const v = x.createRadialGradient(480, 280, 260, 480, 280, 640); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(70,50,110,.22)'); x.fillStyle = v; x.fillRect(0, 0, W, H);
  const fin = process.env.FADE || process.env.FADEIN, fout = process.env.FADE || process.env.FADEOUT;
  const f = Math.max(fin ? clamp(1 - lt / 3) : 0, fout ? clamp((lt - (DUR - 6)) / 6) : 0);
  if (f > 0) { x.fillStyle = `rgba(0,0,0,${f})`; x.fillRect(0, 0, W, H); }
}
if (require.main === module) C.run(draw, DUR, {});
