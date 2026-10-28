// Kleurplaat-composities (kleur, op wit). Wordt daarna met kleurplaten/lineart.py omgezet naar zwarte lijnen.
// Gebruik: PAGE=<naam> STILL=0 OW=3308 OH=1861 node kleurplaten/pages.js out.png
const C = require('../lib/common'), T = require('../lib/toet'), S = require('../lib/safari');
const { x, W, H, circ } = C;
const INK = '#1d3557';
const page = process.env.PAGE || 'toet';

function white() { x.fillStyle = '#ffffff'; x.fillRect(0, 0, W, H); }
function cloud(cx, cy, s) {
  x.fillStyle = '#dfe9f2'; x.beginPath();
  [[0, 0, 28], [30, -14, 34], [64, 0, 26], [32, 8, 30]].forEach(([a, b, r]) => { x.moveTo(cx + (a + r) * s, cy + b * s); x.arc(cx + a * s, cy + b * s, r * s, 0, 7); });
  x.fill();
}
function sun(cx, cy, r) {
  x.strokeStyle = '#f4b400'; x.lineWidth = 5; x.lineCap = 'round';
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; x.beginPath(); x.moveTo(cx + Math.cos(a) * (r + 12), cy + Math.sin(a) * (r + 12)); x.lineTo(cx + Math.cos(a) * (r + 30), cy + Math.sin(a) * (r + 30)); x.stroke(); }
  circ(cx, cy, r, '#ffd23f');
  x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy + 4, r * .45, .3, Math.PI - .3); x.stroke();
  circ(cx - r * .3, cy - r * .2, 4, INK); circ(cx + r * .3, cy - r * .2, 4, INK);
}
function hill(y0, amp, ph, col) { x.fillStyle = col; x.beginPath(); x.moveTo(0, H); for (let i = 0; i <= W; i += 8) x.lineTo(i, y0 - Math.sin(i * .007 + ph) * amp); x.lineTo(W, H); x.fill(); }
function flower(cx, cy, col) { x.strokeStyle = '#3f9a52'; x.lineWidth = 3; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx, cy - 22); x.stroke(); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; circ(cx + Math.cos(a) * 8, cy - 26 + Math.sin(a) * 8, 6, col); } circ(cx, cy - 26, 5, '#ffd23f'); }

const PAGES = {
  // Little Truck Toet op het platteland
  toet() {
    white(); sun(120, 95, 42); cloud(330, 80, 1.3); cloud(700, 60, 1.1);
    hill(330, 18, 1, '#cfe8b8');
    T.windmill(870, 335, 1.2, .4); T.tree(70, 340, 1.3, 0);
    x.fillStyle = '#bfc6cf'; x.fillRect(0, T.ROAD + 30, W, 52); x.fillStyle = '#ffffff'; for (let i = 0; i < 8; i++) x.fillRect(30 + i * 125, T.ROAD + 53, 60, 6);
    x.fillStyle = '#9fd28a'; x.fillRect(0, T.ROAD + 82, W, H);
    x.save(); x.translate(400, T.ROAD + 40); x.scale(1.45, 1.45); x.translate(-400, -(T.ROAD + 40));
    T.truck({ t: 0.5, dist: 0, moving: false, bx: 330, mouth: .5 });
    x.restore();
    T.charger(905, T.ROAD + 28, 1.2);
    T.cow(735, 395, 1.15, 0); T.sheep(150, 392, 1.5);
    [[70, 536, '#ff7aa2'], [330, 538, '#9b5de5'], [600, 536, '#ff9f1c'], [880, 538, '#3a86ff']].forEach(([a, b, c]) => flower(a, b, c));
  },
  // The Big Four op de savanne
  bigfour() {
    white(); sun(840, 95, 40); cloud(120, 70, 1.1); cloud(470, 55, 1.2);
    S.mountain(); hill(345, 10, 2, '#f3dfa8');
    S.acacia(80, 345, 1.1); S.acacia(905, 350, .9);
    S.setT(0.3);
    S.actor(S.lion, 130, false, 0, .85, { noShadow: true });
    S.actor(S.elephant, 360, false, 0, .85, { noShadow: true });
    S.actor(S.rhino, 600, false, 0, .8, { noShadow: true });
    S.actor(S.buffalo, 830, false, 0, .8, { noShadow: true, lift: -40 });
    S.actor(S.mouse, 480, false, 0, .8, { noShadow: true, lift: -50 });
  },
  // Onder water
  ocean() {
    const O = require('../ep/ocean.js');
    white();
    x.strokeStyle = '#8ecae6'; x.lineWidth = 3; x.beginPath(); for (let i = 0; i <= W; i += 8) x.lineTo(i, 22 + Math.sin(i * .03) * 6); x.stroke();
    O.whale(330, 130, 1.0, 0.5, 0, false);
    O.turtle(720, 210, 1.5, 0.5, 9, true);
    O.dolphin(160, 270, 1.0, 0.5, 5, false, -.1); O.fish(880, 120, 1.2, '#f4a3c4', '#e27aa6', 0.5, 3, true);
    O.fish(560, 330, 1.6, '#ffd59e', '#ffb877', 0.5, 1, true); O.fish(430, 370, 1.3, '#9fe0d0', '#6fc7b5', 0.5, 2, false);
    x.fillStyle = '#efe3cf'; x.beginPath(); x.moveTo(0, H); for (let i = 0; i <= W; i += 8) x.lineTo(i, 480 - Math.sin(i * .009 + 1) * 10); x.lineTo(W, H); x.fill();
    O.seahorse(200, 410, 1.1, 0.5, 2); O.octopus(760, 470, 1.0, 0.5, 3); O.crab(520, 516, 1.0, 0.5, 0);
    O.coralBranch(320, 492, 1.1, '#f2a7b8', 0.5, 1); O.anemone(620, 492, 0.5);
    O.starfish(400, 520, 20, '#f6a37a', .2); O.starfish(900, 515, 16, '#f3cf77', -.3);
  },
  // Slapende olifantjes onder de sterren
  sleepy() {
    const Z = require('../ep/sensory.js');
    white();
    circ(780, 110, 62, '#ffd23f'); circ(810, 92, 56, '#ffffff');
    x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.arc(746, 112, 8, .2, Math.PI - .2); x.stroke();
    [[130, 70, 18], [300, 120, 14], [470, 60, 20], [600, 150, 12], [900, 230, 14], [60, 220, 12]].forEach(([a, b, r]) => Z.star5(a, b, r, '#f4b400'));
    hill(430, 14, 2, '#a8d8a0');
    Z.tree(95, 470, 0); Z.owl(170, 300, .9, 0); Z.owl(212, 300, .55, 0, 1);
    Z.elephant(470, 486, 1.15, 0, '#8f86d6', '#e86a9a', 0); Z.elephant(680, 492, .62, 1.3, '#a99fe6', '#f08ab0', 0);
    Z.sheep(850, 486, .85, 0, 4); Z.bunny(925, 512, .65, 0, 2);
  },
};
C.run(() => PAGES[page](), 1, {});
