process.env.TOET_LANG = 'en';
// Rendert Truckje Toet als 1920x1080 video (30 fps) en schrijft ruwe frames naar stdout of een PNG.
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
GlobalFonts.registerFromPath(__dirname + '/fonts/Baloo2.ttf', 'Baloo2');

const OUT_W = +(process.env.OW || 1920), OUT_H = +(process.env.OH || 1080);
const W = 960, H = 540, FPS = 30, DUR = 60, ROAD = 440, SPEED = 150;
const HONKS = [3.0, 19.0, 34.5, 51.0];
const canvas = createCanvas(OUT_W, OUT_H), x = canvas.getContext('2d');
x.setTransform(OUT_W / W, 0, 0, OUT_H / H, 0, 0);

const hash = n => { const s = Math.sin(n * 127.1 + 31.7) * 43758.5453; return s - Math.floor(s); };
const lerp = (a, b, k) => a + (b - a) * k;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = k => k * k * (3 - 2 * k);
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, k) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], k))).join(',')})`; };
const FONT = s => `bold ${s}px Baloo2`;

const KEYS = [[0,'#5bb8f0','#cdeeff',0],[.42,'#5bb8f0','#cdeeff',0],[.52,'#e9725a','#ffd08a',.25],[.62,'#121c44','#2c3c78',1],[.86,'#121c44','#2c3c78',1],[.95,'#e889b0','#ffdcae',.3],[1,'#5bb8f0','#cdeeff',0]];
function sky(p) {
  for (let i = 0; i < KEYS.length - 1; i++) { const a = KEYS[i], b = KEYS[i + 1];
    if (p >= a[0] && p <= b[0]) { const k = (p - a[0]) / (b[0] - a[0] || 1); return { top: mix(a[1], b[1], k), bot: mix(a[2], b[2], k), night: lerp(a[3], b[3], k) }; } }
  return { top: KEYS[0][1], bot: KEYS[0][2], night: 0 };
}
function roundRect(a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }

let t = 0, dist = 0;
function hills(par, base, amp, f, col, seed) {
  const off = dist * par; x.fillStyle = col; x.beginPath(); x.moveTo(0, H);
  for (let i = 0; i <= W; i += 6) { const u = (i + off) * f; x.lineTo(i, base - amp * (Math.sin(u + seed) * .6 + Math.sin(u * 2.3 + seed * 2) * .3 + Math.sin(u * .5) * .4)); }
  x.lineTo(W, H); x.closePath(); x.fill();
}
function cloud(cx, cy, s) {
  x.fillStyle = 'rgba(255,255,255,.92)'; x.beginPath();
  [[0,0,28],[30,-14,34],[64,0,26],[32,8,30]].forEach(([a,b,r]) => { x.moveTo(cx + a*s + r*s, cy + b*s); x.arc(cx + a*s, cy + b*s, r*s, 0, 7); });
  x.fill();
}
function windmill(px, py, s, rot) {
  x.save(); x.translate(px, py); x.scale(s, s);
  x.fillStyle = '#6b4f3a'; x.beginPath(); x.moveTo(-16,0); x.lineTo(16,0); x.lineTo(9,-70); x.lineTo(-9,-70); x.fill();
  x.fillStyle = '#3b2a20'; x.beginPath(); x.moveTo(-13,-70); x.lineTo(13,-70); x.lineTo(0,-86); x.fill();
  x.fillStyle = '#ffe9b8'; x.fillRect(-4,-30,8,12);
  x.translate(0,-72); x.rotate(rot);
  for (let i = 0; i < 4; i++) { x.rotate(Math.PI/2); x.fillStyle = '#f6f1e7'; x.fillRect(-2,0,4,56); x.fillStyle = '#d9cfbd'; x.fillRect(2,14,12,40); x.strokeStyle = '#8a7a66'; x.lineWidth = 1; x.strokeRect(2,14,12,40); }
  x.fillStyle = '#3b2a20'; x.beginPath(); x.arc(0,0,5,0,7); x.fill();
  x.restore();
}
function tree(px, py, s, k) {
  x.fillStyle = '#7a5134'; x.fillRect(px - 4*s, py - 30*s, 8*s, 30*s);
  x.fillStyle = k > .5 ? '#2f9e5a' : '#3fb36a';
  x.beginPath(); x.arc(px, py - 44*s, 24*s, 0, 7); x.arc(px - 14*s, py - 32*s, 16*s, 0, 7); x.arc(px + 14*s, py - 32*s, 16*s, 0, 7); x.fill();
}
function cow(px, py, s, ph) {
  x.save(); x.translate(px, py); x.scale(s, s);
  const chew = Math.sin(ph) * 1.5;
  x.fillStyle = '#fff'; x.strokeStyle = '#1d3557'; x.lineWidth = 2.5;
  [-18, -8, 10, 20].forEach(lx => { x.fillRect(lx-3,-8,6,14); x.strokeRect(lx-3,-8,6,14); });
  x.beginPath(); x.ellipse(0,-20,30,17,0,0,7); x.fill(); x.stroke();
  x.fillStyle = '#1d3557'; x.beginPath(); x.ellipse(-8,-24,9,7,.4,0,7); x.fill(); x.beginPath(); x.ellipse(13,-16,7,6,0,0,7); x.fill();
  x.fillStyle = '#fff'; x.beginPath(); x.ellipse(34,-28+chew*.3,13,11,0,0,7); x.fill(); x.stroke();
  x.fillStyle = '#ffb3c1'; x.beginPath(); x.ellipse(42,-24+chew*.3,7,6,0,0,7); x.fill();
  x.fillStyle = '#1d3557'; x.beginPath(); x.arc(33,-32,2.2,0,7); x.fill();
  x.restore();
}
function sheep(px, py, s) {
  x.save(); x.translate(px, py); x.scale(s, s);
  x.fillStyle = '#1d3557'; x.fillRect(-12,-8,4,10); x.fillRect(8,-8,4,10);
  x.fillStyle = '#fffaf0'; x.beginPath(); [[-12,-16],[0,-22],[12,-16],[0,-12]].forEach(([a,b]) => { x.moveTo(a+12,b); x.arc(a,b,12,0,7); }); x.fill();
  x.fillStyle = '#1d3557'; x.beginPath(); x.ellipse(22,-18,7,6,0,0,7); x.fill();
  x.restore();
}
function wheel(wx, wy, r) {
  x.save(); x.translate(wx, wy);
  x.fillStyle = '#1d3557'; x.beginPath(); x.arc(0,0,22,0,7); x.fill();
  x.fillStyle = '#dfe7ef'; x.beginPath(); x.arc(0,0,11,0,7); x.fill();
  x.rotate(r); x.strokeStyle = '#1d3557'; x.lineWidth = 3;
  for (let i = 0; i < 3; i++) { x.rotate(Math.PI*2/3); x.beginPath(); x.moveTo(0,0); x.lineTo(0,10); x.stroke(); }
  x.restore();
}
const honking = () => HONKS.some(h => t >= h && t < h + 1.3);
const honkStart = () => HONKS.find(h => t >= h && t < h + 1.3);
function blinking() { const cyc = t % 3.7; return cyc > 3.55; }

function truck(n) {
  const bx = 310, by = ROAD + 20 + Math.sin(t * 13) * 1.6 - (honking() ? Math.max(0, Math.sin((t - honkStart()) * 9)) * 5 * Math.exp(-(t - honkStart()) * 2) : 0);
  const wr = t * SPEED / 22;
  x.save(); x.translate(bx, by);
  x.fillStyle = 'rgba(0,0,0,.18)'; x.beginPath(); x.ellipse(70,22,150,10,0,0,7); x.fill();
  x.fillStyle = '#ffd23f'; roundRect(-70,-120,190,110,14); x.fill(); x.strokeStyle = '#1d3557'; x.lineWidth = 4; x.stroke();
  x.fillStyle = '#1d3557'; x.font = FONT(42); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('TOET', 48, -62);
  x.fillStyle = '#2fb36a'; x.fillRect(-68,-30,186,10);
  x.fillStyle = '#2fb36a'; x.beginPath(); x.arc(-34,-64,22,0,7); x.fill(); x.lineWidth = 3; x.stroke(); bolt(-34,-64,1,'#ffd23f');
  x.fillStyle = '#ff7a45'; x.beginPath(); x.moveTo(126,-10); x.lineTo(126,-100); x.quadraticCurveTo(126,-112,138,-112); x.lineTo(178,-112);
  x.quadraticCurveTo(196,-112,204,-90); x.lineTo(218,-50); x.quadraticCurveTo(222,-40,222,-30); x.lineTo(222,-10); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = '#d8f3ff'; x.beginPath(); x.moveTo(140,-100); x.lineTo(180,-100); x.quadraticCurveTo(190,-100,195,-88); x.lineTo(205,-60); x.lineTo(140,-60); x.closePath(); x.fill(); x.lineWidth = 3; x.stroke();
  x.fillStyle = '#1d3557';
  if (blinking()) { x.fillRect(158,-80,12,3); x.fillRect(180,-80,12,3); }
  else { x.beginPath(); x.arc(164,-79,6,0,7); x.arc(186,-79,6,0,7); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.arc(166,-81,2,0,7); x.arc(188,-81,2,0,7); x.fill(); }
  x.strokeStyle = '#1d3557'; x.lineWidth = 3;
  if (honking()) { x.fillStyle = '#1d3557'; x.beginPath(); x.ellipse(205,-36,7,9,0,0,7); x.fill(); }
  else { x.beginPath(); x.arc(200,-42,10,.2,Math.PI-.4); x.stroke(); }
  x.fillStyle = 'rgba(255,90,110,.45)'; x.beginPath(); x.arc(214,-50,5,0,7); x.fill();
  x.fillStyle = n > .3 ? '#fff6b0' : '#fff'; x.beginPath(); x.arc(218,-22,6,0,7); x.fill(); x.lineWidth = 2; x.stroke();
  x.fillStyle = '#1d3557'; x.fillRect(-74,-14,300,12);
  x.fillStyle = '#1d3557'; roundRect(134,-46,16,22,4); x.fill(); x.fillStyle = '#2fb36a'; x.beginPath(); x.arc(142,-35,4,0,7); x.fill();
  [-30, 70, 180].forEach(wx => wheel(wx, 4, wr));
  x.restore();
  return { bx, by };
}

function bolt(cx, cy, s, col) {
  x.save(); x.translate(cx, cy); x.scale(s, s); x.fillStyle = col;
  x.beginPath(); x.moveTo(3,-15); x.lineTo(-9,3); x.lineTo(-1,3); x.lineTo(-4,15); x.lineTo(9,-4); x.lineTo(1,-4); x.lineTo(5,-15); x.closePath(); x.fill();
  x.restore();
}
function leaf(px, py, rot, a, s) {
  x.save(); x.translate(px, py); x.rotate(rot); x.globalAlpha = a; x.scale(s, s);
  x.fillStyle = '#3fbf6e'; x.beginPath(); x.moveTo(-7,0); x.quadraticCurveTo(0,-7,7,0); x.quadraticCurveTo(0,7,-7,0); x.fill();
  x.strokeStyle = '#1f7a45'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(-6,0); x.lineTo(6,0); x.stroke();
  x.restore();
}
function charger(px, py) {
  x.fillStyle = '#e8f6ee'; x.strokeStyle = '#1d3557'; x.lineWidth = 2.5;
  roundRect(px-12, py-58, 24, 58, 6); x.fill(); x.stroke();
  x.fillStyle = '#2fb36a'; roundRect(px-8, py-52, 16, 16, 3); x.fill();
  bolt(px, py-44, .45, '#ffffff');
  x.strokeStyle = '#1d3557'; x.lineWidth = 3; x.beginPath(); x.moveTo(px+12, py-24); x.quadraticCurveTo(px+26, py-12, px+18, py); x.stroke();
}
// blaadjes achter de truck (deterministisch)
let puffs = [], seed = 1;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function stepPuffs(dt) {
  if (rnd() < dt * 3) puffs.push({ x: 236, y: ROAD - 40 - rnd() * 60, r: rnd() * 6, a: 1, s: 1.5 + rnd() * .8, w: rnd() * 6 });
  puffs.forEach(q => { q.x -= (SPEED * .6 + 30) * dt; q.w += dt * 3; q.y += (Math.sin(q.w) * 30 + 12) * dt; q.r += dt * 4; q.a -= .35 * dt; });
  puffs = puffs.filter(q => q.a > 0);
}

function card(lines, k) {
  // k: 0..1 zichtbaarheid
  if (k <= 0) return;
  const s = .6 + .4 * ease(k);
  x.save(); x.globalAlpha = clamp(k * 1.5); x.translate(W / 2, 170); x.scale(s, s);
  x.fillStyle = '#ffffff'; x.strokeStyle = '#1d3557'; x.lineWidth = 6;
  roundRect(-340, -95, 680, 190, 40); x.fill(); x.stroke();
  x.textAlign = 'center'; x.textBaseline = 'middle';
  lines.forEach(([txt, size, col, y]) => { x.fillStyle = col; x.font = FONT(size); x.fillText(txt, 0, y); });
  x.restore();
}

function draw() {
  const p = (0.1 + t / 54) % 1, s = sky(p), n = s.night;
  const g = x.createLinearGradient(0, 0, 0, ROAD); g.addColorStop(0, s.top); g.addColorStop(1, s.bot);
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  if (n > .05) for (let i = 0; i < 70; i++) { const tw = .5 + .5 * Math.sin(t * 3 + i); x.fillStyle = `rgba(255,255,230,${n * tw})`; x.fillRect(hash(i) * W, hash(i + 99) * 260, 2, 2); }
  if (p < .58) { const k = p / .58, sx = lerp(-40, W + 40, k), sy = 320 - Math.sin(k * Math.PI) * 250;
    x.fillStyle = 'rgba(255,220,90,.35)'; x.beginPath(); x.arc(sx, sy, 62, 0, 7); x.fill();
    x.fillStyle = '#ffd23f'; x.beginPath(); x.arc(sx, sy, 42, 0, 7); x.fill(); }
  else { const k = (p - .58) / .42, mx = lerp(-40, W + 40, k), my = 320 - Math.sin(k * Math.PI) * 240;
    x.fillStyle = '#fff6d6'; x.beginPath(); x.arc(mx, my, 30, 0, 7); x.fill();
    x.fillStyle = s.top; x.beginPath(); x.arc(mx + 12, my - 6, 26, 0, 7); x.fill(); }
  for (let i = 0; i < 5; i++) { const span = W + 300; const cx = ((hash(i + 5) * span - (dist * .12 + t * 8) * (.6 + hash(i) * .6)) % span + span) % span - 150; cloud(cx, 50 + hash(i + 11) * 120, .7 + hash(i + 3) * .6); }
  if (n < .5) { x.strokeStyle = `rgba(29,53,87,${.8 * (1 - n * 2)})`; x.lineWidth = 2.5;
    for (let i = 0; i < 3; i++) { const bx = ((t * 40 + i * 90) % (W + 200)) - 100, byy = 110 + i * 18 + Math.sin(t * 2 + i) * 8, f = Math.sin(t * 10 + i) * 6;
      x.beginPath(); x.moveTo(bx - 10, byy - f); x.quadraticCurveTo(bx - 4, byy - 4, bx, byy); x.quadraticCurveTo(bx + 4, byy - 4, bx + 10, byy - f); x.stroke(); } }
  hills(.2, 330, 30, .006, '#8fcf9f', 1);
  const mSp = 360, mOff = dist * .3;
  for (let k = Math.floor(mOff / mSp) - 1; k <= Math.floor((mOff + W) / mSp) + 1; k++) windmill(k * mSp - mOff + hash(k) * 120, 345, .8 + hash(k + 7) * .3, t * (1.2 + hash(k) * .6) + k);
  hills(.45, 380, 22, .009, '#6dbb7c', 4);
  const tSp = 150, tOff = dist * .6;
  for (let k = Math.floor(tOff / tSp) - 1; k <= Math.floor((tOff + W) / tSp) + 1; k++) { const r = hash(k * 3.1), px = k * tSp - tOff + r * 60;
    if (r < .55) tree(px, 412, .8 + hash(k + 1) * .4, hash(k + 2)); else if (r < .74) cow(px, 414, .8, t * 4 + k); else if (r < .9) sheep(px, 412, .9); else charger(px, 414); }
  x.fillStyle = '#57a865'; x.fillRect(0, 412, W, 28);
  x.fillStyle = '#4a5466'; x.fillRect(0, ROAD, W, 70);
  x.fillStyle = '#ffffff'; const dOff = dist % 80; for (let i = -1; i < W / 80 + 1; i++) x.fillRect(i * 80 - dOff, ROAD + 33, 44, 5);
  x.fillStyle = '#3e9a52'; x.fillRect(0, ROAD + 70, W, H - ROAD - 70);
  const fSp = 46, fOff = dist * 1.3;
  for (let k = Math.floor(fOff / fSp) - 1; k <= Math.floor((fOff + W) / fSp) + 1; k++) { x.fillStyle = ['#ff7a45','#ffd23f','#ffffff','#ff9ec4'][Math.floor(hash(k + 4) * 4)]; x.beginPath(); x.arc(k * fSp - fOff, ROAD + 80 + hash(k) * 18, 4, 0, 7); x.fill(); }
  
  if (n > 0) { x.fillStyle = `rgba(14,20,60,${n * .45})`; x.fillRect(0, 0, W, H); }
  puffs.forEach(q => leaf(q.x, q.y, q.r, clamp(q.a), q.s));
  const T = truck(n);
  if (n > .2) { const lg = x.createLinearGradient(T.bx + 228, 0, T.bx + 520, 0); lg.addColorStop(0, `rgba(255,245,170,${n * .55})`); lg.addColorStop(1, 'rgba(255,245,170,0)');
    x.fillStyle = lg; x.beginPath(); x.moveTo(T.bx + 226, T.by - 24); x.lineTo(T.bx + 560, T.by - 70); x.lineTo(T.bx + 560, T.by + 30); x.closePath(); x.fill(); }
  if (honking()) { const hs = honkStart(), pop = ease(clamp((t - hs) * 6)), out = clamp((hs + 1.3 - t) * 5);
    x.save(); x.globalAlpha = out; x.translate(T.bx + 190, T.by - 190); x.scale(pop, pop);
    x.fillStyle = '#fff'; x.strokeStyle = '#1d3557'; x.lineWidth = 4; roundRect(-10, -36, 190, 62, 24); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(20, 26); x.lineTo(8, 52); x.lineTo(44, 26); x.fill();
    x.beginPath(); x.moveTo(20, 27); x.lineTo(8, 52); x.lineTo(44, 27); x.stroke();
    x.fillStyle = '#ff7a45'; x.font = FONT(36); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText("Toot toot!", 85, -4);
    x.restore(); }
  // titel en eindkaart
  const tk = t < 2.6 ? clamp((t - .3) / .7) : clamp((4.6 - t) / .6);
  card([["Little Truck Toet", 74, '#ff7a45', -18], ["drives electric!", 44, '#1d3557', 50]], tk);
  const ek = clamp((t - 54.5) / .7);
  card([["See you next time!", 58, '#ff7a45', -22], ["Toot toot!", 44, '#1d3557', 44]], ek);
  // zwart in/uit
  const fade = Math.max(clamp(1 - t / .5), clamp((t - (DUR - 1)) / 1));
  if (fade > 0) { x.fillStyle = `rgba(0,0,0,${fade})`; x.fillRect(0, 0, W, H); }
}

if (process.env.STILL) {
  // rendert één beeld op tijdstip STILL naar het opgegeven pad
  const target = +process.env.STILL, dt = 1 / FPS;
  for (t = 0; t < target; t += dt) { dist += SPEED * dt; stepPuffs(dt); }
  t = target; draw();
  require('fs').writeFileSync(process.argv[2], canvas.toBuffer('image/png'));
} else {
  const total = FPS * DUR, dt = 1 / FPS;
  let i = 0;
  const out = process.stdout;
  (function next() {
    while (i < total) {
      t = i / FPS; draw();
      const buf = Buffer.from(x.getImageData(0, 0, OUT_W, OUT_H).data.buffer);
      i++; dist += SPEED * dt; stepPuffs(dt);
      if (!out.write(buf)) { out.once('drain', next); return; }
    }
    out.end();
  })();
}
