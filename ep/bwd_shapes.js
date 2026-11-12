// Daily B&W sensory #11: Shapes Dance – white shape friends with happy faces on black: a round circle friend with a turning ring,
// a square with a little tilted square inside, a triangle with stripes, a twinkling five-point star, a gently beating heart,
// a slowly turning spiral disc, a hexagon with a honeycomb ring, a checkerboard square whose checks breathe, an egg with sliding zebra stripes
// and a dotty diamond. Each shape bounces and wiggles to the beat (own designs, new for this video).
// Background: small outline shapes (circles, triangles, squares) drifting and turning slowly. Foreground: tiny rising dots.
// Outro: square, circle and triangle asleep side by side on a long pillow, z z z.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;

const pw = (t, n, o = 0) => Math.sin(TAU * n * t / L.P + o);
const fill = (col = WH) => { x.fillStyle = col; x.fill(); };
const ring = (cx, cy, r, lw, col = BK) => { x.beginPath(); x.arc(cx, cy, r, 0, 7); line(lw, col); };
const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const face = (cx, cy, s, t, ph = 0) => { eye(cx - 18 * s, cy, 9 * s, t, ph); eye(cx + 18 * s, cy, 9 * s, t, ph + .3); smile(cx, cy + 12 * s, 14 * s, 5.5 * s); };
// a white face badge (so the face stays readable on busy patterns)
const badge = (cx, cy, rx, ry, t, s, ph) => { ell(cx, cy, rx, ry); face(cx, cy - 4 * s, s, t, ph); };
const bounce = (t, n = 60) => Math.abs(pw(t, n));
function zz(t, cx, cy, ph = 0) {
  x.font = C.FONT(30); x.fillStyle = WH; x.textAlign = 'center';
  for (let i = 0; i < 2; i++) { const k = ((t * 2 / 10 + ph + i / 2) % 1 + 1) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k); x.fillText('z', cx + k * 30 + i * 6, cy - k * 60); x.restore(); }
}
function poly(n, r, rot = -Math.PI / 2) { x.beginPath(); for (let i = 0; i < n; i++) { const a = rot + i * TAU / n; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); }
function starPath(r1, r2, n = 5, rot = -Math.PI / 2) { x.beginPath(); for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, r = i % 2 ? r2 : r1; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); }
function heartPath(s) { x.beginPath(); x.moveTo(0, 40 * s); x.bezierCurveTo(-120 * s, -30 * s, -70 * s, -120 * s, 0, -70 * s); x.bezierCurveTo(70 * s, -120 * s, 120 * s, -30 * s, 0, 40 * s); x.closePath(); }
// little arms that wave (black outline + white hand)
function arms(lx, rx, y, t, len = 46) {
  [[-1, lx], [1, rx]].forEach(([s, ax], j) => {
    const a = (s < 0 ? Math.PI + .5 : -.5) + s * pw(t, 60, j) * .35;
    const ex = ax + Math.cos(a) * len, ey = y + Math.sin(a) * len;
    x.beginPath(); x.moveTo(ax, y); x.lineTo(ex, ey); line(9); dot(ex, ey, 10);
  });
}
function feet(w, y) { ell(-w, y, 22, 11); ell(w, y, 22, 11); }

function circle(t) {
  const b = bounce(t) * 10; x.save(); x.translate(0, -b);
  arms(-108, 108, 0, t); feet(50, 112);
  dot(0, 0, 112); ring(0, 0, 88, 9);
  x.save(); x.rotate(TAU * 10 * t / L.P); for (let i = 0; i < 12; i++) { x.save(); x.rotate(i * TAU / 12); dot(0, -99, 4.5, BK); x.restore(); } x.restore();
  face(0, -6, 1.5, t); x.restore();
}
function square(t) {
  const b = bounce(t) * 10, w = pw(t, 60) * .05; x.save(); x.translate(0, -b); x.rotate(w);
  arms(-104, 104, 0, t); feet(52, 112);
  C.rr(-104, -104, 208, 208, 22); fill();
  x.save(); x.rotate(Math.PI / 4 + pw(t, 4) * .2); C.rr(-58, -58, 116, 116, 12); line(9, BK); x.restore();
  ell(0, 2, 52, 40); face(0, -2, 1.25, t, 1); x.restore();
}
function triangle(t) {
  const b = bounce(t) * 10; x.save(); x.translate(0, -b + 20);
  arms(-70, 70, 10, t); feet(60, 96);
  x.beginPath(); x.moveTo(0, -150); x.lineTo(140, 86); x.lineTo(-140, 86); x.closePath(); fill();
  x.save(); x.beginPath(); x.moveTo(0, -150); x.lineTo(140, 86); x.lineTo(-140, 86); x.closePath(); x.clip();
  [44, 70].forEach(yy => { x.fillStyle = BK; x.fillRect(-160, yy - 6, 320, 12); });
  x.restore();
  face(0, -14, 1.25, t, 2); x.restore();
}
function star(t) {
  const b = bounce(t) * 8, r = pw(t, 30) * .08; x.save(); x.translate(0, -b); x.rotate(r);
  starPath(140, 64); fill();
  starPath(96, 44); line(7, BK);
  // twinkle sparkles at the points
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * TAU / 5, k = Math.max(0, pw(t, 40, i * 1.3)); if (k > .2) { x.save(); x.translate(Math.cos(a) * 168, Math.sin(a) * 168); x.globalAlpha *= k; starPath(14, 4, 4, 0); fill(); x.restore(); } }
  ell(0, 4, 40, 32); face(0, 0, 1.0, t, 3); x.restore();
}
function heart(t) {
  const beat = 1 + Math.max(0, pw(t, 60)) ** 6 * .07; x.save(); x.translate(0, 20 + -bounce(t) * 6); x.scale(beat, beat);
  arms(-96, 96, -50, t, 40);
  heartPath(1.45); fill(); heartPath(1.02); line(8, BK);
  ell(0, -52, 48, 38); face(0, -56, 1.15, t, 4);
  x.restore();
}
function spiral(t) {
  const b = bounce(t) * 8; x.save(); x.translate(0, -b);
  dot(0, 0, 120);
  x.save(); x.rotate(TAU * 6 * t / L.P); x.beginPath();
  for (let a = 0; a < TAU * 3; a += .08) { const r = 16 + a * 5.2; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } line(10, BK); x.restore();
  badge(0, 0, 50, 42, t, 1.0, 5);
  feet(48, 118); x.restore();
}
function hexagon(t) {
  const b = bounce(t) * 10, w = pw(t, 60) * .04; x.save(); x.translate(0, -b); x.rotate(w);
  arms(-112, 112, 10, t); feet(52, 116);
  poly(6, 124, 0); fill(); poly(6, 96, 0); line(8, BK);
  for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + Math.PI / 6; x.save(); x.translate(Math.cos(a) * 110, Math.sin(a) * 110); poly(6, 9, 0); fill(BK); x.restore(); }
  ell(0, 2, 54, 42); face(0, -2, 1.25, t, 6); x.restore();
}
function checker(t) {
  const b = bounce(t) * 10; x.save(); x.translate(0, -b);
  arms(-110, 110, 0, t); feet(52, 114);
  C.rr(-110, -110, 220, 220, 16); fill();
  for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) {
    if ((r + c) % 2) continue;
    const k = .7 + .3 * (.5 + .5 * pw(t, 20, (r + c) * .6));
    const cx = -110 + 36.6 * (c + .5), cy = -110 + 36.6 * (r + .5), s = 34 * k;
    x.fillStyle = BK; x.fillRect(cx - s / 2, cy - s / 2, s, s);
  }
  badge(0, 0, 56, 44, t, 1.15, 7); x.restore();
}
function zebraEgg(t) {
  const b = bounce(t) * 10, r = pw(t, 60) * .06; x.save(); x.translate(0, -b); x.rotate(r);
  feet(44, 128);
  x.beginPath(); x.ellipse(0, 0, 100, 130, 0, 0, 7); fill();
  x.save(); x.beginPath(); x.ellipse(0, 0, 100, 130, 0, 0, 7); x.clip();
  const off = (t * 20 * 60 / L.P) % 60;
  for (let i = -3; i < 6; i++) { const yy = -150 + i * 60 + off; x.beginPath(); x.moveTo(-120, yy); x.quadraticCurveTo(0, yy + 22, 120, yy); x.lineTo(120, yy + 18); x.quadraticCurveTo(0, yy + 40, -120, yy + 18); x.closePath(); fill(BK); }
  x.restore();
  badge(0, -10, 54, 44, t, 1.15, 8); x.restore();
}
function diamond(t) {
  const b = bounce(t) * 10; x.save(); x.translate(0, -b);
  arms(-80, 80, 0, t); feet(40, 130);
  x.beginPath(); x.moveTo(0, -150); x.lineTo(118, 0); x.lineTo(0, 130); x.lineTo(-118, 0); x.closePath(); fill();
  [[0, -104, 10], [-52, -40, 9], [52, -40, 9], [-70, 22, 8], [70, 22, 8], [-34, 70, 9], [34, 70, 9], [0, 104, 8]].forEach(([a, c, r], i) => dot(a, c, r * (.85 + .15 * pw(t, 30, i)), BK));
  ell(0, -2, 44, 34); face(0, -4, 1.0, t, 9); x.restore();
}

function bg(t) {
  // little outline shapes drifting slowly across, turning
  for (let i = 0; i < 12; i++) {
    const k = ((t * (1 + i % 2) / L.P) + hash(i + 3)) % 1, dir = i % 2 ? 1 : -1;
    const sx = dir > 0 ? -40 + k * 1040 : 1000 - k * 1040, sy = i < 6 ? 46 + hash(i + 7) * 70 : 450 + hash(i + 9) * 60;
    x.save(); x.translate(sx, sy); x.rotate(TAU * (2 + i % 3) * t / L.P * dir); x.globalAlpha *= .55;
    const s = 12 + hash(i + 11) * 8;
    if (i % 3 === 0) { x.beginPath(); x.arc(0, 0, s, 0, 7); } else if (i % 3 === 1) poly(3, s * 1.2); else { x.beginPath(); x.rect(-s, -s, 2 * s, 2 * s); }
    line(3); x.restore();
  }
}
function fg(t) {
  for (let i = 0; i < 10; i++) {
    const k = ((t * 3 / L.P) + hash(i + 71)) % 1;
    const sx = 60 + hash(i + 33) * 840 + Math.sin(k * TAU * 2 + i) * 20, sy = 480 - k * 400;
    x.save(); x.globalAlpha *= Math.sin(Math.PI * k) * .6; dot(sx, sy, 2.5 + hash(i) * 2); x.restore();
  }
}
// outro: square, circle and triangle asleep side by side on a long pillow
function sleepyEnd(t) {
  const br = 1 + pw(t, 16) * .015;
  C.rr(-320, 70, 640, 70, 34); fill();
  x.beginPath(); x.moveTo(-270, 105); x.lineTo(270, 105); x.setLineDash([14, 12]); line(4, BK); x.setLineDash([]);
  x.save(); x.translate(-206, 0); x.scale(br, br); C.rr(-80, -80, 160, 160, 18); fill(); sleepyEye(-26, -10, 10); sleepyEye(26, -10, 10); x.beginPath(); x.arc(0, 18, 7, 0, 7); line(4, BK); x.restore();
  x.save(); x.translate(0, -6); x.scale(br, br); dot(0, 0, 86); ring(0, 0, 66, 7); sleepyEye(-24, -8, 10); sleepyEye(24, -8, 10); x.beginPath(); x.arc(0, 20, 7, 0, 7); line(4, BK); x.restore();
  x.save(); x.translate(208, -4); x.scale(br, br); x.beginPath(); x.moveTo(0, -100); x.lineTo(92, 74); x.lineTo(-92, 74); x.closePath(); fill(); sleepyEye(-20, 14, 9); sleepyEye(20, 14, 9); x.beginPath(); x.arc(0, 38, 6, 0, 7); line(4, BK); x.restore();
  zz(t, -120, -100); zz(t, 280, -120, .5);
  // a little star blanket of dots above
  for (let i = 0; i < 7; i++) { x.save(); x.translate(-300 + i * 100, -200 + (i % 2) * 30); x.globalAlpha *= .5 + .5 * Math.abs(pw(t, 8, i)); starPath(12, 5); fill(); x.restore(); }
}

L.scene({
  seed: 1111,
  figs: [[circle, .8, 'sway'], [square, .8, 'floor'], [triangle, .8, 'swimL'], [star, .85, 'float'], [heart, .85, 'fly'],
         [spiral, .8, 'sway'], [hexagon, .8, 'swimR'], [checker, .8, 'floor'], [zebraEgg, .8, 'float'], [diamond, .8, 'swimL']],
  bg, fg, end: sleepyEnd,
});
