// Learning series – Counting #6: 10 Colorful Kites with The Big Four (windy autumn day on the savanna).
// The wind is blowing: leaves swirl, the grass sways. The Big Four walk out and look up – one by one, ten friendly kites rise from behind
// the far hill into the sky (each with its own colour, a smiling face and a bow tail that flutters in the wind). A tray of 10 at the top
// fills up, each new kite gets a big numeral + number word and a rising chime. Then: TEN!, all kites do a loop in a big gust, recap 1–10,
// the wind calms down, the kites float down behind the hill one by one and the friends wave "Bye-bye, kites!".
// New music: kites_long (breezy soft bossa in D – soft alto-sax lead, airy organ pad, pizzicato bass, rim clicks, wind chimes).
const C = require('../lib/common'), S = require('../lib/safari');
const St = require('../lib/story');
const { x, W, H, clamp, ease, lerp, win, rr, circ, hash, mix } = C;

const G = S.GROUND, ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
const INK = '#2a2440';
const NUM = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];
const KCOL = ['#e63946', '#ff9f1c', '#ffd23f', '#2fb35a', '#2f9bea', '#7b5cd6', '#ff6fae', '#14b8a6', '#a3d939', '#ff7a45'];
const KCOL2 = ['#ffd23f', '#2f9bea', '#e63946', '#ffd23f', '#ffd23f', '#ffd23f', '#ffffff', '#ffd23f', '#7b5cd6', '#2f9bea'];
const NOTES = ['D5', 'E5', 'F#5', 'G5', 'A5', 'B5', 'C#6', 'D6', 'E6', 'F#6'];
const POS = { elephant: [140, .68, true], lion: [345, .72, true], rhino: [628, .66, false], buffalo: [832, .66, false] };
const ORDER = ['elephant', 'lion', 'rhino', 'buffalo'];
// where each kite settles in the sky (away from the tray, the big numeral in the middle and the speech bubbles)
const SPOT = [[96, 128], [866, 136], [256, 176], [716, 140], [150, 184], [812, 184], [322, 140], [650, 180], [56, 180], [910, 184]];
const SAY = [['lion', 'Look! A red kite!'], ['elephant', 'Here comes another one!'], ['rhino', 'A yellow kite!'], ['buffalo', 'Up, up, up!'],
             ['lion', 'It is dancing!'], ['elephant', 'Wheee, the wind!'], ['rhino', 'A pink one!'], ['buffalo', 'So many kites!'],
             ['lion', 'Hold on tight, kite!'], ['elephant', 'The last one!']];
const BUBX = { elephant: 200, lion: 360, rhino: 650, buffalo: 790 }, BUBY = 300;
const SEG = 7, RISE0 = .3, LAND = 1.8;
const TB = !!process.env.THUMBBG;

const walk = (u, a, b, x0, x1) => u < a ? x0 : u > b ? x1 : lerp(x0, x1, ease((u - a) / (b - a)));
const hop = (t, sp = 6, h = 8) => Math.abs(Math.sin(t * sp)) * h;

// ---------- windy autumn savanna ----------
function sky(t) {
  const g = x.createLinearGradient(0, 0, 0, 340); g.addColorStop(0, '#5fb4ea'); g.addColorStop(1, '#d6f0ff');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // small soft sun in the top-right corner
  circ(918, 46, 40, 'rgba(255,236,160,.45)'); circ(918, 46, 26, '#ffd65c');
  // clouds racing in the wind
  for (let i = 0; i < 5; i++) { const span = W + 320, cx = ((hash(i + 3) * span + t * (26 + i * 7)) % span) - 160, cy = 60 + hash(i + 9) * 150, s = .7 + hash(i + 1) * .5;
    x.fillStyle = 'rgba(255,255,255,.82)'; x.beginPath(); [[0, 0, 22], [28, -12, 28], [58, 0, 22], [30, 8, 20]].forEach(([a, b, r]) => { x.moveTo(cx + a * s + r * s, cy + b * s); x.arc(cx + a * s, cy + b * s, r * s, 0, 7); }); x.fill(); }
}
function land(t) {
  S.setT(t);
  // far hill (the kites rise from behind it)
  x.fillStyle = '#e9c27b'; x.beginPath(); x.moveTo(0, 340);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 326 + Math.sin(i * .008 + 1) * 10 + Math.sin(i * .02) * 4); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  S.acacia(120, 350, .6); S.acacia(866, 344, .5);
  x.fillStyle = '#ddb062'; x.beginPath(); x.moveTo(0, 380);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 372 + Math.sin(i * .007 + 2) * 8); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  x.fillStyle = '#d29a4c'; x.beginPath(); x.ellipse(W / 2, G + 10, 620, 38, 0, 0, 7); x.fill();
  S.grass(368, 18, 0, '#b88c3a');
}
function front(t) {
  x.fillStyle = '#c98a3c'; x.fillRect(0, 500, W, 40);
  S.grass(540, 40, 50, '#a8772b'); S.grass(540, 30, 90, '#c6973f');
}
// autumn leaves blowing across the screen (wind strength w 0..1)
function blowing(t, w = 1) {
  if (w <= 0) return;
  for (let i = 0; i < 10; i++) {
    const sp = 120 + hash(i + 7) * 90, span = W + 120, px = ((hash(i) * span + t * sp) % span) - 60, py = 250 + hash(i + 2) * 230 + Math.sin(t * 2 + i) * 22;
    x.save(); x.globalAlpha = w; x.translate(px, py); x.rotate(t * 3 + i);
    x.fillStyle = ['#e8590c', '#f59f00', '#c92a2a', '#a8643a'][i % 4]; x.beginPath(); x.ellipse(0, 0, 9, 5, 0, 0, 7); x.fill();
    x.strokeStyle = 'rgba(60,30,10,.5)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(-8, 0); x.lineTo(8, 0); x.stroke(); x.restore();
  }
}

// ---------- the friendly kite (centre cx, cy; s = scale) ----------
function kite(cx, cy, s, i, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s <= 0) return;
  x.save(); x.globalAlpha *= a; x.translate(cx, cy); x.scale(s, s); x.rotate(o.rot || 0);
  // string: falls away towards the hill (fades out)
  if (o.string !== false) {
    const sg = x.createLinearGradient(0, 30, 0, 200); sg.addColorStop(0, 'rgba(42,36,64,.55)'); sg.addColorStop(1, 'rgba(42,36,64,0)');
    x.strokeStyle = sg; x.lineWidth = 1.6; x.beginPath(); x.moveTo(0, 30); x.quadraticCurveTo(26, 110, 64 + (o.sx || 0), 220); x.stroke();
  }
  // bow tail
  x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.moveTo(0, 30);
  const tail = [];
  for (let j = 1; j <= 4; j++) { const ty = 30 + j * 11, tx = Math.sin(t * 5 + j * 1.1 + i) * (3 + j * 1.6); tail.push([tx, ty]); x.lineTo(tx, ty); }
  x.stroke();
  tail.forEach(([tx, ty], j) => { if (j % 2) return; x.fillStyle = KCOL2[i]; x.save(); x.translate(tx, ty); x.rotate(Math.sin(t * 6 + j) * .3);
    x.beginPath(); x.moveTo(0, 0); x.lineTo(-7, -4); x.lineTo(-7, 4); x.closePath(); x.moveTo(0, 0); x.lineTo(7, -4); x.lineTo(7, 4); x.closePath(); x.fill(); x.lineWidth = 1.2; x.stroke(); x.restore(); });
  // diamond
  x.lineJoin = 'round';
  x.beginPath(); x.moveTo(0, -34); x.lineTo(24, -4); x.lineTo(0, 30); x.lineTo(-24, -4); x.closePath();
  x.fillStyle = KCOL[i]; x.fill();
  x.save(); x.clip(); x.fillStyle = KCOL2[i]; x.globalAlpha *= .8; x.beginPath(); x.moveTo(0, -34); x.lineTo(24, -4); x.lineTo(0, -4); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(0, 30); x.lineTo(-24, -4); x.lineTo(0, -4); x.closePath(); x.fill(); x.restore();
  x.beginPath(); x.moveTo(0, -34); x.lineTo(24, -4); x.lineTo(0, 30); x.lineTo(-24, -4); x.closePath(); x.strokeStyle = INK; x.lineWidth = 3; x.stroke();
  x.lineWidth = 1.6; x.beginPath(); x.moveTo(0, -34); x.lineTo(0, 30); x.moveTo(-24, -4); x.lineTo(24, -4); x.stroke();
  // face
  if (o.face !== false) {
    x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); x.ellipse(0, 2, 12, 10, 0, 0, 7); x.fill();
    const bl = (t + i * .7) % 3.8 > 3.65;
    if (bl) { x.fillStyle = INK; x.fillRect(-7, -1, 5, 1.8); x.fillRect(2, -1, 5, 1.8); }
    else { circ(-4.5, 0, 2, INK); circ(4.5, 0, 2, INK); }
    x.strokeStyle = INK; x.lineWidth = 1.6; x.lineCap = 'round'; x.beginPath(); x.arc(0, 3, 3.6, .3, Math.PI - .3); x.stroke();
    x.fillStyle = 'rgba(255,110,140,.45)'; [-8, 8].forEach(e => { x.beginPath(); x.arc(e, 4, 2, 0, 7); x.fill(); });
  }
  x.restore();
}
// kite i in the sky, swaying in the wind; k = appear scale, lift = how far it is still below its spot (0 = there)
function skyKite(i, t, k = 1, o = {}) {
  const [sx, sy] = SPOT[i], sw = Math.sin(t * (1.1 + hash(i) * .6) + i * 1.7), bob = Math.cos(t * (1.3 + hash(i + 2) * .5) + i) * 5;
  const lift = o.lift || 0, loop = o.loop || 0;
  let px = sx + sw * 8, py = sy + bob + lift + (TB ? 50 : 0);
  let rot = sw * .14;
  if (loop > 0 && loop < 1) { const an = loop * Math.PI * 2; px += Math.sin(an) * 34; py += (1 - Math.cos(an)) * -26; rot += an; }
  kite(px, py, (.98 + hash(i + 3) * .12) * k, i, t, { rot, a: o.a, sx: (480 - sx) * .1 });
}

// ---------- the friends ----------
function sayLevel(c, who) { const v = c.talk(who); return v > 0 ? (who === 'elephant' ? .12 + v * .04 : v * .45) : 0; }
function friends(c, st = {}) {
  ORDER.forEach((k, i) => {
    const [px0, sc, fl] = POS[k], X = st.x || {}, M = st.mv || {}, L = st.lift || {}, A = st.act || {};
    S.actor(ANI[k], X[k] ?? px0, !!M[k], Math.max(A[k] || 0, sayLevel(c, k)), sc, { flip: fl, blinkOff: i * .8, phase: i, lift: L[k] || 0 });
  });
}
function tray(n, glow = 0) {
  const w = 640, x0 = W / 2 - w / 2;
  x.save(); x.fillStyle = 'rgba(255,255,255,.9)'; x.strokeStyle = INK; x.lineWidth = 4; rr(x0, 22, w, 64, 30); x.fill(); x.stroke();
  for (let i = 0; i < 10; i++) { const cx = x0 + 44 + i * 61, cy = 52;
    if (i < n) { if (i === n - 1 && glow > 0) circ(cx, cy + 2, 27, `rgba(255,210,63,${.55 * glow})`); kite(cx, cy, .62, i, 0, { face: false, string: false }); }
    else { x.setLineDash([5, 5]); circ(cx, cy + 2, 20, null, 'rgba(42,36,64,.35)', 3); x.setLineDash([]); } }
  x.restore();
}

// ---------- counting timeline ----------
const COUNT_D = 10 * SEG + 1;
const countSfx = [], countSays = [];
for (let i = 0; i < 10; i++) {
  const s = i * SEG, who = SAY[i][0];
  countSfx.push([s + RISE0, 'whoosh', .14, (SPOT[i][0] - 480) / 600], [s + LAND, `chime:${NOTES[i]}`, .55]);
  countSays.push([who, SAY[i][1], s + LAND + .3, s + LAND + 3.1, BUBX[who], BUBY, 26]);
}
countSfx.push([1 * SEG + LAND + .35, 'trumpet', .14], [3 * SEG + LAND + .4, 'bellow', .14], [4 * SEG + LAND + .4, 'roar', .1], [5 * SEG + 1.0, 'swish', .2]);

function countState(u) {
  const cur = Math.floor(u / SEG), w = u - cur * SEG, i = Math.min(cur, 9);
  const shown = cur > 9 ? 10 : i + (w >= RISE0 ? 1 : 0), landed = cur > 9 ? 10 : i + (w >= LAND ? 1 : 0);
  const st = { lift: {}, act: {} };
  if (cur <= 9) {
    const who = SAY[i][0];
    if (w > RISE0 + .3 && w < LAND) st.act[who] = who === 'elephant' ? .5 : .3;
    if (w >= LAND && w < LAND + .5) st.lift[who] = Math.sin((w - LAND) / .5 * Math.PI) * 9;
  }
  return { cur, w, i, shown, landed, st };
}

St.episode({
  title: ['10 Colorful Kites', 64], sub: 'Count with The Big Four', accent: '#2f9bea', cardBg: '#eef8ff',
  end: ['Well done!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'kites', shift: 0 },
  shots: [
    // 1 – a windy autumn day: The Big Four walk out onto the savanna, leaves blow by
    { d: 13, draw: (u, c) => {
        sky(c.t); land(c.t);
        const X = { elephant: walk(u, 1.5, 5.5, -160, POS.elephant[0]), lion: walk(u, 1.8, 5.6, -120, POS.lion[0]),
                    rhino: walk(u, 1.6, 5.5, W + 140, POS.rhino[0]), buffalo: walk(u, 1.9, 5.8, W + 160, POS.buffalo[0]) };
        const M = { elephant: u > 1.5 && u < 5.5, lion: u > 1.8 && u < 5.6, rhino: u > 1.6 && u < 5.5, buffalo: u > 1.9 && u < 5.8 };
        friends(c, { x: X, mv: M }); front(c.t); blowing(c.t);
        if (u > 10.2) tray(0);
      },
      says: [['lion', 'Whoosh! It is so windy!', 6.6, 9.6, 360, BUBY, 28], ['elephant', "Let's count the kites!", 10.2, 13, 230, BUBY, 28]],
      sfx: [[1.0, 'swish', .25], [6.6, 'roar', .12], [10.2, 'trumpet', .14]] },

    // 2 – counting: ten kites rise from behind the hill, one by one
    { d: COUNT_D, draw: (u, c) => {
        const { cur, w, i, shown, landed, st } = countState(u);
        sky(c.t);
        // the rising kite comes up from behind the far hill
        for (let j = 0; j < shown; j++) {
          const rising = j === i && cur <= 9 && w < LAND + .4;
          if (rising) { const k = clamp((w - RISE0) / (LAND - RISE0)), lift = (1 - ease(k)) * (360 - SPOT[j][1]);
            skyKite(j, c.t, 1 + Math.sin(clamp((w - LAND) / .4) * Math.PI) * .25, { lift }); }
          else skyKite(j, c.t);
        }
        land(c.t); friends(c, st); front(c.t); blowing(c.t, .8);
        if (cur <= 9 && w >= LAND && w < LAND + .8) { const [sx, sy] = SPOT[i]; C.sparkles(sx, sy, c.t, 8, 38, '#fff6c8'); }
        if (!TB) tray(landed, cur <= 9 && w >= LAND ? clamp(1 - (w - LAND) / 4) : 0);
        if (cur <= 9) { const kk = win(w, LAND, SEG - .5, .3), ny = TB ? 250 : 152;
          C.bigText(String(i + 1), W / 2, ny, kk, 110, KCOL[i]); C.bigText(NUM[i], W / 2, ny + 72, kk, 44, '#ffffff'); }
      },
      says: TB ? [] : countSays, sfx: countSfx },

    // 3 – TEN colorful kites! a big gust – every kite does a loop
    { d: 9, draw: (u, c) => {
        sky(c.t);
        for (let j = 0; j < 10; j++) skyKite(j, c.t, 1, { loop: (u - 4.4 - j * .12) / 1.6 });
        land(c.t);
        const happy = u > .4 && u < 3.2, L = {};
        ORDER.forEach((k, j) => { L[k] = happy ? hop(c.t + j * .7, 4, 7) : 0; });
        friends(c, { lift: L }); front(c.t); blowing(c.t, 1);
        tray(10, clamp(1 - u / 3)); C.sparkles(W / 2, 54, c.t, 12, 300, '#fff6c8');
        C.bigText('10', W / 2, 160, win(u, .3, 8.4, .3), 110, KCOL[9]);
      },
      says: [['lion', 'Ten colorful kites!', 1.0, 4.2, 360, BUBY, 28], ['buffalo', 'Loop-de-loop!', 5.0, 8.4, 790, BUBY, 28]],
      sfx: [[.4, 'tada', .4], [.7, 'cheer', .25], [4.4, 'swish', .3], [5.0, 'whoosh', .2], [6.0, 'twinkle:D7', .25]] },

    // 4 – recap: count 1..10 again
    { d: 17, draw: (u, c) => {
        sky(c.t); land(c.t); friends(c); front(c.t);
        x.fillStyle = 'rgba(30,60,100,.88)'; x.fillRect(0, 0, W, H);
        C.bigText("Let's count again!", W / 2, 84, win(u, .4, 16.6, .4), 54, '#ffd23f');
        for (let i = 0; i < 10; i++) { const t0 = 2 + i * 1.25, k = clamp((u - t0) / .35), on = u >= t0 && u < t0 + 1.25;
          const cx = 120 + (i % 5) * 180, cy = 216 + Math.floor(i / 5) * 160;
          if (on) circ(cx, cy - 26, 52 * (.5 + .5 * k), `rgba(255,230,140,${(.25 * k).toFixed(3)})`);
          kite(cx, cy - 30, 1.3 * (.4 + .6 * ease(k)) * (on ? 1.1 : 1), i, c.t, { a: k, rot: on ? Math.sin(c.t * 3) * .12 : 0, string: false });
          C.bigText(String(i + 1), cx + 52, cy + 6, k, 44, KCOL[i]); }
        C.bigText('Well done!', W / 2, 500, win(u, 14.6, 16.8, .3), 44, '#ffd23f');
      },
      sfx: Array.from({ length: 10 }, (_, i) => [2 + i * 1.25, `chime:${NOTES[i]}`, .5]).concat([[14.6, 'cheer', .3]]) },

    // 5 – the wind calms down: the kites float down behind the hill one by one, "Bye-bye, kites!"
    { d: 15, draw: (u, c) => {
        sky(c.t);
        for (let j = 0; j < 10; j++) { const k = clamp((u - 3.4 - j * .55) / 2.4); if (k >= 1) continue;
          skyKite(j, c.t, 1, { lift: ease(k) * (380 - SPOT[j][1]) }); }
        land(c.t);
        const wave = u > 4 && u < 11, A = {};
        if (wave) ORDER.forEach((k, j) => { A[k] = .3 + .3 * Math.sin(c.t * 6 + j); });
        friends(c, { act: A }); front(c.t); blowing(c.t, clamp(1 - u / 4));
      },
      says: [['rhino', 'The wind is going to sleep.', .6, 3.6, 650, BUBY, 28], ['elephant', 'Bye-bye, kites!', 5.4, 8.6, 230, BUBY, 28],
             ['lion', 'See you next windy day!', 9.0, 12.2, 360, BUBY, 26]],
      sfx: [[3.4, 'slide', .12], [6.0, 'slide', .1], [8.6, 'slide', .08]] },
  ],
});
