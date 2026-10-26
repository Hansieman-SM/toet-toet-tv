// Extra zwart-wit figuren (gecentreerd rond 0,0, ca. 240 hoog). Wit op zwart.
const C = require('./common');
const { x } = C;
const WH = '#ffffff', BK = '#000000';
const dot = (cx, cy, r, col) => { x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fillStyle = col; x.fill(); };
const ell = (cx, cy, rx, ry, col, rot = 0) => { x.beginPath(); x.ellipse(cx, cy, rx, ry, rot, 0, 7); x.fillStyle = col; x.fill(); };
const line = (lw, col) => { x.lineWidth = lw; x.strokeStyle = col; x.lineCap = 'round'; x.lineJoin = 'round'; x.stroke(); };
const eye = (cx, cy, r, blink) => { if (blink) { x.beginPath(); x.moveTo(cx - r, cy); x.lineTo(cx + r, cy); line(r * .55, BK); } else { dot(cx, cy, r, BK); dot(cx + r * .3, cy - r * .3, r * .32, WH); } };
const smile = (cx, cy, r, lw = 6) => { x.beginPath(); x.arc(cx, cy, r, .3, Math.PI - .3); line(lw, BK); };
const sleepy = (cx, cy, r, lw = 6) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const blinkAt = (t, p = 4.7) => t % p > p - .18;

function cow(t) {
  [-1, 1].forEach(s => { x.beginPath(); x.moveTo(s * 60, -95); x.quadraticCurveTo(s * 105, -120, s * 100, -150); x.quadraticCurveTo(s * 85, -115, s * 50, -80); x.closePath(); x.fillStyle = WH; x.fill(); });
  [-1, 1].forEach(s => { ell(s * 125, -55, 42, 22, WH, s * .35); ell(s * 125, -55, 24, 10, BK, s * .35); });
  x.beginPath(); x.moveTo(-95, -70); x.quadraticCurveTo(-100, -125, 0, -125); x.quadraticCurveTo(100, -125, 95, -70); x.lineTo(80, 60); x.lineTo(-80, 60); x.closePath(); x.fillStyle = WH; x.fill();
  ell(-48, -85, 32, 24, BK, -.3); ell(60, -30, 22, 30, BK, .2);
  ell(0, 75, 98, 62, WH); x.beginPath(); x.ellipse(0, 75, 98, 62, 0, 0, 7); line(7, BK);
  ell(-35, 78, 13, 18, BK); ell(35, 78, 13, 18, BK);
  const b = blinkAt(t); eye(-40, -30, 14, b); eye(40, -30, 14, b);
}
function owl(t) {
  ell(0, 10, 110, 125, WH);
  [-1, 1].forEach(s => { x.beginPath(); x.moveTo(s * 50, -100); x.lineTo(s * 95, -150); x.lineTo(s * 100, -80); x.closePath(); x.fillStyle = WH; x.fill(); });
  const b = blinkAt(t, 5.3);
  [-46, 46].forEach(ox => { dot(ox, -35, 40, BK); dot(ox, -35, 30, WH); if (b) { x.beginPath(); x.moveTo(ox - 20, -35); x.lineTo(ox + 20, -35); line(8, BK); } else { dot(ox, -35, 17, BK); dot(ox + 5, -40, 6, WH); } });
  x.beginPath(); x.moveTo(-14, 0); x.lineTo(14, 0); x.lineTo(0, 24); x.closePath(); x.fillStyle = BK; x.fill();
  [-1, 1].forEach(s => { x.beginPath(); x.moveTo(s * 100, 0); x.quadraticCurveTo(s * 80, 80, s * 40, 120); line(7, BK); });
  for (let r = 0; r < 2; r++) for (let i = -1; i <= 1; i++) { x.beginPath(); x.arc(i * 26 + (r ? 13 : 0) - (r ? 13 : 0) / 1, 60 + r * 26, 11, .2, Math.PI - .2); line(5, BK); }
  [-28, 28].forEach(ox => { x.beginPath(); x.moveTo(ox - 14, 132); x.lineTo(ox + 14, 132); line(10, WH); });
}
function duck(t) {
  const bob = Math.sin(t * 1.5) * 4;
  x.save(); x.translate(0, bob);
  ell(20, 20, 120, 68, WH);
  x.beginPath(); x.moveTo(120, 0); x.quadraticCurveTo(165, -20, 150, 30); x.closePath(); x.fillStyle = WH; x.fill();
  dot(-75, -60, 55, WH);
  x.beginPath(); x.moveTo(-122, -60); x.quadraticCurveTo(-175, -55, -170, -40); x.quadraticCurveTo(-150, -32, -118, -40); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-122, -60); x.quadraticCurveTo(-175, -55, -170, -40); x.quadraticCurveTo(-150, -32, -118, -40); line(5, BK);
  x.beginPath(); x.moveTo(-168, -47); x.lineTo(-125, -48); line(4, BK);
  eye(-88, -78, 10, blinkAt(t));
  x.beginPath(); x.moveTo(-20, 0); x.quadraticCurveTo(40, -20, 95, 10); x.quadraticCurveTo(40, 45, -20, 0); line(7, BK);
  x.restore();
  for (let i = 0; i < 3; i++) { const ox = (i - 1) * 90 + Math.sin(t + i) * 8; x.beginPath(); x.moveTo(ox - 40, 115); x.quadraticCurveTo(ox - 20, 102, ox, 115); x.quadraticCurveTo(ox + 20, 128, ox + 40, 115); line(6, WH); }
}
function sheep(t) {
  [[-55, 60], [-20, 65], [30, 65], [65, 60]].forEach(([lx, ly]) => { x.beginPath(); x.moveTo(lx, ly); x.lineTo(lx, ly + 60); line(14, WH); });
  const puffs = [[-80, -10, 45], [-40, -45, 50], [15, -50, 52], [70, -25, 48], [90, 25, 42], [45, 55, 45], [-10, 55, 48], [-65, 40, 45], [0, 5, 60]];
  x.beginPath(); puffs.forEach(([a, b, r]) => { x.moveTo(a + r, b); x.arc(a, b, r, 0, 7); }); x.fillStyle = WH; x.fill();
  x.save(); x.translate(-110, -5);
  ell(0, 0, 40, 50, BK); x.beginPath(); x.ellipse(0, 0, 40, 50, 0, 0, 7); line(7, WH);
  [-1, 1].forEach(s => { ell(s * 48, -20, 22, 10, WH, s * .5); });
  const b = blinkAt(t, 5.1); [-15, 15].forEach(ox => { if (b) { x.beginPath(); x.moveTo(ox - 7, -10); x.lineTo(ox + 7, -10); line(5, WH); } else { dot(ox, -10, 8, WH); dot(ox + 2, -9, 3.5, BK); } });
  x.beginPath(); x.arc(0, 18, 12, .3, Math.PI - .3); line(5, WH);
  x.restore();
}
function butterfly(t) {
  const f = .75 + .25 * Math.abs(Math.cos(t * 2.2));
  x.save(); x.scale(f, 1);
  [-1, 1].forEach(s => {
    ell(s * 70, -50, 72, 60, WH, s * -.4); ell(s * 55, 55, 50, 44, WH, s * .4);
    dot(s * 78, -55, 24, BK); dot(s * 78, -55, 10, WH); dot(s * 55, 58, 15, BK);
  });
  x.restore();
  ell(0, 5, 14, 85, WH); x.beginPath(); x.ellipse(0, 5, 14, 85, 0, 0, 7); line(5, BK);
  dot(0, -92, 20, WH);
  [-1, 1].forEach(s => { x.beginPath(); x.moveTo(s * 8, -108); x.quadraticCurveTo(s * 20, -150, s * 42, -158); line(5, WH); dot(s * 44, -158, 8, WH); });
}
function bigStar(t) {
  const st = (r1, r2, col) => { x.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 - Math.PI / 2, r = i % 2 ? r2 : r1; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fillStyle = col; x.fill(); };
  x.save(); x.rotate(Math.sin(t * .4) * .08); x.lineJoin = 'round';
  st(140, 62, WH);
  sleepy(-26, 0, 12, 6); sleepy(26, 0, 12, 6); smile(0, 22, 18, 6);
  x.restore();
}
function cloud(t) {
  const puffs = [[-100, 20, 55], [-50, -30, 70], [30, -45, 80], [100, 0, 60], [60, 40, 55], [-30, 40, 60]];
  x.beginPath(); puffs.forEach(([a, b, r]) => { x.moveTo(a + r, b); x.arc(a, b, r, 0, 7); }); x.fillStyle = WH; x.fill();
  sleepy(-35, 0, 14, 7); sleepy(35, 0, 14, 7); smile(0, 22, 20, 7);
  for (let i = 0; i < 3; i++) { const k = (t * .5 + i / 3) % 1, dx = (i - 1) * 60; x.globalAlpha *= 1; x.beginPath(); x.moveTo(dx, 110 + k * 50); x.lineTo(dx, 130 + k * 50); line(8, WH); }
}
function giraffe(t) {
  const spots = [[-40, 30, 16], [5, 45, 18], [45, 20, 14], [-10, 10, 12], [-62, -40, 10], [-80, -95, 10], [-55, -75, 8]];
  [[-50], [-20], [40], [70]].forEach(([lx]) => { x.beginPath(); x.moveTo(lx, 60); x.lineTo(lx, 150); line(16, WH); });
  ell(10, 30, 95, 50, WH);
  x.beginPath(); x.moveTo(-60, 10); x.lineTo(-100, -130); x.lineTo(-60, -135); x.lineTo(-25, 0); x.closePath(); x.fillStyle = WH; x.fill();
  x.save(); x.translate(-95, -150); x.rotate(-.2);
  ell(-20, 0, 50, 28, WH);
  [-10, 12].forEach(ox => { x.beginPath(); x.moveTo(ox, -20); x.lineTo(ox, -50); line(7, WH); dot(ox, -52, 8, WH); });
  ell(25, -18, 18, 8, WH, -.5);
  eye(-5, -6, 7, blinkAt(t));
  dot(-55, 4, 4, BK);
  x.restore();
  spots.forEach(([a, b, r]) => dot(a, b, r, BK));
  x.beginPath(); x.moveTo(105, 20); x.quadraticCurveTo(125, 50, 118, 85); line(5, WH);
}
function rabbit(t) {
  const wig = Math.sin(t * 1.2) * .08;
  [-1, 1].forEach(s => { x.save(); x.translate(s * 35, -60); x.rotate(s * (.15 + wig)); ell(0, -75, 26, 80, WH); ell(0, -70, 12, 58, BK); x.restore(); });
  ell(0, 20, 100, 90, WH);
  const b = blinkAt(t); eye(-36, 0, 13, b); eye(36, 0, 13, b);
  x.beginPath(); x.moveTo(-12, 28); x.lineTo(12, 28); x.lineTo(0, 40); x.closePath(); x.fillStyle = BK; x.fill();
  x.beginPath(); x.moveTo(0, 40); x.quadraticCurveTo(-12, 56, -24, 46); x.moveTo(0, 40); x.quadraticCurveTo(12, 56, 24, 46); line(5, BK);
  [-1, 1].forEach(s => [-6, 6].forEach(dy => { x.beginPath(); x.moveTo(s * 35, 38 + dy); x.lineTo(s * 85, 32 + dy * 2.5); line(4, BK); }));
}
function sun(t) {
  x.save(); x.rotate(t * .15);
  for (let i = 0; i < 12; i++) { x.rotate(Math.PI / 6); x.beginPath(); x.moveTo(-14, -105); x.lineTo(0, -150); x.lineTo(14, -105); x.closePath(); x.fillStyle = WH; x.fill(); }
  x.restore();
  dot(0, 0, 95, WH);
  const b = blinkAt(t, 4.4); eye(-32, -15, 12, b); eye(32, -15, 12, b);
  smile(0, 10, 34, 8);
}
function snail(t) {
  x.beginPath(); x.moveTo(-150, 70); x.quadraticCurveTo(-160, 20, -125, 15); x.lineTo(90, 30); x.quadraticCurveTo(130, 45, 120, 70); x.closePath(); x.fillStyle = WH; x.fill();
  dot(20, -40, 95, WH);
  x.beginPath(); for (let a = 0; a < Math.PI * 5; a += .1) { const r = 80 - a * 4.8; x.lineTo(20 + Math.cos(a) * r, -40 + Math.sin(a) * r); } line(8, BK);
  [-1, 1].forEach((s, i) => { x.beginPath(); x.moveTo(-135, 20); x.quadraticCurveTo(-150 + s * 10, -20, -160 + s * 18, -50 + Math.sin(t * 1.3 + i) * 5); line(7, WH); dot(-160 + s * 18, -52 + Math.sin(t * 1.3 + i) * 5, 11, WH); dot(-160 + s * 18, -52 + Math.sin(t * 1.3 + i) * 5, 5, BK); });
  smile(-130, 40, 12, 5);
}
function bird(t) {
  x.save(); x.translate(0, Math.sin(t * 1.8) * 5);
  dot(0, 0, 100, WH);
  x.beginPath(); x.moveTo(90, -20); x.lineTo(160, -55); x.lineTo(150, 0); x.lineTo(160, 45); x.lineTo(90, 30); x.closePath(); x.fillStyle = WH; x.fill();
  const w = Math.sin(t * 2) * .12;
  x.save(); x.translate(20, 10); x.rotate(w); x.beginPath(); x.moveTo(-50, 0); x.quadraticCurveTo(10, -50, 60, 10); x.quadraticCurveTo(0, 50, -50, 0); x.fillStyle = BK; x.fill(); x.restore();
  eye(-50, -30, 12, blinkAt(t));
  x.beginPath(); x.moveTo(-95, -10); x.lineTo(-140, 2); x.lineTo(-95, 14); x.closePath(); x.fillStyle = WH; x.fill(); x.beginPath(); x.moveTo(-95, -10); x.lineTo(-140, 2); x.lineTo(-95, 14); line(4, BK);
  [-20, 20].forEach(ox => { x.beginPath(); x.moveTo(ox, 98); x.lineTo(ox, 130); x.moveTo(ox - 12, 135); x.lineTo(ox + 12, 135); line(6, WH); });
  x.restore();
}
function bear(t) {
  [-1, 1].forEach(s => { dot(s * 80, -80, 42, WH); dot(s * 80, -80, 22, BK); });
  dot(0, 0, 115, WH);
  const b = blinkAt(t); eye(-40, -25, 13, b); eye(40, -25, 13, b);
  ell(0, 35, 48, 36, WH); x.beginPath(); x.ellipse(0, 35, 48, 36, 0, 0, 7); line(7, BK);
  ell(0, 18, 18, 12, BK);
  x.beginPath(); x.moveTo(0, 30); x.lineTo(0, 44); x.moveTo(0, 44); x.quadraticCurveTo(-14, 58, -26, 48); x.moveTo(0, 44); x.quadraticCurveTo(14, 58, 26, 48); line(5, BK);
}

module.exports = { cow, owl, duck, sheep, butterfly, bigStar, cloud, giraffe, rabbit, sun, snail, bird, bear };
