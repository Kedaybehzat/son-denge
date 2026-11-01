# Son Denge — Geliştirme devir rehberi

Güncel durum: 1 Kasım 2026. Son ekler: aşamalı keşif/plan zinciri, söz hafızası, hava üretimi, isteğe bağlı hedefler ve gün başı kayıt/devam. Bu belge, asset, arayüz veya mekanik geliştirmesine devam edecek ekip arkadaşı için başlangıç noktasıdır. Sayıların asıl kaynağı `src/state.js` ve `src/data/`; tarihsel log kayıtları güncel ayar yerine kullanılmamalıdır.

## Başlangıç

Node.js 22 kullanın. Repoyu aldıktan sonra:

```bash
npm ci
npm test
npm run dev
```

Terminalin verdiği adresi açın; varsayılan port 5173'tür, doluysa sonraki port seçilir. `npm run build` dağıtılacak `dist/` klasörünü üretir. `npm run build:tek` JavaScript/CSS'i birleştirir; `public/assets/` ve `public/fonts/` dosyaları yine çıktı klasöründe gereklidir. Tek başına HTML'yi göndermeyin. `main` push'u GitHub Pages yayınını tetikler.

## Belgeler ve sorumlulukları

| Dosya | Kullanımı |
|---|---|
| `PROJECT_LOG.md` | Her işe başlamadan Project Map; tamamlayınca en üste değişiklik kaydı; açık borçlar ve asset durumları |
| `CLAUDE.md` / `AGENTS.md` | Aynı proje bilgisi ve asistan kuralları; Codex `AGENTS.md` kullanır. Mekanik anlatım güncellendiğinde ikisini eş tutun |
| `docs/asset-listesi.md` | Project Log içindeki 93 satırlık asset tablosunun paylaşılabilir kopyası |
| `docs/asset-rehberi.pdf` | Güncel asset listesi, örnek görseller ve sanat stili; üreticiye gönderilebilir |
| `docs/asset-promptu.md` | Yalnız halen eksik veya yenilenecek görseller için güncel üretim promptu |
| `docs/olcek-standardi.md` | Referans karaktere göre görsel ölçeği |
| `docs/final-asset-promptu.md`, `docs/sifirdan-asset-promptu.md` | Arşiv brifleri; bugün eksik olan assetleri göstermez |

## Oyunda şu an neler var?

- Beş gün; her gün temel 3 eylem. Dört kurucu ile başlanır; dört üretim makinesi doludur. Oyuncu nüfusa dahil değildir.
- Enerji, su, gıda, atık ve karbon; denge hesabında karbon iki ağırlıklıdır. Gizli insanlık ve görünür memnuniyet farklı göstergelerdir. Dört temel son ve güven oylaması sonu vardır.
- Makine operatörleri, uzmanlık, dinlenme/yorgunluk, ziyaretçi kabul/ret, yarının olayına hazırlık, karar kartları, araştırma, batarya ve keşif işler.
- Koloni, Odalar, Keşif, Araştırma, İnşaat, Hedefler ayrı yönetim panelleridir. Ekranın altından veya yaşam odasındaki Sığınak Yönetimi panosundan açılır. Pencere açıkken oyuncu durur; NPC'ler yürümeye devam eder.
- A/D veya oklar: yürü. Shift + yön: ×1,65 koş. E: etkileşim. 1–9: üretim paneli eylemi. Esc: kapat, Enter: varsayılan buton.
- Oyuncu hızı 240 px/sn; koşu 396 px/sn. NPC hızı 85 px/sn; yol süresi mesafeden hesaplanır, animasyon hıza uyarlanır ve yürüyüşler arasında duraklar.
- Arayüz: metal/ahşap 9-dilim çerçeveler, açık zeytin kutular, yerel Nunito Sans ve Barlow Condensed fontları. Uzun pencerelerde çerçeve ve alt şerit sabit, içerik kayar.

## İnşaat ve kaynak maliyetleri

`src/data/structures.js` içinde beş yapı var: Yalıtım Tesisi, Sel Bariyeri, Ek Güneş Paneli, Su Geri Kazanım Hattı ve Onarım Tezgâhı. Her yapının `oda`, `sure`, `maliyet`, `geceEtki` / `olayAzalt` alanları bulunur.

Aynı anda tek inşaat (`state.insaat`) yürür. Malzeme atıktan ayrıdır: başlangıç 8, kapasite 100; yapı maliyeti malzeme stoğundan ödenir. Ayrıştırma 20 gerçek atık başına 6, onarım 10 gerçek atık başına 3 malzeme verir; atık yoksa kazanım yoktur. Atık, yapıya doğrudan harcanmaz.

Her yapı 2 iş puanı gerektirir. Atanan işçi gecede 1, mühendis/tamirci 2 iş sağlar; oyuncu günde bir kez 1 eylemle +1 iş ekler. İşçi/yardım yoksa ilerleme yoktur. İnşaatçı eski işinde üretim yapmaz; bitince/iptal edilince önceki işine döner, yer doluysa dinlenir. Duraklatmada ilerleme yoktur ve işçi dinlenir. İptal, kalan iş oranına göre malzemenin yarısını iade eder; enerji/eylem iade edilmez. Yapı gece tamamlanır, sonraki gün aktif olur. Son gün yeni proje açılmaz.

`kaynakYeterliMi()` enerji/su/gıda harcayan eylemleri kontrol eder. Atık/karbon temizliği, elde tam miktar olmasa da yapılabilir ve sıfırda durur. İnşaatta malzeme kontrolü ayrıca atığı da kapsar. `yeniAile` kartının kabul/ret seçenekleri gerçek ziyaretçiyi işler; sel/toz kartındaki hazırlık gerçek `state.hazirlik` alanını ayarlar.

Yorgunluk: çalışana +1/gece, dinlenene −2; uyarı 4, ayrılma eşiği 5; ayrılma olasılığı `min(1, (yorgunluk−5+1)×0.20)`. Eski loglardaki 4/%25 değerleri tarihsel verilerdir.

## Hangi geliştirme nerede?

| İş | Dosya / fonksiyon |
|---|---|
| Kaynaklar, gece hesabı, inşaat, kart uygulaması | `src/state.js`: `AYAR`, `geceHesapla`, `gunuBitir`, `kaynakYeterliMi`, `yapiKur`, `insaatGecesi`, `kartSec` |
| Eylemler / olaylar / ziyaretçiler / araştırma / yapılar / keşif | `src/data/panels.js`, `events.js`, `visitors.js`, `research.js`, `structures.js`, `exploration.js` |
| Yönetim panelleri | `src/ui/ui.js`: `YONETIM_BOLUMLERI`, `panoAc(bolum)`, `panoCiz`, `odalarHtml`, `yapilarHtml` |
| Pencereler ve sabit alt şerit | `src/ui/ui.js`: `modalAc`; `src/style.css`: `.kart-icerik`, `.kart > .alt`, `.pano-gecis` |
| Koşma / NPC | `GameScene.js`: `update`; `scenes/game/ayarlar.js`: hızlar; `scenes/game/sakinler.js`: rutin ve animasyon |
| Oda yerleşimi / ölçek | `src/data/rooms.js`: `ODALAR`, `ODA_GENISLIK=739`; `src/data/assets.js`: `PX_METRE=74` |
| Dünya assetleri / arayüz dosyaları | `src/data/assets.js`: `ASSETLER`, `ARAYUZ_IKONLARI`, `KARAR_GORSELLERI`, `SON_GORSELLERI`, `ARAYUZ_DOSYALARI` |
| Animasyon kareleri | `src/data/animations.js`: `ANIMASYONLAR`; dosyalar `public/assets/anim/<ad>-<n>.png` |

## Asset devri

93 satırın 72'si hazır, 9'u yenilenmeli, 12'si eksik. Kalanlar: `sakin-1` ve `sakin-3` için bekleme+yürüme setleri; dokuz eski stildeki portre; isteğe bağlı on özel sakin sprite'ı. Mevcut 44 arayüz görseli bağlıdır, yeniden üretilmeleri gerekmiyor. `node tools/asset-durum.mjs` diskteki dosyaları kontrol eder; sanat kalitesini veya portre yenileme gereksinimini otomatik değerlendirmez.

1. Mevcut dosyayı/kimliği tablodan seçin. Küçük harf ve tire kullanın; Türkçe karakter kullanmayın.
2. Animasyonda önceki sabit görseli referans verin; karelerde aynı boy, taban ve şeffaflık. Sakin seti 2 bekleme + 4 yürüyüş karesidir; oyun ayrı PNG kareleri yükler, ham sprite sheet yüklemez.
3. Orijinalleri `assets-orijinal/` altında yerel yedekleyin. Bu klasör git dışıdır ve başka bilgisayara push ile gitmez; gerekiyorsa ayrıca paylaşın.
4. Nesne/karakter ve animasyon karesi en fazla 600 px yüksek, portre 512×512, hikâye en fazla 1280 px geniş. Mevcut UI ikonları en fazla 256×256; çerçeve 512×512, buton 384×128, HUD kutusu 256×128. Çerçeve köşelerini koruyun; UI iç rengi CSS'ten gelir (`border-image` merkez dolgusu kullanılmaz).
5. `public/assets/` içine doğru adla koyun. Var olan kayıtlar otomatik algılanır; yeni assetlerde ilgili veri kaydını ve UI eşlemesini ekleyin. Dev sunucu dosya ekleme/silmede yeniler.
6. `node tools/asset-durum.mjs`, `npm test`, `npm run build`; tarayıcıda görünüm/animasyon kontrolü. Project Log ve asset tablosunun kopyasını birlikte güncelleyin.

PDF'i yeniden üretmek için Python 3 + Pillow gerekir: `python3 tools/rehber-uret.py`. Üretici güncel tablodan, mevcut assetlerden ve sanat stili referanslarından çalışır.

## Doğrulama ve bilinen sınırlar

```bash
npm test
node tools/asset-durum.mjs
node tools/simulasyon.mjs
npm run build
npm run build:tek
```

Mekanik testleri: yetersiz kaynakta durum değişmemesi, az kalan atığın temizlenmesi, malzeme ve tek inşaat kuralı, gece tamamlanma, reset, son gün engeli, gerçek kapı kararları ve olay hazırlığı.

Son simülasyon: 9 strateji × 4000 = 36.000 oyun; akıllı + herkesi al iyi son %76, kimseyi alma yalnız ütopya %100. Bu simülasyon inşaat veya keşif seçmez, kapsamlı oyuncu testi yerine geçmez. Denge değişince yeniden çalıştırıp CLAUDE/AGENTS tablosunu yenileyin. Hazırlıksız karşılaştırma: `SIM_HAZIRLIK=0 node tools/simulasyon.mjs`.

Tarayıcı kontrolü: başlangıç/hikâye/karar/son ekranları ve beş yönetim paneli; 1440×900 ve 900×600; oda filtresi, görev değişimi, araştırma, keşif ve inşaat. Eşit 50 ms karede yürüyüş 12 px, koşu 19,8 px olarak doğrulandı. Sürekli tarayıcı otomasyonu repoda henüz yok.

Devam edilecekler: eylemler arasındaki baskın seçimleri azaltma (güneş temizliği/türbin onarımı), beş günlük oyunda araştırma/yapı geri dönüşünü dengeleme, yorgunlukta önce verim/uyarı sonra ayrılma, inşaat/keşif stratejilerini simülasyona ekleme. Önce mevcut oyunu elle oynayıp ölçün. `PROJECT_LOG.md` içindeki D10/D12 eski karşılaştırmalar yeniden doğrulanmalı. Bilgi kartı rakamlarının kaynak doğrulaması ve oda/manzara WebP dönüşümü açık işlerdir.

## PR ve ekip akışı

Küçük, test edilebilir değişiklikler yapın; her iş sonunda kullanıcı bilgisiyle Project Log kaydı ve ilgili harita/asset güncellemesi ekleyin. Kod sorumlusu Ayberk; dalı push edip PR üzerinden birleştirin. `main` birleşmesi canlı yayını tetikler. GDD gelecekteki kapsamı anlatır; hangi parçanın gerçekten çalıştığını bu rehber, kod ve güncel testler üzerinden kontrol edin.

## Üretim modları, konuşma ve NPC rutinleri

`src/data/production.js`: tasarruf üretim ×0,65, yorgunluk/aşınma +0; normal ×1 ve +1/+1; yoğun ×1,6 ve +2/+2. Ek enerji/su/karbon etkileri makineye göre değişir. Aşınma 6'da üretim %70'e, 10'da %40'a iner. Bakım: 1 eylem +2 malzeme, −5 aşınma. Modlar Odalar ve üretim panellerinden seçilir. Denge simülasyonu normal modu kullanır; diğer modların stratejik dengesini insan playtestiyle kontrol edin.

Yakındaki sakinle E veya nesne de yakınsa T; Koloni panelinde Konuş. Akış: açılış/Devam → seçenekler → oyuncu cümlesi/Devam → sakin yanıtı/Devam → seçenekler. Oyuncu portresi sol, sakin sağ altta; yalnız konuşmacı görünür. Görev/ihtiyaç soruları ücretsiz; moral kişi başına günde bir, 1 eylem karşılığında +4 memnuniyet/−1 yorgunluk; dinlenme görevi doğrudan değiştirir. Veri `src/data/dialogues.js`; uygulama `sakinleKonus()` ve `moralVer()`.

Karakter kimliği `assets.js` içindeki `sakinGorselTanimi()` ile ortak seçilir: sahne, koloni ve diyalog aynı tam-boy görseli kullanır. Özel sakin-<id>.png varsa önceliklidir; yoksa kimliğe sabit genel sprite kullanılır. Selin ve Nur şu an aynı kadın yer tutucuyu paylaşır; benzersiz tam-boy assetler Asset Listesi'nde bekliyor. Sıralama değişince karakter tipi değişmez.

NPC'ler atandıkları odada serbest dolaşır; `src/data/activities.js` görselden işaretlenen hedefleri içerir. Serada domates/marul/biber/fide rafı, diğer odalarda tank/tezgâh/raf vb. kullanılır. Koordinat tablosu ve debug açma yöntemi `docs/npc-noktalari.md`. Sulama/onarım/inceleme hareketleri Phaser tween/Graphics ile prosedüreldir, yeni PNG yoktur. Üretim bu animasyonlardan bağımsızdır. Yeni bir oda asseti gelirse ilgili oranları yeniden kontrol edin.

`npm test` artık `tools/uretim-test.mjs` ile malzeme/mod/bakım, iş gücü/iptal, moral, karakter eşleşmesi ve faaliyet bölgesi doğrulamalarını; `tools/ses-test.mjs` ile ses yarış durumlarını da çalıştırır.

## İlerleme paketi ve devam noktaları

- `data/exploration.js`: santral/rezervuar bir geceden sonra karar bekler. Güvenli erken dönüş yarım kaynak verir, plan/araştırma vermez. Devam bir gece ve −0,15 başarı; erzak −2 su/−2 gıda ve +0,10 başarı (en çok 1). Son gün yalnız dönüş mümkündür. İnşaat işçisi sefer için önce görev değiştirmeli.
- Rezervuarın tam başarılı dönüşü `pompa` planını açar. `yagmurSuyu` araştırması 4 puan; `yagmurDeposu` 1 eylem/8 malzeme/4 enerji, 2 iş; gecelik +4 su ve kuraklık zararında yarılanma. Yeni PNG gerekmez; mevcut su ikonu kullanılır, ayrı bina görseli eklenmedi.
- Diyalogdan yarın dinlenme sözü verilir; ertesi günün gece kapanışında görev `bosta` ise tutulur. Kişisel güven +10/−12 ve memnuniyet +6/−6; ayrılmış kişi ceza yaratmaz. Kişisel güven şu an yalnız hafıza/geri bildirim, üretim katsayısı değildir.
- `data/production.js` hava etkilerini, `state.havaUretimEtkisi` koruma ve yoğun mod etkileşimini yönetir. Gece tahmini ve gerçek hesap aynı üretimi kullanır.
- `data/scenario.js`: 3. gün sonuna kadar bariyer veya komşuya 8 su/5 malzeme; isteğe bağlı, ana kazanma koşulu değil. Geri kazanım ile ikisi de yapılabilir.
- `kayit.js`: `sondenge:gun-basi:v1` localStorage kaydı; yeni oyun başlangıcı ve her sabah otomatik. Gün içi işlem kaydedilmez. Kayıt cihaz/tarayıcıya özgü; depolama engellenirse oyun sürer ama kayıt oluşmaz. Oyun bitince kayıt silinir. Devam sahneyi yeniden kurar, seri hale getirilemeyen olay/kart fonksiyonları veri tanımlarından bağlanır. Hatalı/eski kayıt açılmaz.
- `tools/ilerleme-test.mjs` yeni akışların regresyonlarını içerir. `npm test`, normal/tek build geçti; tarayıcıda kararlar, hedefler ve gün 3 devam/sahne kurma doğrulandı. 36.000 oyun simülasyonu mevcut otomatik stratejileri kapsar, yeni tüm seçim kombinasyonlarını kapsamaz; akıllı/hepsini al gerçek ütopya yaklaşık %74. Tarihsel %76 sonucu son hava modeli için kullanılmamalı.
- [Hackathon eşlemesi](hackathon-uyum-analizi.md): kullanıcının iki slaytına göre 7 odak/10 kriter; yayın/teslim/sunum henüz doğrulanmış değil. Değişiklikler yerel, bu çalışma push/merge yapmadı.

## GameScene performansı (1 Kasım 2026)

Sakin verisi eşlemesi `gorselGuncelle` ile state bildiriminde çalışır; `gorselUygula` yalnız görsel geçişi uygular. Bu yüzden yeni sakin/görev değişimlerinde state'in mevcut bildirim mekanizmasını kullanın. Yakın sakin seçimi tek geçiştir; sahnedeki sakin kaydı `id` taşır. Şehir renkleri ve etiket kutusu değişmedikçe Graphics tekrar çizilmez. İpucu zemini dışarıdan temizlenirse `etiketKutusu` önbelleğini de sıfırlayın. Shutdown, text üreticisini geri yükler ve E/T dinleyicilerini kaldırır; restart başında zaman/girdi/önbellek alanları sıfırlanır.

Chromium kontrolü: 1,7 saniyelik denge geçişinde sakin eşleme ve sabit ipucu çizimi birer çağrı; restart sonrası tek E dinleyicisi ve çalışan konuşma ipucu. FPS karşılaştırması yapılmadı. Dekor ve asset çizimleri sonraki yapısal düzenlemede `scenes/game/` altına taşındı; aşağıdaki harita günceldir.

## GameScene modülleri

Ana `src/scenes/GameScene.js` 362 satır: `create`, oyuncu, `update`, etkileşim ve gün bitirme akışı. Alt sistemler `src/scenes/game/` altında:

| Modül | Sorumluluk |
|---|---|
| `dokular.js` | Preload, küçültme, içerik kutusu, sprite ölçekleme |
| `yerTutucular.js` | Eksik assetler için kodla doku üretimi |
| `animasyonlar.js` | Animasyon karelerini yükleme, kurma ve oynatma |
| `dunya.js` | Oda/dekor, manzara, çatı ve inşa edilen yapıların çizimi |
| `sakinler.js` | UID eşleme, yürüme, oda rutinleri ve çalışma |
| `efektler.js` | Kaynak yazıları, duman, ziyaretçi, gün başlığı, atmosfer, etiket zemini |
| `ayarlar.js` | Hız, ölçek ve ortak koordinatlar |
| `dokuOnbellegi.js` | TextureManager ile restart boyunca yaşayan kümeler ve ölçümler |

Yöntem nesneleri GameScene dosyasının sonunda açık `Object.assign` ile prototype'a eklenir. Böylece Phaser callback'lerindeki `this` ve mevcut `scene.sakinTasi()` gibi çağrılar korunur; her karede bağlama/wrapper maliyeti eklenmez. Modüller GameScene'i import etmez, döngüsel sahne bağımlılığı yoktur. Modüllerdeki `this` bir Phaser GameScene'dir; `this.add`, `this.time`, `this.tweens` ve sahne verileri kullanılır. Yeni alanları `create` içinde başlatın; dinleyici/rutin temizliğini shutdown'da tutun. Doku önbelleğini sahne restart'ında temizlemeyin; dokular o sırada yaşamaya devam eder. Yeni yöntem adını diğer modüllerle çakıştırmayın.

`CIZIM_OLCEGI` asıl olarak `ayarlar.js` içindedir; mevcut `main.js` importunu bozmamak için GameScene'den yeniden export edilir. Bu refaktör davranışı ve kaynak sayılarını değiştirmez.

## İklim anlatısı ve öğrenme geri bildirimi

Açılış artık salgın yerine iklim baskısı, kaynak güvenliği ve dayanışmayı anlatır; 2071 ve önceki tarihler kurmaca senaryodur. İlk radyo/çocuk ziyaretçi anlatımı da uyumlu güncellendi. Yeni PNG yok; mevcut hikâye seti kullanılır.

- `src/ogrenme.js`: gerçek seçimden açıklama, gece için konu tekrarsız en çok 3 kayıt, sonda farklı konulardan en çok 3 gözlem.
- `state.kararGecmisi`: panel inceleme, başarılı eylem/kart/hazırlık ve gecelik üretim modu. Panel kaynak farkları **kapasite sınırından sonra** ölçülür. Kartın bilgi anahtarı eylem türü değildir: aynı `fosil` kartına süre istemek de bağlıdır; bu yüzden kartın kendi sonuç metni saklanır.
- Gece üretimi yalnız çalışan/açık makineler için kaydedilir. Mod seçip geri almak tek başına geçmiş yaratmaz. Normal mod öğrenme gözlemi olarak gösterilmez. Mevcut kayıt biçimi geçmiş alanını isteğe bağlı kabul eder; eski kayıt yüklenirse boş geçmiş başlar. İnceleme eylem hakkı harcamaz, özetlerde yer almaz.
- Rehber mevcut ilk gün radyo ve üretim paneli içinde: incele → seçim yap → salt okunur gece tahminine bak → yatakta uyu → raporu gör. Önizleme günü bitirmez, kaynak değiştirmez. Diğer günlerde rehber yok.
- Son ekranındaki açıklamalar ölçülmüş öğrenme sonucu değildir. Kaynak/karbon puanları 0–100 oyun modeli ve zaman hızlandırılmıştır.
- Bilgi kartları: birincil kaynak URL/tarih `facts.js`; düzeltme notları `docs/bilgi-kaynaklari.md`. Kaynak bağlantıları yeni sekmede açılır. Salgın kartı genel havuzdan çıkarıldı; `uyum` eklendi.
- Test: `tools/ogrenme-test.mjs` (`npm test`): hatalı eylem, gerçek kapasite farkı, kart/eylem ayrımı, mod geri alma, eski/yeni kayıt ve kaynak metadata kontrolü. Kaynak sayıları/üretim dengesi değişmedi.

## Edge / yüksek yenileme hızında performans

1 Kasım 2026 yerel optimizasyonu: `main.js` Phaser döngüsünü 60 FPS ile sınırlar (varsayılan limit yoktu); 2× tuval/netlik korunarak ek WebGL MSAA kapatılır. `powerPreference: high-performance` tarayıcıya GPU tercihi bildirir, Windows uygulama tercihini zorla değiştirmez. Modalın hareketli WebGL arkasına uyguladığı tam ekran backdrop blur kaldırılır; koyu arka plan ve çerçeve kalır. `sesler.js` üç kanallı efekt havuzlarıyla adım/tıklama başına Audio tahsisini önler. Oyun denge/hız sayıları değişmedi.

Kullanıcı raporunda 240 Hz ekran ve Edge’in AMD 610M üzerinden çizmesi görüldü; makinede ayrı NVIDIA GPU bulunması tarayıcının onu kullandığını garanti etmez. Windows uygulama bazında GPU seçimi için Microsoft’un Grafik Ayarları rehberi kullanılabilir; sistem ayarı bu çalışmada değiştirilmedi.

**Test ortamı kuralı:** Yazılımsal SwiftShader kullanan başsız tarayıcı, bu makinede yüksek CPU tüketti. Test bitince kendi tarayıcınızı `finally` ile kapatın; profilleme süresini sınırlayın. Açık bırakılan test tarayıcısı kapatıldı. WSL başsız FPS sonuçları Windows donanım FPS’si gibi sunulmamalı; kontrollü Windows karşılaştırması henüz yok. `npm test` ve iki build geçti; efekt havuzu için anlamlı regresyonlar eklendi. Yeni asset yok.
