# Final asset promptu (tek mesaj)

Asset'lerin üretildiği sohbete olduğu gibi yapıştırın. Oyunun 1 Kasım itibarıyla son durumuna göre **eksik ya da düzeltilmesi gereken** görselleri öncelik sırasıyla ürettirir. Dosyaları adı ne olursa olsun `public/assets/`'e koyun ya da asistana verin; isimlendirme ve kare kesme işini o yapar.

```
I need a final batch of images for my 2D side-view game, made in this same conversation. Keep the exact art style you already used for all previous images (flat vector illustration with soft cel shading, clean dark outlines, warm solarpunk palette: sage green, cream, terracotta, teal, rusty steel; weathered but cozy). Generate the images ONE AT A TIME, in the order below, numbered as listed, and after each image immediately continue with the next one until all are done. Do not ask me questions in between.

GLOBAL RULES FOR ALL OBJECT AND CHARACTER IMAGES (sections C–G):
- Transparent background (or plain flat white if transparency is not possible). No glow, no halo, no vignette, no drop shadow, no ground shadow, no frame, no text.
- Side view, characters face RIGHT, feet / base at the bottom of the drawing.
- SPRITE SHEETS: one portrait 2:3 canvas split into a 2 x 2 grid of four equal cells, frames in reading order (top-left, top-right, bottom-left, bottom-right). The subject has exactly the same size, the same horizontal position and the same baseline (feet on the same line) in every cell; only the animated part changes. Unused cells stay completely empty.

=====================================================
A — 5 ROOM BACKGROUNDS (images 1–5)  [most important]
=====================================================
These 5 rooms sit side by side in one row in the game (left to right: living area, energy workshop, water treatment, greenhouse, recycling workshop). Every room obeys ALL of these rules:
1. FORMAT: wide 21:9 aspect ratio, any resolution. Positions below are percentages of image width (x) and height (y) from the top-left.
2. VIEW: perfectly straight-on orthographic cross-section of ONE room: back wall + floor only. No perspective, no vanishing point, no side walls, no camera tilt, nothing in the foreground overlapping the bottom edge.
3. FLOOR LINE: the back wall meets the floor on a perfectly straight horizontal line at exactly y = 74.5%. Below it a flat, even floor continues to the bottom edge. The top 4% is a dark steel-and-wood ceiling beam running edge to edge.
4. SEAMLESS EDGES: the leftmost 4% and rightmost 4% of every room are an identical plain riveted steel support column on calm wall, with identical wall color, floor and lighting on both sides, so any room can sit directly next to any other with no visible seam. Nothing may touch or cross these strips.
5. SAME WORLD IN ALL 5 ROOMS: the same floor (worn warm-beige concrete slabs with a thin dark drain grate line at y = 84%), the same lower wall (weathered cream plaster with a darker skirting about 5% of the height), the same ceiling beam, the same warm late-afternoon light from the upper left.
6. REAL-WORLD SCALE (the previous versions were out of proportion): 1 meter = 18% of the image height at the front of the floor and 16.5% at the base of the wall. A 1.75 m adult = 32% of the image height. Door 2.1 m, table 0.75 m, chair seat 0.45 m, bed 0.9 m with headboard, ceiling about 3.4 m. Nothing oversized, nothing toy-sized.
7. RESERVED AREAS: "EMPTY WALL" = plain wall from the floor line up to at least 2.3 m with no furniture, shelves, posters, plants, pipes or cast shadows. "EMPTY FLOOR" = plain floor with nothing on it. The game places its own objects there.
8. WINDOWS: every window pane and glass surface is filled with flat solid pure magenta #FF00FF, edge to edge inside its frame, no reflections, no curtains over the glass.
9. No people, no animals, no text, no logos.

IMAGE 1 — Living area (redo of "Kitaplıklı sıcak sığınak odası"): EMPTY WALL at x 10–18% (door), x 25–29% (radio side table), x 72–80% (notice board). ONE single wooden bed with a blue-green blanket, headboard on the left, centered at x 46%, 2 m long, 0.9 m high. EMPTY FLOOR at x 41–59%. Decorate only: x 5–9% narrow plant shelf; x 30–38% low bookshelf (under 1.2 m) with one window above it between 1.3 m and 2.3 m height; x 56–71% wall shelf, coat hooks and a closed trunk; x 82–95% armchair and a large potted plant. Rug only under the bed.

IMAGE 2 — Energy workshop (redo of "Onarılmış bataryalı enerji atölyesi"): olive-green diesel generator at x 5–28% (2.4 m wide, 1.9 m high) with a vertical exhaust pipe whose top opening is at x 17%, y 42%. EMPTY WALL at x 56–64%. EMPTY FLOOR at x 48–72%. Decorate: workbench with tools at x 31–47%; tall battery rack at x 74–95%; cable trays on the upper wall; one high window between 1.8 m and 2.6 m height at x 32–46%.

IMAGE 3 — Water treatment (redo of "Sığınak su arıtma odası"): tiled lower walls. Two large riveted teal water tanks on short legs centered at x 35% and x 53% (each 1.7 m wide, 2.4 m high). On the front of each tank ONE tall vertical sight-gauge window with a metal frame: tank 1 at x 34.5–35.9%, tank 2 at x 52.1–53.5%, both from y 34.5% to y 60.5%; inside of both gauges flat plain light grey (no water). EMPTY WALL at x 61–68%. EMPTY FLOOR at x 53–76%. Decorate: shelf with jars at x 5–24%; concrete basin with running water at x 79–95%; pipes and valves on the upper wall; one high window at x 6–20%.

IMAGE 4 — Greenhouse (redo of "Bunker içinde umut serası"): back wall is a greenhouse glass wall with steel mullions from 1.0 m height up to the ceiling beam, ALL panes flat solid magenta #FF00FF. Below 1.0 m against the wall: raised planting beds at x 5–36%, slatted seedling shelves with grow lights at x 38–70%. EMPTY FLOOR across the front from x 8% to 63%. EMPTY WALL at x 83–89%. EMPTY FLOOR at x 74–82%.

IMAGE 5 — Recycling workshop (redo of "Yeniden Kullanım Atölyesi"): sorted scrap crates against the wall at x 5–22% with EMPTY FLOOR in front of them at x 5–23%. EMPTY WALL at x 44–51%. EMPTY FLOOR at x 35–59%. Decorate: repair workbench with tool pegboard at x 24–42%; recycling poster at x 53–57% above 1.6 m; tall shelves with sorted bins and bottles at x 60–95%; one high window at x 6–20%.

=====================================================
B — 2 CITY PANORAMAS (images 6–7)
=====================================================
Shown far behind the shelter, repeated horizontally. Wide 21:9, any resolution, side view of a distant landscape, horizon at y = 55%. HORIZONTALLY TILEABLE: left and right edges match perfectly (same horizon height, hills and sky color), no big landmark touching either edge. Bottom 30% calm distant ground. No people, no text.
IMAGE 6 — redo of "Yeniden Yeşeren Şehir Panoraması": recovering green eco-city, wind turbines, solar roofs, trees, clear blue sky.
IMAGE 7 — redo of "Kirlenmiş şehir, kuruyan nehir": EXACTLY the same composition as image 6 but collapsed: orange smog, dark polluted sky, dead trees, broken turbines, dried river. Only the condition changes.

=====================================================
C — ROOF STRIP (image 8)
=====================================================
IMAGE 8 — a long horizontal roof strip of the bunker seen from the side, 6:1 aspect ratio, transparent background above it. A flat dark steel-and-concrete roof edge along the bottom 30% of the image; on top of it a row of four tilted solar panels on small metal stands with a few cables and a small vent, evenly spaced. HORIZONTALLY TILEABLE: left and right edges match perfectly. Nothing else.

=====================================================
D — JUNK PILE (image 9)
=====================================================
IMAGE 9 — a low, wide pile of sorted-but-overflowing household waste for the recycling room: tied garbage bags, a flattened cardboard box, a few metal cans, a broken chair leg, a plastic crate. About 1.8 m wide and 0.9 m high, wider than tall, flat bottom edge, side view. Transparent background.

=====================================================
E — WORKING CONSOLE ANIMATIONS (images 10–13)
=====================================================
For EACH of the four room consoles you made earlier, a 3-frame "machine is running" loop of the SAME console (same design, colors, size and position; only the screen graphics and button lights change): frame 1 dim screen, frame 2 brighter bars and the middle button lit, frame 3 brightest bars and the left button lit. 2 x 2 sprite sheet, bottom-right cell empty.
IMAGE 10 — "Güneş enerjisi kontrol konsolu" (energy console)
IMAGE 11 — "Su arıtma kontrol konsolu" (water console)
IMAGE 12 — "Sera kontrol konsolu" (greenhouse console)
IMAGE 13 — "Geri dönüşüm kontrol konsolu" (recycling console)

=====================================================
F — RESIDENT ANIMATIONS (images 14–21)
=====================================================
For each of the four shelter residents you made earlier, keep the character identical to the earlier image (same face, clothes, colors, proportions), side view facing right:
- WALK sheet: 4-frame walking cycle (contact, passing, contact with the other leg, passing), all four cells used.
- IDLE sheet: 2-frame subtle breathing idle (frame 2 shoulders slightly raised), top two cells used, bottom row empty.
IMAGE 14 — walk, "Asalı yaşlı işçi" (old man with a cane; the cane moves with the step)
IMAGE 15 — idle, "Asalı yaşlı işçi"
IMAGE 16 — walk, "Örgülü Kadın, Saha Ceketiyle"
IMAGE 17 — idle, "Örgülü Kadın, Saha Ceketiyle"
IMAGE 18 — walk, "Deri önlüklü usta zanaatkâr"
IMAGE 19 — idle, "Deri önlüklü usta zanaatkâr"
IMAGE 20 — walk, "Hardal şapkalı genç gezgin"
IMAGE 21 — idle, "Hardal şapkalı genç gezgin"

=====================================================
G — OPTIONAL: NAMED CHARACTERS IN THE SHELTER (images 22–31)
=====================================================
Only if there is time. Full-body standing pose, side view facing right, same person, clothes and colors as their earlier portrait, one character per image, 2:3 portrait canvas, transparent background:
IMAGE 22 Selin (from "Kurucu Selin'in enerji portresi") · 23 Burak (from "Su arıtma uzmanı Burak portresi") · 24 Nur (from "Son Denge'nin Bilge Bahçıvanı Nur") · 25 Can (from "Geri dönüşüm ustası Can") · 26 Deniz (from "Deniz, yama ceketli mühendis") · 27 Hasan and his daughter Elif standing together (from their portrait) · 28 Dr. Leyla (from "Saha ekoloğu Dr. Leyla") · 29 the siblings Mert and Ada standing together, children, smaller (from their portrait) · 30 Kemal (from "Kemal, kıyamet sonrası tamir ustası") · 31 the coastal family of four standing together (from "Kıyı köyünden dört kişilik aile").
```

**Sonra:** Görselleri olduğu gibi asistana verin (ya da `public/assets/`'e koyun). Ölçekleme/kırpma yapmayın; odalarda magenta camları silip şeffaf yapmak yeterli (asistan da yapabilir). Sprite sheet'ler kod tarafında karelere kesilir.
