# Sıfırdan asset üretim promptu

Hiç asset yokmuş gibi, oyunun güncel hâlinin ihtiyaç duyduğu **her görsel ve animasyon** tek listede. Yeni bir görsel üretim sohbetine olduğu gibi yapıştırın. Listenin kaynağı ve takibi: `PROJECT_LOG.md` → Asset Listesi (aynı sıra, aynı dosya adları).

İpucu: Sohbet uzun bir listeyi tek seferde bitiremezse "continue from item N" diyerek devam ettirin. Her görselin altına dosya adını yazdırmak, sonra isimlendirmeyi kolaylaştırır.

```
You are the art producer for my 2D side-view climate game "Son Denge" (a cozy eco-bunker called Yeşilvadi after a climate collapse). Produce the images in the numbered list below, ONE IMAGE PER ITEM, in order. Under each image write its file name exactly as given. After each image continue with the next one without asking me anything.

==================================================
GLOBAL STYLE (applies to every image)
==================================================
Flat vector illustration with soft cel shading, clean dark outlines, warm solarpunk palette (sage green, cream, terracotta, teal, rusty steel), weathered but cozy, warm late-afternoon light from the upper left. Same style, palette, line weight and level of detail in every image. No text, letters, logos, UI or watermarks inside the images.

==================================================
SCALE STANDARD (very important)
==================================================
Everything is drawn at true real-world size relative to the player character, who is exactly 1.75 m tall. Real heights: adult 1.7–1.75 m, child 1.3 m, door 2.1 m, control console 1.5 m, standing notice board 1.7 m, side table with radio 0.9 m, single bed 0.9 m with headboard, potted vegetable plant 0.65 m, junk pile 0.9 m high and 1.8 m wide, table 0.75 m, chair seat 0.45 m, ceiling about 3.4 m.

OBJECTS AND CHARACTERS (items 14–57): transparent background (or plain flat white if transparency is impossible), no glow, no halo, no vignette, no ground shadow, no frame. Side view, characters face RIGHT, feet / base touching the bottom edge of the drawing. Any canvas size is fine.

ANIMATIONS (items marked "ANIMATION"): one image containing all frames in a grid of equal cells, frames in reading order (left to right, top to bottom). The subject keeps exactly the same size, the same horizontal position and the same baseline in every cell; only the moving parts change. Unused cells stay completely empty.

ROOMS (items 1–10): wide 21:9 image (any resolution). Perfectly straight-on orthographic cross-section of ONE room: back wall + floor only, no perspective, no vanishing point, no side walls, no camera tilt. Positions are percentages of the image width (x) and height (y) from the top-left corner.
- The back wall meets the floor on a perfectly straight horizontal line at exactly y = 74.5% in EVERY room. Below it a flat floor of worn warm-beige concrete slabs continues to the bottom edge, with a thin dark drain grate line at y = 84%.
- The top 4% is a dark steel-and-wood ceiling beam, identical in every room. Lower wall: weathered cream plaster with a darker skirting about 5% of the height.
- The leftmost 4% and rightmost 4% of every room are an identical plain riveted steel support column on calm wall, so all rooms can sit side by side with no visible seam. Nothing may cross these strips.
- Scale in rooms: 1 m = 18% of the image height at the front of the floor and 16.5% at the base of the wall (a 1.75 m adult = 32% of the height, a 2.1 m door at the wall = 34%).
- Every window pane and glass surface is filled edge to edge with flat solid pure magenta #FF00FF (no reflections, no curtains over the glass) so it can be cut out to show the dynamic outside world.
- "EMPTY WALL" = plain wall from the floor line up to at least 2.3 m with nothing on it (no furniture, shelves, posters, plants, pipes, cast shadows). "EMPTY FLOOR" = plain floor with nothing on it. The game places its own objects and characters there.
- Every room comes in TWO versions: the EMPTY version (only decor, reserved areas left empty) and the FULL version: the exact same image, same composition and lighting, with the interactive objects drawn inside at the listed positions and sizes. Draw the FULL version immediately after its EMPTY version so they match pixel for pixel except the added objects. Never draw characters, potted plants on the front floor, the junk pile, or water inside the tank gauges (the game draws those).

==================================================
THE LIST
==================================================
1. oda-yasam.png — Living area, EMPTY version. EMPTY WALL at x 13–21% (door) and x 71–78% (radio side table). Draw ONE single wooden bed with a blue-green blanket, headboard on the left, at x 35–59% (2.0 m long, 0.9 m high). EMPTY FLOOR at x 3–11% (a standing notice board goes there) and in front of the bed at x 41–59%. Decor only in: x 23–34% low bookshelf (under 1.2 m) with a window above it (1.3–2.3 m height); x 60–71% wall shelf, coat hooks, a closed trunk; x 80–96% armchair and a large potted plant. Rug only under the bed.
2. oda-yasam-tam.png — Living area, FULL version: item 1 plus a heavy reinforced wooden bunker door with riveted metal frame at x 13–21% (1.1 × 2.1 m, standing on the floor line), a small side table with a vintage red radio at x 71–78% (0.8 × 0.9 m), and a free-standing cork notice board on two wooden legs with pinned notes on the front floor at x 3–11% (1.1 × 1.7 m).
3. oda-enerji.png — Energy workshop, EMPTY version. Olive-green diesel generator at x 5–31% (2.4 m wide, 1.9 m high) with a tall vertical exhaust pipe whose top opening is at x 15%, y 20%. EMPTY WALL at x 57–65%. EMPTY FLOOR at x 50–72%. Decor: workbench with a tool pegboard at x 31–50% with a window above it; tall metal battery rack with battery boxes at x 72–96%; cable trays along the upper wall.
4. oda-enerji-tam.png — Energy workshop, FULL version: item 3 plus the energy control console (item 31) standing at x 57–65% (0.9 × 1.5 m).
5. oda-su.png — Water treatment, EMPTY version. Tiled lower walls. Two large riveted teal water tanks on short legs at x 27–40% and x 44–57% (each 1.7 m wide, 2.4 m high). On the front of each tank ONE tall vertical sight-gauge window with a metal frame: x 37.2–38.0% and x 53.1–54.2%, from y 38% to y 64%; the inside of both gauges is flat plain light grey (no water). EMPTY WALL at x 61–70%. EMPTY FLOOR at x 57–74%. Decor: shelf with jars and boxes at x 5–24% with a window above; concrete basin with running water from a pipe at x 74–95%; pipes and red valves connecting the tanks on the upper wall.
6. oda-su-tam.png — Water treatment, FULL version: item 5 plus the water purification console (item 33) at x 61–70%.
7. oda-sera.png — Greenhouse, EMPTY version. From 1.0 m height up to the ceiling beam the back wall is a large greenhouse glass wall with steel mullions; ALL panes flat magenta #FF00FF. Below 1.0 m against the wall: raised planting beds with tomatoes and leafy vegetables at x 5–37% and slatted seedling shelves with grow lights at x 38–70%. The whole front floor from x 6% to 63% is EMPTY FLOOR (the game places a row of potted plants there). EMPTY WALL at x 81–89%. EMPTY FLOOR at x 74–82%. Hanging vines on the mullions must not cover reserved areas.
8. oda-sera-tam.png — Greenhouse, FULL version: item 7 plus the greenhouse console (item 35) at x 81–89%.
9. oda-geri.png — Recycling workshop, EMPTY version. Sorted scrap crates (metal, plastic, glass) against the wall at x 4–23%, with EMPTY FLOOR in front of them at x 6–20% (the game draws a growing junk pile there). EMPTY WALL at x 47–57%. EMPTY FLOOR at x 45–59%. Decor: long wooden repair workbench with tool pegboard at x 24–45%; a recycling-symbol poster at x 53–58% above 1.6 m height; tall shelves with sorted bins, bottles and paper bundles at x 59–95%; a window at x 6–20%.
10. oda-geri-tam.png — Recycling workshop, FULL version: item 9 plus the recycling console (item 37) at x 47–57%.
11. manzara-iyi.png — Distant city panorama, healthy: a recovering green eco-city among ruins, wind turbines, solar roofs, trees, a river, clear blue sky. 21:9, side view, horizon at y 55%, bottom 30% calm distant ground. HORIZONTALLY TILEABLE: left and right edges match perfectly, no big landmark touching either edge.
12. manzara-kotu.png — EXACTLY the same composition as item 11 (same hills, buildings, horizon) but collapsed: orange smog, dark polluted sky, dead trees, broken turbines, dried river. Only the condition changes.
13. cati.png — Long horizontal roof strip of the bunker seen from the side, 6:1, transparent above. A flat dark steel-and-concrete roof edge along the bottom 30%; on it a row of four tilted solar panels on small metal stands, a few cables and one small round vent, evenly spaced. HORIZONTALLY TILEABLE.
14. oyuncu.png — The player character, the shelter caretaker: young person with messy brown hair, a long mustard-yellow scarf, an olive work jumpsuit with rolled sleeves and cuffs, a leather belt with a pouch, sturdy brown boots. Standing idle, 1.75 m. This character is the scale reference for everything.
15. oyuncu-bekle — ANIMATION, 2×2 grid, 4 frames: the player standing, subtle breathing (shoulders rise slightly in frames 2–3, scarf moves gently).
16. oyuncu-yuru — ANIMATION, 2×3 grid, 6 frames: the player walking cycle (contact, down, passing, contact other leg, down, passing).
17. oyuncu-calis — ANIMATION, 2×2 grid, 4 frames: the player reaching forward and pressing buttons on an unseen console in front of them (arm extends, presses, returns).
18. sakin-1.png — Shelter resident 1: elderly man with grey hair and a moustache, patched green vest over a cream shirt, brown trousers, a wooden walking cane. 1.7 m.
19. sakin-2.png — Shelter resident 2: woman with a long brown braid, a mustard scarf, a green field jacket and cargo trousers, fingerless gloves, a hip bag. 1.7 m.
20. sakin-3.png — Shelter resident 3: middle-aged craftsman with a short beard, a leather work apron over a shirt with rolled sleeves, work boots. 1.7 m.
21. sakin-4.png — Shelter resident 4: young traveller with short dark hair, a mustard cap, a rust-brown jacket, a big canvas backpack, patched green trousers. 1.7 m.
22. sakin-1-bekle — ANIMATION, 2×1 grid, 2 frames: resident 1 standing, subtle breathing.
23. sakin-1-yuru — ANIMATION, 2×2 grid, 4 frames: resident 1 walking with the cane (the cane moves with the steps).
24. sakin-2-bekle — ANIMATION, 2×1, 2 frames: resident 2 breathing idle.
25. sakin-2-yuru — ANIMATION, 2×2, 4 frames: resident 2 walking.
26. sakin-3-bekle — ANIMATION, 2×1, 2 frames: resident 3 breathing idle.
27. sakin-3-yuru — ANIMATION, 2×2, 4 frames: resident 3 walking.
28. sakin-4-bekle — ANIMATION, 2×1, 2 frames: resident 4 breathing idle.
29. sakin-4-yuru — ANIMATION, 2×2, 4 frames: resident 4 walking.
30. panel.png — Generic control console: standing retro-futuristic console, sage-green rusty metal casing, a carry handle on top, a dark green screen with simple bar graphs (dim), three round buttons (red, yellow, green), cables on the side, a wide base. 1.5 m.
31. panel-enerji.png — The same console design for the ENERGY room: a lightning-bolt plate on the side, the dim screen shows a solar panel and a battery icon. 1.5 m.
32. panel-enerji-calis — ANIMATION, 2×2 grid, 3 frames (bottom-right empty): the console of item 31 running: frame 1 dim screen (identical to item 31), frame 2 brighter icons and the yellow button lit, frame 3 brightest icons and the red button lit.
33. panel-su.png — The same console for the WATER room: water pipes on the side, the dim screen shows a water drop inside a ring gauge. 1.5 m.
34. panel-su-calis — ANIMATION, 2×2, 3 frames: the console of item 33 running (dim → brighter ring + yellow button → brightest ring + red button).
35. panel-sera.png — The same console for the GREENHOUSE: a small leafy plant growing on top, the dim screen shows a leaf and bars. 1.5 m.
36. panel-sera-calis — ANIMATION, 2×2, 3 frames: the console of item 35 running.
37. panel-geri.png — The same console for the RECYCLING room: a scrap intake chute on the side, the dim screen shows a recycling symbol and bars. 1.5 m.
38. panel-geri-calis — ANIMATION, 2×2, 3 frames: the console of item 37 running.
39. panel-calis — ANIMATION, 2×2, 3 frames: the generic console of item 30 running (dim → brighter bars + yellow button → brightest bars + red button).
40. kapi.png — Heavy reinforced bunker door seen from the front: vertical wooden planks, sage-green riveted metal frame with an angled top, brass wheel handle, hinges on the left. Closed. 2.1 m.
41. kapi-ac — ANIMATION, 2×2 grid, 4 frames: the door of item 40 opening: frame 1 closed (identical to item 40), frame 2 slightly open, frame 3 half open showing the dark inside, frame 4 fully open.
42. radyo.png — Small wooden side table with a vintage red radio with a round speaker and a short antenna on it. 0.9 m.
43. pano.png — Free-standing cork notice board on two wooden legs, pinned paper notes, a small green task list, red push pins. 1.7 m.
44. yatak.png — Single wooden bed with a blue-green blanket and a pillow, headboard on the left, side view. 0.9 m high, 2 m long. (Backup only.)
45. bitki.png — A leafy green vegetable seedling in a terracotta pot, healthy and bright. 0.65 m.
46. bitki-solgun.png — The exact same pot and plant as item 45 but wilted and dry, brown drooping leaves. 0.65 m.
47. cop-yigini.png — A low wide pile of overflowing household waste: tied garbage bags, a flattened cardboard box, metal cans, a broken chair leg, a green plastic crate with bottles. 1.8 m wide, 0.9 m high, flat bottom edge.
48. sakin-selin.png — Full body, side view facing right: Selin, a woman in her late twenties, energy technician, short black hair, safety goggles pushed up on her forehead, dark-blue work jumpsuit with a light green stripe. 1.7 m. (Optional, same person as item 64.)
49. sakin-burak.png — Full body: Burak, a man in his thirties, water systems operator, neat beard, rolled-up sleeves, blue rubber apron, wrench in his chest pocket. 1.7 m. (Optional, same as item 65.)
50. sakin-nur.png — Full body: Nur, a woman in her fifties, greenhouse keeper, grey-streaked hair under a headscarf, green gardening apron with seed packets. 1.7 m. (Optional, same as item 66.)
51. sakin-can.png — Full body: Can, a young man in his early twenties, recycling worker, curly hair, work gloves, canvas vest with repaired patches. 1.7 m. (Optional, same as item 67.)
52. sakin-muhendis.png — Full body: Deniz, a woman in her thirties, energy engineer, short dark hair tied back, scratched hard hat on her backpack strap, worn utility jacket with a faded lightning patch. 1.7 m. (Optional, same as item 58.)
53. sakin-ciftci.png — Full body: Hasan, a middle-aged farmer with grey stubble and a sun hat, standing next to his ten-year-old daughter Elif holding a pouch of seeds. Tallest 1.7 m. (Optional, same as item 59.)
54. sakin-bilim.png — Full body: Dr. Leyla, a woman in her sixties, grey hair in a bun, round glasses, rolled technical drawings under her arm, worn lab coat over a sweater. 1.7 m. (Optional, same as item 60.)
55. sakin-cocuklar.png — Full body: siblings Mert (about 12) and Ada (about 7) standing together, oversized jackets, small backpacks, Ada holds a stuffed rabbit. Tallest 1.3 m. (Optional, same as item 61.)
56. sakin-tamirci.png — Full body: Kemal, a broad-shouldered man in his forties, thick beard, rolled-up sleeves, leather tool bag over his shoulder, screwdriver behind his ear. 1.7 m. (Optional, same as item 62.)
57. sakin-kafile.png — Full body: a coastal family of four standing close together (mother, father, teenage son, grandmother), salt-stained clothes, a coiled rope over the father's shoulder. Tallest 1.75 m. (Optional, same as item 63.)
58. ziyaretci-muhendis.png — Square 1:1 head-and-shoulders portrait of Deniz (as item 52), facing the viewer at a slight angle, tired but hopeful expression, plain soft beige background.
59. ziyaretci-ciftci.png — Square portrait of Hasan and his daughter Elif together (as item 53).
60. ziyaretci-bilim.png — Square portrait of Dr. Leyla (as item 54).
61. ziyaretci-cocuklar.png — Square portrait of Mert and Ada together, the boy's arm around his sister (as item 55), gentle, family-friendly.
62. ziyaretci-tamirci.png — Square portrait of Kemal (as item 56), friendly smile.
63. ziyaretci-kafile.png — Square portrait of the coastal family of four (as item 57), a faint sea horizon in the background, exactly four people.
64. kurucu-selin.png — Square portrait of Selin (as item 48), clean patched work clothes.
65. kurucu-burak.png — Square portrait of Burak (as item 49).
66. kurucu-nur.png — Square portrait of Nur (as item 50).
67. kurucu-can.png — Square portrait of Can (as item 51).
68. hikaye-1.png — 16:9 cinematic illustration: a sweltering city during an extreme heatwave, shimmering hot air, cracked asphalt, traffic and factory chimneys, a red-orange sky.
69. hikaye-2.png — 16:9: a thawing Arctic permafrost cliff collapsing into the sea, an abandoned research station, a faint eerie green glow deep inside the exposed ice, cold blue palette.
70. hikaye-3.png — 16:9: an empty abandoned city street, no people, weeds through the pavement, dusty stopped cars, one small green sapling growing in the middle, quiet melancholic grey palette.
71. hikaye-4.png — 16:9: a small eco-shelter built into a hillside at dawn, solar panels on the roof, a glowing greenhouse dome, warm lights in the windows, dry cracked land around, a hopeful mood.
72. kapak.png — 16:9 key art for the game: a small glowing eco-bunker in the foreground, behind it the background split in half: a green utopian city on one side and a smoggy collapsed city on the other.
```

## Teslim sonrası
- Dosyaları olduğu gibi `public/assets/`'e koyun ya da asistana verin; isimlendirme, ızgara kesme, ayak hizalama, küçültme, magenta silme ve konum/oran ayarı asistanda.
- Oda görsellerinde konumlar listeye tam uymazsa sorun değil: asistan `src/data/rooms.js` → `ODALAR[].gorsel` oranlarını görsele göre günceller.
- Birleşik oda (`-tam`) sürümleri gelirse oyun onları kullanır; gelmezse boş oda + ayrı parçalar kullanılır.
