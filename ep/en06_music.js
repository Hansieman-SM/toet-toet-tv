// The Big Four – Let's Make Music! (English story episode: instruments drum / maracas / xylophone / trumpet, counting beats 1-2-3,
// low and high notes, Ella feels left out → her friends help her find her own instrument, playing together)
const C = require('../lib/common'), S = require('../lib/safari');
const St = require('../lib/story');
const { x, W, H, clamp, ease, lerp, win, hash } = C;
const G = S.GROUND, ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
const INK = '#3a2414';
const RB = ['#e63946', '#ff9f1c', '#ffd23f', '#6cd36b', '#3a86ff', '#9b5de5'];
const BEAT = .6;   // music tempo (100 bpm) – the band plays on this grid

function savanna(skyT, t) { S.setT(skyT); S.sky(); S.setT(t); S.land(); }
const say = (c, who, k = .45) => { const v = c.talk(who); return v > 0 ? (who === 'elephant' ? .12 + v * .04 : v * k) : 0; };
const walk = (u, a, b, x0, x1) => u < a ? x0 : u > b ? x1 : lerp(x0, x1, ease((u - a) / (b - a)));
const moving = (u, a, b) => u > a && u < b;
const hop = (t, sp = 6, h = 8) => Math.abs(Math.sin(t * sp)) * h;
// pulse 1 → 0 right after each hit time in list
const pulse = (u, hits, len = .25) => { let p = 0; for (const h of hits) if (u >= h && u < h + len) p = Math.max(p, 1 - (u - h) / len); return p; };
const beats = (a, b, step) => { const r = []; for (let v = a; v < b - 1e-6; v += step) r.push(+v.toFixed(3)); return r; };

// ---------- instruments (world coordinates) ----------
function drum(cx, gy, s, hit = 0) {
  x.save(); x.translate(cx, gy); x.scale(s, s);
  const w = 56, h = 56, ry = 14;
  x.fillStyle = 'rgba(70,40,10,.22)'; x.beginPath(); x.ellipse(0, 3, w + 8, 8, 0, 0, 7); x.fill();
  x.fillStyle = '#e63946'; x.strokeStyle = INK; x.lineWidth = 4;
  x.beginPath(); x.moveTo(-w, -h); x.lineTo(-w, 0); x.ellipse(0, 0, w, ry, 0, Math.PI, 0, true); x.lineTo(w, -h); x.closePath(); x.fill(); x.stroke();
  // zigzag cords
  x.strokeStyle = '#fff3d6'; x.lineWidth = 3.5; x.beginPath();
  for (let i = 0; i <= 8; i++) { const px = -w + i * w / 4, py = i % 2 ? -10 : -h + 8; i ? x.lineTo(px, py + (i % 2 ? Math.sin(i) * 2 : 0)) : x.moveTo(px, py); } x.stroke();
  x.fillStyle = '#ffd23f'; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(-w, -8); x.ellipse(0, -8, w, ry, 0, Math.PI, 0, true); x.lineTo(w, -2); x.ellipse(0, -2, w, ry, 0, 0, Math.PI); x.closePath(); x.fill(); x.stroke();
  // skin
  C.ell(0, -h, w, ry, '#fff6e0', INK, 4);
  if (hit > 0) { x.strokeStyle = `rgba(58,36,20,${.5 * hit})`; x.lineWidth = 2; [.35, .65].forEach(k => { x.beginPath(); x.ellipse(0, -h, w * k * (1.2 - hit * .3), ry * k, 0, 0, 7); x.stroke(); }); }
  x.restore();
}
function stick(x0, y0, x1, y1, s) {
  x.lineCap = 'round'; x.strokeStyle = INK; x.lineWidth = 9 * s; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke();
  x.strokeStyle = '#d9a066'; x.lineWidth = 5 * s; x.stroke();
  C.circ(x1, y1, 7 * s, '#f6e3c3', INK, 2.5);
}
function maraca(cx, cy, ang, s, col = '#ff9f1c') {
  x.save(); x.translate(cx, cy); x.rotate(ang); x.scale(s, s);
  x.fillStyle = '#b07a43'; x.strokeStyle = INK; x.lineWidth = 3; C.rr(-5, 0, 10, 46, 5); x.fill(); x.stroke();
  C.ell(0, -22, 22, 27, col, INK, 4);
  x.fillStyle = '#fff'; [[-8, -30], [7, -24], [-4, -14], [9, -38], [-10, -20]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 3.2, 0, 7); x.fill(); });
  x.strokeStyle = '#6cd36b'; x.lineWidth = 4; x.beginPath(); x.ellipse(0, -22, 21, 7, 0, 0, 7); x.stroke();
  x.restore();
}
// xylophone: bars long (low) on the left → short (high) on the right; lit[i] 0..1
function xylophone(x0, gy, s, lit = []) {
  x.save(); x.translate(x0, gy); x.scale(s, s);
  x.fillStyle = 'rgba(70,40,10,.22)'; x.beginPath(); x.ellipse(110, 3, 130, 8, 0, 0, 7); x.fill();
  x.strokeStyle = INK; x.lineWidth = 4; x.fillStyle = '#9c6a3a';
  [[-6, 0], [226, 0]].forEach(([a]) => { x.beginPath(); x.moveTo(a, 0); x.lineTo(a + 8, -26); x.stroke(); });
  C.rr(-10, -44, 236, 12, 6); x.fill(); x.stroke(); C.rr(-10, -20, 236, 12, 6); x.fill(); x.stroke();
  RB.forEach((col, i) => {
    const bx = i * 37 + 4, h = 70 - i * 8, top = -38 - h / 2;
    x.save(); if (lit[i] > 0) { x.translate(0, -lit[i] * 5); }
    x.fillStyle = col; x.strokeStyle = INK; x.lineWidth = 3.5; C.rr(bx, top, 28, h, 7); x.fill(); x.stroke();
    x.fillStyle = 'rgba(255,255,255,.45)'; C.rr(bx + 5, top + 5, 6, h - 10, 3); x.fill();
    C.circ(bx + 14, top + 8, 3, '#e8e0d0', INK, 1.5); C.circ(bx + 14, top + h - 8, 3, '#e8e0d0', INK, 1.5);
    if (lit[i] > 0) C.sparkles(bx + 14, top - 10, i * 3, 5, 26 * lit[i], '#fff3a0');
    x.restore();
  });
  x.restore();
}
const barX = (x0, s, i) => x0 + (i * 37 + 18) * s, barTop = (gy, s, i) => gy + (-38 - (70 - i * 8) / 2) * s;
function mallet(x0, y0, x1, y1, s) {
  x.lineCap = 'round'; x.strokeStyle = INK; x.lineWidth = 7 * s; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke();
  x.strokeStyle = '#e8c48c'; x.lineWidth = 3.5 * s; x.stroke();
  C.circ(x1, y1, 9 * s, '#e63946', INK, 2.5);
}
// music note glyphs
function note(px, py, s, col, a = 1, dbl = false) {
  if (a <= 0) return;
  x.save(); x.globalAlpha *= clamp(a); x.translate(px, py); x.scale(s, s); x.rotate(-.15);
  x.fillStyle = col; x.strokeStyle = INK; x.lineWidth = 3;
  const head = hx => { x.beginPath(); x.ellipse(hx, 0, 11, 8, -.4, 0, 7); x.fill(); x.stroke(); };
  head(0); x.fillStyle = INK; x.fillRect(8, -38, 4, 38);
  if (dbl) { head(30); x.fillRect(38, -44, 4, 44); x.beginPath(); x.moveTo(8, -38); x.lineTo(42, -44); x.lineTo(42, -34); x.lineTo(8, -28); x.closePath(); x.fill(); }
  else { x.beginPath(); x.moveTo(12, -38); x.quadraticCurveTo(28, -28, 22, -12); x.quadraticCurveTo(24, -26, 12, -28); x.fill(); }
  x.restore();
}
// notes floating up from a source
function noteStream(sx0, sy0, t, a, seed = 0, dir = 1, n = 5) {
  if (a <= 0) return;
  for (let i = 0; i < n; i++) {
    const k = (t * .45 + i / n + hash(seed + i) * .1) % 1;
    note(sx0 + dir * k * 120 + Math.sin(t * 2 + i) * 14, sy0 - k * 150, .7 + hash(seed + i * 3) * .4, RB[(i + seed) % 6], a * Math.min(1, k * 5, (1 - k) * 3), i % 2 === 1);
  }
}
// instrument icon (for the recap)
function icon(kind, cx, cy, k, t) {
  if (k <= 0) return;
  const s = .4 + .6 * ease(k * 2) + Math.sin(clamp(k * 2) * Math.PI) * .12;
  x.save(); x.globalAlpha = clamp(k * 2); x.translate(cx, cy); x.scale(s, s);
  C.circ(0, 0, 54, 'rgba(255,255,255,.9)', INK, 4);
  if (kind === 'drum') { drum(0, 26, .62); stick(-30, -40, -10, -14, .7); stick(30, -40, 12, -14, .7); }
  else if (kind === 'maracas') { maraca(-12, 10, -.35 + Math.sin(t * 10) * .1, .8); maraca(14, 10, .35 - Math.sin(t * 10) * .1, .8, '#9b5de5'); }
  else if (kind === 'xylophone') xylophone(-41, 30, .37);
  else { // trumpet = Ella's trunk (little elephant head)
    x.save(); x.scale(.42, .42); x.translate(10, 40);
    C.ell(-36, -10, 34, 42, '#86919e', INK); C.ell(36, -10, 34, 42, '#86919e', INK); C.circ(0, 0, 42, '#9aa5b1', INK);
    x.strokeStyle = INK; x.lineWidth = 22; x.lineCap = 'round'; x.beginPath(); x.moveTo(0, 14); x.bezierCurveTo(0, 50, -40, 10, -58, -70); x.stroke();
    x.strokeStyle = '#9aa5b1'; x.lineWidth = 16; x.stroke();
    C.circ(-11, -10, 6, INK); C.circ(11, -10, 6, INK);
    x.restore(); note(16, -14, .55, '#ffd23f');
  }
  x.restore();
}

// ---------- animals with their instruments ----------
// Leo behind his drum (faces right). Sticks pivot on his shoulders and tap the skin on each hit.
function leoDrum(px, sc, u, c, hits, o = {}) {
  const p = pulse(u, hits, .3), lift = o.lift || 0;
  S.actor(S.lion, px, false, say(c, 'lion'), sc, { flip: true, blinkOff: o.blinkOff || 0, lift: lift + p * 4 });
  const dx = px + 135 * sc, gy = G + 4, top = gy - 56 * sc * .85;
  drum(dx, gy, sc * .85, p);
  const up = 1 - p, lr = Math.floor(u / .3) % 2;
  [[-1, 0], [1, 1]].forEach(([d, side]) => {
    const raise = (lr === side ? up : 1) * 26 * sc;
    stick(dx + d * 34 * sc, top - 58 * sc - raise, dx + d * 14 * sc, top - 4 - raise * .5, sc);
  });
  return { x: dx, y: top };
}
// Nico with a maraca in his mouth (faces right); shakes while shaking > 0
function nicoMaraca(px, sc, u, c, shake, o = {}) {
  const lift = (o.lift || 0) + shake * hop(c.t, 9, 3);
  S.actor(S.rhino, px, false, say(c, 'rhino'), sc, { flip: true, blinkOff: o.blinkOff || 0, lift });
  const mx = px + 78 * sc, my = G - lift + (-34) * sc;
  maraca(mx + 24 * sc, my + 4 * sc, 1.25 + Math.sin(c.t * (o.slow ? 9 : 26)) * .45 * shake, sc * 1.05, '#9b5de5');
  return { x: mx + 60 * sc, y: my - 30 * sc };
}
// Boris with a mallet in his mouth over the xylophone (faces right); bar = index being played (or -1)
function borisXylo(px, sc, u, c, bar, litArr, o = {}) {
  const lift = o.lift || 0;
  S.actor(S.buffalo, px, false, say(c, 'buffalo'), sc, { flip: true, blinkOff: o.blinkOff || 0, lift });
  const x0 = px + 108 * sc, gy = G + 6, xs = sc * 1.0;
  xylophone(x0, gy, xs, litArr);
  const mxo = px + 74 * sc, myo = G - lift - 46 * sc;
  const b = bar < 0 ? 2.5 : bar, tx = barX(x0, xs, Math.floor(b)) + (b % 1) * 37 * xs, ty = barTop(gy, xs, Math.round(clamp(b, 0, 5))) - 6 * sc;
  mallet(mxo, myo, tx, ty - (bar < 0 ? 14 * sc : 0), sc);
  return { x: tx, y: ty };
}
// Ella; trunk up while tooting > 0 (act drives the trunk in the safari elephant)
function ella(px, sc, u, c, toot, o = {}) {
  const act = toot > 0 ? .9 * toot : say(c, 'elephant');
  S.actor(S.elephant, px, false, act, sc, { flip: o.flip !== false, blinkOff: o.blinkOff || 0, lift: o.lift || 0 });
  const d = o.flip !== false ? 1 : -1;
  return { x: px + d * 140 * sc, y: G - (o.lift || 0) - 205 * sc };
}

// timing of shots (for the global band beat in shot 6)
const D = [20, 24, 22, 24, 26, 38];
const T6 = D.slice(0, 5).reduce((a, b) => a + b, 0);
const first = Math.ceil((T6 + 4.4) / (BEAT * 4)) * BEAT * 4;   // first bar line after Nico's "Let's play together!"
const BAND = beats(first, first + BEAT * 4 * 6, BEAT).map(v => +(v - T6).toFixed(3));   // six bars of band in shot-6 time
const bandEnd = BAND[BAND.length - 1] + BEAT;

St.episode({
  title: ["Let's Make Music!", 64], sub: 'The Big Four', accent: '#9b5de5', cardBg: '#f6f0ff',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'music', shift: 0 },
  thumb: ["Let's Make Music!", 'The Big Four'],
  shots: [
    // 1 – The Big Four find instruments on the grass
    { d: D[0], draw: (u, c) => {
        savanna(14 + u * .2, c.t);
        drum(470, G + 6, .62, 0); maraca(545, G - 4, .25, .62); maraca(575, G - 2, .5, .62, '#9b5de5'); xylophone(600, G + 6, .5);
        if (u > 9.6) C.sparkles(560, G - 40, c.t, 9, 100, '#fff3a0');
        const L = [['elephant', 230, .52, 0, true], ['lion', 380, .5, 1, true], ['rhino', 790, .48, 1.5, false], ['buffalo', 900, .46, 2.2, false]];
        L.forEach(([k, tx, sc, st, fl], i) => { const v = u - st, px = walk(v, 0, 3.4, fl ? -150 : W + 150, tx);
          S.actor(ANI[k], px, moving(v, 0, 3.4), say(c, k), sc, { flip: fl, blinkOff: i, phase: i, lift: u > 15.5 && u < 19 ? hop(c.t + i, 4, 6) : 0 }); });
        S.foreground();
      },
      says: [['lion', 'Look! What is this?', 5.2, 9.4, 380, 300, 26], ['buffalo', "Let's make music!", 14.6, 18.8, 760, 310, 26]],
      big: [['Instruments!', 9.8, 14.2, 520, 220, 56, '#ffffff']],
      sfx: [[5.2, 'roar', .35], [9.8, 'arp', .5], [14.6, 'bellow', .35], [15.4, 'cheer', .4]] },

    // 2 – Leo plays the drum: boom, boom, boom – count 1, 2, 3!
    { d: D[1], draw: (u, c) => {
        savanna(20, c.t);
        const hits = [7.2, 9.2, 11.2, ...beats(16.4, 19.6, .2)];
        const top = leoDrum(380, .8, u, c, hits, { lift: u > 20 && u < 22.6 ? hop(c.t, 4, 6) : 0 });
        S.actor(S.elephant, 790, false, say(c, 'elephant'), .5, { blinkOff: 2, lift: u > 16.4 && u < 19.6 ? hop(c.t, 6, 6) : 0 });
        S.foreground();
        noteStream(top.x + 20, top.y - 30, c.t, win(u, 16.2, 20.4, .4), 1, 1, 4);
      },
      says: [['lion', 'I can play the drum!', 1.2, 5.4, 380, 250, 26], ['elephant', 'Wow! Can you play fast?', 12.4, 16, 760, 300, 26],
             ['lion', 'Boom, boom, boom!', 20.2, 23.4, 380, 250, 26]],
      big: [['Drum', 5.4, 12.4, 640, 100, 60, '#e63946'], ...[1, 2, 3].map(n => [String(n), 7.2 + (n - 1) * 2, 12.2, 520 + (n - 1) * 120, 210, 64, '#ffd23f'])],
      sfx: [[1.2, 'roar', .3], [5.4, 'chime:C5', .35], [7.2, 'drum', .9], [9.2, 'drum', .9], [11.2, 'drum', .95], [12.4, 'trumpet', .3],
            ...beats(16.4, 19.6, .2).map((v, i) => [v, 'drum:' + (i % 2 ? 1.12 : 1), .6]), [19.8, 'drum', .9], [20, 'laugh', .4]].map(e => e[1].startsWith('drum') ? [...e, 0, .9] : e) },

    // 3 – Nico shakes the maraca: shake fast, then slow
    { d: D[2], draw: (u, c) => {
        savanna(20, c.t);
        const shake = u > 6.6 && u < 11.4 ? 1 : u > 14 && u < 18.6 ? .6 : 0;
        const tip = nicoMaraca(420, .8, u, c, shake, { slow: u > 13 });
        S.actor(S.buffalo, 800, false, say(c, 'buffalo'), .48, { blinkOff: 1, lift: u > 7 && u < 11 ? hop(c.t, 5, 5) : 0 });
        S.foreground();
        noteStream(tip.x, tip.y, c.t, shake > 0 ? 1 : 0, 3, 1, 4);
      },
      says: [['rhino', 'What does this one do?', 1, 5, 420, 270, 26], ['buffalo', 'Now shake it slowly…', 11.6, 14, 780, 300, 26],
             ['rhino', 'Shake, shake, shake!', 18.6, 21.6, 420, 270, 26]],
      big: [['Maracas', 5.2, 11.4, 640, 100, 60, '#9b5de5'], ['Fast!', 7.4, 11.2, 640, 210, 52, '#ffd23f'], ['Slow…', 14.6, 18.4, 640, 210, 52, '#4cc9f0']],
      sfx: [[1, 'snort', .35], [5.2, 'chime:D5', .35], ...beats(6.6, 11.4, .3).map(v => [v, 'maraca', .55, .2, .5]), [11.6, 'bellow', .3],
            ...beats(14, 18.6, .9).map(v => [v, 'maraca', .5, .2, 1]), [18.8, 'laugh', .35]] },

    // 4 – Boris plays the xylophone: low notes … high notes, up, up, up!
    { d: D[3], draw: (u, c) => {
        savanna(20, c.t);
        const up = [7, 7.8, 8.6, 9.4, 10.2, 11];          // low → high
        const down = [15.2, 15.6, 16, 16.4, 16.8, 17.2];  // high → low (whoosh)
        let bar = -1; const lit = [0, 0, 0, 0, 0, 0];
        up.forEach((h, i) => { if (u >= h - .25 && u < h + .55) bar = i; lit[i] = Math.max(lit[i], pulse(u, [h], .6)); });
        down.forEach((h, i) => { if (u >= h - .15 && u < h + .25) bar = 5 - i; lit[5 - i] = Math.max(lit[5 - i], pulse(u, [h], .4)); });
        borisXylo(300, .8, u, c, bar, lit, { blinkOff: 1 });
        S.actor(S.lion, 830, false, say(c, 'lion'), .48, { blinkOff: 2, lift: u > 17.4 && u < 20 ? hop(c.t, 5, 6) : 0 });
        S.foreground();
        noteStream(560, 300, c.t, win(u, 7, 12, .4) + win(u, 15, 18, .4), 5, 1, 4);
      },
      says: [['buffalo', 'My turn! Listen…', 1, 4.8, 300, 270, 26], ['lion', 'The notes go up!', 11.8, 14.8, 800, 300, 26],
             ['buffalo', 'Ding, ding, ding!', 19.4, 23, 300, 270, 26]],
      big: [['Xylophone', 4.8, 12, 640, 100, 60, '#3a86ff'], ['Low', 7, 12, 470, 210, 44, '#ffffff'], ['High', 10.6, 12, 700, 170, 44, '#ffffff']],
      sfx: [[1, 'bellow', .3], [4.8, 'chime:E5', .35], ...['C5', 'D5', 'E5', 'G5', 'A5', 'C6'].map((n, i) => [7 + i * .8, 'xylo:' + n, .8, .2, .8]),
            [11.8, 'roar', .25], ...['C6', 'A5', 'G5', 'E5', 'D5', 'C5'].map((n, i) => [15.2 + i * .4, 'xylo:' + n, .7, .2, .5]), [17.6, 'laugh', .35]] },

    // 5 – Ella has no instrument and feels sad; her friends help: your trunk is a trumpet! TOOT!
    { d: D[4], draw: (u, c) => {
        savanna(22, c.t);
        const tootA = win(u, 13.4, 15.4, .3) + win(u, 16.2, 18.6, .3);
        const happy = u > 18.6 && u < 23;
        const tip = ella(440, .62, u, c, tootA, { lift: happy ? hop(c.t, 4, 6) : 0 });
        [['lion', 150, .44, true], ['rhino', 800, .44, false], ['buffalo', 910, .4, false]].forEach(([k, px, sc, fl], i) =>
          S.actor(ANI[k], px, false, say(c, k), sc, { flip: fl, blinkOff: i * .7, lift: happy ? hop(c.t + i, 4, 6) : 0 }));
        S.foreground();
        noteStream(tip.x, tip.y, c.t, tootA, 7, 1, 5);
        if (u > 9.6 && u < 13) C.sparkles(tip.x - 50, tip.y + 20, c.t, 8, 50, '#fff3a0');
      },
      says: [['elephant', "Oh… I don't have an instrument.", 1, 5, 440, 250, 26], ['lion', "Don't be sad, Ella!", 6, 9.4, 220, 300, 26],
             ['rhino', 'Your trunk can be a trumpet!', 9.6, 13.2, 760, 300, 26], ['elephant', 'I feel happy now!', 19, 23.6, 440, 250, 26]],
      big: [['Sad', 2.6, 5.6, 700, 150, 46, '#4cc9f0'], ['Trumpet!', 13.6, 18.6, 680, 100, 60, '#ffd23f'], ['Happy!', 19.4, 23.6, 720, 170, 50, '#ff9f1c']],
      sfx: [[1, 'sad', .4], [6, 'roar', .25], [9.6, 'snort', .35], [13.4, 'toot:1.8', .7, .1, 2], [16.2, 'toot:0.6', .65, .1, .8], [17, 'toot:0.6', .65, .1, .8],
            [17.8, 'toot:0.8', .7, .1, 1], [18.8, 'cheer', .45], [19.4, 'chime:G5', .35]] },

    // 6 – the band: everyone plays together on the beat; recap of the four instruments
    { d: D[5], draw: (u, c) => {
        savanna(22 + u * .25, c.t);
        const on = u >= BAND[0] && u < bandEnd;
        const drumHits = BAND.filter((_, i) => i % 2 === 0), shake = on ? 1 : 0;
        const bi = BAND.findIndex(v => u >= v && u < v + BEAT);
        const bar = on && bi >= 0 ? [0, 2, 4, 5, 4, 2, 1, 3][bi % 8] : -1, lit = [0, 0, 0, 0, 0, 0];
        if (bar >= 0) lit[bar] = pulse(u, [BAND[bi]], .5);
        const toot = on && Math.floor(bi / 4) % 2 === 1 ? win((u - BAND[0]) % (BEAT * 4), 0, BEAT * 3.2, .15) : 0;
        const bob = on ? hop(c.t, Math.PI / BEAT, 4) : 0;
        const e = ella(120, .48, u, c, toot, { lift: bob });
        const l = leoDrum(310, .62, u, c, on ? drumHits : [], { lift: bob, blinkOff: 1 });
        const n = nicoMaraca(520, .6, u, c, shake, { lift: bob, blinkOff: 2 });
        borisXylo(700, .6, u, c, bar, lit, { lift: bob, blinkOff: 3 });
        S.foreground();
        if (on) { noteStream(e.x, e.y, c.t, toot, 7, 1, 3); noteStream(l.x, l.y - 30, c.t, 1, 1, 1, 3); noteStream(n.x, n.y, c.t, 1, 4, 1, 3); noteStream(830, 360, c.t, 1, 9, 1, 3); }
      },
      says: [['rhino', "Let's play together!", .8, 4.2, 520, 300, 26], ['elephant', 'Music is more fun together!', 25.6, 31.6, 300, 300, 26]],
      big: [['Together!', BAND[4], bandEnd, 480, 90, 58, '#ff9f1c'],
            ...['Drum', 'Maracas', 'Xylophone', 'Trumpet'].map((w, i) => [w, bandEnd + .4 + i * .5, 32, 180 + i * 200, 175, 32, '#ffffff'])],
      after: (u, c) => ['drum', 'maracas', 'xylophone', 'trumpet'].forEach((k, i) => icon(k, 180 + i * 200, 95, win(u, bandEnd + .4 + i * .5, 32, .3), c.t)),
      sfx: [[.8, 'snort', .3],
            ...BAND.map((v, i) => i % 2 === 0 ? [v, 'drum', .55, -.2] : null).filter(Boolean),
            ...BAND.map(v => [v + BEAT / 2, 'maraca', .3, .1]),
            ...BAND.map((v, i) => [v, 'xylo:' + ['A4', 'C#5', 'E5', 'A5', 'E5', 'C#5', 'B4', 'D5'][i % 8], .45, .4]),
            ...BAND.filter((_, i) => Math.floor(i / 4) % 2 === 1 && i % 4 === 0).map(v => [v, 'toot:1.9', .45, -.4]),
            [bandEnd, 'tada', .55], [bandEnd + .4, 'pop', .4], [bandEnd + .9, 'pop', .4], [bandEnd + 1.4, 'pop', .4], [bandEnd + 1.9, 'pop', .4], [25.6, 'trumpet', .3]] },
  ],
});
