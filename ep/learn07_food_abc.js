// Learning series – ABC #3: Food ABC Picnic with The Big Four (Leo the Lion, Ella the Elephant, Nico the Rhino, Boris the Buffalo).
// The friends have a picnic on a checked blanket on the savanna; per letter (5 s) the alphabet strip lights the current letter, a letter
// block (upper + lower case) pops up with a food picture card (every food has a friendly face) + word card with the coloured first letter,
// one of the friends says "A is for Apple!" and a little copy of the food lands on the picnic blanket, so the blanket slowly fills up.
// Apple, Banana, Carrot, Donut, Egg, Fig, Grapes, Honey, Ice cream, Jam, Kiwi, Lemon, Mango, Nuts, Orange, Pear, Quiche, Raspberry,
// Strawberry, Tomato, Udon, Vegetables, Waffle, Xigua (watermelon), Yogurt, Zucchini. Recap: 26 tiles light up.
// New music: foodabc_long (muted trumpet lead, electric-piano comp, upright bass, brushes – easy swing in B-flat).
const C = require('../lib/common'), S = require('../lib/safari');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, rr, circ, ell, INK } = C;

const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SEG = 5;
const CHIME = ['A#4', 'C5', 'D5', 'F5', 'G5', 'A#5', 'C6'];
const ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
// friends: x, scale, flip (true = faces right)
const FR = { elephant: [102, .58, true], lion: [232, .62, true], rhino: [738, .62, false], buffalo: [858, .6, false] };
const ORDER = ['elephant', 'lion', 'rhino', 'buffalo'];

const st = (lw = 3.5) => { x.lineWidth = lw; x.strokeStyle = INK; x.lineJoin = 'round'; x.lineCap = 'round'; };
const eye = (a, b, r = 5) => { circ(a, b, r, INK); circ(a + r * .3, b - r * .35, r * .36, '#fff'); };
const eyes = (ax, ay, bx, by, r = 5) => { eye(ax, ay, r); eye(bx, by, r); };
const blinkEyes = (ax, ay, bx, by, r, t, off = 0) => { if ((t + off) % 3.6 > 3.45) { st(3); [[ax, ay], [bx, by]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a - r, b); x.lineTo(a + r, b); x.stroke(); }); } else eyes(ax, ay, bx, by, r); };
const smile = (cx, cy, r, lw = 3) => { x.beginPath(); x.arc(cx, cy, r, .25, Math.PI - .25); st(lw); x.stroke(); };
const cheek = (a, b, r = 5) => circ(a, b, r, 'rgba(255,100,120,.4)');
const path = (pts, fill, lw = 3.5) => { x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); if (fill) { x.fillStyle = fill; x.fill(); } st(lw); x.stroke(); };

// ---------- original simple food icons with friendly faces (centred on 0,0, about 60 px radius) ----------
const face = (cx, cy, s, t, off = 0) => { blinkEyes(cx - 11 * s, cy, cx + 11 * s, cy, 4.5 * s, t, off); smile(cx, cy + 6 * s, 7 * s, 2.5); cheek(cx - 19 * s, cy + 7 * s, 4 * s); cheek(cx + 19 * s, cy + 7 * s, 4 * s); };
const leafAt = (a, b, rot, col = '#52b788', l = 22) => { x.save(); x.translate(a, b); x.rotate(rot); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(l * .5, -l * .45, l, 0); x.quadraticCurveTo(l * .5, l * .45, 0, 0); x.fillStyle = col; x.fill(); st(2.5); x.stroke(); x.restore(); };
const stem = (a, b, c2, d) => { x.strokeStyle = '#6b4226'; x.lineWidth = 5; x.lineCap = 'round'; x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo(a + 2, (b + d) / 2, c2, d); x.stroke(); };
const jar = (lid, fill, label, t) => {
  x.fillStyle = fill; st(); rr(-40, -34, 80, 86, 18); x.fill(); x.stroke();
  x.fillStyle = 'rgba(255,255,255,.35)'; rr(-30, -24, 12, 60, 6); x.fill();
  x.fillStyle = lid; st(); rr(-46, -54, 92, 24, 8); x.fill(); x.stroke();
  x.fillStyle = '#fff6e0'; st(2.5); rr(-28, 0, 56, 34, 8); x.fill(); x.stroke();
  face(0, 12, .8, t, label); };
const F = {
  apple(t) { stem(0, -40, 4, -56); leafAt(4, -50, -.5); x.beginPath(); x.moveTo(0, -36); x.bezierCurveTo(-30, -56, -66, -30, -54, 10); x.bezierCurveTo(-44, 50, -14, 58, 0, 46); x.bezierCurveTo(14, 58, 44, 50, 54, 10); x.bezierCurveTo(66, -30, 30, -56, 0, -36); x.fillStyle = '#e63946'; x.fill(); st(); x.stroke();
    x.fillStyle = 'rgba(255,255,255,.4)'; x.beginPath(); x.ellipse(-28, -16, 8, 14, .4, 0, 7); x.fill(); face(0, 4, 1, t); },
  banana(t) { x.beginPath(); x.moveTo(-58, -30); x.bezierCurveTo(-50, 40, 30, 60, 62, 6); x.bezierCurveTo(30, 34, -20, 22, -40, -36); x.closePath(); x.fillStyle = '#ffd23f'; x.fill(); st(); x.stroke();
    x.fillStyle = '#6b4226'; rr(-66, -40, 14, 12, 4); x.fill(); circ(62, 6, 4, '#6b4226'); face(-2, 14, .8, t, .5); },
  carrot(t) { [-.5, 0, .5].forEach(r => leafAt(0, -40, -Math.PI / 2 + r, '#52b788', 30));
    x.beginPath(); x.moveTo(-26, -40); x.quadraticCurveTo(-24, 10, 0, 60); x.quadraticCurveTo(24, 10, 26, -40); x.closePath(); x.fillStyle = '#ff8c1a'; x.fill(); st(); x.stroke();
    x.strokeStyle = '#d96c00'; x.lineWidth = 3; [[-14, 10, -4], [8, 26, 18], [-10, 36, -2]].forEach(([a, b, c2]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c2, b + 2); x.stroke(); }); face(0, -16, .8, t, 1); },
  donut(t) { circ(0, 0, 56, '#e9b872', INK, 3.5); x.beginPath(); for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI * 2, r = 46 + (i % 2) * 5; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fillStyle = '#ff8fab'; x.fill(); st(2.5); x.stroke();
    circ(0, 0, 16, '#e6f4d9', INK, 3); [['#3a86ff', -28, -22], ['#ffd23f', 24, -28], ['#52b788', 34, 14], ['#fff', -34, 18], ['#9b5de5', 4, 34]].forEach(([c2, a, b]) => { x.save(); x.translate(a, b); x.rotate(a); x.fillStyle = c2; rr(-6, -2.5, 12, 5, 2.5); x.fill(); x.restore(); });
    face(0, -30, .6, t, 1.4); },
  egg(t) { x.beginPath(); x.ellipse(0, 4, 44, 56, 0, 0, 7); x.fillStyle = '#fff8ec'; x.fill(); st(); x.stroke(); x.fillStyle = 'rgba(0,0,0,.06)'; x.beginPath(); x.ellipse(12, 14, 26, 40, 0, 0, 7); x.fill(); face(0, 6, 1, t, .3); },
  fig(t) { stem(0, -46, 2, -58); x.beginPath(); x.moveTo(0, -48); x.bezierCurveTo(-12, -30, -54, -6, -46, 26); x.bezierCurveTo(-38, 56, 38, 56, 46, 26); x.bezierCurveTo(54, -6, 12, -30, 0, -48); x.fillStyle = '#7b2d8e'; x.fill(); st(); x.stroke();
    x.fillStyle = 'rgba(255,255,255,.3)'; x.beginPath(); x.ellipse(-22, 4, 6, 12, .3, 0, 7); x.fill(); face(0, 18, .9, t, 2.1); },
  grapes(t) { stem(0, -50, 4, -64); leafAt(4, -56, -.3); const P = [[-24, -34], [0, -38], [24, -34], [-36, -10], [-12, -12], [12, -12], [36, -10], [-24, 14], [0, 12], [24, 14], [-12, 36], [12, 36], [0, 56]];
    P.forEach(([a, b]) => circ(a, b, 15, '#8e5bd6', INK, 2.5)); P.forEach(([a, b]) => circ(a - 5, b - 5, 3.5, 'rgba(255,255,255,.5)')); face(0, 10, .8, t, .8); },
  honey(t) { jar('#e9a800', '#ffb627', .9, t); x.strokeStyle = '#ffb627'; x.lineWidth = 8; x.lineCap = 'round'; x.beginPath(); x.moveTo(-30, -30); x.quadraticCurveTo(-34, -16, -30, -6); x.stroke(); },
  icecream(t) { x.beginPath(); x.moveTo(-34, -4); x.lineTo(0, 62); x.lineTo(34, -4); x.closePath(); x.fillStyle = '#e9b872'; x.fill(); st(); x.stroke();
    x.save(); x.clip(); x.strokeStyle = '#c98a4b'; x.lineWidth = 2.5; for (let i = -4; i < 5; i++) { x.beginPath(); x.moveTo(i * 14 - 30, -10); x.lineTo(i * 14 + 30, 70); x.moveTo(i * 14 + 30, -10); x.lineTo(i * 14 - 30, 70); x.stroke(); } x.restore();
    circ(0, -26, 34, '#ffc8dd', INK, 3.5); x.fillStyle = '#ffc8dd'; x.beginPath(); for (let i = 0; i <= 8; i++) x.lineTo(-38 + i * 9.5, -6 + (i % 2) * 8); x.lineTo(38, -14); x.lineTo(-38, -14); x.fill(); circ(4, -64, 8, '#e63946', INK, 2.5); face(0, -26, .8, t, 1.6); },
  jam(t) { jar('#e63946', '#d62850', 2.4, t); x.fillStyle = '#fff'; [[-36, -42], [-10, -46], [14, -42], [38, -46]].forEach(([a, b]) => circ(a, b, 3.5, '#fff')); },
  kiwi(t) { circ(0, 0, 54, '#8a5a36', INK, 3.5); circ(0, 0, 46, '#7cc46a'); circ(0, 0, 18, '#f3f9d2');
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; x.fillStyle = INK; x.beginPath(); x.ellipse(Math.cos(a) * 26, Math.sin(a) * 26, 2.5, 5, a + Math.PI / 2, 0, 7); x.fill(); } face(0, -4, .55, t, .6); },
  lemon(t) { x.beginPath(); x.ellipse(0, 4, 56, 40, 0, 0, 7); x.fillStyle = '#fff04d'; x.fill(); st(); x.stroke(); ell(-58, 4, 8, 8, '#fff04d', INK, 3); ell(58, 4, 8, 8, '#fff04d', INK, 3); leafAt(10, -34, -.5); face(0, 6, 1, t, 2.8); },
  mango(t) { leafAt(14, -44, -.2, '#52b788', 30); x.beginPath(); x.moveTo(10, -46); x.bezierCurveTo(-50, -54, -66, 30, -20, 48); x.bezierCurveTo(30, 66, 64, 20, 44, -16); x.bezierCurveTo(36, -34, 26, -44, 10, -46); x.closePath();
    const g = x.createLinearGradient(-50, 40, 50, -40); g.addColorStop(0, '#ff7b00'); g.addColorStop(.6, '#ffb627'); g.addColorStop(1, '#9ccf63'); x.fillStyle = g; x.fill(); st(); x.stroke(); face(0, 6, 1, t, .9); },
  nuts(t) { [[-26, 14, -.4], [24, 18, .5], [0, -18, .1]].forEach(([a, b, r], i) => { x.save(); x.translate(a, b); x.rotate(r);
      x.beginPath(); x.moveTo(0, -30); x.bezierCurveTo(-22, -30, -24, -6, -12, 0); x.bezierCurveTo(-24, 6, -22, 30, 0, 30); x.bezierCurveTo(22, 30, 24, 6, 12, 0); x.bezierCurveTo(24, -6, 22, -30, 0, -30); x.fillStyle = '#e0b07a'; x.fill(); st(3); x.stroke();
      x.strokeStyle = '#b5833f'; x.lineWidth = 2; [-18, -8, 8, 18].forEach(b2 => { x.beginPath(); x.moveTo(-8, b2); x.lineTo(8, b2); x.stroke(); }); x.restore(); }); face(0, -18, .6, t, 1.2); },
  orange(t) { circ(0, 4, 52, '#ff9f1c', INK, 3.5); x.fillStyle = '#e8870a'; for (let i = 0; i < 9; i++) { const a = hashA(i) * 6.28, r = 20 + hashA(i + 4) * 26; circ(Math.cos(a) * r, 4 + Math.sin(a) * r, 2, '#e8870a'); }
    stem(0, -48, 2, -56); leafAt(2, -52, -.4); face(0, 6, 1, t, 3.2); },
  pear(t) { stem(0, -50, 4, -64); leafAt(4, -58, -.5); x.beginPath(); x.moveTo(0, -52); x.bezierCurveTo(-18, -52, -22, -24, -26, -12); x.bezierCurveTo(-58, 10, -48, 58, 0, 58); x.bezierCurveTo(48, 58, 58, 10, 26, -12); x.bezierCurveTo(22, -24, 18, -52, 0, -52); x.fillStyle = '#b5d65a'; x.fill(); st(); x.stroke();
    x.fillStyle = 'rgba(255,255,255,.35)'; x.beginPath(); x.ellipse(-22, 18, 7, 13, .2, 0, 7); x.fill(); face(0, 22, .9, t, 1.9); },
  quiche(t) { ell(0, 18, 62, 30, '#d9a066', INK, 3.5); ell(0, 8, 62, 30, '#e9b872', INK, 3.5); ell(0, 6, 50, 22, '#ffd966', INK, 2.5);
    [[-24, 2, '#52b788'], [14, -2, '#e63946'], [28, 10, '#52b788'], [-6, 14, '#e63946']].forEach(([a, b, c2]) => circ(a, b, 5, c2)); x.strokeStyle = '#c98a4b'; x.lineWidth = 2; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; x.beginPath(); x.moveTo(Math.cos(a) * 54, 8 + Math.sin(a) * 26); x.lineTo(Math.cos(a) * 60, 8 + Math.sin(a) * 29); x.stroke(); }
    face(0, -36, .7, t, 2.6); },
  raspberry(t) { leafAt(0, -40, -Math.PI / 2 - .5, '#52b788', 20); leafAt(0, -40, -Math.PI / 2 + .5, '#52b788', 20);
    const P = []; for (let r = 0; r < 5; r++) { const n = [3, 4, 5, 4, 3][r]; for (let i = 0; i < n; i++) P.push([(i - (n - 1) / 2) * 18, -26 + r * 16]); }
    P.forEach(([a, b]) => circ(a, b, 11, '#e5383b', INK, 2.5)); P.forEach(([a, b]) => circ(a - 3, b - 3, 2.5, 'rgba(255,255,255,.55)')); face(0, 2, .8, t, .4); },
  strawberry(t) { x.beginPath(); x.moveTo(0, 56); x.bezierCurveTo(-30, 30, -56, -10, -40, -30); x.bezierCurveTo(-24, -46, 24, -46, 40, -30); x.bezierCurveTo(56, -10, 30, 30, 0, 56); x.fillStyle = '#ff4d6d'; x.fill(); st(); x.stroke();
    [[-24, -10], [20, -14], [-30, 14], [28, 10], [-8, 30], [12, 32], [0, -24]].forEach(([a, b]) => { x.fillStyle = '#ffe066'; x.beginPath(); x.ellipse(a, b, 2.5, 4, 0, 0, 7); x.fill(); });
    for (let i = 0; i < 5; i++) leafAt(0, -38, -Math.PI / 2 + (i - 2) * .55, '#52b788', 22); face(0, 4, .9, t, 1.1); },
  tomato(t) { ell(0, 6, 56, 48, '#e63946', INK, 3.5); x.fillStyle = 'rgba(255,255,255,.35)'; x.beginPath(); x.ellipse(-26, -12, 8, 14, .5, 0, 7); x.fill();
    for (let i = 0; i < 5; i++) leafAt(0, -40, -Math.PI / 2 + (i - 2) * .9, '#52b788', 22); face(0, 10, 1, t, 2.2); },
  udon(t) { x.strokeStyle = '#fff1c1'; x.lineWidth = 7; x.lineCap = 'round'; for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(-40 + i * 16, 4); x.quadraticCurveTo(-30 + i * 14, -30 - (i % 2) * 10, -20 + i * 12, -2); x.stroke(); }
    [[-30, -10, '#52b788'], [26, -6, '#ff8fab']].forEach(([a, b, c2]) => circ(a, b, 8, c2, INK, 2));
    x.beginPath(); x.moveTo(-60, -2); x.lineTo(60, -2); x.bezierCurveTo(58, 52, -58, 52, -60, -2); x.fillStyle = '#4ea8de'; x.fill(); st(); x.stroke(); x.fillStyle = '#fff'; [-30, 0, 30].forEach(a => circ(a, 18, 5, 'rgba(255,255,255,.7)'));
    x.strokeStyle = '#a0612b'; x.lineWidth = 5; x.beginPath(); x.moveTo(20, -50); x.lineTo(56, 6); x.moveTo(32, -54); x.lineTo(62, 2); x.stroke(); face(0, 24, .6, t, .7); },
  vegetables(t) { x.save(); x.translate(18, 0); x.rotate(.15);
      x.beginPath(); x.moveTo(-10, 6); x.lineTo(-14, 56); x.lineTo(14, 56); x.lineTo(10, 6); x.closePath(); x.fillStyle = '#9ccf63'; x.fill(); st(3); x.stroke();
      [[-24, -6, 20], [0, -20, 24], [24, -6, 20], [-12, 6, 16], [12, 6, 16]].forEach(([a, b, r]) => circ(a, b, r, '#40916c', INK, 3)); face(0, -6, .7, t, .5); x.restore();
    x.save(); x.translate(-40, 16); x.rotate(-.5); x.beginPath(); x.moveTo(-10, -30); x.quadraticCurveTo(-9, 10, 0, 36); x.quadraticCurveTo(9, 10, 10, -30); x.closePath(); x.fillStyle = '#ff8c1a'; x.fill(); st(3); x.stroke(); leafAt(0, -30, -Math.PI / 2, '#52b788', 18); x.restore(); },
  waffle(t) { x.fillStyle = '#f2c46d'; st(); rr(-52, -44, 104, 92, 18); x.fill(); x.stroke();
    x.fillStyle = '#d9a03f'; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { rr(-42 + i * 22, -34 + j * 20, 16, 14, 4); x.fill(); }
    x.fillStyle = '#ff4d6d'; x.beginPath(); x.moveTo(-6, -50); x.bezierCurveTo(-20, -66, -40, -48, -6, -30); x.bezierCurveTo(28, -48, 8, -66, -6, -50); x.fill(); st(2.5); x.stroke(); face(0, 18, .8, t, 2.9); },
  xigua(t) { x.beginPath(); x.moveTo(-60, -20); x.arc(0, -20, 60, 0, Math.PI); x.closePath(); x.fillStyle = '#52b788'; x.fill(); st(); x.stroke();
    x.beginPath(); x.moveTo(-52, -20); x.arc(0, -20, 52, 0, Math.PI); x.closePath(); x.fillStyle = '#fff6e0'; x.fill();
    x.beginPath(); x.moveTo(-46, -20); x.arc(0, -20, 46, 0, Math.PI); x.closePath(); x.fillStyle = '#ff5d73'; x.fill(); st(2.5); x.stroke();
    [[-28, 0], [-8, 12], [14, 4], [30, -4], [0, -6]].forEach(([a, b]) => { x.fillStyle = INK; x.beginPath(); x.ellipse(a, b, 2.5, 4.5, 0, 0, 7); x.fill(); }); face(0, -2, .7, t, 1.5); },
  yogurt(t) { x.beginPath(); x.moveTo(-42, -30); x.lineTo(-32, 52); x.lineTo(32, 52); x.lineTo(42, -30); x.closePath(); x.fillStyle = '#ffffff'; x.fill(); st(); x.stroke();
    x.fillStyle = '#ffc8dd'; x.fillRect(-38, -6, 76, 26); st(2.5); x.strokeRect(-38, -6, 76, 26);
    x.fillStyle = '#9b5de5'; rr(-48, -42, 96, 14, 6); x.fill(); st(3); x.stroke(); circ(-14, 6, 5, '#e63946'); circ(16, 8, 5, '#e63946'); face(0, 34, .7, t, .2); },
  zucchini(t) { x.save(); x.rotate(-.35); x.scale(.82, .82); x.beginPath(); x.moveTo(-60, -4); x.bezierCurveTo(-60, -24, 50, -26, 58, -10); x.bezierCurveTo(64, 4, 50, 18, 30, 18); x.lineTo(-48, 16); x.bezierCurveTo(-60, 14, -62, 6, -60, -4); x.fillStyle = '#2d6a4f'; x.fill(); st(); x.stroke();
    x.strokeStyle = '#74c69d'; x.lineWidth = 3; [-6, 4].forEach(b => { x.beginPath(); x.moveTo(-40, b); x.lineTo(40, b - 2); x.stroke(); });
    x.fillStyle = '#ffd23f'; x.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, r = i % 2 ? 6 : 13; x.lineTo(-66 + Math.cos(a) * r, -2 + Math.sin(a) * r); } x.closePath(); x.fill(); st(2); x.stroke();
    x.fillStyle = '#6b4226'; rr(56, -14, 12, 14, 4); x.fill(); face(6, -6, .7, t, 2.4); x.restore(); },
};
const hashA = n => { const s = Math.sin(n * 91.7 + 13.3) * 43758.5453; return s - Math.floor(s); };

// word, colour, icon, friend (B/E/L/R), sfx
const L = [
  ['Apple', '#e63946', 'apple', 'munch'], ['Banana', '#e0a800', 'banana'], ['Carrot', '#ff7b00', 'carrot', 'crack'], ['Donut', '#ff5d8f', 'donut'],
  ['Egg', '#c98a4b', 'egg', 'boing'], ['Fig', '#7b2d8e', 'fig'], ['Grapes', '#8e5bd6', 'grapes'], ['Honey', '#e09f3e', 'honey', 'buzz:1.0'],
  ['Ice cream', '#ff5d8f', 'icecream'], ['Jam', '#d62850', 'jam'], ['Kiwi', '#52a447', 'kiwi'], ['Lemon', '#d4b800', 'lemon'],
  ['Mango', '#ff7b00', 'mango', 'munch'], ['Nuts', '#a0612b', 'nuts', 'crack'], ['Orange', '#ff9f1c', 'orange'], ['Pear', '#7fa83a', 'pear'],
  ['Quiche', '#c98a4b', 'quiche'], ['Raspberry', '#e5383b', 'raspberry'], ['Strawberry', '#ff4d6d', 'strawberry', 'munch'], ['Tomato', '#e63946', 'tomato'],
  ['Udon', '#2f8fc7', 'udon'], ['Vegetables', '#40916c', 'vegetables', 'crack'], ['Waffle', '#d9a03f', 'waffle'], ['Xigua', '#ff5d73', 'xigua'],
  ['Yogurt', '#9b5de5', 'yogurt'], ['Zucchini', '#2d6a4f', 'zucchini', 'crack'],
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
  x.translate(0, Math.sin(t * 2) * 2); F[name](t); x.restore();
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

// ---------- picnic blanket: a little copy of each food lands on it ----------
function blanket(t, n, landK = 1) {
  if (process.env.THUMBBG) n = 26;
  x.save();
  x.beginPath(); x.moveTo(312, 452); x.lineTo(648, 452); x.lineTo(700, 528); x.lineTo(260, 528); x.closePath();
  x.fillStyle = '#ffffff'; x.fill(); x.save(); x.clip();
  x.fillStyle = 'rgba(230,57,70,.85)';
  for (let i = 0; i < 12; i++) { const a = 260 + i * 40; x.beginPath(); x.moveTo(a + 26 + i * -4.7 + 52 * 0, 452); x.lineTo(a + 26 - 4.7 * i + 20, 452); x.lineTo(a + 20, 528); x.lineTo(a, 528); x.closePath(); x.fill(); }
  [452, 477, 503].forEach(y => { x.fillStyle = 'rgba(230,57,70,.55)'; x.fillRect(250, y, 460, 12); });
  x.restore();
  x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.moveTo(312, 452); x.lineTo(648, 452); x.lineTo(700, 528); x.lineTo(260, 528); x.closePath(); x.stroke();
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / 13), cc = i % 13, cx = 340 + cc * 23.5 + r * -22 + (r ? 21 : 0) * 1, cy = 474 + r * 34;
    const k = i === n - 1 ? landK : 1; if (k <= 0) continue;
    x.save(); x.translate(cx, cy - (1 - ease(k)) * 60); x.scale(.17 + r * .02, .17 + r * .02); F[L[i][2]](t + i); x.restore();
  }
  x.restore();
}
function basket(px, py) {
  x.fillStyle = '#c98a4b'; x.strokeStyle = INK; x.lineWidth = 3; rr(px - 34, py - 30, 68, 34, 8); x.fill(); x.stroke();
  x.strokeStyle = '#a0612b'; x.lineWidth = 2; for (let i = 1; i < 5; i++) { x.beginPath(); x.moveTo(px - 34 + i * 13.6, py - 28); x.lineTo(px - 34 + i * 13.6, py + 2); x.stroke(); }
  x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.arc(px, py - 30, 26, Math.PI, 0); x.stroke();
}

// ---------- timeline ----------
const INTRO = 12, ABC_D = 26 * SEG, BY = 106;
const abcSays = [], abcSfx = [];
const YUM = new Set([0, 3, 8, 12, 18, 22, 25]);
L.forEach(([word, col, obj, snd], i) => {
  const s = i * SEG, who = ORDER[i % 4];
  abcSfx.push([s + .5, `chime:${CHIME[i % 7]}`, .5]);
  if (snd) abcSfx.push([s + 1.3, snd, .3]);
  abcSfx.push([s + 3.6, 'pop', .25, (340 + (i % 13) * 23.5 - 480) / 500]);
  abcSays.push([who, YUM.has(i) ? `${ABC[i]} is for ${word}! Yum!` : `${ABC[i]} is for ${word}!`, s + 1.6, s + 4.5, FR[who][0], BY, 28]);
});
const DY = process.env.THUMBBG ? 26 : 0;   // thumbnail background: cards a bit lower (title + subtitle go on top)

St.episode({
  title: ['Food ABC Picnic', 72], sub: 'with The Big Four', accent: '#e63946', cardBg: '#fff6f0',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'foodabc', shift: 0 },
  shots: [
    // 1 – the Big Four walk in; Ella brings the picnic basket and they spread the blanket
    { d: INTRO, draw: (u, c) => {
        savanna(c.t);
        const k = ease(clamp((u - 1) / 4)), mv = u > 1 && u < 5;
        const xs = { elephant: lerp(-120, FR.elephant[0], k), lion: lerp(-60, FR.lion[0], k), rhino: lerp(1020, FR.rhino[0], k), buffalo: lerp(1080, FR.buffalo[0], k), moving: mv };
        friends(c, (kk, i) => u > 9 && u < 10.4 ? hop(c.t + i, 4, 6) : 0, xs);
        S.foreground();
        const bk = ease(clamp((u - 5) / 1.2));
        if (bk > 0) { x.save(); x.globalAlpha = bk; x.translate(480, 490); x.scale(1, bk); x.translate(-480, -490); blanket(c.t, 0); x.restore(); }
        basket(lerp(FR.elephant[0] + 40, 196, ease(clamp((u - 4.6) / 1.2))), 512);
        abcStrip(-1, clamp((u - 9.4) / .6));
      },
      says: [['lion', "It's picnic time!", 5.4, 8.6, FR.lion[0], BY + 40, 28], ['elephant', "Let's learn the food ABC!", 8.9, 11.6, FR.elephant[0], BY + 40, 28]],
      big: [['A to Z!', 9.4, 11.6, 480, 250, 66, '#ffd23f']],
      sfx: [[1.2, 'rustle', .3], [5.0, 'swish', .35], [5.4, 'roar', .3], [8.9, 'trumpet', .3], [9.4, 'arp', .4]] },

    // 2 – A to Z
    { d: ABC_D, draw: (u, c) => {
        const i = Math.min(25, Math.floor(u / SEG)), v = u - i * SEG, [word, col, obj] = L[i], who = ORDER[i % 4];
        savanna(c.t);
        const out = clamp((SEG - .35 - v) / .35);
        friends(c, (k, j) => k === who && v > 3.4 && v < 4.4 ? hop(c.t + j, 4.5, 8) : 0);
        S.foreground();
        blanket(c.t, i + (v > 3.4 ? 1 : 0), clamp((v - 3.4) / .4)); basket(196, 512);
        abcStrip(i);
        letterBlock(ABC[i], 345, 248 + DY, .64, col, clamp((v - .4) / .45) * out);
        pictureCard(obj, 590, 236 + DY, clamp((v - .8) / .45) * out, c.t);
        wordCard(word, 468, 374 + DY, col, clamp((v - 1.1) / .4) * out);
      },
      says: abcSays, sfx: abcSfx },

    // 3 – recap: 26 tiles with letter + food light up one by one
    { d: 18, draw: (u, c) => {
        savanna(c.t); friends(c); S.foreground();
        x.fillStyle = 'rgba(255,248,242,.95)'; x.fillRect(0, 0, W, 540);
        C.bigText('Food from A to Z!', W / 2, 66, win(u, .3, 17.6, .4), 48, '#e63946');
        for (let i = 0; i < 26; i++) { const r = Math.floor(i / 9), cc = i % 9, n = r === 2 ? 8 : 9;
          const cx = W / 2 + (cc - (n - 1) / 2) * 96, cy = 164 + r * 104, t0 = 1.6 + i * .5, k = clamp((u - t0) / .3), on = u >= t0 && u < t0 + .5;
          x.save(); x.globalAlpha = .25 + .75 * k; x.translate(cx, cy); const sc = on ? 1.12 : 1; x.scale(sc, sc);
          if (on) circ(0, 0, 50, 'rgba(255,210,63,.55)');
          x.fillStyle = k > 0 ? '#ffffff' : '#dddddd'; x.strokeStyle = INK; x.lineWidth = 3; rr(-40, -44, 80, 88, 14); x.fill(); x.stroke();
          x.fillStyle = k > 0 ? L[i][1] : '#bbbbbb'; rr(-40, -44, 80, 30, 14); x.fill(); x.fillRect(-40, -26, 80, 12); rr(-40, -44, 80, 88, 14); x.stroke();
          x.font = C.FONT(26); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ABC[i], 0, -27);
          if (k > 0) { x.save(); x.beginPath(); x.rect(-38, -12, 76, 54); x.clip(); x.translate(0, 15); x.scale(.36, .36); F[L[i][2]](c.t); x.restore(); }
          x.restore(); }
        C.bigText('Well done!', W / 2, 488, win(u, 15.2, 17.8, .3), 46, '#ffd23f');
      },
      sfx: Array.from({ length: 26 }, (_, i) => [1.6 + i * .5, `chime:${CHIME[i % 7]}`, .32]).concat([[15.2, 'cheer', .4]]) },

    // 4 – goodbye: the friends hop and wave over the full picnic blanket
    { d: 12, draw: (u, c) => {
        savanna(c.t);
        friends(c, (k, i) => u > 4.6 && u < 7.4 ? hop(c.t + i * .4, 4, 10) : 0);
        S.foreground(); blanket(c.t, 26); basket(196, 512);
      },
      says: [['rhino', 'Which food do you like best?', .8, 4.2, FR.rhino[0], BY + 40, 28], ['buffalo', 'Bye bye! See you soon!', 4.6, 7.4, FR.buffalo[0], BY + 40, 28]],
      sfx: [[.8, 'snort', .3], [4.6, 'bellow', .3], [5, 'laugh', .3]] },
  ],
});
