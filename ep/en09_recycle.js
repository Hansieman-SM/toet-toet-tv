// Little Truck Toet – Toet's Helper Friends: Rosie the Recycling Truck (English story episode, approved "Helper Friends" idea).
// Toet finds trash along the road; Rosie the Recycling Truck (new character, original design) arrives with three bins:
// BLUE for paper (2), GREEN for glass (3 bottles), YELLOW for plastic (3) – colours, sorting and counting; the grass is clean again,
// flowers pop up, recap of the three bins, Rosie reverses away (beep, beep!). New music: recycle_long.
const C = require('../lib/common'), T = require('../lib/toet');
const St = require('../lib/story');
const { x, W, clamp, ease, lerp, win, circ, ell, rr, hash, INK } = C;
const { drive } = St;
const BX = 110, GY = 436, FY = 531;                         // Toet's bx; grass line behind the road; front grass line
const TB = [(u, c) => c.bx + 200, (u, c) => c.Tk.by - 175];
const RB = [800, 236];                                         // Rosie's speech bubble
const M1 = T.motion([[0, 150], [4, 150], [7, 0]]), STOP = M1.distAt(7);
const RX = 785, RGY = T.ROAD + 20;                             // Rosie parked (screen x, road contact line)
const BINS = [{ x: 410, col: '#3a86ff', dark: '#265fc0', word: 'BLUE', what: 'paper', icon: 'paper' },
              { x: 500, col: '#2fb35a', dark: '#1f7f3f', word: 'GREEN', what: 'glass', icon: 'glass' },
              { x: 590, col: '#ffcc1f', dark: '#d9a400', word: 'YELLOW', what: 'plastic', icon: 'plastic' }];
const BIN_TOP = GY - 88;
// trash on the front grass strip: screen x when Toet is parked, kind, bin, shot, flight time within that shot
const ITEMS = [
  { sx: 380, kind: 'paper', bin: 0, shot: 1, tf: 8.4 }, { sx: 660, kind: 'box', bin: 0, shot: 1, tf: 13.4 },
  { sx: 250, kind: 'bottle', bin: 1, shot: 2, tf: 8.6 }, { sx: 470, kind: 'bottle', bin: 1, shot: 2, tf: 12.2 }, { sx: 780, kind: 'bottle', bin: 1, shot: 2, tf: 15.8 },
  { sx: 235, kind: 'cup', bin: 2, shot: 3, tf: 8.8 }, { sx: 560, kind: 'pbottle', bin: 2, shot: 3, tf: 12.4 }, { sx: 880, kind: 'pot', bin: 2, shot: 3, tf: 16.0 }];
const FLY = 1.2;
const blinkAt = (t, off = 0) => (t + off) % 4.1 > 3.95;

// ---------- Rosie the Recycling Truck (original design, faces left). origin = road contact under the middle ----------
function wheel(wx, wy, r) {
  x.save(); x.translate(wx, wy);
  circ(0, 0, 22, INK); circ(0, 0, 11, '#dfe7ef');
  x.rotate(r); x.strokeStyle = INK; x.lineWidth = 3;
  for (let i = 0; i < 3; i++) { x.rotate(Math.PI * 2 / 3); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 10); x.stroke(); }
  x.restore();
}
function recycleSign(cx, cy, r, col = '#fff') {
  x.save(); x.translate(cx, cy); x.strokeStyle = col; x.fillStyle = col; x.lineWidth = r * .22; x.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    x.save(); x.rotate(i * Math.PI * 2 / 3);
    x.beginPath(); x.arc(0, 0, r, -Math.PI / 2 - .55, -Math.PI / 2 + .75); x.stroke();
    const a = -Math.PI / 2 + .95, hx = Math.cos(a) * r, hy = Math.sin(a) * r;
    x.save(); x.translate(hx, hy); x.rotate(a + Math.PI / 2);
    x.beginPath(); x.moveTo(r * .34, 0); x.lineTo(-r * .2, -r * .3); x.lineTo(-r * .2, r * .3); x.closePath(); x.fill(); x.restore();
    x.restore();
  }
  x.restore();
}
function rosie(px, gy, t, o = {}) {
  x.save(); x.translate(px, gy + (o.moving ? Math.sin(t * 12) * 1.5 : 0));
  x.fillStyle = 'rgba(0,0,0,.18)'; x.beginPath(); x.ellipse(0, 22, 150, 10, 0, 0, 7); x.fill();
  // body / container
  x.fillStyle = '#43aa8b'; x.strokeStyle = INK; x.lineWidth = 4; rr(-46, -132, 186, 122, 16); x.fill(); x.stroke();
  x.fillStyle = '#2d8a6e'; x.fillRect(-44, -40, 182, 10);
  x.fillStyle = '#e9fff6'; x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.arc(48, -86, 30, 0, 7); x.fill(); x.stroke();
  recycleSign(48, -86, 17, '#2d8a6e');
  x.fillStyle = '#ffffff'; x.font = C.FONT(24); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('ROSIE', 48, -48);
  // hopper at the back
  x.fillStyle = '#2d8a6e'; x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(140, -122); x.lineTo(160, -110); x.lineTo(160, -14); x.lineTo(140, -14); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = '#ffd23f'; [-104, -70, -36].forEach(y => { rr(146, y, 10, 18, 3); x.fill(); });
  // cab (front = left)
  x.fillStyle = '#ffffff'; x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(-50, -10); x.lineTo(-50, -100); x.quadraticCurveTo(-50, -112, -62, -112); x.lineTo(-102, -112);
  x.quadraticCurveTo(-120, -112, -128, -90); x.lineTo(-142, -50); x.quadraticCurveTo(-146, -40, -146, -30); x.lineTo(-146, -10); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = '#43aa8b'; x.fillRect(-144, -34, 92, 12);
  x.fillStyle = '#d8f3ff'; x.lineWidth = 3; x.beginPath(); x.moveTo(-64, -100); x.lineTo(-104, -100); x.quadraticCurveTo(-114, -100, -119, -88); x.lineTo(-129, -60); x.lineTo(-64, -60); x.closePath(); x.fill(); x.stroke();
  // beacon on the roof
  const on = o.moving && Math.sin(t * 9) > 0;
  x.fillStyle = on ? '#ffb703' : '#f6a04d'; x.strokeStyle = INK; x.lineWidth = 3; rr(-92, -126, 22, 14, 5); x.fill(); x.stroke();
  if (on) circ(-81, -119, 18, 'rgba(255,190,40,.35)');
  // face
  const lk = o.look || 0;
  if (blinkAt(t, .8)) { x.fillStyle = INK; x.fillRect(-100, -81, 12, 3); x.fillRect(-80, -81, 12, 3); }
  else { [-94, -74].forEach(ex => { circ(ex + lk, -79, 6.5, INK); circ(ex + lk - 2, -81, 2.2, '#fff'); });
    x.strokeStyle = INK; x.lineWidth = 2.5; x.lineCap = 'round'; [-94, -74].forEach(ex => { x.beginPath(); x.moveTo(ex - 5, -92); x.lineTo(ex - 9, -95); x.stroke(); }); }
  const m = o.mouth || 0;
  x.strokeStyle = INK; x.lineWidth = 3;
  if (m > .05) { x.fillStyle = INK; x.beginPath(); x.ellipse(-130, -36, 7, 4 + m * 5, 0, 0, 7); x.fill(); }
  else { x.beginPath(); x.arc(-126, -44, 11, Math.PI * .1 + .3, Math.PI - .25); x.stroke(); }
  circ(-140, -50, 5, 'rgba(255,90,110,.45)');
  x.fillStyle = '#fff6b0'; x.beginPath(); x.arc(-142, -22, 6, 0, 7); x.fill(); x.lineWidth = 2; x.stroke();
  x.fillStyle = INK; x.fillRect(-150, -14, 314, 12);
  const r = -(o.roll || 0);
  [-104, 40, 116].forEach(wx => wheel(wx, 4, r));
  x.restore();
}

// ---------- bins (origin = ground centre). lid 0..1 open, hop px ----------
function binIcon(kind, cx, cy, s = 1) {
  x.save(); x.translate(cx, cy); x.scale(s, s); x.strokeStyle = INK; x.lineWidth = 2;
  if (kind === 'paper') { x.fillStyle = '#fff'; rr(-11, -14, 22, 28, 3); x.fill(); x.stroke(); x.strokeStyle = '#8aa1b8'; [-6, 0, 6].forEach(y => { x.beginPath(); x.moveTo(-6, y); x.lineTo(6, y); x.stroke(); }); }
  else if (kind === 'glass') { x.fillStyle = '#e8fff0'; x.beginPath(); x.moveTo(-4, -16); x.lineTo(4, -16); x.lineTo(4, -8); x.quadraticCurveTo(10, -5, 10, 2); x.lineTo(10, 14); x.lineTo(-10, 14); x.lineTo(-10, 2); x.quadraticCurveTo(-10, -5, -4, -8); x.closePath(); x.fill(); x.stroke(); }
  else { x.fillStyle = '#fff'; x.beginPath(); x.moveTo(-11, -12); x.lineTo(11, -12); x.lineTo(8, 14); x.lineTo(-8, 14); x.closePath(); x.fill(); x.stroke(); x.strokeStyle = '#ff7a9a'; x.lineWidth = 3; x.beginPath(); x.moveTo(-10, -4); x.lineTo(10, -4); x.stroke(); }
  x.restore();
}
function bin(b, gy, lid = 0, hop = 0, glow = 0) {
  x.save(); x.translate(b.x, gy - hop);
  if (glow > 0) { x.fillStyle = `rgba(255,255,255,${.55 * glow})`; x.beginPath(); x.ellipse(0, -44, 54, 62, 0, 0, 7); x.fill(); }
  x.fillStyle = b.col; x.strokeStyle = INK; x.lineWidth = 3;
  x.beginPath(); x.moveTo(-34, -80); x.lineTo(34, -80); x.lineTo(29, -6); x.lineTo(-29, -6); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle = b.dark; x.lineWidth = 3; [-14, 14].forEach(a => { x.beginPath(); x.moveTo(a, -72); x.lineTo(a * .9, -14); x.stroke(); });
  circ(0, -44, 17, '#ffffff', INK, 2.5); binIcon(b.icon, 0, -44, .85);
  circ(-22, -3, 6, INK); circ(22, -3, 6, INK);
  // lid hinged at the back-right corner
  x.save(); x.translate(36, -82); x.rotate(lid * 1.15);
  x.fillStyle = b.dark; x.strokeStyle = INK; x.lineWidth = 3; rr(-74, -8, 76, 10, 4); x.fill(); x.stroke(); rr(-46, -14, 18, 7, 3); x.fill(); x.stroke();
  x.restore();
  x.restore();
}

// ---------- trash (origin = ground centre, ~40 wide) ----------
function trash(kind, cx, cy, s = 1, rot = 0) {
  x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(s, s); x.strokeStyle = INK; x.lineWidth = 2.5; x.lineJoin = 'round';
  if (kind === 'paper') { x.fillStyle = '#f4f1ea'; x.beginPath(); x.moveTo(-22, -2); x.lineTo(18, -6); x.lineTo(22, -22); x.lineTo(-18, -20); x.closePath(); x.fill(); x.stroke();
    x.strokeStyle = '#9aa7b5'; x.lineWidth = 2; [[-14, -9, 8], [-14, -14, 10]].forEach(([a, b, w]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(a + w, b - 1); x.stroke(); });
    x.fillStyle = '#9aa7b5'; x.fillRect(2, -18, 12, 8); }
  else if (kind === 'box') { x.fillStyle = '#d99a5b'; rr(-20, -24, 40, 24, 3); x.fill(); x.stroke(); x.fillStyle = '#e8b47c'; x.beginPath(); x.moveTo(-20, -24); x.lineTo(-28, -32); x.lineTo(-8, -32); x.lineTo(0, -24); x.closePath(); x.fill(); x.stroke();
    x.strokeStyle = '#b77b45'; x.lineWidth = 4; x.beginPath(); x.moveTo(0, -23); x.lineTo(0, -12); x.stroke(); }
  else if (kind === 'bottle') { x.fillStyle = 'rgba(47,179,90,.85)'; x.beginPath(); x.moveTo(-22, -16); x.lineTo(6, -16); x.quadraticCurveTo(12, -16, 14, -12); x.lineTo(24, -11); x.lineTo(24, -5); x.lineTo(14, -4); x.quadraticCurveTo(12, 0, 6, 0); x.lineTo(-22, 0); x.quadraticCurveTo(-26, -8, -22, -16); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = 'rgba(255,255,255,.55)'; rr(-16, -13, 18, 4, 2); x.fill(); }
  else if (kind === 'pbottle') { x.fillStyle = 'rgba(160,215,255,.9)'; x.beginPath(); x.moveTo(-22, -16); x.lineTo(8, -16); x.quadraticCurveTo(14, -16, 15, -11); x.lineTo(20, -11); x.lineTo(20, -5); x.lineTo(15, -5); x.quadraticCurveTo(14, 0, 8, 0); x.lineTo(-22, 0); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#ff5d8f'; rr(19, -13, 6, 10, 2); x.fill(); x.stroke(); x.fillStyle = '#ffffff'; rr(-14, -13, 14, 10, 2); x.fill(); }
  else if (kind === 'cup') { x.fillStyle = '#ffd6e0'; x.beginPath(); x.moveTo(-18, -22); x.lineTo(18, -22); x.lineTo(12, 0); x.lineTo(-12, 0); x.closePath(); x.fill(); x.stroke();
    x.strokeStyle = '#ff5d8f'; x.lineWidth = 3; x.beginPath(); x.moveTo(-16, -14); x.lineTo(16, -14); x.stroke(); x.strokeStyle = '#3a86ff'; x.beginPath(); x.moveTo(6, -22); x.lineTo(14, -38); x.stroke(); }
  else if (kind === 'pot') { x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(-15, -24); x.lineTo(15, -24); x.lineTo(12, 0); x.lineTo(-12, 0); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#8ecae6'; x.fillRect(-13.5, -16, 27, 7); x.fillStyle = '#d8d8d8'; rr(-17, -28, 34, 5, 2); x.fill(); x.stroke(); }
  x.restore();
}
function flower(cx, gy, k, col, t) {
  if (k <= 0) return; x.save(); x.translate(cx, gy); x.scale(k, k); x.rotate(Math.sin(t * 1.6 + cx) * .06);
  x.strokeStyle = '#2f8a46'; x.lineWidth = 3; x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -16); x.stroke();
  for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; circ(Math.cos(a) * 6, -20 + Math.sin(a) * 6, 4.5, col); }
  circ(0, -20, 3.5, '#ffd23f'); x.restore();
}

// state helpers
const binnedBefore = shot => ITEMS.filter(it => it.shot < shot);
function drawTrash(shot, u) {           // items still lying on the grass + the one in flight
  ITEMS.forEach((it, i) => {
    if (it.shot < shot) return;
    const rot = (hash(i) - .5) * .3;
    if (it.shot > shot || u < it.tf) { const wig = it.shot === shot && u > it.tf - .5 ? Math.sin(u * 30) * .08 : 0; trash(it.kind, it.sx, FY, 1.45, rot + wig); return; }
    const k = (u - it.tf) / FLY; if (k >= 1) return;
    const b = BINS[it.bin], e = ease(k);
    const px = lerp(it.sx, b.x, e), py = lerp(FY - 10, BIN_TOP - 6, e) - Math.sin(k * Math.PI) * 70;
    trash(it.kind, px, py + 10, 1.45 - k * .45, rot + k * Math.PI * 2);
  });
}
function lidAt(binI, shot, u) {
  let lid = 0; ITEMS.forEach(it => { if (it.shot !== shot || it.bin !== binI) return; lid = Math.max(lid, ease(clamp((u - it.tf + .5) / .4)) * clamp((it.tf + FLY + .5 - u) / .4)); }); return lid;
}
function hopAt(binI, shot, u) {
  let h = 0; ITEMS.forEach(it => { if (it.shot !== shot || it.bin !== binI) return; const v = u - it.tf - FLY; if (v > 0 && v < .4) h = Math.sin(v / .4 * Math.PI) * 7; }); return h;
}
function landSparkles(shot, u, t) {
  ITEMS.forEach(it => { if (it.shot !== shot) return; const v = u - it.tf - FLY; if (v > 0 && v < .8) C.sparkles(BINS[it.bin].x, BIN_TOP, t, 8, 46); });
}
function drawBins(shot, u, glowBin = -1, popT = null) {
  BINS.forEach((b, i) => {
    let s = 1;
    if (popT) { const k = clamp((u - popT[i]) / .35); if (k <= 0) return; s = ease(k) + Math.sin(k * Math.PI) * .2; }
    x.save(); x.translate(b.x, GY); x.scale(s, s); x.translate(-b.x, -GY);
    bin(b, GY, lidAt(i, shot, u), hopAt(i, shot, u), i === glowBin ? .6 + .4 * Math.sin(u * 3) : 0);
    x.restore();
  });
}
// parked scene for the sorting shots
const parked = (shot, glowBin, extra = {}) => drive({ segs: [[0, 0], [60, 0]], dist0: STOP, bx: BX, noLeaves: true,
  truck: u => ({ happy: true }),
  behind: (u, c) => drawBins(shot, u, glowBin),
  beforeTruck: (u, c) => rosie(extra.rx ? extra.rx(u) : RX, RGY, c.t, { mouth: c.talk('rosie'), roll: extra.rx ? (extra.rx(u) - RX) / 22 : 0, moving: extra.rx ? extra.mv(u) : false }),
  front: (u, c) => { drawTrash(shot, u); landSparkles(shot, u, c.t); extra.front && extra.front(u, c); } });
const counts = (shot) => ITEMS.filter(it => it.shot === shot).map((it, n) => [String(n + 1), it.tf + FLY, it.tf + FLY + 2.4, BINS[it.bin].x, 200, 84, BINS[it.bin].col]);
const flySfx = (shot, notes) => ITEMS.filter(it => it.shot === shot).flatMap((it, n) => [[it.tf - .3, 'honk', .35], [it.tf, 'whoosh:0.8', .35], [it.tf + FLY, 'pop', .6], [it.tf + FLY + .1, `chime:${notes[n]}`, .45]]);

// recap panels: bin + colour word + what goes in
function recap(u, a, end, t) {
  BINS.forEach((b, i) => {
    const k = clamp((u - a - i * 2.6) / .5) * clamp((end - u) / .8); if (k <= 0) return;
    const cx = 230 + i * 250;
    x.save(); x.globalAlpha = k; x.fillStyle = 'rgba(255,255,255,.9)'; x.strokeStyle = INK; x.lineWidth = 3; rr(cx - 105, 98, 210, 132, 18); x.fill(); x.stroke();
    x.save(); x.translate(cx - 44, 214); x.scale(.82, .82); x.translate(-b.x, -GY); bin(b, GY); x.restore();
    const kinds = ITEMS.filter(it => it.bin === i).map(it => it.kind);
    x.restore();
    // what goes in: little pictures stacked on the right
    x.save(); x.globalAlpha = k; kinds.forEach((kd, j) => trash(kd, cx + 46, 140 + j * 30 + (kinds.length === 2 ? 14 : 0), .78)); x.restore();
    C.bigText(b.word, cx, 64, k, 44, b.col);
    C.bigText(b.what, cx, 262, k, 34, '#ffffff');
  });
}

St.episode({
  title: ["Toet's Helper Friends", 60], sub: 'Rosie the Recycling Truck', accent: '#2d8a6e',
  end: ['See you next time!', 70], endSub: 'Toet Toet and Friends TV',
  music: { kind: 'recycle', shift: 0 },
  thumb: ['Rosie the Recycling Truck', 'Blue, green, yellow!'],
  shots: [
    // 0 – Toet stops at a grassy spot full of trash; Rosie arrives with her three bins
    { d: 34, draw: drive({ segs: [[0, 150], [4, 150], [7, 0], [60, 0]], bx: BX,
        truck: u => ({ happy: u < 8.8 || u > 21 }),
        behind: (u, c) => { if (u > 26) { x.save(); x.translate(-(STOP - c.dist), 0); drawBins(0, u, -1, [26.4, 26.8, 27.2]); x.restore(); } },
        beforeTruck: (u, c) => { if (u < 16.8) return; const k = ease(clamp((u - 16.8) / 4.2)), rx = lerp(1180, RX, k);
          rosie(rx, RGY, c.t, { mouth: c.talk('rosie'), roll: (rx - RX) / 22, moving: u < 21 }); },
        front: (u, c) => { x.save(); x.translate(-(c.dist - STOP), 0); drawTrash(1, -1); x.restore(); } }),
      says: [['toet', "Hi! I'm Little Truck Toet!", 5.2, 8.6, ...TB], ['toet', 'Oh no! Look at all this trash!', 9.0, 12.6, ...TB],
             ['toet', 'Who can help?', 13.0, 15.8, ...TB], ['rosie', "Hello! I'm Rosie the Recycling Truck!", 21.6, 25.4, ...RB, 26],
             ['rosie', 'Here are my three bins!', 25.8, 29.0, ...RB], ['toet', "Let's sort the trash together!", 29.4, 33.2, ...TB]],
      sfx: [[2, 'honk', .6], [9.2, 'sad', .35], [16.6, 'honk', .35, .7], [17.3, 'honk', .4, .6], [20.6, 'psss', .3, .4],
            [26.4, 'pop', .55], [26.8, 'pop', .55], [27.2, 'pop', .55], [27.7, 'tada', .4]] },

    // 1 – BLUE bin for PAPER: a newspaper and a box
    { d: 23, draw: parked(1, 0),
      says: [['rosie', 'Paper goes in the BLUE bin!', .6, 4.4, ...RB], ['toet', 'I see a newspaper!', 5.0, 8.0, ...TB],
             ['toet', 'And a box!', 10.4, 13.0, ...TB], ['rosie', 'Two things in the BLUE bin!', 15.6, 19.2, ...RB], ['toet', 'Yay!', 19.6, 21.8, ...TB]],
      big: [['BLUE', 1.0, 5.0, 480, 96, 72, '#3a86ff'], ...counts(1)],
      sfx: [[1.0, 'chime:C6', .4], ...flySfx(1, ['C6', 'E6']), [15.8, 'tada', .35]] },

    // 2 – GREEN bin for GLASS: three bottles
    { d: 27, draw: parked(2, 1),
      says: [['rosie', 'Glass goes in the GREEN bin!', .6, 4.4, ...RB], ['toet', "Bottles! Let's count!", 5.0, 8.2, ...TB],
             ['toet', 'Three bottles!', 18.0, 21.2, ...TB], ['rosie', 'Great counting, Toet!', 21.6, 25.0, ...RB]],
      big: [['GREEN', 1.0, 5.0, 480, 96, 72, '#2fb35a'], ...counts(2)],
      sfx: [[1.0, 'chime:D6', .4], ...flySfx(2, ['C6', 'E6', 'G6']), [18.1, 'tada', .35]] },

    // 3 – YELLOW bin for PLASTIC: a cup, a bottle and a pot
    { d: 27, draw: parked(3, 2),
      says: [['rosie', 'Plastic goes in the YELLOW bin!', .6, 4.4, ...RB], ['toet', 'A cup, a bottle and a pot!', 5.0, 8.4, ...TB],
             ['rosie', 'Hooray! All sorted!', 18.2, 21.6, ...RB], ['toet', 'The grass is clean again!', 22.0, 25.6, ...TB]],
      big: [['YELLOW', 1.0, 5.0, 480, 96, 72, '#ffb703'], ...counts(3)],
      sfx: [[1.0, 'chime:E6', .4], ...flySfx(3, ['C6', 'E6', 'G6']), [18.3, 'cheer', .4]] },

    // 4 – flowers pop up, recap of the three bins, thank you, Rosie reverses away (beep, beep!)
    { d: 40, draw: parked(4, -1, { rx: u => lerp(RX, 1200, ease(clamp((u - 27.6) / 5))), mv: u => u > 27.6 && u < 32.6,
        front: (u, c) => { ITEMS.forEach((it, i) => flower(it.sx + 14, FY + 2, ease(clamp((u - 1 - i * .25) / .5)) * 1.1, ['#ff5d8f', '#ffd23f', '#ffffff', '#9b5de5'][i % 4], c.t));
          if (u > 1 && u < 3.5) C.sparkles(520, 500, c.t, 12, 300); } }),
      says: [['rosie', 'Thank you for helping, Toet!', 18.4, 22.0, ...RB], ['toet', "You're welcome, Rosie!", 22.4, 25.6, ...TB],
             ['rosie', 'Beep, beep! Bye bye!', 26.6, 30.0, 760, 236], ['toet', "Let's keep our world clean!", 30.4, 34.0, ...TB]],
      after: (u, c) => recap(u, 4.2, 17.6, c.t),
      sfx: [[1.0, 'twinkle:E6', .4], [1.5, 'twinkle:G6', .35], [4.2, 'chime:C6', .45], [6.8, 'chime:E6', .45], [9.4, 'chime:G6', .45],
            [28, 'chime:A6', .25, .5], [28.8, 'chime:A6', .25, .6], [29.6, 'chime:A6', .25, .7], [30.4, 'chime:A6', .2, .8], [33, 'honk', .45]] },
  ],
});
