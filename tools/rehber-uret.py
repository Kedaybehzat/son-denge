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
assert rows, 'Asset tablosu boş olamaz.'

im,d = sayfa('Son Denge — Asset ve geliştirme devri')
y = yazi(d, f"{sum(r[5] == '✅' for r in rows)} hazır · {sum(r[5] == '🔁' for r in rows)} yenilenecek · {sum(r[5] == '⏳' for r in rows)} eksik / isteğe bağlı. Toplam {len(rows)} satır.",65,135,1110,30,True)
y = yazi(d, 'Hazır dosyaları yeniden üretmeyin. Üretim sırası: 1) dört kurucu portresi (prolog kapı kartında büyük görünür), 2) sakin-1 ve sakin-3 animasyonları, 3) beş ziyaretçi portresi, 4) yedi yeni ikon, 5) hikaye-2, 6) önerilen özel sakin sprite’ları, 7) oda konsolu arka planları ve 11 kontrol çizimi, 8) prolog gün görselleri, 9) yönetim panosu arka planları (özellikle keşif haritası), sığınak işareti ve sekme ikonları.',65,y+20,1110)
y = yazi(d, 'Oyunda: 3 günlük prolog (kurucular günlere bölünerek gelir, oda konsollarında adım adım rehber, pano turu), oda başına etkileşimli konsollar, altı yönetim paneli (Koloni / Odalar / Keşif / Araştırma / İnşaat / Hedefler), iş gücüne bağlı inşaatlar, Shift ile koşma, hıza uyumlu NPC animasyonları ve yerel Türkçe fontlar.',65,y+15,1110)
y = yazi(d, 'Tasarım rehberi: docs/tasarim-rehberi.md. Ana devir belgesi: docs/devralma.md. Mekanikler: CLAUDE.md / AGENTS.md. Güncel asset tablosu: PROJECT_LOG.md ve docs/asset-listesi.md. Yeni üretim: docs/asset-promptu.md. Önceki final/sıfırdan promptları arşivdir.',65,y+15,1110)
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
y=yazi(d,'Animasyonlar: 2 bekleme + 4 yürüyüş karesi; her karede aynı boy, taban, açı ve karakter. Duman/ışıma/opak hale olmamalı. Sakin-1 ve sakin-3 eksikleri tamamlandı; özel on karakterin setleri de kimliklerine bağlandı.',65,135,1110,25)
y=yazi(d,'Portreler: ziyaretci-muhendis.png yeni stil referansıdır. Dört kurucu (öncelikli, prolog) ve beş ziyaretçi portresi yenilenecek. Kimlikleri dosya adlarında koruyun; kişi sayısı doğru olsun.',65,y+25,1110,25)
y=yazi(d,'Yeni ikonlar (ikon-yagmur-suyu, ikon-yagmur-deposu, ikon-su-hatti, ikon-onarim-tezgahi, ikon-insaat, ikon-dinlen, ikon-malzeme) ikon-grisu.png ile aynı kontur ve paletle; üretildi ve oyuna bağlandı. hikaye-2: kuraklık, sel ve yol değiştiren topluluklar.',65,y+25,1110,25)
y=yazi(d,'Konsollar: konsol-<oda>.png 1600×900 opak, ortası sade ve koyu. modul-<ad>.png ~1000×400 opak YAZISIZ sahne kartı, kontrol kutusunun tamamını kaplar; alt %40 sakin (etiket oraya yazılır). konsol-cerceve.png 9-dilim sarmaşıklı çerçeve. Hedef görünüm: docs/tasarim-referans/.',65,y+25,1110,25)
y=yazi(d,'Yönetim panosu: yonetim-<bölüm>.png ortası sade (kartlar üstüne biner). Keşif haritası 3:2; pin konumları: santral %17/%24, eski şehir %80/%20, komşu %84/%72, rezervuar %19/%76, sığınak %50/%52.',65,y+25,1110,25)
y=yazi(d,'9-dilim UI: çerçeve 512×512, köşeler 96 px; buton 384×128, köşeler 32 px; HUD 256×128, köşeler 24 px. Oyun iç renkleri CSS ile çizer. İkonlar en fazla 256×256; okunur siluet, sade detay.',65,y+25,1110,25)
y=yazi(d,'Oda yerleşimi: mevcut oda-*-tam.png görselleri kullanılır. Dünya genişliği oda başına 739 px, ölçek PX_METRE=74. Eski ayrı oda şablonları farklı bir briftir; güncel odaları yanlışlıkla değiştirmeyin. Konumlar src/data/rooms.js içindedir.',65,y+25,1110,25)
yazi(d,'Kontrol: node tools/asset-durum.mjs; npm test; npm run build; tarayıcıda gece geçişi ve animasyon/menü kontrolü. Dosya varlığı kalite onayı anlamına gelmez.',65,y+25,1110,25)
im,d=sayfa('Hedef görünüm — tasarım referansı (mockup)')
yazi(d,'Bu mockup’lar hedef görünümdür; yazı ve sayılar gömülü olduğu için oyuna doğrudan girmez. Kontrol kutularındaki sahneler, konsol çerçevesi ve harita bunlara benzer ama YAZISIZ üretilmeli.',65,125,1110,21)
for i,ad in enumerate(['konsol-enerji','konsol-su','konsol-sera','konsol-geri','yonetim-kesif','yonetim-insaat']):
    x=65+(i%2)*560; y=215+(i//2)*480
    gorsel(im,f'docs/tasarim-referans/{ad}.jpg',(x,y,x+540,y+420))
    d.text((x,y+425),ad+' (mockup)',font=font(19,True),fill=FG)

im,d=sayfa('Tasarım sistemi — fikir, renk, yazı')
y=yazi(d,'Onarılmış sığınağın kontrol odası: paslı pirinç çerçeve, yeşil boyalı metal panel, sarmaşık, CRT ekran, elle çekilen kol. Üç ilke: az metin çok nesne · her eylemin bedeli görünür · çizim sabit, değer canlı. Ayrıntı: docs/tasarim-rehberi.md',65,125,1110,22)
renkler_ui=[('Panel yeşili','#374321'),('Alt şerit','#4A4E28'),('Pirinç çerçeve','#A16D29'),('Pas','#553B20'),('Vurgu sarısı','#FFD23F'),('Tabela','#685635'),('CRT zemini','#0B1A12'),('CRT yazısı','#BFF3C8')]
renkler_dunya=[('Tozlu adaçayı','#A7B18D'),('Zeytin','#7C8A58'),('Hardal okr','#C79A33'),('Sıcak krem','#E7D9BC'),('Deri kahve','#9A6A43'),('Terrakota','#B97A5C'),('Kontur','#4E3B2F')]
renkler_anlam=[('İyi / kazanç','#7ED957'),('Uyarı / mod','#F2B33D'),('Kötü / bedel','#FF5A3D'),('Su / bilgi','#4FC3F7'),('Kapı','#C47A4A'),('Tehlike şeridi','#E0B030')]
for baslik,liste,yy in [('Arayüz paleti',renkler_ui,y+20),('Dünya ve karakter paleti',renkler_dunya,y+300),('Anlam renkleri',renkler_anlam,y+580)]:
    d.text((65,yy),baslik,font=font(26,True),fill=FG)
    for i,(ad,kod) in enumerate(liste):
        x=65+(i%4)*280; yk=yy+45+(i//4)*115
        d.rounded_rectangle((x,yk,x+260,yk+62),radius=8,fill=kod,outline='#253524')
        d.text((x,yk+66),f'{ad} {kod}',font=font(18),fill=FG)
yy=y+860
d.text((65,yy),'Tipografi',font=font(26,True),fill=FG)
d.text((65,yy+45),'BARLOW CONDENSED — başlık, büyük sayı, düğme',font=ImageFont.truetype(str(BASLIK),40),fill=FG)
yazi(d,'Nunito Sans — gövde, açıklama ve ekran metni. Küçük etiketler büyük harf, geniş aralık. Görsellere yazı gömülmez; değişen hiçbir değer çizilmez.',65,yy+105,1110,22)

im,d=sayfa('Bileşenler ve etkileşim')
y=yazi(d,'Fareyle üstüne gelme = bilgi (durum ekranı / önizleme gölgesi) · görsel düğmede sarı parlama halkası · basınca mekanizma animasyonu + kayan gösterge · kullanılamaz: gri + sallanma + neden · kirli: sarı-siyah şerit ve (!) · önce seç sonra hedefe tıkla · rehber etkileşimle ilerler.',65,125,1110,21)
for i,ad in enumerate(['konsol-parcali-enerji','konsol-parcali-kapali','yonetim-parcali-koloni','yonetim-parcali-kesif','yonetim-parcali-insaat','yonetim-parcali-hedefler']):
    x=65+(i%2)*560; yk=y+15+(i//2)*470
    gorsel(im,f'docs/arayuz-ornekleri/{ad}.jpg',(x,yk,x+540,yk+410))
    d.text((x,yk+415),ad,font=font(19,True),fill=FG)

im,d=sayfa('Mockup tabanlı ekranlar ve kontrol listesi')
for i,ad in enumerate(['oyun-hud-alt-serit','ayarlar','hikaye','yonetim-arastirma']):
    x=65+(i%2)*560; yk=125+(i//2)*420
    gorsel(im,f'docs/arayuz-ornekleri/{ad}.jpg',(x,yk,x+540,yk+370))
    d.text((x,yk+372),ad,font=font(19,True),fill=FG)
y=yazi(d,'Akış: mockup > sabit kısımlar zeminde kalır, değişken bölgeler bulanıklaşır > kutular src/data/konsol-yerlesim.json > canlı katman yüzde konumla, yazı mockup pikseliyle (--p) ölçeklenir > görsel yoksa CSS yedeği. Araçlar: tools/konsol-arka.py, ekran-zemin.py, mockup-kes.py, kenar-temizle.py.',65,975,1110,21)
yazi(d,'Kontrol listesi: değişmeyen görselden, değişen canlı mı · katalog bileşenleri kullanıldı mı · kalıcı paragraf yok mu · kazanç/bedel önizleniyor mu · kirli seçim işaretli mi · kullanılamaz durum net mi · HUD örtülmüyor mu · CSS yedeği çalışıyor mu · rehber hedefleri var mı · asset listesi ve kenar temizliği yapıldı mı · tarayıcıda görüntüyle kontrol edildi mi.',65,y+25,1110,21)

im,d=sayfa('Bağımsız parçalar — konsol ve yönetim')
y=yazi(d,'Dört oda konsolu ve altı yönetim bölümü ortak 9-dilim çerçeve, metal doku, ayrı düğme ve oda/kontrol sahnelerinden kurulur. Başlıklar, değerler, isimler ve durumlar HTML ile güncellenir. Tam ekran panel JPEG’leri yalnız yedektir. Kaynak kutuları: src/data/arayuz-parcalari.json. Yeniden çıkarma: python3 tools/asset-parcala.py. Kullanım: docs/asset-parcalari.md.',65,125,1110,23)
gorsel(im,'docs/arayuz-ornekleri/asset-parcalari.jpg',(65,y+20,1175,y+650))
gorsel(im,'docs/arayuz-ornekleri/konsol-parcali-enerji.jpg',(65,y+680,1175,1560))

im,d=sayfa('Karakter setleri — kimlik ve animasyon')
y=yazi(d,'On sakin/grup: mevcut kare portreler korunur; eksik tam boy, iki bekleme ve dört yürüyüş karesi tamamlandı. Her karakter kendi sakin-<id> setine bağlıdır. Kişi sayısı ve taban hizası korunur. Eşleşmeler: docs/karakter-setleri.md; üretim istekleri: docs/karakter-uretim-istekleri.json.',65,125,1110,23)
gorsel(im,'docs/arayuz-ornekleri/karakter-setleri.jpg',(65,y+25,1175,1550))

im,d=sayfa('Diyalog, logo ve keşif — güncel oyun')
for i,ad in enumerate(['diyalog-sakin','diyalog-oyuncu','menu-apoclimate','kesif-yeni-harita']):
    x=65+(i%2)*560; yy=125+(i//2)*550
    gorsel(im,f'docs/arayuz-ornekleri/{ad}.jpg',(x,yy,x+540,yy+470))
    d.text((x,yy+475),ad,font=font(19,True),fill=FG)
yazi(d,'Diyalogda iki kare portre ve konuşan vurgusu. Yüklenen APOCLIMATE logosu menü, sonuç ve favicon olarak kullanılır. Keşifte şehir çizimi, simge ve isim aynı geniş seçim alanıdır; tekrar tıklama seçimi kaldırmaz. Sefer engeli detayda açıklanır.',65,1260,1110,24)

for n in range(1,4):
    im,d=sayfa(f'Sanat stili referansı · {n}/3')
    gorsel(im,f'docs/sanat-stili-{n}.png',(50,120,1190,1670))

out=KOK/'docs/asset-rehberi.pdf'
gecici = out.with_suffix('.tmp.pdf')
SAYFALAR[0].save(gecici,save_all=True,append_images=SAYFALAR[1:],resolution=150,quality=88,title='Son Denge — Güncel Asset Rehberi',author='Son Denge ekibi')
gecici.replace(out)
print(f'{out.name}: {len(SAYFALAR)} sayfa, {out.stat().st_size/1024/1024:.1f} MB')
