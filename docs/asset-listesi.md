# Asset listesi (sıfırdan)

**Kurallar (hepsi bu kadar)**
- **Karakter ve nesneler:** şeffaf (ya da düz beyaz) arka plan, yandan görünüş, karakterler sağa bakar. Tuvalde **1 m = 600 px**, nesnenin tabanı tuvalin altından 40 px yukarıda. "Nesnenin boyu" sütunundaki yüksekliğe çizin; böylece hepsi birbirine göre doğru boyda olur.
- **Animasyonlar:** tek görselde ızgara; her hücrede aynı boy, aynı konum, aynı taban çizgisi.
- **Odalar:** 1920×820, düz karşıdan kesit. Duvar–zemin çizgisi **her odada y=611**, karakterlerin yürüdüğü çizgi y=672, sol ve sağ 77 px aynı kolon, camlar düz **#FF00FF**. Ölçek: 1 m ≈ 148 px (1,75 m insan ≈ 260 px). "Boş bırak" yazan yerlere hiçbir şey çizilmez.
- Dosya adları önemli değil, asistan isimlendirir. Ölçekleme/kırpma yapmayın.

**Toplam:** 72 (görsel 55, animasyon 17).

| # | Dosya | Ne | Tuval (px) | Nesnenin boyu | Kare | Not |
|---|---|---|---|---|---|---|
| 1 | `oda-yasam.png` | Yaşam Alanı arka planı. Boş bırak: kapı x 250–403, radyo x 1363–1498, pano (ön zemin) x 58–211. Çiz: tek kişilik yatak x 672–1133. Süs: kitaplık+pencere x 442–653, raf/askı x 1152–1363, koltuk+bitki x 1536–1843 | 1920×820 | — | — | Duvar–zemin çizgisi y=611, karakterlerin yürüdüğü çizgi y=672, kenar 77 px kolon, camlar #FF00FF |
| 2 | `oda-enerji.png` | Enerji Odası arka planı. Çiz: dizel jeneratör x 96–595 (baca ucu x 288, y 164). Boş bırak: panel x 1094–1248. Süs: tezgâh+pencere x 595–960, batarya rafı x 1382–1843 | 1920×820 | — | — | Duvar–zemin çizgisi y=611, karakterlerin yürüdüğü çizgi y=672, kenar 77 px kolon, camlar #FF00FF |
| 3 | `oda-su.png` | Su Arıtma arka planı. Çiz: 2 tank x 518–768 ve x 845–1094, önlerinde boş açık gri gösterge camı (x 714–730 ve 1020–1041, y 312–525). Boş bırak: panel x 1171–1344. Süs: raf+pencere x 96–461, su havuzu x 1421–1824 | 1920×820 | — | — | Duvar–zemin çizgisi y=611, karakterlerin yürüdüğü çizgi y=672, kenar 77 px kolon, camlar #FF00FF |
| 4 | `oda-sera.png` | Sera arka planı. 1 m yükseklikten tavana cam duvar (magenta). Çiz: yükseltilmiş yataklar x 96–710, fide rafları x 730–1344 (1 m altında). Boş: ön zemin x 115–1210 (saksılar), panel x 1555–1709 | 1920×820 | — | — | Duvar–zemin çizgisi y=611, karakterlerin yürüdüğü çizgi y=672, kenar 77 px kolon, camlar #FF00FF |
| 5 | `oda-geri.png` | Geri Dönüşüm arka planı. Çiz: hurda kasaları x 77–442 (önleri boş zemin, çöp yığını). Boş bırak: panel x 902–1094. Süs: tamir tezgâhı x 461–864, afiş x 1018–1114, kutu rafları x 1133–1824 | 1920×820 | — | — | Duvar–zemin çizgisi y=611, karakterlerin yürüdüğü çizgi y=672, kenar 77 px kolon, camlar #FF00FF |
| 6 | `oda-yasam-tam.png` | Yaşam Alanı, aynı görsel + boş bırakılan yerlere oyun nesneleri çizili | 1920×820 | — | — | İsteğe bağlı |
| 7 | `oda-enerji-tam.png` | Enerji Odası, aynı görsel + boş bırakılan yerlere oyun nesneleri çizili | 1920×820 | — | — | İsteğe bağlı |
| 8 | `oda-su-tam.png` | Su Arıtma, aynı görsel + boş bırakılan yerlere oyun nesneleri çizili | 1920×820 | — | — | İsteğe bağlı |
| 9 | `oda-sera-tam.png` | Sera, aynı görsel + boş bırakılan yerlere oyun nesneleri çizili | 1920×820 | — | — | İsteğe bağlı |
| 10 | `oda-geri-tam.png` | Geri Dönüşüm, aynı görsel + boş bırakılan yerlere oyun nesneleri çizili | 1920×820 | — | — | İsteğe bağlı |
| 11 | `manzara-iyi.png` | Şehir panoraması, yeşil/iyi hâli | 1920×820 | — | — | Sol ve sağ kenar birbirine uysun, ufuk y=450 |
| 12 | `manzara-kotu.png` | Aynı panorama, kirli/kötü hâli | 1920×820 | — | — | Aynı kompozisyon |
| 13 | `cati.png` | Çatı şeridi: 4 eğik güneş paneli + havalandırma | 1536×256 | şerit altta ~80 px | — | Şeffaf üst, kenarlar birbirine uysun |
| 14 | `oyuncu.png` | Oyuncu (sarı atkılı bakıcı), sağa bakan | 1024×1536 | 1050 px (1,75 m) | — |  |
| 15 | `sakin-1.png` | Sakin 1: asalı yaşlı işçi | 1024×1536 | 1020 px (1,7 m) | — |  |
| 16 | `sakin-2.png` | Sakin 2: örgülü kadın, saha ceketli | 1024×1536 | 1020 px (1,7 m) | — |  |
| 17 | `sakin-3.png` | Sakin 3: deri önlüklü usta | 1024×1536 | 1020 px (1,7 m) | — |  |
| 18 | `sakin-4.png` | Sakin 4: şapkalı genç gezgin | 1024×1536 | 1020 px (1,7 m) | — |  |
| 19 | `sakin-selin.png` | Sahnede Selin (tam boy) | 1024×1536 | 1020 px | — | İsteğe bağlı |
| 20 | `sakin-burak.png` | Sahnede Burak (tam boy) | 1024×1536 | 1020 px | — | İsteğe bağlı |
| 21 | `sakin-nur.png` | Sahnede Nur (tam boy) | 1024×1536 | 1020 px | — | İsteğe bağlı |
| 22 | `sakin-can.png` | Sahnede Can (tam boy) | 1024×1536 | 1020 px | — | İsteğe bağlı |
| 23 | `sakin-muhendis.png` | Sahnede Deniz (tam boy) | 1024×1536 | 1020 px | — | İsteğe bağlı |
| 24 | `sakin-ciftci.png` | Sahnede Hasan + kızı Elif (tam boy) | 1024×1536 | 1020 px | — | İsteğe bağlı |
| 25 | `sakin-bilim.png` | Sahnede Dr. Leyla (tam boy) | 1024×1536 | 1020 px | — | İsteğe bağlı |
| 26 | `sakin-cocuklar.png` | Sahnede Mert + Ada (tam boy) | 1024×1536 | 780 px (1,3 m) | — | İsteğe bağlı |
| 27 | `sakin-tamirci.png` | Sahnede Kemal (tam boy) | 1024×1536 | 1020 px | — | İsteğe bağlı |
| 28 | `sakin-kafile.png` | Sahnede 4 kişilik aile (tam boy) | 1024×1536 | 1050 px | — | İsteğe bağlı |
| 29 | `kapi.png` | Sığınak kapısı, kapalı | 1024×1536 | 1260 px (2,1 m) | — |  |
| 30 | `panel.png` | Genel kontrol konsolu | 1024×1536 | 900 px (1,5 m) | — |  |
| 31 | `panel-enerji.png` | Konsol, enerji temalı (ekran sönük) | 1024×1536 | 900 px (1,5 m) | — |  |
| 32 | `panel-su.png` | Konsol, su arıtma temalı (ekran sönük) | 1024×1536 | 900 px (1,5 m) | — |  |
| 33 | `panel-sera.png` | Konsol, sera temalı (ekran sönük) | 1024×1536 | 900 px (1,5 m) | — |  |
| 34 | `panel-geri.png` | Konsol, geri dönüşüm temalı (ekran sönük) | 1024×1536 | 900 px (1,5 m) | — |  |
| 35 | `pano.png` | Ayaklı görev panosu | 1024×1536 | 1020 px (1,7 m) | — |  |
| 36 | `radyo.png` | Sehpa üstünde radyo | 1024×1536 | 540 px (0,9 m) | — |  |
| 37 | `bitki.png` | Saksıda sebze fidesi, sağlıklı | 1024×1536 | 390 px (0,65 m) | — |  |
| 38 | `bitki-solgun.png` | Aynı fide, solgun | 1024×1536 | 390 px (0,65 m) | — |  |
| 39 | `yatak.png` | Tek kişilik yatak | 1536×1024 | 540 px yük., 1200 px uzun (0,9 × 2 m) | — | İsteğe bağlı |
| 40 | `cop-yigini.png` | Çöp yığını | 1536×1024 | 540 px yük., 1080 px gen. (0,9 × 1,8 m) | — |  |
| 41 | `oyuncu-bekle` | Oyuncu nefes alıyor | 1024×1536, 2×2 ızgara (hücre 512×768) | hücrede 525 px | 4 |  |
| 42 | `oyuncu-yuru` | Oyuncu yürüyor | 1536×1024, 3×2 ızgara (hücre 512×512) | hücrede 450 px | 6 |  |
| 43 | `oyuncu-calis` | Oyuncu panele dokunuyor | 1024×1536, 2×2 ızgara (hücre 512×768) | hücrede 525 px | 4 |  |
| 44 | `sakin-1-bekle` | Sakin 1 nefes alıyor | 1024×768, 2×1 ızgara (hücre 512×768) | hücrede 510 px | 2 |  |
| 45 | `sakin-1-yuru` | Sakin 1 yürüyor | 1024×1536, 2×2 ızgara (hücre 512×768) | hücrede 510 px | 4 |  |
| 46 | `sakin-2-bekle` | Sakin 2 nefes alıyor | 1024×768, 2×1 ızgara (hücre 512×768) | hücrede 510 px | 2 |  |
| 47 | `sakin-2-yuru` | Sakin 2 yürüyor | 1024×1536, 2×2 ızgara (hücre 512×768) | hücrede 510 px | 4 |  |
| 48 | `sakin-3-bekle` | Sakin 3 nefes alıyor | 1024×768, 2×1 ızgara (hücre 512×768) | hücrede 510 px | 2 |  |
| 49 | `sakin-3-yuru` | Sakin 3 yürüyor | 1024×1536, 2×2 ızgara (hücre 512×768) | hücrede 510 px | 4 |  |
| 50 | `sakin-4-bekle` | Sakin 4 nefes alıyor | 1024×768, 2×1 ızgara (hücre 512×768) | hücrede 510 px | 2 |  |
| 51 | `sakin-4-yuru` | Sakin 4 yürüyor | 1024×1536, 2×2 ızgara (hücre 512×768) | hücrede 510 px | 4 |  |
| 52 | `kapi-ac` | Kapı açılıyor (1. kare = kapalı) | 1024×1536, 2×2 ızgara (hücre 512×768) | hücrede 630 px | 4 |  |
| 53 | `panel-calis` | Genel konsol çalışıyor (1. kare sönük) | 1024×1536, 2×2 ızgara (hücre 512×768) | hücrede 600 px | 3 | Sağ alt hücre boş |
| 54 | `panel-enerji-calis` | enerji konsolu çalışıyor (1. kare = panel-enerji.png) | 1024×1536, 2×2 ızgara (hücre 512×768) | hücrede 600 px | 3 | Sağ alt hücre boş |
| 55 | `panel-su-calis` | su konsolu çalışıyor (1. kare = panel-su.png) | 1024×1536, 2×2 ızgara (hücre 512×768) | hücrede 600 px | 3 | Sağ alt hücre boş |
| 56 | `panel-sera-calis` | sera konsolu çalışıyor (1. kare = panel-sera.png) | 1024×1536, 2×2 ızgara (hücre 512×768) | hücrede 600 px | 3 | Sağ alt hücre boş |
| 57 | `panel-geri-calis` | geri konsolu çalışıyor (1. kare = panel-geri.png) | 1024×1536, 2×2 ızgara (hücre 512×768) | hücrede 600 px | 3 | Sağ alt hücre boş |
| 58 | `ziyaretci-muhendis.png` | Portre: Deniz | 1024×1024 | baş+omuz | — |  |
| 59 | `ziyaretci-ciftci.png` | Portre: Hasan + Elif | 1024×1024 | baş+omuz | — |  |
| 60 | `ziyaretci-bilim.png` | Portre: Dr. Leyla | 1024×1024 | baş+omuz | — |  |
| 61 | `ziyaretci-cocuklar.png` | Portre: Mert + Ada | 1024×1024 | baş+omuz | — |  |
| 62 | `ziyaretci-tamirci.png` | Portre: Kemal | 1024×1024 | baş+omuz | — |  |
| 63 | `ziyaretci-kafile.png` | Portre: 4 kişilik aile | 1024×1024 | baş+omuz | — |  |
| 64 | `kurucu-selin.png` | Portre: Selin | 1024×1024 | baş+omuz | — |  |
| 65 | `kurucu-burak.png` | Portre: Burak | 1024×1024 | baş+omuz | — |  |
| 66 | `kurucu-nur.png` | Portre: Nur | 1024×1024 | baş+omuz | — |  |
| 67 | `kurucu-can.png` | Portre: Can | 1024×1024 | baş+omuz | — |  |
| 68 | `hikaye-1.png` | Hikaye ekranı: Dünya ısınıyordu | 1920×1080 | — | — |  |
| 69 | `hikaye-2.png` | Hikaye ekranı: Buz çözüldü | 1920×1080 | — | — |  |
| 70 | `hikaye-3.png` | Hikaye ekranı: Büyük Sessizlik | 1920×1080 | — | — |  |
| 71 | `hikaye-4.png` | Hikaye ekranı: Yeşilvadi | 1920×1080 | — | — |  |
| 72 | `kapak.png` | Sunum kapağı | 1920×1080 | — | — |  |
