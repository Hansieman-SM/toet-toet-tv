// Daily B&W sensory #7: Sleepy Fruit – white fruit friends with sleepy faces on black: apple with a shiny highlight (blinks),
// pear in a striped nightcap (sleepy), banana rocking like a cradle (eyes closed), strawberry with seed dots and a leafy crown,
// two cherries on one stem (one awake, one dozing), watermelon slice with a striped rind and seeds, rolling orange slice wheel,
// bunch of grapes with a face, pineapple with a diamond pattern and spiky crown, lemon that yawns.
// Background: checkered tablecloth edge at the bottom, a little hanging bunting of dots at the top, slow twinkling stars.
// Foreground: tiny sparkles rising slowly. Outro: an apple and a pear asleep together in a woven basket.
// All figures are new drawings for this video (own design).
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;

const fill = (col = WH) => { x.fillStyle = col; x.fill(); };
const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
function leaf(cx, cy, s, rot, col = WH) {
  x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(s, s);
  x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(22, -20, 0, -52); x.quadraticCurveTo(-22, -20, 0, 0); fill(col);
  x.beginPath(); x.moveTo(0, -4); x.lineTo(0, -44); line(3, col === WH ? BK : WH);
  x.restore();
}
// little "z" floating up from a sleeping fruit (periodic)
function zz(t, cx, cy, ph = 0) {
  x.font = C.FONT(30); x.fillStyle = WH; x.textAlign = 'center';
  for (let i = 0; i < 2; i++) { const k = ((t * 2 / 10 + ph + i / 2) % 1 + 1) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k); x.fillText('z', cx + k * 30 + i * 6, cy - k * 60); x.restore(); }
}

function apple(t) {
  // round apple, dip on top, stem + leaf, black shine highlight, blinking eyes, little smile
  x.beginPath(); x.moveTo(0, -80);
  x.bezierCurveTo(60, -130, 150, -80, 130, 20); x.bezierCurveTo(115, 110, 40, 140, 0, 118);
  x.bezierCurveTo(-40, 140, -115, 110, -130, 20); x.bezierCurveTo(-150, -80, -60, -130, 0, -80); fill();
  x.beginPath(); x.arc(-60, -30, 50, 3.6, 4.5); line(10, BK);
  x.beginPath(); x.moveTo(0, -80); x.quadraticCurveTo(4, -110, 18, -128); line(12);
  leaf(22, -108, 1.1, 1.0 + per(t, 12) * .12);
  eye(-38, 10, 15, t); eye(38, 10, 15, t, .3); smile(0, 34, 26, 7);
  [-1, 1].forEach(d => { for (let k = 0; k < 3; k++) dot(d * 70 + (k - 1) * 9, 48, 3.5, BK); });
}
function pear(t) {
  // pear in a striped nightcap with a pompom, sleepy eyes, slow breathing
  const br = 1 + per(t, 16) * .025;
  x.save(); x.scale(br, br);
  x.beginPath(); x.moveTo(0, -90);
  x.bezierCurveTo(46, -90, 50, -30, 70, 10); x.bezierCurveTo(120, 80, 80, 140, 0, 140);
  x.bezierCurveTo(-80, 140, -120, 80, -70, 10); x.bezierCurveTo(-50, -30, -46, -90, 0, -90); fill();
  sleepyEye(-30, 40, 13, 6); sleepyEye(30, 40, 13, 6);
  x.beginPath(); x.arc(0, 74, 10, 0, Math.PI); line(5, BK);
  x.restore();
  // nightcap: drooping cone with black/white stripes
  x.save(); x.translate(0, -86); x.rotate(-.12 + per(t, 12) * .05);
  x.beginPath(); x.moveTo(-56, 6); x.quadraticCurveTo(-40, -70, 40, -110); x.quadraticCurveTo(110, -120, 120, -60); x.quadraticCurveTo(60, -80, 56, 6); x.closePath();
  x.save(); x.clip(); fill();
  for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(-80 + i * 34, 20); x.lineTo(-20 + i * 34, -140); line(14, BK); }
  x.restore();
  x.beginPath(); x.moveTo(-56, 6); x.quadraticCurveTo(-40, -70, 40, -110); x.quadraticCurveTo(110, -120, 120, -60); x.quadraticCurveTo(60, -80, 56, 6); x.closePath(); line(4);
  x.beginPath(); x.roundRect(-64, -6, 128, 22, 11); fill();
  dot(122, -56, 20);
  x.restore();
  zz(t, 80, -40);
}
function banana(t) {
  // curved banana lying like a little cradle, rocking; closed eyes, black tips, ridge line
  x.save(); x.rotate(per(t, 12) * .12);
  x.beginPath(); x.moveTo(-150, -40);
  x.quadraticCurveTo(0, 110, 150, -40); x.quadraticCurveTo(164, -24, 152, 0);
  x.quadraticCurveTo(0, 200, -152, 0); x.quadraticCurveTo(-166, -22, -150, -40); fill();
  [[-1], [1]].forEach(([d]) => { x.beginPath(); x.moveTo(d * 118, -6); x.quadraticCurveTo(d * 128, 10, d * 120, 26); line(4, BK); });
  x.beginPath(); x.moveTo(150, -40); x.lineTo(168, -60); line(12); dot(168, -62, 8, BK);
  dot(-158, -20, 9, BK);
  sleepyEye(-34, 56, 12, 5); sleepyEye(30, 56, 12, 5);
  x.beginPath(); x.arc(-2, 76, 9, .2, Math.PI - .2); line(4, BK);
  x.restore();
  zz(t, 60, -40, .4);
}
function strawberry(t) {
  // strawberry with tear-shaped seeds, leafy crown, blinking eyes, bobbing
  x.beginPath(); x.moveTo(0, -80);
  x.bezierCurveTo(90, -100, 140, -40, 110, 30); x.bezierCurveTo(80, 100, 20, 140, 0, 150);
  x.bezierCurveTo(-20, 140, -80, 100, -110, 30); x.bezierCurveTo(-140, -40, -90, -100, 0, -80); fill();
  [[-70, -30], [70, -30], [-40, 60], [40, 60], [0, 112], [-86, 20], [86, 20], [-20, -50], [20, -50], [-60, 96], [60, 96]].forEach(([a, b]) => {
    if (Math.abs(a) < 50 && b > -20 && b < 70) return;
    x.beginPath(); x.ellipse(a, b, 5, 8, 0, 0, 7); fill(BK); });
  // crown of leaves
  x.save(); x.translate(0, -84); x.rotate(per(t, 16) * .05);
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .5; x.save(); x.rotate(a + Math.PI / 2); x.beginPath(); x.moveTo(-14, 0); x.lineTo(0, -46); x.lineTo(14, 0); x.closePath(); fill(); x.restore(); }
  x.beginPath(); x.moveTo(0, -10); x.lineTo(4, -60); line(10);
  x.restore();
  eye(-32, 6, 13, t, .1); eye(32, 6, 13, t, .4); smile(0, 30, 18, 6);
}
function cherries(t) {
  // two cherries hanging from one stem, swinging; left one awake, right one dozing
  x.save(); x.translate(0, -120); x.rotate(per(t, 12) * .08);
  x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(-40, 60, -70, 150); line(9);
  x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(40, 70, 70, 160); line(9);
  leaf(0, 0, 1.2, .9 + per(t, 20) * .1); dot(0, 0, 9);
  [[-70, 150, 0], [70, 160, 1]].forEach(([a, b, i]) => {
    x.save(); x.translate(a, b + 60);
    dot(0, 0, 68);
    x.beginPath(); x.arc(-26, -24, 26, 3.5, 4.6); line(7, BK);
    if (i === 0) { eye(-20, 6, 10, t); eye(20, 6, 10, t, .2); smile(0, 24, 14, 5); }
    else { sleepyEye(-20, 6, 10, 5); sleepyEye(20, 6, 10, 5); x.beginPath(); x.arc(0, 28, 6, 0, Math.PI); line(4, BK); }
    x.restore(); });
  x.restore();
}
function watermelon(t) {
  // watermelon slice (wedge): rind with stripes, seeds, a face, little feet that tap
  x.save(); x.translate(0, -40);
  x.save(); x.rotate(per(t, 12) * .04);
  x.beginPath(); x.moveTo(-160, -40); x.arc(0, -40, 160, 0, Math.PI); x.closePath(); fill();
  x.beginPath(); x.arc(0, -40, 136, 0, Math.PI); line(10, BK);
  for (let i = 1; i < 10; i++) { const a = i / 10 * Math.PI; x.beginPath(); x.moveTo(Math.cos(a) * 141, -40 + Math.sin(a) * 141); x.lineTo(Math.cos(a) * 156, -40 + Math.sin(a) * 156); line(5, BK); }
  [[-90, 0], [-50, 40], [50, 40], [90, 0], [0, 70], [-100, -24], [100, -24]].forEach(([a, b]) => { x.beginPath(); x.ellipse(a, b, 6, 10, a * .004, 0, 7); fill(BK); });
  eye(-36, -10, 13, t); eye(36, -10, 13, t, .3); smile(0, 12, 18, 6);
  x.restore();
  [[-50, 0], [50, 1]].forEach(([a, i]) => { const up = Math.max(0, per(t + i * 2, 24)) * 8; x.beginPath(); x.moveTo(a, 115); x.lineTo(a, 140 - up); line(9); ell(a + (a < 0 ? -8 : 8), 144 - up, 18, 9); });
  x.restore();
}
function orangeSlice(t) {
  // round orange slice wheel with segments, rolling slowly; face in the white middle
  const r = per(t, 12) * .5;
  dot(0, 0, 140);
  dot(0, 0, 122, BK);
  x.save(); x.rotate(r);
  for (let i = 0; i < 10; i++) { const a0 = i / 10 * TAU + .06, a1 = (i + 1) / 10 * TAU - .06;
    x.beginPath(); x.moveTo(Math.cos((a0 + a1) / 2) * 44, Math.sin((a0 + a1) / 2) * 44); x.arc(0, 0, 112, a0, a1); x.closePath(); fill(); }
  x.restore();
  dot(0, 0, 54);
  eye(-18, -8, 9, t, .2); eye(18, -8, 9, t, .5); smile(0, 10, 13, 5);
}
function grapes(t) {
  // bunch of grapes (outlined circles), stem with a curly tendril and leaf; face on the top middle
  x.save(); x.rotate(per(t, 12) * .05);
  const G = [[-75, -40], [-25, -50], [25, -50], [75, -40], [-50, 4], [0, -2], [50, 4], [-25, 50], [25, 50], [0, 96]];
  G.forEach(([a, b]) => { dot(a, b, 34); x.beginPath(); x.arc(a, b, 34, 0, 7); line(5, BK); x.beginPath(); x.arc(a - 12, b - 12, 10, 3.6, 4.6); line(4, BK); });
  x.beginPath(); x.moveTo(0, -84); x.lineTo(6, -126); line(11);
  x.beginPath(); x.moveTo(4, -110); x.bezierCurveTo(40, -110, 40, -140, 60, -130); x.bezierCurveTo(76, -120, 66, -104, 56, -112); line(4);
  leaf(-6, -108, 1.3, -1.1);
  // face on the middle grape
  eye(-11, -8, 7, t); eye(11, -8, 7, t, .3); x.beginPath(); x.arc(0, 4, 8, .3, Math.PI - .3); line(4, BK);
  x.restore();
}
function pineapple(t) {
  // pineapple with a diamond crosshatch, spiky crown that sways, sleepy eyes and little smile
  x.save(); x.translate(0, 40);
  x.beginPath(); x.ellipse(0, 0, 96, 120, 0, 0, 7); fill();
  x.save(); x.beginPath(); x.ellipse(0, 0, 96, 120, 0, 0, 7); x.clip();
  for (let i = -6; i <= 6; i++) { x.beginPath(); x.moveTo(i * 36 - 130, -130); x.lineTo(i * 36 + 130, 130); line(4, BK); x.beginPath(); x.moveTo(i * 36 + 130, -130); x.lineTo(i * 36 - 130, 130); line(4, BK); }
  x.restore();
  // face patch
  ell(0, 10, 56, 42); sleepyEye(-22, 2, 11, 5); sleepyEye(22, 2, 11, 5); x.beginPath(); x.arc(0, 22, 9, .2, Math.PI - .2); line(4, BK);
  x.restore();
  x.save(); x.translate(0, -76);
  for (let i = 0; i < 7; i++) { const a = (i - 3) * .3 + per(t + i, 12) * .05, h = 90 - Math.abs(i - 3) * 14;
    x.save(); x.rotate(a); x.beginPath(); x.moveTo(-12, 4); x.quadraticCurveTo(-6, -h * .6, 0, -h); x.quadraticCurveTo(6, -h * .6, 12, 4); x.closePath(); fill();
    x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -h + 14); line(2.5, BK); x.restore(); }
  x.restore();
}
function lemon(t) {
  // lemon with pointy ends that yawns now and then (mouth opens wide), tiny dimple dots
  const yw = Math.max(0, per(t, 12)) ** 3;
  x.save(); x.rotate(-.08);
  x.beginPath(); x.moveTo(-160, 0); x.bezierCurveTo(-130, -110, 130, -110, 160, 0); x.bezierCurveTo(130, 110, -130, 110, -160, 0); fill();
  dot(-160, 0, 12); dot(160, 0, 12);
  [[-100, -40], [-110, 30], [100, -44], [110, 34], [-70, 60], [74, 62], [0, -66], [-40, -60], [40, -62]].forEach(([a, b]) => dot(a, b, 3.5, BK));
  if (yw > .2) { sleepyEye(-36, -14, 12, 6); sleepyEye(36, -14, 12, 6); } else { eye(-36, -14, 13, t); eye(36, -14, 13, t, .3); }
  ell(0, 26, 12 + yw * 8, 5 + yw * 22, BK);
  x.restore();
}

function bg(t) {
  // slow twinkling stars
  for (let i = 0; i < 12; i++) { const sx = 60 + hash(i + 5) * 840, sy = 70 + hash(i + 17) * 120, tw = .55 + .45 * per(t + i * 11, 8 + i);
    x.save(); x.globalAlpha *= tw; dot(sx, sy, 2 + hash(i + 1) * 1.8); x.restore(); }
  // bunting: a gently swaying string with round dots and triangles at the top
  x.beginPath(); x.moveTo(-10, 18); x.quadraticCurveTo(480, 70 + per(t, 6) * 4, 970, 18); line(3);
  for (let i = 0; i < 13; i++) { const k = (i + .5) / 13, px = -10 + k * 980, py = 18 + 2 * k * (1 - k) * (52 + per(t, 6) * 4);
    x.save(); x.translate(px, py); x.rotate(per(t + i * 7, 12) * .08);
    if (i % 2) { x.beginPath(); x.moveTo(-14, 0); x.lineTo(14, 0); x.lineTo(0, 26); x.closePath(); fill(); }
    else { dot(0, 12, 10); dot(0, 12, 4, BK); }
    x.restore(); }
  // checkered tablecloth edge at the bottom
  x.fillStyle = WH; x.fillRect(0, 496, 960, 44);
  for (let i = 0; i < 24; i++) for (let r = 0; r < 2; r++) if ((i + r) % 2) { x.fillStyle = BK; x.fillRect(i * 40, 500 + r * 20, 40, 20); }
  x.fillStyle = WH; x.fillRect(0, 494, 960, 6);
}
function fg(t) {
  // tiny 4-point sparkles rising slowly (each rises 2x per period), kept away from the frame edges
  for (let i = 0; i < 6; i++) {
    const k = ((t * 2 / L.P) + i / 6 + hash(i + 3) * .1) % 1;
    const sx = 200 + i * 112 + Math.sin(k * TAU * 2 + i) * 24, sy = 480 - k * 420, s = 7 + 3 * Math.sin(k * TAU * 4 + i);
    x.save(); x.globalAlpha *= Math.min(1, k * 8, (1 - k) * 8) * .8; x.translate(sx, sy);
    x.beginPath(); x.moveTo(0, -s * 1.6); x.quadraticCurveTo(0, 0, s * 1.6, 0); x.quadraticCurveTo(0, 0, 0, s * 1.6); x.quadraticCurveTo(0, 0, -s * 1.6, 0); x.quadraticCurveTo(0, 0, 0, -s * 1.6); fill();
    x.restore();
  }
}
// outro: woven basket with an apple and a pear fast asleep and floating z's
function sleepyEnd(t) {
  [[-200, -170], [-80, -210], [110, -200], [200, -140], [-220, -60]].forEach(([a, b], i) => { x.save(); x.globalAlpha *= .6 + .4 * per(t + i * 9, 12); dot(a, b, 4); x.restore(); });
  x.save(); x.translate(0, 30 + per(t, 12) * 2);
  // basket handle (behind)
  x.beginPath(); x.ellipse(0, 10, 170, 150, 0, Math.PI, 0); line(14);
  // fruits peeking out
  x.save(); x.translate(-80, -10); dot(0, 0, 56); x.beginPath(); x.moveTo(0, -54); x.lineTo(6, -76); line(8); leaf(8, -66, .7, 1.1);
  sleepyEye(-18, 0, 9, 5); sleepyEye(18, 0, 9, 5); x.restore();
  x.save(); x.translate(80, -20); x.beginPath(); x.moveTo(0, -60); x.bezierCurveTo(30, -60, 30, -20, 46, 0); x.bezierCurveTo(70, 40, 40, 60, 0, 60); x.bezierCurveTo(-40, 60, -70, 40, -46, 0); x.bezierCurveTo(-30, -20, -30, -60, 0, -60); fill();
  x.beginPath(); x.moveTo(0, -58); x.lineTo(-4, -78); line(7); sleepyEye(-16, 10, 8, 4); sleepyEye(16, 10, 8, 4); x.restore();
  // basket body with a woven pattern
  x.beginPath(); x.moveTo(-180, 30); x.lineTo(180, 30); x.lineTo(140, 170); x.lineTo(-140, 170); x.closePath(); fill();
  x.save(); x.clip();
  for (let r = 0; r < 4; r++) for (let i = -6; i <= 6; i++) { if ((i + r) % 2) continue; x.beginPath(); x.roundRect(i * 32 - 12, 44 + r * 32, 24, 18, 6); fill(BK); }
  x.restore();
  x.beginPath(); x.roundRect(-190, 18, 380, 24, 12); fill();
  x.restore();
  zz(t, 120, -110); zz(t, -150, -90, .5);
}

L.scene({
  seed: 71,
  figs: [[apple, .9, 'sway'], [pear, .85, 'float'], [banana, .9, 'sway'], [strawberry, .85, 'float'], [cherries, .8, 'fly'],
         [watermelon, .85, 'floor'], [orangeSlice, .9, 'swimL'], [grapes, .85, 'sway'], [pineapple, .8, 'swimR'], [lemon, .85, 'fly']],
  bg, fg, end: sleepyEnd,
});
