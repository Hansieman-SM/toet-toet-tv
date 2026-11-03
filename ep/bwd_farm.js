// Daily B&W sensory #2: Sleepy Farm – white farm friends on black, a little fence with grass, drifting clouds, twinkling stars.
// All figures are new drawings for this video (own design). Figures look LEFT (head at negative x).
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;

const legs = (pts, lw = 22) => pts.forEach(([a, b, c, d]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); line(lw); });

function cow(t) {
  const sw = per(t, 20) * .25;
  legs([[-75, 40, -80, 115], [-35, 45, -32, 118], [55, 45, 58, 118], [90, 40, 95, 112]]);
  [[-80, 118], [-32, 120], [58, 120], [95, 114]].forEach(([a, b]) => ell(a, b, 14, 8, BK));
  x.save(); x.translate(125, -20); x.rotate(.5 + sw); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(25, 40, 20, 85); line(7); dot(20, 92, 12); x.restore();
  ell(10, 0, 130, 70);
  ell(40, -15, 32, 24, BK, .3); ell(-30, 25, 24, 18, BK, -.2); ell(90, 25, 20, 15, BK);
  ell(15, 68, 22, 12); // udder
  x.save(); x.translate(-125, -40); x.rotate(per(t, 12) * .06);
  [[-1, -1], [1, 1]].forEach(([s]) => { x.save(); x.rotate(s * .5); ell(s * 60, -40, 28, 12, WH, s * .3); x.restore(); });
  x.beginPath(); x.moveTo(-28, -55); x.quadraticCurveTo(-40, -85, -25, -95); line(9); x.beginPath(); x.moveTo(28, -55); x.quadraticCurveTo(40, -85, 25, -95); line(9);
  ell(0, -10, 52, 58);
  ell(0, 32, 44, 28, BK); ell(0, 32, 38, 22); dot(-14, 32, 6, BK); dot(14, 32, 6, BK);
  eye(-20, -18, 11, t); eye(20, -18, 11, t, .3);
  x.beginPath(); x.moveTo(-10, 48); x.quadraticCurveTo(0, 54, 10, 48); line(4, BK);
  x.restore();
}
function pig(t) {
  const tail = per(t, 30);
  legs([[-60, 40, -62, 100], [-25, 45, -24, 104], [45, 45, 46, 104], [75, 40, 78, 98]], 26);
  x.save(); x.translate(130, -10); x.beginPath(); x.moveTo(0, 0);
  for (let a = 0; a < 9; a += .3) x.lineTo(14 + Math.cos(a + tail) * (6 + a * 1.8), -Math.sin(a + tail) * (6 + a * 1.8) - a * 1.5); line(6); x.restore();
  ell(5, 0, 130, 82);
  ell(-110, -50, 30, 22, WH, -.8); ell(-60, -78, 26, 22, WH, -.3);   // ears
  x.beginPath(); x.moveTo(-104, -64); x.lineTo(-92, -40); line(4, BK);
  ell(-140, 10, 34, 28); ell(-140, 10, 24, 19, BK); ell(-140, 10, 20, 15); dot(-148, 10, 5, BK); dot(-132, 10, 5, BK);
  eye(-100, -18, 11, t); eye(-70, -22, 10, t, .4); smile(-95, 30, 16, 5);
  [[20, -30], [60, 10], [-10, 30]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 12, Math.PI * 1.1, Math.PI * 1.9); line(4, BK); });
}
function horse(t) {
  const nod = per(t, 16) * .05;
  legs([[-65, 30, -70, 130], [-30, 35, -28, 134], [60, 35, 64, 134], [95, 25, 100, 128]], 20);
  [[-70, 134], [-28, 138], [64, 138], [100, 132]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a - 12, b); x.lineTo(a + 12, b); line(8, BK); });
  x.save(); x.translate(125, -15); x.rotate(per(t, 24) * .12);
  for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(30 + i * 4, 30, 18 + i * 7, 95 + i * 3); line(7); } x.restore();
  ell(15, -5, 125, 58);
  x.save(); x.translate(-90, -30); x.rotate(-.7 + nod);
  x.beginPath(); x.moveTo(-30, 10); x.lineTo(-30, -110); x.quadraticCurveTo(0, -135, 30, -110); x.lineTo(40, 10); x.closePath(); x.fillStyle = WH; x.fill();
  x.restore();
  x.save(); x.translate(-150, -120); x.rotate(nod);
  ell(0, 0, 62, 34, WH, -.25);
  ell(-48, 14, 26, 22);
  dot(-58, 12, 5, BK);
  x.beginPath(); x.moveTo(25, -28); x.lineTo(32, -62); x.lineTo(45, -26); x.closePath(); x.fillStyle = WH; x.fill();
  eye(-5, -8, 10, t);
  x.beginPath(); x.moveTo(-62, 30); x.quadraticCurveTo(-50, 36, -38, 30); line(4, BK);
  x.restore();
  for (let i = 0; i < 6; i++) { const k = i / 5; x.beginPath(); x.moveTo(-95 + k * 40, -150 + k * 85); x.lineTo(-80 + k * 50, -150 + k * 85 - 10); line(9, BK); }
}
function hen(t) {
  const peck = Math.max(0, per(t, 20)) * .15;
  legs([[-10, 80, -15, 125], [25, 80, 28, 125]], 8);
  [[-15, 125], [28, 125]].forEach(([a, b]) => { for (const d of [-14, 0, 14]) { x.beginPath(); x.moveTo(a, b); x.lineTo(a + d, b + 12); line(5); } });
  x.beginPath(); x.moveTo(60, 10); x.quadraticCurveTo(140, -80, 120, -100); x.quadraticCurveTo(150, -40, 110, 30); x.closePath(); x.fillStyle = WH; x.fill();
  ell(10, 20, 90, 70);
  x.save(); x.translate(-55, -55); x.rotate(-peck);
  ell(0, 0, 42, 44);
  [[-18, -48, 12], [-2, -54, 13], [14, -48, 12]].forEach(([a, b, r]) => dot(a, b, r));
  x.beginPath(); x.moveTo(-40, 0); x.lineTo(-70, 10); x.lineTo(-40, 18); x.closePath(); x.fillStyle = WH; x.fill(); x.strokeStyle = BK; x.lineWidth = 3; x.stroke();
  ell(-34, 30, 9, 14);
  eye(-14, -8, 9, t);
  x.restore();
  x.beginPath(); x.moveTo(-30, 25); x.quadraticCurveTo(20, 60, 60, 20); line(6, BK);
  x.beginPath(); x.moveTo(-20, 45); x.quadraticCurveTo(20, 75, 55, 45); line(6, BK);
}
function chick(t) {
  const hop = Math.abs(per(t, 30)) * 14;
  x.save(); x.translate(0, -hop);
  dot(0, 30, 95);
  x.save(); x.translate(70, 30); x.rotate(per(t, 40) * .3); ell(10, 0, 40, 20, WH, -.4); x.restore();
  x.save(); x.translate(30, 40); x.rotate(-.5 + per(t, 30) * .15);   // little wing
  x.beginPath(); x.moveTo(-30, -10); x.quadraticCurveTo(20, -30, 40, 10); x.quadraticCurveTo(10, 30, -30, -10); line(6, BK); x.restore();
  [[-10, -68, 10], [0, -78, 9], [12, -70, 8]].forEach(([a, b, r]) => dot(a, b, r));
  x.beginPath(); x.moveTo(-60, 10); x.lineTo(-100, 20); x.lineTo(-60, 32); x.closePath(); x.fillStyle = BK; x.fill();
  eye(-35, -15, 13, t); eye(10, -18, 12, t, .3);
  x.restore();
  legs([[-15, 122 - hop * .2, -18, 140], [25, 122 - hop * .2, 26, 140]], 7);
}
function goat(t) {
  const chew = per(t, 40);
  legs([[-60, 30, -62, 115], [-25, 35, -24, 118], [50, 35, 52, 118], [80, 30, 84, 112]], 18);
  x.beginPath(); x.moveTo(110, -20); x.lineTo(140, -50); x.lineTo(128, -10); x.closePath(); x.fillStyle = WH; x.fill();
  ell(10, 0, 110, 55);
  for (let i = 0; i < 4; i++) { x.beginPath(); x.arc(-40 + i * 35, 10, 14, 0, Math.PI); line(4, BK); }
  x.save(); x.translate(-110, -55); x.rotate(per(t, 12) * .05);
  x.beginPath(); x.moveTo(-5, -40); x.quadraticCurveTo(20, -100, 60, -90); line(12); x.beginPath(); x.moveTo(15, -35); x.quadraticCurveTo(45, -85, 80, -70); line(12);
  ell(0, 0, 42, 50, WH, -.3);
  ell(-38, -30, 30, 11, WH, .5); ell(38, -30, 26, 10, WH, -.6);
  ell(-20, 30, 28, 22);
  x.beginPath(); x.moveTo(-18, 50); x.lineTo(-10 + chew * 2, 95); x.lineTo(5, 50); x.closePath(); x.fillStyle = WH; x.fill();
  eye(-10, -8, 10, t); eye(18, -10, 9, t, .2);
  dot(-30, 28, 4, BK); x.beginPath(); x.moveTo(-34, 40 + chew * 2); x.quadraticCurveTo(-20, 44, -8, 40); line(4, BK);
  x.restore();
}
function barn(t) {
  x.beginPath(); x.moveTo(-140, 130); x.lineTo(-140, -20); x.lineTo(-170, -20); x.lineTo(-80, -110); x.lineTo(80, -110); x.lineTo(170, -20); x.lineTo(140, -20); x.lineTo(140, 130); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-60, 130); x.lineTo(-60, 20); x.lineTo(60, 20); x.lineTo(60, 130); x.closePath(); x.fillStyle = BK; x.fill();
  x.beginPath(); x.moveTo(-50, 30); x.lineTo(50, 120); x.moveTo(50, 30); x.lineTo(-50, 120); x.moveTo(0, 20); x.lineTo(0, 130); line(8);
  x.beginPath(); x.moveTo(-50, 30); x.lineTo(50, 30); x.lineTo(50, 120); x.lineTo(-50, 120); x.closePath(); line(8);
  // round window with a sleepy face (the barn is resting too)
  dot(0, -55, 30, BK); x.beginPath(); x.arc(-11, -60, 6, .2, Math.PI - .2); line(4); x.beginPath(); x.arc(11, -60, 6, .2, Math.PI - .2); line(4);
  x.beginPath(); x.arc(0, -46, 7, .3, Math.PI - .3); line(4);
  for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(-125, -5 + i * 26); x.lineTo(-75, -5 + i * 26); x.moveTo(75, -5 + i * 26); x.lineTo(125, -5 + i * 26); line(5, BK); }
  // weather vane rooster turning slowly
  x.save(); x.translate(0, -110); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -40); line(5); x.translate(0, -48); x.scale(perc(t, 6), 1);
  ell(0, 0, 18, 10); dot(-14, -8, 6); x.beginPath(); x.moveTo(12, 0); x.lineTo(24, -12); x.lineTo(22, 4); x.closePath(); x.fillStyle = WH; x.fill(); x.restore();
}
function tractor(t) {
  const rot = TAU * 10 * t / L.P;
  x.beginPath(); x.moveTo(-150, 30); x.lineTo(-150, -25); x.lineTo(-20, -35); x.lineTo(-10, 30); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-20, 30); x.lineTo(-20, -120); x.lineTo(90, -120); x.lineTo(100, 30); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(-5, -105); x.lineTo(75, -105); x.lineTo(80, -40); x.lineTo(-5, -40); x.closePath(); x.fillStyle = BK; x.fill();
  // headlight eyes on the bonnet
  dot(-140, -2, 15, BK); eye(-140, -2, 9, t); smile(-110, 5, 14, 5);
  x.beginPath(); x.moveTo(-90, -30); x.lineTo(-90, -78); line(10);   // chimney-free: a little antenna flag
  x.beginPath(); x.moveTo(-90, -78); x.lineTo(-62, -70); x.lineTo(-90, -60); x.closePath(); x.fillStyle = WH; x.fill();
  [[-110, 50, 38], [60, 30, 72]].forEach(([wx, wy, r]) => { dot(wx, wy, r); dot(wx, wy, r * .55, BK); dot(wx, wy, r * .3);
    x.save(); x.translate(wx, wy); x.rotate(-rot * (72 / r)); for (let i = 0; i < 4; i++) { x.rotate(TAU / 4); x.beginPath(); x.moveTo(0, r * .32); x.lineTo(0, r * .5); line(5, BK); } x.restore();
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU - rot * (72 / r); x.beginPath(); x.moveTo(wx + Math.cos(a) * r * .85, wy + Math.sin(a) * r * .85); x.lineTo(wx + Math.cos(a) * r, wy + Math.sin(a) * r); line(5, BK); } });
}
function duck(t) {
  const bob = per(t, 24) * 6;
  x.save(); x.translate(0, bob);
  x.beginPath(); x.moveTo(-60, 0); x.quadraticCurveTo(-70, 80, 30, 80); x.quadraticCurveTo(130, 80, 150, -10); x.quadraticCurveTo(110, 20, 60, 0); x.closePath(); x.fillStyle = WH; x.fill();
  ell(-75, -60, 50, 48);
  x.beginPath(); x.moveTo(-60, -20); x.quadraticCurveTo(-60, 10, -40, 10); x.lineTo(-20, 10); x.lineTo(-40, -25); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(-118, -60); x.quadraticCurveTo(-165, -58, -160, -42); x.quadraticCurveTo(-140, -35, -112, -44); x.closePath(); x.fill(); x.strokeStyle = BK; x.lineWidth = 3; x.stroke();
  eye(-85, -72, 11, t);
  x.beginPath(); x.moveTo(0, 25); x.quadraticCurveTo(50, 60, 100, 15); line(6, BK);
  x.restore();
  // little water ripples under the duck
  for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(-90 + i * 70, 105); x.quadraticCurveTo(-60 + i * 70, 95 + per(t, 30) * 4, -30 + i * 70, 105); line(5); }
}
function cat(t) {
  const tail = per(t, 20) * .4;
  x.save(); x.translate(80, 70); x.rotate(tail); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(90, 10, 80, -60); x.quadraticCurveTo(75, -95, 100, -100); line(16); x.restore();
  ell(20, 50, 95, 55);           // body curled, sitting
  ell(-30, 92, 30, 13); ell(40, 95, 30, 13);
  x.beginPath(); x.moveTo(-75, -65); x.lineTo(-90, -130); x.lineTo(-40, -90); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(15, -90); x.lineTo(40, -135); x.lineTo(50, -70); x.closePath(); x.fill();
  ell(-20, -45, 72, 60);
  // sleepy cat: eyes closed, purring
  x.beginPath(); x.arc(-45, -50, 10, .2, Math.PI - .2); line(5, BK); x.beginPath(); x.arc(5, -50, 10, .2, Math.PI - .2); line(5, BK);
  x.beginPath(); x.moveTo(-26, -30); x.lineTo(-14, -30); x.lineTo(-20, -22); x.closePath(); x.fillStyle = BK; x.fill();
  x.beginPath(); x.moveTo(-20, -22); x.quadraticCurveTo(-28, -12, -36, -16); x.moveTo(-20, -22); x.quadraticCurveTo(-12, -12, -4, -16); line(4, BK);
  [[-1, -10], [-1, -2], [1, -10], [1, -2]].forEach(([s, dy]) => { x.beginPath(); x.moveTo(-20 + s * 30, -28 + dy); x.lineTo(-20 + s * 70, -34 + dy * 2); line(3, BK); });
  [[20, 30], [60, 50], [10, 70]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a - 18, b); x.quadraticCurveTo(a, b - 10, a + 18, b); line(5, BK); });
  // floating zzz
  for (let i = 0; i < 3; i++) { const k = ((t * .25 + i / 3) % 1); x.save(); x.globalAlpha *= Math.sin(Math.PI * k); x.translate(40 + k * 60, -110 - k * 70); x.scale(.6 + k * .5, .6 + k * .5);
    x.beginPath(); x.moveTo(-12, -12); x.lineTo(12, -12); x.lineTo(-12, 12); x.lineTo(12, 12); line(6); x.restore(); }
}

function bg(t) {
  // twinkling stars (periodic)
  for (let i = 0; i < 34; i++) { const a = .35 + .4 * (.5 + .5 * per(t + hash(i) * 240, 6 + (i % 5))); x.globalAlpha = a;
    const sx = hash(i + 7) * 960, sy = 20 + hash(i + 40) * 170, r = 1.5 + hash(i + 3) * 2.5; dot(sx, sy, r);
    if (i % 6 === 0) { x.beginPath(); x.moveTo(sx - r * 3, sy); x.lineTo(sx + r * 3, sy); x.moveTo(sx, sy - r * 3); x.lineTo(sx, sy + r * 3); line(1.5); } }
  x.globalAlpha = 1;
  // two soft outline clouds drifting (1 and 2 passes per 240 s)
  [[1, 70, 0], [2, 130, .5]].forEach(([n, cy, ph]) => { const k = ((t * n / L.P + ph) % 1), cx = -200 + k * 1360;
    const puffs = [[0, 0, 28], [34, -14, 34], [70, 0, 26], [36, 8, 30]];
    puffs.forEach(([a, b, r]) => { x.beginPath(); x.arc(cx + a, cy + b, r, 0, 7); line(6); });
    puffs.forEach(([a, b, r]) => dot(cx + a, cy + b, r, BK)); });
  // ground: grass line + fence
  x.beginPath(); x.moveTo(0, 540); for (let i = 0; i <= 960; i += 16) x.lineTo(i, 498 + Math.sin(i * .01 + 1) * 6); x.lineTo(960, 540); x.fillStyle = WH; x.fill();
  for (let i = 0; i < 60; i++) { const gx = hash(i + 200) * 960, sw = per(t + i, 10) * 3; x.beginPath(); x.moveTo(gx, 503); x.lineTo(gx + sw + 4, 488); x.moveTo(gx + 6, 503); x.lineTo(gx + 2 + sw, 492); line(3); }
  for (let i = 0; i < 30; i++) dot(hash(i + 300) * 960, 515 + hash(i + 330) * 20, 2.5, BK);
  [[20, 1], [880, 1]].forEach(([fx]) => { for (let k = 0; k < 2; k++) { x.beginPath(); x.moveTo(fx + k * 46, 500); x.lineTo(fx + k * 46, 440); line(9); }
    x.beginPath(); x.moveTo(fx - 12, 455); x.lineTo(fx + 58, 455); x.moveTo(fx - 12, 478); x.lineTo(fx + 58, 478); line(7); });
}
function moon(t) {
  // crescent without a black cut-out disc (so the night sky stays visible inside the curve)
  x.save(); x.beginPath(); x.arc(0, 0, 105, 0, 7); x.clip();
  x.beginPath(); x.arc(0, 0, 105, 0, 7); x.arc(40, -28, 92, 0, 7); x.fillStyle = WH; x.fill('evenodd'); x.restore();
  x.beginPath(); x.arc(-70, -5, 8, .2, Math.PI - .2); line(5, BK); x.beginPath(); x.arc(-62, 30, 9, .3, Math.PI - .3); line(5, BK);
  for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + per(t, 2) * .2; dot(Math.cos(a) * 175, Math.sin(a) * 125, 4 + (i % 2) * 3); }
}

L.scene({
  seed: 47,
  figs: [[cow, .95, 'floor'], [pig, .9, 'floor'], [horse, .85, 'swimL'], [hen, .95, 'sway'], [chick, .9, 'float'],
         [goat, .95, 'swimR'], [barn, .95, 'sway'], [tractor, .9, 'floor'], [duck, .95, 'swimL'], [cat, .95, 'sway']],
  bg, end: moon,
});
