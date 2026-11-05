// Calm hot-air balloon morning over pastel hills (sensory). Everything is periodic with P seconds (seamless loop).
// Four striped balloons drift by with friendly passengers (bunny, bear cub, piglet, kitten) who wave now and then;
// a smiling sun, sleepy clouds, a turning windmill, geese, a pond with mama duck + duckling, a grazing sheep and a hopping lamb,
// a hedgehog trundling through the flowers, butterflies, swaying flowers.
const C = require('../lib/common');
const { x, W, H, clamp, lerp, hash } = C;
const P = 240, TAU = Math.PI * 2;
const DUR = +(process.env.DUR || P);
const T0 = +(process.env.T0 || 0);
const ph = (t, m = 1, o = 0) => Math.sin(TAU * m * t / P + o);
const frac = v => v - Math.floor(v);
const cross = (t, m, off, pad, dir = 1) => { const k = frac(t / P * m + off); return dir > 0 ? -pad + k * (W + 2 * pad) : W + pad - k * (W + 2 * pad); };
const INKE = '#4a3f5c';
const OUTL = 'rgba(120,100,140,.35)';
const edge = (w = 1.5) => { x.strokeStyle = OUTL; x.lineWidth = w; x.stroke(); };

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
function place(px, py, s, flip, rot = 0) { x.save(); x.translate(px, py); x.rotate(rot); x.scale(flip ? -s : s, s); }

// ---------- sky ----------
function sky(t) {
  const g = x.createLinearGradient(0, 0, 0, 330);
  g.addColorStop(0, '#a9d4f2'); g.addColorStop(.55, '#cfe6f5'); g.addColorStop(.85, '#fde3d6'); g.addColorStop(1, '#ffeedd');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
}
function sun(t) {
  const sx = 820, sy = 92;
  glow(sx, sy, 150, 'rgba(255,236,170,A)', .55);
  x.save(); x.translate(sx, sy); x.rotate(TAU * 2 * t / P);
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU, l = 54 + (i % 2 ? 6 : 14) + ph(t, 20, i) * 3;
    x.fillStyle = '#ffe39a'; x.beginPath(); x.moveTo(Math.cos(a - .1) * 44, Math.sin(a - .1) * 44); x.lineTo(Math.cos(a) * l, Math.sin(a) * l); x.lineTo(Math.cos(a + .1) * 44, Math.sin(a + .1) * 44); x.fill();
  }
  x.restore();
  C.circ(sx, sy, 42, '#ffe08a'); C.circ(sx - 6, sy - 6, 34, '#ffe9a8');
  eye(sx - 14, sy - 6, 4, t, 2, 8); eye(sx + 12, sy - 6, 4, t, 2.05, 8);
  cheek(sx - 22, sy + 8, 6); cheek(sx + 20, sy + 8, 6); smile(sx - 1, sy + 6, 10, INKE, 2.4);
}
function cloud(cx, cy, s, t, face, o) {
  x.save(); x.translate(cx, cy); x.scale(s, s);
  x.fillStyle = 'rgba(255,255,255,.95)';
  [[-38, 6, 24], [-12, -10, 30], [20, -6, 26], [42, 8, 18], [0, 10, 26]].forEach(([a, b, r]) => { x.beginPath(); x.arc(a, b, r, 0, 7); x.fill(); });
  x.fillStyle = 'rgba(214,226,244,.6)'; x.beginPath(); x.ellipse(0, 26, 54, 8, 0, 0, Math.PI); x.fill();
  if (face) { sleepEye(-12, 6, 4); sleepEye(10, 6, 4); cheek(-20, 14, 4); cheek(18, 14, 4); smile(-1, 13, 4, INKE, 1.6); }
  x.restore();
}
function clouds(t) {
  cloud(cross(t, 1, .05, 90), 70, 1.0, t, true, 0);
  cloud(cross(t, 1, .42, 90), 150, .7, t, false, 1);
  cloud(cross(t, 2, .7, 80), 48, .55, t, false, 2);
  cloud(cross(t, 1, .78, 90), 205, .85, t, true, 3);
}
function geese(t) {
  // a small V of geese crosses right to left twice per loop
  const gx = cross(t, 2, .2, 140, -1), gy = 120 + ph(t, 2, 1) * 16;
  [[0, 0], [20, -10], [20, 10], [40, -20], [40, 20]].forEach(([dx, dy], i) => {
    const bx = gx + dx, by = gy + dy * .9 + ph(t, 40, i) * 1.5, fl = ph(t, 240, i * .9);
    x.fillStyle = '#f7f2ea'; x.beginPath(); x.ellipse(bx, by, 7, 3.2, 0, 0, 7); x.fill();
    C.circ(bx - 7, by - 1.6, 2.6, '#8a8296'); C.circ(bx - 7.6, by - 2.2, .7, '#ffffff');
    x.fillStyle = '#f3b46e'; x.beginPath(); x.moveTo(bx - 9.5, by - 1.8); x.lineTo(bx - 12.5, by - 1.2); x.lineTo(bx - 9.5, by - .6); x.fill();
    x.fillStyle = '#d9d0dc'; x.beginPath(); x.moveTo(bx - 1, by); x.lineTo(bx + 3, by - 9 * fl); x.lineTo(bx + 5, by); x.fill();
  });
}

// ---------- balloons ----------
function envelopePath(R) {
  x.beginPath(); x.moveTo(-R * .32, 0);
  x.bezierCurveTo(-R * .6, -R * .35, -R * 1.02, -R * .75, -R, -R * 1.25);
  x.arc(0, -R * 1.25, R, Math.PI, 0);
  x.bezierCurveTo(R * 1.02, -R * .75, R * .6, -R * .35, R * .32, 0); x.closePath();
}
function balloon(cx, cy, s, cols, who, t, o) {
  const R = 52, sway = ph(t, 8, o) * .05;
  place(cx, cy, s, false, sway);
  // envelope with vertical gores
  x.save(); envelopePath(R); x.clip();
  const N = 8;
  for (let i = 0; i < N; i++) {
    const a0 = -Math.PI / 2 + i * Math.PI / N, a1 = a0 + Math.PI / N;
    x.fillStyle = cols[i % cols.length]; x.fillRect(Math.sin(a0) * (R + 1), -R * 2.4, (Math.sin(a1) - Math.sin(a0)) * (R + 1) + .6, R * 2.6);
  }
  // soft round shading + highlight
  const g = x.createRadialGradient(-R * .35, -R * 1.55, R * .1, 0, -R * 1.1, R * 1.5);
  g.addColorStop(0, 'rgba(255,255,255,.45)'); g.addColorStop(.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(90,60,120,.18)');
  x.fillStyle = g; x.fillRect(-R - 2, -R * 2.4, R * 2 + 4, R * 2.6);
  // scalloped band
  x.fillStyle = 'rgba(255,255,255,.85)'; x.fillRect(-R, -R * .62, R * 2, 5);
  x.restore();
  envelopePath(R); edge(1.4);
  // a little smiling face on the balloon itself
  eye(-12, -R * 1.2, 3.4, t, o + 1, 8); eye(12, -R * 1.2, 3.4, t, o + 1.05, 8); cheek(-20, -R * 1.05, 5); cheek(20, -R * 1.05, 5); smile(0, -R * 1.12, 8, INKE, 2);
  // skirt + gentle burner glow (soft, slow)
  x.fillStyle = '#e8c7a4'; x.beginPath(); x.moveTo(-R * .32, 0); x.lineTo(R * .32, 0); x.lineTo(R * .22, 8); x.lineTo(-R * .22, 8); x.closePath(); x.fill();
  const fl = clamp(ph(t, 12, o) * 1.6 - .6, 0, 1);
  if (fl > 0) glow(0, 12, 16, 'rgba(255,190,120,A)', .6 * fl);
  // ropes
  x.strokeStyle = '#a58a76'; x.lineWidth = 1.2;
  [[-R * .22, -15], [R * .22, 15], [-R * .08, -6], [R * .08, 6]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a, 8); x.lineTo(b, 30); x.stroke(); });
  // passenger (behind the basket front)
  x.save(); x.translate(0, 30); who(t, o); x.restore();
  // basket
  x.fillStyle = '#d9a877'; x.beginPath(); x.roundRect(-19, 30, 38, 24, 5); x.fill();
  x.fillStyle = '#c38f5f'; x.beginPath(); x.roundRect(-21, 28, 42, 6, 3); x.fill();
  x.strokeStyle = 'rgba(140,95,60,.5)'; x.lineWidth = 1; for (let i = -12; i <= 12; i += 8) { x.beginPath(); x.moveTo(i, 35); x.lineTo(i, 52); x.stroke(); }
  x.beginPath(); x.moveTo(-18, 43); x.lineTo(18, 43); x.stroke();
  x.restore();
}
// a waving paw on the rim (wave 2x per minute, a few swings each)
function wave(t, o, col, side = 1) {
  const k = frac(t / P * 8 + o * .13), on = k < .12 ? Math.sin(k / .12 * Math.PI) : 0;
  const a = -1.2 * on + ph(t, 120, o) * .35 * on;
  x.save(); x.translate(side * 13, -2); x.rotate(side * (a - .2));
  x.fillStyle = col; x.beginPath(); x.ellipse(0, -6 * on, 4.5, 9 + 4 * on, 0, 0, 7); x.fill(); edge(1);
  x.restore();
}
function bunny(t, o) {
  const fur = '#fbf3f6', tilt = ph(t, 6, o) * .1;
  wave(t, o, fur, 1);
  x.save(); x.translate(-2, -3); x.rotate(tilt);
  [[-8, -.45], [8, .5]].forEach(([d, r]) => { x.save(); x.translate(d, -12); x.rotate(r + ph(t, 16, o + d) * .06); x.fillStyle = fur; x.beginPath(); x.ellipse(0, -8, 4.6, 11, 0, 0, 7); x.fill(); edge(1); x.fillStyle = '#f7c3d3'; x.beginPath(); x.ellipse(0, -8, 2.2, 8, 0, 0, 7); x.fill(); x.restore(); });
  C.circ(0, 0, 15, fur); x.beginPath(); x.arc(0, 0, 15, 0, 7); edge(1.1);
  eye(-6, -2, 2.6, t, o, 6); eye(6, -2, 2.6, t, o + .1, 6); C.circ(0, 4, 2, '#ef9db4'); smile(0, 5, 3, INKE, 1.3); cheek(-9, 5, 3); cheek(9, 5, 3);
  x.restore();
}
function bearCub(t, o) {
  const fur = '#d9b28c', lt = '#f1dcc4', tilt = ph(t, 6, o) * .1;
  wave(t, o, fur, -1);
  x.save(); x.translate(1, -6); x.rotate(tilt);
  C.circ(-11, -11, 6, fur); C.circ(-11, -11, 3.2, lt); C.circ(11, -11, 6, fur); C.circ(11, -11, 3.2, lt);
  C.circ(0, 0, 15, fur); x.beginPath(); x.arc(0, 0, 15, 0, 7); edge(1.1);
  x.fillStyle = lt; x.beginPath(); x.ellipse(0, 5, 7.5, 6, 0, 0, 7); x.fill();
  C.circ(0, 2.5, 2.4, INKE); smile(0, 5, 3, INKE, 1.3);
  eye(-6, -3, 2.6, t, o, 6); eye(6, -3, 2.6, t, o + .1, 6); cheek(-10, 4, 3); cheek(10, 4, 3);
  x.restore();
}
function piglet(t, o) {
  const sk = '#f8c6d3', dk = '#ee9fb6', tilt = ph(t, 6, o) * .1;
  wave(t, o, sk, 1);
  x.save(); x.translate(-1, -6); x.rotate(tilt);
  [[-9, -.4], [9, .4]].forEach(([d, r]) => { x.save(); x.translate(d, -11); x.rotate(r); x.fillStyle = dk; x.beginPath(); x.moveTo(-5, 2); x.lineTo(0, -8); x.lineTo(5, 2); x.fill(); x.restore(); });
  C.circ(0, 0, 15, sk); x.beginPath(); x.arc(0, 0, 15, 0, 7); edge(1.1);
  x.fillStyle = dk; x.beginPath(); x.ellipse(0, 4, 6, 4.4, 0, 0, 7); x.fill();
  C.circ(-2, 4, 1.2, '#c9708c'); C.circ(2, 4, 1.2, '#c9708c');
  eye(-6, -3, 2.5, t, o, 6); eye(6, -3, 2.5, t, o + .1, 6); smile(0, 8, 3, INKE, 1.2); cheek(-10, 4, 2.6); cheek(10, 4, 2.6);
  x.restore();
}
function kitten(t, o) {
  const fur = '#c9c4d9', lt = '#f3f0f8', tilt = ph(t, 6, o) * .1;
  wave(t, o, fur, -1);
  x.save(); x.translate(1, -6); x.rotate(tilt);
  [[-1], [1]].forEach(([d]) => { x.fillStyle = fur; x.beginPath(); x.moveTo(d * 4, -12); x.lineTo(d * 12, -20); x.lineTo(d * 14, -6); x.fill(); x.fillStyle = '#f2c9d8'; x.beginPath(); x.moveTo(d * 6, -11); x.lineTo(d * 11.5, -16); x.lineTo(d * 12.5, -8); x.fill(); });
  C.circ(0, 0, 15, fur); x.beginPath(); x.arc(0, 0, 15, 0, 7); edge(1.1);
  x.fillStyle = lt; x.beginPath(); x.ellipse(0, 5, 8, 6, 0, 0, 7); x.fill();
  x.fillStyle = '#ef9db4'; x.beginPath(); x.moveTo(-2, 2.5); x.lineTo(2, 2.5); x.lineTo(0, 4.5); x.fill();
  smile(-1.6, 5, 1.8, INKE, 1.1); smile(1.6, 5, 1.8, INKE, 1.1);
  x.strokeStyle = 'rgba(80,70,100,.5)'; x.lineWidth = .8; [-1, 1].forEach(d => { [-1, 1].forEach(e => { x.beginPath(); x.moveTo(d * 6, 5); x.lineTo(d * 15, 4 + e * 2.5); x.stroke(); }); });
  eye(-6, -3, 2.6, t, o, 6); eye(6, -3, 2.6, t, o + .1, 6); cheek(-10, 4, 2.6); cheek(10, 4, 2.6);
  x.restore();
}
const BALLOONS = [
  // [crossing speed m, offset, dir, y, scale, colours, passenger, phase] – the right-to-left pair flies higher and smaller (further away)
  [1, .02, 1, 172, 1.2, ['#ffb3c1', '#fff3c4'], bunny, 0],
  [1, .52, 1, 200, 1.12, ['#a8d8f0', '#ffffff', '#c6b8f0'], bearCub, 1.7],
  [1, .30, -1, 104, .86, ['#ffd59e', '#b8e6c4'], piglet, 3.1],
  [1, .80, -1, 122, .9, ['#d6c3f5', '#ffc9e0'], kitten, 4.4],
];
function farBalloons(t) {
  // two tiny balloons far away for depth
  [[cross(t, 1, .65, 30, 1), 240, '#f7c8b0', .35], [cross(t, 1, .15, 30, -1), 228, '#bfe0d0', .3]].forEach(([bx, by, c, s], i) => {
    const yy = by + ph(t, 4, i * 2) * 6;
    x.fillStyle = c; x.beginPath(); x.arc(bx, yy - 40 * s, 30 * s, Math.PI, 0); x.quadraticCurveTo(bx + 30 * s, yy - 18 * s, bx + 8 * s, yy); x.lineTo(bx - 8 * s, yy); x.quadraticCurveTo(bx - 30 * s, yy - 18 * s, bx - 30 * s, yy - 40 * s); x.fill();
    x.fillStyle = '#c99e78'; x.fillRect(bx - 5 * s, yy + 6 * s, 10 * s, 8 * s);
  });
}
function balloons(t) {
  [...BALLOONS].sort((a, b) => a[4] - b[4]).forEach(([m, off, dir, by, s, cols, who, o]) => {
    const bx = cross(t, m, off, 90, dir), yy = by + ph(t, 6, o) * 12 + ph(t, 2, o) * 10 + (+process.env.THUMBLOW || 0) * s;   // THUMBLOW: thumbnail still only, keeps the balloons below the title
    balloon(bx, yy, s, cols, who, t, o);
  });
}

// ---------- landscape ----------
const farY = i => 300 - Math.sin(i * .009 + 1.3) * 16 - Math.sin(i * .023) * 6;
const midY = i => 335 - Math.sin(i * .007 + 4) * 18 - Math.sin(i * .019 + 1) * 7;
const nearY = i => 398 - Math.sin(i * .006 + 2.2) * 10 - Math.sin(i * .017) * 4;
function hills() {
  x.fillStyle = '#d8cdef'; x.beginPath(); x.moveTo(0, H); for (let i = 0; i <= W; i += 10) x.lineTo(i, farY(i)); x.lineTo(W, H); x.fill();
  x.fillStyle = '#bfe3c8'; x.beginPath(); x.moveTo(0, H); for (let i = 0; i <= W; i += 10) x.lineTo(i, midY(i)); x.lineTo(W, H); x.fill();
  // soft patchwork fields on the middle hill
  x.save(); x.beginPath(); x.moveTo(0, H); for (let i = 0; i <= W; i += 10) x.lineTo(i, midY(i)); x.lineTo(W, H); x.clip();
  [[160, 352, 120, 10, '#d2ebc4'], [440, 346, 90, 8, '#f3e7b8'], [600, 360, 140, 9, '#cde8d6'], [330, 372, 80, 7, '#e8dcc0']].forEach(([a, b, c, d, col]) => { x.fillStyle = col; x.beginPath(); x.ellipse(a, b, c, d, 0, 0, 7); x.fill(); });
  x.restore();
}
function roundTree(tx, ty, s, col) {
  x.fillStyle = '#b89b84'; x.fillRect(tx - 2.5 * s, ty - 14 * s, 5 * s, 14 * s);
  C.circ(tx, ty - 22 * s, 13 * s, col); C.circ(tx - 8 * s, ty - 16 * s, 8 * s, col); C.circ(tx + 8 * s, ty - 17 * s, 9 * s, col);
  C.circ(tx - 4 * s, ty - 27 * s, 5 * s, 'rgba(255,255,255,.25)');
}
function windmill(t) {
  const mx = 742, my = midY(742);
  x.fillStyle = '#f6efe6'; x.beginPath(); x.moveTo(mx - 18, my + 4); x.lineTo(mx - 11, my - 62); x.lineTo(mx + 11, my - 62); x.lineTo(mx + 18, my + 4); x.closePath(); x.fill(); edge(1.2);
  x.fillStyle = '#e7a9a0'; x.beginPath(); x.moveTo(mx - 15, my - 60); x.quadraticCurveTo(mx, my - 82, mx + 15, my - 60); x.closePath(); x.fill();
  x.fillStyle = '#b9a2c9'; x.beginPath(); x.roundRect(mx - 5, my - 14, 10, 18, [5, 5, 0, 0]); x.fill();
  C.circ(mx, my - 40, 4.5, '#b9e0f0');
  x.save(); x.translate(mx, my - 64); x.rotate(TAU * 6 * t / P);
  for (let i = 0; i < 4; i++) {
    x.rotate(Math.PI / 2);
    x.fillStyle = '#c6a98f'; x.fillRect(-1.5, 0, 3, 50);
    x.fillStyle = 'rgba(255,255,255,.92)'; x.fillRect(1.5, 12, 10, 36); x.strokeStyle = 'rgba(160,130,110,.6)'; x.lineWidth = .8;
    for (let k = 18; k < 48; k += 7) { x.beginPath(); x.moveTo(1.5, k); x.lineTo(11.5, k); x.stroke(); }
  }
  x.restore();
  C.circ(mx, my - 64, 3.5, '#a58a76');
}
function meadow(t) {
  const g = x.createLinearGradient(0, 380, 0, H); g.addColorStop(0, '#cdeec0'); g.addColorStop(1, '#a9dcae');
  x.fillStyle = g; x.beginPath(); x.moveTo(0, H); for (let i = 0; i <= W; i += 8) x.lineTo(i, nearY(i)); x.lineTo(W, H); x.fill();
  // grass tufts
  x.strokeStyle = 'rgba(120,180,120,.55)'; x.lineWidth = 1.4; x.lineCap = 'round';
  for (let i = 0; i < 40; i++) { const gx = hash(i + 700) * W, gy = 415 + hash(i + 740) * 120, sw = ph(t, 12, i) * 2;
    x.beginPath(); x.moveTo(gx - 3, gy); x.lineTo(gx - 5 + sw, gy - 8); x.moveTo(gx, gy); x.lineTo(gx + sw, gy - 10); x.moveTo(gx + 3, gy); x.lineTo(gx + 5 + sw, gy - 7); x.stroke(); }
}
function fence() {
  x.fillStyle = '#e9d7c2'; x.strokeStyle = 'rgba(150,120,100,.45)'; x.lineWidth = 1;
  for (let i = 0; i < 6; i++) { const fx = 30 + i * 34, fy = 430 + i * 3; x.beginPath(); x.roundRect(fx - 3, fy - 34, 6, 36, 2); x.fill(); x.stroke(); }
  x.fillRect(24, 406, 180, 5); x.fillRect(24, 420, 180, 5);
}
function pond(t) {
  const px = 610, py = 432;
  x.fillStyle = '#bfe0ea'; x.beginPath(); x.ellipse(px, py, 120, 26, 0, 0, 7); x.fill();
  x.strokeStyle = 'rgba(150,200,170,.9)'; x.lineWidth = 4; x.beginPath(); x.ellipse(px, py, 121, 27, 0, 0, 7); x.stroke();
  for (let i = 0; i < 9; i++) { x.globalAlpha = .4 + .4 * (ph(t, 10 + i, i) * .5 + .5); x.fillStyle = '#ffffff'; x.fillRect(px - 90 + hash(i + 30) * 170 + ph(t, 4, i) * 6, py - 14 + hash(i + 60) * 26, 10 + hash(i) * 14, 1.4); }
  x.globalAlpha = 1;
  // lily pads + a pink water lily
  [[px - 80, py + 6, 11], [px + 74, py - 8, 9], [px + 92, py + 8, 7]].forEach(([a, b, r]) => { x.fillStyle = '#9fd3a5'; x.beginPath(); x.ellipse(a, b, r, r * .4, 0, .3, TAU); x.lineTo(a, b); x.fill(); });
  for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; x.fillStyle = '#ffc9da'; x.beginPath(); x.ellipse(px - 80 + Math.cos(a) * 3, py + 3 + Math.sin(a) * 1.2, 4, 2, a, 0, 7); x.fill(); }
  C.circ(px - 80, py + 3, 1.8, '#ffe39a');
  // reeds
  [[px + 112, py - 4], [px + 120, py + 2], [px - 116, py]].forEach(([a, b], i) => {
    const sw = ph(t, 10, i) * 2; x.strokeStyle = '#8fc79a'; x.lineWidth = 2; x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo(a + sw, b - 18, a + sw * 1.6, b - 34); x.stroke();
    x.fillStyle = '#c8a07f'; x.beginPath(); x.ellipse(a + sw * 1.6, b - 34, 2.4, 6, sw * .05, 0, 7); x.fill();
  });
}
function duck(cx, cy, s, flip, t, o, baby) {
  place(cx, cy, s, flip);
  const bob = ph(t, 30, o) * 1.2;
  x.translate(0, bob);
  const col = baby ? '#ffe9a0' : '#fffaf2';
  x.fillStyle = col; x.beginPath(); x.moveTo(-16, -2); x.quadraticCurveTo(-18, -14, -4, -12); x.quadraticCurveTo(10, -12, 14, -4); x.quadraticCurveTo(8, 2, -12, 1); x.closePath(); x.fill(); edge(1);
  x.fillStyle = baby ? '#ffd970' : '#eee6da'; x.beginPath(); x.ellipse(-2, -6, 7, 3.5, -.2, 0, 7); x.fill();
  C.circ(10, -16, 6.5, col); x.beginPath(); x.arc(10, -16, 6.5, 0, 7); edge(1);
  x.fillStyle = '#f6b26b'; x.beginPath(); x.ellipse(17, -14.5, 4.5, 2, 0, 0, 7); x.fill();
  eye(11, -17.5, 1.6, t, o, 5); cheek(12, -13.5, 1.8);
  x.restore();
}
function ducks(t) {
  // mama + duckling paddle slowly round the pond (2 laps per loop)
  const a = TAU * 2 * t / P, dir = Math.cos(a) < 0;
  const mx = 610 + Math.sin(a) * 78, my = 432 + Math.cos(a) * 12 - 2;
  const b = a - .5, bx = 610 + Math.sin(b) * 78, by = 432 + Math.cos(b) * 12 - 2;
  // ripples behind each
  [[mx, my], [bx, by]].forEach(([u, v], i) => { x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 1; x.beginPath(); x.ellipse(u, v + 1, 18 - i * 6, 3, 0, 0, 7); x.stroke(); });
  const items = [[my, () => duck(mx, my, 1, dir, t, 0, false)], [by, () => duck(bx, by, .6, Math.cos(b) < 0, t, 1, true)]];
  items.sort((p, q) => p[0] - q[0]).forEach(([, f]) => f());
}
function sheep(cx, cy, s, t, o) {
  // grazing: head goes down to the grass and comes up to look around, chewing
  place(cx, cy, s, false);
  const up = clamp(ph(t, 4, o) * 1.6 + .2, 0, 1), chew = ph(t, 180, o);
  x.fillStyle = 'rgba(110,160,110,.3)'; x.beginPath(); x.ellipse(0, 2, 46, 6, 0, 0, 7); x.fill();
  x.fillStyle = '#7f7590'; [[-26, 0], [-14, 2], [14, 2], [26, 0]].forEach(([a, b]) => { x.beginPath(); x.roundRect(a - 3.5, -18, 7, 20 + b, 3); x.fill(); });
  // woolly body
  x.fillStyle = '#fffdf8';
  [[-30, -30, 14], [-16, -38, 16], [2, -40, 16], [20, -36, 15], [32, -28, 12], [-22, -20, 14], [0, -20, 16], [22, -20, 14]].forEach(([a, b, r]) => { x.beginPath(); x.arc(a, b, r, 0, 7); x.fill(); });
  x.fillStyle = 'rgba(200,190,215,.4)'; x.beginPath(); x.ellipse(0, -12, 34, 6, 0, 0, Math.PI); x.fill();
  // head
  x.save(); x.translate(38, -30 + (1 - up) * 16); x.rotate(lerp(.45, -.05, up));
  x.fillStyle = '#7f7590'; x.beginPath(); x.ellipse(-10, -4, 9, 4, -.5 - ph(t, 12, o) * .15, 0, 7); x.fill();
  x.beginPath(); x.ellipse(10, 0, 13, 15, 0, 0, 7); x.fill();
  C.circ(6, -12, 8, '#fffdf8'); C.circ(13, -13, 6, '#fffdf8');
  if (up > .4) { eye(6, -2, 2.6, t, o, 6); eye(15, -2, 2.4, t, o + .1, 6); } else { sleepEye(6, -1, 2.5); sleepEye(15, -1, 2.3); }
  C.circ(14, 9, 1.4, INKE); smile(14 + chew * .6, 10, 2.5, '#fffdf8', 1.2); cheek(4, 6, 2.6);
  x.restore();
  x.restore();
}
function lamb(cx, cy, s, t, o) {
  // little lamb: hops a few times every 30 s, tail wiggles
  const k = frac(t / P * 8 + o), hop = k < .1 ? Math.abs(Math.sin(k / .1 * Math.PI * 3)) * 14 : 0;
  place(cx, cy - hop, s, true);
  x.fillStyle = 'rgba(110,160,110,.3)'; x.beginPath(); x.ellipse(0, 2 + hop / s, 26 - hop, 4, 0, 0, 7); x.fill();
  x.fillStyle = '#8a809a'; [[-14], [-6], [8], [15]].forEach(([a]) => { x.beginPath(); x.roundRect(a - 2.5, -12, 5, 14, 2); x.fill(); });
  x.save(); x.translate(-22, -24); x.rotate(ph(t, 60, o) * .4); C.circ(0, 0, 5, '#fffdf8'); x.restore();
  x.fillStyle = '#fffdf8'; [[-14, -22, 10], [-2, -26, 11], [10, -22, 10], [0, -16, 11]].forEach(([a, b, r]) => { x.beginPath(); x.arc(a, b, r, 0, 7); x.fill(); });
  x.save(); x.translate(20, -30); x.rotate(ph(t, 8, o) * .12);
  x.fillStyle = '#8a809a'; x.beginPath(); x.ellipse(-8, -2, 7, 3, -.6, 0, 7); x.fill();
  x.beginPath(); x.ellipse(4, 2, 9, 10, 0, 0, 7); x.fill(); C.circ(2, -6, 6, '#fffdf8');
  eye(2, 1, 2.2, t, o, 5); eye(9, 1, 2, t, o + .1, 5); cheek(1, 6, 2.2); smile(8, 7, 2, '#fffdf8', 1.1);
  x.restore();
  x.restore();
}
function hedgehog(t) {
  // trundles through the flowers left to right twice per loop, pausing to sniff
  const k = frac(t / P * 2 + .35), bx = -60 + k * (W + 120), step = ph(t, 160) * 1.2;
  place(bx, 516, .9, false);
  x.fillStyle = 'rgba(100,150,100,.35)'; x.beginPath(); x.ellipse(0, 2, 30, 4, 0, 0, 7); x.fill();
  x.fillStyle = '#b39a8e';
  for (let i = 0; i < 11; i++) { const a = Math.PI + .15 + i * (Math.PI - .3) / 10; x.beginPath(); x.moveTo(Math.cos(a - .14) * 22, -10 + Math.sin(a - .14) * 16); x.lineTo(Math.cos(a) * 34, -10 + Math.sin(a) * 27); x.lineTo(Math.cos(a + .14) * 22, -10 + Math.sin(a + .14) * 16); x.fill(); }
  x.fillStyle = '#c8b2a5'; x.beginPath(); x.ellipse(-2, -12, 26, 16, 0, 0, 7); x.fill();
  x.fillStyle = '#f2e3d3'; x.beginPath(); x.moveTo(14, -20); x.quadraticCurveTo(36, -14, 38, -6); x.quadraticCurveTo(26, 0, 12, -2); x.closePath(); x.fill(); edge(1);
  C.circ(38, -7, 3, INKE); eye(22, -12, 2.4, t, 3, 6); cheek(24, -6, 2.6);
  x.fillStyle = '#a58a7e'; [[-12, step], [6, -step]].forEach(([a, d]) => { x.beginPath(); x.ellipse(a + d, 0, 5, 3, 0, 0, 7); x.fill(); });
  x.restore();
}
function flower(fx, fy, s, col, t, i) {
  const sw = ph(t, 12, i) * 3;
  x.strokeStyle = '#8cc794'; x.lineWidth = 2 * s; x.lineCap = 'round'; x.beginPath(); x.moveTo(fx, fy); x.quadraticCurveTo(fx + sw * .3, fy - 10 * s, fx + sw, fy - 20 * s); x.stroke();
  x.fillStyle = '#9fd3a5'; x.beginPath(); x.ellipse(fx + 4 * s, fy - 8 * s, 5 * s, 2 * s, -.5, 0, 7); x.fill();
  for (let p = 0; p < 5; p++) { const a = p / 5 * TAU + ph(t, 4, i) * .2; C.circ(fx + sw + Math.cos(a) * 4.5 * s, fy - 20 * s + Math.sin(a) * 4.5 * s, 3.6 * s, col); }
  C.circ(fx + sw, fy - 20 * s, 2.6 * s, '#ffe08a');
}
const FL = ['#ffc1d6', '#fff0a8', '#d9c7ff', '#ffd1b0', '#ffffff'];
function flowers(t, front) {
  const n = front ? 16 : 22;
  for (let i = 0; i < n; i++) {
    const id = i + (front ? 100 : 0), fx = hash(id + 3) * W, fy = front ? 510 + hash(id + 9) * 30 : 420 + hash(id + 9) * 80;
    if (!front && fx > 470 && fx < 750 && fy < 470) continue;   // keep the pond clear
    flower(fx, fy, front ? 1.15 : .8, FL[id % FL.length], t, id);
  }
}
function butterflies(t) {
  [['#ffc1d6', 0], ['#cfe6ff', 2.1], ['#fff0a8', 4.2]].forEach(([c, o], i) => {
    const a = TAU * (i % 2 ? -1 : 1) * 3 * t / P + o;
    const bx = 480 + Math.cos(a) * (300 + i * 60) + ph(t, 7, o) * 40, by = 440 + Math.sin(a * 2) * 30 + ph(t, 11, o) * 14;
    const fl = Math.abs(ph(t, 720, o)) * .8 + .2, flip = Math.sin(a) * (i % 2 ? -1 : 1) > 0;
    place(bx, by, .9, flip);
    x.fillStyle = c; x.beginPath(); x.ellipse(-5, -5, 7 * fl, 6, -.4, 0, 7); x.fill(); x.beginPath(); x.ellipse(-4, 3, 5 * fl, 4, .4, 0, 7); x.fill();
    x.beginPath(); x.ellipse(5, -5, 7 * fl, 6, .4, 0, 7); x.fill(); x.beginPath(); x.ellipse(4, 3, 5 * fl, 4, -.4, 0, 7); x.fill();
    x.fillStyle = '#7d6d8c'; x.beginPath(); x.ellipse(0, 0, 1.6, 7, 0, 0, 7); x.fill();
    x.strokeStyle = '#7d6d8c'; x.lineWidth = .8; x.beginPath(); x.moveTo(0, -6); x.lineTo(-3, -11); x.moveTo(0, -6); x.lineTo(3, -11); x.stroke();
    x.restore();
  });
}
function petals(t) {
  // a few light dandelion seeds floating on the breeze
  for (let i = 0; i < 10; i++) {
    const k = frac(hash(i + 50) + t / P * (3 + i % 3)), px = -20 + k * (W + 40), py = 260 + hash(i + 80) * 200 + Math.sin(k * TAU * 2 + i) * 20;
    x.globalAlpha = Math.min(1, k * 8, (1 - k) * 8) * .85;
    x.strokeStyle = '#ffffff'; x.lineWidth = .8;
    for (let a = 0; a < 6; a++) { const an = a / 6 * TAU; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(an) * 4, py + Math.sin(an) * 4); x.stroke(); }
    C.circ(px, py, 1, '#f3ead8');
  }
  x.globalAlpha = 1;
}

function draw(t0) {
  const lt = t0, t = (t0 + T0) % P;
  sky(t);
  sun(t);
  clouds(t);
  geese(t);
  hills();
  farBalloons(t);
  roundTree(90, midY(90) + 6, 1.1, '#9fd6b0'); roundTree(118, midY(118) + 8, .8, '#b6e2a8'); roundTree(380, midY(380) + 6, .9, '#a8dcc0');
  roundTree(880, midY(880) + 6, 1.0, '#b6e2a8'); roundTree(910, midY(910) + 8, .7, '#9fd6b0');
  windmill(t);
  meadow(t);
  fence();
  pond(t);
  ducks(t);
  flowers(t, false);
  sheep(190, 468, 1, t, 0);
  lamb(300, 482, .9, t, 1.3);
  balloons(t);
  butterflies(t);
  hedgehog(t);
  flowers(t, true);
  petals(t);
  const v = x.createRadialGradient(480, 280, 260, 480, 280, 640); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(90,70,120,.18)'); x.fillStyle = v; x.fillRect(0, 0, W, H);
  const fin = process.env.FADE || process.env.FADEIN, fout = process.env.FADE || process.env.FADEOUT;
  const f = Math.max(fin ? clamp(1 - lt / 3) : 0, fout ? clamp((lt - (DUR - 6)) / 6) : 0);
  if (f > 0) { x.fillStyle = `rgba(0,0,0,${f})`; x.fillRect(0, 0, W, H); }
}
if (require.main === module) C.run(draw, DUR, {});
