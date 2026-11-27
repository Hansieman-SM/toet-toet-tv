// Daily B&W sensory #24: Sleepy Vegetables – friendly white vegetables with sleepy, happy faces on black:
// a carrot whose leafy top sways and who slowly yawns, a pea pod that opens a little so four tiny peas peek out and bob in turn,
// a broccoli with a bumpy crown whose little florets puff up one by one, a round tomato whose star-shaped leaf cap slowly turns,
// a corn cob with a grid of kernels whose husk leaves gently open and close, a striped pumpkin rocking with a curly vine,
// a sleepy potato in a striped night cap with a pompom, breathing (z z z), an onion with a curly sprout that does a soft squash-and-stretch hop,
// a bell pepper with round lobes swaying on its stem, and a cucumber with bumpy dots resting on a cushion and slowly rocking.
// Background: a vegetable garden at night – soil ridges with little sprouts along the bottom, twinkling stars, slowly drifting seeds.
// Outro: carrot, tomato and pea pod asleep together in a little woven basket under a crescent moon, z z z.
// All figures are new drawings for this video (own design, no existing characters). Everything periodic in P = 240 s.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;
const P = L.P;

const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const cheek = (cx, cy, r = 7) => { x.save(); x.globalAlpha *= .45; dot(cx, cy, r, BK); x.restore(); };
const cyc = (t, n) => (((t * n / P) % 1) + 1) % 1;
const tri = k => 1 - Math.abs(1 - 2 * k);
const sm = k => k * k * (3 - 2 * k);
const fill = (col = WH) => { x.fillStyle = col; x.fill(); };
// a face: awake (blinking) or sleepy eyes, cheeks, smile
function face(cx, cy, s, t, o = {}) {
  if (o.sleepy) { sleepyEye(cx - 15 * s, cy, 8 * s, 4.5 * s); sleepyEye(cx + 15 * s, cy, 8 * s, 4.5 * s); }
  else { eye(cx - 15 * s, cy, 7.5 * s, t, o.ph || 0); eye(cx + 15 * s, cy, 7.5 * s, t, (o.ph || 0) + .3); }
  cheek(cx - 28 * s, cy + 13 * s, 6 * s); cheek(cx + 28 * s, cy + 13 * s, 6 * s);
  if (o.yawn) ell(cx, cy + 16 * s, 7 * s * o.yawn + 4 * s, 9 * s * o.yawn + 2 * s, BK);
  else smile(cx, cy + 8 * s, 10 * s, 4.2 * s);
}
const zzz = (t, px, py, n = 3) => { for (let i = 0; i < n; i++) { const k = cyc(t + i * 80 / n, 60); x.save(); x.globalAlpha *= Math.sin(Math.PI * k);
  x.font = C.FONT(24 + i * 7); x.fillStyle = WH; x.textAlign = 'center'; x.fillText('z', px + k * 24, py - k * 70); x.restore(); } };

// 1. carrot: leafy top sways, slow yawn
function carrot(t) {
  const sw = per(t, 20) * .14;
  x.save(); x.translate(0, -96); x.rotate(sw);
  [[-.45, 70], [0, 86], [.45, 70]].forEach(([a, h]) => { x.save(); x.rotate(a + per(t + a * 9, 30) * .08);
    x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(-22, -h * .5, 0, -h); x.quadraticCurveTo(22, -h * .5, 0, 0); fill();
    x.beginPath(); x.moveTo(0, -6); x.lineTo(0, -h + 14); line(3, BK); x.restore(); });
  x.restore();
  x.beginPath(); x.moveTo(-62, -96); x.quadraticCurveTo(-66, -40, -18, 120); x.quadraticCurveTo(0, 150, 18, 120); x.quadraticCurveTo(66, -40, 62, -96);
  x.quadraticCurveTo(0, -116, -62, -96); fill();
  [[-2, 50, 22], [20, 80, 14], [-16, 104, 10], [12, 20, 18]].forEach(([a, b, w]) => { x.beginPath(); x.moveTo(a - w, b); x.quadraticCurveTo(a, b + 5, a + w, b); line(4, BK); });
  const y = Math.max(0, per(t, 8) - .6) / .4;
  face(0, -50, 1.25, t, { sleepy: y > .1, yawn: y > .1 ? y : 0, ph: 1 });
}
// 2. pea pod: four peas peek out and bob in turn
function peapod(t) {
  const open = .55 + .45 * (per(t, 10) + 1) / 2;
  x.save(); x.rotate(-.12);
  // back half of the pod
  x.beginPath(); x.moveTo(-150, -10); x.quadraticCurveTo(0, 90, 150, -10); x.quadraticCurveTo(0, 40, -150, -10); fill();
  // peas
  for (let i = 0; i < 4; i++) { const px = -84 + i * 56, b = Math.max(0, per(t + i * 15, 24)) * 12 * open, py = 12 - b - (1 - Math.abs(i - 1.5) / 1.5) * 8;
    dot(px, py, 27, BK); dot(px, py, 24);
    const sl = i % 2 ? true : per(t + i * 7, 12) < 0;
    if (sl) { sleepyEye(px - 8, py - 3, 4.5, 3); sleepyEye(px + 8, py - 3, 4.5, 3); } else { eye(px - 8, py - 3, 4, t, i); eye(px + 8, py - 3, 4, t, i + .3); }
    x.beginPath(); x.arc(px, py + 5, 5, .3, Math.PI - .3); line(3, BK); }
  // front half of the pod (lower lip), opening
  x.save(); x.translate(0, 20 * (1 - open));
  x.beginPath(); x.moveTo(-160, -8); x.quadraticCurveTo(0, 130, 160, -8); x.quadraticCurveTo(0, 62, -160, -8); fill();
  x.beginPath(); x.moveTo(-150, -4); x.quadraticCurveTo(0, 62, 150, -4); line(4, BK);
  x.restore();
  // stem + curly tendril
  x.beginPath(); x.moveTo(-150, -10); x.quadraticCurveTo(-176, -30, -170, -54); line(7);
  x.beginPath(); x.moveTo(-170, -50); x.bezierCurveTo(-150, -80 + per(t, 20) * 6, -190, -96, -166, -110); line(4);
  x.restore();
}
// 3. broccoli: bumpy crown, florets puff up one by one
function broccoli(t) {
  x.beginPath(); x.moveTo(-36, 10); x.quadraticCurveTo(-30, 90, -46, 140); x.lineTo(46, 140); x.quadraticCurveTo(30, 90, 36, 10); x.closePath(); fill();
  x.beginPath(); x.moveTo(-10, 40); x.quadraticCurveTo(-30, 20, -60, 6); x.moveTo(12, 50); x.quadraticCurveTo(34, 26, 62, 10); line(4, BK);
  const F = [[-96, -36, 46], [-46, -86, 52], [14, -100, 56], [74, -72, 50], [104, -20, 42], [-66, 6, 40], [0, -30, 62], [62, 4, 40]];
  F.forEach(([a, b, r], i) => { const pf = 1 + Math.max(0, per(t + i * 30, 16)) * .1; dot(a, b, r * pf + 5, BK); dot(a, b, r * pf); });
  F.forEach(([a, b, r], i) => { for (let j = 0; j < 5; j++) { const an = j * 1.3 + i, rr = r * .55; dot(a + Math.cos(an) * rr, b + Math.sin(an) * rr * .9, 3.2, BK); } });
  face(0, 82, 1.0, t, { sleepy: per(t, 6) > 0, ph: 2 });
}
// 4. tomato: star leaf cap slowly turns
function tomato(t) {
  const sq = per(t, 16) * .03;
  x.save(); x.scale(1 + sq, 1 - sq);
  x.beginPath(); x.moveTo(0, -88); x.bezierCurveTo(90, -110, 140, -30, 126, 30); x.bezierCurveTo(112, 110, 40, 130, 0, 120); x.bezierCurveTo(-40, 130, -112, 110, -126, 30);
  x.bezierCurveTo(-140, -30, -90, -110, 0, -88); fill();
  x.beginPath(); x.ellipse(-62, -40, 26, 12, -.6, 0, TAU); line(4, BK);
  x.restore();
  x.save(); x.translate(0, -90); x.scale(1, .45); x.rotate(per(t, 4) * .4);
  x.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? 18 : 62, an = j * Math.PI / 5; x.lineTo(Math.cos(an) * r, Math.sin(an) * r); } x.closePath(); fill(BK);
  x.restore();
  x.save(); x.translate(0, -90); x.scale(1, .45); x.rotate(per(t, 4) * .4);
  x.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? 14 : 54, an = j * Math.PI / 5; x.lineTo(Math.cos(an) * r, Math.sin(an) * r); } x.closePath(); x.lineWidth = 4; x.strokeStyle = WH; x.stroke();
  x.restore();
  x.beginPath(); x.moveTo(0, -94); x.quadraticCurveTo(4, -122, 18, -130); line(8);
  face(0, 18, 1.4, t, { sleepy: per(t, 10) > .3, ph: .7 });
}
// 5. corn cob: husk leaves gently open and close
function corn(t) {
  const op = (per(t, 10) + 1) / 2;
  x.beginPath(); x.ellipse(0, -10, 64, 128, 0, 0, TAU); fill();
  x.save(); x.beginPath(); x.ellipse(0, -10, 64, 128, 0, 0, TAU); x.clip();
  for (let r = -6; r <= 6; r++) for (let c = -3; c <= 3; c++) { const px = c * 19 + (r % 2 ? 9 : 0), py = r * 21 - 30; x.beginPath(); x.ellipse(px, py, 8.5, 9.5, 0, 0, TAU); line(3, BK); }
  x.restore();
  // face on a smooth patch
  ell(0, 30, 48, 34);
  face(0, 26, 1.1, t, { sleepy: op > .55, ph: 1.5 });
  // husk leaves from the bottom
  [-1, 1].forEach(d => { x.save(); x.translate(d * 10, 110); x.rotate(d * (.15 + op * .35));
    x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(d * 96, -40, d * 40, -200); x.quadraticCurveTo(d * 40, -90, d * -8, 0); x.closePath(); fill(); x.lineWidth = 5; x.strokeStyle = BK; x.stroke();
    x.beginPath(); x.moveTo(d * 4, -10); x.quadraticCurveTo(d * 50, -60, d * 38, -170); line(3, BK); x.restore(); });
  x.beginPath(); x.moveTo(-14, 110); x.lineTo(-10, 146); x.lineTo(10, 146); x.lineTo(14, 110); x.closePath(); fill();
}
// 6. pumpkin rocking with a curly vine
function pumpkin(t) {
  x.save(); x.rotate(per(t, 12) * .1);
  [[-74, 64], [74, 64], [-36, 76], [36, 76], [0, 84]].forEach(([dx, w], i) => { x.beginPath(); x.ellipse(dx, 20, w, 96, 0, 0, TAU); fill(); x.lineWidth = 5; x.strokeStyle = BK; x.stroke(); });
  x.beginPath(); x.ellipse(0, 20, 84, 96, 0, 0, TAU); fill(); x.lineWidth = 5; x.strokeStyle = BK; x.stroke();
  x.beginPath(); x.moveTo(-12, -74); x.lineTo(-8, -112); x.lineTo(12, -116); x.lineTo(14, -74); x.closePath(); fill(); x.lineWidth = 4; x.strokeStyle = BK; x.stroke();
  x.beginPath(); x.moveTo(12, -100); x.bezierCurveTo(60, -130 + per(t, 20) * 8, 90, -90, 70, -76); x.bezierCurveTo(56, -66, 52, -90, 66, -92); line(5);
  ell(-46, -96, 26, 13, WH, -.4); x.beginPath(); x.moveTo(-24, -92); x.lineTo(-66, -100); line(3, BK);
  face(0, 18, 1.3, t, { sleepy: per(t, 8) > -.2, ph: .2 });
  x.restore();
}
// 7. sleepy potato in a striped night cap
function potato(t) {
  const br = per(t, 30) * .04;
  x.save(); x.scale(1 + br, 1 - br);
  x.beginPath(); x.moveTo(-130, 10); x.bezierCurveTo(-140, -70, -50, -90, 10, -78); x.bezierCurveTo(90, -96, 150, -40, 134, 30); x.bezierCurveTo(124, 100, 30, 110, -20, 100);
  x.bezierCurveTo(-90, 100, -126, 70, -130, 10); fill();
  [[-90, -30], [96, -20], [70, 60], [-70, 62], [20, 78]].forEach(([a, b]) => { dot(a, b, 5, BK); x.beginPath(); x.arc(a, b + 2, 9, .4, Math.PI - .4); line(2.5, BK); });
  face(4, 10, 1.3, t, { sleepy: true });
  x.restore();
  // night cap
  x.save(); x.translate(10, -76); x.rotate(-.2);
  x.beginPath(); x.moveTo(-80, 0); x.quadraticCurveTo(-20, -40, 30, -70); x.quadraticCurveTo(80, -100, 120, -60 + per(t, 12) * 6); x.quadraticCurveTo(60, -40, 80, 0); x.closePath(); fill(BK);
  x.save(); x.clip(); x.fillStyle = WH; for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(-70 + i * 40, 10); x.lineTo(-50 + i * 40, 10); x.lineTo(-10 + i * 40, -110); x.lineTo(-30 + i * 40, -110); x.closePath(); x.fill(); } x.restore();
  x.beginPath(); x.moveTo(-80, 0); x.quadraticCurveTo(-20, -40, 30, -70); x.quadraticCurveTo(80, -100, 120, -60 + per(t, 12) * 6); x.quadraticCurveTo(60, -40, 80, 0); x.closePath(); x.lineWidth = 4; x.strokeStyle = WH; x.stroke();
  x.beginPath(); x.roundRect(-90, -8, 180, 22, 11); fill(); dot(122, -58 + per(t, 12) * 6, 16);
  x.restore();
  zzz(t, 130, -40);
}
// 8. onion: curly sprout, soft squash-and-stretch hop
function onion(t) {
  const k = cyc(t, 24), hop = Math.sin(Math.min(k / .35, 1) * Math.PI) * (k < .35 ? 1 : 0), sq = k > .32 && k < .42 ? Math.sin((k - .32) / .1 * Math.PI) : 0;
  x.save(); x.translate(0, -hop * 40); x.scale(1 + sq * .1, 1 - sq * .1 + hop * .04);
  x.beginPath(); x.moveTo(0, -110); x.bezierCurveTo(20, -60, 120, -40, 110, 40); x.bezierCurveTo(100, 110, 30, 120, 0, 120); x.bezierCurveTo(-30, 120, -100, 110, -110, 40);
  x.bezierCurveTo(-120, -40, -20, -60, 0, -110); fill();
  [-60, -26, 26, 60].forEach(d => { x.beginPath(); x.moveTo(d * .2, -96); x.quadraticCurveTo(d * 1.5, 10, d * .5, 116); line(3, BK); });
  ell(0, 34, 52, 36);
  face(0, 30, 1.15, t, { sleepy: hop < .05 && per(t, 6) > .2, ph: 2.4 });
  x.beginPath(); x.moveTo(0, -108); x.bezierCurveTo(-10, -150, 30, -160, 24, -136); x.bezierCurveTo(20, -124, 8, -134, 14, -142); line(5);
  x.beginPath(); x.moveTo(-20, 118); x.lineTo(-24, 134); x.moveTo(0, 120); x.lineTo(0, 138); x.moveTo(20, 118); x.lineTo(24, 134); line(3);
  x.restore();
}
// 9. bell pepper swaying on its stem
function pepper(t) {
  x.save(); x.rotate(per(t, 10) * .08);
  x.beginPath(); x.moveTo(-8, -90); x.bezierCurveTo(-60, -110, -128, -80, -118, 0); x.bezierCurveTo(-112, 70, -86, 120, -44, 118); x.quadraticCurveTo(-20, 130, 0, 112);
  x.quadraticCurveTo(20, 130, 44, 118); x.bezierCurveTo(86, 120, 112, 70, 118, 0); x.bezierCurveTo(128, -80, 60, -110, 8, -90); x.closePath(); fill();
  x.beginPath(); x.moveTo(-44, -86); x.quadraticCurveTo(-60, 20, -42, 116); x.moveTo(44, -86); x.quadraticCurveTo(60, 20, 42, 116); line(4, BK);
  x.beginPath(); x.ellipse(80, -40, 12, 30, .2, 0, TAU); line(3, BK);
  x.beginPath(); x.moveTo(-30, -92); x.quadraticCurveTo(0, -78, 30, -92); x.quadraticCurveTo(0, -104, -30, -92); fill(BK);
  x.beginPath(); x.moveTo(0, -94); x.quadraticCurveTo(-4, -130, 20, -144); line(10);
  face(0, 14, 1.25, t, { sleepy: per(t, 12) < -.1, ph: 3 });
  x.restore();
}
// 10. cucumber resting on a cushion, slowly rocking
function cucumber(t) {
  x.beginPath(); x.roundRect(-160, 52, 320, 52, 26); fill(); x.beginPath(); x.roundRect(-160, 52, 320, 52, 26); x.lineWidth = 4; x.strokeStyle = BK; x.stroke();
  [-100, -40, 20, 80].forEach(d => { x.beginPath(); x.moveTo(d, 60); x.lineTo(d + 20, 96); line(3, BK); });
  x.save(); x.translate(0, 18); x.rotate(per(t, 12) * .07);
  x.beginPath(); x.roundRect(-150, -46, 300, 92, 46); fill(); x.beginPath(); x.roundRect(-150, -46, 300, 92, 46); x.lineWidth = 5; x.strokeStyle = BK; x.stroke();
  for (let i = 0; i < 14; i++) { const a = -120 + hash(i + 3) * 240, b = -30 + hash(i + 8) * 60; if (Math.abs(a) < 54 && b > -26) continue; dot(a, b, 3.4, BK); }
  x.beginPath(); x.moveTo(150, 0); x.lineTo(166, -4); line(8);
  face(-6, -6, 1.15, t, { sleepy: true });
  x.restore();
  zzz(t, 110, -60, 2);
}

// ---------- background: night vegetable garden ----------
function bg(t) {
  for (let i = 0; i < 16; i++) { const tw = .5 + .5 * per(t + i * 13, 10 + (i % 4) * 4), side = i % 2 ? 1 : -1;
    const sx = 480 + side * (290 + hash(i + 31) * 170), sy = 26 + hash(i + 7) * 300;
    x.save(); x.globalAlpha *= tw; if (i % 4 === 0) { x.beginPath(); x.moveTo(sx, sy - 7); x.lineTo(sx + 2, sy - 2); x.lineTo(sx + 7, sy); x.lineTo(sx + 2, sy + 2); x.lineTo(sx, sy + 7); x.lineTo(sx - 2, sy + 2); x.lineTo(sx - 7, sy); x.lineTo(sx - 2, sy - 2); x.closePath(); fill(); } else dot(sx, sy, 2.2); x.restore(); }
  // soil ridges with little sprouts
  for (let r = 0; r < 2; r++) { const by = 488 + r * 30;
    x.beginPath(); x.moveTo(0, by); for (let px = 0; px <= 960; px += 20) x.lineTo(px, by - 8 * Math.abs(Math.sin(px * .03 + r))); line(3);
    for (let i = 0; i < 12; i++) { const px = 30 + i * 80 + r * 40, sw = per(t + i * 5, 12) * .12;
      x.save(); x.translate(px, by - 6); x.rotate(sw); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -14); line(3);
      ell(-7, -16, 8, 4, WH, .5); ell(7, -16, 8, 4, WH, -.5); x.restore(); } }
  // drifting seeds (slowly left, wrap)
  for (let i = 0; i < 10; i++) { const n = 1 + (i % 3), sx = ((hash(i + 41) * 1000 - cyc(t, n) * 1000) % 1000 + 1000) % 1000 - 20, sy = 60 + hash(i + 19) * 340 + per(t + i * 9, 12) * 10;
    x.save(); x.globalAlpha *= .55; ell(sx, sy, 3.2, 2); x.restore(); }
}

// outro: carrot, tomato and pea pod asleep in a woven basket under a crescent moon
function sleepyEnd(t) {
  const br = per(t, 8) * 2;
  x.save(); x.translate(200, -170); x.beginPath(); x.arc(0, 0, 46, .6, TAU - .6 + .001); x.arc(22, -10, 38, TAU - .9, .9, true); x.closePath(); fill(); sleepyEye(-18, 0, 7, 3.5); x.restore();
  // carrot (left, leaning)
  x.save(); x.translate(-96, -6 + br); x.rotate(-.35); x.scale(.55, .55); carrotSleep(t); x.restore();
  // tomato (middle)
  x.save(); x.translate(10, 4 - br); x.scale(.52, .52);
  x.beginPath(); x.ellipse(0, 0, 120, 104, 0, 0, TAU); fill(); sleepyEye(-24, -6, 14, 7); sleepyEye(24, -6, 14, 7); smile(0, 18, 14, 6); cheek(-50, 20, 10); cheek(50, 20, 10);
  x.restore();
  // pea pod (right)
  x.save(); x.translate(120, -4 + br); x.rotate(.3); x.scale(.55, .55);
  x.beginPath(); x.moveTo(-150, -10); x.quadraticCurveTo(0, 90, 150, -10); x.quadraticCurveTo(0, 40, -150, -10); fill();
  for (let i = 0; i < 3; i++) { const px = -60 + i * 60; dot(px, 14, 28, BK); dot(px, 14, 25); sleepyEye(px - 8, 12, 5, 3); sleepyEye(px + 8, 12, 5, 3); }
  x.restore();
  // basket in front
  x.beginPath(); x.moveTo(-190, 40); x.lineTo(190, 40); x.lineTo(160, 150); x.lineTo(-160, 150); x.closePath(); fill();
  x.strokeStyle = BK; x.lineWidth = 4; for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(-182 + i * 9, 72 + i * 28); x.lineTo(182 - i * 9, 72 + i * 28); x.stroke(); }
  for (let i = -6; i <= 6; i++) { x.beginPath(); x.moveTo(i * 30, 44); x.lineTo(i * 26, 146); x.stroke(); }
  x.beginPath(); x.roundRect(-200, 30, 400, 22, 11); fill(); x.beginPath(); x.roundRect(-200, 30, 400, 22, 11); x.lineWidth = 4; x.strokeStyle = BK; x.stroke();
  zzz(t, 40, -110);
}
function carrotSleep(t) {
  [[-.45, 70], [0, 86], [.45, 70]].forEach(([a, h]) => { x.save(); x.translate(0, -96); x.rotate(a); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(-22, -h * .5, 0, -h); x.quadraticCurveTo(22, -h * .5, 0, 0); fill(); x.restore(); });
  x.beginPath(); x.moveTo(-62, -96); x.quadraticCurveTo(-66, -40, -18, 120); x.quadraticCurveTo(0, 150, 18, 120); x.quadraticCurveTo(66, -40, 62, -96); x.quadraticCurveTo(0, -116, -62, -96); fill();
  sleepyEye(-18, -50, 10, 6); sleepyEye(18, -50, 10, 6); smile(0, -36, 12, 5.5); cheek(-36, -32, 8); cheek(36, -32, 8);
}

const TDY = +(process.env.THUMBDY || 0);   // thumbnail only: move the figure down below the title
const up = f => t => { x.translate(0, -24 + TDY); f(t); };
L.scene({
  seed: 242,
  figs: [[up(carrot), .78, 'sway'], [up(peapod), .95, 'sway'], [up(broccoli), .8, 'sway'], [up(tomato), .8, 'sway'], [up(corn), .74, 'sway'],
         [up(pumpkin), .8, 'sway'], [up(potato), .8, 'sway'], [up(onion), .8, 'sway'], [up(pepper), .8, 'sway'], [up(cucumber), .9, 'sway']],
  bg, end: up(sleepyEnd), scale: 1.3,
});
