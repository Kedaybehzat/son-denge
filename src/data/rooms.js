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

// Oda genişliği oda görsellerinin oranına göre (1891×831 görsel, TAVAN_Y..ZEMIN_Y
// yüksekliğinde ve yürüme çizgisi %82'de iken 776 px): görsel kırpılmadan sığar.
export const ODA_GENISLIK = 776;
export const TAVAN_Y = 190;  // odaların üst sınırı
export const ZEMIN_Y = 470;  // karakterin bastığı zemin

// -------------------------------------------------------------
//  ODA GÖRSELİ YERLEŞİMİ (public/assets/oda-<tip>.png varken)
//  Görsel oranı korunarak büyütülür: yürüme çizgisi (ZEMIN_Y) görselin
//  GORSEL_ZEMIN_ORANI yüksekliğine denk gelir, görselin üstü TAVAN_Y'de
//  başlar; taşan yanlar kırpılır. Duvara yaslanan nesneler (arka: true)
//  duvar–zemin çizgisine basar ve ARKA_OLCEK ile küçülür (perspektif).
//  Odaya özel ayarlar: ODALAR[].gorsel
//    nesneOran  : görsel varken nesnelerin x'i, görsel genişliğine ORAN (0..1)
//    gorseldeVar: görselde zaten çizili nesneler (sprite gizlenir, etkileşim kalır)
//    suGostergeleri: [[x1,y1,x2,y2], ...] su seviyesinin çizildiği gösterge camları
//    duman      : [x, y] kirli eylem dumanının çıktığı nokta
//    (gösterge ve duman koordinatları görsel boyutuna göre ORAN, 0..1)
// -------------------------------------------------------------
export const GORSEL_ZEMIN_ORANI = 0.82;  // yürüme çizgisi: zeminin ortası
export const GORSEL_DUVAR_ORANI = 0.745; // duvar ile zeminin birleştiği çizgi
export const ARKA_OLCEK = 0.9;

export const ODALAR = [
  {
    ad: 'Yaşam Alanı',
    tip: 'yasam',
    duvar: 0xd9c9a8,
    pencereX: 400,
    nesneler: [
      { tip: 'kapi', x: 85, etiket: 'Kapı', arka: true },
      { tip: 'radyo', x: 279, etiket: 'Radyo', arka: true },
      { tip: 'pano', x: 449, etiket: 'Görev ve Araştırma Panosu', arka: true },
      { tip: 'yatak', x: 606, etiket: 'Yatak (günü bitir)', arka: true },
    ],
    // Görselde kitaplık (sol), yatak (orta-sol), sandık (orta-sağ), koltuk (sağ) var
    gorsel: { nesneOran: { kapi: 0.142, radyo: 0.268, yatak: 0.464, pano: 0.764 }, gorseldeVar: ['yatak'] },
  },
  {
    ad: 'Enerji Odası',
    tip: 'enerji',
    duvar: 0xb9c4cc,
    pencereX: 558,
    nesneler: [{ tip: 'panel', panel: 'enerji', x: 315, etiket: 'Enerji Paneli', arka: true }],
    // Görselde jeneratör (sol), tezgâh (orta), inverter dolapları, batarya rafı (sağ)
    gorsel: { nesneOran: { enerji: 0.597 }, duman: [0.175, 0.42] },
  },
  {
    ad: 'Su Arıtma',
    tip: 'su',
    duvar: 0xa9c8d6,
    pencereX: 218,
    nesneler: [{ tip: 'panel', panel: 'su', x: 461, etiket: 'Arıtma Paneli', arka: true }],
    // Görselde iki büyük tank (gösterge camlarında su seviyesi), filtreler, havuz
    gorsel: { nesneOran: { su: 0.642 }, suGostergeleri: [[0.3448, 0.345, 0.3585, 0.605], [0.5209, 0.345, 0.5352, 0.605]] },
  },
  {
    ad: 'Sera',
    tip: 'sera',
    duvar: 0xc5d9b0,
    pencereX: 388,
    pencereGenis: true,
    nesneler: [{ tip: 'panel', panel: 'sera', x: 679, etiket: 'Sera Paneli', arka: true }],
    gorsel: { nesneOran: { sera: 0.861 }, bitkiOran: [0.1, 0.085], copOran: null },
  },
  {
    ad: 'Geri Dönüşüm',
    tip: 'geri',
    duvar: 0xcdbfae,
    pencereX: 570,
    nesneler: [{ tip: 'panel', panel: 'geriDonusum', x: 364, etiket: 'Geri Dönüşüm Paneli', arka: true }],
    gorsel: { nesneOran: { geriDonusum: 0.474 }, copOran: 0.14 },
  },
];
