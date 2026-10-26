import subprocess, os
from PIL import Image, ImageDraw, ImageFont
def font(sz, w='ExtraBold'):
    f = ImageFont.truetype('fonts/Baloo2.ttf', sz); f.set_variation_by_name(w); return f
INK = '#1d3557'
# naam, bron, start, eind, titel, ondertitel, achtergrondkleuren, crop-midden-x (None = volle breedte)
CLIPS = [
  ('short1-splets', 'out/avontuur/av05_wasstraat.mp4', 5, 21, 'Splets!', 'Toet wordt helemaal vies', ('#8ecae6', '#219ebc'), 860),
  ('short2-kiekeboe', 'out/e5_kiekeboe.mp4', 5, 29, 'Kiekeboe!', 'Wie verstopt zich daar?', ('#ffd6a5', '#f4a261'), 960),
  ('short3-geluid', 'out/e4_geluid.mp4', 4.5, 17, 'Wie maakt dit geluid?', 'Raad jij het?', ('#ffe8a3', '#e9c46a'), 960),
  ('short4-regenboog', 'out/avontuur/av08_regen.mp4', 86, 112, 'De regenboog!', 'Ken jij alle kleuren?', ('#cdeeff', '#9b5de5'), 720),
  ('short5-koeien', 'out/e1_koeien.mp4', 10, 37, 'Tel je mee?', '1, 2, 3, 4, 5 koeien!', ('#d8f3dc', '#52b788'), None),
  ('short6-feest', 'out/avontuur/av06_taart.mp4', 66, 83, 'Hiep hiep hoera!', 'Een verjaardagsfeest', ('#ffcfe3', '#ff5d8f'), None),
]
W, H = 1080, 1920
for name, src, a, b, t1, t2, (c1, c2), cx in CLIPS:
    vw = W - 80
    vh = int(vw * (1080 / (1440 if cx else 1920)))
    vy = 560 if cx else 650
    bg = Image.new('RGB', (W, H), c1); d = ImageDraw.Draw(bg)
    for y in range(H):
        k = y / H; r1, g1, b1 = Image.new('RGB', (1, 1), c1).getpixel((0, 0)); r2, g2, b2 = Image.new('RGB', (1, 1), c2).getpixel((0, 0))
        d.line([(0, y), (W, y)], fill=(int(r1 + (r2 - r1) * k), int(g1 + (g2 - g1) * k), int(b1 + (b2 - b1) * k)))
    for i in range(14):
        import math
        x0 = (i * 173) % W; y0 = (i * 311) % H
        d.ellipse([x0 - 30, y0 - 30, x0 + 30, y0 + 30], fill=None, outline=(255, 255, 255), width=6)
    f1 = font(118 if len(t1) < 14 else 92)
    tw = d.textlength(t1, font=f1)
    for dx, dy in [(-6,0),(6,0),(0,-6),(0,6),(-4,-4),(4,4),(-4,4),(4,-4)]: d.text((W/2+dx, 300+dy), t1, font=f1, fill=INK, anchor='mm')
    d.text((W/2, 300), t1, font=f1, fill='#ffd23f', anchor='mm')
    f2 = font(58, 'Bold'); d.text((W/2, 440), t2, font=f2, fill=INK, anchor='mm')
    d.rounded_rectangle([40 - 12, vy - 12, 40 + vw + 12, vy + vh + 12], radius=36, fill='white')
    by = vy + vh + 120
    d.rounded_rectangle([140, by, W - 140, by + 220], radius=50, fill='white', outline=INK, width=6)
    d.text((W/2, by + 75), 'Truckje Toet', font=font(60), fill='#ff7a45', anchor='mm')
    d.text((W/2, by + 150), 'Kijk de hele aflevering op ons kanaal!', font=font(40, 'Bold'), fill=INK, anchor='mm')
    bgp = f'/tmp/claude-0/sh/{name}.png'; bg.save(bgp)
    dur = b - a
    crop = f'crop=1440:1080:{cx - 720}:0,' if cx else ''
    vf = (f"[1:v]{crop}scale={vw}:{vh},fade=t=in:st=0:d=0.3,fade=t=out:st={dur - .6}:d=0.6[v];"
          f"[0:v][v]overlay=40:{vy}:shortest=1,format=yuv420p[o]")
    cmd = ['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-i', bgp, '-ss', str(a), '-t', str(dur), '-i', src,
           '-filter_complex', vf, '-map', '[o]', '-map', '1:a', '-af', f'afade=t=in:st=0:d=0.3,afade=t=out:st={dur - .8}:d=0.8',
           '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-r', '30', '-c:a', 'aac', '-b:a', '192k', '-t', str(dur), '-movflags', '+faststart', f'out/shorts/{name}.mp4']
    subprocess.run(cmd, check=True)
    print('ok', name, dur)
