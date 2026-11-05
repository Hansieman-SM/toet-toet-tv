// Profielfoto 1080x1080 met vriendjes: Little Truck Toet (vooraanzicht) met The Big Four die achter hem vandaan kijken.
// Gebruik: node profile_friends.js out.png   (rendert in de wereld van 960x540 op 1920x1080 en snijdt het midden uit)
process.env.OW = process.env.OW || '1920'; process.env.OH = process.env.OH || '1080';
const C = require('./lib/common'), S = require('./lib/safari');
const { x, cv, createCanvas } = C;
const INK = '#1d3557';
S.setT(0.35);

// achtergrond (alleen het middenvierkant 210..750 telt)
const g = x.createLinearGradient(0, 0, 0, 540); g.addColorStop(0, '#8fd3ff'); g.addColorStop(1, '#d8f3ff'); x.fillStyle = g; x.fillRect(0, 0, 960, 540);
x.fillStyle = 'rgba(255,255,255,.85)';
[[300, 95, .5], [610, 80, .42]].forEach(([a, b, s]) => { x.beginPath(); [[0, 0, 50], [55, -20, 62], [115, 0, 48]].forEach(([u, v, r]) => { x.moveTo(a + (u + r) * s, b + v * s); x.arc(a + u * s, b + v * s, r * s, 0, 7); }); x.fill(); });
x.fillStyle = '#7ed957'; x.beginPath(); x.moveTo(0, 540); x.lineTo(0, 430); x.quadraticCurveTo(480, 370, 960, 430); x.lineTo(960, 540); x.fill();

// The Big Four, achter Toet: olifant links-achter, buffel rechts-achter, leeuw en neushoorn lager ernaast
const actor = (fn, px, gy, sc, flip, act) => { x.save(); x.translate(px, gy); x.scale(sc * (flip ? -1 : 1), sc); fn(0, false, act, false); x.restore(); };
actor(S.elephant, 400, 392, 1.0, false, 0);
actor(S.buffalo, 560, 378, .95, true, 0);
actor(S.lion, 362, 458, .88, false, 0);
actor(S.rhino, 592, 458, .85, true, 0);

// Toet vooraan in het midden (zelfde ontwerp als profile.js)
x.save(); x.translate(480, 330); x.scale(.62, .62);
const rr = (a, b, w, h, r) => { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); };
x.fillStyle = 'rgba(29,53,87,.18)'; x.beginPath(); x.ellipse(0, 190, 190, 22, 0, 0, 7); x.fill();
[-110, 110].forEach(ox => { rr(ox - 35, 125, 70, 60, 18); x.fillStyle = INK; x.fill(); });
x.lineWidth = 18; x.strokeStyle = INK; rr(-165, -170, 330, 300, 60); x.fillStyle = '#ff7a45'; x.fill(); x.stroke();
rr(-125, -135, 250, 120, 30); x.fillStyle = '#ffffff'; x.fill(); x.lineWidth = 14; x.stroke();
[-55, 55].forEach(ox => { x.beginPath(); x.arc(ox, -75, 30, 0, 7); x.fillStyle = INK; x.fill(); x.beginPath(); x.arc(ox + 10, -85, 10, 0, 7); x.fillStyle = '#fff'; x.fill(); });
x.beginPath(); x.arc(0, 25, 66, .2, Math.PI - .2); x.lineWidth = 18; x.lineCap = 'round'; x.strokeStyle = INK; x.stroke();
[-112, 112].forEach(ox => { x.beginPath(); x.arc(ox, 45, 20, 0, 7); x.fillStyle = 'rgba(255,90,110,.55)'; x.fill(); });
[-120, 120].forEach(ox => { x.beginPath(); x.arc(ox, 95, 20, 0, 7); x.fillStyle = '#fff6b0'; x.fill(); x.lineWidth = 10; x.strokeStyle = INK; x.stroke(); });
x.beginPath(); x.arc(150, -150, 58, 0, 7); x.fillStyle = '#2fb36a'; x.fill(); x.lineWidth = 14; x.strokeStyle = INK; x.stroke();
x.save(); x.translate(150, -150); x.scale(3, 3); x.fillStyle = '#ffd23f'; x.beginPath(); x.moveTo(3, -15); x.lineTo(-9, 3); x.lineTo(-1, 3); x.lineTo(-4, 15); x.lineTo(9, -4); x.lineTo(1, -4); x.lineTo(5, -15); x.closePath(); x.fill(); x.restore();
x.restore();

// middenvierkant uitsnijden
const OW = +process.env.OW, OH = +process.env.OH, out = createCanvas(OH, OH);
out.getContext('2d').drawImage(cv, (OW - OH) / 2, 0, OH, OH, 0, 0, OH, OH);
require('fs').writeFileSync(process.argv[2], out.toBuffer('image/png'));
