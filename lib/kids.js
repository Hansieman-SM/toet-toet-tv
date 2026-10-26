// Kinderfiguren (vooraanzicht). Oorsprong = tussen de voeten. Ca. 105 hoog bij schaal 1.
const C = require('./common');
const { x } = C;
const INK = '#2b2d42';

function rr(a, b, w, h, r) { C.rr(a, b, w, h, r); }
function fill(c) { x.fillStyle = c; x.fill(); }
function circle(cx, cy, r, c) { x.beginPath(); x.arc(cx, cy, r, 0, 7); fill(c); }
function limb(px, py, ang, len, w, col, endCol, endR) {
  x.save(); x.translate(px, py); x.rotate(ang);
  rr(-w / 2, -w / 2, w, len + w / 2, w / 2); fill(col);
  if (endCol) { x.beginPath(); x.ellipse(0, len, endR || w * .7, (endR || w * .7) * .8, 0, 0, 7); fill(endCol); }
  x.restore();
}

// k: { skin, hair, hc, shirt, bottom:'shorts'|'skirt'|'pants'|'dress', bc, shoes, glasses }
// p: { la, ra, ll, rl (hoeken in rad, 0 = recht omlaag, positief = naar buiten), sit, mouth (0..1), blink, look }
function kid(k, p = {}) {
  const la = p.la ?? .15, ra = p.ra ?? .15, ll = p.ll ?? .06, rl = p.rl ?? .06;
  const legLen = p.sit ? 15 : 28, hipY = -30, shY = -56, hy = -80;
  const shoes = k.shoes || '#3d405b';
  // haar achter
  if (k.hair === 'afro') circle(0, hy - 6, 30, k.hc);
  if (k.hair === 'long') { rr(-24, hy - 14, 48, 50, 18); fill(k.hc); }
  // benen
  const legCol = (k.bottom === 'pants') ? k.bc : k.skin;
  limb(-7, hipY, ll, legLen, 10, legCol, shoes, 7);
  limb(7, hipY, -rl, legLen, 10, legCol, shoes, 7);
  // romp + onderkleding
  if (k.bottom === 'skirt' || k.bottom === 'dress') { x.beginPath(); x.moveTo(-13, hipY - 8); x.lineTo(13, hipY - 8); x.lineTo(20, hipY + 10); x.lineTo(-20, hipY + 10); x.closePath(); fill(k.bc); }
  if (k.bottom === 'shorts') { rr(-15, hipY - 6, 30, 14, 4); fill(k.bc); }
  if (k.bottom === 'pants') { rr(-14, hipY - 6, 28, 10, 4); fill(k.bc); }
  rr(-14, shY - 6, 28, 32, 9); fill(k.bottom === 'dress' ? k.bc : k.shirt);
  // armen
  limb(-14, shY, la, 25, 8, k.skin, k.skin, 5);
  limb(14, shY, -ra, 25, 8, k.skin, k.skin, 5);
  limb(-14, shY, la, 9, 9, k.bottom === 'dress' ? k.bc : k.shirt);
  limb(14, shY, -ra, 9, 9, k.bottom === 'dress' ? k.bc : k.shirt);
  // hoofd
  if (k.hair === 'hijab') {
    circle(0, hy, 25, k.hc);
    x.beginPath(); x.moveTo(-25, hy); x.quadraticCurveTo(-28, shY + 2, -18, shY + 10); x.quadraticCurveTo(0, shY + 16, 18, shY + 10); x.quadraticCurveTo(28, shY + 2, 25, hy); x.closePath(); fill(k.hc);
    x.beginPath(); x.moveTo(-18, shY + 10); x.quadraticCurveTo(0, shY + 16, 18, shY + 10); x.lineWidth = 2; x.strokeStyle = 'rgba(0,0,0,.15)'; x.stroke();
  }
  if (k.hair !== 'hijab') circle(0, hy + 16, 6, k.skin);
  if (k.hair !== 'hijab') { circle(-20, hy + 2, 5, k.skin); circle(20, hy + 2, 5, k.skin); }
  if (k.hair === 'hijab') { x.beginPath(); x.ellipse(0, hy + 1, 16, 18, 0, 0, 7); fill(k.skin); } else circle(0, hy, 20, k.skin);
  // haar voor
  const cap = (drop = 8) => { x.beginPath(); x.arc(0, hy, 21, Math.PI * 1.02, Math.PI * 1.98); x.quadraticCurveTo(10, hy - drop - 4, 0, hy - drop); x.quadraticCurveTo(-12, hy - drop - 2, -21, hy - 2); x.closePath(); fill(k.hc); };
  if (k.hair === 'short') cap(9);
  if (k.hair === 'afro') cap(10);
  if (k.hair === 'puffs') { circle(-17, hy - 20, 12, k.hc); circle(17, hy - 20, 12, k.hc); cap(9); }
  if (k.hair === 'pigtails') { circle(-25, hy - 2, 9, k.hc); circle(25, hy - 2, 9, k.hc); circle(-20, hy - 6, 3.5, '#ff5d8f'); circle(20, hy - 6, 3.5, '#ff5d8f'); cap(10); }
  if (k.hair === 'long') cap(11);
  if (k.hair === 'braids') { [-1, 1].forEach(s => { x.beginPath(); x.moveTo(s * 18, hy); x.quadraticCurveTo(s * 24, hy + 20, s * 21, hy + 34); x.lineWidth = 8; x.strokeStyle = k.hc; x.lineCap = 'round'; x.stroke(); circle(s * 21, hy + 36, 4, '#ffd23f'); }); cap(9); }
  if (k.hair === 'curly') { for (let i = 0; i < 7; i++) { const a = Math.PI + i / 6 * Math.PI; circle(Math.cos(a) * 19, hy - 2 + Math.sin(a) * 17, 8, k.hc); } }
  if (k.hair === 'bob') { rr(-23, hy - 18, 10, 30, 5); fill(k.hc); rr(13, hy - 18, 10, 30, 5); fill(k.hc); cap(12); }
  // gezicht
  const ey = hy - 1, lk = p.look || 0;
  if (p.blink) { x.lineWidth = 2.5; x.strokeStyle = INK; x.beginPath(); x.moveTo(-10 + lk, ey); x.lineTo(-4 + lk, ey); x.moveTo(4 + lk, ey); x.lineTo(10 + lk, ey); x.stroke(); }
  else { circle(-7 + lk, ey, 2.8, INK); circle(7 + lk, ey, 2.8, INK); circle(-6 + lk, ey - 1, 1, '#fff'); circle(8 + lk, ey - 1, 1, '#fff'); }
  if (k.glasses) { x.lineWidth = 2; x.strokeStyle = INK; x.beginPath(); x.arc(-7 + lk, ey, 6, 0, 7); x.moveTo(13 + lk, ey); x.arc(7 + lk, ey, 6, 0, 7); x.moveTo(-1 + lk, ey); x.lineTo(1 + lk, ey); x.stroke(); }
  circle(-12, hy + 6, 3.5, 'rgba(255,100,110,.35)'); circle(12, hy + 6, 3.5, 'rgba(255,100,110,.35)');
  const m = p.mouth || 0;
  if (m > .1) { x.beginPath(); x.ellipse(lk * .5, hy + 9, 5, 2 + m * 4, 0, 0, 7); fill('#7a2e2e'); }
  else { x.beginPath(); x.arc(lk * .5, hy + 5, 6, .3, Math.PI - .3); x.lineWidth = 2.5; x.strokeStyle = INK; x.lineCap = 'round'; x.stroke(); }
  if (k.freckles) [-11, -9, 9, 11].forEach((fx, i) => circle(fx, hy + 3 + (i % 2) * 2, .9, '#8a5a3b'));
}

const KIDS = {
  amara: { skin: '#8d5524', hair: 'puffs', hc: '#1b1b1b', shirt: '#ffd23f', bottom: 'skirt', bc: '#ff5d8f' },
  daan: { skin: '#f9d7c0', hair: 'short', hc: '#e9b949', shirt: '#3a86ff', bottom: 'shorts', bc: '#2fb36a', freckles: true },
  yasmina: { skin: '#c68642', hair: 'hijab', hc: '#2a9d8f', shirt: '#9b5de5', bottom: 'dress', bc: '#9b5de5' },
  kofi: { skin: '#5c3a21', hair: 'short', hc: '#141414', shirt: '#e63946', bottom: 'shorts', bc: '#264653' },
  mei: { skin: '#f1c27d', hair: 'long', hc: '#141414', shirt: '#6cd36b', bottom: 'skirt', bc: '#ff9f1c' },
  mateo: { skin: '#e0ac69', hair: 'curly', hc: '#5a3825', shirt: '#ff9f1c', bottom: 'pants', bc: '#264653' },
  sanne: { skin: '#f9d7c0', hair: 'pigtails', hc: '#c0392b', shirt: '#2ec4b6', bottom: 'skirt', bc: '#ffd23f' },
  imani: { skin: '#a0613a', hair: 'braids', hc: '#2a1a12', shirt: '#ff5d8f', bottom: 'pants', bc: '#6a4c93' },
  ravi: { skin: '#b07848', hair: 'short', hc: '#1b1b1b', shirt: '#3a86ff', bottom: 'pants', bc: '#ffd23f', glasses: true },
  jayden: { skin: '#3d2314', hair: 'afro', hc: '#141414', shirt: '#a7d129', bottom: 'shorts', bc: '#3a86ff' },
  lotte: { skin: '#f6d2b8', hair: 'bob', hc: '#7b4a2a', shirt: '#ff5d8f', bottom: 'dress', bc: '#4cc9f0' },
};

module.exports = { kid, KIDS };
