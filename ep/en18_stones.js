// The Big Four – Stepping Stones (English story episode). Tilly the Turtle calls from across a little river: "Come and see my flowers!"
// Ella spots five stepping stones – the friends count them 1 to 5. Nico hops across (hop, hop!), Boris clip-clops after him, and big Ella
// simply wades through the water (splash!). Only Leo stays behind: "I'm scared…" (feelings: SCARED). Ella comes back and stands in the
// water right next to the stones – "Let's go together!" – Nico cheers from the far bank, and Leo hops across slowly while everybody counts
// 1-2-3-4-5. "I did it!" – he feels BRAVE. In Tilly's flower meadow: recap of the five stones and "Scared → Brave", "Friends help friends!"
// Learning moments: counting 1–5, naming feelings (scared / brave), being kind and helping a friend.
// New music: stones_long (bouncy hop-hop march in F – marimba lead (new), pizzicato strings, soft tuba, woodblock hops).
const C = require('../lib/common'), S = require('../lib/safari');
const St = require('../lib/story');
const { x, W, H, clamp, ease, lerp, win, rr, hash } = C;
const ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
const INK = '#3a2414', G = S.GROUND;
const TB = !!process.env.THUMBBG;
const NOTB = a => TB ? [] : a;

// river crossing the front of the scene; five stepping stones on the ground line
const SX = [604, 650, 696, 742, 788];
const FAR = 862;                                     // first spot on the far bank
const NUMC = ['#e63946', '#f59f00', '#2b8a3e', '#1c7ed6', '#9c36b5'];
const WORDS = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'];
const SC = { elephant: .64, lion: .6, rhino: .6, buffalo: .6 };
const Q = { rhino: 500, buffalo: 366, elephant: 214, lion: 72 };   // queue on the near bank (all facing right)
const BY = 300;                                      // bubble height above the friends in the river shots
const TIL = [906, 486, .72];                          // Tilly on the far bank: x, ground y, scale

// ---------- river ----------
function riverPath() {
  x.beginPath(); x.moveTo(706, 338); x.bezierCurveTo(680, 380, 620, 410, 572, 452); x.lineTo(540, 540); x.lineTo(856, 540); x.lineTo(818, 452);
  x.bezierCurveTo(790, 412, 748, 380, 730, 338); x.closePath();
}
function river(t) {
  x.save();
  const g = x.createLinearGradient(0, 338, 0, 540); g.addColorStop(0, '#9fd8f0'); g.addColorStop(1, '#3f9fd6');
  x.fillStyle = g; riverPath(); x.fill();
  x.clip();
  // moving ripples
  x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 2; x.lineCap = 'round';
  for (let k = 0; k < 14; k++) { const yy = 350 + ((hash(k) * 200 + t * 18) % 200), w0 = 8 + (yy - 340) * .09, xx = 718 + (hash(k + 5) - .5) * (yy - 330) * 1.0 - (yy - 338) * .25;
    x.beginPath(); x.moveTo(xx - w0, yy); x.quadraticCurveTo(xx, yy - 3, xx + w0, yy); x.stroke(); }
  x.restore();
  // muddy bank edges
  x.strokeStyle = '#9a6a3a'; x.lineWidth = 5; x.lineCap = 'round';
  x.beginPath(); x.moveTo(706, 338); x.bezierCurveTo(680, 380, 620, 410, 572, 452); x.lineTo(540, 540); x.stroke();
  x.beginPath(); x.moveTo(730, 338); x.bezierCurveTo(748, 380, 790, 412, 818, 452); x.lineTo(856, 540); x.stroke();
  // reeds at the banks
  x.strokeStyle = '#5f8a3a'; x.lineWidth = 3;
  [[560, 470], [552, 494], [834, 472], [846, 498]].forEach(([rx, ry], i) => { for (let j = -1; j <= 1; j++) { const sw = Math.sin(t * 1.6 + i + j) * 3;
    x.beginPath(); x.moveTo(rx + j * 5, ry); x.quadraticCurveTo(rx + j * 6 + sw * .5, ry - 18, rx + j * 8 + sw, ry - 30 - (j === 0 ? 8 : 0)); x.stroke(); }
    C.ell(rx + 2 + Math.sin(t * 1.6 + i) * 3, ry - 36, 3, 7, '#8a5a2b'); });
}
function stone(i, glow = 0, t = 0, wob = 0) {
  const cx = SX[i] + Math.sin(t * 30) * wob * 2, cy = G + 4;
  if (glow > 0) { x.save(); x.globalAlpha = glow * (.6 + .3 * Math.sin(t * 6 + i)); C.ell(cx, cy, 30, 13, 'rgba(255,225,110,.9)'); x.restore(); }
  C.ell(cx, cy + 3, 23, 9, '#6d7378', INK, 2.5);
  C.ell(cx, cy, 22, 8, '#a3aab0', INK, 2.5);
  C.ell(cx - 6, cy - 2, 9, 3, 'rgba(255,255,255,.45)');
  // little ripple ring around the stone
  x.save(); x.globalAlpha = .5; x.strokeStyle = '#ffffff'; x.lineWidth = 1.5; const r = 26 + (t * 6 + i * 3) % 8;
  x.beginPath(); x.ellipse(cx, cy + 6, r, r * .3, 0, .15, Math.PI - .15); x.stroke(); x.restore();
}
function stones(t, glow = [], wob = []) { for (let i = 0; i < 5; i++) stone(i, glow[i] || 0, t, wob[i] || 0); }
// water in front of somebody wading (covers the legs)
function waterFront(cx, hw, t) {
  x.save(); riverPath(); x.clip();
  x.fillStyle = 'rgba(70,160,215,.86)'; x.fillRect(cx - hw, G + 6, hw * 2, 80);
  x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 2.5; x.beginPath();
  for (let px = cx - hw; px <= cx + hw; px += 6) x.lineTo(px, G + 6 + Math.sin(px * .08 + t * 5) * 2.5); x.stroke();
  x.restore();
}
function splash(cx, cy, k, n = 7, sz = 1) {
  if (k <= 0 || k >= 1) return;
  for (let i = 0; i < n; i++) { const a = Math.PI * (.15 + .7 * i / (n - 1)), v = (60 + hash(i + 3) * 50) * sz;
    const px = cx + Math.cos(a) * v * k * (i % 2 ? 1 : -1) * .8, py = cy - Math.sin(a) * v * k * 1.3 + 160 * k * k * sz;
    C.ell(px, py, 4 * sz, 5.5 * sz, `rgba(170,220,250,${1 - k})`, `rgba(40,110,170,${(1 - k) * .8})`, 1.2); }
}
// numeral in the water under a stone
function stoneNum(i, k) { C.bigText(String(i + 1), SX[i], G + 46, k, 36, NUMC[i]); }

// flower meadow on the far bank (behind Tilly)
function flowers(x0, x1, y0, y1, t, n = 22, seed = 0) {
  const cols = ['#ff6b6b', '#ffd23f', '#ff9ec4', '#c49bff', '#ffffff', '#ff8c42'];
  for (let i = 0; i < n; i++) { const px = lerp(x0, x1, hash(i + seed)), py = lerp(y0, y1, hash(i + seed + 40)), s = .7 + (py - y0) / (y1 - y0 + 1) * .6, sw = Math.sin(t * 1.5 + i) * 2;
    x.strokeStyle = '#4f8a2e'; x.lineWidth = 2; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + sw * .5, py - 8 * s, px + sw, py - 16 * s); x.stroke();
    const c = cols[Math.floor(hash(i + seed + 9) * 6)];
    for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 + i; C.ell(px + sw + Math.cos(a) * 4.5 * s, py - 16 * s + Math.sin(a) * 4.5 * s, 3.6 * s, 3.6 * s, c); }
    C.ell(px + sw, py - 16 * s, 2.6 * s, 2.6 * s, '#f59f00'); }
}
function butterflies(t, n = 3, x0 = 700, x1 = 940) {
  const cols = ['#ff9ec4', '#74c0fc', '#ffd23f'];
  for (let i = 0; i < n; i++) { const px = lerp(x0, x1, (Math.sin(t * .3 + i * 2.1) + 1) / 2), py = 300 + Math.sin(t * .9 + i * 1.7) * 40 + i * 14, f = Math.abs(Math.sin(t * 9 + i));
    x.fillStyle = cols[i % 3]; x.strokeStyle = INK; x.lineWidth = 1.2;
    [-1, 1].forEach(sd => { x.beginPath(); x.ellipse(px + sd * 5 * f, py - 3, 5 * f + .5, 6, 0, 0, 7); x.fill(); x.stroke(); });
    C.ell(px, py, 1.6, 5, INK); }
}

// ---------- Tilly the Turtle (same character as in "Whose Footprints?") ----------
function tilly(px, py, s, t, o = {}) {
  x.save(); x.translate(px, py); x.scale(s * (o.flip ? -1 : 1), s);
  const walk = o.walk ? Math.sin(t * 8) : 0, talk = o.talk || 0, jump = o.jump || 0;
  x.translate(0, -jump);
  x.fillStyle = 'rgba(70,40,10,.22)'; x.beginPath(); x.ellipse(0, 2 + jump, 40, 6, 0, 0, 7); x.fill();
  const SK = '#a8d47a';
  [[-22, walk], [-8, -walk], [10, walk], [24, -walk]].forEach(([lx, w]) => { C.ell(lx + w * 2, -4 - Math.max(0, w) * 3, 7, 8, SK, INK, 2.5); });
  x.fillStyle = SK; x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.moveTo(30, -12); x.lineTo(44, -8); x.lineTo(30, -4); x.closePath(); x.fill(); x.stroke();
  x.save(); x.translate(-40, -20 - Math.sin(t * 2) * 1.5);
  C.ell(0, 0, 17, 15, SK, INK, 2.5);
  const bl = (t + .7) % 3.4 > 3.25;
  [[-7, -3], [5, -3]].forEach(([a, b]) => { if (bl) { x.strokeStyle = INK; x.lineWidth = 2.2; x.beginPath(); x.moveTo(a - 3.5, b); x.lineTo(a + 3.5, b); x.stroke(); }
    else { C.ell(a, b, 4.2, 4.6, INK); C.ell(a + 1.3, b - 1.6, 1.6, 1.6, '#fff'); } });
  C.ell(-12, 5, 3.4, 2.6, 'rgba(255,110,140,.5)'); C.ell(10, 5, 3.4, 2.6, 'rgba(255,110,140,.5)');
  if (talk > .1) C.ell(-1, 7, 4, 2 + talk * 3, '#7a2a2a', INK, 1.8);
  else { x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.arc(-1, 4, 5, .35, Math.PI - .35); x.stroke(); }
  x.restore();
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
const hopH = (t, sp = 6, h = 8) => Math.abs(Math.sin(t * sp)) * h;
function actor(who, px, c, o = {}) {
  S.actor(ANI[who], px + (o.shiver ? Math.sin(c.t * 34) * 1.6 : 0), !!o.moving, o.act ?? say(c, who), o.sc || SC[who],
    { flip: o.flip ?? true, blinkOff: o.blink || 0, phase: o.phase || 0, lift: o.lift || 0, noShadow: o.noShadow });
}
// position along the crossing: p = 0 (near bank start), 1..5 (stones), 6 (far bank)
function crossPos(start, p, h = 20) {
  const P = [start, ...SX, FAR], i = clamp(Math.floor(p), 0, 5), f = clamp(p - i, 0, 1);
  if (p >= 6) return [FAR, 0];
  return [lerp(P[i], P[i + 1], ease(f)), Math.sin(f * Math.PI) * h];
}
// hops: start time a, duration per hop d, pause between hops g -> progress p at time u
function hopP(u, a, d, g = 0) { if (u < a) return 0; const per = d + g, k = Math.floor((u - a) / per), f = clamp(((u - a) - k * per) / d); return Math.min(6, k + f); }
function sweat(px, py, t) { const k = (t * .8) % 1; C.ell(px, py + k * 14, 4, 6, `rgba(120,190,240,${1 - k})`, `rgba(40,100,160,${1 - k})`, 1.2); }

// ---------- shot timing ----------
const HOP_N = 1.0, DN = .55;                          // Nico: starts at 1.0, .55 s per hop
const HOP_B = 1.0, DB = .7;                           // Boris
const L0 = 2.4, DL = .8, GL = 1.5;                    // Leo: slow hops with pauses (count)
const leoLand = i => L0 + i * (DL + GL) + DL;         // time Leo lands on stone i (0..4); i = 5 -> far bank

St.episode({
  title: ['Stepping Stones', 72], sub: 'The Big Four', accent: '#1c7ed6', cardBg: '#eef7ff',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'stones', shift: 0 },
  thumb: ['Stepping Stones', 'The Big Four'],
  shots: [
    // 0 – the friends arrive at a little river; Tilly calls from the other side
    { d: 20, draw: (u, c) => {
        savanna(12 + u * .2, c.t);
        flowers(836, 955, 476, 534, c.t, 14, 3); butterflies(c.t, 3, 800, 940);
        river(c.t); stones(c.t);
        ['lion', 'elephant', 'buffalo', 'rhino'].forEach((k, i) => {
          const a = 4.6 + i * .5, kk = clamp((u - a) / 3.2);
          actor(k, lerp(-180, Q[k], ease(kk)), c, { moving: kk > 0 && kk < 1, blink: i * .8, phase: i, lift: u > 17.4 && u < 19.4 && k !== 'lion' ? hopH(c.t + i, 4, 6) : 0 });
        });
        tilly(TIL[0], TIL[1], TIL[2], c.t, { talk: c.talk('tilly'), jump: u > 8.4 && u < 9.4 ? hopH(u, 6, 6) : 0 });
      },
      says: [['tilly', 'Hello, friends!', 8.4, 11.0, TIL[0], 368, 28], ['tilly', 'Come and see my flowers!', 11.2, 14.0, TIL[0] - 40, 368, 28],
             ['rhino', 'But there is a river!', 14.2, 17.0, Q.rhino, BY, 28], ['elephant', 'Look! Stepping stones!', 17.2, 19.8, Q.elephant + 40, BY, 28]],
      sfx: [[.4, 'rain:6', .08], [4.8, 'tiptoe', .2], [5.8, 'tiptoe', .2], [8.4, 'peep', .3], [14.2, 'snort', .22], [17.2, 'trumpet', .25]] },

    // 1 – count the stones 1..5
    { d: 14, draw: (u, c) => {
        savanna(16, c.t);
        flowers(836, 955, 476, 534, c.t, 14, 3); butterflies(c.t, 3, 800, 940);
        river(c.t);
        const gl = SX.map((_, i) => { const a = 3.4 + i * 1.6; return u >= a ? clamp((u - a) / .3) * (u < a + 1.6 ? 1 : .35) : 0; });
        stones(c.t, gl);
        ['lion', 'elephant', 'buffalo', 'rhino'].forEach((k, i) => actor(k, Q[k], c, { blink: i * .8, phase: i, lift: u > 11.8 && u < 13.6 ? hopH(c.t + i, 4, 6) : 0 }));
        tilly(TIL[0], TIL[1], TIL[2], c.t, { talk: c.talk('tilly') });
        for (let i = 0; i < 5; i++) { const a = 3.4 + i * 1.6; if (u >= a) stoneNum(i, clamp((u - a) / .35)); }
      },
      says: [['lion', "Let's count the stones!", .4, 3.2, Q.lion + 60, BY, 28]],
      big: NOTB([['Five stepping stones!', 11.6, 13.8, W / 2, 84, 56, '#1c7ed6']]),
      sfx: [...[0, 1, 2, 3, 4].map(i => [3.4 + i * 1.6, `chime:${['F5', 'G5', 'A5', 'A#5', 'C6'][i]}`, .55]), [.4, 'roar', .18], [11.6, 'tada', .4]] },

    // 2 – Nico hops across: hop, hop!
    { d: 13, draw: (u, c) => {
        savanna(17, c.t);
        flowers(836, 955, 476, 534, c.t, 14, 3); butterflies(c.t, 3, 800, 940);
        river(c.t);
        const p = hopP(u, HOP_N, DN), land = Math.floor(p);
        stones(c.t, SX.map((_, i) => land === i + 1 && p - land < .6 ? 1 : 0));
        ['lion', 'elephant', 'buffalo'].forEach((k, i) => actor(k, Q[k], c, { blink: i * .8, phase: i }));
        tilly(TIL[0], TIL[1], TIL[2], c.t, { talk: c.talk('tilly') });
        let [rx, lift] = crossPos(Q.rhino, p, 22);
        const off = ease(clamp((u - 8.2) / 3.4)); if (p >= 6) rx = lerp(FAR, 1200, off);
        actor('rhino', rx, c, { lift, moving: p >= 6 && off > 0 && off < 1, phase: 2 });
        for (let i = 0; i < 5; i++) { const a = HOP_N + i * DN + DN; if (u >= a) stoneNum(i, win(u, a, 7.8, .25)); }
      },
      says: [['rhino', 'Hop, hop! Easy!', 4.8, 7.8, FAR, BY, 28]],
      sfx: [...[0, 1, 2, 3, 4, 5].map(i => [HOP_N + i * DN + DN - .05, i < 5 ? `xylo:${['F5', 'G5', 'A5', 'A#5', 'C6'][i]}` : 'tiptoe', i < 5 ? .3 : .25, -.2 + i * .1]), [4.8, 'snort', .22]] },

    // 3 – Boris clip-clops after him (the stones wobble a little)
    { d: 12, draw: (u, c) => {
        savanna(18, c.t);
        flowers(836, 955, 476, 534, c.t, 14, 3); butterflies(c.t, 3, 800, 940);
        river(c.t);
        const p = hopP(u, HOP_B, DB), land = Math.floor(p), fr = p - land;
        stones(c.t, SX.map((_, i) => land === i + 1 && fr < .5 ? 1 : 0), SX.map((_, i) => land === i + 1 && fr < .3 ? 1 - fr / .3 : 0));
        ['lion', 'elephant'].forEach((k, i) => actor(k, Q[k], c, { blink: i * .8, phase: i }));
        tilly(TIL[0], TIL[1], TIL[2], c.t);
        let [bx, lift] = crossPos(Q.buffalo, p, 16);
        const off = ease(clamp((u - 7.6) / 3.4)); if (p >= 6) bx = lerp(FAR, 1200, off);
        actor('buffalo', bx, c, { lift, moving: p >= 6 && off > 0 && off < 1, phase: 3 });
        for (let i = 0; i < 5; i++) { const a = HOP_B + i * DB + DB; splash(SX[i], G + 6, clamp((u - a) / .7), 5, .8); if (u >= a) stoneNum(i, win(u, a, 7.4, .25)); }
      },
      says: [['buffalo', 'Clip, clop! I did it!', 5.6, 8.4, FAR, BY, 28]],
      sfx: [...[0, 1, 2, 3, 4, 5].map(i => [HOP_B + i * DB + DB - .05, 'bump', .32, -.2 + i * .1]), ...[0, 1, 2, 3, 4].map(i => [HOP_B + i * DB + DB, 'splash', .1, -.2 + i * .1]), [5.6, 'bellow', .2]] },

    // 4 – Ella is big: she just wades through the water (splash!)
    { d: 14, draw: (u, c) => {
        savanna(19, c.t);
        flowers(836, 955, 476, 534, c.t, 14, 3); butterflies(c.t, 3, 800, 940);
        river(c.t); stones(c.t);
        tilly(TIL[0], TIL[1], TIL[2], c.t);
        // walk to the bank (1–3.4), wade across (3.8–9.2), climb out and walk off (9.4–13)
        let ex, low = 0;
        if (u < 3.6) ex = lerp(Q.elephant, 556, ease(clamp((u - 1.0) / 2.4)));
        else if (u < 9.4) { const k = clamp((u - 3.8) / 5.4); ex = lerp(556, FAR - 6, k); low = Math.sin(clamp(k * 1.25) * Math.PI / 2) * (k > .8 ? lerp(1, 0, (k - .8) / .2) : 1) * 32; }
        else ex = lerp(FAR - 6, 1220, ease(clamp((u - 9.6) / 3.4)));
        const mv = (u > 1 && u < 3.4) || (u > 3.8 && u < 9.2) || (u > 9.6 && u < 13);
        actor('elephant', ex, c, { moving: mv, lift: -low, act: u > 5.6 && u < 7.4 ? .9 : say(c, 'elephant'), noShadow: low > 2, blink: .8 });
        if (low > 2) waterFront(ex, 92, c.t);
        if (u > 5.8 && u < 7.6) { const k = (u - 5.8) / 1.8; splash(ex - 40, G - 60, k, 9, 1.1); }
        splash(560, G + 8, clamp((u - 3.8) / .8), 8, 1);
        actor('lion', Q.lion, c, { blink: .2 });
      },
      says: [['elephant', "I'm big! I can walk in the water!", .6, 3.6, 340, 290, 26], ['elephant', 'Splash! So much fun!', 6.2, 9.0, 700, 270, 28]],
      sfx: [[1.0, 'bump', .25], [2.0, 'bump', .25], [3.8, 'splash', .4], [5.0, 'splash', .2], [5.8, 'spray:1.6', .3], [7.0, 'splash', .2], [8.4, 'splash', .2], [6.2, 'trumpet', .22]] },

    // 5 – Leo stays behind: he is scared. Ella comes back and stands in the water by the stones.
    { d: 16, draw: (u, c) => {
        savanna(20, c.t);
        flowers(836, 955, 476, 534, c.t, 14, 3); butterflies(c.t, 3, 800, 940);
        river(c.t); stones(c.t);
        tilly(TIL[0], TIL[1], TIL[2], c.t, { talk: c.talk('tilly') });
        // Ella walks back in from the right and wades to her helping spot next to the stones
        const ek = ease(clamp((u - 8.0) / 4.0)), ex = lerp(1220, 720, ek);
        const low = ex < FAR ? clamp((FAR - ex) / 60) * 32 : 0;
        if (u > 8.0) { actor('elephant', ex, c, { flip: false, moving: ek > 0 && ek < 1, lift: -low, noShadow: low > 2, blink: .8 }); if (low > 2) waterFront(ex, 92, c.t); }
        const lk = ease(clamp((u - .8) / 3.0)), lx = lerp(Q.lion, 500, lk), scared = u > 4.2;
        actor('lion', lx, c, { moving: lk > 0 && lk < 1, shiver: scared && u < 12, blink: .2 });
        if (scared && u < 12) sweat(lx + 64, G - 118, c.t);
      },
      says: [['lion', "I'm scared...", 4.6, 7.6, 500, BY, 28], ['tilly', "It's okay, Leo!", 7.8, 10.2, TIL[0], 368, 28], ['elephant', "Let's go together!", 12.0, 15.2, 720, 280, 28]],
      big: NOTB([['scared', 4.8, 8.2, W / 2, 84, 60, '#5c7cfa']]),
      sfx: [[4.6, 'sad', .25], [7.8, 'peep', .25], [9.0, 'bump', .2], [10.6, 'splash', .3], [12.0, 'trumpet', .22]] },

    // 6 – Leo hops across slowly while everybody counts; Nico cheers from the far bank. I did it! BRAVE!
    { d: 20, draw: (u, c) => {
        savanna(21, c.t);
        flowers(836, 955, 476, 534, c.t, 14, 3); butterflies(c.t, 3, 800, 940);
        river(c.t);
        const p = hopP(u, L0, DL, GL), land = Math.floor(p);
        stones(c.t, SX.map((_, i) => land > i ? (land === i + 1 ? 1 : .35) : 0));
        tilly(TIL[0], TIL[1], TIL[2], c.t, { jump: u > 14.4 && u < 17 ? hopH(c.t, 5, 7) : 0 });
        const nk = ease(clamp((u - .2) / 2.2));
        actor('rhino', lerp(1180, 880, nk), c, { flip: false, moving: nk > 0 && nk < 1, lift: u > 14.4 && u < 17 ? hopH(c.t + 1, 5, 6) : 0, phase: 2 });
        actor('elephant', 720, c, { flip: false, lift: -32, noShadow: true, act: u > 14.4 && u < 17 ? .9 : say(c, 'elephant'), blink: .8 });
        waterFront(720, 92, c.t);
        let [lx, lift] = crossPos(500, p, 24);
        if (p >= 6) lift = u > 14.2 && u < 17.2 ? hopH(u, 6, 14) : 0;
        actor('lion', lx, c, { lift, blink: .2 });
        for (let i = 0; i < 5; i++) { const a = leoLand(i); if (u >= a) stoneNum(i, clamp((u - a) / .3)); }
        if (u > 14.2 && u < 16) C.sparkles(FAR, G - 70, c.t, 10, 90);
      },
      after: (u, c) => {
        if (TB) return;
        for (let i = 0; i < 5; i++) { const a = leoLand(i), kk = win(u, a, a + GL + .5, .2); C.bigText(String(i + 1), W / 2 - 60, 92, kk, 96, NUMC[i]); C.bigText(WORDS[i], W / 2 + 70, 96, kk, 46, '#ffffff'); }
      },
      says: [['rhino', 'You can do it, Leo!', .6, 2.4, 870, BY, 28], ['lion', 'I did it!', 14.4, 17.0, FAR, BY, 30], ['elephant', 'You are so brave!', 17.2, 19.8, 640, 280, 28]],
      big: NOTB([['brave', 14.6, 19.6, W / 2, 84, 64, '#f08c00']]),
      sfx: [...[0, 1, 2, 3, 4].map(i => [leoLand(i), `chime:${['F5', 'G5', 'A5', 'A#5', 'C6'][i]}`, .55]), [leoLand(5) - .05, 'tiptoe', .25],
            [.6, 'snort', .2], [14.4, 'roar', .25], [14.6, 'tada', .4], [15.0, 'cheer', .35], [17.2, 'trumpet', .2]] },

    // 7 – Tilly's flower meadow: recap (five stones, scared → brave), "Friends help friends!"
    { d: 33, draw: (u, c) => {
        savanna(40 + u * .4, c.t);
        flowers(0, W, 440, 540, c.t, 70, 11); butterflies(c.t, 4, 60, 900);
        const POS = { elephant: [120, .62, true], lion: [330, .6, true], rhino: [650, .58, false], buffalo: [846, .6, false] };
        // after "Friends help friends!" everybody walks off to play in the meadow (clear of the subscribe pill at the very end)
        const ex = ease(clamp((u - 23.2) / 3.0)), exm = u > 23.2 && ex < 1;
        ['elephant', 'lion', 'rhino', 'buffalo'].forEach((k, i) => { const [px0, sc, fl0] = POS[k], left = k === 'elephant' || k === 'lion';
          const px = lerp(px0, left ? px0 - 520 : px0 + 520, ex), fl = u > 23.2 ? !left : fl0;
          actor(k, px, c, { sc, flip: fl, moving: exm, blink: i * .8, phase: i, lift: u > .4 && u < 2.6 ? hopH(c.t + i, 4, 6) : (k === 'lion' && u > 9.0 && u < 10.8 ? hopH(c.t, 6, 10) : 0) }); });
        tilly(lerp(490, 1060, ex), 486, 1.05, c.t, { talk: c.talk('tilly'), walk: exm, flip: u > 23.2 });
      },
      after: (u, c) => {
        const k = win(u, 10.6, 22.6, .5); if (k <= 0) return;
        x.save(); x.globalAlpha = k; x.fillStyle = 'rgba(246,251,255,.96)'; x.strokeStyle = INK; x.lineWidth = 4; rr(130, 30, 700, 226, 34); x.fill(); x.stroke(); x.restore();
        // five stones with numbers
        for (let i = 0; i < 5; i++) { const t0 = 11.2 + i * .9, kk = clamp((u - t0) / .3) * k, cx = 210 + i * 72;
          x.save(); x.globalAlpha = kk; C.ell(cx, 112, 26, 10, '#a3aab0', INK, 2.5); C.ell(cx - 7, 109, 10, 3, 'rgba(255,255,255,.5)'); x.restore();
          C.bigText(String(i + 1), cx, 76, kk, 40, NUMC[i]); }
        C.bigText('Five stones!', 354, 170, clamp((u - 16) / .4) * k, 40, '#1c7ed6');
        // scared -> brave
        C.bigText('scared', 610, 84, clamp((u - 17.2) / .4) * k, 44, '#5c7cfa');
        if (u > 18.4) { x.save(); x.globalAlpha = clamp((u - 18.4) / .4) * k; x.strokeStyle = INK; x.fillStyle = INK; x.lineWidth = 5; x.lineCap = 'round';
          x.beginPath(); x.moveTo(610, 112); x.lineTo(610, 142); x.stroke(); x.beginPath(); x.moveTo(598, 136); x.lineTo(610, 152); x.lineTo(622, 136); x.closePath(); x.fill(); x.restore(); }
        C.bigText('brave!', 610, 196, clamp((u - 19.2) / .4) * k, 56, '#f08c00');
        if (u > 19.2 && u < 21) C.sparkles(610, 196, c.t, 10, 70);
      },
      says: [['tilly', 'Welcome to my flowers!', .6, 3.4, 490, 352, 28], ['lion', 'I was scared...', 3.8, 6.4, 330, 300, 28], ['lion', 'But my friends helped me!', 6.6, 9.4, 360, 300, 28],
             ['elephant', 'Friends help friends!', 20.4, 23.0, 200, 300, 28]],
      sfx: [[.6, 'peep', .3], [1.0, 'laugh', .3], [3.8, 'roar', .15], [9.0, 'cheer', .3], ...[0, 1, 2, 3, 4].map(i => [11.2 + i * .9, `chime:${['F5', 'G5', 'A5', 'A#5', 'C6'][i]}`, .45]),
            [16.0, 'tada', .3], [17.2, 'sad', .15], [19.2, 'tada', .4], [20.4, 'trumpet', .22], [20.8, 'cheer', .3], [23.4, 'laugh', .25]] },
  ],
});
