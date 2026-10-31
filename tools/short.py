"""Maakt een verticale Short (1440x2560, bron bij voorkeur 2560x1440 renderen) van een liggende video.
python3 tools/short.py SRC.mp4 OUT.mp4 --title "Under the Sea" --sub "Who swims by?" --cx 960 --colors "#bfe6f0,#4b6aa6" [--footer1 ... --footer2 ...]
SRC moet al de juiste lengte en audio hebben."""
import argparse, subprocess, json, math
from PIL import Image, ImageDraw, ImageFont
p = argparse.ArgumentParser(); p.add_argument('src'); p.add_argument('out')
p.add_argument('--title', required=True); p.add_argument('--sub', default=''); p.add_argument('--cx', type=int, default=960); p.add_argument('--crop', action='store_true', help='4:3 crop around --cx; ONLY for footage without text/speech bubbles')
p.add_argument('--colors', default='#bfe6f0,#4b6aa6'); p.add_argument('--footer1', default='Toet Toet and Friends TV')
p.add_argument('--footer2', default='Subscribe for more adventures!'); a = p.parse_args()
def font(sz, w='ExtraBold'):
    f = ImageFont.truetype('fonts/Baloo2.ttf', sz); f.set_variation_by_name(w); return f
INK = '#1d3557'; K = 4 / 3; W, H = 1440, 2560; c1, c2 = a.colors.split(',')   # ontwerp in 1080x1920-maat, uitvoer 1440x2560 (scherper op YouTube)
q = lambda v: int(round(v * K))
rgb = lambda c: tuple(int(c[i:i+2], 16) for i in (1, 3, 5))
bg = Image.new('RGB', (W, H)); d = ImageDraw.Draw(bg); r1, r2 = rgb(c1), rgb(c2)
for y in range(H): k = y / H; d.line([(0, y), (W, y)], fill=tuple(int(r1[i] + (r2[i] - r1[i]) * k) for i in range(3)))
for i in range(14): x0, y0 = q((i * 173) % 1080), q((i * 311) % 1920); d.ellipse([x0 - q(30), y0 - q(30), x0 + q(30), y0 + q(30)], outline=(255, 255, 255), width=q(6))
vw = W - q(80); vw -= vw % 2; vh = int(vw * (3 / 4 if a.crop else 9 / 16)); vh -= vh % 2; vy = q(560 if a.crop else 620); vx = (W - vw) // 2
f1 = font(q(118 if len(a.title) < 14 else 92))
for dx, dy in [(-6,0),(6,0),(0,-6),(0,6),(-4,-4),(4,4),(-4,4),(4,-4)]: d.text((W/2+q(dx), q(300+dy)), a.title, font=f1, fill=INK, anchor='mm')
d.text((W/2, q(300)), a.title, font=f1, fill='#ffd23f', anchor='mm')
if a.sub: d.text((W/2, q(440)), a.sub, font=font(q(58), 'Bold'), fill='#ffffff', anchor='mm', stroke_width=q(4), stroke_fill=INK)
d.rounded_rectangle([vx - q(12), vy - q(12), vx + vw + q(12), vy + vh + q(12)], radius=q(36), fill='white')
by = vy + vh + q(120 if a.crop else 150)
d.rounded_rectangle([q(110), by, W - q(110), by + q(220)], radius=q(50), fill='white', outline=INK, width=q(6))
d.text((W/2, by + q(75)), a.footer1, font=font(q(56)), fill='#ff7a45', anchor='mm')
d.text((W/2, by + q(150)), a.footer2, font=font(q(40), 'Bold'), fill=INK, anchor='mm')
bgp = a.out + '.bg.png'; bg.save(bgp)
info = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', a.src]))
dur = float(info['format']['duration']); sw, sh = info['streams'][0]['width'], info['streams'][0]['height']
cw = sh * 4 // 3; cx = int(min(max(a.cx * sw / 1920, cw / 2), sw - cw / 2))
crop = f"crop={cw}:{sh}:{cx - cw // 2}:0," if a.crop else ""
vf = f"[1:v]{crop}scale={vw}:{vh}:flags=lanczos[v];[0:v][v]overlay={vx}:{vy}:shortest=1,format=yuv420p[o]"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-i', bgp, '-i', a.src, '-filter_complex', vf, '-map', '[o]', '-map', '1:a',
                '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', '16', '-r', '30', '-c:a', 'aac', '-b:a', '192k', '-t', str(dur), '-movflags', '+faststart', a.out], check=True)
print('ok', a.out, dur)
