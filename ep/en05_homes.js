// Little Truck Toet – Who Lives Here? (English story episode: animal homes – bird/nest, bee/hive, rabbit/burrow, fish/pond, Toet/garage)
const C = require('../lib/common'), T = require('../lib/toet'), A = require('../lib/av');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, circ, ell, rr, INK } = C;
const { drive } = St;
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 175];
const BX = 160;
const SD = 27;                       // length of each animal-home shot
const segsStop = (go) => [[0, 150], [4, 150], [7, 0], [go, 0], [go + 2.5, 150], [go + 6, 150]];
const stopAt = (off) => T.motion(segsStop(21)).distAt(7) + off;   // world x that is at screen x = off while Toet waits
const TREE = stopAt(600), HIVE = stopAt(700), HILL = stopAt(690), POND = stopAt(680);
const mH = T.motion([[0, 120], [3, 120], [7, 0]]), HOME = mH.distAt(7);
const blinkAt = (t, off = 0) => (t + off) % 3.8 > 3.65;
const cheeks = (cx, cy, r) => { x.fillStyle = 'rgba(255,110,120,.45)'; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); };
const eyeAt = (cx, cy, r, t, ph) => { if (blinkAt(t, ph)) { x.fillStyle = INK; x.fillRect(cx - r, cy - 1, r * 2, 2.5); } else { circ(cx, cy, r, INK); circ(cx + r * .3, cy - r * .35, r * .32, '#fff'); } };

// ---------- the homes and their animals (all original designs) ----------
// big tree with a branch to the right and a nest on it; returns the nest position
function nestTree(px, gy, t) {
  x.save(); x.translate(px, gy);
  x.fillStyle = '#8a5a36'; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(-22, 0); x.quadraticCurveTo(-12, -110, -8, -190); x.lineTo(12, -190); x.quadraticCurveTo(16, -110, 26, 0); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = '#8a5a36'; x.lineWidth = 11; x.lineCap = 'round'; x.beginPath(); x.moveTo(6, -150); x.quadraticCurveTo(60, -170, 110, -178); x.stroke();
  const sw = Math.sin(t * 1.1) * 3;
  [['#2f9e5a', 6], ['#46b86e', 0]].forEach(([col, g]) => { x.fillStyle = col; x.beginPath();
    [[-70, -250, 60], [0, -282, 70], [70, -258, 55], [-20, -215, 62], [-95, -205, 40]].forEach(([a, b, r]) => { x.moveTo(a + sw + r + g, b); x.arc(a + sw, b, r + g, 0, 7); }); x.fill(); });
  [[-60, -240], [30, -270], [-10, -210]].forEach(([a, b]) => circ(a + sw, b, 5, '#ff7a45'));    // little red berries
  x.restore();
  return [px + 100, gy - 182];
}
function nest(nx, ny) {
  ell(nx, ny, 40, 15, '#a4703a', INK, 3);
  x.strokeStyle = '#7a4a24'; x.lineWidth = 2; for (let i = 0; i < 8; i++) { x.beginPath(); x.moveTo(nx - 34 + i * 9, ny - 8); x.lineTo(nx - 28 + i * 9, ny + 8); x.stroke(); }
}
function babyBird(bx, by, t, ph, open) {
  circ(bx, by, 11, '#ffe066', INK, 2.5);
  x.fillStyle = '#ff9f1c'; x.strokeStyle = INK; x.lineWidth = 1.8; x.beginPath();
  if (open) { x.moveTo(bx + 8, by - 3); x.lineTo(bx + 18, by - 7); x.lineTo(bx + 10, by); x.lineTo(bx + 18, by + 5); x.lineTo(bx + 8, by + 3); }
  else { x.moveTo(bx + 8, by - 3); x.lineTo(bx + 17, by); x.lineTo(bx + 8, by + 3); }
  x.closePath(); x.fill(); x.stroke();
  eyeAt(bx + 3, by - 3, 2.6, t, ph);
  x.strokeStyle = INK; x.lineWidth = 1.5; x.beginPath(); x.moveTo(bx - 2, by - 11); x.lineTo(bx - 4, by - 17); x.moveTo(bx + 1, by - 11); x.lineTo(bx + 2, by - 17); x.stroke();
}
// mama bird (looks left when sitting on the nest), wings flap while flying
function mamaBird(bx, by, t, flying, flip = 1) {
  x.save(); x.translate(bx, by); x.scale(flip, 1);
  const fl = flying ? Math.sin(t * 20) : .2;
  x.fillStyle = '#4c9be8'; x.strokeStyle = INK; x.lineWidth = 2.5;
  x.beginPath(); x.moveTo(14, 2); x.lineTo(34, -6); x.lineTo(32, 8); x.closePath(); x.fill(); x.stroke();        // tail
  ell(0, 0, 22, 16, '#4c9be8', INK, 2.5);
  ell(-2, 6, 13, 8, '#ffe8cc');
  circ(-16, -12, 12, '#4c9be8', INK, 2.5);
  x.fillStyle = '#ffb703'; x.beginPath(); x.moveTo(-26, -14); x.lineTo(-38, -10); x.lineTo(-26, -7); x.closePath(); x.fill(); x.stroke();
  eyeAt(-19, -14, 2.8, t, .4); cheeks(-14, -7, 3);
  x.save(); x.translate(4, -4); x.rotate(-.3 - fl * .9); ell(8, -6, 16, 8, '#2f7fd0', INK, 2.5); x.restore();
  x.restore();
}
// straw beehive (skep) on a wooden stand
function beehive(px, gy) {
  x.save(); x.translate(px, gy);
  x.fillStyle = '#8a5a36'; x.strokeStyle = INK; x.lineWidth = 3; rr(-6, -60, 12, 60, 3); x.fill(); x.stroke(); rr(-50, -66, 100, 10, 4); x.fill(); x.stroke();
  x.fillStyle = '#f4b942'; x.beginPath(); x.moveTo(-58, -66); x.bezierCurveTo(-62, -160, 62, -160, 58, -66); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = '#c98a1e'; x.lineWidth = 3;
  [-82, -98, -114, -128].forEach((y, i) => { const w = [56, 52, 44, 32][i]; x.beginPath(); x.moveTo(-w, y); x.quadraticCurveTo(0, y + 6, w, y); x.stroke(); });
  circ(0, -80, 11, '#5a3a1a', INK, 2.5);
  x.restore();
}
function bee(bx, by, t, s = 1, flip = 1, ph = 0) {
  x.save(); x.translate(bx, by); x.scale(s * flip, s);
  const w = Math.sin(t * 40 + ph);
  x.fillStyle = 'rgba(220,240,255,.85)'; x.strokeStyle = INK; x.lineWidth = 2;
  [[-4, -14, -.5], [8, -14, .3]].forEach(([a, b, r]) => { x.save(); x.translate(a, b); x.rotate(r + w * .3); x.beginPath(); x.ellipse(0, -8, 7, 12, 0, 0, 7); x.fill(); x.stroke(); x.restore(); });
  ell(0, 0, 20, 14, '#ffd23f', INK, 2.5);
  x.save(); x.beginPath(); x.ellipse(0, 0, 20, 14, 0, 0, 7); x.clip(); x.fillStyle = INK; x.fillRect(-4, -15, 6, 30); x.fillRect(8, -15, 6, 30); x.restore();
  x.fillStyle = INK; x.beginPath(); x.moveTo(20, 0); x.lineTo(27, -2); x.lineTo(20, 4); x.fill();
  circ(-18, -2, 10, '#ffd23f', INK, 2.5);
  eyeAt(-22, -4, 2.4, t, ph); x.strokeStyle = INK; x.lineWidth = 1.6; x.beginPath(); x.arc(-21, 1, 3.2, .2, Math.PI - .2); x.stroke();
  x.beginPath(); x.moveTo(-20, -11); x.quadraticCurveTo(-24, -20, -28, -21); x.moveTo(-15, -11); x.quadraticCurveTo(-14, -21, -10, -23); x.stroke();
  circ(-28, -21, 2, INK); circ(-10, -23, 2, INK);
  x.restore();
}
function flower(px, gy, col, t, ph) {
  const sw = Math.sin(t * 1.5 + ph) * 3;
  x.strokeStyle = '#2f8a46'; x.lineWidth = 3; x.beginPath(); x.moveTo(px, gy); x.quadraticCurveTo(px + sw, gy - 18, px + sw, gy - 34); x.stroke();
  for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; circ(px + sw + Math.cos(a) * 8, gy - 34 + Math.sin(a) * 8, 6, col); }
  circ(px + sw, gy - 34, 5, '#ffd23f');
}
// grassy hill with a burrow hole; pop = 0..1 (rabbit rises out), babies 0..1
function hill(px, gy) {
  x.fillStyle = '#7fcf86'; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(px - 190, gy); x.bezierCurveTo(px - 150, gy - 150, px + 150, gy - 150, px + 190, gy); x.closePath(); x.fill(); x.stroke();
  [[-110, -40], [-40, -95], [60, -88], [120, -45]].forEach(([a, b]) => { x.strokeStyle = '#4fae5f'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(px + a - 6, gy + b); x.lineTo(px + a, gy + b - 10); x.lineTo(px + a + 6, gy + b); x.stroke(); });
}
function rabbit(px, py, t, s, ph = 0) {      // front-facing grey rabbit, (px,py) = chin
  x.save(); x.translate(px, py); x.scale(s, s);
  const wig = Math.sin(t * 3 + ph) * .08;
  [[-1, -.18], [1, .18]].forEach(([d, r]) => { x.save(); x.translate(d * 14, -50); x.rotate(r + d * wig); ell(0, -30, 11, 34, '#b8bfcc', INK, 3); ell(0, -28, 5.5, 24, '#ffc2d1'); x.restore(); });
  ell(0, -26, 32, 28, '#b8bfcc', INK, 3);
  ell(0, -14, 15, 11, '#ffffff');
  eyeAt(-12, -32, 4.5, t, ph + .5); eyeAt(12, -32, 4.5, t, ph + .5);
  x.fillStyle = '#ff8fab'; x.beginPath(); x.moveTo(-5, -20); x.lineTo(5, -20); x.lineTo(0, -15); x.closePath(); x.fill();
  x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.moveTo(0, -15); x.quadraticCurveTo(-4, -9, -9, -11); x.moveTo(0, -15); x.quadraticCurveTo(4, -9, 9, -11); x.stroke();
  x.fillStyle = '#fff'; x.fillRect(-4, -11, 8, 6); x.strokeRect(-4, -11, 8, 6);
  cheeks(-20, -18, 4.5); cheeks(20, -18, 4.5);
  x.restore();
}
// pond with lily pads (drawn behind the road)
function pond(px, gy, t) {
  ell(px, gy - 4, 175, 26, '#5ab4f0', INK, 3);
  ell(px + 40, gy - 8, 70, 6, 'rgba(255,255,255,.45)');
  [[-120, -6, 22], [95, -2, 18], [140, -10, 14]].forEach(([dx, dy, r], i) => { const b = Math.sin(t * 1.4 + i) * 1.5;
    x.fillStyle = '#3fb36a'; x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.ellipse(px + dx, gy + dy + b, r, r * .35, 0, .35, Math.PI * 2 - .1); x.lineTo(px + dx, gy + dy + b); x.closePath(); x.fill(); x.stroke(); });
  circ(px + 95, gy - 8 + Math.sin(t * 1.4 + 1) * 1.5, 6, '#ff9ec4', INK, 2);
  [[-175, -2], [168, -4]].forEach(([dx, dy]) => { x.strokeStyle = '#2f8a46'; x.lineWidth = 4; x.lineCap = 'round';
    x.beginPath(); x.moveTo(px + dx, gy + dy); x.lineTo(px + dx - 6, gy + dy - 46); x.moveTo(px + dx + 7, gy + dy); x.lineTo(px + dx + 10, gy + dy - 38); x.stroke(); ell(px + dx - 6, gy + dy - 50, 4.5, 11, '#8a5a2b'); });
}
function fish(fx, fy, t, rot, s = 1) {
  x.save(); x.translate(fx, fy); x.rotate(rot); x.scale(s, s);
  const wag = Math.sin(t * 14) * .3;
  x.save(); x.translate(24, 0); x.rotate(wag); x.fillStyle = '#ff7a45'; x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.moveTo(0, 0); x.lineTo(20, -14); x.lineTo(18, 14); x.closePath(); x.fill(); x.stroke(); x.restore();
  ell(0, 0, 28, 17, '#ff9f5a', INK, 2.5);
  x.fillStyle = '#ffd23f'; x.beginPath(); x.moveTo(-4, -15); x.quadraticCurveTo(6, -28, 16, -12); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = '#e8622a'; x.lineWidth = 3; [0, 9].forEach(d => { x.beginPath(); x.arc(d - 2, 0, 12, -.9, .9); x.stroke(); });
  eyeAt(-15, -4, 3.6, t, .2); x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.arc(-21, 5, 4, .1, Math.PI - .6); x.stroke();
  x.restore();
}
function splash(cx, cy, k) {
  if (k <= 0 || k >= 1) return;
  x.save(); x.globalAlpha = 1 - k;
  for (let i = 0; i < 7; i++) { const a = Math.PI + (i + .5) / 7 * Math.PI, r = 20 + k * 50; circ(cx + Math.cos(a) * r, cy + Math.sin(a) * r * .9 + k * k * 40, 6 - k * 3, '#bfe6ff', INK, 1.5); }
  x.strokeStyle = '#ffffff'; x.lineWidth = 3; x.beginPath(); x.ellipse(cx, cy + 4, 20 + k * 60, 4 + k * 8, 0, 0, 7); x.stroke();
  x.restore();
}
function bubbles(cx, cy, t, k) {
  for (let i = 0; i < 3; i++) { const q = ((t * .9 + i / 3) % 1); x.save(); x.globalAlpha = k * (1 - q); x.strokeStyle = '#ffffff'; x.lineWidth = 2;
    x.beginPath(); x.arc(cx + Math.sin(q * 6 + i) * 5, cy - q * 40, 3 + i, 0, 7); x.stroke(); x.restore(); }
}
// Toet's own home: a cosy garage with a round window and a charging post
function garage(px, gy, n) {
  x.save(); x.translate(px, gy);
  x.fillStyle = '#ffe1b3'; x.strokeStyle = INK; x.lineWidth = 3.5; rr(-120, -150, 240, 150, 8); x.fill(); x.stroke();
  x.fillStyle = '#e8735a'; x.beginPath(); x.moveTo(-140, -145); x.lineTo(0, -225); x.lineTo(140, -145); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = n > .3 ? '#ffe58a' : '#bfe6ff'; circ(0, -170, 18, null); x.beginPath(); x.arc(0, -170, 18, 0, 7); x.fill(); x.stroke();
  x.beginPath(); x.moveTo(-18, -170); x.lineTo(18, -170); x.moveTo(0, -188); x.lineTo(0, -152); x.stroke();
  x.fillStyle = '#7fb3d5'; rr(-90, -110, 180, 110, 6); x.fill(); x.stroke();
  x.strokeStyle = '#5b8fb3'; x.lineWidth = 3; for (let i = 1; i < 5; i++) { x.beginPath(); x.moveTo(-88, -110 + i * 22); x.lineTo(88, -110 + i * 22); x.stroke(); }
  x.fillStyle = '#2fb36a'; circ(0, -128, 11, '#2fb36a', INK, 2.5); T.bolt(0, -128, .55, '#ffd23f');
  x.restore();
}

// recap: four animal -> home pairs appear in a 2x2 grid in the evening sky
function recap(u, a, end) {
  const pairs = [['Bird', 'Nest', '#4cc9f0'], ['Bee', 'Hive', '#ffd23f'], ['Rabbit', 'Burrow', '#ff9ec4'], ['Fish', 'Pond', '#ff9f5a']];
  pairs.forEach(([p, q, col], i) => {
    const k = clamp((u - a - i * 2.4) / .5) * clamp((end - u) / .8); if (k <= 0) return;
    const cx = i % 2 ? 690 : 290, cy = i < 2 ? 66 : 146;
    C.bigText(p, cx - 100, cy, k, 40, col); C.bigText('→', cx, cy, k, 34, '#ffffff'); C.bigText(q, cx + 100, cy, k, 40, col);
  });
}

St.episode({
  title: ['Who Lives Here?', 64], sub: 'Little Truck Toet', accent: '#e8735a',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'homes', shift: 0 },
  shots: [
    { d: 17, draw: drive({ segs: [[0, 150]], bx: BX }),
      says: [['toet', "Hi! I'm Little Truck Toet!", 5.4, 9.4, ...TB], ['toet', 'Who lives where? Let\'s look!', 9.8, 13.8, ...TB]],
      big: [['Animal Homes!', 14, 16.6, 480, 90, 62, '#ffd23f']],
      sfx: [[3, 'honk', .7], [14.1, 'arp', .5]] },

    // NEST – mama bird flies home to her three babies
    { d: SD, draw: drive({ segs: segsStop(21), bx: BX,
        behind: (u, c) => {
          const [nx, ny] = nestTree(TREE - c.dist, 432, c.t);
          const open = u > 10.6 && u < 15 && Math.sin(c.t * 9) > 0;
          const up = clamp((u - 10.2) / .5);
          [-20, 0, 20].forEach((d, i) => babyBird(nx + d, ny - 4 - up * 9 + (i === 1 ? -3 : 0), c.t, i * .7, open));
          nest(nx, ny);
          // mama: flies in from the top right (7.8–10.4), sits on the nest, flies off again after Toet leaves
          const k = ease(clamp((u - 7.8) / 2.6)), out = ease(clamp((u - 22) / 3));
          const mx = lerp(1010, nx + 46, k) + out * 400, my = lerp(70, ny - 14, k) - Math.sin(k * Math.PI) * 30 - out * 180;
          if (u > 7.6) mamaBird(mx, my, c.t, k < 1 || out > 0, out > 0 ? -1 : 1);
        } }),
      says: [['toet', "What's up in the tree?", 7.4, 10.6, ...TB], ['bird', 'Tweet! This is our nest!', 11, 14.8, 740, 132],
             ['toet', 'A bird lives in a nest!', 15.4, 19.6, ...TB]],
      big: [['Nest!', 12.2, 15.6, 480, 88, 68, '#4cc9f0']],
      sfx: [[2.5, 'honk', .5], [8, 'tweet', .6], [10.7, 'peep', .7], [12.2, 'tada', .45], [13.4, 'peep', .6], [15.6, 'chime:C6', .4], [21.6, 'honk', .5]] },

    // HIVE – busy bees fly around their hive, one comes to say hello
    { d: SD, draw: drive({ segs: segsStop(21), bx: BX,
        behind: (u, c) => {
          const px = HIVE - c.dist;
          [[-150, '#ff5d8f', 0], [-110, '#ffffff', 1], [-75, '#b388ff', 2], [95, '#ff9ec4', 3], [140, '#ffffff', 4], [175, '#ff5d8f', 5]].forEach(([d, col, ph]) => flower(px + d, 436, col, c.t, ph));
          beehive(px, 436);
          [[0, 1], [2.1, -1], [4.2, 1]].forEach(([ph, dir]) => { const a = c.t * 1.6 + ph;
            bee(px + Math.sin(a) * 95 * dir, 300 + Math.sin(a * 2) * 28, c.t, .9, Math.cos(a) * dir > 0 ? -1 : 1, ph); });
        },
        front: (u, c) => {   // the friendly bee visits Toet and buzzes back
          const k = ease(clamp((u - 7.6) / 1.6)), back = ease(clamp((u - 15) / 2));
          if (u < 7.6 || back >= 1) return;
          const px = HIVE - c.dist, bx = lerp(px, 470, k) + (px - 470) * back, by = lerp(300, 300, k) + Math.sin(c.t * 3) * 10 - Math.sin(k * Math.PI) * 50;
          bee(bx, by, c.t, 1.25, back > 0 ? -1 : 1, 7);
        } }),
      says: [['toet', 'Bzz, bzz! Who is that?', 7.6, 10.8, ...TB], ['bee', "I'm a bee! I live in a hive!", 11.2, 15, 620, 200],
             ['toet', 'A bee lives in a hive!', 15.4, 19.6, ...TB]],
      big: [['Hive!', 12.4, 15.8, 480, 88, 68, '#ffd23f']],
      sfx: [[2.5, 'honk', .5], [7.6, 'buzz:2.4', .55], [12.4, 'tada', .45], [15.2, 'buzz:1.6', .4], [15.8, 'chime:E6', .4], [21.6, 'honk', .5]] },

    // BURROW – peekaboo! a rabbit pops out of the hill, then two little ones
    { d: SD, draw: drive({ segs: segsStop(21), bx: BX,
        behind: (u, c) => {
          const px = HILL - c.dist, gy = 434;
          hill(px, gy);
          const hx = px + 40, hy = gy - 46;
          const pop = u < 9 ? 0 : u < 9.6 ? ease((u - 9) / .6) : 1;
          const kids = [[-34, 12.6], [34, 13.2]];
          // the hole: rabbits are clipped by its lower rim
          x.save(); x.beginPath(); x.rect(hx - 160, 0, 320, hy + 4); x.clip();
          kids.forEach(([dx, at]) => { const kp = ease(clamp((u - at) / .5)); if (kp > 0) rabbit(hx + dx, hy + 40 - kp * 40, c.t, .62, at); });
          if (u > 8.4) rabbit(hx, hy + 62 - pop * 62 - (u > 8.4 && u < 9 ? (u - 8.4) * 30 : 0), c.t, 1, 0);
          x.restore();
          ell(hx, hy + 4, 46, 12, '#3a2a1e', INK, 3);
          x.save(); x.beginPath(); x.ellipse(hx, hy + 4, 46, 12, 0, 0, Math.PI); x.clip(); x.fillStyle = '#7fcf86'; x.fillRect(hx - 50, hy + 4, 100, 20); x.restore();
          x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.ellipse(hx, hy + 4, 46, 12, 0, 0, Math.PI); x.stroke();
        } }),
      says: [['toet', 'Look! A hole in the hill!', 7.2, 10.2, ...TB], ['rabbit', 'Peekaboo! This is my burrow!', 10.6, 14.6, 640, 180],
             ['toet', 'A rabbit lives in a burrow!', 15.2, 19.6, ...TB]],
      big: [['Burrow!', 12.6, 15.8, 480, 88, 68, '#ff9ec4']],
      sfx: [[2.5, 'honk', .5], [9, 'boing', .5], [11, 'laugh', .4], [12.6, 'pop', .6], [13.2, 'pop', .6], [12.7, 'tada', .4], [15.8, 'chime:G6', .4], [21.6, 'honk', .5]] },

    // POND – a fish jumps out with a splash
    { d: SD, draw: drive({ segs: segsStop(21), bx: BX,
        behind: (u, c) => {
          const px = POND - c.dist, gy = 434;
          pond(px, gy, c.t);
          // two jumps: 7.6–8.8 and 16.4–17.6 (arc from left to right)
          [[7.6, 1.2, -60], [16.4, 1.2, 10]].forEach(([a, d, ox]) => { const k = (u - a) / d; if (k > 0 && k < 1) {
            fish(px + ox + lerp(-40, 40, k) * -1, gy - 10 - Math.sin(k * Math.PI) * 110, c.t, lerp(-.9, .9, k) * -1 + 0, .95); } });
          splash(px - 20, gy - 8, (u - 8.8) / 1); splash(px + 70, gy - 8, (u - 7.5) / .8); splash(px + 50, gy - 8, (u - 17.6) / 1);
          // fish peeks out of the water while talking
          const peek = clamp((u - 10.4) / .5) * clamp((15.6 - u) / .5);
          if (peek > 0) { x.save(); x.beginPath(); x.rect(px - 200, 0, 400, gy - 6); x.clip(); fish(px + 10, gy + 6 - peek * 16, c.t, -.35, .95); x.restore();
            bubbles(px - 6, gy - 30, c.t, peek); }
        } }),
      says: [['toet', 'Splash! What was that?', 9, 12.2, ...TB], ['fish', 'Blub! I live in the pond!', 12.4, 16, 700, 250],
             ['toet', 'A fish lives in a pond!', 16.4, 20.4, ...TB]],
      big: [['Pond!', 13, 16.2, 480, 88, 68, '#ff9f5a']],
      sfx: [[2.5, 'honk', .5], [8.7, 'splash', .7], [11, 'blub', .5], [13, 'tada', .45], [17.6, 'splash', .5], [18, 'chime:C7', .4], [21.6, 'honk', .5]] },

    // HOME – evening: Toet drives home to his garage, charges up, recap in the sky, goodnight
    { d: 46, draw: drive({ segs: [[0, 120], [3, 120], [7, 0]], bx: BX, skyP: u => lerp(.46, .64, ease(clamp((u - 8) / 10))), near: 'trees',
        behind: (u, c) => { const n = c.night || 0; garage(HOME + 600 - c.dist, 434, u > 12 ? 1 : 0); T.charger(HOME + 420 - c.dist, 436, 1.1); },
        truck: u => ({ sleepy: clamp((u - 37.4) / 2), happy: u > 7 && u < 36 }),
        front: (u, c) => {
          const cx = HOME + 420 - c.dist, plug = clamp((u - 10.4) / .8);
          if (plug > 0) { x.strokeStyle = INK; x.lineWidth = 5; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx, 378);
            const ex = lerp(cx, c.Tk.bx + 142, plug), ey = lerp(378, c.Tk.by - 35, plug); x.quadraticCurveTo((cx + ex) / 2, Math.max(ey, 378) + 40, ex, ey); x.stroke(); }
          if (u > 11 && u < 18.6) { const lvl = lerp(.2, 1, clamp((u - 11.4) / 5.4)); x.save(); x.globalAlpha = clamp((u - 11) / .4) * clamp((18.6 - u) / .4); A.battery(lvl, c.t, lvl < 1, 390, 40); x.restore(); }
          if (u > 16.8 && u < 18.6) C.bigText('FULL!', 480, 175, win(u, 16.8, 18.6, .25), 48, '#2fb36a');
        } }),
      says: [['toet', 'And where do I live?', 1.4, 5.2, ...TB], ['toet', 'In my cozy garage!', 7.2, 10.4, ...TB], ['toet', 'Time to charge up!', 11, 14.6, ...TB],
             ['toet', 'Goodnight, everyone!', 34.8, 38.4, ...TB]],
      after: (u) => recap(u, 20, 34.6),
      sfx: [[7.2, 'tada', .4], [11.2, 'clank', .5], [12, 'arp', .35], [16.8, 'chime:C7', .45],
            [20, 'tweet', .4], [22.4, 'buzz:1', .35], [24.8, 'boing', .35], [27.2, 'blub', .4], [39, 'yawn', .5]] },
  ],
});
