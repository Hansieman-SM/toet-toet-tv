// The Big Four – Bubble Fun! (English story episode: Ella finds a bucket of bubble soap and blows bubbles with her trunk.
// Learning moments: counting 1–5 (the friends hop up and pop five bubbles), and taking turns: Boris pops ALL the bubbles at once,
// Nico doesn't get one and feels sad; Ella: "Let's take turns!" – Nico's turn, Leo's turn, Boris's turn (he waited!).
// Finale: a GIANT bubble floats over everyone and pops into lots of little bubbles. Sunset recap 1–5 + "Taking turns is fun!".
// New music: bubbles_long (bouncy toy-box polka – clarinet-like ocarina lead, toy piano, pizzicato bass, soft bells).
const C = require('../lib/common'), S = require('../lib/safari');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, rr, hash } = C;
const G = S.GROUND, ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
const INK = '#3a2414';

// ---------- positions ----------
const GP = { elephant: [118, .86, true], lion: [345, .72, true], rhino: [700, .68, false], buffalo: [850, .72, false] };
const ORDER = ['elephant', 'lion', 'rhino', 'buffalo'];
const TIP = [238, 286];                                 // Ella's trunk tip (trunk raised)
const HEADTOP = { lion: [345, 318], rhino: [690, 330], buffalo: [838, 318], elephant: [190, 250] };   // where a bubble hovers above a head
const BUCKET = [214, 506];

// ---------- drawing ----------
function bubble(cx, cy, r, t, a = 1) {
  if (r <= .5 || a <= 0) return;
  x.save(); x.globalAlpha *= a;
  const g = x.createRadialGradient(cx - r * .3, cy - r * .3, r * .1, cx, cy, r);
  g.addColorStop(0, 'rgba(255,255,255,.25)'); g.addColorStop(.7, 'rgba(180,225,255,.40)'); g.addColorStop(1, 'rgba(255,180,235,.70)');
  x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
  x.strokeStyle = 'rgba(255,255,255,.95)'; x.lineWidth = Math.max(4, r * .16); x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke();
  x.lineWidth = Math.max(2.5, r * .09);
  const cols = ['rgba(120,190,255,.95)', 'rgba(255,140,200,.95)', 'rgba(255,220,110,.95)', 'rgba(130,220,170,.95)'];
  cols.forEach((col, i) => { x.strokeStyle = col; x.beginPath(); const a0 = t * .8 + i * Math.PI / 2; x.arc(cx, cy, r, a0, a0 + Math.PI / 2 + .05); x.stroke(); });
  x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); x.ellipse(cx - r * .38, cy - r * .42, r * .2, r * .11, -.7, 0, 7); x.fill();
  x.beginPath(); x.arc(cx + r * .42, cy + r * .36, r * .06, 0, 7); x.fill();
  x.restore();
}
function popFx(cx, cy, r, k) {   // k 0..1
  if (k <= 0 || k >= 1) return;
  x.save(); x.globalAlpha = 1 - k; x.strokeStyle = '#ffffff'; x.lineWidth = 3; x.lineCap = 'round';
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + .2, r0 = r * (.6 + k * .6), r1 = r * (.9 + k * 1.1);
    x.beginPath(); x.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); x.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); x.stroke(); }
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, rr2 = r * (.5 + k * 1.3); C.circ(cx + Math.cos(a) * rr2, cy + Math.sin(a) * rr2 + k * 10, 2.5, 'rgba(190,230,255,.9)'); }
  x.restore();
}
function bucket(t) {
  const [bx, by] = BUCKET;
  x.fillStyle = 'rgba(70,40,10,.2)'; x.beginPath(); x.ellipse(bx, by + 2, 40, 6, 0, 0, 7); x.fill();
  x.fillStyle = '#4ea8de'; x.strokeStyle = INK; x.lineWidth = 3.5;
  x.beginPath(); x.moveTo(bx - 36, by - 54); x.lineTo(bx + 36, by - 54); x.lineTo(bx + 28, by); x.lineTo(bx - 28, by); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = 'rgba(255,255,255,.5)'; x.lineWidth = 4; x.beginPath(); x.moveTo(bx - 24, by - 44); x.lineTo(bx - 20, by - 8); x.stroke();
  // foam on top
  [[-24, -58, 13], [-8, -64, 15], [10, -61, 14], [26, -57, 12], [0, -55, 12]].forEach(([a, b, r]) => C.circ(bx + a, by + b, r, '#ffffff', INK, 2.5));
  for (let i = 0; i < 3; i++) { const k = ((t * .5 + i / 3) % 1); bubble(bx - 10 + i * 12 + Math.sin(t * 2 + i) * 6, by - 70 - k * 50, 5 + i, t, 1 - k); }
  x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.arc(bx, by - 54, 38, Math.PI * 1.1, Math.PI * 1.9); x.stroke();
}

// a bubble: {t0, from:[x,y], to:[x,y], fd (fly duration), tp (pop time), r}
function bubbleAt(b, u, t) {
  if (u < b.t0) return;
  const k = clamp((u - b.t0) / b.fd), e = ease(k), [ax, ay] = b.from || TIP, [bx, by] = b.to;
  const grow = clamp((u - b.t0) / .35);
  const px = lerp(ax, bx, e) + Math.sin(u * 2.3 + b.t0) * 6 * k, py = lerp(ay, by, e) - Math.sin(k * Math.PI) * (b.arc ?? 40) + Math.sin(u * 1.7 + b.t0 * 3) * 5 * k;
  if (b.tp !== undefined && u >= b.tp) { popFx(px, py, b.r, (u - b.tp) / .4); return; }
  bubble(px, py, b.r * (.3 + .7 * grow), t);
}

// ---------- helpers ----------
function savanna(skyT, t) { S.setT(skyT); S.sky(); S.setT(t); S.land(); }
const say = (c, who, k = .45) => { const v = c.talk(who); return v > 0 ? (who === 'elephant' ? .12 + v * .04 : v * k) : 0; };
const hop = (t, sp = 6, h = 8) => Math.abs(Math.sin(t * sp)) * h;
const jump = (u, t0, h = 34, d = .7) => u > t0 - d / 2 && u < t0 + d / 2 ? Math.sin((u - t0 + d / 2) / d * Math.PI) * h : 0;
function friends(u, c, liftFn = () => 0, o = {}) {
  ORDER.forEach((k, i) => {
    const [px0, sc, fl] = GP[k], px = o.pos ? o.pos(k, px0) : px0;
    const act = k === 'elephant' && c.ellaAct !== undefined ? Math.max(c.ellaAct, say(c, k)) : say(c, k);
    S.actor(ANI[k], px, o.moving ? o.moving(k) : false, act, sc, { flip: fl, blinkOff: i * .8, phase: i, lift: liftFn(k, i) });
  });
}
const blowing = (u, spans) => spans.some(([a, b]) => u > a && u < b) ? .75 : undefined;
const BUB = { elephant: [170, 170], lion: [360, 210], rhino: [690, 215], buffalo: [800, 200] };
const sayL = (who, txt, a, b) => [who, txt, a, b, BUB[who][0], BUB[who][1], 28];

// ---------- shot 1: five bubbles, count while popping ----------
const P1 = [['lion', 9.0], ['rhino', 12.6], ['buffalo', 16.2], ['elephant', 19.8], ['lion', 23.4]];
const B1 = P1.map(([who, tp], i) => ({ t0: 2.2 + i * .9, fd: 2.6 + i * .3, to: who === 'elephant' ? [286, 228] : HEADTOP[who], tp, r: 30 + (i % 2) * 4, who }));
// ---------- shot 2: Boris pops them all ----------
const B2 = Array.from({ length: 6 }, (_, i) => ({ t0: 1.6 + i * .45, fd: 3.6, to: [720 + (i % 3) * 70, 300 + Math.floor(i / 3) * 36 - (i % 2) * 10], r: 26 + (i % 3) * 3, arc: 40 }));
const BORIS_POPS = [7.2, 7.8, 8.4, 9.0, 9.6, 10.2];
B2.forEach((b, i) => { b.tp = BORIS_POPS[i]; });
// ---------- shot 3: turns ----------
const TURN = [['rhino', 3.0], ['lion', 10.6], ['buffalo', 18.2]];
const B3 = TURN.map(([who, t0]) => ({ t0, fd: 2.8, to: HEADTOP[who], tp: t0 + 4.2, r: 34, who }));

// recap: five bubbles with numbers 1..5
function recap(u, a, end, t) {
  for (let i = 0; i < 5; i++) {
    const k = clamp((u - a - i * 1.4) / .4) * clamp((end - u) / .6); if (k <= 0) continue;
    const cx = 200 + i * 140, cy = 120 + Math.sin(t * 1.5 + i) * 6;
    bubble(cx, cy, 52 * (.6 + .4 * ease(k)), t, k);
    C.bigText(String(i + 1), cx, cy + 2, k, 56, ['#3a86ff', '#ff5d8f', '#ffb703', '#2a9d8f', '#9b5de5'][i]);
  }
}

St.episode({
  title: ['Bubble Fun!', 72], sub: 'The Big Four', accent: '#3a86ff', cardBg: '#eef7ff',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'bubbles', shift: 0 },
  thumb: ['Bubble Fun!', 'The Big Four'],
  shots: [
    // 0 – the friends walk in and find a bucket full of bubble soap
    { d: 20, draw: (u, c) => {
        savanna(12 + u * .2, c.t);
        const ent = { elephant: 5.0, lion: 5.4, rhino: 5.2, buffalo: 5.6 };
        const pos = (k, px0) => { const t0 = ent[k], k2 = clamp((u - t0) / 3.2); return lerp(GP[k][2] ? -170 : W + 170, px0, ease(k2)); };
        const mv = k => u - ent[k] > 0 && u - ent[k] < 3.2;
        c.ellaAct = u > 15.4 && u < 19 ? .75 : undefined;
        friends(u, c, (k, i) => u > 12.6 && u < 15 && k !== 'elephant' ? hop(c.t + i, 4, 6) : 0, { pos, moving: mv });
        S.foreground();
        if (u > 4.6) bucket(c.t);
        if (u > 15.6) { const n = Math.floor((u - 15.6) / .5); for (let j = 0; j <= Math.min(n, 4); j++) bubbleAt({ t0: 15.6 + j * .5, fd: 3, to: [340 + j * 60, 170 + (j % 2) * 40], r: 20 + j * 3 }, u, c.t); }
      },
      says: [sayL('rhino', 'What is in this bucket?', 9.0, 12.4), sayL('elephant', 'Bubble soap! Watch this!', 12.8, 16.0)],
      big: [['Bubbles!', 16.4, 19.6, 600, 92, 64, '#3a86ff']],
      sfx: [[5.4, 'rustle', .3], [9.0, 'snort', .3], [12.8, 'trumpet', .3], [15.6, 'whoosh:0.8', .3], ...[0, 1, 2, 3, 4].map(j => [15.7 + j * .5, 'twinkle:' + ['E6', 'G6', 'A6', 'C7', 'E7'][j], .25]), [16.4, 'arp', .4]] },

    // 1 – Ella blows five bubbles; the friends hop up and pop them – count 1 to 5!
    { d: 28, draw: (u, c) => {
        savanna(16, c.t);
        c.ellaAct = blowing(u, [[1.8, 6.4], [19.4, 20.4]]);
        const lf = (k, i) => { let h = 0; P1.forEach(([w, tp]) => { if (w === k && k !== 'elephant') h = Math.max(h, jump(u, tp, 34)); }); return h + (u > 25 ? hop(c.t + i, 4, 6) : 0); };
        friends(u, c, lf);
        S.foreground(); bucket(c.t);
        B1.forEach(b => bubbleAt(b, u, c.t));
      },
      says: [sayL('elephant', 'Let us pop them and count!', 6.6, 8.6), sayL('lion', 'We popped five bubbles!', 24.4, 27.4)],
      big: [...P1.map(([w, tp], i) => [String(i + 1), tp + .1, tp + 3.2, 480, 96, 84, '#ffffff']), ['Pop!', 9.1, 10.6, 480, 170, 46, '#ff5d8f']],
      sfx: [[2.0, 'whoosh:0.8', .25], ...B1.map((b, i) => [b.t0 + .1, 'twinkle:' + ['C6', 'D6', 'E6', 'G6', 'A6'][i], .2]),
            ...P1.map(([w, tp], i) => [tp, 'pop', .6, (HEADTOP[w][0] - 480) / 500]), ...P1.map(([w, tp], i) => [tp + .15, 'chime:' + ['C5', 'D5', 'E5', 'G5', 'C6'][i], .4]),
            [6.6, 'trumpet', .25], [24.4, 'roar', .3], [24.8, 'cheer', .4]] },

    // 2 – Boris pops ALL the bubbles at once – Nico didn't get one and feels sad. "Let's take turns!"
    { d: 30, draw: (u, c) => {
        savanna(18, c.t);
        c.ellaAct = blowing(u, [[1.4, 4.4]]);
        const bx = 0;
        const pos = (k, px0) => k === 'buffalo' ? px0 + bx : px0;
        const lf = (k, i) => {
          if (k === 'buffalo') { let h = 0; BORIS_POPS.forEach(tp => { h = Math.max(h, jump(u, tp, 40, .55)); }); return h; }
          if (k === 'rhino' && u > 23.8 && u < 26.4) return hop(c.t, 4, 6);
          return 0; };
        friends(u, c, lf, { pos, moving: k => k === 'buffalo' && ((u > 6.6 && u < 7.2) || (u > 11 && u < 12.2)) });
        S.foreground(); bucket(c.t);
        B2.forEach(b => bubbleAt(b, u, c.t));
      },
      says: [sayL('buffalo', 'Pop! Pop! Pop! All mine!', 7.2, 11.0), sayL('rhino', 'Oh… I did not get one.', 12.4, 15.8),
             sayL('elephant', "Let's take turns!", 16.4, 19.6), sayL('buffalo', 'Sorry, Nico. You go first!', 20.0, 23.6)],
      big: [['Take turns!', 16.8, 22.6, 480, 92, 62, '#2a9d8f']],
      sfx: [[1.6, 'whoosh:0.8', .25], ...B2.map((b, i) => [b.t0 + .1, 'twinkle:' + ['C6', 'E6', 'G6', 'C7', 'G6', 'E6'][i], .18]),
            [6.6, 'bellow', .3], ...BORIS_POPS.map((tp, i) => [tp, 'pop', .55, .2 + (i % 3) * .1]), [12.4, 'sad', .35], [16.4, 'trumpet', .25], [17, 'arp', .35], [20.0, 'bellow', .2]] },

    // 3 – taking turns: Nico's turn, Leo's turn, Boris's turn (he waited!)
    { d: 27, draw: (u, c) => {
        savanna(20, c.t);
        c.ellaAct = blowing(u, TURN.map(([w, t0]) => [t0 - .3, t0 + 1.2]));
        const lf = (k, i) => { let h = 0; B3.forEach(b => { if (b.who === k) h = Math.max(h, jump(u, b.tp, 30)); }); return h + (u > 24.6 ? hop(c.t + i, 4, 6) : 0); };
        friends(u, c, lf);
        S.foreground(); bucket(c.t);
        B3.forEach(b => bubbleAt(b, u, c.t));
        B3.forEach(b => { if (u > b.tp && u < b.tp + 1.4) C.sparkles(HEADTOP[b.who][0], HEADTOP[b.who][1], c.t, 8, 50, '#fff3a0'); });
      },
      says: [sayL('rhino', 'Yay! My turn!', 4.0, 7.0), sayL('lion', 'Thank you, Ella!', 11.6, 14.6), sayL('buffalo', 'I waited for my turn!', 19.2, 22.6)],
      big: [["Nico's turn!", 1.0, 7.8, 480, 92, 56, '#9b5de5'], ["Leo's turn!", 8.6, 15.4, 480, 92, 56, '#ff9f1c'], ["Boris's turn!", 16.2, 23.4, 480, 92, 56, '#e63946']],
      sfx: [...TURN.map(([w, t0]) => [t0 - .2, 'whoosh:0.6', .22]), ...B3.map(b => [b.tp, 'pop', .6, (HEADTOP[b.who][0] - 480) / 500]), ...B3.map((b, i) => [b.tp + .1, 'twinkle:' + ['E6', 'G6', 'C7'][i], .35]),
            [4.0, 'snort', .25], [11.6, 'roar', .25], [19.2, 'bellow', .25], [24.6, 'cheer', .4]] },

    // 4 – a GIANT bubble floats over everyone… and pops into lots of little bubbles
    { d: 20, draw: (u, c) => {
        savanna(24, c.t);
        c.ellaAct = blowing(u, [[.8, 6.2]]);
        const lf = (k, i) => u > 12.6 && u < 15.4 ? hop(c.t + i, 4, 8) : 0;
        friends(u, c, lf);
        S.foreground(); bucket(c.t);
        const grow = ease(clamp((u - 1.2) / 4.6)), rG = 12 + grow * 78;
        const fly = ease(clamp((u - 6) / 4.4));
        const gx = lerp(TIP[0] + rG * .8, 480, fly) + Math.sin(c.t * 1.2) * 8 * fly, gy = lerp(TIP[1] - rG * .4, 230, fly) + Math.sin(c.t * 1.6) * 6;
        if (u > 1.2 && u < 12.2) bubble(gx, gy, rG, c.t);
        if (u >= 12.2) {
          popFx(480, 230, 90, (u - 12.2) / .5);
          for (let i = 0; i < 14; i++) { const a = hash(i) * Math.PI * 2, sp = 70 + hash(i + 5) * 180, k = u - 12.2;
            const px = 480 + Math.cos(a) * sp * Math.min(k, 1.6) + Math.sin(c.t + i) * 8, py = 230 + Math.sin(a) * sp * .6 * Math.min(k, 1.6) - k * 12;
            bubble(px, py, (12 + hash(i + 2) * 12) * clamp(k / .4), c.t, clamp((19.4 - u) / 1)); }
        }
      },
      says: [sayL('elephant', 'Now a GIANT bubble!', .6, 3.4), ['rhino', 'Wow! It is so big!', 7.4, 10.6, 790, 215, 28]],
      big: [['GIANT!', 6.4, 11.2, 760, 92, 66, '#3a86ff'], ['Lots of little bubbles!', 13.0, 18.4, 480, 92, 48, '#ff5d8f']],
      sfx: [[1.0, 'whoosh:1.4', .3], [3.0, 'twinkle:C6', .3], [5.4, 'twinkle:G6', .3], [6.4, 'arp', .35], [7.4, 'snort', .25], [12.2, 'pop', .9], [12.3, 'tada', .4], [12.6, 'cheer', .4],
            ...[0, 1, 2, 3, 4, 5].map(j => [12.5 + j * .25, 'twinkle:' + ['C7', 'E7', 'G6', 'A6', 'E6', 'C6'][j], .15])] },

    // 5 – sunset recap: five bubbles 1–5, and "Taking turns is fun!"
    { d: 28, draw: (u, c) => {
        savanna(58 + u * .05, c.t);
        c.ellaAct = blowing(u, [[19, 25]]);
        friends(u, c, (k, i) => u > 1 && u < 4 ? hop(c.t + i, 4, 6) : 0);
        S.foreground(); bucket(c.t);
        if (u > 19.2) for (let j = 0; j < 8; j++) { const t0 = 19.2 + j * .6; if (u > t0) bubbleAt({ t0, fd: 5, to: [360 + (j % 4) * 120, 140 + (j % 3) * 40], r: 22 + (j % 3) * 5 }, u, c.t); }
      },
      says: [sayL('lion', 'That was so much fun!', 1, 4.4), sayL('elephant', 'Taking turns is fun!', 17.4, 21.0), sayL('buffalo', 'Bubbles for everyone!', 21.6, 25.0)],
      after: (u, c) => recap(u, 5.2, 16.4, c.t),
      sfx: [[1, 'roar', .3], [1.4, 'laugh', .3], ...[0, 1, 2, 3, 4].map(i => [5.2 + i * 1.4, 'pop', .4]), ...[0, 1, 2, 3, 4].map(i => [5.3 + i * 1.4, 'chime:' + ['C5', 'D5', 'E5', 'G5', 'C6'][i], .32]),
            [12.4, 'tada', .4], [17.4, 'trumpet', .3], [21.6, 'bellow', .3]] },
  ],
});
