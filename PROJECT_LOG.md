# Proje Logu

> Bu dosya yapay zeka asistanının çalışma haritası ve değişiklik günlüğüdür. Kurallar `CLAUDE.md` → bölüm 0.1'de.
> **Project Map** her değişiklikte güncel tutulur; **Değişiklik Logu** en yeni kayıt en üstte olacak şekilde büyür.

---

## Project Map

Yeni bir istekte önce bu tabloya bakıp yalnızca ilgili dosyaya/fonksiyona gidin.

### Hangi iş nerede?

| İhtiyaç | Gidilecek yer |
|---|---|
| Denge sayıları, başlangıç değerleri, eşikler | `src/state.js` → `AYAR`, `BASLANGIC`, `AGIRLIK` |
| Gece tüketimi, gün sonu, sonların belirlenmesi | `src/state.js` → `nufusTuketimi()`, `gunuBitir()`, `sonucBelirle()` |
| Gece tahmini, ziyaretçinin net gece etkisi | `src/state.js` → `geceHesapla()` (tek gece hesabı), `geceTahmini()`, `ziyaretciNetEtki()` |
| Sakin görseli seçimi (özel `sakin-<id>` / genel `sakin-N`) | `assets.js` → `SAKIN_OZEL_YUKSEKLIK` ve otomatik `sakin-<id>` girdileri; `GameScene.js` → `sakinGuncelle()` (`ozelDoku`), `sakinAnimGuncelle()` |
| Sakinler, görev atama, trait koşulları | `src/state.js` → `sakinCiktisi()`, `kosulAktif()`, `gorevAta()`, `varsayilanGorev()`, `katkiGuncelle()`; veri: `visitors.js` (`uzman`, `kosul`, `ekTuketim`, `guclu`, `kosullu`, `KURUCULAR`) |
| Makineler, operatör, boş makine, kendin çalış | `src/state.js` → `MAKINELER`, `makineOperatoru()`, `bosMakineler()`, `kendinCalis()`; üretim: `panels.js` → `makine.uretim`; arayüz: `ui.js` → `makinePanelHtml()`, `makineDurumHtml()` |
| Uzman olmayan verim ve enerji azlığında makine kapanışı | `src/state.js` → `AYAR.uzmanOlmayanVerim`, `AYAR.makineKapatmaEsikleri`, `kapaliMakineler()`, `makineKapali()`; uygulama: `sakinCiktisi()`, `sakinlerToplami()`, `calisiyor()` |
| Yorgunluk ve ayrılma (Faz 2 / M2) | `src/state.js` → `yarinkiYorgunluk()`, `ayrilmaSansi()`, `yorgunlukGecesi()` (gunuBitir içinde), `AYAR.yorgunluk*`; arayüz: `ui.js` → `yorgunlukChip()`; sahne: `GameScene.js` → `sakinGuncelle()` (ayrılan figür solar) |
| Hazırlıklı olaylar (tahmin, hazırlık) | Veri: `events.js` (`uyari`, `hazirlik`, `HAZIRLIK_MALIYETI`); kurallar: `state.js` → `state.tahmin`, `olayEtkisi()`, `hazirlan()`, `gunuBitir()` (tahmin → olay); arayüz: `ui.js` → `tahminHtml()`, `olayHtml()`, `hazirlikBagla()` |
| Eğitici karar kartları | Veri: `src/data/cards.js` → `KARTLAR`; kurallar: `state.js` → `kartKontrol()` (gunuBitir sonunda), `kartSec()`, `kartSecenekleri()`, `state.kartGeceEtki` (geceHesapla); arayüz: `ui.js` → `kararKartiGoster()`, `sabahGoster()` |
| Keşif (sefer, dönüş) | Veri: `src/data/exploration.js` → `KESIF_NOKTALARI`; kurallar: `state.js` → `kesfeGonder()`, `kesifSansi()`, `seferSabahi()` (gunuBitir sabahı), `state.sefer`; arayüz: `ui.js` → `kesifHtml()` (pano), `seferHtml()` (gece raporu); sahne: `sakinGuncelle()` keşiftekini gizler |
| Memnuniyet, itiraz kartı, güven oylaması | `state.js` → `AYAR.memnuniyet*`, `memnuniyetGecesi()`, `state.guvenDusukGece`, `gunuBitir()` (`guvenKaybi` sonu); kart: `cards.js` → `itiraz`; arayüz: `ui.js` → HUD `[data-memnuniyet]`, `memnuniyetHtml()`, `SONLAR.guvenKaybi` |
| Araştırma ve batarya | `src/state.js` → `arastirmaSec()`, `masadaArastir()`, `puanEkle()`, `geceHesapla()`; veri: `src/data/research.js` |
| Görev ve Araştırma Panosu arayüzü | `ui.js` → `panoAc()`, `panoCiz()`; nesne: `rooms.js` (`tip: 'pano'`), doku: `GameScene.js` → `dokulariUret()` |
| Panel eylemi yapma kuralları | `src/state.js` → `eylemYapabilirMi()`, `eylemYap()` |
| Ziyaretçi kabul/ret kuralları | `src/state.js` → `ziyaretciKabul()`, `ziyaretciReddet()` |
| Panel ve eylem içerikleri | `src/data/panels.js` → `PANELLER` |
| Radyo olayları | `src/data/events.js` → `ILK_OLAY`, `OLAYLAR` |
| Ziyaretçiler | `src/data/visitors.js` → `ZIYARETCILER` |
| "Biliyor muydun?" kartları | `src/data/facts.js` → `BILGILER`, `GENEL_BILGILER`; seçim: `state.js` → `bilgiSec()` |
| Açılış hikayesi metinleri | `src/data/story.js` → `HIKAYE` |
| Oda düzeni, pencereler, nesne konumları | `src/data/rooms.js` → `ODALAR`, `ODA_GENISLIK`, `TAVAN_Y`, `ZEMIN_Y` |
| Yapılacak görsellerin listesi ve durumu | Bu dosya → **Asset Listesi** bölümü (A–D); durum kontrolü: `node tools/asset-durum.mjs` |
| Animasyonlar (kare yükleme, oynatma) | Tanım: `src/data/animations.js` → `ANIMASYONLAR`; yükleme: `GameScene.js` → `preload()` (1. kare), `animasyonlariYukle()`; oynatma: `animOynat()`, `animDurdur()`, `makineAnimGuncelle()`, `sakinAnimGuncelle()`, `update()` (oyuncu), `efektZiyaretci()` (kapı); dosyalar: `public/assets/anim/` |
| Arka planlar (oda, manzara) | Yerleşim ayarları: `rooms.js` → `ODA_GENISLIK` (776, görsel oranına göre), `GORSEL_ZEMIN_ORANI`, `GORSEL_DUVAR_ORANI`, `ARKA_OLCEK`, `ODALAR[].gorsel` (`nesneOran`, `bitkiOran`, `copOran`, `suGostergeleri`, `duman`); rework şablonları: `docs/oda-sablonlari/`; brif ve promptlar: `CLAUDE.md` 6.12; `GameScene.js` → `odaGorseliYerlestir()` (oran korur, kırpar, `odaYerlesimi`, `dumanNoktasi`), `odaGecisleriCiz()` (kolon + gölge), `evCiz()` (oda-*, oda adı etiketi, arka nesne perspektifi), `dekorCiz()` (oda görseli varken süs çizimleri atlanır, tank/saksı stili), `disariCiz()` + `gorselUygula()` (manzara-*, iyi↔kötü geçiş) |
| Portre ve hikaye görselleri (HTML) | `ui.js` → `portreRozet()`, `portreBuyuk()`, `girisHikayesi()`; yollar: `assets.js` → `portreDosyasi()`, `hikayeDosyasi()` |
| Çizim netliği (2× tuval + zoom, asset küçültme) | `GameScene.js` → `CIZIM_OLCEGI`, `SABIT_X/Y`, `ekranaSabitle()`, `yuksekKaliteKucult()`, `dokuKucult()`, `dokuKucultOran()`, `assetleriKucult()`; tuval boyu: `src/main.js` |
| Görsel içerik kutusu (şeffaf boşluk hariç ölçek) | `GameScene.js` → `icerikKutusu()`, `animKutusu()`, `olcekle()`, `gorunurY()` |
| Var olan asset listesi (404'süz yükleme, canlı yenileme) | `vite.config.js` → `assetListesi()` eklentisi; `src/assetListesi.js` → `assetVar()`; kullanım: `GameScene.js` → `preload()`, `animasyonlariYukle()`; `ui.js` → `varsaImg()` |
| Nesne boyları (gerçek ölçü) | `assets.js` → `PX_METRE` (75, oda görsellerinden kalibre), `m()`; üretim standardı: `docs/olcek-standardi.md` |
| Görsel yükleme (public/assets) ve yer tutucular | Liste + hedef yükseklik: `src/data/assets.js` → `ASSETLER`; yükleme: `GameScene.js` → `preload()`; yer tutucu: `dokulariUret()` / `dokuUret()`; ölçek: `olcekle()`, `dokuAnahtari()`, `gercekAsset()`; dosyalar: `public/assets/` |
| Dışarısı, şehir silueti | `GameScene.js` → `disariCiz()`, `sehirBoya()` |
| Ev/oda çizimi, oda dekorları | `GameScene.js` → `evCiz()`, `dekorCiz()` |
| Oyuncu, hareket, etkileşim (E tuşu) | `GameScene.js` → `oyuncuOlustur()`, `update()`, `oyuncuDurdur()` (pencere açıkken duruş), sabitler `HIZ`, `ETKILESIM_MESAFE` |
| Sakinlerin sayısı/hareketi | `GameScene.js` → `sakinGuncelle()` |
| Ütopya ↔ distopya görsel dönüşümü | `GameScene.js` → `gorselGuncelle()`, `gorselUygula()`, `renkGecis()` |
| HUD (kaynak barları) | `src/ui/ui.js` → `hudKur()`, `hudGuncelle()` |
| Panel penceresi | `ui.js` → `panelAc()`, `panelCiz()` |
| Radyo, sabah raporu, kapı kartı | `ui.js` → `olayGoster()`, `gunBaslangici()`, `sabahGoster()`, `ziyaretciGoster()` |
| Hikaye, başlangıç ve son ekranları | `ui.js` → `girisHikayesi()`, `baslangicEkrani()`, `SONLAR`, `sonGoster()` |
| Genel modal / onay pencereleri | `ui.js` → `modalAc()`, `modalKapat()`, `onay()`, `bilgi()` |
| Günü bitirme onayı (gece tahmini penceresi) | `ui.js` → `gunuBitirOnay()`; çağrı: `GameScene.js` → `case 'yatak'` |
| Arayüz stili | `src/style.css` |
| Giriş noktası (Phaser config) | `src/main.js` |
| Denge simülasyonu | `tools/simulasyon.mjs` (`node tools/simulasyon.mjs`) |
| Derleme / tek dosya çıktısı | `vite.config.js`, `package.json` |
| GitHub Pages yayını | `.github/workflows/deploy.yml` |
| Takım dokümanı (hikaye, mekanik, görsel promptları) | `CLAUDE.md` |
| Mekanik tasarım (GDD v2.0; [ÖNERİ]'ler hackathon kapsamında, faz sırası bölüm 14) | `Son_Denge_Mekanik_Tasarim_GDD.pdf` |

### Dosya ağacı

```
index.html                 HTML iskeleti (#hud, #modal)
src/main.js                Phaser oyununu başlatır
src/assetListesi.js        public/assets'te var olan dosyalar (Vite sanal modülü; yalnız tarayıcı)
src/state.js               Oyun durumu ve tüm kurallar (abone/bildir ile UI'ya yayın)
src/scenes/GameScene.js    Phaser sahnesi: çizim, hareket, etkileşim, görsel dönüşüm
src/ui/ui.js               HTML/CSS arayüz katmanı
src/style.css              Arayüz stili (cqw ile ölçekleme)
src/data/*.js              İçerik verisi (panels, events, visitors, facts, story, rooms, research, assets, animations, cards, exploration)
public/assets/             Oyun görselleri (CLAUDE.md 6.3 adlarıyla; eksikse yer tutucu)
public/assets/anim/        Animasyon kareleri (<animasyon>-<kare>.png)
tools/simulasyon.mjs       4000 oyunluk denge simülasyonu
tools/asset-durum.mjs      public/assets'te hangi görsellerin ve animasyon karelerinin hazır olduğunu listeler
.github/workflows/deploy.yml  main → GitHub Pages
CLAUDE.md                  Takım dokümanı + asistan kuralları
docs/oda-sablonlari/       Oda görselleri rework şablonları (sablon-<oda>.png, 1891×831)
assets-orijinal/           Küçültülmeden önceki asset yedekleri (git'e girmez, .gitignore)
docs/olcek-standardi.md    Asset üretiminde tek ölçü standardı (ölçek dizisi) + prompt
docs/olcek-sablonu.png     Ölçek dizisi şablonu (tek taban, 1 m = 300 px, 10 yuva)
docs/final-asset-promptu.md  Asset sohbetine tek seferde yapıştırılacak final prompt (eksik/düzeltilecek tüm görseller)
PROJECT_LOG.md             Bu dosya (Project Map, borçlar, Asset Listesi, değişiklik logu)
Son_Denge_Mekanik_Tasarim_GDD.pdf  Mekanik tasarım dokümanı (9 sayfa)
```

### Bilinen borçlar (açık debt listesi)

| # | Borç | Yer | Eklenme |
|---|---|---|---|
| D2 | Otomatik test yok; doğrulama yalnızca simülasyon ve elle oynama | `tools/simulasyon.mjs` | 2026-10-31 |
| D3 | "Biliyor muydun?" rakamları kaynaklarından kontrol edilmedi (kaynak etiketleri 2026-11-01'de 1. el'e çekildi; sayıların doğruluğu hâlâ sunum öncesi doğrulanmalı) | `src/data/facts.js` | 2026-10-31 |
| D6 | Simülasyon artık görev atama + araştırma seçimini kullanıyor; akıllı stilde ortalama 1.67 araştırma açılıyor. Faz 1 sayıları hâlâ tarayıcıda insan tarafından playtest edilmedi | `tools/simulasyon.mjs` | 2026-10-31 |
| D10 | Yorgunluk ayarlarıyla dinlendirme stratejisi kötü: herkes 0'dan başlayıp 4. gece aynı anda riske giriyor; riskteki herkesi dinlendiren akıllı stil iyi sonu %82 → %20 düşürüyor. Öneri: kurucuları farklı yorgunlukla başlatmak ya da dinlenmeyi −3 / eşiği 5 yapmak (karar bekliyor) | `AYAR.yorgunluk*`, `KURUCULAR` | 2026-11-01 |
| D12 | Hazırlıklı olaylarla zararlı olaylar ~1,6 kat sertleştirildi (hazırlık bir eylem değerinde olsun diye). Toplam zorluk arttı: akıllı+herkesi al iyi son %83 → %61 (hazırlanarak; hazırlıksız %62). 1,3 katta hazırlık bazen kötü seçim çıkıyordu. Dengeleme D10 ile birlikte yapılmalı | `events.js`, `AYAR` | 2026-11-01 |
| D14 | Oda + manzara görselleri PNG olarak 19 MB; açılış ~35 MB. WebP'ye çevirmek yüklemeyi hızlandırır | `public/assets/oda-*`, `manzara-*`, `assets.js` | 2026-11-01 |

---

## Asset Listesi

> **Tek, güncel liste** (görseller ve animasyonlar birlikte, kategori yok). 1 Kasım 2026'da oyunun son hâline göre **sıfırdan** oluşturuldu: komple yeniden üretim için her şey burada. Kural: `CLAUDE.md` → 0.1 madde 5.
> Üretim standardı: **ölçek dizisi** (`docs/olcek-standardi.md`, şablon `docs/olcek-sablonu.png`) · oda brifi ve promptları: `CLAUDE.md` 6.12 · stil blokları: 6.4 · durum kontrolü: `node tools/asset-durum.mjs`.

**Genel kurallar**
- Dosya adı küçük harf, Türkçe karakter yok. `.png` ile biten satırlar tek görsel; uzantısız satırlar **animasyon**: kareler `anim/<ad>-1.png … -N.png` olur (2×2 / 2×3 ızgaralı tek görsel olarak teslim edilebilir, kesme asistanda).
- Nesne ve karakterler: şeffaf (ya da düz beyaz) arka plan, yandan görünüş, karakterler sağa bakar, taban en altta. Boyut serbest; oyun "Boy" sütunundaki gerçek ölçüye göre ölçekler (`PX_METRE`). Göreli boylar için ölçek dizisiyle üretin.
- Animasyon kareleri: aynı boyut, aynı konum, aynı taban çizgisi; sadece hareket eden kısım değişir.
- Odalar: 21:9, duvar–zemin çizgisi **tüm odalarda %74,5**, yürüme çizgisi %82, kenar %4'ler aynı kolon, camlar düz magenta #FF00FF, gerçek ölçek (1 m = yüksekliğin %18'i ön zeminde, %16,5'i duvar dibinde). Odanın "Ne" sütunundaki konumlar oyunun nesneleri yerleştirdiği yerlerdir; boş sürümde bu alanlar **boş bırakılır**.
- **Her oda iki sürüm:** `oda-<oda>.png` (boş) + `oda-<oda>-tam.png` (aynı görsel, etkileşimli nesneler içine çizili). Oyun birleşik sürüm varsa onu kullanır ve nesnelerin üstüne görünmez etkileşim alanı koyar (garanti yol); yoksa ayrı parçaları yerleştirir. En kolay üretim: önce birleşik sürümü üretin, sonra aynı görselden nesneleri silip boş sürümü elde edin (ya da tersi).
- Teslimde ölçekleme/kırpma yok; dosyaları olduğu gibi `public/assets/`'e koyun ya da asistana verin (isimlendirme, kesme, küçültme, magenta silme asistanda).

**Toplam:** 72 satır · 55 görsel · 17 animasyon (57 kare). "İsteğe bağlı/Önerilir" olanlar yoksa oyun yedeğini kullanır.

| # | Dosya / animasyon | Ne (odalarda: içerik ve ayrılacak alanlar) | Boy / oran | Kare | Zorunlu | Not |
|---|---|---|---|---|---|---|
| 1 | `oda-yasam.png` | Yaşam Alanı arka planı — **boş sürüm** (oyunun nesneleri ayrı parça olarak konur). **İçerik ve ayrılacak alanlar** (x = görsel genişliğine %): KAPI x 13–21% (1,1×2,1 m, duvar dibi) · RADYO+SEHPA x 71–78% (0,8×0,9 m, duvar dibi) · YATAK x 35–59% (2,0×0,9 m) · GÖREV PANOSU ön zeminde x 3–11% (1,1×1,7 m) · sakinlerin durduğu boş zemin x 41–59%. Süs: kitaplık x 23–34% (1,2 m altı) + üstünde pencere, duvar rafı/askılar x 60–71%, koltuk + büyük bitki x 80–96%. | 21:9 (≈2,33:1) | — | Evet | Zemin çizgisi %74,5 · kenar %4 kolon · camlar magenta · 6.12 |
| 2 | `oda-yasam-tam.png` | Yaşam Alanı — **birleşik sürüm**: `oda-yasam.png` ile birebir aynı görsel + etkileşimli nesneler (kapı, radyo+sehpa, yatak, görev panosu) yukarıdaki konum ve boylarda içine çizili. Varsa oyun bunu kullanır, nesnelerin üstüne görünmez etkileşim alanı koyar. | 21:9 (≈2,33:1) | — | Önerilir (garanti) | Boş sürümle aynı kompozisyon; sadece listelenen nesneler eklenir. Dinamik olanlar (bitki, çöp, su seviyesi, karakterler) ÇİZİLMEZ |
| 3 | `oda-enerji.png` | Enerji Odası arka planı — **boş sürüm** (oyunun nesneleri ayrı parça olarak konur). **İçerik ve ayrılacak alanlar:** DİZEL JENERATÖR x 5–31% (2,4×1,9 m; dikey baca, ucu x 15%, y 20% — kirli eylem dumanı buradan) · ENERJİ PANELİ x 57–65% (0,9×1,5 m, duvar dibi) · operatör boş zemini x 50–72%. Süs: alet tezgâhı x 31–50% + üstünde pencere, batarya rafı x 72–96%, üst duvarda kablo kanalları. | 21:9 (≈2,33:1) | — | Evet | Zemin çizgisi %74,5 · kenar %4 kolon · camlar magenta · 6.12 |
| 4 | `oda-enerji-tam.png` | Enerji Odası — **birleşik sürüm**: `oda-enerji.png` ile birebir aynı görsel + etkileşimli nesneler (enerji paneli) yukarıdaki konum ve boylarda içine çizili. Varsa oyun bunu kullanır, nesnelerin üstüne görünmez etkileşim alanı koyar. | 21:9 (≈2,33:1) | — | Önerilir (garanti) | Boş sürümle aynı kompozisyon; sadece listelenen nesneler eklenir. Dinamik olanlar (bitki, çöp, su seviyesi, karakterler) ÇİZİLMEZ |
| 5 | `oda-su.png` | Su Arıtma arka planı — **boş sürüm** (oyunun nesneleri ayrı parça olarak konur). **İçerik ve ayrılacak alanlar:** 2 SU TANKI x 27–40% ve 44–57% (her biri 1,7×2,4 m); önlerinde dikey GÖSTERGE CAMI x 37,2–38,0% ve 53,1–54,2%, y 38–64%, içi düz açık gri (su seviyesini oyun çizer) · ARITMA PANELİ x 61–70% (0,9×1,5 m, duvar dibi) · operatör boş zemini x 57–74%. Süs: kavanozlu raf x 5–24% + üstünde pencere, akan sulu beton havuz x 74–95%, tanklar arası borular/vanalar. | 21:9 (≈2,33:1) | — | Evet | Zemin çizgisi %74,5 · kenar %4 kolon · camlar magenta · 6.12 |
| 6 | `oda-su-tam.png` | Su Arıtma — **birleşik sürüm**: `oda-su.png` ile birebir aynı görsel + etkileşimli nesneler (arıtma paneli (tanklar zaten görselde)) yukarıdaki konum ve boylarda içine çizili. Varsa oyun bunu kullanır, nesnelerin üstüne görünmez etkileşim alanı koyar. | 21:9 (≈2,33:1) | — | Önerilir (garanti) | Boş sürümle aynı kompozisyon; sadece listelenen nesneler eklenir. Dinamik olanlar (bitki, çöp, su seviyesi, karakterler) ÇİZİLMEZ |
| 7 | `oda-sera.png` | Sera arka planı — **boş sürüm** (oyunun nesneleri ayrı parça olarak konur). **İçerik ve ayrılacak alanlar:** arka duvar 1 m yükseklikten tavana CAM DUVAR (camlar magenta) · YÜKSELTİLMİŞ YATAKLAR x 5–37% ve FİDE RAFLARI x 38–70% (hepsi 1 m altında, duvar dibinde) · ön zemin x 6–63% BOŞ (oyun 7 saksı bitki dizer, 0,65 m) · SERA PANELİ x 81–89% (0,9×1,5 m, duvar dibi) · operatör boş zemini x 74–82%. | 21:9 (≈2,33:1) | — | Evet | Zemin çizgisi %74,5 · kenar %4 kolon · camlar magenta · 6.12 |
| 8 | `oda-sera-tam.png` | Sera — **birleşik sürüm**: `oda-sera.png` ile birebir aynı görsel + etkileşimli nesneler (sera paneli) yukarıdaki konum ve boylarda içine çizili. Varsa oyun bunu kullanır, nesnelerin üstüne görünmez etkileşim alanı koyar. | 21:9 (≈2,33:1) | — | Önerilir (garanti) | Boş sürümle aynı kompozisyon; sadece listelenen nesneler eklenir. Dinamik olanlar (bitki, çöp, su seviyesi, karakterler) ÇİZİLMEZ |
| 9 | `oda-geri.png` | Geri Dönüşüm arka planı — **boş sürüm** (oyunun nesneleri ayrı parça olarak konur). **İçerik ve ayrılacak alanlar:** hurda kasaları duvar dibinde x 4–23%, ÖNLERİ BOŞ ön zemin x 6–20% (oyun büyüyüp küçülen çöp yığını çizer, 1,8×0,9 m) · GERİ DÖNÜŞÜM PANELİ x 47–57% (0,9×1,5 m, duvar dibi) · operatör boş zemini x 45–59%. Süs: tamir tezgâhı + alet panosu x 24–45%, geri dönüşüm afişi x 53–58% (1,6 m üstü), ayrıştırılmış kutu rafları x 59–95%, pencere x 6–20%. | 21:9 (≈2,33:1) | — | Evet | Zemin çizgisi %74,5 · kenar %4 kolon · camlar magenta · 6.12 |
| 10 | `oda-geri-tam.png` | Geri Dönüşüm — **birleşik sürüm**: `oda-geri.png` ile birebir aynı görsel + etkileşimli nesneler (geri dönüşüm paneli) yukarıdaki konum ve boylarda içine çizili. Varsa oyun bunu kullanır, nesnelerin üstüne görünmez etkileşim alanı koyar. | 21:9 (≈2,33:1) | — | Önerilir (garanti) | Boş sürümle aynı kompozisyon; sadece listelenen nesneler eklenir. Dinamik olanlar (bitki, çöp, su seviyesi, karakterler) ÇİZİLMEZ |
| 11 | `manzara-iyi.png` | Şehir panoraması, ütopya hâli (pencerelerden ve çatı üstünden görünür) | 21:9 (≈2,33:1), yatay döşenebilir | — | Evet | Ufuk %55 · 6.7 |
| 12 | `manzara-kotu.png` | Aynı panorama, distopya hâli (denge düştükçe belirir) | 21:9 (≈2,33:1), aynı kompozisyon | — | Evet | 6.7 |
| 13 | `cati.png` | Sığınak çatı şeridi, eğik güneş panelleri + havalandırma | 6:1, yatay döşenebilir | — | Evet | Final prompt C |
| 14 | `oyuncu.png` | Oyuncu karakteri (sağa bakan, duruş) | 1,75 m | — | Evet | Ölçek dizisinin referansı · 6.13 |
| 15 | `oyuncu-bekle` | Oyuncu dururken (nefes) | 1,75 m | 4 (döngü, 4 fps) | Evet |  |
| 16 | `oyuncu-yuru` | Oyuncu yürürken | 1,75 m | 6 (döngü, 10 fps) | Evet | Gelince kodla zıplama kapanır |
| 17 | `oyuncu-calis` | Oyuncu panele dokunurken | 1,75 m | 4 (bir kez, 8 fps) | Evet |  |
| 18 | `sakin-1.png` | Genel sakin 1 (asalı yaşlı işçi); isimsiz sakinler sırayla bunları kullanır | 1,7 m | — | Evet | 6.5 |
| 19 | `sakin-2.png` | Genel sakin 2 (örgülü kadın, saha ceketli); isimsiz sakinler sırayla bunları kullanır | 1,7 m | — | Evet | 6.5 |
| 20 | `sakin-3.png` | Genel sakin 3 (deri önlüklü usta); isimsiz sakinler sırayla bunları kullanır | 1,7 m | — | Evet | 6.5 |
| 21 | `sakin-4.png` | Genel sakin 4 (hardal şapkalı genç gezgin); isimsiz sakinler sırayla bunları kullanır | 1,7 m | — | Evet | 6.5 |
| 22 | `sakin-1-bekle` | Sakin 1 dururken | 1,7 m | 2 (döngü, 2 fps) | Evet |  |
| 23 | `sakin-1-yuru` | Sakin 1 yürürken | 1,7 m | 4 (döngü, 8 fps) | Evet |  |
| 24 | `sakin-2-bekle` | Sakin 2 dururken | 1,7 m | 2 (döngü, 2 fps) | Evet |  |
| 25 | `sakin-2-yuru` | Sakin 2 yürürken | 1,7 m | 4 (döngü, 8 fps) | Evet |  |
| 26 | `sakin-3-bekle` | Sakin 3 dururken | 1,7 m | 2 (döngü, 2 fps) | Evet |  |
| 27 | `sakin-3-yuru` | Sakin 3 yürürken | 1,7 m | 4 (döngü, 8 fps) | Evet |  |
| 28 | `sakin-4-bekle` | Sakin 4 dururken | 1,7 m | 2 (döngü, 2 fps) | Evet |  |
| 29 | `sakin-4-yuru` | Sakin 4 yürürken | 1,7 m | 4 (döngü, 8 fps) | Evet |  |
| 30 | `sakin-selin.png` | Sahnede Kurucu Selin (enerji); varsa genel sakin görseli yerine bu | 1,7 m | — | İsteğe bağlı | Portresiyle aynı kişi, tam boy, yandan |
| 31 | `sakin-burak.png` | Sahnede Kurucu Burak (su); varsa genel sakin görseli yerine bu | 1,7 m | — | İsteğe bağlı | Portresiyle aynı kişi, tam boy, yandan |
| 32 | `sakin-nur.png` | Sahnede Kurucu Nur (sera); varsa genel sakin görseli yerine bu | 1,7 m | — | İsteğe bağlı | Portresiyle aynı kişi, tam boy, yandan |
| 33 | `sakin-can.png` | Sahnede Kurucu Can (geri dönüşüm); varsa genel sakin görseli yerine bu | 1,7 m | — | İsteğe bağlı | Portresiyle aynı kişi, tam boy, yandan |
| 34 | `sakin-muhendis.png` | Sahnede Deniz, mühendis; varsa genel sakin görseli yerine bu | 1,7 m | — | İsteğe bağlı | Portresiyle aynı kişi, tam boy, yandan |
| 35 | `sakin-ciftci.png` | Sahnede Hasan ve kızı Elif (birlikte); varsa genel sakin görseli yerine bu | 1,7 m | — | İsteğe bağlı | Portresiyle aynı kişi, tam boy, yandan |
| 36 | `sakin-bilim.png` | Sahnede Dr. Leyla; varsa genel sakin görseli yerine bu | 1,7 m | — | İsteğe bağlı | Portresiyle aynı kişi, tam boy, yandan |
| 37 | `sakin-cocuklar.png` | Sahnede Mert ve Ada (iki çocuk birlikte); varsa genel sakin görseli yerine bu | 1,3 m | — | İsteğe bağlı | Portresiyle aynı kişi, tam boy, yandan |
| 38 | `sakin-tamirci.png` | Sahnede Kemal, tamirci; varsa genel sakin görseli yerine bu | 1,7 m | — | İsteğe bağlı | Portresiyle aynı kişi, tam boy, yandan |
| 39 | `sakin-kafile.png` | Sahnede Sahil ailesi (4 kişi birlikte); varsa genel sakin görseli yerine bu | 1,7 m | — | İsteğe bağlı | Portresiyle aynı kişi, tam boy, yandan |
| 40 | `kapi.png` | Sığınak kapısı (kapalı) — ayrı parça | 2,1 m | — | Evet | Birleşik yaşam odası varsa görünmez ama yedek olarak gerekli |
| 41 | `kapi-ac` | Kapı açılıyor (ziyaretçi içeri alınınca) | 2,1 m | 4 (bir kez, 10 fps) | Evet | 1. kare = kapi.png. Birleşik odada oynamaz |
| 42 | `panel.png` | Genel kontrol konsolu (yedek) | 1,5 m | — | Evet | Oda paneli yoksa kullanılır |
| 43 | `panel-calis` | Genel konsol çalışıyor (ekran/ışık) | 1,5 m | 3 (döngü, 6 fps) | Evet |  |
| 44 | `panel-enerji.png` | Enerji konsolu (sönük ekran) — ayrı parça | 1,5 m | — | Evet | = panel-enerji-calis 1. karesi |
| 45 | `panel-enerji-calis` | Enerji konsolu çalışıyor | 1,5 m | 3 (döngü, 6 fps) | Evet | Sadece ekran/düğme ışığı değişir. Birleşik odada görünmez (durum ışığı yine görünür) |
| 46 | `panel-su.png` | Su arıtma konsolu (sönük ekran) — ayrı parça | 1,5 m | — | Evet | = panel-su-calis 1. karesi |
| 47 | `panel-su-calis` | Su arıtma konsolu çalışıyor | 1,5 m | 3 (döngü, 6 fps) | Evet | Sadece ekran/düğme ışığı değişir. Birleşik odada görünmez (durum ışığı yine görünür) |
| 48 | `panel-sera.png` | Sera konsolu (sönük ekran) — ayrı parça | 1,5 m | — | Evet | = panel-sera-calis 1. karesi |
| 49 | `panel-sera-calis` | Sera konsolu çalışıyor | 1,5 m | 3 (döngü, 6 fps) | Evet | Sadece ekran/düğme ışığı değişir. Birleşik odada görünmez (durum ışığı yine görünür) |
| 50 | `panel-geri.png` | Geri dönüşüm konsolu (sönük ekran) — ayrı parça | 1,5 m | — | Evet | = panel-geri-calis 1. karesi |
| 51 | `panel-geri-calis` | Geri dönüşüm konsolu çalışıyor | 1,5 m | 3 (döngü, 6 fps) | Evet | Sadece ekran/düğme ışığı değişir. Birleşik odada görünmez (durum ışığı yine görünür) |
| 52 | `radyo.png` | Küçük sehpa üstünde radyo — ayrı parça | 0,9 m | — | Evet |  |
| 53 | `pano.png` | Ayaklı görev ve araştırma panosu — ayrı parça | 1,7 m | — | Evet | Ön zeminde durur |
| 54 | `yatak.png` | Tek kişilik yatak (yedek) | 0,9 m | — | İsteğe bağlı | Yaşam odası görselinde yatak çizili olduğundan normalde kullanılmaz |
| 55 | `bitki.png` | Saksıda sebze fidesi, sağlıklı (seranın ön zemininde 7 adet) | 0,65 m | — | Evet | Her zaman ayrı parça (dinamik) |
| 56 | `bitki-solgun.png` | Aynı fide, solgun (gıda/denge düşünce) | 0,65 m | — | Evet | Aynı saksı, aynı boy |
| 57 | `cop-yigini.png` | Çöp yığını (atığa göre büyür/küçülür) | 0,9 m (≈1,8 m genişlik) | — | Evet | Her zaman ayrı parça (dinamik) |
| 58 | `ziyaretci-muhendis.png` | Portre: Deniz, mühendis (kapı kartı + pano) | 1:1 | — | Evet | 6.9 |
| 59 | `ziyaretci-ciftci.png` | Portre: Hasan ve kızı Elif (kapı kartı + pano) | 1:1 | — | Evet | 6.9 |
| 60 | `ziyaretci-bilim.png` | Portre: Dr. Leyla (kapı kartı + pano) | 1:1 | — | Evet | 6.9 |
| 61 | `ziyaretci-cocuklar.png` | Portre: Mert ve Ada (kapı kartı + pano) | 1:1 | — | Evet | 6.9 |
| 62 | `ziyaretci-tamirci.png` | Portre: Kemal, tamirci (kapı kartı + pano) | 1:1 | — | Evet | 6.9 |
| 63 | `ziyaretci-kafile.png` | Portre: Sahil kasabasından aile (4 kişi) (kapı kartı + pano) | 1:1 | — | Evet | 6.9 |
| 64 | `kurucu-selin.png` | Portre: kurucu Selin (pano) | 1:1 | — | Evet | 6.9 Kurucular |
| 65 | `kurucu-burak.png` | Portre: kurucu Burak (pano) | 1:1 | — | Evet | 6.9 Kurucular |
| 66 | `kurucu-nur.png` | Portre: kurucu Nur (pano) | 1:1 | — | Evet | 6.9 Kurucular |
| 67 | `kurucu-can.png` | Portre: kurucu Can (pano) | 1:1 | — | Evet | 6.9 Kurucular |
| 68 | `hikaye-1.png` | Açılış hikaye ekranı 1: Dünya ısınıyordu | 16:9 | — | Evet | 6.8 |
| 69 | `hikaye-2.png` | Açılış hikaye ekranı 2: Buz çözüldü | 16:9 | — | Evet | 6.8 |
| 70 | `hikaye-3.png` | Açılış hikaye ekranı 3: Büyük Sessizlik | 16:9 | — | Evet | 6.8 |
| 71 | `hikaye-4.png` | Açılış hikaye ekranı 4: Yeşilvadi | 16:9 | — | Evet | 6.8 |
| 72 | `kapak.png` | Sunum kapağı (oyunda kullanılmaz) | 16:9 | — | Evet | 6.10 |

---

## Değişiklik Logu

<!-- Yeni kayıtları bu satırın hemen altına ekleyin (en yeni en üstte). -->

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
