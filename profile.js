// TikTok/YouTube profile picture 1080x1080: Little Truck Toet front view, circle-safe. Usage: node profile.js out.png
const { createCanvas } = require('@napi-rs/canvas');
const S = 1080, c = createCanvas(S, S), x = c.getContext('2d'), INK = '#1d3557';
const g = x.createLinearGradient(0, 0, 0, S); g.addColorStop(0, '#8fd3ff'); g.addColorStop(1, '#d8f3ff'); x.fillStyle = g; x.fillRect(0, 0, S, S);
// zon + wolkjes
x.fillStyle = 'rgba(255,255,255,.85)'; [[260, 250, 1], [800, 210, .8]].forEach(([a, b, s]) => { x.beginPath(); [[0, 0, 50], [55, -20, 62], [115, 0, 48]].forEach(([u, v, r]) => { x.moveTo(a + (u + r) * s, b + v * s); x.arc(a + u * s, b + v * s, r * s, 0, 7); }); x.fill(); });
// heuvel
x.fillStyle = '#7ed957'; x.beginPath(); x.moveTo(0, S); x.lineTo(0, 820); x.quadraticCurveTo(540, 700, S, 820); x.lineTo(S, S); x.fill();
x.fillStyle = '#5cbf3c'; x.beginPath(); x.moveTo(0, S); x.lineTo(0, 900); x.quadraticCurveTo(540, 810, S, 900); x.lineTo(S, S); x.fill();
x.translate(S / 2, 590); x.scale(1.55, 1.55);
const rr = (a, b, w, h, r) => { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); };
x.fillStyle = 'rgba(29,53,87,.18)'; x.beginPath(); x.ellipse(0, 190, 190, 22, 0, 0, 7); x.fill();
[-110, 110].forEach(ox => { rr(ox - 35, 125, 70, 60, 18); x.fillStyle = INK; x.fill(); });
x.lineWidth = 18; x.strokeStyle = INK; rr(-165, -170, 330, 300, 60); x.fillStyle = '#ff7a45'; x.fill(); x.stroke();
rr(-125, -135, 250, 120, 30); x.fillStyle = '#ffffff'; x.fill(); x.lineWidth = 14; x.stroke();
[-55, 55].forEach(ox => { x.beginPath(); x.arc(ox, -75, 30, 0, 7); x.fillStyle = INK; x.fill(); x.beginPath(); x.arc(ox + 10, -85, 10, 0, 7); x.fillStyle = '#fff'; x.fill(); });
x.beginPath(); x.arc(0, 25, 66, .2, Math.PI - .2); x.lineWidth = 18; x.lineCap = 'round'; x.strokeStyle = INK; x.stroke();
[-112, 112].forEach(ox => { x.beginPath(); x.arc(ox, 45, 20, 0, 7); x.fillStyle = 'rgba(255,90,110,.55)'; x.fill(); });
[-120, 120].forEach(ox => { x.beginPath(); x.arc(ox, 95, 20, 0, 7); x.fillStyle = '#fff6b0'; x.fill(); x.lineWidth = 10; x.strokeStyle = INK; x.stroke(); });
x.beginPath(); x.arc(150, -150, 58, 0, 7); x.fillStyle = '#2fb36a'; x.fill(); x.lineWidth = 14; x.strokeStyle = INK; x.stroke();
x.save(); x.translate(150, -150); x.scale(3, 3); x.fillStyle = '#ffd23f'; x.beginPath(); x.moveTo(3,-15); x.lineTo(-9,3); x.lineTo(-1,3); x.lineTo(-4,15); x.lineTo(9,-4); x.lineTo(1,-4); x.lineTo(5,-15); x.closePath(); x.fill(); x.restore();
require('fs').writeFileSync(process.argv[2], c.toBuffer('image/png'));
