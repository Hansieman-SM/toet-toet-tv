// Calm snowy arctic evening under pastel northern lights (sensory). Everything is periodic with P seconds (seamless loop).
// Polar bear mama + cub, penguin family waddling, seal on an ice floe, beluga surfacing, sleeping arctic fox, snowy owl,
// sliding baby penguin, snow buntings, sleepy crescent moon, igloo with a warm glow, gently falling snow.
const C = require('../lib/common');
const { x, W, H, clamp, lerp, hash } = C;
const P = 240, TAU = Math.PI * 2;
const DUR = +(process.env.DUR || P);
const T0 = +(process.env.T0 || 0);
const ph = (t, m = 1, o = 0) => Math.sin(TAU * m * t / P + o);
const frac = v => v - Math.floor(v);
const cross = (t, m, off, pad, dir = 1) => { const k = frac(t / P * m + off); return dir > 0 ? -pad + k * (W + 2 * pad) : W + pad - k * (W + 2 * pad); };
const INKE = '#3f3b63';
const OUTL = 'rgba(150,140,200,.55)';
const edge = (w = 1.6) => { x.strokeStyle = OUTL; x.lineWidth = w; x.stroke(); };
const SEA = 318;   // horizon / water line

function glow(cx, cy, r, col, a) {
  const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0));
  x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
}
// every must divide 240 so the loop stays seamless
function eye(cx, cy, r, t, o = 0, every = 6) {
  const blink = ((t + o * 1.7) % every) < .18;
  if (blink) { x.strokeStyle = INKE; x.lineWidth = r * .45; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r * .8, .2, Math.PI - .2); x.stroke(); return; }
  C.circ(cx, cy, r, INKE); C.circ(cx + r * .35, cy - r * .35, r * .38, '#ffffff');
}
const sleepEye = (cx, cy, r) => { x.strokeStyle = INKE; x.lineWidth = Math.max(1.4, r * .4); x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r, .25, Math.PI - .25); x.stroke(); };
const smile = (cx, cy, r, col = INKE, w = 2) => { x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r, .3, Math.PI - .3); x.stroke(); };
const cheek = (cx, cy, r) => C.circ(cx, cy, r, 'rgba(255,150,180,.42)');
function place(px, py, s, flip, rot = 0) { x.save(); x.translate(px, py); x.rotate(rot); x.scale(flip ? -s : s, s); }

// ---------- sky ----------
function sky(t) {
  const g = x.createLinearGradient(0, 0, 0, SEA);
  g.addColorStop(0, '#8f8cc9'); g.addColorStop(.5, '#c7b3e0'); g.addColorStop(.85, '#f4c9d6'); g.addColorStop(1, '#fde0d2');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // stars
  for (let i = 0; i < 60; i++) {
    const sx = hash(i + 900) * W, sy = hash(i + 960) * 190, tw = .35 + .65 * (ph(t, 10 + i % 13, i) * .5 + .5);
    x.globalAlpha = tw * (1 - sy / 260); C.circ(sx, sy, .8 + hash(i + 7) * 1.3, '#fffaf0');
  }
  x.globalAlpha = 1;
}
function aurora(t) {
  x.save(); x.globalCompositeOperation = 'lighter';
  const R = [['rgba(170,240,210,', 70, 90, 0, 1], ['rgba(225,180,240,', 110, 70, 2, -1], ['rgba(255,190,215,', 50, 55, 4, 1]];
  R.forEach(([col, y0, th, o, d]) => {
    const yt = i => y0 + Math.sin(i * .006 + o + d * TAU * 2 * t / P) * 26 + Math.sin(i * .017 - o + TAU * 3 * t / P) * 9;
    const g = x.createLinearGradient(0, y0 - 40, 0, y0 + th + 40);
    g.addColorStop(0, col + '0)'); g.addColorStop(.35, col + (.10 + .04 * ph(t, 4, o)) + ')'); g.addColorStop(1, col + '0)');
    x.fillStyle = g; x.beginPath();
    for (let i = -20; i <= W + 20; i += 12) { const env = Math.sin(clamp((i + 20) / (W + 40)) * Math.PI); x.lineTo(i, yt(i) - 10 * env); }
    for (let i = W + 20; i >= -20; i -= 12) { const env = Math.sin(clamp((i + 20) / (W + 40)) * Math.PI); x.lineTo(i, yt(i) + th * (.4 + .6 * env) + Math.sin(i * .03 + TAU * 5 * t / P) * 6); }
    x.closePath(); x.fill();
    // soft vertical curtain streaks
    for (let k = 0; k < 26; k++) {
      const sx = hash(k + o * 50) * W, a = .02 + .03 * (ph(t, 6 + k % 5, k) * .5 + .5);
      const gy = yt(sx); const gg = x.createLinearGradient(0, gy, 0, gy + th);
      gg.addColorStop(0, col + a + ')'); gg.addColorStop(1, col + '0)'); x.fillStyle = gg; x.fillRect(sx, gy, 3 + hash(k) * 4, th * .8);
    }
  });
  x.restore();
}
function moon(t) {
  const mx = 130, my = 78;
  glow(mx, my, 110, 'rgba(255,245,220,A)', .45);
  x.save(); x.translate(mx, my); x.rotate(ph(t, 2) * .05);
  x.beginPath(); x.rect(-60, -60, 120, 120); x.arc(15, -9, 28, 0, 7); x.clip('evenodd');
  x.fillStyle = '#fff4d8'; x.beginPath(); x.arc(0, 0, 32, 0, 7); x.fill();
  x.restore();
  x.save(); x.translate(mx, my); x.rotate(ph(t, 2) * .05);
  sleepEye(-17, -2, 4); cheek(-14, 9, 3.5); smile(-12, 12, 4, INKE, 1.5);
  x.restore();
  // sleepy zzz drifting up from the moon
  for (let i = 0; i < 3; i++) {
    const k = frac(t / P * 8 + i / 3); x.globalAlpha = Math.sin(k * Math.PI) * .7; x.fillStyle = '#fff4d8';
    x.font = C.FONT(10 + k * 8); x.fillText('z', mx + 20 + k * 30, my - 30 - k * 40);
  }
  x.globalAlpha = 1;
}
function buntings(t) {
  const bx = cross(t, 1, .3, 120, 1), by = 150 + ph(t, 2, 2) * 14;
  for (let i = 0; i < 4; i++) {
    const gx = bx - i * 28 - (i % 2) * 6, gy = by + (i % 2 ? 10 : -4) + ph(t, 40, i) * 3, fl = ph(t, 200, i * 1.3);
    x.fillStyle = '#fbf7ff'; x.beginPath(); x.ellipse(gx, gy, 6, 4, 0, 0, 7); x.fill();
    C.circ(gx + 5, gy - 2, 3, '#fbf7ff'); C.circ(gx + 6, gy - 2.5, .9, INKE);
    x.fillStyle = '#c9b7dc'; x.beginPath(); x.moveTo(gx - 2, gy); x.lineTo(gx - 6, gy - 9 * fl); x.lineTo(gx + 3, gy); x.fill();
    x.fillStyle = '#f2b98d'; x.beginPath(); x.moveTo(gx + 8, gy - 2); x.lineTo(gx + 11, gy - 1.5); x.lineTo(gx + 8, gy - 1); x.fill();
  }
}

// ---------- landscape ----------
function mountains() {
  x.fillStyle = '#d9cdec'; x.beginPath(); x.moveTo(0, SEA);
  [[0, 262], [70, 220], [150, 258], [250, 196], [350, 252], [420, 232], [500, 266], [600, 214], [700, 250], [790, 204], [880, 248], [960, 226], [960, SEA]].forEach(([a, b]) => x.lineTo(a, b));
  x.fill();
  // snow caps
  x.fillStyle = '#fbf8ff';
  [[70, 220], [250, 196], [600, 214], [790, 204]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a - 22, b + 18); x.lineTo(a, b); x.lineTo(a + 24, b + 19); x.lineTo(a + 10, b + 14); x.lineTo(a, b + 22); x.lineTo(a - 10, b + 13); x.closePath(); x.fill(); });
  x.fillStyle = '#e8def5'; x.beginPath(); x.moveTo(0, SEA);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 290 - Math.sin(i * .011 + 2) * 12 - Math.sin(i * .03) * 4); x.lineTo(W, SEA); x.fill();
}
function sea(t) {
  const g = x.createLinearGradient(0, SEA, 0, 380); g.addColorStop(0, '#c7c9ee'); g.addColorStop(1, '#a9bfe6');
  x.fillStyle = g; x.fillRect(0, SEA, W, 70);
  // moon reflection + shimmer lines
  for (let i = 0; i < 30; i++) {
    const wy = SEA + 4 + hash(i + 500) * 50, wx = hash(i + 540) * W + ph(t, 6, i) * 10, a = .25 + .35 * (ph(t, 15 + i % 7, i) * .5 + .5);
    x.globalAlpha = a; x.fillStyle = '#f6f0ff'; x.fillRect(wx, wy, 12 + hash(i) * 22, 1.6);
  }
  x.globalAlpha = 1;
}
function floe(cx, cy, w, h) {
  x.fillStyle = '#9fb2dc'; x.beginPath(); x.ellipse(cx, cy + 4, w + 4, h * .5, 0, 0, 7); x.fill();
  x.fillStyle = '#f6f6ff'; x.beginPath(); x.moveTo(cx - w, cy); x.quadraticCurveTo(cx - w * .9, cy - h, cx - w * .3, cy - h); x.lineTo(cx + w * .5, cy - h * 1.05);
  x.quadraticCurveTo(cx + w, cy - h * .8, cx + w, cy); x.quadraticCurveTo(cx, cy + h * .45, cx - w, cy); x.fill();
  x.fillStyle = '#dcdcf5'; x.beginPath(); x.moveTo(cx - w, cy); x.quadraticCurveTo(cx, cy + h * .45, cx + w, cy); x.quadraticCurveTo(cx, cy + h * .15, cx - w, cy); x.fill();
}
function ground() {
  const g = x.createLinearGradient(0, 360, 0, H); g.addColorStop(0, '#fbf8ff'); g.addColorStop(1, '#e6e0f4');
  x.fillStyle = g; x.beginPath(); x.moveTo(0, H);
  for (let i = 0; i <= W; i += 8) x.lineTo(i, 372 - Math.sin(i * .007 + 1) * 12 - Math.sin(i * .02) * 5); x.lineTo(W, H); x.fill();
  // soft drift shadows
  x.fillStyle = 'rgba(190,180,225,.35)';
  [[120, 430, 120, 10], [520, 505, 160, 12], [820, 520, 140, 10], [380, 410, 90, 7]].forEach(([a, b, c, d]) => { x.beginPath(); x.ellipse(a, b, c, d, 0, 0, 7); x.fill(); });
  // sparkles in the snow
  for (let i = 0; i < 26; i++) { x.globalAlpha = .5; C.circ(hash(i + 610) * W, 390 + hash(i + 650) * 140, 1.2, '#ffffff'); }
  x.globalAlpha = 1;
}
function snowPine(tx, ty, s) {
  x.save(); x.translate(tx, ty); x.scale(s, s);
  x.fillStyle = '#a99aa8'; x.fillRect(-5, -18, 10, 18);
  for (let i = 0; i < 4; i++) {
    const w = 46 - i * 9, y = -14 - i * 30;
    x.fillStyle = '#9fc2bd'; x.beginPath(); x.moveTo(-w, y); x.lineTo(0, y - 44); x.lineTo(w, y); x.closePath(); x.fill();
    x.fillStyle = '#fbf8ff'; x.beginPath(); x.moveTo(-w + 4, y - 2); x.quadraticCurveTo(-w * .5, y - 12, 0, y - 44); x.quadraticCurveTo(w * .5, y - 12, w - 4, y - 2); x.quadraticCurveTo(w * .4, y - 10, 0, y - 6); x.quadraticCurveTo(-w * .4, y - 10, -w + 4, y - 2); x.fill();
  }
  x.restore();
}
function igloo(t) {
  const cx = 860, cy = 420;
  x.fillStyle = '#f2f0fc'; x.beginPath(); x.arc(cx, cy, 70, Math.PI, 0); x.closePath(); x.fill();
  x.fillStyle = 'rgba(200,190,230,.45)'; x.beginPath(); x.arc(cx, cy, 70, Math.PI * 1.55, 0); x.lineTo(cx, cy); x.closePath(); x.fill();
  x.strokeStyle = 'rgba(170,160,210,.55)'; x.lineWidth = 1.5;
  [18, 36, 52].forEach((h, i) => { const r = Math.sqrt(70 * 70 - h * h); x.beginPath(); x.moveTo(cx - r, cy - h); x.lineTo(cx + r, cy - h); x.stroke();
    for (let j = 0; j < 6; j++) { const bx = cx - r + (j + (i % 2) * .5) * (2 * r / 6); x.beginPath(); x.moveTo(bx, cy - h); x.lineTo(bx, cy - h + 18); x.stroke(); } });
  // tunnel with a warm, softly flickering glow
  x.fillStyle = '#f7f5ff'; x.beginPath(); x.arc(cx - 58, cy, 30, Math.PI, 0); x.closePath(); x.fill();
  const fl = .75 + .12 * ph(t, 48) + .08 * ph(t, 77, 1);
  glow(cx - 58, cy - 10, 60, 'rgba(255,214,160,A)', .35 * fl);
  x.fillStyle = `rgba(255,${200 + 20 * fl | 0},150,1)`; x.beginPath(); x.arc(cx - 58, cy, 18, Math.PI, 0); x.closePath(); x.fill();
  x.fillStyle = 'rgba(255,240,210,.6)'; x.beginPath(); x.arc(cx - 58, cy, 10, Math.PI, 0); x.closePath(); x.fill();
}
function snowman(cx, cy, t) {
  // small friendly snowman beside the pines, with a scarf that flutters
  [[18, 22], [50, 16], [74, 12]].forEach(([d, r]) => { C.circ(cx, cy - d, r, '#fbf8ff'); x.beginPath(); x.arc(cx, cy - d, r, 0, 7); edge(1.3); });
  x.fillStyle = 'rgba(190,180,225,.45)'; x.beginPath(); x.arc(cx, cy - 18, 22, -.3, Math.PI * .6); x.fill();
  eye(cx - 4, cy - 76, 1.8, t, 3, 8); eye(cx + 5, cy - 76, 1.8, t, 3.1, 8);
  x.fillStyle = '#f6b08a'; x.beginPath(); x.moveTo(cx + 1, cy - 73); x.lineTo(cx + 12, cy - 71); x.lineTo(cx + 1, cy - 70); x.fill();
  smile(cx + 1, cy - 70, 4, INKE, 1.3);
  const sw = ph(t, 20) * 4;
  x.fillStyle = '#f3a7bf'; x.fillRect(cx - 13, cy - 64, 26, 6); x.beginPath(); x.moveTo(cx + 6, cy - 60); x.lineTo(cx + 14 + sw, cy - 44); x.lineTo(cx + 8 + sw, cy - 43); x.lineTo(cx + 2, cy - 58); x.fill();
  [[-50], [-40], [-30]].forEach(([d], i) => C.circ(cx, cy + d + 8 + i * 0, 1.8, '#8e86b8'));
  x.strokeStyle = '#a99aa8'; x.lineWidth = 2.5; x.lineCap = 'round';
  x.beginPath(); x.moveTo(cx - 14, cy - 52); x.lineTo(cx - 32, cy - 64 + ph(t, 12) * 3); x.moveTo(cx + 14, cy - 52); x.lineTo(cx + 30, cy - 62); x.stroke();
}

// ---------- animals ----------
function polarBear(px, py, s, t, o) {
  // mama lies down in the snow facing right, slowly breathing; head lifts and lowers, sleepy blinks
  place(px, py, s, false);
  const br = 1 + ph(t, 30, o) * .02, lift = clamp(ph(t, 3, o) * 1.4 + .3, 0, 1);
  const fur = '#fbf8ff', sh = '#e2dcf2';
  x.fillStyle = 'rgba(170,160,215,.35)'; x.beginPath(); x.ellipse(0, 2, 92, 10, 0, 0, 7); x.fill();
  x.save(); x.scale(1, br);
  x.fillStyle = fur; x.beginPath(); x.ellipse(-6, -34, 82, 36, 0, 0, 7); x.fill(); edge();
  x.fillStyle = sh; x.beginPath(); x.ellipse(-6, -14, 76, 14, 0, 0, Math.PI); x.fill();
  C.circ(-82, -40, 9, fur);
  x.restore();
  // back leg + front paws
  x.fillStyle = fur; x.beginPath(); x.ellipse(-56, -10, 26, 12, 0, 0, 7); x.fill();
  x.beginPath(); x.ellipse(60, -6, 26, 9, 0, 0, 7); x.fill(); edge(1.2); x.beginPath(); x.ellipse(40, -4, 24, 8, 0, 0, 7); x.fill(); edge(1.2);
  x.fillStyle = sh; [52, 76].forEach(d => { x.beginPath(); x.ellipse(d, -4, 3, 2, 0, 0, 7); x.fill(); });
  // head
  x.save(); x.translate(66, -36 + (1 - lift) * 16); x.rotate(lerp(.32, -.05, lift));
  C.circ(-16, -24, 9, fur); C.circ(-16, -24, 5, '#f3d4e2'); C.circ(10, -26, 9, fur); C.circ(10, -26, 5, '#f3d4e2');
  x.fillStyle = fur; x.beginPath(); x.ellipse(0, -4, 30, 25, 0, 0, 7); x.fill(); edge();
  x.fillStyle = '#f4f1fd'; x.beginPath(); x.ellipse(24, 4, 18, 13, .1, 0, 7); x.fill();
  C.circ(38, 0, 5, INKE); smile(30, 9, 5, INKE, 1.6);
  if (lift < .35) { sleepEye(2, -8, 4); sleepEye(18, -8, 3.6); } else { eye(2, -8, 3.4, t, o, 6); eye(18, -8, 3.2, t, o + .2, 6); }
  cheek(-6, 4, 5);
  x.restore();
  x.restore();
}
function cub(px, py, s, t, o) {
  // little cub sits up, tilts its head, rolls a snowball between its paws
  place(px, py, s, true);
  const tilt = ph(t, 8, o) * .16, roll = ph(t, 24, o), fur = '#fdfbff', sh = '#e4def3';
  x.fillStyle = 'rgba(170,160,215,.35)'; x.beginPath(); x.ellipse(0, 2, 34, 6, 0, 0, 7); x.fill();
  x.fillStyle = fur; x.beginPath(); x.ellipse(0, -26, 26, 28, 0, 0, 7); x.fill(); edge();
  x.fillStyle = sh; x.beginPath(); x.ellipse(4, -18, 14, 16, 0, 0, 7); x.fill();
  // snowball
  C.circ(18 + roll * 8, -6, 8, '#ffffff'); x.strokeStyle = 'rgba(180,170,220,.6)'; x.lineWidth = 1; x.beginPath(); x.arc(18 + roll * 8, -6, 8, 0, 7); x.stroke();
  x.fillStyle = fur; x.beginPath(); x.ellipse(-12, -3, 11, 6, 0, 0, 7); x.fill(); x.beginPath(); x.ellipse(10 + roll * 6, -4, 10, 6, 0, 0, 7); x.fill();
  x.save(); x.translate(4, -60); x.rotate(tilt);
  C.circ(-14, -16, 7, fur); C.circ(-14, -16, 4, '#f3d4e2'); C.circ(14, -16, 7, fur); C.circ(14, -16, 4, '#f3d4e2');
  C.circ(0, 0, 20, fur); x.beginPath(); x.arc(0, 0, 20, 0, 7); edge();
  x.fillStyle = '#f4f1fd'; x.beginPath(); x.ellipse(4, 7, 10, 8, 0, 0, 7); x.fill();
  C.circ(5, 4, 3.5, INKE); smile(4, 9, 3.5, INKE, 1.4);
  eye(-6, -4, 3, t, o, 5); eye(12, -4, 3, t, o + .2, 5); cheek(-10, 6, 3.6); cheek(16, 6, 3.2);
  x.restore();
  x.restore();
}
function penguin(px, py, s, t, o, chick) {
  const wad = ph(t, 160, o), bob = Math.abs(wad) * 2;
  place(px, py - bob, s, false, wad * .09);
  const dark = '#5f6a94', belly = '#fbf8ff', or = '#f6b98a';
  x.fillStyle = 'rgba(170,160,215,.35)'; x.beginPath(); x.ellipse(0, 2 + bob, 18, 4, 0, 0, 7); x.fill();
  x.fillStyle = or; x.beginPath(); x.ellipse(-7 + wad * 3, 0, 7, 3.5, 0, 0, 7); x.fill(); x.beginPath(); x.ellipse(7 - wad * 3, 0, 7, 3.5, 0, 0, 7); x.fill();
  if (chick) {
    x.fillStyle = '#cfd0e2'; x.beginPath(); x.ellipse(0, -18, 15, 18, 0, 0, 7); x.fill();
    x.fillStyle = '#e9e9f5'; x.beginPath(); x.ellipse(2, -15, 9, 12, 0, 0, 7); x.fill();
    C.circ(2, -40, 12, '#5f6a94'); x.fillStyle = belly; x.beginPath(); x.ellipse(5, -38, 8, 7, 0, 0, 7); x.fill();
    eye(6, -40, 2.2, t, o, 5); cheek(9, -35, 2.2);
    x.fillStyle = INKE; x.beginPath(); x.moveTo(12, -39); x.lineTo(18, -37); x.lineTo(12, -35); x.fill();
    x.fillStyle = '#b9bad3'; x.beginPath(); x.ellipse(-10, -20, 4, 10, .3 + wad * .2, 0, 7); x.fill();
  } else {
    x.fillStyle = dark; x.beginPath(); x.ellipse(0, -30, 20, 31, 0, 0, 7); x.fill();
    x.fillStyle = belly; x.beginPath(); x.ellipse(5, -24, 13, 24, 0, 0, 7); x.fill();
    x.fillStyle = 'rgba(246,185,138,.55)'; x.beginPath(); x.ellipse(10, -48, 6, 4, .3, 0, 7); x.fill();
    x.fillStyle = dark; x.beginPath(); x.ellipse(-14, -28, 5, 16, .25 + wad * .25, 0, 7); x.fill();
    C.circ(2, -60, 15, dark); x.fillStyle = belly; x.beginPath(); x.ellipse(7, -58, 9, 8, 0, 0, 7); x.fill();
    eye(8, -60, 2.6, t, o, 6); cheek(11, -54, 2.6);
    x.fillStyle = or; x.beginPath(); x.moveTo(15, -59); x.lineTo(25, -56); x.lineTo(15, -53); x.fill();
  }
  x.restore();
}
function penguinFamily(t) {
  // waddles slowly from left to right twice per loop
  const k = frac(t / P * 2 + .15), bx = -90 + k * (W + 220);
  penguin(bx, 480, .95, t, 0, false);
  penguin(bx - 42, 484, .9, t, 1.1, true);
  penguin(bx - 74, 486, .8, t, 2.3, true);
}
function slider(t) {
  // a baby penguin slides on its belly down the slope three times per loop: wheee
  const k = frac(t / P * 3 + .55); if (k > .45) return;
  const q = k / .45, sx = lerp(980, 620, q), sy = lerp(398, 440, q);
  place(sx, sy, .85, true, -.15);
  x.fillStyle = 'rgba(255,255,255,.7)'; for (let i = 1; i < 5; i++) C.circ(-22 - i * 8, 4 - i, 3 - i * .4, 'rgba(255,255,255,.8)');
  x.fillStyle = '#cfd0e2'; x.beginPath(); x.ellipse(0, -8, 22, 10, 0, 0, 7); x.fill();
  x.fillStyle = '#e9e9f5'; x.beginPath(); x.ellipse(2, -4, 16, 5, 0, 0, 7); x.fill();
  C.circ(22, -12, 10, '#5f6a94'); x.fillStyle = '#fbf8ff'; x.beginPath(); x.ellipse(25, -10, 6, 6, 0, 0, 7); x.fill();
  eye(26, -13, 2, t, 1, 5); smile(26, -8, 2.5, INKE, 1.1);
  x.fillStyle = INKE; x.beginPath(); x.moveTo(31, -12); x.lineTo(37, -10); x.lineTo(31, -8); x.fill();
  x.fillStyle = '#f6b98a'; x.beginPath(); x.ellipse(-22, -6, 5, 3, 0, 0, 7); x.fill();
  x.fillStyle = '#b9bad3'; x.beginPath(); x.ellipse(2, -16, 10, 3, -.5, 0, 7); x.fill();
  x.restore();
}
function seal(cx, cy, s, t, o) {
  place(cx, cy, s, true);
  const lift = clamp(ph(t, 6, o) * 1.5, 0, 1), fl = ph(t, 36, o);
  const col = '#c3bfd8', lt = '#e3e0f0';
  x.fillStyle = col; x.beginPath(); x.moveTo(-40, -4); x.quadraticCurveTo(-34, -24, 0, -22); x.quadraticCurveTo(20, -22, 26, -10); x.lineTo(26, 0); x.quadraticCurveTo(-10, 4, -40, -4); x.fill();
  x.fillStyle = col; x.beginPath(); x.moveTo(-40, -4); x.lineTo(-56, -14 + fl * 3); x.lineTo(-54, 2 + fl * 2); x.closePath(); x.fill();
  x.fillStyle = lt; x.beginPath(); x.ellipse(-4, -4, 24, 5, 0, 0, 7); x.fill();
  x.save(); x.translate(4, -10); x.rotate(-.5 * lift + fl * .1); x.fillStyle = col; x.beginPath(); x.ellipse(0, 0, 4, 11, .6, 0, 7); x.fill(); x.restore();
  x.save(); x.translate(26, -14 - lift * 8); x.rotate(-lift * .3);
  x.fillStyle = col; x.beginPath(); x.ellipse(0, 0, 15, 13, 0, 0, 7); x.fill();
  x.fillStyle = lt; x.beginPath(); x.ellipse(9, 4, 8, 6, 0, 0, 7); x.fill();
  C.circ(14, 2, 2.6, INKE); eye(2, -3, 3, t, o, 6); eye(10, -4, 2.6, t, o + .1, 6); cheek(4, 5, 2.6);
  x.strokeStyle = 'rgba(80,70,110,.45)'; x.lineWidth = .9; [-1, 1].forEach(d => { x.beginPath(); x.moveTo(12, 5); x.lineTo(22, 4 + d * 3); x.stroke(); });
  x.restore();
  x.restore();
}
function beluga(t) {
  // a beluga pops up for a hello four times per loop, blows a little spout, and dives again
  const k = frac(t / P * 4 + .4); if (k > .3) return;
  const q = k / .3, up = Math.sin(q * Math.PI), bx = 520 + q * 30, by = SEA + 30;
  x.save(); x.beginPath(); x.rect(0, 0, W, by + 1); x.clip();
  x.translate(bx, by + (1 - up) * 34);
  x.fillStyle = '#f7f6ff'; x.beginPath(); x.ellipse(0, 0, 34, 26, 0, Math.PI, 0); x.fill();
  C.circ(-2, -24, 12, '#f7f6ff');
  x.fillStyle = 'rgba(200,195,235,.6)'; x.beginPath(); x.ellipse(-12, -6, 14, 8, 0, 0, 7); x.fill();
  eye(10, -12, 2.8, t, 2, 5); smile(20, -6, 5, INKE, 1.6); cheek(14, -3, 3);
  x.restore();
  // ripples
  x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 1.4;
  for (let r = 0; r < 2; r++) { x.beginPath(); x.ellipse(bx, by, 38 + r * 14 + q * 10, 4 + r * 2, 0, 0, 7); x.stroke(); }
  // spout
  if (q > .3 && q < .75) {
    const s2 = Math.sin((q - .3) / .45 * Math.PI);
    for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * .18; C.circ(bx - 2 + Math.cos(a) * 26 * s2, by - 38 + Math.sin(a) * 30 * s2 - (1 - up) * 20, 2.5, `rgba(255,255,255,${.8 * s2})`); }
  }
}
function arcticFox(cx, cy, s, t, o) {
  // curled up asleep: breathing, an ear twitch now and then, tail tip flick, peeks with one eye once per minute
  place(cx, cy, s, false);
  const br = 1 + ph(t, 28, o) * .03, ear = frac(t / P * 12 + o) < .03 ? .3 : 0, tip = ph(t, 16, o) * .15;
  const peek = frac(t / P * 4 + o); const open = peek > .5 && peek < .56;
  const fur = '#fdfbff', sh = '#e6e1f4';
  x.fillStyle = 'rgba(170,160,215,.35)'; x.beginPath(); x.ellipse(0, 2, 46, 7, 0, 0, 7); x.fill();
  x.save(); x.scale(1, br);
  x.fillStyle = fur; x.beginPath(); x.ellipse(0, -18, 40, 20, 0, 0, 7); x.fill(); edge(1.4);
  x.fillStyle = sh; x.beginPath(); x.ellipse(-4, -8, 34, 8, 0, 0, Math.PI); x.fill();
  x.restore();
  // head resting at the right
  x.save(); x.translate(22, -20);
  x.save(); x.rotate(-ear); x.fillStyle = fur; x.beginPath(); x.moveTo(-6, -12); x.lineTo(-2, -28); x.lineTo(6, -12); x.fill(); x.fillStyle = '#f3d4e2'; x.beginPath(); x.moveTo(-3, -13); x.lineTo(-1, -23); x.lineTo(3, -13); x.fill(); x.restore();
  x.fillStyle = fur; x.beginPath(); x.moveTo(8, -12); x.lineTo(16, -26); x.lineTo(18, -10); x.fill();
  x.fillStyle = fur; x.beginPath(); x.ellipse(4, -2, 18, 13, 0, 0, 7); x.fill(); edge(1.3);
  x.beginPath(); x.ellipse(18, 3, 10, 6, .1, 0, 7); x.fill();
  C.circ(27, 2, 2.8, INKE);
  if (open) eye(6, -4, 2.8, t, 0, 240); else sleepEye(6, -4, 3);
  cheek(8, 4, 3);
  x.restore();
  // tail wrapped over the front, tip flicking
  x.save(); x.translate(-30, -10);
  x.strokeStyle = fur; x.lineCap = 'round'; x.lineWidth = 18;
  x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(10, 14, 40, 10); x.stroke();
  x.save(); x.translate(40, 10); x.rotate(tip); x.fillStyle = '#ffffff'; x.beginPath(); x.ellipse(6, -2, 12, 9, -.2, 0, 7); x.fill(); x.restore();
  x.strokeStyle = 'rgba(200,190,230,.6)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(6, 8); x.quadraticCurveTo(16, 16, 38, 16); x.stroke();
  x.restore();
  // zzz
  for (let i = 0; i < 2; i++) { const k = frac(t / P * 10 + i / 2); x.globalAlpha = Math.sin(k * Math.PI) * .6; x.fillStyle = '#a99ccf'; x.font = C.FONT(9 + k * 6); x.fillText('z', 46 + k * 16, -36 - k * 26); }
  x.globalAlpha = 1;
  x.restore();
}
function snowyOwl(cx, cy, s, t, o) {
  x.save(); x.translate(cx, cy); x.rotate(ph(t, 4, o) * .1); x.scale(s, s);
  x.fillStyle = '#fbf8ff'; x.beginPath(); x.ellipse(0, 4, 16, 20, 0, 0, 7); x.fill(); edge(1.3);
  x.fillStyle = 'rgba(150,140,190,.55)'; [[-6, 6], [4, 10], [-2, 16], [7, 1], [-8, 14]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 2, 0, Math.PI); x.fill(); });
  x.fillStyle = '#fbf8ff'; x.beginPath(); x.ellipse(0, -14, 15, 13, 0, 0, 7); x.fill();
  C.circ(-6, -15, 6.5, '#fff8e8'); C.circ(6, -15, 6.5, '#fff8e8');
  const k = frac(t / P * 15 + o), closed = k > .6 && k < .82;
  if (closed) { sleepEye(-6, -16, 3.5); sleepEye(6, -16, 3.5); } else { eye(-6, -15, 3.4, t, o, 5); eye(6, -15, 3.4, t, o, 5); }
  x.fillStyle = '#c9b7a6'; x.beginPath(); x.moveTo(-2, -10); x.lineTo(2, -10); x.lineTo(0, -6); x.fill();
  x.fillStyle = '#c9b7a6'; x.fillRect(-7, 22, 4, 4); x.fillRect(3, 22, 4, 4);
  x.restore();
}
function hare(t) {
  // white arctic hare hops along the front from right to left, stopping now and then (3x per loop)
  const k = frac(t / P * 3 + .8), bx = W + 60 - k * (W + 120), hop = Math.abs(Math.sin(TAU * t / P * 60)) * 12 * (ph(t, 15) > -.3 ? 1 : 0);
  place(bx, 520 - hop, .85, true);
  const fur = '#fdfbff';
  x.fillStyle = 'rgba(170,160,215,.35)'; x.beginPath(); x.ellipse(0, 2 + hop / .85, 24, 4, 0, 0, 7); x.fill();
  x.fillStyle = fur; x.beginPath(); x.ellipse(-4, -14, 20, 14, -.1, 0, 7); x.fill(); edge(1.3);
  C.circ(-22, -16, 6, '#ffffff');
  x.beginPath(); x.ellipse(-10, -2, 12, 4, 0, 0, 7); x.fill();
  x.save(); x.translate(14, -26);
  x.fillStyle = fur; x.beginPath(); x.ellipse(-4, -16, 4, 13, -.3, 0, 7); x.fill(); edge(1.1); x.beginPath(); x.ellipse(3, -16, 4, 13, .1, 0, 7); x.fill(); edge(1.1);
  x.fillStyle = '#f3d4e2'; x.beginPath(); x.ellipse(3, -16, 1.8, 9, .1, 0, 7); x.fill();
  x.fillStyle = fur; x.beginPath(); x.ellipse(2, 2, 11, 10, 0, 0, 7); x.fill(); edge(1.2);
  C.circ(12, 4, 1.8, '#e88fa6'); eye(5, -1, 2.3, t, 4, 6); cheek(6, 6, 2.4);
  x.restore();
  x.restore();
}
function snow(t, front) {
  const n = front ? 26 : 70;
  for (let i = 0; i < n; i++) {
    const id = i + (front ? 300 : 0), m = 4 + (id % 3);
    const k = frac(hash(id + 13) + t / P * m);
    const py = -10 + k * (front ? 560 : 420);
    const px = frac(hash(id + 37) + t / P * (id % 2 ? 1 : -1)) * (W + 40) - 20 + Math.sin(k * TAU * 2 + id) * 14;
    x.globalAlpha = Math.min(1, k * 10, (1 - k) * 8) * (front ? .95 : .7);
    C.circ(px, py, front ? 2.6 + hash(id) * 1.6 : 1.2 + hash(id) * 1.1, '#ffffff');
  }
  x.globalAlpha = 1;
}

function draw(t0) {
  const lt = t0, t = (t0 + T0) % P;
  sky(t);
  aurora(t);
  moon(t);
  buntings(t);
  mountains();
  sea(t);
  beluga(t);
  const fx = 300 + ph(t, 1, .5) * 50, fy = SEA + 24 + ph(t, 12) * 1.5;
  floe(fx, fy, 70, 12); seal(fx + 6, fy - 6, .8, t, 3);
  floe(760 + ph(t, 1, 2) * 30, SEA + 14 + ph(t, 10, 1), 34, 6);
  floe(90 + ph(t, 1, 4) * 24, SEA + 40 + ph(t, 9, 2), 26, 5);
  ground();
  snow(t, false);
  snowPine(52, 410, 1); snowPine(128, 396, .72);
  snowyOwl(66, 304, .95, t, 5);
  snowman(190, 432, t);
  igloo(t);
  slider(t);
  polarBear(360, 458, 1, t, 0);
  cub(500, 456, .95, t, 1);
  arcticFox(800, 470, .95, t, 6);
  penguinFamily(t);
  hare(t);
  snow(t, true);
  const v = x.createRadialGradient(480, 280, 240, 480, 280, 640); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(60,50,100,.25)'); x.fillStyle = v; x.fillRect(0, 0, W, H);
  const fin = process.env.FADE || process.env.FADEIN, fout = process.env.FADE || process.env.FADEOUT;
  const f = Math.max(fin ? clamp(1 - lt / 3) : 0, fout ? clamp((lt - (DUR - 6)) / 6) : 0);
  if (f > 0) { x.fillStyle = `rgba(0,0,0,${f})`; x.fillRect(0, 0, W, H); }
}
if (require.main === module) C.run(draw, DUR, {});
else module.exports = { hare, polarBear, cub, penguin, seal, arcticFox, snowyOwl };
