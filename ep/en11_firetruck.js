// Little Truck Toet – Toet's Helper Friends: Freddie the Fire Truck (English story episode, approved "Helper Friends" idea).
// Kiki the kitten is stuck up in a tree. Toet is too small to reach and asks for help; Freddie the Fire Truck (new character, original design)
// raises his ladder UP – counting the ladder sections 1-2-3-4-5 – Kiki hops on and rides DOWN. Then Freddie waters three thirsty flowers
// with his hose (1-2-3, a little rainbow in the spray). Recap UP / DOWN + "When you need help, just ask!". New music: firetruck_long.
const C = require('../lib/common'), T = require('../lib/toet');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, circ, ell, rr, hash, INK } = C;
const { drive } = St;
const BX = 110, GY = 436;
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 175];
const TB2 = [(u, c) => c.bx + 210, (u, c) => c.Tk.by - 262];   // higher, while Kiki sits on Toet's box
const M1 = T.motion([[0, 150], [4, 150], [7, 0]]), STOP = M1.distAt(7);
const RX = 790, RGY = T.ROAD + 20;                  // Freddie parked (screen x, road contact line)
const FB = [790, 214];                              // Freddie's speech bubble
const KB = [600, 64];                               // Kiki's bubble while she is up in the tree
const TX = 520;                                     // tree trunk x
const KIKI_BR = [612, 182];                         // Kiki sitting on the branch (ground under her paws)
const PIV = [RX + 100, RGY - 134];                  // ladder pivot on Freddie's roof
const TIP = [652, 196];                             // where the ladder platform ends (next to Kiki's branch)
const LMAX = Math.hypot(TIP[0] - PIV[0], TIP[1] - PIV[1]), L0 = LMAX - 5 * 36, AUP = Math.atan2(TIP[1] - PIV[1], TIP[0] - PIV[0]), ADN = -Math.PI;
const FLOW = [395, 445, 495];                       // thirsty flowers behind the road
const blinkAt = (t, off = 0) => (t + off) % 4.0 > 3.85;
const ORANGE = '#ffa94d', STRIPE = '#e8782a';
const cheeks = (cx, cy, r) => { x.fillStyle = 'rgba(255,110,120,.45)'; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); };

// ---------- Kiki the kitten (same design as in "In, On, Under!"): origin = ground under her paws ----------
function kitten(px, gy, t, s, o = {}) {
  x.save(); x.translate(px, gy); x.scale(s * (o.flip ? -1 : 1), s);
  const wag = Math.sin(t * (o.tail || 2.4));
  x.lineCap = 'round'; x.lineJoin = 'round';
  const tailPath = () => { x.beginPath(); x.moveTo(16, -8); x.quadraticCurveTo(42, -10, 40 + wag * 4, -34); x.quadraticCurveTo(38 + wag * 8, -50, 30 + wag * 10, -52); };
  tailPath(); x.strokeStyle = INK; x.lineWidth = 13; x.stroke(); tailPath(); x.strokeStyle = ORANGE; x.lineWidth = 7.5; x.stroke();
  ell(0, -24, 22, 24, ORANGE, INK, 3);
  ell(0, -18, 12, 15, '#fff3e0');
  x.strokeStyle = STRIPE; x.lineWidth = 3; [[-19, -30], [19, -30], [-20, -20], [20, -20]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(a + (a < 0 ? 6 : -6), b + 1); x.stroke(); });
  ell(-9, -3, 7, 5, '#fff3e0', INK, 2.5); ell(9, -3, 7, 5, '#fff3e0', INK, 2.5);
  x.save(); x.translate(0, -58); x.rotate((o.look || 0) * .12);
  [-1, 1].forEach(d => { x.fillStyle = ORANGE; x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.moveTo(d * 21, -6); x.lineTo(d * 17, -29); x.lineTo(d * 4, -17); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#ffc2d1'; x.beginPath(); x.moveTo(d * 17, -9); x.lineTo(d * 16, -22); x.lineTo(d * 9, -15); x.closePath(); x.fill(); });
  ell(0, 0, 25, 21, ORANGE, INK, 3);
  x.strokeStyle = STRIPE; x.lineWidth = 3; [-6, 0, 6].forEach(d => { x.beginPath(); x.moveTo(d, -19); x.lineTo(d, -12); x.stroke(); });
  ell(0, 9, 11, 7, '#fff3e0');
  const lk = (o.look || 0) * 2;
  [-9, 9].forEach(ex => {
    if (blinkAt(t, 1.3)) { x.fillStyle = INK; x.fillRect(ex - 5, -3, 10, 2.5); }
    else { circ(ex, -2, 5.2, '#7bd389', INK, 2); circ(ex + lk, -2 + (o.down ? 1.5 : 0), 3, INK); circ(ex + lk + 1.2, -3.6, 1.2, '#fff'); }
  });
  if (o.worried) { x.strokeStyle = INK; x.lineWidth = 2.2; [-1, 1].forEach(d => { x.beginPath(); x.moveTo(d * 4, -11); x.lineTo(d * 13, -14); x.stroke(); }); }
  x.fillStyle = '#ff8fab'; x.beginPath(); x.moveTo(-3.5, 5); x.lineTo(3.5, 5); x.lineTo(0, 9); x.closePath(); x.fill();
  x.strokeStyle = INK; x.lineWidth = 2;
  if ((o.mouth || 0) > .05) { x.fillStyle = '#c2405a'; x.beginPath(); x.ellipse(0, 13, 4, 2 + o.mouth * 3.5, 0, 0, 7); x.fill(); x.stroke(); }
  else { x.beginPath(); x.moveTo(0, 9); x.quadraticCurveTo(-3, 13, -6, 11); x.moveTo(0, 9); x.quadraticCurveTo(3, 13, 6, 11); x.stroke(); }
  x.lineWidth = 1.5; [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(([d, e]) => { x.beginPath(); x.moveTo(d * 12, 8 + e * 1.5); x.lineTo(d * 27, 6 + e * 4); x.stroke(); });
  cheeks(-15, 7, 3.5); cheeks(15, 7, 3.5);
  x.restore();
  x.restore();
}

// ---------- the big tree with Kiki's branch (origin TX, GY) ----------
function bigTree(t) {
  x.save();
  x.fillStyle = '#8a5a36'; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(TX - 30, GY); x.quadraticCurveTo(TX - 16, GY - 140, TX - 12, GY - 250); x.lineTo(TX + 14, GY - 250); x.quadraticCurveTo(TX + 18, GY - 140, TX + 32, GY); x.closePath(); x.fill(); x.stroke();
  // Kiki's branch to the right
  x.beginPath(); x.moveTo(TX + 10, GY - 236); x.quadraticCurveTo(TX + 70, GY - 256, KIKI_BR[0] + 34, KIKI_BR[1] - 2); x.lineTo(KIKI_BR[0] + 34, KIKI_BR[1] + 10);
  x.quadraticCurveTo(TX + 70, GY - 238, TX + 12, GY - 212); x.closePath(); x.fill(); x.stroke();
  // a knot hole
  ell(TX + 2, GY - 120, 8, 12, '#5a3a22');
  const sw = Math.sin(t * 1.1) * 2;
  [['#3e9a52', 8], ['#5cbf6a', 0]].forEach(([col, g]) => { x.fillStyle = col; x.beginPath();
    [[-70, -330, 70], [10, -360, 82], [80, -320, 62], [-110, -280, 48], [-30, -290, 66], [50, -290, 52]].forEach(([a, b, r]) => { x.moveTo(TX + a + sw + r + g, GY + b); x.arc(TX + a + sw, GY + b, r + g, 0, 7); }); x.fill(); });
  // little red apples in the leaves
  [[-80, -320], [30, -372], [90, -318], [-36, -280]].forEach(([a, b]) => circ(TX + a + sw, GY + b, 7, '#e63946', INK, 2));
  x.restore();
}

// ---------- flowers: droop 1 = thirsty, 0 = happy ----------
function flower(cx, gy, droop, col, t) {
  x.save(); x.translate(cx, gy);
  x.strokeStyle = '#2f8a46'; x.lineWidth = 4; x.lineCap = 'round';
  const hx = Math.sin(droop * 1.3) * 22, hy = -44 + droop * 16;
  x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(0, -30, hx, hy); x.stroke();
  x.fillStyle = '#5cbf6a'; x.beginPath(); x.ellipse(-8, -12, 9, 4, -.5 + droop * .6, 0, 7); x.fill(); x.beginPath(); x.ellipse(8, -16, 9, 4, .5 - droop * .6, 0, 7); x.fill();
  x.save(); x.translate(hx, hy); x.rotate(droop * 1.2 + Math.sin(t * 2 + cx) * .05 * (1 - droop));
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; circ(Math.cos(a) * 10, Math.sin(a) * 10, 7, col, INK, 1.5); }
  circ(0, 0, 7, '#ffd23f', INK, 1.5);
  if (droop < .5) { x.strokeStyle = INK; x.lineWidth = 1.6; x.beginPath(); x.arc(0, 0, 3.5, .3, Math.PI - .3); x.stroke(); }
  x.restore(); x.restore();
}

// ---------- Freddie the Fire Truck (original design, faces left). origin = road contact under the middle ----------
function wheel(wx, wy, r) {
  x.save(); x.translate(wx, wy);
  circ(0, 0, 22, INK); circ(0, 0, 11, '#dfe7ef');
  x.rotate(r); x.strokeStyle = INK; x.lineWidth = 3;
  for (let i = 0; i < 3; i++) { x.rotate(Math.PI * 2 / 3); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 10); x.stroke(); }
  x.restore();
}
function ladder(len, ang, plat = true) {   // drawn from the pivot (screen coords)
  x.save(); x.translate(PIV[0], PIV[1]); x.rotate(ang);
  x.strokeStyle = INK; x.lineWidth = 3; x.fillStyle = '#dfe7ef';
  rr(0, -9, len, 6, 3); x.fill(); x.stroke(); rr(0, 3, len, 6, 3); x.fill(); x.stroke();
  x.strokeStyle = '#9fb0c0'; x.lineWidth = 3;
  for (let r = 14; r < len - 4; r += 18) { x.beginPath(); x.moveTo(r, -3); x.lineTo(r, 3); x.stroke(); }
  // section joints (5 sections slide out)
  x.fillStyle = '#e63946'; for (let s = 0; s * 36 + L0 < len - 2; s++) { const px = L0 + s * 36 - 6; if (px > 6) { x.fillRect(px, -10, 4, 20); } }
  x.restore();
  if (plat) {   // little platform at the tip, always level
    const px = PIV[0] + Math.cos(ang) * len, py = PIV[1] + Math.sin(ang) * len;
    x.save(); x.translate(px, py);
    x.fillStyle = '#e63946'; x.strokeStyle = INK; x.lineWidth = 3; rr(-26, -4, 46, 10, 3); x.fill(); x.stroke();
    x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.moveTo(-26, -4); x.lineTo(-26, -24); x.lineTo(20, -24); x.lineTo(20, -4); x.stroke();
    x.restore();
    return [px, py];
  }
}
function freddie(px, gy, t, o = {}) {
  x.save(); x.translate(px, gy + (o.moving ? Math.sin(t * 12) * 1.5 : 0));
  x.fillStyle = 'rgba(0,0,0,.18)'; x.beginPath(); x.ellipse(0, 22, 150, 10, 0, 0, 7); x.fill();
  // body
  x.fillStyle = '#e63946'; x.strokeStyle = INK; x.lineWidth = 4; rr(-46, -128, 196, 118, 14); x.fill(); x.stroke();
  x.fillStyle = '#ffffff'; x.fillRect(-44, -54, 192, 12);
  x.fillStyle = '#ffd23f'; x.fillRect(-44, -42, 192, 5);
  // lockers with handles
  x.strokeStyle = '#b71f2c'; x.lineWidth = 3; [0, 60].forEach(a => { x.beginPath(); x.rect(a - 32, -116, 52, 54); x.stroke(); circ(a + 12, -88, 3, '#ffd23f'); });
  // hose reel
  circ(116, -88, 24, '#ffffff', INK, 3); circ(116, -88, 16, '#f6c343', INK, 2.5); circ(116, -88, 6, INK);
  x.fillStyle = '#ffffff'; x.font = C.FONT(22); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('FREDDIE', 52, -26);
  // ladder cradle on the roof
  x.fillStyle = INK; rr(88, -144, 24, 16, 4); x.fill();
  // cab (front = left)
  x.fillStyle = '#e63946'; x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(-50, -10); x.lineTo(-50, -100); x.quadraticCurveTo(-50, -112, -62, -112); x.lineTo(-102, -112);
  x.quadraticCurveTo(-120, -112, -128, -90); x.lineTo(-142, -50); x.quadraticCurveTo(-146, -40, -146, -30); x.lineTo(-146, -10); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = '#ffffff'; x.fillRect(-144, -34, 92, 10);
  x.fillStyle = '#d8f3ff'; x.lineWidth = 3; x.beginPath(); x.moveTo(-64, -100); x.lineTo(-104, -100); x.quadraticCurveTo(-114, -100, -119, -88); x.lineTo(-129, -60); x.lineTo(-64, -60); x.closePath(); x.fill(); x.stroke();
  // blue beacon on the roof (gentle flash while driving)
  const on = o.moving && Math.sin(t * 8) > 0;
  x.fillStyle = on ? '#4cc9f0' : '#8ecae6'; x.strokeStyle = INK; x.lineWidth = 3; rr(-92, -126, 22, 14, 5); x.fill(); x.stroke();
  if (on) circ(-81, -119, 18, 'rgba(76,201,240,.35)');
  // face
  const lk = o.look || 0;
  if (blinkAt(t, .6)) { x.fillStyle = INK; x.fillRect(-100, -81, 12, 3); x.fillRect(-80, -81, 12, 3); }
  else { [-94, -74].forEach(ex => { circ(ex + lk, -79, 6.5, INK); circ(ex + lk - 2, -81, 2.2, '#fff'); });
    x.strokeStyle = INK; x.lineWidth = 2.5; x.lineCap = 'round'; [-94, -74].forEach(ex => { x.beginPath(); x.arc(ex, -88, 9, Math.PI + .7, -.7); x.stroke(); }); }
  const m = o.mouth || 0;
  x.strokeStyle = INK; x.lineWidth = 3;
  if (m > .05) { x.fillStyle = INK; x.beginPath(); x.ellipse(-130, -36, 7, 4 + m * 5, 0, 0, 7); x.fill(); }
  else { x.beginPath(); x.arc(-126, -44, 11, Math.PI * .1 + .3, Math.PI - .25); x.stroke(); }
  circ(-140, -50, 5, 'rgba(255,170,180,.7)');
  x.fillStyle = '#fff6b0'; x.beginPath(); x.arc(-142, -22, 6, 0, 7); x.fill(); x.lineWidth = 2; x.stroke();
  x.fillStyle = INK; x.fillRect(-150, -14, 314, 12);
  // little hose nozzle on the front bumper
  x.fillStyle = '#f6c343'; x.strokeStyle = INK; x.lineWidth = 2.5; rr(-166, -14, 20, 9, 3); x.fill(); x.stroke();
  const r = -(o.roll || 0);
  [-104, 40, 116].forEach(wx => wheel(wx, 4, r));
  x.restore();
}
const NOZ = [RX - 166, RGY - 10];

// ---------- water from the hose ----------
function water(tx, ty, k, t) {
  if (k <= 0) return;
  const [nx, ny] = NOZ, mx = (nx + tx) / 2, my = Math.min(ny, ty) - 90;
  x.save(); x.globalAlpha = k;
  x.strokeStyle = 'rgba(120,200,255,.85)'; x.lineWidth = 9; x.lineCap = 'round';
  x.beginPath(); x.moveTo(nx, ny); x.quadraticCurveTo(mx, my, tx, ty); x.stroke();
  x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 3; x.setLineDash([10, 14]); x.lineDashOffset = -t * 120;
  x.beginPath(); x.moveTo(nx, ny); x.quadraticCurveTo(mx, my, tx, ty); x.stroke(); x.setLineDash([]);
  for (let i = 0; i < 8; i++) { const a = (t * 3 + i / 8) % 1; circ(tx + Math.cos(i * 2.3) * 22 * a, ty - 6 - Math.sin(i * 1.7 + 1) * 18 * a + a * a * 30, 3.5 * (1 - a) + 1, 'rgba(120,200,255,.9)'); }
  x.restore();
}
function rainbow(cx, cy, k) {
  if (k <= 0) return;
  x.save(); x.globalAlpha = k * .55; x.lineWidth = 6;
  ['#e63946', '#ff9f1c', '#ffd23f', '#2fb35a', '#3a86ff', '#9b5de5'].forEach((col, i) => { x.strokeStyle = col; x.beginPath(); x.arc(cx, cy, 120 - i * 6, Math.PI * 1.08, Math.PI * 1.92); x.stroke(); });
  x.restore();
}

// recap panel: UP / DOWN with an arrow and a mini ladder
function recap(u, a, end) {
  [['UP', '#2fb35a', -1], ['DOWN', '#3a86ff', 1]].forEach(([w, col, dir], i) => {
    const k = clamp((u - a - i * 2.6) / .5) * clamp((end - u) / .8); if (k <= 0) return;
    const cx = 330 + i * 300;
    x.save(); x.globalAlpha = k; x.fillStyle = 'rgba(255,255,255,.9)'; x.strokeStyle = INK; x.lineWidth = 3; rr(cx - 110, 100, 220, 150, 18); x.fill(); x.stroke();
    // arrow
    const bob = Math.sin(u * 3) * 6 * dir;
    x.translate(cx - 46, 176 + bob); x.fillStyle = col; x.strokeStyle = INK; x.lineWidth = 3;
    x.beginPath(); x.moveTo(-12, -dir * 30); x.lineTo(12, -dir * 30); x.lineTo(12, 0); x.lineTo(28, 0); x.lineTo(0, dir * 40); x.lineTo(-28, 0); x.lineTo(-12, 0); x.closePath(); x.fill(); x.stroke();
    x.restore();
    // mini ladder
    x.save(); x.globalAlpha = k; x.strokeStyle = INK; x.lineWidth = 3; x.fillStyle = '#dfe7ef';
    rr(cx + 22, 116, 7, 118, 3); x.fill(); x.stroke(); rr(cx + 61, 116, 7, 118, 3); x.fill(); x.stroke();
    x.strokeStyle = '#9fb0c0'; for (let r = 130; r < 230; r += 20) { x.beginPath(); x.moveTo(cx + 29, r); x.lineTo(cx + 61, r); x.stroke(); }
    x.restore();
    x.save(); x.globalAlpha = k; kitten(cx + 45, i === 0 ? 150 : 232, u, .62); x.restore();
    C.bigText(w, cx, 66, k, 48, col);
  });
  C.bigText('When you need help, just ask!', 540, 296, win(u, a + 5.6, end, .4), 40, '#ffd23f');
}

// parked scene for the middle shots
const parked = (draw) => drive({ segs: [[0, 0], [60, 0]], dist0: STOP, bx: BX, noLeaves: true,
  truck: u => ({ happy: true }),
  behind: (u, c) => { bigTree(c.t); draw.behind && draw.behind(u, c); },
  beforeTruck: (u, c) => draw.before && draw.before(u, c),
  front: (u, c) => draw.front && draw.front(u, c) });
const fTalk = c => c.talk('freddie'), kTalk = c => c.talk('kiki');

// ladder states
const STEP_T = [4.0, 6.6, 9.2, 11.8, 14.4];   // shot 2: each section slides out in 1.1 s
function ladderUp(u) {
  const ang = lerp(ADN, AUP, ease(clamp((u - .8) / 2.2)));
  let len = L0; STEP_T.forEach(s => { len += 36 * ease(clamp((u - s) / 1.1)); });
  return [len, ang];
}
function ladderDown(u) {                      // shot 3: retract 1.0–7.0, lower 7.2–9.2
  const len = lerp(LMAX, L0, ease(clamp((u - 1) / 6))), ang = lerp(AUP, ADN, ease(clamp((u - 7.2) / 2)));
  return [len, ang];
}
const hop = (a, b, k, h) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k) - Math.sin(k * Math.PI) * h];

St.episode({
  title: ["Toet's Helper Friends", 60], sub: 'Freddie the Fire Truck', accent: '#e63946',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'firetruck', shift: 0 },
  thumb: ['Freddie the Fire Truck', 'Up and down!'],
  shots: [
    // 0 – Toet drives up to a big tree and hears "meow": Kiki is stuck on a branch
    { d: 30, draw: drive({ segs: [[0, 150], [4, 150], [7, 0], [60, 0]], bx: BX,
        truck: u => ({ happy: u < 9 || u > 15 }),
        behind: (u, c) => { x.save(); x.translate(-(c.dist - STOP), 0); bigTree(c.t);
          kitten(KIKI_BR[0], KIKI_BR[1], c.t, 1, { mouth: kTalk(c), worried: u > 12, down: true, look: -.4 }); x.restore(); } }),
      says: [['toet', "Hi! I'm Little Truck Toet!", 5.2, 8.4, ...TB], ['toet', "What's that sound?", 9.8, 12.4, ...TB],
             ['kiki', 'Meow! Meow!', 12.8, 15.2, ...KB], ['toet', "It's Kiki! She's up in the tree!", 15.6, 19.2, ...TB],
             ['kiki', "I can't get down!", 19.6, 22.4, ...KB], ['toet', "I'm too small to reach!", 22.8, 25.6, ...TB],
             ['toet', 'Who can help?', 26.0, 29.0, ...TB]],
      sfx: [[2, 'honk', .6], [9.0, 'meow', .5, .2], [13.0, 'meow:1.1', .5, .2], [14.2, 'meow', .45, .2], [19.8, 'meow:0.9', .35, .2], [23, 'sad', .3]] },

    // 1 – Freddie the Fire Truck arrives
    { d: 22, draw: parked({
        behind: (u, c) => kitten(KIKI_BR[0], KIKI_BR[1], c.t, 1, { mouth: kTalk(c), worried: u < 17, down: true, look: .6 }),
        before: (u, c) => { const k = ease(clamp((u - .5) / 4.5)), rx = lerp(1190, RX, k);
          freddie(rx, RGY, c.t, { mouth: fTalk(c), roll: (rx - RX) / 22, moving: u < 5 });
          x.save(); x.translate(rx - RX, 0); ladder(L0, ADN, false); x.restore(); } }),
      says: [['freddie', "Hello! I'm Freddie the Fire Truck!", 5.4, 9.2, ...FB, 26], ['toet', 'Freddie, can you help Kiki?', 9.6, 13.0, ...TB],
             ['freddie', 'Yes! My ladder goes UP!', 13.4, 17.0, ...FB], ['kiki', 'Yay!', 17.4, 19.8, ...KB]],
      sfx: [[.4, 'siren', .3, .7], [4.6, 'psss', .3, .4], [13.6, 'chime:G6', .3], [17.5, 'meow:1.2', .45, .2]] },

    // 2 – the ladder goes UP: count the sections 1-2-3-4-5, Kiki hops onto the platform
    { d: 27, draw: parked({
        behind: (u, c) => { if (u < 21.4) kitten(KIKI_BR[0], KIKI_BR[1], c.t, 1, { mouth: kTalk(c), look: .7 }); },
        before: (u, c) => { freddie(RX, RGY, c.t, { mouth: fTalk(c), look: -1 });
          const [len, ang] = ladderUp(u), tip = ladder(len, ang);
          if (u >= 21.4) { const k = clamp((u - 21.4) / .7), p = hop(KIKI_BR, [tip[0] - 4, tip[1] - 4], k, 30); kitten(p[0], p[1], c.t, 1, { mouth: kTalk(c), tail: 6 }); }
          STEP_T.forEach(s => { if (u > s + 1.1 && u < s + 1.9) C.sparkles(tip[0], tip[1] - 10, c.t, 6, 30); }); } }),
      says: [['freddie', "Let's count! Up, up, up!", .6, 3.6, ...FB], ['toet', 'Five! The ladder reached Kiki!', 17.6, 21.0, ...TB],
             ['kiki', 'Here I come!', 22.4, 25.6, ...KB]],
      big: [...STEP_T.map((s, i) => [String(i + 1), s + 1.0, s + 2.5, 250, 150, 110, ['#e63946', '#ff9f1c', '#ffd23f', '#2fb35a', '#3a86ff'][i]]), ['UP!', 17.4, 21.0, 250, 150, 96, '#2fb35a']],
      sfx: [[.8, 'clank', .35, .6], ...STEP_T.flatMap((s, i) => [[s, 'tick', .4, .3], [s + 1.0, `chime:${['C6', 'D6', 'E6', 'F6', 'G6'][i]}`, .55]]), [17.5, 'tada', .4], [21.4, 'boing', .35, .2]] },

    // 3 – DOWN: the ladder comes down with Kiki, she hops onto the grass and says thank you
    { d: 22, draw: parked({
        before: (u, c) => { freddie(RX, RGY, c.t, { mouth: fTalk(c), look: -1 });
          const [len, ang] = ladderDown(u), tip = ladder(len, ang);
          if (u < 9.4) kitten(tip[0] - 4, tip[1] - 4, c.t, 1, { mouth: kTalk(c), tail: 5 });
          else { const k = clamp((u - 9.4) / .9), p = hop([tip[0] - 4, tip[1] - 4], [600, GY], k, 50); kitten(p[0], p[1], c.t, 1, { mouth: kTalk(c), tail: 7, look: -.5 }); } } }),
      says: [['freddie', 'Down, down, down!', 1.0, 4.4, 820, 64], ['kiki', 'Thank you, Freddie!', 11.0, 14.4, 600, 312],
             ['freddie', "You're welcome, Kiki!", 14.8, 18.0, ...FB], ['toet', 'When you need help, just ask!', 18.4, 21.6, ...TB]],
      big: [['DOWN!', 1.6, 7.6, 250, 150, 96, '#3a86ff']],
      sfx: [[1.0, 'slide', .35, .5], [7.4, 'clank', .3, .6], [9.4, 'boing', .35, .2], [10.4, 'meow:1.2', .45, .2], [11.2, 'purr', .35, .2]] },

    // 4 – three thirsty flowers: Freddie waters them with his hose (1-2-3), a little rainbow
    { d: 26, draw: parked({
        behind: (u, c) => { FLOW.forEach((fx, i) => flower(fx, GY, 1 - ease(clamp((u - (8.6 + i * 2.6)) / 1.0)), ['#ff5d8f', '#9b5de5', '#ffffff'][i], c.t));
          const wk = clamp((u - 6) / .4) * clamp((16.2 - u) / .4), seg = clamp(Math.floor((u - 6.6) / 2.6), 0, 2);
          const tx = lerp(FLOW[Math.max(0, seg - 1)], FLOW[seg], clamp((u - 6.6 - seg * 2.6) / .6)) + 6;
          rainbow(560, 420, clamp((u - 10) / 1) * clamp((17 - u) / 1));
          c.wk = wk; c.wt = tx; },
        before: (u, c) => { freddie(RX, RGY, c.t, { mouth: fTalk(c), look: -1 }); ladder(L0, ADN, false); water(c.wt, GY - 46, c.wk, c.t); },
        front: (u, c) => kitten(170, T.ROAD + 20 - 120, c.t, .95, { mouth: kTalk(c), look: .8 }) }),
      says: [['toet', 'Oh! These flowers are thirsty!', .6, 3.8, ...TB2], ['freddie', 'Splash! Water from my hose!', 4.2, 7.6, ...FB],
             ['kiki', 'Three happy flowers!', 16.6, 19.8, 230, 206], ['toet', 'Thank you, Freddie!', 20.2, 23.4, ...TB2]],
      big: FLOW.map((fx, i) => [String(i + 1), 8.6 + i * 2.6 + .6, 8.6 + i * 2.6 + 2.4, fx, 330, 72, ['#ff5d8f', '#9b5de5', '#ffffff'][i]]),
      sfx: [[6.0, 'spray:10.2', .3, .3], ...FLOW.map((_, i) => [8.6 + i * 2.6 + .6, `chime:${['C6', 'E6', 'G6'][i]}`, .55]), [16.6, 'tada', .35], [17, 'meow:1.2', .4, -.6]] },

    // 5 – recap UP / DOWN, "just ask!", Freddie drives away
    { d: 26, draw: parked({
        behind: (u, c) => FLOW.forEach((fx, i) => flower(fx, GY, 0, ['#ff5d8f', '#9b5de5', '#ffffff'][i], c.t)),
        before: (u, c) => { const k = ease(clamp((u - 14.6) / 5)), rx = lerp(RX, 1250, k);
          freddie(rx, RGY, c.t, { mouth: fTalk(c), roll: (rx - RX) / 22, moving: u > 14.6 && u < 19.6, look: -1 });
          x.save(); x.translate(rx - RX, 0); ladder(L0, ADN, false); x.restore(); },
        front: (u, c) => kitten(170, T.ROAD + 20 - 120, c.t, .95, { mouth: kTalk(c), look: .8, tail: u > 13 ? 6 : 2.4 }) }),
      says: [['freddie', 'Bye bye! Nee-naw!', 12.2, 15.4, ...FB], ['toet', 'See you, Freddie!', 16.4, 19.8, ...TB2]],
      after: (u, c) => recap(u, .8, 11.6),
      sfx: [[.8, 'chime:G6', .45], [3.4, 'chime:C6', .45], [6.4, 'twinkle:E6', .4], [14.6, 'siren', .22, .8], [19.8, 'honk', .45]] },
  ],
});
