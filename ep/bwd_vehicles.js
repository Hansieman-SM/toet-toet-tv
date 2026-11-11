// Daily B&W sensory #10: Little Vehicles – white vehicles with friendly faces on black: Little Truck Toet (electric, lightning-bolt
// on his box, no exhaust), a long bus with round windows, a little train with one carriage and a turning coupling rod, a sailing boat
// bobbing on waves, a plane with a spinning propeller, a bicycle with turning spoked wheels and a ringing bell, a tractor with one big
// and one small wheel, a helicopter whose rotor turns, a round scooter, and a striped hot-air balloon with a basket.
// Background: rolling hills outline, white road band with a dashed line, two drifting cloud outlines, twinkling stars.
// Foreground: tiny sparkles rising. Outro: Little Truck Toet asleep in his little garage under a crescent moon.
// All figures are new drawings for this video (own design).
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x, ease } = C;
const { per, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;

const fill = (col = WH) => { x.fillStyle = col; x.fill(); };
const ring = (cx, cy, r, lw, col = BK) => { x.beginPath(); x.arc(cx, cy, r, 0, 7); line(lw, col); };
const box = (a, b, w, h, r) => { C.rr(a, b, w, h, r); };
const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const spin = (t, n) => -TAU * n * t / L.P;          // periodic rotation (moving left = counter-clockwise)
function zz(t, cx, cy, ph = 0) {
  x.font = C.FONT(30); x.fillStyle = WH; x.textAlign = 'center';
  for (let i = 0; i < 2; i++) { const k = ((t * 2 / 10 + ph + i / 2) % 1 + 1) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k); x.fillText('z', cx + k * 30 + i * 6, cy - k * 60); x.restore(); }
}
// wheel: white tyre, black ring, white hub with black spokes that turn
function wheel(cx, cy, r, a, spokes = 4) {
  dot(cx, cy, r); ring(cx, cy, r * .68, r * .14);
  x.save(); x.translate(cx, cy); x.rotate(a);
  for (let i = 0; i < spokes; i++) { x.save(); x.rotate(i * TAU / spokes); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, r * .6); line(r * .12, BK); x.restore(); }
  x.restore(); dot(cx, cy, r * .16, BK);
}
const face = (cx, cy, s, t, ph = 0) => { eye(cx - 16 * s, cy, 8 * s, t, ph); eye(cx + 16 * s, cy, 8 * s, t, ph + .3); smile(cx, cy + 10 * s, 12 * s, 5 * s); };

function toet(t) {
  // Little Truck Toet (front = left): rounded cab with a big face, cargo box with a lightning bolt (electric), two turning wheels
  const b = Math.abs(per(t, 60)) * 3, a = spin(t, 30);
  x.save(); x.translate(0, -b);
  box(-40, -96, 190, 120, 18); fill(); box(-40, -96, 190, 120, 18); line(5, BK);
  x.beginPath(); x.moveTo(62, -76); x.lineTo(36, -24); x.lineTo(60, -24); x.lineTo(44, 10); x.lineTo(86, -40); x.lineTo(62, -40); x.lineTo(78, -76); x.closePath(); fill(BK);
  x.beginPath(); x.moveTo(-34, 30); x.lineTo(-34, -62); x.quadraticCurveTo(-34, -86, -60, -86); x.lineTo(-104, -86); x.quadraticCurveTo(-150, -86, -150, -40); x.lineTo(-150, 30); x.closePath(); fill();
  x.beginPath(); x.moveTo(-34, 30); x.lineTo(-34, -62); x.quadraticCurveTo(-34, -86, -60, -86); x.lineTo(-104, -86); x.quadraticCurveTo(-150, -86, -150, -40); x.lineTo(-150, 30); x.closePath(); line(5, BK);
  box(-112, -74, 64, 34, 10); fill(BK);                                        // window
  face(-96, -18, 1.05, t); dot(-134, -2, 7, BK); dot(-134, -2, 3);          // face + little headlight
  x.beginPath(); x.moveTo(-158, 32); x.lineTo(156, 32); line(8);
  x.restore();
  wheel(-94, 44, 30, a); wheel(98, 44, 30, a);
}
function bus(t) {
  // long bus (front = left): round windows, a door, face on the front, three turning wheels
  const b = Math.abs(per(t, 72)) * 2.5, a = spin(t, 30);
  x.save(); x.translate(0, -b);
  box(-170, -96, 340, 138, 30); fill(); box(-170, -96, 340, 138, 30); line(5, BK);
  x.beginPath(); x.moveTo(-170, 0); x.lineTo(170, 0); line(5, BK);
  for (let i = 0; i < 4; i++) { dot(-30 + i * 54, -46, 20, BK); dot(-36 + i * 54, -52, 5); }
  box(-120, -76, 54, 112, 10); line(5, BK); x.beginPath(); x.moveTo(-93, -76); x.lineTo(-93, 36); line(4, BK);
  face(-146, -42, .8, t); dot(-160, 20, 6, BK);
  box(-40, -112, 80, 16, 6); fill(); box(-40, -112, 80, 16, 6); line(4, BK);
  x.restore();
  wheel(-110, 50, 28, a); wheel(30, 50, 28, a); wheel(110, 50, 28, a);
}
function train(t) {
  // little train (front = left): locomotive with a round front face, chimney with a bell, one carriage, coupling rod that turns
  const a = spin(t, 36), b = Math.abs(per(t, 96)) * 2;
  x.save(); x.translate(0, -b);
  // carriage
  box(40, -70, 130, 96, 14); fill(); box(40, -70, 130, 96, 14); line(5, BK);
  [70, 128].forEach(cx => { box(cx - 20, -54, 40, 34, 8); fill(BK); });
  x.beginPath(); x.moveTo(20, 10); x.lineTo(44, 10); line(8);
  // locomotive cab
  box(-50, -110, 76, 136, 12); fill(); box(-50, -110, 76, 136, 12); line(5, BK);
  box(-36, -94, 48, 38, 8); fill(BK);
  box(-58, -124, 92, 18, 6); fill(); box(-58, -124, 92, 18, 6); line(4, BK);
  // boiler
  box(-160, -50, 120, 76, 20); fill(); box(-160, -50, 120, 76, 20); line(5, BK);
  [-128, -92].forEach(bx => { x.beginPath(); x.moveTo(bx, -50); x.lineTo(bx, 26); line(4, BK); });
  box(-142, -86, 26, 38, 6); fill(); box(-142, -86, 26, 38, 6); line(4, BK);
  // bell swinging on the boiler
  x.save(); x.translate(-86, -62); x.rotate(per(t, 40) * .3); x.beginPath(); x.moveTo(-10, 6); x.quadraticCurveTo(-10, -12, 0, -12); x.quadraticCurveTo(10, -12, 10, 6); x.closePath(); fill(); line(3, BK); x.restore();
  // round face at the front
  dot(-162, -12, 40); ring(-162, -12, 40, 5); face(-162, -18, .85, t, .4);
  x.restore();
  [-130, -60, 72, 140].forEach((wx, i) => wheel(wx, 46, i < 2 ? 26 : 22, a));
  const rx = Math.cos(a) * 12, ry = Math.sin(a) * 12;
  x.beginPath(); x.moveTo(-130 + rx, 46 + ry); x.lineTo(-60 + rx, 46 + ry); line(7, BK); x.beginPath(); x.moveTo(-130 + rx, 46 + ry); x.lineTo(-60 + rx, 46 + ry); line(3);
}
function boat(t) {
  // little sailing boat bobbing on waves (front = left): hull with a face and portholes, big sail, little flag
  const bob = per(t, 30) * 8, tilt = per(t, 30 + 0) * .05;
  x.save(); x.translate(0, bob); x.rotate(tilt);
  x.beginPath(); x.moveTo(0, -20); x.lineTo(0, -190); line(8);
  x.beginPath(); x.moveTo(10, -180); x.quadraticCurveTo(110, -100, 120, -30); x.lineTo(10, -30); x.closePath(); fill(); line(4, BK);
  x.beginPath(); x.moveTo(-10, -160); x.quadraticCurveTo(-80, -90, -90, -40); x.lineTo(-10, -40); x.closePath(); fill(); line(4, BK);
  x.beginPath(); x.moveTo(40, -150); x.lineTo(40, -50); line(3, BK);
  const fl = per(t, 48) * 6;
  x.beginPath(); x.moveTo(0, -190); x.quadraticCurveTo(24, -200 + fl, 44, -186); x.lineTo(0, -170); x.closePath(); fill();
  x.beginPath(); x.moveTo(-160, -24); x.lineTo(150, -24); x.quadraticCurveTo(130, 40, 90, 50); x.lineTo(-100, 50); x.quadraticCurveTo(-140, 30, -160, -24); x.closePath(); fill(); line(5, BK);
  face(-90, 6, 1, t); [10, 60, 110].forEach(px => { dot(px, 8, 13, BK); dot(px - 3, 5, 4); });
  x.restore();
  // waves
  for (let r = 0; r < 2; r++) {
    x.beginPath(); const y0 = 66 + r * 26, sh = (t * 8 * (r ? -1 : 1) / L.P * 120) % 60;
    for (let i = -4; i <= 4; i++) { const wx = i * 60 + sh; x.moveTo(wx - 30, y0); x.quadraticCurveTo(wx - 15, y0 - 14, wx, y0); x.quadraticCurveTo(wx + 15, y0 + 14, wx + 30, y0); }
    line(5);
  }
}
function plane(t) {
  // propeller plane (nose = left): round body, wings, tail fin, windows, face at the nose, spinning propeller
  const b = per(t, 24) * 6;
  x.save(); x.translate(0, b); x.rotate(per(t, 24) * .03);
  x.beginPath(); x.moveTo(110, -10); x.lineTo(160, -90); x.lineTo(180, -90); x.lineTo(170, -6); x.closePath(); fill(); line(4, BK);
  x.beginPath(); x.ellipse(0, 0, 170, 46, 0, 0, 7); fill(); x.beginPath(); x.ellipse(0, 0, 170, 46, 0, 0, 7); line(5, BK);
  x.beginPath(); x.moveTo(-20, 6); x.lineTo(50, 6); x.lineTo(90, 86); x.lineTo(56, 86); x.closePath(); fill(); line(4, BK);
  x.beginPath(); x.moveTo(120, 4); x.lineTo(176, 4); x.lineTo(190, 34); x.lineTo(150, 30); x.closePath(); fill(); line(4, BK);
  [0, 40, 80].forEach(wx => { dot(wx, -14, 12, BK); });
  face(-110, -6, .95, t, .1);
  // propeller (spins fast, drawn as a stretching blade)
  const pa = Math.cos(TAU * 400 * t / L.P);
  dot(-176, 0, 10); ring(-176, 0, 10, 3);
  x.beginPath(); x.ellipse(-180, 0, 6, Math.max(6, Math.abs(pa) * 58), 0, 0, 7); fill(); x.beginPath(); x.ellipse(-180, 0, 6, Math.max(6, Math.abs(pa) * 58), 0, 0, 7); line(3, BK);
  x.restore();
}
function bicycle(t) {
  // bicycle (front = left): two big spoked wheels that turn, frame, saddle, handlebar with a bell that rings now and then
  const a = spin(t, 24);
  [-100, 100].forEach(wx => { dot(wx, 40, 66); dot(wx, 40, 52, BK); ring(wx, 40, 62, 3, BK);
    x.save(); x.translate(wx, 40); x.rotate(a); for (let i = 0; i < 8; i++) { x.save(); x.rotate(i * TAU / 8); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 52); line(3); x.restore(); } x.restore(); dot(wx, 40, 8); });
  x.beginPath(); x.moveTo(100, 40); x.lineTo(14, 40); x.lineTo(40, -40); x.closePath(); line(11);
  x.beginPath(); x.moveTo(14, 40); x.lineTo(-70, -40); x.lineTo(40, -40); line(11);
  x.beginPath(); x.moveTo(-100, 40); x.lineTo(-76, -64); line(11);
  x.beginPath(); x.moveTo(40, -40); x.lineTo(46, -64); line(9);
  x.beginPath(); x.ellipse(52, -70, 32, 11, 0, 0, 7); fill();
  x.beginPath(); x.moveTo(-76, -64); x.lineTo(-60, -84); x.quadraticCurveTo(-46, -92, -32, -84); line(10);
  // bell (shakes a little every 12 s)
  const ringK = per(t, 20) > .9 ? per(t, 600) * .3 : 0;
  x.save(); x.translate(-70, -88); x.rotate(ringK); x.beginPath(); x.arc(0, 0, 13, Math.PI, 0); x.lineTo(13, 4); x.lineTo(-13, 4); x.closePath(); fill(); x.restore();
  dot(14, 40, 16); ring(14, 40, 16, 3); x.beginPath(); const pa = a * 1.4; x.moveTo(14, 40); x.lineTo(14 + Math.cos(pa) * 28, 40 + Math.sin(pa) * 28); line(7);
  // little basket with a smiling face at the front
  box(-150, -70, 56, 40, 8); fill(); box(-150, -70, 56, 40, 8); line(4, BK);
  eye(-132, -54, 5, t); eye(-112, -54, 5, t, .3); smile(-122, -46, 8, 3);
}
function tractor(t) {
  // tractor (front = left): one big and one small wheel with treads, cab with a roof, face on the hood
  const a = spin(t, 18), b = Math.abs(per(t, 54)) * 3;
  x.save(); x.translate(0, -b);
  box(-150, -40, 160, 74, 16); fill(); box(-150, -40, 160, 74, 16); line(5, BK);
  [-20, -2].forEach(gx => { x.beginPath(); x.moveTo(gx, -30); x.lineTo(gx, 24); line(4, BK); });
  face(-96, -10, .95, t, .2);
  x.beginPath(); x.moveTo(-40, -40); x.lineTo(-40, -66); line(10);                     // air intake (no smoke)
  box(-46, -74, 14, 10, 3); fill();
  box(0, -130, 130, 164, 14); fill(); box(0, -130, 130, 164, 14); line(5, BK);
  box(20, -112, 90, 60, 10); fill(BK);
  box(-10, -146, 150, 20, 8); fill(); box(-10, -146, 150, 20, 8); line(4, BK);
  x.restore();
  // big back wheel with treads, small front wheel
  x.save(); x.translate(80, 40); x.rotate(a); dot(0, 0, 74);
  for (let i = 0; i < 14; i++) { x.save(); x.rotate(i * TAU / 14); box(-7, -80, 14, 14, 3); fill(); x.restore(); }
  dot(0, 0, 54, BK); dot(0, 0, 40); for (let i = 0; i < 5; i++) { x.save(); x.rotate(i * TAU / 5); dot(0, -24, 6, BK); x.restore(); } dot(0, 0, 10, BK);
  x.restore();
  wheel(-110, 70, 40, a * 1.8, 5);
}
function helicopter(t) {
  // helicopter (nose = left): round bubble body with a face, tail boom, turning main rotor and spinning tail rotor, skids
  const b = per(t, 30) * 5;
  x.save(); x.translate(0, b); x.rotate(per(t, 30) * .03);
  x.beginPath(); x.moveTo(40, -30); x.lineTo(180, -16); x.lineTo(180, 4); x.lineTo(40, 20); x.closePath(); fill(); line(4, BK);
  x.beginPath(); x.moveTo(160, -12); x.lineTo(186, -64); x.lineTo(196, -64); x.lineTo(186, -6); x.closePath(); fill(); line(4, BK);
  x.save(); x.translate(190, -42); x.rotate(TAU * 120 * t / L.P); x.beginPath(); x.ellipse(0, 0, 4, 26, 0, 0, 7); fill(); x.restore(); dot(190, -42, 5); ring(190, -42, 5, 2);
  x.beginPath(); x.ellipse(-20, 0, 100, 76, 0, 0, 7); fill(); x.beginPath(); x.ellipse(-20, 0, 100, 76, 0, 0, 7); line(5, BK);
  x.beginPath(); x.ellipse(10, -22, 34, 30, 0, 0, 7); fill(BK); x.beginPath(); x.moveTo(10, -52); x.lineTo(10, 8); line(4);
  face(-78, -8, 1, t);
  dot(52, 22, 10, BK);
  // skids
  [[-70, 74, -76, 100], [20, 74, 26, 100]].forEach(([a1, b1, a2, b2]) => { x.beginPath(); x.moveTo(a1, b1); x.lineTo(a2, b2); line(7); });
  x.beginPath(); x.moveTo(-120, 100); x.lineTo(60, 100); x.quadraticCurveTo(76, 100, 80, 88); line(8);
  // main rotor: two blades seen from the side, length changes as they turn
  x.beginPath(); x.moveTo(-20, -76); x.lineTo(-20, -96); line(9);
  const ra = TAU * 60 * t / L.P, l1 = Math.cos(ra) * 170, l2 = Math.cos(ra + Math.PI / 2) * 170;
  [l1, l2].forEach(l => { x.beginPath(); x.moveTo(-20, -98); x.lineTo(-20 + l, -98); line(9); });
  dot(-20, -98, 9); ring(-20, -98, 9, 3);
  x.restore();
}
function scooter(t) {
  // round little scooter (front = left): curved body with a face on the front shield, seat, handlebar, mirror, two small wheels
  const a = spin(t, 30), b = Math.abs(per(t, 66)) * 3;
  x.save(); x.translate(0, -b);
  x.beginPath(); x.moveTo(-90, 40); x.lineTo(-110, -60); x.quadraticCurveTo(-112, -90, -90, -94); x.lineTo(-60, -94); x.lineTo(-48, 0); x.lineTo(60, 0); x.quadraticCurveTo(70, -60, 120, -50); x.quadraticCurveTo(160, -40, 160, 20); x.lineTo(150, 40); x.closePath(); fill(); line(5, BK);
  x.beginPath(); x.ellipse(96, -62, 56, 16, 0, 0, 7); fill(); x.beginPath(); x.ellipse(96, -62, 56, 16, 0, 0, 7); line(4, BK);
  x.beginPath(); x.moveTo(-88, -94); x.lineTo(-80, -130); line(9); x.beginPath(); x.moveTo(-110, -132); x.lineTo(-48, -128); line(10);
  x.beginPath(); x.moveTo(-60, -130); x.lineTo(-44, -156); line(4); ell(-40, -162, 12, 9);
  dot(-104, -100, 12); ring(-104, -100, 12, 3); dot(-104, -100, 5, BK);
  eye(-96, -44, 7, t); eye(-72, -44, 7, t, .3); x.beginPath(); x.arc(-84, -34, 10, .3, Math.PI - .3); line(4, BK);
  x.beginPath(); x.moveTo(110, -20); x.quadraticCurveTo(130, -26, 140, -8); line(4, BK);
  x.restore();
  wheel(-90, 52, 30, a); wheel(120, 52, 30, a);
}
function balloon(t) {
  // hot-air balloon: round envelope with black curved stripes, a big smile, ropes and a woven basket that swings a little
  const sw = per(t, 24) * .05;
  x.save(); x.rotate(sw);
  x.beginPath(); x.moveTo(-48, 30); x.bezierCurveTo(-150, -20, -140, -200, 0, -200); x.bezierCurveTo(140, -200, 150, -20, 48, 30); x.closePath(); fill();
  x.save(); x.clip();
  [-1, 1].forEach(d => { x.beginPath(); x.moveTo(d * 20, 34); x.bezierCurveTo(d * 70, -20, d * 80, -150, d * 20, -204); x.bezierCurveTo(d * 120, -150, d * 130, -40, d * 40, 34); x.closePath(); fill(BK); });
  x.restore();
  x.beginPath(); x.moveTo(-48, 30); x.bezierCurveTo(-150, -20, -140, -200, 0, -200); x.bezierCurveTo(140, -200, 150, -20, 48, 30); x.closePath(); line(5, BK);
  dot(0, -100, 44, BK); dot(0, -100, 38); eye(-14, -108, 8, t, .6); eye(14, -108, 8, t, .9); smile(0, -98, 13, 5);
  box(-50, 28, 100, 14, 6); fill(); box(-50, 28, 100, 14, 6); line(3, BK);
  [-40, -14, 14, 40].forEach(rx => { x.beginPath(); x.moveTo(rx, 42); x.lineTo(rx * .8, 90); line(4); });
  box(-46, 86, 92, 58, 10); fill(); box(-46, 86, 92, 58, 10); line(4, BK);
  [102, 118, 132].forEach(yy => { x.beginPath(); x.moveTo(-44, yy); x.lineTo(44, yy); line(3, BK); });
  [-22, 0, 22].forEach(xx => { x.beginPath(); x.moveTo(xx, 88); x.lineTo(xx, 142); line(3, BK); });
  x.restore();
}

// background
const DURV = +(process.env.DUR || L.P), T0V = +(process.env.T0 || 0);
const outroK = ts => (process.env.FADEOUT ? ease(((ts - T0V) - (DURV - 14)) / 2.5) : 0);
function cloud(cx, cy, s) {
  x.save(); x.translate(cx, cy); x.scale(s, s);
  x.beginPath(); x.moveTo(-70, 18); x.arc(-40, 4, 26, Math.PI * .8, Math.PI * 1.6); x.arc(4, -10, 34, Math.PI * 1.1, Math.PI * 1.95); x.arc(46, 6, 24, Math.PI * 1.4, Math.PI * .3); x.closePath(); line(4);
  x.restore();
}
function bg(t) {
  const night = outroK(t);
  // stars (always a few, brighter at night)
  for (let i = 0; i < 14; i++) { const sx = 40 + hash(i + 61) * 880, sy = 24 + hash(i + 23) * 110;
    x.save(); x.globalAlpha *= (.25 + .5 * night) * (.6 + .4 * per(t + i * 13, 6 + i)); dot(sx, sy, 1.6 + hash(i + 9) * 1.8); x.restore(); }
  // two cloud outlines drifting slowly back and forth
  x.save(); x.globalAlpha *= .45; cloud(150 + per(t, 1) * 40, 80, .9); cloud(800 - per(t, 2) * 30, 64, .7); x.restore();
  // rolling hills outline
  x.save(); x.globalAlpha *= .5; x.beginPath(); x.moveTo(0, 470);
  x.quadraticCurveTo(120, 420, 260, 455); x.quadraticCurveTo(400, 485, 520, 440); x.quadraticCurveTo(660, 400, 800, 450); x.quadraticCurveTo(880, 470, 960, 445); line(4); x.restore();
  // road: white band with a dashed black line that moves (periodic)
  x.beginPath(); x.rect(0, 496, 960, 44); fill();
  const off = (t * 20 * 80 / L.P) % 80;
  for (let i = -1; i < 13; i++) { box(i * 80 - off, 515, 44, 7, 3); fill(BK); }
}
function fg(t) {
  // tiny sparkles rising 3x per period
  for (let i = 0; i < 10; i++) {
    const k = ((t * 3 / L.P) + hash(i + 71)) % 1;
    const sx = 60 + hash(i + 33) * 840 + Math.sin(k * TAU * 2 + i) * 20, sy = 470 - k * 380, s = 3 + hash(i + 8) * 3;
    x.save(); x.globalAlpha *= Math.sin(Math.PI * k) * .7; x.translate(sx, sy); x.rotate(k * TAU);
    x.beginPath(); for (let j = 0; j < 8; j++) { const b = j / 8 * TAU, q = j % 2 ? s * .35 : s; x.lineTo(Math.cos(b) * q, Math.sin(b) * q); } x.closePath(); fill(); x.restore();
  }
}
// outro: Little Truck Toet asleep in his garage under a crescent moon
function sleepyEnd(t) {
  x.save(); x.translate(250, -170); dot(0, 0, 46); dot(20, -12, 40, BK); x.restore();
  const br = 1 + per(t, 16) * .015;
  x.save(); x.translate(0, 20);
  // garage: roof + walls, dark opening
  x.beginPath(); x.moveTo(-230, -60); x.lineTo(0, -180); x.lineTo(230, -60); x.closePath(); fill();
  box(-200, -64, 400, 214, 10); fill();
  box(-170, -40, 340, 190, 16); fill(BK);
  dot(0, -110, 20, BK); x.beginPath(); x.moveTo(0, -128); x.lineTo(0, -92); x.moveTo(-18, -110); x.lineTo(18, -110); line(4);
  // sleeping Toet inside (front = left)
  x.save(); x.translate(10, 60); x.scale(.82 * br, .82 * br);
  box(-40, -96, 190, 120, 18); fill(); box(-40, -96, 190, 120, 18); line(5, BK);
  x.beginPath(); x.moveTo(62, -76); x.lineTo(36, -24); x.lineTo(60, -24); x.lineTo(44, 10); x.lineTo(86, -40); x.lineTo(62, -40); x.lineTo(78, -76); x.closePath(); fill(BK);
  x.beginPath(); x.moveTo(-34, 30); x.lineTo(-34, -62); x.quadraticCurveTo(-34, -86, -60, -86); x.lineTo(-104, -86); x.quadraticCurveTo(-150, -86, -150, -40); x.lineTo(-150, 30); x.closePath(); fill(); line(5, BK);
  box(-112, -74, 64, 34, 10); fill(BK);
  sleepyEye(-113, -20, 8); sleepyEye(-79, -20, 8); x.beginPath(); x.arc(-96, -2, 7, 0, 7); line(4, BK);
  x.beginPath(); x.moveTo(-158, 32); x.lineTo(156, 32); line(8);
  wheel(-94, 44, 30, 0); wheel(98, 44, 30, 0);
  x.restore();
  // charging cable to a plug on the wall (electric)
  x.beginPath(); x.moveTo(140, 70); x.quadraticCurveTo(160, 100, 150, 20); line(5);
  box(140, 4, 20, 20, 4); fill();
  x.restore();
  zz(t, -290, -90); zz(t, -250, -150, .5);
}

L.scene({
  seed: 1010,
  figs: [[toet, .85, 'floor'], [bus, .8, 'swimL'], [train, .8, 'floor'], [boat, .8, 'sway'], [plane, .8, 'fly'],
         [bicycle, .85, 'swimR'], [tractor, .8, 'floor'], [helicopter, .8, 'float'], [scooter, .85, 'swimL'], [balloon, .8, 'float']],
  bg, fg, end: sleepyEnd,
});
