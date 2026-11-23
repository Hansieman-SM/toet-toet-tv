// Calm "Sunset Farm" (90-min calm series). Everything is periodic with P seconds (seamless loop).
// A pastel farm at golden sunset (late autumn harvest feeling): a peach-pink sky with a sleepy smiling sun low over the hills, drifting
// pink clouds, birds gliding home in a little V, the first stars; a red barn with a cat peeking from the hay-loft window and a rooster
// weathervane, a farm windpump whose wheel turns slowly, haystacks and pumpkins; a horse nodding over the fence; a cow mama grazing with
// her calf (tail swish, head up and down); three fluffy sheep on the hill (one does a little hop now and then); a pig family in a mud
// puddle (wiggly tails); a hen with chicks pecking; a duck mama with three ducklings swimming slow loops on the pond; Little Truck Toet
// (electric, no exhaust) drives slowly along the farm lane with a crate of apples; fireflies start to glow at dusk.
const C = require('../lib/common'), T = require('../lib/toet');
const { x, W, H, clamp, lerp, hash } = C;
const P = 240, TAU = Math.PI * 2;
const DUR = +(process.env.DUR || P);
const T0 = +(process.env.T0 || 0);
const TB = !!process.env.THUMBBG;   // thumbnail background: Toet parked in the middle of the farm lane
const ph = (t, m = 1, o = 0) => Math.sin(TAU * m * t / P + o);
const frac = v => v - Math.floor(v);
const sstep = k => { k = clamp(k); return k * k * (3 - 2 * k); };
const INKE = '#4a3550';
// every must divide 240 so the loop stays seamless
function eye(cx, cy, r, t, o = 0, every = 5) {
  const blink = ((t + o * 1.37) % every) < .17;
  if (blink) { x.strokeStyle = INKE; x.lineWidth = r * .5; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r * .8, .2, Math.PI - .2); x.stroke(); return; }
  C.circ(cx, cy, r, INKE); C.circ(cx + r * .35, cy - r * .38, r * .4, '#ffffff');
}
const smile = (cx, cy, r, w = 2) => { x.strokeStyle = INKE; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r, .3, Math.PI - .3); x.stroke(); };
const cheek = (cx, cy, r) => C.circ(cx, cy, r, 'rgba(255,120,150,.45)');
function place(px, py, s, flip, rot = 0) { x.save(); x.translate(px, py); x.rotate(rot); x.scale(flip ? -s : s, s); }
function glow(cx, cy, r, col, a) {
  const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0));
  x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
}
const ell = (cx, cy, rx, ry, col, rot = 0) => { x.fillStyle = col; x.beginPath(); x.ellipse(cx, cy, rx, ry, rot, 0, 7); x.fill(); };

// ---------- sky ----------
function sky() {
  const g = x.createLinearGradient(0, 0, 0, 320);
  g.addColorStop(0, '#8a7cc0'); g.addColorStop(.35, '#d59ab8'); g.addColorStop(.7, '#f8b9a0'); g.addColorStop(1, '#ffd9a0');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
}
function stars(t) {
  for (let i = 0; i < 28; i++) {
    const sx = hash(i + 11) * W, sy = hash(i + 91) * 110;
    x.globalAlpha = (.35 + .5 * Math.abs(ph(t, 4 + (i % 6) * 2, i))) * (1 - sy / 140);
    C.circ(sx, sy, .7 + hash(i + 191) * 1.1, '#fff8e0');
  }
  x.globalAlpha = 1;
}
function sun(t) {
  const sx = 640, sy = 262 + ph(t, 1) * 4, R = 52;
  glow(sx, sy, R * 3, 'rgba(255,225,160,A)', .5);
  C.circ(sx, sy, R, '#ffe08a'); C.circ(sx, sy, R * .86, '#ffe9a6');
  // sleepy-happy face; the eyes open now and then
  const open = (t % 40) > 30 && (t % 40) < 37;
  if (open) { eye(sx - 16, sy - 6, 3.8, t, 2, 8); eye(sx + 16, sy - 6, 3.8, t, 2.02, 8); }
  else { x.strokeStyle = INKE; x.lineWidth = 2.2; x.lineCap = 'round'; [-16, 16].forEach(d => { x.beginPath(); x.arc(sx + d, sy - 7, 4.5, .35, Math.PI - .35); x.stroke(); }); }
  smile(sx, sy + 6, 9, 2.2); cheek(sx - 28, sy + 6, 5); cheek(sx + 28, sy + 6, 5);
}
function clouds(t) {
  [[0, 70, 1], [.4, 130, .75], [.72, 40, .6]].forEach(([o, cy, s]) => {
    const cx = -160 + frac(t / P + o) * (W + 320);
    x.fillStyle = 'rgba(255,214,222,.6)';
    [[0, 0, 32], [30, -10, 24], [-30, -4, 22], [56, 4, 18], [-54, 6, 16]].forEach(([a, b, r]) => { x.beginPath(); x.arc(cx + a * s, cy + b * s, r * s, 0, 7); x.fill(); });
    x.fillStyle = 'rgba(255,240,220,.5)'; x.beginPath(); x.arc(cx - 6 * s, cy - 10 * s, 14 * s, 0, 7); x.fill();
  });
}
// birds gliding home in a little V (twice per loop, right → left)
function birds(t) {
  const k = (t % 120) / 60; if (k > 1) return;
  const bx = lerp(W + 60, -80, k), by = 150 - k * 40;
  [[0, 0], [16, -9], [16, 9], [32, -18], [32, 18]].forEach(([dx, dy], i) => {
    const f = Math.sin(TAU * t / 1.2 + i) * 3;
    x.strokeStyle = 'rgba(90,70,110,.65)'; x.lineWidth = 1.6; x.lineCap = 'round';
    const px = bx + dx, py = by + dy * .7;
    x.beginPath(); x.moveTo(px - 6, py - f); x.quadraticCurveTo(px - 3, py - 3, px, py); x.quadraticCurveTo(px + 3, py - 3, px + 6, py - f); x.stroke();
  });
}
// ---------- land ----------
function hills() {
  x.fillStyle = '#d7a9b8'; x.beginPath(); x.moveTo(0, 300);
  for (let px = 0; px <= W; px += 16) x.lineTo(px, 282 - Math.sin(px / 150 + 1) * 18 - Math.sin(px / 55) * 5);
  x.lineTo(W, 360); x.lineTo(0, 360); x.fill();
  // far fields in stripes
  x.fillStyle = '#e8c08e'; x.beginPath(); x.moveTo(0, 318);
  for (let px = 0; px <= W; px += 16) x.lineTo(px, 300 - Math.sin(px / 200 + 2) * 12);
  x.lineTo(W, 380); x.lineTo(0, 380); x.fill();
  x.strokeStyle = 'rgba(200,150,110,.45)'; x.lineWidth = 2;
  for (let i = 0; i < 7; i++) { x.beginPath(); x.moveTo(380 + i * 70, 312); x.lineTo(330 + i * 90, 352); x.stroke(); }
  // meadow
  const g = x.createLinearGradient(0, 320, 0, H); g.addColorStop(0, '#b9d48f'); g.addColorStop(1, '#97c07e');
  x.fillStyle = g; x.beginPath(); x.moveTo(0, 340);
  for (let px = 0; px <= W; px += 16) x.lineTo(px, 330 - Math.sin(px / 170 + .4) * 10);
  x.lineTo(W, H); x.lineTo(0, H); x.fill();
  // sheep hill on the right
  x.fillStyle = '#c4dc98'; x.beginPath(); x.moveTo(700, 345); x.quadraticCurveTo(840, 268, W + 20, 300); x.lineTo(W, 360); x.lineTo(700, 360); x.fill();
}
// red barn with a hay loft window (a cat peeks out now and then) and a rooster weathervane
function barn(t) {
  const bx = 60, by = 352, w = 160, h = 110;
  x.fillStyle = 'rgba(80,60,80,.18)'; x.beginPath(); x.ellipse(bx + w / 2, by + 4, w * .62, 7, 0, 0, 7); x.fill();
  x.fillStyle = '#e07a74'; x.beginPath(); x.moveTo(bx, by); x.lineTo(bx, by - h); x.lineTo(bx + w / 2, by - h - 62); x.lineTo(bx + w, by - h); x.lineTo(bx + w, by); x.closePath(); x.fill();
  x.strokeStyle = 'rgba(160,70,80,.35)'; x.lineWidth = 1.4;
  for (let yy = by - 8; yy > by - h; yy -= 12) { x.beginPath(); x.moveTo(bx + 2, yy); x.lineTo(bx + w - 2, yy); x.stroke(); }
  // roof edge
  x.strokeStyle = '#fff6ec'; x.lineWidth = 6; x.lineJoin = 'round'; x.beginPath(); x.moveTo(bx - 8, by - h + 6); x.lineTo(bx + w / 2, by - h - 66); x.lineTo(bx + w + 8, by - h + 6); x.stroke();
  // big doors with white X
  x.fillStyle = '#c9605e'; x.fillRect(bx + 44, by - 66, 72, 66);
  x.strokeStyle = '#fff6ec'; x.lineWidth = 4; x.strokeRect(bx + 44, by - 66, 72, 66);
  x.beginPath(); x.moveTo(bx + 80, by - 66); x.lineTo(bx + 80, by); x.moveTo(bx + 44, by - 66); x.lineTo(bx + 80, by); x.lineTo(bx + 116, by - 66);
  x.moveTo(bx + 44, by); x.lineTo(bx + 80, by - 66); x.lineTo(bx + 116, by); x.stroke();
  // hay loft window with warm light
  const wx = bx + w / 2, wy = by - h - 14;
  x.fillStyle = '#ffd98a'; x.beginPath(); x.arc(wx, wy, 18, Math.PI, 0); x.lineTo(wx + 18, wy + 16); x.lineTo(wx - 18, wy + 16); x.closePath(); x.fill();
  // hay in the window
  x.fillStyle = '#f2c35c'; x.beginPath(); x.moveTo(wx - 18, wy + 16); x.quadraticCurveTo(wx, wy + 2, wx + 18, wy + 16); x.fill();
  // cat peeks up (period 30 s)
  const c = t % 30, up = c < 4 ? 0 : c < 6 ? sstep((c - 4) / 2) : c < 14 ? 1 : c < 16 ? 1 - sstep((c - 14) / 2) : 0;
  if (up > 0) {
    x.save(); x.beginPath(); x.arc(wx, wy, 18, Math.PI, 0); x.lineTo(wx + 18, wy + 16); x.lineTo(wx - 18, wy + 16); x.closePath(); x.clip();
    const cy = wy + 22 - up * 16;
    x.fillStyle = '#9a8fb0'; x.beginPath(); x.moveTo(wx - 10, cy - 6); x.lineTo(wx - 8, cy - 17); x.lineTo(wx - 2, cy - 9); x.fill(); x.beginPath(); x.moveTo(wx + 10, cy - 6); x.lineTo(wx + 8, cy - 17); x.lineTo(wx + 2, cy - 9); x.fill();
    C.circ(wx, cy, 11, '#9a8fb0'); eye(wx - 4, cy - 2, 1.8, t, 3, 4); eye(wx + 4, cy - 2, 1.8, t, 3.02, 4);
    x.fillStyle = '#ff9fb4'; x.beginPath(); x.moveTo(wx - 1.5, cy + 2); x.lineTo(wx + 1.5, cy + 2); x.lineTo(wx, cy + 3.5); x.fill();
    x.restore();
    x.fillStyle = '#f2c35c'; x.beginPath(); x.moveTo(wx - 18, wy + 16); x.quadraticCurveTo(wx, wy + 8, wx + 18, wy + 16); x.fill();
  }
  x.strokeStyle = '#fff6ec'; x.lineWidth = 3; x.beginPath(); x.arc(wx, wy, 18, Math.PI, 0); x.lineTo(wx + 18, wy + 16); x.lineTo(wx - 18, wy + 16); x.closePath(); x.stroke();
  // weathervane rooster, swinging gently
  const vx = wx, vy = by - h - 66;
  x.strokeStyle = '#6b5a72'; x.lineWidth = 2; x.beginPath(); x.moveTo(vx, vy); x.lineTo(vx, vy - 26); x.stroke();
  place(vx, vy - 30, 1, false, ph(t, 6) * .12);
  x.fillStyle = '#6b5a72'; x.beginPath(); x.moveTo(-12, 2); x.quadraticCurveTo(-4, -10, 6, -4); x.lineTo(10, -10); x.lineTo(9, -2); x.quadraticCurveTo(10, 6, -2, 6); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(-12, 2); x.lineTo(-18, -8); x.lineTo(-10, -4); x.fill();
  x.restore();
  x.strokeStyle = '#6b5a72'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(vx - 9, vy - 16); x.lineTo(vx + 9, vy - 16); x.stroke();
}
// farm windpump (turning wheel)
function windpump(t) {
  const px = 268, py = 352, top = 214;
  x.strokeStyle = '#8e7a96'; x.lineWidth = 3;
  x.beginPath(); x.moveTo(px - 16, py); x.lineTo(px, top); x.lineTo(px + 16, py);
  for (let i = 1; i < 5; i++) { const yy = py - (py - top) * i / 5, ww = 16 * (1 - i / 5); x.moveTo(px - ww, yy); x.lineTo(px + ww, yy); }
  x.stroke();
  const a = TAU * t / 20;   // one turn per 20 s
  x.save(); x.translate(px, top); x.rotate(a);
  for (let i = 0; i < 12; i++) { x.rotate(TAU / 12); x.fillStyle = i % 2 ? '#fff3e2' : '#f4b9a6'; x.beginPath(); x.moveTo(5, -3); x.lineTo(30, -7); x.lineTo(30, 7); x.lineTo(5, 3); x.fill(); }
  x.restore();
  C.circ(px, top, 6, '#8e7a96');
  // tail vane
  x.fillStyle = '#8e7a96'; x.beginPath(); x.moveTo(px + 4, top - 2); x.lineTo(px + 34, top - 10); x.lineTo(px + 34, top + 8); x.lineTo(px + 4, top + 2); x.fill();
}
function haystack(hx, hy, s) {
  ell(hx, hy + 2, 34 * s, 6 * s, 'rgba(80,60,80,.15)');
  x.fillStyle = '#f0c76a'; x.beginPath(); x.moveTo(hx - 32 * s, hy); x.quadraticCurveTo(hx - 30 * s, hy - 52 * s, hx, hy - 56 * s); x.quadraticCurveTo(hx + 30 * s, hy - 52 * s, hx + 32 * s, hy); x.closePath(); x.fill();
  x.strokeStyle = 'rgba(190,140,60,.5)'; x.lineWidth = 1.4;
  for (let i = -2; i <= 2; i++) { x.beginPath(); x.moveTo(hx + i * 10 * s, hy - 2); x.quadraticCurveTo(hx + i * 6 * s, hy - 30 * s, hx + i * 3 * s, hy - 50 * s); x.stroke(); }
}
function pumpkin(px, py, s) {
  ell(px, py + 1, 16 * s, 3 * s, 'rgba(80,60,80,.15)');
  [-8, 8, 0].forEach(d => ell(px + d * s, py - 10 * s, 10 * s, 11 * s, d ? '#f29b55' : '#f7ab62'));
  x.strokeStyle = '#7a9a5a'; x.lineWidth = 3 * s; x.lineCap = 'round'; x.beginPath(); x.moveTo(px, py - 20 * s); x.quadraticCurveTo(px + 2 * s, py - 26 * s, px + 5 * s, py - 27 * s); x.stroke();
}
function fence(y0) {
  x.strokeStyle = '#fff1e6'; x.lineWidth = 4; x.lineCap = 'round';
  x.beginPath(); x.moveTo(300, y0 - 22); x.lineTo(W + 10, y0 - 22); x.moveTo(300, y0 - 10); x.lineTo(W + 10, y0 - 10); x.stroke();
  x.lineWidth = 5; for (let fx = 304; fx < W + 10; fx += 46) { x.beginPath(); x.moveTo(fx, y0 + 2); x.lineTo(fx, y0 - 30); x.stroke(); }
}
// horse nodding over the fence
function horse(t) {
  const hx = 404, hy = 372, nod = Math.max(0, ph(t, 16)) * .18;
  ell(hx, hy + 2, 40, 5, 'rgba(80,60,80,.15)');
  x.fillStyle = '#b98770';
  [[-24, 0], [-14, 2], [18, 0], [28, 2]].forEach(([d, o]) => x.fillRect(hx + d - 3, hy - 30 + o, 7, 30 - o));
  ell(hx, hy - 40, 38, 18, '#c7967d');
  // tail swish
  x.strokeStyle = '#7d5a54'; x.lineWidth = 6; x.lineCap = 'round';
  x.beginPath(); x.moveTo(hx - 36, hy - 46); x.quadraticCurveTo(hx - 48 + ph(t, 24) * 5, hy - 30, hx - 44 + ph(t, 24) * 8, hy - 14); x.stroke();
  // neck + head
  place(hx + 26, hy - 50, 1, false, -nod);
  x.fillStyle = '#c7967d'; x.beginPath(); x.moveTo(-6, 8); x.lineTo(8, -34); x.lineTo(24, -30); x.lineTo(14, 10); x.fill();
  ell(24, -36, 18, 11, '#c7967d', .45); ell(36, -28, 9, 8, '#e3bba4');
  C.circ(38, -28, 1.4, INKE); eye(18, -42, 2.4, t, 7, 6); cheek(28, -32, 2.6);
  x.fillStyle = '#c7967d'; x.beginPath(); x.moveTo(10, -44); x.lineTo(12, -56); x.lineTo(18, -46); x.fill();
  // mane
  x.fillStyle = '#7d5a54'; for (let i = 0; i < 5; i++) { x.beginPath(); x.arc(4 + i * 3.4, -40 + i * 8, 5, 0, 7); x.fill(); }
  x.restore();
}
// cow mama grazing + calf
function cow(cx, cy, s, t, o, flip, calf) {
  const graze = sstep((ph(t, calf ? 12 : 8, o) + 1) / 2);
  place(cx, cy, s, flip);
  ell(0, 2, 44, 5, 'rgba(80,60,80,.15)');
  x.fillStyle = '#f7f1ec'; [-26, -14, 18, 28].forEach(d => x.fillRect(d - 3, -26, 7, 26));
  ell(0, -36, 40, 20, '#fbf6f1');
  ell(-14, -42, 11, 8, '#9b8aa6'); ell(16, -30, 9, 7, '#9b8aa6'); ell(-2, -26, 6, 4, '#9b8aa6');
  ell(10, -18, 8, 5, '#ffc6cf');
  // tail
  x.strokeStyle = '#e8ded6'; x.lineWidth = 3; x.lineCap = 'round';
  const sw = ph(t, 20, o) * 6; x.beginPath(); x.moveTo(-38, -44); x.quadraticCurveTo(-48 + sw, -30, -44 + sw, -14); x.stroke();
  C.circ(-44 + sw, -12, 3.5, '#9b8aa6');
  // head moves between grazing (down) and looking up
  const hx = 40, hy = lerp(-44, -10, graze);
  x.fillStyle = '#fbf6f1'; x.beginPath(); x.moveTo(26, -48); x.lineTo(hx + 4, hy - 8); x.lineTo(hx + 8, hy + 8); x.lineTo(28, -30); x.fill();
  if (!calf) { x.strokeStyle = '#f2d7a8'; x.lineWidth = 3; x.beginPath(); x.moveTo(hx - 6, hy - 14); x.lineTo(hx - 10, hy - 22); x.moveTo(hx + 8, hy - 14); x.lineTo(hx + 12, hy - 22); x.stroke(); }
  ell(hx - 12, hy - 8, 7, 4, '#9b8aa6', -.5); ell(hx + 16, hy - 8, 7, 4, '#9b8aa6', .5);
  ell(hx + 2, hy, 14, 14, '#fbf6f1'); ell(hx + 2, hy + 9, 12, 8, '#ffc6cf');
  C.circ(hx - 2, hy + 9, 1.6, '#d48a9a'); C.circ(hx + 6, hy + 9, 1.6, '#d48a9a');
  if (graze > .7) { x.strokeStyle = INKE; x.lineWidth = 1.6; [-4, 8].forEach(d => { x.beginPath(); x.arc(hx + d, hy - 3, 2.6, .3, Math.PI - .3); x.stroke(); }); }
  else { eye(hx - 4, hy - 3, 2.2, t, o + 4, 6); eye(hx + 8, hy - 3, 2.2, t, o + 4.02, 6); }
  x.restore();
  // a few grass blades in front of the mouth
  x.strokeStyle = '#7fae6a'; x.lineWidth = 2;
  const gx = cx + (flip ? -1 : 1) * (hx + 2) * s, gy = cy;
  for (let i = -2; i <= 2; i++) { x.beginPath(); x.moveTo(gx + i * 4, gy); x.lineTo(gx + i * 5, gy - 9); x.stroke(); }
}
// fluffy sheep; the middle one does a little hop every 40 s
function sheep(sx, sy, s, t, o, flip, hop) {
  let up = 0; if (hop) { const c = t % 40; if (c < 1.2) up = Math.sin(Math.PI * c / 1.2) * 14; }
  ell(sx, sy + 2, 24 * s, 4 * s, 'rgba(80,60,80,.15)');
  place(sx, sy - up, s, flip);
  x.fillStyle = '#6d5f78'; [-12, -4, 6, 14].forEach(d => x.fillRect(d - 2, -14, 4, 14));
  x.fillStyle = '#ffffff'; [[0, -24, 16], [-12, -22, 11], [12, -22, 11], [-6, -32, 10], [6, -32, 10], [0, -18, 12]].forEach(([a, b, r]) => { x.beginPath(); x.arc(a, b, r, 0, 7); x.fill(); });
  ell(20, -28, 8, 9, '#6d5f78'); ell(13, -32, 5, 2.6, '#6d5f78', -.4); ell(27, -32, 5, 2.6, '#6d5f78', .4);
  C.circ(20, -36, 5, '#ffffff');
  eye(17, -28, 1.6, t, o, 5); eye(23, -28, 1.6, t, o + .02, 5); C.circ(20, -23, 1.2, '#ffb3c1');
  x.restore();
}
// pig family in a mud puddle
function pigs(t) {
  const px = 140, py = 492;
  ell(px, py, 118, 22, '#b48c7a'); ell(px - 10, py - 4, 90, 14, '#c49d8a');
  [[px - 50, py - 4, 1, 0, false], [px + 30, py + 2, .7, 1.3, true], [px + 76, py - 2, .62, 2.6, false]].forEach(([cx, cy, s, o, flip], i) => {
    const bob = ph(t, 30 + i * 6, o) * 1.5;
    place(cx, cy + bob, s, flip);
    x.fillStyle = '#f6b4c1'; [-16, -6, 10, 18].forEach(d => x.fillRect(d - 3, -12, 6, 10));
    ell(0, -22, 26, 16, '#f9c3cd');
    // curly tail wiggles
    x.strokeStyle = '#f6a7b6'; x.lineWidth = 2.4; x.beginPath();
    const w = ph(t, 40, o) * .8; x.arc(-28, -26, 4, w, w + 5); x.stroke();
    ell(22, -26, 13, 12, '#f9c3cd');
    x.fillStyle = '#f6a7b6'; x.beginPath(); x.moveTo(14, -34); x.lineTo(14, -44); x.lineTo(22, -37); x.fill(); x.beginPath(); x.moveTo(26, -36); x.lineTo(32, -44); x.lineTo(32, -33); x.fill();
    ell(33, -23, 6, 5, '#f6a7b6'); C.circ(31, -23, 1.2, '#c87a8c'); C.circ(35, -23, 1.2, '#c87a8c');
    eye(19, -30, 1.9, t, o + 9, 5); eye(27, -30, 1.9, t, o + 9.02, 5); cheek(17, -22, 2.4);
    x.restore();
  });
  // muddy splash ring now and then
  const c = t % 24; if (c < 2) { x.globalAlpha = 1 - c / 2; x.strokeStyle = '#a07a68'; x.lineWidth = 1.6; x.beginPath(); x.ellipse(px + 30, py + 8, 14 + c * 14, 3 + c * 3, 0, 0, 7); x.stroke(); x.globalAlpha = 1; }
}
// hen + chicks pecking
function hens(t) {
  const hx = 330, hy = 500;
  const peck = k => Math.max(0, Math.sin(TAU * k)) ** 6;
  place(hx, hy, 1, false, peck(t / 3) * .35);
  ell(0, 2, 20, 4, 'rgba(80,60,80,.15)');
  x.strokeStyle = '#e8a04a'; x.lineWidth = 2; x.beginPath(); x.moveTo(-4, -6); x.lineTo(-5, 2); x.moveTo(4, -6); x.lineTo(5, 2); x.stroke();
  ell(0, -16, 18, 13, '#fffaf2'); x.fillStyle = '#fffaf2'; x.beginPath(); x.moveTo(-14, -20); x.lineTo(-26, -32); x.lineTo(-16, -12); x.fill();
  ell(-2, -16, 9, 6, '#f1e6da', -.3);
  C.circ(14, -28, 9, '#fffaf2'); x.fillStyle = '#ff8a8a'; x.beginPath(); x.arc(12, -37, 3, 0, 7); x.arc(16, -38, 3, 0, 7); x.fill(); ell(16, -21, 2, 3, '#ff8a8a');
  x.fillStyle = '#f2b34a'; x.beginPath(); x.moveTo(22, -29); x.lineTo(29, -27); x.lineTo(22, -25); x.fill();
  eye(16, -30, 1.7, t, 12, 4);
  x.restore();
  [[hx + 40, hy + 6, 0], [hx + 62, hy - 2, .7], [hx - 34, hy + 8, 1.4]].forEach(([cx, cy, o], i) => {
    const hp = Math.max(0, Math.sin(TAU * (t / 4 + o))) * 2;
    place(cx, cy - hp, 1, i === 2, peck(t / 2 + o) * .4);
    ell(0, 2 + hp, 8, 2, 'rgba(80,60,80,.15)');
    C.circ(0, -7, 7, '#ffe27a'); C.circ(5, -13, 5, '#ffe27a');
    x.fillStyle = '#f2a14a'; x.beginPath(); x.moveTo(9, -13); x.lineTo(13, -12); x.lineTo(9, -11); x.fill();
    eye(6, -14, 1.2, t, 13 + i, 4);
    x.restore();
  });
}
// farm lane + Toet with a crate of apples
const LANE = 430;
function lane() {
  x.fillStyle = '#e6c9a2'; x.beginPath(); x.moveTo(0, LANE - 14); x.quadraticCurveTo(W / 2, LANE - 20, W, LANE - 14); x.lineTo(W, LANE + 16); x.quadraticCurveTo(W / 2, LANE + 10, 0, LANE + 16); x.fill();
  x.fillStyle = 'rgba(190,150,110,.35)'; for (let i = 0; i < 24; i++) C.circ(hash(i + 400) * W, LANE - 8 + hash(i + 440) * 20, 1.4 + hash(i + 480), 'rgba(190,150,110,.35)');
}
function toet(t) {
  const S = .34, LEN = 300 * S;
  let px, dist;
  if (TB) { px = 360; dist = 0; }
  else {
    const k = (t % 120) / 60; if (k > 1) return;   // twice per loop, 60 s to cross
    const u = k - .06 * Math.sin(k * TAU);
    px = lerp(-LEN - 40, W + 40, u);
    dist = u * 22 * TAU * 10;   // whole wheel turns per trip
  }
  const by = LANE + 10 + (TB ? 0 : Math.sin(TAU * t / 0.8) * .5);
  x.save(); x.translate(px + 74 * S, by); x.scale(S, S); x.translate(-310, -(T.ROAD + 20));
  T.truck({ t: TB ? 1 : t, dist, moving: false, bx: 310, happy: true, night: .5 });
  // crate of apples on the roof of the box
  x.save(); x.translate(310, T.ROAD + 20);
  x.fillStyle = '#c99a6a'; x.fillRect(-40, -150, 130, 30); x.strokeStyle = '#7d5a44'; x.lineWidth = 3; x.strokeRect(-40, -150, 130, 30);
  x.beginPath(); x.moveTo(-40, -135); x.lineTo(90, -135); x.stroke();
  for (let i = 0; i < 6; i++) { C.circ(-28 + i * 21, -156, 11, i % 3 === 1 ? '#ffd23f' : '#ef5a5a'); x.fillStyle = '#5d9a4a'; x.fillRect(-29 + i * 21, -170, 2.4, 6); }
  x.restore();
  x.restore();
}
// pond with duck mama + ducklings swimming a slow loop (one loop per 60 s)
const PDX = 820, PDY = 488, PRX = 118, PRY = 30;
function pond(t) {
  ell(PDX, PDY, PRX + 8, PRY + 6, '#a8cf8a');
  const g = x.createLinearGradient(0, PDY - PRY, 0, PDY + PRY); g.addColorStop(0, '#f6c9c0'); g.addColorStop(1, '#b8d2e6');
  x.fillStyle = g; x.beginPath(); x.ellipse(PDX, PDY, PRX, PRY, 0, 0, 7); x.fill();
  // sun reflection shimmer
  for (let i = 0; i < 4; i++) { x.globalAlpha = .4 + .3 * ph(t, 20, i); x.fillStyle = '#fff2c4'; x.fillRect(PDX - 60 + i * 10 - (i % 2) * 6, PDY - 18 + i * 7, 26 - i * 4, 2); }
  x.globalAlpha = 1;
  // reeds
  [[PDX - 112, PDY - 6], [PDX - 100, PDY - 12], [PDX + 108, PDY - 8]].forEach(([rx, ry], i) => {
    const sw = ph(t, 12, i) * 3; x.strokeStyle = '#7aa262'; x.lineWidth = 2.4;
    x.beginPath(); x.moveTo(rx, ry + 10); x.quadraticCurveTo(rx + sw / 2, ry - 14, rx + sw, ry - 34); x.stroke();
    ell(rx + sw, ry - 32, 3.4, 9, '#9a6f5a');
  });
  for (let j = 0; j < 4; j++) {
    const a = TAU * (t / 60) - j * .5, dx = Math.cos(a) * (PRX - 40), dy = Math.sin(a) * (PRY - 12);
    const s = j ? .55 : 1, flip = Math.sin(a) > 0;   // face the swimming direction
    const px = PDX + dx, py = PDY + dy + 6 + Math.sin(TAU * t / 3 + j) * .8;
    x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = 1; x.beginPath(); x.ellipse(px, py + 2, 16 * s, 3 * s, 0, 0, 7); x.stroke();
    place(px, py, s, flip);
    ell(0, -6, 16, 9, j ? '#ffe27a' : '#fffaf2');
    x.fillStyle = j ? '#ffe27a' : '#fffaf2'; x.beginPath(); x.moveTo(-14, -8); x.lineTo(-22, -14); x.lineTo(-12, -2); x.fill();
    C.circ(10, -18, 8, j ? '#ffe27a' : '#fffaf2');
    if (!j) ell(-2, -7, 8, 4, '#f1e6da', -.2);
    x.fillStyle = '#f2a14a'; x.beginPath(); x.ellipse(19, -17, 5, 2.4, 0, 0, 7); x.fill();
    eye(12, -20, 1.8, t, 20 + j, 5);
    x.restore();
  }
}
// fireflies at dusk around the meadow
function fireflies(t) {
  for (let i = 0; i < 22; i++) {
    const fx = 40 + hash(i + 700) * 880 + ph(t, 3 + i % 4, i) * 22, fy = 360 + hash(i + 740) * 60 + ph(t, 5 + i % 3, i * 2) * 10;
    const k = Math.max(0, ph(t, 10 + (i % 5) * 2, i * 1.7)); if (k < .2) continue;
    glow(fx, fy, 8, 'rgba(255,240,150,A)', k * .7); C.circ(fx, fy, 1.4, '#fff6c0');
  }
}
// foreground flowers + grass tufts
function front(t) {
  for (let i = 0; i < 16; i++) {
    const fx = 20 + hash(i + 900) * 920, fy = 520 + hash(i + 930) * 16;
    if (fx > 690 && fx < 950) continue;   // keep the pond free
    if (fx > 10 && fx < 270 && fy < 520) continue;
    const sw = ph(t, 8 + i % 4, i) * 2;
    x.strokeStyle = '#6f9d5c'; x.lineWidth = 2; x.beginPath(); x.moveTo(fx, fy + 8); x.quadraticCurveTo(fx + sw / 2, fy - 4, fx + sw, fy - 12); x.stroke();
    const col = ['#ffffff', '#ffd6e4', '#fff1a8', '#d8c8ff'][i % 4];
    for (let p = 0; p < 5; p++) { const a = p / 5 * TAU; C.circ(fx + sw + Math.cos(a) * 3.4, fy - 12 + Math.sin(a) * 3.4, 2.6, col); }
    C.circ(fx + sw, fy - 12, 2, '#f7b84a');
  }
}

function draw(t0) {
  const lt = t0, t = (t0 + T0) % P;
  sky();
  stars(t);
  sun(t);
  clouds(t);
  birds(t);
  hills();
  [[870, 300, .9, 0, true, true], [812, 296, 1, 1.2, false, false], [910, 314, .8, 2.1, true, false]].forEach(([a, b, s, o, f, hp]) => sheep(a, b, s, t, o, f, hp));
  windpump(t);
  barn(t);
  haystack(250, 372, .9); haystack(296, 380, .7);
  fence(372);
  horse(t);
  cow(570, 384, .95, t, 0, false, false);
  cow(735, 394, .6, t, 1.7, true, true);
  pumpkin(486, 404, .9); pumpkin(512, 410, .7); pumpkin(236, 402, .8);
  lane();
  toet(t);
  fireflies(t);
  pigs(t);
  hens(t);
  pond(t);
  front(t);
  const fin = process.env.FADE || process.env.FADEIN, fout = process.env.FADE || process.env.FADEOUT;
  const f = Math.max(fin ? clamp(1 - lt / 3) : 0, fout ? clamp((lt - (DUR - 6)) / 6) : 0);
  if (f > 0) { x.fillStyle = `rgba(0,0,0,${f})`; x.fillRect(0, 0, W, H); }
}
if (require.main === module) C.run(draw, DUR, {});
