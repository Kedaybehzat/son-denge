// Normal mod mevcut üretimi korur. Mod değişikliği ücretsiz, geceye kadar geri alınabilir.
export const CALISMA_MODLARI = {
  tasarruf: { ad: 'Tasarruf', carpani: 0.65, yorgunluk: 0, asinma: 0, aciklama: 'Düşük üretim; ek yorgunluk ve aşınma yok.' },
  normal: { ad: 'Normal', carpani: 1, yorgunluk: 1, asinma: 1, aciklama: 'Standart üretim; +1 yorgunluk, +1 aşınma.' },
  yogun: { ad: 'Yoğun', carpani: 1.6, yorgunluk: 2, asinma: 2, aciklama: 'Yüksek üretim; ek tüketim, +2 yorgunluk ve +2 aşınma.' },
};
export const MOD_EK_ETKILERI = {
  enerji: { tasarruf: { karbon: -1 }, yogun: { karbon: 2 } },
  su: { tasarruf: { enerji: 1 }, yogun: { enerji: -3, atik: 1 } },
  sera: { tasarruf: { enerji: 1, su: 1 }, yogun: { enerji: -2, su: -3 } },
  geriDonusum: { tasarruf: { enerji: 1 }, yogun: { enerji: -3 } },
};
export const BAKIM = { eylem: 1, malzeme: 2, onarim: 5 };

// Havanın o gece çalışan makinenin üretimine etkisi. Radyo olayının genel
// hasarından ayrıdır; arayüzde ayrı açıklanır. Rakamlar oyun modeli, gerçek ölçüm değil.
export const HAVA_URETIMI = {
  ruzgar: { enerji: { enerji: 3 } },
  sicak: { sera: { su: -2 } },
  kurak: { sera: { gida: -2 } },
  toz: { enerji: { enerji: -3 } },
  sel: { sera: { gida: -1 } },
};
