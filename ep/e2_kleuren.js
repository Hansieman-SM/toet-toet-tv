// Aflevering 2: Toet en de kleuren
const C = require('../lib/common'), T = require('../lib/toet');
const { x, W, clamp, ease, win, lerp, mix, hash, INK } = C;
const DUR = 60, BX = 290, SPEED = 150;
const COLORS = [
  { at: 6,  name: 'Rood!',  col: '#e63946', ink: '#ffffff' },
  { at: 13, name: 'Blauw!', col: '#3a86ff', ink: '#ffffff' },
  { at: 20, name: 'Groen!', col: '#6cd36b', ink: INK },
  { at: 27, name: 'Paars!', col: '#9b5de5', ink: '#ffffff' },
  { at: 34, name: 'Roze!',  col: '#ff8fc8', ink: INK },
  { at: 41, name: 'Geel!',  col: '#ffd23f', ink: INK },
];
const POP = 3.2, FRONT = BX + 236;
const leaves = T.makeLeaves();

function balloon(bx, by, col, s = 1, string = true, sway = 0) {
  if (string) { x.strokeStyle = INK; x.lineWidth = 1.5; x.beginPath(); x.moveTo(bx, by + 34 * s); x.quadraticCurveTo(bx + sway * 8, by + 70 * s, bx, by + 100 * s); x.stroke(); }
  x.fillStyle = col; x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.ellipse(bx, by, 26 * s, 32 * s, 0, 0, 7); x.fill(); x.stroke();
  x.fillStyle = col; x.beginPath(); x.moveTo(bx - 5 * s, by + 34 * s); x.lineTo(bx + 5 * s, by + 34 * s); x.lineTo(bx, by + 29 * s); x.fill(); x.stroke();
  x.fillStyle = 'rgba(255,255,255,.55)'; x.beginPath(); x.ellipse(bx - 9 * s, by - 12 * s, 6 * s, 10 * s, -.4, 0, 7); x.fill();
}
function splash(cx, cy, col, k) {
  if (k <= 0 || k >= 1) return;
  for (let i = 0; i < 16; i++) {
    const a = hash(i * 1.7) * Math.PI * 2, v = 90 + hash(i + 4) * 160, tt = k * 1.2;
    const px = cx + Math.cos(a) * v * tt, py = cy + Math.sin(a) * v * tt + 260 * tt * tt;
    x.globalAlpha = 1 - k; x.fillStyle = col; x.beginPath(); x.arc(px, py, 7 + hash(i) * 6, 0, 7); x.fill();
  }
  x.globalAlpha = 1;
}

function boxColor(t) {
  let col = '#ffd23f', ink = INK;
  for (const c of COLORS) {
    const k = clamp((t - c.at - POP) / .3);
    if (k > 0) { col = mix(col, c.col, k); ink = k > .5 ? c.ink : ink; }
  }
  return { col, ink };
}

function draw(t) {
  const dist = t * SPEED;
  const n = T.world({ t, dist, skyP: .1 + t / 500, near: 'trees',
    behindRoad() {
      COLORS.forEach(c => {
        const u = t - c.at; if (u < 0 || u > POP) return;
        const px = FRONT + (POP - u) * SPEED + 20, sway = Math.sin(t * 3 + c.at);
        x.fillStyle = '#7a5134'; x.fillRect(px - 3, 400, 6, 36);
        balloon(px + sway * 4, 300 + Math.sin(t * 2.5 + c.at) * 6, c.col, 1.3, true, sway);
      });
    } });
  leaves.draw();
  const bc = boxColor(t);
  const oh = COLORS.reduce((m, c) => Math.max(m, win(t, c.at + POP, c.at + POP + .8, .1)), 0);
  const Tk = T.truck({ t, dist, moving: true, bx: BX, box: bc.col, boxInk: bc.ink, mouth: Math.max(oh, win(t, 3, 3.6, .1)), happy: true, night: n });
  T.headlight(Tk, n);
  COLORS.forEach(c => splash(FRONT + 20, 300, c.col, (t - c.at - POP) / .9));
  COLORS.forEach((c, i) => {
    const k = win(t, c.at + POP, c.at + POP + 3.2, .25);
    C.bigText(i === 5 ? 'Weer geel!' : c.name, W / 2, 140, k, 96, c.col);
  });
  C.bubble('Ballonnen! Welke kleur zie jij?', BX + 200, Tk.by - 175, win(t, 4.8, 8.4), { size: 28 });
  // overzicht: rij ballonnen met namen
  COLORS.forEach((c, i) => {
    const k = clamp((t - 48.2 - i * .7) / .4); if (k <= 0 || t > 54.6) return;
    const px = 110 + i * 148, py = 110 + Math.sin(t * 2.5 + i) * 6, s = ease(k) * (1 + Math.sin(k * Math.PI) * .2);
    x.save(); x.translate(px, py); x.scale(s, s); balloon(0, 0, c.col, 1.6, false); x.restore();
    C.bigText(c.name.replace('!', ''), px, py + 205 > 300 ? 228 : py + 205, k, 36, c.col);
  });
  C.card(['Toet en de kleuren', 80], ['Welke kleur wordt Toet?', 44], t < 2.6 ? clamp((t - .3) / .7) : clamp((4.6 - t) / .6));
  C.card(['Wat een kleuren!', 72], ['Tot de volgende keer!', 44], clamp((t - 54.8) / .6));
  C.fadeBlack(t, DUR);
}
C.run(draw, DUR, {
  step: (t, dt) => leaves.step(dt, SPEED, BX),
  thumb: () => C.thumbTitle('Toet en de kleuren!', 'Rood, blauw, groen...'),
});
