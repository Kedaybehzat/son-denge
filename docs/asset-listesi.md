# Asset listesi (güncel durum, 1 Kasım 2026)

## Tasarım referansı

`docs/tasarim-referans/` içindeki 17 mockup, konsolların ve yönetim panosunun hedef görünümüdür. Yazı ve sayılar gömülü olduğu için oyuna konmazlar; görsel üretirken referans olarak yüklenirler. Üretilecek parçalar **yazısız** olmalı, yazıları oyun kendisi çizer.

## Üretim sırası (projenin son hâline göre)

1. **Prolog için öncelikli, 4 dosya:** `kurucu-selin/burak/nur/can.png` portreleri. 3 günlük prolog her kurucuyu kapı kartında büyük portreyle tanıtıyor; eski stil burada çok göze batıyor.
2. **Eksik animasyonlar, 2 set:** `sakin-1` ve `sakin-3` (2 bekleme + 4 yürüme). Bu iki karakter animasyonsuz kayıyor.
3. **Portre yenileme, 5 dosya:** `ziyaretci-ciftci/bilim/cocuklar/tamirci/kafile.png` (referans: `ziyaretci-muhendis.png`).
4. **Yeni ikonlar, 7 dosya:** yağmur suyu araştırması, 3 yeni yapı, İnşaat/Dinlen görevleri, Malzeme (satır 94–100). Kod bağlı; dosya gelene kadar emoji/benzer ikon görünür.
5. **Hikaye görselleri:** yeni mockup'lardan kesildi ✅ (hikaye ekranları ve HUD/alt şerit/Ayarlar da mockup zemininde, satır 138).
6. **Önerilen özel sprite'lar:** önce `sakin-selin/burak/nur/can.png` (prologda kapıdan yürüyerek giriyorlar), sonra 6 ziyaretçi sprite'ı. İsteğe bağlı; yoksa genel sakin görseli kullanılır.
7. **Oda konsolları:** konsollar mockup'ın kendisinden kuruldu (`panel-<id>.jpg`, satır 136) ve 11 kutu sahnesi kesilip bağlandı ✅ (geçici; yazısız temiz üretim gelirse aynı adla değiştirilir). Kalan isteğe bağlı: `konsol-cerceve.png` (yalnız CSS konsoluna düşülürse).
8. **Prolog gün görselleri, 3 dosya (isteğe bağlı):** `prolog-1..3.png`, satır 116–118.
9. **Yönetim panosu:** 6 bölüm mockup zemininde çiziliyor ✅ (`yonetim-<bölüm>.jpg`, satır 137). Kalan isteğe bağlı: sekme ikonları (pano CSS'e düşerse kullanılır).

Hazır olanları (oda, manzara, menü/UI, ikonlar, kart/son görselleri, oyuncu animasyonları) yeniden üretmeyin. Üretim promptu: `docs/asset-promptu.md`; görsel rehber: `docs/asset-rehberi.pdf`.

## Tam liste

**Durum:** ✅ oyunda hazır (99) · 🔁 var ama yenilenmeli (10) · ⏳ eksik (30). Toplam 139 satır. Ayrı `oda-<oda>.png` dosyaları gerekmez: oyun birleşik `oda-<oda>-tam.png` görsellerini kullanır (`asset-durum` bunları yedek olarak ⏳ gösterir).

**Tasarım referansı:** `docs/tasarim-referans/` içindeki 17 mockup (kutu sahneleri, tanklar ve 3 yüz rozeti bunlardan kesilip oyuna bağlandı) (konsollar, kapalı konsol, yönetim bölümleri, pano turu) hedef görünümü gösterir. Oyuna doğrudan girmezler: yazı/sayı gömülü. Üretilen görseller yazısız olmalı.

**Kenar temizliği:** Şeffaf görseller `python3 tools/kenar-temizle.py` ile temizlenir (arka plan sisi, kopuk lekeler, yarı silinmiş delikler, açık saçak; kart/son/menü görsellerinde yarı saydam kenar şeridi). Yeni şeffaf asset eklendiğinde `python3 tools/kenar-temizle.py public/assets/<dosya>.png` çalıştırın.

**Kurallar:** Karakter/nesne: şeffaf arka plan, yandan, sağa bakar, taban altta; boy "Gerçek boy" sütununa göre (oyun ölçekler). Animasyon: tek görselde ızgara, her hücrede aynı boy/konum/taban. Menü: sanat stili rehberindeki palet ve yıpranmış metal/ahşap dili; 9-dilim görsellerin ortası düz ve boş, köşeleri belirtilen ölçüde süslü (ortası esner). İkonlar sade, kalın kontur, küçük boyda okunur. Yazı/harf yok (yazıları oyun yazar). Görselleri adlarına dokunmadan asistana verin.

| # | Dosya | Ne | Format | Gerçek boy | Durum | Not |
|---|---|---|---|---|---|---|
| 1 | `oda-yasam-tam.png` | Yaşam alanı (yatak, radyo, kapı, mantar pano çizili) | 1808×836 (tek şeridin 1/5'i) | 1 m ≈ 180 px | ✅ | Sütunlu 9042×836 şeritten kesildi |
| 2 | `oda-enerji-tam.png` | Enerji odası (jeneratör, duvar enerji üniteleri) | 1808×836 (tek şeridin 1/5'i) | 1 m ≈ 180 px | ✅ | Sütunlu 9042×836 şeritten kesildi |
| 3 | `oda-su-tam.png` | Su arıtma (2 tank + gösterge, filtre ünitesi) | 1808×836 (tek şeridin 1/5'i) | 1 m ≈ 180 px | ✅ | Sütunlu 9042×836 şeritten kesildi |
| 4 | `oda-sera-tam.png` | Sera (cam duvar, yataklar, elektrik kutusu) | 1808×836 (tek şeridin 1/5'i) | 1 m ≈ 180 px | ✅ | Sütunlu 9042×836 şeritten kesildi |
| 5 | `oda-geri-tam.png` | Geri dönüşüm (hurda, tezgâh, konsol, varil) | 1808×836 (tek şeridin 1/5'i) | 1 m ≈ 180 px | ✅ | Sütunlu 9042×836 şeritten kesildi |
| 6 | `manzara-iyi.png` | Şehir panoraması, yeşil | 2172×724 | — | ✅ |  |
| 7 | `manzara-kotu.png` | Aynı panorama, kirli | 2172×724 | — | ✅ |  |
| 8 | `cati.png` | Çatı şeridi, güneş panelleri | 3200×1024, şeffaf | — | ✅ |  |
| 9 | `hikaye-1.png` | Hikaye ekranı: Dünya ısınıyordu | 3:2 yatay | — | ✅ | Yeni hikaye mockup'ından kesildi (`tools/ekran-zemin.py`); eski görsel `assets-orijinal/eski/`; 2026-11-01 |
| 10 | `hikaye-2.png` | Hikaye ekranı: Su azaldı, yollar değişti | 3:2 yatay | — | ✅ | Yeni hikaye mockup'ından kesildi (`tools/ekran-zemin.py`); eski görsel `assets-orijinal/eski/`; 2026-11-01 |
| 11 | `hikaye-3.png` | Hikaye ekranı: Büyük Sessizlik | 3:2 yatay | — | ✅ | Yeni hikaye mockup'ından kesildi (`tools/ekran-zemin.py`); eski görsel `assets-orijinal/eski/`; 2026-11-01 |
| 12 | `hikaye-4.png` | Hikaye ekranı: Yeşilvadi | 3:2 yatay | — | ✅ | Yeni hikaye mockup'ından kesildi (`tools/ekran-zemin.py`); eski görsel `assets-orijinal/eski/`; 2026-11-01 |
| 13 | `kapak.png` | Sunum kapağı | 3:2 yatay | — | ✅ | İlk setten |
| 14 | `oyuncu.png` | Oyuncu (sırt çantalı, kıvırcık saçlı) | 2:3, şeffaf | 1,75 m | ✅ |  |
| 15 | `oyuncu-bekle` | Oyuncu nefes alıyor, 4 kare | 2:3, 2×2 | 1,75 m | ✅ |  |
| 16 | `oyuncu-yuru` | Oyuncu yürüyor, 6 kare | 3:2, 3×2 | 1,75 m | ✅ |  |
| 17 | `oyuncu-calis` | Oyuncu düğmeye basıyor, 4 kare | 2:3, 2×2 | 1,75 m | ✅ |  |
| 18 | `sakin-1.png` | Bastonlu yaşlı sakin | 2:3, şeffaf | 1,7 m | ✅ |  |
| 19 | `sakin-2.png` | Örgülü kadın | 2:3, şeffaf | 1,7 m | ✅ |  |
| 20 | `sakin-3.png` | Deri önlüklü usta | 2:3, şeffaf | 1,7 m | ✅ |  |
| 21 | `sakin-4.png` | Hardal şapkalı gezgin | 2:3, şeffaf | 1,7 m | ✅ |  |
| 22 | `sakin-1-bekle + sakin-1-yuru` | Yaşlı sakin: 2 kare bekleme + 4 kare yürüme | 2:3, 2×3 | 1,7 m | ⏳ | Gelen sette opak duman halesi vardı; temiz arka planla yeniden |
| 23 | `sakin-2-bekle + sakin-2-yuru` | Örgülü kadın | 2:3, 2×3 | 1,7 m | ✅ |  |
| 24 | `sakin-3-bekle + sakin-3-yuru` | Usta | 2:3, 2×3 | 1,7 m | ⏳ | Aynı hale sorunu; yeniden |
| 25 | `sakin-4-bekle + sakin-4-yuru` | Gezgin | 2:3, 2×3 | 1,7 m | ✅ |  |
| 26 | `sakin-selin.png` | Sahnede Selin, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | Önerilir: prologda kapıdan girip odasına yürürken öne çıkar; yoksa genel sakin görseli |
| 27 | `sakin-burak.png` | Sahnede Burak, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | Önerilir: prologda kapıdan girip odasına yürürken öne çıkar; yoksa genel sakin görseli |
| 28 | `sakin-nur.png` | Sahnede Nur, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | Önerilir: prologda kapıdan girip odasına yürürken öne çıkar; yoksa genel sakin görseli |
| 29 | `sakin-can.png` | Sahnede Can, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | Önerilir: prologda kapıdan girip odasına yürürken öne çıkar; yoksa genel sakin görseli |
| 30 | `sakin-muhendis.png` | Sahnede Deniz, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | İsteğe bağlı; yoksa genel sakin görseli kullanılır |
| 31 | `sakin-ciftci.png` | Sahnede Hasan + Elif, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | İsteğe bağlı; yoksa genel sakin görseli kullanılır |
| 32 | `sakin-bilim.png` | Sahnede Dr. Leyla, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | İsteğe bağlı; yoksa genel sakin görseli kullanılır |
| 33 | `sakin-cocuklar.png` | Sahnede Mert + Ada (1,3 m), tam boy | 2:3, şeffaf | 1,7 m | ⏳ | İsteğe bağlı; yoksa genel sakin görseli kullanılır |
| 34 | `sakin-tamirci.png` | Sahnede Kemal, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | İsteğe bağlı; yoksa genel sakin görseli kullanılır |
| 35 | `sakin-kafile.png` | Sahnede 4 kişilik aile, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | İsteğe bağlı; yoksa genel sakin görseli kullanılır |
| 36 | `cop-yigini.png` | Çöp yığını | 3:2, şeffaf | 0,9 × 1,8 m | ✅ |  |
| 37 | `bitki.png` | Saksıda fide | 2:3, şeffaf | 0,65 m | ✅ |  |
| 38 | `bitki-solgun.png` | Solgun fide | 2:3, şeffaf | 0,65 m | ✅ |  |
| 39 | `ziyaretci-muhendis.png` | Portre: Deniz | 1:1 | baş + omuz | ✅ | Yeni stil |
| 40 | `ziyaretci-ciftci.png` | Portre: Hasan + Elif | 1:1 | baş + omuz | 🔁 | Eski stil; Deniz portresiyle aynı stilde yenilenmeli |
| 41 | `ziyaretci-bilim.png` | Portre: Dr. Leyla | 1:1 | baş + omuz | 🔁 | Eski stil; Deniz portresiyle aynı stilde yenilenmeli |
| 42 | `ziyaretci-cocuklar.png` | Portre: Mert + Ada | 1:1 | baş + omuz | 🔁 | Eski stil; Deniz portresiyle aynı stilde yenilenmeli |
| 43 | `ziyaretci-tamirci.png` | Portre: Kemal | 1:1 | baş + omuz | 🔁 | Eski stil; Deniz portresiyle aynı stilde yenilenmeli |
| 44 | `ziyaretci-kafile.png` | Portre: 4 kişilik aile | 1:1 | baş + omuz | 🔁 | Eski stil; Deniz portresiyle aynı stilde yenilenmeli |
| 45 | `kurucu-selin.png` | Portre: Selin | 1:1 | baş + omuz | 🔁 | Eski stil; prolog kapı kartında büyük görünür, öncelikli |
| 46 | `kurucu-burak.png` | Portre: Burak | 1:1 | baş + omuz | 🔁 | Eski stil; prolog kapı kartında büyük görünür, öncelikli |
| 47 | `kurucu-nur.png` | Portre: Nur | 1:1 | baş + omuz | 🔁 | Eski stil; prolog kapı kartında büyük görünür, öncelikli |
| 48 | `kurucu-can.png` | Portre: Can | 1:1 | baş + omuz | 🔁 | Eski stil; prolog kapı kartında büyük görünür, öncelikli |
| 49 | `logo.png` | Oyun logosu "Son Denge" (başlık ekranı, yükleme) | 768×256, şeffaf | — | ✅ | Oyuna bağlı |
| 50 | `menu-arka.png` | Başlık ekranı ve hikaye kartı arka planı (sığınak dış cephesi, akşam) | 1280×720 | — | ✅ | Oyuna bağlı |
| 51 | `kart-cerceve.png` | Pencere çerçevesi (paneller, radyo, kapı kartı, pano, gece raporu): yıpranmış metal + ahşap kenar, iç rengi CSS | 512×512, 9-dilim (köşe 96 px) | — | ✅ | 9-dilim ile oyuna bağlı |
| 52 | `buton.png` | Buton: küçük metal plaka, perçinli | 384×128, 9-dilim (köşe 32 px) | — | ✅ | Oyuna bağlı |
| 53 | `buton-basili.png` | Aynı buton, basılı/vurgulu | 384×128 | — | ✅ | Oyuna bağlı |
| 54 | `hud-kutu.png` | Üst çubuk kutusu (kaynak göstergeleri) | 256×128, 9-dilim (köşe 24 px) | — | ✅ | Oyuna bağlı |
| 55 | `ikon-enerji.png` | HUD ikonu: Enerji (şimşek) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 56 | `ikon-su.png` | HUD ikonu: Su (damla) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 57 | `ikon-gida.png` | HUD ikonu: Gıda (başak) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 58 | `ikon-atik.png` | HUD ikonu: Atık (çuval) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 59 | `ikon-karbon.png` | HUD ikonu: Karbon (bulut) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 60 | `ikon-nufus.png` | HUD ikonu: Nüfus (iki kişi) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 61 | `ikon-eylem.png` | HUD ikonu: Eylem hakkı (el / dişli) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 62 | `ikon-arastirma.png` | HUD ikonu: Araştırma (cam tüp) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 63 | `ikon-batarya.png` | HUD ikonu: Batarya | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 64 | `ikon-memnuniyet.png` | HUD ikonu: Memnuniyet (yüz) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 65 | `son-gercek-utopya.png` | Son ekranı görseli: Yeşilvadi nefes alıyor | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 66 | `son-yalniz-utopya.png` | Son ekranı görseli: Yalnız bir ütopya | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 67 | `son-kapimiz-acikti.png` | Son ekranı görseli: Kapımız açıktı | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 68 | `son-guven-kaybi.png` | Son ekranı görseli: Güven oylaması | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 69 | `son-cokus.png` | Son ekranı görseli: Işıklar söndü | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 70 | `kart-itiraz.png` | Karar kartı görseli: Sakinlerin itirazı | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 71 | `kart-karanlik.png` | Karar kartı görseli: Karanlıkta kalan koloni | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 72 | `kart-susuz.png` | Karar kartı görseli: Su paylaşımı | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 73 | `kart-protesto.png` | Karar kartı görseli: Geri dönüşüm protestosu | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 74 | `kart-kompost.png` | Karar kartı görseli: Kompost tartışması | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 75 | `kart-soz.png` | Karar kartı görseli: Yenilenebilir enerji sözü | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 76 | `kart-toz-uyari.png` | Karar kartı görseli: Yaklaşan toz fırtınası | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 77 | `kart-sel-uyari.png` | Karar kartı görseli: Alçak katı su basabilir | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 78 | `kart-bos-makine.png` | Karar kartı görseli: Araştırma mı, tamirat mı? | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 79 | `kart-kesif-batarya.png` | Karar kartı görseli: Keşif ekibinin bulduğu bataryalar | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 80 | `kart-yeni-aile.png` | Karar kartı görseli: Yeni aileye yer var mı? | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 81 | `ikon-batarya-depo.png` | Pano ikonu: Batarya Deposu | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 82 | `ikon-grisu.png` | Pano ikonu: Gri Su | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 83 | `ikon-turbin.png` | Pano ikonu: Verimli Türbin | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 84 | `ikon-hidroponik.png` | Pano ikonu: Hidroponik | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 85 | `ikon-hava-filtresi.png` | Pano ikonu: Hava Filtresi | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 86 | `ikon-yalitim.png` | Pano ikonu: Yalıtım Tesisi | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 87 | `ikon-bariyer.png` | Pano ikonu: Sel Bariyeri | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 88 | `ikon-ek-panel.png` | Pano ikonu: Ek Güneş Paneli | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 89 | `ikon-santral.png` | Pano ikonu: Keşif: santral | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 90 | `ikon-sehir.png` | Pano ikonu: Keşif: eski şehir | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 91 | `ikon-komsu.png` | Pano ikonu: Keşif: komşu yerleşim | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 92 | `ikon-rezervuar.png` | Pano ikonu: Keşif: rezervuar | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 93 | `kod:sakin-is` | Sakin sulama/onarım/inceleme/düzenleme hareketleri ve işaretleri | Phaser tween + Graphics | Mevcut karakter boyu | ✅ | Yeni PNG yok; prompt: yok, kodla çiziliyor; `activities.js` hedefleri; 2026-11-01 |
| 94 | `ikon-yagmur-suyu.png` | Pano ikonu: Yağmur Suyu Pompası araştırması (yağmur damlası + küçük pompa) | en çok 256×256, şeffaf | — | ⏳ | Kod bağlı; yoksa 💧 |
| 95 | `ikon-yagmur-deposu.png` | Pano ikonu: Yağmur Suyu Deposu yapısı (oluk + tank) | en çok 256×256, şeffaf | — | ⏳ | Kod bağlı; yoksa Gri Su ikonu |
| 96 | `ikon-su-hatti.png` | Pano ikonu: Su Geri Kazanım Hattı (boru + geri dönüş oku) | en çok 256×256, şeffaf | — | ⏳ | Kod bağlı; yoksa Gri Su ikonu |
| 97 | `ikon-onarim-tezgahi.png` | Pano ikonu: Onarım Tezgâhı (tezgâh + anahtar) | en çok 256×256, şeffaf | — | ⏳ | Kod bağlı; yoksa Atık ikonu |
| 98 | `ikon-insaat.png` | Görev ikonu: İnşaat (çekiç + tuğla) | en çok 256×256, şeffaf | — | ⏳ | Koloni panelinde görev düğmesi; yoksa 🔨 |
| 99 | `ikon-dinlen.png` | Görev ikonu: Dinlen (yastık / uyku) | en çok 256×256, şeffaf | — | ⏳ | Koloni panelinde görev düğmesi; yoksa 💤 |
| 100 | `ikon-malzeme.png` | Alt şerit ikonu: Malzeme stoğu (vida + metal levha yığını) | en çok 256×256, şeffaf | — | ⏳ | Sol alttaki Malzeme kutusu; yoksa yalnız yazı |
| 101 | `konsol-enerji.png` | Enerji konsolunun arka plan yüzeyi (sade, koyu, perçinli metal plaka; oda temasında ince süsler) | 16:9, ~1600×900, opak | — | ✅ | Karşılandı: konsol artık mockup zemininde çiziliyor (`panel-<id>.jpg`, satır 136). Ayrı arka plan gerekmez; 2026-11-01 |
| 102 | `konsol-su.png` | Su arıtma konsolunun arka plan yüzeyi (sade, koyu, perçinli metal plaka; oda temasında ince süsler) | 16:9, ~1600×900, opak | — | ✅ | Karşılandı: konsol artık mockup zemininde çiziliyor (`panel-<id>.jpg`, satır 136). Ayrı arka plan gerekmez; 2026-11-01 |
| 103 | `konsol-sera.png` | Sera konsolunun arka plan yüzeyi (sade, koyu, perçinli metal plaka; oda temasında ince süsler) | 16:9, ~1600×900, opak | — | ✅ | Karşılandı: konsol artık mockup zemininde çiziliyor (`panel-<id>.jpg`, satır 136). Ayrı arka plan gerekmez; 2026-11-01 |
| 104 | `konsol-geri.png` | Geri dönüşüm konsolunun arka plan yüzeyi (sade, koyu, perçinli metal plaka; oda temasında ince süsler) | 16:9, ~1600×900, opak | — | ✅ | Karşılandı: konsol artık mockup zemininde çiziliyor (`panel-<id>.jpg`, satır 136). Ayrı arka plan gerekmez; 2026-11-01 |
| 105 | `modul-gunes.png` | Enerji konsolu kontrol çizimi: Güneş panelleri kontrolü: küçük güneş paneli + silecek/temizlik bezi | 5:2 yatay sahne kartı, ~1000×400, opak, YAZISIZ | — | ✅ | Mockup'tan kesildi (`tools/mockup-kes.py`): ortadaki gömülü yazı bulanık "cam etiket" yapıldı, canlı yazı oraya hizalanır (`etiketX`). Yazısız temiz üretim gelirse aynı adla değiştirilir; 2026-11-01 |
| 106 | `modul-ruzgar.png` | Enerji konsolu kontrol çizimi: Rüzgar türbini kontrolü: mini türbin + İngiliz anahtarı | 5:2 yatay sahne kartı, ~1000×400, opak, YAZISIZ | — | ✅ | Mockup'tan kesildi (`tools/mockup-kes.py`): ortadaki gömülü yazı bulanık "cam etiket" yapıldı, canlı yazı oraya hizalanır (`etiketX`). Yazısız temiz üretim gelirse aynı adla değiştirilir; 2026-11-01 |
| 107 | `modul-dizel.png` | Enerji konsolu kontrol çizimi: Dizel jeneratör kontrolü: egzozlu jeneratör bloğu (kirli) | 5:2 yatay sahne kartı, ~1000×400, opak, YAZISIZ | — | ✅ | Mockup'tan kesildi (`tools/mockup-kes.py`): ortadaki gömülü yazı bulanık "cam etiket" yapıldı, canlı yazı oraya hizalanır (`etiketX`). Yazısız temiz üretim gelirse aynı adla değiştirilir; 2026-11-01 |
| 108 | `modul-filtre.png` | Su konsolu kontrol çizimi: Filtre kartuşu: silindir su filtresi | 5:2 yatay sahne kartı, ~1000×400, opak, YAZISIZ | — | ✅ | Mockup'tan kesildi (`tools/mockup-kes.py`): ortadaki gömülü yazı bulanık "cam etiket" yapıldı, canlı yazı oraya hizalanır (`etiketX`). Yazısız temiz üretim gelirse aynı adla değiştirilir; 2026-11-01 |
| 109 | `modul-pompa.png` | Su konsolu kontrol çizimi: Tam güç pompa: pompa gövdesi + vana tekerleği | 5:2 yatay sahne kartı, ~1000×400, opak, YAZISIZ | — | ✅ | Mockup'tan kesildi (`tools/mockup-kes.py`): ortadaki gömülü yazı bulanık "cam etiket" yapıldı, canlı yazı oraya hizalanır (`etiketX`). Yazısız temiz üretim gelirse aynı adla değiştirilir; 2026-11-01 |
| 110 | `modul-sulama.png` | Sera konsolu kontrol çizimi: Sulama hattı: damlayan sulama vanası | 5:2 yatay sahne kartı, ~1000×400, opak, YAZISIZ | — | ✅ | Mockup'tan kesildi (`tools/mockup-kes.py`): ortadaki gömülü yazı bulanık "cam etiket" yapıldı, canlı yazı oraya hizalanır (`etiketX`). Yazısız temiz üretim gelirse aynı adla değiştirilir; 2026-11-01 |
| 111 | `modul-kompost.png` | Sera konsolu kontrol çizimi: Kompost kutusu: ahşap kompost sandığı | 5:2 yatay sahne kartı, ~1000×400, opak, YAZISIZ | — | ✅ | Mockup'tan kesildi (`tools/mockup-kes.py`): ortadaki gömülü yazı bulanık "cam etiket" yapıldı, canlı yazı oraya hizalanır (`etiketX`). Yazısız temiz üretim gelirse aynı adla değiştirilir; 2026-11-01 |
| 112 | `modul-fidan.png` | Sera konsolu kontrol çizimi: Fidan: saksıda genç ağaç | 5:2 yatay sahne kartı, ~1000×400, opak, YAZISIZ | — | ✅ | Mockup'tan kesildi (`tools/mockup-kes.py`): ortadaki gömülü yazı bulanık "cam etiket" yapıldı, canlı yazı oraya hizalanır (`etiketX`). Yazısız temiz üretim gelirse aynı adla değiştirilir; 2026-11-01 |
| 113 | `modul-ayristir.png` | Geri dönüşüm konsolu kontrol çizimi: Ayrıştırma bandı: üç renkli ayrıştırma kutusu | 5:2 yatay sahne kartı, ~1000×400, opak, YAZISIZ | — | ✅ | Mockup'tan kesildi (`tools/mockup-kes.py`): ortadaki gömülü yazı bulanık "cam etiket" yapıldı, canlı yazı oraya hizalanır (`etiketX`). Yazısız temiz üretim gelirse aynı adla değiştirilir; 2026-11-01 |
| 114 | `modul-onar.png` | Geri dönüşüm konsolu kontrol çizimi: Onarım tezgâhı: tezgâh üstünde aletler | 5:2 yatay sahne kartı, ~1000×400, opak, YAZISIZ | — | ✅ | Mockup'tan kesildi (`tools/mockup-kes.py`): ortadaki gömülü yazı bulanık "cam etiket" yapıldı, canlı yazı oraya hizalanır (`etiketX`). Yazısız temiz üretim gelirse aynı adla değiştirilir; 2026-11-01 |
| 115 | `modul-yak.png` | Geri dönüşüm konsolu kontrol çizimi: Yakma fırını: küçük fırın + alev (kirli) | 5:2 yatay sahne kartı, ~1000×400, opak, YAZISIZ | — | ✅ | Mockup'tan kesildi (`tools/mockup-kes.py`): ortadaki gömülü yazı bulanık "cam etiket" yapıldı, canlı yazı oraya hizalanır (`etiketX`). Yazısız temiz üretim gelirse aynı adla değiştirilir; 2026-11-01 |
| 116 | `prolog-1.png` | Prolog 1. gün kartı görseli: İlk ışık: boş sığınakta ilk lamba yanıyor, kapıda enerji teknisyeni | 3:2 yatay | — | ⏳ | İsteğe bağlı; yoksa görselsiz kart. Prompt: asset-promptu P8; 2026-11-01 |
| 117 | `prolog-2.png` | Prolog 2. gün kartı görseli: Su ve toprak: su tankları doluyor, serada filizler | 3:2 yatay | — | ⏳ | İsteğe bağlı; yoksa görselsiz kart. Prompt: asset-promptu P8; 2026-11-01 |
| 118 | `prolog-3.png` | Prolog 3. gün kartı görseli: Döngüyü kapat: dört kurucu akşam ışığında atölyede | 3:2 yatay | — | ⏳ | İsteğe bağlı; yoksa görselsiz kart. Prompt: asset-promptu P8; 2026-11-01 |
| 119 | `yonetim-koloni.png` | Koloni görev tahtası arka planı: duvara monte ahşap/metal pano, sütun çizgileri hafif | 16:10, ~1600×1000, opak | — | ✅ | Karşılandı: bölüm mockup zemininde çiziliyor (`yonetim-<bölüm>.jpg`, satır 137). Ayrı arka plan gerekmez; 2026-11-01 |
| 120 | `yonetim-odalar.png` | Odalar arka planı: sığınak kesit planı gibi sade metal yüzey | 16:10, ~1600×1000, opak | — | ✅ | Karşılandı: bölüm mockup zemininde çiziliyor (`yonetim-<bölüm>.jpg`, satır 137). Ayrı arka plan gerekmez; 2026-11-01 |
| 121 | `yonetim-kesif.png` | Keşif haritası: yukarıdan, çorak bölge; ortada tepe/sığınak boşluğu, köşelerde santral, eski şehir, komşu köy, kuru rezervuar bölgeleri (pinler oyunca eklenir) | 3:2, ~1500×1000, opak | — | ✅ | Karşılandı: bölüm mockup zemininde çiziliyor (`yonetim-<bölüm>.jpg`, satır 137). Ayrı arka plan gerekmez; 2026-11-01 |
| 122 | `yonetim-arastirma.png` | Araştırma arka planı: laboratuvar tezgâhı/tahta yüzeyi, sade orta | 16:10, ~1600×1000, opak | — | ✅ | Karşılandı: bölüm mockup zemininde çiziliyor (`yonetim-<bölüm>.jpg`, satır 137). Ayrı arka plan gerekmez; 2026-11-01 |
| 123 | `yonetim-insaat.png` | İnşaat arka planı: mavi plan kâğıdı dokusu (blueprint), ızgara | 16:10, ~1600×1000, opak | — | ✅ | Karşılandı: bölüm mockup zemininde çiziliyor (`yonetim-<bölüm>.jpg`, satır 137). Ayrı arka plan gerekmez; 2026-11-01 |
| 124 | `yonetim-hedefler.png` | Hedefler arka planı: mantar pano dokusu, ahşap çerçeve | 16:10, ~1600×1000, opak | — | ✅ | Karşılandı: bölüm mockup zemininde çiziliyor (`yonetim-<bölüm>.jpg`, satır 137). Ayrı arka plan gerekmez; 2026-11-01 |
| 125 | `kesif-siginak.png` | Keşif haritasında sığınak işareti: tepeye gömülü küçük eko-sığınak, yukarıdan/yandan | 1:1, en çok 256×256, şeffaf | — | ✅ | Karşılandı: sığınak işareti keşif mockup zemininden geliyor; 2026-11-01 |
| 126 | `ikon-sekme-koloni.png` | Yönetim panosu sekme ikonu: iki kişi silueti + liste | en çok 256×256, şeffaf | — | ⏳ | İsteğe bağlı; yoksa yalnız yazı. Prompt: asset-promptu P9; 2026-11-01 |
| 127 | `ikon-sekme-odalar.png` | Yönetim panosu sekme ikonu: sığınak kesiti / ev | en çok 256×256, şeffaf | — | ⏳ | İsteğe bağlı; yoksa yalnız yazı. Prompt: asset-promptu P9; 2026-11-01 |
| 128 | `ikon-sekme-kesif.png` | Yönetim panosu sekme ikonu: pusula + harita | en çok 256×256, şeffaf | — | ⏳ | İsteğe bağlı; yoksa yalnız yazı. Prompt: asset-promptu P9; 2026-11-01 |
| 129 | `ikon-sekme-arastirma.png` | Yönetim panosu sekme ikonu: deney tüpü + dişli | en çok 256×256, şeffaf | — | ⏳ | İsteğe bağlı; yoksa yalnız yazı. Prompt: asset-promptu P9; 2026-11-01 |
| 130 | `ikon-sekme-insaat.png` | Yönetim panosu sekme ikonu: vinç / çekiç | en çok 256×256, şeffaf | — | ⏳ | İsteğe bağlı; yoksa yalnız yazı. Prompt: asset-promptu P9; 2026-11-01 |
| 131 | `ikon-sekme-hedefler.png` | Yönetim panosu sekme ikonu: raptiyeli not | en çok 256×256, şeffaf | — | ⏳ | İsteğe bağlı; yoksa yalnız yazı. Prompt: asset-promptu P9; 2026-11-01 |
| 132 | `konsol-cerceve.png` | Konsol ve yönetim penceresi çerçevesi: yıpranmış pirinç/ahşap kenar, köşelerde sarmaşık yaprakları, üst ortada boş tabela (yazısız) | 512×512, 9-dilim (köşe 96 px), şeffaf orta | — | ⏳ | İsteğe bağlı; yoksa `kart-cerceve.png`. Hedef görünüm `docs/tasarim-referans/konsol-enerji.jpg`. Prompt: asset-promptu P7; 2026-11-01 |
| 133 | `konsol-tank.png` | Su konsolunun oda görseli: iki mavi tank (canlı seviye camını oyun çizer) | ~608×142, opak | — | ✅ | Mockup'tan kesildi (`tools/mockup-kes.py`); 2026-11-01 |
| 134 | `rozet-selin.png`, `rozet-burak.png`, `rozet-can.png` | Küçük yüz rozetleri (konsol operatörü, koloni kartları, keşif/inşaat seçimleri) | 128×128, opak | — | ✅ | Mockup'tan kesildi; 1:1 portreden önce kullanılır; 2026-11-01 |
| 135 | `rozet-nur.png` ve ziyaretçiler `rozet-<id>.png` | Diğer küçük yüz rozetleri | 128×128 | — | ⏳ | İsteğe bağlı; yoksa 1:1 portre. Mockup'taki "Nur" Selin'in kopyası çıktığı için alınmadı. Yeni kurucu portresi gelince ondan kesilebilir; 2026-11-01 |
| 136 | `panel-enerji.jpg`, `panel-su.jpg`, `panel-sera.jpg`, `panel-geriDonusum.jpg` | Mockup zeminli oda konsolları: çerçeve, sarmaşık, tabela, başlık, oda çizimi ve düğme çizimleri korunur; değişken bölgeler bulanık (canlı katman üstüne gelir) | 1672×941 JPEG (~240 KB) | — | ✅ | `python3 tools/konsol-arka.py` üretir; yerleşim `src/data/konsol-yerlesim.json`. Mockup değişirse kutular yeniden ölçülmeli; 2026-11-01 |
| 137 | `yonetim-koloni.jpg`, `yonetim-odalar.jpg`, `yonetim-kesif.jpg`, `yonetim-arastirma.jpg`, `yonetim-insaat.jpg`, `yonetim-hedefler.jpg` | Mockup zeminli yönetim panosu: çerçeve, sekmeler (seçili sekme çizimde), başlık, harita, plan kâğıdı süsleri, mantar pano, alt şerit ve Kapat çizimi korunur; değişken bölgeler bulanık | 1672×941 JPEG (~180–270 KB) | — | ✅ | `python3 tools/konsol-arka.py` üretir; yerleşim `konsol-yerlesim.json` → `yonetim`; 2026-11-01 |
| 138 | `hikaye-ekran-1..4.jpg`, `ekran-ayarlar.jpg`, `hud-serit.jpg`, `alt-serit.jpg`, `panel-<id>-kapali.jpg` (4) | Mockup zeminli tam hikaye ekranları (metin görselde, story.js ile aynı), Ayarlar, üst kaynak şeridi, alt yönetim şeridi ve operatörsüz konsol zeminleri | JPEG, ~110–300 KB | — | ✅ | `python3 tools/ekran-zemin.py` üretir; story.js metni değişirse hikaye ekranları güncellenmeli (yoksa eski HTML ekranı için dosyayı kaldırın); 2026-11-01 |
| 139 | `anim/panel-calis-1..3.png` | Genel konsol çalışma animasyonu kareleri | 400×600, şeffaf | 1,5 m | 🔁 | Kareler sprite sheet'ten dar kesilmiş: konsolun sağ yanı kesik (2026-11-01 kenar analizi). Aynı stilde, kenarda boşluk bırakılarak yeniden kesilmeli/üretilmeli |

---
