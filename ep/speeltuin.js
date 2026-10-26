// Spelen in de speeltuin! 60 s. Camera schuift langs vijf speelplekken.
const C = require('../lib/common'), K = require('../lib/kids');
const { x, W, H, clamp, ease, win, lerp, hash, rr } = C;
const KD = K.KIDS, INK = '#2b2d42';
const DUR = 60, G = 470, KS = 1.25;
const ST = [480, 1260, 2040, 2820, 3600];             // middens van de speelplekken (wereld-x)
const HOLD = [[0, 13], [16, 24.5], [27.5, 35.5], [38.5, 46.5], [49.5, 60]];

function camX(t) {
  for (let i = 0; i < ST.length; i++) {
    const [a, b] = HOLD[i];
    if (t <= b) {
      if (t >= a || i === 0) return ST[i] - 480;
      const [, pb] = HOLD[i - 1]; return lerp(ST[i - 1], ST[i], ease((t - pb) / (a - pb))) - 480;
    }
  }
  return ST[ST.length - 1] - 480;
}
const blink = (t, o) => (t + o) % 3.7 > 3.55;
function child(k, px, py, p = {}, s = KS) { x.save(); x.translate(px, py); x.scale(s, s); K.kid(k, p); x.restore(); }
function shadow(px, w = 30) { x.fillStyle = 'rgba(0,0,0,.13)'; x.beginPath(); x.ellipse(px, G + 2, w, 6, 0, 0, 7); x.fill(); }
function strokeLine(pts, lw, col) { x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(p => x.lineTo(p[0], p[1])); x.lineWidth = lw; x.strokeStyle = col; x.lineCap = 'round'; x.lineJoin = 'round'; x.stroke(); }

// ---------------- decor ----------------
function sky(cx) {
  const g = x.createLinearGradient(0, 0, 0, G); g.addColorStop(0, '#6cc4f5'); g.addColorStop(1, '#d9f2ff');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  C.circ(820, 85, 64, 'rgba(255,220,90,.3)'); C.circ(820, 85, 42, '#ffd23f');
  for (let i = 0; i < 6; i++) {
    const span = 1500, px = ((hash(i) * span - cx * .08 - i * 4) % span + span) % span - 200, py = 40 + hash(i + 7) * 110, s = .6 + hash(i + 3) * .6;
    x.fillStyle = 'rgba(255,255,255,.95)'; x.beginPath(); [[0, 0, 26], [28, -12, 32], [60, 0, 24], [30, 8, 28]].forEach(([a, b, r]) => { x.moveTo(px + a * s + r * s, py + b * s); x.arc(px + a * s, py + b * s, r * s, 0, 7); }); x.fill();
  }
}
const HOUSE = ['#f4a261', '#e76f51', '#e9c46a', '#8ecae6', '#ffafcc', '#b5e48c', '#cdb4db'];
function houses(cx) {
  const off = cx * .3;
  for (let i = -1; i < 14; i++) {
    const px = i * 110 - (off % 110) + 0, k = i + Math.floor(off / 110), h = 90 + hash(k) * 40, w = 100;
    const col = HOUSE[Math.abs(k) % HOUSE.length];
    x.fillStyle = col; x.fillRect(px, 360 - h, w, h + 20);
    x.beginPath(); x.moveTo(px - 4, 360 - h); x.lineTo(px + w / 2, 360 - h - 40); x.lineTo(px + w + 4, 360 - h); x.closePath(); x.fillStyle = '#a44a3f'; x.fill();
    x.fillStyle = 'rgba(255,255,255,.75)';
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) x.fillRect(px + 18 + c * 42, 360 - h + 18 + r * 36, 22, 24);
  }
}
function trees(cx) {
  const off = cx * .6;
  for (let i = -1; i < 9; i++) {
    const k = i + Math.floor(off / 150), px = i * 150 - (off % 150) + hash(k) * 50, s = .9 + hash(k + 3) * .4;
    x.fillStyle = '#7a5134'; x.fillRect(px - 6 * s, 400 - 50 * s, 12 * s, 50 * s);
    x.fillStyle = hash(k + 5) > .5 ? '#2f9e5a' : '#3fb36a';
    x.beginPath(); x.arc(px, 400 - 75 * s, 36 * s, 0, 7); x.arc(px - 24 * s, 400 - 55 * s, 26 * s, 0, 7); x.arc(px + 24 * s, 400 - 55 * s, 26 * s, 0, 7); x.fill();
  }
}
function ground(cx) {
  x.fillStyle = '#86d16f'; x.fillRect(0, 400, W, H - 400);
  // hekje
  const off = cx % 40;
  x.fillStyle = '#ffffff';
  for (let i = -1; i < 26; i++) { const px = i * 40 - off; rr(px, 372, 12, 46, 6); x.fill(); }
  x.fillRect(0, 384, W, 7); x.fillRect(0, 402, W, 7);
  x.fillStyle = '#7cc864'; x.fillRect(0, 418, W, H - 418);
  // bloemetjes
  for (let i = -1; i < 30; i++) {
    const k = i + Math.floor(cx / 46), px = i * 46 - (cx % 46) + hash(k) * 20, py = 495 + hash(k + 2) * 35;
    C.circ(px, py, 4, ['#ff5d8f', '#ffd23f', '#ffffff', '#9b5de5'][Math.abs(k) % 4]);
  }
}
function mat(cx0, w, col) { x.fillStyle = col; rr(cx0 - w / 2, G - 10, w, 22, 11); x.fill(); }

// ---------------- speelplekken (wereldcoördinaten, camera al toegepast) ----------------
function swings(sx, t) {
  mat(sx, 380, '#ff9f1c');
  const top = G - 230;
  strokeLine([[sx - 170, G], [sx - 140, top], [sx - 110, G]], 12, '#e63946');
  strokeLine([[sx + 110, G], [sx + 140, top], [sx + 170, G]], 12, '#e63946');
  strokeLine([[sx - 145, top], [sx + 145, top]], 14, '#3a86ff');
  [[sx - 65, KD.amara, 0, 2.3], [sx + 65, KD.daan, 1.6, 2.5]].forEach(([px, k, ph, sp], i) => {
    const th = .55 * Math.sin(t * sp * .9 + ph), L = 170;
    x.save(); x.translate(px, top); x.rotate(th);
    strokeLine([[-30, 0], [-30, L]], 3, '#5c677d'); strokeLine([[30, 0], [30, L]], 3, '#5c677d');
    x.fillStyle = '#ffd23f'; rr(-36, L - 4, 72, 10, 4); x.fill();
    child(k, 0, L + 26, { sit: true, la: 2.05, ra: 2.05, mouth: Math.max(0, Math.sin(t * sp * .9 + ph)) * .9, blink: blink(t, i) }, 1.15);
    x.restore();
  });
}
function slide(sx, t) {
  mat(sx, 460, '#4cc9f0');
  const top = G - 175, lx = sx - 150;
  // ladder
  strokeLine([[lx - 22, G], [lx - 22, top - 40]], 8, '#264653'); strokeLine([[lx + 22, G], [lx + 22, top - 40]], 8, '#264653');
  for (let y = G - 25; y > top - 30; y -= 28) strokeLine([[lx - 22, y], [lx + 22, y]], 6, '#264653');
  // platform + dakje
  x.fillStyle = '#e63946'; rr(lx - 30, top - 6, 90, 14, 4); x.fill();
  strokeLine([[lx + 60, top], [lx + 60, G]], 8, '#264653');
  x.beginPath(); x.moveTo(lx - 40, top - 60); x.lineTo(lx + 15, top - 100); x.lineTo(lx + 70, top - 60); x.closePath(); x.fillStyle = '#ffd23f'; x.fill();
  strokeLine([[lx - 30, top - 60], [lx - 30, top]], 5, '#264653'); strokeLine([[lx + 60, top - 60], [lx + 60, top]], 5, '#264653');
  // glijbaan (kwadratische curve)
  const P0 = [lx + 60, top + 2], P1 = [sx + 60, top + 10], P2 = [sx + 210, G - 14];
  const bez = u => [(1 - u) ** 2 * P0[0] + 2 * (1 - u) * u * P1[0] + u * u * P2[0], (1 - u) ** 2 * P0[1] + 2 * (1 - u) * u * P1[1] + u * u * P2[1]];
  const pts = []; for (let u = 0; u <= 1.001; u += .05) pts.push(bez(u));
  strokeLine(pts, 26, '#2ec4b6'); strokeLine(pts.map(([a, b]) => [a, b - 9]), 6, '#7ae6dc');
  strokeLine([[sx + 120, G - 40], [sx + 120, G]], 7, '#264653');
  // wachtende Sanne klapt
  const clap = Math.abs(Math.sin(t * 5));
  shadow(sx - 230); child(KD.sanne, sx - 230, G, { la: .6 + clap * .5, ra: .6 + clap * .5, mouth: clap > .8 ? .7 : 0, blink: blink(t, 2), look: 3 });
  // Kofi: klimmen, zitten, glijden, terugrennen (cyclus 5 s)
  const c = t % 5;
  if (c < 1.6) { const k = c / 1.6, py = lerp(G, top - 2, k); child(KD.kofi, lx, py, { la: 2.4 + Math.sin(c * 10) * .3, ra: 2.4 - Math.sin(c * 10) * .3, ll: Math.sin(c * 10) * .3, rl: -Math.sin(c * 10) * .3, blink: false }); }
  else if (c < 2.1) child(KD.kofi, lx + 30, top + 26, { sit: true, la: .5, ra: .5, mouth: .4 });
  else if (c < 3.1) { const u = ease((c - 2.1) / 1.0), [px, py] = bez(u); child(KD.kofi, px, py + 22, { sit: true, la: 2.2, ra: 2.2, mouth: 1 }); }
  else if (c < 3.6) { const [px, py] = P2; shadow(px + 30); child(KD.kofi, px + 30, G, { la: 2.2, ra: 2.2, mouth: .8 }); }
  else { const k = (c - 3.6) / 1.4, px = lerp(P2[0] + 30, lx, ease(k)), sw = Math.sin(c * 14);
    shadow(px); child(KD.kofi, px, G - Math.abs(sw) * 4, { la: .4 + sw * .6, ra: .4 - sw * .6, ll: sw * .45, rl: -sw * .45, look: -3 }); }
}
function seesaw(sx, t) {
  mat(sx, 420, '#9b5de5');
  const a = .24 * Math.sin(t * 2.1), py = G - 42;
  x.beginPath(); x.moveTo(sx - 30, G); x.lineTo(sx, py); x.lineTo(sx + 30, G); x.closePath(); x.fillStyle = '#e63946'; x.fill();
  x.save(); x.translate(sx, py); x.rotate(a);
  x.fillStyle = '#ffd23f'; rr(-170, -8, 340, 16, 8); x.fill();
  [-140, 140].forEach(hx => { strokeLine([[hx, -8], [hx, -36]], 6, '#264653'); strokeLine([[hx - 12, -36], [hx + 12, -36]], 6, '#264653'); });
  x.restore();
  C.circ(sx, py, 7, '#264653');
  [[-155, KD.yasmina, 1], [155, KD.mateo, -1]].forEach(([d, k, sgn], i) => {
    const ex = sx + Math.cos(a) * d, ey = py + Math.sin(a) * d;
    const up = (sgn * Math.sin(t * 2.1) > 0);
    child(k, ex, ey + 22, { sit: true, la: .9, ra: .9, mouth: up ? .9 : 0, blink: blink(t, i + 3), look: sgn * -3 });
  });
}
function sandbox(sx, t) {
  x.fillStyle = '#c98a3c'; rr(sx - 220, G - 40, 440, 70, 10); x.fill();
  x.fillStyle = '#f6d58b'; rr(sx - 205, G - 30, 410, 50, 8); x.fill();
  // kasteel groeit
  const g = clamp((t - 38.5) / 6);
  const cx0 = sx + 10;
  const tower = (tx, h, w) => { if (h <= 0) return; x.fillStyle = '#e9b949'; x.fillRect(tx - w / 2, G - 20 - h, w, h);
    for (let i = 0; i < 3; i++) x.fillRect(tx - w / 2 + i * (w / 2.5), G - 28 - h, w / 5, 9); };
  tower(cx0 - 45, 60 * ease(clamp(g * 2)), 40); tower(cx0 + 45, 60 * ease(clamp(g * 2 - .6)), 40); tower(cx0, 95 * ease(clamp(g * 2 - 1)), 50);
  if (g > .95) { strokeLine([[cx0, G - 125], [cx0, G - 160]], 3, '#5c677d'); x.beginPath(); x.moveTo(cx0, G - 160); x.lineTo(cx0 + 26, G - 152); x.lineTo(cx0, G - 144); x.closePath(); x.fillStyle = '#e63946'; x.fill(); }
  // Mei met schep
  const dig = Math.sin(t * 4);
  child(KD.mei, sx - 135, G + 8, { sit: true, la: .3, ra: 1.1 + dig * .4, blink: blink(t, 5), look: 3, mouth: g > .95 ? .8 : 0 });
  x.save(); x.translate(sx - 105, G - 30 + dig * 6); x.rotate(.6 + dig * .3); x.fillStyle = '#3a86ff'; x.fillRect(-2, -26, 4, 26); x.beginPath(); x.ellipse(0, 4, 8, 11, 0, 0, 7); x.fill(); x.restore();
  // Ravi met emmer
  const pat = Math.abs(Math.sin(t * 3));
  child(KD.ravi, sx + 150, G + 8, { sit: true, la: .9 + pat * .4, ra: .3, blink: blink(t, 6), look: -3, mouth: g > .95 ? .8 : 0 });
  x.fillStyle = '#e63946'; x.beginPath(); x.moveTo(sx + 175, G - 22); x.lineTo(sx + 205, G - 22); x.lineTo(sx + 200, G + 6); x.lineTo(sx + 180, G + 6); x.closePath(); x.fill();
  x.beginPath(); x.arc(sx + 190, G - 22, 14, Math.PI, 0); x.lineWidth = 3; x.strokeStyle = '#264653'; x.stroke();
  // Lotte rent erheen met een bal
  const k = clamp((t - 39) / 2.5), lxp = lerp(sx + 330, sx + 250, ease(k)), sw = k < 1 ? Math.sin(t * 14) : 0;
  shadow(lxp); child(KD.lotte, lxp, G - Math.abs(sw) * 4, { la: .3 + sw * .5, ra: 2.2, ll: sw * .4, rl: -sw * .4, look: -3, blink: blink(t, 7) });
  C.circ(lxp + 32, G - 106 * KS + 30, 13, '#ff5d8f'); x.beginPath(); x.arc(lxp + 32, G - 106 * KS + 30, 13, 0, 7); x.lineWidth = 2; x.strokeStyle = '#fff'; x.stroke();
}
function rope(sx, t) {
  mat(sx, 460, '#2ec4b6');
  const ph = t * Math.PI * 2 * .9;              // touw draait ~0,9 keer per seconde
  const hx = 150, hy = G - 62;
  const ctrlY = hy - Math.cos(ph) * -1 * 0 + Math.cos(ph) * 125;   // >0 = onder de voeten
  const front = Math.sin(ph) > 0;
  const jump = Math.max(0, Math.cos(ph)) ** 2 * 34;
  const drawRope = () => { x.beginPath(); x.moveTo(sx - hx + 22, hy); x.quadraticCurveTo(sx, ctrlY + (ctrlY > hy ? 60 : -60), sx + hx - 22, hy); x.lineWidth = 4; x.strokeStyle = '#e63946'; x.lineCap = 'round'; x.stroke(); };
  if (!front) drawRope();
  const turn = 1.2 + .5 * Math.sin(ph);
  shadow(sx - hx); child(KD.imani, sx - hx, G, { la: .3, ra: turn, blink: blink(t, 8), look: 3 });
  shadow(sx + hx); child(KD.jayden, sx + hx, G, { la: turn, ra: .3, blink: blink(t, 9), look: -3 });
  shadow(sx, 30 - jump * .3); child(KD.amara, sx, G - jump, { la: 1.0, ra: 1.0, ll: .12, rl: .12, mouth: jump > 20 ? .9 : 0 });
  if (front) drawRope();
  // Daan en Yasmina kijken en juichen
  const ch = Math.abs(Math.sin(t * 3));
  shadow(sx - 290); child(KD.daan, sx - 290, G, { la: 1.6 + ch * .6, ra: 1.6 + ch * .6, mouth: ch, look: 3 });
  shadow(sx + 290); child(KD.yasmina, sx + 290, G, { la: 1.6 + ch * .6, ra: 1.6 + ch * .6, mouth: ch, look: -3 });
}

// ---------------- regie ----------------
const CAPS = [['Schommelen!', 5, 12.6], ['Glijden!', 16.3, 24], ['Wipwappen!', 27.8, 35], ['Zandkastelen bouwen!', 38.8, 46], ['Touwtje springen!', 49.8, 54.2]];
const SAYS = [['Hoger, hoger!', 0, 8.5, 11.8], ['Wieee!', 1, 18.2, 20.2], ['Op en neer!', 2, 30, 33], ['Kijk, mijn kasteel!', 3, 44.6, 46.6], ['Spring, spring!', 4, 51, 53.8]];
function draw(t) {
  const cx = camX(t);
  sky(cx); houses(cx); trees(cx); ground(cx);
  const Z = 1.35;
  x.save(); x.translate(480, G); x.scale(Z, Z); x.translate(-480, -G); x.translate(-cx, 0);
  const fns = [swings, slide, seesaw, sandbox, rope];
  ST.forEach((s, i) => { if (Math.abs(s - cx - 480) < 900) fns[i](s, t); });
  x.restore();
  const SPOT = [[ST[0] + 215, G - 205], [ST[1] - 150, G - 290], [ST[2], G - 175], [ST[3] - 135, G - 170], [ST[4], G - 175]];
  const scr = ([wx, wy]) => [480 + (wx - cx - 480) * Z, G + (wy - G) * Z];
  SAYS.forEach(([txt, i, a, b]) => { const [bx, by] = scr(SPOT[i]); C.bubble(txt, bx, by, win(t, a, b), { size: 28 }); });
  CAPS.forEach(([txt, a, b]) => C.bigText(txt, W / 2, 70, win(t, a, b, .3), 64, '#ff5d8f'));
  C.card(['Spelen in de speeltuin!', 74], ['Doe je mee?', 44], t < 2.6 ? clamp((t - .3) / .7) : clamp((4.6 - t) / .6), { accent: '#ff5d8f' });
  C.card(['Samen spelen is fijn!', 70], ['Tot de volgende keer!', 44], clamp((t - 54.6) / .6), { accent: '#ff5d8f', y: 150 });
  C.fadeBlack(t, DUR);
}
C.run(draw, DUR, { thumb: () => C.thumbTitle('Spelen in de speeltuin!', 'Schommelen, glijden...', '#ffd23f') });
