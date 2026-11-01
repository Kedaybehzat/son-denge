# Doğrudan AI asset üretimi · 1 Kasım 2026

Üretim aracı: **yerleşik `image_gen`**, CLI/API anahtarı kullanılmadı. Çıktılar proje içine alındı; ham dosyalar `assets-orijinal/ai-uretim/2026-11-01/` altında korunur (git dışı). Oyundaki dosyalar `public/assets/` ve `public/assets/anim/` içindedir.

## Bu turda tamamlananlar

- 7 eksik ikon: `ikon-malzeme.png`, `ikon-yagmur-suyu.png`, `ikon-dinlen.png`, `ikon-yagmur-deposu.png`, `ikon-su-hatti.png`, `ikon-onarim-tezgahi.png`, `ikon-insaat.png`; hepsi 256×256, gerçek alfa.
- Keşif haritası `yonetim-kesif.png` (1536×1024, yazısız) ve bağımsız `kesif-siginak.png` (256×256, alfa).
- Genel sakin-1 ve sakin-3 için eksik toplam 12 kare.
- 10 sakin için yalnız eksik tam boylar (10), özel animasyon kareleri (60) ve rozetler (7).
- Oyuncunun eksik kare baş/omuz portresi: `portre-oyuncu.png` (512×512).

Mevcut 10 kare karakter portresi, 3 hazır rozet, mevcut oyuncu ve sakin-2/4 kareleri yeniden üretilmedi. Korunan 13 dosyanın SHA-256 listesi `korunan-assetler.json`; set denetimi `node tools/karakter-setleri.mjs --kontrol`.

## Prompt seti ve referanslar

Karakter ve oyuncu için kullanılan tam İngilizce promptlar ile kaynak dosyalar [karakter-uretim-istekleri.json](karakter-uretim-istekleri.json) içinde kayıtlıdır. Her karakterin kanonik mevcut portresi `referenced_image_paths` ile kullanıldı. `saydam: true` olan sheet’ler 2 sütun × 3 satır istendi; 2 bekleme ve 4 yürüme pozu. Üretimin eşit hücre sınırlarını hafif aşabildiği durumlarda gerçek boş satırlar bulunarak kesildi ve bütün kareler ortak tabana yerleştirildi.

İkon promptlarının ortak sanat yönü:

```text
Square 1:1 game icon, hand-painted flat 2D illustration, bold dark umber outline,
muted olive/ochre/cream/rust palette, simple readable silhouette at 32px,
soft cel shading, upper-left warm light. Single centered subject, 12% empty margin.
Actual transparent alpha background. No fog, shadow, glow, checkerboard,
text, letters or numbers.
```

| Çıktı | İstenen konu |
|---|---|
| `ikon-malzeme.png` | Three stacked weathered metal plates, a large hexagonal bolt and one small gear |
| `ikon-yagmur-suyu.png` | Compact old-fashioned hand water pump with three blue droplets falling into catch basin |
| `ikon-dinlen.png` | Patched warm cream pillow with a small ochre crescent moon |
| `ikon-yagmur-deposu.png` | Short roof gutter pouring blue water into an olive riveted tank |
| `ikon-su-hatti.png` | Bent worn blue-green pipe with an olive circular return arrow |
| `ikon-onarim-tezgahi.png` | Small repaired wooden workbench with one large steel wrench |
| `ikon-insaat.png` | Wooden-handled hammer crossed diagonally over three terracotta bricks |
| `kesif-siginak.png` | Tiny semi-buried shelter in a green hill, brass door, small solar panel and attached greenhouse; compact isometric marker |

Harita promptu:

```text
Landscape 3:2 top-down hand-painted parchment map, no UI. Warm dusty ochre,
muted sage vegetation, dark umber contour lines, restrained low-contrast texture.
Abandoned power plant at 17%/24%, ruined city at 80%/20%, green neighbouring
village at 84%/72%, dried reservoir at 19%/76%. Empty central hill at 50%/52%
for a separate shelter marker. Faint dirt paths, cracked ground, sparse dead trees.
No labels, numbers, letters, markers, pins, compass, border, frame or watermark.
Opaque full-canvas map.
```

Genel sakin-1/3 sheet’lerinde mevcut `sakin-1.png` ve `sakin-3.png` kimlik referansıdır; aynı kişi, kıyafet, 2×3 hücre ve dört ardışık sağa yürüme pozu istendi. İlk yaşlı sakin sheet’i için ayrıca arka plan çıkarma isteği yapıldı; kabul edilen PNG alfa kanalında çevre gerçekten 0’dır. Saydam piksellerin RGB’si önizleme sorununu önlemek için sıfırlandı; görünen çizim korunur.

## Yeniden hazırlama

- `tools/ai-asset-hazirla.py`: genel sheet’ler, ikonlar ve harita; tarif `ai-asset-uretim.json`.
- `tools/karakter-setleri-hazirla.py`: karaktere özel dosyalar, yalnız eksik çıktılara yazar.
- `tools/kenar-temizle.py <dosyalar>`: kenar/saçak temizliği.
- `node tools/asset-durum.mjs`: dosya/animasyon durumu.

Bunlar yerel kesim/küçültme araçlarıdır, yeniden görsel üretmez veya ücretli API çağrısı yapmaz. Ham kaynaklar Git dışında olduğu için yeni bir checkout’ta hazırlama komutları kaynak dosyalar olmadan çalışmaz; oyundaki nihai PNG’ler repoda tutulur.

## Kullanıcının logosu

`Apoclimate Metalik Logo.png` kullanıcı tarafından sağlandı; AI ile üretilmedi ve değiştirilmeden korundu. Git dışına da yedeklendi. Oyuna uygun kırpılmış/küçültülmüş kopya `logo-apoclimate.png` (1280×249), A harfinden türetilen tarayıcı simgesi `favicon.png` (64×64). Ana menü ve sonuç ekranı yeni logoyu kullanır; HTML sayfa başlığı Apoclimate · Yeşilvadi olarak güncellenir.
