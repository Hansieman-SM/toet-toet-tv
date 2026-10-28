process.env.TOET_LANG = 'en';
// Toet op avontuur 3: Toet beklimt de berg
const C = require('../lib/common'), T = require('../lib/toet'), F = require('../lib/toetfriends');
const St = require('../lib/story'), A = require('../lib/av');
const { x, W, H, clamp, ease, lerp, hash, win, rr, circ } = C;
const { drive, GY } = St;
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 175];

function farMountain(px, base, w, h, snow = true) {
  x.fillStyle = '#8fa9c6'; x.beginPath(); x.moveTo(px - w, base); x.lineTo(px, base - h); x.lineTo(px + w, base); x.closePath(); x.fill();
  if (snow) { x.fillStyle = '#fff'; x.beginPath(); x.moveTo(px - w * .28, base - h * .72); x.lineTo(px, base - h); x.lineTo(px + w * .28, base - h * .72); x.lineTo(px + w * .1, base - h * .66); x.lineTo(px - w * .08, base - h * .74); x.closePath(); x.fill(); }
}
function skyBg(top = '#5bb8f0', bot = '#d6f0ff') { const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); x.fillStyle = g; x.fillRect(0, 0, W, H); }
// helling: alles gekanteld rond het midden, de truck rijdt op de weg
function slope(u, c, ang, speed, o = {}) {
  skyBg(); T.cloud(80, 70, .8); T.cloud(600, 50, .6);
  farMountain(250, 420, 330, 300); farMountain(760, 420, 300, 250);
  x.fillStyle = o.snow ? '#e3edf7' : '#9cc58a'; x.fillRect(0, 418, W, 125);
  const dist = (o.dist0 || 0) + speed * u;
  x.save(); x.translate(480, 330); x.rotate(ang); x.translate(-480, -330);
  x.fillStyle = o.snow ? '#eef4fb' : '#7fb069'; x.fillRect(-600, 400, 2200, 600);
  for (let k = Math.floor(dist / 170) - 6; k < Math.floor(dist / 170) + 9; k++) {
    const px = k * 170 - dist * .6 + hash(k) * 60;
    if (o.snow || hash(k + 1) > .5) A.pine(px, 418, .7 + hash(k + 2) * .4, !!o.snow); else T.tree(px, 418, .8, hash(k));
  }
  x.fillStyle = o.snow ? '#dfe8f2' : '#6aa357'; x.fillRect(-600, 412, 2200, 28);
  x.fillStyle = '#5c677d'; x.fillRect(-600, T.ROAD, 2200, 70);
  x.fillStyle = '#fff'; const d = dist % 80; for (let i = -10; i < 30; i++) x.fillRect(i * 80 - d, T.ROAD + 33, 44, 5);
  x.fillStyle = o.snow ? '#eef4fb' : '#5e9a4c'; x.fillRect(-600, T.ROAD + 70, 2200, 400);
  if (o.extra) o.extra(dist);
  c.Tk = T.truck({ t: c.t, dist, moving: speed > 5, bx: 300, mouth: c.talk('toet'), sleepy: o.sleepy || 0 });
  x.restore();
}

St.episode({
  title: ["Toet Climbs the Mountain", 74], sub: "Toet's Adventures", thumb: ["Toet climbs", "the mountain!"],
  music: { kind: 'toet', shift: -3 },
  shots: [
    { d: 20, draw: drive({ segs: [[0, 150]], sky: () => { farMountain(720, 360, 280, 290); } }),
      says: [['toet', "Wow! What a high mountain!", 5.5, 9, ...TB], ['toet', "I want to go to the top!", 10, 13.5, ...TB]],
      big: [["Come on, Toet!", 15, 19.6, 480, 90, 64, '#ffffff']], sfx: [[3, 'honk', .8], [15.3, 'honk', .8]] },
    { d: 36, draw: (u, c) => {
        slope(u, c, -.2, 55, { sleepy: clamp((u - 20) / 10) * .45, extra: dist => {
          const sx = 2200 - dist * 1; T.sheep(sx, 418, 1.3);
        } });
        A.battery(lerp(1, .45, u / 36), c.t);
      },
      says: [['toet', "Phew... it's so steep!", 3, 7, 520, 230], ['sheep', "Baaa! You can do it, Toet!", 18.5, 23, 700, 250, 26], ['toet', "Thanks, little sheep!", 23.5, 27, 520, 230]],
      big: [["Step by step...", 8, 13, 480, 90, 58, '#ffffff'], ["Step by step...", 28, 33, 480, 90, 58, '#ffffff'], ["Say it with me!", 13.4, 17.2, 480, 90, 56, '#ffd23f']],
      sfx: [[18.6, 'baa', .9], [24, 'laugh', .4]] },
    { d: 26, draw: (u, c) => {
        skyBg('#4aa8e8', '#e8f6ff'); farMountain(150, 470, 260, 160); farMountain(520, 470, 300, 210); farMountain(860, 470, 260, 170);
        x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(0, 440); x.quadraticCurveTo(480, 380, 960, 440); x.lineTo(960, 540); x.lineTo(0, 540); x.fill();
        A.pine(80, 452, .9); A.pine(880, 456, .8);
        A.snowman(720, GY + 6, 1, c.t, c.talk('snowman'));
        const k = ease(u / 3); c.Tk = T.truck({ t: c.t, dist: k * 200, moving: u < 3, bx: lerp(100, 260, k), mouth: c.talk('toet'), happy: true });
        A.battery(.2, c.t);
        A.snowflakes(c.t);
      },
      says: [['toet', "I made it to the top!", 3.2, 6, 470, 260], ['toet', "What a beautiful view!", 6.5, 10, 470, 260],
             ['snowman', "Hello! Welcome to the mountain!", 10.5, 14.5, 700, 210, 26], ['toet', "Oh no... my battery is almost empty.", 15.5, 20, 470, 260, 26],
             ['snowman', "Don't worry! Going downhill charges you up.", 20.5, 25.6, 660, 210, 24]],
      big: [["Hooray!", 3, 6, 480, 90, 80, '#ffd23f']], sfx: [[3, 'tada', .7], [10.5, 'chime', .6], [15.5, 'sad', .5]] },
    { d: 34, draw: (u, c) => {
        slope(u, c, .18, 130, { dist0: 5000 });
        const lv = lerp(.2, 1, clamp((u - 6) / 20));
        A.battery(lv, c.t, u > 6 && u < 27);
      },
      says: [['toet', "Wheeee!", 1.5, 5, 520, 230], ['toet', "My battery is filling up again!", 16, 20.5, 520, 230]],
      big: [["Downhill charges Toet up!", 7, 14, 560, 110, 50, '#ffffff'], ["FULL!", 26.5, 31, 480, 110, 110, '#2fb36a']],
      sfx: [[1.5, 'slide:1.6', .8], [9.2, 'whoosh', .4], [13.2, 'whoosh', .4], [17.2, 'whoosh', .4], [21.2, 'whoosh', .4], [25.2, 'whoosh', .4], [26.5, 'tada', .7]] },
    { d: 22, draw: drive({ segs: [[0, 150]], dist0: 9000, skyP: u => .3 + u / 80, sky: () => farMountain(260, 360, 280, 290) }),
      says: [['toet', "What an adventure!", 3, 6.5, ...TB], ['toet', "Step by step, you can get anywhere!", 8, 13, ...TB]],
      sfx: [[14, 'honk', .8]] },
  ],
});
