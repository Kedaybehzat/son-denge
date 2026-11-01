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
  yagmurDeposu: {
    oda: 'su', sure: 2, ad: 'Yağmur Suyu Deposu', ikon: '💧',
    maliyet: { eylem: 1, malzeme: -8, enerji: -4 },
    aciklama: 'Pompa ve toplama tankı: her gece +4 su; kuraklık zararını yarıya indirir.',
    geceEtki: { su: 4 }, olayAzalt: { kurak: 0.5 },
    onKosul: (state) => state.arastirma.acik.includes('yagmurSuyu'),
    kilitAciklama: 'Yağmur Suyu Pompası araştırmasını tamamla', bilgi: 'grisu',
  },
  yalitim: {
    oda: 'yasam', sure: 2,
    ad: 'Yalıtım Tesisi',
    ikon: '🧱',
    maliyet: { eylem: 1, malzeme: -6 },
    aciklama: 'Duvar ve çatılara yalıtım: sıcak hava dalgası ve toz fırtınasının zararı yarı yarıya azalır.',
    olayAzalt: { sicak: 0.5, toz: 0.5 },
    bilgi: 'ruzgar',
  },
  bariyer: {
    oda: 'sera', sure: 2,
    ad: 'Sel Bariyeri',
    ikon: '🏗️',
    maliyet: { eylem: 1, malzeme: -5 },
    aciklama: 'Serenin alt katına kalıcı bariyer: sel zararı yarı yarıya azalır.',
    olayAzalt: { sel: 0.5 },
    bilgi: 'tatlisu',
  },
  ekPanel: {
    oda: 'enerji', sure: 2,
    ad: 'Ek Güneş Paneli',
    ikon: '🌞',
    maliyet: { eylem: 2, malzeme: -10, enerji: -6, karbon: +3 },
    aciklama: 'Çatıya ek güneş paneli dizisi: her gece +3 enerji. Kurulumda biraz karbon salımı var.',
    geceEtki: { enerji: +3 },
    bilgi: 'gunes',
  },
  suDeposu: {
    oda: 'su', sure: 2, ad: 'Su Geri Kazanım Hattı', ikon: '💧',
    maliyet: { eylem: 1, malzeme: -8, enerji: -6 },
    aciklama: 'Yeniden kullanılan borular ve filtreler: her gece +3 su, −1 enerji.',
    geceEtki: { su: 3, enerji: -1 }, bilgi: 'grisu',
  },
  onarimTezgahi: {
    oda: 'geri', sure: 2, ad: 'Onarım Tezgâhı', ikon: '🔧',
    maliyet: { eylem: 1, malzeme: -8, enerji: -6 },
    aciklama: 'Ayrıştırılan parçalar yeniden kullanılır: her gece −3 atık.',
    geceEtki: { atik: -3 }, bilgi: 'hiyerarsi',
  },
};
