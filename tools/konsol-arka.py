"""Mockup tabanlı konsol zeminleri: değişken bölgeler bulanıklaştırılır, kalan tüm çizim korunur.
Kaynak: assets-orijinal/tasarim-referans/<kaynak>.png (git dışı). Yerleşim: src/data/konsol-yerlesim.json.
Kullanım: python3 tools/konsol-arka.py  ->  public/assets/panel-<id>.jpg ve yonetim-<bölüm>.jpg"""
import json
from pathlib import Path
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance

KOK = Path(__file__).resolve().parent.parent
Y = json.loads((KOK / 'src/data/konsol-yerlesim.json').read_text())

def bulaniklastir(im, kutu, karart=0.55, yaricap=16, tuy=3):
    x0, y0, x1, y1 = kutu
    bolge = im.crop((x0, y0, x1, y1))
    bul = bolge.filter(ImageFilter.GaussianBlur(yaricap))
    bul = ImageEnhance.Brightness(ImageEnhance.Color(bul).enhance(0.6 if karart < 0.9 else 1.0)).enhance(karart)
    maske = Image.new('L', bolge.size, 0)
    ImageDraw.Draw(maske).rounded_rectangle((0, 0, bolge.width - 1, bolge.height - 1), radius=8, fill=255)
    if tuy > 3:   # yumuşak kenar: dokunun içinde kare izi kalmasın
        maske = Image.new('L', bolge.size, 0)
        ImageDraw.Draw(maske).ellipse((tuy, tuy, bolge.width - 1 - tuy, bolge.height - 1 - tuy), fill=255)
    maske = maske.filter(ImageFilter.GaussianBlur(tuy))
    im.paste(Image.composite(bul, bolge, maske), (x0, y0))

for id, k in Y['konsollar'].items():
    im = Image.open(KOK / f"assets-orijinal/tasarim-referans/{k['kaynak']}.png").convert('RGB')
    for kutu in k['bulanik']:
        # ekran içi daha koyu: eski barların izi canlı göstergelerin altında seçilmesin
        bulaniklastir(im, kutu, karart=0.32, yaricap=26) if kutu == k['ekran'] else bulaniklastir(im, kutu)
    for kutu in k['kutular']:            # kutuların gömülü yazısı da silinsin (üstüne canlı kutu gelir)
        bulaniklastir(im, kutu, karart=0.7, yaricap=10)
    im.save(KOK / f'public/assets/panel-{id}.jpg', quality=84, optimize=True, progressive=True)
    print(id, (KOK / f'public/assets/panel-{id}.jpg').stat().st_size // 1024, 'KB')

# Yönetim panosu bölümleri: sekmeler, başlık, çerçeve ve bölüm çizimleri korunur
for id, k in Y.get('yonetim', {}).items():
    im = Image.open(KOK / f"assets-orijinal/tasarim-referans/{k['kaynak']}.png").convert('RGB')
    temizle = k.get('temizle', [])
    for kutu in k['bulanik']:
        govde = kutu == k.get('govde')
        if kutu in temizle:
            # zemin dokusunun rengini koruyarak sil (harita parşömeni, mantar pano, plan kâğıdı)
            koyu = id == 'kesif' and kutu == temizle[-1]
            bulaniklastir(im, kutu, karart=0.6 if koyu else 0.97, yaricap=34, tuy=3 if koyu or id != 'kesif' else 14)
            continue
        bulaniklastir(im, kutu, karart=0.6 if govde else (0.32 if kutu == k['ekran'] else 0.55), yaricap=22 if govde else 16)
    im.save(KOK / f'public/assets/yonetim-{id}.jpg', quality=84, optimize=True, progressive=True)
    print('yonetim', id, (KOK / f'public/assets/yonetim-{id}.jpg').stat().st_size // 1024, 'KB')
