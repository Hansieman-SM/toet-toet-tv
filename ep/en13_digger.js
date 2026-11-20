// Little Truck Toet – Toet's Helper Friends: Dottie the Digger (English story episode, approved "Helper Friends" idea).
// Toet finds a little tree (root ball in a burlap sack) next to a sign "A new tree for the park!" – but Toet can't dig. Dottie the Digger
// (new character, original design: yellow digger on tracks with a two-part arm and a bucket) helps. Learning moment: FIRST, THEN, LAST
// (sequencing) + counting 1-2-3 scoops. FIRST we dig (three scoops onto a dirt pile), THEN we plant (Dottie gently lifts the tree into the
// hole and pushes the soil back), LAST we water (a smiling rain cloud comes by; the tree grows and blossoms; a bird lands).
// Recap of the three steps, Dottie drives off. New music: digger_long (mandolin folk stomp).
const C = require('../lib/common'), T = require('../lib/toet');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, circ, ell, rr, hash, INK } = C;
const { drive } = St;
const BX = 60, GY = 432;
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 185];
const M1 = T.motion([[0, 150], [4, 150], [7, 0]]), STOP = M1.distAt(7);
const RX = 820, RGY = T.ROAD + 20;                  // Dottie parked (screen x, road contact line)
const DB = [830, 214];                              // Dottie's speech bubble
const HX = 555, PX = 660, POTX = 472;               // hole, dirt pile, waiting tree
const PIV = [RX - 60, RGY - 64];                    // arm pivot on Dottie's deck
const L1 = 180, L2 = 152;
const blinkAt = (t, off = 0) => (t + off) % 4.0 > 3.85;
const YEL = '#ffb703', YEL2 = '#f59f00', SOIL = '#8d5a34', SOIL2 = '#6b4226';
const cheeks = (cx, cy, r) => { x.fillStyle = 'rgba(255,110,120,.45)'; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); };

// ---------- piecewise arm path: keys [[u, wx, wy, bucket, load]] ----------
function path(keys, u) {
  if (u <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) if (u < keys[i][0]) {
    const a = keys[i - 1], b = keys[i], k = ease((u - a[0]) / (b[0] - a[0]));
    return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), lerp(a[3], b[3], k), b[4] > a[4] ? (k > .6 ? b[4] : a[4]) : (k > .4 ? b[4] : a[4])];
  }
  return keys[keys.length - 1].slice(1);
}
const REST = [690, 330, .9, 0];
// one scoop starting at s: above hole → into hole → curl (load) → lift → above pile → dump → back up
const scoop = s => [[s, 548, 346, -.2, 0], [s + .8, 548, 388, -.3, 0], [s + 1.4, 548, 384, 1.0, 1], [s + 2.0, 552, 334, 1.0, 1],
  [s + 2.8, PX + 8, 322, 1.0, 1], [s + 3.3, PX + 8, 326, -1.5, 0], [s + 3.9, PX - 10, 330, -.6, 0]];
const SC = [2.2, 6.6, 11.0];                        // scoop starts in shot 2
const DUMP = SC.map(s => s + 3.15);

// ---------- Dottie the Digger (original design, faces left). origin = road contact under the middle ----------
function digger(px, gy, t, o = {}) {
  x.save(); x.translate(px, gy + (o.moving ? Math.sin(t * 14) * 1.2 : 0));
  x.fillStyle = 'rgba(0,0,0,.18)'; x.beginPath(); x.ellipse(0, 22, 140, 10, 0, 0, 7); x.fill();
  // tracks
  x.fillStyle = '#3d4450'; x.strokeStyle = INK; x.lineWidth = 4; rr(-118, -30, 236, 44, 22); x.fill(); x.stroke();
  const r = -(o.roll || 0);
  x.fillStyle = '#5c6370'; for (let i = 0; i < 18; i++) { const p = ((i * 26 + r * 22) % 468 + 468) % 468;   // tread blocks running around
    if (p < 196) x.fillRect(-98 + p, -34, 12, 6); else if (p >= 234 && p < 430) x.fillRect(98 - (p - 234), 10, 12, 6); }
  [-88, -44, 0, 44, 88].forEach(wx => { x.save(); x.translate(wx, -8); circ(0, 0, 13, '#9aa3ad', INK, 3); x.rotate(r); x.strokeStyle = INK; x.lineWidth = 3;
    x.beginPath(); x.moveTo(-7, 0); x.lineTo(7, 0); x.moveTo(0, -7); x.lineTo(0, 7); x.stroke(); x.restore(); });
  // deck + engine
  x.fillStyle = YEL; x.strokeStyle = INK; x.lineWidth = 4; rr(-104, -60, 216, 32, 9); x.fill(); x.stroke();
  x.fillStyle = INK; x.font = C.FONT(20); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('DOTTIE', 40, -43);
  x.fillStyle = YEL2; rr(62, -112, 48, 54, 10); x.fill(); x.stroke();
  x.strokeStyle = INK; x.lineWidth = 2.5; [-100, -90, -80].forEach(b => { x.beginPath(); x.moveTo(72, b); x.lineTo(100, b); x.stroke(); });
  // cab
  x.fillStyle = YEL; x.lineWidth = 4; rr(-36, -160, 96, 102, 14); x.fill(); x.stroke();
  x.fillStyle = '#d8f3ff'; x.lineWidth = 3; rr(-26, -150, 64, 44, 9); x.fill(); x.stroke();
  x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 4; x.beginPath(); x.moveTo(-14, -112); x.lineTo(2, -144); x.stroke();
  // little orange beacon (gentle glow while driving)
  const on = o.moving && Math.sin(t * 6) > 0;
  x.fillStyle = on ? '#ff7b00' : '#ffa94d'; x.strokeStyle = INK; x.lineWidth = 3; rr(30, -174, 18, 14, 5); x.fill(); x.stroke();
  if (on) circ(39, -167, 15, 'rgba(255,140,0,.35)');
  // face (below the window)
  const lk = o.look || 0;
  if (blinkAt(t, .9)) { x.fillStyle = INK; x.fillRect(-20, -88, 12, 3); x.fillRect(4, -88, 12, 3); }
  else { [-14, 10].forEach(ex => { circ(ex + lk, -86, 6.5, INK); circ(ex + lk - 2, -88, 2.2, '#fff'); });
    x.strokeStyle = INK; x.lineWidth = 2.5; x.lineCap = 'round'; [-14, 10].forEach(ex => { x.beginPath(); x.arc(ex, -95, 9, Math.PI + .7, -.7); x.stroke(); }); }
  const m = o.mouth || 0;
  x.strokeStyle = INK; x.lineWidth = 3;
  if (m > .05) { x.fillStyle = INK; x.beginPath(); x.ellipse(-2, -70, 7, 3 + m * 5, 0, 0, 7); x.fill(); }
  else { x.beginPath(); x.arc(-2, -78, 10, .35, Math.PI - .35); x.stroke(); }
  cheeks(-28, -74, 5); cheeks(24, -74, 5);
  x.restore();
}
// arm: IK from the pivot to the wrist (elbow up), bucket rotation b (0 = open, + = curled, - = dumping)
function arm(px, wx, wy, b, load, o = {}) {
  const P0 = [PIV[0] + (px - RX), PIV[1]];
  let dx = wx - P0[0], dy = wy - P0[1], d = Math.hypot(dx, dy);
  d = clamp(d, Math.abs(L1 - L2) + 2, L1 + L2 - 2);
  const th = Math.atan2(dy, dx), a = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  const e1 = [P0[0] + Math.cos(th + a) * L1, P0[1] + Math.sin(th + a) * L1], e2 = [P0[0] + Math.cos(th - a) * L1, P0[1] + Math.sin(th - a) * L1];
  const E = e1[1] < e2[1] ? e1 : e2, Wr = [P0[0] + Math.cos(th) * d, P0[1] + Math.sin(th) * d];
  const seg = (A, B, w) => { x.lineCap = 'round'; x.strokeStyle = INK; x.lineWidth = w + 8; x.beginPath(); x.moveTo(...A); x.lineTo(...B); x.stroke();
    x.strokeStyle = YEL; x.lineWidth = w; x.beginPath(); x.moveTo(...A); x.lineTo(...B); x.stroke(); };
  seg(P0, E, 22);
  // hydraulic cylinder along the boom
  const mA = [lerp(P0[0], E[0], .15), lerp(P0[1], E[1], .15) + 14], mB = [lerp(P0[0], E[0], .7), lerp(P0[1], E[1], .7) + 12];
  x.strokeStyle = INK; x.lineWidth = 9; x.beginPath(); x.moveTo(...mA); x.lineTo(...mB); x.stroke(); x.strokeStyle = '#cfd6dd'; x.lineWidth = 4; x.beginPath(); x.moveTo(...mA); x.lineTo(...mB); x.stroke();
  seg(E, Wr, 16);
  circ(...P0, 9, '#5c6370', INK, 3); circ(...E, 8, '#5c6370', INK, 3);
  // bucket (teeth point down-left when open)
  x.save(); x.translate(...Wr); x.rotate(b);
  if (load > 0) { x.fillStyle = SOIL; x.beginPath(); x.ellipse(-16, 6, 24, 12, 0, 0, 7); x.fill(); circ(-24, 2, 4, SOIL2); circ(-8, 4, 3, SOIL2); }
  x.fillStyle = '#5c6370'; x.strokeStyle = INK; x.lineWidth = 3.5;
  x.beginPath(); x.moveTo(6, -6); x.lineTo(-36, 2); x.quadraticCurveTo(-40, 28, -30, 40); x.lineTo(-4, 40); x.quadraticCurveTo(10, 22, 6, -6); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = '#cfd6dd'; [-30, -20, -10].forEach(tx => { x.beginPath(); x.moveTo(tx - 4, 40); x.lineTo(tx, 50); x.lineTo(tx + 4, 40); x.closePath(); x.fill(); x.lineWidth = 2; x.stroke(); });
  x.restore();
  circ(...Wr, 6, '#5c6370', INK, 2.5);
  return Wr;
}

// ---------- the little tree: base at (cx, gy). ball = root ball shown, grow ≥ 1, bloom 0..1 ----------
function tree(cx, gy, t, o = {}) {
  const s = o.grow || 1, sw = Math.sin(t * 1.3 + cx) * 1.5;
  x.save(); x.translate(cx, gy);
  if (o.ball) { ell(0, -2, 22, 18, '#d9b382', INK, 3); x.strokeStyle = '#a57c4f'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(-20, -8); x.quadraticCurveTo(0, -2, 20, -8); x.stroke();
    x.beginPath(); x.moveTo(-6, -18); x.lineTo(-4, 15); x.moveTo(8, -18); x.lineTo(9, 15); x.stroke(); }
  const top = -18 - 54 * s;
  x.fillStyle = '#8a5a36'; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(-6, -14); x.lineTo(-4 + sw * .3, top + 10); x.lineTo(4 + sw * .3, top + 10); x.lineTo(6, -14); x.closePath(); x.fill(); x.stroke();
  [['#3e9a52', 4], ['#5cbf6a', 0]].forEach(([col, g]) => { x.fillStyle = col; x.beginPath();
    [[-20, 4, 22], [20, 4, 22], [0, -14, 26], [0, 10, 20]].forEach(([a, b, r]) => { const R = r * s + g, X0 = a * s + sw, Y0 = top + b * s; x.moveTo(X0 + R, Y0); x.arc(X0, Y0, R, 0, 7); }); x.fill(); });
  const bl = o.bloom || 0;
  [[-26, 0], [18, -10], [2, -30], [-8, 14], [26, 10], [-18, -20], [12, 18]].forEach(([a, b], i) => {
    const k = clamp(bl * 7 - i); if (k <= 0) return;
    const X0 = a * s + sw, Y0 = top + b * s, rr0 = 5.5 * ease(k);
    for (let p = 0; p < 5; p++) { const an = p / 5 * Math.PI * 2; circ(X0 + Math.cos(an) * rr0, Y0 + Math.sin(an) * rr0, rr0 * .75, '#ffafcc'); }
    circ(X0, Y0, rr0 * .55, '#ffd23f');
  });
  // little face on the crown
  const fy = top + 4 * s;
  if (blinkAt(t, 2.1)) { x.fillStyle = INK; x.fillRect(-11 + sw, fy - 2, 7, 2.5); x.fillRect(4 + sw, fy - 2, 7, 2.5); }
  else { circ(-7 + sw, fy, 3.6, INK); circ(7 + sw, fy, 3.6, INK); circ(-6 + sw, fy - 1.3, 1.2, '#fff'); circ(8 + sw, fy - 1.3, 1.2, '#fff'); }
  x.strokeStyle = INK; x.lineWidth = 2.2; x.beginPath(); if (o.sad) x.arc(sw, fy + 13, 5, Math.PI + .5, -.5); else x.arc(sw, fy + 4, 6, .4, Math.PI - .4); x.stroke();
  x.restore();
}
// hole (k: 0..1 dug), fill (0..1 filled back), mound after planting
function hole(k, fill) {
  if (k <= 0) return;
  const rx = 12 + 34 * k, ry = 3 + 8 * k;
  ell(HX, GY - 2, rx + 6, ry + 3, SOIL);
  if (fill < 1) ell(HX, GY - 1, rx * (1 - fill * .9), ry * (1 - fill * .9), '#3b2414');
  if (fill > 0) { x.save(); x.globalAlpha = fill; ell(HX, GY - 4, 30, 7, SOIL); circ(HX - 12, GY - 6, 3, SOIL2); circ(HX + 14, GY - 4, 2.5, SOIL2); x.restore(); }
}
function pile(k) {
  if (k <= 0) return;
  const w = 18 + 28 * k, h = 6 + 26 * k;
  x.fillStyle = SOIL; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(PX - w, GY + 4); x.quadraticCurveTo(PX - w * .5, GY - h, PX, GY - h); x.quadraticCurveTo(PX + w * .5, GY - h, PX + w, GY + 4); x.closePath(); x.fill(); x.stroke();
  [[-.4, .4], [.1, .7], [.35, .3], [-.1, .2]].forEach(([a, b]) => circ(PX + a * w, GY + 2 - b * h, 2.5 + k, SOIL2));
}
function sign(px, t) {
  x.fillStyle = '#8a5a36'; x.strokeStyle = INK; x.lineWidth = 3; x.fillRect(px - 4, GY - 66, 8, 66); x.strokeRect(px - 4, GY - 66, 8, 66);
  x.fillStyle = '#fffaf0'; rr(px - 62, GY - 112, 124, 52, 10); x.fill(); x.stroke();
  x.fillStyle = '#2f8a46'; x.font = C.FONT(19); x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText('A new tree', px, GY - 97); x.fillText('for the park!', px, GY - 75);
}
// smiling rain cloud
function rainCloud(cx, cy, t, rain) {
  if (rain > 0) { x.save(); x.globalAlpha = rain; x.strokeStyle = '#5fa8e8'; x.lineWidth = 4; x.lineCap = 'round';
    for (let i = 0; i < 14; i++) { const k = (t * 1.6 + hash(i) ) % 1, dx = -70 + (i / 13) * 140, yy = cy + 30 + k * (GY - cy - 40);
      x.beginPath(); x.moveTo(cx + dx, yy); x.lineTo(cx + dx - 3, yy + 14); x.stroke(); } x.restore(); }
  x.save(); x.translate(cx, cy);
  x.fillStyle = '#eef3fa'; x.strokeStyle = INK; x.lineWidth = 3.5; x.beginPath();
  [[-56, 8, 30], [-22, -12, 38], [22, -14, 36], [56, 6, 30], [0, 14, 34]].forEach(([a, b, r]) => { x.moveTo(a + r, b); x.arc(a, b, r, 0, 7); }); x.fill();
  x.beginPath(); [[-56, 8, 30], [-22, -12, 38], [22, -14, 36], [56, 6, 30]].forEach(([a, b, r]) => { x.moveTo(a + r, b); x.arc(a, b, r, 0, 7); }); x.stroke();
  x.fillStyle = '#eef3fa'; x.fillRect(-60, 2, 120, 30);
  x.beginPath(); x.moveTo(-86, 14); x.quadraticCurveTo(-80, 40, -50, 36); x.lineTo(50, 36); x.quadraticCurveTo(82, 38, 86, 12); x.stroke();
  if (blinkAt(t, 1.7)) { x.fillStyle = INK; x.fillRect(-22, 2, 12, 3); x.fillRect(10, 2, 12, 3); }
  else { circ(-16, 4, 5.5, INK); circ(16, 4, 5.5, INK); circ(-14, 2, 1.8, '#fff'); circ(18, 2, 1.8, '#fff'); }
  x.strokeStyle = INK; x.lineWidth = 2.6; x.beginPath(); x.arc(0, 12, 9, .35, Math.PI - .35); x.stroke();
  cheeks(-30, 14, 5); cheeks(30, 14, 5);
  x.restore();
}
// little blue bird
function bird(bx, by, t, fly) {
  x.save(); x.translate(bx, by);
  const f = fly ? Math.sin(t * 22) * .8 : 0;
  ell(0, 0, 14, 11, '#4dabf7', INK, 2.5);
  x.save(); x.translate(2, -2); x.rotate(-.3 - f); ell(6, 0, 10, 5, '#339af0', INK, 2); x.restore();
  circ(-10, -8, 8, '#4dabf7', INK, 2.5); circ(-12, -10, 2, INK);
  x.fillStyle = '#ffa94d'; x.beginPath(); x.moveTo(-17, -9); x.lineTo(-25, -6); x.lineTo(-17, -5); x.closePath(); x.fill();
  x.restore();
}

// recap: FIRST dig / THEN plant / LAST water
function recap(u, a, end, t) {
  [['FIRST', 'dig', '#e8590c'], ['THEN', 'plant', '#2f9e44'], ['LAST', 'water', '#1c7ed6']].forEach(([w, v, col], i) => {
    const k = clamp((u - a - i * 2.4) / .5) * clamp((end - u) / .8); if (k <= 0) return;
    const cx = 220 + i * 260;
    x.save(); x.globalAlpha = k; x.fillStyle = 'rgba(255,255,255,.92)'; x.strokeStyle = INK; x.lineWidth = 3; rr(cx - 105, 102, 210, 160, 18); x.fill(); x.stroke();
    x.save(); x.translate(cx, 214); x.scale(.95, .95);
    if (i === 0) { ell(-12, 0, 44, 11, SOIL); ell(-12, 1, 36, 8, '#3b2414');
      x.fillStyle = SOIL; x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.moveTo(30, 6); x.quadraticCurveTo(48, -34, 64, 6); x.closePath(); x.fill(); x.stroke();
      x.save(); x.translate(-6, -60); x.rotate(-.5 + Math.sin(t * 3) * .15); x.fillStyle = '#5c6370'; x.strokeStyle = INK; x.lineWidth = 3;
      x.beginPath(); x.moveTo(6, -6); x.lineTo(-30, 2); x.quadraticCurveTo(-34, 24, -26, 34); x.lineTo(-4, 34); x.quadraticCurveTo(10, 18, 6, -6); x.closePath(); x.fill(); x.stroke();
      x.strokeStyle = INK; x.lineWidth = 16; x.beginPath(); x.moveTo(4, -2); x.lineTo(40, -26); x.stroke(); x.strokeStyle = YEL; x.lineWidth = 10; x.beginPath(); x.moveTo(4, -2); x.lineTo(40, -26); x.stroke(); x.restore(); }
    if (i === 1) { x.translate(-HX, -GY); x.save(); x.translate(HX, GY); ell(0, -2, 34, 8, SOIL); x.restore(); tree(HX, GY - 2, t, { grow: .9 }); }
    if (i === 2) { x.translate(0, -8); x.scale(.62, .62); rainCloud(0, -70, t, 0);
      x.strokeStyle = '#5fa8e8'; x.lineWidth = 6; x.lineCap = 'round'; for (let j = 0; j < 5; j++) { const kk = (t * 1.4 + j * .37) % 1, dx = -60 + j * 30; x.beginPath(); x.moveTo(dx, -26 + kk * 60); x.lineTo(dx - 4, -6 + kk * 60); x.stroke(); } }
    x.restore();
    x.restore();
    C.bigText(w, cx, 70, k, 44, col);
    x.save(); x.globalAlpha = k; x.font = C.FONT(34); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = INK; x.fillText(v, cx, 240); x.restore();
  });
  C.bigText('First, then, last!', 480, 290, win(u, a + 6.4, end, .4), 42, '#ffd23f');
}

// parked scene for the middle shots
const parked = (draw) => drive({ segs: [[0, 0], [60, 0]], dist0: STOP, bx: BX, noLeaves: true,
  truck: u => ({ happy: true }),
  behind: (u, c) => { sign(352, c.t); draw.behind && draw.behind(u, c); },
  beforeTruck: (u, c) => draw.before && draw.before(u, c),
  front: (u, c) => draw.front && draw.front(u, c) });
const dTalk = c => c.talk('dottie');
const k3 = u => clamp(DUMP.filter(d => u >= d).length / 3 + 0);   // scoops done (for hole / pile size)
const ARR = [[0, 690, 330, .9, 0]];

St.episode({
  title: ["Toet's Helper Friends", 60], sub: 'Dottie the Digger', accent: YEL2,
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'digger', shift: 0 },
  thumb: ['Dottie the Digger', 'Dig, plant, water!'],
  shots: [
    // 0 – Toet drives into the park and finds a little tree with a sign – but he can't dig
    { d: 26, draw: drive({ segs: [[0, 150], [4, 150], [7, 0], [60, 0]], bx: BX,
        truck: u => ({ happy: u < 15 || u > 21 }),
        behind: (u, c) => { x.save(); x.translate(-(c.dist - STOP), 0); x.save(); x.globalAlpha = clamp((860 - (352 - (c.dist - STOP))) / 80); sign(352, c.t); x.restore();
          tree(POTX, GY, c.t, { ball: true, sad: u > 9 && u < 22 }); x.restore(); } }),
      says: [['toet', "Hi! I'm Little Truck Toet!", 5.2, 8.4, ...TB], ['toet', 'Look! A little tree!', 8.8, 11.8, ...TB],
             ['toet', 'It needs a new home in the park.', 12.2, 15.6, ...TB], ['toet', "But I can't dig a hole!", 16.0, 19.2, ...TB],
             ['toet', 'Who can help?', 19.6, 22.6, ...TB]],
      sfx: [[2, 'honk', .6], [9.0, 'twinkle:E6', .3], [16.4, 'sad', .3]] },

    // 1 – Dottie the Digger rolls in on her tracks
    { d: 20, draw: parked({
        behind: (u, c) => tree(POTX, GY, c.t, { ball: true, sad: u < 16 }),
        before: (u, c) => { const k = ease(clamp((u - .5) / 4.5)), rx = lerp(1200, RX, k);
          digger(rx, RGY, c.t, { mouth: dTalk(c), roll: (rx - RX) / 22, moving: u < 5 });
          arm(rx, 690 + (rx - RX), 330, .9, 0); } }),
      says: [['dottie', "Hello! I'm Dottie the Digger!", 5.4, 9.0, ...DB, 26], ['toet', 'Dottie, can you dig a hole?', 9.4, 12.8, ...TB],
             ['dottie', "Yes! Let's count my scoops!", 13.2, 16.8, ...DB], ['toet', 'Hooray!', 17.0, 19.4, ...TB]],
      sfx: [[.4, 'bump', .3, .7], [1.4, 'bump', .25, .7], [2.4, 'bump', .25, .6], [4.6, 'psss', .3, .4], [13.4, 'chime:A5', .3]] },

    // 2 – FIRST we dig: three scoops onto the dirt pile (count 1-2-3)
    { d: 21, draw: parked({
        behind: (u, c) => { tree(POTX, GY, c.t, { ball: true }); hole(clamp((u - SC[0] - 1) / 2) * .34 + k3(u) * .66, 0); pile(k3(u)); },
        before: (u, c) => { digger(RX, RGY, c.t, { mouth: dTalk(c), look: -1 });
          const [wx, wy, b, ld] = path([[0, ...REST], ...SC.flatMap(scoop), [17, ...REST]], u);
          arm(RX, wx, wy, b, ld);
          DUMP.forEach(d => { if (u > d && u < d + .9) { const kk = (u - d) / .9;
            for (let i = 0; i < 6; i++) circ(PX - 10 + Math.cos(i * 2.1) * 14 * kk, 340 + kk * kk * 70 + i * 3, 4 * (1 - kk) + 2, SOIL); } }); } }),
      says: [['dottie', 'First, we dig!', .4, 2.2, ...DB], ['toet', 'Three scoops! A big hole!', 16.4, 19.8, ...TB]],
      big: [...(process.env.THUMBBG ? [] : [['FIRST: dig!', .4, 20.4, 480, 64, 54, '#e8590c']]), ...DUMP.map((d, i) => [String(i + 1), d, d + 1.8, 400, 170, 110, ['#e63946', '#ff9f1c', '#2fb35a'][i]])],
      sfx: [...SC.flatMap((s, i) => [[s, 'clank', .25, .5], [s + 1.0, 'rustle:0.6', .3, .1], [s + 3.15, 'rustle:0.8', .35, .3], [s + 3.25, `chime:${['C6', 'D6', 'E6'][i]}`, .55]]), [16.4, 'tada', .35]] },

    // 3 – THEN we plant: Dottie lifts the tree into the hole and pushes the soil back
    { d: 22, draw: parked({
        behind: (u, c) => { const fill = clamp((u - 10.4) / 4);
          hole(1, fill); pile(1 - fill * .85);
          if (u >= 6.2) tree(HX, GY - 2 + (1 - clamp((u - 6.2) / .6)) * 4, c.t, { grow: 1 }); },
        before: (u, c) => { digger(RX, RGY, c.t, { mouth: dTalk(c), look: -1 });
          const keys = [[0, ...REST], [1.0, POTX + 18, 350, .2, 0], [2.0, POTX + 18, 366, .2, 0], [3.2, POTX + 18, 340, .2, 0], [5.0, HX + 18, 340, .2, 0], [6.2, HX + 18, 374, .2, 0],
            [7.2, 640, 330, .6, 0], [8.4, PX + 30, 396, -.2, 0], [10.0, HX + 40, 396, -.2, 0], [10.8, 640, 360, -.2, 0], [12.0, PX + 30, 398, -.2, 0], [13.6, HX + 44, 398, -.2, 0],
            [15.0, ...REST]];
          const [wx, wy, b] = path(keys, u);
          arm(RX, wx, wy, b, 0);
          if (u >= 2.0 && u < 6.2) tree(wx - 18, wy + 70, c.t, { ball: true });
          if (u < 2.0) tree(POTX, GY, c.t, { ball: true }); } }),
      says: [['dottie', 'Then, we plant!', .4, 2.6, ...DB], ['toet', 'Gently, gently...', 3.0, 6.0, ...TB],
             ['dottie', 'Push the soil back!', 8.0, 11.2, ...DB], ['toet', 'Our tree is planted!', 15.4, 19.0, ...TB]],
      big: [['THEN: plant!', .4, 21.4, 480, 64, 54, '#2f9e44']],
      sfx: [[1.0, 'clank', .25, .3], [2.2, 'pop', .3, -.2], [6.3, 'bump', .3, 0], [8.4, 'rustle:1.4', .3, .2], [12.0, 'rustle:1.4', .3, .2], [15.4, 'tada', .35]] },

    // 4 – LAST we water: a smiling rain cloud waters the tree, it grows and blossoms, a bird lands
    { d: 24, draw: parked({
        behind: (u, c) => { hole(1, 1); pile(.15);
          const g = 1 + .35 * ease(clamp((u - 12.4) / 3)); tree(HX, GY - 2, c.t, { grow: g, bloom: clamp((u - 14.6) / 2.6) });
          c.g = g; },
        before: (u, c) => { digger(RX, RGY, c.t, { mouth: dTalk(c), look: -1 }); arm(RX, ...REST);
          const ck = ease(clamp((u - 3.4) / 4)) - ease(clamp((u - 15.2) / 4)), cx = lerp(-140, HX, ease(clamp((u - 3.4) / 4))) + ease(clamp((u - 15.2) / 4)) * 560;
          if (u > 3.2 && u < 19.4) rainCloud(cx, 190, c.t, clamp((u - 7.8) / .6) * clamp((13.6 - u) / .6));
          const bk = ease(clamp((u - 17.2) / 1.6)), top = GY - 2 - 18 - 54 * c.g - 26 * c.g;
          if (u > 17.2) bird(lerp(980, HX + 6, bk), lerp(150, top - 4, bk) - Math.sin(bk * Math.PI) * 40, c.t, bk < 1); } }),
      says: [['toet', 'Last, we water!', .4, 3.0, ...TB], ['dottie', 'Look! A rain cloud!', 4.2, 7.4, ...DB],
             ['toet', 'Our tree is growing!', 19.6, 23.2, ...TB]],
      big: [['LAST: water!', .4, 23.4, 480, 64, 54, '#1c7ed6'], ['Pitter patter!', 8.6, 12.6, 330, 150, 46, '#5fa8e8']],
      sfx: [[3.6, 'whoosh', .2, -.6], [7.8, 'rain:6.2', .4, 0], [14.8, 'twinkle:G6', .35], [15.6, 'twinkle:C7', .3], [18.6, 'tweet', .45, .3], [20.4, 'tweet', .35, .2]] },

    // 5 – recap FIRST / THEN / LAST, Dottie drives away
    { d: 26, draw: parked({
        behind: (u, c) => { hole(1, 1); pile(.15); tree(HX, GY - 2, c.t, { grow: 1.35, bloom: 1 }); bird(HX + 6, GY - 2 - 72 * 1.35 - 26 * 1.35 - 4, c.t, false); },
        before: (u, c) => { const k = ease(clamp((u - 14.6) / 5)), rx = lerp(RX, 1260, k);
          digger(rx, RGY, c.t, { mouth: dTalk(c), roll: (rx - RX) / 22, moving: u > 14.6 && u < 19.6, look: -1 });
          arm(rx, ...REST.slice(0, 1).map(v => v + (rx - RX)), REST[1], REST[2], 0); } }),
      says: [['dottie', 'Bye bye! Beep beep!', 12.2, 15.4, ...DB], ['toet', 'Thank you, Dottie!', 16.4, 19.8, ...TB]],
      after: (u, c) => recap(u, .8, 11.6, c.t),
      sfx: [[.8, 'chime:C6', .45], [3.2, 'chime:E6', .45], [5.6, 'chime:G6', .45], [7.4, 'twinkle:E6', .4], [14.6, 'bump', .25, .7], [15.6, 'bump', .2, .8], [19.8, 'honk', .45]] },
  ],
});
