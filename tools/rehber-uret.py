"""Güncel asset PDF'i. Python 3 + Pillow: python3 tools/rehber-uret.py"""
from pathlib import Path
from datetime import date
import re
from PIL import Image, ImageDraw, ImageFont, JpegImagePlugin

KOK = Path(__file__).resolve().parent.parent
W, H = 1240, 1754
BG, FG, DIM = '#f2ebd9', '#253524', '#56634b'
FONT = KOK / 'public/fonts/nunito-sans-400.ttf'
BOLD = KOK / 'public/fonts/nunito-sans-700.ttf'
BASLIK = KOK / 'public/fonts/barlow-condensed-700.ttf'
SAYFALAR = []

def font(n=23, bold=False):
    return ImageFont.truetype(str(BOLD if bold else FONT), n)

def sayfa(baslik):
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((65, 40), baslik, font=ImageFont.truetype(str(BASLIK), 44), fill=FG)
    d.line((65, 100, W-65, 100), fill='#9aab7c', width=3)
    d.text((65, H-53), 'Son Denge · Güncel asset rehberi · ' + str(date.today()), font=font(18), fill=DIM)
    d.text((W-100, H-53), str(len(SAYFALAR)+1), font=font(18), fill=DIM)
    SAYFALAR.append(im)
    return im, d

def yazi(d, text, x, y, width, n=23, bold=False):
    f = font(n, bold)
    for para in text.split('\n'):
        line = ''
        for word in para.split():
            if d.textlength(line + ' ' + word, font=f) > width and line:
                d.text((x, y), line, font=f, fill=FG)
                y += int(n*1.45)
                line = word
            else:
                line = (line + ' ' + word).strip()
        d.text((x, y), line, font=f, fill=FG)
        y += int(n*1.65)
    return y

def gorsel(im, path, box):
    p = KOK / path
    if not p.exists():
        return
    with Image.open(p) as src:
        src = src.convert('RGBA')
        src.thumbnail((box[2]-box[0], box[3]-box[1]), Image.Resampling.LANCZOS)
        x = box[0] + (box[2]-box[0]-src.width)//2
        y = box[1] + (box[3]-box[1]-src.height)//2
        im.paste(src, (x, y), src)

log = (KOK/'PROJECT_LOG.md').read_text()
section = log.split('## Asset Listesi\n', 1)[1].split('## Değişiklik Logu', 1)[0]
rows = []
for line in section.splitlines():
    if re.match(r'^\| \d+ \|', line):
        rows.append([v.strip().strip('`') for v in line.split('|')[1:-1]])
assert len(rows) == 92, 'Asset tablosu değişti; sayfa üretim beklentisini güncelleyin.'

im,d = sayfa('Son Denge — Asset ve geliştirme devri')
y = yazi(d, '71 hazır · 9 yenilenecek · 12 eksik / isteğe bağlı. Toplam 92 satır.',65,135,1110,30,True)
y = yazi(d, 'Menü, HUD, ikon, karar ve son görselleri oyuna bağlı. Hazır dosyaları yeniden üretmeyin. Öncelik: sakin-1 ve sakin-3 animasyonları; ardından eski stildeki dokuz portre. On özel sakin sprite’ı isteğe bağlıdır.',65,y+20,1110)
y = yazi(d, 'Oyunda: beş ayrı yönetim paneli (Koloni / Odalar / Keşif / Araştırma / İnşaat), bir gecelik inşaatlar, Shift ile koşma, hıza uyumlu NPC animasyonları ve yerel Türkçe fontlar.',65,y+15,1110)
y = yazi(d, 'Ana devir belgesi: docs/devralma.md. Mekanikler: CLAUDE.md / AGENTS.md. Güncel asset tablosu: PROJECT_LOG.md ve docs/asset-listesi.md. Yeni üretim: docs/asset-promptu.md. Önceki final/sıfırdan promptları arşivdir.',65,y+15,1110)
gorsel(im, 'public/assets/menu-arka.png', (65,y+30,1175,y+620))
y = yazi(d, 'Teknik teslim: şeffaf karakter/nesne ve animasyon kareleri en fazla 600 px yüksek; portre 512×512. Ham sprite sheet, public/assets/anim/ altında ayrı karelere kesilir. Orijinaller assets-orijinal/ altında git dışında kalır.',65,y+650,1110)

renkler = {'✅':'#dde8cf','🔁':'#f2dfac','⏳':'#ead2c3'}
for first in range(0,len(rows),12):
    im,d = sayfa(f'Asset listesi · {first+1}–{min(first+12,len(rows))}')
    y=125
    for row in rows[first:first+12]:
        num,name,ne,fmt,boy,status,notu = row
        d.rounded_rectangle((60,y,1180,y+119),radius=8,fill=renkler.get(status,BG))
        durum={'✅':'HAZIR','🔁':'YENİLENECEK','⏳':'EKSİK / İSTEĞE BAĞLI'}.get(status,status)
        yazi(d, f'{num}. {name} — {durum}',75,y+4,1080,21,True)
        desc=f'{ne} · {fmt} · {boy}. {notu}'
        yazi(d, desc,75,y+39,1080,18)
        y+=126

for title,names in [
 ('Mevcut arayüz seti — yeniden üretmeyin', ['logo','kart-cerceve','buton','buton-basili','hud-kutu','ikon-enerji','ikon-su','ikon-gida','ikon-atik','ikon-karbon','ikon-nufus','ikon-arastirma']),
 ('Karar ve son görselleri — oyuna bağlı', ['kart-itiraz','kart-karanlik','kart-susuz','kart-protesto','kart-kompost','kart-toz-uyari','kart-sel-uyari','son-gercek-utopya','son-yalniz-utopya','son-kapimiz-acikti','son-guven-kaybi','son-cokus']),
 ('Karakter ve portre referansları', ['oyuncu','sakin-1','sakin-2','sakin-3','sakin-4','ziyaretci-muhendis','ziyaretci-ciftci','ziyaretci-bilim','ziyaretci-cocuklar','kurucu-selin','kurucu-burak','kurucu-nur']),
]:
    im,d=sayfa(title)
    for i,name in enumerate(names):
        x=65+(i%3)*380; y=125+(i//3)*380
        d.rounded_rectangle((x,y,x+350,y+310),radius=10,fill='#b9bea6')
        gorsel(im,f'public/assets/{name}.png',(x+10,y+10,x+340,y+300))
        yazi(d,name+'.png',x,y+315,355,18)

im,d=sayfa('Odalar — mevcut birleşik oda görselleri')
for i,oda in enumerate(['yasam','enerji','su','sera','geri']):
    y=125+i*305
    gorsel(im,f'public/assets/oda-{oda}-tam.png',(65,y,1175,y+260))
    d.text((65,y+265),f'oda-{oda}-tam.png',font=font(21,True),fill=FG)

im,d=sayfa('Teslim ve stil tutarlılığı')
y=yazi(d,'Animasyonlar: 2 bekleme + 4 yürüyüş karesi; her karede aynı boy, taban, açı ve karakter. Duman/ışıma/opak hale olmamalı. Sakin-1 ve sakin-3 setlerini mevcut sabit karakterlerle eşleştirin.',65,135,1110,25)
y=yazi(d,'Portreler: ziyaretci-muhendis.png yeni stil referansıdır. Diğer beş ziyaretçi ve dört kurucu portresi yenilenecek. Kimlikleri dosya adlarında koruyun; kişi sayısı doğru olsun.',65,y+25,1110,25)
y=yazi(d,'9-dilim UI: çerçeve 512×512, köşeler 96 px; buton 384×128, köşeler 32 px; HUD 256×128, köşeler 24 px. Oyun iç renkleri CSS ile çizer. İkonlar en fazla 256×256; okunur siluet, sade detay.',65,y+25,1110,25)
y=yazi(d,'Oda yerleşimi: mevcut oda-*-tam.png görselleri kullanılır. Dünya genişliği oda başına 739 px, ölçek PX_METRE=74. Eski ayrı oda şablonları farklı bir briftir; güncel odaları yanlışlıkla değiştirmeyin. Konumlar src/data/rooms.js içindedir.',65,y+25,1110,25)
yazi(d,'Kontrol: node tools/asset-durum.mjs; npm test; npm run build; tarayıcıda gece geçişi ve animasyon/menü kontrolü. Dosya varlığı kalite onayı anlamına gelmez.',65,y+25,1110,25)
for n in range(1,4):
    im,d=sayfa(f'Sanat stili referansı · {n}/3')
    gorsel(im,f'docs/sanat-stili-{n}.png',(50,120,1190,1670))

out=KOK/'docs/asset-rehberi.pdf'
gecici = out.with_suffix('.tmp.pdf')
SAYFALAR[0].save(gecici,save_all=True,append_images=SAYFALAR[1:],resolution=150,quality=88,title='Son Denge — Güncel Asset Rehberi',author='Son Denge ekibi')
gecici.replace(out)
print(f'{out.name}: {len(SAYFALAR)} sayfa, {out.stat().st_size/1024/1024:.1f} MB')
