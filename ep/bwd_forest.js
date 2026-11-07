// Daily B&W sensory #6: Forest Friends – white forest friends on black: owl on a branch (head tilts), fox with a big striped tail,
// hedgehog snuffling with spiky back, deer with little antlers and spots, squirrel holding an acorn, smiling mushroom with dots,
// bear cub waving, bunny with twitching ears, smiling acorn that bounces, friendly tree with a face and a little bird.
// Background: pine trees at the edges, falling leaves, ferns along a white forest floor, a few twinkling stars in the canopy gaps.
// All figures are new drawings for this video (own design). Figures look LEFT.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;

const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const leg = (lx, ly, len, w, ang) => { x.save(); x.translate(lx, ly); x.rotate(ang); x.beginPath(); x.roundRect(-w / 2, 0, w, len, w / 2); x.fillStyle = WH; x.fill(); x.restore(); };
const walk = (t, i) => per(t, 60) * .22 * (i % 2 ? 1 : -1);
const fill = (col = WH) => { x.fillStyle = col; x.fill(); };
// simple leaf shape (pointing up), used in several places
function leafShape(cx, cy, s, rot, col = WH, vein = true) {
  x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(s, s);
  x.beginPath(); x.moveTo(0, 30); x.quadraticCurveTo(-22, 0, 0, -30); x.quadraticCurveTo(22, 0, 0, 30); fill(col);
  if (vein) { x.beginPath(); x.moveTo(0, 26); x.lineTo(0, -22); line(2.5, col === WH ? BK : WH); }
  x.restore();
}

function owl(t) {
  // big round owl on a branch, ear tufts, wing feathers, head tilts slowly
  x.beginPath(); x.moveTo(-170, 120); x.quadraticCurveTo(0, 100, 170, 128); line(18);
  leafShape(150, 104, .7, 1.2); leafShape(-150, 100, .6, -1.3);
  [-26, 26].forEach(a => { x.beginPath(); x.moveTo(a - 12, 112); x.lineTo(a - 12, 122); x.moveTo(a, 112); x.lineTo(a, 124); x.moveTo(a + 12, 112); x.lineTo(a + 12, 122); line(6); });
  ell(0, 30, 92, 92);
  ell(0, 50, 58, 60, BK); ell(0, 50, 52, 54);
  for (let r = 0; r < 3; r++) for (let k = -2; k <= 2; k++) { x.beginPath(); x.arc(k * 18, 22 + r * 22, 9, .2, Math.PI - .2); line(3.5, BK); }
  [[-1], [1]].forEach(([d]) => { x.save(); x.translate(d * 78, 30); x.rotate(d * (.15 + per(t, 20) * .05)); ell(0, 10, 24, 60); x.beginPath(); x.moveTo(0, -30); x.lineTo(0, 54); line(3, BK); x.restore(); });
  x.save(); x.translate(0, -70); x.rotate(per(t, 8) * .18);
  [[-1], [1]].forEach(([d]) => { x.beginPath(); x.moveTo(d * 40, -50); x.lineTo(d * 70, -100); x.lineTo(d * 74, -40); x.closePath(); fill(); });
  ell(0, 0, 84, 66);
  [[-1], [1]].forEach(([d]) => { dot(d * 34, -4, 32, BK); dot(d * 34, -4, 26); eye(d * 34, -4, 14, t, d > 0 ? .25 : 0); });
  x.beginPath(); x.moveTo(-10, 18); x.lineTo(10, 18); x.lineTo(0, 38); x.closePath(); fill(BK);
  x.restore();
}
function fox(t) {
  // trotting fox, pointy ears, big bushy tail with a black stripe and white tip
  [[-60, 0], [-30, 1], [40, 2], [70, 3]].forEach(([lx, i]) => leg(lx, 30, 70, 20, walk(t, i)));
  [[-60, 0], [-30, 1], [40, 2], [70, 3]].forEach(([lx, i]) => { x.save(); x.translate(lx, 30); x.rotate(walk(t, i)); x.beginPath(); x.roundRect(-10, 46, 20, 24, 10); fill(BK); x.restore(); });
  x.save(); x.translate(100, 0); x.rotate(-.5 + per(t, 20) * .12);
  x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(40, -60, 140, -70, 180, -20); x.bezierCurveTo(150, 10, 60, 30, 0, 20); x.closePath(); fill();
  x.beginPath(); x.moveTo(100, -46); x.quadraticCurveTo(120, -10, 104, 18); line(9, BK);
  x.restore();
  ell(10, 10, 105, 46);
  x.beginPath(); x.moveTo(-70, 20); x.quadraticCurveTo(-20, 50, 40, 36); line(4, BK);
  x.save(); x.translate(-100, -36); x.rotate(per(t, 12) * .06);
  [[-30, -50], [30, -50]].forEach(([a, b], i) => { x.beginPath(); x.moveTo(a - 22, b + 30); x.lineTo(a + (i ? 6 : -6), b - 30); x.lineTo(a + 22, b + 30); x.closePath(); fill();
    x.beginPath(); x.moveTo(a - 10, b + 22); x.lineTo(a + (i ? 3 : -3), b - 12); x.lineTo(a + 10, b + 22); x.closePath(); fill(BK); });
  x.beginPath(); x.moveTo(-60, -10); x.quadraticCurveTo(0, -60, 60, -10); x.quadraticCurveTo(40, 30, 0, 34); x.lineTo(-90, 26); x.quadraticCurveTo(-90, 6, -60, -10); fill();
  x.beginPath(); x.moveTo(-40, 16); x.quadraticCurveTo(-10, 30, 30, 10); line(4, BK);
  dot(-92, 22, 9, BK); eye(-26, -8, 10, t); eye(16, -8, 10, t, .2);
  x.restore();
}
function hedgehog(t) {
  // round hedgehog snuffling along, spiky back (black zigzag lines), tiny feet, nose wiggles
  [[-50, 0], [-10, 1], [30, 2], [70, 3]].forEach(([lx, i]) => leg(lx, 40, 26, 18, walk(t, i)));
  x.beginPath();
  for (let i = 0; i <= 22; i++) { const a = Math.PI + i / 22 * Math.PI, r = i % 2 ? 110 : 132; x.lineTo(20 + Math.cos(a) * r * 1.05, 40 + Math.sin(a) * r * .85); }
  x.closePath(); fill();
  for (let row = 0; row < 3; row++) for (let i = 0; i < 7; i++) { const a = Math.PI + (i + .5 + row * .3) / 7.6 * Math.PI, r = 40 + row * 26;
    const px = 30 + Math.cos(a) * r * 1.1, py = 36 + Math.sin(a) * r * .8; x.beginPath(); x.moveTo(px - 6, py + 8); x.lineTo(px, py - 8); x.lineTo(px + 6, py + 8); line(4, BK); }
  // face
  const sn = per(t, 30) * 4;
  x.save(); x.translate(-90, 14);
  x.beginPath(); x.moveTo(30, -50); x.quadraticCurveTo(-30, -40, -70 + sn, 6); x.quadraticCurveTo(-30, 40, 40, 30); x.closePath(); fill();
  dot(-60 + sn, 6, 11, BK); dot(-63 + sn, 2, 3);
  dot(14, -42, 14); dot(14, -42, 6, BK);
  eye(-14, -12, 9, t); smile(-36, 10, 10, 4);
  x.restore();
}
function deer(t) {
  // young deer with little antlers, white spots on a black saddle, ears flick
  [[-60, 0], [-30, 1], [50, 2], [80, 3]].forEach(([lx, i]) => leg(lx, 30, 110, 18, walk(t, i)));
  ell(10, 10, 100, 50);
  x.save(); x.beginPath(); x.ellipse(10, 10, 100, 50, 0, 0, 7); x.clip();
  x.beginPath(); x.ellipse(20, -20, 90, 34, 0, 0, 7); fill(BK);
  [[-40, -26], [-10, -34], [20, -24], [50, -32], [80, -20], [-20, -12], [36, -10]].forEach(([a, b]) => dot(a, b, 7));
  x.restore();
  x.beginPath(); x.moveTo(104, -10); x.quadraticCurveTo(124, -30 + per(t, 24) * 8, 112, -40); line(12);
  x.save(); x.translate(-70, -20); x.rotate(-.35 + per(t, 12) * .05);
  x.beginPath(); x.roundRect(-24, -110, 48, 120, 22); fill();
  x.translate(-4, -120);
  // antlers
  [[-1], [1]].forEach(([d]) => { x.beginPath(); x.moveTo(d * 14, -20); x.lineTo(d * 24, -70); x.moveTo(d * 20, -50); x.lineTo(d * 44, -64); x.moveTo(d * 23, -64); x.lineTo(d * 12, -86); line(7); });
  [[-1, 0], [1, 1]].forEach(([d, i]) => { x.save(); x.translate(d * 40, -18); x.rotate(d * (.9 + (per(t + i * 3, 40) > .9 ? .3 : 0))); ell(0, -18, 12, 26); ell(0, -16, 5, 14, BK); x.restore(); });
  x.beginPath(); x.ellipse(-10, 0, 40, 34, 0, 0, 7); fill(); x.beginPath(); x.ellipse(-40, 18, 30, 20, .2, 0, 7); fill();
  dot(-64, 20, 8, BK); eye(-14, -4, 10, t); smile(-44, 28, 9, 4);
  x.restore();
}
function squirrel(t) {
  // sitting squirrel holding an acorn, huge curled tail that bobs
  x.save(); x.translate(60, 40); x.rotate(per(t, 16) * .06);
  x.beginPath(); x.moveTo(0, 40); x.bezierCurveTo(120, 60, 150, -80, 80, -140); x.bezierCurveTo(40, -180, -20, -150, 10, -110);
  x.bezierCurveTo(40, -130, 80, -110, 70, -70); x.bezierCurveTo(60, -20, 20, 0, -10, 10); x.closePath(); fill();
  x.beginPath(); x.moveTo(30, 20); x.bezierCurveTo(100, 20, 110, -80, 66, -120); line(4, BK);
  x.restore();
  ell(-10, 50, 58, 70);
  ell(-26, 60, 30, 44, BK); ell(-26, 60, 24, 38);
  leg(-40, 104, 26, 30, 1.3); leg(10, 108, 26, 30, -1.4);
  // acorn in the paws
  x.save(); x.translate(-60, 26 + per(t, 20) * 3);
  x.beginPath(); x.ellipse(0, 8, 18, 22, 0, 0, 7); fill(); x.beginPath(); x.ellipse(0, -10, 22, 12, 0, Math.PI, 0); x.lineTo(22, -8); x.lineTo(-22, -8); fill();
  x.beginPath(); x.moveTo(-18, -8); x.lineTo(18, -8); line(4, BK); x.beginPath(); x.moveTo(0, -20); x.lineTo(4, -30); line(5);
  x.restore();
  [[-1, 0], [1, 0]].forEach(([d]) => leg(-40 + d * 10, 10, 34, 16, .9 - d * .2));
  x.save(); x.translate(-30, -50);
  [[-22], [22]].forEach(([a]) => { x.beginPath(); x.moveTo(a - 14, -20); x.lineTo(a, -62); x.lineTo(a + 14, -20); x.closePath(); fill(); x.beginPath(); x.moveTo(a, -60); x.lineTo(a + 4, -70); line(5); });
  ell(0, 0, 46, 42); ell(-30, 14, 22, 16);
  dot(-50, 10, 6, BK); eye(-14, -6, 10, t); eye(18, -6, 9, t, .2);
  x.beginPath(); x.moveTo(-36, 26); x.quadraticCurveTo(-28, 32, -20, 26); line(4, BK);
  x.restore();
}
function mushroom(t) {
  // smiling toadstool with black dots on its cap, a little leaf, gently squishes
  const sq = per(t, 12) * .04;
  x.save(); x.scale(1 + sq, 1 - sq);
  x.beginPath(); x.moveTo(-50, 120); x.quadraticCurveTo(-60, 20, -36, -10); x.lineTo(36, -10); x.quadraticCurveTo(60, 20, 50, 120); x.closePath(); fill();
  x.beginPath(); x.moveTo(-40, 10); x.quadraticCurveTo(0, 30, 40, 10); line(4, BK);
  eye(-18, 50, 10, t); eye(18, 50, 10, t, .2); smile(0, 70, 14, 5);
  x.beginPath(); x.moveTo(-150, 0); x.bezierCurveTo(-150, -130, 150, -130, 150, 0); x.quadraticCurveTo(0, 30, -150, 0); fill();
  [[-90, -40, 18], [-30, -80, 22], [40, -70, 16], [100, -30, 20], [0, -30, 14], [-60, -6, 10], [64, -10, 11]].forEach(([a, b, r]) => dot(a, b, r, BK));
  x.restore();
  ell(0, 126, 130, 12);
  leafShape(-100, 100, .9, -1.1); leafShape(100, 104, .7, 1.3);
}
function bearCub(t) {
  // round bear cub sitting, waving one paw
  ell(0, 60, 96, 84);
  ell(0, 76, 54, 54, BK); ell(0, 76, 48, 48);
  [[-60, 1], [60, -1]].forEach(([lx, d]) => { ell(lx, 140, 34, 22); dot(lx, 142, 12, BK); });
  leg(70, 20, 70, 34, -.3);
  x.save(); x.translate(-70, 10); x.rotate(2.6 + per(t, 24) * .35); x.beginPath(); x.roundRect(-17, 0, 34, 80, 17); fill(); dot(0, 76, 10, BK); x.restore();
  x.save(); x.translate(0, -70); x.rotate(per(t, 10) * .06);
  [[-1], [1]].forEach(([d]) => { dot(d * 58, -50, 28); dot(d * 58, -50, 14, BK); });
  dot(0, 0, 74);
  ell(0, 26, 34, 26, BK); ell(0, 26, 29, 21);
  ell(0, 12, 12, 8, BK); x.beginPath(); x.moveTo(0, 18); x.lineTo(0, 28); line(4, BK); smile(0, 24, 12, 4);
  eye(-28, -12, 11, t); eye(28, -12, 11, t, .25);
  x.restore();
}
function bunny(t) {
  // hopping bunny, long ears (one flops), cotton tail, nose twitch
  const hop = Math.max(0, per(t, 48)) * 24;
  x.save(); x.translate(0, -hop);
  dot(110, 20, 26);
  ell(30, 30, 90, 62);
  ell(70, 76, 50, 18); leg(-30, 60, 40, 22, .2); leg(-6, 60, 40, 22, -.1);
  x.save(); x.translate(-60, -30);
  [[-10, 0], [22, 1]].forEach(([a, i]) => { x.save(); x.translate(a, -40); x.rotate(i ? .3 + per(t, 20) * .25 : -.15);
    x.beginPath(); x.ellipse(0, -60, 20, 64, 0, 0, 7); fill(); x.beginPath(); x.ellipse(0, -58, 9, 48, 0, 0, 7); fill(BK); x.restore(); });
  ell(0, 0, 58, 50);
  const tw = per(t, 60) * 2;
  dot(-44, 10 + tw, 7, BK); eye(-14, -10, 10, t); eye(20, -10, 9, t, .2);
  x.beginPath(); x.moveTo(-44, 16); x.lineTo(-44, 24); x.moveTo(-44, 24); x.quadraticCurveTo(-50, 30, -56, 26); x.moveTo(-44, 24); x.quadraticCurveTo(-38, 30, -32, 26); line(3.5, BK);
  [[-1], [1]].forEach(([d]) => { x.beginPath(); x.moveTo(-50 + d * 0, 18); x.lineTo(-86, 10 + d * 8); line(2.5, BK); });
  x.restore();
  x.restore();
  ell(20, 104, 100 - hop, 8, 'rgba(255,255,255,.35)');
}
function acornFriend(t) {
  // big smiling acorn bouncing gently, little arms, oak leaves around
  const b = Math.abs(per(t, 24)) * 20;
  leafShape(-130, 60, 1.4, -.8); leafShape(130, 50, 1.3, .8); leafShape(-110, -60, 1, -2.2);
  x.save(); x.translate(0, 40 - b);
  x.beginPath(); x.moveTo(-90, -40); x.bezierCurveTo(-100, 70, -30, 120, 0, 130); x.bezierCurveTo(30, 120, 100, 70, 90, -40); x.closePath(); fill();
  x.beginPath(); x.moveTo(-110, -30); x.bezierCurveTo(-110, -140, 110, -140, 110, -30); x.quadraticCurveTo(0, -10, -110, -30); fill();
  x.save(); x.beginPath(); x.moveTo(-110, -30); x.bezierCurveTo(-110, -140, 110, -140, 110, -30); x.quadraticCurveTo(0, -10, -110, -30); x.clip();
  for (let i = -6; i <= 6; i++) { x.beginPath(); x.moveTo(i * 22 - 40, -140); x.lineTo(i * 22 + 40, -10); line(4, BK); x.beginPath(); x.moveTo(i * 22 + 40, -140); x.lineTo(i * 22 - 40, -10); line(4, BK); }
  x.restore();
  x.beginPath(); x.moveTo(-104, -28); x.quadraticCurveTo(0, -8, 104, -28); line(6, BK);
  x.beginPath(); x.moveTo(0, -106); x.quadraticCurveTo(10, -140, 30, -146); line(12);
  eye(-30, 30, 13, t); eye(30, 30, 13, t, .2); smile(0, 50, 22, 6);
  [[-1], [1]].forEach(([d]) => { x.beginPath(); x.moveTo(d * 92, 30); x.quadraticCurveTo(d * 130, 20 + per(t, 24) * 10 * d, d * 136, -10); line(10); dot(d * 136, -14, 10); });
  x.restore();
}
function treeFriend(t) {
  // friendly round tree with a face; a little bird hops on its branch
  x.beginPath(); x.moveTo(-40, 160); x.quadraticCurveTo(-30, 60, -34, 0); x.lineTo(34, 0); x.quadraticCurveTo(30, 60, 40, 160); x.closePath(); fill();
  x.beginPath(); x.moveTo(-60, 160); x.quadraticCurveTo(-40, 150, -40, 130); x.moveTo(60, 160); x.quadraticCurveTo(40, 150, 40, 130); line(10);
  x.beginPath(); x.ellipse(0, 90, 12, 18, 0, 0, 7); fill(BK);
  const sw = per(t, 12) * 4;
  x.save(); x.translate(sw, 0);
  x.beginPath(); [[-80, -60, 70], [0, -110, 86], [80, -60, 70], [-40, -10, 60], [40, -10, 60]].forEach(([a, b, r]) => { x.moveTo(a + r, b); x.arc(a, b, r, 0, 7); }); fill();
  [[-90, -90], [-20, -150], [60, -120], [100, -40], [-110, -30]].forEach(([a, b], i) => { x.beginPath(); x.arc(a, b, 16, .3, Math.PI - .3); line(4, BK); });
  eye(-30, -60, 13, t); eye(30, -60, 13, t, .3); smile(0, -38, 22, 6);
  // branch with a bird
  x.beginPath(); x.moveTo(110, 10); x.lineTo(180, -10); line(10);
  const hop = Math.max(0, per(t, 36)) * 12;
  x.save(); x.translate(160, -30 - hop);
  ell(0, 0, 22, 16); dot(-16, -10, 12); eye(-18, -12, 4, t, .4);
  x.beginPath(); x.moveTo(-28, -10); x.lineTo(-38, -6); x.lineTo(-28, -4); x.closePath(); fill();
  x.beginPath(); x.moveTo(18, -4); x.lineTo(34, -14); x.lineTo(30, 2); x.closePath(); fill();
  x.beginPath(); x.arc(4, 0, 10, .3, 2.6); line(3, BK);
  x.restore();
  x.restore();
}

function bg(t) {
  // a few stars between the tree tops (gentle twinkle, periodic)
  for (let i = 0; i < 9; i++) { const sx = 180 + hash(i + 3) * 600, sy = 30 + hash(i + 11) * 90, tw = .6 + .4 * per(t + i * 13, 10 + i);
    x.save(); x.globalAlpha *= tw; dot(sx, sy, 2.5 + hash(i) * 1.5); x.restore(); }
  // pine trees at the edges (sway a tiny bit)
  [[50, 1.15, 0], [130, .7, 1], [905, 1.05, 2], [835, .65, 3]].forEach(([px, s, i]) => {
    x.save(); x.translate(px, 500); x.scale(s, s); x.rotate(per(t + i * 20, 6) * .012);
    x.beginPath(); x.roundRect(-9, -50, 18, 50, 4); fill();
    for (let k = 0; k < 4; k++) { const y0 = -40 - k * 62, w = 80 - k * 16; x.beginPath(); x.moveTo(-w, y0); x.lineTo(0, y0 - 100); x.lineTo(w, y0); x.closePath(); fill();
      x.beginPath(); x.moveTo(-w + 10, y0); x.lineTo(0, y0 - 18); x.lineTo(w - 10, y0); line(3, BK); }
    x.restore(); });
  // forest floor with ferns
  x.fillStyle = WH; x.fillRect(0, 500, 960, 40);
  for (let i = 0; i < 8; i++) { const fx = 200 + i * 80 + (hash(i + 2) - .5) * 30, sw = per(t + i * 5, 6) * .06;
    x.save(); x.translate(fx, 501); x.rotate(sw);
    [-.9, -.45, 0, .45, .9].forEach(a => { x.save(); x.rotate(a); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -26 - (a === 0 ? 8 : 0)); line(3); for (let k = 1; k < 4; k++) { x.beginPath(); x.moveTo(0, -k * 7); x.lineTo(-6, -k * 7 - 4); x.moveTo(0, -k * 7); x.lineTo(6, -k * 7 - 4); line(2); } x.restore(); });
    x.restore(); }
}
function fg(t) {
  // falling leaves (each falls 3x per period, drifting side to side) – kept away from the frame edges
  for (let i = 0; i < 5; i++) {
    const k = ((t * 3 / L.P) + i / 5 + hash(i) * .1) % 1;
    const lx = 250 + i * 115 + Math.sin(k * TAU * 2 + i) * 30, ly = -30 + k * 500;
    x.save(); x.globalAlpha *= Math.min(1, k * 8, (1 - k) * 8); leafShape(lx, ly, .5, Math.sin(k * TAU * 3 + i) * .9); x.restore();
  }
}
// outro: a little fox curled up asleep under a blanket of leaves, stars and z's
function sleepyEnd(t) {
  [[-170, -170], [-60, -210], [120, -190], [190, -130], [-200, -80]].forEach(([a, b], i) => { x.save(); x.globalAlpha *= .6 + .4 * per(t + i * 9, 12); dot(a, b, 4); x.restore(); });
  x.save(); x.translate(0, 40 + per(t, 12) * 3);
  // curled body + tail around the front
  ell(10, 40, 140, 64);
  x.beginPath(); x.moveTo(140, 40); x.bezierCurveTo(170, 120, -60, 140, -150, 90); x.bezierCurveTo(-120, 70, 40, 90, 110, 40); x.closePath(); fill();
  x.beginPath(); x.moveTo(-150, 90); x.quadraticCurveTo(-130, 80, -110, 86); line(5, BK);
  // head resting
  x.save(); x.translate(-70, 0);
  [[-34, -44], [24, -44]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a - 20, b + 26); x.lineTo(a, b - 26); x.lineTo(a + 20, b + 26); x.closePath(); fill(); x.beginPath(); x.moveTo(a - 9, b + 20); x.lineTo(a, b - 8); x.lineTo(a + 9, b + 20); x.closePath(); fill(BK); });
  x.beginPath(); x.moveTo(-60, -6); x.quadraticCurveTo(-6, -50, 50, -6); x.quadraticCurveTo(40, 30, 0, 32); x.lineTo(-84, 26); x.quadraticCurveTo(-84, 6, -60, -6); x.closePath(); fill(); line(5, BK);
  dot(-86, 22, 8, BK); sleepyEye(-28, -2, 10, 5); sleepyEye(14, -2, 10, 5);
  x.restore();
  // leaf blanket
  [[20, 66, 1.1, .4], [76, 56, .95, -.6], [-24, 84, .9, 1.4], [124, 70, .85, 1.1]].forEach(([a, b, s, r]) => leafShape(a, b, s, r, BK));
  x.restore();
  x.font = C.FONT(34); x.fillStyle = WH; x.textAlign = 'center';
  for (let i = 0; i < 3; i++) { const k = (t * .3 + i / 3) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k); x.fillText('z', -40 + k * 60 + i * 6, -40 - k * 90); x.restore(); }
}

L.scene({
  seed: 61,
  figs: [[owl, .85, 'sway'], [fox, .9, 'swimL'], [hedgehog, .9, 'floor'], [deer, .8, 'swimR'], [squirrel, .85, 'float'],
         [mushroom, .85, 'sway'], [bearCub, .85, 'sway'], [bunny, .9, 'floor'], [acornFriend, .8, 'float'], [treeFriend, .8, 'sway']],
  bg, fg, end: sleepyEnd,
});
