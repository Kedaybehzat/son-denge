// =============================================================
//  ODALAR VE NESNELER
//  Odalar soldan sağa dizilir. x değerleri oda içindedir (0..ODA_GENISLIK).
//  Yeni nesne eklemek için ilgili odanın "nesneler" listesine ekleyin.
//
//  Nesne tipleri:
//    panel -> PANELLER[panel] açılır
//    radyo -> günün olayını tekrar gösterir
//    yatak -> günü bitirir
//    kapi  -> (yer tutucu) iklim göçmenleri mekaniği buraya gelecek
// =============================================================

export const ODA_GENISLIK = 640;
export const TAVAN_Y = 190;  // odaların üst sınırı
export const ZEMIN_Y = 470;  // karakterin bastığı zemin

export const ODALAR = [
  {
    ad: 'Yaşam Alanı',
    tip: 'yasam',
    duvar: 0xd9c9a8,
    pencereX: 330,
    nesneler: [
      { tip: 'kapi', x: 70, etiket: 'Kapı' },
      { tip: 'radyo', x: 230, etiket: 'Radyo' },
      { tip: 'yatak', x: 500, etiket: 'Yatak (günü bitir)' },
    ],
  },
  {
    ad: 'Enerji Odası',
    tip: 'enerji',
    duvar: 0xb9c4cc,
    pencereX: 460,
    nesneler: [{ tip: 'panel', panel: 'enerji', x: 260, etiket: 'Enerji Paneli' }],
  },
  {
    ad: 'Su Arıtma',
    tip: 'su',
    duvar: 0xa9c8d6,
    pencereX: 180,
    nesneler: [{ tip: 'panel', panel: 'su', x: 380, etiket: 'Arıtma Paneli' }],
  },
  {
    ad: 'Sera',
    tip: 'sera',
    duvar: 0xc5d9b0,
    pencereX: 320,
    pencereGenis: true,
    nesneler: [{ tip: 'panel', panel: 'sera', x: 560, etiket: 'Sera Paneli' }],
  },
  {
    ad: 'Geri Dönüşüm',
    tip: 'geri',
    duvar: 0xcdbfae,
    pencereX: 470,
    nesneler: [{ tip: 'panel', panel: 'geriDonusum', x: 300, etiket: 'Geri Dönüşüm Paneli' }],
  },
];
