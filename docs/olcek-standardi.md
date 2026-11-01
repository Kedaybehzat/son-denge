# Ölçek standardı — asset üretiminde tek ölçü

**Sorun:** Görsel üretim araçları her görseli ayrı ayrı çizdiğinde nesnelerin birbirine göre boyu tutarsız çıkar (kapı insandan kısa, panel tezgâhtan küçük…). Tek tek "şu kadar metre olsun" demek işe yaramıyor.

**Çözüm: ölçek dizisi (lineup).** Aynı kategorideki tüm nesneler **tek bir görselde, aynı taban çizgisi üzerinde, yan yana** ve **referans insanın (oyuncu) yanında** çizilir. Model aynı görsel içinde göreli boyları çok daha tutarlı tutar. Sonra bu görsel parçalara kesilir: referans insanın boyu = 1,75 m kabul edilir, her nesnenin gerçek boyu piksel oranından **otomatik** çıkar. Oyun da tek bir sayı ile (`PX_METRE`) ölçekler.

## Kurallar
1. **Tek referans:** her ölçek dizisinin 1. yuvasında oyuncu karakteri (1,75 m) durur. Kesimde referans olarak kullanılır, oyuna girmez.
2. **Tek taban çizgisi:** tüm nesnelerin ayağı/tabanı aynı yatay çizgide; hiçbir şey havada ya da taban altında değil.
3. **Aynı açı ve ışık:** hepsi yandan, sağa bakan, aynı ışık.
4. **Şeffaf (ya da düz beyaz) arka plan,** nesneler birbirine değmez (aralarında boşluk).
5. **Odalar** ayrıca: oda promptunda "1 m = görsel yüksekliğinin %18'i" kuralı + istenirse odanın ortasında aynı oyuncu çizilir (kesimde silinir) → oda ölçeği aynı referansa bağlanır.
6. **Gerçek boylar** (tablo `src/data/assets.js`): insan 1,75 · sakin 1,7 · çocuk 1,3 · kapı 2,1 · panel 1,5 · pano 1,7 · radyo+sehpa 0,9 · yatak 0,9 · saksı bitki 0,65 · çöp yığını 0,9 m.

## Şablon ve prompt
Şablon: `docs/olcek-sablonu.png` (referans olarak yükleyin; kutular sadece boy rehberi).

```
Using the attached scale template as a guide, draw ALL of the following game objects in ONE image, side by side, standing on the SAME flat baseline (the thick black line), each inside its own numbered box and matching the box HEIGHT exactly: 1 the player character (the same character as before, 1.75 m, reference), 2 a shelter resident 1.7 m, 3 a child 1.3 m, 4 the reinforced bunker door 2.1 m, 5 the control console 1.5 m, 6 the free-standing notice board 1.7 m, 7 the small side table with the red radio 0.9 m, 8 the single wooden bed 0.9 m, 9 the potted vegetable plant 0.65 m, 10 the junk pile 0.9 m. Same style as all previous images, side view facing right, same light from the upper left. Objects must not touch each other. Do NOT draw the boxes, grid lines, numbers or text. Transparent background (or plain flat white).
```

Animasyon/kare setlerinde aynı kural: **ilk karenin yanında (aynı görselde) oyuncu referansı** isteyin ya da kare setini, daha önce ölçek dizisiyle üretilmiş sabit görseli referans yükleyerek isteyin ("exactly the same size as the reference image").

## Oyun tarafı (kod)
- Kesimden sonra her parçanın **görünen yüksekliği / referans insan yüksekliği × 1,75 m** = gerçek boy; bu değer `assets.js`'e metre olarak yazılır. Kesmeyi ve hesabı asistan yapar (görseli atmanız yeterli).
- `PX_METRE` (şu an 74) oda görsellerindeki bilinen nesnelerden kalibre edilir; oda görselleri değişirse yalnız bu sayı güncellenir.
