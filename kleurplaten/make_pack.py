"""Bundelt kleurplaten tot één PDF met kaft. python3 kleurplaten/make_pack.py out.pdf "Pack title" page1.png page2.png ...
Kaft gebruikt de kleurversies (<page>-color.png naast elke page.png, indien aanwezig)."""
import sys, os
from PIL import Image, ImageDraw, ImageFont
out, title, pages = sys.argv[1], sys.argv[2], sys.argv[3:]
def font(sz, w='ExtraBold'):
    f = ImageFont.truetype('fonts/Baloo2.ttf', sz); f.set_variation_by_name(w); return f
W, H = 3508, 2480; INK = (29, 53, 87)
cv = Image.new('RGB', (W, H), (255, 246, 214)); d = ImageDraw.Draw(cv)
for i in range(0, W, 120): d.ellipse([i - 30, H - 120, i + 30, H - 60], fill=(255, 210, 63))
d.text((W / 2, 230), title, font=font(170), fill=(255, 122, 69), anchor='mm', stroke_width=10, stroke_fill=INK)
d.text((W / 2, 400), f'{len(pages)} coloring pages to print at home · A4 & US Letter friendly', font=font(70, 'Bold'), fill=INK, anchor='mm')
tw, th = 1450, 815
for i, p in enumerate(pages[:4]):
    src = p[:-4] + '-color.png'; im = Image.open(src if os.path.exists(src) else p).convert('RGB')
    im.thumbnail((tw, th)); x0 = (W - 2 * tw - 160) // 2 + (i % 2) * (tw + 160) + (tw - im.width) // 2; y0 = 560 + (i // 2) * (th + 90)
    d.rounded_rectangle([x0 - 16, y0 - 16, x0 + im.width + 16, y0 + im.height + 16], radius=30, fill='white', outline=INK, width=8); cv.paste(im, (x0, y0))
d.text((W / 2, H - 150), 'Toet Toet and Friends TV  ·  youtube.com/@ToetToetAndFriends  ·  © for personal use only', font=font(54, 'Bold'), fill=INK, anchor='mm')
imgs = [Image.open(p).convert('RGB') for p in pages]
cv.save(out, save_all=True, append_images=imgs, resolution=300)
cv.save(out.replace('.pdf', '-cover.png'))
print('ok', out, 1 + len(imgs), 'pages')
