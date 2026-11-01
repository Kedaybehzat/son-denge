# Asset promptu

**Kullanım:** Yeni bir sohbet açın → `docs/asset-rehberi.pdf`'i yükleyin → aşağıdaki metni yapıştırın. Model her yanıtta **tek görsel** üretir; beğenirseniz `next` yazın, beğenmezseniz ne değişmesi gerektiğini yazın (ör. "make the door taller"). Sohbet karışırsa yeni sohbette PDF + prompt + `start from item N` yazın.

```
You are the art producer for my 2D side-view climate game "Son Denge". The attached PDF is the asset guide: it contains the art style guide (last pages), the original room images we love (use them as the exact visual reference for style, palette, line work and room layouts), and a layout plan for each room.

HOW WE WORK
- Produce ONE image per reply, in the order of the list below. Start with item 1.
- Under each image write: the item number and the file name.
- Then stop and wait. When I write "next", produce the next item. When I give feedback, redo the same item.
- Never put text, letters, numbers, labels, logos, UI or watermarks inside an image.

STYLE (all items)
Match the original room images in the PDF exactly: 2D hand-painted illustration, clean dark umber outlines, flat colour blocks with simple cel shading, light gouache / dry-brush texture, warm muted earthy palette (dusty sage, olive green, mustard ochre, warm cream, leather brown, terracotta, umber), weathered but cozy post-collapse eco-bunker, warm late-afternoon light from the upper left. Natural adult proportions (about 6 heads tall), no chibi, no anime eyes, no neon, no 3D render, no photorealism.

SCALE
Everything is real-world size. The player is 1.75 m. Adults 1.7 m, door 2.1 m, control console 1.5 m, bed 0.9 m high, workbench 0.9 m, potted seedling 0.65 m, junk pile 0.9 m high × 1.8 m wide.

RULES FOR ROOMS (items 1–5)
- Use the widest landscape format you can (about 2.3:1). Recreate the matching original room from the PDF as closely as possible (same furniture, same composition, same colours), straight-on side view of the back wall and floor, no perspective.
- The interactive objects listed for each room must be drawn INSIDE the scene, standing on the floor or mounted on the wall, at the same scale as the furniture (a 1.75 m person would be about 35% of the image height).
- Fill every window pane and glass surface with flat solid pure magenta #FF00FF (edge to edge inside the frame, no reflections, no curtains over the glass).
- Leave a clear, empty strip of floor across the front of the room (bottom 25% of the image) where characters will walk. No people in rooms.

RULES FOR CHARACTERS AND OBJECTS (items 14–28)
- Transparent background (if impossible: plain flat white). No ground shadow, no glow, no frame.
- Side view, characters face RIGHT, feet / base near the bottom edge.
- Keep each character identical every time it appears (same face, hair, clothes, colours).
- SPRITE SHEETS: one image split into a grid of equal cells. In every cell the character has exactly the same size, the same horizontal position and the same baseline; only the moving parts change. Unused cells stay empty.

THE LIST
1. oda-yasam.png — Living area, as the original living room in the PDF: bookshelf with a window above it on the left, the single wooden bed with green blanket in the middle, the cork pinboard with notes on the right wall, armchair and plants on the right. ADD: a small vintage red radio standing on top of the green metal trunk next to the bed; a heavy reinforced bunker door (2.1 m, vertical wooden planks, sage-green riveted metal frame, brass wheel handle) set into the wall between the trunk and the armchair, standing on the floor.
2. oda-enerji.png — Energy workshop, as the original: olive-green diesel generator with a tall exhaust pipe on the left, workbench with tool pegboard and two small solar panel samples on the window sill, the two wall-mounted energy control units (one with a sun icon, one with a bar-graph screen) in the middle-right, tall battery rack on the right, cables and pipes along the upper wall.
3. oda-su.png — Water treatment, as the original: tiled lower walls, storage shelf on the left with a small window above it, two large riveted teal water tanks with a tall vertical gauge window on each (inside of the gauges plain light grey, no water drawn), a filtration unit with three blue filter cartridges and a pressure gauge (this is the control panel), a concrete basin with running water on the right.
4. oda-sera.png — Greenhouse, as the original: a large glass wall with steel mullions (all panes magenta), raised planting beds with tomatoes and leafy vegetables, slatted seedling shelves with grow lights, a potting bench with tools on the right, the wall-mounted electrical control boxes on the left wall (this is the greenhouse panel).
5. oda-geri.png — Recycling workshop, as the original: a window on the left, scrap crates full of metal parts, a long wooden repair workbench with a tool pegboard, a recycling poster, shelves with sorted bottles and bins, a rusty barrel on the right. ADD: in place of the grey filing cabinet next to the workbench, a standing retro control console (1.5 m, sage-green rusty metal, small screen with a recycling symbol, three round buttons red/yellow/green, a scrap intake chute on its side).
6. manzara-iyi.png — Distant panorama behind the bunker, healthy: a recovering green city among old ruins, wind turbines, solar roofs, trees, a river, clear blue sky with clouds. Widest landscape format, horizon at 55% of the height, the left and right edges must match so the image can repeat side by side.
7. manzara-kotu.png — Exactly the same panorama and composition as item 6, but collapsed: thick orange smog, dark polluted sky, dead trees, broken turbines, a dried river.
8. cati.png — The bunker roof seen from the side as a long horizontal strip, transparent above: a flat dark steel-and-concrete roof edge along the bottom 30%, on it four tilted solar panels on small metal stands, a few cables and one round vent. Left and right edges must match.
9. hikaye-1.png — Landscape 3:2 illustration: a sweltering city in an extreme heatwave, shimmering hot air, cracked asphalt, traffic and smoking factory chimneys, a red-orange sky.
10. hikaye-2.png — Landscape 3:2: a thawing Arctic permafrost cliff collapsing into the sea next to an abandoned research station, a faint eerie green glow deep in the exposed ice, cold blue palette.
11. hikaye-3.png — Landscape 3:2: an empty abandoned city street, no people, weeds through the pavement, dusty stopped cars, one small green sapling in the middle of the road.
12. hikaye-4.png — Landscape 3:2: a small eco-bunker built into a hillside at dawn, solar panels on the roof, a glowing greenhouse dome, warm lights in the windows, a hopeful mood.
13. kapak.png — Landscape 3:2 key art: the glowing eco-bunker in the foreground; behind it the background is split in half, a green recovering city on one side and a smoggy collapsed city on the other.
14. oyuncu.png — Portrait 2:3, transparent. The player, the shelter caretaker: young adult woman, messy brown hair in a bun, a long rust-brown scarf, olive green field jacket with rolled sleeves and a leaf patch, olive cargo trousers, leather belt with pouches, fingerless gloves, sturdy brown boots. Standing idle, facing right, 1.75 m, filling about 68% of the image height.
15. oyuncu-bekle — Portrait 2:3, 2×2 grid, 4 frames: the player (item 14) standing, subtle breathing (shoulders and scarf rise slightly in frames 2–3).
16. oyuncu-yuru — Landscape 3:2, 3×2 grid, 6 frames: the player walking to the right, a full walk cycle.
17. oyuncu-calis — Portrait 2:3, 2×2 grid, 4 frames: the player reaching forward and pressing a button on an unseen console in front of her, then pulling the arm back.
18. sakin-1.png — Portrait 2:3, transparent: elderly man with grey hair and moustache, patched olive vest over a cream shirt, brown trousers, a wooden walking cane. 1.7 m, facing right.
19. sakin-2.png — Portrait 2:3, transparent: woman with a long brown braid, mustard scarf, sage field jacket, cargo trousers, hip bag. 1.7 m.
20. sakin-3.png — Portrait 2:3, transparent: middle-aged craftsman with a short beard, leather work apron over a shirt with rolled sleeves, work boots. 1.7 m.
21. sakin-4.png — Portrait 2:3, transparent: young traveller with a mustard cap, rust-brown jacket, large canvas backpack, patched green trousers. 1.7 m.
22. sakin-1-anim — Portrait 2:3, 2 columns × 3 rows: the elderly man (item 18). Top row: 2 frames of breathing idle. Middle and bottom rows: 4 frames of walking to the right with the cane moving with the steps.
23. sakin-2-anim — Same layout for the woman (item 19).
24. sakin-3-anim — Same layout for the craftsman (item 20).
25. sakin-4-anim — Same layout for the traveller (item 21).
26. cop-yigini.png — Landscape 3:2, transparent: a low wide pile of overflowing household waste: tied garbage bags, a flattened cardboard box, metal cans, a broken chair leg, a green plastic crate with bottles. Flat bottom edge, wider than tall.
27. bitki.png — Portrait 2:3, transparent: a leafy green vegetable seedling in a terracotta pot, healthy, occupying the bottom quarter of the image.
28. bitki-solgun.png — Exactly the same pot and plant as item 27, wilted and dry with brown drooping leaves.
29. ziyaretci-muhendis.png — Square 1:1 head-and-shoulders portrait, plain soft beige background, tired but hopeful expression: Deniz, a woman in her thirties, energy engineer, short dark hair tied back, a scratched hard hat on her backpack strap, worn utility jacket with a faded lightning patch.
30. ziyaretci-ciftci.png — Square portrait: Hasan, a middle-aged farmer with grey stubble and a sun hat, next to his ten-year-old daughter Elif holding a small pouch of seeds.
31. ziyaretci-bilim.png — Square portrait: Dr. Leyla, a woman in her sixties, grey hair in a bun, round glasses, rolled technical drawings under her arm, worn lab coat over a sweater.
32. ziyaretci-cocuklar.png — Square portrait: siblings Mert (about 12) with his arm around his sister Ada (about 7), oversized jackets, small backpacks, Ada holds a stuffed rabbit. Gentle, family-friendly.
33. ziyaretci-tamirci.png — Square portrait: Kemal, a broad-shouldered man in his forties, thick beard, friendly smile, rolled sleeves, leather tool bag on his shoulder, a screwdriver behind his ear.
34. ziyaretci-kafile.png — Square portrait: exactly four people from a flooded coastal town (mother, father, teenage son, grandmother) close together, salt-stained clothes, a coiled rope on the father's shoulder, a faint sea horizon behind.
35. kurucu-selin.png — Square portrait: Selin, a woman in her late twenties, energy technician, short black hair, safety goggles pushed up on her forehead, dark-blue work jumpsuit with a light green stripe.
36. kurucu-burak.png — Square portrait: Burak, a man in his thirties, water systems operator, neat beard, rolled sleeves, blue rubber apron, a wrench in his chest pocket.
37. kurucu-nur.png — Square portrait: Nur, a woman in her fifties, greenhouse keeper, grey-streaked hair under a headscarf, soil on her hands, green gardening apron with seed packets.
38. kurucu-can.png — Square portrait: Can, a young man in his early twenties, recycling worker, curly hair, work gloves, canvas vest covered with small repaired patches.

Start now with item 1.
```

**Görseller gelince:** dosya adlarına dokunmadan asistana verin (ya da `public/assets/`'e koyun). Kesme, isimlendirme, magenta silme, oda ölçeği ve etkileşim alanlarını asistan ayarlar.
