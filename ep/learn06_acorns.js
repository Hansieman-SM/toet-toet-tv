// Learning series – Counting #3: 10 Acorns for Squirrel with Little Truck Toet (autumn forest).
// Toet brings a box full of acorns to Squirrel (new character, original design) before winter. Squirrel hops onto Toet's box, takes one acorn
// at a time and hops it up into her basket on the old oak. A tray of 10 at the top fills up, each acorn gets a big numeral + number word and
// a rising chime. Then: the basket is full, recap 1–10, the first snowflakes, Toet drives off. New music: acorns_long.
const C = require('../lib/common'), T = require('../lib/toet');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, rr, circ, ell, hash, INK } = C;

const NUM = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];
const NOTES = ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5', 'A5', 'B5'];
const NCOL = ['#e76f51', '#f4a261', '#e9c46a', '#8ab17d', '#2a9d8f', '#4cc9f0', '#3a86ff', '#9b5de5', '#ff5d8f', '#ff9f1c'];
const BX = 200;                                       // Toet parked (truck bx)
const OX = 610, OG = 412;                             // oak trunk x, ground behind the road
const HOLE = [OX - 4, OG - 118];                      // squirrel's hollow
const BASK = [OX + 108, OG - 186];                    // basket on the branch (bottom centre)
const BASE = [BX + 104, T.ROAD + 20 - 120];           // squirrel waits on the right end of Toet's box
const BOX = i => [BX - 50 + (i % 5) * 34, T.ROAD + 20 - 120 - Math.floor(i / 5) * 13];
const PILE = i => [BASK[0] - 24 + (i % 4) * 16 - (i >= 8 ? -8 : 0), BASK[1] - 30 - Math.floor(i / 4) * 9];
const SEG = 7, PICK = .8, LAND = 2.6, BACK0 = 3.4, BACK1 = 4.6;
const blinkAt = (t, off = 0) => (t + off) % 3.7 > 3.56;

function acorn(cx, cy, s = 1, rot = 0, a = 1) {
  x.save(); x.globalAlpha *= a; x.translate(cx, cy); x.rotate(rot); x.scale(s, s);
  x.fillStyle = '#c98a45'; x.strokeStyle = INK; x.lineWidth = 2.2;
  x.beginPath(); x.moveTo(-9, -2); x.quadraticCurveTo(-10, 12, 0, 16); x.quadraticCurveTo(10, 12, 9, -2); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = 'rgba(255,255,255,.35)'; x.beginPath(); x.ellipse(-4, 4, 2.2, 5, .2, 0, 7); x.fill();
  x.fillStyle = '#7a4a22'; x.beginPath(); x.ellipse(0, -3, 11.5, 6.5, 0, 0, 7); x.fill(); x.stroke();
  x.strokeStyle = 'rgba(40,20,5,.45)'; x.lineWidth = 1.2; for (let k = -2; k <= 2; k++) { x.beginPath(); x.moveTo(k * 4 - 3, -7); x.lineTo(k * 4 + 3, 1); x.stroke(); }
  x.strokeStyle = INK; x.lineWidth = 2.5; x.lineCap = 'round'; x.beginPath(); x.moveTo(0, -9); x.quadraticCurveTo(2, -14, 5, -15); x.stroke();
  x.restore();
}

// ---------- Squirrel (original design): origin = ground under her feet, faces right (flip = faces left) ----------
function squirrel(px, gy, t, s, o = {}) {
  x.save(); x.translate(px, gy); x.scale(s * (o.flip ? -1 : 1), s);
  const RED = '#c8642c', DK = '#9c4a1e', CR = '#ffe8c7';
  const sway = Math.sin(t * (o.tail || 2.2)) * .08;
  // big bushy tail (behind)
  x.save(); x.translate(-14, -14); x.rotate(sway);
  x.fillStyle = RED; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(-46, -6, -52, -60, -30, -84); x.bezierCurveTo(-14, -102, 18, -96, 14, -72);
  x.bezierCurveTo(8, -60, -12, -64, -14, -50); x.bezierCurveTo(-16, -34, 4, -18, 6, -6); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = 'rgba(255,220,180,.5)'; x.beginPath(); x.moveTo(-6, -8); x.bezierCurveTo(-34, -14, -38, -56, -24, -76); x.bezierCurveTo(-30, -52, -24, -30, -6, -8); x.fill();
  x.restore();
  // body
  ell(0, -22, 18, 22, RED, INK, 3);
  ell(4, -18, 10, 15, CR);
  // feet
  ell(-6, -2, 9, 4.5, DK, INK, 2.2); ell(10, -2, 9, 4.5, DK, INK, 2.2);
  // head
  x.save(); x.translate(6, -50 + (o.bob || 0));
  // ears with tufts
  [[-9, 1], [8, -1]].forEach(([ex, d]) => { x.fillStyle = RED; x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.moveTo(ex - 6, -10); x.quadraticCurveTo(ex - 2 + d, -30, ex + 6, -12); x.closePath(); x.fill(); x.stroke();
    x.strokeStyle = DK; x.lineWidth = 2; x.beginPath(); x.moveTo(ex - 1 + d, -24); x.lineTo(ex + d * 2, -31); x.stroke(); });
  ell(0, 0, 17, 15, RED, INK, 3);
  ell(8, 5, 9, 7, CR);                                     // muzzle
  if (blinkAt(t, o.ph || 0)) { x.fillStyle = INK; x.fillRect(1, -4, 9, 2.5); }
  else { circ(5, -3, 5, INK); circ(6.6, -4.6, 1.8, '#fff'); }
  circ(16, 3, 2.6, INK);                                  // nose
  x.strokeStyle = INK; x.lineWidth = 1.8;
  if ((o.mouth || 0) > .05) { x.fillStyle = '#c2405a'; x.beginPath(); x.ellipse(11, 9, 3, 1.5 + o.mouth * 3, 0, 0, 7); x.fill(); x.stroke(); }
  else { x.beginPath(); x.arc(11, 7, 4, .2, Math.PI - .6); x.stroke(); }
  x.fillStyle = 'rgba(255,110,120,.4)'; x.beginPath(); x.arc(-2, 6, 3.5, 0, 7); x.fill();
  x.restore();
  // arms (holding an acorn or waving)
  x.strokeStyle = INK; x.lineWidth = 6; x.lineCap = 'round';
  if (o.wave) { const w = Math.sin(t * 9) * .5; x.save(); x.translate(10, -34); x.rotate(-1.9 + w); x.beginPath(); x.moveTo(0, 0); x.lineTo(16, 0); x.stroke(); x.strokeStyle = RED; x.lineWidth = 3.5; x.beginPath(); x.moveTo(0, 0); x.lineTo(16, 0); x.stroke(); x.restore(); }
  else { x.beginPath(); x.moveTo(8, -30); x.lineTo(18, -26); x.stroke(); x.strokeStyle = RED; x.lineWidth = 3.5; x.beginPath(); x.moveTo(8, -30); x.lineTo(18, -26); x.stroke(); }
  if (o.carry) acorn(22, -30, .9);
  x.restore();
}

// ---------- the old oak with the hollow and the basket ----------
function oak(t, filled, glow = 0) {
  x.save();
  x.fillStyle = '#7b5034'; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(OX - 36, OG); x.quadraticCurveTo(OX - 22, OG - 120, OX - 18, OG - 240); x.lineTo(OX + 20, OG - 240); x.quadraticCurveTo(OX + 24, OG - 120, OX + 40, OG); x.closePath(); x.fill(); x.stroke();
  // roots
  x.beginPath(); x.moveTo(OX - 36, OG); x.quadraticCurveTo(OX - 56, OG - 2, OX - 64, OG + 4); x.moveTo(OX + 40, OG); x.quadraticCurveTo(OX + 58, OG - 2, OX + 66, OG + 4); x.stroke();
  // branch to the basket
  x.beginPath(); x.moveTo(OX + 14, OG - 200); x.quadraticCurveTo(OX + 70, OG - 196, BASK[0] + 40, BASK[1] - 4); x.lineTo(BASK[0] + 40, BASK[1] + 8); x.quadraticCurveTo(OX + 70, OG - 180, OX + 16, OG - 176); x.closePath(); x.fill(); x.stroke();
  // hollow
  ell(HOLE[0], HOLE[1], 20, 26, '#3b2414', INK, 3);
  // bark lines
  x.strokeStyle = 'rgba(40,20,10,.35)'; x.lineWidth = 2; [[-10, -60, -40], [12, -100, -80], [-6, -130, -112]].forEach(([dx, a, b]) => { x.beginPath(); x.moveTo(OX + dx, OG + a); x.quadraticCurveTo(OX + dx + 4, OG + (a + b) / 2, OX + dx, OG + b); x.stroke(); });
  // autumn canopy
  const sw = Math.sin(t * 1.0) * 2;
  [['#d9a02e', 8], ['#f2c14e', 0]].forEach(([col, g]) => { x.fillStyle = col; x.beginPath();
    [[-90, -300, 66], [0, -335, 82], [92, -300, 64], [-130, -250, 42], [-40, -262, 60], [56, -258, 56], [140, -252, 38]].forEach(([a, b, r]) => { x.moveTo(OX + a + sw + r + g, OG + b); x.arc(OX + a + sw, OG + b, r + g, 0, 7); }); x.fill(); });
  [[-70, -320, '#e76f51'], [30, -360, '#8ab17d'], [110, -290, '#e76f51'], [-20, -280, '#8ab17d'], [-120, -262, '#e76f51']].forEach(([a, b, c]) => { x.fillStyle = c; x.beginPath(); x.ellipse(OX + a + sw, OG + b, 10, 6, .5, 0, 7); x.fill(); });
  x.restore();
  // basket (front of the branch) with the acorn pile
  if (glow > 0) circ(BASK[0], BASK[1] - 20, 46, `rgba(255,210,63,${.5 * glow})`);
  for (let i = 0; i < filled; i++) { const [a, b] = PILE(i); acorn(a, b, .8, (hash(i) - .5) * .6); }
  x.save(); x.translate(BASK[0], BASK[1]);
  x.fillStyle = '#d9a35f'; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(-36, -30); x.lineTo(36, -30); x.lineTo(28, 0); x.lineTo(-28, 0); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = '#a8743a'; x.lineWidth = 2.5; [-20, -10].forEach(y => { x.beginPath(); x.moveTo(-34 + (y + 30) * .26, y); x.lineTo(34 - (y + 30) * .26, y); x.stroke(); });
  [-18, 0, 18].forEach(xx => { x.beginPath(); x.moveTo(xx, -30); x.lineTo(xx * .8, 0); x.stroke(); });
  x.restore();
}
function forest(t, dist, behind, snow = 0) {
  T.world({ t, dist, skyP: .15, near: 'trees', behindRoad: () => { x.fillStyle = 'rgba(255,150,50,.18)'; x.fillRect(0, 0, W, T.ROAD); behind && behind(); } });
  // fallen leaves on the front grass
  for (let i = 0; i < 22; i++) { x.fillStyle = ['#e98a2e', '#c8641e', '#ffd166'][i % 3]; x.beginPath(); x.ellipse((i * 47 + 13) % W, 522 + (i % 3) * 6, 7, 4, i, 0, 7); x.fill(); }
  if (snow > 0) for (let i = 0; i < 26; i++) { const yy = ((t * (24 + hash(i) * 14) + hash(i + 3) * 540) % 560) - 10, xx = (hash(i + 7) * W + Math.sin(t + i) * 14);
    circ(xx, yy, 3 + hash(i) * 2.5, `rgba(255,255,255,${.9 * snow})`); }
}
function tray(n, glow = 0) {
  const w = 640, x0 = W / 2 - w / 2;
  x.save(); x.fillStyle = 'rgba(255,255,255,.88)'; x.strokeStyle = INK; x.lineWidth = 4; rr(x0, 22, w, 64, 30); x.fill(); x.stroke();
  for (let i = 0; i < 10; i++) { const cx = x0 + 44 + i * 61, cy = 54;
    if (i < n) { if (i === n - 1 && glow > 0) circ(cx, cy, 27, `rgba(255,210,63,${.6 * glow})`); acorn(cx, cy - 2, 1.2); }
    else { x.setLineDash([5, 5]); circ(cx, cy, 20, null, 'rgba(29,53,87,.35)', 3); x.setLineDash([]); } }
  x.restore();
}
function boxAcorns(n0, n1, dy = 0) { for (let i = n0; i < n1; i++) { const [a, b] = BOX(i); acorn(a, b - dy, 1.05, (hash(i + 5) - .5) * .5); } }
function truck(t, o = {}) { return T.truck(Object.assign({ t, dist: o.dist || 0, moving: false, bx: BX, happy: true }, o)); }
const arc = (a, b, k, h) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k) - Math.sin(k * Math.PI) * h];

const COUNT_D = 10 * SEG + 1;
const countSfx = [];
for (let i = 0; i < 10; i++) { const s = i * SEG; countSfx.push([s + .1, 'tiptoe', .35], [s + PICK + .05, 'boing', .25, -.2], [s + LAND, `chime:${NOTES[i]}`, .6], [s + LAND + .05, 'clave', .3, .3]); }

St.episode({
  title: ['10 Acorns for Squirrel', 60], sub: 'Count with Little Truck Toet', accent: '#c8642c', cardBg: '#fff4e6',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'acorns', shift: 0 },
  shots: [
    // 1 – Toet drives in with a box full of acorns; Squirrel peeks out of her hollow
    { d: 15, draw: (u, c) => {
        const k = ease(clamp((u - 1.2) / 5)), bx = lerp(-330, BX, k), mv = u > 1.2 && u < 6.2;
        const peek = ease(clamp((u - 6.8) / .8));
        forest(c.t, 640, () => { oak(c.t, 0); if (peek > 0) { x.save(); x.beginPath(); x.rect(HOLE[0] - 70, HOLE[1] - 110, 140, 126); x.clip();
          squirrel(HOLE[0], HOLE[1] + 16 + (1 - peek) * 50, c.t, 1, { mouth: c.talk('squirrel') }); x.restore(); } });
        truck(c.t, { bx, moving: mv, dist: k * 560, mouth: c.talk('toet') });
        x.save(); x.translate(bx - BX, 0); boxAcorns(0, 10); x.restore();
        if (u > 12.4) tray(0);
      },
      says: [['toet', 'Hello, Squirrel! I brought you acorns!', 7.4, 10.6, 340, 236, 26], ['squirrel', 'Thank you, Toet!', 10.0, 12.2, HOLE[0] + 10, 90, 26],
             ['toet', "How many? Let's count!", 12.4, 14.8, 340, 236, 26]],
      sfx: [[6.4, 'honk', .5], [7.0, 'squeak', .3, .2]] },

    // 2 – counting: Squirrel hops each acorn from Toet's box up into her basket
    { d: COUNT_D, draw: (u, c) => {
        const cur = Math.floor(u / SEG), v = u - cur * SEG, i = Math.min(cur, 9), w = cur > 9 ? SEG : v;
        const done = cur > 9 ? 10 : i + (w >= LAND ? 1 : 0);
        forest(c.t, 640, () => oak(c.t, done, cur <= 9 && w >= LAND ? clamp(1 - (w - LAND) / 2) : 0));
        truck(c.t, { mouth: c.talk('toet') });
        const taken = cur > 9 ? 10 : i + (w >= PICK ? 1 : 0);
        boxAcorns(taken, 10);
        // squirrel path within the segment
        let p = BASE, carry = false, flip = false, hop = 0;
        if (cur <= 9) {
          const ac = BOX(i), top = [BASK[0] - 44, BASK[1] - 30];
          if (w < PICK) { p = arc(BASE, [ac[0] + 4, ac[1] + 2], w / PICK, 22); flip = ac[0] < BASE[0]; }
          else if (w < LAND) { p = arc([ac[0] + 4, ac[1] + 2], top, ease((w - PICK) / (LAND - PICK)), 90); carry = true; }
          else if (w < BACK0) { p = top; hop = Math.abs(Math.sin((w - LAND) * 8)) * 3; }
          else if (w < BACK1) { p = arc(top, BASE, ease((w - BACK0) / (BACK1 - BACK0)), 70); flip = true; }
        }
        squirrel(p[0], p[1] - hop, c.t, 1.05, { carry, flip, mouth: cur <= 9 && w > LAND && w < LAND + 1 ? .6 : 0 });
        if (cur <= 9 && w >= LAND && w < LAND + .8) C.sparkles(BASK[0], BASK[1] - 30, c.t, 8, 50);
        tray(done, cur <= 9 && w >= LAND ? clamp(1 - (w - LAND) / 4) : 0);
        if (cur <= 9) { const kk = win(w, LAND, SEG - .4, .3);
          C.bigText(String(i + 1), 852, 186, kk, 120, NCOL[i]); C.bigText(NUM[i], 852, 268, kk, 44, '#ffffff'); }
      },
      sfx: countSfx },

    // 3 – the basket is full: TEN!
    { d: 8, draw: (u, c) => {
        forest(c.t, 640, () => oak(c.t, 10, clamp(1 - u / 3)));
        truck(c.t, { mouth: c.talk('toet') });
        const j = u < 1.6 ? Math.abs(Math.sin(u * 5)) * 18 : 0;
        squirrel(BASK[0] - 44, BASK[1] - 30 - j, c.t, 1.05, { mouth: c.talk('squirrel'), wave: u > 1.6 });
        tray(10, clamp(1 - u / 3)); C.sparkles(BASK[0], BASK[1] - 40, c.t, 10, 90);
      },
      says: [['squirrel', 'Ten acorns! Ready for winter!', 1.4, 5.8, 440, 152, 28]],
      sfx: [[.5, 'tada', .5], [1.6, 'squeak', .3, .3]] },

    // 4 – recap: count 1..10 again, each acorn lights up with its numeral
    { d: 17, draw: (u, c) => {
        forest(c.t, 640, () => oak(c.t, 10));
        x.fillStyle = 'rgba(255,248,235,.88)'; x.fillRect(0, 0, W, 540);
        C.bigText("Let's count again!", W / 2, 84, win(u, .4, 16.6, .4), 54, '#c8642c');
        for (let i = 0; i < 10; i++) { const t0 = 2 + i * 1.25, k = clamp((u - t0) / .35), on = u >= t0 && u < t0 + 1.25;
          const cx = 120 + (i % 5) * 180, cy = 216 + Math.floor(i / 5) * 160;
          if (on) circ(cx, cy - 18, 46, 'rgba(255,210,63,.45)');
          acorn(cx, cy - 20, 2.2 * (.4 + .6 * ease(k)) * (on ? 1.12 : 1), 0, k);
          C.bigText(String(i + 1), cx, cy + 54, k, 50, NCOL[i]); }
        C.bigText('Well done!', W / 2, 500, win(u, 14.6, 16.8, .3), 44, '#ffd23f');
      },
      sfx: Array.from({ length: 10 }, (_, i) => [2 + i * 1.25, `chime:${NOTES[i]}`, .55]).concat([[14.6, 'cheer', .4]]) },

    // 5 – the first snowflakes; Squirrel waves from her hollow, Toet drives off
    { d: 13, draw: (u, c) => {
        const k = ease(clamp((u - 6.2) / 5)), bx = lerp(BX, 1150, k);
        forest(c.t, 640, () => { oak(c.t, 10); x.save(); x.beginPath(); x.rect(HOLE[0] - 70, HOLE[1] - 110, 140, 126); x.clip();
          squirrel(HOLE[0], HOLE[1] + 16, c.t, 1, { mouth: c.talk('squirrel'), wave: true }); x.restore(); }, clamp((u - .5) / 2));
        truck(c.t, { bx, moving: u > 6.2, dist: k * 900, mouth: c.talk('toet') });
      },
      says: [['toet', 'Look! The first snowflakes!', .8, 3.4, 340, 236, 26], ['squirrel', 'Bye bye, Toet!', 3.6, 5.8, HOLE[0] + 10, 90, 26],
             ['toet', 'Bye bye, Squirrel!', 5.9, 8.4, 340, 236, 26]],
      sfx: [[.8, 'twinkle:E6', .35], [6.2, 'honk', .5]] },
  ],
});
