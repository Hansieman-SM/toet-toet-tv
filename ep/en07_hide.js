// Little Truck Toet – In, On, Under! (English story episode: hide-and-seek with Kiki the kitten – position words IN / ON / UNDER)
const C = require('../lib/common'), T = require('../lib/toet'), A = require('../lib/av');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, circ, ell, rr, INK } = C;
const { drive } = St;
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 175];
const BX = 160, GY = 436;
const SD = 27;
const segsStop = (go) => [[0, 150], [4, 150], [7, 0], [go, 0], [go + 2.5, 150], [go + 6, 150]];
const stopAt = (off, go = 21) => T.motion(segsStop(go)).distAt(7) + off;     // world x that sits at screen x = off while Toet waits
const PROP = stopAt(660);
const S1 = [[0, 150], [5, 150], [8, 0], [22.5, 0], [25, 150]], KIKI1 = T.motion(S1).distAt(8) + 650;
const S5 = [[0, 150], [4, 150], [7, 0], [24, 0], [26.5, 150]], BUSH = T.motion(S5).distAt(7) + 300, KIKI5 = T.motion(S5).distAt(7) + 650;
const mH = T.motion([[0, 120], [3, 120], [7, 0]]), HOME = mH.distAt(7);
const blinkAt = (t, off = 0) => (t + off) % 3.8 > 3.65;
const cheeks = (cx, cy, r) => { x.fillStyle = 'rgba(255,110,120,.45)'; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); };
const ORANGE = '#ffa94d', STRIPE = '#e8782a';

// ---------- Kiki the kitten (original design): local origin = ground under her paws ----------
// o: { pose 'sit'|'lie', mouth 0..1, sleepy, look -1..1, tail (wag speed) }
function kitten(px, gy, t, s, o = {}) {
  x.save(); x.translate(px, gy); x.scale(s * (o.flip ? -1 : 1), s);
  const wag = Math.sin(t * (o.tail || 2.4)) ;
  x.lineCap = 'round'; x.lineJoin = 'round';
  const tailPath = () => { x.beginPath();
    if (o.pose === 'lie') { x.moveTo(34, -12); x.quadraticCurveTo(52, -6, 48 + wag * 4, 14); x.quadraticCurveTo(44, 30, 52 + wag * 6, 40); }
    else { x.moveTo(16, -8); x.quadraticCurveTo(42, -10, 40 + wag * 4, -34); x.quadraticCurveTo(38 + wag * 8, -50, 30 + wag * 10, -52); } };
  tailPath(); x.strokeStyle = INK; x.lineWidth = 13; x.stroke(); tailPath(); x.strokeStyle = ORANGE; x.lineWidth = 7.5; x.stroke();
  let hx = 0, hy = -58;
  if (o.pose === 'lie') {
    ell(8, -15, 34, 15, ORANGE, INK, 3);
    x.strokeStyle = STRIPE; x.lineWidth = 3; [0, 12, 24].forEach(d => { x.beginPath(); x.moveTo(d - 2, -29); x.lineTo(d + 2, -21); x.stroke(); });
    ell(-14, -2, 9, 5, '#fff3e0', INK, 2.5); ell(4, -2, 9, 5, '#fff3e0', INK, 2.5);
    hx = -26; hy = -34;
  } else {
    ell(0, -24, 22, 24, ORANGE, INK, 3);
    ell(0, -18, 12, 15, '#fff3e0');
    x.strokeStyle = STRIPE; x.lineWidth = 3; [[-19, -30], [19, -30], [-20, -20], [20, -20]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(a + (a < 0 ? 6 : -6), b + 1); x.stroke(); });
    ell(-9, -3, 7, 5, '#fff3e0', INK, 2.5); ell(9, -3, 7, 5, '#fff3e0', INK, 2.5);
  }
  x.save(); x.translate(hx, hy); x.rotate((o.look || 0) * .12);
  [[-1], [1]].forEach(([d]) => { x.fillStyle = ORANGE; x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.moveTo(d * 21, -6); x.lineTo(d * 17, -29); x.lineTo(d * 4, -17); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#ffc2d1'; x.beginPath(); x.moveTo(d * 17, -9); x.lineTo(d * 16, -22); x.lineTo(d * 9, -15); x.closePath(); x.fill(); });
  ell(0, 0, 25, 21, ORANGE, INK, 3);
  x.strokeStyle = STRIPE; x.lineWidth = 3; [-6, 0, 6].forEach(d => { x.beginPath(); x.moveTo(d, -19); x.lineTo(d, -12); x.stroke(); });
  ell(0, 9, 11, 7, '#fff3e0');
  const lk = (o.look || 0) * 2;
  [-9, 9].forEach(ex => {
    if (o.sleepy > .5) { x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.arc(ex, -2, 4.5, .2, Math.PI - .2); x.stroke(); }
    else if (blinkAt(t, 1.3)) { x.fillStyle = INK; x.fillRect(ex - 5, -3, 10, 2.5); }
    else { circ(ex, -2, 5.2, '#7bd389', INK, 2); circ(ex + lk, -2, 3, INK); circ(ex + lk + 1.2, -3.6, 1.2, '#fff'); }
  });
  x.fillStyle = '#ff8fab'; x.beginPath(); x.moveTo(-3.5, 5); x.lineTo(3.5, 5); x.lineTo(0, 9); x.closePath(); x.fill();
  x.strokeStyle = INK; x.lineWidth = 2;
  if ((o.mouth || 0) > .05) { x.fillStyle = '#c2405a'; x.beginPath(); x.ellipse(0, 13, 4, 2 + o.mouth * 3.5, 0, 0, 7); x.fill(); x.stroke(); }
  else { x.beginPath(); x.moveTo(0, 9); x.quadraticCurveTo(-3, 13, -6, 11); x.moveTo(0, 9); x.quadraticCurveTo(3, 13, 6, 11); x.stroke(); }
  x.lineWidth = 1.5; [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(([d, e]) => { x.beginPath(); x.moveTo(d * 12, 8 + e * 1.5); x.lineTo(d * 27, 6 + e * 4); x.stroke(); });
  cheeks(-15, 7, 3.5); cheeks(15, 7, 3.5);
  x.restore();
  x.restore();
}

// ---------- hiding places (local origin = ground centre) ----------
function boxBack() { x.fillStyle = '#b77b45'; x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.moveTo(-70, -92); x.lineTo(-56, -104); x.lineTo(56, -104); x.lineTo(70, -92); x.closePath(); x.fill(); x.stroke(); }
function boxFront() {
  x.fillStyle = '#d99a5b'; x.strokeStyle = INK; x.lineWidth = 3; rr(-70, -92, 140, 92, 4); x.fill(); x.stroke();
  x.fillStyle = '#e8b47c'; [[-1], [1]].forEach(([d]) => { x.beginPath(); x.moveTo(d * 70, -92); x.lineTo(d * 98, -118); x.lineTo(d * 82, -122); x.lineTo(d * 56, -96); x.closePath(); x.fill(); x.stroke(); });
  x.strokeStyle = '#b77b45'; x.lineWidth = 6; x.beginPath(); x.moveTo(0, -90); x.lineTo(0, -60); x.stroke();
  x.fillStyle = '#fff6e5'; rr(-34, -50, 68, 26, 6); x.fill(); x.strokeStyle = INK; x.lineWidth = 2; x.stroke();
  x.strokeStyle = '#ff7a45'; x.lineWidth = 3; x.beginPath(); x.moveTo(-8, -32); x.lineTo(0, -42); x.lineTo(8, -32); x.moveTo(0, -42); x.lineTo(0, -28); x.stroke();   // "this side up" arrow
}
function wall() {
  x.fillStyle = '#e9d8c4'; x.strokeStyle = INK; x.lineWidth = 3; rr(-150, -72, 300, 72, 4); x.fill(); x.stroke();
  x.strokeStyle = '#c9b49c'; x.lineWidth = 2.5;
  for (let r = 0; r < 3; r++) { const y = -72 + (r + 1) * 18; if (r < 2) { x.beginPath(); x.moveTo(-148, y); x.lineTo(148, y); x.stroke(); }
    for (let k = -150 + (r % 2 ? 25 : 0); k < 150; k += 50) if (k > -150) { x.beginPath(); x.moveTo(k, y - 18); x.lineTo(k, y); x.stroke(); } }
  x.beginPath(); x.moveTo(-148, -18); x.lineTo(148, -18); x.stroke();
  x.fillStyle = '#d6c2aa'; x.strokeStyle = INK; x.lineWidth = 3; rr(-158, -82, 316, 14, 5); x.fill(); x.stroke();
  [[-120, '#ff9ec4'], [118, '#ffd23f']].forEach(([a, col]) => { x.strokeStyle = '#2f8a46'; x.lineWidth = 3; x.beginPath(); x.moveTo(a, 0); x.lineTo(a - 4, -26); x.stroke(); circ(a - 4, -30, 6, col); });
}
function benchBack() {
  x.fillStyle = '#7a5134'; x.strokeStyle = INK; x.lineWidth = 3;
  [-96, 96].forEach(a => { rr(a - 6, -150, 12, 150, 3); x.fill(); x.stroke(); });
  x.fillStyle = '#4cae6a'; [-146, -124].forEach(y => { rr(-118, y, 236, 16, 5); x.fill(); x.stroke(); });
}
function benchSeat() {
  x.fillStyle = '#7a5134'; x.strokeStyle = INK; x.lineWidth = 3; [-104, 104].forEach(a => { rr(a - 6, -88, 12, 88, 3); x.fill(); x.stroke(); });
  x.fillStyle = '#4cae6a'; rr(-124, -98, 248, 18, 5); x.fill(); x.stroke();
}
function basketBack() { ell(0, -46, 60, 12, '#8a5a2b', INK, 3); ell(0, -46, 52, 8, '#ff9ec4'); }
function basketFront() {
  x.fillStyle = '#c98a4a'; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(-60, -46); x.quadraticCurveTo(-58, 0, -40, 0); x.lineTo(40, 0); x.quadraticCurveTo(58, 0, 60, -46); x.quadraticCurveTo(0, -34, -60, -46); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = '#a06a32'; x.lineWidth = 2.5; for (let k = -44; k <= 44; k += 14) { x.beginPath(); x.moveTo(k, -38); x.lineTo(k * .8, -4); x.stroke(); }
  x.beginPath(); x.moveTo(-56, -22); x.quadraticCurveTo(0, -12, 56, -22); x.stroke();
}
function bush(px, gy, t) {
  const sw = Math.sin(t * 1.3) * 2;
  [['#2f9e5a', 4], ['#46b86e', 0]].forEach(([col, g]) => { x.fillStyle = col; x.beginPath();
    [[-34, -26, 30], [0, -44, 36], [34, -26, 30], [0, -18, 34]].forEach(([a, b, r]) => { x.moveTo(px + a + sw + r + g, gy + b); x.arc(px + a + sw, gy + b, r + g, 0, 7); }); x.fill(); });
  [[-20, -40], [16, -54], [30, -20]].forEach(([a, b]) => circ(px + a + sw, gy + b, 4.5, '#ff7a45'));
}
const at = (px, gy, s, fn) => { x.save(); x.translate(px, gy); x.scale(s, s); fn(); x.restore(); };

// kitten jumps away to the right (from (px,gy), leaving at time a)
function runAway(px, gy, u, a, t) {
  const k = (u - a) / 1.6; if (k < 0 || k > 1) return false;
  kitten(px + k * 520, gy - Math.abs(Math.sin(k * Math.PI * 4)) * 26 - (k < .25 ? Math.sin(k / .25 * Math.PI) * 50 : 0), t, 1, { tail: 9 });
  return true;
}

// recap: three position words with a little picture under each
function recap(u, a, end) {
  const items = [['IN', '#ff9f5a', () => { boxBack(); kitten(0, -70, u, 1, {}); boxFront(); }],
                 ['ON', '#4cc9f0', () => { wall(); kitten(0, -82, u, 1.2, { pose: 'lie' }); }],
                 ['UNDER', '#7bd389', () => { benchBack(); kitten(0, 0, u, 1, {}); benchSeat(); }]];
  items.forEach(([w, col, pic], i) => {
    const k = clamp((u - a - i * 3) / .5) * clamp((end - u) / .8); if (k <= 0) return;
    const cx = 230 + i * 250;
    x.save(); x.globalAlpha = k; x.fillStyle = 'rgba(255,255,255,.85)'; x.strokeStyle = INK; x.lineWidth = 3; rr(cx - 100, 104, 200, 100, 18); x.fill(); x.stroke();
    at(cx, 194, .52, pic); x.restore();
    C.bigText(w, cx, 66, k, 48, col);
  });
}
const kTalk = c => c.talk('kiki');

St.episode({
  title: ['In, On, Under!', 64], sub: 'Hide-and-seek with Kiki', accent: '#ff9f1c',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'hide', shift: 0 },
  shots: [
    // INTRO – Kiki wants to play hide-and-seek, Toet counts with his eyes closed
    { d: 25, draw: drive({ segs: S1, bx: BX,
        truck: u => (u > 16.4 && u < 19.8 ? { sleepy: 1, mouth: [16.8, 17.8, 18.8].some(a => u > a && u < a + .45) ? .8 : 0 } : { happy: u > 8 }),
        behind: (u, c) => { const px = KIKI1 - c.dist;
          if (u < 17) kitten(px, GY, c.t, 1, { mouth: kTalk(c), look: u > 8 ? -1 : 0, tail: u > 9 ? 5 : 2.4 });
          else runAway(px, GY, u, 17, c.t); } }),
      says: [['toet', "Hi! I'm Little Truck Toet!", 5.2, 8.8, ...TB], ['kiki', "Hi Toet! Let's play hide-and-seek!", 9.2, 12.8, 640, 250],
             ['toet', "Okay! I'll count. Ready?", 13.2, 16.3, ...TB], ['toet', 'Ready or not, here I come!', 19.9, 23.4, ...TB]],
      big: [['1', 16.8, 17.7, 520, 120, 96, '#ffd23f'], ['2', 17.8, 18.7, 600, 120, 96, '#ff9f5a'], ['3', 18.8, 19.7, 680, 120, 96, '#ff5d8f']],
      sfx: [[2, 'honk', .6], [9.2, 'meow', .6], [16.8, 'chime:C6', .45], [17.8, 'chime:E6', .45], [18.8, 'chime:G6', .45], [17.1, 'tiptoe', .5], [22.6, 'honk', .5]] },

    // IN – a tail wiggles out of a box … Kiki is IN the box!
    { d: SD, draw: drive({ segs: segsStop(21), bx: BX,
        behind: (u, c) => { const px = PROP - c.dist;
          const pop = u < 10.6 ? 0 : ease(clamp((u - 10.6) / .5)), out = u > 19.6;
          at(px, GY, 1, boxBack);
          if (!out) {
            if (pop <= 0 && u > 7.2) {   // only the tail tip peeks out over the edge
              const w = Math.sin(c.t * 6); x.save(); x.lineCap = 'round'; x.beginPath(); x.moveTo(px + 30, GY - 80); x.quadraticCurveTo(px + 40 + w * 8, GY - 110, px + 34 + w * 12, GY - 128);
              x.strokeStyle = INK; x.lineWidth = 13; x.stroke(); x.strokeStyle = ORANGE; x.lineWidth = 7.5; x.stroke(); x.restore(); }
            kitten(px, GY + 4 - pop * 94, c.t, 1, { mouth: kTalk(c), look: -1 });
          }
          at(px, GY, 1, boxFront);
          if (out) runAway(px, GY - 90, u, 19.6, c.t);
        } }),
      says: [['toet', 'Where is Kiki?', 7.4, 10.4, ...TB], ['kiki', 'Here I am! IN the box!', 10.9, 14.6, 690, 210],
             ['toet', 'Kiki is IN the box!', 15.2, 19.3, ...TB]],
      big: [['IN', 12, 15.6, 480, 90, 84, '#ff9f5a']],
      sfx: [[2.5, 'honk', .5], [7.6, 'rustle', .5], [10.6, 'boing', .5], [11, 'meow:1.1', .55], [12, 'tada', .45], [15.6, 'chime:C6', .4], [19.6, 'tiptoe', .5], [21.6, 'honk', .5]] },

    // ON – Kiki lies ON the wall, her tail dangles down
    { d: SD, draw: drive({ segs: segsStop(21), bx: BX,
        behind: (u, c) => { const px = PROP - c.dist, top = GY - 82;
          at(px, GY, 1, wall);
          if (u < 19.6) { const up = u > 10.6; kitten(px + 10, top - (up && u < 11 ? Math.sin((u - 10.6) / .4 * Math.PI) * 20 : 0), c.t, 1.05,
            { pose: up ? 'sit' : 'lie', mouth: kTalk(c), look: -1, sleepy: up ? 0 : 1, tail: up ? 3 : 5 }); }
          else runAway(px + 10, top, u, 19.6, c.t);
        } }),
      says: [['toet', 'Hmm… I see a tail!', 7.4, 10.4, ...TB], ['kiki', 'You found me! ON the wall!', 10.9, 14.6, 700, 200],
             ['toet', 'Kiki is ON the wall!', 15.2, 19.3, ...TB]],
      big: [['ON', 12, 15.6, 480, 90, 84, '#4cc9f0']],
      sfx: [[2.5, 'honk', .5], [10.6, 'pop', .6], [11, 'meow:1.2', .55], [12, 'tada', .45], [15.6, 'chime:E6', .4], [19.6, 'tiptoe', .5], [21.6, 'honk', .5]] },

    // UNDER – two green eyes in the shadow … Kiki is UNDER the bench!
    { d: SD, draw: drive({ segs: segsStop(21), bx: BX,
        behind: (u, c) => { const px = PROP - c.dist;
          at(px, GY, 1, benchBack);
          const peek = u < 10.6 ? 0 : ease(clamp((u - 10.6) / .5));
          if (u < 19.6) {
            kitten(px - peek * 30, GY, c.t, 1, { mouth: kTalk(c), look: -1, tail: 4 });
            const sh = .62 * (1 - peek); if (sh > 0) { x.fillStyle = `rgba(30,40,60,${sh})`; x.beginPath(); x.ellipse(px, GY - 40, 92, 48, 0, 0, 7); x.fill();
              if (u > 7 && !blinkAt(c.t, .5)) { circ(px - 9, GY - 60, 3.6, '#c6f7a8'); circ(px + 9, GY - 60, 3.6, '#c6f7a8'); } }
          }
          at(px, GY, 1, benchSeat);
          if (u >= 19.6) runAway(px - 30, GY, u, 19.6, c.t);
        } }),
      says: [['toet', 'Where is Kiki now?', 7.4, 10.4, ...TB], ['kiki', 'Peekaboo! UNDER the bench!', 10.9, 14.6, 680, 220],
             ['toet', 'Kiki is UNDER the bench!', 15.2, 19.3, ...TB]],
      big: [['UNDER', 12, 15.6, 480, 90, 84, '#7bd389']],
      sfx: [[2.5, 'honk', .5], [7.4, 'twinkle:A6', .4], [10.6, 'boing', .45], [11, 'meow:.95', .55], [12, 'tada', .45], [15.6, 'chime:G6', .4], [19.6, 'tiptoe', .5], [21.6, 'honk', .5]] },

    // TOET HIDES – behind a tiny bush … much too big!
    { d: 27, draw: drive({ segs: S5, bx: BX,
        truck: u => ({ happy: u > 19 }),
        behind: (u, c) => { const px = KIKI5 - c.dist, wk = ease(clamp((u - 10.6) / 2));
          if (u > 10.6) kitten(px + (1 - wk) * 380, GY - (wk < 1 ? Math.abs(Math.sin(u * 9)) * 8 : 0), c.t, 1,
            { mouth: kTalk(c), look: u > 13 && u < 16 ? Math.sin(u * 2) : -1, flip: u > 13.2 && u < 14.6 }); },
        front: (u, c) => bush(BUSH - c.dist, 532, c.t) }),
      says: [['toet', "My turn to hide! Shh…", 1.2, 4.6, ...TB], ['toet', 'Behind this little bush!', 7.4, 10.4, ...TB],
             ['kiki', 'Where is Toet?', 12.8, 15.8, 690, 250], ['kiki', "I see you, Toet! You're too big!", 16.2, 20, 620, 250],
             ['toet', 'Hee hee! You found me!', 20.4, 23.8, ...TB]],
      sfx: [[7.2, 'tiptoe', .45], [11, 'meow', .45], [16.4, 'laugh', .45], [20.6, 'laugh', .35], [23.6, 'honk', .5]] },

    // HOME – evening: Kiki rides ON Toet, hops IN her basket, recap, goodnight
    { d: 44, draw: drive({ segs: [[0, 120], [3, 120], [7, 0]], bx: BX, skyP: u => lerp(.46, .62, ease(clamp((u - 8) / 12))), near: 'trees',
        behind: (u, c) => { const hx = HOME + 640 - c.dist; A.house(hx + 40, GY - 2, .9, '#a0c4ff', '#e8735a'); },
        truck: u => ({ happy: u > 7 && u < 37, sleepy: clamp((u - 38) / 1.5) }),
        front: (u, c) => {
          const hx = HOME + 640 - c.dist;      // basket + Kiki drawn in front of the evening tint (like Toet)
          at(hx - 120, GY, 1, basketBack);
          if (u > 10.2) kitten(hx - 120, GY - 26, c.t, 1, { mouth: kTalk(c), look: -1, sleepy: u > 36 ? 1 : 0, tail: u > 36 ? .8 : 2.4 });
          at(hx - 120, GY, 1, basketFront);
          if (u > 10.2) return;
          const sx = c.Tk.bx + 25, sy = c.Tk.by - 120, ex = HOME + 520 - c.dist, ey = GY - 26;
          const k = clamp((u - 9) / 1.2);
          kitten(lerp(sx, ex, k), lerp(sy, ey, k) - Math.sin(k * Math.PI) * 90, c.t, 1, { mouth: kTalk(c), look: k > 0 ? 1 : 0, tail: 3 });
        } }),
      says: [['toet', "Let's go home, Kiki!", 1.2, 4.6, ...TB], ['kiki', "Wheee! I'm ON your roof!", 5, 8.6, 300, 200],
             ['kiki', "And now I'm IN my basket!", 10.6, 14.2, 640, 250], ['toet', 'What a fun game!', 14.6, 17.8, ...TB],
             ['kiki', 'Thank you, Toet!', 30.2, 33.4, 640, 260], ['toet', 'Goodnight, Kiki!', 34, 37.6, ...TB]],
      after: (u) => recap(u, 18.2, 29.6),
      sfx: [[9, 'boing', .5], [10.3, 'pop', .5], [10.8, 'meow:1.15', .5], [18.2, 'chime:C6', .45], [21.2, 'chime:E6', .45], [24.2, 'chime:G6', .45],
            [30.4, 'meow', .45], [36.4, 'purr:2.4', .5], [38.6, 'yawn', .45]] },
  ],
});
