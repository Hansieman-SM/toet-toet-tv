// Learning series – ABC #2: Animal ABC with The Big Four (Leo the Lion, Ella the Elephant, Nico the Rhino, Boris the Buffalo).
// The friends stand on the savanna; per letter (5 s) the alphabet strip lights the current letter, a letter block (upper + lower case)
// pops up with an animal picture card + word card with the coloured first letter, and one of the friends says "A is for Alligator!".
// B, E, L and R are the Big Four themselves – that friend hops and says "… like me!". Recap: 26 tiles with letter + animal light up.
// New music: animal_abc_long (kalimba lead, plucked bass, hand drums + shaker, D major 4/4).
const C = require('../lib/common'), S = require('../lib/safari');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, rr, circ, ell, INK } = C;

const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SEG = 5;
const CHIME = ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6', 'E6'];
const ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
// friends: x, scale, flip (true = faces right)
const FR = { elephant: [102, .58, true], lion: [232, .62, true], rhino: [738, .62, false], buffalo: [858, .6, false] };
const ORDER = ['elephant', 'lion', 'rhino', 'buffalo'];

// ---------- original simple animal icons (centred on 0,0, about 60 px radius) ----------
const st = (lw = 3.5) => { x.lineWidth = lw; x.strokeStyle = INK; x.lineJoin = 'round'; x.lineCap = 'round'; };
const eye = (a, b, r = 5) => { circ(a, b, r, INK); circ(a + r * .3, b - r * .35, r * .36, '#fff'); };
const eyes = (ax, ay, bx, by, r = 5) => { eye(ax, ay, r); eye(bx, by, r); };
const blinkEyes = (ax, ay, bx, by, r, t, off = 0) => { if ((t + off) % 3.6 > 3.45) { st(3); [[ax, ay], [bx, by]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a - r, b); x.lineTo(a + r, b); x.stroke(); }); } else eyes(ax, ay, bx, by, r); };
const smile = (cx, cy, r, lw = 3) => { x.beginPath(); x.arc(cx, cy, r, .25, Math.PI - .25); st(lw); x.stroke(); };
const cheek = (a, b, r = 5) => circ(a, b, r, 'rgba(255,100,120,.4)');
const path = (pts, fill, lw = 3.5) => { x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); if (fill) { x.fillStyle = fill; x.fill(); } st(lw); x.stroke(); };

const A = {
  alligator(t) { x.save(); x.translate(4, 10);
    x.beginPath(); x.moveTo(30, 0); x.quadraticCurveTo(70, -6, 76, 14); x.quadraticCurveTo(56, 8, 30, 18); x.fillStyle = '#5fae4e'; x.fill(); st(); x.stroke();
    ell(0, 6, 44, 22, '#5fae4e', INK, 3.5);
    [-22, 22].forEach(a => { x.fillStyle = '#4c9a3e'; st(3); rr(a - 7, 16, 14, 18, 5); x.fill(); x.stroke(); });
    x.beginPath(); x.moveTo(-30, -10); x.lineTo(-80, -6); x.quadraticCurveTo(-86, 4, -80, 10); x.lineTo(-30, 18); x.closePath(); x.fillStyle = '#6cc25a'; x.fill(); st(); x.stroke();
    x.beginPath(); x.moveTo(-78, 4); x.lineTo(-36, 6); st(2.5); x.stroke();
    x.fillStyle = '#fff'; for (let i = 0; i < 5; i++) { const a = -72 + i * 8; path([[a, 4], [a + 4, 9], [a + 8, 4]], '#fff', 1.5); }
    [[-6, -16], [10, -15], [26, -11]].forEach(([a, b]) => path([[a - 6, b + 2], [a, b - 7], [a + 6, b + 2]], '#4c9a3e', 2.5));
    circ(-40, -14, 10, '#6cc25a', INK, 3); blinkEyes(-40, -15, -40, -15, 5, t); circ(-78, -6, 2.5, INK); x.restore(); },
  cat(t) { x.save(); x.translate(0, 8);
    x.strokeStyle = '#f4a261'; x.lineWidth = 10; x.lineCap = 'round'; x.beginPath(); x.moveTo(30, 40); x.quadraticCurveTo(70, 30, 58, -2 + Math.sin(t * 2) * 4); x.stroke();
    ell(0, 30, 36, 30, '#f4a261', INK, 3.5); ell(0, 36, 18, 20, '#fff1e0');
    path([[-34, -40], [-30, -74], [-8, -54]], '#f4a261'); path([[34, -40], [30, -74], [8, -54]], '#f4a261');
    circ(0, -26, 38, '#f4a261', INK, 3.5); x.strokeStyle = '#d97b3a'; x.lineWidth = 4; [-12, 0, 12].forEach(a => { x.beginPath(); x.moveTo(a, -62); x.lineTo(a, -50); x.stroke(); });
    blinkEyes(-14, -30, 14, -30, 6, t, .7); path([[-5, -16], [5, -16], [0, -10]], '#ff8fab', 2);
    x.beginPath(); x.moveTo(0, -10); x.quadraticCurveTo(-6, -4, -10, -8); x.moveTo(0, -10); x.quadraticCurveTo(6, -4, 10, -8); st(2.5); x.stroke();
    x.lineWidth = 2; [[-1, -14], [-1, -8], [1, -14], [1, -8]].forEach(([s, b]) => { x.beginPath(); x.moveTo(s * 18, b); x.lineTo(s * 44, b - 4 + (b + 11) * .6); x.stroke(); }); x.restore(); },
  dog(t) { x.save(); x.translate(0, 4);
    ell(0, 44, 34, 22, '#c68b59', INK, 3.5);
    circ(0, -8, 42, '#d9a066', INK, 3.5);
    [-1, 1].forEach(s => { x.save(); x.translate(s * 36, -26); x.rotate(s * (.25 + Math.sin(t * 3) * .08)); ell(0, 22, 13, 30, '#8a5a36', INK, 3); x.restore(); });
    ell(0, 10, 24, 18, '#f3dcc0', INK, 3); ell(0, 0, 10, 7, INK); circ(-3, -2, 2.5, 'rgba(255,255,255,.6)');
    blinkEyes(-16, -20, 16, -20, 6, t, 1.4); x.beginPath(); x.moveTo(0, 6); x.lineTo(0, 14); x.moveTo(-10, 14); x.quadraticCurveTo(0, 22, 10, 14); st(2.5); x.stroke();
    x.fillStyle = '#ff8fab'; x.beginPath(); x.ellipse(4, 22, 6, 9, 0, 0, 7); x.fill(); st(2); x.stroke(); circ(-26, -32, 9, '#8a5a36'); x.restore(); },
  frog(t) { x.save(); x.translate(0, 6);
    ell(0, 22, 58, 38, '#6cc25a', INK, 3.5); ell(0, 32, 36, 22, '#d9f2c4');
    [-28, 28].forEach(a => { circ(a, -16, 20, '#6cc25a', INK, 3.5); circ(a, -16, 12, '#fff', INK, 2); });
    const bl = (t % 3.4) > 3.25; [-28, 28].forEach(a => { if (bl) { x.beginPath(); x.moveTo(a - 8, -16); x.lineTo(a + 8, -16); st(3); x.stroke(); } else circ(a, -15, 6, INK); });
    x.beginPath(); x.arc(0, 4, 30, .3, Math.PI - .3); st(3.5); x.stroke(); cheek(-40, 12, 6); cheek(40, 12, 6);
    [-1, 1].forEach(s => { x.fillStyle = '#5fae4e'; x.beginPath(); x.ellipse(s * 44, 56, 18, 8, 0, 0, 7); x.fill(); st(3); x.stroke(); }); x.restore(); },
  giraffe(t) { x.save(); x.translate(10, 20);
    x.beginPath(); x.moveTo(-22, 50); x.lineTo(-14, -30); x.lineTo(6, -30); x.lineTo(16, 50); x.closePath(); x.fillStyle = '#ffc857'; x.fill(); st(); x.stroke();
    [[-8, 30, 7], [4, 8, 6], [-6, -12, 6], [8, 40, 5]].forEach(([a, b, r]) => ell(a, b, r, r * 1.2, '#d98c2b'));
    x.save(); x.translate(-6, -46); x.rotate(-.15 + Math.sin(t * 1.5) * .05);
    [[-8, -26], [10, -26]].forEach(([a, b]) => { x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(a, b + 8); x.lineTo(a, b - 4); x.stroke(); circ(a, b - 6, 5, '#a0612b', INK, 2); });
    ell(-28, -12, 12, 6, '#ffc857', INK, 3); ell(28, -12, 12, 6, '#ffc857', INK, 3);
    ell(0, 0, 26, 24, '#ffc857', INK, 3.5); ell(-4, 18, 22, 14, '#f3dcc0', INK, 3); circ(-12, 18, 2.5, INK); circ(4, 18, 2.5, INK);
    blinkEyes(-10, -4, 12, -4, 4.5, t, .4); x.restore(); x.restore(); },
  hippo(t) { x.save(); x.translate(0, 8);
    [-1, 1].forEach(s => { circ(s * 34, -46, 11, '#9a8fb5', INK, 3); circ(s * 34, -46, 5, '#e7b9c3'); });
    ell(0, -16, 46, 38, '#9a8fb5', INK, 3.5);
    ell(0, 26, 58, 34, '#b3a8cf', INK, 3.5); ell(-16, 18, 6, 4, INK); ell(16, 18, 6, 4, INK);
    blinkEyes(-18, -26, 18, -26, 6, t, 2); x.beginPath(); x.arc(0, 28, 34, .35, Math.PI - .35); st(3); x.stroke();
    path([[-14, 50], [-10, 58], [-6, 51]], '#fff', 2); path([[6, 51], [10, 58], [14, 50]], '#fff', 2); cheek(-40, 10, 7); cheek(40, 10, 7); x.restore(); },
  iguana(t) { x.save(); x.translate(4, 10);
    x.strokeStyle = INK; x.lineWidth = 14; x.lineCap = 'round'; x.beginPath(); x.moveTo(36, 8); x.bezierCurveTo(80, 10, 70, 50, 44, 42); x.stroke(); x.strokeStyle = '#7cc46a'; x.lineWidth = 8; x.stroke();
    ell(4, 10, 40, 18, '#8fd17a', INK, 3.5);
    for (let i = 0; i < 6; i++) path([[-24 + i * 10, -6], [-19 + i * 10, -18], [-14 + i * 10, -6]], '#ffb627', 2);
    [-20, 22].forEach(a => { x.fillStyle = '#7cc46a'; st(3); rr(a - 6, 18, 12, 18, 5); x.fill(); x.stroke(); });
    x.beginPath(); x.moveTo(-30, -4); x.quadraticCurveTo(-70, -14, -72, 4); x.quadraticCurveTo(-66, 20, -30, 22); x.closePath(); x.fillStyle = '#8fd17a'; x.fill(); st(); x.stroke();
    ell(-40, 22, 9, 8, '#ff9f8a', INK, 2.5); blinkEyes(-50, -2, -50, -2, 5, t, 1); smile(-60, 4, 6, 2.5); x.restore(); },
  jellyfish(t) { x.save(); x.translate(0, -6 + Math.sin(t * 1.6) * 4);
    for (let i = 0; i < 5; i++) { const a = -32 + i * 16; x.strokeStyle = ['#ff8fab', '#cdb4db', '#ff8fab', '#cdb4db', '#ff8fab'][i]; x.lineWidth = 6; x.lineCap = 'round';
      x.beginPath(); x.moveTo(a, 6); for (let k = 1; k <= 4; k++) x.lineTo(a + Math.sin(t * 3 + i + k) * 7, 6 + k * 14); x.stroke(); }
    x.beginPath(); x.moveTo(-50, 8); x.bezierCurveTo(-52, -60, 52, -60, 50, 8); for (let i = 4; i >= 0; i--) x.quadraticCurveTo(-50 + (i + .5) * 20, 18, -50 + i * 20, 8); x.closePath(); x.fillStyle = '#ffb3c6'; x.fill(); st(); x.stroke();
    circ(-24, -30, 7, 'rgba(255,255,255,.65)'); blinkEyes(-14, -14, 14, -14, 5, t, .2); smile(0, -6, 8); cheek(-28, -4, 5); cheek(28, -4, 5); x.restore(); },
  kangaroo(t) { x.save(); x.translate(4, 8);
    x.strokeStyle = INK; x.lineWidth = 16; x.lineCap = 'round'; x.beginPath(); x.moveTo(20, 40); x.quadraticCurveTo(60, 50, 72, 58); x.stroke(); x.strokeStyle = '#c98a4b'; x.lineWidth = 10; x.stroke();
    ell(4, 20, 34, 44, '#c98a4b', INK, 3.5); ell(-4, 30, 20, 22, '#f3dcc0', INK, 3);
    circ(-4, 14, 10, '#c98a4b', INK, 2.5); eyes(-8, 12, 0, 12, 2.6); x.beginPath(); x.moveTo(-18, 20); x.lineTo(10, 20); st(3); x.stroke();
    ell(-14, 62, 22, 8, '#b5753c', INK, 3);
    x.save(); x.translate(-14, -36); [[-10, -30], [8, -32]].forEach(([a, b]) => ell(a, b, 7, 16, '#c98a4b', INK, 3));
    ell(0, 0, 24, 22, '#c98a4b', INK, 3.5); ell(-16, 8, 14, 10, '#d9a066', INK, 3); circ(-26, 6, 3, INK); blinkEyes(-6, -6, 8, -6, 4.5, t, .9); x.restore(); x.restore(); },
  monkey(t) { x.save(); x.translate(0, 6);
    x.strokeStyle = '#8a5a36'; x.lineWidth = 8; x.lineCap = 'round'; x.beginPath(); x.moveTo(26, 44); x.bezierCurveTo(70, 40, 70, 0, 52, -4 + Math.sin(t * 2) * 3); x.stroke();
    ell(0, 40, 30, 26, '#8a5a36', INK, 3.5);
    [-1, 1].forEach(s => { circ(s * 42, -16, 15, '#8a5a36', INK, 3); circ(s * 42, -16, 8, '#f3c9a0'); });
    circ(0, -14, 38, '#8a5a36', INK, 3.5);
    x.beginPath(); x.moveTo(0, -30); x.bezierCurveTo(-34, -46, -34, 4, -20, 10); x.quadraticCurveTo(0, 22, 20, 10); x.bezierCurveTo(34, 4, 34, -46, 0, -30); x.fillStyle = '#f3c9a0'; x.fill(); st(3); x.stroke();
    blinkEyes(-11, -16, 11, -16, 5, t, 2.2); circ(-4, -2, 2, INK); circ(4, -2, 2, INK); smile(0, 2, 10); x.restore(); },
  newt(t) { x.save(); x.translate(0, 8);
    const w = Math.sin(t * 3) * 6;
    x.strokeStyle = INK; x.lineWidth = 16; x.lineCap = 'round'; x.beginPath(); x.moveTo(30, 0); x.bezierCurveTo(56, -4, 62, 22 + w, 80, 18 + w); x.stroke(); x.strokeStyle = '#ff9f1c'; x.lineWidth = 10; x.stroke();
    [[-24, 14, -1], [20, 14, 1]].forEach(([a, b, s]) => { x.strokeStyle = INK; x.lineWidth = 8; x.beginPath(); x.moveTo(a, b - 6); x.lineTo(a + s * 10, b + 14); x.stroke(); x.strokeStyle = '#ff9f1c'; x.lineWidth = 4; x.stroke(); });
    ell(0, 0, 38, 15, '#ff9f1c', INK, 3.5); [[-10, -4], [6, 2], [18, -5]].forEach(([a, b]) => circ(a, b, 3.5, '#e8501f'));
    ell(-46, -2, 20, 15, '#ff9f1c', INK, 3.5); blinkEyes(-50, -8, -38, -8, 4.5, t, .6); smile(-50, -1, 7, 2.5); cheek(-58, 4, 4); x.restore(); },
  octopus(t) { x.save(); x.translate(0, -6);
    for (let i = 0; i < 6; i++) { const a = -38 + i * 15; x.strokeStyle = INK; x.lineWidth = 13; x.lineCap = 'round';
      const p = () => { x.beginPath(); x.moveTo(a * .7, 16); x.quadraticCurveTo(a * 1.1 + Math.sin(t * 2.5 + i) * 6, 40, a * 1.3 + Math.sin(t * 2.5 + i + 1) * 8, 58); x.stroke(); };
      p(); x.strokeStyle = '#9b5de5'; x.lineWidth = 8; p(); }
    ell(0, -10, 44, 40, '#9b5de5', INK, 3.5); circ(-18, -30, 8, 'rgba(255,255,255,.5)');
    blinkEyes(-15, -8, 15, -8, 6, t, 1.1); smile(0, 4, 10); cheek(-30, 6, 6); cheek(30, 6, 6); x.restore(); },
  penguin(t) { x.save(); x.translate(0, 4); const r = Math.sin(t * 2.4) * .06; x.rotate(r);
    ell(0, 6, 40, 56, '#2b2d42', INK, 3.5); ell(0, 16, 28, 42, '#fff');
    [-1, 1].forEach(s => { x.save(); x.translate(s * 36, 0); x.rotate(s * (.35 + Math.sin(t * 4) * .1)); ell(0, 16, 9, 24, '#2b2d42', INK, 3); x.restore(); });
    blinkEyes(-11, -26, 11, -26, 4.5, t, .5); path([[-8, -16], [8, -16], [0, -6]], '#ff9f1c', 2.5); cheek(-20, -12, 5); cheek(20, -12, 5);
    ell(-14, 62, 13, 6, '#ff9f1c', INK, 2.5); ell(14, 62, 13, 6, '#ff9f1c', INK, 2.5); x.restore(); },
  quail(t) { x.save(); x.translate(4, 12);
    x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.moveTo(-18, -42); x.quadraticCurveTo(-30, -66, -14, -70); x.stroke(); circ(-14, -71, 7, INK);
    ell(8, 14, 50, 38, '#b08968', INK, 3.5); [[0, 6], [20, 0], [34, 16], [12, 26], [-8, 24]].forEach(([a, b]) => ell(a, b, 5, 3, '#fff6e0'));
    x.beginPath(); x.moveTo(40, -4); x.lineTo(66, -10); x.lineTo(56, 14); x.closePath(); x.fillStyle = '#9c6644'; x.fill(); st(3); x.stroke();
    circ(-24, -22, 24, '#b08968', INK, 3.5); ell(-26, -14, 16, 9, '#fff6e0'); blinkEyes(-30, -26, -30, -26, 5, t, 1.7); path([[-46, -24], [-56, -20], [-46, -16]], '#ff9f1c', 2.5);
    [-6, 18].forEach(a => { x.strokeStyle = '#e07a2b'; x.lineWidth = 4; x.beginPath(); x.moveTo(a, 50); x.lineTo(a, 62); x.moveTo(a - 6, 64); x.lineTo(a + 6, 64); x.stroke(); }); x.restore(); },
  snake(t) { x.save(); x.translate(0, 8);
    x.strokeStyle = INK; x.lineWidth = 24; x.lineCap = 'round';
    const p = () => { x.beginPath(); x.moveTo(60, 40); x.bezierCurveTo(10, 60, -60, 50, -50, 22); x.bezierCurveTo(-40, -4, 40, 16, 40, -10); x.bezierCurveTo(40, -30, 0, -30, -10, -26); x.stroke(); };
    p(); x.strokeStyle = '#52b788'; x.lineWidth = 17; p();
    x.setLineDash([6, 14]); x.strokeStyle = '#ffd23f'; x.lineWidth = 6; p(); x.setLineDash([]);
    ell(-24, -30, 24, 18, '#52b788', INK, 3.5); blinkEyes(-30, -36, -14, -36, 4.5, t, .3); smile(-26, -28, 8, 2.5);
    x.strokeStyle = '#e63946'; x.lineWidth = 3; x.beginPath(); x.moveTo(-46, -24); x.lineTo(-58 - Math.abs(Math.sin(t * 5)) * 6, -22); x.lineTo(-62, -28); x.moveTo(-58, -22); x.lineTo(-62, -16); x.stroke(); x.restore(); },
  turtle(t) { x.save(); x.translate(0, 10);
    [-30, 30].forEach(a => { x.fillStyle = '#8fd17a'; st(3); rr(a - 10, 20, 20, 24, 8); x.fill(); x.stroke(); });
    path([[46, 18], [62, 22], [46, 28]], '#8fd17a', 3);
    const hx = -58 + Math.sin(t * 1.2) * 4; ell(hx, 6, 22, 18, '#8fd17a', INK, 3.5); blinkEyes(hx - 6, 0, hx - 6, 0, 4.5, t, 2.5); smile(hx - 6, 8, 6, 2.5);
    x.beginPath(); x.moveTo(-50, 26); x.bezierCurveTo(-50, -48, 50, -48, 50, 26); x.closePath(); x.fillStyle = '#2a9d8f'; x.fill(); st(); x.stroke();
    x.strokeStyle = '#1d6f66'; x.lineWidth = 3; [[0, -6, 14], [-28, 8, 10], [28, 8, 10], [-16, -22, 8], [16, -22, 8]].forEach(([a, b, r]) => { x.beginPath(); for (let i = 0; i < 6; i++) { const g = i / 6 * Math.PI * 2; x.lineTo(a + Math.cos(g) * r, b + Math.sin(g) * r); } x.closePath(); x.stroke(); });
    x.fillStyle = '#e9c46a'; rr(-52, 22, 104, 10, 5); x.fill(); st(3); x.stroke(); x.restore(); },
  umbrellabird(t) { x.save(); x.translate(0, 10);
    x.beginPath(); x.moveTo(20, 20); x.lineTo(60, 52); x.lineTo(40, 58); x.closePath(); x.fillStyle = '#2b2d42'; x.fill(); st(3); x.stroke();
    ell(4, 16, 38, 34, '#2b2d42', INK, 3.5);
    x.fillStyle = '#2b2d42'; x.beginPath(); x.moveTo(-28, 30); x.quadraticCurveTo(-34, 60, -22, 66); x.quadraticCurveTo(-14, 60, -18, 32); x.fill(); st(3); x.stroke();
    circ(-24, -18, 22, '#2b2d42', INK, 3.5);
    x.beginPath(); x.moveTo(-62, -26); x.quadraticCurveTo(-30, -78, 10, -40); x.quadraticCurveTo(-20, -48, -62, -26); x.fillStyle = '#3d405b'; x.fill(); st(3); x.stroke();
    x.strokeStyle = '#6c7aa1'; x.lineWidth = 2; [-44, -30, -16].forEach(a => { x.beginPath(); x.moveTo(a, -36 - (a + 30) * .1); x.lineTo(a + 6, -52); x.stroke(); });
    circ(-30, -18, 7, '#fff'); blinkEyes(-30, -18, -30, -18, 4, t, 1.9); path([[-44, -10], [-58, -6], [-44, -2]], '#ffd23f', 2.5);
    [-4, 14].forEach(a => { x.strokeStyle = '#555'; x.lineWidth = 4; x.beginPath(); x.moveTo(a, 48); x.lineTo(a, 60); x.stroke(); }); x.restore(); },
  vulture(t) { x.save(); x.translate(0, 10);
    [-1, 1].forEach(s => { x.save(); x.translate(s * 30, 4); x.rotate(s * (.3 + Math.sin(t * 2) * .06)); ell(s * 14, 10, 22, 36, '#7f5539', INK, 3); x.restore(); });
    ell(0, 16, 34, 40, '#9c6644', INK, 3.5); ell(0, -16, 26, 10, '#fff6e0', INK, 3);
    circ(0, -38, 22, '#ffb3a7', INK, 3.5); blinkEyes(-8, -42, 8, -42, 4.5, t, .8);
    x.beginPath(); x.moveTo(-8, -32); x.quadraticCurveTo(0, -30, 8, -32); x.quadraticCurveTo(6, -18, 0, -16); x.quadraticCurveTo(-6, -18, -8, -32); x.fillStyle = '#f2cc8f'; x.fill(); st(2.5); x.stroke();
    cheek(-16, -32, 4); cheek(16, -32, 4);
    [-12, 12].forEach(a => { x.strokeStyle = '#e9a800'; x.lineWidth = 4; x.beginPath(); x.moveTo(a, 54); x.lineTo(a, 64); x.moveTo(a - 6, 66); x.lineTo(a + 6, 66); x.stroke(); }); x.restore(); },
  whale(t) { x.save(); x.translate(0, 14);
    for (let i = 0; i < 3; i++) { const k = ((t * .8 + i / 3) % 1); circ(-22 + (i - 1) * 10 * k, -40 - k * 30, 5 * (1 - k) + 2, `rgba(120,200,255,${1 - k})`); }
    x.beginPath(); x.moveTo(-62, 10); x.bezierCurveTo(-62, -44, 40, -44, 48, 0); x.lineTo(70, -18); x.lineTo(68, 22); x.lineTo(46, 12); x.quadraticCurveTo(20, 40, -40, 36); x.quadraticCurveTo(-62, 30, -62, 10); x.fillStyle = '#4895ef'; x.fill(); st(); x.stroke();
    x.beginPath(); x.moveTo(-58, 14); x.quadraticCurveTo(-10, 22, 40, 10); x.quadraticCurveTo(20, 34, -40, 34); x.quadraticCurveTo(-56, 30, -58, 14); x.fillStyle = '#cfe8ff'; x.fill();
    blinkEyes(-36, -4, -36, -4, 5, t, 1.3); smile(-44, 6, 8); cheek(-26, 6, 5); x.restore(); },
  xrayfish(t) { x.save(); x.translate(-4, 0);
    x.beginPath(); x.moveTo(40, 0); x.lineTo(68, -24); x.lineTo(68, 24); x.closePath(); x.fillStyle = 'rgba(160,220,255,.6)'; x.fill(); st(3); x.stroke();
    ell(-4, 0, 50, 30, 'rgba(190,235,255,.75)', INK, 3.5);
    x.strokeStyle = '#7aa6c2'; x.lineWidth = 3; x.beginPath(); x.moveTo(-30, 0); x.lineTo(44, 0); x.stroke();
    x.lineWidth = 2.5; for (let i = 0; i < 6; i++) { const a = -16 + i * 10; x.beginPath(); x.moveTo(a, -18 + Math.abs(i - 2.5) * 2); x.quadraticCurveTo(a + 4, 0, a, 18 - Math.abs(i - 2.5) * 2); x.stroke(); }
    ell(-20, 6, 7, 6, 'rgba(255,140,160,.7)');
    x.beginPath(); x.moveTo(-4, -28); x.lineTo(10, -42); x.lineTo(16, -26); x.fillStyle = '#ffd23f'; x.fill(); st(2.5); x.stroke();
    blinkEyes(-36, -8, -36, -8, 5.5, t, .9); smile(-42, 8, 6, 2.5); x.restore(); },
  yak(t) { x.save(); x.translate(4, 6);
    ell(14, 22, 58, 34, '#6b4f3a', INK, 3.5);
    x.strokeStyle = '#5a412f'; x.lineWidth = 3; for (let i = 0; i < 9; i++) { const a = -34 + i * 12; x.beginPath(); x.moveTo(a, 40); x.lineTo(a + 2 + Math.sin(t * 2 + i) * 2, 58); x.stroke(); }
    x.save(); x.translate(-40, -6);
    x.strokeStyle = INK; x.lineWidth = 9; x.lineCap = 'round'; const hr = () => { x.beginPath(); x.moveTo(-14, -18); x.quadraticCurveTo(-40, -20, -36, -46); x.moveTo(14, -18); x.quadraticCurveTo(40, -20, 36, -46); x.stroke(); };
    hr(); x.strokeStyle = '#f1e3c8'; x.lineWidth = 5; hr();
    ell(0, 4, 28, 30, '#7f5f45', INK, 3.5); x.fillStyle = '#5a412f'; x.beginPath(); x.ellipse(0, -18, 22, 10, 0, 0, 7); x.fill();
    ell(0, 22, 18, 12, '#a68a64', INK, 3); circ(-6, 22, 2.5, INK); circ(6, 22, 2.5, INK); blinkEyes(-10, 0, 10, 0, 4.5, t, 2.7); x.restore(); x.restore(); },
  zebra(t) { x.save(); x.translate(0, 4);
    [-1, 1].forEach(s => { x.save(); x.translate(s * 24, -46); x.rotate(s * (.35 + Math.sin(t * 2 + s) * .08)); ell(0, 0, 10, 22, '#fff', INK, 3); ell(0, 2, 5, 13, '#f4c4cb'); x.restore(); });
    x.fillStyle = INK; x.beginPath(); x.moveTo(-8, -58); x.quadraticCurveTo(0, -78, 8, -58); x.lineTo(6, -34); x.lineTo(-6, -34); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(-32, -30); x.bezierCurveTo(-36, -70, 36, -70, 32, -30); x.lineTo(24, 30); x.quadraticCurveTo(0, 46, -24, 30); x.closePath(); x.fillStyle = '#fff'; x.fill(); st(); x.stroke();
    x.save(); x.clip(); x.fillStyle = INK; [-40, -26, -12].forEach((b, i) => { x.beginPath(); x.ellipse(-34, b, 14, 4, .3, 0, 7); x.fill(); x.beginPath(); x.ellipse(34, b, 14, 4, -.3, 0, 7); x.fill(); });
    x.beginPath(); x.ellipse(0, -46, 4, 10, 0, 0, 7); x.fill(); x.restore();
    ell(0, 22, 24, 18, '#5c5c6e', INK, 3); circ(-8, 22, 3, INK); circ(8, 22, 3, INK); circ(-8, 21, 2, '#aaa'); circ(8, 21, 2, '#aaa');
    blinkEyes(-14, -16, 14, -16, 5.5, t, 3.1); cheek(-24, 0, 5); cheek(24, 0, 5); x.restore(); },
};
// Big Four letters: draw the real character small inside the card
A.buffalo = t => { x.save(); x.translate(22, 52); x.scale(.64, .64); S.buffalo(t * 7, false, 0, (t % 3.3) > 3.15); x.restore(); };
A.elephant = t => { x.save(); x.translate(10, 60); x.scale(.52, .52); S.elephant(t * 7, false, 0, (t % 3.3) > 3.15); x.restore(); };
A.lion = t => { x.save(); x.translate(4, 54); x.scale(.66, .66); S.lion(t * 7, false, 0, (t % 3.3) > 3.15); x.restore(); };
A.rhino = t => { x.save(); x.translate(14, 54); x.scale(.66, .66); S.rhino(t * 7, false, 0, (t % 3.3) > 3.15); x.restore(); };

// word, colour, icon, friend (B/E/L/R), sfx
const L = [
  ['Alligator', '#40916c', 'alligator', null, 'bump'], ['Buffalo', '#5c4d55', 'buffalo', 'buffalo', 'bellow'], ['Cat', '#e76f51', 'cat', null, 'meow'], ['Dog', '#9c6644', 'dog', null, 'boing'],
  ['Elephant', '#6c7a89', 'elephant', 'elephant', 'trumpet'], ['Frog', '#2d9a3a', 'frog', null, 'boing'], ['Giraffe', '#e09f3e', 'giraffe', null], ['Hippo', '#7b6ba8', 'hippo', null, 'blub'],
  ['Iguana', '#52a447', 'iguana', null], ['Jellyfish', '#ff5d8f', 'jellyfish', null, 'blub'], ['Kangaroo', '#b5753c', 'kangaroo', null, 'boing'], ['Lion', '#d98a1c', 'lion', 'lion', 'roar'],
  ['Monkey', '#8a5a36', 'monkey', null, 'laugh'], ['Newt', '#ff7b00', 'newt', null], ['Octopus', '#9b5de5', 'octopus', null, 'blub'], ['Penguin', '#2b2d42', 'penguin', null],
  ['Quail', '#9c6644', 'quail', null, 'tweet'], ['Rhino', '#7d7468', 'rhino', 'rhino', 'snort'], ['Snake', '#2f9e6b', 'snake', null, 'psss:0.8'], ['Turtle', '#2a9d8f', 'turtle', null],
  ['Umbrellabird', '#3d405b', 'umbrellabird', null, 'tweet'], ['Vulture', '#9c6644', 'vulture', null], ['Whale', '#3a86ff', 'whale', null, 'splash'], ['X-ray fish', '#2f8fc7', 'xrayfish', null, 'blub'],
  ['Yak', '#6b4f3a', 'yak', null, 'moo'], ['Zebra', '#3a3a4a', 'zebra', null],
];
const NAME = { elephant: 'Ella', lion: 'Leo', rhino: 'Nico', buffalo: 'Boris' };

// ---------- learning UI ----------
function abcStrip(curIdx, k = 1) {
  if (process.env.THUMBBG || k <= 0) return;
  const w = 880, x0 = W / 2 - w / 2, step = w / 26;
  x.save(); x.globalAlpha *= k; x.fillStyle = 'rgba(255,255,255,.9)'; x.strokeStyle = INK; x.lineWidth = 3; rr(x0 - 10, 18, w + 20, 46, 22); x.fill(); x.stroke();
  x.textAlign = 'center'; x.textBaseline = 'middle';
  for (let i = 0; i < 26; i++) { const cx = x0 + step * (i + .5), on = i === curIdx, done = i < curIdx;
    if (on) circ(cx, 41, 18, '#ffd23f', INK, 2.5);
    x.font = C.FONT(on ? 28 : 21); x.fillStyle = on ? '#2a9d8f' : done ? INK : 'rgba(29,53,87,.4)'; x.fillText(ABC[i], cx, 43); }
  x.restore();
}
function letterBlock(Lt, cx, cy, s, col, k) {
  if (k <= 0) return;
  x.save(); x.globalAlpha *= clamp(k * 1.5); x.translate(cx, cy); const sc = s * (.6 + .4 * ease(k)); x.scale(sc, sc); x.rotate(.04);
  x.fillStyle = 'rgba(0,0,0,.15)'; x.beginPath(); x.ellipse(0, 112, 110, 12, 0, 0, 7); x.fill();
  x.fillStyle = col; x.strokeStyle = INK; x.lineWidth = 5; rr(-100, -100, 200, 200, 40); x.fill(); x.stroke();
  x.fillStyle = 'rgba(255,255,255,.93)'; x.beginPath(); x.arc(0, 0, 84, 0, 7); x.fill();
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = C.FONT(104); x.fillStyle = col; x.lineWidth = 6; x.strokeStyle = INK;
  x.strokeText(Lt + Lt.toLowerCase(), 0, 10); x.fillText(Lt + Lt.toLowerCase(), 0, 10);
  x.restore();
}
function pictureCard(name, cx, cy, k, t) {
  if (k <= 0) return;
  x.save(); x.globalAlpha *= clamp(k * 1.5); x.translate(cx, cy); const sc = .6 + .4 * ease(k); x.scale(sc, sc);
  x.fillStyle = '#fffaf0'; x.strokeStyle = INK; x.lineWidth = 4; rr(-95, -88, 190, 176, 30); x.fill(); x.stroke();
  x.save(); x.beginPath(); rr(-93, -86, 186, 172, 28); x.clip();
  x.fillStyle = '#e6f4d9'; x.fillRect(-95, 46, 190, 44);
  x.translate(0, Math.sin(t * 2) * 2); A[name](t); x.restore();
  x.restore();
}
function wordCard(txt, cx, cy, col, k) {
  if (k <= 0) return;
  x.save(); x.globalAlpha *= clamp(k * 1.5); x.font = C.FONT(42); const w = x.measureText(txt).width + 56;
  x.translate(cx, cy); const sc = .7 + .3 * ease(k); x.scale(sc, sc);
  x.fillStyle = '#fff'; x.strokeStyle = INK; x.lineWidth = 4; rr(-w / 2, -31, w, 62, 30); x.fill(); x.stroke();
  x.textAlign = 'left'; x.textBaseline = 'middle'; const lw = x.measureText(txt[0]).width; const px = -w / 2 + 28;
  x.fillStyle = col; x.fillText(txt[0], px, 3); x.fillStyle = INK; x.fillText(txt.slice(1), px + lw, 3);
  x.restore();
}
const hop = (t, sp = 6, h = 8) => Math.abs(Math.sin(t * sp)) * h;
const say = (c, who) => { const v = c.talk(who); return v > 0 ? (who === 'elephant' ? .12 + v * .04 : v * .45) : 0; };
function savanna(t) { S.setT(22); S.sky(); S.setT(t); S.land(); }
// friends standing at the sides; xs: optional override of x, lift: fn(k) → px
function friends(c, lift = () => 0, xs = {}) {
  ORDER.forEach((k, i) => { const [px, sc, fl] = FR[k]; const p = xs[k] !== undefined ? xs[k] : px;
    S.actor(ANI[k], p, !!(xs[k] !== undefined && xs.moving), say(c, k), sc, { flip: fl, blinkOff: i * .8, phase: i, lift: lift(k, i) }); });
}

// ---------- timeline ----------
const INTRO = 12, ABC_D = 26 * SEG, BY = 106;
const abcSays = [], abcSfx = [];
let nOther = 0;
L.forEach(([word, col, obj, fr, snd], i) => {
  const s = i * SEG;
  const who = fr || ORDER[nOther++ % 4];
  abcSfx.push([s + .5, `chime:${CHIME[i % 7]}`, .5]);
  if (snd) abcSfx.push([s + 1.3, snd, .35]);
  const line = fr ? `${ABC[i]} is for ${word}, like me!` : `${ABC[i]} is for ${word}!`;
  abcSays.push([who, line, s + 1.6, s + 4.5, FR[who][0], BY, 28]);
  if (fr) abcSfx.push([s + 1.8, 'cheer', .25]);
});
const featured = u => { const i = Math.min(25, Math.floor(u / SEG)), v = u - i * SEG; return [L[i][3], v]; };
const DY = process.env.THUMBBG ? 26 : 0;   // thumbnail background: cards a bit lower (title + subtitle go on top)

St.episode({
  title: ['Animal ABC', 72], sub: 'with The Big Four', accent: '#2a9d8f', cardBg: '#f1fbf4',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'animalabc', shift: 0 },
  shots: [
    // 1 – the Big Four walk in from both sides
    { d: INTRO, draw: (u, c) => {
        savanna(c.t);
        const k = ease(clamp((u - 1) / 4)), mv = u > 1 && u < 5;
        const xs = { elephant: lerp(-120, FR.elephant[0], k), lion: lerp(-60, FR.lion[0], k), rhino: lerp(1020, FR.rhino[0], k), buffalo: lerp(1080, FR.buffalo[0], k), moving: mv };
        friends(c, (kk, i) => u > 9 && u < 10.4 ? hop(c.t + i, 4, 6) : 0, xs);
        abcStrip(-1, clamp((u - 9.4) / .6));
        S.foreground();
      },
      says: [['lion', 'Hello! We are The Big Four!', 5.4, 8.6, FR.lion[0], BY + 40, 28], ['elephant', "Let's learn the animal ABC!", 8.9, 11.6, FR.elephant[0], BY + 40, 28]],
      big: [['A to Z!', 9.4, 11.6, 480, 250, 66, '#ffd23f']],
      sfx: [[1.2, 'rustle', .3], [5.4, 'roar', .3], [8.9, 'trumpet', .3], [9.4, 'arp', .4]] },

    // 2 – A to Z
    { d: ABC_D, draw: (u, c) => {
        const i = Math.min(25, Math.floor(u / SEG)), v = u - i * SEG, [word, col, obj, fr] = L[i];
        savanna(c.t);
        const out = clamp((SEG - .35 - v) / .35);
        friends(c, (k, j) => k === fr && v > 1.2 && v < 4.6 ? hop(c.t + j, 4.5, 14) : 0);
        if (fr && v > 1.2 && v < 4.6) C.sparkles(FR[fr][0], 380, c.t, 8, 70);
        S.foreground();
        abcStrip(i);
        letterBlock(ABC[i], 345, 248 + DY, .64, col, clamp((v - .4) / .45) * out);
        pictureCard(obj, 590, 236 + DY, clamp((v - .8) / .45) * out, c.t);
        wordCard(word, 468, 374 + DY, col, clamp((v - 1.1) / .4) * out);
      },
      says: abcSays, sfx: abcSfx },

    // 3 – recap: 26 tiles with letter + animal light up one by one
    { d: 18, draw: (u, c) => {
        savanna(c.t); friends(c); S.foreground();
        x.fillStyle = 'rgba(244,252,246,.95)'; x.fillRect(0, 0, W, 540);
        C.bigText('Animals A to Z!', W / 2, 66, win(u, .3, 17.6, .4), 48, '#2a9d8f');
        for (let i = 0; i < 26; i++) { const r = Math.floor(i / 9), cc = i % 9, n = r === 2 ? 8 : 9;
          const cx = W / 2 + (cc - (n - 1) / 2) * 96, cy = 164 + r * 104, t0 = 1.6 + i * .5, k = clamp((u - t0) / .3), on = u >= t0 && u < t0 + .5;
          x.save(); x.globalAlpha = .25 + .75 * k; x.translate(cx, cy); const sc = on ? 1.12 : 1; x.scale(sc, sc);
          if (on) circ(0, 0, 50, 'rgba(255,210,63,.55)');
          x.fillStyle = k > 0 ? '#ffffff' : '#dddddd'; x.strokeStyle = INK; x.lineWidth = 3; rr(-40, -44, 80, 88, 14); x.fill(); x.stroke();
          x.fillStyle = k > 0 ? L[i][1] : '#bbbbbb'; rr(-40, -44, 80, 30, 14); x.fill(); x.fillRect(-40, -26, 80, 12); rr(-40, -44, 80, 88, 14); x.stroke();
          x.font = C.FONT(26); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ABC[i], 0, -27);
          if (k > 0) { x.save(); x.beginPath(); x.rect(-38, -12, 76, 54); x.clip(); x.translate(0, 16); x.scale(.32, .32); A[L[i][2]](c.t); x.restore(); }
          x.restore(); }
        C.bigText('Well done!', W / 2, 488, win(u, 15.2, 17.8, .3), 46, '#ffd23f');
      },
      sfx: Array.from({ length: 26 }, (_, i) => [1.6 + i * .5, `chime:${CHIME[i % 7]}`, .32]).concat([[15.2, 'cheer', .4]]) },

    // 4 – goodbye: the friends hop and wave
    { d: 12, draw: (u, c) => {
        savanna(c.t);
        friends(c, (k, i) => u > 4.6 && u < 7.4 ? hop(c.t + i * .4, 4, 10) : 0);
        S.foreground();
      },
      says: [['rhino', 'Which animal do you like best?', .8, 4.2, FR.rhino[0], BY + 40, 28], ['buffalo', 'Bye bye! See you soon!', 4.6, 7.4, FR.buffalo[0], BY + 40, 28]],
      sfx: [[.8, 'snort', .3], [4.6, 'bellow', .3], [5, 'laugh', .3]] },
  ],
});
