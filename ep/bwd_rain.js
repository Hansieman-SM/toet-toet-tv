// Daily B&W sensory #14: Rain and Clouds – white rainy-day friends on black: a fluffy cloud that drips little raindrops, a bouncing raindrop
// with a happy face (squash + stretch, tiny splash rings), a striped umbrella where drops bounce off the top, a rainbow arc between two little
// clouds, a puddle with ripple rings and a face, a pair of dotty rain boots stomping in turn, a duck in a rain hat paddling through ripples,
// a snail with a spiral shell and waving eye stalks, a sun with turning rays peeking out from behind a cloud, and a frog holding a big leaf
// as an umbrella.
// Background: gentle slanted rain streaks, soft cloud band at the top, ripple rings on a wet ground line.
// Outro: a little cloud asleep, hugging a tiny raindrop, under a crescent moon, z z z.
// All figures are new drawings for this video (own design, no existing characters). Figures look LEFT. Everything periodic in P = 240 s.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;
const P = L.P;

const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const puff = (cx, cy, s, col = WH) => { [[0, 0, 40], [44, -18, 46], [92, -4, 38], [46, 16, 36], [-36, 8, 30], [126, 10, 28]].forEach(([a, b, r]) => dot(cx + a * s, cy + b * s, r * s, col)); };
const drop = (cx, cy, s, col = WH) => { x.beginPath(); x.moveTo(cx, cy - 22 * s); x.bezierCurveTo(cx + 6 * s, cy - 10 * s, cx + 14 * s, cy - 2 * s, cx + 14 * s, cy + 8 * s);
  x.arc(cx, cy + 8 * s, 14 * s, 0, Math.PI); x.bezierCurveTo(cx - 14 * s, cy - 2 * s, cx - 6 * s, cy - 10 * s, cx, cy - 22 * s); x.fillStyle = col; x.fill(); };
const ring = (cx, cy, rx, ry, lw, a) => { x.save(); x.globalAlpha *= a; x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, 7); line(lw); x.restore(); };
const cheek = (cx, cy, r = 7) => { x.save(); x.globalAlpha *= .5; dot(cx, cy, r, BK); x.restore(); };

function cloud(t) {
  // big fluffy cloud with a happy face; little raindrops drip down from underneath and fade
  const bob = per(t, 12) * 6;
  for (let i = 0; i < 5; i++) { const k = ((t * 60 / P) + i / 5) % 1, dx = -100 + i * 52 + hash(i) * 12;
    x.save(); x.globalAlpha *= Math.min(1, (1 - k) * 2); drop(dx, 60 + k * 110, .7); x.restore(); }
  x.save(); x.translate(0, bob);
  puff(-70, -20, 1.25);
  eye(-30, -24, 10, t); eye(20, -24, 10, t, .4); smile(-5, -6, 16, 6);
  dot(-50, -6, 7, BK); dot(40, -6, 7, BK); dot(-50, -6, 4); dot(40, -6, 4);
  x.restore();
}
function raindrop(t) {
  // a big raindrop bouncing with squash and stretch; tiny splash rings when it lands
  const ph = ((t * 60 / P) % 1), hgt = Math.abs(Math.sin(ph * Math.PI)), land = 1 - hgt;
  const sy = 1 + .18 * (hgt - .3) - .22 * Math.max(0, land - .85) * 6, sx = 1 / Math.max(.75, sy);
  const y = 70 - hgt * 120;
  for (let i = 0; i < 2; i++) { const k = (ph + i * .5) % 1; ring(0, 140, 40 + k * 90, 8 + k * 16, 5, (1 - k) * .8); }
  ell(0, 142, 70 - hgt * 20, 8, WH);
  x.save(); x.translate(0, y); x.scale(sx, sy);
  drop(0, 0, 4.6);
  x.beginPath(); x.ellipse(-26, -10, 9, 22, -.3, 0, 7); x.fillStyle = BK; x.fill();
  eye(-16, 30, 10, t); eye(22, 30, 10, t, .4); smile(3, 46, 14, 6);
  cheek(-30, 50); cheek(36, 50);
  x.restore();
}
function umbrella(t) {
  // open umbrella with alternating black and white panels, curved handle; drops bounce off the top
  const sw = per(t, 10) * .08;
  for (let i = 0; i < 4; i++) { const k = ((t * 40 / P) + i / 4) % 1, px = -120 + i * 80, up = k < .5 ? -200 + k * 2 * 170 : -30 - Math.sin((k - .5) * 2 * Math.PI) * 40;
    const ox = k < .5 ? 0 : (k - .5) * 2 * (px < 0 ? -40 : 40); x.save(); x.globalAlpha *= Math.min(1, (1 - k) * 4); drop(px + ox, up - 20, .55); x.restore(); }
  x.save(); x.rotate(sw);
  x.beginPath(); x.moveTo(0, -40); x.lineTo(0, 130); x.arc(-24, 130, 24, 0, Math.PI); line(12);
  x.beginPath(); x.moveTo(-160, 10); x.quadraticCurveTo(-150, -120, 0, -130); x.quadraticCurveTo(150, -120, 160, 10);
  for (let i = 0; i < 5; i++) { const a = 160 - i * 64; x.quadraticCurveTo(a - 32, -14, a - 64, 10); }
  x.closePath(); x.fillStyle = WH; x.fill();
  x.save(); x.clip();
  [[-160, -96], [-32, 32], [96, 160]].forEach(([a, b]) => { x.beginPath(); x.moveTo(0, -130); x.lineTo(a, 20); x.lineTo(b, 20); x.closePath(); x.fillStyle = BK; x.fill(); });
  x.restore();
  x.beginPath(); x.moveTo(-160, 10); x.quadraticCurveTo(-150, -120, 0, -130); x.quadraticCurveTo(150, -120, 160, 10);
  for (let i = 0; i < 5; i++) { const a = 160 - i * 64; x.quadraticCurveTo(a - 32, -14, a - 64, 10); } line(6);
  dot(0, -134, 9);
  x.restore();
}
function rainbow(t) {
  // rainbow arc of white bands (with black gaps) between two little clouds with faces; sparkles twinkle along the arc
  const R = [150, 128, 106, 84];
  R.forEach((r, i) => { x.beginPath(); x.arc(0, 60, r, Math.PI, 0); line(i % 2 ? 10 : 16); });
  for (let i = 0; i < 5; i++) { const a = Math.PI + (i + .5) / 5 * Math.PI, tw = (per(t + i * 9, 24) + 1) / 2;
    const px = Math.cos(a) * 178, py = 60 + Math.sin(a) * 178; x.save(); x.translate(px, py); x.scale(.5 + tw * .5, .5 + tw * .5);
    x.beginPath(); for (let k = 0; k < 8; k++) { const rr = k % 2 ? 4 : 14, an = k * Math.PI / 4; k ? x.lineTo(Math.cos(an) * rr, Math.sin(an) * rr) : x.moveTo(rr, 0); } x.closePath(); x.fillStyle = WH; x.fill(); x.restore(); }
  [[-118, 1], [118, -1]].forEach(([cx], j) => { x.save(); x.translate(cx, 70 + per(t + j * 20, 12) * 4);
    [[-30, 0, 28], [0, -14, 34], [32, 0, 28], [0, 10, 30]].forEach(([a, b, r]) => dot(a, b, r));
    eye(-12, -6, 6, t, j * .5); eye(12, -6, 6, t, j * .5 + .3); smile(0, 6, 9, 4); x.restore(); });
}
function puddle(t) {
  // a puddle with a face; drops fall in and make ripple rings
  ell(0, 60, 170, 46);
  ell(0, 60, 154, 36, BK); ell(0, 60, 146, 30);
  for (let i = 0; i < 3; i++) { const k = ((t * 30 / P) + i / 3) % 1, px = [-80, 70, 0][i];
    if (k < .3) { x.save(); x.globalAlpha *= 1 - k / .3 * .3; drop(px, -150 + k / .3 * 190, .8); x.restore(); }
    else { const q = (k - .3) / .7; ring(px, 56, 10 + q * 60, 3 + q * 14, 4, (1 - q)); ring(px, 56, 4 + q * 34, 2 + q * 8, 3, (1 - q) * .8); x.save(); x.globalAlpha *= (1 - q); x.beginPath(); x.ellipse(px, 56, 10 + q * 60, 3 + q * 14, 0, 0, 7); line(4, BK); x.restore(); } }
  eye(-36, 50, 8, t); eye(28, 50, 8, t, .4); smile(-4, 62, 12, 5);
}
function boots(t) {
  // a pair of rain boots with polka dots, stomping one after the other; splashes on landing
  [[-60, 0], [60, .5]].forEach(([bx, o], j) => {
    const ph = ((t * 60 / P) + o) % 1, up = Math.max(0, Math.sin(ph * TAU)) * 50, sp = ph > .5 ? (ph - .5) * 2 : 0;
    if (sp > 0 && sp < .6) for (let k = -1; k <= 1; k += 2) { x.save(); x.globalAlpha *= 1 - sp / .6; drop(bx + k * (30 + sp * 70), 120 - Math.sin(sp / .6 * Math.PI) * 50, .45); x.restore(); }
    x.save(); x.translate(bx, -up);
    x.beginPath(); x.moveTo(-34, -110); x.lineTo(30, -110); x.lineTo(30, 70); x.quadraticCurveTo(80, 70, 84, 100); x.lineTo(84, 124); x.lineTo(-40, 124); x.lineTo(-40, 70); x.closePath(); x.fillStyle = WH; x.fill();
    x.fillStyle = BK; x.fillRect(-46, 112, 136, 8); x.fillRect(-40, -110, 76, 14);
    [[-14, -60], [14, -30], [-16, 0], [14, 30], [-12, 60], [50, 96]].forEach(([a, b]) => dot(a, b, 9, BK));
    if (j === 0) { eye(-10, -76, 7, t); eye(14, -76, 7, t, .4); smile(2, -66, 8, 4); }
    x.restore();
  });
}
function duck(t) {
  // duck in a rain hat paddling through ripples, flapping a little wing
  const bob = per(t, 30) * 5;
  for (let i = 0; i < 2; i++) { const k = ((t * 30 / P) + i / 2) % 1; ring(10, 100, 120 + k * 60, 12 + k * 8, 4, (1 - k)); }
  x.save(); x.translate(0, bob);
  x.beginPath(); x.moveTo(-60, 40); x.quadraticCurveTo(-70, 100, 10, 100); x.quadraticCurveTo(120, 100, 130, 30); x.quadraticCurveTo(100, 50, 70, 40); x.closePath(); x.fillStyle = WH; x.fill();
  const fl = per(t, 60) * .25;
  x.save(); x.translate(40, 52); x.rotate(-.2 + fl); x.beginPath(); x.ellipse(0, 0, 44, 22, 0, 0, 7); x.fillStyle = BK; x.fill(); x.beginPath(); x.ellipse(0, 0, 38, 17, 0, 0, 7); x.fillStyle = WH; x.fill();
  [-14, 0, 14].forEach(a => { x.beginPath(); x.moveTo(a, -8); x.lineTo(a + 6, 10); line(3, BK); }); x.restore();
  dot(-52, -16, 46);
  x.beginPath(); x.moveTo(-92, -10); x.quadraticCurveTo(-130, -6, -134, 6); x.quadraticCurveTo(-110, 14, -88, 6); x.closePath(); x.fillStyle = WH; x.fill(); line(4, BK);
  eye(-62, -24, 9, t); cheek(-40, -6, 8);
  // rain hat (sou'wester) with a wide back brim and stripes
  x.beginPath(); x.moveTo(-100, -46); x.quadraticCurveTo(-56, -110, -4, -50); x.quadraticCurveTo(20, -30, 30, -44); x.lineTo(16, -56); x.quadraticCurveTo(-50, -70, -100, -46); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-100, -46); x.quadraticCurveTo(-56, -110, -4, -50); x.quadraticCurveTo(20, -30, 30, -44); x.lineTo(16, -56); x.quadraticCurveTo(-50, -70, -100, -46); x.closePath(); line(5, BK);
  x.beginPath(); x.moveTo(-96, -50); x.quadraticCurveTo(-50, -66, 12, -54); line(4, BK);
  [-74, -52, -30].forEach(a => { x.beginPath(); x.moveTo(a, -82); x.lineTo(a + 6, -54); line(4, BK); });
  x.restore();
}
function snail(t) {
  // snail with a spiral shell and waving eye stalks; a raindrop sits on the shell and a dotted trail behind
  const st = per(t, 24) * .15;
  for (let i = 0; i < 5; i++) dot(70 + i * 26, 106, 5 - i * .6);
  x.beginPath(); x.moveTo(-150, 104); x.quadraticCurveTo(-150, 40, -100, 40); x.lineTo(60, 60); x.quadraticCurveTo(110, 80, 120, 104); x.closePath(); x.fillStyle = WH; x.fill();
  [[-130, -.25 + st], [-104, .15 - st]].forEach(([sx, r]) => { x.save(); x.translate(sx, 46); x.rotate(r); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -64); line(8); dot(0, -70, 14); eye(-2, -70, 7, t, sx > -120 ? .4 : 0); x.restore(); });
  smile(-130, 74, 12, 5); cheek(-110, 80);
  dot(10, 0, 90); dot(10, 0, 80, BK); dot(10, 0, 72);
  x.beginPath(); for (let a = 0; a < 5.4 * Math.PI; a += .1) { const r = 6 + a * 3.6; x.lineTo(10 + Math.cos(a + TAU * t * 2 / P) * r, Math.sin(a + TAU * t * 2 / P) * r); } line(9, BK);
  drop(36, -98 + per(t, 24) * 3, 1.1);
}
function sun(t) {
  // sun with turning rays peeking out from behind a cloud – the cloud slides a little to let it smile
  const rot = TAU * t * 4 / P, peek = (per(t, 12) + 1) / 2;
  x.save(); x.translate(40, -30);
  x.save(); x.rotate(rot); for (let i = 0; i < 12; i++) { x.save(); x.rotate(i * TAU / 12); x.beginPath(); x.moveTo(0, -96); x.lineTo(0, -128 - (i % 2) * 14); line(12); x.restore(); } x.restore();
  dot(0, 0, 84); dot(0, 0, 74, BK); dot(0, 0, 68);
  eye(-24, -8, 9, t); eye(24, -8, 9, t, .4); smile(0, 10, 18, 6); cheek(-42, 18); cheek(42, 18);
  x.restore();
  x.save(); x.translate(-60 - peek * 50, 70);
  puff(-60, 0, .95, BK); puff(-60, 0, .88);
  eye(-20, -4, 7, t, .2); eye(14, -4, 7, t, .6); smile(-3, 8, 10, 4);
  x.restore();
}
function frog(t) {
  // little frog sitting on a stone, holding a big leaf over its head as an umbrella; drops roll off the leaf
  const sw = per(t, 12) * .06;
  for (let i = 0; i < 2; i++) { const k = ((t * 40 / P) + i / 2) % 1, s = i ? 1 : -1; x.save(); x.globalAlpha *= 1 - k; drop(s * (150 + k * 10), -60 + k * 150, .6); x.restore(); }
  ell(0, 118, 120, 24);
  ell(0, 116, 104, 16, BK); ell(0, 114, 96, 12);
  x.save(); x.rotate(sw);
  x.beginPath(); x.moveTo(30, 40); x.quadraticCurveTo(40, -40, 20, -112); line(8);
  x.beginPath(); x.moveTo(-150, -70); x.quadraticCurveTo(-60, -190, 20, -150); x.quadraticCurveTo(110, -190, 170, -70); x.quadraticCurveTo(10, -108, -150, -70); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-130, -78); x.quadraticCurveTo(10, -140, 150, -78); line(4, BK);
  [-90, -40, 10, 60, 110].forEach(a => { x.beginPath(); x.moveTo(a, -96 - (40 - Math.abs(a - 10) * .35) * .4); x.lineTo(a + (a < 10 ? -18 : 18), -126 + Math.abs(a - 10) * .2); line(3, BK); });
  x.restore();
  ell(0, 66, 80, 48);
  [[-1], [1]].forEach(([s]) => { ell(s * 70, 96, 26, 14); dot(s * 92, 104, 8); dot(s * 80, 108, 7); });
  [-34, 34].forEach((a, i) => { dot(a, 4, 30); dot(a, 4, 22, BK); dot(a, 4, 17); eye(a - 3, 4, 10, t, i * .4); });
  x.beginPath(); x.arc(0, 42, 30, .3, Math.PI - .3); line(6, BK);
  dot(34, 46, 12); x.beginPath(); x.arc(34, 46, 12, 0, 7); line(3, BK);
  cheek(-46, 52); [[-50, 84], [44, 80], [10, 98]].forEach(([a, b]) => dot(a, b, 6, BK));
}

function bg(t) {
  // soft cloud band at the top
  for (let i = 0; i < 6; i++) { const cx = ((i * 190 + t * 1140 / P) % 1140) - 90; x.save(); x.globalAlpha = .9; puff(cx - 60, 6 + (i % 2) * 10, .7); x.restore(); }
  // gentle slanted rain streaks
  x.save(); x.globalAlpha = .45;
  for (let i = 0; i < 46; i++) { const sp = 30 + (i % 3) * 10, k = ((t * sp / P) * 4 + hash(i)) % 1, px = hash(i + 7) * 1040 - 40 - k * 60, py = 40 + k * 470;
    x.beginPath(); x.moveTo(px, py); x.lineTo(px - 6, py + 20); line(2.5); }
  x.restore();
  // wet ground line with ripple rings
  x.beginPath(); x.moveTo(0, 540); for (let i = 0; i <= 960; i += 16) x.lineTo(i, 518 + Math.sin(i * .03) * 4); x.lineTo(960, 540); x.closePath(); x.fillStyle = WH; x.fill();
  for (let i = 0; i < 8; i++) { const k = ((t * 20 / P) * 3 + hash(i + 30)) % 1, px = 60 + i * 120 + hash(i) * 40; ring(px, 504, 6 + k * 34, 2 + k * 5, 2.5, (1 - k) * .8); }
}
// outro: a little cloud asleep, hugging a tiny raindrop, under a crescent moon
function sleepyEnd(t) {
  x.save(); x.translate(170, -150); dot(0, 0, 36); dot(14, -8, 32, BK); x.restore();
  x.save(); x.translate(0, 20 + per(t, 8) * 4);
  puff(-80, 0, 1.15);
  sleepyEye(-36, -6, 9, 5); sleepyEye(10, -6, 9, 5); smile(-14, 10, 10, 5);
  drop(60, 48, 1.4); sleepyEye(54, 56, 4, 3); sleepyEye(66, 56, 4, 3);
  x.beginPath(); x.moveTo(40, 30); x.quadraticCurveTo(64, 20, 84, 40); line(10);
  x.restore();
  for (let i = 0; i < 3; i++) { const k = (t * .25 + i / 3) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k);
    x.font = C.FONT(30 + i * 8); x.fillStyle = WH; x.textAlign = 'center'; x.fillText('z', -150 - k * 30, -40 - k * 100); x.restore(); }
}

L.scene({
  seed: 71,
  figs: [[cloud, .9, 'float'], [raindrop, .8, 'sway'], [umbrella, .9, 'sway'], [rainbow, .9, 'sway'], [puddle, .85, 'floor'],
         [boots, .85, 'sway'], [duck, .85, 'swimL'], [snail, .85, 'floor'], [sun, .85, 'sway'], [frog, .85, 'sway']],
  bg, end: sleepyEnd, scale: 1.4,
});
