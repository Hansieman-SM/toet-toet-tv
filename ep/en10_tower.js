// The Big Four – Tall Tower! (English story episode: building a tower of five coloured blocks.
// Learning moments: big ↔ small, counting 1–5, colours, and "if it falls down, try again!").
// The first tower (small block at the bottom, big block on top) wobbles and falls; Ella's idea: big blocks at the bottom, small blocks on top;
// the friends sort the blocks from big to small and build again: 1 red, 2 orange, 3 yellow, 4 green, 5 blue – and a star on top.
// The tower is taller than Ella! Sunset recap. New music: tower_long (ragtime-style honky-tonk piano).
const C = require('../lib/common'), S = require('../lib/safari');
const St = require('../lib/story');
const { x, W, H, clamp, ease, lerp, win, rr } = C;
const G = S.GROUND, ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
const INK = '#3a2414';

// ---------- the blocks ----------
const B = [
  { name: 'red', word: 'Red', col: '#e63946', dark: '#b02532', w: 124, h: 54 },
  { name: 'orange', word: 'Orange', col: '#ff9f1c', dark: '#cc7a0a', w: 104, h: 48 },
  { name: 'yellow', word: 'Yellow', col: '#ffd23f', dark: '#d9a90f', w: 86, h: 43 },
  { name: 'green', word: 'Green', col: '#3fae5a', dark: '#2a8443', w: 70, h: 38 },
  { name: 'blue', word: 'Blue', col: '#3a86ff', dark: '#2563c9', w: 56, h: 34 },
];
const TX = 480;                                       // tower position (on the ground line G)
const FRONT = 500;                                    // front row ground line (in front of the friends)
// where the blocks lie on the grass (start + after the fall): [cx, ground y, rotation]
const SC = [[318, FRONT, .04], [612, FRONT + 4, -.06], [420, FRONT + 6, -.03], [520, FRONT + 2, .05], [694, FRONT, .08]];
// sorted row (big → small), scale .8
const RS = .8, ROWX = (() => { let px = 300, r = []; B.forEach(b => { r.push(px + b.w * RS / 2); px += b.w * RS + 14; }); return r; })();
// bottom y of block i in the good tower (order 0..4)
const towerY = order => G - order.reduce((s, i) => s + B[i].h, 0);

function block(i, cx, by, s = 1, rot = 0, glow = 0) {
  const b = B[i];
  x.save(); x.translate(cx, by); x.rotate(rot); x.scale(s, s);
  if (glow > 0) { x.fillStyle = `rgba(255,255,220,${.6 * glow})`; rr(-b.w / 2 - 12, -b.h - 12, b.w + 24, b.h + 24, 18); x.fill(); }
  x.fillStyle = b.col; x.strokeStyle = INK; x.lineWidth = 3.5; rr(-b.w / 2, -b.h, b.w, b.h, 9); x.fill(); x.stroke();
  x.fillStyle = 'rgba(255,255,255,.35)'; rr(-b.w / 2 + 7, -b.h + 6, b.w - 14, 8, 4); x.fill();
  x.fillStyle = b.dark; rr(-b.w / 2 + 5, -12, b.w - 10, 7, 3); x.fill();
  // a little shape on the front
  x.fillStyle = 'rgba(255,255,255,.85)'; const r = Math.min(b.h * .22, 10);
  x.beginPath(); for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * Math.PI / 5, q = j % 2 ? r * .45 : r; x.lineTo(Math.cos(a) * q, -b.h / 2 + 1 + Math.sin(a) * q); } x.closePath(); x.fill();
  x.restore();
}
function shadow(cx, by, w) { x.fillStyle = 'rgba(70,40,10,.2)'; x.beginPath(); x.ellipse(cx, by + 2, w * .55, 5, 0, 0, 7); x.fill(); }
function star(cx, cy, r, rot = 0) {
  x.save(); x.translate(cx, cy); x.rotate(rot);
  x.beginPath(); for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * Math.PI / 5, q = j % 2 ? r * .45 : r; x.lineTo(Math.cos(a) * q, Math.sin(a) * q); } x.closePath();
  x.fillStyle = '#ffe14d'; x.strokeStyle = INK; x.lineWidth = 3; x.fill(); x.stroke();
  C.circ(-r * .18, -r * .05, r * .07, INK); C.circ(r * .18, -r * .05, r * .07, INK);
  x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.arc(0, r * .08, r * .16, .3, Math.PI - .3); x.stroke();
  x.restore();
}
// flight of a block from (ax, ay) to (bx, by) during [t0, t0+d], with an arc
function fly(u, t0, d, ax, ay, bx, by, s0 = 1, s1 = 1, h = 90) {
  const k = clamp((u - t0) / d), e = ease(k);
  return { k, px: lerp(ax, bx, e), py: lerp(ay, by, e) - Math.sin(k * Math.PI) * h, s: lerp(s0, s1, e) };
}

// ---------- helpers ----------
function savanna(skyT, t) { S.setT(skyT); S.sky(); S.setT(t); S.land(); }
const say = (c, who, k = .45) => { const v = c.talk(who); return v > 0 ? (who === 'elephant' ? .12 + v * .04 : v * k) : 0; };
const hop = (t, sp = 6, h = 8) => Math.abs(Math.sin(t * sp)) * h;
const walk = (u, a, b, x0, x1) => u < a ? x0 : u > b ? x1 : lerp(x0, x1, ease((u - a) / (b - a)));
// group positions: Ella + Leo left (facing right), Nico + Boris right (facing left)
const GP = { elephant: [118, .86, true], lion: [262, .72, true], rhino: [722, .68, false], buffalo: [858, .72, false] };
const ORDER = ['elephant', 'lion', 'rhino', 'buffalo'];
function friends(u, c, liftFn = () => 0, o = {}) {
  ORDER.forEach((k, i) => {
    const [px0, sc, fl] = GP[k], px = o.pos ? o.pos(k, px0) : px0;
    const act = k === 'elephant' && c.ellaAct !== undefined ? c.ellaAct : say(c, k);
    S.actor(ANI[k], px, o.moving ? o.moving(k) : false, act, sc, { flip: fl, blinkOff: i * .8, phase: i, lift: liftFn(k, i) });
  });
}
const BUB = { elephant: [160, 190], lion: [300, 220], rhino: [700, 220], buffalo: [810, 205] };
const sayL = (who, txt, a, b) => [who, txt, a, b, BUB[who][0], BUB[who][1], 28];

// ---------- shot 1: the wrong tower (blue at the bottom, then yellow, then big red on top) ----------
const W1 = [{ i: 4, t: 5.2 }, { i: 2, t: 8.4 }, { i: 0, t: 11.8 }];     // placements (Boris, Nico, Leo)
const FALL = 17.0;
function wrongTower(u, c) {
  let base = G; const placed = [];
  W1.forEach(p => { placed.push({ ...p, by: base }); base -= B[p.i].h; });
  const wob = u > 13.2 && u < FALL ? Math.sin((u - 13.2) * 9) * .03 * clamp((u - 13.2) / 3.4) * 3 : 0;
  // blocks still on the grass
  [1, 3].forEach(i => { shadow(SC[i][0], SC[i][1], B[i].w); block(i, SC[i][0], SC[i][1], 1, SC[i][2]); });
  placed.forEach(p => {
    if (u < p.t) { shadow(SC[p.i][0], SC[p.i][1], B[p.i].w); block(p.i, SC[p.i][0], SC[p.i][1], 1, SC[p.i][2]); return; }
    if (u < FALL) {
      const f = fly(u, p.t, 1.1, SC[p.i][0], SC[p.i][1], TX, p.by, 1, 1, 110);
      if (f.k >= 1) {   // standing in the tower, wobbling around the base
        const hy = G - p.by;
        x.save(); x.translate(TX, G); x.rotate(wob); block(p.i, Math.sin(wob) * 0 + 0, -hy, 1, 0); x.restore();
      } else block(p.i, f.px, f.py, 1, f.k * Math.PI * 2 * (p.i === 0 ? 0 : 0));
      return;
    }
    // falling: from the tower spot to the grass with a spin and a little bounce
    const k = clamp((u - FALL - (2 - W1.indexOf(p)) * .12) / .9), e = k * k;
    const px = lerp(TX, SC[p.i][0], k), py = lerp(p.by, SC[p.i][1], e) - (k > .85 ? Math.sin((k - .85) / .15 * Math.PI) * 10 : 0);
    if (k >= 1) shadow(SC[p.i][0], SC[p.i][1], B[p.i].w);
    block(p.i, px, py, 1, lerp(0, SC[p.i][2] + (p.i === 0 ? -6.28 : 6.28), k));
  });
  if (u > FALL + .7 && u < FALL + 1.8) S.dust(TX, G + 20, (u - FALL - .7) / 1.1);
}

// ---------- shot 3: the good tower, built in order 0..4 ----------
const BUILD = [{ t: 4.0, who: 'lion' }, { t: 9.8, who: 'elephant' }, { t: 15.6, who: 'rhino' }, { t: 21.4, who: 'buffalo' }, { t: 27.2, who: 'elephant' }];
function goodTower(u, c, sway = 0) {
  B.forEach((b, i) => {
    const p = BUILD[i], ty = towerY([0, 1, 2, 3, 4].slice(0, i));
    if (u < p.t) { shadow(ROWX[i], FRONT, b.w * RS); block(i, ROWX[i], FRONT, RS); return; }
    const f = fly(u, p.t, 1.2, ROWX[i], FRONT, TX, ty, RS, 1, 120);
    if (f.k >= 1) { x.save(); x.translate(TX, G); x.rotate(sway); block(i, 0, ty - G, 1, 0, win(u, p.t + 1.2, p.t + 3.6, .4)); x.restore(); }
    else block(i, f.px, f.py, f.s);
  });
}
function fullTower(sway = 0, withStar = true, t = 0) {
  x.save(); x.translate(TX, G); x.rotate(sway);
  B.forEach((b, i) => block(i, 0, towerY([0, 1, 2, 3, 4].slice(0, i)) - G));
  if (withStar) star(0, towerY([0, 1, 2, 3, 4]) - G - 24, 24, Math.sin(t * 2) * .08);
  x.restore();
}
const TOP = towerY([0, 1, 2, 3, 4]);          // top of the finished tower (y)

// recap panel: five block icons with numbers + colour words
function recap(u, a, end) {
  B.forEach((b, i) => {
    const k = clamp((u - a - i * 1.4) / .4) * clamp((end - u) / .6); if (k <= 0) return;
    const cx = 160 + i * 160, s = .6 + .4 * ease(k) + Math.sin(k * Math.PI) * .1;
    x.save(); x.globalAlpha = k; x.translate(cx, 112); x.scale(s, s);
    x.fillStyle = 'rgba(255,255,255,.92)'; x.strokeStyle = INK; x.lineWidth = 3; rr(-66, -72, 132, 144, 18); x.fill(); x.stroke();
    block(i, 0, 26, .72);
    x.restore();
    C.bigText(String(i + 1), cx, 64, k, 36, b.col);
    C.bigText(b.word, cx, 160, k, 28, b.col);
  });
}

St.episode({
  title: ['Tall Tower!', 72], sub: 'The Big Four', accent: '#e63946', cardBg: '#fff6ea',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'tower', shift: 0 },
  thumb: ['Tall Tower!', 'The Big Four'],
  shots: [
    // 0 – the friends walk in and find five colourful blocks on the grass
    { d: 21, draw: (u, c) => {
        savanna(12 + u * .2, c.t);
        const ent = { elephant: 5.0, lion: 5.4, rhino: 5.2, buffalo: 5.6 };
        const pos = (k, px0) => walk(u - ent[k], 0, 3.2, GP[k][2] ? -170 : W + 170, px0);
        const mv = k => u - ent[k] > 0 && u - ent[k] < 3.2;
        const lf = (k, i) => u > 15.6 && u < 19 ? hop(c.t + i, 4, 7) : 0;
        friends(u, c, lf, { pos, moving: mv });
        S.foreground();
        B.forEach((b, i) => { const [px, py, r] = SC[i], k = clamp((u - 5.6 - i * .25) / .3), j = u > 9.6 && u < 12.6 ? hop(c.t * 1.3 + i, 4, 6) : 0;
          if (k > 0) { shadow(px, py, b.w); block(i, px, py - j, ease(k) + Math.sin(k * Math.PI) * .2, r); } });
      },
      says: [sayL('rhino', 'Look! Colorful blocks!', 9.4, 12.8), sayL('lion', "Let's build a tall tower!", 13.2, 16.8)],
      big: [['Blocks!', 9.6, 13, 480, 92, 64, '#ff9f1c'], ['Tower!', 15.6, 19.4, 480, 92, 68, '#e63946']],
      sfx: [[5.6, 'pop', .45, -.3], [5.85, 'pop', .45, .3], [6.1, 'pop', .45, -.1], [6.35, 'pop', .45, .1], [6.6, 'pop', .45, .5],
            [9.4, 'snort', .3], [9.6, 'arp', .45], [13.2, 'roar', .3], [15.6, 'cheer', .4], [16, 'laugh', .3]] },

    // 1 – the first try: small blue block at the bottom, big red block on top → it wobbles and falls down!
    { d: 30, draw: (u, c) => {
        savanna(16, c.t);
        const sad = u > FALL + 1.2 && u < 25;
        const lf = (k, i) => {
          if (k === 'buffalo' && u > 5 && u < 6.4) return hop(c.t, 5, 7);
          if (k === 'rhino' && u > 8.2 && u < 9.6) return hop(c.t, 5, 7);
          if (k === 'lion' && u > 11.6 && u < 13) return hop(c.t, 5, 8);
          if (u > FALL && u < FALL + .6) return 10 * Math.sin((u - FALL) / .6 * Math.PI);
          return u > 26 ? hop(c.t + i, 4, 5) : 0;
        };
        friends(u, c, lf);
        S.foreground();
        wrongTower(u, c);
      },
      says: [sayL('buffalo', 'The little blue one first!', .8, 4.4), sayL('rhino', 'Then yellow!', 7.0, 9.8), sayL('lion', 'And the big red one on top!', 10.2, 13.4),
             sayL('rhino', 'Oh no! It fell down!', 19.2, 22.6), sayL('elephant', "That's okay! Let's try again!", 23.4, 28.6)],
      big: [['Wobble, wobble…', 13.8, 16.8, 480, 92, 56, '#ff9f1c'], ['CRASH!', 17.2, 19, 480, 150, 72, '#e63946']],
      sfx: [[.8, 'bellow', .3], [5.2, 'swish', .4], [6.3, 'bump', .5], [7.0, 'snort', .3], [8.4, 'swish', .4], [9.5, 'bump', .5],
            [10.2, 'roar', .3], [11.8, 'swish', .45], [12.9, 'bump', .6], [13.8, 'tick', .3], [14.4, 'tick', .3, .2], [15.0, 'tick', .35, -.2], [15.6, 'tick', .35], [16.2, 'tick', .4],
            [17.0, 'whoosh:0.6', .4], [17.7, 'bump', .8, -.3], [17.85, 'bump', .7, .3], [18.0, 'bump', .7, 0, .6], [19.2, 'sad', .35], [23.4, 'trumpet', .3], [26, 'arp', .35]] },

    // 2 – Ella's idea: BIG blocks go at the bottom, SMALL blocks on top → sort them from big to small
    { d: 25, draw: (u, c) => {
        savanna(18, c.t);
        const lf = (k, i) => (k === 'elephant' && u > .8 && u < 4.6 ? hop(c.t, 3, 5) : 0) + (u > 20.4 && u < 23 ? hop(c.t + i, 4, 6) : 0);
        friends(u, c, lf);
        S.foreground();
        B.forEach((b, i) => {
          const t0 = 10.4 + i * 1.6, f = fly(u, t0, .9, SC[i][0], SC[i][1], ROWX[i], FRONT, 1, RS, 60);
          const glow = i === 0 ? win(u, 4.6, 7.4, .3) : i === 4 ? win(u, 7.4, 10.2, .3) : 0;
          if (f.k <= 0) { shadow(SC[i][0], SC[i][1], b.w); block(i, SC[i][0], SC[i][1], 1, SC[i][2], glow); }
          else { if (f.k >= 1) shadow(ROWX[i], FRONT, b.w * RS); block(i, f.px, f.py, f.s, lerp(SC[i][2], 0, f.k), f.k >= 1 ? 0 : 0); }
        });
        // big → small arrow under the row
        const ak = win(u, 18.6, 24.4, .4);
        if (ak > 0) { x.save(); x.globalAlpha = ak; x.strokeStyle = '#ffffff'; x.lineWidth = 6; x.lineCap = 'round';
          const x0 = ROWX[0] - 40, x1 = ROWX[4] + 30, y = 518; x.beginPath(); x.moveTo(x0, y); x.lineTo(x1, y); x.moveTo(x1 - 14, y - 9); x.lineTo(x1, y); x.lineTo(x1 - 14, y + 9); x.stroke(); x.restore(); }
      },
      says: [sayL('elephant', 'I have an idea!', .8, 4.2), sayL('elephant', 'Big blocks at the bottom!', 4.6, 7.4), sayL('elephant', 'Small blocks on top!', 7.6, 10.2),
             sayL('buffalo', 'From big to small!', 19.0, 22.8)],
      big: [['BIG', 4.8, 7.4, 330, 92, 68, '#e63946'], ['SMALL', 7.6, 10.2, 660, 92, 64, '#3a86ff'], ['Big → small', 18.6, 24.4, 480, 92, 60, '#ffffff']],
      sfx: [[.8, 'trumpet', .3], [1.4, 'twinkle:E6', .35], [4.8, 'chime:C5', .4], [7.6, 'chime:C6', .4],
            ...B.map((b, i) => [10.4 + i * 1.6, 'swish', .35, (ROWX[i] - 480) / 400]), ...B.map((b, i) => [11.3 + i * 1.6, 'pop', .45, (ROWX[i] - 480) / 400]),
            [19.0, 'bellow', .3], [19.4, 'tada', .35]] },

    // 3 – build again, counting: 1 red (Leo), 2 orange (Ella), 3 yellow (Nico), 4 green (Boris), 5 blue (Ella reaches up high)
    { d: 37, draw: (u, c) => {
        savanna(20, c.t);
        const lf = (k, i) => { let h = 0; BUILD.forEach(p => { if (p.who === k && u > p.t && u < p.t + 1.4) h = hop(c.t, 5, 8); }); return h + (u > 33 ? hop(c.t + i, 4, 7) : 0); };
        friends(u, c, lf);
        S.foreground();
        goodTower(u, c, u > 30 ? Math.sin(c.t * 1.5) * .006 : 0);
      },
      says: [sayL('lion', 'The big red one first!', .6, 3.8), sayL('elephant', 'Orange!', 7.6, 9.6), sayL('rhino', 'Yellow!', 13.4, 15.4), sayL('buffalo', 'Green!', 19.2, 21.2),
             sayL('elephant', 'And the little blue one!', 24.2, 27.4), sayL('lion', 'It stands!', 31.6, 34.6)],
      big: [...B.map((b, i) => [String(i + 1), BUILD[i].t + 1.2, BUILD[i].t + 5.4, 480, 92, 76, '#ffffff']),
            ...B.map((b, i) => [b.word, BUILD[i].t + 1.4, BUILD[i].t + 5.4, 480, 160, 50, b.col]), ['Hooray!', 32.4, 36.4, 480, 120, 70, '#ffd23f']],
      sfx: [[.6, 'roar', .3], ...BUILD.map(p => [p.t, 'swish', .4]), ...BUILD.map((p, i) => [p.t + 1.2, 'bump', .45]),
            ...BUILD.map((p, i) => [p.t + 1.25, 'chime:' + ['C5', 'D5', 'E5', 'G5', 'C6'][i], .4]),
            [7.6, 'trumpet', .25], [13.4, 'snort', .25], [19.2, 'bellow', .25], [24.2, 'trumpet', .25], [31.6, 'roar', .3], [32.4, 'cheer', .45], [32.8, 'tada', .4]] },

    // 4 – a star on top, and the tower is taller than Ella!
    { d: 18, draw: (u, c) => {
        savanna(24, c.t);
        const lf = (k, i) => (u > 4.2 && u < 7 ? hop(c.t + i, 4, 6) : 0) + (k === 'elephant' && u > 13 && u < 16 ? hop(c.t, 3, 4) : 0);
        friends(u, c, lf);
        S.foreground();
        fullTower(Math.sin(c.t * 1.5) * .006, false);
        const f = fly(u, 1.0, 1.8, 120, 120, TX, TOP - 24, .6, 1, 40);
        if (u > 1.0) star(f.px, f.py, 24 * f.s, (1 - f.k) * 6 + Math.sin(c.t * 2) * .08);
        if (u > 2.8 && u < 4.4) C.sparkles(TX, TOP - 24, c.t, 10, 50, '#fff3a0');
        // height comparison: dashed lines at Ella's head and at the top of the tower
        const k = win(u, 8.2, 17.4, .4);
        if (k > 0) { x.save(); x.globalAlpha = k; x.strokeStyle = '#ffffff'; x.lineWidth = 4; x.setLineDash([12, 10]);
          const ellaTop = G - 196 * GP.elephant[1];
          [[ellaTop, 70, 560], [TOP - 50, 400, 560]].forEach(([y, a, b]) => { x.beginPath(); x.moveTo(a, y); x.lineTo(b, y); x.stroke(); }); x.restore(); }
      },
      says: [sayL('elephant', 'A star on top!', .6, 3.6), ['rhino', 'Look! It is taller than Ella!', 8.4, 12.2, 750, 220, 28], sayL('elephant', 'Wow! So tall!', 12.8, 16.4)],
      big: [['Tall!', 4.2, 7.6, 480, 92, 70, '#ffd23f'], ['Taller!', 9.0, 17.0, 720, 92, 64, '#ffffff']],
      sfx: [[.6, 'trumpet', .3], [1.0, 'whoosh', .35], [2.8, 'twinkle:G6', .45], [3.0, 'tada', .35], [4.2, 'cheer', .4], [8.4, 'snort', .3], [9.0, 'arp', .4], [12.8, 'laugh', .3]] },

    // 5 – sunset recap: five blocks, 1 to 5, big at the bottom and small on top; "If it falls, try again!"
    { d: 32, draw: (u, c) => {
        savanna(58 + u * .05, c.t);
        const lf = (k, i) => u > 1 && u < 4 ? hop(c.t + i, 4, 6) : 0;
        friends(u, c, lf);
        S.foreground();
        fullTower(Math.sin(c.t * 1.5) * .006, true, c.t);
      },
      says: [sayL('lion', 'We did it together!', 1, 4.4), sayL('elephant', 'Big at the bottom, small on top!', 19.4, 22.8), sayL('buffalo', 'If it falls, try again!', 23.0, 26.4)],
      after: (u) => recap(u, 5.2, 18.6),
      sfx: [[1, 'roar', .3], [1.4, 'laugh', .3], ...B.map((b, i) => [5.2 + i * 1.4, 'pop', .45]), ...B.map((b, i) => [5.3 + i * 1.4, 'chime:' + ['C5', 'D5', 'E5', 'G5', 'C6'][i], .32]),
            [12.4, 'tada', .4], [19.4, 'trumpet', .3], [23.0, 'bellow', .3]] },
  ],
});
