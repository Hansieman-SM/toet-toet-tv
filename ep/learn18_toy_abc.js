// Learning series – ABC #6: Toy ABC with The Big Four.
// A cosy toy corner on the savanna: a big open wooden toy chest and a round striped play rug in front of the friends.
// Per letter (5 s): alphabet strip at the top lights the current letter, a toy letter block (upper + lower case, wooden block
// with little corner pegs), a picture card with a gently moving original toy drawing (every toy has eyes + a smile) and a word card
// with the coloured first letter; one of the Big Four says "A is for Airplane!" (Ella, Leo, Nico, Boris take turns), a soft
// chime + a matching toy sound now and then, and a little copy of the toy hops out of the chest onto the rug, so the rug fills up.
// Recap: 26 tiles with letter + toy light up one by one, "Well done!"; goodbye with all toys on the rug.
// New music: toyabc_long (wind-up-toy shuffle in A-flat: kalimba lead, clockwork tick-tock, toy tom, string pad, spring boing + bell tree).
const C = require('../lib/common'), S = require('../lib/safari');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, rr, circ, ell, hash, INK } = C;

const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SEG = 5;
const CHIME = ['G#4', 'A#4', 'C5', 'D#5', 'F5', 'G#5', 'C6'];
const ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
const FR = { elephant: [102, .58, true], lion: [232, .62, true], rhino: [738, .62, false], buffalo: [858, .6, false] };
const ORDER = ['elephant', 'lion', 'rhino', 'buffalo'];

// ---------- helpers ----------
const st = (lw = 3.5) => { x.lineWidth = lw; x.strokeStyle = INK; x.lineJoin = 'round'; x.lineCap = 'round'; };
const box = (a, b, w, h, r, col, lw = 3.5) => { x.fillStyle = col; st(lw); rr(a, b, w, h, r); x.fill(); x.stroke(); };
const poly = (pts, col, lw = 3) => { x.fillStyle = col; st(lw); x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); x.fill(); if (lw) x.stroke(); };
const line = (pts, lw = 3, col = INK) => { x.strokeStyle = col; x.lineWidth = lw; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.stroke(); };
const eyes = (ax, ay, bx, by, r, t, off = 0) => {
  const bl = ((t + off) % 3.6) > 3.45;
  [[ax, ay], [bx, by]].forEach(([a, b]) => { if (bl) { x.beginPath(); x.moveTo(a - r, b); x.lineTo(a + r, b); st(2.5); x.stroke(); } else { circ(a, b, r, INK); circ(a + r * .3, b - r * .35, r * .36, '#fff'); } });
};
const smile = (cx, cy, r, lw = 2.5) => { x.beginPath(); x.arc(cx, cy, r, .3, Math.PI - .3); st(lw); x.stroke(); };
const cheek = (cx, cy, r = 4) => circ(cx, cy, r, 'rgba(255,110,140,.45)');
const face = (cx, cy, s, t, off = 0) => { eyes(cx - 10 * s, cy, cx + 10 * s, cy, 4 * s, t, off); smile(cx, cy + 5 * s, 6 * s, 2.5); cheek(cx - 17 * s, cy + 6 * s, 3.5 * s); cheek(cx + 17 * s, cy + 6 * s, 3.5 * s); };
const wheel = (cx, cy, r, rot = 0, col = '#3a3f4b') => { circ(cx, cy, r, col, INK, 3); circ(cx, cy, r * .45, '#e0e0e0', INK, 2);
  x.save(); x.translate(cx, cy); x.rotate(rot); st(2); x.beginPath(); x.moveTo(-r * .45, 0); x.lineTo(r * .45, 0); x.stroke(); x.restore(); };
const note = (cx, cy, s, a) => { x.save(); x.globalAlpha *= a; x.fillStyle = INK; x.beginPath(); x.ellipse(cx, cy, 6 * s, 4.5 * s, -.4, 0, 7); x.fill(); x.fillRect(cx + 4.5 * s, cy - 22 * s, 2.5 * s, 22 * s); x.restore(); };

// ---------- 26 original toy pictures (centred on 0,0, inside a ±95 x ±85 card area) ----------
const V = {
  airplane(t) {   // little toy plane with a turning propeller, bobbing
    const b = Math.sin(t * 2) * 5; x.save(); x.translate(0, b);
    poly([[-10, -6], [26, -6], [6, -44], [-6, -44]], '#3a86ff');            // top wing
    box(-62, -16, 120, 38, 19, '#ff5d5d'); poly([[-58, -10], [-74, -40], [-56, -40], [-40, -12]], '#ff5d5d');
    poly([[-8, 12], [26, 12], [6, 46], [-6, 46]], '#3a86ff');
    [[-20, -6], [0, -6]].forEach(([a, bb]) => circ(a, bb, 6, '#bde0fe', INK, 2.5));
    circ(60, 3, 7, '#ffd23f', INK, 2.5);
    const s = Math.cos(t * 18); x.fillStyle = 'rgba(29,53,87,.7)'; rr(64, 3 - 30 * Math.abs(s), 6, 60 * Math.abs(s) + 1, 3); x.fill();
    eyes(26, -4, 42, -4, 3.5, t); smile(34, 6, 5); cheek(22, 8, 3); x.restore();
  },
  ball(t) {   // striped beach-ball, bouncing with a little squash
    const k = Math.abs(Math.sin(t * 3)), y = -k * 30 + 12, sq = k < .15 ? 1 - (.15 - k) * 1.2 : 1;
    ell(0, 62, 40 - k * 14, 6, 'rgba(0,0,0,.15)', null);
    x.save(); x.translate(0, y); x.scale(1 / sq, sq);
    circ(0, 0, 46, '#ffffff', INK, 3.5);
    x.save(); x.beginPath(); x.arc(0, 0, 46, 0, 7); x.clip();
    [['#e63946', -1.4], ['#ffd23f', -.47], ['#3a86ff', .47], ['#2a9d8f', 1.4]].forEach(([c2, a]) => { x.fillStyle = c2; x.beginPath(); x.ellipse(Math.sin(a) * 30, 0, 12, 48, 0, 0, 7); x.fill(); });
    x.restore(); circ(0, 0, 46, null, INK, 3.5); face(0, 0, .9, t, .4); x.restore();
  },
  car(t) {   // small red toy car rolling back and forth
    const dx = Math.sin(t * 1.5) * 12; x.save(); x.translate(dx, 0);
    ell(0, 50, 70, 6, 'rgba(0,0,0,.12)', null);
    poly([[-36, -10], [-22, -44], [24, -44], [40, -10]], '#ffb703');
    poly([[-26, -14], [-16, -38], [-2, -38], [-2, -14]], '#bde0fe', 2.5); poly([[4, -14], [4, -38], [20, -38], [30, -14]], '#bde0fe', 2.5);
    box(-70, -14, 140, 46, 18, '#e63946');
    wheel(-40, 34, 16, dx / 16); wheel(40, 34, 16, dx / 16);
    circ(64, 0, 5, '#fff3b0', INK, 2); face(0, 6, .9, t, 1); x.restore();
  },
  drum(t) {   // toy drum with tapping sticks
    const tap = Math.max(0, Math.sin(t * 6)), tap2 = Math.max(0, Math.sin(t * 6 + Math.PI));
    box(-56, -20, 112, 70, 10, '#e63946');
    st(2.5); x.beginPath(); for (let i = 0; i <= 6; i++) { const a = -56 + i * 112 / 6; x.lineTo(a, i % 2 ? 44 : -14); } x.strokeStyle = '#ffd23f'; x.lineWidth = 4; x.stroke();
    ell(0, -20, 56, 14, '#fff8ec', INK, 3.5); box(-58, 40, 116, 10, 5, '#ffd23f', 2.5); box(-58, -16, 116, 8, 4, '#ffd23f', 2.5);
    x.save(); x.translate(-30, -36); x.rotate(-.5 - tap * .4); line([[0, 0], [-34, -30]], 5, '#a0673f'); circ(-34, -30, 6, '#ffd23f', INK, 2); x.restore();
    x.save(); x.translate(30, -36); x.rotate(.5 + tap2 * .4); line([[0, 0], [34, -30]], 5, '#a0673f'); circ(34, -30, 6, '#ffd23f', INK, 2); x.restore();
    face(0, 14, .9, t, 1.6);
  },
  elephantplush(t) {   // soft grey-pink elephant plush, trunk swaying
    const sw = Math.sin(t * 2) * .2;
    ell(0, 56, 58, 6, 'rgba(0,0,0,.12)', null);
    ell(0, 26, 44, 30, '#c7b8d8', INK, 3.5); [-26, 26].forEach(a => ell(a, 50, 12, 9, '#c7b8d8', INK, 3));
    ell(-38, -16, 22, 26, '#e7c6dd', INK, 3); ell(38, -16, 22, 26, '#e7c6dd', INK, 3);
    circ(0, -14, 34, '#c7b8d8', INK, 3.5);
    x.save(); x.translate(0, 2); x.rotate(sw); x.fillStyle = '#c7b8d8'; st(3.5); x.beginPath(); x.moveTo(-9, 0); x.quadraticCurveTo(-12, 30, 4, 40); x.lineTo(14, 34); x.quadraticCurveTo(4, 26, 9, 0); x.closePath(); x.fill(); x.stroke(); x.restore();
    eyes(-13, -22, 13, -22, 4, t, .9); cheek(-20, -6); cheek(20, -6);
    line([[-14, 30], [-10, 26], [-6, 30], [-2, 26]], 2, 'rgba(29,53,87,.5)');   // stitched patch
  },
  flute(t) {   // little wooden recorder-flute with notes floating up
    x.save(); x.rotate(-.35);
    box(-80, -12, 160, 24, 12, '#d9a066'); box(-86, -14, 22, 28, 8, '#b5793c', 3);
    [-30, -10, 10, 30, 50].forEach(a => circ(a, -1, 4.5, INK));
    eyes(-50, -2, -38, -2, 3, t, 2); x.restore();
    for (let i = 0; i < 3; i++) { const k = (t * .5 + i / 3) % 1; note(20 + i * 22 + Math.sin(t * 2 + i) * 6, -20 - k * 50, .9, 1 - k); }
  },
  guitar(t) {   // small toy guitar with shimmering strings
    x.save(); x.rotate(.35);
    box(-8, -84, 16, 70, 6, '#a0673f', 3); box(-14, -94, 28, 20, 6, '#6b4226', 3);
    x.fillStyle = '#ff9f1c'; st(3.5); x.beginPath(); x.ellipse(0, 20, 40, 36, 0, 0, 7); x.ellipse(0, -14, 30, 26, 0, 0, 7); x.fill();
    x.beginPath(); x.ellipse(0, 20, 40, 36, 0, 0, 7); x.stroke(); x.beginPath(); x.ellipse(0, -14, 30, 26, 0, Math.PI * 1.15, Math.PI * 1.85); x.stroke();
    circ(0, 0, 11, '#6b4226', INK, 2.5);
    const sh = Math.sin(t * 30) * 1.2; for (let i = -1.5; i <= 1.5; i++) line([[i * 4, -84], [i * 4 + sh * (i % 2 ? 1 : -1), 40]], 1.2, '#fff8ec');
    box(-14, 38, 28, 7, 3, '#6b4226', 2);
    eyes(-16, 22, 16, 22, 3.5, t, .3); smile(0, 30, 5); x.restore();
  },
  rockinghorse(t) {   // rocking horse rocking gently
    const r = Math.sin(t * 1.8) * .12; x.save(); x.translate(0, 40); x.rotate(r);
    x.strokeStyle = '#a0673f'; x.lineWidth = 8; x.lineCap = 'round'; x.beginPath(); x.arc(0, -130, 150, Math.PI * .36, Math.PI * .64); x.stroke();
    st(3); x.lineWidth = 2; x.beginPath(); x.arc(0, -130, 154, Math.PI * .36, Math.PI * .64); x.stroke();
    [-34, -14, 14, 34].forEach(a => box(a - 5, -36, 10, 22, 4, '#f4a261', 3));
    ell(0, -46, 46, 20, '#f4a261', INK, 3.5);
    box(-10, -66, 26, 10, 5, '#e63946', 2.5);
    poly([[24, -54], [46, -96], [60, -88], [44, -50]], '#f4a261');
    ell(56, -96, 22, 14, '#f4a261', INK, 3.5); poly([[42, -108], [44, -124], [54, -110]], '#f4a261', 2.5);
    for (let i = 0; i < 4; i++) ell(36 + i * 4, -104 + i * 12, 7, 9, '#6b4226', null);
    x.fillStyle = '#6b4226'; x.beginPath(); x.moveTo(-44, -52); x.quadraticCurveTo(-66, -40, -60, -20); x.quadraticCurveTo(-52, -36, -42, -40); x.fill();
    eyes(52, -100, 64, -100, 3, t, 1.2); smile(68, -92, 4, 2); circ(74, -96, 2, INK);
    x.restore();
  },
  icecreamcart(t) {   // little toy ice-cream cart with a striped umbrella
    const sw = Math.sin(t * 1.6) * .05;
    x.save(); x.translate(0, -50); x.rotate(sw); line([[0, 0], [0, 50]], 3);
    x.beginPath(); x.moveTo(-56, 0); x.quadraticCurveTo(0, -46, 56, 0); x.closePath(); x.fillStyle = '#ffffff'; x.fill();
    x.save(); x.clip(); ['#ff5d8f', '#ff5d8f', '#ff5d8f'].forEach((c2, i) => { x.fillStyle = c2; x.fillRect(-56 + i * 38, -50, 19, 60); }); x.restore();
    x.beginPath(); x.moveTo(-56, 0); x.quadraticCurveTo(0, -46, 56, 0); x.closePath(); st(3); x.stroke(); x.restore();
    box(-54, 0, 108, 46, 10, '#9be7c4'); box(-54, 0, 108, 12, 6, '#fff8ec', 2.5);
    [-30, -8, 14].forEach((a, i) => circ(a + 8, -6, 8, ['#ffc8dd', '#fff3b0', '#c8b6ff'][i], INK, 2));
    wheel(-30, 50, 12, t); wheel(30, 50, 12, t);
    face(0, 24, .85, t, .7);
  },
  jackbox(t) {   // jack-in-the-box: a smiling spring-clown ball pops up and down
    const k = Math.max(0, Math.sin(t * 1.6)), up = ease(Math.min(1, k * 1.4));
    box(-44, 0, 88, 66, 8, '#3a86ff'); [[-30, 14], [10, 40]].forEach(([a, b]) => { x.fillStyle = '#ffd23f'; x.beginPath(); x.moveTo(a, b - 8); x.lineTo(a + 8, b); x.lineTo(a, b + 8); x.lineTo(a - 8, b); x.closePath(); x.fill(); });
    circ(52, 30, 6, '#ffd23f', INK, 2.5); line([[58, 30], [70, 30], [70, 18]], 3);
    x.save(); x.translate(-44, 0); x.rotate(-.3 - up * 1.0); box(0, -6, 88, 8, 3, '#2a6fdb', 3); x.restore();
    const top = -6 - up * 56;
    if (up > .05) { x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); for (let i = 0; i <= 12; i++) x.lineTo((i % 2 ? 10 : -10), lerp(0, top + 10, i / 12)); x.stroke(); }
    if (up > .05) { circ(0, top, 22, '#ffe0b5', INK, 3); poly([[-14, top - 16], [0, top - 46], [14, top - 16]], '#e63946', 3); circ(0, top - 46, 5, '#ffd23f', INK, 2);
      circ(0, top + 4, 5, '#ff5d5d'); eyes(-8, top - 4, 8, top - 4, 3, t, .2); smile(0, top + 6, 8, 2.5); }
  },
  kite(t) {   // diamond kite with a bow tail fluttering
    const b = Math.sin(t * 1.4) * 6; x.save(); x.translate(10, -20 + b); x.rotate(Math.sin(t * 1.4) * .08);
    poly([[0, -50], [38, 0], [0, 56], [-38, 0]], '#ffd23f', 3.5);
    poly([[0, -50], [38, 0], [0, 0]], '#ff5d8f', 0); poly([[0, 56], [-38, 0], [0, 0]], '#ff5d8f', 0);
    poly([[0, -50], [38, 0], [0, 56], [-38, 0]], null, 3.5); x.fillStyle = 'transparent';
    line([[0, -50], [0, 56]], 2); line([[-38, 0], [38, 0]], 2);
    face(0, -8, .8, t, 2.4);
    x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.moveTo(0, 56); for (let i = 1; i <= 8; i++) x.lineTo(-i * 8, 56 + i * 6 + Math.sin(t * 4 + i) * 5); x.stroke();
    [2, 5, 8].forEach((i, j) => { const px = -i * 8, py = 56 + i * 6 + Math.sin(t * 4 + i) * 5; poly([[px - 8, py - 6], [px, py], [px - 8, py + 6]], ['#3a86ff', '#2a9d8f', '#e63946'][j], 2); poly([[px + 8, py - 6], [px, py], [px + 8, py + 6]], ['#3a86ff', '#2a9d8f', '#e63946'][j], 2); });
    x.restore();
  },
  lionpuppet(t) {   // hand puppet of a lion (sock puppet style) nodding
    const nod = Math.sin(t * 2.2) * .1;
    box(-30, 20, 60, 70, 14, '#ffbf69'); line([[-30, 72], [30, 72]], 2, 'rgba(29,53,87,.4)');
    x.save(); x.translate(0, 10); x.rotate(nod);
    x.fillStyle = '#c8742c'; st(3); x.beginPath(); for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; x.lineTo(Math.cos(a) * 52, -26 + Math.sin(a) * 48); x.lineTo(Math.cos(a + .22) * 40, -26 + Math.sin(a + .22) * 36); } x.closePath(); x.fill(); x.stroke();
    circ(0, -26, 34, '#ffbf69', INK, 3.5); [-24, 24].forEach(a => circ(a, -54, 9, '#ffbf69', INK, 3));
    ell(0, -14, 14, 10, '#fff1dc', INK, 2.5); poly([[-6, -22], [6, -22], [0, -15]], '#6b4226', 2);
    eyes(-12, -34, 12, -34, 4, t, 1.9); smile(0, -12, 6); cheek(-22, -20); cheek(22, -20);
    x.restore();
  },
  maracas(t) {   // two maracas shaking in turn
    [[-28, '#e63946', 0], [30, '#2a9d8f', 1]].forEach(([a, col, i]) => {
      const sh = Math.sin(t * 8 + i * Math.PI) * .25;
      x.save(); x.translate(a, 50); x.rotate((i ? .35 : -.35) + sh);
      box(-6, -40, 12, 44, 6, '#d9a066', 3); ell(0, -66, 28, 34, col, INK, 3.5);
      [-12, 0, 12].forEach((d, j) => circ(d, -66 + (j % 2) * 12 - 6, 4, '#ffd23f'));
      eyes(-9, -74, 9, -74, 3, t, i * 1.3); smile(0, -66, 5, 2);
      x.restore();
      if (Math.abs(sh) > .2) for (let k = 0; k < 3; k++) line([[a + (i ? 34 : -34) + k * 2, -40 + k * 10], [a + (i ? 44 : -44) + k * 2, -44 + k * 10]], 2.5);
    });
  },
  nestingdolls(t) {   // three round nesting dolls (plain, flowers), smallest hopping
    [[-52, 1, '#e63946', 0], [4, .8, '#ff9f1c', 1], [50, .6, '#3a86ff', 2]].forEach(([a, s, col, i]) => {
      const hop = i === 2 ? Math.abs(Math.sin(t * 3)) * 10 : 0;
      x.save(); x.translate(a, 54 - hop); x.scale(s, s);
      x.fillStyle = col; st(3.5); x.beginPath(); x.moveTo(-30, 0); x.bezierCurveTo(-46, -50, -30, -64, -24, -70); x.arc(0, -86, 26, Math.PI * .85, Math.PI * .15); x.bezierCurveTo(30, -64, 46, -50, 30, 0); x.closePath(); x.fill(); x.stroke();
      circ(0, -86, 18, '#ffe0b5', INK, 2.5); circ(0, -30, 12, '#fff8ec', INK, 2); for (let k = 0; k < 5; k++) { const an = k / 5 * Math.PI * 2; circ(Math.cos(an) * 6, -30 + Math.sin(an) * 6, 3.5, col); }
      eyes(-6, -90, 6, -90, 2.6, t, i * .7); smile(0, -84, 4, 2); cheek(-11, -81, 3); cheek(11, -81, 3);
      x.restore();
    });
  },
  octopusplush(t) {   // soft purple octopus plush waving its arms
    for (let i = 0; i < 6; i++) { const a = -60 + i * 24, w = Math.sin(t * 2.4 + i) * 8;
      x.strokeStyle = INK; x.lineWidth = 15; x.lineCap = 'round'; x.beginPath(); x.moveTo(a * .6, 10); x.quadraticCurveTo(a + w, 40, a - w, 58); x.stroke();
      x.strokeStyle = '#b388eb'; x.lineWidth = 9; x.stroke(); }
    ell(0, -12, 46, 42, '#b388eb', INK, 3.5); circ(-20, -36, 6, 'rgba(255,255,255,.5)');
    [[-26, 4], [26, 4]].forEach(([a, b]) => circ(a, b, 5, '#ff8fab'));
    eyes(-14, -14, 14, -14, 4.5, t, .5); smile(0, -4, 7);
  },
  puzzle(t) {   // four puzzle pieces; the last one slides into place
    const k = (t * .35) % 1, sl = ease(clamp(k * 2)), px = lerp(40, 0, sl), py = lerp(-30, 0, sl);
    const pc = (cx, cy, col, dx = 0, dy = 0) => { x.save(); x.translate(cx + dx, cy + dy); box(-30, -30, 60, 60, 6, col, 3); circ(30, 0, 9, col, INK, 3); x.fillStyle = col; x.fillRect(24, -7, 8, 14); x.restore(); };
    pc(-30, -30, '#3a86ff'); pc(-30, 30, '#2a9d8f'); pc(30, 30, '#ffd23f');
    pc(30, -30, '#ff5d8f', px, py);
    face(-30, -30, .7, t, 1.1); face(30 + px, -30 + py, .7, t, .2);
  },
  quilt(t) {   // tiny patchwork doll quilt, gently waving
    const sw = t * 2;
    const cols = ['#ffadad', '#ffd6a5', '#caffbf', '#9bf6ff', '#bdb2ff', '#fdffb6'];
    for (let r = 0; r < 3; r++) for (let c2 = 0; c2 < 4; c2++) {
      const a = -80 + c2 * 40, b = -54 + r * 36 + Math.sin(sw + c2 * .8) * 4;
      x.fillStyle = cols[(r * 4 + c2) % 6]; x.fillRect(a, b, 40, 36);
      if ((r + c2) % 2) circ(a + 20, b + 18, 6, 'rgba(255,255,255,.75)');
    }
    for (let r = 0; r < 3; r++) for (let c2 = 0; c2 < 4; c2++) { const a = -80 + c2 * 40, b = -54 + r * 36 + Math.sin(sw + c2 * .8) * 4; x.strokeStyle = INK; x.lineWidth = 2.5; x.strokeRect(a, b, 40, 36); x.setLineDash([4, 4]); x.strokeStyle = 'rgba(29,53,87,.4)'; x.strokeRect(a + 5, b + 5, 30, 26); x.setLineDash([]); }
    face(0, -36 + 36 + Math.sin(sw + 1.6) * 4, .9, t, 1.4);
  },
  robot(t) {   // friendly tin robot waving, antenna light blinking
    const wv = Math.sin(t * 3) * .5;
    [-16, 16].forEach(a => box(a - 8, 40, 16, 22, 4, '#8ecae6', 3));
    box(-36, -10, 72, 54, 10, '#8ecae6'); box(-20, 2, 40, 22, 6, '#ffffff', 2.5); [-10, 0, 10].forEach((a, i) => circ(a, 13, 4, ['#e63946', '#ffd23f', '#2a9d8f'][i], INK, 1.5));
    x.save(); x.translate(-36, 0); x.rotate(.3); box(-24, -6, 26, 12, 6, '#8ecae6', 3); x.restore();
    x.save(); x.translate(36, 0); x.rotate(-1.2 + wv); box(-2, -6, 30, 12, 6, '#8ecae6', 3); circ(30, 0, 8, '#ffd23f', INK, 2.5); x.restore();
    box(-30, -62, 60, 48, 12, '#a8dadc');
    line([[0, -62], [0, -78]], 3); circ(0, -82, 6, (t % 1) < .5 ? '#ff5d5d' : '#ffd6d6', INK, 2.5);
    eyes(-11, -42, 11, -42, 5, t, .6); box(-10, -30, 20, 8, 4, '#ffffff', 2);
    cheek(-21, -30); cheek(21, -30);
  },
  spinningtop(t) {   // spinning top turning and wobbling
    const wob = Math.sin(t * 2) * .08; x.save(); x.translate(0, 56); x.rotate(wob);
    ell(0, 2, 30, 5, 'rgba(0,0,0,.15)', null);
    x.beginPath(); x.moveTo(0, 0); x.lineTo(-58, -52); x.quadraticCurveTo(0, -84, 58, -52); x.closePath(); x.fillStyle = '#ffd23f'; x.fill();
    x.save(); x.clip(); const ph = (t * 3) % 1; ['#e63946', '#3a86ff', '#2a9d8f'].forEach((c2, i) => { for (let k = -1; k < 3; k++) { const a = -70 + ((i / 3 + k + ph) % 3) * 50; x.fillStyle = c2; x.beginPath(); x.moveTo(0, 0); x.lineTo(a, -90); x.lineTo(a + 16, -90); x.closePath(); x.fill(); } }); x.restore();
    x.beginPath(); x.moveTo(0, 0); x.lineTo(-58, -52); x.quadraticCurveTo(0, -84, 58, -52); x.closePath(); st(3.5); x.stroke();
    box(-6, -96, 12, 30, 5, '#a0673f', 3);
    box(-26, -56, 52, 22, 11, '#ffffff', 2.5); eyes(-9, -46, 9, -46, 3, t, 2.2); smile(0, -44, 4, 2);
    x.restore();
    for (let i = 0; i < 2; i++) line([[-70 + i * 4, 30 - i * 14], [-60 + i * 4, 22 - i * 14]], 2.5, 'rgba(29,53,87,.5)');
  },
  teddy(t) {   // cuddly teddy bear waving
    const wv = Math.sin(t * 2.5) * .35;
    [-24, 24].forEach(a => ell(a, 54, 16, 12, '#c08552', INK, 3));
    ell(0, 26, 38, 34, '#c08552', INK, 3.5); ell(0, 30, 22, 20, '#e8c39e', null);
    x.save(); x.translate(-34, 12); x.rotate(.4); ell(-6, 10, 11, 18, '#c08552', INK, 3); x.restore();
    x.save(); x.translate(34, 12); x.rotate(-2.2 + wv); ell(0, 16, 11, 18, '#c08552', INK, 3); x.restore();
    [-26, 26].forEach(a => { circ(a, -52, 13, '#c08552', INK, 3); circ(a, -52, 6, '#e8c39e'); });
    circ(0, -28, 32, '#c08552', INK, 3.5); ell(0, -18, 14, 11, '#e8c39e', INK, 2.5); circ(0, -22, 4, INK);
    eyes(-12, -34, 12, -34, 4, t, 1.5); smile(0, -16, 5, 2); cheek(-20, -20); cheek(20, -20);
    poly([[-12, -2], [0, 4], [12, -2], [12, 8], [0, 4], [-12, 8]], '#e63946', 2);
  },
  unicornplush(t) {   // soft white unicorn plush with a rainbow mane, nodding
    const nod = Math.sin(t * 1.8) * .08;
    ell(0, 56, 58, 6, 'rgba(0,0,0,.12)', null);
    ell(-6, 30, 46, 26, '#ffffff', INK, 3.5); [-34, -12, 12, 30].forEach(a => box(a - 7, 40, 14, 18, 7, '#ffffff', 3));
    ['#ff8fab', '#ffd23f', '#9bf6ff'].forEach((c2, i) => ell(-52, 24 + i * 8, 10, 8, c2, null));
    x.save(); x.translate(26, 6); x.rotate(nod);
    ell(14, -24, 28, 24, '#ffffff', INK, 3.5); ell(36, -14, 14, 11, '#ffe5ec', INK, 2.5);
    poly([[4, -46], [12, -78], [20, -46]], '#ffd23f', 3); line([[8, -56], [17, -60]], 2); line([[9, -66], [15, -68]], 2);
    poly([[-4, -40], [-6, -56], [6, -44]], '#ffffff', 2.5);
    ['#ff8fab', '#ffd23f', '#9bf6ff', '#c8b6ff'].forEach((c2, i) => circ(-12 + i * 2, -40 + i * 12, 9, c2, INK, 2));
    eyes(6, -28, 22, -28, 3.5, t, .8); cheek(26, -18); smile(36, -12, 4, 2);
    x.restore();
  },
  violin(t) {   // little violin with a bow sliding across it
    x.save(); x.rotate(-.5);
    box(-6, -86, 12, 52, 5, '#6b4226', 3); circ(0, -92, 7, '#6b4226', INK, 2.5);
    x.fillStyle = '#c96f2d'; st(3.5); x.beginPath(); x.ellipse(0, 22, 34, 30, 0, 0, 7); x.ellipse(0, -14, 26, 22, 0, 0, 7); x.fill();
    x.beginPath(); x.ellipse(0, 22, 34, 30, 0, 0, 7); x.stroke(); x.beginPath(); x.ellipse(0, -14, 26, 22, 0, Math.PI * 1.15, Math.PI * 1.85); x.stroke();
    [-12, 12].forEach(a => line([[a, 2], [a * 1.1, 10], [a, 18]], 2.5));
    for (let i = -1.5; i <= 1.5; i++) line([[i * 3, -86], [i * 3, 40]], 1, '#fff8ec');
    eyes(-14, 26, 14, 26, 3.5, t, 2.7); smile(0, 34, 5);
    x.restore();
    const b = Math.sin(t * 2.4) * 22; x.save(); x.translate(b * .9, b * .4); x.rotate(.35); line([[-70, 0], [70, 0]], 3, '#6b4226'); line([[-66, 4], [66, 4]], 1.5, '#fff8ec'); x.restore();
  },
  wagon(t) {   // red pull-wagon carrying blocks, rolling a little
    const dx = Math.sin(t * 1.3) * 10; x.save(); x.translate(dx, 0);
    [['#3a86ff', -36], ['#ffd23f', -6], ['#2a9d8f', 22]].forEach(([c2, a], i) => box(a, -28 - (i === 1 ? 14 : 0), 26, 26, 4, c2, 2.5));
    box(-56, -4, 106, 36, 6, '#e63946'); line([[-56, 8], [50, 8]], 2, 'rgba(29,53,87,.4)');
    line([[50, 4], [86, -26]], 4); circ(86, -26, 6, '#ffd23f', INK, 2.5);
    wheel(-34, 40, 14, dx / 14); wheel(28, 40, 14, dx / 14);
    face(-4, 16, .8, t, .4); x.restore();
  },
  xylophone(t) {   // rainbow xylophone with a hopping mallet
    const cols = ['#e63946', '#ff9f1c', '#ffd23f', '#2a9d8f', '#3a86ff', '#9b5de5'];
    line([[-70, 0], [70, 18]], 6, '#a0673f'); line([[-70, 46], [70, 34]], 6, '#a0673f');
    cols.forEach((c2, i) => { const a = -62 + i * 24, h = 70 - i * 7; box(a, 23 - h / 2, 20, h, 5, c2, 2.5); circ(a + 10, 23 - h / 2 + 6, 2.5, '#ffffff'); circ(a + 10, 23 + h / 2 - 6, 2.5, '#ffffff'); });
    const j = Math.floor(t * 2.5) % 6, k = (t * 2.5) % 1, mx = -52 + j * 24, my = -30 - Math.sin(k * Math.PI) * 18;
    x.save(); x.translate(mx, my); x.rotate(.7); line([[0, 0], [30, -40]], 4, '#a0673f'); circ(0, 0, 8, '#fff8ec', INK, 2.5); x.restore();
    face(0, 70, .75, t, 1.3);
  },
  yoyo(t) {   // yo-yo going up and down on its string
    const k = (Math.sin(t * 2.2) + 1) / 2, y = lerp(-40, 40, k);
    line([[0, -86], [0, y]], 2); circ(0, -86, 5, '#ff9f1c', INK, 2);
    x.save(); x.translate(0, y); x.rotate(t * 6 * (k > .5 ? 1 : -1) * 0);
    circ(0, 0, 32, '#2a9d8f', INK, 3.5); circ(0, 0, 22, '#9be7c4', INK, 2); circ(0, 0, 5, INK);
    eyes(-9, -4, 9, -4, 3.2, t, .9); smile(0, 4, 5, 2); x.restore();
  },
  zebrawheels(t) {   // pull-along zebra on wheels, rolling and nodding
    const dx = Math.sin(t * 1.4) * 10, nod = Math.sin(t * 2.8) * .1; x.save(); x.translate(dx - 10, 0);
    box(-50, 28, 100, 12, 5, '#a0673f', 3);
    [-36, -18, 18, 34].forEach(a => box(a - 5, 4, 10, 26, 4, '#ffffff', 2.5));
    ell(0, -4, 46, 22, '#ffffff', INK, 3.5);
    x.save(); x.beginPath(); x.ellipse(0, -4, 44, 20, 0, 0, 7); x.clip(); [-30, -14, 2, 18, 32].forEach(a => { x.fillStyle = INK; x.beginPath(); x.moveTo(a - 4, -30); x.lineTo(a + 4, -30); x.lineTo(a + 1, 18); x.lineTo(a - 7, 18); x.closePath(); x.fill(); }); x.restore();
    x.save(); x.translate(36, -10); x.rotate(nod);
    poly([[-4, 0], [10, -34], [26, -26], [14, 4]], '#ffffff'); ell(24, -38, 18, 13, '#ffffff', INK, 3.5); ell(38, -34, 9, 8, '#cfcfcf', INK, 2);
    for (let i = 0; i < 4; i++) ell(10 + i * 2, -48 + i * 10, 5, 6, INK, null); poly([[12, -50], [14, -62], [22, -50]], '#ffffff', 2.5);
    eyes(20, -42, 30, -42, 2.8, t, 2.1); smile(36, -32, 3, 2); x.restore();
    wheel(-34, 44, 12, dx / 12); wheel(34, 44, 12, dx / 12);
    line([[-50, 34], [-80, 20]], 2.5);
    x.restore();
  },
};

// word, colour, picture, sound effect (optional)
const L = [
  ['Airplane', '#3a86ff', 'airplane', 'whoosh'], ['Ball', '#e63946', 'ball', 'boing'], ['Car', '#e63946', 'car', 'honk'], ['Drum', '#d62828', 'drum', 'drum'],
  ['Elephant', '#9d7cc1', 'elephantplush', 'trumpet'], ['Flute', '#b5793c', 'flute'], ['Guitar', '#ff8c1a', 'guitar'], ['Horse', '#e07a3f', 'rockinghorse'],
  ['Ice cream cart', '#ff5d8f', 'icecreamcart'], ['Jack-in-the-box', '#2a6fdb', 'jackbox', 'boing'], ['Kite', '#e0a800', 'kite', 'swish'], ['Lion puppet', '#c8742c', 'lionpuppet', 'roar'],
  ['Maracas', '#2a9d8f', 'maracas', 'maraca'], ['Nesting dolls', '#e63946', 'nestingdolls'], ['Octopus', '#8e5bd6', 'octopusplush'], ['Puzzle', '#ff5d8f', 'puzzle', 'pop'],
  ['Quilt', '#7b2cbf', 'quilt'], ['Robot', '#219ebc', 'robot', 'twinkle'], ['Spinning top', '#e0a800', 'spinningtop', 'whoosh'], ['Teddy bear', '#a0673f', 'teddy'],
  ['Unicorn', '#ff5d8f', 'unicornplush', 'twinkle'], ['Violin', '#c96f2d', 'violin'], ['Wagon', '#e63946', 'wagon'], ['Xylophone', '#3a86ff', 'xylophone', 'chime:E6'],
  ['Yo-yo', '#2a9d8f', 'yoyo'], ['Zebra', '#3a3f4b', 'zebrawheels'],
];

// ---------- learning UI (toy colours) ----------
function abcStrip(curIdx, k = 1) {
  if (process.env.THUMBBG || k <= 0) return;
  const w = 880, x0 = W / 2 - w / 2, step = w / 26;
  x.save(); x.globalAlpha *= k; x.fillStyle = 'rgba(255,255,255,.92)'; x.strokeStyle = INK; x.lineWidth = 3; rr(x0 - 10, 18, w + 20, 46, 22); x.fill(); x.stroke();
  x.textAlign = 'center'; x.textBaseline = 'middle';
  for (let i = 0; i < 26; i++) { const cx = x0 + step * (i + .5), on = i === curIdx, done = i < curIdx;
    if (on) circ(cx, 41, 18, '#ffc8dd', INK, 2.5);
    x.font = C.FONT(on ? 28 : 21); x.fillStyle = on ? '#c9184a' : done ? INK : 'rgba(29,53,87,.4)'; x.fillText(ABC[i], cx, 43); }
  x.restore();
}
function letterBlock(Lt, cx, cy, s, col, k) {   // wooden toy block with corner pegs
  if (k <= 0) return;
  x.save(); x.globalAlpha *= clamp(k * 1.5); x.translate(cx, cy); const sc = s * (.6 + .4 * ease(k)); x.scale(sc, sc); x.rotate(-.04);
  x.fillStyle = 'rgba(0,0,0,.15)'; x.beginPath(); x.ellipse(0, 112, 110, 12, 0, 0, 7); x.fill();
  // 3D side + top of the block
  x.fillStyle = '#e9c08a'; x.strokeStyle = INK; x.lineWidth = 5; x.beginPath(); x.moveTo(-100, -100); x.lineTo(-76, -122); x.lineTo(124, -122); x.lineTo(124, 78); x.lineTo(100, 100); x.lineTo(100, -100); x.closePath(); x.fill(); x.stroke();
  x.beginPath(); x.moveTo(100, -100); x.lineTo(124, -122); x.stroke();
  x.fillStyle = col; rr(-100, -100, 200, 200, 14); x.fill(); x.stroke();
  x.fillStyle = 'rgba(255,255,255,.93)'; rr(-80, -80, 160, 160, 12); x.fill();
  [[-90, -90], [90, -90], [-90, 90], [90, 90]].forEach(([a, b]) => circ(a, b, 5, 'rgba(255,255,255,.8)', INK, 2));
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = C.FONT(104); x.fillStyle = col; x.lineWidth = 6; x.strokeStyle = INK;
  x.strokeText(Lt + Lt.toLowerCase(), 0, 10); x.fillText(Lt + Lt.toLowerCase(), 0, 10);
  x.restore();
}
function pictureCard(name, cx, cy, k, t) {
  if (k <= 0) return;
  x.save(); x.globalAlpha *= clamp(k * 1.5); x.translate(cx, cy); const sc = .6 + .4 * ease(k); x.scale(sc, sc);
  x.fillStyle = '#fffaf0'; x.strokeStyle = INK; x.lineWidth = 4; rr(-100, -92, 200, 184, 30); x.fill(); x.stroke();
  x.save(); x.beginPath(); rr(-98, -90, 196, 180, 28); x.clip();
  const g = x.createLinearGradient(0, -92, 0, 92); g.addColorStop(0, '#fff0f5'); g.addColorStop(1, '#fffaf0'); x.fillStyle = g; x.fillRect(-100, -92, 200, 184);
  x.fillStyle = '#f7e1c5'; x.fillRect(-100, 56, 200, 40);
  x.translate(0, 2); x.scale(.86, .86); V[name](t); x.restore();
  x.strokeStyle = INK; x.lineWidth = 4; rr(-100, -92, 200, 184, 30); x.stroke();
  x.restore();
}
function wordCard(txt, cx, cy, col, k) {
  if (k <= 0) return;
  x.save(); x.globalAlpha *= clamp(k * 1.5); x.font = C.FONT(txt.length > 12 ? 36 : 42); const w = x.measureText(txt).width + 56;
  x.translate(cx, cy); const sc = .7 + .3 * ease(k); x.scale(sc, sc);
  x.fillStyle = '#fff'; x.strokeStyle = INK; x.lineWidth = 4; rr(-w / 2, -31, w, 62, 30); x.fill(); x.stroke();
  x.textAlign = 'left'; x.textBaseline = 'middle'; const lw = x.measureText(txt[0]).width; const px = -w / 2 + 28;
  x.fillStyle = col; x.fillText(txt[0], px, 3); x.fillStyle = INK; x.fillText(txt.slice(1), px + lw, 3);
  x.restore();
}
const hop = (t, sp = 6, h = 8) => Math.abs(Math.sin(t * sp)) * h;
const say = (c, who) => { const v = c.talk(who); return v > 0 ? (who === 'elephant' ? .12 + v * .04 : v * .45) : 0; };
function savanna(t) { S.setT(20); S.sky(); S.setT(t); S.land(); }
function friends(c, lift = () => 0, xs = {}) {
  ORDER.forEach((k, i) => { const [px, sc, fl] = FR[k]; const p = xs[k] !== undefined ? xs[k] : px;
    S.actor(ANI[k], p, !!(xs[k] !== undefined && xs.moving), say(c, k), sc, { flip: fl, blinkOff: i * .8, phase: i, lift: lift(k, i) }); });
}

// ---------- toy corner: round striped play rug + big open toy chest ----------
const RUG = [480, 490];
const SLOT = i => { const r = Math.floor(i / 13), cc = i % 13; return [RUG[0] - 6 * 25.5 + cc * 25.5 - (r ? 12 : 0) + (r ? 12 : 0), 476 + r * 32]; };
function rug(t, n, landK = 1) {
  if (process.env.THUMBBG) n = 26;
  const [rx, ry] = RUG;
  [['#ffd6a5', 230, 44], ['#ffadad', 206, 38], ['#bde0fe', 180, 32], ['#fff8ec', 150, 26]].forEach(([c2, a, b], i) => ell(rx, ry, a, b, c2, i ? null : INK, 3));
  x.setLineDash([6, 6]); ell(rx, ry, 218, 41, null, 'rgba(29,53,87,.35)', 2); x.setLineDash([]);
  for (let i = 0; i < n; i++) {
    const [cx, cy] = SLOT(i), k = i === n - 1 ? landK : 1; if (k <= 0) continue;
    const s = .17 + Math.floor(i / 13) * .02;
    // the toy hops out of the chest (left) in an arc onto its spot
    const e = ease(k), sx = lerp(CHEST[0], cx, e), sy = lerp(CHEST[1] - 40, cy, e) - Math.sin(e * Math.PI) * 50;
    x.save(); x.translate(sx, sy); x.scale(s, s); V[L[i][2]](t + i); x.restore();
  }
}
const CHEST = [480, 462], CS = .62;   // small open chest at the back edge of the rug, between the friends
function chest(t) {
  x.save(); x.translate(CHEST[0], CHEST[1]); x.scale(CS, CS); x.translate(-CHEST[0], -CHEST[1]);
  const [cx, cy] = CHEST;
  ell(cx, cy + 2, 62, 8, 'rgba(70,40,10,.22)', null);
  // open lid (behind)
  x.save(); x.translate(cx, cy - 56); x.fillStyle = '#c98f4f'; st(3); x.beginPath(); x.moveTo(-54, 0); x.lineTo(-48, -40); x.quadraticCurveTo(0, -56, 48, -40); x.lineTo(54, 0); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = '#a0673f'; x.lineWidth = 3; x.beginPath(); x.moveTo(-50, -20); x.quadraticCurveTo(0, -34, 50, -20); x.stroke(); x.restore();
  // toys peeking out
  x.save(); x.translate(cx - 22, cy - 66); x.scale(.28, .28); V.ball(t * .6); x.restore();
  x.save(); x.translate(cx + 22, cy - 72); x.scale(.26, .26); V.teddy(t); x.restore();
  box(cx - 56, cy - 58, 112, 58, 8, '#d9a066', 3);
  x.strokeStyle = '#a0673f'; x.lineWidth = 2; [cy - 40, cy - 22].forEach(yy => { x.beginPath(); x.moveTo(cx - 52, yy); x.lineTo(cx + 52, yy); x.stroke(); });
  box(cx - 12, cy - 46, 24, 16, 4, '#ffd23f', 2.5);
  x.restore();
}

// ---------- timeline ----------
const INTRO = 12, ABC_D = 26 * SEG, BY = 106;
const NAME = { elephant: 'Ella', lion: 'Leo', rhino: 'Nico', buffalo: 'Boris' };
const abcSays = [], abcSfx = [];
const EXTRA = { 4: 'Like me!', 11: 'Like me! Roar!' };
// Ella says E (Elephant), Leo says L (Lion puppet): otherwise the friends take turns
const WHO = i => i === 4 ? 'elephant' : i === 11 ? 'lion' : ORDER[i % 4];
L.forEach(([word, col, obj, snd], i) => {
  const s = i * SEG, who = WHO(i);
  abcSfx.push([s + .5, `chime:${CHIME[i % 7]}`, .5]);
  if (snd) abcSfx.push([s + 1.3, snd, snd === 'roar' || snd === 'trumpet' ? .25 : .32]);
  abcSfx.push([s + 3.6, 'pop', .25, (SLOT(i)[0] - 480) / 500]);
  const txt = `${ABC[i]} is for ${word}!` + (EXTRA[i] ? ' ' + EXTRA[i] : '');
  abcSays.push([who, txt, s + 1.6, s + 4.5, FR[who][0] + (who === 'elephant' ? 50 : who === 'buffalo' ? -40 : 0), BY, txt.length > 20 ? 24 : 28]);
});
const DY = process.env.THUMBBG ? 26 : 0;

St.episode({
  title: ['Toy ABC', 72], sub: 'with The Big Four', accent: '#ff5d8f', cardBg: '#fff0f5',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'toyabc', shift: 0 },
  thumb: ['Toy ABC', 'with The Big Four'],
  shots: [
    // 1 – the Big Four walk in to the toy corner; the lid of the toy chest pops open
    { d: INTRO, draw: (u, c) => {
        savanna(c.t);
        const k = ease(clamp((u - 1) / 4)), mv = u > 1 && u < 5;
        const xs = { elephant: lerp(-120, FR.elephant[0], k), lion: lerp(-60, FR.lion[0], k), rhino: lerp(1020, FR.rhino[0], k), buffalo: lerp(1080, FR.buffalo[0], k), moving: mv };
        friends(c, (kk, i) => u > 9 && u < 10.4 ? hop(c.t + i, 4, 6) : 0, xs);
        S.foreground();
        rug(c.t, 0); chest(c.t);
        abcStrip(-1, clamp((u - 9.4) / .6));
      },
      says: [['buffalo', 'Look! A box full of toys!', 5.4, 8.6, FR.buffalo[0] - 40, BY + 40, 26], ['elephant', "Let's learn the toy ABC!", 8.9, 11.6, FR.elephant[0] + 50, BY + 40, 26]],
      big: [['A to Z!', 9.4, 11.6, 480, 250, 66, '#ff5d8f']],
      sfx: [[1.2, 'rustle', .3], [5.0, 'boing', .35], [5.4, 'bellow', .25], [8.9, 'trumpet', .25], [9.4, 'arp', .4]] },

    // 2 – A to Z
    { d: ABC_D, draw: (u, c) => {
        const i = Math.min(25, Math.floor(u / SEG)), v = u - i * SEG, [word, col, obj] = L[i], who = WHO(i);
        savanna(c.t);
        const out = clamp((SEG - .35 - v) / .35);
        friends(c, (k, j) => k === who && v > 3.4 && v < 4.4 ? hop(c.t + j, 4.5, 8) : 0);
        S.foreground();
        rug(c.t, i + (v > 3.2 ? 1 : 0), clamp((v - 3.2) / .6)); chest(c.t);
        abcStrip(i);
        letterBlock(ABC[i], 345, 240 + DY, .62, col, clamp((v - .4) / .45) * out);
        pictureCard(obj, 600, 226 + DY, clamp((v - .8) / .45) * out, c.t);
        wordCard(word, 470, 358 + DY, col, clamp((v - 1.1) / .4) * out);
      },
      says: abcSays, sfx: abcSfx },

    // 3 – recap: 26 tiles with letter + toy light up one by one
    { d: 18, draw: (u, c) => {
        savanna(c.t); friends(c); S.foreground();
        x.fillStyle = 'rgba(255,240,245,.95)'; x.fillRect(0, 0, W, 540);
        C.bigText('Toys from A to Z!', W / 2, 66, win(u, .3, 17.6, .4), 48, '#ff5d8f');
        for (let i = 0; i < 26; i++) { const r = Math.floor(i / 9), cc = i % 9, n = r === 2 ? 8 : 9;
          const cx = W / 2 + (cc - (n - 1) / 2) * 96, cy = 164 + r * 104, t0 = 1.6 + i * .5, k = clamp((u - t0) / .3), on = u >= t0 && u < t0 + .5;
          x.save(); x.globalAlpha = .25 + .75 * k; x.translate(cx, cy); const sc = on ? 1.12 : 1; x.scale(sc, sc);
          if (on) circ(0, 0, 50, 'rgba(255,200,221,.7)');
          x.fillStyle = k > 0 ? '#ffffff' : '#dddddd'; x.strokeStyle = INK; x.lineWidth = 3; rr(-40, -44, 80, 88, 14); x.fill(); x.stroke();
          x.fillStyle = k > 0 ? L[i][1] : '#bbbbbb'; rr(-40, -44, 80, 30, 14); x.fill(); x.fillRect(-40, -26, 80, 12); rr(-40, -44, 80, 88, 14); x.stroke();
          x.font = C.FONT(26); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ABC[i], 0, -27);
          if (k > 0) { x.save(); x.beginPath(); x.rect(-38, -12, 76, 54); x.clip(); x.translate(0, 15); x.scale(.32, .32); V[L[i][2]](c.t); x.restore(); }
          x.restore(); }
        C.bigText('Well done!', W / 2, 488, win(u, 15.2, 17.8, .3), 46, '#ffd23f');
      },
      sfx: Array.from({ length: 26 }, (_, i) => [1.6 + i * .5, `chime:${CHIME[i % 7]}`, .32]).concat([[15.2, 'cheer', .4]]) },

    // 4 – goodbye: the friends hop and wave over the rug full of toys
    { d: 12, draw: (u, c) => {
        savanna(c.t);
        friends(c, (k, i) => u > 4.6 && u < 7.4 ? hop(c.t + i * .4, 4, 10) : 0);
        S.foreground(); rug(c.t, 26); chest(c.t);
      },
      says: [['lion', 'Which toy do you like best?', .8, 4.2, FR.lion[0], BY + 40, 26], ['rhino', 'Bye bye! See you soon!', 4.6, 7.4, FR.rhino[0], BY + 40, 26]],
      sfx: [[.8, 'roar', .25], [4.6, 'snort', .3], [5, 'laugh', .3]] },
  ],
});
