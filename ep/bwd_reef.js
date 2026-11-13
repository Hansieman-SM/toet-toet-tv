// Daily B&W sensory #12: Coral Reef – white reef friends on black: branching coral with a happy face, striped reef fish, sea turtle with a
// hexagon shell, friendly eel peeking out of its rock, waving anemone, hermit crab carrying a spiral shell, round sea urchin, dotty boxfish,
// a swirling school of tiny fish, little lobster waving its claws.
// Background: rippling water line, rising plankton dots, sandy floor with small coral heads and sea-grass at the sides.
// Outro: a little striped fish asleep inside the anemone, under a crescent moon shimmering on the water.
// All figures are new drawings for this video (own design, no existing characters). Figures look LEFT. Everything periodic in P = 240 s.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;

const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };

function coral(t) {
  // branching coral with a face in its trunk
  const br = (x0, y0, ang, len, w, d) => {
    const a = ang + per(t + d * 7, 8) * .04;
    const x1 = x0 + Math.cos(a) * len, y1 = y0 + Math.sin(a) * len;
    x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); line(w);
    dot(x1, y1, w * .62);
    if (d < 3) { br(x1, y1, a - .45, len * .72, w * .72, d + 1); br(x1, y1, a + .45, len * .72, w * .72, d + 1); }
  };
  br(0, 60, -Math.PI / 2, 70, 34, 0);
  ell(0, 90, 70, 40);
  eye(-22, 82, 10, t); eye(22, 82, 10, t, .4); smile(0, 96, 16, 5);
  // little polyp dots
  for (let i = 0; i < 6; i++) dot(-50 + i * 20, 118, 4, BK);
}
function reefFish(t) {
  // round striped reef fish (own design: three bold bands, rounded fins)
  const w = per(t, 30) * .14;
  x.save(); x.translate(92, 0); x.rotate(w);
  x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(50, -60, 80, -50); x.quadraticCurveTo(64, 0, 80, 50); x.quadraticCurveTo(50, 60, 0, 0); x.fillStyle = WH; x.fill();
  x.restore();
  ell(0, 0, 110, 74);
  x.save(); x.beginPath(); x.ellipse(0, 0, 110, 74, 0, 0, 7); x.clip();
  [[-50, 18], [8, 22], [64, 16]].forEach(([sx, sw]) => { x.beginPath(); x.moveTo(sx - sw / 2, -80); x.quadraticCurveTo(sx + 8, 0, sx - sw / 2, 80); x.lineTo(sx + sw / 2, 80); x.quadraticCurveTo(sx + 8 + sw, 0, sx + sw / 2, -80); x.closePath(); x.fillStyle = BK; x.fill(); });
  x.restore();
  // rounded top fin + belly fin
  x.beginPath(); x.moveTo(-30, -70); x.quadraticCurveTo(10, -122, 60, -60); x.fillStyle = WH; x.fill();
  x.save(); x.translate(-20, 50); x.rotate(.4 + per(t, 40) * .2); x.beginPath(); x.ellipse(0, 18, 12, 24, 0, 0, 7); x.fillStyle = WH; x.fill(); x.restore();
  dot(-78, -14, 18, BK); dot(-78, -14, 14); eye(-78, -14, 9, t); smile(-96, 16, 10, 5);
}
function turtle(t) {
  // sea turtle paddling, hexagon shell pattern
  const p = per(t, 20);
  const flip = (cx, cy, a) => { x.save(); x.translate(cx, cy); x.rotate(a); x.beginPath(); x.ellipse(0, 0, 20, 62, 0, 0, 7); x.fillStyle = WH; x.fill(); x.restore(); };
  flip(-40, -62, -1.1 + p * .35); flip(-40, 62, 1.1 - p * .35); flip(84, -46, -.5 - p * .2); flip(84, 46, .5 + p * .2);
  ell(20, 0, 110, 78);
  ell(20, 0, 96, 64, BK);
  ell(20, 0, 88, 56);
  const hex = (cx, cy, r) => { x.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + Math.PI / 6; x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } x.closePath(); line(5, BK); };
  hex(20, 0, 22); [[-26, -24], [-26, 24], [66, -24], [66, 24], [20, -46], [20, 46]].forEach(([a, b]) => hex(a, b, 16));
  // head
  x.save(); x.translate(-108, per(t, 12) * 6); ell(0, 0, 40, 32); eye(-12, -8, 9, t); smile(-18, 10, 10, 5); x.restore();
  // little tail
  x.beginPath(); x.moveTo(126, -8); x.lineTo(150, 0); x.lineTo(126, 8); x.closePath(); x.fillStyle = WH; x.fill();
}
function eel(t) {
  // friendly long eel gliding sideways in a gentle wave, dotted body, fin ribbon along the top
  const ph = TAU * 6 * t / L.P;
  const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24, px = -120 + u * 300, py = Math.sin(ph + u * 5) * 26 * u; pts.push([px, py, 30 * (1 - u * .75)]); }
  // fin ribbon above the body
  x.beginPath(); pts.forEach(([px, py, w], i) => { if (i < 3) return; i === 3 ? x.moveTo(px, py - w - 2) : x.lineTo(px, py - w - 14 * (1 - i / 24)); }); line(8);
  // body (thick ribbon)
  x.beginPath(); pts.forEach(([px, py, w], i) => i ? x.lineTo(px, py - w) : x.moveTo(px, py - w)); for (let i = pts.length - 1; i >= 0; i--) x.lineTo(pts[i][0], pts[i][1] + pts[i][2]); x.closePath(); x.fillStyle = WH; x.fill();
  pts.forEach(([px, py, w], i) => { if (i > 3 && i < 22 && i % 2 === 0) dot(px, py + (i % 4 ? 8 : -8) * (w / 30), 5 * (w / 30) + 1.5, BK); });
  // head
  ell(-122, 0, 50, 38);
  eye(-138, -10, 11, t); smile(-148, 14, 12, 5);
  x.beginPath(); x.moveTo(-96, -10); x.quadraticCurveTo(-90, 0, -96, 12); line(4, BK);
}
function anemone(t) {
  // anemone with waving tentacles on a round foot
  for (let i = 0; i < 11; i++) {
    const a = -Math.PI + (i + .5) / 11 * Math.PI, len = 110 + (i % 2) * 20, sw = per(t + i * 3, 8) * .35;
    const x0 = Math.cos(a) * 60, y0 = -10 + Math.sin(a) * 26;
    const mx = x0 + Math.cos(a) * len * .5 + sw * 30, my = y0 + Math.sin(a) * len * .5 - 30;
    const ex = x0 + Math.cos(a + sw * .6) * len, ey = y0 + Math.sin(a + sw * .6) * len - 20;
    x.beginPath(); x.moveTo(x0, y0); x.quadraticCurveTo(mx, my, ex, ey); line(18); dot(ex, ey, 12);
  }
  x.beginPath(); x.moveTo(-90, 0); x.quadraticCurveTo(-100, 120, 0, 120); x.quadraticCurveTo(100, 120, 90, 0); x.closePath(); x.fillStyle = WH; x.fill();
  for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(-60 + i * 40, 20); x.lineTo(-56 + i * 38, 104); line(4, BK); }
  eye(-28, 46, 10, t); eye(28, 46, 10, t, .5); smile(0, 64, 16, 5);
}
function hermitCrab(t) {
  // hermit crab walking with its spiral shell
  const step = per(t, 60);
  dot(40, -30, 100);
  x.beginPath(); for (let a = 0; a < TAU * 2.4; a += .1) { const r = 86 - a * 12; x.lineTo(40 + Math.cos(a + 2) * r, -30 + Math.sin(a + 2) * r); } line(10, BK);
  // body + legs
  ell(-80, 30, 52, 36);
  for (let i = 0; i < 3; i++) { const lx = -100 + i * 26, k = (i % 2 ? 1 : -1) * step * 8; x.beginPath(); x.moveTo(lx, 50); x.lineTo(lx - 10 + k, 92); line(9); }
  // big claw + small claw
  x.save(); x.translate(-130, 30); x.rotate(-.3 + per(t, 24) * .15); ell(-22, 0, 30, 22); x.beginPath(); x.moveTo(-48, 0); x.lineTo(-30, 0); line(6, BK); x.restore();
  x.save(); x.translate(-120, 58); ell(-14, 0, 16, 11); x.restore();
  // eye stalks
  [[-100, 0], [-80, -4]].forEach(([a, b], i) => { const w = per(t, 16 + i * 4) * 5; x.beginPath(); x.moveTo(a, b); x.lineTo(a - 6 + w, b - 44); line(7); dot(a - 6 + w, b - 50, 13); eye(a - 7 + w, b - 50, 7, t, i * .3); });
  smile(-108, 36, 12, 5);
}
function urchin(t) {
  // round sea urchin with soft rounded spikes, slowly turning
  x.save(); x.rotate(TAU * 2 * t / L.P);
  for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, l = 120 + (i % 2) * 18 + per(t + i * 5, 12) * 6;
    x.beginPath(); x.moveTo(Math.cos(a) * 70, Math.sin(a) * 70); x.lineTo(Math.cos(a) * l, Math.sin(a) * l); line(10); dot(Math.cos(a) * l, Math.sin(a) * l, 7); }
  x.restore();
  dot(0, 0, 86);
  dot(0, 0, 70, BK); dot(0, 0, 62);
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; dot(Math.cos(a) * 48, Math.sin(a) * 48, 5, BK); }
  eye(-22, -8, 11, t); eye(22, -8, 11, t, .3); smile(0, 14, 16, 5);
}
function boxfish(t) {
  // square boxfish covered in dots, tiny fins whirring
  const f = per(t, 80) * .4;
  x.save(); x.translate(108, 0); x.rotate(per(t, 30) * .1);
  x.beginPath(); x.moveTo(0, 0); x.lineTo(46, -36); x.quadraticCurveTo(40, 0, 46, 36); x.closePath(); x.fillStyle = WH; x.fill(); x.restore();
  x.beginPath(); x.roundRect(-110, -78, 220, 156, 44); x.fillStyle = WH; x.fill();
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) { if (r < 2 && c === 0) continue; dot(-62 + c * 38, -48 + r * 32, 9, BK); }
  x.save(); x.translate(-10, 72); x.rotate(f); x.beginPath(); x.ellipse(0, 14, 10, 20, 0, 0, 7); x.fillStyle = WH; x.fill(); x.restore();
  x.save(); x.translate(10, -74); x.rotate(-f); x.beginPath(); x.ellipse(0, -12, 10, 18, 0, 0, 7); x.fillStyle = WH; x.fill(); x.restore();
  eye(-74, -26, 12, t); x.beginPath(); x.arc(-104, 12, 9, 0, 7); line(5, BK);
}
function school(t) {
  // a swirling school of seven tiny fish going round in a loop
  for (let i = 0; i < 7; i++) {
    const a = TAU * 6 * t / L.P + i / 7 * TAU, rx = 130, ry = 70;
    const px = Math.cos(a) * rx, py = Math.sin(a) * ry, dir = -Math.sin(a) > 0 ? 1 : -1;
    x.save(); x.translate(px, py); x.scale(dir, 1); x.rotate(Math.cos(a) * .25 * dir);
    ell(0, 0, 34, 18);
    x.beginPath(); x.moveTo(28, 0); x.lineTo(54, -16 + per(t + i, 60) * 4); x.lineTo(54, 16); x.closePath(); x.fillStyle = WH; x.fill();
    x.beginPath(); x.moveTo(6, -16); x.lineTo(6, 16); line(4, BK);
    eye(-16, -3, 5, t, i * .4);
    x.restore();
  }
  // a big smiling bubble in the middle
  x.beginPath(); x.arc(0, 0, 32, 0, 7); line(5); eye(-10, -4, 5, t, .2); eye(10, -4, 5, t, .6); smile(0, 6, 9, 3, WH);
}
function lobster(t) {
  // little lobster waving its claws
  const w = per(t, 24) * .25;
  // tail segments + fan
  for (let i = 0; i < 4; i++) ell(60 + i * 30, 10 + i * 4, 22 - i * 2, 28 - i * 3);
  for (let k = -1; k <= 1; k++) { x.save(); x.translate(178, 26); x.rotate(k * .4 + per(t, 20) * .08); x.beginPath(); x.ellipse(16, 0, 18, 9, 0, 0, 7); x.fillStyle = WH; x.fill(); x.restore(); }
  for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(72 + i * 30, -14); x.lineTo(72 + i * 30, 34); line(4, BK); }
  // body
  ell(-10, 0, 66, 44);
  // legs
  for (let i = 0; i < 4; i++) { const k = per(t + i * 7, 60) * 6; x.beginPath(); x.moveTo(-40 + i * 22, 38); x.lineTo(-48 + i * 22 + k, 76); line(7); }
  // claws (waving)
  [[-1, -1], [1, 1]].forEach(([s, d]) => { x.save(); x.translate(-60, s * 26); x.rotate(-Math.PI + s * (.6 + w * d)); x.beginPath(); x.moveTo(0, 0); x.lineTo(60, 0); line(12);
    x.translate(78, 0); ell(0, 0, 30, 20); x.beginPath(); x.moveTo(6, 0); x.lineTo(32, 0); line(6, BK); x.restore(); });
  // antennae
  [[-60, -30, -170, -120], [-56, -24, -190, -70]].forEach(([a, b, c, d], i) => { x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo((a + c) / 2, b - 50 + per(t, 16 + i * 4) * 12, c, d); line(5); });
  eye(-46, -18, 11, t); eye(-24, -22, 11, t, .3); smile(-50, 14, 12, 5);
}

function bg(t) {
  // rippling water line at the top
  x.beginPath(); x.moveTo(0, 0); for (let i = 0; i <= 960; i += 12) x.lineTo(i, 22 + Math.sin(i * .025 + TAU * 8 * t / L.P) * 5 + Math.sin(i * .061 - TAU * 4 * t / L.P) * 3); x.lineTo(960, 0); x.closePath(); x.fillStyle = WH; x.fill();
  // rising plankton dots (each rises 6x per period)
  for (let i = 0; i < 26; i++) { const k = ((t * 6 / L.P) + hash(i)) % 1; x.save(); x.globalAlpha = .55 * Math.sin(Math.PI * k);
    dot(hash(i + 9) * 960 + Math.sin(k * TAU + i) * 10, 500 - k * 460, 2 + (i % 3)); x.restore(); }
  // sandy floor with a wavy edge and little coral heads
  x.beginPath(); x.moveTo(0, 540); for (let i = 0; i <= 960; i += 16) x.lineTo(i, 508 + Math.sin(i * .03) * 6); x.lineTo(960, 540); x.closePath(); x.fillStyle = WH; x.fill();
  for (let i = 0; i < 14; i++) dot(30 + i * 70 + hash(i) * 20, 522 + hash(i + 2) * 8, 3, BK);
  [[90, 1], [870, .9]].forEach(([cx, s]) => { x.save(); x.translate(cx, 506); x.scale(s, s);
    for (let k = -2; k <= 2; k++) { x.beginPath(); x.moveTo(k * 8, 0); x.quadraticCurveTo(k * 18 + per(t + k * 9, 6) * 10, -60, k * 12 + per(t + k * 9, 6) * 16, -110 - Math.abs(k) * -14); line(7); }
    x.restore(); });
  [[200, 506, 26], [760, 506, 22]].forEach(([cx, cy, r]) => { dot(cx, cy, r); for (let k = 0; k < 5; k++) dot(cx - r * .6 + k * r * .3, cy - r * .3 - (k % 2) * 6, 3.5, BK); });
}
// outro: a little striped fish asleep inside the anemone, crescent moon shimmering above
function sleepyEnd(t) {
  x.save(); x.translate(150, -150);
  dot(0, 0, 36); dot(14, -8, 32, BK);
  x.restore();
  for (let i = 0; i < 11; i++) {
    const a = -Math.PI + (i + .5) / 11 * Math.PI, len = 100 + (i % 2) * 16, sw = per(t + i * 3, 4) * .18;
    const x0 = Math.cos(a) * 60, y0 = 90 + Math.sin(a) * 26;
    const ex = x0 + Math.cos(a + sw) * len, ey = y0 + Math.sin(a + sw) * len - 10;
    x.beginPath(); x.moveTo(x0, y0); x.quadraticCurveTo(x0 + Math.cos(a) * len * .5, y0 + Math.sin(a) * len * .5 - 24, ex, ey); line(16); dot(ex, ey, 10);
  }
  // the little fish curled up between the tentacles
  x.save(); x.translate(0, 30 + per(t, 12) * 4);
  x.beginPath(); x.moveTo(44, 0); x.lineTo(90, -28); x.lineTo(90, 28); x.closePath(); x.fillStyle = BK; x.fill(); ell(0, 0, 68, 48, BK);
  x.beginPath(); x.moveTo(50, 0); x.lineTo(84, -22); x.lineTo(84, 22); x.closePath(); x.fillStyle = WH; x.fill();
  ell(0, 0, 60, 40);
  x.save(); x.beginPath(); x.ellipse(0, 0, 60, 40, 0, 0, 7); x.clip(); [-10, 24].forEach(sx => { x.fillStyle = BK; x.fillRect(sx, -50, 10, 100); }); x.restore();
  sleepyEye(-32, -6, 9, 5); smile(-40, 12, 7, 4);
  x.restore();
  x.beginPath(); x.moveTo(-90, 90); x.quadraticCurveTo(-100, 190, 0, 190); x.quadraticCurveTo(100, 190, 90, 90); x.closePath(); x.fillStyle = WH; x.fill();
  sleepyEye(-26, 140, 9, 5); sleepyEye(26, 140, 9, 5); smile(0, 156, 12, 5);
  // z z z bubbles
  for (let i = 0; i < 3; i++) { const k = (t * .25 + i / 3) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k);
    x.font = C.FONT(30 + i * 8); x.fillStyle = WH; x.textAlign = 'center'; x.fillText('z', -80 - k * 30, -10 - k * 100); x.restore(); }
}

L.scene({
  seed: 59,
  figs: [[coral, .85, 'sway'], [reefFish, .9, 'swimL'], [turtle, .85, 'swimR'], [eel, .9, 'swimR'], [anemone, .85, 'sway'],
         [hermitCrab, .85, 'floor'], [urchin, .8, 'float'], [boxfish, .9, 'swimL'], [school, .95, 'sway'], [lobster, .85, 'floor']],
  bg, end: sleepyEnd,
});
