// Daily B&W sensory #18: Flowers Bloom – friendly white flowers and garden things with happy faces on black:
// a tulip whose petals slowly open and close, a rose with a gently turning spiral, a round bud that unfolds into a water-lily flower,
// a watering can tilting and pouring drops, a flower pot where a sprout grows up and a little flower pops open, a seed in the soil that
// sprouts two leaves, a dandelion puff whose seeds drift away and come back, an arch of little bell flowers swinging in turn,
// a cactus in a pot with a flower on top waving its arm, and a big striped pinwheel flower whose petals slowly turn.
// Background: white grass tufts and tiny flower dots along the bottom, twinkling stars, drifting petals.
// Outro: the tulip asleep in its pot, petals closed, under a crescent moon, z z z.
// All figures are new drawings for this video (own design, no existing characters). Everything periodic in P = 240 s.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;
const P = L.P;

const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const cheek = (cx, cy, r = 7) => { x.save(); x.globalAlpha *= .45; dot(cx, cy, r, BK); x.restore(); };
const face = (cx, cy, s, t, ph = 0) => { eye(cx - 18 * s, cy, 8 * s, t, ph); eye(cx + 18 * s, cy, 8 * s, t, ph + .3); smile(cx, cy + 11 * s, 11 * s, 5 * s); cheek(cx - 32 * s, cy + 13 * s, 6 * s); cheek(cx + 32 * s, cy + 13 * s, 6 * s); };
const cyc = (t, n) => (((t * n / P) % 1) + 1) % 1;            // 0..1 saw, n times per period
const tri = k => 1 - Math.abs(k * 2 - 1);
const stem = (x0, y0, x1, y1, bend = 0, lw = 12) => { x.beginPath(); x.moveTo(x0, y0); x.quadraticCurveTo((x0 + x1) / 2 + bend, (y0 + y1) / 2, x1, y1); line(lw); };
const leafShape = (cx, cy, len, w, rot) => { x.save(); x.translate(cx, cy); x.rotate(rot); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(len / 2, -w, len, 0); x.quadraticCurveTo(len / 2, w, 0, 0); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(6, 0); x.lineTo(len - 10, 0); line(3, BK); x.restore(); };
function pot(cx, cy, w = 120, h = 90) {
  x.beginPath(); x.moveTo(cx - w / 2, cy); x.lineTo(cx + w / 2, cy); x.lineTo(cx + w * .38, cy + h); x.lineTo(cx - w * .38, cy + h); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.roundRect(cx - w / 2 - 10, cy - 18, w + 20, 26, 8); x.fillStyle = WH; x.fill(); x.beginPath(); x.roundRect(cx - w / 2 - 10, cy - 18, w + 20, 26, 8); line(5, BK);
}

function tulip(t) {
  const o = (per(t, 30) + 1) / 2;                       // petals open 0..1
  stem(0, 170, 0, 20, per(t, 20) * 10);
  leafShape(0, 140, 110, 30, -2.4); leafShape(0, 120, 110, 30, -.7);
  // three petals: side petals lean out when open
  [[-1, -.35 * o], [1, .35 * o]].forEach(([d, r]) => { x.save(); x.translate(d * 18, 10); x.rotate(r);
    x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(d * 70, -40, d * 34, -130); x.quadraticCurveTo(d * 4, -90, -d * 20, 0); x.closePath(); x.fillStyle = WH; x.fill(); line(5, BK); x.restore(); });
  x.beginPath(); x.moveTo(-55, -10); x.quadraticCurveTo(-62, -110, -30, -150); x.lineTo(0, -118); x.lineTo(30, -150); x.quadraticCurveTo(62, -110, 55, -10); x.quadraticCurveTo(0, 30, -55, -10); x.fillStyle = WH; x.fill(); line(5, BK);
  face(0, -62, 1, t);
}
function rose(t) {
  stem(0, 180, 0, 50, 12);
  leafShape(4, 130, 100, 28, -.5); leafShape(-4, 150, 90, 26, -2.7);
  dot(0, -20, 105);
  const sp = t * TAU * 3 / P;                            // slow turn
  x.save(); x.translate(0, -20); x.rotate(sp); x.beginPath(); for (let a = 0; a < TAU * 3.2; a += .08) { const r = 8 + a * 9.5; x.lineTo(Math.cos(a) * r, Math.sin(a) * r * .9); } line(6, BK); x.restore();
  // scalloped edge
  for (let i = 0; i < 10; i++) { const a = i * TAU / 10 + sp; dot(Math.cos(a) * 100, -20 + Math.sin(a) * 100, 18); }
  x.beginPath(); x.roundRect(-50, 46, 100, 46, 22); x.fillStyle = WH; x.fill(); x.beginPath(); x.roundRect(-50, 46, 100, 46, 22); line(4, BK);
  face(0, 66, .8, t, .7);
}
function lily(t) {
  // round bud unfolds into a water-lily flower, then closes again – floating on a lily pad
  const o = (per(t, 24) + 1) / 2;
  ell(0, 110, 170, 40); x.beginPath(); x.moveTo(0, 110); x.lineTo(150, 98); line(6, BK);
  for (let ring = 0; ring < 2; ring++) {
    const n = ring ? 6 : 8, len = (ring ? 130 : 185) * (.75 + .25 * o), spread = (ring ? .35 : .5) + (ring ? .45 : .75) * o;
    for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (i - (n - 1) / 2) / (n - 1) * spread * 2.2;
      x.save(); x.translate(0, 64); x.rotate(a + Math.PI / 2);
      x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(-46, -len * .35, -26, -len * .85, 0, -len); x.bezierCurveTo(26, -len * .85, 46, -len * .35, 0, 0); x.fillStyle = WH; x.fill(); line(4, BK); x.restore(); }
  }
  dot(0, 40, 40); x.beginPath(); x.arc(0, 40, 40, 0, 7); line(5, BK);
  face(0, 38, .8, t, 1.1);
}
function wateringCan(t) {
  const tilt = Math.max(0, per(t, 30)) * .45;
  x.save(); x.rotate(tilt);
  x.beginPath(); x.roundRect(-110, -60, 170, 140, 30); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(50, 30); x.lineTo(160, -50); line(20); x.save(); x.translate(168, -56); x.rotate(-.6); x.beginPath(); x.roundRect(-14, -24, 28, 48, 8); x.fillStyle = WH; x.fill(); x.restore();
  x.beginPath(); x.arc(-110, 10, 54, Math.PI * .5, Math.PI * 1.5); line(16);
  x.beginPath(); x.moveTo(-90, -60); x.quadraticCurveTo(-30, -130, 30, -60); line(14);
  [-60, -10, 40].forEach((px, i) => { x.beginPath(); x.arc(px, 50, 12, 0, 7); line(4, BK); });
  face(-25, 0, 1, t, .4);
  x.restore();
  // drops
  if (tilt > .2) for (let i = 0; i < 6; i++) { const k = cyc(t + i * .23, 180), dx = 196 + i * 6 - 40 * tilt, dy = 20 + k * 150;
    x.save(); x.globalAlpha *= (tilt - .2) / .25 * (1 - k); x.translate(dx - 30 + (i % 3) * 14, dy); x.beginPath(); x.moveTo(0, -10); x.quadraticCurveTo(8, 4, 0, 8); x.quadraticCurveTo(-8, 4, 0, -10); x.fillStyle = WH; x.fill(); x.restore(); }
}
function sprout(t) {
  // pot with a sprout that grows, then a little flower pops open; slowly back down (periodic)
  pot(0, 60, 150, 110);
  face(0, 112, .9, t, .2);
  const g = (1 - perc(t, 20)) / 2;                     // 0..1 growth
  const top = 50 - 40 - g * 140;
  stem(0, 46, 0, top, per(t, 40) * 8, 9);
  if (g > .25) { const k = Math.min(1, (g - .25) / .3); leafShape(0, top + 60, 50 * k, 16, -2.6); leafShape(0, top + 80, 50 * k, 16, -.5); }
  if (g > .6) { const k = Math.min(1, (g - .6) / .3);
    for (let i = 0; i < 6; i++) { const a = i * TAU / 6; dot(Math.cos(a) * 22 * k, top + Math.sin(a) * 22 * k, 15 * k); }
    dot(0, top, 12 * k, BK); dot(0, top, 7 * k); }
}
function seed(t) {
  // a seed with a face in the soil; two leaves unfurl and fold back
  const k = (per(t, 24) + 1) / 2;
  x.beginPath(); x.moveTo(-170, 80); x.quadraticCurveTo(0, 40, 170, 80); x.lineTo(170, 120); x.lineTo(-170, 120); x.closePath(); x.fillStyle = WH; x.fill();
  for (let i = 0; i < 9; i++) dot(-140 + i * 35, 96 + (i % 2) * 10, 5, BK);
  stem(0, 40, 0, -40 - 60 * k, 0, 9);
  leafShape(0, -40 - 60 * k, 40 + 50 * k, 22, -Math.PI + .5 - .3 * k); leafShape(0, -40 - 60 * k, 40 + 50 * k, 22, -.5 + .3 * k);
  ell(0, 40, 62, 48); x.beginPath(); x.ellipse(0, 40, 62, 48, 0, 0, 7); line(5, BK);
  x.beginPath(); x.moveTo(-20, 0); x.quadraticCurveTo(0, -6, 20, 0); line(4, BK);
  face(0, 42, .85, t, .9);
}
function dandelion(t) {
  // white puff ball made of little seeds; some fly off and drift up, the puff fills up again
  stem(0, 190, 0, 0, per(t, 30) * 12, 9);
  leafShape(0, 170, 90, 20, -2.8); leafShape(0, 160, 80, 20, -.4);
  dot(0, -40, 34);
  const fly = cyc(t, 24);
  for (let i = 0; i < 18; i++) { const a = i * TAU / 18, gone = i % 3 === 0 && fly > .2;
    if (gone) continue;
    const ex = Math.cos(a) * 92, ey = -40 + Math.sin(a) * 92;
    x.beginPath(); x.moveTo(Math.cos(a) * 30, -40 + Math.sin(a) * 30); x.lineTo(ex, ey); line(3);
    for (let j = 0; j < 5; j++) { const b = a + (j - 2) * .25; x.beginPath(); x.moveTo(ex, ey); x.lineTo(ex + Math.cos(b) * 16, ey + Math.sin(b) * 16); line(2.5); } }
  // flying seeds
  if (fly > .2) for (let i = 0; i < 6; i++) { const k = (fly - .2) / .8, a = (i * 3) * TAU / 18;
    const px = Math.cos(a) * 92 + k * (120 + i * 18) + Math.sin(k * 8 + i) * 14, py = -40 + Math.sin(a) * 92 - k * 160;
    x.save(); x.globalAlpha *= Math.min(1, (1 - k) * 4); x.beginPath(); x.moveTo(px, py); x.lineTo(px, py + 18); line(2.5); for (let j = 0; j < 5; j++) { const b = -Math.PI / 2 + (j - 2) * .4; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(b) * 12, py + Math.sin(b) * 12); line(2); } x.restore(); }
  face(0, -42, .7, t, .5);
}
function bells(t) {
  // arching stem with five little bell flowers swinging one after another
  x.beginPath(); x.moveTo(-150, 160); x.quadraticCurveTo(-120, -120, 150, -80); line(10);
  leafShape(-150, 160, 150, 40, -1.2);
  for (let i = 0; i < 5; i++) { const k = i / 4, px = -130 + k * 270, py = -40 - Math.sin(k * Math.PI) * 60 + k * 10;
    const sw = per(t + i * 3, 40) * .35;
    x.save(); x.translate(px, py); x.rotate(sw);
    x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 30); line(4);
    x.beginPath(); x.moveTo(-26, 80); x.quadraticCurveTo(-28, 30, 0, 28); x.quadraticCurveTo(28, 30, 26, 80); x.quadraticCurveTo(14, 70, 8, 82); x.quadraticCurveTo(0, 72, -8, 82); x.quadraticCurveTo(-14, 70, -26, 80); x.fillStyle = WH; x.fill();
    eye(-9, 52, 4.5, t, i * .4); eye(9, 52, 4.5, t, i * .4 + .3); x.beginPath(); x.arc(0, 60, 6, .3, Math.PI - .3); line(3, BK);
    x.restore(); }
}
function cactus(t) {
  pot(0, 90, 150, 90);
  const wave = per(t, 60) * .35;
  x.beginPath(); x.roundRect(-40, -110, 80, 200, 40); x.fillStyle = WH; x.fill();
  // left arm (still) and right arm (waves)
  x.beginPath(); x.moveTo(-40, 20); x.lineTo(-80, 20); x.lineTo(-80, -40); line(26);
  x.save(); x.translate(40, 0); x.rotate(-wave); x.beginPath(); x.moveTo(0, 0); x.lineTo(40, 0); x.lineTo(40, -70); line(26); x.restore();
  for (let i = 0; i < 8; i++) { const px = (i % 2 ? 18 : -18), py = -80 + i * 22; x.beginPath(); x.moveTo(px - 5, py); x.lineTo(px + 5, py); line(3, BK); }
  // flower on top
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * TAU / 5 + per(t, 20) * .1; dot(Math.cos(a) * 22, -118 + Math.sin(a) * 22, 15); }
  dot(0, -118, 10, BK); dot(0, -118, 5);
  face(0, -50, .85, t, .6);
}
function pinwheel(t) {
  stem(0, 190, 0, 40, 8, 10);
  leafShape(0, 150, 90, 26, -.6);
  const sp = t * TAU * 4 / P;
  x.save(); x.rotate(sp);
  for (let i = 0; i < 8; i++) { x.save(); x.rotate(i * TAU / 8);
    x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(-34, -70, 0, -128); x.quadraticCurveTo(34, -70, 0, 0); x.fillStyle = i % 2 ? WH : BK; x.fill(); line(5, WH);
    if (i % 2 === 0) { x.beginPath(); x.moveTo(0, -30); x.lineTo(0, -110); line(4); }
    x.restore(); }
  x.restore();
  dot(0, 0, 52); x.beginPath(); x.arc(0, 0, 52, 0, 7); line(5, BK);
  face(0, -4, .95, t, .8);
}

function bg(t) {
  // grass tufts and tiny flowers along the bottom
  for (let i = 0; i < 24; i++) { const gx = i * 42 + 6, sw = per(t + i * 7, 16) * 4;
    for (let j = -1; j <= 1; j++) { x.beginPath(); x.moveTo(gx + j * 7, 540); x.quadraticCurveTo(gx + j * 9 + sw * .5, 515, gx + j * 12 + sw, 490 + Math.abs(j) * 8); line(3.5); } }
  for (let i = 0; i < 9; i++) { const fx = 50 + i * 108 + hash(i) * 30, fy = 500 + hash(i + 3) * 18, s = 1 + .15 * per(t + i * 11, 12);
    for (let k = 0; k < 5; k++) { const a = k * TAU / 5; dot(fx + Math.cos(a) * 7 * s, fy + Math.sin(a) * 7 * s, 4.5 * s); } dot(fx, fy, 3, BK); }
  // twinkling stars across the top
  for (let i = 0; i < 14; i++) { const tw = (per(t + i * 9, 20 + (i % 5) * 4) + 1) / 2, sx = 30 + hash(i + 71) * 900, sy = 24 + hash(i + 17) * 100;
    if (sx > 300 && sx < 660) continue;
    x.save(); x.translate(sx, sy); x.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? 2 + tw * 2 : 5 + tw * 6, an = j * Math.PI / 5 - Math.PI / 2; x.lineTo(Math.cos(an) * r, Math.sin(an) * r); } x.closePath(); x.fillStyle = WH; x.fill(); x.restore(); }
  // petals drifting down at the sides
  for (let i = 0; i < 6; i++) { const k = cyc(t + i * 40, 10), sx = (i % 2 ? 880 : 80) + Math.sin(k * TAU * 2 + i) * 24, sy = 60 + k * 340;
    x.save(); x.globalAlpha = .75 * Math.sin(Math.PI * k); x.translate(sx, sy); x.rotate(k * TAU * 2 + i); ell(0, 0, 10, 5); x.restore(); }
}
// outro: the tulip asleep in its pot, petals closed, under a crescent moon
function sleepyEnd(t) {
  x.save(); x.translate(200, -150); dot(0, 0, 36); dot(14, -8, 32, BK); x.restore();
  const br = per(t, 8) * 2;
  x.save(); x.translate(0, br);
  pot(0, 70, 150, 100);
  stem(0, 56, 0, -20, 0, 10); leafShape(0, 40, 80, 22, -2.5); leafShape(0, 30, 80, 22, -.6);
  x.beginPath(); x.moveTo(-46, -20); x.quadraticCurveTo(-56, -110, 0, -140); x.quadraticCurveTo(56, -110, 46, -20); x.quadraticCurveTo(0, 6, -46, -20); x.fillStyle = WH; x.fill(); line(5, BK);
  x.beginPath(); x.moveTo(0, -140); x.quadraticCurveTo(-6, -80, 0, -10); line(4, BK);
  sleepyEye(-18, -66, 8); sleepyEye(18, -66, 8); cheek(-32, -52, 6); cheek(32, -52, 6);
  x.restore();
  for (let i = 0; i < 3; i++) { const k = (t * .25 + i / 3) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k);
    x.font = C.FONT(30 + i * 8); x.fillStyle = WH; x.textAlign = 'center'; x.fillText('z', 110 + k * 30, -110 - k * 100); x.restore(); }
}

const TDY = +(process.env.THUMBDY || 0);   // thumbnail only: move the figure down below the title
const up = f => t => { x.translate(0, -34 + TDY); f(t); };
L.scene({
  seed: 181,
  figs: [[up(tulip), .8, 'sway'], [up(rose), .8, 'sway'], [lily, .78, 'float'], [wateringCan, .78, 'sway'], [up(sprout), .8, 'sway'],
         [up(seed), .8, 'sway'], [up(dandelion), .78, 'sway'], [bells, .8, 'sway'], [up(cactus), .78, 'sway'], [up(pinwheel), .78, 'sway']],
  bg, end: up(sleepyEnd), scale: 1.3,
});
