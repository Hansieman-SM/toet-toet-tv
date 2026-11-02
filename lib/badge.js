// Kanaalbadge (gezicht van Truckje Toet) – zelfde ontwerp als watermark.js. drawBadge(ctx) tekent rond (0,0) met straal 300.
function drawBadge(x) {
  const INK = '#1d3557';
  const rr = (a, b, w, h, r) => { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); };
  x.save(); x.lineCap = 'butt';
  x.beginPath(); x.arc(0, 0, 285, 0, 7); x.fillStyle = '#ffffff'; x.fill(); x.lineWidth = 30; x.strokeStyle = INK; x.stroke();
  x.beginPath(); x.arc(0, 0, 255, 0, 7); x.fillStyle = '#ffd23f'; x.fill();
  x.lineWidth = 18; x.strokeStyle = INK; rr(-165, -170, 330, 300, 60); x.fillStyle = '#ff7a45'; x.fill(); x.stroke();
  rr(-125, -135, 250, 120, 30); x.fillStyle = '#d8f3ff'; x.fill(); x.lineWidth = 14; x.stroke();
  [-55, 55].forEach(ox => { x.beginPath(); x.arc(ox, -75, 28, 0, 7); x.fillStyle = INK; x.fill(); x.beginPath(); x.arc(ox + 9, -84, 9, 0, 7); x.fillStyle = '#fff'; x.fill(); });
  x.beginPath(); x.arc(0, 30, 62, .25, Math.PI - .25); x.lineWidth = 18; x.lineCap = 'round'; x.strokeStyle = INK; x.stroke();
  [-110, 110].forEach(ox => { x.beginPath(); x.arc(ox, 45, 18, 0, 7); x.fillStyle = 'rgba(255,90,110,.55)'; x.fill(); });
  [-120, 120].forEach(ox => { x.beginPath(); x.arc(ox, 95, 20, 0, 7); x.fillStyle = '#fff6b0'; x.fill(); x.lineWidth = 10; x.strokeStyle = INK; x.stroke(); });
  [-110, 110].forEach(ox => { rr(ox - 35, 125, 70, 60, 18); x.fillStyle = INK; x.fill(); });
  x.beginPath(); x.arc(150, -150, 62, 0, 7); x.fillStyle = '#2fb36a'; x.fill(); x.lineWidth = 14; x.strokeStyle = INK; x.stroke();
  x.translate(150, -150); x.scale(3.2, 3.2); x.fillStyle = '#ffd23f';
  x.beginPath(); x.moveTo(3, -15); x.lineTo(-9, 3); x.lineTo(-1, 3); x.lineTo(-4, 15); x.lineTo(9, -4); x.lineTo(1, -4); x.lineTo(5, -15); x.closePath(); x.fill();
  x.restore();
}
module.exports = { drawBadge };
