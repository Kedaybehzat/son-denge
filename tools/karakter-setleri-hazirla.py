"""Mevcut portreleri korur; AI sheet'lerinden yalnız eksik karakter parçalarını çıkarır.
python3 tools/karakter-setleri-hazirla.py
Ham sheet ve promptlar: docs/karakter-uretim-istekleri.json, assets-orijinal/ai-uretim/2026-11-01.
"""
from pathlib import Path
import json, shutil
import numpy as np
from PIL import Image

KOK=Path(__file__).resolve().parent.parent
KAYNAK=KOK/'assets-orijinal/ai-uretim/2026-11-01'
HEDEF=KOK/'public/assets'
IDS=['selin','burak','nur','can','muhendis','ciftci','bilim','cocuklar','tamirci','kafile']


def kaydet(im,p):
    if p.exists():
        print('korundu',p.name);return
    a=np.array(im.convert('RGBA'));a[a[:,:,3]==0,:3]=0
    Image.fromarray(a).save(p,optimize=True)


def satirlar(im):
    a=np.asarray(im.getchannel('A'));dolu=(a>=128).sum(axis=1)>6
    bant=[];bas=None
    for y,v in enumerate(dolu):
        if v and bas is None:bas=y
        if bas is not None and (not v or y==len(dolu)-1):
            if y-bas>20:bant.append((bas,y))
            bas=None
    if len(bant)!=3:raise ValueError(f'Üç satır bekleniyor: {bant}')
    return [0]+[(bant[i][1]+bant[i+1][0])//2 for i in range(2)]+[im.height]


for id in IDS:
    im=Image.open(KAYNAK/f'sakin-{id}-sheet.png').convert('RGBA')
    sinir=satirlar(im);w=im.width//2
    for i in range(6):
        r,c=i//2,i%2;parca=im.crop((c*w,sinir[r],(c+1)*w,sinir[r+1]))
        a=np.asarray(parca.getchannel('A'));ys,xs=np.where(a>=128)
        x0,y0,x1,y1=int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)
        # Grup genişliğini de koru: geniş aile çizimleri hücreye sığarken
        # bütün karelerde boy aynı kalır (önce tüm pozların en/boyu ölçülür).
        if i==0:
            kutular=[]
            for j in range(6):
                rr,cc=j//2,j%2;p=im.crop((cc*w,sinir[rr],(cc+1)*w,sinir[rr+1]))
                aa=np.asarray(p.getchannel('A'));yy,xx=np.where(aa>=128)
                kutular.append((int(xx.max()-xx.min()+1),int(yy.max()-yy.min()+1)))
            genislik_orani=max(bw/bh for bw,bh in kutular)
            hedef_h=min(450,int(470/max(genislik_orani,1e-6)))
        oran=hedef_h/(y1-y0);govde=parca.crop((x0,y0,x1,y1))
        govde=govde.resize((round(govde.width*oran),hedef_h),Image.Resampling.LANCZOS)
        # Geniş gruplar kutu merkezine; tek kişiler baş merkezine hizalanır.
        if id in ['ciftci','cocuklar','kafile']:
            x=(512-govde.width)//2
        else:
            yy,xx=np.where(a[y0:y0+max(8,(y1-y0)//6)]>=128)
            kok=(float(np.median(xx))-x0)*oran
            x=max(8,min(512-govde.width-8,round(256-kok)))
        if x<0 or x+govde.width>512:raise ValueError(f'{id}: genişlik aşımı')
        out=Image.new('RGBA',(512,512));out.alpha_composite(govde,(x,480-hedef_h))
        tur,n=('bekle',i+1) if i<2 else ('yuru',i-1)
        kaydet(out,HEDEF/'anim'/f'sakin-{id}-{tur}-{n}.png')
        if i==0:kaydet(out,HEDEF/f'sakin-{id}.png')
    portre=HEDEF/f'{"kurucu" if id in IDS[:4] else "ziyaretci"}-{id}.png'
    kaydet(Image.open(portre).convert('RGBA').resize((128,128),Image.Resampling.LANCZOS),HEDEF/f'rozet-{id}.png')
    print(id,'tamam',sinir)
im=Image.open(KAYNAK/'portre-oyuncu.png').convert('RGB').resize((512,512),Image.Resampling.LANCZOS)
if not (HEDEF/'portre-oyuncu.png').exists():im.save(HEDEF/'portre-oyuncu.png',optimize=True)
