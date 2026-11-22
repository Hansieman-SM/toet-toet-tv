// Learning series – "Can You Find It?" #3: Forest Animals with Little Truck Toet (autumn woodland).
// Toet parks on a forest path next to three hiding places: a pile of autumn leaves, a hollow log and a round berry bush.
// Per round (13 s) three forest friends hide behind them – only their ears (or spikes / tail / feather tufts) peek out. The animal word
// appears at the top, Toet asks "Can you find the BUNNY?", a quiet 3-dot pause (one dot per second) so children can look and point,
// then the right friend hops up out of its hiding place with a glow and Toet names the clue: "Yes! Long ears – it's the bunny!".
// Animals: bunny (long ears), squirrel (bushy tail), hedgehog (prickly spikes), owl (feather tufts, hoo-hoo), fox (pointy ears),
// mouse (round ears). Recap of the six friends, then everybody comes out to wave and Toet drives off.
// All animals are new, original drawings. New music: forestfind_long (accordion lead, harpsichord broken chords, round triangle-wave bass,
// soft brush + wood-click percussion; gentle tiptoe swing in D major).
const C = require('../lib/common'), T = require('../lib/toet');
const St = require('../lib/story');
const { x, W, H, clamp, ease, lerp, win, rr, circ, ell, hash, INK } = C;

const BX = 92;                                       // Toet parked here (truck bx); cab front ~ BX + 222
const SEG = 13, Q0 = .6, Q1 = 4.1, D0 = 4.4, ANS = 7.6, END = 12.4;
const HX = [470, 650, 838], HY = 418;                 // hiding places (centre x, ground y)
const PEEK = 22, PK = { owl: 0, mouse: 16, hedgehog: 16 }, HIDE = 96, UP = -66;                  // animal y-offsets: peeking / fully hidden / standing on top
const TB = !!process.env.THUMBBG;
const SAYX = 280, SAYY = 222, WORD_Y = 62, DOTS = [650, 176];

// ---------- original forest friends (origin = feet centre, ~120 px tall, facing the viewer) ----------
const blinkAt = (t, off = 0) => (t + off) % 3.9 > 3.76;
function eyes2(dx, ey, r, t, off) {
  [-1, 1].forEach(s => { if (blinkAt(t, off)) { x.fillStyle = INK; x.fillRect(s * dx - r, ey - 1.5, r * 2, 3); }
    else { circ(s * dx, ey, r, INK); circ(s * dx + r * .3, ey - r * .35, r * .38, '#fff'); } });
}
const cheeks = (dx, cy) => { circ(-dx, cy, 5, 'rgba(255,110,130,.45)'); circ(dx, cy, 5, 'rgba(255,110,130,.45)'); };
const smileAt = (cy, r = 7) => { x.beginPath(); x.arc(0, cy, r, .25, Math.PI - .25); x.strokeStyle = INK; x.lineWidth = 2.5; x.lineCap = 'round'; x.stroke(); };
const S = (lw = 3) => { x.strokeStyle = INK; x.lineWidth = lw; x.lineJoin = 'round'; x.lineCap = 'round'; };
const A = {
  bunny(t, o) {
    const W1 = '#f4efe8', P = '#ffc2d1', wig = Math.sin(t * 3 + 1) * .06;
    [-1, 1].forEach(s => { x.save(); x.translate(s * 13, -88); x.rotate(s * (.12 + wig));
      x.beginPath(); x.ellipse(0, -30, 11, 34, 0, 0, 7); x.fillStyle = W1; x.fill(); S(); x.stroke();
      x.beginPath(); x.ellipse(0, -28, 5, 24, 0, 0, 7); x.fillStyle = P; x.fill(); x.restore(); });
    ell(0, -34, 30, 34, W1, INK, 3); ell(0, -28, 17, 20, '#ffffff');
    ell(-13, -2, 12, 6, W1, INK, 2.5); ell(13, -2, 12, 6, W1, INK, 2.5);
    circ(0, -80, 28, W1, INK, 3);
    eyes2(10, -84, 4.6, t, o.ph); cheeks(19, -72);
    x.beginPath(); x.moveTo(-4, -76); x.lineTo(4, -76); x.lineTo(0, -71); x.closePath(); x.fillStyle = P; x.fill(); smileAt(-68, 5);
  },
  fox(t, o) {
    const OR = '#ee7b30', CR = '#fff4e4', DK = '#4a2c1a';
    // tail curling round the side
    x.save(); x.translate(26, -14); x.rotate(Math.sin(t * 2.2) * .1); x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(40, 0, 52, -40, 34, -64); x.bezierCurveTo(24, -40, 16, -20, -2, -14); x.closePath(); x.fillStyle = OR; x.fill(); S(); x.stroke();
    x.beginPath(); x.ellipse(36, -58, 9, 10, .4, 0, 7); x.fillStyle = CR; x.fill(); x.restore();
    ell(0, -32, 28, 32, OR, INK, 3); ell(0, -26, 15, 20, CR);
    ell(-12, -2, 11, 6, DK, INK, 2.5); ell(12, -2, 11, 6, DK, INK, 2.5);
    [-1, 1].forEach(s => { x.beginPath(); x.moveTo(s * 10, -96); x.lineTo(s * 22, -128); x.lineTo(s * 32, -88); x.closePath(); x.fillStyle = OR; x.fill(); S(); x.stroke();
      x.beginPath(); x.moveTo(s * 18, -116); x.lineTo(s * 22, -128); x.lineTo(s * 26, -115); x.closePath(); x.fillStyle = DK; x.fill(); });
    x.beginPath(); x.moveTo(-32, -86); x.quadraticCurveTo(-30, -60, 0, -56); x.quadraticCurveTo(30, -60, 32, -86); x.quadraticCurveTo(0, -112, -32, -86); x.fillStyle = OR; x.fill(); S(); x.stroke();
    x.beginPath(); x.moveTo(-22, -74); x.quadraticCurveTo(0, -84, 22, -74); x.quadraticCurveTo(14, -56, 0, -56); x.quadraticCurveTo(-14, -56, -22, -74); x.fillStyle = CR; x.fill();
    eyes2(11, -86, 4.4, t, o.ph); circ(0, -70, 4.5, INK); smileAt(-64, 5);
  },
  mouse(t, o) {
    const G = '#b8b3c4', P = '#ffc2d1';
    x.save(); x.strokeStyle = INK; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.moveTo(20, -8); x.bezierCurveTo(50, -6, 54, -36, 40, -40 + Math.sin(t * 2.5) * 3); x.stroke(); x.restore();
    ell(0, -28, 24, 28, G, INK, 3); ell(0, -24, 13, 16, '#e7e3ee');
    ell(-11, -2, 10, 5, P, INK, 2.2); ell(11, -2, 10, 5, P, INK, 2.2);
    [-1, 1].forEach(s => { circ(s * 24, -94, 19, G, INK, 3); circ(s * 24, -94, 11, P); });
    circ(0, -72, 24, G, INK, 3);
    eyes2(9, -76, 4.2, t, o.ph); cheeks(16, -64);
    circ(0, -66, 4.2, '#ff8fa8', INK, 1.5); smileAt(-61, 4);
    x.strokeStyle = INK; x.lineWidth = 1.5; [-1, 1].forEach(s => { x.beginPath(); x.moveTo(s * 8, -66); x.lineTo(s * 28, -70); x.moveTo(s * 8, -64); x.lineTo(s * 28, -61); x.stroke(); });
  },
  squirrel(t, o) {
    const RD = '#c4622d', CR = '#ffe5c4';
    // big bushy tail standing up behind (peeks out!)
    x.save(); x.translate(18, -20); x.rotate(Math.sin(t * 2) * .07);
    x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(46, -4, 56, -70, 34, -112); x.bezierCurveTo(20, -134, -10, -126, -4, -100); x.bezierCurveTo(4, -84, 22, -84, 22, -62); x.bezierCurveTo(22, -40, 2, -24, -6, -10); x.closePath(); x.fillStyle = RD; x.fill(); S(); x.stroke();
    x.beginPath(); x.moveTo(6, -14); x.bezierCurveTo(36, -30, 40, -76, 26, -102); x.bezierCurveTo(36, -70, 26, -40, 6, -14); x.fillStyle = 'rgba(255,220,180,.55)'; x.fill(); x.restore();
    ell(-4, -30, 24, 30, RD, INK, 3); ell(-4, -26, 13, 18, CR);
    ell(-15, -2, 10, 5, '#8c4520', INK, 2.2); ell(7, -2, 10, 5, '#8c4520', INK, 2.2);
    [-1, 1].forEach(s => { x.beginPath(); x.moveTo(s * 9 - 4, -90); x.lineTo(s * 16 - 4, -112); x.lineTo(s * 25 - 4, -88); x.closePath(); x.fillStyle = RD; x.fill(); S(2.5); x.stroke();
      x.strokeStyle = '#7a3a18'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(s * 16 - 4, -112); x.lineTo(s * 18 - 4, -120); x.stroke(); });
    circ(-4, -76, 25, RD, INK, 3); ell(-4, -68, 14, 10, CR);
    eyes2(9, -80, 4.4, t, o.ph); x.save(); x.translate(-4, 0); cheeks(17, -68); x.restore();
    circ(-4, -71, 3.6, INK); x.save(); x.translate(-4, 0); smileAt(-64, 4.5); x.restore();
  },
  hedgehog(t, o) {
    const SP = '#7b5537', FC = '#f1d7b6';
    // round spiky back (the spikes peek out over the hiding place)
    x.beginPath(); const n = 15;
    for (let i = 0; i <= n; i++) { const a = Math.PI + i / n * Math.PI, r = i % 2 ? 46 : 62; const px = Math.cos(a) * r, py = -50 + Math.sin(a) * r * 1.0; i ? x.lineTo(px, py) : x.moveTo(px, py); }
    x.lineTo(46, -6); x.lineTo(-46, -6); x.closePath(); x.fillStyle = SP; x.fill(); S(); x.stroke();
    x.strokeStyle = 'rgba(255,230,200,.5)'; x.lineWidth = 2; for (let i = 0; i < 7; i++) { const a = Math.PI + (i + .5) / 7 * Math.PI; x.beginPath(); x.moveTo(Math.cos(a) * 22, -50 + Math.sin(a) * 22); x.lineTo(Math.cos(a) * 40, -50 + Math.sin(a) * 40); x.stroke(); }
    ell(0, -34, 32, 30, FC, INK, 3);
    ell(-13, -2, 10, 5, '#5a3a24', INK, 2.2); ell(13, -2, 10, 5, '#5a3a24', INK, 2.2);
    eyes2(11, -42, 4.4, t, o.ph); cheeks(20, -30); circ(0, -32, 5, INK); smileAt(-27, 5);
  },
  owl(t, o) {
    const BR = '#9a6a45', LT = '#f3e2c4';
    // feather tufts (peek out first)
    [-1, 1].forEach(s => { x.beginPath(); x.moveTo(s * 10, -104); x.quadraticCurveTo(s * 30, -128, s * 34, -136); x.quadraticCurveTo(s * 36, -112, s * 30, -96); x.closePath(); x.fillStyle = BR; x.fill(); S(); x.stroke(); });
    x.beginPath(); x.moveTo(-36, -96); x.quadraticCurveTo(-46, -20, -26, -4); x.lineTo(26, -4); x.quadraticCurveTo(46, -20, 36, -96); x.quadraticCurveTo(0, -120, -36, -96); x.fillStyle = BR; x.fill(); S(); x.stroke();
    ell(0, -36, 24, 28, LT);
    for (let i = 0; i < 3; i++) for (let j = -1; j <= 1; j++) { x.beginPath(); x.arc(j * 12, -50 + i * 13, 5, .3, Math.PI - .3); S(2); x.stroke(); }
    [-1, 1].forEach(s => { circ(s * 15, -84, 15, '#fffaf0', INK, 2.5); });
    if (blinkAt(t, o.ph)) { x.fillStyle = INK; x.fillRect(-23, -85, 16, 3); x.fillRect(7, -85, 16, 3); }
    else { [-1, 1].forEach(s => { circ(s * 15, -84, 7, INK); circ(s * 15 + 2.5, -86.5, 2.5, '#fff'); }); }
    x.beginPath(); x.moveTo(-5, -74); x.lineTo(5, -74); x.lineTo(0, -64); x.closePath(); x.fillStyle = '#f4a300'; x.fill(); S(2); x.stroke();
    [-1, 1].forEach(s => { x.strokeStyle = '#f4a300'; x.lineWidth = 4; x.beginPath(); x.moveTo(s * 10, -6); x.lineTo(s * 10, 0); x.moveTo(s * 4, 0); x.lineTo(s * 16, 0); x.stroke(); });
  },
};
const NAMES = { bunny: 'BUNNY', squirrel: 'SQUIRREL', hedgehog: 'HEDGEHOG', owl: 'OWL', fox: 'FOX', mouse: 'MOUSE' };
const WCOL = { bunny: '#ff8fb1', squirrel: '#e07a3a', hedgehog: '#b07a4a', owl: '#f4a300', fox: '#ff7a1a', mouse: '#9b8fd1' };
// draw an animal; dy = offset below its standing spot, wave arm, glow
function animal(name, px, gy, t, o = {}) {
  x.save(); x.translate(px, gy + (o.dy || 0)); const s = o.s || 1; x.scale(s, s);
  if (o.glow) circ(0, -60, 84, `rgba(255,214,70,${.42 * o.glow})`);
  A[name](t, o);
  if (o.wave) { const w = Math.sin(t * 9) * .45; x.save(); x.translate(24, -46); x.rotate(-1.0 + w); x.strokeStyle = INK; x.lineWidth = 9; x.lineCap = 'round'; x.beginPath(); x.moveTo(0, 0); x.lineTo(22, 0); x.stroke();
    x.strokeStyle = { bunny: '#f4efe8', fox: '#ee7b30', mouse: '#b8b3c4', squirrel: '#c4622d', hedgehog: '#f1d7b6', owl: '#9a6a45' }[name]; x.lineWidth = 5; x.beginPath(); x.moveTo(0, 0); x.lineTo(22, 0); x.stroke(); x.restore(); }
  x.restore();
}

// ---------- hiding places (drawn over the animals) ----------
function leafPile(px, gy, t, shake = 0) {
  const sh = Math.sin(t * 40) * shake * 3;
  x.save(); x.translate(px + sh, gy);
  x.beginPath(); x.moveTo(-88, 4); x.quadraticCurveTo(-84, -60, -30, -70); x.quadraticCurveTo(0, -80, 30, -70); x.quadraticCurveTo(84, -60, 88, 4); x.closePath(); x.fillStyle = '#d9772e'; x.fill(); S(3.5); x.stroke();
  const cols = ['#e63946', '#f4a300', '#ffd166', '#c8641e', '#e98a2e'];
  for (let i = 0; i < 22; i++) { const a = hash(i + 2) * 150 - 75, b = -6 - hash(i + 9) * 56 * (1 - Math.abs(a) / 110);
    x.save(); x.translate(a, b); x.rotate(hash(i + 4) * 6); x.fillStyle = cols[i % 5]; x.beginPath(); x.ellipse(0, 0, 12, 6, 0, 0, 7); x.fill();
    x.strokeStyle = 'rgba(80,30,10,.45)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(-9, 0); x.lineTo(9, 0); x.stroke(); x.restore(); }
  x.restore();
}
function log(px, gy, t, shake = 0) {
  const sh = Math.sin(t * 40) * shake * 3;
  x.save(); x.translate(px + sh, gy);
  x.fillStyle = '#9a6a42'; rr(-82, -66, 150, 66, 30); x.fill(); S(3.5); x.stroke();
  x.strokeStyle = 'rgba(60,35,18,.4)'; x.lineWidth = 2.5; [-50, -14, 22].forEach(a => { x.beginPath(); x.moveTo(a, -54); x.quadraticCurveTo(a + 10, -32, a, -12); x.stroke(); });
  ell(68, -33, 22, 33, '#c89a64', INK, 3.5); ell(68, -33, 13, 20, null, '#9a6a42', 2.5); ell(68, -33, 5, 8, '#9a6a42');
  // little mushroom + moss
  x.fillStyle = '#7fb069'; x.beginPath(); x.ellipse(-30, -64, 26, 7, 0, 0, 7); x.fill();
  x.fillStyle = '#fff3e0'; rr(-60, -18, 8, 18, 3); x.fill(); x.beginPath(); x.arc(-56, -18, 13, Math.PI, 0); x.fillStyle = '#e63946'; x.fill(); S(2); x.stroke(); circ(-60, -24, 2.5, '#fff'); circ(-51, -22, 2, '#fff');
  x.restore();
}
function bush(px, gy, t, shake = 0) {
  const sh = Math.sin(t * 40) * shake * 3;
  x.save(); x.translate(px + sh, gy);
  x.beginPath(); [[-58, -22, 30], [-22, -38, 34], [26, -36, 32], [60, -20, 28], [0, -16, 36]].forEach(([a, b, r]) => { x.moveTo(a + r, b); x.arc(a, b, r, 0, 7); });
  x.fillStyle = '#6f9a4a'; x.fill();
  x.save(); x.clip(); x.fillStyle = '#8bb85c'; x.beginPath(); x.ellipse(-20, -56, 60, 18, 0, 0, 7); x.fill(); x.restore();
  x.beginPath(); [[-58, -22, 30], [-22, -38, 34], [26, -36, 32], [60, -20, 28], [0, -16, 36]].forEach(([a, b, r]) => { x.moveTo(a + r, b); x.arc(a, b, r, 0, 7); }); S(3.5); x.stroke();
  x.fillStyle = '#6f9a4a'; x.fillRect(-88, -12, 176, 12);
  [[-40, -34], [-8, -52], [30, -28], [48, -40], [-60, -16], [10, -14]].forEach(([a, b]) => circ(a, b, 6, '#d62839', INK, 1.8));
  x.restore();
}
const COVERS = [leafPile, log, bush];

// ---------- autumn woodland ----------
function sky(t) {
  const g = x.createLinearGradient(0, 0, 0, 330); g.addColorStop(0, '#9fd3ee'); g.addColorStop(1, '#ffe6c2');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  circ(860, 92, 54, 'rgba(255,224,150,.4)'); circ(860, 92, 36, '#ffd36e');
  for (let i = 0; i < 4; i++) { const cx = ((hash(i + 3) * 1200 + t * (5 + i * 2)) % 1240) - 140, cy = 36 + hash(i + 11) * 70;
    x.fillStyle = 'rgba(255,255,255,.85)'; x.beginPath(); [[0, 0, 17], [21, -9, 22], [44, 0, 17]].forEach(([a, b, r]) => { x.moveTo(cx + a + r, cy + b); x.arc(cx + a, cy + b, r, 0, 7); }); x.fill(); }
}
function treeBlob(px, py, s, col, trunk = '#7b5034') {
  x.save(); x.translate(px, py); x.scale(s, s);
  x.fillStyle = trunk; rr(-8, -60, 16, 62, 4); x.fill();
  x.fillStyle = col; x.beginPath(); [[-26, -78, 30], [0, -104, 36], [26, -80, 30], [0, -70, 30]].forEach(([a, b, r]) => { x.moveTo(a + r, b); x.arc(a, b, r, 0, 7); }); x.fill();
  x.restore();
}
function pine(px, py, s, col) { x.save(); x.translate(px, py); x.scale(s, s); x.fillStyle = '#6b4a30'; x.fillRect(-5, -16, 10, 18);
  x.fillStyle = col; [0, 1, 2].forEach(k => { x.beginPath(); x.moveTo(0, -120 + k * 30); x.lineTo(34 - k * 2 + k * 6, -46 + k * 20); x.lineTo(-34 + k * 2 - k * 6, -46 + k * 20); x.closePath(); x.fill(); }); x.restore(); }
function woods(t) {
  sky(t);
  // far hills + far tree line
  x.fillStyle = '#d7c3d8'; x.beginPath(); x.moveTo(0, 300); for (let i = 0; i <= W; i += 10) x.lineTo(i, 268 + Math.sin(i * .007 + 1) * 16 + Math.sin(i * .02) * 5); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  const far = ['#e9b872', '#d98c5f', '#e7c56a', '#c9905b', '#b5a36a'];
  for (let i = 0; i < 16; i++) treeBlob(i * 64 + hash(i) * 30 - 10, 318, .62 + hash(i + 4) * .2, far[i % 5], '#8a6a52');
  // meadow
  x.fillStyle = '#c9c46e'; x.beginPath(); x.moveTo(0, 326); for (let i = 0; i <= W; i += 10) x.lineTo(i, 322 + Math.sin(i * .012 + 2) * 5); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  // nearer trees at the sides (behind the hiding places)
  pine(360, 360, .9, '#4f7d4a'); treeBlob(950, 372, 1.3, '#e76f51'); treeBlob(250, 350, 1.05, '#f4a300'); pine(980, 380, 1.0, '#3f6e45');
  x.fillStyle = '#b8b45e'; x.beginPath(); x.moveTo(0, 372); for (let i = 0; i <= W; i += 10) x.lineTo(i, 368 + Math.sin(i * .01 + 4) * 6); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  // fallen leaves on the meadow
  for (let i = 0; i < 26; i++) { const lx = (i * 41 + 17) % W, ly = 380 + (hash(i + 5) * 36); x.save(); x.translate(lx, ly); x.rotate(i); x.fillStyle = ['#e98a2e', '#c8641e', '#ffd166', '#e63946'][i % 4]; x.beginPath(); x.ellipse(0, 0, 6, 3.5, 0, 0, 7); x.fill(); x.restore(); }
  // a few leaves falling slowly
  for (let i = 0; i < 7; i++) { const k = ((t * .07 + hash(i + 31)) % 1), lx = hash(i + 13) * W + Math.sin(k * 12 + i) * 24, ly = -10 + k * 420;
    x.save(); x.globalAlpha = Math.sin(Math.PI * k); x.translate(lx, ly); x.rotate(k * 9 + i); x.fillStyle = ['#e98a2e', '#e63946', '#ffd166'][i % 3]; x.beginPath(); x.ellipse(0, 0, 8, 4.5, 0, 0, 7); x.fill(); x.restore(); }
}
function path() {
  x.fillStyle = '#c9a26a'; x.beginPath(); x.moveTo(0, 436); x.quadraticCurveTo(W / 2, 424, W, 440); x.lineTo(W, 492); x.quadraticCurveTo(W / 2, 500, 0, 488); x.closePath(); x.fill();
  x.fillStyle = 'rgba(120,80,40,.25)'; for (let i = 0; i < 14; i++) { x.beginPath(); x.ellipse(i * 74 + 20, 462 + (i % 3) * 8, 8, 3, 0, 0, 7); x.fill(); }
}
function front() {
  x.fillStyle = '#a9a856'; x.fillRect(0, 498, W, 50);
  for (let i = 0; i < 40; i++) { const gx = i * 25 + hash(i) * 10; x.strokeStyle = i % 2 ? '#8f8f45' : '#b9b866'; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.moveTo(gx, 540); x.quadraticCurveTo(gx + 3, 518, gx + 6, 504 + hash(i + 1) * 8); x.stroke(); }
  for (let i = 0; i < 16; i++) { x.save(); x.translate(i * 62 + 20, 520 + (i % 3) * 7); x.rotate(i); x.fillStyle = ['#e98a2e', '#c8641e', '#ffd166'][i % 3]; x.beginPath(); x.ellipse(0, 0, 7, 4, 0, 0, 7); x.fill(); x.restore(); }
}
function truck(t, o = {}) { return T.truck(Object.assign({ t, dist: o.dist || 0, moving: false, bx: BX, happy: true }, o)); }
function scene(t, mid, o = {}) {
  woods(t);
  if (mid) mid();
  path();
  truck(t, o.truck || {});
  front();
}

function dots(n, cx, cy) {
  for (let i = 0; i < 3; i++) { const on = n > i, p = on ? ease(clamp((n - i) * 3)) : 0;
    circ(cx + (i - 1) * 46, cy, 14, 'rgba(255,255,255,.85)', INK, 3); if (on) circ(cx + (i - 1) * 46, cy, 14 * p, INK); }
}
function word(name, k) { if (k > 0) C.bigText(NAMES[name], W / 2 + 60, WORD_Y, k, 62, WCOL[name]); }

// [target, animals behind leaf pile / log / bush, answer index, answer line]
const ROUNDS = [
  ['bunny', ['fox', 'bunny', 'mouse'], 1, "Yes! Long ears – it's the bunny!"],
  ['squirrel', ['squirrel', 'owl', 'hedgehog'], 0, "Yes! A bushy tail – it's the squirrel!"],
  ['hedgehog', ['bunny', 'mouse', 'hedgehog'], 2, "Yes! Prickly spikes – it's the hedgehog!"],
  ['owl', ['hedgehog', 'owl', 'fox'], 1, "Hoo-hoo! Big round eyes – the owl!"],
  ['fox', ['fox', 'squirrel', 'bunny'], 0, "Yes! Pointy ears – it's the fox!"],
  ['mouse', ['owl', 'fox', 'mouse'], 2, "Yes! Round ears – it's the mouse!"],
];
const CHIMES = ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'];
const rSfx = [], rSays = [];
ROUNDS.forEach(([name, , ai, ans], r) => {
  const s = r * SEG;
  [0, 1, 2].forEach(i => rSfx.push([s + .1 + i * .18, 'rustle:0.6', .3]));
  [0, 1, 2].forEach(i => rSfx.push([s + D0 + .2 + i, 'tick', .45]));
  rSfx.push([s + ANS - .05, 'rustle:0.6', .4], [s + ANS + .05, 'boing', .3], [s + ANS + .1, `chime:${CHIMES[r]}`, .6], [s + ANS + .25, 'twinkle', .35]);
  if (name === 'owl') rSfx.push([s + ANS + .4, 'peep', .3]);
  rSays.push(['toet', `Can you find the ${NAMES[name]}?`, s + Q0, s + Q1, SAYX, SAYY, 28]);
  rSays.push(['toet', ans, s + ANS + .3, s + END - .2, SAYX + 40, SAYY, 26]);
});

St.episode({
  title: ['Can You Find It?', 64], sub: 'Forest Animals with Toet', accent: '#d9772e', cardBg: '#fff4e4',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'forestfind', shift: 0 },
  shots: [
    // 1 – Toet drives along the forest path and parks by the three hiding places
    { d: 13, draw: (u, c) => {
        const k = ease(clamp((u - 1.2) / 5)), bx = lerp(-330, BX, k), mv = u > 1.2 && u < 6.2;
        scene(c.t, () => { COVERS.forEach((f, i) => f(HX[i], HY, c.t, u > 9 && u < 10.5 ? .6 : 0)); }, { truck: { bx, moving: mv, dist: k * 560, mouth: c.talk('toet') } });
      },
      says: [['toet', 'Shh… some forest friends are hiding!', 6.6, 9.8, SAYX + 40, SAYY, 28], ['toet', 'Can you find them?', 10.1, 12.8, SAYX, SAYY, 28]],
      sfx: [[6.3, 'honk', .4], [9.1, 'rustle:0.6', .35], [9.6, 'rustle:0.6', .3]] },

    // 2 – six rounds: peek, question, 3-dot pause, answer
    { d: ROUNDS.length * SEG, draw: (u, c) => {
        const r = Math.min(ROUNDS.length - 1, Math.floor(u / SEG)), v = TB ? ANS + 1.6 : u - r * SEG;
        const [name, three, ai] = ROUNDS[r];
        const peekIn = i => ease(clamp((v - .1 - i * .18) / .5)), out = clamp((v - END) / .5);
        const up = ease(clamp((v - ANS) / .45)), back = ease(clamp((v - (END - .3)) / .5));
        const wig = v >= D0 && v < ANS ? Math.sin(c.t * 5) * 2 : 0;
        const goodDy = () => lerp(lerp(PK[name] ?? PEEK, UP, up) - (v > ANS + .45 && v < ANS + 1.6 ? Math.abs(Math.sin((v - ANS - .45) * 5)) * 10 : 0), HIDE, back);
        const hidden = (a, i, dy) => { x.save(); x.beginPath(); x.rect(HX[i] - 130, 0, 260, HY); x.clip(); animal(a, HX[i], HY, c.t, { dy, ph: i }); x.restore(); };
        scene(c.t, () => {
          let top = null;
          three.forEach((a, i) => {
            if (i === ai && v >= ANS) { const dy = goodDy(); if (dy < -40) { top = [a, i, dy]; return; } hidden(a, i, dy); return; }
            hidden(a, i, lerp(lerp(HIDE, PK[a] ?? PEEK, peekIn(i)) + wig * (i % 2 ? 1 : -1), HIDE, out));
          });
          COVERS.forEach((f, i) => f(HX[i], HY, c.t, (v > .1 + i * .18 && v < .7 + i * .18) || (i === ai && v > ANS - .1 && v < ANS + .4) ? 1 : 0));
          if (top) animal(top[0], HX[top[1]], HY, c.t, { dy: top[2], glow: up * (1 - back), wave: v > ANS + .6 && v < END - .4, ph: top[1] });
        }, { truck: { mouth: c.talk('toet'), hop: v >= ANS && v < ANS + .5 ? Math.sin((v - ANS) / .5 * Math.PI) * 8 : 0 } });
        if (!TB && v >= ANS && v < ANS + 1) C.sparkles(HX[ai], HY - 150, c.t, 10, 80);
        if (!TB) word(name, win(v, Q0 - .3, END, .3) * (1 - out));
        if (v >= D0 - .1 && v < ANS + .2) dots(clamp(v - D0, 0, 3), DOTS[0], DOTS[1]);
      },
      says: rSays, sfx: rSfx },

    // 3 – recap: the six forest friends light up one by one
    { d: 16, draw: (u, c) => {
        scene(c.t, () => COVERS.forEach((f, i) => f(HX[i], HY, c.t)));
        x.fillStyle = 'rgba(255,248,236,.92)'; x.fillRect(0, 0, W, H);
        C.bigText("Let's say them again!", W / 2, 66, win(u, .4, 15.6, .4), 50, '#d9772e');
        ROUNDS.forEach(([name], i) => {
          const t0 = 1.6 + i * 1.6, k = clamp((u - t0) / .35), on = u >= t0 && u < t0 + 1.6;
          const cx = 190 + (i % 3) * 290, cy = 232 + Math.floor(i / 3) * 188;
          if (k <= 0) return;
          if (on) circ(cx, cy - 54, 66, 'rgba(255,214,70,.42)');
          const s = (on ? .95 : .85) * (.6 + .4 * ease(k));
          x.save(); x.globalAlpha = k; animal(name, cx, cy, c.t, { s, ph: i }); x.restore();
          C.bigText(NAMES[name], cx, cy + 34, k, 32, WCOL[name]);
        });
        C.bigText('Well done!', W / 2, 508, win(u, 12.4, 15.8, .3), 36, '#ffd23f');
      },
      sfx: ROUNDS.map((_, i) => [1.6 + i * 1.6, `chime:${CHIMES[i]}`, .5]).concat([[12.4, 'cheer', .4]]) },

    // 4 – everybody comes out to wave, Toet drives off
    { d: 11, draw: (u, c) => {
        const k = ease(clamp((u - 3.2) / 3)), bx = lerp(BX, 1150, k);
        const pos = [[HX[0] - 40, 'bunny'], [HX[0] + 44, 'squirrel'], [HX[1] - 30, 'hedgehog'], [HX[1] + 50, 'owl'], [HX[2] - 40, 'fox'], [HX[2] + 46, 'mouse']];
        scene(c.t, () => {
          const upk = ease(clamp((u - .2) / .6));
          COVERS.forEach((f, i) => f(HX[i], HY, c.t, u > .1 && u < .6 ? 1 : 0));
          pos.forEach(([px, a], i) => animal(a, px, HY, c.t, { dy: lerp(40, -60, upk) - (u > .8 && u < 2.4 ? Math.abs(Math.sin(c.t * 5 + i)) * 8 : 0), s: .78, wave: u > 1 && u < 9.5, ph: i }));
        }, { truck: { bx, moving: u > 3.2 && u < 6.2, dist: k * 400, mouth: c.talk('toet') } });
      },
      says: [['toet', 'Bye bye, forest friends!', .7, 3.1, SAYX, SAYY, 28]],
      sfx: [[.15, 'rustle:0.6', .4], [.3, 'pop', .3], [.5, 'cheer', .3], [3.2, 'honk', .45]] },
  ],
});
