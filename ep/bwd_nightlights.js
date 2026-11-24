// Daily B&W sensory #21: Night Lights – friendly white night lights with happy faces on black:
// a camping lantern with a swinging handle and pulsing light rays, a candle in a little holder with a gently flickering flame and a slow
// drip, a striped lighthouse on a rock with a turning light beam and rolling waves, a glass jar with a ribbon on the lid and fireflies
// circling inside, a hanging star mobile (crossbar with little stars and a crescent swinging on threads), a mushroom night-light with
// glowing dots and a little plug, a window with swaying curtains, a peeking moon and stars, a sleepy cat curled on a cushion (tail swish,
// opens one eye now and then), an old-fashioned street lamp with a light cone and drifting light specks, and a string of fairy lights
// swinging as a garland with the bulbs glowing in turn.
// Background: little rooftops along the bottom with windows that softly switch on and off, twinkling stars at the top sides.
// Outro: a sleepy crescent moon holding a tiny lantern, z z z.
// All figures are new drawings for this video (own design, no existing characters). Everything periodic in P = 240 s.
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;
const P = L.P;
const W0 = C.W;

const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const cheek = (cx, cy, r = 7) => { x.save(); x.globalAlpha *= .45; dot(cx, cy, r, BK); x.restore(); };
const cyc = (t, n) => (((t * n / P) % 1) + 1) % 1;            // 0..1 saw, n times per period
const pulse = (t, n, w = .12) => { const k = cyc(t, n); return k < w ? Math.sin(k / w * Math.PI) : 0; };
const outline = (lw = 5) => line(lw, BK);
function rrect(a, b, w, h, r) { x.beginPath(); x.roundRect(a, b, w, h, r); }
function star5(cx, cy, R, r, rot = 0) {
  x.beginPath(); for (let j = 0; j < 10; j++) { const rr = j % 2 ? r : R, an = j * Math.PI / 5 - Math.PI / 2 + rot; x.lineTo(cx + Math.cos(an) * rr, cy + Math.sin(an) * rr); } x.closePath();
}
const face = (cx, cy, s, t, ph = 0) => { eye(cx - 22 * s, cy, 10 * s, t, ph); eye(cx + 22 * s, cy, 10 * s, t, ph + .3); cheek(cx - 40 * s, cy + 18 * s, 7 * s); cheek(cx + 40 * s, cy + 18 * s, 7 * s); smile(cx, cy + 10 * s, 14 * s, 5 * s); };
function rays(cx, cy, r0, r1, n, k, lw = 6, rot = 0) {
  for (let i = 0; i < n; i++) { const an = TAU * i / n + rot; x.beginPath(); x.moveTo(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0);
    x.lineTo(cx + Math.cos(an) * (r0 + (r1 - r0) * k), cy + Math.sin(an) * (r0 + (r1 - r0) * k)); line(lw); }
}

// 1. camping lantern: swinging handle, pulsing rays
function lantern(t) {
  const sw = per(t, 20) * .08, pr = (per(t, 30) + 1) / 2;
  x.save(); x.rotate(sw);
  // handle
  x.beginPath(); x.arc(0, -120, 50, Math.PI, 0); line(9);
  // cap
  rrect(-70, -125, 140, 34, 14); x.fillStyle = WH; x.fill();
  // glass (outlined white frame)
  rrect(-62, -92, 124, 150, 24); x.fillStyle = WH; x.fill();
  rrect(-48, -78, 96, 122, 18); x.fillStyle = BK; x.fill();
  // glowing flame-core with face
  dot(0, -10, 40);
  eye(-14, -16, 7, t); eye(14, -16, 7, t, .3); smile(0, -6, 10, 4);
  // base
  rrect(-78, 58, 156, 34, 14); x.fillStyle = WH; x.fill();
  [-40, 0, 40].forEach(a => dot(a, 75, 5, BK));
  x.restore();
  rays(0, -10, 120, 150, 10, .4 + .6 * pr, 7, per(t, 4) * .2);
}

// 2. candle in a holder: flickering flame + slow drip
function candle(t) {
  const fl = per(t, 90) * .07 + per(t, 37) * .05, d = cyc(t, 12);
  // holder dish with handle ring
  ell(0, 120, 130, 26); x.beginPath(); x.arc(150, 110, 24, 0, TAU); line(9);
  // candle body
  rrect(-55, -60, 110, 175, 18); x.fillStyle = WH; x.fill();
  // wax drip running down
  x.beginPath(); x.moveTo(30, -60); x.lineTo(30, -40 + d * 70); line(12, BK); dot(30, -40 + d * 70, 8, BK);
  face(-6, 20, 1, t);
  // wick + flame
  x.beginPath(); x.moveTo(0, -60); x.lineTo(0, -78); line(5);
  x.save(); x.translate(0, -80); x.rotate(fl); x.scale(1 + fl, 1 - fl * .5);
  x.beginPath(); x.moveTo(0, -95); x.quadraticCurveTo(40, -30, 26, -8); x.arc(0, -8, 26, 0, Math.PI); x.quadraticCurveTo(-40, -30, 0, -95); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(0, -50); x.quadraticCurveTo(14, -20, 10, -10); x.arc(0, -10, 10, 0, Math.PI); x.quadraticCurveTo(-14, -20, 0, -50); x.fillStyle = BK; x.fill();
  x.restore();
  // soft glow ring
  x.save(); x.globalAlpha *= .5 + .3 * per(t, 24); x.beginPath(); x.arc(0, -125, 70, 0, TAU); line(4); x.restore();
}

// 3. lighthouse with a turning beam and waves
function lighthouse(t) {
  const b = cyc(t, 16), side = Math.cos(b * TAU);
  // beam (behind tower when side < 0)
  const beam = () => { x.save(); x.globalAlpha *= Math.abs(side) * .9;
    x.beginPath(); x.moveTo(0, -140); x.lineTo(side * 230, -185); x.lineTo(side * 230, -95); x.closePath(); x.fillStyle = WH; x.fill(); x.restore(); };
  if (side < 0) beam();
  // rock
  x.beginPath(); x.moveTo(-130, 130); x.quadraticCurveTo(-110, 80, -60, 86); x.lineTo(60, 86); x.quadraticCurveTo(110, 80, 130, 130); x.closePath(); x.fillStyle = WH; x.fill();
  // tower (tapered, black stripes)
  x.beginPath(); x.moveTo(-58, 90); x.lineTo(-38, -110); x.lineTo(38, -110); x.lineTo(58, 90); x.closePath(); x.fillStyle = WH; x.fill();
  x.save(); x.beginPath(); x.moveTo(-58, 90); x.lineTo(-38, -110); x.lineTo(38, -110); x.lineTo(58, 90); x.closePath(); x.clip();
  x.fillStyle = BK; x.fillRect(-70, -70, 140, 26); x.fillRect(-70, 40, 140, 26); x.restore();
  // door
  x.beginPath(); x.moveTo(-14, 90); x.lineTo(-14, 72); x.arc(0, 72, 14, Math.PI, 0); x.lineTo(14, 90); x.fillStyle = BK; x.fill();
  // face between stripes
  face(0, -10, .85, t);
  // gallery + lamp room + roof
  rrect(-56, -122, 112, 14, 6); x.fillStyle = WH; x.fill();
  rrect(-30, -165, 60, 44, 8); x.fillStyle = WH; x.fill();
  dot(0, -143, 14, BK); dot(0, -143, 8);
  x.beginPath(); x.moveTo(-40, -165); x.lineTo(0, -200); x.lineTo(40, -165); x.closePath(); x.fillStyle = WH; x.fill();
  dot(0, -204, 7);
  if (side >= 0) beam();
  // waves
  for (let r = 0; r < 2; r++) { x.beginPath(); const y = 140 + r * 22, ph = TAU * 6 * t / P + r * 2;
    for (let px = -170; px <= 170; px += 6) { const yy = y + Math.sin(px / 20 + ph) * 6; px === -170 ? x.moveTo(px, yy) : x.lineTo(px, yy); } line(6); }
}

// 4. glass jar with fireflies circling inside, ribbon on the lid
function jar(t) {
  // jar outline
  x.beginPath(); x.moveTo(-80, -95); x.quadraticCurveTo(-120, -70, -120, 0); x.lineTo(-120, 100); x.quadraticCurveTo(-120, 140, -80, 140); x.lineTo(80, 140);
  x.quadraticCurveTo(120, 140, 120, 100); x.lineTo(120, 0); x.quadraticCurveTo(120, -70, 80, -95); line(10);
  // lid + ribbon bow
  rrect(-90, -130, 180, 38, 10); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-90, -112); x.lineTo(90, -112); line(4, BK);
  const bw = per(t, 24) * .1;
  x.save(); x.translate(60, -132); x.rotate(bw);
  ell(-22, -10, 22, 12, WH, -.4); ell(22, -10, 22, 12, WH, .4); dot(0, -6, 9);
  x.beginPath(); x.moveTo(-4, 0); x.lineTo(-14, 26); x.moveTo(4, 0); x.lineTo(16, 24); line(5); x.restore();
  // face on the glass
  face(0, 70, .9, t);
  // shine stripe
  x.beginPath(); x.moveTo(-96, -20); x.lineTo(-96, 60); line(5);
  // fireflies circling
  for (let i = 0; i < 5; i++) {
    const an = TAU * (2 * t / P) + TAU * i / 5 + (i % 2) * TAU * 3 * t / P, rx = 70 - (i % 3) * 12, ry = 50 - (i % 2) * 14;
    const fx = Math.cos(an) * rx, fy = -10 + Math.sin(an) * ry, gl = (per(t + i * 11, 40) + 1) / 2;
    dot(fx, fy, 6 + gl * 4); x.save(); x.globalAlpha *= .3 + .4 * gl; x.beginPath(); x.arc(fx, fy, 15 + gl * 4, 0, TAU); line(3); x.restore();
    ell(fx - 6, fy - 8, 6, 3.5, WH, -.6); ell(fx + 6, fy - 8, 6, 3.5, WH, .6);
  }
}

// 5. hanging star mobile: crossbar with little stars and a crescent swinging
function mobile(t) {
  const sw = per(t, 16) * .1;
  x.beginPath(); x.moveTo(0, -170); x.lineTo(0, -120); line(4);
  dot(0, -172, 8);
  x.save(); x.translate(0, -120); x.rotate(sw);
  x.beginPath(); x.moveTo(-160, 0); x.lineTo(160, 0); line(9);
  dot(-160, 0, 7); dot(160, 0, 7);
  const items = [[-150, 120, 's'], [-75, 70, 's'], [0, 190, 'm'], [75, 80, 's'], [150, 130, 's']];
  items.forEach(([ix, len, kind], i) => {
    const s2 = per(t + i * 13, 24) * .15;
    x.save(); x.translate(ix, 0); x.rotate(-sw + s2);
    x.beginPath(); x.moveTo(0, 0); x.lineTo(0, len - (kind === 'm' ? 50 : 26)); line(3);
    x.translate(0, len);
    if (kind === 'm') {
      dot(0, 0, 50); dot(24, -14, 42, BK);
      eye(-26, -2, 7, t); smile(-22, 12, 9, 4); cheek(-36, 16, 5);
    } else {
      const rot = per(t + i * 7, 12) * .4;
      star5(0, 0, 28, 13, rot); x.fillStyle = WH; x.fill();
      dot(-6, -2, 3.2, BK); dot(6, -2, 3.2, BK); x.beginPath(); x.arc(0, 3, 5, .3, Math.PI - .3); line(2.5, BK);
    }
    x.restore();
  });
  x.restore();
}

// 6. mushroom night-light with glowing dots and a plug
function mushroom(t) {
  const gl = (per(t, 30) + 1) / 2;
  // glow ring
  x.save(); x.globalAlpha *= .35 + .4 * gl; x.beginPath(); x.ellipse(0, -60, 175, 115, 0, 0, TAU); line(4); x.restore();
  // cap
  x.beginPath(); x.moveTo(-150, -20); x.quadraticCurveTo(-150, -150, 0, -150); x.quadraticCurveTo(150, -150, 150, -20); x.quadraticCurveTo(0, 0, -150, -20); x.fillStyle = WH; x.fill();
  // glowing dots on cap (pulse in turn)
  [[-90, -60, 18], [-30, -115, 14], [40, -100, 20], [100, -55, 14], [0, -55, 12]].forEach(([a, b, r], i) => {
    const k = (per(t + i * 9, 20) + 1) / 2; dot(a, b, r, BK); dot(a, b, r * (.25 + .4 * k)); });
  // stem with face
  x.beginPath(); x.moveTo(-60, -12); x.quadraticCurveTo(-75, 60, -55, 100); x.lineTo(55, 100); x.quadraticCurveTo(75, 60, 60, -12); x.closePath(); x.fillStyle = WH; x.fill();
  face(0, 34, .9, t);
  // base + cord + plug
  rrect(-80, 96, 160, 26, 10); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(80, 110); x.bezierCurveTo(140, 110, 120, 150, 170, 140); line(6);
  rrect(166, 124, 34, 30, 6); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(200, 132); x.lineTo(214, 132); x.moveTo(200, 146); x.lineTo(214, 146); line(5);
}

// 7. window: swaying curtains, peeking moon, stars
function windowFig(t) {
  const c = per(t, 12);
  // frame
  rrect(-140, -150, 280, 280, 16); line(12);
  x.beginPath(); x.moveTo(0, -150); x.lineTo(0, 130); x.moveTo(-140, -10); x.lineTo(140, -10); line(8);
  // moon peeking (bobs up and down in the left top pane)
  const my = -70 + per(t, 8) * 16;
  x.save(); rrect(-134, -144, 130, 130, 10); x.clip();
  dot(-66, my, 44); eye(-80, my - 6, 7, t); eye(-54, my - 6, 7, t, .3); smile(-67, my + 6, 10, 4); cheek(-92, my + 10, 5); cheek(-42, my + 10, 5);
  x.restore();
  // stars in right panes
  [[70, -100, 14], [100, -50, 9], [50, -40, 8], [80, 60, 12], [40, 90, 7]].forEach(([a, b, r], i) => { const tw = (per(t + i * 5, 30) + 1) / 2;
    star5(a, b, r * (.6 + .4 * tw), r * .45 * (.6 + .4 * tw)); x.fillStyle = WH; x.fill(); });
  // curtains (sway)
  [-1, 1].forEach(sd => {
    const s2 = c * 10 * sd;
    x.beginPath(); x.moveTo(sd * 150, -165); x.lineTo(sd * 95, -165);
    x.quadraticCurveTo(sd * (100 + s2), -40, sd * (120 + s2), 60); x.quadraticCurveTo(sd * (128 + s2), 130, sd * 150, 150); x.closePath(); x.fillStyle = WH; x.fill();
    for (let j = 0; j < 2; j++) { x.beginPath(); x.moveTo(sd * (110 + j * 18), -160); x.quadraticCurveTo(sd * (115 + j * 15 + s2), -20, sd * (130 + j * 10 + s2), 120); line(3, BK); }
  });
  // curtain rod
  x.beginPath(); x.moveTo(-170, -168); x.lineTo(170, -168); line(8); dot(-174, -168, 9); dot(174, -168, 9);
  // sill
  rrect(-160, 126, 320, 20, 8); x.fillStyle = WH; x.fill();
}

// 8. sleepy cat curled on a cushion
function cat(t) {
  const br = per(t, 30) * 3, ts = per(t, 20) * .25, open = pulse(t, 10, .07);
  // cushion with tassels
  x.beginPath(); x.moveTo(-170, 80); x.quadraticCurveTo(-160, 40, 0, 40); x.quadraticCurveTo(160, 40, 170, 80); x.quadraticCurveTo(160, 130, 0, 128); x.quadraticCurveTo(-160, 130, -170, 80); x.fillStyle = WH; x.fill();
  [[-170, 80], [170, 80]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(a + Math.sign(a) * 18, b + 20); line(6); });
  x.beginPath(); x.moveTo(-140, 84); x.quadraticCurveTo(0, 96, 140, 84); line(4, BK);
  [-90, -30, 30, 90].forEach(a => dot(a, 106, 5, BK));
  x.save(); x.translate(0, br * .3);
  // tail curling around (swishes)
  x.save(); x.translate(110, 30); x.rotate(ts);
  x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(50, -10, 40, -60); x.quadraticCurveTo(34, -84, 14, -76); line(22); x.restore();
  // body (curled)
  x.save(); x.scale(1, 1 + br / 200);
  x.beginPath(); x.ellipse(10, -5, 125, 60, 0, 0, TAU); x.fillStyle = WH; x.fill(); x.restore();
  // stripes
  [[-10, -55], [30, -58], [70, -50]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo(a + 6, b + 18, a - 2, b + 30); line(6, BK); });
  // paws in front (outlined so they stay separate from the body)
  [-120, -62].forEach(px => { x.beginPath(); x.ellipse(px, 40, 30, 15, 0, 0, TAU); x.fillStyle = WH; x.fill(); x.lineWidth = 5; x.strokeStyle = BK; x.stroke(); });
  // head resting on the paws (black ring separates it from the body)
  x.beginPath(); x.arc(-95, -20, 52, 0, TAU); x.lineWidth = 8; x.strokeStyle = BK; x.stroke(); dot(-95, -20, 52);
  x.beginPath(); x.moveTo(-138, -42); x.lineTo(-136, -92); x.lineTo(-104, -66); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-86, -68); x.lineTo(-56, -90); x.lineTo(-52, -46); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-130, -54); x.lineTo(-130, -76); x.lineTo(-114, -62); x.closePath(); x.fillStyle = BK; x.fill();
  x.beginPath(); x.moveTo(-64, -60); x.lineTo(-60, -78); x.lineTo(-74, -66); x.closePath(); x.fillStyle = BK; x.fill();
  // eyes: sleeping, one opens now and then
  sleepyEye(-116, -24, 9);
  if (open > .3) { dot(-74, -26, 9, BK); dot(-77, -29, 3, WH); } else sleepyEye(-74, -24, 9);
  // nose + mouth + whiskers
  x.beginPath(); x.moveTo(-101, -10); x.lineTo(-89, -10); x.lineTo(-95, -3); x.closePath(); x.fillStyle = BK; x.fill();
  x.beginPath(); x.arc(-100, -1, 5, .2, Math.PI - .2); x.stroke(); x.beginPath(); x.arc(-90, -1, 5, .2, Math.PI - .2); line(3, BK);
  [[-1, -6], [1, -6], [-1, 2], [1, 2]].forEach(([sd, dy]) => { x.beginPath(); x.moveTo(-95 + sd * 22, -4 + dy * .3); x.lineTo(-95 + sd * 44, -8 + dy); line(2.5, BK); });
  cheek(-128, 0, 6); cheek(-62, 0, 6);
  x.restore();
  // z z
  for (let i = 0; i < 2; i++) { const k = cyc(t + i * 6, 20); x.save(); x.globalAlpha *= Math.sin(Math.PI * k) * (1 - open);
    x.font = C.FONT(28 + i * 8); x.fillStyle = WH; x.textAlign = 'center'; x.fillText('z', -150 - k * 20, -100 - k * 60); x.restore(); }
}

// 9. old-fashioned street lamp with light cone and drifting specks
function streetlamp(t) {
  // light cone
  x.save(); x.globalAlpha *= .22 + .08 * per(t, 20);
  x.beginPath(); x.moveTo(-30, -100); x.lineTo(-150, 140); x.lineTo(150, 140); x.lineTo(30, -100); x.closePath(); x.fillStyle = WH; x.fill(); x.restore();
  // pool of light on the ground
  x.beginPath(); x.ellipse(0, 150, 160, 16, 0, 0, TAU); line(4);
  // post
  rrect(-12, -80, 24, 220, 8); x.fillStyle = WH; x.fill();
  rrect(-36, 128, 72, 22, 8); x.fillStyle = WH; x.fill();
  // curly arm decoration
  x.beginPath(); x.arc(-26, 0, 14, -Math.PI / 2, Math.PI); line(5); x.beginPath(); x.arc(26, 0, 14, 0, Math.PI * 1.5, true); line(5);
  // lamp head (trapezoid glass) with face
  x.beginPath(); x.moveTo(-50, -170); x.lineTo(50, -170); x.lineTo(34, -88); x.lineTo(-34, -88); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-60, -170); x.lineTo(0, -205); x.lineTo(60, -170); x.closePath(); x.fillStyle = WH; x.fill();
  dot(0, -210, 8);
  x.beginPath(); x.moveTo(-52, -170); x.lineTo(52, -170); line(4, BK);
  eye(-14, -140, 7, t); eye(14, -140, 7, t, .3); smile(0, -128, 10, 4); cheek(-28, -122, 5); cheek(28, -122, 5);
  // drifting light specks
  for (let i = 0; i < 7; i++) { const k = cyc(t + i * 17, 10 + (i % 3) * 2), sx = Math.sin(k * TAU + i) * (40 + i * 10), sy = -60 + k * 180;
    x.save(); x.globalAlpha *= Math.sin(Math.PI * k); dot(sx, sy, 3 + (i % 3)); x.restore(); }
}

// 10. string of fairy lights swinging as a garland, bulbs glowing in turn
function fairy(t) {
  const sw = per(t, 12) * 16, N = 9;
  const pt = k => { const px = -230 + 460 * k; return [px, -60 + Math.sin(k * Math.PI) * (110 + sw) + Math.sin(k * TAU * 2) * 10]; };
  // hooks
  dot(-236, -64, 9); dot(236, -64, 9);
  x.beginPath(); for (let k = 0; k <= 1.001; k += .02) { const [a, b] = pt(k); k === 0 ? x.moveTo(a, b) : x.lineTo(a, b); } line(5);
  const on = Math.floor(cyc(t, 40) * N);
  for (let i = 0; i < N; i++) {
    const k = (i + .5) / N, [a, b] = pt(k), lit = i === on || i === (on + 3) % N || i === (on + 6) % N;
    x.save(); x.translate(a, b); x.rotate(per(t + i * 5, 24) * .15);
    rrect(-7, 0, 14, 12, 3); x.fillStyle = WH; x.fill();
    x.beginPath(); x.moveTo(0, 12); x.quadraticCurveTo(20, 30, 0, 52); x.quadraticCurveTo(-20, 30, 0, 12); x.fillStyle = WH; x.fill();
    if (!lit) { x.beginPath(); x.moveTo(0, 18); x.quadraticCurveTo(12, 30, 0, 44); x.quadraticCurveTo(-12, 30, 0, 18); x.fillStyle = BK; x.fill(); }
    else rays(0, 32, 30, 42, 6, 1, 3);
    x.restore();
  }
  // the middle bulb is a big friendly one with a face
  const [ma, mb] = pt(.5);
  x.save(); x.translate(ma, mb + 46);
  x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(60, 50, 0, 110); x.quadraticCurveTo(-60, 50, 0, 0); x.fillStyle = WH; x.fill();
  eye(-14, 58, 7, t); eye(14, 58, 7, t, .3); smile(0, 68, 9, 4); cheek(-24, 76, 5); cheek(24, 76, 5);
  x.restore();
}

// ---------- background ----------
const HOUSES = [[0, 70, 60], [70, 60, 80], [130, 80, 54], [210, 64, 70], [274, 70, 46], [690, 70, 50], [760, 60, 76], [820, 76, 56], [896, 70, 70]];
function bg(t) {
  const base = 540;
  HOUSES.forEach(([hx, w, h], i) => {
    const top = base - h;
    x.beginPath(); x.moveTo(hx + 4, base); x.lineTo(hx + 4, top); x.lineTo(hx + w / 2, top - 30); x.lineTo(hx + w - 4, top); x.lineTo(hx + w - 4, base); line(3);
    // windows that softly switch on / off
    const wx = hx + w / 2 - 9, wy = top + 14, on = (per(t + i * 23, 4 + (i % 3) * 2) + 1) / 2;
    x.beginPath(); x.rect(wx, wy, 18, 16); line(2.5);
    x.save(); x.globalAlpha *= on; x.fillStyle = WH; x.fillRect(wx + 2, wy + 2, 14, 12); x.restore();
    if (i % 3 === 1) { x.beginPath(); x.moveTo(hx + w - 18, top - 10); x.lineTo(hx + w - 18, top - 26); x.lineTo(hx + w - 8, top - 26); x.lineTo(hx + w - 8, top); line(3); }
  });
  // twinkling stars at the top sides (not behind the figure)
  for (let i = 0; i < 14; i++) { const tw = (per(t + i * 9, 20 + (i % 5) * 4) + 1) / 2, sx = 20 + hash(i + 71) * 920, sy = 18 + hash(i + 29) * 110;
    if (sx > 250 && sx < 710) continue;
    star5(sx, sy, 4 + tw * 5, 2 + tw * 2); x.fillStyle = WH; x.fill(); }
}

// outro: sleepy crescent moon holding a tiny lantern
function sleepyEnd(t) {
  const br = per(t, 8) * 4;
  x.save(); x.translate(0, br);
  x.beginPath(); x.arc(0, 0, 140, .9, TAU - .9); x.arc(70, -20, 118, TAU - 1.25, 1.25, true); x.closePath(); x.fillStyle = WH; x.fill();
  sleepyEye(-80, -20, 12, 6); cheek(-94, 14, 9);
  x.beginPath(); x.arc(-70, 16, 12, .3, Math.PI - .3); line(5, BK);
  // night cap
  x.beginPath(); x.moveTo(-120, -80); x.quadraticCurveTo(-40, -170, 40, -120); x.lineTo(-40, -110); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-120, -80); x.lineTo(-40, -110); line(5, BK); dot(46, -120, 14);
  // arm + tiny lantern hanging from the lower tip
  const sw = per(t, 16) * .12;
  x.save(); x.translate(60, 110); x.rotate(sw);
  x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 30); line(4);
  x.beginPath(); x.arc(0, 40, 12, Math.PI, 0); line(4);
  rrect(-20, 40, 40, 50, 8); x.fillStyle = WH; x.fill(); rrect(-12, 48, 24, 34, 6); x.fillStyle = BK; x.fill(); dot(0, 65, 8);
  rays(0, 65, 34, 46, 8, (per(t, 20) + 1) / 2 * .6 + .4, 3);
  x.restore();
  x.restore();
  for (let i = 0; i < 3; i++) { const k = (t * .25 + i / 3) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k);
    x.font = C.FONT(30 + i * 8); x.fillStyle = WH; x.textAlign = 'center'; x.fillText('z', -150 - k * 30, -110 - k * 90); x.restore(); }
}

const TDY = +(process.env.THUMBDY || 0);   // thumbnail only: move the figure down below the title
const up = f => t => { x.translate(0, -24 + TDY); f(t); };
L.scene({
  seed: 211,
  figs: [[up(lantern), .8, 'sway'], [up(candle), .78, 'sway'], [up(lighthouse), .76, 'sway'], [up(jar), .8, 'sway'], [up(mobile), .78, 'sway'],
         [up(mushroom), .76, 'sway'], [up(windowFig), .78, 'sway'], [up(cat), .8, 'sway'], [up(streetlamp), .62, 'sway'], [up(fairy), .74, 'sway']],
  bg, end: up(sleepyEnd), scale: 1.3,
});
