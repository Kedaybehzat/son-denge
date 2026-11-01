// =============================================================
//  YAPILAR (GDD bölüm 7: Üs İnşası — minimal versiyon)
//  Panodan inşa edilen tek seferlik, kalıcı sığınak genişletmeleri.
//  Her yapı bir kez inşa edilir ve oyun sonuna kadar etkisini sürdürür.
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
    ad: 'Yalıtım Tesisi',
    ikon: '🧱',
    maliyet: { eylem: 1, atik: -8 },
    aciklama: 'Duvar ve çatılara yalıtım: sıcak hava dalgası ve toz fırtınasının zararı yarı yarıya azalır.',
    olayAzalt: { sicak: 0.5, toz: 0.5 },
    bilgi: 'ruzgar',
  },
  bariyer: {
    ad: 'Sel Bariyeri',
    ikon: '🏗️',
    maliyet: { eylem: 1, atik: -6 },
    aciklama: 'Serenin alt katına kalıcı bariyer: sel zararı yarı yarıya azalır.',
    olayAzalt: { sel: 0.5 },
    bilgi: 'tatlisu',
  },
  ekPanel: {
    ad: 'Ek Güneş Paneli',
    ikon: '🌞',
    maliyet: { eylem: 2, karbon: +3 },
    aciklama: 'Çatıya ek güneş paneli dizisi: her gece +3 enerji. Kurulumda biraz karbon salımı var.',
    geceEtki: { enerji: +3 },
    bilgi: 'gunes',
  },
};
