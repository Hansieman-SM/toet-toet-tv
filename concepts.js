// Schetsen (1 beeld per scenario) voor "Toet op avontuur". Gebruik: node concepts.js <uitmap>
const C = require('./lib/common'), T = require('./lib/toet'), S = require('./lib/safari'), F = require('./lib/toetfriends'), K = require('./lib/kids');
const { x, W, H, cv, rr, circ, hash } = C;
const INK = '#1d3557', GY = T.ROAD + 46;
const fs = require('fs'), out = process.argv[2];
const place = (fn, px, gy, s, flip = false, t = 1, o = {}) => { x.save(); x.translate(px, gy); x.scale(s * (flip ? -1 : 1), s); fn(t, o); x.restore(); };
const kidAt = (k, px, gy, s, p) => { x.save(); x.translate(px, gy); x.scale(s, s); K.kid(k, p); x.restore(); };
const say = (txt, bx, by) => C.bubble(txt, bx, by, 1, { size: 26 });

const scenes = [
  ['opa-oma', () => {
    T.world({ t: 1, dist: 300, skyP: .2, near: 'trees',
      behindRoad() { // boerderij van opa en oma
        x.fillStyle = '#c1121f'; x.fillRect(700, 300, 200, 120); x.beginPath(); x.moveTo(690, 300); x.lineTo(800, 230); x.lineTo(910, 300); x.closePath(); x.fillStyle = '#7f1d1d'; x.fill();
        x.fillStyle = '#fff'; x.fillRect(770, 345, 60, 75); x.strokeStyle = '#c1121f'; x.lineWidth = 4; x.beginPath(); x.moveTo(770, 345); x.lineTo(830, 420); x.moveTo(830, 345); x.lineTo(770, 420); x.stroke();
      } });
    F.toetAt(170, GY, .8);
    place(F.oma, 480, GY + 6, .82, true); place(F.opa, 770, GY + 6, .8, true, 1, { puff: true });
    say('Opa! Oma!', 230, 300); say('Dag lieverd!', 500, 220);
  }],
  ['safari', () => {
    S.setT(1); S.sky(); S.land();
    S.actor(S.elephant, 650, false, 0, .95, {}); S.actor(S.lion, 860, false, 0, .8, { blinkOff: 1 });
    F.toetAt(250, S.GROUND + 4, .85);
    S.foreground();
    say('Hallo Ella! Hallo Leo!', 300, 250);
  }],
  ['berg', () => {
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5bb8f0'); g.addColorStop(1, '#cdeeff'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    T.cloud(80, 80, .8); T.cloud(700, 60, .6);
    x.fillStyle = '#7fa66b'; x.beginPath(); x.moveTo(-50, H); x.lineTo(480, 70); x.lineTo(1010, H); x.closePath(); x.fill();
    x.fillStyle = '#fff'; x.beginPath(); x.moveTo(390, 170); x.lineTo(480, 70); x.lineTo(570, 170); x.lineTo(540, 160); x.lineTo(510, 180); x.lineTo(480, 160); x.lineTo(450, 182); x.lineTo(420, 162); x.closePath(); x.fill();
    // kronkelweg
    x.beginPath(); x.moveTo(120, 540); x.quadraticCurveTo(700, 470, 640, 380); x.quadraticCurveTo(330, 330, 420, 250); x.quadraticCurveTo(520, 190, 480, 150); x.lineWidth = 26; x.strokeStyle = '#5c677d'; x.lineCap = 'round'; x.stroke();
    x.lineWidth = 3; x.strokeStyle = '#fff'; x.setLineDash([12, 12]); x.stroke(); x.setLineDash([]);
    [[120, 470], [800, 430], [250, 300]].forEach(([px, py]) => T.tree(px, py, .7, .4));
    x.save(); x.translate(600, 385); x.rotate(-.35); F.toetAt(0, 0, .55); x.restore();
    C.bigText('Stapje voor stapje...', 640, 470, 1, 34, '#ffffff');
    // batterij
    x.fillStyle = '#fff'; rr(800, 30, 120, 52, 12); x.fill(); x.lineWidth = 4; x.strokeStyle = INK; x.stroke(); [0, 1, 2].forEach(i => { x.fillStyle = '#ff9f1c'; rr(810 + i * 22, 40, 18, 32, 4); x.fill(); });
  }],
  ['bus', () => {
    T.world({ t: 1, dist: 900, skyP: .15, near: 'trees',
      behindRoad() { x.fillStyle = '#e9ecef'; x.fillRect(80, 300, 820, 140); x.fillStyle = '#8ecae6'; x.fillRect(80, 285, 820, 18); x.font = C.FONT(26); x.fillStyle = INK; x.textAlign = 'center'; x.fillText('BUSSTATION', 490, 340);
        x.fillStyle = INK; x.fillRect(560, 360, 6, 80); C.circ(563, 355, 16, '#2fb36a'); } });
    place(F.bus, 620, GY + 6, .85, false, 1);
    F.toetAt(150, GY, .7);
    say('Wauw, wat ben jij lang!', 220, 280);
  }],
  ['wasstraat', () => {
    T.world({ t: 1, dist: 1500, skyP: .1, near: 'trees' });
    x.fillStyle = '#4361ee'; rr(300, 180, 400, 270, 20); x.fill(); x.fillStyle = '#d8f3ff'; x.fillRect(330, 220, 340, 230);
    x.font = C.FONT(30); x.fillStyle = '#fff'; x.textAlign = 'center'; x.fillText('WASSTRAAT', 500, 207);
    [[390, '#ff5d8f'], [610, '#4cc9f0']].forEach(([bx, col]) => { x.fillStyle = col; rr(bx - 26, 230, 52, 210, 26); x.fill(); x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = 3; for (let y = 245; y < 430; y += 14) { x.beginPath(); x.moveTo(bx - 22, y); x.lineTo(bx + 22, y + 6); x.stroke(); } });
    F.toetAt(500, GY, .62, { mouth: .6 });
    for (let i = 0; i < 26; i++) { const r = 8 + hash(i) * 16; circ(360 + hash(i + 2) * 290, 300 + hash(i + 5) * 140, r, 'rgba(255,255,255,.85)'); }
    say('Oei, die grote borstels...', 500, 110);
  }],
  ['taart', () => {
    T.world({ t: 1, dist: 2000, skyP: .12, near: 'trees' });
    // feest: kinderen met hoedjes en ballonnen
    [['#ff5d8f', 640], ['#ffd23f', 700], ['#4cc9f0', 900]].forEach(([c, bx]) => { x.strokeStyle = INK; x.lineWidth = 1.5; x.beginPath(); x.moveTo(bx, 250); x.lineTo(bx + 10, 400); x.stroke(); circ(bx, 230, 24, c); });
    [[K.KIDS.amara, 680], [K.KIDS.daan, 770], [K.KIDS.yasmina, 860]].forEach(([k, px], i) => { kidAt(k, px, GY - 6, 1.15, { la: 2.2, ra: 2.2, mouth: 1 }); x.beginPath(); x.moveTo(px - 12, GY - 6 - 118); x.lineTo(px, GY - 6 - 150); x.lineTo(px + 12, GY - 6 - 118); x.closePath(); x.fillStyle = ['#9b5de5', '#2fb36a', '#ff9f1c'][i]; x.fill(); });
    F.toetAt(300, GY, .85);
    // taart op de laadbak
    x.fillStyle = '#fff3e0'; rr(190, 290, 110, 50, 8); x.fill(); x.fillStyle = '#ff8fc8'; rr(190, 290, 110, 14, 6); x.fill();
    x.fillStyle = '#fff3e0'; rr(210, 255, 70, 38, 8); x.fill(); x.fillStyle = '#ff8fc8'; rr(210, 255, 70, 11, 5); x.fill();
    [225, 245, 265].forEach(cx => { x.fillStyle = '#4cc9f0'; x.fillRect(cx - 3, 236, 6, 20); circ(cx, 230, 5, '#ffd23f'); });
    C.bigText('Hiep hiep hoera!', 480, 90, 1, 64, '#ff5d8f');
  }],
  ['garage', () => {
    T.world({ t: 1, dist: 2600, skyP: .1, near: 'trees',
      behindRoad() { x.fillStyle = '#adb5bd'; x.fillRect(560, 250, 360, 190); x.fillStyle = '#495057'; x.fillRect(600, 300, 140, 140); x.fillStyle = '#e63946'; x.fillRect(560, 230, 360, 34); x.font = C.FONT(26); x.fillStyle = '#fff'; x.textAlign = 'center'; x.fillText('GARAGE', 740, 256); } });
    x.save(); x.translate(260, GY); x.rotate(.04); F.toetAt(0, 0, .8); x.restore();
    // platte band
    x.fillStyle = '#ffd23f'; x.font = C.FONT(40); C.bigText('Pssss!', 400, 400, 1, 40, '#ffffff');
    place(F.tow, 760, GY + 4, .85, true);
    say('Ik help je wel!', 760, 250);
  }],
  ['regen', () => {
    T.world({ t: 1, dist: 3300, skyP: .1, near: 'trees' });
    x.fillStyle = 'rgba(80,100,130,.35)'; x.fillRect(0, 0, W, H);
    ['#e63946', '#ff9f1c', '#ffd23f', '#6cd36b', '#3a86ff', '#9b5de5'].forEach((c, i) => { x.beginPath(); x.arc(640, 470, 330 - i * 14, Math.PI, 0); x.lineWidth = 14; x.strokeStyle = c; x.globalAlpha = .8; x.stroke(); }); x.globalAlpha = 1;
    x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = 2; for (let i = 0; i < 70; i++) { const px = hash(i) * W, py = hash(i + 9) * 300; x.beginPath(); x.moveTo(px, py); x.lineTo(px - 6, py + 18); x.stroke(); }
    F.toetAt(250, GY, .8, { mouth: .6 });
    [[420, 495], [560, 500]].forEach(([px, py]) => { x.fillStyle = 'rgba(120,170,220,.7)'; x.beginPath(); x.ellipse(px, py, 60, 10, 0, 0, 7); x.fill(); });
    for (let i = 0; i < 8; i++) circ(390 + i * 10, 470 - Math.sin(i / 7 * Math.PI) * 40, 5, 'rgba(160,200,240,.9)');
    say('Plons! Een regenboog!', 330, 250);
  }],
  ['eendje', () => {
    T.world({ t: 1, dist: 4000, skyP: .12, near: 'trees',
      behindRoad() { x.fillStyle = '#4cc9f0'; x.beginPath(); x.ellipse(760, 425, 170, 28, 0, 0, 7); x.fill(); F.duck(720, 420, 1.3, '#f1f3f5'); F.duck(790, 422, .8); F.duck(830, 424, .8); } });
    F.toetAt(260, GY, .85);
    F.duck(500, GY - 4, 1.1, '#ffd23f', true);
    say('Zie jij mama eend?', 300, 250);
    C.bigText('?', 600, 330, 1, 80, '#ffd23f');
  }],
  ['slapen', () => {
    T.world({ t: 1, dist: 5000, skyP: .72, near: 'mixed' });
    T.charger(430, 470, 1.2);
    F.toetAt(240, GY, .85, { sleepy: 1, night: 1 });
    x.beginPath(); x.moveTo(370, 432); x.quadraticCurveTo(400, 470, 430, 440); x.lineWidth = 5; x.strokeStyle = INK; x.stroke();
    ['Z', 'z', 'z'].forEach((z, i) => C.bigText(z, 360 + i * 26, 250 - i * 30, 1, 34 - i * 6, '#ffffff'));
    C.bigText('Welterusten, Toet', 480, 90, 1, 56, '#ffd23f');
  }],
];

const pick = process.argv[3];
scenes.forEach(([name, fn], i) => {
  if (pick && pick !== name) return;
  x.save(); fn(); x.restore();
  fs.writeFileSync(`${out}/${String(i + 1).padStart(2, '0')}-${name}.png`, cv.toBuffer('image/png'));
});
