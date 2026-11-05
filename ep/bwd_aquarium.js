// Daily B&W sensory #4: Aquarium – white aquarium friends on black: angelfish, fancy goldfish, snail, little castle with a
// fish peeking out, toy diver helmet that bubbles, shrimp, guppy family, smiling water plant, clam with a pearl, ray.
// Background: wavy water surface with soft light beams, an air-stone bubble column, round pebbles and broad-leaf tank plants.
// All figures are new drawings for this video (own design). Figures look LEFT.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;

const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
function bubbles(t, ox, oy, n = 4, spread = 30, h = 140, sp = .5) {
  for (let i = 0; i < n; i++) { const k = (t * sp + i / n) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k);
    x.beginPath(); x.arc(ox + Math.sin(k * TAU + i) * spread * .3, oy - k * h, 6 + i % 3 * 3, 0, 7); line(4); x.restore(); }
}

function angelfish(t) {
  const fin = per(t, 30) * .08;
  // tall fins top + bottom
  x.save(); x.rotate(fin);
  x.beginPath(); x.moveTo(-40, -40); x.quadraticCurveTo(10, -170, 70, -160); x.quadraticCurveTo(40, -90, 50, -30); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-40, 40); x.quadraticCurveTo(10, 170, 70, 160); x.quadraticCurveTo(40, 90, 50, 30); x.closePath(); x.fill();
  x.restore();
  // body (diamond-round), tail
  x.beginPath(); x.moveTo(-120, 0); x.quadraticCurveTo(-60, -85, 40, -60); x.quadraticCurveTo(95, -30, 100, 0); x.quadraticCurveTo(95, 30, 40, 60); x.quadraticCurveTo(-60, 85, -120, 0); x.fill();
  x.save(); x.translate(98, 0); x.rotate(per(t, 40) * .12);
  x.beginPath(); x.moveTo(0, 0); x.lineTo(60, -45); x.quadraticCurveTo(50, 0, 60, 45); x.closePath(); x.fillStyle = WH; x.fill(); x.restore();
  // bold stripes
  x.save(); x.beginPath(); x.moveTo(-120, 0); x.quadraticCurveTo(-60, -85, 40, -60); x.quadraticCurveTo(95, -30, 100, 0); x.quadraticCurveTo(95, 30, 40, 60); x.quadraticCurveTo(-60, 85, -120, 0); x.clip();
  [-30, 20, 68].forEach((sx, i) => { x.fillStyle = BK; x.fillRect(sx, -100, 16 - i * 2, 200); });
  x.restore();
  // long trailing feelers
  [[-10, 60, 20], [6, 64, 30]].forEach(([a, b, l]) => { x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo(a - 10, b + 50, a + per(t, 20) * 10, b + 90 + l); line(5); });
  eye(-78, -8, 12, t); smile(-98, 18, 12, 5);
}
function goldfish(t) {
  // round fancy goldfish with a big flowing double tail
  const w = per(t, 24);
  for (let i = 0; i < 2; i++) {
    x.save(); x.translate(70, 0); x.rotate((i ? .45 : -.45) + w * .12 * (i ? 1 : -1));
    x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(50, -40, 110, -30, 130, 10); x.bezierCurveTo(100, 0, 70, 20, 0, 6); x.closePath(); x.fillStyle = WH; x.fill();
    for (let k = 0; k < 3; k++) { x.beginPath(); x.moveTo(20, 4); x.quadraticCurveTo(70, -10 + k * 6, 112, 2 + k * 6); line(4, BK); }
    x.restore();
  }
  ell(-10, 0, 90, 74);
  // scales (little arcs)
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4 - r % 2; c++) { x.beginPath(); x.arc(-10 + c * 24 + (r % 2) * 12, -30 + r * 26, 11, .2, Math.PI - .2); line(4, BK); }
  // top fin + side fin
  x.beginPath(); x.moveTo(-30, -70); x.quadraticCurveTo(10, -125, 50, -60); x.fillStyle = WH; x.fill();
  x.save(); x.translate(-20, 40); x.rotate(.5 + per(t, 36) * .2); x.beginPath(); x.ellipse(0, 18, 12, 26, 0, 0, 7); line(5, BK); x.restore();
  eye(-62, -18, 14, t, .2); x.beginPath(); x.arc(-88, 16, 8, 0, 7); line(5, BK);   // little "o" mouth
  bubbles(t, -110, -40, 3, 20, 90, .6);
}
function snail(t) {
  const stretch = 1 + per(t, 12) * .05;
  // foot
  x.save(); x.scale(stretch, 1);
  x.beginPath(); x.moveTo(-150, 60); x.quadraticCurveTo(-130, 20, -95, 30); x.lineTo(120, 40); x.quadraticCurveTo(150, 52, 140, 66); x.lineTo(-150, 66); x.closePath(); x.fillStyle = WH; x.fill();
  x.restore();
  // shell with spiral
  dot(30, -20, 95);
  x.beginPath(); for (let a = 0; a < TAU * 2.6; a += .1) { const r = 80 - a * 11; x.lineTo(30 + Math.cos(a + 1) * r, -20 + Math.sin(a + 1) * r); } line(9, BK);
  // head + eye stalks
  x.beginPath(); x.ellipse(-120, 20, 36, 30, 0, 0, 7); x.fillStyle = WH; x.fill();
  [[-140, -4], [-108, -2]].forEach(([a, b], i) => { const wob = per(t, 20 + i * 4) * 6; x.beginPath(); x.moveTo(a, b + 10); x.lineTo(a - 12 + wob, b - 52); line(8); dot(a - 12 + wob, b - 58, 14); eye(a - 14 + wob, b - 58, 7, t, i * .2); });
  smile(-128, 26, 12, 5);
}
function castle(t) {
  x.fillStyle = WH;
  x.fillRect(-120, -40, 240, 160);
  // towers with crenellations
  [[-130, -130, 70], [60, -130, 70], [-35, -170, 70]].forEach(([a, b, w]) => {
    x.fillRect(a, b, w, 140 + (b === -170 ? 40 : 0));
    for (let i = 0; i < 3; i++) x.fillRect(a + i * (w / 3) + 2, b - 20, w / 3 - 8, 22);
  });
  // windows + door
  [[-95, -90], [95, -90], [0, -125]].forEach(([a, b]) => { x.beginPath(); x.roundRect(a - 12, b - 18, 24, 34, [12, 12, 0, 0]); x.fillStyle = BK; x.fill(); });
  x.beginPath(); x.roundRect(-38, 40, 76, 80, [38, 38, 0, 0]); x.fillStyle = BK; x.fill();
  // a little fish peeks out of the door now and then
  const peek = Math.max(0, per(t, 10));
  if (peek > .05) { x.save(); x.beginPath(); x.roundRect(-38, 40, 76, 80, [38, 38, 0, 0]); x.clip();
    x.translate(30 - peek * 50, 82); ell(0, 0, 34, 22); x.beginPath(); x.moveTo(30, 0); x.lineTo(54, -16); x.lineTo(54, 16); x.closePath(); x.fillStyle = WH; x.fill();
    eye(-14, -4, 6, t, .3); smile(-22, 6, 6, 3); x.restore(); }
  // flags
  [[-95, -150], [95, -150], [0, -190]].forEach(([a, b], i) => { x.beginPath(); x.moveTo(a, b); x.lineTo(a, b - 40); line(5); const f = per(t + i * 10, 24) * 6;
    x.beginPath(); x.moveTo(a, b - 40); x.quadraticCurveTo(a - 16, b - 36 + f, a - 32, b - 32); x.lineTo(a, b - 24); x.closePath(); x.fillStyle = WH; x.fill(); });
  // brick lines
  for (let r = 0; r < 3; r++) { x.beginPath(); x.moveTo(-120, -10 + r * 22); x.lineTo(-45, -10 + r * 22); x.moveTo(45, -10 + r * 22); x.lineTo(120, -10 + r * 22); line(3, BK); }
  bubbles(t, 0, -132, 4, 20, 150, .4);
}
function helmet(t) {
  // toy diver helmet: round dome with a big face window, bubbling from the top
  dot(0, 0, 120);
  x.fillStyle = WH; x.fillRect(-100, 80, 200, 50); x.beginPath(); x.roundRect(-120, 118, 240, 30, 10); x.fill();
  dot(0, -6, 74, BK); dot(0, -6, 62);
  [[-90, -60], [90, -60], [-90, 50], [90, 50]].forEach(([a, b]) => { dot(a, b, 16, BK); dot(a, b, 9); });
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; dot(Math.cos(a) * 68, -6 + Math.sin(a) * 68, 4, WH); }
  // happy face looking through the window
  eye(-22, -16, 11, t); eye(22, -16, 11, t, .3); smile(0, 10, 20, 6);
  x.beginPath(); x.moveTo(0, -120); x.lineTo(0, -150); line(14);
  bubbles(t, 0, -160, 5, 40, 120, .55);
}
function shrimp(t) {
  const legs = per(t, 60);
  // curved segmented body
  for (let i = 0; i < 6; i++) { const a = -1.9 + i * .42, r = 95; ell(Math.cos(a) * r + 40, Math.sin(a) * r + 60, 34 - i * 2, 26 - i * 2, WH, a + Math.PI / 2); }
  for (let i = 1; i < 6; i++) { const a = -1.9 + i * .42 - .21; x.beginPath(); x.moveTo(Math.cos(a) * 70 + 40, Math.sin(a) * 70 + 60); x.lineTo(Math.cos(a) * 120 + 40, Math.sin(a) * 120 + 60); line(4, BK); }
  // tail fan
  x.save(); x.translate(132, 98); x.rotate(-.2 + per(t, 20) * .1);
  for (let k = -1; k <= 1; k++) { x.beginPath(); x.ellipse(k * 14, 22, 10, 26, k * .3, 0, 7); x.fillStyle = WH; x.fill(); } x.restore();
  // head
  ell(-60, -20, 60, 44);
  eye(-80, -30, 12, t); smile(-92, -2, 10, 5);
  // long antennae + little legs
  [[-100, -50, -230, -120], [-95, -44, -200, -160]].forEach(([a, b, c, d], i) => { x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo((a + c) / 2, b - 60 + per(t, 16 + i * 4) * 14, c, d); line(5); });
  for (let i = 1; i < 6; i++) { const a = -1.9 + i * .42, w = legs * (i % 2 ? 6 : -6); x.beginPath(); x.moveTo(Math.cos(a) * 74 + 40, Math.sin(a) * 74 + 60); x.lineTo(Math.cos(a) * 46 + 40 + w, Math.sin(a) * 46 + 72); line(6); }
}
function guppy(t) {
  // a guppy with a big fan tail and two tiny friends following
  const w = per(t, 30) * .14;
  const fish = (cx, cy, s, ph) => {
    x.save(); x.translate(cx, cy); x.scale(s, s);
    x.save(); x.translate(40, 0); x.rotate(w + ph);
    x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(70, -90, 130, -60); x.quadraticCurveTo(150, 0, 130, 60); x.quadraticCurveTo(70, 90, 0, 0); x.fillStyle = WH; x.fill();
    for (let k = -2; k <= 2; k++) { x.beginPath(); x.moveTo(14, 0); x.lineTo(120, k * 24); line(4, BK); }
    for (let k = 0; k < 4; k++) dot(80 + (k % 2) * 20, -30 + k * 20, 6, BK);
    x.restore();
    ell(-10, 0, 62, 30);
    eye(-42, -6, 10, t, ph); smile(-56, 10, 7, 4);
    x.restore();
  };
  fish(-30, 0, 1, 0);
  fish(150, -120, .45, .5); fish(170, 100, .4, 1);
}
function plant(t) {
  // a smiling water plant in a little pot, leaves waving
  x.beginPath(); x.moveTo(-70, 80); x.lineTo(70, 80); x.lineTo(55, 160); x.lineTo(-55, 160); x.closePath(); x.fillStyle = WH; x.fill();
  x.fillRect(-82, 70, 164, 22);
  eye(-24, 115, 9, t); eye(24, 115, 9, t, .3); smile(0, 128, 12, 5);
  const leaf = (ang, len, ph) => { x.save(); x.translate(0, 70); x.rotate(ang + per(t + ph * 20, 12) * .1);
    x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(-36, -len * .5, 0, -len); x.quadraticCurveTo(36, -len * .5, 0, 0); x.fillStyle = WH; x.fill();
    x.beginPath(); x.moveTo(0, -6); x.lineTo(0, -len + 14); line(4, BK);
    for (let k = 1; k < 4; k++) { const yy = -len * k / 4; x.beginPath(); x.moveTo(0, yy); x.lineTo(-16, yy - 14); x.moveTo(0, yy); x.lineTo(16, yy - 14); line(3, BK); }
    x.restore(); };
  leaf(-.9, 160, 0); leaf(.9, 160, 1); leaf(-.4, 210, 2); leaf(.4, 210, 3); leaf(0, 240, 4);
}
function clam(t) {
  const open = .55 + .45 * Math.max(0, per(t, 8));
  // bottom shell
  x.beginPath(); x.moveTo(-150, 20); x.quadraticCurveTo(0, 150, 150, 20); x.closePath(); x.fillStyle = WH; x.fill();
  for (let i = -3; i <= 3; i++) { x.beginPath(); x.moveTo(0, 70); x.lineTo(i * 40, 22); line(4, BK); }
  // pearl with a tiny face
  dot(0, 0, 40); dot(-22, -20, 7, BK); dot(-22, -20, 4);
  eye(-12, 2, 5, t); eye(12, 2, 5, t, .3); smile(0, 10, 7, 3);
  // top shell (opens and closes)
  x.save(); x.translate(0, 20); x.rotate(0);
  x.translate(0, -open * 95);
  x.beginPath(); x.moveTo(-150, 0); x.quadraticCurveTo(0, -150, 150, 0); x.quadraticCurveTo(0, -20, -150, 0); x.fillStyle = WH; x.fill();
  for (let i = -3; i <= 3; i++) { x.beginPath(); x.moveTo(0, -100); x.lineTo(i * 40, -14); line(4, BK); }
  eye(-40, -50, 10, t, .5); eye(40, -50, 10, t, .8); smile(0, -38, 18, 5);
  x.restore();
}
function ray(t) {
  // gliding ray, wing tips gently flapping, long tail
  const f = per(t, 24) * 18;
  x.beginPath(); x.moveTo(-110, 0);
  x.bezierCurveTo(-60, -40, -10, -110 - f, 60, -140 - f); x.quadraticCurveTo(50, -50, 110, 0);
  x.quadraticCurveTo(50, 50, 60, 140 + f); x.bezierCurveTo(-10, 110 + f, -60, 40, -110, 0); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(105, 0); x.quadraticCurveTo(180, 10 + per(t, 20) * 12, 240, -6); line(8);
  for (let i = 0; i < 5; i++) dot(20 + (i % 2) * 22, -50 + i * 25, 7, BK);
  eye(-60, -22, 11, t); eye(-60, 22, 11, t, .2); smile(-84, 0, 12, 5);
}

function bg(t) {
  // wavy water surface + soft light beams from above
  x.beginPath(); x.moveTo(0, 0); for (let i = 0; i <= 960; i += 12) x.lineTo(i, 26 + Math.sin(i * .02 + TAU * 6 * t / L.P) * 5); x.lineTo(960, 0); x.closePath(); x.fillStyle = WH; x.fill();
  // (no grey light beams: the series stays pure black & white)
  // air-stone bubble column (right) – each bubble rises 10x per period
  for (let i = 0; i < 12; i++) { const k = ((t * 10 / L.P) + i / 12) % 1; x.save(); x.globalAlpha = .65 * Math.min(1, (1 - k) * 4);
    x.beginPath(); x.arc(880 + Math.sin(k * TAU * 2 + i) * 8, 470 - k * 440, 4 + (i % 3) * 2.5, 0, 7); line(3); x.restore(); }
  ell(880, 476, 16, 8);
  // gravel: round pebbles along the bottom
  for (let i = 0; i < 40; i++) { const px = i * 24 + (hash(i) - .5) * 10, r = 9 + hash(i + 7) * 7; dot(px, 512 + hash(i + 3) * 8, r); dot(px - r * .3, 512 + hash(i + 3) * 8 - r * .3, r * .25, BK); }
  x.fillStyle = WH; x.fillRect(0, 522, 960, 18);
  // broad-leaf tank plants at both sides
  [[50, 1], [110, .7], [800, .8]].forEach(([sx, s], j) => { for (let q = -1; q <= 1; q++) { x.save(); x.translate(sx + q * 10, 506); x.rotate(q * .3 + per(t + (j * 3 + q) * 11, 6) * .06);
    x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(-18 * s, -70 * s, 0, -130 * s); x.quadraticCurveTo(18 * s, -70 * s, 0, 0); x.fillStyle = WH; x.fill();
    x.beginPath(); x.moveTo(0, -6); x.lineTo(0, -120 * s); line(3, BK); x.restore(); } });
}
// outro: a sleepy goldfish resting on a pebble, little zzz bubbles
function sleepyEnd(t) {
  ell(0, 130, 150, 32);
  x.save(); x.translate(0, 20 + per(t, 12) * 6);
  x.save(); x.translate(80, 10); x.rotate(per(t, 24) * .08);
  x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(40, -50, 100, -40, 110, 0); x.bezierCurveTo(100, 40, 40, 50, 0, 0); x.fillStyle = WH; x.fill(); x.restore();
  ell(0, 10, 95, 62);
  sleepyEye(-45, 0, 12, 6); smile(-60, 26, 10, 5);
  x.restore();
  for (let i = 0; i < 3; i++) { const k = (t * .25 + i / 3) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k);
    x.beginPath(); x.arc(-100 - k * 30, -40 - k * 110, 8 + i * 4, 0, 7); line(4); x.restore(); }
}

L.scene({
  seed: 47,
  figs: [[angelfish, .8, 'swimL'], [goldfish, .9, 'swimR'], [snail, .9, 'floor'], [castle, .85, 'sway'], [helmet, .85, 'sway'],
         [shrimp, .85, 'floor'], [guppy, .9, 'swimL'], [plant, .8, 'sway'], [clam, .9, 'sway'], [ray, .9, 'fly']],
  bg, end: sleepyEnd,
});
