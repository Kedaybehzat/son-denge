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

import { ZIYARETCILER, KURUCULAR } from './visitors.js';
import { PANELLER } from './panels.js';

// =============================================================
//  ÖLÇÜ STANDARDI (CLAUDE.md bölüm 6.13)
//  1) Her nesne/karakter boyu GERÇEK METRE ile tanımlanır (aşağıdaki tablo).
//  2) Tek ölçek: PX_METRE = ön zeminde (yürüme çizgisi) 1 metrenin oyun pikseli.
//     Oda görsellerindeki bilinen nesnelerden kalibre edilir (tezgâh 0,9 m,
//     yatak 0,9 m, tank 2,4 m → duvar dibinde ~70 px/m, ön zeminde ~75 px/m).
//     Oda görselleri değişirse SADECE bu sayı güncellenir.
//  3) Duvar dibindeki nesneler ayrıca ARKA_OLCEK (rooms.js, %90) ile küçülür.
//  Üretim standardı (ölçek dizisi yöntemi): CLAUDE.md 6.13, docs/olcek-sablonu.png
// =============================================================
export const PX_METRE = 74; // oda şeridi: kapı 2,1 m ≈ 375 px → 180 px/m görsel, oyunda ×0,41
const m = (metre) => Math.round(metre * PX_METRE);

export const ASSETLER = {
  oyuncu:              { dosya: 'oyuncu.png', yukseklik: m(1.75) },
  panel:               { dosya: 'panel.png', yukseklik: m(1.5) },
  'panel-enerji':      { dosya: 'panel-enerji.png', yukseklik: m(1.5), yedek: 'panel' },
  'panel-su':          { dosya: 'panel-su.png', yukseklik: m(1.5), yedek: 'panel' },
  'panel-sera':        { dosya: 'panel-sera.png', yukseklik: m(1.5), yedek: 'panel' },
  'panel-geriDonusum': { dosya: 'panel-geri.png', yukseklik: m(1.5), yedek: 'panel' },
  radyo:               { dosya: 'radyo.png', yukseklik: m(0.9) },
  pano:                { dosya: 'pano.png', yukseklik: m(1.7) },
  yatak:               { dosya: 'yatak.png', yukseklik: m(0.9) },
  kapi:                { dosya: 'kapi.png', yukseklik: m(2.1) },
  bitki:               { dosya: 'bitki.png', yukseklik: m(0.65) },
  'bitki-solgun':      { dosya: 'bitki-solgun.png', yukseklik: m(0.65), yedek: 'bitki' },
  sakin0:              { dosya: 'sakin-1.png', yukseklik: m(1.7) },
  sakin1:              { dosya: 'sakin-2.png', yukseklik: m(1.7) },
  sakin2:              { dosya: 'sakin-3.png', yukseklik: m(1.7) },
  sakin3:              { dosya: 'sakin-4.png', yukseklik: m(1.7) },
  'cop-yigini':        { dosya: 'cop-yigini.png', yukseklik: m(0.9) },   // atığa göre büyür/küçülür

  // Arka planlar (sahneye yayılır; yer tutucusu yok, yoksa kodla çizilen duvar/şehir kalır)
  //  oda-*: 640×280'e gerilir, duvarın üstüne biner. Pencereyi ŞEFFAF bırakırsanız dışarısı görünür.
  //  manzara-*: pencereden/çatı üstünden görünen şehir, yatayda tekrar eder; denge düştükçe iyi → kötü geçer.
  'oda-yasam':         { dosya: 'oda-yasam.png', yukseklik: 280, arka: true },
  'oda-enerji':        { dosya: 'oda-enerji.png', yukseklik: 280, arka: true },
  'oda-su':            { dosya: 'oda-su.png', yukseklik: 280, arka: true },
  'oda-sera':          { dosya: 'oda-sera.png', yukseklik: 280, arka: true },
  'oda-geri':          { dosya: 'oda-geri.png', yukseklik: 280, arka: true },
  // Birleşik oda: etkileşimli nesneler (kapı, radyo, pano, paneller) görselin içine çizili.
  // Varsa oda-<tip>.png yerine kullanılır; nesne sprite'ları görünmez olur, etkileşim aynı yerde kalır.
  'oda-yasam-tam':     { dosya: 'oda-yasam-tam.png', yukseklik: 280, arka: true },
  'oda-enerji-tam':    { dosya: 'oda-enerji-tam.png', yukseklik: 280, arka: true },
  'oda-su-tam':        { dosya: 'oda-su-tam.png', yukseklik: 280, arka: true },
  'oda-sera-tam':      { dosya: 'oda-sera-tam.png', yukseklik: 280, arka: true },
  'oda-geri-tam':      { dosya: 'oda-geri-tam.png', yukseklik: 280, arka: true },
  'manzara-iyi':       { dosya: 'manzara-iyi.png', yukseklik: 470, arka: true },
  'manzara-kotu':      { dosya: 'manzara-kotu.png', yukseklik: 470, arka: true },
  cati:                { dosya: 'cati.png', yukseklik: 120, arka: true },  // yatayda döşenen çatı şeridi (güneş panelleri)
};

// Karaktere özel sakin görseli: sakin-<id>.png (ör. sakin-selin.png, sakin-tamirci.png).
// Varsa o kişi sahnede bununla görünür; yoksa sırayla sakin-1..4 kullanılır.
// Özel görselli sakine genel sakin-N animasyonları uygulanmaz (başkasına dönüşmesin).
export const SAKIN_OZEL_YUKSEKLIK = { cocuklar: m(1.3) };
for (const k of [...KURUCULAR, ...ZIYARETCILER]) {
  ASSETLER['sakin-' + k.id] = { dosya: `sakin-${k.id}.png`, yukseklik: SAKIN_OZEL_YUKSEKLIK[k.id] ?? m(1.7), ozelSakin: true };
}

// HTML arayüzünde kullanılan görseller (Phaser'a yüklenmez; <img>, yoksa emoji/düz ekran)
//  ziyaretci-<id>.png  : kapı kartı + Görev Panosu
//  kurucu-<id>.png     : Görev Panosu
//  hikaye-<1..4>.png   : açılış hikaye ekranları
export const ARAYUZ_ASSET_KLASORU = 'assets/';
export const portreDosyasi = (onek, id) => `${ARAYUZ_ASSET_KLASORU}${onek}-${id}.png`;
export const hikayeDosyasi = (n) => `${ARAYUZ_ASSET_KLASORU}hikaye-${n}.png`;

// Arayüz dosyalarının tek kaydı; UI ve asset kontrol aracı birlikte kullanır.
export const ARAYUZ_IKONLARI = {
  enerji: 'enerji', su: 'su', gida: 'gida', atik: 'atik', karbon: 'karbon',
  nufus: 'nufus', eylem: 'eylem', arastirma: 'arastirma', memnuniyet: 'memnuniyet',
  batarya: 'batarya-depo', bataryaHud: 'batarya', grisu: 'grisu', turbin: 'turbin',
  hidroponik: 'hidroponik', havaFiltresi: 'hava-filtresi', yalitim: 'yalitim',
  bariyer: 'bariyer', ekPanel: 'ek-panel', santral: 'santral', sehir: 'sehir',
  komsu: 'komsu', rezervuar: 'rezervuar', sera: 'gida', geriDonusum: 'atik',
  // Dosya gelene kadar emoji / benzer ikon yedeği görünür
  yagmurSuyu: 'yagmur-suyu', yagmurDeposu: 'yagmur-deposu', suDeposu: 'su-hatti', onarimTezgahi: 'onarim-tezgahi',
  insaat: 'insaat', bosta: 'dinlen', malzeme: 'malzeme',
  // Yönetim panosu sekme ikonları (isteğe bağlı)
  'yonetim-koloni': 'sekme-koloni', 'yonetim-odalar': 'sekme-odalar', 'yonetim-kesif': 'sekme-kesif',
  'yonetim-arastirma': 'sekme-arastirma', 'yonetim-insaat': 'sekme-insaat', 'yonetim-hedefler': 'sekme-hedefler',
};
export const KARAR_GORSELLERI = {
  itiraz: 'itiraz', karanlik: 'karanlik', susuz: 'susuz', protesto: 'protesto',
  kompost: 'kompost', soz: 'soz', tozUyari: 'toz-uyari', selUyari: 'sel-uyari',
  bosMakine: 'bos-makine', keşifBataryalari: 'kesif-batarya', yeniAile: 'yeni-aile',
};
export const SON_GORSELLERI = {
  gercekUtopya: 'gercek-utopya', yalnizUtopya: 'yalniz-utopya',
  kapimizAcikti: 'kapimiz-acikti', guvenKaybi: 'guven-kaybi', cokus: 'cokus',
};
export const ARAYUZ_DOSYALARI = [...new Set([
  'logo.png', 'menu-arka.png', 'kart-cerceve.png', 'buton.png', 'buton-basili.png', 'hud-kutu.png',
  ...Object.values(ARAYUZ_IKONLARI).map((ad) => `ikon-${ad}.png`),
  ...Object.values(KARAR_GORSELLERI).map((ad) => `kart-${ad}.png`),
  ...Object.values(SON_GORSELLERI).map((ad) => `son-${ad}.png`),
  // Oda konsolları (isteğe bağlı; yoksa CSS çizimi): arka plan + kontrol çizimleri
  ...Object.values(PANELLER).filter((p) => p.konsol?.gorsel).map((p) => `konsol-${p.konsol.gorsel}.png`),
  ...Object.values(PANELLER).flatMap((p) => (p.konsol?.moduller || []).filter((m) => m.gorsel).map((m) => `modul-${m.gorsel}.png`)),
  // Yönetim panosu bölüm arka planları ve keşif haritası işaretleri (isteğe bağlı)
  ...['koloni', 'odalar', 'kesif', 'arastirma', 'insaat', 'hedefler'].map((b) => `yonetim-${b}.png`),
  'kesif-siginak.png', 'konsol-cerceve.png',
  'konsol-tank.png',
  // Küçük yüz rozetleri (konsol operatörü, koloni kartları); yoksa 1:1 portre ya da sprite
  ...[...KURUCULAR, ...ZIYARETCILER].map((z) => `rozet-${z.id}.png`),
  // Prolog gün kartı görselleri (isteğe bağlı)
  'prolog-1.png', 'prolog-2.png', 'prolog-3.png',
])];

// Sahnede ve arayüzde aynı kişi için aynı kaynak. Özel tam-boy asset yoksa
// kimliğe sabit genel sprite kullanılır; sıra değişince karakter değişmez.
export const SAKIN_GORSEL_TIPLERI = {
  selin: 1, burak: 2, nur: 1, can: 3,
  muhendis: 1, ciftci: 0, bilim: 1, tamirci: 2, kafile: 3, cocuklar: 3,
};
export function sakinGorselTanimi(id, dosyaVar = () => false) {
  const tip = SAKIN_GORSEL_TIPLERI[id] ?? 0;
  const ozel = `sakin-${id}`;
  return dosyaVar(`${ozel}.png`)
    ? { tip, anahtar: ozel, dosya: `${ozel}.png`, ozel: true }
    : { tip, anahtar: `sakin${tip}`, dosya: `sakin-${tip + 1}.png`, ozel: false };
}
