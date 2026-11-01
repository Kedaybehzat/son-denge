# Son Denge · Tasarım Rehberi

> Yeni ekran, panel, görsel ya da etkileşim tasarlarken önce bu belgeyi okuyun. Amaç: oyunun bütün parçalarının aynı dünyadan geliyormuş gibi görünmesi ve aynı biçimde davranması.
>
> Son güncelleme: 1 Kasım 2026. Görsel örnekler `docs/arayuz-ornekleri/`, hedef mockup'lar `docs/tasarim-referans/`, asset durumu `docs/asset-listesi.md`, üretim promptu `docs/asset-promptu.md`, ölçek kuralları `docs/olcek-standardi.md`.

## 1. Tasarım fikri: "Onarılmış sığınağın kontrol odası"

Yeşilvadi, çöküşten sonra eldeki malzemeyle kurulmuş bir sığınak. Arayüz de öyle görünür: **paslı pirinç çerçeveler, yeşil boyalı metal paneller, köşelere tırmanan sarmaşıklar, eski CRT ekranlar ve elle çekilen kollar.** Yıpranmış ama bakımlı, sıcak ve umutlu. Kirli seçimler bu sıcak dünyada sarı-siyah tehlike şeridi ve kırmızımsı tonlarla göze batar.

Üç ilke her tasarım kararını yönlendirir:

1. **Az metin, çok nesne.** Bir şey anlatılacaksa önce bir nesne, gösterge ya da ikonla anlatılır. Düğme listesi yerine kol, çark, şalter, harita pini, not kâğıdı. Ayrıntı metni ancak fareyle üstüne gelinince ekranda belirir.
2. **Her eylemin bedeli görünür.** Bir kontrole dokunmadan önce kazanç (yeşil) ve bedel (kırmızı) önizlenir; göstergelerde sonucun gölgesi çıkar.
3. **Çizim sabit, değer canlı.** Çerçeve, başlık, oda çizimi gibi değişmeyen her şey görselden gelir. Sayı, bar, isim, durum gibi değişen her şey kodla üstüne yazılır. Görselin içine asla değişken bir değer gömülmez.

## 2. Renk paleti

### 2.1 Dünya ve karakter paleti (illüstrasyonlar, sprite'lar)
| Ad | Kod | Kullanım |
|---|---|---|
| Tozlu adaçayı | `#A7B18D` | Genel yeşil tonu, kumaş |
| Zeytin | `#7C8A58` | Bitki, iş kıyafeti |
| Hardal okr | `#C79A33` | Vurgu, metal parlaması |
| Sıcak krem | `#E7D9BC` | Kâğıt, açık yüzey |
| Deri kahve | `#9A6A43` | Ahşap, deri |
| Terrakota | `#B97A5C` | Saksı, tuğla, sıcak vurgu |
| Kontur | `#4E3B2F` | Bütün çizimlerin koyu kahve konturu (asla saf siyah değil) |

### 2.2 Arayüz paleti (mockup'lardan ölçüldü)
| Ad | Kod | Kullanım |
|---|---|---|
| Panel yeşili | `#374321` | Konsol ve pencere zemini |
| Alt şerit yeşili | `#4A4E28` | Alt bantlar, ikincil yüzey |
| Pirinç çerçeve | `#A16D29` | Dış çerçeve, perçin |
| Pas | `#553B20` | Çerçeve gölgesi, yıpranma |
| Vurgu sarısı | `#EDBD2D` / `#FFD23F` | Seçili öğe, fareyle üstüne gelme parlaması, rehber vurgusu |
| Tabela ahşabı | `#685635` | "SON DENGE" gibi tabelalar |
| CRT zemini | `#06130C` → `#0F2A1C` | Ekran içi (radyal degrade) |
| CRT yazısı | `#BFF3C8` / `#E9FFE0` | Ekran metni, başlık |

### 2.3 Anlam renkleri (CSS `:root`)
| Anlam | Değişken | Kod |
|---|---|---|
| İyi / kazanç / çalışıyor | `--yesil` | `#7ED957` |
| Uyarı / orta / seçili mod | `--amber` | `#F2B33D` |
| Kötü / bedel / boş makine | `--kirmizi` | `#FF5A3D` (yazıda `#FF9A80`) |
| Su, bilgi | `--cyan` | `#4FC3F7` |
| Kapı, ziyaretçi | `--pas` | `#C47A4A` |
| Tehlike (kirli seçim) | — | Sarı-siyah şerit `#E0B030` / `#1D1D1D` |

Kural: Bir kaynağın "iyi yönü" için yeşil, kötü yönü için kırmızı kullanılır. Atık ve karbonda artış kırmızı, azalış yeşildir (`KAYNAKLAR[ad].yuksekIyi`).

## 3. Tipografi
| Rol | Font | Not |
|---|---|---|
| Başlık, büyük sayı, düğme | **Barlow Condensed** 600/700 (`--font-baslik`) | Büyük harf, hafif harf aralığı (`0.04–0.12em`) |
| Gövde, açıklama, ekran metni | **Nunito Sans** 400/600/700 (`--font-metin`) | Cümle düzeni |
| Küçük etiketler ("OPERATÖR", "AŞINMA") | Nunito Sans, büyük harf | `0.12–0.14em` aralık, %70 opaklık |

- Fontlar yereldir (`public/fonts/`, OFL). Yeni font eklemeyin.
- Görsel üretiminde metin istenmez; bütün yazıyı oyun kendisi çizer. İstisna: tabela ve sekme gibi kalıcı etiketler mockup'ta çizili olabilir (bkz. 7.3).
- Sayı ölçekleri (mockup pikseli, 1672 px genişliğe göre): başlık 36–44 px, büyük değer 36–48 px, gövde 21–28 px, küçük etiket 17–20 px.

## 4. Ölçü ve yerleşim

- **Oyun dünyası:** 960×540 koordinat, 2× tuvale çizilir. Nesne boyları gerçek ölçüyle: `PX_METRE = 74` (`docs/olcek-standardi.md`). Yetişkin 1,75 m, çocuk 1,3 m.
- **Arayüz:** her şey `cqw` biriminde, sahneyle birlikte ölçeklenir. Mockup tabanlı ekranlarda bir "mockup pikseli" CSS değişkeniyle ifade edilir: konsol `--p`, HUD `--h`, alt şerit `--a`, Ayarlar `--s`. Yeni ekranda aynı yöntemi kullanın: `calc(N * var(--p))`.
- **Standart pencere oranı 1672×941 (≈16:9).** Konsol, yönetim panosu ve hikaye ekranları bu orandadır; pencere genişliği `min(80cqw, 98%)`. Ayarlar 1448×1086, HUD ve alt şerit 2172×240.
- **HUD daima görünür.** Pencereler HUD'un altındaki alanda ortalanır (`--hud-h`); karartma yine tam ekrandır.
- **Pencere içi düzen (konsol):** üstte kimlik rozeti + başlık (sol) ve operatör (sağ); ortada solda CRT ekran, sağda oda görseli + 3 değer kutusu; altta kontrol kutuları; en altta mod anahtarı, aşınma, bakım, eylem, Kapat. Yeni oda/ekran bu iskeleti izler.

## 5. Bileşen kataloğu

Her bileşenin hem mockup görünümü hem kod karşılığı vardır. Yeni ekranlarda önce buradaki bileşenleri kullanın, yeni bileşen gerekirse bu listeye ekleyin.

| Bileşen | Görünüm | Kod |
|---|---|---|
| **Pencere çerçevesi** | Pirinç + pas kenar, köşe perçinleri, sarmaşık; üstte ahşap tabela | Mockup zemini; CSS yedeği `kart-cerceve.png` 9-dilim |
| **Kimlik rozeti** | `▶ KOD // DURUM` + LED; ÇEVRİMİÇİ yeşil/amber, ÇEVRİMDIŞI sönük | `.kr-durum`, `.etiket .led` |
| **CRT ekran** | Koyu yeşil, tarama çizgili; üstte başlık + açıklama, altta göstergeler | `.k-ekran`, `.kr-ekran`; yönetimde tek satır durum ekranı `.y-ekran` |
| **Gösterge (bar)** | Segmentli LED bar, ikon + büyük harf ad + büyük değer; önizlemede yeşil parlayan / kırmızı taralı gölge ve `→ yeni değer` | `.k-gosterge`, `.bar`, `u.iyi/u.kotu` |
| **Oda görseli** | Odanın canlı resmi: sayaç ibresi, tank seviye camı, solan saksılar, atık yığını | `odaGorseliHtml()`, `.k-tank-cam`, `.kr-solgun` |
| **Değer kutusu** | Küçük başlık + büyük renkli değer (Gece tüketimi / Makine üretimi / Bu gece net) | `.kr-deger`, `odaHesabi()` |
| **Kontrol kutusu** | Yazısız sahne resmi; ortasında koyu cam etiket üstünde ad, kazanç/bedel rozetleri, `FİİL · 1▪` | `.modul.resimli`, `modul-<ad>.png` |
| **Mekanizma** | Kol (topuz iner), çark (döner), şalter (kapaklı, kırmızı), vana (çevrilir), kartuş (yuvaya girer), düğme (basılır) | `.modul-kol/cark/salter/vana/kartus/dugme` |
| **Kayar mod anahtarı** | Koyu yuva içinde kayan amber dil: TASARRUF · NORMAL · YOĞUN | `.k-modlar`, `--mod` |
| **Aşınma şeridi** | 10 dilim; dolu amber, 6+ kırmızı; yanında anahtar düğmesi | `.k-asinma-seg`, `.kr-bakim` |
| **Eylem noktaları** | Kare LED'ler, dolu yeşil | `.noktalar` |
| **Operatör rozeti** | Kare yüz portresi + "OPERATÖR / Ad"; yoksa kırmızı ⚠ rozet | `yuzPortresi()`, `rozet-<id>.png` |
| **Sekme** | Pirinç çerçeveli düğme; seçili sekme yeşil parlar | Mockup zemini + `.kr-sekme` |
| **Sakin kartı** | Portre, ad, ★ uzmanlık, 5 dilimli yorgunluk pili, 💬 | `.y-sakin`, `yorgunlukPili()` |
| **Görev sütunu** | Başlık + durum LED'i; seçili sakin varken üstünde "burada ne üretir" önizlemesi | `.y-sutun`, `.y-onizleme` |
| **Harita pini** | Krem damla pin + ikon, altında koyu etiket ve gece sayısı | `.y-pin` |
| **Başarı halkası** | Konik ilerleme halkası içinde yüzde | `.y-sans`, `.y-halka` |
| **Plan kartı / damga** | Mavi plan kâğıdında kart; KURULDU / İNŞADA / KİLİTLİ eğik damga | `.y-plan`, `.y-damga` |
| **Not kâğıdı** | Raptiyeli krem kâğıt, hafif eğik | `.y-not`, `.y-raptiye` |
| **Rehber balonu** | Krem balon, okla hedefi gösterir; hedef sarı nabızla vurgulanır | `.rehber-balon`, `.rehber-vurgu` |
| **Chip / mini etki** | İkon + işaretli sayı, yeşil veya kırmızı | `etkiChipleri()`, `kisaEtki()` |

## 6. Etkileşim kuralları

1. **Fareyle üstüne gelme = bilgi.** Yönetim panosunda `data-bilgi` taşıyan her öğe, ayrıntısını üstteki durum ekranında gösterir. Konsolda kontrolün üstüne gelmek CRT ekranda eylemi ve göstergelerde sonucu önizler. Kalıcı açıklama paragrafı yazmayın.
2. **Görselden gelen düğme.** Çizimdeki düğmenin üstüne görünmez bir düğme konur; fareyle üstüne gelince **sarı parlama halkası** (`box-shadow: 0 0 0 4px #ffd23f, 0 0 22px #ffd23f88`) çıkar.
3. **Basınca geri bildirim.** Kontrol kendi mekanizma animasyonunu oynatır (kol iner, çark döner), sahne kısa parlar, göstergeler eski değerden yeniye kayar, ses çalar. Sonuç mesajı ekranda `> ...` olarak görünür.
4. **Kullanılamayan öğe.** Gri/sönük görünür, tıklanınca kısa sallanır (`.red`), nedeni etikette yazar: "Eylem yok", "Kaynak yetersiz", "Kapalı".
5. **Kirli seçim.** Üstte sarı-siyah tehlike şeridi ve kırmızımsı ton; adının yanında `⚠ kirletir`. Kirli seçimi asla varsayılan ya da en çekici görünen seçenek yapmayın.
6. **Seçim ve atama.** Önce seç, sonra hedefe tıkla; sürükle-bırak ek yoldur (dokunmatikte seç-tıkla çalışır). Seçiliyken hedeflerde sonucun önizlemesi görünür.
7. **Rehber (prolog) etkileşimle ilerler.** "Devam" yalnız okuma adımlarında vardır; diğer adımlar istenen eylem yapılınca geçer (mod değiştir, üstüne gel, kolu çek).
8. **Klavye.** E etkileşim, 1/2/3 kontrol, Esc kapat, Enter varsayılan düğme, F tam ekran, F9 test paneli. Yeni pencerede `data-varsayilan` ve `data-kapat` kullanın.

## 7. Görsel üretim kuralları

### 7.1 Stil
- 2D el boyaması illüstrasyon, temiz koyu kahve kontur, düz renk blokları ve basit cel gölge, hafif guaj/kuru fırça dokusu. Işık sol üstten, sıcak.
- Doğal yetişkin oranları. Chibi, anime, neon, 3D, foto-gerçekçi, piksel sanatı yok.
- Arayüz parçaları: yıpranmış pirinç, yeşil boyalı metal, perçin, sarmaşık, ahşap tabela.

### 7.2 Teslim
- **Yazı, sayı, logo yok.** Değişen hiçbir değer görsele gömülmez.
- Karakter ve nesne: yandan, sağa bakar, taban altta, düz beyaz arka planla üretilir; arka planı sonra silinir. Gölge, hale, duman yok.
- Sahne kartı (`modul-*`): ≈5:2 yatay, opak, alt %40'ı daha sakin ve koyu (yazı oraya gelir), konu sol üst/orta.
- Zemin/arka plan: orta alan sade ve düşük kontrastlı (canlı katman üstüne biner), ayrıntı kenarlarda.
- Boyutlar: karakter/nesne/kare ≤ 600 px yükseklik, portre 512×512, rozet 128×128, ikon ≤ 256×256, hikaye ve zemin ≈1600–1700 px genişlik, JPEG ≤ 300 KB.

### 7.3 Mockup'tan ekran kurma (bu projede kullanılan yöntem)
Tam ekran mockup geldiğinde doğrudan kullanılmaz; şu akış izlenir:
1. Orijinal `assets-orijinal/tasarim-referans/<ad>.png` olarak saklanır (git dışı), küçük kopyası `docs/tasarim-referans/<ad>.jpg`.
2. **Sabit kalanlar** (çerçeve, sarmaşık, tabela, başlık, sekmeler, oda çizimi, düğme çizimleri) zeminde bırakılır.
3. **Değişken bölgeler** (sayılar, barlar, isimler, durum) zeminde bulanıklaştırılıp koyulaştırılır. Doku üstündeki silmeler (harita, mantar pano) doku rengi korunarak, yumuşak kenarla yapılır.
4. Bölgelerin piksel kutuları `src/data/konsol-yerlesim.json` içine yazılır.
5. Canlı katman aynı kutulara yüzde konumla yerleştirilir (`yuzdeYer()`), yazı boyutları mockup pikseliyle (`--p`) ölçeklenir.
6. Zemin yoksa eski CSS tasarımı yedek olarak çalışır; her mockup ekranı isteğe bağlıdır.

Araçlar: `tools/konsol-arka.py` (konsol ve yönetim zeminleri), `tools/ekran-zemin.py` (HUD, alt şerit, Ayarlar, hikaye, arıza konsolu), `tools/mockup-kes.py` (kontrol sahneleri, tank, yüz rozetleri), `tools/kenar-temizle.py` (şeffaf görsel temizliği).

**Mockup isterken:** üretim aracına mevcut bir mockup'ı referans olarak yükleyin ("same frame, palette, fonts and layout as the reference"). Aynı ekranın tutarlı kalması için gerçek oyun metnini (ör. `story.js`) birebir verin. Gömülü metin değişirse görsel de yenilenmelidir.

### 7.4 Kenar temizliği
Her yeni şeffaf görselden sonra:
```bash
python3 tools/kenar-temizle.py public/assets/<dosya>.png
```
Betik arka plan sisini, kopuk lekeleri, yarı silinmiş delikleri ve açık saçağı temizler; orijinali `assets-orijinal/kenar-oncesi/` altına yedekler. Sprite sheet kesilirken her karenin çevresinde boşluk bırakın; kenarı kesik kare geri getirilemez.

### 7.5 Stil blokları (promptların sonuna)
**A · Nesne/karakter:** `2D side-view game asset, hand-painted flat illustration with soft cel shading, clean dark umber outlines, warm muted earthy palette (dusty sage, olive, mustard ochre, warm cream, leather brown, terracotta), weathered eco-bunker, single subject centered, fully visible, plain solid white background, no text, no ground shadow`

**E · Arayüz zemini (yeni):** `2D game UI background in the same style as the reference: weathered brass and rust frame with corner rivets and small vine leaves, olive-green painted metal panel, subtle scratches, warm light from the upper left, centre kept plain and low-contrast for overlaid UI, no text, no numbers, no icons, no buttons`

**F · Kontrol sahnesi (yeni):** `wide 5:2 painted scene card for a game control tile, same style as the reference mockup tiles, main subject upper-left, lower 40% calmer and darker for an overlaid label, no text, no numbers, no UI frame`

Portre (C), sahne (D) ve oda (B) blokları `CLAUDE.md` 6.4'tedir.

### 7.6 Parçalı konsol (güncel)

Dört oda konsolu `ui-panel-cerceve.png`, `ui-panel-metal.jpg`, `ui-dugme-cerceve.png`, `ui-bakim.png` ve bağımsız oda/kontrol sahnelerinden kurulur. Başlık, operatör, durum, sayaç, mod ve düğme metinleri HTML’dir. `.konsol-parcali` yerleşimi CSS ile yönetilir; ortak çerçeve/düğme 9-dilimdir. Yeni konsolda tam ekran mockup üzerine silme/bulanıklaştırma yerine bu parçaları kullanın. Kaynak kutuları `src/data/arayuz-parcalari.json`, yeniden üretim ve kapsam `docs/asset-parcalari.md` içindedir. Altı yönetim bölümü de aynı ortak parçaları `.yonetim-parcali` ile kullanır; sekme adları, başlık ve seçili durum canlıdır. HUD/Ayarlar/hikaye henüz eski yöntemle çalışır.

## 8. Ses ve hareket
- Hareket kısa ve fiziksel: 0,12–0,8 s; yay benzeri eğriler (`cubic-bezier(.3,1.3,.5,1)`) yalnız anahtar ve ibre gibi mekanik parçalarda.
- Durum değişince bar kayar, ibre döner, tank dolar. Değer asla sıçramaz.
- Sürekli animasyon yalnız dikkat isteyen yerde: boş makinenin LED'i, rehber vurgusu, sefer işaretçisi.
- Her tıklamaya `ses-tiklama`, başarılı eyleme `ses-panel-onay` (`SOUNDS.md`).

## 9. Yeni ekran / panel kontrol listesi
- [ ] Değişmeyen her şey görselden, değişen her şey canlı mı?
- [ ] Bileşen kataloğundaki parçalar kullanıldı mı (yeni parça eklendiyse buraya yazıldı mı)?
- [ ] Ekranda kalıcı paragraf yerine fareyle üstüne gelince durum ekranı mı kullanılıyor?
- [ ] Her eylemin kazancı/bedeli önizleniyor mu, kirli seçim işaretli mi?
- [ ] Kullanılamayan öğe gri + neden etiketi + sallanma ile mi gösteriliyor?
- [ ] Yazı boyutları mockup pikseli (`--p`) ya da `cqw` ile mi ölçekleniyor, HUD örtülüyor mu?
- [ ] Görsel yoksa CSS yedeği çalışıyor mu?
- [ ] Prolog/rehber hedefleri (`data-rehber`) yeni yerleşimde de var mı?
- [ ] Yeni görseller `asset-listesi`, `PROJECT_LOG` Asset Listesi ve `assets.js` → `ARAYUZ_DOSYALARI`'na eklendi mi, `tools/kenar-temizle.py` çalıştırıldı mı?
- [ ] Tarayıcıda ekran görüntüsüyle kontrol edildi mi (kesilen, taşan, üst üste binen yazı)?

## 10. Bilinen tutarsızlıklar (düzeltilecek)
- Alt şeritte Koloni düğmesi mockup'ta seçili çizildiği için hafif seçili görünüyor.
- Nur dahil 10 sakinin yüz kimliği mevcut kanonik portreden alınır; mockup rozet kopyaları kullanılmaz. Eksik özel sprite/kare/rozet setleri tamamlandı (`docs/karakter-setleri.md`).
- Yönetim gövdeleri ortak parçalardan ve CSS bileşenlerinden kurulur; ayrıntılı yazısız harita/tahta dokuları isteğe bağlı görsel iyileştirmedir.
- `anim/panel-calis-*` sağ kenarı kesik.
- Hikaye ekranlarının metni görselde gömülü (`story.js` değişirse görsel yenilenmeli).

### Kare konuşmacı portreleri ve logo

Diyalogta iki taraf da görünür: solda `portre-oyuncu.png`, sağda karakterin `kurucu-*` / `ziyaretci-*` kare yüz portresi. Tam boy sprite diyalog fotoğrafı olarak büyütülmez. Konuşan çerçeve parlayıp dinleyen sönükleşir. Oyuncu ve karakter adları canlı yazılır; çerçeve ayrı `ui-dugme-cerceve.png` parçasıdır. Apoclimate logosu kullanıcı kaynağından gelir; ana menü/son ekranı `logo-apoclimate.png`, tarayıcı `favicon.png` kullanır.
