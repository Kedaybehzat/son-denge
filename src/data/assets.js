// =============================================================
//  GÖRSEL ASSETLER (CLAUDE.md bölüm 6.3)
//  public/assets/<dosya> varsa o yüklenir, yoksa GameScene.dokulariUret()
//  içindeki kodla çizilmiş yer tutucu kullanılır. Dosya eklemek için
//  kod değişikliği gerekmez: doğru adla public/assets/ içine koymak yeter.
//
//  anahtar    : Phaser doku anahtarı (kodda kullanılan ad)
//  dosya      : public/assets/ altındaki dosya adı
//  yukseklik  : oyundaki hedef yükseklik (px). Görsel oranı korunarak
//               bu yüksekliğe ölçeklenir; origin alt-orta, zemine basar.
//  yedek      : bu dosya yoksa kullanılacak başka anahtar (yer tutucusu yok)
// =============================================================

export const ASSETLER = {
  oyuncu:              { dosya: 'oyuncu.png', yukseklik: 72 },
  panel:               { dosya: 'panel.png', yukseklik: 100 },
  'panel-enerji':      { dosya: 'panel-enerji.png', yukseklik: 100, yedek: 'panel' },
  'panel-su':          { dosya: 'panel-su.png', yukseklik: 100, yedek: 'panel' },
  'panel-sera':        { dosya: 'panel-sera.png', yukseklik: 100, yedek: 'panel' },
  'panel-geriDonusum': { dosya: 'panel-geri.png', yukseklik: 100, yedek: 'panel' },
  radyo:               { dosya: 'radyo.png', yukseklik: 80 },
  pano:                { dosya: 'pano.png', yukseklik: 110 },
  yatak:               { dosya: 'yatak.png', yukseklik: 60 },
  kapi:                { dosya: 'kapi.png', yukseklik: 120 },
  bitki:               { dosya: 'bitki.png', yukseklik: 56 },
  'bitki-solgun':      { dosya: 'bitki-solgun.png', yukseklik: 56, yedek: 'bitki' },
  sakin0:              { dosya: 'sakin-1.png', yukseklik: 64 },
  sakin1:              { dosya: 'sakin-2.png', yukseklik: 64 },
  sakin2:              { dosya: 'sakin-3.png', yukseklik: 64 },
  sakin3:              { dosya: 'sakin-4.png', yukseklik: 64 },

  // Arka planlar (sahneye yayılır; yer tutucusu yok, yoksa kodla çizilen duvar/şehir kalır)
  //  oda-*: 640×280'e gerilir, duvarın üstüne biner. Pencereyi ŞEFFAF bırakırsanız dışarısı görünür.
  //  manzara-*: pencereden/çatı üstünden görünen şehir, yatayda tekrar eder; denge düştükçe iyi → kötü geçer.
  'oda-yasam':         { dosya: 'oda-yasam.png', yukseklik: 280, arka: true },
  'oda-enerji':        { dosya: 'oda-enerji.png', yukseklik: 280, arka: true },
  'oda-su':            { dosya: 'oda-su.png', yukseklik: 280, arka: true },
  'oda-sera':          { dosya: 'oda-sera.png', yukseklik: 280, arka: true },
  'oda-geri':          { dosya: 'oda-geri.png', yukseklik: 280, arka: true },
  'manzara-iyi':       { dosya: 'manzara-iyi.png', yukseklik: 470, arka: true },
  'manzara-kotu':      { dosya: 'manzara-kotu.png', yukseklik: 470, arka: true },
};

// HTML arayüzünde kullanılan görseller (Phaser'a yüklenmez; <img>, yoksa emoji/düz ekran)
//  ziyaretci-<id>.png  : kapı kartı + Görev Panosu
//  kurucu-<id>.png     : Görev Panosu
//  hikaye-<1..4>.png   : açılış hikaye ekranları
export const ARAYUZ_ASSET_KLASORU = 'assets/';
export const portreDosyasi = (onek, id) => `${ARAYUZ_ASSET_KLASORU}${onek}-${id}.png`;
export const hikayeDosyasi = (n) => `${ARAYUZ_ASSET_KLASORU}hikaye-${n}.png`;
