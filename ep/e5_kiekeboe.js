// Aflevering 5: Kiekeboe op de savanne
const C = require('../lib/common'), S = require('../lib/safari');
const { x, W, clamp, ease, win, lerp } = C;
const DUR = 60, BUSHX = 520, BUSHS = 1.3, HIDEX = 655, OUTX = 290;
const CAST = [
  { s: 5,  d: S.lion,     key: 'lion',     sc: 1.3,  name: 'Leo de Leeuw' },
  { s: 17, d: S.elephant, key: 'elephant', sc: 1.05, name: 'Ella de Olifant' },
  { s: 29, d: S.rhino,    key: 'rhino',    sc: 1.25, name: 'Nico de Neushoorn' },
  { s: 41, d: S.buffalo,  key: 'buffalo',  sc: 1.25, name: 'Boris de Buffel' },
];
const actOf = (u, at, len = 1.8) => clamp(Math.sin(clamp((u - at) / len) * Math.PI) * 1.4);

function draw(t) {
  S.setT(t); S.sky(); S.land();
  let signArgs = null;
  const a = t < 52.5 ? CAST.find(c => t >= c.s && t < c.s + 12) : null;
  const u = a ? t - a.s : 0;
  const shake = a && (win(u, 1.5, 2.6, .1) || win(u, 4.5, 5.6, .1)) ? 1 : 0;
  // dier achter de struik
  if (a && u < 6.5) S.actor(a.d, HIDEX, false, 0, a.sc, { alpha: clamp(u / .6), noShadow: true });
  S.bush(BUSHX, S.GROUND + 8, BUSHS, shake);
  if (a && u >= 6.5) {
    const j = ease((u - 6.5) / .55);
    let px = lerp(HIDEX, OUTX, j), lift = Math.sin(clamp((u - 6.5) / .55) * Math.PI) * 130, mv = false;
    if (u > 10.6) { px = lerp(OUTX, -260, ease((u - 10.6) / 1.4)); mv = true; lift = 0; }
    const act = actOf(u, 7.0);
    if (a.key === 'rhino') S.dust(px - 105 * a.sc, S.GROUND - 40 * a.sc, (u - 7) / 1.4);
    S.actor(a.d, px, mv, act, a.sc, { lift });
    const headY = S.GROUND - S.HEAD[a.key] * a.sc;
    C.burst('KIEKEBOE!', W / 2 + 120, 150, (u - 6.5) / 1.8, t, '#ffd23f', '#e8501f', S.INK);
    C.bigText(a.name + '!', W / 2 + 120, 80, win(u, 8.3, 10.8, .2), 60, '#ff7a45', S.INK);
    signArgs = [a.name, win(u, 8, 10.9, .3) * 3];
  }
  if (a) {
    C.bigText('Wie verstopt zich daar?', W / 2, 80, win(u, .6, 6.2), 54, '#ffffff', S.INK);
    if (u > 2.6 && u < 6.4) C.bigText('?', HIDEX + 150, S.GROUND - 190 + Math.sin(t * 3) * 6, win(u, 2.6, 6.4), 110, '#ffd23f', S.INK);
  }
  if (t >= 52.5) {
    const k = ease((t - 53) / 2.5), off = (1 - k) * 760;
    [[1, 210, .78], [0, 420, .8], [2, 600, .78], [3, 795, .78]].forEach(([ci, tx, s]) => S.actor(CAST[ci].d, tx + off, k < 1, 0, s));
  }
  S.foreground();
  if (signArgs) S.sign(...signArgs);
  const o = { ink: S.INK, bg: '#fff8e8', accent: '#e8701f' };
  C.card(['Kiekeboe!', 90], ['Wie verstopt zich op de savanne?', 40], t < 2.6 ? clamp((t - .3) / .7) : clamp((4.6 - t) / .6), o);
  C.card(['Kiekeboe!', 84], ['Tot de volgende keer!', 44], clamp((t - 55.6) / .6), o);
  C.fadeBlack(t, DUR);
}
C.run(draw, DUR, { thumb: () => C.thumbTitle('Kiekeboe!', 'Wie verstopt zich daar?', '#ffd23f') });
