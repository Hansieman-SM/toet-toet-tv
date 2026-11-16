// Learning series – "Can You Find It?" #2: Shapes with The Big Four (Leo the Lion, Ella the Elephant, Nico the Rhino, Boris the Buffalo).
// A sunny savanna by a little waterhole. The Big Four play a shape-finding game: per shape (13 s) three picture cards pop up out of
// three little bushes ("hidden in the savanna"), the shape word appears at the top with the shape outline drawing itself next to it,
// one of the friends asks "Can you find a CIRCLE?", then a quiet 3-dot pause (one dot per second) so children can point, then the answer:
// the right card glows and bounces, the others fade, the word appears on the card and the friend says "Yes! The clock is a circle!".
// Shapes: circle (clock), square (window), triangle (party hat), star (starfish), heart (heart balloon), oval (egg).
// Recap of the 6 shapes, the friends wave and walk off.
// New music: shapehunt_long (oboe lead, hammered-dulcimer arpeggios, plucked upright bass, udu-pot + shaker; gentle highlife lilt in E major).
const C = require('../lib/common'), S = require('../lib/safari');
const St = require('../lib/story');
const { x, W, H, clamp, ease, lerp, win, rr, circ, ell, hash, mix } = C;
const INK = S.INK, G = S.GROUND;

const ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
const FR = { elephant: [95, .58, true], lion: [226, .62, true], rhino: [744, .62, false], buffalo: [866, .6, false] };
const ORDER = ['elephant', 'lion', 'rhino', 'buffalo'];
const SEG = 13, Q0 = .6, Q1 = 4.1, D0 = 4.4, ANS = 7.6, END = 12.4;
const CARD_X = [330, 480, 630], CARD_Y = 276, CW = 132, CHH = 150, BUSH_Y = 452;
const WORD_Y = 64, BY = 148;
const TB = !!process.env.THUMBBG;

// ---------- simple original objects (centred on 0,0, ~55 px radius) ----------
const st = (lw = 3.5) => { x.lineWidth = lw; x.strokeStyle = INK; x.lineJoin = 'round'; x.lineCap = 'round'; };
const shine = (a, b, r) => circ(a, b, r, 'rgba(255,255,255,.6)');
const dot = (a, b, r = 3.4) => circ(a, b, r, INK);
const O = {
  clock() { circ(0, 0, 50, '#ff8c42', INK, 3.5); circ(0, 0, 39, '#fffaf0', INK, 3);
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, r1 = i % 3 ? 33 : 29; x.beginPath(); x.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); x.lineTo(Math.cos(a) * 36, Math.sin(a) * 36); st(i % 3 ? 2 : 3.5); x.stroke(); }
    x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -24); x.moveTo(0, 0); x.lineTo(17, 6); st(4.5); x.stroke(); circ(0, 0, 4.5, '#ff8c42', INK, 2);
    [-1, 1].forEach(s => { circ(s * 30, -50, 11, '#ff8c42', INK, 3); }); shine(-30, -24, 5); },
  window() { x.fillStyle = '#a8693a'; rr(-50, -50, 100, 100, 6); x.fill(); st(); x.stroke();
    x.fillStyle = '#9ad8f5'; rr(-40, -40, 80, 80, 3); x.fill(); st(3); x.stroke();
    circ(18, -18, 9, '#ffe066'); x.fillStyle = 'rgba(255,255,255,.85)'; x.beginPath(); x.ellipse(-16, 18, 14, 6, 0, 0, 7); x.ellipse(-4, 15, 10, 6, 0, 0, 7); x.fill();
    x.fillStyle = '#a8693a'; x.fillRect(-4, -40, 8, 80); x.fillRect(-40, -4, 80, 8); x.beginPath(); x.rect(-4, -40, 8, 80); x.rect(-40, -4, 80, 8); st(2); x.stroke();
    x.fillStyle = '#ff6f91'; [-1, 1].forEach(s => { x.beginPath(); x.moveTo(s * 40, -40); x.quadraticCurveTo(s * 22, -10, s * 40, 30); x.closePath(); x.fill(); }); },
  hat() { x.save(); x.translate(0, 8);
    x.beginPath(); x.moveTo(0, -52); x.lineTo(42, 44); x.lineTo(-42, 44); x.closePath(); x.fillStyle = '#2ec4b6'; x.fill();
    x.save(); x.clip(); x.fillStyle = '#ffd23f'; [-28, 0, 28].forEach(b => { x.beginPath(); x.moveTo(-60, b + 10); x.lineTo(60, b - 10); x.lineTo(60, b + 2); x.lineTo(-60, b + 22); x.fill(); }); x.restore();
    x.beginPath(); x.moveTo(0, -52); x.lineTo(42, 44); x.lineTo(-42, 44); x.closePath(); st(); x.stroke();
    for (let i = 0; i < 6; i++) circ(-36 + i * 14.4, 46, 7, i % 2 ? '#ff6f91' : '#ffffff', INK, 2);
    circ(0, -56, 10, '#ff6f91', INK, 3); x.restore(); },
  starfish() { x.save(); x.translate(0, 4); x.beginPath();
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / 5, b = a + Math.PI / 5;
      const ox = Math.cos(a) * 56, oy = Math.sin(a) * 56, ix = Math.cos(b) * 24, iy = Math.sin(b) * 24;
      if (!i) x.moveTo(ox, oy); x.quadraticCurveTo(Math.cos(a + .14) * 50, Math.sin(a + .14) * 50, ox, oy); x.quadraticCurveTo(Math.cos(a + .35) * 30, Math.sin(a + .35) * 30, ix, iy);
      const n = a + Math.PI * 2 / 5; x.quadraticCurveTo(Math.cos(n - .35) * 30, Math.sin(n - .35) * 30, Math.cos(n) * 56, Math.sin(n) * 56); }
    x.closePath(); x.fillStyle = '#ff9f45'; x.fill(); st(); x.stroke();
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; [22, 36].forEach(r => circ(Math.cos(a) * r, Math.sin(a) * r, 3, '#ffd6a0')); }
    circ(-8, -4, 4, INK); circ(8, -4, 4, INK); circ(-7, -5.5, 1.3, '#fff'); circ(9, -5.5, 1.3, '#fff');
    x.beginPath(); x.arc(0, 3, 6, .3, Math.PI - .3); st(2.5); x.stroke(); x.restore(); },
  heart() { x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.moveTo(0, 38); x.bezierCurveTo(-12, 50, 12, 56, 0, 66); x.stroke();
    x.save(); x.translate(0, -6); x.beginPath(); x.moveTo(0, 40); x.bezierCurveTo(-60, 2, -46, -50, 0, -26); x.bezierCurveTo(46, -50, 60, 2, 0, 40); x.closePath();
    x.fillStyle = '#ef476f'; x.fill(); st(); x.stroke(); shine(-22, -18, 7); x.restore(); },
  egg() { x.save(); x.beginPath(); x.ellipse(0, 2, 38, 52, 0, 0, 7); x.fillStyle = '#d6ecff'; x.fill(); st(); x.stroke();
    [[-14, -20], [12, -30], [18, 4], [-20, 14], [2, 26], [-4, -6]].forEach(([a, b]) => circ(a, b, 3.2, '#8fb8dd')); shine(-16, -24, 7); x.restore(); },
  // distractors
  book() { x.fillStyle = '#fffaf0'; rr(-30, -46, 66, 92, 6); x.fill(); st(3); x.stroke();
    x.fillStyle = '#3a86ff'; rr(-36, -50, 64, 96, 6); x.fill(); st(); x.stroke(); x.fillStyle = '#2a63c7'; x.fillRect(-36, -50, 10, 96);
    x.fillStyle = '#ffd23f'; rr(-16, -26, 36, 20, 4); x.fill(); st(2); x.stroke(); },
  pizza() { x.save(); x.translate(0, -4); x.beginPath(); x.moveTo(-44, -38); x.quadraticCurveTo(0, -56, 44, -38); x.lineTo(0, 52); x.closePath(); x.fillStyle = '#ffd166'; x.fill(); st(); x.stroke();
    x.beginPath(); x.moveTo(-44, -38); x.quadraticCurveTo(0, -56, 44, -38); x.lineTo(40, -28); x.quadraticCurveTo(0, -44, -40, -28); x.closePath(); x.fillStyle = '#d98b3a'; x.fill(); st(2.5); x.stroke();
    [[-14, -18], [12, -14], [0, 10]].forEach(([a, b]) => circ(a, b, 8, '#e63946', INK, 2)); x.restore(); },
  moon() { x.save(); x.translate(6, 0); x.beginPath(); x.arc(0, 0, 48, .552, 4.733); x.arc(22, -12, 40, 4.159, 1.126, true); x.closePath(); x.fillStyle = '#ffe066'; x.fill(); st(); x.stroke();
    x.beginPath(); x.arc(-26, 0, 4, .2, Math.PI - .2); st(2.5); x.stroke(); x.restore(); },
  cloud() { x.save(); x.translate(0, 8); x.beginPath(); [[-28, 4, 22], [0, -14, 30], [28, 2, 24], [6, 12, 22]].forEach(([a, b, r]) => { x.moveTo(a + r, b); x.arc(a, b, r, 0, 7); });
    x.fillStyle = '#ffffff'; x.fill(); st(3); x.stroke(); x.fillStyle = '#ffffff'; x.beginPath(); [[-28, 4, 20], [0, -14, 28], [28, 2, 22], [6, 12, 20]].forEach(([a, b, r]) => { x.moveTo(a + r, b); x.arc(a, b, r, 0, 7); }); x.fill();
    x.fillStyle = '#cfe6f7'; x.beginPath(); x.ellipse(2, 24, 34, 6, 0, 0, 7); x.fill(); x.restore(); },
  donut() { circ(0, 0, 46, '#e9a35a', INK, 3.5); x.beginPath(); x.arc(0, 0, 42, 0, 7); x.fillStyle = '#ff8fb1'; x.fill();
    circ(0, 0, 15, '#ffffff', INK, 3);
    [[-24, -18, .5], [20, -24, -.4], [28, 12, .9], [-26, 16, -.8], [2, 30, .2], [-4, -32, 1.2]].forEach(([a, b, r], i) => { x.save(); x.translate(a, b); x.rotate(r); x.fillStyle = ['#ffd23f', '#3a86ff', '#ffffff'][i % 3]; rr(-6, -2, 12, 4, 2); x.fill(); x.restore(); }); },
  leaf() { x.save(); x.rotate(-.5); x.beginPath(); x.moveTo(0, 52); x.bezierCurveTo(-46, 18, -38, -36, 0, -56); x.bezierCurveTo(38, -36, 46, 18, 0, 52); x.fillStyle = '#52b788'; x.fill(); st(); x.stroke();
    x.beginPath(); x.moveTo(0, 64); x.lineTo(0, -42); [-28, -6, 14].forEach(b => { x.moveTo(0, b + 15); x.lineTo(-20, b); x.moveTo(0, b + 15); x.lineTo(20, b); }); st(2.5); x.stroke(); x.restore(); },
  kite() { x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.moveTo(0, 40); x.bezierCurveTo(-18, 52, 18, 58, 2, 70); x.stroke();
    [[-8, 52], [8, 62]].forEach(([a, b]) => { x.fillStyle = '#ff6f91'; x.beginPath(); x.moveTo(a - 7, b - 5); x.lineTo(a + 7, b + 5); x.lineTo(a + 7, b - 5); x.lineTo(a - 7, b + 5); x.closePath(); x.fill(); });
    x.beginPath(); x.moveTo(0, -54); x.lineTo(34, -8); x.lineTo(0, 40); x.lineTo(-34, -8); x.closePath(); x.fillStyle = '#9b5de5'; x.fill();
    x.save(); x.clip(); x.fillStyle = '#c7a4ff'; x.fillRect(0, -60, 40, 52); x.fillRect(-40, -8, 40, 52); x.restore();
    x.beginPath(); x.moveTo(0, -54); x.lineTo(34, -8); x.lineTo(0, 40); x.lineTo(-34, -8); x.closePath(); st(); x.stroke();
    x.beginPath(); x.moveTo(0, -54); x.lineTo(0, 40); x.moveTo(-34, -8); x.lineTo(34, -8); st(2); x.stroke(); },
};

// ---------- the shapes (outline that draws itself) ----------
const SCOL = { CIRCLE: '#ff8c42', SQUARE: '#3a86ff', TRIANGLE: '#2a9d8f', STAR: '#f4a300', HEART: '#ef476f', OVAL: '#9b5de5' };
function shapePath(name, r) {
  x.beginPath();
  if (name === 'CIRCLE') { x.moveTo(r, 0); x.arc(0, 0, r, 0, Math.PI * 2); }
  else if (name === 'SQUARE') { x.moveTo(-r * .85, -r * .85); x.lineTo(r * .85, -r * .85); x.lineTo(r * .85, r * .85); x.lineTo(-r * .85, r * .85); x.closePath(); }
  else if (name === 'TRIANGLE') { x.moveTo(0, -r); x.lineTo(r * .98, r * .74); x.lineTo(-r * .98, r * .74); x.closePath(); }
  else if (name === 'STAR') { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * .45 : r * 1.05; i ? x.lineTo(Math.cos(a) * q, Math.sin(a) * q + r * .08) : x.moveTo(Math.cos(a) * q, Math.sin(a) * q + r * .08); } x.closePath(); }
  else if (name === 'HEART') { x.moveTo(0, -r * .45); x.bezierCurveTo(r * .95, -r * 1.25, r * 1.5, r * .1, 0, r * .95); x.bezierCurveTo(-r * 1.5, r * .1, -r * .95, -r * 1.25, 0, -r * .45); }
  else if (name === 'OVAL') { x.moveTo(r * .72, 0); x.ellipse(0, 0, r * .72, r * 1.02, 0, 0, Math.PI * 2); }
}
const PERIM = { CIRCLE: 6.3, SQUARE: 6.8, TRIANGLE: 5.6, STAR: 7.6, HEART: 6.4, OVAL: 5.5 };
// k: 0..1 draw-on progress, fill: 0..1 soft fill
function shape(name, cx, cy, r, k, fill = 1, o = {}) {
  if (k <= 0) return;
  x.save(); x.translate(cx, cy); x.globalAlpha *= o.alpha ?? 1; x.lineJoin = 'round'; x.lineCap = 'round';
  shapePath(name, r);
  if (fill > 0) { x.save(); x.globalAlpha *= clamp(fill); x.fillStyle = mix(SCOL[name], '#ffffff', .55); x.fill(); x.restore(); }
  const L = PERIM[name] * r * 1.05;
  x.lineWidth = r * .22; x.strokeStyle = INK; if (k < 1) x.setLineDash([L * k, L * 2]); x.stroke();
  x.lineWidth = r * .12; x.strokeStyle = SCOL[name]; x.stroke(); x.setLineDash([]);
  x.restore();
}

// [shape, answer index, [cards], answer word, speaker, question, answer line]
const ROUNDS = [
  ['CIRCLE', 1, ['book', 'clock', 'pizza'], 'clock', 'lion', 'Can you find a CIRCLE?', 'Yes! The clock is a circle!'],
  ['SQUARE', 0, ['window', 'moon', 'cloud'], 'window', 'elephant', 'Can you find a SQUARE?', 'Yes! The window is a square!'],
  ['TRIANGLE', 2, ['donut', 'leaf', 'hat'], 'party hat', 'rhino', 'Can you find a TRIANGLE?', 'Yes! The party hat is a triangle!'],
  ['STAR', 1, ['kite', 'starfish', 'moon'], 'starfish', 'buffalo', 'Can you find a STAR?', 'Yes! The starfish is a star!'],
  ['HEART', 0, ['heart', 'pizza', 'donut'], 'balloon', 'lion', 'Can you find a HEART?', 'Yes! The balloon is a heart!'],
  ['OVAL', 2, ['cloud', 'book', 'egg'], 'egg', 'elephant', 'Can you find an OVAL?', 'Yes! The egg is an oval!'],
];
const CHIMES = ['E5', 'F#5', 'G#5', 'B5', 'C#6', 'E6'];

function obj(name, cx, cy, s) { x.save(); x.translate(cx, cy); x.scale(s, s); O[name](); x.restore(); }
function card(cx, cy, k, o = {}) {
  if (k <= 0) return;
  const s = (.6 + .4 * ease(k)) * (o.scale || 1);
  x.save(); x.globalAlpha = clamp(k * 1.5) * (o.alpha ?? 1); x.translate(cx, cy - (o.hop || 0)); x.scale(s, s);
  if (o.glow) circ(0, 0, 96, `rgba(255,214,70,${.45 * o.glow})`);
  x.fillStyle = '#fffdf6'; x.strokeStyle = o.glow ? '#ffb703' : INK; x.lineWidth = o.glow ? 6 : 4; rr(-CW / 2, -CHH / 2, CW, CHH, 22); x.fill(); x.stroke();
  obj(o.item, 0, o.word ? -14 : 0, o.word ? .8 : .95);
  if (o.word) { x.font = C.FONT(o.wordTxt.length > 7 ? 22 : 26); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = INK; x.globalAlpha *= clamp(o.word); x.fillText(o.wordTxt, 0, CHH / 2 - 22); }
  x.restore();
}
function dots(n, cx, cy) {
  for (let i = 0; i < 3; i++) {
    const on = n > i, p = on ? ease(clamp((n - i) * 3)) : 0;
    circ(cx + (i - 1) * 46, cy, 14, 'rgba(255,255,255,.8)', INK, 3);
    if (on) circ(cx + (i - 1) * 46, cy, 14 * p, INK);
  }
}
// shape word with the outline next to it (top centre)
function shapeWord(name, k, draw) {
  if (k <= 0) return;
  x.save(); x.font = C.FONT(62); const tw = x.measureText(name).width; x.restore();
  const gap = 26, r = 30, tot = tw + gap + 2 * r, x0 = W / 2 - tot / 2;
  shape(name, x0 + r, WORD_Y + 2, r * (.7 + .3 * ease(clamp(k * 2))), draw, clamp(draw * 1.4 - .4), { alpha: clamp(k * 2) });
  C.bigText(name, x0 + 2 * r + gap + tw / 2, WORD_Y, k, 62, SCOL[name]);
}

// ---------- the sunny savanna with a little waterhole ----------
function baobab(px, py, s) {
  x.save(); x.translate(px, py); x.scale(s, s);
  x.fillStyle = '#a07a5a'; x.beginPath(); x.moveTo(-34, 0); x.quadraticCurveTo(-26, -60, -22, -110); x.lineTo(22, -110); x.quadraticCurveTo(26, -60, 34, 0); x.closePath(); x.fill();
  x.strokeStyle = '#a07a5a'; x.lineWidth = 9; x.lineCap = 'round';
  [[-18, -108, -52, -132], [-6, -110, -16, -144], [8, -110, 22, -146], [18, -108, 54, -128]].forEach(([a, b, c2, d]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c2, d); x.stroke(); });
  x.fillStyle = '#6f9a3c'; [[-52, -138, 22], [-16, -152, 24], [22, -154, 24], [56, -134, 22]].forEach(([a, b, r]) => { x.beginPath(); x.ellipse(a, b, r, r * .55, 0, 0, 7); x.fill(); });
  x.restore();
}
function zebraSil(px, py, s) {
  x.save(); x.translate(px, py); x.scale(s, s); x.fillStyle = 'rgba(110,90,110,.35)';
  x.beginPath(); x.ellipse(0, -26, 22, 10, 0, 0, 7); x.fill(); [-14, -6, 8, 15].forEach(l => x.fillRect(l, -22, 3, 22));
  x.beginPath(); x.moveTo(-16, -30); x.lineTo(-28, -46); x.lineTo(-34, -42); x.lineTo(-22, -24); x.fill(); x.restore();
}
function savanna(t) {
  S.setT(t);
  const g = x.createLinearGradient(0, 0, 0, 340); g.addColorStop(0, '#86cdf0'); g.addColorStop(1, '#fff2cc');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  circ(892, 66, 52, 'rgba(255,240,170,.35)'); circ(892, 66, 34, '#ffe27a');
  for (let i = 0; i < 4; i++) { const cx = ((hash(i + 3) * 1200 + t * (5 + i * 2)) % 1240) - 140, cy = 40 + hash(i + 11) * 70;
    x.fillStyle = 'rgba(255,255,255,.8)'; x.beginPath(); [[0, 0, 18], [22, -9, 23], [46, 0, 18]].forEach(([a, b, r]) => { x.moveTo(cx + a + r, cy + b); x.arc(cx + a, cy + b, r, 0, 7); }); x.fill(); }
  // far hills
  x.fillStyle = '#c9b4cf'; x.beginPath(); x.moveTo(0, 330);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 300 + Math.sin(i * .006 + .5) * 18 + Math.sin(i * .017) * 6); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  // plain
  x.fillStyle = '#e8c77e'; x.beginPath(); x.moveTo(0, 340);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 334 + Math.sin(i * .011 + 1) * 5); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  baobab(150, 352, .62); S.acacia(812, 350, .55); zebraSil(560, 346, .7); zebraSil(598, 348, .6); S.giraffeSil(400, 348, .55);
  x.fillStyle = '#ddb062'; x.beginPath(); x.moveTo(0, 384);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 378 + Math.sin(i * .008 + 2) * 6); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  // waterhole
  x.fillStyle = '#c9a25a'; x.beginPath(); x.ellipse(480, 404, 218, 26, 0, 0, 7); x.fill();
  x.fillStyle = '#74c4e2'; x.beginPath(); x.ellipse(480, 402, 206, 21, 0, 0, 7); x.fill();
  x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 2.5; x.lineCap = 'round';
  for (let i = 0; i < 5; i++) { const px = 330 + i * 72 + Math.sin(t * .8 + i) * 8; x.beginPath(); x.moveTo(px - 14, 400 + (i % 2) * 7); x.lineTo(px + 14, 400 + (i % 2) * 7); x.stroke(); }
  // path where the friends stand
  x.fillStyle = '#d29a4c'; x.beginPath(); x.ellipse(W / 2, G + 10, 620, 38, 0, 0, 7); x.fill();
  S.grass(384, 16, 0, '#b88c3a');
}
function front() { x.fillStyle = '#c98a3c'; x.fillRect(0, 506, W, 40); S.grass(540, 40, 50, '#a8772b'); S.grass(540, 30, 90, '#c6973f'); }

// ---------- the friends ----------
const say = (c, who) => { const v = c.talk(who); return v > 0 ? (who === 'elephant' ? .12 + v * .04 : v * .45) : 0; };
const walk = (u, a, b, x0, x1) => u < a ? x0 : u > b ? x1 : lerp(x0, x1, ease((u - a) / (b - a)));
const hop = (t, sp = 6, h = 8) => Math.abs(Math.sin(t * sp)) * h;
// st: {x, mv, lift, act, flip}
function friends(c, st = {}) {
  ORDER.forEach((k, i) => {
    const [px0, sc, fl] = FR[k], X = st.x || {}, M = st.mv || {}, L = st.lift || {}, A = st.act || {}, F = st.flip || {};
    S.actor(ANI[k], X[k] ?? px0, !!M[k], Math.max(A[k] || 0, say(c, k)), sc, { flip: F[k] ?? fl, blinkOff: i * .8, phase: i, lift: L[k] || 0 });
  });
}

// ---------- timeline ----------
const rSfx = [], rSays = [];
ROUNDS.forEach(([, , , , who, q, ans], r) => {
  const s = r * SEG;
  [0, 1, 2].forEach(i => rSfx.push([s + .05 + i * .15, 'rustle:0.6', .18], [s + .25 + i * .15, 'pop', .3]));
  [0, 1, 2].forEach(i => rSfx.push([s + D0 + .2 + i, 'tick', .45]));
  rSfx.push([s + ANS, `chime:${CHIMES[r]}`, .6], [s + ANS + .15, 'twinkle', .35]);
  if (who === 'elephant') rSfx.push([s + ANS + 1.4, 'trumpet', .12]);
  if (who === 'lion') rSfx.push([s + ANS + 1.4, 'roar', .08]);
  rSays.push([who, q, s + Q0, s + Q1, FR[who][0], BY, 28]);
  rSays.push([who, ans, s + ANS + .3, s + END - .2, FR[who][0], BY, 28]);
});

St.episode({
  title: ['Can You Find It?', 64], sub: 'Shapes with The Big Four', accent: '#2a9d8f', cardBg: '#effaf6',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'shapehunt', shift: 0 },
  shots: [
    // 1 – the Big Four walk in to the waterhole and invite the children to play
    { d: 13, draw: (u, c) => {
        savanna(c.t);
        const X = { elephant: walk(u, 1.4, 5.4, -170, FR.elephant[0]), lion: walk(u, 1.7, 5.6, -120, FR.lion[0]),
                    rhino: walk(u, 1.5, 5.4, W + 140, FR.rhino[0]), buffalo: walk(u, 1.8, 5.7, W + 170, FR.buffalo[0]) };
        const M = { elephant: u > 1.4 && u < 5.4, lion: u > 1.7 && u < 5.6, rhino: u > 1.5 && u < 5.4, buffalo: u > 1.8 && u < 5.7 };
        CARD_X.forEach(bx => S.bush(bx, BUSH_Y, .6));
        friends(c, { x: X, mv: M }); front();
      },
      says: [['lion', "Hello! Let's play a game!", 6.4, 9.4, FR.lion[0], BY, 28], ['elephant', 'Can you find the right shape?', 9.7, 12.8, FR.elephant[0], BY, 28]],
      sfx: [[6.4, 'roar', .1], [9.7, 'trumpet', .12]] },

    // 2 – six rounds: question, 3-dot pause, answer
    { d: ROUNDS.length * SEG, draw: (u, c) => {
        const r = Math.min(ROUNDS.length - 1, Math.floor(u / SEG)), v = TB ? ANS + 1.5 : u - r * SEG;   // THUMBBG: answer state, no word/dots (title goes on top)
        const [NAME, ai, items, word, who] = ROUNDS[r];
        savanna(c.t);
        const ansK = clamp((v - ANS) / .5), out = clamp((v - END) / .5);
        const bounce = v >= ANS && v < ANS + 1.2 ? Math.abs(Math.sin((v - ANS) / 1.2 * Math.PI * 2)) * 10 : 0;
        items.forEach((it, i) => {
          const k0 = clamp((v - i * .15) / .6), k = k0 * (1 - out), good = i === ai;
          const rise = k0 < 1 ? lerp(BUSH_Y - 10, CARD_Y, ease(k0)) - Math.sin(k0 * Math.PI) * 18 : CARD_Y;
          card(CARD_X[i], rise + out * 30, k, { item: it, alpha: good ? 1 : 1 - .65 * ansK, scale: good ? 1 + .14 * ease(ansK) : 1 - .06 * ansK, glow: good ? ansK : 0, hop: good ? bounce : 0,
            word: good ? clamp((v - ANS - .3) / .4) : 0, wordTxt: word });
        });
        CARD_X.forEach((bx, i) => S.bush(bx, BUSH_Y, .6, v > i * .15 && v < i * .15 + .7 ? 1 : 0));
        const lift = {}, act = {};
        if (v >= ANS && v < ANS + 1.4) { lift[who] = hop(v, 5.4, 10); ORDER.forEach(k => { if (k !== who) lift[k] = hop(v + .3, 5.4, 4); }); }
        if (v >= ANS && v < ANS + .5) act[who] = who === 'elephant' ? .6 : .5;
        friends(c, { lift, act }); front();
        if (!TB && v >= ANS && v < ANS + 1) C.sparkles(CARD_X[ai], CARD_Y, c.t, 10, 90);
        if (!TB) shapeWord(NAME, win(v, Q0 - .3, END, .3) * (1 - out), clamp((v - Q0) / 1.6));
        if (v >= D0 - .1 && v < ANS + .2) dots(clamp(v - D0, 0, 3), W / 2, BY);
      },
      says: rSays, sfx: rSfx },

    // 3 – recap: the six shapes light up one by one
    { d: 16, draw: (u, c) => {
        savanna(c.t); friends(c); front();
        x.fillStyle = 'rgba(247,252,248,.9)'; x.fillRect(0, 0, W, H);
        C.bigText("Let's say the shapes!", W / 2, 70, win(u, .4, 15.6, .4), 50, '#2a9d8f');
        ROUNDS.forEach(([NAME, ai, items], i) => {
          const t0 = 1.6 + i * 1.6, k = clamp((u - t0) / .35), on = u >= t0 && u < t0 + 1.6;
          const cx = 190 + (i % 3) * 290, cy = 196 + Math.floor(i / 3) * 172;
          if (k <= 0) return;
          if (on) circ(cx, cy - 8, 74, 'rgba(255,214,70,.4)');
          const s = on ? 1.08 : 1;
          shape(NAME, cx - 52, cy - 12, 34 * s * (.6 + .4 * ease(k)), clamp(k * 1.2), 1, { alpha: k });
          x.save(); x.globalAlpha = k; obj(items[ai], cx + 52, cy - 12, .62 * s * (.6 + .4 * ease(k))); x.restore();
          C.bigText(NAME, cx, cy + 58, k, 34, SCOL[NAME]);
        });
        C.bigText('Well done!', W / 2, 508, win(u, 12.4, 15.8, .3), 40, '#ffd23f');
      },
      sfx: ROUNDS.map((_, i) => [1.6 + i * 1.6, `chime:${CHIMES[i]}`, .5]).concat([[12.4, 'cheer', .4]]) },

    // 4 – the friends cheer and walk off
    { d: 11, draw: (u, c) => {
        savanna(c.t);
        CARD_X.forEach(bx => S.bush(bx, BUSH_Y, .6));
        const L = {}; ORDER.forEach((k, j) => { L[k] = u > .3 && u < 2 ? hop(c.t + j * .6, 4.5, 7) : 0; });
        const go = u > 4.4, X = { elephant: walk(u, 4.4, 9, FR.elephant[0], -200), lion: walk(u, 4.6, 9, FR.lion[0], -150),
          rhino: walk(u, 4.5, 9, FR.rhino[0], W + 160), buffalo: walk(u, 4.7, 9, FR.buffalo[0], W + 190) };
        friends(c, { lift: L, x: X, mv: { elephant: go, lion: go, rhino: go, buffalo: go }, flip: go ? { elephant: false, lion: false, rhino: true, buffalo: true } : {} });
        front();
      },
      says: [['rhino', 'Shapes are everywhere!', .6, 3.0, FR.rhino[0], BY, 28], ['buffalo', 'Bye bye!', 3.2, 5.4, FR.buffalo[0], BY, 28]],
      sfx: [[.4, 'cheer', .3], [4.4, 'trumpet', .1]] },
  ],
});
