// Daily B&W sensory #5: Safari Babies – white savanna babies on black: lion cub, baby elephant, giraffe, zebra, hippo (yawning),
// monkey with a banana, rhino calf, flamingo on one leg, meerkat popping up, tortoise peeking out of its shell.
// Background: low savanna horizon with grass tufts, two flat-top acacia trees, slowly turning sun rays, a few birds gliding.
// All figures are new drawings for this video (own design). Figures look LEFT.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;

const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const leg = (lx, ly, len, w, ang) => { x.save(); x.translate(lx, ly); x.rotate(ang); x.beginPath(); x.roundRect(-w / 2, 0, w, len, w / 2); x.fillStyle = WH; x.fill(); x.restore(); };
const walk = (t, i) => per(t, 60) * .22 * (i % 2 ? 1 : -1);

function lionCub(t) {
  // sitting body + tail with a tuft
  ell(60, 70, 85, 62);
  x.beginPath(); x.moveTo(130, 100); x.quadraticCurveTo(200, 90 + per(t, 20) * 20, 190, 20); line(10); dot(190, 14 + per(t, 20) * 4, 20);
  leg(20, 90, 50, 30, 0); leg(70, 95, 46, 30, 0);
  // fluffy mane: ring of bumps, black outline ring, then the face
  x.save(); x.translate(-40, -20); x.rotate(per(t, 10) * .05);
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; dot(Math.cos(a) * 88, Math.sin(a) * 88, 34); }
  x.beginPath(); x.arc(0, 0, 74, 0, 7); line(8, BK);
  [[-1], [1]].forEach(([d]) => { dot(d * 50, -52, 20); dot(d * 50, -52, 9, BK); });
  dot(0, 0, 66);
  eye(-24, -12, 11, t); eye(24, -12, 11, t, .2);
  x.beginPath(); x.moveTo(-14, 10); x.lineTo(14, 10); x.lineTo(0, 24); x.closePath(); x.fillStyle = BK; x.fill();
  x.beginPath(); x.moveTo(0, 24); x.quadraticCurveTo(-8, 38, -20, 32); x.moveTo(0, 24); x.quadraticCurveTo(8, 38, 20, 32); line(5, BK);
  [[-30, 26], [-38, 18], [30, 26], [38, 18]].forEach(([a, b]) => dot(a, b, 3, BK));
  x.restore();
}
function babyElephant(t) {
  // walking baby elephant, big flapping ear, trunk swinging up
  [[-50, 0], [-10, 1], [50, 2], [90, 3]].forEach(([lx, i]) => leg(lx, 40, 80, 38, walk(t, i)));
  ell(20, 10, 120, 80);
  x.beginPath(); x.moveTo(135, -10); x.quadraticCurveTo(160, 20, 150, 50); line(7); dot(150, 54, 7);
  dot(-95, -30, 70);
  // trunk
  const sw = per(t, 12);
  x.beginPath(); x.moveTo(-150, -20); x.quadraticCurveTo(-200, 30 - sw * 20, -190, 70 - sw * 60); x.quadraticCurveTo(-185, 95 - sw * 80, -165, 92 - sw * 90); line(30);
  [-160, -175].forEach(yy => { x.beginPath(); x.moveTo(-178 + (yy + 160) * .2, yy + 120 - sw * 30); x.lineTo(-198 + (yy + 160) * .2, yy + 124 - sw * 30); line(3, BK); });
  // ear
  x.save(); x.translate(-70, -40); x.rotate(per(t, 16) * .15);
  x.beginPath(); x.ellipse(30, 10, 55, 70, -.2, 0, 7); x.fillStyle = WH; x.fill(); x.beginPath(); x.ellipse(30, 10, 36, 50, -.2, 0, 7); line(6, BK); x.restore();
  eye(-120, -40, 11, t); smile(-125, -5, 14, 5);
}
function giraffe(t) {
  // tall neck swaying, black patches, little horns
  const sw = per(t, 12) * .08;
  [[-40, 0], [-10, 1], [60, 2], [90, 3]].forEach(([lx, i]) => leg(lx, 70, 110, 22, i % 2 ? .05 : -.05));
  ell(25, 60, 95, 50);
  x.beginPath(); x.moveTo(115, 50); x.quadraticCurveTo(150, 80, 140, 120); line(6); dot(140, 126, 9);
  x.save(); x.translate(-50, 40); x.rotate(-.25 + sw);
  x.beginPath(); x.moveTo(-26, 0); x.lineTo(-18, -230); x.lineTo(18, -230); x.lineTo(30, 0); x.closePath(); x.fillStyle = WH; x.fill();
  for (let k = 0; k < 6; k++) { x.beginPath(); x.moveTo(26, -10 - k * 36); x.lineTo(40, -26 - k * 36); line(10); }   // little mane
  // head
  x.translate(0, -240);
  x.beginPath(); x.ellipse(-30, 6, 52, 30, -.2, 0, 7); x.fillStyle = WH; x.fill();
  [[-6, -30], [16, -28]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a, b + 8); x.lineTo(a, b - 18); line(8); dot(a, b - 22, 9); });
  x.save(); x.translate(24, -10); x.rotate(per(t, 20) * .3); ell(16, 0, 22, 9); x.restore();
  eye(-20, -4, 10, t); dot(-70, 12, 4, BK); smile(-58, 16, 10, 4);
  x.restore();
  // patches on the body (clipped)
  x.save(); x.beginPath(); x.ellipse(25, 60, 95, 50, 0, 0, 7); x.clip();
  [[-40, 40, 20], [0, 70, 24], [40, 36, 18], [80, 70, 20], [-20, 90, 16], [60, 100, 18]].forEach(([a, b, r]) => { x.beginPath();
    for (let i = 0; i < 6; i++) { const q = i / 6 * TAU + a; x.lineTo(a + Math.cos(q) * r, b + Math.sin(q) * r * .8); } x.closePath(); x.fillStyle = BK; x.fill(); });
  x.restore();
}
function zebra(t) {
  [[-60, 0], [-30, 1], [50, 2], [80, 3]].forEach(([lx, i]) => leg(lx, 40, 90, 22, walk(t, i)));
  const body = () => { x.beginPath(); x.ellipse(10, 10, 105, 55, 0, 0, 7); };
  body(); x.fillStyle = WH; x.fill();
  x.save(); body(); x.clip(); for (let k = -4; k <= 4; k++) { x.beginPath(); x.moveTo(k * 26 + 8, -50); x.quadraticCurveTo(k * 26 + 22, 10, k * 26 + 4, 70); line(10, BK); } x.restore();
  x.beginPath(); x.moveTo(110, 0); x.quadraticCurveTo(140, 30 + per(t, 20) * 14, 130, 70); line(6); ell(130, 80, 9, 16);
  // neck + head
  x.save(); x.translate(-80, -10); x.rotate(-.5 + per(t, 12) * .05);
  x.beginPath(); x.roundRect(-30, -120, 60, 130, 24); x.fillStyle = WH; x.fill();
  for (let k = 0; k < 4; k++) { x.beginPath(); x.moveTo(-28, -100 + k * 28); x.lineTo(28, -92 + k * 28); line(8, BK); }
  for (let k = 0; k < 6; k++) { x.beginPath(); x.moveTo(26, -110 + k * 20); x.lineTo(40, -114 + k * 20); line(9); }
  x.translate(-10, -130); x.rotate(.5);
  x.beginPath(); x.ellipse(-30, 0, 62, 32, 0, 0, 7); x.fillStyle = WH; x.fill();
  ell(-74, 6, 22, 22, BK); dot(-80, 0, 4); smile(-70, 6, 10, 3, WH);
  [[10, -26], [26, -20]].forEach(([a, b]) => { x.beginPath(); x.ellipse(a, b - 16, 9, 20, .3, 0, 7); x.fillStyle = WH; x.fill(); });
  eye(-20, -8, 10, t);
  x.restore();
}
function hippo(t) {
  // round hippo head, yawns now and then, ears wiggle
  const yawn = Math.max(0, per(t, 6)) ** 2;
  ell(30, 70, 140, 70);
  [[-60], [20], [100]].forEach(([lx], i) => leg(lx, 110, 40, 40, 0));
  [[-1], [1]].forEach(([d], i) => { x.save(); x.translate(d * 60, -112); x.rotate(per(t, 30 + i * 6) * .3); ell(0, 0, 18, 24); ell(0, 2, 8, 12, BK); x.restore(); });
  ell(0, -50, 100, 74);
  // mouth / snout
  x.save(); x.translate(0, 20);
  ell(0, -yawn * 20, 120, 54 - yawn * 6);
  if (yawn > .05) { ell(0, 18, 80, 34 * yawn, BK); [-50, 50].forEach(a => { x.beginPath(); x.roundRect(a - 8, 4, 16, 20 * yawn, 4); x.fillStyle = WH; x.fill(); }); }
  else { x.beginPath(); x.moveTo(-80, 26); x.quadraticCurveTo(0, 50, 80, 26); line(6, BK); }
  [[-34], [34]].forEach(([a]) => ell(a, -28 - yawn * 20, 10, 14, BK));
  x.restore();
  if (yawn > .4) { sleepyEye(-40, -80, 12, 6); sleepyEye(40, -80, 12, 6); } else { eye(-40, -80, 13, t); eye(40, -80, 13, t, .3); }
}
function monkey(t) {
  // little monkey swinging along, holding a banana, curly tail
  x.save(); x.rotate(per(t, 24) * .1);
  x.beginPath(); x.moveTo(50, 60); x.bezierCurveTo(140, 80, 160, -20, 120, -40); x.bezierCurveTo(100, -50, 90, -20, 110, -14); line(12);
  ell(20, 40, 60, 66);
  ell(10, 54, 36, 40, BK); ell(10, 54, 30, 34);
  leg(-10, 90, 50, 22, .3); leg(40, 90, 50, 22, -.3);
  // arm up with a banana
  x.save(); x.translate(-30, 10); x.rotate(1.9 + per(t, 20) * .15); x.beginPath(); x.roundRect(-11, 0, 22, 90, 11); x.fillStyle = WH; x.fill();
  x.translate(0, 96); x.rotate(.6); x.beginPath(); x.moveTo(-10, 0); x.quadraticCurveTo(10, -60, 50, -70); x.quadraticCurveTo(20, -40, 10, 6); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-6, 0); x.quadraticCurveTo(12, -50, 46, -66); line(4, BK); x.restore();
  // head: round with a heart-shaped face area
  [[-1], [1]].forEach(([d]) => { dot(d * 74 - 20, -70, 26); dot(d * 74 - 20, -70, 13, BK); });
  dot(-20, -70, 72);
  x.beginPath(); x.moveTo(-20, -30); x.bezierCurveTo(-90, -50, -80, -120, -40, -112); x.quadraticCurveTo(-20, -104, -20, -96);
  x.quadraticCurveTo(-20, -104, 0, -112); x.bezierCurveTo(40, -120, 50, -50, -20, -30); line(6, BK);
  eye(-44, -80, 10, t); eye(4, -80, 10, t, .3);
  dot(-28, -58, 3.5, BK); dot(-12, -58, 3.5, BK); smile(-20, -52, 16, 5);
  x.restore();
}
function rhinoCalf(t) {
  [[-70, 0], [-30, 1], [40, 2], [80, 3]].forEach(([lx, i]) => leg(lx, 30, 66, 40, walk(t, i)));
  ell(10, 0, 120, 74);
  x.beginPath(); x.moveTo(-60, -50); x.quadraticCurveTo(-40, -10, -60, 40); line(4, BK);       // skin fold
  x.beginPath(); x.moveTo(126, -10); x.quadraticCurveTo(150, 10 + per(t, 20) * 10, 140, 40); line(6); ell(140, 46, 6, 10);
  // head with a small horn
  x.save(); x.translate(-120, -10); x.rotate(.15 + per(t, 12) * .05);
  x.beginPath(); x.ellipse(-20, 10, 74, 52, -.1, 0, 7); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-80, -14); x.quadraticCurveTo(-100, -60, -82, -76); x.quadraticCurveTo(-70, -40, -56, -24); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-40, -24); x.lineTo(-44, -44); x.lineTo(-28, -30); x.closePath(); x.fill();
  [[24, -38], [44, -30]].forEach(([a, b], i) => { x.save(); x.translate(a, b); x.rotate(per(t + i * 4, 30) * .3); ell(0, -16, 10, 22); ell(0, -14, 4, 12, BK); x.restore(); });
  eye(-14, -6, 11, t); dot(-82, 18, 5, BK); smile(-66, 30, 12, 5);
  x.restore();
}
function flamingo(t) {
  // standing on one leg, S-shaped neck, bent beak with black tip
  x.beginPath(); x.moveTo(20, 60); x.lineTo(20, 220); line(8);
  x.beginPath(); x.moveTo(24, 70); x.lineTo(60, 120); x.lineTo(28, 150); line(8);
  x.beginPath(); x.moveTo(20, 220); x.lineTo(-10, 226); line(7);
  x.save(); x.translate(0, per(t, 12) * 4);
  x.beginPath(); x.moveTo(-60, 20); x.quadraticCurveTo(10, -50, 110, 0); x.quadraticCurveTo(150, 30, 120, 50); x.quadraticCurveTo(30, 90, -60, 20); x.fillStyle = WH; x.fill();
  [[40, 20], [70, 30], [94, 40]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 18, .4, 2.4); line(4, BK); });
  const sw = per(t, 10) * 10;
  x.beginPath(); x.moveTo(-40, 10); x.bezierCurveTo(-110, -40, -10 + sw, -90, -60 + sw, -150); x.bezierCurveTo(-90 + sw, -190, -40 + sw, -230, -10 + sw, -205); line(20);
  dot(-14 + sw, -205, 26);
  x.beginPath(); x.moveTo(-36 + sw, -206); x.quadraticCurveTo(-74 + sw, -204, -70 + sw, -170); x.quadraticCurveTo(-60 + sw, -190, -34 + sw, -194); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-70 + sw, -176); x.quadraticCurveTo(-68 + sw, -186, -58 + sw, -188); line(7, BK);
  eye(-16 + sw, -212, 7, t); smile(-26 + sw, -200, 6, 3);
  x.restore();
}
function meerkat(t) {
  // meerkat standing tall on its sandy mound, looking left and right
  ell(0, 150, 140, 34);
  x.beginPath(); x.arc(0, 150, 26, Math.PI, 0); x.fillStyle = BK; x.fill();
  x.beginPath(); x.moveTo(30, 120); x.quadraticCurveTo(80, 120, 70, 60); line(12);
  ell(0, 50, 46, 86);
  ell(0, 66, 26, 52, BK); ell(0, 66, 20, 46);
  [[-1], [1]].forEach(([d]) => { x.save(); x.translate(d * 26, 0); x.rotate(d * .5); x.beginPath(); x.roundRect(-8, 0, 16, 46, 8); x.fillStyle = WH; x.fill(); x.restore(); });
  const look = per(t, 16);
  x.save(); x.translate(look * 8, -60); x.rotate(look * .12);
  ell(0, 0, 42, 46);
  [[-1], [1]].forEach(([d]) => { dot(d * 36, -26, 12); dot(d * 36, -26, 5, BK); });
  [-16, 16].forEach((ex, i) => { ell(ex + look * 3, -4, 15, 13, BK, i ? -.4 : .4); dot(ex + look * 3, -4, 9); eye(ex + look * 5, -4, 6, t, i * .2); });
  x.beginPath(); x.ellipse(look * 6, 22, 16, 13, 0, 0, 7); x.fillStyle = WH; x.fill();
  dot(look * 7, 16, 6, BK); smile(look * 7, 22, 8, 4);
  x.restore();
}
function tortoise(t) {
  // dome shell with a pattern, head slowly peeks out
  const peek = .5 + .5 * per(t, 8);
  [[-70], [-20], [40], [86]].forEach(([lx], i) => leg(lx, 20, 36, 30, walk(t, i) * .6));
  x.save(); x.translate(-110 + (1 - peek) * 40, -10);
  x.beginPath(); x.roundRect(-10, -14, 70, 36, 18); x.fillStyle = WH; x.fill();
  x.beginPath(); x.ellipse(-24, -18, 40, 32, -.2, 0, 7); x.fill();
  eye(-36, -26, 9, t); smile(-44, -10, 9, 4);
  x.restore();
  x.beginPath(); x.moveTo(110, 20); x.lineTo(140, 30); x.lineTo(110, 36); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-120, 30); x.bezierCurveTo(-120, -120, 130, -120, 130, 30); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.roundRect(-128, 20, 266, 18, 9); x.fill();
  x.beginPath(); x.moveTo(-122, 22); x.lineTo(132, 22); line(4, BK);
  const hex = (cx, cy, r) => { x.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + Math.PI / 6; x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } x.closePath(); line(6, BK); };
  hex(5, -40, 30); hex(-55, -12, 24); hex(65, -12, 24); hex(-25, -78, 18); hex(35, -78, 18);
}

function bg(t) {
  // sun with slowly turning rays (top right)
  x.save(); x.translate(820, 90); x.rotate(TAU * t / L.P);
  for (let i = 0; i < 12; i++) { x.rotate(TAU / 12); x.beginPath(); x.moveTo(0, 46); x.lineTo(0, 64); line(5); }
  x.restore(); x.beginPath(); x.arc(820, 90, 36, 0, 7); line(5);
  // gliding birds (2 cross per period each)
  for (let i = 0; i < 3; i++) { const k = ((t * 2 / L.P) + i / 3) % 1, bx = 1000 - k * 1100, by = 60 + i * 26 + Math.sin(k * TAU * 2 + i) * 8, f = 6 + per(t + i * 7, 60) * 4;
    x.beginPath(); x.moveTo(bx - 14, by - f); x.quadraticCurveTo(bx - 6, by - 4, bx, by); x.quadraticCurveTo(bx + 6, by - 4, bx + 14, by - f); line(3); }
  // horizon: flat ground with grass tufts
  x.fillStyle = WH; x.fillRect(0, 500, 960, 40);
  for (let i = 0; i < 26; i++) { const gx = 18 + i * 37 + (hash(i) - .5) * 14, h = 12 + hash(i + 5) * 12, w = per(t + i * 3, 6) * 3;
    x.beginPath(); x.moveTo(gx - 8, 501); x.lineTo(gx - 4 + w, 501 - h); x.lineTo(gx, 501); x.lineTo(gx + 4 + w, 503 - h * 1.2); x.lineTo(gx + 8, 501); x.closePath(); x.fillStyle = WH; x.fill(); }
  // two flat-top acacia trees at the edges
  [[70, 1], [905, .8]].forEach(([ax, s]) => { x.save(); x.translate(ax, 500); x.scale(s, s);
    x.beginPath(); x.moveTo(-8, 0); x.lineTo(-4, -110); x.lineTo(4, -110); x.lineTo(10, 0); x.closePath(); x.fillStyle = WH; x.fill();
    x.beginPath(); x.moveTo(0, -90); x.lineTo(-40, -130); line(7); x.beginPath(); x.moveTo(2, -100); x.lineTo(44, -134); line(7);
    const sw = per(t, 6) * 2;
    x.beginPath(); x.ellipse(sw, -140, 90, 20, 0, 0, 7); x.fillStyle = WH; x.fill();
    x.beginPath(); x.ellipse(-30 + sw, -152, 46, 14, 0, 0, 7); x.fill(); x.beginPath(); x.ellipse(36 + sw, -150, 44, 13, 0, 0, 7); x.fill();
    x.restore(); });
}
// outro: a sleeping lion cub curled up under a crescent moon, little z's
function sleepyEnd(t) {
  x.beginPath(); x.arc(150, -150, 46, 0, 7); x.fillStyle = WH; x.fill(); x.beginPath(); x.arc(170, -164, 40, 0, 7); x.fillStyle = BK; x.fill();
  x.save(); x.translate(0, 40 + per(t, 12) * 3);
  ell(30, 50, 140, 56);
  x.beginPath(); x.moveTo(160, 60); x.quadraticCurveTo(180, 110, 90, 110); line(10); dot(84, 110, 16);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; dot(-80 + Math.cos(a) * 66, 10 + Math.sin(a) * 66, 26); }
  x.beginPath(); x.arc(-80, 10, 56, 0, 7); line(7, BK);
  dot(-80, 10, 50);
  sleepyEye(-98, 4, 10, 5); sleepyEye(-62, 4, 10, 5);
  x.beginPath(); x.moveTo(-90, 22); x.lineTo(-70, 22); x.lineTo(-80, 32); x.closePath(); x.fillStyle = BK; x.fill();
  x.restore();
  x.font = C.FONT(34); x.fillStyle = WH; x.textAlign = 'center';
  for (let i = 0; i < 3; i++) { const k = (t * .3 + i / 3) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k); x.fillText('z', -40 + k * 60 + i * 6, -40 - k * 90); x.restore(); }
}

L.scene({
  seed: 53,
  figs: [[lionCub, .85, 'sway'], [babyElephant, .8, 'swimL'], [giraffe, .7, 'sway'], [zebra, .85, 'swimR'], [hippo, .85, 'sway'],
         [monkey, .85, 'fly'], [rhinoCalf, .85, 'floor'], [flamingo, .75, 'sway'], [meerkat, .85, 'float'], [tortoise, .9, 'floor']],
  bg, end: sleepyEnd,
});
