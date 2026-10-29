// Toet op avontuur 5: Toet in de wasstraat
const C = require('../lib/common'), T = require('../lib/toet'), F = require('../lib/toetfriends');
const St = require('../lib/story'), A = require('../lib/av');
const { x, W, H, clamp, ease, lerp, hash, win, rr, circ } = C;
const { drive, place, GY } = St;
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 175];
const M1 = T.motion([[0, 150]]), PUD = M1.distAt(8) + 290 + 120;

function puddle(px) { x.fillStyle = '#7a5134'; x.beginPath(); x.ellipse(px, GY - 12, 90, 14, 0, 0, 7); x.fill(); x.fillStyle = '#9c6b45'; x.beginPath(); x.ellipse(px - 20, GY - 15, 40, 5, 0, 0, 7); x.fill(); }
function splashDrops(cx, cy, k, col = '#7a5134') {
  if (k <= 0 || k >= 1) return;
  for (let i = 0; i < 18; i++) { const a = Math.PI + hash(i) * Math.PI, v = 100 + hash(i + 3) * 180, tt = k * 1.1;
    x.globalAlpha = 1 - k; circ(cx + Math.cos(a) * v * tt, cy + Math.sin(a) * v * tt + 300 * tt * tt, 6 + hash(i) * 6, col); }
  x.globalAlpha = 1;
}
function washBuilding(px, interior = false) {
  x.fillStyle = '#4361ee'; rr(px - 210, 170, 420, 280, 22); x.fill();
  x.fillStyle = '#d8f3ff'; x.fillRect(px - 180, 215, 360, 235);
  x.font = C.FONT(30); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('WASSTRAAT', px, 195);
}
function brush(px, top, bot, t, col) {
  x.fillStyle = col; rr(px - 30, top, 60, bot - top, 30); x.fill();
  x.save(); rr(px - 30, top, 60, bot - top, 30); x.clip();
  x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 4; const off = (t * 120) % 22;
  for (let y = top - 22; y < bot + 22; y += 22) { x.beginPath(); x.moveTo(px - 32, y + off); x.lineTo(px + 32, y + off + 10); x.stroke(); }
  x.restore();
}
function foam(t, k) {
  if (k <= 0) return;
  const cols = ['rgba(255,255,255,.9)', 'rgba(255,183,213,.9)', 'rgba(170,220,255,.9)', 'rgba(255,240,170,.9)'];
  for (let i = 0; i < 46; i++) { if (hash(i + 40) > k) continue; const px = 140 + hash(i) * 520 + Math.sin(t * 2 + i) * 6, py = 300 + hash(i + 7) * 170 - ((t * 15 + i * 7) % 30);
    circ(px, py, 9 + hash(i + 2) * 16, cols[i % 4]); }
}

St.episode({
  title: ['Toet in de wasstraat', 72], sub: 'Toet op avontuur', thumb: ['Toet in de', 'wasstraat!'],
  music: { kind: 'toet', shift: 5 },
  shots: [
    { d: 24, draw: drive({ segs: [[0, 150]], onRoad: (u, c) => { if (u < 9) puddle(PUD - c.dist); },
        front: (u, c) => { A.mud(c.Tk, clamp((u - 8) / .3)); splashDrops(c.bx + 120, GY - 20, (u - 8) / 1.2); } }),
      says: [['toet', 'Lalala, wat een mooie dag!', 2.5, 6.5, ...TB], ['toet', 'Oeps! Ik ben helemaal vies!', 10, 14, ...TB], ['toet', 'Ik moet naar de wasstraat.', 16, 20, ...TB]],
      big: [['Splets!', 8, 10.5, 480, 100, 90, '#a0673f']], sfx: [[8, 'splash', 1], [8.2, 'bump', .5], [10, 'laugh', .3]] },
    { d: 30, draw: drive({ segs: [[0, 150], [3, 150], [6, 0]], dist0: 3000, bx: 60,
        behind: () => {}, front: (u, c) => {
          A.mud(c.Tk, 1);
          washBuilding(560); brush(470, 230, 445, u < 5 ? c.t : 0, '#ff5d8f'); brush(650, 230, 445, u < 5 ? c.t : 0, '#4cc9f0');
          const bk = clamp((u - 1) / 3); place(F.bus, lerp(640, 810, ease(bk)), GY + 6, .52, false, u, { mouth: c.talk('bas'), blink: c.blink(1) });
          if (u > 1 && u < 9) A.sparkles(lerp(640, 810, ease(bk)), GY - 60, c.t, 10, 120);
        } }),
      says: [['bas', 'Hoi Toet! Ik kom net uit de wasstraat.', 6, 10, 780, 270, 24], ['toet', 'Die borstels zijn zo groot... ik ben een beetje bang.', 10.5, 15.5, 330, 250, 23],
             ['bas', 'Het kriebelt alleen maar. Echt waar!', 16, 20, 780, 270, 24], ['toet', 'Oké... ik probeer het!', 25, 29, 330, 250]],
      big: [['Durf jij het, Toet?', 20.4, 24.8, 480, 90, 60, '#ffffff']], sfx: [[1, 'arp', .4], [16, 'laugh', .4]] },
    { d: 34, draw: (u, c) => {
        x.fillStyle = '#cfe8ff'; x.fillRect(0, 0, W, H);
        x.fillStyle = '#b6d9ff'; for (let i = 0; i < 16; i++) for (let j = 0; j < 9; j++) if ((i + j) % 2) x.fillRect(i * 60, j * 60, 60, 60);
        x.fillStyle = '#6c757d'; x.fillRect(0, 470, W, 70); x.fillStyle = '#495057'; x.fillRect(0, 466, W, 6);
        // waterstralen van boven
        x.strokeStyle = 'rgba(80,160,255,.6)'; x.lineWidth = 3;
        for (let i = 0; i < 30; i++) { const px = 60 + i * 30, py = ((c.t * 400 + i * 37) % 300) + 40; x.beginPath(); x.moveTo(px, py); x.lineTo(px - 3, py + 22); x.stroke(); }
        x.fillStyle = '#adb5bd'; x.fillRect(0, 20, W, 24);
        const bx = 330;
        x.save(); x.translate(480, 470); x.scale(1.15, 1.15); x.translate(-480, -(T.ROAD + 46));
        const Tk = T.truck({ t: c.t, dist: u * 15, moving: true, bx, mouth: Math.max(c.talk('toet'), u > 6 && u < 22 ? .4 + Math.abs(Math.sin(u * 7)) * .4 : 0), happy: true });
        A.mud(Tk, 1 - clamp((u - 6) / 18));
        x.restore();
        foam(c.t, clamp((u - 2) / 4) * (1 - clamp((u - 25) / 4)));
        const bp = Math.sin(u * .9);
        brush(170 + bp * 40, 120, 470, c.t, '#ff5d8f'); brush(800 - bp * 40, 120, 470, c.t, '#4cc9f0');
        x.save(); x.translate(480, 105 + Math.sin(u * 1.3) * 30); x.rotate(Math.PI / 2); brush(0, -300, 300, c.t, '#ffd23f'); x.restore();
      },
      says: [['toet', 'Hihi! Dat kriebelt!', 6, 10, 520, 260], ['toet', 'Hahaha!', 13, 16, 520, 260], ['toet', 'Het is helemaal niet eng!', 24, 28.5, 520, 260]],
      big: [['Schrob, schrob, schrob!', 16.6, 21.6, 480, 478, 54, '#ffffff']],
      sfx: [[0, 'brushes:30', .8], [1, 'spray:26', .6], [6, 'laugh', .7], [13, 'laugh', .7]] },
    { d: 28, draw: drive({ segs: [[0, 120], [6, 0]], dist0: 6000, bx: 200,
        front: (u, c) => { A.sparkles(c.bx + 75, c.Tk.by - 60, c.t, 12, 170); place(F.bus, 800, GY + 6, .55, true, 1, { flip: true, mouth: c.talk('bas'), blink: c.blink(1) }); } }),
      says: [['bas', 'Zie je wel? Het was leuk!', 8.5, 12.5, 790, 270, 24], ['toet', 'Ja! Nieuwe dingen zijn soms best leuk!', 13, 18, 420, 250, 25]],
      big: [['Blinkend schoon!', 2.5, 8, 480, 90, 70, '#ffd23f']], sfx: [[2.5, 'tada', .7], [3, 'chime:E6', .5], [18.5, 'honk', .8]] },
  ],
});
