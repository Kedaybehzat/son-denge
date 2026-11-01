# Son Denge — Geliştirme devir rehberi

Güncel durum: 1 Kasım 2026. Bu belge, asset, arayüz veya mekanik geliştirmesine devam edecek ekip arkadaşı için başlangıç noktasıdır. Sayıların asıl kaynağı `src/state.js` ve `src/data/`; tarihsel log kayıtları güncel ayar yerine kullanılmamalıdır.

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
| `docs/asset-listesi.md` | Project Log içindeki 92 satırlık asset tablosunun paylaşılabilir kopyası |
| `docs/asset-rehberi.pdf` | Güncel asset listesi, örnek görseller ve sanat stili; üreticiye gönderilebilir |
| `docs/asset-promptu.md` | Yalnız halen eksik veya yenilenecek görseller için güncel üretim promptu |
| `docs/olcek-standardi.md` | Referans karaktere göre görsel ölçeği |
| `docs/final-asset-promptu.md`, `docs/sifirdan-asset-promptu.md` | Arşiv brifleri; bugün eksik olan assetleri göstermez |

## Oyunda şu an neler var?

- Beş gün; her gün temel 3 eylem. Dört kurucu ile başlanır; dört üretim makinesi doludur. Oyuncu nüfusa dahil değildir.
- Enerji, su, gıda, atık ve karbon; denge hesabında karbon iki ağırlıklıdır. Gizli insanlık ve görünür memnuniyet farklı göstergelerdir. Dört temel son ve güven oylaması sonu vardır.
- Makine operatörleri, uzmanlık, dinlenme/yorgunluk, ziyaretçi kabul/ret, yarının olayına hazırlık, karar kartları, araştırma, batarya ve keşif işler.
- Koloni, Odalar, Keşif, Araştırma, İnşaat ayrı yönetim panelleridir. Ekranın altından veya yaşam odasındaki Sığınak Yönetimi panosundan açılır. Pencere açıkken oyuncu durur; NPC'ler yürümeye devam eder.
- A/D veya oklar: yürü. Shift + yön: ×1,65 koş. E: etkileşim. 1–9: üretim paneli eylemi. Esc: kapat, Enter: varsayılan buton.
- Oyuncu hızı 240 px/sn; koşu 396 px/sn. NPC hızı 85 px/sn; yol süresi mesafeden hesaplanır, animasyon hıza uyarlanır ve yürüyüşler arasında duraklar.
- Arayüz: metal/ahşap 9-dilim çerçeveler, açık zeytin kutular, yerel Nunito Sans ve Barlow Condensed fontları. Uzun pencerelerde çerçeve ve alt şerit sabit, içerik kayar.

## İnşaat ve kaynak maliyetleri

`src/data/structures.js` içinde beş yapı var: Yalıtım Tesisi, Sel Bariyeri, Ek Güneş Paneli, Su Geri Kazanım Hattı ve Onarım Tezgâhı. Her yapının `oda`, `sure`, `maliyet`, `geceEtki` / `olayAzalt` alanları bulunur.

Aynı anda tek inşaat (`state.insaat`) yürür. Eylem ve kaynaklar başta ödenir; yapı bir gece sonra `state.yapilar` listesine geçer. O gece henüz üretim yapmaz, sonraki gün aktif olur; tamamlanma gece raporunda gösterilir. Son gün yeni inşaat başlatılmaz. Atık burada geri kazanılabilir malzemedir; negatif atık maliyeti gerçekten elde bulunmalıdır. İptal/iade, inşaatçı görevi ve fiziksel oda genişletme henüz yoktur. Yeni yapılar mevcut ikonları kullanır; dünyaya ayrıca sprite çizilmez.

`kaynakYeterliMi()` enerji/su/gıda harcayan eylemleri kontrol eder. Atık/karbon temizliği, elde tam miktar olmasa da yapılabilir ve sıfırda durur. İnşaatta malzeme kontrolü ayrıca atığı da kapsar. `yeniAile` kartının kabul/ret seçenekleri gerçek ziyaretçiyi işler; sel/toz kartındaki hazırlık gerçek `state.hazirlik` alanını ayarlar.

Yorgunluk: çalışana +1/gece, dinlenene −2; uyarı 4, ayrılma eşiği 5; ayrılma olasılığı `min(1, (yorgunluk−5+1)×0.20)`. Eski loglardaki 4/%25 değerleri tarihsel verilerdir.

## Hangi geliştirme nerede?

| İş | Dosya / fonksiyon |
|---|---|
| Kaynaklar, gece hesabı, inşaat, kart uygulaması | `src/state.js`: `AYAR`, `geceHesapla`, `gunuBitir`, `kaynakYeterliMi`, `yapiKur`, `insaatGecesi`, `kartSec` |
| Eylemler / olaylar / ziyaretçiler / araştırma / yapılar / keşif | `src/data/panels.js`, `events.js`, `visitors.js`, `research.js`, `structures.js`, `exploration.js` |
| Yönetim panelleri | `src/ui/ui.js`: `YONETIM_BOLUMLERI`, `panoAc(bolum)`, `panoCiz`, `odalarHtml`, `yapilarHtml` |
| Pencereler ve sabit alt şerit | `src/ui/ui.js`: `modalAc`; `src/style.css`: `.kart-icerik`, `.kart > .alt`, `.pano-gecis` |
| Koşma / NPC | `src/scenes/GameScene.js`: `update`, `KOSU_CARPANI`, `SAKIN_HIZI`, `sakinIdleBaslat`, `sakinTasi`, `sakinAnimGuncelle(dt)` |
| Oda yerleşimi / ölçek | `src/data/rooms.js`: `ODALAR`, `ODA_GENISLIK=739`; `src/data/assets.js`: `PX_METRE=74` |
| Dünya assetleri / arayüz dosyaları | `src/data/assets.js`: `ASSETLER`, `ARAYUZ_IKONLARI`, `KARAR_GORSELLERI`, `SON_GORSELLERI`, `ARAYUZ_DOSYALARI` |
| Animasyon kareleri | `src/data/animations.js`: `ANIMASYONLAR`; dosyalar `public/assets/anim/<ad>-<n>.png` |

## Asset devri

92 satırın 71'i hazır, 9'u yenilenmeli, 12'si eksik. Kalanlar: `sakin-1` ve `sakin-3` için bekleme+yürüme setleri; dokuz eski stildeki portre; isteğe bağlı on özel sakin sprite'ı. Mevcut 44 arayüz görseli bağlıdır, yeniden üretilmeleri gerekmiyor. `node tools/asset-durum.mjs` diskteki dosyaları kontrol eder; sanat kalitesini veya portre yenileme gereksinimini otomatik değerlendirmez.

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
