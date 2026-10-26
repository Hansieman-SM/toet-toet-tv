// Gedeelde rekwisieten voor Toet op avontuur
const C = require('./common'), T = require('./toet');
const { x, W, H, clamp, ease, lerp, hash, rr, circ } = C;
const INK = '#1d3557';

function battery(level, t, charging = false, px = 24, py = 24) {
  const bars = Math.max(0, Math.min(5, Math.round(level * 5)));
  const col = level > .45 ? '#2fb36a' : level > .25 ? '#ff9f1c' : '#e63946';
  const blink = level <= .25 && Math.floor(t * 3) % 2 === 0;
  x.save(); x.translate(px, py);
  x.fillStyle = '#fff'; x.strokeStyle = INK; x.lineWidth = 5; rr(0, 0, 180, 80, 16); x.fill(); x.stroke();
  x.fillStyle = INK; rr(180, 24, 16, 32, 5); x.fill();
  for (let i = 0; i < 5; i++) { x.fillStyle = i < bars && !(blink && i === 0) ? col : '#e3e8ee'; rr(15 + i * 32, 14, 26, 52, 6); x.fill(); }
  if (charging) T.bolt(90, 40, 1.6 + Math.sin(t * 8) * .15, '#ffd23f');
  x.restore();
}
// modderspatten op de truck (Tk = resultaat van T.truck)
const MUD = [[-40, -95, 14], [10, -70, 18], [60, -100, 12], [95, -40, 16], [-55, -40, 12], [150, -40, 13], [190, -70, 10], [30, -30, 11], [-20, -60, 9], [110, -85, 10], [175, -95, 8], [-60, -110, 9]];
function mud(Tk, amt) {
  if (amt <= 0) return;
  x.save(); x.translate(Tk.bx, Tk.by); x.globalAlpha = clamp(amt);
  MUD.forEach(([dx, dy, r], i) => { x.fillStyle = '#7a5134'; x.beginPath(); x.arc(dx, dy, r, 0, 7); x.arc(dx + r * .8, dy + r * .5, r * .5, 0, 7); x.arc(dx - r * .7, dy + r * .6, r * .4, 0, 7); x.fill(); });
  x.restore();
}
function sparkles(cx, cy, t, n = 10, r = 140) { C.sparkles(cx, cy, t, n, r); }
function confetti(t, k = 1) {
  const cols = ['#ff5d8f', '#ffd23f', '#4cc9f0', '#6cd36b', '#9b5de5', '#ff9f1c'];
  for (let i = 0; i < 70; i++) {
    const px = (hash(i) * W + Math.sin(t * 2 + i) * 20), py = ((hash(i + 3) * H + t * (60 + hash(i + 5) * 60)) % (H + 40)) - 20;
    x.save(); x.globalAlpha = k; x.translate(px, py); x.rotate(t * 3 + i); x.fillStyle = cols[i % 6]; x.fillRect(-5, -3, 10, 6); x.restore();
  }
}
function snowflakes(t, a = 1) {
  for (let i = 0; i < 60; i++) { const px = (hash(i) * W + Math.sin(t + i) * 15), py = ((hash(i + 9) * H + t * (25 + hash(i) * 30)) % H); x.globalAlpha = a * .9; circ(px, py, 2 + hash(i + 2) * 2.5, '#ffffff'); }
  x.globalAlpha = 1;
}
function rainStreaks(t, a = 1) {
  x.strokeStyle = `rgba(255,255,255,${.55 * a})`; x.lineWidth = 2;
  for (let i = 0; i < 90; i++) { const px = (hash(i) * (W + 100) - (t * 120) % 100 + 100) % (W + 60) - 30, py = ((hash(i + 7) * H + t * 700) % (H + 40)) - 20; x.beginPath(); x.moveTo(px, py); x.lineTo(px - 6, py + 20); x.stroke(); }
}
function darkSky(a) { if (a > 0) { x.fillStyle = `rgba(70,85,110,${.45 * a})`; x.fillRect(0, 0, W, H); } }
function greyClouds(t, a) {
  if (a <= 0) return;
  for (let i = 0; i < 6; i++) { const cx = ((i * 190 + t * 10) % 1200) - 120, cy = 50 + (i % 3) * 30;
    x.fillStyle = `rgba(120,130,150,${.9 * a})`; x.beginPath(); [[0, 0, 40], [45, -18, 50], [95, 0, 40], [48, 12, 44]].forEach(([u, v, r]) => { x.moveTo(cx + u + r, cy + v); x.arc(cx + u, cy + v, r, 0, 7); }); x.fill(); }
}
function rainbow(k, cx = 640, cy = 470, R = 330) {
  if (k <= 0) return;
  ['#e63946', '#ff9f1c', '#ffd23f', '#6cd36b', '#3a86ff', '#9b5de5'].forEach((c, i) => { x.beginPath(); x.arc(cx, cy, R - i * 14, Math.PI, Math.PI + Math.PI * clamp(k)); x.lineWidth = 14; x.strokeStyle = c; x.globalAlpha = .85; x.stroke(); });
  x.globalAlpha = 1;
}
function snowman(px, gy, s, t, m = 0) {
  x.save(); x.translate(px, gy); x.scale(s, s);
  circ(0, -40, 42, '#ffffff'); circ(0, -110, 32, '#ffffff'); circ(0, -165, 24, '#ffffff');
  [[0, -40, 42], [0, -110, 32], [0, -165, 24]].forEach(([a, b, r]) => { x.beginPath(); x.arc(a, b, r, 0, 7); x.lineWidth = 3; x.strokeStyle = '#9aa7b8'; x.stroke(); });
  circ(-8, -172, 3.5, INK); circ(8, -172, 3.5, INK);
  x.beginPath(); x.moveTo(-2, -164); x.lineTo(24, -160); x.lineTo(-2, -157); x.closePath(); x.fillStyle = '#ff7a45'; x.fill();
  if (m > .08) { x.beginPath(); x.ellipse(0, -150, 6, 2 + m * 4, 0, 0, 7); x.fillStyle = '#7a2e2e'; x.fill(); } else { x.beginPath(); x.arc(0, -156, 8, .4, Math.PI - .4); x.lineWidth = 3; x.strokeStyle = INK; x.stroke(); }
  x.fillStyle = '#e63946'; x.fillRect(-26, -142, 52, 10); x.fillRect(12, -142, 10, 30);
  [-110, -95, -80].forEach(by => circ(0, by + 10, 3.5, INK));
  x.fillStyle = INK; rr(-20, -205, 40, 26, 4); x.fill(); x.fillRect(-28, -182, 56, 6);
  x.strokeStyle = '#6b4f3a'; x.lineWidth = 5; x.beginPath(); x.moveTo(-30, -110); x.lineTo(-62, -135 + Math.sin(t * 3) * 6); x.moveTo(30, -110); x.lineTo(62, -130); x.stroke();
  x.restore();
}
function pine(px, gy, s, snow = true) {
  x.save(); x.translate(px, gy); x.scale(s, s);
  x.fillStyle = '#6b4f3a'; x.fillRect(-6, -22, 12, 22);
  [[-22, 52, 40], [-55, 42, 34], [-85, 30, 26]].forEach(([y, w, h]) => { x.beginPath(); x.moveTo(-w, y); x.lineTo(0, y - h - 20); x.lineTo(w, y); x.closePath(); x.fillStyle = '#2d6a4f'; x.fill();
    if (snow) { x.beginPath(); x.moveTo(-w * .45, y - h * .55); x.lineTo(0, y - h - 20); x.lineTo(w * .45, y - h * .55); x.closePath(); x.fillStyle = '#ffffff'; x.fill(); } });
  x.restore();
}
function house(px, gy, s, col = '#f4a261', roof = '#a44a3f', sign) {
  x.save(); x.translate(px, gy); x.scale(s, s);
  x.fillStyle = col; x.fillRect(-120, -150, 240, 150);
  x.beginPath(); x.moveTo(-135, -150); x.lineTo(0, -230); x.lineTo(135, -150); x.closePath(); x.fillStyle = roof; x.fill();
  x.fillStyle = '#d8f3ff'; [[-90, -120], [40, -120]].forEach(([a, b]) => { x.fillRect(a, b, 50, 44); x.strokeStyle = '#fff'; x.lineWidth = 5; x.strokeRect(a, b, 50, 44); });
  x.fillStyle = '#7a5134'; x.fillRect(-25, -80, 50, 80); circ(14, -40, 4, '#ffd23f');
  if (sign) { x.fillStyle = '#fff'; rr(-90, -185, 180, 34, 8); x.fill(); x.font = C.FONT(24); x.fillStyle = INK; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(sign, 0, -167); }
  x.restore();
}
function trafficLight(px, gy, state) {
  x.fillStyle = '#495057'; x.fillRect(px - 5, gy - 190, 10, 190);
  x.fillStyle = '#212529'; rr(px - 24, gy - 290, 48, 110, 10); x.fill();
  [['#e63946', 'r'], ['#ff9f1c', 'o'], ['#2fb36a', 'g']].forEach(([c, k], i) => { circ(px, gy - 270 + i * 34, 13, state === k ? c : '#495057'); if (state === k) circ(px, gy - 270 + i * 34, 19, c.replace(')', '') + '00'); });
}
module.exports = { battery, mud, sparkles, confetti, snowflakes, rainStreaks, darkSky, greyClouds, rainbow, snowman, pine, house, trafficLight, INK };
