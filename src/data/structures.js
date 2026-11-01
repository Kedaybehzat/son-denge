// =============================================================
//  YAPILAR (GDD bölüm 7: Üs İnşası — minimal versiyon)
//  Panodan inşa edilen tek seferlik, kalıcı sığınak genişletmeleri.
//  Bir seferde tek inşaat: maliyet başta ödenir; yapı gece bitince
//  ertesi gün aktif olur. Her yapı en fazla bir kez inşa edilir.
//
//  maliyet   : { eylem, kaynak:değer } hemen uygulanır (eylem düşülür,
//              kaynaklar etki olarak uygulanır; +X atık= kurulum atığı,
//              -X atık = yapı için atık harcanır)
//  geceEtki  : her gece eklenir (araştırma geceEtki'si gibi)
//  olayAzalt : { olayId: carpan } — o olayın kötü etkisi carpan ile
//              çarpılır (0 = tamamen önler, 0.5 = yarıya iner)
//  onKosul   : state'e göre inşa edilebilir mi (opsiyonel)
//  bilgi     : facts.js anahtarı (inşa sonrası gösterilir)
// =============================================================

export const YAPILAR = {
  yalitim: {
    oda: 'yasam', sure: 1,
    ad: 'Yalıtım Tesisi',
    ikon: '🧱',
    maliyet: { eylem: 1, atik: -8 },
    aciklama: 'Duvar ve çatılara yalıtım: sıcak hava dalgası ve toz fırtınasının zararı yarı yarıya azalır.',
    olayAzalt: { sicak: 0.5, toz: 0.5 },
    bilgi: 'ruzgar',
  },
  bariyer: {
    oda: 'sera', sure: 1,
    ad: 'Sel Bariyeri',
    ikon: '🏗️',
    maliyet: { eylem: 1, atik: -6 },
    aciklama: 'Serenin alt katına kalıcı bariyer: sel zararı yarı yarıya azalır.',
    olayAzalt: { sel: 0.5 },
    bilgi: 'tatlisu',
  },
  ekPanel: {
    oda: 'enerji', sure: 1,
    ad: 'Ek Güneş Paneli',
    ikon: '🌞',
    maliyet: { eylem: 2, atik: -12, enerji: -6, karbon: +3 },
    aciklama: 'Çatıya ek güneş paneli dizisi: her gece +3 enerji. Kurulumda biraz karbon salımı var.',
    geceEtki: { enerji: +3 },
    bilgi: 'gunes',
  },
  suDeposu: {
    oda: 'su', sure: 1, ad: 'Su Geri Kazanım Hattı', ikon: '💧',
    maliyet: { eylem: 1, atik: -10, enerji: -6 },
    aciklama: 'Yeniden kullanılan borular ve filtreler: her gece +3 su, −1 enerji.',
    geceEtki: { su: 3, enerji: -1 }, bilgi: 'grisu',
  },
  onarimTezgahi: {
    oda: 'geri', sure: 1, ad: 'Onarım Tezgâhı', ikon: '🔧',
    maliyet: { eylem: 1, atik: -10, enerji: -6 },
    aciklama: 'Ayrıştırılan parçalar yeniden kullanılır: her gece −3 atık.',
    geceEtki: { atik: -3 }, bilgi: 'hiyerarsi',
  },
};
