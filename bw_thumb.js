process.env.OW = 1280; process.env.OH = 720;
const C = require('./lib/common'), B = require('./lib/bwbase'), F = require('./lib/bwfig');
const { x, cv } = C;
x.fillStyle = '#000'; x.fillRect(0, 0, 960, 540);
for (let i = 0; i < 60; i++) { x.globalAlpha = .25 + .3 * C.hash(i + 3); B.dot(C.hash(i) * 960, C.hash(i + 50) * 540, 1.6, '#fff'); }
x.globalAlpha = 1;
const put = (f, cx, cy, s) => { x.save(); x.translate(cx, cy); x.scale(s, s); f(1); x.restore(); };
put(B.moon, 110, 370, .62); put(B.toet, 300, 370, .55); put(B.elephant, 505, 380, .52); put(F.owl, 700, 375, .55); put(F.bigStar, 870, 370, .55);
x.font = C.FONT(66); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff';
x.fillText("Zwart-wit voor baby's", 480, 95);
x.font = C.FONT(38); x.fillText('1 uur rustige muziek', 480, 165);
require('fs').writeFileSync('out/long/zwartwit-60min-thumbnail.png', cv.toBuffer('image/png'));
