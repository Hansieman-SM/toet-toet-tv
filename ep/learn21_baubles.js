// Learning series #21 (THEMES #11) – Counting: 10 Christmas Baubles with Little Truck Toet (December, snowy village green).
// It is a snowy afternoon. Little Truck Toet (electric) drives up to a bare Christmas tree on the village green with a box full of
// baubles. One by one ten smiling baubles (each its own colour + pattern: stripes, dots, a zig-zag, a little snowflake, a heart …) hop
// out of his cargo box and float up onto the tree with a soft jingle. A tray of 10 at the top fills up; every bauble gets a big numeral
// + number word and a rising chime. Then: TEN!, recap 1–10, the light turns to a blue evening, the fairy lights switch on one by one,
// a golden star lights up on top, Toet says "Our tree is ready!" and "Merry Christmas!" and quietly rolls away.
// New music: baubles_long (gentle Christmas-card waltz in G – handbell lead (new), warm string pad, pizzicato bass, soft triangle).
const C = require('../lib/common'), T = require('../lib/toet');
const St = require('../lib/story');
const { x, W, H, clamp, ease, lerp, win, rr, circ, ell, hash, mix, INK } = C;

const TB = !!process.env.THUMBBG;
const NUM = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];
const NOTES = ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5', 'A5', 'B5'];   // G major, matches the music
const BX = 98;                                    // Toet parked here
const TX = 610, TBASE = 428, TTOP = 118;          // Christmas tree: centre x, base y, top y
// bauble colours + patterns
const BAU = [
  { c: '#e63946', p: 'stripe' }, { c: '#ffd23f', p: 'dots' }, { c: '#3a86ff', p: 'flake' }, { c: '#40c057', p: 'zig' },
  { c: '#ff6fae', p: 'heart' }, { c: '#9b5de5', p: 'dots' }, { c: '#ff8c1a', p: 'stripe' }, { c: '#22b8cf', p: 'zig' },
  { c: '#f8f9fa', p: 'flake' }, { c: '#e63946', p: 'heart' }];
const NCOL = ['#e63946', '#f2b705', '#3a86ff', '#2f9e44', '#ff6fae', '#9b5de5', '#ff8c1a', '#15aabf', '#74c0fc', '#e63946'];
// where bauble i hangs on the tree (bottom row first, then up to the top)
const SLOTS = [[528, 384], [586, 394], [646, 392], [702, 380], [552, 320], [612, 330], [670, 318], [580, 262], [640, 266], [610, 202]];
const SEG = 7, HOP = .5, LAND = 2.4;
const BOX = [BX + 30, 352];                       // where the baubles come out of Toet's cargo box

// ---------- a smiling bauble (centre = ball centre) ----------
function bauble(cx, cy, r, i, t, o = {}) {
  const B = BAU[i], a = o.alpha ?? 1;
  if (a <= 0) return;
  x.save(); x.globalAlpha *= a; x.translate(cx, cy); x.rotate(o.rot || 0);
  if (o.glow) circ(0, 0, r * 1.7, `rgba(255,240,170,${.45 * o.glow})`);
  // hook + cap
  x.strokeStyle = '#8a8f98'; x.lineWidth = 1.6; x.beginPath(); x.arc(0, -r - 6, 3.2, Math.PI * .9, Math.PI * 2.1); x.stroke();
  x.fillStyle = '#c9ced6'; x.strokeStyle = INK; x.lineWidth = 1.6; rr(-r * .32, -r - 4, r * .64, 6, 2); x.fill(); x.stroke();
  // ball
  circ(0, 0, r, B.c, INK, 2.2);
  x.save(); x.beginPath(); x.arc(0, 0, r - 1, 0, 7); x.clip();
  const pc = B.c === '#f8f9fa' ? '#74c0fc' : 'rgba(255,255,255,.75)';
  x.fillStyle = pc; x.strokeStyle = pc; x.lineWidth = r * .16;
  if (B.p === 'stripe') { x.fillRect(-r, r * .22, r * 2, r * .2); x.fillRect(-r, -r * .5, r * 2, r * .16); }
  if (B.p === 'dots') [[-.55, .45], [0, .62], [.55, .45], [-.62, -.35], [.62, -.35]].forEach(([a2, b]) => circ(a2 * r, b * r, r * .12, pc));
  if (B.p === 'zig') { x.beginPath(); for (let k = 0; k <= 8; k++) { const px = -r + k * r / 4, py = r * .5 + (k % 2 ? -r * .16 : r * .1); k ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); }
  if (B.p === 'flake') { x.lineWidth = r * .09; x.save(); x.translate(r * .5, r * .42); for (let k = 0; k < 3; k++) { x.rotate(Math.PI / 3); x.beginPath(); x.moveTo(-r * .24, 0); x.lineTo(r * .24, 0); x.stroke(); } x.restore(); }
  if (B.p === 'heart') { x.save(); x.translate(r * .48, r * .5); x.scale(r / 30, r / 30); x.beginPath(); x.moveTo(0, 6); x.bezierCurveTo(-10, -2, -6, -10, 0, -5); x.bezierCurveTo(6, -10, 10, -2, 0, 6); x.fill(); x.restore(); }
  x.restore();
  // shine
  x.fillStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.ellipse(-r * .42, -r * .45, r * .22, r * .13, -.6, 0, 7); x.fill();
  // face
  const bl = o.sleep || (t + i * .9) % 4.1 > 3.95;
  x.strokeStyle = INK; x.fillStyle = INK; x.lineWidth = Math.max(1.2, r * .09);
  [-1, 1].forEach(sd => { if (bl) { x.beginPath(); x.arc(sd * r * .3, -r * .08, r * .11, .2, Math.PI - .2); x.stroke(); } else circ(sd * r * .3, -r * .1, r * .1, INK); });
  x.beginPath(); x.arc(0, r * .06, r * .22, .3, Math.PI - .3); x.stroke();
  x.fillStyle = 'rgba(255,120,140,.45)'; [-1, 1].forEach(sd => { x.beginPath(); x.arc(sd * r * .5, r * .12, r * .1, 0, 7); x.fill(); });
  x.restore();
}

// ---------- the Christmas tree (drawn after the world so the evening can be handled here) ----------
function tree(t, dark = 0, lights = 0, star = 0) {
  const g1 = mix('#2b8a3e', '#1a3d3a', dark * .7), g2 = mix('#37a24d', '#22504a', dark * .7), sn = mix('#f4f8ff', '#9fb0d8', dark * .6);
  x.save(); x.lineJoin = 'round';
  // trunk + snowy base
  x.fillStyle = mix('#7b5034', '#3e2c30', dark * .6); x.strokeStyle = INK; x.lineWidth = 3; rr(TX - 16, TBASE - 26, 32, 30, 4); x.fill(); x.stroke();
  x.fillStyle = sn; x.beginPath(); x.ellipse(TX, TBASE + 4, 120, 13, 0, 0, 7); x.fill();
  // three tiers (bottom first)
  const tiers = [[TBASE - 18, 168, 132], [TBASE - 96, 138, 122], [TBASE - 172, 104, 128]];
  tiers.forEach(([by, hw, h], k) => {
    x.fillStyle = k % 2 ? g2 : g1; x.strokeStyle = INK; x.lineWidth = 3;
    x.beginPath(); x.moveTo(TX - hw, by);
    for (let j = 0; j <= 6; j++) { const px = TX - hw + j * hw / 3; x.quadraticCurveTo(px - hw / 6, by + 10, px, by); }
    x.lineTo(TX, by - h); x.closePath(); x.fill(); x.stroke();
    // snow on the branches
    x.fillStyle = sn; x.beginPath();
    for (let j = 0; j < 6; j++) { const px = TX - hw + 18 + j * (hw * 2 - 36) / 5; x.moveTo(px + 14, by - 2); x.ellipse(px, by - 2, 14, 5, 0, 0, 7); }
    x.fill();
    x.beginPath(); x.moveTo(TX - 18, by - h + 26); x.quadraticCurveTo(TX, by - h - 2, TX + 18, by - h + 26); x.quadraticCurveTo(TX, by - h + 16, TX - 18, by - h + 26); x.fill();
  });
  // fairy lights: a garland per tier, bulbs switch on one by one (lights 0..1)
  const COLS = ['#ffd23f', '#ff6b6b', '#74c0fc', '#8ce99a', '#ffa8e2'];
  let n = 0;
  tiers.forEach(([by, hw, h], k) => {
    const y0 = by - h * .42, w0 = hw * .62;
    x.strokeStyle = mix('#3d6b3f', '#2a3a40', dark); x.lineWidth = 1.6; x.beginPath(); x.moveTo(TX - w0, y0 - 10); x.quadraticCurveTo(TX, y0 + 22, TX + w0, y0 - 10); x.stroke();
    for (let j = 0; j < 6; j++) { const s = j / 5, px = lerp(TX - w0, TX + w0, s), py = (y0 - 10) + 2 * s * (1 - s) * 32;
      const on = clamp(lights * 18 - n), tw = .7 + .3 * Math.sin(t * 3 + n * 1.7); n++;
      if (on > 0) circ(px, py + 4, 9 * on, `rgba(255,240,180,${.35 * on * tw})`);
      circ(px, py + 3, 3.6, on > 0 ? mix('#8a8f98', COLS[n % 5], on) : '#8a8f98', INK, 1.2); }
  });
  // star on top
  const sy = TTOP - 6, sk = ease(clamp(star));
  if (sk > 0) circ(TX, sy, 34 * sk * (1 + .06 * Math.sin(t * 4)), `rgba(255,224,102,${.45 * sk})`);
  x.save(); x.translate(TX, sy); x.rotate(Math.sin(t * 1.2) * .04); x.fillStyle = mix('#c9ced6', '#ffd23f', sk); x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath();
  for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 9 : 21; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fill(); x.stroke();
  if (sk > .3) { x.strokeStyle = INK; x.lineWidth = 1.6; x.beginPath(); x.arc(0, 2, 5, .3, Math.PI - .3); x.stroke(); circ(-4, -3, 1.6, INK); circ(4, -3, 1.6, INK); }
  x.restore();
  x.restore();
}
function hung(n, t, cur = -1, glow = 0, dark = 0) {
  for (let i = 0; i < n; i++) { const [sx0, sy0] = SLOTS[i], sw = Math.sin(t * 1.6 + i) * .08;
    bauble(sx0, sy0, 14.5, i, t, { rot: sw, glow: i === cur ? glow : dark * .6 }); }
}
// gentle falling snow
function snowfall(t, n = 60, a = .9) {
  for (let i = 0; i < n; i++) { const sp = 18 + hash(i + 3) * 22, r = 1.4 + hash(i + 9) * 2.2;
    const py = ((hash(i + 7) * (H + 30) + t * sp) % (H + 30)) - 15, px = (hash(i + 1) * (W + 40) + Math.sin(t * .8 + i) * 14) % (W + 40) - 20;
    x.fillStyle = `rgba(255,255,255,${a * (.55 + hash(i + 5) * .45)})`; x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); }
}
function scene(t, o = {}) {
  const p = o.skyP ?? .12;
  const n = T.world({ t, dist: o.dist || 0, skyP: p, near: 'trees', snow: 1, onRoad: () => {
    // snowy road edges
    x.fillStyle = '#eef3fa'; for (let k = 0; k < 16; k++) { x.beginPath(); x.ellipse(k * 64 + hash(k) * 20, T.ROAD + 2, 30, 6, 0, 0, 7); x.fill(); } } });
  tree(t, n, o.lights || 0, o.star || 0);
  return n;
}
function tray(n, glow = 0, t = 0) {
  const w = 640, x0 = W / 2 - w / 2;
  x.save(); x.fillStyle = 'rgba(255,255,255,.9)'; x.strokeStyle = INK; x.lineWidth = 4; rr(x0, 22, w, 64, 30); x.fill(); x.stroke();
  for (let i = 0; i < 10; i++) { const cx = x0 + 44 + i * 61, cy = 56;
    if (i < n) { if (i === n - 1 && glow > 0) circ(cx, cy, 27, `rgba(255,210,63,${.6 * glow})`); bauble(cx, cy, 16, i, t); }
    else { x.setLineDash([5, 5]); circ(cx, cy, 18, null, 'rgba(29,53,87,.35)', 3); x.setLineDash([]); } }
  x.restore();
}
function truck(t, o = {}) { return T.truck(Object.assign({ t, dist: o.dist || 0, moving: false, bx: BX, happy: true }, o)); }
// flying bauble i at time w inside its segment -> [x, y, rot, alpha, scale]
function flyPos(i, w) {
  const [ex, ey] = SLOTS[i];
  if (w < HOP) { const k = ease(clamp(w / HOP)); return [BOX[0], BOX[1] - 30 * k, 0, clamp(w / .15), .6 + .4 * k]; }
  const k = ease(clamp((w - HOP) / (LAND - HOP)));
  return [lerp(BOX[0], ex, k), lerp(BOX[1] - 30, ey, k) - Math.sin(k * Math.PI) * 110, Math.sin(w * 6) * .25 * (1 - k), 1, 1];
}

const COUNT_D = 10 * SEG + 1;
const countSfx = [];
for (let i = 0; i < 10; i++) {
  const s = i * SEG;
  countSfx.push([s + .05, 'pop', .3, -.5], [s + .6, 'whoosh', .18, -.1], [s + LAND, `chime:${NOTES[i]}`, .6, .2], [s + LAND + .05, 'sleigh', .16, .3]);
}
const COUNT_SAYS = [['toet', 'Here is the first one!', .3, 2.8], ['toet', 'A yellow one!', SEG + .3, SEG + 2.8],
  ['toet', 'Look, a snowflake!', 2 * SEG + 2.6, 2 * SEG + 5.6], ['toet', 'A pink heart!', 4 * SEG + 2.6, 4 * SEG + 5.6],
  ['toet', 'Higher and higher!', 7 * SEG + .3, 7 * SEG + 2.8], ['toet', 'The last one goes on top!', 9 * SEG + .2, 9 * SEG + 2.6]].map(a => a.concat([292, 228, 26]));

St.episode({
  title: ['10 Christmas Baubles', 64], sub: 'Count with Little Truck Toet', accent: '#c92a2a', cardBg: '#fff5f5',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'baubles', shift: 0 },
  shots: [
    // 1 – Toet drives up to the bare Christmas tree on the snowy village green
    { d: 14, draw: (u, c) => {
        const k = ease(clamp((u - 1.0) / 5)), bx = lerp(-330, BX, k), mv = u > 1.0 && u < 6.0;
        scene(c.t, { dist: k * 560 });
        truck(c.t, { bx, moving: mv, dist: k * 560, mouth: c.talk('toet') });
        snowfall(c.t);
        if (u > 11.0) tray(0, 0, c.t);
      },
      says: [['toet', 'Ten baubles for the tree!', 6.8, 10.4, 292, 228, 28], ['toet', "Let's count them!", 10.7, 13.6, 292, 228, 28]],
      sfx: [[6.4, 'honk', .4], [11.0, 'sleigh', .3, .2]] },

    // 2 – counting: the baubles hop out of Toet's box and float onto the tree
    { d: COUNT_D, draw: (u, c) => {
        const cur = Math.floor(u / SEG), v = u - cur * SEG, i = Math.min(cur, 9), w = cur > 9 ? SEG : v;
        const landed = cur > 9 ? 10 : i + (w >= LAND ? 1 : 0);
        scene(c.t);
        hung(landed, c.t, cur <= 9 && w >= LAND ? i : -1, cur <= 9 && w >= LAND ? clamp(1 - (w - LAND) / 2) : 0);
        const wow = w >= LAND && w < LAND + 1.0 ? .5 : 0;
        truck(c.t, { mouth: Math.max(c.talk('toet'), wow), hop: cur <= 9 && w < .4 ? Math.sin(w / .4 * Math.PI) * 4 : 0 });
        if (cur <= 9 && w < LAND) { const [px, py, rot, a, s] = flyPos(i, w); bauble(px, py, 14.5 * s, i, c.t, { rot, alpha: a }); }
        if (cur <= 9 && w >= LAND && w < LAND + .9) { const [a, b] = SLOTS[i]; C.sparkles(a, b, c.t, 8, 34); }
        snowfall(c.t, 40, .8);
        if (!TB) tray(landed, cur <= 9 && w >= LAND ? clamp(1 - (w - LAND) / 4) : 0, c.t);
        if (cur <= 9) { const kk = win(w, LAND, SEG - .5, .3), nx = 846, ny = TB ? 232 : 186;
          C.bigText(String(i + 1), nx, ny, kk, 120, NCOL[i]); C.bigText(NUM[i], nx, ny + 82, kk, 44, '#ffffff'); }
      },
      says: TB ? [] : COUNT_SAYS, sfx: countSfx },

    // 3 – TEN Christmas baubles!
    { d: 8, draw: (u, c) => {
        scene(c.t); hung(10, c.t);
        truck(c.t, { mouth: c.talk('toet'), hop: u < 1 ? Math.abs(Math.sin(u * 6)) * 5 : 0 });
        snowfall(c.t, 40, .8);
        tray(10, clamp(1 - u / 3), c.t); C.sparkles(TX, 300, c.t, 12, 150);
      },
      says: [['toet', 'Ten Christmas baubles!', 1.0, 4.6, 292, 228, 28], ['toet', 'So pretty!', 4.9, 7.4, 292, 228, 28]],
      sfx: [[.4, 'tada', .4], [1.2, 'sleigh', .25, .2]] },

    // 4 – recap: count 1..10 again
    { d: 17, draw: (u, c) => {
        scene(c.t); hung(10, c.t); truck(c.t);
        x.fillStyle = 'rgba(255,245,245,.92)'; x.fillRect(0, 0, W, H);
        C.bigText("Let's count again!", W / 2, 84, win(u, .4, 16.6, .4), 54, '#c92a2a');
        for (let i = 0; i < 10; i++) { const t0 = 2 + i * 1.25, k = clamp((u - t0) / .35), on = u >= t0 && u < t0 + 1.25;
          const cx = 120 + (i % 5) * 180, cy = 196 + Math.floor(i / 5) * 160;
          if (k <= 0) continue;
          if (on) circ(cx, cy, 52, 'rgba(255,210,63,.45)');
          bauble(cx, cy, 34 * (.5 + .5 * ease(k)) * (on ? 1.08 : 1), i, c.t, { alpha: k });
          C.bigText(String(i + 1), cx, cy + 72, k, 48, NCOL[i]); }
        C.bigText('Well done!', W / 2, 504, win(u, 14.6, 16.8, .3), 40, '#2f9e44');
      },
      sfx: Array.from({ length: 10 }, (_, i) => [2 + i * 1.25, `chime:${NOTES[i]}`, .55]).concat([[14.6, 'cheer', .35]]) },

    // 5 – blue evening: fairy lights switch on, the star lights up, Merry Christmas! Toet quietly rolls away.
    { d: 20, draw: (u, c) => {
        const p = lerp(.12, .6, ease(clamp((u - .3) / 5)));
        const lights = clamp((u - 3.0) / 2.6), star = clamp((u - 5.8) / .8);
        scene(c.t, { skyP: p, lights, star });
        const night = T.sky(p).night;
        hung(10, c.t, -1, 0, night);
        const dk = ease(clamp((u - 10.8) / 2.4));   // rolls away before the subscribe pill appears (pill from u = 13.5)
        truck(c.t, { bx: lerp(BX, 1180, dk), moving: u > 10.8 && dk < 1, dist: dk * 1100, mouth: c.talk('toet'), night });
        snowfall(c.t, 50, .9);
        if (u > 5.8 && u < 7.4) C.sparkles(TX, TTOP - 6, c.t, 12, 60);
      },
      says: [['toet', 'Our tree is ready!', 6.4, 8.6, 292, 228, 28], ['toet', 'Merry Christmas!', 8.8, 10.7, 292, 228, 28]],
      sfx: Array.from({ length: 6 }, (_, k) => [3.0 + k * .45, `twinkle:${['G5', 'B5', 'D6', 'G6', 'B5', 'D6'][k]}`, .22, -.3 + k * .12])
        .concat([[5.8, 'tada', .35], [5.9, 'sleigh', .3, .2], [10.8, 'honk', .25]]) },
  ],
});
