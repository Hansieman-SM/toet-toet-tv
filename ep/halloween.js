// Halloween Short-bron: Toet's Pumpkin Party (lief, niet eng): pompoenen tellen in de avondschemering, kinderen in kostuums.
const C = require('../lib/common'), T = require('../lib/toet'), K = require('../lib/kids');
const St = require('../lib/story'), A = require('../lib/av');
const { x, clamp, ease, lerp, hash } = C;
const { drive, GY } = St;
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 175];
const SPEED = 110, BX = 200;
const PT = [7, 10, 13, 16, 19];                       // pompoen passeert x≈640 op deze tijden
const PK = PT.map(t => 780 + SPEED * t);

function pumpkin(px, py, s, t, glow = 1) {
  x.save(); x.translate(px, py); x.scale(s, s);
  x.fillStyle = 'rgba(255,190,60,' + (.25 * glow) + ')'; x.beginPath(); x.arc(0, -26, 46, 0, 7); x.fill();
  [[-18, 22], [18, 22], [0, 26]].forEach(([dx, rw]) => { x.fillStyle = '#ff8c1a'; x.beginPath(); x.ellipse(dx, -26, rw, 26, 0, 0, 7); x.fill(); });
  x.strokeStyle = '#e06d00'; x.lineWidth = 2.5; [-9, 9].forEach(dx => { x.beginPath(); x.ellipse(dx, -26, 9, 25, 0, 0, 7); x.stroke(); });
  x.fillStyle = '#4f772d'; x.beginPath(); x.roundRect(-4, -60, 8, 12, 3); x.fill();
  x.fillStyle = '#ffd23f';
  [-11, 11].forEach(dx => { x.beginPath(); x.moveTo(dx - 6, -30); x.lineTo(dx, -40); x.lineTo(dx + 6, -30); x.closePath(); x.fill(); });
  x.beginPath(); x.arc(0, -22, 14, .15, Math.PI - .15); x.closePath(); x.fill();
  x.restore();
}
function bat(px, py, s, t, i) {
  const f = Math.sin(t * 9 + i) * .6;
  x.save(); x.translate(px, py); x.scale(s, s); x.fillStyle = '#6b4e9b';
  [-1, 1].forEach(d => { x.save(); x.scale(d, 1); x.rotate(-f * .5); x.beginPath(); x.moveTo(6, 0); x.quadraticCurveTo(22, -16, 34, -6); x.quadraticCurveTo(28, 0, 30, 6); x.quadraticCurveTo(20, 2, 16, 8); x.quadraticCurveTo(12, 2, 6, 4); x.fill(); x.restore(); });
  x.beginPath(); x.arc(0, 0, 9, 0, 7); x.fill();
  x.beginPath(); x.moveTo(-7, -5); x.lineTo(-5, -14); x.lineTo(-1, -7); x.moveTo(7, -5); x.lineTo(5, -14); x.lineTo(1, -7); x.fill();
  x.fillStyle = '#fff'; [-3.5, 3.5].forEach(d => { x.beginPath(); x.arc(d, -1, 2.4, 0, 7); x.fill(); });
  x.restore();
}
function bats(t) { for (let i = 0; i < 4; i++) { const px = ((t * 45 + i * 260) % 1160) - 100, py = 90 + i * 28 + Math.sin(t * 1.3 + i * 2) * 14; bat(px, py, .9 - i * .1, t, i); } }
function dusk(u) { x.fillStyle = 'rgba(70,30,110,' + (.18) + ')'; x.fillRect(0, 0, 960, 540); }
// kostuums bovenop een kind (oorsprong = voeten, hoofd ~ y -80)
function witchHat() { x.fillStyle = '#5a2d82'; x.beginPath(); x.ellipse(0, -96, 30, 7, 0, 0, 7); x.fill(); x.beginPath(); x.moveTo(-17, -98); x.quadraticCurveTo(0, -150, 14, -132); x.lineTo(17, -98); x.closePath(); x.fill(); x.fillStyle = '#ffd23f'; x.fillRect(-16, -104, 32, 6); }
function catEars() { x.fillStyle = '#2b2d42'; [-1, 1].forEach(d => { x.beginPath(); x.moveTo(d * 8, -100); x.lineTo(d * 20, -120); x.lineTo(d * 24, -96); x.closePath(); x.fill(); }); x.fillStyle = '#ff9ec4'; [-1, 1].forEach(d => { x.beginPath(); x.moveTo(d * 12, -101); x.lineTo(d * 19, -113); x.lineTo(d * 21, -99); x.closePath(); x.fill(); }); }
function pumpkinHat() { x.fillStyle = '#ff8c1a'; x.beginPath(); x.ellipse(0, -100, 22, 10, 0, Math.PI, 0); x.fill(); x.fillStyle = '#4f772d'; x.fillRect(-3, -116, 6, 8); }
function kidAt(k, px, py, s, p, hat) { x.save(); x.translate(px, py); x.scale(s, s); K.kid(k, p); if (hat) hat(); x.restore(); }
function bucket(px, py) { x.fillStyle = '#ff8c1a'; x.beginPath(); x.roundRect(px - 11, py - 18, 22, 18, 6); x.fill(); x.strokeStyle = '#2b2d42'; x.lineWidth = 2; x.beginPath(); x.arc(px, py - 18, 10, Math.PI, 0); x.stroke(); }

St.episode({
  title: ["Toet's Pumpkin Party", 70], sub: 'Happy Halloween!', thumb: ["Toet's Pumpkin", 'Party!'],
  end: ['Happy Halloween!', 72], endSub: 'See you next time!', accent: '#ff8c1a', music: { kind: 'toet', shift: -3 },
  shots: [
    { d: 25, draw: drive({ segs: [[0, SPEED]], skyP: .53, near: 'trees', bx: BX,
        sky: (u, c) => { bats(c.t); },
        behind: (u, c) => PK.forEach((p, i) => { const px = p - c.dist; if (px < -80 || px > 1040) return; pumpkin(px, 432, 1.05, c.t); if (u > PT[i] && u < PT[i] + 2.6) C.bigText(String(i + 1), px, 340, C.win(u, PT[i], PT[i] + 2.6, .3), 46, '#ffd23f'); }),
        beforeTruck: () => dusk() }),
      says: [['toet', 'Look! Pumpkins!', 5.2, 8.6, ...TB], ['toet', "How many did you count?", 21.8, 24.6, ...TB]],
      big: [['Five pumpkins!', 21.2, 24.8, 480, 80, 60, '#ffd23f']],
      sfx: [[1, 'honk', .5], ...PT.map((t, i) => [t, 'chime:' + ['C5', 'D5', 'E5', 'G5', 'A5'][i], .7]), [21.2, 'tada', .6]] },
    { d: 21, draw: drive({ segs: [[0, 90], [3, 0]], dist0: 3200, skyP: .56, near: 'trees', bx: BX,
        sky: (u, c) => bats(c.t),
        behind: (u, c) => {
          [[560, 1], [930, .9]].forEach(([px, s]) => pumpkin(px, 432, s, c.t));
          const wave = Math.sin(c.t * 6) * .35, hop = u > 9 && u < 13 ? Math.abs(Math.sin(c.t * 7)) * 8 : 0;
          kidAt(K.KIDS.amara, 650, 432 - hop, .95, { la: 2.3 + wave, ra: .25, mouth: c.talk('kids') ? .7 : .3 }, witchHat);
          kidAt(K.KIDS.kofi, 740, 432 - hop, .95, { la: .25, ra: 2.3 - wave, mouth: c.talk('kids') ? .7 : .3 }, catEars);
          kidAt(K.KIDS.mei, 830, 432 - hop, .9, { la: 2.2 + wave, ra: 2.2 - wave, mouth: .5 }, pumpkinHat);
          bucket(684, 404); bucket(706, 404);
        },
        beforeTruck: () => dusk(),
        front: (u, c) => { if (u > 13) A.confetti(c.t, clamp((u - 13) / .8)); } }),
      says: [['kids', 'Trick or treat!', 5.5, 9, 740, 250], ['toet', 'What fun costumes!', 9.5, 13, ...TB]],
      big: [['Happy Halloween!', 13.2, 15.4, 480, 80, 66, '#ff8c1a']],
      sfx: [[3.2, 'honk', .5], [5.6, 'cheer', .6], [13.2, 'tada', .7], [14, 'laugh', .5]] },
  ],
});
