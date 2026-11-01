# Asset promptu (güncel: eksikler, yenilenecekler, menüler)

**Kullanım:** Yeni bir sohbet → `docs/asset-rehberi.pdf`'i yükle → aşağıdaki metni yapıştır. Her yanıtta tek görsel gelir; beğenirsen `next`, beğenmezsen ne değişmesi gerektiğini yaz. Sohbet bozulursa yeni sohbette PDF + prompt + `start from item N`.

```
You are the art producer for my 2D side-view climate game "Son Denge". The attached PDF is the asset guide: the art style guide (last pages), the current in-game look, and the existing characters and objects. Everything you make must look like it belongs with the existing assets shown in the PDF.

HOW WE WORK
- Produce ONE image per reply, in the order of the list. Start with item 1.
- Under each image write only: the item number and the file name.
- Then stop. When I write "next", make the next item. If I give feedback, redo the same item.
- No text, letters, numbers or logos inside any image (only exception: item 26, the game logo).

STYLE
Match the PDF exactly: 2D hand-painted illustration, clean dark umber outlines, flat colour blocks with simple cel shading, light gouache / dry-brush texture, warm muted earthy palette (dusty sage #A7B18D, olive #7C8A58, mustard ochre #C79A33, warm cream #E7D9BC, leather brown #9A6A43, terracotta #B97A5C, umber line #4E3B2F), weathered post-collapse eco-bunker, warm light from the upper left. Natural adult proportions, no chibi, no anime, no neon, no 3D, no photorealism.

CHARACTERS AND OBJECTS
Transparent background (if impossible: plain flat white). No glow, no smoke, no shadow or haze around the figure, no ground shadow, no frame. Side view, characters face RIGHT, feet at the bottom.
SPRITE SHEETS: one image split into a grid of equal cells; in every cell the character has exactly the same size, the same horizontal position and the same baseline; only the moving parts change. Clean transparent background in every cell (no dark smudges).

PORTRAITS
Square 1:1, head and shoulders, facing the viewer at a slight angle, tired but hopeful expression, plain warm cream background, same painting style as the existing portrait of Deniz in the PDF.

MENU / UI ASSETS
Same palette and weathered metal-and-wood language. Frames and buttons are "9-slice": decorated only at the corners and edges, the CENTER must be a plain flat even area (it will be stretched and covered with text by the game). Icons: one simple object, thick outline, readable at 24 px, transparent background.

THE LIST
1. sakin-1-anim — Portrait 2:3, 2 columns × 3 rows. The elderly man with grey hair, moustache, patched olive vest, cream shirt, brown trousers and wooden cane (the existing "sakin-1" in the PDF). Top row: 2 frames of subtle breathing idle. Middle and bottom rows: 4 frames walking to the right, the cane moving with the steps. Clean transparent background.
2. sakin-3-anim — Same layout for the bearded craftsman with the leather work apron (the existing "sakin-3").
3. ziyaretci-ciftci.png — Portrait: Hasan, a middle-aged farmer with grey stubble and a sun hat, next to his ten-year-old daughter Elif holding a small pouch of seeds.
4. ziyaretci-bilim.png — Portrait: Dr. Leyla, a woman in her sixties, grey hair in a bun, round glasses, rolled technical drawings under her arm, worn lab coat over a sweater.
5. ziyaretci-cocuklar.png — Portrait: siblings Mert (about 12) with his arm around his sister Ada (about 7), oversized jackets, small backpacks, Ada holds a stuffed rabbit. Gentle, family-friendly.
6. ziyaretci-tamirci.png — Portrait: Kemal, a broad-shouldered man in his forties, thick beard, friendly smile, rolled sleeves, leather tool bag on his shoulder, a screwdriver behind his ear.
7. ziyaretci-kafile.png — Portrait: exactly four people from a flooded coastal town (mother, father, teenage son, grandmother) close together, salt-stained clothes, a coiled rope on the father's shoulder, a faint sea horizon behind.
8. kurucu-selin.png — Portrait: Selin, late twenties, energy technician, short black hair, safety goggles pushed up on her forehead, dark-blue work jumpsuit with a light green stripe.
9. kurucu-burak.png — Portrait: Burak, thirties, water systems operator, neat beard, rolled sleeves, blue rubber apron, a wrench in his chest pocket.
10. kurucu-nur.png — Portrait: Nur, fifties, greenhouse keeper, grey-streaked hair under a headscarf, soil on her hands, green gardening apron with seed packets.
11. kurucu-can.png — Portrait: Can, early twenties, recycling worker, curly hair, work gloves, canvas vest covered with small repaired patches.
12. kart-cerceve.png — Square 1:1 window frame for all menus: weathered sage-green riveted metal border with worn wooden inner trim and four ornate bolted corners; corners and border take only the outer 18% of each side; the CENTER is a plain flat dark olive panel (#1f2a1c) with no details.
13. buton.png — Wide 3:1 button plate: small riveted metal plate in olive and brass, corners and edges decorated within the outer 25%, flat even center.
14. buton-basili.png — The exact same button, pressed: slightly darker, pushed in, a faint warm glow on the edges.
15. hud-kutu.png — Wide 2:1 small instrument box for the top bar: dark metal with brass corner bolts, flat even dark center.
16. ikon-enerji.png — Icon: a lightning bolt on a small round brass badge.
17. ikon-su.png — Icon: a water drop.
18. ikon-gida.png — Icon: a wheat ear with a leaf.
19. ikon-atik.png — Icon: a tied rubbish sack.
20. ikon-karbon.png — Icon: a dark smoke cloud.
21. ikon-nufus.png — Icon: two simple people silhouettes side by side.
22. ikon-eylem.png — Icon: a raised hand / work glove.
23. ikon-arastirma.png — Icon: a glass test tube with green liquid.
24. ikon-batarya.png — Icon: a sturdy battery with a charge bar.
25. ikon-memnuniyet.png — Icon: a simple friendly face on a round badge.
26. logo.png — Wide 3:1 game logo on transparent background: the words "Son Denge" in a bold stencil / hand-painted style in warm cream with a dark umber outline, with a small emblem of a sprout inside a gear.
27. menu-arka.png — Landscape 16:9 title-screen background: the small eco-bunker built into a hillside at dusk, solar panels and a glowing greenhouse, ruins and wind turbines in the distance; the center area calm and slightly darker (a menu window will sit there).
28. son-gercek-utopya.png — Landscape 3:2 ending image: the bunker and the valley flourishing, many people working together in green fields, clear sky.
29. son-yalniz-utopya.png — Landscape 3:2: the bunker green and safe behind a closed gate, outside the gate tired travellers waiting in the dusk.
30. son-kapimiz-acikti.png — Landscape 3:2: the bunker crowded and welcoming but struggling, dim lights, shared small meals, hopeful faces.
31. son-guven-kaybi.png — Landscape 3:2: residents gathered in a tense meeting inside the bunker, an empty chair at the head of the table.
32. son-cokus.png — Landscape 3:2: the bunker dark and silent under orange smog, dead greenhouse, the door closed.
33. kart-itiraz.png — Landscape 3:2 small illustration: residents gathered and arguing in the living room.
34. kart-karanlik.png — 3:2: the shelter rooms in darkness, people with lanterns.
35. kart-susuz.png — 3:2: nearly empty water tanks, a few jerrycans.
36. kart-protesto.png — 3:2: overflowing recycling bins, residents pointing at the pile.
37. kart-kompost.png — 3:2: a compost bin full of food scraps next to the greenhouse.
38. kart-soz.png — 3:2: a hand-drawn clean-energy plan pinned on the wall, solar panel sketches.
39. kart-toz-uyari.png — 3:2: a brown dust storm approaching the bunker's solar panels.
40. kart-sel-uyari.png — 3:2: heavy rain clouds over the bunker, water starting to rise at the lower door.
41. kart-bos-makine.png — 3:2: a broken machine with an open panel next to a research desk.
42. kart-kesif-batarya.png — 3:2: an expedition backpack with old salvaged battery cells.
43. kart-yeni-aile.png — 3:2: a family with bags waiting at the bunker door at dusk.
44. ikon-batarya-depo.png — Icon: a battery rack (research: Battery Storage).
45. ikon-grisu.png — Icon: a water drop with a recycling arrow (research: Grey Water).
46. ikon-turbin.png — Icon: a small wind turbine.
47. ikon-hidroponik.png — Icon: a seedling with roots in water.
48. ikon-hava-filtresi.png — Icon: an air filter with fan blades.
49. ikon-yalitim.png — Icon: a brick wall with an insulation layer.
50. ikon-bariyer.png — Icon: a flood barrier with a wave.
51. ikon-ek-panel.png — Icon: a single tilted solar panel.
52. ikon-santral.png — Icon: an abandoned power plant chimney.
53. ikon-sehir.png — Icon: ruined city buildings.
54. ikon-komsu.png — Icon: a small neighbouring settlement with a flag.
55. ikon-rezervuar.png — Icon: a dried-up reservoir dam.

Start now with item 1.
```

**Not:** 44–55 ve 33–43 isteğe bağlı (zaman kalırsa). Karaktere özel sahne görselleri (`sakin-<id>`) bu listede yok; istenirse sonradan eklenir. Görselleri adlarına dokunmadan asistana verin.
