// The Big Four – How Does Mouse Feel? (English story episode: feelings sad/happy, being kind, sharing, counting to 5)
const C = require('../lib/common'), S = require('../lib/safari');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, rr, hash } = C;
const G = S.GROUND, ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
const INK = '#3a2414';

function savanna(skyT, t) { S.setT(skyT); S.sky(); S.setT(t); S.land(); }
// talking: small mouth movement (Ella's trunk only lifts a tiny bit)
const say = (c, who, k = .45) => { const v = c.talk(who); return v > 0 ? (who === 'elephant' ? .12 + v * .04 : v * k) : 0; };
const walk = (u, a, b, x0, x1) => u < a ? x0 : u > b ? x1 : lerp(x0, x1, ease((u - a) / (b - a)));
const moving = (u, a, b) => u > a && u < b;

// marula tree with round fruits
const FRUITS = [[-70, -250], [40, -275], [95, -215], [-120, -200], [-20, -305], [130, -265], [-90, -290]];
function fruitTree(px, gy, t) {
  x.save(); x.translate(px, gy);
  x.fillStyle = '#7a4a24'; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(-22, 0); x.quadraticCurveTo(-14, -110, -8, -190); x.lineTo(12, -190); x.quadraticCurveTo(18, -110, 26, 0); x.closePath(); x.fill(); x.stroke();
  x.lineWidth = 9; x.strokeStyle = '#7a4a24'; x.lineCap = 'round';
  x.beginPath(); x.moveTo(0, -150); x.quadraticCurveTo(-50, -180, -90, -205); x.moveTo(4, -160); x.quadraticCurveTo(60, -185, 100, -215); x.stroke();
  const sw = Math.sin(t * 1.2) * 3;
  const blobs = [[-110, -230, 60], [-40, -280, 75], [50, -285, 72], [115, -235, 58], [0, -225, 70], [-150, -215, 38], [155, -220, 36]];
  [['#4f7a2e', 5], ['#6a9a3a', 0]].forEach(([col, g]) => { x.fillStyle = col; x.beginPath(); blobs.forEach(([a, b, r]) => { x.moveTo(a + sw + r + g, b); x.arc(a + sw, b, r + g, 0, 7); }); x.fill(); });
  x.fillStyle = '#86b44c'; x.beginPath(); blobs.forEach(([a, b, r]) => { x.moveTo(a + sw - r * .2 + r * .45, b - r * .3); x.arc(a + sw - r * .2, b - r * .3, r * .45, 0, 7); }); x.fill();
  FRUITS.forEach(([a, b]) => fruit(a + sw, b, 1));
  x.restore();
}
function fruit(cx, cy, s = 1, glow = 0) {
  if (glow > 0) { x.save(); x.globalAlpha = glow * .6; C.circ(cx, cy, 26 * s, '#fff3a0'); x.restore(); }
  C.ell(cx, cy, 15 * s, 14 * s, '#ffb627', INK, 2.5);
  C.ell(cx - 5 * s, cy - 5 * s, 4 * s, 3 * s, 'rgba(255,255,255,.6)');
  x.fillStyle = '#4f7a2e'; x.beginPath(); x.ellipse(cx + 4 * s, cy - 15 * s, 6 * s, 3 * s, -.5, 0, 7); x.fill();
}
// feelings face icon
function face(cx, cy, r, mood, k) {
  if (k <= 0) return;
  const s = .5 + .5 * ease(k * 2) + Math.sin(clamp(k * 2) * Math.PI) * .12;
  x.save(); x.globalAlpha = clamp(k * 2); x.translate(cx, cy); x.scale(s, s);
  C.circ(0, 0, r, mood === 'happy' ? '#ffd23f' : '#7cb7f2', INK, 5);
  x.fillStyle = INK; [-1, 1].forEach(d => C.circ(d * r * .33, -r * .18, r * .1, INK));
  x.strokeStyle = INK; x.lineWidth = r * .1; x.lineCap = 'round'; x.beginPath();
  if (mood === 'happy') { x.arc(0, r * .05, r * .45, .25, Math.PI - .25); }
  else { x.arc(0, r * .6, r * .4, Math.PI + .45, -.45); }
  x.stroke();
  if (mood === 'happy') { x.fillStyle = 'rgba(255,110,120,.5)'; [-1, 1].forEach(d => { x.beginPath(); x.arc(d * r * .6, r * .2, r * .13, 0, 7); x.fill(); }); }
  else { x.fillStyle = '#e9f6ff'; x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.moveTo(r * .33, -r * .02); x.quadraticCurveTo(r * .5, r * .3, r * .33, r * .36); x.quadraticCurveTo(r * .16, r * .3, r * .33, -r * .02); x.fill(); x.stroke(); }
  x.restore();
}
// Mouse with a sad/happy mouth and tears (drawn inside the actor transform)
const MOUSE = (mood, t) => (ph, mv, act, bl) => {
  x.fillStyle = 'rgba(70,40,10,.2)'; x.beginPath(); x.ellipse(0, 2, 22, 3.5, 0, 0, 7); x.fill();
  S.mouse(ph, mv, act, bl);
  x.strokeStyle = INK; x.lineWidth = 1.6; x.lineCap = 'round'; x.beginPath();
  if (mood === 'happy') x.arc(-12, -8, 3, .3, Math.PI - .3); else x.arc(-12, -3, 3, Math.PI + .5, -.5);
  x.stroke();
  if (mood === 'sad') [-17, -7].forEach((ex, i) => {
    const k = ((t * .9 + i * .5) % 1); x.globalAlpha = 1 - k;
    x.fillStyle = '#7cc8ff'; x.beginPath(); x.ellipse(ex, -15 + k * 14, 1.6, 2.4, 0, 0, 7); x.fill(); x.globalAlpha = 1;
  });
};
const hop = (t, sp = 6, h = 8) => Math.abs(Math.sin(t * sp)) * h;

St.episode({
  title: ['How Does Mouse Feel?', 62], sub: 'The Big Four', accent: '#e8701f', cardBg: '#fff8e8',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'kind', shift: 0 },
  shots: [
    // 1 – The Big Four walk in and say hello
    { d: 22, draw: (u, c) => {
        savanna(14 + u * .3, c.t);
        const L = [['lion', 190, .55, 0], ['elephant', 400, .58, 1.2], ['rhino', 610, .52, 2.4], ['buffalo', 800, .52, 3.6]];
        L.forEach(([k, tx, sc, st], i) => { const v = u - st, px = walk(v, 0, 2.6, 1120, tx);
          S.actor(ANI[k], px, moving(v, 0, 2.6), say(c, k), sc, { blinkOff: i, phase: i }); });
        S.foreground();
      },
      says: [['lion', 'Hello! We are The Big Four!', 7, 11, 190, 330, 26], ['elephant', "Let's go for a walk!", 16, 20, 400, 290, 26]],
      big: [['Leo', 11.4, 21.5, 175, 500, 30, '#ffffff'], ['Ella', 12, 21.5, 400, 500, 30, '#ffffff'], ['Nico', 12.6, 21.5, 610, 500, 30, '#ffffff'], ['Boris', 13.2, 21.5, 800, 500, 30, '#ffffff']],
      sfx: [[7, 'roar', .5], [11.4, 'pop', .4], [12, 'pop', .4], [12.6, 'pop', .4], [13.2, 'pop', .4], [16, 'trumpet', .4]] },

    // 2 – a little mouse is crying under the fruit tree
    { d: 30, draw: (u, c) => {
        savanna(20 + u * .3, c.t); fruitTree(660, 452, c.t);
        x.strokeStyle = '#4f7a2e'; x.lineWidth = 3; x.beginPath(); x.moveTo(608 + Math.sin(c.t * 1.2) * 3, 290); x.lineTo(607, 314); x.stroke(); fruit(607, 327, 1.1, win(u, 23, 29) * (.6 + .4 * Math.sin(c.t * 6)));
        S.actor(MOUSE('sad', c.t), 790, false, 0, 1.6, { flip: true, noShadow: true });
        S.actor(S.elephant, walk(u, 0, 4, -320, 150), moving(u, 0, 4), say(c, 'elephant'), .55, { flip: true, blinkOff: 1 });
        S.actor(S.lion, walk(u, 0, 4, -120, 380), moving(u, 0, 4), say(c, 'lion'), .55, { flip: true });
        S.foreground();
      },
      says: [['lion', 'Listen! Who is crying?', 4.5, 8.5, 380, 330, 26], ['lion', 'Why are you sad, little Mouse?', 18, 22, 380, 330, 26],
             ['mouse', "I'm hungry. The fruit is too high!", 22.5, 28, 760, 370, 26]],
      big: [['How does Mouse feel?', 9, 17.6, 480, 80, 52, '#ffffff'], ['Sad', 13, 17.6, 790, 245, 40, '#7cb7f2']],
      after: (u, c) => face(790, 175, 42, 'sad', win(u, 13, 17.6, .3)),
      sfx: [[1, 'sad', .45], [9, 'chime:E5', .4], [13, 'sad', .5], [22.6, 'squeak', .5]] },

    // 3 – Leo jumps (one, two, three – too high!), then Ella reaches the fruit with her long trunk
    { d: 34, draw: (u, c) => {
        savanna(23 + u * .3, c.t);
        const taken = u > 21.4, give = clamp((u - 26.4) / 1.4);
        fruitTree(700, 452, c.t);
        // Leo: jumps 3 times under the fruit, then steps aside
        const jumpN = u > 3 && u < 9.6 ? Math.floor((u - 3) / 2.2) : -1, jv = jumpN >= 0 ? ((u - 3) % 2.2) / 1.1 : 2;
        const lift = jv < 1 ? Math.sin(jv * Math.PI) * (20 + jumpN * 8) : 0;
        S.actor(S.lion, walk(u, 11, 13.5, 600, 300), moving(u, 11, 13.5), say(c, 'lion'), .55, { flip: true, lift });
        // Ella walks in, lifts her trunk (act drives the trunk), then lowers it
        const up = u < 18 ? 0 : u < 20.5 ? ease((u - 18) / 2.5) : u < 22.4 ? 1 : u < 25 ? 1 - ease((u - 22.4) / 2.6) : 0;
        const ex = walk(u, 13, 17.5, -260, 560);
        S.actor(S.elephant, ex, moving(u, 13, 17.5), Math.max(up / 1.4, say(c, 'elephant')), .62, { flip: true, blinkOff: 1 });
        const mood = u > 28 ? 'happy' : 'sad';
        S.actor(MOUSE(mood, c.t), 840, false, 0, 1.6, { flip: true, noShadow: true, lift: u > 28 ? hop(c.t, 5, 10) : 0 });
        // the fruit: hanging -> on trunk tip -> flies to Mouse
        const k = ease(clamp(up)), tipX = ex + .62 * (82 + lerp(12, 58, k)), tipY = G + .62 * (-135 + lerp(78, -70, k));
        if (!taken) { x.strokeStyle = '#4f7a2e'; x.lineWidth = 3; x.beginPath(); x.moveTo(648 + Math.sin(c.t * 1.2) * 3, 290); x.lineTo(647, 314); x.stroke(); fruit(647, 327, 1.1, win(u, 2, 10) * .5); }
        else if (give <= 0) fruit(tipX, tipY - 8, 1.1);
        else fruit(lerp(tipX, 810, give), lerp(tipY - 8, G - 18, give) - Math.sin(give * Math.PI) * 120, 1.1);
        S.foreground();
      },
      says: [['lion', "I'll jump for it!", .6, 3.4, 600, 330, 26], ['lion', 'Oh no! Too high!', 9.8, 12.8, 600, 330, 26],
             ['elephant', 'I can help! My trunk is long!', 13.5, 17.6, 340, 280, 26], ['elephant', 'Here you go, little Mouse!', 25.2, 29.4, 520, 290, 26],
             ['mouse', 'Thank you, Ella!', 29.8, 33.4, 800, 370, 26]],
      big: [...[1, 2, 3].map(n => [String(n), 3.2 + (n - 1) * 2.2, 3.2 + (n - 1) * 2.2 + 1.8, 470, 200, 64, '#ffd23f']),
            ['Up, up, up!', 18.2, 21.6, 480, 80, 60, '#ffffff']],
      sfx: [[3.1, 'boing', .6], [5.3, 'boing', .6], [7.5, 'boing', .7], [9.8, 'sad', .35], [18.3, 'trumpet', .7], [21.4, 'pop', .7],
            [26.4, 'whoosh', .5], [27.8, 'bump', .5], [28.1, 'tada', .6], [29.8, 'squeak', .5]] },

    // 4 – Mouse is happy now and shares the fruit: five pieces, one for everyone
    { d: 32, draw: (u, c) => {
        savanna(26 + u * .3, c.t);
        const P = [['lion', 120, .5], ['elephant', 300, .55], ['rhino', 480, .48], ['buffalo', 650, .48]];
        P.forEach(([k, px, sc], i) => S.actor(ANI[k], px, false, say(c, k), sc, { flip: true, blinkOff: i, lift: u > 26 ? hop(c.t + i, 4, 6) : 0 }));
        S.actor(MOUSE('happy', c.t), 830, false, 0, 1.7, { flip: true, noShadow: true, lift: hop(c.t, 5, 8) });
        // the fruit splits into 5 pieces that fly to the friends (and one stays with Mouse)
        const targets = [[120 - 30, 390], [300 - 50, 360], [480 - 40, 400], [650 - 40, 400], [800, 400]];
        if (u < 20) fruit(780, G - 18, 1.3 + win(u, 15.5, 20) * .2);
        else targets.forEach(([tx, ty], i) => {
          const k = ease(clamp((u - 20.4 - i * 1) / .8)), px = lerp(780, tx, k), py = lerp(G - 18, ty, k) - Math.sin(k * Math.PI) * 90;
          x.save(); x.translate(px, py); x.rotate(i * .7); C.ell(0, 0, 10, 7, '#ffb627', INK, 2.5); C.ell(0, -2, 6, 3, '#ffe08a'); x.restore();
        });
      },
      says: [['mouse', "Let's share! One for everyone!", 15.5, 20, 760, 370, 26], ['lion', 'Thank you, Mouse!', 26.5, 31, 150, 340, 26]],
      big: [['How does Mouse feel now?', 3, 12.6, 480, 80, 52, '#ffffff'], ['Happy!', 7.5, 12.6, 830, 245, 44, '#ffd23f'],
            ...[1, 2, 3, 4, 5].map(n => [String(n), 20.9 + (n - 1), 25.6, [90, 250, 440, 610, 800][n - 1], [300, 250, 310, 310, 330][n - 1], 48, '#ffd23f'])],
      after: (u, c) => face(830, 175, 42, 'happy', win(u, 7.5, 12.6, .3)),
      sfx: [[2, 'laugh', .5], [7.6, 'tada', .6], [20.4, 'chime:C6', .45], [21.4, 'chime:D6', .45], [22.4, 'chime:E6', .45], [23.4, 'chime:F6', .45], [24.4, 'chime:G6', .45],
            [26.5, 'cheer', .5]] },

    // 5 – sunset: Mouse rides on Ella's head; recap sad -> happy; "Be kind!"
    { d: 30, draw: (u, c) => {
        savanna(lerp(50, 57, ease(clamp(u / 8))), c.t);
        const P = [['lion', 170, .52], ['rhino', 760, .5], ['buffalo', 900, .48]];
        P.forEach(([k, px, sc], i) => S.actor(ANI[k], px, false, say(c, k), sc, { flip: k === 'lion', blinkOff: i, lift: u > 15 && u < 22 ? hop(c.t + i, 4, 7) : 0 }));
        const eLift = u > 15 && u < 22 ? hop(c.t + 2, 4, 7) : 0;
        S.actor(S.elephant, 470, false, say(c, 'elephant'), .6, { blinkOff: 1, lift: eLift });
        S.actor(MOUSE('happy', c.t), 470 - 82 * .6 + 4, false, 0, 1.3, { lift: (135 + 40) * .6 + eLift - 2, noShadow: true });
        S.foreground();
        // recap: sad -> happy
        const k1 = win(u, 2.5, 13.5, .3), k2 = win(u, 4, 13.5, .3);
        face(390, 120, 40, 'sad', k1); face(570, 120, 40, 'happy', k2);
        if (k2 > 0) { x.save(); x.globalAlpha = clamp(k2 * 2); x.fillStyle = '#ffffff'; x.strokeStyle = INK; x.lineWidth = 3;
          x.beginPath(); x.moveTo(445, 112); x.lineTo(495, 112); x.lineTo(495, 100); x.lineTo(518, 120); x.lineTo(495, 140); x.lineTo(495, 128); x.lineTo(445, 128); x.closePath(); x.fill(); x.stroke(); x.restore(); }
        if (u > 15 && u < 22) C.sparkles(480, 140, c.t, 12, 200, '#ffe08a');
      },
      says: [['lion', 'Mouse was sad... now Mouse is happy!', 2.5, 7.5, 200, 340, 26], ['elephant', 'Being kind makes friends happy!', 8, 13, 470, 230, 26],
             ['buffalo', 'Goodnight, friends!', 19, 22.5, 860, 330, 24]],
      big: [['Sad', 2.5, 13.5, 390, 180, 30, '#7cb7f2'], ['Happy', 4, 13.5, 570, 180, 30, '#ffd23f'], ['Be kind!', 14.5, 19, 480, 110, 76, '#ffd23f']],
      sfx: [[2.5, 'chime:E5', .4], [4, 'chime:C6', .5], [8, 'trumpet', .35], [14.5, 'tada', .7], [15, 'cheer', .45], [19, 'bellow', .35], [22.5, 'yawn', .4]] },
  ],
});
