// Calm "Starry Space Trip" (90-min calm series). Everything is periodic with P seconds (seamless loop).
// A soft pastel night sky in space: twinkling stars, drifting pastel nebula clouds, a smiling Earth slowly turning, a big peach ringed planet
// with a sleepy face, a lilac moon surface at the bottom with craters. On the moon: a bunny astronaut in a bubble helmet doing slow low-gravity
// hops, a little moon house (dome) with a round window where a hamster waves, a flag with a heart. In the sky: a little rocket with a bear cub
// waving from the porthole circles slowly, a kitten sleeps in a crescent-moon hammock that rocks gently, a puppy in a little round flying saucer
// glides by, a comet with a sparkly tail, a slowly spinning satellite with a smile, now and then a gentle shooting star.
const C = require('../lib/common');
const { x, W, H, clamp, lerp, hash } = C;
const P = 240, TAU = Math.PI * 2;
const DUR = +(process.env.DUR || P);
const T0 = +(process.env.T0 || 0);
const TB = !!process.env.THUMBBG;   // thumbnail background: hammock a bit lower, no satellite (room for the title)
const ph = (t, m = 1, o = 0) => Math.sin(TAU * m * t / P + o);
const frac = v => v - Math.floor(v);
const INKE = '#3d3358';
const OUTL = 'rgba(60,50,90,.35)';
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
const sleepEye = (cx, cy, r) => { x.strokeStyle = INKE; x.lineWidth = Math.max(1.4, r * .45); x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy - r * .3, r, .35, Math.PI - .35); x.stroke(); };
const smile = (cx, cy, r, w = 2.2) => { x.strokeStyle = INKE; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r, .3, Math.PI - .3); x.stroke(); };
const cheek = (cx, cy, r) => C.circ(cx, cy, r, 'rgba(255,130,170,.45)');
function place(px, py, s, flip, rot = 0) { x.save(); x.translate(px, py); x.rotate(rot); x.scale(flip ? -s : s, s); }

// ---------- sky ----------
function sky() {
  const g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#2b2d6e'); g.addColorStop(.45, '#4b4592'); g.addColorStop(.8, '#8a6fb4'); g.addColorStop(1, '#c9a3cf');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
}
function nebula(t) {
  [[.0, 160, 'rgba(255,170,210,A)', 170], [.33, 250, 'rgba(150,200,255,A)', 190], [.66, 120, 'rgba(200,170,255,A)', 150]].forEach(([o, cy, col, r], i) => {
    const cx = -200 + frac(t / P + o) * (W + 400);
    glow(cx, cy + ph(t, 3, i) * 14, r, col, .2); glow(cx + r * .6, cy + 30, r * .7, col, .13);
  });
}
function stars(t) {
  for (let i = 0; i < 90; i++) {
    const sx = hash(i + 1) * W, sy = hash(i + 101) * 400, m = 4 + (i % 9) * 2;
    const tw = .45 + .55 * Math.abs(ph(t, m, i));
    x.globalAlpha = tw * (sy > 330 ? .5 : 1);
    const r = .8 + hash(i + 201) * 1.6;
    C.circ(sx, sy, r, i % 5 ? '#ffffff' : '#fff2b0');
    if (i % 11 === 0) { x.strokeStyle = '#fff6d0'; x.lineWidth = .8; x.beginPath(); x.moveTo(sx - r * 3, sy); x.lineTo(sx + r * 3, sy); x.moveTo(sx, sy - r * 3); x.lineTo(sx, sy + r * 3); x.stroke(); }
  }
  x.globalAlpha = 1;
}
// a few big friendly stars with faces
function faceStars(t) {
  [[356, 214, 12, 0], [660, 52, 11, 1], [880, 240, 10, 2], [44, 330, 10, 3]].forEach(([sx, sy, r, i]) => {
    const s = 1 + ph(t, 20, i) * .06;
    glow(sx, sy, r * 3.2, 'rgba(255,240,170,A)', .35);
    place(sx, sy, s, false, ph(t, 4, i) * .12);
    x.fillStyle = '#ffe68a'; x.beginPath();
    for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * .5 : r; x.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    x.closePath(); x.fill(); edge(1);
    eye(-r * .25, -r * .05, r * .12, t, 20 + i, 6); eye(r * .25, -r * .05, r * .12, t, 20.04 + i, 6); smile(0, r * .12, r * .18, 1.2);
    x.restore();
  });
}
// ---------- earth ----------
function earth(t) {
  const ex = 176, ey = 112 + ph(t, 2) * 4, R = 46;
  glow(ex, ey, R * 1.8, 'rgba(150,210,255,A)', .35);
  x.save(); x.beginPath(); x.arc(ex, ey, R, 0, 7); x.clip();
  C.circ(ex, ey, R, '#7cc3ef');
  // land masses slide around once per loop
  const sh = frac(t / P) * 200;
  [[0, -18, 26, 14], [50, 10, 22, 18], [100, -6, 30, 12], [150, 22, 18, 10]].forEach(([lx, ly, rw, rh]) => {
    for (const off of [0, 200]) { const px = ex - 100 + ((lx + sh + off) % 400) - 100; x.fillStyle = '#9fdc8c'; x.beginPath(); x.ellipse(px, ey + ly, rw, rh, .3, 0, 7); x.fill(); }
  });
  x.fillStyle = 'rgba(255,255,255,.75)'; [[-20, -32, 22], [24, 26, 18]].forEach(([a, b, w], i) => { x.beginPath(); x.ellipse(ex + a + ph(t, 4, i) * 6, ey + b, w, 5, 0, 0, 7); x.fill(); });
  const sg = x.createRadialGradient(ex - 18, ey - 18, 4, ex, ey, R); sg.addColorStop(0, 'rgba(255,255,255,.25)'); sg.addColorStop(1, 'rgba(40,40,110,.25)');
  x.fillStyle = sg; x.fillRect(ex - R, ey - R, 2 * R, 2 * R);
  x.restore();
  x.beginPath(); x.arc(ex, ey, R, 0, 7); edge(1.4);
  eye(ex - 14, ey - 4, 4, t, 1, 8); eye(ex + 14, ey - 4, 4, t, 1.04, 8); cheek(ex - 22, ey + 9, 5); cheek(ex + 22, ey + 9, 5); smile(ex, ey + 8, 9, 2.4);
}
// ---------- ringed planet ----------
function planet(t) {
  const px = 800, py = 128 + ph(t, 2, 1) * 5, R = 50, tilt = -.28 + ph(t, 2) * .03;
  glow(px, py, R * 1.9, 'rgba(255,200,170,A)', .3);
  const ring = (front) => {
    x.save(); x.translate(px, py); x.rotate(tilt);
    x.beginPath(); x.ellipse(0, 0, R * 1.75, R * .42, 0, front ? 0 : Math.PI, front ? Math.PI : TAU);
    x.strokeStyle = '#ffd9a8'; x.lineWidth = 9; x.stroke(); x.strokeStyle = 'rgba(255,240,215,.8)'; x.lineWidth = 3; x.stroke();
    x.restore();
  };
  ring(false);
  C.circ(px, py, R, '#ffb88f');
  x.save(); x.beginPath(); x.arc(px, py, R, 0, 7); x.clip();
  ['#ffc8a2', '#f7a684', '#ffd0ad'].forEach((c, i) => { x.fillStyle = c; x.fillRect(px - R, py - 30 + i * 22 + ph(t, 3, i) * 2, 2 * R, 8); });
  x.restore();
  x.beginPath(); x.arc(px, py, R, 0, 7); edge(1.4);
  // sleepy face: eyes mostly closed, opens them twice per loop
  const awake = clamp(Math.min(frac(t / P * 2) / .01, (.06 - frac(t / P * 2)) / .01), 0, 1);
  if (awake > .5) { eye(px - 15, py - 2, 4, t, 2, 6); eye(px + 15, py - 2, 4, t, 2.05, 6); } else { sleepEye(px - 15, py, 5); sleepEye(px + 15, py, 5); }
  cheek(px - 25, py + 10, 5); cheek(px + 25, py + 10, 5); smile(px, py + 10, 7, 2.2);
  ring(true);
}
// ---------- crescent moon hammock with sleeping kitten ----------
function moonHammock(t) {
  const hx = 560, hy = 150 + (TB ? 62 : 0), rot = ph(t, 16) * .12;
  x.save(); x.translate(hx, hy - 70); x.rotate(rot);
  x.strokeStyle = 'rgba(255,240,200,.7)'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(0, -80); x.lineTo(-50, 52); x.moveTo(0, -80); x.lineTo(50, 52); x.stroke();
  x.translate(0, 70);
  glow(0, 0, 90, 'rgba(255,240,180,A)', .25);
  // crescent bowl
  x.fillStyle = '#ffe9a6'; x.beginPath(); x.arc(0, -14, 64, .15 * Math.PI, .85 * Math.PI); x.arc(0, -40, 58, .82 * Math.PI, .18 * Math.PI, true); x.closePath(); x.fill(); edge(1.2);
  [[-30, 34, 4], [18, 40, 5], [40, 24, 3]].forEach(([a, b, r]) => C.circ(a, b, r, 'rgba(230,200,120,.6)'));
  // kitten curled up
  const br = 1 + ph(t, 60) * .03;
  x.save(); x.scale(1, br);
  x.fillStyle = '#ffd0a6'; x.beginPath(); x.ellipse(4, 14, 30, 13, 0, 0, 7); x.fill(); edge(1);
  x.strokeStyle = '#ffd0a6'; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.moveTo(30, 16); x.quadraticCurveTo(40, 4, 26, 2); x.stroke();
  x.restore();
  C.circ(-24, 6, 14, '#ffd0a6'); x.beginPath(); x.arc(-24, 6, 14, 0, 7); edge(1);
  x.fillStyle = '#ffd0a6'; [[-34, -4, -30, -18, -24, -6], [-18, -6, -14, -20, -12, -4]].forEach(([a, b, c, d, e, f]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.lineTo(e, f); x.closePath(); x.fill(); });
  x.strokeStyle = '#f0a87a'; x.lineWidth = 1.6; [0, 8, 16].forEach(a => { x.beginPath(); x.moveTo(a - 4, 4); x.lineTo(a, 12); x.stroke(); });
  sleepEye(-29, 6, 3); sleepEye(-19, 6, 3); C.circ(-24, 11, 1.6, '#ff8fa8');
  // night cap
  x.fillStyle = '#9fc4ff'; x.beginPath(); x.moveTo(-36, -2); x.quadraticCurveTo(-26, -20, -12, -4); x.closePath(); x.fill();
  C.circ(-40, -10, 3.4, '#ffffff');
  x.restore();
  // z z z
  for (let i = 0; i < 3; i++) {
    const k = frac(t / 4 + i / 3); x.globalAlpha = Math.sin(k * Math.PI) * .9;
    x.fillStyle = '#ffffff'; x.font = C.FONT(10 + i * 3 + k * 4); x.textAlign = 'center';
    x.fillText('z', hx - 30 - k * 20 - i * 4, hy - 4 - k * 42); x.globalAlpha = 1;
  }
}
// ---------- rocket with bear cub, slowly orbiting the Earth (2 laps per loop) ----------
function rocket(t) {
  const a = TAU * t / P * 2 + 1.2;
  const rx = 176 + Math.cos(a) * 100, ry = 150 + Math.sin(a) * 74;
  const vx = -Math.sin(a) * 100, vy = Math.cos(a) * 74, ang = Math.atan2(vy, vx);
  const front = Math.sin(a) > 0;   // orbits the Earth: behind it on the top half, in front on the lower half
  return { draw: () => {
    // exhaust-free (electric-style) sparkle trail
    for (let i = 1; i < 10; i++) { const b = a - i * .07, sx = 176 + Math.cos(b) * 100, sy = 150 + Math.sin(b) * 74;
      x.globalAlpha = (1 - i / 10) * .6; C.circ(sx, sy, 3.4 - i * .25, i % 2 ? '#fff4b8' : '#ffc2e0'); }
    x.globalAlpha = 1;
    place(rx, ry, 1.15, false, ang);
    // body
    x.fillStyle = '#f4f1ff'; x.beginPath(); x.moveTo(42, 0); x.quadraticCurveTo(26, -20, -22, -18); x.lineTo(-22, 18); x.quadraticCurveTo(26, 20, 42, 0); x.fill(); edge(1.4);
    x.fillStyle = '#ff8fa8'; x.beginPath(); x.moveTo(42, 0); x.quadraticCurveTo(36, -9, 28, -13); x.lineTo(28, 13); x.quadraticCurveTo(36, 9, 42, 0); x.fill();
    x.fillStyle = '#8fc0ff'; [[-1, 1], [1, 1]].forEach(([s]) => { x.beginPath(); x.moveTo(-10, s * 16); x.lineTo(-30, s * 30); x.lineTo(-24, s * 14); x.closePath(); x.fill(); });
    x.fillStyle = '#ffd36b'; x.beginPath(); x.moveTo(-22, -9); x.lineTo(-30 - Math.abs(ph(t, 240)) * 5, 0); x.lineTo(-22, 9); x.closePath(); x.fill();
    // porthole with bear cub (kept upright)
    C.circ(6, 0, 12, '#bfe2ff'); x.beginPath(); x.arc(6, 0, 12, 0, 7); x.strokeStyle = '#9a8fc8'; x.lineWidth = 2.4; x.stroke();
    x.save(); x.translate(6, 0); x.rotate(-ang);
    C.circ(-6, -7, 3.2, '#c9946a'); C.circ(6, -7, 3.2, '#c9946a'); C.circ(0, 0, 8, '#c9946a'); C.circ(0, 3, 3.6, '#ead0b4');
    eye(-3, -1.5, 1.4, t, 30, 5); eye(3, -1.5, 1.4, t, 30.04, 5); C.circ(0, 2, 1, INKE);
    const wave = ph(t, 120) * .5; x.strokeStyle = '#c9946a'; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.moveTo(7, 3); x.lineTo(7 + Math.cos(-1.2 + wave) * 7, 3 + Math.sin(-1.2 + wave) * 7); x.stroke();
    x.restore();
    x.restore();
  }, front };
}
// ---------- puppy in a flying saucer, glides across twice per loop ----------
function saucer(t) {
  const k = frac(t / P * 2 + .55), go = Math.floor(t / P * 2 + .55) % 2 === 0;
  const sx = go ? -80 + k * (W + 160) : W + 80 - k * (W + 160), sy = 305 + ph(t, 24) * 5 + Math.sin(k * TAU) * 6;
  place(sx, sy, 1.35, !go, ph(t, 24, 1) * .08);
  glow(0, 0, 50, 'rgba(190,255,220,A)', .25);
  // dome + puppy
  x.fillStyle = 'rgba(210,240,255,.55)'; x.beginPath(); x.arc(0, -6, 20, Math.PI, 0); x.fill();
  C.circ(0, -12, 9, '#f2e2c8'); x.fillStyle = '#b98a62'; x.beginPath(); x.ellipse(-9, -12, 3.6, 7, .3, 0, 7); x.fill(); x.beginPath(); x.ellipse(9, -12, 3.6, 7, -.3, 0, 7); x.fill();
  eye(-3.4, -13, 1.5, t, 40, 6); eye(3.4, -13, 1.5, t, 40.04, 6); C.circ(0, -9, 1.6, INKE); smile(0, -8, 2.4, 1);
  x.strokeStyle = '#f2e2c8'; x.lineWidth = 3; x.lineCap = 'round'; const w = ph(t, 96) * .6; x.beginPath(); x.moveTo(7, -6); x.lineTo(7 + Math.cos(-1 + w) * 9, -6 + Math.sin(-1 + w) * 9); x.stroke();
  x.beginPath(); x.arc(0, -6, 20, Math.PI, 0); edge(1.2);
  // saucer body
  x.fillStyle = '#a8e6c9'; x.beginPath(); x.ellipse(0, 0, 38, 10, 0, 0, 7); x.fill(); edge(1.2);
  x.fillStyle = '#7fd0ad'; x.beginPath(); x.ellipse(0, 5, 22, 5, 0, 0, Math.PI); x.fill();
  for (let i = 0; i < 5; i++) { const on = Math.floor(t * 2 + i) % 5 === 0; C.circ(-24 + i * 12, 1, 2.4, on ? '#fff6b0' : '#ffd0e8'); }
  x.restore();
}
// ---------- comet ----------
function comet(t) {
  const k = frac(t / P * 3 + .2); if (k > .4) return;
  const u = k / .4, cx = W + 60 - u * (W + 200), cy = 40 + u * 120;
  for (let i = 0; i < 26; i++) { const tx = cx + i * 7, ty = cy - i * 1.4 + Math.sin(i * .9 + t * 3) * 2; x.globalAlpha = (1 - i / 26) * .7; C.circ(tx, ty, 4.4 - i * .14, i % 3 ? '#fff6d8' : '#c8e4ff'); }
  x.globalAlpha = 1; glow(cx, cy, 18, 'rgba(255,255,230,A)', .8); C.circ(cx, cy, 5.5, '#ffffff');
}
function shootingStar(t) {
  const k = frac(t / P * 5 + .73); if (k > .03) return;
  const u = k / .03, sx = 380 + u * 220, sy = 30 + u * 70;
  x.strokeStyle = `rgba(255,255,255,${Math.sin(u * Math.PI)})`; x.lineWidth = 2; x.lineCap = 'round';
  x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx - 40, sy - 13); x.stroke();
}
// ---------- satellite ----------
function satellite(t) {
  const sx = 410 + ph(t, 1) * 22, sy = 66 + ph(t, 3) * 8;
  place(sx, sy, .9, false, TAU * t / P * 4);
  x.fillStyle = '#9ec9ff'; [-1, 1].forEach(s => { x.fillRect(s > 0 ? 12 : -38, -7, 26, 14); x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = 1; for (let i = 1; i < 3; i++) { x.beginPath(); x.moveTo((s > 0 ? 12 : -38) + i * 8.7, -7); x.lineTo((s > 0 ? 12 : -38) + i * 8.7, 7); x.stroke(); } });
  x.fillStyle = '#d9d2ff'; x.fillRect(-12, -2, 24, 4);
  C.circ(0, 0, 11, '#f1ecff'); x.beginPath(); x.arc(0, 0, 11, 0, 7); edge(1);
  x.restore();
  eye(sx - 3.5, sy - 1, 1.6, t, 50, 6); eye(sx + 3.5, sy - 1, 1.6, t, 50.04, 6); smile(sx, sy + 2.5, 2.6, 1.1);
}
// ---------- moon surface ----------
const mY = i => 438 - Math.sin(i * .006 + .7) * 14 - Math.sin(i * .021) * 5;
function moonGround() {
  const g = x.createLinearGradient(0, 410, 0, H); g.addColorStop(0, '#e2d6f4'); g.addColorStop(1, '#bfaedd');
  x.fillStyle = g; x.beginPath(); x.moveTo(0, H); for (let i = 0; i <= W; i += 8) x.lineTo(i, mY(i)); x.lineTo(W, H); x.fill();
  [[90, 480, 26], [250, 512, 16], [420, 470, 12], [610, 505, 22], [780, 470, 14], [905, 515, 18], [520, 525, 9]].forEach(([cx, cy, r]) => {
    x.fillStyle = 'rgba(150,130,190,.35)'; x.beginPath(); x.ellipse(cx, cy, r, r * .32, 0, 0, 7); x.fill();
    x.fillStyle = 'rgba(255,255,255,.35)'; x.beginPath(); x.ellipse(cx, cy + r * .1, r * .8, r * .2, 0, 0, Math.PI); x.fill();
  });
}
function moonHouse(t) {
  const hx = 770, hy = mY(770) + 6;
  x.fillStyle = 'rgba(120,100,170,.25)'; x.beginPath(); x.ellipse(hx, hy + 2, 66, 8, 0, 0, 7); x.fill();
  x.fillStyle = '#f6f2ff'; x.beginPath(); x.arc(hx, hy, 56, Math.PI, 0); x.closePath(); x.fill(); edge(1.4);
  x.strokeStyle = 'rgba(160,140,210,.5)'; x.lineWidth = 1.4; [-.5, 0, .5].forEach(a => { x.beginPath(); x.ellipse(hx, hy, 56 * Math.abs(Math.cos(a * 1.5)) + .1, 56, 0, Math.PI, 0); x.stroke(); });
  x.fillStyle = '#d6ccf2'; C.rr(hx + 22, hy - 30, 22, 30, 10); x.fill();
  // round window with a waving hamster
  const wx = hx - 16, wy = hy - 28;
  C.circ(wx, wy, 16, '#fff2b8'); glow(wx, wy, 34, 'rgba(255,240,170,A)', .4);
  const peek = .5 + .5 * ph(t, 8);
  x.save(); x.beginPath(); x.arc(wx, wy, 15, 0, 7); x.clip();
  const by = wy + 16 - peek * 12;
  C.circ(wx - 7, by - 8, 3.4, '#f0b98a'); C.circ(wx + 7, by - 8, 3.4, '#f0b98a'); C.circ(wx, by, 10, '#f0b98a'); C.circ(wx, by + 4, 5, '#fff1e0');
  eye(wx - 3.6, by - 2, 1.5, t, 60, 5); eye(wx + 3.6, by - 2, 1.5, t, 60.04, 5); C.circ(wx, by + 1.5, 1.2, '#ff8fa8');
  if (peek > .7) { const w = ph(t, 160) * .5; x.strokeStyle = '#f0b98a'; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.moveTo(wx + 8, by + 2); x.lineTo(wx + 8 + Math.cos(-1.3 + w) * 7, by + 2 + Math.sin(-1.3 + w) * 7); x.stroke(); }
  x.restore();
  x.beginPath(); x.arc(wx, wy, 16, 0, 7); x.strokeStyle = '#a99ad6'; x.lineWidth = 2.6; x.stroke();
  // antenna with blinking light
  x.strokeStyle = '#a99ad6'; x.lineWidth = 2; x.beginPath(); x.moveTo(hx + 10, hy - 55); x.lineTo(hx + 18, hy - 76); x.stroke();
  C.circ(hx + 18, hy - 78, 3.6, Math.floor(t) % 2 ? '#ff9fbf' : '#ffd6e6');
}
function flag(t) {
  const fx = 640, fy = mY(640) + 4;
  x.strokeStyle = '#d8d0f0'; x.lineWidth = 2.4; x.beginPath(); x.moveTo(fx, fy); x.lineTo(fx, fy - 54); x.stroke();
  x.fillStyle = '#ffc6dc'; x.beginPath(); x.moveTo(fx, fy - 54);
  for (let i = 0; i <= 10; i++) x.lineTo(fx + i * 3.2, fy - 54 + Math.sin(i * .6 + TAU * t / P * 24) * 1.6);
  for (let i = 10; i >= 0; i--) x.lineTo(fx + i * 3.2, fy - 32 + Math.sin(i * .6 + TAU * t / P * 24) * 1.6);
  x.closePath(); x.fill();
  const hx = fx + 16, hy = fy - 44; x.fillStyle = '#ff7fa6'; x.beginPath(); x.moveTo(hx, hy + 5); x.bezierCurveTo(hx - 9, hy - 2, hx - 4, hy - 8, hx, hy - 3); x.bezierCurveTo(hx + 4, hy - 8, hx + 9, hy - 2, hx, hy + 5); x.fill();
}
// bunny astronaut: slow low-gravity hops back and forth on the moon (2 trips per loop)
function bunny(t) {
  const k = frac(t / P * 2), go = k < .5, u = go ? k * 2 : (1 - k) * 2;
  const hops = 6, step = u * hops, su = step - Math.floor(step);
  const bx = 170 + u * 320, gy = mY(bx) + 10, by = gy - Math.sin(su * Math.PI) * 30;
  x.fillStyle = 'rgba(120,100,170,.25)'; x.beginPath(); x.ellipse(bx, gy + 1, 22 * (1 - Math.sin(su * Math.PI) * .4), 4, 0, 0, 7); x.fill();
  place(bx, by, 1.4, !go, (su - .5) * .15 * (go ? 1 : 1));
  // suit
  C.rr(-15, -34, 30, 32, 12); x.fillStyle = '#ffffff'; x.fill(); edge(1.2);
  x.fillStyle = '#ffb3cc'; C.rr(-8, -24, 16, 10, 3); x.fill(); C.circ(-3, -19, 1.6, '#8fd0ff'); C.circ(3, -19, 1.6, '#fff6a0');
  C.rr(-14, -4, 11, 7, 3); x.fillStyle = '#e8e2f6'; x.fill(); C.rr(3, -4, 11, 7, 3); x.fill();
  // backpack
  x.fillStyle = '#c9c0ee'; C.rr(-22, -32, 9, 24, 4); x.fill();
  // arms: one waves at the top of the hop
  x.strokeStyle = '#ffffff'; x.lineWidth = 7; x.lineCap = 'round';
  const wv = Math.sin(su * Math.PI); x.beginPath(); x.moveTo(12, -26); x.lineTo(20, -26 - wv * 14); x.stroke();
  x.beginPath(); x.moveTo(-12, -26); x.lineTo(-18, -14); x.stroke();
  // head in bubble helmet
  C.circ(2, -52, 12, '#f6eef0');
  x.fillStyle = '#f6eef0'; x.beginPath(); x.ellipse(-3, -72, 4, 11, -.15, 0, 7); x.fill(); x.beginPath(); x.ellipse(7, -73, 4, 11, .15, 0, 7); x.fill();
  x.fillStyle = '#ffc2d4'; x.beginPath(); x.ellipse(-3, -72, 2, 7, -.15, 0, 7); x.fill(); x.beginPath(); x.ellipse(7, -73, 2, 7, .15, 0, 7); x.fill();
  eye(-2, -54, 2, t, 70, 5); eye(7, -54, 2, t, 70.04, 5); C.circ(3, -49, 1.6, '#ff8fa8'); cheek(-6, -48, 2.6); cheek(11, -48, 2.6);
  x.fillStyle = 'rgba(210,235,255,.28)'; x.beginPath(); x.arc(2, -58, 26, 0, 7); x.fill();
  x.beginPath(); x.arc(2, -58, 26, 0, 7); x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 2; x.stroke();
  x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 2.4; x.beginPath(); x.arc(2, -58, 20, -2.6, -1.9); x.stroke();
  x.restore();
}
// little moon rocks + glowing moon flowers in front
function front(t) {
  [[40, 0], [330, 1], [470, 2], [560, 3], [900, 4], [700, 5]].forEach(([fx, i]) => {
    const fy = mY(fx) + 40 + (i % 2) * 22;
    x.fillStyle = '#cfc2ea'; x.beginPath(); x.ellipse(fx, fy, 14, 7, 0, Math.PI, 0); x.fill();
    const g = .5 + .5 * Math.abs(ph(t, 12, i)), cx = fx + 12, cy = fy - 16;
    x.strokeStyle = '#a7d8c0'; x.lineWidth = 2; x.beginPath(); x.moveTo(cx, fy); x.lineTo(cx, cy); x.stroke();
    glow(cx, cy, 14, 'rgba(180,255,230,A)', .5 * g);
    for (let p = 0; p < 5; p++) { const a = p / 5 * TAU + ph(t, 4, i) * .3; C.circ(cx + Math.cos(a) * 4, cy + Math.sin(a) * 4, 3, i % 2 ? '#c8f5ff' : '#ffd6f0'); }
    C.circ(cx, cy, 2.2, '#fff6b0');
  });
}
function dust(t) {
  for (let i = 0; i < 18; i++) {
    const k = frac(hash(i + 400) + t / P * (2 + i % 4)), sx = hash(i + 430) * W + Math.sin(k * TAU + i) * 10, sy = 520 - k * 260;
    x.globalAlpha = Math.sin(k * Math.PI) * .6; C.circ(sx, sy, 1.4 + (i % 3) * .6, i % 2 ? '#fff4c8' : '#e8f4ff');
  }
  x.globalAlpha = 1;
}

function draw(t0) {
  const lt = t0, t = (t0 + T0) % P;
  sky();
  nebula(t);
  stars(t);
  shootingStar(t);
  comet(t);
  faceStars(t);
  if (!TB) satellite(t);
  const r = rocket(t);
  if (!r.front) r.draw();
  earth(t);
  if (r.front) r.draw();
  planet(t);
  moonHammock(t);
  saucer(t);
  moonGround();
  flag(t);
  moonHouse(t);
  bunny(t);
  front(t);
  dust(t);
  const fin = process.env.FADE || process.env.FADEIN, fout = process.env.FADE || process.env.FADEOUT;
  const f = Math.max(fin ? clamp(1 - lt / 3) : 0, fout ? clamp((lt - (DUR - 6)) / 6) : 0);
  if (f > 0) { x.fillStyle = `rgba(0,0,0,${f})`; x.fillRect(0, 0, W, H); }
}
if (require.main === module) C.run(draw, DUR, {});
