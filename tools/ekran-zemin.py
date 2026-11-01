"""Yeni mockup'lardan ekran zeminleri: arıza konsolları, ayarlar, HUD, alt şerit, hikaye ekranları.
Kaynak assets-orijinal/tasarim-referans/ (git dışı). Çalıştır: python3 tools/ekran-zemin.py"""
from pathlib import Path
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
import numpy as np
KOK = Path(__file__).resolve().parent.parent
R = KOK / 'assets-orijinal/tasarim-referans'
OUT = KOK / 'public/assets'

def bul(im, k, karart=0.5, yaricap=14, doygun=0.6):
    b = im.crop(k)
    x = ImageEnhance.Brightness(ImageEnhance.Color(b.filter(ImageFilter.GaussianBlur(yaricap))).enhance(doygun)).enhance(karart)
    m = Image.new('L', b.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, b.width - 1, b.height - 1), radius=6, fill=255)
    im.paste(Image.composite(x, b, m.filter(ImageFilter.GaussianBlur(2))), k[:2])

def kaydet(im, ad, q=84):
    im.save(OUT / ad, quality=q, optimize=True, progressive=True); print(ad, (OUT / ad).stat().st_size // 1024, 'KB')

# 1) Arıza (operatörsüz) konsolları: iç içerik ve mesaj silinir, başlık/çerçeve/Kapat kalır
for kaynak, id in [('konsol-enerji-ariza', 'enerji'), ('konsol-geri-ariza', 'geriDonusum'), ('konsol-sera-ariza', 'sera'), ('konsol-su-ariza', 'su')]:
    im = Image.open(R / f'{kaynak}.png').convert('RGB')
    bul(im, (80, 196, 1596, 745), karart=0.55, yaricap=18)
    bul(im, (80, 745, 1370, 856), karart=0.55, yaricap=18)
    bul(im, (1349, 91, 1581, 187), karart=0.45)
    kaydet(im, f'panel-{id}-kapali.jpg')

# 2) Ayarlar: değişken chip, ikon, değer ve kaydırıcılar silinir; Tab satırı (oyunda yok) silinir
im = Image.open(R / 'ayarlar.png').convert('RGB')
for k in [(266, 269, 367, 303), (266, 413, 378, 450), (1270, 388, 1335, 430), (136, 375, 208, 445), (136, 230, 208, 300),
          (370, 527, 1190, 567), (1222, 522, 1324, 570), (370, 596, 1190, 639), (1222, 592, 1324, 642), (912, 822, 1205, 876)]:
    bul(im, k, karart=0.55, yaricap=10)
kaydet(im, 'ekran-ayarlar.jpg')

# 3) HUD şeridi (y 249..489): değerler, barlar, eylem noktaları, kişi, denge silinir
im = Image.open(R / 'hud.png').convert('RGB').crop((0, 249, 2172, 489))
F = 1.086
def d(x0, y0, x1, y1): return (int(x0 * F), int(y0 * F), int(x1 * F), int(y1 * F))
silinecek = [d(60, 50, 218, 100), d(178, 106, 250, 134), d(95, 138, 175, 174), d(1828, 52, 1878, 98), d(1735, 104, 1955, 140)]
for x0 in [278, 475, 675, 875, 1075, 1275, 1490]:
    silinecek += [d(x0 + 60, 108, x0 + 132, 140), d(x0 + 132, 100, x0 + 196, 145)]
silinecek.append(d(1690, 100, 1700, 145))
for k in silinecek: bul(im, k, karart=0.45, yaricap=8)
kaydet(im, 'hud-serit.jpg', 86)

# 4) Alt şerit: Malzeme sayısı silinir; Koloni düğmesindeki sabit "seçili" ışığı söndürülür
im = Image.open(R / 'alt-serit.png').convert('RGB').crop((0, 249, 2172, 487))
bul(im, d(1868, 66, 1932, 142), karart=0.5, yaricap=8)
a = np.asarray(im).astype(int)
x0, y0, x1, y1 = d(30, 0, 300, 212)
blok = a[y0:y1, x0:x1]
r, g, b = blok[..., 0], blok[..., 1], blok[..., 2]
parlak = (g > r + 25) & (g > 120)
blok[parlak] = (blok[parlak] * np.array([0.55, 0.48, 0.4])).astype(int)
a[y0:y1, x0:x1] = blok
kaydet(Image.fromarray(a.clip(0, 255).astype('uint8')), 'alt-serit.jpg', 86)

# 5) Hikaye: tam ekran (metin story.js ile aynı) + çerçevesiz illüstrasyon (hikaye-N.png)
for i in range(1, 5):
    im = Image.open(R / f'hikaye-ekran-{i}.png').convert('RGB')
    kaydet(im, f'hikaye-ekran-{i}.jpg', 82)
    im.crop((256, 116, 1416, 430)).save(OUT / f'hikaye-{i}.png', optimize=True)
