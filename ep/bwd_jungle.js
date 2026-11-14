// Daily B&W sensory #13: Jungle Night – white jungle friends on black: sloth hanging from a branch, toucan with a striped beak,
// tree frog with round toe pads (throat puffs), tiger cub with bold stripes, parrot with a long striped tail, chameleon with a curly tail
// and a turning eye, friendly snake looped over a branch, big leaf with holes and a happy face, monkey swinging on a vine, firefly whose
// tail glows in soft rings.
// Background: hanging vines with leaves from the top, twinkling stars, drifting firefly dots, ferns + grass tufts on the jungle floor.
// Outro: the sloth asleep hugging its branch under a crescent moon, z z z.
// All figures are new drawings for this video (own design, no existing characters). Figures look LEFT. Everything periodic in P = 240 s.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;

const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const branch = (x0, x1, y, w = 22) => { x.beginPath(); x.moveTo(x0, y); x.lineTo(x1, y); line(w); for (let i = 0; i < 5; i++) dot(x0 + (x1 - x0) * (i + .5) / 5, y + (i % 2 ? -3 : 3), 3, BK); };
const leaf = (cx, cy, rot, l = 40, col = WH) => { x.save(); x.translate(cx, cy); x.rotate(rot); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(l * .5, -l * .42, l, 0); x.quadraticCurveTo(l * .5, l * .42, 0, 0); x.fillStyle = col; x.fill(); x.restore(); };

function sloth(t) {
  // sloth hanging under a branch by its long arms, slowly swinging, sleepy happy face with eye patches
  branch(-170, 170, -120);
  const sw = per(t, 10) * .08;
  x.save(); x.translate(0, -120); x.rotate(sw);
  // arms + legs up to the branch
  [[-70, -1], [-30, -1], [30, 1], [70, 1]].forEach(([hx, s]) => { x.beginPath(); x.moveTo(hx * .7, 110); x.quadraticCurveTo(hx * 1.1, 50, hx, 0); line(26); [-8, 0, 8].forEach(k => { x.beginPath(); x.moveTo(hx + k, 4); x.lineTo(hx + k, -10); line(5); }); });
  ell(0, 130, 96, 62);
  for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(-50 + i * 20, 104); x.lineTo(-56 + i * 20, 150); line(3, BK); }
  // head
  ell(-70, 170, 54, 48);
  ell(-70, 176, 40, 32, BK); ell(-70, 178, 34, 26);
  [[-88, 172], [-52, 172]].forEach(([a, b]) => { ell(a, b, 14, 9, BK, -.3); eye(a, b, 6, t, a > -70 ? .4 : 0); });
  ell(-70, 186, 8, 5, BK); smile(-70, 192, 10, 4);
  x.restore();
}
function toucan(t) {
  // toucan perched on a branch, big striped beak, tail bobbing
  branch(-140, 160, 120);
  const bob = per(t, 18) * 6;
  x.save(); x.translate(110, 60); x.rotate(.5 + per(t, 12) * .08); x.beginPath(); x.roundRect(-14, 0, 28, 90, 12); x.fillStyle = WH; x.fill(); x.restore();
  ell(40, 30 + bob * .3, 66, 84);
  ell(28, 50 + bob * .3, 38, 54, BK); ell(28, 50 + bob * .3, 32, 48);
  x.save(); x.translate(0, bob);
  ell(-6, -54, 50, 46);
  // beak with stripes
  x.beginPath(); x.moveTo(-36, -76); x.quadraticCurveTo(-130, -86, -176, -44); x.quadraticCurveTo(-110, -30, -36, -36); x.closePath(); x.fillStyle = WH; x.fill();
  x.save(); x.clip(); [-80, -112, -144].forEach(sx => { x.fillStyle = BK; x.fillRect(sx, -100, 12, 80); }); x.restore();
  x.beginPath(); x.moveTo(-40, -56); x.quadraticCurveTo(-100, -54, -160, -46); line(4, BK);
  dot(-14, -66, 18, BK); dot(-14, -66, 14); eye(-14, -66, 9, t);
  x.restore();
  [[20, 116], [50, 116]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a, b - 10); x.lineTo(a, b); line(8); });
}
function frog(t) {
  // round tree frog on a leaf, toe pads, throat puffing, big eyes on top
  const puff = Math.max(0, per(t, 30)) * 16;
  leaf(-150, 110, 0, 300);
  ell(0, 40, 110, 70);
  [[-1], [1]].forEach(([s]) => { x.beginPath(); x.moveTo(s * 70, 80); x.quadraticCurveTo(s * 120, 100, s * 140, 120); line(18); dot(s * 140, 122, 12); dot(s * 124, 128, 10); });
  [[-1], [1]].forEach(([s]) => { x.beginPath(); x.moveTo(s * 40, 90); x.lineTo(s * 50, 120); line(16); dot(s * 50, 124, 11); dot(s * 34, 126, 9); });
  ell(0, 84, 34 + puff * .4, 10 + puff * .6, WH); x.beginPath(); x.ellipse(0, 84, 34 + puff * .4, 10 + puff * .6, 0, 0, 7); line(4, BK);
  [-50, 50].forEach((a, i) => { dot(a, -30, 40); dot(a, -30, 30, BK); dot(a, -30, 24); eye(a - 4, -30, 14, t, i * .4); });
  x.beginPath(); x.arc(0, 12, 40, .3, Math.PI - .3); line(6, BK);
  [[-70, 40], [70, 44], [84, 20]].forEach(([a, b]) => dot(a, b, 6, BK));
}
function tigerCub(t) {
  // tiger cub sitting, bold stripes, tail swishing
  const sw = per(t, 20) * .3;
  x.save(); x.translate(90, 100); x.rotate(-.8 + sw); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(50, -10, 60, -80); line(22);
  [20, 40, 56].forEach((k, i) => { x.beginPath(); x.moveTo(k - 12, -k * 1.1 + 6); x.lineTo(k + 12, -k * 1.1 - 2); line(6, BK); }); x.restore();
  ell(30, 70, 84, 70);
  x.save(); x.beginPath(); x.ellipse(30, 70, 84, 70, 0, 0, 7); x.clip();
  [[60, -20], [90, -10], [110, 10]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a, 0 + b); x.quadraticCurveTo(a + 10, 50, a - 10, 90); line(12, BK); });
  x.restore();
  [[-20, 140], [30, 140]].forEach(([a, b]) => ell(a, b, 26, 16));
  [-28, -20, -12, 22, 30, 38].forEach(a => { x.beginPath(); x.moveTo(a, 146); x.lineTo(a, 154); line(3, BK); });
  // head
  [[-1], [1]].forEach(([s]) => { dot(-30 + s * 52, -66, 24); dot(-30 + s * 52, -66, 12, BK); });
  ell(-30, -14, 78, 66);
  [[-90, -30], [-90, 0], [30, -30], [30, 0]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(a + (a < 0 ? 24 : -24), b + 4); line(9, BK); });
  [-46, -30, -14].forEach(a => { x.beginPath(); x.moveTo(a, -76); x.lineTo(a, -58); line(7, BK); });
  eye(-56, -22, 11, t); eye(-4, -22, 11, t, .4);
  ell(-30, 8, 12, 8, BK); x.beginPath(); x.moveTo(-30, 14); x.lineTo(-30, 22); x.moveTo(-44, 22); x.quadraticCurveTo(-30, 34, -16, 22); line(5, BK);
}
function parrot(t) {
  // parrot flying with flapping wings and a long striped tail
  const f = per(t, 60);
  x.save(); x.translate(60, 20); x.rotate(.15 + per(t, 20) * .05);
  x.beginPath(); x.moveTo(0, -18); x.lineTo(190, 6); x.lineTo(190, 26); x.lineTo(0, 18); x.closePath(); x.fillStyle = WH; x.fill();
  [50, 90, 130, 170].forEach(sx => { x.fillStyle = BK; x.fillRect(sx, -10 + sx * .12, 10, 24); });
  x.restore();
  // back wing
  x.save(); x.translate(10, -10); x.rotate(-.4 - f * .5); x.beginPath(); x.ellipse(40, -50, 40, 80, .6, 0, 7); x.fillStyle = WH; x.fill(); x.restore();
  ell(0, 0, 86, 52);
  // front wing with feather lines
  x.save(); x.translate(0, -16); x.rotate(-.2 - f * .6); x.beginPath(); x.ellipse(30, -60, 44, 90, .5, 0, 7); x.fillStyle = WH; x.fill();
  for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(10 + i * 14, -20); x.lineTo(34 + i * 14, -110 + i * 10); line(4, BK); } x.restore();
  ell(-84, -20, 44, 40);
  x.beginPath(); x.moveTo(-120, -32); x.quadraticCurveTo(-160, -24, -150, 6); x.quadraticCurveTo(-136, -6, -118, -8); x.closePath(); x.fillStyle = WH; x.fill(); x.beginPath(); x.moveTo(-122, -14); x.lineTo(-144, -6); line(4, BK);
  dot(-92, -30, 15, BK); dot(-92, -30, 11); eye(-92, -30, 7, t);
  [-110, -96, -82].forEach((a, i) => dot(a + 4, -54 - i * 2, 4, BK));
}
function chameleon(t) {
  // chameleon walking along a branch, curly tail, turning eye cone, tongue flicks out now and then
  branch(-180, 180, 70);
  const step = per(t, 40);
  x.beginPath(); for (let a = 0; a < TAU * 1.6; a += .1) { const r = 46 - a * 4.4; x.lineTo(110 + Math.cos(a + Math.PI) * r * -1 + 6, 40 + Math.sin(a + Math.PI) * r); } line(18);
  x.beginPath(); x.moveTo(50, 0); x.quadraticCurveTo(100, 0, 150, 40); line(30);
  [[-60, -1], [40, 1]].forEach(([lx, s], i) => { const k = (i ? -1 : 1) * step * 10; x.beginPath(); x.moveTo(lx, 20); x.lineTo(lx + k, 50); x.lineTo(lx + k - 8, 66); line(14); });
  x.beginPath(); x.moveTo(-90, 10); x.quadraticCurveTo(-60, -80, 30, -60); x.quadraticCurveTo(80, -50, 80, 10); x.quadraticCurveTo(0, 50, -90, 10); x.closePath(); x.fillStyle = WH; x.fill();
  // ridge + dots
  for (let i = 0; i < 6; i++) dot(-60 + i * 24, -54 + Math.abs(i - 2.5) * 5, 6, BK);
  for (let i = 0; i < 5; i++) dot(-40 + i * 26, -10 + (i % 2) * 14, 5, BK);
  // head with crest
  x.beginPath(); x.moveTo(-90, 10); x.lineTo(-150, 0); x.quadraticCurveTo(-140, -50, -80, -60); x.closePath(); x.fillStyle = WH; x.fill();
  const ea = per(t, 16) * 1.2;
  dot(-110, -22, 22); dot(-110, -22, 15, BK); dot(-110 + Math.cos(ea) * 5, -22 + Math.sin(ea) * 5, 9); dot(-110 + Math.cos(ea) * 6, -22 + Math.sin(ea) * 6, 5, BK);
  x.beginPath(); x.moveTo(-146, 2); x.quadraticCurveTo(-120, 10, -96, 6); line(4, BK);
  const tg = Math.max(0, per(t, 20) - .8) * 5;
  if (tg > 0) { x.beginPath(); x.moveTo(-150, 0); x.lineTo(-150 - tg * 70, 6); line(6); dot(-150 - tg * 70, 6, 10); }
}
function snake(t) {
  // friendly snake looped over a branch, head swaying, diamond pattern, tongue
  branch(-180, 180, -20);
  const s = per(t, 14) * 14;
  x.beginPath(); x.moveTo(140, 120); x.bezierCurveTo(160, 40, 120, -40, 60, -40); x.bezierCurveTo(0, -40, 0, 10, -30, 40); x.quadraticCurveTo(-60, 80, -100 + s, 60); line(38);
  x.save(); x.setLineDash([2, 28]); x.beginPath(); x.moveTo(140, 120); x.bezierCurveTo(160, 40, 120, -40, 60, -40); x.bezierCurveTo(0, -40, 0, 10, -30, 40); x.quadraticCurveTo(-60, 80, -100 + s, 60); line(16, BK); x.restore();
  x.beginPath(); x.moveTo(140, 120); x.quadraticCurveTo(140, 150, 160, 160); line(18);
  x.save(); x.translate(-110 + s, 56); x.rotate(per(t, 14) * .15);
  ell(0, 0, 48, 34);
  eye(-14, -10, 10, t); eye(14, -12, 9, t, .3); smile(-6, 8, 14, 5);
  const tg = Math.max(0, per(t, 36));
  x.beginPath(); x.moveTo(-46, 6); x.lineTo(-46 - tg * 26, 8); x.lineTo(-54 - tg * 26, 0); x.moveTo(-46 - tg * 26, 8); x.lineTo(-54 - tg * 26, 16); line(4);
  x.restore();
}
function bigLeaf(t) {
  // big jungle leaf with holes and a happy face, nodding on its stem
  const n = per(t, 12) * .06;
  x.save(); x.rotate(n);
  x.beginPath(); x.moveTo(0, 170); x.lineTo(0, 60); line(14);
  x.beginPath(); x.moveTo(0, 90); x.bezierCurveTo(-170, 60, -160, -150, 0, -150); x.bezierCurveTo(160, -150, 170, 60, 0, 90); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(0, 80); x.lineTo(0, -140); line(7, BK);
  for (let i = 0; i < 4; i++) { const y = -100 + i * 44; [-1, 1].forEach(s => { x.beginPath(); x.moveTo(0, y + 10); x.quadraticCurveTo(s * 60, y, s * 110, y - 20 + i * 4); line(5, BK); }); }
  [[-90, -60], [96, -40], [-100, 20], [100, 40]].forEach(([a, b]) => ell(a, b, 14, 22, BK, a < 0 ? .5 : -.5));
  dot(0, -26, 48); eye(-18, -34, 10, t); eye(18, -34, 10, t, .5); smile(0, -16, 16, 5);
  x.restore();
}
function monkey(t) {
  // monkey swinging on a vine with one arm, tail curled, waving with the other hand
  const sw = per(t, 12) * .25;
  x.save(); x.translate(0, -230); x.rotate(sw);
  x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 150); line(10); leaf(0, 80, -.6, 36); leaf(0, 120, Math.PI + .6, 32);
  x.translate(0, 160);
  // tail
  x.beginPath(); x.moveTo(30, 120); x.bezierCurveTo(110, 130, 120, 60, 80, 60); x.quadraticCurveTo(60, 62, 70, 80); line(14);
  // hanging arm
  x.beginPath(); x.moveTo(0, 0); x.lineTo(-10, 60); line(20); dot(0, -2, 14);
  ell(0, 110, 50, 60);
  ell(-4, 120, 30, 38, BK); ell(-4, 120, 24, 32);
  // waving arm
  const w = per(t, 30) * .4;
  x.save(); x.translate(30, 80); x.rotate(-.8 + w); x.beginPath(); x.moveTo(0, 0); x.lineTo(60, -10); line(18); dot(64, -10, 14); x.restore();
  [[-20, 1], [20, -1]].forEach(([a, s]) => { x.beginPath(); x.moveTo(a, 160); x.quadraticCurveTo(a + s * 20, 190, a, 204); line(18); });
  // head
  [-1, 1].forEach(s => { dot(-10 + s * 52, 30, 20); dot(-10 + s * 52, 30, 10, BK); });
  dot(-10, 30, 50);
  x.beginPath(); x.moveTo(-10, 18); x.bezierCurveTo(-56, 2, -50, 64, -30, 66); x.quadraticCurveTo(-10, 76, 10, 66); x.bezierCurveTo(30, 64, 36, 2, -10, 18); line(5, BK);
  eye(-26, 30, 9, t); eye(6, 30, 9, t, .4); smile(-10, 50, 12, 5);
  x.restore();
}
function firefly(t) {
  // firefly with round wings, its tail glowing in soft rings that pulse outward
  const g = (per(t, 30) + 1) / 2;
  for (let i = 0; i < 3; i++) { const k = ((t * 30 / L.P) * 4 + i / 3) % 1; x.beginPath(); x.arc(70, 30, 40 + k * 90, 0, 7); x.save(); x.globalAlpha *= (1 - k) * .8; line(6); x.restore(); }
  dot(70, 30, 34 + g * 10);
  dot(70, 30, 22 + g * 6, BK); dot(70, 30, 16 + g * 6);
  const f = per(t, 120) * .4;
  [[-1], [1]].forEach(([s]) => { x.save(); x.translate(0, -30); x.rotate(s * (.5 + f)); x.beginPath(); x.ellipse(s * 10, -54, 30, 56, 0, 0, 7); line(6); x.restore(); });
  ell(20, 10, 60, 34);
  [0, 24].forEach(a => { x.beginPath(); x.moveTo(a, -22); x.lineTo(a, 42); line(5, BK); });
  dot(-56, 0, 38);
  [[-70, -34, -100, -84], [-50, -36, -50, -90]].forEach(([a, b, c2, d]) => { x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo((a + c2) / 2 - 10, d + 20, c2, d); line(5); dot(c2, d, 8); });
  eye(-70, -6, 10, t); eye(-44, -6, 10, t, .3); smile(-58, 14, 12, 5);
  for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(-10 + i * 24, 40); x.lineTo(-18 + i * 24 + per(t + i * 5, 40) * 6, 70); line(5); }
}

function bg(t) {
  // twinkling stars
  for (let i = 0; i < 34; i++) { const tw = .35 + .45 * (per(t + hash(i) * 240, 8 + (i % 5) * 2) + 1) / 2; x.save(); x.globalAlpha = tw;
    dot(hash(i + 3) * 960, 40 + hash(i + 7) * 260, 1.5 + (i % 3) * .8); x.restore(); }
  // hanging vines with leaves from the top, swaying a little
  [[60, 150], [190, 90], [770, 110], [900, 170]].forEach(([vx, len], j) => {
    const s = per(t + j * 30, 6) * 10;
    x.beginPath(); x.moveTo(vx, 0); x.quadraticCurveTo(vx + s, len * .5, vx + s * 1.6, len); line(6);
    for (let k = 1; k <= 4; k++) { const q = k / 4.5, lx = vx + s * 1.6 * q * q, ly = len * q; leaf(lx, ly, (k % 2 ? -.6 : Math.PI + .6), 26); }
  });
  x.beginPath(); x.moveTo(0, 0); for (let i = 0; i <= 960; i += 30) x.lineTo(i, 14 + Math.sin(i * .05) * 6); x.lineTo(960, 0); x.closePath(); x.fillStyle = WH; x.fill();
  // drifting firefly dots (each wanders 4x per period)
  for (let i = 0; i < 16; i++) { const a = TAU * (4 * t / L.P + hash(i)), px = 80 + hash(i + 5) * 800 + Math.sin(a) * 40, py = 120 + hash(i + 11) * 320 + Math.cos(a * 2) * 20;
    x.save(); x.globalAlpha = .25 + .55 * (per(t + i * 13, 24) + 1) / 2; dot(px, py, 3); x.restore(); }
  // jungle floor: grass tufts, ferns at the sides
  x.beginPath(); x.moveTo(0, 540); for (let i = 0; i <= 960; i += 16) x.lineTo(i, 516 + Math.sin(i * .045) * 5); x.lineTo(960, 540); x.closePath(); x.fillStyle = WH; x.fill();
  for (let i = 0; i < 18; i++) { const gx = 20 + i * 54 + hash(i) * 20; for (let k = -1; k <= 1; k++) { x.beginPath(); x.moveTo(gx, 516); x.quadraticCurveTo(gx + k * 8, 500, gx + k * 14 + per(t + i, 6) * 3, 492); line(4); } }
  [[70, 1], [890, -1]].forEach(([fx, s]) => { x.save(); x.translate(fx, 516); x.scale(s, 1);
    for (let k = 0; k < 4; k++) { const a = -Math.PI / 2 - .9 + k * .5 + per(t + k * 7, 6) * .05, l = 110 - Math.abs(k - 1.5) * 16;
      x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(Math.cos(a) * l * .5 - 10, Math.sin(a) * l * .6, Math.cos(a) * l, Math.sin(a) * l); line(5);
      for (let j = 1; j < 6; j++) { const q = j / 6, px = Math.cos(a) * l * q, py = Math.sin(a) * l * q; leaf(px, py, a - 1.2, 18 * (1 - q * .5)); leaf(px, py, a + 1.2 - Math.PI * 0 + .2, 18 * (1 - q * .5)); } }
    x.restore(); });
}
// outro: the sloth asleep hugging its branch under a crescent moon
function sleepyEnd(t) {
  x.save(); x.translate(160, -160); dot(0, 0, 36); dot(14, -8, 32, BK); x.restore();
  branch(-200, 200, 40, 26);
  leaf(-150, 34, -2.4, 40); leaf(150, 34, -.7, 40); leaf(110, 46, .6, 34);
  x.save(); x.translate(0, 40 + per(t, 8) * 3);
  ell(10, 6, 100, 50);
  for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(-30 + i * 20, -30); x.lineTo(-36 + i * 20, 20); line(3, BK); }
  [[-40, 1], [60, -1]].forEach(([a]) => { x.beginPath(); x.ellipse(a, -18, 18, 34, .2, 0, 7); x.fillStyle = WH; x.fill(); x.beginPath(); x.moveTo(a - 10, -40); x.quadraticCurveTo(a, -48, a + 10, -40); line(3, BK); });
  ell(-90, -6, 50, 44);
  ell(-90, 0, 36, 28, BK); ell(-90, 2, 30, 22);
  sleepyEye(-104, -2, 8, 4); sleepyEye(-76, -2, 8, 4);
  ell(-90, 10, 7, 4, BK); smile(-90, 16, 8, 4);
  x.restore();
  for (let i = 0; i < 3; i++) { const k = (t * .25 + i / 3) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k);
    x.font = C.FONT(30 + i * 8); x.fillStyle = WH; x.textAlign = 'center'; x.fillText('z', -150 - k * 30, -20 - k * 100); x.restore(); }
}

L.scene({
  seed: 61,
  figs: [[sloth, .8, 'sway'], [toucan, .85, 'sway'], [frog, .85, 'float'], [tigerCub, .85, 'sway'], [parrot, .72, 'fly'],
         [chameleon, .95, 'sway'], [snake, .85, 'sway'], [bigLeaf, .85, 'sway'], [monkey, .9, 'sway'], [firefly, .8, 'fly']],
  bg, end: sleepyEnd, scale: 1.4,
});
