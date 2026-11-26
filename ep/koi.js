// Calm "Koi Pond" (90-min calm series). Everything is periodic with P seconds (seamless loop).
// A pastel garden pond on a soft spring-like morning: mint-peach sky with drifting clouds, soft far hills; a blossom tree whose pink
// petals drift down and land on the water with little ripple rings; a small waterfall trickling over rocks into the pond; a gently arched
// wooden footbridge over the back of the pond, and Little Truck Toet (electric, no exhaust) rolls slowly over it now and then; in the
// water five smiling koi (orange, white-red, gold, calico, cream) swim slow loops with waving tails and rising bubbles; lily pads with
// pink flowers and a frog that puffs its throat and hops from pad to pad; a turtle sunbathing on a rock who peeks out and nods; a snail
// on a stone; a dragonfly hovering and darting; reeds swaying; ripples and sparkles on the water.
const C = require('../lib/common'), T = require('../lib/toet');
const { x, W, H, clamp, lerp, hash } = C;
const P = 240, TAU = Math.PI * 2;
const DUR = +(process.env.DUR || P);
const T0 = +(process.env.T0 || 0);
const TB = !!process.env.THUMBBG;   // thumbnail background: Toet stands on top of the bridge
const ph = (t, m = 1, o = 0) => Math.sin(TAU * m * t / P + o);
const frac = v => v - Math.floor(v);
const sstep = k => { k = clamp(k); return k * k * (3 - 2 * k); };
const INKE = '#3d3a5c';
// every must divide 240 so the loop stays seamless
function eye(cx, cy, r, t, o = 0, every = 6) {
  const blink = ((t + o * 1.37) % every) < .17;
  if (blink) { x.strokeStyle = INKE; x.lineWidth = r * .5; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r * .8, .2, Math.PI - .2); x.stroke(); return; }
  C.circ(cx, cy, r, INKE); C.circ(cx + r * .35, cy - r * .38, r * .4, '#ffffff');
}
const smile = (cx, cy, r, w = 2) => { x.strokeStyle = INKE; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r, .3, Math.PI - .3); x.stroke(); };
const cheek = (cx, cy, r) => C.circ(cx, cy, r, 'rgba(255,120,150,.4)');
function place(px, py, s, flip, rot = 0) { x.save(); x.translate(px, py); x.rotate(rot); x.scale(flip ? -s : s, s); }
function glow(cx, cy, r, col, a) {
  const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0));
  x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
}
const ell = (cx, cy, rx, ry, col, rot = 0) => { x.fillStyle = col; x.beginPath(); x.ellipse(cx, cy, Math.max(.1, rx), Math.max(.1, ry), rot, 0, 7); x.fill(); };

// ---------- sky + far land ----------
function sky() {
  const g = x.createLinearGradient(0, 0, 0, 260);
  g.addColorStop(0, '#9fd8e6'); g.addColorStop(.6, '#d9eedd'); g.addColorStop(1, '#ffe3cf');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  glow(840, 70, 120, 'rgba(255,240,200,A)', .55); C.circ(840, 70, 30, '#fff1c4');
}
function clouds(t) {
  [[0, 50, .9], [.33, 110, .7], [.66, 70, .6]].forEach(([o, cy, s]) => {
    const cx = -160 + frac(t / P + o) * (W + 320);
    x.fillStyle = 'rgba(255,255,255,.8)';
    [[0, 0, 30], [30, -10, 22], [-30, -4, 20], [54, 4, 16], [-52, 6, 15]].forEach(([a, b, r]) => { x.beginPath(); x.arc(cx + a * s, cy + b * s, r * s, 0, 7); x.fill(); });
  });
}
function hills() {
  x.fillStyle = '#b9d7c9'; x.beginPath(); x.moveTo(0, 240);
  for (let px = 0; px <= W; px += 16) x.lineTo(px, 205 - Math.sin(px / 140 + .6) * 16 - Math.sin(px / 47) * 4);
  x.lineTo(W, 280); x.lineTo(0, 280); x.fill();
  x.fillStyle = '#a5cf9f'; x.beginPath(); x.moveTo(0, 260);
  for (let px = 0; px <= W; px += 16) x.lineTo(px, 232 - Math.sin(px / 190 + 2) * 10);
  x.lineTo(W, 300); x.lineTo(0, 300); x.fill();
  // far bank meadow
  const g = x.createLinearGradient(0, 240, 0, 320); g.addColorStop(0, '#b5dc96'); g.addColorStop(1, '#9fcf88');
  x.fillStyle = g; x.beginPath(); x.moveTo(0, 262);
  for (let px = 0; px <= W; px += 16) x.lineTo(px, 254 - Math.sin(px / 120 + 1) * 5);
  x.lineTo(W, 330); x.lineTo(0, 330); x.fill();
  // round bushes along the far bank
  [[430, 262, 26, '#8cc47e'], [462, 266, 20, '#9ad08a'], [930, 262, 28, '#8cc47e'], [905, 268, 18, '#9ad08a']].forEach(([a, b, r, c]) => C.circ(a, b, r, c));
}
// blossom tree on the far bank; petals drift down onto the water
const TRX = 300, TRY = 270;
function tree(t) {
  x.fillStyle = '#9b7a6e'; x.beginPath(); x.moveTo(TRX - 10, TRY); x.quadraticCurveTo(TRX - 4, TRY - 50, TRX - 26, TRY - 90); x.lineTo(TRX - 16, TRY - 94);
  x.quadraticCurveTo(TRX + 4, TRY - 60, TRX + 10, TRY - 80); x.lineTo(TRX + 18, TRY - 76); x.quadraticCurveTo(TRX + 10, TRY - 40, TRX + 12, TRY); x.fill();
  const sw = ph(t, 8) * 2;
  [[-60, -110, 44], [-10, -132, 50], [44, -112, 44], [-34, -84, 36], [26, -82, 36], [76, -90, 28], [-84, -86, 26]].forEach(([a, b, r], i) => {
    C.circ(TRX + a + sw * (i % 2 ? 1 : -.6), TRY + b, r, i % 3 ? '#f7c6d6' : '#f3b3c9');
  });
  for (let i = 0; i < 26; i++) {
    const a = hash(i + 40) * TAU, rr = 20 + hash(i + 70) * 80;
    C.circ(TRX + Math.cos(a) * rr * 1.1 + sw, TRY - 104 + Math.sin(a) * rr * .45, 2.4, i % 2 ? '#ffffff' : '#ffe3ec');
  }
  // two birds peek out of the canopy now and then? -> a little bird sits on a branch and bobs
  const bx = TRX + 60, by = TRY - 118 + Math.abs(ph(t, 40)) * -2;
  ell(bx, by, 9, 7, '#8fb8e8'); C.circ(bx + 7, by - 5, 5.5, '#8fb8e8'); ell(bx - 2, by + 1, 5, 3.5, '#bcd6f2', -.3);
  x.fillStyle = '#f2a14a'; x.beginPath(); x.moveTo(bx + 12, by - 6); x.lineTo(bx + 17, by - 4); x.lineTo(bx + 12, by - 3); x.fill();
  eye(bx + 8, by - 6, 1.4, t, 7, 4);
}
// petals: drift down from the canopy and land on the pond (ripple ring), then float slowly and fade
function petals(t) {
  for (let i = 0; i < 9; i++) {
    const per = 24, o = hash(i + 300) * per, k = ((t + o) % per) / per;   // 24 s cycle (divides 240)
    const sx = TRX - 70 + hash(i + 320) * 160, ex = sx + 60 + hash(i + 340) * 120, ey = 340 + hash(i + 360) * 70;
    if (k < .55) {
      const u = k / .55, px = lerp(sx, ex, u) + Math.sin(u * 9 + i) * 12, py = lerp(TRY - 90, ey, u);
      x.save(); x.translate(px, py); x.rotate(Math.sin(u * 7 + i) * .8); ell(0, 0, 4, 2.4, '#ffd0de'); x.restore();
    } else {
      const u = (k - .55) / .45, px = ex + u * 18;
      x.globalAlpha = 1 - u;
      ell(px, ey, 4, 2, '#ffd0de');
      x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 1.2; x.beginPath(); x.ellipse(ex, ey, 4 + u * 26, 1.5 + u * 7, 0, 0, 7); x.stroke();
      x.globalAlpha = 1;
    }
  }
}
// ---------- pond ----------
const PTOP = 300;
function pond(t) {
  // soft bank rim
  x.fillStyle = '#c9b9a4'; x.beginPath(); x.moveTo(0, PTOP - 8);
  for (let px = 0; px <= W; px += 12) x.lineTo(px, PTOP - 8 + Math.sin(px / 60) * 3);
  x.lineTo(W, H); x.lineTo(0, H); x.fill();
  const g = x.createLinearGradient(0, PTOP, 0, H); g.addColorStop(0, '#a8dde0'); g.addColorStop(.5, '#7fc6d0'); g.addColorStop(1, '#66b3c4');
  x.fillStyle = g; x.beginPath(); x.moveTo(0, PTOP);
  for (let px = 0; px <= W; px += 12) x.lineTo(px, PTOP + Math.sin(px / 60) * 3);
  x.lineTo(W, H); x.lineTo(0, H); x.fill();
  // pebbles on the bottom (soft, blurred look)
  for (let i = 0; i < 30; i++) ell(hash(i + 500) * W, 340 + hash(i + 530) * 190, 8 + hash(i + 560) * 10, 4 + hash(i + 590) * 4, 'rgba(90,150,160,.25)');
  // shimmer lines
  for (let i = 0; i < 16; i++) {
    const sx = hash(i + 600) * W + ph(t, 6, i) * 14, sy = 316 + hash(i + 620) * 210;
    x.globalAlpha = .25 + .25 * ph(t, 12 + (i % 4) * 2, i);
    x.fillStyle = '#ffffff'; x.fillRect(sx, sy, 18 + hash(i + 640) * 22, 1.6);
  }
  x.globalAlpha = 1;
}
// waterfall over the rocks on the left back bank
function waterfall(t) {
  const rocks = [[40, 300, 46, 30, '#b4a9b8'], [110, 296, 40, 26, '#c3b8c6'], [70, 268, 42, 30, '#c3b8c6'], [20, 262, 30, 28, '#b4a9b8'], [130, 270, 28, 22, '#b4a9b8']];
  rocks.forEach(([a, b, rx, ry, c]) => { ell(a, b, rx, ry, c); ell(a - rx * .25, b - ry * .35, rx * .45, ry * .3, 'rgba(255,255,255,.25)'); });
  // falling water ribbon
  const wx = 78, wy = 252, wh = 64;
  const g = x.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, '#d8f4f6'); g.addColorStop(1, '#a6e0e6');
  x.fillStyle = g; x.beginPath(); x.moveTo(wx - 12, wy); x.quadraticCurveTo(wx - 16, wy + wh * .6, wx - 20, wy + wh); x.lineTo(wx + 20, wy + wh); x.quadraticCurveTo(wx + 16, wy + wh * .6, wx + 12, wy); x.fill();
  for (let i = 0; i < 6; i++) {
    const k = frac(t / 1.5 + i / 6), yy = wy + k * wh;
    x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(wx - 8 + (i % 3) * 7, yy); x.lineTo(wx - 8 + (i % 3) * 7, yy + 8); x.stroke();
  }
  // splash foam + rings
  [[-14, 0, 9], [0, 3, 11], [14, 0, 9]].forEach(([a, b, r], i) => C.circ(wx + a, wy + wh + b + Math.sin(TAU * t / 1.2 + i) * 1.5, r, 'rgba(255,255,255,.85)'));
  for (let i = 0; i < 3; i++) {
    const k = frac(t / 3 + i / 3);
    x.strokeStyle = `rgba(255,255,255,${.7 * (1 - k)})`; x.lineWidth = 1.4; x.beginPath(); x.ellipse(wx, wy + wh + 6, 16 + k * 40, 4 + k * 10, 0, 0, 7); x.stroke();
  }
}
// arched wooden footbridge; Toet rolls over it twice per loop
const BL = 560, BR = 880, BY = 318, BA = 54;
const bridgeY = px => BY - BA * Math.sin(Math.PI * clamp((px - BL) / (BR - BL)));
function bridgeBack() {
  // posts in the water + reflections
  for (let i = 0; i <= 6; i++) {
    const px = lerp(BL + 20, BR - 20, i / 6), py = bridgeY(px);
    x.fillStyle = '#c98f7c'; x.fillRect(px - 3, py, 6, BY + 12 - py);
    x.fillStyle = 'rgba(201,143,124,.25)'; x.fillRect(px - 3, BY + 12, 6, 14);
  }
}
function railing() {
  x.strokeStyle = '#f2b8a2'; x.lineWidth = 3.5; x.beginPath();
  for (let px = BL + 8; px <= BR - 8; px += 6) { const py = bridgeY(px) - 22; px === BL + 8 ? x.moveTo(px, py) : x.lineTo(px, py); } x.stroke();
  for (let i = 0; i <= 8; i++) { const px = lerp(BL + 10, BR - 10, i / 8), py = bridgeY(px); x.lineWidth = 3; x.beginPath(); x.moveTo(px, py - 3); x.lineTo(px, py - 24); x.stroke(); C.circ(px, py - 25, 3, '#f7cdbb'); }
}
function bridgeFront() {
  x.strokeStyle = '#e9a58f'; x.lineWidth = 9; x.lineCap = 'round'; x.beginPath();
  for (let px = BL; px <= BR; px += 6) { const py = bridgeY(px); px === BL ? x.moveTo(px, py) : x.lineTo(px, py); } x.stroke();
  x.strokeStyle = '#d98f7a'; x.lineWidth = 2; x.beginPath();
  for (let px = BL + 4; px <= BR - 4; px += 6) { const py = bridgeY(px) + 4; px === BL + 4 ? x.moveTo(px, py) : x.lineTo(px, py); } x.stroke();
}
function toet(t) {
  const S = .2, LEN = 300 * S;
  let px, dist;
  if (TB) { px = (BL + BR) / 2 - 30; dist = 0; }
  else {
    const k = (t % 120) / 70; if (k > 1) return;   // twice per loop, 70 s to cross (left → right)
    const u = k - .06 * Math.sin(k * TAU);
    px = lerp(BL - LEN - 120, BR + 120, u);
    dist = u * 22 * TAU * 8;
  }
  const cx = px + LEN / 2, y0 = cx < BL || cx > BR ? BY : bridgeY(cx);
  const rot = cx > BL && cx < BR ? -Math.atan(BA * Math.PI / (BR - BL) * Math.cos(Math.PI * (cx - BL) / (BR - BL))) * .9 : 0;
  // only visible on the bridge and the bank paths: hide where it would float over the water
  x.save(); x.translate(cx, y0 - 4.5); x.rotate(rot); x.scale(S, S); x.translate(-310 - 74, -(T.ROAD + 20) - 46);
  T.truck({ t: TB ? 1 : t, dist, moving: false, bx: 310, happy: true });
  x.restore();
}
// little gravel paths to the bridge on both banks
function paths() {
  // sandy shore path along the back of the pond (Toet drives on it to and from the bridge)
  [[130, BL + 8], [BR - 8, W + 10]].forEach(([a, b]) => {
    x.fillStyle = '#e9dcc6'; x.beginPath(); x.moveTo(a, BY - 16); x.lineTo(b, BY - 16); x.lineTo(b, BY + 6); x.lineTo(a, BY + 6); x.fill();
    x.fillStyle = '#d6c4a8'; x.fillRect(a, BY + 3, b - a, 3);
    for (let i = 0; i < 14; i++) C.circ(a + hash(i + (a | 0)) * (b - a), BY - 10 + hash(i + 77 + (a | 0)) * 12, 1.6, '#cdb998');
  });
}
// ---------- koi (seen from above) ----------
const KOI = [
  { cx: 420, cy: 378, rx: 105, ry: 20, m: 5, o: 0, s: 1.1, base: '#ff9a5c', spot: '#fff4ea', dir: 1 },
  { cx: 560, cy: 446, rx: 140, ry: 24, m: 4, o: 2.1, s: 1, base: '#fff6ee', spot: '#ff7a6b', dir: -1 },
  { cx: 650, cy: 378, rx: 62, ry: 16, m: 6, o: 4.2, s: .85, base: '#ffd36b', spot: '#fff2c4', dir: 1 },
  { cx: 385, cy: 494, rx: 110, ry: 18, m: 5, o: 1.1, s: .9, base: '#fff6ee', spot: '#ff9a5c', spot2: '#4a4a66', dir: -1 },
  { cx: 655, cy: 500, rx: 100, ry: 14, m: 4, o: 3.3, s: .9, base: '#ffe7c7', spot: '#ffb36b', dir: 1 },
];
function koiAt(k, t) {
  const a = k.dir * TAU * k.m * t / P + k.o;
  const px = k.cx + Math.cos(a) * k.rx + Math.sin(a * 2) * 6, py = k.cy + Math.sin(a) * k.ry;
  const dx = -Math.sin(a) * k.rx * k.dir + Math.cos(a * 2) * 12 * k.dir, dy = Math.cos(a) * k.ry * k.dir;
  return [px, py, Math.atan2(dy, dx)];
}
function koi(k, i, t) {
  const [px, py, ang] = koiAt(k, t);
  // shadow + ripple trail
  ell(px + 6, py + 8, 26 * k.s, 9 * k.s, 'rgba(40,90,110,.18)', ang);
  x.save(); x.translate(px, py); x.rotate(ang); x.scale(k.s, k.s);
  const wag = Math.sin(TAU * t / 1.2 + i) * .35;
  // tail fan
  x.save(); x.translate(-20, 0); x.rotate(wag);
  x.fillStyle = k.base; x.globalAlpha = .9; x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(-14, -16, -22, -12); x.quadraticCurveTo(-16, 0, -22, 12); x.quadraticCurveTo(-14, 16, 0, 0); x.fill();
  x.globalAlpha = 1; x.restore();
  // pectoral fins
  const fl = Math.sin(TAU * t / 1.5 + i) * .3;
  [[1, -1], [1, 1]].forEach(([, sgn]) => { x.save(); x.translate(8, sgn * 7); x.rotate(sgn * (1 + fl)); ell(4, 0, 7, 3.5, 'rgba(255,255,255,.75)'); x.restore(); });
  // body
  x.save(); x.beginPath(); x.ellipse(0, 0, 24, 9.5, 0, 0, 7); x.clip();
  x.fillStyle = k.base; x.fillRect(-30, -12, 60, 24);
  C.circ(-4, -4, 7, k.spot); C.circ(10, 5, 5, k.spot); C.circ(-14, 4, 4, k.spot);
  if (k.spot2) { C.circ(4, -6, 3, k.spot2); C.circ(-10, -2, 2.5, k.spot2); }
  x.restore();
  ell(-2, -3, 14, 3, 'rgba(255,255,255,.35)');
  // face: two eyes on top of the head + a little smile at the nose
  eye(15, -4.5, 2.2, t, i * 3, 6); eye(15, 4.5, 2.2, t, i * 3 + .01, 6);
  x.strokeStyle = INKE; x.lineWidth = 1.4; x.lineCap = 'round'; x.beginPath(); x.arc(18, 0, 4, -1, 1); x.stroke();
  cheek(18, -6.5, 1.8); cheek(18, 6.5, 1.8);
  x.restore();
  // bubbles rising from this koi now and then (cycle 12 s)
  const c = (t + i * 2.4) % 12;
  if (c < 3) {
    const u = c / 3, [bx, by] = koiAt(k, t - c);
    for (let j = 0; j < 3; j++) {
      const v = clamp(u * 1.4 - j * .2); if (v <= 0 || v >= 1) continue;
      x.strokeStyle = `rgba(255,255,255,${.85 * (1 - v)})`; x.lineWidth = 1.2; x.beginPath(); x.arc(bx + Math.cos(ang) * 22 + j * 3, by - v * 14 - j * 3, 2 + j, 0, 7); x.stroke();
    }
  }
}
// ---------- lily pads + frog ----------
const PADS = [[170, 400, 40], [250, 452, 34], [120, 470, 36], [210, 510, 30]];
function pads(t) {
  PADS.forEach(([a, b, r], i) => {
    const bob = Math.sin(TAU * t / 6 + i) * 1.2;
    ell(a + 3, b + 4 + bob, r, r * .38, 'rgba(40,90,90,.18)');
    x.fillStyle = i % 2 ? '#8ccc7a' : '#7cc06e'; x.beginPath(); x.ellipse(a, b + bob, r, r * .38, 0, .25, TAU - .05); x.lineTo(a, b + bob); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.3)'; x.lineWidth = 1.2; for (let v = 0; v < 5; v++) { const an = .6 + v * 1.1; x.beginPath(); x.moveTo(a, b + bob); x.lineTo(a + Math.cos(an) * r * .8, b + bob + Math.sin(an) * r * .3); x.stroke(); }
  });
  // two lotus flowers that slowly open and close
  [[136, 392, 0], [232, 446, 3]].forEach(([a, b, o]) => {
    const op = .55 + .45 * (ph(t, 2, o) * .5 + .5);
    for (let p = 0; p < 6; p++) {
      const an = -Math.PI / 2 + (p - 2.5) * .42 * op;
      x.save(); x.translate(a, b); x.rotate(an + Math.PI / 2); ell(0, -9, 4.5, 10, p % 2 ? '#ffc4d6' : '#ffb0c8'); x.restore();
    }
    C.circ(a, b - 3, 3.4, '#ffe08a');
  });
}
// the frog sits on a pad and hops to the next one every 30 s (8 hops per loop, 4 pads, back and forth)
function frog(t) {
  const seq = [0, 1, 3, 2, 0, 2, 3, 1], c = t % 30, n = Math.floor(t / 30) % 8;
  const A = PADS[seq[n]], B = PADS[seq[(n + 1) % 8]];
  let fx, fy, hopH = 0, s = 1;
  if (c < 28) { fx = A[0]; fy = A[1] - 6; }
  else { const u = sstep((c - 28) / 2); fx = lerp(A[0], B[0], u); fy = lerp(A[1], B[1], u) - 6; hopH = Math.sin(Math.PI * u) * 34; s = 1 + Math.sin(Math.PI * u) * .1; }
  const flip = (c >= 28 ? B[0] < A[0] : false);
  const puff = c < 28 && (c % 10) > 6 ? Math.sin(Math.PI * ((c % 10) - 6) / 4) : 0;
  place(fx, fy - hopH, s * .9, flip);
  ell(0, 2, 16, 10, '#9bd56a');
  if (puff > 0) ell(6, 6, 7 + puff * 5, 5 + puff * 4, '#e8f6c6');
  ell(-11, 9, 7, 4, '#86c25a'); ell(11, 9, 7, 4, '#86c25a');
  C.circ(-7, -9, 6, '#9bd56a'); C.circ(7, -9, 6, '#9bd56a');
  eye(-7, -10, 3, t, 11, 5); eye(7, -10, 3, t, 11.01, 5);
  smile(0, -2, 6, 1.8); cheek(-11, 0, 2.6); cheek(11, 0, 2.6);
  x.restore();
}
// turtle sunbathing on a rock: head peeks out and nods; little sparkle of sunshine
function turtle(t) {
  const rx = 790, ry = 440;
  ell(rx + 4, ry + 14, 56, 14, 'rgba(40,90,110,.2)');
  ell(rx, ry, 52, 22, '#c6bccb'); ell(rx - 12, ry - 8, 22, 8, 'rgba(255,255,255,.3)');
  const c = t % 40, out = c < 6 ? sstep(c / 2) * (c < 4 ? 1 : 1) : 1;
  const nod = Math.max(0, Math.sin(TAU * t / 8)) * 3;
  const hx = 836 + out * 6 - 6, hy = ry - 30 + nod;
  // legs
  ell(rx - 18, ry - 16, 7, 4, '#9fd18e'); ell(rx + 22, ry - 16, 7, 4, '#9fd18e');
  // head
  x.strokeStyle = '#9fd18e'; x.lineWidth = 9; x.lineCap = 'round'; x.beginPath(); x.moveTo(rx + 24, ry - 24); x.lineTo(hx - 6, hy + 2); x.stroke();
  C.circ(hx, hy, 9, '#9fd18e'); eye(hx + 3, hy - 2, 2, t, 13, 8); smile(hx + 3, hy + 2, 3.5, 1.4); cheek(hx + 7, hy + 2, 1.8);
  // shell
  x.fillStyle = '#6fb487'; x.beginPath(); x.ellipse(rx, ry - 26, 30, 18, 0, Math.PI, 0); x.lineTo(rx + 30, ry - 24); x.lineTo(rx - 30, ry - 24); x.fill();
  x.strokeStyle = 'rgba(255,255,255,.45)'; x.lineWidth = 1.6;
  x.beginPath(); x.moveTo(rx - 14, ry - 25); x.lineTo(rx - 8, ry - 38); x.lineTo(rx + 8, ry - 38); x.lineTo(rx + 14, ry - 25); x.stroke();
  x.beginPath(); x.moveTo(rx - 8, ry - 38); x.lineTo(rx - 4, ry - 43); x.moveTo(rx + 8, ry - 38); x.lineTo(rx + 4, ry - 43); x.stroke();
  // ripple rings around the rock
  for (let i = 0; i < 2; i++) { const k = frac(t / 5 + i / 2); x.strokeStyle = `rgba(255,255,255,${.5 * (1 - k)})`; x.lineWidth = 1.2; x.beginPath(); x.ellipse(rx, ry + 6, 58 + k * 30, 16 + k * 8, 0, 0, 7); x.stroke(); }
}
// snail on a stone at the right front bank
function snail(t) {
  const sx = 900 + ph(t, 1) * 10, sy = 506;
  ell(905, 516, 46, 16, '#bdb2c2');
  const st = 1 + Math.sin(TAU * t / 4) * .04;
  x.fillStyle = '#ffe2b8'; x.beginPath(); x.moveTo(sx - 20, sy + 2); x.quadraticCurveTo(sx, sy - 2, sx + 18 * st, sy - 2); x.quadraticCurveTo(sx + 26 * st, sy - 18, sx + 20 * st, sy - 20); x.lineTo(sx + 14 * st, sy - 6); x.lineTo(sx - 20, sy + 4); x.fill();
  x.strokeStyle = '#ffe2b8'; x.lineWidth = 2; x.beginPath(); x.moveTo(sx + 20 * st, sy - 18); x.lineTo(sx + 24 * st, sy - 30); x.moveTo(sx + 17 * st, sy - 18); x.lineTo(sx + 16 * st, sy - 30); x.stroke();
  C.circ(sx + 24 * st, sy - 31, 2.4, '#ffe2b8'); C.circ(sx + 16 * st, sy - 31, 2.4, '#ffe2b8');
  eye(sx + 19 * st, sy - 13, 1.8, t, 17, 6); smile(sx + 21 * st, sy - 9, 2.5, 1.2);
  C.circ(sx - 4, sy - 12, 13, '#d9a6d8');
  x.strokeStyle = '#b77fb6'; x.lineWidth = 2; x.beginPath(); for (let a = 0; a < 12; a += .3) { const r = 11 - a * .85; x.lineTo(sx - 4 + Math.cos(a) * r, sy - 12 + Math.sin(a) * r); } x.stroke();
}
// dragonfly: hovers at a spot, then darts to the next (8 spots per loop, 30 s each)
const DSP = [[380, 330], [520, 300], [690, 360], [330, 380], [480, 350], [740, 320], [600, 380], [430, 300]];
function dragonfly(t) {
  const n = Math.floor(t / 30) % 8, c = t % 30, A = DSP[n], B = DSP[(n + 1) % 8];
  let px = A[0], py = A[1];
  if (c > 27) { const u = sstep((c - 27) / 3); px = lerp(A[0], B[0], u); py = lerp(A[1], B[1], u) - Math.sin(Math.PI * u) * 20; }
  px += Math.sin(TAU * t / 4) * 6; py += Math.sin(TAU * t / 3) * 4;
  const flip = c > 27 ? B[0] < A[0] : (n % 2 === 1);
  place(px, py, .9, flip);
  const f = Math.sin(TAU * t * 6) * .5 + .5;
  x.globalAlpha = .65; ell(-2, -6, 13, 4 + f * 2, '#e8f8ff', -.35); ell(-2, -6, 13, 4 + f * 2, '#e8f8ff', .35 + Math.PI); ell(4, -5, 11, 3.5 + f * 2, '#e8f8ff', -.6); ell(4, -5, 11, 3.5 + f * 2, '#e8f8ff', .6 + Math.PI); x.globalAlpha = 1;
  x.strokeStyle = '#7b8ff0'; x.lineWidth = 3.4; x.lineCap = 'round'; x.beginPath(); x.moveTo(4, 0); x.lineTo(-24, 2); x.stroke();
  C.circ(8, -1, 5, '#7b8ff0'); eye(10, -2, 1.6, t, 19, 4);
  x.restore();
}
// reeds swaying in the front corners + grassy front bank
function reeds(t) {
  [[18, 540, 0], [34, 540, 1], [52, 540, 2], [930, 470, 3], [946, 474, 4], [700, 540, 5], [716, 540, 6]].forEach(([rx, ry, i]) => {
    const sw = ph(t, 10, i) * 4, h = 70 + (i % 3) * 14;
    x.strokeStyle = '#6fa462'; x.lineWidth = 2.6; x.beginPath(); x.moveTo(rx, ry); x.quadraticCurveTo(rx + sw / 2, ry - h / 2, rx + sw, ry - h); x.stroke();
    ell(rx + sw, ry - h + 6, 3.6, 10, '#a77d62');
    x.strokeStyle = '#86bb73'; x.lineWidth = 2; x.beginPath(); x.moveTo(rx + 2, ry); x.quadraticCurveTo(rx + 12 + sw, ry - h * .35, rx + 18 + sw, ry - h * .5); x.stroke();
  });
}

function draw(t0) {
  const lt = t0, t = (t0 + T0) % P;
  sky();
  clouds(t);
  hills();
  tree(t);
  pond(t);
  paths();
  bridgeBack();
  railing();
  toet(t);
  waterfall(t);
  bridgeFront();
  KOI.forEach((k, i) => koi(k, i, t));
  pads(t);
  frog(t);
  turtle(t);
  petals(t);
  dragonfly(t);
  snail(t);
  reeds(t);
  const fin = process.env.FADE || process.env.FADEIN, fout = process.env.FADE || process.env.FADEOUT;
  const f = Math.max(fin ? clamp(1 - lt / 3) : 0, fout ? clamp((lt - (DUR - 6)) / 6) : 0);
  if (f > 0) { x.fillStyle = `rgba(0,0,0,${f})`; x.fillRect(0, 0, W, H); }
}
if (require.main === module) C.run(draw, DUR, {});
