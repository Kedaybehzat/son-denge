# NPC çalışma noktaları

Beş `public/assets/oda-*-tam.png` görseli incelenerek işaretlendi. Koordinatlar görsel genişliği/yüksekliğinin oranıdır. `GameScene.odaYerlesimi[tip].nokta(x,y)` ile gerçek dünya konumuna çevrilir; farklı çözünürlükte aynı yer korunur.

Oyunu `?npcNoktalar=1` ile açınca hedef noktaları, nesne bölgeleri ve kimlikleri görünür. Normal oyunda bu debug çizimleri kapalıdır. Üretim gece hesabından gelir; bu görsel rutinler ekstra kaynak üretmez/tüketmez.

Sakinler görev odasında 40 px kenar payıyla rastgele yürür veya aşağıdaki çalışma noktalarına gider. Atama değişince eski yürüyüş/çalışma/timer temizlenir. Keşiftekiler gizlidir. Sulama: hafif eğilme ve su damlası; onarım: uzanma ve küçük parıltı; düzenleme/inceleme: hafif beden hareketi. Henüz özel çalışma sprite sheet’i yok; mevcut karakter görseli değişmez.

## yasam

Kaynak: `public/assets/oda-yasam-tam.png`.

| Kimlik | Faaliyet | x | y | Nesne bölgesi (sol, üst, sağ, alt) |
|---|---|---|---|---|
| kitaplik | Kitaplığı inceliyor | 0.16 | 0.58 | 0.04, 0.5, 0.28, 0.75 |
| yatak | Yatağı düzenliyor | 0.43 | 0.62 | 0.3, 0.51, 0.56, 0.75 |
| radyo | Radyoyu dinliyor | 0.63 | 0.56 | 0.6, 0.49, 0.66, 0.6 |
| pano | Notları inceliyor | 0.91 | 0.4 | 0.84, 0.29, 0.98, 0.53 |

## enerji

Kaynak: `public/assets/oda-enerji-tam.png`.

| Kimlik | Faaliyet | x | y | Nesne bölgesi (sol, üst, sağ, alt) |
|---|---|---|---|---|
| jenerator | Jeneratörü kontrol ediyor | 0.16 | 0.58 | 0.04, 0.34, 0.27, 0.72 |
| gunes-numune | Panelleri inceliyor | 0.3 | 0.43 | 0.22, 0.37, 0.37, 0.46 |
| tezgah | Parçaları onarıyor | 0.48 | 0.56 | 0.3, 0.5, 0.62, 0.73 |
| konsol | Üretimi kontrol ediyor | 0.73 | 0.41 | 0.64, 0.27, 0.82, 0.51 |
| batarya-rafi | Bataryaları kontrol ediyor | 0.9 | 0.54 | 0.84, 0.26, 0.97, 0.74 |

## su

Kaynak: `public/assets/oda-su-tam.png`.

| Kimlik | Faaliyet | x | y | Nesne bölgesi (sol, üst, sağ, alt) |
|---|---|---|---|---|
| filtre-rafi | Filtreleri düzenliyor | 0.14 | 0.57 | 0.04, 0.36, 0.24, 0.75 |
| tank-1 | Tank vanasını kontrol ediyor | 0.38 | 0.64 | 0.3, 0.2, 0.45, 0.75 |
| tank-2 | Su seviyesini kontrol ediyor | 0.54 | 0.48 | 0.46, 0.2, 0.62, 0.75 |
| aritma | Filtreleri kontrol ediyor | 0.71 | 0.48 | 0.64, 0.29, 0.77, 0.63 |
| lavabo | Suyu kontrol ediyor | 0.87 | 0.56 | 0.79, 0.48, 0.96, 0.76 |

## sera

Kaynak: `public/assets/oda-sera-tam.png`.

| Kimlik | Faaliyet | x | y | Nesne bölgesi (sol, üst, sağ, alt) |
|---|---|---|---|---|
| sulama-kabi | Sulama kabını hazırlıyor | 0.13 | 0.71 | 0.1, 0.65, 0.15, 0.77 |
| domates | Domatesleri suluyor | 0.27 | 0.55 | 0.16, 0.42, 0.39, 0.64 |
| marul | Marullarla ilgileniyor | 0.46 | 0.6 | 0.39, 0.53, 0.53, 0.64 |
| biber | Biberleri kontrol ediyor | 0.61 | 0.55 | 0.53, 0.45, 0.66, 0.65 |
| fide-rafi | Fideleri suluyor | 0.75 | 0.53 | 0.68, 0.37, 0.82, 0.7 |
| saksi-tezgahi | Saksıları düzenliyor | 0.88 | 0.56 | 0.83, 0.45, 0.96, 0.59 |

## geri

Kaynak: `public/assets/oda-geri-tam.png`.

| Kimlik | Faaliyet | x | y | Nesne bölgesi (sol, üst, sağ, alt) |
|---|---|---|---|---|
| hurda-kasalari | Parçaları ayırıyor | 0.12 | 0.62 | 0.03, 0.45, 0.19, 0.75 |
| ayristirma-konsolu | Ayrıştırmayı kontrol ediyor | 0.29 | 0.53 | 0.25, 0.34, 0.33, 0.75 |
| onarim-tezgahi | Aletleri onarıyor | 0.5 | 0.55 | 0.34, 0.46, 0.67, 0.75 |
| malzeme-rafi | Malzemeleri sınıflıyor | 0.83 | 0.56 | 0.74, 0.25, 0.93, 0.74 |
| varil | Varili kontrol ediyor | 0.95 | 0.64 | 0.92, 0.5, 0.99, 0.76 |
