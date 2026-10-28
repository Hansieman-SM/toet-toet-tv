process.env.TOET_LANG = 'en';
// Aflevering 4: Wie maakt dit geluid?
const C = require('../lib/common'), S = require('../lib/safari');
const { x, W, H, clamp, ease, win, lerp } = C;
const DUR = 60, CX = 500;
const CAST = [
  { s: 5,  d: S.lion,     key: 'lion',     sc: 1.35, name: "Leo the Lion" },
  { s: 17, d: S.elephant, key: 'elephant', sc: 1.1,  name: "Ella the Elephant" },
  { s: 29, d: S.rhino,    key: 'rhino',    sc: 1.3,  name: "Nico the Rhino" },
  { s: 41, d: S.buffalo,  key: 'buffalo',  sc: 1.3,  name: "Boris the Buffalo" },
];
const actOf = (u, at, len = 1.8) => clamp(Math.sin(clamp((u - at) / len) * Math.PI) * 1.4);

function draw(t) {
  S.setT(t); S.sky(); S.land();
  let signArgs = null;
  if (t < 52.5) {
    const a = CAST.find(c => t >= c.s && t < c.s + 12);
    if (a) {
      const u = t - a.s, sil = 1 - ease((u - 9) / .6), alpha = Math.min(clamp(u / .8), clamp((12 - u) / .6));
      const act = Math.max(actOf(u, 1.5), actOf(u, 4.2), actOf(u, 9.4));
      if (a.key === 'rhino') [1.5, 4.2, 9.4].forEach(m => S.dust(CX - 105 * a.sc, S.GROUND - 40 * a.sc, (u - m) / 1.4));
      S.actor(a.d, CX, false, act, a.sc, { silhouette: sil, alpha, lift: u > 9 && u < 9.6 ? Math.sin((u - 9) / .6 * Math.PI) * 20 : 0 });
      const headY = S.GROUND - S.HEAD[a.key] * a.sc;
      if (u < 9) C.bigText('?', CX + 170 * a.sc * .9, headY - 10 + Math.sin(t * 3) * 6, alpha, 120, '#ffd23f', S.INK);
      C.bigText("Who makes this sound?", W / 2, 80, win(u, .6, 5.6), 54, '#ffffff', S.INK);
      ['3', '2', '1'].forEach((nn, i) => C.bigText(nn, W / 2, 90, win(u, 6 + i, 6.85 + i, .15), 120, '#ff7a45', S.INK));
      if (u > 9 && u < 11.6) C.sparkles(CX, headY + 40, t, 10, 170);
      C.bigText(a.name + '!', W / 2, 80, win(u, 9.1, 11.6, .2), 64, '#ff7a45', S.INK);
      signArgs = [a.name, win(u, 9.1, 11.6, .3) * 3];
    }
  } else {
    const k = ease((t - 53) / 2.5), off = (1 - k) * 760;
    [[1, 210, .78], [0, 420, .8], [2, 600, .78], [3, 795, .78]].forEach(([ci, tx, s]) => S.actor(CAST[ci].d, tx + off, k < 1, 0, s));
  }
  S.foreground();
  if (signArgs) S.sign(...signArgs);
  C.card(["Who makes this sound?", 74], ["Can you guess?", 44], t < 2.6 ? clamp((t - .3) / .7) : clamp((4.6 - t) / .6), { ink: S.INK, bg: '#fff8e8', accent: '#e8701f' });
  C.card(["Good guess!", 72], ["Bye-bye!", 44], clamp((t - 55.6) / .6), { ink: S.INK, bg: '#fff8e8', accent: '#e8701f' });
  C.fadeBlack(t, DUR);
}
C.run(draw, DUR, { thumb: () => C.thumbTitle("Who makes this sound?", "Can you guess?", '#ffd23f') });
