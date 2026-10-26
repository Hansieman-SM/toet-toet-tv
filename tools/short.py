"""Maakt een verticale Short (1080x1920) van een liggende video.
python3 tools/short.py SRC.mp4 OUT.mp4 --title "Under the Sea" --sub "Who swims by?" --cx 960 --colors "#bfe6f0,#4b6aa6" [--footer1 ... --footer2 ...]
SRC moet al de juiste lengte en audio hebben."""
import argparse, subprocess, json, math
from PIL import Image, ImageDraw, ImageFont
p = argparse.ArgumentParser(); p.add_argument('src'); p.add_argument('out')
p.add_argument('--title', required=True); p.add_argument('--sub', default=''); p.add_argument('--cx', type=int, default=960)
p.add_argument('--colors', default='#bfe6f0,#4b6aa6'); p.add_argument('--footer1', default='Toet Toet and Friends TV')
p.add_argument('--footer2', default='Watch the full video on our channel!'); a = p.parse_args()
def font(sz, w='ExtraBold'):
    f = ImageFont.truetype('fonts/Baloo2.ttf', sz); f.set_variation_by_name(w); return f
INK = '#1d3557'; W, H = 1080, 1920; c1, c2 = a.colors.split(',')
rgb = lambda c: tuple(int(c[i:i+2], 16) for i in (1, 3, 5))
bg = Image.new('RGB', (W, H)); d = ImageDraw.Draw(bg); r1, r2 = rgb(c1), rgb(c2)
for y in range(H): k = y / H; d.line([(0, y), (W, y)], fill=tuple(int(r1[i] + (r2[i] - r1[i]) * k) for i in range(3)))
for i in range(14): x0, y0 = (i * 173) % W, (i * 311) % H; d.ellipse([x0 - 30, y0 - 30, x0 + 30, y0 + 30], outline=(255, 255, 255), width=6)
vw = W - 80; vh = int(vw * 1080 / 1440); vy = 560
f1 = font(118 if len(a.title) < 14 else 92)
for dx, dy in [(-6,0),(6,0),(0,-6),(0,6),(-4,-4),(4,4),(-4,4),(4,-4)]: d.text((W/2+dx, 300+dy), a.title, font=f1, fill=INK, anchor='mm')
d.text((W/2, 300), a.title, font=f1, fill='#ffd23f', anchor='mm')
if a.sub: d.text((W/2, 440), a.sub, font=font(58, 'Bold'), fill='#ffffff', anchor='mm', stroke_width=4, stroke_fill=INK)
d.rounded_rectangle([28, vy - 12, 52 + vw, vy + vh + 12], radius=36, fill='white')
by = vy + vh + 120
d.rounded_rectangle([110, by, W - 110, by + 220], radius=50, fill='white', outline=INK, width=6)
d.text((W/2, by + 75), a.footer1, font=font(56), fill='#ff7a45', anchor='mm')
d.text((W/2, by + 150), a.footer2, font=font(40, 'Bold'), fill=INK, anchor='mm')
bgp = a.out + '.bg.png'; bg.save(bgp)
dur = float(json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', a.src]))['format']['duration'])
cx = min(max(a.cx, 720), 1200)
vf = f"[1:v]crop=1440:1080:{cx - 720}:0,scale={vw}:{vh}[v];[0:v][v]overlay=40:{vy}:shortest=1,format=yuv420p[o]"
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-i', bgp, '-i', a.src, '-filter_complex', vf, '-map', '[o]', '-map', '1:a',
                '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-r', '30', '-c:a', 'aac', '-b:a', '160k', '-t', str(dur), '-movflags', '+faststart', a.out], check=True)
print('ok', a.out, dur)
