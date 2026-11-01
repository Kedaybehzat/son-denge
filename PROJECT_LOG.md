# Proje Logu

> Bu dosya yapay zeka asistanının çalışma haritası ve değişiklik günlüğüdür. Kurallar `CLAUDE.md` → bölüm 0.1'de.
> **Project Map** her değişiklikte güncel tutulur; **Değişiklik Logu** en yeni kayıt en üstte olacak şekilde büyür.

---

## Project Map

Yeni bir istekte önce bu tabloya bakıp yalnızca ilgili dosyaya/fonksiyona gidin.

### Hangi iş nerede?

| İhtiyaç | Gidilecek yer |
|---|---|
| Sahne modülleri / yöntem sahipleri | `src/scenes/GameScene.js`: create/update/oyuncu/etkileşim/gün akışı; aşağıdaki modüller prototype üzerinde birleştirilir, birbirini veya sahneyi import etmez |
| `game/dokular.js` | `preload`, `dokuKucult`, `dokuKucultOran`, `assetleriKucult`, `gercekAsset`, `dokuAnahtari`, `icerikKutusu`, `animKutusu`, `olcekle`, `gorunurY`, `yuksekKaliteKucult` |
| `game/yerTutucular.js` | `dokulariUret`, `dokuUret` |
| `game/animasyonlar.js` | `animasyonlariYukle`, `animOynat`, `animDurdur`, `makineAnimGuncelle` |
| `game/dunya.js` | `ekranaSabitle`, `odaGorseliYerlestir`, `odaGecisleriCiz`, `disariCiz`, `sehirBoya`, `evCiz`, `dekorCiz`, `_cizCatiPanelleri`, `_cizYapilar` |
| `game/sakinler.js` | `sakinGuncelle`, `sakinIdleBaslat`, `sakinTasi`, `sakinAnimGuncelle`, `sakinNoktayaGit`, `sakinIsBaslat`, `sakinRutinDurdur`, `npcNoktalariGoster` |
| `game/efektler.js` | `gorselGuncelle`, `gorselUygula`, `renkGecis`, `etiketZeminiCiz`, `efektZiyaretci` |
| Sahne sabitleri / doku ömrü | `game/ayarlar.js`: hız/ölçek/koordinat; `game/dokuOnbellegi.js`: restart boyunca yaşayan doku kümeleri ve içerik ölçümü |
| Denge sayıları, başlangıç değerleri, eşikler | `src/state.js` → `AYAR`, `BASLANGIC`, `AGIRLIK` |
| Gece tüketimi, gün sonu, sonların belirlenmesi | `src/state.js` → `nufusTuketimi()`, `gunuBitir()`, `sonucBelirle()` |
| Gece tahmini, ziyaretçinin net gece etkisi | `src/state.js` → `geceHesapla()` (tek gece hesabı), `geceTahmini()`, `ziyaretciNetEtki()` |
| Sakin görseli seçimi (özel `sakin-<id>` / genel `sakin-N`) | `assets.js` → `SAKIN_OZEL_YUKSEKLIK` ve otomatik `sakin-<id>` girdileri; `GameScene.js` + `game/` modülleri → `sakinGuncelle()` (`ozelDoku`), `sakinAnimGuncelle()` |
| Sakinler, görev atama, trait koşulları | `src/state.js` → `sakinCiktisi()`, `kosulAktif()`, `gorevAta()`, `varsayilanGorev()`, `katkiGuncelle()`; veri: `visitors.js` (`uzman`, `kosul`, `ekTuketim`, `guclu`, `kosullu`, `KURUCULAR`) |
| Makineler, operatör, boş makine, kendin çalış | `src/state.js` → `MAKINELER`, `makineOperatoru()`, `bosMakineler()`, `kendinCalis()`; üretim: `panels.js` → `makine.uretim`; arayüz: `ui.js` → `makinePanelHtml()`, `makineDurumHtml()` |
| Uzman olmayan verim ve enerji azlığında makine kapanışı | `src/state.js` → `AYAR.uzmanOlmayanVerim`, `AYAR.makineKapatmaEsikleri`, `kapaliMakineler()`, `makineKapali()`; uygulama: `sakinCiktisi()`, `sakinlerToplami()`, `calisiyor()` |
| Üs İnşası (yapılar, GDD bölüm 7) | Veri: `src/data/structures.js` → `YAPILAR`; kurallar: `src/state.js` → `yapiKur()`, `yapiKurabilirMi()`, `yapiAcik()`, `insaatGecesi()`, `state.insaat`, `olayCarpani()`; arayüz: `ui.js` → `yapilarHtml()` (panoda "İnşa" bölümü) |
| Yorgunluk ve ayrılma (Faz 2 / M2) | `src/state.js` → `yarinkiYorgunluk()`, `ayrilmaSansi()`, `yorgunlukGecesi()` (gunuBitir içinde), `AYAR.yorgunluk*`; arayüz: `ui.js` → `yorgunlukChip()`; sahne: `GameScene.js` + `game/` modülleri → `sakinGuncelle()` (ayrılan figür solar) |
| Hazırlıklı olaylar (tahmin, hazırlık) | Veri: `events.js` (`uyari`, `hazirlik`, `HAZIRLIK_MALIYETI`); kurallar: `state.js` → `state.tahmin`, `olayEtkisi()`, `hazirlan()`, `gunuBitir()` (tahmin → olay); arayüz: `ui.js` → `tahminHtml()`, `olayHtml()`, `hazirlikBagla()` |
| Eğitici karar kartları | Veri: `src/data/cards.js` → `KARTLAR`; kurallar: `state.js` → `kartKontrol()` (gunuBitir sonunda), `kartSec()`, `kartSecenekleri()`, `state.kartGeceEtki` (geceHesapla); arayüz: `ui.js` → `kararKartiGoster()`, `sabahGoster()` |
| Keşif (sefer, dönüş) | Veri: `src/data/exploration.js` → `KESIF_NOKTALARI`; kurallar: `state.js` → `kesfeGonder()`, `kesifSansi()`, `seferSabahi()` (gunuBitir sabahı), `state.sefer`; arayüz: `ui.js` → `kesifHtml()` (pano), `seferHtml()` (gece raporu); sahne: `sakinGuncelle()` keşiftekini gizler |
| Memnuniyet, itiraz kartı, güven oylaması | `state.js` → `AYAR.memnuniyet*`, `memnuniyetGecesi()`, `state.guvenDusukGece`, `gunuBitir()` (`guvenKaybi` sonu); kart: `cards.js` → `itiraz`; arayüz: `ui.js` → HUD `[data-memnuniyet]`, `memnuniyetHtml()`, `SONLAR.guvenKaybi` |
| Araştırma ve batarya | `src/state.js` → `arastirmaSec()`, `masadaArastir()`, `puanEkle()`, `geceHesapla()`; veri: `src/data/research.js` |
| Koloni / Odalar / Keşif / Araştırma / İnşaat / Hedefler panelleri | `ui.js` → `panoAc(bolum)`, `panoCiz()`, `YONETIM_BOLUMLERI`, `odalarHtml()`; alt erişim: `hudKur()`; nesne: `rooms.js` (`tip: 'pano'`), doku: `GameScene.js` + `game/` modülleri → `dokulariUret()` |
| Malzeme / oda modları / bakım | `state.js` → `state.malzeme`, `geriKazanimMiktari`, `makineModuSec`, `makineUretimi`, `bakimYap`; veri: `src/data/production.js` |
| İnşaat iş gücü / iptal / yardım | `state.js` → `insaatci`, `insaatTahmini`, `insaataYardimEt`, `insaatDuraklat`, `insaatIptal`; UI: `insaatYonetimiHtml()` |
| Sakinlerle konuşma | `src/data/dialogues.js`; `ui.js` → `sakinleKonus`; `state.js` → `moralVer`, `moralVerebilirMi`; sahne: E/T |
| Keşif ara kararı / plan zinciri | `state.js` → `kesifKarariSec`, `kesifKarariYapabilirMi`; `exploration.js` → `araKarar`; `research.js` → `yagmurSuyu`; `structures.js` → `yagmurDeposu` |
| Dinlenme sözü ve hafıza | `state.js` → `dinlenmeSozuVer`, `sozleriDegerlendir`; `dialogues.js`; `ui.js` → `sakinleKonus` |
| Hava üretimi / opsiyonel hedefler | `production.js` → `HAVA_URETIMI`; `state.js` → `havaUretimEtkisi`, `hedefYardimiGonder`, `hedefleriDegerlendir`; `scenario.js`; `ui.js` → `hedeflerHtml` |
| Gün başı kayıt ve devam | `src/kayit.js`; `state.js` → `kayittanDevamEt`, `gunuBitir`; `ui.js` → `baslangicEkrani`; `main.js` → sahne restart sonrası create |
| İlerleme testleri / hackathon eşlemesi | `tools/ilerleme-test.mjs`; `docs/hackathon-uyum-analizi.md` |
| NPC oda rutinleri / çalışma noktaları | `src/data/activities.js`, `docs/npc-noktalari.md`; `GameScene.js` + `game/` modülleri → `sakinNoktayaGit`, `sakinIsBaslat`, `sakinRutinDurdur`, `npcNoktalariGoster` |
| Sakin kimliği / portre eşleşmesi | `assets.js` → `SAKIN_GORSEL_TIPLERI`, `sakinGorselTanimi`; `ui.js` → `sakinPortresi`; sahne aynı seçimi kullanır |
| Kaynak maliyeti ve mekanik regresyonlar | `state.js` → `kaynakYeterliMi()`; `tools/mekanik-test.mjs` (`npm test`): kaynak/inşaat/kapı/hazırlık |
| Panel eylemi yapma kuralları | `src/state.js` → `eylemYapabilirMi()`, `eylemYap()` |
| Ziyaretçi kabul/ret kuralları | `src/state.js` → `ziyaretciKabul()`, `ziyaretciReddet()` |
| Panel ve eylem içerikleri | `src/data/panels.js` → `PANELLER` |
| Radyo olayları | `src/data/events.js` → `ILK_OLAY`, `OLAYLAR` |
| Ziyaretçiler | `src/data/visitors.js` → `ZIYARETCILER` |
| "Biliyor muydun?" kartları | `src/data/facts.js` → `BILGILER`, `GENEL_BILGILER`; seçim: `state.js` → `bilgiSec()` |
| Açılış hikayesi metinleri | `src/data/story.js` → `HIKAYE` |
| Oda düzeni, pencereler, nesne konumları | `src/data/rooms.js` → `ODALAR`, `ODA_GENISLIK`, `TAVAN_Y`, `ZEMIN_Y` |
| Yapılacak görsellerin listesi ve durumu | Bu dosya → **Asset Listesi** bölümü (tek tablo); durum kontrolü: `node tools/asset-durum.mjs` |
| Animasyonlar (kare yükleme, oynatma) | Tanım: `src/data/animations.js` → `ANIMASYONLAR`; yükleme: `GameScene.js` + `game/` modülleri → `preload()` (1. kare), `animasyonlariYukle()`; oynatma: `animOynat()`, `animDurdur()`, `makineAnimGuncelle()`, `sakinAnimGuncelle()`, `update()` (oyuncu), `efektZiyaretci()` (kapı); dosyalar: `public/assets/anim/` |
| Arka planlar (oda, manzara) | Yerleşim ayarları: `rooms.js` → `ODA_GENISLIK` (739, birleşik oda şeridine göre), `GORSEL_ZEMIN_ORANI`, `GORSEL_DUVAR_ORANI`, `ARKA_OLCEK`, `ODALAR[].gorsel` (`nesneOran`, `bitkiOran`, `copOran`, `suGostergeleri`, `duman`); rework şablonları: `docs/oda-sablonlari/`; brif ve promptlar: `CLAUDE.md` 6.12; `GameScene.js` + `game/` modülleri → `odaGorseliYerlestir()` (oran korur, kırpar, `odaYerlesimi`, `dumanNoktasi`), `odaGecisleriCiz()` (kolon + gölge), `evCiz()` (oda-*, oda adı etiketi, arka nesne perspektifi), `dekorCiz()` (oda görseli varken süs çizimleri atlanır, tank/saksı stili), `disariCiz()` + `gorselUygula()` (manzara-*, iyi↔kötü geçiş) |
| Portre ve hikaye görselleri (HTML) | `ui.js` → `portreRozet()`, `portreBuyuk()`, `girisHikayesi()`; yollar: `assets.js` → `portreDosyasi()`, `hikayeDosyasi()` |
| Çizim netliği (2× tuval + zoom, asset küçültme) | `GameScene.js` + `game/` modülleri → `CIZIM_OLCEGI`, `SABIT_X/Y`, `ekranaSabitle()`, `yuksekKaliteKucult()`, `dokuKucult()`, `dokuKucultOran()`, `assetleriKucult()`; tuval boyu: `src/main.js` |
| Görsel içerik kutusu (şeffaf boşluk hariç ölçek) | `GameScene.js` + `game/` modülleri → `icerikKutusu()`, `animKutusu()`, `olcekle()`, `gorunurY()` |
| Var olan asset listesi (404'süz yükleme, canlı yenileme) | `vite.config.js` → `assetListesi()` eklentisi; `src/assetListesi.js` → `assetVar()`; kullanım: `GameScene.js` + `game/` modülleri → `preload()`, `animasyonlariYukle()`; `ui.js` → `varsaImg()` |
| Nesne boyları (gerçek ölçü) | `assets.js` → `PX_METRE` (74, oda görsellerinden kalibre), `m()`; üretim standardı: `docs/olcek-standardi.md` |
| Görsel yükleme (public/assets) ve yer tutucular | Liste + hedef yükseklik: `src/data/assets.js` → `ASSETLER`; yükleme: `GameScene.js` + `game/` modülleri → `preload()`; yer tutucu: `dokulariUret()` / `dokuUret()`; ölçek: `olcekle()`, `dokuAnahtari()`, `gercekAsset()`; dosyalar: `public/assets/` |
| Dışarısı, şehir silueti | `GameScene.js` + `game/` modülleri → `disariCiz()`, `sehirBoya()` |
| Ev/oda çizimi, oda dekorları | `GameScene.js` + `game/` modülleri → `evCiz()`, `dekorCiz()` |
| GameScene performansı / restart | `GameScene.js` + `game/` modülleri → `gorselGuncelle` (state eşleme), `gorselUygula` (geçiş), `sehirBoya` / `etiketZeminiCiz` (çizim önbelleği), `update` (tek geçiş yakın sakin), `create` / shutdown (dinleyici/text temizliği) |
| Oyuncu, hareket, etkileşim (E tuşu) | `GameScene.js` + `game/` modülleri → `oyuncuOlustur()`, `update()`, `oyuncuDurdur()` (pencere açıkken duruş), sabitler `HIZ`, `KOSU_CARPANI` (Shift, ×1,65), `ETKILESIM_MESAFE` |
| Sakinlerin sayısı/hareketi | `GameScene.js` + `game/` modülleri → `sakinGuncelle()`, `sakinIdleBaslat()`, `sakinTasi()`, `sakinAnimGuncelle(dt)`; `SAKIN_HIZI` (85 px/sn), mesafeye bağlı süre ve hıza bağlı animasyon |
| Ütopya ↔ distopya görsel dönüşümü | `GameScene.js` + `game/` modülleri → `gorselGuncelle()`, `gorselUygula()`, `renkGecis()` |
| Arayüz asset eşlemeleri ve kontrolü | `src/data/assets.js` → `ARAYUZ_IKONLARI`, `KARAR_GORSELLERI`, `SON_GORSELLERI`, `ARAYUZ_DOSYALARI`; `ui.js` → `arayuzIkonu()`, `arayuzGorseli()`; `style.css` → 9-dilim çerçeve/buton/HUD, menü ortamı |
| HUD (kaynak barları) | `src/ui/ui.js` → `hudKur()`, `hudGuncelle()` |
| Panel penceresi | `ui.js` → `panelAc()`, `panelCiz()` |
| Radyo, sabah raporu, kapı kartı | `ui.js` → `olayGoster()`, `gunBaslangici()`, `sabahGoster()`, `ziyaretciGoster()` |
| Hikaye, başlangıç ve son ekranları | `ui.js` → `girisHikayesi()`, `baslangicEkrani()`, `SONLAR`, `sonGoster()` |
| Genel modal / onay pencereleri | `style.css` → `.kart-icerik` (iç kaydırma), `.kart > .alt` (sabit alt şerit); `ui.js` → `modalAc()`, `modalKapat()`, `onay()`, `bilgi()` |
| Ses/müzik ve ses regresyonları | `src/sesler.js`: `muzikCal`, `muzikDurdur`, `sesToggle`, `muzikBaslat`, `fadeIptal`; `tools/ses-test.mjs` (`npm test`); dosyalar ve kurallar `SOUNDS.md` |
| Oda adı ve etkileşim etiket stili | `GameScene.js` + `game/` modülleri: `etiketZeminiCiz()`, `ipucuZemini`, `evCiz()`, `update()`; sade levha, ekran kenarı kontrolü |
| Yönetim şeridi konumu / görünürlük | `.yonetim-erisim`: `#sahne` altında, sol/alt 10 px; `ui.js` → `hudGorunurlugu()` |
| Ayarlar menüsü (tam ekran + kontroller) | `ui.js` → `ayarlarAc(donus)`; `baslangicEkrani` ve HUD'daki ⚙ düğmesi çağırır |
| Tam ekran (F tuşu) | `src/main.js` → `tamEkranToggle()`, `window.tamEkranToggle`; CSS `#sahne:fullscreen` |
| Günü bitirme onayı (gece tahmini penceresi) | `ui.js` → `gunuBitirOnay()`; çağrı: `GameScene.js` + `game/` modülleri → `case 'yatak'` |
| Arayüz stili | `src/style.css`; fontlar: `@font-face`, `--font-metin` (Nunito Sans), `--font-baslik` (Barlow Condensed); yerel dosyalar ve OFL lisansları: `public/fonts/` |
| Giriş noktası (Phaser config) | `src/main.js` |
| Denge simülasyonu | `tools/simulasyon.mjs` (`node tools/simulasyon.mjs`) |
| Derleme / tek dosya çıktısı | `vite.config.js`, `package.json` |
| GitHub Pages yayını | `.github/workflows/deploy.yml` |
| Devir rehberi ve güncel asset PDF üretimi | `docs/devralma.md`, `README.md`, `tools/rehber-uret.py` (Python 3 + Pillow; `docs/asset-rehberi.pdf` üretir) |
| PR kontrolleri | `.github/workflows/checks.yml`: Node 22, npm ci/test/build/build:tek |
| Takım dokümanı (hikaye, mekanik, görsel promptları) | `CLAUDE.md` |
| Codex proje yönergeleri ve proje dokümanı | `AGENTS.md` (CLAUDE.md içeriğinin Codex uyarlaması; bölüm 0.1 çalışma kuralları) |
| Mekanik tasarım (GDD v2.0; [ÖNERİ]'ler hackathon kapsamında, faz sırası bölüm 14) | `Son_Denge_Mekanik_Tasarim_GDD.pdf` |

### Dosya ağacı

```
index.html                 HTML iskeleti (#hud, #modal)
src/main.js                Phaser oyununu başlatır
src/assetListesi.js        public/assets'te var olan dosyalar (Vite sanal modülü; yalnız tarayıcı)
src/state.js               Oyun durumu ve tüm kurallar (abone/bildir ile UI'ya yayın)
src/scenes/GameScene.js    Sahne kurulumu, oyuncu, etkileşim ve gün akışı (362 satır)
src/scenes/game/ayarlar.js Ortak hız/ölçek/koordinat sabitleri
src/scenes/game/dokuOnbellegi.js Restart boyunca yaşayan doku kayıtları
src/scenes/game/dokular.js Yükleme, küçültme, ölçme ve ölçekleme
src/scenes/game/yerTutucular.js Kodla üretilen yedek görseller
src/scenes/game/animasyonlar.js Kare yükleme, animasyon kurma/oynatma
src/scenes/game/dunya.js   Odalar, dış dünya, dekor, çatı/yapı çizimleri
src/scenes/game/sakinler.js NPC eşleme, rutin, hareket ve çalışma
src/scenes/game/efektler.js Eylem/ziyaretçi, gün başlığı, atmosfer ve etiket çizimi
src/ui/ui.js               HTML/CSS arayüz katmanı
src/style.css              Arayüz stili (cqw ile ölçekleme)
src/data/*.js              İçerik verisi (panels, events, visitors, facts, story, rooms, research, assets, animations, cards, exploration)
public/assets/             Oyun görselleri (CLAUDE.md 6.3 adlarıyla; eksikse yer tutucu)
public/assets/anim/        Animasyon kareleri (<animasyon>-<kare>.png)
public/fonts/             Nunito Sans (400/600/700), Barlow Condensed (600/700) ve OFL lisansları
tools/simulasyon.mjs       Strateji başına 4000 oyunluk denge simülasyonu
tools/mekanik-test.mjs     Kaynak, inşaat, kapı ve hazırlık regresyon testleri
tools/uretim-test.mjs      Malzeme, mod, bakım, iş gücü, moral ve görsel eşleşme testleri
src/data/production.js    Çalışma modları, ek tüketim ve bakım ayarları
src/data/dialogues.js     Sakin konuşma metinleri ve seçenekleri
src/data/scenario.js      İsteğe bağlı topluluk hedefleri
src/kayit.js              Sürümlü gün başı localStorage kaydı
tools/ilerleme-test.mjs   Keşif/plan/söz/hava/hedef/kayıt regresyonları
docs/hackathon-uyum-analizi.md  İki slayta göre tema ve kriter kanıtları
src/data/activities.js    Oda görsellerinden işaretlenen 25 NPC çalışma hedefi
docs/npc-noktalari.md      Hedef koordinatları ve debug kullanım rehberi
tools/ses-test.mjs         Asenkron müzik geçişi, susturma ve autoplay regresyonları
src/sesler.js             Tek müzik yöneticisi, ses efektleri ve kalıcı açık/kapalı ayarı
SOUNDS.md                 Ses dosyaları, kullanım kuralları ve testler
tools/asset-durum.mjs      public/assets'te hangi görsellerin ve animasyon karelerinin hazır olduğunu listeler
.github/workflows/deploy.yml  main → GitHub Pages
.github/workflows/checks.yml  PR → mekanik testleri ve iki derleme
CLAUDE.md                  Takım dokümanı + asistan kuralları
AGENTS.md                  Codex için proje dokümanı + asistan kuralları
docs/oda-sablonlari/       Oda görselleri rework şablonları (sablon-<oda>.png, 1891×831)
assets-orijinal/           Küçültülmeden önceki asset yedekleri (git'e girmez, .gitignore)
docs/olcek-standardi.md    Asset üretiminde tek ölçü standardı (ölçek dizisi) + prompt
docs/olcek-sablonu.png     Ölçek dizisi şablonu (tek taban, 1 m = 300 px, 10 yuva)
docs/asset-rehberi.pdf     Güncel 17 sayfalık asset rehberi: 93 satır, örnekler, odalar, sanat stili
docs/devralma.md           Asset/mekanik/arayüz geliştirmesine devam rehberi
tools/rehber-uret.py       PDF üreticisi (Python 3 + Pillow)
docs/orijinal/             Ekibin beğendiği ilk oda görselleri + hikaye/manzara orijinalleri (rehberin temeli)
docs/oda-sablonlari/plan-*.jpg  Orijinal odalar üzerinde yerleşim planları
docs/sanat-stili-1..3.png  Ekibin Ana Sanat Stili Rehberi sayfaları
docs/asset-promptu.md      Asset sohbeti promptu (rehber PDF ile birlikte; her yanıtta tek görsel, kalan 21 üretim maddesi)
docs/sifirdan-asset-promptu.md  (eski) 72 maddelik tek seferlik prompt
docs/final-asset-promptu.md  Arşiv üretim brifi; güncel eksik listesi değildir
PROJECT_LOG.md             Bu dosya (Project Map, borçlar, Asset Listesi, değişiklik logu)
Son_Denge_Mekanik_Tasarim_GDD.pdf  Mekanik tasarım dokümanı (9 sayfa)
```

### Bilinen borçlar (açık debt listesi)

| # | Borç | Yer | Eklenme |
|---|---|---|---|
| D2 | Temel mekanik regresyonları `npm test` ile mevcut; tüm oyun kuralları ve görsel akışlar henüz kalıcı otomatik testlerle kapsanmıyor | `tools/simulasyon.mjs` | 2026-10-31 |
| D3 | "Biliyor muydun?" rakamları kaynaklarından kontrol edilmedi (kaynak etiketleri 2026-11-01'de 1. el'e çekildi; sayıların doğruluğu hâlâ sunum öncesi doğrulanmalı) | `src/data/facts.js` | 2026-10-31 |
| D6 | Simülasyon artık görev atama + araştırma seçimini kullanıyor; akıllı stilde ortalama 1.66 araştırma açılıyor. Güncel tam oyun insan playtesti eksik; tarayıcıda yönetim/inşaat/keşif akışları doğrulandı | `tools/simulasyon.mjs` | 2026-10-31 |
| D10 | Tarihsel simülasyon bulgusu (güncel kodda ayrılma eşiği 5 ve pay %20; aşağıdaki eski oranlar yeniden ölçülmeli): Yorgunluk ayarlarıyla dinlendirme stratejisi kötü: herkes 0'dan başlayıp 4. gece aynı anda riske giriyor; riskteki herkesi dinlendiren akıllı stil iyi sonu %82 → %20 düşürüyor. Öneri: kurucuları farklı yorgunlukla başlatmak ya da dinlenmeyi −3 / eşiği 5 yapmak (karar bekliyor) | `AYAR.yorgunluk*`, `KURUCULAR` | 2026-11-01 |
| D12 | Tarihsel denge bulgusu (güncel 36.000 oyunluk sonuçlar CLAUDE.md 4.11'de; aşağıdaki eski karşılaştırma yeniden ölçülmeli): Hazırlıklı olaylarla zararlı olaylar ~1,6 kat sertleştirildi (hazırlık bir eylem değerinde olsun diye). Toplam zorluk arttı: akıllı+herkesi al iyi son %83 → %61 (hazırlanarak; hazırlıksız %62). 1,3 katta hazırlık bazen kötü seçim çıkıyordu. Dengeleme D10 ile birlikte yapılmalı | `events.js`, `AYAR` | 2026-11-01 |
| D14 | Oda/manzara PNG'leri ve eklenen UI seti yükleme maliyetini artırıyor; UI seti 28,1 → 13,9 MB küçültüldü. WebP ve ihtiyaç halinde yükleme iyileştirmesi açık; güncel açılış boyutu ayrıca ölçülmeli | `public/assets/oda-*`, `manzara-*`, `assets.js` | 2026-11-01 |

---

## Asset Listesi

> Kopyası `docs/asset-listesi.md` · rehber `docs/asset-rehberi.pdf`.

**Durum:** ✅ oyunda hazır (72) · 🔁 var ama yenilenmeli (9) · ⏳ eksik (12). Toplam 93 satır.

**Kurallar:** Karakter/nesne: şeffaf arka plan, yandan, sağa bakar, taban altta; boy "Gerçek boy" sütununa göre (oyun ölçekler). Animasyon: tek görselde ızgara, her hücrede aynı boy/konum/taban. Menü: sanat stili rehberindeki palet ve yıpranmış metal/ahşap dili; 9-dilim görsellerin ortası düz ve boş, köşeleri belirtilen ölçüde süslü (ortası esner). İkonlar sade, kalın kontur, küçük boyda okunur. Yazı/harf yok (yazıları oyun yazar). Görselleri adlarına dokunmadan asistana verin.

| # | Dosya | Ne | Format | Gerçek boy | Durum | Not |
|---|---|---|---|---|---|---|
| 1 | `oda-yasam-tam.png` | Yaşam alanı (yatak, radyo, kapı, mantar pano çizili) | 1808×836 (tek şeridin 1/5'i) | 1 m ≈ 180 px | ✅ | Sütunlu 9042×836 şeritten kesildi |
| 2 | `oda-enerji-tam.png` | Enerji odası (jeneratör, duvar enerji üniteleri) | 1808×836 (tek şeridin 1/5'i) | 1 m ≈ 180 px | ✅ | Sütunlu 9042×836 şeritten kesildi |
| 3 | `oda-su-tam.png` | Su arıtma (2 tank + gösterge, filtre ünitesi) | 1808×836 (tek şeridin 1/5'i) | 1 m ≈ 180 px | ✅ | Sütunlu 9042×836 şeritten kesildi |
| 4 | `oda-sera-tam.png` | Sera (cam duvar, yataklar, elektrik kutusu) | 1808×836 (tek şeridin 1/5'i) | 1 m ≈ 180 px | ✅ | Sütunlu 9042×836 şeritten kesildi |
| 5 | `oda-geri-tam.png` | Geri dönüşüm (hurda, tezgâh, konsol, varil) | 1808×836 (tek şeridin 1/5'i) | 1 m ≈ 180 px | ✅ | Sütunlu 9042×836 şeritten kesildi |
| 6 | `manzara-iyi.png` | Şehir panoraması, yeşil | 2172×724 | — | ✅ |  |
| 7 | `manzara-kotu.png` | Aynı panorama, kirli | 2172×724 | — | ✅ |  |
| 8 | `cati.png` | Çatı şeridi, güneş panelleri | 3200×1024, şeffaf | — | ✅ |  |
| 9 | `hikaye-1.png` | Hikaye ekranı: Dünya ısınıyordu | 3:2 yatay | — | ✅ | İlk setten; istenirse yeni stilde yenilenir |
| 10 | `hikaye-2.png` | Hikaye ekranı: Buz çözüldü | 3:2 yatay | — | ✅ | İlk setten; istenirse yeni stilde yenilenir |
| 11 | `hikaye-3.png` | Hikaye ekranı: Büyük Sessizlik | 3:2 yatay | — | ✅ | İlk setten; istenirse yeni stilde yenilenir |
| 12 | `hikaye-4.png` | Hikaye ekranı: Yeşilvadi | 3:2 yatay | — | ✅ | İlk setten; istenirse yeni stilde yenilenir |
| 13 | `kapak.png` | Sunum kapağı | 3:2 yatay | — | ✅ | İlk setten |
| 14 | `oyuncu.png` | Oyuncu (sırt çantalı, kıvırcık saçlı) | 2:3, şeffaf | 1,75 m | ✅ |  |
| 15 | `oyuncu-bekle` | Oyuncu nefes alıyor, 4 kare | 2:3, 2×2 | 1,75 m | ✅ |  |
| 16 | `oyuncu-yuru` | Oyuncu yürüyor, 6 kare | 3:2, 3×2 | 1,75 m | ✅ |  |
| 17 | `oyuncu-calis` | Oyuncu düğmeye basıyor, 4 kare | 2:3, 2×2 | 1,75 m | ✅ |  |
| 18 | `sakin-1.png` | Bastonlu yaşlı sakin | 2:3, şeffaf | 1,7 m | ✅ |  |
| 19 | `sakin-2.png` | Örgülü kadın | 2:3, şeffaf | 1,7 m | ✅ |  |
| 20 | `sakin-3.png` | Deri önlüklü usta | 2:3, şeffaf | 1,7 m | ✅ |  |
| 21 | `sakin-4.png` | Hardal şapkalı gezgin | 2:3, şeffaf | 1,7 m | ✅ |  |
| 22 | `sakin-1-bekle + sakin-1-yuru` | Yaşlı sakin: 2 kare bekleme + 4 kare yürüme | 2:3, 2×3 | 1,7 m | ⏳ | Gelen sette opak duman halesi vardı; temiz arka planla yeniden |
| 23 | `sakin-2-bekle + sakin-2-yuru` | Örgülü kadın | 2:3, 2×3 | 1,7 m | ✅ |  |
| 24 | `sakin-3-bekle + sakin-3-yuru` | Usta | 2:3, 2×3 | 1,7 m | ⏳ | Aynı hale sorunu; yeniden |
| 25 | `sakin-4-bekle + sakin-4-yuru` | Gezgin | 2:3, 2×3 | 1,7 m | ✅ |  |
| 26 | `sakin-selin.png` | Sahnede Selin, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | İsteğe bağlı; yoksa genel sakin görseli kullanılır |
| 27 | `sakin-burak.png` | Sahnede Burak, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | İsteğe bağlı; yoksa genel sakin görseli kullanılır |
| 28 | `sakin-nur.png` | Sahnede Nur, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | İsteğe bağlı; yoksa genel sakin görseli kullanılır |
| 29 | `sakin-can.png` | Sahnede Can, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | İsteğe bağlı; yoksa genel sakin görseli kullanılır |
| 30 | `sakin-muhendis.png` | Sahnede Deniz, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | İsteğe bağlı; yoksa genel sakin görseli kullanılır |
| 31 | `sakin-ciftci.png` | Sahnede Hasan + Elif, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | İsteğe bağlı; yoksa genel sakin görseli kullanılır |
| 32 | `sakin-bilim.png` | Sahnede Dr. Leyla, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | İsteğe bağlı; yoksa genel sakin görseli kullanılır |
| 33 | `sakin-cocuklar.png` | Sahnede Mert + Ada (1,3 m), tam boy | 2:3, şeffaf | 1,7 m | ⏳ | İsteğe bağlı; yoksa genel sakin görseli kullanılır |
| 34 | `sakin-tamirci.png` | Sahnede Kemal, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | İsteğe bağlı; yoksa genel sakin görseli kullanılır |
| 35 | `sakin-kafile.png` | Sahnede 4 kişilik aile, tam boy | 2:3, şeffaf | 1,7 m | ⏳ | İsteğe bağlı; yoksa genel sakin görseli kullanılır |
| 36 | `cop-yigini.png` | Çöp yığını | 3:2, şeffaf | 0,9 × 1,8 m | ✅ |  |
| 37 | `bitki.png` | Saksıda fide | 2:3, şeffaf | 0,65 m | ✅ |  |
| 38 | `bitki-solgun.png` | Solgun fide | 2:3, şeffaf | 0,65 m | ✅ |  |
| 39 | `ziyaretci-muhendis.png` | Portre: Deniz | 1:1 | baş + omuz | ✅ | Yeni stil |
| 40 | `ziyaretci-ciftci.png` | Portre: Hasan + Elif | 1:1 | baş + omuz | 🔁 | Eski stil; Deniz portresiyle aynı stilde yenilenmeli |
| 41 | `ziyaretci-bilim.png` | Portre: Dr. Leyla | 1:1 | baş + omuz | 🔁 | Eski stil; Deniz portresiyle aynı stilde yenilenmeli |
| 42 | `ziyaretci-cocuklar.png` | Portre: Mert + Ada | 1:1 | baş + omuz | 🔁 | Eski stil; Deniz portresiyle aynı stilde yenilenmeli |
| 43 | `ziyaretci-tamirci.png` | Portre: Kemal | 1:1 | baş + omuz | 🔁 | Eski stil; Deniz portresiyle aynı stilde yenilenmeli |
| 44 | `ziyaretci-kafile.png` | Portre: 4 kişilik aile | 1:1 | baş + omuz | 🔁 | Eski stil; Deniz portresiyle aynı stilde yenilenmeli |
| 45 | `kurucu-selin.png` | Portre: Selin | 1:1 | baş + omuz | 🔁 | Eski stil; yenilenmeli |
| 46 | `kurucu-burak.png` | Portre: Burak | 1:1 | baş + omuz | 🔁 | Eski stil; yenilenmeli |
| 47 | `kurucu-nur.png` | Portre: Nur | 1:1 | baş + omuz | 🔁 | Eski stil; yenilenmeli |
| 48 | `kurucu-can.png` | Portre: Can | 1:1 | baş + omuz | 🔁 | Eski stil; yenilenmeli |
| 49 | `logo.png` | Oyun logosu "Son Denge" (başlık ekranı, yükleme) | 768×256, şeffaf | — | ✅ | Oyuna bağlı |
| 50 | `menu-arka.png` | Başlık ekranı ve hikaye kartı arka planı (sığınak dış cephesi, akşam) | 1280×720 | — | ✅ | Oyuna bağlı |
| 51 | `kart-cerceve.png` | Pencere çerçevesi (paneller, radyo, kapı kartı, pano, gece raporu): yıpranmış metal + ahşap kenar, iç rengi CSS | 512×512, 9-dilim (köşe 96 px) | — | ✅ | 9-dilim ile oyuna bağlı |
| 52 | `buton.png` | Buton: küçük metal plaka, perçinli | 384×128, 9-dilim (köşe 32 px) | — | ✅ | Oyuna bağlı |
| 53 | `buton-basili.png` | Aynı buton, basılı/vurgulu | 384×128 | — | ✅ | Oyuna bağlı |
| 54 | `hud-kutu.png` | Üst çubuk kutusu (kaynak göstergeleri) | 256×128, 9-dilim (köşe 24 px) | — | ✅ | Oyuna bağlı |
| 55 | `ikon-enerji.png` | HUD ikonu: Enerji (şimşek) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 56 | `ikon-su.png` | HUD ikonu: Su (damla) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 57 | `ikon-gida.png` | HUD ikonu: Gıda (başak) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 58 | `ikon-atik.png` | HUD ikonu: Atık (çuval) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 59 | `ikon-karbon.png` | HUD ikonu: Karbon (bulut) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 60 | `ikon-nufus.png` | HUD ikonu: Nüfus (iki kişi) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 61 | `ikon-eylem.png` | HUD ikonu: Eylem hakkı (el / dişli) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 62 | `ikon-arastirma.png` | HUD ikonu: Araştırma (cam tüp) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 63 | `ikon-batarya.png` | HUD ikonu: Batarya | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 64 | `ikon-memnuniyet.png` | HUD ikonu: Memnuniyet (yüz) | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 65 | `son-gercek-utopya.png` | Son ekranı görseli: Yeşilvadi nefes alıyor | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 66 | `son-yalniz-utopya.png` | Son ekranı görseli: Yalnız bir ütopya | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 67 | `son-kapimiz-acikti.png` | Son ekranı görseli: Kapımız açıktı | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 68 | `son-guven-kaybi.png` | Son ekranı görseli: Güven oylaması | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 69 | `son-cokus.png` | Son ekranı görseli: Işıklar söndü | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 70 | `kart-itiraz.png` | Karar kartı görseli: Sakinlerin itirazı | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 71 | `kart-karanlik.png` | Karar kartı görseli: Karanlıkta kalan koloni | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 72 | `kart-susuz.png` | Karar kartı görseli: Su paylaşımı | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 73 | `kart-protesto.png` | Karar kartı görseli: Geri dönüşüm protestosu | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 74 | `kart-kompost.png` | Karar kartı görseli: Kompost tartışması | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 75 | `kart-soz.png` | Karar kartı görseli: Yenilenebilir enerji sözü | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 76 | `kart-toz-uyari.png` | Karar kartı görseli: Yaklaşan toz fırtınası | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 77 | `kart-sel-uyari.png` | Karar kartı görseli: Alçak katı su basabilir | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 78 | `kart-bos-makine.png` | Karar kartı görseli: Araştırma mı, tamirat mı? | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 79 | `kart-kesif-batarya.png` | Karar kartı görseli: Keşif ekibinin bulduğu bataryalar | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 80 | `kart-yeni-aile.png` | Karar kartı görseli: Yeni aileye yer var mı? | 3:2 yatay | — | ✅ | Oyuna bağlı |
| 81 | `ikon-batarya-depo.png` | Pano ikonu: Batarya Deposu | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 82 | `ikon-grisu.png` | Pano ikonu: Gri Su | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 83 | `ikon-turbin.png` | Pano ikonu: Verimli Türbin | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 84 | `ikon-hidroponik.png` | Pano ikonu: Hidroponik | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 85 | `ikon-hava-filtresi.png` | Pano ikonu: Hava Filtresi | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 86 | `ikon-yalitim.png` | Pano ikonu: Yalıtım Tesisi | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 87 | `ikon-bariyer.png` | Pano ikonu: Sel Bariyeri | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 88 | `ikon-ek-panel.png` | Pano ikonu: Ek Güneş Paneli | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 89 | `ikon-santral.png` | Pano ikonu: Keşif: santral | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 90 | `ikon-sehir.png` | Pano ikonu: Keşif: eski şehir | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 91 | `ikon-komsu.png` | Pano ikonu: Keşif: komşu yerleşim | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 92 | `ikon-rezervuar.png` | Pano ikonu: Keşif: rezervuar | en çok 256×256, şeffaf | — | ✅ | Oyuna bağlı |
| 93 | `kod:sakin-is` | Sakin sulama/onarım/inceleme/düzenleme hareketleri ve işaretleri | Phaser tween + Graphics | Mevcut karakter boyu | ✅ | Yeni PNG yok; prompt: yok, kodla çiziliyor; `activities.js` hedefleri; 2026-11-01 |

---

## Değişiklik Logu

<!-- Yeni kayıtları bu satırın hemen altına ekleyin (en yeni en üstte). -->

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · PR #12 incelemesi ve çakışma çözümü

- **Prompt:** PR #12'yi incele; uygunsa onu da merge et.
- **Yapılan değişiklik:** Çerçeve PNG'si görsel ve piksel düzeyinde incelendi: boyut 512×512 kaldı, dış köşeler şeffaflaştı; 17.847 değişen pikselin 17.736'sı tamamen şeffaf, 111'i yarı şeffaf kenar pikselleri. Çerçeve/panel görseli korundu. PR #13 main'e merge edildi (`182cede`); #12'ye güncel main alınarak yalnız PROJECT_LOG çakışması iki tarafın kayıtları korunarak çözüldü.

| Dosya | Açıklama |
|---|---|
| `public/assets/kart-cerceve.png` | PR #12'deki şeffaf dış zemin düzeltmesi korundu |
| `PROJECT_LOG.md` | İki tarafın kayıtları ve bu inceleme; PR #13 main'de, #12 için CI tekrar çalışacak |

- **Debt:** Yeni asset yok, mevcut çerçeve düzeltildi; #12 merge/yayın sonucu GitHub PR/Actions kayıtlarında izlenir.


### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · Güncel paketin PR ile birleştirilmesi

- **Prompt:** Gamejam değerlendirmesine devam etmeden önce mevcut hali push, PR ve merge yap.
- **Yapılan değişiklik:** Ses/UI düzeltmeleri, koloni mekanikleri, NPC rutinleri, ilerleme/kayıt ve GameScene modülleri tek yayın paketi olarak hazırlandı. Uzak main ile başlangıç commit'i aynı (`0984d81`); ayrı dal ve [PR #13](https://github.com/Kedaybehzat/son-denge/pull/13) açıldı. İlk paket commit’i `7144f6c`.
- **Dosya / Açıklama:** Bu paketin dosyaları ve testleri önceki ayrı istek kayıtlarında açıklanmıştır; `PROJECT_LOG.md` — yayın talimatı ve doğrulama kaydı.
- **Doğrulama:** Yerel npm test, normal/tek build ve tarayıcı sahne/NPC kontrolleri geçti. Merge öncesi GitHub PR kontrolleri de beklenecek.
- **Debt:** Bu kaydın commit anında PR #13 açıktır; merge/yayın sonucu PR ve Actions kayıtlarından izlenir, kullanıcıya son yanıtta bildirilir. GitHub uygulaması PR yazımında 403 verdiği için mevcut gh oturumu kullanıldı. Gamejam analizi sonraki adım; bu yayın talimatı kapsamında yeni mekanik eklenmedi.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · Gamejam analizine dönüş

- **Prompt:** Önceki gamejam uygunluğu konusundan devam et.
- **Yapılan değişiklik:** Önceki analiz, giriş hikâyesi ve bilgi kartları yeniden gözden geçirildi; kullanıcı önce mevcut sürümün yayınlanmasını istediği için analiz bu işlem sonrasına kaldı. Oyun kodunda değişiklik yok.
- **Dosya / Açıklama:** `PROJECT_LOG.md` — ayrı istek ve devam noktası kaydı.
- **Debt:** Sonraki odak eğitim kazanımı, hikâye/iklim bağı ve sunum kanıtlarının önceliklendirilmesi; ana değerlendirme `docs/hackathon-uyum-analizi.md`.


### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · GameScene sorumluluklarının ayrılması

- **Prompt:** GameScene'i önerilen sorumluluklara göre modüllere ayır.
- **Yapılan değişiklik:** Ana sahne 1649 → 362 satıra indi; yöntem gövdeleri davranış değiştirilmeden alt modüllere taşındı. Önceki performans iyileştirmeleri korundu.

| Dosya | Açıklama |
|---|---|
| `src/scenes/GameScene.js` | Kurulum, oyuncu, etkileşim ve gün akışı; modüllerin açıkça birleştirildiği tek nokta |
| `src/scenes/game/dokular.js`, `yerTutucular.js`, `dokuOnbellegi.js` | Yükleme/ölçekleme/ölçüm, yedek çizimler ve restart boyunca yaşayan doku önbelleği |
| `src/scenes/game/animasyonlar.js`, `sakinler.js` | Animasyon yükleme/oynatma ile NPC hareket/rutin/eşleme ayrıldı |
| `src/scenes/game/dunya.js`, `efektler.js`, `ayarlar.js` | Dünya/dekor/yapı çizimi, görsel geri bildirim/atmosfer ve ortak sabitler |
| `docs/devralma.md`, `AGENTS.md`, `CLAUDE.md`, `PROJECT_LOG.md` | Modül sahipliği, yaşam döngüsü sözleşmesi ve güncel dosya haritası |

- **Doğrulama:** `npm test`, normal ve tek build geçti. Chromium'da ilk kurulum, denge geçişi, tek E dinleyicisiyle restart ve konuşma ipucu doğrulandı. NPC domatese gidip sulama efekti oynattı; oda içi yaklaşık 355 px dolaşma ve görevi değişince iş temizliği geçti. Çatı ek panelleri/yalıtım/bariyer çizimi, kaynak yazıları/duman, ziyaretçi efekti ve gün başlığı callback kontrolü de geçti; JS exception yok. Taşınan yöntem gövdeleri önceki sürümle birebir karşılaştırıldı.
- **Debt:** Modül yöntemleri ortak Phaser sahne bağlamında çalışır; bağımsız sistem nesnelerine dönüştürülmedi. Doku önbelleği eskisi gibi tek Phaser oyunu/restart ömründedir. Büyük bundle uyarısı devam eder; bu düzenleme indirme boyutu veya FPS artışı iddiası değildir. Yeni asset yok; mekanik sayıları değişmedi.


### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · GameScene dosya büyüklüğü değerlendirmesi

- **Prompt:** 1650 satır tek dosya için çok mu, normal mi?
- **Yapılan değişiklik:** Satır sayısının tek başına performans sorunu olmadığı; GameScene'deki asset/doku, dekor, NPC, etkileşim ve efekt sorumluluklarının bakım açısından ayrılması gerektiği açıklandı. Önceki optimizasyonun yapısal bölme olmadığı belirtildi. Oyun kodunda değişiklik yok.
- **Dosya / Açıklama:** `PROJECT_LOG.md` — soru ve değerlendirme kaydı.
- **Debt:** GameScene modüllere ayrılmayı bekliyor; bu soruda refaktör uygulanmadı.


### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · GameScene çalışma maliyeti

- **Prompt:** GameScene dosyasını optimize edelim.
- **Yapılan değişiklik:** Sakin eşlemesi görsel geçişin her karesinden state bildirimine taşındı; yakın sakin araması tek geçişe indirildi; değişmeyen çizimler ve gereksiz tween tekrarları kaldırıldı; restart temizliği düzeltildi.

| Dosya | Açıklama |
|---|---|
| `src/scenes/GameScene.js` | UID Map/Set eşlemesi, dizisiz/sıralamasız yakın sakin seçimi; yalnız hedef değişince tint, yalnız kutu değişince ipucu zemini, yalnız renk değişince şehir çizimi; aynı denge hedefine tween yeniden kurulmaz; E/T dinleyicileri ve text üreticisi shutdown'da temizlenir; zaman/girdi alanları restart'ta sıfırlanır; kayıttan keşifte yüklenen kişi ilk anda da gizli |
| `docs/devralma.md` | Optimizasyon sınırları ve ölçüm yöntemi |
| `PROJECT_LOG.md` | Güncel harita ve bu istek için ayrı kayıt |

- **Doğrulama:** `npm test`, `npm run build`, sözdizimi ve diff kontrolleri geçti. Gerçek Phaser/Chromium kontrolünde 1,7 saniyelik denge geçişinde sakin eşleme 1, sabit ipucu zemini çizimi 1 kez; restart öncesi/sonrası E dinleyicisi 1; konuşma ipucu çalışıyor; JS exception yok. Bu sayımlar FPS veya yüzde performans artışı iddiası değildir.
- **Debt:** Büyük Phaser bundle uyarısı sürüyor. Dosyanın dekor/asset/NPC bölümleri henüz ayrı modüllere taşınmadı; bu çalışma çalışma zamanı tekrarlarına odaklandı. Mekanik sayıları değişmedi, denge simülasyonu yeniden çalıştırılmadı. Yeni asset yok.


### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · Değerlendirme ve odak slaytları

- **Prompt:** Etkinliğin değerlendirme kriterleri ve proje odak alanları görsellerini paylaşma.
- **Yapılan değişiklik:** İki slayt analizde birincil dayanak alındı; yedi alanın tamamının zorunluluğu veya kriter ağırlıkları varsayılmadı.
- **Dosya / Açıklama:** `docs/hackathon-uyum-analizi.md` — görsellerdeki 7 odak ve 10 kriterin mevcut mekaniklerle eşlemesi; `PROJECT_LOG.md` — kaynak kaydı.
- **Debt:** WhatsApp formu, ekip/katılım ve sunum teslimi bu görsellerden veya koddan doğrulanamaz.


### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · Keşif/araştırma/ilişki/senaryo/kayıt paketi

- **Prompt:** Önerilen altı geliştirmeyi uygula; ardından oyunu COP31 destekli iklim gamejam/hackathonunun isterleri ve kriterleri çerçevesinde analiz et (oyun kalitesi değerlendirmesi değil).
- **Durum:** Uygulama ve kriter analizi tamamlandı; yayın/teslim yapılmadı.
- **Yapılan değişiklik:** Altı geliştirme uygulandı, keşif planları araştırma ve inşaata bağlandı; iki kullanıcı slaytı ve resmî GameUP bağlamıyla odak/kriter/öğrenme/teslim eşlemesi yazıldı.

| Dosya | Açıklama |
|---|---|
| `src/data/exploration.js`, `research.js`, `structures.js` | Keşif kararları, pompa planı/teknoloji/depo zinciri; mevcut su ikonu tekrar kullanılıyor |
| `src/data/production.js`, `scenario.js`, `dialogues.js` | Hava üretimi, iki isteğe bağlı hedef, dinlenme sözü seçeneği |
| `src/state.js` | Keşif kararları/dönüş, söz değerlendirme/hafıza, hedefler, hava, kayıt yükleme/sabah kaydetme/sonda silme |
| `src/kayit.js` | Sürümlü ve doğrulanan localStorage kayıt okuma/yazma |
| `src/ui/ui.js`, `src/main.js` | Hedefler paneli, karar düğmeleri/raporlar, hava/söz bilgisi, Devam et ve sahne hazır olduğunda akış |
| `tools/ilerleme-test.mjs`, `package.json` | Yeni anlamlı regresyonlar npm test zincirinde |
| `docs/hackathon-uyum-analizi.md` | Yedi odak alanı, on kriter; kanıtlar ve doğrulanmamış idari/sunum şartları |
| `docs/devralma.md`, `CLAUDE.md`, `AGENTS.md`, `PROJECT_LOG.md` | Yeni kurallar, dosya haritası ve test/devir sınırları |

- **Doğrulama:** `npm test`, `npm run build`, `npm run build:tek` geçti. 36.000 oyun simülasyonu tamamlandı (akıllı/hepsini al gerçek ütopya %74). Tarayıcı: üç keşif kararı, araştırma/hedef paneli ve gün 3 kayıt/devam; sahne yeniden kuruldu, callback çalıştı, JS exception yok. Ekran görüntüleri `/tmp/gameup-ilerleme-*.png`.
- **Debt:** Simülasyon yeni tüm seçim kombinasyonlarını kapsamıyor; ilk oyuncuyla eğitim/erişilebilirlik testi yapılmadı. Kişisel güven yalnız diyalog hafızasıdır. Yağmur deposuna ayrı sahne görseli eklenmedi, mevcut su ikonu kullanılıyor. Kayıt yalnız aynı tarayıcıda ve gün başındadır; depolama engelinde kayıt yok. Büyük Phaser bundle uyarısı sürüyor. Sunum, form ve güncel yayın ayrıca ekip işi; resmî uygunluk/öğrenme kazanımı iddia edilmedi.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · Sonraki geliştirme önerileri

- **Prompt:** Şimdi başka ne yapabiliriz?
- **Yapılan değişiklik:** Mevcut malzeme/üretim/inşaat/diyalog sistemlerinin devamı olarak aşamalı keşif, araştırmayla plan açma, sakinlerin hatırladığı sözler, senaryo hedefleri ve kayıt sistemi önerildi; öncelik keşif → plan → inşaat bağlantısı olarak belirtildi. Oyun kodunda değişiklik yok.
- **Dosya / Açıklama:** `PROJECT_LOG.md` — öneri ve kapsam kaydı.
- **Debt:** Yok; öneriler henüz uygulama talimatı değildir.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · Log disiplini

- **Prompt:** İstekler neden Project Log'a gerektiği şekilde işlenmiyor?
- **Yapılan değişiklik:** Son kullanıcı istekleri ayrı kayıtlara bölündü; tamamlanma/test durumu ve kalan sınırlamalar açıkça kaydedildi, Project Map/dosya ağacı/devir rehberi güncellendi. NPC rutini önce devam ediyor olarak kaydedildi, doğrulama sonrası ilgili kayıt tamamlandı olarak güncellendi.
- **Dosya / Açıklama:** `PROJECT_LOG.md` — bu kayıt ve aşağıdaki beş istek kaydı, harita/dosya ağacı.
- **Debt:** Kayıt gecikmesi giderildi; devam eden işlerin sonuçları ilgili kayıtların durum alanına işlenecek.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · NPC oda rutinleri

- **Prompt:** Sakinler atandıkları odanın tamamında dolaşsın; oda assetlerindeki bitki, tezgâh vb. noktalar incelenip işaretlensin ve buralarda çalışma animasyonları oynasın.
- **Yapılan değişiklik:** Beş mevcut `oda-*-tam.png` görselinden 25 hedef çıkarıldı; odanın tamamında yürüyüş, hedefe gitme, kısa sulama/onarım/düzenleme hareketi ve tekrar dolaşma döngüsü uygulandı.
- **Durum:** Tamamlandı. Beş odada 25 hedef işaretlendi; oda içi serbest yürüyüş ve noktada çalışma döngüsü uygulandı. Chromium'da domatese gidip sulama, sera sınırları içinde 354,72 px dolaşma, su odasına görev değişiminde temizlik doğrulandı.

| Dosya | Açıklama |
|---|---|
| `public/assets/oda-*-tam.png` | Görsel inceleme yapıldı; dosyalar değiştirilmedi |
| `src/scenes/GameScene.js` | `sakinIdleBaslat`, `sakinNoktayaGit`, `sakinIsBaslat`, `sakinRutinDurdur`, `npcNoktalariGoster`: oda rotası, görsel iş hareketleri ve temizlik |
| `src/data/activities.js`, `docs/npc-noktalari.md` | Görselden çıkarılmış x/y ve nesne bölgeleri, debug `?npcNoktalar=1` |
| `tools/uretim-test.mjs` | Noktaların kendi bölgesi ve 0–1 koordinat sınırları doğrulanır |
| `docs/devralma.md`, `CLAUDE.md`, `AGENTS.md` | Yeni malzeme/mod/inşaat/diyalog ve oda rutini anlatımı |
| `docs/asset-listesi.md`, `docs/asset-rehberi.pdf`, `tools/rehber-uret.py` | Prosedürel çalışma hareketi 93. satıra eklendi; toplam 72 hazır/9 yenileme/12 eksik; PDF tablodan dinamik sayar |

- **Debt:** Çalışma hareketleri mevcut sprite üzerinde Phaser tween/Graphics ile yapılır; özel sulama/onarım kareleri henüz yok. Görsel rutinler fazladan kaynak üretmez. Yeni oda assetlerinde koordinatlar tekrar kontrol edilmeli.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · Diyalog sırası

- **Prompt:** Oyuncunun soru paneli gibi sakin cevabı da yalnız Devam içersin; cümleler bittikten sonra seçenekler geri gelsin.
- **Yapılan değişiklik:** Akış seçenek → oyuncu cümlesi/Devam → sakin cevabı/Devam → seçenekler olarak değiştirildi; açılış ve vedalaşma da yanıt alır.
- **Durum:** Uygulandı; Chromium'da yanıt sırasında seçeneklerin bulunmadığı ve sonraki Devam ile döndüğü doğrulandı.

| Dosya | Açıklama |
|---|---|
| `src/ui/ui.js` | `sakinleKonus()` içinde ayrı konuşma ve seçim aşamaları, vedalaşma yanıtı |

- **Debt:** Yok; kalıcı otomatik tarayıcı testi henüz repoda yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · Karakter görsel eşleşmesi

- **Prompt:** Selin/Burak gibi karakterlerin sahne assetleri ve diyalog portreleri uyuşmuyor; konuşmalarda karşılık verilsin.
- **Yapılan değişiklik:** Sıra numarasına bağlı seçim yerine kimliğe sabit görsel eşlemesi eklendi. Koloni ve konuşma portreleri sahnede kullanılan aynı tam-boy görselden alınır; Selin sakin-2, Burak sakin-3 kullanır. Özel sakin-<id> görseli varsa her iki yerde de önceliklidir.
- **Durum:** Uygulandı; görsel seçim fonksiyonu test edildi, Selin/Burak sahne-portre eşleşmesi tarayıcıda doğrulandı.

| Dosya | Açıklama |
|---|---|
| `src/data/assets.js` | `SAKIN_GORSEL_TIPLERI`, `sakinGorselTanimi()` |
| `src/scenes/GameScene.js` | Sakin doku ve animasyon tipi kimlikten seçilir |
| `src/ui/ui.js`, `src/style.css` | `sakinPortresi()` ile aynı görselin üst bölümü portre olarak gösterilir |
| `tools/uretim-test.mjs` | Genel/özel görsel önceliği ve Selin/Burak eşlemesi |

- **Debt:** Genel sprite'lar yer tutucu olarak birden fazla kişi tarafından paylaşılabilir (ör. Selin/Nur). Benzersiz tam-boy assetler mevcut Asset Listesi'nde isteğe bağlı olarak bekliyor; yeni görsel üretilmedi.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · Sakinlerle diyalog

- **Prompt:** Sakinlerle iletişim; konuşma sırasına göre oyuncu sol altta, sakin sağ altta portre çerçevesiyle görünsün ve yanıt seçenekleri seçilebilsin.
- **Yapılan değişiklik:** Yakındaki sakinle E/T veya Koloni panelindeki Konuş üzerinden diyalog açılır. Görev/ihtiyaç sorma, moral verme, dinlendirme ve vedalaşma seçenekleri; konuşmacıya göre tek portre ve dallanan cevaplar eklendi.
- **Durum:** Uygulandı; oyuncu/sakin portre sırası, görev değişimi, moral etkisi ve iki ekran boyutunda sığma kontrol edildi.

| Dosya | Açıklama |
|---|---|
| `src/data/dialogues.js` | Konuşma metinleri ve seçenekler |
| `src/ui/ui.js` | `sakinleKonus()`, koloni konuşma düğmeleri, portreli sahne |
| `src/scenes/GameScene.js` | Yakın sakin tespiti, E/T ve etkileşim ipucu |
| `src/state.js` | `moralVer()`, `moralVerebilirMi()`, günlük `sohbetEdilenler` |
| `src/style.css` | Alt sol/sağ portre çerçeveleri ve konuşma kutusu |

- **Debt:** Moral kişi başına günde bir, 1 eylem; +4 memnuniyet ve −1 yorgunluk. Bilgi konuşmaları ücretsiz. Bu sürümde uzun hikâye dalları/söz sistemi yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · Derinleştirme ilk paketi

- **Prompt:** Önceliklendirilen malzeme döngüsü + oda çalışma modları + inşaatçı görevi paketini uygula ("tamamdır go").
- **Yapılan değişiklik:** Atıktan ayrı malzeme stoğu, gerçek atık miktarına oranlı geri kazanım, üç üretim modu, aşınma/bakım ve iş gücüne bağlı inşaat eklendi.
- **Durum:** Kod ve temel testler tamamlandı; yeni parametrelerin insan playtesti/strateji dengesi değerlendirmesi gerekiyor.

| Dosya | Açıklama |
|---|---|
| `src/data/production.js` | Tasarruf/normal/yoğun çarpanları, ek tüketimler, yorgunluk/aşınma ve bakım maliyeti |
| `src/data/panels.js` | Ayrıştırma ve onarımdan gerçek işlenen atığa oranlı malzeme |
| `src/data/structures.js`, `src/data/research.js` | Malzeme maliyetleri, 2 iş puanlık yapılar, İnşaat görevi |
| `src/state.js` | Malzeme stoğu, mod üretimi, aşınma/bakım; işçi/yardım, duraklat/iptal/iade; gece öncesi yorgunluk ve iş ilerleme planı |
| `src/ui/ui.js`, `src/style.css` | Malzeme sayacı, oda modları/bakım, işçi seçimi ve inşaat işlemleri |
| `tools/mekanik-test.mjs`, `tools/uretim-test.mjs`, `package.json` | Kaynak, malzeme, mod, bakım, iş gücü, duraklatma, iade ve moral regresyonları |

- **Doğrulama:** npm test, normal/tek HTML derlemeleri başarılı. Chromium'da mod seçimi, işçi atama, oyuncu yardımı ve gece tamamlanma doğrulandı. 36.000 oyun simülasyonu tekrar tamamlandı; akıllı+herkesi al %76. Simülasyon yeni modları seçmez, inşaat/keşif stratejisi kullanmaz.
- **Debt:** Tasarruf/yoğun mod ve inşaat ekonomisi için insan playtesti gerekiyor; simülasyon sadece varsayılan normal modu kapsıyor. Ayrı görsel asset gerektiren bir yapı eklenmedi.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** Oyunu derinleştirmek için yeni mekanikler ve mevcut sistem geliştirmeleri öner.
- **Yapılan değişiklik:** Güncel inşaat/araştırma/keşif/sakin sistemleri üzerinden öneriler önceliklendirildi: atık–malzeme ayrımı, oda çalışma modları, inşaatçı görevi, araştırma ile plan açma, aşamalı keşif, kişisel ihtiyaç/sözler ve senaryo akışı. Oyun kodunda değişiklik yok; öneriler henüz uygulanmadı.
- **Dosya / Açıklama:** `PROJECT_LOG.md` — değerlendirme kaydı.
- **Debt:** Yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** Ses kapatılınca çalan ve çakışan müzikleri düzelt; yönetim şeridini tam ekranda da sol alttan 10 px boşlukla yerleştir; oda/etkileşim etiketlerine hafif stil ekle.
- **Yapılan değişiklik:** İptal edilebilir fade-in ve güvenli asenkron play akışıyla tek müzik kuralı sağlandı; tüm efektler susturmaya dahil edildi. Yönetim şeridi HUD yerine doğrudan sahneye sabitlendi; oda ve etkileşim etiketlerine düşük kontrastlı zemin/ince kenarlık eklendi.

| Dosya | Açıklama |
|---|---|
| `src/sesler.js` | Eski parçayı anında durdurma, bekleyen play/fade koruması, efekt susturma, HMR temizliği, Vite taban yoluna uygun ses URL'leri |
| `tools/ses-test.mjs`, `package.json` | `npm test` içinde 5 ses yarış durumu/ayar senaryosu |
| `src/ui/ui.js`, `src/style.css` | Yönetim erişimi sahne altında sol/alt 10 px; hikâye/menü görünürlüğü HUD ile birlikte yönetilir |
| `src/scenes/GameScene.js` | Barlow oda levhaları, küçük Nunito etkileşim metni, yuvarlak yarı saydam zemin ve ince kenarlık; ipucu ekran kenarına sığdırılır |
| `SOUNDS.md`, `PROJECT_LOG.md` | Güncel ses davranışı, testler, Project Map ve değişiklik kaydı |

- **Doğrulama:** `npm test` ve üretim derlemesi başarılı. Gerçek Audio nesneleriyle Chromium: kapalıyken 0 ses; hızlı geçişten sonra yalnız `muzik-umut.mp3` çalıyor. Normal 1440/900 ve gerçek fullscreen modunda şerit sol/alt boşluğu 10 px. Oda/etkileşim etiketleri görsel olarak kontrol edildi; ayarlar açılınca ipucu ve zemini birlikte gizleniyor.
- **Debt:** Yok. Parça geçişi eski parçayı kesip fade-in yapar; aynı anda iki parçayı çalan crossfade kaldırıldı.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** Main dalına gelen yeni commitleri çek.
- **Yapılan değişiklik:** Uzak dallar güncellendi; temiz `menu-cerceve` dalından `main`e geçildi ve yerel main `7ee21ab` → `0984d81` fast-forward edildi (12 commit). Ses/müzik, ayarlar/tam ekran, yapı görselleri ve çatı düzeltmeleri alındı.
- **Dosya / Açıklama:** `PROJECT_LOG.md` — yalnızca bu yerel senkronizasyon kaydı; oyun kodunda ek değişiklik yapılmadı.
- **Debt:** Yok.

### 2026-11-01 · Ayberk Alkan (ayberk2002alkangizli@gmail.com) · `oynanabilirlik` → `main`

- **Prompt:** Çatıdaki güneş panelleri başta az olsun; tam ekran; ayarlar menüsü; giriş menüsü; Shift ile hızlı yürüme; yapılar inşa edilince sahnede görsel karşılık. Asset gereği doğarsa yaz.
- **Yapılan değişiklik:** `oynanabilirlik` branch (main `83cf8b5`'in üstüne rebase edildi), 4 commit → main `39589a8`; ardından yalıtım/bariyer kodla çizim polish (`496e176`). Shift ile koşu arkadaş tarafından zaten eklenmişti (M14), diğerleri bu oturumda:
  - **M10 — Çatıda güneş paneli sayısı dinamik** (`2ba17b3`): `cati.png` tileSprite yerine karo karo image. Başlangıçta 2 karo, Ek Güneş Paneli yapısı inşa edilince +2. `_cizCatiPanelleri()` `gorselGuncelle`'de her state değişiminde çağrılır, idempotent.
  - **M11 — F tuşuyla tam ekran** (`031eb0e`): Browser native Fullscreen API; `tamEkranToggle()` dışa açık (window + export). CSS `#sahne:fullscreen` 16:9 oranı korur.
  - **M12 + M13 — Ayarlar + giriş menüsü** (`8e19697`): `ayarlarAc(donus)` (Tam ekran toggle + kontrol listesi); `baslangicEkrani` iki butonlu (Başla / Ayarlar); HUD'a küçük ⚙ düğmesi — oyun içinde ayarları açar.
  - **M15 — Yapılar sahnede görsel** (`b327abb` + `496e176`): Yalıtım kenar duvarlara açık yeşil panel (alüminyum başlık, dikey segment, lattice desen, vidalar, iç gölge). Sel Bariyeri sera önüne T profilli beton (sarı-siyah uyarı bandı, drenaj delikleri, segment çizgileri, zemin gölgesi). Ek Güneş Paneli zaten M10 ile çatıda +2 panel.
- Simülasyon dengesinde değişiklik yok (asset/UI işi).

| Dosya | Açıklama |
|---|---|
| `src/main.js` | `tamEkranToggle()`, 'F' key handler, `window.tamEkranToggle` |
| `src/scenes/GameScene.js` | `_cizCatiPanelleri()`, `_cizYapilar()` (yalitim + bariyer kodla çizim) |
| `src/style.css` | `#sahne` siyah bg + fullscreen, `.menu-butonlar`, `.ayarlar`, `.kontrol-liste`, `.ayarlar-btn` |
| `src/ui/ui.js` | `ayarlarAc(donus)`, `baslangicEkrani` düğme sırası, HUD'a ⚙ |
| `PROJECT_LOG.md` | Project Map'e Ayarlar menüsü + Tam ekran satırları; bu kayıt |

- **Debt:** Yeni açık borç yok. İsteğe bağlı asset: `yapi-yalitim.png`, `yapi-bariyer.png` — şimdilik kodla çiziliyor, promptlar sohbette verildi; gelirse `_cizYapilar` yerine `this.add.image` ile değiştirilir.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `menu-cerceve`

- **Prompt:** Yüklediğim dosyaları oyuna aktar (menü asset'leri; kullanım sınırı sonrası devam).
- **Yapılan değişiklik:** Menü asset'leri ve bağlantıları main'e zaten girmişti (`83cf8b5`). Kalan tek sorun giderildi: `kart-cerceve.png` dışı beyaz zeminliydi (9-dilim çerçevenin köşelerinde beyaz görünüyordu); kenardan flood-fill ile beyaz silindi, iç panel ve metal/ahşap kenar korundu (orijinal `assets-orijinal/kart-cerceve-beyaz.png`). Başlık, panel, karar kartı, son ekranı headless görüntüyle doğrulandı; `npm test` ve derleme temiz.

| Dosya | Açıklama |
|---|---|
| `public/assets/kart-cerceve.png` | Dış beyaz zemin şeffaf |

- **Debt:** Yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · PR #11

- **Prompt:** Push, PR ve merge; rehber/log dosyalarını devralacak ekip arkadaşının tüm asset ve mekanik geliştirmelerine devam edebileceği şekilde güncelle.
- **Yapılan değişiklik:** Güncel devir rehberi ve README hazırlandı, asset PDF'i 17 sayfa olarak yeniden üretildi; promptlar, mevcut ayarlar ve proje haritası eşitlendi. Tüm oturum değişiklikleri mevcut `asset-listesi-guncel` dalındaki PR #11 üzerinden `main`e sunuluyor.

| Dosya | Açıklama |
|---|---|
| `docs/devralma.md`, `README.md` | Kurulum, kontroller, beş panel, inşaat yaşam döngüsü, hareket, asset akışı, dosya eşlemeleri, test kapsamı ve sıradaki işler |
| `docs/asset-rehberi.pdf`, `tools/rehber-uret.py` | 92 güncel asset satırı, mevcut görsel örnekleri, odalar ve üç sanat stili sayfası; tekrar üretilebilir PDF (Python 3 + Pillow) |
| `docs/asset-promptu.md` | Hazır 44 UI assetini yeniden istemeyen, 2 animasyon seti + 9 portre + 10 isteğe bağlı sprite için 21 maddelik prompt |
| `docs/final-asset-promptu.md`, `docs/sifirdan-asset-promptu.md` | Arşiv uyarıları ve güncel kaynak bağlantıları |
| `CLAUDE.md`, `AGENTS.md`, `docs/olcek-standardi.md` | Gerçek yorgunluk eşikleri (4 uyarı, 5 risk, %20 pay), ölçek 74, güncel mekanik/devir referansları |
| `docs/asset-listesi.md`, `PROJECT_LOG.md` | Hazır/yenilenecek/eksik durumları, Project Map, tarihsel borç açıklamaları ve devir kaydı |
| `.github/workflows/checks.yml` | PR'da Node 22 ile npm ci, test, normal ve tek HTML derlemesi |

- **Doğrulama:** `npm test`, `npm run build`, `npm run build:tek`, asset kontrolü başarılı; PDF 17 sayfa olarak açıldı ve örnek sayfaları görsel olarak incelendi. Bu oturumdaki 36.000 oyun simülasyonu ve tarayıcı kontrollerinin ayrıntıları önceki kayıtta.
- **Debt:** PDF üretimi için Python/Pillow gerekir; oyun için gerekmez. İnşaat iptali/inşaatçı ataması ve dünyada ayrı yapı sprite'ı yok; devir rehberinde açık. Orijinal asset yedekleri git dışında ve push ile paylaşılmaz. Merge/yayın sonucunun kaynağı PR #11 ve GitHub Actions'tır; bu kayıt işlem öncesi devir kaydıdır.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** Mekanik iyileştirmelere devam; küçük bir inşaat sistemi; koloni, oda, keşif ve araştırma panellerini ayır; koşma ekle ve NPC yürüyüşünü düzelt.
- **Yapılan değişiklik:** Beş ayrı yönetim paneli ve alt erişim şeridi, oda filtreli bir gecelik inşaat, Shift ile koşma, hızla uyumlu NPC yürüyüşü ve kaynak/karar doğrulamaları eklendi.

| Dosya | Açıklama |
|---|---|
| `src/ui/ui.js` | Koloni, Odalar, Keşif, Araştırma ve İnşaat panelleri; sabit panel geçişi, alt erişim; oda kontrolü/inşaat filtresi; tamamlanma raporu ve kaynak uyarıları |
| `src/style.css` | Yönetim erişimi, panel geçiş şeridi, oda kartları ve filtre stilleri |
| `src/state.js` | Kaynak yeterliliği, tek aktif inşaat/gece tamamlanma, gerçek kapı/hazırlık kartları; yeni sakin UID çakışması önlendi |
| `src/data/structures.js` | Oda ve süre bilgileri; Su Geri Kazanım Hattı, Onarım Tezgâhı; yapıların malzeme maliyetleri |
| `src/data/cards.js` | Aile kartına ziyaretçi koşulu; kapı kararları ve yarının olayına gerçek hazırlık |
| `src/data/rooms.js` | Pano adı Sığınak Yönetimi |
| `src/scenes/GameScene.js` | Shift ile ×1,65 koşma; NPC hızı 85 px/sn, mesafeye bağlı tween süresi, duraklama ve hıza bağlı animasyon |
| `tools/mekanik-test.mjs`, `package.json` | `npm test`: maliyet reddi, az atık temizleme, inşaat yaşam döngüsü, kapı kararları ve olay hazırlığı regresyonları |
| `tools/simulasyon.mjs` | Yalnızca yapılabilir eylemler seçilir; boş kart havuzu/başarısız eylem döngüsü korunur |
| `CLAUDE.md`, `AGENTS.md`, `PROJECT_LOG.md` | Mekanikler, kontroller, Project Map ve güncel simülasyon sonuçları |

- **Doğrulama:** Mekanik testleri ve Vite derlemesi başarılı. 36.000 oyun simülasyonu tamamlandı; akıllı+herkesi al iyi son %76, kimseyi alma yalnız ütopya %100. İnşaat/keşif stratejileri bu simülasyona dahil değil. Chromium'da 1440×900 ve 900×600'de beş panel, görev/araştırma/keşif ve inşaat akışları hatasız; yatay taşma yok.
- **Debt:** Yeni görsel gerekmiyor; yeni yapılar mevcut ikonlarla yönetiliyor. D2 kısmen kapandı (temel mekanik regresyonları eklendi); D10/D12 tarihsel sonuçlar olarak işaretlendi. Diğer tasarım önerileri (eylem çeşitlendirme, araştırma süresi, kademeli yorgunluk) bu değişiklikte uygulanmadı.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** Oyunun mekaniksel olarak geliştirilebilecek yanları neler?
- **Yapılan değişiklik:** Mekanikler kod ve doküman üzerinden değerlendirildi; kaynak maliyetleri, eylem çeşitliliği, yatırım geri dönüşü, yorgunluk, hazırlık ve karar tutarlılığı için öneriler sunuldu. Oyun kodunda değişiklik yok.
- **Dosya / Açıklama:** `PROJECT_LOG.md` — değerlendirme kaydı.
- **Debt:** Yok; öneriler uygulanmadı. D10/D12 kayıtlarındaki eski sayılar güncel AYAR değerleri yerine kullanılmadı.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** Yazılara ve genel metinlere font ekle.
- **Yapılan değişiklik:** Başlık ve butonlarda Barlow Condensed, genel metinlerde Nunito Sans kullanıldı; fontlar Google Fonts çalışma zamanı bağımlılığı yerine yerel dosyalardan yüklenir.

| Dosya | Açıklama |
|---|---|
| `public/fonts/` | Türkçe destekli beş font dosyası ve iki OFL lisansı (toplam yaklaşık 520 KB) |
| `index.html` | Harici font bağlantıları kaldırıldı, temel yerel fontlar önden yüklenir |
| `src/style.css` | Yerel @font-face tanımları, ortak font değişkenleri ve tipografi düzeni |
| `src/scenes/GameScene.js` | Canvas yazılarında da yeni fontlar kullanılır |
| `src/main.js` | Phaser başlamadan canvas fontlarının yüklenmesi beklenir |
| `PROJECT_LOG.md` | Project Map, dosya ağacı ve değişiklik kaydı |

- **Doğrulama:** Beş fontun Türkçe glifleri kontrol edildi; Chromium'da 1440×900 ve 900×600 boyutlarında beş ekran yatay taşma ve JavaScript hatası olmadan açıldı; üretim derlemesi başarılı.
- **Debt:** Yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** Gün/eylem/kişi kutusunun taşmasını düzelt; kutu içlerini koyudan açığa çek.
- **Yapılan değişiklik:** Gün kutusunun genişliği ve satır aralıkları artırıldı; HUD, pencere ve buton içleri daha açık zeytin yeşili yapıldı.

| Dosya | Açıklama |
|---|---|
| `src/style.css` | Gün kutusuna sabit yeterli genişlik, kompakt satır ve eylem noktaları; çerçevelerin koyu merkez dolgusu kaldırılarak açık iç renkler ve okunaklı metinler uygulandı |
| `PROJECT_LOG.md` | Değişiklik kaydı |

- **Doğrulama:** Gün kutusu 1440 ve 900 px genişlikte, 4 eylem ve 18 kişiyle tarayıcıda kontrol edildi; satır taşması yok.
- **Debt:** Yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** Menüde sığmayan alanları düzenle.
- **Yapılan değişiklik:** Modal çerçevesi sabitlendi, içerik ayrı kaydırma alanına alındı ve doğrudan alt şeritler sürekli görünür yapıldı; menü, hikâye, son ve pano yerleşimleri sıkıştırıldı.

| Dosya | Açıklama |
|---|---|
| `src/ui/ui.js` | `modalAc()` içinde `.kart-icerik` kaydırma alanı, sabit alt şerit ve pano yenilenirken kaydırma konumunu koruma |
| `src/style.css` | Pencere yükseklik sınırı, satır saran butonlar, üç sütunlu görevler, geniş pano ve kompakt menü/hikâye/son yerleşimi |
| `PROJECT_LOG.md` | Project Map ve değişiklik kaydı güncellendi |

- **Doğrulama:** Derleme başarılı; Chromium'da 1440×900, 1366×768, 900×600 ve 844×390 boyutlarında beş ekran kontrol edildi. Yatay taşma veya sahne dışına çıkan pencere yok; pano alt şeridi görünür.
- **Debt:** Yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** Yüklenen interface assetlerini incele ve oyuna geçir.
- **Yapılan değişiklik:** 44 arayüz görseli menü, HUD, pano, karar kartları ve son ekranlarına bağlandı; orijinaller yedeklenerek toplam boyut 28,1 MB'tan 13,9 MB'a indirildi.

| Dosya | Açıklama |
|---|---|
| `src/data/assets.js` | İkon, karar ve son eşlemeleri ile ortak arayüz dosya kaydı |
| `src/ui/ui.js` | Görsel yardımcıları, logo, menü ortamı, HUD/pano ikonları, 11 karar ve 5 son görseli |
| `src/style.css` | 9-dilim metal/ahşap çerçeveler, buton durumları, HUD kutuları ve görsel yerleşimleri |
| `public/assets/` (44 PNG) | Yüklenen görseller uygun boyutlara küçültülüp optimize edildi; orijinaller git dışı `assets-orijinal/arayuz/` altında |
| `tools/asset-durum.mjs` | Arayüz dosyaları artık ortak kayıttan denetlenir |
| `PROJECT_LOG.md`, `docs/asset-listesi.md` | Asset durumları, Project Map ve borç kaydı güncellendi |

- **Doğrulama:** Vite derlemesi ve asset kontrolü başarılı; Chromium'da menü, pano, karar ve son ekranları kontrol edildi.
- **Debt:** Kapandı: D16.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** CLAUDE.md dosyasını aynen al ve Codex'e uyarla.
- **Yapılan değişiklik:** CLAUDE.md içeriği eksiksiz AGENTS.md'ye aktarıldı; dosyanın kendisine yönelik referanslar AGENTS.md olarak uyarlandı.

| Dosya | Açıklama |
|---|---|
| `AGENTS.md` | Tüm proje dokümanı ve çalışma kuralları korundu; CLAUDE.md dosya referansları AGENTS.md olarak uyarlandı |
| `PROJECT_LOG.md` | Project Map, dosya ağacı ve değişiklik kaydı güncellendi |

- **Debt:** Yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `asset-listesi-guncel`

- **Prompt:** Prompt da verir misin.
- **Yapılan değişiklik:** `docs/asset-promptu.md` güncel listeye göre yeniden yazıldı: PDF ile yüklenir, her yanıtta tek görsel, 55 madde (2 sakin animasyonu, 9 portre yenileme, menü: çerçeve/buton/HUD/10 ikon/logo/arka plan/5 son görseli; isteğe bağlı 11 kart görseli + 12 pano ikonu). Hale sorununa karşı "temiz şeffaf arka plan, karakter etrafında duman/gölge yok" kuralı eklendi.

| Dosya | Açıklama |
|---|---|
| `docs/asset-promptu.md` | Yeniden yazıldı |

- **Debt:** Yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `asset-listesi-guncel`

- **Prompt:** Oyundaki menüleri de güncellemek istiyorum, menüler için asset listesi; genel olarak bütün asset listesini güncel duruma çek; PDF'i de güncel asset bilgileri ve rehberle güncelle.
- **Yapılan değişiklik:** Asset Listesi baştan, oyunun son hâline göre: 92 satır, durumlu (27 ✅ hazır, 9 🔁 eski stil portreler, 12 ⏳ eksik: yaşlı sakin/usta animasyonları + isteğe bağlı karakter sprite'ları, 44 yeni menü asset'i: logo, menü arka planı, 9-dilim pencere çerçevesi/buton/HUD kutusu, 10 HUD ikonu, 5 son ekranı görseli, 11 karar kartı görseli, 12 pano ikonu). Menüler şu an HTML/CSS + emoji; menü asset'leri gelince kodla bağlanacak. PDF yeniden yazıldı (14 sayfa): renkli durum tablosu, oyundaki 5 odanın güncel görüntüsü, mevcut karakter/nesne/animasyon/portre örnekleri, menü rehberi (her menünün ekran görüntüsü ve hangi asset'in nereye gideceği, 9-dilim kuralları), sanat stili rehberi.

| Dosya | Açıklama |
|---|---|
| `docs/asset-listesi.md`, `PROJECT_LOG.md` | Güncel liste |
| `docs/asset-rehberi.pdf` | Yeniden üretildi |

- **Debt:** Yeni D16: menü asset'leri (9-dilim çerçeve, butonlar, ikonlar, son/kart görselleri) gelince `ui.js`/`style.css`'e bağlanacak.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `asset-temizlik` → `main`

- **Prompt:** Önce dosyaları düzenle; sonra push'la ve hepsini merge et.
- **Yapılan değişiklik:** Yarıda kesilen bir push, ham yükleme dosyalarıyla (30 dosya, ~75 MB) birlikte eski commit'i göndermiş ve PR #9 onu merge etmişti. Bu commit ham dosyaları `public/assets/`'ten kaldırır (yedekleri `assets-orijinal/yeni2/`, git dışı); oyunun kullandığı dosyalar değişmez.

| Dosya | Açıklama |
|---|---|
| `public/assets/*` (30 ham dosya) | Silindi |

- **Debt:** Ham dosyalar git geçmişinde kalıyor (repo boyutu); temizlemek için geçmişi yeniden yazmak gerekir, yapılmadı.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `asset-promptu-2` → `main`

- **Prompt:** Yeni yüklediğim asset'leri incele, iyi olanları kullan (önceki mesaj: PR #9 merge'ü gelen asset'lerle birlikte).
- **Yapılan değişiklik:** 30 dosya incelendi (orijinaller `assets-orijinal/yeni2/`). Odalar: `son-denge-tum-odalar-sutunlu-ultra-genis.png` (9042×836, 5 oda + geçiş sütunları, nesneler sahnede çizili) beşe bölündü → `oda-<tip>-tam.png`, magenta camlar şeffaf; tek şerit olduğundan ölçek ve zemin her odada aynı, geçişler dikişsiz. Kod: `ODA_GENISLIK` 739 (dilim oranı), yeni etkileşim konumları (`nesneOran`), duvara monte nesneler için `nesneY`, su göstergeleri, duman noktaları (jeneratör bacası, varil), kodla çizilen kolonlar birleşik şeritte kapalı, `PX_METRE` 74 (kapı 2,1 m ölçümü). Karakterler: yeni oyuncu (sırt çantalı) + bekle/yürü/çalış, sakin-1..4 yeni, örgülü kadın ve şapkalı gezgin bekle+yürü (ayak hizalı kesim). Ayrıca çöp yığını, iki saksı, Deniz portresi, iyi/kötü manzara, çatı. Kullanılmayanlar: yaşlı sakin ve usta yürüme setleri (opak hale, temizlenemedi; eski yaşlı işçi animasyonu da kaldırıldı), kampçı vanı (listede yok), tek tek oda görselleri ve sütunsuz şerit (sütunlu şerit seçildi), geçiş sütunu (şeritte var). Eski dosyalar `assets-orijinal/eski2/`. Doğrulama: 5 oda ekran görüntüsü, 8 etkileşimin ipucu, konsol hatası yok, derleme temiz.

| Dosya | Açıklama |
|---|---|
| `public/assets/oda-*-tam.png` (yeni), `oda-*.png` (kaldırıldı) | Birleşik odalar |
| `public/assets/*`, `public/assets/anim/*` | Yeni karakter, animasyon ve nesneler |
| `src/data/rooms.js` | `ODA_GENISLIK` 739, `nesneY`, yeni oranlar |
| `src/data/assets.js` | `PX_METRE` 74 |
| `src/scenes/GameScene.js` | `nesneY` desteği; birleşik şeritte kod kolonu yok |

- **Debt:** D15 kapandı (tek şerit, tek ölçek). Eksik: yaşlı sakin ve usta animasyonları, portrelerin (Deniz dışında) yeni stilde sürümleri.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `asset-promptu-2`

- **Prompt:** PR #8'i main ile birleştir ve merge et; sonra hiç asset yokmuş gibi oyunun güncel hâline göre düz bir liste ve asset rehberiyle birlikte yüklenecek düzgün bir prompt ver.
- **Yapılan değişiklik:** main (Ayberk: 5 kart, Seviye II araştırma, üs inşası) birleştirildi, PR #8 merge edildi (`ed4338f`). `docs/asset-listesi.md` 38 maddelik düz liste (oyunda 42 dosya). `docs/asset-promptu.md`: PDF ile yüklenecek prompt; her yanıtta tek görsel, "next" ile ilerleme (önceki tek seferlik uzun prompt dağılıyordu); odalar orijinal görsellere göre etkileşimli nesneler içine çizili; oyuncu stil rehberindeki onaylı karaktere göre. PDF'in liste sayfası yenilendi.

| Dosya | Açıklama |
|---|---|
| `docs/asset-listesi.md`, `docs/asset-promptu.md` | Yeni/yeniden |
| `docs/asset-rehberi.pdf` | Liste sayfası güncel |
| `PROJECT_LOG.md` | Asset Listesi, ağaç |

- **Debt:** D15 sürüyor.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `asset-promptu`

- **Prompt:** oda-sablonlari'na eklediğim (çok beğendiğimiz, ama nesneleri sonradan ekleyince karışık/ölçeksiz olduğu için kullanamadığımız) görseller üzerinden asset rehberini yap; PDF'i de güncelle.
- **Yapılan değişiklik:** İlk oda görselleri `docs/orijinal/` altına sabit adlarla taşındı. Yaklaşım: nesneler sonradan eklenmez; ya görselde var olan öğe etkileşimli yapılır (yatak, mantar pano, jeneratör, duvar invertörleri, tanklar, filtre ünitesi, elektrik kutuları, hurda kasaları) ya da orijinal görsel "edit" ile değiştirilir (yaşam: radyo + kapı; geri dönüşüm: dosya dolabı → konsol; hepsinde camlar magenta). Her oda için zemin çizgisi ve ölçek ölçüldü (145–205 px/m) ve plan görseli üretildi (`plan-<oda>.jpg`). Asset listesi sadeleşti: 5 oda düzenlemesi + 24 karakter/dinamik nesne + 11 arayüz görseli; ayrı kapı/panel/radyo/pano/yatak ve bunların animasyonları artık gereksiz. PDF baştan yazıldı (10 sayfa: liste, her oda için orijinal + plan + İngilizce edit promptu, stil rehberi).

| Dosya | Açıklama |
|---|---|
| `docs/orijinal/*.png` | Ekipten (yeniden adlandırıldı) |
| `docs/oda-sablonlari/plan-*.jpg` | Yeni |
| `docs/asset-listesi.md`, `docs/asset-rehberi.pdf` | Yeniden yazıldı |
| `PROJECT_LOG.md` | Asset Listesi, ağaç |

- **Debt:** Yeni D15: odaların ölçekleri farklı (yaşam 165, enerji 145, su 172, sera 157, geri dönüşüm 205 px/m); düzenlenmiş görseller gelince oyunda oda başına ölçek normalizasyonu (`ODALAR[].gorsel.pxm`, oda başına genişlik) ve yeni etkileşim konumları ayarlanmalı. Sera ve oda görsellerindeki öğeler etkileşimli olduğundan oyunun ayrı nesne sprite'ları bu odalarda gizlenmeli.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `asset-promptu`

- **Prompt:** Kapsamlı prompt/rehber işe yaramadı; sadece sıfırdan bir asset listesi, olması gereken boyutlarıyla. Stil rehberini kendisi yükleyecek.
- **Yapılan değişiklik:** Asset Listesi sadeleştirildi: 72 satır, her biri için tuval boyutu (px) ve nesnenin tuvaldeki boyu. Ölçek tuval kuralıyla sabit (karakter/nesne 1 m = 600 px, taban alttan 40 px; odalar 1920×820, zemin çizgisi y=611, 1 m ≈ 148 px); odalarda ayrılacak alanlar piksel aralığıyla. Uzun prompt kullanılmıyor.

| Dosya | Açıklama |
|---|---|
| `docs/asset-listesi.md` | Yeni |
| `PROJECT_LOG.md` | Asset Listesi yeniden yazıldı |

- **Debt:** Yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `asset-promptu`

- **Prompt:** Ben üreteceğim: sıfırdan, ayrıntılı asset listesi/prompt ver. + Örnek eski asset'ler, ölçek rehberi ve tema rehberini içeren bir PDF oluştur, GPT'ye kaynak olarak yükleyeceğim.
- **Yapılan değişiklik:** PR #7 merge edildi. `docs/sifirdan-asset-promptu.md`: 72 maddelik yapıştırılacak İngilizce prompt (genel stil, ölçek standardı, nesne/animasyon/oda kuralları, odaların boş + birleşik sürümleri, içerik ve ayrılacak alanlar, karakter tarifleri, ızgara düzenleri). `docs/asset-rehberi.pdf` (24 sayfa, 12,9 MB): kapak + 8 temel kural, ekibin Ana Sanat Stili Rehberi (3 sayfa; docs'a gelen ChatGPT görselleri `sanat-stili-1..3.png` olarak adlandırıldı), renk paleti + stil blokları, ölçek standardı + şablon + gerçek boy tablosu, oda kuralları + güncel konumlarla yeniden üretilen 5 yerleşim şablonu, örnek mevcut asset'ler (odalar, karakter/nesneler, animasyon şeritleri, portreler, hikaye, manzara, çatı), tam asset listesi, prompt. Asset üretilmedi.

| Dosya | Açıklama |
|---|---|
| `docs/asset-rehberi.pdf` | Yeni |
| `docs/sifirdan-asset-promptu.md` | Yeni |
| `docs/sanat-stili-1..3.png` | Ekipten (yeniden adlandırıldı) |
| `docs/oda-sablonlari/*.png` | Güncel konumlar, birleşik sürüm işaretleri |
| `PROJECT_LOG.md` | Asset Listesi'ne referanslar, ağaç, bu kayıt |

- **Debt:** Yok. Not: PDF, scratch'teki bir Playwright betiğiyle üretildi; liste değişirse asistandan yeniden üretmesi istenmeli. PR merge izni otomatik verilmedi.

### 2026-11-01 · Ayberk Alkan (ayberk2002alkangizli@gmail.com) · `son-mekanikler` branch

- **Prompt:** GDD'nin kalan mekaniklerini (karar kartı eksikleri, araştırma Seviye II, üs inşası) tek branch'te, ayrı commitlerle yap.
- **Yapılan değişiklik:** Üç büyük sistem eklendi, hiçbiri sim dengesini bozmadı. Branch `son-mekanikler` (3 commit + bu kayıt).
  - **5 yeni karar kartı** (`04b3c6b`): tozUyari (tahmin=toz), selUyari (tahmin=sel), bosMakine (boş makine + 2. gün), keşifBataryalari (kesfedilen=santral), yeniAile (gıda<35 + 2. gün). `kartKosuluVar` yeni koşul tipleri: `tahmin`, `olay`, `bosMakineVar`, `kesfedilen`.
  - **Araştırma Seviye II** (`62c6fbf`): Verimli Türbin (+4 enerji/gece), Hidroponik (+3 gıda, −1 su), Hava Filtresi (−3 karbon/gece). `onKosul` ile Seviye I'den biri bitince açılıyor. `arastirmaSec` ve `puanEkle` koşulu dikkate alıyor; panoda kilitli projeler "🔒 Seviye I bitince açılır" diyor.
  - **Üs İnşası (minimal)** (`d2ee1b4` + sonraki maliyet ayarı): 3 yapı — Yalıtım, Sel Bariyeri, Ek Güneş Paneli. Her yapı tek seferlik, kalıcı; eylem + kaynak maliyeti; `olayAzalt` ile sıcak/toz/sel zararını yarıya indirir, Ek Panel her gece +3 enerji. `state.yapilar`, `yapiKur`, `yapiKurabilirMi`, `yapiAcik`, `YAPILAR`. `olayEtkisi()` artık `olayCarpani()` üzerinden hazırlık ve yapı çarpanlarını birleşik uyguluyor. Panoda yeni "İnşa" bölümü.
- Simülasyon: akıllı+hepsiniAl %66 iyi son (önceki %74'ten düşüş kartların gösterilme state'inden kaynaklı yan etkiden; sim kart seçmez ama rastgele akışı değişti); akıllı+kimseyiAlma %96 yalnız ütopya. Kirli hep çöküş. Sim yapı inşasını kullanmıyor (5 günlük demo için eylem maliyeti dengeyi bozar; gerçek oyuncu değerlendirmeli).

| Dosya | Açıklama |
|---|---|
| `src/data/cards.js` | 5 yeni kart (D, E, F, G, H), kosul yorum satırları güncellendi |
| `src/data/research.js` | 3 Seviye II araştırma + `onKosul` + `seciliebilirArastirmalar` yardımcı |
| `src/data/structures.js` | **Yeni dosya** · YAPILAR tanımı (yalitim, bariyer, ekPanel) |
| `src/state.js` | `kartKosuluVar` yeni koşul tipleri; `arastirmaSec`+`puanEkle` onKosul; `olayCarpani` + `olayEtkisi` yapı çarpanıyla birleşti; `yapiAcik`/`yapiKur`/`yapiKurabilirMi`; `geceHesapla` yapı geceEtkilerini topluyor; `sifirla`'da `state.yapilar` |
| `src/ui/ui.js` | Panoda kilitli araştırma gösterimi; yeni "İnşa" bölümü (`yapilarHtml`) + buton bağlantıları |
| `src/style.css` | `.proje.kilitli`, `.proje[data-yapi]` stilleri |
| `tools/simulasyon.mjs` | Akıllı stil Seviye II kuyruğunu kullanıyor; yapı inşası sim dışında bırakıldı (notla belgelendi) |
| `PROJECT_LOG.md` | Project Map'e yapı eklendi; bu kayıt |

- **Debt:** Yeni açık borç yok. D6 playtest hâlâ gerekli. D10 (yorgunluk) açık.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `animasyon-duzeltme` → `main`

- **Prompt:** Commit, push, PR, merge; main'deki yenilikleri çek, bizimkileri push'layıp mergele; komple yeniden asset üretimi için oyunun güncel hâline göre sıfırdan, kategorisiz tek bir asset + animasyon listesi oluştur ve PROJECT_LOG'u güncelle.
- **Yapılan değişiklik:** `origin/main` (Ayberk: M3 uzman verimi, M5 enerji azlığında makine kapanışı, M4 kaynaklar, denge ayarı) dala birleştirildi; tek çakışma PROJECT_LOG kayıtlarıydı (iki taraf da korundu). Birleşik kod: derleme, simülasyon (akıllı+herkesi al iyi son %74) ve headless oyun testi temiz. Asset Listesi A/B/C/D tabloları kaldırıldı; yerine 72 satırlık tek tablo (55 görsel + 17 animasyon / 57 kare); odalarda içerik + ayrılacak alanlar (konum %, boy m); kullanıcı isteğiyle her oda için birleşik sürüm `oda-<oda>-tam.png` (nesneler görselde çizili, oyun görünmez etkileşim alanı koyar) — kodda desteklendi ve geçici dosyayla test edildi (panel görünmez, ipucu/etkileşim/durum ışığı çalışıyor), gerçek boylar ve üretim notlarıyla. Kodla çizilen eski "C" adayları (dekor-*) oda görselleri bunları içerdiği için listeden çıktı. Commit, push, PR, merge.

| Dosya | Açıklama |
|---|---|
| `PROJECT_LOG.md` | Asset Listesi tek tablo; merge kayıtları |
| `CLAUDE.md` | 0.1 madde 5: tek tabloya göre güncellendi; 6.12'ye birleşik oda notu |
| `src/data/assets.js`, `src/scenes/GameScene.js` | `oda-<tip>-tam` desteği: `odaGorseliYerlestir()` önce birleşik sürümü dener, odadaki nesne sprite'ları görünmez (`gorseldeCizili`); `gercekAsset('oda-x')` birleşik varken de doğru |

- **Debt:** Yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `animasyon-duzeltme`

- **Prompt:** Panel asset'leri çok küçük kaldı; boyutlandırmaları her nesneye uygulanabilecek bir standarda oturtalım (oyun içi cetvel değil, asset üretim aşamasında).
- **Yapılan değişiklik:** Rework odaları spesifikasyondan ~%20 büyük ölçekte çizilmiş (tezgâh/yatak/tank ölçümleri: duvar dibinde ~70 px/m) → `PX_METRE` 62 → 75 kalibre edildi; panel 1,5 m'ye geri alındı (tek tek büyütmek yerine ölçek düzeltildi; ekran görüntüsünde panel, insan ve tezgâh orantılı). Geçici eklenen oyun içi ölçü cetveli kullanıcı isteğiyle kaldırıldı. Üretim standardı: "ölçek dizisi" yöntemi (tüm nesneler tek görselde, tek taban, referans oyuncu yanında; kesimde boy referanstan otomatik), şablon + prompt.

| Dosya | Açıklama |
|---|---|
| `src/data/assets.js` | `PX_METRE` 75, standart açıklaması; panel 1,5 m |
| `docs/olcek-standardi.md`, `docs/olcek-sablonu.png` | Yeni |
| `CLAUDE.md` | 6.13 Ölçek standardı |

- **Debt:** Yok. Commit atılmadı.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `animasyon-duzeltme`

- **Prompt:** Yeni asset'ler attım, geneli rework asset'leri.
- **Yapılan değişiklik:** 13 dosya işlendi (orijinaller `assets-orijinal/rework/1..13.png`, önceki sürümler `assets-orijinal/eski/`): 5 oda (magenta camlar kenar yumuşatmalı şeffaf; sera %20 cam), 2 manzara, çatı şeridi (`cati.png`, 120 px), çöp yığını, 4 oda paneli "çalışıyor" sheet'i (yarı saydam zemin + ızgara çizgileri silindi, 3 kare; 1. kare odanın sabit panel görseli oldu → çalışınca tasarım değişmiyor). Kod: oda genişliği 797 (yeni oran, kırpma yok); rework odalarının zemin çizgileri farklı (%74–%82) olduğu için odaya özel `duvar` oranı ve hepsi aynı yürüme çizgisine hizalı; görselli odada kodla çizilen duvar/pencere/lamba çizilmiyor (camlardan manzara görünüyor); nesne konumları yeni görsellerin boş alanlarına (yaşam: kapı %17, radyo koltuk yanı %74,5, ayaklı pano ön zeminde %7,5; enerji paneli %61, duman yeni bacadan; su paneli %65,5 + yeni gösterge camları; sera paneli %85; geri dönüşüm paneli %52, çöp %13). 5 odanın ekran görüntüsüyle doğrulandı, hata yok.

| Dosya | Açıklama |
|---|---|
| `public/assets/oda-*.png`, `manzara-*.png`, `cati.png`, `cop-yigini.png`, `panel-<oda>.png` | Rework sürümleri |
| `public/assets/anim/panel-<oda>-calis-1..3.png` | 12 yeni kare |
| `src/data/rooms.js` | `ODA_GENISLIK` 797, `YURUME_PAYI`, odalara `duvar`, yeni `nesneOran`/`suGostergeleri`/`duman`, `onde` |
| `src/scenes/GameScene.js` | Oda başına zemin hizası, ön zemin nesneleri, görselli odada kod duvarı yok |
| `src/data/assets.js` | `cati` 120 px; panel boyları 1,5 → 1,9 m (kullanıcı: paneller çok küçük kalıyordu; artık yanındaki insanla aynı boyda) |

- **Asset durumu:** 25/35 görsel, 15/15 arayüz, 13/17 animasyon. Eksik: `sakin-3/4` animasyonları, `bitki-solgun` hariç isteğe bağlı `sakin-<id>` görselleri.
- **Debt:** D14 sürüyor (oda görselleri PNG ~2,5 MB). Yeni not: odaların zemin çizgileri ve alt kenarları farklı olduğundan ön zemindeki ızgara çizgisi odalar arasında birkaç piksel kayıyor, bazı odaların altında koyu temel şeridi görünüyor (sonraki rework'te tüm odalarda zemin %74,5'te olmalı). Commit atılmadı.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `animasyon-duzeltme`

- **Prompt:** Yatağa girince karakter yürüme animasyonundaysa yürümeye devam ediyor; iki yeni animasyon dosyası attım, onları da yap.
- **Yapılan değişiklik:** Hata: pencere açıkken/gün geçişinde `update()` erken çıktığı için oyuncunun animasyonu ve zıplaması son hâlinde kalıyordu → `oyuncuDurdur()` ile duruş (bekleme animasyonu, zemine iniş); `oyuncu-calis` bir kez oynarken araya girmez. Headless test: ok tuşu basılıyken E → pencere açıldı, animasyon `oyuncu-yuru` → `oyuncu-bekle`, y=470. Yeni dosyalar 2×3 sheet (üst satır bekle 2 kare, alt iki satır yürü 4 kare): yaşlı işçi → `sakin-1-bekle/yuru`, örgülü kadın → `sakin-2-bekle/yuru`; gövde merkezi + ayak hizalamasıyla kesildi, ≤600 px. Orijinal sheet'ler `assets-orijinal/anim/`. Sahnede doğrulandı.

| Dosya | Açıklama |
|---|---|
| `src/scenes/GameScene.js` | `oyuncuDurdur()`; `update()` erken çıkışta çağırıyor |
| `public/assets/anim/sakin-1-*.png`, `sakin-2-*.png` | 12 yeni kare |
| `PROJECT_LOG.md` | Asset Listesi D, harita, bu kayıt |

- **Asset durumu:** 9/17 animasyon. Eksik: `sakin-3/4` bekle+yürü, 4 oda paneli "çalışıyor".
- **Debt:** Yok. Commit atılmadı.

### 2026-11-01 · Ayberk Alkan (ayberk2002alkangizli@gmail.com) · `kalan-mekanikler` branch

- **Prompt:** Kalan mekanikleri (M3, M5, M4) ayrı commit, yeni branch üzerinde yap.
- **Yapılan değişiklik:** Üç mekanik ayrı commit olarak `kalan-mekanikler` branch'ine (main `e26cdd1`'den) eklendi.
  - **M3** (`3142b94`) — Uzman olmayan sakin makineyi `AYAR.uzmanOlmayanVerim = 0.75` ile çarpar. Uzman '*' ve uzmanlık yerindeki tam. Oyuncu kendisi çalışırsa tam (bilinçli). Simülasyon: akıllı+hepsiniAl %91 → %58, akıllı+kimseyiAlma %95 → yalnız ütopya.
  - **M5** (`de825af`) — Enerji < 25 iken Geri Dönüşüm, < 10 iken Sera da o gece kapanır (`AYAR.makineKapatmaEsikleri`, veri odaklı). Kapalı makinenin operatörü dinleniyor sayılır (yorgunluk azalır, üretim ve uzmanlık katkısı yok). Oyuncu kendisi çalıştığı kapalı makine de üretmez. Yeni yardımcılar: `kapaliMakineler()`, `makineKapali()`. Kemal'in özel `kosul.enerjiAlti: 25` koşulu kaldırıldı (artık genel kural). Pano makine şeridi "⚡ KAPALI" durumunu gösteriyor; açıklama metninde yeni verim yüzdesi ve enerji eşikleri yazıyor.
  - **M4** (`8c4bfbc`) — `gunes` → NREL, `hiyerarsi` → US EPA Waste Management Hierarchy, `sibirya` → WHO 2016 Yamal şarbon raporu. "Genel bilgi" / "Sıfır Atık yaklaşımı" gibi belirsiz etiketler kaldırıldı. Metinler değişmedi.

| Dosya | Açıklama |
|---|---|
| `src/state.js` | `AYAR.uzmanOlmayanVerim`, `AYAR.makineKapatmaEsikleri`; `kapaliMakineler()`, `makineKapali()`; `sakinCiktisi` uzman olmayan çarpanı + kapalı makine kontrolü; `sakinlerToplami` oyuncu kapalı makinede üretmez; `calisiyor()` kapalı makinedeki operatörü dinlenmiş sayar (yorgunluk azalır) |
| `src/data/visitors.js` | Kemal'in `kosul.enerjiAlti: 25, carpan: 0` kaldırıldı, `kosullu` metni genel kurala referans veriyor |
| `src/ui/ui.js` | `makineDurumHtml` kapalı durumu gösteriyor; pano açıklaması güncel; `kapaliMakineler`, `makineKapali` import |
| `src/data/facts.js` | `gunes`, `hiyerarsi`, `sibirya` kaynakları |
| `PROJECT_LOG.md` | Bu kayıt |

- **Debt:** D3 **kısmen** iyileşti (kaynak etiketleri 1. el, rakamlar hâlâ doğrulanmadı). D10 (yorgunluk ayarları) hâlâ açık; M3/M5 doğrudan etkilemedi. D11, D2, D6 açık.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `sakin-gorselleri` → `main`

- **Prompt:** En son hâlini push'la; son durumdaki eksiklik ve düzeltilecek asset'lere göre tek bir düzeltme promptu ver.
- **Yapılan değişiklik:** Yeni asset gelmemişti (23/35, 15/15, 5/17), düzeltme promptu `docs/final-asset-promptu.md` olarak geçerli. Push öncesi `public/assets` 96 MB bulundu (oyun açılışta 60+ MB indiriyordu): orijinaller `assets-orijinal/`'e yedeklendi (gitignore), nesne/karakter/animasyon kareleri ≤600 px yükseklik, portreler 512×512, hikayeler 1280 px genişliğe yüksek kaliteyle küçültüldü → 47 MB (açılış ~35 MB; 19 MB oda+manzara). 1920×1080 ekran görüntüsünde kalite kaybı yok. Commit, push, PR, merge.

| Dosya | Açıklama |
|---|---|
| `public/assets/**` | Küçültülmüş sürümler |
| `.gitignore` | `assets-orijinal/` |
| `CLAUDE.md` | 0.1 madde 5: gelen görsellerin boyut kuralı |
| `PROJECT_LOG.md` | Ağaç, bu kayıt |

- **Debt:** Yeni D14: oda+manzara görselleri hâlâ 19 MB (PNG); WebP'ye çevrilirse açılış belirgin hızlanır (Phaser destekler; `assets.js` dosya adları değişir).

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `sakin-gorselleri`

- **Prompt:** Attığım bütün asset'leri kontrol et ve düzenle; oyunun son durumunu analiz edip final asset düzeltme promptu ver.
- **Yapılan değişiklik:** 41 dosyadan 21'i önceki asset'lerin bayt-bayt kopyası (silindi; odalar/manzaralar henüz yeniden çizilmemiş). Yeni 19 dosya: 10 portre (`ziyaretci-*`, `kurucu-*`), `sakin-2..4`, `bitki-solgun`, `kapak`, 4 sprite sheet → karelere kesildi (`oyuncu-bekle` 4, `oyuncu-calis` 4, `panel-calis` 3, `kapi-ac` 4; oyuncu karelerinde ayak hizalama). Şeffaflık ölçüldü (sprite'lar şeffaf, portre/kapak opak — sorun yok). Analizde bulunan sorunlar düzeltildi: genel `panel-calis` odaya özel panel tasarımlarını eziyordu → odaya özel `panel-<oda>-calis` animasyonları tanımlandı, genel olan sadece genel panelde; makine durumu için panel üstünde yeşil/kırmızı ışık; kapı kartında eski "Üretim · Bakım · Araştırma" metni; çatı için `cati.png` desteği + daha iyi kodla çizilmiş eğik paneller; durum scripti arayüz görsellerini tanıyor. Final asset promptu yazıldı (öncelik sırasıyla 21 + 10 isteğe bağlı görsel).

| Dosya | Açıklama |
|---|---|
| `public/assets/*` | 15 yeniden adlandırma, 21 kopya silindi; `anim/` 15 yeni kare |
| `src/data/animations.js` | `panel-enerji/su/sera/geri-calis` |
| `src/data/assets.js` | `cati` |
| `src/scenes/GameScene.js` | `makineAnimGuncelle()` odaya özel animasyon + durum ışığı; çatı görseli/yeni panel çizimi |
| `src/ui/ui.js` | Kapı kartı "Olası görevler" metni |
| `tools/asset-durum.mjs` | Arayüz görselleri listesi |
| `docs/final-asset-promptu.md` | Yeni (önceki `asset-duzeltme-promptu.md` yerine) |
| `CLAUDE.md`, `PROJECT_LOG.md` | Referanslar, Asset Listesi güncel |

- **Asset durumu:** 23/35 oyuna bağlı görsel, 15/15 arayüz görseli, 5/17 animasyon.
- **Debt:** Yok. Kalan görsel iş final promptta.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `sakin-gorselleri`

- **Prompt:** Asset'leri ürettiğim sohbete direkt yapıştırınca değişmesi gereken tüm asset'leri düzeltecek tek bir prompt ver.
- **Yapılan değişiklik:** Tek mesajlık İngilizce düzeltme promptu yazıldı: ortak kurallar + 5 oda (eski adlarıyla referans) + 2 manzara (yatayda döşenebilir, aynı kompozisyon); sırayla, soru sormadan üretme talimatı. Şablon eki gerekmez (yüzde tabanlı).

| Dosya | Açıklama |
|---|---|
| `docs/asset-duzeltme-promptu.md` | Yeni: yapıştırılacak prompt |
| `CLAUDE.md` | 6.12'ye dosya referansı |
| `PROJECT_LOG.md` | Ağaç, bu kayıt |

- **Debt:** Yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `sakin-gorselleri`

- **Prompt:** Oda görselleri yarıda kesiliyor; odalar yan yana smooth değil (hepsi yan yana konabilecek şekilde tasarlanmalı); arka planda nesnelere yer ayrılmalı; nesneler ile görseldeki mobilyalar orantısız; camların içi boş olmalı. + Düzeltme promptu yaz; oda–nesne eşleşme listesi ver; hepsini içeren uzun prompt; ekstra ölçekleme gerekmeyecek boyut.
- **Yapılan değişiklik:** Kod: oda genişliği 640 → 776 (görsel oranı; artık kırpılmıyor), eski sabit koordinatlar ölçeklendi; nesne konumları görsel genişliğine oran; nesne boyları gerçek metre değerinden (görsellerdeki mobilyalar ölçülerek 1 m = 62 px; oyuncu 72 → 109 px, kapı 130, panel 93, radyo 56, pano 105, bitki 40, sakin 105). Rework için: 5 oda şablonu (`docs/oda-sablonlari/`), oda–nesne listesi, yüzde tabanlı (21:9, ölçeksiz) ana prompt + 5 oda eki, isteğe bağlı tek panorama yöntemi (CLAUDE.md 6.12). Headless ekran görüntüleri: odalar tam, oyuncu mobilyalarla orantılı, hata yok.

| Dosya | Açıklama |
|---|---|
| `src/data/rooms.js` | `ODA_GENISLIK` 776; oda içi x'ler ×1,2125; `nesneOran`, `bitkiOran`, `copOran` |
| `src/data/assets.js` | `PX_METRE`, `m()`; tüm nesne boyları metreden |
| `src/scenes/GameScene.js` | `OK` ölçeği (görselsiz çizimler), nesne/bitki/çöp konumları orandan, sakin konum aralıkları |
| `docs/oda-sablonlari/sablon-*.png` | Yeni: 5 yerleşim şablonu |
| `CLAUDE.md` | 6.6 güncellendi; 6.12 rework brifi (liste + şablon + promptlar), 6.11 sırası düzeltildi |

- **Debt:** Yok. Not: nesne boyları büyüdüğü için yaşam alanı biraz kalabalık; rework görselleri şablona uyunca düzelir. 21:9 dışında (ör. 16:9) üretilen oda görseli tavana taşar, 21:9 kullanılmalı.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `sakin-gorselleri`

- **Prompt:** Yüklenen asset'leri incele; nesneleri arka planlara yedirecek şekilde konumlandır (perspektif/konum sorunu); odalar arası geçiş çok keskin, kod tarafında yapılabilecekleri uygula.
- **Yapılan değişiklik:** Oda görselleri analiz edildi (duvar–zemin çizgisi ~%74,5, ön şerit ~%87). Görsel artık oran korunarak büyütülüp yürüme çizgisi zeminin ortasına (%82) denk geliyor (yanlar ~%9 kırpılıyor); önceden oyuncu/nesneler görselin alt kenarında havada duruyordu. Duvara yaslanan nesneler duvar dibine basıyor ve %90 ölçekli (perspektif). Nesneler görseldeki boşluklara taşındı (kapı duvarda, radyo kitaplık önü, pano koltuk yanı, paneller temaya uygun yerde); yatak görseldeki yatakla birleşti (sprite gizli, etkileşim aynı yerde); su seviyesi görseldeki tankların gösterge camlarında; jeneratör dumanı görseldeki jeneratörden; gri elips çöp yığını yerine çizilmiş torba/hurda yığını (`cop-yigini.png` ile değiştirilebilir). Oda sınırlarına taşıyıcı kolon + iki yana gölge eklendi. 1280×720 headless ekran görüntüleriyle 5 oda doğrulandı, konsol hatası yok.

| Dosya | Açıklama |
|---|---|
| `src/data/rooms.js` | `GORSEL_ZEMIN_ORANI`, `GORSEL_DUVAR_ORANI`, `ARKA_OLCEK`; nesnelere `arka: true`; odalara `gorsel` (nesneX, gorseldeVar, suGostergeleri, duman) |
| `src/scenes/GameScene.js` | `odaGorseliYerlestir()`, `odaGecisleriCiz()`; arka nesne konumu/ölçeği (`ekOlcek`); su göstergeleri; duman noktası; `cop-yigini` dokusu ve ölçeği |
| `src/data/assets.js` | `cop-yigini` girdisi (70 px) |
| `CLAUDE.md` | 6.6: oyunda yerleşim + rework kuralları (aynı zemin çizgisi, kenarlar, nesne boşlukları, ışık, pencere) |
| `PROJECT_LOG.md` | Harita; Asset Listesi: `cop-yigini` A'ya |

- **Debt:** Yok. Rework önerisi CLAUDE.md 6.6'da. Kalan görsel uyumsuzluklar: çatıdaki kodla çizilmiş mavi güneş panelleri, kodla çizilmiş sakin yer tutucuları (`sakin-2..4` gelince düzelir).

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `sakin-gorselleri`

- **Prompt:** Yeni asset'ler geldi, isimlendirir misin.
- **Yapılan değişiklik:** 11 dosya oyun adlarına çevrildi (5 oda, 2 manzara, 4 hikaye; hikayeler içeriğe göre sıralandı). Odalarda pencereler boyalı (şeffaf değil) ve mobilyalar çizili olduğu için: oda görseli varken kodla çizilen süs öğeleri (dolap, batarya rafları, jeneratör kutusu, boru, ayrıştırma kutuları, saksı şeridi) atlanıyor; işlevli öğeler kalıyor (su tankı görsele uygun koyu metal/cam stilinde, bitkiler zeminde, çöp yığını); oda adları açık renk + konturla okunur hâle getirildi. Headless ekran görüntüleriyle doğrulandı, konsol hatası yok.

| Eski ad | Yeni ad |
|---|---|
| Kitaplıklı sıcak sığınak odası-1 | `oda-yasam.png` |
| Onarılmış bataryalı enerji atölyesi-2 | `oda-enerji.png` |
| Bunker içinde umut serası-3 | `oda-sera.png` |
| Yeniden Kullanım Atölyesi-4 | `oda-geri.png` |
| Sığınak su arıtma odası-5 | `oda-su.png` |
| Yeniden Yeşeren Şehir Panoraması-6 | `manzara-iyi.png` |
| Kirlenmiş şehir, kuruyan nehir-7 | `manzara-kotu.png` |
| Kuruyan şehrin kavurucu sessizliği-8 | `hikaye-1.png` (Dünya ısınıyordu) |
| Çözülen topraklarda terk edilmiş istasyon-11 | `hikaye-2.png` (Buz çözüldü) |
| Terk Edilmiş Caddede Son Fidan-9 | `hikaye-3.png` (Büyük Sessizlik) |
| Şafakta Yeşeren Sığınak-10 | `hikaye-4.png` (Yeşilvadi) |

| Dosya | Açıklama |
|---|---|
| `public/assets/*.png` | Yukarıdaki yeniden adlandırmalar |
| `src/scenes/GameScene.js` | `dekorCiz()`: görselli odada süs çizimleri atlanır, tank/saksı stili; oda adı etiketi okunur |
| `PROJECT_LOG.md` | Asset Listesi A/B güncellendi |

- **Asset durumu:** 19/33 oyuna bağlı görsel (+ 4 hikaye ekranı), 1/13 animasyon. Eksik: `sakin-2..4`, `bitki-solgun` ve isteğe bağlı `sakin-<id>`, portreler (`ziyaretci-*`, `kurucu-*`), `kapak.png`, animasyonlar.
- **Debt:** Yok. Not: oda pencereleri boyalı olduğundan pencereden dış dünya/ütopya-distopya geçişi görünmüyor (görünmesi istenirse pencere camı şeffaf bırakılmalı).

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `sakin-gorselleri`

- **Prompt:** (PR #5 merge sonrası) geliştirmeye devam.
- **Yapılan değişiklik:** D13 kapatıldı: her kurucu ve ziyaretçi için isteğe bağlı karaktere özel sahne görseli `sakin-<id>.png`; varsa o kişi kendi görseliyle, yoksa sırayla genel `sakin-1..4` ile görünür. Headless test (geçici `sakin-selin.png`): Selin `sakin-selin` 64 px, diğerleri `sakin1..3`.

| Dosya | Açıklama |
|---|---|
| `src/data/assets.js` | Kurucu + ziyaretçi id'lerinden otomatik `sakin-<id>` girdileri (çocuklar 50 px, diğerleri 64 px) |
| `src/scenes/GameScene.js` | `sakinGuncelle()` özel görsel seçimi; özel görselde genel animasyon atlanır |
| `PROJECT_LOG.md` | Asset Listesi A'ya 10 satır, açıklama notu; harita; D13 silindi |
| `CLAUDE.md` | 6.3 tablosuna `sakin-<id>.png` satırı |

- **Debt:** Kapandı: D13. D11'e 10 isteğe bağlı dosya daha eklendi (eksikse konsolda 404).

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `sakin-gorselleri`

- **Prompt:** (aynı istek, devam) konsol 404 kirliliği.
- **Yapılan değişiklik:** D11 kapatıldı: Vite eklentisi `public/assets/` dosya listesini sanal modül olarak veriyor; oyun ve arayüz yalnızca var olan dosyaları istiyor. Dev sunucusunda klasöre dosya eklenip silinince sayfa kendiliğinden yenileniyor. Headless test: konsol hatası 0, 4xx istek 0; sayfa açıkken `sakin-burak.png` eklendi → otomatik yenilendi, Burak kendi görseliyle göründü.

| Dosya | Açıklama |
|---|---|
| `vite.config.js` | `assetListesi()` eklentisi (sanal modül + klasör izleme, tam yenileme) |
| `src/assetListesi.js` | Yeni: `assetVar(dosya)` |
| `src/scenes/GameScene.js` | `preload()` ve animasyon kareleri yalnızca var olan dosyaları yükler |
| `src/ui/ui.js` | `varsaImg()`: portre ve hikaye `<img>`'leri yalnızca dosya varsa |
| `CLAUDE.md` | Bölüm 5 ve 6.3: liste/canlı yenileme notu |

- **Debt:** Kapandı: D11. Not: `tools/` scriptleri `src/assetListesi.js`'i içe aktarmamalı (Node'da sanal modül yok).

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz3-hafif-siyaset` → `main`

- **Prompt:** Push, merge; geliştirmeye devam.
- **Yapılan değişiklik:** Hafif siyaset, isimlendirilen 10 asset, HUD taşma düzeltmesi ve çizim netliği commit'lenip PR ile `main`'e merge edildi.

| Dosya | Açıklama |
|---|---|
| `PROJECT_LOG.md` | Bu kayıt |

- **Debt:** Yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz3-hafif-siyaset`

- **Prompt:** Yüklediğimiz görseller oyunda çok pikselli görünüyor, kaynak kalite düşük değil.
- **Yapılan değişiklik:** İki neden giderildi: (1) 1000–1800 px görseller WebGL'de 15–25 kat tek adımda küçültülüyordu (tırtıklanma) → yüklenince oyundaki boylarının ~3 katına adım adım yüksek kaliteyle küçültülüyor (ör. kapı 933×1686 → 200×361); (2) oyun 960×540 çizilip ekrana büyütülüyordu → tuval 1920×1080, kamera zoom 2, yazılar 2× çözünürlük. Oyun koordinatları değişmedi; ekrana sabit/paralaks katmanlar zoom kaymasına göre düzeltildi. 1920×1080 headless ekran görüntüsünde yerleşim öncekiyle aynı, görseller net; gün başlığı normal şekilde açılıp kayboluyor.

| Dosya | Açıklama |
|---|---|
| `src/scenes/GameScene.js` | `CIZIM_OLCEGI`, kamera zoom; `ekranaSabitle()` (gökyüzü, güneş, şehir, manzara, atmosfer, dış toz, gün başlığı); `yuksekKaliteKucult()`, `dokuKucult()`, `dokuKucultOran()` (animasyon kareleri ortak oranla), `assetleriKucult()`; `this.add.text` 2× çözünürlük |
| `src/main.js` | Tuval 960×540 → 1920×1080 (`CIZIM_OLCEGI`) |
| `CLAUDE.md` | Bölüm 5: görüntü kalitesi notu |

- **Debt:** Yok. Not: gelecekte ekrana sabit katman eklenecekse `setScrollFactor` yerine `ekranaSabitle()` kullanılmalı.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz3-hafif-siyaset`

- **Prompt:** Attığım asset'leri isimlendirir misin?
- **Yapılan değişiklik:** `public/assets/`'e Türkçe adlarla konan 13 dosya oyun adlarına çevrildi; 3 bayt-bayt aynı kopya silindi. Hepsinin arka planı şeffaf (köşe alfa 0, tarayıcıda ölçüldü). Sahnede ekran görüntüsüyle doğrulandı. Aynı kontrolde HUD'ın sağa taştığı (denge göstergesi kesik; memnuniyet göstergesi eklenince) görüldü ve düzeltildi. Ayrıca ekip `oyuncu.png`'yi 512×768 sürümle güncellemiş.

| Eski ad | Yeni ad |
|---|---|
| Güneş enerjisi kontrol konsolu.png | `panel-enerji.png` |
| Su arıtma kontrol konsolu-4.png (+ aynısı, silindi) | `panel-su.png` |
| Sera kontrol konsolu-2.png (+ aynısı, silindi) | `panel-sera.png` |
| Geri dönüşüm kontrol konsolu-3.png (+ aynısı, silindi) | `panel-geri.png` |
| Yıpranmış ahşap tek kişilik yatak-5.png | `yatak.png` |
| Terrakota radyolu küçük yan sehpa-6.png | `radyo.png` |
| Ayaklı mantar görev panosu-7.png | `pano.png` |
| Takviyeli eko sığınak kapısı-8.png | `kapi.png` |
| Terrakota saksıda yapraklı sebze fidesi-9.png | `bitki.png` |
| Asalı yaşlı işçi-10.png | `sakin-1.png` |

| Dosya | Açıklama |
|---|---|
| `public/assets/*.png` | Yukarıdaki yeniden adlandırmalar |
| `src/style.css` | HUD aralıkları daraltıldı (taşma düzeltmesi) |
| `PROJECT_LOG.md` | Asset Listesi A güncellendi (12/23 görsel), D13 |

- **Asset durumu:** 12/23 görsel, 1/13 animasyon. Eksik: `bitki-solgun`, `sakin-2..4`, `oda-*` (5), `manzara-*` (2); B tablosundaki portreler/hikaye.
- **Debt:** Yeni D13 (sakin görselleri isimli karakterlerle eşleşmiyor).

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz3-hafif-siyaset`

- **Prompt:** (PR #4 merge sonrası) geliştirmeye devam.
- **Yapılan değişiklik:** GDD bölüm 11 hafif siyaset: görünür memnuniyet (yalnızca sürdürülebilirlik kararlarına bağlı), düşük memnuniyette itiraz kartı (Kemal içerideyse onun ağzından), üst üste 2 gece dipte kalırsa "Güven oylaması" sonu. İlk ayarla güven kaybı rastgele/kirli oyunlarda %77–100 çıkıyordu; cezalar yumuşatılıp oylama "üst üste 2 gece" koşuluna bağlandı → akıllı %0, rastgele %3–6, kirli %31–49. Headless test: HUD 🙂 60, rapor "Karanlık −6, Kirli −3", uyarı, Kemal'li itiraz kartı.

| Dosya | Açıklama |
|---|---|
| `src/state.js` | `AYAR` memnuniyet ayarları; `state.memnuniyet/guvenDusukGece`; `memnuniyetGecesi()`; `guvenKaybi` sonu; kart seçeneklerinde `memnuniyet`, `yorgunlukAzalt`; kart koşulu `memnuniyetAlti`; keşif başarısı +5 |
| `src/data/cards.js` | `itiraz` kartı (en öncelikli, `sozcu: tamirci`); "Süre iste" insanlık yerine memnuniyet −10 |
| `src/ui/ui.js` | HUD memnuniyet göstergesi; gece raporunda `memnuniyetHtml()` + uyarılar; kartta sözcü metni ve yeni chip'ler ("bu gece" en sonda); `guvenKaybi` son metni; son ekranında memnuniyet |
| `tools/simulasyon.mjs` | `guvenKaybi` sütunu |
| `CLAUDE.md` | 4.8 beşinci son, 4.11 tablo (güven kaybı sütunu), 4.18 yeni bölüm |

- **Debt:** Yok (sayılar [DENGE TASLAĞI]). GDD Faz 3 tamamlandı; GDD'den yapılmayan tek büyük madde grid inşa + oda komşulukları. Asset gerektiren yeni nesne yok. Commit atılmadı.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz3-kesif` → `main`

- **Prompt:** Commit, push, PR, merge; sonra geliştirmeye devam.
- **Yapılan değişiklik:** Keşif sistemi ve ekibin `panel.png`'si commit'lenip PR ile `main`'e merge edildi.

| Dosya | Açıklama |
|---|---|
| `PROJECT_LOG.md` | Bu kayıt |

- **Debt:** Yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz3-kesif`

- **Prompt:** (PR #3 merge sonrası) geliştirmeye devam.
- **Yapılan değişiklik:** GDD bölüm 8 keşif: 4 nokta (santral, eski şehir, komşu yerleşim, rezervuar). Panodan kişi gönderilir; erzak düşer, kişi çalışmaz ve yorulur; dönüşte uzmansa başarı kesin, değilse şans; başarısızlık nedenini anlatır. Headless uçtan uca test: kişi listesi şanslarla (Burak ★ %100), gönderince su makinesi boşaldı ve figür gizlendi, gece raporunda dönüş + ödül (+8 su, Gri Su +4) + bilgi kartı.

| Dosya | Açıklama |
|---|---|
| `src/data/exploration.js` | Yeni: `KESIF_NOKTALARI` (süre, erzak, şans, uzman, ödül, başarı/başarısızlık metni, bilgi) |
| `src/state.js` | `state.sefer/kesfedilenler`; `kesifSansi()`, `kesfeGonderebilirMi()`, `kesfeGonder()`, `seferSabahi()`; `puanEkle()` belirli projeye puan verebiliyor; keşifteki kişi uzmanlık katkısı vermez ve görev değiştirilemez |
| `src/ui/ui.js` | Panoda `kesifHtml()` (noktalar, kişi seçimi, aktif sefer), sakin satırında "Keşifte"; gece raporunda `seferHtml()` (sefer kartı varken olağan bilgi kartı gösterilmez) |
| `src/scenes/GameScene.js` | Keşifteki sakin görünmez |
| `src/style.css` | Keşif ve sefer sonucu stilleri |
| `public/assets/panel.png` | Ekipten (repoya eklenecek) |
| `CLAUDE.md` | 4.17 yeni bölüm |

- **Asset:** Ekip `public/assets/panel.png` (918×1334, şeffaf) yükledi; listede ✅ (2/23 görsel, 1/13 animasyon).
- **Debt:** Yok. Simülasyon keşfi kullanmıyor (isteğe bağlı mekanik; denge sonuçları değişmedi). Asset gerektiren yeni nesne yok (emoji ikonlar). Commit atılmadı.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz3-karar-kartlari` → `main`

- **Prompt:** Commit, push, PR, merge; sonra geliştirmeye devam.
- **Yapılan değişiklik:** Karar kartları, içerik kutusu ölçeklemesi ve ekibin `oyuncu-yuru` kareleri commit'lenip PR ile `main`'e merge edildi.

| Dosya | Açıklama |
|---|---|
| `PROJECT_LOG.md` | Bu kayıt |

- **Debt:** Yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz3-karar-kartlari`

- **Prompt:** (aynı oturum) Ekip `oyuncu-yuru` karelerini yükledi; kontrol ve uyum.
- **Yapılan değişiklik:** Ekibin 6 karesi (512×768) karakteri karenin alt %75'ine çizmiş; sabit `oyuncu.png` (256×768) neredeyse tam boy. Kare yüksekliğine göre ölçekleme yürürken karakteri ~52 px'e küçültecekti. Görsellerin şeffaf olmayan içerik kutusu ölçülüp ölçek ve zemin hizası ona göre yapılacak şekilde düzeltildi (animasyonda karelerin ortak kutusu). Headless ölçüm: dururken ve yürürken görünen boy 72 px, alt kenar y=470 (zemin). Yan bulgu: `oyuncu.png`'nin altındaki 51 px boşluk yüzünden oyuncu ~5 px havadaydı, düzeldi.

| Dosya | Açıklama |
|---|---|
| `src/scenes/GameScene.js` | `icerikKutusu()` (alfa taraması, önbellekli), `animKutusu()`, `olcekle()` içerik boyuna göre ölçek + origin; `gorunurY()` ile ipucu, kapı işareti, süzülen sayılar |
| `public/assets/anim/oyuncu-yuru-1..6.png` | Ekipten (repoya eklenecek) |
| `CLAUDE.md` | 6.3: kenar boşluğu artık serbest, arka plan şeffaf olmalı; animasyon ölçek notu |
| `PROJECT_LOG.md` | Asset Listesi D: `oyuncu-yuru` ✅; genel kurallar; harita |

- **Debt:** Yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz3-karar-kartlari`

- **Prompt:** (PR #2 merge sonrası) geliştirmeye devam.
- **Yapılan değişiklik:** GDD bölüm 10 eğitici karar kartları: 5 koşullu kart (karanlık, su, protesto, kompost, enerji sözü), sabah çıkar, seçim zorunlu, sonuçta metin + bilgi kartı. Grid inşa (GDD Faz 2 ikinci yarısı) bilinçli olarak atlandı: kalan sürede sahneyi yeniden yazmak çok riskli. Headless test: kart Esc ile kapanmıyor, dizel seçimi enerji 20→50, karbon 35→51, sonuç ekranında bilgi kartı. Simülasyon: akıllı+herkesi al iyi son %61 → %72; kirli hâlâ hiç ayakta kalmıyor.

| Dosya | Açıklama |
|---|---|
| `src/data/cards.js` | Yeni: `KARTLAR` (koşul, seçenekler: etki, geceEtki, maliyet, insanlık, araştırma, kirli/panel, sonuç, bilgi) |
| `src/state.js` | `state.kart/gosterilenKartlar/kartGeceEtki`; `kartKontrol()`, `kartSec()`, `kartSecenekleri()`, `kartSecebilirMi()`; gece hesabına kart etkisi |
| `src/ui/ui.js` | `kararKartiGoster()` (zorunlu seçim, sonuç ekranı); sabah ekranında "Kararı gör"; kirli seçimde sahne efekti |
| `src/style.css` | `.gece-etiket` |
| `tools/simulasyon.mjs` | Stillere göre kart seçimi |
| `CLAUDE.md` | 4.16 yeni bölüm, 4.11 simülasyon tablosu |

- **Debt:** Yok (sayılar [DENGE TASLAĞI], D10/D12 kapsamında). Grid inşa yapılmadı; gerekirse yeni borç olarak açılabilir. Asset gerektiren yeni nesne yok. Commit atılmadı.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz2-hazirlikli-olaylar` → `main`

- **Prompt:** PR aç, push'la, merge et, sonra geliştirmeye devam.
- **Yapılan değişiklik:** Hazırlıklı olaylar commit'lenip push'landı, PR açılıp `main`'e merge edildi.

| Dosya | Açıklama |
|---|---|
| `PROJECT_LOG.md` | Bu kayıt |

- **Debt:** Yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz2-hazirlikli-olaylar`

- **Prompt:** (PR #1 merge sonrası) geliştirmeye devam.
- **Yapılan değişiklik:** GDD Faz 2 "hazırlık gerektiren olaylar": yarının olayı radyoda bir gün önceden duyuruluyor; zararlı olaylara 1 eylemle hazırlanılıyor (toz/sıcak/kuraklık tamamen önlenir, sel %70 azalır). Hazırlığın değerli olması için zararlı olaylar ~1,6 kat sertleştirildi. Headless test: tahmin ve buton görünüyor, hazırlık 1 eylem harcıyor, kart "✓ Hazırlandın" ile yenileniyor. Mantık testi: hazırlıklı toz → karbon artmadı, gece enerji −8 azaldı; hazırlıklı sel → gıda −15 yerine −4 (eski değerlerle); son gün tahmin yok.

| Dosya | Açıklama |
|---|---|
| `src/data/events.js` | Her olaya `uyari` metni; zararlılara `hazirlik { ad, carpan }`; `HAZIRLIK_MALIYETI`; zararlı olay değerleri ~1,6× |
| `src/data/facts.js` | `erkenuyari` bilgi kartı |
| `src/state.js` | `state.tahmin/hazirlik/olayHazirlikli`; `olayEtkisi()`, `hazirlanabilirMi()`, `hazirlan()`; gece hesabı ve sabah etkisi hazırlığı dikkate alıyor; tahmin bir gün önceden seçiliyor |
| `src/ui/ui.js` | `tahminHtml()` (yarın, etkiler, hazırlık butonu), `olayEtkiSatirlari()`, `hazirlikBagla()`; radyo ve sabah ekranında tahmin; hazırlanılan günün radyosunda not |
| `src/style.css` | `.tahmin` stili |
| `tools/simulasyon.mjs` | Akıllı stil hazırlanır; `SIM_HAZIRLIK=0` ile kapatılır |
| `CLAUDE.md` | 4.6 olay tablosu (yeni değerler + hazırlık), 4.15 yeni bölüm, 4.11 simülasyon tablosu güncellendi |

- **Debt:** Yeni D12 (zorluk arttı, D10 ile dengelenecek). D3'e `erkenuyari` kartı eklendi (kaynak kontrol edilmeli). Asset gerektiren yeni nesne yok. Commit atılmadı.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz2-mekanikler` → `main`

- **Prompt:** PR aç, push'la, merge et, sonra geliştirmeye devam.
- **Yapılan değişiklik:** Bekleyen işler (asset listesi PROJECT_LOG'a, animasyon sistemi, arka plan/portre/hikaye bağlama, ekibin `oyuncu.png`'si) commit'lenip `faz2-mekanikler` push'landı; PR açılıp `main`'e merge edildi.

| Dosya | Açıklama |
|---|---|
| `PROJECT_LOG.md` | Bu kayıt |

- **Debt:** Yok.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz2-mekanikler`

- **Prompt:** Geliştirmeye devam; ekip paralelde asset üretip yükleyecek.
- **Yapılan değişiklik:** Koda bağlı olmayan tüm görseller bağlandı: oda arka planları, manzara (iyi/kötü geçişli), ziyaretçi ve kurucu portreleri, hikaye ekranları. Dosya yoksa eski görünüm aynen kalıyor. Headless test: test görselleriyle hikaye 1 bandı göründü, 2 (dosyasız) düz kaldı; manzara kodla çizilen şehrin yerini aldı ve denge alfasıyla karıştı; panoda Selin portresi, diğerleri emoji; dosyasız ziyaretçide emoji. Ekibin eklediği `public/assets/oyuncu.png` (256×768) oyunda 72 px olarak doğrulandı.

| Dosya | Açıklama |
|---|---|
| `src/data/assets.js` | `oda-*` (5) ve `manzara-iyi/kotu` girdileri (`arka: true`); `portreDosyasi()`, `hikayeDosyasi()` |
| `src/scenes/GameScene.js` | `evCiz()`: oda görseli duvarın üstüne (640×280); `disariCiz()`: manzara tileSprite katmanları, şehir grafiğini gizler; `gorselUygula()`: kötü manzara alfası / iyi manzara tint |
| `src/ui/ui.js` | `portreRozet()`, `portreBuyuk()` (img + emoji yedeği); kapı kartında büyük portre, pano satırlarında rozet; hikaye ekranında görsel bandı |
| `src/style.css` | Portre rozeti, büyük portre, hikaye görseli stilleri |
| `PROJECT_LOG.md` | Asset Listesi A/B güncellendi (oyuncu ✅, oda/manzara A'ya, B arayüz görselleri oldu), harita, D1 kapandı |
| `CLAUDE.md` | 6.3 ikinci tablo "arayüz görselleri", 6.6 şeffaf pencere notu, 6.9 kurucu portre promptları |

- **Debt:** Kapandı: D1. D11 sürüyor (dosyasız her görsel 1 konsol hatası; HTML portreleri de 404 verir). Commit atılmadı.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz2-mekanikler`

- **Prompt:** Asset bağlayıcı mantığında bir animasyon bağlayıcı yap; frame asset'leri klasöre atılacak; hangi animasyon, kaç kare gerektiği listede olsun.
- **Yapılan değişiklik:** Animasyon sistemi kuruldu: `public/assets/anim/<ad>-<n>.png` kareleri, tüm kareler varsa animasyon kurulur, yoksa nesne sabit kalır. 13 animasyon tanımlandı (oyuncu bekle/yürü/çalış, 4 sakin × bekle/yürü, kapı açılma, panel çalışıyor). Headless Chromium testi: tam kareli animasyonlar kuruldu ve oynadı, 2/4 kareli `oyuncu-bekle` kurulmadı ve raporlandı; yürürken `oyuncu-yuru` oynadı ve zıplama kapandı (y=470, 72 px); duruşta sabit görsele döndü; 4 operatörlü panelde `panel-calis` oynadı, Selin dinlenmeye alınınca enerji paneli durdu; eksik animasyon başına tek konsol hatası.

| Dosya | Açıklama |
|---|---|
| `src/data/animations.js` | Yeni: `ANIMASYONLAR` (kare, fps, döngü, sahip, ne zaman), dosya/anahtar yardımcıları |
| `src/scenes/GameScene.js` | Oyuncu, nesneler ve sakinler `image` → `sprite`; `preload()` her animasyonun 1. karesini dener; `animasyonlariYukle()` kalan kareleri yükleyip tam olanları kurar; `animOynat()`/`animDurdur()` (ölçek sahibin yüksekliğine); `makineAnimGuncelle()` (durum değişince), `sakinAnimGuncelle()` (her kare, harekete göre), oyuncu bekle/yürü/çalış, kapı açılma; konsola `[anim]` özeti |
| `tools/asset-durum.mjs` | Animasyon kare durumu (hazır/eksik kare numaraları), anim/ içinde tanınmayan dosya uyarısı |
| `public/assets/anim/.gitkeep` | Klasör |
| `CLAUDE.md` | 0.1 madde 5'e animasyon, 6.3'e animasyon teslim kuralları, 6.11 kare üretim ipuçları |
| `PROJECT_LOG.md` | Asset Listesi D (Animasyonlar) tablosu, harita, ağaç |

- **Debt:** Yok. Not: kodla çizilen yer tutucuların animasyonu yok; animasyon yalnızca gerçek kareler gelince oynar.

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz2-mekanikler`

- **Prompt:** Asset bilgilerini project log'da tut, sürekli güncel hâliyle.
- **Yapılan değişiklik:** Asset listesi `PROJECT_LOG.md` → **Asset Listesi** bölümüne taşındı; ayrı `ASSET_LISTESI.md` kaldırıldı (tek kaynak), tüm atıflar güncellendi.

| Dosya | Açıklama |
|---|---|
| `PROJECT_LOG.md` | Yeni "Asset Listesi" bölümü (A/B/C tabloları), harita ve ağaç güncellendi |
| `ASSET_LISTESI.md` | Silindi (içerik PROJECT_LOG'a taşındı) |
| `CLAUDE.md` | 0.1 madde 5, dosya tablosu ve 6.3 atıfları PROJECT_LOG'a çevrildi |
| `tools/asset-durum.mjs` | Açıklama yorumu güncellendi |

- **Debt:** Kapandı: D8 (pano promptu CLAUDE.md 6.5'te mevcut).

### 2026-11-01 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz2-mekanikler`

- **Prompt:** Bundan sonra eklenen nesnelerin asset isimlerini de liste olarak ver, yapılacak asset'lerin hep güncel bir listesi olsun; bu kuralı md'ye ekle.
- **Yapılan değişiklik:** `ASSET_LISTESI.md` oluşturuldu (A: oyuna bağlı, B: kod gerektiren, C: kodla çizilen asset adayları); CLAUDE.md 0.1'e 5. kural (asset listesi + isimlendirme) eklendi; durum kontrol scripti yazıldı.

| Dosya | Açıklama |
|---|---|
| `ASSET_LISTESI.md` | Yeni: tüm görseller, boyut, prompt referansı, durum, eklenme tarihi. Yeni adaylar: `kurucu-*.png` (4), `dekor-*.png`, `su-tanki.png`, `cop-yigini.png`, `lamba.png` |
| `tools/asset-durum.mjs` | Yeni: `ASSETLER`'i `public/assets/` ile karşılaştırır, tanınmayan dosyaları uyarır (şu an 0/16 hazır) |
| `CLAUDE.md` | 0.1 kural 5, dosya tablosu, 6.3'e liste referansı, çalıştırma komutları |
| `PROJECT_LOG.md` | Harita ve ağaç, bu kayıt |

- **Debt:** Yok. Kurucu portreleri için prompt henüz yazılmadı (listede "yok, yazılacak").

### 2026-11-01 00:10 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz2-mekanikler`

- **Prompt:** Asset yükleme rehberini incele ve uyarla: `public/assets/`'ten görsel yükle, eksikse yer tutucu, hedef yüksekliğe ölçekle, etkileşim/ipucu/zıplama/flipX korunsun; derle, commit'le, push'la. (Ayrıca: yorgunluk sabitleri sonra değişecek, mekanik kalsın.)
- **Yapılan değişiklik:** Asset sistemi kuruldu. Rehbere ek olarak `pano`, oda paneli varyantları (yedek: `panel`) ve `bitki-solgun` (sağlık düşünce geçiş) eklendi. Headless Chromium ile test edildi: assetsiz yer tutucular hedef boyutta; 300×600 test `oyuncu.png` → 36×72, origin alt-orta, y=470 zeminde; yürürken zıplama ve sola flipX çalışıyor; radyo ipucu ölçekli yüksekliğin 10 px üstünde.

| Dosya | Açıklama |
|---|---|
| `src/data/assets.js` | Yeni: `ASSETLER` (anahtar → dosya, hedef yükseklik, yedek) |
| `src/scenes/GameScene.js` | `preload()` (loaderror dinlenir); `dokulariUret()` her dokuyu yalnızca yoksa üretir (`dokuUret()`, `YER_TUTUCULAR`); `olcekle()`, `dokuAnahtari()`, `gercekAsset()`; nesne/bitki/oyuncu/sakin ölçekleniyor; ipucu ve kapı "!" `displayHeight` kullanıyor; etkileşim nesne kenarına göre (`ETKILESIM_MESAFE` 30); bitki tint/solgun ayrımı; konsola `[asset]` özeti |
| `public/assets/.gitkeep` | Klasör (test görseli silindi; gerçek `oyuncu.png` bu makinede yoktu) |
| `CLAUDE.md` | Bölüm 5 görseller, 6.3 yeni tablo (yükseklikler, `pano.png`, kullanım), 6.5 pano promptu |
| `PROJECT_LOG.md` | Harita, D1 güncellendi, D11 eklendi |

- **Debt:** D1 güncellendi, yeni D11. Not: rehberde "public/assets/oyuncu.png var" deniyordu ama dosya ne diskte ne uzak dallarda bulundu; eklenince ek iş gerekmeden yüklenir.

### 2026-11-01 00:40 · Timujaponya (arda.timucinacar@gmail.com) · dal: `faz2-mekanikler`

- **Prompt:** Arkadaşımın faz 2 dalından (`faz2-mekanikler`) devam edelim.
- **Yapılan değişiklik:** Ayberk'in WIP M2'si (yorgunluk sabitleri) tamamlandı: mantık, arayüz, sahne ve simülasyon. M1 (laboratuvar durum chip'i) olduğu gibi korundu.

| Dosya | Açıklama |
|---|---|
| `src/state.js` | Sakinlere `yorgunluk`; `yarinkiYorgunluk()`, `ayrilmaSansi()`, `yorgunlukGecesi()`; `gunuBitir()` ayrılanları döndürür; `state.ayrilan`; `geceTahmini().riskliler` |
| `src/ui/ui.js` | Panoda `yorgunlukChip()` ve açıklama; gece tahmininde ayrılma riski uyarısı; gece raporunda ayrılanlar; son ekranda "Tükenip giden" |
| `src/scenes/GameScene.js` | `sakinGuncelle()`: ayrılan sakinin figürü solup silinir (önceden hiç kaldırılmıyordu) |
| `src/style.css` | Yorgunluk uyarı chip rengi |
| `tools/simulasyon.mjs` | Dinlendirme denendi, kötü sonuç verdiği için kaldırıldı; not düşüldü |
| `CLAUDE.md` | Bölüm 4.14 Yorgunluk |

- **Simülasyon (M2 öncesi → sonrası):** akıllı+herkesi al iyi son %91 → %82; akıllı+yarısı %34 → %16; akıllı+kimseyi alma yalnız ütopya %100 → %98.
- **Debt:** Yeni D10 (yorgunluk dengesi, karar bekliyor). Derleme ve mantık testi geçti; tarayıcıda elle kontrol edilmedi. Commit atılmadı.

### 2026-11-01 · Ayberk Alkan (ayberk2002alkangizli@gmail.com)

- **Prompt:** Devam et (mekanik odaklı). Odak: D6 — simülasyon artık Faz 1'in araştırma + görev mekaniğini test etmeli.
- **Yapılan değişiklik:** `tools/simulasyon.mjs` araştırma kuyruğunu (batarya → grisu) ve ziyaretçi uzmanlığına göre atamayı akıllı stilde kullanıyor. Çıktıya "ort.arş" (ortalama açılan araştırma) sütunu eklendi. Oyun mantığı değişmedi; akıllı+hepsiniAl %91, akıllı+kimseyiAlma %100 oranları eski commit ile birebir aynı. CLAUDE.md 4.11 tablosu güncel sayılarla + yorum ("araştırma yalnızca kapı açıkken açılıyor") yeniden yazıldı.

| Dosya | Açıklama |
|---|---|
| `tools/simulasyon.mjs` | `arastirmaSec`/`gorevAta`/`sakinTanimi` importları; `akilliAtamalariYap`, `akilliArastirmaSec`; `oyna()` stil adı alıyor; çıktı: ort.arş sütunu |
| `CLAUDE.md` | 4.11 tablosu güncellendi (akıllı+herkesi al %91, yarısını-al satırları eksikti eklendi), ort.arş kolonu; yorumda "paylaşım = ilerleme" mesajı |
| `PROJECT_LOG.md` | D6 güncellendi (araştırma + atama simülasyonda kullanılıyor; playtest hâlâ eksik); bu kayıt |

- **Debt:** D6 kısmen kapandı (araştırma ve atama test ediliyor), ama tarayıcıda insan playtest hâlâ eksik. Diğer debt'ler aynı.

### 2026-11-01 · Ayberk Alkan (ayberk2002alkangizli@gmail.com)

- **Prompt:** Son geliştirmeler üzerinden mekanik yönden devam et: D9 (sakin konumlandırma + boş makine ipucu) ve D7 (HUD'a araştırma + batarya göstergesi) — efekt değil mekanik odaklı.
- **Yapılan değişiklik:** Sakin sprite'ları artık `state.sakinler` ile `uid` üzerinden eşlenip görevine göre konumlanıyor (makineyse panelin yanı, araştırmaysa panonun yanı, boşsa yaşam alanı). Görev değişince yeni konuma yürüyor; yürüyüşten sonra o anchor etrafında hafif gezinme. Panel ipucu, makine panelinde operatörü/boşluğu yazıyor. HUD'a aktif araştırma (ikon + segmentli ilerleme barı + puan/maliyet) ve batarya (yalnızca Batarya Deposu açıldıysa) kutuları eklendi. Oyun mantığı ve sayılar değişmedi; `node tools/simulasyon.mjs` çıktısı son commit ile birebir aynı.

| Dosya | Açıklama |
|---|---|
| `src/scenes/GameScene.js` | `state.js`'den `MAKINELER, makineOperatoru, sakinTanimi` import; `panoSpritesi`, `sakinKonumu`, `sakinIdleBaslat`, `sakinTasi` yardımcıları; `sakinGuncelle()` artık uid-eşlemeli, görev değişiminde taşıyor; `update()` ipucu metnine operatör durumu |
| `src/ui/ui.js` | `hudKur()`'a `hud-ekstra` sarmalı (araştırma + batarya kutuları); `hudGuncelle()` ikisini state'e göre doldurup gösteriyor/gizliyor |
| `src/style.css` | `.hud-ekstra`, `.hud-arastirma`, `.hud-batarya` stilleri; kaynak barı boşluğu daraltıldı |
| `PROJECT_LOG.md` | D7, D9 kapandı; bu kayıt |

- **Debt:** D7 ve D9 kapandı. D1–D3, D6, D8 açık.

### 2026-11-01 00:10 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** main'e pushla.
- **Yapılan değişiklik:** UX kuralları, Faz 1 (görev/trait/araştırma/batarya), makine-operatör sistemi ve 4. kurucu tek commit olarak `main`'e gönderildi; GDD PDF'i repoya eklendi.

| Dosya | Açıklama |
|---|---|
| `Son_Denge_Mekanik_Tasarim_GDD.pdf` | Repoya eklendi (CLAUDE.md ve Project Map atıf yapıyor) |
| `PROJECT_LOG.md` | GDD "untracked" notu kaldırıldı, bu kayıt |

- **Debt:** Yok. Tarayıcıda elle test hâlâ yapılmadı (D6).

### 2026-11-01 00:05 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** 4. kurucuyu ekle, tüm makineler dolu başlasın.
- **Yapılan değişiklik:** Kurucu Can (Geri Dönüşüm) eklendi; oyun dört makine dolu başlıyor. Nüfus 4 kaldı (dört kurucu, oyuncu sayılmaz). Simülasyon: akıllı+herkesi al iyi son %91, akıllı+kimseyi alma yalnız ütopya %100 (makinelerden önceki 96/100'e yakın).

| Dosya | Açıklama |
|---|---|
| `src/data/visitors.js` | `KURUCULAR`'a Can (`geriDonusum`) |
| `src/scenes/GameScene.js` | `sakinGuncelle()`: sakin figürü sayısı `nufus - 1` → `nufus` (oyuncu nüfusa sayılmıyor) |
| `CLAUDE.md` | 4.3 nüfus açıklaması, 4.13 kurucular |
| `PROJECT_LOG.md` | D6 güncellendi, bu kayıt |

- **Debt:** Yok (D6 güncellendi). Nüfus 5 seçeneği denendi (iyi son %83 / %98), seçilmedi.

### 2026-10-31 23:55 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** Koloni üyeleri makinelerde çalışmaya gönderilebilsin; çalışanı olmayan makine üretim yapmasın; boştaki makinelere oyuncu gidip kendisi çalışabilsin.
- **Yapılan değişiklik:** Görev sistemi makine modeline çevrildi: 4 makine (tek operatör), Laboratuvar, Dinlen. Makineler gece üretir, boş makine üretmez; oyuncu boş makinede 1 eylemle kendisi çalışabilir. 3 kurucu sakin eklendi. Bakım/Üretim görevleri kaldırıldı; uzmanlık artık bir makine yeri. Sabit gece tüketimi, dört makine çalışınca eski dengeyi verecek şekilde artırıldı.

| Dosya | Açıklama |
|---|---|
| `src/data/panels.js` | Her panele `makine: { ad, ikon, uretim }` |
| `src/data/research.js` | `GOREVLER` → Laboratuvar + Dinlen; `OYUNCU_CALISMA_MALIYETI` |
| `src/data/visitors.js` | `uzman` artık makine anahtarı/`arastirma`/`*`; metinler güncellendi; `KURUCULAR` (Selin, Burak, Nur) |
| `src/state.js` | `AYAR.gunSonuDegisim` −21/−9/−9/+15/−3; `MAKINELER`, operatör/boş makine yardımcıları, `kendinCalis()`, `varsayilanGorev()`; kurucular `sifirla()`'da; `oyuncuMakineler` her sabah sıfırlanır |
| `src/ui/ui.js` | Panoda makine durum şeridi ve makine/lab/dinlen görev butonları; panelde operatör bilgisi + "Makinede kendin çalış"; tahmin ve sabah ekranında boş makine uyarısı |
| `src/style.css` | Dolu görev butonu, görev ızgarası |
| `tools/simulasyon.mjs` | Oyuncu her gün önce boş makinelerde kendisi çalışır |
| `CLAUDE.md` | 4.3 gece tüketimi + makine üretimi, 4.12 AYAR, 4.13 yeniden yazıldı |

- **Debt:** D6 güncellendi (oyun zorlaştı, karar bekliyor); yeni D9 (sahnede makine/operatör görseli yok). Mantık testleri ve derleme geçti; tarayıcıda elle kontrol edilmedi.

### 2026-10-31 23:20 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** Faz 1 dar kapsam (görev atama + traitler + batarya/depolama) ve "localde nasıl çalıştırıp test ederim".
- **Yapılan değişiklik:** GDD Faz 1 dar kapsam uygulandı: uzman sakinlere Üretim/Bakım/Araştırma görevi, ziyaretçi traitleri (güçlü yön + koşullu bedel), Batarya Deposu ve Gri Su araştırmaları, yeni Görev ve Araştırma Panosu. Gece hesabı tek fonksiyonda toplandı (tahmin = gerçek).

| Dosya | Açıklama |
|---|---|
| `src/data/research.js` | Yeni: `ARASTIRMALAR`, `GOREVLER`, `MASA_ARASTIRMA`, batarya ayarları |
| `src/data/visitors.js` | Traitler: `uzman`, `guclu`, `kosullu`, `kosul`, `ekTuketim`, `calisir` |
| `src/data/facts.js` | `batarya`, `grisu` bilgi kartları |
| `src/data/rooms.js` | Yaşam Alanı'na `pano` nesnesi (x 370) |
| `src/state.js` | `sakinler`, `arastirma`, `batarya` durumu; görev/araştırma/batarya fonksiyonları; `geceHesapla()`; `gunuBitir()` araştırma ve batarya sonuçlarını döndürür |
| `src/ui/ui.js` | `panoAc()`/`panoCiz()`; ziyaretçi kartında traitler ve olası görevler; tahmin ve gece raporunda araştırma/batarya satırları |
| `src/scenes/GameScene.js` | `pano` dokusu ve etkileşimi |
| `src/style.css` | Pano stilleri |
| `CLAUDE.md` | Bölüm 4.13 (yeni mekanikler), dosya tablosuna `research.js` |

- **Debt:** Yeni D6 (denge testi yok), D7 (HUD'da batarya yok), D8 (pano görseli). D3'e yeni kartlar eklendi. Senaryo testi ve derleme geçti; tarayıcıda elle kontrol edilmedi.

### 2026-10-31 22:40 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** GDD önerileri hackathon için yapılıyor (teslim 1 Kasım 23:59), bilgiyi kaydet ve çalışmaya başla.
- **Yapılan değişiklik:** Kapsam bilgisi kaydedildi; GDD'nin "onaylanmış iki UX kuralı" uygulandı: ziyaretçi kartında NET gece etkisi, günü bitirmeden önce gece tahmini penceresi. Kaynak katsayıları değişmedi, simülasyon çıktısı aynı.

| Dosya | Açıklama |
|---|---|
| `src/state.js` | `ziyaretciNetEtki(z)` ve `geceTahmini()` eklendi (durumu değiştirmeyen hesaplar) |
| `src/ui/ui.js` | Ziyaretçi kartına "Her gece NET etki" satırı; yeni `gunuBitirOnay()` penceresi (kaynak değişimi, denge önce→sonra, bekleyen ziyaretçi / çöküş / son gece uyarıları) |
| `src/scenes/GameScene.js` | Yatak etkileşimi genel `ui.onay` yerine `ui.gunuBitirOnay` çağırıyor |
| `src/style.css` | `.ziyaretci-satir.net` ayırıcı çizgi |
| `CLAUDE.md` | Bölüm 0: "yeni büyük sistem önerme" yerine GDD önerilerinin bu teslim kapsamında olduğu yazıldı |
| `PROJECT_LOG.md` | Haritaya yeni fonksiyonlar eklendi, D4–D5 kapandı |

- **Debt:** Kapandı: D4, D5. Gece tahmini yarının olayını bilemez (bilinçli; pencerede belirtiliyor). Tarayıcıda elle görsel kontrol yapılmadı, yalnızca derleme + mantık testi.

### 2026-10-31 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** Mekanik tasarım dokümanını incele.
- **Yapılan değişiklik:** `Son_Denge_Mekanik_Tasarim_GDD.pdf` incelendi; [MEVCUT] olarak etiketlenen değerler kodla karşılaştırıldı (hepsi eşleşiyor). Kod değişmedi.

| Dosya | Açıklama |
|---|---|
| `PROJECT_LOG.md` | GDD Project Map'e eklendi; D4–D5 borçları ve bu kayıt eklendi |

- **Debt:** Yeni D4, D5 (GDD'nin onaylı iki UX kuralı kodda eksik/kısmi).

### 2026-10-31 · Ayberk Alkan (ayberk2002alkangizli@gmail.com)

- **Prompt:** Oyun mantığına dokunmadan oyuncunun yaptıklarının "hissedilmesi" için GameScene'e efektler ekle: süzülen sayılar, kirli eylemde duman + kamera sarsıntısı, gün başlığı, kapıda tık tık sallanma, enerji azsa lamba titremesi, denge düşükse dışarıda süzülen kül, yeni sakin zıplayarak belirsin, oyuncu yürürken ayak altında toz; ui ↔ sahne arasında window CustomEvent köprüsü kur, restart'ta temizlensin.
- **Yapılan değişiklik:** Arayüz artık `window.dispatchEvent('oyun:…')` ile sahneye haber veriyor; sahne tüm efektleri yönetiyor. Oyun mantığı, sayılar ve metinler değişmedi; `node tools/simulasyon.mjs` çıktısı birebir aynı.

| Dosya | Açıklama |
|---|---|
| `src/ui/ui.js` | `yayinla()`, `gunBasligi()` yardımcıları; `panelAc(def, anahtar)` artık panel anahtarını saklıyor; eylem tıklamasında `oyun:eylemYapildi` yayınlıyor; ziyaretçi kabulünde `oyun:ziyaretciKabul` yayınlıyor |
| `src/scenes/GameScene.js` | `create()`'te window olay dinleyicileri + shutdown'ta temizlik; `duman`/`toz` doku üretimi; dış kül emitteri + ayak toz emitteri; `panelSpritesi`, `kapiSpritesi`, `suzülenEtkiler`, `kirliEfekt`, `efektEylem`, `efektZiyaretci`, `gunBasligiGoster`, `kapiTakTak…`, `lambaTitreme…` metotları; `sakinGuncelle` yeni sakinleri zıplatarak indiriyor; `gorselUygula` kapı sallanmasını, lamba titremesini ve dış külü eşiklere göre açıp kapıyor; `update()` yürürken ayak altı tozu çıkarıyor; `gunuBitirAkisi` araya gün başlığı ekliyor; `etkilesim` panel anahtarını iletiyor |
| `src/main.js` | 1. günde `ui.gunBasligi()` çağrısı ekrana büyük "GÜN 1" + olay adını gösteriyor, sonra radyoyu açıyor |

- **Debt:** Yeni borç yok. Mevcut D1–D3 açık.

### 2026-10-31 · Ayberk Alkan (ayberk2002alkangizli@gmail.com)

- **Prompt:** Oyunun mekaniklerine, sayılarına ve metinlerine dokunmadan arayüzü retro-fütüristik sığınak kontrol terminali diline çevir (koyu zemin, scanline, VT323 + IBM Plex Mono, oda temasına göre vurgu renkleri, segmentli LED barlar, kirli eylem uyarı etiketi, radyo/kapı/gece raporu/son ekranı için özel temalar).
- **Yapılan değişiklik:** Tüm arayüz terminal estetiğine taşındı. Panel verisine `kod` ve `tema` alanları eklendi (yalnızca görsel), ui.js her modal türüne `sinif` adı ve panel kartı için `--tema` CSS değişkeni veriyor, style.css baştan yazıldı. Oyun mantığı ve sayılar değişmedi; `node tools/simulasyon.mjs` çıktısı önceki ile birebir aynı.

| Dosya | Açıklama |
|---|---|
| `index.html` | Google Fonts: VT323 + IBM Plex Mono eklendi |
| `src/data/panels.js` | Her panele `kod` (ENERJİ_01, HİDRO_02, BİYO_03, DÖNÜŞ_04) ve `tema` (amber/cyan/yeşil/turuncu) alanları |
| `src/ui/ui.js` | `modalAc` artık `tema` parametresini `--tema` CSS değişkenine atıyor; panel/radyo/gece/sabah/kapı/bilgi/başlangıç/son için `sinif` adları; etiketlere terminal "▸ KOD // ÇEVRİMİÇİ" formatı ve pulse LED; ziyaretçi ikonu rozete alındı |
| `src/style.css` | Baştan yazıldı: terminal çerçevesi, köşe vida detayları, CRT scanline, segmentli LED barlar, komut-satırı eylem butonları, kirli eylem için yanıp sönen `⚠ KİRLETİR` etiketi, radyo için amber frekans çizgisi, kapı için paslı tema, bilgi kartı için cyan ekran, son ekranı sonuç tipine göre renk değiştiriyor |

- **Debt:** Yeni borç yok. D1 (AI görselleri) hâlâ açık. `color-mix()` ve `:has()` kullanımı modern tarayıcı gerektiriyor (Chrome/Safari/Firefox 2023+).

### 2026-10-31 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** Yapılan değişikliği main'e pushla.
- **Yapılan değişiklik:** Asistan kuralları ve proje logu commit'lenip `main`'e gönderildi.

| Dosya | Açıklama |
|---|---|
| `PROJECT_LOG.md` | Bu kayıt eklendi |

- **Debt:** Yok.

### 2026-10-31 · Timujaponya (arda.timucinacar@gmail.com)

- **Prompt:** CLAUDE.md'ye kural ekle: her prompt sonunda kullanıcı bilgisiyle log tutulsun; logda project map ve son değişiklikler (tarih, değişiklik, dosya, açıklama, debt) olsun; yeni promptlarda tüm proje yerine project map'ten ilgili yere gidilsin.
- **Yapılan değişiklik:** Asistan çalışma kuralları eklendi, proje logu oluşturuldu.

| Dosya | Açıklama |
|---|---|
| `CLAUDE.md` | Bölüm 0.1 "Asistan çalışma kuralları" eklendi; dosya yapısı tablosuna `PROJECT_LOG.md` eklendi |
| `PROJECT_LOG.md` | Yeni dosya: Project Map, borç listesi, değişiklik logu |

- **Debt:** Yeni borç yok. Mevcut borçlar D1–D3 olarak kayda geçirildi.
