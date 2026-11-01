// Opsiyonel, aynı malzeme stokunu paylaşan iki topluluk hedefi.
export const SENARYO_HEDEFLERI = [
  { id: 'selHazirlik', ad: 'Yağıştan önce dayanıklılık', sonGun: 3, metin: '3. günün sonuna kadar sel bariyerini tamamla. Hazırlık, felaketin etkisini azaltır.', yapi: 'bariyer' },
  { id: 'komsuDestek', ad: 'Komşunun su hattını onar', sonGun: 3, metin: 'Komşu yerleşime 8 su ve 5 malzeme gönder. Aynı malzeme kendi bariyerinde de kullanılabilir.', maliyet: { su: -8, malzeme: -5 } },
];
