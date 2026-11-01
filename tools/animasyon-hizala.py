"""Yürüme karelerinde yanlış sprite-sheet kesiminden doğan ayak tabanı kaymasını giderir.
Orijinaller assets-orijinal/animasyon-hizalama/ altında korunur. Aynı komut tekrar güvenle çalışır.
Yalnız ortak tabandan >10 px kopan kareler taşınır; çizimin boyu ve en/boyu değişmez.
"""
from pathlib import Path
from statistics import median
from PIL import Image

KOK = Path(__file__).resolve().parent.parent
KLASOR = KOK / 'public/assets/anim'
YEDEK = KOK / 'assets-orijinal/animasyon-hizalama'

for ad in ['oyuncu-yuru', 'sakin-2-yuru', 'sakin-4-yuru']:
    dosyalar = sorted(KLASOR.glob(ad + '-*.png'))
    resimler = [Image.open(YEDEK / p.name if (YEDEK / p.name).exists() else p).convert('RGBA') for p in dosyalar]
    taban = round(median(im.getbbox()[3] for im in resimler))
    for p, im in zip(dosyalar, resimler):
        fark = taban - im.getbbox()[3]
        if abs(fark) <= 10:
            continue
        kutu = im.getbbox()
        if kutu[1] + fark < 0 or kutu[3] + fark > im.height:
            raise ValueError(f'{p.name}: taşıma çizimi keser; elle kontrol gerekli')
        YEDEK.mkdir(parents=True, exist_ok=True)
        if not (YEDEK / p.name).exists():
            (YEDEK / p.name).write_bytes(p.read_bytes())
        sonuc = Image.new('RGBA', im.size)
        sonuc.paste(im, (0, fark))
        sonuc.save(p, optimize=True)
        print(f'{p.name}: {fark:+} px, taban {taban}')
