// The Big Four – Fruit Picnic! (English story episode: fruit names + colours – red apples, yellow bananas, purple grapes,
// green watermelon that is red inside; counting 1-2-3, 1-2-3-4, 1-2; Ella brings a watermelon that is too big for one → she shares a slice with everyone)
const C = require('../lib/common'), S = require('../lib/safari');
const St = require('../lib/story');
const { x, W, H, clamp, ease, lerp, win, hash } = C;
const G = S.GROUND, ANI = { lion: S.lion, elephant: S.elephant, rhino: S.rhino, buffalo: S.buffalo };
const INK = '#3a2414';
const COL = { apple: '#e63946', banana: '#ffd23f', grapes: '#9b5de5', melon: '#3fae5a', red: '#ff4d6d' };
// head centre (animal units, unflipped = facing left) – used to send slices to the mouths
const HEADP = { lion: [-58, -92], elephant: [-82, -135], rhino: [-78, -70], buffalo: [-74, -78] };

function savanna(skyT, t) { S.setT(skyT); S.sky(); S.setT(t); S.land(); }
const say = (c, who, k = .45) => { const v = c.talk(who); return v > 0 ? (who === 'elephant' ? .12 + v * .04 : v * k) : 0; };
const walk = (u, a, b, x0, x1) => u < a ? x0 : u > b ? x1 : lerp(x0, x1, ease((u - a) / (b - a)));
const moving = (u, a, b) => u > a && u < b;
const hop = (t, sp = 6, h = 8) => Math.abs(Math.sin(t * sp)) * h;
const popK = (u, a) => u < a ? 0 : ease(clamp((u - a) / .35)) + Math.sin(clamp((u - a) / .35) * Math.PI) * .25;
const mouthOf = (k, px, sc, flip, lift = 0) => { const [hx, hy] = HEADP[k]; return [px + (flip ? -hx : hx) * sc, G - lift + (hy + 16) * sc]; };

// ---------- picnic things ----------
// red & white checked blanket in perspective; k = how far it is unrolled (0..1, from the left)
const BL = { tl: 300, tr: 660, bl: 225, br: 735, top: 418, bot: 504 };
function blanket(k = 1) {
  if (k <= 0) return;
  x.save();
  const right = lerp(BL.bl, BL.br, k), rightTop = lerp(BL.tl, BL.tr, k);
  x.beginPath(); x.moveTo(BL.tl, BL.top); x.lineTo(rightTop, BL.top); x.lineTo(right, BL.bot); x.lineTo(BL.bl, BL.bot); x.closePath();
  x.fillStyle = 'rgba(70,40,10,.18)'; x.save(); x.translate(0, 5); x.fill(); x.restore();
  x.fillStyle = '#fff6ec'; x.fill(); x.save(); x.clip();
  const NX = 10, NY = 4;
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    if ((i + j) % 2) continue;
    const y0 = lerp(BL.top, BL.bot, j / NY), y1 = lerp(BL.top, BL.bot, (j + 1) / NY);
    const xa = (yy, ii) => lerp(lerp(BL.tl, BL.bl, (yy - BL.top) / (BL.bot - BL.top)), lerp(BL.tr, BL.br, (yy - BL.top) / (BL.bot - BL.top)), ii / NX);
    x.beginPath(); x.moveTo(xa(y0, i), y0); x.lineTo(xa(y0, i + 1), y0); x.lineTo(xa(y1, i + 1), y1); x.lineTo(xa(y1, i), y1); x.closePath();
    x.fillStyle = '#e8505b'; x.fill();
  }
  x.restore();
  x.strokeStyle = INK; x.lineWidth = 3; x.stroke();
  if (k < 1) { C.ell(right + 4, lerp(BL.top, BL.bot, .5), 12, 44, '#f2d0c8', INK, 3); }   // the roll
  x.restore();
}
function apple(cx, cy, s, bite = 0) {
  x.save(); x.translate(cx, cy); x.scale(s, s);
  x.fillStyle = COL.apple; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(0, -14); x.bezierCurveTo(-10, -26, -30, -22, -28, 0); x.bezierCurveTo(-26, 22, -10, 28, 0, 22); x.bezierCurveTo(10, 28, 26, 22, 28, 0); x.bezierCurveTo(30, -22, 10, -26, 0, -14); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = 'rgba(255,255,255,.5)'; x.beginPath(); x.ellipse(-14, -6, 5, 9, .3, 0, 7); x.fill();
  x.strokeStyle = '#7a4a24'; x.lineWidth = 4; x.lineCap = 'round'; x.beginPath(); x.moveTo(0, -14); x.quadraticCurveTo(2, -24, 6, -28); x.stroke();
  x.fillStyle = '#6cd36b'; x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.moveTo(4, -22); x.quadraticCurveTo(18, -34, 26, -24); x.quadraticCurveTo(14, -16, 4, -22); x.fill(); x.stroke();
  x.restore();
}
function banana(cx, cy, s, rot = 0) {
  x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(s, s);
  x.fillStyle = COL.banana; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(-34, -10); x.quadraticCurveTo(-10, 22, 32, -6); x.quadraticCurveTo(36, -10, 34, -14); x.quadraticCurveTo(-4, 6, -30, -16); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = 'rgba(160,110,20,.6)'; x.lineWidth = 2; x.beginPath(); x.moveTo(-26, -8); x.quadraticCurveTo(-4, 12, 28, -6); x.stroke();
  C.circ(-33, -13, 4, '#6b4a1e'); C.circ(34, -11, 3, '#6b4a1e');
  x.restore();
}
function grapes(cx, cy, s) {
  x.save(); x.translate(cx, cy); x.scale(s, s);
  x.strokeStyle = '#7a4a24'; x.lineWidth = 4; x.lineCap = 'round'; x.beginPath(); x.moveTo(0, -30); x.quadraticCurveTo(4, -40, 10, -44); x.stroke();
  x.fillStyle = '#6cd36b'; x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.moveTo(2, -34); x.quadraticCurveTo(-20, -48, -26, -32); x.quadraticCurveTo(-10, -26, 2, -34); x.fill(); x.stroke();
  [[-14, -22], [0, -24], [14, -22], [-20, -8], [-6, -8], [8, -8], [20, -8], [-12, 6], [2, 6], [16, 6], [-5, 19], [9, 19], [2, 31]]
    .forEach(([a, b]) => { C.circ(a, b, 9, COL.grapes, INK, 2.5); C.circ(a - 3, b - 3, 2.5, 'rgba(255,255,255,.6)'); });
  x.restore();
}
// whole watermelon (dark green stripes); split 0..1 opens it into 4 slices
function melon(cx, cy, s, rollAng = 0) {
  x.save(); x.translate(cx, cy); x.scale(s, s);
  x.fillStyle = 'rgba(70,40,10,.2)'; x.beginPath(); x.ellipse(0, 46, 60, 8, 0, 0, 7); x.fill();
  x.rotate(rollAng);
  C.ell(0, 0, 62, 46, COL.melon, INK, 4);
  x.save(); x.beginPath(); x.ellipse(0, 0, 60, 44, 0, 0, 7); x.clip();
  x.strokeStyle = '#1f7a3a'; x.lineWidth = 8;
  for (let i = -3; i <= 3; i++) { x.beginPath(); x.moveTo(i * 18 - 8, -50); x.bezierCurveTo(i * 22 + 10, -16, i * 22 - 10, 16, i * 18 + 8, 50); x.stroke(); }
  x.restore();
  x.fillStyle = 'rgba(255,255,255,.35)'; x.beginPath(); x.ellipse(-26, -20, 14, 7, -.4, 0, 7); x.fill();
  x.restore();
}
function slice(cx, cy, s, rot = 0) {
  x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(s, s);
  const r = 40;
  x.beginPath(); x.moveTo(-r, 0); x.arc(0, 0, r, Math.PI, 0, true); x.closePath();
  x.fillStyle = '#2e9a4c'; x.strokeStyle = INK; x.lineWidth = 3; x.fill(); x.stroke();
  x.beginPath(); x.moveTo(-r + 6, 0); x.arc(0, 0, r - 6, Math.PI, 0, true); x.closePath(); x.fillStyle = '#dff5c8'; x.fill();
  x.beginPath(); x.moveTo(-r + 10, 0); x.arc(0, 0, r - 10, Math.PI, 0, true); x.closePath(); x.fillStyle = COL.red; x.fill();
  x.fillStyle = INK; [[-16, 10], [0, 16], [16, 10], [-6, 24], [8, 26]].forEach(([a, b]) => { x.beginPath(); x.ellipse(a, b, 2.5, 4, 0, 0, 7); x.fill(); });
  x.restore();
}
// slice with bites: shrink it from the left instead (simple and readable)
function sliceEaten(cx, cy, s, rot, eaten) {
  if (eaten >= 1) return;
  x.save(); x.beginPath(); x.rect(cx - 60 * s + eaten * 90 * s, cy - 60 * s, 140 * s, 120 * s); x.clip();
  slice(cx, cy, s, rot); x.restore();
  if (eaten > 0) { x.save(); x.fillStyle = '#ffffff'; x.globalAlpha = .9; for (let i = 0; i < 3; i++) C.circ(cx - 40 * s + eaten * 90 * s, cy + (8 + i * 10) * s, 2.2 * s); x.restore(); }
}
// fruits lying on the back of the blanket after their shot
function onBlanket(o) {
  const a = o.apples || 0, b = o.bananas || 0, g = o.grapes || 0;
  for (let i = 0; i < a; i++) apple(345 + i * 40, 436 + (i % 2) * 4, .95);
  for (let i = 0; i < b; i++) banana(470 + (i % 2) * 34, 430 + Math.floor(i / 2) * 14 + (i % 2) * 3, .8, -.15);
  for (let i = 0; i < g; i++) grapes(585 + i * 42, 440, .85);
}
function icon(kind, cx, cy, k) {
  if (k <= 0) return;
  const s = .4 + .6 * ease(k * 2) + Math.sin(clamp(k * 2) * Math.PI) * .12;
  x.save(); x.globalAlpha = clamp(k * 2); x.translate(cx, cy); x.scale(s, s);
  C.circ(0, 0, 52, 'rgba(255,255,255,.92)', INK, 4);
  if (kind === 'apple') apple(0, 4, 1.2);
  else if (kind === 'banana') banana(0, 2, 1.1, -.2);
  else if (kind === 'grapes') grapes(0, 4, 1.05);
  else melon(0, -2, .62);
  x.restore();
}

// ---------- shot helpers ----------
const BACK = 46;   // friends 'behind' the blanket stand a bit higher and smaller (drawn before the blanket)
// one "I brought …" shot: speaker on the left, listener on the right, new fruits pop onto the front of the blanket
function fruitShot(o) {
  const P = o.pops;
  return {
    d: 22, draw: (u, c) => {
      savanna(20 + o.sky, c.t);
      blanket(1); onBlanket(o.before);
      const happy = u > 15.4 && u < 20;
      S.actor(ANI[o.who], o.who === 'elephant' ? 150 : 140, false, say(c, o.who), o.sc || 1, { flip: true, blinkOff: 0, lift: happy ? hop(c.t, 4, 8) : 0 });
      S.actor(ANI[o.ask], 850, false, say(c, o.ask), o.ask === 'elephant' ? .66 : .76, { flip: false, blinkOff: 1.3, lift: happy ? hop(c.t + 1, 4, 6) : 0 });
      P.forEach((p, i) => { const k = popK(u, p); if (k > 0) o.draw(i, k, u); });
      S.foreground();
    },
    says: [[o.who, o.line, .8, 4.4, 160, 240, 28], [o.ask, 'What color is it?', 11.2, 14.6, 820, 290, 28]],
    big: [[o.name, 4.6, 21.2, 480, 92, 62, o.col], ...P.map((p, i) => [String(i + 1), p, 10.8, o.numX(i), 380, 56, '#ffffff']),
          [o.color + '!', 15.4, 20.8, 480, 210, 68, o.col]],
    sfx: [[.8, o.snd, .3], [4.6, 'chime:E5', .3], ...P.map((p, i) => [p, 'pop', .6, (o.numX(i) - 480) / 400]), ...P.map((p, i) => [p + .05, 'chime:' + ['C5', 'D5', 'E5', 'G5'][i], .3]),
          [11.2, o.askSnd, .25], [15.4, 'arp', .45], [15.8, 'cheer', .3]],
  };
}
// the whole group around the blanket (shots 5 and 6): Ella front-left, Leo front-right, Nico and Boris behind the blanket
const GROUP = { elephant: [135, .8, true, 0], lion: [835, .68, false, 0], rhino: [395, .5, true, BACK], buffalo: [575, .5, false, BACK] };
function group(u, c, liftFn, back = true) {
  ['rhino', 'buffalo', 'elephant', 'lion'].forEach((k, i) => {
    const [px, sc, fl, lift] = GROUP[k]; if ((lift > 0) !== back) return;
    S.actor(ANI[k], px, false, k === 'elephant' && c.ellaAct !== undefined ? c.ellaAct : say(c, k), sc, { flip: fl, blinkOff: i * .7, lift: lift + liftFn(k, i) });
  });
}
const SL = [18.6, 19.5, 20.4, 21.3];      // slice handed out (count 1-2-3-4): Ella, Leo, Nico, Boris
const SLK = ['elephant', 'lion', 'rhino', 'buffalo'];

St.episode({
  title: ['Fruit Picnic!', 70], sub: 'The Big Four', accent: '#e63946', cardBg: '#fff4ec',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'picnic', shift: 0 },
  thumb: ['Fruit Picnic!', 'The Big Four'],
  shots: [
    // 1 – Ella unrolls a picnic blanket, the friends come running
    { d: 20, draw: (u, c) => {
        savanna(14 + u * .2, c.t);
        const ent = { elephant: 0, lion: 9.6, rhino: 10, buffalo: 10.4 };
        const L = k => { const [tx, sc, fl, lift] = GROUP[k], v = u - ent[k]; return [walk(v, 0, 3.2, fl ? -180 : W + 180, tx), sc, fl, lift, moving(v, 0, 3.2)]; };
        const jump = (i) => u > 16 && u < 19.4 ? hop(c.t + i, 4, 7) : 0;
        ['rhino', 'buffalo'].forEach((k, i) => { const [px, sc, fl, lift, mv] = L(k); S.actor(ANI[k], px, mv, say(c, k), sc, { flip: fl, blinkOff: i + 2, phase: i, lift: lift + jump(i + 2) }); });
        blanket(ease(clamp((u - 5.6) / 1.6)));
        ['elephant', 'lion'].forEach((k, i) => { const [px, sc, fl, lift, mv] = L(k); S.actor(ANI[k], px, mv, say(c, k), sc, { flip: fl, blinkOff: i, phase: i, lift: lift + jump(i) }); });
        S.foreground();
      },
      says: [['elephant', "Let's have a picnic!", 5, 9, 150, 250, 28], ['lion', "Yay! I'm hungry!", 14, 17.6, 820, 300, 28]],
      big: [['Picnic!', 9.4, 13.6, 480, 200, 68, '#ff9f1c']],
      sfx: [[5, 'trumpet', .3], [5.6, 'whoosh', .4], [9.4, 'arp', .5], [10, 'cheer', .4], [14, 'roar', .3], [16, 'laugh', .35]] },

    // 2 – Leo brought apples: 1, 2, 3 – red!
    fruitShot({ who: 'lion', ask: 'elephant', line: 'I brought apples!', name: 'Apples', color: 'Red', col: COL.apple, sky: 0, snd: 'roar', askSnd: 'trumpet',
      before: {}, pops: [6.2, 7.6, 9], numX: i => 380 + i * 100,
      draw: (i, k) => apple(380 + i * 100, 474 - (1 - Math.min(1, k)) * 50, 1.45 * Math.min(k, 1.2)) }),

    // 3 – Nico brought bananas: 1, 2, 3, 4 – yellow!
    fruitShot({ who: 'rhino', ask: 'lion', line: 'I brought bananas!', name: 'Bananas', color: 'Yellow', col: '#ffc300', sky: 1, snd: 'snort', askSnd: 'roar',
      before: { apples: 3 }, pops: [5.8, 6.9, 8, 9.1], numX: i => 360 + i * 82,
      draw: (i, k) => banana(360 + i * 82, 476 - (1 - Math.min(1, k)) * 50, 1.2 * Math.min(k, 1.2), -.2 + (i % 2) * .3) }),

    // 4 – Boris brought grapes: 1, 2 – purple!
    fruitShot({ who: 'buffalo', ask: 'rhino', line: 'I brought grapes!', name: 'Grapes', color: 'Purple', col: COL.grapes, sky: 2, snd: 'bellow', askSnd: 'snort',
      before: { apples: 3, bananas: 4 }, pops: [6.4, 8.2], numX: i => 420 + i * 130,
      draw: (i, k) => grapes(420 + i * 130, 470 - (1 - Math.min(1, k)) * 50, 1.35 * Math.min(k, 1.2)) }),

    // 5 – Ella's surprise: a big green watermelon, red inside! Too big for one → one slice for everyone (1-2-3-4), let's share!
    { d: 28, draw: (u, c) => {
        savanna(24, c.t);
        const stomp = u > 16.4 && u < 17.2 ? Math.sin((u - 16.4) / .8 * Math.PI) * 16 : 0;
        const happy = u > 22.4 && u < 23.6;
        c.ellaAct = u > 16.2 && u < 17.4 ? .9 : undefined;
        const lf = (k, i) => (k === 'elephant' ? stomp : 0) + (happy ? hop(c.t + i, 4, 6) : (u > 9.2 && u < 12.6 ? hop(c.t + i, 3, 3) : 0));
        group(u, c, lf, true);
        blanket(1); onBlanket({ apples: 3, bananas: 4, grapes: 2 });
        group(u, c, lf, false);
        const MX = 480, MY = 452;
        if (u < 17) {
          const k = ease(clamp((u - 5.2) / 2.6)), mx = lerp(-100, MX, k);
          if (u > 5.2) melon(mx, MY, 1.15, (mx - MX) / 70);
        } else {
          const t2 = u - 17;
          SLK.forEach((kk, i) => {
            const [gx, sc, fl, lift] = GROUP[kk], m = mouthOf(kk, gx, sc, fl, lift);
            if (kk === 'elephant') { m[0] += 30; m[1] += 34; }
            const ox = MX - 84 + i * 56, oy = MY - 10 - Math.sin(clamp(t2 / .5) * Math.PI) * 34;
            const f = ease(clamp((u - SL[i]) / .8));
            const px = lerp(ox, m[0], f), py = lerp(oy, m[1] + 10, f) - Math.sin(f * Math.PI) * 70;
            const eaten = clamp((u - 23.6 - i * .3) / 2.6);
            sliceEaten(px, py, lerp(1.1, lift ? .6 : .8, f), lerp(0, fl ? .2 : -.2, f), eaten);
          });
        }
        if (u > 17 && u < 18.2) C.sparkles(MX, MY - 20, c.t, 10, 90 * clamp((u - 17) / .4), '#fff3a0');
        S.foreground();
      },
      says: [['lion', 'Ella, what did you bring?', .8, 4.6, 790, 290, 28], ['elephant', 'A big watermelon!', 5.2, 9, 150, 250, 28],
             ['rhino', 'It is too big for one!', 13, 16.2, 420, 270, 28], ['elephant', 'One for everyone!', 22.6, 26.8, 150, 250, 28]],
      big: [['Watermelon', 9.2, 16.4, 480, 92, 62, COL.melon], ['Green!', 9.6, 12.6, 480, 190, 64, COL.melon], ['Red inside!', 17.2, 18.4, 480, 92, 60, COL.red],
            ...SL.map((s, i) => [String(i + 1), s + .6, 22.4, 330 + i * 100, 190, 56, '#ffffff']), ["Let's share!", 22.6, 27, 520, 92, 60, '#ff9f1c']],
      sfx: [[.8, 'roar', .3], [5.2, 'trumpet', .3], [5.4, 'rustle', .4], [7.8, 'bump', .5], [9.2, 'arp', .45], [13, 'snort', .3],
            [16.5, 'bump', .7, 0, .6], [17, 'crack', .8, 0, .8], [17.2, 'tada', .4], ...SL.map((s, i) => [s, 'swish', .45, -.4 + i * .3]), ...SL.map((s, i) => [s + .6, 'chime:' + ['C5', 'D5', 'E5', 'G5'][i], .32]),
            [22.6, 'cheer', .35], [23.6, 'munch', .5, -.5], [23.9, 'munch', .45, .6], [24.2, 'munch', .4, -.1], [24.5, 'munch', .4, .2]] },

    // 6 – sunset: full and happy, recap of the four fruits and their colours
    { d: 34, draw: (u, c) => {
        savanna(58 + u * .05, c.t);
        const happy = u > 1 && u < 4.6;
        const lf = (k, i) => happy ? hop(c.t + i, 4, 6) : 0;
        group(u, c, lf, true);
        blanket(1);
        // what is left: apple cores, banana peels, grape stems and melon rinds
        [[360, 462], [410, 470], [455, 460]].forEach(([a, b]) => { x.save(); x.translate(a, b); x.scale(1.3, 1.3); x.fillStyle = '#f3e0a8'; x.strokeStyle = INK; x.lineWidth = 2.5;
          x.beginPath(); x.ellipse(0, 0, 6, 11, 0, 0, 7); x.fill(); x.stroke(); x.fillStyle = COL.apple; x.beginPath(); x.ellipse(0, -11, 9, 4, 0, 0, 7); x.fill(); x.stroke(); x.beginPath(); x.ellipse(0, 11, 9, 4, 0, 0, 7); x.fill(); x.stroke(); x.restore(); });
        [[520, 482, .2], [590, 470, -.4], [640, 484, .1], [555, 460, -.1]].forEach(([a, b, r]) => { x.save(); x.translate(a, b); x.rotate(r); x.strokeStyle = INK; x.lineWidth = 11; x.lineCap = 'round'; x.beginPath(); x.arc(0, -20, 26, .5, Math.PI - .5); x.stroke(); x.strokeStyle = '#2e9a4c'; x.lineWidth = 7; x.stroke(); x.restore(); });
        group(u, c, lf, false);
        S.foreground();
      },
      says: [['rhino', 'Yum! Thank you, Ella!', 1, 4.6, 420, 270, 28], ['elephant', 'Sharing makes us happy!', 22.4, 27.6, 240, 260, 28]],
      big: ['Red', 'Yellow', 'Purple', 'Green'].map((w, i) => [w, 6.4 + i * 1.6, 21.6, 180 + i * 200, 180, 40, [COL.apple, '#ffc300', COL.grapes, COL.melon][i]]),
      after: (u) => ['apple', 'banana', 'grapes', 'melon'].forEach((k, i) => icon(k, 180 + i * 200, 100, win(u, 6 + i * 1.6, 21.6, .3))),
      sfx: [[1, 'snort', .3], [1.4, 'laugh', .35], ...[0, 1, 2, 3].map(i => [6 + i * 1.6, 'pop', .45]), ...[0, 1, 2, 3].map(i => [6.4 + i * 1.6, 'chime:' + ['C5', 'E5', 'G5', 'C6'][i], .32]),
            [12.8, 'tada', .4], [22.4, 'trumpet', .3]] },
  ],
});
