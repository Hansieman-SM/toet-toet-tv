// Calm "Cozy Winter Village" (90-min calm series). Everything is periodic with P seconds (seamless loop).
// A pastel snowy evening village (cosy winter, not Christmas): a soft lilac-pink sky with a big gentle moon and the first stars, snowy hills,
// a row of little pastel houses with snow on the roofs and warm glowing windows (a cat blinks and swishes its tail in one window, a bunny
// family waves from another), soft steam puffs from the chimneys, a street lamp with a warm glow, an owl on a bare tree branch, a hedgehog
// sledding gently down the hill and pulling its sled back up, a snowman with a scarf who waves, a frozen pond where a bear cub and a fox cub
// skate slow loops, Little Truck Toet (electric, no exhaust) driving slowly through the village with his headlights on, softly falling snow.
const C = require('../lib/common'), T = require('../lib/toet');
const { x, W, H, clamp, lerp, hash } = C;
const P = 240, TAU = Math.PI * 2;
const DUR = +(process.env.DUR || P);
const T0 = +(process.env.T0 || 0);
const TB = !!process.env.THUMBBG;   // thumbnail background: Toet parked in the middle of the village
const ph = (t, m = 1, o = 0) => Math.sin(TAU * m * t / P + o);
const frac = v => v - Math.floor(v);
const INKE = '#3d3358';
const OUTL = 'rgba(70,60,100,.35)';
const edge = (w = 1.4) => { x.strokeStyle = OUTL; x.lineWidth = w; x.stroke(); };
function glow(cx, cy, r, col, a) {
  const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0));
  x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
}
// every must divide 240 so the loop stays seamless
function eye(cx, cy, r, t, o = 0, every = 5) {
  const blink = ((t + o * 1.37) % every) < .17;
  if (blink) { x.strokeStyle = INKE; x.lineWidth = r * .5; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r * .8, .2, Math.PI - .2); x.stroke(); return; }
  C.circ(cx, cy, r, INKE); C.circ(cx + r * .35, cy - r * .38, r * .4, '#ffffff');
}
const smile = (cx, cy, r, w = 2) => { x.strokeStyle = INKE; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r, .3, Math.PI - .3); x.stroke(); };
const cheek = (cx, cy, r) => C.circ(cx, cy, r, 'rgba(255,130,170,.45)');
function place(px, py, s, flip, rot = 0) { x.save(); x.translate(px, py); x.rotate(rot); x.scale(flip ? -s : s, s); }
const sstep = k => { k = clamp(k); return k * k * (3 - 2 * k); };

// ---------- sky ----------
function sky() {
  const g = x.createLinearGradient(0, 0, 0, 330);
  g.addColorStop(0, '#46508f'); g.addColorStop(.45, '#7c78b8'); g.addColorStop(.8, '#d6a9cc'); g.addColorStop(1, '#f6cdd0');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
}
function stars(t) {
  for (let i = 0; i < 60; i++) {
    const sx = hash(i + 7) * W, sy = hash(i + 77) * 200, m = 4 + (i % 7) * 2;
    x.globalAlpha = (.4 + .6 * Math.abs(ph(t, m, i))) * (1 - sy / 260);
    const r = .7 + hash(i + 177) * 1.4;
    C.circ(sx, sy, r, i % 4 ? '#ffffff' : '#fff2b0');
    if (i % 9 === 0) { x.strokeStyle = '#fff6d0'; x.lineWidth = .7; x.beginPath(); x.moveTo(sx - r * 3, sy); x.lineTo(sx + r * 3, sy); x.moveTo(sx, sy - r * 3); x.lineTo(sx, sy + r * 3); x.stroke(); }
  }
  x.globalAlpha = 1;
}
function moon(t) {
  const mx = 806, my = 86 + ph(t, 1) * 3, R = 44;
  glow(mx, my, R * 2.6, 'rgba(255,245,215,A)', .38);
  C.circ(mx, my, R, '#fff4d6');
  C.circ(mx - 14, my - 12, 7, 'rgba(230,214,180,.55)'); C.circ(mx + 18, my + 16, 9, 'rgba(230,214,180,.5)'); C.circ(mx + 20, my - 18, 4, 'rgba(230,214,180,.5)');
  // gentle face: sleepy-happy eyes that open now and then
  const open = ((t % 30) > 22 && (t % 30) < 28);
  if (open) { eye(mx - 13, my - 2, 3.4, t, 1, 6); eye(mx + 11, my - 2, 3.4, t, 1.03, 6); }
  else { x.strokeStyle = INKE; x.lineWidth = 2; x.lineCap = 'round'; [-13, 11].forEach(d => { x.beginPath(); x.arc(mx + d, my - 3, 4, .35, Math.PI - .35); x.stroke(); }); }
  smile(mx - 1, my + 8, 7, 2); cheek(mx - 22, my + 8, 4); cheek(mx + 20, my + 8, 4);
}
function clouds(t) {
  [[0, 120, 1], [.5, 60, .8]].forEach(([o, cy, s], i) => {
    const cx = -160 + frac(t / P + o) * (W + 320);
    x.fillStyle = 'rgba(255,230,240,.45)';
    [[0, 0, 34], [30, -10, 26], [-30, -4, 24], [56, 4, 20], [-54, 6, 18]].forEach(([a, b, r]) => { x.beginPath(); x.arc(cx + a * s, cy + b * s, r * s, 0, 7); x.fill(); });
  });
}
// ---------- land ----------
function farHills() {
  x.fillStyle = '#c9c4e6'; x.beginPath(); x.moveTo(0, 330);
  for (let px = 0; px <= W; px += 20) x.lineTo(px, 300 - Math.sin(px / 140 + 1) * 22 - Math.sin(px / 61) * 6);
  x.lineTo(W, 400); x.lineTo(0, 400); x.fill();
  // tiny far-away houses with warm dots
  [[540, 288], [580, 292], [640, 284], [700, 290]].forEach(([hx, hy], i) => {
    x.fillStyle = '#b2acd6'; x.fillRect(hx - 7, hy - 8, 14, 10); x.beginPath(); x.moveTo(hx - 9, hy - 8); x.lineTo(hx, hy - 15); x.lineTo(hx + 9, hy - 8); x.fill();
    C.circ(hx - 2, hy - 3, 1.6, '#ffe39a');
  });
  x.fillStyle = '#e4e1f5'; x.beginPath(); x.moveTo(0, 360);
  for (let px = 0; px <= W; px += 20) x.lineTo(px, 336 - Math.sin(px / 180 + 2.4) * 16);
  x.lineTo(W, 420); x.lineTo(0, 420); x.fill();
}
// sledding hill on the left: line from top (30,250) down to (300,392)
const hillY = px => px < 30 ? 250 : px > 300 ? 392 : 250 + (1 - Math.cos((px - 30) / 270 * Math.PI)) / 2 * 142;
function sledHill() {
  x.fillStyle = '#f3f1fb'; x.beginPath(); x.moveTo(0, 248);
  for (let px = 0; px <= 330; px += 10) x.lineTo(px, hillY(px) - (px < 30 ? Math.sin(px / 10) * 2 : 0));
  x.lineTo(330, 420); x.lineTo(0, 420); x.fill();
  x.strokeStyle = 'rgba(160,150,210,.35)'; x.lineWidth = 2; x.beginPath();
  for (let px = 0; px <= 320; px += 10) x.lineTo(px, hillY(px)); x.stroke();
  // sled track
  x.strokeStyle = 'rgba(170,160,215,.35)'; x.lineWidth = 1.4; x.beginPath();
  for (let px = 40; px <= 300; px += 10) x.lineTo(px, hillY(px) + 7); x.stroke();
}
// ---------- houses ----------
const HOUSES = [
  { x: 350, w: 92, h: 70, col: '#ffc9d6', roof: '#b58bc4' },
  { x: 462, w: 80, h: 86, col: '#bfe3f5', roof: '#8c93cf' },
  { x: 618, w: 100, h: 74, col: '#fff0b8', roof: '#c58a9e' },
  { x: 736, w: 84, h: 92, col: '#c9efd6', roof: '#8ba8cf' },
  { x: 852, w: 90, h: 72, col: '#f1d4f4', roof: '#a08bc9' },
];
const GROUND = 392;
function house(hd, i, t) {
  const { w, h, col, roof } = hd, hx = hd.x, top = GROUND - h;
  // chimney
  const chx = hx + w * .25;
  x.fillStyle = '#c99a8c'; x.fillRect(chx - 7, top - 34, 14, 26); C.rr(chx - 9, top - 38, 18, 7, 3); x.fill();
  x.fillStyle = '#ffffff'; C.rr(chx - 10, top - 42, 20, 6, 3); x.fill();
  // body
  x.fillStyle = col; x.fillRect(hx - w / 2, top, w, h); x.beginPath(); x.rect(hx - w / 2, top, w, h); edge(1.2);
  // roof + snow
  x.fillStyle = roof; x.beginPath(); x.moveTo(hx - w / 2 - 10, top + 4); x.lineTo(hx, top - 40); x.lineTo(hx + w / 2 + 10, top + 4); x.closePath(); x.fill(); edge(1.2);
  x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(hx - w / 2 - 13, top + 6); x.lineTo(hx, top - 44); x.lineTo(hx + w / 2 + 13, top + 6);
  for (let k = 0; k <= 8; k++) { const px = hx + w / 2 + 13 - k * (w + 26) / 8; x.lineTo(px, top + 2 + (k % 2 ? 7 : 2)); }
  x.closePath(); x.fill();
  // door
  x.fillStyle = '#9b7aa8'; C.rr(hx + w * .14, GROUND - 32, 18, 32, 8); x.fill(); C.circ(hx + w * .14 + 14, GROUND - 16, 1.6, '#ffe39a');
  // little snow pile at the door
  x.fillStyle = '#ffffff'; x.beginPath(); x.ellipse(hx - w * .2, GROUND, 18, 5, 0, Math.PI, 0); x.fill();
}
function windowBox(wx, wy, ww, wh, t, i) {
  const g = .85 + .15 * ph(t, 8, i);
  glow(wx + ww / 2, wy + wh / 2, ww * 1.1, 'rgba(255,214,120,A)', .35 * g);
  x.fillStyle = '#ffd98a'; C.rr(wx, wy, ww, wh, 4); x.fill();
  const gi = x.createLinearGradient(0, wy, 0, wy + wh); gi.addColorStop(0, 'rgba(255,240,190,.9)'); gi.addColorStop(1, 'rgba(255,190,110,.6)');
  x.fillStyle = gi; C.rr(wx + 2, wy + 2, ww - 4, wh - 4, 3); x.fill();
}
function windowFrame(wx, wy, ww, wh) {
  x.strokeStyle = '#fffaf2'; x.lineWidth = 2.4; C.rr(wx, wy, ww, wh, 4); x.stroke();
  x.beginPath(); x.moveTo(wx + ww / 2, wy); x.lineTo(wx + ww / 2, wy + wh); x.moveTo(wx, wy + wh / 2); x.lineTo(wx + ww, wy + wh / 2); x.stroke();
  x.fillStyle = '#ffffff'; C.rr(wx - 3, wy + wh - 1, ww + 6, 5, 2.5); x.fill();
}
// cat in a window: blinking, tail swishing over the sill
function catWindow(wx, wy, t) {
  windowBox(wx, wy, 34, 30, t, 1);
  x.save(); x.beginPath(); x.rect(wx, wy, 34, 34); x.clip();
  const cx = wx + 17, cy = wy + 26;
  x.fillStyle = '#9a8fb0'; x.beginPath(); x.ellipse(cx, cy, 10, 9, 0, 0, 7); x.fill();
  C.circ(cx, cy - 12, 8, '#9a8fb0');
  x.beginPath(); x.moveTo(cx - 8, cy - 15); x.lineTo(cx - 6, cy - 24); x.lineTo(cx - 2, cy - 18); x.fill();
  x.beginPath(); x.moveTo(cx + 8, cy - 15); x.lineTo(cx + 6, cy - 24); x.lineTo(cx + 2, cy - 18); x.fill();
  eye(cx - 3.2, cy - 13, 1.6, t, 30, 5); eye(cx + 3.2, cy - 13, 1.6, t, 30.03, 5); C.circ(cx, cy - 10, 1, '#ff9fb8');
  x.restore();
  windowFrame(wx, wy, 34, 30);
  // tail hangs over the sill and swishes
  const sw = ph(t, 40) * .5;
  x.strokeStyle = '#9a8fb0'; x.lineWidth = 3.4; x.lineCap = 'round'; x.beginPath(); x.moveTo(wx + 24, wy + 31);
  x.quadraticCurveTo(wx + 30 + sw * 6, wy + 40, wx + 26 + sw * 10, wy + 48); x.stroke();
}
// bunny family in a window: mama + two babies, they wave now and then (period 30 s)
function bunnyWindow(wx, wy, t) {
  windowBox(wx, wy, 40, 30, t, 2);
  x.save(); x.beginPath(); x.rect(wx, wy, 40, 32); x.clip();
  const wv = (t % 30) > 18 && (t % 30) < 24 ? Math.sin((t % 30 - 18) * Math.PI * 2) : 0;
  [[wx + 12, wy + 24, 1, 0], [wx + 26, wy + 28, .72, 1], [wx + 35, wy + 29, .62, 2]].forEach(([bx, by, s, j]) => {
    place(bx, by, s, false);
    x.fillStyle = '#fbf7f2';
    x.beginPath(); x.ellipse(-3, -20, 2.6, 8, -.15, 0, 7); x.fill(); x.beginPath(); x.ellipse(3, -20, 2.6, 8, .15, 0, 7); x.fill();
    C.circ(0, -6, 7, '#fbf7f2'); x.beginPath(); x.ellipse(0, 6, 9, 7, 0, 0, 7); x.fill();
    eye(-2.5, -7, 1.3, t, 40 + j, 6); eye(2.5, -7, 1.3, t, 40.03 + j, 6); C.circ(0, -4, .9, '#ff9fb8');
    // waving paw
    x.strokeStyle = '#fbf7f2'; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.moveTo(6, 2); x.lineTo(10 + wv * 2, -4 - Math.abs(wv) * 4); x.stroke();
    x.restore();
  });
  x.restore();
  windowFrame(wx, wy, 40, 30);
}
function plainWindow(wx, wy, t, i) { windowBox(wx, wy, 28, 26, t, i); windowFrame(wx, wy, 28, 26); }
function steam(t) {
  HOUSES.forEach((hd, i) => {
    const chx = hd.x + hd.w * .25, top = GROUND - hd.h - 44;
    for (let p = 0; p < 4; p++) {
      const k = frac(t / 12 + p / 4 + i * .13), r = 4 + k * 10;
      x.globalAlpha = Math.sin(k * Math.PI) * .45;
      C.circ(chx + Math.sin(k * 5 + i) * 6 + k * 14, top - k * 60, r, '#fff8fb');
    }
  });
  x.globalAlpha = 1;
}
function village(t) {
  HOUSES.forEach((hd, i) => house(hd, i, t));
  const [a, b, c, d, e] = HOUSES;
  catWindow(a.x - 34, GROUND - a.h + 16, t); plainWindow(a.x + 8, GROUND - a.h + 16, t, 3);
  plainWindow(b.x - 26, GROUND - b.h + 14, t, 4); plainWindow(b.x - 2, GROUND - b.h + 14, t, 5);
  bunnyWindow(c.x - 40, GROUND - c.h + 18, t); plainWindow(c.x + 10, GROUND - c.h + 18, t, 6);
  plainWindow(d.x - 28, GROUND - d.h + 14, t, 7); plainWindow(d.x - 28, GROUND - d.h + 48, t, 8);
  plainWindow(e.x - 32, GROUND - e.h + 18, t, 9); plainWindow(e.x + 6, GROUND - e.h + 18, t, 10);
}
// ---------- tree with owl ----------
function owlTree(t) {
  const tx = 560, ty = GROUND;
  x.strokeStyle = '#8e7896'; x.lineCap = 'round';
  x.lineWidth = 9; x.beginPath(); x.moveTo(tx, ty); x.lineTo(tx - 2, ty - 120); x.stroke();
  x.lineWidth = 5; x.beginPath(); x.moveTo(tx - 1, ty - 78); x.quadraticCurveTo(tx + 26, ty - 92, tx + 44, ty - 90); x.stroke();
  x.beginPath(); x.moveTo(tx - 2, ty - 100); x.quadraticCurveTo(tx - 22, ty - 118, tx - 34, ty - 128); x.stroke();
  x.lineWidth = 3; x.beginPath(); x.moveTo(tx - 2, ty - 118); x.lineTo(tx + 10, ty - 140); x.moveTo(tx - 20, ty - 114); x.lineTo(tx - 22, ty - 134); x.stroke();
  // snow on the branches
  x.fillStyle = '#ffffff'; [[tx + 22, ty - 92, 14], [tx - 22, ty - 121, 10], [tx - 2, ty - 122, 6]].forEach(([a, b, r]) => { x.beginPath(); x.ellipse(a, b, r, 3, -.2, Math.PI, 0); x.fill(); });
  // owl sits on the right branch, turns its head now and then
  const ox = tx + 26, oy = ty - 94, turn = ph(t, 8) * 3;
  x.fillStyle = '#c3a6d6'; x.beginPath(); x.ellipse(ox, oy - 12, 11, 14, 0, 0, 7); x.fill(); edge(1);
  x.fillStyle = '#efe2f5'; x.beginPath(); x.ellipse(ox, oy - 8, 7, 9, 0, 0, 7); x.fill();
  x.fillStyle = '#c3a6d6'; x.beginPath(); x.moveTo(ox - 9 + turn, oy - 22); x.lineTo(ox - 8 + turn, oy - 32); x.lineTo(ox - 3 + turn, oy - 25); x.fill();
  x.beginPath(); x.moveTo(ox + 9 + turn, oy - 22); x.lineTo(ox + 8 + turn, oy - 32); x.lineTo(ox + 3 + turn, oy - 25); x.fill();
  C.circ(ox - 4 + turn, oy - 18, 4, '#ffffff'); C.circ(ox + 4 + turn, oy - 18, 4, '#ffffff');
  eye(ox - 4 + turn, oy - 18, 2, t, 50, 6); eye(ox + 4 + turn, oy - 18, 2, t, 50.03, 6);
  x.fillStyle = '#f0b25a'; x.beginPath(); x.moveTo(ox - 1.6 + turn, oy - 14); x.lineTo(ox + turn, oy - 11); x.lineTo(ox + 1.6 + turn, oy - 14); x.fill();
  // little scarf
  x.fillStyle = '#ff9fb8'; x.fillRect(ox - 7, oy - 4, 14, 3);
}
// ---------- street lamp ----------
function lamp(t) {
  const lx = 300, ly = 408;
  glow(lx, ly - 92, 60, 'rgba(255,225,150,A)', .45 + .05 * ph(t, 6));
  x.strokeStyle = '#6f6390'; x.lineWidth = 4; x.beginPath(); x.moveTo(lx, ly); x.lineTo(lx, ly - 84); x.stroke();
  x.fillStyle = '#6f6390'; C.rr(lx - 9, ly - 4, 18, 6, 2); x.fill();
  x.beginPath(); x.moveTo(lx - 10, ly - 84); x.lineTo(lx + 10, ly - 84); x.lineTo(lx + 7, ly - 102); x.lineTo(lx - 7, ly - 102); x.closePath(); x.fillStyle = '#fff1bf'; x.fill(); x.strokeStyle = '#6f6390'; x.lineWidth = 2; x.stroke();
  x.fillStyle = '#6f6390'; x.beginPath(); x.moveTo(lx - 11, ly - 102); x.lineTo(lx, ly - 110); x.lineTo(lx + 11, ly - 102); x.fill();
  x.fillStyle = '#ffffff'; x.beginPath(); x.ellipse(lx, ly - 108, 9, 3, 0, Math.PI, 0); x.fill();
}
// ---------- road + Toet ----------
function road() {
  x.fillStyle = '#ddd8ee'; x.fillRect(0, GROUND, W, 40);
  x.fillStyle = '#cfc8e6'; x.fillRect(0, GROUND + 14, W, 14);
  x.fillStyle = 'rgba(255,255,255,.7)'; for (let px = 10; px < W; px += 60) C.rr(px, GROUND + 19, 26, 3, 1.5), x.fill();
  // snow bank in front of the road
  const sg = x.createLinearGradient(0, GROUND + 30, 0, H); sg.addColorStop(0, '#fdfcff'); sg.addColorStop(1, '#e3def4');
  x.fillStyle = sg; x.beginPath(); x.moveTo(0, GROUND + 40);
  for (let px = 0; px <= W; px += 16) x.lineTo(px, GROUND + 36 - Math.abs(Math.sin(px / 37)) * 6);
  x.lineTo(W, H); x.lineTo(0, H); x.fill();
}
// Toet drives left → right once every 80 s (3 trips per loop), taking 46 s to cross, slowing down in the middle to look around
function toet(t) {
  const S = .36, LEN = 300 * S;
  let px, moving = true, dist;
  if (TB) { px = 420; moving = false; dist = 0; }
  else {
    const k = (t % 80) / 46; if (k > 1) return;
    // ease in the middle: slower around the village centre
    const u = k - .07 * Math.sin(k * TAU);
    px = lerp(-LEN - 40, W + 40, u);
    dist = u * 22 * TAU * 9;           // wheel turns: whole turns per trip -> seamless
  }
  const by = GROUND + 30 + (moving ? Math.sin(TAU * t / 0.8) * .6 : 0);
  // headlights
  const hx = px + 218 * S, hy = by - 22 * S;
  const g = x.createLinearGradient(hx, 0, hx + 120, 0); g.addColorStop(0, 'rgba(255,245,180,.5)'); g.addColorStop(1, 'rgba(255,245,180,0)');
  x.fillStyle = g; x.beginPath(); x.moveTo(hx, hy - 3); x.lineTo(hx + 120, hy - 18); x.lineTo(hx + 120, hy + 16); x.lineTo(hx, hy + 3); x.closePath(); x.fill();
  glow(hx, hy, 12, 'rgba(255,245,180,A)', .7);
  x.save(); x.translate(px + 74 * S, by); x.scale(S, S); x.translate(-310, -(T.ROAD + 20));
  T.truck({ t: TB ? 1 : t, dist, moving: false, bx: 310, happy: true, night: 1 });
  x.restore();
  // snow on Toet's roof
  x.fillStyle = '#ffffff'; x.beginPath(); x.ellipse(px + (74 + 25) * S, by - 120 * S, 80 * S, 6 * S, 0, Math.PI, 0); x.fill();
}
// ---------- hedgehog sledding (period 24 s: wait, slide down 7 s, walk back up 13 s) ----------
function hedgehog(t) {
  const c = t % 24;
  let px, dir = 1, sliding = false, walk = 0;
  if (c < 2) px = 50;
  else if (c < 9) { const k = sstep((c - 2) / 7); px = lerp(50, 270, k); sliding = true; }
  else if (c < 11) px = 270;
  else { const k = sstep((c - 11) / 13); px = lerp(270, 50, k); dir = -1; walk = c; }
  const slope = Math.atan2(hillY(px + 4) - hillY(px - 4), 8);
  const py = hillY(px) + 4;
  // sled (red-pink wooden sled with runners)
  const sx = dir > 0 ? px : px + 26;
  place(sx, hillY(sx) + 4, 1, false, Math.atan2(hillY(sx + 4) - hillY(sx - 4), 8));
  x.fillStyle = '#e88ba6'; C.rr(-16, -9, 32, 6, 3); x.fill(); edge(1);
  x.strokeStyle = '#9d6f8c'; x.lineWidth = 2; x.beginPath(); x.moveTo(-14, -3); x.lineTo(-12, 1); x.lineTo(14, 1); x.quadraticCurveTo(20, 1, 19, -5); x.stroke();
  x.restore();
  if (dir < 0) { // rope from hedgehog to sled
    x.strokeStyle = '#9d6f8c'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(px + 6, py - 8); x.quadraticCurveTo(px + 14, py - 2, sx - 16, hillY(sx) - 2); x.stroke();
  }
  const hy = sliding ? hillY(px) - 6 : py - 4 - (walk ? Math.abs(Math.sin(TAU * walk / .6)) * 1.5 : 0);
  place(px, hy, 1, dir < 0, slope * (dir < 0 ? -1 : 1));
  // spikes
  x.fillStyle = '#a58a8f'; x.beginPath();
  for (let k = 0; k <= 9; k++) { const a = Math.PI + k / 9 * Math.PI, r = k % 2 ? 13 : 17; x.lineTo(-2 + Math.cos(a) * r, -2 + Math.sin(a) * r); }
  x.closePath(); x.fill();
  x.fillStyle = '#f2dcc8'; x.beginPath(); x.ellipse(5, -3, 9, 7, 0, 0, 7); x.fill();
  x.beginPath(); x.ellipse(12, -3, 5, 4, 0, 0, 7); x.fill(); C.circ(16, -3.5, 1.6, INKE);
  eye(8, -6, 1.6, t, 60, 5); cheek(9, -1, 1.8);
  // wool hat
  x.fillStyle = '#8fc6ea'; x.beginPath(); x.arc(2, -13, 7, Math.PI, 0); x.fill(); C.circ(2, -21, 2.6, '#ffffff');
  // arms up while sliding
  if (sliding) { x.strokeStyle = '#f2dcc8'; x.lineWidth = 2.4; x.lineCap = 'round'; x.beginPath(); x.moveTo(4, -6); x.lineTo(-2, -16); x.stroke(); }
  x.restore();
}
// ---------- snowman ----------
function snowman(t) {
  const sx = 138, sy = 478;
  x.fillStyle = 'rgba(150,140,200,.25)'; x.beginPath(); x.ellipse(sx, sy + 2, 34, 6, 0, 0, 7); x.fill();
  C.circ(sx, sy - 22, 26, '#ffffff'); C.circ(sx, sy - 62, 19, '#ffffff'); C.circ(sx, sy - 92, 14, '#ffffff');
  x.beginPath(); x.arc(sx, sy - 22, 26, 0, 7); edge(1); x.beginPath(); x.arc(sx, sy - 62, 19, 0, 7); edge(1); x.beginPath(); x.arc(sx, sy - 92, 14, 0, 7); edge(1);
  [-70, -58, -46].forEach(b => C.circ(sx, sy + b + 2, 2.2, '#8a7fb5'));
  // stick arms; right arm waves (period 20 s, waves for 4 s)
  const c = t % 20, wv = c > 12 && c < 16 ? Math.sin((c - 12) / 4 * Math.PI) : 0, sw = Math.sin(TAU * c / .8) * wv;
  x.strokeStyle = '#8e7896'; x.lineWidth = 2.6; x.lineCap = 'round';
  x.beginPath(); x.moveTo(sx - 17, sy - 64); x.lineTo(sx - 40, sy - 76); x.moveTo(sx - 34, sy - 73); x.lineTo(sx - 38, sy - 82); x.stroke();
  const ang = -.4 - wv * .9 + sw * .25, ex = sx + 17 + Math.cos(ang) * 26, ey = sy - 64 + Math.sin(ang) * 26;
  x.beginPath(); x.moveTo(sx + 17, sy - 64); x.lineTo(ex, ey); x.stroke();
  // face
  eye(sx - 5, sy - 95, 2, t, 80, 5); eye(sx + 5, sy - 95, 2, t, 80.03, 5);
  x.fillStyle = '#ffa25c'; x.beginPath(); x.moveTo(sx, sy - 91); x.lineTo(sx + 12, sy - 88); x.lineTo(sx, sy - 86); x.fill();
  smile(sx, sy - 88, 5, 1.6); cheek(sx - 9, sy - 88, 2.4); cheek(sx + 9, sy - 88, 2.4);
  // scarf with a fluttering end
  x.fillStyle = '#ff8fab'; C.rr(sx - 16, sy - 81, 32, 7, 3); x.fill();
  const fl = ph(t, 30) * 3;
  x.beginPath(); x.moveTo(sx + 6, sy - 76); x.lineTo(sx + 12 + fl, sy - 56); x.lineTo(sx + 20 + fl, sy - 58); x.lineTo(sx + 13, sy - 76); x.fill();
  x.fillStyle = '#ffffff'; [0, 1, 2].forEach(k => x.fillRect(sx - 12 + k * 9, sy - 80, 3, 5));
  // hat
  x.fillStyle = '#7f7fc4'; C.rr(sx - 16, sy - 108, 32, 5, 2); x.fill(); C.rr(sx - 10, sy - 126, 20, 19, 3); x.fill();
  x.fillStyle = '#ffc6dc'; x.fillRect(sx - 10, sy - 112, 20, 4);
}
// ---------- frozen pond with skating bear cub + fox cub (one loop = 40 s) ----------
const PCX = 690, PCY = 488, PRX = 200, PRY = 36;
function pond() {
  x.fillStyle = '#cfe9f7'; x.beginPath(); x.ellipse(PCX, PCY, PRX + 10, PRY + 8, 0, 0, 7); x.fill();
  const g = x.createLinearGradient(0, PCY - PRY, 0, PCY + PRY); g.addColorStop(0, '#e8f6ff'); g.addColorStop(1, '#b9dcf2');
  x.fillStyle = g; x.beginPath(); x.ellipse(PCX, PCY, PRX, PRY, 0, 0, 7); x.fill();
  x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 2; [[-80, -10, 40], [40, 8, 54], [120, -6, 24]].forEach(([a, b, l]) => { x.beginPath(); x.moveTo(PCX + a, PCY + b); x.lineTo(PCX + a + l, PCY + b - 4); x.stroke(); });
  // skate track rings
  x.strokeStyle = 'rgba(160,190,225,.45)'; x.lineWidth = 1; x.beginPath(); x.ellipse(PCX - 88, PCY + 2, 66, 13, 0, 0, 7); x.stroke(); x.beginPath(); x.ellipse(PCX + 88, PCY + 2, 66, 13, 0, 0, 7); x.stroke();
}
function skater(t, o, kind) {
  // two separate little loops (bear on the left, fox on the right, turning opposite ways) so they never overlap
  const sgn = kind === 'bear' ? 1 : -1, a = TAU * (t / 40 + o) * sgn, cx = PCX + (kind === 'bear' ? -88 : 88) + Math.cos(a) * 66, cy = PCY + Math.sin(a) * 13;
  const flip = Math.sin(a) * sgn < 0;   // moving left along the back, right along the front
  const glide = Math.sin(TAU * t / 2 + o * 6);   // one push every 2 s
  x.fillStyle = 'rgba(120,140,190,.25)'; x.beginPath(); x.ellipse(cx, cy + 2, 16, 3, 0, 0, 7); x.fill();
  const s = 1.2 + Math.sin(a) * .1;
  place(cx, cy, s, flip, glide * .05);
  // legs + skates
  x.strokeStyle = kind === 'bear' ? '#a77b62' : '#e8925a'; x.lineWidth = 5; x.lineCap = 'round';
  x.beginPath(); x.moveTo(-4, -12); x.lineTo(-5 - glide * 3, 0); x.moveTo(4, -12); x.lineTo(5 + glide * 3, -1 + Math.max(0, glide) * -3); x.stroke();
  x.strokeStyle = '#8b93c9'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(-11 - glide * 3, 2); x.lineTo(1 - glide * 3, 2); x.moveTo(-1 + glide * 3, 1 - Math.max(0, glide) * 3); x.lineTo(11 + glide * 3, 1 - Math.max(0, glide) * 3); x.stroke();
  if (kind === 'bear') {
    x.fillStyle = '#b8896c'; x.beginPath(); x.ellipse(0, -20, 12, 13, 0, 0, 7); x.fill();
    x.fillStyle = '#e8cdb6'; x.beginPath(); x.ellipse(1, -18, 7, 8, 0, 0, 7); x.fill();
    // arms out for balance
    x.strokeStyle = '#b8896c'; x.lineWidth = 5; x.beginPath(); x.moveTo(-8, -24); x.lineTo(-18, -22 + glide * 3); x.moveTo(8, -24); x.lineTo(18, -22 - glide * 3); x.stroke();
    C.circ(-9, -46, 5, '#b8896c'); C.circ(9, -46, 5, '#b8896c'); C.circ(-9, -46, 2.6, '#e8cdb6'); C.circ(9, -46, 2.6, '#e8cdb6');
    C.circ(0, -38, 11, '#b8896c'); x.fillStyle = '#e8cdb6'; x.beginPath(); x.ellipse(2, -35, 5, 4, 0, 0, 7); x.fill(); C.circ(2, -37, 1.6, INKE);
    eye(-4, -40, 1.7, t, 90, 5); eye(6, -40, 1.7, t, 90.03, 5); cheek(-6, -34, 2); cheek(9, -34, 2);
    x.fillStyle = '#9fd4b5'; C.rr(-10, -30, 20, 5, 2); x.fill(); x.fillRect(-8 - glide * 2, -28, 4, 9);
  } else {
    // fluffy tail with white tip
    x.fillStyle = '#f19a5c'; x.beginPath(); x.ellipse(-15, -18, 10, 5, -.6 + glide * .15, 0, 7); x.fill();
    x.fillStyle = '#ffffff'; x.beginPath(); x.ellipse(-22, -23, 4, 3, -.6, 0, 7); x.fill();
    x.fillStyle = '#f19a5c'; x.beginPath(); x.ellipse(0, -20, 10, 12, 0, 0, 7); x.fill();
    x.fillStyle = '#fff3e6'; x.beginPath(); x.ellipse(2, -18, 6, 8, 0, 0, 7); x.fill();
    x.strokeStyle = '#f19a5c'; x.lineWidth = 4.4; x.beginPath(); x.moveTo(-7, -24); x.lineTo(-16, -21 + glide * 3); x.moveTo(7, -24); x.lineTo(16, -22 - glide * 3); x.stroke();
    x.fillStyle = '#f19a5c'; x.beginPath(); x.moveTo(-9, -40); x.lineTo(-8, -54); x.lineTo(-1, -44); x.fill(); x.beginPath(); x.moveTo(9, -40); x.lineTo(8, -54); x.lineTo(1, -44); x.fill();
    C.circ(0, -37, 10, '#f19a5c');
    x.fillStyle = '#fff3e6'; x.beginPath(); x.moveTo(-6, -35); x.quadraticCurveTo(4, -26, 13, -34); x.quadraticCurveTo(6, -40, -6, -35); x.fill(); C.circ(12, -35, 1.6, INKE);
    eye(-3, -40, 1.6, t, 95, 5); eye(5, -40, 1.6, t, 95.03, 5); cheek(-5, -33, 1.8);
    // knitted hat
    x.fillStyle = '#c3a6ec'; x.beginPath(); x.arc(0, -44, 8, Math.PI, 0); x.fill(); C.circ(0, -53, 2.4, '#ffffff');
  }
  x.restore();
  return cy;
}
function skaters(t) {
  skater(t, 0, 'bear'); skater(t, .25, 'fox');
}
// a few snowy bushes + little pine trees for depth
function bushes() {
  [[30, 402, 1], [240, 406, .8], [420, 404, .7], [920, 404, .9]].forEach(([bx, by, s]) => {
    x.fillStyle = '#9cc7b4'; x.beginPath(); x.moveTo(bx, by - 46 * s); x.lineTo(bx + 20 * s, by); x.lineTo(bx - 20 * s, by); x.fill();
    x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(bx, by - 46 * s); x.lineTo(bx + 9 * s, by - 26 * s); x.lineTo(bx - 9 * s, by - 26 * s); x.fill();
    x.beginPath(); x.ellipse(bx, by - 12 * s, 16 * s, 3 * s, 0, Math.PI, 0); x.fill();
  });
}
// front: little snowy pines + twinkling snow sparkles on the ground
function front(t) {
  [[420, 528, 1.1], [462, 534, .8], [940, 530, .9]].forEach(([bx, by, s]) => {
    x.fillStyle = 'rgba(140,130,190,.2)'; x.beginPath(); x.ellipse(bx, by + 2, 22 * s, 4 * s, 0, 0, 7); x.fill();
    x.fillStyle = '#a58a9c'; x.fillRect(bx - 3 * s, by - 8 * s, 6 * s, 9 * s);
    for (let j = 0; j < 3; j++) { const bb = by - 6 * s - j * 17 * s, w = (46 - j * 12) * s, h = 28 * s;
      x.fillStyle = '#8fbfae'; x.beginPath(); x.moveTo(bx, bb - h); x.lineTo(bx + w / 2, bb); x.lineTo(bx - w / 2, bb); x.closePath(); x.fill();
      x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(bx, bb - h); x.lineTo(bx + w * .2, bb - h * .55); x.quadraticCurveTo(bx, bb - h * .42, bx - w * .2, bb - h * .55); x.closePath(); x.fill();
      x.beginPath(); x.ellipse(bx, bb, w / 2, 3 * s, 0, Math.PI, 0); x.fill(); }
  });
  for (let i = 0; i < 14; i++) {
    const sx = 30 + hash(i + 600) * 900, sy = 448 + hash(i + 640) * 86;
    if (Math.abs(sx - PCX) < PRX + 14 && Math.abs(sy - PCY) < PRY + 10) continue;
    const k = Math.max(0, ph(t, 6 + i % 5 * 2, i)); if (k < .5) continue;
    x.globalAlpha = (k - .5) * 2; x.strokeStyle = '#ffffff'; x.lineWidth = 1.2; const r = 3 + (i % 3);
    x.beginPath(); x.moveTo(sx - r, sy); x.lineTo(sx + r, sy); x.moveTo(sx, sy - r); x.lineTo(sx, sy + r); x.stroke();
    x.strokeStyle = '#c9b8f0'; x.beginPath(); x.moveTo(sx - r * .5, sy); x.lineTo(sx + r * .5, sy); x.stroke();
  }
  x.globalAlpha = 1;
}
// ---------- falling snow (each flake returns to the same place every 240 s) ----------
function snow(t) {
  for (let i = 0; i < 70; i++) {
    const sp = 2 + i % 4, k = frac(hash(i + 300) + t / P * sp), sx = hash(i + 330) * W + Math.sin(TAU * (k * 2) + i) * 14;
    const sy = -10 + k * (H + 20), r = .9 + (i % 3) * .7;
    x.globalAlpha = .55 + (i % 3) * .15;
    C.circ(sx, sy, r, '#ffffff');
  }
  x.globalAlpha = 1;
}

function draw(t0) {
  const lt = t0, t = (t0 + T0) % P;
  sky();
  stars(t);
  moon(t);
  clouds(t);
  farHills();
  steam(t);
  village(t);
  owlTree(t);
  sledHill();
  bushes();
  hedgehog(t);
  lamp(t);
  road();
  toet(t);
  pond();
  skaters(t);
  snowman(t);
  front(t);
  snow(t);
  const fin = process.env.FADE || process.env.FADEIN, fout = process.env.FADE || process.env.FADEOUT;
  const f = Math.max(fin ? clamp(1 - lt / 3) : 0, fout ? clamp((lt - (DUR - 6)) / 6) : 0);
  if (f > 0) { x.fillStyle = `rgba(0,0,0,${f})`; x.fillRect(0, 0, W, H); }
}
if (require.main === module) C.run(draw, DUR, {});
