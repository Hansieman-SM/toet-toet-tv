// Verhaalsysteem voor "Toet op avontuur": shots, dialogen, overgangen, geluidsevents.
const C = require('./common'), T = require('./toet'), F = require('./toetfriends');
const { x, W, H, clamp, ease, lerp, hash, win } = C;
const ROAD = T.ROAD, GY = T.ROAD + 46;

// says-regel: [wie, tekst, van, tot, bx (getal of fn(u)), by, grootte?]
function talkLevel(says, who, u) {
  for (const s of says || []) if (s[0] === who && u >= s[2] + .15 && u <= s[3] - .35) return .25 + Math.abs(Math.sin(u * 11)) * .7;
  return 0;
}
// blaadjes zonder status (afhankelijk van tijd)
function leavesAt(t, bx, sp) {
  if (sp < 20) return;
  for (let k = Math.floor(t / .35) - 9; k <= Math.floor(t / .35); k++) {
    const age = t - k * .35; if (age < 0 || age > 2.8) continue;
    const px = bx - 74 - (sp * .6 + 30) * age, py = ROAD - 40 - hash(k) * 60 + age * 12 + Math.sin(age * 3 + k) * 10;
    T.leaf(px, py, age * 4 + k, clamp(1 - age / 2.8), 1.5 + hash(k + 3) * .8);
  }
}
const place = (fn, px, gy, s, flip = false, t = 1, o = {}) => { x.save(); x.translate(px, gy); x.scale(s * (flip ? -1 : 1), s); fn(t, o); x.restore(); };

// rijdende Toet in de Hollandse wereld
function drive(o) {
  const M = T.motion(o.segs || [[0, 150]]);
  return (u, ctx) => {
    const dist = M.distAt(u) + (o.dist0 || 0), sp = M.speedAt(u);
    const bx = typeof o.bx === 'function' ? o.bx(u) : (o.bx ?? 290);
    const skyP = typeof o.skyP === 'function' ? o.skyP(u) : (o.skyP ?? .12);
    ctx.dist = dist; ctx.sp = sp; ctx.bx = bx;
    const n = T.world({ t: ctx.t, dist, skyP, near: o.near || 'mixed',
      afterSky: () => o.sky && o.sky(u, ctx), behindRoad: () => o.behind && o.behind(u, ctx), onRoad: () => o.onRoad && o.onRoad(u, ctx) });
    ctx.night = n;
    if (!o.noLeaves) leavesAt(u, bx, sp);
    if (o.beforeTruck) o.beforeTruck(u, ctx);
    if (!o.noToet) {
      const extra = o.truck ? o.truck(u, ctx) : {};
      const Tk = T.truck(Object.assign({ t: ctx.t, dist, moving: sp > 5, bx, mouth: ctx.talk('toet'), night: n }, extra));
      ctx.Tk = Tk; if (!(typeof o.noLight === 'function' ? o.noLight(u) : o.noLight)) T.headlight(Tk, n);
    }
    if (o.front) o.front(u, ctx);
  };
}
// plek in de wereld (wegvlak, parallax 1) -> schermpositie
const sx = (wx, ctx) => wx - ctx.dist;

function episode(cfg) {
  let acc = 0; cfg.shots.forEach(s => { s.start = acc; acc += s.d; }); const DUR = acc;
  const accent = cfg.accent || '#ff7a45';
  function draw(t) {
    let idx = cfg.shots.findIndex(s => t >= s.start && t < s.start + s.d); if (idx < 0) idx = cfg.shots.length - 1;
    const s = cfg.shots[idx], u = t - s.start;
    const ctx = { t, u, d: s.d, talk: who => talkLevel(s.says, who, u), blink: off => (t + (off || 0)) % 3.9 > 3.75 };
    x.save(); s.draw(u, ctx); x.restore();
    (s.says || []).forEach(([who, txt, a, b, bx, by, size]) => C.bubble(txt, typeof bx === 'function' ? bx(u, ctx) : bx, typeof by === 'function' ? by(u, ctx) : by, win(u, a, b), { size: size || 28 }));
    (s.big || []).forEach(([txt, a, b, bx, by, size, col]) => C.bigText(txt, bx ?? W / 2, by ?? 80, win(u, a, b, .25), size || 64, col || '#ffd23f'));
    if (s.after) s.after(u, ctx);
    let f = 0;
    if (idx > 0 && !s.noFadeIn) f = Math.max(f, clamp(1 - u / .4));
    if (idx < cfg.shots.length - 1 && !cfg.shots[idx + 1].noFadeIn) f = Math.max(f, clamp((u - (s.d - .4)) / .4));
    if (f > 0) { x.fillStyle = `rgba(0,0,0,${f})`; x.fillRect(0, 0, W, H); }
    C.card(cfg.title, cfg.sub ? [cfg.sub, 44] : null, t < 2.8 ? clamp((t - .3) / .7) : clamp((4.8 - t) / .6), { accent, bg: cfg.cardBg, ink: cfg.cardInk });
    C.card(cfg.end || ['Tot de volgende keer!', 70], cfg.endSub ? [cfg.endSub, 42] : null, clamp((t - (DUR - 5.2)) / .6), { accent, bg: cfg.cardBg, ink: cfg.cardInk, y: 150 });
    C.fadeBlack(t, DUR);
  }
  if (process.env.EVENTS) {
    const ev = [], duck = [];
    cfg.shots.forEach(s => (s.sfx || []).forEach(([u, name, g, pan, dk]) => { ev.push([s.start + u, name, g ?? 1, pan ?? 0]); if (dk) duck.push([s.start + u, s.start + u + dk]); }));
    (cfg.sfx || []).forEach(e => ev.push(e));
    process.stdout.write(JSON.stringify({ dur: DUR, music: cfg.music, events: ev, duck }));
    return;
  }
  C.run(draw, DUR, { thumb: () => C.thumbTitle(cfg.thumb[0], cfg.thumb[1], cfg.thumbCol || '#ffd23f') });
}

module.exports = { episode, drive, place, sx, leavesAt, talkLevel, GY, ROAD };
