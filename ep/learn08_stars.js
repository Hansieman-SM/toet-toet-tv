// Learning series – Counting #4: 10 Twinkling Stars at Bedtime with The Big Four (night savanna).
// The sun has gone down. The Big Four walk out onto the savanna and look up: one by one, ten friendly little stars light up in the sky
// (each with its own colour and a little face). A tray of 10 at the top fills up, each new star gets a big numeral + number word and a
// rising chime. The sky slowly gets darker, the friends start to yawn. Then: TEN!, a gentle shooting star, recap 1–10, the moon rises,
// "Good night, stars!" and the friends fall asleep (z z z) while the stars close their eyes too.
// New music: stars_long (French-horn lullaby in F, 6/8 – nylon-guitar arpeggios, soft bass, string pad, triangle).
const C = require('../lib/common'), S = require('../lib/safari');
const St = require('../lib/story');
const { x, W, H, clamp, ease, lerp, win, rr, circ, hash, mix } = C;

const G = S.GROUND, ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
const INK = '#1d2a4a';
const NUM = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];
const SCOL = ['#ffd23f', '#ff9ec7', '#7be0b4', '#7cc4ff', '#ffab5e', '#c7a4ff', '#fff07a', '#ffb4a2', '#5fe0e6', '#ffe9a8'];
const NOTES = ['F5', 'G5', 'A5', 'A#5', 'C6', 'D6', 'E6', 'F6', 'G6', 'A6'];
const POS = { elephant: [140, .68, true], lion: [345, .72, true], rhino: [628, .66, false], buffalo: [832, .66, false] };
const ORDER = ['elephant', 'lion', 'rhino', 'buffalo'];
// where each counting star lights up in the sky (kept away from the tray, the big numeral in the middle and the speech bubbles)
const SPOT = [[96, 128], [866, 136], [250, 196], [712, 118], [140, 228], [812, 222], [318, 124], [650, 206], [58, 182], [912, 192]];
const SAY = [['lion', 'The first star!'], ['elephant', 'There is another one!'], ['rhino', 'Hello, little star!'], ['buffalo', 'So twinkly!'],
             ['lion', 'It is winking at me!'], ['elephant', 'Look, up there!'], ['rhino', 'A tiny one!'], ['buffalo', 'A big, bright one!'],
             ['lion', 'I am getting sleepy…'], ['elephant', 'The last one!']];
const BUBX = { elephant: 200, lion: 360, rhino: 650, buffalo: 790 }, BUBY = 300;
const HEAD = { lion: [-58, -132], elephant: [-82, -196], rhino: [-84, -128], buffalo: [-112, -122] };
const SEG = 7, GLOW0 = .3, LAND = 1.8;        // per star: shimmer 0.3–1.8, pop at 1.8, numeral 1.8–6.5

const walk = (u, a, b, x0, x1) => u < a ? x0 : u > b ? x1 : lerp(x0, x1, ease((u - a) / (b - a)));
const hop = (t, sp = 6, h = 8) => Math.abs(Math.sin(t * sp)) * h;

// ---------- night savanna (dk: 0 = dusk, 1 = deep night) ----------
function acaciaSil(px, py, s, col) {
  x.save(); x.translate(px, py); x.scale(s, s); x.fillStyle = col;
  x.beginPath(); x.moveTo(-5, 0); x.lineTo(-3, -70); x.lineTo(-26, -96); x.lineTo(-20, -99); x.lineTo(0, -78); x.lineTo(18, -100); x.lineTo(24, -96); x.lineTo(5, -70); x.lineTo(6, 0); x.fill();
  x.beginPath(); x.ellipse(-6, -104, 62, 12, 0, 0, 7); x.ellipse(28, -100, 36, 9, 0, 0, 7); x.ellipse(-42, -99, 32, 9, 0, 0, 7); x.fill();
  x.restore();
}
function night(t, dk, nDots = 1) {
  S.setT(t);
  const g = x.createLinearGradient(0, 0, 0, 360);
  g.addColorStop(0, mix('#3a4a8c', '#0d1738', dk)); g.addColorStop(.6, mix('#7a6aa8', '#1d2b5e', dk)); g.addColorStop(1, mix('#f2a684', '#34457e', dk));
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // tiny background stars appear as it gets darker (dots, never mistaken for the big counting stars)
  for (let i = 0; i < 70; i++) {
    const a = clamp((dk - hash(i + 5) * .7) * 3) * nDots; if (a <= 0) continue;
    const px = hash(i) * W, py = 18 + hash(i + 20) * 300, tw = .55 + .45 * Math.sin(t * (1.2 + hash(i + 9) * 2) + i);
    x.fillStyle = `rgba(255,250,225,${(.65 * a * tw).toFixed(3)})`; x.beginPath(); x.arc(px, py, .9 + hash(i + 40) * 1.4, 0, 7); x.fill();
  }
  // far hills
  x.fillStyle = mix('#5b4f7e', '#1a2448', dk); x.beginPath(); x.moveTo(0, 345);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 322 + Math.sin(i * .008 + 1) * 14 + Math.sin(i * .021) * 5); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  acaciaSil(110, 352, .62, mix('#3e3560', '#121a36', dk)); acaciaSil(880, 346, .5, mix('#3e3560', '#121a36', dk)); acaciaSil(690, 352, .38, mix('#3e3560', '#121a36', dk));
  // near savanna
  x.fillStyle = mix('#6f6a5a', '#27354f', dk); x.beginPath(); x.moveTo(0, 380);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 372 + Math.sin(i * .007 + 2) * 8); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  x.fillStyle = mix('#7d7763', '#2e3d5a', dk); x.beginPath(); x.ellipse(W / 2, G + 10, 620, 38, 0, 0, 7); x.fill();
  S.grass(372, 10, 0, mix('#4d4a3c', '#1c2840', dk));
}
function front(t, dk) {
  x.fillStyle = mix('#5d5848', '#1e2a42', dk); x.beginPath(); x.moveTo(0, 508);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 506 + Math.sin(i * .02 + 1) * 5 + Math.sin(i * .05) * 2); x.lineTo(W, H); x.lineTo(0, H); x.closePath(); x.fill();
  // little grass tufts
  x.strokeStyle = mix('#7a7458', '#33445f', dk); x.lineWidth = 3; x.lineCap = 'round';
  for (let i = 0; i < 18; i++) { const gx = 20 + i * 54 + hash(i) * 20, gy = 512 + hash(i + 3) * 8, sw = Math.sin(t * 1.3 + i) * 2;
    x.beginPath(); x.moveTo(gx - 6, gy); x.lineTo(gx - 9 + sw, gy - 12); x.moveTo(gx, gy); x.lineTo(gx + sw, gy - 16); x.moveTo(gx + 6, gy); x.lineTo(gx + 9 + sw, gy - 11); x.stroke(); }
}
// soft moonlight tint over the friends so they sit in the night, but stay bright and friendly
function nightTint(dk) { x.fillStyle = `rgba(20,30,80,${(.05 + .13 * dk).toFixed(3)})`; x.fillRect(0, 0, W, H); }

// ---------- the friendly little star ----------
function starPath(r1, r2) {
  x.beginPath();
  for (let k = 0; k < 10; k++) { const an = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? r2 : r1; k ? x.lineTo(Math.cos(an) * r, Math.sin(an) * r) : x.moveTo(Math.cos(an) * r, Math.sin(an) * r); }
  x.closePath();
}
function star(cx, cy, s, col, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s <= 0) return;
  x.save(); x.globalAlpha *= a; x.translate(cx, cy); x.scale(s, s); x.rotate(o.rot || 0);
  if (o.glow !== 0) { const gr = x.createRadialGradient(0, 0, 4, 0, 0, 44); gr.addColorStop(0, 'rgba(255,245,200,.55)'); gr.addColorStop(1, 'rgba(255,245,200,0)');
    x.fillStyle = gr; x.beginPath(); x.arc(0, 0, 44, 0, 7); x.fill(); }
  x.lineJoin = 'round'; starPath(23, 11);
  x.fillStyle = col; x.fill(); x.strokeStyle = INK; x.lineWidth = 3; x.stroke();
  x.fillStyle = 'rgba(255,255,255,.45)'; x.beginPath(); x.ellipse(-6, -7, 3, 5, -.5, 0, 7); x.fill();
  if (o.face !== false) {
    x.rotate(-(o.rot || 0));
    if (o.sleep) { x.strokeStyle = INK; x.lineWidth = 1.8; x.lineCap = 'round';
      [-5, 5].forEach(e => { x.beginPath(); x.arc(e, -1, 2.6, .2, Math.PI - .2); x.stroke(); }); }
    else if (o.wink) { circ(-5, -1, 2.1, INK); x.strokeStyle = INK; x.lineWidth = 1.8; x.lineCap = 'round'; x.beginPath(); x.arc(5, -1, 2.4, Math.PI + .3, -.3); x.stroke(); }
    else { circ(-5, -1, 2.1, INK); circ(5, -1, 2.1, INK); circ(-5.6, -1.7, .7, '#fff'); circ(4.4, -1.7, .7, '#fff'); }
    x.strokeStyle = INK; x.lineWidth = 1.8; x.lineCap = 'round'; x.beginPath(); x.arc(0, 2.5, 3.6, .35, Math.PI - .35); x.stroke();
    x.fillStyle = 'rgba(255,110,140,.4)'; [-9, 9].forEach(e => { x.beginPath(); x.arc(e, 3, 2.4, 0, 7); x.fill(); });
  }
  x.restore();
}
// counting star i in the sky (twinkle = gentle scale pulse)
function skyStar(i, t, k = 1, o = {}) {
  const [sx, sy] = SPOT[i], tw = 1 + .06 * Math.sin(t * (2 + hash(i) * 1.5) + i * 1.7);
  star(sx, sy, (.92 + hash(i + 3) * .2) * tw * k, SCOL[i], Object.assign({ rot: Math.sin(t * .7 + i) * .08, wink: o.winkAt !== undefined && Math.abs(t - o.winkAt) < .35 }, o));
}

// ---------- the friends ----------
function sayLevel(c, who) { const v = c.talk(who); return v > 0 ? (who === 'elephant' ? .12 + v * .04 : v * .45) : 0; }
// st = {x, mv, lift, act, sleep (0..1 eyes closed), breathe}
function friends(c, st = {}) {
  ORDER.forEach((k, i) => {
    const [px0, sc, fl] = POS[k], X = st.x || {}, M = st.mv || {}, L = st.lift || {}, A = st.act || {};
    const px = X[k] ?? px0, mv = !!M[k], act = Math.max(A[k] || 0, sayLevel(c, k));
    if (!st.sleep) { S.actor(ANI[k], px, mv, act, sc, { flip: fl, blinkOff: i * .8, phase: i, lift: L[k] || 0 }); return; }
    // asleep: eyes closed, slow breathing
    const br = 1 + .018 * Math.sin(c.t * 1.6 + i * 1.3);
    x.save(); x.translate(px, G - (L[k] || 0)); x.scale(sc * (fl ? -1 : 1), sc * br);
    x.fillStyle = 'rgba(10,15,40,.25)'; x.beginPath(); x.ellipse(0, 2, 90, 9, 0, 0, 7); x.fill();
    ANI[k](c.t * 7 + i, false, 0, true);
    x.restore();
  });
}
function headPos(k) { const [px, sc, fl] = POS[k], [hx, hy] = HEAD[k]; return [px + (fl ? -hx : hx) * sc, G + hy * sc]; }
function zzz(t, k, a) {
  if (a <= 0) return;
  const [hx, hy] = headPos(k);
  x.save(); x.font = C.FONT(32); x.textAlign = 'center'; x.textBaseline = 'middle';
  for (let j = 0; j < 3; j++) {
    const p = ((t * .35 + j / 3 + hash(ORDER.indexOf(k)) ) % 1), al = a * Math.sin(p * Math.PI);
    const zx = hx + 14 + p * 34 + Math.sin(p * 6 + j) * 6, zy = hy - 18 - p * 70, s = .6 + p * .7;
    x.save(); x.globalAlpha = clamp(al); x.translate(zx, zy); x.scale(s, s);
    x.lineWidth = 5; x.strokeStyle = INK; x.strokeText('z', 0, 0); x.fillStyle = '#eef2ff'; x.fillText('z', 0, 0); x.restore();
  }
  x.restore();
}
function moon(cx, cy, a) {
  if (a <= 0) return;
  x.save(); x.globalAlpha = a;
  const gr = x.createRadialGradient(cx, cy, 20, cx, cy, 110); gr.addColorStop(0, 'rgba(255,248,220,.35)'); gr.addColorStop(1, 'rgba(255,248,220,0)');
  x.fillStyle = gr; x.beginPath(); x.arc(cx, cy, 110, 0, 7); x.fill();
  x.beginPath(); x.arc(cx, cy, 46, 0, 7); x.arc(cx + 22, cy - 12, 40, 0, 7, true); x.fillStyle = '#fff3c4'; x.fill('evenodd');
  x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, 46, .2, 4.9); x.stroke();
  // sleepy face on the crescent
  x.strokeStyle = INK; x.lineWidth = 2.2; x.lineCap = 'round'; x.beginPath(); x.arc(cx - 24, cy - 2, 4, .2, Math.PI - .2); x.stroke();
  x.beginPath(); x.arc(cx - 20, cy + 16, 5, .3, Math.PI - .6); x.stroke();
  x.fillStyle = 'rgba(255,130,150,.4)'; x.beginPath(); x.arc(cx - 32, cy + 8, 3.5, 0, 7); x.fill();
  x.restore();
}
function shootingStar(k) {
  if (k <= 0 || k >= 1) return;
  const px = lerp(180, 760, ease(k)), py = lerp(110, 210, ease(k)) - Math.sin(k * Math.PI) * 30, a = Math.sin(k * Math.PI);
  x.save(); x.globalAlpha = a; x.lineCap = 'round';
  const tg = x.createLinearGradient(px - 150, py - 30, px, py); tg.addColorStop(0, 'rgba(255,240,190,0)'); tg.addColorStop(1, 'rgba(255,240,190,.9)');
  x.strokeStyle = tg; x.lineWidth = 6; x.beginPath(); x.moveTo(px - 150, py - 30); x.lineTo(px, py); x.stroke(); x.restore();
  star(px, py, .55, '#fff6c8', { face: false, a, rot: k * 6 });
}
function tray(n, glow = 0) {
  const w = 640, x0 = W / 2 - w / 2;
  x.save(); x.fillStyle = 'rgba(255,255,255,.9)'; x.strokeStyle = INK; x.lineWidth = 4; rr(x0, 22, w, 64, 30); x.fill(); x.stroke();
  for (let i = 0; i < 10; i++) { const cx = x0 + 44 + i * 61, cy = 54;
    if (i < n) { if (i === n - 1 && glow > 0) circ(cx, cy, 27, `rgba(255,210,63,${.55 * glow})`); star(cx, cy, .95, SCOL[i], { face: false, glow: 0 }); }
    else { x.setLineDash([5, 5]); circ(cx, cy, 20, null, 'rgba(29,42,74,.35)', 3); x.setLineDash([]); } }
  x.restore();
}

// ---------- counting timeline ----------
const COUNT_D = 10 * SEG + 1;
const darkAtCount = u => .5 + .45 * clamp(u / (COUNT_D - 2));
const countSfx = [], countSays = [];
for (let i = 0; i < 10; i++) {
  const s = i * SEG, who = SAY[i][0];
  countSfx.push([s + GLOW0, `twinkle:${['A6', 'C7', 'F6'][i % 3]}`, .22], [s + LAND, `chime:${NOTES[i]}`, .55]);
  countSays.push([who, SAY[i][1], s + LAND + .3, s + LAND + 3.1, BUBX[who], BUBY, 26]);
}
countSfx.push([1 * SEG + LAND + .35, 'trumpet', .14], [3 * SEG + LAND + .4, 'bellow', .14], [8 * SEG + .4, 'yawn', .35], [7 * SEG + 5.2, 'yawn', .3]);

function countState(u) {
  const cur = Math.floor(u / SEG), w = u - cur * SEG, i = Math.min(cur, 9);
  const lit = cur > 9 ? 10 : i + (w >= LAND ? 1 : 0);
  const st = { lift: {}, act: {} };
  if (cur <= 9) {
    const who = SAY[i][0];
    if (w > GLOW0 + .3 && w < LAND) st.act[who] = who === 'elephant' ? .5 : .3;                  // "ooh, look!"
    if (w >= LAND && w < LAND + .5) st.lift[who] = Math.sin((w - LAND) / .5 * Math.PI) * 9;       // little happy hop
    if (cur === 7 && w > 5.2 && w < 6.4) st.act.buffalo = .9 * Math.sin((w - 5.2) / 1.2 * Math.PI);   // Boris yawns
    if (cur === 8 && w > .4 && w < 1.6) st.act.lion = .9 * Math.sin((w - .4) / 1.2 * Math.PI);        // Leo yawns
  }
  return { cur, w, i, lit, st };
}

St.episode({
  title: ['10 Twinkling Stars', 64], sub: 'Count to 10 at bedtime', accent: '#5b5fc7', cardBg: '#eef0ff',
  end: ['Good night!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'stars', shift: 0 },
  shots: [
    // 1 – the sun has gone down; The Big Four walk out onto the savanna and look up
    { d: 13, draw: (u, c) => {
        const dk = lerp(.12, .5, ease(u / 13));
        night(c.t, dk);
        const X = { elephant: walk(u, 1.5, 5.5, -160, POS.elephant[0]), lion: walk(u, 1.8, 5.6, -120, POS.lion[0]),
                    rhino: walk(u, 1.6, 5.5, W + 140, POS.rhino[0]), buffalo: walk(u, 1.9, 5.8, W + 160, POS.buffalo[0]) };
        const M = { elephant: u > 1.5 && u < 5.5, lion: u > 1.8 && u < 5.6, rhino: u > 1.6 && u < 5.5, buffalo: u > 1.9 && u < 5.8 };
        friends(c, { x: X, mv: M });
        nightTint(dk); front(c.t, dk);
        if (u > 10.2) tray(0);
      },
      says: [['lion', 'The sun went to sleep!', 6.6, 9.6, 360, BUBY, 28], ['elephant', "Let's count the stars!", 10.2, 13, 230, BUBY, 28]],
      sfx: [[6.6, 'roar', .12], [10.2, 'trumpet', .14]] },

    // 2 – counting: ten little stars light up in the sky, one by one
    { d: COUNT_D, draw: (u, c) => {
        const { cur, w, i, lit, st } = countState(u), dk = darkAtCount(u);
        night(c.t, dk);
        friends(c, st); nightTint(dk); front(c.t, dk);
        for (let j = 0; j < lit; j++) skyStar(j, c.t, j === i && cur <= 9 ? ease(clamp((w - LAND) / .35)) + Math.sin(clamp((w - LAND) / .5) * Math.PI) * .25 : 1);
        if (cur <= 9 && w >= GLOW0 && w < LAND) {             // shimmer where the next star will appear
          const k = (w - GLOW0) / (LAND - GLOW0), [sx, sy] = SPOT[i];
          const gr = x.createRadialGradient(sx, sy, 2, sx, sy, 40 * k + 6); gr.addColorStop(0, `rgba(255,248,210,${.85 * k})`); gr.addColorStop(1, 'rgba(255,248,210,0)');
          x.fillStyle = gr; x.beginPath(); x.arc(sx, sy, 40 * k + 6, 0, 7); x.fill();
          C.sparkles(sx, sy, c.t, 6, 18 + 14 * k, '#fff6c8');
        }
        if (cur <= 9 && w >= LAND && w < LAND + .8) { const [sx, sy] = SPOT[i]; C.sparkles(sx, sy, c.t, 8, 36, '#fff6c8'); }
        tray(lit, cur <= 9 && w >= LAND ? clamp(1 - (w - LAND) / 4) : 0);
        if (cur <= 9) { const kk = win(w, LAND, SEG - .5, .3);
          C.bigText(String(i + 1), W / 2, 152, kk, 110, SCOL[i]); C.bigText(NUM[i], W / 2, 224, kk, 44, '#ffffff'); }
      },
      says: countSays, sfx: countSfx },

    // 3 – TEN twinkling stars! and a gentle shooting star
    { d: 9, draw: (u, c) => {
        night(c.t, .95);
        const happy = u > .4 && u < 3.2, L = {};
        ORDER.forEach((k, j) => { L[k] = happy ? hop(c.t + j * .7, 4, 7) : 0; });
        friends(c, { lift: L }); nightTint(.95); front(c.t, .95);
        for (let j = 0; j < 10; j++) skyStar(j, c.t, 1, { winkAt: 5.6 + j * .12 + (c.t - u) });
        shootingStar((u - 5.4) / 2.2);
        tray(10, clamp(1 - u / 3)); C.sparkles(W / 2, 54, c.t, 12, 300, '#fff6c8');
        C.bigText('10', W / 2, 160, win(u, .3, 8.4, .3), 110, SCOL[9]);
      },
      says: [['lion', 'Ten twinkling stars!', 3.2, 6.6, 360, BUBY, 28], ['buffalo', 'Ooh, a shooting star!', 6.4, 8.8, 790, BUBY, 28]],
      sfx: [[.4, 'tada', .4], [.7, 'cheer', .25], [5.4, 'whoosh', .25], [6.0, 'twinkle:C7', .25]] },

    // 4 – recap: count 1..10 again, each star lights up with its numeral
    { d: 17, draw: (u, c) => {
        night(c.t, .95); friends(c); nightTint(.95); front(c.t, .95);
        x.fillStyle = 'rgba(16,24,58,.86)'; x.fillRect(0, 0, W, H);
        C.bigText("Let's count again!", W / 2, 84, win(u, .4, 16.6, .4), 54, '#ffd23f');
        for (let i = 0; i < 10; i++) { const t0 = 2 + i * 1.25, k = clamp((u - t0) / .35), on = u >= t0 && u < t0 + 1.25;
          const cx = 120 + (i % 5) * 180, cy = 216 + Math.floor(i / 5) * 160;
          if (on) circ(cx, cy - 18, 50 * (.5 + .5 * k), `rgba(255,230,140,${(.25 * k).toFixed(3)})`);
          star(cx, cy - 18, 1.6 * (.4 + .6 * ease(k)) * (on ? 1.12 : 1), SCOL[i], { a: k, rot: on ? Math.sin(c.t * 3) * .12 : 0 });
          C.bigText(String(i + 1), cx, cy + 50, k, 50, SCOL[i]); }
        C.bigText('Well done!', W / 2, 500, win(u, 14.6, 16.8, .3), 44, '#ffd23f');
      },
      sfx: Array.from({ length: 10 }, (_, i) => [2 + i * 1.25, `chime:${NOTES[i]}`, .5]).concat([[14.6, 'cheer', .3]]) },

    // 5 – the moon rises, "Good night, stars!" – the friends fall asleep and the stars close their eyes too
    { d: 17, draw: (u, c) => {
        night(c.t, 1);
        moon(lerp(820, 800, ease(u / 6)), lerp(250, 140, ease(u / 6)), clamp(u / 2.5));
        const asleep = u > 7.4;
        friends(c, { sleep: asleep }); nightTint(1); front(c.t, 1);
        for (let j = 0; j < 10; j++) skyStar(j, c.t, 1, { sleep: u > 9 + j * .25 });
        if (asleep) ORDER.forEach((k, j) => zzz(c.t, k, clamp((u - 8 - j * .4) / 1)));
      },
      says: [['lion', 'Time for bed!', .9, 3.4, 360, BUBY, 28], ['elephant', 'Good night, stars!', 3.8, 6.8, 230, BUBY, 28]],
      sfx: [[.9, 'yawn', .3], [3.8, 'twinkle:A6', .2], [7.6, 'twinkle:F6', .15], [9.2, 'twinkle:C7', .12]] },
  ],
});
