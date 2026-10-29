process.env.TOET_LANG = 'en';
// Toet op avontuur 4: Toet en Bus Bas
const C = require('../lib/common'), T = require('../lib/toet'), F = require('../lib/toetfriends'), K = require('../lib/kids');
const St = require('../lib/story'), A = require('../lib/av');
const { x, W, clamp, ease, lerp, win, rr } = C;
const { drive, place, GY } = St;
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 175];
const KD = K.KIDS, ORDER = ['amara', 'daan', 'yasmina', 'kofi', 'mei', 'ravi'];

function station(px) {
  x.fillStyle = '#e9ecef'; x.fillRect(px - 330, 300, 660, 120); x.fillStyle = '#8ecae6'; x.fillRect(px - 340, 285, 680, 18);
  x.font = C.FONT(28); x.fillStyle = '#1d3557'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText("BUS STATION", px, 335);
  [-250, -170, 170, 250].forEach(o => { x.fillStyle = '#d8f3ff'; x.fillRect(px + o - 30, 355, 60, 50); });
}
function busStop(px) { x.fillStyle = '#495057'; x.fillRect(px - 4, 330, 8, 100); C.circ(px, 320, 22, '#ffb703'); x.font = C.FONT(22); x.fillStyle = '#1d3557'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('H', px, 321); }
function walker(k, px, py, t, moving, s = 1.15, mouth = 0) {
  const sw = moving ? Math.sin(t * 13) : 0;
  x.save(); x.translate(px, py - Math.abs(sw) * 3); x.scale(s, s); K.kid(k, { la: .3 + sw * .5, ra: .3 - sw * .5, ll: sw * .4, rl: -sw * .4, look: moving ? -3 : 0, mouth }); x.restore();
}
const ARR = [[0, 150], [3, 150], [7, 0]], mA = T.motion(ARR), D2 = mA.distAt(7) + 2000;
const BASX = 650;
const LIGHT = [[0, 150], [5, 150], [8.5, 0], [21.5, 0], [24, 150], [40, 150]], mL = T.motion(LIGHT), DL = mL.distAt(8.5) + 6000;
const SCH = [[0, 150], [4, 150], [8, 0]], mS = T.motion(SCH), DS = mS.distAt(8) + 12000;

St.episode({
  title: ["Toet and Bus Bas", 80], sub: "Toet's Adventures", thumb: ["Toet and Bus Bas", "How many children?"],
  music: { kind: 'toet', shift: 2 },
  shots: [
    { d: 18, draw: drive({ segs: [[0, 150]] }),
      says: [['toet', "I'm going to the bus station!", 5, 9, ...TB], ['toet', "My friend Bus Bas lives there.", 10, 14.5, ...TB]], sfx: [[3, 'honk', .8]] },
    { d: 26, draw: drive({ segs: ARR, dist0: 2000, bx: 120, behind: (u, c) => station(D2 + 600 - c.dist),
        front: (u, c) => place(F.bus, D2 + BASX - c.dist, GY + 6, .8, true, 1, { flip: true, mouth: c.talk('bas'), blink: c.blink(1) }) }),
      says: [['toet', "Hi, Bas!", 7.5, 10, 300, 250], ['bas', "Hi, Toet! I'm Bus Bas.", 10.5, 14, BASX, 250],
             ['bas', "I take people to school and to work.", 14.5, 19.5, BASX - 60, 250, 24], ['toet', "Wow, you're so long!", 20, 23.5, 300, 250]],
      big: [['Bus Bas', 10.5, 15, BASX, 490, 38, '#ffffff']], sfx: [[7.6, 'honk', .7], [10.5, 'honk', .5]] },
    { d: 36, draw: drive({ segs: [[0, 0]], dist0: D2, bx: 120, behind: () => { station(600); busStop(910); },
        front: (u, c) => {
          const pass = ORDER.filter((_, i) => u > 3.5 + i * 4.5).length;
          place(F.bus, BASX, GY + 6, .8, true, 1, { flip: true, mouth: c.talk('bas'), blink: c.blink(1), pass });
          ORDER.forEach((n, i) => { const st = 1 + i * 4.5, v = u - st; if (v < 0 || v > 2.5) return; walker(KD[n], lerp(1000, 545, ease(v / 2.5)), GY + 4, c.t, true); });
        } }),
      says: [['bas', "All aboard!", .5, 3, BASX, 250], ['toet', "So many children!", 29, 32.5, 300, 250], ['bas', "Everyone's going to school!", 32.6, 35.8, BASX, 250]],
      big: [...[1, 2, 3, 4, 5, 6].map((n, i) => [String(n), 3.6 + i * 4.5, 6.6 + i * 4.5, 480, 100, 110, '#ffd23f']), ["Six children!", 28, 32, 480, 90, 66, '#ffffff']],
      sfx: [[.6, 'swish', .5], ...[0, 1, 2, 3, 4, 5].map(i => [3.6 + i * 4.5, 'chime:' + ['C5', 'D5', 'E5', 'F5', 'G5', 'A5'][i], .8]), [28, 'tada', .6]] },
    { d: 40, draw: drive({ segs: LIGHT, dist0: 6000, bx: 40,
        front: (u, c) => {
          const lx = DL + 930 - c.dist;
          const st = u < 8.5 ? (u < 6.5 ? 'g' : 'o') : u < 14 ? 'r' : u < 18 ? 'o' : u < 21.5 ? 'g' : 'g';
          const st2 = u < 5 ? 'g' : u < 7 ? 'o' : u < 14 ? 'r' : u < 18 ? 'o' : 'g';
          A.trafficLight(lx, GY - 2, st2);
          place(F.bus, c.bx + 560, GY + 6, .95, false, c.dist / 70, { mouth: c.talk('bas'), blink: c.blink(1) });
        } }),
      says: [['toet', "Shall we drive together, Bas?", 1, 4.5, 260, 250]],
      big: [["Red: stop!", 9, 13.8, 480, 90, 64, '#e63946'], ["Orange: watch out!", 14.2, 17.8, 480, 90, 64, '#ff9f1c'], ["Green: go!", 18.2, 22, 480, 90, 64, '#2fb36a'],
            ["What color is it?", 25, 30, 480, 90, 56, '#ffffff'], ["Toot toot!", 31, 35, 480, 90, 72, '#ffd23f']],
      sfx: [[9, 'chime:C5', .6], [14.2, 'chime:E5', .6], [18.2, 'chime:G5', .6], [22.5, 'honk', .7], [31, 'honk', .8]] },
    { d: 26, draw: drive({ segs: SCH, dist0: 12000, bx: 40,
        behind: (u, c) => A.house(DS + 420 - c.dist, 425, .8, '#ffd6a5', '#e76f51', 'SCHOOL'),
        front: (u, c) => {
          place(F.bus, c.bx + 560 - (DS - c.dist) * 0, GY + 6, .95, false, c.dist / 70, { mouth: c.talk('bas'), blink: c.blink(1), pass: u < 9 ? 6 : 6 - ORDER.filter((_, i) => u > 9 + i * 1.2).length });
          ORDER.forEach((n, i) => { const v = u - 9 - i * 1.2; if (v < 0 || v > 4) return; { x.save(); x.globalAlpha = clamp((4 - v) / .6); walker(KD[n], lerp(c.bx + 710, 430, ease(v / 4)), GY + 4, c.t, true); x.restore(); } });
        } }),
      says: [['bas', "There's the school!", 8, 10.5, 760, 230], ['bas', "Thanks for driving with me, Toet!", 15, 19, 720, 230, 24], ['toet', "You're welcome! See you tomorrow, Bas!", 19.5, 23, 260, 250, 26]],
      sfx: [[9, 'swish', .4], [19.6, 'honk', .8]] },
  ],
});
