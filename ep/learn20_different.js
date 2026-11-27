// Learning series – "Can You Find It?" #4: Which One Is Different? with The Big Four (Leo the Lion, Ella the Elephant, Nico the Rhino,
// Boris the Buffalo). A golden late-afternoon savanna; four little woven baskets stand on a long log. Per round (13 s) four picture cards pop
// up out of the baskets – three are the SAME, one is DIFFERENT – "Which one is different?" appears at the top, one of the friends asks,
// a quiet 3-dot pause (one dot per second) so children can look and point, then the answer: the different card glows and bounces, its name
// appears on it, the three same cards fade a little and the friend says e.g. "Yes! The pear is different!".
// Rounds: apples + pear, ducks + frog, stars + heart, red balls + blue ball, fish + crab, cars + boat. Recap of the six different ones.
// New music: different_long (bansuri-style bamboo flute lead, harp broken chords, soft round bass, shaker; lilting 6/8 in A major).
const C = require('../lib/common'), S = require('../lib/safari');
const St = require('../lib/story');
const { x, W, H, clamp, ease, lerp, win, rr, circ, ell, hash, mix } = C;
const INK = S.INK, G = S.GROUND;

const ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
const FR = { elephant: [92, .56, true], lion: [198, .58, true], rhino: [766, .58, false], buffalo: [874, .56, false] };
const ORDER = ['elephant', 'lion', 'rhino', 'buffalo'];
const SEG = 13, Q0 = .6, Q1 = 4.1, D0 = 4.4, ANS = 7.6, END = 12.4;
const CARD_X = [334, 442, 550, 658], CARD_Y = 286, CW = 96, CHH = 120, BASK_Y = 420;
const WORD_Y = 62, BY = 146;
const TB = !!process.env.THUMBBG;

// ---------- small original objects (centred on 0,0, ~50 px radius) ----------
const st = (lw = 3.5) => { x.lineWidth = lw; x.strokeStyle = INK; x.lineJoin = 'round'; x.lineCap = 'round'; };
const shine = (a, b, r) => circ(a, b, r, 'rgba(255,255,255,.6)');
const eyes = (dx, y, r = 4) => { circ(-dx, y, r, INK); circ(dx, y, r, INK); circ(-dx + 1, y - 1.4, r * .35, '#fff'); circ(dx + 1, y - 1.4, r * .35, '#fff'); };
const smile = (y, r = 7) => { x.beginPath(); x.arc(0, y, r, .3, Math.PI - .3); st(2.6); x.stroke(); };
const O = {
  apple() { x.beginPath(); x.moveTo(0, -30); x.bezierCurveTo(30, -50, 58, -10, 36, 26); x.bezierCurveTo(24, 46, 8, 44, 0, 38); x.bezierCurveTo(-8, 44, -24, 46, -36, 26);
    x.bezierCurveTo(-58, -10, -30, -50, 0, -30); x.closePath(); x.fillStyle = '#e63946'; x.fill(); st(); x.stroke();
    x.beginPath(); x.moveTo(0, -30); x.lineTo(4, -48); st(4); x.stroke(); x.fillStyle = '#52b788'; x.beginPath(); x.ellipse(16, -46, 13, 6, -.4, 0, 7); x.fill(); st(2.5); x.stroke();
    shine(-20, -14, 6); eyes(12, 2); smile(10); },
  pear() { x.beginPath(); x.moveTo(0, -42); x.bezierCurveTo(18, -42, 18, -14, 24, -2); x.bezierCurveTo(46, 20, 34, 48, 0, 48); x.bezierCurveTo(-34, 48, -46, 20, -24, -2);
    x.bezierCurveTo(-18, -14, -18, -42, 0, -42); x.closePath(); x.fillStyle = '#b5d33d'; x.fill(); st(); x.stroke();
    x.beginPath(); x.moveTo(0, -42); x.lineTo(-3, -56); st(4); x.stroke(); x.fillStyle = '#52b788'; x.beginPath(); x.ellipse(10, -54, 11, 5, -.5, 0, 7); x.fill(); st(2.5); x.stroke();
    shine(-14, 8, 6); eyes(11, 14); smile(22); },
  duck() { x.fillStyle = '#ffd23f'; x.beginPath(); x.ellipse(4, 18, 40, 26, 0, 0, 7); x.fill(); st(); x.stroke();
    x.beginPath(); x.moveTo(40, 8); x.quadraticCurveTo(54, 0, 50, 20); x.closePath(); x.fill(); st(3); x.stroke();
    circ(-18, -18, 22, '#ffd23f', INK, 3.5); x.fillStyle = '#ff8c1a'; x.beginPath(); x.ellipse(-42, -12, 12, 6, 0, 0, 7); x.fill(); st(2.5); x.stroke();
    circ(-22, -24, 4, INK); circ(-21, -25.5, 1.4, '#fff'); x.strokeStyle = '#f4b400'; x.lineWidth = 3; x.beginPath(); x.arc(8, 14, 16, 3.6, 5.6); x.stroke(); },
  frog() { x.fillStyle = '#5cbf6a'; x.beginPath(); x.ellipse(0, 16, 44, 30, 0, 0, 7); x.fill(); st(); x.stroke();
    [-1, 1].forEach(s => { circ(s * 20, -16, 15, '#5cbf6a', INK, 3.5); circ(s * 20, -16, 8, '#fff'); circ(s * 20, -15, 5, INK); });
    x.beginPath(); x.arc(0, 10, 18, .25, Math.PI - .25); st(3); x.stroke(); circ(-26, 14, 5, 'rgba(255,120,130,.5)'); circ(26, 14, 5, 'rgba(255,120,130,.5)');
    x.fillStyle = '#4aa65a'; [-1, 1].forEach(s => { x.beginPath(); x.ellipse(s * 30, 42, 14, 6, 0, 0, 7); x.fill(); st(2.5); x.stroke(); }); },
  star() { x.save(); x.translate(0, 4); x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? 24 : 52; x.lineTo(Math.cos(a) * q, Math.sin(a) * q); }
    x.closePath(); x.fillStyle = '#ffd23f'; x.fill(); st(); x.stroke(); eyes(10, -2, 3.6); smile(6, 6); x.restore(); },
  heart() { x.save(); x.translate(0, -4); x.beginPath(); x.moveTo(0, 42); x.bezierCurveTo(-60, 4, -46, -48, 0, -24); x.bezierCurveTo(46, -48, 60, 4, 0, 42); x.closePath();
    x.fillStyle = '#ef476f'; x.fill(); st(); x.stroke(); shine(-22, -16, 6); eyes(12, -2, 3.6); smile(6, 6); x.restore(); },
  redball() { ball('#e63946'); }, blueball() { ball('#1c7ed6'); },
  fish() { x.fillStyle = '#ff9f45'; x.beginPath(); x.moveTo(30, 0); x.lineTo(52, -22); x.lineTo(52, 22); x.closePath(); x.fill(); st(3); x.stroke();
    x.beginPath(); x.ellipse(-4, 0, 40, 28, 0, 0, 7); x.fill(); st(); x.stroke();
    x.strokeStyle = '#fff4e6'; x.lineWidth = 6; [0, 14].forEach(d => { x.beginPath(); x.moveTo(d, -24); x.quadraticCurveTo(d + 6, 0, d, 24); x.stroke(); });
    x.beginPath(); x.ellipse(-4, 0, 40, 28, 0, 0, 7); st(); x.stroke(); circ(-24, -6, 5, INK); circ(-23, -7.6, 1.6, '#fff');
    x.beginPath(); x.arc(-30, 8, 6, .4, Math.PI - .6); st(2.5); x.stroke(); },
  crab() { x.strokeStyle = INK; x.lineWidth = 4; x.lineCap = 'round'; [-1, 1].forEach(s => { for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(s * 26, 10 + i * 8); x.lineTo(s * 46, 20 + i * 10); x.stroke(); } });
    [-1, 1].forEach(s => { x.beginPath(); x.moveTo(s * 28, -4); x.lineTo(s * 40, -26); x.stroke(); circ(s * 42, -34, 12, '#ef6c47', INK, 3); x.fillStyle = '#fffdf6'; x.beginPath(); x.moveTo(s * 42, -34); x.lineTo(s * 54, -42); x.lineTo(s * 54, -30); x.closePath(); x.fill(); });
    x.fillStyle = '#ef6c47'; x.beginPath(); x.ellipse(0, 10, 34, 22, 0, 0, 7); x.fill(); st(); x.stroke();
    [-1, 1].forEach(s => { x.beginPath(); x.moveTo(s * 9, -10); x.lineTo(s * 11, -24); st(3); x.stroke(); circ(s * 11, -26, 6, '#fff', INK, 2.5); circ(s * 11, -26, 3, INK); });
    smile(12, 9); },
  car() { x.fillStyle = '#ff8c1a'; rr(-48, -6, 96, 30, 10); x.fill(); st(); x.stroke();
    x.beginPath(); x.moveTo(-28, -6); x.lineTo(-18, -30); x.lineTo(18, -30); x.lineTo(30, -6); x.closePath(); x.fill(); st(); x.stroke();
    x.fillStyle = '#d8f3ff'; x.beginPath(); x.moveTo(-20, -9); x.lineTo(-13, -25); x.lineTo(-2, -25); x.lineTo(-2, -9); x.closePath(); x.fill(); st(2.5); x.stroke();
    x.beginPath(); x.moveTo(4, -9); x.lineTo(4, -25); x.lineTo(14, -25); x.lineTo(22, -9); x.closePath(); x.fill(); st(2.5); x.stroke();
    [-26, 26].forEach(w => { circ(w, 26, 12, INK); circ(w, 26, 5, '#dfe7ef'); }); circ(44, 4, 4, '#fff6b0', INK, 2); },
  boat() { x.strokeStyle = '#3a86ff'; x.lineWidth = 4; x.lineCap = 'round'; for (let i = -1; i <= 1; i++) { x.beginPath(); x.arc(i * 30, 40, 14, Math.PI * 1.1, Math.PI * 1.9); x.stroke(); }
    x.fillStyle = '#e63946'; x.beginPath(); x.moveTo(-50, 8); x.lineTo(50, 8); x.lineTo(36, 32); x.lineTo(-36, 32); x.closePath(); x.fill(); st(); x.stroke();
    x.beginPath(); x.moveTo(0, 8); x.lineTo(0, -50); st(4); x.stroke();
    x.fillStyle = '#fffdf6'; x.beginPath(); x.moveTo(4, -48); x.lineTo(40, 2); x.lineTo(4, 2); x.closePath(); x.fill(); st(3); x.stroke();
    x.fillStyle = '#ffd23f'; x.beginPath(); x.moveTo(-4, -40); x.lineTo(-30, 2); x.lineTo(-4, 2); x.closePath(); x.fill(); st(3); x.stroke();
    circ(-18, 20, 4, '#fff', INK, 2); circ(0, 20, 4, '#fff', INK, 2); circ(18, 20, 4, '#fff', INK, 2); },
};
function ball(col) { circ(0, 0, 44, col);
  x.save(); x.beginPath(); x.arc(0, 0, 44, 0, 7); x.clip(); x.fillStyle = '#fffdf6'; x.beginPath(); x.ellipse(0, 0, 60, 11, -.5, 0, 7); x.fill();
  x.beginPath(); x.ellipse(0, 0, 60, 11, -.5, 0, 7); st(3); x.stroke(); x.restore();
  circ(0, 0, 44, null, INK, 3.5); shine(-18, -20, 8); }

// [items x4, index of the different one, word, speaker, answer line]
const ROUNDS = [
  [['apple', 'apple', 'pear', 'apple'], 2, 'pear', 'lion', 'Yes! The pear is different!'],
  [['duck', 'duck', 'duck', 'frog'], 3, 'frog', 'elephant', 'Yes! The frog is different!'],
  [['star', 'heart', 'star', 'star'], 1, 'heart', 'rhino', 'Yes! The heart is different!'],
  [['redball', 'redball', 'redball', 'blueball'], 3, 'blue ball', 'buffalo', 'Yes! The blue ball is different!'],
  [['crab', 'fish', 'fish', 'fish'], 0, 'crab', 'lion', 'Yes! The crab is different!'],
  [['car', 'boat', 'car', 'car'], 1, 'boat', 'elephant', 'Yes! The boat is different!'],
];
const QUEST = ['Which one is different?', 'Can you find the different one?', 'Which one is not the same?', 'Which one is different?', 'Can you find the different one?', 'Which one is not the same?'];
const CHIMES = ['A5', 'B5', 'C#6', 'E6', 'F#6', 'A6'];

function obj(name, cx, cy, s) { x.save(); x.translate(cx, cy); x.scale(s, s); O[name](); x.restore(); }
function card(cx, cy, k, o = {}) {
  if (k <= 0) return;
  const s = (.6 + .4 * ease(k)) * (o.scale || 1);
  x.save(); x.globalAlpha = clamp(k * 1.5) * (o.alpha ?? 1); x.translate(cx, cy - (o.hop || 0)); x.scale(s, s);
  if (o.glow) circ(0, 0, 84, `rgba(255,214,70,${.45 * o.glow})`);
  x.fillStyle = '#fffdf6'; x.strokeStyle = o.glow ? '#ffb703' : INK; x.lineWidth = o.glow ? 6 : 4; rr(-CW / 2, -CHH / 2, CW, CHH, 20); x.fill(); x.stroke();
  obj(o.item, 0, o.word ? -12 : 0, o.word ? .68 : .8);
  if (o.word) { x.font = C.FONT(o.wordTxt.length > 6 ? 19 : 23); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = INK; x.globalAlpha *= clamp(o.word); x.fillText(o.wordTxt, 0, CHH / 2 - 19); }
  x.restore();
}
function dots(n, cx, cy) {
  for (let i = 0; i < 3; i++) {
    const on = n > i, p = on ? ease(clamp((n - i) * 3)) : 0;
    circ(cx + (i - 1) * 46, cy, 14, 'rgba(255,255,255,.8)', INK, 3);
    if (on) circ(cx + (i - 1) * 46, cy, 14 * p, INK);
  }
}
// woven basket (cards rise out of it)
function basket(cx, by, wob = 0) {
  x.save(); x.translate(cx, by); x.scale(.86, .86); x.rotate(Math.sin(wob * 30) * .03 * (wob ? 1 : 0));
  x.fillStyle = '#c98b4a'; x.beginPath(); x.moveTo(-42, -34); x.lineTo(42, -34); x.lineTo(32, 6); x.lineTo(-32, 6); x.closePath(); x.fill(); st(3); x.stroke();
  x.strokeStyle = 'rgba(120,70,30,.6)'; x.lineWidth = 2.5; [-20, -6].forEach(y => { x.beginPath(); x.moveTo(-40 + (y + 34) * .25, y); x.lineTo(40 - (y + 34) * .25, y); x.stroke(); });
  for (let i = -3; i <= 3; i++) { x.beginPath(); x.moveTo(i * 12, -34); x.lineTo(i * 9, 6); x.stroke(); }
  x.fillStyle = '#e0a463'; rr(-46, -40, 92, 10, 5); x.fill(); st(3); x.stroke();
  x.restore();
}

// ---------- golden late-afternoon savanna with a long log ----------
function savanna(t) {
  S.setT(t);
  const g = x.createLinearGradient(0, 0, 0, 340); g.addColorStop(0, '#9fd3f0'); g.addColorStop(.6, '#ffe0b0'); g.addColorStop(1, '#ffd08a');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  circ(118, 210, 64, 'rgba(255,214,120,.35)'); circ(118, 210, 42, '#ffc44d');
  for (let i = 0; i < 4; i++) { const cx = ((hash(i + 13) * 1200 + t * (4 + i * 2)) % 1240) - 140, cy = 36 + hash(i + 21) * 60;
    x.fillStyle = 'rgba(255,248,236,.85)'; x.beginPath(); [[0, 0, 16], [20, -8, 21], [42, 0, 16]].forEach(([a, b, r]) => { x.moveTo(cx + a + r, cy + b); x.arc(cx + a, cy + b, r, 0, 7); }); x.fill(); }
  // birds flying home
  x.strokeStyle = 'rgba(80,60,80,.55)'; x.lineWidth = 2.2;
  for (let i = 0; i < 3; i++) { const bx = ((t * 22 + i * 60) % (W + 160)) - 80, byy = 120 + i * 14 + Math.sin(t * 2 + i) * 5, f = Math.sin(t * 9 + i) * 5;
    x.beginPath(); x.moveTo(bx - 9, byy - f); x.quadraticCurveTo(bx - 3, byy - 3, bx, byy); x.quadraticCurveTo(bx + 3, byy - 3, bx + 9, byy - f); x.stroke(); }
  x.fillStyle = '#d8a9b6'; x.beginPath(); x.moveTo(0, 330);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 304 + Math.sin(i * .007 + 2.1) * 16 + Math.sin(i * .019) * 6); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  x.fillStyle = '#e9bd6e'; x.beginPath(); x.moveTo(0, 340);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 336 + Math.sin(i * .012 + 3) * 5); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  S.acacia(880, 352, .5); S.acacia(36, 348, .42); S.giraffeSil(470, 346, .5); S.giraffeSil(512, 350, .4);
  x.fillStyle = '#ddab5c'; x.beginPath(); x.moveTo(0, 386);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 380 + Math.sin(i * .009 + 1) * 6); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  // the long log the baskets stand on
  x.fillStyle = '#9b6a3e'; rr(296, BASK_Y + 4, 392, 26, 13); x.fill(); st(3); x.stroke();
  x.strokeStyle = 'rgba(70,40,15,.45)'; x.lineWidth = 2; [330, 410, 490, 570, 650].forEach(lx => { x.beginPath(); x.moveTo(lx, BASK_Y + 12); x.lineTo(lx + 30, BASK_Y + 14); x.stroke(); });
  circ(684, BASK_Y + 17, 13, '#c48a55', INK, 3); circ(684, BASK_Y + 17, 6, null, 'rgba(70,40,15,.5)', 2);
  x.fillStyle = '#d29a4c'; x.beginPath(); x.ellipse(W / 2, G + 10, 620, 36, 0, 0, 7); x.fill();
  S.grass(392, 14, 3, '#b88c3a');
}
function front() { x.fillStyle = '#c98a3c'; x.fillRect(0, 506, W, 40); S.grass(540, 40, 57, '#a8772b'); S.grass(540, 30, 97, '#c6973f'); }

// ---------- the friends ----------
const say = (c, who) => { const v = c.talk(who); return v > 0 ? (who === 'elephant' ? .12 + v * .04 : v * .45) : 0; };
const walk = (u, a, b, x0, x1) => u < a ? x0 : u > b ? x1 : lerp(x0, x1, ease((u - a) / (b - a)));
const hop = (t, sp = 6, h = 8) => Math.abs(Math.sin(t * sp)) * h;
function friends(c, st = {}) {
  ORDER.forEach((k, i) => {
    const [px0, sc, fl] = FR[k], X = st.x || {}, M = st.mv || {}, L = st.lift || {}, A = st.act || {}, F = st.flip || {};
    S.actor(ANI[k], X[k] ?? px0, !!M[k], Math.max(A[k] || 0, say(c, k)), sc, { flip: F[k] ?? fl, blinkOff: i * .8, phase: i, lift: L[k] || 0 });
  });
}

// ---------- timeline ----------
const rSfx = [], rSays = [];
ROUNDS.forEach(([, , , who, ans], r) => {
  const s = r * SEG;
  [0, 1, 2, 3].forEach(i => rSfx.push([s + .2 + i * .15, 'pop', .28]));
  [0, 1, 2].forEach(i => rSfx.push([s + D0 + .2 + i, 'tick', .45]));
  rSfx.push([s + ANS, `chime:${CHIMES[r]}`, .6], [s + ANS + .15, 'twinkle', .35]);
  if (who === 'elephant') rSfx.push([s + ANS + 1.4, 'trumpet', .12]);
  if (who === 'lion') rSfx.push([s + ANS + 1.4, 'roar', .08]);
  rSays.push([who, QUEST[r], s + Q0, s + Q1, FR[who][0], BY, 28]);
  rSays.push([who, ans, s + ANS + .3, s + END - .2, FR[who][0], BY, 28]);
});

St.episode({
  title: ['Can You Find It?', 64], sub: 'Which One Is Different?', accent: '#e8590c', cardBg: '#fff8ee',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'different', shift: 0 },
  shots: [
    // 1 – the Big Four walk in to the log with the baskets and invite the children to play
    { d: 13, draw: (u, c) => {
        savanna(c.t);
        const X = { elephant: walk(u, 1.4, 5.4, -170, FR.elephant[0]), lion: walk(u, 1.7, 5.6, -120, FR.lion[0]),
                    rhino: walk(u, 1.5, 5.4, W + 140, FR.rhino[0]), buffalo: walk(u, 1.8, 5.7, W + 170, FR.buffalo[0]) };
        const M = { elephant: u > 1.4 && u < 5.4, lion: u > 1.7 && u < 5.6, rhino: u > 1.5 && u < 5.4, buffalo: u > 1.8 && u < 5.7 };
        CARD_X.forEach(bx => basket(bx, BASK_Y));
        friends(c, { x: X, mv: M }); front();
      },
      says: [['lion', "Hello! Let's play a game!", 6.4, 9.4, FR.lion[0], BY, 28], ['elephant', 'Three are the same. One is different!', 9.7, 12.8, FR.elephant[0], BY, 28]],
      sfx: [[6.4, 'roar', .1], [9.7, 'trumpet', .12]] },

    // 2 – six rounds: question, 3-dot pause, answer
    { d: ROUNDS.length * SEG, draw: (u, c) => {
        const r = Math.min(ROUNDS.length - 1, Math.floor(u / SEG)), v = TB ? ANS + 1.5 : u - r * SEG;   // THUMBBG: answer state, no words/dots
        const [items, ai, word, who] = ROUNDS[r];
        savanna(c.t);
        const ansK = clamp((v - ANS) / .5), out = clamp((v - END) / .5);
        const bounce = v >= ANS && v < ANS + 1.2 ? Math.abs(Math.sin((v - ANS) / 1.2 * Math.PI * 2)) * 10 : 0;
        items.forEach((it, i) => {
          const k0 = clamp((v - .2 - i * .15) / .6), k = k0 * (1 - out), good = i === ai;
          const rise = k0 < 1 ? lerp(BASK_Y - 20, CARD_Y, ease(k0)) - Math.sin(k0 * Math.PI) * 16 : CARD_Y;
          card(CARD_X[i], rise + out * 30, k, { item: it, alpha: good ? 1 : 1 - .55 * ansK, scale: good ? 1 + .14 * ease(ansK) : 1 - .06 * ansK, glow: good ? ansK : 0, hop: good ? bounce : 0,
            word: good ? clamp((v - ANS - .3) / .4) : 0, wordTxt: word });
        });
        CARD_X.forEach((bx, i) => basket(bx, BASK_Y, v > .2 + i * .15 && v < .2 + i * .15 + .5 ? 1 : 0));
        const lift = {}, act = {};
        if (v >= ANS && v < ANS + 1.4) { lift[who] = hop(v, 5.4, 10); ORDER.forEach(k => { if (k !== who) lift[k] = hop(v + .3, 5.4, 4); }); }
        if (v >= ANS && v < ANS + .5) act[who] = who === 'elephant' ? .6 : .5;
        friends(c, { lift, act }); front();
        if (!TB && v >= ANS && v < ANS + 1) C.sparkles(CARD_X[ai], CARD_Y, c.t, 10, 80);
        if (!TB) C.bigText(v >= ANS ? 'Different!' : 'Which one is different?', W / 2, WORD_Y, win(v, Q0 - .3, END, .3) * (1 - out), v >= ANS ? 58 : 50, '#e8590c');
        if (v >= D0 - .1 && v < ANS + .2) dots(clamp(v - D0, 0, 3), W / 2, BY);
      },
      says: rSays, sfx: rSfx },

    // 3 – recap: the six different ones light up one by one
    { d: 16, draw: (u, c) => {
        savanna(c.t); friends(c); front();
        x.fillStyle = 'rgba(255,250,242,.9)'; x.fillRect(0, 0, W, H);
        C.bigText('The different ones!', W / 2, 70, win(u, .4, 15.6, .4), 50, '#e8590c');
        ROUNDS.forEach(([items, ai, word], i) => {
          const t0 = 1.6 + i * 1.6, k = clamp((u - t0) / .35), on = u >= t0 && u < t0 + 1.6;
          const cx = 190 + (i % 3) * 290, cy = 196 + Math.floor(i / 3) * 172;
          if (k <= 0) return;
          if (on) circ(cx, cy - 12, 70, 'rgba(255,214,70,.4)');
          const sm = items[ai === 0 ? 1 : 0], s = (on ? 1.08 : 1) * (.6 + .4 * ease(k));
          x.save(); x.globalAlpha = k * .45; obj(sm, cx - 70, cy - 12, .42 * s); obj(sm, cx - 36, cy - 12, .42 * s); x.restore();
          x.save(); x.globalAlpha = k; obj(items[ai], cx + 34, cy - 14, .7 * s); x.restore();
          C.bigText(word, cx, cy + 58, k, 34, '#e8590c');
        });
        C.bigText('Well done!', W / 2, 508, win(u, 12.4, 15.8, .3), 40, '#ffd23f');
      },
      sfx: ROUNDS.map((_, i) => [1.6 + i * 1.6, `chime:${CHIMES[i]}`, .5]).concat([[12.4, 'cheer', .4]]) },

    // 4 – the friends cheer and walk off into the sunset
    { d: 11, draw: (u, c) => {
        savanna(c.t);
        CARD_X.forEach(bx => basket(bx, BASK_Y));
        const L = {}; ORDER.forEach((k, j) => { L[k] = u > .3 && u < 2 ? hop(c.t + j * .6, 4.5, 7) : 0; });
        const go = u > 4.4, X = { elephant: walk(u, 4.4, 9, FR.elephant[0], -200), lion: walk(u, 4.6, 9, FR.lion[0], -150),
          rhino: walk(u, 4.5, 9, FR.rhino[0], W + 160), buffalo: walk(u, 4.7, 9, FR.buffalo[0], W + 190) };
        friends(c, { lift: L, x: X, mv: { elephant: go, lion: go, rhino: go, buffalo: go }, flip: go ? { elephant: false, lion: false, rhino: true, buffalo: true } : {} });
        front();
      },
      says: [['rhino', 'Look closely and you will find it!', .6, 3.6, FR.rhino[0], BY, 28], ['buffalo', 'Bye bye!', 3.8, 5.6, FR.buffalo[0], BY, 28]],
      sfx: [[.4, 'cheer', .3], [4.4, 'trumpet', .1]] },
  ],
});
