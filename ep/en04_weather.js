// The Big Four – What's the Weather? (English story episode: weather words sunny / windy / rainy / rainbow, counting puddles 1-2-3, rainbow colours)
const C = require('../lib/common'), S = require('../lib/safari'), A = require('../lib/av');
const St = require('../lib/story');
const { x, W, H, clamp, ease, lerp, win, hash } = C;
const G = S.GROUND, ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
const INK = '#3a2414';

function savanna(skyT, t) { S.setT(skyT); S.sky(); S.setT(t); S.land(); }
const say = (c, who, k = .45) => { const v = c.talk(who); return v > 0 ? (who === 'elephant' ? .12 + v * .04 : v * k) : 0; };
const walk = (u, a, b, x0, x1) => u < a ? x0 : u > b ? x1 : lerp(x0, x1, ease((u - a) / (b - a)));
const moving = (u, a, b) => u > a && u < b;
const hop = (t, sp = 6, h = 8) => Math.abs(Math.sin(t * sp)) * h;
// actor that leans (skew around its feet) – for the wind
function leanActor(fn, px, mv, act, sc, o, lean) {
  x.save(); x.translate(px, G); x.transform(1, 0, lean, 1, 0, 0); x.translate(-px, -G);
  S.actor(fn, px, mv, act, sc, o); x.restore();
}

// ---------- weather icons ----------
function sunIcon(r, t) {
  x.save(); x.rotate(t * .6); x.strokeStyle = '#ffb627'; x.lineWidth = r * .14; x.lineCap = 'round';
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; x.beginPath(); x.moveTo(Math.cos(a) * r * .78, Math.sin(a) * r * .78); x.lineTo(Math.cos(a) * r * 1.05, Math.sin(a) * r * 1.05); x.stroke(); }
  x.restore();
  C.circ(0, 0, r * .6, '#ffd23f', INK, 4);
  [-1, 1].forEach(d => C.circ(d * r * .2, -r * .08, r * .06, INK));
  x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.arc(0, r * .05, r * .26, .3, Math.PI - .3); x.stroke();
}
function cloudShape(r, fill) {
  x.fillStyle = fill; x.strokeStyle = INK; x.lineWidth = 4; x.beginPath();
  [[-r * .45, r * .05, r * .38], [0, -r * .2, r * .5], [r * .48, r * .05, r * .36]].forEach(([a, b, rr]) => { x.moveTo(a + rr, b); x.arc(a, b, rr, 0, 7); });
  x.fill(); x.stroke();
  x.beginPath(); [[-r * .45, r * .05, r * .38 - 2], [0, -r * .2, r * .5 - 2], [r * .48, r * .05, r * .36 - 2]].forEach(([a, b, rr]) => { x.moveTo(a + rr, b); x.arc(a, b, rr, 0, 7); }); x.fill();
  x.fillRect(-r * .45, r * .05, r * .93, r * .3);
}
function windIcon(r, t) {
  x.strokeStyle = INK; x.lineCap = 'round';
  [[-r * .35, .0], [0, .5], [r * .35, 1]].forEach(([dy, ph], i) => {
    const sh = Math.sin(t * 4 + ph * 3) * r * .08, len = [1.4, 1.7, 1.2][i] * r;
    [[10, INK], [5, '#ffffff']].forEach(([lw, col]) => {
      x.lineWidth = lw; x.strokeStyle = col; x.beginPath();
      x.moveTo(-r * .8 + sh, dy); x.lineTo(-r * .8 + len * .7 + sh, dy);
      x.arc(-r * .8 + len * .7 + sh, dy - r * .17, r * .17, Math.PI / 2, -Math.PI * .9, true); x.stroke();
    });
  });
}
function rainIcon(r, t) {
  for (let i = 0; i < 4; i++) { const k = (t * 1.3 + i * .27) % 1; x.globalAlpha *= 1; C.ell(-r * .45 + i * r * .3, r * .5 + k * r * .5, r * .07, r * .11, '#4cc9f0', INK, 2); }
  cloudShape(r, '#c9d3e0');
}
const RB = ['#e63946', '#ff9f1c', '#ffd23f', '#6cd36b', '#3a86ff', '#9b5de5'];
function rainbowIcon(r) {
  RB.forEach((c, i) => { x.beginPath(); x.arc(0, r * .3, r * .9 - i * r * .11, Math.PI, 0); x.lineWidth = r * .11; x.strokeStyle = c; x.stroke(); });
  [-1, 1].forEach(d => { x.save(); x.translate(d * r * .62, r * .32); cloudShape(r * .42, '#ffffff'); x.restore(); });
}
function icon(kind, cx, cy, r, k, t) {
  if (k <= 0) return;
  const s = .4 + .6 * ease(k * 2) + Math.sin(clamp(k * 2) * Math.PI) * .12;
  x.save(); x.globalAlpha = clamp(k * 2); x.translate(cx, cy); x.scale(s, s);
  C.circ(0, 0, r * 1.25, 'rgba(255,255,255,.85)', INK, 4);
  if (kind === 'sun') sunIcon(r * .95, t); else if (kind === 'wind') windIcon(r * .85, t); else if (kind === 'rain') rainIcon(r * .9, t); else rainbowIcon(r * .95);
  x.restore();
}

// ---------- props ----------
function sprayDrops(x0, y0, x1, y1, u, a, b, h) {   // water from Ella's trunk
  if (u < a || u > b) return;
  for (let i = 0; i < 40; i++) {
    const k = ((u - a) * 1.1 + i / 40) % 1, j = hash(i) - .5;
    const px = lerp(x0, x1 + j * 160, k), py = lerp(y0, y1 + j * 30, k) - Math.sin(k * Math.PI) * h;
    x.globalAlpha = .9 * clamp((b - u) / .4) * clamp((u - a) / .3);
    C.ell(px, py, 4, 6, '#8fd3ff', '#2e7fb8', 1.5);
  }
  x.globalAlpha = 1;
}
function windLines(t, a) {
  if (a <= 0) return;
  x.lineCap = 'round';
  for (let i = 0; i < 12; i++) {
    const sp = 380 + hash(i) * 260, px = W + 150 - ((t * sp + hash(i + 3) * 1400) % (W + 400)), py = 60 + hash(i + 7) * 420, len = 80 + hash(i + 1) * 90;
    x.strokeStyle = `rgba(255,255,255,${.75 * a})`; x.lineWidth = 3.5; x.beginPath(); x.moveTo(px, py);
    x.quadraticCurveTo(px + len * .5, py - 10 * Math.sin(t * 3 + i), px + len, py); x.stroke();
  }
}
function flyingLeaves(t, a) {
  if (a <= 0) return;
  for (let i = 0; i < 16; i++) {
    const sp = 260 + hash(i + 11) * 200, px = W + 60 - ((t * sp + hash(i) * 1300) % (W + 160)), py = 150 + hash(i + 5) * 330 + Math.sin(t * 3 + i) * 30;
    x.save(); x.globalAlpha = a; x.translate(px, py); x.rotate(t * 5 + i);
    x.fillStyle = i % 3 ? '#76a646' : '#e9a23b'; x.beginPath(); x.ellipse(0, 0, 11, 5, 0, 0, 7); x.fill();
    x.strokeStyle = 'rgba(58,36,20,.5)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(-10, 0); x.lineTo(10, 0); x.stroke(); x.restore();
  }
}
function kite(kx, ky, sx, sy, t, k) {
  if (k <= 0) return;
  x.strokeStyle = 'rgba(58,36,20,.8)'; x.lineWidth = 2; x.beginPath(); x.moveTo(sx, sy); x.quadraticCurveTo((sx + kx) / 2, (sy + ky) / 2 + 40, kx, ky + 34); x.stroke();
  // tail with bows
  x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.moveTo(kx, ky + 34);
  for (let i = 1; i <= 6; i++) x.lineTo(kx + i * 16, ky + 34 + i * 12 + Math.sin(t * 6 + i) * 8); x.stroke();
  [2, 4, 6].forEach((i, j) => { const bx = kx + i * 16, by = ky + 34 + i * 12 + Math.sin(t * 6 + i) * 8; x.fillStyle = ['#4cc9f0', '#ffd23f', '#6cd36b'][j]; x.beginPath(); x.moveTo(bx - 8, by - 5); x.lineTo(bx + 8, by + 5); x.lineTo(bx + 8, by - 5); x.lineTo(bx - 8, by + 5); x.closePath(); x.fill(); });
  x.save(); x.translate(kx, ky); x.rotate(-.3 + Math.sin(t * 2.5) * .12);
  const pts = [[0, -40], [28, 0], [0, 34], [-28, 0]];
  ['#e63946', '#ff9f1c', '#e63946', '#ff9f1c'].forEach((col, i) => { x.fillStyle = col; x.beginPath(); x.moveTo(0, 0); x.lineTo(...pts[i]); x.lineTo(...pts[(i + 1) % 4]); x.closePath(); x.fill(); });
  x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(...p) : x.moveTo(...p)); x.closePath(); x.stroke();
  x.lineWidth = 1.5; x.beginPath(); x.moveTo(0, -40); x.lineTo(0, 34); x.moveTo(-28, 0); x.lineTo(28, 0); x.stroke();
  C.circ(-7, -8, 2.5, INK); C.circ(7, -8, 2.5, INK); x.beginPath(); x.lineWidth = 2; x.arc(0, -4, 7, .4, Math.PI - .4); x.stroke();
  x.restore();
}
const PUD = [520, 380, 240];
function puddles(t, rainA, splashAt) {
  PUD.forEach((px, i) => {
    C.ell(px, G + 18, 62, 13, '#7fa9cc'); C.ell(px - 10, G + 15, 40, 6, 'rgba(255,255,255,.35)');
    if (rainA > 0) for (let j = 0; j < 2; j++) { const k = (t * 1.2 + j * .5 + i * .3) % 1; x.strokeStyle = `rgba(255,255,255,${(1 - k) * .8 * rainA})`; x.lineWidth = 2; x.beginPath(); x.ellipse(px - 25 + j * 40 + i * 5, G + 18, 6 + k * 18, 2 + k * 4, 0, 0, 7); x.stroke(); }
    const s = splashAt[i];
    if (s > 0 && s < 1) for (let j = 0; j < 9; j++) { const a = Math.PI * (.1 + .8 * j / 8), r = s * 70;
      x.globalAlpha = 1 - s; C.ell(px + Math.cos(a) * r * 1.3, G + 12 - Math.sin(a) * r * 1.4 + s * s * 60, 5, 7, '#8fd3ff', '#2e7fb8', 1.5); x.globalAlpha = 1; }
  });
}
function bigRainbow(k, fade = 1) {   // grows band by band (k: 0..6)
  if (k <= 0 || fade <= 0) return;
  RB.forEach((c, i) => { const b = clamp(k - i); if (b <= 0) return;
    x.save(); x.globalAlpha = .85 * fade * b; x.beginPath(); x.arc(480, 450, 330 - i * 17, Math.PI, Math.PI * 2); x.lineWidth = 17; x.strokeStyle = c; x.stroke(); x.restore(); });
}

St.episode({
  title: ["What's the Weather?", 64], sub: 'The Big Four', accent: '#3a86ff', cardBg: '#eef7ff',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'weather', shift: 0 },
  shots: [
    // 1 – a sunny morning: The Big Four walk in, look up – the sun!
    { d: 22, draw: (u, c) => {
        savanna(12 + u * .4, c.t);
        const L = [['buffalo', 790, .5, 0], ['rhino', 590, .5, 1], ['elephant', 380, .56, 2], ['lion', 170, .52, 3]];
        L.forEach(([k, tx, sc, st], i) => { const v = u - st, px = walk(v, 0, 3.2, -160, tx);
          S.actor(ANI[k], px, moving(v, 0, 3.2), say(c, k), sc, { flip: true, blinkOff: i, phase: i, lift: u > 17 && u < 21 ? hop(c.t + i, 4, 6) : 0 }); });
        S.foreground();
        if (u > 14.5 && u < 21.5) C.sparkles(760, 120, c.t, 10, 110, '#fff3a0');
      },
      says: [['lion', 'Good morning, friends!', 5.5, 9.5, 190, 300, 26], ['elephant', "What's the weather today?", 10, 14, 380, 270, 26]],
      big: [['Look up!', 14.4, 17.2, 400, 90, 58, '#ffffff'], ['Sunny!', 17.2, 21.6, 760, 220, 52, '#ffd23f']],
      after: (u, c) => icon('sun', 560, 120, 48, win(u, 17.2, 21.6, .3), c.t),
      sfx: [[5.5, 'roar', .4], [10, 'trumpet', .35], [14.4, 'chime:E5', .4], [17.2, 'tada', .6]] },

    // 2 – sunny and hot: Ella sprays cool water on her friends
    { d: 28, draw: (u, c) => {
        savanna(30, c.t);
        // heat shimmer
        x.save(); x.globalAlpha = .18 + .06 * Math.sin(c.t * 3); C.circ(760, 120, 120, '#fff1a8'); x.restore();
        const up = u < 14.5 ? 0 : u < 16.5 ? ease((u - 14.5) / 2) : u < 22.5 ? 1 : u < 24.5 ? 1 - ease((u - 22.5) / 2) : 0;
        const ex = 190, sc = .6;
        S.actor(S.elephant, ex, false, Math.max(up / 1.4, say(c, 'elephant')), sc, { flip: true, blinkOff: 1 });
        const wet = u > 18;
        [['lion', 450, .52], ['rhino', 640, .5], ['buffalo', 820, .5]].forEach(([k, px, s], i) =>
          S.actor(ANI[k], px, false, say(c, k), s, { blinkOff: i * .7, lift: wet && u < 26 ? hop(c.t + i, 5, 7) : 0 }));
        S.foreground();
        const k = ease(clamp(up)), tipX = ex + sc * (82 + lerp(12, 58, k)), tipY = G + sc * (-135 + lerp(78, -70, k));
        sprayDrops(tipX, tipY, 640, 360, u, 16.6, 22.6, 170);
      },
      says: [['buffalo', 'Phew! It is so hot!', 1.5, 5.5, 820, 330, 26], ['elephant', 'I can help! Splash!', 11, 14.6, 260, 270, 26],
             ['rhino', 'Ahh! Nice and cool!', 22.8, 26.6, 640, 330, 26]],
      big: [['Sunny and hot!', 6, 10.6, 470, 90, 58, '#ffd23f']],
      after: (u, c) => icon('sun', 760, 230, 44, win(u, 6, 10.6, .3), c.t),
      sfx: [[1.5, 'bellow', .35], [6, 'chime:C6', .4], [11, 'trumpet', .45], [16.6, 'spray:5.5', .6], [18.5, 'splash', .5], [19.5, 'laugh', .4], [22.8, 'snort', .3]] },

    // 3 – windy: leaves fly, everyone leans, Boris flies his kite
    { d: 30, draw: (u, c) => {
        savanna(32, c.t * (1 + clamp((u - 5) / 3) * 3));
        const gust = clamp((u - 5) / 2) * (.7 + .3 * Math.sin(c.t * 2.2));
        windLines(c.t, gust * .9);
        const lean = -.09 * gust;
        leanActor(S.elephant, 170, false, say(c, 'elephant'), .55, { flip: true, blinkOff: 1 }, lean);
        leanActor(S.lion, 390, false, say(c, 'lion'), .52, { flip: true }, lean);
        leanActor(S.rhino, 600, false, say(c, 'rhino'), .5, { blinkOff: 2 }, lean);
        leanActor(S.buffalo, 810, false, say(c, 'buffalo'), .5, { blinkOff: 3 }, lean * .6);
        S.foreground();
        flyingLeaves(c.t, gust);
        // kite: rises from Boris's mouth up into the wind
        const kk = ease(clamp((u - 19.5) / 3)), mx = 810 - 74 * .5, my = G - (78 - 34) * .5;
        kite(lerp(mx - 10, 590, kk) + Math.sin(c.t * 1.7) * 18 * kk, lerp(my - 30, 140, kk) + Math.sin(c.t * 2.3) * 12 * kk, mx, my, c.t, clamp((u - 19.3) * 3));
      },
      says: [['lion', 'Listen! What is that sound?', 1, 5, 400, 300, 26], ['rhino', 'Whoa! Hold on tight!', 14, 18, 600, 330, 26],
             ['buffalo', 'Look! My kite can fly!', 25, 29, 760, 300, 26]],
      big: [['Windy!', 7.6, 13.4, 480, 210, 56, '#ffffff']],
      after: (u, c) => icon('wind', 480, 105, 48, win(u, 7.6, 13.4, .3), c.t),
      sfx: [[5, 'whoosh', .5], [6, 'rustle:2.5', .5], [7.6, 'chime:G5', .4], [10, 'whoosh', .35], [14, 'snort', .35], [19.5, 'whoosh', .5], [23, 'rustle:2', .35], [25, 'laugh', .4]] },

    // 4 – rainy: dark clouds, rain; Nico jumps in 1, 2, 3 puddles
    { d: 32, draw: (u, c) => {
        const dark = ease(clamp(u / 4)), rainA = clamp((u - 4) / 1.5);
        savanna(32, c.t);
        S.acacia(830, 470, 2.1);
        const spl = PUD.map((_, i) => (u - (21 + i * 2.4)) / .9);
        puddles(c.t, rainA, spl);
        // Leo and Boris stay dry under the tree, Ella enjoys the rain
        S.actor(S.lion, 760, false, say(c, 'lion'), .48, { blinkOff: 1 });
        S.actor(S.buffalo, 880, false, say(c, 'buffalo'), .44, { blinkOff: 2 });
        S.actor(S.elephant, 100, false, say(c, 'elephant'), .46, { flip: true, blinkOff: 3, lift: u > 27 && u < 31 ? hop(c.t, 4, 6) : 0 });
        // Nico hops from puddle to puddle (right to left)
        const xs = [645, ...PUD]; let nx = xs[0], lift = 0;
        for (let i = 0; i < 3; i++) { const a = 19.8 + i * 2.4, k = clamp((u - a) / 1.2); if (u >= a) { nx = lerp(xs[i], xs[i + 1], ease(k)); lift = k < 1 ? Math.sin(k * Math.PI) * 70 : 0; } }
        S.actor(S.rhino, nx, false, say(c, 'rhino'), .46, { blinkOff: 0, lift });
        S.foreground();
        A.greyClouds(c.t, dark); A.darkSky(dark * .7);
        A.rainStreaks(c.t, rainA);
      },
      says: [['lion', "Oh no! I don't like getting wet!", 9.6, 13.6, 700, 320, 26], ['rhino', 'I love puddles!', 14.4, 18.4, 620, 330, 26],
             ['elephant', 'Splash, splash, splash!', 28, 31.6, 180, 320, 26]],
      big: [['Rainy!', 4.4, 9.2, 480, 210, 56, '#ffffff'],
            ...[1, 2, 3].map(n => [String(n), 21 + (n - 1) * 2.4, 27.6, PUD[n - 1], 300, 64, '#ffd23f'])],
      after: (u, c) => icon('rain', 480, 105, 48, win(u, 4.4, 9.2, .3), c.t),
      sfx: [[1, 'whoosh', .25], [4, 'rain:29.5', .35], [4.4, 'chime:D5', .4], [9.6, 'roar', .3], [14.4, 'snort', .4],
            [21, 'splash', .7], [23.4, 'splash', .7], [25.8, 'splash', .8], [26.2, 'laugh', .45], [28, 'trumpet', .4]] },

    // 5 – the sun comes back: a rainbow with six colours; recap of the weather
    { d: 34, draw: (u, c) => {
        const clear = 1 - ease(clamp(u / 3));
        savanna(34 + u * .3, c.t);
        const rbFade = 1 - ease(clamp((u - 19) / 1.5));
        bigRainbow(u < 8 ? clamp((u - 3) / 5) * .9 : Math.min(6, 1 + Math.max(0, (u - 10.1) / 1.7)), rbFade);
        const happy = u > 21 && u < 28;
        [['lion', 150, .52, true], ['elephant', 350, .56, true], ['rhino', 610, .5, false], ['buffalo', 810, .5, false]].forEach(([k, px, sc, fl], i) =>
          S.actor(ANI[k], px, false, say(c, k), sc, { flip: fl, blinkOff: i, lift: happy ? hop(c.t + i, 4, 7) : 0 }));
        S.foreground();
        A.greyClouds(c.t, clear); A.darkSky(clear * .7); A.rainStreaks(c.t, clear * clear);
      },
      says: [['lion', 'Look! A rainbow!', 3.6, 7.8, 190, 300, 26], ['elephant', 'Every weather is fun!', 22, 27.4, 370, 300, 26]],
      big: [...['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'].map((w, i) => [w, 8.4 + i * 1.7, 19, 130 + i * 140, 58, 38, RB[i]]),
            ...['Sunny', 'Windy', 'Rainy', 'Rainbow'].map((w, i) => [w, 20.4 + i * .5, 28.4, 180 + i * 200, 205, 34, '#ffffff'])],
      after: (u, c) => ['sun', 'wind', 'rain', 'rainbow'].forEach((k, i) => icon(k, 180 + i * 200, 125, 40, win(u, 20.4 + i * .5, 28.4, .3), c.t)),
      sfx: [[3.6, 'arp', .5], ...[0, 1, 2, 3, 4, 5].map(i => [8.4 + i * 1.7, 'chime:' + ['C5', 'D5', 'E5', 'G5', 'A5', 'C6'][i], .45]),
            [20.4, 'pop', .4], [20.9, 'pop', .4], [21.4, 'pop', .4], [21.9, 'pop', .4], [22, 'cheer', .45], [27.6, 'tada', .5]] },
  ],
});
