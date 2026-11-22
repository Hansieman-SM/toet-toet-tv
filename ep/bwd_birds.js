// Daily B&W sensory #19: Birds – friendly white birds and bird things with happy faces on black:
// a round robin on a twig who sings (beak opens, little notes float up), a swan gliding on rippling water with its neck gently bobbing,
// a woodpecker on a tree trunk tapping now and then (tap lines), a hummingbird hovering next to a bell flower with fast fluttering wings,
// a peacock whose striped tail with eye spots slowly fans open and closes, a nest with three baby birds opening their beaks in turn,
// a birdhouse with a heart on the roof where a little bird peeks out left and right, a big striped feather rocking slowly down,
// a pelican with a big beak pouch where a little fish peeks out and hides again, and three little sparrows on a wire bobbing in turn.
// Background: leafy branches in the top corners, twinkling stars, a far-away flock gliding by, little feathers drifting at the sides.
// Outro: a little bird asleep in its nest on a branch under a crescent moon, z z z.
// All figures are new drawings for this video (own design, no existing characters). Everything periodic in P = 240 s.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;
const P = L.P;

const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const cheek = (cx, cy, r = 7) => { x.save(); x.globalAlpha *= .45; dot(cx, cy, r, BK); x.restore(); };
const cyc = (t, n) => (((t * n / P) % 1) + 1) % 1;            // 0..1 saw, n times per period
const pulse = (t, n, w = .12) => { const k = cyc(t, n); return k < w ? Math.sin(k / w * Math.PI) : 0; };
const outline = (lw = 5) => line(lw, BK);
// small beak pointing right from (bx,by); open 0..1
function beak(bx, by, len, h, open = 0) {
  x.beginPath(); x.moveTo(bx, by - h); x.lineTo(bx + len, by - open * h * .6); x.lineTo(bx, by); x.closePath(); x.fillStyle = WH; x.fill(); outline(4);
  x.beginPath(); x.moveTo(bx, by + 2); x.lineTo(bx + len * .85, by + 2 + open * h * .9); x.lineTo(bx, by + h * .9); x.closePath(); x.fillStyle = WH; x.fill(); outline(4);
}
function note(nx, ny, s, a) {
  x.save(); x.globalAlpha *= a; x.translate(nx, ny); x.scale(s, s);
  ell(0, 0, 11, 8, WH, -.4); x.beginPath(); x.moveTo(9, -3); x.lineTo(9, -40); x.quadraticCurveTo(20, -32, 24, -22); line(4); x.restore();
}
function featherShape(len, w, stripes) {
  x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(-w, -len * .3, -w * .8, -len * .8, 0, -len); x.bezierCurveTo(w * .8, -len * .8, w, -len * .3, 0, 0); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(0, 18); x.lineTo(0, -len + 10); line(5, BK);
  for (let i = 1; i <= stripes; i++) { const yy = -len * i / (stripes + 1), ww = w * .8 * Math.sin(Math.PI * i / (stripes + 1));
    x.beginPath(); x.moveTo(0, yy + 8); x.lineTo(-ww, yy - 6); x.moveTo(0, yy + 8); x.lineTo(ww, yy - 6); line(4, BK); }
}

function robin(t) {
  // round little bird on a twig, sings now and then
  x.beginPath(); x.moveTo(-170, 120); x.quadraticCurveTo(0, 100, 170, 112); line(14);
  leafAt(140, 104, 50, 18, -.6); leafAt(-130, 112, 50, 18, -2.6);
  const sing = Math.max(pulse(t, 20, .2), pulse(t + 4, 20, .2)), hop = pulse(t, 30, .05) * 14;
  x.save(); x.translate(0, -hop);
  [-20, 20].forEach(lx => { x.beginPath(); x.moveTo(lx, 70); x.lineTo(lx, 106); x.moveTo(lx - 12, 108); x.lineTo(lx + 12, 108); line(6); });
  // tail
  x.beginPath(); x.moveTo(-80, 20); x.lineTo(-150, -10); x.lineTo(-140, 30); x.closePath(); x.fillStyle = WH; x.fill();
  dot(0, 0, 92);
  // round chest patch
  x.beginPath(); x.arc(30, 22, 52, 0, 7); line(5, BK); for (let i = 0; i < 5; i++) dot(14 + (i % 3) * 18, 4 + Math.floor(i / 3) * 22 + (i % 2) * 6, 5, BK);
  // wing
  x.beginPath(); x.moveTo(-60, -10); x.quadraticCurveTo(-30, 50, 10, 30); x.quadraticCurveTo(-30, 10, -60, -10); line(5, BK);
  eye(26, -40, 10, t); eye(60, -40, 10, t, .3); cheek(16, -18, 7); cheek(72, -18, 7);
  beak(84, -16, 32, 18, sing);
  x.restore();
  // notes rise while singing
  for (let i = 0; i < 3; i++) { const k = cyc(t + i * 1.1, 20); if (k < .35) note(130 + k * 120 + i * 18, -60 - k * 280 - i * 12, .9, Math.sin(k / .35 * Math.PI)); }
}
function leafAt(cx, cy, len, w, rot) { x.save(); x.translate(cx, cy); x.rotate(rot); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(len / 2, -w, len, 0); x.quadraticCurveTo(len / 2, w, 0, 0); x.fillStyle = WH; x.fill(); x.beginPath(); x.moveTo(5, 0); x.lineTo(len - 8, 0); line(3, BK); x.restore(); }
function swan(t) {
  // swan gliding on water, neck gently bobbing
  const bob = per(t, 30) * 8, nod = per(t, 20) * .06;
  for (let i = 0; i < 3; i++) { const yy = 112 + i * 18, ph = per(t + i * 3, 40) * 16; x.beginPath(); x.moveTo(-180 + ph + i * 20, yy); x.lineTo(180 - i * 30 + ph, yy); line(5); }
  x.save(); x.translate(0, bob * .3);
  // body like a boat with a lifted wing
  x.beginPath(); x.moveTo(-150, 30); x.quadraticCurveTo(-160, 100, -40, 104); x.lineTo(90, 104); x.quadraticCurveTo(140, 100, 120, 50); x.quadraticCurveTo(0, 70, -150, 30); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-130, 40); x.quadraticCurveTo(-60, -20, 40, 40); x.quadraticCurveTo(-40, 80, -130, 40); x.fillStyle = WH; x.fill(); outline(5);
  for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(-90 + i * 34, 44); x.quadraticCurveTo(-74 + i * 34, 30, -60 + i * 34, 52); line(4, BK); }
  // S-neck and head
  x.save(); x.translate(100, 56); x.rotate(nod);
  x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(50, -40, -40, -110, 10, -170 + bob * .4); line(26);
  x.translate(10, -170 + bob * .4); dot(0, 0, 32);
  eye(8, -6, 7, t, .5); cheek(0, 12, 5);
  beak(28, 2, 34, 14, 0);
  x.beginPath(); x.moveTo(26, -12); x.lineTo(26, 14); line(4, BK);
  x.restore(); x.restore();
}
function woodpecker(t) {
  // on a tree trunk; taps the trunk now and then (head moves to the trunk)
  x.beginPath(); x.roundRect(-150, -190, 90, 380, 30); x.fillStyle = WH; x.fill();
  for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(-130 + (i % 2) * 40, -160 + i * 60); x.quadraticCurveTo(-110 + (i % 2) * 30, -130 + i * 60, -128 + (i % 2) * 40, -110 + i * 60); line(4, BK); }
  dot(-105, 70, 16, BK);
  const tap = Math.max(pulse(t, 40, .06), pulse(t + .5, 40, .06), pulse(t + 1, 40, .06)), lean = -tap * .22;
  // tail resting on the trunk
  x.beginPath(); x.moveTo(-40, 80); x.lineTo(-70, 170); x.lineTo(-34, 150); x.closePath(); x.fillStyle = WH; x.fill();
  x.save(); x.translate(0, 40); x.rotate(lean);
  ell(0, 0, 58, 92, WH, .12);
  for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(-20, -30 + i * 22); x.lineTo(30, -38 + i * 22); line(6, BK); }
  // feet on the trunk
  x.beginPath(); x.moveTo(-40, 60); x.lineTo(-62, 58); x.moveTo(-40, 76); x.lineTo(-62, 80); line(6);
  // head with a crest (head looks LEFT to the trunk)
  x.translate(-6, -110); dot(0, 0, 48);
  x.beginPath(); x.moveTo(-10, -44); x.quadraticCurveTo(20, -90, 46, -58); x.quadraticCurveTo(26, -50, 20, -36); x.closePath(); x.fillStyle = WH; x.fill(); outline(4);
  for (let i = 0; i < 3; i++) dot(4 + i * 12, -54 - i * 6, 4, BK);
  eye(-14, -6, 8, t, .2); eye(16, -6, 8, t, .5); smile(0, 18, 9, 4);
  x.save(); x.scale(-1, 1); beak(44, 0, 38, 14, 0); x.restore();
  x.restore();
  // tap lines next to the trunk
  if (tap > .2) { x.save(); x.globalAlpha *= tap; for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(-40, -90 + i * 22); x.lineTo(-18, -96 + i * 22); line(4); } x.restore(); }
}
function hummingbird(t) {
  // hovering next to a bell flower, wings flutter fast
  x.beginPath(); x.moveTo(-150, 190); x.quadraticCurveTo(-170, 40, -120, -40); line(9); leafAt(-152, 140, 60, 20, -2.4);
  x.save(); x.translate(-120, -40); x.rotate(.3);
  x.beginPath(); x.moveTo(-34, 70); x.quadraticCurveTo(-38, 10, 0, 6); x.quadraticCurveTo(38, 10, 34, 70); x.quadraticCurveTo(16, 56, 0, 74); x.quadraticCurveTo(-16, 56, -34, 70); x.fillStyle = WH; x.fill(); x.restore();
  const hv = per(t, 24) * 14, fl = per(t, 2880);           // 12 flutters per second
  x.save(); x.translate(60, -10 + hv);
  // tail
  x.beginPath(); x.moveTo(50, 40); x.lineTo(130, 110); x.lineTo(90, 120); x.closePath(); x.fillStyle = WH; x.fill(); x.beginPath(); x.moveTo(60, 50); x.lineTo(104, 112); line(4, BK);
  // wings (two positions blending)
  [[-.8 + fl * .45, 1]].forEach(([r, a]) => { x.save(); x.translate(20, -20); x.rotate(r);
    x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(40, -70, 20, -150); x.quadraticCurveTo(-10, -70, 0, 0); x.fillStyle = WH; x.fill(); outline(4); x.restore(); });
  ell(10, 20, 62, 42, WH, .5);
  x.beginPath(); x.ellipse(10, 20, 62, 42, .5, 0, 7); outline(4);
  dot(-50, -20, 36);
  eye(-56, -26, 7, t, .4); cheek(-40, -8, 5);
  x.beginPath(); x.moveTo(-84, -20); x.lineTo(-150, -34); line(6);
  x.restore();
}
function peacock(t) {
  // tail fan with eye spots slowly opens and closes
  const o = .55 + .45 * (per(t, 20) + 1) / 2, n = 9;
  for (let i = 0; i < n; i++) { const a = (i - (n - 1) / 2) / ((n - 1) / 2) * 1.25 * o;
    x.save(); x.translate(0, 80); x.rotate(a);
    x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -200); line(5);
    x.beginPath(); x.moveTo(0, -60); x.bezierCurveTo(-46, -110, -40, -200, 0, -232); x.bezierCurveTo(40, -200, 46, -110, 0, -60); x.fillStyle = WH; x.fill(); outline(4);
    dot(0, -180, 26, BK); dot(0, -180, 16); dot(0, -180, 8, BK);
    x.restore(); }
  // body and head
  ell(0, 90, 58, 80, BK); ell(0, 90, 50, 72);
  x.beginPath(); x.moveTo(-10, 40); x.quadraticCurveTo(-24, -10, 0, -40); line(42, BK); line(30);
  dot(2, -50, 43, BK); dot(2, -50, 34);
  for (let i = -1; i <= 1; i++) { x.beginPath(); x.moveTo(2, -80); x.lineTo(2 + i * 16, -112); line(3); dot(2 + i * 16, -116, 7); }
  eye(-10, -56, 7, t, .1); eye(16, -56, 7, t, .4); smile(3, -38, 7, 3.5);
  x.beginPath(); x.moveTo(-6, -46); x.lineTo(3, -40); x.lineTo(12, -46); line(4, BK);
  for (let i = 0; i < 4; i++) { x.beginPath(); x.arc(0, 70 + i * 22, 22 - i * 3, .4, Math.PI - .4); line(4, BK); }
  [-18, 18].forEach(lx => { x.beginPath(); x.moveTo(lx, 156); x.lineTo(lx, 186); line(6); });
}
function nest(t) {
  // nest with three baby birds that open their beaks in turn
  for (let i = 0; i < 3; i++) { const px = -86 + i * 86, op = pulse(t + i * 1.6, 40, .1), lift = op * 16;
    x.save(); x.translate(px, -10 - lift);
    dot(0, 0, 50); for (let k = -1; k <= 1; k++) { x.beginPath(); x.moveTo(k * 8, -48); x.lineTo(k * 14, -68); line(3); }
    eye(-16, -8, 7, t, i * .5); eye(16, -8, 7, t, i * .5 + .3);
    // beak opens upward
    x.beginPath(); x.moveTo(-14, 12); x.lineTo(0, 12 - 16 - op * 16); x.lineTo(14, 12); x.closePath(); x.fillStyle = WH; x.fill(); outline(4);
    x.beginPath(); x.moveTo(-12, 16); x.lineTo(0, 30 + op * 10); x.lineTo(12, 16); x.closePath(); x.fillStyle = WH; x.fill(); outline(4);
    if (op > .1) { x.save(); x.globalAlpha *= op; for (let k = 0; k < 3; k++) { x.beginPath(); x.arc(0, -10, 70 + k * 14, -2.1, -1.0); line(4); } x.restore(); }
    x.restore(); }
  // the nest (woven)
  x.beginPath(); x.moveTo(-180, 20); x.quadraticCurveTo(-170, 140, 0, 146); x.quadraticCurveTo(170, 140, 180, 20); x.closePath(); x.fillStyle = WH; x.fill();
  for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(-170 + i * 8, 40 + i * 24); x.quadraticCurveTo(0, 70 + i * 28, 170 - i * 8, 40 + i * 24); line(5, BK); }
  for (let i = 0; i < 8; i++) { x.beginPath(); x.moveTo(-180 + i * 50, 20); x.lineTo(-196 + i * 50 + 30, 4); line(6); }
  x.beginPath(); x.moveTo(-200, 160); x.lineTo(200, 150); line(12);
}
function birdhouse(t) {
  // birdhouse with a heart on the roof; a little bird peeks out of the hole left and right
  x.beginPath(); x.moveTo(0, 200); x.lineTo(0, 120); line(18);
  x.beginPath(); x.roundRect(-110, -60, 220, 190, 12); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-150, -50); x.lineTo(0, -170); x.lineTo(150, -50); x.closePath(); x.fillStyle = WH; x.fill(); outline(5);
  x.beginPath(); x.moveTo(-120, -60); x.lineTo(0, -156); x.lineTo(120, -60); line(5, BK);
  // heart on the roof
  x.save(); x.translate(0, -104); const hb = 1 + .08 * per(t, 60); x.scale(hb, hb); x.beginPath(); x.moveTo(0, 16); x.bezierCurveTo(-30, -6, -18, -30, 0, -14); x.bezierCurveTo(18, -30, 30, -6, 0, 16); x.fillStyle = BK; x.fill(); x.restore();
  // hole with the peeking bird
  dot(0, 30, 50, BK);
  const pk = per(t, 30), side = pk * 22, show = Math.abs(pk) > .25 ? 1 : 0;
  x.save(); x.beginPath(); x.arc(0, 30, 50, 0, 7); x.clip();
  dot(side, 40, 36); eye(side - 12, 34, 7, t, .2); eye(side + 12, 34, 7, t, .5);
  x.beginPath(); x.moveTo(side - 8, 46); x.lineTo(side + (pk > 0 ? 18 : -18), 50); x.lineTo(side - 2, 56); x.closePath(); x.fillStyle = BK; x.fill();
  x.restore();
  // perch
  x.beginPath(); x.moveTo(0, 96); x.lineTo(0, 112); line(8, BK); x.beginPath(); x.moveTo(-14, 112); x.lineTo(14, 112); line(8, BK);
  for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(-96, 120 - i * 30); x.lineTo(-70, 120 - i * 30); line(4, BK); }
  if (show) { /* bird faces its look direction */ }
}
function feather(t) {
  // big striped feather rocking like a little boat in the air
  const r = per(t, 40) * .45;
  x.save(); x.translate(0, -40); x.rotate(r); x.translate(0, 150);
  x.save(); x.rotate(.1); featherShape(320, 70, 6); x.restore();
  // little face on the feather
  eye(-16, -170, 7, t, .3); eye(16, -170, 7, t, .6); smile(0, -156, 9, 4);
  x.restore();
}
function pelican(t) {
  // big beak pouch; a little fish peeks out and hides again
  const pk = Math.max(0, per(t, 24)), k = pk > .3 ? (pk - .3) / .7 : 0;
  ell(-40, 80, 120, 80);
  x.beginPath(); x.moveTo(-120, 60); x.quadraticCurveTo(-60, 0, 20, 70); x.quadraticCurveTo(-60, 110, -120, 60); outline(5);
  x.beginPath(); x.moveTo(-150, 70); x.lineTo(-200, 40); x.lineTo(-190, 90); x.closePath(); x.fillStyle = WH; x.fill();
  [-60, -20].forEach(lx => { x.beginPath(); x.moveTo(lx, 150); x.lineTo(lx, 186); x.moveTo(lx - 14, 188); x.lineTo(lx + 14, 188); line(7); });
  x.beginPath(); x.moveTo(30, 30); x.quadraticCurveTo(40, -40, 20, -80); line(36);
  dot(30, -100, 46);
  eye(20, -110, 8, t, .2); eye(50, -110, 8, t, .5); cheek(10, -88, 6);
  // long beak + pouch
  x.beginPath(); x.moveTo(60, -112); x.lineTo(200, -96); x.lineTo(200, -86); x.lineTo(62, -88); x.closePath(); x.fillStyle = WH; x.fill(); outline(4);
  x.beginPath(); x.moveTo(62, -86); x.lineTo(196, -84); x.quadraticCurveTo(170, -10, 90, -30); x.quadraticCurveTo(60, -40, 62, -86); x.fillStyle = WH; x.fill(); outline(4);
  // little fish peeking out at the beak tip
  if (k > 0) { x.save(); x.beginPath(); x.rect(100, -170, 160, 84); x.clip();
    x.translate(176, -86 - 34 * k); x.rotate(-.4);
    ell(0, 0, 26, 14); x.beginPath(); x.moveTo(-22, 0); x.lineTo(-40, -12); x.lineTo(-40, 12); x.closePath(); x.fillStyle = WH; x.fill();
    dot(10, -3, 4, BK); x.beginPath(); x.moveTo(-6, -8); x.lineTo(-6, 8); line(3, BK);
    x.restore(); }
}
function sparrows(t) {
  // three little sparrows on a wire, bobbing in turn; the middle one flaps a wing now and then
  x.beginPath(); x.moveTo(-200, 70); x.quadraticCurveTo(0, 110, 200, 70); line(6);
  [-120, 0, 120].forEach((px, i) => {
    const b = pulse(t + i * 1.4, 30, .08) * 18, wy = 70 + 40 * (1 - Math.pow(px / 200, 2)) * .5 + 20 - 20;
    const y0 = 70 + 40 * (1 - (px / 200) ** 2) - 6;
    x.save(); x.translate(px, y0 - 60 - b);
    x.beginPath(); x.moveTo(-34, 20); x.lineTo(-70, 50); x.lineTo(-52, 60); x.closePath(); x.fillStyle = WH; x.fill();
    ell(0, 0, 46, 54);
    const flap = i === 1 ? pulse(t, 20, .1) : 0;
    x.save(); x.translate(-10, 0); x.rotate(-flap * 1.1); x.beginPath(); x.moveTo(0, -10); x.quadraticCurveTo(-40, 20, -6, 36); x.quadraticCurveTo(10, 10, 0, -10); x.fillStyle = WH; x.fill(); outline(4); x.restore();
    dot(10, -46, 30);
    eye(2, -50, 6, t, i * .7); eye(24, -50, 6, t, i * .7 + .3); cheek(-4, -36, 4); cheek(30, -36, 4);
    x.beginPath(); x.moveTo(30, -44); x.lineTo(48, -40); x.lineTo(30, -34); x.closePath(); x.fillStyle = BK; x.fill();
    x.beginPath(); x.moveTo(-8, 52); x.lineTo(-8, 62 + b); x.moveTo(8, 52); x.lineTo(8, 62 + b); line(4);
    x.restore(); });
}

function bg(t) {
  // leafy branches in the top corners
  [[-1, 0], [1, W0]].forEach(([d, ox]) => { x.save(); x.translate(ox, 0); x.scale(-d, 1);
    x.beginPath(); x.moveTo(0, 30); x.quadraticCurveTo(90, 50, 170, 24); line(9);
    x.beginPath(); x.moveTo(80, 42); x.quadraticCurveTo(110, 80, 104, 110); line(5);
    [[40, 34, -2.2], [120, 34, -.9], [160, 24, -.4], [104, 106, 1.4], [100, 74, .2]].forEach(([a, b, r], i) => leafAt(a, b + per(t + i * 5, 24) * 2, 38, 13, r + per(t + i * 3, 16) * .06));
    x.restore(); });
  // twinkling stars
  for (let i = 0; i < 12; i++) { const tw = (per(t + i * 9, 20 + (i % 5) * 4) + 1) / 2, sx = 210 + hash(i + 41) * 540, sy = 20 + hash(i + 7) * 80;
    if (sx > 330 && sx < 630) continue;
    x.save(); x.translate(sx, sy); x.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? 2 + tw * 2 : 5 + tw * 5, an = j * Math.PI / 5 - Math.PI / 2; x.lineTo(Math.cos(an) * r, Math.sin(an) * r); } x.closePath(); x.fillStyle = WH; x.fill(); x.restore(); }
  // a far-away flock gliding across the bottom sky, 4 times per loop
  const fk = cyc(t, 4);
  if (fk < .5) { const k = fk / .5; for (let i = 0; i < 4; i++) { const fx = -60 + k * 1080 - i * 34, fy = 470 + (i % 2) * 18 - i * 6, fw = per(t + i * .3, 480) * 5;
    x.save(); x.globalAlpha = .8 * Math.sin(Math.PI * k); x.beginPath(); x.moveTo(fx - 14, fy - fw); x.quadraticCurveTo(fx - 5, fy - 6, fx, fy); x.quadraticCurveTo(fx + 5, fy - 6, fx + 14, fy - fw); line(3.5); x.restore(); } }
  // little feathers drifting at the sides
  for (let i = 0; i < 4; i++) { const k = cyc(t + i * 60, 8), sx = (i % 2 ? 890 : 70) + Math.sin(k * TAU * 2 + i) * 22, sy = 140 + k * 300;
    x.save(); x.globalAlpha = .75 * Math.sin(Math.PI * k); x.translate(sx, sy); x.rotate(Math.sin(k * TAU * 2 + i) * .5 + .3); x.scale(.16, .16); featherShape(320, 70, 4); x.restore(); }
}
const W0 = C.W;
// outro: a little bird asleep in its nest on a branch under a crescent moon
function sleepyEnd(t) {
  x.save(); x.translate(200, -150); dot(0, 0, 36); dot(14, -8, 32, BK); x.restore();
  x.beginPath(); x.moveTo(-230, 140); x.quadraticCurveTo(0, 120, 230, 134); line(14); leafAt(170, 128, 56, 18, -.5); leafAt(-180, 136, 56, 18, -2.7);
  const br = per(t, 8) * 3;
  x.save(); x.translate(0, br);
  dot(0, 0, 70);
  x.beginPath(); x.moveTo(-60, 10); x.quadraticCurveTo(-20, 50, 30, 30); line(5, BK);
  sleepyEye(-22, -14, 9); sleepyEye(18, -14, 9); cheek(-38, 4, 6); cheek(34, 4, 6);
  x.beginPath(); x.moveTo(-8, 4); x.lineTo(0, 16); x.lineTo(8, 4); x.closePath(); x.fillStyle = BK; x.fill();
  x.restore();
  x.beginPath(); x.moveTo(-130, 30); x.quadraticCurveTo(-120, 130, 0, 132); x.quadraticCurveTo(120, 130, 130, 30); x.closePath(); x.fillStyle = WH; x.fill();
  for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(-122 + i * 8, 52 + i * 24); x.quadraticCurveTo(0, 80 + i * 24, 122 - i * 8, 52 + i * 24); line(5, BK); }
  for (let i = 0; i < 3; i++) { const k = (t * .25 + i / 3) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k);
    x.font = C.FONT(30 + i * 8); x.fillStyle = WH; x.textAlign = 'center'; x.fillText('z', 100 + k * 30, -80 - k * 100); x.restore(); }
}

const TDY = +(process.env.THUMBDY || 0);   // thumbnail only: move the figure down below the title
const up = f => t => { x.translate(0, -24 + TDY); f(t); };
L.scene({
  seed: 191,
  figs: [[up(robin), .8, 'sway'], [up(swan), .8, 'sway'], [up(woodpecker), .74, 'sway'], [up(hummingbird), .8, 'sway'], [up(peacock), .72, 'sway'],
         [up(nest), .8, 'sway'], [up(birdhouse), .76, 'sway'], [feather, .7, 'float'], [up(pelican), .78, 'sway'], [up(sparrows), .8, 'sway']],
  bg, end: up(sleepyEnd), scale: 1.3,
});
