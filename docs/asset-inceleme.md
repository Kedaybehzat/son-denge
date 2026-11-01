# Yeni asset ve ekran incelemesi · 1 Kasım 2026

İncelenenler: `docs/asset-rehberi.pdf` (25 sayfa), tasarım rehberi, asset listesi/üretim promptu, `docs/arayuz-ornekleri/` içindeki 11 ekran, 45 animasyon karesi ve ilgili yükleme/yerleşim kodu. `node tools/asset-durum.mjs`: 17 animasyon tanımının 13’ü tam; 4’ü eksik. Bu incelemede oyun tarayıcıda yeniden çalıştırılmadı; hareket akıcılığı ve küçük ekran davranışı doğrulanmadı. Aşağıdakiler mevcut ekran örnekleri, dosyalar ve kod üzerinden bulgulardır.

## Öncelikli düzeltmeler

| Öncelik | Bulgu / kanıt | Düzeltme ve kabul ölçütü | İlgili yer |
|---|---|---|---|
| P1 | Birleşik oda görsellerinde kapı ve panel sprite’ları alpha=0 yapılıyor. Makine animasyonu bu sprite’ta oynasa da görünmüyor; hazır asset, görünür animasyon anlamına gelmiyor. | Oda içindeki nesneyle aynı perspektifte animasyon katmanı veya yalnız ekran/ışık maskesi kullan. Kapı açılışını çizili kapıyla eşleştir; çift kapı/panel oluşturmadan kabul ve çalışma hareketi görünmeli. | `src/scenes/game/dunya.js` → `evCiz`, `animasyonlar.js` → `makineAnimGuncelle`, `efektler.js` → `efektZiyaretci` |
| P1 | Keşif pinlerindeki gece simgesi, Araştırma’daki yağmur suyu ikonu ve İnşaat’taki bazı maliyet/işçi düğmeleri kutu veya soru işareti görünüyor. | Eksik ikonları tamamla; emoji/font yedeğine bağımlı simgeleri mevcut asset veya metinle değiştir. Gece sayısını ör. “1 gece” yaz. Hiçbir bedel veya düğme anlamı bozuk glife bağlı kalmamalı. | `src/ui/ui.js` → `kesifHaritaHtml`, `arastirmaAgaciHtml`, `insaatYonetimiHtml`; `public/assets/ikon-*` |
| P1 | `sakin-1` ve `sakin-3` için bekleme/yürüme kareleri yok (toplam 12 kare). Diğer sakinler yürürken bunlar sabit pozda hareket ediyor. | Mevcut karakterleri koruyan 2 bekleme + 4 yürüme karesi üret; ortak ayak tabanı ve ölçekle kes. 17/17 animasyon tam olmalı. | `src/data/animations.js`, `public/assets/anim/` |
| P1 | Genel `panel-calis-1..3.png` sağ kenarı kesik; üç karede de gövde sınırda bitiyor. | Kaynaktan boşluk bırakarak yeniden kes veya yeniden üret. Yalnız tuvali büyütmek kayıp çizimi geri getirmez. Üç karede nesne bütünüyle görünmeli. | `public/assets/anim/panel-calis-*.png` |
| P2 | Kapalı konsolun içi büyük bulanık siyah bir dikdörtgene dönüşüyor; eski kontrol/bar şekilleri altta hayalet gibi kalıyor. | Yazısız, temiz çevrimdışı iç yüzey üret veya opak dokulu katman kullan; dış metal çerçeveyi koru. Eski yazı ve kontrol izleri seçilmemeli. Bu ekran yalnız prologda gösterildiğinden operatörü bekleme mesajı mekanik hatası değildir. | `docs/arayuz-ornekleri/konsol-kapali.jpg`, `tools/ekran-zemin.py`, `ui.js` → `konsolHtml` |
| P2 | Keşif haritasında eski pin temizleme bölgeleri açık/koyu lekeler bırakıyor; sefer panelinin koyu alanı harita/metal zeminden keskin ayrılıyor. Merkezde renkli ev emojisi, diğer boyalı pinlerden kopuyor. | Haritayı yazısız/pinsiz zemin olarak temizle; `kesif-siginak.png` ekle. Rota, pin ve ekip işareti canlı kalmalı; temizleme lekeleri görünmemeli. | `docs/arayuz-ornekleri/yonetim-kesif.jpg`, `tools/konsol-arka.py` |
| P2 | Araştırma ve koloni gövdelerinde geniş karanlık/bulanık alanlar var; çerçevenin yüksek detayına karşı içerik geçici katman gibi görünüyor. | Gövde için sade ama aynı metal/tahta dokulu temiz zemin kullan; kart ve bağlantılarda kontrastı yükselt. Kilitli düğümlerin adı ve kilit nedeni okunmalı. | `yonetim-arastirma.jpg`, `yonetim-koloni.jpg`, `tools/konsol-arka.py`, `src/style.css` |
| P2 | Hikaye 2 metni su kıtlığı, sel ve göçü anlatırken görsel karlı/dağlık santral ve tek gezgine odaklanıyor; ana fikir zayıf aktarılıyor. | Kuruyan rezervuar, hasarlı yol/köprü ve göç eden aileleri gösteren sahneyle değiştir. Yeni hikaye görseli hem bağımsız PNG’ye hem `hikaye-ekran-2.jpg` içine uygulanmalı. | `docs/arayuz-ornekleri/hikaye.jpg`, `public/assets/hikaye-2.png`, `tools/ekran-zemin.py` |
| P2 | Hikaye başlık ve paragrafları JPEG’e gömülü. `story.js` değişince görünen metin güncellenmiyor; kod yalnız erişilebilir etiketi güncelliyor. | Hikaye zeminini metinsiz üret, başlık/paragrafı HTML ile çiz. Metin büyütmede ve içerik değişiminde yeniden görsel üretmek gerekmemeli. | `src/ui/ui.js` → `girisHikayesi`, `src/data/story.js` |
| P2 | Oyun örneğinde iki sakin benzer sırt çantalı gezgin; Burak konsol portresindeki iş kıyafetiyle sahnedeki karakter kimliği uyuşmuyor. Nur rozeti de eksik; rehber mockup’ta Selin kopyası olduğunu belirtiyor. | Önce dört kurucunun özel sprite’larını ve Nur rozetini tamamla. Özel sprite geldiğinde genel animasyon uygulanmadığından özel karakter animasyon planı da gerekli; aksi halde kimlik düzelirken hareket kaybolur. | `src/data/assets.js`, `src/scenes/game/sakinler.js`, `rozet-nur.png`, `sakin-<id>.png` |
| P3 | Alt şeritte Koloni sürekli hafif seçili görünüyor; durum görsele gömülü. | Zemindeki seçili parlamayı tamamen kaldır; seçili/hover durumunu CSS çizsin. | `docs/arayuz-ornekleri/oyun-hud-alt-serit.jpg`, `tools/ekran-zemin.py` |

## Rehber ve envanter düzeltmeleri

- `asset-durum.mjs` oyunda kullanılan 21 yeni JPEG’i “tanınmayan” sayıyor. Dosyalar `ui.js` tarafından kullanılıyor; bu bir yükleme hatası kanıtı değil, envanter eksiği. JPEG’ler `ARAYUZ_DOSYALARI`na alınmalı; aktif JPEG yolu ile isteğe bağlı eski PNG zemini ayrı raporlanmalı.
- PDF kapağı 139 satır gösterirken Project Map PDF açıklaması hâlâ 132 satır diyor. Harita bu incelemede 139 olarak düzeltildi.
- Üretim promptu hikaye 2’yi yeniden istiyor; liste ise yeni mockup’tan kesildiği için hazır sayıyor. “Dosya var” ile “içerik uygun” ayrılmalı; hikaye 2 için yenileme kararı açıkça yazılmalı.
- Rehber genel olarak yazısız görsel isterken mevcut yöntem sabit başlık/sekme/hikaye metnini mockup içinde bırakıyor. Sabit etiket istisnası ile tüm anlatı metninin görsele gömülmesi ayrılmalı.

## Önerilen sıra

1. Bozuk simgeler ve görünmeyen animasyon katmanları.
2. Eksik sakin kareleri ve kesik panel kareleri.
3. Kapalı konsol/harita/gövde temizliği.
4. Kurucu kimliği, hikaye 2, metin katmanları ve envanter.
5. Ardından 960×540, büyük ekran ve dokunmatik görünümde yeni ekran görüntüleri; tam animasyon döngülerinde taban kayması, boy sıçraması ve yürüme hızı kontrolü.

## Devam: canlı kontrol ve ilk uygulama

- `sakin-4-yuru-3.png` tabanı 475 px iken diğer karelerde 507 px idi. Kare, kaynak yedeği korunarak +32 px taşındı; boyu/eni değişmedi. `tools/animasyon-hizala.py` işlemi tekrarlar.
- Sakinlerin gelişi y ekseninde Bounce ile zıplatılmak yerine zeminde yumuşak belirme olarak değiştirildi.
- Dört oda konsolu altı bağımsız UI parçasına geçti; artık bulanık tam ekran `panel-*.jpg` aktif zemin değil, yedektir. Başlık, etiket, sayı, durum, mod ve düğme metinleri canlı katmandadır. Tarif ve kapsam: `docs/asset-parcalari.md`.
- Yeni eksik ikonlara okunur kısaltma yedeği eklendi; keşif sürelerinde ay emojisi yerine “gece” yazılır. Araştırma kilidi metinle belirtilir. Diğer ekranlardaki bütün emoji kullanımları bu değişiklikle kaldırılmış değildir.
- Kullanılan 21 JPEG ve altı parça envantere bağlandı; “tanınmayan dosya” sorunu giderildi.
- Eksik sakin-1/3 kareleri, kesik genel panel kareleri, birleşik odalarda görünmeyen kapı/panel sprite’ları, kurucu kimliği, hikaye ve yönetim zemini işleri açıktır.

Canlı doğrulama betiği `tools/animasyon-canli.mjs`; sonuç ve kapsam `docs/asset-parcalari.md` içinde. İlk statik incelemenin sınırlamaları yukarıda tarihsel olarak korunmuştur.

### Yönetim ve makine durumu devamı

Altı yönetim bölümü ortak parçalara geçti; sekme yazıları/seçili durum, bölüm başlığı ve alt stok/eylem satırı tam resimden ayrıldı. Keşifte eski temizleme lekeleri taşıyan JPEG etkin zemin değildir; bağımsız pin/ikon/rota ve mevcut CSS harita kullanılır. Birleşik oda panelinin gizli animasyonu durduruldu; durum ışığı çizimin LED konumuna taşındı ve enerji yetersizliğindeki kapanışı da gösterir. Tam panel/kapı hareketi açık kalır. HUD/Ayarlar/hikaye henüz parçalanmadı.
