// Daily B&W sensory #1: Ocean Friends – witte zeedieren op zwart, opstijgende belletjes, wiegend zeewier.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;

function whale(t) {
  const tail = per(t, 30) * .15;
  x.beginPath(); x.moveTo(-150, 10); x.quadraticCurveTo(-150, -95, -10, -95); x.quadraticCurveTo(110, -95, 150, -10);
  x.quadraticCurveTo(175, 30, 120, 55); x.quadraticCurveTo(0, 95, -110, 60); x.quadraticCurveTo(-150, 45, -150, 10); x.fillStyle = WH; x.fill();
  x.save(); x.translate(140, -10); x.rotate(-.5 + tail);
  x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(40, -20, 70, -55); x.quadraticCurveTo(60, -10, 85, 5); x.quadraticCurveTo(40, 10, 0, 18); x.fill(); x.restore();
  for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(-120 + i * 26, 40 + i * 2); x.lineTo(-60 + i * 26, 52 + i * 2); line(5, BK); }
  eye(-95, -20, 13, t); smile(-120, 10, 22, 6);
  for (let i = 0; i < 3; i++) { const k = ((t * .4 + i / 3) % 1); x.globalAlpha *= 1; dot(-40 + (i - 1) * 22 * k, -110 - k * 70, 7 * (1 - k) + 2); }
}
function jelly(t) {
  const p = per(t, 40);
  x.beginPath(); x.moveTo(-95 - p * 6, 0); x.quadraticCurveTo(-95, -120, 0, -120); x.quadraticCurveTo(95, -120, 95 + p * 6, 0);
  for (let i = 4; i >= -4; i--) x.quadraticCurveTo(i * 22 + 11, 18, i * 22, 0); x.fillStyle = WH; x.fill();
  for (let i = -3; i <= 3; i++) { x.beginPath(); x.moveTo(i * 26, 8); for (let k = 1; k <= 6; k++) x.lineTo(i * 26 + Math.sin(TAU * (k / 6) + t * 1.6 + i) * 12, 8 + k * 26); line(7); }
  eye(-30, -55, 11, t); eye(30, -55, 11, t, 1); smile(0, -38, 18, 5);
}
function turtle(t) {
  const fl = per(t, 24) * .3;
  [[-70, -60, -1], [70, -60, 1], [-70, 60, -1], [70, 60, 1]].forEach(([fx, fy, s], i) => { x.save(); x.translate(fx, fy); x.rotate((fy < 0 ? -.4 : .4) * s + fl * (i % 2 ? 1 : -1)); ell(s * 30, 0, 45, 18); x.restore(); });
  ell(130, 0, 42, 34); eye(145, -10, 9, t); smile(140, 6, 12, 4);
  ell(0, 0, 115, 82);
  x.beginPath(); x.moveTo(0, -55); x.lineTo(40, -25); x.lineTo(40, 25); x.lineTo(0, 55); x.lineTo(-40, 25); x.lineTo(-40, -25); x.closePath(); line(7, BK);
  [[0, -55, 0, -82], [40, -25, 85, -45], [40, 25, 85, 45], [0, 55, 0, 82], [-40, 25, -85, 45], [-40, -25, -85, -45]].forEach(([a, b, c, d]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); line(7, BK); });
}
function octopus(t) {
  for (let i = 0; i < 6; i++) { const bx = -75 + i * 30; x.beginPath(); x.moveTo(bx, 10);
    for (let k = 1; k <= 8; k++) x.lineTo(bx + Math.sin(k * .7 + t * 1.2 + i) * 14 + (i - 2.5) * k * 4, 10 + k * 16); line(20); }
  ell(0, -50, 100, 95); eye(-35, -55, 15, t); eye(35, -55, 15, t, .6); smile(0, -25, 22, 7);
  [[-60, -100], [55, -110], [0, -125]].forEach(([a, b]) => dot(a, b, 9, BK));
}
function seahorse(t) {
  x.save(); x.rotate(per(t, 20) * .05);
  x.beginPath(); x.moveTo(-10, -120); x.quadraticCurveTo(60, -130, 50, -80); x.quadraticCurveTo(45, -50, 20, -40);
  x.quadraticCurveTo(70, 0, 30, 60); x.quadraticCurveTo(10, 100, 40, 120); x.quadraticCurveTo(60, 140, 30, 150); x.quadraticCurveTo(-10, 150, 0, 110);
  x.quadraticCurveTo(-40, 50, -30, 0); x.quadraticCurveTo(-30, -40, -45, -60); x.quadraticCurveTo(-60, -110, -10, -120); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(45, -95); x.lineTo(105, -100); x.lineTo(105, -80); x.lineTo(48, -78); x.fill();
  for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(-28 + i * 3, -20 + i * 28); x.lineTo(30 - i * 3, -10 + i * 28); line(6, BK); }
  x.beginPath(); x.moveTo(-40, -30); for (let i = 0; i < 4; i++) x.lineTo(-62, -20 + i * 18 + 9), x.lineTo(-40, -20 + i * 18 + 18); x.fill();
  eye(15, -95, 11, t); x.restore();
}
function crab(t) {
  const wv = per(t, 30) * .25;
  for (let s of [-1, 1]) for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(s * 70, 20 + i * 14); x.lineTo(s * 115, 30 + i * 20); x.lineTo(s * 125, 60 + i * 18); line(12); }
  for (let s of [-1, 1]) { x.save(); x.translate(s * 80, -30); x.rotate(s * (-.5 + wv)); x.beginPath(); x.moveTo(0, 0); x.lineTo(s * 40, -40); line(14);
    x.translate(s * 50, -55); ell(0, 0, 32, 26); x.beginPath(); x.moveTo(s * -4, -6); x.lineTo(s * 30, -14); line(8, BK); x.restore(); }
  ell(0, 10, 105, 60);
  for (let s of [-1, 1]) { x.beginPath(); x.moveTo(s * 25, -40); x.lineTo(s * 30, -75); line(10); eye(s * 30, -80, 14, t, s); }
  smile(0, 15, 24, 7);
}
function starfish(t) {
  x.save(); x.rotate(per(t, 4) * .25);
  x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 55 : 130; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath();
  x.lineJoin = 'round'; x.lineWidth = 40; x.strokeStyle = WH; x.stroke(); x.fillStyle = WH; x.fill();
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * TAU / 5; for (let k = 1; k <= 3; k++) dot(Math.cos(a) * k * 30, Math.sin(a) * k * 30, 6, BK); }
  x.restore(); eye(-22, -12, 10, t); eye(22, -12, 10, t, .4); smile(0, 4, 16, 5);
}
function dolphin(t) {
  const bob = per(t, 20) * .08;
  x.save(); x.rotate(bob);
  x.beginPath(); x.moveTo(-170, 10); x.quadraticCurveTo(-150, -10, -110, -15); x.quadraticCurveTo(-60, -80, 40, -60); x.quadraticCurveTo(120, -45, 150, -10);
  x.quadraticCurveTo(110, 35, 0, 40); x.quadraticCurveTo(-90, 45, -125, 18); x.quadraticCurveTo(-150, 22, -170, 10); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-10, -65); x.quadraticCurveTo(10, -120, 40, -120); x.quadraticCurveTo(25, -90, 40, -60); x.fill();
  x.beginPath(); x.moveTo(-20, 30); x.quadraticCurveTo(-10, 75, 20, 80); x.quadraticCurveTo(15, 50, 25, 35); x.fill();
  x.save(); x.translate(145, -10); x.rotate(per(t, 30) * .2); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(30, -40, 60, -50); x.quadraticCurveTo(45, -5, 65, 40); x.quadraticCurveTo(30, 20, 0, 10); x.fill(); x.restore();
  eye(-85, -25, 11, t); x.beginPath(); x.moveTo(-165, 12); x.quadraticCurveTo(-140, 20, -115, 10); line(5, BK);
  x.restore();
}
function puffer(t) {
  const b = 1 + per(t, 16) * .06;
  x.save(); x.scale(b, b);
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; x.beginPath(); x.moveTo(Math.cos(a) * 95, Math.sin(a) * 95); x.lineTo(Math.cos(a) * 125, Math.sin(a) * 125); line(10); }
  dot(0, 0, 105);
  x.beginPath(); x.moveTo(95, 0); x.lineTo(150, -40); x.lineTo(150, 40); x.closePath(); x.fillStyle = WH; x.fill();
  x.restore();
  eye(-40, -25, 17, t); eye(15, -30, 15, t, .5); x.beginPath(); x.arc(-55, 30, 14, 0, 7); line(6, BK);
  for (let i = 0; i < 6; i++) dot(-10 + (hash(i) - .5) * 120, 20 + hash(i + 9) * 50, 5, BK);
}
function stripes(t) { // gestreepte vis (eigen ontwerp)
  const wag = per(t, 40) * .2;
  x.save(); x.translate(110, 0); x.rotate(wag); x.beginPath(); x.moveTo(0, 0); x.lineTo(65, -50); x.quadraticCurveTo(50, 0, 65, 50); x.closePath(); x.fillStyle = WH; x.fill(); x.restore();
  ell(0, 0, 125, 80);
  x.beginPath(); x.moveTo(-30, -78); x.quadraticCurveTo(10, -125, 60, -70); x.fill();
  [[-55, 70], [5, 82], [65, 68]].forEach(([sx, h]) => { x.beginPath(); x.moveTo(sx - 10, -h); x.quadraticCurveTo(sx + 12, 0, sx - 10, h); x.quadraticCurveTo(sx + 30, 0, sx + 10, -h); x.fillStyle = BK; x.fill(); });
  eye(-85, -15, 14, t); smile(-100, 15, 14, 5);
}

function bg(t) {
  // opstijgende belletjes (periodiek: elke bel stijgt n keer per 240 s)
  for (let i = 0; i < 26; i++) {
    const n = 4 + (i % 4), k = ((t * n / L.P + hash(i)) % 1), bx = hash(i + 30) * 960 + Math.sin(TAU * (k * 3 + hash(i))) * 10;
    x.globalAlpha = .55 * Math.sin(Math.PI * k); x.beginPath(); x.arc(bx, 540 - k * 600, 3 + hash(i + 60) * 7, 0, 7); line(2.5); }
  x.globalAlpha = 1;
  // zeebodem met zeewier
  x.beginPath(); x.moveTo(0, 540); for (let i = 0; i <= 960; i += 16) x.lineTo(i, 492 + Math.sin(i * .012) * 8); x.lineTo(960, 540); x.fillStyle = WH; x.fill();
  for (let i = 0; i < 40; i++) dot(hash(i + 90) * 960, 510 + hash(i + 120) * 25, 2.5, BK);
  [[60, 1], [130, .8], [830, 1.1], [900, .75], [780, .6]].forEach(([sx, s], j) => { for (let q = 0; q < 2; q++) { x.beginPath(); x.moveTo(sx + q * 16, 495);
    for (let k = 1; k <= 8; k++) x.lineTo(sx + q * 16 + Math.sin(k * .6 + TAU * 8 * t / L.P + j + q) * 9 * (k / 8), 495 - k * 17 * s); line(8); } });
}
function moon(t) { dot(0, 0, 110); dot(45, -30, 95, BK); for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + per(t, 2) * .2; dot(Math.cos(a) * 170, Math.sin(a) * 120, 5 + (i % 2) * 3); } }

L.scene({
  seed: 31,
  figs: [[whale, .95, 'swimL'], [jelly, .95, 'float'], [t => { x.scale(-1, 1); turtle(t); }, .95, 'swimR'], [octopus, .9, 'sway'], [seahorse, .95, 'float'],
         [crab, .9, 'floor'], [starfish, .9, 'sway'], [dolphin, .95, 'swimL'], [puffer, .85, 'sway'], [stripes, .9, 'swimR']],
  bg, end: moon,
});
