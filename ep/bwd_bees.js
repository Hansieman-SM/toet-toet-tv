// Daily B&W sensory #9: Butterflies and Bees – white garden friends on black: butterfly with patterned wings that slowly flap,
// striped bumble bee flying little loops, ladybird (seen from above) whose spotted shell gently opens, smiling daisy,
// dragonfly with buzzing see-through-style wings, caterpillar inching along, snail with a spiral shell and wiggling eye stalks,
// beehive with a bee peeking out of the door and a little bee circling around it, smiling leaf, and a big sunflower.
// Background: grass blades with little flowers, a smiling sun with turning rays (top left), a slow drifting cloud (top right).
// Foreground: drifting pollen dots. Outro: caterpillar and butterfly asleep on a big leaf under a crescent moon.
// All figures are new drawings for this video (own design).
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x, ease, clamp } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;

const fill = (col = WH) => { x.fillStyle = col; x.fill(); };
const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const ring = (cx, cy, r, lw, col = BK) => { x.beginPath(); x.arc(cx, cy, r, 0, 7); line(lw, col); };
function zz(t, cx, cy, ph = 0) {
  x.font = C.FONT(30); x.fillStyle = WH; x.textAlign = 'center';
  for (let i = 0; i < 2; i++) { const k = ((t * 2 / 10 + ph + i / 2) % 1 + 1) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k); x.fillText('z', cx + k * 30 + i * 6, cy - k * 60); x.restore(); }
}

function butterfly(t) {
  // seen from above: four patterned wings that slowly open and close, striped body, round head with curly antennae
  const s = .68 + .32 * per(t, 80);
  [-1, 1].forEach(d => {
    x.save(); x.scale(d * s, 1);
    x.beginPath(); x.ellipse(62, 52, 58, 46, .55, 0, 7); fill(); x.beginPath(); x.ellipse(62, 52, 58, 46, .55, 0, 7); line(5, BK);
    dot(66, 58, 18, BK); dot(66, 58, 7);
    x.beginPath(); x.ellipse(82, -46, 84, 62, -.5, 0, 7); fill(); x.beginPath(); x.ellipse(82, -46, 84, 62, -.5, 0, 7); line(5, BK);
    dot(96, -54, 28, BK); dot(96, -54, 11);
    [[46, -14], [140, -96], [118, -110], [150, -70]].forEach(([a, b]) => dot(a, b, 7, BK));
    x.beginPath(); x.moveTo(20, -10); x.quadraticCurveTo(50, -60, 60, -90); line(4, BK);
    x.restore();
  });
  // body
  x.beginPath(); x.ellipse(0, 14, 17, 72, 0, 0, 7); fill(); x.beginPath(); x.ellipse(0, 14, 17, 72, 0, 0, 7); line(4, BK);
  for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(-14, 10 + i * 16); x.lineTo(14, 10 + i * 16); line(4, BK); }
  // antennae
  [-1, 1].forEach(d => { x.beginPath(); x.moveTo(d * 8, -96); x.quadraticCurveTo(d * 20, -140, d * 44, -146); line(4); dot(d * 46, -146, 8); });
  dot(0, -76, 30); ring(0, -76, 30, 4);
  eye(-11, -80, 6, t); eye(11, -80, 6, t, .3); smile(0, -72, 10, 4);
}
function bee(t) {
  // round bumble bee (head on the left): black stripes, buzzing wings, flies a small loop on its way
  const a = TAU * 20 * t / L.P;
  x.save(); x.translate(Math.cos(a) * 22, Math.sin(a) * 22); x.rotate(per(t, 20) * .08);
  [-30, 0, 30].forEach((xx, i) => { x.beginPath(); x.moveTo(xx, 64); x.lineTo(xx + 8 - i * 4, 92); line(7); });
  x.beginPath(); x.moveTo(100, -10); x.lineTo(142, 0); x.lineTo(100, 10); x.closePath(); fill();
  x.beginPath(); x.ellipse(0, 0, 112, 74, 0, 0, 7); fill();
  x.save(); x.beginPath(); x.ellipse(0, 0, 112, 74, 0, 0, 7); x.clip();
  [-40, 12, 64].forEach(xx => { x.fillStyle = BK; x.fillRect(xx, -80, 26, 160); });
  x.restore();
  // wings (buzz fast but small)
  const bz = per(t, 480) * .12;
  [[6, -.35], [52, .3]].forEach(([wx, r]) => { x.save(); x.translate(wx, -58); x.rotate(r + bz);
    x.beginPath(); x.ellipse(0, -44, 30, 48, 0, 0, 7); fill(); x.beginPath(); x.ellipse(0, -44, 30, 48, 0, 0, 7); line(5, BK);
    x.beginPath(); x.moveTo(0, -4); x.lineTo(0, -70); line(3, BK); x.restore(); });
  // head
  [[-124, -50, -150, -98], [-96, -54, -86, -104]].forEach(([a1, b1, a2, b2]) => { x.beginPath(); x.moveTo(a1, b1); x.quadraticCurveTo((a1 + a2) / 2 - 10, b2 + 10, a2, b2); line(5); dot(a2, b2, 8); });
  dot(-110, -4, 52); ring(-110, -4, 52, 5);
  eye(-128, -16, 10, t); eye(-92, -16, 10, t, .3); smile(-110, 6, 16, 5);
  dot(-142, 10, 5, BK); dot(-78, 10, 5, BK);
  x.restore();
}
function ladybird(t) {
  // ladybird seen from above: shell halves open a little to show the wings, wiggling legs, round head with face
  const o = Math.max(0, per(t, 20)) * .16, lg = per(t, 60) * .25;
  [-1, 1].forEach(d => { [-40, 10, 60].forEach((yy, i) => { x.save(); x.translate(d * 96, yy); x.rotate(d * ((i - 1) * .5 + (i % 2 ? lg : -lg)));
    x.beginPath(); x.moveTo(0, 0); x.lineTo(d * 52, 0); x.lineTo(d * 62, 16); line(9); x.restore(); }); });
  // wings underneath
  [-1, 1].forEach(d => { x.save(); x.translate(d * 30, 30); x.rotate(d * .25); x.beginPath(); x.ellipse(0, 40, 34, 92, 0, 0, 7); fill(); x.beginPath(); x.ellipse(0, 40, 34, 92, 0, 0, 7); line(4, BK);
    x.beginPath(); x.moveTo(0, -40); x.lineTo(0, 110); line(3, BK); x.restore(); });
  // shell halves
  [-1, 1].forEach(d => {
    x.save(); x.translate(0, -90); x.rotate(d * o); x.translate(0, 90);
    x.save(); x.beginPath(); x.rect(d < 0 ? -130 : 0, -120, 130, 260); x.clip();
    x.beginPath(); x.arc(0, 12, 110, 0, 7); fill();
    [[50, -40, 22], [64, 32, 24], [34, 84, 17], [16, -2, 13]].forEach(([a, b, r]) => dot(d * a, b, r, BK));
    x.beginPath(); x.moveTo(0, -100); x.lineTo(0, 124); line(7, BK);
    x.restore();
    x.beginPath(); x.arc(0, 12, 110, d < 0 ? Math.PI / 2 : -Math.PI / 2, d < 0 ? Math.PI * 1.5 : Math.PI / 2); line(4, BK);
    x.restore();
  });
  // head
  [-1, 1].forEach(d => { x.beginPath(); x.moveTo(d * 14, -136); x.quadraticCurveTo(d * 24, -170, d * 48, -176); line(5); dot(d * 50, -176, 8); });
  dot(0, -104, 46); ring(0, -104, 46, 5);
  eye(-17, -112, 9, t, .2); eye(17, -112, 9, t, .5); smile(0, -100, 14, 5);
}
function daisy(t) {
  // smiling daisy on a stem with two leaves; the petal ring turns very slowly
  x.beginPath(); x.moveTo(0, -40); x.bezierCurveTo(-14, 30, 14, 90, 0, 150); line(14);
  x.beginPath(); x.ellipse(-44, 96, 44, 18, -.5, 0, 7); fill(); x.beginPath(); x.moveTo(-8, 116); x.lineTo(-78, 80); line(4, BK);
  x.beginPath(); x.ellipse(44, 62, 44, 18, .5, 0, 7); fill(); x.beginPath(); x.moveTo(8, 82); x.lineTo(78, 44); line(4, BK);
  ell(0, 152, 50, 8);
  x.save(); x.translate(0, -60); x.rotate(per(t, 4) * .3);
  for (let i = 0; i < 12; i++) { const a = i * TAU / 12, cx = Math.cos(a) * 74, cy = Math.sin(a) * 74;
    x.beginPath(); x.ellipse(cx, cy, 42, 20, a, 0, 7); fill(); x.beginPath(); x.ellipse(cx, cy, 42, 20, a, 0, 7); line(4, BK);
    x.beginPath(); x.moveTo(Math.cos(a) * 58, Math.sin(a) * 58); x.lineTo(Math.cos(a) * 94, Math.sin(a) * 94); line(3, BK); }
  x.restore();
  dot(0, -60, 50); ring(0, -60, 50, 6);
  eye(-18, -70, 9, t, .1); eye(18, -70, 9, t, .4); smile(0, -56, 16, 5);
  dot(-32, -48, 6, BK); dot(32, -48, 6, BK);
}
function dragonfly(t) {
  // dragonfly (head on the left): long segmented tail, two pairs of veined wings that buzz, big round eyes
  const bz = per(t, 360) * .1;
  x.beginPath(); x.roundRect(-10, -11, 200, 22, 11); fill();
  for (let i = 0; i < 7; i++) { x.beginPath(); x.moveTo(20 + i * 24, -11); x.lineTo(20 + i * 24, 11); line(4, BK); }
  [-50, -30].forEach((xx, i) => { x.beginPath(); x.moveTo(xx, 20); x.lineTo(xx - 14 + i * 8, 52); line(5); });
  x.beginPath(); x.ellipse(-36, 0, 46, 28, 0, 0, 7); fill(); x.beginPath(); x.ellipse(-36, 0, 46, 28, 0, 0, 7); line(4, BK);
  [[.55, 0], [-.2, 1]].forEach(([r, i]) => {
    x.save(); x.translate(-30 + i * 10, -22); x.rotate(r + (i ? -bz : bz));
    x.beginPath(); x.ellipse(0, -70, 22, 72, 0, 0, 7); fill(); x.beginPath(); x.ellipse(0, -70, 22, 72, 0, 0, 7); line(4, BK);
    x.beginPath(); x.moveTo(0, -4); x.lineTo(0, -136); line(3, BK);
    for (let k = 1; k < 5; k++) { x.beginPath(); x.moveTo(-18, -k * 28); x.lineTo(18, -k * 28 - 10); line(2.5, BK); }
    x.restore();
  });
  dot(-100, -4, 40); ring(-100, -4, 40, 5);
  eye(-116, -16, 13, t); eye(-84, -16, 13, t, .3); smile(-100, 8, 12, 4);
}
function caterpillar(t) {
  // caterpillar (head on the left) inching along: a hump travels through the body; spotted segments, little feet
  x.save(); x.translate(0, 40);
  const seg = [];
  for (let i = 0; i < 6; i++) seg.push([-90 + i * 44, -Math.max(0, Math.sin(TAU * 40 * t / L.P - i * .9)) * 26]);
  for (let i = 5; i >= 0; i--) {
    const [sx, sy] = seg[i];
    ell(sx, 30, 9, 6); dot(sx, sy, 36); ring(sx, sy, 36, 5);
    x.beginPath(); x.arc(sx, sy, 24, Math.PI + .7, TAU - .7); line(5, BK); if (i % 2) { x.beginPath(); x.arc(sx, sy, 24, .7, Math.PI - .7); line(5, BK); }
  }
  const hy = -14 + seg[0][1] * .6;
  [-1, 1].forEach(d => { x.beginPath(); x.moveTo(-140 + d * 16, hy - 40); x.quadraticCurveTo(-140 + d * 22, hy - 76, -140 + d * 36, hy - 84); line(5); dot(-140 + d * 37, hy - 84, 8); });
  dot(-140, hy, 46); ring(-140, hy, 46, 5);
  eye(-156, hy - 10, 9, t); eye(-124, hy - 10, 9, t, .3); smile(-140, hy + 6, 14, 5);
  x.restore();
}
function snail(t) {
  // snail (head on the left): big spiral shell, long foot, eye stalks that wiggle
  const w = per(t, 30) * .12;
  x.save(); x.translate(0, 10);
  x.beginPath(); x.moveTo(-120, 84); x.lineTo(130, 84); x.quadraticCurveTo(160, 84, 150, 66); x.lineTo(-110, 50); x.closePath(); fill();
  x.beginPath(); x.moveTo(-90, 84); x.quadraticCurveTo(-170, 84, -158, 20); x.lineTo(-150, -30); x.lineTo(-104, -20); x.lineTo(-70, 60); x.closePath(); fill();
  // stalks
  [[-160, -1], [-118, 1]].forEach(([sx, d]) => { x.save(); x.translate(sx, -40); x.rotate(d * .2 + w * d);
    x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -62); line(8); dot(0, -66, 15); eye(0, -66, 8, t, d > 0 ? .3 : 0); x.restore(); });
  dot(-138, -26, 40);
  smile(-142, -18, 16, 5); dot(-160, -10, 5, BK);
  // shell
  x.beginPath(); x.arc(20, -10, 100, 0, 7); fill(); ring(20, -10, 100, 6);
  x.beginPath();
  for (let i = 0; i <= 120; i++) { const a = i * .1 + per(t, 2) * .2, r = 4 + i * .74; const px = 20 + Math.cos(-a) * r, py = -10 + Math.sin(-a) * r; i ? x.lineTo(px, py) : x.moveTo(px, py); }
  line(9, BK);
  x.restore();
}
function beehive(t) {
  // skep beehive with a face; a bee peeks out of the round door and a small bee circles the hive
  const pk = Math.max(0, per(t, 20));
  const a = TAU * 30 * t / L.P, bx = Math.cos(a) * 196, by = -30 + Math.sin(a) * 50;
  function miniBee() {
    x.save(); x.translate(bx, by); x.scale(Math.sin(a) > 0 ? 1 : -1, 1);
    x.beginPath(); x.ellipse(0, 0, 30, 20, 0, 0, 7); fill();
    x.save(); x.beginPath(); x.ellipse(0, 0, 30, 20, 0, 0, 7); x.clip(); [-6, 10].forEach(xx => { x.fillStyle = BK; x.fillRect(xx, -22, 8, 44); }); x.restore();
    x.beginPath(); x.ellipse(0, 0, 30, 20, 0, 0, 7); line(3, BK);
    x.beginPath(); x.ellipse(-2, -26, 10, 14, -.3, 0, 7); fill(); x.beginPath(); x.ellipse(-2, -26, 10, 14, -.3, 0, 7); line(3, BK);
    dot(-30, -2, 13); ring(-30, -2, 13, 3); dot(-34, -5, 3, BK); dot(-26, -5, 3, BK);
    x.restore();
  }
  if (Math.cos(a - Math.PI / 2) < 0) miniBee();   // behind the hive (upper half of the orbit)
  ell(0, 124, 176, 12);
  const dome = () => { x.beginPath(); x.moveTo(-140, 120); x.lineTo(-140, 50); x.bezierCurveTo(-140, -80, -60, -140, 0, -140); x.bezierCurveTo(60, -140, 140, -80, 140, 50); x.lineTo(140, 120); x.closePath(); };
  dome(); fill();
  x.save(); dome(); x.clip();
  for (let i = 0; i < 7; i++) { const y = 100 - i * 34; x.beginPath(); x.moveTo(-150, y); x.quadraticCurveTo(0, y + 14, 150, y); line(5, BK); }
  x.restore();
  // door + peeking bee
  const door = () => { x.beginPath(); x.moveTo(-36, 120); x.lineTo(-36, 84); x.arc(0, 84, 36, Math.PI, 0); x.lineTo(36, 120); x.closePath(); };
  door(); fill(BK);
  x.save(); door(); x.clip(); x.translate(0, 140 - pk * 56);
  dot(0, 0, 26); x.beginPath(); x.moveTo(-10, -24); x.lineTo(-16, -40); x.moveTo(10, -24); x.lineTo(16, -40); line(3);
  eye(-9, -4, 5, t); eye(9, -4, 5, t, .3); smile(0, 4, 8, 3);
  x.restore();
  // face on the hive (on a plain white patch)
  x.beginPath(); x.ellipse(0, -28, 84, 44, 0, 0, 7); fill();
  eye(-44, -38, 12, t, .4); eye(44, -38, 12, t, .1); smile(0, -26, 20, 6);
  if (Math.cos(a - Math.PI / 2) >= 0) miniBee();
}
function leaf(t) {
  // smiling leaf that tilts gently, with veins towards the tip
  x.save(); x.rotate(per(t, 10) * .08);
  x.beginPath(); x.moveTo(-150, 6); x.lineTo(-190, 30); line(10);
  const shape = () => { x.beginPath(); x.moveTo(-150, 6); x.bezierCurveTo(-90, -116, 90, -110, 156, -14); x.bezierCurveTo(90, 92, -90, 96, -150, 6); x.closePath(); };
  shape(); fill();
  x.beginPath(); x.moveTo(40, -18); x.quadraticCurveTo(100, -22, 150, -14); line(6, BK);
  x.beginPath(); x.moveTo(-148, 6); x.lineTo(-100, 0); line(6, BK);
  [[60, -20, 80, -66], [96, -20, 116, -58], [60, -18, 84, 32], [96, -18, 116, 22]].forEach(([a, b, c, d]) => { x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo((a + c) / 2 - 6, (b + d) / 2, c, d); line(4, BK); });
  eye(-46, -26, 11, t, .2); eye(4, -26, 11, t, .5); smile(-21, -8, 18, 6);
  dot(-70, -4, 6, BK); dot(28, -4, 6, BK);
  x.restore();
}
function sunflower(t) {
  // big sunflower: two rings of pointed petals, black seed disk with white seed dots, smiling face in the middle
  x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(10, 80, 0, 164); line(18);
  [-1, 1].forEach(d => { x.save(); x.translate(0, 120 + d * 10); x.rotate(d * (-.5 + per(t, 12) * .05)); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(d * 40, -40, d * 96, -6); x.quadraticCurveTo(d * 40, 30, 0, 0); fill();
    x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(d * 46, -8, d * 90, -6); line(4, BK); x.restore(); });
  x.save(); x.translate(0, -50); x.rotate(per(t, 4) * .15);
  for (let ringI = 0; ringI < 2; ringI++) {
    const R = ringI ? 122 : 108, off = ringI ? 0 : TAU / 32;
    for (let i = 0; i < 16; i++) { const a = i * TAU / 16 + off; x.save(); x.rotate(a);
      x.beginPath(); x.moveTo(58, -17); x.quadraticCurveTo(R - 20, -18, R, 0); x.quadraticCurveTo(R - 20, 18, 58, 17); x.closePath(); fill(); line(3, BK); x.restore(); }
  }
  x.restore();
  dot(0, -50, 66, BK);
  for (let i = 40; i < 150; i++) { const r = 5 * Math.sqrt(i), a = i * 2.39996 + per(t, 4) * .15; if (r > 37 && r < 60) dot(Math.cos(a) * r, -50 + Math.sin(a) * r, 3); }
  dot(0, -50, 33);
  eye(-12, -56, 7, t, .2); eye(12, -56, 7, t, .5); smile(0, -48, 11, 4);
}

// background
const DURV = +(process.env.DUR || L.P), T0V = +(process.env.T0 || 0);
const outroK = ts => (process.env.FADEOUT ? ease(((ts - T0V) - (DURV - 14)) / 2.5) : 0);
function bg(t) {
  const night = outroK(t);
  // sun (top left), fades away in the outro
  if (night < 1) {
    x.save(); x.globalAlpha *= 1 - night; x.translate(92, 88);
    x.save(); x.rotate(TAU * 2 * t / L.P);
    for (let i = 0; i < 12; i++) { x.save(); x.rotate(i * TAU / 12); x.beginPath(); x.moveTo(0, -38); x.lineTo(0, i % 2 ? -50 : -56); line(5); x.restore(); }
    x.restore();
    dot(0, 0, 30); sleepyEye(-10, -4, 5, 3); sleepyEye(10, -4, 5, 3); smile(0, 4, 10, 3);
    x.restore();
  }
  // stars appear in the outro
  if (night > 0) for (let i = 0; i < 12; i++) { const sx = 50 + hash(i + 41) * 860, sy = 30 + hash(i + 17) * 120;
    x.save(); x.globalAlpha *= night * (.5 + .5 * per(t + i * 11, 8 + i)); dot(sx, sy, 1.8 + hash(i + 5) * 2); x.restore(); }
  // slow cloud outline (top right)
  x.save(); x.globalAlpha *= .45; x.translate(810 + per(t, 1) * 30, 80);
  x.beginPath(); x.moveTo(-70, 18); x.arc(-40, 4, 26, Math.PI * .8, Math.PI * 1.6); x.arc(4, -10, 34, Math.PI * 1.1, Math.PI * 1.95); x.arc(46, 6, 24, Math.PI * 1.4, Math.PI * .3); x.closePath(); line(4);
  x.restore();
  // grass
  x.beginPath(); x.rect(0, 500, 960, 40); fill();
  for (let i = 0; i < 49; i++) {
    const bx = i * 20, h = 18 + hash(i + 3) * 22, sw = per(t + hash(i) * 40, 12) * 6;
    x.beginPath(); x.moveTo(bx - 7, 502); x.quadraticCurveTo(bx, 490 - h / 2, bx + sw, 500 - h); x.quadraticCurveTo(bx + 2, 490 - h / 2, bx + 7, 502); x.closePath(); fill();
  }
  // little flowers in the grass
  [70, 230, 410, 600, 760, 900].forEach((fx, i) => {
    const fy = 470 + (i % 2) * 8, sw = per(t + i * 17, 10) * 3;
    x.beginPath(); x.moveTo(fx, 502); x.lineTo(fx + sw, fy); line(4);
    x.save(); x.translate(fx + sw, fy);
    for (let k = 0; k < 5; k++) { const a = k * TAU / 5; dot(Math.cos(a) * 8, Math.sin(a) * 8, 6); }
    dot(0, 0, 4, BK); x.restore();
  });
  x.beginPath(); x.moveTo(0, 520); for (let i = 0; i <= 8; i++) x.quadraticCurveTo(i * 120 + 60, 512 + (i % 2) * 14, i * 120 + 120, 520); line(3, BK);
}
function fg(t) {
  // drifting pollen dots: each rises slowly 3x per period, away from the frame edges
  for (let i = 0; i < 12; i++) {
    const k = ((t * 3 / L.P) + hash(i + 51)) % 1;
    const sx = 60 + hash(i + 13) * 840 + Math.sin(k * TAU * 2 + i) * 22, sy = 470 - k * 400, r = 2 + hash(i + 7) * 2.5;
    x.save(); x.globalAlpha *= Math.sin(Math.PI * k) * .75; dot(sx, sy, r); x.restore();
  }
}
// outro: caterpillar and butterfly asleep on a big leaf under a crescent moon
function sleepyEnd(t) {
  x.save(); x.translate(200, -170); dot(0, 0, 50); dot(22, -14, 44, BK); x.restore();
  const br = 1 + per(t, 16) * .02;
  x.save(); x.translate(0, 40); x.scale(br, br);
  // leaf
  x.beginPath(); x.moveTo(250, 50); x.lineTo(290, 70); line(10);
  x.beginPath(); x.moveTo(-250, 70); x.bezierCurveTo(-120, -20, 120, -20, 250, 50); x.bezierCurveTo(120, 130, -120, 140, -250, 70); x.closePath(); fill();
  x.beginPath(); x.moveTo(-240, 70); x.quadraticCurveTo(0, 56, 246, 52); line(5, BK);
  [-180, -100, 160].forEach(vx => { x.beginPath(); x.moveTo(vx, 64); x.lineTo(vx + 40, 110); line(3.5, BK); });
  // caterpillar lying along the leaf
  for (let i = 5; i >= 0; i--) { const sx = 10 - i * 30, sy = 20 + Math.sin(i * 1.2) * 4; dot(sx, sy, 26); ring(sx, sy, 26, 4); }
  x.save(); x.translate(-176, 6);
  [-1, 1].forEach(d => { x.beginPath(); x.moveTo(d * 12, -28); x.quadraticCurveTo(d * 16, -50, d * 28, -54); line(4); dot(d * 29, -54, 6); });
  dot(0, 0, 32); ring(0, 0, 32, 4); sleepyEye(-12, -4, 7, 4); sleepyEye(12, -4, 7, 4);
  x.restore();
  // butterfly sitting with folded wings
  x.save(); x.translate(140, 20);
  x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(-60, -60, -40, -170, 30, -160); x.bezierCurveTo(70, -150, 50, -60, 0, 0); fill(); line(4, BK);
  x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(10, -50, 80, -130, 110, -90); x.bezierCurveTo(120, -50, 50, -10, 0, 0); fill(); line(4, BK);
  dot(14, -112, 16, BK); dot(14, -112, 6); dot(72, -84, 10, BK);
  x.beginPath(); x.ellipse(10, 8, 46, 11, 0, 0, 7); fill(); x.beginPath(); x.ellipse(10, 8, 46, 11, 0, 0, 7); line(3, BK);
  [-1, 1].forEach(d => { x.beginPath(); x.moveTo(-40, -6); x.quadraticCurveTo(-60, -40 - d * 6, -78 + d * 6, -46 - d * 6); line(3); dot(-78 + d * 6, -46 - d * 6, 5); });
  dot(-44, 4, 16); ring(-44, 4, 16, 3); sleepyEye(-48, 2, 5, 3);
  x.restore();
  x.restore();
  zz(t, -190, -60); zz(t, -40, -110, .5);
}

L.scene({
  seed: 99,
  figs: [[butterfly, .85, 'fly'], [bee, .8, 'swimL'], [ladybird, .8, 'float'], [daisy, .85, 'sway'], [dragonfly, .85, 'swimR'],
         [caterpillar, .85, 'floor'], [snail, .8, 'floor'], [beehive, .8, 'sway'], [leaf, .85, 'float'], [sunflower, .8, 'sway']],
  bg, fg, end: sleepyEnd,
});
