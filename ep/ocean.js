// Rustgevende onderwaterwereld (sensory). Alles is periodiek met P seconden (naadloze loop).
const C = require('../lib/common');
const { x, W, H, clamp, lerp, hash } = C;
const P = 240, TAU = Math.PI * 2;
const DUR = +(process.env.DUR || P);
const T0 = +(process.env.T0 || 0);
const ph = (t, m = 1, o = 0) => Math.sin(TAU * m * t / P + o);
const frac = v => v - Math.floor(v);
// oversteek: k loopt 0..1, m keer per loop
const cross = (t, m, off, pad, dir = 1) => { const k = frac(t / P * m + off); return dir > 0 ? -pad + k * (W + 2 * pad) : W + pad - k * (W + 2 * pad); };

function glow(cx, cy, r, col, a) {
  const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0));
  x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
}
function eye(cx, cy, r, t, o = 0) {
  const blink = ((t + o * 1.7) % 6) < .16;
  if (blink) { x.strokeStyle = '#2f3560'; x.lineWidth = r * .45; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r * .8, .2, Math.PI - .2); x.stroke(); return; }
  C.circ(cx, cy, r, '#2f3560'); C.circ(cx + r * .35, cy - r * .35, r * .38, '#ffffff');
}
const smile = (cx, cy, r, col = '#2f3560', w = 2.2) => { x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r, .25, Math.PI - .9); x.stroke(); };
const cheek = (cx, cy, r) => C.circ(cx, cy, r, 'rgba(255,160,185,.45)');

// ---------- omgeving ----------
function water() {
  const g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#9fd3e0'); g.addColorStop(.35, '#5f9cc4'); g.addColorStop(.75, '#4b6aa6'); g.addColorStop(1, '#4a4f8c');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
}
function surface(t) {
  x.fillStyle = 'rgba(220,245,250,.35)'; x.beginPath(); x.moveTo(0, 0);
  for (let i = 0; i <= W; i += 8) x.lineTo(i, 14 + Math.sin(i * .02 + TAU * 12 * t / P) * 5 + Math.sin(i * .045 - TAU * 8 * t / P) * 3);
  x.lineTo(W, 0); x.fill();
  // glinsteringen
  for (let i = 0; i < 26; i++) { const a = .3 + .7 * (ph(t, 30 + i % 9, i) * .5 + .5); x.globalAlpha = a * .6; x.fillStyle = '#ffffff'; x.fillRect(hash(i + 300) * W, 16 + hash(i + 320) * 14, 10 + hash(i) * 18, 2); }
  x.globalAlpha = 1;
}
function rays(t) {
  x.save(); x.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 6; i++) {
    const cx = 80 + i * 170 + ph(t, 3, i) * 30, w = 40 + hash(i + 9) * 50, a = .05 + .04 * (ph(t, 5 + i, i * 2) * .5 + .5);
    const g = x.createLinearGradient(0, 0, 0, 460); g.addColorStop(0, `rgba(230,250,255,${a})`); g.addColorStop(1, 'rgba(230,250,255,0)');
    x.fillStyle = g; x.beginPath(); x.moveTo(cx - w / 2, 0); x.lineTo(cx + w / 2, 0); x.lineTo(cx + w * 1.6 + 120, 460); x.lineTo(cx + 120 - w * .4, 460); x.fill();
  }
  x.restore();
}
function plankton(t) {
  for (let i = 0; i < 60; i++) {
    const px = frac(hash(i + 500) + t / P * (1 + i % 2)) * W, py = hash(i + 530) * 470 + ph(t, 4 + i % 5, i) * 14;
    x.globalAlpha = .25 + .45 * (ph(t, 18 + i % 11, i) * .5 + .5); C.circ(px, py, .8 + hash(i + 7) * 1.4, '#eafcff');
  }
  x.globalAlpha = 1;
}
function bubbles(t) {
  [[60, 1.2], [300, .9], [560, 1], [745, 1.1], [905, .8]].forEach(([bx, s], j) => {
    for (let i = 0; i < 7; i++) {
      const k = frac(t / P * (14 + j) + i / 7 + hash(j) ), by = 500 - k * 500, wob = Math.sin(k * 20 + i) * 6;
      const r = (2 + hash(i + j * 10) * 4) * s * (.6 + k * .6);
      x.globalAlpha = .55 * Math.sin(k * Math.PI); x.strokeStyle = '#eafcff'; x.lineWidth = 1.4; x.beginPath(); x.arc(bx + wob, by, r, 0, 7); x.stroke();
      C.circ(bx + wob - r * .35, by - r * .35, r * .25, '#ffffff');
    }
  });
  x.globalAlpha = 1;
}
function farReef() {
  x.fillStyle = 'rgba(80,95,160,.55)'; x.beginPath(); x.moveTo(0, H);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 400 - Math.sin(i * .011 + 2) * 22 - Math.sin(i * .031) * 8); x.lineTo(W, H); x.fill();
}
function sand() {
  const g = x.createLinearGradient(0, 455, 0, H); g.addColorStop(0, '#d8c6b4'); g.addColorStop(1, '#b8a5a8');
  x.fillStyle = g; x.beginPath(); x.moveTo(0, H);
  for (let i = 0; i <= W; i += 8) x.lineTo(i, 478 - Math.sin(i * .008 + 1) * 12 - Math.sin(i * .02 + 3) * 4); x.lineTo(W, H); x.fill();
  x.fillStyle = 'rgba(255,255,255,.18)'; for (let i = 0; i < 40; i++) C.circ(hash(i + 900) * W, 492 + hash(i + 930) * 44, 1.5, 'rgba(255,255,255,.25)');
}
function rock(cx, cy, w, h, col = '#8a86a8') { x.fillStyle = col; x.beginPath(); x.ellipse(cx, cy, w, h, 0, Math.PI, 0); x.fill(); x.fillStyle = 'rgba(255,255,255,.12)'; x.beginPath(); x.ellipse(cx - w * .25, cy - h * .55, w * .45, h * .25, -.2, 0, 7); x.fill(); }
function kelp(bx, by, h, t, o, col = '#7fbf9f') {
  x.strokeStyle = col; x.lineCap = 'round';
  for (let s = 0; s < 3; s++) {
    let px = bx + s * 12, py = by; x.lineWidth = 7 - s;
    x.beginPath(); x.moveTo(px, py);
    const n = 12;
    for (let i = 1; i <= n; i++) { const k = i / n; px = bx + s * 12 + ph(t, 8, o + s + k * 2) * 22 * k; py = by - h * k * (1 - s * .12); x.lineTo(px, py);
      if (i % 2 === 0) { x.save(); x.fillStyle = col; x.beginPath(); x.ellipse(px + (i % 4 ? 8 : -8), py, 9, 4, i % 4 ? .5 : -.5, 0, 7); x.fill(); x.restore(); } }
    x.stroke();
  }
}
function coralBranch(bx, by, s, col, t, o) {
  x.save(); x.translate(bx, by); x.scale(s, s); x.strokeStyle = col; x.lineCap = 'round';
  const br = (len, ang, w, d) => { if (d === 0) { C.circ(0, 0, w * .8, col); return; } x.save(); x.rotate(ang + ph(t, 6, o + d) * .03); x.lineWidth = w; x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -len); x.stroke(); x.translate(0, -len); br(len * .72, -.45, w * .78, d - 1); br(len * .72, .45, w * .78, d - 1); x.restore(); };
  br(26, 0, 9, 4); x.restore();
}
function brainCoral(cx, cy, r, col) { x.fillStyle = col; x.beginPath(); x.ellipse(cx, cy, r, r * .75, 0, Math.PI, 0); x.fill(); x.strokeStyle = 'rgba(255,255,255,.3)'; x.lineWidth = 2; for (let i = 1; i < 4; i++) { x.beginPath(); x.ellipse(cx, cy, r * i / 4, r * .75 * i / 4, 0, Math.PI + .3, -.3); x.stroke(); } }
function fanCoral(cx, cy, r, col, t) { x.save(); x.translate(cx, cy); x.rotate(ph(t, 5) * .04); x.strokeStyle = col; x.lineWidth = 2.2; for (let i = 0; i < 11; i++) { const a = -Math.PI + .25 + i * (Math.PI - .5) / 10; x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(Math.cos(a) * r * .5 + 6, Math.sin(a) * r * .5, Math.cos(a) * r, Math.sin(a) * r); x.stroke(); } x.globalAlpha = .35; x.fillStyle = col; x.beginPath(); x.arc(0, 0, r, Math.PI, 0); x.fill(); x.restore(); x.globalAlpha = 1; }

// ---------- dieren (kijkrichting naar rechts; flip = naar links) ----------
function place(px, py, s, flip, rot = 0) { x.save(); x.translate(px, py); x.rotate(rot); x.scale(flip ? -s : s, s); }

function fish(px, py, s, col, fin, t, o, flip, stripe) {
  place(px, py, s, flip, ph(t, 20, o) * .05);
  const wag = ph(t, 90, o) * 6;
  x.fillStyle = fin; x.beginPath(); x.moveTo(-14, 0); x.lineTo(-30, -11 + wag); x.lineTo(-30, 11 + wag); x.closePath(); x.fill();
  x.fillStyle = col; x.beginPath(); x.ellipse(0, 0, 20, 12, 0, 0, 7); x.fill();
  x.fillStyle = fin; x.beginPath(); x.moveTo(-6, -10); x.quadraticCurveTo(2, -20, 8, -10); x.fill();
  if (stripe) { x.fillStyle = stripe; x.fillRect(-5, -11, 5, 22); }
  eye(10, -3, 3.2, t, o); x.restore();
}
function clownfish(px, py, s, t, o, flip) {
  place(px, py, s, flip, 0); const wag = ph(t, 110, o) * 5;
  x.fillStyle = '#ffa36c'; x.beginPath(); x.moveTo(-12, 0); x.lineTo(-24, -9 + wag); x.lineTo(-24, 9 + wag); x.fill();
  x.beginPath(); x.ellipse(0, 0, 16, 10, 0, 0, 7); x.fill();
  x.fillStyle = '#ffffff'; x.fillRect(-7, -9, 4, 18); x.fillRect(5, -9, 4, 18);
  eye(10, -2, 2.6, t, o); x.restore();
}
function dolphin(px, py, s, t, o, flip, rot) {
  place(px, py, s, flip, rot);
  const tail = ph(t, 40, o) * 8;
  const body = '#8fb3d9', belly = '#e3eef8';
  // staartvin
  x.fillStyle = body; x.beginPath(); x.moveTo(-66, tail * .5); x.quadraticCurveTo(-88, -18 + tail, -96, -14 + tail); x.quadraticCurveTo(-84, tail, -96, 14 + tail); x.quadraticCurveTo(-88, 18 + tail, -66, tail * .5); x.fill();
  // rugvin
  x.beginPath(); x.moveTo(-10, -20); x.quadraticCurveTo(-20, -44, -34, -46); x.quadraticCurveTo(-22, -30, -28, -17); x.fill();
  // lijf
  x.beginPath(); x.moveTo(-70, tail * .5); x.bezierCurveTo(-40, -24, 30, -30, 60, -8); x.quadraticCurveTo(76, -6, 84, -1); x.quadraticCurveTo(76, 6, 58, 7); x.bezierCurveTo(30, 22, -40, 16, -70, tail * .5); x.fill();
  x.save(); x.clip(); x.fillStyle = belly; x.beginPath(); x.ellipse(10, 18, 70, 14, -.05, 0, 7); x.fill(); x.restore();
  // borstvin
  x.fillStyle = '#7ea3cc'; x.beginPath(); x.moveTo(18, 8); x.quadraticCurveTo(6, 26, -6, 28); x.quadraticCurveTo(4, 14, 4, 8); x.fill();
  eye(46, -8, 4, t, o); smile(60, -6, 10, '#4c5f8a', 2); cheek(44, 2, 5);
  x.restore();
}
function whale(px, py, s, t, o, flip) {
  place(px, py, s, flip, ph(t, 4, o) * .03);
  const body = '#7489bf', belly = '#d6def2', tail = ph(t, 16, o) * 12;
  x.fillStyle = body;
  x.beginPath(); x.moveTo(-150, tail * .3); x.quadraticCurveTo(-190, -26 + tail, -214, -30 + tail); x.quadraticCurveTo(-196, tail, -214, 26 + tail); x.quadraticCurveTo(-190, 26 + tail, -150, tail * .3); x.fill();
  x.beginPath(); x.moveTo(-160, tail * .3); x.bezierCurveTo(-100, -50, 60, -72, 130, -30); x.quadraticCurveTo(160, -10, 150, 18); x.bezierCurveTo(100, 50, -60, 40, -160, tail * .3); x.fill();
  x.save(); x.clip(); x.fillStyle = belly; x.beginPath(); x.ellipse(40, 46, 140, 34, -.05, 0, 7); x.fill();
  x.strokeStyle = 'rgba(116,137,191,.45)'; x.lineWidth = 2.5; for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(140 - i * 2, 20 + i * 5); x.quadraticCurveTo(40, 36 + i * 5, -50, 30 + i * 3); x.stroke(); } x.restore();
  // lange vin (bultrug)
  x.fillStyle = '#6a7fb4'; x.save(); x.translate(40, 18); x.rotate(-.55 + ph(t, 10, o) * .12); x.beginPath(); x.ellipse(-50, 0, 60, 11, 0, 0, 7); x.fill(); x.restore();
  x.beginPath(); x.moveTo(-60, -44); x.quadraticCurveTo(-72, -58, -82, -56); x.quadraticCurveTo(-74, -48, -78, -40); x.fill();
  eye(96, -12, 6, t, o); smile(120, -8, 18, '#47557f', 3); cheek(92, 4, 8);
  x.restore();
}
function shark(px, py, s, t, o, flip) {
  place(px, py, s, flip, ph(t, 12, o) * .03);
  const body = '#9fb0c8', belly = '#eef2f8', tail = ph(t, 36, o) * 9;
  x.fillStyle = body;
  x.beginPath(); x.moveTo(-80, tail * .4); x.quadraticCurveTo(-98, -30 + tail, -112, -46 + tail); x.quadraticCurveTo(-100, -6 + tail, -104, 26 + tail); x.quadraticCurveTo(-94, 12 + tail, -80, tail * .4); x.fill();
  x.beginPath(); x.moveTo(-6, -24); x.quadraticCurveTo(-14, -54, -30, -60); x.quadraticCurveTo(-24, -36, -32, -20); x.fill();
  x.beginPath(); x.moveTo(-84, tail * .4); x.bezierCurveTo(-40, -30, 50, -32, 90, -4); x.quadraticCurveTo(100, 6, 86, 12); x.bezierCurveTo(40, 26, -40, 18, -84, tail * .4); x.fill();
  x.save(); x.clip(); x.fillStyle = belly; x.beginPath(); x.ellipse(20, 20, 84, 14, 0, 0, 7); x.fill(); x.restore();
  x.fillStyle = '#8b9dba'; x.beginPath(); x.moveTo(20, 10); x.quadraticCurveTo(4, 34, -14, 36); x.quadraticCurveTo(0, 20, 0, 10); x.fill();
  eye(62, -8, 5, t, o); smile(74, 0, 11, '#4c5a78', 2.4); cheek(58, 6, 6);
  x.restore();
}
function manta(px, py, s, t, o, flip) {
  place(px, py, s, flip, ph(t, 6, o) * .04);
  const fl = .75 + ph(t, 30, o) * .25, lag = ph(t, 30, o - .8) * 10;
  x.strokeStyle = '#4f5f92'; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.moveTo(-40, 0); x.quadraticCurveTo(-90, lag * .5, -140, lag); x.stroke();
  x.fillStyle = '#5c6ea6'; x.beginPath(); x.moveTo(52, -6);
  x.quadraticCurveTo(30, -70 * fl, -14 + lag, -96 * fl); x.quadraticCurveTo(-10, -40 * fl, -44, 0);
  x.quadraticCurveTo(-10, 40 * fl, -14 + lag, 96 * fl); x.quadraticCurveTo(30, 70 * fl, 52, 6); x.closePath(); x.fill();
  x.fillStyle = 'rgba(220,230,250,.45)'; [-1, 1].forEach(d => { x.beginPath(); x.ellipse(14, d * 26 * fl, 16, 8 * fl, d * .5, 0, 7); x.fill(); });
  x.fillStyle = '#4f5f92'; [-1, 1].forEach(d => { x.beginPath(); x.ellipse(56, d * 9, 9, 4, d * .5, 0, 7); x.fill(); });
  eye(40, -9, 3, t, o); eye(40, 9, 3, t, o + 1); smile(46, -2, 5, '#2f3560', 1.6);
  x.restore();
}
function turtle(px, py, s, t, o, flip) {
  place(px, py, s, flip, ph(t, 10, o) * .04);
  const p = ph(t, 24, o);
  x.fillStyle = '#9fd1ae';
  x.save(); x.translate(10, 14); x.rotate(.6 + p * .45); x.beginPath(); x.ellipse(0, 18, 9, 24, 0, 0, 7); x.fill(); x.restore();
  x.save(); x.translate(-24, 12); x.rotate(.5 - p * .3); x.beginPath(); x.ellipse(0, 10, 7, 14, 0, 0, 7); x.fill(); x.restore();
  x.beginPath(); x.ellipse(40, -2, 16, 12, .1, 0, 7); x.fill();
  x.fillStyle = '#6fa58a'; x.beginPath(); x.ellipse(0, 0, 38, 22, 0, Math.PI * .95, Math.PI * 2.05); x.fill();
  x.fillStyle = '#e8dcae'; x.beginPath(); x.ellipse(0, 4, 36, 8, 0, 0, Math.PI); x.fill();
  x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 2; [[-16, -8], [0, -12], [16, -8]].forEach(([a, b]) => { x.beginPath(); x.ellipse(a, b, 9, 7, 0, 0, 7); x.stroke(); });
  x.fillStyle = '#9fd1ae'; x.save(); x.translate(4, 8); x.rotate(-.5 - p * .45); x.beginPath(); x.ellipse(0, 16, 8, 22, 0, 0, 7); x.fill(); x.restore();
  eye(46, -5, 3, t, o); smile(50, -1, 5, '#2f3560', 1.6);
  x.restore();
}
function jelly(px, py, s, t, o, col) {
  const pulse = ph(t, 40, o);
  x.save(); x.translate(px, py); x.scale(s, s);
  glow(0, 0, 60, 'rgba(255,215,240,A)', .25);
  x.strokeStyle = 'rgba(255,215,235,.55)'; x.lineWidth = 2;
  for (let i = 0; i < 6; i++) { const bx = -18 + i * 7.2; x.beginPath(); x.moveTo(bx, 6); for (let k = 1; k <= 8; k++) x.lineTo(bx + Math.sin(k * .8 + TAU * 20 * t / P + i) * 4, 6 + k * 8 + pulse * 2); x.stroke(); }
  x.fillStyle = col; x.globalAlpha = .85; x.beginPath(); x.ellipse(0, 6, 26 - pulse * 3, 26 + pulse * 2, 0, Math.PI, 0); x.quadraticCurveTo(0, 12, -26 + pulse * 3, 6); x.fill();
  x.globalAlpha = .35; x.fillStyle = '#ffffff'; x.beginPath(); x.ellipse(-8, -8, 8, 5, -.5, 0, 7); x.fill(); x.globalAlpha = 1;
  eye(-7, -2, 2.4, t, o); eye(7, -2, 2.4, t, o); smile(0, -1, 4, '#7a4a6a', 1.5);
  x.restore();
}
function seahorse(px, py, s, t, o, col = '#f3c47d') {
  x.save(); x.translate(px, py + ph(t, 10, o) * 8); x.rotate(ph(t, 8, o) * .05); x.scale(s, s);
  // lijf als reeks bolletjes
  const pts = []; for (let i = 0; i <= 24; i++) { const k = i / 24; const a = k < .55 ? lerp(-.2, .5, k / .55) : lerp(.5, 4.2, (k - .55) / .45); const r = k < .55 ? 22 : lerp(22, 4, (k - .55) / .45);
    pts.push([k < .55 ? Math.sin(a) * 10 : 6 + Math.cos(a) * r * .55, k < .55 ? -30 + k * 90 : 20 + Math.sin(a) * r * .55, lerp(13, 3, k)]); }
  x.fillStyle = col; pts.forEach(([a, b, r]) => { x.beginPath(); x.arc(a, b, r, 0, 7); x.fill(); });
  x.beginPath(); x.ellipse(0, -36, 13, 11, 0, 0, 7); x.fill();
  x.save(); x.translate(10, -36); x.rotate(.15); x.fillRect(0, -4, 18, 8); x.restore();
  x.fillStyle = '#f7d9a4'; x.beginPath(); x.ellipse(-12, -6, 6, 12, .2 + ph(t, 60, o) * .2, 0, 7); x.fill();
  x.fillStyle = col; x.beginPath(); x.moveTo(-6, -46); x.lineTo(-2, -56); x.lineTo(2, -46); x.fill();
  eye(4, -39, 2.8, t, o); cheek(3, -31, 3);
  x.restore();
}
function octopus(px, py, s, t, o) {
  x.save(); x.translate(px, py); x.scale(s, s * (1 + ph(t, 50, o) * .02));
  const col = '#e6a5c0';
  x.strokeStyle = col; x.lineCap = 'round';
  for (let i = 0; i < 6; i++) { const bx = -30 + i * 12; x.lineWidth = 9; x.beginPath(); x.moveTo(bx, -10);
    const dir = i < 3 ? -1 : 1, sw = ph(t, 10, o + i) * 6;
    x.quadraticCurveTo(bx + dir * 10 + sw, 6, bx + dir * 22 + sw, 4); x.quadraticCurveTo(bx + dir * 32 + sw, 2, bx + dir * 28 + sw, -6); x.stroke(); }
  x.fillStyle = col; x.beginPath(); x.ellipse(0, -36, 34, 34, 0, 0, 7); x.fill(); x.fillRect(-32, -36, 64, 26);
  x.fillStyle = 'rgba(255,255,255,.2)'; x.beginPath(); x.ellipse(-12, -52, 9, 6, -.5, 0, 7); x.fill();
  eye(-11, -28, 4.5, t, o); eye(11, -28, 4.5, t, o); smile(0, -22, 6, '#7a3f5c', 2); cheek(-20, -20, 5); cheek(20, -20, 5);
  x.restore();
}
function crab(px, py, s, t, o) {
  const walk = ph(t, 40, o);
  x.save(); x.translate(px, py); x.scale(s, s);
  const col = '#f0a08e';
  x.strokeStyle = col; x.lineWidth = 3.5; x.lineCap = 'round';
  for (let i = 0; i < 3; i++) [-1, 1].forEach(d => { x.beginPath(); x.moveTo(d * 14, -6 + i * 3); x.lineTo(d * (26 + i * 3), -10 + i * 4 + (i % 2 ? walk : -walk) * 3); x.lineTo(d * (30 + i * 3), 0); x.stroke(); });
  [-1, 1].forEach(d => { x.lineWidth = 4; x.beginPath(); x.moveTo(d * 16, -14); x.lineTo(d * 26, -28); x.stroke(); x.fillStyle = col; x.beginPath(); x.ellipse(d * 30, -34, 10, 8, d * .4 + (d > 0 ? walk : -walk) * .1, 0, 7); x.fill();
    x.strokeStyle = '#b8a5a8'; x.lineWidth = 2; x.beginPath(); x.moveTo(d * 30, -34); x.lineTo(d * 40, -36); x.stroke(); x.strokeStyle = col; });
  x.fillStyle = col; x.beginPath(); x.ellipse(0, -12, 22, 14, 0, 0, 7); x.fill();
  x.lineWidth = 2.5; [-6, 6].forEach(d => { x.beginPath(); x.moveTo(d, -22); x.lineTo(d, -30); x.stroke(); C.circ(d, -32, 4, '#ffffff'); C.circ(d + .8, -32, 2.2, '#2f3560'); });
  smile(0, -12, 5, '#8a4b42', 1.8);
  x.restore();
}
function starfish(cx, cy, r, col, rot) {
  x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(1, .55); x.beginPath();
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU - Math.PI / 2, rr = i % 2 ? r * .45 : r; x.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  x.closePath(); x.fillStyle = col; x.lineJoin = 'round'; x.strokeStyle = col; x.lineWidth = 6; x.stroke(); x.fill();
  for (let i = 0; i < 5; i++) { const a = i / 5 * TAU - Math.PI / 2; C.circ(Math.cos(a) * r * .5, Math.sin(a) * r * .5, 2, 'rgba(255,255,255,.5)'); }
  x.restore();
}
function anemone(cx, cy, t) {
  x.strokeStyle = '#c9a3e0'; x.lineCap = 'round'; x.lineWidth = 6;
  for (let i = 0; i < 13; i++) { const a = -Math.PI + .2 + i * (Math.PI - .4) / 12, len = 34 + (i % 3) * 6; const sw = ph(t, 12, i * .5) * .18;
    x.beginPath(); x.moveTo(cx + Math.cos(a) * 12, cy); x.quadraticCurveTo(cx + Math.cos(a + sw) * len * .6, cy + Math.sin(a) * len * .5, cx + Math.cos(a + sw * 2) * len, cy + Math.sin(a + sw) * len); x.stroke();
    C.circ(cx + Math.cos(a + sw * 2) * len, cy + Math.sin(a + sw) * len, 4, '#f0c6ec'); }
  x.fillStyle = '#a97fc6'; x.beginPath(); x.ellipse(cx, cy + 4, 24, 10, 0, 0, 7); x.fill();
}
function school(t, m, off, py, n, col, fin, s, dir, o) {
  const bx = cross(t, m, off, 160, dir);
  for (let i = 0; i < n; i++) fish(bx + (hash(i + o) - .5) * 140, py + (hash(i + o + 50) - .5) * 60 + ph(t, 6, i + o) * 6, s * (.8 + hash(i + o + 9) * .3), col, fin, t, i + o, dir < 0);
}

function draw(t0) {
  const lt = t0, t = (t0 + T0) % P;
  water(); rays(t);
  // verre achtergrond
  x.globalAlpha = .35; school(t, 2, .1, 110, 14, '#cfe3f2', '#cfe3f2', .45, -1, 70); x.globalAlpha = 1;
  jelly(690 + ph(t, 2, 3) * 18, 120 + ph(t, 4, 2) * 26, .7, t, 2, '#d7c2f2');
  whale(cross(t, 1, .38, 240, 1), 118 + ph(t, 2) * 10, .95, t, 0, false);
  surface(t);
  farReef();
  manta(cross(t, 1, .62, 160, -1), 250 + ph(t, 3, 1) * 16, .85, t, 3, true);
  // dolfijnen: zacht golvend pad
  [[0, 0], [1, .06]].forEach(([i, d]) => {
    const k = frac(t / P * 2 + .45 + d), dx = W + 140 - k * (W + 280), dy = 200 + i * 46 + Math.sin(k * TAU * 2 + i) * 22;
    dolphin(dx, dy, .78 - i * .14, t, 5 + i, true, -Math.cos(k * TAU * 2 + i) * .16);
  });
  shark(cross(t, 1, .2, 160, 1), 318 + ph(t, 2, 2) * 12, .78, t, 7, false);
  school(t, 3, .3, 360, 9, '#ffd59e', '#ffb877', .8, -1, 10);
  jelly(150 + ph(t, 2, 1) * 20, 210 + ph(t, 5, 0) * 30, .9, t, 1, '#f7b8d6');
  jelly(870 + ph(t, 3, 2) * 14, 330 + ph(t, 5, 4) * 26, .6, t, 4, '#bfe6f0');
  turtle(cross(t, 2, .15, 120, 1), 385 + ph(t, 4, 1) * 14, 1, t, 9, false);
  // zeebodem
  sand();
  rock(770, 482, 70, 34);
  rock(390, 488, 40, 18, '#9a95b5');
  kelp(40, 490, 220, t, 0); kelp(110, 492, 170, t, 2, '#93caa8'); kelp(890, 488, 200, t, 4); kelp(935, 492, 150, t, 6, '#93caa8');
  coralBranch(205, 492, 1.15, '#f2a7b8', t, 1); coralBranch(255, 496, .8, '#c7a6e6', t, 2);
  brainCoral(330, 496, 30, '#f5c9a0'); fanCoral(470, 494, 46, '#e98fb0', t);
  coralBranch(685, 496, .9, '#f6b98f', t, 3);
  seahorse(150, 400, .9, t, 2);
  anemone(590, 490, t);
  clownfish(590 + Math.cos(TAU * 6 * t / P) * 34, 454 + Math.sin(TAU * 6 * t / P) * 10, .9, t, 1, Math.sin(TAU * 6 * t / P) > 0);
  clownfish(590 + Math.cos(TAU * 6 * t / P + 2.4) * 26, 462 + Math.sin(TAU * 6 * t / P + 2.4) * 8, .65, t, 2, Math.sin(TAU * 6 * t / P + 2.4) > 0);
  octopus(770, 450, .85, t, 3);
  crab(510 + ph(t, 2) * 40, 516, .8, t, 0);
  starfish(345, 522, 18, '#f6a37a', .2); starfish(860, 520, 14, '#f3cf77', -.3); starfish(60, 524, 12, '#e98fb0', .5);
  school(t, 4, .7, 300, 6, '#9fe0d0', '#6fc7b5', .7, 1, 30);
  bubbles(t); plankton(t);
  const v = x.createRadialGradient(480, 280, 220, 480, 280, 640); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(15,20,50,.4)'); x.fillStyle = v; x.fillRect(0, 0, W, H);
  const fin = process.env.FADE || process.env.FADEIN, fout = process.env.FADE || process.env.FADEOUT;
  const f = Math.max(fin ? clamp(1 - lt / 3) : 0, fout ? clamp((lt - (DUR - 6)) / 6) : 0);
  if (f > 0) { x.fillStyle = `rgba(0,0,0,${f})`; x.fillRect(0, 0, W, H); }
}
if (require.main === module) C.run(draw, DUR, {});
else module.exports = { fish, clownfish, dolphin, whale, shark, manta, turtle, jelly, seahorse, octopus, crab, starfish, anemone, kelp, coralBranch, brainCoral, fanCoral, rock };
