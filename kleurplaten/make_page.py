"""Maakt een printklare kleurplaat (A4 liggend, 300 dpi) uit een kleurcompositie.
python3 kleurplaten/make_page.py PAGE "Title" out_basename
-> out_basename.png (A4 300 dpi) en out_basename.pdf"""
import sys, subprocess, os, cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont
page, title, out = sys.argv[1], sys.argv[2], sys.argv[3]
AW, AH = 3308, 1861
tmp = out + '.color.png'; line = out + '.line.png'
subprocess.run(['node', 'kleurplaten/pages.js', tmp], check=True, env={**os.environ, 'PAGE': page, 'STILL': '0', 'OW': str(AW), 'OH': str(AH)})
subprocess.run(['python3', 'kleurplaten/lineart.py', tmp, line], check=True)
W, H = 3508, 2480
pg = Image.new('L', (W, H), 255); d = ImageDraw.Draw(pg)
def font(sz, w='ExtraBold'):
    f = ImageFont.truetype('fonts/Baloo2.ttf', sz); f.set_variation_by_name(w); return f
# holle titelletters (om in te kleuren)
d.text((W / 2, 190), title, font=font(190), fill=255, anchor='mm', stroke_width=7, stroke_fill=0)
art = Image.open(line).convert('L')
ay = 330; pg.paste(art, (100, ay))
d.rounded_rectangle([90, ay - 10, 100 + AW + 10, ay + AH + 10], radius=40, outline=0, width=8)
d.text((W / 2, 2330), 'Toet Toet and Friends TV  ·  youtube.com/@ToetToetAndFriends', font=font(56, 'Bold'), fill=0, anchor='mm')
d.text((W / 2, 2405), '© Toet Toet and Friends TV – for personal use only. Print as many as you like for your own family or classroom.', font=font(40, 'Medium'), fill=80, anchor='mm')
pg.save(out + '.png', dpi=(300, 300))
pg.convert('RGB').save(out + '.pdf', resolution=300)
from PIL import Image as _I; _I.open(tmp).convert('RGB').resize((1654, 930)).save(out + '-color.png'); os.remove(tmp); os.remove(line)
print('ok', out)
