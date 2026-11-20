// Daily B&W sensory #17: Music Toys – friendly white music toys with happy faces on black: a round drum whose two sticks tap in turn
// (little ripple rings on the drum skin), a xylophone with eight bars and a mallet hopping from bar to bar, a bell swinging with its
// clapper, a trumpet puffing out little notes, piano keys pressing down one after another, a guitar with vibrating strings and a sound
// hole with a face, two maracas shaking in turn, a pair of music notes bouncing together, a baby rattle with rolling beads, and a little
// harp with strings that shimmer when they are plucked.
// Background: a soft five-line music staff that drifts slowly, twinkling stars, tiny notes floating up at the sides.
// Outro: the little drum asleep with its two sticks crossed on top, under a crescent moon, z z z.
// All figures are new drawings for this video (own design, no existing characters). Everything periodic in P = 240 s.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;
const P = L.P;

const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const cheek = (cx, cy, r = 7) => { x.save(); x.globalAlpha *= .45; dot(cx, cy, r, BK); x.restore(); };
const rect = (a, b, w, h, r, col = WH) => { x.beginPath(); x.roundRect(a, b, w, h, r); x.fillStyle = col; x.fill(); };
const outline = (a, b, w, h, r, lw = 5, col = BK) => { x.beginPath(); x.roundRect(a, b, w, h, r); line(lw, col); };
const face = (cx, cy, s, t, ph = 0) => { eye(cx - 20 * s, cy, 9 * s, t, ph); eye(cx + 20 * s, cy, 9 * s, t, ph + .3); smile(cx, cy + 12 * s, 12 * s, 5 * s); cheek(cx - 36 * s, cy + 14 * s, 7 * s); cheek(cx + 36 * s, cy + 14 * s, 7 * s); };
// eighth note (white), stem up, centred on the head
function note(cx, cy, s, col = WH) {
  x.save(); x.translate(cx, cy); x.scale(s, s);
  ell(0, 0, 13, 10, col, -.4); x.beginPath(); x.moveTo(11, -3); x.lineTo(11, -44); line(5, col);
  x.beginPath(); x.moveTo(11, -44); x.quadraticCurveTo(26, -34, 22, -18); line(5, col);
  x.restore();
}
const tri = (k) => 1 - Math.abs(((k % 1) + 1) % 1 * 2 - 1);   // 0..1..0 triangle wave

function drum(t) {
  // round drum with zig-zag ropes, two sticks tapping in turn, ripple rings on the skin
  const b = (per(t, 160) + 1) / 2;              // which stick (smooth)
  const tapL = Math.max(0, per(t, 160)), tapR = Math.max(0, -per(t, 160));
  // body
  rect(-130, -40, 260, 150, 30);
  x.beginPath(); for (let i = 0; i <= 8; i++) { const px = -120 + i * 30; x.lineTo(px, i % 2 ? 96 : -26); } line(6, BK);
  [-26, 96].forEach(yy => { x.beginPath(); x.moveTo(-130, yy); x.lineTo(130, yy); line(8, BK); });
  // skin (top ellipse) with rings
  ell(0, -40, 130, 34); x.beginPath(); x.ellipse(0, -40, 130, 34, 0, 0, 7); line(6, BK);
  for (let i = 0; i < 2; i++) { const k = ((t * 1.2 / 1) + i * .5) % 1; x.save(); x.globalAlpha *= 1 - k; x.beginPath(); x.ellipse(0, -40, 20 + k * 90, 6 + k * 22, 0, 0, 7); line(3, BK); x.restore(); }
  // face on a little round label on the front
  rect(-62, 2, 124, 68, 24); face(0, 30, 1.0, t);
  // sticks: held up at the sides, tips tap down onto the skin in turn
  [[-1, tapL], [1, tapR]].forEach(([d, k]) => { const lift = 1 - k; x.save(); x.translate(d * 200, -150); x.rotate(-d * .55 * lift);
    x.beginPath(); x.moveTo(0, 0); x.lineTo(-d * 130, 92); line(10); dot(-d * 134, 95, 14); x.restore(); });
}
function xylophone(t) {
  // eight bars from big to small on two rails; a mallet hops along the bars
  x.save(); x.rotate(-.06);
  [[-150, 30, 160, 30], [-150, 104, 160, 74]].forEach(([a, b, c, d]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); line(9); });
  const k = ((t / 0.75) % 8 + 8) % 8, cur = Math.floor(k), f = k - cur;
  for (let i = 0; i < 8; i++) { const bx = -140 + i * 38, h = 130 - i * 10, by = 10 - h * 0 + i * 3, press = i === cur ? Math.sin(f * Math.PI) * 6 : 0;
    rect(bx, by + press, 30, h, 8); dot(bx + 15, by + 16 + press, 4, BK); dot(bx + 15, by + h - 16 + press, 4, BK);
  }
  // round knob with a face at the left end of the rails
  dot(-176, 66, 40); eye(-190, 58, 7, t); eye(-162, 58, 7, t, .3); x.beginPath(); x.arc(-176, 70, 10, .3, Math.PI - .3); line(4, BK); cheek(-200, 74, 5); cheek(-152, 74, 5);
  // mallet
  const mx = -125 + (cur + f) * 38, my = -40 - Math.abs(Math.sin(f * Math.PI)) * 30;
  x.save(); x.translate(mx, my); x.rotate(.5); x.beginPath(); x.moveTo(0, 0); x.lineTo(60, -70); line(8); dot(0, 0, 16); x.restore();
  x.restore();
}
function bell(t) {
  // a bell swinging, clapper swinging the other way, little sound arcs
  const sw = per(t, 40) * .32;
  x.save(); x.translate(0, -120); x.rotate(sw);
  x.beginPath(); x.arc(0, 0, 18, 0, 7); line(8);
  x.beginPath(); x.moveTo(-40, 30); x.bezierCurveTo(-46, 120, -80, 160, -110, 190); x.lineTo(110, 190); x.bezierCurveTo(80, 160, 46, 120, 40, 30); x.quadraticCurveTo(0, 6, -40, 30); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-104, 172); x.lineTo(104, 172); line(6, BK);
  face(0, 110, 1, t);
  x.save(); x.translate(0, 196); x.rotate(-sw * 1.6); dot(0, 20, 20); x.restore();
  x.restore();
  const a = Math.abs(per(t, 40));
  [-1, 1].forEach(d => { for (let i = 0; i < 2; i++) { x.save(); x.globalAlpha *= a; x.beginPath(); x.arc(0, -20, 150 + i * 26, d > 0 ? -.5 : Math.PI - .2, d > 0 ? .2 : Math.PI + .5); line(5); x.restore(); } });
}
function trumpet(t) {
  // trumpet with three valves; little notes puff out of the bell and float up-left
  const puff = (per(t, 60) + 1) / 2;
  x.save(); x.rotate(-.12);
  // tube loop
  x.beginPath(); x.roundRect(-60, -20, 150, 70, 34); line(16);
  x.beginPath(); x.moveTo(110, 0); x.lineTo(-60, 0); line(18);
  // mouthpiece
  x.beginPath(); x.moveTo(110, 0); x.lineTo(150, 0); line(12); ell(156, 0, 8, 16);
  // bell (flares to the left)
  x.beginPath(); x.moveTo(-60, -12); x.quadraticCurveTo(-110, -20, -150, -70 - puff * 6); x.lineTo(-150, 70 + puff * 6); x.quadraticCurveTo(-110, 20, -60, 12); x.closePath(); x.fillStyle = WH; x.fill();
  ell(-150, 0, 18, 70 + puff * 6); x.beginPath(); x.ellipse(-150, 0, 18, 70 + puff * 6, 0, 0, 7); line(5, BK);
  // valves
  [0, 30, 60].forEach((vx, i) => { const pr = Math.max(0, per(t + i * 2, 60)) * 8; rect(vx - 9, -64 + pr, 18, 52, 6); dot(vx, -70 + pr, 12); });
  // face on the bell
  eye(-126, -22, 8, t); eye(-126, 22, 8, t, .3); x.beginPath(); x.arc(-112, 0, 12, -1.2, 1.2); line(5, BK);
  x.restore();
  for (let i = 0; i < 3; i++) { const k = ((t / 4) + i / 3) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k); note(-180 - k * 60, -40 - k * 150 + Math.sin(k * 9 + i) * 10, .7 + .2 * i); x.restore(); }
}
function pianoKeys(t) {
  // a little keyboard: white keys press down one after another, black keys on top, a face on the lid
  rect(-160, -110, 320, 70, 22); face(0, -78, .85, t);
  const k = ((t / (240 / 399)) % 7 + 7) % 7, cur = Math.floor(k), f = k - cur;
  for (let i = 0; i < 7; i++) { const press = i === cur ? Math.sin(f * Math.PI) * 10 : 0;
    rect(-154 + i * 44, -34 + press, 40, 150, 8); }
  [0, 1, 3, 4, 5].forEach(i => rect(-124 + i * 44, -40, 24, 88, 5, BK));
  [0, 1, 3, 4, 5].forEach(i => outline(-124 + i * 44, -40, 24, 88, 5, 3, WH));
  for (let i = 0; i < 2; i++) { const kk = ((t / 3) + i / 2) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * kk); note(-154 + 20 + cur * 44 + i * 30, -130 - kk * 70, .55); x.restore(); }
}
function guitar(t) {
  // guitar lying a bit tilted, round sound hole with a face, strings shimmering
  x.save(); x.rotate(-.5);
  ell(-60, 0, 100, 92); ell(60, 0, 78, 70);
  x.beginPath(); x.ellipse(-60, 0, 100, 92, 0, 0, 7); line(4, BK);
  rect(110, -16, 160, 32, 8); rect(256, -26, 50, 52, 12);
  [-14, 0, 14].forEach(d => { dot(268, d * 1.3, 5, BK); dot(294, d * 1.3, 5, BK); });
  dot(-30, 0, 38, BK); dot(-30, 0, 30, WH);
  // face in the sound hole area
  eye(-44, -6, 6, t); eye(-16, -6, 6, t, .3); x.beginPath(); x.arc(-30, 6, 9, .3, Math.PI - .3); line(4, BK);
  rect(-140, -24, 24, 48, 6, BK);
  const v = Math.abs(per(t, 120)) * 3;
  for (let i = 0; i < 4; i++) { const y0 = -15 + i * 10; x.beginPath(); x.moveTo(-128, y0); x.quadraticCurveTo(60, y0 + (i % 2 ? v : -v), 260, y0 * .8); line(2.5, BK); }
  x.restore();
}
function maracas(t) {
  // two maracas crossed, shaking in turn, little dots flying
  [[-1, per(t, 80)], [1, -per(t, 80)]].forEach(([d, s]) => { x.save(); x.translate(d * 60, 40); x.rotate(d * .5 + s * .25);
    x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 130); line(20); ell(0, -60, 64, 80);
    [[-26, -112], [0, -120], [26, -112]].forEach(([a, b]) => dot(a, b, 7, BK));
    x.beginPath(); x.moveTo(-52, -92); x.quadraticCurveTo(0, -78, 52, -92); line(4, BK);
    [[-30, -4], [30, -4], [0, 4]].forEach(([a, b]) => dot(a, b, 6, BK));
    if (d < 0) face(0, -50, .7, t); else face(0, -50, .7, t, .5);
    x.restore(); });
  const a = Math.abs(per(t, 80));
  for (let i = 0; i < 6; i++) { x.save(); x.globalAlpha *= a; dot(Math.cos(i) * (170 + a * 20), -60 + Math.sin(i * 2) * 60, 5); x.restore(); }
}
function noteDuo(t) {
  // two joined eighth notes (beamed) with faces, bouncing; a little heart floats between them
  const b1 = Math.abs(per(t, 60)) * 30, b2 = Math.abs(perc(t, 60)) * 30;
  ell(-80, 80 - b1, 56, 42, WH, -.35); ell(80, 80 - b2, 56, 42, WH, -.35);
  x.beginPath(); x.moveTo(-32, 70 - b1); x.lineTo(-32, -120); line(16); x.beginPath(); x.moveTo(128, 70 - b2); x.lineTo(128, -120); line(16);
  x.beginPath(); x.moveTo(-40, -120); x.lineTo(136, -120); x.lineTo(136, -86); x.lineTo(-40, -86); x.closePath(); x.fillStyle = WH; x.fill();
  [[-80, 80 - b1, 0], [80, 80 - b2, .4]].forEach(([cx, cy, ph]) => { eye(cx - 18, cy - 6, 8, t, ph); eye(cx + 14, cy - 10, 8, t, ph + .2); smile(cx - 2, cy + 6, 10, 5); cheek(cx - 34, cy + 10, 6); });
  const hk = (per(t, 30) + 1) / 2; x.save(); x.translate(48, -10 - hk * 30); x.scale(.8 + hk * .3, .8 + hk * .3);
  x.beginPath(); x.moveTo(0, 14); x.bezierCurveTo(-30, -8, -12, -30, 0, -14); x.bezierCurveTo(12, -30, 30, -8, 0, 14); x.fillStyle = WH; x.fill(); x.restore();
}
function rattle(t) {
  // baby rattle: round head with see-through window and rolling beads, handle with rings, gentle shake
  const sh = per(t, 80) * .25;
  x.save(); x.rotate(-.4 + sh);
  x.beginPath(); x.moveTo(0, 60); x.lineTo(0, 200); line(26); [110, 150].forEach(yy => ell(0, yy, 26, 10, BK)); ell(0, 210, 30, 22);
  dot(0, -30, 100); dot(0, -30, 70, BK);
  for (let i = 0; i < 5; i++) { const an = sh * 6 + i * TAU / 5; dot(Math.cos(an) * 40, -30 + Math.sin(an) * 40, 13); }
  // face on the ring (top)
  x.restore();
  x.save(); x.rotate(-.4 + sh); x.translate(0, -30);
  for (let i = 0; i < 12; i++) { const an = i * TAU / 12; dot(Math.cos(an) * 86, Math.sin(an) * 86, 5, BK); }
  x.restore();
  const r0 = -.4 + sh;
  // sound sparkles
  const a = Math.abs(per(t, 80));
  [[-150, -120], [150, -110], [-160, 40]].forEach(([px, py]) => { x.save(); x.globalAlpha *= a; x.translate(px, py); for (let k = 0; k < 4; k++) { x.rotate(Math.PI / 4); x.beginPath(); x.moveTo(-14, 0); x.lineTo(14, 0); line(5); } x.restore(); });
  // a small happy face on the handle end
  x.save(); x.rotate(r0); x.translate(0, 210); eye(-10, -4, 4.5, t); eye(10, -4, 4.5, t, .3); x.beginPath(); x.arc(0, 4, 7, .3, Math.PI - .3); line(3.5, BK); x.restore();
}
function harp(t) {
  // little harp: curved frame, pillar, strings; one string after another shimmers
  x.beginPath(); x.moveTo(-110, 150); x.lineTo(-110, -130); line(22);
  x.beginPath(); x.moveTo(-110, -130); x.quadraticCurveTo(10, -200, 60, -100); x.quadraticCurveTo(100, -30, 120, 150); line(22);
  x.beginPath(); x.moveTo(-130, 160); x.lineTo(140, 160); line(22);
  const k = ((t / (240 / 486)) % 9 + 9) % 9, cur = Math.floor(k);
  for (let i = 0; i < 9; i++) { const sx = -88 + i * 24, top = -140 + Math.pow(i / 8, 1.4) * 60 + i * 6, v = i === cur ? Math.sin((k - cur) * Math.PI * 6) * 6 : 0;
    x.beginPath(); x.moveTo(sx, top + 14); x.quadraticCurveTo(sx + v, 50, sx + i * 2, 148); line(i === cur ? 5 : 3); }
  // face on the pillar top (round knob)
  dot(-110, -150, 40); eye(-124, -156, 6, t); eye(-96, -156, 6, t, .3); x.beginPath(); x.arc(-110, -144, 9, .3, Math.PI - .3); line(4, BK); cheek(-134, -140, 5); cheek(-86, -140, 5);
  const kk = (t / 3) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * kk); note(140 + kk * 30, -60 - kk * 90, .6); x.restore();
}

function bg(t) {
  // soft music staff drifting slowly across the bottom
  const off = (t * 960 / P * 2) % 120;
  x.save(); x.globalAlpha = .55; for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(0, 452 + i * 14); x.lineTo(960, 452 + i * 14); line(2.5); } x.restore();
  for (let i = -1; i < 9; i++) { const px = i * 120 + 60 - off, k = hash(i + Math.floor((t * 960 / P * 2) / 120) + 40); x.save(); x.globalAlpha = .7; note(px, 466 + Math.floor(k * 4) * 7, .55); x.restore(); }
  // twinkling stars across the top
  for (let i = 0; i < 14; i++) { const tw = (per(t + i * 9, 20 + (i % 5) * 4) + 1) / 2, sx = 30 + hash(i + 71) * 900, sy = 24 + hash(i + 17) * 100;
    if (sx > 300 && sx < 660) continue;
    x.save(); x.translate(sx, sy); x.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? 2 + tw * 2 : 5 + tw * 6, an = j * Math.PI / 5 - Math.PI / 2; x.lineTo(Math.cos(an) * r, Math.sin(an) * r); } x.closePath(); x.fillStyle = WH; x.fill(); x.restore(); }
  // tiny notes floating up at the sides
  for (let i = 0; i < 6; i++) { const k = ((t * 10 / P) + i / 6) % 1, sx = (i % 2 ? 870 : 90) + Math.sin(k * TAU * 2 + i) * 20;
    x.save(); x.globalAlpha = .7 * Math.sin(Math.PI * k); note(sx, 420 - k * 300, .4); x.restore(); }
}
// outro: the little drum asleep, sticks crossed on top, under a crescent moon
function sleepyEnd(t) {
  x.save(); x.translate(200, -150); dot(0, 0, 36); dot(14, -8, 32, BK); x.restore();
  const br = per(t, 8) * 2;
  x.save(); x.translate(0, br);
  rect(-130, -10, 260, 130, 30);
  x.beginPath(); for (let i = 0; i <= 8; i++) { const px = -120 + i * 30; x.lineTo(px, i % 2 ? 108 : 2); } line(6, BK);
  [2, 108].forEach(yy => { x.beginPath(); x.moveTo(-130, yy); x.lineTo(130, yy); line(8, BK); });
  ell(0, -10, 130, 32); x.beginPath(); x.ellipse(0, -10, 130, 32, 0, 0, 7); line(6, BK);
  [[-1], [1]].forEach(([d]) => { x.save(); x.translate(0, -24); x.rotate(d * .35); x.beginPath(); x.moveTo(-110, 0); x.lineTo(110, 0); line(10); dot(d * 116, 0, 13); x.restore(); });
  rect(-60, 22, 120, 66, 24); sleepyEye(-22, 50, 9); sleepyEye(22, 50, 9); cheek(-42, 66, 7); cheek(42, 66, 7);
  x.restore();
  for (let i = 0; i < 3; i++) { const k = (t * .25 + i / 3) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k);
    x.font = C.FONT(30 + i * 8); x.fillStyle = WH; x.textAlign = 'center'; x.fillText('z', -160 - k * 30, -60 - k * 100); x.restore(); }
}

const up = f => t => { x.translate(0, -30); f(t); };
L.scene({
  seed: 171,
  figs: [[drum, .8, 'sway'], [xylophone, .85, 'sway'], [bell, .72, 'sway'], [trumpet, .78, 'float'], [pianoKeys, .82, 'sway'],
         [guitar, .72, 'sway'], [maracas, .78, 'sway'], [noteDuo, .8, 'float'], [up(rattle), .72, 'sway'], [harp, .78, 'sway']],
  bg, end: sleepyEnd, scale: 1.4,
});
