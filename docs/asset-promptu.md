# Güncel asset üretim promptu (1 Kasım 2026, prolog, oda konsolları ve yönetim panosu sonrası)

Bu prompt yalnız eksik ya da yenilenecek görselleri ister. Not: 34–44 arası kutu sahneleri mockup'tan kesilip oyuna bağlandı (geçici, kenarda hafif yazı izi var); yeniden üretmek isteğe bağlı iyileştirmedir. Konsol ve pano görselleri için `docs/tasarim-referans/` mockup'larını da referans olarak yükleyin (öncelik 7 ve 9). Hazır görseller (odalar, manzara, menü/UI seti, mevcut ikonlar, kart/son görselleri, oyuncu ve sakin-2/4 animasyonları) yeniden üretilmez. Tam durum: `docs/asset-listesi.md`.

**Parçalı konsol güncellemesi:** Dört konsol artık altı ayrı UI parçası kullanır (`docs/asset-parcalari.md`). 30–33 tam konsol zeminleri güncel tasarım için gerekli değildir; eski tasarımın isteğe bağlı yedeğidir. Ortak çerçeve/düğme/doku mevcut mockup’tan `tools/asset-parcala.py` ile çıkarılır, yeniden üretilmez.

**Güncel üretim tamamlandı:** Temel 7 ikon, keşif harita/işaret, genel sakin-1/3 kareleri ve 10 karakterin özel sprite/animasyon setleri üretildi. Mevcut yüz portreleri korunur; bunları tekrar üretmeyin. Güncel set kaydı `docs/karakter-setleri.md`, gerçek üretim promptları `docs/karakter-uretim-istekleri.json` içindedir. Aşağıdaki uzun liste tarihsel briftir; eksik durumu için her zaman `node tools/asset-durum.mjs` ve güncel Asset Listesi esas alınır.

## Nasıl kullanılır

1. Yeni bir görsel sohbeti açın (Gemini / Nano Banana önerilir).
2. Şunları yükleyin: `docs/asset-rehberi.pdf`, stil referansı `public/assets/ziyaretci-muhendis.png`, karakter referansları `public/assets/oyuncu.png`, `sakin-1.png`, `sakin-3.png` ve ikon referansı `public/assets/ikon-grisu.png`.
3. Aşağıdaki İngilizce metni yapıştırın. Her yanıtta **tek görsel** gelir; "next" deyince sıradakine geçilir.
4. Gelen dosyayı adına dokunmadan asistana verin, ya da şu adımları kendiniz yapın:
   - Arka planı silin (beyaz/magenta → şeffaf).
   - Boyutu küçültün: portre 512×512; karakter ve kare en fazla 600 px yükseklik; ikon en fazla 256×256.
   - Orijinali `assets-orijinal/` altına yedekleyin.
   - Sprite sheet'i `public/assets/anim/<ad>-<kare>.png` adlı ayrı karelere kesin.
   - Son olarak `node tools/asset-durum.mjs` çalıştırın.

## Prompt

```text
You are the art producer for "Son Denge", a 2D side-view climate management game set in a small eco-bunker called Yeşilvadi (year 2071).
Use the attached asset guide PDF and the reference images. Generate ONE image per reply, then stop and wait. When I say "next", continue with the next item. If I give feedback, redo the same item. Never regenerate items that are not on this list.

STYLE (match the PDF and the reference portrait exactly)
2D hand-painted illustration, clean dark umber outlines, flat colour blocks with simple cel shading, light gouache / dry-brush texture, warm muted earthy palette: dusty sage #A7B18D, olive #7C8A58, mustard ochre #C79A33, warm cream #E7D9BC, leather brown #9A6A43, terracotta #B97A5C, umber line #4E3B2F. Weathered but cared-for post-collapse eco-bunker, warm light from the upper left. Natural adult proportions. No chibi, no anime, no neon, no 3D render, no photorealism, no pixel art.

DELIVERY RULES
- No text, letters, numbers, logos or watermarks anywhere.
- No glow, smoke, haze, halo or ground shadow around characters or objects.
- Characters and objects: plain solid white background (I will remove it), side view facing RIGHT, feet / base on one flat baseline, fully visible.
- Portraits: head and shoulders, square 1:1, quiet warm beige background, facing the viewer at a slight angle.
- Icons: square 1:1, one bold readable silhouette with thick outline, minimal detail, readable at 32 px, plain solid white background.
- Animation sheets: equal cells, the same character with the same height, proportions, clothing and foot baseline in every cell.

PRIORITY 1 — FOUNDER PORTRAITS (shown large on the door card of the 3-day prologue tutorial; match ziyaretci-muhendis.png framing and lighting; clean patched work clothes, not travel-worn; calm, capable, welcoming expression)
1. kurucu-selin.png — Selin, a woman in her late twenties, energy technician, short black hair, safety goggles pushed up on her forehead, dark-blue work jumpsuit with a light green stripe, a small soldering tool in the chest pocket.
2. kurucu-burak.png — Burak, a man in his thirties, water systems operator, neat beard, rolled-up sleeves, blue rubber apron, a wrench in his chest pocket.
3. kurucu-nur.png — Nur, a woman in her fifties, greenhouse keeper, grey-streaked hair under a headscarf, soil on her hands, green gardening apron with seed packets in the pocket.
4. kurucu-can.png — Can, a young man in his early twenties, recycling workshop worker, curly hair, work gloves, a canvas vest covered with small repaired patches.

PRIORITY 2 — MISSING RESIDENT ANIMATIONS (match the attached sakin-1.png and sakin-3.png exactly)
5. sakin-1 sheet — the existing old man with a cane. One image, 2 columns × 3 rows, equal cells. Cells 1–2: idle breathing (tiny chest / shoulder movement). Cells 3–6: a four-frame slow walking loop with the cane. Facing right, white background, no smoke or halo.
6. sakin-3 sheet — the existing repair worker with a leather apron. Same 2 × 3 layout: cells 1–2 idle breathing, cells 3–6 four-frame walking loop.

PRIORITY 3 — VISITOR PORTRAITS REFRESH (same style as ziyaretci-muhendis.png; dusty, travel-worn clothes; tired but hopeful)
7. ziyaretci-ciftci.png — exactly two people: a middle-aged farmer with grey stubble and a sun hat, and his ten-year-old daughter holding a small cloth pouch of seeds with both hands; sunburnt faces, simple linen clothes.
8. ziyaretci-bilim.png — an older woman scientist in her sixties, grey hair in a bun, round glasses, a rolled-up bundle of technical drawings under her arm, worn lab coat over a warm sweater.
9. ziyaretci-cocuklar.png — exactly two children: a boy around twelve with his arm around his sister around seven; oversized jackets, small backpacks, the girl holds a tattered stuffed rabbit; gentle, sad but brave; soft, family-friendly.
10. ziyaretci-tamirci.png — a broad-shouldered man in his forties, thick beard, friendly smile, rolled-up sleeves, big leather tool bag over his shoulder, a screwdriver tucked behind his ear.
11. ziyaretci-kafile.png — exactly four people from a flooded coastal town: mother, father, teenage son and grandmother, close together, salt-stained clothes, a coiled rope and small fishing net over the father's shoulder, a faint sea horizon in the background.

PRIORITY 4 — NEW UI ICONS (match the attached ikon-grisu.png: same outline weight, palette and simplicity)
12. ikon-yagmur-suyu.png — rain drops falling into a small hand pump.
13. ikon-yagmur-deposu.png — a roof gutter pouring into a riveted water tank.
14. ikon-su-hatti.png — a bent water pipe with a circular return arrow.
15. ikon-onarim-tezgahi.png — a small wooden workbench with a wrench lying on it.
16. ikon-insaat.png — a hammer crossed over a stack of bricks.
17. ikon-dinlen.png — a soft pillow with a small crescent moon.
18. ikon-malzeme.png — a small stack of metal plates with a bolt and a gear on top.

PRIORITY 5 — STORY SCREEN
19. hikaye-2.png — wide 3:2 illustration, "the 2040s: water became scarce, roads changed". A cracked dry reservoir with a low water line on one side, a flood-damaged road and a broken bridge on the other, a small line of families walking with carts and bundles toward the horizon looking for a new home. Dusty ochre and muted teal palette, hopeful but serious mood, no text.

PRIORITY 6 — RECOMMENDED FULL-BODY SPRITES (optional; side view facing right, white background, the same person as their portrait, scale against oyuncu.png: adults 1.75 m tall, children about 1.3 m; neutral standing pose)
20. sakin-selin.png  21. sakin-burak.png  22. sakin-nur.png  23. sakin-can.png
24. sakin-muhendis.png — Deniz, energy engineer woman in her thirties, scratched hard hat hanging from her backpack strap, worn utility jacket.
25. sakin-ciftci.png — the farmer and his daughter standing side by side.
26. sakin-bilim.png — Dr. Leyla.
27. sakin-cocuklar.png — the two siblings side by side (children only).
28. sakin-tamirci.png — Kemal.
29. sakin-kafile.png — the family of four standing close together.

PRIORITY 7 — ROOM CONSOLE ART (the in-game control consoles; optional, the game draws CSS fallbacks)
Console backgrounds: 16:9 (about 1600×900), opaque, a calm dark riveted metal faceplate seen straight on, worn paint, subtle room-themed details only at the edges (cables, small gauges, labels without letters). The centre must stay plain and dark so UI elements stay readable. Same palette and light as the PDF.
30. konsol-enerji.png — olive-green metal plate, thin copper cables and a tiny solar cell motif in the corners.
31. konsol-su.png — teal-grey metal plate with small pipe joints and condensation streaks at the edges.
32. konsol-sera.png — sage-green plate with a slim brass frame and a few vine leaves curling in from one corner.
33. konsol-geri.png — rust-brown patched plate made of mismatched welded panels, a few bolts and scratches.
Control scene cards (attach docs/tasarim-referans/konsol-enerji.jpg, konsol-su.jpg, konsol-sera.jpg and konsol-geri.jpg as the target look): each is a wide 5:2 (about 1000×400) opaque painted scene that fills a whole control tile, exactly like the illustrated tiles in the mockups, but with NO text, NO numbers, NO icons, NO buttons and NO UI frame. Keep the lower 40% calmer and slightly darker because the game prints the label and values there; the main subject sits in the upper-left or upper-centre.
34. modul-gunes.png — a solar panel array on a sunny green hillside with yellow flowers, warm sun in the upper left.
35. modul-ruzgar.png — a white wind turbine on a breezy hill under a blue sky with small clouds, a second turbine far away.
36. modul-dizel.png — a red rusty diesel generator coughing dark smoke next to oil barrels, gloomy grey sky (looks dirty).
37. modul-filtre.png — rows of metal water filter cartridges and a crate of clean cartridges inside the water room.
38. modul-pompa.png — a blue industrial water pump with a big valve wheel and pipes, water spray.
39. modul-sulama.png — an irrigation line dripping water over young plants in the greenhouse.
40. modul-kompost.png — a wooden compost bin with dark soil, vegetable peels and a shovel.
41. modul-fidan.png — young saplings in pots on greenhouse tables, soft green light.
42. modul-ayristir.png — a conveyor sorting belt with metal, plastic and glass bins in the recycling workshop.
43. modul-onar.png — a cluttered repair workbench with tools, a vice and a half-fixed device.
44. modul-yak.png — a small iron incinerator furnace with orange fire behind the hatch and smoke from the pipe (looks dirty).
44b. konsol-cerceve.png — 512×512 nine-slice window frame: weathered brass-and-wood border about 96 px thick, small vine leaves curling around the corners, an empty blank wooden plaque at the top centre, the inner area fully transparent (or flat white for me to remove). No text.

PRIORITY 8 — PROLOGUE DAY CARDS (wide 3:2 illustrations, optional)
45. prolog-1.png — "First light": the empty bunker living room at dawn, a single lamp flickering on, an energy technician woman with goggles stepping through the heavy door.
46. prolog-2.png — "Water and soil": water tanks slowly filling and the first green sprouts in the greenhouse beds, two founders working.
47. prolog-3.png — "Closing the loop": four founders together in the recycling workshop at dusk, sorted crates, warm light, a hopeful mood.

PRIORITY 9 — SHELTER MANAGEMENT BOARD (optional; the game draws CSS fallbacks; target look: docs/tasarim-referans/yonetim-*.jpg). Backgrounds are opaque, calm and low-contrast in the centre because cards and text are drawn on top; details only near the edges; no text.
48. yonetim-kesif.png — (attach docs/tasarim-referans/yonetim-kesif.jpg as the target look, but WITHOUT its pins, labels and UI) 3:2 (about 1500×1000) top-down hand-painted map of a dry post-collapse region in parchment tones. Keep the centre (50% / 52%) as a small open hill where the shelter marker sits. Put these landmarks so pins can sit on them: abandoned power plant top-left (17% / 24%), ruined old city top-right (80% / 20%), neighbouring green settlement bottom-right (84% / 72%), dried reservoir bottom-left (19% / 76%). Faint dirt tracks, cracked earth, a few dead trees, subtle contour lines. No labels, no pins, no compass text.
49. yonetim-koloni.png — 16:10 (about 1600×1000) a wall-mounted wooden duty board with faint vertical column dividers and metal brackets, worn, mostly plain.
50. yonetim-odalar.png — 16:10 a plain riveted metal plate with a faint engraved cross-section outline of five rooms in a row.
51. yonetim-arastirma.png — 16:10 a laboratory chalk/slate board with very faint diagram lines and a few glass vials at the bottom edge.
52. yonetim-insaat.png — 16:10 a blueprint paper texture: deep blue with a fine light grid and faint technical sketches only at the corners.
53. yonetim-hedefler.png — 16:10 a cork board texture inside a wooden frame, a couple of empty pin holes, nothing pinned.
54. kesif-siginak.png — 1:1 small map marker: a tiny eco-shelter dug into a hill with a solar panel and a greenhouse dome, white background.
Tab icons (match ikon-grisu.png style, 1:1, white background):
55. ikon-sekme-koloni.png — two people silhouettes in front of a checklist.
56. ikon-sekme-odalar.png — a small house cross-section with rooms.
57. ikon-sekme-kesif.png — a compass over a folded map.
58. ikon-sekme-arastirma.png — a test tube with a small gear.
59. ikon-sekme-insaat.png — a small crane hook with a hammer.
60. ikon-sekme-hedefler.png — a pinned note with a check mark.
```

## Dosyalar oyuna nasıl girer

| Dosya | Klasör | Not |
|---|---|---|
| `kurucu-*.png`, `ziyaretci-*.png` | `public/assets/` | 512×512 |
| `sakin-1` / `sakin-3` sheet | `public/assets/anim/` | Kesilir: `sakin-1-bekle-1..2.png`, `sakin-1-yuru-1..4.png` (sakin-3 aynı) |
| `ikon-*.png` | `public/assets/` | Şeffaf, en çok 256×256; kod bağlı |
| `hikaye-2.png` | `public/assets/` | 1280 px genişlik |
| `sakin-<id>.png` | `public/assets/` | Şeffaf, en çok 600 px yükseklik; varsa genel sakin yerine kullanılır |
| `konsol-<oda>.png` | `public/assets/` | 1600×900, opak; konsolun arka planına oturur |
| `modul-<ad>.png` | `public/assets/` | Opak, ~1000×400 yazısız sahne; kontrol kutusunun tamamını kaplar |
| `konsol-cerceve.png` | `public/assets/` | 512×512 9-dilim, köşe 96 px; konsol ve yönetim penceresinin çerçevesi |
| `prolog-1..3.png` | `public/assets/` | 1280 px genişlik; prolog gün kartının üstünde |
| `yonetim-<bölüm>.png` | `public/assets/` | 1600 px genişlik, opak; ilgili pano bölümünün arka planı (keşifte harita) |
| `kesif-siginak.png`, `ikon-sekme-*.png` | `public/assets/` | Şeffaf, en çok 256×256 |
