// Daily B&W sensory #8: Arctic Friends – white arctic friends on black: waddling penguin with flapping flippers,
// polar bear that waves, seal balancing a striped ball on its nose, walrus with tusks and a bushy moustache,
// arctic fox with a big fluffy tail trotting along, smiling six-armed snowflake that slowly turns,
// igloo with a little penguin peeking out of the door, beluga-style whale with a water fountain,
// puffin with a striped beak flapping by, and a smiling iceberg drifting on little waves.
// Background: soft snow drifts at the bottom, twinkling stars and slow aurora ribbons (white lines) at the top.
// Foreground: gentle falling snowflakes. Outro: a baby penguin asleep against a sleeping polar bear under a crescent moon.
// All figures are new drawings for this video (own design).
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;

const fill = (col = WH) => { x.fillStyle = col; x.fill(); };
const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
function zz(t, cx, cy, ph = 0) {
  x.font = C.FONT(30); x.fillStyle = WH; x.textAlign = 'center';
  for (let i = 0; i < 2; i++) { const k = ((t * 2 / 10 + ph + i / 2) % 1 + 1) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k); x.fillText('z', cx + k * 30 + i * 6, cy - k * 60); x.restore(); }
}
function snowflakeShape(r, lw, col = WH) {
  for (let i = 0; i < 6; i++) {
    x.save(); x.rotate(i * TAU / 6);
    x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -r); line(lw, col);
    x.beginPath(); x.moveTo(0, -r * .55); x.lineTo(-r * .22, -r * .75); x.moveTo(0, -r * .55); x.lineTo(r * .22, -r * .75); line(lw * .8, col);
    x.restore();
  }
}

function penguin(t) {
  // egg-shaped penguin: white body with a black outline belly line, black beak, flapping flippers, waddling feet
  const w = per(t, 40) * .08;
  x.save(); x.translate(0, -36); x.rotate(w);
  [-1, 1].forEach(d => { const up = Math.max(0, per(t + (d > 0 ? 1.5 : 0), 40)) * 10; ell(d * 40, 128 - (d * w > 0 ? up : 0), 34, 14); });
  [-1, 1].forEach(d => { const f = per(t, 24) * .25 * d; x.save(); x.translate(d * 92, -10); x.rotate(d * .35 + f);
    x.beginPath(); x.ellipse(d * 14, 46, 22, 62, 0, 0, 7); fill(); x.beginPath(); x.ellipse(d * 14, 46, 22, 62, 0, 0, 7); line(5, BK); x.restore(); });
  x.beginPath(); x.ellipse(0, 10, 100, 124, 0, 0, 7); fill();
  x.beginPath(); x.ellipse(0, 58, 58, 62, 0, 0, 7); line(6, BK);
  // head band (black cap)
  x.save(); x.beginPath(); x.ellipse(0, 10, 100, 124, 0, 0, 7); x.clip();
  x.beginPath(); x.ellipse(0, -96, 120, 38, 0, 0, 7); fill(BK); x.restore();
  eye(-34, -42, 13, t); eye(34, -42, 13, t, .3);
  x.beginPath(); x.moveTo(-16, -28); x.lineTo(16, -28); x.lineTo(0, -10); x.closePath(); fill(BK);
  x.restore();
}
function polarBear(t) {
  // round sitting polar bear, one paw waving, black nose and smile, little round ears with inner ring
  const wave = per(t, 30) * .35;
  x.beginPath(); x.ellipse(0, 60, 130, 90, 0, 0, 7); fill();
  ell(-70, 140, 44, 22); ell(70, 140, 44, 22);
  [-70, 70].forEach(a => { for (let k = -1; k <= 1; k++) dot(a + k * 14, 136, 5, BK); dot(a, 148, 9, BK); });
  x.save(); x.translate(100, 20); x.rotate(-1.0 + wave); x.beginPath(); x.roundRect(-22, -110, 44, 120, 22); fill();
  x.beginPath(); x.roundRect(-22, -110, 44, 120, 22); line(4, BK); x.restore();
  x.beginPath(); x.ellipse(-90, 70, 18, 50, .4, 0, 7); line(4, BK);
  x.save(); x.translate(-10, -60);
  [-1, 1].forEach(d => { dot(d * 62, -58, 26); dot(d * 62, -58, 12, BK); });
  x.beginPath(); x.ellipse(0, 0, 96, 82, 0, 0, 7); fill();
  ell(0, 30, 44, 32); x.beginPath(); x.ellipse(0, 30, 44, 32, 0, 0, 7); line(4, BK);
  ell(0, 16, 16, 11, BK);
  x.beginPath(); x.moveTo(0, 26); x.lineTo(0, 38); line(4, BK); smile(0, 30, 16, 5);
  eye(-36, -14, 12, t, .2); eye(36, -14, 12, t, .5);
  x.restore();
}
function seal(t) {
  // seal lying on its belly, nose up, balancing a striped ball that spins and bounces a little
  const b = Math.abs(per(t, 24)) * 18;
  x.beginPath(); x.moveTo(-150, 90); x.quadraticCurveTo(-60, 120, 40, 110); x.quadraticCurveTo(110, 100, 110, 20);
  x.quadraticCurveTo(110, -50, 70, -60); x.quadraticCurveTo(30, -60, 30, 10); x.quadraticCurveTo(-60, 40, -140, 50); x.closePath(); fill();
  x.save(); x.translate(-150, 70); x.rotate(per(t, 30) * .2); x.beginPath(); x.moveTo(0, 0); x.lineTo(-40, -30); x.lineTo(-30, 10); x.lineTo(-40, 40); x.closePath(); fill(); x.restore();
  x.save(); x.translate(10, 100); x.rotate(.5 + per(t, 24) * .2); x.beginPath(); x.ellipse(0, 10, 16, 34, 0, 0, 7); fill(); x.beginPath(); x.ellipse(0, 10, 16, 34, 0, 0, 7); line(4, BK); x.restore();
  for (let i = 0; i < 4; i++) dot(-100 + i * 36, 74 + (i % 2) * 8, 5, BK);
  eye(60, -20, 11, t); eye(94, -20, 11, t, .3);
  ell(84, 0, 9, 7, BK);
  [-1, 1].forEach(d => { for (let k = 0; k < 2; k++) { x.beginPath(); x.moveTo(84 + d * 14, 8 + k * 8); x.lineTo(84 + d * 40, 2 + k * 14); line(2.5, BK); } });
  x.beginPath(); x.arc(84, 10, 8, .3, Math.PI - .3); line(4, BK);
  // ball
  x.save(); x.translate(80, -110 - b); x.rotate(per(t, 12) * 1.2);
  dot(0, 0, 44); x.save(); x.beginPath(); x.arc(0, 0, 44, 0, 7); x.clip();
  for (let i = -2; i <= 2; i++) { x.fillStyle = BK; x.fillRect(i * 26 - 7, -50, 13, 100); }
  x.restore(); x.beginPath(); x.arc(0, 0, 44, 0, 7); line(4); x.restore();
}
function walrus(t) {
  // big round walrus head and shoulders, bushy moustache, two long tusks (outlined), whisker dots, flippers that clap
  const cl = Math.max(0, per(t, 30)) * .3;
  x.beginPath(); x.ellipse(0, 70, 150, 90, 0, 0, 7); fill();
  [-1, 1].forEach(d => { x.save(); x.translate(d * 120, 110); x.rotate(d * (.6 - cl)); x.beginPath(); x.ellipse(0, 0, 26, 50, 0, 0, 7); fill(); x.beginPath(); x.ellipse(0, 0, 26, 50, 0, 0, 7); line(4, BK); x.restore(); });
  x.beginPath(); x.moveTo(-150, 70); x.quadraticCurveTo(0, 110, 150, 70); line(4, BK);
  x.beginPath(); x.ellipse(0, -40, 100, 90, 0, 0, 7); fill();
  // tusks
  [-1, 1].forEach(d => { x.beginPath(); x.moveTo(d * 22, 10); x.quadraticCurveTo(d * 30, 80, d * 18, 120); x.quadraticCurveTo(d * 8, 80, d * 6, 14); x.closePath(); fill(); line(4, BK); });
  // moustache
  [-1, 1].forEach(d => { x.beginPath(); x.ellipse(d * 34, 0, 40, 28, 0, 0, 7); fill(); x.beginPath(); x.ellipse(d * 34, 0, 40, 28, 0, 0, 7); line(5, BK);
    for (let k = 0; k < 3; k++) dot(d * (20 + k * 14), -2 + (k % 2) * 8, 3.5, BK); });
  ell(0, -22, 16, 10, BK);
  eye(-40, -62, 12, t, .1); eye(40, -62, 12, t, .4);
  x.beginPath(); x.moveTo(-62, -84); x.quadraticCurveTo(-40, -94, -22, -86); line(4, BK);
  x.beginPath(); x.moveTo(62, -84); x.quadraticCurveTo(40, -94, 22, -86); line(4, BK);
}
function arcticFox(t) {
  // trotting arctic fox: pointy ears, fluffy curled tail that wags, black nose, legs that step
  const st = per(t, 48);
  x.save(); x.translate(-120, 10); x.rotate(-.5 + per(t, 24) * .15);
  x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(-60, -10, -110, -90, -60, -130); x.bezierCurveTo(-20, -150, 10, -100, -10, -80); x.bezierCurveTo(-40, -70, -20, -30, 20, -10); x.closePath(); fill();
  x.beginPath(); x.moveTo(-70, -110); x.quadraticCurveTo(-50, -80, -20, -70); line(4, BK); x.restore();
  [[-60, 0], [-30, 1], [50, 1], [80, 0]].forEach(([a, i]) => { const s = (i ? st : -st) * 12; x.beginPath(); x.moveTo(a, 30); x.lineTo(a + s, 110); line(16); ell(a + s + 6, 112, 14, 7); });
  x.beginPath(); x.ellipse(10, 20, 110, 52, 0, 0, 7); fill();
  x.beginPath(); x.moveTo(-30, 50); x.quadraticCurveTo(20, 70, 70, 50); line(4, BK);
  x.save(); x.translate(110, -40); x.rotate(per(t, 20) * .06);
  [-1, 1].forEach(d => { x.beginPath(); x.moveTo(d * 18 - 8, -40); x.lineTo(d * 44 - 4, -96); x.lineTo(d * 52 + 6, -30); x.closePath(); fill();
    x.beginPath(); x.moveTo(d * 24 - 6, -44); x.lineTo(d * 42 - 4, -80); x.lineTo(d * 46 + 2, -42); x.closePath(); fill(BK); });
  x.beginPath(); x.ellipse(0, 0, 62, 50, 0, 0, 7); fill();
  x.beginPath(); x.moveTo(30, -10); x.quadraticCurveTo(90, 10, 96, 22); x.quadraticCurveTo(60, 40, 20, 30); fill();
  dot(96, 20, 9, BK);
  eye(-6, -12, 10, t); eye(28, -14, 10, t, .3);
  x.beginPath(); x.arc(50, 26, 12, .3, Math.PI - .5); line(4, BK);
  x.restore();
}
function snowflake(t) {
  // big snowflake turning slowly, round face in the middle
  x.save(); x.rotate(per(t, 4) * .6);
  snowflakeShape(140, 16);
  for (let i = 0; i < 6; i++) { const a = i * TAU / 6 - Math.PI / 2; dot(Math.cos(a) * 140, Math.sin(a) * 140, 14); dot(Math.cos(a + TAU / 12) * 72, Math.sin(a + TAU / 12) * 72, 7); }
  x.restore();
  dot(0, 0, 58); x.beginPath(); x.arc(0, 0, 58, 0, 7); line(5, BK);
  eye(-20, -8, 9, t, .2); eye(20, -8, 9, t, .5); smile(0, 10, 15, 5);
  dot(-34, 12, 6, BK); dot(34, 12, 6, BK);
}
function igloo(t) {
  // igloo dome with block lines and a dark door; a little penguin peeks out of the door and back in
  const pk = Math.max(0, per(t, 20));
  x.beginPath(); x.moveTo(-160, 110); x.arc(0, 110, 160, Math.PI, 0); x.closePath(); fill();
  x.save(); x.beginPath(); x.moveTo(-160, 110); x.arc(0, 110, 160, Math.PI, 0); x.closePath(); x.clip();
  for (let r = 1; r < 5; r++) { const y = 110 - r * 34; x.beginPath(); x.moveTo(-170, y); x.lineTo(170, y); line(5, BK);
    for (let i = -5; i <= 5; i++) { const xx = i * 46 + (r % 2) * 23; x.beginPath(); x.moveTo(xx, y); x.lineTo(xx, y + 34); line(5, BK); } }
  x.restore();
  // door tunnel
  x.beginPath(); x.moveTo(-60, 112); x.lineTo(-60, 56); x.arc(0, 56, 60, Math.PI, 0); x.lineTo(60, 112); x.closePath(); fill();
  x.beginPath(); x.moveTo(-60, 112); x.lineTo(-60, 56); x.arc(0, 56, 60, Math.PI, 0); x.lineTo(60, 112); line(5, BK);
  x.beginPath(); x.moveTo(-40, 112); x.lineTo(-40, 64); x.arc(0, 64, 40, Math.PI, 0); x.lineTo(40, 112); x.closePath(); fill(BK);
  // peeking penguin head
  x.save(); x.beginPath(); x.moveTo(-40, 112); x.lineTo(-40, 64); x.arc(0, 64, 40, Math.PI, 0); x.lineTo(40, 112); x.closePath(); x.clip();
  x.translate(0, 130 - pk * 56);
  dot(0, 0, 30); x.beginPath(); x.arc(0, -26, 30, Math.PI, 0); fill(BK);
  eye(-11, -8, 6, t); eye(11, -8, 6, t, .3);
  x.beginPath(); x.moveTo(-7, 2); x.lineTo(7, 2); x.lineTo(0, 11); x.closePath(); fill(BK);
  x.restore();
  // face on the dome
  eye(-60, -10, 11, t, .4); eye(60, -10, 11, t, .1);
  x.beginPath(); x.arc(0, -16, 22, .4, Math.PI - .4); line(5, BK);
  ell(0, 114, 200, 8);
}
function whale(t) {
  // beluga-style whale: round melon forehead, smiling, flukes that beat, water fountain from the blowhole
  const tl = per(t, 20) * .25;
  x.save(); x.translate(130, 20); x.rotate(tl);
  x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(40, -10, 66, -50); x.quadraticCurveTo(70, -6, 50, 4); x.quadraticCurveTo(70, 14, 66, 56); x.quadraticCurveTo(40, 10, 0, 6); fill(); x.restore();
  x.beginPath(); x.moveTo(-150, 20); x.bezierCurveTo(-160, -60, -110, -90, -60, -80);
  x.bezierCurveTo(0, -80, 100, -20, 140, 14); x.bezierCurveTo(100, 50, 0, 80, -80, 76); x.bezierCurveTo(-130, 72, -150, 50, -150, 20); fill();
  x.save(); x.translate(-40, 60); x.rotate(.6 + per(t, 20) * .15); x.beginPath(); x.ellipse(0, 18, 14, 34, 0, 0, 7); fill(); x.beginPath(); x.ellipse(0, 18, 14, 34, 0, 0, 7); line(4, BK); x.restore();
  eye(-96, -14, 12, t);
  x.beginPath(); x.moveTo(-146, 26); x.quadraticCurveTo(-120, 46, -90, 30); line(5, BK);
  dot(-66, 8, 7, BK); dot(-50, 2, 4, BK);
  // fountain: rises and falls 4x per minute-ish (periodic)
  const k = Math.max(0, per(t, 40)), h = 60 + 50 * k;
  x.save(); x.translate(-50, -84);
  if (k > .05) {
    x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -h); line(8);
    [-1, 1].forEach(d => { x.beginPath(); x.moveTo(0, -h); x.quadraticCurveTo(d * 30, -h - 24, d * 46, -h + 10 * k); line(6); dot(d * 46, -h + 16 * k, 6); });
  } else dot(0, 0, 6);
  x.restore();
}
function puffin(t) {
  // flying puffin: round body, big striped beak, wings flapping, little feet tucked
  const fl = per(t, 60);
  x.beginPath(); x.ellipse(0, 0, 100, 70, 0, 0, 7); fill();
  x.beginPath(); x.moveTo(-96, -10); x.lineTo(-150, -30); x.lineTo(-140, 10); x.lineTo(-96, 14); x.closePath(); fill();
  [-30, 0].forEach(a => { x.beginPath(); x.moveTo(a, 64); x.lineTo(a - 30, 84); line(10); ell(a - 34, 86, 14, 7); });
  // one big wing on top, flapping up and down from the shoulder
  x.save(); x.translate(-10, -20); x.rotate(-.2 - fl * .7);
  x.beginPath(); x.moveTo(30, 0); x.quadraticCurveTo(-20, -120, -120, -130); x.quadraticCurveTo(-70, -60, -50, 20); x.closePath(); fill(); line(5, BK);
  x.beginPath(); x.moveTo(-20, -40); x.quadraticCurveTo(-60, -90, -100, -112); line(4, BK);
  x.restore();
  x.save(); x.translate(70, -30);
  x.beginPath(); x.arc(0, 0, 56, 0, 7); fill(); x.beginPath(); x.arc(0, 0, 56, 0, 7); line(5, BK);
  // beak with stripes
  x.beginPath(); x.moveTo(40, -30); x.quadraticCurveTo(110, -10, 120, 20); x.quadraticCurveTo(80, 36, 40, 30); x.closePath(); fill(); line(5, BK);
  x.save(); x.beginPath(); x.moveTo(40, -30); x.quadraticCurveTo(110, -10, 120, 20); x.quadraticCurveTo(80, 36, 40, 30); x.closePath(); x.clip();
  for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(58 + i * 22, -40); x.lineTo(58 + i * 22, 40); line(8, BK); }
  x.restore();
  eye(8, -12, 11, t); x.beginPath(); x.moveTo(-4, -30); x.lineTo(-24, -26); line(4, BK);
  x.beginPath(); x.arc(20, 22, 10, .3, Math.PI - .4); line(4, BK);
  x.restore();
}
function iceberg(t) {
  // smiling iceberg with angled facets floating on small waves; a little snow cap and sparkle
  x.save(); x.translate(0, per(t, 30) * 6);
  x.beginPath(); x.moveTo(-160, 70); x.lineTo(-110, -40); x.lineTo(-60, -20); x.lineTo(-10, -130); x.lineTo(50, -60); x.lineTo(90, -90); x.lineTo(160, 70); x.closePath(); fill();
  x.beginPath(); x.moveTo(-10, -130); x.lineTo(10, -20); x.lineTo(50, -60); x.moveTo(10, -20); x.lineTo(-60, -20); x.moveTo(90, -90); x.lineTo(110, 10); line(4, BK);
  eye(-40, 14, 12, t, .3); eye(40, 14, 12, t);
  smile(0, 34, 18, 6);
  // sparkle on the top
  const s = 8 + 6 * Math.max(0, per(t, 20));
  x.save(); x.translate(-10, -150); x.beginPath(); x.moveTo(0, -s * 1.6); x.quadraticCurveTo(0, 0, s * 1.6, 0); x.quadraticCurveTo(0, 0, 0, s * 1.6); x.quadraticCurveTo(0, 0, -s * 1.6, 0); x.quadraticCurveTo(0, 0, 0, -s * 1.6); fill(); x.restore();
  // underwater part (outline) below the waterline
  x.beginPath(); x.moveTo(-150, 84); x.lineTo(-100, 140); x.lineTo(90, 150); x.lineTo(150, 84); line(4);
  x.restore();
  // waves
  x.beginPath(); for (let i = 0; i <= 16; i++) { const xx = -200 + i * 25, yy = 78 + Math.sin(i * 1.4 + TAU * 12 * t / L.P) * 6; i ? x.lineTo(xx, yy) : x.moveTo(xx, yy); } line(7);
}

function bg(t) {
  // aurora ribbons: three slow wavy lines at the top (faint)
  for (let r = 0; r < 3; r++) {
    x.save(); x.globalAlpha *= .22 + .12 * per(t + r * 30, 4);
    x.beginPath();
    for (let i = 0; i <= 48; i++) { const xx = i * 20, yy = 50 + r * 26 + Math.sin(i * .25 + TAU * (2 + r) * t / L.P + r) * 16; i ? x.lineTo(xx, yy) : x.moveTo(xx, yy); }
    line(5 - r);
    x.restore();
  }
  // twinkling stars
  for (let i = 0; i < 14; i++) { const sx = 40 + hash(i + 9) * 880, sy = 30 + hash(i + 23) * 150, tw = .5 + .5 * per(t + i * 13, 8 + i);
    x.save(); x.globalAlpha *= tw; dot(sx, sy, 1.8 + hash(i + 2) * 2); x.restore(); }
  // snow drifts at the bottom (two layers, the back one outlined)
  x.beginPath(); x.moveTo(0, 540); x.lineTo(0, 492);
  for (let i = 0; i <= 12; i++) x.quadraticCurveTo(i * 80 + 40, 474 + (i % 2) * 16, i * 80 + 80, 490);
  x.lineTo(960, 540); x.closePath(); fill();
  x.beginPath(); x.moveTo(0, 514);
  for (let i = 0; i <= 8; i++) x.quadraticCurveTo(i * 120 + 60, 500 + (i % 2) * 18, i * 120 + 120, 514);
  line(3, BK);
}
function fg(t) {
  // gentle falling snow: each flake falls 4x per period, kept away from the frame edges
  for (let i = 0; i < 14; i++) {
    const k = ((t * 4 / L.P) + hash(i + 31)) % 1;
    const sx = 60 + hash(i + 7) * 840 + Math.sin(k * TAU * 2 + i) * 18, sy = -10 + k * 500, r = 3 + hash(i + 3) * 4;
    x.save(); x.globalAlpha *= Math.min(1, (1 - k) * 6) * .85;
    if (i % 4 === 0) { x.translate(sx, sy); x.rotate(k * 3); snowflakeShape(r * 2.2, 2); } else dot(sx, sy, r * .8);
    x.restore();
  }
}
// outro: polar bear lying asleep with a baby penguin snuggled against her tummy, crescent moon, z's
function sleepyEnd(t) {
  x.save(); x.translate(190, -170); dot(0, 0, 50); dot(22, -14, 44, BK); x.restore();
  [[-220, -180], [-100, -210], [60, -200], [-240, -70], [250, -40]].forEach(([a, b], i) => { x.save(); x.globalAlpha *= .6 + .4 * per(t + i * 9, 12); dot(a, b, 4); x.restore(); });
  const br = 1 + per(t, 16) * .02;
  x.save(); x.translate(0, 70); x.scale(br, br);
  // bear body lying
  x.beginPath(); x.ellipse(0, 20, 210, 82, 0, 0, 7); fill();
  ell(-190, 80, 46, 20); ell(150, 86, 46, 20);
  // head resting on paws (left)
  x.save(); x.translate(-170, -10);
  [-1, 1].forEach(d => { dot(d * 50 - 4, -60, 22); dot(d * 50 - 4, -60, 10, BK); });
  x.beginPath(); x.ellipse(0, 0, 84, 70, 0, 0, 7); fill();
  ell(-30, 26, 38, 26); x.beginPath(); x.ellipse(-30, 26, 38, 26, 0, 0, 7); line(4, BK); ell(-36, 14, 13, 9, BK);
  sleepyEye(-30, -16, 11, 5); sleepyEye(24, -16, 11, 5);
  x.restore();
  // baby penguin against the tummy
  x.save(); x.translate(40, -40);
  x.beginPath(); x.ellipse(0, 0, 50, 62, 0, 0, 7); fill(); x.beginPath(); x.ellipse(0, 0, 50, 62, 0, 0, 7); line(5, BK);
  x.save(); x.beginPath(); x.ellipse(0, 0, 50, 62, 0, 0, 7); x.clip(); x.beginPath(); x.ellipse(0, -56, 60, 26, 0, 0, 7); fill(BK); x.restore();
  sleepyEye(-16, -20, 7, 4); sleepyEye(16, -20, 7, 4);
  x.beginPath(); x.moveTo(-8, -10); x.lineTo(8, -10); x.lineTo(0, 0); x.closePath(); fill(BK);
  x.restore();
  // bear arm around the penguin
  x.beginPath(); x.moveTo(-60, 30); x.quadraticCurveTo(40, 50, 100, 10); line(26); x.beginPath(); x.moveTo(-60, 30); x.quadraticCurveTo(40, 50, 100, 10); line(2, BK);
  x.restore();
  zz(t, -120, -80); zz(t, 80, -110, .5);
}

L.scene({
  seed: 83,
  figs: [[penguin, .85, 'floor'], [polarBear, .85, 'sway'], [seal, .85, 'float'], [walrus, .85, 'sway'], [arcticFox, .8, 'floor'],
         [snowflake, .85, 'float'], [igloo, .85, 'sway'], [whale, .9, 'swimL'], [puffin, .85, 'fly'], [iceberg, .85, 'swimR']],
  bg, fg, end: sleepyEnd,
});
