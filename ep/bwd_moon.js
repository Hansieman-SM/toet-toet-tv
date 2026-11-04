// Daily B&W sensory #3: Moon and Stars – white night-sky friends on black: smiling full moon, star, comet, ringed planet, rocket,
// owl on a branch, sleepy cloud, sleepy sun, heart constellation, paper lantern. Background: twinkling star field, a slow shooting star,
// soft white hills with little round trees. All figures are new drawings for this video (own design). Figures look LEFT.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;

const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
function starPath(cx, cy, R, r, n = 5, rot = -Math.PI / 2) {
  x.beginPath();
  for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, rr = i % 2 ? r : R; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
  x.closePath();
}
function zzz(t, ox, oy, s = 1) {
  for (let i = 0; i < 3; i++) { const k = ((t * .25 + i / 3) % 1); x.save(); x.globalAlpha *= Math.sin(Math.PI * k); x.translate(ox + k * 60 * s, oy - k * 70 * s); x.scale((.6 + k * .5) * s, (.6 + k * .5) * s);
    x.beginPath(); x.moveTo(-12, -12); x.lineTo(12, -12); x.lineTo(-12, 12); x.lineTo(12, 12); line(6); x.restore(); }
}

function fullMoon(t) {
  dot(0, 0, 120);
  [[62, -62, 16], [84, 18, 11], [48, 72, 14], [-62, 78, 9]].forEach(([a, b, r]) => { x.beginPath(); x.arc(a, b, r, 0, 7); line(5, BK); });
  eye(-45, -15, 13, t); eye(10, -18, 12, t, .4);
  smile(-18, 25, 26, 7);
  // tiny sparkle-stars circling the moon
  for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + TAU * 3 * t / L.P; const r = 4 + 3 * (.5 + .5 * per(t + i * 40, 12)); starPath(Math.cos(a) * 165, Math.sin(a) * 140, r * 2.2, r, 4, 0); x.fillStyle = WH; x.fill(); }
}
function bigStar(t) {
  const pulse = 1 + per(t, 20) * .04;
  x.save(); x.scale(pulse, pulse);
  starPath(0, 8, 130, 62); x.fillStyle = WH; x.fill(); x.lineJoin = 'round'; x.lineWidth = 26; x.strokeStyle = WH; x.stroke();
  eye(-28, -2, 12, t); eye(22, -4, 11, t, .5);
  smile(-4, 30, 20, 6);
  x.restore();
  // twinkle ticks
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + .2, k = .5 + .5 * per(t + i * 30, 30); x.save(); x.globalAlpha *= k;
    x.beginPath(); x.moveTo(Math.cos(a) * 170, Math.sin(a) * 165); x.lineTo(Math.cos(a) * 195, Math.sin(a) * 188); line(6); x.restore(); }
}
function comet(t) {
  // tail streams to the right (comet flies left)
  for (let i = 0; i < 3; i++) {
    const w = per(t + i * 20, 24) * 10;
    x.beginPath(); x.moveTo(-20, -40 + i * 40); x.quadraticCurveTo(80, -50 + i * 45 + w, 230 - i * 20, -30 + i * 40 + w * 1.5); line(26 - i * 6);
  }
  for (let i = 0; i < 6; i++) { const k = ((t * .3 + i / 6) % 1); x.save(); x.globalAlpha *= 1 - k; starPath(60 + k * 200, -50 + hash(i) * 110, 12, 5, 4, 0); x.fillStyle = WH; x.fill(); x.restore(); }
  dot(-60, 0, 66);
  eye(-85, -10, 11, t); eye(-45, -12, 10, t, .3); smile(-68, 18, 16, 6);
}
function planet(t) {
  const tilt = -.25 + per(t, 8) * .04;
  // back half of the ring
  x.save(); x.rotate(tilt); x.beginPath(); x.ellipse(0, 0, 170, 42, 0, Math.PI, TAU); line(14); x.restore();
  dot(0, 0, 92);
  x.save(); x.beginPath(); x.arc(0, 0, 92, 0, 7); x.clip();
  [[-55, 10], [55, 12]].forEach(([b, h]) => { x.save(); x.rotate(tilt); x.fillStyle = BK; x.fillRect(-100, b - h / 2, 200, h); x.restore(); });
  x.restore();
  eye(-32, -10, 12, t); eye(22, -12, 11, t, .2); smile(-6, 18, 18, 6);
  // front half of the ring (with a black edge so it reads in front of the planet)
  x.save(); x.rotate(tilt); x.beginPath(); x.ellipse(0, 0, 170, 42, 0, 0, Math.PI); line(22, BK); x.beginPath(); x.ellipse(0, 0, 170, 42, 0, 0, Math.PI); line(14); x.restore();
  // little moon orbiting
  const a = TAU * 4 * t / L.P; const mx = Math.cos(a) * 200, my = Math.sin(a) * 60 - 100;
  dot(mx, my, 16);
}
function rocket(t) {
  // body horizontal, nose to the left
  x.beginPath(); x.moveTo(-170, 0); x.quadraticCurveTo(-120, -62, -40, -62); x.lineTo(90, -62); x.lineTo(90, 62); x.lineTo(-40, 62); x.quadraticCurveTo(-120, 62, -170, 0); x.closePath(); x.fillStyle = WH; x.fill();
  // fins
  x.beginPath(); x.moveTo(40, -62); x.lineTo(120, -125); x.lineTo(110, -62); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(40, 62); x.lineTo(120, 125); x.lineTo(110, 62); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(-95, -55); x.lineTo(-95, 55); line(7, BK);
  // round window with a happy face looking out
  dot(-20, 0, 38, BK); dot(-20, 0, 29); eye(-32, -4, 6, t); eye(-10, -4, 6, t, .3); smile(-21, 6, 9, 3);
  [[40, -30], [40, 30]].forEach(([a, b]) => dot(a, b, 7, BK));
  // nozzle + flickering puffs
  x.fillStyle = WH; x.fillRect(90, -34, 26, 68);
  for (let i = 0; i < 4; i++) { const k = ((t * .9 + i / 4) % 1); x.save(); x.globalAlpha *= 1 - k; dot(135 + k * 110, per(t + i * 13, 60) * 12, 26 - k * 12); x.restore(); }
}
function owl(t) {
  // branch
  x.beginPath(); x.moveTo(-170, 135); x.quadraticCurveTo(0, 120, 170, 140); line(16);
  x.beginPath(); x.moveTo(110, 135); x.quadraticCurveTo(140, 110, 165, 112); line(8);
  ell(150, 106, 18, 9, WH, -.4);
  ell(0, 30, 95, 112);
  // ear tufts
  x.beginPath(); x.moveTo(-70, -55); x.lineTo(-85, -110); x.lineTo(-35, -75); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(70, -55); x.lineTo(85, -110); x.lineTo(35, -75); x.closePath(); x.fill();
  // face discs + big eyes
  const look = per(t, 10) * 6;
  [-38, 38].forEach((ex, i) => { dot(ex, -20, 38, BK); dot(ex, -20, 30); eye(ex + look, -20, 17, t, i * .15); });
  x.beginPath(); x.moveTo(-12, 8); x.lineTo(12, 8); x.lineTo(0, 30); x.closePath(); x.fillStyle = BK; x.fill();
  // belly chevrons
  for (let r = 0; r < 3; r++) for (let c = -1; c <= 1; c++) { const cx = c * 30 + (r % 2) * 15 - 7, cy = 60 + r * 24; x.beginPath(); x.moveTo(cx - 9, cy - 5); x.lineTo(cx, cy + 4); x.lineTo(cx + 9, cy - 5); line(4, BK); }
  // wings
  x.save(); x.translate(-88, 40); x.rotate(.15 + per(t, 18) * .05); x.beginPath(); x.ellipse(0, 0, 22, 60, 0, 0, 7); line(5, BK); x.restore();
  x.save(); x.translate(88, 40); x.rotate(-.15 - per(t, 18) * .05); x.beginPath(); x.ellipse(0, 0, 22, 60, 0, 0, 7); line(5, BK); x.restore();
  // feet on branch
  [-30, 30].forEach(fx => { for (const d of [-8, 0, 8]) { x.beginPath(); x.moveTo(fx, 132); x.lineTo(fx + d, 146); line(5, BK); x.beginPath(); x.moveTo(fx, 128); x.lineTo(fx + d * 1.2, 138); line(5); } });
}
function sleepyCloud(t) {
  const puffs = [[-100, 20, 60], [-40, -30, 75], [40, -40, 80], [105, 10, 62], [0, 30, 80]];
  puffs.forEach(([a, b, r]) => dot(a, b + per(t, 12) * 3, r));
  x.fillStyle = WH; x.beginPath(); x.roundRect(-158, 22, 324, 70, 35); x.fill();
  sleepyEye(-40, 0, 13, 6); sleepyEye(20, -2, 12, 6);
  x.beginPath(); x.arc(-10, 32, 9, 0, 7); line(5, BK);   // little "oh" of a yawn
  zzz(t, 90, -100, 1.1);
  // a few soft drops below
  for (let i = 0; i < 3; i++) { const k = ((t * .4 + i / 3) % 1); x.save(); x.globalAlpha *= Math.sin(Math.PI * k); const dx = -60 + i * 60, dy = 120 + k * 60;
    x.beginPath(); x.moveTo(dx, dy - 14); x.quadraticCurveTo(dx + 9, dy, dx, dy + 6); x.quadraticCurveTo(dx - 9, dy, dx, dy - 14); x.fillStyle = WH; x.fill(); x.restore(); }
}
function sleepySun(t) {
  const rot = TAU * 2 * t / L.P;
  for (let i = 0; i < 12; i++) { const a = rot + i / 12 * TAU, l = i % 2 ? 150 : 165; x.beginPath(); x.moveTo(Math.cos(a) * 112, Math.sin(a) * 112); x.lineTo(Math.cos(a) * l, Math.sin(a) * l); line(i % 2 ? 10 : 16); }
  dot(0, 0, 95);
  // nightcap
  x.beginPath(); x.moveTo(-85, -45); x.quadraticCurveTo(-10, -170, 100, -120); x.quadraticCurveTo(60, -80, 85, -45); x.closePath(); x.fillStyle = BK; x.fill();
  x.beginPath(); x.moveTo(-80, -45); x.quadraticCurveTo(-10, -150, 92, -118); x.quadraticCurveTo(58, -80, 80, -45); x.closePath(); x.fillStyle = WH; x.fill();
  [[-40, -95], [10, -110], [50, -95], [-10, -70]].forEach(([a, b]) => dot(a, b, 9, BK));
  dot(105, -122, 18); x.beginPath(); x.moveTo(-88, -42); x.quadraticCurveTo(0, -60, 88, -42); line(14, BK);
  sleepyEye(-35, -5, 13, 6); sleepyEye(30, -5, 13, 6);
  x.beginPath(); x.ellipse(-2, 40, 14, 10 + per(t, 12) * 4, 0, 0, 7); x.fillStyle = BK; x.fill();
}
const HEART = [[0, -40], [-55, -95], [-120, -70], [-130, 0], [-70, 70], [0, 120], [70, 70], [130, 0], [120, -70], [55, -95]];
function constellation(t) {
  const n = HEART.length, k = (t * 10 / L.P) % 1;   // the line draws itself around the heart, 10 times per period
  x.save(); x.setLineDash([2, 14]); x.beginPath(); HEART.forEach((p, i) => i ? x.lineTo(...p) : x.moveTo(...p)); x.closePath(); line(5); x.restore();
  const seg = k * n, i0 = Math.floor(seg);
  x.beginPath(); x.moveTo(...HEART[0]);
  for (let i = 1; i <= i0; i++) x.lineTo(...HEART[i % n]);
  const a = HEART[i0 % n], b = HEART[(i0 + 1) % n], f = seg - i0; x.lineTo(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f); line(6);
  HEART.forEach(([px, py], i) => { const r = 11 + 4 * (.5 + .5 * per(t + i * 24, 24)); starPath(px, py, r * 1.6, r * .7, 4, 0); x.fillStyle = WH; x.fill(); dot(px, py, r * .45, BK); dot(px, py, r * .25); });
  // tiny face in the heart's middle star
  dot(0, 30, 26); eye(-9, 26, 5, t); eye(9, 26, 5, t, .3); smile(0, 33, 7, 3);
}
function lantern(t) {
  const sw = per(t, 12) * .08;
  x.save(); x.rotate(sw);
  x.beginPath(); x.moveTo(0, -170); x.lineTo(0, -120); line(5);
  x.fillStyle = WH; x.fillRect(-45, -122, 90, 22); x.fillRect(-45, 100, 90, 22);
  ell(0, 0, 110, 108);
  for (let i = -3; i <= 3; i++) { x.beginPath(); x.ellipse(0, 0, Math.abs(i) * 33 + 2, 106, 0, 0, 7); if (i) line(4, BK); }
  [-60, 0, 60].forEach(b => { x.beginPath(); x.moveTo(-Math.sqrt(Math.max(0, 1 - (b / 108) ** 2)) * 110, b); x.lineTo(Math.sqrt(Math.max(0, 1 - (b / 108) ** 2)) * 110, b); line(4, BK); });
  // tassel
  for (let i = -2; i <= 2; i++) { x.beginPath(); x.moveTo(i * 5, 122); x.lineTo(i * 8, 175 + per(t + i * 10, 24) * 4); line(5); }
  x.restore();
  // glow dashes
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, k = .4 + .6 * (.5 + .5 * per(t + i * 24, 15)); x.save(); x.globalAlpha *= k;
    x.beginPath(); x.moveTo(Math.cos(a) * 140, Math.sin(a) * 136); x.lineTo(Math.cos(a) * 160, Math.sin(a) * 156); line(5); x.restore(); }
}

function bg(t) {
  // star field (periodic twinkle)
  for (let i = 0; i < 60; i++) { const a = .3 + .45 * (.5 + .5 * per(t + hash(i) * 240, 4 + (i % 6))); x.globalAlpha = a;
    const sx = hash(i + 11) * 960, sy = 14 + hash(i + 70) * 380, r = 1.2 + hash(i + 5) * 2.2; dot(sx, sy, r);
    if (i % 7 === 0) { x.beginPath(); x.moveTo(sx - r * 3.4, sy); x.lineTo(sx + r * 3.4, sy); x.moveTo(sx, sy - r * 3.4); x.lineTo(sx, sy + r * 3.4); line(1.5); } }
  x.globalAlpha = 1;
  // a slow shooting star, 3 per period (each visible ~6 s)
  const k = (t * 3 / L.P) % 1, s = k * 40 / 6;   // 40 s cycle, moves during the first 6 s
  if (s < 1) { const sx0 = 120 + (Math.floor(t * 3 / L.P) % 3) * 260, px = sx0 + s * 240, py = 40 + s * 90;
    x.save(); x.globalAlpha = Math.sin(Math.PI * s) * .8; const g = x.createLinearGradient(px - 90, py - 34, px, py); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, '#fff');
    x.strokeStyle = g; x.lineWidth = 4; x.lineCap = 'round'; x.beginPath(); x.moveTo(px - 90, py - 34); x.lineTo(px, py); x.stroke(); dot(px, py, 4); x.restore(); }
  // soft white hills with round little trees
  x.beginPath(); x.moveTo(0, 540); for (let i = 0; i <= 960; i += 12) x.lineTo(i, 492 + Math.sin(i * .008 + .6) * 12 + Math.sin(i * .021) * 5); x.lineTo(960, 540); x.fillStyle = WH; x.fill();
  [[70, 1], [140, .7], [840, .9], [905, .6]].forEach(([tx, s]) => { const gy = 492 + Math.sin(tx * .008 + .6) * 12 + Math.sin(tx * .021) * 5;
    x.beginPath(); x.moveTo(tx, gy + 4); x.lineTo(tx, gy - 30 * s); line(7 * s + 2); dot(tx, gy - 44 * s, 22 * s); dot(tx - 12 * s, gy - 30 * s, 12 * s); dot(tx + 12 * s, gy - 34 * s, 13 * s); });
  for (let i = 0; i < 26; i++) dot(hash(i + 400) * 960, 512 + hash(i + 430) * 22, 2.4, BK);
}
// outro: a sleeping star in a crescent-moon hammock
function sleepyEnd(t) {
  x.save(); x.beginPath(); x.arc(0, 40, 150, 0, 7); x.clip();
  x.beginPath(); x.arc(0, 40, 150, 0, 7); x.arc(0, -20, 140, 0, 7); x.fillStyle = WH; x.fill('evenodd'); x.restore();
  x.save(); x.translate(0, 40 + per(t, 12) * 4); x.rotate(.2);
  starPath(0, 0, 70, 34); x.fillStyle = WH; x.fill(); x.lineJoin = 'round'; x.lineWidth = 14; x.strokeStyle = WH; x.stroke();
  sleepyEye(-16, -2, 8, 4); sleepyEye(14, -4, 8, 4); smile(-2, 14, 9, 4);
  x.restore();
  zzz(t, 70, -20, 1);
}

L.scene({
  seed: 83,
  figs: [[fullMoon, .95, 'sway'], [bigStar, .9, 'float'], [comet, .9, 'fly'], [planet, .9, 'sway'], [rocket, .85, 'swimL'],
         [owl, .9, 'sway'], [sleepyCloud, .9, 'float'], [sleepySun, .85, 'float'], [constellation, .95, 'sway'], [lantern, .85, 'sway']],
  bg, end: sleepyEnd,
});
