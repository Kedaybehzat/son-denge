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

- Proje bir **hackathon oyunu**. Teslim **1 Kasım 2026 Pazar 23:59**. Zaman çok kısa, bu yüzden öneriler küçük, hızlı ve riskten uzak olmalı. Yeni büyük sistemler önerme.
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
- **Gece tüketimi:** Sabit olarak −15 enerji, −4 su, −4 gıda, +10 atık, −3 karbon. Buna ek olarak **kişi başı −2 su ve −2 gıda**. Başlangıç nüfusu 4.
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
1. gün her zaman "Sakin bir sabah" (öğretici). 2. günden itibaren aşağıdakilerden rastgele biri gelir, bir oyunda aynı olay tekrar etmez.

| Olay | Radyo metni | Hemen | O gece ek | Eylem hakkı |
|---|---|---|---|---|
| Sıcak hava dalgası | "Bugün sıcaklık 46 dereceyi bulacak. Soğutma sistemleri tam kapasite çalışıyor." | — | −10 Enerji, −5 Su | — |
| Kuraklık | "Baraj doluluk oranı yüzde 8'e geriledi. Su kullanımında tasarruf şart." | — | −12 Su | — |
| Ani sel | "Gece yağan sağanak seranın alt katını su bastı. Hasar tespit ediliyor." | −15 Gıda, +10 Atık | — | — |
| Şebeke kesintisi | "Bölge şebekesinde arıza var. Bugün sistemlerin bir kısmı devre dışı." | — | — | -1 |
| Rüzgarlı gün | "Kuvvetli rüzgar bekleniyor. Türbinler tam kapasite üretimde." | +15 Enerji | — | — |
| Toz fırtınası | "Çölleşen bölgelerden gelen toz bulutu panelleri kapladı. Güneş enerjisi üretimi düşük." | +5 Karbon | −8 Enerji | — |
| Komşu sığınaktan takas | "Doğu sığınağı fazla hasatlarını paylaştı. Ambalajlar geri dönüşüm bekliyor." | +12 Gıda, +8 Atık | — | — |

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

### 4.8 Sonlar (denge × insanlık)
| | İnsanlık ≥ 50 | İnsanlık < 50 |
|---|---|---|
| **Denge ≥ 60** | **Yeşilvadi nefes alıyor:** Kaynaklar dengede, kapı açık. "Ütopya ancak paylaşıldığında gerçek oluyor." | **Yalnız bir ütopya:** Sığınak ayakta ama dışarıdakiler terk edildi. "Sadece içeridekiler için kurulan bir dünya ne kadar ütopya sayılır?" |
| **Denge < 60** | **Kapımız açıktı:** Kimse terk edilmedi ama kaynaklar yetmedi. "Dayanışma ancak sürdürülebilir bir sistemle ayakta kalır." | **Işıklar söndü:** Kaynaklar tükendi, kapı kapalı kaldı. "Çöküş her gün verilen küçük kararlarla geldi." |

Son ekranında denge, insanlık, nüfus ve geri çevrilen kişi sayısı ile bir bilgi kartı gösterilir.

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
`tools/simulasyon.mjs` oyunu farklı oyun tarzlarıyla 4000'er kez oynatıyor:

| Oyun tarzı | Kapı | Gerçek ütopya | Yalnız ütopya | Kapımız açıktı | Çöküş |
|---|---|---|---|---|---|
| Akıllı | Herkesi al | %96 | %0 | %4 | %0 |
| Akıllı | Kimseyi alma | %0 | %100 | %0 | %0 |
| Akıllı | Yarısını al | %35 | %63 | %1 | %0 |
| Rastgele | Herkesi al | %9 | %0 | %91 | %0 |
| Rastgele | Kimseyi alma | %0 | %25 | %0 | %75 |
| Kirli | Herkesi al | %0 | %0 | %100 | %0 |
| Kirli | Kimseyi alma | %0 | %0 | %0 | %100 |

**Yorum:** En iyi son yalnızca hem iyi kaynak yönetimi hem de açık kapıyla mümkün. Kirli oynayan hiçbir koşulda ayakta kalamıyor. Bu, oyunun mesajını mekanikle kanıtlıyor; sunumda kullanılabilir.

### 4.12 Ayar değerleri (`src/state.js` → `AYAR`)
```js
{
  "maxGun": 5,
  "eylemHakki": 3,
  "baslangicNufus": 4,
  "gunSonuDegisim": {
    "enerji": -15,
    "su": -4,
    "gida": -4,
    "atik": 10,
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

## 5. Teknik yapı

- **Motor:** Phaser 3.90 (2D) · **Derleme:** Vite · **Dil:** JavaScript (ES modülleri)
- **Arayüz:** Phaser canvas'ının üstünde HTML/CSS katmanı (HUD, paneller, kartlar). Tüm arayüz sahneyle birlikte ölçeklenir (CSS `cqw` birimleri).
- **Görseller:** Şu an tüm görseller kodla çizilmiş yer tutucular (`GameScene.js` → `dokulariUret()`). AI görselleri gelince aynı isimlerle yüklenecek.
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
| `src/state.js` | Kurallar: gece tüketimi, denge, insanlık, sonlar, `AYAR` |
| `src/scenes/GameScene.js` | Phaser sahnesi: çizim, hareket, etkileşim, görsel dönüşüm, sakinler |
| `src/ui/ui.js` | HUD, paneller, radyo, kapı kartı, gece raporu, hikaye, son ekranı |
| `src/style.css` | Arayüz stili |
| `tools/simulasyon.mjs` | Denge simülasyonu |
| `PROJECT_LOG.md` | Asistan için proje haritası, değişiklik logu ve teknik borç listesi |

### Çalıştırma
```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # dist/ klasörü (yayın için)
npm run build:tek    # dist-tek/index.html (her şey tek dosyada)
node tools/simulasyon.mjs
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
| Dosya adı | Ne | Format | Oyundaki yaklaşık oran |
|---|---|---|---|
| `oyuncu.png` | Ana karakter (sağa bakıyor) | Şeffaf PNG | 32×62 |
| `panel.png` | Genel kontrol paneli | Şeffaf PNG | 70×100 |
| `panel-enerji.png`, `panel-su.png`, `panel-sera.png`, `panel-geri.png` | Oda panelleri (isteğe bağlı) | Şeffaf PNG | 70×100 |
| `radyo.png` | Radyo + masa | Şeffaf PNG | 80×80 |
| `yatak.png` | Yatak | Şeffaf PNG | 140×60 |
| `kapi.png` | Kapı | Şeffaf PNG | 60×120 |
| `bitki.png`, `bitki-solgun.png` | Sera bitkisi, iki hâl | Şeffaf PNG | 40×56 |
| `sakin-1.png` … `sakin-4.png` | Sığınakta dolaşan sakinler (isteğe bağlı) | Şeffaf PNG | 28×56 |
| `oda-yasam.png`, `oda-enerji.png`, `oda-su.png`, `oda-sera.png`, `oda-geri.png` | Oda arka planları | PNG | 640×280 (16:9 üretip kırpılır) |
| `manzara-iyi.png`, `manzara-kotu.png` | Pencereden görünen şehir | PNG | Geniş panorama |
| `hikaye-1.png` … `hikaye-4.png` | Açılış hikaye ekranları | PNG | 16:9 |
| `ziyaretci-<id>.png` | Ziyaretçi portreleri (`muhendis`, `ciftci`, `bilim`, `cocuklar`, `tamirci`, `kafile`) | PNG | Kare (1:1) |
| `kapak.png` | Sunum kapağı | PNG | 16:9 |

Görseller hazır olunca bu isimlerle kod sorumlusuna iletin.

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

**Portre ipuçları:**
- Çocuklar aşırı dramatik çıkarsa sona `soft, gentle, family-friendly illustration` ekleyin.
- Kişi sayısı yanlış çıkarsa başa `exactly four people:` gibi sayı yazın.

### 6.10 Sunum kapağı → `kapak.png` (stil bloğu D ile)
```
Key art for a climate video game: a small glowing eco-bunker in the foreground, half of the background is a green utopian city, the other half is a smoggy collapsed city, dramatic split composition,
```

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
