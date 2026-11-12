// Calm "Dancing Fruit & Veggies" garden (colour sensory, approved idea 2026-11-08). Everything is periodic with P seconds (seamless loop).
// A sunny pastel vegetable garden: smiling sun with slowly turning rays, drifting clouds, soft hills with a little greenhouse, a white picket fence
// with a bluebird hopping along it, two sunflowers nodding. In two raised garden beds nine friendly fruit & veggie characters sway gently to the music
// (corn, broccoli, tomato, eggplant, pumpkin at the back; carrot, strawberry, pea pod, watermelon slice at the front); in turn each one does a little
// solo (hop + arms up + a happy wiggle). Butterflies loop around, a snail strolls along the front, a watering can on a fence post sprinkles sparkly drops.
const C = require('../lib/common');
const { x, W, H, clamp, lerp, hash } = C;
const P = 240, TAU = Math.PI * 2;
const DUR = +(process.env.DUR || P);
const T0 = +(process.env.T0 || 0);
const ph = (t, m = 1, o = 0) => Math.sin(TAU * m * t / P + o);
const frac = v => v - Math.floor(v);
const INKE = '#4a3b52';
const OUTL = 'rgba(80,60,70,.38)';
const edge = (w = 1.4) => { x.strokeStyle = OUTL; x.lineWidth = w; x.stroke(); };
function glow(cx, cy, r, col, a) {
  const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0));
  x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
}
// every must divide 240 so the loop stays seamless
function eye(cx, cy, r, t, o = 0, every = 5) {
  const blink = ((t + o * 1.37) % every) < .17;
  if (blink) { x.strokeStyle = INKE; x.lineWidth = r * .5; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r * .8, .2, Math.PI - .2); x.stroke(); return; }
  C.circ(cx, cy, r, INKE); C.circ(cx + r * .35, cy - r * .38, r * .4, '#ffffff');
}
const happyEye = (cx, cy, r) => { x.strokeStyle = INKE; x.lineWidth = Math.max(1.6, r * .5); x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy + r * .4, r, Math.PI + .35, TAU - .35); x.stroke(); };
const smile = (cx, cy, r, w = 2.2, open = 0) => {
  if (open > 0) { x.fillStyle = '#b34a5c'; x.beginPath(); x.arc(cx, cy, r, .15, Math.PI - .15); x.closePath(); x.fill(); C.circ(cx, cy + r * .55, r * .35, '#ff9fb0'); return; }
  x.strokeStyle = INKE; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r, .3, Math.PI - .3); x.stroke();
};
const cheek = (cx, cy, r) => C.circ(cx, cy, r, 'rgba(255,120,150,.4)');
function place(px, py, s, flip, rot = 0) { x.save(); x.translate(px, py); x.rotate(rot); x.scale(flip ? -s : s, s); }

// ---------- sky ----------
function sky(t) {
  const g = x.createLinearGradient(0, 0, 0, 330);
  g.addColorStop(0, '#9fd3f2'); g.addColorStop(.6, '#c9e8f6'); g.addColorStop(1, '#fdf3dc');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
}
function sun(t) {
  const sx = 812, sy = 88 + ph(t, 2) * 3;
  glow(sx, sy, 120, 'rgba(255,240,170,A)', .55);
  x.save(); x.translate(sx, sy); x.rotate(TAU * 2 * t / P);
  for (let i = 0; i < 12; i++) { x.rotate(TAU / 12); x.fillStyle = i % 2 ? '#ffe28a' : '#ffd36b'; x.beginPath(); x.moveTo(-7, -48); x.lineTo(0, -70 - (i % 2) * 8 - ph(t, 30, i) * 3); x.lineTo(7, -48); x.closePath(); x.fill(); }
  x.restore();
  C.circ(sx, sy, 42, '#ffd86b'); C.circ(sx - 6, sy - 6, 32, '#ffe79a');
  eye(sx - 14, sy - 4, 4.2, t, 3, 6); eye(sx + 14, sy - 4, 4.2, t, 3.05, 6); cheek(sx - 22, sy + 9, 6); cheek(sx + 22, sy + 9, 6); smile(sx, sy + 8, 11, 2.6);
}
function clouds(t) {
  [[.05, 70, 1.0], [.4, 128, .75], [.72, 54, .85]].forEach(([o, cy, s], i) => {
    const cx = -140 + frac(t / P + o) * (W + 280);
    x.fillStyle = 'rgba(255,255,255,.92)';
    x.beginPath(); x.ellipse(cx, cy + 10 * s, 70 * s, 18 * s, 0, 0, 7); x.fill();
    C.circ(cx - 26 * s, cy, 24 * s, 'rgba(255,255,255,.92)'); C.circ(cx + 6 * s, cy - 10 * s, 32 * s, 'rgba(255,255,255,.92)'); C.circ(cx + 36 * s, cy + 2 * s, 22 * s, 'rgba(255,255,255,.92)');
    if (i === 0) { const ex = cx + 4 * s, ey = cy + 2 * s; eye(ex - 12, ey, 3, t, 9, 8); eye(ex + 12, ey, 3, t, 9.05, 8); smile(ex, ey + 6, 5, 1.6); }
  });
}
// ---------- landscape ----------
const farY = i => 286 - Math.sin(i * .007 + .4) * 24 - Math.sin(i * .019) * 7;
const midY = i => 318 - Math.sin(i * .005 + 2.1) * 14 - Math.sin(i * .015 + 1) * 5;
function hills(t) {
  x.fillStyle = '#bfe3b4'; x.beginPath(); x.moveTo(0, H); for (let i = 0; i <= W; i += 10) x.lineTo(i, farY(i)); x.lineTo(W, H); x.fill();
  // little greenhouse on the far hill
  const gx = 300, gy = farY(300) + 4;
  x.fillStyle = 'rgba(235,250,255,.9)'; x.beginPath(); x.moveTo(gx - 26, gy); x.lineTo(gx - 26, gy - 14); x.quadraticCurveTo(gx, gy - 36, gx + 26, gy - 14); x.lineTo(gx + 26, gy); x.closePath(); x.fill(); edge(1);
  x.strokeStyle = 'rgba(120,150,160,.5)'; x.lineWidth = 1; [-13, 0, 13].forEach(a => { x.beginPath(); x.moveTo(gx + a, gy); x.lineTo(gx + a, gy - 22 + Math.abs(a) * .5); x.stroke(); });
  // tiny trees
  [[120, 1], [520, .8], [640, 1.1]].forEach(([tx, s]) => { const ty = farY(tx) + 2; x.fillStyle = '#b39c86'; x.fillRect(tx - 2, ty - 10 * s, 4, 10 * s); C.circ(tx, ty - 16 * s, 11 * s, '#a6d69a'); });
  x.fillStyle = '#a9dc9c'; x.beginPath(); x.moveTo(0, H); for (let i = 0; i <= W; i += 10) x.lineTo(i, midY(i)); x.lineTo(W, H); x.fill();
}
function fence(t) {
  const fy = 352;
  x.fillStyle = '#fffaf2'; x.strokeStyle = 'rgba(150,130,120,.45)'; x.lineWidth = 1.2;
  x.fillRect(0, fy - 34, W, 7); x.strokeRect(-2, fy - 34, W + 4, 7); x.fillRect(0, fy - 16, W, 7); x.strokeRect(-2, fy - 16, W + 4, 7);
  for (let px = 8; px < W; px += 34) { x.beginPath(); x.moveTo(px - 7, fy); x.lineTo(px - 7, fy - 44); x.lineTo(px, fy - 52); x.lineTo(px + 7, fy - 44); x.lineTo(px + 7, fy); x.closePath(); x.fill(); x.stroke(); }
}
function ground() {
  const g = x.createLinearGradient(0, 340, 0, H); g.addColorStop(0, '#9fd48f'); g.addColorStop(1, '#86c27c');
  x.fillStyle = g; x.fillRect(0, 348, W, H - 348);
  // little grass tufts / clover dots
  for (let i = 0; i < 40; i++) { const gx = hash(i + 700) * W, gy = 356 + hash(i + 740) * 180; x.fillStyle = 'rgba(255,255,255,.18)'; x.beginPath(); x.ellipse(gx, gy, 3, 1.4, 0, 0, 7); x.fill(); }
}
function bed(x0, y0, w, h) {
  x.fillStyle = 'rgba(60,90,50,.22)'; x.beginPath(); x.ellipse(x0 + w / 2, y0 + h + 4, w / 2 + 8, 8, 0, 0, 7); x.fill();
  C.rr(x0, y0, w, h, 14); x.fillStyle = '#d9a77c'; x.fill(); edge(1.4);
  for (let k = 1; k < 4; k++) { x.strokeStyle = 'rgba(150,100,70,.35)'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(x0 + 8, y0 + h * k / 4); x.lineTo(x0 + w - 8, y0 + h * k / 4); x.stroke(); }
  x.fillStyle = '#9c7056'; C.rr(x0 + 6, y0 - 6, w - 12, 14, 7); x.fill();
  for (let i = 0; i < 12; i++) C.circ(x0 + 18 + hash(i + w) * (w - 36), y0 - 1 + hash(i + 30) * 4, 2 + hash(i) * 2, '#86604a');
}
// ---------- sunflowers ----------
function sunflower(cx, cy, h, t, o) {
  const sw = ph(t, 12, o) * 4, nod = ph(t, 12, o) * .08;
  x.strokeStyle = '#7dbb6c'; x.lineWidth = 5; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx, cy); x.quadraticCurveTo(cx + sw * .3, cy - h * .5, cx + sw, cy - h); x.stroke();
  x.fillStyle = '#8fcc7c'; [[-1, .35], [1, .55]].forEach(([d, k]) => { x.beginPath(); x.ellipse(cx + d * 16 + sw * k * .3, cy - h * k, 16, 6, d * .5, 0, 7); x.fill(); });
  x.save(); x.translate(cx + sw, cy - h); x.rotate(nod);
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; x.fillStyle = i % 2 ? '#ffd45c' : '#ffc94a'; x.beginPath(); x.ellipse(Math.cos(a) * 24, Math.sin(a) * 24, 12, 5.5, a, 0, 7); x.fill(); }
  C.circ(0, 0, 17, '#b9835a'); C.circ(0, 0, 12, '#c9946a');
  eye(-6, -2, 2.6, t, o + 4, 6); eye(6, -2, 2.6, t, o + 4.05, 6); smile(0, 4, 5, 1.6);
  x.restore();
}
// ---------- the dancers ----------
// dance state for character i: gentle sway + bob; solo window -> bigger hop, arms up, happy eyes
const N = 9;
function dance(t, i) {
  const o = i * .7;
  const k = frac(t / P * 3 + i / N), solo = clamp(Math.min(k / .006, (.032 - k) / .006), 0, 1);   // 3 solos per loop, ~2.3 s each
  const hopPh = clamp(k / .032);
  const hop = solo * Math.abs(Math.sin(hopPh * Math.PI * 3)) * 16;
  return { sway: ph(t, 60, o) * .07 + solo * Math.sin(hopPh * TAU * 3) * .12, bob: Math.abs(ph(t, 60, o)) * 3, hop, solo, arm: ph(t, 60, o + .8) };
}
function arms(lx, rx, y, d, col, len = 18) {
  x.strokeStyle = col; x.lineWidth = 4; x.lineCap = 'round';
  const up = d.solo;
  [[-1, lx], [1, rx]].forEach(([s, ax]) => {
    const a = lerp(.55 + s * d.arm * .25, -1.1, up);   // down-ish waving -> both arms up during the solo
    const ex = ax + s * Math.cos(a) * len, ey = y + Math.sin(a) * len;
    x.beginPath(); x.moveTo(ax, y); x.lineTo(ex, ey); x.stroke(); C.circ(ex, ey, 3.6, col);
  });
}
function feet(col, w = 10) { C.circ(-w, 0, 5, col); C.circ(w, 0, 5, col); }
function face(cx, cy, s, t, i, d, every = 5) {
  if (d.solo > .5) { happyEye(cx - 8 * s, cy, 3.6 * s); happyEye(cx + 8 * s, cy, 3.6 * s); }
  else { eye(cx - 8 * s, cy, 3.6 * s, t, i, every); eye(cx + 8 * s, cy, 3.6 * s, t, i + .04, every); }
  cheek(cx - 13 * s, cy + 7 * s, 3.4 * s); cheek(cx + 13 * s, cy + 7 * s, 3.4 * s);
  smile(cx, cy + 6 * s, 5 * s, 2, d.solo > .5 ? 1 : 0);
}
const FIG = [
  // 0 corn
  (t, d) => {
    feet('#7fb26a', 8);
    x.fillStyle = '#9ccf7f'; [-1, 1].forEach(s => { x.beginPath(); x.moveTo(0, -4); x.quadraticCurveTo(s * 28, -40, s * 18, -86); x.quadraticCurveTo(s * 8, -40, 0, -4); x.fill(); });
    x.fillStyle = '#ffd45c'; x.beginPath(); x.ellipse(0, -60, 19, 46, 0, 0, 7); x.fill(); edge();
    for (let r = 0; r < 7; r++) for (let c = -1; c <= 1; c++) C.circ(c * 9, -94 + r * 11, 3.6, r % 2 ? '#ffe07a' : '#ffcf4a');
    x.strokeStyle = '#d9c27a'; x.lineWidth = 2; for (let k = -2; k <= 2; k++) { x.beginPath(); x.moveTo(k * 2, -104); x.lineTo(k * 5, -116); x.stroke(); }
    arms(-17, 17, -48, d, '#7fb26a'); face(0, -64, 1, t, 0, d);
  },
  // 1 broccoli
  (t, d) => {
    feet('#86b86a', 9);
    x.fillStyle = '#b5dc8c'; x.beginPath(); x.moveTo(-12, -2); x.lineTo(-9, -46); x.lineTo(9, -46); x.lineTo(12, -2); x.closePath(); x.fill(); edge();
    [[-24, -58, 20], [24, -58, 20], [-12, -80, 22], [14, -82, 22], [0, -64, 24]].forEach(([a, b, r]) => { C.circ(a, b, r, '#78b765'); });
    [[-24, -58, 20], [24, -58, 20], [-12, -80, 22], [14, -82, 22]].forEach(([a, b, r]) => { x.beginPath(); x.arc(a, b, r, Math.PI * .9, Math.PI * 2.1); edge(1.2); });
    for (let i = 0; i < 14; i++) C.circ(-30 + hash(i + 3) * 60, -96 + hash(i + 9) * 50, 2.4, 'rgba(255,255,255,.22)');
    arms(-11, 11, -26, d, '#86b86a'); face(0, -32, .9, t, 1, d);
  },
  // 2 tomato
  (t, d) => {
    feet('#e0574f', 12);
    C.circ(0, -36, 34, '#f2675e'); x.beginPath(); x.arc(0, -36, 34, 0, 7); edge();
    C.circ(-12, -50, 9, 'rgba(255,255,255,.35)');
    x.fillStyle = '#7fbb63'; x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 6 : 16; x.lineTo(Math.cos(a) * r, -68 + Math.sin(a) * r * .45); } x.closePath(); x.fill();
    x.strokeStyle = '#6aa654'; x.lineWidth = 3; x.beginPath(); x.moveTo(0, -70); x.quadraticCurveTo(3, -80, 8, -82); x.stroke();
    arms(-32, 32, -34, d, '#d9524b'); face(0, -36, 1, t, 2, d);
  },
  // 3 eggplant (aubergine)
  (t, d) => {
    feet('#8a63a8', 10);
    x.fillStyle = '#a079c2'; x.beginPath(); x.moveTo(0, -94); x.bezierCurveTo(24, -92, 22, -64, 26, -40); x.bezierCurveTo(32, -6, 14, 0, 0, 0); x.bezierCurveTo(-14, 0, -32, -6, -26, -40); x.bezierCurveTo(-22, -64, -24, -92, 0, -94); x.fill(); edge();
    C.circ(-11, -58, 7, 'rgba(255,255,255,.28)');
    x.fillStyle = '#86c06a'; x.beginPath(); x.moveTo(-16, -86); x.quadraticCurveTo(0, -108, 16, -86); x.quadraticCurveTo(8, -80, 0, -84); x.quadraticCurveTo(-8, -80, -16, -86); x.fill();
    x.fillRect(-3, -110, 6, 14);
    arms(-25, 25, -38, d, '#8a63a8'); face(0, -42, 1, t, 3, d);
  },
  // 4 pumpkin
  (t, d) => {
    feet('#e08a3c', 18);
    [[-26, 26], [26, 26], [-12, 30], [12, 30], [0, 31]].forEach(([a, r], j) => { x.fillStyle = j < 2 ? '#f39a4a' : j < 4 ? '#f7a85a' : '#fbb468'; x.beginPath(); x.ellipse(a, -32, r * .8, 31, 0, 0, 7); x.fill(); });
    x.beginPath(); x.ellipse(0, -32, 46, 32, 0, 0, 7); edge();
    x.strokeStyle = 'rgba(200,110,40,.4)'; x.lineWidth = 1.5; [-22, 22, -8, 8].forEach(a => { x.beginPath(); x.ellipse(a, -32, 3, 28, 0, 0, 7); x.stroke(); });
    x.fillStyle = '#8c6a4c'; x.beginPath(); x.roundRect(-4, -72, 8, 14, 3); x.fill();
    x.strokeStyle = '#7fbb63'; x.lineWidth = 2.4; x.beginPath(); x.moveTo(3, -66); x.bezierCurveTo(14, -78, 22, -60, 30, -70); x.stroke();
    arms(-44, 44, -30, d, '#e08a3c'); face(0, -32, 1.05, t, 4, d);
  },
  // 5 carrot
  (t, d) => {
    feet('#e9823f', 8);
    x.fillStyle = '#ff9f5a'; x.beginPath(); x.moveTo(-22, -84); x.quadraticCurveTo(-24, -40, -4, -2); x.quadraticCurveTo(0, 2, 4, -2); x.quadraticCurveTo(24, -40, 22, -84); x.quadraticCurveTo(0, -92, -22, -84); x.fill(); edge();
    x.strokeStyle = 'rgba(200,100,40,.45)'; x.lineWidth = 1.6; [[-14, -36], [10, -54], [-8, -20], [12, -26]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(a + 7 * Math.sign(-a), b + 1); x.stroke(); });
    x.fillStyle = '#86c66c'; [-12, 0, 12].forEach((a, j) => { x.save(); x.translate(a * .6, -86); x.rotate(a * .04 + ph(t, 60, j) * .1); x.beginPath(); x.ellipse(0, -16, 6, 18, 0, 0, 7); x.fill(); x.restore(); });
    arms(-21, 21, -56, d, '#e9823f'); face(0, -62, 1, t, 5, d);
  },
  // 6 strawberry
  (t, d) => {
    feet('#e0524f', 10);
    x.fillStyle = '#ff6f6a'; x.beginPath(); x.moveTo(0, -2); x.bezierCurveTo(-34, -20, -36, -70, 0, -70); x.bezierCurveTo(36, -70, 34, -20, 0, -2); x.fill(); edge();
    for (let i = 0; i < 16; i++) { const a = -30 + (i % 4) * 20 + (Math.floor(i / 4) % 2) * 10, b = -60 + Math.floor(i / 4) * 13; if (Math.abs(a) > 30 - Math.floor(i / 4) * 4 || (b > -56 && b < -26 && Math.abs(a) < 24)) continue; x.fillStyle = '#fff1a6'; x.beginPath(); x.ellipse(a * .9, b, 1.6, 2.6, 0, 0, 7); x.fill(); }
    x.fillStyle = '#7fbb63'; x.beginPath(); for (let i = 0; i < 12; i++) { const a = Math.PI + i * Math.PI / 11, r = i % 2 ? 8 : 18; x.lineTo(Math.cos(a) * r * 1.3, -70 + Math.sin(a) * r * .55); } x.closePath(); x.fill();
    x.fillRect(-2, -86, 4, 10);
    arms(-28, 28, -38, d, '#e0524f'); face(0, -42, 1, t, 6, d);
  },
  // 7 pea pod with three little peas (their eyes blink too)
  (t, d) => {
    feet('#79b465', 14);
    x.fillStyle = '#8fd07a'; x.beginPath(); x.moveTo(-40, -42); x.quadraticCurveTo(0, -84, 40, -42); x.quadraticCurveTo(0, -4, -40, -42); x.fill(); edge();
    x.fillStyle = '#a9e08f'; x.beginPath(); x.moveTo(-32, -44); x.quadraticCurveTo(0, -68, 32, -44); x.quadraticCurveTo(0, -24, -32, -44); x.fill();
    [-18, 0, 18].forEach((a, j) => { const by = -46 - (d.solo > .5 ? Math.abs(Math.sin(t * 6 + j)) * 5 : 0); C.circ(a, by, 9.5, '#6fc25a'); C.circ(a - 3, by - 3, 3, 'rgba(255,255,255,.35)');
      if (d.solo > .5) { happyEye(a - 3.5, by - 1, 1.8); happyEye(a + 3.5, by - 1, 1.8); } else { eye(a - 3.5, by - 1, 1.8, t, 7 + j * .3, 5); eye(a + 3.5, by - 1, 1.8, t, 7.04 + j * .3, 5); }
      smile(a, by + 3, 2.4, 1.2); });
    x.strokeStyle = '#6aa654'; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.moveTo(40, -42); x.quadraticCurveTo(50, -50, 46, -60); x.stroke();
    arms(-34, 34, -34, d, '#79b465');
  },
  // 8 watermelon slice
  (t, d) => {
    feet('#5fa65a', 16);
    x.beginPath(); x.moveTo(-46, -66); x.lineTo(46, -66); x.lineTo(0, 0); x.closePath(); x.fillStyle = '#ff8c8c'; x.fill();
    x.beginPath(); x.moveTo(-46, -66); x.lineTo(46, -66); x.lineTo(46, -74); x.lineTo(-46, -74); x.closePath(); x.fillStyle = '#6dbb5e'; x.fill();
    x.fillStyle = '#e8ffd8'; x.fillRect(-46, -68, 92, 3);
    x.beginPath(); x.moveTo(-46, -74); x.lineTo(46, -74); x.lineTo(46, -66); x.lineTo(0, 0); x.lineTo(-46, -66); x.closePath(); edge();
    [[-24, -56], [24, -56], [-10, -24], [10, -24], [0, -12]].forEach(([a, b]) => { x.fillStyle = '#4a3b52'; x.beginPath(); x.ellipse(a, b, 2, 3.4, a * .02, 0, 7); x.fill(); });
    arms(-34, 34, -48, d, '#5fa65a'); face(0, -46, 1, t, 8, d);
  },
];
// [figure, x, ground y, scale]
const CAST = [[0, 168, 412, 1.05], [1, 322, 412, 1.0], [2, 478, 412, 1.0], [3, 632, 412, 1.0], [4, 790, 412, 1.0],
              [5, 246, 498, 1.08], [6, 404, 498, 1.08], [7, 560, 498, 1.06], [8, 716, 498, 1.06]];
function dancers(t, row) {
  CAST.forEach(([f, px, gy, s], j) => {
    if ((gy > 450) !== row) return;
    const d = dance(t, j);
    x.fillStyle = 'rgba(70,60,40,.18)'; x.beginPath(); x.ellipse(px, gy + 2, 30 * s * (1 - d.hop / 60), 5 * s, 0, 0, 7); x.fill();
    if (d.solo > 0) glow(px, gy - 50 * s, 80 * s, 'rgba(255,250,200,A)', .35 * d.solo);
    place(px, gy - d.bob - d.hop, s, false, d.sway);
    FIG[f](t, d);
    x.restore();
    if (d.solo > .2) { // little music notes float up during the solo
      for (let n = 0; n < 2; n++) { const kk = frac(t * .6 + n * .5), nx = px + (n ? 34 : -38) * s + Math.sin(kk * 6) * 5, ny = gy - 110 * s - kk * 40;
        x.globalAlpha = d.solo * Math.sin(kk * Math.PI); x.fillStyle = n ? '#ff8fb0' : '#7fb6ff';
        x.beginPath(); x.ellipse(nx, ny, 5, 4, -.4, 0, 7); x.fill(); x.fillRect(nx + 3.5, ny - 16, 2, 16); x.fillRect(nx + 3.5, ny - 16, 7, 3); x.globalAlpha = 1; }
    }
  });
}
// ---------- little friends ----------
function bluebird(t) {
  // hops along the fence rail, 2 trips per loop (left->right and back)
  const k = frac(t / P * 2), go = k < .5, u = go ? k * 2 : (1 - k) * 2;
  const step = Math.floor(u * 16), su = u * 16 - step, bx = 90 + (step + C.ease(su)) / 16 * 780, by = 318 - Math.sin(su * Math.PI) * 9;
  place(bx, by, 1, !go);
  x.fillStyle = '#7fb6ef'; x.beginPath(); x.ellipse(0, -9, 12, 9, 0, 0, 7); x.fill(); edge(1);
  x.fillStyle = '#ffd9b8'; x.beginPath(); x.ellipse(3, -6, 7, 5, 0, 0, 7); x.fill();
  C.circ(9, -16, 7, '#7fb6ef'); eye(11, -17, 1.8, t, 2.2, 4);
  x.fillStyle = '#ffb44a'; x.beginPath(); x.moveTo(15, -16); x.lineTo(21, -14.5); x.lineTo(15, -13); x.closePath(); x.fill();
  x.fillStyle = '#6aa4e0'; x.beginPath(); x.moveTo(-10, -10); x.lineTo(-22, -15); x.lineTo(-20, -6); x.closePath(); x.fill();
  x.fillStyle = '#6aa4e0'; x.beginPath(); x.ellipse(-2, -9, 7, 4, -.3 - (su < .5 ? Math.sin(su * TAU) * .4 : 0), 0, 7); x.fill();
  x.strokeStyle = '#d98f4a'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(-2, -1); x.lineTo(-2, 3); x.moveTo(3, -1); x.lineTo(3, 3); x.stroke();
  x.restore();
}
function wateringCan(t) {
  // on the fence post at the left: tips forward now and then and sprinkles sparkly drops on the corn
  const k = frac(t / P * 6 + .1), tip = clamp(Math.min(k / .02, (.1 - k) / .02), 0, 1);
  const cx = 62, cy = 300;
  x.fillStyle = '#c9a98c'; x.fillRect(cx - 8, cy, 16, 52); edge(1);
  x.save(); x.translate(cx, cy); x.rotate(.45 * C.ease(tip));
  x.fillStyle = '#8fc6e8'; C.rr(-20, -30, 40, 30, 7); x.fill(); edge(1.2);
  x.strokeStyle = '#8fc6e8'; x.lineWidth = 5; x.beginPath(); x.arc(-4, -32, 12, Math.PI, 0); x.stroke();
  x.fillStyle = '#8fc6e8'; x.beginPath(); x.moveTo(18, -20); x.lineTo(44, -38); x.lineTo(48, -34); x.lineTo(20, -10); x.closePath(); x.fill();
  C.circ(46, -38, 5, '#7ab6dc');
  eye(-8, -16, 2.4, t, 6, 6); eye(6, -16, 2.4, t, 6.05, 6); smile(-1, -10, 3.4, 1.4);
  x.restore();
  if (tip > .6) {
    const sx = cx + 54, sy = cy - 12;
    for (let i = 0; i < 9; i++) { const kk = frac(t * 1.4 + i / 9), dx = sx + 8 + kk * 34 + (i % 3) * 6, dy = sy + kk * kk * 70;
      x.globalAlpha = (tip - .6) / .4 * (1 - kk); x.fillStyle = i % 3 ? '#a8dcff' : '#ffffff'; x.beginPath(); x.ellipse(dx, dy, 2, 3.2, 0, 0, 7); x.fill(); }
    x.globalAlpha = 1;
  }
}
function butterfly(t, o, cols) {
  const a = TAU * 2 * t / P + o, bx = 480 + Math.sin(a) * 360 + Math.sin(a * 3) * 30, by = 230 + Math.sin(a * 2 + o) * 40 + ph(t, 16, o) * 10;
  const fl = .35 + .65 * Math.abs(ph(t, 480, o));
  place(bx, by, 1, Math.cos(a) < 0);
  x.fillStyle = cols[0]; x.beginPath(); x.ellipse(-6 * fl, -7, 9 * fl, 10, -.4, 0, 7); x.fill(); x.beginPath(); x.ellipse(6 * fl, -7, 9 * fl, 10, .4, 0, 7); x.fill();
  x.fillStyle = cols[1]; x.beginPath(); x.ellipse(-5 * fl, 6, 6 * fl, 7, .3, 0, 7); x.fill(); x.beginPath(); x.ellipse(5 * fl, 6, 6 * fl, 7, -.3, 0, 7); x.fill();
  x.fillStyle = INKE; x.beginPath(); x.ellipse(0, 0, 2, 9, 0, 0, 7); x.fill();
  x.strokeStyle = INKE; x.lineWidth = 1; x.beginPath(); x.moveTo(0, -8); x.lineTo(-4, -15); x.moveTo(0, -8); x.lineTo(4, -15); x.stroke();
  x.restore();
}
function snail(t) {
  // strolls right to left along the very front, once per loop
  const k = frac(t / P + .3), sx = W + 60 - k * (W + 120), sy = 528;
  place(sx, sy, 1, false);
  x.fillStyle = '#ffe2b8'; x.beginPath(); x.moveTo(-26, 0); x.quadraticCurveTo(-30, -8, -22, -12); x.lineTo(10, -8); x.quadraticCurveTo(22, -4, 24, 0); x.closePath(); x.fill(); edge(1);
  x.strokeStyle = '#ffe2b8'; x.lineWidth = 2.4; x.beginPath(); x.moveTo(-22, -10); x.lineTo(-26, -24 + ph(t, 40) * 1.5); x.moveTo(-18, -10); x.lineTo(-17, -24); x.stroke();
  C.circ(-26, -25, 2.6, '#ffe2b8'); C.circ(-17, -25, 2.6, '#ffe2b8'); C.circ(-26, -25, 1.3, INKE); C.circ(-17, -25, 1.3, INKE);
  C.circ(4, -18, 15, '#f7b0c8'); x.beginPath(); x.arc(4, -18, 15, 0, 7); edge(1);
  x.strokeStyle = '#e48aa8'; x.lineWidth = 2; x.beginPath(); for (let a = 0; a < 12; a += .3) { const r = 13 - a; x.lineTo(4 + Math.cos(a) * r, -18 + Math.sin(a) * r); } x.stroke();
  smile(-20, -6, 2.4, 1.2);
  x.restore();
}
function sparkles(t) {
  for (let i = 0; i < 14; i++) {
    const k = frac(hash(i + 50) + t / P * (3 + i % 4)), sx = 40 + hash(i + 80) * 880, sy = 460 - k * 300;
    x.globalAlpha = Math.sin(k * Math.PI) * .7; const r = 2.5 + (i % 3);
    x.fillStyle = i % 2 ? '#fff6c8' : '#ffffff'; x.beginPath();
    x.moveTo(sx, sy - r * 2); x.quadraticCurveTo(sx, sy, sx + r * 2, sy); x.quadraticCurveTo(sx, sy, sx, sy + r * 2); x.quadraticCurveTo(sx, sy, sx - r * 2, sy); x.quadraticCurveTo(sx, sy, sx, sy - r * 2); x.fill();
  }
  x.globalAlpha = 1;
}
function frontFlowers(t) {
  const FL = ['#ffc4dc', '#fff0a8', '#d8c8ff', '#ffd2b8', '#ffffff'];
  for (let i = 0; i < 16; i++) {
    const fx = 20 + hash(i + 300) * 920, fy = 526 + hash(i + 330) * 12, sw = ph(t, 15, i) * 2, col = FL[i % FL.length];
    if (fx > 200 && fx < 760 && hash(i + 9) < .5) continue;
    x.strokeStyle = '#74b066'; x.lineWidth = 2; x.lineCap = 'round'; x.beginPath(); x.moveTo(fx, fy); x.lineTo(fx + sw, fy - 14); x.stroke();
    for (let p = 0; p < 5; p++) { const a = p / 5 * TAU; C.circ(fx + sw + Math.cos(a) * 4, fy - 14 + Math.sin(a) * 4, 3.2, col); }
    C.circ(fx + sw, fy - 14, 2.3, '#ffd96a');
  }
}

function draw(t0) {
  const lt = t0, t = (t0 + T0) % P;
  sky(t);
  sun(t);
  clouds(t);
  hills(t);
  ground();
  fence(t);
  bluebird(t);
  sunflower(34, 352, 120, t, 0); sunflower(910, 352, 132, t, 2); sunflower(866, 352, 96, t, 4);
  wateringCan(t);
  butterfly(t, 0, ['#ffb3d1', '#ffd7e6']);
  bed(80, 404, 800, 30);
  dancers(t, false);
  bed(150, 490, 660, 30);
  dancers(t, true);
  butterfly(t, 2.4, ['#b9dcff', '#e0f0ff']);
  sparkles(t);
  snail(t);
  frontFlowers(t);
  const fin = process.env.FADE || process.env.FADEIN, fout = process.env.FADE || process.env.FADEOUT;
  const f = Math.max(fin ? clamp(1 - lt / 3) : 0, fout ? clamp((lt - (DUR - 6)) / 6) : 0);
  if (f > 0) { x.fillStyle = `rgba(0,0,0,${f})`; x.fillRect(0, 0, W, H); }
}
if (require.main === module) C.run(draw, DUR, {});
