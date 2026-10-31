# Son Denge: Proje Dokümanı

> **Takım için tek kaynak.** Bu dosyada oyunun hikayesi, tüm mekanikleri ve sayıları, teknik yapısı, görsel üretim promptları ve sunum notları var. Kendi yapay zeka asistanınıza (ChatGPT, Gemini, Claude vb.) bu dosyayı verip "bu projede bana yardım et" diyebilirsiniz.
>
> Son güncelleme: 31 Ekim 2026, 21:00 · Oyunun kodundaki sayılarla birebir aynıdır.

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
   - **Animasyon** eklendiyse `src/data/animations.js` → `ANIMASYONLAR`'a ekle (kare sayısı, fps, döngü, sahip, ne zaman) ve Asset Listesi **D** tablosuna yaz. Kare dosyaları: `anim/<animasyon>-<kare>.png`, kareler 1'den başlar.
   - Doğrudan sahnede çizilen nesne ise `src/data/assets.js` → `ASSETLER`'e de ekle (yer tutucusu `dokulariUret()`'te kalsın) ve A tablosuna yaz; değilse B ya da C tablosuna.
   - `CLAUDE.md` bölüm 6'ya görsel promptunu ekle (yoksa listede "yok, yazılacak" yaz).
   - Asset geldiğinde ya da kaldırıldığında `node tools/asset-durum.mjs` çalıştır ve Durum sütununu güncelle.

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

Oyun açılışta 4 ekranla anlatılıyor (`src/data/story.js`). "Geç" butonuyla atlanabiliyor.

- **2030'lar · Dünya ısınıyordu:** Her yaz bir öncekinden sıcaktı. Raporlar yazıldı, zirveler toplandı, uyarılar yapıldı. Ama fabrikalar çalışmaya, tüketim artmaya devam etti.
- **2040'lar · Buz çözüldü:** Kuzeyde on binlerce yıldır donmuş toprak çözülmeye başladı. Buzla birlikte, insanlığın hiç karşılaşmadığı eski bir virüs de uyandı.
- **2050'ler · Büyük Sessizlik:** Virüs birkaç yıl içinde dünya nüfusunun büyük kısmını yok etti. Şehirler boşaldı, tedarik zincirleri koptu. Hayatta kalanlara kuraklık, seller ve kıt kaynaklar kaldı.
- **2071 · Yeşilvadi:** Hayatta kalanlar aynı hatayı bir daha yapmamaya yemin etti ve Yeşilvadi'yi kurdu: her damla suyun, her kilovatın hesabının tutulduğu küçük bir ütopya. Sığınağın bakımı artık sana emanet.

**Nedensellik zinciri (sunumda vurgulanmalı):** Isınma → donmuş topraklar (permafrost) çözülüyor → içinde saklı eski bir virüs uyanıyor → "Büyük Sessizlik": nüfusun büyük kısmı yok oluyor → kaynaklar kıt, iklim felaketleri sürüyor → hayatta kalanlar Yeşilvadi'yi kuruyor.

**Gerçeklik bağı:** Permafrostun çözülmesiyle eski mikropların ortaya çıkması bilimsel olarak tartışılan gerçek bir risk. 2016'da Sibirya'da çözülen topraktaki bir rengeyiği leşinden şarbon salgını çıktı. Araştırmacılar permafrosttan on binlerce yıllık virüsleri laboratuvarda yeniden canlandırdı. Bu yüzden "bilimkurgu ama dayandığı risk gerçek" denebilir.

**Ton:** Karanlık ama umutlu. Virüs sadece arka plan; oyunun asıl konusu iklim ve kaynaklar. Salgın oyunu değil.

**İlk gün radyo mesajı:**
> "Günaydın Yeşilvadi. Bugün gökyüzü açık, rüzgar hafif. Merkez hatırlatıyor: Büyük Sessizlik'ten önceki dünya israf yüzünden çöktü. Kaynaklarınızı dengede tutun." Odaları gez ve panelleri tanı. Her gün sınırlı eylem hakkın var. Günü bitirmek için yatağa git. Yarından itibaren kapıya sığınacak yer arayanlar gelebilir. Kimi içeri alacağına sen karar vereceksin.

---

## 4. Oynanış

### 4.1 Kontroller
- **A / D** ya da **← / →**: yürü
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
Her eylem 1 eylem hakkı harcar. "Kirli" eylemler arayüzde kırmızı kenarlık ve "⚠ kirletir" etiketiyle gösterilir.

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
| 🧒 Mert ve Ada (`cocuklar`) | 2 | İki kardeş. Ailelerini salgında kaybetmişler, haftalardır yalnız yürüyorlar. | Hiçbir şey getirmiyorlar. Sadece bir gelecek. | +20 | −25 |
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
Her gece bir kart gösterilir. Öncelik sırası: o gün yapılan **kirli** seçim → o gün yapılan diğer seçimler (kapı kararı dahil) → genel bilgiler. Bir oyunda aynı kart iki kez çıkmaz. **Sunumdan önce rakamları kaynaklarından tekrar kontrol edin.**

| Anahtar | Bilgi | Kaynak |
|---|---|---|
| `fosil` | Kömür, petrol ve doğalgaz gibi fosil yakıtlar, küresel sera gazı salımlarının dörtte üçünden fazlasından ve karbondioksit salımlarının yaklaşık %90'ından sorumlu. | Birleşmiş Milletler |
| `gunes` | Güneş panellerinin üzerindeki toz ve kir verimi belirgin şekilde düşürür. Çölleşen ve tozlu bölgelerde düzenli temizlik bu yüzden kritik. | Genel bilgi |
| `ruzgar` | Rüzgar ve güneş santralleri çalışırken neredeyse hiç sera gazı salmaz. Ömürleri boyunca saldıkları gazın büyük kısmı üretim ve kurulum aşamasından gelir. | IPCC |
| `tatlisu` | Dünyadaki suyun yalnızca yaklaşık %2,5'i tatlı su ve bunun da büyük kısmı buzullarda ve yer altında. Bugün 2 milyardan fazla insan güvenli içme suyuna erişemiyor. | USGS, DSÖ / UNICEF |
| `suenerji` | Suyu arıtmak, pompalamak ve taşımak ciddi miktarda enerji gerektirir. Su tasarrufu, aynı zamanda enerji tasarrufu demektir. | Uluslararası Enerji Ajansı |
| `sulama` | Dünyada çekilen tatlı suyun yaklaşık %70'i tarımda kullanılıyor. Damla sulama gibi yöntemler aynı hasadı çok daha az suyla sağlayabilir. | FAO |
| `metan` | Çöp sahalarında çürüyen organik atık metan üretir. Metan, 20 yıllık sürede karbondioksitten yaklaşık 80 kat daha güçlü bir sera gazıdır. Kompost bu salımı büyük ölçüde önler. | IPCC, UNEP |
| `agac` | Bir ağacın tuttuğu karbon yıllar içinde artar. Yeni dikilen fidanlar ilk yıllarda az karbon tutar; bu yüzden mevcut ormanları korumak, yenilerini dikmek kadar önemlidir. | FAO |
| `plastik` | Dünyada üretilen plastik atığın yalnızca yaklaşık %9'u geri dönüştürülüyor. Geri kalanı çöp sahalarına, yakma tesislerine ya da doğaya gidiyor. | OECD |
| `hiyerarsi` | Sıfır atık yaklaşımında sıra şöyledir: önce azalt, sonra yeniden kullan ve onar, en son geri dönüştür. Onarılan bir eşya, yeniden üretilen bir eşyadan çok daha az kaynak harcar. | Sıfır Atık yaklaşımı |
| `yakma` | Atık yakmak bir miktar enerji üretse de karbondioksit ve hava kirliliğine yol açar. Atık hiyerarşisinde yakma, azaltma ve geri dönüşümden sonra gelir. | UNEP |
| `goc` | Dünya Bankası'na göre önlem alınmazsa 2050'ye kadar 216 milyon insan iklim değişikliği yüzünden kendi ülkesi içinde göç etmek zorunda kalabilir. | Dünya Bankası, Groundswell raporu |
| `permafrost` (genel) | Kuzey yarımküredeki donmuş topraklar (permafrost), atmosferdekinin yaklaşık iki katı kadar karbon tutuyor. Çözüldükçe bu karbon salınmaya başlıyor. | NASA, IPCC |
| `sibirya` (genel) | 2016'da Sibirya'da sıcak hava dalgası permafrostu çözünce, onlarca yıl önce ölmüş bir rengeyiğinden şarbon bakterisi yayıldı ve bir salgına yol açtı. | Yamal 2016 salgını haberleri (BBC, Reuters) |
| `gidaisraf` (genel) | Dünyada üretilen gıdanın yaklaşık üçte biri kayboluyor ya da israf ediliyor. Gıda israfı, küresel sera gazı salımlarının yaklaşık %8–10'undan sorumlu. | FAO, UNEP |

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
| Akıllı | Herkesi al | %72 | %0 | %28 | %0 | %0 | 1.53 |
| Akıllı | Kimseyi alma | %0 | %100 | %0 | %0 | %0 | 0.00 |
| Akıllı | Yarısını al | %14 | %72 | %5 | %9 | %0 | 0.75 |
| Rastgele | Herkesi al | %2 | %0 | %93 | %0 | %6 | 1.61 |
| Rastgele | Kimseyi alma | %0 | %13 | %0 | %84 | %3 | 0.00 |
| Rastgele | Yarısını al | %0 | %6 | %20 | %69 | %4 | 0.78 |
| Kirli | Herkesi al | %0 | %0 | %51 | %0 | %49 | 1.70 |
| Kirli | Kimseyi alma | %0 | %0 | %0 | %69 | %31 | 0.00 |
| Kirli | Yarısını al | %0 | %0 | %14 | %46 | %40 | 0.86 |

(1 Kasım, yorgunluk + hazırlıklı olaylar + karar kartları + memnuniyet sonrası. Güven kaybı: akıllı oyuncuda hiç, rastgelede nadir (%3–6), kirli oyunda sık. Akıllı stil her zararlı olaya hazırlanır ve kartta dengeyi en çok artıranı seçer; `SIM_HAZIRLIK=0 node tools/simulasyon.mjs` hazırlıksız karşılaştırma verir. Akıllı + herkesi al iyi son oranı yorgunluk ve sert olaylarla %91'den %61'e düştü, karar kartlarıyla %72'ye çıktı; dengeleme PROJECT_LOG D10/D12.)

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

Yaşam Alanı'ndaki **Görev ve Araştırma Panosu**'ndan yönetilir. Sayılar `src/data/panels.js` (`makine`), `src/data/research.js` ve `src/data/visitors.js` içinde.

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
- **3 ve üstü:** panoda sarı uyarı ("dinlenmeli").
- **4 ve üstü:** her gece ayrılma zarı. Şans = (yorgunluk − 4 + 1) × %25 (4'te %25, 5'te %50…).
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
- Seçenekler: hemen etki, "bu gece" etkisi, eylem bedeli, araştırma puanı, insanlık. Kirli seçenek kırmızı ve sahnede duman çıkarır. Açılmış araştırmaya dair seçenek gizlenir.

| Kart | Koşul | Seçenekler |
|---|---|---|
| Karanlıkta kalan koloni | Enerji < 30 | Dizel (+30 enerji, +16 karbon, kirli) · Güneş bakımı (+20 enerji, 1 eylem) · Tasarruf planı (bu gece +10 enerji) |
| Su paylaşımı | Su < 30 | Seraya öncelik (+10 gıda, −8 su) · Evsel tasarruf (bu gece +10 su) · Gri su araştırması (+3 puan) |
| Geri dönüşüm protestosu | Atık > 65 | Ayrıştır (−20 atık, 1 eylem) · Yak (−35 atık, +8 enerji, +15 karbon, kirli) · Onar (−10 atık, +5 enerji) |
| Kompost tartışması | Atık > 50 ve gıda < 40 | Kompost (+12 gıda, −12 atık) · Açık yığın (−8 atık, bu gece +6 karbon, kirli) |
| Yenilenebilir enerji sözü | Karbon > 55 | Fidan dikimi (−15 karbon, −6 su, 1 eylem) · Batarya araştırması (+3 puan) · Süre iste (−5 insanlık) |

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

## 5. Teknik yapı

- **Motor:** Phaser 3.90 (2D) · **Derleme:** Vite · **Dil:** JavaScript (ES modülleri)
- **Arayüz:** Phaser canvas'ının üstünde HTML/CSS katmanı (HUD, paneller, kartlar). Tüm arayüz sahneyle birlikte ölçeklenir (CSS `cqw` birimleri).
- **Görseller:** `GameScene.preload()` `public/assets/` içindeki dosyaları dener (liste ve hedef yükseklikler: `src/data/assets.js`). Dosya varsa o kullanılır, yoksa `dokulariUret()` kodla çizilmiş yer tutucuyu üretir. Hangi görsellerin yüklendiği tarayıcı konsolunda `[asset]` satırında yazar.
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
| `src/scenes/GameScene.js` | Phaser sahnesi: çizim, hareket, etkileşim, görsel dönüşüm, sakinler |
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

**Oyun nesneleri doğrudan oyuna girer:** dosyayı aşağıdaki adla `public/assets/` klasörüne koyun, kod değişikliği gerekmez. Boyut önemli değil; görselin **şeffaf olmayan kısmı** otomatik ölçülür, oranı korunarak "oyundaki yükseklik"e ölçeklenir ve en alt dolu satırı (ayaklar/taban) zemine oturur. Üstte/altta şeffaf boşluk kalması sorun değil; arka plan mutlaka **şeffaf** olmalı (beyaz arka plan da "dolu" sayılır). Eksik dosya yerine kodla çizilmiş yer tutucu görünür. Yükseklikler `src/data/assets.js`'ten değiştirilebilir.

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

**Arka planlar ve arayüz görselleri** (bunlar da `public/assets/`'e konunca oyuna girer; yoksa kodla çizilen duvar/şehir, emoji ya da düz ekran kalır):

| Dosya adı | Ne | Format | Oran / not |
|---|---|---|---|
| `oda-yasam.png`, `oda-enerji.png`, `oda-su.png`, `oda-sera.png`, `oda-geri.png` | Oda arka planları | PNG | 640×280'e gerilir (16:9 üretip kırpın). **Pencereyi şeffaf bırakın**, dışarısı görünsün |
| `manzara-iyi.png`, `manzara-kotu.png` | Şehir panoraması, iki hâl | PNG | Geniş, 470 px yüksekliğe ölçeklenir, yatayda tekrar eder (sol/sağ kenar birleşebilir olsun). Kötü hâl denge düştükçe belirir |
| `hikaye-1.png` … `hikaye-4.png` | Açılış hikaye ekranları | PNG | 16:9, kartın üstünde bant olarak |
| `ziyaretci-<id>.png` | Ziyaretçi portreleri (`muhendis`, `ciftci`, `bilim`, `cocuklar`, `tamirci`, `kafile`) | PNG | 1:1, kapı kartı + pano |
| `kurucu-<id>.png` | Kurucu portreleri (`selin`, `burak`, `nur`, `can`) | PNG | 1:1, Görev Panosu |
| `kapak.png` | Sunum kapağı (oyunda kullanılmaz) | PNG | 16:9 |

**Animasyonlar:** Kareler `public/assets/anim/<animasyon>-<kare>.png` adıyla konur (ör. `oyuncu-yuru-1.png` … `oyuncu-yuru-6.png`). Bir animasyonun **tüm kareleri** gelmeden animasyon oynamaz, nesne sabit görselle kalır. Kareler aynı boyutta olmalı ve karakter her karede aynı yerde/ölçekte durmalı. Animasyon, tüm karelerin ortak dolu alanına göre ölçeklenir; bu yüzden sabit görselle aynı boyda görünür. Hangi animasyonun kaç kare istediği: `PROJECT_LOG.md` → Asset Listesi → D. Üretim ipuçları: 6.11.

Oyun nesneleri için `public/assets/`'e koyup commit'lemek yeterli; diğerlerini bu isimlerle kod sorumlusuna iletin. **Güncel ve tam liste (durumlarıyla): `PROJECT_LOG.md` → Asset Listesi.**

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

---

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

- [ ] AI görsellerini üret (bölüm 6) ve kod sorumlusuna ilet
- [ ] Görselleri oyuna bağla (karakter, nesneler, odalar, portreler, hikaye ekranları)
- [ ] "Biliyor muydun?" rakamlarını kaynaklarından kontrol et
- [ ] Oyunun ve şehrin adını kesinleştir
- [ ] Oyunu farklı tarzlarla oynayıp test et (temiz, kirli, herkesi al, kimseyi alma)
- [ ] (İsteğe bağlı) Ses: ortam sesi, kapı çalma, radyo cızırtısı, panel tıklaması
- [ ] Sunumu organizasyonun şablonuyla hazırla, demo linkini ve ekran görüntülerini ekle
- [ ] 1 Kasım 23:59'dan önce formu doldur

---

## 9. Sözlük

- **Yeşilvadi:** Büyük Sessizlik'ten sonra kurulan ütopya sığınağı. Oyunun geçtiği yer.
- **Büyük Sessizlik:** Eriyen buzullardan çıkan virüsün nüfusun büyük kısmını yok ettiği dönem (2050'ler).
- **Denge:** 0–100 arası ütopya/distopya göstergesi. Kaynakların ağırlıklı ortalaması.
- **İnsanlık:** Oyuncuya gizli 0–100 puan. Kapı kararlarına göre değişir, sonu belirler.
- **Eylem hakkı:** Günlük panel işlemi sayısı (3, mühendis içeri alınırsa 4).
- **Kirli eylem:** Hızlı sonuç veren ama karbon salan seçenek (dizel jeneratör, atık yakma).
- **Ziyaretçi:** Kapıya gelen iklim göçmeni ya da göçmen grubu.
