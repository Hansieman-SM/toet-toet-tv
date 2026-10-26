// Toet op avontuur 6: Toet brengt de verjaardagstaart
const C = require('../lib/common'), T = require('../lib/toet'), F = require('../lib/toetfriends'), K = require('../lib/kids');
const St = require('../lib/story'), A = require('../lib/av');
const { x, W, clamp, ease, lerp, hash, win, rr, circ } = C;
const { drive, place, GY } = St;
const KD = K.KIDS;
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 175];

function cake(Tk, wob, lit = 4, shown = 1) {
  if (shown <= 0) return;
  x.save(); x.translate(Tk.bx + 25, Tk.by - 120); x.rotate(wob); x.scale(shown, shown);
  x.fillStyle = '#fff3e0'; rr(-58, -50, 116, 50, 8); x.fill(); x.fillStyle = '#ff8fc8'; rr(-58, -50, 116, 14, 6); x.fill();
  x.fillStyle = '#fff3e0'; rr(-38, -86, 76, 38, 8); x.fill(); x.fillStyle = '#ff8fc8'; rr(-38, -86, 76, 11, 5); x.fill();
  [-18, -6, 6, 18].forEach(cx => circ(cx * 2.4, -30, 3.5, '#e63946'));
  [-24, -8, 8, 24].forEach((cx, i) => { x.fillStyle = ['#4cc9f0', '#ffd23f', '#6cd36b', '#9b5de5'][i]; x.fillRect(cx - 3, -106, 6, 20); if (i < lit) { circ(cx, -112, 5, '#ffd23f'); circ(cx, -114, 2.5, '#fff6b0'); } });
  x.restore();
}
function hat(px, py, col, s = 1) { x.beginPath(); x.moveTo(px - 13 * s, py); x.lineTo(px, py - 34 * s); x.lineTo(px + 13 * s, py); x.closePath(); x.fillStyle = col; x.fill(); circ(px, py - 34 * s, 5 * s, '#fff'); }
function crown(px, py) { x.beginPath(); x.moveTo(px - 18, py); x.lineTo(px - 18, py - 20); x.lineTo(px - 9, py - 10); x.lineTo(px, py - 24); x.lineTo(px + 9, py - 10); x.lineTo(px + 18, py - 20); x.lineTo(px + 18, py); x.closePath(); x.fillStyle = '#ffd23f'; x.fill(); x.lineWidth = 2; x.strokeStyle = '#e09f00'; x.stroke(); }
function partyGarden(t) {
  A.house(560, 425, .8, '#ffafcc', '#9d4edd');
  x.strokeStyle = '#1d3557'; x.lineWidth = 2; x.beginPath(); x.moveTo(330, 300); x.quadraticCurveTo(560, 350, 900, 290); x.stroke();
  for (let i = 0; i < 12; i++) { const k = i / 11, px = lerp(340, 890, k), py = 300 + Math.sin(k * Math.PI) * 30 + (k > .5 ? -(k - .5) * 20 : 0);
    x.beginPath(); x.moveTo(px - 12, py); x.lineTo(px + 12, py); x.lineTo(px, py + 22); x.closePath(); x.fillStyle = ['#ff5d8f', '#ffd23f', '#4cc9f0', '#6cd36b'][i % 4]; x.fill(); }
  [[880, '#ff5d8f'], [915, '#ffd23f'], [945, '#4cc9f0']].forEach(([bx, col], i) => { x.strokeStyle = '#1d3557'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(bx, 250 + Math.sin(t + i) * 5); x.lineTo(900, 420); x.stroke(); circ(bx, 230 + Math.sin(t + i) * 5, 22, col); });
}
const GUESTS = [['amara', 520], ['daan', 610], ['yasmina', 700], ['kofi', 790], ['mei', 880]];
function guests(u, c, cheer = 0, blowing = false) {
  GUESTS.forEach(([n, px], i) => {
    const ch = cheer * Math.abs(Math.sin(c.t * 4 + i));
    const m = Math.max(c.talk(n), c.talk('kids') * (i % 2 ? 1 : .8), ch);
    x.save(); x.translate(px, GY - 2); x.scale(1.2, 1.2);
    K.kid(KD[n], { la: .3 + ch * 1.9, ra: .3 + ch * 1.9, mouth: blowing && n === 'amara' ? .6 : m, look: -3, blink: c.blink(i) });
    if (n === 'amara') crown(0, -100); else hat(0, -98, ['#9b5de5', '#2fb36a', '#ff9f1c', '#4cc9f0'][i - 1], .9);
    x.restore();
  });
}

const S2 = [[0, 120], [4, 120], [6, 40], [10, 40], [12, 120], [14, 120], [17, 0], [25, 0], [27, 120], [36, 120], [40, 120]];
const m2 = T.motion(S2), BUMP = m2.distAt(7.5) + 290 + 180;
function hopAt(c) {
  const bxS = BUMP - c.dist; let h = 0;
  [c.bx - 30, c.bx + 70, c.bx + 180].forEach(wx => { const d = Math.abs(bxS - wx); if (d < 34) h = Math.max(h, Math.cos(d / 34 * Math.PI / 2) * 12); });
  return h;
}

St.episode({
  title: ['Toet brengt de taart', 70], sub: 'Toet op avontuur', thumb: ['Toet brengt', 'de verjaardagstaart!'],
  music: { kind: 'toet', shift: 3 }, accent: '#ff5d8f',
  shots: [
    { d: 26, draw: drive({ segs: [[0, 0]], dist0: 500, bx: 150, behind: () => A.house(700, 425, .8, '#cdb4db', '#7b2cbf'),
        front: (u, c) => { cake(c.Tk, 0, 4, u < 11 ? 0 : ease((u - 11) / .4) * (1 + Math.sin(clamp((u - 11) / .4) * Math.PI) * .15)); place(F.oma, 640, GY + 6, .82, true, c.t, { mouth: c.talk('oma'), blink: c.blink(1) }); } }),
      says: [['oma', 'Toet, wil jij deze taart naar het feestje van Amara brengen?', 2, 7.5, 600, 230, 22], ['toet', 'Natuurlijk, oma!', 8, 10.5, 350, 250],
             ['oma', 'Rij wel voorzichtig, hoor!', 13.5, 17, 640, 230], ['toet', 'Beloofd!', 17.5, 20, 350, 250]],
      big: [['Een taart!', 11, 13.3, 480, 90, 70, '#ff5d8f']], sfx: [[11, 'pop', .7], [11.2, 'arp', .5], [21.5, 'honk', .7]] },
    { d: 40, draw: drive({ segs: S2, dist0: 2000, bx: 160,
        onRoad: (u, c) => { const px = BUMP - c.dist; if (px > -80 && px < 1040) { x.fillStyle = '#ffd23f'; x.beginPath(); x.ellipse(px, GY, 34, 12, 0, Math.PI, 0); x.fill(); x.fillStyle = '#1d3557'; [-18, 0, 18].forEach(o => x.fillRect(px + o - 4, GY - 10, 8, 10)); } },
        truck: (u, c) => ({ hop: hopAt(c) }),
        front: (u, c) => {
          const h = hopAt(c), wob = (h / 12) * .3 * Math.sin(u * 14) + (c.sp > 5 ? .02 * Math.sin(u * 5) : 0);
          cake(c.Tk, wob);
          if (u > 16.5 && u < 26) [0, 1, 2, 3].forEach(i => { const k = clamp((u - 17 - i * .5) / 7), py = lerp(T.ROAD + 4, T.ROAD + 110, k), px = c.bx + 330 + i * 34 - k * 10;
            F.duck(px, py, i === 0 ? 1.2 : .75, i === 0 ? '#f1f3f5' : '#ffd23f', true); });
        } }),
      says: [['toet', 'Voorzichtig met de taart...', 1, 4.5, ...TB], ['toet', 'Oei! De taart wiebelt!', 8.5, 12, ...TB], ['toet', 'Eendjes gaan voor!', 17.5, 21, ...TB],
             ['duck', 'Kwak kwak! Dank je wel!', 21.5, 24.8, 560, 330, 24], ['toet', 'Bijna bij het feest!', 29, 33, ...TB]],
      big: [['Een drempel!', 4.6, 7, 480, 90, 64, '#ffffff'], ['Rustig aan, Toet!', 12.2, 16, 480, 90, 62, '#ffd23f']],
      sfx: [[7.4, 'bump', .7], [9.8, 'bump', .5], [12.3, 'bump', .5], [18, 'quack', .7], [21.6, 'quack', .7], [35, 'honk', .8]] },
    { d: 34, draw: drive({ segs: [[0, 0]], dist0: 9000, bx: 110, noLeaves: true,
        behind: (u, c) => partyGarden(c.t),
        front: (u, c) => {
          const lit = u < 26 ? 4 : 4 - Math.min(4, Math.floor((u - 26) / .45) + 1);
          cake(c.Tk, 0, lit);
          guests(u, c, (u > 7.5 && u < 16) || (u > 28.5 && u < 32) ? 1 : 0, u > 25.8 && u < 28);
          if (u > 7.5) A.confetti(c.t, clamp((u - 7.5) / .5) * (1 - clamp((u - 16) / 1)) + clamp((u - 28.5) / .5) * (1 - clamp((u - 33) / 1)));
        } }),
      says: [['kids', 'De taart is er!', .8, 3.5, 700, 280], ['amara', 'Dank je wel, Toet!', 4, 7.2, 520, 300], ['amara', 'Ik word vier jaar!', 16.3, 19.8, 520, 300]],
      big: [['Hiep hiep hoera!', 8, 10.4, 640, 90, 62, '#ff5d8f'], ['Hiep hiep hoera!', 10.6, 13, 640, 90, 62, '#ffd23f'], ['Hiep hiep hoera!', 13.2, 15.8, 640, 90, 62, '#4cc9f0'],
            ['Tel je mee?', 20, 22, 640, 90, 60, '#ffffff'], ...['1', '2', '3', '4'].map((n, i) => [n, 22 + i * .9, 22.8 + i * .9, 220 + i * 30, 230, 70, '#ffd23f']),
            ['Fffffff!', 25.8, 28, 520, 230, 56, '#ffffff']],
      sfx: [[.8, 'cheer', .7], [8, 'cheer', .9], [10.6, 'cheer', .7], [13.2, 'cheer', .7], ...[0, 1, 2, 3].map(i => [22 + i * .9, 'chime:' + ['C5', 'E5', 'G5', 'C6'][i], .8]), [25.8, 'swish:1.6', .8], [28.5, 'tada', .8], [28.7, 'cheer', .8]] },
    { d: 16, draw: drive({ segs: [[0, 0]], dist0: 9000, bx: 110, noLeaves: true,
        behind: (u, c) => partyGarden(c.t),
        front: (u, c) => { cake(c.Tk, 0, 0, 1 - clamp((u - 1) / .5)); hat(c.bx + 175, c.Tk.by - 110, '#ff5d8f', 1.4); guests(u, c, .3); } }),
      says: [['amara', 'Wat een feest!', 1, 4, 520, 300], ['toet', 'Hiep hiep hoera voor Amara!', 4.5, 8.5, 300, 250]],
      sfx: [[4.6, 'honk', .7]] },
  ],
});
