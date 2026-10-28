process.env.TOET_LANG = 'en';
// De Grote Vier van Afrika — 1920x1080, 30 fps, 60 s
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
GlobalFonts.registerFromPath(__dirname + '/fonts/Baloo2.ttf', 'Baloo2');
const OUT_W = +(process.env.OW || 1920), OUT_H = +(process.env.OH || 1080);
const W = 960, H = 540, FPS = 30, DUR = 60, GROUND = 462;
const cv = createCanvas(OUT_W, OUT_H), x = cv.getContext('2d');
x.setTransform(OUT_W / W, 0, 0, OUT_H / H, 0, 0);
const FONT = s => `bold ${s}px Baloo2`;
const INK = '#3a2414';
const hash = n => { const s = Math.sin(n * 127.1 + 31.7) * 43758.5453; return s - Math.floor(s); };
const lerp = (a, b, k) => a + (b - a) * k, clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = k => k * k * (3 - 2 * k);
const hex = h => h[0] === '#' ? [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)) : h.match(/\d+/g).map(Number);
const mix = (a, b, k) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], k))).join(',')})`; };
function rr(a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
function ell(cx, cy, rx, ry, fill, stroke, lw = 3) { x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, 7); if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw; x.stroke(); } }
function circ(cx, cy, r, fill, stroke, lw = 3) { ell(cx, cy, r, r, fill, stroke, lw); }
let t = 0;

// ---------------- decor ----------------
function sky() {
  const k = clamp(t / 8), s = clamp((t - 52) / 6);
  let top = mix('#f08a4b', '#7cc6ee', k), bot = mix('#ffd38a', '#fff1c9', k);
  top = mix(top, '#e8704a', s); bot = mix(bot, '#ffcf7a', s);
  const g = x.createLinearGradient(0, 0, 0, 330); g.addColorStop(0, top); g.addColorStop(1, bot);
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // zon
  const sy = lerp(300, 120, ease(clamp(t / 12))) + s * 140;
  circ(760, sy, 70, 'rgba(255,235,160,.35)'); circ(760, sy, 48, mix('#ffb347', '#ffe066', clamp(t / 10)));
  // wolkjes
  for (let i = 0; i < 4; i++) { const cx = ((hash(i) * 1200 - t * (6 + i * 2)) % 1200 + 1200) % 1200 - 120, cy = 50 + hash(i + 9) * 90;
    x.fillStyle = 'rgba(255,255,255,.75)'; x.beginPath(); [[0,0,20],[24,-10,26],[50,0,20]].forEach(([a, b, r]) => { x.moveTo(cx + a + r, cy + b); x.arc(cx + a, cy + b, r, 0, 7); }); x.fill(); }
  // vogels
  x.strokeStyle = 'rgba(58,36,20,.7)'; x.lineWidth = 2;
  for (let i = 0; i < 4; i++) { const bx = ((t * 35 + i * 70) % 1150) - 100, by = 90 + i * 14 + Math.sin(t * 2 + i) * 6, f = Math.sin(t * 9 + i) * 5;
    x.beginPath(); x.moveTo(bx - 9, by - f); x.quadraticCurveTo(bx - 3, by - 4, bx, by); x.quadraticCurveTo(bx + 3, by - 4, bx + 9, by - f); x.stroke(); }
}
function mountain() {
  x.fillStyle = '#c9a6b8'; x.beginPath(); x.moveTo(60, 330); x.lineTo(210, 222); x.quadraticCurveTo(250, 205, 290, 220); x.lineTo(470, 330); x.closePath(); x.fill();
  x.fillStyle = '#fbf6f2'; x.beginPath(); x.moveTo(184, 241); x.lineTo(210, 222); x.quadraticCurveTo(250, 205, 290, 220); x.lineTo(318, 238);
  x.lineTo(300, 246); x.lineTo(282, 236); x.lineTo(262, 248); x.lineTo(240, 236); x.lineTo(220, 248); x.lineTo(202, 238); x.closePath(); x.fill();
}
function acacia(px, py, s) {
  x.save(); x.translate(px, py); x.scale(s, s);
  x.strokeStyle = '#5b3a1e'; x.lineCap = 'round';
  x.lineWidth = 9; x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(-4, -40, 4, -70); x.stroke();
  x.lineWidth = 5; x.beginPath(); x.moveTo(2, -55); x.quadraticCurveTo(-20, -70, -40, -82); x.moveTo(3, -62); x.quadraticCurveTo(25, -72, 42, -84); x.stroke();
  x.fillStyle = '#5f8a3a'; x.beginPath(); x.ellipse(0, -92, 78, 15, 0, 0, 7); x.fill();
  x.fillStyle = '#76a646'; x.beginPath(); x.ellipse(-14, -98, 56, 11, 0, 0, 7); x.ellipse(24, -94, 40, 9, 0, 0, 7); x.fill();
  x.restore();
}
function giraffeSil(px, py, s) {
  x.save(); x.translate(px, py); x.scale(s, s); x.fillStyle = 'rgba(120,80,60,.35)';
  x.beginPath(); x.ellipse(0, -40, 20, 10, 0, 0, 7); x.fill();
  [-14, -6, 8, 15].forEach(l => x.fillRect(l, -36, 3, 36));
  x.beginPath(); x.moveTo(-16, -44); x.lineTo(-30, -92); x.lineTo(-24, -94); x.lineTo(-8, -46); x.fill();
  x.beginPath(); x.ellipse(-32, -94, 8, 4, -.3, 0, 7); x.fill();
  x.restore();
}
function land() {
  mountain();
  giraffeSil(560, 334, .7); giraffeSil(600, 334, .55);
  x.fillStyle = '#e9c27b'; x.beginPath(); x.moveTo(0, 340);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 328 + Math.sin(i * .01) * 6); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  acacia(120, 350, .6); acacia(860, 346, .5); acacia(660, 352, .4);
  x.fillStyle = '#ddb062'; x.beginPath(); x.moveTo(0, 380);
  for (let i = 0; i <= W; i += 10) x.lineTo(i, 372 + Math.sin(i * .007 + 2) * 8); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  acacia(330, 395, 1); acacia(905, 400, .85);
  // pad
  x.fillStyle = '#d29a4c'; x.beginPath(); x.ellipse(W / 2, GROUND + 10, 620, 38, 0, 0, 7); x.fill();
  // grashalmen achter
  grass(368, 18, 0, '#b88c3a');
}
function grass(y, h, seed, col) {
  x.strokeStyle = col; x.lineWidth = 2.5; x.lineCap = 'round';
  for (let i = 0; i < 90; i++) { const gx = hash(i + seed) * W, gh = h * (.6 + hash(i * 2 + seed) * .8), sw = Math.sin(t * 1.8 + gx * .02) * 4;
    x.beginPath(); x.moveTo(gx, y); x.quadraticCurveTo(gx + sw * .5, y - gh * .6, gx + sw, y - gh); x.stroke(); }
}
function foreground() {
  x.fillStyle = '#c98a3c'; x.fillRect(0, 500, W, 40);
  grass(540, 46, 50, '#a8772b'); grass(540, 34, 90, '#c6973f');
}

// --------------- dieren (kijken naar de kijker, lopen naar links) ---------------
function eyes(ex, ey, gap, r, blink) {
  [-gap / 2, gap / 2].forEach(o => {
    if (blink) { x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.moveTo(ex + o - r, ey); x.lineTo(ex + o + r, ey); x.stroke(); }
    else { circ(ex + o, ey, r, '#fff', INK, 2); circ(ex + o - 1, ey + 1, r * .55, INK); circ(ex + o - 2, ey - 1, r * .2, '#fff'); }
  });
}
function leg(lx, ly, w, h, ang, col, hoof) {
  x.save(); x.translate(lx, ly); x.rotate(ang);
  x.fillStyle = col; x.strokeStyle = INK; x.lineWidth = 3; rr(-w / 2, -w / 2, w, h + w / 2, w / 2.2); x.fill(); x.stroke();
  if (hoof) { x.fillStyle = hoof; rr(-w / 2, h - 6, w, 8, 3); x.fill(); x.stroke(); }
  x.restore();
}
function mouth(mx, my, act, w = 8) {
  if (act > .08) { ell(mx, my + act * 6, w, 3 + act * 11, '#5a1e1e', INK, 2.5); ell(mx, my + act * 12, w * .6, 3 * act + 1, '#ff8fa3'); }
  else { x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.arc(mx, my - 3, w, .3, Math.PI - .3); x.stroke(); }
}
function cheeks(cx, cy, gap) { x.fillStyle = 'rgba(255,110,120,.35)'; [-gap / 2, gap / 2].forEach(o => { x.beginPath(); x.arc(cx + o, cy, 6, 0, 7); x.fill(); }); }

function lion(ph, mv, act, bl) {
  const sw = mv ? Math.sin(ph) * .4 : 0;
  x.strokeStyle = '#c9852f'; x.lineWidth = 6; x.lineCap = 'round';
  x.beginPath(); x.moveTo(55, -62); x.quadraticCurveTo(95, -60, 100, -95 + Math.sin(t * 3) * 6); x.stroke();
  circ(100, -98 + Math.sin(t * 3) * 6, 9, '#8a4b1a', INK, 2);
  leg(-30, -48, 16, 46, sw, '#cf8a33'); leg(38, -48, 16, 46, -sw, '#cf8a33');
  ell(0, -62, 62, 32, '#e8a33d', INK);
  leg(-40, -46, 17, 46, -sw, '#e8a33d'); leg(28, -46, 17, 46, sw, '#e8a33d');
  x.save(); x.translate(-58, -92); x.rotate(-act * .12); x.translate(Math.sin(t * 60) * act * 2, 0);
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; circ(Math.cos(a) * 38, Math.sin(a) * 38, 13, '#b5651d'); }
  circ(0, 0, 40, '#b5651d'); x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.arc(0, 0, 51, 0, 7); x.stroke();
  circ(-18, -24, 9, '#e8a33d', INK, 2.5); circ(18, -24, 9, '#e8a33d', INK, 2.5);
  circ(0, 0, 29, '#f2b84b', INK);
  eyes(0, -6, 20, 6, bl); cheeks(0, 8, 34);
  ell(0, 11, 14, 9, '#fde2b0');
  x.fillStyle = INK; x.beginPath(); x.moveTo(-6, 4); x.lineTo(6, 4); x.lineTo(0, 10); x.fill();
  mouth(0, 18, act, 8);
  x.restore();
}
function elephant(ph, mv, act, bl) {
  const sw = mv ? Math.sin(ph) * .3 : 0, G = '#9aa5b1', G2 = '#86919e';
  x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.moveTo(88, -100); x.quadraticCurveTo(108, -80, 100, -55 + Math.sin(t * 3) * 4); x.stroke();
  leg(-45, -62, 28, 60, sw, G2); leg(55, -62, 28, 60, -sw, G2);
  ell(0, -100, 95, 60, G, INK);
  leg(-60, -60, 30, 60, -sw, G); leg(42, -60, 30, 60, sw, G);
  x.save(); x.translate(-82, -135);
  const flap = Math.sin(t * 2.2) * .1 + act * .25;
  [-1, 1].forEach(sd => { x.save(); x.translate(sd * 34, 0); x.rotate(sd * flap); ell(sd * 22, 4, 34, 42, G2, INK); ell(sd * 22, 4, 22, 30, '#e7b9c3'); x.restore(); });
  circ(0, 0, 42, G, INK);
  // slurf
  const up = ease(clamp(act * 1.4));
  const ex = lerp(-12, -58, up), ey = lerp(78, -70, up);
  x.strokeStyle = INK; x.lineWidth = 22; x.lineCap = 'round';
  x.beginPath(); x.moveTo(0, 14); x.bezierCurveTo(0, 50, lerp(-4, -40, up), lerp(70, 10, up), ex, ey); x.stroke();
  x.strokeStyle = G; x.lineWidth = 16; x.stroke();
  x.strokeStyle = G2; x.lineWidth = 2; for (let i = 1; i < 5; i++) { const k = i / 5; const px = lerp(0, ex, k), py = lerp(30, ey, k); x.beginPath(); x.moveTo(px - 7, py); x.lineTo(px + 7, py); x.stroke(); }
  x.fillStyle = '#fffaf0'; x.strokeStyle = INK; x.lineWidth = 2;
  [-1, 1].forEach(sd => { x.beginPath(); x.moveTo(sd * 12, 18); x.quadraticCurveTo(sd * 22, 36, sd * 10, 42); x.quadraticCurveTo(sd * 14, 30, sd * 6, 22); x.closePath(); x.fill(); x.stroke(); });
  eyes(0, -10, 26, 6, bl); cheeks(0, 6, 46);
  if (act > .1) ell(18, 26, 6, 4 + act * 5, '#5a1e1e', INK, 2);
  x.restore();
}
function rhino(ph, mv, act, bl) {
  const sw = mv ? Math.sin(ph) * .35 : 0, C = '#a39a8e', C2 = '#8d8478';
  x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.moveTo(78, -70); x.quadraticCurveTo(95, -60, 90, -42 + Math.sin(t * 3) * 4); x.stroke();
  leg(-36, -46, 24, 44, sw, C2); leg(46, -46, 24, 44, -sw, C2);
  ell(0, -68, 82, 42, C, INK);
  ell(10, -90, 40, 12, 'rgba(255,255,255,.12)');
  leg(-48, -44, 25, 44, -sw, C); leg(34, -44, 25, 44, sw, C);
  x.save(); x.translate(-78, -70 + act * 6); x.rotate(act * .1 * Math.sin(t * 20));
  [-1, 1].forEach(sd => { x.save(); x.translate(sd * 22, -30); x.rotate(sd * (.4 + Math.sin(t * 3 + sd) * .1)); ell(0, -8, 8, 15, C2, INK, 2.5); ell(0, -8, 4, 9, '#e7b9c3'); x.restore(); });
  ell(0, 0, 36, 34, C, INK);
  ell(0, 22, 28, 18, '#b9b0a3', INK, 2.5);
  // hoorns
  x.fillStyle = '#efe4cf'; x.strokeStyle = INK; x.lineWidth = 2.5;
  x.beginPath(); x.moveTo(-11, 12); x.quadraticCurveTo(-4, -16, 2, -34); x.quadraticCurveTo(8, -10, 11, 12); x.closePath(); x.fill(); x.stroke();
  eyes(0, -8, 30, 5.5, bl); cheeks(0, 6, 48);
  circ(-8, 26, 3, INK); circ(8, 26, 3, INK);
  mouth(0, 36, act * .6, 7);
  x.restore();
}
function buffalo(ph, mv, act, bl) {
  const sw = mv ? Math.sin(ph) * .35 : 0, B = '#4a4248', B2 = '#3a3338';
  x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.moveTo(74, -70); x.quadraticCurveTo(92, -55, 86, -30 + Math.sin(t * 3) * 4); x.stroke();
  circ(86, -28 + Math.sin(t * 3) * 4, 6, B2);
  leg(-34, -48, 20, 46, sw, B2, '#2a2224'); leg(44, -48, 20, 46, -sw, B2, '#2a2224');
  ell(0, -70, 78, 40, B, INK);
  ell(-30, -100, 34, 18, B, null);
  leg(-46, -46, 21, 46, -sw, B, '#2a2224'); leg(32, -46, 21, 46, sw, B, '#2a2224');
  x.save(); x.translate(-74, -78); x.rotate(-act * .15);
  // hoorns
  x.strokeStyle = INK; x.lineWidth = 15; x.lineCap = 'round';
  const horns = () => { x.beginPath(); x.moveTo(0, -26); x.bezierCurveTo(-34, -40, -64, -26, -56, -2); x.quadraticCurveTo(-54, -12, -66, -16); x.moveTo(0, -26); x.bezierCurveTo(34, -40, 64, -26, 56, -2); x.quadraticCurveTo(54, -12, 66, -16); x.stroke(); };
  horns(); x.strokeStyle = '#d8cdb8'; x.lineWidth = 10; horns();
  [-1, 1].forEach(sd => ell(sd * 36, -6, 13, 7, B2, INK, 2.5));
  ell(0, 4, 28, 32, B, INK);
  ell(0, 24, 20, 13, '#7a7076', INK, 2.5);
  eyes(0, -6, 26, 5.5, bl); cheeks(0, 8, 42);
  circ(-6, 24, 2.6, INK); circ(6, 24, 2.6, INK);
  mouth(0, 34, act, 7);
  x.restore();
}

// --------------- regie ---------------
const CAST = [
  { s: 5,  draw: lion,     sc: 1.35, name: "Leo the Lion",      hi: "Hi! I'm Leo the Lion!",      snd: 'ROAAAR!',     fact: "I'm the king of the savanna!", top: 150 },
  { s: 17, draw: elephant, sc: 1.1,  name: "Ella the Elephant",   hi: "Hello! I'm Ella the Elephant!", snd: "TOOOOOT!",    fact: "With my trunk I can drink and shower!", top: 200 },
  { s: 29, draw: rhino,    sc: 1.3,  name: "Nico the Rhino", hi: "Hey! I'm Nico the Rhino!",  snd: "SNIFF SNIFF!", fact: "My horn is made of the same stuff as your nails!", top: 160 },
  { s: 41, draw: buffalo,  sc: 1.3,  name: "Boris the Buffalo",   hi: "Hi! I'm Boris the Buffalo!",   snd: "MOOOOOH!",    fact: "I live with a hundred friends!", top: 170 },
];
const CX = 520;
function bubble(txt, bx, by, k, size = 32) {
  if (k <= 0) return;
  x.save(); x.globalAlpha = clamp(k * 2); x.font = FONT(size);
  const w = x.measureText(txt).width + 48, s = .7 + .3 * ease(clamp(k * 2));
  const left = clamp(bx - w / 2, 20, W - 20 - w);
  x.translate(left + w / 2, by); x.scale(s, s);
  x.fillStyle = '#fff'; x.strokeStyle = INK; x.lineWidth = 4;
  rr(-w / 2, -32, w, 64, 28); x.fill(); x.stroke();
  const tx = clamp(bx - (left + w / 2), -w / 2 + 30, w / 2 - 30);
  x.beginPath(); x.moveTo(tx - 12, 30); x.lineTo(tx - 4, 54); x.lineTo(tx + 14, 30); x.fill();
  x.beginPath(); x.moveTo(tx - 12, 31); x.lineTo(tx - 4, 54); x.lineTo(tx + 14, 31); x.stroke();
  x.fillStyle = INK; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 0, 2);
  x.restore();
}
function burst(txt, bx, by, k) {
  if (k <= 0 || k >= 1) return;
  const pop = ease(clamp(k * 5)), fade = clamp((1 - k) * 4), shake = Math.sin(t * 50) * 3 * fade;
  x.save(); x.translate(bx + shake, by); x.scale(pop, pop); x.rotate(-.06); x.globalAlpha = fade;
  x.fillStyle = '#ffd23f'; x.strokeStyle = INK; x.lineWidth = 4; x.beginPath();
  for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, r = i % 2 ? 70 : 100; x.lineTo(Math.cos(a) * r * 1.9, Math.sin(a) * r * .75); }
  x.closePath(); x.fill(); x.stroke();
  x.fillStyle = '#e8501f'; x.font = FONT(56); x.textAlign = 'center'; x.textBaseline = 'middle';
  x.lineWidth = 6; x.strokeStyle = '#fff'; x.strokeText(txt, 0, 4); x.fillText(txt, 0, 4);
  x.restore();
}
function sign(txt, k) {
  if (k <= 0) return;
  const y = lerp(H + 40, 482, ease(clamp(k)));
  x.save(); x.translate(150, y);
  x.fillStyle = '#7a4a24'; x.fillRect(-6, 0, 12, 60);
  x.fillStyle = '#a8693a'; x.strokeStyle = INK; x.lineWidth = 3; rr(-130, -34, 260, 52, 10); x.fill(); x.stroke();
  x.fillStyle = '#fff1d6'; x.font = FONT(30); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 0, -6);
  x.restore();
}
function card(l1, l2, k) {
  if (k <= 0) return;
  const s = .6 + .4 * ease(k);
  x.save(); x.globalAlpha = clamp(k * 1.5); x.translate(W / 2, 150); x.scale(s, s);
  x.fillStyle = '#fff8e8'; x.strokeStyle = INK; x.lineWidth = 6; rr(-330, -90, 660, 180, 40); x.fill(); x.stroke();
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillStyle = '#e8701f'; x.font = FONT(l1[1]); x.fillText(l1[0], 0, -20);
  x.fillStyle = INK; x.font = FONT(l2[1]); x.fillText(l2[0], 0, 46);
  x.restore();
}
function dust(px, py, k) {
  if (k <= 0 || k >= 1) return;
  for (let i = 0; i < 6; i++) { const a = hash(i) * Math.PI, r = 10 + k * 60 * (.5 + hash(i + 3));
    circ(px - Math.cos(a) * r * 1.4, py - Math.sin(a) * r * .5, 8 + k * 14, `rgba(230,200,150,${(1 - k) * .7})`); }
}

function actor(a, xpos, mv, act, sc) {
  x.save(); x.translate(xpos, GROUND + (mv ? -Math.abs(Math.sin(t * 7)) * 3 : 0)); x.scale(sc, sc);
  x.fillStyle = 'rgba(70,40,10,.22)'; x.beginPath(); x.ellipse(0, 2, 90, 9, 0, 0, 7); x.fill();
  a.draw(t * 7, mv, act, (t + a.s) % 3.3 > 3.15);
  x.restore();
}

function draw() {
  let signArgs = null;
  sky(); land();
  const fin = t >= 52.5;
  if (!fin) {
    const a = CAST.find(c => t >= c.s && t < c.s + 12);
    if (a) {
      const u = t - a.s;
      let px = CX, mv = false;
      if (u < 3) { px = lerp(W + 180, CX, ease(u / 3)); mv = true; }
      else if (u > 10) { px = lerp(CX, -220, ease((u - 10) / 2)); mv = true; }
      const sndK = (u - 6.5) / 2;
      const act = clamp(Math.sin(clamp(sndK) * Math.PI) * 1.4);
      if (a.draw === rhino) dust(px - 105 * a.sc, GROUND - 40 * a.sc, (u - 6.5) / 1.4);
      actor(a, px, mv, act, a.sc);
      const headY = GROUND - a.top * a.sc;
      bubble(a.hi, px - 70, headY - 70, u > 3.2 && u < 6.4 ? Math.min(u - 3.2, 6.4 - u) * 3 : 0);
      burst(a.snd, px - 40, headY - 80, sndK);
      bubble(a.fact, px - 70, headY - 70, u > 8.6 && u < 10.6 ? Math.min(u - 8.6, 10.6 - u) * 3 : 0, a.fact.length > 36 ? 26 : 30);
      signArgs = [a.name, u > 3 && u < 10.4 ? Math.min((u - 3) * 2.5, (10.4 - u) * 2.5) : 0];
    }
  } else {
    const k = ease(clamp((t - 53) / 3)), off = (1 - k) * 760;
    const lineup = [[1, 210, .78], [0, 420, .8], [2, 600, .78], [3, 795, .78]];
    lineup.forEach(([ci, tx, s]) => actor(CAST[ci], tx + off, k < 1, 0, s));
  }
  foreground();
  if (signArgs) sign(...signArgs);
  card(["The Big Four", 84], ["of Africa", 44], t < 2.6 ? clamp((t - .3) / .7) : clamp((4.6 - t) / .6));
  card(["We are the Big Four!", 58], ["Bye-bye!", 44], clamp((t - 56.2) / .6));
  const fade = Math.max(clamp(1 - t / .5), clamp((t - (DUR - 1)) / 1));
  if (fade > 0) { x.fillStyle = `rgba(0,0,0,${fade})`; x.fillRect(0, 0, W, H); }
}

if (process.env.STILL) {
  t = +process.env.STILL; draw();
  require('fs').writeFileSync(process.argv[2], cv.toBuffer('image/png'));
} else {
  const total = FPS * DUR; let i = 0; const out = process.stdout;
  (function next() {
    while (i < total) {
      t = i / FPS; draw();
      const buf = Buffer.from(x.getImageData(0, 0, OUT_W, OUT_H).data.buffer); i++;
      if (!out.write(buf)) { out.once('drain', next); return; }
    }
    out.end();
  })();
}
