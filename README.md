# Son Denge

GameUP Türkiye hackathonu için Phaser 3 + Vite ile geliştirilmiş iklim temalı sığınak yönetimi oyunu. Yeşilvadi'de kaynakları, koloni üyelerini, araştırmaları, keşifleri ve inşaatları yönet; kapıdaki insanlara ilişkin kararların farklı sonlara götürsün.

[Oyunu oyna](https://kedaybehzat.github.io/son-denge/) · [Geliştirme devir rehberi](docs/devralma.md) · [Proje haritası ve log](PROJECT_LOG.md) · [Asset listesi](docs/asset-listesi.md) · [Asset rehberi PDF](docs/asset-rehberi.pdf)

## Geliştirme

Node.js 22:

```bash
npm ci
npm test
npm run dev
```

Terminalde gösterilen yerel adresi açın (varsayılan 5173). A/D veya oklar ile yürü, Shift ile koş, E ile etkileş, 1–9 ile üretim panelinde seçim yap. Alt erişim şeridi veya yaşam odasındaki panodan Koloni, Odalar, Keşif, Araştırma ve İnşaat panellerini aç.

## Kontroller ve yayın

```bash
npm test                     # temel mekanik regresyonları
node tools/asset-durum.mjs    # asset ve animasyon karelerinin varlığı
node tools/simulasyon.mjs     # 9 strateji × 4000 oyun
npm run build                # dist/
npm run build:tek            # dist-tek/
```

GitHub Pages, `main` push'unda otomatik yayınlanır. itch.io / statik hosting için `dist/` klasörünün tamamını kullanın. `build:tek` JS/CSS'i HTML'ye toplar; görsel ve font dosyaları ayrıca gereklidir, yalnız HTML dosyasını taşımayın.

## Nereden devam edilmeli?

Önce [devir rehberini](docs/devralma.md), ardından [Project Map'i](PROJECT_LOG.md#project-map) okuyun. İşin ilgili olduğu dosyaları buradan seçin. Oyun kuralları `src/state.js`, içerikler `src/data/`, sahne `src/scenes/GameScene.js`, arayüz `src/ui/ui.js` ve `src/style.css` içindedir. Güncel mekanik anlatım [CLAUDE.md](CLAUDE.md), Codex yönergeleri [AGENTS.md](AGENTS.md) içindedir.

Mevcut arayüz görselleri ve fontlar oyuna bağlı. Kalan assetler ve üretim sırası [güncel promptta](docs/asset-promptu.md). Arşiv promptları yeniden üretim listesi olarak kullanılmamalı. Orijinal görsel yedekleri `assets-orijinal/` altında git dışında tutulur; bu klasör push ile paylaşılmaz.
