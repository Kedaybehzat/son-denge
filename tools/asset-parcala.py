"""Mockup'tan ayrı, tekrar kullanılabilir UI parçaları çıkarır.
python3 tools/asset-parcala.py
Kaynak: assets-orijinal/tasarim-referans/ (git dışı); tarif: src/data/arayuz-parcalari.json.
Pillow ile yalnız kesme/9-dilim ayırma yapılır; yeni resim üretilmez.
"""
import json
from pathlib import Path
from PIL import Image, ImageDraw

KOK = Path(__file__).resolve().parent.parent
TARIF = KOK / 'src/data/arayuz-parcalari.json'


def dokuz_dilim(kaynak, boyut, kenar, cikti_kenar):
    """Köşeleri ayrı ölçekle; ortadaki gömülü yazı/göstergeyi hiç kopyalama."""
    w, h = kaynak.size
    ow, oh = boyut
    sonuc = Image.new('RGBA', boyut)
    xs, ys = [0, kenar, w-kenar, w], [0, kenar, h-kenar, h]
    tx, ty = [0, cikti_kenar, ow-cikti_kenar, ow], [0, cikti_kenar, oh-cikti_kenar, oh]
    for y in range(3):
        for x in range(3):
            if x == y == 1:
                continue
            parca = kaynak.crop((xs[x], ys[y], xs[x+1], ys[y+1]))
            parca = parca.resize((tx[x+1]-tx[x], ty[y+1]-ty[y]), Image.Resampling.LANCZOS)
            sonuc.paste(parca, (tx[x], ty[y]))
    return sonuc


def main():
    for p in json.loads(TARIF.read_text())['parcalar']:
        kaynak = KOK / 'assets-orijinal/tasarim-referans' / (p['kaynak'] + '.png')
        im = Image.open(kaynak).convert('RGBA').crop(p['kutu'])
        if p['islem'] == 'cerceve':
            # Üstteki SON DENGE tabelası bileşen değildir. Yazısız alt kenar
            # aynı genişlikteki üst şeridi sağlar; köşeler/sarmaşıklar korunur.
            im.paste(im.crop((64, im.height-64, im.width-64, im.height)), (64, 0))
            im = dokuz_dilim(im, tuple(p['boyut']), 64, p['dilim'])
        elif p['islem'] == 'dugme':
            im = dokuz_dilim(im, tuple(p['boyut']), 18, p['dilim'])
            # Metin sınırları 9-dilim üst/alt şeridine değmesin.
            ImageDraw.Draw(im).rectangle((18, 13, im.width-19, im.height-14), fill=(0,0,0,0))
        elif p['islem'] == 'doku':
            # Karşılıklı ayna: tekrarlandığında dikdörtgen doku dikişi oluşmaz.
            w, h = p['boyut']
            parca = im.resize((w // 2, h // 2), Image.Resampling.LANCZOS)
            im = Image.new('RGBA', (w, h))
            im.paste(parca, (0, 0))
            im.paste(parca.transpose(Image.Transpose.FLIP_LEFT_RIGHT), (w // 2, 0))
            ust = im.crop((0, 0, w, h // 2))
            im.paste(ust.transpose(Image.Transpose.FLIP_TOP_BOTTOM), (0, h // 2))
        else:
            im = im.resize(tuple(p['boyut']), Image.Resampling.LANCZOS)
        hedef = KOK / 'public/assets' / p['dosya']
        if hedef.suffix == '.jpg':
            im.convert('RGB').save(hedef, quality=88, optimize=True)
        else:
            im.save(hedef, optimize=True)
        print(f'{p["dosya"]}: {im.width}x{im.height}, {hedef.stat().st_size // 1024} KB')


if __name__ == '__main__':
    main()
