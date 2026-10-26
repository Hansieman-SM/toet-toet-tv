const C = require('../lib/common'); const { loadImage } = require('../node_modules/@napi-rs/canvas');
(async () => {
  const img = await loadImage(process.argv[2]); const x = C.x;
  x.setTransform(1,0,0,1,0,0); x.drawImage(img, 0, 0, C.cv.width, C.cv.height);
  const k = C.cv.width / 960; x.scale(k, k);
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round';
  x.font = C.FONT(64); x.lineWidth = 10; x.strokeStyle = '#2a2350'; x.strokeText('Lullabies for Babies', 480, 52); x.fillStyle = '#fff3d6'; x.fillText('Lullabies for Babies', 480, 52);
  x.font = C.FONT(32); const s = '1.5 hours of calm music', w = x.measureText(s).width + 50;
  C.rr && (x.fillStyle = '#fff3d6', x.beginPath(), x.roundRect(480 - w/2, 92, w, 48, 24), x.fill());
  x.fillStyle = '#4a3f7a'; x.fillText(s, 480, 117);
  require('fs').writeFileSync(process.argv[3], C.cv.toBuffer('image/png'));
})();
