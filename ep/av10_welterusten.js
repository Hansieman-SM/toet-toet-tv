// Toet op avontuur 10: Welterusten, Toet
const C = require('../lib/common'), T = require('../lib/toet'), B = require('../lib/bwbase');
const St = require('../lib/story'), A = require('../lib/av');
const { x, clamp, ease, lerp, win, circ } = C;
const { drive, GY } = St;
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 175];
const m2 = T.motion([[0, 70], [4, 0], [24, 0], [28, 70], [32, 70]]), FARM = m2.distAt(4) + 600 + 3000;
const m4 = T.motion([[0, 70], [4, 0]]), HOME = m4.distAt(4) + 120 + 9000;
const STARS = [[160, 70], [440, 160], [560, 60], [710, 130], [870, 75]];

St.episode({
  title: ['Welterusten, Toet', 76], sub: 'Toet op avontuur', thumb: ['Welterusten,', 'Toet'],
  end: ['Welterusten!', 74], endSub: 'Tot morgen!', music: { kind: 'lullaby' },
  shots: [
    { d: 28, draw: drive({ segs: [[0, 70]], skyP: u => .44 + u / 300, near: 'trees' }),
      says: [['toet', 'De zon gaat onder...', 5, 9, ...TB], ['toet', 'Tijd om naar huis te gaan.', 11, 15, ...TB]] },
    { d: 32, draw: drive({ segs: [[0, 70], [4, 0], [24, 0], [28, 70], [32, 70]], dist0: 3000, skyP: u => .54 + u / 600, near: 'trees',
        behind: (u, c) => { const px = FARM - c.dist; T.cow(px, 414, 1.6, 0, clamp(Math.sin(clamp((u - 10) / 1.2) * Math.PI)), u > 14); T.sheep(px + 170, 412, 1.8); T.sheep(px + 240, 414, 1.3); } }),
      says: [['toet', 'Welterusten, koe.', 6, 9.5, ...TB], ['cow', 'Boe... welterusten, Toet.', 10, 13.5, 600, 260, 26], ['toet', 'Welterusten, schaapjes.', 15, 18.5, ...TB], ['sheep', 'Bèèè...', 19, 21.5, 790, 270]],
      sfx: [[10, 'moo:.85', .45], [19, 'baa', .4]] },
    { d: 30, draw: drive({ segs: [[0, 60]], dist0: 6000, skyP: .72, near: 'trees',
        front: (u, c) => STARS.forEach(([sx, sy], i) => { const k = clamp((u - 7 - i * 2.2) / .5); if (k > 0) B.star4(sx, sy, (18 + Math.sin(c.t * 2 + i) * 3) * ease(k), '#fff6b0'); }) }),
      says: [['toet', 'Kijk, de sterren! Tel je mee?', 2, 6.5, ...TB], ['toet', 'En daar is de maan.', 23, 27, ...TB]],
      big: [...['1', '2', '3', '4', '5'].map((n, i) => [n, 7 + i * 2.2, 8.8 + i * 2.2, STARS[i][0], STARS[i][1] + 50, 40, '#ffffff']), ['Vijf sterren!', 18.5, 22, 480, 230, 56, '#fff6b0']],
      sfx: STARS.map((_, i) => [7 + i * 2.2, 'twinkle:' + ['C6', 'D6', 'E6', 'G6', 'A6'][i], .5]) },
    { d: 34, draw: drive({ segs: [[0, 70], [4, 0]], dist0: 9000, skyP: .74, near: 'trees', noLeaves: true,
        behind: (u, c) => A.house(HOME + 720 - c.dist, 425, .85, '#8ecae6', '#264653'), noLight: u => u > 5,
        truck: u => Object.assign({ sleepy: clamp((u - 13) / 9) }, u > 10 && u < 11.6 ? { mouth: .9 } : {}),
        front: (u, c) => {
          const chx = HOME + 440 - c.dist; T.charger(chx, GY - 2, 1.1);
          const k = ease((u - 7) / 1);
          if (k > 0) { const ex = lerp(chx + 14, c.bx + 142, k), ey = lerp(GY - 30, c.Tk.by - 35, k); x.beginPath(); x.moveTo(chx + 14, GY - 30); x.quadraticCurveTo((chx + ex) / 2, GY + 10, ex, ey); x.lineWidth = 5; x.strokeStyle = '#1d3557'; x.stroke(); }
          if (u > 21) ['Z', 'z', 'z'].forEach((z, i) => C.bigText(z, c.bx + 200 + i * 24, 300 - i * 28 - ((c.t * 8) % 20), clamp((u - 21 - i * .5) / .6), 34 - i * 6, '#ffffff'));
        } }),
      says: [['toet', 'Ik ben zo moe...', 11.5, 15, ...TB], ['toet', 'Welterusten iedereen.', 16, 20, ...TB]],
      big: [['Welterusten, Toet', 23.5, 28.6, 480, 110, 60, '#fff6b0']],
      sfx: [[8, 'pop', .3], [10, 'yawn', .5]] },
  ],
});
