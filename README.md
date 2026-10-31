# Son Denge (çalışma adı)

GameUP Türkiye Oyun Hackathonu için iklim temalı web oyunu iskeleti.
Yandan görünüşlü bir sığınakta dolaşıp odalardaki panellerden enerji, su, gıda ve atığı yönetiyorsun. Kararların, Yeşilvadi'nin ütopya olarak kalmasını ya da distopyaya dönüşmesini belirliyor.

## Çalıştırma

```bash
npm install
npm run dev        # http://localhost:5173, kaydettikçe yenilenir
```

## Yayına alma

```bash
npm run build      # dist/ klasörü oluşur
```

- **itch.io:** `dist/` klasörünü zip'leyip "HTML" projesi olarak yükleyin, "This file will be played in the browser" seçeneğini işaretleyin. Viewport 960×540.
- **GitHub Pages / Vercel / Netlify:** `dist/` klasörünü yayınlayın.
- `npm run build:tek` her şeyi tek bir `dist-tek/index.html` dosyasına koyar. Bu dosya çift tıklayınca da çalışır.

## Dosya yapısı (kim nereye dokunur)

| Dosya | Ne var | Kim |
|---|---|---|
| `src/data/panels.js` | Paneller ve eylemleri (etkileri, kirli seçenekler) | Tasarım / denge |
| `src/data/events.js` | Radyo olayları | Tasarım / içerik |
| `src/data/story.js` | Açılıştaki hikaye ekranları | İçerik |
| `src/data/visitors.js` | Kapıya gelen ziyaretçiler ve getirdikleri | Tasarım / içerik |
| `src/data/facts.js` | "Biliyor muydun?" bilgi kartları ve kaynakları | İçerik |
| `src/data/rooms.js` | Odalar, pencereler, nesnelerin yerleri | Tasarım / seviye |
| `src/state.js` | Kurallar: gece tüketimi, denge formülü, sonlar, `AYAR` | Denge |
| `src/scenes/GameScene.js` | Phaser sahnesi: çizim, hareket, etkileşim, görsel dönüşüm | Programcı |
| `src/ui/ui.js` + `src/style.css` | HUD, paneller, radyo, kapı kartı, başlangıç ve son ekranları | Arayüz |
| `tools/simulasyon.mjs` | Dengeyi test eden simülasyon (`node tools/simulasyon.mjs`) | Denge |

Sayıları değiştirmek için koda dokunmanız gerekmez: `data/` klasöründeki dosyalar ve `state.js` içindeki `AYAR` yeterli.

## Nasıl çalışıyor

- **Hikaye:** İklim değişikliği → eriyen buzullardan uyanan eski bir virüs → "Büyük Sessizlik" (nüfusun büyük kısmı yok oldu) → hayatta kalanlar Yeşilvadi'yi kuruyor. Açılışta 4 ekranla anlatılıyor, "Geç" ile atlanabiliyor.

- **Gün döngüsü:** Her gün 3 eylem hakkı var. Yatağa gidince gece tüketimi uygulanır: sabit tüketim (`AYAR.gunSonuDegisim`) + kişi başı su ve gıda (`AYAR.kisiBasiTuketim`) + içeri alınanların katkıları. Ardından yeni gün ve rastgele bir radyo olayı başlar.
- **Kapı ve nüfus:** 2. günden itibaren her sabah biri kapıyı çalar (`data/visitors.js`). İçeri alınca nüfus ve gece tüketimi artar ama ziyaretçi bir katkı getirir (ek eylem hakkı, her gece gıda vb.). Geri çevirmek gizli "insanlık" puanını düşürür. Karar verilmeden gün biterse ziyaretçi gider (küçük insanlık kaybı). İçeri alınanlar sığınakta dolaşan sakinler olarak görünür.
- **Denge (0–100):** 5 kaynağın ağırlıklı ortalaması. Karbon iki kat sayılır. Her kaynak 80'de tam puan verir, yani fazla enerji kirliliği telafi edemez.
- **Sonlar (denge × insanlık):** Denge ≥ 60 ve insanlık ≥ 50 ise "Yeşilvadi nefes alıyor", denge yüksek ama insanlık düşükse "Yalnız bir ütopya", denge düşük ama insanlık yüksekse "Kapımız açıktı", ikisi de düşükse "Işıklar söndü". Denge 10'un altına düşerse oyun erken biter.
- **Biliyor muydun?:** Her gece o gün yapılan seçime bağlı gerçek bir iklim bilgisi gösterilir (kirli seçimler önceliklidir). Bilgiler ve kaynakları `data/facts.js` içinde. Sunumdan önce rakamları kaynaklarından bir kez daha kontrol edin.
- **Görsel dönüşüm:** Denge düştükçe gökyüzü dumanlı turuncuya döner, şehir kararır, bitkiler solar. Lambalar enerjiye, su tankları suya, çöp yığını atığa göre değişir.

**Simülasyon sonuçları** (her biri 4000 oyun): Akıllı oynayıp herkesi içeri alan oyuncu %96 "gerçek ütopya", kimseyi almayan %100 "yalnız ütopya" sonuna ulaşıyor. Rastgele oynayan çoğunlukla "kapımız açıktı" ya da "çöküş" görüyor, kirli oynayan hiçbir zaman ayakta kalamıyor. Sayıları değiştirdikten sonra simülasyonu yeniden çalıştırın.

## Yeni bir şey eklemek

**Yeni olay:** `events.js` içindeki `OLAYLAR` listesine ekleyin:
```js
{ id: 'kasirga', baslik: 'Kasırga', metin: '"..."', anlik: { enerji: -10 }, gunSonu: { su: -5 }, eylem: -1 }
```

**Yeni ziyaretçi:** `visitors.js` içindeki listeye ekleyin (alanlar dosyanın başında açıklanıyor).

**Yeni panel eylemi:** `panels.js` içinde ilgili panelin `eylemler` listesine ekleyin:
```js
{ ad: 'Yağmur suyu topla', etki: { su: +15 }, mesaj: 'Tanklar doldu.' }
```
Panelde ilk 9 eylem 1–9 tuşlarıyla seçilebilir.

**Gerçek çizimler:** `GameScene.js` içindeki `dokulariUret()` şimdilik kodla çizilmiş yer tutucular üretiyor. Çizimler hazır olunca `preload()` içinde `this.load.image('oyuncu', 'assets/oyuncu.png')` ile aynı isimlerle yükleyin (`oyuncu`, `panel`, `radyo`, `yatak`, `kapi`, `bitki`). Gerisi otomatik çalışır.

## Sıradaki adımlar

- [ ] Yürüme animasyonu ve gerçek görseller
- [ ] Ses: ortam sesi, radyo cızırtısı, panel tıklaması (ilk tıklamadan sonra başlatın)
- [ ] Dengeyi test edin: 3 farklı oyun stiliyle oynayıp (temiz, kirli, karışık) sonuçları kontrol edin
- [ ] Oyunun adını ve şehrin adını kesinleştirin
