// Little Truck Toet – Toet's Helper Friends: Tessa the Tractor (English story episode, approved "Helper Friends" idea).
// Toet finds a pumpkin patch next to a little farm stand: the pumpkins should go on the stand – but Toet has no arms and can't lift them.
// Tessa the Tractor (new character, original design: a green ELECTRIC tractor – big back wheel, small front wheel, lightning badge, no
// exhaust – with a front loader bucket) helps. Learning moment: SIZES – SMALL, MEDIUM, BIG – and LIGHT vs HEAVY.
// Tessa scoops the small pumpkin (light – up it goes!) onto the stand, then the medium one, then the BIG one (heavy – "Umph!", she
// lifts it slowly and sets it down next to the stand). Recap small / medium / big, Tessa drives off. New music: tractor_long
// (lap-steel country two-step, jug bass, washboard).
const C = require('../lib/common'), T = require('../lib/toet');
const St = require('../lib/story');
const { x, clamp, ease, lerp, win, circ, ell, rr, hash, INK } = C;
const { drive } = St;
const BX = 60, GY = 432;
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 205];
const M1 = T.motion([[0, 150], [4, 150], [7, 0]]), STOP = M1.distAt(7);
const RGY = T.ROAD + 20;                              // Tessa's road contact line
const DB = [(u, c) => clamp((c.rx ?? 860) + 10, 300, 820), 176];   // Tessa's speech bubble follows her
const NOTB = a => process.env.THUMBBG ? [] : a;      // no big labels on the thumbnail background
const blinkAt = (t, off = 0) => (t + off) % 4.1 > 3.95;
const GRN = '#2b8a3e', GRN2 = '#1b5e20', OR = '#ff8c1a', OR2 = '#e8590c';
const cheeks = (cx, cy, r) => { x.fillStyle = 'rgba(255,110,120,.45)'; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); };

// pumpkins: radius per size; patch spots (start) and stand spots (end)
const SZ = { small: 19, medium: 28, big: 44 };
const PATCH = { small: [572, GY], medium: [628, GY], big: [694, GY] };
const SHELF = 368;                                     // stand table top
const STAND = { small: [356, SHELF], medium: [422, SHELF], big: [512, GY] };
const SCOL = { small: '#ffb347', medium: OR, big: '#f76707' };

// ---------- loader geometry (tractor faces left) ----------
const PIV = [-6, -112], LA = 150;
const bucketAt = (rx, a) => [rx + PIV[0] - Math.cos(a) * LA, RGY + PIV[1] + Math.sin(a) * LA];
// rx so that the bucket (holding a pumpkin of radius r) puts the pumpkin bottom at (px, py)
const rxFor = (px, a) => px - PIV[0] + Math.cos(a) * LA;
const aForY = y => Math.asin(clamp((y - (RGY + PIV[1])) / LA, -1, 1));   // bucket floor at y
const A_GROUND = aForY(GY + 4), A_REST = -.25;

// ---------- a friendly pumpkin (bottom-centre at cx, gy) ----------
function pumpkin(cx, gy, r, t, o = {}) {
  const sq = o.squash || 0;
  x.save(); x.translate(cx, gy); x.scale(1 + sq * .08, 1 - sq * .08);
  if (!o.noShadow) { x.fillStyle = 'rgba(0,0,0,.15)'; x.beginPath(); x.ellipse(0, 1, r * 1.1, r * .18, 0, 0, 7); x.fill(); }
  const col = o.col || OR, h = r * 1.72;
  x.strokeStyle = INK; x.lineWidth = Math.max(2.4, r * .1);
  [[-.55, .62], [.55, .62], [0, .78]].forEach(([dx, w]) => { x.fillStyle = dx === 0 ? col : C.mix(col, '#c94a00', .25);
    x.beginPath(); x.ellipse(dx * r, -h / 2, r * w, h / 2, 0, 0, 7); x.fill(); x.stroke(); });
  // stem + curly leaf
  x.fillStyle = '#6b8e23'; x.lineWidth = Math.max(2, r * .08); rr(-r * .12, -h - r * .32, r * .24, r * .4, r * .08); x.fill(); x.stroke();
  x.strokeStyle = '#4c7a1e'; x.beginPath(); x.moveTo(r * .1, -h - r * .1); x.bezierCurveTo(r * .5, -h - r * .5, r * .7, -h, r * .45, -h - r * .05); x.stroke();
  // face
  const fy = -h * .52, er = Math.max(2, r * .13);
  if (blinkAt(t, (o.ph || 0) + 1.3) || o.closed) { x.fillStyle = INK; x.fillRect(-r * .42, fy - er * .2, er * 1.8, er * .5); x.fillRect(r * .42 - er * 1.8, fy - er * .2, er * 1.8, er * .5); }
  else { circ(-r * .32, fy, er, INK); circ(r * .32, fy, er, INK); circ(-r * .32 - er * .3, fy - er * .35, er * .35, '#fff'); circ(r * .32 - er * .3, fy - er * .35, er * .35, '#fff'); }
  x.strokeStyle = INK; x.lineWidth = Math.max(2, r * .09); x.lineCap = 'round';
  x.beginPath(); if (o.oh) x.ellipse(0, fy + r * .38, r * .14, r * .18, 0, 0, 7); else x.arc(0, fy + r * .12, r * .3, .35, Math.PI - .35); x.stroke();
  cheeks(-r * .55, fy + r * .25, r * .14); cheeks(r * .55, fy + r * .25, r * .14);
  x.restore();
}

// ---------- the farm stand (behind the road) ----------
function stand(t) {
  const L = 322, R = 456;
  x.fillStyle = '#a0683d'; x.strokeStyle = INK; x.lineWidth = 3;
  [L + 6, R - 14].forEach(px => { x.fillRect(px, 282, 8, GY - 282); x.strokeRect(px, 282, 8, GY - 282); });
  // table
  x.fillStyle = '#c98b52'; rr(L - 6, SHELF, R - L + 12, 12, 4); x.fill(); x.stroke();
  x.fillStyle = '#e8b77a'; rr(L + 2, SHELF + 12, R - L - 4, 40, 6); x.fill(); x.stroke();
  [[L + 30, '#ffd23f'], [(L + R) / 2, '#e63946'], [R - 30, '#ffd23f']].forEach(([fx, fc]) => { for (let p = 0; p < 5; p++) { const an = p / 5 * Math.PI * 2; circ(fx + Math.cos(an) * 6, SHELF + 32 + Math.sin(an) * 6, 4.5, fc); } circ(fx, SHELF + 32, 3.5, '#fff4e6'); });
  // striped awning
  for (let i = 0; i < 6; i++) { const w = (R - L + 24) / 6, ax = L - 12 + i * w;
    x.fillStyle = i % 2 ? '#fff4e6' : '#e63946'; x.beginPath(); x.moveTo(ax, 268); x.lineTo(ax + w, 268); x.lineTo(ax + w, 286);
    x.quadraticCurveTo(ax + w / 2, 298, ax, 286); x.closePath(); x.fill(); x.stroke(); }
  x.fillStyle = '#e63946'; rr(L - 16, 258, R - L + 32, 12, 5); x.fill(); x.stroke();
}
// pumpkin patch: soil rows, curly vines and leaves
function patch(t) {
  x.fillStyle = '#8d5a34'; x.beginPath(); x.ellipse(632, GY + 2, 120, 10, 0, 0, 7); x.fill();
  x.strokeStyle = '#4c7a1e'; x.lineWidth = 3; x.lineCap = 'round';
  x.beginPath(); x.moveTo(530, GY - 4);
  for (let i = 0; i <= 16; i++) { const px = 530 + i * 13; x.lineTo(px, GY - 6 + Math.sin(i * 1.3) * 4); } x.stroke();
  [[540, 0], [600, 1], [660, 2], [728, 3]].forEach(([lx, k]) => { const sw = Math.sin(t * 1.4 + k) * .12;
    x.save(); x.translate(lx, GY - 8); x.rotate(-.3 + sw); ell(0, -8, 12, 8, '#5cbf6a', INK, 2.5); x.restore(); });
}

// ---------- Tessa the Tractor (original design, faces left). origin = road contact under the middle ----------
function tractor(px, gy, t, o = {}) {
  const rx = px, a = o.a ?? A_REST;
  x.save(); x.translate(px, gy + (o.moving ? Math.sin(t * 13) * 1.2 : 0));
  x.fillStyle = 'rgba(0,0,0,.18)'; x.beginPath(); x.ellipse(-10, 22, 130, 9, 0, 0, 7); x.fill();
  // loader arm behind the body (far side)
  loaderArm(a, o.load, t, o.loadOh, o.strain, false);
  // hood (towards the left) + cab
  x.fillStyle = GRN; x.strokeStyle = INK; x.lineWidth = 4;
  x.beginPath(); x.moveTo(-104, -40); x.lineTo(-104, -84); x.quadraticCurveTo(-104, -96, -92, -96); x.lineTo(6, -96); x.lineTo(6, -40); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = '#4fbf63'; x.beginPath(); x.moveTo(-100, -84); x.quadraticCurveTo(-100, -92, -92, -92); x.lineTo(2, -92); x.lineTo(2, -84); x.closePath(); x.fill();
  x.fillStyle = '#ffd23f'; x.fillRect(-100, -50, 102, 6);
  // grille with the smiling mouth
  x.fillStyle = '#dfe9d8'; rr(-112, -88, 18, 40, 6); x.fill(); x.stroke();
  // electric badge on the hood
  circ(-52, -70, 13, '#ffd23f', INK, 3); T.bolt(-52, -70, .55, INK);
  // cab
  x.fillStyle = GRN; rr(-6, -176, 92, 136, 12); x.fill(); x.stroke();
  x.fillStyle = '#fff4e6'; rr(-12, -184, 104, 14, 6); x.fill(); x.stroke();                 // white roof
  x.fillStyle = '#d8f3ff'; x.lineWidth = 3; rr(4, -164, 70, 58, 9); x.fill(); x.stroke();     // window with the eyes
  x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 4; x.beginPath(); x.moveTo(56, -158); x.lineTo(68, -138); x.stroke();
  // eyes in the window (look left / at us)
  const lk = o.look ?? -2;
  if (blinkAt(t, .6)) { x.fillStyle = INK; x.fillRect(14, -132, 13, 3); x.fillRect(38, -132, 13, 3); }
  else if (o.strain) { x.strokeStyle = INK; x.lineWidth = 3; x.lineCap = 'round'; [20, 44].forEach(ex => { x.beginPath(); x.moveTo(ex - 6, -136); x.lineTo(ex + 5, -131); x.lineTo(ex - 6, -126); x.stroke(); }); }
  else { [20, 44].forEach(ex => { circ(ex + lk, -131, 7, INK); circ(ex + lk - 2, -133, 2.4, '#fff'); });
    x.strokeStyle = INK; x.lineWidth = 2.5; x.lineCap = 'round'; [20, 44].forEach(ex => { x.beginPath(); x.arc(ex, -140, 10, Math.PI + .7, -.7); x.stroke(); }); }
  // mouth on the grille side of the hood
  const m = o.mouth || 0;
  x.strokeStyle = INK; x.lineWidth = 3;
  if (m > .05) { x.fillStyle = INK; x.beginPath(); x.ellipse(-80, -58, 8, 3 + m * 5, 0, 0, 7); x.fill(); }
  else if (o.strain) { x.beginPath(); x.moveTo(-90, -58); x.lineTo(-70, -58); x.stroke(); }
  else { x.beginPath(); x.arc(-80, -66, 11, .35, Math.PI - .35); x.stroke(); }
  cheeks(-96, -62, 5); cheeks(-62, -62, 5);
  // name on the cab door
  x.fillStyle = '#fff'; x.font = C.FONT(18); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('TESSA', 40, -82);
  // fender + wheels (big back wheel, small front wheel)
  const roll = -(o.roll || 0);
  x.fillStyle = GRN2; x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.arc(44, -40, 64, Math.PI, 0); x.lineTo(108, -36); x.lineTo(-20, -36); x.closePath(); x.fill(); x.stroke();
  wheelT(44, -34, 54, roll); wheelT(-74, -18, 30, roll * 1.8);
  // near loader arm (in front)
  loaderArm(a, o.load, t, o.loadOh, o.strain, true);
  x.restore();
  return bucketAt(rx, a);
}
function wheelT(cx, cy, r, rot) {
  circ(cx, cy, r, '#2f3640', INK, 4);
  x.save(); x.translate(cx, cy); x.rotate(rot); x.fillStyle = '#4a5260';
  for (let i = 0; i < 12; i++) { x.save(); x.rotate(i * Math.PI / 6); x.fillRect(r - 7, -4, 9, 8); x.restore(); }
  x.restore();
  circ(cx, cy, r * .48, '#ffd23f', INK, 3); circ(cx, cy, r * .16, '#c99a00', INK, 2.5);
}
// loader arm from PIV; 'front' draws the near arm + bucket (with the pumpkin), back draws the far arm only
function loaderArm(a, load, t, oh, strain, front) {
  const [p0x, p0y] = PIV, ex = p0x - Math.cos(a) * LA, ey = p0y + Math.sin(a) * LA, off = front ? 0 : -6;
  x.lineCap = 'round';
  x.strokeStyle = INK; x.lineWidth = 15; x.beginPath(); x.moveTo(p0x + off, p0y + off); x.lineTo(ex + off, ey + off); x.stroke();
  x.strokeStyle = front ? '#ffd23f' : '#e0b400'; x.lineWidth = 8; x.beginPath(); x.moveTo(p0x + off, p0y + off); x.lineTo(ex + off, ey + off); x.stroke();
  if (!front) return;
  circ(p0x, p0y, 7, '#5c6370', INK, 3);
  // little hydraulic ram from the hood to the arm
  const mx = lerp(p0x, ex, .45), my = lerp(p0y, ey, .45);
  x.strokeStyle = INK; x.lineWidth = 7; x.beginPath(); x.moveTo(0, -64); x.lineTo(mx, my); x.stroke(); x.strokeStyle = "#cfd6dd"; x.lineWidth = 3; x.beginPath(); x.moveTo(0, -64); x.lineTo(mx, my); x.stroke();
  // bucket stays level: a scoop open to the top/left, floor at (ex, ey)
  x.save(); x.translate(ex, ey + (strain ? Math.sin(t * 40) * 1.5 : 0));
  if (load) pumpkin(-6, -4, SZ[load], t, { col: SCOL[load], noShadow: true, oh, ph: 2 });
  x.fillStyle = '#8a94a3'; x.strokeStyle = INK; x.lineWidth = 3.5;
  x.beginPath(); x.moveTo(-50, -14); x.lineTo(-44, 4); x.lineTo(30, 4); x.quadraticCurveTo(40, -20, 30, -44); x.lineTo(20, -44); x.quadraticCurveTo(26, -18, 18, -6); x.lineTo(-40, -6); x.closePath(); x.fill(); x.stroke();
  x.restore();
}

// ---------- keyframes for Tessa: [u, rx, a, load] ----------
function tKeys(keys, u) {
  if (u <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) if (u < keys[i][0]) {
    const A = keys[i - 1], B = keys[i], k = ease((u - A[0]) / (B[0] - A[0]));
    return [lerp(A[1], B[1], k), lerp(A[2], B[2], k), k > .5 ? B[3] : A[3], Math.abs(B[1] - A[1]) > 2];
  }
  const L = keys[keys.length - 1]; return [L[1], L[2], L[3], false];
}
const A_UP = aForY(368);                                     // carrying height
// one carry: from rx0 drive to the pumpkin in the patch, scoop it, carry it to its spot, set it down, back off to rxEnd
function carry(size, s, rx0, rxEnd, slow = 1) {
  const [ppx] = PATCH[size], [spx, spy] = STAND[size];
  const pickRx = rxFor(ppx + 6, A_GROUND), aSet = aForY(spy + 4), setRx = rxFor(spx + 6, aSet);
  return [[s, rx0, A_REST, null], [s + 2.4, pickRx, A_GROUND, null], [s + 3.2, pickRx, A_GROUND, size],
    [s + 3.2 + 1.2 * slow, pickRx, A_UP, size], [s + 3.2 + 1.2 * slow + 3.2, setRx, Math.min(A_UP, aSet - .05), size],
    [s + 3.2 + 1.2 * slow + 4.2, setRx, aSet, size], [s + 3.2 + 1.2 * slow + 4.8, setRx + 4, aSet + .02, null], [s + 3.2 + 1.2 * slow + 7.0, rxEnd, A_REST, null]];
}
const setTime = (s, slow = 1) => s + 3.2 + 1.2 * slow + 4.5;
const pickTime = s => s + 2.8;
// pumpkins on the ground / stand depending on what has happened
function pumpkins(t, placed, carried, o = {}) {
  ['small', 'medium', 'big'].forEach((sz, i) => {
    if (carried === sz) return;
    const [px, py] = placed.includes(sz) ? STAND[sz] : PATCH[sz];
    pumpkin(px, py, SZ[sz], t, { col: SCOL[sz], ph: i * .9, oh: o.oh === sz, squash: o.squash && o.squash[sz] || 0 });
  });
}

// parked scene: Toet stopped by the stand; draw.behind (in the scenery), draw.before (on the road, before Toet)
const parked = (draw) => drive({ segs: [[0, 0], [60, 0]], dist0: STOP, bx: BX, noLeaves: true,
  truck: (u, c) => Object.assign({ happy: true }, draw.truck ? draw.truck(u, c) : {}),
  behind: (u, c) => { stand(c.t); patch(c.t); draw.behind && draw.behind(u, c); },
  beforeTruck: (u, c) => draw.before && draw.before(u, c),
  front: (u, c) => draw.front && draw.front(u, c) });
const tTalk = c => c.talk('tessa');
// one size round: Tessa carries `size` (keys from carry()), placed = sizes already on the stand
function roundDraw(size, keys, placedBefore, slow = 1, strainWin = null) {
  return parked({
    behind: (u, c) => { const done = u >= setTime(keys[0][0], slow);
      const carried = u >= pickTime(keys[0][0]) && !done ? size : null;
      pumpkins(c.t, done ? [...placedBefore, size] : placedBefore, carried); },
    before: (u, c) => { const [rx, a, load, mv] = tKeys(keys, u); c.rx = rx;
      const strain = strainWin && u > strainWin[0] && u < strainWin[1];
      tractor(rx, RGY, c.t, { a, load, mouth: tTalk(c), moving: mv, roll: (rx - 860) / 24, strain, loadOh: strain }); } });
}
// recap cards SMALL / MEDIUM / BIG
function recap(u, a, end, t) {
  [['SMALL', 'light', 'small', '#f59f00'], ['MEDIUM', '', 'medium', '#e8590c'], ['BIG', 'heavy', 'big', '#c92a2a']].forEach(([w, v, sz, col], i) => {
    const k = clamp((u - a - i * 2.4) / .5) * clamp((end - u) / .8); if (k <= 0) return;
    const cx = 220 + i * 260;
    x.save(); x.globalAlpha = k; x.fillStyle = 'rgba(255,255,255,.93)'; x.strokeStyle = INK; x.lineWidth = 3; rr(cx - 105, 102, 210, 170, 18); x.fill(); x.stroke();
    pumpkin(cx, 226, { small: 27, medium: 38, big: 52 }[sz], t, { col: SCOL[sz], ph: i });
    x.restore();
    C.bigText(w, cx, 70, k, 44, col);
    if (v) { x.save(); x.globalAlpha = k; x.font = C.FONT(30); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = INK; x.fillText(v, cx, 250); x.restore(); }
  });
  C.bigText('Small, medium, big!', 480, 314, win(u, a + 6.4, end, .4), 42, '#ffd23f');
}

// ---------- timeline ----------
const R_IN = 830;                                      // Tessa's resting spot
const K_SMALL = carry('small', 1.0, R_IN, 700);
const K_MED = carry('medium', 1.0, 700, 720);
const K_BIG = carry('big', 1.4, 720, 760, 4.2);        // slow, heavy lift
const BIG_STRAIN = [4.8, 9.2];

St.episode({
  title: ["Toet's Helper Friends", 60], sub: 'Tessa the Tractor', accent: GRN2,
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'tractor', shift: 0 },
  thumb: ['Tessa the Tractor', 'Small, medium, big!'],
  shots: [
    // 0 – Toet drives to the farm, finds the pumpkin patch and the farm stand – but he can't lift the pumpkins
    { d: 26, draw: drive({ segs: [[0, 150], [4, 150], [7, 0], [60, 0]], bx: BX,
        truck: u => ({ happy: u < 15 || u > 21 }),
        behind: (u, c) => { x.save(); x.translate(-(c.dist - STOP), 0); stand(c.t); patch(c.t); pumpkins(c.t, [], null, { oh: u > 8.8 && u < 11 ? 'big' : null }); x.restore(); } }),
      says: [['toet', "Hi! I'm Little Truck Toet!", 5.2, 8.4, ...TB], ['toet', 'Look! A pumpkin patch!', 8.8, 11.8, ...TB],
             ['toet', 'The pumpkins go on the farm stand.', 12.2, 15.6, ...TB], ['toet', "But I can't lift them!", 16.0, 19.2, ...TB],
             ['toet', 'Who can help?', 19.6, 22.6, ...TB]],
      sfx: [[2, 'honk', .6], [9.0, 'twinkle:E6', .3], [16.4, 'sad', .3]] },

    // 1 – Tessa the Tractor rolls in
    { d: 20, draw: parked({
        behind: (u, c) => pumpkins(c.t, [], null),
        before: (u, c) => { const k = ease(clamp((u - .5) / 4.5)), rx = lerp(1220, R_IN, k); c.rx = rx;
          tractor(rx, RGY, c.t, { a: A_REST, mouth: tTalk(c), roll: (rx - R_IN) / 24, moving: u < 5 }); } }),
      says: [['tessa', "Hello! I'm Tessa the Tractor!", 5.4, 9.0, ...DB, 26], ['toet', 'Tessa, can you lift pumpkins?', 9.4, 12.8, ...TB],
             ['tessa', 'Yes! Small, medium and big!', 13.2, 16.8, ...DB], ['toet', 'Hooray!', 17.0, 19.4, ...TB]],
      sfx: [[.5, 'whoosh', .15, .7], [4.6, 'psss', .25, .4], [13.4, 'chime:A5', .3], [17.2, 'honk', .35]] },

    // 2 – SMALL: light – up it goes, onto the stand
    { d: 21, draw: roundDraw('small', K_SMALL, []),
      says: [['tessa', 'First, the small one!', .3, 2.6, ...DB], ['toet', 'It is so small!', 12.0, 15.0, ...TB],
             ['tessa', 'Small pumpkins are light!', 15.4, 19.0, ...DB]],
      big: NOTB([['SMALL', pickTime(1.0) + .4, 20.4, 480, 64, 56, '#f59f00']]),
      sfx: [[pickTime(1.0), 'clank', .25, .4], [pickTime(1.0) + .5, 'boing', .25, .3], [setTime(1.0), 'pop', .35, -.2], [setTime(1.0) + .3, 'chime:C6', .5], [15.6, 'twinkle:G6', .3]] },

    // 3 – MEDIUM: not small, not big
    { d: 21, draw: roundDraw('medium', K_MED, ['small']),
      says: [['tessa', 'Now the medium one!', .3, 2.6, ...DB], ['toet', 'Not small... not big...', 12.0, 15.0, ...TB],
             ['tessa', 'It is medium!', 15.4, 18.6, ...DB]],
      big: NOTB([['MEDIUM', pickTime(1.0) + .4, 20.4, 480, 64, 56, '#e8590c']]),
      sfx: [[pickTime(1.0), 'clank', .25, .4], [setTime(1.0), 'bump', .3, -.2], [setTime(1.0) + .3, 'chime:E6', .5], [15.6, 'twinkle:G6', .3]] },

    // 4 – BIG: heavy! Tessa lifts slowly ("Umph!") and sets it down next to the stand
    { d: 25, draw: roundDraw('big', K_BIG, ['small', 'medium'], 4.2, BIG_STRAIN),
      says: [['tessa', 'And now... the BIG one!', .3, 2.8, ...DB], ['tessa', 'Umph! It is heavy!', 5.0, 8.6, ...DB],
             ['toet', 'Wow! You are strong, Tessa!', 14.6, 18.0, ...TB], ['tessa', 'Big pumpkins are heavy!', 18.6, 22.4, ...DB]],
      big: NOTB([['BIG', pickTime(1.4) + .4, 24.4, 480, 64, 64, '#c92a2a']]),
      sfx: [[pickTime(1.4), 'clank', .3, .4], [5.2, 'psss', .2, .4], [6.6, 'squeak', .15, .4], [setTime(1.4, 4.2), 'bump', .45, 0], [setTime(1.4, 4.2) + .3, 'chime:G6', .5],
            [14.6, 'tada', .35]] },

    // 5 – recap SMALL / MEDIUM / BIG, Tessa drives away
    { d: 27, draw: parked({
        behind: (u, c) => pumpkins(c.t, ['small', 'medium', 'big'], null),
        before: (u, c) => { const k = ease(clamp((u - 14.6) / 5)), rx = lerp(760, 1260, k); c.rx = rx;
          tractor(rx, RGY, c.t, { a: A_REST, mouth: tTalk(c), roll: (rx - 760) / 24, moving: u > 14.6 && u < 19.6 }); } }),
      says: [['tessa', 'Bye bye! Beep beep!', 12.2, 15.4, 700, 176], ['toet', 'Thank you, Tessa!', 16.4, 19.8, ...TB]],
      after: (u, c) => recap(u, .8, 11.6, c.t),
      sfx: [[.8, 'chime:C6', .45], [3.2, 'chime:E6', .45], [5.6, 'chime:G6', .45], [7.4, 'twinkle:E6', .4], [14.6, 'whoosh', .15, .7], [19.8, 'honk', .45]] },
  ],
});
