"""Üretilmiş AI assetlerini yedekten oyuna hazırlar; ağ/API çağrısı yapmaz.
python3 tools/ai-asset-hazirla.py
Tarif docs/ai-asset-uretim.json; ham görseller git dışı assets-orijinal/ai-uretim/ altındadır.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image

KOK = Path(__file__).resolve().parent.parent
TARIF = json.loads((KOK / 'docs/ai-asset-uretim.json').read_text())
KAYNAK = KOK / TARIF['kaynakKlasor']
HEDEF = KOK / 'public/assets'


def alpha_kutusu(im):
    a = np.asarray(im.getchannel('A'))
    ys, xs = np.where(a >= 128)
    if not len(xs):
        raise ValueError('Opak içerik bulunamadı')
    return int(xs.min()), int(ys.min()), int(xs.max()+1), int(ys.max()+1)


def saydam_rgb_temizle(im):
    # Saydam pikselin gizli RGB'si, bazı önizlemelerde kahverengi bulut gibi
    # gösterilebiliyor. Görünen içeriği değiştirmeden tamamen boş RGB'yi sıfırla.
    a = np.array(im)
    a[a[:, :, 3] == 0, :3] = 0
    return Image.fromarray(a)


def ikon_hazirla(ad):
    im = Image.open(KAYNAK / ad).convert('RGBA')
    im = im.crop(im.getbbox())
    im.thumbnail((224, 224), Image.Resampling.LANCZOS)
    cikti = Image.new('RGBA', (256, 256))
    cikti.alpha_composite(im, ((256-im.width)//2, (256-im.height)//2))
    saydam_rgb_temizle(cikti).save(HEDEF / ad, optimize=True)
    print(ad, '256x256')


def animasyon_hazirla(tanim):
    im = Image.open(KAYNAK / tanim['kaynak']).convert('RGBA')
    w = im.width // tanim['sutun']
    sinirlar = tanim['satirKesimleri']
    for i in range(6):
        sutun, satir = i % 2, i // 2
        parca = im.crop((sutun*w, sinirlar[satir], (sutun+1)*w, sinirlar[satir+1]))
        x0, y0, x1, y1 = alpha_kutusu(parca)
        # Karedeki boşluklar/hatalı sheet sınırları taşınmaz. Bütün pozlar aynı
        # görünür boya ve aynı tabana yerleşir. Üst gövde kökü yatayda sabittir.
        a = np.asarray(parca.getchannel('A'))
        ys, xs = np.where(a[y0:y0+max(8, (y1-y0)//6)] >= 128)
        bas_x = float(np.median(xs)) if len(xs) else (x0+x1)/2
        oran = 450 / (y1-y0)
        govde = parca.crop((x0,y0,x1,y1))
        govde = govde.resize((round(govde.width*oran),450), Image.Resampling.LANCZOS)
        kok_x = (bas_x-x0)*oran
        x = round(256-kok_x)
        if x < 0 or x+govde.width > 512:
            raise ValueError(f'{tanim["ad"]} kare {i+1}: yatay sınır aşıldı')
        cikti = Image.new('RGBA',(512,512))
        cikti.alpha_composite(govde,(x,30))
        tur, n = ('bekle',i+1) if i < 2 else ('yuru',i-1)
        ad = f'{tanim["ad"]}-{tur}-{n}.png'
        (HEDEF / 'anim').mkdir(exist_ok=True)
        saydam_rgb_temizle(cikti).save(HEDEF / 'anim' / ad,optimize=True)
        print(ad,'512x512 taban=480')


for ad in TARIF['ikonlar']:
    ikon_hazirla(ad)
for tanim in TARIF['animasyonlar']:
    animasyon_hazirla(tanim)
im = Image.open(KAYNAK / TARIF['harita']).convert('RGB')
im.thumbnail((1536,1024),Image.Resampling.LANCZOS)
im.save(HEDEF / TARIF['harita'], optimize=True)
print(TARIF['harita'],im.size)
