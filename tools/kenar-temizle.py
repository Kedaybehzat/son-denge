"""Kesilmiş (şeffaf) görsellerde kenar temizliği: arka plan sisi, kopuk lekeler, yarı silinmiş delikler, açık renk saçak.
Orijinaller assets-orijinal/kenar-oncesi/ altına bir kez yedeklenir (git dışı); tekrar çalıştırmak yedekten başlar.
Kullanım: python3 tools/kenar-temizle.py [dosya ...]   (dosya verilmezse tüm uygun görseller)"""
import sys, shutil, glob
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

KOK = Path(__file__).resolve().parent.parent
A_DIR = KOK / 'public/assets'
YEDEK = KOK / 'assets-orijinal/kenar-oncesi'
# Dikdörtgen illüstrasyon / 9-dilim / opak zeminler hariç: yalnız serbest kesilmiş görseller
HARIC = ('ui-', 'kart-', 'son-', 'oda-', 'menu-arka', 'manzara', 'hikaye', 'hud-kutu', 'buton', 'kart-cerceve', 'modul-', 'rozet-', 'konsol-', 'yonetim-', 'panel-', 'ziyaretci-', 'kurucu-')
PANEL_NESNE = ('panel.png', 'panel-enerji.png', 'panel-su.png', 'panel-sera.png', 'panel-geri.png')

def uygun(p):
    ad = p.name
    if ad in PANEL_NESNE: return True
    return not ad.startswith(HARIC)

def temizle(yol):
    rel = yol.relative_to(A_DIR)
    yedek = YEDEK / rel
    if not yedek.exists():
        yedek.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(yol, yedek)
    im = Image.open(yedek)
    if im.mode not in ('RGBA', 'LA', 'P'): return None
    a = np.asarray(im.convert('RGBA')).astype(np.float32)
    A = a[..., 3]
    if A.min() >= 250: return None
    once = ((A > 0) & (A < 60)).sum()
    M = A >= 128
    lab, n = ndimage.label(M)
    if not n: return None
    alan = ndimage.sum(np.ones_like(A), lab, range(1, n + 1))
    tut = np.isin(lab, 1 + np.where(alan >= max(40, alan.max() * 0.004))[0])
    # yarı silinmiş iç delikler: tamamen şeffaf olmayan delikler doldurulur
    dolu = ndimage.binary_fill_holes(tut)
    delik, dn = ndimage.label(dolu & ~tut)
    if dn:
        ort = ndimage.mean(A, delik, range(1, dn + 1))
        doldur = np.isin(delik, 1 + np.where(ort > 30)[0])
        tut |= doldur; A[doldur] = 255
    destek = ndimage.binary_dilation(tut, iterations=3)
    A[~destek] = 0
    A[(A < 40) & ~tut] = 0
    # saçak rengi: yarı saydam/kenar pikseller en yakın dolu pikselin rengini alır
    ic = A >= 235
    if ic.any():
        _, (iy, ix) = ndimage.distance_transform_edt(~ic, return_indices=True)
        kenar = (A > 0) & ~ic
        rgb = a[..., :3]
        rgb[kenar] = rgb[iy[kenar], ix[kenar]]
        # gövde sınırındaki çok açık 1 piksellik saçak yumuşatılır
        sinir = tut & ~ndimage.binary_erosion(tut, iterations=1)
        acik = sinir & (a[..., :3].min(axis=2) > 225) & (A < 255)
        A[acik] *= 0.5
    a[..., 3] = A
    Image.fromarray(a.clip(0, 255).astype(np.uint8), 'RGBA').save(yol, optimize=True)
    sonra = ((A > 0) & (A < 60)).sum()
    return once, sonra, int(dn)

# Dikdörtgen illüstrasyonlar (kart/son/menü): kenardaki ince yarı saydam şerit opaklaştırılır
OPAK = ('kart-', 'son-', 'menu-arka')
def opaklastir(yol):
    yedek = YEDEK / yol.relative_to(A_DIR)
    if not yedek.exists():
        yedek.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(yol, yedek)
    a = np.asarray(Image.open(yedek).convert('RGBA')).astype(np.float32)
    A = a[..., 3]
    if A.min() >= 250: return None
    ic = A >= 250
    _, (iy, ix) = ndimage.distance_transform_edt(~ic, return_indices=True)
    a[..., :3] = a[..., :3][iy, ix]
    a[..., 3] = 255
    Image.fromarray(a.astype(np.uint8), 'RGBA').convert('RGB').save(yol, optimize=True)
    return int((~ic).sum())

if not sys.argv[1:]:
    for p in sorted(A_DIR.glob('*.png')):
        if p.name.startswith(OPAK) and p.name != 'kart-cerceve.png':
            n = opaklastir(p)
            if n: print(f'{p.name:36} {n} kenar pikseli opaklaştırıldı')

dosyalar = [Path(f).resolve() for f in sys.argv[1:]] or [p for p in sorted(A_DIR.rglob('*.png')) if uygun(p)]
for p in dosyalar:
    r = temizle(p)
    if r: print(f'{str(p.relative_to(A_DIR)):36} toz {r[0]:>7} → {r[1]:>5}  delik {r[2]}')
