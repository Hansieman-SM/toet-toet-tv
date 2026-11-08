// Storyboard (stills) for the proposed learning series: counting 1–10 (seasonal) and ABC, each with Little Truck Toet and with The Big Four.
// Usage: OW=1280 OH=720 node sb/learn_storyboard.js <outdir>   -> <outdir>/<concept>_<n>.png
// Prototype art only (for Hans to review); the real episodes get their own ep/ files after approval.
const fs = require('fs');
const C = require('../lib/common'), T = require('../lib/toet'), TF = require('../lib/toetfriends'), S = require('../lib/safari'), A = require('../lib/av');
const { x, W, H, rr, circ, ell, hash, lerp, clamp, INK } = C;
const OUT = process.argv[2] || 'sb_out'; fs.mkdirSync(OUT, { recursive: true });
const NUM = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];
const LEAFC = ['#ff7a45', '#ffb627', '#e63946', '#f4a261', '#d62828', '#ffd23f', '#e76f51', '#ff9f1c', '#c1121f', '#f6bd60'];

function save(name) { fs.writeFileSync(`${OUT}/${name}.png`, C.cv.toBuffer('image/png')); x.setTransform(C.cv.width / W, 0, 0, C.cv.height / H, 0, 0); }
function reset() { x.setTransform(C.cv.width / W, 0, 0, C.cv.height / H, 0, 0); x.globalAlpha = 1; }

// ---------- shared learning UI ----------
// counting tray at the top: 10 slots, the first n filled with an icon, the newest one glows
function tray(n, icon, ink = INK) {
  const w = 640, x0 = W / 2 - w / 2;
  x.save(); x.fillStyle = 'rgba(255,255,255,.85)'; x.strokeStyle = ink; x.lineWidth = 4; rr(x0, 22, w, 64, 30); x.fill(); x.stroke();
  for (let i = 0; i < 10; i++) { const cx = x0 + 44 + i * 61, cy = 54;
    if (i < n) { if (i === n - 1) circ(cx, cy, 27, 'rgba(255,210,63,.55)'); icon(cx, cy, i); }
    else { x.setLineDash([5, 5]); circ(cx, cy, 20, null, 'rgba(29,53,87,.35)', 3); x.setLineDash([]); } }
  x.restore();
}
function bigNumber(n, cx, cy, col) {
  C.bigText(String(n), cx, cy, 1, 120, col);
  C.bigText(NUM[n - 1], cx, cy + 88, 1, 44, '#ffffff');
}
function leafShape(cx, cy, s, rot, col) {
  x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(s, s);
  x.beginPath(); x.moveTo(0, 18); x.bezierCurveTo(-18, 6, -16, -12, 0, -20); x.bezierCurveTo(16, -12, 18, 6, 0, 18); x.fillStyle = col; x.fill();
  x.strokeStyle = 'rgba(80,30,10,.6)'; x.lineWidth = 2; x.stroke(); x.beginPath(); x.moveTo(0, 22); x.lineTo(0, -14); x.stroke();
  x.restore();
}
function flake(cx, cy, r, rot = 0, col = '#ffffff') {
  x.save(); x.translate(cx, cy); x.rotate(rot); x.lineCap = 'round';
  [['#3a86ff', r * .34], [col, r * .16]].forEach(([c, lw]) => { x.strokeStyle = c; x.lineWidth = lw;
    for (let i = 0; i < 6; i++) { x.rotate(Math.PI / 3); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -r); x.moveTo(0, -r * .55); x.lineTo(-r * .28, -r * .8); x.moveTo(0, -r * .55); x.lineTo(r * .28, -r * .8); x.stroke(); } });
  x.restore();
}
function flakeIcon(cx, cy, i) { circ(cx, cy, 20, '#9fd3f5', INK, 2.5); flake(cx, cy, 14, i * .3); }
function leafIcon(cx, cy, i) { leafShape(cx, cy, 1, -.4 + (i % 3) * .3, LEAFC[i]); }

// autumn tree (big, original) – leaves in warm colours, some already on the ground
function autumnTree(px, gy, nOn) {
  x.save(); x.translate(px, gy);
  x.fillStyle = '#8a5a36'; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(-26, 0); x.quadraticCurveTo(-14, -120, -10, -200); x.lineTo(14, -200); x.quadraticCurveTo(18, -120, 30, 0); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = '#8a5a36'; x.lineWidth = 12; x.lineCap = 'round';
  x.beginPath(); x.moveTo(4, -150); x.quadraticCurveTo(70, -175, 130, -185); x.moveTo(0, -170); x.quadraticCurveTo(-60, -195, -110, -200); x.stroke();
  [['#e9a23b', 6], ['#f4b942', 0]].forEach(([col, g]) => { x.fillStyle = col; x.beginPath();
    [[-90, -250, 62], [0, -290, 78], [90, -258, 64], [-30, -215, 66], [140, -205, 40], [-140, -205, 40]].forEach(([a, b, r]) => { x.moveTo(a + r + g, b); x.arc(a, b, r + g, 0, 7); }); x.fill(); });
  for (let i = 0; i < nOn; i++) leafShape(-120 + hash(i + 3) * 250, -300 + hash(i + 8) * 120, 1.1, hash(i) * 3, LEAFC[i % 10]);
  x.restore();
}
function autumnWorld(t = 1) {
  T.world({ t, dist: 640, skyP: .14, near: 'trees' });
  // warm autumn tint over the green world
  x.fillStyle = 'rgba(255,170,60,.16)'; x.fillRect(0, 0, W, H);
}
function winterWorld(t = 1) {
  const g = x.createLinearGradient(0, 0, 0, 360); g.addColorStop(0, '#9fc9ee'); g.addColorStop(1, '#e6f3ff'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(0, 330); x.quadraticCurveTo(240, 270, 480, 320); x.quadraticCurveTo(720, 360, 960, 300); x.lineTo(960, 540); x.lineTo(0, 540); x.fill();
  x.fillStyle = '#eef6ff'; x.beginPath(); x.moveTo(0, 400); x.quadraticCurveTo(300, 370, 600, 405); x.quadraticCurveTo(800, 425, 960, 395); x.lineTo(960, 540); x.lineTo(0, 540); x.fill();
  [[70, 360, .9], [160, 350, .7], [880, 345, .85], [800, 355, .6]].forEach(([a, b, s]) => A.pine(a, b, s));
  x.fillStyle = '#dbeaf8'; x.beginPath(); x.ellipse(W / 2, S.GROUND + 8, 560, 30, 0, 0, 7); x.fill();
  A.snowflakes(t * 0 + 3, .5);
}
const actor = (k, px, sc, o = {}) => S.actor({ lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo }[k], px, false, o.act || 0, sc, o);
function scarf(px, py, col) { x.save(); x.fillStyle = col; x.strokeStyle = INK; x.lineWidth = 2.5; rr(px - 22, py - 6, 44, 12, 6); x.fill(); x.stroke(); rr(px + 8, py, 10, 26, 4); x.fill(); x.stroke(); x.restore(); }

// ---------- ABC helpers ----------
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function abcStrip(cur, ink = INK) {
  const w = 900, x0 = 30, step = w / 26;
  x.save(); x.fillStyle = 'rgba(255,255,255,.88)'; x.strokeStyle = ink; x.lineWidth = 3; rr(x0 - 6, 18, w + 12, 44, 20); x.fill(); x.stroke();
  x.textAlign = 'center'; x.textBaseline = 'middle';
  for (let i = 0; i < 26; i++) { const cx = x0 + step * (i + .5), on = ABC[i] === cur, done = ABC.indexOf(cur) > i;
    if (on) { circ(cx, 40, 19, '#ffd23f', ink, 2.5); }
    x.font = C.FONT(on ? 30 : 22); x.fillStyle = on ? '#e8501f' : done ? ink : 'rgba(29,53,87,.45)'; x.fillText(ABC[i], cx, 42); }
  x.restore();
}
// wooden letter block with upper + lower case
function letterBlock(L, cx, cy, s, col) {
  x.save(); x.translate(cx, cy); x.scale(s, s);
  x.fillStyle = 'rgba(0,0,0,.15)'; x.beginPath(); x.ellipse(0, 112, 110, 12, 0, 0, 7); x.fill();
  x.fillStyle = col; x.strokeStyle = INK; x.lineWidth = 5; rr(-100, -100, 200, 200, 26); x.fill(); x.stroke();
  x.fillStyle = 'rgba(255,255,255,.9)'; rr(-80, -80, 160, 160, 18); x.fill();
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = C.FONT(118); x.fillStyle = col; x.lineWidth = 6; x.strokeStyle = INK;
  x.strokeText(L + L.toLowerCase(), 0, 10); x.fillText(L + L.toLowerCase(), 0, 10);
  x.restore();
}
function wordCard(txt, cx, cy, L, col) {
  x.save(); x.font = C.FONT(46); const w = x.measureText(txt).width + 60;
  x.fillStyle = '#fff'; x.strokeStyle = INK; x.lineWidth = 4; rr(cx - w / 2, cy - 34, w, 68, 30); x.fill(); x.stroke();
  x.textAlign = 'left'; x.textBaseline = 'middle'; const lw = x.measureText(txt[0]).width; let px = cx - w / 2 + 30;
  x.fillStyle = col; x.fillText(txt[0], px, cy + 3); x.fillStyle = INK; x.fillText(txt.slice(1), px + lw, cy + 3);
  x.restore();
}
// objects (original, simple)
const OBJ = {
  apple(cx, cy, s = 1) { x.save(); x.translate(cx, cy); x.scale(s, s); circ(-16, 0, 40, '#e63946', INK, 3.5); circ(16, 0, 40, '#e63946'); x.beginPath(); x.arc(16, 0, 40, -1.4, 1.6); x.lineWidth = 3.5; x.strokeStyle = INK; x.stroke();
    x.strokeStyle = '#6b4f3a'; x.lineWidth = 6; x.beginPath(); x.moveTo(0, -36); x.lineTo(4, -60); x.stroke(); ell(22, -54, 16, 8, '#3fbf6e', INK, 2.5); circ(-26, -14, 8, 'rgba(255,255,255,.6)'); x.restore(); },
  ball(cx, cy, s = 1) { x.save(); x.translate(cx, cy); x.scale(s, s); circ(0, 0, 50, '#4cc9f0', INK, 3.5);
    x.save(); x.beginPath(); x.arc(0, 0, 50, 0, 7); x.clip(); x.fillStyle = '#ffd23f'; x.fillRect(-60, -14, 120, 28); x.fillStyle = '#ff5d8f'; x.beginPath(); x.arc(0, 0, 12, 0, 7); x.fill(); x.restore();
    x.beginPath(); x.arc(0, 0, 50, 0, 7); x.lineWidth = 3.5; x.strokeStyle = INK; x.stroke(); circ(-20, -22, 8, 'rgba(255,255,255,.7)'); x.restore(); },
  duck(cx, cy, s = 1) { x.save(); x.translate(cx, cy); x.scale(s, s);
    x.beginPath(); x.moveTo(-60, 0); x.quadraticCurveTo(-70, -40, -40, -30); x.quadraticCurveTo(0, -40, 40, -20); x.quadraticCurveTo(60, 30, 0, 36); x.quadraticCurveTo(-56, 36, -60, 0); x.fillStyle = '#ffd23f'; x.fill(); x.lineWidth = 3.5; x.strokeStyle = INK; x.stroke();
    x.beginPath(); x.moveTo(-20, 0); x.quadraticCurveTo(4, 20, 24, -2); x.lineWidth = 3; x.stroke();
    circ(36, -42, 26, '#ffd23f', INK, 3.5); x.beginPath(); x.moveTo(58, -46); x.quadraticCurveTo(80, -42, 78, -34); x.quadraticCurveTo(66, -30, 56, -34); x.closePath(); x.fillStyle = '#ff9f1c'; x.fill(); x.stroke();
    circ(42, -50, 5, INK); circ(43.5, -51.5, 1.8, '#fff'); x.restore(); },
  cow(cx, cy, s = 1) { x.save(); x.translate(cx, cy); x.scale(s, s);
    [[-44], [-24], [28], [46]].forEach(([a]) => { x.fillStyle = '#fff'; x.strokeStyle = INK; x.lineWidth = 3; rr(a - 8, 0, 16, 46, 6); x.fill(); x.stroke(); x.fillStyle = INK; x.fillRect(a - 8, 38, 16, 8); });
    ell(0, -6, 68, 36, '#fff', INK, 3.5); ell(-20, -14, 18, 14, INK); ell(26, 4, 14, 11, INK); ell(10, -30, 10, 7, INK);
    ell(-18, 26, 12, 8, '#ffb3c6', INK, 2.5);
    x.save(); x.translate(64, -34); ell(0, 0, 30, 28, '#fff', INK, 3.5); ell(8, 16, 22, 14, '#ffb3c6', INK, 3); circ(2, 16, 3, INK); circ(14, 16, 3, INK);
    circ(-6, -6, 5, INK); circ(12, -6, 5, INK); circ(-5, -7.5, 1.8, '#fff'); circ(13, -7.5, 1.8, '#fff');
    ell(-26, -14, 12, 7, '#fff', INK, 3); ell(28, -18, 12, 7, '#fff', INK, 3); x.fillStyle = '#f4d58d'; x.strokeStyle = INK; x.lineWidth = 2.5;
    [[-12, -26, -18, -44], [12, -26, 18, -44]].forEach(([a, b, c, d]) => { x.beginPath(); x.moveTo(a - 5, b); x.lineTo(c, d); x.lineTo(a + 5, b); x.closePath(); x.fill(); x.stroke(); }); x.restore(); x.restore(); },
  egg(cx, cy, s = 1) { x.save(); x.translate(cx, cy); x.scale(s, s); x.beginPath(); x.ellipse(0, 0, 36, 48, 0, 0, 7); x.fillStyle = '#fff6e0'; x.fill(); x.lineWidth = 3.5; x.strokeStyle = INK; x.stroke(); circ(-10, -18, 7, 'rgba(255,255,255,.9)'); x.restore(); },
  ant(cx, cy, s = 1) { x.save(); x.translate(cx, cy); x.scale(s, s); x.strokeStyle = INK; x.lineWidth = 4; x.lineCap = 'round';
    [-20, 0, 20].forEach(a => { x.beginPath(); x.moveTo(a, 0); x.lineTo(a - 14, 30); x.moveTo(a, 0); x.lineTo(a + 10, 30); x.stroke(); });
    circ(-34, -4, 16, '#c0392b', INK, 3); circ(0, 0, 13, '#c0392b', INK, 3); ell(36, 2, 24, 18, '#c0392b', INK, 3);
    x.beginPath(); x.moveTo(-42, -18); x.quadraticCurveTo(-50, -40, -62, -42); x.moveTo(-34, -20); x.quadraticCurveTo(-36, -44, -46, -50); x.stroke();
    circ(-40, -6, 5, '#fff'); circ(-41, -6, 2.6, INK); x.beginPath(); x.arc(-34, 2, 6, .3, 2.6); x.lineWidth = 2.5; x.stroke(); x.restore(); },
  zebra(cx, cy, s = 1) { x.save(); x.translate(cx, cy); x.scale(s, s);
    [[-40, 0], [-20, 0], [30, 0], [48, 0]].forEach(([a]) => { x.fillStyle = '#fff'; x.strokeStyle = INK; x.lineWidth = 3; rr(a - 7, 0, 14, 60, 6); x.fill(); x.stroke(); });
    ell(0, -6, 70, 34, '#fff', INK, 3.5);
    x.save(); x.beginPath(); x.ellipse(0, -6, 70, 34, 0, 0, 7); x.clip(); x.fillStyle = INK; for (let i = -5; i <= 5; i++) { x.beginPath(); x.ellipse(i * 14, -6, 4, 40, .15, 0, 7); x.fill(); } x.restore();
    x.save(); x.translate(-62, -40); x.rotate(-.3); rr(-18, -50, 36, 70, 16); x.fillStyle = '#fff'; x.fill(); x.strokeStyle = INK; x.lineWidth = 3.5; x.stroke();
    x.fillStyle = INK; for (let i = 0; i < 4; i++) x.fillRect(-18, -40 + i * 15, 36, 5); ell(-4, -54, 14, 22, '#fff', INK, 3); x.fillStyle = INK; x.fillRect(-14, -74, 20, 6);
    circ(-6, -36, 5, INK); circ(-4, -38, 1.8, '#fff'); x.restore(); x.restore(); },
};

// =========================================================
// 1) COUNT – 10 Falling Leaves with Little Truck Toet (autumn)
// =========================================================
function countLeaves() {
  const P = [];
  // 1 title
  P.push(() => { autumnWorld(); autumnTree(700, 412, 10); TF.toetAt(300, 440, 1);
    C.card(['10 Falling Leaves', 64], ['Count with Little Truck Toet', 38], 1, { accent: '#e76f51', bg: '#fff4e6' }); });
  // 2 Toet stops under the tree
  P.push(() => { autumnWorld(); autumnTree(640, 412, 10); TF.toetAt(330, 440, 1, { mouth: .6 });
    C.bubble('Look! An autumn tree!', 330, 250, 1, { size: 30 }); tray(0, leafIcon); });
  // 3 – leaf 1 falls into Toet's box
  P.push(() => { autumnWorld(); autumnTree(640, 412, 9); TF.toetAt(330, 440, 1);
    leafShape(300, 260, 1.8, .6, LEAFC[0]); x.strokeStyle = 'rgba(255,255,255,.8)'; x.setLineDash([6, 8]); x.lineWidth = 3; x.beginPath(); x.moveTo(560, 170); x.quadraticCurveTo(380, 160, 310, 250); x.stroke(); x.setLineDash([]);
    tray(1, leafIcon); bigNumber(1, 800, 230, LEAFC[0]); });
  // 4 – leaf 3
  P.push(() => { autumnWorld(); autumnTree(640, 412, 7); TF.toetAt(330, 440, 1, { mouth: .4 });
    [[270, 322, 0], [320, 318, 1]].forEach(([a, b, i]) => leafShape(a, b, 1.2, i, LEAFC[i])); leafShape(380, 250, 1.8, -.5, LEAFC[2]);
    tray(3, leafIcon); bigNumber(3, 800, 230, LEAFC[2]); });
  // 5 – wind gust: two at once (7)
  P.push(() => { autumnWorld(); autumnTree(640, 412, 3); TF.toetAt(330, 440, 1);
    x.strokeStyle = 'rgba(255,255,255,.75)'; x.lineWidth = 4; x.lineCap = 'round'; [[150, 160], [120, 200], [180, 230]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo(a + 80, b - 20, a + 160, b); x.stroke(); });
    for (let i = 0; i < 5; i++) leafShape(250 + i * 30, 320 - (i % 2) * 6, 1.2, i, LEAFC[i]); leafShape(420, 240, 1.7, .4, LEAFC[5]); leafShape(470, 200, 1.7, -.6, LEAFC[6]);
    C.bubble('Whoosh! The wind!', 600, 470, 1, { size: 28, noTail: true }); tray(7, leafIcon); bigNumber(7, 800, 210, LEAFC[6]); });
  // 6 – leaf 10, the last one: tree is bare, TEN!
  P.push(() => { autumnWorld(); autumnTree(640, 412, 0); TF.toetAt(330, 440, 1, { mouth: .8 });
    for (let i = 0; i < 9; i++) leafShape(240 + (i % 5) * 34, 322 - Math.floor(i / 5) * 16, 1.2, i, LEAFC[i]);
    leafShape(330, 260, 1.8, .2, LEAFC[9]); C.sparkles(330, 260, 1, 10, 90);
    tray(10, leafIcon); bigNumber(10, 800, 230, LEAFC[9]); });
  // 7 – recap: 1..10 in a row, each leaf with its numeral
  P.push(() => { autumnWorld(); x.fillStyle = 'rgba(255,248,235,.82)'; x.fillRect(0, 0, W, H);
    C.bigText("Let's count again!", W / 2, 90, 1, 54, '#e76f51');
    for (let i = 0; i < 10; i++) { const cx = 120 + (i % 5) * 180, cy = 240 + Math.floor(i / 5) * 160;
      leafShape(cx, cy - 20, 2, -.3, LEAFC[i]); C.bigText(String(i + 1), cx, cy + 50, 1, 50, '#ffffff'); } });
  // 8 – ending: Toet drives off with a heap of leaves, subscribe
  P.push(() => { autumnWorld(); autumnTree(760, 412, 0); TF.toetAt(380, 440, 1, { moving: true });
    for (let i = 0; i < 10; i++) leafShape(290 + (i % 5) * 30, 320 - Math.floor(i / 5) * 18, 1.3, i, LEAFC[i]);
    C.bubble('10 leaves! Bye bye, tree!', 380, 250, 1, { size: 28 }); C.subscribePill(x, 999, 1000); });
  return P;
}

// =========================================================
// 2) COUNT – 10 Little Snowflakes with The Big Four (winter)
// =========================================================
function countSnow() {
  const P = [];
  const four = (o = {}) => { actor('elephant', 160, .66, { flip: true, act: o.e || 0 }); actor('lion', 380, .62, { flip: true, act: o.l || 0 }); actor('rhino', 590, .6, { act: o.r || 0 }); actor('buffalo', 800, .6, { act: o.b || 0 }); };
  const trail = (a, b, c, d) => { x.strokeStyle = 'rgba(58,134,255,.55)'; x.lineWidth = 3; x.setLineDash([6, 8]); x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo((a + c) / 2 + 40, b, c, d); x.stroke(); x.setLineDash([]); };
  S.setT(20);
  P.push(() => { winterWorld(); four(); C.card(['10 Little Snowflakes', 62], ['Count with The Big Four', 38], 1, { accent: '#3a86ff', bg: '#eef7ff' }); });
  P.push(() => { winterWorld(); four({ b: .5 }); C.bubble("Brrr! It's snowing!", 800, 250, 1, { size: 28 }); tray(0, flakeIcon); });
  // flake 1 lands on Ella's trunk
  P.push(() => { winterWorld(); four({ e: .3 }); trail(220, 120, 104, 330); flake(104, 330, 22, .3);
    C.bubble('One on my trunk!', 270, 250, 1, { size: 26 }); tray(1, flakeIcon); bigNumber(1, 560, 190, '#4cc9f0'); });
  // flake 2 on Leo's nose, 3 on Nico's horn
  P.push(() => { winterWorld(); four({ l: .4 }); flake(104, 330, 14); flake(318, 342, 20, .5); flake(530, 344, 20, .2);
    tray(3, flakeIcon); bigNumber(3, 760, 190, '#4cc9f0'); C.bubble('Two, three!', 420, 260, 1, { size: 26 }); });
  // flakes 4–6: Boris catches them on his tongue
  P.push(() => { winterWorld(); four({ b: .9 }); [[104, 330], [318, 342], [530, 344]].forEach(([a, b]) => flake(a, b, 14)); [[700, 250], [745, 222], [790, 250]].forEach(([a, b], i) => flake(a, b, 18, i));
    C.bubble('Yum! Cold!', 800, 160, 1, { size: 26 }); tray(6, flakeIcon); bigNumber(6, 420, 190, '#4cc9f0'); });
  // 10 – all ten twinkle in the sky in a big circle above the friends
  P.push(() => { winterWorld(); four({ e: .6, l: .6, r: .6, b: .6 });
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i / 10 * Math.PI * 2; flake(480 + Math.cos(a) * 120, 210 + Math.sin(a) * 70, 18, i); }
    tray(10, flakeIcon); C.bigText('10', 480, 214, 1, 90, '#4cc9f0'); C.bigText('TEN!', 480, 300, 1, 40, '#ffffff'); });
  // recap: flakes 1..10 with numerals
  P.push(() => { winterWorld(); x.fillStyle = 'rgba(235,245,255,.82)'; x.fillRect(0, 0, W, H);
    C.bigText("Let's count again!", W / 2, 90, 1, 54, '#3a86ff');
    for (let i = 0; i < 10; i++) { const cx = 120 + (i % 5) * 180, cy = 240 + Math.floor(i / 5) * 160; circ(cx, cy - 20, 40, '#9fd3f5', INK, 3); flake(cx, cy - 20, 30, i * .2); C.bigText(String(i + 1), cx, cy + 50, 1, 50, '#ffffff'); } });
  // ending: the ten snowflakes become a snowman, subscribe
  P.push(() => { winterWorld(); actor('elephant', 150, .5, { flip: true }); actor('lion', 330, .46, { flip: true, act: .5 }); A.snowman(500, 470, 1.1, 1, .5); actor('rhino', 660, .45); actor('buffalo', 830, .45);
    C.bubble('Our snowman is ready!', 480, 200, 1, { size: 28 }); C.subscribePill(x, 999, 1000); });
  return P;
}

// =========================================================
// 3) ABC – Toet's ABC Drive (Little Truck Toet)
// =========================================================
function abcToet() {
  const P = [];
  const road = (d = 900) => T.world({ t: 1, dist: d, skyP: .12, near: 'mixed' });
  P.push(() => { road(); TF.toetAt(300, 440, 1); C.card(["Toet's ABC Drive", 64], ['Learn the alphabet A to Z', 38], 1, { accent: '#ff7a45' }); });
  // A – apple tree, block, word
  P.push(() => { road(1200); abcStrip('A'); TF.toetAt(230, 440, .85, { mouth: .5 }); letterBlock('A', 560, 200, .8, '#e63946'); OBJ.apple(790, 200, 1.3); wordCard('Apple', 790, 300, 'A', '#e63946');
    C.bubble('A is for Apple!', 230, 270, 1, { size: 26 }); });
  // B – ball bounces on the road
  P.push(() => { road(1500); abcStrip('B'); TF.toetAt(230, 440, .85); letterBlock('B', 560, 200, .8, '#3a86ff'); OBJ.ball(790, 190, 1.1); wordCard('Ball', 790, 300, 'B', '#3a86ff');
    x.strokeStyle = 'rgba(29,53,87,.4)'; x.lineWidth = 3; x.setLineDash([6, 8]); x.beginPath(); x.moveTo(700, 400); x.quadraticCurveTo(740, 250, 770, 250); x.stroke(); x.setLineDash([]); });
  // C – cow in the meadow says Moo
  P.push(() => { road(1800); abcStrip('C'); TF.toetAt(230, 440, .85); letterBlock('C', 560, 200, .8, '#2a9d8f'); OBJ.cow(770, 200, 1.1); wordCard('Cow', 790, 300, 'C', '#2a9d8f');
    C.bubble('Moo!', 860, 140, 1, { size: 28 }); });
  // D – duck
  P.push(() => { road(2100); abcStrip('D'); TF.toetAt(230, 440, .85); letterBlock('D', 560, 200, .8, '#f4a261'); OBJ.duck(760, 225, 1.15); wordCard('Duck', 790, 300, 'D', '#f4a261'); C.bubble('Quack!', 880, 110, 1, { size: 28 }); });
  // E – egg ... and so on to Z (example: E)
  P.push(() => { road(2400); abcStrip('E'); TF.toetAt(230, 440, .85); letterBlock('E', 560, 200, .8, '#9b5de5'); OBJ.egg(790, 200, 1.4); wordCard('Egg', 790, 300, 'E', '#9b5de5'); });
  // recap: alphabet train – Toet pulls 26 letters (the song-less "ABC parade")
  P.push(() => { road(3000); x.fillStyle = 'rgba(255,255,255,.75)'; x.fillRect(0, 0, W, 330);
    C.bigText('A B C ... Z!', W / 2, 70, 1, 56, '#ff7a45');
    const cols = ['#e63946', '#3a86ff', '#2a9d8f', '#f4a261', '#9b5de5', '#ffb627'];
    for (let i = 0; i < 26; i++) { const r = Math.floor(i / 13), c = i % 13, cx = 70 + c * 68, cy = 160 + r * 80;
      x.fillStyle = cols[i % 6]; x.strokeStyle = INK; x.lineWidth = 3; rr(cx - 28, cy - 28, 56, 56, 10); x.fill(); x.stroke();
      x.font = C.FONT(38); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ABC[i], cx, cy + 3); }
    TF.toetAt(480, 440, .9, { mouth: .6 }); });
  P.push(() => { road(3300); abcStrip('Z'); TF.toetAt(230, 440, .85); letterBlock('Z', 560, 200, .8, '#264653'); OBJ.zebra(800, 210, 1.1); wordCard('Zebra', 790, 300, 'Z', '#264653');
    C.subscribePill(x, 999, 1000); });
  return P;
}

// =========================================================
// 4) ABC – Animal ABC with The Big Four (savanna)
// =========================================================
function abcFour() {
  const P = [];
  const sav = () => { S.setT(20); S.sky(); S.land(); };
  P.push(() => { sav(); actor('elephant', 170, .55, { flip: true }); actor('lion', 390, .5, { flip: true }); actor('rhino', 590, .48); actor('buffalo', 790, .48); S.foreground();
    C.card(['Animal ABC', 66], ['with The Big Four', 40], 1, { accent: '#2a9d8f', bg: '#f1fff8' }); });
  // A – a tiny ant walks past, Leo looks closely
  P.push(() => { sav(); abcStrip('A'); actor('lion', 220, .55, { flip: true, act: .4 }); S.foreground(); letterBlock('A', 560, 220, .8, '#e63946'); OBJ.ant(790, 300, 1.4); wordCard('Ant', 790, 390, 'A', '#e63946');
    C.bubble('A tiny Ant!', 280, 230, 1, { size: 26 }); });
  // B – Boris: B is for Buffalo (proud)
  P.push(() => { sav(); abcStrip('B'); actor('buffalo', 760, .62, { act: .5 }); S.foreground(); letterBlock('B', 360, 220, .8, '#8d5524'); wordCard('Buffalo', 360, 390, 'B', '#8d5524');
    C.bubble("That's me! Boris!", 730, 190, 1, { size: 26 }); });
  // E – Ella: E is for Elephant, trumpets
  P.push(() => { sav(); abcStrip('E'); actor('elephant', 230, .66, { flip: true, act: .8 }); S.foreground(); letterBlock('E', 600, 220, .8, '#7b8ea8'); wordCard('Elephant', 600, 390, 'E', '#7b8ea8');
    C.bubble('Toot! E is for Ella!', 250, 160, 1, { size: 26 }); });
  // L – Leo
  P.push(() => { sav(); abcStrip('L'); actor('lion', 740, .62, { act: .7 }); S.foreground(); letterBlock('L', 360, 220, .8, '#e8a33d'); wordCard('Lion', 360, 390, 'L', '#e8a33d'); C.bubble('Roar! L for Leo!', 720, 190, 1, { size: 26 }); });
  // R – Nico the rhino
  P.push(() => { sav(); abcStrip('R'); actor('rhino', 240, .62, { flip: true, act: .5 }); S.foreground(); letterBlock('R', 600, 220, .8, '#6c757d'); wordCard('Rhino', 600, 390, 'R', '#6c757d'); C.bubble('R is for Rhino!', 250, 190, 1, { size: 26 }); });
  // Z – a zebra visits; everybody waves
  P.push(() => { sav(); abcStrip('Z'); actor('elephant', 120, .42, { flip: true }); actor('lion', 270, .4, { flip: true }); OBJ.zebra(560, 380, 1.3); actor('rhino', 760, .4); actor('buffalo', 880, .4); S.foreground();
    letterBlock('Z', 560, 170, .65, '#264653'); C.bubble('Hello, Zebra!', 300, 230, 1, { size: 26 }); });
  // recap + subscribe: the alphabet in animal colours
  P.push(() => { sav(); x.fillStyle = 'rgba(255,250,240,.8)'; x.fillRect(0, 0, W, 330); C.bigText('A to Z – well done!', W / 2, 70, 1, 52, '#2a9d8f');
    const cols = ['#e63946', '#8d5524', '#7b8ea8', '#e8a33d', '#6c757d', '#2a9d8f'];
    for (let i = 0; i < 26; i++) { const r = Math.floor(i / 13), c = i % 13, cx = 70 + c * 68, cy = 160 + r * 80;
      x.fillStyle = cols[i % 6]; x.strokeStyle = INK; x.lineWidth = 3; rr(cx - 28, cy - 28, 56, 56, 10); x.fill(); x.stroke();
      x.font = C.FONT(38); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ABC[i], cx, cy + 3); }
    actor('elephant', 200, .4, { flip: true, act: .6 }); actor('lion', 380, .38, { flip: true, act: .6 }); actor('rhino', 580, .38, { act: .6 }); actor('buffalo', 760, .38, { act: .6 }); S.foreground(); C.subscribePill(x, 999, 1000); });
  return P;
}

const SETS = { count_leaves: countLeaves, count_snow: countSnow, abc_toet: abcToet, abc_four: abcFour };
for (const [name, fn] of Object.entries(SETS)) fn().forEach((p, i) => { reset(); x.save(); x.clearRect(0, 0, W, H); p(); x.restore(); save(`${name}_${i + 1}`); });
console.log('ok');
