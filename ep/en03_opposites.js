// Little Truck Toet – Big and Small, Fast and Slow! (English story episode: opposites big/small, fast/slow, up/down, loud/quiet)
const C = require('../lib/common'), T = require('../lib/toet'), F = require('../lib/toetfriends');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, circ, ell, INK } = C;
const { drive } = St;
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 175];
const BX = 160;

const segsStop = (go) => [[0, 150], [4, 150], [7, 0], [go, 0], [go + 2.5, 150], [go + 6, 150]];
const m2 = T.motion(segsStop(25)), POND = m2.distAt(7) + 690;
const m3 = T.motion(segsStop(27)), MEADOW = m3.distAt(7);
const m4 = T.motion(segsStop(25)), FIELD = m4.distAt(7) + 700;
const m5 = T.motion([[0, 120], [3, 120], [6, 0]]), NEST = m5.distAt(6) + 700;
const blinkAt = (t, off = 0) => (t + off) % 3.7 > 3.55;

// ---- characters (all original) ----
function pond(px, gy) {
  ell(px, gy - 6, 150, 22, '#7cc8ff', INK, 3); ell(px - 30, gy - 10, 60, 6, 'rgba(255,255,255,.5)');
  [[-150, 0], [140, -4], [-120, -6]].forEach(([dx, dy]) => { x.strokeStyle = '#2f8a46'; x.lineWidth = 4; x.lineCap = 'round';
    x.beginPath(); x.moveTo(px + dx, gy + dy); x.lineTo(px + dx - 6, gy + dy - 40); x.moveTo(px + dx + 6, gy + dy); x.lineTo(px + dx + 10, gy + dy - 34); x.stroke();
    ell(px + dx - 6, gy + dy - 44, 4, 10, '#8a5a2b'); });
}
// a duck that floats and bobs, with blinking eye (F.duck + eye overlay)
function duckBob(px, py, s, t, col, ph = 0, flip = false) {
  const bob = Math.sin(t * 2.4 + ph) * 2 * s / 2;
  F.duck(px, py + bob, s, col, flip);
  if (blinkAt(t, ph)) { const ex = px + (flip ? -21 : 21) * s, ey = py + bob - 35 * s; x.fillStyle = col; circ(ex, ey, 3 * s, col); x.fillStyle = INK; x.fillRect(ex - 3 * s, ey, 6 * s, 1.5 * s); }
}
// bunny (looks right), hop = 0..1 phase height
function bunny(px, gy, s, t, lift = 0, run = 0) {
  x.save(); x.translate(px, gy - lift); x.scale(s, s);
  const st = run ? Math.sin(t * 22) * .25 : 0;
  ell(0, lift / s + 2, 26, 4, 'rgba(0,0,0,.15)');
  ell(-26, -22, 9, 9, '#ffffff', INK, 2.5);                             // tail
  x.save(); x.rotate(st * .3); ell(0, -24, 30, 22, '#e8dccb', INK, 3); x.restore();
  ell(16, -6, 10, 6, '#e8dccb', INK, 2.5); ell(-14, -4, 12, 6, '#e8dccb', INK, 2.5);  // feet
  [[16, -.25], [30, .15]].forEach(([ex, r]) => { x.save(); x.translate(ex, -58); x.rotate(r - st * .6 - (run ? .6 : 0));
    ell(0, -22, 8, 24, '#e8dccb', INK, 2.5); ell(0, -22, 4, 16, '#ffb3c6'); x.restore(); });
  circ(26, -48, 18, '#e8dccb', INK, 3);
  if (blinkAt(t, 1.3)) { x.fillStyle = INK; x.fillRect(27, -53, 9, 2.5); } else { circ(32, -52, 3.6, INK); circ(33, -53.5, 1.2, '#fff'); }
  circ(43, -45, 3, '#ff8fab'); x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.arc(38, -42, 4, .2, Math.PI - .4); x.stroke();
  x.fillStyle = 'rgba(255,110,120,.45)'; x.beginPath(); x.arc(30, -42, 4, 0, 7); x.fill();
  x.restore();
}
// snail (looks right), crawls slowly
function snail(px, gy, s, t) {
  x.save(); x.translate(px, gy); x.scale(s, s);
  const sq = Math.sin(t * 1.6) * 2;
  ell(4, 2, 40, 4, 'rgba(0,0,0,.12)');
  x.fillStyle = '#b8e07a'; x.strokeStyle = INK; x.lineWidth = 3; x.beginPath();
  x.moveTo(-34 - sq, 0); x.quadraticCurveTo(-36 - sq, -16, -10, -14); x.lineTo(26, -16); x.quadraticCurveTo(44 + sq, -20, 46 + sq, -40);
  x.quadraticCurveTo(52 + sq, -52, 58 + sq, -40); x.quadraticCurveTo(60 + sq, -12, 40 + sq, 0); x.closePath(); x.fill(); x.stroke();
  [[46, -44, -62], [56, -44, -60]].forEach(([a, b, c]) => { x.beginPath(); x.moveTo(a + sq, b); x.lineTo(a + sq + (a - 50) * .4, c); x.stroke(); });
  [[41, -64], [59, -62]].forEach(([a, b]) => { circ(a + sq, b, 5, '#fff', INK, 2); if (blinkAt(t, .7)) { x.fillStyle = INK; x.fillRect(a + sq - 4, b - 1, 8, 2); } else circ(a + sq + 1, b, 2.4, INK); });
  x.beginPath(); x.arc(52 + sq, -34, 5, .2, Math.PI - .3); x.lineWidth = 2; x.stroke();
  // shell with spiral
  circ(-2, -34, 26, '#ff9f5a', INK, 3);
  x.strokeStyle = '#c4622b'; x.lineWidth = 3; x.beginPath(); for (let a = 0; a < 11; a += .2) { const r = 22 - a * 1.9; x.lineTo(-2 + Math.cos(a) * r, -34 + Math.sin(a) * r); } x.stroke();
  x.restore();
}
// friendly hot-air balloon with a face
function balloon(px, py, t, s = 1, look = 0) {
  x.save(); x.translate(px, py + Math.sin(t * 1.3) * 4); x.scale(s, s); x.rotate(Math.sin(t * .9) * .03);
  x.strokeStyle = INK; x.lineWidth = 2.5; [[-30, 52, -14, 92], [30, 52, 14, 92], [-8, 60, -6, 92], [8, 60, 6, 92]].forEach(([a, b, c, d]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.stroke(); });
  x.fillStyle = '#c98b4a'; C.rr(-20, 90, 40, 28, 6); x.fill(); x.stroke(); x.strokeStyle = '#8a5a2b'; x.beginPath(); x.moveTo(-20, 100); x.lineTo(20, 100); x.stroke();
  const cols = ['#ff5d8f', '#ffd23f', '#4cc9f0', '#ffd23f', '#ff5d8f'];
  x.save(); x.beginPath(); x.moveTo(-26, 58); x.bezierCurveTo(-90, 10, -78, -78, 0, -80); x.bezierCurveTo(78, -78, 90, 10, 26, 58); x.closePath(); x.clip();
  cols.forEach((c, i) => { x.fillStyle = c; x.fillRect(-90 + i * 36, -90, 36, 160); }); x.restore();
  x.strokeStyle = INK; x.lineWidth = 3.5; x.beginPath(); x.moveTo(-26, 58); x.bezierCurveTo(-90, 10, -78, -78, 0, -80); x.bezierCurveTo(78, -78, 90, 10, 26, 58); x.closePath(); x.stroke();
  // face
  ell(0, -12, 34, 26, 'rgba(255,255,255,.85)');
  if (blinkAt(t, 2)) { x.fillStyle = INK; x.fillRect(-16, -18, 10, 3); x.fillRect(6, -18, 10, 3); }
  else { circ(-11 + look, -17, 4.5, INK); circ(11 + look, -17, 4.5, INK); circ(-10 + look, -18.5, 1.5, '#fff'); circ(12 + look, -18.5, 1.5, '#fff'); }
  x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.arc(0, -6, 9, .2, Math.PI - .2); x.stroke();
  x.fillStyle = 'rgba(255,110,120,.55)'; [-1, 1].forEach(d => { x.beginPath(); x.arc(d * 22, -6, 5, 0, 7); x.fill(); });
  x.restore();
}
// tree with a nest and a baby bird (sleepy 0..1, awake bump)
function nestTree(px, gy, t, sleepy, startle) {
  x.save(); x.translate(px, gy);
  x.fillStyle = '#7a5134'; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(-18, 0); x.quadraticCurveTo(-10, -100, -6, -170); x.lineTo(10, -170); x.quadraticCurveTo(14, -100, 22, 0); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = '#7a5134'; x.lineWidth = 9; x.lineCap = 'round'; x.beginPath(); x.moveTo(2, -120); x.quadraticCurveTo(-50, -140, -95, -150); x.stroke();
  const sw = Math.sin(t * 1.1) * 3;
  [['#2f9e5a', 6], ['#3fb36a', 0]].forEach(([col, g]) => { x.fillStyle = col; x.beginPath();
    [[-60, -230, 62], [20, -250, 70], [80, -205, 52], [0, -195, 60], [-100, -195, 40]].forEach(([a, b, r]) => { x.moveTo(a + sw + r + g, b); x.arc(a + sw, b, r + g, 0, 7); }); x.fill(); });
  // nest on the branch
  const nx = -78, ny = -150;
  const jump = startle * 14;
  // baby bird
  x.save(); x.translate(nx, ny - 16 - jump);
  circ(0, 0, 17, '#7cc8ff', INK, 3);
  x.fillStyle = '#ffd23f'; x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.moveTo(14, -2); x.lineTo(26, 2); x.lineTo(14, 6); x.closePath(); x.fill(); x.stroke();
  if (sleepy > .5) { x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.arc(5, -4, 4, .2, Math.PI - .2); x.stroke(); }
  else { circ(6, -5, 3.8, INK); circ(7, -6, 1.3, '#fff'); }
  x.fillStyle = '#5aa8e6'; x.beginPath(); x.ellipse(-8, 6, 9, 6, -.4, 0, 7); x.fill();
  x.fillStyle = 'rgba(255,110,120,.5)'; x.beginPath(); x.arc(9, 4, 3.5, 0, 7); x.fill();
  x.restore();
  ell(nx, ny - 4, 30, 12, '#a4703a', INK, 3);
  x.strokeStyle = '#7a4a24'; x.lineWidth = 2; for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(nx - 26 + i * 9, ny - 10); x.lineTo(nx - 20 + i * 9, ny + 4); x.stroke(); }
  x.restore();
  return [px + nx, gy + ny - 16 - jump];
}
const zzz = (cx, cy, t, k) => ['z', 'z', 'Z'].forEach((z, i) => C.bigText(z, cx + i * 16, cy - i * 18 - ((t * 6) % 12), k, 20 + i * 5, '#ffffff'));

// recap: 4 opposite pairs appear in a 2x2 grid in the night sky
function recap(u, a, end) {
  const pairs = [['Big', 'Small', '#ff7a45'], ['Fast', 'Slow', '#4cc9f0'], ['Up', 'Down', '#ffd23f'], ['Loud', 'Quiet', '#ff5d8f']];
  pairs.forEach(([p, q, col], i) => {
    const k = clamp((u - a - i * 2.2) / .5) * clamp((end - u) / .8); if (k <= 0) return;
    const cx = i % 2 ? 690 : 310, cy = i < 2 ? 70 : 150;
    C.bigText(p, cx - 85, cy, k, 42, col); C.bigText('&', cx, cy, k, 30, '#ffffff'); C.bigText(q, cx + 85, cy, k, 42, col);
  });
}

St.episode({
  title: ['Big and Small, Fast and Slow!', 56], sub: 'Little Truck Toet', accent: '#2fb36a',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'opposites', shift: 0 },
  shots: [
    { d: 19, draw: drive({ segs: [[0, 150]], bx: BX }),
      says: [['toet', "Hi! I'm Little Truck Toet!", 5.5, 9.8, ...TB], ['toet', "Let's find opposites today!", 10.2, 14.6, ...TB]],
      big: [['Opposites!', 15, 18.4, 480, 90, 66, '#ffd23f']],
      sfx: [[3, 'honk', .7], [15.1, 'arp', .5]] },

    // BIG & SMALL – a big mama duck and a small duckling on a pond
    { d: 30, draw: drive({ segs: segsStop(25), bx: BX,
        behind: (u, c) => { const px = POND - c.dist; pond(px, 432);
          duckBob(px - 50, 432, 3.2, c.t, '#ffd23f', 0, true);
          duckBob(px + 95 + Math.sin(c.t * .8) * 6, 434, .8, c.t, '#ffe58a', 1.5, true); } }),
      says: [['toet', 'Look! Two ducks!', 7.5, 10.8, ...TB], ['toet', 'Mama Duck is big.', 11, 15, ...TB], ['toet', 'Baby Duck is small!', 15.5, 19.5, ...TB],
             ['toet', 'Big and small! Opposites!', 20, 24.4, ...TB]],
      big: [['Big!', 12, 15.4, 640, 205, 84, '#ff7a45'], ['Small!', 16.4, 19.8, 785, 355, 40, '#ff7a45']],
      sfx: [[3, 'honk', .6], [8, 'quack', .7], [12, 'tada', .5], [16.4, 'peep', .7], [20.2, 'chime:C6', .4], [26, 'honk', .5]] },

    // FAST & SLOW – a bunny zooms by, a snail crawls; then Toet drives slow ... and fast
    { d: 33, draw: drive({ segs: segsStop(27), bx: BX,
        behind: (u, c) => {
          const off = MEADOW - c.dist;
          // bunny zooms across twice (7.5-9.5 left->right, 11-12.6 again)
          [[7.8, 9.6], [11.6, 13.0]].forEach(([a, b]) => { if (u > a && u < b) { const k = (u - a) / (b - a); bunny(lerp(-80, 1040, k), 432, 1, c.t, Math.abs(Math.sin(k * 18)) * 18, 1);
            x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 3; [0, 1, 2].forEach(i => { const lx = lerp(-80, 1040, k) - 40 - i * 18; x.beginPath(); x.moveTo(lx, 400 + i * 10); x.lineTo(lx - 36, 400 + i * 10); x.stroke(); }); } });
          // bunny sits and waits at the right after its runs
          if (u >= 13.0 && u < 24) bunny(860, 432, 1, c.t, Math.abs(Math.sin(c.t * 4)) * 4);
          // the snail: crawls very slowly next to the road
          snail(off + 610 + Math.max(0, u - 7) * 3, 434, 1.05, c.t);
        } }),
      says: [['toet', 'Whoosh! Who was that?', 9.8, 13.2, ...TB], ['bunny', 'Me! I am fast!', 13.4, 16.6, 860, 285],
             ['snail', 'I am slow... very slow!', 18, 22, 660, 300], ['toet', 'Fast and slow! Opposites!', 22.4, 26.6, ...TB]],
      big: [['Fast!', 14.2, 17.6, 820, 200, 66, '#4cc9f0'], ['Slow...', 18.4, 22.4, 660, 215, 58, '#4cc9f0']],
      sfx: [[3, 'honk', .6], [7.8, 'whoosh', .6], [11.6, 'whoosh', .6], [14.2, 'boing', .5], [18.4, 'chime:G4', .4], [22.6, 'chime:C6', .4], [28, 'honk', .5]] },

    // UP & DOWN – a friendly hot-air balloon goes up, up, up ... and down, down, down
    { d: 31, draw: drive({ segs: segsStop(25), bx: BX,
        behind: (u, c) => {
          const px = FIELD - c.dist;
          const h = u < 11 ? 0 : u < 16 ? ease((u - 11) / 5) : u < 19.5 ? 1 : u < 24 ? 1 - ease((u - 19.5) / 4.5) : 0;
          ell(px, 432, 50 - h * 20, 6, `rgba(0,0,0,${.15 - h * .08})`);
          balloon(px, lerp(318, 120, h), c.t, .95, -2);
        } }),
      says: [['toet', 'Oh! A big balloon!', 7.5, 10.8, ...TB], ['balloon', 'Up I go!', 11, 13.6, 880, 240],
             ['balloon', 'And down I come!', 16.6, 19.4, 500, 110], ['toet', 'Up and down! Opposites!', 24.6, 28.4, ...TB]],
      big: [['Up!', 13.2, 18, 860, 80, 70, '#ffd23f'], ['Down!', 20.4, 24.2, 495, 265, 66, '#ffd23f']],
      sfx: [[3, 'honk', .6], [11, 'whoosh', .5], [13.3, 'chime:C6', .4], [14.6, 'chime:E6', .4], [15.9, 'chime:G6', .4],
            [20.5, 'chime:G5', .4], [21.8, 'chime:E5', .4], [23.1, 'chime:C5', .4], [26, 'honk', .5]] },

    // LOUD & QUIET – evening: Toet honks loud and wakes a baby bird ... then whispers. Night recap, goodnight
    { d: 44, draw: drive({ segs: [[0, 120], [3, 120], [6, 0]], bx: BX, skyP: u => lerp(.47, .63, ease(clamp((u - 14) / 8))), near: 'trees',
        truck: u => ({ sleepy: clamp((u - 37.6) / 2), happy: u > 20 && u < 37, hop: u > 7 && u < 7.6 ? Math.sin((u - 7) / .6 * Math.PI) * 6 : 0 }),
        behind: (u, c) => {
          const px = NEST - c.dist, startle = u > 7.2 && u < 9.5 ? Math.abs(Math.sin((u - 7.2) * 9)) * clamp((9.5 - u) / 1) : 0;
          const sleepy = u < 7.2 || u > 15.5 ? 1 : 0;  // wakes up at the loud honk, falls asleep again when Toet is quiet
          const [bx, by] = nestTree(px, 436, c.t, sleepy, startle);
          c.bird = [bx, by];
          if (sleepy && u < 7) zzz(bx + 22, by - 24, c.t, clamp((u - 1) / .6) * clamp((7 - u) / .2));
          if (sleepy && u > 16) zzz(bx + 22, by - 24, c.t, clamp((u - 16) / .6) * clamp((24 - u) / .5));
          if (u > 7.2 && u < 10) C.bigText('!', bx + 6, by - 44, win(u, 7.2, 10), 44, '#ff5d8f');
        } }),
      says: [['toet', 'What a pretty tree!', 1, 4.8, ...TB],
             ['toet', 'Oops! That was loud!', 9.8, 13.2, ...TB], ['toet', 'Shh... I will be quiet.', 13.6, 17.4, ...TB],
             ['toet', 'Loud and quiet! Opposites!', 20.6, 24.6, ...TB],
             ['toet', 'Goodnight, opposites!', 35.4, 38.6, ...TB]],
      big: [['TOOT!', 7.1, 9.6, 420, 190, 96, '#ff5d8f'], ['toot...', 17.8, 20.4, 420, 215, 34, '#ffffff']],
      after: (u) => recap(u, 25, 35.4),
      sfx: [[7.1, 'honk', 1.0], [7.3, 'peep', .7], [7.6, 'peep', .6], [17.8, 'honk', .15],
            [25, 'chime:C6', .45], [27.2, 'chime:E6', .45], [29.4, 'chime:G6', .45], [31.6, 'chime:C7', .45], [39.2, 'yawn', .5]] },
  ],
});
