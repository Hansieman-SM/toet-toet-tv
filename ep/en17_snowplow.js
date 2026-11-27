// Little Truck Toet – Toet's Helper Friends: Sami the Snowplow (English story episode, approved "Helper Friends" idea).
// The first snow of winter: big snow drifts lie on the road and Little Truck Toet's wheels just spin (whirr!) – he is stuck.
// Sami the Snowplow (new character, original design: a blue ELECTRIC snowplow truck – lightning badge, no exhaust – with an orange
// striped plough blade, a flashing amber roof light and a salt box with a snowflake) plows the road clear: one by one she throws the
// five snow drifts onto the roadside. Learning moment: COUNTING 1–5 (numeral + number word per pile), recap "Five snow piles!",
// saying thank you. Toet drives on past a little snowman. New music: snowplow_long (cornet polka in G, tuba, sleigh bells, glockenspiel).
const C = require('../lib/common'), T = require('../lib/toet');
const St = require('../lib/story');
const { x, W, H, clamp, ease, lerp, win, circ, ell, rr, hash, INK } = C;
const { drive } = St;
const BX = 96, ROAD = T.ROAD;
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 205];
const M1 = T.motion([[0, 150], [4, 150], [7, 0]]), STOP = M1.distAt(7);
const SGY = ROAD + 20, SS = .85;                        // Sami: road contact like Toet, scale
const NOTB = a => process.env.THUMBBG ? [] : a;          // no big labels on the thumbnail background
const blinkAt = (t, off = 0) => (t + off) % 4.2 > 4.05;
const BLUE = '#2f7de1', BLUE2 = '#1c5bb0', OR = '#ff8c1a';
const cheeks = (cx, cy, r) => { x.fillStyle = 'rgba(255,110,120,.45)'; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); };
const SB = [(u, c) => clamp((c.rx ?? 840) - 30, 300, 800), 292];   // Sami's speech bubble follows her

// snow drifts on the road (screen x, in the parked shots) and where they land on the roadside
const HX = [372, 447, 522, 597, 672];
const VX = HX.map(h => h - 8), VY = 437;
const bladeX = rx => rx - 154 * SS;                     // front of the plough blade
const R_IN = 840;
const WORDS = ['one', 'two', 'three', 'four', 'five'];
const NCOL = ['#e63946', '#f59f00', '#2b8a3e', '#1c7ed6', '#9c36b5'];

// ---------- a snow mound (bottom-centre) ----------
function mound(cx, gy, r, k = 1) {
  if (k <= 0) return;
  x.save(); x.translate(cx, gy); x.scale(k, k);
  x.fillStyle = 'rgba(70,100,140,.18)'; x.beginPath(); x.ellipse(0, 1, r * 1.15, r * .16, 0, 0, 7); x.fill();
  x.fillStyle = '#f7faff'; x.strokeStyle = '#9fb6cf'; x.lineWidth = 2.5;
  x.beginPath(); x.moveTo(-r * 1.1, 0);
  x.bezierCurveTo(-r * 1.05, -r * .55, -r * .6, -r * 1.05, -r * .1, -r * 1.0);
  x.bezierCurveTo(r * .35, -r * 1.2, r * .95, -r * .75, r * 1.1, 0); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = 'rgba(150,185,225,.35)'; x.beginPath(); x.ellipse(r * .35, -r * .3, r * .55, r * .25, -.3, 0, 7); x.fill();
  x.fillStyle = '#fff'; x.beginPath(); x.ellipse(-r * .35, -r * .72, r * .28, r * .12, -.4, 0, 7); x.fill();
  x.restore();
}
// snow cover on the road from x0 to x1 (with a soft lumpy top edge)
function roadSnow(x0, x1) {
  if (x1 <= x0) return;
  x.fillStyle = '#f2f6fc'; x.beginPath(); x.moveTo(x0, ROAD + 72);
  for (let px = x0; px <= x1; px += 12) x.lineTo(px, ROAD - 3 + Math.sin(px * .07) * 2.5 + Math.sin(px * .19) * 1.5);
  x.lineTo(x1, ROAD + 72); x.closePath(); x.fill();
  x.fillStyle = 'rgba(150,180,215,.35)'; x.fillRect(x0, ROAD + 58, x1 - x0, 14);
  x.fillStyle = 'rgba(255,255,255,.9)'; for (let px = x0 + 20; px < x1; px += 57) { x.beginPath(); x.ellipse(px, ROAD + 22 + hash(px) * 20, 10, 3, 0, 0, 7); x.fill(); }
}
// snow banks along the roadside (cleared road)
function banks(dist) {
  const sp = 70, off = dist % sp;
  for (let i = -1; i < W / sp + 2; i++) { const k = Math.floor(dist / sp) + i; mound(i * sp - off, VY + 2, 20 + hash(k) * 10); }
}
// falling snow (deterministic)
function snowfall(t, n = 70, a = .9) {
  for (let i = 0; i < n; i++) {
    const sp = 22 + hash(i + 3) * 26, r = 1.6 + hash(i + 9) * 2.6;
    const py = ((hash(i + 7) * (H + 30) + t * sp) % (H + 30)) - 15;
    const px = ((hash(i) * W + Math.sin(t * .7 + i * 1.7) * 18 - t * 6) % W + W) % W;
    x.fillStyle = `rgba(255,255,255,${a * (.6 + hash(i + 1) * .4)})`; x.beginPath(); x.arc(px, py, r, 0, 7); x.fill();
  }
}

// ---------- Sami the Snowplow (original design, faces left). origin = road contact under the middle ----------
function sami(rx, gy, t, o = {}) {
  x.save(); x.translate(rx, gy + (o.moving ? Math.sin(t * 13) * 1.4 : 0)); x.scale(SS, SS);
  x.fillStyle = 'rgba(0,0,0,.18)'; x.beginPath(); x.ellipse(-10, 26, 150, 9, 0, 0, 7); x.fill();
  x.strokeStyle = INK; x.lineWidth = 4;
  // salt box at the back (white, with a snowflake + name)
  x.fillStyle = '#f1f5fa'; rr(-6, -118, 130, 106, 14); x.fill(); x.stroke();
  x.fillStyle = BLUE; x.font = C.FONT(34); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('SAMI', 64, -82);
  flake(64, -40, 15, t * .4, BLUE);
  // spreader dots under the box when moving
  if (o.moving) for (let i = 0; i < 6; i++) { const a = (t * 3 + i / 6) % 1; circ(112 + a * 18, -6 + a * 26, 2.2, `rgba(255,255,255,${1 - a})`); }
  // cab (front to the left)
  x.fillStyle = BLUE; x.beginPath(); x.moveTo(-6, -10); x.lineTo(-6, -118); x.quadraticCurveTo(-6, -130, -18, -130); x.lineTo(-62, -130);
  x.quadraticCurveTo(-80, -130, -88, -108); x.lineTo(-102, -60); x.quadraticCurveTo(-106, -50, -106, -40); x.lineTo(-106, -10); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = '#d8f3ff'; x.lineWidth = 3; x.beginPath(); x.moveTo(-20, -118); x.lineTo(-62, -118); x.quadraticCurveTo(-72, -118, -78, -104); x.lineTo(-88, -74); x.lineTo(-20, -74); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 4; x.beginPath(); x.moveTo(-34, -112); x.lineTo(-26, -96); x.stroke();
  // eyes (looking left / at us)
  const lk = o.look ?? -2;
  if (blinkAt(t, .8)) { x.fillStyle = INK; x.fillRect(-70, -94, 12, 3); x.fillRect(-48, -94, 12, 3); }
  else { [-64, -42].forEach(ex => { circ(ex + lk, -93, 6.5, INK); circ(ex + lk - 2, -95, 2.2, '#fff'); });
    x.strokeStyle = INK; x.lineWidth = 2.5; x.lineCap = 'round'; [-64, -42].forEach(ex => { x.beginPath(); x.arc(ex, -101, 9, Math.PI + .7, -.7); x.stroke(); }); }
  // mouth + cheeks on the cab front
  const m = o.mouth || 0; x.strokeStyle = INK; x.lineWidth = 3;
  if (m > .05) { x.fillStyle = INK; x.beginPath(); x.ellipse(-86, -44, 7, 3 + m * 5, 0, 0, 7); x.fill(); }
  else { x.beginPath(); x.arc(-84, -54, 11, .5, Math.PI - .2); x.stroke(); }
  cheeks(-98, -58, 5); cheeks(-70, -58, 5);
  // lightning badge on the door
  circ(-30, -48, 13, '#ffd23f', INK, 3); T.bolt(-30, -48, .55, INK);
  // amber roof light (flashing)
  const fl = .5 + .5 * Math.sin(t * 7);
  if (o.beacon !== false) { circ(-40, -138, 20 + fl * 8, `rgba(255,190,40,${.18 + fl * .2})`); }
  x.fillStyle = '#5c6370'; rr(-54, -136, 28, 7, 3); x.fill();
  x.fillStyle = o.beacon !== false ? C.mix('#ffb000', '#ffe066', fl) : '#ffc94d'; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(-50, -136); x.quadraticCurveTo(-50, -152, -40, -152); x.quadraticCurveTo(-30, -152, -30, -136); x.closePath(); x.fill(); x.stroke();
  // chassis + wheels
  x.fillStyle = INK; x.fillRect(-110, -14, 236, 12);
  [-66, 52, 96].forEach(wx => { circ(wx, 4, 22, INK); circ(wx, 4, 11, '#dfe7ef');
    x.save(); x.translate(wx, 4); x.rotate(-(o.roll || 0)); x.strokeStyle = INK; x.lineWidth = 3;
    for (let i = 0; i < 3; i++) { x.rotate(Math.PI * 2 / 3); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 10); x.stroke(); } x.restore(); });
  // plough arm + blade in front (orange with white stripes)
  x.fillStyle = '#5c6370'; x.strokeStyle = INK; x.lineWidth = 3; rr(-124, -30, 22, 12, 3); x.fill(); x.stroke();
  x.save(); x.beginPath(); x.moveTo(-156, -64); x.quadraticCurveTo(-138, -22, -152, 24); x.lineTo(-122, 24); x.quadraticCurveTo(-110, -18, -124, -64); x.closePath();
  x.fillStyle = OR; x.fill(); x.clip();
  x.fillStyle = '#fff4e6'; for (let i = -3; i < 6; i++) { x.beginPath(); x.moveTo(-160, -40 + i * 18); x.lineTo(-110, -60 + i * 18); x.lineTo(-110, -52 + i * 18); x.lineTo(-160, -32 + i * 18); x.closePath(); x.fill(); }
  x.restore();
  x.strokeStyle = INK; x.lineWidth = 3.5; x.beginPath(); x.moveTo(-156, -64); x.quadraticCurveTo(-138, -22, -152, 24); x.lineTo(-122, 24); x.quadraticCurveTo(-110, -18, -124, -64); x.closePath(); x.stroke();
  x.restore();
}
function flake(cx, cy, r, rot, col) {
  x.save(); x.translate(cx, cy); x.rotate(rot); x.strokeStyle = col; x.lineWidth = 3.2; x.lineCap = 'round';
  for (let i = 0; i < 6; i++) { x.rotate(Math.PI / 3); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -r); x.moveTo(0, -r * .55); x.lineTo(-r * .3, -r * .8); x.moveTo(0, -r * .55); x.lineTo(r * .3, -r * .8); x.stroke(); }
  x.restore();
}
// snow spray at the blade while pushing
function spray(bx, t, k) {
  if (k <= 0) return;
  for (let i = 0; i < 10; i++) { const a = (t * 2.2 + i / 10) % 1, px = bx - 6 - a * 40 - hash(i) * 14, py = SGY + 6 - Math.sin(a * Math.PI) * (30 + hash(i + 2) * 26);
    circ(px, py, 3 + hash(i + 5) * 3, `rgba(255,255,255,${k * (1 - a)})`); }
}

// ---------- Toet with spinning wheels in the snow ----------
const spinWin = [16.0, 18.8];
function spinPuffs(t, bx, k) {
  if (k <= 0) return;
  for (let i = 0; i < 14; i++) { const a = (t * 3 + i / 14) % 1, px = bx - 40 - a * 70, py = SGY + 20 - Math.sin(a * Math.PI) * (26 + hash(i) * 30);
    circ(px, py, 3 + hash(i + 3) * 4, `rgba(255,255,255,${k * (1 - a)})`); }
}

// ---------- Sami's path in the plowing shot ----------
const P0 = 2.6, PER = 5.6;                                     // first push starts at P0, one drift every PER s
const pushRx = k => HX[4 - k] + 154 * SS + 10;                  // rx where the blade meets drift k (k = 0: right-most)
const throwT = k => P0 + k * PER + 1.4;                        // the drift flies at this time
function samiPlowRx(u) {
  let rx = R_IN;
  for (let k = 0; k < 5; k++) { const s = P0 + k * PER; if (u >= s) rx = lerp(k ? pushRx(k - 1) : R_IN, pushRx(k), ease(clamp((u - s) / 1.4))); }
  return rx;
}
// drift k state at u (in the plowing shot): 'road', flying (0..1), 'side'
const FLY = 1.1;
function driftState(k, u) { const a = throwT(k); return u < a ? -1 : u < a + FLY ? (u - a) / FLY : 2; }
function drawSidePiles(nSide, u, o = {}) { for (let i = 0; i < 5; i++) { const k = 4 - i; if (k < nSide) mound(VX[i], VY, 34, o.pop ? 1 + Math.max(0, .25 * Math.sin(clamp((u - o.pop[k]) / .35) * Math.PI)) : 1); } }
function flyingDrift(k, p) {
  const i = 4 - k, e = ease(p), px = lerp(HX[i], VX[i], e), py = lerp(SGY + 26, VY, e) - Math.sin(p * Math.PI) * 120;
  mound(px, py, lerp(40, 34, e), 1); x.save(); x.globalAlpha = 1 - p;
  for (let j = 0; j < 6; j++) circ(px + Math.cos(j) * 30 * p, py - 10 + Math.sin(j * 2) * 18 * p, 3, '#fff'); x.restore();
}

// parked scene: Toet stopped in front of the drifts
const parked = (draw) => drive({ segs: [[0, 0], [60, 0]], dist0: STOP, bx: BX, noLeaves: true, snow: 1,
  truck: (u, c) => Object.assign({ happy: true }, draw.truck ? draw.truck(u, c) : {}),
  behind: (u, c) => draw.behind && draw.behind(u, c),
  onRoad: (u, c) => { roadSnow(0, draw.clear ? draw.clear(u, c) : W + 10); draw.road && draw.road(u, c); },
  beforeTruck: (u, c) => draw.before && draw.before(u, c),
  front: (u, c) => { draw.front && draw.front(u, c); snowfall(c.t, 60, .85); } });
const sTalk = c => c.talk('sami');
const countBig = (k, a, b) => NOTB([[String(k + 1), a, b, 480, 72, 84, NCOL[k]], [WORDS[k], a + .2, b, 480, 138, 46, NCOL[k]]]);

St.episode({
  title: ["Toet's Helper Friends", 60], sub: 'Sami the Snowplow', accent: BLUE2,
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'snowplow', shift: 0 },
  thumb: ['Sami the Snowplow', 'Count the snow piles!'],
  shots: [
    // 0 – first snow: Toet drives through the white world, finds the drifts on the road, his wheels spin – he is stuck
    { d: 26, draw: drive({ segs: [[0, 150], [4, 150], [7, 0], [60, 0]], bx: BX, noLeaves: true, snow: 1,
        truck: (u, c) => { const sp = win(u, spinWin[0], spinWin[1], .3); return { happy: u < 12 || u > 23, moving: sp > 0, dist: c.dist + (u > spinWin[0] ? clamp(u - spinWin[0], 0, spinWin[1] - spinWin[0]) * 260 : 0) }; },
        onRoad: (u, c) => { roadSnow(0, W + 10); const sh = c.dist - STOP; HX.forEach(h => mound(h - sh, SGY + 26, 40)); },
        beforeTruck: (u, c) => spinPuffs(c.t, c.bx, win(u, spinWin[0], spinWin[1], .3)),
        front: (u, c) => snowfall(c.t, 70, .9) }),
      says: [['toet', "Hi! I'm Little Truck Toet!", 5.0, 8.2, ...TB], ['toet', 'Look! It is snowing!', 8.6, 11.8, ...TB],
             ['toet', 'Oh no! Snow on the road!', 12.2, 15.4, ...TB], ['toet', "I'm stuck! Who can help?", 19.4, 23.0, ...TB]],
      sfx: [[2, 'honk', .6], [8.8, 'twinkle:E6', .3], [12.4, 'sad', .3], [16.0, 'whirr', .45, -.3]] },

    // 1 – Sami the Snowplow arrives from the right, plowing her way in (road behind her is clear)
    { d: 21, draw: parked({
        clear: (u, c) => bladeX(c.rx ?? R_IN) + 4,
        road: (u, c) => HX.forEach(h => mound(h, SGY + 26, 40)),
        before: (u, c) => { const k = ease(clamp((u - .5) / 4.5)), rx = lerp(1180, R_IN, k); c.rx = rx;
          sami(rx, SGY, c.t, { mouth: sTalk(c), roll: (rx - R_IN) / 22, moving: u < 5 }); spray(bladeX(rx), c.t, u < 5 ? 1 : 0); } }),
      says: [['sami', "Hello! I'm Sami the Snowplow!", 5.4, 9.0, ...SB, 26], ['toet', 'Sami, can you push the snow?', 9.4, 12.8, ...TB],
             ['sami', "Yes! Let's count the snow piles!", 13.2, 16.8, ...SB, 26], ['toet', 'Hooray!', 17.2, 19.6, ...TB]],
      sfx: [[.5, 'scrape', .3, .7], [4.8, 'psss', .25, .4], [13.4, 'chime:G5', .3], [17.4, 'honk', .35]] },

    // 2 – plowing: Sami throws the five drifts onto the roadside one by one – count 1 to 5
    { d: 34, draw: parked({
        clear: (u, c) => bladeX(samiPlowRx(u)) + 4,
        behind: (u, c) => { let n = 0; for (let k = 0; k < 5; k++) if (driftState(k, u) >= 2) n = k + 1;
          drawSidePiles(n, u, { pop: [0, 1, 2, 3, 4].map(k => throwT(k) + FLY) }); },
        road: (u, c) => { for (let k = 0; k < 5; k++) if (driftState(k, u) < 0) mound(HX[4 - k], SGY + 26, 40); },
        before: (u, c) => { const rx = samiPlowRx(u); c.rx = rx; let mv = false;
          for (let k = 0; k < 5; k++) { const s = P0 + k * PER; if (u > s && u < s + 1.4) mv = true; }
          sami(rx, SGY, c.t, { mouth: sTalk(c), roll: (rx - R_IN) / 22, moving: mv }); spray(bladeX(rx), c.t, mv ? 1 : 0);
          for (let k = 0; k < 5; k++) { const p = driftState(k, u); if (p >= 0 && p < 1) flyingDrift(k, p); } } }),
      says: [['sami', 'Here we go! Push!', .3, 2.4, ...SB]],
      big: [0, 1, 2, 3, 4].flatMap(k => countBig(k, throwT(k) + FLY, k < 4 ? throwT(k + 1) - .2 : 33.6)),
      sfx: [0, 1, 2, 3, 4].flatMap(k => [[P0 + k * PER, 'scrape', .3, .3], [throwT(k), 'puf', .4, 0], [throwT(k) + FLY, `chime:${['C6', 'D6', 'E6', 'F6', 'G6'][k]}`, .5]]) },

    // 3 – recap: Sami backs up (beep, beep), numbers 1–5 over the piles, "Five snow piles!", thank you
    { d: 26, draw: parked({
        clear: () => bladeX(pushRx(4)) + 4,
        behind: (u, c) => { drawSidePiles(5, u, { pop: [0, 1, 2, 3, 4].map(k => 5.0 + (4 - k) * 1.1) });
          for (let i = 0; i < 5; i++) C.bigText(String(i + 1), VX[i], 372, clamp((u - 5.0 - i * 1.1) / .4) * clamp((25.2 - u) / .5), 40, NCOL[i]); },
        before: (u, c) => { const k = ease(clamp((u - .6) / 4.0)), rx = lerp(pushRx(4), R_IN, k); c.rx = rx;
          sami(rx, SGY, c.t, { mouth: sTalk(c), roll: (rx - R_IN) / 22, moving: u > .6 && u < 4.6, look: 0 }); } }),
      big: NOTB([['Five snow piles!', 11.0, 15.2, 480, 90, 56, '#1c7ed6']]),
      says: [['toet', 'The road is clear!', 15.6, 18.6, ...TB], ['toet', 'Thank you, Sami!', 19.0, 21.8, ...TB],
             ['sami', "You're welcome! Beep beep!", 22.2, 25.4, ...SB, 26]],
      sfx: [[.7, 'beep', .3, .5], [1.6, 'beep', .3, .5], [2.5, 'beep', .3, .5], [3.4, 'beep', .3, .5],
            ...[0, 1, 2, 3, 4].map(i => [5.0 + i * 1.1, `chime:${['C6', 'D6', 'E6', 'F6', 'G6'][i]}`, .45]), [11.0, 'tada', .35], [22.4, 'honk', .3]] },

    // 4 – Toet drives on along the clear road, snow banks, a little snowman waves
    { d: 20, draw: drive({ segs: [[0, 0], [2, 150], [60, 150]], dist0: STOP, bx: BX, noLeaves: true, snow: 1,
        behind: (u, c) => { banks(c.dist); const sx = 1500 - (c.dist - STOP) * .99; if (sx > -80 && sx < W + 80) snowman(sx, VY, c.t); },
        front: (u, c) => snowfall(c.t, 50, .8) }),
      says: [['toet', 'Hooray! Let\'s drive!', 2.4, 5.6, ...TB], ['toet', 'One, two, three, four, five!', 6.2, 9.6, ...TB]],
      sfx: [[2.2, 'honk', .5], [11.2, 'twinkle:G6', .3]] },
  ],
});

// a little snowman by the road (waving twig arm)
function snowman(cx, gy, t) {
  mound(cx, gy + 2, 26);
  circ(cx, gy - 24, 22, '#fbfdff', '#9fb6cf', 2.5); circ(cx, gy - 58, 16, '#fbfdff', '#9fb6cf', 2.5);
  x.fillStyle = '#e63946'; rr(cx - 17, gy - 46, 34, 7, 3); x.fill(); x.fillRect(cx + 6, gy - 44, 7, 16);
  x.fillStyle = INK; rr(cx - 12, gy - 82, 24, 10, 2); x.fill(); x.fillRect(cx - 17, gy - 73, 34, 4);
  circ(cx - 5, gy - 61, 2.2, INK); circ(cx + 5, gy - 61, 2.2, INK);
  x.fillStyle = OR; x.beginPath(); x.moveTo(cx, gy - 57); x.lineTo(cx - 13, gy - 54); x.lineTo(cx, gy - 53); x.closePath(); x.fill();
  x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.arc(cx, gy - 54, 6, .3, Math.PI - .3); x.stroke();
  [-10, 0, 10].forEach(d => circ(cx, gy - 30 + d, 2.4, INK));
  const w = Math.sin(t * 4) * .35; x.strokeStyle = '#7a5134'; x.lineWidth = 3; x.lineCap = 'round';
  x.beginPath(); x.moveTo(cx - 18, gy - 30); x.lineTo(cx - 40, gy - 50 + w * 10); x.stroke();
  x.save(); x.translate(cx + 18, gy - 30); x.rotate(-.9 + w); x.beginPath(); x.moveTo(0, 0); x.lineTo(24, 0); x.moveTo(16, 0); x.lineTo(22, -6); x.stroke(); x.restore();
}
