# Son Denge: Proje Dokümanı

> **Takım için tek kaynak.** Bu dosyada oyunun hikayesi, tüm mekanikleri ve sayıları, teknik yapısı, görsel üretim promptları ve sunum notları var. Kendi yapay zeka asistanınıza (ChatGPT, Gemini, Claude vb.) bu dosyayı verip "bu projede bana yardım et" diyebilirsiniz. Güncel devir ve devam rehberi: `docs/devralma.md`.
>
> Son güncelleme: 1 Kasım 2026 · Güncel devir özeti: `docs/devralma.md`. Sayılarda esas kaynak `src/state.js` ve `src/data/` dosyalarıdır.

- **Repo:** https://github.com/Kedaybehzat/son-denge
- **Oynanabilir sürüm:** https://kedaybehzat.github.io/son-denge/
- **Çalışma adı:** "Son Denge" · **Şehrin adı:** "Yeşilvadi" (ikisi de değiştirilebilir)

---

## 0. Bu dokümanı okuyan yapay zekaya not

Bu dosyayı bir yapay zeka asistanına veriyorsan, asistan şunları bilmeli:

- Proje bir **hackathon oyunu**. Teslim **1 Kasım 2026 Pazar 23:59**. Zaman çok kısa. `Son_Denge_Mekanik_Tasarim_GDD.pdf`'teki [ÖNERİ] mekanikleri **bu teslim için** yapılıyor (hackathon sonrasına bırakılmadı); GDD bölüm 14'teki faz sırasıyla, her adımı küçük ve test edilebilir dilimler halinde ilerleyin.
- Oyun **Phaser 3 + Vite** ile yazılmış bir **web oyunu**. Arayüz (paneller, kartlar, HUD) **düz HTML/CSS**, oyun dünyası Phaser.
- Koddaki **değişken ve fonksiyon adları Türkçe** (`state.kaynak.enerji`, `gunuBitir()`, `ziyaretciKabul()` gibi). Yeni kod da bu stile uymalı.
- Oyun **veri odaklı**: sayıların ve metinlerin neredeyse tamamı `src/data/` klasöründe ve `src/state.js` içindeki `AYAR` nesnesinde. İçerik değişikliği için sahne koduna dokunmak gerekmez.
- Denge sayılarını değiştirdikten sonra `node tools/simulasyon.mjs` çalıştırılmalı ve sonların dağılımı kontrol edilmeli.
- Kodda birleştirme sorumlusu Ayberk. Kod değişikliklerini doğrudan repoya değil, ona iletin ya da pull request açın.
- Görseller AI ile üretilecek. Görsel promptları bölüm 6'da. Stil tutarlılığı en önemli kural.

## 0.1 Asistan çalışma kuralları (her prompt için zorunlu)

**Prompta başlarken:**
1. Önce `PROJECT_LOG.md` → **Project Map** bölümünü oku.
2. İsteğin ilgili olduğu dosya ve fonksiyonları haritadan bul ve **yalnızca onlara git**. Bütün projeyi tarama, tüm dosyaları okuma.
3. Harita yetersizse ya da yanlışsa hedefli arama (grep) yap, sonra haritayı düzelt.

**Prompt bitince (dosya değiştiyse ya da yalnızca soru cevaplandıysa bile):**
1. Promptu atan kullanıcıyı `git config user.name` ve `git config user.email` ile belirle.
2. `PROJECT_LOG.md` → **Değişiklik Logu** bölümüne en üste yeni kayıt ekle:
   - **Tarih** (YYYY-AA-GG, gerekirse saat) · **Kullanıcı** (ad ve e-posta)
   - **Prompt:** isteğin kısa özeti
   - **Yapılan değişiklik:** tek cümlelik özet
   - **Dosya / Açıklama tablosu:** değişen her dosya ve o dosyada ne değiştiği
   - **Debt:** bu değişiklikle doğan ya da kapanan teknik borç, kestirilen köşeler, yarım kalan işler ("yok" da yazılabilir)
   - Hiçbir dosya değişmediyse kaydı "Değişiklik yok" diye kısa tut.
3. **Project Map**'i güncelle: yeni/silinen/taşınan dosya ya da fonksiyon varsa tabloya ve ağaca işle.
4. **Bilinen borçlar** tablosunu güncelle: yeni borcu ekle, kapanan borcu sil ve logda "kapandı: D#" diye belirt.
5. **Asset listesi:** Görsel gerektiren yeni bir şey eklendiyse (sprite, dekor, oda, portre, ekran, UI görseli; kodla çizilen yer tutucu da dahil) `PROJECT_LOG.md` → **Asset Listesi** bölümüne satır ekle (liste her zaman güncel tutulur): dosya adı, ne olduğu, yükseklik/boyut, prompt referansı, durum, eklenme tarihi.
   - **İsimlendirme:** küçük harf, Türkçe karakter yok, kelimeler `-` ile (`panel-su.png`, `sakin-1.png`, `ziyaretci-<id>.png`, `kurucu-<id>.png`, `dekor-<ad>.png`, `oda-<oda>.png`). Ziyaretçi/kurucu için koddaki `id` kullanılır.
   - **Animasyon** eklendiyse `src/data/animations.js` → `ANIMASYONLAR`'a ekle (kare sayısı, fps, döngü, sahip, ne zaman) ve Asset Listesi tablosuna (uzantısız satır olarak) yaz. Kare dosyaları: `anim/<animasyon>-<kare>.png`, kareler 1'den başlar.
   - Doğrudan sahnede çizilen nesne ise `src/data/assets.js` → `ASSETLER`'e de ekle (yer tutucusu `dokulariUret()`'te kalsın) ve Asset Listesi'ne (tek tablo, kategori yok) satır ekle.
   - `AGENTS.md` bölüm 6'ya görsel promptunu ekle (yoksa listede "yok, yazılacak" yaz).
   - Asset geldiğinde ya da kaldırıldığında `node tools/asset-durum.mjs` çalıştır ve Durum sütununu güncelle.
   - **Dosya boyutu:** Oyun her şeyi tarayıcıda indirir. Gelen görselleri repoya koymadan önce oyunun ihtiyacına küçült (orijinali `assets-orijinal/` altına yedekle, git'e girmez): nesne/karakter/animasyon karesi en fazla 600 px yükseklik, portre 512×512, hikaye 1280 px genişlik. Oda ve manzara görselleri olduğu gibi kalır.

---

## 1. Hackathon bilgileri

- **Etkinlik:** GameUP Türkiye Programı Oyun Hackathonu, 30 Ekim – 1 Kasım 2026
- **Takım:** 3 kişi
- **Teslim:** 1 Kasım Pazar 23:59'a kadar oyun tanıtım sunumu, WhatsApp'tan paylaşılan form üzerinden. Sunum, organizasyonun paylaşacağı **şablonla** hazırlanmalı.
- **Şart:** Oyun **iklim değişikliğine odaklanmalı** ve **demo aşamasında** (oynanabilir) olmalı.
- **Katılım:** Yayın ve webinarların en az %60'ına katılmak gerekiyor; bu da değerlendirmeye giriyor.
- **3. kişi hakları:** Başkalarının eserlerine (görsel, isim, müzik) dikkat edilmeli.
- **Değerlendirme kriterleri:** Odak tema, takım/motivasyon, yaratıcılık, özgünlük, zaman yönetimi, sunum, etkili iletişim, oyun tasarımı, oynanabilirlik, teknik işlevsellik. En iyi 10 oyun seçilecek.
- **Odak alanları:** Yenilenebilir enerji ve sürdürülebilirlik · Karbon ayak izi ve bilinçli tüketim · İklim dirençli şehirler · Gıda güvenliği · Okyanuslar ve denizler · İklim değişikliği odağında eğitim · Sıfır atık

**Oyunumuzun dokunduğu odak alanları:** Yenilenebilir enerji (güneş ve rüzgar ile dizel jeneratör ikilemi), karbon ayak izi (karbon göstergesi), gıda güvenliği (sera, gıda kaynağı), sıfır atık (ayrıştırma, onarım, kompost, yakma ikilemi), iklim dirençli şehirler (sığınağın kendisi), eğitim ("Biliyor muydun?" kartları), okyanuslar (yükselen denizden kaçan aile).

---

## 2. Oyunun özeti

**Tek cümle:** İklim çöküşünden sonra kurulan son ütopya Yeşilvadi'de, sığınağın kaynaklarını yönetirken kapıya gelen iklim göçmenlerini içeri alıp almamaya karar verdiğin, yandan görünüşlü 2D bir kaynak yönetimi oyunu.

**Tür:** 2D yandan görünüş (side-view cutaway), kaynak yönetimi + ahlaki karar. Tarayıcıda oynanır, kurulum gerektirmez. Bir oyun yaklaşık 5–10 dakika sürer.

**Temel gerilim:** Her "kolay" çözümün bir bedeli var. Dizel jeneratör hızlıca enerji verir ama karbon salar. Kapıdakileri içeri almak insanlık puanını yükseltir ama kaynakları zorlar. Mesaj: **Ütopya ancak hem sürdürülebilir hem paylaşılan olduğunda gerçek olur.**

**İlham:** No, I'm Not a Human oyunundaki küçük ev, odalar arası dolaşma ve kapıya gelenler hakkında karar verme yapısı. Görselleri, karakterleri, adı ya da hikayesi **kullanılmıyor**; sadece yapıdan ilham alındı. Sunumda "ilham aldığımız oyun" olarak anılabilir.

---

## 3. Hikaye

Dört açılış ekranı `src/data/story.js` içinde; Geç ile atlanır. Tarihler kurmaca gelecek senaryosudur, iklim tahmini değildir.

- **2030'lar · Dünya ısınıyordu:** Sıcak dalgaları, su/enerji ihtiyacı ve yetersiz hazırlık.
- **2040'lar · Su azaldı, yollar değişti:** Kuraklık, seller, altyapı hasarı ve yeni yuva arayan topluluklar.
- **2050'ler · Büyük Sessizlik:** Afet/tedarik kesintileriyle boşalan yerleşimler ve susan üretim merkezleri.
- **2071 · Yeşilvadi:** Su yeniden kullanımı, dikkatli enerji üretimi, onarım ve dayanışma üzerine kurulan topluluk; beş günlük yönetim oyuncuya emanet.

**Anlatının odağı:** İklim baskısı → kaynak ve altyapı sorunları → uyum ve dayanışma kararları. Virüs/salgın açıklaması kaldırıldı. Eski `hikaye-2.png` donmuş toprak/hasarlı altyapı görseli olarak korunur; yeni görsel üretilmedi. Çocuklar afetler sırasında ailelerinden ayrı düşmüştür. İlk radyo mesajı hazırlık ve paylaşımı vurgular; mevcut ekranda ilk gün rehberi gösterilir.

---

## 4. Oynanış

### 4.1 Kontroller
- **A / D** ya da **← / →**: yürü
- **Shift + yön**: koş (yürüme hızının 1,65 katı)
- **E**: yakındaki nesneyle etkileşim (panel, radyo, yatak, kapı)
- **1 / 2 / 3**: açık paneldeki eylemi seç
- **Esc**: pencereyi kapat · **Enter**: varsayılan buton

### 4.2 Gün döngüsü
1. **Sabah:** Radyodan günün olayı gelir. 2. günden itibaren kapıya bir ziyaretçi gelir (kapının üstünde sarı "!" çıkar).
2. **Gün:** Oyuncu odalar arasında yürür, panellerden eylem yapar (her gün **3 eylem hakkı**), kapıdaki ziyaretçi hakkında karar verir (karar eylem hakkı harcamaz).
3. **Gece:** Yatağa gidince gün biter. Sabit tüketim + kişi başı tüketim + içeri alınanların katkıları + olayın gece etkisi uygulanır.
4. **Gece raporu:** Değişimler ve o gün yapılan seçime bağlı bir **"Biliyor muydun?"** kartı gösterilir.
5. Oyun **5 gün** sürer. 5. gecenin sonunda ya da denge 10'un altına düşerse son ekranı gelir.

### 4.3 Kaynaklar ve denge
| Kaynak | Başlangıç | İyi yön |
|---|---|---|
| ⚡ Enerji | 50 | Yüksek |
| 💧 Su | 50 | Yüksek |
| 🌾 Gıda | 50 | Yüksek |
| 🗑️ Atık | 35 | Düşük |
| ☁️ Karbon | 35 | Düşük |

- Tüm kaynaklar 0–100 arasında.
- **Gece tüketimi:** Sabit olarak −21 enerji, −9 su, −9 gıda, +15 atık, −3 karbon. Buna ek olarak **kişi başı −2 su ve −2 gıda**. Başlangıç nüfusu 4: dört kurucu (oyuncu yöneticidir, nüfusa sayılmaz).
- **Makine üretimi:** Operatörü olan (ya da oyuncunun o gün kendisi çalıştığı) makine her gece üretir: Enerji +6, Su Arıtma +5 su, Sera +5 gıda, Geri Dönüşüm −5 atık. Dördü de çalışırsa net gece etkisi eski −15 / −4 / −4 / +10 ile aynıdır; **boş makine kayıptır**. Ayrıntı bölüm 4.13.
- **Denge (0–100):** 5 kaynağın ağırlıklı ortalaması. Atık ve karbon ters çevrilerek hesaplanır (100 − değer). **Karbon iki kat ağırlıklı.** Her kaynak **80'de tam puan** verir, yani 80'in üstündeki fazlalık işe yaramaz ve fazla enerji kirliliği telafi edemez. Enerji, su ya da gıdadan biri 0'a düşerse denge 15 puan ceza alır.
- **İnsanlık (0–100, oyuncuya gizli):** 50'den başlar. Ziyaretçiyi içeri almak artırır, geri çevirmek düşürür, karar vermeden günü bitirmek −8 puan.
- **Nüfus:** Başlangıçta 4 kişi. Üst çubukta görünür. İçeri alınanlar sığınakta dolaşan sakinler olarak görünür.

### 4.4 Odalar (soldan sağa)
1. Yaşam Alanı: Kapı, Radyo, Yatak (günü bitir)
2. Enerji Odası: Enerji Paneli
3. Su Arıtma: Arıtma Paneli
4. Sera: Sera Paneli
5. Geri Dönüşüm: Geri Dönüşüm Paneli

### 4.5 Paneller ve eylemler
Her eylem 1 eylem hakkı harcar. Su, enerji ve gıda harcayan eylemler için kaynak yeterli olmalıdır; atık ve karbon azaltma, kalan miktar az olsa da yapılabilir. "Kirli" eylemler arayüzde kırmızı kenarlık ve "⚠ kirletir" etiketiyle gösterilir.

**Enerji Kontrol Paneli** (`enerji`): Güneş panelleri, rüzgar türbini ve yedek dizel jeneratör. Jeneratör hızlıdır ama havayı kirletir.

| # | Eylem | Etki | Kirli mi | Bilgi kartı |
|---|---|---|---|---|
| 1 | Güneş panellerini temizle | +20 Enerji | Hayır | `gunes` |
| 2 | Rüzgar türbinini onar | +12 Enerji, +5 Atık | Hayır | `ruzgar` |
| 3 | Dizel jeneratörü çalıştır | +35 Enerji, +18 Karbon | Evet | `fosil` |

**Su Arıtma Sistemi** (`su`): Gri suyu ve yağmur suyunu arıtır. Tam güç modu çok enerji yer.

| # | Eylem | Etki | Kirli mi | Bilgi kartı |
|---|---|---|---|---|
| 1 | Filtreleri değiştir | +18 Su, +5 Atık | Hayır | `tatlisu` |
| 2 | Arıtmayı tam güçle çalıştır | +30 Su, −15 Enerji | Hayır | `suenerji` |

**Sera** (`sera`): Yeşilvadi'nin besin kaynağı. Bitkiler su ister ama karbonu da azaltır.

| # | Eylem | Etki | Kirli mi | Bilgi kartı |
|---|---|---|---|---|
| 1 | Serayı sula | +20 Gıda, −10 Su | Hayır | `sulama` |
| 2 | Kompost ekle | +12 Gıda, −12 Atık | Hayır | `metan` |
| 3 | Fidan dik | −15 Karbon, −6 Su | Hayır | `agac` |

**Geri Dönüşüm İstasyonu** (`geriDonusum`): Atıkları ayrıştır ya da yak. Yakmak hızlıdır ve biraz enerji verir, ama karbon salar.

| # | Eylem | Etki | Kirli mi | Bilgi kartı |
|---|---|---|---|---|
| 1 | Atıkları ayrıştır | −20 Atık | Hayır | `plastik` |
| 2 | Malzemeleri onarıp yeniden kullan | −10 Atık, +5 Enerji | Hayır | `hiyerarsi` |
| 3 | Atıkları yak | −35 Atık, +8 Enerji, +15 Karbon | Evet | `yakma` |

### 4.6 Radyo olayları
1. gün her zaman "Sakin bir sabah" (öğretici). 2. günden itibaren aşağıdakilerden rastgele biri gelir, bir oyunda aynı olay tekrar etmez. **Her olay bir gün önceden radyoda duyurulur** (bölüm 4.15); zararlı olaylara hazırlanılabilir.

| Olay | Radyo metni | Hemen | O gece ek | Eylem hakkı | Hazırlık (1 eylem, bir gün önce) |
|---|---|---|---|---|---|
| Sıcak hava dalgası | "Bugün sıcaklık 46 dereceyi bulacak. Soğutma sistemleri tam kapasite çalışıyor." | — | −18 Enerji, −10 Su | — | Yalıtımı güçlendir, gölgelikleri kur: tamamen önler |
| Kuraklık | "Baraj doluluk oranı yüzde 8'e geriledi. Su kullanımında tasarruf şart." | — | −20 Su | — | Tankları doldur, tasarruf planı: tamamen önler |
| Ani sel | "Gece yağan sağanak seranın alt katını su bastı. Hasar tespit ediliyor." | −22 Gıda, +14 Atık | — | — | Seraya su bariyeri: %70 azaltır |
| Şebeke kesintisi | "Bölge şebekesinde arıza var. Bugün sistemlerin bir kısmı devre dışı." | — | — | −1 | Yok (sadece önceden duyurulur) |
| Rüzgarlı gün | "Kuvvetli rüzgar bekleniyor. Türbinler tam kapasite üretimde." | +15 Enerji | — | — | — |
| Toz fırtınası | "Çölleşen bölgelerden gelen toz bulutu panelleri kapladı. Güneş enerjisi üretimi düşük." | +8 Karbon | −15 Enerji | — | Panelleri örtüyle kapla: tamamen önler |
| Komşu sığınaktan takas | "Doğu sığınağı fazla hasatlarını paylaştı. Ambalajlar geri dönüşüm bekliyor." | +12 Gıda, +8 Atık | — | — | — |

Zararlı olaylar hazırlık mekaniğiyle ~1,6 kat sertleştirildi (eski: sıcak −10/−5, kuraklık −12, sel −15/+10, toz +5/−8); böylece hazırlanmak bir panel eylemi kadar değerli.

### 4.7 Kapı ve ziyaretçiler
2. günden itibaren her sabah aşağıdakilerden rastgele biri gelir (bir oyunda en fazla 4 ziyaretçi, tekrar yok).

- **İçeri al:** Nüfus artar (her kişi her gece −2 su, −2 gıda), insanlık artar, ziyaretçinin katkısı başlar.
- **Geri çevir:** İnsanlık düşer, kaynaklar korunur.
- **Karar verilmezse:** Gün sonunda ziyaretçi gider, insanlık −8.

| Ziyaretçi | Kişi | Hikaye | Getirdikleri | Kabul: insanlık | Ret: insanlık |
|---|---|---|---|---|---|
| 🛠️ Deniz, mühendis (`muhendis`) | 1 | Kuzeydeki enerji santralinde çalışıyormuş. Santral sel altında kalınca günlerce yürüyerek yola çıkmış. | Her gün +1 eylem hakkı | +10 | −15 |
| 🌱 Hasan ve kızı Elif (`ciftci`) | 2 | Kuraklık tarlalarını kurutmuş. Yanlarında bir avuç tohumdan başka bir şey yok. | Seraya yardım: her gece +5 gıda | +12 | −18 |
| 🔬 Dr. Leyla (`bilim`) | 1 | Büyük Sessizlik'ten önce iklim araştırmacısıymış. Çantası hava filtresi çizimleriyle dolu. | Hava filtresi: her gece −4 karbon | +10 | −15 |
| 🧒 Mert ve Ada (`cocuklar`) | 2 | İki kardeş. Afetler sırasında ailelerinden ayrı düşmüşler, haftalardır yalnız yürüyorlar. | Hiçbir şey getirmiyorlar. Sadece bir gelecek. | +20 | −25 |
| 🔧 Kemal, tamirci (`tamirci`) | 1 | Sırtında koca bir alet çantası var. Bozuk ne varsa onarabileceğini söylüyor. | Hemen +10 enerji, her gece −4 atık | +10 | −15 |
| 🌊 Sahil kasabasından bir aile (`kafile`) | 4 | Yükselen deniz evlerini yutmuş. Dört kişiler, çok yorgunlar ama çalışmaya hazırlar. | Her gece +3 gıda, +3 su | +15 | −22 |

**Hassasiyet notu:** Ziyaretçiler hastalık taşıyıcısı gibi gösterilmiyor. Karar kaynak ile vicdan arasında. Bu bilinçli bir tercih; iklim göçmenlerini damgalayan bir anlatıdan kaçınıyoruz.

### 4.8 Sonlar (denge × insanlık, + güven oylaması)
| | İnsanlık ≥ 50 | İnsanlık < 50 |
|---|---|---|
| **Denge ≥ 60** | **Yeşilvadi nefes alıyor:** Kaynaklar dengede, kapı açık. "Ütopya ancak paylaşıldığında gerçek oluyor." | **Yalnız bir ütopya:** Sığınak ayakta ama dışarıdakiler terk edildi. "Sadece içeridekiler için kurulan bir dünya ne kadar ütopya sayılır?" |
| **Denge < 60** | **Kapımız açıktı:** Kimse terk edilmedi ama kaynaklar yetmedi. "Dayanışma ancak sürdürülebilir bir sistemle ayakta kalır." | **Işıklar söndü:** Kaynaklar tükendi, kapı kapalı kaldı. "Çöküş her gün verilen küçük kararlarla geldi." |

**5. son, Güven oylaması (nadir):** Memnuniyet üst üste 2 gece 10 veya altında kalırsa sakinler yönetimi devreder: "Sürdürülebilir kararlar ancak insanlar onlara inandığında ve sesleri duyulduğunda ayakta kalır." (bölüm 4.18)

Son ekranında denge, insanlık, nüfus, geri çevrilen kişi sayısı, memnuniyet ile bir bilgi kartı gösterilir.

### 4.9 "Biliyor muydun?" kartları

Gece seçimlerine bağlı kartlar; genel havuz `permafrost`, `uyum`, `gidaisraf`. Tıklanabilir birincil kaynak ve 1 Kasım 2026 doğrulama tarihi `src/data/facts.js` içinde. Kapsam/düzeltme notları `docs/bilgi-kaynaklari.md`. Oyun puanları gerçek ölçüm değildir.

| Anahtar | Güncel bilgi | Kaynak |
|---|---|---|
| `erkenuyari` | WMO’ya göre fırtına veya sıcak hava dalgasından 24 saat önce uyarı verilmesi olası zararı yaklaşık %30 azaltabilir. Bu, her olayda aynı sonuç alınacağı anlamına gelmez. | [WMO · Weather forecasts and early warnings (2025)](https://public.wmo.int/site/science-action/weather-forecasts-and-early-warnings) |
| `batarya` | Güneş ve rüzgârın üretimi değişkendir. Bataryalar elektrik üretimi ile ihtiyaç arasındaki zaman farkını yönetmeye ve kısa süreli enerji güvenliğine katkı sağlar. | [IEA · Batteries and Secure Energy Transitions (2024)](https://www.iea.org/reports/batteries-and-secure-energy-transitions/executive-summary) |
| `grisu` | Duş ve lavabo gibi kaynaklardan gelen gri su, uygun arıtmayla tuvalet rezervuarı ve sulama gibi içme suyu gerektirmeyen işlerde kullanılabilir. Kullanım amacına uygun arıtma gerekir. | [US EPA · Onsite Non-Potable Water Reuse Resources](https://www.epa.gov/waterreuse/onsite-non-potable-water-reuse-resources) |
| `fosil` | BM’nin iklim açıklamasına göre fosil yakıtlar, küresel sera gazı salımlarının %75’inden fazlasıyla ve karbondioksit salımlarının yaklaşık %90’ıyla ilişkilidir. | [Birleşmiş Milletler · Causes and Effects of Climate Change (2022)](https://www.un.org/en/climatechange/causes-and-effects-climate-change) |
| `gunes` | Güneş panelinde biriken toz ve kir, hücrelere ulaşan ışığı azaltabilir. Kaybın büyüklüğü birikime ve yerel koşullara bağlıdır; uygun temizlik ve bakım önemlidir. | [Sandia National Laboratories · PV Performance Modeling Collaborative](https://pvpmc.sandia.gov/modeling-guide/1-weather-design-inputs/shading-soiling-and-reflection-losses/soiling-losses/) |
| `ruzgar` | Rüzgâr ve güneş gibi yenilenebilir kaynaklar, elektrik üretimi sırasında çok az sera gazı salar veya hiç salmaz. Enerji kaynağı seçimi iklim kararlarının bir parçasıdır. | [Birleşmiş Milletler · Renewable energy](https://www.un.org/en/climatechange/raising-ambition/renewable-energy) |
| `tatlisu` | Dünya suyunun yaklaşık %2,5’i tatlı sudur. Bunun büyük bölümü buzullarda veya yer altında bulunur; göl ve nehirlerdeki payı küçüktür. | [NOAA · The water cycle](https://www.noaa.gov/education/resource-collections/freshwater/water-cycle) |
| `suenerji` | Suyu çıkarmak, pompalamak, arıtmak ve kullanıcılara ulaştırmak enerji gerektirir. Su ve enerji güvenliği bu yüzden birlikte düşünülmelidir. | [IEA · Energy and Water](https://www.iea.org/topics/energy-and-water) |
| `sulama` | FAO’ya göre tarım, küresel tatlı su çekimlerinin yaklaşık %72’sini oluşturur; başlıca etken sulamadır. Gıda üretiminde suyu dikkatli yönetmek önemlidir. | [FAO · Agricultural water management](https://www.fao.org/land-water/water/agricultural-water-management/water-scarcity/) |
| `metan` | Organik atıklar çöp sahasında oksijensiz ayrışırken metan oluşabilir. Uygun kompostlama, bu atıkları toprağı destekleyen bir malzemeye çevirerek çöp sahalarından gelen metanı azaltabilir. | [US EPA · Composting](https://www.epa.gov/sustainable-management-food/composting) |
| `agac` | Ağaçların karbon tutması türüne, yaşına ve yetişme koşullarına bağlıdır. Genç ormanlar büyürken karbon biriktirir; yaşlı ormanlarda ise daha büyük bir karbon stoğu bulunabilir. Bu süreç yıllara yayılır. | [USDA Climate Hubs · Understanding Northwest Forest Carbon](https://www.climatehubs.usda.gov/hubs/northwest/topic/understanding-northwest-forest-carbon) |
| `plastik` | OECD’nin 2019 küresel plastik atık verilerine göre yalnızca %9’u geri dönüştürüldü. Bu oran tüm atık türlerini veya bugünün her ülkesini temsil etmez. | [OECD · Global Plastics Outlook (2022), 2019 verileri](https://www.oecd.org/en/publications/global-plastics-outlook_de747aef-en/full-report/component-6.html) |
| `hiyerarsi` | Atık yönetiminde öncelik, atığın oluşmasını azaltmak ve eşyaları yeniden kullanmaktır. Geri dönüşüm ve kompostlama bunları izler; her malzeme aynı biçimde yönetilemez. | [US EPA · Materials and Waste Management Hierarchy](https://www.epa.gov/smm/sustainable-materials-management-non-hazardous-materials-and-waste-management-hierarchy) |
| `yakma` | Atıktan enerji elde etmek, atık hiyerarşisinde azaltma, yeniden kullanım ve geri dönüşümün arkasında yer alır. Enerji geri kazanımı, atık oluşumunu önlemenin yerine geçmez. | [US EPA · Energy Recovery from Combustion of MSW](https://www.epa.gov/smm/energy-recovery-combustion-municipal-solid-waste-msw) |
| `goc` | Dünya Bankası’nın 2021 Groundswell çalışması, olumsuz senaryoda altı bölgede 2050’ye kadar 216 milyon kişinin ülke içinde iklim nedeniyle göç edebileceğini öngörüyor. Bu kaçınılmaz bir sonuç değil; iklim ve kalkınma eylemleri riski azaltabilir. | [Dünya Bankası · Groundswell (2021)](https://www.worldbank.org/en/news/press-release/2021/09/13/climate-change-could-force-216-million-people-to-migrate-within-their-own-countries-by-2050) |
| `permafrost` | Kuzeydeki donmuş topraklar büyük miktarda karbon depolar. Çözülme, bu karbonun karbondioksit ve metan gibi sera gazlarıyla atmosfere geçmesine yol açabilir. | [NASA · Thawing Permafrost (2024)](https://www.nasa.gov/earth/nasa-helps-find-thawing-permafrost-adds-to-near-term-global-warming/) |
| `uyum` | Erken uyarı, yaklaşan tehlikeyi öğrenmenin yanında harekete geçmeyi de gerektirir. Hazırlık ve dayanıklı altyapı, toplulukların hava ve iklim tehlikelerine karşı korunmasına yardımcı olur. | [WMO · Weather forecasts and early warnings](https://public.wmo.int/site/science-action/weather-forecasts-and-early-warnings) |
| `gidaisraf` | UNEP’in 2024 raporuna göre gıda kaybı ve israfı, küresel sera gazı salımlarının yaklaşık %8–10’uyla ilişkilidir. Gereksiz gıda kaybını önlemek, üretim için harcanan kaynakları da korur. | [UNEP · Food Waste Index Report 2024](https://wedocs.unep.org/bitstream/handle/20.500.11822/45275/Food-Waste-Index-2024-key-messages.pdf) |

### 4.10 Ütopya ↔ distopya görsel dönüşümü
Denge düştükçe dünya kodla değişiyor:
- Gökyüzü açık maviden dumanlı turuncuya döner, güneş solar.
- Uzaktaki şehir silueti kararır, ekranın üstüne kahverengi bir atmosfer katmanı biner.
- Tavan lambaları **enerjiye** göre parlar ya da söner.
- Su tankları **suya** göre dolar ya da boşalır.
- Çöp yığını **atığa** göre büyür.
- Seradaki bitkiler gıda ve dengeye göre yeşerir ya da solar.

### 4.11 Denge simülasyonu
`tools/simulasyon.mjs` oyunu farklı oyun tarzlarıyla 4000'er kez oynatıyor. Akıllı stilde boş makinelerde oyuncu kendisi çalışır, uzmanlık yerine atama varsayılan davranış, aktif araştırma batarya → grisu sırasıyla açılır. "Ort.arş": 5 gün sonunda açılmış ortalama araştırma sayısı (en çok 2).

| Oyun tarzı | Kapı | Gerçek ütopya | Yalnız ütopya | Kapımız açıktı | Çöküş | Güven kaybı | Ort.arş |
|---|---|---|---|---|---|---|---|
| Akıllı | Herkesi al | %76 | %0 | %24 | %0 | %0 | 1.66 |
| Akıllı | Kimseyi alma | %0 | %100 | %0 | %0 | %0 | 0.00 |
| Akıllı | Yarısını al | %26 | %63 | %6 | %4 | %0 | 0.79 |
| Rastgele | Herkesi al | %1 | %0 | %95 | %0 | %4 | 1.73 |
| Rastgele | Kimseyi alma | %0 | %14 | %0 | %85 | %1 | 0.00 |
| Rastgele | Yarısını al | %1 | %5 | %31 | %60 | %3 | 0.86 |
| Kirli | Herkesi al | %0 | %0 | %58 | %0 | %42 | 1.78 |
| Kirli | Kimseyi alma | %0 | %0 | %0 | %75 | %25 | 0.00 |
| Kirli | Yarısını al | %0 | %0 | %20 | %46 | %34 | 0.88 |

(1 Kasım: kaynak maliyeti doğrulaması, gerçek kapı/hazırlık kartları sonrası; her satır 4000 oyun, toplam 36.000. Yuvarlama nedeniyle satır toplamı %100 olmayabilir. İnşaat ve keşif seçimleri bu simülasyonun stratejilerine dahil değildir.)

**Yorum:** En iyi son yalnızca hem iyi kaynak yönetimi hem de açık kapıyla mümkün. Kirli oynayan hiçbir koşulda ayakta kalamıyor. Bu, oyunun mesajını mekanikle kanıtlıyor; sunumda kullanılabilir. Araştırma yalnızca kapı açıkken açılıyor: Dr. Leyla gelirse laboratuvara giriyor, kuruculardan laba giden yok. Yani kapıyı kapatan oyuncu Faz 1 teknolojilerine erişemiyor; bu, "paylaşım = ilerleme" mesajını mekanik olarak güçlendiriyor.


### 4.12 Ayar değerleri (`src/state.js` → `AYAR`)
```js
{
  "maxGun": 5,
  "eylemHakki": 3,
  "baslangicNufus": 4,
  "gunSonuDegisim": {
    "enerji": -21,
    "su": -9,
    "gida": -9,
    "atik": 15,
    "karbon": -3
  },
  "kisiBasiTuketim": {
    "su": -2,
    "gida": -2
  },
  "ziyaretciBaslangicGunu": 2,
  "kapidaBeklemeCezasi": 8,
  "cokusEsigi": 10,
  "dengeEsigi": 60,
  "insanlikEsigi": 50,
  "baslangicInsanlik": 50
}
```

---

### 4.13 Makineler, görevler, traitler, araştırma ve batarya (GDD Faz 1)

Yaşam Alanı'ndaki **Sığınak Yönetimi** panosundan veya ekranın altındaki erişim butonlarından yönetilir. **Koloni**, **Odalar**, **Keşif**, **Araştırma** ve **İnşaat** ayrı panellerdir; üst şeritten aralarında geçilir. Sayılar `src/data/panels.js` (`makine`), `src/data/research.js` ve `src/data/visitors.js` içinde.

- **Makineler:** Enerji, Su Arıtma, Sera, Geri Dönüşüm. Her makinede **en fazla 1 operatör** çalışır. **Operatörü olmayan makine o gece üretim yapmaz.**
- **Kendin çalış:** Boş bir makinenin paneline gidip "Makinede kendin çalış" (1 eylem) dersen o makine bu gece üretir. Aynı makinede günde bir kez.
- **Görevler:** Her sakin bir makineye, **Laboratuvar**'a (+2 araştırma/gece, sınırsız kişi) ya da **Dinlen**'e atanır. Dolu makineye birini atarsan eski operatör dinlenmeye geçer. Görev değişikliği o geceden geçerlidir; +1 eylem hakkı ertesi gün.
- **Kurucular:** Selin (Enerji), Burak (Su), Nur (Sera), Can (Geri Dönüşüm). Oyun dört makine dolu başlar; biri Laboratuvar'a giderse makinesi boşalır.
- **Yeni gelenler:** Uzmanlık makinesi boşsa oraya, değilse boş bir makineye, o da yoksa Laboratuvar'a gider.
- **Uzmanlık (★):** Kişi uzmanlık yerinde çalışırsa makine üretimine ek olarak kişisel katkısını da verir.

| Kişi | Uzmanlık yeri | Güçlü yön (uzmanlık yerinde) | Koşullu bedel |
|---|---|---|---|
| Deniz | Enerji | +1 eylem hakkı | Her gece fazladan −1 gıda |
| Hasan ve Elif | Sera | Ek +5 gıda | Kuraklıkta serada −3 su |
| Dr. Leyla | Laboratuvar | 2 kat araştırma (+4), −4 karbon | Sıcak hava dalgasında verim yarıya |
| Kemal | Geri Dönüşüm | Ek −4 atık | Enerji 25 altındaysa o gece hiç üretmez |
| Sahil ailesi | Her yer | Nerede çalışırlarsa +3 gıda, +3 su | 4 kişi tüketir |
| Mert ve Ada | Çalışmaz | İnsanlık | 2 kişi tüketir |

- **Araştırma:** Aynı anda tek proje; puan Laboratuvar'dan ya da panodaki "Masa başında araştır"dan (1 eylem = +2 puan) gelir. Biri bitince diğeri aktif olur.
  - **Batarya Deposu (8 puan):** Gece 80'in üstüne çıkan enerji depoya aktarılır (en çok 30). Gece enerji düşüyorsa açık önce depodan karşılanır.
  - **Gri Su Geri Kazanımı (8 puan):** Her gece +4 su.
- Gece tahmini, sabah ekranı ve gece raporu boş makineleri, araştırma puanını ve batarya hareketini gösterir.

### 4.14 Yorgunluk (Faz 2 / M2)

Sayılar `src/state.js` → `AYAR` (`yorgunlukUyari`, `yorgunlukAyrilmaEsigi`, `yorgunlukAyrilmaPay`, `ayrilmaInsanlikCezasi`).

- Makinede ya da Laboratuvar'da çalışan sakin her gece **+1**, Dinlen'deki sakin **−2** yorgunluk alır (en az 0). Çocuklar etkilenmez.
- **4 ve üstü:** panoda sarı uyarı ("dinlenmeli").
- **5 ve üstü:** her gece ayrılma zarı. Şans = min(%100, (yorgunluk − 5 + 1) × %20); 5'te %20, 6'da %40.
- Ayrılan sakin (grup ise tüm grup) nüfustan düşer, görevi boşalır ve **−8 insanlık** verir.
- Panoda her sakinin yorgunluğu "şimdi ↑ bu gece" ve risk yüzdesiyle görünür. Gece tahmini riskli sakinleri uyarır, gece raporu ayrılanları yazar, son ekranı "Tükenip giden" sayısını gösterir.

### 4.15 Hazırlıklı olaylar (GDD Faz 2: uyarı → hazırlık → etki)

Veri: `src/data/events.js` (`uyari`, `hazirlik: { ad, carpan }`, `HAZIRLIK_MALIYETI`). Kurallar: `src/state.js` → `olayEtkisi()`, `hazirlan()`.

- Yarının olayı bugünden seçilir ve radyo/sabah ekranında **"Yarın için tahmin"** olarak gösterilir (etkileriyle). Son gün tahmin yoktur.
- Zararlı olaylarda tahminin altında bir **hazırlık eylemi** çıkar (1 eylem). Hazırlanırsan yarın olayın **kötü yöndeki** etkileri `carpan` ile çarpılır (0 = tamamen önlenir, 0.3 = %70 azalır); iyi yöndeki etkiler değişmez.
- Hazırlanılan gün radyo "Dün hazırlandığın için etkisi azaldı" der; gece tahmini ve rapor azalmış değerleri gösterir. Hazırlanınca o gece `erkenuyari` bilgi kartı çıkar (24 saatlik uyarı zararı ~%30 azaltır, Küresel Uyum Komisyonu 2019).
- Batarya Deposu enerji olaylarına karşı ikinci bir yoldur (GDD: tek bir doğru cevap olmasın).

### 4.16 Eğitici karar kartları (GDD bölüm 10)

Veri: `src/data/cards.js` (`KARTLAR`). Kurallar: `src/state.js` → `kartKontrol()`, `kartSec()`. Arayüz: sabah ekranı → "Kararı gör" → kart (seçim yapılmadan kapanmaz) → sonuç + "Biliyor muydun?".

- Koşulu sağlanan kart sabah çıkar; her kart bir oyunda bir kez, günde en fazla bir kart (listedeki sıra önceliktir).
- Aile kartının kabul/ret seçenekleri gerçek kapı kararını uygular; ziyaretçi yoksa bu kart tetiklenmez. Sel/toz kartlarındaki hazırlık seçenekleri yarının olayına gerçek hazırlık yapar.
- Seçenekler: hemen etki, "bu gece" etkisi, eylem bedeli, araştırma puanı, insanlık. Kirli seçenek kırmızı ve sahnede duman çıkarır. Açılmış araştırmaya dair seçenek gizlenir.

| Kart | Koşul | Seçenekler |
|---|---|---|
| Karanlıkta kalan koloni | Enerji < 30 | Dizel (+30 enerji, +16 karbon, kirli) · Güneş bakımı (+20 enerji, 1 eylem) · Tasarruf planı (bu gece +10 enerji) |
| Su paylaşımı | Su < 30 | Seraya öncelik (+10 gıda, −8 su) · Evsel tasarruf (bu gece +10 su) · Gri su araştırması (+3 puan) |
| Geri dönüşüm protestosu | Atık > 65 | Ayrıştır (−20 atık, 1 eylem) · Yak (−35 atık, +8 enerji, +15 karbon, kirli) · Onar (−10 atık, +5 enerji) |
| Kompost tartışması | Atık > 50 ve gıda < 40 | Kompost (+12 gıda, −12 atık) · Açık yığın (−8 atık, bu gece +6 karbon, kirli) |
| Yenilenebilir enerji sözü | Karbon > 55 | Fidan dikimi (−15 karbon, −6 su, 1 eylem) · Batarya araştırması (+3 puan) · Süre iste (−5 insanlık) |
| Yaklaşan toz fırtınası | Yarın toz | Panelleri ört (1 eylem, bu gece +12 enerji) · Batarya araştırması (+3 puan) · Tüketimi kıs (bu gece +6 enerji) |
| Alçak katı su basabilir | Yarın sel | Bariyer kur (1 eylem, bu gece +10 gıda) · Üretimi taşı (−6 gıda, bu gece +14) · Riski göze al |
| Araştırma mı tamirat mı? | Boş makine + 2. gün | Kendim onarırım (1 eylem, bu gece +5 enerji) · Araştırmaya devam (+2 puan) · Herkese tasarruf |
| Keşif ekibinin bulduğu bataryalar | Santral keşfedildi | Yeniden kullan (+12 enerji) · Araştırmada incele (+4 puan batarya) · Komşuyla takas |
| Yeni aileye yer var mı? | Gıda < 35 + 2. gün | Kabul et + tasarruf · Önce üretim artır (1 eylem) · Geri çevir |

Kartların bilgi kartları mevcut `facts.js` anahtarlarını kullanır (yeni kaynaksız iddia yok). Sayılar [DENGE TASLAĞI].

### 4.17 Keşif (GDD bölüm 8)

Veri: `src/data/exploration.js` (`KESIF_NOKTALARI`). Kurallar: `src/state.js` → `kesfeGonder()`, `kesifSansi()`, `seferSabahi()`. Arayüz: Görev Panosu → Keşif.

- Panoda bir nokta seç → kimi göndereceğini seç. Giderken **erzak** düşer; kişi sefer boyunca kolonide **çalışmaz** (makinesi boşalır), her gece **yorulur**, sahnede görünmez. Aynı anda tek sefer; her nokta bir oyunda bir kez; oyun bitmeden dönülemeyecek sefer açılmaz.
- Dönüşte (sabah, gece raporunda) başarı zarı: noktanın **uzmanı** giderse başarı kesin (★), değilse noktanın şansı. Başarısızlık nedenini anlatır (hazırlık/uzmanlık eksikliği). Kişi eski görevine döner (makinesi doluysa dinlenir).

| Nokta | Süre | Erzak | Şans | Uzman (★) | Ödül |
|---|---|---|---|---|---|
| Terk edilmiş enerji santrali | 1 gece | −4 gıda, −4 su | %65 | Enerji (Selin, Deniz) | +12 enerji, Batarya'ya +4 puan |
| Eski şehir | 2 gece | −8 gıda, −6 su | %75 | Geri Dönüşüm (Can, Kemal) | −10 atık, +8 enerji, +8 gıda |
| Komşu yerleşim | 1 gece | −3 gıda, −3 su | %85 | Herkese açık (Sahil ailesi kesin) | +10 gıda, +10 su, +5 insanlık |
| Kurumuş rezervuar | 1 gece | −4 gıda, −2 su | %70 | Su (Burak) | +8 su, Gri Su'ya +4 puan |

Simülasyon keşfi kullanmıyor (isteğe bağlı mekanik). Sayılar [DENGE TASLAĞI].

### 4.19 Üs İnşası ve Araştırma Seviye II (GDD bölüm 6 ileri + bölüm 7)

Veri: `src/data/structures.js` (`YAPILAR`), `src/data/research.js` (Seviye II araştırmalar). Kurallar: `src/state.js` → `yapiKur()`, `yapiKurabilirMi()`, `olayCarpani()`, `arastirmaSec()` (onKosul). Arayüz: Pano → "İnşa" bölümü ve kilitli araştırma göstergeleri.

**Araştırma Seviye II** (Seviye I'den en az biri bitince açılır, `onKosul`):
- 🌬️ **Verimli Türbin** (12 puan): her gece +4 enerji
- 🥬 **Hidroponik Tarım** (12 puan): her gece +3 gıda, −1 su
- 🫁 **Hava Filtresi** (12 puan): her gece −3 karbon

**İnşaat:** Aynı anda tek yapı kurulur. Eylem ve malzeme başlangıçta ödenir; yeterli kaynak yoksa başlayamaz. İnşaat 2 iş puanı ister; iş gücüne bağlı ilerler (bölüm 4.20), tamamlanana kadar bonus vermez. Son gün yeni inşaat başlatılamaz. Odalar panelinden ilgili odanın iyileştirmelerine geçilebilir. Ayrı malzeme stoğu harcanır; atıktan kazanım bölüm 4.20'de.

| Yapı | Oda | Başlangıç maliyeti | Kalıcı etki |
|---|---|---|---|
| Yalıtım Tesisi | Yaşam | 1 eylem, 6 malzeme | Sıcak hava ve toz zararı yarıya |
| Sel Bariyeri | Sera | 1 eylem, 5 malzeme | Sel zararı yarıya |
| Ek Güneş Paneli | Enerji | 2 eylem, 10 malzeme, 6 enerji; +3 karbon | Her gece +3 enerji |
| Su Geri Kazanım Hattı | Su | 1 eylem, 8 malzeme, 6 enerji | Her gece +3 su, −1 enerji |
| Onarım Tezgâhı | Geri dönüşüm | 1 eylem, 8 malzeme, 6 enerji | Her gece −3 atık |

Yapı etkisi hazırlık çarpanıyla birleşir. Gece raporunda tamamlanan inşaat bildirilir. Simülasyon yapı kurmayı seçmez; bu karar ayrı mekanik testlerinde doğrulanır.

### 4.18 Memnuniyet ve hafif siyaset (GDD bölüm 11)

Sayılar `src/state.js` → `AYAR` (`baslangicMemnuniyet`, `itirazEsigi`, `guvenOylamasiEsigi`, `guvenOylamasiGece`, `memnuniyet`). HUD'da 🙂/😐/😠 göstergesi. Gizli insanlık puanının yerine geçmez.

- **Memnuniyet (0–100, başlangıç 60)** yalnızca sürdürülebilirlik kararlarına bağlı; her gece güncellenir ve gece raporunda nedenleriyle görünür:
  - Enerji/su/gıda 20'nin altındaysa her biri −6 (karanlık, su/gıda kıtlığı)
  - Yorgunluğu 3+ olan her çalışan −2 (en fazla −6)
  - O gün kirli bir seçim yapıldıysa −3
  - Denge ≥ 70 ise +5, < 40 ise −4
  - Yarının olayına hazırlanıldıysa +3; keşif başarıyla dönerse +5
- **İtiraz kartı:** Memnuniyet 35'in altına inince "Sakinlerin itirazı" kartı çıkar (Kemal içerideyse onun ağzından; eleştirmen kötü karakter değildir). Toplantı (1 eylem, +15) · Uzlaş (herkesin yorgunluğu −2, +10, bu gece −6 enerji −4 gıda) · Kararlarımın arkasındayım (−8). Baskıcı seçenek yoktur.
- **Güven oylaması:** Memnuniyet **üst üste 2 gece** 10 veya altında kalırsa oyun "Güven oylaması" sonuyla biter. İlk gecede raporda açık uyarı çıkar.
- "Yenilenebilir enerji sözü" kartındaki "Süre iste" artık memnuniyeti düşürür (−10).

### 4.20 Üretim derinliği, konuşma ve oda rutinleri (güncel)

Önceki inşaat açıklamasındaki doğrudan atık harcama / bir gecede otomatik tamamlama davranışının yerini şu sistem aldı:
- Ayrı **malzeme** stoğu: başlangıç 8, üst sınır 100. Ayrıştırma gerçek 20 atık başına 6; onarma 10 atık başına 3 verir; eksik miktarda oransal, sıfır atıkta sıfır. Malzeme denge puanına dahil değildir.
- Yapılar **2 iş** ister. İşçi +1/gece; mühendis/tamirci +2. Oyuncu günde bir kez 1 eylemle +1 iş sağlar. İşçi kendi makinesi/laboratuvarında çalışamaz. Duraklat/iptal var; iptalde kalan iş oranına göre malzemenin yarısı döner. Tamamlanınca önceki göreve dönüş yapılır; doluysa dinlenilir.
- Oda modları: Tasarruf ×0,65 üretim, +0 yorgunluk/aşınma; Normal ×1 ve +1/+1; Yoğun ×1,6 ve +2/+2. Ek tüketimler `src/data/production.js` içinde. Aşınma 6'da %70, 10'da %40 üretim; bakım 1 eylem +2 malzeme ile −5 aşınma.
- Koloni'den veya yakında E/T ile konuşma. Seçenek → oyuncu cümlesi/Devam → sakin yanıtı/Devam → seçenekler. Moral kişi başına günde bir 1 eylemle +4 memnuniyet, −1 yorgunluk; bilgi soruları ücretsiz; dinlendirme görev değiştirir. Metinler `src/data/dialogues.js`.
- Sahne ve diyalog aynı kişi için aynı tam-boy görseli kullanır (`sakinGorselTanimi`). Özel sprite yoksa genel yer tutucu kullanılır; bazıları paylaşılır.
- NPC'ler atandıkları odanın tamamında dolaşır, assetlerden işaretlenen bitki/tank/tezgâh vb. noktalarda kısa prosedürel hareketler yapar. Veri `src/data/activities.js`, koordinatlar `docs/npc-noktalari.md`; `?npcNoktalar=1` ile işaretler görünür. Bu hareketler ekstra üretim sağlamaz.

Ayrıntılı güncel devam akışı: `docs/devralma.md`. Simülasyon normal mod stratejilerini kullanır; inşaat/keşif/yeni mod seçimi ayrıca insan playtesti gerektirir.

## 5. Teknik yapı

- **Motor:** Phaser 3.90 (2D) · **Derleme:** Vite · **Dil:** JavaScript (ES modülleri)
- **Arayüz:** Phaser canvas'ının üstünde HTML/CSS katmanı (HUD, paneller, kartlar). Tüm arayüz sahneyle birlikte ölçeklenir (CSS `cqw` birimleri).
- **Görseller:** `vite.config.js` içindeki `assetListesi` eklentisi `public/assets/`'teki dosyaları listeler (`virtual:asset-listesi` → `src/assetListesi.js`); `GameScene.preload()` ve arayüz yalnızca var olan dosyaları yükler, eksikler için istek atılmaz (konsolda 404 yok). Hedef yükseklikler: `src/data/assets.js`. Dosya yoksa `dokulariUret()` kodla çizilmiş yer tutucuyu üretir. `npm run dev` açıkken klasöre dosya eklenip silinince sayfa kendiliğinden yenilenir. Hangi görsellerin yüklendiği tarayıcı konsolunda `[asset]` satırında yazar.
- **Görüntü kalitesi:** Oyun dünyası 960×540 koordinatlıdır ama 1920×1080 tuvale kamera zoom'uyla (`CIZIM_OLCEGI = 2`) çizilir; yazılar da 2× çözünürlükte. Büyük görseller yüklenince oyundaki boylarının ~3 katına (`DOKU_PAYI`) adım adım yüksek kaliteyle küçültülür; WebGL'in büyük küçültmede yaptığı "pikselli" görüntü böylece oluşmaz. Ekrana sabit/paralaks katmanlar `ekranaSabitle()` ile eklenmelidir (zoom kaymasını düzeltir).
- **Yayın:** `main` dalına her push'ta GitHub Actions oyunu derleyip GitHub Pages'e yayınlar.

### Dosya yapısı
| Dosya | İçerik |
|---|---|
| `src/data/story.js` | Açılış hikaye ekranları |
| `src/data/panels.js` | Paneller ve eylemleri |
| `src/data/events.js` | Radyo olayları ve ilk gün mesajı |
| `src/data/visitors.js` | Kapıya gelen ziyaretçiler |
| `src/data/facts.js` | "Biliyor muydun?" bilgileri ve kaynakları |
| `src/data/rooms.js` | Odalar, pencereler, nesnelerin konumları |
| `src/data/research.js` | Araştırmalar, görevler, batarya ayarları |
| `src/state.js` | Kurallar: gece tüketimi, denge, insanlık, sonlar, `AYAR` |
| `src/scenes/GameScene.js` | Sahne kurulumu, oyuncu, etkileşim ve gün akışı |
| `src/scenes/game/*.js` | Doku, yedek çizimler, animasyon, dünya, NPC, efektler ve ortak ayarlar; ayrıntı `docs/devralma.md` |
| `src/ui/ui.js` | HUD, paneller, radyo, kapı kartı, gece raporu, hikaye, son ekranı |
| `src/style.css` | Arayüz stili |
| `tools/simulasyon.mjs` | Denge simülasyonu |
| `PROJECT_LOG.md` | Asistan için proje haritası, teknik borç listesi, **güncel asset listesi** ve değişiklik logu |
| `src/data/assets.js` | Oyuna bağlı görseller: dosya adı, hedef yükseklik, yedek |
| `tools/asset-durum.mjs` | Hangi görselin ve animasyon karesinin `public/assets/`'te hazır olduğunu gösterir |
| `src/data/animations.js` | Animasyonlar: kare sayısı, fps, döngü, ne zaman oynadığı |

### Çalıştırma
```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # dist/ klasörü (yayın için)
npm run build:tek    # dist-tek/index.html (her şey tek dosyada)
node tools/simulasyon.mjs
node tools/asset-durum.mjs   # hangi görseller hazır
```

### Sık yapılan değişiklikler
- **Sayı değiştirmek:** `src/data/*.js` ya da `AYAR`. Sonra simülasyonu çalıştırın.
- **Yeni olay:** `events.js` → `OLAYLAR` listesine `{ id, baslik, metin, anlik, gunSonu, eylem }`.
- **Yeni ziyaretçi:** `visitors.js` → `{ id, ad, ikon, kisi, metin, katkiMetni, anlik, gunlukKatki, eylemArtisi, insanlik, retCeza }`.
- **Yeni panel eylemi:** `panels.js` → `{ ad, etki, kirli, mesaj, bilgi }`. `bilgi`, `facts.js`'teki bir anahtar olmalı.
- **Yeni bilgi kartı:** `facts.js` → `BILGILER` içine `{ metin, kaynak }`.

---

## 6. Görsel üretim rehberi (AI)

### 6.1 Araçlar
- **Google Gemini (Nano Banana):** Ana araç. Ücretsiz, tarayıcıda çalışıyor. En büyük avantajı: bir görseli yükleyip "bu stilde" diyerek **tutarlı** yeni görseller üretebilmesi.
- **Leonardo.ai:** Yedek. Günlük ücretsiz kota ve ticari kullanım izni var.
- **Arka plan silme:** remove.bg ya da benzeri ücretsiz bir araç.

### 6.2 Kurallar
1. **Önce ana karakteri üretin.** Beğendiğiniz sonucu referans olarak yükleyip diğer her şeyi "same art style as the reference image" diyerek isteyin.
2. **"Transparent background" yazmayın.** Çoğu araç sahte dama deseni çiziyor. Nesneleri **düz beyaz arka planla** üretip arkayı sonra silin.
3. **Pixel art istemeyin.** AI'ın pixel art'ı düzensiz çıkıyor. Düz vektör illüstrasyon stili çok daha tutarlı.
4. **Promptlar İngilizce.** Sonuçlar daha iyi oluyor.
5. **Hepsi yandan bakış.** Nesnelerin alt kenarı zemine otursun.
6. **Promptlara gerçek oyun, marka ya da sanatçı adı yazmayın.** Sunumda görsellerin AI ile üretildiğini belirtin.
7. Büyük üretin (en az 2–3 kat), oyunda küçültülür.

### 6.3 Teslim formatı ve dosya adları

**Oyun nesneleri doğrudan oyuna girer:** dosyayı aşağıdaki adla `public/assets/` klasörüne koyun, kod değişikliği gerekmez (`npm run dev` açıksa sayfa kendiliğinden yenilenir). Boyut önemli değil; görselin **şeffaf olmayan kısmı** otomatik ölçülür, oranı korunarak "oyundaki yükseklik"e ölçeklenir ve en alt dolu satırı (ayaklar/taban) zemine oturur. Üstte/altta şeffaf boşluk kalması sorun değil; arka plan mutlaka **şeffaf** olmalı (beyaz arka plan da "dolu" sayılır). Eksik dosya yerine kodla çizilmiş yer tutucu görünür. Yükseklikler `src/data/assets.js`'ten değiştirilebilir.

| Dosya adı | Ne | Format | Oyundaki yükseklik |
|---|---|---|---|
| `oyuncu.png` | Ana karakter (sağa bakıyor) | Şeffaf PNG | 72 px |
| `panel.png` | Genel kontrol paneli | Şeffaf PNG | 100 px |
| `panel-enerji.png`, `panel-su.png`, `panel-sera.png`, `panel-geri.png` | Oda panelleri (isteğe bağlı; yoksa `panel.png`) | Şeffaf PNG | 100 px |
| `radyo.png` | Radyo + masa | Şeffaf PNG | 80 px |
| `pano.png` | Görev ve araştırma panosu (ayaklı mantar pano) | Şeffaf PNG | 110 px |
| `yatak.png` | Yatak | Şeffaf PNG | 60 px |
| `kapi.png` | Kapı | Şeffaf PNG | 120 px |
| `bitki.png`, `bitki-solgun.png` | Sera bitkisi, iki hâl (solgun isteğe bağlı; gıda/denge düşünce geçer) | Şeffaf PNG | 56 px |
| `sakin-1.png` … `sakin-4.png` | Sığınakta dolaşan sakinler (sağa bakıyor) | Şeffaf PNG | 64 px |
| `sakin-<id>.png` | **İsteğe bağlı:** belirli bir karakterin sahne görseli (`selin`, `burak`, `nur`, `can`, `muhendis`, `ciftci`, `bilim`, `cocuklar`, `tamirci`, `kafile`). Varsa o kişi genel sakin görseli yerine bununla görünür. Tarif: 6.9'daki portre tarifinin tam boy, yandan, sağa bakan hâli (stil bloğu A) | Şeffaf PNG | 64 px (çocuklar 50 px) |

**Arka planlar ve arayüz görselleri** (bunlar da `public/assets/`'e konunca oyuna girer; yoksa kodla çizilen duvar/şehir, emoji ya da düz ekran kalır):

| Dosya adı | Ne | Format | Oran / not |
|---|---|---|---|
| `oda-yasam.png`, `oda-enerji.png`, `oda-su.png`, `oda-sera.png`, `oda-geri.png` | Oda arka planları | PNG | 640×280'e gerilir (16:9 üretip kırpın). **Pencereyi şeffaf bırakın**, dışarısı görünsün |
| `manzara-iyi.png`, `manzara-kotu.png` | Şehir panoraması, iki hâl | PNG | Geniş, 470 px yüksekliğe ölçeklenir, yatayda tekrar eder (sol/sağ kenar birleşebilir olsun). Kötü hâl denge düştükçe belirir |
| `hikaye-1.png` … `hikaye-4.png` | Açılış hikaye ekranları | PNG | 16:9, kartın üstünde bant olarak |
| `ziyaretci-<id>.png` | Ziyaretçi portreleri (`muhendis`, `ciftci`, `bilim`, `cocuklar`, `tamirci`, `kafile`) | PNG | 1:1, kapı kartı + pano |
| `kurucu-<id>.png` | Kurucu portreleri (`selin`, `burak`, `nur`, `can`) | PNG | 1:1, Görev Panosu |
| `kapak.png` | Sunum kapağı (oyunda kullanılmaz) | PNG | 16:9 |

**Animasyonlar:** Kareler `public/assets/anim/<animasyon>-<kare>.png` adıyla konur (ör. `oyuncu-yuru-1.png` … `oyuncu-yuru-6.png`). Bir animasyonun **tüm kareleri** gelmeden animasyon oynamaz, nesne sabit görselle kalır. Kareler aynı boyutta olmalı ve karakter her karede aynı yerde/ölçekte durmalı. Animasyon, tüm karelerin ortak dolu alanına göre ölçeklenir; bu yüzden sabit görselle aynı boyda görünür. Hangi animasyonun kaç kare istediği: `PROJECT_LOG.md` → Asset Listesi. Üretim ipuçları: 6.11.

Kayıtlı dosya adlarıyla `public/assets/` içine konan görseller otomatik bulunur. Arayüz eşlemeleri `ARAYUZ_IKONLARI`, `KARAR_GORSELLERI`, `SON_GORSELLERI`; yeni isimler eklenirse bu kayıtları da güncelleyin. **Güncel ve tam liste (durumlarıyla): `PROJECT_LOG.md` → Asset Listesi.**

### 6.4 Stil blokları

**A. Nesne ve karakter stili** (nesne promptlarının sonuna ekleyin):
```
2D side-view game asset, flat vector illustration with soft cel shading, clean dark outlines, warm solarpunk color palette (sage green, cream, terracotta, teal), cozy eco-bunker theme, single object centered, fully visible, plain solid white background, no text, no ground shadow
```

**B. Oda arka planı stili** (oda promptlarının başına ekleyin):
```
2D side-view game background, interior cross-section of a room in an eco-bunker, back wall only, one window in the upper half, empty floor in the foreground with no furniture in front, flat vector illustration with soft shading, warm solarpunk palette, no characters, no text,
```

**C. Portre stili** (ziyaretçi promptlarının sonuna ekleyin):
```
head and shoulders portrait, facing the viewer at a slight angle, tired but hopeful expression, dusty travel-worn clothes, flat vector illustration with soft cel shading, clean dark outlines, warm solarpunk color palette, plain soft beige background, square format, no text
```

**D. Sahne/illüstrasyon stili** (hikaye ekranları ve kapak için sona ekleyin):
```
wide cinematic 16:9 illustration, flat vector style with soft shading, clean shapes, muted atmospheric colors, no text, no logos
```

### 6.5 Oyun nesneleri (stil bloğu A ile)

**Karakter → `oyuncu.png`**
```
A young caretaker character in a dark-blue work jumpsuit with a light green stripe across the chest, short brown hair, simple friendly proportions, full body, side view facing right, standing idle pose,
```

**Görev panosu → `pano.png`**
```
A free-standing cork notice board on two wooden legs, pinned paper notes and a small green task list, red push pins,
```

**Kontrol paneli → `panel.png`**
```
A standing retro-futuristic control console, metal casing, small green glowing screen showing simple bar graphs, three round buttons (red, yellow, green), a few cables at the bottom,
```
Oda varyasyonları (isteğe bağlı, aynı promptun sonuna):
- Enerji: `...with a small solar panel icon and battery gauge`
- Su: `...with water pipes and a blue gauge`
- Sera: `...with a small plant growing on top`
- Geri dönüşüm: `...with a recycling chute`

**Radyo → `radyo.png`**
```
An old vintage red radio with a round speaker and a small antenna, standing on a small wooden side table,
```

**Yatak → `yatak.png`**
```
A simple low single bed with a wooden frame, blue blanket and white pillow, side view,
```

**Kapı → `kapi.png`**
```
A heavy reinforced bunker door seen from the front, wood panels with metal frame and rivets, round brass handle,
```

**Bitki → `bitki.png` ve `bitki-solgun.png`**
```
A small leafy vegetable seedling in a terracotta pot, healthy and bright green,
```
```
The same seedling in a terracotta pot, wilted and dry, brown drooping leaves,
```

**Sakinler → `sakin-1.png` … `sakin-4.png`** (isteğe bağlı)
```
A shelter resident in simple patched work clothes, full body, side view facing right, standing idle pose, [her biri için farklı: an old man with a cane / a young woman with a scarf / a middle-aged man with an apron / a teenage girl with a cap],
```

### 6.6 Oda arka planları (stil bloğu B + aşağıdaki detay)

**Oyunda nasıl yerleşir:** Oda genişliği (776 px) görsel oranına göre ayarlandı, görsel **kırpılmaz**; oyuncunun yürüdüğü çizgi görselin yüksekliğinin **%82**'sine (zeminin ortası) denk gelir. Nesne boyları gerçek ölçüden (1 m = 62 oyun px) hesaplanır. **Rework brifi, oda–nesne listesi ve hazır promptlar: bölüm 6.12.** Duvara yaslanan nesneler (paneller, pano, radyo, kapı) **duvar–zemin çizgisine (%74,5)** basar ve %90 boyuta küçülür. Odaya özel yerleşim `src/data/rooms.js` → `gorsel` (nesne x'leri, görselde çizili nesneler, su göstergeleri, duman noktası). Oda sınırlarını taşıyıcı kolon ve gölge örter.

**Yeniden çizim (rework) için kurallar** (odalar arası uyum ve yumuşak geçiş):
- Tüm odalarda **duvar–zemin çizgisi aynı yükseklikte** olsun (~%74–75) ve zemin malzemesi/rengi odalar arasında benzer tonda başlasın.
- Görselin sol ve sağ **%4**'ünü sade kolon/duvar bırakın (oda sınırı kolonu biner); komşu odayla birleşen kenarlar aynı ışıkta olsun.
- Oyunun kendi nesnelerinin duracağı yerleri **boş duvar** bırakın: Yaşam (kapı ~%15, radyo ~%27, pano ~%76), diğer odalarda kontrol paneli (Enerji ~%62, Su ~%66, Sera ~%85, Geri ~%50). Yaşam alanındaki yatak görselde kalabilir (oyun onu kullanıyor).
- Işık yönü tüm odalarda aynı olsun (şu an soldan-üstten sıcak ışık).
- Pencere camını şeffaf bırakırsanız dış dünyadaki ütopya/distopya değişimi pencereden görünür.
Üretimden sonra pencere camı kısmını silip **şeffaf** bırakın: oyunda pencereden dışarıdaki şehir (ve ütopya/distopya değişimi) görünür. Silinmezse pencere boyalı görünür, oyun yine çalışır.
- **Yaşam Alanı → `oda-yasam.png`:** `cozy living area, a shelf with books, a framed photo, a rug`
- **Enerji → `oda-enerji.png`:** `energy room, battery racks on the back wall, cables along the ceiling`
- **Su Arıtma → `oda-su.png`:** `water treatment room, pipes and valves on the back wall, tiled walls`
- **Sera → `oda-sera.png`:** `indoor greenhouse, large window, hanging grow lights, green tiled wall`
- **Geri Dönüşüm → `oda-geri.png`:** `recycling workshop, tool wall, sorted material boxes on shelves`

### 6.7 Pencereden görünen manzara (aynı kompozisyon, iki hâl)
**İyi hâl → `manzara-iyi.png`**
```
Wide panoramic city skyline at day, futuristic eco-city with green rooftops, wind turbines and solar panels, clear blue sky, flat vector illustration, no text
```
**Kötü hâl → `manzara-kotu.png`** (ilk görseli referans olarak yükleyin)
```
The same city skyline as the reference image but collapsed: thick orange smog, dead trees, broken wind turbines, dark polluted sky
```

### 6.8 Açılış hikaye ekranları (stil bloğu D ile)
**1 · Dünya ısınıyordu → `hikaye-1.png`**
```
A sweltering city during an extreme heatwave, shimmering hot air, cracked asphalt, traffic jams and factory chimneys releasing smoke, a red-orange sky,
```
**2 · Buz çözüldü → `hikaye-2.png`**
```
A thawing Arctic permafrost cliff collapsing into the sea, ice and frozen soil breaking apart, an eerie faint green glow deep inside the exposed ice, cold blue palette,
```
**3 · Büyük Sessizlik → `hikaye-3.png`**
```
An empty abandoned city street, no people at all, weeds growing through the pavement, stopped cars covered in dust, quiet and melancholic mood, muted grey palette,
```
**4 · Yeşilvadi → `hikaye-4.png`**
```
A small eco-shelter built into a hillside at dawn, solar panels on the roof, a glowing greenhouse dome, warm lights in the windows, surrounded by dry cracked land, a hopeful mood,
```

### 6.9 Ziyaretçi portreleri (stil bloğu C ile)
**Mühendis → `ziyaretci-muhendis.png`**
```
A woman in her thirties, an energy engineer, short dark hair tied back, a scratched hard hat hanging from her backpack strap, grease marks on her cheek, a worn utility jacket with a faded lightning bolt patch,
```
**Çiftçi baba ve kızı → `ziyaretci-ciftci.png`**
```
A middle-aged farmer with a grey stubble and a sun hat standing next to his ten-year-old daughter, the girl holds a small cloth pouch of seeds with both hands, sunburnt faces, simple linen clothes,
```
**İklim bilimcisi → `ziyaretci-bilim.png`**
```
An older woman scientist in her sixties, grey hair in a bun, round glasses, holding a rolled-up bundle of technical drawings under her arm, a worn lab coat over a warm sweater,
```
**Öksüz kardeşler → `ziyaretci-cocuklar.png`**
```
Two young siblings, a boy around twelve with his arm around his younger sister around seven, oversized jackets, small backpacks, the girl holds a tattered stuffed rabbit, gentle sad but brave expressions,
```
**Tamirci → `ziyaretci-tamirci.png`**
```
A broad-shouldered man in his forties with a thick beard and a friendly smile, rolled-up sleeves, a big leather tool bag over his shoulder, a screwdriver tucked behind his ear,
```
**Sahil kasabasından aile → `ziyaretci-kafile.png`**
```
A family of four from a flooded coastal town: a mother, a father, a teenage son and a grandmother, close together, salt-stained clothes, a coiled rope and a small fishing net over the father's shoulder, a faint sea horizon blended into the background,
```

**Kurucular → `kurucu-selin.png`, `kurucu-burak.png`, `kurucu-nur.png`, `kurucu-can.png`** (sığınağın ilk sakinleri; yolculuk yorgunu değil, bakımlı iş kıyafetleri: stil bloğu C'deki `dusty travel-worn clothes` yerine `clean patched work clothes` yazın)
```
Selin: a woman in her late twenties, energy technician, short black hair, safety goggles pushed up on her forehead, a dark-blue work jumpsuit with a light green stripe,
```
```
Burak: a man in his thirties, water systems operator, neat beard, rolled-up sleeves, a blue rubber apron, a wrench in his chest pocket,
```
```
Nur: a woman in her fifties, greenhouse keeper, grey-streaked hair under a headscarf, soil on her hands, a green gardening apron with seed packets in the pocket,
```
```
Can: a young man in his early twenties, recycling workshop worker, curly hair, work gloves, a canvas vest covered with small repaired patches,
```

**Portre ipuçları:**
- Çocuklar aşırı dramatik çıkarsa sona `soft, gentle, family-friendly illustration` ekleyin.
- Kişi sayısı yanlış çıkarsa başa `exactly four people:` gibi sayı yazın.

### 6.10 Sunum kapağı → `kapak.png` (stil bloğu D ile)
```
Key art for a climate video game: a small glowing eco-bunker in the foreground, half of the background is a green utopian city, the other half is a smoggy collapsed city, dramatic split composition,
```

### 6.11 Animasyon karesi üretme ipuçları

- **Önce sabit görseli üretin** (ör. `oyuncu.png`), sonra onu referans yükleyip kareleri isteyin: `same character as the reference image, same art style, same size and proportions`.
- **Kareleri tek görselde yan yana isteyin**, sonra eşit parçalara kesin. Tek tek üretilen karelerde karakter kayar:
  ```
  sprite sheet of exactly 6 frames in a single horizontal row, walking cycle, side view facing right, same character in every frame, evenly spaced, equal frame width, feet on the same baseline, plain solid white background, no text
  ```
  Bekleme için `idle breathing animation, subtle movement, 4 frames`; çalışma için `pressing buttons on a console, 4 frames`; kapı için `heavy door opening from closed to fully open, 4 frames`; panel için `the same console with screen lights blinking in a loop, only the lights change, 3 frames`.
- Kesince her kare **aynı genişlik ve yükseklikte** olsun; alt kenardaki boşluğu tüm karelerden aynı miktar kırpın.
- Arka planı silin (6.2 kuralı), `<animasyon>-1.png`, `-2.png` … diye kaydedin.
- Kontrol: `node tools/asset-durum.mjs` eksik kare numaralarını gösterir; tarayıcı konsolundaki `[anim]` satırı kurulan animasyonları yazar.

### 6.12 Oda arka planları — rework brifi (yerleşim listesi + şablon + prompt)

**Şablon görselleri:** `docs/oda-sablonlari/sablon-<oda>.png` (1891×831). Görsel üretim aracına **referans olarak yükleyin** ve aşağıdaki promptu verin. Şablonda: kırmızı = oyunun nesnesi gelecek, **boş duvar bırakın** · yeşil = görselde **çizin** · turuncu/mavi = **boş zemin** (oyun çizer / karakterler durur) · mor kenar bantları = komşu odayla aynı sade kolon.

**Boyut — ölçekleme gerekmez:** Görsel üretim aracında en-boy oranını **21:9** seçin (yoksa en yakın geniş oran, 2,2–2,4:1 arası); çözünürlük önemli değil, oyun kendisi ölçekler. Tüm ölçüler **yüzde** olarak verilir, her çözünürlükte geçerlidir:
- duvar–zemin çizgisi yüksekliğin **%74,5**'i · yürüme çizgisi **%82** · tavan kirişi üst **%4** · kenar bantları her yanda genişliğin **%4**'ü
- ölçek: **1 m ≈ görsel yüksekliğinin %18'i** (ön zemin), duvar dibinde **%16,5**'i · 1,75 m insan ≈ yüksekliğin **%32**'si · 2,1 m kapı ≈ **%34**'ü
- Şablonlar 1891×831 (2,28:1) çizildi; 21:9'a yüklenince oranlar aynen tutar.

**Birleşik oda sürümü:** her oda için ayrıca `oda-<oda>-tam.png` üretin: aynı görsel + etkileşimli nesneler (kapı, radyo, pano, paneller) aşağıdaki konumlarda içine çizili. Oyun bunu bulursa kullanır ve nesnelerin üstüne görünmez etkileşim alanı koyar; ayrı parçalar yine yedek olarak kalır. Güncel konumlar ve tam liste: `PROJECT_LOG.md` → Asset Listesi.

#### Oda → nesne listesi (rework'te bu alanlar ayrılmalı)

| Oda | Nesne | Kim çizer | Konum (x, görsel genişliğine %) | Boyut (gen × yük) | Not |
|---|---|---|---|---|---|
| Yaşam | Kapı | Oyun (`kapi.png`) | %14 | 1,1 × 2,1 m | Duvar dibine basar; arkası boş duvar |
| Yaşam | Radyo + sehpa | Oyun (`radyo.png`) | %27 | 0,8 × 0,9 m | Boş duvar |
| Yaşam | Yatak | **Görselde çizili** | %46 | 2,0 × 0,9 m | Tek kişilik, başlık solda; oyun bununla etkileşir |
| Yaşam | Sakinlerin dinlenme alanı | — | %41–%59 | ön zemin | Zemin boş |
| Yaşam | Görev ve araştırma panosu | Oyun (`pano.png`) | %76 | 1,1 × 1,7 m | Boş duvar |
| Enerji | Dizel jeneratör | **Görselde çizili** | %4–%28 | 2,4 × 1,9 m | Bacası/egzozu tepesi ≈ (x %17, y %42): kirli eylem dumanı buradan çıkar |
| Enerji | Enerji paneli | Oyun (`panel-enerji.png`) | %60 | 0,9 × 1,5 m | Boş duvar |
| Enerji | Operatör alanı | — | %48–%72 | ön zemin | Zemin boş |
| Su | 2 büyük tank | **Görselde çizili** | %35 ve %53 | her biri 1,7 × 2,4 m | Önlerinde dikey gösterge camı **boş/düz açık gri**: x %34,5–%35,9 ve %52,1–%53,5, y %34,5–%60,5 (su seviyesini oyun çizer) |
| Su | Arıtma paneli | Oyun (`panel-su.png`) | %64 | 0,9 × 1,5 m | Boş duvar |
| Su | Operatör alanı | — | %53–%76 | ön zemin | Zemin boş |
| Sera | 7 saksılık sıra | Oyun (`bitki.png`) | %10–%61 | ön zemin, 0,7 m | Ön zemin boş (arka duvarda yükseltilmiş yatak/raf olabilir) |
| Sera | Sera paneli | Oyun (`panel-sera.png`) | %86 | 0,9 × 1,5 m | Boş duvar |
| Sera | Operatör alanı | — | %74–%82 | ön zemin | Zemin boş |
| Geri D. | Çöp yığını | Oyun (`cop-yigini.png`) | %5–%23 | ön zemin, 1,8 × 1,0 m | Ön zemin boş (arka duvarda hurda kasaları olabilir) |
| Geri D. | Geri dönüşüm paneli | Oyun (`panel-geri.png`) | %47 | 0,9 × 1,5 m | Boş duvar |
| Geri D. | Operatör alanı | — | %35–%59 | ön zemin | Zemin boş |

Bu konumlar değişirse `src/data/rooms.js` → `ODALAR[].gorsel` (oranlar) güncellenmeli.

#### Ana düzeltme promptu (her oda için; şablonu referans olarak yükleyin, sonuna oda ekini koyun)

```
Redraw this room as a 2D side-view game background that will be placed in a horizontal row of five shelter rooms. Use the attached layout template as the exact layout guide (the colored boxes and lines are guides only, do not draw them). Follow every rule strictly:

1. FORMAT: wide 21:9 aspect ratio (about 2.3:1), any resolution. All positions below are percentages of the image width and height. Straight-on orthographic cross-section of one room: back wall and floor only, viewed perfectly front-on. No perspective vanishing point, no camera tilt, no side walls, no fisheye, no foreground objects overlapping the bottom edge.

2. FLOOR LINE: the back wall meets the floor on a perfectly straight horizontal line at exactly 74.5% of the image height from the top. Below it is a flat, even floor that continues to the bottom edge. The top 4% of the height is a dark steel-and-wood ceiling beam running edge to edge.

3. SEAMLESS EDGES: the leftmost 4% and the rightmost 4% of the width are an identical plain riveted steel support column on a calm wall, with the same wall color, the same floor material and the same lighting on both sides, so this room tiles next to any other room with no visible seam. Nothing (furniture, plants, pipes, cables, light) may touch or cross these edge strips.

4. SAME WORLD IN EVERY ROOM: the floor is the same worn warm-beige concrete slabs with a thin dark drain grate line at 84% of the height in every room; the lower wall is the same weathered cream plaster with a darker skirting about 5% of the height tall; the ceiling beam is identical; the light is the same warm late-afternoon light coming from the upper left; same palette, same line weight, same level of detail.

5. REAL-WORLD SCALE: 1 meter equals 18% of the image height at the front of the floor and 16.5% at the base of the wall. A 1.75 m adult standing on the floor would be 32% of the image height; a 2.1 m door at the wall is 34% of the image height; the ceiling is about 3.4 m high. Draw every piece of furniture and machinery at true real-world size for this scale: a door is 2.1 m, a table 0.75 m, a chair seat 0.45 m, a bed 0.9 m with headboard, ceiling about 3.4 m. Nothing oversized, nothing toy-sized.

6. RESERVED EMPTY AREAS: wherever the template shows a red box, leave PLAIN EMPTY WALL down to the floor line (no furniture, no shelves, no posters, no plants, no pipes, no cast shadows). Wherever it shows an orange or blue box, leave PLAIN EMPTY FLOOR. The game draws its own objects and characters there.

7. WINDOWS: fill every window pane and every glass surface with flat solid pure magenta #FF00FF, edge to edge inside the frame, with no reflections, no curtains over the glass and no shadows on it. (It will be cut out to transparency so the dynamic outside world shows through.)

8. NO people, no animals, no text, no letters, no logos, no UI, no watermark.

9. STYLE: 2D side-view game background, interior cross-section of a room in an eco-bunker, flat vector illustration with soft cel shading, clean dark outlines, warm solarpunk color palette (sage green, cream, terracotta, teal, rusty steel), cozy, lived-in but tidy, slightly weathered.
```

#### Oda ekleri (ana promptun sonuna ekleyin)

**Yaşam Alanı → `oda-yasam.png`**
```
ROOM: cozy living area of the shelter. Leave plain empty wall at 10–18% (door goes there), 25–29% (radio side table) and 72–80% (notice board). Draw ONE single wooden bed with a blue-green blanket, headboard on the left, centered at 46% (2 m long, 0.9 m high) standing on the floor line. Keep the floor in front of the bed (41–59%) empty. Decorate only these wall ranges: 5–9% (narrow plant shelf), 30–38% (small bookshelf below 1.2 m, one window above it between 1.3 and 2.3 m height), 56–71% (wall shelf, coat hooks, a closed trunk on the floor), 82–95% (armchair and a large potted plant). Rug on the floor only under the bed.
```

**Enerji Odası → `oda-enerji.png`**
```
ROOM: energy workshop. Draw a large olive-green diesel generator on the left at 5–28% (2.4 m wide, 1.9 m high) with a vertical exhaust pipe whose top opening is at about x = 17%, y = 42% of the image. Leave plain empty wall at 56–64% (energy control panel goes there) and keep the floor at 48–72% empty. Decorate: workbench with tools and two small solar panel samples at 31–47%, a tall metal battery rack with labeled battery boxes at 74–95%, cable trays along the upper wall, one high window between 1.8 and 2.6 m height at 32–46%.
```

**Su Arıtma → `oda-su.png`**
```
ROOM: water treatment room with tiled lower walls. Draw two large riveted teal water tanks standing on short legs, centered at 35% and 53% (each 1.7 m wide, 2.4 m high). On the front of each tank draw ONE tall empty vertical sight-gauge window with a metal frame: tank 1 gauge at x 34.5–35.9%, tank 2 gauge at x 52.1–53.5%, both from y 34.5% to y 60.5%; fill the inside of both gauges with flat plain light grey (no water drawn, the game draws the water level). Leave plain empty wall at 61–68% (purification control panel) and keep the floor at 53–76% empty. Decorate: storage shelf with jars at 5–24%, a concrete basin with running water at 79–95%, pipes and valves on the upper wall connecting the tanks, one high window at 6–20%.
```

**Sera → `oda-sera.png`**
```
ROOM: indoor greenhouse inside the bunker. The back wall is a large greenhouse glass wall with steel mullions from 1.0 m height up to the ceiling; ALL glass panes flat solid magenta #FF00FF. Under the glass, against the wall: raised planting beds with tomatoes and leafy vegetables at 5–36% and slatted shelves with seedlings and grow lights at 38–70%, all below 1.0 m height. Leave the whole front floor from 8% to 63% EMPTY (the game places a row of potted plants there). Leave plain empty wall at 83–89% (greenhouse control panel) and keep the floor at 74–82% empty. Hanging vines may grow on the mullions but must not cover the reserved areas.
```

**Geri Dönüşüm → `oda-geri.png`**
```
ROOM: recycling and repair workshop. Against the back wall draw sorted scrap crates (metal, plastic, glass) at 5–22%, but keep the floor in front of them (5–23%) EMPTY (the game draws a growing junk pile there). Leave plain empty wall at 44–51% (recycling control panel) and keep the floor at 35–59% empty. Decorate: a long wooden repair workbench with a pegboard of tools at 24–42%, a recycling-symbol poster at 53–57% above 1.6 m, tall shelves with sorted bins, bottles and paper bundles at 60–95%, one high window at 6–20%.
```

**İsteğe bağlı, tek seferde 5 oda:** Araç çok geniş görsel destekliyorsa (≈11,4:1) tek panorama isteyin ("five rooms side by side in this order: living area, energy workshop, water treatment, greenhouse, recycling workshop, separated by identical steel support columns at exactly 20%, 40%, 60% and 80% of the width"), sonra 5 eşit parçaya kesin. Geçişler en pürüzsüz bu yolla olur. Kesilen parçalar 2,28:1 olur, ölçekleme gerekmez.

**Arşivdeki önceki üretim brifi (güncel eksik listesi değildir):** Oyunun son durumuna göre eksik/düzeltilecek tüm görseller (5 oda, 2 manzara, çatı, çöp yığını, oda paneli animasyonları, sakin animasyonları, isteğe bağlı karakter sprite'ları) asset sohbetine tek seferde: `docs/final-asset-promptu.md`. Sprite sheet'ler 2×2 ızgara gelir, kod tarafında karelere kesilir.

**Eski ayrı oda brifi için teslim sonrası:** ölçekleme/kırpma yapmayın; sadece magenta camları silip şeffaf yapın (remove.bg'de değil, bir görsel düzenleyicide "renk seç → sil"), dosyayı `oda-<tip>.png` adıyla `public/assets/`'e koyun. Konumlar değiştiyse `src/data/rooms.js` → `ODALAR[].gorsel` oranlarını güncelleyin.

### 6.13 Ölçek standardı (asset üretiminde tek ölçü)

Tüm nesne/karakterler **ölçek dizisi** yöntemiyle üretilir: aynı kategorideki nesneler tek görselde, tek taban çizgisinde, 1. yuvada referans oyuncu (1,75 m) ile yan yana çizilir; kesimde referansa göre gerçek boy otomatik çıkar ve `src/data/assets.js`'e metre olarak yazılır. Oyun tek ölçek kullanır: `PX_METRE` (oda görsellerinden kalibre, şu an 74 px/m ön zeminde; duvar dibinde ×0,9). Ayrıntı, kurallar, prompt: `docs/olcek-standardi.md`; şablon: `docs/olcek-sablonu.png`.

---

### 6.14 Mevcut mockup’lardan bağımsız UI parçaları

Dört konsol ve altı yönetim bölümü aynı bağımsız UI parçalarını paylaşır. Yeni resim üretimi gerekmez: `python3 tools/asset-parcala.py` mevcut kaynak mockup’tan parçaları keser. Kesim tarifleri `src/data/arayuz-parcalari.json`, kullanım `docs/asset-parcalari.md` içinde. Dosyalar: `ui-panel-cerceve.png` (512×512, 64 px 9-dilim, orta saydam), `ui-panel-metal.jpg` (330×104, yazısız tekrarlanan doku), `ui-dugme-cerceve.png` (215×80, 18 px 9-dilim, orta saydam), `ui-bakim.png` (88×78), `ui-oda-sera.png` (634×162), `ui-oda-geri.png` (630×116). Eklenme: 2026-11-01.

Yenileme gerekirse prompt: “Match the existing Son Denge console illustration exactly. Deliver only the requested independent component, no surrounding screen, no text or numbers. Preserve worn brass, olive painted metal, warm upper-left light and dark umber outlines. Frame/button: transparent centre, continuous border, corners contained within the specified nine-slice margins. Texture: seamlessly tileable, low contrast. Room scene: opaque illustration, no UI labels or values.” Kesim kaynağında gizli kalan/eksik çizim varsa otomatik kırpma onu geri getirmez; o parça ayrıca üretilmelidir.


### 6.15 Doğrudan üretilmiş eksik setler (1 Kasım 2026)

Yerleşik `image_gen` ile eksik ikonlar, harita/sığınak işareti, genel sakin-1/3 kareleri ve 10 karakterin eksik tam boy/animasyon parçaları üretildi. Mevcut portre ve hazır rozetler korunur. Tam prompt ve referans kayıtları `docs/karakter-uretim-istekleri.json`, ikon/harita prompt seti `docs/ai-asset-uretim.md`, eşleştirme `docs/karakter-setleri.md` içindedir. Yerleşik araç gerçek şeffaf alfa destekler; bu yolda beyaz arka plan silme gerekmez. Kareler 512×512, ortak taban 480 px; ikonlar/harita işareti 256×256, oyuncu portresi 512×512. Kare adı `anim/sakin-<id>-bekle-1..2.png`, `anim/sakin-<id>-yuru-1..4.png`; statik `sakin-<id>.png`. Küçük rozet 128×128, mevcut portreden kesilir. Sakinlerin grupları korunur (2 çiftçi, 2 çocuk, 4 kişilik aile). Hazır bir parçayı yenilemeden önce `node tools/karakter-setleri.mjs --kontrol` çalıştırın; yalnız eksikleri üretin.

Kullanıcının Apoclimate logosu yeniden üretilmez: kaynak `public/assets/Apoclimate Metalik Logo.png`, oyun kopyası `logo-apoclimate.png`, tarayıcı simgesi `favicon.png`. Kaynak korunur; logo gibi markalı görseller "yazısız asset" kuralının bilinçli istisnasıdır.

## 7. Sunum notları

**Ana mesaj:** "Ütopya ancak hem sürdürülebilir hem paylaşılan olduğunda gerçek olur."

**Kriterlere göre anlatılacaklar:**
- **Odak tema:** Her mekanik bir iklim konusuna bağlı (bölüm 1'deki odak alanları eşleşmesi). Hikaye, iklim değişikliğinin zincirleme sonuçlarını anlatıyor.
- **Yaratıcılık / özgünlük:** İklim yönetimini ahlaki kararla birleştiren iki eksenli son sistemi. "Yalnız ütopya" sonu: kaynakları kurtarıp insanları terk etmek de bir başarısızlık.
- **Oyun tasarımı:** Kirli/temiz seçenek ikilemi, kişi başı tüketim, ziyaretçi katkıları. Simülasyon tablosu (4.11) mekaniğin mesajı gerçekten taşıdığını kanıtlıyor.
- **Eğitim değeri:** Kaynaklı "Biliyor muydun?" kartları, oyuncunun kendi seçimine bağlı olarak çıkıyor.
- **Oynanabilirlik / teknik işlevsellik:** Tarayıcıda tek linkle açılıyor, kurulum yok. Veri odaklı mimari sayesinde içerik kolayca genişletilebiliyor.
- **Zaman yönetimi / takım:** Kim ne yaptı, nasıl bölüşüldü.

**Demo akışı önerisi (2–3 dakika):**
1. Hikaye ekranlarını hızlıca göster.
2. Bir panelde temiz bir eylem, sonra dizel jeneratör: göstergelerin ve gökyüzünün değiştiğini göster.
3. Kapıya git, ziyaretçi kartını aç, içeri al: sakinlerin çoğaldığını göster.
4. Günü bitir: gece raporu ve "Biliyor muydun?" kartı.
5. Son ekranlarından birini göster (önceden ekran görüntüsü alınabilir).

**Hak ve şeffaflık:** Görsellerin AI ile üretildiğini, No, I'm Not a Human'dan yalnızca yapı olarak ilham alındığını ve bilgi kartlarındaki kaynakları belirtin.

**Gelecek planı (sunum için):** Daha fazla gün ve olay, iklim bölgelerine göre farklı sığınaklar, ses ve müzik, sığınağı genişletme, mobil destek.

---

## 8. Yapılacaklar

- [ ] Kalan 2 sakin animasyon seti ve 9 portre yenilemesini üret; 10 özel sakin sprite'ı isteğe bağlı (`docs/asset-promptu.md`)
- [x] Mevcut oyun ve arayüz assetlerini bağla; eksik/yenilenecek dosyalar `docs/asset-listesi.md`'de
- [ ] "Biliyor muydun?" rakamlarını kaynaklarından kontrol et
- [ ] Oyunun ve şehrin adını kesinleştir
- [ ] Oyunu farklı tarzlarla oynayıp test et (temiz, kirli, herkesi al, kimseyi alma)
- [ ] (İsteğe bağlı) Ses: ortam sesi, kapı çalma, radyo cızırtısı, panel tıklaması
- [ ] Sunumu organizasyonun şablonuyla hazırla, demo linkini ve ekran görüntülerini ekle
- [ ] 1 Kasım 23:59'dan önce formu doldur

---

## 9. Sözlük

- **Yeşilvadi:** Büyük Sessizlik'ten sonra kurulan ütopya sığınağı. Oyunun geçtiği yer.
- **Büyük Sessizlik:** Kurmaca gelecekte afet ve tedarik kesintileriyle üretim merkezlerinin sustuğu, yerleşimlerin boşaldığı dönem (2050'ler).
- **Denge:** 0–100 arası ütopya/distopya göstergesi. Kaynakların ağırlıklı ortalaması.
- **İnsanlık:** Oyuncuya gizli 0–100 puan. Kapı kararlarına göre değişir, sonu belirler.
- **Eylem hakkı:** Günlük panel işlemi sayısı (3, mühendis içeri alınırsa 4).
- **Kirli eylem:** Hızlı sonuç veren ama karbon salan seçenek (dizel jeneratör, atık yakma).
- **Ziyaretçi:** Kapıya gelen iklim göçmeni ya da göçmen grubu.

### 4.21 Güncel ilerleme paketi (1 Kasım 2026)

Aşamalı keşif ve pompa planı → yağmur suyu araştırması → depo; dinlenme sözü hafızası; hava/üretim modu etkileri; ayrı Hedefler paneli ve gün başı localStorage kaydı eklendi. Kurallar ve test sınırları `docs/devralma.md` son bölümde. Hackathon kriter değerlendirmesi: `docs/hackathon-uyum-analizi.md`. Yeni regresyon: `tools/ilerleme-test.mjs` (`npm test` içinde). Güncel otomatik simülasyonda akıllı/hepsini al gerçek ütopya yaklaşık %74; yeni seçimlerin bütün kombinasyonlarını kapsamaz.

### 4.22 Sahne modülleri (1 Kasım 2026)

GameScene 362 satırdır; çizim/doku/animasyon/NPC/efekt yöntemleri `src/scenes/game/` altına taşındı. Güncel yöntem sahipleri PROJECT_LOG Project Map'te, bağlam/ömür sözleşmesi `docs/devralma.md` → GameScene modülleri bölümünde. Sahne dışı yöntem düzenlemek için önce bu haritayı kullanın. Yöntemler GameScene prototype'ına eklenir, `this` Phaser sahnesidir; modüller ana sahneyi import etmez. Doku önbelleği restart boyunca korunur. Yeni asset veya mekanik sayı değişikliği yoktur.

### 4.23 Seçimlerin öğrenme geri bildirimi (1 Kasım 2026)

`state.kararGecmisi` başarılı panel eylemlerinin gerçek kaynak/malzeme değişimini, seçilen kartın kendi sonuç metnini, hazırlığı ve gece gerçekten çalışan makinelerin son üretim modunu saklar. İnceleme kayıtları yalnız ilk gün rehberine hizmet eder. `src/ogrenme.js` bir gece/son özeti için en çok üç kayıt seçer. Önizleme, başarısız işlem veya vazgeçilen üretim modu gerçekleşmiş tercih sayılmaz. Eski kayıtta geçmiş yoksa boş başlar; geçmiş uydurulmaz. Gece raporundaki seçim anı değişimleri gece tüketimine tekrar eklenmez. Son ekranda oyun puanı/zaman ölçeği açıklanır. `tools/ogrenme-test.mjs`, `npm test` içindedir. Bu özellik öğrenme fırsatı sağlar; öğrenme kazanımının oyuncularla ölçüldüğü iddia edilmez.
