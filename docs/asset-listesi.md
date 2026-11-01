# Asset listesi — orijinal oda görselleri üzerinden

**Yaklaşım:** Ekibin beğendiği ilk oda görselleri (`docs/orijinal/oda-*.png`) aynen kalır. Nesneleri sonradan üstüne koymuyoruz: oyunun etkileşimli nesneleri ya görselde **zaten var olan** bir öğe olur (yeşil), ya da aynı görsel **düzenlenerek** sahnenin içine çizilir (kırmızı). Oyun bu öğelerin üstüne görünmez etkileşim alanı koyar. Böylece karışıklık ve ölçek sorunu kalmaz. Yerleşim: `docs/oda-sablonlari/plan-<oda>.jpg`.

**Kural:** Oda düzenlemelerinde görselin geri kalanı **hiç değişmez** (aynı boyut, aynı kompozisyon). Ölçeklendirme/kırpma yok. Dosya adları önemli değil, asistan isimlendirir.

## A. Oda düzenlemeleri (orijinal görsel yüklenir, "edit" yapılır)

| # | Çıktı | Kaynak | Yapılacak düzenleme | Görselde zaten olan (oyun kullanır) |
|---|---|---|---|---|
| 1 | `oda-yasam.png` | orijinal/oda-yasam.png | Pencere camını düz magenta (#FF00FF) yap · sandığın üstüne (x %62–66) küçük kırmızı vintage radyo ekle · saksılı ahşap sandığı (x %73–80) kaldırıp yerine zemine basan 2,1 m bunker kapısı çiz | Yatak (günü bitir), mantar pano (görev panosu) |
| 2 | `oda-enerji.png` | orijinal/oda-enerji.png | İki pencerenin camlarını düz magenta yap | Jeneratör (duman bacadan), duvar invertörleri (enerji paneli) |
| 3 | `oda-su.png` | orijinal/oda-su.png | Pencere camını düz magenta yap · (isteğe bağlı) iki tankın dikey gösterge camlarının içini düz açık gri yap | 2 tank (su seviyesi göstergede), filtre ünitesi (arıtma paneli) |
| 4 | `oda-sera.png` | orijinal/oda-sera.png | Büyük cam duvarın bütün camlarını düz magenta yap (çerçeveler, sarmaşıklar ve önündeki bitkiler kalsın) | Duvardaki elektrik kutuları (sera paneli), bitkiler |
| 5 | `oda-geri.png` | orijinal/oda-geri.png | Pencere camını düz magenta yap · gri dosya dolabını (x %62,5–68) kaldırıp yerine aynı yerde duran 1,5 m geri dönüşüm kontrol konsolu çiz | Hurda kasaları, varil (duman) |

Manzara (iyi/kötü), 4 hikaye ekranı ve çatı hazır; yeniden üretilmeyecek.

## B. Karakter ve dinamik nesneler (ayrı, şeffaf)

Tuval kuralı: **1 m = 600 px**, nesnenin tabanı tuvalin altından 40 px yukarıda, şeffaf (ya da düz beyaz) arka plan, yandan görünüş, sağa bakar. Odalar arasındaki ölçek farkını oyun kendisi eşitler.

| # | Dosya | Ne | Tuval | Nesnenin boyu | Kare |
|---|---|---|---|---|---|
| 6 | `oyuncu.png` | Oyuncu (sarı atkılı bakıcı) | 1024×1536 | 1050 px (1,75 m) | — |
| 7 | `oyuncu-bekle` | Oyuncu nefes alıyor | 1024×1536, 2×2 | hücrede 525 px | 4 |
| 8 | `oyuncu-yuru` | Oyuncu yürüyor | 1536×1024, 3×2 | hücrede 450 px | 6 |
| 9 | `oyuncu-calis` | Oyuncu panele dokunuyor | 1024×1536, 2×2 | hücrede 525 px | 4 |
| 10–13 | `sakin-1..4.png` | 4 sakin: asalı yaşlı işçi, örgülü kadın, deri önlüklü usta, şapkalı genç gezgin | 1024×1536 | 1020 px (1,7 m) | — |
| 14–17 | `sakin-1..4-bekle` | Sakinler nefes alıyor | 1024×768, 2×1 | hücrede 510 px | 2 |
| 18–21 | `sakin-1..4-yuru` | Sakinler yürüyor | 1024×1536, 2×2 | hücrede 510 px | 4 |
| 22 | `cop-yigini.png` | Çöp yığını (atığa göre büyür) | 1536×1024 | 540 × 1080 px (0,9 × 1,8 m) | — |
| 23 | `bitki.png` | Saksıda fide, sağlıklı (isteğe bağlı) | 1024×1536 | 390 px (0,65 m) | — |
| 24 | `bitki-solgun.png` | Aynı fide, solgun (isteğe bağlı) | 1024×1536 | 390 px | — |

## C. Arayüz görselleri

| # | Dosya | Ne | Tuval |
|---|---|---|---|
| 25–30 | `ziyaretci-muhendis/ciftci/bilim/cocuklar/tamirci/kafile.png` | Ziyaretçi portreleri (baş + omuz) | 1024×1024 |
| 31–34 | `kurucu-selin/burak/nur/can.png` | Kurucu portreleri | 1024×1024 |
| 35 | `kapak.png` | Sunum kapağı | 1920×1080 |

**Artık gerekmeyenler:** ayrı kapı, panel, radyo, pano, yatak görselleri ve kapı/panel animasyonları (odaların içinde çizili). Makinenin çalışıp çalışmadığını panelin üstündeki ışık gösterir.
