process.env.TOET_LANG = 'en';
// Aflevering 3: Toet gaat opladen
const C = require('../lib/common'), T = require('../lib/toet');
const { x, W, clamp, ease, win, lerp, rr, INK } = C;
const DUR = 60, BX = 290;
const M = T.motion([[0, 150], [14, 150], [18.5, 0], [39, 0], [41.5, 150], [60, 150]]);
const D = M.distAt(18.5);
const CHX = BX + 400, CHS = 1.9, BASE = 438;
const BARS = [25, 27, 29, 31, 33];
const leaves = T.makeLeaves();

function level(t) {
  if (t < 5) return .6;
  if (t < 16) return lerp(.6, .1, (t - 5) / 11);
  if (t < 24) return .1;
  if (t < 34) { const b = BARS.filter(a => t >= a).length; return Math.max(.1, b * .2); }
  if (t < 42) return 1;
  return lerp(1, .85, clamp((t - 42) / 12));
}
function battery(t) {
  const lv = level(t), bars = Math.max(1, Math.round(lv * 5 - .01));
  const low = lv < .25, blink = low && t > 12 && t < 24 && Math.floor(t * 3) % 2 === 0;
  const col = lv > .45 ? '#2fb36a' : lv > .25 ? '#ff9f1c' : '#e63946';
  x.save(); x.translate(W - 230, 34);
  x.fillStyle = '#ffffff'; x.strokeStyle = INK; x.lineWidth = 5; rr(0, 0, 180, 80, 16); x.fill(); x.stroke();
  x.fillStyle = INK; rr(180, 24, 16, 32, 5); x.fill();
  for (let i = 0; i < 5; i++) {
    const on = i < bars && !(blink && i === 0);
    const pop = BARS.includes(BARS[i]) && t >= BARS[i] && t < BARS[i] + .4 ? 1 + Math.sin((t - BARS[i]) / .4 * Math.PI) * .25 : 1;
    x.save(); x.translate(15 + i * 32 + 13, 40); x.scale(1, pop);
    x.fillStyle = on ? col : '#e3e8ee'; rr(-13, -26, 26, 52, 6); x.fill();
    x.restore();
  }
  if (t > 23.5 && t < 34.5) T.bolt(90, 40, 1.6 + Math.sin(t * 8) * .15, '#ffd23f');
  x.restore();
}

function draw(t) {
  const dist = M.distAt(t), sp = M.speedAt(t);
  const skyP = .12 + clamp((t - 40) / 15) * .4;
  const chx = CHX + (D - dist);
  const sockX = BX + 142, sockY = T.ROAD + 20 - 35;
  const plugX = chx + 14 * CHS, plugY = BASE - 26 * CHS;
  const cable = t < 22 ? 0 : t < 23 ? ease(t - 22) : t < 38 ? 1 : 1 - ease((t - 38) / .6);
  const n = T.world({ t, dist, skyP, near: 'mixed',
    behindRoad() {
      if (chx > -100 && chx < W + 100) T.charger(chx, BASE, CHS);
    } });
  leaves.draw();
  const sleepy = clamp((t - 9) / 8) * .85 * (1 - clamp((t - 24) / 9));
  const Tk = T.truck({ t, dist, moving: sp > 5, bx: BX, sleepy, mouth: Math.max(win(t, 3, 3.6, .1), win(t, 38.8, 39.4, .1), win(t, 34, 35, .15)), happy: t > 34, night: n });
  T.headlight(Tk, n);
  // laadkabel
  if (cable > 0) {
    const ex = lerp(plugX, sockX, cable), ey = lerp(plugY, sockY, cable);
    x.strokeStyle = INK; x.lineWidth = 7; x.lineCap = 'round';
    x.beginPath(); x.moveTo(plugX, plugY); x.quadraticCurveTo((plugX + ex) / 2, Math.max(plugY, ey) + 40, ex, ey); x.stroke();
    x.strokeStyle = '#2fb36a'; x.lineWidth = 3; x.stroke();
    C.circ(ex, ey, 7, '#2fb36a', INK, 2.5);
    // stroom-bliksems over de kabel
    if (t > 23.5 && t < 34) for (let i = 0; i < 3; i++) {
      const k = ((t * .9 + i / 3) % 1), qx = (1 - k) * (1 - k) * plugX + 2 * (1 - k) * k * ((plugX + sockX) / 2) + k * k * sockX;
      const qy = (1 - k) * (1 - k) * plugY + 2 * (1 - k) * k * (Math.max(plugY, sockY) + 40) + k * k * sockY;
      T.bolt(qx, qy - 2, .7, '#ffd23f');
    }
  }
  if (t > 34 && t < 38) C.sparkles(BX + 75, Tk.by - 60, t, 10, 150);
  battery(t);
  // tekst
  C.bubble("My battery is getting low...", BX + 200, Tk.by - 175, win(t, 10.5, 13.5), { size: 28 });
  C.bubble("Oops! I need to charge!", BX + 200, Tk.by - 175, win(t, 15.8, 19), { size: 30 });
  C.bubble("There's a charging station!", BX + 200, Tk.by - 175, win(t, 19.4, 22.2), { size: 30 });
  C.bigText("Charging...", W / 2 - 60, 150, win(t, 23.6, 33.4, .3), 72, '#2fb36a');
  C.bigText("FULL!", W / 2 - 60, 150, win(t, 34, 37.2, .2), 110, '#2fb36a');
  C.bubble("Yay! I can drive again!", BX + 200, Tk.by - 175, win(t, 35.2, 38.6), { size: 28 });
  C.bubble("Driving electric is nice and clean!", BX + 200, Tk.by - 175, win(t, 44.5, 49), { size: 26 });
  C.card(["Toet Charges Up", 82], ["Will the battery get full again?", 42], t < 2.6 ? clamp((t - .3) / .7) : clamp((4.6 - t) / .6));
  C.card(["All charged up!", 72], ["See you next time!", 44], clamp((t - 54.5) / .6));
  C.fadeBlack(t, DUR);
}
C.run(draw, DUR, {
  step: (t, dt) => leaves.step(dt, M.speedAt(t), BX),
  thumb: () => C.thumbTitle("Toet charges up!", "Will the battery get full?"),
});
