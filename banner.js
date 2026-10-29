// YouTube-banner 2560x1440 (wereld 960x540). Veilige zone voor alle apparaten: x 190-770, y 191-349.
const C = require('./lib/common'), T = require('./lib/toet'), S = require('./lib/safari');
const { x, W, H, cv } = C;
const INK = '#1d3557';
S.setT(1.2);

// lucht
const g = x.createLinearGradient(0, 0, 0, 350); g.addColorStop(0, '#5bb8f0'); g.addColorStop(1, '#d6f0ff');
x.fillStyle = g; x.fillRect(0, 0, W, H);
// zon
C.circ(840, 95, 70, 'rgba(255,220,90,.3)'); C.circ(840, 95, 46, '#ffd23f');
// regenboog
['#e63946', '#ff7a45', '#ffd23f', '#6cd36b', '#3a86ff', '#9b5de5'].forEach((c, i) => {
  x.beginPath(); x.arc(480, 365, 330 - i * 11, Math.PI, 0); x.strokeStyle = c; x.globalAlpha = .55; x.lineWidth = 11; x.stroke();
});
x.globalAlpha = 1;
T.cloud(70, 70, .9); T.cloud(330, 45, .6); T.cloud(600, 60, .7);
// vogels
x.strokeStyle = 'rgba(29,53,87,.7)'; x.lineWidth = 2.5;
[[180, 120], [205, 108], [228, 124]].forEach(([bx, by]) => { x.beginPath(); x.moveTo(bx - 10, by - 5); x.quadraticCurveTo(bx - 4, by - 4, bx, by); x.quadraticCurveTo(bx + 4, by - 4, bx + 10, by - 5); x.stroke(); });

// verte: Kilimanjaro rechts
x.save(); x.translate(470, 6); S.mountain(); x.restore();
// heuvels, groen -> goud
const band = (y0, amp, f, seed, cL, cR) => {
  const gr = x.createLinearGradient(330, 0, 630, 0); gr.addColorStop(0, cL); gr.addColorStop(1, cR);
  x.fillStyle = gr; x.beginPath(); x.moveTo(0, H);
  for (let i = 0; i <= W; i += 6) x.lineTo(i, y0 - amp * (Math.sin(i * f + seed) * .6 + Math.sin(i * f * 2.3 + seed * 2) * .4));
  x.lineTo(W, H); x.closePath(); x.fill();
};
band(322, 14, .008, 1, '#8fcf9f', '#e9c27b');
T.windmill(70, 330, .75, .4); T.windmill(150, 334, .6, 1.3);
S.giraffeSil(880, 330, .75); S.giraffeSil(915, 332, .6);
band(342, 8, .012, 4, '#6dbb7c', '#ddb062');
// bomen en acacia's buiten de veilige zone
T.tree(40, 352, 1, .3); T.tree(120, 356, .8, .7);
S.acacia(860, 356, .8); S.acacia(935, 360, .6);
// grond
const gg = x.createLinearGradient(330, 0, 630, 0); gg.addColorStop(0, '#57a865'); gg.addColorStop(1, '#d29a4c');
x.fillStyle = gg; x.fillRect(0, 352, W, H - 352);
// pad waar iedereen op staat
const pg = x.createLinearGradient(330, 0, 630, 0); pg.addColorStop(0, '#9aa5b1'); pg.addColorStop(1, '#e2b56c');
x.fillStyle = pg; x.beginPath(); x.ellipse(480, 352, 470, 14, 0, 0, 7); x.fill();

// personages op y=346
const GY = 336;
function animal(d, tx, k, act = 0) {
  x.save(); x.translate(tx, GY); x.scale(k, k); x.translate(0, -S.GROUND);
  S.actor(d, 0, false, act, 1, { noShadow: false }); x.restore();
}
x.save(); x.translate(265, GY - 11); x.scale(.42, .42); x.translate(-310 - 70, -(T.ROAD + 20)); // truck-midden ~ bx+70
T.truck({ t: 1, dist: 0, moving: false, bx: 310, happy: true }); x.restore();
animal(S.lion, 420, .38);
animal(S.elephant, 530, .34);
animal(S.rhino, 640, .37);
animal(S.buffalo, 735, .36);

// voorgrond (alleen op tv zichtbaar)
for (let k = 0; k < 40; k++) { const px = C.hash(k) * 470, py = 385 + C.hash(k + 9) * 140;
  x.fillStyle = ['#ff7a45', '#ffd23f', '#ffffff', '#ff9ec4'][Math.floor(C.hash(k + 4) * 4)]; x.beginPath(); x.arc(px, py, 4, 0, 7); x.fill(); }
x.save(); x.beginPath(); x.rect(490, 352, 470, 188); x.clip(); S.grass(540, 40, 50, '#b88c3a'); S.grass(470, 26, 90, '#c6973f'); x.restore();
T.cow(130, 470, 1.4, 0); T.charger(300, 470, 1.2);
x.save(); x.translate(720, 500); x.scale(.5, .5); S.bush(0, 0, 1, 0); x.restore();

// tekst in de veilige zone
const fit = (txt, size, maxW) => { x.font = C.FONT(size); const w = x.measureText(txt).width; return w > maxW ? Math.floor(size * maxW / w) : size; };
const t1 = 'Toet Toet and Friends', t2 = 'Happy cartoons and calm videos for little ones';
C.bigText(t1, 480, 220, 1, fit(t1, 52, 540), '#ffd23f', INK);
C.bigText(t2, 480, 260, 1, fit(t2, 24, 520), '#ffffff', INK);

const out = process.argv[2];
require('fs').writeFileSync(out, cv.toBuffer('image/png'));
if (process.env.GUIDE) { // controle-overlay van de veilige zones
  x.strokeStyle = '#ff00ff'; x.lineWidth = 2; x.strokeRect(190, 191, 580, 158);
  x.strokeStyle = '#00ffff'; x.strokeRect(0, 191, 960, 158);
  require('fs').writeFileSync(process.env.GUIDE, cv.toBuffer('image/png'));
}
