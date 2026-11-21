// Learning series – Counting #5: 10 Little Ducklings with Little Truck Toet (autumn pond).
// Toet parks next to a pond where Mama Duck is waiting for her babies. One by one a duckling pops out of the reeds and swims to join
// the line behind Mama Duck. A tray of 10 at the top fills up, each new duckling gets a big numeral + number word, a "peep" and a rising
// chime. Then: "Ten little ducklings!", recap 1–10, and Toet says goodbye to the duck family and drives off.
// New music: ducks_long (piccolo lead, plucked bass, marimba, temple blocks like little duck steps; C major 4/4).
const C = require('../lib/common'), T = require('../lib/toet'), F = require('../lib/toetfriends');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, rr, circ, hash, INK } = C;

const NUM = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];
const NOTES = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6', 'D6', 'E6'];
const BX = 92;                                   // Toet parked here (truck bx)
const MAMA = [872, 426], REEDS = [298, 430], MS = 1.55, DS = .84;
const SLOT = i => [806 - i * 49, 428];
const SEG = 7.5, POP = .7, LAND = 3.0;           // per duckling: pop 0–0.7, swim 0.7–3.0, number 3.0–7.0
const BOWS = ['#e63946', '#3a86ff', '#ff8fc8', '#40c057', '#9b5de5', '#ff8c1a', '#00b4d8', '#e63946', '#3a86ff', '#ff8fc8'];

function duckling(px, py, s, t, i, flip = false) {
  const bob = Math.sin(t * 3 + i) * 1.5;
  // ripple
  x.save(); x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = 2; x.beginPath(); x.ellipse(px, py + 2, 30 * s / .62, 4, 0, 0, 7); x.stroke(); x.restore();
  F.duck(px - 6 * s / .62, py + bob, s, '#ffd23f', flip);
  // a tiny coloured bow on the head so every duckling is its own
  const hx = px - 6 * s / .62 + (flip ? -18 : 18) * s, hy = py + bob - 43 * s;
  x.fillStyle = BOWS[i % 10]; x.beginPath(); x.moveTo(hx, hy); x.lineTo(hx - 6, hy - 5); x.lineTo(hx - 6, hy + 4); x.closePath(); x.moveTo(hx, hy); x.lineTo(hx + 6, hy - 5); x.lineTo(hx + 6, hy + 4); x.closePath(); x.fill();
}
function mama(t, dx = 0, quack = 0) {
  const [mx, my] = MAMA, bob = Math.sin(t * 2.2) * 1.5;
  x.save(); x.strokeStyle = 'rgba(255,255,255,.65)'; x.lineWidth = 2.5; x.beginPath(); x.ellipse(mx + dx, my + 2, 64, 7, 0, 0, 7); x.stroke(); x.restore();
  F.duck(mx + dx - 10, my + bob, MS, '#fffaf0');
  if (quack > 0) { x.save(); x.globalAlpha = quack; x.strokeStyle = INK; x.lineWidth = 3; x.lineCap = 'round';
    for (let k = 0; k < 3; k++) { x.beginPath(); x.arc(mx + dx + 58, my + bob - 50, 10 + k * 8, -.6, .6); x.stroke(); } x.restore(); }
  // blinking eye overlay (duck() draws a dot eye; add a little lid now and then)
  if (t % 4.1 > 3.95) { x.fillStyle = '#fffaf0'; x.beginPath(); x.arc(mx + dx - 10 + 21 * MS, my + bob - 35 * MS, 4.2, 0, 7); x.fill(); x.fillStyle = INK; x.fillRect(mx + dx - 10 + 21 * MS - 4, my + bob - 35 * MS, 8, 2); }
}
function reeds(t, shake = 0) {
  const [rx, ry] = REEDS;
  for (let i = 0; i < 9; i++) { const px = rx - 46 + i * 11, h = 60 + hash(i + 3) * 40, sw = Math.sin(t * 1.4 + i) * 3 + Math.sin(t * 30) * shake * 4;
    x.strokeStyle = i % 2 ? '#4f8a3a' : '#6aa84f'; x.lineWidth = 5; x.lineCap = 'round';
    x.beginPath(); x.moveTo(px, ry + 6); x.quadraticCurveTo(px + sw * .5, ry - h * .5, px + sw, ry - h); x.stroke();
    if (i % 3 === 1) { x.fillStyle = '#8a5a36'; rr(px + sw - 5, ry - h - 22, 10, 26, 5); x.fill(); } }
}
function pond(t) {
  x.fillStyle = 'rgba(255,170,60,.14)'; x.fillRect(0, 0, W, T.ROAD);       // warm autumn light
  x.fillStyle = '#5aa9d6'; x.beginPath(); x.ellipse(690, 410, 380, 52, 0, 0, 7); x.fill();
  x.fillStyle = '#7cc4e8'; x.beginPath(); x.ellipse(700, 404, 340, 38, 0, 0, 7); x.fill();
  x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 2.5;
  for (let i = 0; i < 7; i++) { const px = 420 + i * 80 + Math.sin(t * .6 + i) * 14, py = 392 + (i % 3) * 12; x.beginPath(); x.moveTo(px, py); x.lineTo(px + 26, py); x.stroke(); }
  // floating autumn leaves
  [[520, 400, '#ff8c1a'], [640, 386, '#e63946'], [905, 396, '#ffd23f']].forEach(([a, b, col], i) => { x.save(); x.translate(a + Math.sin(t * .5 + i) * 8, b); x.rotate(i + Math.sin(t + i) * .2);
    x.fillStyle = col; x.beginPath(); x.ellipse(0, 0, 10, 5, 0, 0, 7); x.fill(); x.restore(); });
}
function scene(t, dist, extra) {
  T.world({ t, dist, skyP: .14, near: 'trees', behindRoad: () => { pond(t); extra && extra(); } });
}
function tray(n, glow = 0) {
  const w = 640, x0 = W / 2 - w / 2;
  x.save(); x.fillStyle = 'rgba(255,255,255,.88)'; x.strokeStyle = INK; x.lineWidth = 4; rr(x0, 22, w, 64, 30); x.fill(); x.stroke();
  for (let i = 0; i < 10; i++) { const cx = x0 + 44 + i * 61, cy = 54;
    if (i < n) { if (i === n - 1 && glow > 0) circ(cx, cy, 27, `rgba(255,210,63,${.6 * glow})`); F.duck(cx - 8, cy + 18, .62, '#ffd23f'); }
    else { x.setLineDash([5, 5]); circ(cx, cy, 20, null, 'rgba(29,53,87,.35)', 3); x.setLineDash([]); } }
  x.restore();
}
function truck(t, o = {}) { return T.truck(Object.assign({ t, dist: o.dist || 0, moving: false, bx: BX, happy: true }, o)); }
// position of duckling i, u = time inside its segment
function swimPos(i, v) {
  const [sx, sy] = REEDS, [ex, ey] = SLOT(i);
  if (v < POP) return [sx + 20, sy - 2, ease(v / POP)];
  const k = clamp((v - POP) / (LAND - POP));
  return [lerp(sx + 20, ex, ease(k)), lerp(sy, ey, k) - Math.sin(k * Math.PI * 3) * 3, 1];
}
function family(n, t, dx = 0) { for (let i = 0; i < n; i++) { const [a, b] = SLOT(i); duckling(a + dx, b, DS, t, i); } }

const COUNT_D = 10 * SEG + 1;
const countSfx = [];
for (let i = 0; i < 10; i++) {
  const s = i * SEG;
  countSfx.push([s + .1, 'rustle:0.6', .35], [s + .6, 'peep', .45, -.2], [s + LAND, `chime:${NOTES[i]}`, .6], [s + LAND + .15, 'peep', .35, .3]);
  if (i === 4 || i === 9) countSfx.push([s + LAND + .6, 'quack', .35, .7]);
}

St.episode({
  title: ['10 Little Ducklings', 64], sub: 'Count with Little Truck Toet', accent: '#f4a300', cardBg: '#fff8e1',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'ducks', shift: 0 },
  shots: [
    // 1 – Toet drives in and parks by the pond; Mama Duck is waiting for her babies
    { d: 14, draw: (u, c) => {
        const k = ease(clamp((u - 1.5) / 5)), bx = lerp(-330, BX, k), mv = u > 1.5 && u < 6.5;
        scene(c.t, k * 560, () => { mama(c.t, 0, win(u, 7.2, 8.6, .2)); reeds(c.t); });
        truck(c.t, { bx, moving: mv, dist: k * 560, mouth: c.talk('toet') });
        if (u > 11.2) tray(0);
      },
      says: [['toet', 'Mama Duck is calling her babies!', 7.0, 10.6, 280, 230, 28], ['toet', "How many ducklings? Let's count!", 10.9, 13.8, 280, 230, 28]],
      sfx: [[6.8, 'honk', .5], [7.2, 'quack', .5, .7], [8.0, 'quack', .4, .7]] },

    // 2 – counting: ducklings pop out of the reeds and swim to Mama Duck
    { d: COUNT_D, draw: (u, c) => {
        const cur = Math.floor(u / SEG), v = u - cur * SEG, i = Math.min(cur, 9), w = cur > 9 ? SEG : v;
        const landed = cur > 9 ? 10 : i + (w >= LAND ? 1 : 0);
        scene(c.t, 560, () => {
          mama(c.t, 0, cur <= 9 && w >= LAND && w < LAND + .8 ? win(w, LAND, LAND + .8, .2) : 0);
          family(landed, c.t);
          if (cur <= 9 && w < LAND) { const [px, py, sc] = swimPos(i, w); if (sc > 0) { x.save(); x.globalAlpha = sc; duckling(px, py, DS * (.5 + .5 * sc), c.t, i); x.restore(); } }
          reeds(c.t, cur <= 9 && w < POP ? 1 : 0);
          if (cur <= 9 && w >= LAND && w < LAND + .8) { const [a, b] = SLOT(i); C.sparkles(a - 6, b - 34, c.t, 8, 42); }
        });
        const hop = w >= LAND && w < LAND + .5 ? Math.sin((w - LAND) / .5 * Math.PI) * 8 : 0;
        const wow = w >= LAND && w < LAND + 1.3 ? .55 : 0;
        truck(c.t, { mouth: Math.max(c.talk('toet'), wow), hop });
        if (!process.env.THUMBBG) tray(landed, cur <= 9 && w >= LAND ? clamp(1 - (w - LAND) / 4) : 0);
        if (cur <= 9) { const kk = win(w, LAND, SEG - .5, .3);
          const ny = process.env.THUMBBG ? 236 : 192; C.bigText(String(i + 1), 600, ny, kk, 120, '#ffd23f'); C.bigText(NUM[i], 600, ny + 84, kk, 44, '#ffffff'); }
      },
      says: [['toet', 'Here comes another one!', 4 * SEG + .3, 4 * SEG + 2.8, 280, 230, 26]], sfx: countSfx },

    // 3 – TEN little ducklings!
    { d: 8, draw: (u, c) => {
        scene(c.t, 560, () => { mama(c.t, 0, win(u, .4, 1.6, .2)); family(10, c.t); reeds(c.t); });
        const hp = u < 1 ? Math.abs(Math.sin(u * 6)) * 6 : 0;
        truck(c.t, { mouth: c.talk('toet'), hop: hp });
        tray(10, clamp(1 - u / 3)); C.sparkles(640, 400, c.t, 12, 200);
      },
      says: [['toet', 'Ten little ducklings! Hooray!', 1.2, 5.6, 280, 230, 28]],
      sfx: [[.4, 'quack', .5, .7], [.5, 'tada', .5], [1.0, 'peep', .4], [1.3, 'peep', .35, .4]] },

    // 4 – recap: count 1..10 again
    { d: 17, draw: (u, c) => {
        scene(c.t, 560, () => { mama(c.t); family(10, c.t); reeds(c.t); });
        truck(c.t);
        x.fillStyle = 'rgba(255,250,232,.88)'; x.fillRect(0, 0, W, 540);
        C.bigText("Let's count again!", W / 2, 84, win(u, .4, 16.6, .4), 54, '#f4a300');
        for (let i = 0; i < 10; i++) { const t0 = 2 + i * 1.25, k = clamp((u - t0) / .35), on = u >= t0 && u < t0 + 1.25;
          const cx = 120 + (i % 5) * 180, cy = 216 + Math.floor(i / 5) * 160;
          if (k <= 0) continue;
          if (on) circ(cx, cy - 24, 48, 'rgba(255,210,63,.45)');
          x.save(); x.globalAlpha = k; x.translate(cx, cy); x.scale(1.3 * (.5 + .5 * ease(k)), 1.3 * (.5 + .5 * ease(k))); duckling(0, 0, DS, c.t, i); x.restore();
          C.bigText(String(i + 1), cx, cy + 46, k, 50, '#ffffff'); }
        C.bigText('Well done!', W / 2, 506, win(u, 14.6, 16.8, .3), 40, '#ffd23f');
      },
      sfx: Array.from({ length: 10 }, (_, i) => [2 + i * 1.25, `chime:${NOTES[i]}`, .55]).concat([[14.6, 'cheer', .4]]) },

    // 5 – the duck family waves goodbye, Toet drives off
    { d: 12, draw: (u, c) => {
        const k = ease(clamp((u - 5) / 5)), bx = lerp(BX, 1150, k), dk = 0;   // the duck family stays fully in view
        scene(c.t, 560 + k * 340, () => { x.save(); x.translate(-k * 340, 0); x.restore(); mama(c.t, dk, win(u, .6, 1.6, .2)); family(10, c.t, dk); reeds(c.t); });
        truck(c.t, { bx, moving: u > 5, dist: 560 + k * 340, mouth: c.talk('toet') });
      },
      says: [['toet', 'Bye bye, little ducklings!', 1, 4.6, 300, 230, 28]],
      sfx: [[.6, 'quack', .45, .7], [5, 'honk', .5], [6, 'peep', .3, .6]] },
  ],
});
