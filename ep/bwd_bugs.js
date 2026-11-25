// Daily B&W sensory #22: Garden Bugs – friendly white garden bugs with happy faces on black:
// a little ant marching along carrying a big crumb (legs stepping in turn), a wiggly worm popping out of a soil mound and waving,
// a round beetle with a spotted shell that slowly opens and closes, a friendly spider swinging gently below a dew-drop web,
// a grasshopper hopping on its long bent legs, a roly-poly pill bug that rolls up into a striped ball and unrolls again,
// a fluffy moth with patterned wings flapping slowly, a cricket chirping with little sound arcs, a stick insect swaying on a twig,
// and an ant hill with little ants peeking out of its doors in turn.
// Background: grass blades and clover leaves along the bottom, twinkling stars at the top sides, drifting seed fluffs.
// Outro: a little worm and a little beetle asleep together under a mushroom, crescent moon, z z z.
// All figures are new drawings for this video (own design, no existing characters). Everything periodic in P = 240 s.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;
const P = L.P;

const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const cheek = (cx, cy, r = 7) => { x.save(); x.globalAlpha *= .45; dot(cx, cy, r, BK); x.restore(); };
const cyc = (t, n) => (((t * n / P) % 1) + 1) % 1;            // 0..1 saw, n times per period
const tri = k => 1 - Math.abs(1 - 2 * k);                       // 0..1..0
const sm = k => k * k * (3 - 2 * k);
function rrect(a, b, w, h, r) { x.beginPath(); x.roundRect(a, b, w, h, r); }
function star5(cx, cy, R, r, rot = 0) {
  x.beginPath(); for (let j = 0; j < 10; j++) { const rr = j % 2 ? r : R, an = j * Math.PI / 5 - Math.PI / 2 + rot; x.lineTo(cx + Math.cos(an) * rr, cy + Math.sin(an) * rr); } x.closePath();
}
const face = (cx, cy, s, t, ph = 0) => { eye(cx - 16 * s, cy, 8 * s, t, ph); eye(cx + 16 * s, cy, 8 * s, t, ph + .3); cheek(cx - 30 * s, cy + 14 * s, 6 * s); cheek(cx + 30 * s, cy + 14 * s, 6 * s); smile(cx, cy + 8 * s, 11 * s, 4.5 * s); };
const seg = (a, b, c, d, lw = 7) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); line(lw); };
const antenna = (a, b, c, d, r = 7) => { x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo((a + c) / 2 + (d - b) * .3, (b + d) / 2, c, d); line(5); dot(c, d, r); };

// 1. ant carrying a crumb, legs stepping in turn
function ant(t) {
  const st = per(t, 60), bob = Math.abs(st) * 4;
  x.save(); x.translate(0, -bob);
  // crumb held up high
  x.save(); x.translate(-10, -120 + bob * .5); x.rotate(per(t, 15) * .06);
  x.beginPath(); x.moveTo(-60, 10); x.lineTo(-40, -30); x.lineTo(10, -42); x.lineTo(58, -18); x.lineTo(52, 22); x.lineTo(-20, 30); x.closePath(); x.fillStyle = WH; x.fill();
  [[-30, -6], [0, -20], [26, 4], [-4, 12], [36, -12]].forEach(([a, b]) => dot(a, b, 5, BK));
  x.restore();
  // arms up holding the crumb
  seg(30, -34, 18, -88, 8); seg(52, -30, 44, -84, 8);
  // legs (3 pairs) stepping
  [-70, -20, 30].forEach((lx, i) => { const s = (i % 2 ? 1 : -1) * st * 14;
    seg(lx, 30, lx - 18 + s, 92, 8); seg(lx + 6, 30, lx + 22 - s, 92, 8); });
  // body: abdomen, middle, head
  ell(-90, 20, 62, 44); ell(-12, 18, 30, 24); ell(62, -12, 50, 46);
  dot(-96, 6, 6, BK); dot(-72, 30, 5, BK); dot(-108, 34, 4, BK);
  antenna(70, -54, 106, -100); antenna(52, -56, 40, -104);
  face(68, -14, .9, t, .4);
  x.restore();
}

// 2. wiggly worm popping out of a soil mound and waving
function worm(t) {
  const k = cyc(t, 10), up = sm(Math.min(1, Math.min(k, 1 - k) * 6)), wig = per(t, 40);
  // body as a thick curve, grows out of the mound
  const h = 40 + up * 150;
  x.save(); x.beginPath(); x.rect(-200, -260, 400, 360); x.clip();
  x.beginPath(); x.moveTo(0, 90);
  x.bezierCurveTo(30 * wig, 90 - h * .35, -40 * wig, 90 - h * .7, 10 * wig, 90 - h);
  line(54);
  // rings
  for (let i = 1; i < 5; i++) { const u = i / 5, px = (1 - u) ** 3 * 0 + 3 * (1 - u) ** 2 * u * 30 * wig + 3 * (1 - u) * u * u * -40 * wig + u ** 3 * 10 * wig, py = 90 - h * (u * .98);
    x.beginPath(); x.moveTo(px - 24, py); x.lineTo(px + 24, py); line(4, BK); }
  // head
  dot(10 * wig, 90 - h, 40);
  x.restore();
  if (up > .3) { x.save(); x.globalAlpha *= Math.min(1, (up - .3) * 3);
    face(10 * wig, 90 - h - 4, .95, t, .7);
    // little waving hat-leaf
    x.save(); x.translate(10 * wig + 20, 90 - h - 40); x.rotate(-.4 + per(t, 30) * .2);
    x.beginPath(); x.ellipse(14, -10, 26, 12, -.4, 0, TAU); x.fillStyle = WH; x.fill(); x.beginPath(); x.moveTo(-6, 2); x.lineTo(34, -22); line(3, BK); x.restore();
    x.restore(); }
  // soil mound in front
  x.beginPath(); x.moveTo(-150, 120); x.quadraticCurveTo(-110, 60, -50, 70); x.quadraticCurveTo(0, 50, 50, 70); x.quadraticCurveTo(110, 60, 150, 120); x.closePath(); x.fillStyle = WH; x.fill();
  [[-90, 100], [-40, 90], [20, 100], [70, 92], [100, 108], [-10, 108]].forEach(([a, b]) => dot(a, b, 5, BK));
}

// 3. round beetle with a little horn: striped shell slowly opens and closes
function beetle(t) {
  const op = sm(Math.max(0, per(t, 12))) * .45;
  // legs
  [-50, 0, 50].forEach((lx, i) => { const s = per(t + i * 3, 30) * 6; seg(lx - 10, 60, lx - 40, 104 + s, 8); seg(lx + 10, 60, lx + 40, 104 - s, 8); });
  // under-wings when open
  if (op > .02) { x.save(); x.globalAlpha *= op * 2;
    [-1, 1].forEach(d => { x.beginPath(); x.ellipse(d * 120, -10, 80, 34, d * -.5, 0, TAU); x.fillStyle = WH; x.fill(); x.beginPath(); x.ellipse(d * 120, -10, 66, 22, d * -.5, 0, TAU); line(3, BK); });
    x.restore(); }
  // shell halves
  [-1, 1].forEach(d => { x.save(); x.translate(0, -30); x.rotate(d * op);
    x.beginPath(); x.moveTo(0, -60); x.arc(0, 30, 92, -Math.PI / 2, Math.PI / 2, d < 0); x.closePath(); x.fillStyle = WH; x.fill();
    x.beginPath(); x.moveTo(0, -62); x.lineTo(0, 120); line(5, BK);
    // stripes across each shell half (not spots – this is a striped garden beetle)
    [-20, 20, 60].forEach(b => { x.beginPath(); x.moveTo(d * 8, b); x.quadraticCurveTo(d * 50, b + 14, d * 88, b - 4); line(9, BK); });
    x.restore(); });
  // head
  ell(0, -96, 56, 40);
  // little rounded horn
  x.beginPath(); x.moveTo(-10, -130); x.quadraticCurveTo(0, -176, 22, -168); x.quadraticCurveTo(10, -150, 12, -130); x.closePath(); x.fillStyle = WH; x.fill();
  antenna(-34, -124, -70, -156); antenna(34, -124, 70, -156);
  face(0, -100, .95, t, 1.1);
}

// 4. friendly spider swinging gently below a dew-drop web
function spider(t) {
  // simple radial half-web above
  x.save(); x.translate(0, -175);
  const R = [40, 75, 110];
  for (let i = 0; i <= 6; i++) { const an = Math.PI * (.08 + .84 * i / 6); x.beginPath(); x.moveTo(0, 0); x.lineTo(-Math.cos(an) * 140, Math.sin(an) * 60); line(2.5); }
  R.forEach((r, j) => { x.beginPath(); for (let i = 0; i <= 6; i++) { const an = Math.PI * (.08 + .84 * i / 6); x.lineTo(-Math.cos(an) * r * 140 / 140, Math.sin(an) * r * 60 / 140 + 0); } line(2.5); });
  for (let i = 0; i < 5; i++) { const an = Math.PI * (.2 + .15 * i), r = R[(i % 3)], g = (per(t + i * 11, 10) + 1) / 2;
    dot(-Math.cos(an) * r, Math.sin(an) * r * 60 / 140 + 6, 4 + g * 3); }
  x.restore();
  // swinging thread + spider
  const sw = per(t, 20) * .22;
  x.save(); x.translate(0, -150); x.rotate(sw);
  x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 150); line(3);
  x.translate(0, 210);
  // 8 legs, 4 each side, wiggling
  for (let i = 0; i < 4; i++) { const w = per(t + i * 4, 40) * 6, y0 = -22 + i * 16;
    [-1, 1].forEach(d => { x.beginPath(); x.moveTo(d * 40, y0); x.quadraticCurveTo(d * 90, y0 - 40 + i * 10, d * (108 + i * 4), y0 + 30 + w * d); line(7); }); }
  dot(0, 0, 62);
  face(0, -6, 1.1, t, .2);
  x.restore();
}

// 5. grasshopper hopping on long bent legs
function grasshopper(t) {
  const k = cyc(t, 24), hop = k < .3 ? Math.sin(k / .3 * Math.PI) : 0, y = -hop * 70, fold = hop;
  x.save(); x.translate(0, y);
  // long back leg (bent knee up)
  x.beginPath(); x.moveTo(-40, 20); x.lineTo(-90 + fold * 10, -50 - fold * 10); x.lineTo(-130 - fold * 40, 70 + fold * 20); line(13);
  // front legs
  seg(40, 40, 30, 92 + fold * 8, 8); seg(70, 34, 80, 92 + fold * 8, 8); seg(0, 44, -14, 92 + fold * 8, 8);
  // long body + wing
  ell(-10, 20, 110, 36, WH, -.08);
  x.beginPath(); x.ellipse(-30, 6, 86, 20, -.12, 0, TAU); line(4, BK);
  for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(-90 + i * 34, 2); x.lineTo(-70 + i * 34, 18); line(3, BK); }
  // head
  ell(104, -4, 46, 42);
  antenna(110, -42, 150, -150, 6); antenna(96, -44, 70, -150, 6);
  face(110, -6, .85, t, .9);
  x.restore();
  // little landing dust lines
  if (k > .3 && k < .4) { const a = 1 - (k - .3) / .1; x.save(); x.globalAlpha *= a;
    [-1, 1].forEach(d => { seg(d * 60, 110, d * 100, 104, 4); seg(d * 70, 122, d * 112, 122, 4); }); x.restore(); }
}

// 6. roly-poly pill bug rolls into a striped ball and back
function pillbug(t) {
  const k = cyc(t, 20), r = sm(Math.min(1, Math.max(0, (tri(k) - .2) / .6)));   // 0 = stretched, 1 = ball
  const roll = r * per(t, 16) * .3;
  x.save(); x.rotate(roll);
  // stretched shape: long rounded body with 7 plates; ball: circle
  const L = 120 * (1 - r) + 0, Rr = 70 + r * 22;
  if (r < .98) {
    // legs under (hide as it rolls)
    x.save(); x.globalAlpha *= 1 - r;
    for (let i = 0; i < 7; i++) { const lx = -100 + i * 33, w = per(t + i * 2, 50) * 6; seg(lx, 40, lx - 8 + w, 82, 6); }
    x.restore();
  }
  x.beginPath(); x.roundRect(-L - Rr, -Rr, 2 * (L + Rr), 2 * Rr, Rr); x.fillStyle = WH; x.fill();
  // plates
  for (let i = 1; i < 7; i++) { const px = -L - Rr + i * 2 * (L + Rr) / 7;
    x.beginPath(); if (r > .5) x.arc(0, 0, Rr * i / 7 * 1, 0, TAU); else { x.moveTo(px, -Rr + 6); x.quadraticCurveTo(px + 10, 0, px, Rr - 6); }
    line(4, BK); }
  x.restore();
  // face (on the right end when stretched, in the middle when ball)
  const fx = (1 - r) * (L + 30), fy = (1 - r) * -6;
  x.save(); x.globalAlpha *= 1; x.beginPath(); x.arc(fx, fy, 44, 0, TAU); x.fillStyle = WH; x.fill();
  if (r > .5) sleepyEye(fx - 14, fy - 4, 8, 4), sleepyEye(fx + 14, fy - 4, 8, 4), smile(fx, fy + 8, 9, 4);
  else face(fx, fy - 2, .8, t, .6);
  x.restore();
  if (r < .5) { antenna(L + 30, -40, L + 70, -100, 6); antenna(L + 14, -42, L + 0, -104, 6); }
}

// 7. fluffy moth with patterned wings flapping slowly
function moth(t) {
  const f = (per(t, 24) + 1) / 2, sx = .7 + .3 * f;
  [-1, 1].forEach(d => { x.save(); x.scale(d * sx, 1);
    // upper + lower wing
    x.beginPath(); x.moveTo(10, -10); x.bezierCurveTo(60, -130, 170, -110, 160, -30); x.quadraticCurveTo(110, 10, 10, 10); x.fillStyle = WH; x.fill();
    x.beginPath(); x.moveTo(10, 10); x.bezierCurveTo(90, 10, 130, 60, 100, 100); x.quadraticCurveTo(50, 120, 10, 40); x.fillStyle = WH; x.fill();
    // patterns: eye-spot + scallops
    dot(96, -50, 26, BK); dot(96, -50, 13, WH); dot(96, -50, 6, BK);
    for (let i = 0; i < 4; i++) dot(40 + i * 28, -4 + (i % 2) * 4, 6, BK);
    x.beginPath(); x.arc(70, 64, 18, 0, TAU); line(4, BK);
    x.restore(); });
  // fluffy body
  ell(0, 20, 26, 74);
  for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(-20, 30 + i * 18); x.quadraticCurveTo(0, 38 + i * 18, 20, 30 + i * 18); line(3.5, BK); }
  // head with feathery antennae
  dot(0, -66, 38);
  [-1, 1].forEach(d => { x.beginPath(); x.moveTo(d * 12, -96); x.quadraticCurveTo(d * 30, -140, d * 66, -150); line(4);
    for (let i = 1; i < 5; i++) { const px = d * (12 + i * 12), py = -100 - i * 11; seg(px, py, px + d * 8, py - 12, 3); seg(px, py, px - d * 4, py - 12, 3); } });
  face(0, -68, .8, t, .5);
}

// 8. cricket sitting upright on a little mushroom, chirping with sound arcs and floating notes
function cricket(t) {
  const k = cyc(t, 30), ch = k < .5 ? Math.abs(Math.sin(k * 2 * Math.PI * 4)) : 0;
  // mushroom seat
  rrect(-26, 60, 52, 70, 14); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-110, 66); x.quadraticCurveTo(-100, 10, 0, 6); x.quadraticCurveTo(100, 10, 110, 66); x.closePath(); x.fillStyle = WH; x.fill();
  [[-60, 40, 10], [10, 26, 12], [64, 46, 9]].forEach(([a, b, r]) => dot(a, b, r, BK));
  // upright body
  x.beginPath(); x.ellipse(0, -40, 44, 62, 0, 0, TAU); x.fillStyle = WH; x.fill();
  // wings on the back, rubbing (lift outwards)
  [-1, 1].forEach(d => { x.save(); x.translate(d * 30, -50); x.rotate(d * (.35 + ch * .15));
    x.beginPath(); x.ellipse(0, 0, 22, 60, 0, 0, TAU); x.fillStyle = WH; x.fill(); x.beginPath(); x.ellipse(0, 0, 22, 60, 0, 0, TAU); line(4, BK);
    for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(-14, -36 + i * 22); x.quadraticCurveTo(0, -28 + i * 22, 14, -36 + i * 22); line(3, BK); }
    x.restore(); });
  // big folded back legs on the mushroom
  [-1, 1].forEach(d => { x.beginPath(); x.moveTo(d * 30, -4); x.lineTo(d * 78, -44); x.lineTo(d * 90, 10); line(11); });
  // little arms
  seg(-20, -40, -46, -10, 6); seg(20, -40, 46, -10, 6);
  // head with long antennae
  dot(0, -122, 42);
  antenna(-14, -158, -70, -176, 6); antenna(14, -158, 70, -176, 6);
  face(0, -124, .85, t, .3);
  // sound arcs both sides + rising notes
  for (let i = 0; i < 3; i++) { const a = ch * (1 - i * .25); if (a <= 0.05) continue; x.save(); x.globalAlpha *= a;
    [-1, 1].forEach(d => { x.beginPath(); x.arc(0, -60, 90 + i * 22, d > 0 ? -.5 : Math.PI - .3, d > 0 ? .3 : Math.PI + .5); line(5); });
    x.restore(); }
  for (let i = 0; i < 2; i++) { const nk = cyc(t + i * 4, 30); if (nk > .55) continue; const q = nk / .55;
    x.save(); x.globalAlpha *= Math.sin(q * Math.PI); const nx = (i ? 1 : -1) * (130 + q * 20), ny = -40 - q * 110;
    ell(nx, ny, 10, 8, WH, -.4); seg(nx + 9, ny - 2, nx + 9, ny - 34, 4); seg(nx + 9, ny - 34, nx + 20, ny - 26, 4); x.restore(); }
}

// 9. stick insect swaying on a twig
function stick(t) {
  const sw = per(t, 12) * .07;
  // twig
  x.beginPath(); x.moveTo(-170, 110); x.quadraticCurveTo(0, 90, 170, 120); line(14);
  seg(80, 102, 120, 70, 8); x.beginPath(); x.ellipse(132, 58, 22, 11, -.7, 0, TAU); x.fillStyle = WH; x.fill();
  seg(-90, 104, -120, 72, 8); x.beginPath(); x.ellipse(-130, 58, 20, 10, .7, 0, TAU); x.fillStyle = WH; x.fill();
  x.save(); x.translate(0, 100); x.rotate(sw);
  // long thin legs to the twig
  [[-60, -40, -110, 0], [-20, -60, -40, 0], [20, -80, 50, 0], [-60, -40, -20, 0], [20, -80, 100, -2]].forEach(([a, b, c, d]) => { x.beginPath(); x.moveTo(a, b); x.lineTo((a + c) / 2, b - 30); x.lineTo(c, d - 4); line(5); });
  // long body going up diagonally
  x.beginPath(); x.moveTo(-110, -20); x.lineTo(60, -110); line(18);
  [[-70, -41], [-30, -62], [10, -83]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a - 6, b - 12); x.lineTo(a + 6, b + 12); line(3, BK); });
  // head
  dot(84, -126, 34);
  antenna(96, -156, 150, -220, 5); antenna(78, -158, 60, -230, 5);
  face(86, -128, .7, t, 1.3);
  // front arms waving
  const wv = per(t, 30) * 12;
  x.beginPath(); x.moveTo(60, -100); x.lineTo(110, -150 + wv); line(5);
  x.restore();
}

// 10. ant hill with little ants peeking out of doors in turn
function anthill(t) {
  // hill
  x.beginPath(); x.moveTo(-170, 110); x.quadraticCurveTo(-90, 100, -40, -60); x.quadraticCurveTo(0, -120, 40, -60); x.quadraticCurveTo(90, 100, 170, 110); x.closePath(); x.fillStyle = WH; x.fill();
  // little flag on top
  x.beginPath(); x.moveTo(0, -96); x.lineTo(0, -170); line(5);
  const fw = per(t, 30) * 8; x.beginPath(); x.moveTo(0, -170); x.quadraticCurveTo(30, -164 + fw, 56, -158); x.lineTo(0, -140); x.closePath(); x.fillStyle = WH; x.fill();
  // grains
  [[-80, 80], [-30, 50], [40, 70], [90, 90], [10, 20], [-60, 30], [60, 30], [-120, 100], [120, 100]].forEach(([a, b]) => dot(a, b, 4, BK));
  // 3 doors with ants peeking in turn
  const D = [[-58, 60], [0, -30], [64, 50]];
  D.forEach(([a, b], i) => {
    const k = cyc(t + i * 8 * P / 240, 15), p = sm(Math.min(1, Math.max(0, (Math.min(k, .6 - k) * 8))));
    x.save(); x.beginPath(); x.ellipse(a, b, 26, 30, 0, 0, TAU); x.fillStyle = BK; x.fill(); x.clip();
    if (p > 0) { const yy = b + 30 - p * 34;
      dot(a, yy, 20); eye(a - 7, yy - 2, 4, t, i); eye(a + 7, yy - 2, 4, t, i + .3); smile(a, yy + 5, 5, 3); }
    x.restore();
    if (p > 0) { x.save(); x.globalAlpha *= p; antenna(a - 6, b - 12 + (1 - p) * 20, a - 18, b - 46, 4); antenna(a + 6, b - 12 + (1 - p) * 20, a + 18, b - 46, 4); x.restore(); }
  });
}

// ---------- background ----------
function bg(t) {
  // grass blades + clover along the bottom sides
  for (let i = 0; i < 40; i++) { const gx = 8 + i * 24 + hash(i + 3) * 10; if (gx > 300 && gx < 660) continue;
    const h = 30 + hash(i + 9) * 46, sw = per(t + i * 7, 6 + (i % 4)) * 6;
    x.beginPath(); x.moveTo(gx - 5, 540); x.quadraticCurveTo(gx + sw * .5, 540 - h * .6, gx + sw, 540 - h); x.quadraticCurveTo(gx + 2 + sw * .5, 540 - h * .6, gx + 5, 540); x.fillStyle = WH; x.fill(); }
  [[70, 500], [230, 512], [740, 506], [890, 498]].forEach(([cx, cy], i) => { const r = per(t + i * 13, 4) * .1;
    x.save(); x.translate(cx, cy); x.rotate(r);
    x.beginPath(); x.moveTo(0, 10); x.lineTo(0, 40); line(4);
    for (let j = 0; j < 3; j++) { x.save(); x.rotate(j * TAU / 3); x.beginPath(); x.arc(-7, -9, 9, 0, TAU); x.arc(7, -9, 9, 0, TAU); x.fillStyle = WH; x.fill(); x.restore(); }
    x.restore(); });
  // twinkling stars at the top sides
  for (let i = 0; i < 14; i++) { const tw = (per(t + i * 9, 20 + (i % 5) * 4) + 1) / 2, sx = 20 + hash(i + 71) * 920, sy = 18 + hash(i + 29) * 110;
    if (sx > 250 && sx < 710) continue;
    star5(sx, sy, 4 + tw * 5, 2 + tw * 2); x.fillStyle = WH; x.fill(); }
  // drifting seed fluffs at the sides
  for (let i = 0; i < 6; i++) { const k = cyc(t + hash(i) * P, 4 + (i % 3)), side = i % 2 ? 1 : -1;
    const sx = 480 + side * (330 + hash(i + 5) * 100) + Math.sin(k * TAU * 2 + i) * 20, sy = 450 - k * 330;
    x.save(); x.globalAlpha *= Math.sin(k * Math.PI);
    seg(sx, sy, sx, sy + 12, 2); for (let j = 0; j < 6; j++) { const an = -Math.PI / 2 + (j - 2.5) * .35; seg(sx, sy, sx + Math.cos(an) * 12, sy + Math.sin(an) * 12, 2); }
    x.restore(); }
}

// outro: little worm and beetle asleep under a mushroom, crescent moon
function sleepyEnd(t) {
  const br = per(t, 8) * 3;
  // moon top-left
  x.save(); x.translate(-250, -160);
  x.beginPath(); x.arc(0, 0, 50, .9, TAU - .9); x.arc(26, -8, 42, TAU - 1.25, 1.25, true); x.closePath(); x.fillStyle = WH; x.fill();
  sleepyEye(-26, -6, 8, 4);
  x.restore();
  // mushroom
  rrect(-30, -40, 60, 150, 20); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-170, -30); x.quadraticCurveTo(-150, -170, 0, -175); x.quadraticCurveTo(150, -170, 170, -30); x.closePath(); x.fillStyle = WH; x.fill();
  [[-90, -80, 18], [0, -130, 22], [80, -70, 16], [-30, -60, 10], [120, -110, 10]].forEach(([a, b, r]) => dot(a, b, r, BK));
  // ground line
  x.beginPath(); x.moveTo(-200, 112); x.lineTo(200, 112); line(5);
  // sleeping worm (left), curled
  x.save(); x.translate(-150, 62 + br * .5); x.scale(1.4, 1.4);
  x.beginPath(); x.roundRect(-64, -8, 92, 34, 17); x.fillStyle = BK; x.fill(); x.beginPath(); x.roundRect(-60, -4, 84, 26, 13); x.fillStyle = WH; x.fill();
  [-40, -24, -8].forEach(a => { x.beginPath(); x.moveTo(a, -2); x.lineTo(a, 20); line(3, BK); });
  dot(36, 4, 29, BK); dot(36, 4, 25);
  sleepyEye(28, 2, 6, 3.5); sleepyEye(46, 2, 6, 3.5); cheek(30, 14, 4);
  x.restore();
  // sleeping beetle (right)
  x.save(); x.translate(150, 60 + br * .5); x.scale(1.4, 1.4);
  x.beginPath(); x.arc(0, 10, 47, Math.PI, 0); x.closePath(); x.fillStyle = BK; x.fill();
  x.beginPath(); x.arc(0, 10, 43, Math.PI, 0); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(0, -34); x.lineTo(0, 10); line(4, BK); [-12, 2].forEach(b => { x.beginPath(); x.moveTo(-36, b); x.quadraticCurveTo(-18, b - 8, -4, b); x.moveTo(4, b); x.quadraticCurveTo(18, b - 8, 36, b); line(5, BK); });
  dot(-50, -4, 25, BK); dot(-50, -4, 21); sleepyEye(-58, -6, 5, 3.5); sleepyEye(-44, -6, 5, 3.5);
  x.restore();
  // leaf blanket over both
  x.beginPath(); x.moveTo(-200, 110); x.quadraticCurveTo(-120, 70, 0, 84); x.quadraticCurveTo(120, 70, 200, 110); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-180, 104); x.quadraticCurveTo(-110, 82, 0, 92); x.quadraticCurveTo(110, 82, 180, 104); line(3, BK);
  for (let i = 0; i < 3; i++) { const k = (t * .25 + i / 3) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k);
    x.font = C.FONT(28 + i * 8); x.fillStyle = WH; x.textAlign = 'center'; x.fillText('z', 170 + k * 30, -10 - k * 90); x.restore(); }
}

const TDY = +(process.env.THUMBDY || 0);   // thumbnail only: move the figure down below the title
const up = f => t => { x.translate(0, -24 + TDY); f(t); };
L.scene({
  seed: 222,
  figs: [[up(ant), .8, 'sway'], [up(worm), .82, 'sway'], [up(beetle), .8, 'sway'], [up(spider), .74, 'sway'], [up(grasshopper), .78, 'sway'],
         [up(pillbug), .8, 'sway'], [up(moth), .8, 'sway'], [up(cricket), .7, 'sway'], [up(stick), .76, 'sway'], [up(anthill), .8, 'sway']],
  bg, end: up(sleepyEnd), scale: 1.3,
});
