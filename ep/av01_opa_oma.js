// Toet op avontuur 1: Op bezoek bij opa en oma
const C = require('../lib/common'), T = require('../lib/toet'), F = require('../lib/toetfriends'), S = require('../lib/safari');
const St = require('../lib/story');
const { x, clamp, ease, lerp, win } = C;
const { drive, place, GY } = St;
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 175];

const ARRIVE = [[0, 150], [4, 150], [7.5, 0]];
const mA = T.motion(ARRIVE), DEND = mA.distAt(7.5) + 3000;
const OMA = 560, OPA = 820;
function barn(px) {
  x.fillStyle = '#c1121f'; x.fillRect(px - 100, 300, 200, 120); x.beginPath(); x.moveTo(px - 110, 300); x.lineTo(px, 230); x.lineTo(px + 110, 300); x.closePath(); x.fillStyle = '#7f1d1d'; x.fill();
  x.fillStyle = '#fff'; x.fillRect(px - 30, 345, 60, 75); x.strokeStyle = '#c1121f'; x.lineWidth = 4; x.beginPath(); x.moveTo(px - 30, 345); x.lineTo(px + 30, 420); x.moveTo(px + 30, 345); x.lineTo(px - 30, 420); x.stroke();
}
function haystack(px) {
  x.fillStyle = '#e9c46a'; x.beginPath(); x.moveTo(px - 160, GY + 4); x.quadraticCurveTo(px - 165, GY - 160, px, GY - 150); x.quadraticCurveTo(px + 165, GY - 160, px + 160, GY + 4); x.closePath(); x.fill();
  x.strokeStyle = '#c99a3a'; x.lineWidth = 3; for (let i = -3; i <= 3; i++) { x.beginPath(); x.moveTo(px + i * 30, GY - 110 + Math.abs(i) * 10); x.lineTo(px + i * 32, GY); x.stroke(); }
}
const folks = (u, c, o = {}) => {
  place(F.oma, o.omaX ?? OMA, GY + 6, .82, true, c.t, { mouth: c.talk('oma'), blink: o.omaEyes ?? c.blink(1) });
  if (!o.noOpa) place(F.opa, o.opaX ?? OPA, GY + 6, .75, true, c.t, { mouth: c.talk('opa'), blink: o.opaEyes ?? c.blink(2), puff: o.puff });
};
const still = (extra) => drive(Object.assign({ segs: [[0, 0]], dist0: DEND, bx: 200, behind: () => barn(700) }, extra));

St.episode({
  title: ['Op bezoek bij opa en oma', 66], sub: 'Toet op avontuur', thumb: ['Op bezoek bij', 'opa en oma!'],
  music: { kind: 'toet', shift: 0 },
  shots: [
    { d: 20, draw: drive({ segs: [[0, 150]] }),
      says: [['toet', 'Vandaag ga ik naar opa en oma!', 6, 10.5, ...TB], ['toet', 'Ik heb er zo veel zin in!', 12, 16, ...TB]],
      sfx: [[3, 'honk', .8], [17, 'honk', .8]] },
    { d: 16, draw: drive({ segs: ARRIVE, dist0: 3000, bx: 200,
        behind: (u, c) => barn(DEND + 700 - c.dist),
        front: (u, c) => folks(u, c, { omaX: DEND + OMA - c.dist, opaX: DEND + OPA - c.dist }) }),
      says: [['toet', 'Opa! Oma!', 8.3, 11, ...TB], ['oma', 'Dag lieverd! Wat fijn dat je er bent!', 11.2, 14.6, OMA, 230, 26], ['opa', 'Brom brom! Welkom!', 13.2, 15.9, OPA - 40, 300, 26]],
      big: [['Oma Tuf', 11.2, 15.6, OMA, 490, 36, '#ffffff'], ['Opa Brom', 12.6, 15.9, OPA, 490, 36, '#ffffff']],
      sfx: [[8.4, 'honk', .7], [13.4, 'puf', .6]] },
    { d: 26, draw: still({ front: (u, c) => folks(u, c, { puff: u < 6 }) }),
      says: [['opa', 'Vroeger reed ik op diesel. Puf, puf, puf!', 1, 5.6, OPA - 120, 280, 25], ['toet', 'Ik rijd op stroom. Stil en schoon!', 6, 10.5, ...TB],
             ['oma', 'Wat knap, Toet!', 11, 13.8, OMA, 230], ['opa', 'Dat is de nieuwe tijd!', 14, 17.2, OPA - 60, 280],
             ['oma', 'Zullen we verstoppertje spelen?', 18.5, 22.6, OMA - 40, 230], ['toet', 'Ja! Leuk!', 23, 25.6, ...TB]],
      sfx: [[1.6, 'puf', .7], [3.4, 'puf', .7], [12, 'laugh', .5]] },
    { d: 36, draw: still({ bx: u => u < 1 ? 140 : u < 3.5 ? lerp(140, 230, ease((u - 1) / 2.5)) : u < 18.5 ? 230 : lerp(230, 120, ease((u - 18.5) / .8)),
        truck: u => ({ hop: u > 18.5 && u < 19.4 ? Math.sin((u - 18.5) / .9 * Math.PI) * 28 : 0, sleepy: 0 }),
        front: (u, c) => {
          const opaX = u < 1 ? 700 : u < 3.5 ? lerp(700, 840, ease((u - 1) / 2.5)) : u < 30.5 ? 840 : lerp(840, 720, ease((u - 30.5) / 1.2));
          const counting = u > .8 && u < 11.2;
          place(F.oma, OMA, GY + 6, .82, true, c.t, { mouth: c.talk('oma'), blink: counting || c.blink(1) });
          place(F.opa, opaX, GY + 6, .75, true, c.t, { mouth: c.talk('opa'), blink: c.blink(2), puff: u > 3.5 });
          if (u < 30.5) S.bush(840, GY + 14, 1.25, u > 22 && u < 30 ? 1 : 0);
          if (u < 18.5) haystack(300);
        } }),
      says: [['oma', 'Ik tel tot tien!', .2, 1.8, OMA, 230], ['oma', 'Waar zijn ze nou?', 11.6, 14.6, OMA, 230],
             ['oma', 'Gevonden!', 18.8, 21.6, OMA, 230], ['toet', 'Hihi!', 19.1, 21.4, 320, 270],
             ['oma', 'Ik zie een rookwolkje...', 26.2, 30.2, OMA - 20, 230],
             ['oma', 'Gevonden, opa!', 31, 33.8, OMA - 30, 230], ['opa', 'Hoho! Mijn rookwolkje verraadde me!', 32.4, 35.8, 690, 300, 24]],
      big: [...['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((n, i) => [n, 1 + i, 1.9 + i, 480, 110, 110, '#ffd23f']),
            ['Zie jij Toet?', 14.6, 18.4, 480, 90, 66, '#ffffff'], ['En waar is opa?', 22, 26, 480, 90, 66, '#ffffff']],
      sfx: [...Array.from({ length: 10 }, (_, i) => [1 + i, 'tick', .6]), [18.5, 'boing', .7], [19.1, 'laugh', .6], [24, 'puf', .5], [27, 'puf', .5], [31, 'boing', .6], [32.4, 'laugh', .6]] },
    { d: 24, draw: still({ skyP: u => lerp(.46, .63, u / 24),
        front: (u, c) => {
          T.charger(455, GY - 2, 1.1);
          const k = ease((u - 16) / 1.2);
          if (k > 0) { const ex = lerp(470, c.bx + 142, k), ey = lerp(GY - 30, c.Tk.by - 35, k); x.beginPath(); x.moveTo(470, GY - 30); x.quadraticCurveTo((470 + ex) / 2, GY + 10, ex, ey); x.lineWidth = 5; x.strokeStyle = '#1d3557'; x.stroke(); }
          folks(u, c, { omaX: 615, opaX: 860 });
        } }),
      says: [['oma', 'Het wordt al donker. Blijf je logeren?', 1, 5, 615, 230, 25], ['toet', 'Ja, graag!', 5.5, 8, ...TB],
             ['opa', 'Hier kun je opladen, Toet!', 9, 13, 800, 290], ['toet', 'Dank je wel, opa!', 13.5, 16, ...TB]],
      sfx: [[17.1, 'pop', .5], [17.4, 'arp', .5]] },
    { d: 28, draw: still({ skyP: .72, truck: () => ({ sleepy: 1 }),
        front: (u, c) => {
          T.charger(455, GY - 2, 1.1);
          x.beginPath(); x.moveTo(470, GY - 30); x.quadraticCurveTo((470 + c.bx + 142) / 2, GY + 10, c.bx + 142, c.Tk.by - 35); x.lineWidth = 5; x.strokeStyle = '#1d3557'; x.stroke();
          folks(u, c, { omaX: 615, opaX: 860, omaEyes: u > 10.5, opaEyes: u > 11 });
          if (u > 14) ['Z', 'z', 'z'].forEach((z, i) => C.bigText(z, 330 + i * 24 + Math.sin(c.t + i) * 4, 280 - i * 28 - ((c.t * 8) % 20), clamp((u - 14 - i * .5) / .6), 34 - i * 6, '#ffffff'));
        } }),
      says: [['toet', 'Welterusten opa. Welterusten oma.', 2, 6.6, ...TB], ['oma', 'Slaap lekker, lieverd.', 7, 10.5, 615, 230], ['opa', 'Brom... zzz...', 11, 14, 840, 290]],
      sfx: [[15, 'yawn', .6]] },
  ],
});
