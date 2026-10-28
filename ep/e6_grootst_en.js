process.env.TOET_LANG = 'en';
// Aflevering 6: Wie is het grootst?
const C = require('../lib/common'), S = require('../lib/safari');
const { x, W, H, clamp, ease, win, lerp, rr } = C;
const DUR = 60;
const CAST = [
  { s: 5,  d: S.lion,     key: 'lion',     sc: .85,  x: 125, hi: "I am big!",              h: "1.2 meters", word: 'big' },
  { s: 11, d: S.buffalo,  key: 'buffalo',  sc: .95,  x: 300, hi: "I am bigger!",             h: "1.7 meters", word: 'bigger' },
  { s: 17, d: S.rhino,    key: 'rhino',    sc: 1.05, x: 470, hi: "I am even bigger!",         h: "1.8 meters", word: "even bigger" },
  { s: 23, d: S.elephant, key: 'elephant', sc: 1.35, x: 765, hi: "I am the biggest of all!",   h: "3.3 meters", word: 'biggest' },
];
const actOf = (t, at, len = 1.8) => clamp(Math.sin(clamp((t - at) / len) * Math.PI) * 1.4);

function tag(txt, cx, cy, k) {
  if (k <= 0) return;
  x.save(); x.globalAlpha = clamp(k * 2); x.translate(cx, cy); const s = .6 + .4 * ease(k * 2); x.scale(s, s);
  x.font = C.FONT(22); const w = x.measureText(txt).width + 26;
  x.fillStyle = '#2f6fb3'; x.strokeStyle = S.INK; x.lineWidth = 3; rr(-w / 2, -18, w, 36, 18); x.fill(); x.stroke();
  x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 0, 1);
  x.restore();
}

function draw(t) {
  S.setT(t); S.sky(); S.land();
  const laugh = t > 43 && t < 45.5 ? .5 + .3 * Math.sin(t * 18) : 0;
  CAST.forEach((a, i) => {
    const u = t - a.s; if (u < 0) return;
    let px = a.x, mv = false;
    if (u < 2.5) { px = lerp(W + 200, a.x, ease(u / 2.5)); mv = true; }
    const act = Math.max(actOf(u, 3), laugh);
    if (a.key === 'rhino') S.dust(px - 105 * a.sc, S.GROUND - 40 * a.sc, (u - 3) / 1.4);
    const hop = t > 50 && t < 53 && a.key === 'elephant' ? Math.abs(Math.sin((t - 50) * 5)) * 14 : 0;
    S.actor(a.d, px, mv, act, a.sc, { lift: hop, blinkOff: i });
  });
  // muisje
  if (t > 36.3) {
    const k = ease((t - 36.3) / 2), mx = lerp(-60, 300, k);
    x.save(); x.translate(0, 34); S.actor(S.mouse, mx, k < 1, 0, 1.3, { flip: true }); x.restore();
  }
  S.foreground();
  // ballonnen en maten (na de voorgrond zodat ze leesbaar blijven)
  CAST.forEach((a, i) => {
    const u = t - a.s, headY = S.GROUND - S.HEAD[a.key] * a.sc;
    C.bubble(a.hi, a.x - 30, headY - 75, win(u, 2.6, 5.6), { size: 26, ink: S.INK });
    tag(a.h, a.x, headY - 14, t > a.s + 3 && t < 49 && !(t > 36.3 && t < 42.6) ? Math.min(1, (u - 3) * 3, (t > 42.6 ? (t - 42.6) * 3 : 9), t < 36.3 ? (36.3 - t) * 3 : 9) : 0);
    C.bigText(a.word, a.x, 512, win(t, 29.5 + i, 36, .25), 30, '#ffffff', S.INK);
  });
  const mouseY = S.GROUND + 34 - 45 * 1.3;
  C.bubble("Squeak! And I am the smallest of all!", 330, mouseY - 70, win(t, 38.4, 42.4), { size: 26, ink: S.INK });
  tag("5 centimeters", 300, mouseY - 16, t > 42.6 && t < 49 ? Math.min(1, (t - 42.6) * 3) : 0);
  C.bigText("Big or small: we're all friends!", W / 2, 80, win(t, 43.5, 48.6, .3), 46, '#ffffff', S.INK);
  C.bigText("Who is the biggest?", W / 2, 80, win(t, 49, 50.4, .2), 54, '#ffffff', S.INK);
  C.bigText("Ella the Elephant!", W / 2, 80, win(t, 50.5, 54.4, .2), 66, '#ff7a45', S.INK);
  if (t > 50.5 && t < 54.4) C.sparkles(765, S.GROUND - 130, t, 12, 220);
  const o = { ink: S.INK, bg: '#fff8e8', accent: '#e8701f' };
  C.card(["Who is the biggest?", 76], ["Big, bigger, biggest!", 44], t < 2.6 ? clamp((t - .3) / .7) : clamp((4.6 - t) / .6), o);
  C.card(["Big and small!", 76], ["Bye-bye!", 44], clamp((t - 54.8) / .6), o);
  C.fadeBlack(t, DUR);
}
C.run(draw, DUR, { thumb: () => C.thumbTitle("Who is the biggest?", "Big, bigger, biggest!", '#ffd23f') });
