// Daily B&W sensory #20: Bath Time – friendly white bath things with happy faces on black:
// a rubber duck bobbing on little waves (wing flaps, "squeak" rings now and then), a cluster of soap bubbles where the big smiling bubble
// floats and the little ones circle it (one gently pops and grows back), a bar of soap with a heart that slides and grows a foam crown,
// a toy sailing boat rocking on the waves with a striped sail and a waving flag, a striped towel hanging from a hook and swinging softly,
// a wind-up toy whale on little wheels (its key turns, a little fountain puffs from its back), a sponge full of holes that squishes and
// squeezes out drops, a bathtub on curly claw feet with a dripping tap and bubbles rising from its foam, a squeezy octopus bath toy in a
// little pompom cap that wiggles its stubby legs and squirts a tiny water arc, and a puffy star bath sponge slowly turning with sparkles.
// Background: a row of bath tiles along the bottom, twinkling stars, little bubbles rising at the sides.
// Outro: the rubber duck asleep on a stack of folded towels under a crescent moon, z z z.
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
// wavy water line from x0 to x1 at y
function waves(x0, x1, y, amp, ph, lw = 6) {
  x.beginPath(); for (let px = x0; px <= x1; px += 6) { const yy = y + Math.sin(px / 22 + ph) * amp; px === x0 ? x.moveTo(px, yy) : x.lineTo(px, yy); } line(lw);
}
function ring(cx, cy, r, lw = 5) { x.beginPath(); x.arc(cx, cy, r, 0, 7); line(lw); }
function bubble(cx, cy, r) {   // white ring + shine
  x.beginPath(); x.arc(cx, cy, r, 0, 7); line(Math.max(2.5, r * .12));
  x.beginPath(); x.arc(cx, cy, r * .65, -2.4, -1.5); line(Math.max(2, r * .1));
}
function drop(cx, cy, s, a = 1) {
  x.save(); x.globalAlpha *= a; x.translate(cx, cy); x.scale(s, s);
  x.beginPath(); x.moveTo(0, -12); x.quadraticCurveTo(9, 2, 7, 6); x.arc(0, 6, 7, 0, Math.PI); x.quadraticCurveTo(-9, 2, 0, -12); x.fillStyle = WH; x.fill(); x.restore();
}
function star5(cx, cy, R, r, rot = 0) {
  x.beginPath(); for (let j = 0; j < 10; j++) { const rr = j % 2 ? r : R, an = j * Math.PI / 5 - Math.PI / 2 + rot; x.lineTo(cx + Math.cos(an) * rr, cy + Math.sin(an) * rr); } x.closePath();
}

// 1. rubber duck bobbing on little waves
function duck(t) {
  const bob = per(t, 40) * 8, tilt = per(t, 20) * .05, sq = pulse(t, 16, .08);
  x.save(); x.translate(0, bob); x.rotate(tilt);
  // tail
  x.beginPath(); x.moveTo(-110, 20); x.quadraticCurveTo(-170, -40, -150, -60); x.quadraticCurveTo(-120, -10, -90, -10); x.closePath(); x.fillStyle = WH; x.fill();
  // body
  x.beginPath(); x.moveTo(-130, 30); x.quadraticCurveTo(-130, 110, 0, 112); x.quadraticCurveTo(130, 110, 130, 40); x.quadraticCurveTo(110, -10, 40, 0); x.lineTo(-90, -10); x.quadraticCurveTo(-130, 0, -130, 30); x.fillStyle = WH; x.fill();
  // wing (flaps)
  const wf = per(t, 60) * .15;
  x.save(); x.translate(-30, 40); x.rotate(-.1 + wf);
  x.beginPath(); x.moveTo(-50, -10); x.quadraticCurveTo(-10, 50, 50, 10); x.quadraticCurveTo(10, -10, -50, -10); outline(6);
  x.beginPath(); x.moveTo(-20, 8); x.quadraticCurveTo(0, 20, 22, 12); outline(4); x.restore();
  // head
  dot(60, -70, 70);
  // little hair curl on top
  x.beginPath(); x.moveTo(50, -138); x.quadraticCurveTo(66, -170, 84, -150); x.quadraticCurveTo(70, -150, 70, -138); line(7);
  eye(40, -84, 11, t); eye(84, -84, 11, t, .3); cheek(30, -56, 8); cheek(96, -60, 8);
  // beak: flat duck bill, outlined, opens on squeak
  x.save(); x.translate(118, -56);
  x.beginPath(); x.moveTo(-12, -10); x.quadraticCurveTo(40, -24 - sq * 6, 52, -6 - sq * 6); x.quadraticCurveTo(30, 2, -12, 2); x.closePath(); x.fillStyle = WH; x.fill(); outline(5);
  x.beginPath(); x.moveTo(-10, 4); x.quadraticCurveTo(30, 6 + sq * 10, 46, 8 + sq * 12); x.quadraticCurveTo(24, 22 + sq * 8, -10, 16); x.closePath(); x.fillStyle = WH; x.fill(); outline(5);
  dot(20, -10, 3, BK);
  x.restore();
  x.restore();
  // squeak rings
  if (sq > 0) for (let i = 0; i < 3; i++) { x.save(); x.globalAlpha *= sq; x.beginPath(); x.arc(180, -60 + bob, 20 + i * 16, -.7, .7); line(5); x.restore(); }
  // water
  waves(-190, 190, 120, 7, t * TAU * 12 / P, 7);
  waves(-150, 150, 146, 5, -t * TAU * 8 / P + 1, 5);
}

// 2. bubble cluster: big smiling bubble, little ones circling
function bubbles(t) {
  const fy = per(t, 30) * 10;
  x.save(); x.translate(0, fy);
  // big bubble with face
  x.beginPath(); x.arc(0, 0, 110, 0, 7); line(10);
  x.beginPath(); x.arc(0, 0, 84, -2.5, -1.6); line(8);
  dot(-58, -50, 9);
  eye(-34, -10, 12, t); eye(34, -10, 12, t, .2);
  x.save(); x.beginPath(); x.arc(0, 20, 26, .25, Math.PI - .25); line(7); x.restore();
  x.save(); x.globalAlpha *= .5; dot(-62, 22, 9); dot(62, 22, 9); x.restore();
  x.restore();
  // little bubbles circling (one pops and grows back)
  for (let i = 0; i < 6; i++) {
    const an = TAU * (i / 6) + TAU * 4 * t / P, rx = 160, ry = 120;
    const bx = Math.cos(an) * rx, by = Math.sin(an) * ry + fy * .5;
    let r = 16 + (i % 3) * 8;
    if (i === 2) {
      const k = cyc(t, 12);
      if (k < .06) { const p = k / .06; x.save(); x.globalAlpha *= 1 - p;
        for (let j = 0; j < 8; j++) { const a2 = j * TAU / 8; x.beginPath(); x.moveTo(bx + Math.cos(a2) * r * (1 + p), by + Math.sin(a2) * r * (1 + p)); x.lineTo(bx + Math.cos(a2) * r * (1.3 + p * 1.2), by + Math.sin(a2) * r * (1.3 + p * 1.2)); line(4); }
        x.restore(); continue; }
      r *= Math.min(1, (k - .06) / .12);
      if (r < 1) continue;
    }
    bubble(bx, by, r);
  }
}

// 3. bar of soap with a heart and a foam crown
function soap(t) {
  const sl = per(t, 20) * 26, foam = (per(t, 10) + 1) / 2;
  x.save(); x.translate(sl, 20); x.rotate(per(t, 20) * .04);
  // soft shadow-ish puddle lines
  waves(-170, 170, 104, 4, t * TAU * 6 / P, 5);
  rrect(-140, -60, 280, 150, 56); x.fillStyle = WH; x.fill();
  rrect(-118, -42, 236, 114, 44); outline(5);
  // engraved heart
  x.save(); x.translate(-70, 12); x.scale(.9, .9);
  x.beginPath(); x.moveTo(0, 18); x.bezierCurveTo(-34, -6, -20, -36, 0, -20); x.bezierCurveTo(20, -36, 34, -6, 0, 18); outline(5); x.restore();
  eye(20, 0, 11, t); eye(70, 0, 11, t, .25); cheek(4, 26, 7); cheek(90, 26, 7);
  x.beginPath(); x.arc(45, 22, 18, .3, Math.PI - .3); line(6, BK);
  // foam crown
  const fc = [[-100, -66, 22], [-60, -78, 30], [-14, -84, 34], [34, -80, 30], [78, -70, 26], [112, -58, 18], [-36, -110, 22], [16, -118, 24], [62, -104, 18]];
  fc.forEach(([fx, fy, r], i) => {
    const g = i < 6 ? 1 : foam;
    if (g < .15) return;
    const rr = r * (.85 + .15 * per(t + i * 7, 30)) * g;
    dot(fx, fy, rr); x.beginPath(); x.arc(fx, fy, rr, 3.4, 5.6); line(3.5, BK);
  });
  x.restore();
  // tiny bubbles leaving the foam
  for (let i = 0; i < 4; i++) { const k = cyc(t + i * 3.3, 24); if (k < .4) { const q = k / .4; x.save(); x.globalAlpha *= Math.sin(Math.PI * q); bubble(sl - 60 + i * 40 + Math.sin(q * 6 + i) * 10, -90 - q * 120, 7 + i % 2 * 3); x.restore(); } }
}

// 4. toy sailing boat rocking on waves
function boat(t) {
  const rock = per(t, 24) * .08, bob = per(t, 48) * 6;
  x.save(); x.translate(0, bob); x.rotate(rock);
  // mast + striped sail
  x.beginPath(); x.moveTo(0, 40); x.lineTo(0, -190); line(8);
  x.beginPath(); x.moveTo(8, -180); x.lineTo(8, 20); x.lineTo(120, 20); x.closePath(); x.fillStyle = WH; x.fill();
  for (let i = 1; i < 4; i++) { const yy = -180 + i * 50; x.save(); x.beginPath(); x.moveTo(8, -180); x.lineTo(8, 20); x.lineTo(120, 20); x.closePath(); x.clip();
    x.fillStyle = BK; x.fillRect(8, yy, 130, 16); x.restore(); }
  x.beginPath(); x.moveTo(-8, -150); x.lineTo(-8, 20); x.lineTo(-90, 20); x.closePath(); x.fillStyle = WH; x.fill();
  // waving flag
  const fw = per(t, 120) * 6;
  x.beginPath(); x.moveTo(0, -190); x.quadraticCurveTo(24, -200 + fw, 46, -192); x.quadraticCurveTo(24, -176 - fw, 0, -170); x.closePath(); x.fillStyle = WH; x.fill();
  // hull
  x.beginPath(); x.moveTo(-160, 30); x.lineTo(160, 30); x.quadraticCurveTo(140, 110, 90, 116); x.lineTo(-90, 116); x.quadraticCurveTo(-140, 110, -160, 30); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-150, 50); x.lineTo(150, 50); line(5, BK);
  // portholes as eyes
  x.beginPath(); x.arc(-40, 78, 18, 0, 7); line(4, BK); x.beginPath(); x.arc(40, 78, 18, 0, 7); line(4, BK);
  eye(-40, 78, 9, t); eye(40, 78, 9, t, .3);
  x.beginPath(); x.arc(0, 90, 12, .3, Math.PI - .3); line(5, BK);
  cheek(-80, 92, 7); cheek(80, 92, 7);
  x.restore();
  waves(-200, 200, 128, 8, t * TAU * 10 / P, 7);
  waves(-170, 170, 154, 6, -t * TAU * 8 / P, 5);
}

// 5. striped towel hanging from a hook
function towel(t) {
  x.translate(0, 18);
  // rail + hook
  x.beginPath(); x.moveTo(-150, -170); x.lineTo(150, -170); line(10);
  dot(-150, -170, 10); dot(150, -170, 10);
  x.beginPath(); x.moveTo(0, -170); x.lineTo(0, -150); x.arc(0, -134, 16, -Math.PI / 2, Math.PI * .9); line(7);
  const sw = per(t, 16) * .06;
  x.save(); x.translate(0, -118); x.rotate(sw);
  // towel body (folded over the hook): top drape + long part
  x.beginPath(); x.moveTo(-26, 0); x.lineTo(26, 0); x.lineTo(110, 50); x.lineTo(110, 290); x.quadraticCurveTo(0, 300, -110, 290); x.lineTo(-110, 50); x.closePath(); x.fillStyle = WH; x.fill();
  // stripes near the bottom
  [236, 256].forEach(yy => { x.beginPath(); x.moveTo(-110, yy); x.quadraticCurveTo(0, yy + 8, 110, yy); line(9, BK); });
  // fringe
  for (let i = 0; i < 12; i++) { const fx = -100 + i * 18.2, k = per(t + i * .4, 32) * 3; x.beginPath(); x.moveTo(fx, 292); x.lineTo(fx + k, 312); line(4); }
  // fold line
  x.beginPath(); x.moveTo(-110, 50); x.quadraticCurveTo(0, 70, 110, 50); line(5, BK);
  eye(-34, 130, 12, t); eye(34, 130, 12, t, .2); cheek(-60, 160, 8); cheek(60, 160, 8);
  x.beginPath(); x.arc(0, 152, 22, .3, Math.PI - .3); line(6, BK);
  // little dots pattern
  [[-70, 100], [70, 100], [-70, 200], [70, 200], [0, 206]].forEach(([a, b]) => dot(a, b, 6, BK));
  x.restore();
}

// 6. wind-up toy whale on wheels, key turning, fountain puffing
function whaleToy(t) {
  const roll = per(t, 20) * 30, spin = TAU * 30 * t / P;
  x.save(); x.translate(roll, 30);
  // fountain
  const fp = (per(t, 30) + 1) / 2;
  x.beginPath(); x.moveTo(-10, -86); x.quadraticCurveTo(-14, -120 - fp * 30, -50, -130 - fp * 30); line(6);
  x.beginPath(); x.moveTo(10, -86); x.quadraticCurveTo(14, -120 - fp * 30, 50, -130 - fp * 30); line(6);
  for (let i = 0; i < 5; i++) drop(-56 + i * 28, -150 - fp * 34 - (i % 2) * 14, .9);
  // body
  x.beginPath(); x.moveTo(-150, 10); x.quadraticCurveTo(-150, -90, -10, -90); x.quadraticCurveTo(130, -90, 140, 10); x.quadraticCurveTo(130, 70, 0, 70); x.quadraticCurveTo(-150, 70, -150, 10); x.fillStyle = WH; x.fill();
  // tail (behind on the left)
  x.save(); x.translate(-150, 0); x.rotate(per(t, 24) * .15);
  x.beginPath(); x.moveTo(10, 0); x.quadraticCurveTo(-40, -10, -60, -50); x.quadraticCurveTo(-30, -20, -20, 0); x.quadraticCurveTo(-30, 20, -60, 40); x.quadraticCurveTo(-40, 10, 10, 10); x.closePath(); x.fillStyle = WH; x.fill(); x.restore();
  // belly stripes
  for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(-50 + i * 32, 40); x.lineTo(-40 + i * 32, 66); line(5, BK); }
  // toy seam + fin
  x.beginPath(); x.moveTo(-140, 10); x.quadraticCurveTo(0, 26, 138, 6); line(4, BK);
  x.beginPath(); x.moveTo(-10, 30); x.quadraticCurveTo(10, 60, 40, 46); line(5, BK);
  eye(70, -26, 11, t); cheek(96, 0, 7);
  x.beginPath(); x.arc(110, 10, 16, .4, Math.PI - .2); line(5, BK);
  // wind-up key on top
  x.save(); x.translate(-50, -92); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -26); line(8);
  x.translate(0, -30); x.scale(Math.cos(spin), 1);
  ell(-24, 0, 22, 14); ell(24, 0, 22, 14); dot(0, 0, 8);
  x.restore();
  // wheels
  [-80, 60].forEach(wx => { dot(wx, 80, 22); dot(wx, 80, 8, BK);
    x.save(); x.translate(wx, 80); x.rotate(roll / 22); x.beginPath(); x.moveTo(-16, 0); x.lineTo(16, 0); x.moveTo(0, -16); x.lineTo(0, 16); line(3, BK); x.restore(); });
  x.restore();
  x.beginPath(); x.moveTo(-200, 134); x.lineTo(200, 134); line(5);
}

// 7. sponge full of holes that squishes and squeezes out drops
function sponge(t) {
  const sq = pulse(t, 20, .2), h = 200 * (1 - .18 * sq), w = 260 * (1 + .08 * sq);
  x.save(); x.translate(0, 110);
  rrect(-w / 2, -h, w, h, 36); x.fillStyle = WH; x.fill();
  // holes
  const holes = [[-.38, .15, 12, 8], [-.2, .1, 7, 5], [.3, .12, 10, 7], [.4, .3, 6, 5], [-.4, .5, 8, 6], [-.32, .82, 10, 7], [.36, .78, 12, 8], [.12, .9, 7, 5], [-.1, .86, 6, 4], [.42, .55, 7, 5], [0, .14, 6, 5]];
  holes.forEach(([hx, hy, rx, ry]) => ell(hx * w, -hy * h, rx, ry * (1 - .2 * sq), BK));
  // face
  const fy = -h * .5;
  eye(-38, fy - 4, 12, t); eye(38, fy - 4, 12, t, .3); cheek(-64, fy + 22, 8); cheek(64, fy + 22, 8);
  x.beginPath(); x.arc(0, fy + 16, 20 + sq * 4, .3, Math.PI - .3); line(6, BK);
  // squeezing hands? -> little squeeze lines at the sides
  if (sq > .1) [-1, 1].forEach(d => { x.save(); x.globalAlpha *= sq; for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(d * (w / 2 + 14), -h * .3 - i * 30); x.lineTo(d * (w / 2 + 36), -h * .3 - i * 30 - 6); line(5); } x.restore(); });
  x.restore();
  // drops falling out
  for (let i = 0; i < 4; i++) { const k = cyc(t + i * .5, 20); if (k < .25) { const q = k / .25; drop(-60 + i * 40, 120 + q * 50, 1, Math.sin(Math.PI * q)); } }
  waves(-170, 170, 178, 5, t * TAU * 6 / P, 5);
}

// 8. bathtub on claw feet, dripping tap, rising bubbles
function tub(t) {
  // tap on the left
  x.beginPath(); x.moveTo(-170, 40); x.lineTo(-170, -90); x.quadraticCurveTo(-170, -120, -140, -120); x.lineTo(-110, -120); x.lineTo(-110, -96); line(12);
  ell(-170, -60, 20, 8);
  const dk = cyc(t, 40); drop(-110, -86 + dk * 120, 1, Math.min(1, (1 - dk) * 3));
  // foam on top
  const fm = [[-120, -20, 30], [-78, -38, 36], [-26, -46, 40], [28, -44, 38], [80, -36, 34], [124, -22, 28], [-50, -74, 26], [8, -82, 28], [60, -70, 22]];
  fm.forEach(([fx, fy, r], i) => { const rr = r * (.9 + .1 * per(t + i * 5, 24)); dot(fx, fy, rr); x.beginPath(); x.arc(fx, fy, rr, 3.4, 5.6); line(3.5, BK); });
  // tub body
  x.beginPath(); x.moveTo(-170, -10); x.lineTo(170, -10); x.quadraticCurveTo(170, 110, 60, 116); x.lineTo(-60, 116); x.quadraticCurveTo(-170, 110, -170, -10); x.closePath(); x.fillStyle = WH; x.fill();
  rrect(-186, -24, 372, 26, 13); x.fillStyle = WH; x.fill(); x.beginPath(); x.moveTo(-180, 4); x.lineTo(180, 4); line(4, BK);
  // claw feet
  [-110, 110].forEach(fx => { x.save(); x.translate(fx, 114);
    x.beginPath(); x.moveTo(-14, 0); x.quadraticCurveTo(-18, 26, -34, 34); x.quadraticCurveTo(-14, 40, 0, 30); x.quadraticCurveTo(14, 40, 34, 34); x.quadraticCurveTo(18, 26, 14, 0); x.closePath(); x.fillStyle = WH; x.fill(); x.restore(); });
  // face
  eye(-44, 40, 12, t); eye(44, 40, 12, t, .25); cheek(-80, 70, 8); cheek(80, 70, 8);
  x.beginPath(); x.arc(0, 62, 22, .3, Math.PI - .3); line(6, BK);
  // rising bubbles
  for (let i = 0; i < 6; i++) { const k = cyc(t + i * 1.7, 16 + (i % 3) * 4); const q = k; x.save(); x.globalAlpha *= Math.sin(Math.PI * q);
    bubble(-100 + i * 40 + Math.sin(q * 8 + i) * 12, -90 - q * 110, 8 + (i % 3) * 4); x.restore(); }
}

// 9. squeezy octopus bath toy in a pompom cap
function octoToy(t) {
  const sq = pulse(t, 24, .15);
  // legs: 6 stubby rounded legs, wiggling
  for (let i = 0; i < 6; i++) {
    const lx = -110 + i * 44, wig = per(t + i * 2.3, 40) * 10;
    x.beginPath(); x.moveTo(lx, 40); x.quadraticCurveTo(lx + wig, 100, lx + wig * 1.6 + (i < 3 ? -10 : 10), 140); line(30);
    for (let j = 0; j < 2; j++) dot(lx + wig * (.7 + j * .5) + (i < 3 ? -4 : 4) * j, 92 + j * 26, 5, BK);
  }
  // body (squishes)
  x.save(); x.scale(1 + .08 * sq, 1 - .1 * sq);
  ell(0, -10, 130, 104);
  // band of dots like a toy
  for (let i = 0; i < 7; i++) dot(-90 + i * 30, 50, 6, BK);
  eye(-40, -10, 13, t); eye(40, -10, 13, t, .2); cheek(-74, 18, 9); cheek(74, 18, 9);
  // little "o" mouth when squirting, smile otherwise
  if (sq > .2) ring(0, 22, 10 * sq + 4, 5); else { x.beginPath(); x.arc(0, 14, 20, .3, Math.PI - .3); line(6, BK); }
  x.restore();
  // pompom cap
  x.beginPath(); x.moveTo(-70, -96); x.quadraticCurveTo(0, -170, 70, -96); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-74, -96); x.quadraticCurveTo(0, -118, 74, -96); line(6, BK);
  for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(-40 + i * 40, -102 - (i === 1 ? 6 : 0)); x.lineTo(-30 + i * 30, -140); line(4, BK); }
  dot(0, -150, 18); x.beginPath(); x.arc(0, -150, 18, 3.5, 5.6); line(3, BK);
  // water arc squirt
  if (sq > 0) { x.save(); x.globalAlpha *= sq; for (let i = 0; i < 6; i++) { const k = i / 5; drop(110 + k * 70, -60 - Math.sin(k * Math.PI) * 60 + k * 40, .7); } x.restore(); }
}

// 10. puffy star bath sponge slowly turning with sparkles
function starToy(t) {
  const rot = per(t, 8) * .25, pf = 1 + per(t, 30) * .04;
  x.save(); x.scale(pf, pf); x.rotate(rot);
  x.lineJoin = 'round';
  star5(0, 10, 150, 72); x.fillStyle = WH; x.fill(); x.lineWidth = 26; x.strokeStyle = WH; x.stroke();
  // sponge dots
  [[-80, -10], [80, -10], [0, -100], [-56, 90], [56, 90], [-30, -50], [30, -50], [0, 110]].forEach(([a, b], i) => dot(a, b, 4 + (i % 3), BK));
  eye(-32, 0, 12, t); eye(32, 0, 12, t, .3); cheek(-56, 28, 8); cheek(56, 28, 8);
  x.beginPath(); x.arc(0, 22, 20, .3, Math.PI - .3); line(6, BK);
  x.restore();
  // sparkles around
  for (let i = 0; i < 5; i++) { const an = TAU * i / 5 + TAU * 2 * t / P, tw = (per(t + i * 7, 40) + 1) / 2;
    star5(Math.cos(an) * 200, Math.sin(an) * 160, 6 + tw * 8, 3 + tw * 3); x.fillStyle = WH; x.fill(); }
}

// ---------- background ----------
function bg(t) {
  // a row of bath tiles along the bottom (checker of filled / outlined squares)
  const ts = 28, y0 = 512;
  for (let i = 0; i * ts < W0 + ts; i++) {
    const tx = i * ts;
    if (i % 2) { x.fillStyle = WH; x.fillRect(tx + 2, y0 + 2, ts - 4, ts - 4); dot(tx + ts / 2, y0 + ts / 2, 3.5, BK); }
    else { x.beginPath(); x.rect(tx + 3, y0 + 3, ts - 6, ts - 6); line(2.5); }
  }
  x.beginPath(); x.moveTo(0, y0 - 4); x.lineTo(W0, y0 - 4); line(3);
  // twinkling stars at the top (not behind the figure)
  for (let i = 0; i < 12; i++) { const tw = (per(t + i * 9, 20 + (i % 5) * 4) + 1) / 2, sx = 30 + hash(i + 53) * 900, sy = 20 + hash(i + 19) * 70;
    if (sx > 300 && sx < 720) continue;
    star5(sx, sy, 4 + tw * 5, 2 + tw * 2); x.fillStyle = WH; x.fill(); }
  // little bubbles rising at the sides
  for (let i = 0; i < 8; i++) { const k = cyc(t + i * 30, 6 + (i % 3) * 2), side = i % 2, sx = (side ? 870 : 90) + Math.sin(k * TAU * 2 + i) * 26 + (i % 4 > 1 ? 30 : -30) * (side ? 1 : -1) * .5,
    sy = 470 - k * 360; x.save(); x.globalAlpha = .8 * Math.sin(Math.PI * k); bubble(sx, sy, 7 + (i % 3) * 4); x.restore(); }
}

// outro: the rubber duck asleep on a stack of folded towels under a crescent moon
function sleepyEnd(t) {
  x.save(); x.translate(220, -150); dot(0, 0, 36); dot(14, -8, 32, BK); x.restore();
  // towel stack (3 folded towels)
  [[0, 120, 260], [6, 80, 236], [-4, 42, 214]].forEach(([ox, ty, w], i) => {
    rrect(ox - w / 2, ty - 18, w, 40, 18); x.fillStyle = WH; x.fill();
    x.beginPath(); x.moveTo(ox - w / 2 + 18, ty + 6); x.lineTo(ox + w / 2 - 18, ty + 6); line(4, BK);
    if (i === 0) for (let j = 0; j < 6; j++) dot(ox - 90 + j * 36, ty - 4, 4, BK);
  });
  const br = per(t, 8) * 3;
  x.save(); x.translate(0, br);
  // sleeping duck
  x.beginPath(); x.moveTo(-90, 10); x.quadraticCurveTo(-140, -30, -128, -50); x.quadraticCurveTo(-100, -20, -70, -18); x.closePath(); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-100, 0); x.quadraticCurveTo(-100, 24, 0, 24); x.quadraticCurveTo(100, 24, 100, -4); x.quadraticCurveTo(80, -40, 30, -34); x.lineTo(-70, -36); x.quadraticCurveTo(-100, -30, -100, 0); x.fillStyle = WH; x.fill();
  x.beginPath(); x.moveTo(-50, -14); x.quadraticCurveTo(-10, 10, 30, -6); line(5, BK);
  dot(44, -80, 50);
  sleepyEye(28, -86, 9); sleepyEye(62, -86, 9); cheek(22, -66, 6); cheek(70, -66, 6);
  x.beginPath(); x.moveTo(86, -72); x.quadraticCurveTo(118, -82, 124, -66); x.quadraticCurveTo(110, -56, 86, -60); x.closePath(); x.fillStyle = WH; x.fill(); outline(4);
  x.restore();
  for (let i = 0; i < 3; i++) { const k = (t * .25 + i / 3) % 1; x.save(); x.globalAlpha *= Math.sin(Math.PI * k);
    x.font = C.FONT(30 + i * 8); x.fillStyle = WH; x.textAlign = 'center'; x.fillText('z', 120 + k * 30, -140 - k * 90); x.restore(); }
}

const TDY = +(process.env.THUMBDY || 0);   // thumbnail only: move the figure down below the title
const up = f => t => { x.translate(0, -24 + TDY); f(t); };
L.scene({
  seed: 203,
  figs: [[up(duck), .8, 'sway'], [up(bubbles), .78, 'sway'], [up(soap), .8, 'sway'], [up(boat), .78, 'sway'], [up(towel), .76, 'sway'],
         [up(whaleToy), .8, 'sway'], [up(sponge), .8, 'sway'], [up(tub), .8, 'sway'], [up(octoToy), .8, 'sway'], [up(starToy), .78, 'sway']],
  bg, end: up(sleepyEnd), scale: 1.3,
});
