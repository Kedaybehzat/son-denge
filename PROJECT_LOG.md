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
src/data/*.js              İçerik verisi (panels, events, visitors, facts, story, rooms, research, assets)
public/assets/             Oyun görselleri (CLAUDE.md 6.3 adlarıyla; eksikse yer tutucu)
tools/simulasyon.mjs       4000 oyunluk denge simülasyonu
.github/workflows/deploy.yml  main → GitHub Pages
CLAUDE.md                  Takım dokümanı + asistan kuralları
PROJECT_LOG.md             Bu dosya
Son_Denge_Mekanik_Tasarim_GDD.pdf  Mekanik tasarım dokümanı (9 sayfa)
```

### Bilinen borçlar (açık debt listesi)

| # | Borç | Yer | Eklenme |
|---|---|---|---|
| D1 | Nesne görselleri artık `public/assets/`'ten yükleniyor ama dosyalar henüz yok (oyuncu.png bekleniyor). Oda arka planı, manzara, hikaye ekranları ve ziyaretçi portreleri için yükleme kodu yok | `GameScene.js` → `evCiz()`/`disariCiz()`, `ui.js` hikaye/kapı kartı | 2026-10-31 |
| D11 | Eksik her asset için konsolda hata satırı (dev: "Failed to process file", yayında 404); işlevsel sorun değil | `GameScene.js` → `preload()` | 2026-11-01 |
| D2 | Otomatik test yok; doğrulama yalnızca simülasyon ve elle oynama | `tools/simulasyon.mjs` | 2026-10-31 |
| D3 | "Biliyor muydun?" rakamları kaynaklarından kontrol edilmedi (yeni: `batarya`, `grisu`) | `src/data/facts.js` | 2026-10-31 |
| D6 | Simülasyon artık görev atama + araştırma seçimini kullanıyor; akıllı stilde ortalama 1.67 araştırma açılıyor. Faz 1 sayıları hâlâ tarayıcıda insan tarafından playtest edilmedi | `tools/simulasyon.mjs` | 2026-10-31 |
| D8 | Pano için görsel prompt yok (bölüm 6), şimdilik kodla çizilmiş | `CLAUDE.md` bölüm 6 | 2026-10-31 |
| D10 | Yorgunluk ayarlarıyla dinlendirme stratejisi kötü: herkes 0'dan başlayıp 4. gece aynı anda riske giriyor; riskteki herkesi dinlendiren akıllı stil iyi sonu %82 → %20 düşürüyor. Öneri: kurucuları farklı yorgunlukla başlatmak ya da dinlenmeyi −3 / eşiği 5 yapmak (karar bekliyor) | `AYAR.yorgunluk*`, `KURUCULAR` | 2026-11-01 |

---

## Değişiklik Logu

<!-- Yeni kayıtları bu satırın hemen altına ekleyin (en yeni en üstte). -->

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
