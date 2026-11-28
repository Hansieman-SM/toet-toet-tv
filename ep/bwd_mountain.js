// Daily B&W sensory #25: Mountain Animals – friendly white mountain figures with happy faces on black:
// a mountain goat with curly horns and a little beard hopping on a rock, an eagle gliding with slowly flapping wings,
// a round marmot popping up out of its burrow and whistling (sound arcs), a smiling snowy mountain peak with a cloud drifting past,
// a shaggy yak whose long fringe sways, a snowy pine tree that drops a pinecone (it bounces and rolls back), a fluffy wolf pup
// softly howling at a tiny moon (gentle "aooo" arcs), a little round pika with big ears nibbling a flower,
// an alpaca with a fluffy neck slowly chewing and nodding, and a cable-car gondola swinging gently on its wire with a waving bunny inside.
// Background: mountain ridges along the bottom with snowy peaks, twinkling stars, slowly drifting snowflakes.
// Outro: the goat kid and the marmot asleep together on a rock ledge under a crescent moon, z z z.
// All figures are new drawings for this video (own design, no existing characters). Everything periodic in P = 240 s.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;
const P = L.P;

const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const cheek = (cx, cy, r = 7) => { x.save(); x.globalAlpha *= .45; dot(cx, cy, r, BK); x.restore(); };
const cyc = (t, n) => (((t * n / P) % 1) + 1) % 1;
const fill = (col = WH) => { x.fillStyle = col; x.fill(); };
const outline = (lw = 5) => { x.lineWidth = lw; x.strokeStyle = BK; x.lineJoin = 'round'; x.stroke(); };
function face(cx, cy, s, t, o = {}) {
  if (o.sleepy) { sleepyEye(cx - 15 * s, cy, 8 * s, 4.5 * s); sleepyEye(cx + 15 * s, cy, 8 * s, 4.5 * s); }
  else { eye(cx - 15 * s, cy, 7.5 * s, t, o.ph || 0); eye(cx + 15 * s, cy, 7.5 * s, t, (o.ph || 0) + .3); }
  cheek(cx - 28 * s, cy + 13 * s, 6 * s); cheek(cx + 28 * s, cy + 13 * s, 6 * s);
  if (o.open) ell(cx, cy + 15 * s, 6 * s, 4 * s + 6 * s * o.open, BK); else smile(cx, cy + 8 * s, 10 * s, 4.2 * s);
}
const arcs = (t, px, py, dir = 1, n = 3, sp = 40) => { for (let i = 0; i < n; i++) { const k = cyc(t + i * (P / sp) / n, sp); x.save(); x.globalAlpha *= Math.sin(Math.PI * k);
  x.beginPath(); x.arc(px, py, 14 + k * 46, -.6 * dir + (dir < 0 ? Math.PI : 0), .6 * dir + (dir < 0 ? Math.PI : 0), dir < 0); line(4); x.restore(); } };
const zzz = (t, px, py, n = 3) => { for (let i = 0; i < n; i++) { const k = cyc(t + i * 80 / n, 60); x.save(); x.globalAlpha *= Math.sin(Math.PI * k);
  x.font = C.FONT(24 + i * 7); x.fillStyle = WH; x.textAlign = 'center'; x.fillText('z', px + k * 24, py - k * 70); x.restore(); } };

// 1. mountain goat: curly horns, beard, hops on a rock
function goat(t) {
  // rock
  x.beginPath(); x.moveTo(-120, 150); x.lineTo(-90, 80); x.lineTo(-20, 60); x.lineTo(70, 70); x.lineTo(120, 150); x.closePath(); fill();
  x.beginPath(); x.moveTo(-60, 100); x.lineTo(-20, 86); x.moveTo(30, 110); x.lineTo(70, 96); line(4, BK);
  const hop = Math.max(0, per(t, 20)) * 34;
  x.save(); x.translate(0, -hop);
  [[-46, 0], [-24, 1], [26, 0], [46, 1]].forEach(([lx, k]) => { const bend = hop > 4 ? (k ? .25 : -.25) : 0; x.save(); x.translate(lx, 30); x.rotate(bend);
    x.beginPath(); x.roundRect(-8, 0, 16, 36, 6); fill(); x.beginPath(); x.roundRect(-8, 28, 16, 9, 3); fill(BK); x.restore(); });
  ell(0, 6, 76, 44); x.beginPath(); x.ellipse(0, 6, 76, 44, 0, 0, TAU); outline(5);
  x.beginPath(); x.moveTo(70, -6); x.quadraticCurveTo(96, -20, 90, -36); line(10);   // little tail
  // head
  x.save(); x.translate(-74, -40); x.rotate(per(t, 12) * .08);
  [-1, 1].forEach(sd => { x.beginPath(); x.moveTo(sd * 12, -34); x.bezierCurveTo(sd * 20, -86, sd * 66, -84, sd * 60, -50); x.quadraticCurveTo(sd * 56, -36, sd * 44, -44); line(10);
    x.beginPath(); x.moveTo(sd * 22, -62); x.lineTo(sd * 30, -56); x.moveTo(sd * 34, -72); x.lineTo(sd * 38, -64); line(3, BK); });
  ell(-34, -10, 18, 8, WH, -.5); ell(34, -10, 18, 8, WH, .5);
  ell(0, 0, 38, 44); x.beginPath(); x.ellipse(0, 0, 38, 44, 0, 0, TAU); outline(5);
  x.beginPath(); x.moveTo(-12, 40); x.quadraticCurveTo(0, 82 + per(t, 30) * 4, 12, 40); fill(); x.beginPath(); x.moveTo(-6, 46); x.lineTo(0, 70); line(3, BK);
  face(0, -4, .95, t, { ph: 1 });
  x.restore();
  x.restore();
}
// 2. eagle gliding with slow wing flaps
function eagle(t) {
  const f = per(t, 30) * .3;
  [-1, 1].forEach(sd => { x.save(); x.scale(sd, 1); x.rotate(-f);
    x.beginPath(); x.moveTo(20, -10); x.quadraticCurveTo(110, -70, 190, -40); x.lineTo(176, -24); x.lineTo(186, -10); x.lineTo(166, 0); x.lineTo(172, 14); x.lineTo(146, 14);
    x.quadraticCurveTo(80, 20, 20, 20); x.closePath(); fill();
    for (let k = 0; k < 4; k++) { x.beginPath(); x.moveTo(80 + k * 22, -14); x.lineTo(96 + k * 22, 8); line(3, BK); }
    x.restore(); });
  // tail
  x.beginPath(); x.moveTo(-26, 50); x.lineTo(-36, 100); x.lineTo(0, 92); x.lineTo(36, 100); x.lineTo(26, 50); x.closePath(); fill();
  x.beginPath(); x.moveTo(-12, 60); x.lineTo(-14, 90); x.moveTo(12, 60); x.lineTo(14, 90); line(3, BK);
  ell(0, 20, 40, 52); x.beginPath(); x.ellipse(0, 20, 40, 52, 0, 0, TAU); outline(5);
  for (let k = 0; k < 3; k++) { x.beginPath(); x.arc(0, 20 + k * 16, 16, .5, Math.PI - .5); line(3, BK); }
  // head
  dot(0, -46, 38); x.beginPath(); x.arc(0, -46, 38, 0, TAU); outline(5);
  x.beginPath(); x.moveTo(-12, -36); x.quadraticCurveTo(0, -30, 12, -36); x.quadraticCurveTo(8, -12, 0, -6); x.quadraticCurveTo(-8, -12, -12, -36); fill(BK);
  x.beginPath(); x.moveTo(-8, -30); x.quadraticCurveTo(0, -26, 8, -30); x.quadraticCurveTo(4, -16, 0, -12); x.quadraticCurveTo(-4, -16, -8, -30); fill();
  eye(-15, -54, 6.5, t, 2); eye(15, -54, 6.5, t, 2.3); cheek(-26, -40, 5); cheek(26, -40, 5);
}
// 3. marmot pops out of its burrow and whistles
function marmot(t) {
  const up = Math.max(0, per(t, 16)) ** .6;           // pops up
  // burrow mound
  x.beginPath(); x.ellipse(0, 120, 170, 46, 0, Math.PI, 0); fill();
  x.save(); x.beginPath(); x.rect(-200, -300, 400, 400); x.clip();
  x.save(); x.translate(0, 110 - up * 150);
  ell(0, 0, 66, 84); x.beginPath(); x.ellipse(0, 0, 66, 84, 0, 0, TAU); outline(5);
  ell(0, 18, 40, 52, BK); ell(0, 18, 36, 48);
  [-1, 1].forEach(sd => { ell(sd * 32, 40, 14, 9, WH, sd * .6); x.beginPath(); x.ellipse(sd * 32, 40, 14, 9, sd * .6, 0, TAU); outline(3.5); });
  // head
  dot(-40, -68, 12); dot(40, -68, 12); dot(-40, -68, 6, BK); dot(40, -68, 6, BK);
  dot(0, -50, 48); x.beginPath(); x.arc(0, -50, 48, 0, TAU); outline(5);
  ell(0, -30, 20, 14, BK); ell(0, -30, 17, 11);
  dot(0, -38, 5, BK);
  const wh = per(t, 16) > .6 ? 1 : 0;
  eye(-17, -58, 6, t, 3); eye(17, -58, 6, t, 3.3);
  if (wh) dot(0, -22, 4.5, BK); else smile(0, -28, 7, 3.5);
  x.beginPath(); x.roundRect(-8, -24, 7, 9, 2); x.roundRect(1, -24, 7, 9, 2); fill();
  x.restore(); x.restore();
  // burrow hole edge in front
  x.beginPath(); x.ellipse(0, 112, 80, 16, 0, 0, Math.PI); line(6, BK);
  if (per(t, 16) > .6) arcs(t, 52, -50 + (1 - up) * 150, 1, 3, 120);
}
// 4. smiling snowy mountain peak with a drifting cloud
function peak(t) {
  x.beginPath(); x.moveTo(-170, 130); x.lineTo(-30, -110); x.quadraticCurveTo(0, -136, 30, -110); x.lineTo(170, 130); x.closePath(); fill();
  // snow cap line
  x.beginPath(); x.moveTo(-82, -22); x.lineTo(-56, -6); x.lineTo(-30, -26); x.lineTo(-4, -4); x.lineTo(22, -26); x.lineTo(48, -6); x.lineTo(80, -24); line(5, BK);
  // little rocks
  [[-110, 100], [-60, 70], [90, 96], [40, 80]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a - 12, b); x.lineTo(a, b - 12); x.lineTo(a + 12, b); line(4, BK); });
  face(0, 34, 1.3, t, { sleepy: per(t, 10) > .4, ph: 4 });
  // cloud drifting past the peak
  const cxp = -220 + cyc(t, 12) * 440;
  x.save(); x.globalAlpha *= Math.sin(Math.PI * cyc(t, 12));
  [[-30, 0, 26], [0, -14, 32], [32, -2, 26], [56, 8, 18], [-52, 8, 18]].forEach(([a, b, r]) => { dot(cxp + a, -80 + b, r + 5, BK); });
  [[-30, 0, 26], [0, -14, 32], [32, -2, 26], [56, 8, 18], [-52, 8, 18]].forEach(([a, b, r]) => { dot(cxp + a, -80 + b, r); });
  x.restore();
}
// 5. shaggy yak with a swaying fringe
function yak(t) {
  [[-70], [-36], [40], [74]].forEach(([lx]) => { x.beginPath(); x.roundRect(lx - 10, 40, 20, 54, 7); fill(); x.beginPath(); x.roundRect(lx - 10, 84, 20, 10, 3); fill(BK); });
  ell(0, 10, 112, 62); x.beginPath(); x.ellipse(0, 10, 112, 62, 0, 0, TAU); outline(5);
  // shaggy hair fringe along the belly (sways)
  const sw = per(t, 20) * 8;
  for (let i = 0; i < 13; i++) { const px = -100 + i * 17; x.beginPath(); x.moveTo(px, 40); x.quadraticCurveTo(px + sw * .5, 62, px + sw, 78); line(4, BK); }
  // hump
  x.beginPath(); x.arc(-30, -36, 46, Math.PI * 1.05, Math.PI * 1.95); line(4, BK);
  x.beginPath(); x.moveTo(104, 0); x.quadraticCurveTo(130, 20, 120, 50); line(9); dot(120, 56, 9);
  // head
  x.save(); x.translate(-110, -6); x.rotate(per(t, 12) * .06);
  [-1, 1].forEach(sd => { x.beginPath(); x.moveTo(sd * 30, -30); x.quadraticCurveTo(sd * 70, -40, sd * 64, -78); line(11); });
  ell(0, 0, 46, 50); x.beginPath(); x.ellipse(0, 0, 46, 50, 0, 0, TAU); outline(5);
  for (let i = 0; i < 6; i++) { const px = -26 + i * 10.5; x.beginPath(); x.moveTo(px, -44); x.quadraticCurveTo(px + sw * .6, -28, px + sw * .3, -18); line(4, BK); }
  ell(0, 26, 24, 15, BK); ell(0, 26, 21, 12); dot(-8, 24, 3.5, BK); dot(8, 24, 3.5, BK);
  eye(-17, -2, 6.5, t, 5); eye(17, -2, 6.5, t, 5.3); cheek(-32, 12, 6); cheek(32, 12, 6);
  x.restore();
}
// 6. snowy pine tree drops a pinecone that bounces and rolls back up (periodic)
function pine(t) {
  x.beginPath(); x.roundRect(-16, 90, 32, 44, 4); fill();
  [[90, 130, 80], [30, 106, 74], [-26, 80, 68], [-76, 54, 60]].forEach(([by, hw, h], i) => { const sw = per(t + i * 6, 12) * 3;
    x.beginPath(); x.moveTo(-hw + sw, by); x.lineTo(sw * .5, by - h); x.lineTo(hw + sw, by); x.closePath(); fill();
    x.beginPath(); x.moveTo(-hw + 10 + sw, by - 2);
    for (let k = 0; k < 5; k++) x.quadraticCurveTo(-hw + 10 + sw + (k + .5) * (hw * 2 - 20) / 5, by + 8, -hw + 10 + sw + (k + 1) * (hw * 2 - 20) / 5, by - 2);
    line(4, BK); });
  dot(0, -134, 9);
  face(0, 44, .9, t, { ph: 6 });
  // pinecone: falls (k 0..0.3), bounces (0.3..0.5), rests, then floats back up
  const k = cyc(t, 10); let px = 80, py;
  if (k < .3) py = -40 + (k / .3) ** 2 * 170; else if (k < .5) py = 130 - Math.abs(Math.sin((k - .3) / .2 * Math.PI)) * 30; else if (k < .8) py = 130; else py = 130 - ((k - .8) / .2) * 170;
  x.save(); x.translate(px + (k > .3 && k < .8 ? (k - .3) * 60 : 0), py); x.rotate(k * TAU);
  ell(0, 0, 13, 18); x.beginPath(); x.ellipse(0, 0, 13, 18, 0, 0, TAU); outline(3);
  for (let j = -1; j <= 1; j++) { x.beginPath(); x.arc(0, j * 9, 10, .3, Math.PI - .3); line(2.5, BK); }
  x.restore();
}
// 7. fluffy wolf pup softly howling at a tiny moon
function wolfpup(t) {
  const how = Math.max(0, per(t, 12));
  x.save(); x.translate(150, -150); x.beginPath(); x.arc(0, 0, 26, .6, TAU - .6 + .001); x.arc(12, -6, 22, TAU - .9, .9, true); x.closePath(); fill(); x.restore();
  // sitting body
  ell(10, 70, 66, 70); x.beginPath(); x.ellipse(10, 70, 66, 70, 0, 0, TAU); outline(5);
  ell(10, 82, 30, 46, BK); ell(10, 82, 26, 42);
  x.beginPath(); x.moveTo(70, 110); x.quadraticCurveTo(130, 110 + per(t, 24) * 10, 120, 60); x.quadraticCurveTo(100, 96, 66, 92); fill();
  [-20, 40].forEach(px => { ell(px, 136, 22, 12); x.beginPath(); x.ellipse(px, 136, 22, 12, 0, 0, TAU); outline(4); });
  // head tilts up while howling
  x.save(); x.translate(0, -16); x.rotate(-how * .35);
  [-1, 1].forEach(sd => { x.beginPath(); x.moveTo(sd * 18, -40); x.lineTo(sd * 40, -88); x.lineTo(sd * 52, -34); x.closePath(); fill(); x.beginPath(); x.moveTo(sd * 26, -46); x.lineTo(sd * 40, -74); x.lineTo(sd * 44, -44); line(3.5, BK); });
  ell(0, -14, 54, 48); x.beginPath(); x.ellipse(0, -14, 54, 48, 0, 0, TAU); outline(5);
  // fluffy cheeks
  [-1, 1].forEach(sd => { for (let k = 0; k < 3; k++) { x.beginPath(); x.moveTo(sd * 50, -4 + k * 9); x.lineTo(sd * 62, k * 9); line(3.5, BK); } });
  ell(0, 10, 22, 16, BK); ell(0, 10, 19, 13); dot(0, 2, 6, BK);
  if (how > .3) { sleepyEye(-20, -22, 7, 4); sleepyEye(20, -22, 7, 4); ell(0, 20, 6, 4 + how * 6, BK); }
  else { eye(-20, -22, 7, t, 7); eye(20, -22, 7, t, 7.3); smile(0, 14, 7, 3.5); }
  x.restore();
  if (how > .3) { x.save(); x.globalAlpha *= (how - .3) / .7; arcs(t, 40, -110, 1, 3, 90); x.restore(); }
}
// 8. little round pika with big ears nibbling a flower
function pika(t) {
  const nib = Math.max(0, per(t, 30)) * .5 + .5 * Math.abs(per(t, 120));
  // flower
  x.beginPath(); x.moveTo(110, 120); x.quadraticCurveTo(118, 60, 96, 20); line(5);
  for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + per(t, 6) * .3; dot(96 + Math.cos(a) * 14, 14 + Math.sin(a) * 14, 10); }
  dot(96, 14, 8, BK); dot(96, 14, 5);
  ell(0, 60, 92, 72); x.beginPath(); x.ellipse(0, 60, 92, 72, 0, 0, TAU); outline(5);
  [-1, 1].forEach(sd => { ell(sd * 50, 128, 20, 9); x.beginPath(); x.ellipse(sd * 50, 128, 20, 9, 0, 0, TAU); outline(3.5); });
  // big round ears
  [-1, 1].forEach(sd => { dot(sd * 54, -26, 30); x.beginPath(); x.arc(sd * 54, -26, 30, 0, TAU); outline(5); dot(sd * 54, -24, 15, BK); dot(sd * 54, -24, 11); });
  ell(0, 20, 66, 54); x.beginPath(); x.ellipse(0, 20, 66, 54, 0, 0, TAU); outline(5);
  eye(-24, 10, 7, t, 8); eye(24, 10, 7, t, 8.3); cheek(-42, 26, 6); cheek(42, 26, 6);
  dot(0, 26, 6, BK);
  x.beginPath(); x.moveTo(-4, 32); x.lineTo(-4, 38 + nib * 4); x.moveTo(4, 32); x.lineTo(4, 38 + nib * 4); line(3, BK);
  // whiskers
  [-1, 1].forEach(sd => { for (let k = -1; k <= 1; k++) { x.beginPath(); x.moveTo(sd * 14, 30 + k * 4); x.lineTo(sd * 46, 26 + k * 10 + nib * 2 * sd); line(2.5, BK); } });
}
// 9. alpaca: fluffy neck, chewing, slow nod
function alpaca(t) {
  [[-56], [-26], [30], [58]].forEach(([lx]) => { x.beginPath(); x.roundRect(lx - 9, 50, 18, 66, 7); fill(); x.beginPath(); x.roundRect(lx - 11, 108, 22, 9, 4); fill(BK); });
  // fluffy body (bumpy outline)
  for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; dot(Math.cos(a) * 76, 30 + Math.sin(a) * 40, 24, BK); }
  for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; dot(Math.cos(a) * 74, 30 + Math.sin(a) * 38, 21); }
  ell(0, 30, 76, 42);
  dot(84, 10, 16);
  // neck + head (nods)
  x.save(); x.translate(-56, 4); x.rotate(per(t, 10) * .07);
  x.beginPath(); x.roundRect(-28, -130, 56, 140, 26); fill(); x.beginPath(); x.roundRect(-28, -130, 56, 140, 26); outline(5);
  for (let k = 0; k < 3; k++) { x.beginPath(); x.moveTo(-12 + k * 4, -96 + k * 34); x.quadraticCurveTo(-4 + k * 4, -90 + k * 34, -10 + k * 4, -82 + k * 34); line(3, BK); }
  x.translate(0, -150);
  [-1, 1].forEach(sd => { x.beginPath(); x.ellipse(sd * 22, -34, 9, 20, sd * .3, 0, TAU); fill(); x.beginPath(); x.ellipse(sd * 22, -34, 9, 20, sd * .3, 0, TAU); outline(3.5); });
  for (let k = 0; k < 5; k++) dot(-22 + k * 11, -26 - (k % 2) * 4, 11);
  ell(0, 0, 40, 36); x.beginPath(); x.ellipse(0, 0, 40, 36, 0, 0, TAU); outline(5);
  ell(0, 18, 20, 15, BK); ell(0, 18, 17, 12);
  const ch = (per(t, 160) + 1) / 2;
  dot(-6, 12, 3, BK); dot(6, 12, 3, BK);
  x.beginPath(); x.moveTo(-8 + ch * 3, 24); x.quadraticCurveTo(0, 28 + ch * 2, 8 + ch * 3, 24); line(3, BK);
  eye(-15, -6, 6, t, 9); eye(15, -6, 6, t, 9.3); cheek(-28, 6, 5); cheek(28, 6, 5);
  x.restore();
}
// 10. cable-car gondola swinging on its wire, a bunny waves from the window
function gondola(t) {
  x.beginPath(); x.moveTo(-220, -150); x.lineTo(220, -110); line(4);
  const sw = per(t, 12) * .12;
  x.save(); x.translate(0, -130); x.rotate(sw);
  dot(-14, -2, 9); dot(14, 2, 9); dot(-14, -2, 4, BK); dot(14, 2, 4, BK);
  x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 60); line(7);
  x.beginPath(); x.roundRect(-100, 60, 200, 170, 26); fill();
  x.beginPath(); x.roundRect(-82, 80, 164, 76, 16); fill(BK);
  // bunny in the window
  const wv = per(t, 24) * .5;
  x.save(); x.beginPath(); x.roundRect(-82, 80, 164, 76, 16); x.clip();
  [-1, 1].forEach(sd => { x.beginPath(); x.ellipse(sd * 12, 92, 8, 24, sd * .12, 0, TAU); fill(); });
  dot(0, 130, 28); eye(-10, 126, 4.5, t, 10); eye(10, 126, 4.5, t, 10.3); dot(0, 136, 3, BK); smile(0, 138, 5, 2.5);
  x.save(); x.translate(30, 150); x.rotate(-1.2 + wv); x.beginPath(); x.roundRect(-6, -30, 12, 32, 6); fill(); x.restore();
  x.restore();
  for (let k = 0; k < 4; k++) dot(-60 + k * 40, 196, 8, BK);
  x.beginPath(); x.moveTo(-100, 176); x.lineTo(100, 176); line(4, BK);
  x.restore();
}

// ---------- background: mountain ridges, stars, drifting snowflakes ----------
function bg(t) {
  for (let i = 0; i < 16; i++) { const tw = .5 + .5 * per(t + i * 13, 10 + (i % 4) * 4), side = i % 2 ? 1 : -1;
    const sx = 480 + side * (290 + hash(i + 53) * 170), sy = 26 + hash(i + 17) * 280;
    x.save(); x.globalAlpha *= tw; if (i % 4 === 0) { x.beginPath(); x.moveTo(sx, sy - 7); x.lineTo(sx + 2, sy - 2); x.lineTo(sx + 7, sy); x.lineTo(sx + 2, sy + 2); x.lineTo(sx, sy + 7); x.lineTo(sx - 2, sy + 2); x.lineTo(sx - 7, sy); x.lineTo(sx - 2, sy - 2); x.closePath(); fill(); } else dot(sx, sy, 2.2); x.restore(); }
  // mountain ridges along the bottom (outline only, with snowy tips)
  const R = [[0, 500], [70, 452], [120, 476], [190, 430], [260, 484], [330, 462], [400, 500], [560, 500], [630, 458], [700, 480], [770, 428], [840, 470], [900, 444], [960, 490]];
  x.beginPath(); R.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); line(3);
  [[190, 430], [770, 428], [70, 452], [900, 444]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a - 16, b + 14); x.lineTo(a, b); x.lineTo(a + 16, b + 14); x.lineTo(a + 8, b + 10); x.lineTo(a, b + 16); x.lineTo(a - 8, b + 10); x.closePath(); fill(); });
  x.beginPath(); x.moveTo(0, 524); x.lineTo(960, 524); line(2);
  // drifting snowflakes (slowly down, wrap)
  for (let i = 0; i < 14; i++) { const n = 2 + (i % 3), sx = 40 + hash(i + 61) * 880 + per(t + i * 7, 8) * 14, sy = ((hash(i + 29) * 560 + cyc(t, n) * 560) % 560) - 10;
    if (sx > 300 && sx < 660 && sy > 60 && sy < 440) continue;
    x.save(); x.globalAlpha *= .6; dot(sx, sy, 2.6); x.restore(); }
}

// outro: goat kid and marmot asleep together on a rock ledge under a crescent moon
function sleepyEnd(t) {
  const br = per(t, 8) * 2;
  x.save(); x.translate(200, -170); x.beginPath(); x.arc(0, 0, 46, .6, TAU - .6 + .001); x.arc(22, -10, 38, TAU - .9, .9, true); x.closePath(); fill(); sleepyEye(-18, 0, 7, 3.5); x.restore();
  // rock ledge
  x.beginPath(); x.moveTo(-220, 150); x.lineTo(-190, 60); x.lineTo(-60, 44); x.lineTo(110, 50); x.lineTo(210, 70); x.lineTo(230, 150); x.closePath(); fill();
  x.beginPath(); x.moveTo(-150, 100); x.lineTo(-90, 86); x.moveTo(60, 110); x.lineTo(130, 98); line(4, BK);
  // goat kid lying down (left)
  x.save(); x.translate(-70, 20 + br);
  ell(0, 0, 80, 34); x.beginPath(); x.ellipse(0, 0, 80, 34, 0, 0, TAU); outline(5);
  x.translate(-70, -24);
  [-1, 1].forEach(sd => { x.beginPath(); x.arc(sd * 14, -30, 14, sd < 0 ? Math.PI * 1.1 : -.1, sd < 0 ? Math.PI * 2.2 : Math.PI * -1.2, sd > 0); line(7); });
  ell(0, 0, 32, 36); x.beginPath(); x.ellipse(0, 0, 32, 36, 0, 0, TAU); outline(5);
  sleepyEye(-12, -2, 6, 4); sleepyEye(12, -2, 6, 4); smile(0, 12, 6, 3.5); cheek(-20, 10, 5); cheek(20, 10, 5);
  x.restore();
  // marmot curled up (right)
  x.save(); x.translate(90, 6 - br);
  ell(0, 0, 60, 46); x.beginPath(); x.ellipse(0, 0, 60, 46, 0, 0, TAU); outline(5);
  dot(-30, -40, 8); dot(30, -40, 8);
  ell(0, -10, 40, 32); x.beginPath(); x.ellipse(0, -10, 40, 32, 0, 0, TAU); outline(4);
  sleepyEye(-14, -14, 6, 4); sleepyEye(14, -14, 6, 4); dot(0, -4, 4, BK);
  x.restore();
  zzz(t, 10, -90);
}

const TDY = +(process.env.THUMBDY || 0);   // thumbnail only: move the figure down below the title
const up = f => t => { x.translate(0, -24 + TDY); f(t); };
L.scene({
  seed: 252,
  figs: [[up(goat), .8, 'sway'], [up(eagle), .8, 'fly'], [up(marmot), .82, 'sway'], [up(peak), .85, 'sway'], [up(yak), .78, 'sway'],
         [up(pine), .82, 'sway'], [up(wolfpup), .8, 'sway'], [up(pika), .82, 'sway'], [up(alpaca), .78, 'sway'], [up(gondola), .8, 'sway']],
  bg, end: up(sleepyEnd), scale: 1.3,
});
