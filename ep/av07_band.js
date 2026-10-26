// Toet op avontuur 7: Toet heeft een lekke band
const C = require('../lib/common'), T = require('../lib/toet'), F = require('../lib/toetfriends');
const St = require('../lib/story'), A = require('../lib/av');
const { x, W, H, clamp, ease, lerp, hash, win, rr, circ } = C;
const { drive, place, GY } = St;
const BY = T.ROAD + 20;
const TB = [(u, c) => c.bx + 200, (u, c) => BY - 175];

function toetTilt(c, bx, tilt, o = {}) {
  x.save(); x.translate(bx - 30, BY + 26 - (o.lift || 0)); x.rotate(tilt); x.translate(-(bx - 30), -(BY + 26));
  const Tk = T.truck(Object.assign({ t: c.t, dist: c.dist || 0, moving: (c.sp || 0) > 5, bx, mouth: c.talk('toet'), night: c.night || 0 }, o));
  if (o.noFront) { circ(bx + 180, BY + 4, 25, '#3d405b'); }
  x.restore(); c.Tk = Tk; c.bx = bx; return Tk;
}
function timLight(px, s, t, flip) { const lx = px + (flip ? -42 : 42) * s, ly = GY + 4 - 150 * s; if (Math.floor(t * 4) % 2) { circ(lx, ly, 16 * s, 'rgba(255,159,28,.45)'); circ(lx, ly, 9 * s, '#ff9f1c'); } }
const S1 = [[0, 150], [7, 150], [9.5, 0]], m1 = T.motion(S1), NAIL = m1.distAt(8) + 300 + 180;

St.episode({
  title: ['Toet heeft een lekke band', 64], sub: 'Toet op avontuur', thumb: ['Oei! Een', 'lekke band!'],
  music: { kind: 'toet', shift: -2 },
  shots: [
    { d: 22, draw: drive({ segs: S1, bx: 300, noToet: true,
        onRoad: (u, c) => { const px = NAIL - c.dist; if (u < 8.2) { x.fillStyle = '#adb5bd'; x.beginPath(); x.moveTo(px - 6, GY - 4); x.lineTo(px, GY - 18); x.lineTo(px + 6, GY - 4); x.fill(); } },
        front: (u, c) => {
          toetTilt(c, 300, clamp((u - 8) / 1.5) * .055, { sleepy: u > 10 ? .3 : 0 });
          if (u > 8 && u < 11.5) { x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 3; for (let i = 0; i < 4; i++) { const k = ((u * 3 + i / 4) % 1); x.beginPath(); x.moveTo(300 + 205 + k * 50, GY - 12 - i * 6); x.lineTo(300 + 225 + k * 50, GY - 14 - i * 6); x.stroke(); } }
        } }),
      says: [['toet', 'Lalala, wat rijdt het lekker!', 2, 5.5, ...TB], ['toet', 'Oei! Mijn band is lek!', 10.5, 14, ...TB], ['toet', 'Wat moet ik nu doen?', 14.5, 18, ...TB]],
      big: [['Pssssss!', 8, 10.5, 600, 300, 60, '#ffffff'], ['Wie kan Toet helpen?', 18.2, 21.8, 480, 90, 60, '#ffffff']],
      sfx: [[8, 'psss', .9], [10.5, 'sad', .6]] },
    { d: 26, draw: drive({ segs: [[0, 0]], dist0: m1.distAt(9.5), bx: 300, noToet: true, noLeaves: true,
        front: (u, c) => {
          toetTilt(c, 160, .055, { sleepy: u < 16 ? .3 : 0, happy: u > 16 });
          const tx = u < 4.5 ? 1200 : lerp(1200, 760, ease((u - 4.5) / 4));
          place(F.tow, tx, GY + 4, .9, true, 1, { mouth: c.talk('tim'), blink: c.blink(1) }); timLight(tx, .9, c.t, true);
        } }),
      says: [['toet', 'Help! Wie kan mij helpen?', 1, 4.5, 360, 250], ['tim', 'Hallo! Ik ben Takel Tim.', 9, 12.5, 740, 250], ['tim', 'Ik help je wel!', 13, 16, 740, 250],
             ['toet', 'Oh, gelukkig!', 16.5, 19, 360, 250], ['tim', 'Ik breng je naar de garage.', 19.5, 23.5, 720, 250]],
      big: [['Takel Tim', 9, 13, 760, 515, 38, '#ffffff']], sfx: [[4.6, 'whoosh', .4], [8.5, 'boing', .5], [9, 'arp', .5]] },
    { d: 24, draw: drive({ segs: [[0, 120]], dist0: 4000, bx: 80, noToet: true,
        front: (u, c) => {
          const Tk = toetTilt(c, 80, -.035);
          const tx = 590, s = .95;
          x.beginPath(); x.moveTo(tx - 57 * s, GY + 4 - 86 * s); x.lineTo(80 + 222, BY - 30); x.lineWidth = 4; x.strokeStyle = '#495057'; x.stroke();
          place(F.tow, tx, GY + 4, s, false, c.dist / 22, { mouth: c.talk('tim'), blink: c.blink(1) }); timLight(tx, s, c.t, false);
        } }),
      says: [['tim', 'Hou je vast, Toet!', 3, 6.5, 640, 250], ['toet', 'Dit is spannend!', 7, 10, 260, 260], ['toet', 'Daar is de garage!', 19, 22.5, 260, 260]],
      big: [['Op naar de garage!', 12, 16.5, 480, 90, 62, '#ffffff']], sfx: [[17, 'honk', .7]] },
    { d: 34, draw: (u, c) => {
        x.fillStyle = '#dee2e6'; x.fillRect(0, 0, W, H); x.fillStyle = '#ced4da'; for (let i = 0; i < 12; i++) x.fillRect(i * 90, 0, 4, 470);
        x.fillStyle = '#e63946'; x.fillRect(0, 40, W, 34); x.font = C.FONT(26); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('GARAGE VAN TIM', 480, 58);
        x.fillStyle = '#a5714b'; rr(600, 120, 300, 150, 8); x.fill();
        x.strokeStyle = '#495057'; x.lineWidth = 8; x.lineCap = 'round'; [[640, 150, 680, 230], [710, 150, 710, 240], [760, 160, 800, 230], [840, 150, 850, 240]].forEach(([a, b, d, e]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(d, e); x.stroke(); });
        x.fillStyle = '#6c757d'; x.fillRect(0, 470, W, 70); x.fillStyle = '#495057'; x.fillRect(0, 466, W, 6);
        const lift = u < 1 ? 0 : u < 4 ? ease((u - 1) / 3) * 50 : u < 22 ? 50 : u < 25 ? 50 * (1 - ease((u - 22) / 3)) : 0;
        x.fillStyle = '#ffb703'; x.fillRect(110, 470 - lift, 280, 12); x.fillStyle = '#adb5bd'; x.fillRect(240, 480 - lift, 20, lift);
        c.dist = 0; c.sp = 0;
        x.save(); x.translate(0, 470 - (BY + 26)); toetTilt(c, 140, 0, { lift, noFront: u > 9 && u < 17, happy: u > 18 }); x.restore();
        c.Tk = { bx: 140, by: BY - lift };
        const wy = 470 - lift - 22;
        if (u > 8 && u < 13) { const k = (u - 8) / 5; x.save(); x.translate(lerp(320, 980, ease(k)), 470 - 16); x.fillStyle = '#1d3557'; x.beginPath(); x.ellipse(0, 0, 28, 16, 0, 0, 7); x.fill(); x.fillStyle = '#adb5bd'; x.beginPath(); x.ellipse(0, 0, 12, 7, 0, 0, 7); x.fill(); x.restore(); }
        if (u > 13 && u < 17) { const k = (u - 13) / 4; const px = lerp(980, 320, ease(k)), py = lerp(470 - 22, wy, ease(k)); x.save(); x.translate(px, py); x.rotate(-k * 12); circ(0, 0, 22, '#1d3557'); circ(0, 0, 11, '#dfe7ef'); x.strokeStyle = '#1d3557'; x.lineWidth = 3; for (let i = 0; i < 3; i++) { x.rotate(2.094); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 10); x.stroke(); } x.restore(); }
        place(F.tow, 790, 474, .85, true, 1, { mouth: c.talk('tim'), blink: c.blink(1) });
        if (u > 18 && u < 22) A.sparkles(320, wy, c.t, 8, 60);
      },
      says: [['tim', 'Eerst de oude band eraf...', 7, 10.5, 760, 260], ['tim', 'En nu een nieuwe band erop!', 12.5, 16, 740, 260],
             ['tim', 'Was het eng, Toet?', 25, 28, 760, 260], ['toet', 'Een beetje. Maar jij hielp mij!', 28.5, 32.5, 360, 250]],
      big: [['Een nieuwe band!', 18, 21.8, 480, 150, 64, '#ffd23f']],
      sfx: [[1, 'whoosh', .4], [8.2, 'rustle:.6', .5], [17, 'clank', .8], [18, 'clank', .7], [18.2, 'tada', .7], [19, 'clank', .6], [22, 'whoosh', .3]] },
    { d: 20, draw: drive({ segs: [[0, 150]], dist0: 9000, bx: 120,
        front: (u, c) => { place(F.tow, 760, GY + 4, .9, false, c.dist / 22, { mouth: c.talk('tim'), blink: c.blink(1) }); } }),
      says: [['toet', 'Dank je wel, Tim!', 2, 5, 320, 250], ['tim', 'Graag gedaan! Toet toet!', 5.5, 9, 760, 260]],
      big: [['Hulp vragen is slim!', 10, 14.6, 480, 90, 62, '#ffd23f']], sfx: [[9.2, 'honk', .8]] },
  ],
});
