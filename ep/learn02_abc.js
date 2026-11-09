// Learning series – ABC #1: Toet's ABC Drive (Little Truck Toet drives along the road and meets A to Z).
// Per letter (5 s): alphabet strip at the top lights the current letter, a wooden letter block (upper + lower case) pops up,
// a picture card with the object + a word card with the coloured first letter, Toet says "A is for Apple!", soft chime.
// Recap: all 26 blocks light up one by one, "Well done!", Toet drives home.
// New music: abc_long (toy piano lead, mandolin tremolo chords, marimba bass, finger snaps + shaker; G major 4/4).
const C = require('../lib/common'), T = require('../lib/toet');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, rr, circ, ell, hash, INK } = C;

const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SEG = 5, BX = 210, SPEED = 70;            // seconds per letter, Toet's screen x, calm driving speed (world px/s)
const CHIME = ['C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'D6'];

// ---------- original simple objects (centred on 0,0, about 60 px radius) ----------
const st = (lw = 3.5) => { x.lineWidth = lw; x.strokeStyle = INK; x.lineJoin = 'round'; x.lineCap = 'round'; };
const eyes = (ax, ay, bx2, by2, r = 5) => { [[ax, ay], [bx2, by2]].forEach(([a, b]) => { circ(a, b, r, INK); circ(a + r * .3, b - r * .35, r * .36, '#fff'); }); };
const smile = (cx, cy, r) => { x.beginPath(); x.arc(cx, cy, r, .25, Math.PI - .25); st(3); x.stroke(); };
const O = {
  apple() { circ(-14, 4, 40, '#e63946', INK, 3.5); circ(14, 4, 40, '#e63946'); x.beginPath(); x.arc(14, 4, 40, -1.4, 1.6); st(); x.stroke();
    x.strokeStyle = '#6b4f3a'; x.lineWidth = 6; x.beginPath(); x.moveTo(0, -32); x.lineTo(4, -56); x.stroke(); ell(22, -50, 16, 8, '#3fbf6e', INK, 2.5); circ(-24, -10, 8, 'rgba(255,255,255,.6)'); },
  ball() { circ(0, 0, 50, '#4cc9f0', INK, 3.5); x.save(); x.beginPath(); x.arc(0, 0, 50, 0, 7); x.clip(); x.fillStyle = '#ffd23f'; x.fillRect(-60, -14, 120, 28); circ(0, 0, 12, '#ff5d8f'); x.restore();
    x.beginPath(); x.arc(0, 0, 50, 0, 7); st(); x.stroke(); circ(-20, -22, 8, 'rgba(255,255,255,.7)'); },
  cow() { x.save(); x.scale(.82, .82); x.translate(-8, 10);
    [-44, -24, 28, 46].forEach(a => { x.fillStyle = '#fff'; st(3); rr(a - 8, 0, 16, 46, 6); x.fill(); x.stroke(); x.fillStyle = INK; x.fillRect(a - 8, 38, 16, 8); });
    ell(0, -6, 68, 36, '#fff', INK, 3.5); ell(-20, -14, 18, 14, INK); ell(26, 4, 14, 11, INK); ell(10, -30, 10, 7, INK);
    x.translate(64, -34); ell(-26, -14, 12, 7, '#fff', INK, 3); ell(28, -18, 12, 7, '#fff', INK, 3); ell(0, 0, 30, 28, '#fff', INK, 3.5); ell(8, 16, 22, 14, '#ffb3c6', INK, 3); circ(2, 16, 3, INK); circ(14, 16, 3, INK);
    eyes(-6, -6, 12, -6); x.restore(); },
  duck() { x.save(); x.translate(-8, 14);
    x.beginPath(); x.moveTo(-60, 0); x.quadraticCurveTo(-70, -40, -40, -30); x.quadraticCurveTo(0, -40, 40, -20); x.quadraticCurveTo(60, 30, 0, 36); x.quadraticCurveTo(-56, 36, -60, 0); x.fillStyle = '#ffd23f'; x.fill(); st(); x.stroke();
    x.beginPath(); x.moveTo(-20, 0); x.quadraticCurveTo(4, 20, 24, -2); st(3); x.stroke();
    circ(36, -42, 26, '#ffd23f', INK, 3.5); x.beginPath(); x.moveTo(58, -46); x.quadraticCurveTo(80, -42, 78, -34); x.quadraticCurveTo(66, -30, 56, -34); x.closePath(); x.fillStyle = '#ff9f1c'; x.fill(); x.stroke();
    eyes(42, -50, 42, -50, 5); x.restore(); },
  egg() { ell(0, 6, 38, 50, '#fff6e0', INK, 3.5); circ(-12, -14, 7, 'rgba(255,255,255,.95)'); ell(0, 58, 44, 7, 'rgba(0,0,0,.12)'); },
  fish() { x.beginPath(); x.moveTo(40, 0); x.lineTo(70, -26); x.lineTo(70, 26); x.closePath(); x.fillStyle = '#ff9f1c'; x.fill(); st(); x.stroke();
    ell(-6, 0, 52, 34, '#ffb627', INK, 3.5); x.beginPath(); x.moveTo(6, -32); x.quadraticCurveTo(20, -50, 30, -26); st(3); x.fillStyle = '#ff9f1c'; x.fill(); x.stroke();
    x.beginPath(); x.arc(-4, 0, 22, -1.2, 1.2); st(2.5); x.stroke(); eyes(-32, -8, -32, -8, 6); smile(-38, 8, 7); },
  grapes() { x.strokeStyle = '#6b4f3a'; x.lineWidth = 6; x.beginPath(); x.moveTo(0, -46); x.lineTo(4, -64); x.stroke(); ell(20, -56, 16, 8, '#3fbf6e', INK, 2.5);
    [[-24, -30], [0, -34], [24, -30], [-12, -8], [12, -8], [-26, 12], [0, 14], [26, 12], [-12, 34], [12, 34], [0, 54]].forEach(([a, b]) => { circ(a, b, 15, '#9b5de5', INK, 3); circ(a - 5, b - 5, 4, 'rgba(255,255,255,.55)'); }); },
  hat() { ell(0, 30, 70, 16, '#e63946', INK, 3.5); x.beginPath(); x.moveTo(-40, 30); x.quadraticCurveTo(-44, -40, 0, -42); x.quadraticCurveTo(44, -40, 40, 30); x.closePath(); x.fillStyle = '#e63946'; x.fill(); st(); x.stroke();
    x.fillStyle = '#ffd23f'; x.fillRect(-41, 8, 82, 14); x.beginPath(); x.moveTo(-41, 8); x.lineTo(41, 8); x.moveTo(-41, 22); x.lineTo(41, 22); st(2.5); x.stroke(); circ(0, -46, 10, '#fff', INK, 3); },
  icecream() { x.beginPath(); x.moveTo(-30, 0); x.lineTo(0, 66); x.lineTo(30, 0); x.closePath(); x.fillStyle = '#e9b872'; x.fill(); st(); x.stroke();
    x.save(); x.clip(); x.strokeStyle = 'rgba(120,70,20,.5)'; x.lineWidth = 2; for (let i = -4; i <= 4; i++) { x.beginPath(); x.moveTo(i * 14 - 40, 0); x.lineTo(i * 14 + 40, 70); x.moveTo(i * 14 + 40, 0); x.lineTo(i * 14 - 40, 70); x.stroke(); } x.restore();
    circ(0, -40, 26, '#ff8fab', INK, 3.5); circ(-18, -8, 22, '#fff1c1', INK, 3.5); circ(18, -8, 22, '#9de0c4', INK, 3.5); circ(4, -68, 8, '#e63946', INK, 3); },
  juice() { x.strokeStyle = '#ff5d8f'; x.lineWidth = 7; x.beginPath(); x.moveTo(10, -44); x.lineTo(22, -76); x.lineTo(36, -76); x.stroke();
    x.beginPath(); x.moveTo(-34, -48); x.lineTo(34, -48); x.lineTo(26, 54); x.lineTo(-26, 54); x.closePath(); x.fillStyle = 'rgba(220,240,255,.9)'; x.fill(); st(); x.stroke();
    x.beginPath(); x.moveTo(-31, -24); x.lineTo(31, -24); x.lineTo(25, 50); x.lineTo(-25, 50); x.closePath(); x.fillStyle = '#ff9f1c'; x.fill();
    circ(36, -48, 16, '#ffd23f', INK, 3); x.beginPath(); x.moveTo(-34, -48); x.lineTo(34, -48); x.lineTo(26, 54); x.lineTo(-26, 54); x.closePath(); st(); x.stroke(); circ(-14, 0, 5, 'rgba(255,255,255,.7)'); },
  kite() { x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.moveTo(0, 48); x.bezierCurveTo(-20, 70, 20, 80, 0, 100); x.stroke();
    [[-8, 66], [8, 84]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(a - 10, b - 6); x.lineTo(a - 10, b + 6); x.closePath(); x.fillStyle = '#ffd23f'; x.fill(); x.stroke(); });
    const q = [[0, -56], [40, -6], [0, 48], [-40, -6]], cols = ['#3a86ff', '#e63946', '#3a86ff', '#e63946'];
    for (let i = 0; i < 4; i++) { const a = q[i], b = q[(i + 1) % 4]; x.beginPath(); x.moveTo(0, -6); x.lineTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.closePath(); x.fillStyle = cols[i]; x.fill(); }
    x.beginPath(); q.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); st(); x.stroke(); x.beginPath(); x.moveTo(0, -56); x.lineTo(0, 48); x.moveTo(-40, -6); x.lineTo(40, -6); st(2.5); x.stroke(); },
  leaf() { x.save(); x.rotate(-.5); x.beginPath(); x.moveTo(0, 56); x.bezierCurveTo(-52, 20, -44, -40, 0, -60); x.bezierCurveTo(44, -40, 52, 20, 0, 56); x.fillStyle = '#52b788'; x.fill(); st(); x.stroke();
    x.beginPath(); x.moveTo(0, 70); x.lineTo(0, -46); [-30, -8, 14].forEach(b => { x.moveTo(0, b + 16); x.lineTo(-22, b); x.moveTo(0, b + 16); x.lineTo(22, b); }); st(2.5); x.stroke(); x.restore(); },
  moon() { x.beginPath(); x.arc(0, 0, 54, Math.PI * .5, Math.PI * 1.5); x.bezierCurveTo(-30, -40, -30, 40, 0, 54); x.fillStyle = '#ffd23f'; x.fill(); st(); x.stroke();
    x.beginPath(); x.arc(-34, -6, 6, .2, Math.PI - .2); st(3); x.stroke(); smile(-36, 14, 7); circ(-44, 6, 4, 'rgba(255,120,120,.5)'); },
  nest() { [[-20, -14], [2, -20], [22, -14]].forEach(([a, b], i) => ell(a, b, 16, 21, ['#bde0fe', '#fff6e0', '#bde0fe'][i], INK, 3));
    x.beginPath(); x.moveTo(-64, -8); x.quadraticCurveTo(-60, 44, 0, 44); x.quadraticCurveTo(60, 44, 64, -8); x.closePath(); x.fillStyle = '#b07d4f'; x.fill(); st(); x.stroke();
    x.strokeStyle = '#7a5230'; x.lineWidth = 2.5; for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(-58 + i * 4, 2 + i * 7); x.quadraticCurveTo(0, 14 + i * 5, 58 - i * 4, 2 + i * 7); x.stroke(); } },
  owl(t) { ell(0, 6, 44, 54, '#a47148', INK, 3.5); ell(0, 22, 28, 32, '#f1d3a2'); [[-24, -50], [24, -50]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a * .6, b + 12); x.lineTo(a, b); x.lineTo(a * 1.4, b + 18); x.fillStyle = '#a47148'; x.fill(); st(3); x.stroke(); });
    const bl = (t % 3.3) > 3.1; [-18, 18].forEach(a => { circ(a, -16, 15, '#fff', INK, 3); if (bl) { x.beginPath(); x.moveTo(a - 8, -16); x.lineTo(a + 8, -16); st(3); x.stroke(); } else circ(a, -16, 7, INK); });
    x.beginPath(); x.moveTo(-6, -4); x.lineTo(0, 8); x.lineTo(6, -4); x.closePath(); x.fillStyle = '#ff9f1c'; x.fill(); st(2.5); x.stroke(); },
  pig() { ell(0, 8, 60, 46, '#ffb3c6', INK, 3.5); [[-36, -32], [36, -32]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a - 14, b + 8); x.lineTo(a + a * .2, b - 18); x.lineTo(a + 14, b + 6); x.closePath(); x.fillStyle = '#ff8fab'; x.fill(); st(3); x.stroke(); });
    ell(0, 18, 22, 16, '#ff8fab', INK, 3); circ(-7, 18, 4, INK); circ(7, 18, 4, INK); eyes(-22, -8, 22, -8, 6); circ(-36, 14, 6, 'rgba(255,90,120,.35)'); circ(36, 14, 6, 'rgba(255,90,120,.35)'); },
  quilt() { const cols = ['#ff8fab', '#ffd23f', '#9de0c4', '#bde0fe', '#cdb4db', '#ffb627', '#9de0c4', '#ff8fab', '#bde0fe'];
    x.save(); x.rotate(-.06); for (let i = 0; i < 9; i++) { const a = -54 + (i % 3) * 36, b = -54 + Math.floor(i / 3) * 36; x.fillStyle = cols[i]; x.fillRect(a, b, 36, 36);
      if (i % 2 === 0) { circ(a + 18, b + 18, 7, 'rgba(255,255,255,.75)'); } }
    x.setLineDash([5, 5]); x.strokeStyle = 'rgba(29,53,87,.5)'; x.lineWidth = 2; for (let k = 1; k < 3; k++) { x.beginPath(); x.moveTo(-54 + k * 36, -54); x.lineTo(-54 + k * 36, 54); x.moveTo(-54, -54 + k * 36); x.lineTo(54, -54 + k * 36); x.stroke(); } x.setLineDash([]);
    st(); rr(-54, -54, 108, 108, 8); x.stroke(); x.restore(); },
  rainbow() { ['#e63946', '#ff9f1c', '#ffd23f', '#52b788', '#3a86ff', '#9b5de5'].forEach((c, i) => { x.beginPath(); x.arc(0, 30, 66 - i * 9, Math.PI, 0); x.strokeStyle = c; x.lineWidth = 10; x.stroke(); });
    [[-50, 32], [50, 32]].forEach(([a, b]) => { circ(a - 12, b, 14, '#fff', INK, 3); circ(a + 12, b, 14, '#fff', INK, 3); circ(a, b - 10, 16, '#fff', INK, 3); ell(a, b + 2, 22, 10, '#fff'); }); },
  sun(t) { x.save(); x.rotate(t * .4); x.strokeStyle = '#ffb627'; x.lineWidth = 8; for (let i = 0; i < 10; i++) { x.rotate(Math.PI / 5); x.beginPath(); x.moveTo(0, -46); x.lineTo(0, -64); x.stroke(); } x.restore();
    circ(0, 0, 40, '#ffd23f', INK, 3.5); eyes(-13, -6, 13, -6, 5); smile(0, 6, 14); circ(-24, 10, 5, 'rgba(255,120,80,.45)'); circ(24, 10, 5, 'rgba(255,120,80,.45)'); },
  tree() { x.fillStyle = '#8a5a36'; st(3); rr(-12, 0, 24, 62, 6); x.fill(); x.stroke(); [[-30, -10, 30], [30, -10, 30], [0, -40, 38], [0, -6, 32]].forEach(([a, b, r]) => circ(a, b, r, '#52b788', INK, 3.5));
    [[-30, -10, 30], [30, -10, 30], [0, -40, 38], [0, -6, 32]].forEach(([a, b, r]) => circ(a, b, r - 2.5, '#52b788')); [[-22, -20], [18, -36], [10, 2]].forEach(([a, b]) => circ(a, b, 6, '#e63946', INK, 2)); },
  umbrella() { x.strokeStyle = INK; x.lineWidth = 5; x.beginPath(); x.moveTo(0, -40); x.lineTo(0, 46); x.arc(-12, 46, 12, 0, Math.PI); x.stroke();
    x.beginPath(); x.moveTo(-66, 0); x.quadraticCurveTo(-60, -60, 0, -62); x.quadraticCurveTo(60, -60, 66, 0); for (let i = 2; i >= -2; i--) x.quadraticCurveTo(i * 26 + 13, -14, i * 26 - 13 + (i === -2 ? -0 : 0), 0); x.closePath();
    x.fillStyle = '#ff5d8f'; x.fill(); st(); x.stroke(); x.beginPath(); x.moveTo(0, -62); x.quadraticCurveTo(-14, -30, -13, 0); x.moveTo(0, -62); x.quadraticCurveTo(14, -30, 13, 0); st(2.5); x.stroke(); circ(0, -66, 5, INK); },
  van() { x.fillStyle = '#3a86ff'; st(); rr(-70, -40, 120, 70, 14); x.fill(); x.stroke(); x.beginPath(); x.moveTo(50, -24); x.lineTo(70, 0); x.lineTo(70, 30); x.lineTo(50, 30); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#d6f0ff'; rr(-58, -30, 34, 26, 6); x.fill(); x.stroke(); rr(-16, -30, 34, 26, 6); x.fill(); x.stroke(); x.beginPath(); x.moveTo(52, -16); x.lineTo(64, 0); x.lineTo(52, 0); x.closePath(); x.fill(); x.stroke();
    circ(-40, 32, 15, '#333', INK, 3); circ(36, 32, 15, '#333', INK, 3); circ(-40, 32, 6, '#ccc'); circ(36, 32, 6, '#ccc'); circ(68, 12, 4, '#ffd23f'); },
  watermelon() { x.beginPath(); x.moveTo(-66, -20); x.arc(0, -20, 66, 0, Math.PI); x.closePath(); x.fillStyle = '#52b788'; x.fill(); st(); x.stroke();
    x.beginPath(); x.moveTo(-56, -20); x.arc(0, -20, 56, 0, Math.PI); x.closePath(); x.fillStyle = '#ff5d6c'; x.fill();
    [[-30, -4], [-10, 8], [12, 6], [32, -6], [0, 22], [-20, 18], [22, 20]].forEach(([a, b]) => ell(a, b, 3, 5, INK)); x.beginPath(); x.moveTo(-66, -20); x.lineTo(66, -20); st(); x.stroke(); },
  xylophone() { const cols = ['#e63946', '#ff9f1c', '#ffd23f', '#52b788', '#3a86ff', '#9b5de5'];
    x.strokeStyle = '#8a5a36'; x.lineWidth = 8; x.beginPath(); x.moveTo(-70, -26); x.lineTo(70, -12); x.moveTo(-70, 36); x.lineTo(70, 22); x.stroke();
    cols.forEach((c, i) => { const a = -62 + i * 24, h = 74 - i * 7; x.fillStyle = c; st(3); rr(a, 5 - h / 2, 18, h, 5); x.fill(); x.stroke(); circ(a + 9, 5 - h / 2 + 8, 2.5, '#fff'); });
    x.save(); x.translate(44, -46); x.rotate(.6); x.strokeStyle = '#8a5a36'; x.lineWidth = 5; x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 40); x.stroke(); circ(0, 0, 9, '#ff5d8f', INK, 2.5); x.restore(); },
  yoyo(t) { const yy = Math.sin(t * 2.4) * 14; x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.moveTo(0, -70); x.lineTo(0, yy - 20); x.stroke(); circ(0, -72, 6, '#fff', INK, 2.5);
    x.save(); x.translate(0, yy + 6); circ(0, 0, 40, '#9b5de5', INK, 3.5); circ(0, 0, 26, '#cdb4db', INK, 3); circ(0, 0, 7, '#ffd23f', INK, 2.5); circ(-16, -20, 6, 'rgba(255,255,255,.6)'); x.restore(); },
  zebra() { x.save(); x.scale(.8, .8); x.translate(10, 4);
    [-40, -20, 30, 48].forEach(a => { x.fillStyle = '#fff'; st(3); rr(a - 7, 0, 14, 56, 6); x.fill(); x.stroke(); x.fillStyle = INK; x.fillRect(a - 7, 48, 14, 8); });
    ell(0, -6, 70, 34, '#fff', INK, 3.5);
    x.save(); x.beginPath(); x.ellipse(0, -6, 70, 34, 0, 0, 7); x.clip(); x.fillStyle = INK; for (let i = -4; i <= 4; i++) { x.beginPath(); x.ellipse(i * 15, -6, 4, 40, .15, 0, 7); x.fill(); } x.restore();
    x.translate(-62, -40); x.rotate(-.3); rr(-18, -50, 36, 70, 16); x.fillStyle = '#fff'; x.fill(); st(); x.stroke();
    x.fillStyle = INK; for (let i = 0; i < 4; i++) x.fillRect(-17, -40 + i * 15, 34, 5); x.fillStyle = INK; rr(-20, -78, 10, 34, 4); x.fill();
    ell(-4, -54, 14, 22, '#fff', INK, 3); eyes(-6, -36, -6, -36, 5); x.restore(); },
};
// letter, word, colour, object, sound effect for the word (optional)
const L = [
  ['Apple', '#e63946', 'apple'], ['Ball', '#3a86ff', 'ball', 'boing'], ['Cow', '#2a9d8f', 'cow', 'moo'], ['Duck', '#f4a261', 'duck', 'quack'],
  ['Egg', '#9b5de5', 'egg'], ['Fish', '#ff9f1c', 'fish', 'blub'], ['Grapes', '#7b2cbf', 'grapes'], ['Hat', '#e63946', 'hat'],
  ['Ice cream', '#ff5d8f', 'icecream'], ['Juice', '#f77f00', 'juice'], ['Kite', '#3a86ff', 'kite', 'whoosh'], ['Leaf', '#40916c', 'leaf', 'rustle:0.6'],
  ['Moon', '#e9a800', 'moon'], ['Nest', '#9c6644', 'nest', 'tweet'], ['Owl', '#a47148', 'owl'], ['Pig', '#ff5d8f', 'pig'],
  ['Quilt', '#7b2cbf', 'quilt'], ['Rainbow', '#e63946', 'rainbow', 'twinkle'], ['Sun', '#f4a100', 'sun'], ['Tree', '#40916c', 'tree'],
  ['Umbrella', '#ff5d8f', 'umbrella'], ['Van', '#3a86ff', 'van', 'honk'], ['Watermelon', '#2d6a4f', 'watermelon'], ['Xylophone', '#e76f51', 'xylophone', 'xylo:C6'],
  ['Yo-yo', '#9b5de5', 'yoyo'], ['Zebra', '#264653', 'zebra'],
];

// ---------- learning UI ----------
function abcStrip(curIdx, k = 1) {
  if (process.env.THUMBBG) return;               // thumbnail background: no strip (the title goes there)
  const w = 880, x0 = W / 2 - w / 2, step = w / 26;
  x.save(); x.globalAlpha *= k; x.fillStyle = 'rgba(255,255,255,.9)'; x.strokeStyle = INK; x.lineWidth = 3; rr(x0 - 10, 18, w + 20, 46, 22); x.fill(); x.stroke();
  x.textAlign = 'center'; x.textBaseline = 'middle';
  for (let i = 0; i < 26; i++) { const cx = x0 + step * (i + .5), on = i === curIdx, done = i < curIdx;
    if (on) circ(cx, 41, 18, '#ffd23f', INK, 2.5);
    x.font = C.FONT(on ? 28 : 21); x.fillStyle = on ? '#e8501f' : done ? INK : 'rgba(29,53,87,.4)'; x.fillText(ABC[i], cx, 43); }
  x.restore();
}
function letterBlock(Lt, cx, cy, s, col, k) {
  if (k <= 0) return;
  x.save(); x.globalAlpha *= clamp(k * 1.5); x.translate(cx, cy); const sc = s * (.6 + .4 * ease(k)); x.scale(sc, sc); x.rotate(-.04);
  x.fillStyle = 'rgba(0,0,0,.15)'; x.beginPath(); x.ellipse(0, 112, 110, 12, 0, 0, 7); x.fill();
  x.fillStyle = col; x.strokeStyle = INK; x.lineWidth = 5; rr(-100, -100, 200, 200, 26); x.fill(); x.stroke();
  x.fillStyle = 'rgba(255,255,255,.92)'; rr(-80, -80, 160, 160, 18); x.fill();
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = C.FONT(112); x.fillStyle = col; x.lineWidth = 6; x.strokeStyle = INK;
  x.strokeText(Lt + Lt.toLowerCase(), 0, 10); x.fillText(Lt + Lt.toLowerCase(), 0, 10);
  x.restore();
}
function pictureCard(name, cx, cy, k, t) {
  if (k <= 0) return;
  x.save(); x.globalAlpha *= clamp(k * 1.5); x.translate(cx, cy); const sc = .6 + .4 * ease(k); x.scale(sc, sc);
  x.fillStyle = '#ffffff'; x.strokeStyle = INK; x.lineWidth = 4; rr(-95, -88, 190, 176, 30); x.fill(); x.stroke();
  x.translate(0, Math.sin(t * 2) * 3); O[name](t);
  x.restore();
}
function wordCard(txt, cx, cy, col, k) {
  if (k <= 0) return;
  x.save(); x.globalAlpha *= clamp(k * 1.5); x.font = C.FONT(44); const w = x.measureText(txt).width + 56;
  x.translate(cx, cy); const sc = .7 + .3 * ease(k); x.scale(sc, sc);
  x.fillStyle = '#fff'; x.strokeStyle = INK; x.lineWidth = 4; rr(-w / 2, -32, w, 64, 30); x.fill(); x.stroke();
  x.textAlign = 'left'; x.textBaseline = 'middle'; const lw = x.measureText(txt[0]).width; const px = -w / 2 + 28;
  x.fillStyle = col; x.fillText(txt[0], px, 3); x.fillStyle = INK; x.fillText(txt.slice(1), px + lw, 3);
  x.restore();
}
const road = (t, dist) => T.world({ t, dist, skyP: .12, near: 'mixed' });
function truck(t, o = {}) { return T.truck(Object.assign({ t, dist: 0, moving: true, bx: BX, happy: true }, o)); }

// ---------- timeline ----------
const INTRO = 11, ABC_D = 26 * SEG;
const abcSays = [], abcSfx = [];
L.forEach(([word, col, obj, snd], i) => {
  const s = i * SEG;
  abcSfx.push([s + .5, `chime:${CHIME[i % 7]}`, .5]);
  if (snd) abcSfx.push([s + 1.3, snd, .4]);
  abcSays.push(['toet', `${ABC[i]} is for ${word}!`, s + 1.6, s + 4.5, BX + 40, 236, 30]);
});

St.episode({
  title: ["Toet's ABC Drive", 64], sub: 'Learn the alphabet A to Z', accent: '#ff7a45', cardBg: '#fff4e6',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'abc', shift: 0 },
  shots: [
    // 1 – Toet drives in along the country road
    { d: INTRO, draw: (u, c) => {
        const k = ease(clamp((u - 1) / 5)), bx = lerp(-300, BX, k);
        road(c.t, u * SPEED);
        truck(c.t, { bx, mouth: c.talk('toet') });
        abcStrip(-1, clamp((u - 8.6) / .6));
      },
      says: [['toet', 'Hello! Come for a drive with me!', 5.6, 8.4, BX + 60, 236, 27], ["toet", "Let's learn the ABC!", 8.6, 10.8, BX + 40, 236, 27]],
      sfx: [[5.2, 'honk', .45]] },

    // 2 – A to Z
    { d: ABC_D, draw: (u, c) => {
        const i = Math.min(25, Math.floor(u / SEG)), v = u - i * SEG, [word, col, obj] = L[i];
        road(c.t, (INTRO + u) * SPEED);
        const out = clamp((SEG - .35 - v) / .35);
        truck(c.t, { mouth: c.talk('toet') });
        abcStrip(i);
        const dy = process.env.THUMBBG ? 70 : 0;   // thumbnail background: cards a bit lower, below the title
        letterBlock(ABC[i], 470, 200 + dy, .72, col, clamp((v - .4) / .45) * out);
        pictureCard(obj, 760, 182 + dy, clamp((v - .8) / .45) * out, c.t);
        wordCard(word, 760, 322 + dy, col, clamp((v - 1.1) / .4) * out);
      },
      says: abcSays, sfx: abcSfx },

    // 3 – recap: all 26 letters light up one by one
    { d: 18, draw: (u, c) => {
        road(c.t, (INTRO + ABC_D) * SPEED);
        truck(c.t, { moving: false, mouth: c.talk('toet') });
        x.fillStyle = 'rgba(255,248,235,.95)'; x.fillRect(0, 0, W, 540);
        C.bigText('A to Z – all together!', W / 2, 74, win(u, .3, 17.6, .4), 50, '#ff7a45');
        const cols = ['#e63946', '#3a86ff', '#2a9d8f', '#f4a261', '#9b5de5', '#ffb627'];
        for (let i = 0; i < 26; i++) { const r = Math.floor(i / 9), cc = i % 9, n = r === 2 ? 8 : 9;
          const cx = W / 2 + (cc - (n - 1) / 2) * 92, cy = 170 + r * 96, t0 = 1.6 + i * .5, k = clamp((u - t0) / .3), on = u >= t0 && u < t0 + .5;
          x.save(); x.globalAlpha = .25 + .75 * k; x.translate(cx, cy); const sc = on ? 1.14 : 1; x.scale(sc, sc);
          if (on) circ(0, 0, 46, 'rgba(255,210,63,.55)');
          x.fillStyle = k > 0 ? cols[i % 6] : '#c9c9c9'; x.strokeStyle = INK; x.lineWidth = 3; rr(-34, -34, 68, 68, 12); x.fill(); x.stroke();
          x.font = C.FONT(44); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ABC[i], 0, 4); x.restore(); }
        C.bigText('Well done!', W / 2, 482, win(u, 15.2, 17.8, .3), 46, '#ffd23f');
      },
      sfx: Array.from({ length: 26 }, (_, i) => [1.6 + i * .5, `chime:${CHIME[i % 7]}`, .32]).concat([[15.2, 'cheer', .4]]) },

    // 4 – Toet drives home
    { d: 12, draw: (u, c) => {
        const k = ease(clamp((u - 4.6) / 5.4)), bx = lerp(BX, 1150, k);
        road(c.t, (INTRO + ABC_D) * SPEED + Math.max(0, u - 4.6) * 160 * k);
        truck(c.t, { bx, moving: u > 4.6, mouth: c.talk('toet') });
      },
      says: [['toet', 'Bye bye! Toot toot!', 1, 4.4, BX + 40, 236, 28]],
      sfx: [[4.6, 'honk', .5]] },
  ],
});
