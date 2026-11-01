# Son Denge — GameUP / COP31 tema ve kriter eşlemesi

1 Kasım 2026. Bu belge bir oyun kalitesi puanı veya jüri sonucu tahmini değildir. Dayanak: kullanıcının paylaştığı “Değerlendirme Kriterleri” ve “Proje Odak Alanları” slaytları; mevcut yerel uygulama ve testler. Resmî [GameUP sitesi](https://gameupturkiye.com/) iklim temalı takım prototipi ve COP31 bağlamını doğruluyor. Slaytlar kriter ağırlığı belirtmiyor; eşit ağırlık ya da yedi alanın tamamının zorunluluğu varsayılmadı.

## Zorunlu çerçeve

- **İklim değişikliğine odaklanma:** Kararlar enerji, su, gıda, atık ve karbonu etkiliyor. Hava, üretim ve hazırlıkla etkileşiyor. Tema oynanışın parçası; yalnız dekor değil.
- **Demo aşaması:** Yerel sürümde beş günlük oynanabilir döngü, kararlar ve sonlar var. Normal ve tek HTML build üretildi. PR #13 ve #12 main’e merge edildi; `070c7cc` için GitHub Pages yayını başarılı. Bu, organizasyon formunun teslim edildiği anlamına gelmez.
- **Teslim:** Slaytta 1 Kasım Pazar 23.59, WhatsApp formundan oyun sunumu yazıyor. Form teslimi ve sunum bu çalışma kapsamında yapılmadı; ekip kontrol etmeli. Depodaki sunum şablonu/katılım oranı bilgileri bu iki slaytta görünmüyor; organizasyon mesajından ayrıca doğrulanmalı.

## Odak alanlarının oyundaki karşılığı

| Alan | Somut karşılık | Sınır / sunumda dürüst ifade |
|---|---|---|
| Yenilenebilir enerji ve sürdürülebilirlik | Temiz üretim araştırmaları, rüzgâr/üretim etkisi, batarya; kirli hızlı enerji seçeneğinin karbon maliyeti | Enerji kaynaklarının gerçek yaşam döngüsü modellenmiyor; basitleştirilmiş karar modeli |
| Karbon ayak izi ve bilinçli tüketim | Karbon göstergesi, üretim modları, tüketim, tasarruf ve kirli seçeneklerin bedeli | Gösterge kg CO₂e değil; gerçek emisyon hesabı diye sunulmamalı |
| İklim dirençli şehirler | Tahmin/hazırlık, sel bariyeri, yalıtım, su depolama; kendi hazırlığı ile komşuya yardım arasındaki kaynak paylaşımı | Şehir ölçeğinde simülasyon yok; küçük yerleşim üzerinden uyum/dayanıklılık |
| Gıda güvenliği | Sera, nüfusun gıda ihtiyacı; sıcaklıkta su maliyeti, kuraklıkta üretim kaybı | Beslenme çeşitliliği/tedarik zinciri yok |
| Okyanuslar ve denizler | Deniz yükselmesi nedeniyle göç hikâyesi | Bağ ağırlıkla anlatısal; deniz ekosistemi mekaniği olduğu iddia edilmemeli |
| İklim değişikliği odağında eğitim | Sonucu görülen seçimler, gece raporları, bilgi kartları; keşif → teknoloji → uyum yapısı | Öğrenme fırsatı mevcut; ölçülmüş öğrenme kazanımı veya davranış değişikliği kanıtı yok |
| Sıfır atık | Gerçek atığı malzemeye çevirme, onarım ve yeniden kullanımla yapı üretme; sıfır atıktan malzeme üretilememesi | Sıfır atık yalnız geri dönüşüm değildir; azaltma/yeniden kullanım önceliği sunumda açıklanmalı |

En açık odak: kaynak tüketimi, döngüsel kullanım, gıda/su güvenliği ve iklim uyumu. Okyanus odağı zayıf kalıyor; diğer alanları güçlü göstermek için yeni bir deniz sistemi eklemek şart değil.

## On değerlendirme kriteri

| Kriter | Bugün gösterilebilecek kanıt | Kalan ihtiyaç |
|---|---|---|
| Odak tema | İklim kararları kaynaklar ve sonuçlarla doğrudan ilişkili | Demoda bir neden → karar → sonuç zinciri açık anlatılmalı |
| Takım / motivasyon | Devir rehberi ve proje günlüğü çalışma izi sağlıyor | Kim ne yaptı, neden bu sorun seçildi: ekip beyanı gerekli; koddan doğrulanamaz |
| Yaratıcılık | Sürdürülebilirlik, sakin ilişkisi ve dayanışma aynı sınırlı stokları paylaşıyor | Özellik sayısı yerine bir somut ikilem gösterilmeli |
| Özgünlük | İklim göçmenleri ve kısa koloni döngüsünün birleşimi | Kaynak yönetimi türü tanıdık; benzersizlik kanıtlanmış değil. Ayırt edici yaklaşım anlatılmalı |
| Zaman yönetimi | Çalışan sınırlı beş günlük demo ve testler | Teslim planı/iş bölümü; son saate kadar özellik eklemek yerine yayın ve sunum doğrulaması |
| Sunum | Oynanabilir örnekler ve bu eşleme hazır | Son sunum dosyası, akış ve teslim kanıtı henüz yok |
| Etkili iletişim | Türkçe açıklamalar, tahmin ve gece raporları | Yeni oyuncu ekran kalabalığında ana ikilemi bulabiliyor mu? Kısa gözlem testi gerekir |
| Oyun tasarımı | Üretim → tüketim → aşınma/bakım; keşif → plan → araştırma → inşaat döngüleri | Sunumda bu döngülerin öğrettiği iklim ilişkisi açıklanmalı |
| Oynanabilirlik | Tarayıcıda karar, diyalog, inşaat, kayıt/devam akışları doğrulandı | İlk kez oynayanın öğreticisiz deneyimi ve teslim cihazında tam oyun testi |
| Teknik işlevsellik | Mekanik/üretim/ilerleme/ses testleri, iki build ve tarayıcı testi geçti | Güncel sürüm Pages’e yayınlandı; farklı tarayıcı ve teslim cihazında son kontrol gerekli |

## Eğitim anlatımında kritik ayrım

Oyuncunun kaynağı artırması tek başına iklimi öğrendiğini göstermez. Savunulabilir üç hedef: (1) kısa vadeli kirli üretimin karbon bedelini açıklayabilmek, (2) kuraklık/sıcaklığa karşı su ve üretim kararını gerekçelendirmek, (3) onarım ve yeniden kullanımın yeni kaynak ihtiyacını azaltmasını fark etmek. İki farklı kararı aynı durumdan gösterip sonuçlarını karşılaştırmak, yalnız bilgi kartı okumaktan daha net kanıt sunar. Birkaç yeni oyuncuya oyun öncesi/sonrası kısa soru sorulabilir; henüz yapılmış gibi raporlanmamalı.

2071 ve Büyük Sessizlik kurmaca bağlamdır. Önceki donmuş toprak/patojen anlatısı kullanıcı onayıyla açılıştan çıkarıldı; yeni senaryo da gerçek bir gelecek tahmini diye sunulmamalı. Karbon puanı ve hava çarpanları pedagojik oyun değerleridir; bilimsel ölçüm değildir. Yeni hava etkileri radyo olayının genel zararından ayrı, çalışan makineye uygulanır; arayüz bunu gösterir.

## Sunuma önerilen kısa akış

1. Sorun: İklim baskısı altında su/gıda/enerji güvenliği ve adil kaynak paylaşımı.
2. Oyuncu kararı: Yoğun üretim mi tasarruf mu; kendi bariyerin mi komşunun su hattı mı?
3. Sonuç: Aynı gece kaynak, karbon, aşınma ve topluluk etkisini göster.
4. Uyum örneği: Rezervuar keşfi → pompa çizimi → araştırma → yağmur suyu deposu.
5. Öğrenme hedefi ve basitleştirmenin sınırı; ekip rolleri ve çalışan demo bağlantısı.

**Yargı:** İklim odaklı oynanabilir prototip çerçevesine içerik açısından güçlü bir uyum var. En büyük açık yeni mekanik eksikliği değil; eğitim kazanımını, takım sürecini ve teslim/sunum kanıtını görünür kılmak. Bu değerlendirme resmî uygunluk onayı değildir.

## Yayın sonrası önceliklendirme — 1 Kasım 2026

Bu bölümdeki beş öneri daha sonra kullanıcı onayıyla uygulandı; aşağıdaki gerekçeler tasarım kararını açıklar. Güncel uygulama durumu belgenin sonundadır. Değerlendirme, kullanıcı slaytlarındaki odak tema/eğitim/etkili iletişim kriterlerini mevcut kodla karşılaştırır; jüri puanı tahmini değildir.

1. **Açılıştaki ana nedeni görünür kıl:** `story.js` girişinde dört ekranın ikisi virüs ve nüfus kaybına ayrılıyor. Bu, oyuncunun oyunu salgın sonrası hayatta kalma olarak yorumlaması riskini doğuruyor. Kuraklık, aşırı hava olayları, su/gıda baskısı ve dayanışmayı girişin merkezine almak; virüsü koruyacaksak kısa kurmaca arka planına çekmek tema odağını güçlendirir. Bu bir anlatım değerlendirmesidir, patojenler hakkında yeni bilimsel iddia değildir.
2. **Karar → sonuç → iklim ilişkisi:** Gece raporuna gerçekten yapılan bir seçimden kısa açıklama eklenmesi önerilir. Örneğin jeneratör enerji açığını kapattı ama karbon puanını artırdı; panel bakımı daha az hızlı enerji sağladı. Ham toplamlar, tek başına hangi seçimin hangi bedeli yarattığını öğretmeyebilir. Bilgi kartlarıyla bağlantı kurulmalı; varsayımsal alternatif sonuç hesaplanmamışsa gerçek ölçüm gibi yazılmamalı.
3. **Son ekranında kişisel öğrenme özeti:** Şu an son ekranı toplam istatistik + bir bilgi kartı gösteriyor. Kayıtlı gerçek kararlardan üretilecek 2–3 gözlem önerilir: kirli enerji kullanımı, geri kazanım, hazırlık/uyum tercihi. Önce eylem geçmişi tutulması gerekir; `bugunBilgi` her gün sıfırlanır, `gosterilenBilgiler` ise eylem sayacı değildir. Tarihsel veriden yapılmamış eylem uydurulmamalı.
4. **İlk gün için kısa yönlendirme:** Bir makineyi incele, gece tahminine bak, bir tercih yap, sonucunu gör. Yeni modal/panel sayısını artırmadan mevcut akışı işaretlemek, altı yönetim paneli arasında amaç kaybını azaltabilir.
5. **Bilgi kartlarının kaynak doğrulaması:** Mevcut kurum isimleri tıklanabilir kaynakça değildir. Birincil sayfa/rapor, kapsam ve tarih doğrulaması yapılmalı; doğrulanmadan sayısal iddialar sunumda kanıt diye kullanılmamalı. Bu turda bilimsel rakamların doğrulaması yapılmadı.

İlk üç adım önceliklidir. Hedeflenen öğrenme: kısa vadeli üretimin çevresel bedelini, iklim etkilerine hazırlanmanın değerini ve yeniden kullanımın kaynak baskısını nasıl azalttığını oyuncunun kendi kararıyla açıklayabilmesi. Bu hedef henüz kullanıcı testiyle doğrulanmadı.

Sunumun tek cümlesi için öneri: “Son Denge, iklim baskısı altındaki bir toplulukta enerji, su ve gıdayı yönetirken sürdürülebilirlik ile dayanışmanın birlikte düşünülmesini sağlayan kısa bir karar oyunudur.” Ana vurgu kaynak yönetimi üzerinden iklim uyumu ve emisyon azaltımı olabilir. Okyanus mekaniği veya COP31 logosu eklemek için yeni kapsam açmak gerekli görülmedi; slaytta bütün alanları kapsama zorunluluğu yazmıyor.

## Öğrenme adımları uygulandı — 1 Kasım 2026

Açılışın virüs odağı kaldırıldı; Büyük Sessizlik kurmaca afet/tedarik kesintileri dönemi olarak yeniden anlatıldı. Gece raporu ile son ekranına gerçek tercihlerden açıklamalar eklendi. Geçmiş; eylem/kart/hazırlık ve gecelik son üretim modunu saklar; önizleme veya başarısız eylemden sonuç üretilmez. İlk gün mevcut radyo/üretim panelleri üzerinden kısa rehber ve salt okunur tahmin var. Kaynaklar `docs/bilgi-kaynaklari.md` içinde; 18 kart birincil adreslerle kapsam/tarih bakımından eşleştirildi. Salgın genel kartı yerine iklim uyumu kartı kullanılır.

Testler ve iki build geçti; tarayıcıda açılış, rehberin kaynak/eylem harcamaması, gerçek +5 enerji kapasite farkını gösteren rapor, kaynak bağlantısı ve kişisel son özeti doğrulandı. 1440×900 ve 900×600 rehber yatay taşma kontrolü geçti. İnsanlarla öğrenme testi hâlâ yapılmadı. Bu son ekler henüz yayınlanmadı; önceki sürümün PR #12/#13 yayınıyla karıştırılmamalı.
