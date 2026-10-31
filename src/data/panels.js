// =============================================================
//  KONTROL PANELLERİ
//  Her panel bir odadaki etkileşimli nesneye bağlıdır (rooms.js).
//  Her eylem varsayılan olarak 1 eylem hakkı harcar (maliyet ile değişir).
//
//  kirli: true -> hızlı ama kirleten seçenek (arayüzde uyarı gösterilir).
//  bilgi: facts.js'teki "Biliyor muydun?" kartının anahtarı.
//  Asıl oyun tasarımı burada: her "kolay" seçeneğin bir bedeli olsun.
// =============================================================

export const PANELLER = {
  enerji: {
    baslik: 'Enerji Kontrol Paneli',
    kod: 'ENERJİ_01',
    tema: '#f2b33d',
    aciklama: 'Güneş panelleri, rüzgar türbini ve yedek dizel jeneratör. Jeneratör hızlıdır ama havayı kirletir.',
    gosterge: ['enerji', 'karbon'],
    eylemler: [
      { ad: 'Güneş panellerini temizle', etki: { enerji: +20 }, mesaj: 'Paneller pırıl pırıl.', bilgi: 'gunes' },
      { ad: 'Rüzgar türbinini onar', etki: { enerji: +12, atik: +5 }, mesaj: 'Türbin yeniden dönüyor.', bilgi: 'ruzgar' },
      { ad: 'Dizel jeneratörü çalıştır', etki: { enerji: +35, karbon: +18 }, kirli: true, mesaj: 'Jeneratör gürültüyle çalıştı. Hava ağırlaştı.', bilgi: 'fosil' },
    ],
  },
  su: {
    baslik: 'Su Arıtma Sistemi',
    kod: 'HİDRO_02',
    tema: '#4fc3f7',
    aciklama: 'Gri suyu ve yağmur suyunu arıtır. Tam güç modu çok enerji yer.',
    gosterge: ['su', 'enerji'],
    eylemler: [
      { ad: 'Filtreleri değiştir', etki: { su: +18, atik: +5 }, mesaj: 'Temiz su akmaya başladı.', bilgi: 'tatlisu' },
      { ad: 'Arıtmayı tam güçle çalıştır', etki: { su: +30, enerji: -15 }, mesaj: 'Tanklar hızla doluyor.', bilgi: 'suenerji' },
    ],
  },
  sera: {
    baslik: 'Sera',
    kod: 'BİYO_03',
    tema: '#7ed957',
    aciklama: 'Yeşilvadi\'nin besin kaynağı. Bitkiler su ister ama karbonu da azaltır.',
    gosterge: ['gida', 'su', 'karbon'],
    eylemler: [
      { ad: 'Serayı sula', etki: { gida: +20, su: -10 }, mesaj: 'Yapraklar canlandı.', bilgi: 'sulama' },
      { ad: 'Kompost ekle', etki: { gida: +12, atik: -12 }, mesaj: 'Organik atık toprağa döndü.', bilgi: 'metan' },
      { ad: 'Fidan dik', etki: { karbon: -15, su: -6 }, mesaj: 'Küçük bir ağaç, büyük bir umut.', bilgi: 'agac' },
    ],
  },
  geriDonusum: {
    baslik: 'Geri Dönüşüm İstasyonu',
    kod: 'DÖNÜŞ_04',
    tema: '#ff8a3d',
    aciklama: 'Atıkları ayrıştır ya da yak. Yakmak hızlıdır ve biraz enerji verir, ama karbon salar.',
    gosterge: ['atik', 'karbon'],
    eylemler: [
      { ad: 'Atıkları ayrıştır', etki: { atik: -20 }, mesaj: 'Cam, plastik, metal: her şey yerli yerinde.', bilgi: 'plastik' },
      { ad: 'Malzemeleri onarıp yeniden kullan', etki: { atik: -10, enerji: +5 }, mesaj: 'Eski parçalar yeni işe yaradı.', bilgi: 'hiyerarsi' },
      { ad: 'Atıkları yak', etki: { atik: -35, enerji: +8, karbon: +15 }, kirli: true, mesaj: 'Atık gitti, duman kaldı.', bilgi: 'yakma' },
    ],
  },
};
