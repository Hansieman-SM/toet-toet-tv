// Learning series – Counting #1: 10 Falling Leaves with Little Truck Toet (autumn).
// Toet parks under an autumn tree with exactly 10 big leaves; they fall one by one into his cargo box. A tray of 10 at the top fills up,
// each new leaf gets a big numeral + number word and a rising chime. Leaf 6 comes with a wind gust. Then: the tree is bare, recap 1–10, Toet drives off.
// New music: leaves_long (recorder, harpsichord pluck, pizzicato bass, tambourine; A major 4/4).
const C = require('../lib/common'), T = require('../lib/toet');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, rr, circ, hash, INK } = C;

const NUM = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];
const LEAFC = ['#ff7a45', '#ffb627', '#e63946', '#f4a261', '#d62828', '#ffd23f', '#e76f51', '#ff9f1c', '#c1121f', '#f6bd60'];
const NOTES = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6', 'D6', 'E6'];
const TX = 640, TG = 412;                       // tree position (ground behind the road)
const CAN = [[-95, -262], [-30, -305], [42, -292], [104, -250], [-128, -206], [-52, -236], [18, -248], [96, -200], [-18, -192], [148, -222]].map(([a, b]) => [TX + a, TG + b]);
const BX = 230;                                  // Toet parked here (truck bx)
const BOX = i => [BX - 46 + (i % 5) * 38, T.ROAD + 20 - 124 - Math.floor(i / 5) * 14];
const SEG = 7.5, LAND = 3.0, FALL0 = .7;          // per leaf: wiggle 0–0.7, fall 0.7–3.0, number 3.0–7.0

function leafShape(cx, cy, s, rot, col, a = 1) {
  x.save(); x.globalAlpha *= a; x.translate(cx, cy); x.rotate(rot); x.scale(s, s);
  x.beginPath(); x.moveTo(0, 18); x.bezierCurveTo(-18, 6, -16, -12, 0, -20); x.bezierCurveTo(16, -12, 18, 6, 0, 18); x.fillStyle = col; x.fill();
  x.strokeStyle = 'rgba(80,30,10,.65)'; x.lineWidth = 2; x.stroke(); x.beginPath(); x.moveTo(0, 22); x.lineTo(0, -14); x.stroke();
  x.restore();
}
function tree(onTree, wiggle = -1, t = 0, gust = 0) {
  x.save(); x.translate(TX, TG);
  x.fillStyle = '#8a5a36'; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(-26, 0); x.quadraticCurveTo(-14, -120, -10, -200); x.lineTo(14, -200); x.quadraticCurveTo(18, -120, 30, 0); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = '#8a5a36'; x.lineWidth = 12; x.lineCap = 'round';
  x.beginPath(); x.moveTo(4, -150); x.quadraticCurveTo(70, -175, 130, -185); x.moveTo(0, -170); x.quadraticCurveTo(-60, -195, -110, -200); x.stroke();
  const sw = Math.sin(t * 1.2) * 2 + gust * 8 * Math.sin(t * 6);
  const bare = onTree.filter(Boolean).length / 10;            // canopy thins out as leaves fall
  [['#e9a23b', 6], ['#f4b942', 0]].forEach(([col, g]) => { x.fillStyle = col; x.globalAlpha = .35 + .65 * bare; x.beginPath();
    [[-90, -250, 62], [0, -290, 78], [90, -258, 64], [-30, -215, 66], [140, -205, 40], [-140, -205, 40]].forEach(([a, b, r]) => { x.moveTo(a + sw + r + g, b); x.arc(a + sw, b, r + g, 0, 7); }); x.fill(); });
  x.globalAlpha = 1;
  x.restore();
  onTree.forEach((on, i) => { if (!on) return; const w = i === wiggle ? Math.sin(t * 30) * .25 : 0;
    leafShape(CAN[i][0] + sw, CAN[i][1], 1.6, -.5 + hash(i) * 1 + w + Math.sin(t * 1.5 + i) * .05, LEAFC[i]); });
}
function autumn(t, dist, behind) {
  T.world({ t, dist, skyP: .14, near: 'trees', behindRoad: () => { x.fillStyle = 'rgba(255,170,60,.16)'; x.fillRect(0, 0, W, T.ROAD); behind && behind(); } });
}
function tray(n, glow = 0) {
  const w = 640, x0 = W / 2 - w / 2;
  x.save(); x.fillStyle = 'rgba(255,255,255,.88)'; x.strokeStyle = INK; x.lineWidth = 4; rr(x0, 22, w, 64, 30); x.fill(); x.stroke();
  for (let i = 0; i < 10; i++) { const cx = x0 + 44 + i * 61, cy = 54;
    if (i < n) { if (i === n - 1 && glow > 0) circ(cx, cy, 27, `rgba(255,210,63,${.6 * glow})`); leafShape(cx, cy, 1, -.4 + (i % 3) * .3, LEAFC[i]); }
    else { x.setLineDash([5, 5]); circ(cx, cy, 20, null, 'rgba(29,53,87,.35)', 3); x.setLineDash([]); } }
  x.restore();
}
function boxLeaves(n, dy = 0) { for (let i = 0; i < n; i++) { const [a, b] = BOX(i); leafShape(a, b - dy, 1.2, -.6 + hash(i + 5) * 1.2, LEAFC[i]); } }
function truck(t, o = {}) { return T.truck(Object.assign({ t, dist: o.dist || 0, moving: false, bx: BX, happy: true }, o)); }
function windLines(t, k) {
  if (k <= 0) return; x.save(); x.strokeStyle = `rgba(255,255,255,${.8 * k})`; x.lineWidth = 4; x.lineCap = 'round';
  for (let i = 0; i < 5; i++) { const px = ((t * 420 + i * 230) % 1200) - 200, py = 140 + i * 50 + Math.sin(t * 3 + i) * 10;
    x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + 60, py - 18, px + 130, py); x.stroke(); }
  x.restore();
}
// position of falling leaf i at time k (0..1 of the fall)
function fallPos(i, k, gust) {
  const [a, b] = CAN[i], [c, d] = BOX(i);
  let px = lerp(a, c, ease(k)) + Math.sin(k * Math.PI * 3) * 34 * (1 - k), py = lerp(b, d, k);
  if (gust) { px += Math.sin(k * Math.PI) * 170; py -= Math.sin(k * Math.PI) * 40; }
  return [px, py, Math.sin(k * Math.PI * 4) * .9];
}

const COUNT_D = 10 * SEG + 1;
const countSfx = [], countSays = [];
for (let i = 0; i < 10; i++) {
  const s = i * SEG;
  countSfx.push([s + .1, 'rustle:0.8', .35], [s + LAND, `chime:${NOTES[i]}`, .6]);
  if (i === 5) countSfx.push([s - .2, 'whoosh', .55]);
}
countSays.push(['toet', 'Whoosh! The wind!', 5 * SEG + .2, 5 * SEG + 2.8, 400, 220, 26]);

St.episode({
  title: ['10 Falling Leaves', 64], sub: 'Count with Little Truck Toet', accent: '#e76f51', cardBg: '#fff4e6',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'leaves', shift: 0 },
  shots: [
    // 1 – Toet drives in and parks under a big autumn tree with 10 leaves
    { d: 13, draw: (u, c) => {
        const k = ease(clamp((u - 1.5) / 5)), bx = lerp(-330, BX, k), mv = u > 1.5 && u < 6.5;
        autumn(c.t, 640, () => tree(Array(10).fill(true), -1, c.t));
        truck(c.t, { bx, moving: mv, dist: k * 560, mouth: c.talk('toet') });
        if (u > 10.2) tray(0);
      },
      says: [['toet', 'Look! An autumn tree!', 7.2, 10, 420, 230, 28], ['toet', "How many leaves? Let's count!", 10.4, 13, 440, 230, 28]],
      sfx: [[6.8, 'honk', .5]] },

    // 2 – counting: leaves fall one by one into Toet's box
    { d: COUNT_D, noFadeIn: false, draw: (u, c) => {
        const cur = Math.floor(u / SEG), v = u - cur * SEG, i = Math.min(cur, 9), w = cur > 9 ? SEG : v;
        const landed = cur > 9 ? 10 : i + (w >= LAND ? 1 : 0), gust = i === 5;
        const gk = gust ? clamp(Math.min(w / .5, (LAND + .5 - w) / .5)) : 0;
        const onTree = Array(10).fill(true).map((_, j) => j > i || (j === i && w < FALL0 && cur <= 9));
        autumn(c.t, 640, () => tree(onTree, w < FALL0 ? i : -1, c.t, gk));
        windLines(c.t, gk);
        const hop = w >= LAND && w < LAND + .5 ? Math.sin((w - LAND) / .5 * Math.PI) * 8 : 0;
        const wow = w >= LAND && w < LAND + 1.3 ? .55 : 0;
        truck(c.t, { mouth: Math.max(c.talk('toet'), wow), hop });
        boxLeaves(landed, hop);
        if (cur <= 9 && w >= FALL0 && w < LAND) { const [px, py, r] = fallPos(i, (w - FALL0) / (LAND - FALL0), gust); leafShape(px, py, 1.6, r, LEAFC[i]); }
        if (cur <= 9 && w >= LAND && w < LAND + .8) C.sparkles(BOX(i)[0], BOX(i)[1], c.t, 8, 50);
        tray(landed, cur <= 9 && w >= LAND ? clamp(1 - (w - LAND) / 4) : 0);
        if (cur <= 9) { const kk = win(w, LAND, SEG - .5, .3);
          C.bigText(String(i + 1), 330, 180, kk, 120, LEAFC[i]); C.bigText(NUM[i], 330, 262, kk, 44, '#ffffff'); }
      },
      says: countSays, sfx: countSfx },

    // 3 – the tree is bare: TEN!
    { d: 8, draw: (u, c) => {
        autumn(c.t, 640, () => tree(Array(10).fill(false), -1, c.t));
        const hp = u < 1 ? Math.abs(Math.sin(u * 6)) * 6 : 0;
        truck(c.t, { mouth: c.talk('toet'), hop: hp });
        boxLeaves(10, hp); tray(10, clamp(1 - u / 3)); C.sparkles(BX + 30, 300, c.t, 10, 110);
      },
      says: [['toet', 'Ten leaves! The tree is bare!', 1.2, 5.6, 420, 230, 28]],
      sfx: [[.5, 'tada', .5]] },

    // 4 – recap: count 1..10 again, each leaf lights up with its numeral
    { d: 17, draw: (u, c) => {
        autumn(c.t, 640, () => tree(Array(10).fill(false), -1, c.t));
        x.fillStyle = 'rgba(255,248,235,.86)'; x.fillRect(0, 0, W, 540);
        C.bigText("Let's count again!", W / 2, 84, win(u, .4, 16.6, .4), 54, '#e76f51');
        for (let i = 0; i < 10; i++) { const t0 = 2 + i * 1.25, k = clamp((u - t0) / .35), on = u >= t0 && u < t0 + 1.25;
          const cx = 120 + (i % 5) * 180, cy = 216 + Math.floor(i / 5) * 160;
          if (on) circ(cx, cy - 18, 46, 'rgba(255,210,63,.45)');
          leafShape(cx, cy - 18, 2 * (.4 + .6 * ease(k)) * (on ? 1.12 : 1), -.3, LEAFC[i], k);
          C.bigText(String(i + 1), cx, cy + 54, k, 50, '#ffffff'); }
        C.bigText('Well done!', W / 2, 500, win(u, 14.6, 16.8, .3), 44, '#ffd23f');
      },
      sfx: Array.from({ length: 10 }, (_, i) => [2 + i * 1.25, `chime:${NOTES[i]}`, .55]).concat([[14.6, 'cheer', .4]]) },

    // 5 – Toet drives off with a box full of leaves
    { d: 12, draw: (u, c) => {
        const k = ease(clamp((u - 5) / 5)), bx = lerp(BX, 1150, k);
        autumn(c.t, 640, () => tree(Array(10).fill(false), -1, c.t));
        truck(c.t, { bx, moving: u > 5, dist: k * 900, mouth: c.talk('toet') });
        x.save(); x.translate(bx - BX, 0); boxLeaves(10); x.restore();
      },
      says: [['toet', 'Bye bye, tree! See you in spring!', 1, 4.8, 440, 230, 28]],
      sfx: [[5, 'honk', .5]] },
  ],
});
