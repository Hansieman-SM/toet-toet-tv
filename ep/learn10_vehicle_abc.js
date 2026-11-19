// Learning series – ABC #4: Vehicle ABC with Little Truck Toet (ties in with "Toet's Helper Friends").
// Toet is parked on the main street of a little town (coloured shops + houses, a garage with a charging point, a traffic light that slowly
// cycles red–yellow–green). Per letter (5 s): alphabet strip at the top lights the current letter, a letter block (upper + lower case),
// a picture card with a gently moving vehicle (wheels turn, rotor spins, lights blink) + a word card with the coloured first letter,
// Toet says "A is for Ambulance!", soft chime + a matching sound now and then.
// Recap: 26 blocks light up one by one, "Well done!", Toet drives off.
// New music: vehicleabc_long (melodica lead, ukulele strums, boom-chick upright bass, woodblock clip-clop + soft brushes; D major 4/4).
const C = require('../lib/common'), T = require('../lib/toet');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, rr, circ, ell, hash, INK } = C;

const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SEG = 5, BX = 210;
const CHIME = ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6', 'E6'];

// ---------- helpers ----------
const st = (lw = 3.5) => { x.lineWidth = lw; x.strokeStyle = INK; x.lineJoin = 'round'; x.lineCap = 'round'; };
const box = (a, b, w, h, r, col, lw = 3.5) => { x.fillStyle = col; st(lw); rr(a, b, w, h, r); x.fill(); x.stroke(); };
const win2 = (a, b, w, h, r = 5) => box(a, b, w, h, r, '#d6f0ff', 2.5);
function wheel(cx, cy, r, t, spd = 3) {
  circ(cx, cy, r, '#3a3f4b', INK, 3); circ(cx, cy, r * .48, '#d9dde3', INK, 2);
  x.save(); x.translate(cx, cy); x.rotate(-t * spd); x.strokeStyle = INK; x.lineWidth = 2; x.beginPath();
  for (let i = 0; i < 3; i++) { const a = i * 2.094; x.moveTo(0, 0); x.lineTo(Math.cos(a) * r * .45, Math.sin(a) * r * .45); } x.stroke(); x.restore();
}
const eyes = (ax, ay, bx2, by2, r, t, off = 0) => {
  const bl = ((t + off) % 3.4) > 3.25;
  [[ax, ay], [bx2, by2]].forEach(([a, b]) => { if (bl) { x.beginPath(); x.moveTo(a - r, b); x.lineTo(a + r, b); st(2.5); x.stroke(); } else { circ(a, b, r, INK); circ(a + r * .3, b - r * .35, r * .36, '#fff'); } });
};
const smile = (cx, cy, r) => { x.beginPath(); x.arc(cx, cy, r, .3, Math.PI - .3); st(2.5); x.stroke(); };
const blinkOn = (t, f = 2) => Math.sin(t * Math.PI * f) > 0;
const waves = (t, y = 34, col = '#4cc9f0') => { x.fillStyle = col; x.beginPath(); x.moveTo(-80, 70); x.lineTo(-80, y);
  for (let i = -80; i <= 80; i += 4) x.lineTo(i, y + Math.sin(i * .12 + t * 2.4) * 4); x.lineTo(80, 70); x.closePath(); x.fill();
  x.beginPath(); for (let i = -80; i <= 80; i += 4) { const yy = y + Math.sin(i * .12 + t * 2.4) * 4; i === -80 ? x.moveTo(i, yy) : x.lineTo(i, yy); } st(3); x.stroke(); };

// ---------- 26 original vehicles (centred on 0,0, inside a ±80 x ±70 card area) ----------
const V = {
  ambulance(t) { box(-72, -40, 104, 66, 10, '#ffffff'); x.fillStyle = '#ffffff'; st(); x.beginPath(); x.moveTo(32, -26); x.lineTo(58, -26); x.lineTo(74, 0); x.lineTo(74, 26); x.lineTo(32, 26); x.closePath(); x.fill(); x.stroke();
    win2(38, -20, 22, 18); x.fillStyle = '#e63946'; x.fillRect(-72, 4, 146, 8); x.fillRect(-36, -30, 10, 30); x.fillRect(-46, -20, 30, 10);
    box(-20, -52, 22, 12, 4, blinkOn(t, 1.6) ? '#4cc9f0' : '#a8c8e8', 2.5); if (blinkOn(t, 1.6)) circ(-9, -46, 16, 'rgba(76,201,240,.25)');
    wheel(-44, 30, 14, t); wheel(46, 30, 14, t); eyes(46, -12, 56, -12, 3, t); },
  bus(t) { box(-78, -44, 156, 74, 14, '#ffd23f'); for (let i = 0; i < 4; i++) win2(-68 + i * 30, -34, 24, 24);
    win2(54, -34, 18, 30); x.fillStyle = '#ff7a45'; x.fillRect(-78, 2, 156, 6); x.beginPath(); x.moveTo(-78, 2); x.lineTo(78, 2); x.moveTo(-78, 8); x.lineTo(78, 8); st(2); x.stroke();
    wheel(-46, 32, 14, t); wheel(48, 32, 14, t); eyes(59, -22, 67, -22, 3, t, 1); circ(76, 14, 4, '#fff6b0', INK, 2); },
  crane(t) { const sw = Math.sin(t * 1.4) * .12;
    box(-70, 0, 110, 30, 8, '#ffb627'); box(10, -26, 34, 28, 6, '#ffb627'); win2(16, -20, 22, 16);
    x.save(); x.translate(-20, 0); x.rotate(-.75); box(-6, -96, 14, 98, 4, '#ffd23f', 3); x.strokeStyle = INK; x.lineWidth = 1.5; for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(-6, -90 + i * 15); x.lineTo(8, -82 + i * 15); x.stroke(); } x.restore();
    const tx = -20 + Math.sin(.75) * 90, ty = -Math.cos(.75) * 90; x.save(); x.translate(tx, ty); x.rotate(sw); x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 54); x.stroke();
    x.beginPath(); x.arc(0, 62, 7, -Math.PI / 2, Math.PI * .9); x.lineWidth = 4; x.stroke(); x.restore();
    [-50, -16, 20].forEach(a => wheel(a, 34, 11, t)); },
  digger(t) { const a = Math.sin(t * 1.6) * .18;
    box(-40, -10, 80, 36, 8, '#ff9f1c'); box(-30, -46, 40, 38, 8, '#ff9f1c'); win2(-24, -40, 28, 22);
    x.save(); x.translate(36, -4); x.rotate(-.5 + a); box(0, -8, 50, 14, 6, '#ffb627', 3); x.translate(48, 0); x.rotate(1.2 - a * 1.5); box(-4, -6, 36, 12, 5, '#ffb627', 3);
    x.translate(34, 0); x.fillStyle = '#7d8597'; st(3); x.beginPath(); x.moveTo(0, -12); x.lineTo(16, -6); x.lineTo(14, 16); x.lineTo(-6, 12); x.closePath(); x.fill(); x.stroke(); x.restore();
    box(-56, 22, 96, 22, 11, '#3a3f4b', 3); [-42, -16, 10, 28].forEach(c => circ(c, 33, 6, '#9aa0aa', INK, 2)); eyes(-16, -30, -4, -30, 3, t, 2); },
  electric(t) { x.fillStyle = '#52b788'; st(); x.beginPath(); x.moveTo(-66, 20); x.lineTo(-66, -4); x.quadraticCurveTo(-60, -14, -40, -16); x.lineTo(-24, -40); x.quadraticCurveTo(-18, -46, 0, -46);
    x.lineTo(24, -46); x.quadraticCurveTo(34, -46, 42, -36); x.lineTo(54, -16); x.quadraticCurveTo(70, -12, 70, 4); x.lineTo(70, 20); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#d6f0ff'; x.beginPath(); x.moveTo(-36, -18); x.lineTo(-20, -38); x.lineTo(-2, -38); x.lineTo(-2, -18); x.closePath(); x.fill(); st(2.5); x.stroke();
    x.beginPath(); x.moveTo(6, -18); x.lineTo(6, -38); x.lineTo(24, -38); x.lineTo(38, -18); x.closePath(); x.fill(); x.stroke();
    circ(-30, 0, 11, '#ffd23f', INK, 2.5); x.fillStyle = INK; x.beginPath(); x.moveTo(-28, -8); x.lineTo(-35, 1); x.lineTo(-30, 1); x.lineTo(-32, 8); x.lineTo(-25, -1); x.lineTo(-30, -1); x.closePath(); x.fill();
    x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.moveTo(-66, 6); x.bezierCurveTo(-80, 6, -84, 40, -70, 44); x.stroke(); box(-76, 40, 14, 10, 3, '#ffd23f', 2);
    const sp = (t * .9) % 1; circ(-30 + 0, -2, 11 + sp * 14, `rgba(255,210,63,${.5 * (1 - sp)})`);
    wheel(-40, 22, 13, t); wheel(44, 22, 13, t); },
  firetruck(t) { box(-76, -26, 112, 56, 8, '#e63946'); x.fillStyle = '#e63946'; st(); x.beginPath(); x.moveTo(36, -38); x.lineTo(60, -38); x.lineTo(76, -12); x.lineTo(76, 30); x.lineTo(36, 30); x.closePath(); x.fill(); x.stroke();
    win2(42, -32, 22, 20); x.strokeStyle = '#e8e8e8'; x.lineWidth = 5; x.beginPath(); x.moveTo(-70, -36); x.lineTo(30, -36); x.moveTo(-70, -46); x.lineTo(30, -46); x.stroke();
    x.lineWidth = 3; for (let i = 0; i < 7; i++) { x.beginPath(); x.moveTo(-66 + i * 15, -46); x.lineTo(-66 + i * 15, -36); x.stroke(); }
    x.strokeStyle = INK; x.lineWidth = 2; x.strokeRect(-72, -48, 104, 14); circ(-40, 2, 12, '#ffd23f', INK, 2.5); circ(-40, 2, 5, '#e63946');
    box(48, -48, 16, 10, 3, blinkOn(t, 1.8) ? '#4cc9f0' : '#a8c8e8', 2); wheel(-46, 32, 14, t); wheel(50, 32, 14, t); eyes(48, -20, 58, -20, 3, t, .5); },
  garbage(t) { box(-76, -42, 104, 70, 10, '#2a9d8f'); x.fillStyle = '#2a9d8f'; st(); x.beginPath(); x.moveTo(28, -26); x.lineTo(56, -26); x.lineTo(74, 0); x.lineTo(74, 28); x.lineTo(28, 28); x.closePath(); x.fill(); x.stroke();
    win2(34, -20, 22, 18); x.strokeStyle = 'rgba(29,53,87,.5)'; x.lineWidth = 2.5; for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(-64 + i * 24, -32); x.lineTo(-64 + i * 24, 16); x.stroke(); }
    const lid = Math.max(0, Math.sin(t * 1.2)) * .5; x.save(); x.translate(-80, -42); x.rotate(-lid); box(-4, -6, 40, 8, 3, '#1f7a70', 2.5); x.restore();
    box(-100, -6, 22, 30, 4, '#52b788', 2.5); x.fillStyle = INK; x.fillRect(-98, -2, 18, 3);
    wheel(-44, 30, 14, t); wheel(46, 30, 14, t); eyes(42, -12, 52, -12, 3, t, 2.2); },
  helicopter(t) { x.strokeStyle = INK; x.lineWidth = 6; x.beginPath(); x.moveTo(10, -8); x.lineTo(78, -16); x.stroke(); x.strokeStyle = '#ff5d8f'; x.lineWidth = 3; x.beginPath(); x.moveTo(10, -8); x.lineTo(78, -16); x.stroke();
    x.save(); x.translate(78, -16); x.rotate(t * 9); x.fillStyle = INK; x.fillRect(-2, -14, 4, 28); x.restore();
    ell(-6, 0, 50, 34, '#ff5d8f', INK, 3.5); x.fillStyle = '#d6f0ff'; x.beginPath(); x.moveTo(-50, -4); x.quadraticCurveTo(-44, -30, -14, -30); x.lineTo(-14, -2); x.closePath(); x.fill(); st(2.5); x.stroke();
    x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(-6, -34); x.lineTo(-6, -44); x.moveTo(-40, 42); x.lineTo(30, 42); x.moveTo(-28, 32); x.lineTo(-30, 42); x.moveTo(16, 32); x.lineTo(18, 42); x.stroke();
    const w = Math.abs(Math.cos(t * 7)) * 70 + 8; x.fillStyle = INK; rr(-6 - w, -48, w * 2, 6, 3); x.fill(); circ(-6, -45, 5, '#ffd23f', INK, 2);
    eyes(-36, -14, -24, -14, 3.5, t, 1.4); smile(-30, -6, 6); },
  icecream(t) { box(-76, -40, 110, 68, 12, '#ffc8dd'); x.fillStyle = '#ffc8dd'; st(); x.beginPath(); x.moveTo(34, -24); x.lineTo(58, -24); x.lineTo(74, 0); x.lineTo(74, 28); x.lineTo(34, 28); x.closePath(); x.fill(); x.stroke();
    win2(40, -18, 20, 16); box(-64, -30, 64, 30, 6, '#fff6e0', 2.5); x.fillStyle = '#ff5d8f'; for (let i = 0; i < 4; i++) { x.beginPath(); x.arc(-56 + i * 16, -30, 8, 0, Math.PI); x.fill(); }
    x.save(); x.translate(-22, -46 + Math.sin(t * 2) * 2); x.beginPath(); x.moveTo(-10, 0); x.lineTo(0, 22); x.lineTo(10, 0); x.closePath(); x.fillStyle = '#e9b872'; x.fill(); st(2.5); x.stroke(); circ(0, -8, 12, '#9de0c4', INK, 2.5); circ(2, -20, 4, '#e63946', INK, 2); x.restore();
    wheel(-44, 30, 14, t); wheel(46, 30, 14, t); eyes(46, -8, 56, -8, 3, t, .9); },
  jet(t) { x.save(); x.translate(0, Math.sin(t * 1.5) * 4); x.rotate(-.05);
    x.fillStyle = '#9ec9ff'; st(); x.beginPath(); x.moveTo(-10, -4); x.lineTo(-40, -54); x.lineTo(-22, -54); x.lineTo(24, -4); x.closePath(); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(-58, -8); x.lineTo(-76, -36); x.lineTo(-64, -36); x.lineTo(-42, -8); x.closePath(); x.fill(); x.stroke();
    ell(0, 0, 76, 18, '#3a86ff', INK, 3.5); for (let i = 0; i < 5; i++) circ(-30 + i * 14, -3, 4, '#d6f0ff', INK, 1.5);
    x.beginPath(); x.moveTo(-10, 6); x.lineTo(-38, 44); x.lineTo(-20, 44); x.lineTo(24, 6); x.closePath(); x.fillStyle = '#9ec9ff'; x.fill(); st(); x.stroke();
    eyes(54, -6, 54, -6, 3.5, t, 2.7); smile(60, 4, 5); x.restore();
    for (let i = 0; i < 3; i++) { const k = ((t * .8 + i / 3) % 1); circ(-86 - k * 10, Math.sin(i) * 4, 5 * (1 - k), `rgba(255,255,255,${.9 * (1 - k)})`); } },
  kayak(t) { const r = Math.sin(t * 1.8) * .06; x.save(); x.rotate(r);
    x.save(); x.translate(0, -18); x.rotate(Math.sin(t * 1.8) * .5); x.strokeStyle = '#8a5a36'; x.lineWidth = 5; x.beginPath(); x.moveTo(-58, 0); x.lineTo(58, 0); x.stroke(); ell(-62, 0, 10, 6, '#ffd23f', INK, 2); ell(62, 0, 10, 6, '#ffd23f', INK, 2); x.restore();
    x.beginPath(); x.moveTo(-78, 10); x.quadraticCurveTo(0, -6, 78, 10); x.quadraticCurveTo(0, 36, -78, 10); x.fillStyle = '#e63946'; x.fill(); st(); x.stroke(); ell(0, 8, 22, 6, INK);
    circ(0, -30, 13, '#ffd6a5', INK, 3); x.fillStyle = '#ff9f1c'; x.beginPath(); x.arc(0, -32, 13, Math.PI, 0); x.fill(); x.stroke(); eyes(-4, -28, 5, -28, 2.2, t); x.restore();
    waves(t, 30); },
  lawnmower(t) { box(-50, -10, 90, 34, 10, '#52b788'); box(-30, -40, 28, 32, 6, '#40916c'); box(-58, 18, 108, 10, 4, '#2d6a4f', 3);
    x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(26, -10); x.lineTo(36, -34); x.stroke(); ell(38, -36, 12, 4, '#3a3f4b', INK, 2);
    wheel(-36, 28, 16, t); wheel(34, 32, 11, t); circ(-16, -24, 6, '#ffd23f', INK, 2);
    x.strokeStyle = '#52b788'; x.lineWidth = 3; for (let i = 0; i < 7; i++) { const k = ((t * .9 + i / 7) % 1); x.beginPath(); x.moveTo(-70 - k * 14, 30 - k * 24 + i); x.lineTo(-74 - k * 14, 24 - k * 24 + i); x.stroke(); }
    eyes(-22, 2, -8, 2, 3, t, 1.1); smile(-15, 10, 5); },
  nighttrain(t) { box(-78, -30, 64, 52, 8, '#3d405b'); box(-6, -50, 82, 72, 10, '#3d405b'); win2(4, -40, 26, 22); box(40, -66, 20, 18, 4, '#e63946', 2.5);
    x.fillStyle = '#fff6b0'; x.fillRect(-70, -22, 20, 16); x.fillRect(-42, -22, 20, 16); st(2); x.strokeRect(-70, -22, 20, 16); x.strokeRect(-42, -22, 20, 16);
    x.beginPath(); x.arc(56, -10, 13, Math.PI * .5, Math.PI * 1.5); x.bezierCurveTo(48, -20, 48, 0, 56, 3); x.fillStyle = '#ffd23f'; x.fill(); st(2); x.stroke();
    for (let i = 0; i < 4; i++) { const tw = .4 + .6 * Math.abs(Math.sin(t * 2 + i)); circ(-60 + i * 30, -46 + (i % 2) * 6, 3, `rgba(255,210,63,${tw})`); }
    x.fillStyle = INK; x.fillRect(-14, 0, 10, 6); [-62, -30, 6, 34, 62].forEach(a => wheel(a, 28, 10, t)); eyes(12, -30, 22, -30, 3, t, 2); },
  oceanliner(t) { x.save(); x.translate(0, Math.sin(t * 1.3) * 3);
    x.beginPath(); x.moveTo(-80, -6); x.lineTo(80, -6); x.lineTo(64, 26); x.lineTo(-68, 26); x.closePath(); x.fillStyle = '#1d3557'; x.fill(); st(); x.stroke(); x.fillStyle = '#e63946'; x.fillRect(-72, 14, 140, 8);
    box(-60, -28, 116, 22, 4, '#ffffff', 3); box(-44, -46, 84, 18, 4, '#ffffff', 3); for (let i = 0; i < 7; i++) circ(-48 + i * 16, -17, 4, '#4cc9f0', INK, 1.5);
    [[-22, -70], [10, -70]].forEach(([a, b]) => { box(a, b, 18, 26, 3, '#ffb627', 3); x.fillStyle = INK; x.fillRect(a, b, 18, 6); });
    x.restore(); waves(t, 24, '#7fd6f5'); },
  police(t) { x.fillStyle = '#ffffff'; st(); x.beginPath(); x.moveTo(-72, 20); x.lineTo(-72, -4); x.lineTo(-40, -8); x.lineTo(-24, -34); x.lineTo(26, -34); x.lineTo(44, -8); x.lineTo(72, -4); x.lineTo(72, 20); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#3a86ff'; x.fillRect(-72, 2, 144, 10); win2(-34, -28, 26, 20, 3); win2(-2, -28, 26, 20, 3);
    const on = blinkOn(t, 1.7); box(-12, -46, 12, 10, 3, on ? '#e63946' : '#f2a3a9', 2); box(0, -46, 12, 10, 3, on ? '#a8c8e8' : '#3a86ff', 2);
    circ(on ? -6 : 6, -41, 16, on ? 'rgba(230,57,70,.22)' : 'rgba(58,134,255,.22)'); wheel(-42, 22, 13, t); wheel(42, 22, 13, t); circ(70, 0, 4, '#fff6b0', INK, 2); },
  quad(t) { box(-46, -10, 92, 22, 10, '#9b5de5'); box(-20, -26, 40, 16, 6, '#3a3f4b', 2.5); x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(26, -10); x.lineTo(32, -34); x.moveTo(24, -34); x.lineTo(42, -34); x.stroke();
    box(-62, -16, 30, 10, 4, '#7b2cbf', 2.5); box(32, -16, 30, 10, 4, '#7b2cbf', 2.5); wheel(-46, 22, 20, t); wheel(46, 22, 20, t); circ(48, -4, 4, '#fff6b0', INK, 2); eyes(-6, -2, 6, -2, 2.8, t, .3); },
  rocket(t) { x.save(); x.translate(0, Math.sin(t * 1.5) * 5);
    for (let i = 0; i < 5; i++) { const k = ((t * 1.1 + i / 5) % 1); circ(Math.sin(i * 2) * 6, 58 + k * 22, 9 * (1 - k) + 3, `rgba(255,255,255,${.85 * (1 - k)})`); }
    x.fillStyle = '#ff9f1c'; st(3); [-1, 1].forEach(s => { x.beginPath(); x.moveTo(s * 22, 16); x.lineTo(s * 42, 50); x.lineTo(s * 18, 46); x.closePath(); x.fill(); x.stroke(); });
    x.beginPath(); x.moveTo(0, -66); x.quadraticCurveTo(30, -34, 26, 46); x.lineTo(-26, 46); x.quadraticCurveTo(-30, -34, 0, -66); x.fillStyle = '#ffffff'; x.fill(); st(); x.stroke();
    x.save(); x.clip(); x.fillStyle = '#e63946'; x.fillRect(-40, -70, 80, 26); x.restore(); x.beginPath(); x.moveTo(-18, -44); x.quadraticCurveTo(0, -48, 18, -44); st(2.5); x.stroke();
    circ(0, -6, 15, '#d6f0ff', INK, 3); eyes(-5, -8, 5, -8, 2.6, t, 1.7); smile(0, -2, 4); x.fillStyle = '#e63946'; rr(-10, 46, 20, 8, 3); x.fill(); x.restore(); },
  submarine(t) { x.save(); x.translate(0, Math.sin(t * 1.2) * 4);
    ell(0, 6, 72, 32, '#ffd23f', INK, 3.5); box(-18, -40, 36, 22, 6, '#ffd23f', 3); x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(6, -40); x.lineTo(6, -58); x.lineTo(18, -58); x.stroke();
    [-30, 0, 30].forEach(a => { circ(a, 4, 11, '#4cc9f0', INK, 3); circ(a - 3, 1, 3, 'rgba(255,255,255,.8)'); });
    x.save(); x.translate(-74, 6); x.rotate(t * 5); x.fillStyle = '#ff9f1c'; st(2); for (let i = 0; i < 3; i++) { x.rotate(2.094); ell(0, -9, 5, 9, '#ff9f1c', INK, 2); } x.restore(); x.restore();
    for (let i = 0; i < 4; i++) { const k = ((t * .6 + i / 4) % 1); x.strokeStyle = `rgba(255,255,255,${1 - k})`; x.lineWidth = 2; x.beginPath(); x.arc(40 + i * 8, -20 - k * 50, 4 + i, 0, 7); x.stroke(); } },
  tractor(t) { box(-54, -10, 70, 34, 8, '#e63946'); box(-6, -50, 44, 48, 6, '#e63946'); win2(2, -42, 28, 22); x.fillStyle = '#e63946'; box(16, -8, 44, 30, 8, '#e63946');
    x.strokeStyle = INK; x.lineWidth = 6; x.beginPath(); x.moveTo(-34, -10); x.lineTo(-34, -34); x.stroke(); circ(-34, -36, 5, INK);
    wheel(-30, 26, 16, t, 2.5); wheel(30, 18, 28, t, 1.6); eyes(8, -24, 20, -24, 3, t, .7); },
  unicycle(t) { const b = Math.sin(t * 3) * 3; wheel(0, 32, 32, t, 2.2); x.strokeStyle = INK; x.lineWidth = 6; x.beginPath(); x.moveTo(0, 32); x.lineTo(0, -28 + b); x.stroke();
    x.strokeStyle = '#ff5d8f'; x.lineWidth = 3; x.beginPath(); x.moveTo(0, 32); x.lineTo(0, -28 + b); x.stroke(); ell(0, -32 + b, 26, 8, '#ff5d8f', INK, 3);
    x.save(); x.translate(0, 32); x.rotate(-t * 2.2); x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(-16, 0); x.lineTo(16, 0); x.stroke(); box(-24, -4, 12, 8, 2, '#3a3f4b', 2); box(12, -4, 12, 8, 2, '#3a3f4b', 2); x.restore();
    for (let i = 0; i < 3; i++) { const k = ((t * .9 + i / 3) % 1); x.fillStyle = `rgba(255,210,63,${1 - k})`; x.beginPath(); x.arc(-44 + i * 44, -52 - k * 16, 4, 0, 7); x.fill(); } },
  van(t) { box(-74, -42, 118, 70, 12, '#ff9f1c'); x.fillStyle = '#ff9f1c'; st(); x.beginPath(); x.moveTo(44, -30); x.lineTo(60, -30); x.lineTo(76, -4); x.lineTo(76, 28); x.lineTo(44, 28); x.closePath(); x.fill(); x.stroke();
    win2(48, -24, 18, 18); box(-58, -28, 66, 34, 8, '#fff6e0', 2.5); x.fillStyle = '#e63946'; x.beginPath(); x.moveTo(-25, -4); x.bezierCurveTo(-46, -16, -34, -30, -25, -20); x.bezierCurveTo(-16, -30, -4, -16, -25, -4); x.fill();
    wheel(-44, 30, 14, t); wheel(48, 30, 14, t); eyes(52, -8, 62, -8, 3, t, 1.9); circ(76, 16, 4, '#fff6b0', INK, 2); },
  wagon(t) { x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(56, 0); x.quadraticCurveTo(70, -20, 78, -44); x.stroke(); box(70, -54, 16, 10, 5, '#3a3f4b', 2);
    box(-66, -22, 124, 40, 8, '#e63946'); x.fillStyle = 'rgba(255,255,255,.5)'; x.fillRect(-58, -14, 108, 5);
    x.save(); x.translate(-24, -26); circ(0, -14, 16, '#c58f5b', INK, 3); circ(-12, -28, 6, '#c58f5b', INK, 2.5); circ(12, -28, 6, '#c58f5b', INK, 2.5); ell(0, -8, 7, 5, '#f1d3a2'); eyes(-6, -18, 6, -18, 2.4, t, .4); x.restore();
    circ(24, -32, 12, '#4cc9f0', INK, 3); x.save(); x.beginPath(); x.arc(24, -32, 12, 0, 7); x.clip(); x.fillStyle = '#ffd23f'; x.fillRect(10, -36, 30, 8); x.restore();
    wheel(-40, 24, 13, t); wheel(34, 24, 13, t); },
  xebec(t) { x.save(); x.translate(0, Math.sin(t * 1.4) * 3); x.rotate(Math.sin(t * 1.4) * .03);
    x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(-26, 10); x.lineTo(-30, -60); x.moveTo(22, 10); x.lineTo(24, -48); x.stroke();
    x.fillStyle = '#fff6e0'; st(3); x.beginPath(); x.moveTo(-52, -6); x.lineTo(-24, -66); x.quadraticCurveTo(-4, -30, -8, 0); x.closePath(); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(4, -2); x.lineTo(28, -54); x.quadraticCurveTo(46, -22, 44, 2); x.closePath(); x.fillStyle = '#ffc8dd'; x.fill(); x.stroke();
    x.fillStyle = '#e63946'; x.beginPath(); x.moveTo(-30, -60); x.lineTo(-14, -66); x.lineTo(-30, -70); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(-80, 6); x.lineTo(76, 6); x.lineTo(56, 28); x.lineTo(-62, 28); x.closePath(); x.fillStyle = '#b07d4f'; x.fill(); st(); x.stroke();
    x.strokeStyle = '#7a5230'; x.lineWidth = 2; x.beginPath(); x.moveTo(-70, 16); x.lineTo(66, 16); x.stroke(); [-40, -10, 20].forEach(a => circ(a, 16, 3.5, '#ffd23f', INK, 1.5)); x.restore();
    waves(t, 26); },
  yacht(t) { x.save(); x.translate(0, Math.sin(t * 1.5) * 3);
    x.beginPath(); x.moveTo(-76, -2); x.lineTo(70, -2); x.lineTo(54, 24); x.lineTo(-60, 24); x.closePath(); x.fillStyle = '#ffffff'; x.fill(); st(); x.stroke(); x.fillStyle = '#3a86ff'; x.fillRect(-66, 10, 124, 6);
    box(-40, -22, 70, 20, 8, '#ffffff', 3); box(-24, -38, 40, 16, 6, '#ffffff', 3); [-32, -16, 0, 14].forEach(a => box(a, -17, 10, 9, 3, '#4cc9f0', 1.5));
    x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.moveTo(-4, -38); x.lineTo(-4, -60); x.stroke(); x.fillStyle = '#ffd23f'; x.beginPath(); x.moveTo(-4, -60); x.lineTo(14 + Math.sin(t * 4) * 3, -55); x.lineTo(-4, -50); x.closePath(); x.fill(); x.stroke(); x.restore();
    waves(t, 22); },
  zeppelin(t) { x.save(); x.translate(Math.sin(t * .8) * 4, Math.sin(t * 1.2) * 4);
    x.fillStyle = '#cdb4db'; st(3); [[-1, -1], [-1, 1]].forEach(([a, s]) => { x.beginPath(); x.moveTo(-50, s * 6); x.lineTo(-72, s * 30); x.lineTo(-60, s * 4); x.closePath(); x.fill(); x.stroke(); });
    ell(0, -10, 74, 32, '#cdb4db', INK, 3.5); x.strokeStyle = 'rgba(123,44,191,.45)'; x.lineWidth = 2.5; [-36, 0, 36].forEach(a => { x.beginPath(); x.ellipse(a, -10, 8, 30 - Math.abs(a) * .2, 0, 0, 7); x.stroke(); });
    box(-20, 24, 40, 16, 6, '#ffd23f', 3); [-12, 0, 12].forEach(a => circ(a, 32, 3.5, '#4cc9f0', INK, 1.5)); x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.moveTo(-12, 22); x.lineTo(-12, 24); x.moveTo(12, 22); x.lineTo(12, 24); x.stroke();
    eyes(46, -16, 58, -16, 3.5, t, 2.4); smile(52, -6, 6); x.restore(); },
};
// word, colour, vehicle, sound effect (optional)
const L = [
  ['Ambulance', '#e63946', 'ambulance'], ['Bus', '#e9a800', 'bus', 'honk'], ['Crane', '#f4a261', 'crane', 'clank'], ['Digger', '#ff7a00', 'digger', 'clank'],
  ['Electric car', '#2d9a62', 'electric', 'twinkle'], ['Fire truck', '#e63946', 'firetruck'], ['Garbage truck', '#2a9d8f', 'garbage'], ['Helicopter', '#ff5d8f', 'helicopter', 'whoosh'],
  ['Ice cream truck', '#ff5d8f', 'icecream', 'chime:A5'], ['Jet', '#3a86ff', 'jet', 'whoosh'], ['Kayak', '#e63946', 'kayak', 'splash'], ['Lawn mower', '#40916c', 'lawnmower'],
  ['Motorbike', '#6a4c93', 'motorbike'], ['Night train', '#5e60ce', 'nighttrain', 'twinkle'], ['Ocean liner', '#0077b6', 'oceanliner', 'splash'], ['Police car', '#3a86ff', 'police'],
  ['Quad bike', '#7b2cbf', 'quad'], ['Rocket', '#e63946', 'rocket', 'whoosh'], ['Submarine', '#e9a800', 'submarine', 'pop'], ['Tractor', '#e63946', 'tractor'],
  ['Unicycle', '#ff5d8f', 'unicycle', 'boing'], ['Van', '#ff7a00', 'van', 'honk'], ['Wagon', '#e63946', 'wagon'], ['Xebec', '#9c6644', 'xebec', 'splash'],
  ['Yacht', '#3a86ff', 'yacht'], ['Zeppelin', '#7b2cbf', 'zeppelin', 'whoosh'],
];
V.motorbike = function (t) {
  wheel(-48, 26, 20, t); wheel(48, 26, 20, t);
  x.strokeStyle = INK; x.lineWidth = 5; x.beginPath(); x.moveTo(-48, 26); x.lineTo(-20, -4); x.moveTo(48, 26); x.lineTo(34, -26); x.lineTo(22, -34); x.stroke();
  x.fillStyle = '#264653'; st(3); x.beginPath(); x.moveTo(-30, -6); x.quadraticCurveTo(-10, -26, 30, -16); x.lineTo(24, 8); x.lineTo(-24, 8); x.closePath(); x.fill(); x.stroke();
  ell(-30, -12, 20, 7, '#3a3f4b', INK, 2.5); box(-10, 4, 28, 14, 4, '#9aa0aa', 2.5); circ(38, -18, 7, '#fff6b0', INK, 2); circ(2, -12, 6, '#ffd23f', INK, 2);
};

// ---------- learning UI (as in ABC Drive) ----------
function abcStrip(curIdx, k = 1) {
  if (process.env.THUMBBG) return;
  const w = 880, x0 = W / 2 - w / 2, step = w / 26;
  x.save(); x.globalAlpha *= k; x.fillStyle = 'rgba(255,255,255,.92)'; x.strokeStyle = INK; x.lineWidth = 3; rr(x0 - 10, 18, w + 20, 46, 22); x.fill(); x.stroke();
  x.textAlign = 'center'; x.textBaseline = 'middle';
  for (let i = 0; i < 26; i++) { const cx = x0 + step * (i + .5), on = i === curIdx, done = i < curIdx;
    if (on) circ(cx, 41, 18, '#9de0c4', INK, 2.5);
    x.font = C.FONT(on ? 28 : 21); x.fillStyle = on ? '#1d6f5f' : done ? INK : 'rgba(29,53,87,.4)'; x.fillText(ABC[i], cx, 43); }
  x.restore();
}
function letterBlock(Lt, cx, cy, s, col, k) {
  if (k <= 0) return;
  x.save(); x.globalAlpha *= clamp(k * 1.5); x.translate(cx, cy); const sc = s * (.6 + .4 * ease(k)); x.scale(sc, sc); x.rotate(.04);
  x.fillStyle = 'rgba(0,0,0,.15)'; x.beginPath(); x.ellipse(0, 112, 110, 12, 0, 0, 7); x.fill();
  x.fillStyle = col; x.strokeStyle = INK; x.lineWidth = 5; rr(-100, -100, 200, 200, 26); x.fill(); x.stroke();
  x.fillStyle = 'rgba(255,255,255,.92)'; rr(-80, -80, 160, 160, 18); x.fill();
  [[-88, -88], [88, -88], [-88, 88], [88, 88]].forEach(([a, b]) => circ(a, b, 6, 'rgba(255,255,255,.8)', INK, 2));
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = C.FONT(112); x.fillStyle = col; x.lineWidth = 6; x.strokeStyle = INK;
  x.strokeText(Lt + Lt.toLowerCase(), 0, 10); x.fillText(Lt + Lt.toLowerCase(), 0, 10);
  x.restore();
}
function pictureCard(name, cx, cy, k, t) {
  if (k <= 0) return;
  x.save(); x.globalAlpha *= clamp(k * 1.5); x.translate(cx, cy); const sc = .6 + .4 * ease(k); x.scale(sc, sc);
  x.fillStyle = '#ffffff'; x.strokeStyle = INK; x.lineWidth = 4; rr(-110, -92, 220, 184, 30); x.fill(); x.stroke();
  x.save(); rr(-108, -90, 216, 180, 28); x.clip(); x.fillStyle = '#eef8ff'; x.fillRect(-110, -92, 220, 184); x.translate(0, 4); V[name](t); x.restore();
  x.strokeStyle = INK; x.lineWidth = 4; rr(-110, -92, 220, 184, 30); x.stroke();
  x.restore();
}
function wordCard(txt, cx, cy, col, k) {
  if (k <= 0) return;
  x.save(); x.globalAlpha *= clamp(k * 1.5); x.font = C.FONT(txt.length > 11 ? 38 : 44); const w = x.measureText(txt).width + 56;
  x.translate(cx, cy); const sc = .7 + .3 * ease(k); x.scale(sc, sc);
  x.fillStyle = '#fff'; x.strokeStyle = INK; x.lineWidth = 4; rr(-w / 2, -32, w, 64, 30); x.fill(); x.stroke();
  x.textAlign = 'left'; x.textBaseline = 'middle'; const lw = x.measureText(txt[0]).width; const px = -w / 2 + 28;
  x.fillStyle = col; x.fillText(txt[0], px, 3); x.fillStyle = INK; x.fillText(txt.slice(1), px + lw, 3);
  x.restore();
}

// ---------- little town (behind the road) ----------
const HOUSES = [[400, 108, '#ffd6a5', 'shop'], [500, 140, '#bde0fe', 'flat'], [590, 96, '#ffc8dd', 'house'], [668, 124, '#caffbf', 'garage'], [776, 104, '#fdffb6', 'house'], [860, 132, '#cdb4db', 'flat']];
function town(t) {
  HOUSES.forEach(([cx, h, col, kind], i) => {
    const w = kind === 'garage' ? 100 : kind === 'flat' ? 84 : 72, top = 412 - h;
    if (kind === 'house') { x.fillStyle = '#e76f51'; st(3); x.beginPath(); x.moveTo(cx - w / 2 - 8, top + 2); x.lineTo(cx, top - 32); x.lineTo(cx + w / 2 + 8, top + 2); x.closePath(); x.fill(); x.stroke(); }
    box(cx - w / 2, top, w, h, 6, col, 3);
    if (kind === 'shop') { for (let k = 0; k < 5; k++) { x.fillStyle = k % 2 ? '#fff' : '#ff5d8f'; x.fillRect(cx - w / 2 + k * w / 5, top + 18, w / 5, 16); } st(2.5); x.strokeRect(cx - w / 2, top + 18, w, 16);
      box(cx - 26, top + 46, 52, 40, 4, '#d6f0ff', 2.5); box(cx - 10, 412 - 22, 20, 22, 3, '#8a5a36', 2.5); }
    if (kind === 'flat') { for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) box(cx - 28 + c * 34, top + 14 + r * 36, 22, 22, 3, (hash(i * 7 + r * 3 + c) > .5) ? '#fff6b0' : '#d6f0ff', 2.5); }
    if (kind === 'house') { box(cx - 26, top + 20, 20, 20, 3, '#d6f0ff', 2.5); box(cx + 6, top + 20, 20, 20, 3, '#d6f0ff', 2.5); box(cx - 10, 412 - 30, 20, 30, 3, '#3a86ff', 2.5); }
    if (kind === 'garage') { box(cx - 40, top + 40, 80, 84, 4, '#e8e8e8', 2.5); x.strokeStyle = 'rgba(29,53,87,.35)'; x.lineWidth = 2; for (let k = 1; k < 6; k++) { x.beginPath(); x.moveTo(cx - 40, top + 40 + k * 14); x.lineTo(cx + 40, top + 40 + k * 14); x.stroke(); }
      box(cx - 44, top + 8, 88, 24, 8, '#2fb36a', 2.5); T.bolt(cx - 30, top + 20, .6, '#ffd23f'); x.font = C.FONT(15); x.fillStyle = '#fff'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText('CHARGE', cx - 20, top + 21); }
  });
  // traffic light slowly cycling (12 s)
  const p = (t % 12) / 12, li = p < .45 ? 0 : p < .55 ? 1 : 2;
  x.fillStyle = '#5c677d'; x.fillRect(922, 300, 6, 112); box(910, 250, 30, 74, 8, '#3a3f4b', 3);
  ['#e63946', '#ffd23f', '#52b788'].forEach((c, k) => { const on = k === li; circ(925, 264 + k * 23, 8, on ? c : 'rgba(255,255,255,.18)', INK, 1.5); if (on) circ(925, 264 + k * 23, 13, c + '55'); });
}
const scene = (t) => T.world({ t, dist: 0, skyP: .2, near: 'trees', behindRoad: () => town(t) });
function truck(t, o = {}) { return T.truck(Object.assign({ t, dist: 0, moving: false, bx: BX, happy: true }, o)); }

// ---------- timeline ----------
const INTRO = 11, ABC_D = 26 * SEG;
const abcSays = [], abcSfx = [];
L.forEach(([word, col, obj, snd], i) => {
  const s = i * SEG;
  abcSfx.push([s + .5, `chime:${CHIME[i % 7]}`, .5]);
  if (snd) abcSfx.push([s + 1.3, snd, .35]);
  abcSays.push(['toet', `${ABC[i]} is for ${word}!`, s + 1.6, s + 4.5, BX + 30, 236, word.length > 10 ? 24 : word.length > 7 ? 27 : 30]);
});

St.episode({
  title: ['Vehicle ABC', 70], sub: 'with Little Truck Toet', accent: '#2a9d8f', cardBg: '#eafaf5',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'vehicleabc', shift: 0 },
  shots: [
    // 1 – Toet drives into town and parks
    { d: INTRO, draw: (u, c) => {
        const k = ease(clamp((u - 1) / 5)), bx = lerp(-300, BX, k);
        scene(c.t);
        truck(c.t, { bx, moving: k < 1 && u > 1, dist: k * 400, mouth: c.talk('toet') });
        abcStrip(-1, clamp((u - 8.6) / .6));
      },
      says: [['toet', 'Hello! I love vehicles!', 5.8, 8.4, BX + 50, 236, 27], ["toet", "Let's learn the ABC!", 8.6, 10.8, BX + 40, 236, 27]],
      sfx: [[5.4, 'honk', .45]] },

    // 2 – A to Z
    { d: ABC_D, draw: (u, c) => {
        const i = Math.min(25, Math.floor(u / SEG)), v = u - i * SEG, [word, col, obj] = L[i];
        scene(c.t);
        const out = clamp((SEG - .35 - v) / .35);
        truck(c.t, { dist: 400, mouth: c.talk('toet') });
        abcStrip(i);
        const dy = process.env.THUMBBG ? 70 : 0;
        letterBlock(ABC[i], 488, 200 + dy, .72, col, clamp((v - .4) / .45) * out);
        pictureCard(obj, 764, 182 + dy, clamp((v - .8) / .45) * out, c.t);
        wordCard(word, 764, 326 + dy, col, clamp((v - 1.1) / .4) * out);
      },
      says: abcSays, sfx: abcSfx },

    // 3 – recap
    { d: 18, draw: (u, c) => {
        scene(c.t);
        truck(c.t, { dist: 400, mouth: c.talk('toet') });
        x.fillStyle = 'rgba(236,250,245,.95)'; x.fillRect(0, 0, W, 540);
        C.bigText('A to Z – all together!', W / 2, 74, win(u, .3, 17.6, .4), 50, '#2a9d8f');
        const cols = ['#e63946', '#3a86ff', '#2a9d8f', '#ff9f1c', '#9b5de5', '#ffb627'];
        for (let i = 0; i < 26; i++) { const r = Math.floor(i / 9), cc = i % 9, n = r === 2 ? 8 : 9;
          const cx = W / 2 + (cc - (n - 1) / 2) * 92, cy = 170 + r * 96, t0 = 1.6 + i * .5, k = clamp((u - t0) / .3), on = u >= t0 && u < t0 + .5;
          x.save(); x.globalAlpha = .25 + .75 * k; x.translate(cx, cy); const sc = on ? 1.14 : 1; x.scale(sc, sc);
          if (on) circ(0, 0, 46, 'rgba(157,224,196,.6)');
          x.fillStyle = k > 0 ? cols[i % 6] : '#c9c9c9'; x.strokeStyle = INK; x.lineWidth = 3; rr(-34, -34, 68, 68, 12); x.fill(); x.stroke();
          x.font = C.FONT(44); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ABC[i], 0, 4); x.restore(); }
        C.bigText('Well done!', W / 2, 482, win(u, 15.2, 17.8, .3), 46, '#ffd23f');
      },
      sfx: Array.from({ length: 26 }, (_, i) => [1.6 + i * .5, `chime:${CHIME[i % 7]}`, .32]).concat([[15.2, 'cheer', .4]]) },

    // 4 – Toet drives off
    { d: 12, draw: (u, c) => {
        const k = ease(clamp((u - 4.6) / 5.4)), bx = lerp(BX, 1150, k);
        scene(c.t);
        truck(c.t, { bx, moving: u > 4.6, dist: 400 + k * 900, mouth: c.talk('toet') });
      },
      says: [['toet', 'Bye bye! Toot toot!', 1, 4.4, BX + 40, 236, 28]],
      sfx: [[4.6, 'honk', .5]] },
  ],
});
