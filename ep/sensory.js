// Baby slaap-sensory: Ella de Olifant slaapt onder de sterren. Alles is periodiek met P seconden (naadloze loop).
const C = require('../lib/common');
const { x, W, H, clamp, lerp, hash } = C;
const P = 240, TAU = Math.PI * 2;
const DUR = +(process.env.DUR || P);
const ph = (t, m = 1, o = 0) => Math.sin(TAU * m * t / P + o);   // periodieke golf, m = gehele cycli per loop

function glow(cx, cy, r, col, a) {
  const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0));
  x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
}
function sky() {
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1f2350'); g.addColorStop(.55, '#4b4380'); g.addColorStop(1, '#a98bb8');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
}
function stars(t) {
  for (let i = 0; i < 90; i++) {
    const sx = hash(i) * W, sy = hash(i + 40) * 330, tw = .35 + .65 * (ph(t, 20 + (i % 13), i) * .5 + .5);
    x.globalAlpha = tw * (.5 + hash(i + 3) * .5);
    const r = .8 + hash(i + 7) * 1.6; C.circ(sx, sy, r, '#fff8e7');
    if (i % 9 === 0) { glow(sx, sy, r * 5, 'rgba(255,248,231,A)', .35 * tw); }
  }
  x.globalAlpha = 1;
}
function star5(cx, cy, r, col) { x.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU - Math.PI / 2, rr = i % 2 ? r * .45 : r; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.closePath(); x.fillStyle = col; x.fill(); }
function moon(t) {
  const cx = 760, cy = 120 + ph(t, 2) * 6;
  glow(cx, cy, 150, 'rgba(255,236,200,A)', .35);
  x.save(); x.beginPath(); x.arc(cx, cy, 62, 0, 7); x.clip();
  x.beginPath(); x.arc(cx, cy, 62, 0, TAU); x.moveTo(cx + 86, cy - 18); x.arc(cx + 30, cy - 18, 56, 0, TAU, true); x.fillStyle = '#fff1d0'; x.fill('nonzero'); x.restore();
  // slapend oogje en wangetje
  x.strokeStyle = '#c9a26b'; x.lineWidth = 3; x.lineCap = 'round';
  x.beginPath(); x.arc(cx - 34, cy - 4, 8, .2, Math.PI - .2); x.stroke();
  C.circ(cx - 38, cy + 14, 6, 'rgba(255,170,170,.45)');
}
function planet(cx, cy, r, base, ringCol, t, spin) {
  glow(cx, cy, r * 2.2, 'rgba(255,220,240,A)', .18);
  x.save(); x.translate(cx, cy);
  if (ringCol) { x.save(); x.rotate(-.35); x.scale(1, .32); x.beginPath(); x.arc(0, 0, r * 1.7, Math.PI, TAU); x.lineWidth = r * .22; x.strokeStyle = ringCol; x.stroke(); x.restore(); }
  x.beginPath(); x.arc(0, 0, r, 0, 7); x.fillStyle = base; x.fill();
  x.save(); x.beginPath(); x.arc(0, 0, r, 0, 7); x.clip();
  x.fillStyle = 'rgba(255,255,255,.18)'; for (let i = -2; i <= 2; i++) { x.fillRect(-r, i * r * .35 + ((spin * r) % (r * .35)), r * 2, r * .12); }
  x.fillStyle = 'rgba(30,20,60,.18)'; x.beginPath(); x.arc(r * .35, r * .3, r, 0, 7); x.fill();
  x.restore();
  if (ringCol) { x.save(); x.rotate(-.35); x.scale(1, .32); x.beginPath(); x.arc(0, 0, r * 1.7, 0, Math.PI); x.lineWidth = r * .22; x.strokeStyle = ringCol; x.stroke(); x.restore(); }
  x.restore();
}
function cloud(cx, cy, s, a) {
  x.globalAlpha = a; x.fillStyle = '#d9c6e6'; x.beginPath();
  [[0, 0, 34], [36, -16, 42], [78, 0, 32], [40, 10, 36]].forEach(([u, v, r]) => { x.moveTo(cx + (u + r) * s, cy + v * s); x.arc(cx + u * s, cy + v * s, r * s, 0, 7); }); x.fill();
  x.globalAlpha = 1;
}
function hills() {
  x.fillStyle = '#6d5a96'; x.beginPath(); x.moveTo(0, H); for (let i = 0; i <= W; i += 8) x.lineTo(i, 420 - Math.sin(i * .006 + 1) * 26); x.lineTo(W, H); x.fill();
  x.fillStyle = '#54477c'; x.beginPath(); x.moveTo(0, H); for (let i = 0; i <= W; i += 8) x.lineTo(i, 465 - Math.sin(i * .004 + 3) * 18 - Math.exp(-(((i - 430) / 200) ** 2)) * 30); x.lineTo(W, H); x.fill();
}
// slapende olifant (liggend), oorsprong = buik op de grond
function elephant(px, py, s, t, col = '#b9b3dc', ear = '#f2b8cc', eye = 0) {
  const br = 1 + ph(t, 60) * .018;   // ademhaling: 4 s per adem
  x.save(); x.translate(px, py); x.scale(s, s * br);
  const dark = '#9c95c7';
  // pootjes
  x.fillStyle = dark; [[-70, 0], [40, 0]].forEach(([lx]) => { x.beginPath(); x.ellipse(lx, -6, 30, 14, 0, 0, 7); x.fill(); });
  x.fillStyle = col; x.beginPath(); x.ellipse(0, -48, 120, 58, 0, 0, 7); x.fill();
  x.beginPath(); x.moveTo(118, -60); x.quadraticCurveTo(140, -50, 132, -30); x.lineWidth = 6; x.strokeStyle = dark; x.lineCap = 'round'; x.stroke();
  [[-95, -2], [-20, -2], [60, -2]].forEach(([lx]) => { x.fillStyle = col; x.beginPath(); x.ellipse(lx, -10, 28, 15, 0, 0, 7); x.fill(); });
  // hoofd
  x.fillStyle = col; x.beginPath(); x.arc(-120, -62, 52, 0, 7); x.fill();
  x.fillStyle = col; x.beginPath(); x.ellipse(-92, -72, 36, 44, .3, 0, 7); x.fill();
  x.fillStyle = ear; x.beginPath(); x.ellipse(-92, -72, 22, 30, .3, 0, 7); x.fill();
  // slurf opgekruld
  x.beginPath(); x.moveTo(-160, -50); x.bezierCurveTo(-200, -30, -205, 0, -175, 0); x.bezierCurveTo(-155, 0, -160, -20, -172, -16); x.lineWidth = 22; x.strokeStyle = col; x.stroke();
  // gezicht
  if (eye > .05) {
    x.save(); x.beginPath(); x.ellipse(-132, -72, 9, 10 * eye, 0, 0, 7); x.clip();
    C.circ(-132, -72, 10, '#fdfbff'); C.circ(-127, -71, 6.5, '#3b3560'); C.circ(-125, -74, 2.2, '#ffffff'); x.restore();
    x.strokeStyle = '#5d567f'; x.lineWidth = 3; x.beginPath(); x.ellipse(-132, -72, 9.5, 10 * eye + .5, 0, Math.PI, 0); x.stroke();
  } else { x.strokeStyle = '#5d567f'; x.lineWidth = 3.5; x.beginPath(); x.arc(-132, -70, 9, .2, Math.PI - .2); x.stroke(); }
  C.circ(-142, -50, 8, 'rgba(255,160,180,.45)');
  x.restore();
}
function babyElephant(px, py, s, t) { elephant(px, py, s, t + 1.3, '#cfcaea', '#f6c9d8'); }
// mama waakt: af en toe gaat haar oog open
const WATCH = [12, 46, 95, 140, 185, 222];
function eyeOpen(t) { let e = 0; WATCH.forEach(w => { const u = t - w; if (u > 0 && u < 5) e = Math.max(e, Math.min(1, u / .9, (5 - u) / .9) * (u > 2.2 && u < 2.45 ? .1 : 1)); }); return e; }
const breathe = (t, o = 0) => 1 + ph(t, 60, o) * .02;
function closedEye(cx, cy, r, col = '#5d567f') { x.strokeStyle = col; x.lineWidth = 2.5; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); x.stroke(); }
// uil op een tak
function owl(px, py, s, t, o = 0) {
  x.save(); x.translate(px, py); x.scale(s, s * breathe(t, o));
  x.fillStyle = '#b8a9d9'; x.beginPath(); x.ellipse(0, -40, 32, 40, 0, 0, 7); x.fill();
  [[-1], [1]].forEach(([d]) => { x.beginPath(); x.moveTo(d * 12, -72); x.lineTo(d * 26, -92); x.lineTo(d * 28, -66); x.fill(); });
  x.fillStyle = '#e7def5'; x.beginPath(); x.ellipse(0, -30, 20, 26, 0, 0, 7); x.fill();
  x.fillStyle = '#a090cc'; [[-1], [1]].forEach(([d]) => { x.beginPath(); x.ellipse(d * 28, -38, 9, 24, d * .2, 0, 7); x.fill(); });
  closedEye(-11, -58, 6); closedEye(11, -58, 6);
  x.fillStyle = '#f2c38f'; x.beginPath(); x.moveTo(-4, -52); x.lineTo(4, -52); x.lineTo(0, -45); x.closePath(); x.fill();
  x.restore();
}
function tree(px, gy, t) {
  x.fillStyle = '#4a3d6e'; x.beginPath(); x.moveTo(px - 16, gy); x.quadraticCurveTo(px - 6, gy - 120, px - 10, gy - 230); x.lineTo(px + 10, gy - 230); x.quadraticCurveTo(px + 10, gy - 120, px + 16, gy); x.fill();
  x.strokeStyle = '#4a3d6e'; x.lineWidth = 12; x.lineCap = 'round'; x.beginPath(); x.moveTo(px, gy - 170); x.quadraticCurveTo(px + 70, gy - 185, px + 140, gy - 175); x.stroke();
  x.fillStyle = 'rgba(120,100,170,.85)'; [[px - 30, gy - 250, 60], [px + 30, gy - 270, 55], [px - 70, gy - 225, 45], [px + 60, gy - 230, 45], [px, gy - 225, 55]].forEach(([a, b, r]) => { x.beginPath(); x.arc(a, b, r, 0, 7); x.fill(); });
}
function sheep(px, py, s, t, o = 0, lamb = false) {
  x.save(); x.translate(px, py); x.scale(s, s * breathe(t, o));
  x.fillStyle = '#f3eefc'; x.beginPath(); [[-30, -20, 22], [-8, -30, 26], [18, -28, 24], [34, -16, 20], [0, -14, 26]].forEach(([a, b, r]) => { x.moveTo(a + r, b); x.arc(a, b, r, 0, 7); }); x.fill();
  x.fillStyle = '#9b93c4'; x.beginPath(); x.ellipse(-44, -18, 16, 13, -.2, 0, 7); x.fill();
  x.beginPath(); x.ellipse(-50, -30, 8, 4, -.6, 0, 7); x.fill();
  closedEye(-48, -18, 4, '#3b3560');
  x.restore();
}
function bunny(px, py, s, t, o = 0) {
  x.save(); x.translate(px, py); x.scale(s, s * breathe(t, o));
  x.fillStyle = '#efe6f7'; x.beginPath(); x.ellipse(0, -18, 34, 20, 0, 0, 7); x.fill();
  C.circ(30, -14, 9, '#ffffff');
  x.beginPath(); x.arc(-30, -24, 17, 0, 7); x.fill();
  x.beginPath(); x.ellipse(-14, -40, 7, 22, 1.1, 0, 7); x.fill(); x.beginPath(); x.ellipse(-12, -32, 6, 20, 1.3, 0, 7); x.fill();
  x.fillStyle = '#f6c9d8'; x.beginPath(); x.ellipse(-14, -40, 3, 14, 1.1, 0, 7); x.fill();
  closedEye(-34, -25, 4, '#3b3560'); C.circ(-45, -20, 2.5, '#f2a7bb');
  x.restore();
}
function fireflies(t) {
  for (let i = 0; i < 18; i++) {
    const bx = hash(i + 100) * W, by = 330 + hash(i + 120) * 160;
    const fx = bx + ph(t, 3 + (i % 4), i) * 30, fy = by + ph(t, 5 + (i % 3), i * 2) * 18;
    const a = .4 + .6 * (ph(t, 15 + (i % 7), i * 3) * .5 + .5);
    glow(fx, fy, 14, 'rgba(255,240,170,A)', .5 * a); C.circ(fx, fy, 2.2, `rgba(255,248,210,${a})`);
  }
}
function shootingStar(t) {
  [[30, 160, 60, 300, 160], [150, 600, 40, 860, 110]].forEach(([at, x0, y0, x1, y1]) => {
    const k = (t - at) / 1.8; if (k < 0 || k > 1) return;
    const hx = lerp(x0, x1, k), hy = lerp(y0, y1, k), a = Math.sin(k * Math.PI);
    const g = x.createLinearGradient(hx, hy, hx - (x1 - x0) * .25, hy - (y1 - y0) * .25);
    g.addColorStop(0, `rgba(255,250,230,${.8 * a})`); g.addColorStop(1, 'rgba(255,250,230,0)');
    x.strokeStyle = g; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.moveTo(hx, hy); x.lineTo(hx - (x1 - x0) * .25, hy - (y1 - y0) * .25); x.stroke();
  });
}
function hangingStars(t) {
  [[200, 150, 16, 0], [300, 95, 12, 1], [560, 70, 14, 2], [640, 180, 10, 3]].forEach(([sx, sy, r, i]) => {
    const sw = ph(t, 6 + i, i) * .06;
    x.save(); x.translate(sx, 0); x.rotate(sw);
    x.strokeStyle = 'rgba(255,240,210,.35)'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(0, 0); x.lineTo(0, sy - r); x.stroke();
    glow(0, sy, r * 3, 'rgba(255,230,170,A)', .3); star5(0, sy, r, '#ffe7a8'); x.restore();
  });
}

function draw(t) {
  t = t % P;
  sky(); stars(t);
  planet(370 + ph(t, 1) * 20, 235 + ph(t, 1, 1.5) * 12, 30, '#f4b6c2', 'rgba(255,214,165,.85)', t, t * .3);
  planet(470 + ph(t, 1, 2) * 30, 205 + ph(t, 2, .5) * 10, 18, '#a8e0d4', null, t, t * .5);
  planet(905 + ph(t, 1, 4) * 12, 300 + ph(t, 1, 3) * 10, 12, '#ffd6a5', null, t, t * .5);
  moon(t);
  hangingStars(t);
  for (let i = 0; i < 4; i++) { const span = W + 400, cx = ((hash(i) * span + (t / P) * span * (i % 2 ? 1 : 2)) % span) - 200; cloud(cx, 260 + i * 35 + hash(i + 5) * 30, .9 + hash(i + 2) * .5, .45); }
  shootingStar(t);
  hills();
  tree(95, 470, t);
  owl(170, 300, .9, t); owl(212, 300, .55, t, 1);
  bunny(220, 500, .9, t, 2); bunny(268, 506, .55, t, 3);
  sheep(820, 470, 1.05, t, 4); sheep(900, 478, .65, t, 5);
  elephant(470, 486, 1.05, t, '#b9b3dc', '#f2b8cc', eyeOpen(t)); babyElephant(650, 492, .55, t);
  fireflies(t);
  // zachte vignet
  const v = x.createRadialGradient(480, 300, 200, 480, 300, 620); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(10,8,30,.45)'); x.fillStyle = v; x.fillRect(0, 0, W, H);
  const fin = process.env.FADE || process.env.FADEIN, fout = process.env.FADE || process.env.FADEOUT;
  const f = Math.max(fin ? clamp(1 - t / 3) : 0, fout ? clamp((t - (DUR - 6)) / 6) : 0);
  if (f > 0) { x.fillStyle = `rgba(0,0,0,${f})`; x.fillRect(0, 0, W, H); }
}
C.run(draw, DUR, {});
