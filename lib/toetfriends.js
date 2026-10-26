// Nieuwe figuren voor "Toet op avontuur". Oorsprong = grond, midden van het voertuig; kijken naar rechts.
const C = require('./common'), T = require('./toet');
const { x, rr, circ } = C;
const INK = '#1d3557';
const fillS = (f, s = INK, lw = 4) => { x.fillStyle = f; x.fill(); x.lineWidth = lw; x.strokeStyle = s; x.stroke(); };
function wheel(wx, r = 22, rot = 0) { circ(wx, -r, r, INK); circ(wx, -r, r * .5, '#dfe7ef'); x.save(); x.translate(wx, -r); x.rotate(rot); x.strokeStyle = INK; x.lineWidth = 3; for (let i = 0; i < 3; i++) { x.rotate(2.094); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, r * .45); x.stroke(); } x.restore(); }
function eyes(ex, ey, gap, r, blink, look = 2) {
  [0, gap].forEach(o => { if (blink) { x.fillStyle = INK; x.fillRect(ex + o - r, ey - 1.5, r * 2, 3); } else { circ(ex + o + look, ey, r, INK); circ(ex + o + look + 2, ey - 2, r * .35, '#fff'); } });
}

function mouthAt(cx, cy, r, m) {
  if (m > .08) { x.beginPath(); x.ellipse(cx, cy + 2, r * .7, 2 + m * r * .6, 0, 0, 7); x.fillStyle = '#7a2e2e'; x.fill(); }
  else { x.beginPath(); x.arc(cx, cy, r, .3, Math.PI - .3); x.lineWidth = 3; x.strokeStyle = INK; x.stroke(); }
}
// Toet op willekeurige plek: px = midden, gy = grond
function toetAt(px, gy, s = 1, o = {}) {
  x.save(); x.translate(px, gy); x.scale(s * (o.flip ? -1 : 1), s); x.translate(-380, -(T.ROAD + 46));
  T.truck(Object.assign({ t: 1, dist: 0, moving: false, bx: 310, happy: true }, o)); x.restore();
}

// Opa Brom: oude vrachtwagen met lange neus, snor, wenkbrauwen en pet
function opa(t = 1, o = {}) {
  // laadbak met houten planken
  rr(-175, -78, 150, 30, 6); fillS('#b07a45'); [-140, -105, -70].forEach(px => { x.beginPath(); x.moveTo(px, -78); x.lineTo(px, -48); x.lineWidth = 3; x.strokeStyle = INK; x.stroke(); });
  // uitlaat
  rr(-30, -175, 12, 70, 4); fillS('#7d8597');
  if (o.puff) [0, 1, 2].forEach(i => { const k = ((t * .6 + i / 3) % 1); circ(-24 - k * 30, -185 - k * 50, 8 + k * 12, `rgba(200,200,210,${.7 * (1 - k)})`); });
  // cabine
  rr(-25, -150, 90, 110, 16); fillS('#2a9d8f');
  // pet
  x.beginPath(); x.moveTo(-28, -150); x.quadraticCurveTo(20, -185, 68, -150); x.closePath(); fillS('#6b4f3a'); rr(40, -158, 45, 10, 5); fillS('#6b4f3a');
  // raam + gezicht
  rr(-10, -135, 64, 46, 10); fillS('#d8f3ff', INK, 3);
  eyes(8, -110, 26, 6, o.blink);
  [[2, -124], [28, -124]].forEach(([bx, by]) => { rr(bx - 2, by - 3, 18, 7, 3); x.fillStyle = '#e9ecef'; x.fill(); });
  // snor
  x.beginPath(); x.moveTo(22, -78); x.quadraticCurveTo(0, -90, -6, -72); x.quadraticCurveTo(10, -76, 22, -70); x.quadraticCurveTo(34, -76, 50, -72); x.quadraticCurveTo(44, -90, 22, -78); x.closePath(); fillS('#f1f3f5', INK, 2.5);
  mouthAt(22, -64, 8, o.mouth || 0);
  // motorkap
  x.beginPath(); x.moveTo(65, -105); x.lineTo(140, -100); x.quadraticCurveTo(165, -98, 165, -75); x.lineTo(165, -40); x.lineTo(65, -40); x.closePath(); fillS('#2a9d8f');
  rr(150, -95, 14, 50, 4); fillS('#adb5bd', INK, 3);
  circ(150, -60, 9, '#fff6b0'); x.beginPath(); x.arc(150, -60, 9, 0, 7); x.lineWidth = 3; x.strokeStyle = INK; x.stroke();
  // spatborden + wielen
  [-120, 115].forEach(wx => { x.beginPath(); x.arc(wx, -26, 32, Math.PI, 0); fillS('#264653'); });
  x.fillStyle = INK; x.fillRect(-180, -44, 350, 8);
  wheel(-120, 26, t * 3); wheel(115, 26, t * 3);
}

// Oma Tuf: rond oud busje met bril, krulletjes en een bloem
function oma(t = 1, o = {}) {
  rr(-120, -165, 230, 140, 46); fillS('#cdb4db');
  x.save(); rr(-120, -165, 230, 140, 46); x.clip(); x.fillStyle = '#fff3e0'; x.fillRect(-130, -170, 260, 62); x.restore();
  rr(-120, -165, 230, 140, 46); x.lineWidth = 4; x.strokeStyle = INK; x.stroke();
  // krulletjes + bloem
  [[30, -168], [48, -172], [66, -170], [84, -164]].forEach(([cx, cy]) => { circ(cx, cy, 11, '#f8f9fa'); x.beginPath(); x.arc(cx, cy, 11, Math.PI, 0); x.lineWidth = 2; x.strokeStyle = INK; x.stroke(); });
  [0, 1, 2, 3, 4].forEach(i => { const a = i / 5 * Math.PI * 2; circ(-60 + Math.cos(a) * 10, -172 + Math.sin(a) * 10, 8, '#ff5d8f'); }); circ(-60, -172, 6, '#ffd23f');
  // zijramen
  [-95, -50].forEach(wx => { rr(wx, -145, 36, 30, 8); fillS('#d8f3ff', INK, 3); });
  // voorruit + bril
  rr(15, -150, 82, 44, 14); fillS('#d8f3ff', INK, 3);
  eyes(38, -128, 32, 6, o.blink);
  [38, 70].forEach(gx => { x.beginPath(); x.arc(gx + 2, -128, 13, 0, 7); x.lineWidth = 3; x.strokeStyle = '#9d4edd'; x.stroke(); });
  x.beginPath(); x.moveTo(53, -128); x.lineTo(59, -128); x.stroke();
  circ(40, -96, 6, 'rgba(255,100,120,.45)'); circ(88, -96, 6, 'rgba(255,100,120,.45)');
  mouthAt(66, -96, 10, o.mouth || 0);
  circ(104, -60, 8, '#fff6b0');
  x.fillStyle = INK; x.fillRect(-115, -32, 222, 8);
  wheel(-65, 24, t * 3); wheel(60, 24, t * 3);
}

// Bus Bas: lange stadsbus met passagiers
function bus(t = 1, o = {}) {
  rr(-280, -180, 520, 150, 22); fillS('#ffb703');
  x.fillStyle = '#219ebc'; x.fillRect(-278, -62, 516, 14);
  const faces = ['#f9d7c0', '#8d5524', '#f1c27d', '#c68642', '#5c3a21', '#e0ac69'];
  for (let i = 0; i < 6; i++) { const wx = -260 + i * 66; rr(wx, -160, 54, 56, 8); fillS('#d8f3ff', INK, 3); if ((o.pass ?? 6) <= 5 - i) continue; circ(wx + 27, -122, 13, faces[i]); circ(wx + 22, -124, 2, INK); circ(wx + 32, -124, 2, INK); }
  // deur
  rr(140, -160, 40, 120, 6); fillS('#d8f3ff', INK, 3); x.beginPath(); x.moveTo(160, -160); x.lineTo(160, -40); x.stroke();
  // voorruit + gezicht
  rr(188, -168, 46, 80, 10); fillS('#d8f3ff', INK, 3);
  eyes(200, -138, 20, 6, o.blink, 3);
  mouthAt(222, -78, 11, o.mouth || 0);
  rr(-200, -200, 150, 22, 6); fillS('#023047', INK, 3); x.save(); x.translate(-125, -189); if (o.flip) x.scale(-1, 1); x.font = C.FONT(18); x.fillStyle = '#ffd23f'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('LIJN 5', 0, 0); x.restore();
  wheel(-190, 24, t * 3); wheel(150, 24, t * 3);
}

// Takel Tim: kleine takelwagen
function tow(t = 1, o = {}) {
  rr(-110, -70, 120, 40, 8); fillS('#f77f00');
  x.beginPath(); x.moveTo(-90, -70); x.lineTo(-60, -140); x.lineWidth = 8; x.strokeStyle = '#7d8597'; x.stroke();
  x.beginPath(); x.moveTo(-60, -140); x.lineTo(-60, -95); x.lineWidth = 3; x.stroke(); x.beginPath(); x.arc(-60, -88, 8, -.5, Math.PI); x.lineWidth = 4; x.stroke();
  rr(5, -135, 80, 105, 16); fillS('#f77f00');
  rr(18, -122, 54, 40, 10); fillS('#d8f3ff', INK, 3);
  eyes(30, -102, 22, 6, o.blink);
  mouthAt(45, -62, 10, o.mouth || 0);
  rr(25, -150, 34, 14, 5); fillS('#e63946', INK, 3);
  x.fillStyle = INK; x.fillRect(-115, -34, 205, 8);
  wheel(-75, 22, 0); wheel(50, 22, 0);
}

// eendjes
function duck(px, py, s, col = '#ffd23f', flip = false) {
  x.save(); x.translate(px, py); x.scale(s * (flip ? -1 : 1), s);
  x.beginPath(); x.ellipse(0, -14, 22, 14, 0, 0, 7); fillS(col, INK, 2.5);
  circ(18, -32, 11, col); x.beginPath(); x.arc(18, -32, 11, 0, 7); x.lineWidth = 2.5; x.strokeStyle = INK; x.stroke();
  x.beginPath(); x.moveTo(28, -33); x.lineTo(40, -29); x.lineTo(28, -26); x.closePath(); fillS('#ff9f1c', INK, 2);
  circ(21, -35, 2.2, INK);
  x.restore();
}

module.exports = { toetAt, opa, oma, bus, tow, duck, wheel, INK };
