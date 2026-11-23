// Learning series – ABC #5: Winter ABC with Little Truck Toet (cosy winter, not Christmas).
// Toet parks by a snowy park on a bright winter day: pale blue sky with a soft winter sun, snowy hills, snow-covered pine trees,
// a frozen pond with ice sparkles, a bench with a snow cap,
// gently falling snow. Per letter (5 s): alphabet strip at the top lights the current letter, a letter block
// (upper + lower case), a picture card with a gently moving original winter drawing + a word card with the coloured first letter,
// Toet says "A is for Arctic fox!", soft chime + a matching sound now and then.
// Recap: 26 blocks light up one by one, "Well done!", Toet drives off (electric, no exhaust).
// New music: winterabc_long (glockenspiel lead, hammered-dulcimer broken chords, soft reedy bassoon bass, light jingle; G major 3/4 waltz).
const C = require('../lib/common'), T = require('../lib/toet');
const St = require('../lib/story');
const { x, W, H, clamp, ease, lerp, win, rr, circ, ell, hash, INK } = C;

const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SEG = 5, BX = 210, ROAD = T.ROAD;
const CHIME = ['G5', 'A5', 'B5', 'D6', 'E6', 'G6', 'A6'];

// ---------- helpers ----------
const st = (lw = 3.5) => { x.lineWidth = lw; x.strokeStyle = INK; x.lineJoin = 'round'; x.lineCap = 'round'; };
const box = (a, b, w, h, r, col, lw = 3.5) => { x.fillStyle = col; st(lw); rr(a, b, w, h, r); x.fill(); x.stroke(); };
const poly = (pts, col, lw = 3) => { x.fillStyle = col; st(lw); x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); x.fill(); x.stroke(); };
const line = (pts, lw = 3, col = INK) => { x.strokeStyle = col; x.lineWidth = lw; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.stroke(); };
const eyes = (ax, ay, bx2, by2, r, t, off = 0) => {
  const bl = ((t + off) % 3.4) > 3.25;
  [[ax, ay], [bx2, by2]].forEach(([a, b]) => { if (bl) { x.beginPath(); x.moveTo(a - r, b); x.lineTo(a + r, b); st(2.5); x.stroke(); } else { circ(a, b, r, INK); circ(a + r * .3, b - r * .35, r * .36, '#fff'); } });
};
const smile = (cx, cy, r, lw = 2.5) => { x.beginPath(); x.arc(cx, cy, r, .3, Math.PI - .3); st(lw); x.stroke(); };
const cheek = (cx, cy, r = 4) => circ(cx, cy, r, 'rgba(255,110,140,.45)');
function flakes(t, n = 8, col = '#ffffff') {   // little snowflakes falling inside a card
  for (let i = 0; i < n; i++) { const k = ((t * .25 + hash(i + 3)) % 1), px = -90 + hash(i + 11) * 180 + Math.sin(t * 1.5 + i) * 5, py = -95 + k * 190;
    x.globalAlpha = .9; circ(px, py, 2 + (i % 3), col, 'rgba(120,160,200,.6)', 1); x.globalAlpha = 1; }
}
function star6(cx, cy, r, rot, col = '#7fc8f8') {   // snowflake shape
  x.save(); x.translate(cx, cy); x.rotate(rot); x.strokeStyle = col; x.lineWidth = r * .16; x.lineCap = 'round';
  for (let i = 0; i < 6; i++) { x.rotate(Math.PI / 3); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -r); x.moveTo(0, -r * .55); x.lineTo(-r * .25, -r * .75); x.moveTo(0, -r * .55); x.lineTo(r * .25, -r * .75); x.stroke(); }
  x.restore();
}

// ---------- 26 original winter pictures (centred on 0,0, inside a ±100 x ±85 card area) ----------
const V = {
  arcticfox(t) {   // white fox curled in the snow, tail swishing
    ell(0, 52, 86, 12, '#ffffff', 'rgba(29,53,87,.25)', 2);
    const sw = Math.sin(t * 2) * .15;
    x.save(); x.translate(-30, 30); x.rotate(sw); x.fillStyle = '#ffffff'; st(3); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(-60, -10, -50, -50); x.quadraticCurveTo(-30, -30, 10, -12); x.closePath(); x.fill(); x.stroke(); x.restore();
    ell(6, 22, 42, 30, '#ffffff', INK, 3.5);
    [-14, 16].forEach(a => box(a - 7, 36, 14, 18, 7, '#ffffff', 3));
    poly([[22, -26], [28, -54], [40, -30]], '#ffffff'); poly([[50, -28], [62, -52], [64, -22]], '#ffffff');
    poly([[26, -28], [29, -46], [36, -30]], '#ffd6e0', 0); poly([[52, -28], [60, -45], [60, -26]], '#ffd6e0', 0);
    ell(44, -14, 28, 22, '#ffffff', INK, 3.5); poly([[64, -12], [84, -4], [64, 2]], '#ffffff', 3); circ(84, -4, 4, INK);
    eyes(38, -18, 54, -18, 3.5, t, .5); cheek(34, -6); smile(64, -2, 5, 2);
  },
  boots(t) {   // two snow boots stomping in turn
    [[-44, '#ff5d8f', 0], [30, '#3a86ff', 1]].forEach(([bx, col, i]) => {
      const up = Math.max(0, Math.sin(t * 3 + i * Math.PI)) * 10;
      x.save(); x.translate(bx, -up);
      x.fillStyle = col; st(3.5); x.beginPath(); x.moveTo(-20, -44); x.lineTo(16, -44); x.quadraticCurveTo(18, 0, 20, 10); x.quadraticCurveTo(48, 12, 50, 32); x.quadraticCurveTo(50, 42, 40, 42); x.lineTo(-18, 42); x.quadraticCurveTo(-26, 42, -24, 30); x.quadraticCurveTo(-22, 0, -20, -44); x.closePath(); x.fill(); x.stroke();
      box(-22, 38, 74, 10, 5, '#3a3f4b', 2.5); x.fillStyle = '#9aa0aa'; [-12, 2, 16, 30].forEach(a => x.fillRect(a, 44, 6, 4));
      for (let k = 0; k < 6; k++) circ(-18 + k * 7, -48, 7, '#ffffff', 'rgba(29,53,87,.5)', 1.5);
      circ(22, 24, 5, '#ffffff', INK, 2); star6(-2, -8, 9, t * .5, 'rgba(255,255,255,.9)');
      x.restore();
    });
    ell(0, 56, 92, 8, 'rgba(255,255,255,.9)', 'rgba(29,53,87,.2)', 2);
  },
  cocoa(t) {   // warm mug with marshmallows and steam
    for (let i = 0; i < 3; i++) { const k = (t * .5 + i / 3) % 1; x.globalAlpha = 1 - k; line([[-20 + i * 20, -40 - k * 30], [-26 + i * 20 + Math.sin(t * 2 + i) * 6, -55 - k * 30], [-20 + i * 20, -70 - k * 30]], 4, 'rgba(160,140,130,.8)'); x.globalAlpha = 1; }
    x.strokeStyle = INK; x.lineWidth = 3.5; x.fillStyle = '#ff7a45'; x.beginPath(); x.arc(54, 6, 20, -1.3, 1.3); x.lineWidth = 9; x.strokeStyle = INK; x.stroke(); x.lineWidth = 5; x.strokeStyle = '#ff7a45'; x.stroke();
    box(-48, -34, 100, 82, 18, '#ff7a45'); ell(2, -32, 46, 9, '#8b5a3c', INK, 3);
    [[-18, -34], [4, -36], [22, -32]].forEach(([a, b]) => box(a - 7, b - 6, 14, 11, 3, '#ffffff', 2));
    star6(2, 12, 14, t * .4, '#ffffff'); eyes(-20, 28, 26, 28, 0.01, t);
  },
  deer(t) {   // young deer with little antlers nodding
    const nod = Math.sin(t * 1.6) * .08;
    [-34, -14, 22, 40].forEach(a => box(a - 5, 20, 10, 36, 5, '#c08552', 3));
    ell(4, 14, 52, 26, '#c08552', INK, 3.5); [[-20, 6], [0, 14], [20, 4]].forEach(([a, b]) => circ(a, b, 4, '#fff1dc'));
    ell(-46, 4, 8, 6, '#ffffff', INK, 2);
    x.save(); x.translate(40, -8); x.rotate(nod);
    line([[2, -30], [-6, -58], [-16, -66]], 4, '#8b5a3c'); line([[-4, -50], [6, -62]], 4, '#8b5a3c'); line([[24, -30], [30, -58], [40, -66]], 4, '#8b5a3c'); line([[29, -50], [20, -62]], 4, '#8b5a3c');
    poly([[0, -30], [-14, -42], [-2, -20]], '#c08552'); poly([[30, -30], [44, -42], [30, -18]], '#c08552');
    ell(14, -18, 22, 20, '#c08552', INK, 3.5); ell(20, -4, 14, 10, '#e8c39e', INK, 2.5); circ(26, -6, 4, INK);
    eyes(6, -22, 22, -22, 3.2, t, 1.1); x.restore();
  },
  earmuffs(t) {   // fluffy earmuffs on a little snowman-head-less band, gently bouncing
    const b = Math.sin(t * 2.2) * 4;
    x.save(); x.translate(0, b);
    x.strokeStyle = INK; x.lineWidth = 12; x.beginPath(); x.arc(0, 10, 56, Math.PI * 1.05, Math.PI * 1.95); x.stroke(); x.strokeStyle = '#9b5de5'; x.lineWidth = 7; x.stroke();
    [-56, 56].forEach(a => { for (let i = 0; i < 10; i++) { const an = i / 10 * Math.PI * 2; circ(a + Math.cos(an) * 22, 18 + Math.sin(an) * 22, 9, '#ff9ec4', INK, 2); } circ(a, 18, 24, '#ffb3d1'); circ(a, 18, 10, '#ffd6e5'); });
    x.restore(); flakes(t, 6, '#ffffff');
  },
  fireplace(t) {   // cosy fireplace with dancing flame
    box(-84, -64, 168, 22, 6, '#c75b39'); box(-74, -44, 148, 104, 6, '#e07a5f');
    x.strokeStyle = 'rgba(29,53,87,.35)'; x.lineWidth = 2; for (let r = 0; r < 5; r++) { x.beginPath(); x.moveTo(-74, -24 + r * 20); x.lineTo(74, -24 + r * 20); x.stroke(); }
    box(-46, -22, 92, 80, 40, '#3a3f4b'); x.fillRect(-46, 20, 92, 38);
    const f = Math.sin(t * 6) * 4, g = Math.cos(t * 5) * 4;
    x.fillStyle = '#ff9f1c'; x.beginPath(); x.moveTo(-30, 46); x.quadraticCurveTo(-34 + f, 6, 0, -12 + g); x.quadraticCurveTo(34 - f, 6, 30, 46); x.closePath(); x.fill();
    x.fillStyle = '#ffd23f'; x.beginPath(); x.moveTo(-16, 46); x.quadraticCurveTo(-16 - g, 18, 0, 6 + f); x.quadraticCurveTo(16 + g, 18, 16, 46); x.closePath(); x.fill();
    box(-34, 44, 68, 12, 6, '#8b5a3c', 2.5); eyes(-8, 30, 8, 30, 2.6, t, 2); smile(0, 36, 4, 2);
    box(-60, -84, 14, 20, 3, '#ffffff', 2.5); x.fillStyle = '#ffd23f'; x.beginPath(); x.ellipse(-53, -88 + Math.sin(t * 7), 3, 6, 0, 0, 7); x.fill();
    box(40, -82, 22, 18, 4, '#9de0c4', 2.5);
  },
  gloves(t) {   // pair of gloves waving
    [[-38, '#2a9d8f', 1], [38, '#ff9f1c', -1]].forEach(([gx, col, s]) => {
      x.save(); x.translate(gx, 20); x.rotate(Math.sin(t * 2.4 + s) * .12 * s); x.scale(s, 1);
      box(-24, 22, 48, 22, 6, '#ffffff', 3);
      x.fillStyle = col; st(3.5); x.beginPath(); x.moveTo(-22, 22); x.lineTo(-22, -22);
      [-16, -5, 6, 17].forEach((a, i) => { const h = [-58, -66, -64, -54][i]; x.lineTo(a - 5, -22); x.arcTo(a - 5, h, a, h, 5); x.arcTo(a + 5, h, a + 5, -22, 5); });
      x.lineTo(22, -22); x.lineTo(22, 4); x.quadraticCurveTo(40, -4, 38, 8); x.quadraticCurveTo(30, 22, 22, 22); x.closePath(); x.fill(); x.stroke();
      line([[-20, 30], [20, 30]], 2, col); line([[-20, 37], [20, 37]], 2, col);
      x.restore();
    });
  },
  hedgehog(t) {   // hedgehog asleep in a pile of snowy leaves, breathing
    const br = 1 + Math.sin(t * 1.6) * .04;
    ell(0, 50, 88, 10, '#ffffff', 'rgba(29,53,87,.2)', 2);
    x.save(); x.translate(-6, 30); x.scale(br, br);
    x.fillStyle = '#8d6748'; st(3); x.beginPath(); for (let i = 0; i <= 18; i++) { const a = Math.PI + i / 18 * Math.PI, r = i % 2 ? 50 : 62; x.lineTo(Math.cos(a) * r, Math.sin(a) * r * .9 + 10); } x.closePath(); x.fill(); x.stroke();
    ell(0, 10, 50, 10, '#ffffff', null);
    x.restore();
    ell(52, 26, 22, 16, '#e8c39e', INK, 3); circ(72, 28, 4, INK);
    x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.arc(52, 22, 4, .3, Math.PI - .3); x.stroke(); cheek(58, 32, 3);
    x.font = C.FONT(22); x.fillStyle = '#7fa8d8'; x.textAlign = 'center'; x.fillText('z', 66 + Math.sin(t) * 3, -10 - (t * 8 % 20)); x.fillText('z', 80, -30 - ((t * 8 + 10) % 20));
  },
  igloo(t) {   // igloo with a glowing door
    ell(0, 54, 92, 9, '#ffffff', 'rgba(29,53,87,.2)', 2);
    x.fillStyle = '#eef6ff'; st(3.5); x.beginPath(); x.moveTo(-76, 52); x.arc(0, 52, 76, Math.PI, 0); x.closePath(); x.fill(); x.stroke();
    x.strokeStyle = 'rgba(29,53,87,.4)'; x.lineWidth = 2; [24, 0, -24].forEach(yy => { const w = Math.sqrt(76 * 76 - (52 - yy) * (52 - yy)); x.beginPath(); x.moveTo(-w, yy); x.lineTo(w, yy); x.stroke(); });
    [[-50, 38], [-10, 38], [30, 38], [-30, 14], [10, 14], [50, 14], [-12, -10], [28, -10]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(a, b + 14); x.stroke(); });
    box(-24, 10, 48, 44, 22, '#3a3f4b'); x.fillRect(-24, 32, 48, 22);
    const gl = .6 + .4 * Math.sin(t * 2); circ(0, 34, 18, `rgba(255,214,90,${gl})`);
    eyes(-8, 30, 8, 30, 3, t, 1.5); star6(60, -54, 10, t * .5); star6(-62, -46, 7, -t * .4);
  },
  jacket(t) {   // puffy jacket with a zip and hood
    const s = 1 + Math.sin(t * 1.8) * .02; x.save(); x.scale(s, s);
    poly([[-36, -50], [-80, -10], [-66, 10], [-40, -10]], '#e63946'); poly([[36, -50], [80, -10], [66, 10], [40, -10]], '#e63946');
    box(-44, -54, 88, 112, 18, '#e63946');
    x.strokeStyle = 'rgba(29,53,87,.35)'; x.lineWidth = 2.5; [-20, 6, 32].forEach(yy => { x.beginPath(); x.moveTo(-42, yy); x.quadraticCurveTo(0, yy + 6, 42, yy); x.stroke(); });
    ell(0, -60, 30, 12, '#ffffff', INK, 3); line([[0, -48], [0, 54]], 3); box(-4, -40, 8, 14, 3, '#ffd23f', 2);
    box(-34, 14, 22, 18, 4, '#c1121f', 2.5); box(12, 14, 22, 18, 4, '#c1121f', 2.5);
    x.restore();
  },
  kettle(t) {   // kettle whistling a little steam cloud
    const k = (t * .6) % 1; x.globalAlpha = 1 - k; circ(64 + k * 20, -44 - k * 22, 8 + k * 10, 'rgba(255,255,255,.95)', 'rgba(29,53,87,.3)', 2); x.globalAlpha = 1;
    poly([[34, -2], [64, -36], [70, -30], [44, 16]], '#4cc9f0');
    x.strokeStyle = INK; x.lineWidth = 9; x.beginPath(); x.arc(-4, -38, 40, Math.PI * 1.1, Math.PI * 1.9); x.stroke(); x.strokeStyle = '#3a3f4b'; x.lineWidth = 5; x.stroke();
    x.fillStyle = '#4cc9f0'; st(3.5); x.beginPath(); x.moveTo(-50, 48); x.quadraticCurveTo(-62, -18, -4, -22); x.quadraticCurveTo(54, -18, 42, 48); x.closePath(); x.fill(); x.stroke();
    box(-14, -32, 20, 10, 4, '#3a3f4b', 2.5); ell(-4, 50, 50, 6, '#3a3f4b', INK, 2.5);
    eyes(-18, 10, 6, 10, 3.5, t, .7); smile(-6, 18, 6); cheek(-28, 22); cheek(16, 22);
  },
  lantern(t) {   // glowing lantern swinging slightly
    x.save(); x.translate(0, -70); x.rotate(Math.sin(t * 1.5) * .1);
    line([[0, -10], [0, 4]], 3); x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.arc(0, 14, 12, Math.PI, 0); x.stroke();
    box(-26, 14, 52, 12, 4, '#3a3f4b', 2.5);
    const gl = .7 + .3 * Math.sin(t * 3); circ(0, 70, 54, `rgba(255,214,90,${.25 * gl})`);
    box(-30, 26, 60, 84, 8, `rgba(255,236,160,${gl})`); line([[-10, 26], [-10, 110]], 2.5); line([[10, 26], [10, 110]], 2.5);
    x.fillStyle = '#ff9f1c'; x.beginPath(); x.ellipse(0, 72 + Math.sin(t * 8), 6, 12, 0, 0, 7); x.fill(); box(-6, 82, 12, 14, 3, '#ffffff', 2);
    box(-34, 108, 68, 12, 4, '#3a3f4b', 2.5); x.restore();
  },
  mitten(t) {   // one big striped mitten waving
    x.save(); x.translate(0, 10); x.rotate(Math.sin(t * 2.2) * .12);
    box(-34, 40, 68, 26, 8, '#ffffff', 3);
    x.fillStyle = '#ff7a45'; st(3.5); x.beginPath(); x.moveTo(-32, 40); x.lineTo(-32, -30); x.quadraticCurveTo(-32, -70, 4, -70); x.quadraticCurveTo(36, -70, 34, -30); x.lineTo(34, -6); x.quadraticCurveTo(62, -26, 64, -4); x.quadraticCurveTo(64, 14, 34, 22); x.lineTo(34, 40); x.closePath(); x.fill(); x.stroke();
    [-30, -10, 10].forEach(yy => line([[-32, yy], [34, yy]], 6, '#ffd23f'));
    circ(0, 2, 12, '#ffffff', INK, 2.5); star6(0, 2, 8, t, '#7fc8f8'); x.restore();
  },
  narwhal(t) {   // friendly narwhal swimming in icy water
    const b = Math.sin(t * 1.6) * 5;
    x.save(); x.translate(0, b);
    poly([[-58, -4], [-86, -24], [-80, 6], [-86, 26]], '#8ecae6');
    ell(0, 0, 62, 34, '#8ecae6', INK, 3.5); ell(10, 14, 42, 16, '#d6f0ff', null);
    x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(56, -14); x.lineTo(96, -50); x.stroke(); x.strokeStyle = '#fff6d6'; x.lineWidth = 2.5; x.stroke();
    [[-30, -14], [-10, -22], [-36, 6]].forEach(([a, c]) => circ(a, c, 4, '#5fa8d3'));
    eyes(28, -8, 44, -8, 3.5, t, .3); smile(38, 4, 6); cheek(24, 6);
    x.restore();
    x.fillStyle = '#4cc9f0'; x.beginPath(); x.moveTo(-100, 90); x.lineTo(-100, 46); for (let i = -100; i <= 100; i += 5) x.lineTo(i, 46 + Math.sin(i * .1 + t * 2) * 3); x.lineTo(100, 90); x.closePath(); x.fill();
  },
  otter(t) {   // otter floating on its back holding a pebble
    const b = Math.sin(t * 1.4) * 4;
    x.fillStyle = '#90e0ef'; x.fillRect(-110, 30, 220, 70);
    x.save(); x.translate(0, b);
    ell(0, 22, 70, 22, '#9c6644', INK, 3.5); ell(0, 16, 50, 12, '#e8c39e', null);
    poly([[60, 18], [96, 4], [92, 24]], '#9c6644');
    ell(-62, 6, 24, 22, '#9c6644', INK, 3.5); ell(-62, 12, 15, 11, '#e8c39e', INK, 2); circ(-62, 6, 3.5, INK);
    circ(-78, -12, 6, '#9c6644', INK, 2.5); circ(-46, -12, 6, '#9c6644', INK, 2.5);
    eyes(-70, 0, -54, 0, 2.8, t, 1.9); smile(-62, 14, 4, 2);
    ell(-20, -4, 10, 8, '#adb5bd', INK, 2.5); [[-30, 2], [-10, 2]].forEach(([a, c]) => circ(a, c, 6, '#9c6644', INK, 2.5));
    x.restore();
    x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 2.5; [[-80, 54], [30, 64], [70, 50]].forEach(([a, c]) => { x.beginPath(); x.moveTo(a - 12, c); x.quadraticCurveTo(a, c - 5, a + 12, c); x.stroke(); });
  },
  pinecone(t) {   // pinecone with a snowy top, rocking
    x.save(); x.translate(0, 6); x.rotate(Math.sin(t * 1.8) * .1);
    line([[0, -62], [0, -76]], 5, '#8b5a3c');
    for (let r = 0; r < 6; r++) { const yy = -52 + r * 18, w = 22 + Math.sin((r + 1) / 7 * Math.PI) * 26, n = 3 + (r % 2);
      for (let j = 0; j < n; j++) { const cx = -w + (j + .5) * 2 * w / n; box(cx - 13, yy - 9, 26, 22, 10, r % 2 ? '#a0673f' : '#b5784a', 2.5); } }
    ell(0, -56, 26, 10, '#ffffff', INK, 2.5); circ(-12, -50, 5, '#ffffff'); circ(10, -50, 6, '#ffffff');
    eyes(-10, 8, 10, 8, 3.4, t, .9); smile(0, 18, 6); x.restore();
  },
  quilt(t) {   // patchwork quilt gently waving like a blanket
    const cols = ['#ffadad', '#ffd6a5', '#caffbf', '#9bf6ff', '#bdb2ff', '#fdffb6'];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
      const px = -80 + c * 32, py = -56 + r * 30 + Math.sin(t * 2 + c * .7) * 4;
      x.fillStyle = cols[(r * 2 + c) % 6]; st(2.5); rr(px, py, 32, 30, 3); x.fill(); x.stroke();
      if ((r + c) % 2) { x.strokeStyle = 'rgba(29,53,87,.35)'; x.setLineDash([3, 3]); x.lineWidth = 1.5; rr(px + 5, py + 5, 22, 20, 2); x.stroke(); x.setLineDash([]); }
      else star6(px + 16, py + 15, 7, 0, 'rgba(255,255,255,.95)');
    }
  },
  robin(t) {   // little robin on a snowy branch, hopping
    line([[-96, 40], [96, 30]], 9, '#8b5a3c'); ell(-40, 34, 30, 6, '#ffffff', null); ell(50, 28, 24, 6, '#ffffff', null);
    const hop = Math.max(0, Math.sin(t * 3)) * 8;
    x.save(); x.translate(0, -hop);
    line([[-6, 20], [-8, 34]], 3); line([[6, 20], [8, 34]], 3);
    poly([[-36, -4], [-66, -10], [-60, 6]], '#8d6748');
    ell(0, 0, 36, 30, '#8d6748', INK, 3.5); ell(10, 6, 22, 20, '#e85d3a', null);
    circ(18, -26, 20, '#8d6748', INK, 3.5); ell(24, -18, 12, 9, '#e85d3a', null);
    poly([[36, -28], [50, -24], [36, -20]], '#ffb703', 2.5); eyes(22, -30, 22, -30, 3.2, t, .4);
    x.restore();
  },
  snowman(t) {   // snowman with scarf, waving a twig arm
    ell(0, 60, 80, 8, '#ffffff', 'rgba(29,53,87,.2)', 2);
    circ(0, 30, 38, '#ffffff', INK, 3.5); circ(0, -26, 28, '#ffffff', INK, 3.5);
    [10, 26, 42].forEach(yy => circ(0, yy, 4, INK));
    line([[-28, 6], [-66, -16], [-74, -28]], 4, '#8b5a3c');
    x.save(); x.translate(28, 4); x.rotate(-.5 + Math.sin(t * 3) * .35); line([[0, 0], [40, 0], [50, -8]], 4, '#8b5a3c'); line([[30, 0], [38, 10]], 4, '#8b5a3c'); x.restore();
    box(-30, -6, 60, 12, 6, '#2a9d8f', 3); box(10, -2, 14, 30, 5, '#2a9d8f', 3);
    box(-22, -64, 44, 12, 4, '#3a3f4b', 3); box(-14, -84, 28, 22, 4, '#3a3f4b', 3);
    eyes(-9, -32, 9, -32, 3.2, t, 1.3); poly([[0, -24], [22, -20], [0, -18]], '#ff9f1c', 2); smile(0, -14, 8, 2);
  },
  toboggan(t) {   // wooden toboggan sliding down a snowy slope with a bunny on it
    x.fillStyle = '#ffffff'; x.strokeStyle = 'rgba(29,53,87,.3)'; x.lineWidth = 2; x.beginPath(); x.moveTo(-110, -10); x.lineTo(110, 60); x.lineTo(110, 100); x.lineTo(-110, 100); x.closePath(); x.fill(); x.stroke();
    const k = (t * .25) % 1, px = -60 + k * 120, py = -10 + (px + 110) * 70 / 220 - 4;
    x.save(); x.translate(px, py); x.rotate(.31);
    x.fillStyle = '#ffffff'; st(3); ell(-6, -28, 16, 18, '#ffffff', INK, 3); ell(-12, -50, 5, 14, '#ffffff', INK, 2.5); ell(0, -50, 5, 14, '#ffffff', INK, 2.5);
    circ(-2, -40, 13, '#ffffff', INK, 3); eyes(-6, -42, 4, -42, 2.4, t, 1.6); circ(-1, -36, 2.2, '#ff9ec4');
    box(-40, -12, 80, 12, 4, '#c08552', 3); x.strokeStyle = INK; x.lineWidth = 3.5; x.beginPath(); x.moveTo(-42, 4); x.lineTo(34, 4); x.quadraticCurveTo(52, 2, 46, -14); x.stroke();
    line([[-24, 0], [-24, 4]], 3); line([[16, 0], [16, 4]], 3); x.restore();
  },
  umbrella(t) {   // little umbrella catching snowflakes
    x.save(); x.rotate(Math.sin(t * 1.5) * .08);
    x.fillStyle = '#9b5de5'; st(3.5); x.beginPath(); x.moveTo(-80, 0); x.quadraticCurveTo(-80, -70, 0, -70); x.quadraticCurveTo(80, -70, 80, 0);
    for (let i = 3; i >= 0; i--) x.quadraticCurveTo(-80 + i * 40 + 20, -14, -80 + i * 40, 0); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#ffd23f'; x.beginPath(); x.moveTo(-40, -2); x.quadraticCurveTo(-30, -60, 0, -70); x.quadraticCurveTo(-14, -40, -0, -2); x.quadraticCurveTo(-20, -14, -40, -2); x.fill();
    line([[0, -70], [0, -80]], 4); line([[0, 0], [0, 56]], 4); x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.arc(-12, 56, 12, 0, Math.PI); x.stroke();
    ell(0, -72, 50, 8, '#ffffff', null); x.restore();
    for (let i = 0; i < 6; i++) { const k = (t * .3 + i / 6) % 1; star6(-90 + i * 36, -90 + k * 50 + (Math.abs(-90 + i * 36) < 75 ? 0 : k * 120), 6, t + i, '#7fc8f8'); }
  },
  village(t) {   // three little snowy houses with glowing windows
    [[-58, 74, '#ffc8dd'], [2, 92, '#bde0fe'], [62, 66, '#caffbf']].forEach(([hx, h, col], i) => {
      const top = 56 - h;
      poly([[hx - 34, top + 4], [hx, top - 26], [hx + 34, top + 4]], '#e76f51');
      box(hx - 26, top, 52, h, 4, col, 3);
      x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(hx - 36, top + 4); x.lineTo(hx, top - 28); x.lineTo(hx + 36, top + 4); x.lineTo(hx + 26, top - 2); x.lineTo(hx, top - 18); x.lineTo(hx - 26, top - 2); x.closePath(); x.fill();
      const on = Math.sin(t * 1.4 + i * 2) > -.5; box(hx - 16, top + 14, 14, 14, 2, on ? '#fff3a0' : '#d6f0ff', 2); box(hx + 2, top + 14, 14, 14, 2, '#fff3a0', 2);
      box(hx - 7, 56 - 22, 14, 22, 3, '#8b5a3c', 2);
    });
    ell(0, 60, 100, 8, '#ffffff', 'rgba(29,53,87,.2)', 2); flakes(t, 7);
  },
  walrus(t) {   // walrus with tusks and moustache, waving a flipper
    ell(0, 58, 90, 8, '#d6f0ff', 'rgba(29,53,87,.2)', 2);
    ell(0, 22, 66, 38, '#b08968', INK, 3.5);
    x.save(); x.translate(-50, 30); x.rotate(-.4 + Math.sin(t * 3) * .3); ell(-16, 0, 22, 10, '#b08968', INK, 3); x.restore();
    ell(10, -18, 40, 32, '#b08968', INK, 3.5);
    [-4, 24].forEach(a => { poly([[a - 5, 0], [a + 5, 0], [a + 1, 34]], '#fffaf0', 2.5); });
    ell(2, -6, 14, 10, '#c9a27e', INK, 2.5); ell(22, -6, 14, 10, '#c9a27e', INK, 2.5);
    [[-2, -6], [6, -2], [20, -2], [28, -6]].forEach(([a, b]) => circ(a, b, 1.5, INK));
    circ(12, -14, 4, INK); eyes(0, -28, 24, -28, 3.4, t, 2.2);
  },
  xylophone(t) {   // icy xylophone with bars that light up in turn, a mallet tapping
    const cols = ['#cdeffd', '#b6e3fb', '#9fd8f8', '#88ccf5', '#71c1f2', '#5ab5ef'];
    const on = Math.floor(t * 2.2) % 6;
    line([[-80, 6], [80, -2]], 6, '#9aa0aa'); line([[-80, 50], [80, 42]], 6, '#9aa0aa');
    cols.forEach((c, i) => { const h = 76 - i * 8, px = -76 + i * 27; x.save(); if (i === on) { x.translate(0, 3); circ(px + 11, 28, 22, 'rgba(255,255,255,.7)'); } box(px, 28 - h / 2, 22, h, 6, c, 3); circ(px + 11, 28 - h / 2 + 8, 2.5, '#ffffff'); x.restore(); });
    const px = -76 + on * 27 + 11; x.save(); x.translate(px + 20, -46); x.rotate(-.5 + Math.abs(Math.sin(t * 2.2 * Math.PI)) * .3); line([[0, 0], [30, -30]], 4, '#8b5a3c'); circ(0, 0, 9, '#e63946', INK, 2.5); x.restore();
    star6(-82, -60, 8, t * .5); star6(78, -66, 6, -t * .4);
  },
  yarn(t) {   // ball of yarn rolling with knitting needles
    const r = Math.sin(t * 1.2) * 14;
    line([[-30 + r, 40], [-90, 52]], 3, '#ff5d8f');
    x.save(); x.translate(r, 4); x.rotate(r / 40);
    circ(0, 0, 46, '#ff5d8f', INK, 3.5);
    x.strokeStyle = '#c9184a'; x.lineWidth = 3; [-30, -10, 10, 30].forEach(a => { x.beginPath(); x.ellipse(0, 0, 44, Math.abs(a) + 6, a / 40, 0, 7); x.stroke(); });
    x.restore();
    line([[40, -70], [90, -20]], 5, '#9aa0aa'); line([[70, -76], [70, -10]], 5, '#9aa0aa'); circ(40, -70, 6, '#ffd23f', INK, 2); circ(70, -76, 6, '#ffd23f', INK, 2);
  },
  zipper(t) {   // a coat zip sliding slowly up and down (a striped sweater peeks out underneath)
    x.save(); x.beginPath(); x.moveTo(-70, 80); x.lineTo(-70, -40); x.quadraticCurveTo(-70, -66, -40, -70); x.lineTo(40, -70); x.quadraticCurveTo(70, -66, 70, -40); x.lineTo(70, 80); x.closePath(); x.fillStyle = '#ffd23f'; x.fill(); x.clip();
    for (let yy = -70; yy < 80; yy += 16) { x.fillStyle = '#ff7a45'; x.fillRect(-70, yy, 140, 8); } x.restore();
    const zy = 40 - (Math.sin(t * 1.4) * .5 + .5) * 100, gap = yy => yy > zy ? Math.min(26, (yy - zy) * .3) : 0;
    [-1, 1].forEach(sd => { x.fillStyle = '#2a9d8f'; st(3.5); x.beginPath(); x.moveTo(sd * 72, 80); x.lineTo(sd * 72, -40); x.quadraticCurveTo(sd * 72, -68, sd * 40, -72); x.lineTo(sd * 2, -72);
      for (let yy = -72; yy <= 80; yy += 8) x.lineTo(sd * (2 + gap(yy)), yy); x.closePath(); x.fill(); x.stroke(); });
    x.fillStyle = '#9aa0aa'; for (let yy = -68; yy < 80; yy += 6) { const g = gap(yy); x.fillRect(-6 - g, yy, 6, 3.5); x.fillRect(g, yy + 3, 6, 3.5); }
    box(-12, zy - 12, 24, 20, 6, '#e9a800', 3); box(-7, zy + 6, 14, 26, 6, '#ffd23f', 2.5); circ(0, zy + 24, 3, '#ffffff', INK, 1.5);
    box(-60, -92, 120, 26, 12, '#2a9d8f', 3);
  },
};
// word, colour, picture, sound effect (optional)
const L = [
  ['Arctic fox', '#4895ef', 'arcticfox'], ['Boots', '#ff5d8f', 'boots', 'bump'], ['Cocoa', '#b5651d', 'cocoa'], ['Deer', '#c08552', 'deer'],
  ['Earmuffs', '#9b5de5', 'earmuffs', 'twinkle'], ['Fireplace', '#e85d04', 'fireplace'], ['Gloves', '#2a9d8f', 'gloves'], ['Hedgehog', '#8d6748', 'hedgehog', 'yawn'],
  ['Igloo', '#4895ef', 'igloo', 'twinkle'], ['Jacket', '#e63946', 'jacket'], ['Kettle', '#0096c7', 'kettle', 'psss'], ['Lantern', '#e9a800', 'lantern'],
  ['Mitten', '#ff7a45', 'mitten'], ['Narwhal', '#0077b6', 'narwhal', 'splash'], ['Otter', '#9c6644', 'otter', 'splash'], ['Pinecone', '#a0673f', 'pinecone'],
  ['Quilt', '#7b2cbf', 'quilt'], ['Robin', '#e85d3a', 'robin', 'tweet'], ['Snowman', '#2a9d8f', 'snowman'], ['Toboggan', '#c08552', 'toboggan', 'whoosh'],
  ['Umbrella', '#9b5de5', 'umbrella'], ['Village', '#e76f51', 'village'], ['Walrus', '#b08968', 'walrus'], ['Xylophone', '#0096c7', 'xylophone', 'chime:E6'],
  ['Yarn', '#ff5d8f', 'yarn'], ['Zipper', '#3a86ff', 'zipper'],
];

// ---------- learning UI (as in Vehicle ABC, icy colours) ----------
function abcStrip(curIdx, k = 1) {
  if (process.env.THUMBBG) return;
  const w = 880, x0 = W / 2 - w / 2, step = w / 26;
  x.save(); x.globalAlpha *= k; x.fillStyle = 'rgba(255,255,255,.92)'; x.strokeStyle = INK; x.lineWidth = 3; rr(x0 - 10, 18, w + 20, 46, 22); x.fill(); x.stroke();
  x.textAlign = 'center'; x.textBaseline = 'middle';
  for (let i = 0; i < 26; i++) { const cx = x0 + step * (i + .5), on = i === curIdx, done = i < curIdx;
    if (on) circ(cx, 41, 18, '#a9def9', INK, 2.5);
    x.font = C.FONT(on ? 28 : 21); x.fillStyle = on ? '#0b5d8a' : done ? INK : 'rgba(29,53,87,.4)'; x.fillText(ABC[i], cx, 43); }
  x.restore();
}
function letterBlock(Lt, cx, cy, s, col, k) {
  if (k <= 0) return;
  x.save(); x.globalAlpha *= clamp(k * 1.5); x.translate(cx, cy); const sc = s * (.6 + .4 * ease(k)); x.scale(sc, sc); x.rotate(.04);
  x.fillStyle = 'rgba(0,0,0,.15)'; x.beginPath(); x.ellipse(0, 112, 110, 12, 0, 0, 7); x.fill();
  x.fillStyle = col; x.strokeStyle = INK; x.lineWidth = 5; rr(-100, -100, 200, 200, 26); x.fill(); x.stroke();
  x.fillStyle = 'rgba(255,255,255,.92)'; rr(-80, -80, 160, 160, 18); x.fill();
  // snow cap on the block
  x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(-104, -96); x.quadraticCurveTo(-60, -124, 0, -112); x.quadraticCurveTo(60, -126, 104, -96); x.quadraticCurveTo(70, -86, 40, -94); x.quadraticCurveTo(0, -84, -40, -94); x.quadraticCurveTo(-74, -86, -104, -96); x.fill(); x.lineWidth = 3; x.stroke();
  [[-88, 88], [88, 88]].forEach(([a, b]) => circ(a, b, 6, 'rgba(255,255,255,.8)', INK, 2));
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = C.FONT(112); x.fillStyle = col; x.lineWidth = 6; x.strokeStyle = INK;
  x.strokeText(Lt + Lt.toLowerCase(), 0, 10); x.fillText(Lt + Lt.toLowerCase(), 0, 10);
  x.restore();
}
function pictureCard(name, cx, cy, k, t) {
  if (k <= 0) return;
  x.save(); x.globalAlpha *= clamp(k * 1.5); x.translate(cx, cy); const sc = .6 + .4 * ease(k); x.scale(sc, sc);
  x.fillStyle = '#ffffff'; x.strokeStyle = INK; x.lineWidth = 4; rr(-110, -92, 220, 184, 30); x.fill(); x.stroke();
  x.save(); rr(-108, -90, 216, 180, 28); x.clip(); const g = x.createLinearGradient(0, -92, 0, 92); g.addColorStop(0, '#e3f4ff'); g.addColorStop(1, '#f7fbff'); x.fillStyle = g; x.fillRect(-110, -92, 220, 184);
  x.translate(0, 4); x.scale(.92, .92); V[name](t); x.restore();
  x.strokeStyle = INK; x.lineWidth = 4; rr(-110, -92, 220, 184, 30); x.stroke();
  x.restore();
}
function wordCard(txt, cx, cy, col, k) {
  if (k <= 0) return;
  x.save(); x.globalAlpha *= clamp(k * 1.5); x.font = C.FONT(txt.length > 11 ? 38 : 44); const w = x.measureText(txt).width + 56;
  x.translate(cx, cy); const sc = .7 + .3 * ease(k); x.scale(sc, sc);
  x.fillStyle = '#fff'; x.strokeStyle = INK; x.lineWidth = 4; rr(-w / 2, -32, w, 64, 30); x.fill(); x.stroke();
  x.textAlign = 'left'; x.textBaseline = 'middle'; const lw = x.measureText(txt[0]).width; const px = -w / 2 + 28;
  x.fillStyle = col; x.fillText(txt[0], px, 3); x.fillStyle = INK; x.fillText(txt.slice(1), px + lw, 3);
  x.restore();
}

// ---------- snowy park (bright winter day) ----------
function pine(px, py, s) {
  x.fillStyle = '#8b5a3c'; x.fillRect(px - 4 * s, py - 12 * s, 8 * s, 14 * s);
  for (let j = 0; j < 3; j++) { const bb = py - 8 * s - j * 20 * s, w = (54 - j * 14) * s, h = 34 * s;
    x.fillStyle = '#3f9a72'; x.beginPath(); x.moveTo(px, bb - h); x.lineTo(px + w / 2, bb); x.lineTo(px - w / 2, bb); x.closePath(); x.fill();
    x.strokeStyle = 'rgba(29,53,87,.35)'; x.lineWidth = 1.5; x.stroke();
    x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(px, bb - h); x.lineTo(px + w * .2, bb - h * .55); x.quadraticCurveTo(px, bb - h * .42, px - w * .2, bb - h * .55); x.closePath(); x.fill();
    x.beginPath(); x.ellipse(px, bb, w / 2, 3 * s, 0, Math.PI, 0); x.fill(); }
}
function park(t) {
  const g = x.createLinearGradient(0, 0, 0, 400); g.addColorStop(0, '#8fd0f7'); g.addColorStop(1, '#e4f5ff');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // soft winter sun
  circ(118, 120, 58, 'rgba(255,240,180,.35)'); circ(118, 120, 36, '#fff3c4', 'rgba(230,200,120,.6)', 2);
  // drifting clouds
  for (let i = 0; i < 4; i++) { const cx = ((hash(i + 2) * 1300 + t * 6 * (.6 + hash(i) * .5)) % 1300) - 170, cy = 80 + hash(i + 9) * 90, s = .6 + hash(i + 4) * .4;
    x.fillStyle = 'rgba(255,255,255,.92)'; x.beginPath(); [[0, 0, 26], [28, -12, 30], [58, 0, 24], [30, 8, 28]].forEach(([a, b, r]) => { x.moveTo(cx + a * s + r * s, cy + b * s); x.arc(cx + a * s, cy + b * s, r * s, 0, 7); }); x.fill(); }
  // far snowy hills
  x.fillStyle = '#d3e9fa'; x.beginPath(); x.moveTo(0, 340); for (let px = 0; px <= W; px += 12) x.lineTo(px, 300 - Math.sin(px / 150 + 1) * 26 - Math.sin(px / 57) * 7); x.lineTo(W, 420); x.lineTo(0, 420); x.fill();
  x.fillStyle = '#eef7ff'; x.beginPath(); x.moveTo(0, 360); for (let px = 0; px <= W; px += 12) x.lineTo(px, 342 - Math.sin(px / 190 + 2.2) * 18); x.lineTo(W, 440); x.lineTo(0, 440); x.fill();
  // far pines
  [[30, 352, .7], [66, 348, .55], [360, 344, .6], [392, 350, .75], [930, 350, .7], [600, 346, .5]].forEach(([a, b, s]) => pine(a, b, s));
  // frozen pond with ice sparkles + bench (left of Toet's bubble area: background only)
  ell(150, 392, 120, 18, '#bfe6fb', 'rgba(29,53,87,.35)', 2);
  x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 2; [[110, 388], [170, 396], [210, 386]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a - 14, b); x.lineTo(a + 14, b - 3); x.stroke(); });
  for (let i = 0; i < 4; i++) { const k = Math.max(0, Math.sin(t * 2 + i * 1.7)); if (k > .6) star6(70 + i * 50, 388 + (i % 2) * 6, 4 * k, 0, '#ffffff'); }
  // bench with a snow cap
  x.fillStyle = '#a0673f'; x.fillRect(300, 392, 70, 7); x.fillRect(300, 378, 70, 6); x.fillRect(306, 399, 5, 14); x.fillRect(360, 399, 5, 14);
  x.fillStyle = '#ffffff'; x.beginPath(); x.ellipse(335, 377, 37, 4, 0, Math.PI, 0); x.fill(); x.beginPath(); x.ellipse(335, 391, 37, 4, 0, Math.PI, 0); x.fill();
  // ground + snow banks + road
  x.fillStyle = '#f4faff'; x.fillRect(0, 412, W, 28);
  x.fillStyle = '#7d8aa3'; x.fillRect(0, ROAD, W, 70);
  x.fillStyle = '#ffffff'; for (let i = 0; i < 13; i++) x.fillRect(i * 80, ROAD + 33, 44, 5);
  x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(0, ROAD + 4); for (let px = 0; px <= W; px += 16) x.lineTo(px, ROAD - 2 + Math.sin(px * .09) * 3); x.lineTo(W, ROAD + 4); x.fill();
  x.fillStyle = '#f4faff'; x.fillRect(0, ROAD + 70, W, H - ROAD - 70);
  x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(0, ROAD + 66); for (let px = 0; px <= W; px += 16) x.lineTo(px, ROAD + 72 + Math.sin(px * .07 + 1) * 3); x.lineTo(W, ROAD + 66); x.fill();
  // a few footprints in the front snow
  for (let i = 0; i < 6; i++) ell(520 + i * 40, ROAD + 84 + (i % 2) * 10, 5, 3, 'rgba(125,150,190,.35)', null);
}
function snowfall(t) {
  for (let i = 0; i < 46; i++) { const sp = .05 + (i % 4) * .015, k = (hash(i + 300) + t * sp) % 1, sx = hash(i + 330) * W + Math.sin(t * .8 + i) * 12, sy = -10 + k * (H + 20);
    x.globalAlpha = .7; circ(sx, sy, 1.2 + (i % 3) * .8, '#ffffff', 'rgba(140,170,210,.5)', .8); }
  x.globalAlpha = 1;
}
const scene = (t) => park(t);
function truck(t, o = {}) { return T.truck(Object.assign({ t, dist: 0, moving: false, bx: BX, happy: true }, o)); }
// a little snow on Toet's box roof
function roofSnow(bx) { x.fillStyle = '#ffffff'; x.strokeStyle = 'rgba(29,53,87,.4)'; x.lineWidth = 1.5; const by = ROAD + 20;
  x.beginPath(); x.moveTo(bx - 68, by - 118); x.quadraticCurveTo(bx - 20, by - 134, bx + 30, by - 124); x.quadraticCurveTo(bx + 80, by - 136, bx + 118, by - 118); x.closePath(); x.fill(); x.stroke(); }

// ---------- timeline ----------
const INTRO = 11, ABC_D = 26 * SEG;
const abcSays = [], abcSfx = [];
L.forEach(([word, col, obj, snd], i) => {
  const s = i * SEG;
  abcSfx.push([s + .5, `chime:${CHIME[i % 7]}`, .5]);
  if (snd) abcSfx.push([s + 1.3, snd, .35]);
  abcSays.push(['toet', `${ABC[i]} is for ${word}!`, s + 1.6, s + 4.5, BX + 30, 236, word.length > 10 ? 24 : word.length > 7 ? 27 : 30]);
});

St.episode({
  title: ['Winter ABC', 70], sub: 'with Little Truck Toet', accent: '#0096c7', cardBg: '#eaf6ff',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'winterabc', shift: 0 },
  shots: [
    // 1 – Toet drives to the snowy park and parks
    { d: INTRO, draw: (u, c) => {
        const k = ease(clamp((u - 1) / 5)), bx = lerp(-300, BX, k);
        scene(c.t);
        truck(c.t, { bx, moving: k < 1 && u > 1, dist: k * 400, mouth: c.talk('toet') }); roofSnow(bx);
        snowfall(c.t);
        abcStrip(-1, clamp((u - 8.6) / .6));
      },
      says: [['toet', 'Hello! It snowed!', 5.8, 8.4, BX + 50, 236, 28], ["toet", "Let's learn the ABC!", 8.6, 10.8, BX + 40, 236, 27]],
      sfx: [[5.4, 'honk', .45]] },

    // 2 – A to Z
    { d: ABC_D, draw: (u, c) => {
        const i = Math.min(25, Math.floor(u / SEG)), v = u - i * SEG, [word, col, obj] = L[i];
        scene(c.t);
        const out = clamp((SEG - .35 - v) / .35);
        truck(c.t, { dist: 400, mouth: c.talk('toet') }); roofSnow(BX);
        snowfall(c.t);
        abcStrip(i);
        const dy = process.env.THUMBBG ? 70 : 0;
        letterBlock(ABC[i], 488, 206 + dy, .7, col, clamp((v - .4) / .45) * out);
        pictureCard(obj, 764, 182 + dy, clamp((v - .8) / .45) * out, c.t);
        wordCard(word, 764, 326 + dy, col, clamp((v - 1.1) / .4) * out);
      },
      says: abcSays, sfx: abcSfx },

    // 3 – recap
    { d: 18, draw: (u, c) => {
        scene(c.t);
        truck(c.t, { dist: 400, mouth: c.talk('toet') });
        x.fillStyle = 'rgba(234,246,255,.95)'; x.fillRect(0, 0, W, 540);
        C.bigText('A to Z – all together!', W / 2, 74, win(u, .3, 17.6, .4), 50, '#0096c7');
        const cols = ['#4895ef', '#ff5d8f', '#2a9d8f', '#ff9f1c', '#9b5de5', '#e63946'];
        for (let i = 0; i < 26; i++) { const r = Math.floor(i / 9), cc = i % 9, n = r === 2 ? 8 : 9;
          const cx = W / 2 + (cc - (n - 1) / 2) * 92, cy = 170 + r * 96, t0 = 1.6 + i * .5, k = clamp((u - t0) / .3), on = u >= t0 && u < t0 + .5;
          x.save(); x.globalAlpha = .25 + .75 * k; x.translate(cx, cy); const sc = on ? 1.14 : 1; x.scale(sc, sc);
          if (on) circ(0, 0, 46, 'rgba(169,222,249,.7)');
          x.fillStyle = k > 0 ? cols[i % 6] : '#c9c9c9'; x.strokeStyle = INK; x.lineWidth = 3; rr(-34, -34, 68, 68, 12); x.fill(); x.stroke();
          x.font = C.FONT(44); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ABC[i], 0, 4); x.restore(); }
        C.bigText('Well done!', W / 2, 482, win(u, 15.2, 17.8, .3), 46, '#ffd23f');
        snowfall(c.t);
      },
      sfx: Array.from({ length: 26 }, (_, i) => [1.6 + i * .5, `chime:${CHIME[i % 7]}`, .32]).concat([[15.2, 'cheer', .4]]) },

    // 4 – Toet drives off
    { d: 12, draw: (u, c) => {
        const k = ease(clamp((u - 4.6) / 5.4)), bx = lerp(BX, 1150, k);
        scene(c.t);
        truck(c.t, { bx, moving: u > 4.6, dist: 400 + k * 900, mouth: c.talk('toet') }); roofSnow(bx);
        snowfall(c.t);
      },
      says: [['toet', 'Bye bye! Stay warm!', 1, 4.4, BX + 40, 236, 28]],
      sfx: [[4.6, 'honk', .5]] },
  ],
});
