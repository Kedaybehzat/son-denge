# Karakter setleri ve eşleştirme · 1 Kasım 2026

10 sakinin her birinde kare yüz portresi, küçük rozet, tam boy sprite, 2 bekleme ve 4 yürüme karesi bulunur. Üretim yalnız eksik dosyalara yapıldı. Önceden mevcut 10 yüz portresi ve Selin/Burak/Can rozetleri SHA-256 ile korundu (`korunan-assetler.json`). Mevcut oyuncu sprite ve animasyonları da değiştirilmedi; yalnız eksik baş/omuz portresi üretildi.

| Kimlik | Korunan kare portre | Sahne ve animasyon kökü | Grup |
|---|---|---|---|
| Selin | `kurucu-selin.png` | `sakin-selin` | 1 |
| Burak | `kurucu-burak.png` | `sakin-burak` | 1 |
| Nur | `kurucu-nur.png` | `sakin-nur` | 1 |
| Can | `kurucu-can.png` | `sakin-can` | 1 |
| Deniz | `ziyaretci-muhendis.png` | `sakin-muhendis` | 1 |
| Hasan ve Elif | `ziyaretci-ciftci.png` | `sakin-ciftci` | 2 |
| Dr. Leyla | `ziyaretci-bilim.png` | `sakin-bilim` | 1 |
| Mert ve Ada | `ziyaretci-cocuklar.png` | `sakin-cocuklar` | 2 çocuk |
| Kemal | `ziyaretci-tamirci.png` | `sakin-tamirci` | 1 |
| Sahil ailesi | `ziyaretci-kafile.png` | `sakin-kafile` | 4 |

Statik: `<kök>.png`. Kareler: `anim/<kök>-bekle-1..2.png`, `anim/<kök>-yuru-1..4.png`. Bütün yeni kareler 512×512; opak ayak tabanı 480 px. Çocuk grubunun oyun boyu 1,3 m, diğerleri 1,7 m. Gruptaki kişiler aynı sprite içinde birlikte hareket eder; nüfus/mekanik kuralları değiştirilmedi. Mevcut genel sakin-1/3’ün eksik kareleri de tamamlandı; sakin-2/4 ve oyuncu kareleri korunur. Toplam 37/37 tanımlı animasyon hazır.

Kanonik kimlik kaynağı mevcut `kurucu-*` / `ziyaretci-*` portresidir. Yeni tam boylar bu portre referanslarıyla yerleşik `image_gen` aracında üretildi. Eski mockup rozetleri silinmedi; UI yüz seçiminde kanonik portreye öncelik verilir. Böylece aynı genel sakin görünümü Selin ve Nur gibi farklı kişilere atanmaz.

Diyalogta sol altta oyuncunun yeni `portre-oyuncu.png` baş/omuz resmi, sağ altta konuşulan kişinin mevcut kare yüz portresi görünür. İki çerçeve de açık kalır; konuşan parlak, dinleyen sönüktür. Çerçeve resmi portreye gömülü değildir, mevcut UI parçasını kullanır.

Üretim promptları ve referanslar: [karakter-uretim-istekleri.json](karakter-uretim-istekleri.json). Ham sheet’ler `assets-orijinal/ai-uretim/2026-11-01/` altında (git dışı). `python3 tools/karakter-setleri-hazirla.py` yalnız eksik çıktıları keser; mevcut dosyaları üzerine yazmaz. Kaynak satırları boşluklardan bulunur, kareler ortak boy/tabana hizalanır. `python3 tools/kenar-temizle.py <dosyalar>` ile kenar temizliği uygulanmıştır.

Kontrol: `node tools/karakter-setleri.mjs --kontrol`. Boyut, dosya bütünlüğü, sahip/animasyon/sahne eşleşmesi ve korunan dosya hash’lerini doğrular. Canlı kontrol: `tools/animasyon-canli.mjs` artık tüm 10 sakinin özel sprite/animasyon/sağ diyalog portresi ile oyuncu portresini ve yeni logoyu da denetler. Sanatsal yürüyüş kalitesinin insan playtesti hâlâ yararlıdır; dosya bütünlüğü tek başına bunu ölçmez.

[Portre ve sprite karşılaştırması](arayuz-ornekleri/karakter-setleri.jpg)

## Keşif etkileşimi

Haritadaki dört şehir çizimi geniş yüzde bölgeleriyle seçilir (`exploration.js` → `harita.alan`). Simge ve isim aynı düğmeye aittir; tekrar tıklama seçimi korur. Sürmekte olan, tamamlanmış veya dönüş süresi yetmeyen seferler incelenebilir; gönderme engeli açıkça yazılır. Kontrol: `tools/kesif-tiklama-canli.mjs`.
