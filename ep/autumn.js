// Calm autumn forest (sensory). Everything is periodic with P seconds (seamless loop).
// Fox, hedgehog, squirrel, owl, deer + fawn, rabbit, mouse, geese, snail, falling leaves.
const C = require('../lib/common');
const { x, W, H, clamp, lerp, hash } = C;
const P = 240, TAU = Math.PI * 2;
const DUR = +(process.env.DUR || P);
const T0 = +(process.env.T0 || 0);
const ph = (t, m = 1, o = 0) => Math.sin(TAU * m * t / P + o);
const frac = v => v - Math.floor(v);
const cross = (t, m, off, pad, dir = 1) => { const k = frac(t / P * m + off); return dir > 0 ? -pad + k * (W + 2 * pad) : W + pad - k * (W + 2 * pad); };
const INKE = '#4a3a4f';
const SX = 560, SY = 105;

function glow(cx, cy, r, col, a) {
  const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0));
  x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
}
function eye(cx, cy, r, t, o = 0, every = 6) {
  const blink = ((t + o * 1.7) % every) < .16;
  if (blink) { x.strokeStyle = INKE; x.lineWidth = r * .45; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r * .8, .2, Math.PI - .2); x.stroke(); return; }
  C.circ(cx, cy, r, INKE); C.circ(cx + r * .35, cy - r * .35, r * .38, '#ffffff');
}
const smile = (cx, cy, r, col = INKE, w = 2) => { x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r, .3, Math.PI - .3); x.stroke(); };
const cheek = (cx, cy, r) => C.circ(cx, cy, r, 'rgba(255,150,170,.45)');
function place(px, py, s, flip, rot = 0) { x.save(); x.translate(px, py); x.rotate(rot); x.scale(flip ? -s : s, s); }

// ---------- scenery ----------
function sky(t) {
  const g = x.createLinearGradient(0, 0, 0, 330);
  g.addColorStop(0, '#c9c3e6'); g.addColorStop(.45, '#f3cdd0'); g.addColorStop(1, '#fde3c4');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  glow(SX, SY, 230, 'rgba(255,236,190,A)', .75);
  glow(SX, SY, 70, 'rgba(255,248,225,A)', .9);
  C.circ(SX, SY, 40, '#fff3d6');
  // soft rays
  x.save(); x.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU + TAU * t / P, al = .025 + .02 * (ph(t, 4 + i % 3, i) * .5 + .5);
    const g = x.createRadialGradient(SX, SY, 40, SX, SY, 380); g.addColorStop(0, `rgba(255,240,210,${al * 1.1})`); g.addColorStop(1, 'rgba(255,240,210,0)');
    x.fillStyle = g; x.beginPath(); x.moveTo(SX, SY);
    x.arc(SX, SY, 380, a, a + .07); x.closePath(); x.fill();
  }
  x.restore();
}
function cloud(cx, cy, s, a = .8) {
  x.save(); x.globalAlpha = a; x.fillStyle = '#fff6ee';
  [[0, 0, 34], [30, -12, 28], [58, 0, 30], [28, 8, 30], [-26, 6, 22], [84, 8, 20]].forEach(([dx, dy, r]) => C.circ(cx + dx * s, cy + dy * s, r * s, '#fff6ee'));
  x.restore();
}
function geese(t) {
  const bx = cross(t, 1, .55, 140, -1), by = 70 + ph(t, 2, 1) * 8;
  for (let i = 0; i < 7; i++) {
    const row = Math.ceil(i / 2), side = i % 2 ? 1 : -1, gx = bx + row * 22, gy = by + side * row * 11 * (i ? 1 : 0);
    const fl = ph(t, 160, i * .7) * 5;
    x.strokeStyle = 'rgba(110,95,130,.75)'; x.lineWidth = 2; x.lineCap = 'round'; x.beginPath();
    x.moveTo(gx - 8, gy - fl); x.quadraticCurveTo(gx - 3, gy - 2, gx, gy); x.quadraticCurveTo(gx + 3, gy - 2, gx + 8, gy - fl); x.stroke();
  }
}
function hills() {
  x.fillStyle = '#e7c3c9'; x.beginPath(); x.moveTo(0, H);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 268 - Math.sin(i * .007 + 1) * 26 - Math.sin(i * .021) * 8); x.lineTo(W, H); x.fill();
  // tiny far trees on the hill
  for (let i = 0; i < 34; i++) {
    const tx = i * 29 + hash(i + 40) * 14, ty = 270 - Math.sin(tx * .007 + 1) * 26 - Math.sin(tx * .021) * 8 + 4;
    const cols = ['#e9b38f', '#efc78d', '#d9a3b4', '#e8a58f'];
    const r = 7 + hash(i) * 3; x.fillStyle = '#c9a3a0'; x.fillRect(tx - 1, ty - 8, 2, 8);
    x.fillStyle = cols[i % 4]; C.circ(tx, ty - 12 - r * .4, r, cols[i % 4]); C.circ(tx - r * .6, ty - 9, r * .7, cols[i % 4]); C.circ(tx + r * .6, ty - 9, r * .7, cols[i % 4]);
  }
  x.fillStyle = '#e2b39f'; x.beginPath(); x.moveTo(0, H);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 312 - Math.sin(i * .009 + 3) * 18 - Math.sin(i * .027 + 1) * 6); x.lineTo(W, H); x.fill();
}
function roundTree(tx, ty, s, crown, t, o) {
  x.save(); x.translate(tx, ty); x.scale(s, s);
  x.fillStyle = '#9b7a74'; x.beginPath(); x.moveTo(-9, 0); x.lineTo(-6, -70); x.lineTo(6, -70); x.lineTo(9, 0); x.fill();
  const sw = ph(t, 6, o) * 2;
  x.fillStyle = crown;
  [[0, -110, 50], [-34, -88, 34], [34, -90, 36], [-16, -138, 34], [20, -136, 32]].forEach(([dx, dy, r]) => { x.beginPath(); x.arc(dx + sw, dy, r, 0, 7); x.fill(); });
  x.fillStyle = 'rgba(255,255,255,.18)'; x.beginPath(); x.arc(-14 + sw, -126, 18, 0, 7); x.fill();
  x.restore();
}
function pineTree(tx, ty, s, col) {
  x.save(); x.translate(tx, ty); x.scale(s, s);
  x.fillStyle = '#9b7a74'; x.fillRect(-5, -20, 10, 20);
  x.fillStyle = col; for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(-40 + i * 8, -16 - i * 34); x.lineTo(0, -70 - i * 36); x.lineTo(40 - i * 8, -16 - i * 34); x.closePath(); x.fill(); }
  x.restore();
}
function bigTree(t) {
  // big oak on the right with the owl hollow and the squirrel branch
  x.fillStyle = '#a8857c';
  x.beginPath(); x.moveTo(800, 470); x.bezierCurveTo(820, 400, 812, 260, 822, 130); x.lineTo(886, 130); x.bezierCurveTo(892, 260, 890, 400, 930, 470); x.closePath(); x.fill();
  x.strokeStyle = 'rgba(120,90,90,.35)'; x.lineWidth = 3; [[835, 420, 838, 300], [870, 440, 866, 330], [850, 260, 852, 190]].forEach(([a, b, c, d]) => { x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo(a + 6, (b + d) / 2, c, d); x.stroke(); });
  // branch to the left (squirrel)
  x.fillStyle = '#a8857c'; x.beginPath(); x.moveTo(826, 226); x.quadraticCurveTo(760, 214, 690, 226); x.lineTo(692, 236); x.quadraticCurveTo(760, 228, 826, 244); x.fill();
  // hollow
  x.fillStyle = '#6e5560'; x.beginPath(); x.ellipse(856, 320, 22, 30, 0, 0, 7); x.fill();
  x.fillStyle = '#8f6f72'; x.beginPath(); x.ellipse(856, 348, 24, 6, 0, 0, Math.PI); x.fill();
}
function bigCrown(t) {
  const sw = ph(t, 5) * 3;
  const blobs = [[850, 90, 90, '#f0b48f'], [760, 120, 60, '#f3c992'], [940, 120, 70, '#e8a69a'], [800, 40, 62, '#f3c992'], [905, 40, 64, '#f0b48f'], [700, 196, 30, '#efc08f'], [660, 210, 22, '#e8a69a']];
  blobs.forEach(([cx, cy, r, c], i) => { x.fillStyle = c; x.beginPath(); x.arc(cx + sw * (1 + i % 2), cy, r, 0, 7); x.fill(); });
  x.fillStyle = 'rgba(255,255,255,.16)'; x.beginPath(); x.arc(820 + sw, 60, 30, 0, 7); x.fill();
}
function ground() {
  const g = x.createLinearGradient(0, 380, 0, H); g.addColorStop(0, '#e9cfa4'); g.addColorStop(1, '#d9b49a');
  x.fillStyle = g; x.beginPath(); x.moveTo(0, H);
  for (let i = 0; i <= W; i += 8) x.lineTo(i, 400 - Math.sin(i * .006 + 2) * 10 - Math.sin(i * .019) * 4); x.lineTo(W, H); x.fill();
  // path
  x.fillStyle = 'rgba(250,236,214,.7)'; x.beginPath(); x.moveTo(0, 470);
  x.bezierCurveTo(250, 450, 520, 500, W, 462); x.lineTo(W, 490); x.bezierCurveTo(520, 528, 250, 482, 0, 500); x.fill();
  // fallen leaves on the ground
  for (let i = 0; i < 70; i++) leafShape(hash(i + 700) * W, 410 + hash(i + 740) * 125, 5 + hash(i + 3) * 3, hash(i + 9) * 6, LEAFC[i % LEAFC.length], .75);
}
const LEAFC = ['#f2a07b', '#f5c47a', '#e98f8f', '#f0b07a', '#d9a0c0', '#f6d28c'];
function leafShape(cx, cy, s, rot, col, a = 1) {
  x.save(); x.globalAlpha = a; x.translate(cx, cy); x.rotate(rot); x.fillStyle = col;
  x.beginPath(); x.moveTo(-s * 1.4, 0); x.quadraticCurveTo(0, -s * 1.1, s * 1.4, 0); x.quadraticCurveTo(0, s * 1.1, -s * 1.4, 0); x.fill();
  x.strokeStyle = 'rgba(255,255,255,.45)'; x.lineWidth = .8; x.beginPath(); x.moveTo(-s * 1.2, 0); x.lineTo(s * 1.2, 0); x.stroke();
  x.restore();
}
function mapleLeaf(cx, cy, s, rot, col) {
  x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(s, s); x.fillStyle = col; x.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i / 10) * TAU, r = i % 2 ? .45 : 1; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
  x.closePath(); x.fill(); x.restore();
}
function fallingLeaves(t, front) {
  const n = front ? 14 : 26;
  for (let i = 0; i < n; i++) {
    const id = i + (front ? 100 : 0), m = 3 + (id % 3);
    const k = frac(hash(id + 11) + t / P * m);
    const py = -20 + k * (front ? 580 : 440);
    const px = frac(hash(id + 31) + t / P * (id % 2 ? 1 : -1)) * (W + 60) - 30 + Math.sin(k * TAU * 2 + id) * 26;
    const rot = Math.sin(k * TAU * 3 + id) * 1.2, col = LEAFC[id % LEAFC.length];
    const a = Math.min(1, k * 8, (1 - k) * 8);
    x.save(); x.globalAlpha = a * (front ? 1 : .85);
    if (id % 3 === 0) mapleLeaf(px, py, front ? 9 : 6, rot, col); else leafShape(px, py, front ? 7 : 4.5, rot, col);
    x.restore();
  }
}
function mushroom(cx, cy, s, cap, t, o, face) {
  x.save(); x.translate(cx, cy); x.scale(s, s);
  x.fillStyle = '#fbefe0'; x.beginPath(); x.moveTo(-9, 0); x.quadraticCurveTo(-11, -18, -7, -26); x.lineTo(7, -26); x.quadraticCurveTo(11, -18, 9, 0); x.closePath(); x.fill();
  x.fillStyle = cap; x.beginPath(); x.ellipse(0, -26, 26, 20, 0, Math.PI, 0); x.quadraticCurveTo(0, -20, -26, -26); x.fill();
  [[-12, -34, 4], [4, -40, 3.5], [14, -30, 3], [-2, -30, 2.5]].forEach(([a, b, r]) => C.circ(a, b, r, 'rgba(255,255,255,.85)'));
  if (face) { eye(-4, -12, 2.2, t, o, 7); eye(4, -12, 2.2, t, o, 7); smile(0, -9, 2.5, INKE, 1.3); cheek(-7, -7, 2); cheek(7, -7, 2); }
  x.restore();
}
function leafPile(cx, cy, s) {
  for (let i = 0; i < 40; i++) {
    const a = hash(i + cx) * Math.PI, r = hash(i + cx + 5) * 1;
    leafShape(cx + Math.cos(a) * 46 * r * s, cy - Math.sin(a) * 22 * r * s, 7 * s, hash(i + 2) * 6, LEAFC[(i + 2) % LEAFC.length]);
  }
}
function bush(cx, cy, s, col) {
  x.fillStyle = col; [[0, 0, 30], [-26, 8, 22], [26, 8, 24], [-10, -16, 20], [14, -14, 20]].forEach(([dx, dy, r]) => { x.beginPath(); x.arc(cx + dx * s, cy + dy * s, r * s, 0, 7); x.fill(); });
  x.fillStyle = 'rgba(255,255,255,.15)'; x.beginPath(); x.arc(cx - 8 * s, cy - 14 * s, 9 * s, 0, 7); x.fill();
}
function acorn(cx, cy, s, rot = 0) {
  x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(s, s);
  x.fillStyle = '#e0b07e'; x.beginPath(); x.ellipse(0, 3, 6, 8, 0, 0, 7); x.fill();
  x.fillStyle = '#a07a62'; x.beginPath(); x.ellipse(0, -3, 7.5, 4.5, 0, 0, 7); x.fill(); x.fillRect(-1, -10, 2, 5);
  x.restore();
}

// ---------- animals (facing right; flip = facing left) ----------
function fox(px, py, s, t, o) {
  place(px, py, s, false);
  const tail = ph(t, 12, o) * .18, breathe = 1 + ph(t, 40, o) * .015;
  const body = '#f2a274', light = '#fff3e6', dark = '#c97d5a';
  // tail: big fluffy tail curled round in front of the feet, tip swishing
  x.save(); x.translate(-22, -8);
  x.lineCap = 'round'; x.strokeStyle = body; x.lineWidth = 26;
  const tx2 = 44 + tail * 40, ty2 = -2 - Math.abs(tail) * 20;
  x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(-40, 4, -40, 20, 0, 22); x.quadraticCurveTo(26, 22, tx2, ty2 + 14); x.stroke();
  x.fillStyle = light; x.beginPath(); x.ellipse(tx2 + 4, ty2 + 13, 14, 11, -.3, 0, 7); x.fill();
  x.restore();
  // body (sitting)
  x.save(); x.scale(1, breathe);
  x.fillStyle = body; x.beginPath(); x.moveTo(-36, 0); x.bezierCurveTo(-42, -40, -18, -76, 6, -78); x.bezierCurveTo(26, -76, 30, -40, 26, 0); x.closePath(); x.fill();
  x.fillStyle = light; x.beginPath(); x.ellipse(10, -40, 13, 30, .08, 0, 7); x.fill();
  x.restore();
  // paws
  x.fillStyle = dark; x.beginPath(); x.ellipse(2, -2, 9, 6, 0, 0, 7); x.fill(); x.beginPath(); x.ellipse(20, -2, 9, 6, 0, 0, 7); x.fill();
  x.fillStyle = body; x.beginPath(); x.ellipse(-26, -4, 18, 10, 0, 0, 7); x.fill();
  // head
  const hb = ph(t, 8, o) * .06;
  x.save(); x.translate(10, -86); x.rotate(hb);
  x.fillStyle = body;
  x.beginPath(); x.moveTo(-22, -10); x.lineTo(-18, -44); x.lineTo(-2, -18); x.fill();
  x.beginPath(); x.moveTo(8, -18); x.lineTo(22, -44); x.lineTo(24, -8); x.fill();
  x.fillStyle = '#f7c9b4'; x.beginPath(); x.moveTo(-17, -16); x.lineTo(-16, -36); x.lineTo(-7, -19); x.fill(); x.beginPath(); x.moveTo(12, -18); x.lineTo(20, -36); x.lineTo(20, -12); x.fill();
  x.fillStyle = body; x.beginPath(); x.ellipse(0, 0, 28, 24, 0, 0, 7); x.fill();
  x.fillStyle = light; x.beginPath(); x.moveTo(-24, 6); x.quadraticCurveTo(0, -4, 30, 8); x.quadraticCurveTo(26, 24, 2, 24); x.quadraticCurveTo(-20, 22, -24, 6); x.fill();
  x.fillStyle = light; x.beginPath(); x.ellipse(30, 10, 12, 8, 0, 0, 7); x.fill();
  C.circ(41, 8, 4.5, INKE);
  eye(-6, -4, 4, t, o); eye(16, -4, 4, t, o + .3);
  smile(26, 14, 5, INKE, 1.8); cheek(-12, 8, 5); cheek(22, 6, 4);
  x.restore();
  x.restore();
}
function hedgehog(px, py, s, t, o, flip) {
  place(px, py, s, flip);
  const step = ph(t, 120, o), bob = Math.abs(step) * 1.5;
  x.translate(0, -bob);
  // feet
  x.fillStyle = '#b48d80'; [[-14, step], [10, -step]].forEach(([fx, d]) => { x.beginPath(); x.ellipse(fx + d * 3, 2 + bob, 6, 4, 0, 0, 7); x.fill(); });
  // spikes
  x.fillStyle = '#a8826f'; x.beginPath(); x.moveTo(-34, 0);
  for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI, r = i % 2 ? 32 : 40; x.lineTo(-4 + Math.cos(a) * r * 1.05, -2 + Math.sin(a) * r * .8); }
  x.closePath(); x.fill();
  x.fillStyle = '#c19c86'; x.beginPath(); x.ellipse(-4, -10, 28, 18, 0, Math.PI, 0); x.fill();
  // face
  x.fillStyle = '#f3dcc4'; x.beginPath(); x.moveTo(14, -24); x.quadraticCurveTo(30, -22, 42, -8); x.quadraticCurveTo(30, 2, 12, 0); x.quadraticCurveTo(8, -12, 14, -24); x.fill();
  C.circ(43, -8, 3.5, INKE);
  x.fillStyle = '#f3dcc4'; x.beginPath(); x.ellipse(16, -24, 5, 4, 0, 0, 7); x.fill();
  eye(24, -13, 2.6, t, o); cheek(22, -5, 3); smile(34, -5, 3, INKE, 1.3);
  x.restore();
}
function squirrel(px, py, s, t, o) {
  // sits on the branch, nibbles an acorn, tail sways
  place(px, py, s, true);
  const nib = Math.max(0, ph(t, 60, o)) * 2.5, tail = ph(t, 10, o) * .12;
  const body = '#e3946e', light = '#fbe6d2';
  x.save(); x.translate(-14, -6); x.rotate(tail);
  x.fillStyle = '#e8a07c'; x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(-34, -6, -40, -50, -20, -66); x.bezierCurveTo(-4, -78, 18, -64, 8, -50); x.bezierCurveTo(-4, -44, -16, -40, -10, -20); x.closePath(); x.fill();
  x.fillStyle = 'rgba(255,255,255,.2)'; x.beginPath(); x.ellipse(-18, -50, 8, 14, -.3, 0, 7); x.fill();
  x.restore();
  x.fillStyle = body; x.beginPath(); x.ellipse(0, -18, 16, 20, .1, 0, 7); x.fill();
  x.fillStyle = light; x.beginPath(); x.ellipse(6, -16, 8, 13, .1, 0, 7); x.fill();
  x.save(); x.translate(4, -42 + nib * .4);
  x.fillStyle = body; x.beginPath(); x.moveTo(-8, -8); x.lineTo(-6, -22); x.lineTo(2, -10); x.fill();
  x.beginPath(); x.ellipse(0, 0, 13, 12, 0, 0, 7); x.fill();
  x.fillStyle = light; x.beginPath(); x.ellipse(10, 4, 7, 5, 0, 0, 7); x.fill();
  C.circ(16, 2, 2.2, INKE); eye(4, -3, 2.6, t, o); cheek(4, 5, 2.6);
  x.restore();
  acorn(14, -30 + nib, .8, .3);
  x.fillStyle = body; x.beginPath(); x.ellipse(10, -28 + nib, 4, 3, 0, 0, 7); x.fill();
  x.beginPath(); x.ellipse(-6, -1, 7, 4, 0, 0, 7); x.fill(); x.beginPath(); x.ellipse(8, -1, 7, 4, 0, 0, 7); x.fill();
  x.restore();
}
function owl(cx, cy, s, t, o) {
  // sleepy owl in the hollow: long slow blinks, tiny head tilt
  x.save(); x.translate(cx, cy); x.rotate(ph(t, 6, o) * .08); x.scale(s, s);
  x.fillStyle = '#b9a2c4'; x.beginPath(); x.ellipse(0, 4, 18, 22, 0, 0, 7); x.fill();
  x.fillStyle = '#e6d7ea'; x.beginPath(); x.ellipse(0, 10, 11, 14, 0, 0, 7); x.fill();
  x.fillStyle = '#b9a2c4'; x.beginPath(); x.moveTo(-16, -10); x.lineTo(-14, -26); x.lineTo(-6, -14); x.fill(); x.beginPath(); x.moveTo(16, -10); x.lineTo(14, -26); x.lineTo(6, -14); x.fill();
  C.circ(-7, -6, 8, '#fbf3ff'); C.circ(7, -6, 8, '#fbf3ff');
  const k = frac(t / P * 20 + o), closed = k > .55 && k < .8;
  if (closed) { x.strokeStyle = INKE; x.lineWidth = 2; x.lineCap = 'round'; [-7, 7].forEach(d => { x.beginPath(); x.arc(d, -7, 4.5, .2, Math.PI - .2); x.stroke(); }); }
  else { eye(-7, -6, 4, t, o, 5); eye(7, -6, 4, t, o, 5); }
  x.fillStyle = '#f2b07a'; x.beginPath(); x.moveTo(-3, 1); x.lineTo(3, 1); x.lineTo(0, 6); x.fill();
  x.strokeStyle = 'rgba(150,120,160,.6)'; x.lineWidth = 1.5; for (let i = 0; i < 3; i++) { x.beginPath(); x.arc(-4 + i * 4, 12 + (i % 2) * 4, 2.5, 0, Math.PI); x.stroke(); }
  x.restore();
}
function deer(px, py, s, t, o, fawn) {
  place(px, py, s, false);
  const graze = clamp(ph(t, fawn ? 5 : 4, o) * 1.6 + .2, 0, 1), tail = ph(t, 50, o) * .3;
  const body = fawn ? '#e9b993' : '#d9a585', light = '#fbe9d6';
  // legs
  x.fillStyle = '#c99476'; [[-30, 0], [-20, ph(t, 4, o) * 1], [22, 0], [32, 0]].forEach(([lx]) => x.fillRect(lx - 3, -30, 6, 30));
  x.fillStyle = '#8f6f68'; [-30, -20, 22, 32].forEach(lx => x.fillRect(lx - 3, -4, 6, 4));
  // body
  x.fillStyle = body; x.beginPath(); x.ellipse(0, -40, 44, 20, 0, 0, 7); x.fill();
  x.fillStyle = light; x.beginPath(); x.ellipse(2, -28, 32, 7, 0, 0, 7); x.fill();
  if (fawn) [[-14, -48], [0, -52], [14, -48], [-6, -42], [8, -42], [-22, -44]].forEach(([a, b]) => C.circ(a, b, 2.6, 'rgba(255,255,255,.85)'));
  x.save(); x.translate(-42, -50); x.rotate(-.6 + tail); x.fillStyle = body; x.beginPath(); x.ellipse(0, -4, 5, 9, 0, 0, 7); x.fill(); x.fillStyle = light; x.beginPath(); x.ellipse(0, 0, 3, 5, 0, 0, 7); x.fill(); x.restore();
  // neck + head (lowers to graze)
  const ang = lerp(-.55, .95, graze);
  x.save(); x.translate(32, -50); x.rotate(ang);
  x.fillStyle = body; x.beginPath(); x.moveTo(-8, 6); x.lineTo(-6, -30); x.lineTo(10, -30); x.lineTo(12, 8); x.fill();
  x.translate(2, -34); x.rotate(-ang * .6 + .2);
  x.fillStyle = body; x.beginPath(); x.ellipse(-8, -10, 5, 10, -.5, 0, 7); x.fill(); x.beginPath(); x.ellipse(10, -12, 5, 10, .4, 0, 7); x.fill();
  x.fillStyle = '#f5c9b6'; x.beginPath(); x.ellipse(10, -12, 2.5, 6, .4, 0, 7); x.fill();
  if (!fawn) { x.strokeStyle = '#b8957e'; x.lineWidth = 3; x.lineCap = 'round'; [[-4, -1], [4, 1]].forEach(([d, dd]) => { x.beginPath(); x.moveTo(d, -12); x.lineTo(d + dd * 4, -30); x.lineTo(d + dd * 10, -36); x.moveTo(d + dd * 3, -24); x.lineTo(d + dd * -4, -30); x.stroke(); }); }
  x.fillStyle = body; x.beginPath(); x.ellipse(4, 0, 13, 11, 0, 0, 7); x.fill();
  x.beginPath(); x.ellipse(16, 6, 9, 7, .3, 0, 7); x.fill();
  C.circ(23, 8, 2.6, INKE); eye(6, -2, 2.8, t, o); cheek(8, 6, 3);
  x.restore();
  x.restore();
}
function rabbit(px, py, s, t, o, flip, hops) {
  const k = frac(t / P * hops + o), hop = Math.abs(Math.sin(k * Math.PI * 1)) * 0;
  place(px, py, s, flip);
  const h = Math.abs(Math.sin(TAU * t / P * 36 + o)) * 16;
  x.translate(0, -h);
  const col = '#efe2e6', in2 = '#f6c5d1';
  x.fillStyle = col; x.beginPath(); x.ellipse(-20, -12, 7, 6, 0, 0, 7); x.fill();
  x.beginPath(); x.ellipse(-4, -16, 20, 15, -.1, 0, 7); x.fill();
  x.beginPath(); x.ellipse(-12, -2, 12, 5, 0, 0, 7); x.fill();
  x.save(); x.translate(14, -28);
  x.fillStyle = col; x.beginPath(); x.ellipse(-4, -18, 4.5, 14, -.25, 0, 7); x.fill(); x.beginPath(); x.ellipse(4, -18, 4.5, 14, .15, 0, 7); x.fill();
  x.fillStyle = in2; x.beginPath(); x.ellipse(4, -18, 2, 10, .15, 0, 7); x.fill();
  x.fillStyle = col; x.beginPath(); x.ellipse(2, 2, 12, 11, 0, 0, 7); x.fill();
  C.circ(13, 4, 2, '#e88fa6'); eye(5, -1, 2.4, t, o); cheek(6, 6, 2.6);
  x.restore();
  x.restore();
}
function mouse(cx, cy, s, t) {
  // peeks out of the leaf pile a few times per loop
  const k = frac(t / P * 6 + .2), up = clamp(Math.min(k / .12, (0.6 - k) / .12), 0, 1) * (k < .6 ? 1 : 0);
  if (up <= 0) return;
  x.save(); x.beginPath(); x.rect(cx - 40, cy - 60, 80, 60); x.clip();
  x.translate(cx, cy + (1 - up) * 34); x.scale(s, s);
  const col = '#c9b8c4';
  C.circ(-12, -30, 9, col); C.circ(12, -30, 9, col); C.circ(-12, -30, 5, '#f5c9d6'); C.circ(12, -30, 5, '#f5c9d6');
  x.fillStyle = col; x.beginPath(); x.ellipse(0, -14, 15, 16, 0, 0, 7); x.fill();
  C.circ(0, -8, 2.5, '#e88fa6'); eye(-6, -16, 2.4, t, 3); eye(6, -16, 2.4, t, 3.2); cheek(-9, -9, 2.4); cheek(9, -9, 2.4);
  x.strokeStyle = 'rgba(90,70,90,.5)'; x.lineWidth = 1; [-1, 1].forEach(d => { x.beginPath(); x.moveTo(d * 4, -8); x.lineTo(d * 16, -10); x.moveTo(d * 4, -7); x.lineTo(d * 16, -5); x.stroke(); });
  x.restore();
}
function snail(px, py, s, t, o) {
  place(px, py, s, false);
  const st = 1 + ph(t, 30, o) * .05;
  x.fillStyle = '#efd7c6'; x.beginPath(); x.moveTo(-18, 0); x.lineTo(20 * st, 0); x.quadraticCurveTo(28 * st, -4, 24 * st, -14); x.quadraticCurveTo(16, -10, 6, -6); x.lineTo(-18, -4); x.fill();
  x.strokeStyle = '#efd7c6'; x.lineWidth = 2; x.lineCap = 'round'; [[20, -24], [26, -22]].forEach(([a, b]) => { x.beginPath(); x.moveTo(22 * st, -12); x.lineTo(a * st, b); x.stroke(); C.circ(a * st, b, 2, '#efd7c6'); });
  x.fillStyle = '#d7a4b8'; x.beginPath(); x.arc(0, -14, 14, 0, 7); x.fill();
  x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = 2; x.beginPath(); for (let i = 0; i < 40; i++) { const a = i * .35, r = 12 - i * .28; x.lineTo(Math.cos(a) * r, -14 + Math.sin(a) * r); } x.stroke();
  eye(23 * st, -12, 1.8, t, o);
  x.restore();
}

function draw(t0) {
  const lt = t0, t = (t0 + T0) % P;
  sky(t);
  cloud(cross(t, 1, .1, 120, 1), 60, .9, .75);
  cloud(cross(t, 1, .62, 120, 1), 130, .6, .6);
  cloud(cross(t, 2, .35, 100, 1), 40, .5, .5);
  geese(t);
  hills();
  // back row of trees
  [[40, 330, .8, '#f1c18f'], [130, 322, .7, '#e9a99a'], [230, 330, .85, '#f3cd95'], [330, 318, .65, '#dea7bd'], [430, 326, .8, '#f0b38c'], [530, 320, .7, '#f3cd95'], [620, 330, .75, '#e9a99a']].forEach(([tx, ty, s, c], i) => roundTree(tx, ty, s, c, t, i));
  pineTree(185, 336, .7, '#b9c6a8'); pineTree(480, 334, .6, '#b2c2ab'); pineTree(580, 338, .55, '#b9c6a8');
  ground();
  // deer family grazing in the middle distance
  deer(470, 404, .62, t, 1, false);
  deer(400, 410, .44, t, 2, true);
  fallingLeaves(t, false);
  bigTree(t);
  owl(856, 322, .95, t, 4);
  bigCrown(t);
  squirrel(740, 226, .8, t, 5);
  // front details
  bush(110, 440, 1.1, '#e6b098'); bush(640, 448, .9, '#efc49c');
  leafPile(560, 482, 1);
  mouse(560, 474, .9, t);
  mushroom(250, 478, 1.05, '#ef9f9a', t, 2, true); mushroom(276, 486, .7, '#f3bf8e', t, 3, false); mushroom(912, 500, .9, '#e9a3b8', t, 4, true);
  acorn(300, 502, 1, .4); acorn(316, 506, .9, -.3); acorn(700, 508, .9, .2);
  fox(170, 470, .95, t, 0);
  snail(370 + ph(t, 1) * 30, 512, .8, t, 6);
  hedgehog(cross(t, 2, .25, 80, 1), 492 + ph(t, 2) * 3, .9, t, 7, false);
  rabbit(cross(t, 3, .7, 80, -1), 456, .85, t, 8, true, 3);
  fallingLeaves(t, true);
  const v = x.createRadialGradient(480, 280, 240, 480, 280, 640); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(80,50,70,.28)'); x.fillStyle = v; x.fillRect(0, 0, W, H);
  const fin = process.env.FADE || process.env.FADEIN, fout = process.env.FADE || process.env.FADEOUT;
  const f = Math.max(fin ? clamp(1 - lt / 3) : 0, fout ? clamp((lt - (DUR - 6)) / 6) : 0);
  if (f > 0) { x.fillStyle = `rgba(0,0,0,${f})`; x.fillRect(0, 0, W, H); }
}
if (require.main === module) C.run(draw, DUR, {});
else module.exports = { fox, hedgehog, squirrel, owl, deer, rabbit, mouse, snail, mushroom, acorn };
