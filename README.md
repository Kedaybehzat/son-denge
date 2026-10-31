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
| `src/data/rooms.js` | Odalar, pencereler, nesnelerin yerleri | Tasarım / seviye |
| `src/state.js` | Kurallar: gece tüketimi, denge formülü, sonlar, `AYAR` | Denge |
| `src/scenes/GameScene.js` | Phaser sahnesi: çizim, hareket, etkileşim, görsel dönüşüm | Programcı |
| `src/ui/ui.js` + `src/style.css` | HUD, paneller, radyo, başlangıç ve son ekranları | Arayüz |

Sayıları değiştirmek için koda dokunmanız gerekmez: `data/` klasöründeki dosyalar ve `state.js` içindeki `AYAR` yeterli.

## Nasıl çalışıyor

- **Gün döngüsü:** Her gün 3 eylem hakkı var. Yatağa gidince gece tüketimi uygulanır (`AYAR.gunSonuDegisim`), ardından yeni gün ve rastgele bir radyo olayı başlar.
- **Denge (0–100):** 5 kaynağın ağırlıklı ortalaması. Karbon iki kat sayılır. Her kaynak 80'de tam puan verir, yani fazla enerji kirliliği telafi edemez.
- **Sonlar:** 5. günün sonunda denge 60 ve üstü ise ütopya, 30–59 arası ise "ayakta ama yaralı", altı ise çöküş. Denge herhangi bir gün 10'un altına düşerse oyun erken biter.
- **Görsel dönüşüm:** Denge düştükçe gökyüzü dumanlı turuncuya döner, şehir kararır, bitkiler solar. Lambalar enerjiye, su tankları suya, çöp yığını atığa göre değişir.

## Yeni bir şey eklemek

**Yeni olay:** `events.js` içindeki `OLAYLAR` listesine ekleyin:
```js
{ id: 'kasirga', baslik: 'Kasırga', metin: '"..."', anlik: { enerji: -10 }, gunSonu: { su: -5 }, eylem: -1 }
```

**Yeni panel eylemi:** `panels.js` içinde ilgili panelin `eylemler` listesine ekleyin:
```js
{ ad: 'Yağmur suyu topla', etki: { su: +15 }, mesaj: 'Tanklar doldu.' }
```
Panelde ilk 9 eylem 1–9 tuşlarıyla seçilebilir.

**Gerçek çizimler:** `GameScene.js` içindeki `dokulariUret()` şimdilik kodla çizilmiş yer tutucular üretiyor. Çizimler hazır olunca `preload()` içinde `this.load.image('oyuncu', 'assets/oyuncu.png')` ile aynı isimlerle yükleyin (`oyuncu`, `panel`, `radyo`, `yatak`, `kapi`, `bitki`). Gerisi otomatik çalışır.

## Sıradaki adımlar

- [ ] Kapı mekaniği: iklim göçmenleri kapıya gelir (içeri al → tüketim artar / alma → vicdani bedel)
- [ ] Yürüme animasyonu ve gerçek görseller
- [ ] Ses: ortam sesi, radyo cızırtısı, panel tıklaması (ilk tıklamadan sonra başlatın)
- [ ] Dengeyi test edin: 3 farklı oyun stiliyle oynayıp (temiz, kirli, karışık) sonuçları kontrol edin
- [ ] Oyunun adını ve şehrin adını kesinleştirin
