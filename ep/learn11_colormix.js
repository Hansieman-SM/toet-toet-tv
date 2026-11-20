// Learning series #14 – Toet's Color Mixing (approved 2026-11-12, learning slot, slow "pause and answer" pace).
// Little Truck Toet parks next to a big white mixing bowl. Per round (15 s): two paint cans pop up, Toet asks "Red and yellow make...?",
// both cans tilt and pour into the bowl, the two colours swirl, a quiet 3-dot pause ("What will it be?"), then the reveal: the paint turns
// ORANGE with a little splash, gets a happy face, the colour word appears in its own colour and Toet says "Red and yellow make orange!".
// Rounds: red + yellow = orange, blue + yellow = green, red + blue = purple, red + white = pink, blue + white = light blue.
// Recap of all five mixes as little paint-dot sums, Toet drives off. New music: colormix_long (xylophone + bell, harp arpeggios, E-flat).
const C = require('../lib/common'), T = require('../lib/toet');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, rr, circ, ell, INK } = C;

const BX = 110;                                    // Toet's screen x (cab front ~ BX+222)
const SEG = 15, Q0 = .6, Q1 = 4.2, P0 = 3.0, P1 = 6.4, D0 = 5.2, ANS = 8.4, END = 14.2;
const BOWL = [690, 372], CAN_L = [530, 250], CAN_R = [850, 250];
const COL = { red: '#e63946', yellow: '#ffd23f', blue: '#3a86ff', white: '#ffffff', orange: '#ff8c1a', green: '#40c057', purple: '#9b5de5', pink: '#ff8fc8', 'light blue': '#8fd3ff' };
// [left, right, result]
const ROUNDS = [['red', 'yellow', 'orange'], ['blue', 'yellow', 'green'], ['red', 'blue', 'purple'], ['red', 'white', 'pink'], ['blue', 'white', 'light blue']];
const CHIMES = ['C5', 'E5', 'G5', 'A5', 'C6'];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

// ---------- paint can (origin = bottom centre), tilt in radians (+ = pour to the right) ----------
function can(cx, cy, col, word, k, tilt, t) {
  if (k <= 0) return;
  const s = .6 + .4 * ease(k);
  x.save(); x.globalAlpha = clamp(k * 1.5); x.translate(cx, cy); x.scale(s, s);
  const px = tilt > 0 ? 38 : -38; x.translate(px, 0); x.rotate(tilt); x.translate(-px, 0);
  // handle
  x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.arc(0, -86, 44, Math.PI * 1.05, Math.PI * 1.95); x.stroke();
  // body
  x.fillStyle = '#e9eef3'; x.strokeStyle = INK; x.lineWidth = 4;
  x.beginPath(); x.moveTo(-38, -86); x.lineTo(-38, -6); x.quadraticCurveTo(0, 8, 38, -6); x.lineTo(38, -86); x.closePath(); x.fill(); x.stroke();
  // colour band with the word
  x.fillStyle = col; x.fillRect(-36, -64, 72, 34); x.strokeStyle = INK; x.lineWidth = 2.5; x.strokeRect(-36, -64, 72, 34);
  x.fillStyle = word === 'white' || word === 'yellow' ? INK : '#ffffff'; x.font = C.FONT(word.length > 5 ? 19 : 22); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(word, 0, -46);
  // drip
  x.fillStyle = col; x.beginPath(); x.moveTo(14, -86); x.quadraticCurveTo(16, -70, 20, -72); x.quadraticCurveTo(24, -76, 24, -86); x.fill();
  // top with paint
  ell(0, -86, 38, 11, col, INK, 4);
  x.restore();
}
// pour stream from a tilted can into the bowl
function stream(fromX, fromY, col, k, t) {
  if (k <= 0) return;
  const tx = BOWL[0] + (fromX < BOWL[0] ? -22 : 22), ty = BOWL[1] - 28;
  x.save(); x.globalAlpha = k; x.strokeStyle = INK; x.lineWidth = 15; x.lineCap = 'round';
  const mx = (fromX + tx) / 2, my = fromY - 10;
  x.beginPath(); x.moveTo(fromX, fromY); x.quadraticCurveTo(mx, my, tx, ty); x.stroke();
  x.strokeStyle = col; x.lineWidth = 9; x.beginPath(); x.moveTo(fromX, fromY); x.quadraticCurveTo(mx, my, tx, ty); x.stroke();
  x.restore();
}
// the mixing bowl: fillK 0..1, colours a/b swirl, mix 0..1 = blended to result colour, face after reveal
function bowl(t, fillK, a, b, res, mix, face, hop = 0) {
  const [cx, cy0] = BOWL, cy = cy0 - hop;
  x.save();
  x.fillStyle = 'rgba(0,0,0,.15)'; x.beginPath(); x.ellipse(cx, cy0 + 70, 110, 10, 0, 0, 7); x.fill();
  // back rim
  ell(cx, cy - 30, 118, 26, '#f1f3f5', INK, 4);
  // paint surface (clipped to the inner rim)
  if (fillK > 0) {
    x.save(); x.beginPath(); x.ellipse(cx, cy - 30, 108, 21, 0, 0, 7); x.clip();
    const lvl = cy - 30 + (1 - fillK) * 16;
    ell(cx, lvl + 4, 108 * (.5 + .5 * fillK), 20, a);
    if (mix < 1) { x.globalAlpha = 1 - mix;
      x.strokeStyle = b; x.lineWidth = 9; x.lineCap = 'round';
      for (let i = 0; i < 3; i++) { x.beginPath(); for (let s = 0; s <= 30; s++) { const an = t * 2.2 + i * 2.1 + s * .2, r = s * 3.1 * fillK; const px = cx + Math.cos(an) * r, py = lvl + 4 + Math.sin(an) * r * .18; s ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); }
      x.globalAlpha = 1; }
    if (mix > 0) { x.globalAlpha = mix; ell(cx, lvl + 4, 108, 20, res); x.globalAlpha = 1; }
    x.restore();
  }
  // bowl body (front)
  x.fillStyle = '#ffffff'; x.strokeStyle = INK; x.lineWidth = 4;
  x.beginPath(); x.moveTo(cx - 118, cy - 30); x.quadraticCurveTo(cx - 112, cy + 60, cx, cy + 64); x.quadraticCurveTo(cx + 112, cy + 60, cx + 118, cy - 30);
  x.ellipse(cx, cy - 30, 118, 26, 0, 0, Math.PI, false); x.closePath(); x.fill(); x.stroke();
  // coloured stripe on the bowl
  x.save(); x.beginPath(); x.moveTo(cx - 118, cy - 30); x.quadraticCurveTo(cx - 112, cy + 60, cx, cy + 64); x.quadraticCurveTo(cx + 112, cy + 60, cx + 118, cy - 30); x.ellipse(cx, cy - 30, 118, 26, 0, 0, Math.PI, false); x.closePath(); x.clip();
  [['#ff6b6b', 4], ['#ffd23f', 18], ['#4dabf7', 32]].forEach(([c2, d]) => { x.strokeStyle = c2; x.lineWidth = 6; x.beginPath(); x.ellipse(cx, cy - 6 + d, 120, 26, 0, .12, Math.PI - .12); x.stroke(); });
  x.restore();
  // happy face on the bowl after the reveal
  if (face > 0) { x.save(); x.globalAlpha = face; const blink = t % 3.7 > 3.55;
    if (blink) { x.fillStyle = INK; x.fillRect(cx - 32, cy + 22, 14, 3); x.fillRect(cx + 18, cy + 22, 14, 3); }
    else { circ(cx - 25, cy + 22, 7, INK); circ(cx + 25, cy + 22, 7, INK); circ(cx - 23, cy + 20, 2.4, '#fff'); circ(cx + 27, cy + 20, 2.4, '#fff'); }
    x.strokeStyle = INK; x.lineWidth = 3.5; x.beginPath(); x.arc(cx, cy + 32, 13, .3, Math.PI - .3); x.stroke();
    circ(cx - 46, cy + 36, 7, 'rgba(255,110,120,.45)'); circ(cx + 46, cy + 36, 7, 'rgba(255,110,120,.45)');
    x.restore(); }
  x.restore();
}
function splash(col, k) {
  if (k <= 0 || k >= 1) return;
  const [cx, cy] = BOWL;
  for (let i = 0; i < 9; i++) { const an = Math.PI * (1.1 + i * .1), r = 40 + k * 70;
    circ(cx + Math.cos(an) * r * 1.3, cy - 40 + Math.sin(an) * r * .9 + k * k * 60, 8 * (1 - k) + 2, col, INK, 2); }
}
function dots(n, cx, cy) {
  for (let i = 0; i < 3; i++) {
    const on = n > i, p = on ? ease(clamp((n - i) * 3)) : 0;
    circ(cx + (i - 1) * 46, cy, 14, 'rgba(255,255,255,.8)', INK, 3);
    if (on) circ(cx + (i - 1) * 46, cy, 14 * p, INK);
  }
}
function scene(c, dist = 0) { T.world({ t: c.t, dist, skyP: .12, near: 'trees' }); }
function truck(c, o = {}) { return T.truck(Object.assign({ t: c.t, dist: 0, moving: false, bx: BX, happy: true, mouth: c.talk('toet') }, o)); }

// per-round sfx + speech
const rSfx = [], rSays = [];
ROUNDS.forEach(([a, b, r], i) => {
  const s = i * SEG;
  rSfx.push([s + .05, 'pop', .35, .2], [s + .25, 'pop', .35, .6]);
  rSfx.push([s + P0 + .4, 'blub', .35, .3], [s + P0 + 1.4, 'blub', .3, .3], [s + P0 + 2.4, 'blub', .3, .3]);
  [0, 1, 2].forEach(k => rSfx.push([s + D0 + .2 + k, 'tick', .45]));
  rSfx.push([s + ANS, `chime:${CHIMES[i]}`, .6], [s + ANS + .1, 'splash', .25, .3], [s + ANS + .2, 'twinkle', .35]);
  rSays.push(['toet', `${cap(a)} and ${b} make...?`, s + Q0, s + Q1, 250, 140, 28]);
  rSays.push(['toet', `${cap(a)} and ${b} make ${r}!`, s + ANS + .4, s + END - .2, 250, 140, 28]);
});

St.episode({
  title: ["Toet's Color Mixing", 64], sub: 'Mixing with Little Truck Toet', accent: '#9b5de5', cardBg: '#fbf4ff',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'colormix', shift: 0 },
  shots: [
    // 1 – Toet drives in and parks next to the big mixing bowl
    { d: 13, draw: (u, c) => {
        const k = ease(clamp((u - 1.2) / 5)), bx = lerp(-330, BX, k), mv = u > 1.2 && u < 6.2;
        scene(c, k * 560);
        x.save(); x.translate((1 - k) * 560, 0); bowl(c.t, 0, '#fff', '#fff', '#fff', 0, 0); x.restore();
        truck(c, { bx, moving: mv, dist: k * 560 });
      },
      says: [['toet', "Hi! Let's mix some colors!", 6.8, 9.6, 300, 200, 28], ['toet', 'What new color will we make?', 9.9, 12.8, 320, 200, 28]],
      sfx: [[6.4, 'honk', .5]] },

    // 2 – five rounds: two cans, pour, swirl, 3-dot pause, reveal
    { d: ROUNDS.length * SEG, draw: (u, c) => {
        const r = Math.min(ROUNDS.length - 1, Math.floor(u / SEG)), TB = !!process.env.THUMBBG, v = TB ? P0 + 1.6 : u - r * SEG;
        const [a, b, res] = ROUNDS[r], ca = COL[a], cb = COL[b], cr = COL[res];
        scene(c);
        const out = clamp((v - END) / .5), tilt = ease(clamp((v - P0) / .7)) * (1 - ease(clamp((v - P1) / .7)));
        const fillK = TB ? .8 : clamp((v - P0 - .5) / 3) * (1 - out), mix = TB ? 0 : ease(clamp((v - ANS) / .6)), face = clamp((v - ANS - .3) / .4) * (1 - out);
        const hop = v >= ANS && v < ANS + 1.2 ? Math.abs(Math.sin((v - ANS) / 1.2 * Math.PI * 2)) * 8 : 0;
        truck(c, { hop: hop * .5, mouth: Math.max(c.talk('toet'), v >= ANS && v < ANS + .4 ? .6 : 0) });
        x.save(); x.globalAlpha = 1 - out; bowl(c.t, fillK, ca, cb, cr, mix, face, hop); x.restore();
        const kL = clamp(v / .45) * (1 - clamp((v - P1 - 1.2) / .6)), kR = clamp((v - .2) / .45) * (1 - clamp((v - P1 - 1.2) / .6));
        can(CAN_L[0], CAN_L[1], ca, a, kL, tilt * 1.0, c.t);
        can(CAN_R[0], CAN_R[1], cb, b, kR, -tilt * 1.0, c.t);
        const sk = clamp((tilt - .8) / .2);
        stream(CAN_L[0] + 60, CAN_L[1] - 64, ca, sk * kL, c.t); stream(CAN_R[0] - 60, CAN_R[1] - 64, cb, sk * kR, c.t);
        if (!TB) splash(cr, (v - ANS) / .9);
        if (!TB && v >= ANS && v < ANS + 1.2) C.sparkles(BOWL[0], BOWL[1] - 30, c.t, 10, 120);
        if (!TB) C.bigText(res.toUpperCase(), BOWL[0], 96, win(v, ANS + .3, END, .3) * (1 - out), 62, cr);
        if (!TB) C.bigText('What will it be?', BOWL[0], 96, win(v, D0, ANS, .3), 44, '#ffffff');
        if (!TB && v >= D0 - .1 && v < ANS + .2) dots(clamp(v - D0, 0, 3), 260, 226);
      },
      says: rSays, sfx: rSfx },

    // 3 – recap: the five mixes as paint-dot sums
    { d: 18, draw: (u, c) => {
        scene(c);
        x.fillStyle = 'rgba(250,246,255,.9)'; x.fillRect(0, 0, W, 540);
        C.bigText("Let's mix again!", W / 2, 66, win(u, .4, 17.6, .4), 50, '#9b5de5');
        ROUNDS.forEach(([a, b, res], i) => {
          const t0 = 1.6 + i * 2.2, k = clamp((u - t0) / .35), on = u >= t0 && u < t0 + 2.2, cy = 138 + i * 76;
          if (k <= 0) return;
          x.save(); x.globalAlpha = k;
          if (on) { x.fillStyle = 'rgba(255,214,70,.35)'; rr(150, cy - 34, 660, 68, 34); x.fill(); }
          circ(250, cy, 24, COL[a], INK, 3); circ(350, cy, 24, COL[b], INK, 3); circ(450, cy, 28, COL[res], INK, 3);
          x.font = C.FONT(40); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = INK; x.fillText('+', 300, cy + 2); x.fillText('=', 400, cy + 2);
          x.restore();
          x.font = C.FONT(40); C.bigText(res, 500 + x.measureText(res).width / 2, cy + 2, k, 40, COL[res]);
        });
        C.bigText('Well done!', W / 2, 512, win(u, 13.4, 17.8, .3), 36, '#ffd23f');
      },
      sfx: ROUNDS.map((_, i) => [1.6 + i * 2.2, `chime:${CHIMES[i]}`, .5]).concat([[13.4, 'cheer', .4]]) },

    // 4 – Toet drives off
    { d: 11, draw: (u, c) => {
        const k = ease(clamp((u - 4.2) / 5)), bx = lerp(BX, 1150, k);
        scene(c, k * 900);
        x.save(); x.translate(-k * 900, 0); bowl(c.t, 0, '#fff', '#fff', '#fff', 0, 0); x.restore();
        truck(c, { bx, moving: u > 4.2, dist: k * 900 });
      },
      says: [['toet', 'Mixing colors is fun! Bye bye!', .8, 4.2, 320, 200, 28]],
      sfx: [[4.4, 'honk', .5]] },
  ],
});
