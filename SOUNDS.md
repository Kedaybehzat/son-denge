# SES KULLANIMI

> Oyundaki tüm ses/müzik tanımları ve kuralları. Kod: `src/sesler.js` (yönetici), çağrı: `muzikCal()`, `sesCal()`, `muzikDurdur()`, `sesToggle()`. Ayarlar menüsünde "Ses" düğmesi var; durumu `localStorage` → `sondenge:ses` (`acik` / `kapali`).

## Kurallar

1. **Dosya yolu**: Tüm ses dosyaları `public/sounds/` içindedir. Vite taban yoluna göre sunulur: `${import.meta.env.BASE_URL}sounds/<ad>.mp3`; alt dizinli GitHub Pages yayını da desteklenir.
2. **İsimlendirme**: `kebab-case`, Türkçe karakter yok, uzantı `.mp3`. Önekler:
   - `muzik-*` → döngülü arka plan müziği
   - `son-*` → son ekranı müziği
   - `ses-*` → tek seferlik ses efekti (bip, tıklama, kapı vb.)
3. **Döngülü müzik**: Aynı anda tek müzik çalar. `muzikCal(ad)` eski parçayı anında durdurup yenisini fade-in ile başlatır; parçalar üst üste çalmaz. Aynı parça seçiliyse yeniden başlatılmaz. `loop: false` ile tek sefer de olabilir.
4. **Tek sefer**: `sesCal(ad)` çağrılır, önceki çalanı durdurmaz.
5. **Autoplay engeli**: Tarayıcı ilk kullanıcı etkileşiminden önce ses çalmaz. `muzikCal()` çağrısı başarısız olursa ilk `pointerdown`/`keydown` olayında otomatik denenir.
6. **Ses açık/kapalı**: `sesToggle()` → `localStorage` kalıcı. Kapatma mevcut müzik ve tüm tek seferlik efektleri anında susturur, fade zamanlayıcılarını iptal eder. Kapalıyken `sesCal` çalışmaz; `muzikCal` sadece son seçimi hatırlar. Açılınca yalnız son seçili müzik fade-in ile döner; eski efektler dönmez. Gecikmiş play yanıtları eski parçayı canlandıramaz.
7. **Yeni ses eklerken**: Dosyayı `public/sounds/<ad>.mp3` olarak koy → bu dosyada "Mevcut sesler" tablosuna satır ekle → kullanım yerini `src/`'de ilgili yerde çağır. Promptu üretmek için "Yeni ses için prompt" bölümündeki şablonu kullan.

## Mevcut sesler

| Dosya | Tür | Nerede çalınır | Not |
|---|---|---|---|
| `muzik-ana.mp3` | Döngü | Ana menü (giriş ekranı) | Oyun açıldığında başlar; "Başla" basılınca umut müziğine geçer |
| `muzik-umut.mp3` | Döngü | Oyun içi normal ambiyans | Memnuniyet ≥ 35 ve denge ≥ 30 iken çalar |
| `muzik-gerilim.mp3` | Döngü | Oyun içi gerilim | Memnuniyet < 35 veya denge < 30 iken çalar (tek parça, fade-in) |
| `muzik-gece-gecis.mp3` | Döngü (kısa) | Gece raporu açıkken | Gün sonu modal'ı açıldığında başlar; "Sabah oldu" basılınca umut/gerilim müziğine döner |
| `son-gercek-utopya.mp3` | Döngü | `gercekUtopya` sonu | "Tekrar oyna" basılana kadar çalar |
| `son-yalniz-utopya.mp3` | Döngü | `yalnizUtopya` sonu | — |
| `son-kapimiz-acikti.mp3` | Döngü | `kapimizAcikti` sonu | — |
| `son-isiklar-sondu.mp3` | Döngü | `cokus` sonu | — |
| `son-guven-oylamasi.mp3` | Döngü | `guvenKaybi` sonu (hafif siyaset) | — |

## Entegrasyon noktaları (kodda)

| Yer | Çağrı | Zaman |
|---|---|---|
| `src/main.js` | `muzikCal('muzik-ana')` | Oyun açılır açılmaz |
| `src/ui/ui.js` → `baslangicEkrani` "Başla" | `muzikCal('muzik-umut')` | Oyuncu başlat tuşuna basınca |
| `src/ui/ui.js` → `gunBaslangici` (gece raporu) | `muzikCal('muzik-gece-gecis')` | Gün biter, gece raporu açılır |
| `src/ui/ui.js` → `sabahGoster` kapandığında | Durum tekrar değerlendirilir (gerilim/umut) | Oyuncu "Güne başla" basınca |
| `src/scenes/GameScene.js` → `gorselUygula` | Memnuniyet/denge değişince `muzikCal('muzik-umut' | 'muzik-gerilim')` | Her state değişiminde (idempotent) |
| `src/ui/ui.js` → `sonGoster` | `muzikCal('son-' + tip)` | Son ekranı açılırken |
| `src/ui/ui.js` → `ayarlarAc` "Ses" düğmesi | `sesToggle()` | Kullanıcı toggle'a basınca |

## Yeni ses için prompt şablonu

AI ses üreticilerine (Suno, Udio, ElevenLabs Music) vermek için örnek prompt:

```
Solarpunk / hopepunk game soundtrack, [MOOD], [TEMPO] bpm, [LENGTH],
soft synth pads with warm analog texture, gentle acoustic guitar and
piano, light percussion, no vocals, loopable (seamless beginning↔end),
subtle climate/weather ambient layer underneath, suitable for a cozy
indie resource management game set in a post-collapse eco-shelter.
Mastering: broadcast loudness around -16 LUFS, no sudden peaks.
```

MOOD varyasyonları (önek'e göre):
- `muzik-ana` → "hopeful anthemic opening, slightly nostalgic"
- `muzik-umut` → "calm optimistic background, steady and warm"
- `muzik-gerilim` → "tense low drones with slow pulse, growing unease"
- `muzik-gece-gecis` → "quiet reflective interlude, breathing pads"
- `son-gercek-utopya` → "triumphant yet gentle, acoustic celebration"
- `son-yalniz-utopya` → "bittersweet solo piano, hopeful but lonely"
- `son-kapimiz-acikti` → "melancholic but dignified, strings fading"
- `son-isiklar-sondu` → "somber slow synth, elegy for lost potential"
- `son-guven-oylamasi` → "muted institutional ambience, resigned"

## Önerilen eksik sesler (sonraki tur için)

Hackathon demosunda hikayeyi güçlendirmek için çok etkili olacak, kritik değil:

| Dosya önerisi | Nerede çalınır | Prompt özü |
|---|---|---|
| `ses-tiklama.mp3` | Buton/menü tıklamalarında (ayarlar, pano, panel) | "Soft UI click, 50ms, warm wooden tap, no reverb, neutral pitch" |
| `ses-panel-onay.mp3` | Panel eylemi başarıyla yapılınca (ör. güneş paneli temizle) | "Short positive confirmation beep, 200ms, two-note rise, synth bell" |
| `ses-kapi-cal.mp3` | Kapıda ziyaretçi geldiğinde (sabah radyosundan sonra) | "Three gentle wooden door knocks, 1.2s total, warm and inviting, slight room reverb" |
| `ses-radyo-aç.mp3` | Radyo nesnesine E'ye basınca | "Vintage radio tuning crackle and static for 0.8s then settles, lo-fi" |
| `ses-arastirma-bitti.mp3` | Bir araştırma projesi tamamlanınca (gece raporu) | "Scientific discovery chime, 1.5s, glass bells and warm synth lift, hopeful major chord" |
| `ses-insa-bitti.mp3` | Bir yapı inşa edilince (yalıtım, bariyer, ek panel) | "Construction completion thud with metallic ring, 0.9s, solid and satisfying" |
| `ses-gun-basi.mp3` | Yeni gün başlığı belirince (sabah radyosu öncesi) | "Dawn chime, 2 ascending bell notes, 1.2s, bright and gentle" |
| `ses-uyari.mp3` | Memnuniyet 35 altına düşüp itiraz kartı çıkınca, ya da enerji 25 altına düşünce | "Low warning tone, 0.6s, muted alarm, not aggressive" |
| `ses-kart-ac.mp3` | Karar kartı sabah açılırken | "Paper unfolding + soft page turn, 0.8s, intimate" |
| `ses-adim.mp3` | Oyuncu her 400ms yürürken (loop değil, tek sefer) | "Single soft footstep on dusty concrete, 150ms, subtle, no echo" |

Bu sesler eklenirse `src/sesler.js`'de ek bir çağrı değişmeden `sesCal('ses-tiklama')` gibi hemen kullanılabilir. İlgili çağrı yerlerini SOUNDS.md'ye "Entegrasyon noktaları" tablosuna eklemeyi unutma.

## Regresyon kontrolü

`npm test` mekanik testlerine ek olarak `tools/ses-test.mjs` dosyasını çalıştırır: gecikmiş play, hızlı aç/kapat, parça değişimi, fade iptali, efekt susturma ve autoplay tekrar denemesi. Vite HMR dispose aşaması eski müzikleri susturup olay dinleyicilerini kaldırır.
