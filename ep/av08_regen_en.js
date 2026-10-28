process.env.TOET_LANG = 'en';
// Toet op avontuur 8: Toet in de regen
const C = require('../lib/common'), T = require('../lib/toet');
const St = require('../lib/story'), A = require('../lib/av');
const { x, W, H, clamp, ease, lerp, hash, win, circ } = C;
const { drive, GY } = St;
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 175];
const COLS = [["Red", '#e63946'], ["Orange", '#ff9f1c'], ["Yellow", '#ffd23f'], ["Green", '#2fb36a'], ["Blue", '#3a86ff'], ["Purple", '#9b5de5']];

function wiper(Tk, t, on) {
  if (!on) return;
  const a = -1.2 + (Math.sin(t * 6) * .5 + .5) * 1.1;
  x.save(); x.translate(Tk.bx + 168, Tk.by - 62); x.rotate(a); x.fillStyle = '#1d3557'; x.fillRect(-2, -40, 4, 40); x.restore();
}
function splashUp(cx, k) {
  if (k <= 0 || k >= 1) return;
  for (let i = 0; i < 16; i++) { const a = Math.PI + .2 + hash(i) * (Math.PI - .4), v = 120 + hash(i + 3) * 160, tt = k * 1.1;
    x.globalAlpha = 1 - k; circ(cx + Math.cos(a) * v * tt, GY - 10 + Math.sin(a) * v * tt + 320 * tt * tt, 5 + hash(i) * 5, '#9fd3ff'); }
  x.globalAlpha = 1;
}
const S3 = T.motion([[0, 150]]), PUDS = [5, 11, 17].map(t => S3.distAt(t) + 290 + 120 + 9000);
const sun = a => { if (a > 0) { x.globalAlpha = a; circ(820, 90, 60, 'rgba(255,220,90,.35)'); circ(820, 90, 40, '#ffd23f'); x.globalAlpha = 1; } };

St.episode({
  title: ["Toet in the Rain", 76], sub: "Toet's Adventures", thumb: ["Toet in the Rain", "Splash! A rainbow!"],
  music: { kind: 'toet', shift: 4 },
  shots: [
    { d: 24, draw: drive({ segs: [[0, 150]],
        beforeTruck: (u, c) => { const d = clamp((u - 9) / 12); A.darkSky(d); A.greyClouds(c.t, d); } }),
      says: [['toet', "What a lovely day!", 2.5, 6, ...TB], ['toet', "Hey... it's getting dark.", 12, 16, ...TB], ['toet', "Is it going to rain?", 17, 21, ...TB]],
      sfx: [[3, 'honk', .7]] },
    { d: 34, draw: drive({ segs: [[0, 120]], dist0: 4000,
        onRoad: (u, c) => { for (let i = 0; i < 8; i++) { const px = ((i * 260 - c.dist) % 2080 + 2080) % 2080 - 100; x.fillStyle = 'rgba(120,170,220,.75)'; x.beginPath(); x.ellipse(px, GY - 10 + (i % 2) * 14, 55, 9, 0, 0, 7); x.fill(); } },
        beforeTruck: (u, c) => { A.darkSky(1); A.greyClouds(c.t, 1); }, front: (u, c) => { wiper(c.Tk, c.t, u > 5); A.rainStreaks(c.t, clamp(u / 2)); } }),
      says: [['toet', "It's raining!", 1.5, 4.5, ...TB], ['toet', "Wipers on!", 5, 8.5, ...TB], ['toet', "I actually like the rain!", 23, 28, ...TB]],
      big: [['Swish swash!', 9, 13, 480, 90, 66, '#ffffff'], ["Say it with me!", 13.4, 17, 480, 90, 58, '#ffd23f'], ['Swish swash!', 17.4, 22, 480, 90, 66, '#ffffff']],
      sfx: [[0, 'rain:34', .7], ...Array.from({ length: 28 }, (_, i) => [5.3 + i * 1.047, 'swish:.35', .35])] },
    { d: 26, draw: drive({ segs: [[0, 150]], dist0: 9000,
        onRoad: (u, c) => PUDS.forEach(p => { const px = p - c.dist; x.fillStyle = 'rgba(120,170,220,.85)'; x.beginPath(); x.ellipse(px, GY - 10, 80, 13, 0, 0, 7); x.fill(); }),
        beforeTruck: (u, c) => { A.darkSky(lerp(1, .6, u / 26)); A.greyClouds(c.t, lerp(1, .6, u / 26)); }, front: (u, c) => { wiper(c.Tk, c.t, true); A.rainStreaks(c.t, lerp(1, .4, u / 26)); [5, 11, 17].forEach(t => splashUp(c.bx + 140, (u - t) / 1.1)); } }),
      says: [['toet', "Yay!", 6.2, 9, ...TB], ['toet', "Another one!", 12.2, 15, ...TB], ['toet', 'Hahaha!', 18.2, 21, ...TB]],
      big: [["Splash! 1", 5, 7.5, 480, 90, 72, '#9fd3ff'], ["Splash! 2", 11, 13.5, 480, 90, 72, '#9fd3ff'], ["Splash! 3", 17, 19.5, 480, 90, 72, '#9fd3ff'], ["Three puddles!", 21.5, 25, 480, 90, 62, '#ffffff']],
      sfx: [[0, 'rain:26', .5], [5, 'splash', 1], [6.3, 'laugh', .5], [11, 'splash', 1], [17, 'splash', 1], [18.3, 'laugh', .6]] },
    { d: 30, draw: drive({ segs: [[0, 120], [4, 0]], dist0: 15000, bx: 150,
        sky: (u, c) => { A.rainbow(clamp((u - 3) / 4));
          COLS.forEach(([n, col], i) => { const st = 8 + i * 2.6; if (u > st && u < 24) { x.save(); x.globalAlpha = clamp((u - st) / .4); x.beginPath(); x.arc(640, 470, 330 - i * 14, Math.PI, 0); x.lineWidth = 16; x.strokeStyle = col; x.stroke(); x.restore(); } }); },
        beforeTruck: (u, c) => { const d = 1 - clamp(u / 4); A.darkSky(.6 * d); A.greyClouds(c.t, .6 * d); },
        front: (u, c) => { A.rainStreaks(c.t, .4 * (1 - clamp(u / 4))); } }),
      says: [['toet', "Look! A rainbow!", 3.5, 7.5, 370, 250], ['toet', "No rain, no rainbow!", 24.5, 29, 370, 250]],
      big: COLS.map(([n, col], i) => [n + '!', 8 + i * 2.6, 10.4 + i * 2.6, 480, 90, 76, col]),
      sfx: [[3.5, 'arp', .6], ...COLS.map((_, i) => [8 + i * 2.6, 'chime:' + ['C5', 'D5', 'E5', 'G5', 'A5', 'C6'][i], .8])] },
    { d: 14, draw: drive({ segs: [[0, 150]], dist0: 20000, sky: () => A.rainbow(1, 300, 470, 300) }),
      says: [['toet', "Toot toot! Bye, rainbow!", 1, 5, (u, c) => c.bx + 200, (u, c) => c.Tk.by - 175]], sfx: [[5.2, 'honk', .8]] },
  ],
});
