// Learning series – Counting #7: 10 Sleepy Hedgehogs with Little Truck Toet (late autumn, warm golden afternoon at the forest edge).
// Toet parks next to a big cosy leaf pile under an old autumn tree, beside a hedge. One by one ten little hedgehogs (each its own accent:
// a coloured leaf or a little apple on its spikes, a scarf, a bow, different sizes) waddle out of the hedge, climb onto the pile, yawn
// and snuggle into the leaves for their winter sleep – only their spiky backs and noses peek out. A tray of 10 at the top fills up, each
// hedgehog gets a big numeral + number word and a rising chime. Then: TEN!, recap 1–10, the light turns to soft dusk, the leaf pile
// gently "breathes" with tiny snores (Zzz), Toet whispers that hedgehogs sleep all winter long, says "Good night, hedgehogs!" and quietly rolls away.
// New music: hedgehogs_long (slow cosy cradle waltz in B-flat – bowed cello lead, music-box tines, soft bass, hushed leaf brush).
const C = require('../lib/common'), T = require('../lib/toet');
const St = require('../lib/story');
const { x, W, H, clamp, ease, lerp, win, rr, circ, ell, hash, mix, INK } = C;

const TB = !!process.env.THUMBBG;
const NUM = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];
const NOTES = ['A#4', 'C5', 'D5', 'D#5', 'F5', 'G5', 'A5', 'A#5', 'C6', 'D6'];   // B-flat major, matches the music
const NCOL = ['#ff8c42', '#ffd23f', '#ff6b6b', '#8ce07a', '#6cc6ff', '#c49bff', '#ff9ec4', '#ffb347', '#7be0c8', '#ffd23f'];
const BX = 98;                                        // Toet parked here (truck bx)
const GR = 436;                                       // ground line behind the road
const PILE = [538, 438, 202, 96];                     // leaf pile dome: cx, base y, rx, ry
const TREE = 430;                                     // trunk x
const HEDGE = 770;                                    // left edge of the hedge
const START = [860, GR];                              // hedgehogs start hidden behind the hedge
// sleeping spots on the pile (top row first, then middle, then front)
const SLOTS = [[538, 370], [450, 372], [626, 372], [492, 402], [584, 402], [400, 404], [676, 404], [538, 434], [446, 434], [630, 434]];
const SEG = 7, OUT = 1.0, CLIMB0 = 1.5, ATTOP = 2.4, LAND = 3.2;
// per hedgehog: size, spike colour, accent
const HOGS = [
  { s: 1.0, sp: '#8a6a4f', leaf: '#e63946' },
  { s: 1.05, sp: '#7a5a40', scarf: '#3a86ff' },
  { s: .84, sp: '#957055', leaf: '#ffd23f' },
  { s: 1.16, sp: '#6f5644', leaf: '#ff8c1a' },
  { s: .95, sp: '#8a6a4f', scarf: '#40c057' },
  { s: .9, sp: '#7a5a40', bow: '#ff6fae' },
  { s: 1.08, sp: '#957055', scarf: '#9b5de5' },
  { s: 1.0, sp: '#6f5644', leaf: '#ff8c1a', leaf2: '#ffd23f' },
  { s: .8, sp: '#8a6a4f', apple: true },
  { s: 1.14, sp: '#7a5a40', scarf: '#ffd23f', leaf: '#e63946' },
];
const HS = 1.36;                                      // overall hedgehog scale in the scene

function leafShape(cx, cy, rx, ry, rot, col, vein = true) {
  x.save(); x.translate(cx, cy); x.rotate(rot); x.fillStyle = col;
  x.beginPath(); x.moveTo(-rx, 0); x.quadraticCurveTo(0, -ry * 1.6, rx, 0); x.quadraticCurveTo(0, ry * 1.6, -rx, 0); x.fill();
  if (vein) { x.strokeStyle = 'rgba(90,40,10,.45)'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(-rx * .8, 0); x.lineTo(rx * .8, 0); x.stroke(); }
  x.restore();
}

// ---------- hedgehog (original design): origin = ground under its feet, faces LEFT (flip = faces right) ----------
// o: { sleep 0..1 (eyes closed), yawn 0..1, step (walking phase), flip, breathe }
function hog(px, gy, s, t, i, o = {}) {
  const H0 = HOGS[i];
  x.save(); x.translate(px, gy); x.scale(s * (o.flip ? -1 : 1), s * (1 + (o.breathe || 0)));
  x.lineJoin = 'round'; x.lineCap = 'round';
  const st = o.step === undefined ? null : o.step;
  // feet
  [[-15, 0], [-5, 1], [9, 0], [18, 1]].forEach(([fx], k) => { const lift = st === null ? 0 : Math.max(0, Math.sin(st + k * Math.PI / 2)) * 3;
    ell(fx, -2 - lift, 5, 3.2, '#5a3e2b', INK, 2); });
  // belly / underside
  ell(2, -11, 23, 10, '#d9b48a', INK, 2.5);
  // spiky back (zig-zag along the top of an ellipse)
  const cx = 6, cy = -16, rx = 26, ry = 18, N = 17, a0 = Math.PI * 1.06, a1 = Math.PI * 2.24;
  x.fillStyle = H0.sp; x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath();
  for (let k = 0; k <= N * 2; k++) { const a = lerp(a0, a1, k / (N * 2)), r = k % 2 ? 1.16 : .92;
    const pxx = cx + Math.cos(a) * rx * r, pyy = cy + Math.sin(a) * ry * r; k ? x.lineTo(pxx, pyy) : x.moveTo(pxx, pyy); }
  x.lineTo(16, -5); x.lineTo(-6, -6); x.closePath(); x.fill(); x.stroke();
  // lighter spike strokes for texture
  x.strokeStyle = 'rgba(255,235,200,.45)'; x.lineWidth = 1.6;
  for (let k = 0; k < 7; k++) { const a = lerp(a0 + .25, a1 - .3, k / 6); x.beginPath();
    x.moveTo(cx + Math.cos(a) * rx * .45, cy + Math.sin(a) * ry * .45); x.lineTo(cx + Math.cos(a) * rx * .8, cy + Math.sin(a) * ry * .8); x.stroke(); }
  // accents on the spikes
  if (H0.leaf) leafShape(12, -36, 9, 4.5, -.5, H0.leaf);
  if (H0.leaf2) leafShape(24, -30, 8, 4, .5, H0.leaf2);
  if (H0.apple) { circ(12, -38, 7, '#e63946', INK, 2); x.strokeStyle = '#5a3e2b'; x.lineWidth = 2; x.beginPath(); x.moveTo(12, -44); x.lineTo(13, -48); x.stroke();
    leafShape(17, -47, 4.5, 2.2, -.4, '#40c057', false); circ(9, -40, 1.8, 'rgba(255,255,255,.6)'); }
  // head
  x.fillStyle = '#f0d2a6'; x.strokeStyle = INK; x.lineWidth = 2.5;
  x.beginPath(); x.moveTo(-8, -22); x.quadraticCurveTo(-24, -24, -38, -10); x.quadraticCurveTo(-26, -1, -6, -4); x.quadraticCurveTo(-2, -13, -8, -22); x.closePath(); x.fill(); x.stroke();
  circ(-39, -10, 3.6, INK); circ(-40, -11.2, 1.1, 'rgba(255,255,255,.7)');               // nose
  circ(-9, -22, 4.2, '#e8bf8c', INK, 2);                                               // ear
  x.fillStyle = 'rgba(255,120,130,.45)'; x.beginPath(); x.arc(-16, -9, 3.2, 0, 7); x.fill(); // cheek
  // eye
  const sl = o.sleep || 0, blink = (t + i * .7) % 4.3 > 4.15;
  if (sl > .5 || blink) { x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.arc(-21, -15.5, 2.8, .2, Math.PI - .2); x.stroke(); }
  else { circ(-21, -15, 2.9, INK); circ(-20.2, -16, 1, '#fff'); }
  // mouth / yawn
  const yw = o.yawn || 0;
  if (yw > .05) { x.fillStyle = '#9c2f45'; x.strokeStyle = INK; x.lineWidth = 1.6; x.beginPath(); x.ellipse(-29, -6, 3 + yw * 1.5, 1.5 + yw * 4, 0, 0, 7); x.fill(); x.stroke(); }
  else { x.strokeStyle = INK; x.lineWidth = 1.6; x.beginPath(); x.arc(-29, -8, 3, .3, Math.PI - .5); x.stroke(); }
  // scarf / bow
  if (H0.scarf) { x.save(); x.translate(-7, -12); x.rotate(.18); x.fillStyle = H0.scarf; x.strokeStyle = INK; x.lineWidth = 2;
    rr(-4.5, -11, 9, 21, 4); x.fill(); x.stroke(); rr(-1, 6, 7, 11, 3); x.fill(); x.stroke();
    x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(-3, -4); x.lineTo(3, -4); x.moveTo(-3, 2); x.lineTo(3, 2); x.stroke(); x.restore(); }
  if (H0.bow) { const bx0 = -13, by0 = -26; x.fillStyle = H0.bow; x.strokeStyle = INK; x.lineWidth = 1.6;
    x.beginPath(); x.moveTo(bx0, by0); x.lineTo(bx0 - 8, by0 - 5); x.lineTo(bx0 - 8, by0 + 4); x.closePath(); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(bx0, by0); x.lineTo(bx0 + 8, by0 - 5); x.lineTo(bx0 + 8, by0 + 4); x.closePath(); x.fill(); x.stroke(); circ(bx0, by0, 2.6, H0.bow, INK, 1.5); }
  x.restore();
}
// cosy leaf blanket over a sleeping hedgehog (covers feet and the lower body; nose and spikes stay visible)
function blanket(px, gy, s, i, k = 1) {
  if (k <= 0) return;
  const cols = ['#e98a2e', '#c8641e', '#ffb347', '#d94f2b', '#f2c14e'];
  x.save(); x.translate(px, gy); x.scale(s, s);
  for (let j = 0; j < 8; j++) { const lx = -20 + j * 7.5, ly = -5 + (j % 2) * 3 - Math.sin(j * 1.3) * 2, kk = ease(clamp(k * 1.6 - j * .08));
    if (kk > 0) leafShape(lx, ly + (1 - kk) * 8, 10 * kk, 5.5 * kk, (hash(i * 11 + j) - .5) * 1.4, cols[(i + j) % 5]); }
  x.restore();
}

// ---------- scenery ----------
function skyPaint(t, dusk) {
  const g = x.createLinearGradient(0, 0, 0, GR);
  g.addColorStop(0, mix('#6fb8e8', '#33407a', dusk)); g.addColorStop(.6, mix('#bfe0f2', '#c47a8a', dusk)); g.addColorStop(1, mix('#ffe1a3', '#ffb070', dusk));
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // low golden sun top-left (sinks at dusk)
  const sy = 128 + dusk * 210;
  circ(70, sy, 64, `rgba(255,214,120,${.35 * (1 - dusk * .5)})`); circ(70, sy, 40, mix('#ffd23f', '#ff8a4c', dusk));
  // first stars at dusk
  if (dusk > .55) for (let i = 0; i < 22; i++) { const tw = .5 + .5 * Math.sin(t * 2.2 + i * 1.7), a = clamp((dusk - .55) / .4) * tw;
    const sx0 = 120 + hash(i + 40) * 820, sy0 = 100 + hash(i + 70) * 150; x.fillStyle = `rgba(255,250,220,${a})`; x.fillRect(sx0, sy0, 2.5, 2.5); }
  // slow soft clouds
  for (let i = 0; i < 3; i++) { const span = W + 300, cx = ((hash(i + 21) * span + t * 5) % span) - 150, cy = 150 + i * 40 + hash(i) * 30;
    x.save(); x.globalAlpha = .75 - dusk * .35; T.cloud(cx, cy, .6 + hash(i + 2) * .3); x.restore(); }
}
// a row of forest trees at the back (the forest edge)
function forestEdge(dusk) {
  const cols = ['#3f8a4e', '#4f9a55', '#c8862e', '#a85a2a', '#d9a02e', '#367a45'];
  for (let k = 0; k < 19; k++) { const px = -30 + k * 56 + hash(k + 3) * 26, h = 100 + hash(k + 8) * 80, col = cols[Math.floor(hash(k + 5) * 6)];
    x.fillStyle = mix('#6b4a32', '#3a2a30', dusk * .6); x.fillRect(px - 5, GR - 30 - h * .25, 10, h * .25 + 10);
    x.fillStyle = mix(col, '#2c3358', dusk * .45);
    if (hash(k + 1) < .35) { x.beginPath(); x.moveTo(px - 30, GR - 24); x.lineTo(px, GR - 24 - h); x.lineTo(px + 30, GR - 24); x.closePath(); x.fill(); }
    else { x.beginPath(); const r = h * .32; x.arc(px, GR - 30 - h * .55, r, 0, 7); x.arc(px - r * .6, GR - 30 - h * .3, r * .8, 0, 7); x.arc(px + r * .6, GR - 30 - h * .3, r * .8, 0, 7); x.fill(); } }
  x.fillStyle = mix('#6aa84f', '#3c5a48', dusk * .5); x.fillRect(0, GR - 26, W, 30);
}
function bigTree(t, dusk) {
  x.save(); x.lineJoin = 'round';
  x.fillStyle = mix('#7b5034', '#4a3430', dusk * .5); x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(TREE - 34, GR); x.quadraticCurveTo(TREE - 20, GR - 120, TREE - 16, GR - 228); x.lineTo(TREE + 18, GR - 228); x.quadraticCurveTo(TREE + 22, GR - 120, TREE + 38, GR); x.closePath(); x.fill(); x.stroke();
  x.beginPath(); x.moveTo(TREE + 10, GR - 190); x.quadraticCurveTo(TREE + 60, GR - 210, TREE + 96, GR - 236); x.lineTo(TREE + 100, GR - 226); x.quadraticCurveTo(TREE + 60, GR - 196, TREE + 14, GR - 172); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = 'rgba(40,20,10,.35)'; x.lineWidth = 2; [[-8, -60, -40], [10, -110, -86], [-4, -160, -136]].forEach(([dx, a, b]) => { x.beginPath(); x.moveTo(TREE + dx, GR + a); x.quadraticCurveTo(TREE + dx + 4, GR + (a + b) / 2, TREE + dx, GR + b); x.stroke(); });
  const sw = Math.sin(t * .8) * 2;
  [['#c8641e', 8], ['#e98a2e', 0]].forEach(([col, g]) => { x.fillStyle = mix(col, '#5a3a4a', dusk * .45); x.beginPath();
    [[-100, -236, 56], [-20, -272, 70], [70, -256, 62], [130, -226, 44], [-140, -204, 40], [-50, -214, 56], [30, -212, 58]].forEach(([a, b, r]) => { x.moveTo(TREE + a + sw + r + g, GR + b); x.arc(TREE + a + sw, GR + b, r + g, 0, 7); }); x.fill(); });
  [[-70, -264, '#ffd23f'], [20, -292, '#d94f2b'], [90, -246, '#ffd23f'], [-20, -226, '#d94f2b'], [-120, -212, '#ffd23f'], [50, -274, '#f2c14e']].forEach(([a, b, c]) => leafShape(TREE + a + sw, GR + b, 9, 5, .5, mix(c, '#6a4a5a', dusk * .4), false));
  x.restore();
}
function pileBase(dusk) {
  const [cx, by, rx, ry] = PILE;
  x.fillStyle = mix('#b8561c', '#6a3a3a', dusk * .4); x.beginPath(); x.ellipse(cx, by, rx, ry, 0, Math.PI, 0); x.closePath(); x.fill();
  const cols = ['#e98a2e', '#c8641e', '#ffb347', '#d94f2b', '#f2c14e', '#a8551f'];
  for (let k = 0; k < 150; k++) { const a = Math.PI + hash(k + 1) * Math.PI, rr0 = Math.sqrt(hash(k + 7)) * .98;
    const lx = cx + Math.cos(a) * rx * rr0, ly = by + Math.sin(a) * ry * rr0;
    leafShape(lx, ly, 10 + hash(k + 3) * 4, 5 + hash(k + 4) * 2, hash(k + 9) * 6, mix(cols[k % 6], '#5a3a4a', dusk * .35)); }
}
function hedge(t, shake = 0, dusk = 0) {
  const sh = Math.sin(t * 40) * shake * 2.5;
  x.save(); x.translate(sh, 0);
  const g1 = mix('#2f7a3e', '#1f3f3a', dusk * .5), g2 = mix('#3f9a4e', '#2a4f44', dusk * .5);
  x.fillStyle = g1; x.beginPath(); x.moveTo(HEDGE + 6, GR + 2);
  [[HEDGE + 4, GR - 40, 26], [HEDGE + 22, GR - 76, 30], [HEDGE + 70, GR - 92, 34], [HEDGE + 124, GR - 96, 34], [HEDGE + 178, GR - 90, 34], [HEDGE + 220, GR - 84, 30]].forEach(([a, b, r]) => { x.moveTo(a + r, b); x.arc(a, b, r, 0, 7); });
  x.rect(HEDGE + 2, GR - 86, 260, 90); x.fill();
  x.fillStyle = g2; x.beginPath();
  [[HEDGE + 26, GR - 80, 20], [HEDGE + 80, GR - 96, 22], [HEDGE + 140, GR - 100, 22], [HEDGE + 196, GR - 92, 20], [HEDGE + 50, GR - 40, 18], [HEDGE + 120, GR - 50, 20], [HEDGE + 180, GR - 36, 18]].forEach(([a, b, r]) => { x.moveTo(a + r, b); x.arc(a, b, r, 0, 7); }); x.fill();
  for (let k = 0; k < 14; k++) circ(HEDGE + 20 + hash(k + 50) * 170, GR - 20 - hash(k + 60) * 80, 3.2, mix('#d62839', '#6a2a3a', dusk * .4));
  // dark opening at the bottom where the hedgehogs come out
  x.fillStyle = 'rgba(20,40,25,.55)'; x.beginPath(); x.ellipse(HEDGE + 40, GR - 6, 26, 14, 0, Math.PI, 0); x.fill();
  x.restore();
}
function road(t, dusk) {
  x.fillStyle = '#4a5466'; x.fillRect(0, T.ROAD, W, 70);
  x.fillStyle = '#ffffff'; for (let i = 0; i < W / 80 + 1; i++) x.fillRect(i * 80, T.ROAD + 33, 44, 5);
  x.fillStyle = '#3e9a52'; x.fillRect(0, T.ROAD + 70, W, H - T.ROAD - 70);
  for (let k = 0; k < 22; k++) { const px = k * 46 + hash(k + 4) * 20, py = T.ROAD + 80 + hash(k) * 18;
    if (k % 3 === 0) leafShape(px, py, 7, 3.5, hash(k + 9) * 6, ['#e98a2e', '#c8641e', '#ffd166'][k % 3], false);
    else { x.fillStyle = ['#ff7a45', '#ffd23f', '#ffffff', '#ff9ec4'][Math.floor(hash(k + 4) * 4)]; x.beginPath(); x.arc(px, py, 4, 0, 7); x.fill(); } }
}
function scene(t, o = {}) {
  const dusk = o.dusk || 0;
  skyPaint(t, dusk);
  // soft far hills
  x.fillStyle = mix('#9fd09a', '#5a6a8a', dusk * .6); x.beginPath(); x.moveTo(0, H);
  for (let i = 0; i <= W; i += 8) x.lineTo(i, 300 - 26 * (Math.sin(i * .006 + 1) * .6 + Math.sin(i * .014 + 2) * .3)); x.lineTo(W, H); x.closePath(); x.fill();
  forestEdge(dusk); bigTree(t, dusk);
  const b = o.breathe || 0;
  x.save(); x.translate(PILE[0], PILE[1]); x.scale(1 + b * .3, 1 + b); x.translate(-PILE[0], -PILE[1]);
  pileBase(dusk);
  sleepers(o.n || 0, t, o.sinkK, o.cur);
  x.restore();
  if (o.walker) o.walker();
  hedge(t, o.shake || 0, dusk);
  road(t, dusk);
  if (dusk > 0) { x.fillStyle = `rgba(40,30,80,${dusk * .2})`; x.fillRect(0, 0, W, H); }
}
// sleeping hedgehogs in the pile; the newest (index cur) may still be sinking in (sinkK 0..1)
function sleepers(n, t, sinkK = 1, cur = -1) {
  const idx = Array.from({ length: n }, (_, i) => i).sort((a, b) => SLOTS[a][1] - SLOTS[b][1]);
  idx.forEach(i => { const [sx0, sy0] = SLOTS[i], s = HOGS[i].s * HS * .9, k = i === cur ? sinkK : 1;
    hog(sx0, sy0 + 3 * k, s, t, i, { sleep: k > .3 ? 1 : 0, breathe: Math.sin(t * 1.7 + i) * .02 * k });
    blanket(sx0, sy0 + 2, s, i, k); });
}
function tray(n, glow = 0, t = 0) {
  const w = 640, x0 = W / 2 - w / 2;
  x.save(); x.fillStyle = 'rgba(255,255,255,.88)'; x.strokeStyle = INK; x.lineWidth = 4; rr(x0, 22, w, 64, 30); x.fill(); x.stroke();
  for (let i = 0; i < 10; i++) { const cx = x0 + 44 + i * 61, cy = 54;
    if (i < n) { if (i === n - 1 && glow > 0) circ(cx, cy, 27, `rgba(255,210,63,${.6 * glow})`); hog(cx + 3, cy + 16, .6, t, i, { sleep: 1 }); }
    else { x.setLineDash([5, 5]); circ(cx, cy, 20, null, 'rgba(29,53,87,.35)', 3); x.setLineDash([]); } }
  x.restore();
}
function truck(t, o = {}) { return T.truck(Object.assign({ t, dist: o.dist || 0, moving: false, bx: BX, happy: true }, o)); }
// walking hedgehog i at time w inside its segment -> [x, y, step, yawn]
function walkPos(i, w) {
  const [ex, ey] = SLOTS[i], foot = [PILE[0] + PILE[2] - 6, GR];
  if (w < CLIMB0) { const k = clamp(w / CLIMB0); return [lerp(START[0], foot[0], k), GR, w * 9, 0]; }
  if (w < ATTOP) { const k = ease((w - CLIMB0) / (ATTOP - CLIMB0)); return [lerp(foot[0], ex, k), lerp(GR, ey, k) - Math.sin(k * Math.PI) * 26, w * 9, 0]; }
  const yk = win(w, ATTOP + .05, LAND - .05, .25);
  return [ex, ey, undefined, yk];
}

const COUNT_D = 10 * SEG + 1;
const countSfx = [];
for (let i = 0; i < 10; i++) {
  const s = i * SEG;
  countSfx.push([s + .1, 'rustle:0.7', .3, .6], [s + .9, 'tiptoe', .25, .4], [s + 1.7, 'tiptoe', .22, .1], [s + ATTOP + .05, 'yawn', .16, 0],
    [s + LAND, `chime:${NOTES[i]}`, .6], [s + LAND + .05, 'rustle:0.5', .25, 0]);
  if (i % 3 === 2) countSfx.push([s + 5.4, 'snore', .18, .1]);
}
const COUNT_SAYS = [['toet', 'Hello, little hedgehog!', .3, 2.9], ['toet', 'Here comes one more!', 2 * SEG + .3, 2 * SEG + 2.9],
  ['toet', 'Shh... sleep tight!', 4 * SEG + 3.4, 4 * SEG + 6.2], ['toet', 'Another sleepy one!', 6 * SEG + .3, 6 * SEG + 2.9],
  ['toet', 'A little apple! Yum!', 8 * SEG + .4, 8 * SEG + 2.9], ['toet', 'The last one!', 9 * SEG + .3, 9 * SEG + 2.9]].map(a => a.concat([292, 228, 26]));

St.episode({
  title: ['10 Sleepy Hedgehogs', 64], sub: 'Count with Little Truck Toet', accent: '#c8641e', cardBg: '#fff4e6',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'hedgehogs', shift: -2 },
  shots: [
    // 1 – Toet drives in and parks by the big leaf pile under the tree, next to the hedge
    { d: 14, draw: (u, c) => {
        const k = ease(clamp((u - 1.2) / 5)), bx = lerp(-330, BX, k), mv = u > 1.2 && u < 6.2;
        scene(c.t, { shake: win(u, 11.8, 13.2, .2) });
        truck(c.t, { bx, moving: mv, dist: k * 560, mouth: c.talk('toet') });
        if (u > 11.0) tray(0, 0, c.t);
      },
      says: [['toet', 'What a cosy leaf pile!', 7.0, 10.4, 292, 228, 28], ['toet', "Who's sleepy? Let's count!", 10.7, 13.7, 292, 228, 28]],
      sfx: [[6.6, 'honk', .4], [11.8, 'rustle:1.2', .35, .6]] },

    // 2 – counting: hedgehogs waddle out of the hedge, climb the pile, yawn and snuggle in
    { d: COUNT_D, draw: (u, c) => {
        const cur = Math.floor(u / SEG), v = u - cur * SEG, i = Math.min(cur, 9), w = cur > 9 ? SEG : v;
        const landed = cur > 9 ? 10 : i + (w >= LAND ? 1 : 0);
        const sinkK = cur <= 9 && w >= LAND ? ease(clamp((w - LAND) / .6)) : 1;
        scene(c.t, { n: landed, sinkK, cur: cur <= 9 ? i : -1, shake: cur <= 9 && w < OUT ? 1 : 0, walker: () => {
          if (cur <= 9 && w < LAND) { const [px, py, step, yw] = walkPos(i, w); hog(px, py, HOGS[i].s * HS * .9, c.t, i, { step, yawn: yw }); }
          if (cur <= 9 && w >= LAND && w < LAND + .9) { const [a, b] = SLOTS[i]; C.sparkles(a - 4, b - 26, c.t, 8, 40); }
        } });
        const wow = w >= LAND && w < LAND + 1.0 ? .5 : 0;
        truck(c.t, { mouth: Math.max(c.talk('toet'), wow) });
        if (!TB) tray(landed, cur <= 9 && w >= LAND ? clamp(1 - (w - LAND) / 4) : 0, c.t);
        if (cur <= 9) { const kk = win(w, LAND, SEG - .5, .3), nx = TB ? 826 : 812, ny = TB ? 232 : 176;
          C.bigText(String(i + 1), nx, ny, kk, 120, NCOL[i]); C.bigText(NUM[i], nx, ny + 82, kk, 44, '#ffffff'); }
      },
      says: TB ? [] : COUNT_SAYS, sfx: countSfx },

    // 3 – TEN sleepy hedgehogs!
    { d: 8, draw: (u, c) => {
        scene(c.t, { n: 10 });
        truck(c.t, { mouth: c.talk('toet'), hop: u < 1 ? Math.abs(Math.sin(u * 6)) * 5 : 0 });
        tray(10, clamp(1 - u / 3), c.t); C.sparkles(PILE[0], 392, c.t, 12, 170);
      },
      says: [['toet', 'Ten sleepy hedgehogs!', 1.0, 4.4, 292, 228, 28], ['toet', 'Shh...', 4.8, 7.4, 292, 228, 28]],
      sfx: [[.4, 'tada', .4], [5.0, 'snore', .25, .1]] },

    // 4 – recap: count 1..10 again
    { d: 17, draw: (u, c) => {
        scene(c.t, { n: 10 });
        truck(c.t);
        x.fillStyle = 'rgba(255,246,230,.9)'; x.fillRect(0, 0, W, 540);
        C.bigText("Let's count again!", W / 2, 84, win(u, .4, 16.6, .4), 54, '#c8641e');
        for (let i = 0; i < 10; i++) { const t0 = 2 + i * 1.25, k = clamp((u - t0) / .35), on = u >= t0 && u < t0 + 1.25;
          const cx = 120 + (i % 5) * 180, cy = 222 + Math.floor(i / 5) * 160;
          if (k <= 0) continue;
          if (on) circ(cx, cy - 26, 50, 'rgba(255,210,63,.45)');
          x.save(); x.globalAlpha = k; hog(cx + 4, cy, 1.5 * (.5 + .5 * ease(k)) * (on ? 1.08 : 1), c.t, i); x.restore();
          C.bigText(String(i + 1), cx, cy + 40, k, 50, NCOL[i]); }
        C.bigText('Well done!', W / 2, 504, win(u, 14.6, 16.8, .3), 40, '#ffd23f');
      },
      sfx: Array.from({ length: 10 }, (_, i) => [2 + i * 1.25, `chime:${NOTES[i]}`, .55]).concat([[14.6, 'cheer', .35]]) },

    // 5 – soft dusk: the leaf pile breathes with tiny snores; hedgehogs sleep all winter. Good night! Toet quietly rolls away.
    { d: 18, draw: (u, c) => {
        const dusk = ease(clamp((u - .3) / 9)) * .85, b = Math.sin(c.t * 1.6) * .03;
        scene(c.t, { n: 10, dusk, breathe: b });
        const dk = ease(clamp((u - 9.4) / 3.0));   // Toet quietly rolls away before the subscribe pill appears
        truck(c.t, { bx: lerp(BX, 1180, dk), moving: u > 9.4 && dk < 1, dist: dk * 1100, mouth: c.talk('toet') });
        x.fillStyle = `rgba(40,30,80,${dusk * .16})`; x.fillRect(0, 0, W, H);
        // floating Zzz from the pile
        for (let k = 0; k < 3; k++) { const ph = ((u - 1.5 - k * 1.2) % 3.6 + 3.6) % 3.6; if (u < 1.5 + k * 1.2) continue;
          const zk = ph / 3.6, zx = 580 + k * 26 + zk * 70 + Math.sin(ph * 2) * 6, zy = 330 - zk * 110;
          x.save(); x.globalAlpha = clamp(Math.sin(zk * Math.PI) * 1.5); C.bigText('Z', zx, zy, 1, 34 + zk * 22, '#d8e6ff'); x.restore(); }
      },
      says: [['toet', 'Hedgehogs sleep all winter long!', 1.2, 5.4, 292, 228, 26], ['toet', 'Good night, hedgehogs!', 5.6, 9.2, 292, 228, 28]],
      sfx: [[1.4, 'snore', .3, .1], [4.4, 'snore', .28, .15], [7.6, 'snore', .26, .1], [10.8, 'snore', .24, .1], [13.6, 'snore', .2, .1], [5.6, 'twinkle:A#5', .3]] },
  ],
});
