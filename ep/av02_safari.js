// Toet op avontuur 2: Toet op safari
const C = require('../lib/common'), S = require('../lib/safari'), F = require('../lib/toetfriends');
const St = require('../lib/story'), A = require('../lib/av');
const { x, W, clamp, ease, lerp, win, rr } = C;
const G = S.GROUND, TS = .72, ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
const RV = [415, 625];          // rivier van x .. tot x
function toet(px, c, o = {}) { F.toetAt(px, G + 4 - (o.lift || 0), TS, Object.assign({ t: c.t, dist: o.dist ?? px * 1.4, moving: !!o.moving, mouth: c.talk('toet') }, o)); }
function savanna(t) { S.setT(t); S.sky(); S.land(); }
function river(t, logs = 0, drop = 1) {
  x.fillStyle = '#b07a45'; x.fillRect(RV[0] - 14, G - 8, RV[1] - RV[0] + 28, 100);
  x.fillStyle = '#3a86ff'; x.fillRect(RV[0], G - 2, RV[1] - RV[0], 120);
  x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 3;
  for (let r = 0; r < 4; r++) { x.beginPath(); for (let i = 0; i <= 20; i++) { const px = RV[0] + i * (RV[1] - RV[0]) / 20; x.lineTo(px, G + 12 + r * 18 + Math.sin(i * .9 + t * 3 + r) * 3); } x.stroke(); }
  for (let i = 0; i < logs; i++) {
    const k = i === logs - 1 ? ease(drop) : 1, y = G - 6 + i * 9 - (1 - k) * 60;
    x.fillStyle = '#8b5a2b'; rr(RV[0] - 24, y, RV[1] - RV[0] + 48, 12, 6); x.fill();
    x.fillStyle = '#c08552'; x.beginPath(); x.ellipse(RV[1] + 24, y + 6, 4, 6, 0, 0, 7); x.fill();
  }
}
const lineup = { lion: [455, .62], elephant: [610, .6], rhino: [765, .58], buffalo: [905, .58] };

St.episode({
  title: ['Toet op safari', 80], sub: 'Toet op avontuur', thumb: ['Toet op safari!', 'Op bezoek bij de dieren'],
  music: { kind: 'safari', shift: 0 }, accent: '#e8701f', cardBg: '#fff8e8',
  shots: [
    { d: 24, draw: (u, c) => { savanna(14 + u * .3); const px = u < 5 ? lerp(-200, 300, ease(u / 5)) : 300; toet(px, c, { moving: u < 5 }); S.foreground(); },
      says: [['toet', 'Hallo Afrika!', 6, 9, 380, 250], ['toet', 'Ik ga mijn vrienden opzoeken!', 10, 14, 380, 250]],
      big: [['Wie zien we eerst?', 16, 22, 480, 90, 60, '#ffffff']], sfx: [[6, 'honk', .8]] },
    { d: 34, draw: (u, c) => {
        savanna(20 + u * .3); toet(170, c);
        [['lion', 0], ['elephant', 8.5], ['rhino', 17], ['buffalo', 25.5]].forEach(([k, st], i) => {
          const v = u - st; if (v < 0) return; const [tx, sc] = lineup[k];
          const px = v < 2 ? lerp(1100, tx, ease(v / 2)) : tx;
          S.actor(ANI[k], px, v < 2, clamp(Math.sin(clamp((v - 2.4) / 1.8) * Math.PI) * 1.4), sc, { blinkOff: i });
        });
        S.foreground();
      },
      says: [['lion', 'Hoi Toet! Ik ben Leo.', 3.5, 7, 455, 270, 24], ['elephant', 'Hallo! Ik ben Ella.', 12, 15.5, 610, 230, 24],
             ['rhino', 'Hé! Ik ben Nico.', 20.5, 24, 765, 270, 24], ['buffalo', 'Hoi! Ik ben Boris.', 29, 32.5, 860, 270, 24]],
      big: [['1', 3, 34, 455, 470, 50, '#ffd23f'], ['2', 11.5, 34, 610, 470, 50, '#ffd23f'], ['3', 20, 34, 765, 470, 50, '#ffd23f'], ['4', 28.5, 34, 905, 470, 50, '#ffd23f'],
            ['Vier vrienden!', 30.5, 34, 480, 80, 60, '#ffffff']],
      sfx: [[2.4, 'roar', 1, 0, 1.9], [10.9, 'trumpet', 1, 0, 1.6], [19.4, 'snort', 1, 0, 1.5], [27.9, 'bellow', 1, 0, 1.8], [30.5, 'tada', .6]] },
    { d: 30, draw: (u, c) => {
        savanna(24 + u * .3); S.foreground(); river(c.t);
        const px = u < 2.5 ? lerp(60, 230, ease(u / 2.5)) : 230; toet(px, c, { moving: u < 2.5 });
        S.actor(S.elephant, 790, false, clamp(Math.sin(clamp((u - 15) / 1.6) * Math.PI) * 1.4), .62, {});
        S.actor(S.rhino, 920, false, 0, .5, { blinkOff: 2 });
      },
      says: [['toet', 'Oh nee! Een rivier!', 3, 6, 300, 250], ['toet', 'Hoe kom ik aan de overkant?', 6.5, 10.5, 300, 250],
             ['elephant', 'Ik weet het! We maken een brug!', 15.5, 20, 760, 240, 24], ['rhino', 'Wij helpen je!', 20.5, 24, 880, 280, 24], ['toet', 'Joepie!', 25, 28, 300, 250]],
      big: [['Weet jij het?', 11, 15, 480, 90, 64, '#ffffff']],
      sfx: [[3, 'sad', .6], [15, 'trumpet', .9, 0, 1.6], [25, 'laugh', .5]] },
    { d: 32, draw: (u, c) => {
        savanna(28 + u * .3);
        const cyc = Math.min(2, Math.floor(u / 8)), v = u - cyc * 8, logs = u < 5 ? 0 : u < 13 ? 1 : u < 21 ? 2 : 3;
        const drop = logs === 0 ? 0 : clamp((u - [5, 13, 21][logs - 1]) / .5);
        S.foreground(); river(c.t, logs, drop); toet(230, c);
        // stapel boomstammen
        const left = 3 - (u < 1 ? 0 : u < 9 ? 1 : u < 17 ? 2 : 3);
        for (let i = 0; i < left; i++) { x.fillStyle = '#8b5a2b'; rr(830 + (i % 2) * 20, G - 20 - i * 14, 120, 13, 6); x.fill(); }
        // olifant loopt heen en weer met een stam
        let ex = 790, carry = false, flip = false;
        if (u < 24) { if (v < 4) { ex = lerp(860, 690, ease(v / 4)); carry = v > .6; } else if (v < 5) { ex = 690; carry = true; } else { ex = lerp(690, 860, ease((v - 5) / 3)); flip = true; } }
        S.actor(S.elephant, ex, u < 24 && (v < 4 || v > 5), u >= 24 ? clamp(Math.sin(clamp((u - 24.5) / 1.6) * Math.PI) * 1.4) : 0, .62, { flip });
        if (carry && u < 24) { x.fillStyle = '#8b5a2b'; rr(ex - 115, G - 52, 120, 13, 6); x.fill(); }
        S.actor(S.rhino, 930, false, 0, .48, { blinkOff: 2 });
      },
      says: [['elephant', 'Eén stam...', 4.6, 7.4, 700, 260, 24], ['elephant', 'Nog een stam...', 12.6, 15.4, 700, 260, 24], ['elephant', 'En nog één!', 20.6, 23.4, 700, 260, 24],
             ['toet', 'Dank je wel, Ella!', 27, 31, 300, 250]],
      big: [['1', 5, 8, 520, 110, 80, '#ffd23f'], ['2', 13, 16, 520, 110, 80, '#ffd23f'], ['3', 21, 24, 520, 110, 80, '#ffd23f'], ['Een brug!', 24, 27, 480, 90, 66, '#ffffff']],
      sfx: [[5, 'bump', .8], [13, 'bump', .8], [21, 'bump', .8], [24, 'tada', .7], [24.5, 'trumpet', .8, 0, 1.6]] },
    { d: 22, draw: (u, c) => {
        savanna(32 + u * .3); S.foreground(); river(c.t, 3);
        const k = clamp((u - 1) / 10), px = lerp(230, 760, k * k * (3 - 2 * k)), onBridge = px > 380 && px < 660;
        const lift = onBridge ? Math.abs(Math.sin(u * 9)) * 3 : 0;
        S.actor(S.elephant, 905, false, u > 12 ? clamp(Math.sin(clamp((u - 12.5) / 1.6) * Math.PI) * 1.4) : 0, .55, { flip: false });
        toet(px, c, { moving: k > 0 && k < 1, lift, dist: px * 1.4 });
        S.actor(S.lion, 110, false, u > 12 ? .8 : 0, .5, { flip: true }); S.actor(S.rhino, 230, false, 0, .45, { flip: true, blinkOff: 2 });
      },
      says: [['toet', 'Voorzichtig... stapje voor stapje...', 2, 8, (u) => lerp(300, 600, clamp((u - 1) / 10)), 250, 26], ['lion', 'Hoera!', 13, 16, 150, 330, 26]],
      big: [['Gelukt!', 12, 17, 480, 90, 80, '#ffd23f']],
      sfx: [[4, 'bump', .5], [6, 'bump', .5], [8, 'bump', .5], [12, 'cheer', .8], [12.5, 'trumpet', .7, 0, 1.6]] },
    { d: 14, draw: (u, c) => {
        S.setT(52 + u * .4); S.sky(); S.land();
        toet(170, c);
        [['lion', 455, .62], ['elephant', 610, .6], ['rhino', 765, .58], ['buffalo', 905, .58]].forEach(([k, px, sc], i) => S.actor(ANI[k], px, false, 0, sc, { blinkOff: i }));
        S.foreground();
      },
      big: [['Samen kunnen we alles!', 1, 8, 480, 90, 58, '#ffffff']], sfx: [[1, 'arp', .6]] },
  ],
});
