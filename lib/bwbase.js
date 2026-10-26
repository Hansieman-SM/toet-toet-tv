// Basisfiguren uit de zwart-witdemo
const C = require('./common');
const { x, W, H, clamp, ease, lerp, hash } = C;
const WH = '#ffffff', BK = '#000000';

function rr(a, b, w, h, r) { C.rr(a, b, w, h, r); }
function dot(cx, cy, r, col) { x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fillStyle = col; x.fill(); }
function line(lw, col) { x.lineWidth = lw; x.strokeStyle = col; x.lineCap = 'round'; x.lineJoin = 'round'; x.stroke(); }
function star4(cx, cy, s, col) {
  x.beginPath();
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 - Math.PI / 2, r = i % 2 ? s * .28 : s; x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
  x.closePath(); x.fillStyle = col; x.fill();
}

// ---------- figuren (gecentreerd rond 0,0, ca. 240 hoog) ----------
function moon(t) {
  x.beginPath(); x.arc(0, 0, 110, 0, 7); x.fillStyle = WH; x.fill();
  x.beginPath(); x.arc(55, -35, 100, 0, 7); x.fillStyle = BK; x.fill();
  // slapend oogje en glimlach op de maansikkel
  x.beginPath(); x.arc(-58, -10, 14, .2, Math.PI - .2); line(6, BK);
  x.beginPath(); x.arc(-48, 38, 16, .3, Math.PI - .6); line(6, BK);
  [[120, -90, 22], [170, 20, 14], [95, 90, 18], [-150, -110, 12]].forEach(([sx, sy, s], i) => star4(sx, sy, s * (.8 + .25 * Math.sin(t * 1.5 + i * 2)), WH));
}
function toet(t) {
  const blink = t % 4.5 > 4.3;
  rr(-120, -110, 240, 200, 40); x.fillStyle = WH; x.fill();
  rr(-90, -85, 180, 85, 22); x.fillStyle = BK; x.fill();
  [-40, 40].forEach(ox => {
    if (blink) { x.beginPath(); x.moveTo(ox - 18, -42); x.lineTo(ox + 18, -42); line(7, WH); }
    else { dot(ox, -42, 22, WH); dot(ox + 4, -40, 11, BK); }
  });
  x.beginPath(); x.arc(0, 18, 42, .25, Math.PI - .25); line(10, BK);
  [-88, 88].forEach(ox => { dot(ox, 58, 17, BK); dot(ox, 58, 8, WH); });
  [-80, 80].forEach(ox => { rr(ox - 28, 98, 56, 44, 12); x.fillStyle = WH; x.fill(); });
  dot(108, -100, 34, WH); dot(108, -100, 28, BK);
  x.save(); x.translate(108, -100); x.scale(1.5, 1.5); x.fillStyle = WH;
  x.beginPath(); x.moveTo(3, -15); x.lineTo(-9, 3); x.lineTo(-1, 3); x.lineTo(-4, 15); x.lineTo(9, -4); x.lineTo(1, -4); x.lineTo(5, -15); x.closePath(); x.fill(); x.restore();
}
function fish(t) {
  const wag = Math.sin(t * 3) * .18;
  x.save(); x.translate(85, 0); x.rotate(wag);
  x.beginPath(); x.moveTo(0, 0); x.lineTo(70, -55); x.quadraticCurveTo(55, 0, 70, 55); x.closePath(); x.fillStyle = WH; x.fill(); x.restore();
  x.beginPath(); x.ellipse(0, 0, 110, 70, 0, 0, 7); x.fillStyle = WH; x.fill();
  [-10, 30].forEach(sx => { x.beginPath(); x.moveTo(sx, -62); x.quadraticCurveTo(sx - 22, 0, sx, 62); line(9, BK); });
  dot(-62, -14, 15, BK); dot(-58, -18, 5, WH);
  x.beginPath(); x.arc(-92, 14, 10, -.6, .9); line(5, BK);
  for (let i = 0; i < 3; i++) { const k = ((t * .35 + i / 3) % 1); x.globalAlpha *= 1; x.beginPath(); x.arc(-140 - k * 30, -40 - k * 140, 8 + i * 4, 0, 7); line(4, WH); }
}
function elephant(t) {
  const step = Math.sin(t * 2.2) * .12;
  [[-60, step], [-25, -step], [40, -step], [75, step]].forEach(([lx, a]) => { x.save(); x.translate(lx, 30); x.rotate(a); rr(-17, 0, 34, 80, 12); x.fillStyle = WH; x.fill(); x.restore(); });
  x.beginPath(); x.ellipse(10, 0, 115, 75, 0, 0, 7); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(122, -10); x.quadraticCurveTo(150, 10, 140, 45 + Math.sin(t * 2) * 5); line(7, WH);
  dot(-105, -40, 62, WH);
  // slurf
  x.beginPath(); x.moveTo(-150, -30); x.bezierCurveTo(-185, 10, -170, 70, -200 + Math.sin(t * 1.4) * 8, 95); line(30, WH);
  // oor
  x.beginPath(); x.ellipse(-80, -35, 34, 46, -.2, 0, 7); line(7, BK);
  dot(-130, -55, 9, BK); dot(-127, -58, 3, WH);
  x.beginPath(); x.arc(-120, -12, 12, .3, Math.PI - .6); line(5, BK);
}
function lion(t) {
  const n = 18;
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + Math.sin(t * .6) * .05; dot(Math.cos(a) * 112, Math.sin(a) * 112, 34, WH); }
  dot(0, 0, 112, WH);
  x.beginPath(); x.arc(0, 0, 96, 0, 7); line(9, BK);
  for (let i = 0; i < n; i++) { const a = (i + .5) / n * Math.PI * 2; x.beginPath(); x.moveTo(Math.cos(a) * 104, Math.sin(a) * 104); x.lineTo(Math.cos(a) * 128, Math.sin(a) * 128); line(6, BK); }
  const blink = t % 5 > 4.8;
  [-32, 32].forEach(ox => { if (blink) { x.beginPath(); x.moveTo(ox - 13, -12); x.lineTo(ox + 13, -12); line(7, BK); } else { dot(ox, -12, 13, BK); dot(ox + 4, -16, 4, WH); } });
  x.beginPath(); x.moveTo(-16, 18); x.lineTo(16, 18); x.lineTo(0, 34); x.closePath(); x.fillStyle = BK; x.fill();
  x.beginPath(); x.moveTo(0, 34); x.lineTo(0, 46); x.moveTo(0, 46); x.quadraticCurveTo(-14, 60, -26, 48); x.moveTo(0, 46); x.quadraticCurveTo(14, 60, 26, 48); line(6, BK);
  [[-1, 26], [1, 26]].forEach(([sd]) => [-6, 4].forEach(dy => { x.beginPath(); x.moveTo(sd * 40, 34 + dy); x.lineTo(sd * 70, 28 + dy * 2); line(4, BK); }));
}
function windmill(t) {
  x.beginPath(); x.moveTo(-45, 130); x.lineTo(45, 130); x.lineTo(26, -40); x.lineTo(-26, -40); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-34, -40); x.lineTo(34, -40); x.lineTo(0, -82); x.closePath(); x.fill();
  rr(-14, 88, 28, 42, 12); x.fillStyle = BK; x.fill();
  dot(0, 30, 12, BK);
  x.save(); x.translate(0, -50); x.rotate(t * .35);
  for (let i = 0; i < 4; i++) {
    x.rotate(Math.PI / 2);
    x.fillStyle = WH; x.fillRect(-5, 10, 10, 150);
    x.beginPath(); x.rect(6, 40, 36, 118); line(6, WH);
    for (let k = 1; k < 4; k++) { x.beginPath(); x.moveTo(6, 40 + k * 29.5); x.lineTo(42, 40 + k * 29.5); line(4, WH); }
  }
  dot(0, 0, 14, WH); dot(0, 0, 6, BK);
  x.restore();
}
function heart(t) {
  const draw = (s, col) => { x.save(); x.scale(s, s); x.beginPath(); x.moveTo(0, 50); x.bezierCurveTo(-120, -20, -70, -120, 0, -60); x.bezierCurveTo(70, -120, 120, -20, 0, 50); x.closePath(); x.fillStyle = col; x.fill(); x.restore(); };
  const p = 1 + Math.sin(t * 1.6) * .05;
  draw(1.55 * p, WH); draw(1.15 * p, BK); draw(.8 * p, WH);
}

module.exports = { moon, toet, fish, elephant, lion, windmill, heart, star4, dot };
