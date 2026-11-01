// =============================================================
//  ODALAR VE NESNELER
//  Panel calismaIsigi: oda görselinde LED konumu [x,y], 0..1 oran.
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
export const ODA_GENISLIK = 739; // oda görselleri: 9042×836 tek şeridin beşte biri (1808×836, 2,16:1)
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
//    duvar      : bu görselde duvar–zemin çizgisi (yükseklik oranı); yürüme çizgisi
//                 duvar + YURUME_PAYI. Odalar arası fark bu çizgiyle hizalanır.
//    onde       : duvar dibine değil ön zemine konacak nesneler (ör. ayaklı pano)
//    nesneY     : duvara monte nesnenin ALT kenarı (yükseklik oranı); etkileşim/ışık oraya göre
//    (gösterge ve duman koordinatları görsel boyutuna göre ORAN, 0..1)
// -------------------------------------------------------------
export const GORSEL_ZEMIN_ORANI = 0.82;  // yürüme çizgisi: zeminin ortası
export const GORSEL_DUVAR_ORANI = 0.745; // duvar ile zeminin birleştiği çizgi
export const ARKA_OLCEK = 0.9;
export const YURUME_PAYI = 0.07; // duvar çizgisi ile yürüme çizgisi arası (görsel yüksekliğine oran)

export const ODALAR = [
  {
    ad: 'Yaşam Alanı',
    tip: 'yasam',
    duvar: 0xd9c9a8,
    pencereX: 400,
    nesneler: [
      { tip: 'kapi', x: 85, etiket: 'Kapı', arka: true },
      { tip: 'radyo', x: 279, etiket: 'Radyo', arka: true },
      { tip: 'pano', x: 449, etiket: 'Sığınak Yönetimi', arka: true },
      { tip: 'yatak', x: 606, etiket: 'Yatak (günü bitir)', arka: true },
    ],
    // Görselde kitaplık (sol), yatak (orta-sol), sandık (orta-sağ), koltuk (sağ) var
    gorsel: { duvar: 0.755, nesneOran: { kapi: 0.757, radyo: 0.630, yatak: 0.423, pano: 0.915 }, nesneY: { pano: 0.53, radyo: 0.595 } },
  },
  {
    ad: 'Enerji Odası',
    tip: 'enerji',
    duvar: 0xb9c4cc,
    pencereX: 558,
    nesneler: [{ tip: 'panel', panel: 'enerji', calismaIsigi: [0.761, 0.437], x: 315, etiket: 'Enerji Paneli', arka: true }],
    // Görselde jeneratör (sol), tezgâh (orta), inverter dolapları, batarya rafı (sağ)
    gorsel: { duvar: 0.755, nesneOran: { enerji: 0.722 }, nesneY: { enerji: 0.475 }, duman: [0.149, 0.13] },
  },
  {
    ad: 'Su Arıtma',
    tip: 'su',
    duvar: 0xa9c8d6,
    pencereX: 218,
    nesneler: [{ tip: 'panel', panel: 'su', calismaIsigi: [0.710, 0.332], x: 461, etiket: 'Arıtma Paneli', arka: true }],
    // Görselde iki büyük tank (gösterge camlarında su seviyesi), filtreler, havuz
    gorsel: { duvar: 0.762, nesneOran: { su: 0.694 }, nesneY: { su: 0.59 }, suGostergeleri: [[0.376, 0.33, 0.393, 0.575], [0.529, 0.33, 0.549, 0.575]] },
  },
  {
    ad: 'Sera',
    tip: 'sera',
    duvar: 0xc5d9b0,
    pencereX: 388,
    pencereGenis: true,
    nesneler: [{ tip: 'panel', panel: 'sera', calismaIsigi: [0.033, 0.421], x: 679, etiket: 'Sera Paneli', arka: true }],
    gorsel: { duvar: 0.765, nesneOran: { sera: 0.08 }, nesneY: { sera: 0.53 }, bitkiOran: [0.14, 0.075], copOran: null },
  },
  {
    ad: 'Geri Dönüşüm',
    tip: 'geri',
    duvar: 0xcdbfae,
    pencereX: 570,
    nesneler: [{ tip: 'panel', panel: 'geriDonusum', calismaIsigi: [0.309, 0.519], x: 364, etiket: 'Geri Dönüşüm Paneli', arka: true }],
    gorsel: { duvar: 0.765, nesneOran: { geriDonusum: 0.29 }, duman: [0.946, 0.51], copOran: 0.10 },
  },
];
