// Daily B&W sensory #23: Space Trip – friendly white space friends with happy faces on black:
// a little astronaut floating on a wavy tether line and waving, a round alien friend with bobbing springy antennae,
// a satellite whose striped solar panels slowly turn over (with a blinking dish), a smiling Earth with continents and clouds
// drifting around, a flying saucer with a little pilot under the dome, running rim lights and a soft beam,
// a space station with a turning wheel of windows, an electric moon rover (lightning-bolt sign, solar panel, no exhaust)
// rolling over little craters with turning wheels, a telescope on a tripod finding twinkling sparkles,
// a space puppy in a bubble helmet paddling and wagging, and a sleepy spiral galaxy slowly turning its arms of dots.
// Background: twinkling stars at the sides, a gentle cratered planet curve along the bottom, tiny drifting space dots.
// Outro: the little astronaut asleep in a hammock strung between two sleepy stars, z z z.
// All figures are new drawings for this video (own design, no existing characters). Everything periodic in P = 240 s.
// (No ringed planet / rocket / moon / comet figures: those were in B&W #3 Moon and Stars.)
const C = require('../lib/common'), L = require('../lib/bwlong');
const { x } = C;
const { per, perc, TAU, WH, BK, dot, ell, line, eye, smile, hash } = L;
const P = L.P;

const sleepyEye = (cx, cy, r, lw = 5) => { x.beginPath(); x.arc(cx, cy, r, .2, Math.PI - .2); line(lw, BK); };
const cheek = (cx, cy, r = 7) => { x.save(); x.globalAlpha *= .45; dot(cx, cy, r, BK); x.restore(); };
const cyc = (t, n) => (((t * n / P) % 1) + 1) % 1;            // 0..1 saw, n times per period
const tri = k => 1 - Math.abs(1 - 2 * k);                       // 0..1..0
const sm = k => k * k * (3 - 2 * k);
const spin = (t, n) => TAU * n * t / P;                         // periodic rotation angle
function rrect(a, b, w, h, r) { x.beginPath(); x.roundRect(a, b, w, h, r); }
function star5(cx, cy, R, r, rot = 0) {
  x.beginPath(); for (let j = 0; j < 10; j++) { const rr = j % 2 ? r : R, an = j * Math.PI / 5 - Math.PI / 2 + rot; x.lineTo(cx + Math.cos(an) * rr, cy + Math.sin(an) * rr); } x.closePath();
}
function sparkle(cx, cy, r) { x.beginPath(); x.moveTo(cx, cy - r); x.quadraticCurveTo(cx, cy, cx + r, cy); x.quadraticCurveTo(cx, cy, cx, cy + r); x.quadraticCurveTo(cx, cy, cx - r, cy); x.quadraticCurveTo(cx, cy, cx, cy - r); x.fillStyle = WH; x.fill(); }
const face = (cx, cy, s, t, ph = 0) => { eye(cx - 16 * s, cy, 8 * s, t, ph); eye(cx + 16 * s, cy, 8 * s, t, ph + .3); cheek(cx - 30 * s, cy + 14 * s, 6 * s); cheek(cx + 30 * s, cy + 14 * s, 6 * s); smile(cx, cy + 8 * s, 11 * s, 4.5 * s); };
const seg = (a, b, c, d, lw = 7, col = WH) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); line(lw, col); };
// limb with a black edge so it reads in front of the white body
const limb = (a, b, c, d, lw = 22) => { seg(a, b, c, d, lw + 8, BK); seg(a, b, c, d, lw); };

// 1. little astronaut floating on a wavy tether, waving
function astronaut(t) {
  const bob = per(t, 20) * 10, tilt = per(t, 10) * .07;
  // tether from the bottom-left, gently waving
  const w = per(t, 30) * 18;
  x.beginPath(); x.moveTo(-170, 150); x.bezierCurveTo(-130, 60 + w, -90, 140 - w, -40, 60 + bob); line(5);
  dot(-170, 150, 9);
  x.save(); x.translate(0, bob); x.rotate(tilt);
  // backpack behind
  rrect(-62, -14, 124, 96, 18); x.fillStyle = WH; x.fill();
  rrect(-62, -14, 124, 96, 18); line(5, BK);
  // legs
  const lk = per(t, 30) * 8;
  limb(-22, 80, -34 - lk, 140, 26); limb(22, 80, 34 + lk, 136, 26);
  ell(-36 - lk, 146, 22, 13); ell(36 + lk, 142, 22, 13);
  // body suit
  rrect(-50, -4, 100, 96, 30); x.fillStyle = WH; x.fill();
  // chest panel
  rrect(-24, 22, 48, 32, 8); line(4, BK);
  [-12, 0, 12].forEach((a, i) => dot(a, 38, 4 + (cyc(t + i * 2, 40) < .5 ? 1.5 : 0), BK));
  // belt
  seg(-48, 72, 48, 72, 4, BK);
  // left arm holding the tether, right arm waving
  limb(-42, 14, -70, 54, 22); dot(-74, 60, 16, BK); dot(-74, 60, 13);
  const wa = -1.15 + per(t, 40) * .35;
  x.save(); x.translate(44, 12); x.rotate(wa);
  limb(0, 0, 64, 0, 22); dot(70, 0, 18, BK); dot(70, 0, 15);
  [-.5, 0, .5].forEach(an => seg(74, 0, 74 + Math.cos(an) * 14, Math.sin(an) * 14, 7));
  x.restore();
  // helmet
  dot(0, -62, 68, BK); dot(0, -62, 64);
  ell(0, -60, 50, 44, BK); ell(0, -60, 45, 39);
  face(0, -58, .95, t, .3);
  // shine on the helmet rim + little antenna
  x.beginPath(); x.arc(0, -62, 57, -2.6, -2.0); line(4, BK);
  seg(30, -122, 44, -150, 5); dot(44, -152, 7 + (cyc(t, 60) < .5 ? 2 : 0));
  x.restore();
}

// 2. round alien friend with springy antennae bobbing
function alien(t) {
  const sq = per(t, 30) * .04;
  // little feet
  ell(-40, 108, 30, 16); ell(40, 108, 30, 16);
  // antennae (springy, bobbing in turn)
  [-1, 1].forEach((d, i) => {
    const ex = d * 64 + per(t + i * 3, 40) * 10, ey = -142 + per(t + i * 5, 30) * 10;
    x.beginPath(); x.moveTo(d * 26, -70); x.bezierCurveTo(d * 40, -100, d * 50, -110, ex, ey); line(7);
    star5(ex, ey, 18 + per(t + i * 4, 20) * 3, 8); x.fillStyle = WH; x.fill();
  });
  // round body
  x.save(); x.scale(1 - sq, 1 + sq);
  dot(0, 0, 100);
  // tummy patch + spots
  [[-70, -30, 9], [72, -20, 7], [-56, 40, 6], [62, 46, 8]].forEach(([a, b, r]) => dot(a, b, r, BK));
  x.restore();
  // arms waving
  const wv = per(t, 40);
  [-1, 1].forEach(d => { x.save(); x.translate(d * 92, 10); x.rotate(d * (-.5 - (d > 0 ? wv : -wv) * .25));
    seg(0, 0, d * 52, -24, 16); dot(d * 58, -28, 14); x.restore(); });
  // happy face with a big smile
  eye(-30, -20, 14, t, .2); eye(30, -20, 14, t, .5);
  cheek(-56, 6, 10); cheek(56, 6, 10);
  x.beginPath(); x.arc(0, 0, 26, .25, Math.PI - .25); line(7, BK);
}

// 3. satellite with solar panels slowly turning over, blinking dish
function satellite(t) {
  const an = spin(t, 4), c = Math.cos(an), h = 64 * Math.max(.12, Math.abs(c));
  // arms to the panels
  seg(-170, 0, 170, 0, 8);
  [-1, 1].forEach(d => {
    const x0 = d > 0 ? 58 : -172;
    rrect(x0, -h / 2, 114, h, 6); x.fillStyle = WH; x.fill();
    if (c > 0) { for (let i = 1; i < 4; i++) seg(x0 + i * 28.5, -h / 2 + 3, x0 + i * 28.5, h / 2 - 3, 3, BK); if (h > 24) seg(x0 + 4, 0, x0 + 110, 0, 3, BK); }
    else { rrect(x0 + 10, -h / 2 + 6, 94, Math.max(2, h - 12), 4); line(3, BK); }
  });
  // body box
  rrect(-50, -46, 100, 96, 14); x.fillStyle = WH; x.fill();
  rrect(-50, -46, 100, 96, 14); line(5, BK);
  face(0, 4, 1.05, t, .8);
  // dish on top
  seg(0, -46, 0, -76, 7);
  x.beginPath(); x.arc(0, -96, 42, .25, Math.PI - .25); x.closePath(); x.fillStyle = WH; x.fill();
  seg(0, -78, 0, -122, 4); dot(0, -126, 7 + (cyc(t, 40) < .4 ? 3 : 0));
  // signal arcs
  for (let i = 0; i < 3; i++) { const k = cyc(t + i * 2, 40); x.save(); x.globalAlpha *= Math.max(0, 1 - k * 1.4);
    x.beginPath(); x.arc(0, -126, 16 + k * 34, -2.4, -.75); line(4); x.restore(); }
}

// 4. smiling Earth with continents and clouds drifting around
function earth(t) {
  const R = 112;
  dot(0, 0, R + 6, BK); dot(0, 0, R);
  x.save(); x.beginPath(); x.arc(0, 0, R, 0, TAU); x.clip();
  // continents (black) drift right-to-left in two bands, leaving the face area clear
  const off = -cyc(t, 3) * 480;
  { const o = off;
    [[-150, -72, 60, 26], [-40, -84, 40, 20], [70, -70, 54, 24], [190, -80, 44, 22],
     [-100, 82, 50, 22], [30, 92, 60, 22], [160, 80, 44, 20], [-200, 86, 36, 18]].forEach(([a, b, rx, ry], i) => {
      const cx = ((a + o + 240) % 480 + 480) % 480 - 240;
      ell(cx, b, rx, ry, BK, (i % 3 - 1) * .3); ell(cx + rx * .5, b + ry * .4, rx * .5, ry * .8, BK);
    }); }
  // white puffy clouds (with black edge) drifting a bit faster
  const off2 = -cyc(t, 5) * 480;
  [[-120, -52], [80, -48], [-10, 74], [190, 70]].forEach(([a, b]) => {
    const cx = ((a + off2 + 240) % 480 + 480) % 480 - 240;
    [[0, 0, 22], [-22, 6, 15], [22, 6, 16]].forEach(([u, v, r]) => dot(cx + u, b + v, r + 3, BK));
    [[0, 0, 22], [-22, 6, 15], [22, 6, 16]].forEach(([u, v, r]) => dot(cx + u, b + v, r));
  });
  x.restore();
  // face on a soft white patch in the middle
  ell(0, 8, 62, 34);
  face(0, 4, 1.15, t, .6);
  // sparkles around
  [[-150, -100], [150, -110], [160, 90], [-160, 96]].forEach(([a, b], i) => sparkle(a, b, 8 + (per(t + i * 6, 20) + 1) * 4));
}

// 5. flying saucer with a little pilot, running rim lights and a soft beam
function ufo(t) {
  const hov = per(t, 24) * 8;
  // beam (outline + rings sinking) below
  const bk = (per(t, 10) + 1) / 2;
  x.save(); x.globalAlpha *= .4 + .6 * bk;
  x.beginPath(); x.moveTo(-40, 30 + hov); x.lineTo(-100, 160); x.moveTo(40, 30 + hov); x.lineTo(100, 160); line(4);
  for (let i = 0; i < 3; i++) { const k = cyc(t + i * P / 120, 40), yy = 40 + hov + k * (120 - hov), rx = 40 + (yy - 30) * 60 / 130;
    x.save(); x.globalAlpha *= Math.sin(k * Math.PI); x.beginPath(); x.ellipse(0, yy, rx, 9, 0, 0, TAU); line(4); x.restore(); }
  x.restore();
  // little star sparkles rising in the beam
  for (let i = 0; i < 3; i++) { const k = cyc(t + i * 3, 30); x.save(); x.globalAlpha *= Math.sin(k * Math.PI); sparkle((i - 1) * 34, 150 - k * 100, 7); x.restore(); }
  x.save(); x.translate(0, hov);
  // dome (black inside) with the pilot
  x.save(); x.beginPath(); x.arc(0, -20, 74, Math.PI, 0); x.closePath(); x.clip();
  dot(0, -20, 74, BK);
  // pilot: small round head with one antenna
  dot(0, -26, 34); seg(0, -60, 8, -82, 4); dot(8, -84, 6);
  eye(-11, -30, 6, t, 1.2); eye(11, -30, 6, t, 1.5); smile(0, -24, 8, 3.5);
  x.restore();
  x.beginPath(); x.arc(0, -20, 74, Math.PI, 0); line(6);
  x.beginPath(); x.arc(0, -20, 58, -2.5, -2.0); line(5);
  // saucer
  ell(0, 0, 170, 36, BK); ell(0, 0, 164, 32);
  x.beginPath(); x.ellipse(0, -4, 164, 18, 0, .1, Math.PI - .1); line(4, BK);
  // rim lights running in turn
  for (let i = 0; i < 7; i++) { const lx = -120 + i * 40, on = Math.floor(cyc(t, 60) * 7) === i;
    dot(lx, 10, on ? 11 : 7, BK); if (!on) dot(lx, 10, 3); }
  // bottom
  ell(0, 30, 54, 10);
  x.restore();
}

// 6. space station with a turning wheel of windows
function station(t) {
  const a = spin(t, 3);
  // little solar wings on top and a docking mast below
  seg(0, -150, 0, -166, 8);
  [-1, 1].forEach(d => { rrect(d > 0 ? 8 : -88, -182, 80, 34, 6); x.fillStyle = WH; x.fill(); for (let i = 1; i < 4; i++) seg((d > 0 ? 8 : -88) + i * 20, -178, (d > 0 ? 8 : -88) + i * 20, -152, 3, BK); });
  dot(0, -165, 10, BK); dot(0, -165, 7);
  // wheel ring
  x.beginPath(); x.arc(0, 0, 132, 0, TAU); line(30);
  x.save(); x.rotate(a);
  for (let i = 0; i < 4; i++) { x.save(); x.rotate(i * TAU / 4); seg(46, 0, 118, 0, 12); x.restore(); }
  for (let i = 0; i < 12; i++) { const an = i * TAU / 12; dot(Math.cos(an) * 132, Math.sin(an) * 132, 5.5, BK); }
  x.restore();
  // little blinking lights on the ring
  [[-.8, 0], [2.3, 1]].forEach(([an, i]) => { const on = cyc(t + i * 3, 40) < .4; dot(Math.cos(an) * 156, Math.sin(an) * 156, on ? 9 : 5); });
  // hub with a happy face
  dot(0, 0, 56, BK); dot(0, 0, 52);
  face(0, -2, .95, t, .4);
}

// 7. electric moon rover over little craters (lightning bolt sign, solar panel, no exhaust)
function rover(t) {
  // ground strip with craters scrolling left
  const off = cyc(t, 20) * 120;
  x.save(); x.beginPath(); x.rect(-185, 108, 370, 40); x.clip();
  x.fillStyle = WH; x.fillRect(-185, 114, 370, 30);
  for (let i = -1; i < 5; i++) { const cx = -180 + i * 120 - off + 60; ell(cx, 118, 26, 8, BK); x.beginPath(); x.ellipse(cx, 116, 32, 11, 0, Math.PI, TAU); line(3, BK); }
  x.restore();
  const bump = Math.abs(per(t, 40)) * 4;
  x.save(); x.translate(0, -bump);
  // solar panel on a mast
  seg(-60, -10, -60, -64, 7);
  x.save(); x.translate(-60, -76); x.rotate(-.15);
  rrect(-62, -16, 124, 30, 5); x.fillStyle = WH; x.fill(); for (let i = 1; i < 4; i++) seg(-62 + i * 31, -13, -62 + i * 31, 11, 3, BK);
  x.restore();
  // antenna with blinking tip
  seg(70, -10, 84, -92, 5); dot(84, -96, 7 + (cyc(t, 40) < .4 ? 3 : 0));
  // body
  rrect(-130, -14, 260, 76, 22); x.fillStyle = WH; x.fill();
  // lightning-bolt sign (electric)
  x.beginPath(); x.moveTo(-92, 2); x.lineTo(-108, 32); x.lineTo(-96, 32); x.lineTo(-104, 54); x.lineTo(-80, 22); x.lineTo(-92, 22); x.lineTo(-82, 2); x.closePath(); x.fillStyle = BK; x.fill();
  // big face in the middle
  dot(20, 22, 38, BK); dot(20, 22, 34);
  face(20, 18, .9, t, .9);
  // bumper
  seg(-120, 62, 120, 62, 5, BK);
  x.restore();
  // wheels with turning spokes
  [-88, 0, 88].forEach(wx => {
    dot(wx, 86, 31, BK); dot(wx, 86, 27);
    x.save(); x.translate(wx, 86); x.rotate(-spin(t, 40));
    for (let i = 0; i < 3; i++) { x.save(); x.rotate(i * TAU / 6); seg(-18, 0, 18, 0, 5, BK); x.restore(); }
    x.restore(); dot(wx, 86, 7, BK);
  });
}

// 8. telescope on a tripod finding twinkling sparkles
function telescope(t) {
  // tripod
  [[-100, 146], [0, 150], [100, 146]].forEach(([a, b]) => seg(0, 40, a, b, 12));
  ell(0, 40, 22, 16);
  const tl = -.45 + per(t, 10) * .05;
  x.save(); x.translate(0, 26); x.rotate(tl);
  // tube (slightly widening)
  x.beginPath(); x.moveTo(-120, -26); x.lineTo(110, -42); x.lineTo(110, 42); x.lineTo(-120, 26); x.closePath(); x.fillStyle = WH; x.fill();
  // eyepiece + lens rim
  rrect(-150, -16, 34, 32, 6); x.fill();
  rrect(104, -52, 26, 104, 10); x.fillStyle = WH; x.fill();
  seg(104, -46, 104, 46, 5, BK);
  // bands
  seg(-80, -26, -80, 26, 5, BK);
  x.restore();
  // face on the tube (kept upright)
  x.save(); x.translate(Math.cos(tl) * 0 - Math.sin(tl) * 0, 26); face(0, -2, .9, t, .7); x.restore();
  // sparkles twinkling in turn above the lens
  [[120, -120], [166, -70], [60, -150], [-20, -120]].forEach(([a, b], i) => {
    const k = cyc(t + i * 3, 30), g = Math.sin(k * Math.PI);
    sparkle(a, b, 6 + g * 16);
  });
  // a little star the telescope found
  x.save(); x.translate(150, -150); x.rotate(per(t, 10) * .2); star5(0, 0, 16, 7); x.fillStyle = WH; x.fill(); x.restore();
}

// 9. space puppy in a bubble helmet, paddling and wagging
function puppy(t) {
  const bob = per(t, 20) * 8;
  x.save(); x.translate(0, bob);
  // tail wagging
  const wg = per(t, 60) * .5;
  x.save(); x.translate(50, 100); x.rotate(-.2 + wg);
  x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(30, 0, 46, -30); line(14); dot(46, -32, 10); x.restore();
  // paws paddling
  [[-34, 0], [-12, 1], [14, 2], [36, 3]].forEach(([a, i]) => { const p = per(t + i * 2, 40) * 8; limb(a, 100, a + (a < 0 ? -6 : 6), 132 + p, 16); dot(a + (a < 0 ? -6 : 6), 136 + p, 12); });
  // little space suit body
  rrect(-56, 26, 112, 92, 34); x.fillStyle = WH; x.fill();
  rrect(-20, 52, 40, 26, 8); line(4, BK);
  dot(0, 65, 4, BK);
  // collar ring of the helmet
  ell(0, 26, 58, 14, BK); ell(0, 26, 54, 10);
  // floppy ears (black-edged)
  [-1, 1].forEach(d => { x.save(); x.translate(d * 54, -84); x.rotate(d * (-.25 + per(t + d * 3, 30) * .1));
    ell(0, 28, 20, 36, BK); ell(0, 28, 16, 32); x.beginPath(); x.ellipse(0, 32, 7, 18, 0, 0, TAU); line(3, BK); x.restore(); });
  // head
  dot(0, -60, 58, BK); dot(0, -60, 56);
  // muzzle, nose, face
  ell(0, -40, 30, 22, BK); ell(0, -40, 27, 19);
  ell(0, -50, 10, 7, BK);
  eye(-20, -72, 8, t, .5); eye(20, -72, 8, t, .8);
  x.beginPath(); x.moveTo(0, -44); x.lineTo(0, -36); line(4, BK);
  x.beginPath(); x.arc(-8, -36, 8, .2, Math.PI - .4); x.arc(8, -36, 8, .4, Math.PI - .2); line(4, BK);
  // little tongue
  ell(0, -25, 7, 8, BK); ell(0, -26, 4, 5);
  cheek(-36, -50, 6); cheek(36, -50, 6);
  // bubble helmet (thin ring + shine)
  x.beginPath(); x.arc(0, -52, 92, 0, TAU); line(5);
  x.beginPath(); x.arc(0, -52, 78, -2.6, -1.9); line(6);
  x.restore();
  // little bubbles rising
  for (let i = 0; i < 3; i++) { const k = cyc(t + i * 4, 24); x.save(); x.globalAlpha *= Math.sin(k * Math.PI);
    x.beginPath(); x.arc(110 + i * 14, 60 - k * 200, 6 + i * 2, 0, TAU); line(3); x.restore(); }
}

// 10. sleepy spiral galaxy slowly turning its arms of dots
function galaxy(t) {
  const a = -spin(t, 2);
  x.save(); x.rotate(a);
  for (let arm = 0; arm < 3; arm++) for (let j = 0; j < 22; j++) {
    const u = j / 21, r = 62 + u * 112, an = arm * TAU / 3 + u * 3.2;
    const tw = (per(t + j * 7 + arm * 13, 20) + 1) / 2;
    dot(Math.cos(an) * r, Math.sin(an) * r * .78, (7 - u * 4) * (.7 + .3 * tw));
  }
  x.restore();
  // a few twinkling sparkles between the arms
  [[-120, -120], [130, -100], [140, 120], [-150, 90]].forEach(([p, q], i) => sparkle(p, q, 6 + (per(t + i * 9, 24) + 1) * 4));
  // bright round middle with a happy, sleepy face
  dot(0, 0, 58, BK); dot(0, 0, 54);
  sleepyEye(-18, -6, 10, 5); sleepyEye(18, -6, 10, 5);
  cheek(-32, 12, 7); cheek(32, 12, 7);
  smile(0, 10, 12, 5);
}

// ---------- background ----------
function bg(t) {
  // cratered planet curve along the bottom (low, below the figures)
  x.save(); x.beginPath(); x.arc(480, 1640, 1130, 0, TAU); x.fillStyle = WH; x.fill(); x.clip();
  [[180, 528, 22], [330, 522, 16], [470, 520, 26], [610, 522, 14], [760, 528, 20], [560, 534, 9], [260, 536, 10], [860, 536, 12]].forEach(([a, b, r]) => {
    ell(a, b, r, r * .32, BK); x.beginPath(); x.ellipse(a, b - 2, r + 6, r * .4 + 3, 0, Math.PI, TAU); line(2.5, BK); });
  x.restore();
  // twinkling stars at the sides
  for (let i = 0; i < 26; i++) { const tw = (per(t + i * 9, 20 + (i % 5) * 4) + 1) / 2, side = i % 2 ? 1 : -1;
    const sx = 480 + side * (270 + hash(i + 71) * 180), sy = 22 + hash(i + 29) * 420;
    if (i % 3 === 0) { star5(sx, sy, 3 + tw * 5, 1.5 + tw * 2); x.fillStyle = WH; x.fill(); }
    else dot(sx, sy, 1.5 + tw * 2); }
  // tiny drifting space dots (slowly to the left, wrap seamlessly)
  for (let i = 0; i < 14; i++) { const n = 1 + (i % 3), sx = ((40 + hash(i + 3) * 1000 - cyc(t, n) * 1000) % 1000 + 1000) % 1000 - 20, sy = 40 + hash(i + 51) * 400;
    x.save(); x.globalAlpha *= .6; dot(sx, sy, 1.6 + (i % 2)); x.restore(); }
}

// outro: little astronaut asleep in a hammock between two sleepy stars
function sleepyEnd(t) {
  const sw = per(t, 10) * 6, br = per(t, 8) * 2;
  // two sleepy stars holding the hammock
  [[-220, -70, 1], [220, -70, -1]].forEach(([a, b, d], i) => {
    x.save(); x.translate(a, b); x.rotate(d * .12 + per(t + i * 5, 6) * .03);
    star5(0, 0, 62, 28); x.fillStyle = WH; x.fill();
    sleepyEye(-12, -2, 6, 4); sleepyEye(12, -2, 6, 4); smile(0, 10, 6, 3.5);
    x.restore(); });
  // hammock ropes + cloth
  const hy = 70 + sw;
  x.beginPath(); x.moveTo(-190, -50); x.quadraticCurveTo(-150, 0, -120, hy - 30); line(4);
  x.beginPath(); x.moveTo(190, -50); x.quadraticCurveTo(150, 0, 120, hy - 30); line(4);
  // sleeping astronaut lying in it (helmet left, boots right)
  x.save(); x.translate(0, hy - 46 + br);
  rrect(-50, -26, 130, 50, 24); x.fillStyle = WH; x.fill();
  ell(96, -10, 18, 22); ell(84, 4, 20, 18);
  dot(-76, -22, 50, BK); dot(-76, -22, 46);
  ell(-76, -20, 34, 30, BK); ell(-76, -20, 30, 26);
  sleepyEye(-88, -22, 7, 4); sleepyEye(-64, -22, 7, 4); cheek(-96, -8, 5); cheek(-56, -8, 5); smile(-76, -14, 7, 3.5);
  x.restore();
  // hammock cloth over the body, stripes
  x.beginPath(); x.moveTo(-130, hy - 32); x.quadraticCurveTo(0, hy + 70, 130, hy - 32); x.quadraticCurveTo(0, hy - 40, -130, hy - 32); x.closePath();
  x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-124, hy - 30); x.quadraticCurveTo(0, hy - 34, 124, hy - 30); line(4, BK);
  for (let i = -2; i <= 2; i++) { x.beginPath(); x.moveTo(i * 40, hy + 3 + (2 - Math.abs(i)) * 6); x.lineTo(i * 44, hy + 18 + (2 - Math.abs(i)) * 7); line(4, BK); }
  // z z z
  for (let i = 0; i < 3; i++) { const k = (t * .25 + i / 3) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k);
    x.font = C.FONT(28 + i * 8); x.fillStyle = WH; x.textAlign = 'center'; x.fillText('z', -100 + k * 20, -40 - k * 80); x.restore(); }
}

const TDY = +(process.env.THUMBDY || 0);   // thumbnail only: move the figure down below the title
const up = f => t => { x.translate(0, -24 + TDY); f(t); };
L.scene({
  seed: 232,
  figs: [[up(astronaut), .8, 'sway'], [up(alien), .82, 'sway'], [up(satellite), .82, 'sway'], [up(earth), .8, 'sway'], [up(ufo), .8, 'sway'],
         [up(station), .72, 'sway'], [up(rover), .8, 'sway'], [up(telescope), .78, 'sway'], [up(puppy), .78, 'sway'], [up(galaxy), .8, 'sway']],
  bg, end: up(sleepyEnd), scale: 1.3,
});
