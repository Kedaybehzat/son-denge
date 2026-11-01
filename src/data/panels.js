// =============================================================
//  KONTROL PANELLERİ
//  Her panel bir odadaki etkileşimli nesneye bağlıdır (rooms.js).
//  Her eylem varsayılan olarak 1 eylem hakkı harcar (maliyet ile değişir).
//
//  kirli: true -> hızlı ama kirleten seçenek (arayüzde uyarı gösterilir).
//  bilgi: facts.js'teki "Biliyor muydun?" kartının anahtarı.
//  makine.uretim: makinede operatör varsa (ya da oyuncu kendisi çalışırsa)
//                 HER GECE eklenen üretim. Operatörsüz makine üretmez.
//  Asıl oyun tasarımı burada: her "kolay" seçeneğin bir bedeli olsun.
//
//  konsol: odanın etkileşimli konsol tasarımı (ui.js → konsolHtml)
//    ana     : odanın hesabını tuttuğu kaynak (ihtiyaç / üretim / net sayaçları)
//    oda     : sağdaki canlı görsel (sayac | tank | saksi | yigin)
//    gorsel  : isteğe bağlı konsol arka planı public/assets/konsol-<gorsel>.png
//    moduller: eylemler[i] ile aynı sırada fiziksel kontroller
//      tip   : kol | cark | salter | dugme | vana | kartus (CSS ile çizilir)
//      gorsel: isteğe bağlı public/assets/modul-<gorsel>.png (yoksa ikon)
// =============================================================

export const PANELLER = {
  enerji: {
    baslik: 'Enerji Kontrol Paneli',
    makine: { ad: 'Enerji', ikon: '⚡', uretim: { enerji: +6 } },
    kod: 'ENERJİ_01',
    tema: '#f2b33d',
    aciklama: 'Güneş panelleri, rüzgar türbini ve yedek dizel jeneratör. Jeneratör hızlıdır ama havayı kirletir.',
    gosterge: ['enerji', 'karbon'],
    konsol: {
      ana: 'enerji', oda: 'sayac', gorsel: 'enerji',
      moduller: [
        { tip: 'kol', ikon: '☀️', kisa: 'Güneş panelleri', fiil: 'Temizle', gorsel: 'gunes', etiketX: 57 },
        { tip: 'cark', ikon: '🌀', kisa: 'Rüzgar türbini', fiil: 'Onar', gorsel: 'ruzgar', etiketX: 53 },
        { tip: 'salter', ikon: '⛽', kisa: 'Dizel jeneratör', fiil: 'Çalıştır', gorsel: 'dizel', etiketX: 63 },
      ],
    },
    eylemler: [
      { ad: 'Güneş panellerini temizle', etki: { enerji: +20 }, mesaj: 'Paneller pırıl pırıl.', bilgi: 'gunes' },
      { ad: 'Rüzgar türbinini onar', etki: { enerji: +12, atik: +5 }, mesaj: 'Türbin yeniden dönüyor.', bilgi: 'ruzgar' },
      { ad: 'Dizel jeneratörü çalıştır', etki: { enerji: +35, karbon: +18 }, kirli: true, mesaj: 'Jeneratör gürültüyle çalıştı. Hava ağırlaştı.', bilgi: 'fosil' },
    ],
  },
  su: {
    baslik: 'Su Arıtma Sistemi',
    makine: { ad: 'Su Arıtma', ikon: '💧', uretim: { su: +5 } },
    kod: 'HİDRO_02',
    tema: '#4fc3f7',
    aciklama: 'Gri suyu ve yağmur suyunu arıtır. Tam güç modu çok enerji yer.',
    gosterge: ['su', 'enerji'],
    konsol: {
      ana: 'su', oda: 'tank', gorsel: 'su',
      moduller: [
        { tip: 'kartus', ikon: '🧴', kisa: 'Filtre kartuşu', fiil: 'Değiştir', gorsel: 'filtre', etiketX: 76 },
        { tip: 'vana', ikon: '🚰', kisa: 'Tam güç pompa', fiil: 'Vanayı aç', gorsel: 'pompa', etiketX: 76 },
      ],
    },
    eylemler: [
      { ad: 'Filtreleri değiştir', etki: { su: +18, atik: +5 }, mesaj: 'Temiz su akmaya başladı.', bilgi: 'tatlisu' },
      { ad: 'Arıtmayı tam güçle çalıştır', etki: { su: +30, enerji: -15 }, mesaj: 'Tanklar hızla doluyor.', bilgi: 'suenerji' },
    ],
  },
  sera: {
    baslik: 'Sera',
    makine: { ad: 'Sera', ikon: '🌾', uretim: { gida: +5 } },
    kod: 'BİYO_03',
    tema: '#7ed957',
    aciklama: 'Yeşilvadi\'nin besin kaynağı. Bitkiler su ister ama karbonu da azaltır.',
    gosterge: ['gida', 'su', 'karbon'],
    konsol: {
      ana: 'gida', oda: 'saksi', gorsel: 'sera',
      moduller: [
        { tip: 'vana', ikon: '💧', kisa: 'Sulama hattı', fiil: 'Sula', gorsel: 'sulama', etiketX: 53 },
        { tip: 'kol', ikon: '🪱', kisa: 'Kompost', fiil: 'Ekle', gorsel: 'kompost', etiketX: 53 },
        { tip: 'dugme', ikon: '🌱', kisa: 'Fidan', fiil: 'Dik', gorsel: 'fidan', etiketX: 52 },
      ],
    },
    eylemler: [
      { ad: 'Serayı sula', etki: { gida: +20, su: -10 }, mesaj: 'Yapraklar canlandı.', bilgi: 'sulama' },
      { ad: 'Kompost ekle', etki: { gida: +12, atik: -12 }, mesaj: 'Organik atık toprağa döndü.', bilgi: 'metan' },
      { ad: 'Fidan dik', etki: { karbon: -15, su: -6 }, mesaj: 'Küçük bir ağaç, büyük bir umut.', bilgi: 'agac' },
    ],
  },
  geriDonusum: {
    baslik: 'Geri Dönüşüm İstasyonu',
    makine: { ad: 'Geri Dönüşüm', ikon: '♻️', uretim: { atik: -5 } },
    kod: 'DÖNÜŞ_04',
    tema: '#ff8a3d',
    aciklama: 'Atıkları ayrıştır ya da yak. Yakmak hızlıdır ve biraz enerji verir, ama karbon salar.',
    gosterge: ['atik', 'karbon'],
    konsol: {
      ana: 'atik', oda: 'yigin', gorsel: 'geri',
      moduller: [
        { tip: 'kol', ikon: '🗂️', kisa: 'Ayrıştırma bandı', fiil: 'Ayrıştır', gorsel: 'ayristir', etiketX: 63 },
        { tip: 'cark', ikon: '🔧', kisa: 'Onarım tezgâhı', fiil: 'Onar', gorsel: 'onar', etiketX: 50 },
        { tip: 'salter', ikon: '🔥', kisa: 'Yakma fırını', fiil: 'Yak', gorsel: 'yak', etiketX: 66 },
      ],
    },
    eylemler: [
      { ad: 'Atıkları ayrıştır', geriKazanim: 6, etki: { atik: -20 }, mesaj: 'Cam, plastik, metal: her şey yerli yerinde.', bilgi: 'plastik' },
      { ad: 'Malzemeleri onarıp yeniden kullan', geriKazanim: 3, etki: { atik: -10, enerji: +5 }, mesaj: 'Eski parçalar yeni işe yaradı.', bilgi: 'hiyerarsi' },
      { ad: 'Atıkları yak', etki: { atik: -35, enerji: +8, karbon: +15 }, kirli: true, mesaj: 'Atık gitti, duman kaldı.', bilgi: 'yakma' },
    ],
  },
};
