// Little Truck Toet – Let's Find Shapes! (English story episode: circle, triangle, square, star)
const C = require('../lib/common'), T = require('../lib/toet'), A = require('../lib/av');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, circ, rr, INK } = C;
const { drive, GY } = St;
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 175];
const TR = [(u, c) => c.bx + 330, (u, c) => c.Tk.by - 175]; // to the right of the present on the truck
const BX = 200;

// one motion profile for the three daytime stops: drive in, stop at 7 s, drive away at the end
const segsStop = (go) => [[0, 150], [4, 150], [7, 0], [go, 0], [go + 2.5, 150], [go + 6, 150]];
const m2 = T.motion(segsStop(25)), BALL = 2000 + m2.distAt(7) + 640;
const m3 = T.motion(segsStop(25)), HOUSE = 7000 + m3.distAt(7) + 740;
const m4 = T.motion(segsStop(28)), GIFT = 12000 + m4.distAt(7) + 660;

// glowing dashed outline that "draws itself" (k 0..1) and then marches
function glowPath(path, k, t, col = '#ff7a45') {
  if (k <= 0) return;
  x.save(); x.lineJoin = 'round'; x.lineCap = 'round'; x.globalAlpha = clamp(k * 2);
  path(); x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 12; x.setLineDash([18, 12]); x.lineDashOffset = -t * 30; x.stroke();
  path(); x.strokeStyle = col; x.lineWidth = 6; x.stroke();
  x.restore();
}
const pulse = (u, a, b) => win(u, a, b, .4) * (1 + Math.sin(u * 6) * .06);

function ball(px, gy, t) {
  const r = 34, cy = gy - r - Math.abs(Math.sin(t * 2.2)) * 6;
  x.fillStyle = 'rgba(0,0,0,.15)'; x.beginPath(); x.ellipse(px, gy - 2, 30, 6, 0, 0, 7); x.fill();
  x.save(); x.translate(px, cy); x.rotate(Math.sin(t * 2.2) * .15);
  ['#ff5d8f', '#ffd23f', '#4cc9f0', '#2fb36a', '#ff7a45', '#9b5de5'].forEach((c, i) => { x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, r, i * Math.PI / 3, (i + 1) * Math.PI / 3); x.closePath(); x.fillStyle = c; x.fill(); });
  circ(0, 0, 9, '#fff'); x.beginPath(); x.arc(0, 0, r, 0, 7); x.strokeStyle = INK; x.lineWidth = 4; x.stroke();
  x.fillStyle = 'rgba(255,255,255,.5)'; x.beginPath(); x.ellipse(-12, -14, 9, 5, -.6, 0, 7); x.fill();
  x.restore(); return cy;
}
function gift(px, py, s = 1, lid = 0) {
  x.save(); x.translate(px, py); x.scale(s, s);
  x.fillStyle = '#9b5de5'; x.fillRect(-35, -70, 70, 70); x.strokeStyle = INK; x.lineWidth = 4; x.strokeRect(-35, -70, 70, 70);
  x.fillStyle = '#ffd23f'; x.fillRect(-7, -70, 14, 70);
  x.save(); x.translate(0, -70 - lid * 26); x.rotate(-lid * .5);
  x.fillStyle = '#b57cf0'; x.fillRect(-40, -14, 80, 16); x.strokeRect(-40, -14, 80, 16); x.fillStyle = '#ffd23f'; x.fillRect(-7, -14, 14, 16);
  x.fillStyle = '#ffd23f'; x.strokeStyle = INK; x.lineWidth = 3;
  [-1, 1].forEach(d => { x.beginPath(); x.ellipse(d * 14, -22, 15, 9, d * .5, 0, 7); x.fill(); x.stroke(); }); circ(0, -18, 6, '#ff7a45', INK, 3);
  x.restore(); x.restore();
}
function starPath(cx, cy, R, rot = 0) {
  x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + rot + i * Math.PI / 5, r = i % 2 ? R * .45 : R; x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } x.closePath();
}
function star(cx, cy, R, t, face = true) {
  const g = x.createRadialGradient(cx, cy, 0, cx, cy, R * 2.2); g.addColorStop(0, 'rgba(255,230,120,.55)'); g.addColorStop(1, 'rgba(255,230,120,0)');
  x.fillStyle = g; x.beginPath(); x.arc(cx, cy, R * 2.2, 0, 7); x.fill();
  starPath(cx, cy, R, Math.sin(t * 1.5) * .06); x.fillStyle = '#ffd23f'; x.fill(); x.strokeStyle = INK; x.lineWidth = 4; x.stroke();
  if (face && R > 25) {
    const bl = t % 3.3 > 3.15, e = R * .16;
    x.fillStyle = INK; [-1, 1].forEach(d => { if (bl) x.fillRect(cx + d * e * 1.6 - 5, cy - 2, 10, 3); else circ(cx + d * e * 1.6, cy - 1, 4.5, INK); });
    x.beginPath(); x.arc(cx, cy + 6, 8, .2, Math.PI - .2); x.lineWidth = 3; x.stroke();
    x.fillStyle = 'rgba(255,110,120,.5)'; [-1, 1].forEach(d => { x.beginPath(); x.arc(cx + d * e * 2.6, cy + 6, 5, 0, 7); x.fill(); });
  }
}
// the 4 shapes of the recap, popping in one by one in the night sky
function recap(u, t, a) {
  const items = [['Circle', '#ff5d8f'], ['Triangle', '#4cc9f0'], ['Square', '#9b5de5'], ['Star', '#ffd23f']];
  items.forEach(([name, col], i) => {
    const k = ease(clamp((u - a - i * 1.5) / .5)) * clamp((36.5 - u) / 1); if (k <= 0) return;
    const cx = 450 + i * 135, cy = 120 + Math.sin(t * 1.4 + i) * 5, s = k * (1 + Math.sin(clamp((u - a - i * 1.5) / .5) * Math.PI) * .2);
    x.save(); x.translate(cx, cy); x.scale(s, s); x.fillStyle = col; x.strokeStyle = '#fff'; x.lineWidth = 5;
    if (i === 0) { x.beginPath(); x.arc(0, 0, 34, 0, 7); }
    if (i === 1) { x.beginPath(); x.moveTo(0, -36); x.lineTo(38, 30); x.lineTo(-38, 30); x.closePath(); }
    if (i === 2) { x.beginPath(); x.rect(-31, -31, 62, 62); }
    if (i === 3) starPath(0, 0, 38);
    x.fill(); x.stroke(); x.restore();
    C.bigText(name, cx, 186, k, 26, '#ffffff');
  });
}
const onTruck = (c, lid = 0) => gift(c.bx + 50, c.Tk.by - 120, .9, lid);
const count = (nums, a, step = 1, size = 54, col = '#ffd23f') => nums.map(([n, px, py], i) => [String(n), a + i * step, a + i * step + 2.6, px, py, size, col]);

St.episode({
  title: ["Let's Find Shapes!", 66], sub: 'Little Truck Toet', accent: '#ff7a45',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'shapes', shift: 0 },
  shots: [
    { d: 20, draw: drive({ segs: [[0, 150]], bx: BX }),
      says: [['toet', "Hello! I'm Little Truck Toet!", 5.5, 10, ...TB], ['toet', "Today we go on a shape hunt!", 10.5, 15, ...TB]],
      big: [["Let's find shapes!", 15.5, 19.4, 480, 90, 62, '#ffd23f']],
      sfx: [[3, 'honk', .7], [15.6, 'arp', .5]] },

    // CIRCLE – a bouncy ball, and Toet's own wheels
    { d: 31, draw: drive({ segs: segsStop(25), dist0: 2000, bx: BX,
        behind: (u, c) => { c.ballY = ball(BALL - c.dist, 432, c.t); },
        front: (u, c) => {
          const px = BALL - c.dist;
          glowPath(() => { x.beginPath(); x.arc(px, c.ballY, 50, 0, 7); }, pulse(u, 15.5, 23), c.t);
          const kw = pulse(u, 20, 24.6);
          [-30, 70, 180].forEach(wx => glowPath(() => { x.beginPath(); x.arc(c.bx + wx, c.Tk.by + 4, 30, 0, 7); }, kw, c.t, '#ffd23f'));
        } }),
      says: [['toet', 'Look! A ball!', 7.5, 10.5, ...TB], ['toet', 'What shape is it?', 11, 15, ...TB], ['toet', 'My wheels are circles too!', 20, 24.6, ...TB]],
      big: [['?', 12, 15.2, 640, 300, 80, '#ffffff'], ['Circle!', 15.5, 19.8, 480, 90, 78, '#ff5d8f']],
      sfx: [[3, 'honk', .6], [12, 'boing', .5], [15.6, 'tada', .6], [20.2, 'chime', .5], [26, 'honk', .5]] },

    // TRIANGLE – the roof of a little house
    { d: 31, draw: drive({ segs: segsStop(25), dist0: 7000, bx: BX,
        behind: (u, c) => A.house(HOUSE - c.dist, 412, .8, '#ffe5a0', '#4cc9f0'),
        front: (u, c) => {
          const px = HOUSE - c.dist;
          glowPath(() => { x.beginPath(); x.moveTo(px - 118, 292); x.lineTo(px, 222); x.lineTo(px + 118, 292); x.closePath(); }, pulse(u, 15.5, 25), c.t);
        } }),
      says: [['toet', 'Look! A little house!', 7.5, 10.5, ...TB], ['toet', 'What shape is the roof?', 11, 15, ...TB], ['toet', 'Three sides! One, two, three!', 20.3, 24.8, ...TB]],
      big: [['?', 12, 15.2, 740, 160, 80, '#ffffff'], ['Triangle!', 15.5, 19.8, 480, 90, 78, '#4cc9f0'],
            ...count([[1, 652, 240], [2, 828, 240], [3, 740, 322]], 21.2, 1.1, 50)],
      sfx: [[3, 'honk', .6], [12, 'boing', .5], [15.6, 'tada', .6], [21.2, 'tick', .6], [22.3, 'tick', .6], [23.4, 'tick', .6], [26, 'honk', .5]] },

    // SQUARE – a present by the road, which Toet takes home
    { d: 33, draw: drive({ segs: segsStop(28), dist0: 12000, bx: BX,
        behind: (u, c) => { const jump = clamp((u - 25.2) / 1.2); if (jump <= 0) gift(GIFT - c.dist, 414, 1); },
        front: (u, c) => {
          const px = GIFT - c.dist, jump = clamp((u - 25.2) / 1.2);
          if (jump > 0 && jump < 1) gift(lerp(px, c.bx + 50, jump), lerp(414, c.Tk.by - 120, jump) - Math.sin(jump * Math.PI) * 110, lerp(1, .9, jump));
          if (jump >= 1) onTruck(c);
          glowPath(() => { x.beginPath(); x.rect(px - 46, 333, 92, 92); }, pulse(u, 15.5, 24.8), c.t);
        } }),
      says: [['toet', 'Ooh! A present!', 7.5, 10.5, ...TB], ['toet', 'What shape is it?', 11, 15, ...TB],
             ['toet', 'Four sides! One, two, three, four!', 20.2, 24.8, ...TB], ['toet', "Let's take it home!", 25.2, 28.2, ...TR]],
      big: [['?', 12, 15.2, 660, 280, 80, '#ffffff'], ['Square!', 15.5, 19.8, 480, 90, 78, '#9b5de5'],
            ...count([[1, 660, 312], [2, 728, 380], [3, 660, 448], [4, 592, 380]], 21, 1, 46)],
      sfx: [[3, 'honk', .6], [12, 'boing', .5], [15.6, 'tada', .6], [21, 'tick', .6], [22, 'tick', .6], [23, 'tick', .6], [24, 'tick', .6], [25.3, 'boing', .7], [29, 'honk', .5]] },

    // STAR – night at home: the present holds a little star that floats up; recap; goodnight
    { d: 42, draw: drive({ segs: [[0, 120], [3, 120], [6, 0]], dist0: 20000, bx: BX, skyP: .66, near: 'trees',
        truck: u => ({ sleepy: clamp((u - 33) / 2), happy: u > 9 && u < 20 }),
        behind: (u, c) => A.house(c.bx + 560 + Math.max(0, 6 - u) * 60, 412, .8, '#ffe5a0', '#4cc9f0'),
        front: (u, c) => {
          const lid = ease(clamp((u - 7) / .6)), rise = ease(clamp((u - 7.6) / 2.6));
          onTruck(c, lid);
          if (rise > 0) {
            const sx0 = c.bx + 50, sy0 = c.Tk.by - 150, sx1 = 250, sy1 = 120;
            const R = lerp(16, 52, rise), cx = lerp(sx0, sx1, rise), cy = lerp(sy0, sy1, rise) + Math.sin(c.t * 1.5) * 4 * rise;
            star(cx, cy, R, c.t); c.star = [cx, cy];
            if (u > 9.5 && u < 13.5) C.sparkles(cx, cy, c.t, 8, 80);
          }
          recap(u, c.t, 19.5);
          if (u > 35) ['Z', 'z', 'z'].forEach((z, i) => C.bigText(z, c.bx + 210 + i * 24 + Math.sin(c.t + i) * 4, c.Tk.by - 150 - i * 28 - ((c.t * 8) % 20), clamp((u - 35 - i * .5) / .6), 34 - i * 6, '#ffffff'));
        } }),
      says: [['toet', "We're home! Let's open it!", 1, 5.6, ...TR], ['toet', 'Wow! What shape is that?', 10.2, 14, ...TR],
             ['toet', 'Circle, triangle, square, star!', 19.5, 25.6, ...TR],
             ['toet', 'Goodnight, shapes! Goodnight, star!', 28, 33, ...TR]],
      big: [['Star!', 14.4, 18.8, 480, 240, 78, '#ffd23f'],
            ...count([[1, 250, 50], [2, 318, 100], [3, 296, 182], [4, 204, 182], [5, 182, 100]], 15.6, .55, 34, '#ffffff')],
      sfx: [[7, 'pop', .7], [7.7, 'whoosh', .5], [9.6, 'twinkle', .6], [14.5, 'tada', .6],
            [19.5, 'chime:C6', .5], [21, 'chime:E6', .5], [22.5, 'chime:G6', .5], [24, 'chime:C7', .5], [33.5, 'yawn', .6]] },
  ],
});
