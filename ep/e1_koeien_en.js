process.env.TOET_LANG = 'en';
// Aflevering 1: Toet telt koeien
const C = require('../lib/common'), T = require('../lib/toet');
const { x, W, clamp, ease, win, lerp } = C;
const DUR = 60, BX = 105;
const M = T.motion([[0, 150], [6, 150], [9.5, 0], [47.5, 0], [50, 150], [60, 150]]);
const D = M.distAt(9.5);
const COWS = [0, 1, 2, 3, 4].map(i => ({ at: 11 + i * 5, x: 395 + i * 122 }));
const WORDS = ["One cow!", "Two cows!", "Three cows!", "Four cows!", "Five cows!"];
const RECAP = 37;
const leaves = T.makeLeaves();

function draw(t) {
  const dist = M.distAt(t), sp = M.speedAt(t), shift = (dist - D) * .6;
  const n = T.world({ t, dist, skyP: .12 + t / 500, near: 'trees',
    behindRoad() {
      COWS.forEach((c, i) => {
        const u = t - c.at; if (u < 0) return;
        const pop = u < .5 ? ease(u / .5) * (1 + Math.sin(u / .5 * Math.PI) * .25) : 1;
        const moo = [c.at + .9, 44.5 + i * .3].map(m => clamp(Math.sin(clamp((t - m) / 1.2) * Math.PI) * 1.3)).reduce((a, b) => Math.max(a, b));
        const hl = t > RECAP + i - .1 && t < RECAP + i + .8 ? 1 + Math.sin((t - RECAP - i) * Math.PI / .9) * .12 : 1;
        const px = c.x - shift;
        x.save(); x.translate(px, 414); x.scale(pop * hl, pop * hl);
        T.cow(0, 0, 1.45, t * 4 + i, moo, (t + i * .7) % 3.4 > 3.25);
        x.restore();
        // getal boven de koe
        if (u > .3) C.bigText(String(i + 1), px + 12, 318 - (hl - 1) * 80, Math.min((u - .3) * 2, 1), hl > 1 ? 58 : 44, '#ff7a45');
      });
    } });
  leaves.draw();
  const Tk = T.truck({ t, dist, moving: sp > 5, bx: BX, mouth: win(t, 46.2, 46.9, .1) + win(t, 3, 3.6, .1), happy: t > 42, night: n });
  T.headlight(Tk, n);
  // tekst
  C.bubble("Look, a meadow! Shall we count the cows?", BX + 230, Tk.by - 175, win(t, 6.2, 10.3) , { size: 28 });
  COWS.forEach((c, i) => C.bigText(WORDS[i], W / 2 + 60, 150, win(t, c.at + .3, c.at + 3.6, .25), 72, '#ffd23f'));
  C.bigText("5 cows!", W / 2 + 60, 150, win(t, 42.5, 45.8, .25), 96, '#ffd23f');
  C.bubble("Bye, cows!", BX + 230, Tk.by - 175, win(t, 46.2, 49.2), { size: 30 });
  C.card(["Toet Counts Cows", 84], ["Count along!", 44], t < 2.6 ? clamp((t - .3) / .7) : clamp((4.6 - t) / .6));
  C.card(["Well counted!", 72], ["See you next time!", 44], clamp((t - 54.5) / .6));
  C.fadeBlack(t, DUR);
}
C.run(draw, DUR, {
  step: (t, dt) => leaves.step(dt, M.speedAt(t), BX),
  thumb: () => { C.thumbTitle("Toet counts cows!", "Count along! 1 2 3 4 5"); },
});
