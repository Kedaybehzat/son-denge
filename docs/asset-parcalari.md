# Panel görsellerini parçalara ayırma

Dört oda konsolu artık tam ekran `panel-<id>.jpg` yerine ayrı dosyalardan kuruluyor. Kaynak resim korunur; parçanın konumu, boyutu ve davranışı HTML/CSS ile değişir. Ortak çerçeveyi değiştirince dört konsol birlikte güncellenir; oda sahnesi ve kontrol kartları ayrı kalır.

| Parça | Kullanım | Değiştirme yöntemi |
|---|---|---|
| `ui-panel-cerceve.png` | Ortası saydam 512×512 dış çerçeve | 64 px 9-dilim; köşeler korunarak pencere büyür |
| `ui-panel-metal.jpg` | Yazısız, tekrar edebilen metal doku | CSS zemin; karartma/rengi ayrıca değişir |
| `ui-dugme-cerceve.png` | Ortası saydam, yazısız düğme kenarı | 18 px 9-dilim; düğme metni HTML |
| `ui-bakim.png` | Bağımsız bakım/anahtar düğmesi | Tıklama alanı ve etkinlik kodda |
| `ui-oda-sera.png` | Bağımsız sera/saksı çizimi | Sağlıkla doygunluk/parlaklık değişir |
| `ui-oda-geri.png` | Bağımsız hurda sahnesi | Malzeme sayısı görsele gömülü değildir |
| Mevcut `modul-*.png` | 11 bağımsız eylem sahnesi | Ad, kazanç, bedel, kilit ve mekanizma ayrı katman |
| Mevcut `konsol-tank.png`, `rozet-*.png` | Tank sahnesi ve yüz rozetleri | Su seviyesi, operatör adı/durumu ayrı katman |

Kaynak kutuları `src/data/arayuz-parcalari.json` içinde. Çıkarıcı: `python3 tools/asset-parcala.py`. Orijinal 1672×941 mockup’lar `assets-orijinal/tasarim-referans/` altında olmalı; bu klasör git dışıdır. Üretilmiş parçalar repodadır, oyunu çalıştırmak için orijinaller gerekmez. Çıkarıcı metinli merkezleri hiç kopyalamaz; doku parçasını aynalayarak tekrar dikişlerini kapatır. Çerçeve ve düğme 9-dilim olduğu için serbest sprite kenar temizleyicisinin toplu çalışmasına dahil edilmemelidir.

`src/ui/ui.js` içindeki `konsolParcalariHazir()` ortak parçaları denetler; eksikse önce mevcut JPEG tasarımına, o da eksikse CSS tasarımına düşer. Yerleşim `.konsol-parcali` altında `src/style.css` içindedir. Prolog kilitleri, rehber hedefleri, önizleme, modlar, bakım, eylem ve Esc aynı veri/olayları kullanır.

Bu geçiş dört oda konsolunu ve altı yönetim bölümünü kapsar. HUD, Ayarlar ve hikaye henüz bütünüyle parçalanmadı. Tam resimden kapalı/kaybolmuş bir nesnenin arkasındaki çizim kayıpsız çıkarılamaz; o bölgeler için temiz zemin veya ayrı üretim gerekir. Kesilmiş panel animasyonunun eksik sağ kenarı da kırpma işlemiyle geri getirilemez.

## Canlı kontrol

`tools/animasyon-canli.mjs` mevcut Playwright/Chromium kurulumu ile çalışır; projeye yeni bağımlılık eklemez:

```sh
KONTROL_URL=http://127.0.0.1:5173 node tools/animasyon-canli.mjs
```

Playwright başka yerde kuruluysa `PLAYWRIGHT_CORE_PATH`, tarayıcı için `CHROMIUM_PATH` verilebilir. Çıktı varsayılan `/tmp/son-denge-canli/`; `KONTROL_CIKTI` ile değişir. Betik gerçek Phaser döngüsünde dört yürüme karesinin ayak tabanını, klavye hareketini, modalda duruşu, eylem/önizleme/mod/Esc’yi, prolog kilidini, eksik parça yedeğini ve 1440×900 / 960×540 / 390×844 yerleşimini kontrol eder. Küçük portre ekranda taşmama, metnin rahat okunabildiği anlamına gelmez; telefon için ayrıca yeniden yerleşim gerekir. Headless SwiftShader süreleri gerçek GPU performansı değildir.

## Bu turdaki doğrulama

Canlı Chromium kontrolünde `sakin-4` dört yürüme karesinde görünen ayak tabanı farkı **0 px** ölçüldü. 1440×900, 960×540 ve 390×844 boyutlarında dört konsolun dış/yatay taşma kontrolleri, eylem/önizleme/mod, modalda duruş, Esc, prolog kilidi ve parçasız JPEG yedeği başarılı oldu. Tarayıcı/HTTP hata kaydı yoktu. 960×540 kontrolde bulunan Geri Dönüşüm panelinin üçüncü satır taşması, malzeme sayısını sahne içine alarak giderildi. Küçük portre ekran okunabilirliği açık iş olarak kalır.

`npm test`, `npm run build` ve `npm run build:tek` başarıyla tamamlandı; mekanik denge sayıları değişmediğinden simülasyon yeniden çalıştırılmadı.

## Yönetim ekranları ve oda ışıkları · devam

Koloni, Odalar, Keşif, Araştırma, İnşaat ve Hedefler aynı `ui-panel-cerceve.png`, `ui-panel-metal.jpg`, `ui-dugme-cerceve.png` parçalarını paylaşır; yeni bitmap gerekmez. `.yonetim-parcali` içinde sekmeler ve bölüm başlığı canlı metindir; seçili durum CSS ile çizilir. İçerik alanı kaydırılabilir, alt stok/eylem/Kapat satırı sabittir. Prolog turunda sekmeler ve içerik işlemleri yine kilitlidir. JPEG’ler yalnız eksik parça yedeği olarak kalır.

Keşif haritası mevcut CSS harita zeminiyle, bağımsız ikonlar/pinler/rota/ekip katmanlarından kurulur. Tam resimdeki eski pin/yazı temizleme lekeleri bu yolda yoktur; ayrıntılı, yazısız bir harita görseli üretimi hâlâ isteğe bağlı iyileştirmedir. İnşaat filtreleri içeriği dolduracak şekilde uzatılmaz; kompakt kalır. Bozuk konuşma/yardım/duraklat/iptal simgeleri okunur metne döner.

Birleşik oda çiziminde gizli kalan panel sprite’ına animasyon oynatılmaz. Mevcut durum ışığı `rooms.js` içindeki `nesneler[].calismaIsigi` oran koordinatıyla çizili panelin LED’ine oturur. Operatörsüz veya enerji eşiği yüzünden kapalı makine kırmızı/sabit; çalışan makine yeşil/yumuşak nabızlıdır. Bu değişiklik tam panel hareketi ya da kapı açılışı üretmez; o işler ayrı görsel katman gerektirir.
