// Learning series – Counting #2: 10 Little Snowflakes with The Big Four (winter savanna).
// It snows on the savanna! Ten big friendly snowflakes drift down one by one and land on Leo's nose, Ella's trunk, Nico's horn,
// Boris's tongue, Leo's tail, Ella's head, Nico's nose (achoo!), Boris's horn, Leo's mane and Ella's ear. A tray of 10 at the top fills up,
// each new snowflake gets a big numeral + number word and a rising chime. Then: TEN!, recap 1–10, the friends build a little snowman.
// New music: snow_long (celesta lead, harp waltz chords, soft string pad, sleigh-bell shaker; E-flat major 3/4).
const C = require('../lib/common'), S = require('../lib/safari');
const St = require('../lib/story');
const { x, W, H, clamp, ease, lerp, win, rr, circ, hash } = C;
const G = S.GROUND, ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
const INK = '#2a3a5c';

const NUM = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];
const FCOL = ['#5ec8ff', '#b28dff', '#4fd1a5', '#ff8fc7', '#ffc53d', '#6aa8ff', '#ff9f68', '#8be04e', '#e57bff', '#3fd0e0'];
const NOTES = ['D#5', 'F5', 'G5', 'G#5', 'A#5', 'C6', 'D6', 'D#6', 'F6', 'G6'];
// where everybody stands: [x, scale, flip (true = facing right)]
const POS = { elephant: [140, .68, true], lion: [345, .72, true], rhino: [628, .66, false], buffalo: [832, .66, false] };
// where snowflake i lands: [animal, anchor x, anchor y (animal units, unflipped), eaten?]
const SPOT = [['lion', -58, -86], ['elephant', 'trunk'], ['rhino', -76, -108], ['buffalo', -74, -46, true], ['lion', 100, -110],
              ['elephant', -82, -182], ['rhino', -78, -48], ['buffalo', -140, -98], ['lion', -58, -148], ['elephant', -140, -128]];
const SAY = [['lion', 'A snowflake on my nose!'], ['elephant', 'I caught one!'], ['rhino', 'One on my horn!'], ['buffalo', 'Yum! So cold!'],
             ['lion', 'One on my tail!'], ['elephant', 'One on my head!'], ['rhino', 'Achoo!'], ['buffalo', 'One on my horn!'],
             ['lion', 'One for my mane!'], ['elephant', 'One on my ear!']];
const BUBX = { elephant: 200, lion: 360, rhino: 650, buffalo: 790 }, BUBY = 300;
const SEG = 7.5, FALL0 = .7, LAND = 3.2;             // per flake: appear 0–0.7, drift 0.7–3.2, number 3.2–7.0

const say = (c, who, k = .45) => { const v = c.talk(who); return v > 0 ? (who === 'elephant' ? .12 + v * .04 : v * k) : 0; };
const walk = (u, a, b, x0, x1) => u < a ? x0 : u > b ? x1 : lerp(x0, x1, ease((u - a) / (b - a)));
const hop = (t, sp = 6, h = 8) => Math.abs(Math.sin(t * sp)) * h;

// ---------- winter savanna ----------
function cloud(cx, cy, s, a) {
  x.fillStyle = `rgba(255,255,255,${a})`; x.beginPath();
  [[0, 0, 26], [30, -14, 32], [64, -2, 26], [34, 8, 24]].forEach(([p, q, r]) => { x.moveTo(cx + p * s + r * s, cy + q * s); x.arc(cx + p * s, cy + q * s, r * s, 0, 7); }); x.fill();
}
function snowAcacia(px, py, s) {
  S.acacia(px, py, s);
  x.save(); x.translate(px, py); x.scale(s, s); x.fillStyle = '#ffffff';
  x.beginPath(); x.ellipse(-6, -104, 60, 8, 0, 0, 7); x.ellipse(26, -100, 34, 6, 0, 0, 7); x.ellipse(-40, -98, 30, 6, 0, 0, 7); x.fill();
  x.restore();
}
function winter(t) {
  S.setT(t);
  const g = x.createLinearGradient(0, 0, 0, 340); g.addColorStop(0, '#8fa9cc'); g.addColorStop(1, '#e4ecf6');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  circ(770, 120, 52, 'rgba(255,250,235,.35)'); circ(770, 120, 34, 'rgba(255,248,225,.85)');
  for (let i = 0; i < 4; i++) cloud(((hash(i + 3) * 1200 - t * (4 + i * 1.5)) % 1200 + 1200) % 1200 - 140, 110 + hash(i + 7) * 90, .8 + hash(i) * .4, .55);
  // distant snowy mountain
  x.fillStyle = '#a9b8d0'; x.beginPath(); x.moveTo(40, 335); x.lineTo(220, 215); x.quadraticCurveTo(255, 196, 292, 214); x.lineTo(500, 335); x.closePath(); x.fill();
  x.fillStyle = '#f6f9ff'; x.beginPath(); x.moveTo(170, 248); x.lineTo(220, 215); x.quadraticCurveTo(255, 196, 292, 214); x.lineTo(344, 250);
  x.lineTo(322, 258); x.lineTo(300, 246); x.lineTo(276, 260); x.lineTo(252, 246); x.lineTo(228, 260); x.lineTo(204, 248); x.lineTo(188, 256); x.closePath(); x.fill();
  // far snow hill
  x.fillStyle = '#e9f0f9'; x.beginPath(); x.moveTo(0, 340);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 330 + Math.sin(i * .01) * 6); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  snowAcacia(110, 352, .6); snowAcacia(870, 348, .5); snowAcacia(680, 354, .4);
  // near snow field
  x.fillStyle = '#f7faff'; x.beginPath(); x.moveTo(0, 380);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 374 + Math.sin(i * .007 + 2) * 8); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  x.strokeStyle = 'rgba(150,175,210,.45)'; x.lineWidth = 3; x.beginPath();
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 374 + Math.sin(i * .007 + 2) * 8); x.stroke();
  snowAcacia(470, 398, .95);
  // trodden path with soft blue shadow
  x.fillStyle = '#e3ebf6'; x.beginPath(); x.ellipse(W / 2, G + 10, 620, 38, 0, 0, 7); x.fill();
  S.grass(372, 10, 0, 'rgba(150,130,95,.55)');
}
function snowFront(t) {
  x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(0, 506);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 504 + Math.sin(i * .02 + 1) * 5 + Math.sin(i * .05) * 2); x.lineTo(W, H); x.lineTo(0, H); x.closePath(); x.fill();
  x.strokeStyle = 'rgba(140,170,210,.55)'; x.lineWidth = 3; x.beginPath();
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 504 + Math.sin(i * .02 + 1) * 5 + Math.sin(i * .05) * 2); x.stroke();
}
// gentle background snowfall (tiny dots, never mistaken for the big counting flakes)
function snowfall(t, n = 55, a = .8) {
  x.fillStyle = `rgba(255,255,255,${a})`;
  for (let i = 0; i < n; i++) {
    const sp = 18 + hash(i + 40) * 22, py = ((hash(i + 50) * 600 + t * sp) % 600) - 30, px = hash(i) * W + Math.sin(t * .8 + i) * 14;
    x.beginPath(); x.arc(px, py, 1.6 + hash(i + 70) * 1.8, 0, 7); x.fill();
  }
}

// ---------- the big friendly snowflake ----------
function flake(cx, cy, s, rot, col = '#5ec8ff', face = true, a = 1) {
  if (a <= 0) return;
  x.save(); x.globalAlpha *= a; x.translate(cx, cy); x.rotate(rot); x.scale(s, s); x.lineCap = 'round';
  const arms = (w, c) => {
    x.strokeStyle = c; x.lineWidth = w; x.beginPath();
    for (let k = 0; k < 6; k++) { const an = k * Math.PI / 3, ca = Math.cos(an), sa = Math.sin(an);
      x.moveTo(0, 0); x.lineTo(ca * 20, sa * 20);
      [9, 14].forEach((d, j) => { const b = j ? 5 : 6.5; const px = ca * d, py = sa * d;
        x.moveTo(px, py); x.lineTo(px + Math.cos(an + .8) * b, py + Math.sin(an + .8) * b);
        x.moveTo(px, py); x.lineTo(px + Math.cos(an - .8) * b, py + Math.sin(an - .8) * b); }); }
    x.stroke();
  };
  arms(6.5, INK); arms(3.6, '#ffffff');
  for (let k = 0; k < 6; k++) { const an = k * Math.PI / 3; circ(Math.cos(an) * 20, Math.sin(an) * 20, 2.6, col, INK, 1.2); }
  circ(0, 0, 8.5, '#ffffff', INK, 1.8); circ(0, 0, 6, col);
  if (face) {
    x.rotate(-rot);
    circ(-2.4, -1.2, 1.1, INK); circ(2.4, -1.2, 1.1, INK);
    x.strokeStyle = INK; x.lineWidth = .9; x.beginPath(); x.arc(0, .6, 2.4, .35, Math.PI - .35); x.stroke();
  }
  x.restore();
}

// ---------- the friends ----------
const ORDER = ['elephant', 'lion', 'rhino', 'buffalo'];
// screen position of an anchor point on an animal (o.lift, o.x override)
function anchor(k, ax, ay, o = {}) {
  const [px0, sc, fl] = POS[k], px = o.x ?? px0, lift = o.lift || 0;
  if (ax === 'trunk') { const up = ease(clamp((o.act || 0) * 1.4)); ax = -82 + lerp(-12, -58, up); ay = -135 + lerp(78, -70, up); }
  return [px + (fl ? -ax : ax) * sc, G - lift + ay * sc];
}
// draws all four; st = {lift:{}, act:{}, x:{}, mv:{}}
function friends(c, st = {}) {
  ORDER.forEach((k, i) => {
    const [px, sc, fl] = POS[k], L = st.lift || {}, A = st.act || {}, X = st.x || {}, M = st.mv || {};
    S.actor(ANI[k], X[k] ?? px, !!M[k], A[k] !== undefined ? Math.max(A[k], say(c, k)) : say(c, k), sc, { flip: fl, blinkOff: i * .8, phase: i, lift: L[k] || 0 });
  });
}
// flakes that already landed and stay on the animals (eaten ones are gone)
function stuck(n, st = {}, skip = -1) {
  for (let i = 0; i < n; i++) { if (i === skip) continue; const [k, ax, ay, eaten] = SPOT[i]; if (eaten) continue;
    const L = st.lift || {}, A = st.act || {}, X = st.x || {};
    const [px, py] = anchor(k, ax, ay, { lift: L[k], act: A[k], x: X[k] });
    flake(px, py, .44, hash(i) * 2, FCOL[i], false); }
}
function tray(n, glow = 0) {
  const w = 640, x0 = W / 2 - w / 2;
  x.save(); x.fillStyle = 'rgba(255,255,255,.9)'; x.strokeStyle = INK; x.lineWidth = 4; rr(x0, 22, w, 64, 30); x.fill(); x.stroke();
  for (let i = 0; i < 10; i++) { const cx = x0 + 44 + i * 61, cy = 54;
    if (i < n) { if (i === n - 1 && glow > 0) circ(cx, cy, 27, `rgba(120,200,255,${.6 * glow})`); flake(cx, cy, .95, i * .3, FCOL[i], false); }
    else { x.setLineDash([5, 5]); circ(cx, cy, 20, null, 'rgba(42,58,92,.35)', 3); x.setLineDash([]); } }
  x.restore();
}
function snowman(cx, k) {   // k: build stage 0..6 (fractional = pop-in)
  const p = s => clamp(k - s), pop = s => { const v = p(s); return v <= 0 ? 0 : ease(clamp(v / .6)) + Math.sin(clamp(v / .6) * Math.PI) * .15; };
  x.save();
  const b = pop(0), m = pop(1), h = pop(2);
  if (b > 0) { x.fillStyle = 'rgba(80,110,160,.18)'; x.beginPath(); x.ellipse(cx, G + 4, 62 * b, 9, 0, 0, 7); x.fill(); circ(cx, G - 46, 50 * b, '#ffffff', INK, 3.5); }
  if (m > 0) circ(cx, G - 120, 37 * m, '#ffffff', INK, 3.5);
  if (h > 0) circ(cx, G - 178, 28 * h, '#ffffff', INK, 3.5);
  const f = pop(3);
  if (f > 0) { x.save(); x.globalAlpha = clamp(f);
    circ(cx - 10, G - 184, 3.8, INK); circ(cx + 10, G - 184, 3.8, INK); circ(cx - 11, G - 185, 1.2, '#fff'); circ(cx + 9, G - 185, 1.2, '#fff');
    x.fillStyle = '#ff8a2b'; x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.moveTo(cx, G - 178); x.lineTo(cx + 26 * f, G - 173); x.lineTo(cx, G - 170); x.closePath(); x.fill(); x.stroke();
    x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.arc(cx, G - 172, 11, .5, Math.PI - .5); x.stroke();
    [-128, -112, -60, -36].forEach(dy => circ(cx, G + dy, 4, '#2f3b52'));
    x.fillStyle = 'rgba(255,110,120,.35)'; [-17, 17].forEach(o => { x.beginPath(); x.arc(cx + o, G - 174, 5, 0, 7); x.fill(); });
    x.restore(); }
  const sc = pop(4);
  if (sc > 0) { x.save(); x.globalAlpha = clamp(sc); x.fillStyle = '#e63946'; x.strokeStyle = INK; x.lineWidth = 2.5;
    rr(cx - 32, G - 158, 64, 14, 7); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(cx + 14, G - 150); x.lineTo(cx + 26, G - 112); x.lineTo(cx + 12, G - 110); x.lineTo(cx + 4, G - 148); x.closePath(); x.fill(); x.stroke(); x.restore(); }
  const hat = pop(5);
  if (hat > 0) { x.save(); x.translate(cx, G - 200 - (1 - clamp(hat)) * 40); x.globalAlpha = clamp(hat);
    x.fillStyle = '#3d5a99'; x.strokeStyle = INK; x.lineWidth = 2.5;
    x.beginPath(); x.moveTo(-22, 2); x.quadraticCurveTo(-20, -26, 0, -30); x.quadraticCurveTo(20, -26, 22, 2); x.closePath(); x.fill(); x.stroke();
    rr(-25, -2, 50, 9, 4); x.fillStyle = '#ffffff'; x.fill(); x.stroke(); circ(0, -32, 7, '#ffffff', INK, 2); x.restore(); }
  x.restore();
}
// branch arms for the snowman (drawn with the middle ball)
function snowArms(cx, k) {
  const v = clamp(k - 1.4); if (v <= 0) return;
  x.save(); x.globalAlpha = clamp(v * 2); x.strokeStyle = '#7a4a24'; x.lineWidth = 4; x.lineCap = 'round';
  x.beginPath(); x.moveTo(cx - 34, G - 124); x.lineTo(cx - 70, G - 150); x.moveTo(cx - 58, G - 141); x.lineTo(cx - 66, G - 158);
  x.moveTo(cx + 34, G - 124); x.lineTo(cx + 70, G - 146); x.moveTo(cx + 58, G - 139); x.lineTo(cx + 70, G - 132); x.stroke(); x.restore();
}

// ---------- counting timeline ----------
function fallPos(i, k) {
  const [an, ax, ay] = SPOT[i], [tx, ty] = anchor(an, ax, ay, { act: an === 'elephant' && i === 1 ? .8 : 0 });
  const sx = clamp(tx + (hash(i + 11) - .5) * 220, 120, W - 120), sy = 128;
  const px = lerp(sx, tx, ease(k)) + Math.sin(k * Math.PI * 2.5) * 46 * (1 - k), py = lerp(sy, ty, k);
  return [px, py, Math.sin(k * Math.PI * 2) * .6];
}
const COUNT_D = 10 * SEG + 1;
const countSfx = [], countSays = [];
for (let i = 0; i < 10; i++) {
  const s = i * SEG, who = SAY[i][0];
  countSfx.push([s + .15, `twinkle:${['A#6', 'C7', 'D7'][i % 3]}`, .3], [s + LAND, `chime:${NOTES[i]}`, .6]);
  countSays.push([who, SAY[i][1], s + LAND + .3, s + LAND + 3.1, BUBX[who], BUBY, 26]);
}
countSfx.push([1 * SEG + LAND + .3, 'trumpet', .22], [3 * SEG + LAND - .1, 'munch', .4], [6 * SEG + LAND + .3, 'snort', .35], [3 * SEG + LAND + .4, 'bellow', .2]);

function countState(u, c) {
  const cur = Math.floor(u / SEG), v = u - cur * SEG, i = Math.min(cur, 9), w = cur > 9 ? SEG : v;
  const landed = cur > 9 ? 10 : i + (w >= LAND ? 1 : 0);
  const st = { lift: {}, act: {} };
  if (cur <= 9) {
    const who = SPOT[i][0];
    if (w > LAND - 1.2 && w < LAND) st.act[who] = who === 'elephant' ? .55 : .35;            // look, it's coming! (mouth open)
    if (w >= LAND && w < LAND + .5) st.lift[who] = Math.sin((w - LAND) / .5 * Math.PI) * 10;   // happy hop on landing
    if (i === 3 && w > LAND - .7 && w < LAND + .3) st.lift.buffalo = Math.sin(clamp((w - LAND + .7) / 1) * Math.PI) * 18;   // Boris jumps to catch it
  }
  if (i === 1 && cur === 1 && w > 1.6) st.act.elephant = .8 * clamp(1 - (w - LAND - .4) / .7);   // Ella lifts her trunk to catch it, then lowers it
  return { cur, w, i, landed, st };
}

St.episode({
  title: ['10 Little Snowflakes', 64], sub: 'Count with The Big Four', accent: '#3d7fd9', cardBg: '#eef6ff',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'snow', shift: 0 },
  shots: [
    // 1 – it snows on the savanna! The Big Four walk in and look up
    { d: 13, draw: (u, c) => {
        winter(c.t); snowfall(c.t);
        const X = { elephant: walk(u, 1.5, 5.5, -160, POS.elephant[0]), lion: walk(u, 1.8, 5.6, -120, POS.lion[0]),
                    rhino: walk(u, 1.6, 5.5, W + 140, POS.rhino[0]), buffalo: walk(u, 1.9, 5.8, W + 160, POS.buffalo[0]) };
        const M = { elephant: u > 1.5 && u < 5.5, lion: u > 1.8 && u < 5.6, rhino: u > 1.6 && u < 5.5, buffalo: u > 1.9 && u < 5.8 };
        const L = u > 6 && u < 7 ? { lion: hop(c.t, 5, 6), rhino: hop(c.t + 1, 5, 5) } : {};
        friends(c, { x: X, mv: M, lift: L });
        // three decorative big flakes drift past (they melt away before the counting starts)
        [[300, 0, '#5ec8ff'], [500, 1.3, '#ff8fc7'], [690, 2.4, '#ffc53d']].forEach(([fx, o, col], j) => {
          const k = (u - 2 - o) / 6; if (k <= 0 || k >= 1) return;
          flake(fx + Math.sin(k * 7 + j) * 30, lerp(110, 240, k), 1.15, Math.sin(k * 5) * .6, col, true, clamp(Math.min(k * 6, (1 - k) * 5))); });
        snowFront(c.t); snowfall(c.t + 37, 14, .9);
        if (u > 10.2) tray(0);
      },
      says: [['lion', "Look! It's snowing!", 7.2, 10, 360, BUBY, 28], ['elephant', "Let's count the snowflakes!", 10.4, 13, 230, BUBY, 28]],
      sfx: [[5.8, 'laugh', .3], [7.2, 'roar', .2], [10.4, 'trumpet', .22]] },

    // 2 – counting: ten big snowflakes drift down one by one and land on the friends
    { d: COUNT_D, draw: (u, c) => {
        const { cur, w, i, landed, st } = countState(u, c);
        winter(c.t); snowfall(c.t, 40, .7);
        friends(c, st);
        stuck(landed, st);
        if (cur <= 9 && w < LAND) {
          if (w < FALL0) { const k = w / FALL0, [px, py] = fallPos(i, 0); flake(px, py, 1.4 * ease(k) + Math.sin(k * Math.PI) * .2, 0, FCOL[i], true, clamp(k * 3)); C.sparkles(px, py, c.t, 6, 40 * k, '#ffffff'); }
          else { const k = (w - FALL0) / (LAND - FALL0), [px, py, r] = fallPos(i, k); flake(px, py, lerp(1.4, .7, ease(clamp((k - .6) / .4))), r, FCOL[i], true); }
        }
        if (cur <= 9 && w >= LAND && w < LAND + .8) { const [an, ax, ay] = SPOT[i], [px, py] = anchor(an, ax, ay, { lift: st.lift[an], act: st.act[an] }); C.sparkles(px, py, c.t, 8, 34, '#ffffff'); }
        snowFront(c.t); snowfall(c.t + 37, 10, .9);
        tray(landed, cur <= 9 && w >= LAND ? clamp(1 - (w - LAND) / 4) : 0);
        if (cur <= 9) { const kk = win(w, LAND, SEG - .5, .3);
          C.bigText(String(i + 1), W / 2, 152, kk, 110, FCOL[i]); C.bigText(NUM[i], W / 2, 224, kk, 44, '#ffffff'); }
      },
      says: countSays, sfx: countSfx },

    // 3 – TEN little snowflakes!
    { d: 8, draw: (u, c) => {
        winter(c.t); snowfall(c.t, 40, .7);
        const happy = u > .4 && u < 3.4, L = {};
        ORDER.forEach((k, j) => { L[k] = happy ? hop(c.t + j * .7, 4.5, 9) : 0; });
        friends(c, { lift: L }); stuck(10, { lift: L });
        snowFront(c.t); snowfall(c.t + 37, 10, .9);
        tray(10, clamp(1 - u / 3)); C.sparkles(W / 2, 54, c.t, 12, 300, '#ffffff');
        C.bigText('10', W / 2, 160, win(u, .3, 7.4, .3), 110, FCOL[9]);
      },
      says: [['lion', 'Ten little snowflakes!', 3.6, 7.4, 360, BUBY, 28]],
      sfx: [[.4, 'tada', .5], [.7, 'cheer', .35]] },

    // 4 – recap: count 1..10 again, each snowflake lights up with its numeral
    { d: 17, draw: (u, c) => {
        winter(c.t); friends(c); stuck(10); snowFront(c.t);
        x.fillStyle = 'rgba(238,246,255,.88)'; x.fillRect(0, 0, W, H);
        snowfall(c.t, 40, .9);
        C.bigText("Let's count again!", W / 2, 84, win(u, .4, 16.6, .4), 54, '#3d7fd9');
        for (let i = 0; i < 10; i++) { const t0 = 2 + i * 1.25, k = clamp((u - t0) / .35), on = u >= t0 && u < t0 + 1.25;
          const cx = 120 + (i % 5) * 180, cy = 216 + Math.floor(i / 5) * 160;
          if (on) circ(cx, cy - 18, 48, 'rgba(120,200,255,.35)');
          flake(cx, cy - 18, 1.75 * (.4 + .6 * ease(k)) * (on ? 1.12 : 1), on ? Math.sin(c.t * 3) * .15 : 0, FCOL[i], true, k);
          C.bigText(String(i + 1), cx, cy + 50, k, 50, FCOL[i]); }
        C.bigText('Well done!', W / 2, 500, win(u, 14.6, 16.8, .3), 44, '#3d7fd9');
      },
      sfx: Array.from({ length: 10 }, (_, i) => [2 + i * 1.25, `chime:${NOTES[i]}`, .55]).concat([[14.6, 'cheer', .4]]) },

    // 5 – the friends build a little snowman together, then wave goodbye
    { d: 15, draw: (u, c) => {
        winter(c.t); snowfall(c.t, 45, .75);
        const k = u < 3.2 ? 0 : (u - 3.2) / .6, SX = 487;
        const happy = u > 6.6 && u < 9.4, wave = u > 9.6, L = {};
        ORDER.forEach((kk, j) => { L[kk] = happy ? hop(c.t + j * .7, 4, 7) : wave ? hop(c.t + j * .5, 2.5, 4) : 0; });
        friends(c, { lift: L }); stuck(10, { lift: L });
        snowArms(SX, k); snowman(SX, k);
        if (u > 6.2 && u < 7.4) C.sparkles(SX, G - 120, c.t, 10, 90, '#ffffff');
        snowFront(c.t); snowfall(c.t + 37, 12, .9);
      },
      says: [['elephant', "Let's build a snowman!", .8, 3.2, 230, BUBY, 28], ['buffalo', 'Hello, Mr. Snowman!', 6.9, 9.5, 790, BUBY, 28]],
      sfx: [[.8, 'trumpet', .22], ...[0, 1, 2, 3, 4, 5].map(j => [3.2 + j * .6, 'pop', .5, (j - 2.5) * .1]), [6.6, 'tada', .45], [6.9, 'bellow', .25], [7.3, 'laugh', .3]] },
  ],
});
