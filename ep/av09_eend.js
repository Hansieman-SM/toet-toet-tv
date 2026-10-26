// Toet op avontuur 9: Toet zoekt mama eend
const C = require('../lib/common'), T = require('../lib/toet'), F = require('../lib/toetfriends');
const St = require('../lib/story'), A = require('../lib/av');
const { x, W, clamp, ease, lerp, hash, win, circ } = C;
const { drive, GY } = St;
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 175];
const BX = 200;
// eendje bovenop de laadbak
const onTruck = (c, talk) => F.duck(c.bx + 25, c.Tk.by - 120 - (talk > 0 ? Math.abs(Math.sin(c.t * 10)) * 5 : 0), 1, '#ffd23f');
const m1 = T.motion([[0, 150], [6, 150], [9, 0]]), DK = m1.distAt(9) + BX + 330;
const m3 = T.motion([[0, 150], [6, 150], [9.5, 0], [22, 0], [25, 150], [30, 150]]), COW = m3.distAt(9.5) + 620 + 4000;
const m4 = T.motion([[0, 150], [5, 150], [8.5, 0], [24, 0], [26, 150], [28, 150]]), SHEEP = m4.distAt(8.5) + 640 + 9000;
const m5 = T.motion([[0, 150], [4, 150], [8, 0]]), POND = m5.distAt(8) + 680 + 14000;
function pond(px, t, family = true) {
  x.fillStyle = '#4cc9f0'; x.beginPath(); x.ellipse(px, 428, 250, 32, 0, 0, 7); x.fill();
  x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 3; for (let i = 0; i < 3; i++) { x.beginPath(); x.ellipse(px - 60 + i * 60, 428, 30, 4, 0, 0, Math.PI); x.stroke(); }
  [[px - 200, 1], [px + 205, .8]].forEach(([rx, s]) => { x.strokeStyle = '#2d6a4f'; x.lineWidth = 3; for (let k = 0; k < 4; k++) { x.beginPath(); x.moveTo(rx + k * 7, 432); x.lineTo(rx + k * 7 - 4, 390 - k * 6); x.stroke(); } x.fillStyle = '#6b4f3a'; x.fillRect(rx + 6, 384, 6, 18); });
}

St.episode({
  title: ['Toet zoekt mama eend', 70], sub: 'Toet op avontuur', thumb: ['Toet zoekt', 'mama eend!'],
  music: { kind: 'toet', shift: 1 },
  shots: [
    { d: 22, draw: drive({ near: 'trees', segs: [[0, 150], [6, 150], [9, 0]], bx: BX,
        front: (u, c) => { const px = DK - c.dist, tk = c.talk('duck'); F.duck(px, GY - 4 - (tk ? Math.abs(Math.sin(c.t * 10)) * 6 : 0), 1.2, '#ffd23f', true); } }),
      says: [['toet', 'Hé! Wie is dat?', 9.5, 12, ...TB], ['duck', 'Piep piep! Ik ben mijn mama kwijt...', 12.5, 17, 560, 330, 24], ['toet', 'Ik help je zoeken!', 17.5, 21, ...TB]],
      sfx: [[7, 'honk', .5], [12.6, 'peep', .8], [14.5, 'peep', .6]] },
    { d: 12, draw: drive({ near: 'trees', segs: [[0, 0]], dist0: m1.distAt(9), bx: BX,
        front: (u, c) => { const k = clamp((u - 4) / 1.2); const px = lerp(DK - c.dist, c.bx + 25, k), py = lerp(GY - 4, c.Tk.by - 120, k) - Math.sin(k * Math.PI) * 120;
          if (k < 1) F.duck(px, py, lerp(1.2, 1, k), '#ffd23f', true); else onTruck(c, c.talk('duck')); } }),
      says: [['toet', 'Spring maar op mijn laadbak!', .5, 4, ...TB], ['duck', 'Piep! Joepie!', 6.5, 9.5, 300, 250]],
      sfx: [[4, 'boing', .7], [6.6, 'peep', .7]] },
    { d: 30, draw: drive({ near: 'trees', segs: [[0, 150], [6, 150], [9.5, 0], [22, 0], [25, 150], [30, 150]], dist0: 4000, bx: BX,
        behind: (u, c) => { const px = COW - c.dist; const moo = clamp(Math.sin(clamp((u - 14) / 1.4) * Math.PI) * 1.3); T.cow(px, 414, 1.8, c.t * 3, moo); },
        front: (u, c) => onTruck(c, c.talk('duck')) }),
      says: [['toet', 'Koe, heb jij mama eend gezien?', 10, 14, ...TB], ['cow', 'Boe! Nee, hier niet.', 15, 18.5, 640, 250], ['duck', 'Piep...', 19, 21.5, 260, 250]],
      big: [['Niet bij de koe...', 19, 22.5, 480, 90, 60, '#ffffff']], sfx: [[14.2, 'moo', 1, 0, 1.4], [19.1, 'peep', .5]] },
    { d: 28, draw: drive({ near: 'trees', segs: [[0, 150], [5, 150], [8.5, 0], [24, 0], [26, 150], [28, 150]], dist0: 9000, bx: BX,
        behind: (u, c) => { const px = SHEEP - c.dist; T.sheep(px, 412, 2.2); T.sheep(px + 90, 414, 1.6); },
        front: (u, c) => onTruck(c, c.talk('duck')) }),
      says: [['toet', 'Schaapjes, hebben jullie mama eend gezien?', 9, 13.5, ...TB], ['sheep', 'Bèèè... nee, hier ook niet.', 14, 17.5, 660, 260], ['toet', 'Waar kan ze zijn?', 18, 21.5, ...TB]],
      big: [['Zie jij mama eend?', 21.8, 26, 480, 90, 62, '#ffd23f']], sfx: [[14.1, 'baa', .9], [15.4, 'baa', .6]] },
    { d: 34, draw: drive({ near: 'trees', segs: [[0, 150], [4, 150], [8, 0]], dist0: 14000, bx: BX,
        behind: (u, c) => {
          const px = POND - c.dist; pond(px, c.t);
          const jump = clamp((u - 14) / 1.4);
          F.duck(px - 50 + Math.sin(c.t) * 6, 426, 2.1, '#f1f3f5');
          [0, 1, 2].forEach(i => F.duck(px + 50 + i * 40 + Math.sin(c.t + i) * 5, 428, .8, '#ffd23f'));
          if (jump >= 1) F.duck(px + 10 + Math.sin(c.t * 1.2) * 8, 428, .9, '#ffd23f');
        },
        front: (u, c) => {
          const jump = clamp((u - 14) / 1.4), px0 = c.bx + 25, py0 = c.Tk.by - 120, tx = POND - c.dist + 10, ty = 428;
          if (jump <= 0) onTruck(c, c.talk('duck')); else if (jump < 1) F.duck(lerp(px0, tx, jump), lerp(py0, ty, jump) - Math.sin(jump * Math.PI) * 120, lerp(1, .9, jump), '#ffd23f');
          if (u > 16 && u < 22) A.sparkles(POND - c.dist - 10, 400, c.t, 8, 90);
        } }),
      says: [['duck', 'Mama!', 9, 11.5, 300, 250], ['mama', 'Kwak kwak! Daar ben je!', 11.8, 15, 640, 320], ['mama', 'Dank je wel, Toet!', 18, 21.5, 640, 320], ['toet', 'Graag gedaan!', 22, 25, ...TB]],
      big: [['Samen gevonden!', 16, 20, 480, 90, 66, '#ffd23f']], sfx: [[9, 'peep', .8], [11.9, 'quack', .9], [14, 'boing', .6], [15.5, 'tada', .7], [18.1, 'quack', .7], [25.5, 'honk', .7]] },
  ],
});
