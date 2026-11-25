// The Big Four – Whose Footprints? (English story episode). After the rain the savanna path is soft and muddy.
// Ella: "Let's play a footprint game!" – a trail of footprints appears step by step in the mud, a big copy pops up in a card,
// "Whose footprints?", 3-dot pause, then the owner steps forward: Leo's soft PAWS (four toes), Ella's BIG ROUND feet,
// Boris's HOOVES (two parts), Nico's THREE TOES. Then TINY footprints lead to a bush… Tilly the Turtle (new character, shy) peeks out:
// "Can I play with you?" – "Yes! Come and play with us!" (being kind / including others). Sunset recap: five friends, five kinds of feet.
// New music: footprints_long (bouncy 6/8 'puddle jig' in E-flat, oboe, tuba, pizzicato, woodblock footsteps, glockenspiel, mud plops).
const C = require('../lib/common'), S = require('../lib/safari');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, rr, hash } = C;
const ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
const INK = '#3a2414';

const GP = { elephant: [118, .86, true], lion: [330, .72, true], rhino: [715, .68, false], buffalo: [855, .72, false] };
const ORDER = ['elephant', 'lion', 'rhino', 'buffalo'];
const BUB = { elephant: [190, 170], lion: [350, 215], rhino: [700, 215], buffalo: [790, 200] };
const sayL = (who, txt, a, b) => [who, txt, a, b, BUB[who][0], BUB[who][1], 28];
const TIL_BUB = [540, 330];

const MUD = '#b98552', MUD2 = '#a77142', PRINT = '#6a4024', PRINT_HI = 'rgba(255,240,215,.25)';
const BUSH = [520, 452, .55];

// ---------- footprints (centred on 0,0, pointing up = walking direction) ----------
function printShape(kind, px, py, s, rot = 0, a = 1, col = PRINT) {
  if (a <= 0) return;
  x.save(); x.globalAlpha *= a; x.translate(px, py); x.rotate(rot); x.scale(s, s);
  x.fillStyle = col;
  const blob = (cx, cy, rx, ry, r2 = 0) => { x.beginPath(); x.ellipse(cx, cy, rx, ry, r2, 0, 7); x.fill(); };
  if (kind === 'paw') {            // lion: big three-lobed pad + four oval toes
    x.beginPath(); x.moveTo(-14, 4); x.quadraticCurveTo(-16, -6, -7, -7); x.quadraticCurveTo(0, -11, 7, -7); x.quadraticCurveTo(16, -6, 14, 4);
    x.quadraticCurveTo(13, 12, 6, 11); x.quadraticCurveTo(0, 15, -6, 11); x.quadraticCurveTo(-13, 12, -14, 4); x.closePath(); x.fill();
    blob(-14, -16, 4.4, 6, -.35); blob(-5, -21, 4.6, 6.4, -.1); blob(5, -21, 4.6, 6.4, .1); blob(14, -16, 4.4, 6, .35);
  } else if (kind === 'round') {   // elephant: big round foot with four little toenail bumps at the front
    blob(0, 2, 17, 19);
    [-11, -4, 4, 11].forEach(a2 => blob(a2, -17, 4, 3.4));
    x.fillStyle = PRINT_HI; blob(-4, 6, 8, 7);
  } else if (kind === 'hoof') {    // buffalo: cloven hoof – two halves
    [-1, 1].forEach(sd => { x.beginPath(); x.moveTo(sd * 2, 12); x.quadraticCurveTo(sd * 13, 12, sd * 12, -2); x.quadraticCurveTo(sd * 10, -14, sd * 2.5, -16);
      x.quadraticCurveTo(sd * 1.5, -2, sd * 2, 12); x.closePath(); x.fill(); });
  } else if (kind === 'three') {   // rhino: rounded sole + three big toes
    blob(0, 4, 13, 11);
    blob(-12, -10, 6, 8, -.5); blob(0, -15, 6.5, 8.5); blob(12, -10, 6, 8, .5);
  } else if (kind === 'tiny') {    // turtle: little round foot with four tiny claw dots
    blob(0, 2, 5, 5.5); [-4.5, -1.5, 1.5, 4.5].forEach(a2 => blob(a2, -5.5, 1.3, 1.6));
  }
  x.restore();
}
// trail of 5 prints walking from left to right across the mud
const TRAIL = { paw: [1.15, 0], round: [1.15, 0], hoof: [1.1, 0], three: [1.1, 0] };
function trail(kind, n, s, a = 1, glow = 0, t = 0) {
  for (let i = 0; i < 5; i++) {
    const k = clamp(n - i); if (k <= 0) continue;
    const px = 250 + i * 115, py = i % 2 ? 522 : 500;
    if (glow > 0) { x.save(); x.globalAlpha = glow * (.5 + .3 * Math.sin(t * 6 + i)); C.ell(px, py, 34 * s, 22 * s, 'rgba(255,230,120,.7)'); x.restore(); }
    printShape(kind, px, py, s * (.7 + .3 * ease(k)), Math.PI / 2 + (i % 2 ? .12 : -.12), a * ease(k));
  }
}
// tiny trail from the front up to the bush
const TINY = [[360, 528], [388, 516], [404, 503], [430, 494], [446, 484], [470, 478], [484, 470]];
function tinyTrail(n, a = 1, glow = 0, t = 0) {
  TINY.forEach(([px, py], i) => { const k = clamp(n - i); if (k <= 0) return;
    if (glow > 0) { x.save(); x.globalAlpha = glow * (.5 + .3 * Math.sin(t * 6 + i)); C.ell(px, py, 12, 8, 'rgba(255,230,120,.7)'); x.restore(); }
    printShape('tiny', px, py, 1.6 * (.7 + .3 * ease(k)), .9 + (i % 2 ? .3 : -.3), a * ease(k)); });
  // the little tail line between the feet
  if (n > 1) { x.save(); x.globalAlpha = a * .5; x.strokeStyle = PRINT; x.lineWidth = 2; x.lineCap = 'round'; x.beginPath();
    TINY.slice(0, Math.min(TINY.length, Math.floor(n))).forEach(([px, py], i) => i ? x.lineTo(px + 6, py + 2) : x.moveTo(px + 6, py + 2)); x.stroke(); x.restore(); }
}

// ---------- mud band in front of the friends ----------
function mud(t, shine = 1) {
  x.fillStyle = MUD; x.beginPath(); x.moveTo(0, 482);
  for (let i = 0; i <= W; i += 20) x.lineTo(i, 480 + Math.sin(i * .02) * 4); x.lineTo(W, 540); x.lineTo(0, 540); x.closePath(); x.fill();
  x.fillStyle = MUD2; [[90, 512, 60, 9], [860, 520, 70, 10], [600, 532, 80, 6], [150, 532, 50, 5]].forEach(([a, b, rx, ry]) => { x.beginPath(); x.ellipse(a, b, rx, ry, 0, 0, 7); x.fill(); });
  // puddles with a soft shine
  [[110, 505, 46, 8], [850, 510, 52, 9]].forEach(([a, b, rx, ry], i) => {
    C.ell(a, b, rx, ry, '#8fc2dc', 'rgba(90,60,30,.6)', 2.5);
    x.save(); x.globalAlpha = .55 * shine; C.ell(a - rx * .3 + Math.sin(t * .8 + i) * 4, b - 2, rx * .35, 2.2, '#ffffff'); x.restore();
  });
  // a few grass tufts at the very edges only (keeps the prints free)
  x.strokeStyle = '#a8772b'; x.lineWidth = 2.5; x.lineCap = 'round';
  [[18, 540], [40, 540], [930, 540], [946, 540], [200, 540], [760, 540]].forEach(([gx, gy], i) => { for (let j = -1; j <= 1; j++) { const sw = Math.sin(t * 1.8 + i + j) * 3;
    x.beginPath(); x.moveTo(gx + j * 6, gy); x.quadraticCurveTo(gx + j * 7 + sw * .5, gy - 12, gx + j * 9 + sw, gy - 22 - (j === 0 ? 6 : 0)); x.stroke(); } });
}
// grey rain clouds drifting away in the intro
function rainClouds(u) {
  const k = clamp(u / 12);
  [[200, 70, 1], [520, 50, 1.2], [790, 90, .9]].forEach(([cx, cy, s], i) => {
    const px = cx + (i % 2 ? 1 : -1) * k * 700, a = 1 - k;
    if (a <= 0) return;
    x.save(); x.globalAlpha = a * .9; x.fillStyle = '#9aa6b2'; x.beginPath();
    [[-50, 0, 30], [-14, -18, 40], [30, -6, 34], [60, 6, 24]].forEach(([a2, b, r]) => { x.moveTo(px + (a2 + r) * s, cy + b * s); x.arc(px + a2 * s, cy + b * s, r * s, 0, 7); }); x.fill();
    // last raindrops
    x.strokeStyle = 'rgba(120,160,200,.7)'; x.lineWidth = 2;
    for (let j = 0; j < 5; j++) { const dy = ((u * 160 + j * 37) % 80); x.beginPath(); x.moveTo(px - 40 * s + j * 20 * s, cy + 30 + dy); x.lineTo(px - 42 * s + j * 20 * s, cy + 40 + dy); x.stroke(); }
    x.restore();
  });
}
function rainbow(a) {
  if (a <= 0) return;
  x.save(); x.globalAlpha = a * .55; x.lineWidth = 9;
  ['#e63946', '#ff8c1a', '#ffd23f', '#5cb85c', '#3a86ff', '#7b4fd6'].forEach((col, i) => { x.strokeStyle = col; x.beginPath(); x.arc(480, 360, 300 - i * 9, Math.PI * 1.08, Math.PI * 1.92); x.stroke(); });
  x.restore();
}

// ---------- Tilly the Turtle (new character) ----------
function tilly(px, py, s, t, o = {}) {
  x.save(); x.translate(px, py); x.scale(s * (o.flip ? -1 : 1), s);
  const walk = o.walk ? Math.sin(t * 8) : 0, head = o.head ?? 1, talk = o.talk || 0;
  x.fillStyle = 'rgba(70,40,10,.22)'; x.beginPath(); x.ellipse(0, 2, 40, 6, 0, 0, 7); x.fill();
  const SK = '#a8d47a';
  // legs
  [[-22, walk], [-8, -walk], [10, walk], [24, -walk]].forEach(([lx, w]) => { C.ell(lx + w * 2, -4 - Math.max(0, w) * 3, 7, 8, SK, INK, 2.5); });
  // tail
  x.fillStyle = SK; x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.moveTo(30, -12); x.lineTo(44, -8); x.lineTo(30, -4); x.closePath(); x.fill(); x.stroke();
  // head (comes out of the shell: head 0..1)
  if (head > 0) {
    x.save(); x.translate(lerp(-14, -40, ease(head)), -20 - Math.sin(t * 2) * 1.5);
    C.ell(0, 0, 17, 15, SK, INK, 2.5);
    const bl = (t + .7) % 3.4 > 3.25;
    [[-7, -3], [5, -3]].forEach(([a, b]) => { if (bl) { x.strokeStyle = INK; x.lineWidth = 2.2; x.beginPath(); x.moveTo(a - 3.5, b); x.lineTo(a + 3.5, b); x.stroke(); }
      else { C.ell(a, b, 4.2, 4.6, INK); C.ell(a + 1.3, b - 1.6, 1.6, 1.6, '#fff'); } });
    C.ell(-12, 5, 3.4, 2.6, 'rgba(255,110,140,.5)'); C.ell(10, 5, 3.4, 2.6, 'rgba(255,110,140,.5)');
    if (talk > .1) C.ell(-1, 7, 4, 2 + talk * 3, '#7a2a2a', INK, 1.8);
    else { x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.arc(-1, 4, 5, .35, Math.PI - .35); x.stroke(); }
    x.restore();
  }
  // shell: dome with a pattern + a little yellow flower
  x.fillStyle = '#5fa85a'; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(-34, -8); x.quadraticCurveTo(-32, -50, 0, -50); x.quadraticCurveTo(32, -50, 34, -8); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = '#8cc66d'; [[-16, -26, 9, 8], [2, -36, 9, 7], [18, -24, 9, 8], [0, -18, 8, 6]].forEach(([a, b, rx, ry]) => { x.beginPath(); x.ellipse(a, b, rx, ry, 0, 0, 7); x.fill(); });
  C.ell(0, -8, 36, 5, '#d9c27a', INK, 2.5);
  x.save(); x.translate(10, -50); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + t * .3; C.ell(Math.cos(a) * 5, Math.sin(a) * 5, 3.6, 3.6, '#ffd23f', INK, 1.4); } C.ell(0, 0, 3, 3, '#ff8c1a'); x.restore();
  x.restore();
}

// ---------- helpers ----------
function savanna(skyT, t) { S.setT(skyT); S.sky(); S.setT(t); S.land(); }
const say = (c, who, k = .45) => { const v = c.talk(who); return v > 0 ? (who === 'elephant' ? .12 + v * .04 : v * k) : 0; };
const hop = (t, sp = 6, h = 8) => Math.abs(Math.sin(t * sp)) * h;
function friends(u, c, liftFn = () => 0, o = {}) {
  ORDER.forEach((k, i) => {
    const [px0, sc, fl] = GP[k], px = o.pos ? o.pos(k, px0) : px0;
    if (o.skip && o.skip(k)) return;
    S.actor(ANI[k], px, o.moving ? o.moving(k) : false, say(c, k), sc, { flip: fl, blinkOff: i * .8, phase: i, lift: liftFn(k, i) });
  });
}
function dots(n, cx, cy) {
  for (let i = 0; i < 3; i++) { const on = n > i, p = on ? ease(clamp((n - i) * 3)) : 0;
    C.ell(cx + (i - 1) * 46, cy, 14, 14, 'rgba(255,255,255,.9)', INK, 3); if (on) C.ell(cx + (i - 1) * 46, cy, 14 * p, 14 * p, INK); }
}
function zoomCard(kind, k, t) {
  if (k <= 0) return;
  const s = .6 + .4 * ease(clamp(k * 2));
  x.save(); x.globalAlpha = clamp(k * 2); x.translate(W / 2, 112); x.scale(s, s);
  x.fillStyle = '#f6e3c4'; x.strokeStyle = INK; x.lineWidth = 5; rr(-100, -82, 200, 164, 30); x.fill(); x.stroke();
  x.fillStyle = MUD; rr(-82, -64, 164, 128, 20); x.fill();
  printShape(kind, 0, 4, kind === 'tiny' ? 7 : 2.7, Math.sin(t * 1.5) * .05);
  x.restore();
}

// ---------- the four rounds (shot 1) ----------
const R0 = .6, RD = 14;
const ROUNDS = [
  ['lion', 'paw', "Leo's soft paws!", 'My paws! Four toes! Roar!', '#e8a33d', 'roar'],
  ['elephant', 'round', "Ella's big round feet!", 'My big round feet!', '#7b8fa3', 'trumpet'],
  ['buffalo', 'hoof', "Boris's hooves!", 'My hooves! Clip, clop!', '#6b5d66', 'bellow'],
  ['rhino', 'three', "Nico's three toes!", 'Three toes – that is me!', '#8d8478', 'snort'],
];
const STEP = .5, Q = 2.8, D0 = 4.4, ANS = 7.6;
const roundSays = [], roundBig = [], roundSfx = [];
ROUNDS.forEach(([who, kind, name, line, col, snd], r) => {
  const s = R0 + r * RD;
  for (let i = 0; i < 5; i++) roundSfx.push([s + i * STEP + .1, kind === 'round' ? 'bump' : kind === 'paw' ? 'tiptoe' : 'tick', kind === 'round' ? .35 : .3, -.4 + i * .2]);
  roundSfx.push([s + Q, 'arp', .3], [s + D0, 'tick', .35], [s + D0 + 1, 'tick', .35], [s + D0 + 2, 'tick', .35], [s + ANS, 'tada', .4], [s + ANS + .3, snd, .25]);
  roundBig.push(['Whose footprints?', s + Q + .2, s + ANS - .3, W / 2, 238, 50, '#ffffff']);
  roundBig.push([name, s + ANS + .1, s + RD - .3, W / 2, 84, 56, col]);
  roundSays.push(sayL(who, line, s + ANS + .5, s + ANS + 3.9));
});
roundSays.push(sayL('elephant', 'Hooray! You know them all!', R0 + 4 * RD - 3.4 + .1, R0 + 4 * RD + .4));

St.episode({
  title: ['Whose Footprints?', 72], sub: 'The Big Four', accent: '#b5651d', cardBg: '#fff3e3',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'footprints', shift: 1 },
  thumb: ['Whose Footprints?', 'The Big Four'],
  shots: [
    // 0 – after the rain: the friends walk onto the muddy path
    { d: 19, draw: (u, c) => {
        savanna(12 + u * .2, c.t);
        rainbow(clamp((u - 8) / 3));
        rainClouds(u);
        const ent = { elephant: 5.0, lion: 5.4, rhino: 5.2, buffalo: 5.6 };
        const pos = (k, px0) => { const k2 = clamp((u - ent[k]) / 3.2); return lerp(GP[k][2] ? -170 : W + 170, px0, ease(k2)); };
        const mv = k => u - ent[k] > 0 && u - ent[k] < 3.2;
        friends(u, c, (k, i) => u > 15.6 && u < 17.6 ? hop(c.t + i, 4, 6) : 0, { pos, moving: mv });
        mud(c.t);
      },
      says: [sayL('rhino', 'The rain has stopped!', 9.0, 11.8), sayL('lion', 'The path is all muddy!', 12.0, 14.8), sayL('elephant', "Let's play a footprint game!", 15.0, 18.4)],
      sfx: [[.5, 'rain:4.5', .2], [5.4, 'splash', .2], [9.0, 'snort', .22], [12.0, 'roar', .2], [15.0, 'trumpet', .25], [15.6, 'arp', .3]] },

    // 1 – four rounds: prints appear → "Whose footprints?" → pause → the owner steps forward
    { d: R0 + 4 * RD, draw: (u, c) => {
        savanna(16, c.t);
        const r = clamp(Math.floor((u - R0) / RD), 0, 3), v = u - R0 - r * RD, [who, kind] = ROUNDS[r];
        const lf = (k, i) => { if (k === who && v > ANS && v < ANS + 1.6) return hop(v, 6, 14);
          return u > R0 + 4 * RD - 3.4 ? hop(c.t + i, 4, 6) : 0; };
        friends(u, c, lf);
        mud(c.t);
        const fade = clamp((RD - .4 - v) / .4);
        trail(kind, v / STEP + .5, TRAIL[kind][0], fade, v > ANS ? clamp((v - ANS) / .4) * fade : 0, c.t);
        if (v > ANS && v < ANS + 1.2) C.sparkles(480, 510, c.t, 10, 220);
      },
      after: (u, c) => {
        const r = clamp(Math.floor((u - R0) / RD), 0, 3), v = u - R0 - r * RD;
        zoomCard(ROUNDS[r][1], win(v, Q, ANS - .4, .25), c.t);
        if (v >= D0 - .1 && v < ANS + .2) dots(clamp(v - D0, 0, 3), W / 2, 300);
      },
      says: roundSays, big: roundBig, sfx: roundSfx },

    // 2 – tiny footprints… who is so small? Tilly the Turtle!
    { d: 28, draw: (u, c) => {
        savanna(19, c.t);
        const out = clamp((u - 10.2) / 4.8);                 // Tilly comes out from behind the bush and walks to the front
        const hide = u < 10.2;
        const tx = lerp(BUSH[0] + 10, 520, ease(out)), ty = lerp(BUSH[1] - 6, 506, ease(out));
        if (hide || out < .5) tilly(tx, ty, .9, c.t, { head: hide ? 0 : 1, walk: !hide && out < 1 });
        S.bush(BUSH[0], BUSH[1], BUSH[2], u > 8.6 && u < 10.8 ? 1 : 0);
        const lf = (k, i) => u > 21.8 && u < 24.6 ? hop(c.t + i, 4, 7) : 0;
        friends(u, c, lf);
        mud(c.t);
        tinyTrail(u / .45 + .3, 1, u > 10.8 && u < 15 ? .8 : 0, c.t);
        if (!hide && out >= .5) tilly(tx, ty, .9 + .3 * ease(clamp((out - .5) * 2)), c.t, { walk: out < 1, talk: c.talk('tilly') });
        if (u > 25.2 && u < 26.8) C.sparkles(520, 470, c.t, 10, 70);
      },
      after: (u, c) => { if (u >= 6.9 && u < 10.6) dots(clamp(u - 7.2, 0, 3), W / 2, 160); },
      says: [sayL('rhino', 'Tiny footprints!', 3.2, 6.2),
             ['tilly', "Hello! I'm Tilly.", 15.4, 18.4, TIL_BUB[0], TIL_BUB[1], 28], ['tilly', 'Can I play with you?', 18.6, 21.6, TIL_BUB[0], TIL_BUB[1], 28],
             sayL('elephant', 'Yes! Come and play!', 21.8, 25.0)],
      big: process.env.THUMBBG ? [] : [['Who is so small?', 3.4, 10.6, W / 2, 84, 56, '#5fa85a'], ['Friends!', 25.2, 27.6, W / 2, 84, 64, '#e63946']],
      sfx: [...[0, 1, 2, 3, 4, 5, 6].map(i => [i * .45 + .2, 'tiptoe', .22, -.3 + i * .08]), [3.2, 'snort', .2], [7.2, 'tick', .35], [8.2, 'tick', .35], [9.2, 'tick', .35],
            [8.6, 'rustle', .4], [10.2, 'pop', .4], [10.8, 'twinkle', .35], [15.4, 'peep', .3], [21.8, 'trumpet', .25], [22.2, 'cheer', .35], [25.2, 'tada', .35]] },

    // 3 – sunset recap: five friends, five kinds of feet (d 30: Tilly's thank-you ends before the end card)
    { d: 30, draw: (u, c) => {
        savanna(58 + u * .05, c.t);
        S.bush(BUSH[0], BUSH[1], BUSH[2]);
        friends(u, c, (k, i) => u > .6 && u < 3.2 ? hop(c.t + i, 4, 6) : 0);
        mud(c.t, .6);
        // after the recap Tilly walks over to Boris (keeps her clear of the subscribe pill at the very end)
        const tw = ease(clamp((u - 18.6) / 3));
        tilly(lerp(520, 872, tw), 506, 1.2, c.t, { talk: c.talk('tilly'), walk: tw > 0 && tw < 1, flip: tw > 0 && tw < 1 });
      },
      after: (u, c) => {
        const k = win(u, 3.6, 18.4, .5); if (k <= 0) return;
        x.save(); x.globalAlpha = k; x.fillStyle = 'rgba(255,248,236,.95)'; x.strokeStyle = INK; x.lineWidth = 4; rr(140, 36, 680, 214, 34); x.fill(); x.stroke(); x.restore();
        const REC = [['paw', 'Leo', '#e8a33d', 1.7], ['round', 'Ella', '#7b8fa3', 1.55], ['hoof', 'Boris', '#6b5d66', 1.7], ['three', 'Nico', '#8d8478', 1.6], ['tiny', 'Tilly', '#5fa85a', 4.2]];
        REC.forEach(([kind, nm, col, sc], i) => {
          const t0 = 4.4 + i * 2.4, cx = 210 + i * 135, kk = clamp((u - t0) / .35) * k, on = u >= t0 && u < t0 + 2.4;
          if (on) { x.save(); x.globalAlpha = k * .45; x.fillStyle = '#ffd23f'; rr(cx - 58, 52, 116, 182, 26); x.fill(); x.restore(); }
          x.save(); x.globalAlpha = k * kk; x.fillStyle = MUD; rr(cx - 48, 62, 96, 100, 18); x.fill(); x.restore();
          printShape(kind, cx, 112, sc * (.6 + .4 * ease(kk)), 0, kk);
          C.bigText(nm, cx, 200, clamp((u - t0 - .4) / .3) * k, 40, col);
        });
      },
      says: [sayL('lion', 'What a fun game!', .6, 3.4), sayL('rhino', 'Every foot is different!', 18.6, 21.6), ['tilly', 'Thank you, friends!', 21.8, 24.8, 872, TIL_BUB[1], 28]],
      sfx: [[.6, 'roar', .22], [1.0, 'laugh', .3], ...[0, 1, 2, 3, 4].map(i => [4.4 + i * 2.4, `chime:${['C5', 'D5', 'E5', 'G5', 'C6'][i]}`, .45]),
            [4.6, 'roar', .15], [7.0, 'trumpet', .15], [9.4, 'bellow', .15], [11.8, 'snort', .15], [14.2, 'peep', .25], [16.8, 'tada', .4], [18.6, 'snort', .2], [21.8, 'peep', .3]] },
  ],
});
