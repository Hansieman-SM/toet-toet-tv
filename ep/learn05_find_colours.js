// Learning series – "Can You Find It?" #1: Colours with Little Truck Toet (slow "pause and answer" format, approved 2026-11-08).
// Toet parks by the road and plays a finding game. Per colour (13 s): three picture cards pop up, the colour word appears at the top
// in its own colour, Toet asks "Can you find something RED?", then a quiet 3-dot pause (one dot per second) so children can point,
// then the answer: the right card glows and bounces, the others fade, the word appears on the card and Toet says "Yes! The apple is red!".
// Colours: red apple, blue umbrella, yellow duck, green leaf, orange carrot, purple grapes. Recap of the 6 colours, Toet drives off.
// New music: findit_long (harmonica lead, fingerpicked arpeggios, walking bass, brushes + triangle; F major shuffle).
const C = require('../lib/common'), T = require('../lib/toet');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, rr, circ, ell, INK } = C;

const BX = 170;                                   // Toet's screen x (cab front ~ BX+222)
const SEG = 13, Q0 = .6, Q1 = 4.1, D0 = 4.4, ANS = 7.6, END = 12.4;
const CARD_X = [545, 700, 855], CARD_Y = 266, CW = 130, CHH = 150;

// ---------- simple original objects (centred on 0,0, ~55 px radius) ----------
const st = (lw = 3.5) => { x.lineWidth = lw; x.strokeStyle = INK; x.lineJoin = 'round'; x.lineCap = 'round'; };
const eyes = (ax, ay, r = 5) => { circ(ax, ay, r, INK); circ(ax + r * .3, ay - r * .35, r * .36, '#fff'); };
const shine = (a, b, r) => circ(a, b, r, 'rgba(255,255,255,.6)');
const O = {
  apple() { circ(-14, 6, 38, '#e63946', INK, 3.5); circ(14, 6, 38, '#e63946'); x.beginPath(); x.arc(14, 6, 38, -1.4, 1.6); st(); x.stroke();
    x.strokeStyle = '#6b4f3a'; x.lineWidth = 6; x.beginPath(); x.moveTo(0, -28); x.lineTo(4, -50); x.stroke(); ell(22, -44, 15, 7, '#3fbf6e', INK, 2.5); shine(-24, -8, 8); },
  umbrella() { x.strokeStyle = INK; x.lineWidth = 5; x.lineCap = 'round'; x.beginPath(); x.moveTo(0, -30); x.lineTo(0, 40); x.arc(-10, 40, 10, 0, Math.PI); x.stroke();
    x.beginPath(); x.moveTo(-56, -6); x.quadraticCurveTo(-54, -54, 0, -56); x.quadraticCurveTo(54, -54, 56, -6);
    for (let i = 3; i >= 0; i--) { const a = -56 + i * 28; x.quadraticCurveTo(a + 42 - 28, -18, a, -6); }
    x.closePath(); x.fillStyle = '#3a86ff'; x.fill(); st(); x.stroke();
    x.beginPath(); x.moveTo(0, -56); x.quadraticCurveTo(-14, -30, -28, -6); x.moveTo(0, -56); x.quadraticCurveTo(14, -30, 28, -6); st(2.5); x.stroke(); circ(0, -60, 5, INK); },
  duck() { x.save(); x.scale(.9, .9); x.translate(-8, 16);
    x.beginPath(); x.moveTo(-60, 0); x.quadraticCurveTo(-70, -40, -40, -30); x.quadraticCurveTo(0, -40, 40, -20); x.quadraticCurveTo(60, 30, 0, 36); x.quadraticCurveTo(-56, 36, -60, 0); x.fillStyle = '#ffd23f'; x.fill(); st(); x.stroke();
    x.beginPath(); x.moveTo(-20, 0); x.quadraticCurveTo(4, 20, 24, -2); st(3); x.stroke();
    circ(36, -42, 26, '#ffd23f', INK, 3.5); x.beginPath(); x.moveTo(58, -46); x.quadraticCurveTo(80, -42, 78, -34); x.quadraticCurveTo(66, -30, 56, -34); x.closePath(); x.fillStyle = '#ff9f1c'; x.fill(); x.stroke();
    eyes(42, -50, 5); x.restore(); },
  leaf() { x.save(); x.rotate(-.5); x.beginPath(); x.moveTo(0, 52); x.bezierCurveTo(-48, 18, -40, -36, 0, -56); x.bezierCurveTo(40, -36, 48, 18, 0, 52); x.fillStyle = '#52b788'; x.fill(); st(); x.stroke();
    x.beginPath(); x.moveTo(0, 64); x.lineTo(0, -42); [-28, -6, 14].forEach(b => { x.moveTo(0, b + 15); x.lineTo(-20, b); x.moveTo(0, b + 15); x.lineTo(20, b); }); st(2.5); x.stroke(); x.restore(); },
  carrot() { x.save(); x.rotate(.35);
    x.fillStyle = '#3fbf6e'; [-12, 0, 12].forEach(a => { x.save(); x.translate(a * .7, -38); x.rotate(a * .05); x.beginPath(); x.ellipse(0, -14, 6, 17, 0, 0, 7); x.fill(); st(2.5); x.stroke(); x.restore(); });
    x.beginPath(); x.moveTo(-22, -36); x.quadraticCurveTo(-20, 10, 0, 56); x.quadraticCurveTo(20, 10, 22, -36); x.quadraticCurveTo(0, -44, -22, -36); x.fillStyle = '#ff8c1a'; x.fill(); st(); x.stroke();
    x.beginPath(); [[-14, -14], [12, 0], [-8, 18]].forEach(([a, b]) => { x.moveTo(a, b); x.lineTo(a + 8 * Math.sign(-a), b + 2); }); st(2.5); x.stroke(); x.restore(); },
  grapes() { x.strokeStyle = '#6b4f3a'; x.lineWidth = 6; x.beginPath(); x.moveTo(0, -40); x.lineTo(4, -58); x.stroke(); ell(20, -50, 15, 7, '#3fbf6e', INK, 2.5);
    [[-22, -26], [0, -30], [22, -26], [-11, -6], [11, -6], [-22, 13], [0, 14], [22, 13], [-11, 32], [11, 32], [0, 50]].forEach(([a, b]) => { circ(a, b, 13.5, '#9b5de5', INK, 3); circ(a - 4, b - 4, 3.6, 'rgba(255,255,255,.55)'); }); },
  // generic one-colour distractors
  ball(col) { circ(0, 0, 46, col, INK, 3.5); x.beginPath(); x.arc(0, 0, 46, 0, 7); x.save(); x.clip(); x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 6; x.beginPath(); x.arc(-70, 0, 70, -.6, .6); x.stroke(); x.restore(); shine(-18, -20, 8); },
  balloon(col) { x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.moveTo(0, 30); x.bezierCurveTo(-12, 44, 12, 52, 0, 64); x.stroke();
    ell(0, -12, 36, 44, col, INK, 3.5); x.beginPath(); x.moveTo(-6, 34); x.lineTo(6, 34); x.lineTo(0, 28); x.closePath(); x.fillStyle = col; x.fill(); st(2.5); x.stroke(); shine(-14, -30, 8); },
  star(col) { x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 24 : 54; x.lineTo(Math.cos(a) * r, 4 + Math.sin(a) * r); } x.closePath(); x.fillStyle = col; x.fill(); st(); x.stroke(); shine(-10, -8, 6); },
  flower(col) { x.strokeStyle = '#3fbf6e'; x.lineWidth = 6; x.beginPath(); x.moveTo(0, 10); x.lineTo(0, 62); x.stroke();
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; circ(Math.cos(a) * 26, -10 + Math.sin(a) * 26, 18, col, INK, 3); } circ(0, -10, 16, '#fff3b0', INK, 3); },
};
const COL = { red: '#e63946', blue: '#3a86ff', yellow: '#ffd23f', green: '#52b788', orange: '#ff8c1a', purple: '#9b5de5' };
// [colour, answer index, [cards], answer word, Toet's answer line]
const ROUNDS = [
  ['RED', 'red', 1, [['ball', COL.blue], ['apple'], ['star', COL.yellow]], 'apple', 'Yes! The apple is red!'],
  ['BLUE', 'blue', 0, [['umbrella'], ['balloon', COL.green], ['flower', COL.orange]], 'umbrella', 'Yes! The umbrella is blue!'],
  ['YELLOW', 'yellow', 2, [['ball', COL.purple], ['balloon', COL.red], ['duck']], 'duck', 'Yes! The duck is yellow!'],
  ['GREEN', 'green', 1, [['star', COL.blue], ['leaf'], ['flower', COL.yellow]], 'leaf', 'Yes! The leaf is green!'],
  ['ORANGE', 'orange', 0, [['carrot'], ['ball', COL.green], ['balloon', COL.purple]], 'carrot', 'Yes! The carrot is orange!'],
  ['PURPLE', 'purple', 2, [['flower', COL.red], ['star', COL.orange], ['grapes']], 'grapes', 'Yes! The grapes are purple!'],
];
const CHIMES = ['C5', 'D5', 'E5', 'G5', 'A5', 'C6'];

function obj([name, col], cx, cy, s) { x.save(); x.translate(cx, cy); x.scale(s, s); O[name](col); x.restore(); }
function card(cx, cy, k, o = {}) {
  if (k <= 0) return;
  const s = (.6 + .4 * ease(k)) * (o.scale || 1);
  x.save(); x.globalAlpha = clamp(k * 1.5) * (o.alpha ?? 1); x.translate(cx, cy + (o.hop || 0) * -1); x.scale(s, s);
  if (o.glow) { circ(0, 0, 96, `rgba(255,214,70,${.45 * o.glow})`); }
  x.fillStyle = '#ffffff'; x.strokeStyle = o.glow ? '#ffb703' : INK; x.lineWidth = o.glow ? 6 : 4; rr(-CW / 2, -CHH / 2, CW, CHH, 22); x.fill(); x.stroke();
  obj(o.item, 0, o.word ? -14 : 0, o.word ? .82 : .95);
  if (o.word) { x.font = C.FONT(26); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = INK; x.globalAlpha *= clamp(o.word); x.fillText(o.wordTxt, 0, CHH / 2 - 24); }
  x.restore();
}
function dots(n, k, cx, cy) {
  for (let i = 0; i < 3; i++) {
    const on = n > i, p = on ? ease(clamp((n - i) * 3)) : 0;
    circ(cx + (i - 1) * 46, cy, 14, 'rgba(255,255,255,.75)', INK, 3);
    if (on) circ(cx + (i - 1) * 46, cy, 14 * p, INK);
  }
}
function scene(c, dist = 0) { T.world({ t: c.t, dist, skyP: .12, near: 'trees' }); }
function truck(c, o = {}) { return T.truck(Object.assign({ t: c.t, dist: 0, moving: false, bx: BX, happy: true, mouth: c.talk('toet') }, o)); }

// per-round sfx + speech
const rSfx = [], rSays = [];
ROUNDS.forEach(([W1, , , , word, ans], r) => {
  const s = r * SEG;
  rSfx.push([s + .05, 'pop', .35], [s + .2, 'pop', .3], [s + .35, 'pop', .3]);
  [0, 1, 2].forEach(i => rSfx.push([s + D0 + .2 + i, 'tick', .45]));
  rSfx.push([s + ANS, `chime:${CHIMES[r]}`, .6], [s + ANS + .15, 'twinkle', .35]);
  rSays.push(['toet', `Can you find something ${W1}?`, s + Q0, s + Q1, 290, 112, 28]);
  rSays.push(['toet', ans, s + ANS + .3, s + END - .2, 290, 112, 28]);
});

St.episode({
  title: ['Can You Find It?', 64], sub: 'Colors with Little Truck Toet', accent: '#3a86ff', cardBg: '#eef6ff',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'findit', shift: 0 },
  shots: [
    // 1 – Toet drives in, parks and invites the children to play
    { d: 13, draw: (u, c) => {
        const k = ease(clamp((u - 1.2) / 5)), bx = lerp(-330, BX, k), mv = u > 1.2 && u < 6.2;
        scene(c, k * 560);
        truck(c, { bx, moving: mv, dist: k * 560 });
      },
      says: [['toet', "Hi! Let's play a game!", 6.8, 9.6, 300, 200, 28], ['toet', 'Can you find the right color?', 9.9, 12.8, 320, 200, 28]],
      sfx: [[6.4, 'honk', .5]] },

    // 2 – six rounds: question, 3-dot pause, answer
    { d: ROUNDS.length * SEG, draw: (u, c) => {
        const r = Math.min(ROUNDS.length - 1, Math.floor(u / SEG)), TB = !!process.env.THUMBBG, v = TB ? ANS + 1.5 : u - r * SEG;   // THUMBBG: answer state, no colour word/dots (title goes on top)
        const [WORD, cname, ai, items, word] = ROUNDS[r];
        scene(c);
        const ansK = clamp((v - ANS) / .5), out = clamp((v - END) / .5);
        const hop = v >= ANS && v < ANS + 1.2 ? Math.abs(Math.sin((v - ANS) / 1.2 * Math.PI * 2)) * 10 : 0;
        truck(c, { hop: hop * .5, mouth: Math.max(c.talk('toet'), v >= ANS && v < ANS + .4 ? .6 : 0) });
        items.forEach((it, i) => {
          const k = clamp((v - i * .15) / .45) * (1 - out);
          const good = i === ai;
          card(CARD_X[i], CARD_Y, k, { item: it, alpha: good ? 1 : 1 - .65 * ansK, scale: good ? 1 + .14 * ease(ansK) : 1 - .06 * ansK, glow: good ? ansK : 0, hop: good ? hop : 0,
            word: good ? clamp((v - ANS - .3) / .4) : 0, wordTxt: word });
        });
        if (!TB && v >= ANS && v < ANS + 1) C.sparkles(CARD_X[ai], CARD_Y, c.t, 10, 90);
        if (!TB) C.bigText(WORD, 714, 116, win(v, Q0, END, .3) * (1 - out), 62, COL[cname]);
        if (v >= D0 - .1 && v < ANS + .2) dots(clamp(v - D0, 0, 3), 1, 300, 210);
      },
      says: rSays, sfx: rSfx },

    // 3 – recap: the six colours light up one by one
    { d: 16, draw: (u, c) => {
        scene(c);
        x.fillStyle = 'rgba(245,250,255,.88)'; x.fillRect(0, 0, W, 540);
        C.bigText("Let's say the colors!", W / 2, 76, win(u, .4, 15.6, .4), 50, '#3a86ff');
        ROUNDS.forEach(([WORD, cname, ai, items], i) => {
          const t0 = 1.6 + i * 1.6, k = clamp((u - t0) / .35), on = u >= t0 && u < t0 + 1.6;
          const cx = 190 + (i % 3) * 290, cy = 196 + Math.floor(i / 3) * 176;
          if (k <= 0) return;
          if (on) circ(cx, cy - 6, 70, 'rgba(255,214,70,.45)');
          x.save(); x.globalAlpha = k; obj(items[ai], cx, cy - 18, (.55 + .33 * ease(k)) * (on ? 1.08 : 1)); x.restore();
          C.bigText(WORD, cx, cy + 66, k, 36, COL[cname]);
        });
        C.bigText("Well done!", W / 2, 510, win(u, 12.4, 15.8, .3), 40, '#ffd23f');
      },
      sfx: ROUNDS.map((_, i) => [1.6 + i * 1.6, `chime:${CHIMES[i]}`, .5]).concat([[12.4, 'cheer', .4]]) },

    // 4 – Toet drives off
    { d: 11, draw: (u, c) => {
        const k = ease(clamp((u - 4.2) / 5)), bx = lerp(BX, 1150, k);
        scene(c, k * 900);
        truck(c, { bx, moving: u > 4.2, dist: k * 900 });
      },
      says: [['toet', 'Colors are everywhere! Bye bye!', .8, 4.2, 320, 200, 28]],
      sfx: [[4.4, 'honk', .5]] },
  ],
});
