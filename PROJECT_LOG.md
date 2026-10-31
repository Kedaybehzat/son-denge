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
| Sakinler, görev atama, trait koşulları | `src/state.js` → `sakinCiktisi()`, `kosulAktif()`, `gorevAta()`, `varsayilanGorev()`, `katkiGuncelle()`; veri: `visitors.js` (`uzman`, `kosul`, `ekTuketim`, `guclu`, `kosullu`, `KURUCULAR`) |
| Makineler, operatör, boş makine, kendin çalış | `src/state.js` → `MAKINELER`, `makineOperatoru()`, `bosMakineler()`, `kendinCalis()`; üretim: `panels.js` → `makine.uretim`; arayüz: `ui.js` → `makinePanelHtml()`, `makineDurumHtml()` |
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
| Arka planlar (oda, manzara) | `GameScene.js` → `evCiz()` (oda-*), `disariCiz()` + `gorselUygula()` (manzara-*, iyi↔kötü geçiş) |
| Portre ve hikaye görselleri (HTML) | `ui.js` → `portreRozet()`, `portreBuyuk()`, `girisHikayesi()`; yollar: `assets.js` → `portreDosyasi()`, `hikayeDosyasi()` |
| Çizim netliği (2× tuval + zoom, asset küçültme) | `GameScene.js` → `CIZIM_OLCEGI`, `SABIT_X/Y`, `ekranaSabitle()`, `yuksekKaliteKucult()`, `dokuKucult()`, `dokuKucultOran()`, `assetleriKucult()`; tuval boyu: `src/main.js` |
| Görsel içerik kutusu (şeffaf boşluk hariç ölçek) | `GameScene.js` → `icerikKutusu()`, `animKutusu()`, `olcekle()`, `gorunurY()` |
| Görsel yükleme (public/assets) ve yer tutucular | Liste + hedef yükseklik: `src/data/assets.js` → `ASSETLER`; yükleme: `GameScene.js` → `preload()`; yer tutucu: `dokulariUret()` / `dokuUret()`; ölçek: `olcekle()`, `dokuAnahtari()`, `gercekAsset()`; dosyalar: `public/assets/` |
| Dışarısı, şehir silueti | `GameScene.js` → `disariCiz()`, `sehirBoya()` |
| Ev/oda çizimi, oda dekorları | `GameScene.js` → `evCiz()`, `dekorCiz()` |
| Oyuncu, hareket, etkileşim (E tuşu) | `GameScene.js` → `oyuncuOlustur()`, `update()`, sabitler `HIZ`, `ETKILESIM_MESAFE` |
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
PROJECT_LOG.md             Bu dosya (Project Map, borçlar, Asset Listesi, değişiklik logu)
Son_Denge_Mekanik_Tasarim_GDD.pdf  Mekanik tasarım dokümanı (9 sayfa)
```

### Bilinen borçlar (açık debt listesi)

| # | Borç | Yer | Eklenme |
|---|---|---|---|
| D11 | Eksik her asset için konsolda hata satırı (dev: "Failed to process file", yayında 404); işlevsel sorun değil | `GameScene.js` → `preload()` | 2026-11-01 |
| D2 | Otomatik test yok; doğrulama yalnızca simülasyon ve elle oynama | `tools/simulasyon.mjs` | 2026-10-31 |
| D3 | "Biliyor muydun?" rakamları kaynaklarından kontrol edilmedi (yeni: `batarya`, `grisu`, `erkenuyari`) | `src/data/facts.js` | 2026-10-31 |
| D6 | Simülasyon artık görev atama + araştırma seçimini kullanıyor; akıllı stilde ortalama 1.67 araştırma açılıyor. Faz 1 sayıları hâlâ tarayıcıda insan tarafından playtest edilmedi | `tools/simulasyon.mjs` | 2026-10-31 |
| D10 | Yorgunluk ayarlarıyla dinlendirme stratejisi kötü: herkes 0'dan başlayıp 4. gece aynı anda riske giriyor; riskteki herkesi dinlendiren akıllı stil iyi sonu %82 → %20 düşürüyor. Öneri: kurucuları farklı yorgunlukla başlatmak ya da dinlenmeyi −3 / eşiği 5 yapmak (karar bekliyor) | `AYAR.yorgunluk*`, `KURUCULAR` | 2026-11-01 |
| D12 | Hazırlıklı olaylarla zararlı olaylar ~1,6 kat sertleştirildi (hazırlık bir eylem değerinde olsun diye). Toplam zorluk arttı: akıllı+herkesi al iyi son %83 → %61 (hazırlanarak; hazırlıksız %62). 1,3 katta hazırlık bazen kötü seçim çıkıyordu. Dengeleme D10 ile birlikte yapılmalı | `events.js`, `AYAR` | 2026-11-01 |
| D13 | Sakin görselleri (`sakin-1..4`) sıraya göre dağıtılıyor, isimli karakterlerle eşleşmiyor: ilk sakin Selin (genç kadın) sahnede `sakin-1` (asalı yaşlı işçi) olarak görünüyor. Çözüm: kurucu/ziyaretçiye özel sprite (`sakin-<id>.png`) ya da sakin-N'leri kurucuların tarifine göre üretmek | `GameScene.js` → `sakinGuncelle()`, `assets.js` | 2026-11-01 |

---

## Asset Listesi

> Yapılması gereken tüm görsellerin **tek güncel listesi** (kural: `CLAUDE.md` → 0.1 madde 5). Her değişiklikte güncel tutulur.
> Promptlar ve stil blokları: `CLAUDE.md` bölüm 6. Durum kontrolü: `node tools/asset-durum.mjs`.

**Durum:** ✅ hazır (`public/assets/`'te) · ⏳ yapılacak · 💤 isteğe bağlı (yoksa yedeği kullanılır)

**Genel kurallar:** Şeffaf PNG (beyaz arka planla üretip arkayı silin), yandan görünüş, sağa bakan karakterler. Boyut ve kenar boşluğu serbest: oyun görselin dolu kısmını ölçer, oranı koruyarak "Yükseklik" sütunundaki değere ölçekler ve en alt dolu satırı zemine oturtur. Büyük üretin (en az 2–3 kat).

---

### A. Oyuna bağlı: `public/assets/`'e koyunca direkt oyuna girer

Kaynak: `src/data/assets.js` (`ASSETLER`). Kod değişikliği gerekmez.

| Dosya | Ne | Yükseklik | Prompt | Durum | Eklendi |
|---|---|---|---|---|---|
| `oyuncu.png` | Ana karakter, sağa bakıyor | 72 px | 6.5 Karakter | ✅ (512×768, 01.11 güncellendi) | 31.10 |
| `panel.png` | Genel kontrol paneli (tüm odalarda) | 100 px | 6.5 Kontrol paneli | ✅ (918×1334, 01.11) | 31.10 |
| `panel-enerji.png` | Enerji odası paneli | 100 px | 6.5 varyasyon | ✅ (1040×1512, 01.11) | 31.10 |
| `panel-su.png` | Su arıtma paneli | 100 px | 6.5 varyasyon | ✅ (1040×1512, 01.11) | 31.10 |
| `panel-sera.png` | Sera paneli | 100 px | 6.5 varyasyon | ✅ (1040×1512, 01.11) | 31.10 |
| `panel-geri.png` | Geri dönüşüm paneli | 100 px | 6.5 varyasyon | ✅ (1040×1512, 01.11) | 31.10 |
| `radyo.png` | Radyo + küçük masa | 80 px | 6.5 Radyo | ✅ (1254×1254, 01.11) | 31.10 |
| `pano.png` | Görev ve araştırma panosu (ayaklı mantar pano) | 110 px | 6.5 Görev panosu | ✅ (1081×1455, 01.11) | 31.10 |
| `yatak.png` | Yatak (günü bitirir) | 60 px | 6.5 Yatak | ✅ (1862×845, 01.11) | 31.10 |
| `kapi.png` | Sığınak kapısı | 120 px | 6.5 Kapı | ✅ (933×1686, 01.11) | 31.10 |
| `bitki.png` | Sera bitkisi, sağlıklı | 56 px | 6.5 Bitki | ✅ (1024×1536, 01.11) | 31.10 |
| `bitki-solgun.png` | Sera bitkisi, solgun (gıda/denge düşünce) | 56 px | 6.5 Bitki | 💤 | 31.10 |
| `sakin-1.png` | Sakin 1: asalı yaşlı işçi | 64 px | 6.5 Sakinler | ✅ (1024×1536, 01.11) | 31.10 |
| `sakin-2.png` … `sakin-4.png` | Diğer sakinler (6.5: genç kadın atkılı, önlüklü orta yaşlı adam, şapkalı genç kız) | 64 px | 6.5 Sakinler | ⏳ | 31.10 |
| `oda-yasam.png` | Yaşam Alanı arka planı (duvarın üstüne biner; **pencereyi şeffaf bırakın**, dışarısı görünsün) | 640×280'e gerilir | 6.6 | ⏳ | 31.10 |
| `oda-enerji.png` | Enerji Odası arka planı | 640×280 | 6.6 | ⏳ | 31.10 |
| `oda-su.png` | Su Arıtma arka planı | 640×280 | 6.6 | ⏳ | 31.10 |
| `oda-sera.png` | Sera arka planı | 640×280 | 6.6 | ⏳ | 31.10 |
| `oda-geri.png` | Geri Dönüşüm arka planı | 640×280 | 6.6 | ⏳ | 31.10 |
| `manzara-iyi.png` | Şehir panoraması, ütopya (kodla çizilen şehrin yerine geçer, yatayda tekrar eder; kenarları birleşebilir olsun) | 470 px yükseklik | 6.7 | ⏳ | 31.10 |
| `manzara-kotu.png` | Aynı panorama, distopya (denge düştükçe belirir; yoksa iyi hâl karartılır) | 470 px | 6.7 | 💤 | 31.10 |

### B. Arayüz görselleri: `public/assets/`'e koyunca kartlarda görünür

Kaynak: `src/data/assets.js` → `portreDosyasi()`, `hikayeDosyasi()`; kullanım `src/ui/ui.js`. Dosya yoksa emoji ya da düz ekran kalır.

| Dosya | Ne | Nerede görünür | Boyut | Prompt | Durum | Eklendi |
|---|---|---|---|---|---|---|
| `hikaye-1.png` … `hikaye-4.png` | Açılış hikaye ekranları | Hikaye kartının üstünde bant | 16:9 | 6.8 | ⏳ | 31.10 |
| `ziyaretci-muhendis.png` | Deniz, mühendis | Kapı kartı (büyük) + pano rozeti | 1:1 | 6.9 | ⏳ | 31.10 |
| `ziyaretci-ciftci.png` | Hasan ve kızı Elif | Kapı kartı + pano | 1:1 | 6.9 | ⏳ | 31.10 |
| `ziyaretci-bilim.png` | Dr. Leyla | Kapı kartı + pano | 1:1 | 6.9 | ⏳ | 31.10 |
| `ziyaretci-cocuklar.png` | Mert ve Ada | Kapı kartı + pano | 1:1 | 6.9 | ⏳ | 31.10 |
| `ziyaretci-tamirci.png` | Kemal, tamirci | Kapı kartı + pano | 1:1 | 6.9 | ⏳ | 31.10 |
| `ziyaretci-kafile.png` | Sahil kasabasından aile (4 kişi) | Kapı kartı + pano | 1:1 | 6.9 | ⏳ | 31.10 |
| `kurucu-selin.png` | Kurucu Selin (Enerji) | Pano rozeti | 1:1 | 6.9 Kurucular | ⏳ | 01.11 |
| `kurucu-burak.png` | Kurucu Burak (Su) | Pano rozeti | 1:1 | 6.9 Kurucular | ⏳ | 01.11 |
| `kurucu-nur.png` | Kurucu Nur (Sera) | Pano rozeti | 1:1 | 6.9 Kurucular | ⏳ | 01.11 |
| `kurucu-can.png` | Kurucu Can (Geri Dönüşüm) | Pano rozeti | 1:1 | 6.9 Kurucular | ⏳ | 01.11 |
| `kapak.png` | Sunum kapağı | Oyunda kullanılmaz (sunum) | 16:9 | 6.10 | ⏳ | 31.10 |

### D. Animasyonlar: `public/assets/anim/<animasyon>-<kare>.png`

Kaynak: `src/data/animations.js` (`ANIMASYONLAR`). Kareler 1'den başlar: `oyuncu-yuru-1.png` … `oyuncu-yuru-6.png`. **Bir animasyonun tüm kareleri gelmeden animasyon oynamaz** (nesne sabit görselle kalır). Kareler aynı boyutta, karakter her karede aynı yerde/aynı ölçekte olmalı; alt kenar zemine basar. Yükseklik sahibinin yüksekliğidir.

| Animasyon | Dosyalar | Kare | FPS | Tür | Ne zaman oynar | Yükseklik | Durum | Eklendi |
|---|---|---|---|---|---|---|---|---|
| `oyuncu-bekle` | `oyuncu-bekle-1..4.png` | 4 | 4 | döngü | Oyuncu dururken (nefes alma) | 72 px | ⏳ | 01.11 |
| `oyuncu-yuru` | `oyuncu-yuru-1..6.png` | 6 | 10 | döngü | Oyuncu yürürken (gelince kodla zıplama kapanır) | 72 px | ✅ (512×768, 01.11) | 01.11 |
| `oyuncu-calis` | `oyuncu-calis-1..4.png` | 4 | 8 | bir kez | Panelle etkileşimde (tuşlara basma) | 72 px | ⏳ | 01.11 |
| `sakin-1-bekle` … `sakin-4-bekle` | `sakin-N-bekle-1..2.png` | 2 (×4 sakin) | 2 | döngü | Sakin dururken | 64 px | ⏳ | 01.11 |
| `sakin-1-yuru` … `sakin-4-yuru` | `sakin-N-yuru-1..4.png` | 4 (×4 sakin) | 8 | döngü | Sakin yürürken | 64 px | ⏳ | 01.11 |
| `kapi-ac` | `kapi-ac-1..4.png` | 4 | 10 | bir kez | Ziyaretçi içeri alınınca (kapalı → açık) | 120 px | ⏳ | 01.11 |
| `panel-calis` | `panel-calis-1..3.png` | 3 | 6 | döngü | Makinenin operatörü varken; boş makinede durur | 100 px | ⏳ | 01.11 |

**Toplam:** 13 animasyon, 59 kare (oyuncu 14, sakinler 24, kapı 4, panel 3). Öncelik önerisi: `oyuncu-yuru` → `oyuncu-bekle` → `panel-calis` → sakinler.

### C. Şu an kodla çizilen, ileride asset olabilecekler (öneri adlar)

Oyunda `GameScene.js` → `dekorCiz()` / `evCiz()` içinde kodla çiziliyor. Görsel yapılırsa yukarıdaki A tablosuna taşınır ve koda bağlanır.

| Önerilen dosya | Ne | Oda | Not | Durum |
|---|---|---|---|---|
| `dekor-dolap.png` | Ahşap dolap | Yaşam Alanı | | 💤 |
| `dekor-batarya.png` | Batarya rafı (3'lü) | Enerji Odası | Batarya araştırmasıyla bağ kurulabilir | 💤 |
| `dekor-jenerator.png` | Dizel jeneratör (bacalı) | Enerji Odası | Kirli eylemde duman buradan çıkıyor | 💤 |
| `su-tanki.png` | Su tankı gövdesi (şeffaf pencereli) | Su Arıtma | İçindeki su seviyesi kodla çizilmeye devam eder | 💤 |
| `dekor-boru.png` | Duvar borusu | Su Arıtma | | 💤 |
| `dekor-saksi.png` | Uzun saksı sırası | Sera | Bitkiler üstüne dizilir | 💤 |
| `dekor-kutular.png` | Renkli ayrıştırma kutuları (4'lü) | Geri Dönüşüm | | 💤 |
| `cop-yigini.png` | Çöp yığını | Geri Dönüşüm | Atığa göre büyür/küçülür | 💤 |
| `lamba.png` | Tavan lambası | Tüm odalar | Işığı kodla, enerjiye göre | 💤 |

---

## Değişiklik Logu

<!-- Yeni kayıtları bu satırın hemen altına ekleyin (en yeni en üstte). -->

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
