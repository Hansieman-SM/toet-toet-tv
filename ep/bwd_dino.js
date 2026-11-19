// Daily B&W sensory #16: Dinosaur Babies – friendly white dinosaur friends with happy faces on black: a long-neck dino slowly nodding
// its head (spotted back), a horned dino with three soft rounded horns and a scalloped frill wagging its tail, a cracked egg whose top
// shell lifts so a baby dino peeks out and blinks, a little hatchling hopping along (squash shadow, tiny back spikes), a calm smiling
// mountain-volcano puffing little round smiling clouds (no fire), a big fern with swaying fronds and an unrolling curl, a trail of
// three-toed footprints appearing one by one up to a waving baby dino, a flying dino gliding with flapping wings, a plated dino walking
// slowly with stepping legs, and a prehistoric palm tree with a little dino peeking out from behind the trunk.
// Background: twinkling stars, rolling hills with grass tufts, star dust drifting up.
// Outro: baby dino asleep curled up in its eggshell in a twig nest under a crescent moon, z z z.
// All figures are new drawings for this video (own design, no existing characters). Figures look LEFT. Everything periodic in P = 240 s.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;
const P = L.P;

const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const cheek = (cx, cy, r = 7) => { x.save(); x.globalAlpha *= .45; dot(cx, cy, r, BK); x.restore(); };
const outlineEll = (cx, cy, rx, ry, lw = 5, rot = 0, col = BK) => { x.beginPath(); x.ellipse(cx, cy, rx, ry, rot, 0, 7); line(lw, col); };
const star4 = (cx, cy, r, col = WH) => { x.beginPath(); for (let k = 0; k < 8; k++) { const rr = k % 2 ? r * .3 : r, an = k * Math.PI / 4; k ? x.lineTo(cx + Math.cos(an) * rr, cy + Math.sin(an) * rr) : x.moveTo(cx + rr, cy); } x.closePath(); x.fillStyle = col; x.fill(); };
const leg = (lx, ly, w, h, col = WH) => { x.fillStyle = col; x.beginPath(); x.roundRect(lx - w / 2, ly, w, h, w * .45); x.fill();
  [-w * .22, w * .22].forEach(d => { x.beginPath(); x.moveTo(lx + d, ly + h - 9); x.lineTo(lx + d, ly + h); line(3, BK); }); };
const blob = (pts, col = WH) => { x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); x.fillStyle = col; x.fill(); };

function longneck(t) {
  // long-neck dino, slowly nodding its head; spotted back, tail curving to the right
  const nod = per(t, 24) * .12, tw = per(t, 30) * .12;
  x.save(); x.translate(110, 70); x.rotate(tw); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(70, 10, 110, -30); line(30); x.beginPath(); x.moveTo(90, -14); x.quadraticCurveTo(110, -26, 124, -46); line(16); x.restore();
  [[-30, 0], [10, 1], [70, 0], [104, 1]].forEach(([lx, j]) => { leg(lx, 70, 32, 70); if (j) { x.beginPath(); x.moveTo(lx - 16, 74); x.lineTo(lx - 16, 136); line(4, BK); } });
  ell(40, 64, 100, 58);
  [[20, 30, 12], [60, 26, 10], [94, 46, 9], [-10, 44, 8], [44, 56, 7]].forEach(([a, b, r]) => dot(a, b, r, BK));
  // neck + head (rotates around the shoulder)
  x.save(); x.translate(-30, 40); x.rotate(nod);
  x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(-40, -40, -50, -100, -70, -150); line(44);
  x.save(); x.translate(-82, -166);
  ell(-6, 0, 46, 32);
  eye(-14, -10, 9, t); smile(-28, 6, 10, 4); cheek(4, 8, 8);
  dot(-44, -4, 3.5, BK);
  x.restore();
  x.restore();
}
function horned(t) {
  // horned dino with three soft rounded horns and a scalloped frill, wagging its tail
  const wag = per(t, 40) * .25, nod = per(t, 20) * .05;
  x.save(); x.translate(120, 60); x.rotate(wag); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(50, 0, 86, 30); line(30); x.restore();
  [[-10, 0], [24, 1], [86, 0], [116, 1]].forEach(([lx, j]) => leg(lx, 70, 34, 56));
  ell(54, 50, 92, 58);
  // back plates pattern: little black arcs
  [10, 50, 90].forEach(a => { x.beginPath(); x.arc(a, 34, 16, Math.PI * 1.1, Math.PI * 1.9); line(5, BK); });
  x.save(); x.translate(-40, 10); x.rotate(nod);
  // frill
  x.beginPath(); x.arc(20, -20, 82, Math.PI * .95, Math.PI * 2.05); x.closePath(); x.fillStyle = WH; x.fill();
  for (let i = 0; i < 7; i++) { const an = Math.PI * (1.0 + i * .167); dot(20 + Math.cos(an) * 66, -20 + Math.sin(an) * 66, 8, BK); }
  x.beginPath(); x.arc(20, -20, 52, Math.PI * 1.05, Math.PI * 1.95); line(5, BK);
  // two brow horns (soft, rounded tips) + small nose horn
  [[-14, -46, -.5], [26, -54, -.15]].forEach(([a, b, r]) => { x.save(); x.translate(a, b); x.rotate(r); x.beginPath(); x.moveTo(-12, 10); x.quadraticCurveTo(-6, -30, 0, -46); x.quadraticCurveTo(6, -30, 12, 10); x.closePath(); x.fillStyle = WH; x.fill(); line(4, BK); x.restore(); });
  ell(-16, 6, 62, 44); outlineEll(-16, 6, 62, 44, 5);
  x.save(); x.translate(-68, -8); x.rotate(-.35); blob([[-8, 8], [0, -26], [8, 8]]); dot(0, -26, 5); x.restore();
  eye(-26, -8, 10, t); eye(4, -6, 9, t, .4); smile(-40, 16, 12, 5); cheek(10, 18, 8);
  dot(-68, 10, 3.5, BK);
  x.restore();
}
function eggPeek(t) {
  // a big cracked egg: the top shell lifts and tilts, a baby dino peeks out and blinks; grass nest around the bottom
  const k = (per(t, 20) + 1) / 2, lift = k * k * (3 - 2 * k), Y = 0;
  const crack = []; for (let i = 0; i <= 8; i++) crack.push([-96 + i * 24, Y + (i % 2 ? -16 : 12)]);
  // baby dino head (behind the lower shell, rises with the lift)
  x.save(); x.translate(0, 30 - lift * 70);
  ell(0, -6, 58, 50); outlineEll(0, -6, 58, 50, 5);
  [-30, -6, 18].forEach((a, i) => blob([[a - 10, -48 + i * 2], [a, -72 + i * 4], [a + 10, -48 + i * 2]]));
  eye(-22, -14, 10, t); eye(16, -14, 10, t, .4); smile(-2, 6, 14, 5); cheek(-40, 10); cheek(36, 10);
  x.restore();
  // lower shell
  x.save(); x.beginPath(); x.moveTo(-130, 200); x.lineTo(-130, crack[0][1]); crack.forEach(([a, b]) => x.lineTo(a, b)); x.lineTo(130, crack[8][1]); x.lineTo(130, 200); x.closePath(); x.clip();
  ell(0, 10, 96, 118); [[-40, 70, 12], [30, 90, 9], [56, 40, 8]].forEach(([a, b, r]) => dot(a, b, r, BK));
  x.restore();
  x.beginPath(); crack.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); line(5, BK);
  // upper shell, lifted and tilted
  x.save(); x.translate(30, -lift * 96); x.rotate(lift * .35); x.translate(-30, 0);
  x.save(); x.beginPath(); x.moveTo(-130, -200); x.lineTo(-130, crack[0][1]); crack.forEach(([a, b]) => x.lineTo(a, b)); x.lineTo(130, crack[8][1]); x.lineTo(130, -200); x.closePath(); x.clip();
  ell(0, 10, 96, 118); [[-30, -60, 10], [34, -80, 7]].forEach(([a, b, r]) => dot(a, b, r, BK));
  x.restore();
  x.beginPath(); crack.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); line(4, WH);
  x.restore();
  // grass nest
  for (let i = 0; i < 15; i++) { const gx = -130 + i * 18.5, h = 26 + hash(i + 5) * 22, sw = per(t + i, 20) * 4;
    x.beginPath(); x.moveTo(gx, 136); x.quadraticCurveTo(gx + sw, 136 - h / 2, gx + (i % 2 ? 10 : -10) + sw, 136 - h); line(6); }
  x.fillStyle = WH; x.fillRect(-150, 134, 300, 8);
}
function hatchling(t) {
  // a little baby dino hopping along: big head, tiny arms, little back spikes
  const ph = (t * 60 / P) % 1, hop = Math.max(0, Math.sin(ph * TAU)) * 26;
  ell(10, 128, 80 - hop, 7);
  x.save(); x.translate(0, -hop);
  x.beginPath(); x.moveTo(60, 70); x.quadraticCurveTo(120, 80, 140, 40); line(22);
  [[-6], [44]].forEach(([lx]) => { leg(lx, 80, 30, 40); ell(lx - 8, 120, 22, 9); });
  ell(24, 56, 66, 52);
  ell(10, 70, 36, 26, BK); ell(10, 70, 32, 22);
  [[20, -2], [56, 10], [86, 34], [112, 46]].forEach(([a, b], i) => { x.save(); x.translate(a, b); x.rotate(.3 + i * .25); blob([[-12, 4], [0, -18], [12, 4]]); x.restore(); });
  // tiny arm
  x.save(); x.translate(-30, 60); x.rotate(-.6 + per(t, 60) * .3); x.fillStyle = WH; x.beginPath(); x.roundRect(-8, 0, 16, 30, 8); x.fill(); x.restore();
  ell(-36, -24, 58, 48);
  eye(-54, -34, 11, t); eye(-18, -36, 9, t, .4);
  smile(-52, -10, 13, 5); cheek(-12, -6, 9); dot(-88, -26, 3.5, BK);
  x.restore();
}
function volcano(t) {
  // calm smiling mountain-volcano puffing little round smiling clouds (no fire)
  for (let i = 0; i < 1; i++) { const k = ((t * 20 / P) + i / 3) % 1, px = -10 + Math.sin(k * TAU + i) * 18 + k * 30, py = -112 - k * 66, r = 18 + k * 20;
    const g = Math.min(1, k * 6, (1 - k) * 6); if (g <= .02) continue; x.save(); x.translate(px, py); x.scale(g, g); x.translate(-px, -py);
    dot(px - r * .6, py + 4, r * .7); dot(px + r * .6, py + 4, r * .7); dot(px, py - r * .3, r * .85);
    if (i === 0 || k > .3) { eye(px - 7, py - 2, 3.5, t, i); eye(px + 7, py - 2, 3.5, t, i + .3); smile(px, py + 4, 5, 2.5); }
    x.restore(); }
  blob([[-160, 130], [-40, -86], [40, -86], [160, 130]]);
  // rim + snowcap-like zigzag band
  x.beginPath(); x.moveTo(-40, -86); for (let i = 0; i <= 8; i++) x.lineTo(-56 + i * 14, -54 + (i % 2 ? 12 : -4)); x.lineTo(56, -54); line(6, BK);
  ell(0, -86, 40, 9, BK); ell(0, -88, 34, 6);
  // stripes at the bottom
  [[-130, 108, 130], [-110, 78, 110]].forEach(([a, b, c]) => { x.beginPath(); x.moveTo(a, b); for (let i = 0; i <= 10; i++) x.lineTo(a + i * (c - a) / 10, b + (i % 2 ? 6 : -6)); line(4, BK); });
  eye(-30, 0, 11, t); eye(30, 0, 11, t, .4); smile(0, 18, 18, 6); cheek(-56, 30, 10); cheek(56, 30, 10);
}
function fern(t) {
  // a big fern: three fronds swaying, an unrolling curl in the middle, a little smiling stone at its foot
  const fronds = [[-60, -.5, 1], [60, .5, 2], [0, -.05, 3]];
  fronds.forEach(([bx, ang, i]) => {
    const sw = per(t + i * 5, 20) * .1;
    x.save(); x.translate(bx * .3, 120); x.rotate(ang + sw);
    x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(10, -120, -10, -230); line(7);
    for (let k = 1; k < 11; k++) { const yy = -k * 21, cx = 10 * Math.sin(k * .2) - k * 1.0, len = 54 - k * 4;
      [-1, 1].forEach(s => { x.save(); x.translate(cx, yy); x.rotate(s * (1.0 - k * .03)); ell(0, -len / 2, 9 - k * .4, len / 2); x.restore(); }); }
    x.restore(); });
  // the unrolling curl (fiddlehead) to the right
  const u = (per(t, 20) + 1) / 2;
  x.save(); x.translate(110, 120);
  x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(10, -60, 0, -100);
  const turns = 1.6 - u * 1.0; for (let k = 0; k <= 30; k++) { const a = k / 30 * turns * TAU, r = 30 * (1 - k / 34); x.lineTo(-30 + Math.cos(a) * r * -1 + 30, -100 - Math.sin(a) * r); }
  line(9); x.restore();
  // smiling stone
  ell(-30, 128, 70, 30); eye(-50, 124, 7, t); eye(-10, 124, 7, t, .4); smile(-30, 132, 9, 4);
}
function footprints(t) {
  // three-toed footprints appear one by one along a winding trail, leading to a waving baby dino
  const k = (t * 20 / P) % 1, n = Math.floor(k * 9);
  const pts = [0, 1, 2, 3, 4, 5, 6].map(i => [170 - i * 50, 92 - i * 6 + (i % 2 ? -14 : 14)]);
  pts.forEach(([a, b], i) => {
    if (i >= n) return;
    const fresh = clamp01((k * 9 - i) / .6), r = i % 2 ? .25 : -.25;
    const sc = .8 * (.3 + .7 * fresh); x.save(); x.translate(a, b); x.rotate(-Math.PI / 2 + r * .5); x.scale(sc, sc);
    ell(0, 6, 13, 17); [-.55, 0, .55].forEach(o => { x.save(); x.rotate(o); ell(0, -24, 5, 9); x.restore(); });
    x.restore(); });
  // baby dino at the end of the trail, waving
  x.save(); x.translate(-130, -70);
  x.beginPath(); x.moveTo(30, 40); x.quadraticCurveTo(80, 50, 96, 20); line(18);
  leg(-6, 50, 24, 34); leg(26, 50, 24, 34);
  ell(10, 36, 46, 36);
  x.save(); x.translate(-24, 26); x.rotate(-2.2 + per(t, 60) * .5); x.fillStyle = WH; x.beginPath(); x.roundRect(-7, 0, 14, 34, 7); x.fill(); x.restore();
  ell(-14, -24, 40, 34);
  [-6, 14, 32].forEach((a, i) => { x.save(); x.translate(a, -50 + i * 8); x.rotate(.4 + i * .3); blob([[-8, 4], [0, -14], [8, 4]]); x.restore(); });
  eye(-28, -30, 8, t); eye(-2, -30, 7, t, .4); smile(-22, -14, 9, 4); cheek(4, -12, 6);
  x.restore();
}
const clamp01 = v => Math.max(0, Math.min(1, v));
function ptero(t) {
  // flying dino gliding with big flapping wings, a crest on its head
  const fl = per(t, 60), wy = fl * 40;
  // far wing
  blob([[10, -6], [100, -60 - wy * .8], [150, -20 - wy * .6], [60, 20]]);
  x.beginPath(); x.moveTo(30, 6); x.lineTo(110, -40 - wy * .7); line(4, BK);
  // body + tail
  ell(20, 10, 70, 30);
  x.beginPath(); x.moveTo(80, 14); x.lineTo(130, 30); line(6); blob([[124, 22], [146, 30], [124, 40]]);
  // near wing
  blob([[0, 4], [-30, -90 - wy], [60, -70 - wy * .9], [70, 16]]);
  x.beginPath(); x.moveTo(20, 6); x.lineTo(-10, -70 - wy * .95); x.moveTo(30, 6); x.lineTo(40, -60 - wy * .85); line(4, BK);
  // head with crest and long beak
  x.save(); x.translate(-60, -10); x.rotate(per(t, 30) * .06);
  blob([[10, -20], [70, -46], [30, -6]]);
  ell(0, 0, 36, 28); outlineEll(0, 0, 36, 28, 4);
  blob([[-24, -8], [-96, 10], [-26, 16]]); x.beginPath(); x.moveTo(-28, 6); x.lineTo(-84, 10); line(3, BK);
  eye(-6, -6, 9, t); cheek(14, 10, 7);
  x.restore();
  // little feet tucked under
  [10, 34].forEach(a => { x.beginPath(); x.moveTo(a, 36); x.lineTo(a + 6, 54); line(6); });
}
function stego(t) {
  // plated dino walking slowly: stepping legs, a row of plates with dots, tail spikes
  const st = TAU * t * 40 / P, bob = per(t, 80) * 3;
  ell(20, 132, 150, 6);
  [[-60, 0], [-20, Math.PI], [70, 0], [110, Math.PI]].forEach(([lx, o]) => { const s = Math.sin(st + o) * 9, up = Math.max(0, Math.cos(st + o)) * 6; leg(lx + s, 66, 34, 64 - up); });
  x.save(); x.translate(0, bob);
  // plates
  [[-50, -10, .8], [-6, -34, 1], [40, -40, 1.05], [86, -30, 1], [126, -6, .8]].forEach(([a, b, s], i) => { x.save(); x.translate(a, b); x.scale(s, s); x.rotate((i - 2) * .22);
    blob([[0, 26], [-30, 0], [0, -46], [30, 0]]); blob([[0, 12], [-12, 0], [0, -22], [12, 0]], BK); x.restore(); });
  // tail with spikes
  x.save(); x.translate(150, 50); x.rotate(per(t, 20) * .12); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(50, 4, 90, -16); line(24);
  [[70, -20, -.4], [88, -28, .2]].forEach(([a, b, r]) => { x.save(); x.translate(a, b); x.rotate(r); blob([[-6, 4], [0, -26], [6, 4]]); x.restore(); }); x.restore();
  // body
  x.beginPath(); x.moveTo(-100, 70); x.bezierCurveTo(-90, -30, 150, -40, 170, 70); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-80, 50); x.bezierCurveTo(-60, 10, 130, 0, 150, 52); line(4, BK);
  [[-20, 40], [30, 30], [80, 34]].forEach(([a, b]) => dot(a, b, 7, BK));
  // small head
  x.save(); x.translate(-118, 50); x.rotate(per(t, 24) * .06);
  ell(0, 0, 40, 26);
  eye(-8, -8, 8, t); smile(-18, 6, 9, 4); cheek(10, 8, 6); dot(-34, -2, 3, BK);
  x.restore();
  x.restore();
}
function palmTree(t) {
  // prehistoric palm tree with a diamond-patterned trunk; a little dino peeks out from behind it, left and right in turn
  const p = per(t, 20), side = p > 0 ? -1 : 1, out = Math.abs(p), o2 = out * out * (3 - 2 * out);
  // peeking dino (behind the trunk)
  x.save(); x.translate(side * (20 + o2 * 80), 40);
  ell(0, 0, 44, 36); outlineEll(0, 0, 44, 36, 4);
  [-20, 0, 20].forEach((a, i) => blob([[a - 8, -32], [a, -50], [a + 8, -32]]));
  eye(side * 12 - 10, -6, 8, t); eye(side * 12 + 12, -6, 8, t, .4); smile(side * 12, 10, 10, 4); cheek(side * 30, 10, 6);
  x.restore();
  // trunk
  x.beginPath(); x.moveTo(-34, 140); x.quadraticCurveTo(-26, 20, -14, -100); x.lineTo(14, -100); x.quadraticCurveTo(26, 20, 34, 140); x.closePath(); x.fillStyle = WH; x.fill();
  x.save(); x.clip(); for (let i = -6; i < 10; i++) { x.beginPath(); x.moveTo(-50, i * 26 - 20); x.lineTo(50, i * 26 + 20); x.moveTo(50, i * 26 - 20); x.lineTo(-50, i * 26 + 20); line(3, BK); } x.restore();
  // fronds
  const sw = per(t, 24) * .08;
  [[-2.9, 120], [-2.4, 130], [-1.9, 110], [-1.25, 110], [-.75, 130], [-.25, 120]].forEach(([a, len], i) => {
    x.save(); x.translate(0, -104); x.rotate(a + sw * (i % 2 ? 1 : -1));
    x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(len * .5, -18, len, 14);
    x.quadraticCurveTo(len * .5, 10, 0, 0); x.fillStyle = WH; x.fill();
    x.beginPath(); x.moveTo(6, 0); x.quadraticCurveTo(len * .5, -6, len - 8, 10); line(3, BK);
    x.restore(); });
  [[-12, -96], [12, -94]].forEach(([a, b]) => { dot(a, b, 11); dot(a - 3, b - 3, 3, BK); });
  // grass at the foot
  for (let i = 0; i < 9; i++) { const gx = -80 + i * 20; x.beginPath(); x.moveTo(gx, 142); x.lineTo(gx + (i % 2 ? 8 : -8), 118 - hash(i) * 10); line(5); }
  x.fillStyle = WH; x.fillRect(-100, 140, 200, 6);
}

function bg(t) {
  // twinkling stars across the top
  for (let i = 0; i < 16; i++) { const tw = (per(t + i * 9, 20 + (i % 5) * 4) + 1) / 2, sx = 30 + hash(i + 31) * 900, sy = 24 + hash(i + 57) * 110;
    if (sx > 330 && sx < 630 && sy > 60) continue;
    star4(sx, sy, 3 + tw * 6); }
  // star dust drifting up on both sides
  for (let i = 0; i < 8; i++) { const k = ((t * 10 / P) + i / 8) % 1, sx = (i % 2 ? 860 : 90) + Math.sin(k * TAU * 2 + i) * 22 + (i % 3) * 12;
    x.save(); x.globalAlpha = .7 * Math.sin(Math.PI * k); dot(sx, 470 - k * 320, 3 + (i % 3)); x.restore(); }
  // rolling hills with grass tufts
  x.beginPath(); x.moveTo(0, 492); x.quadraticCurveTo(160, 452, 330, 488); x.quadraticCurveTo(480, 520, 640, 482); x.quadraticCurveTo(800, 446, 960, 486); line(5);
  x.beginPath(); x.moveTo(0, 520); x.quadraticCurveTo(240, 500, 480, 522); x.quadraticCurveTo(720, 540, 960, 514); line(4);
  [[60, 482], [250, 474], [420, 504], [700, 470], [880, 470]].forEach(([a, b], i) => { const sw = per(t + i * 3, 30) * 3;
    [-8, 0, 8].forEach(d => { x.beginPath(); x.moveTo(a + d, b); x.lineTo(a + d * 1.6 + sw, b - 16 - (d ? 0 : 6)); line(3.5); }); });
}
// outro: baby dino asleep curled up in its eggshell, in a twig nest, under a crescent moon
function sleepyEnd(t) {
  x.save(); x.translate(200, -150); dot(0, 0, 36); dot(14, -8, 32, BK); x.restore();
  const br = per(t, 8) * 2;
  // baby dino curled up in the lower eggshell
  x.save(); x.translate(0, br);
  x.beginPath(); x.moveTo(40, 20); x.quadraticCurveTo(110, 0, 96, -40); line(20);
  ell(10, -6, 80, 54);
  [-20, 14, 48, 74].forEach((a, i) => { x.save(); x.translate(a, -56 + Math.abs(i - 1.5) * 6); x.rotate(-.2 + i * .25); blob([[-10, 4], [0, -18], [10, 4]]); x.restore(); });
  ell(-50, -10, 50, 40); outlineEll(-50, -10, 50, 40, 5);
  sleepyEye(-66, -14, 9); sleepyEye(-32, -16, 8); cheek(-48, 6, 7);
  x.restore();
  // lower shell with zigzag rim
  const crack = []; for (let i = 0; i <= 10; i++) crack.push([-140 + i * 28, (i % 2 ? -4 : 18)]);
  x.beginPath(); crack.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.quadraticCurveTo(140, 120, 0, 120); x.quadraticCurveTo(-140, 120, -140, 18); x.closePath(); x.fillStyle = WH; x.fill();
  [[-60, 70, 12], [40, 86, 9], [80, 50, 8], [-10, 50, 7]].forEach(([a, b, r]) => dot(a, b, r, BK));
  // twig nest
  for (let i = 0; i < 9; i++) { const yy = 96 + (i % 3) * 12; x.beginPath(); x.moveTo(-180 + hash(i) * 20, yy); x.quadraticCurveTo(0, yy + 30 + (i % 2) * 8, 180 - hash(i + 4) * 20, yy); line(6); }
  for (let i = 0; i < 9; i++) { const yy = 102 + (i % 3) * 12; x.beginPath(); x.moveTo(-170, yy); x.quadraticCurveTo(0, yy + 34, 170, yy); line(2.5, BK); }
  for (let i = 0; i < 3; i++) { const k = (t * .25 + i / 3) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k);
    x.font = C.FONT(30 + i * 8); x.fillStyle = WH; x.textAlign = 'center'; x.fillText('z', -160 - k * 30, -60 - k * 100); x.restore(); }
}

const up = f => t => { x.translate(0, -62); f(t); };
L.scene({
  seed: 161,
  figs: [[longneck, .78, 'sway'], [up(horned), .82, 'floor'], [eggPeek, .85, 'sway'], [up(hatchling), .85, 'floor'], [volcano, .85, 'sway'],
         [fern, .8, 'sway'], [footprints, .85, 'sway'], [ptero, .85, 'fly'], [up(stego), .78, 'floor'], [palmTree, .82, 'sway']],
  bg, end: sleepyEnd, scale: 1.4,
});
