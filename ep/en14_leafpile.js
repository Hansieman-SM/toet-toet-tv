// The Big Four – Leaf Pile! (English story episode, autumn). A big autumn tree on the savanna drops its leaves.
// Learning moment: SORTING BY COLOUR + counting 1-2-3: Leo puts three RED leaves in the red basket, Nico three YELLOW leaves in the
// yellow basket, Boris three ORANGE leaves in the orange basket. Then Ella sweeps the brown leaves into one BIG pile; Boris may jump:
// "One, two, three… JUMP!" – leaves fly everywhere. "Oops! Leaves everywhere!" – they clean up TOGETHER and the pile is back.
// Sunset recap: red, yellow, orange – three of each. New music: leafpile_long (autumn waltz in F, flugelhorn, guitar oom-pah-pah, glockenspiel).
const C = require('../lib/common'), S = require('../lib/safari');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, rr, hash } = C;
const ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
const INK = '#3a2414';

const GP = { elephant: [118, .86, true], lion: [330, .72, true], rhino: [715, .68, false], buffalo: [855, .72, false] };
const ORDER = ['elephant', 'lion', 'rhino', 'buffalo'];
const BUB = { elephant: [175, 170], lion: [350, 215], rhino: [700, 215], buffalo: [800, 200] };
const sayL = (who, txt, a, b) => [who, txt, a, b, BUB[who][0], BUB[who][1], 28];

const COL = { red: '#e63946', yellow: '#ffd23f', orange: '#ff8c1a', brown: '#a8643a' };
const TX = 560, TG = 432;                                    // autumn tree (behind the path)
const BASK = { red: [438, 506], yellow: [523, 506], orange: [608, 506] };   // basket bottom centres (front)
const BASK_BACK = { red: [432, 432], yellow: [484, 432], orange: [536, 432] };   // baskets moved next to the tree (shot 2+)
const PILE = [520, 506];
const ROUNDS = [['lion', 'red', 'Leo'], ['rhino', 'yellow', 'Nico'], ['buffalo', 'orange', 'Boris']];
const NUM = ['ONE', 'TWO', 'THREE'];

// ---------- drawing ----------
function leaf(cx, cy, s, rot, col, a = 1) {
  if (a <= 0) return;
  x.save(); x.globalAlpha *= a; x.translate(cx, cy); x.rotate(rot); x.scale(s, s);
  // maple-ish leaf: five rounded lobes
  x.beginPath();
  const pts = [[0, -20], [6, -9], [17, -12], [12, -1], [19, 6], [7, 6], [4, 14], [0, 9], [-4, 14], [-7, 6], [-19, 6], [-12, -1], [-17, -12], [-6, -9]];
  pts.forEach(([a2, b2], i) => i ? x.lineTo(a2, b2) : x.moveTo(a2, b2)); x.closePath();
  x.fillStyle = col; x.fill(); x.strokeStyle = 'rgba(70,30,10,.7)'; x.lineWidth = 2; x.lineJoin = 'round'; x.stroke();
  x.beginPath(); x.moveTo(0, 18); x.lineTo(0, -12); x.moveTo(0, 2); x.lineTo(9, -6); x.moveTo(0, 2); x.lineTo(-9, -6); x.stroke();
  x.restore();
}
function tree(t, bare = 0) {
  x.save(); x.translate(TX, TG);
  x.fillStyle = '#8a5a36'; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(-22, 0); x.quadraticCurveTo(-12, -90, -9, -150); x.lineTo(11, -150); x.quadraticCurveTo(15, -90, 26, 0); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = '#8a5a36'; x.lineWidth = 10; x.lineCap = 'round';
  x.beginPath(); x.moveTo(2, -112); x.quadraticCurveTo(55, -130, 104, -140); x.moveTo(0, -126); x.quadraticCurveTo(-48, -146, -96, -150); x.stroke();
  const sw = Math.sin(t * 1.1) * 2;
  const blobs = [[-84, -186, 50], [0, -218, 62], [84, -190, 52], [-30, -160, 52], [40, -158, 50], [124, -158, 34], [-122, -160, 34]];
  [['#d9822b', 5], ['#f0a03a', 0]].forEach(([col, g]) => { x.fillStyle = col; x.globalAlpha = 1 - bare * .45; x.beginPath();
    blobs.forEach(([a, b, r]) => { x.moveTo(a + sw + r + g, b); x.arc(a + sw, b, r + g, 0, 7); }); x.fill(); });
  x.globalAlpha = 1 - bare * .45;
  for (let i = 0; i < 26; i++) { const a = (hash(i) - .5) * 250, b = -150 - hash(i + 7) * 100; leaf(a + sw, b, .8, hash(i + 3) * 6, [COL.red, COL.yellow, COL.orange, '#c0502a'][i % 4]); }
  x.restore();
}
// a few leaves drifting down from the tree all the time
function drifting(t, n = 5, a = 1) {
  for (let i = 0; i < n; i++) { const P = 6 + hash(i) * 3, k = ((t + hash(i + 2) * P) % P) / P;
    const px = TX - 120 + hash(i + 4) * 240 + Math.sin(k * Math.PI * 4 + i) * 30, py = lerp(TG - 200, TG + 60, k);
    leaf(px, py, 1, k * 8 + i, [COL.red, COL.yellow, COL.orange, COL.brown][i % 4], a * clamp(Math.min(k * 6, (1 - k) * 6))); }
}
function basket(bx, by, col, n, s = 1, label = true) {
  x.save(); x.translate(bx, by); x.scale(s, s);
  x.fillStyle = 'rgba(70,40,10,.22)'; x.beginPath(); x.ellipse(0, 2, 40, 6, 0, 0, 7); x.fill();
  // leaves inside (stacked, peeking over the rim)
  for (let i = 0; i < n; i++) leaf(-16 + i * 16, -50 - (i % 2) * 6, 1.05, -.5 + i * .5, col);
  x.fillStyle = '#c98f4f'; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(-36, -46); x.lineTo(36, -46); x.lineTo(28, 0); x.lineTo(-28, 0); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = 'rgba(90,50,20,.55)'; x.lineWidth = 2;
  for (let i = 1; i < 4; i++) { const yy = -46 + i * 11.5; x.beginPath(); x.moveTo(-36 + i * 2, yy); x.lineTo(36 - i * 2, yy); x.stroke(); }
  for (let i = -2; i <= 2; i++) { x.beginPath(); x.moveTo(i * 14, -46); x.lineTo(i * 11.5, 0); x.stroke(); }
  // colour band
  x.fillStyle = col; x.strokeStyle = INK; x.lineWidth = 2.5; rr(-30, -32, 60, 15, 6); x.fill(); x.stroke();
  x.fillStyle = '#d9a566'; x.strokeStyle = INK; x.lineWidth = 3; rr(-40, -52, 80, 9, 4); x.fill(); x.stroke();
  x.restore();
}
// leaf pile: amount 0..1, burst k (0..1 explosion)
const PILE_LEAVES = Array.from({ length: 34 }, (_, i) => {
  const r = Math.sqrt(hash(i + 50)), a = hash(i + 80) * Math.PI;
  return [Math.cos(a) * 92 * r, -Math.sin(a) * 50 * r - 4, hash(i + 21) * 6, [COL.brown, COL.red, COL.yellow, COL.orange, '#8c4a26'][i % 5]];
});
function pile(n, t) {
  const [px, py] = PILE;
  const shown = Math.round(n * PILE_LEAVES.length);
  if (n > 0) { x.fillStyle = 'rgba(70,40,10,.2)'; x.beginPath(); x.ellipse(px, py + 2, 30 + 70 * n, 7, 0, 0, 7); x.fill(); }
  PILE_LEAVES.slice(0, shown).sort((a, b) => a[1] - b[1]).forEach(([a, b, r, col], i) => leaf(px + a * (.5 + .5 * n), py + b * n, 1.25, r + Math.sin(t * 2 + i) * .03, col));
}
// burst of the pile: leaf i after k seconds -> [x, y, landed]
function burstPos(i, k) {
  const [a, b] = PILE_LEAVES[i], vx = (hash(i + 5) - .5) * 300, vy = -300 - hash(i + 9) * 200, g = 300;
  const y0 = PILE[1] + b, land = 474 + hash(i + 40) * 44;
  const kl = (-vy + Math.sqrt(vy * vy - 4 * g * (y0 - land))) / (2 * g), kk = Math.min(k, kl);
  return [clamp(PILE[0] + a + vx * kk, 30, W - 30), k >= kl ? land : y0 + vy * kk + g * kk * kk, k >= kl];
}
// ground leaves (brown ones that go into the pile)
const GROUND = Array.from({ length: 34 }, (_, i) => [40 + hash(i + 300) * 880, 476 + hash(i + 310) * 40, hash(i + 320) * 6, [COL.brown, '#8c4a26', COL.brown, '#b5713e'][i % 4]]);

// ---------- helpers ----------
function savanna(skyT, t) { S.setT(skyT); S.sky(); S.setT(t); S.land(); }
const say = (c, who, k = .45) => { const v = c.talk(who); return v > 0 ? (who === 'elephant' ? .12 + v * .04 : v * k) : 0; };
const hop = (t, sp = 6, h = 8) => Math.abs(Math.sin(t * sp)) * h;
function friends(u, c, liftFn = () => 0, o = {}) {
  ORDER.forEach((k, i) => {
    const [px0, sc, fl] = GP[k], px = o.pos ? o.pos(k, px0) : px0;
    const act = k === 'elephant' && c.ellaAct !== undefined ? Math.max(c.ellaAct, say(c, k)) : say(c, k);
    if (o.skip && o.skip(k)) return;
    S.actor(ANI[k], px, o.moving ? o.moving(k) : false, act, sc, { flip: fl, blinkOff: i * .8, phase: i, lift: liftFn(k, i) });
  });
}
function arc(from, to, k, h = 110) { const e = ease(k); return [lerp(from[0], to[0], e), lerp(from[1], to[1], e) - Math.sin(k * Math.PI) * h]; }

// ---------- sorting rounds (shot 1) ----------
const R0 = 4, RD = 12.6, FLY = [3.6, 5.6, 7.6], FD = .9;
// pick-up spots: on the ground in front of the friend
const PICK = { lion: [385, 492], rhino: [665, 494], buffalo: [800, 496] };
const roundSays = [], roundSfx = [], roundBig = [];
ROUNDS.forEach(([who, col, name], r) => {
  const s = R0 + r * RD;
  roundSays.push(sayL(who, `I'll find the ${col} leaves!`, s + .3, s + 3.2));
  roundSays.push(sayL(who, `Three ${col} leaves!`, s + 10.4, s + 12.4));
  roundBig.push([col.charAt(0).toUpperCase() + col.slice(1) + ' leaves', s + .2, s + RD - .3, W / 2, 84, 58, COL[col]]);
  FLY.forEach((f, j) => {
    roundSfx.push([s + f, 'swish', .35, 0], [s + f + FD, `chime:${['C5', 'E5', 'G5'][j]}`, .55, 0], [s + f + FD, 'rustle:0.4', .3, 0]);
    roundBig.push([String(j + 1), s + f + FD, s + f + FD + 1.8, W / 2, 196, 96, '#ffffff']);
  });
  roundSfx.push([s + .3, who === 'lion' ? 'roar' : who === 'rhino' ? 'snort' : 'bellow', .22], [s + 10.4, 'tada', .35]);
});
function roundCount(u, r) { const v = u - R0 - r * RD; return v < 0 ? 0 : FLY.filter(f => v >= f + FD).length; }


St.episode({
  title: ['Leaf Pile!', 72], sub: 'The Big Four', accent: '#e8702a', cardBg: '#fff3e3',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'leafpile', shift: 0 },
  thumb: ['Leaf Pile!', 'The Big Four'],
  shots: [
    // 0 – the friends walk in under a big autumn tree; leaves everywhere
    { d: 19, draw: (u, c) => {
        savanna(12 + u * .2, c.t);
        tree(c.t);
        const ent = { elephant: 5.0, lion: 5.4, rhino: 5.2, buffalo: 5.6 };
        const pos = (k, px0) => { const k2 = clamp((u - ent[k]) / 3.2); return lerp(GP[k][2] ? -170 : W + 170, px0, ease(k2)); };
        const mv = k => u - ent[k] > 0 && u - ent[k] < 3.2;
        friends(u, c, (k, i) => u > 13.6 && u < 15.6 && k !== 'elephant' ? hop(c.t + i, 4, 6) : 0, { pos, moving: mv });
        S.foreground();
        GROUND.forEach(([a, b, r, col]) => leaf(a, b, 1.2, r, col));
        [[400, 488, COL.red], [450, 500, COL.yellow], [640, 492, COL.orange], [700, 508, COL.red], [300, 506, COL.yellow], [780, 500, COL.orange]].forEach(([a, b, col], i) => leaf(a, b, 1.2, i * 1.3, col));
        drifting(c.t, 6);
      },
      says: [sayL('lion', 'Look! So many leaves!', 9.2, 12.4), sayL('elephant', "Let's sort them by color!", 12.8, 16.2)],
      big: [['Autumn!', 16.4, 18.6, W / 2, 84, 60, '#e8702a']],
      sfx: [[5.4, 'rustle', .3], [9.2, 'roar', .25], [12.8, 'trumpet', .25], [16.4, 'arp', .35]] },

    // 1 – sorting: red (Leo), yellow (Nico), orange (Boris) – count 1, 2, 3 each
    { d: R0 + 3 * RD + .6, draw: (u, c) => {
        savanna(16, c.t);
        tree(c.t);
        const r = clamp(Math.floor((u - R0) / RD), 0, 2), v = u - R0 - r * RD;
        const lf = (k, i) => { let h = 0; ROUNDS.forEach(([w], rr2) => { if (w === k && rr2 === r && u >= R0) FLY.forEach(f => { if (v > f - .5 && v < f) h = Math.max(h, Math.sin((v - f + .5) / .5 * Math.PI) * 14); }); });
          return h + (u > R0 + 3 * RD - .4 ? hop(c.t + i, 4, 6) : 0); };
        friends(u, c, lf);
        S.foreground();
        GROUND.forEach(([a, b, rot, col]) => leaf(a, b, 1.2, rot, col));
        // coloured leaves still waiting on the ground next to each friend
        ROUNDS.forEach(([who, col], rr2) => { const n = 3 - roundCount(u, rr2), flying = rr2 === r && FLY.some(f => v >= f && v < f + FD) ? 1 : 0;
          for (let j = 0; j < n - flying; j++) leaf(PICK[who][0] + (j - 1) * 24, PICK[who][1] + (j % 2) * 8, 1.25, j * 1.7 + rr2, COL[col]); });
        ['red', 'yellow', 'orange'].forEach((col, rr2) => basket(BASK[col][0], BASK[col][1], COL[col], roundCount(u, rr2)));
        if (u >= R0) { const [who, col] = ROUNDS[r];
          FLY.forEach((f, j) => { if (v >= f && v < f + FD) { const k = (v - f) / FD, [px, py] = arc(PICK[who], [BASK[col][0], BASK[col][1] - 56], k, 120); leaf(px, py, 1.3, k * 9, COL[col]); }
            if (v >= f + FD && v < f + FD + .7) C.sparkles(BASK[col][0], BASK[col][1] - 60, c.t, 8, 40); });
          // number word under the big numeral
          const j = FLY.findIndex(f => v >= f + FD && v < f + FD + 1.8); if (j >= 0) C.bigText(NUM[j], W / 2, 262, win(v, FLY[j] + FD, FLY[j] + FD + 1.8, .25), 38, COL[col]);
        }
        drifting(c.t, 4);
      },
      says: [sayL('elephant', 'Red, yellow and orange!', .4, 3.6), ...roundSays],
      big: roundBig, sfx: roundSfx },

    // 2 – Ella sweeps the brown leaves into one BIG pile; Boris jumps in!
    { d: 27, draw: (u, c) => {
        savanna(19, c.t);
        tree(c.t, .2);
        const mvB = ease(clamp((u - .2) / 1.6));
        const swept = clamp((u - 2.4) / 6);                      // ground leaves fly to the pile
        const burst = u >= 17.4 ? (u - 17.4) : -1;
        // Boris: walks a bit closer, then the big jump into the pile
        const jk = clamp((u - 15.8) / 1.6);
        const bPos = (k, px0) => k === 'buffalo' ? (u < 15.8 ? px0 : lerp(px0, PILE[0] + 30, ease(jk))) : px0;
        const lf = (k, i) => {
          if (k === 'buffalo' && u >= 15.8 && u < 17.4) return Math.sin(jk * Math.PI) * 130;
          if (k === 'buffalo' && u >= 17.4) return -4;
          return (u > 18.6 && u < 23.4 && k !== 'buffalo') ? hop(c.t + i, 4, 7) : 0; };
        c.ellaAct = u > 2.2 && u < 8.6 ? .7 : undefined;
        friends(u, c, lf, { pos: bPos, moving: k => k === 'buffalo' && u > 15.8 && u < 17.4, skip: k => k === 'buffalo' && u >= 17.4 && u < 26.9 });
        S.foreground();
        ['red', 'yellow', 'orange'].forEach(col => { const [a, b] = BASK[col], [a2, b2] = BASK_BACK[col]; basket(lerp(a, a2, mvB), lerp(b, b2, mvB), COL[col], 3, lerp(1, .78, mvB)); });
        GROUND.forEach(([a, b, rot, col], i) => { const st = i / GROUND.length * .8, k = clamp((swept - st) / .2);
          if (k <= 0) leaf(a, b, 1.2, rot, col); else if (k < 1) { const [px, py] = arc([a, b], [PILE[0] + (hash(i) - .5) * 80, PILE[1] - 30], k, 90); leaf(px, py, 1.2, rot + k * 8, col); } });
        if (burst < 0) pile(clamp(swept * 1.1), c.t);
        else {
          // the pile bursts: leaves fly up and rain down
          pile(clamp(1 - burst * 1.6), c.t);
          // Boris sits in the pile with leaves on his head
          S.actor(ANI.buffalo, PILE[0] + 30, false, say(c, 'buffalo') || (burst < 1.6 ? .5 : 0), .72, { flip: false, blinkOff: 2.4, phase: 3, lift: -4 });
          for (let i = 0; i < 6; i++) leaf(PILE[0] + 30 - 30 + i * 12, PILE[1] - 108 - (i % 2) * 6, 1.1, i * 1.1, PILE_LEAVES[i][3]);
          PILE_LEAVES.forEach(([a, b, rot, col], i) => { const [px, py, landed] = burstPos(i, burst); leaf(px, py, 1.25, landed ? rot : rot + burst * 7, col); });
        }
      },
      says: [sayL('elephant', "I'll make one BIG pile!", 2.0, 5.6), sayL('buffalo', 'Can I jump in? Please?', 9.6, 12.6), sayL('elephant', 'Yes! One, two, three…', 12.9, 15.6),
             sayL('lion', 'Boris, you are all leafy!', 20.4, 23.6), sayL('buffalo', 'That was SO fun!', 23.8, 26.6)],
      big: process.env.THUMBBG ? [] : [['Big pile!', 8.4, 11.6, W / 2, 84, 60, '#a8643a'], ['JUMP!', 15.8, 18.6, W / 2, 84, 76, '#e63946']],
      sfx: [[2.2, 'trumpet', .25], [2.6, 'rustle:2.0', .35], [5.2, 'rustle:2.0', .3], [8.4, 'arp', .3], [9.6, 'bellow', .22], [13.2, 'tick', .4], [14.0, 'tick', .4], [14.8, 'tick', .4],
            [15.8, 'whoosh', .45], [17.4, 'bump', .5], [17.45, 'rustle:1.6', .6], [17.6, 'splash', .2], [18.2, 'laugh', .4], [18.8, 'cheer', .35], [20.4, 'roar', .2], [23.8, 'bellow', .25]] },

    // 3 – Oops! Leaves everywhere. Let's clean up together!
    { d: 22, draw: (u, c) => {
        savanna(21, c.t);
        tree(c.t, .2);
        const tog = clamp((u - 7.2) / 7.4);                     // leaves fly back together
        const lf = (k, i) => (u > 7.2 && u < 14.6 ? hop(c.t * 1.4 + i, 4, 9) : 0) + (u > 15 && u < 17 ? hop(c.t + i, 4, 6) : 0);
        c.ellaAct = u > 7.2 && u < 14.6 ? .7 : undefined;
        friends(u, c, lf, { pos: (k, px0) => k === 'buffalo' ? lerp(PILE[0] + 30, px0, ease(clamp((u - .2) / 2.2))) : px0, moving: k => k === 'buffalo' && u > .2 && u < 2.4 });
        S.foreground();
        ['red', 'yellow', 'orange'].forEach(col => basket(BASK_BACK[col][0], BASK_BACK[col][1], COL[col], 3, .78));
        PILE_LEAVES.forEach(([a, b, rot, col], i) => { const [fx, fy] = burstPos(i, 9), st = (i % 12) / 12 * .75, k = clamp((tog - st) / .25);
          if (k <= 0) leaf(fx, fy, 1.25, rot, col);
          else if (k < 1) { const [px, py] = arc([fx, fy], [PILE[0] + a, PILE[1] + b], k, 100); leaf(px, py, 1.25, rot + k * 6, col); } });
        pile(clamp(tog * 1.05), c.t);
      },
      says: [sayL('rhino', 'Oops! Leaves everywhere!', 2.6, 5.4), sayL('elephant', "Let's clean up together!", 5.6, 8.6), sayL('buffalo', 'Thank you, friends!', 16.4, 19.6)],
      big: [['Together!', 8.8, 14.6, W / 2, 84, 62, '#2a9d8f']],
      sfx: [[2.6, 'snort', .25], [5.6, 'trumpet', .25], [7.2, 'rustle:3.0', .4], [10.2, 'rustle:3.0', .35], [14.6, 'tada', .4], [15.0, 'cheer', .35], [16.4, 'bellow', .22]] },

    // 4 – sunset recap: red, yellow, orange – three of each
    { d: 27, draw: (u, c) => {
        savanna(58 + u * .05, c.t);
        tree(c.t, .2);
        friends(u, c, (k, i) => u > .8 && u < 3.4 ? hop(c.t + i, 4, 6) : 0);
        S.foreground();
        ['red', 'yellow', 'orange'].forEach(col => basket(BASK_BACK[col][0], BASK_BACK[col][1], COL[col], 3, .78));
        pile(1, c.t);
        drifting(c.t, 5);
      },
      after: (u, c) => {
        // recap card: three rows of three leaves
        const k = win(u, 4.4, 17.6, .5); if (k <= 0) return;
        x.save(); x.globalAlpha = k; x.fillStyle = 'rgba(255,248,236,.94)'; x.strokeStyle = INK; x.lineWidth = 4; rr(250, 40, 460, 260, 34); x.fill(); x.stroke(); x.restore();
        ['red', 'yellow', 'orange'].forEach((col, r) => {
          const t0 = 5.2 + r * 3.6, cy = 92 + r * 78, on = u >= t0 && u < t0 + 3.6;
          if (on) { x.save(); x.globalAlpha = k * .4; x.fillStyle = '#ffd23f'; rr(268, cy - 32, 424, 64, 30); x.fill(); x.restore(); }
          for (let j = 0; j < 3; j++) { const kk = clamp((u - t0 - j * .5) / .3) * k; leaf(312 + j * 52, cy, 1.5 * (.6 + .4 * ease(kk)), -.3 + j * .3, COL[col], kk); }
          C.bigText(col, 560, cy + 2, clamp((u - t0 - 1.5) / .3) * k, 44, COL[col]);
        });
      },
      says: [sayL('lion', 'What a fun autumn day!', .8, 4.2), sayL('elephant', 'Sorting is fun!', 17.2, 19.8), sayL('rhino', 'Playing together is fun!', 19.8, 21.8)],
      sfx: [[.8, 'roar', .25], [1.2, 'laugh', .3], ...[0, 1, 2].flatMap(r => [0, 1, 2].map(j => [5.2 + r * 3.6 + j * .5, `chime:${['C5', 'E5', 'G5', 'D5', 'F5', 'A5', 'E5', 'G5', 'C6'][r * 3 + j]}`, .4])),
            [16.0, 'tada', .4], [17.2, 'trumpet', .25], [19.8, 'snort', .2]] },
  ],
});
