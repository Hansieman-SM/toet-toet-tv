// Daily B&W sensory #15: Pets – white pet friends with happy faces on black: a sitting puppy wagging its tail (eye patch, collar with tag),
// a kitten tapping a rolling ball of yarn while its tail swishes, a hamster running in a turning wheel, a goldfish swimming to and fro in a
// round bowl with rising bubbles, a parrot bobbing on a swing perch, a bunny hopping along with twitching ears, a turtle with a dotted shell
// walking slowly, a striped ball bouncing with squash and stretch, a happy dog bone with twinkling sparkles, and a little mouse peeking out
// of its hole next to a wedge of cheese.
// Background: cosy room – a window with twinkling stars and scalloped curtains, little hearts floating up on the right, zig-zag rug.
// Outro: puppy and kitten asleep together in a woven basket under a crescent moon, z z z.
// All figures are new drawings for this video (own design, no existing characters). Figures look LEFT. Everything periodic in P = 240 s.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;
const P = L.P;

const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const cheek = (cx, cy, r = 7) => { x.save(); x.globalAlpha *= .45; dot(cx, cy, r, BK); x.restore(); };
const outlineEll = (cx, cy, rx, ry, lw = 5, rot = 0, col = BK) => { x.beginPath(); x.ellipse(cx, cy, rx, ry, rot, 0, 7); line(lw, col); };
const heart = (cx, cy, s, col = WH) => { x.beginPath(); x.moveTo(cx, cy + 10 * s); x.bezierCurveTo(cx - 16 * s, cy - 2 * s, cx - 12 * s, cy - 16 * s, cx, cy - 8 * s);
  x.bezierCurveTo(cx + 12 * s, cy - 16 * s, cx + 16 * s, cy - 2 * s, cx, cy + 10 * s); x.fillStyle = col; x.fill(); };
const star4 = (cx, cy, r, col = WH) => { x.beginPath(); for (let k = 0; k < 8; k++) { const rr = k % 2 ? r * .3 : r, an = k * Math.PI / 4; k ? x.lineTo(cx + Math.cos(an) * rr, cy + Math.sin(an) * rr) : x.moveTo(cx + rr, cy); } x.closePath(); x.fillStyle = col; x.fill(); };
const wmouth = (cx, cy, r, lw = 4) => { x.beginPath(); x.arc(cx - r, cy, r, .2, Math.PI - .2); x.moveTo(cx + 2 * r * Math.cos(.2) - r, cy + r * Math.sin(.2)); x.arc(cx + r, cy, r, .2, Math.PI - .2); line(lw, BK); };

function puppy(t) {
  // sitting puppy wagging its tail, floppy ears, one eye patch, collar with a round tag
  const wag = per(t, 60) * .45, ear = per(t, 30) * .08;
  x.save(); x.translate(92, 60); x.rotate(-.6 + wag); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(30, -40, 20, -84); line(18); x.restore();
  ell(36, 58, 78, 64);
  ell(78, 96, 44, 28); x.beginPath(); x.arc(78, 92, 30, Math.PI * 1.1, Math.PI * 1.9); line(5, BK);
  [[-34], [4]].forEach(([lx]) => { x.fillStyle = WH; x.beginPath(); x.roundRect(lx - 14, 40, 28, 78, 12); x.fill(); ell(lx - 6, 118, 22, 11); x.beginPath(); x.moveTo(lx - 10, 112); x.lineTo(lx - 10, 124); x.moveTo(lx - 1, 112); x.lineTo(lx - 1, 124); line(3, BK); });
  x.beginPath(); x.moveTo(-14, 50); x.lineTo(-14, 116); line(5, BK);
  // floppy ears hanging at both sides of the head (drawn first, the head covers their tops)
  [[-104, -50, .55 + ear], [26, -52, -.35 - ear]].forEach(([ex, ey, r]) => { x.save(); x.translate(ex, ey); x.rotate(r); ell(0, 34, 22, 46); outlineEll(0, 34, 22, 46, 5); ell(0, 42, 10, 28, BK); x.restore(); });
  dot(-34, -36, 62);
  ell(-60, -4, 36, 26); outlineEll(-60, -4, 36, 26, 5);
  ell(-84, -16, 13, 9, BK); dot(-88, -19, 3.5);
  x.beginPath(); x.moveTo(-84, -8); x.lineTo(-84, 2); line(4, BK); wmouth(-84, 2, 8, 4);
  dot(-18, -56, 21, BK); dot(-18, -56, 15);
  eye(-60, -56, 10, t); eye(-18, -56, 10, t, .4); cheek(-6, -20);
  x.beginPath(); x.ellipse(-30, 22, 44, 14, .15, .1, Math.PI - .1); line(9, BK);
  dot(-36, 44, 11); outlineEll(-36, 44, 11, 11, 4); heart(-36, 45, .5, BK);
}
function kitten(t) {
  // kitten sitting, tapping a rolling ball of yarn with a paw; striped forehead, swishing tail
  const sw = per(t, 40) * .35, tap = Math.max(0, per(t, 30)) * 16, roll = per(t, 30) * .9;
  x.save(); x.translate(116, 100); x.rotate(sw); x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(50, 0, 50, -60, 30, -100); x.quadraticCurveTo(22, -116, 36, -126); line(16); x.restore();
  ell(56, 62, 60, 66);
  ell(98, 102, 34, 24); x.beginPath(); x.arc(96, 98, 24, Math.PI * 1.1, Math.PI * 1.9); line(5, BK);
  x.fillStyle = WH; x.beginPath(); x.roundRect(30, 60, 26, 62, 12); x.fill(); ell(42, 122, 18, 10);
  x.beginPath(); x.moveTo(36, 116); x.lineTo(36, 126); x.moveTo(46, 116); x.lineTo(46, 126); line(3, BK);
  // tapping paw
  x.save(); x.translate(10 - tap, 80); x.rotate(-.3); x.fillStyle = WH; x.beginPath(); x.roundRect(-12, 0, 24, 44, 11); x.fill(); x.restore();
  ell(2 - tap, 122, 16, 10);
  // yarn ball with a loose strand
  x.beginPath(); x.moveTo(-90, 132); x.bezierCurveTo(-60, 140, -40, 120, -12 - tap, 128); line(4);
  x.save(); x.translate(-110 + roll * 6, 92); x.rotate(roll);
  dot(0, 0, 42); x.save(); x.beginPath(); x.arc(0, 0, 42, 0, 7); x.clip();
  [-24, -8, 8, 24].forEach(o => { x.beginPath(); x.ellipse(o, 0, 14, 48, .5, 0, 7); line(4, BK); });
  x.beginPath(); x.ellipse(0, 0, 50, 16, -.6, 0, 7); line(4, BK);
  x.restore(); x.restore();
  // head
  [[10, -1], [80, 1]].forEach(([ex, s]) => { x.beginPath(); x.moveTo(ex - 26, -60); x.lineTo(ex + s * 6, -118); x.lineTo(ex + 26, -60); x.closePath(); x.fillStyle = WH; x.fill();
    x.beginPath(); x.moveTo(ex - 13, -66); x.lineTo(ex + s * 4, -100); x.lineTo(ex + 13, -66); x.closePath(); x.fillStyle = BK; x.fill(); });
  ell(44, -40, 62, 54);
  [30, 44, 58].forEach((a, i) => { x.beginPath(); x.moveTo(a, -92 + (i === 1 ? -2 : 2)); x.lineTo(a, -76); line(5, BK); });
  eye(22, -44, 11, t); eye(66, -44, 11, t, .4);
  x.beginPath(); x.moveTo(38, -24); x.lineTo(50, -24); x.lineTo(44, -16); x.closePath(); x.fillStyle = BK; x.fill();
  wmouth(44, -14, 7, 4); cheek(10, -22); cheek(80, -22);
  [-1, 1].forEach(s => [-6, 6].forEach(dy => { x.beginPath(); x.moveTo(44 + s * 66, -22 + dy); x.lineTo(44 + s * 96, -26 + dy * 2.2); line(3.5); }));
}
function hamster(t) {
  // hamster running inside a turning wheel on a stand
  const rot = TAU * t * 40 / P, run = TAU * t * 120 / P, R = 130;
  x.beginPath(); x.moveTo(0, -10); x.lineTo(-90, 150); x.moveTo(0, -10); x.lineTo(90, 150); line(10);
  x.beginPath(); x.moveTo(-120, 150); x.lineTo(120, 150); line(12);
  x.save(); x.translate(0, -10); x.rotate(rot);
  for (let i = 0; i < 8; i++) { x.save(); x.rotate(i * TAU / 8); x.beginPath(); x.moveTo(0, 0); x.lineTo(R, 0); line(4); x.restore(); }
  for (let i = 0; i < 24; i++) { const a = i * TAU / 24; dot(Math.cos(a) * (R - 6), Math.sin(a) * (R - 6), 4.5); }
  x.restore();
  x.beginPath(); x.arc(0, -10, R, 0, 7); line(10); x.beginPath(); x.arc(0, -10, R + 12, 0, 7); line(5);
  dot(0, -10, 14); dot(0, -10, 6, BK);
  // hamster (black outline separates it from the spokes)
  const hop = Math.abs(Math.sin(run)) * 4;
  x.save(); x.translate(0, -hop);
  [[-30, 0], [26, Math.PI]].forEach(([fx, o]) => { const s = Math.sin(run + o) * 10; ell(fx + s, 106, 12, 7); outlineEll(fx + s, 106, 12, 7, 3); });
  ell(12, 68, 62, 40, BK); ell(12, 68, 56, 36);
  ell(30, 56, 26, 16, BK);
  dot(-38, 56, 36, BK); dot(-38, 56, 32);
  dot(-28, 24, 13, BK); dot(-28, 24, 10); dot(-28, 24, 5, BK);
  dot(66, 72, 9, BK); dot(66, 72, 6);
  eye(-50, 50, 8, t); dot(-68, 60, 5, BK); smile(-56, 64, 8, 4); cheek(-30, 66, 9);
  x.restore();
}
function goldfish(t) {
  // goldfish swimming to and fro in a round bowl; bubbles rise, a little water plant sways, pebbles on the bottom
  const R = 132, cy = 14, fx = per(t, 20) * 46, fy = 30 + per(t, 40) * 10, face = -Math.max(-1, Math.min(1, perc(t, 20) * 4));
  // bubbles (inside the bowl, below the water line)
  for (let i = 0; i < 4; i++) { const k = ((t * 60 / P) + i / 4) % 1, bx = -20 + hash(i) * 40 + Math.sin(k * 9 + i) * 6, by = 60 - k * 130;
    x.save(); x.globalAlpha *= Math.min(1, (1 - k) * 3); x.beginPath(); x.arc(bx, by, 5 + i * 1.5, 0, 7); line(3); x.restore(); }
  // plant
  [[-70, 0], [-56, 1.4]].forEach(([px, o]) => { x.beginPath(); x.moveTo(px, 128); for (let k = 1; k <= 6; k++) x.lineTo(px + Math.sin(k * 1.2 + o + per(t, 12)) * 8, 128 - k * 16); line(7); });
  // pebbles
  x.save(); x.beginPath(); x.arc(0, cy, R - 8, 0, 7); x.clip();
  for (let i = 0; i < 14; i++) ell(-110 + i * 17, 136 + (i % 2) * 6, 11, 7);
  x.restore();
  // water line
  x.beginPath(); for (let i = -98; i <= 98; i += 7) x.lineTo(i, -64 + Math.sin(i * .08 + TAU * t * 30 / P) * 3); line(4);
  // bowl
  x.beginPath(); x.arc(0, cy, R, -Math.PI / 3, Math.PI * 4 / 3); line(9);
  outlineEll(0, cy - R * Math.sin(Math.PI / 3), R * .5 + 4, 10, 8, 0, WH);
  // fish
  x.save(); x.translate(fx, fy); x.scale(face || .05, 1);
  const tw = per(t, 80) * .3;
  x.save(); x.translate(38, 0); x.rotate(tw); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(30, -34, 44, -26); x.quadraticCurveTo(30, 0, 44, 26); x.quadraticCurveTo(30, 34, 0, 0); x.fillStyle = WH; x.fill();
  [[-14], [0], [14]].forEach(([d]) => { x.beginPath(); x.moveTo(8, d * .4); x.lineTo(34, d * 1.3); line(3, BK); }); x.restore();
  x.beginPath(); x.moveTo(-6, -26); x.quadraticCurveTo(10, -50, 28, -24); x.closePath(); x.fillStyle = WH; x.fill();
  ell(0, 0, 46, 30);
  [[6, -6], [20, 6], [6, 12]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 9, -Math.PI / 2, Math.PI / 2); line(3, BK); });
  eye(-22, -6, 8, t); smile(-30, 6, 7, 3.5);
  x.restore();
}
function parrot(t) {
  // parrot sitting on a swing perch, bobbing its head; crest feathers, striped tail hanging down
  const sw = per(t, 20) * .07, bob = Math.max(0, per(t, 48)) * 8, nod = per(t, 48) * .08;
  x.save(); x.translate(0, -170); x.rotate(sw); x.translate(0, 170);
  dot(0, -172, 10); x.beginPath(); x.arc(0, -172, 10, 0, 7); line(4, BK);
  x.beginPath(); x.moveTo(0, -164); x.lineTo(-104, 92); x.moveTo(0, -164); x.lineTo(104, 92); line(5);
  // tail
  x.beginPath(); x.moveTo(10, 60); x.lineTo(46, 170); x.lineTo(74, 162); x.lineTo(40, 56); x.closePath(); x.fillStyle = WH; x.fill();
  [90, 116, 142].forEach(ty => { x.beginPath(); x.moveTo(18 + (ty - 60) * .33, ty); x.lineTo(46 + (ty - 60) * .3, ty - 6); line(5, BK); });
  x.fillStyle = WH; x.beginPath(); x.roundRect(-118, 86, 236, 16, 8); x.fill();
  x.save(); x.translate(0, -bob);
  ell(10, 10, 52, 76);
  // wing with feather rows
  x.save(); x.translate(26, 10); x.rotate(-.15); ell(0, 0, 32, 64); outlineEll(0, 0, 32, 64, 5);
  [-20, 0, 20].forEach(d => { x.beginPath(); x.arc(0, d + 12, 20, .5, Math.PI - .5); line(4, BK); }); x.restore();
  // head
  x.save(); x.translate(-6, -64); x.rotate(nod);
  [[-10, -34, -.5], [4, -40, -.1], [18, -36, .3]].forEach(([a, b, r]) => { x.save(); x.translate(a, b); x.rotate(r); ell(0, -14, 8, 22); x.restore(); });
  dot(0, 0, 42);
  x.beginPath(); x.moveTo(-34, -10); x.quadraticCurveTo(-74, -10, -66, 26); x.quadraticCurveTo(-58, 10, -40, 14); x.closePath(); x.fillStyle = WH; x.fill(); line(4, BK);
  x.beginPath(); x.moveTo(-40, 14); x.quadraticCurveTo(-48, 22, -36, 26); line(4, BK);
  dot(-12, -10, 17, BK); dot(-12, -10, 12); eye(-12, -10, 8, t);
  cheek(10, 12, 8);
  x.restore();
  x.restore();
  [-10, 22].forEach(fx => { x.beginPath(); x.moveTo(fx - 8, 80 - bob); x.lineTo(fx - 10, 94); x.moveTo(fx + 4, 80 - bob); x.lineTo(fx + 6, 94); line(5, BK); });
  x.restore();
}
function bunny(t) {
  // bunny hopping along, long ears that twitch now and then, wiggling nose, fluffy tail
  const ph = (t * 60 / P) % 1, hop = Math.max(0, Math.sin(ph * TAU)) * 22, tw = (t % 5) < .5 ? Math.sin((t % 5) / .5 * Math.PI * 2) * .18 : 0;
  ell(10, 108, 90 - hop, 7);
  x.save(); x.translate(0, -hop);
  dot(110, 34, 22); x.beginPath(); x.arc(110, 34, 22, -.6, .9); line(4, BK);
  ell(34, 50, 82, 56);
  ell(76, 70, 44, 36); x.beginPath(); x.arc(76, 66, 34, Math.PI * 1.05, Math.PI * 1.8); line(5, BK);
  ell(58, 102, 40, 10);
  x.fillStyle = WH; x.beginPath(); x.roundRect(-30, 60, 22, 46, 10); x.fill(); ell(-24, 104, 15, 8);
  // ears
  [[-34, -.25 + tw, 0], [-12, .1, 1]].forEach(([ex, r, j]) => { x.save(); x.translate(ex, -40); x.rotate(r); ell(0, -50, 20, 56); if (j) outlineEll(0, -50, 20, 56, 5); ell(0, -46, 9, 40, BK); x.restore(); });
  dot(-44, -6, 46);
  eye(-60, -16, 10, t); cheek(-40, 10, 9);
  const nw = per(t, 120) * 2;
  heart(-86, -2 + nw * .5, .55, BK);
  x.beginPath(); x.moveTo(-86, 4); x.lineTo(-86, 12); line(3, BK); wmouth(-86, 12, 6, 3);
  [-6, 6].forEach(dy => { x.beginPath(); x.moveTo(-94, 2 + dy); x.lineTo(-124, -2 + dy * 2.2); line(3); });
  x.restore();
}
function turtle(t) {
  // turtle walking slowly; dome shell with a dotted pattern, head bobbing, legs stepping in turn
  const st = TAU * t * 40 / P, bob = per(t, 40) * 4;
  ell(0, 108, 130, 6);
  [[-70, 0], [-30, Math.PI], [40, 0], [80, Math.PI]].forEach(([lx, o]) => { const s = Math.sin(st + o) * 10, up = Math.max(0, Math.cos(st + o)) * 6;
    x.fillStyle = WH; x.beginPath(); x.roundRect(lx + s - 15, 50, 30, 52 - up, 12); x.fill(); x.beginPath(); x.moveTo(lx + s - 6, 98 - up); x.lineTo(lx + s - 6, 104 - up); x.moveTo(lx + s + 6, 98 - up); x.lineTo(lx + s + 6, 104 - up); line(3, BK); });
  x.beginPath(); x.moveTo(114, 48); x.lineTo(140, 60); x.lineTo(112, 64); x.closePath(); x.fillStyle = WH; x.fill();
  // neck + head
  x.save(); x.translate(0, bob);
  x.beginPath(); x.moveTo(-100, 40); x.quadraticCurveTo(-130, 30, -132, 0); line(30);
  ell(-150, -8, 40, 32);
  eye(-160, -18, 9, t); smile(-164, -2, 10, 4); cheek(-138, 4);
  x.restore();
  // shell
  x.beginPath(); x.moveTo(-120, 52); x.bezierCurveTo(-120, -80, 120, -80, 120, 52); x.closePath(); x.fillStyle = WH; x.fill();
  x.fillStyle = BK; x.fillRect(-124, 40, 248, 8);
  x.fillStyle = WH; x.beginPath(); x.roundRect(-128, 46, 256, 14, 7); x.fill();
  dot(0, -6, 26, BK); dot(0, -6, 18); dot(0, -6, 8, BK);
  [[-62, 14], [62, 14], [-36, -36], [36, -36]].forEach(([a, b]) => { dot(a, b, 15, BK); dot(a, b, 9); });
  [[-90, 36], [-30, 30], [30, 30], [90, 36]].forEach(([a, b]) => dot(a, b, 6, BK));
}
function ball(t) {
  // striped ball bouncing with squash and stretch, turning as it goes, little happy face
  const ph = (t * 48 / P) % 1, hgt = Math.sin(ph * Math.PI), y = 40 - hgt * 110;
  const sq = hgt < .12 ? 1 - (.12 - hgt) * 1.6 : 1 + (hgt - .5) * .06;
  ell(0, 140, 90 - hgt * 40, 9);
  x.save(); x.translate(0, y + 90); x.scale(1 / sq, sq); x.translate(0, -90);
  dot(0, 0, 90);
  x.save(); x.beginPath(); x.arc(0, 0, 90, 0, 7); x.clip(); x.rotate(per(t, 24) * .4);
  // two curved black bands and a dotted belt that rock as the ball turns
  [-1, 1].forEach(sg => { x.beginPath(); x.moveTo(-100, sg * 58); x.quadraticCurveTo(0, sg * 44, 100, sg * 58); line(20, BK); });
  [-72, 72].forEach(a => dot(a, 0, 9, BK));
  x.restore();
  dot(0, 0, 46, BK); dot(0, 0, 40);
  eye(-15, -8, 8, t); eye(15, -8, 8, t, .4); smile(0, 6, 12, 5);
  x.restore();
}
function bone(t) {
  // a big happy dog bone, tilting gently, with twinkling sparkles and a little heart
  const tl = per(t, 24) * .1;
  for (let i = 0; i < 4; i++) { const tw = (per(t + i * 7, 30) + 1) / 2; const [sx, sy] = [[-150, -80], [140, -90], [-120, 90], [150, 70]][i]; star4(sx, sy, 8 + tw * 12); }
  x.save(); x.rotate(-.12 + tl);
  [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([a, b]) => dot(a * 112, b * 30, 36));
  x.fillStyle = WH; x.fillRect(-112, -32, 224, 64);
  x.beginPath(); x.moveTo(-104, -6); x.quadraticCurveTo(-120, 0, -104, 6); line(4, BK);
  x.beginPath(); x.moveTo(104, -6); x.quadraticCurveTo(120, 0, 104, 6); line(4, BK);
  eye(-22, -8, 10, t); eye(22, -8, 10, t, .4); smile(0, 6, 14, 5); cheek(-44, 10); cheek(44, 10);
  x.restore();
  const hk = (per(t, 20) + 1) / 2; heart(0, -98 - hk * 10, 1.4 + hk * .3);
}
function mouse(t) {
  // a little mouse peeking out of its hole in a brick wall, sniffing at a wedge of cheese
  const k = (per(t, 20) + 1) / 2, out = k * k * (3 - 2 * k), sn = per(t, 120) * 2;
  // bricks around the hole
  [[-40, -150, 70], [40, -150, 70], [-112, -112, 60], [112, -112, 60], [-130, -60, 50], [130, -60, 50], [-130, -8, 50], [130, -8, 50]].forEach(([a, b, w]) => {
    x.fillStyle = WH; x.beginPath(); x.roundRect(a - w / 2, b - 15, w, 30, 6); x.fill(); });
  // floor
  x.fillStyle = WH; x.fillRect(-170, 106, 340, 10);
  // the hole: white arch frame
  x.beginPath(); x.moveTo(-84, 106); x.lineTo(-84, 6); x.arc(0, 6, 84, Math.PI, 0); x.lineTo(84, 106); line(14);
  // mouse in the hole
  x.save(); x.beginPath(); x.moveTo(-200, 104); x.lineTo(-200, -200); x.lineTo(77, -200); x.lineTo(77, 104); x.closePath(); x.clip();
  x.save(); x.translate(20 - out * 60, 40);
  x.beginPath(); x.moveTo(40, 40); x.bezierCurveTo(90, 50, 60, -10, 96, -20); line(5);
  ell(30, 30, 44, 34);
  [[-10, -46], [36, -42]].forEach(([a, b]) => { dot(a, b, 24); dot(a, b, 13, BK); });
  ell(-6, -6, 44, 38);
  x.beginPath(); x.moveTo(-40, -22); x.quadraticCurveTo(-74, 0 + sn, -48, 10); x.closePath(); x.fillStyle = WH; x.fill();
  dot(-70, -2 + sn, 7, BK);
  eye(-26, -16, 8, t); eye(4, -16, 8, t, .4); smile(-24, 4, 8, 4);
  [-5, 5].forEach(dy => { x.beginPath(); x.moveTo(-76, -2 + dy + sn); x.lineTo(-104, -6 + dy * 2.4 + sn); line(3); });
  ell(-30, 34, 12, 8); ell(4, 36, 12, 8); outlineEll(-30, 34, 12, 8, 3); outlineEll(4, 36, 12, 8, 3);
  x.restore(); x.restore();
  // cheese wedge on the floor
  x.save(); x.translate(-130, 106);
  x.beginPath(); x.moveTo(-38, 0); x.lineTo(-38, -44); x.lineTo(40, -18); x.lineTo(40, 0); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-38, -44); x.lineTo(40, -18); line(4, BK);
  [[-20, -18, 8], [6, -10, 6], [22, -24, 4], [-28, -36, 4]].forEach(([a, b, r]) => dot(a, b, r, BK));
  x.restore();
}

function bg(t) {
  // window with twinkling stars and scalloped curtains (top left)
  x.save(); x.translate(106, 122); x.scale(.7, .7);
  x.save(); x.beginPath(); x.rect(-66, -72, 132, 144); x.clip();
  for (let i = 0; i < 9; i++) { const tw = (per(t + i * 11, 20 + i * 4) + 1) / 2; star4(-56 + hash(i + 3) * 112, -62 + hash(i + 9) * 124, 3 + tw * 5); }
  x.restore();
  x.beginPath(); x.rect(-70, -76, 140, 152); line(8); x.beginPath(); x.moveTo(0, -76); x.lineTo(0, 76); x.moveTo(-70, 0); x.lineTo(70, 0); line(6);
  x.fillStyle = WH; x.fillRect(-84, 74, 168, 10);
  [-1, 1].forEach(s => { x.beginPath(); x.moveTo(s * 72, -92); x.lineTo(s * 96, -92); x.quadraticCurveTo(s * 86, 0, s * 98, 70); x.lineTo(s * 72, 70); x.quadraticCurveTo(s * 64, 0, s * 72, -92); x.fillStyle = WH; x.fill();
    x.beginPath(); x.moveTo(s * 84, -84); x.quadraticCurveTo(s * 76, 0, s * 86, 64); line(3, BK); });
  x.fillStyle = WH; x.fillRect(-104, -100, 208, 10);
  x.restore();
  // little hearts floating up on the right
  for (let i = 0; i < 5; i++) { const k = ((t * 12 / P) + i / 5) % 1, hx = 880 + Math.sin(k * TAU * 2 + i) * 16 + (i % 2) * 20;
    x.save(); x.globalAlpha = .7 * Math.sin(Math.PI * k); heart(hx, 430 - k * 330, .9 + (i % 3) * .2); x.restore(); }
  // zig-zag rug at the bottom
  x.fillStyle = WH; x.fillRect(0, 496, 960, 6); x.fillRect(0, 530, 960, 4);
  const off = (t * 64 / P) % 1 * 32;
  x.beginPath(); for (let i = -32; i <= 1000; i += 16) x.lineTo(i - off + 32, 516 + ((i / 16) % 2 ? -8 : 8)); line(4);
  for (let i = 0; i < 31; i++) dot(i * 32 + 16 - off + 32 - 32, 516, 3);
}
// outro: puppy and kitten asleep together in a woven basket under a crescent moon
function sleepyEnd(t) {
  x.save(); x.translate(190, -150); dot(0, 0, 36); dot(14, -8, 32, BK); x.restore();
  const br = per(t, 8) * 2;
  // kitten ears + head (left), puppy head (right), behind the basket rim
  x.save(); x.translate(-58, -4 + br);
  [[-30, -1], [30, 1]].forEach(([ex, s]) => { x.beginPath(); x.moveTo(ex - 20, -30); x.lineTo(ex + s * 4, -76); x.lineTo(ex + 20, -30); x.closePath(); x.fillStyle = WH; x.fill();
    x.beginPath(); x.moveTo(ex - 10, -36); x.lineTo(ex + s * 3, -62); x.lineTo(ex + 10, -36); x.closePath(); x.fillStyle = BK; x.fill(); });
  ell(0, -10, 54, 44);
  sleepyEye(-20, -14, 9); sleepyEye(20, -14, 9);
  x.beginPath(); x.moveTo(-6, 4); x.lineTo(6, 4); x.lineTo(0, 10); x.closePath(); x.fillStyle = BK; x.fill();
  x.restore();
  x.save(); x.translate(62, -2 - br);
  [[-50, -1], [46, 1]].forEach(([ex, s]) => { x.save(); x.translate(ex, -30); x.rotate(-s * .3); ell(0, 24, 18, 36); outlineEll(0, 24, 18, 36, 4); ell(0, 30, 8, 22, BK); x.restore(); });
  ell(-2, -8, 56, 48); outlineEll(-2, -8, 56, 48, 5);
  sleepyEye(-18, -12, 9); sleepyEye(16, -12, 9);
  ell(0, 12, 12, 8, BK);
  x.restore();
  // basket
  x.beginPath(); x.moveTo(-170, 30); x.quadraticCurveTo(-160, 140, 0, 140); x.quadraticCurveTo(160, 140, 170, 30); x.closePath(); x.fillStyle = WH; x.fill();
  x.save(); x.clip();
  for (let r = 0; r < 4; r++) for (let i = -8; i <= 8; i++) { const cx = i * 26 + (r % 2) * 13, cy = 50 + r * 24; x.beginPath(); x.ellipse(cx, cy, 10, 6, (r % 2 ? .5 : -.5), 0, 7); line(4, BK); }
  x.restore();
  x.fillStyle = WH; x.beginPath(); x.roundRect(-182, 18, 364, 24, 12); x.fill();
  x.beginPath(); x.moveTo(-176, 30); x.lineTo(176, 30); line(3, BK);
  // a paw resting on the rim
  ell(-6, 20, 22, 12); outlineEll(-6, 20, 22, 12, 3);
  for (let i = 0; i < 3; i++) { const k = (t * .25 + i / 3) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k);
    x.font = C.FONT(30 + i * 8); x.fillStyle = WH; x.textAlign = 'center'; x.fillText('z', -150 - k * 30, -50 - k * 100); x.restore(); }
}

L.scene({
  seed: 151,
  figs: [[puppy, .85, 'sway'], [kitten, .85, 'sway'], [hamster, .8, 'sway'], [goldfish, .85, 'sway'], [parrot, .78, 'sway'],
         [bunny, .85, 'floor'], [turtle, .8, 'floor'], [ball, .8, 'sway'], [bone, .85, 'float'], [mouse, .85, 'sway']],
  bg, end: sleepyEnd, scale: 1.4,
});
