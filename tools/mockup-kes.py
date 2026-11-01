# Mockup'lardan oyun görselleri çıkarır (tools/mockup-kes.py olarak repoya da kopyalanır)
import sys
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
KOK = sys.argv[1] if len(sys.argv) > 1 else "."
R = f'{KOK}/assets-orijinal/tasarim-referans/'
OUT = f'{KOK}/public/assets/'

def ac(ad): return Image.open(R + ad + '.png').convert('RGB')

def cam(im, kutu, yaricap=26, tuy=18, karart=0.36):
    """kutu (oransal x0,y0,x1,y1) bölgesini bulanık + koyu 'cam etiket' yapar (gömülü yazıyı siler)"""
    w, h = im.size
    x0, y0, x1, y1 = [int(v * (w if i % 2 == 0 else h)) for i, v in enumerate(kutu)]
    maske = Image.new('L', im.size, 0)
    ImageDraw.Draw(maske).rounded_rectangle((x0, y0, x1, y1), radius=int(h * 0.12), fill=255)
    maske = maske.filter(ImageFilter.GaussianBlur(tuy))
    bulanik = im.filter(ImageFilter.GaussianBlur(yaricap))
    bulanik = ImageEnhance.Brightness(ImageEnhance.Color(bulanik).enhance(0.7)).enhance(karart)
    return Image.composite(bulanik, im, maske)

# Kontrol kutusu sahneleri: (kaynak, kesim, cam bölgesi)
ORTA = (0.25, 0.04, 0.76, 1.02)
SAG = (0.50, 0.04, 1.02, 1.02)
KUTULAR = {  # kutu başına ölçülmüş yazı bölgesi
    'gunes':    ('konsol-enerji-rehber', (106, 524, 574, 706), (0.33, 0.03, 0.81, 1.02)),
    'ruzgar':   ('konsol-enerji-rehber', (604, 524, 1068, 706), (0.27, 0.03, 0.79, 1.02)),
    'dizel':    ('konsol-enerji-rehber', (1100, 524, 1570, 706), (0.35, 0.03, 0.91, 1.02)),
    'sulama':   ('konsol-sera', (106, 519, 574, 707), (0.27, 0.03, 0.79, 1.02)),
    'kompost':  ('konsol-sera', (604, 519, 1068, 707), (0.27, 0.03, 0.79, 1.02)),
    'fidan':    ('konsol-sera', (1100, 519, 1570, 707), (0.29, 0.03, 0.76, 1.02)),
    'ayristir': ('konsol-geri', (96, 502, 570, 710), (0.35, 0.03, 0.91, 1.02)),
    'onar':     ('konsol-geri', (606, 502, 1070, 710), (0.18, 0.03, 0.82, 1.02)),
    'yak':      ('konsol-geri', (1102, 504, 1580, 708), (0.35, 0.03, 0.97, 1.02)),
    'filtre':   ('konsol-su', (110, 522, 820, 728), (0.50, 0.03, 1.02, 1.02)),
    'pompa':    ('konsol-su', (854, 522, 1570, 728), (0.50, 0.03, 1.02, 1.02)),
}
for ad, (kaynak, kesim, bolge) in KUTULAR.items():
    x0, y0, x1, y1 = bolge
    p = cam(ac(kaynak).crop(kesim), (max(0, x0 - 0.05), y0, min(1.02, x1 + 0.05), y1))
    p.save(OUT + f'modul-{ad}.png', optimize=True)

# Operatör yüz rozetleri (Nur mockup'ta Selin'in kopyası çıktığı için alınmadı)
ROZETLER = {'selin': ('konsol-enerji', (1306, 98, 1408, 200)), 'burak': ('konsol-su', (1278, 96, 1390, 208)), 'can': ('konsol-geri', (1276, 86, 1376, 186))}
for ad, (kaynak, kesim) in ROZETLER.items():
    ac(kaynak).crop(kesim).resize((128, 128), Image.LANCZOS).save(OUT + f'rozet-{ad}.png', optimize=True)

# Su tankları (su konsolunun oda görseli; seviye göstergesini oyun çizer)
ac('konsol-su').crop((958, 240, 1566, 382)).save(OUT + 'konsol-tank.png', optimize=True)

# Not: mockup çerçevesinden 9-dilim denendi; ince ve sönük çıktığı için kullanılmıyor (konsol-cerceve.png yuvası açık).
print('tamam')
